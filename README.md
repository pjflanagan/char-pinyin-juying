
# Mandarin Tools

These are a few pages with helpful tools for learning mandarin.

## Study

To add a flashcard set follow these steps:

1. Write a `data/flashcards.csv` file with the phrases you want, you can omit english and pinyin
2. Run `scripts/refine-flashcard.py "setName"` on your new set to update missing data and convert to traditional 
  - Flashcards are refined in place to limit the usage of the google translate api
3. Add a link to see your flashcards on web or run `print-flashcard.py "setName"` to generate printable flashcards

## Repository Setup

This repo is made up of a few parts.
- `data` - input/output data
  - `flashcards` - csv's containing flashcards
  - `maps`
  - `source`
- `page` - public pages, these are apps for typing and doing flashcards
- `print` - printable pdfs of flashcards
- `scripts` - creates our dictionary, flashcards, and any maps needed
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
