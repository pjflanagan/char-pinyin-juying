
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
    success: function (data) {
      console.log(data);
      DICTIONARY = data;
    }
  });
}

function focusInputEnd() {
  console.log('focusInputEnd');
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
  renderCursorAtCharacter(characterElement, side);
  e.stopPropagation();
}

function onChange() {
  console.log()
}

function onKeyDown() {

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

function renderCursorAtCharacter(elem, side) {
  if (side === 'left') {
    $("#cursor").insertBefore(elem);
  } else {
    $("#cursor").insertAfter(elem);
  }
}

function renderText() {
  const text = $('#hidden-input').text();
  const hanzi = SELECT_MANDARIN_REGEX.exec(text);
  console.log(hanzi);
}

// onload

(function () {
  loadCSV();
})();

