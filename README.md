
# Mandarin Tools

These are a few pages with helpful tools for learning mandarin.

- `pronunciation`: To be used when reading new words, copy and paste phrases into here to see the pronunciation in both pinyin and zhuyin
as well as character by character english definitions. This version displays only the most common pronunciation and tone, sometimes pronunciation and tone change based on the nearby characters. For example, "了" will always be "le", and never "liao."
- `zhuyin-flashcards`: To be used to help increase zhuyin reading speed
- `flashcards`: To be used to help recognize words

## Develop

### Repository Setup

This repo is made up of a few parts.
- `scripts` creates our dictionary, any changes to how the dictionary would be done in here
  - `data` source dictionaries and generated maps, these are pretty messy
  - `util` utility functions
- `data` output dictionary and any other data, this should be kept clean
- `lib` minified libraries
- `src` shared source code for theme styles and utils
- `resource` this is the bulk of it, where we will actually build little apps for studying

### Build the Dictionary

```
$ python3 -m pip install -r requirements.txt
$ python3 ./scripts/make-*.py
```

### Serve the webpage

```
$ python3 -m http.server
```

### Sources / Reference
- https://github.com/guoyunhe/pinyin-json
- https://github.com/tsroten/dragonmapper/blob/main/src/dragonmapper/data/transcriptions.csv
- Get the pinyin from here: https://github.com/guoyunhe/pinyin-json/blob/master/hanzi-pinyin-table.json
