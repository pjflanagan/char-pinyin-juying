document.getElementById('home-link').href = getBaseUrl();

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
        cellEl.className = `grid-cell ${cell.c}`;

        const zhuyinEl = document.createElement('div');
        zhuyinEl.className = 'cell-zhuyin';
        zhuyinEl.textContent = cell.z;

        const englishEl = document.createElement('div');
        englishEl.className = 'cell-english';
        englishEl.textContent = cell.e;

        cellEl.appendChild(zhuyinEl);
        cellEl.appendChild(englishEl);
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
