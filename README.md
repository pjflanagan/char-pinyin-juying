
# Mandarin Tools

These are a few pages with helpful tools for learning mandarin.

## Repository Setup

This repo is made up of a few parts.
- `data` - input/output data
  - `flashcards` - csv's containing complete information
  - `maps`
  - `sets` - csv's that get turned into flashcards
  - `source`
- `page` - public pages, these are apps for typing and doing flashcards
- `print` - printable pdfs of flashcards
- `scripts` - creates our dictionary, flashcards, and any maps needed
  - `util` - utility functions
- `src` - shared source code for theme styles and utils for the pages
  - `lib` minified libraries
  - `img` public images

## Process

### Add Data

`sets` are csv files that are processed into flashcards
They do NOT need an `english` definition or `pinyin`, unless you want to
override the values returned by google.

```
phrase,english,pinyin
```

`flashcards` are processed sets that contain a phrase and the english
definition of that phrase. It can also contain pinyin if it is not
simply the default pinyin.

```
phrase,english,pinyin,zhuyin,tone
```

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
