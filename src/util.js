
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
  const pathBase = window.location.host.includes('flanny.app') ? '/study-mandarin/' : '/';
  return window.location.protocol + '//' + window.location.host + pathBase;
}

async function loadCSV(callback) {
  fetch(`${getBaseUrl()}data/dictionary.csv`)
    .then(response => response.text())
    .then(v => Papa.parse(v, {
      header: true,
      complete: (result) => {
        DICTIONARY = result.data;
        callback();
      }
    }))
    .catch(err => console.error(err))
}

function findEntry(hanzi) {
  return DICTIONARY.find(entry => entry.hanzi === hanzi);
}

function getTone(tone) {
  return TONE_MAP[typeof tone === 'number' ? tone : parseInt(tone)];
}
