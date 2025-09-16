
// TODO: TODO: TODO: remove this and just pass in new const to the basic flashcards

// const

const FLASHCARD_STORAGE_KEY = 'flanny-sm-reddit-flashcards';

// global and state

let DICTIONARY = [];
let BASIC_FLASHCARDS = [];
let ALL_FLASHCARDS = [];

let isHidden = true;
let currentIndex = 0;

// helpers

function shuffle() {
  BASIC_FLASHCARDS = BASIC_FLASHCARDS.sort(() => Math.random() - 0.5);
  currentIndex = 0;
  display(BASIC_FLASHCARDS[currentIndex]);
  hide();
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

function reset() {
  Storage.remove(FLASHCARD_STORAGE_KEY);
  window.location.reload();
}

// DISPLAY

function hide() {
  $('.zhuyin-holder').each(function() {
    $(this).addClass('hidden');
  });
  $('.pinyin').each(function() {
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
  $('.pinyin').each(function() {
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
  $('#count').text(`${currentIndex + 1} / ${BASIC_FLASHCARDS.length}`);
  $('#known-button').text(`Known (${ALL_FLASHCARDS.length - BASIC_FLASHCARDS.length})`);
  $('#english').text(entry.english);
  $('#google-translate').attr('href', `https://translate.google.com?sl=zh-TW&tl=en&text=${entry.phrase}&op=translate`);
}

// MAIN

(async function () {

  // load data
  const storageFlashcards = Storage.load(FLASHCARD_STORAGE_KEY);
  const [dictionary, allFlashcards] = await Promise.all([
    loadCsv('data/dictionary'),
    loadCsv('data/reddit-flashcards')
  ]);
  DICTIONARY = dictionary;
  ALL_FLASHCARDS = allFlashcards;

  // decide which flashcards to use
  if (storageFlashcards && storageFlashcards.length > 0) {
    BASIC_FLASHCARDS = storageFlashcards;
  } else {
    BASIC_FLASHCARDS = ALL_FLASHCARDS;
  }

  // shuffle and display first card
  shuffle();
})();
