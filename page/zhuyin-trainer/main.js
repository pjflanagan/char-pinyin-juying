
// global and state

let DICTIONARY = [];

let isHidden = true;
let currentIndex = 0;

// helpers


function next() {
  currentIndex = Math.floor(Math.random() * DICTIONARY.length);
  display(DICTIONARY[currentIndex].trad);
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

// DISPLAY

function hide() {
  $('.character .hanzi').each(function () {
    $(this).addClass('hidden');
  });
  $('.pinyin').each(function () {
    $(this).addClass('hidden');
  });
  $('#reveal-or-next-button').text('Reveal');
  isHidden = true;
}

function reveal() {
  $('.character .hanzi').each(function () {
    $(this).removeClass('hidden');
  });
  $('.pinyin').each(function () {
    $(this).removeClass('hidden');
  });
  $('#reveal-or-next-button').text('Next');
  isHidden = false;
}

function display(text) {
  $('#display-characters').children('.character').remove();
  for (let i = 0; i < text.length; ++i) {
    const html = getCharacterHtml(DICTIONARY, text[i], i);
    $('#display-characters').append(html);
  }
}

// MAIN

(async function () {
  const dictionary = await loadCsv('data/dictionary');
  const seen = new Set();
  DICTIONARY = dictionary.filter(entry => {
    if (!entry.trad || !entry.zhuyin || !entry.pinyin) return false;
    const key = `${entry.zhuyin}-${entry.tone}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  next();
})();
