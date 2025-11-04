
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

function getBaseUrl() {
  const pathBase = window.location.host.includes('flanny.app') ? '/study-mandarin/' : '/';
  return window.location.protocol + '//' + window.location.host + pathBase;
}

async function loadCsv(file) {
  const response = await fetch(`${getBaseUrl()}${file}.csv`);
  const data = await response.text();
  try {
    return new Promise((resolve) => {
      Papa.parse(data, {
        header: true,
        complete: (result) => {
          resolve(result.data);
        }
      });

    });
  } catch (err) {
    console.error(err);
  }
}

function findEntry(dictionary, hanzi) {
  return dictionary.find(entry => entry.hanzi === hanzi);
}

function getTone(tone) {
  return TONE_MAP[typeof tone === 'number' ? tone : parseInt(tone)];
}


// ---------------------------------------------------------------------------
// COMMON COMPONENTS ---------------------------------------------------------
// ---------------------------------------------------------------------------

function getCharacterHtml(dictionary, char, i) {
  const isHanzi = !!char.match(IS_MANDARIN_REGEX);
  let html;
  if (isHanzi) {
    const entry = findEntry(dictionary, char);
    if (entry) {
      html = renderHanziCharacter({
        index: i,
        // always convert to traditional
        hanzi: entry.trad || char,
        pinyin: entry.pinyin || '',
        zhuyin: entry.zhuyin || '',
        tone: parseInt(entry.tone) || 0
      });
    }
  }
  if (!html) {
    html = renderNonHanziCharacter(i, char);
  }
  return html;
}

function renderNonHanziCharacter(index, char) {
  return `
      <div class="character non-hanzi" data-index=${index}>
        <div class="hitbox-holder">
          <div class="hitbox" data-hitbox="left" onclick="focusInputAt(event);"></div>
          <div class="hitbox" data-hitbox="right" onclick="focusInputAt(event);"></div>
        </div>
        <div class="highlight"></div>
        <div class="text">${char}</div>
      </div>
  `;
}

function renderHanziCharacter({ index, hanzi, pinyin, zhuyin, tone }) {
  const displayTone = tone === 5 ? '' : getTone(tone);
  const fifthTone = tone === 5 ? getTone(tone) : '';
  return `
      <div class="character hanzi" data-index=${index}>
        <div class="hitbox-holder">
          <div class="hitbox" data-hitbox="left" onclick="focusInputAt(event);"></div>
          <div class="hitbox" data-hitbox="right" onclick="focusInputAt(event);"></div>
        </div>
        <div class="highlight"></div>
        <div class="hanzi no-pointer">${hanzi}</div>
        <div class="pinyin no-pointer">${pinyin}</div>
        <div class="zhuyin-holder no-pointer">
          <div class="zhuyin">${fifthTone}${zhuyin}
            <div class="tone">${displayTone}</div>
          </div>
        </div>
      </div>
`
}

// ---------------------------------------------------------------------------
// StorageUtil ---------------------------------------------------------------
// ---------------------------------------------------------------------------

const StorageUtil = {
  save: function (storageKey, data) {
    window.localStorage.setItem(
      storageKey, JSON.stringify(data)
    );
  },
  load: function (storageKey) {
    const data = window.localStorage.getItem(storageKey);
    try {
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      console.error('Error parsing local storage data');
    }
    return undefined;
  },
  remove: function (storageKey) {
    window.localStorage.removeItem(storageKey);
  }
}

// ---------------------------------------------------------------------------
// COLOR ---------------------------------------------------------------------
// ---------------------------------------------------------------------------

function getRandomHue() {
  return Math.floor(Math.random() * 360);
}

function getHslColor(hue, sat, light, alpha) {
  return `hsla(${hue}deg, ${sat}%, ${light}%, ${alpha})`;
}

// ---------------------------------------------------------------------------
// REDIRECT ------------------------------------------------------------------
// ---------------------------------------------------------------------------


function getIsMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function getDeviceOS() {
  if (/Android/.test(navigator.userAgent)) {
    return "android";
  } else if (/iPhone|iPhase|iPod/.test(navigator.userAgent)) {
    return "ios";
  }
  return "unknown";
}


function handleRedirect({ web, ios, android }) {
  console.log('handling redirect', { web, ios, android });
  // 1) if this is not a mobile device, redirect to the webpage
  if (!getIsMobile()) {
    window.open(web, '_blank').focus();
    return;
  }

  // 2) get the OS, if unknown redirect to page, otherwise determine which url to use
  const os = getDeviceOS();
  let appUrl = "";
  switch (os) {
    case "ios":
      appUrl = ios;
      break;
    case "android":
      appUrl = android;
      break;
    case "unknown":
    default:
      window.open(web, '_blank').focus();
      return;
  }

  // 3) attempt to open the app, this will create a popup, add a listener for if the page is refocused to open the webpage instead
  window.open(appUrl, '_blank').focus();
}

// ---------------------------------------------------------------------------
// COMMON UI -----------------------------------------------------------------
// ---------------------------------------------------------------------------

window.onload = function () {
  $('#home-link').attr('href', getBaseUrl());

  $('a').each(function () {
    const web = $(this).attr('data-web');
    const ios = $(this).attr('data-ios');
    const android = $(this).attr('data-android');

    if (web && ios && android) {
      $(this).on('click', function () {
        handleRedirect({ web, ios, android });
      });
      $(this).css({
        textDecoration: 'underline',
        cursor: 'pointer'
      });
    }
  })
}
