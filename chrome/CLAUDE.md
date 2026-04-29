# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Chrome extension (Manifest V2) that overrides the new tab page to display a random Chinese character/word from a vocabulary set the user has studied. The user selects their current lesson progress via a dropdown, and the extension filters words to only show ones from lessons they've reached.

## Building and loading

```bash
make zip   # creates out/src.zip from the src/ directory
```

To test locally: load `src/` as an unpacked extension in Chrome via `chrome://extensions` → "Load unpacked".

## Architecture

All extension logic lives in `src/`:

- **`manifest.json`** — declares newtab override (`index.html`) and `storage` permission
- **`index.html`** — single page; loads jQuery, then data files, then `main.js`
- **`main.js`** — three phases: (1) load saved `lessonIdx` from `chrome.storage.sync`, (2) filter `WORDS` to those with `lesson <= currentLessonIdx`, pick a random one, (3) render to DOM and populate the lesson dropdown
- **`data/words.js`** — exports global `WORDS` array; each entry has `{ word, english, pinyin, lesson }` where `lesson` is a numeric ID
- **`data/lessons.js`** — exports global `LESSONS` array; each entry has `{ title, idx }` where `idx` matches the `lesson` field in words
- **`package/jquery.min.js`** — vendored jQuery (no build system, no npm)

The lesson `idx` values are non-contiguous integers (12, 21, 22, 32, …) that come from the original Duolingo API structure. `DEFAULT_LESSON_IDX = 12` (first lesson).

Clicking the character opens Google Translate for that word. The lesson dropdown persists selection to `chrome.storage.sync`.

There is no build step, no transpilation, and no test suite — the extension runs directly from `src/`.
