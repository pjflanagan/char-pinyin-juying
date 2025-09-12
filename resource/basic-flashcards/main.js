// GLOBALS

let BASIC_FLASHCARDS;

// GET RANDOM ENTRY

function getRandomEntry() {

}

// LISTENERS

function shuffle() {
  display(getRandomEntry());
}

// DISPLAY

function display(entry) {
  $('#google-translate').click(() => {
    window.open(`https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=${entry.word}`, '_blank', 'noreferrer');
  });
}

// MAIN

(async function () {
  DICTIONARY = await loadCsv('data/dictionary');
  BASIC_FLASHCARDS = await loadCsv('data/basic-flashcard');
  shuffle();
})();

