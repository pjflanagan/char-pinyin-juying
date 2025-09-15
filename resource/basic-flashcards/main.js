// const

const FLASHCARD_STORAGE_KEY = 'flanny-sm-basic-flashcards';

// global and state

let DICTIONARY = [];
let BASIC_FLASHCARDS = undefined;

let isHidden = true;
let currentIndex = 0;

// helpers

function shuffle() {
  BASIC_FLASHCARDS = BASIC_FLASHCARDS.sort(() => Math.random() - 0.5);
  currentIndex = 0;
  display(BASIC_FLASHCARDS[currentIndex]);
}

function next() {
  currentIndex = (currentIndex + 1) % BASIC_FLASHCARDS.length;
  display(BASIC_FLASHCARDS[currentIndex]);
  hide();
}

// listeners

function revealOrNext() {
  if (isHidden) {
    reveal();
  } else {
    next();
  }
}

function markAsKnown() {
  BASIC_FLASHCARDS.splice(currentIndex, 1);
  Storage.save(FLASHCARD_STORAGE_KEY, BASIC_FLASHCARDS);
  next();
}

// DISPLAY

function hide() {
  $('.zhuyin-holder').each(function() {
    $(this).addClass('hidden');
  });
  $('#english').addClass('hidden');
  $('#reveal-or-next-button').text('Reveal');
  isHidden = true;
}

function reveal() {
  $('.zhuyin-holder').each(function() {
    $(this).removeClass('hidden');
  });
  $('#english').removeClass('hidden');
  $('#reveal-or-next-button').text('Next');
  isHidden = false;
}

function renderText(text) {
  $('#display-characters').children('.character').remove();
  for (let i = 0; i < text.length; ++i) {
    const html = getCharacterHtml(DICTIONARY, text[i], i);
    $('#display-characters').append(html);
  }
}

function display(entry) {
  renderText(entry.phrase);
  $('#english').text(entry.english);
  $('#google-translate').attr('href', `https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=${entry.phrase}`);
}

// MAIN

(async function () {
  BASIC_FLASHCARDS = Storage.load(FLASHCARD_STORAGE_KEY);
  DICTIONARY = await loadCsv('data/dictionary');
  if (!BASIC_FLASHCARDS) {
    BASIC_FLASHCARDS1 = await loadCsv('data/basic-flashcards');
  }
  shuffle();
})();
