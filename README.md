
# Mandarin Tools

<img width="611" height="293" alt="Screenshot 2025-09-30 at 10 59 36 AM" src="https://github.com/user-attachments/assets/69494c53-f459-442d-bd82-e3f2c3ed0a98" />

These are a few pages with helpful tools for learning mandarin.

## Study

To add and study a flashcard set follow these steps:

### 1. Write flashcards

If you are writing a single set (for lyrics to a song, or names of towns), make a new file for that set `data/flashcards/set/<path-to-setName>.csv`

If you are writing a unit made of multiple sets (for things like verbs or dishes), write in the most recent `data/flashcards/unit/<unitName>/<unitName>-<unitIndex>.csv` file with the phrases you want.

When making flashcards you can omit english and pinyin if you want.

### 2. Refine flashcards

If you are writing a single set
```bash
$ scripts/refine.py set <path-to-setName>
$ scripts/refine.py set songs/wu_bai_norweigan_forest
``` 

If you are writing a unit with multiple sets
```bash
$ scripts/refine.py unit <unitName>
$ scripts/refine.py unit verbs
```

This will update missing data, remove duplicates, convert to traditional, and break into sub sets for 30. Flashcards are refined in place to limit the usage of the Google Translate API.

### 3. Use flashcards

Add a link to see your flashcards in `page/flashcards/index.html` on web. Or you can print your flashcards

If you are printing a single set
```bash
$ scripts/print.py set <path-to-setName>
$ scripts/print.py set songs/wu_bai_norweigan_forest
``` 

If you are printing one set in a unit, run print with a `<unitIndex>`
```bash
$ scripts/print.py unit <unitName> <unitIndex>
$ scripts/print.py unit verbs 2
```


## Repository Setup

This repo is made up of a few parts.
- `data` - input/output data
  - `flashcards` - csv's containing flashcards
    - `unit`
    - `set`
  - `maps`
  - `source`
- `page` - public pages, these are apps for typing and doing flashcards
- `print` - printable pdfs of flashcards
    - `unit`
    - `set`
- `scripts` - refine and print flashcards, 
  - `setup` - creates our dictionary, mappings, and extracts flashcards from found datasets
  - `util` - utility functions
- `src` - shared source code for theme styles and utils for the pages
  - `lib` minified libraries
  - `img` public images

## Develop

Serve the webpage using:

```
$ python3 -m http.server
```

### Sources / Reference
- https://github.com/guoyunhe/pinyin-json
- https://github.com/tsroten/dragonmapper/blob/main/src/dragonmapper/data/transcriptions.csv
- Get the pinyin from here: https://github.com/guoyunhe/pinyin-json/blob/master/hanzi-pinyin-table.json
