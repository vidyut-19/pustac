fo# Pustac Phase 1 Development Plan

## Background and Motivation

Building Pustac - a stupid-fast, distraction-free, typesetting-obsessed document editor. Phase 1 focuses on establishing the core editor feel with Lexical, focus/typewriter modes, and minimalist UI shell.

**North Star Goals:**
- 0s to type: first keystroke <100 ms after load, initial JS <900 KB
- Focus by default: no left sidebar, no chrome/UI unless summoned
- "Print-quality on screen": micro-typography where the web allows
- Configurable, not complicated: simple prefs for most; safe plugin API for nerds

## Current State Analysis

**What we have:**
- ✅ Monorepo structure with pnpm workspaces
- ✅ Basic Vite + Preact + Tailwind setup in `apps/web`
- ✅ Core dependencies already installed: Lexical, Yjs, Dexie, FlexSearch, Zod
- ✅ Package structure: `@pustac/ui`, `@pustac/editor`, `@pustac/storage`, etc.
- ✅ Basic App.tsx with placeholder UI

**What's missing:**
- ❌ No actual Lexical editor implementation
- ❌ No focus/typewriter modes
- ❌ No typography controls
- ❌ No markdown import/export
- ❌ No storage layer implementation
- ❌ Empty package implementations

## Key Challenges and Analysis

1. **Performance First**: Must maintain <100ms first keystroke, <900KB initial bundle
2. **Lexical Integration**: Need to set up Lexical with custom nodes and plugins in `@pustac/editor` package
3. **Typography System**: Inter font + Hack Nerd Font for icons, variable fonts, hyphenation, micro-typography controls
4. **Focus Modes**: Paragraph focus with subtle vignette/dim effect (typewriter mode deferred)
5. **Storage Layer**: IndexedDB with Dexie for offline-first experience
6. **Lazy Loading**: Lexical features loaded on-demand to minimize TTFB and initial load

## High-level Task Breakdown

### A1: Lexical Editor Foundation
- [ ] Set up Lexical editor in `@pustac/editor` package with basic nodes (paragraph, heading, list, blockquote)
- [ ] Implement lazy loading for Lexical features (tables, rich-text, etc.)
- [ ] Create editor state management with Preact signals
- [ ] Set up Inter font + Hack Nerd Font for icons
- **Success Criteria**: Basic editor renders, can type, supports basic formatting, loads fast

### A2: Focus Mode (Paragraph Focus Only)
- [ ] Implement paragraph focus mode with subtle vignette/dim effect
- [ ] Add minimal chrome UI (hide/show on demand)
- [ ] Create focus mode toggle (⌘.)
- [ ] Ensure smooth transitions and subtle visual effects
- **Success Criteria**: Focus mode works smoothly with subtle dimming, UI is minimal by default

### A3: Typography Panel & Controls
- [ ] Create typography panel with Inter variable font controls
- [ ] Implement hyphenation system with proper lang tags
- [ ] Add micro-typography controls (ligatures, optical sizing, etc.)
- [ ] Set up custom CSS + Tailwind hybrid approach for design flexibility
- [ ] Implement font-feature-settings for advanced typography
- **Success Criteria**: Typography panel functional, Inter variable fonts working, standout design

### A4: Selection Minibar
- [ ] Create floating minibar that appears on text selection
- [ ] Add basic formatting controls (bold, italic, code)
- [ ] Implement typography toggles in minibar
- [ ] Auto-hide minibar on blur
- **Success Criteria**: Minibar appears/disappears smoothly, formatting works

### A5: Markdown Import/Export
- [ ] Implement markdown to Lexical conversion
- [ ] Implement Lexical to markdown conversion
- [ ] Add file import/export UI
- [ ] Test round-trip conversion
- **Success Criteria**: Can import/export markdown files cleanly

### A6: Storage & Autosave
- [ ] Set up Dexie database schema
- [ ] Implement autosave functionality
- [ ] Create versioned document format
- [ ] Add offline detection
- **Success Criteria**: Documents auto-save, work offline

## Dependencies to Add

**Already installed (good!):**
- `lexical` + `@lexical/react` + `@lexical/table`
- `yjs` (for future collaboration)
- `dexie` (for IndexedDB storage)
- `flexsearch` (for search)
- `zod` (for validation)

**Need to add:**
- `@lexical/markdown` (for markdown support)
- `@lexical/rich-text` (for rich text features) - lazy loaded
- `@lexical/list` (for lists) - lazy loaded
- `@lexical/code` (for code blocks) - lazy loaded
- `@lexical/link` (for links) - lazy loaded
- `@lexical/selection` (for selection utilities)
- `@lexical/utils` (for utilities)

**Fonts to add:**
- Inter variable font (Google Fonts)
- Hack Nerd Font (for icons, lightweight alternative to SVGs)

## Natural Stopping Point

**Phase 1 Complete when:**
1. ✅ Basic Lexical editor with all core nodes working (in `@pustac/editor`)
2. ✅ Paragraph focus mode with subtle vignette effect
3. ✅ Typography panel with Inter variable font controls
4. ✅ Selection minibar with formatting
5. ✅ Markdown import/export working
6. ✅ Autosave to IndexedDB
7. ✅ Bundle size < 900KB (with lazy loading)
8. ✅ First keystroke < 100ms
9. ✅ Standout design with custom CSS + Tailwind hybrid

This gives us a solid foundation for Phase 2 (serious tooling: footnotes, figures, command palette, PDF export).

## Project Status Board

- [ ] A1: Lexical Editor Foundation (in `@pustac/editor` package)
- [ ] A2: Paragraph Focus Mode (subtle vignette effect)
- [ ] A3: Typography Panel & Controls (Inter + custom CSS)
- [ ] A4: Selection Minibar
- [ ] A5: Markdown Import/Export
- [ ] A6: Storage & Autosave

## Current Status / Progress Tracking

**Status**: Ready to begin Phase 1 implementation
**Next Action**: Start with A1 - Lexical Editor Foundation

## Executor's Feedback or Assistance Requests

*This section will be updated by the Executor as work progresses*

## Lessons

*This section will be updated with learnings and solutions as we encounter issues*