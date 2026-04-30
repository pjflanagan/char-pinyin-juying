document.getElementById('home-link').href = getBaseUrl();

const AUDIO_BASE = 'https://www.mdnkids.com/BoPoMo/audio/';

const ZHUYIN_AUDIO = {
  'ㄅ': '01', 'ㄆ': '02', 'ㄇ': '03', 'ㄈ': '04',
  'ㄉ': '05', 'ㄊ': '06', 'ㄋ': '07', 'ㄌ': '08',
  'ㄍ': '09', 'ㄎ': '10', 'ㄏ': '11',
  'ㄐ': '12', 'ㄑ': '13', 'ㄒ': '14',
  'ㄓ': '15', 'ㄔ': '16', 'ㄕ': '17', 'ㄖ': '18',
  'ㄗ': '19', 'ㄘ': '20', 'ㄙ': '21',
  'ㄚ': '22', 'ㄛ': '23', 'ㄜ': '24', 'ㄝ': '25',
  'ㄞ': '26', 'ㄟ': '27', 'ㄠ': '28', 'ㄡ': '29',
  'ㄢ': '30', 'ㄣ': '31', 'ㄤ': '32', 'ㄥ': '33', 
  // these are at the end in the source files
  'ㄦ': '34', 'ㄧ': '35', 'ㄨ': '36', 'ㄩ': '37',
};

function playZhuyin(zhuyin) {
  const index = ZHUYIN_AUDIO[zhuyin];
  if (!index) return;
  const audio = new Audio(`${AUDIO_BASE}${index}.mp3`);
  audio.play();
}

async function init() {
  const res = await fetch(getBaseUrl() + 'data/zhuyin-chart.json');
  const rows = await res.json();

  const grid = document.getElementById('grid');

  for (const row of rows) {
    const rowEl = document.createElement('div');
    rowEl.className = 'grid-row';

    for (const cell of row) {
      const cellEl = document.createElement('div');

      if (cell === null) {
        cellEl.className = 'grid-cell empty';
      } else {
        cellEl.className = 'grid-cell';

        if (cell.z) {
          const zhuyinEl = document.createElement('div');
          zhuyinEl.className = 'cell-zhuyin';
          zhuyinEl.textContent = cell.z;

          const englishEl = document.createElement('div');
          englishEl.className = 'cell-english';
          englishEl.textContent = cell.e;

          cellEl.appendChild(zhuyinEl);
          cellEl.appendChild(englishEl);
          cellEl.addEventListener('click', () => playZhuyin(cell.z));
          cellEl.style.cursor = 'pointer';
        }
      }

      rowEl.appendChild(cellEl);
    }

    grid.appendChild(rowEl);
  }
}

init();

function toggleEnglish() {
  const hidden = document.getElementById('grid').classList.toggle('hide-english');
  document.getElementById('toggle-english').textContent = hidden ? 'Show English' : 'Hide English';
}
