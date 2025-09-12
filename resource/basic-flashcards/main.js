// GLOBALS

let DICTIONARY = [];
let BASIC_FLASHCARDS = [];

// GET RANDOM ENTRY

function getRandomEntry() {
  return BASIC_FLASHCARDS[Math.floor(Math.random() * BASIC_FLASHCARDS.length)];
}

// LISTENERS

function shuffle() {
  display(getRandomEntry());
}

// DISPLAY

function renderText(text) {
  $('#display-characters').children('.character').remove();
  for (let i = 0; i < text.length; ++i) {
    const html = getCharacterHtml(DICTIONARY, text[i], i);
    $('#display-characters').append(html);
  }
}

function display(entry) {
  console.log(entry);
  renderText(entry.phrase);
  $('#english').text(entry.english);
  $('#google-translate').click(() => {
    window.open(`https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=${entry.phrase}`, '_blank', 'noreferrer');
  });
}

// MAIN

(async function () {
  DICTIONARY = await loadCsv('data/dictionary');
  BASIC_FLASHCARDS = await loadCsv('data/basic-flashcards');
  shuffle();
})();

