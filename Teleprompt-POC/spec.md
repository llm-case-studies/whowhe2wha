# Teleprompter POC Specification

## Goal
Build a browser-based teleprompter inspired by WhoWhe2Wha’s timeline UI: a focused reading pane plus “big picture” strips that show where you are in the overall script. The first iteration should be a React SPA (Vite + TypeScript). We also want the architecture to be reusable inside a browser extension so the same components can overlay other pages later.

## Core Features (SPA)
1. **Script Input**
   - Paste text or upload a `.txt/.md` file.
   - Split script into sections (e.g., blank lines or `##` headings) to drive the big-picture strips.
2. **Main Reading Pane**
   - Large, high-contrast text with adjustable font size.
   - Highlight current sentence/paragraph; show subtle cues for upcoming lines.
   - Manual scroll + optional auto-scroll (keyboard controls).
3. **Big-Picture Strips**
   - Two thin horizontal strips (e.g., “Section overview” and “Full script”).
   - Display progress as a sliding window similar to WhoWhe’s quarter/year rulers.
   - Show markers for major sections or cues (e.g., “Demo”, “CTA”).
4. **Pacing Indicators**
   - Optional timer showing elapsed time vs planned time for the current section.
5. **Settings Panel**
   - Font size, theme (light/dark), scroll speed, show/hide strips.

## Architecture Notes
- Use React + TypeScript + Vite.
- Organize components so the reading pane/strips can be consumed by a browser extension later (e.g., export `PromptViewer` component).
- Keep state management simple (React Context or Zustand) for script data and playback state.
- Include placeholders/hooks for future features:
  - Voice-following (speech-to-text alignment).
  - AI assistance (LLM suggestions, script analysis).

## Extension Reuse (Future)
- Document how the SPA components could be packaged inside a Chrome/Edge extension (content script injecting `PromptViewer`).
- Note any CSP considerations for embedding fonts or speech APIs.

## Demo Content
- Include a `demo-script.md` file with a short sample (e.g., YC founder pitch). Preload it on first run so testers see the layout without typing.

## Deliverables
- SPA with home screen, script editor/import, reading UI, and settings.
- README describing setup, build, and future extension plan.
- Code should be clean, documented, and easy to hand off.
