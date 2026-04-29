
async function loadResources() {
  const response = await fetch(getBaseUrl() + 'data/resources.json');
  const data = await response.json();
  renderVideos(data.videos);
  renderPodcasts(data.podcasts);
  renderApps(data.apps);
  renderOther(data.other);
  applyNeonStyles();
}

function renderVideos(videos) {
  const container = $('#videos-container');
  for (const group of videos) {
    let html = `<div style="min-width: 340px"><p class="heading">${group.category}</p><ul>`;
    for (const item of group.items) {
      html += `<li><a href="${item.url}" target="_blank">${item.name}</a></li>`;
    }
    html += '</ul></div>';
    container.append(html);
  }
}

function renderPodcasts(podcasts) {
  const container = $('#podcasts-container');
  let html = '<ul>';
  for (const item of podcasts) {
    html += `<li><a href="${item.url}" target="_blank">${item.name}</a>`;
    if (item.description) html += ` - <span style="color: #999">${item.description}</span>`;
    html += '</li>';
  }
  html += '</ul>';
  container.append(html);
}

function renderApps(apps) {
  const container = $('#apps-container');
  let html = '<ul>';
  for (const item of apps) {
    const strikeStyle = item.strikethrough ? ' style="text-decoration: line-through; color: #666"' : '';
    html += `<li${strikeStyle}>`;
    if (item.web) {
      html += `<a data-web="${item.web}" data-ios="${item.ios}" data-android="${item.android}">${item.name}</a>`;
    } else {
      html += item.name;
    }
    if (item.description) html += ` - <span style="color: #999">${item.description}</span>`;
    html += '</li>';
  }
  html += '</ul>';
  container.append(html);

  container.find('a[data-web]').each(function () {
    const web = $(this).attr('data-web');
    const ios = $(this).attr('data-ios');
    const android = $(this).attr('data-android');
    $(this).on('click', () => handleRedirect({ web, ios, android }));
    $(this).css({ textDecoration: 'underline', cursor: 'pointer' });
  });
}

function renderOther(other) {
  const container = $('#other-container');
  let html = '<ul>';
  for (const item of other) {
    html += '<li>';
    if (item.url) {
      html += `<a href="${item.url}" target="_blank">${item.name}</a>`;
    } else {
      html += item.name;
    }
    if (item.description) html += ` - <span style="color: #999">${item.description}</span>`;
    html += '</li>';
  }
  html += '</ul>';
  container.append(html);
}

loadResources();
