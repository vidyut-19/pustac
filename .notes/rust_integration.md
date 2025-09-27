Short answer: Rust can make your word processor meaningfully faster in a few **compute-heavy, DOM-independent** spots (and opens the door to a great desktop build). But a full “Rust bottom-up” rewrite for a browser editor is overkill and often slower due to WASM↔DOM crossing. The sweet spot is **TS/DOM for UI + Rust/WASM for pure functions**.

Here’s the decision framework + concrete places Rust shines (and how to wire it in).

# When Rust is a real win (use WASM)

Use Rust for modules that:

* run on **big blobs of text/data**,
* don’t touch the DOM,
* benefit from SIMD / tight loops,
* can batch work to **minimize JS↔WASM boundary calls**.

**Great candidates (now):**

1. **Hyphenation & line-break analysis**

   * Rust crates: `hyphenation`, `unicode-linebreak`.
   * Runs in a Worker; returns soft hyphen positions or break opportunities for a paragraph at a time.
2. **Spellchecking** with large dictionaries

   * Rust + `fst`/`levenshtein_automata` over compressed lexicons → fast fuzzy lookup.
   * Keep dict in WASM memory; query in chunks.
3. **CRDT core** (if you want collab later)

   * `yrs` (Yjs in Rust) via wasm bindings = very fast ops and compact updates.
   * JS keeps UI; Rust holds the doc state/ops.
4. **Typeset-quality PDF**

   * **Typst** is Rust. Use `typst.ts` (WASM) for client export or a tiny Rust server for heavy exports.
   * Map your semantic nodes → Typst templates.
5. **Search/index across many docs** (later)

   * `tantivy` → WASM for local, private, full-text search.
   * Overkill for a single doc; perfect if you grow into a library.

**Borderline / usually not worth it in v1:**

* Inline transforms (smart quotes, em-dashes) → JS is trivial and zero overhead.
* “Semantic command” NLU → regex + flexsearch in JS is already instant.
* Custom layout/paint engines → browsers already do shaping/AA with HarfBuzz; a canvas text engine is a multi-month detour.

# Don’t build the whole thing in Rust (for the web)

* **DOM is king** for text selection, IME, accessibility, copy/paste. WASM can’t touch DOM directly; you’ll spend time marshalling strings and positions.
* The “editor engine in Rust” path only makes sense if you’re making a **canvas-based editor** (like a DTP app). That’s a different product.

# Do build a **desktop shell** in Rust (Tauri) later

* Reuse your web UI; Tauri gives you: system font access/enumeration, file I/O, clipboard, global shortcuts, native menus, and great perf with tiny binaries.
* This is where Rust truly shines without fighting the browser.

---

# Practical plan: hybrid TS + Rust/WASM

## 0) Tooling quickstart

```bash
# Rust + wasm
curl https://sh.rustup.rs -sSf | sh
rustup target add wasm32-unknown-unknown
cargo install wasm-pack

# JS side
pnpm add -w vite vite-plugin-wasm vite-plugin-top-level-await
```

Add to `apps/web/vite.config.ts`:

```ts
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
export default { plugins: [wasm(), topLevelAwait()] };
```

## 1) Hyphenation in Rust (WASM worker)

```
packages/wasm-hyph/
├─ src/lib.rs
├─ Cargo.toml
```

**Cargo.toml**

```toml
[package]
name = "wasm_hyph"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
hyphenation = "0.8"
unicode-linebreak = "0.1"
once_cell = "1"

[features]
default = []
```

**src/lib.rs**

```rust
use wasm_bindgen::prelude::*;
use hyphenation::{Standard, Load, Hyphenator};
use once_cell::sync::OnceCell;

static EN_US: OnceCell<Standard> = OnceCell::new();

#[wasm_bindgen]
pub fn init_en() {
    // Embed or lazy-load patterns; for MVP, embed small ones
    let dict = Standard::from_embedded(hyphenation::Language::EnglishUS).unwrap();
    EN_US.set(dict).ok();
}

#[wasm_bindgen]
pub fn hyphen_points(s: &str) -> Box<[u16]> {
    let dict = EN_US.get().expect("call init_en first");
    // Return indices where soft hyphens are allowed
    let mut pts: Vec<u16> = Vec::new();
    for (offset, _) in s.char_indices() {
        if dict.hyphenate(s).breaks().contains(&offset) {
            if offset <= u16::MAX as usize { pts.push(offset as u16); }
        }
    }
    pts.into_boxed_slice()
}
```

Build:

```bash
cd packages/wasm-hyph
wasm-pack build --target web --release
```

Worker wrapper `packages/workers/hyphWorker.ts`:

```ts
// inside a Web Worker
// @ts-ignore
import init, { init_en, hyphen_points } from "@pkg/wasm-hyph/pkg/wasm_hyph.js";

let ready: Promise<void> | null = null;
self.onmessage = async (e) => {
  const { id, text } = e.data;
  if (!ready) { await init(); init_en(); ready = Promise.resolve(); }
  // Batch: one paragraph at a time to reduce crossings
  const points = hyphen_points(text);
  // Copy out of WASM heap into JS-typed array before posting
  self.postMessage({ id, points: Array.from(points) });
};
```

Use from editor (debounced per reflow):

```ts
const worker = new Worker(new URL("@pkg/workers/hyphWorker.ts", import.meta.url), { type: "module" });
function getHyphens(text: string): Promise<number[]> {
  return new Promise(res => {
    const id = crypto.randomUUID();
    const handler = (e: MessageEvent) => { if (e.data.id === id) { worker.removeEventListener("message", handler); res(e.data.points); } };
    worker.addEventListener("message", handler);
    worker.postMessage({ id, text });
  });
}
```

## 2) Spellcheck in Rust (optional)

* Crates: `fst`, `levenshtein_automata`, `bincode` for compact dicts.
* Load dictionary once in WASM; expose `suggest(word) -> Vec<String>`; call per token batch.

## 3) CRDT core in Rust (later)

* Use `yrs` with wasm: Rust owns the Y document; JS listens to update events to reflect changes in Lexical.
* Benefit: faster merges, smaller updates for long sessions.

## 4) Typst export (client or tiny server)

* **Client**: `typst.ts` WASM. Map your semantic AST → `.typ` template; run compile in a Worker; stream the PDF.
* **Server (faster, simpler)**: tiny Rust service with `typst` crate; accept JSON AST, return PDF. Keep it optional; default to client Paged.js.

---

# Integration gotchas (so Rust doesn’t become gimmicky)

* **Amortize boundaries**: pass big strings/arrays once; don’t call WASM per word/keystroke. Batch per paragraph or per “idle 200ms”.
* **Use Workers**: keep WASM off the main thread to avoid jank.
* **Binary data**: pass `Uint8Array`/`SharedArrayBuffer` (if COOP/COEP enabled).
* **Bundle size**: keep each WASM module < ~300–500 KB gz. Lazy-load on first use.
* **Fallbacks**: if WASM fails, JS path should still work (just slower).

---

# How this maps to your v1 goals

1. **Stupid-fast**: JS for UI + Worker-backed Rust for hyphenation/spellcheck keeps typing latency crisp.
2. **Distraction-free**: No change—Rust runs off-thread.
3. **Typesetting-obsessed**: Hyphenation + future Typst export is where Rust shines.
4. **Power-user-hackable**: Keep the plugin API in JS. If you want, add a “**WASM plugin**” capability later for advanced users who can drop a `.wasm` with a tiny manifest.

---

## If you *did* want a Rust-first stack (why/when)

* Choose this only if you’re building a **canvas renderer** or a **desktop-first editor**.
* Stack: Rust (text model with `ropey`), incremental layout, shaping (`rustybuzz`), render via `wgpu`/Skia (with Tauri for desktop).
* It’s a different product class—insanely powerful, long runway, not necessary for your web v1.

---

# TL;DR recommendation

* **Web v1**: TS/Preact/Lexical for all UI + editing. Add **Rust/WASM for hyphenation now**, spellcheck later, **Typst export** when you want print-perfect PDFs.
* **Desktop v2**: Wrap in **Tauri** to get system fonts/FS and still reuse everything.

If you want, I can drop a ready-to-build `packages/wasm-hyph` into your repo and wire the call sites (plus a tiny perf test to prove it beats a JS implementation on long paragraphs).
