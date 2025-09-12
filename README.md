
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
  - `data` source dictionaries and generated maps
- `pages` these are public webpages with tools that use the dictionary
  - `data` output dictionary
  - `lib` minified libraries
  - `src` shared source code for theme styles and utils
  - `resource` this is the bulk of it, where we will actually build little apps for studying

### Build the Dictionary

```
$ cd scripts
$ python3 -m pip install -r requirements.txt
$ python3 ./make-*.py
```

### Serve the webpage

```
$ cd public
$ python3 -m http.server
```

## Notes and sources
- Link to soundboard https://www.mdnkids.com/BoPoMo/
- https://github.com/guoyunhe/pinyin-json
- https://github.com/tsroten/dragonmapper/blob/main/src/dragonmapper/data/transcriptions.csv
- Get the pinyin from here: https://github.com/guoyunhe/pinyin-json/blob/master/hanzi-pinyin-table.json
