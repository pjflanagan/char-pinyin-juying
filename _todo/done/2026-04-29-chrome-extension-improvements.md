

# Chrome Extension


Make Chrome extension source from MY flashcard data

- The chrome extension will have to expect a new data shape
- The data should remain in the data folder, that is our source of truth
  - perhaps the zip command can copy the flashcards in at "runtime"

### Implementation plan

The extension fetches flashcard CSVs directly from the live GitHub Pages site (`https://pjflanagan.github.io/study-mandarin/`) at new-tab load time. No build step or bundled data files needed — the website is the source of truth.

#### 1. `manifest.json`

Add `host_permissions` for the GitHub Pages domain (required by MV3 for cross-origin `fetch`):
```json
"host_permissions": ["https://pjflanagan.github.io/*"]
```

#### 2. Remove bundled data files

Delete `chrome/src/data/words.js` and `chrome/src/data/lessons.js` — these are replaced by live fetches.

#### 3. `main.js` rewrite

- **`CLASS_SETS`**: hardcoded list of class names (adjectives, basics, dining, dishes, foods, kitchen, phrases, time, verbs). These map directly to `data/flashcards/class/<name>/` on the site.
- **Fetch**: for each class, fetch `<name>-1.csv`, `<name>-2.csv`, … stopping at the first 404. Classes are fetched in parallel; sub-files sequentially within each class. This avoids unnecessary 404 requests while still parallelizing across classes.
- **CSV parsing**: inline parser handles quoted fields (needed for english definitions that contain commas).
- **Dropdown**: "All" + one entry per class. Selection persisted via `chrome.storage.sync` under key `selectedSet`.
- **Word shape**: `{ phrase, english, pinyin, set }` where `set` is the class name.

#### 4. `index.html`

Remove `<script>` tags for `lessons.js` and `words.js`. No other structural changes — existing `#dropdown`, `#character`, `#pinyin`, `#english`, `#lesson` elements are reused.

