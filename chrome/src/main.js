
const BASE_URL = 'https://pjflanagan.github.io/study-mandarin/';
const DEFAULT_SET = 'all';

const CLASS_SETS = [
  'adjectives', 'basics', 'dining', 'dishes',
  'foods', 'kitchen', 'phrases', 'time', 'verbs'
];

const SET_OPTIONS = [
  { label: 'All', value: 'all' },
  ...CLASS_SETS.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))
];

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

async function fetchClassWords(className) {
  const words = [];
  for (let i = 1; i <= 30; i++) {
    const url = `${BASE_URL}data/flashcards/class/${className}/${className}-${i}.csv`;
    let response;
    try {
      response = await fetch(url);
    } catch {
      break;
    }
    if (!response.ok) break;
    const text = await response.text();
    words.push(...parseCsv(text).map(entry => ({ ...entry, set: className })));
  }
  return words;
}

async function loadWords(selectedSet) {
  const classNames = selectedSet === 'all' ? CLASS_SETS : [selectedSet];
  const wordArrays = await Promise.all(classNames.map(fetchClassWords));
  return wordArrays.flat();
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
  SET_OPTIONS.forEach(({ label, value }) => {
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
  const data = await new Promise(resolve => chrome.storage.sync.get('selectedSet', resolve));
  const selectedSet = data.selectedSet || DEFAULT_SET;

  buildDropdown(selectedSet);

  const words = await loadWords(selectedSet);
  if (words.length) {
    updateCard(words[Math.floor(Math.random() * words.length)]);
  }

  $('#splash').addClass('hidden');
})();
