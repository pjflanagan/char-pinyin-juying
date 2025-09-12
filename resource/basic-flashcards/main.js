// global and state

let DICTIONARY = [];
let BASIC_FLASHCARDS = [];

let isHidden = true;

// listeners

function shuffle() {
  const newEntry = BASIC_FLASHCARDS[Math.floor(Math.random() * BASIC_FLASHCARDS.length)];
  display(newEntry);
}

function next() {
  shuffle();
  hide();
}

function revealOrNext() {
  if (isHidden) {
    reveal();
  } else {
    next();
  }
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
  DICTIONARY = await loadCsv('data/dictionary');
  BASIC_FLASHCARDS = await loadCsv('data/basic-flashcards');
  next();
})();

