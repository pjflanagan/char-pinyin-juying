const SONGS = [
  'wei_bird_if_i_could',
  'wu_bai_norweigan_forest',
  'wu_bai_reunited',
];

const MODES = [
  { label: 'Hide Pinyin', lyricClass: '' },
  { label: 'Show Pinyin', lyricClass: 'show-pinyin' },
  { label: 'Show Both',   lyricClass: 'show-both' },
];

class KaraokePage {
  constructor() {
    this.mode = 0;
    this.songMeta = {};
  }

  async init() {
    await Promise.all(SONGS.map(key => this.loadMeta(key)));
    this.renderModal();
  }

  formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  async loadMeta(key) {
    try {
      const resp = await fetch(`${getBaseUrl()}data/songs/${key}.json`);
      if (resp.ok) {
        this.songMeta[key] = await resp.json();
        return;
      }
    } catch {}
    this.songMeta[key] = { title: this.formatKey(key) };
  }

  renderModal() {
    const items = SONGS.map(key => {
      const { title, artist } = this.songMeta[key];
      const label = artist ? `${title} — ${artist}` : title;
      return `<li><a onclick="karaokePage.chooseSong('${key}')">${label}</a></li>`;
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
    const { title, artist, spotify_url } = this.songMeta[key];

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
      .map(line => `
        <div class="lyric-line ${line.color || ''}">
          <div class="lyric-hanzi">${line.phrase}</div>
          <div class="lyric-pinyin">${line.pinyin || ''}</div>
          <div class="lyric-english">${line.english || ''}</div>
        </div>
      `).join('');
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
