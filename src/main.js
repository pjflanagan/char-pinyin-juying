
// ---------------------------------------------------------------------------
// Constants -----------------------------------------------------------------
// ---------------------------------------------------------------------------

const IS_MANDARIN_REGEX = /[\p{Script=Han}]/u;

const TONE_MAP = [
  '',   // 0 -> not a real tone
  '',   // 1 -> flat
  'ˊ',  // 2 -> neutral
  'ˇ',  // 3 -> dip
  'ˋ',  // 4 -> falling
  '˙'   // 5 -> neutral
];

// ---------------------------------------------------------------------------
// Dictionary ----------------------------------------------------------------
// ---------------------------------------------------------------------------

let DICTIONARY;

function getBaseUrl() {
  return window.location.protocol + '//' + window.location.host + window.location.pathname
}

async function loadCSV() {
  fetch(`${getBaseUrl()}/data/dictionary.csv`)
    .then(response => response.text())
    .then(v => Papa.parse(v, {
      header: true,
      complete: (result) => {
        DICTIONARY = result.data;
        renderInputText();
      }
    }))
    .catch(err => console.error(err))
}

function findEntry(hanzi) {
  return DICTIONARY.find(entry => entry.hanziTraditional === hanzi || entry.hanziSimplified === hanzi);
}

function getTone(tone) {
  return TONE_MAP[typeof tone === 'number' ? tone : parseInt(tone)];
}

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
  renderCursorAtInputCursorPosition()
}

function handleToggleVisibility(type) {
  $(`.${type}`).toggle();
}

// TODO: display the selection highlight over the selected characters
function getSelection() {
  const input = $('#hidden-input')[0]; // Get the DOM element from the jQuery object

  if (input) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
  }
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

function renderCursorAtInputCursorPosition() {
  const input = $('#hidden-input')[0];
  const cursorIndex = input.selectionStart;
  const characterElements = $('.character');
  if (cursorIndex >= characterElements.length) {
    renderCursorAtEnd();
  }
  renderCursorAtCharacterElement(characterElements[cursorIndex], 'left')
}

// Characters

function renderNonHanziCharacter(index, char) {
  return `
      <div class="character non-hanzi" data-index=${index}>
        <div class="hitbox-holder">
          <div class="hitbox" data-hitbox="left" onclick="focusInputAt(event);"></div>
          <div class="hitbox" data-hitbox="right" onclick="focusInputAt(event);"></div>
        </div>
        <div class="text">${char}</div>
      </div>
  `;
}

function renderHanziCharacter({ index, hanzi, pinyin, zhuyin, tone }) {
  return `
      <div class="character hanzi" data-index=${index}>
        <div class="hitbox-holder">
          <div class="hitbox" data-hitbox="left" onclick="focusInputAt(event);"></div>
          <div class="hitbox" data-hitbox="right" onclick="focusInputAt(event);"></div>
        </div>
        <div class="hanzi no-pointer">${hanzi}</div>
        <div class="pinyin no-pointer">${pinyin}</div>
        <div class="zhuyin-holder no-pointer">
          <div class="zhuyin">
            ${zhuyin}
            <div class="tone">${tone}</div>
          </div>
        </div>
      </div>
`
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
    const char = text[i];
    const isHanzi = !!char.match(IS_MANDARIN_REGEX);
    let html;
    if (isHanzi) {
      const entry = findEntry(char);
      if (entry) {
        html = renderHanziCharacter({
          index: i,
          // always convert to traditional
          hanzi: entry.hanziTraditional || char,
          pinyin: entry.pinyin || '',
          zhuyin: entry.zhuyin || '',
          tone: getTone(entry.tone || 0)
        });
      }
    }
    if (!html) {
      html = renderNonHanziCharacter(i, char);
    }
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

(function () {
  checkDebugParam();
  loadCSV();
})();

