const BASE_URL = 'https://pjflanagan.github.io/study-mandarin/';
const DEFAULT_SET = 'all';

// Loaded from data/flashcard-sets.json at runtime
let SETS_MANIFEST = {};
let wordsList = [];
let currentEntry = null;
let isHidden = true;

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
// Display & Flow -------------------------------------------------------------
// ---------------------------------------------------------------------------

function updateCard(entry) {
  currentEntry = entry;
  
  $('#character').text(entry.phrase);
  $('#pinyin').text(entry.pinyin);
  $('#english').text(entry.english);
  $('#lesson').text(entry.set || '');
  
  // Set translation link
  const translateUrl = `https://translate.google.com?sl=zh-TW&tl=en&text=${encodeURIComponent(entry.phrase)}&op=translate`;
  $('#google-translate').attr('href', translateUrl);

  // Set color card styling
  $('#container').removeClass();
  if (entry.color) {
    $('#container').addClass(entry.color);
  } else {
    $('#container').addClass('gray');
  }

  hideCardDetails();
}

function hideCardDetails() {
  isHidden = true;
  $('#pinyin').addClass('hidden');
  $('#english').addClass('hidden');
  $('#lesson').addClass('hidden');
  $('#reveal-or-next-button').text('Reveal');
}

function revealCardDetails() {
  isHidden = false;
  $('#pinyin').removeClass('hidden');
  $('#english').removeClass('hidden');
  $('#lesson').removeClass('hidden');
  $('#reveal-or-next-button').text('Next');
}

function handleRevealOrNext() {
  if (isHidden) {
    revealCardDetails();
  } else {
    nextWord();
  }
}

function nextWord() {
  if (wordsList && wordsList.length > 0) {
    if (wordsList.length === 1) {
      updateCard(wordsList[0]);
      return;
    }
    let entry = null;
    do {
      entry = wordsList[Math.floor(Math.random() * wordsList.length)];
    } while (currentEntry && entry.phrase === currentEntry.phrase);
    
    updateCard(entry);
  }
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
    wordsList = await loadWords(newSet);
    nextWord();
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

  wordsList = await loadWords(selectedSet);
  nextWord();

  // Attach handlers
  $('#container').off('click').on('click', () => {
    handleRevealOrNext();
  });

  $('#reveal-or-next-button').off('click').on('click', (e) => {
    e.stopPropagation();
    handleRevealOrNext();
  });

  $('#splash').addClass('hidden');
})();
