
Pustac will always be
(1) stupid-fast
(2) distraction-free
(3) typesetting-obsessed
(4) power-user-hackable—without asking users to learn a new LaTeX clone.

### North Star
0s to type: first keystroke <100 ms after load, initial JS <900 KB.

Focus by default: no left sidebar, no chrome/UI unless summoned.

“Print-quality on screen”: micro-typography where the web allows; pristine PDF export when needed.

Configurable, not complicated: simple prefs for most; a safe plugin API + text config for nerds.

### Stack 

Editor engine: Lexical (fast, predictable, excellent composition).
Alt: ProseMirror (if you prefer schema-first + TipTap ecosystem).

Rendering: DOM + CSS (for speed/AA/selection), Canvas only for rare “exact” preview (optional).

Collab: Yjs CRDT (optional, lazy-loaded).

Offline: Service Worker + IndexedDB (Dexie).

Export:

“Good” PDF with Paged.js / Vivliostyle (CSS paged media).

“Great” PDF via server microservice using Typst (no LaTeX authoring; just export).

Math/Citations (optional modules): KaTeX + citeproc-js (CSL JSON).

Plugin sandbox: ESM + Capability-scoped API (JS by default; optional Lua via WASM later).

Build: Vite/ESBuild + Preact (or Svelte) for tiny bundles.

UI Blueprint (what you see)

Canvas (center, full-bleed)

Clean page, variable line-length (55–75 chars default).

Typewriter mode and focus line/paragraph halo.

True WYSIWYM: semantic blocks (Heading, Paragraph, Figure, Footnote, Equation, Callout).

Soft Command Bar (top, ultra-subtle; appears on ⌘K or mouse-edge)

One omnibox: “/figure”, “/equation”, “Set page to 66ch”, “Export PDF”, “Focus mode on”.

“Brain tabs”: tiny chips for Context, Structure, Output; never a persistent sidebar.

Inline Minibar (on selection; disappears on blur)

Typographic controls only: family, size, weight, optical sizing, ligatures, numeric style, small caps, superscripts, footnote.

Outline Ribbon (right edge, optional, press ⌘\ )

One-column outline + jump. Collapses automatically in focus mode.

Zen Details

Soft caret, natural key repeat, gentle page easing, zero scroll jank (content-visibility + virtualized blocks).

### Typesetting 

* Variable fonts with font-optical-sizing:auto, font-kerning:normal, font-variant-ligatures: common-contextual discretionary, font-variant-numeric: oldstyle-nums proportional-nums slashed-zero, font-feature-settings:"onum","liga","clig","calt","ss01".

* Hyphenation: hyphens:auto + correct lang tags; hyphenation dictionaries loaded per-language.

* Justification: default ragged-right; optional text-wrap: balance for titles; soft letter-spacing guards to avoid rivers.

* Line grid: baseline-snap headings and captions for harmony (CSS custom properties).

* High-DPI polish: detect devicePixelRatio; adjust text-rendering: optimizeLegibility and fallback when it hurts perf.

Figure & caption system: consistent spacing, auto numbering, cross-refs.

Math: KaTeX in inline/blocks with optical-size-friendly fonts.

“Serious writing” features (without LaTeX vibes)

Footnotes, endnotes, cross-refs (stable anchors).

Citations: paste DOI/URL → fetch metadata → cite with CSL style; live bibliography block.

Track changes + comments (CRDT-backed, per-range).

Markdown/Docx import; clean HTML/Markdown/Docx/ePub export.

Research drawer (hidden by default): temporary references you can pin into the doc (never a permanent sidebar).

Performance tactics

Fragment virtualization for long docs (render what’s near the viewport).

Web Workers for spellcheck, hyphenation, citation formatting.

On-demand modules (math, references, export) via dynamic import.

Idle-time precomputation: kerning tables, hyphenation patterns, print styles.

Plugin & Config (power without pain)

For most users: Preferences panel (Fonts, Line length, Ligatures, Theme, Keybindings).
For power users: a plain-text writer.toml + minimal JS plugin API.

Example:

toml```
writer.toml

[typography]
font_body = "Source Serif 4"
font_ui = "Inter"
line_length_ch = 66
ligatures = "common,discretionary"
optical_sizing = true

[editor]
focus_mode = "paragraph"
typewriter = true
show_outline = false

[keys]
toggle_focus = "Cmd+."
command_palette = "Cmd+K"
```

Plugin skeleton (JS ESM)

export default function register(api) {
  const { editor, commands, selection, ui } = api.capabilities();
  commands.register("smartenQuotes", () => editor.transformText(s => s.replace(/"(.+?)"/g, '“$1”')));
  ui.addCommandPaletteItem({ id:"smarten", title:"Smarten Quotes", run:"smartenQuotes" });
}


Plugins run in a sandboxed Worker; they cannot exfiltrate doc data unless granted storage/network capability by the user.

Optional Lua later via WASM for people who love a Vim-ish config, but JS keeps it universal.

Data model & file format

Internal: JSON doc tree (Lexical/PM nodes) + “semantic decorations” (citations, footnotes).

On disk: zipped bundle: document.json, assets/, meta.json, refs.json.
Round-trip cleanly to Markdown (GFM + footnotes + front-matter) for longevity.

Collaboration & sync (optional; still light)

Yjs doc + awareness → WebRTC first; fallback to tiny relay.

Conflict-free changes; local-first authoring (no account needed to write).

Build order (ship small, ship beautiful)

Week 1 – Core feel

Lexical + focus/ typewriter + minimalist UI shell.

Typography panel with variable-font controls & hyphenation.

Instant Markdown import/export.

Week 2 – Serious tooling

Footnotes, figure+caption, cross-refs.

Command palette + inline minibar.

Paged.js PDF export (great enough for manuscripts).

Week 3 – Science & power

KaTeX block/inline + citation block with CSL.

writer.toml prefs; plugin sandbox + one sample plugin.

Optional Yjs collab (behind a toggle).

Week 4 – Polish

Outline ribbon, tracked changes/comments.

Typst export microservice for “print-perfect” PDFs.

Performance pass (virtualization, workers, idle tasks).

Security & keys

No API key needed to write.

If you add AI assists later (summaries, rephrase), LLM keys live server-side only; client calls a signed route with doc fragments (never the whole doc unless user consents). Cap tokens per request to keep things snappy and private.

What will make this “feel better than Docs”

Zero chrome until you ask (no Obsidian-style sidebar clutter).

Micro-typography defaults that typography nerds notice immediately.

“Command palette everything” instead of menu spelunking.

Gorgeous, NYT-level charts and page geometry only when you need them (and invisible otherwise).

A config path that respects both Rick Rubin and the Emacs lifer.