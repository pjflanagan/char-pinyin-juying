
const SELECT_MANDARIN_REGEX = /[\p{Han}]/gm;

const TONE_MAP = [
  '',   // 0 -> not a real tone
  '',   // 1 -> flat
  'ˊ',  // 2 -> neutral
  'ˇ',  // 3 -> dip
  'ˋ',  // 4 -> falling
  '˙'   // 5 -> neutral
];

let DICTIONARY;

function loadCSV() {
  $.ajax({
    type: "GET",
    url: "./data/dictionary.csv",
    dataType: "csv",
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    },
    success: function (data) {
      console.log(data);
      DICTIONARY = data;
    }
  });
}

// event handlers

function focusInputEnd() {
  const input = $('#hidden-input');
  input.focus();
  input[0].selectionStart = input[0].selectionEnd = input.val().length;
  renderCursorAtEnd();
}

// focuses the input at a specific character
function focusInputAt(e) {
  const characterElement = $(e.target).parents('.character')[0]
  const index = characterElement.getAttribute('data-index');
  const side = e.target.getAttribute('data-hitbox');
  const delta = side === 'left' ? 0 : 1;
  const input = $('#hidden-input');
  input.focus();
  input[0].selectionStart = input[0].selectionEnd = index + delta;
  renderCursorAtCharacterElement(characterElement, side);
  e.stopPropagation();
}

function handleInput(e) {
  renderText(e.target.value);
}

function handleKeyDown(e) {
  // TODO: if it is an arrow key, move the cursor
}

// Gets the position of the cursor
function getSelection() {
  var input = $('#hidden-input')[0]; // Get the DOM element from the jQuery object

  if (input) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
  }
}

// Render methods

function renderCursorAtEnd() {
  $("#cursor").insertBefore('#hidden-input');
}

function renderCursorAtCharacterElement(elem, side) {
  if (side === 'left') {
    $("#cursor").insertBefore(elem);
  } else {
    $("#cursor").insertAfter(elem);
  }
}

function renderCursorAtCharacterIndex(index) {

}

function renderText(text) {  
  for (let i = 0; i < text.length; ++i) {
    // if it is hanzi, then print it with a little display
    // if it is not hanzi, then display it in an english character
    const char = text[i];
    // const hanzi = SELECT_MANDARIN_REGEX.exec(text);
    console.log(char);
  }
}

// onload

(function () {
  loadCSV();
})();

