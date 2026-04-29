
const BASE_URL = 'https://pjflanagan.github.io/study-mandarin/';
const DEFAULT_SET = 'all';

// Loaded from data/flashcard-sets.json at runtime
let SETS_MANIFEST = {};

// ---------------------------------------------------------------------------
// CSV parsing ----------------------------------------------------------------
// ---------------------------------------------------------------------------

function parseCsv(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);
    return Object.fromEntries(headers.map((h, i) => [h, (fields[i] || '').trim()]));
  }).filter(entry => entry.phrase);
}

// ---------------------------------------------------------------------------
// Fetch ----------------------------------------------------------------------
// ---------------------------------------------------------------------------

async function fetchSetsManifest() {
  const response = await fetch(`${BASE_URL}data/flashcard-sets.json`);
  return response.json();
}

async function loadWords(selectedSet) {
  const classNames = selectedSet === 'all' ? Object.keys(SETS_MANIFEST) : [selectedSet];
  const className = classNames[Math.floor(Math.random() * classNames.length)];
  const count = SETS_MANIFEST[className] || 1;
  const index = Math.floor(Math.random() * count) + 1;
  const response = await fetch(`${BASE_URL}data/flashcards/class/${className}/${className}-${index}.csv`);
  const text = await response.text();
  return parseCsv(text).map(entry => ({ ...entry, set: className }));
}

// ---------------------------------------------------------------------------
// Display --------------------------------------------------------------------
// ---------------------------------------------------------------------------

function updateCard(entry) {
  $('#character').text(entry.phrase);
  $('#pinyin').text(entry.pinyin);
  $('#english').text(entry.english);
  $('#lesson').text(entry.set || '');
  $('#container').off('click').on('click', () => {
    window.open(
      `https://translate.google.com?sl=zh-TW&tl=en&text=${encodeURIComponent(entry.phrase)}&op=translate`,
      '_blank'
    );
  });
}

function buildDropdown(selectedSet) {
  const setOptions = [
    { label: 'All', value: 'all' },
    ...Object.keys(SETS_MANIFEST).map(s => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s
    }))
  ];
  setOptions.forEach(({ label, value }) => {
    const selected = value === selectedSet ? 'selected' : '';
    $('#dropdown').append($(`<option ${selected}>`).val(value).html(label));
  });

  $('#dropdown').change(async function () {
    const newSet = $(this).val();
    chrome.storage.sync.set({ selectedSet: newSet });
    const words = await loadWords(newSet);
    if (words.length) updateCard(words[Math.floor(Math.random() * words.length)]);
  });
}

// ---------------------------------------------------------------------------
// Main -----------------------------------------------------------------------
// ---------------------------------------------------------------------------

(async function () {
  const [manifest, storageData] = await Promise.all([
    fetchSetsManifest(),
    new Promise(resolve => chrome.storage.sync.get('selectedSet', resolve))
  ]);
  SETS_MANIFEST = manifest;
  const selectedSet = storageData.selectedSet || DEFAULT_SET;

  buildDropdown(selectedSet);

  const words = await loadWords(selectedSet);
  if (words.length) {
    updateCard(words[Math.floor(Math.random() * words.length)]);
  }

  $('#splash').addClass('hidden');
})();
