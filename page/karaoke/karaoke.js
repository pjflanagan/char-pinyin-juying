function countPinyinSyllables(group) {
  const plain = group.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/-/g, '');
  const initials = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
  let count = 0, i = 0;
  while (i < plain.length) {
    const prev = i;
    count++;
    for (const init of initials) {
      if (plain.startsWith(init, i)) { i += init.length; break; }
    }
    while (i < plain.length && /[aeiouv]/.test(plain[i])) i++;
    if (i < plain.length && plain[i] === 'n') {
      i++;
      if (i < plain.length && plain[i] === 'g') i++;
    } else if (i < plain.length && plain[i] === 'r' && (i + 1 >= plain.length || !/[aeiouv]/.test(plain[i + 1]))) {
      i++;
    }
    if (i === prev) i++;
  }
  return count;
}

function buildWordBlocks(phrase, pinyinStr) {
  const isCJK = ch => /[㐀-鿿豈-﫿]/.test(ch);
  if (!pinyinStr) return [...phrase].map(ch => ({ hanzi: ch, pinyin: '' }));

  const groups = pinyinStr.trim().split(' ');
  const result = [];
  let ci = 0;

  for (const group of groups) {
    // Flush leading non-CJK characters as standalone blocks
    while (ci < phrase.length && !isCJK(phrase[ci])) {
      result.push({ hanzi: phrase[ci], pinyin: '' });
      ci++;
    }
    let sylCount = countPinyinSyllables(group);
    let hanzi = '';
    let consumed = 0;
    while (consumed < sylCount && ci < phrase.length) {
      if (isCJK(phrase[ci])) consumed++;
      hanzi += phrase[ci++];
    }
    if (hanzi) result.push({ hanzi, pinyin: group });
  }
  while (ci < phrase.length) {
    result.push({ hanzi: phrase[ci++], pinyin: '' });
  }
  return result;
}

const MODES = [
  { label: 'Pinyin Off', lyricClass: '' },
  { label: 'Pinyin On',  lyricClass: 'show-pinyin' },
  { label: 'Show All',   lyricClass: 'show-both' },
];

class KaraokePage {
  constructor() {
    this.mode = 0;
    this.songs = [];
  }

  async init() {
    const resp = await fetch(`${getBaseUrl()}data/songs/_songs.json`);
    this.songs = await resp.json();
    this.renderModal();
  }

  renderModal() {
    const items = this.songs.map(song => {
      const label = song.artist ? `${song.title} — ${song.artist}` : song.title;
      return `<li><a onclick="karaokePage.chooseSong('${song.csv}')">${label}</a></li>`;
    }).join('');
    $('#modal-song-list').html(items);
  }

  openModal() {
    $('#lyrics').empty();
    $('#spotify-widget').addClass('hidden').empty();
    $('#song-title').text('');
    $('#modal').removeClass('hidden');
  }

  async chooseSong(key) {
    $('#modal').addClass('hidden');
    const { title, artist, spotify_url } = this.songs.find(s => s.csv === key) || {};

    $('#song-title').text(artist ? `${title} — ${artist}` : title);

    if (spotify_url) {
      const trackId = spotify_url.split('/track/')[1]?.split('?')[0];
      if (trackId) {
        $('#spotify-widget').html(`
          <iframe
            src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator"
            width="100%" height="80" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
        `).removeClass('hidden');
      }
    } else {
      $('#spotify-widget').addClass('hidden');
    }

    const lyrics = await loadCsv(`data/songs/${key}`);
    this.renderLyrics(lyrics);
  }

  renderLyrics(lyrics) {
    const html = lyrics
      .filter(line => line.phrase)
      .map(line => {
        if (line.phrase.startsWith('#')) {
          return `<div class="lyric-section">${line.phrase.slice(1).trim()}</div>`;
        }
        const blocks = buildWordBlocks(line.phrase, line.pinyin);
        const wordsHtml = blocks.map(({ hanzi, pinyin }) =>
          `<div class="lyric-word"><div class="lyric-hanzi">${hanzi}</div><div class="lyric-pinyin">${pinyin}</div></div>`
        ).join('');
        return `
          <div class="lyric-line ${line.color || ''}">
            <div class="lyric-words">${wordsHtml}</div>
            <div class="lyric-english">${line.english || ''}</div>
          </div>
        `;
      }).join('');
    $('#lyrics').html(html);
    this.applyMode();
  }

  applyMode() {
    const { label, lyricClass } = MODES[this.mode];
    $('#lyrics').removeClass('show-pinyin show-both').addClass(lyricClass);
    $('#pinyin-toggle').text(label);
  }

  toggleMode() {
    this.mode = (this.mode + 1) % MODES.length;
    this.applyMode();
  }
}
