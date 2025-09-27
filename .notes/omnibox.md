1) Omnibox = “semantic commands” (no heavy AI required)

Principle: deterministic first, fuzzy second, LLM last (optional/offline).

A. Command registry (single source of truth)
Each command has: id, description, synonyms, argument schema, executor.

// packages/commands/src/registry.ts
import { z } from "zod";
export type CmdCtx = { editor: EditorAPI, ui: UIAPI };

export const Commands = [
  {
    id: "typography.setLineLength",
    desc: "Set line length",
    synonyms: ["line length", "measure", "column width"],
    args: z.object({ value: z.number().min(40).max(100), unit: z.enum(["ch","px"]) }).strict(),
    exec: (ctx: CmdCtx, {value, unit}) => ctx.editor.setLineLength(value, unit)
  },
  {
    id: "view.toggleFocusMode",
    desc: "Toggle focus mode",
    synonyms: ["focus", "zen", "distraction free"],
    args: z.object({ on: z.boolean().optional() }),
    exec: (ctx, {on}) => ctx.ui.toggleFocus(on),
  },
  // …insertEquation, export.pdf, set.font, set.color, add.footnote, etc.
] as const;


B. Lightweight NLU pipeline (all in-browser)

Normalize text (lowercase, strip stopwords).

Entity extraction for numbers/units/colors/fonts using small regex + tables (e.g., /(\d+)\s?(ch|px)/, CSS color names, installed font list).

Intent scoring = BM25/fuzzy match over id+desc+synonyms using flexsearch/minisearch.

Argument mapping via the command’s Zod schema; partials trigger a clarifying chip (e.g., “Did you mean 66ch?”).

Disambiguation only when top-2 scores are close; never modal.

This feels like “semantic” without models. It’s instant, private, and predictable.

C. Optional model assist (kept tiny and offline)

Add a pattern expander using a ~200–400 rule PEG/chevrotain grammar for common phrasings (“make headers blue”, “turn on typewriter mode”, “line length 66 ch”).

If you want embeddings later: run TF-IDF over command corpora + user history (far smaller than MiniLM; no WASM bloat).

D. UX polish

Results list shows command + live arg preview (“Set line length → 66ch”).

Destructive actions (“Clear styles”) require a second ↵ or show an “undo” toast.

Every execution writes a tiny learned synonym map per user (stored in IndexedDB), so “measure” always maps to line length for them.