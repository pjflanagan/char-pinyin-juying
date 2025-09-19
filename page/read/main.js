
let DICTIONARY = [];

// ---------------------------------------------------------------------------
// Event handlers ------------------------------------------------------------
// ---------------------------------------------------------------------------

function focusInputEnd() {
  const input = $('#hidden-input');
  input.focus();
  input[0].selectionStart = input[0].selectionEnd = input.val().length;
  renderCursorAtEnd();
}

// focuses the input at a specific character
function focusInputAt(e) {
  const input = $('#hidden-input');
  const characterElement = $(e.target).parents('.character')[0]
  const index = characterElement.getAttribute('data-index');
  const side = e.target.getAttribute('data-hitbox');
  const delta = side === 'left' ? 0 : 1;
  const cursorPosition = parseInt(index) + delta;
  input.focus();
  input[0].selectionStart = input[0].selectionEnd = cursorPosition;
  renderCursorAtCharacterElement(characterElement, side);
  e.stopPropagation();
}

function handleInput(e) {
  renderText(e.target.value);
}

function handleKeyUp(e) {
  renderHighlighAtSelection();
  renderCursorAtInputCursorPosition()
}

function handleToggleVisibility(type) {
  $(`.${type}`).toggle();
}

// ---------------------------------------------------------------------------
// Render methods ------------------------------------------------------------
// ---------------------------------------------------------------------------

// Cursor

function renderCursorAtEnd() {
  $('#display-characters').append($("#cursor"));
}

function renderCursorAtCharacterElement(elem, side) {
  if (side === 'left') {
    $("#cursor").insertBefore(elem);
  } else {
    $("#cursor").insertAfter(elem);
  }
}

function renderHighlighAtSelection() {
  const input = $('#hidden-input')[0];
  const start = input.selectionStart;
  const end = input.selectionEnd;
  $('.character .highlight').removeClass('selected');

  for (let i = start; i < end; i++) {
    $(`.character[data-index="${i}"] .highlight`).addClass('selected');
  }
}

function renderCursorAtInputCursorPosition() {
  const input = $('#hidden-input')[0];
  const cursorIndex = input.selectionStart;
  const characterElements = $('.character');
  if (cursorIndex >= characterElements.length) {
    renderCursorAtEnd();
  }
  renderCursorAtCharacterElement(characterElements[cursorIndex], 'left')
}

function renderInputText() {
  const text = $('#hidden-input').val();
  if (text && text.length > 0) {
    renderText(text);
  }
}

function renderText(text) {
  $('#display-characters').children('.character').remove();
  for (let i = 0; i < text.length; ++i) {
    const html = getCharacterHtml(DICTIONARY, text[i], i);
    $('#display-characters').append(html);
  }
  renderCursorAtInputCursorPosition();
}

// ---------------------------------------------------------------------------
// Onload --------------------------------------------------------------------
// ---------------------------------------------------------------------------

function checkDebugParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const debug = urlParams.get('debug');
  const text = urlParams.get('text');

  if (!!debug) {
    $('body').addClass('debug');
  }
  if (!!text) {
    $('#hidden-input').val(text);
  }
}

(async function () {
  checkDebugParam();
  DICTIONARY = await loadCsv('data/dictionary');
  renderInputText();
})();

