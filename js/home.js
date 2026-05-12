/* ============================================================
   ES HAPPY TOURS - HOME PAGE INTERACTIONS
   ============================================================ */

(function initHomeHero() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.hero-inner')) return;

  const existingChildren = Array.from(hero.children);
  const logo = hero.querySelector('.hero-logo-wrap');
  const scrollHint = hero.querySelector('.scroll-hint');

  if (logo) logo.remove();
  if (scrollHint) scrollHint.remove();

  const heroInner = document.createElement('div');
  heroInner.className = 'hero-inner';

  const heroCopy = document.createElement('div');
  heroCopy.className = 'hero-copy';

  existingChildren.forEach(child => {
    if (child.isConnected && child !== logo && child !== scrollHint) {
      heroCopy.appendChild(child);
    }
  });

  const sub = heroCopy.querySelector('.hero-sub');
  if (sub) {
    sub.textContent = 'Curated private tours and joiner packages with local guides, clean itineraries, and easy booking support from first message to pickup.';
  }

  const heading = heroCopy.querySelector('h1');
  if (heading) {
    heading.textContent = '';
    heading.append(
      document.createTextNode('Plan a smoother '),
      createEm('Cebu'),
      document.createTextNode(' and '),
      createEm('Bohol'),
      document.createTextNode(' escape.')
    );
  }

  const search = buildHeroSearch();
  const ctas = heroCopy.querySelector('.hero-ctas');
  if (ctas) {
    heroCopy.insertBefore(search, ctas);
  } else {
    heroCopy.appendChild(search);
  }

  heroInner.append(heroCopy, buildHeroVisual());
  hero.replaceChildren(heroInner);
})();

function createEm(text) {
  const em = document.createElement('em');
  em.textContent = text;
  return em;
}

function buildHeroVisual() {
  const visual = document.createElement('div');
  visual.className = 'hero-visual';
  visual.setAttribute('aria-label', 'Featured Cebu and Bohol travel package');

  const card = document.createElement('div');
  card.className = 'hero-image-card';

  const image = document.createElement('img');
  image.src = 'assets/images/moalboal.png';
  image.alt = 'Moalboal island tour with clear blue water';

  const glass = document.createElement('div');
  glass.className = 'hero-card-glass';

  const kicker = document.createElement('span');
  kicker.className = 'hero-card-kicker';
  kicker.textContent = 'Featured Route';

  const title = document.createElement('strong');
  title.textContent = 'Cebu Coast + Bohol Countryside';

  const copy = document.createElement('p');
  copy.textContent = 'Private and joiner options available';

  glass.append(kicker, title, copy);
  card.append(image, glass, buildMiniCard('Pickup', 'Hotel / Airport', 'hero-mini-card-top'), buildMiniCard('Support', 'Fast inquiry reply', 'hero-mini-card-bottom'));
  visual.appendChild(card);
  return visual;
}

function buildMiniCard(label, value, modifierClass) {
  const card = document.createElement('div');
  card.className = `hero-mini-card ${modifierClass}`;

  const labelEl = document.createElement('span');
  labelEl.textContent = label;

  const valueEl = document.createElement('strong');
  valueEl.textContent = value;

  card.append(labelEl, valueEl);
  return card;
}

function buildHeroSearch() {
  const form = document.createElement('form');
  form.className = 'hero-search';
  form.id = 'home-package-search';
  form.setAttribute('role', 'search');
  form.action = 'packages';
  form.method = 'get';
  form.autocomplete = 'off';

  const label = document.createElement('label');
  label.className = 'sr-only';
  label.htmlFor = 'home-search-input';
  label.textContent = 'Search tour packages';

  const box = document.createElement('div');
  box.className = 'hero-search-box';

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('width', '18');
  icon.setAttribute('height', '18');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '2');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '11');
  circle.setAttribute('cy', '11');
  circle.setAttribute('r', '8');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '21');
  line.setAttribute('y1', '21');
  line.setAttribute('x2', '16.65');
  line.setAttribute('y2', '16.65');
  icon.append(circle, line);

  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'home-search-input';
  input.name = 'q';
  input.placeholder = 'Search Cebu City, Moalboal, Oslob, Bohol...';
  input.setAttribute('aria-describedby', 'home-search-help');

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Search';

  const help = document.createElement('p');
  help.className = 'hero-search-help';
  help.id = 'home-search-help';
  help.textContent = 'Try: Private Tour, Joiner Package, Bohol Tour, Cebu Bohol Package';

  const suggestions = document.createElement('div');
  suggestions.className = 'hero-suggestions';
  suggestions.id = 'home-search-suggestions';
  suggestions.setAttribute('aria-label', 'Popular package searches');

  const status = document.createElement('p');
  status.className = 'hero-search-status';
  status.id = 'home-search-status';
  status.setAttribute('aria-live', 'polite');

  const clear = document.createElement('button');
  clear.className = 'hero-clear-search';
  clear.id = 'home-clear-search';
  clear.type = 'button';
  clear.textContent = 'Clear Search';
  clear.hidden = true;

  box.append(icon, input, button);
  form.append(label, box, help, suggestions, status, clear);
  return form;
}

(function initHomePackageSearch() {
  const searchTerms = [
    'Cebu City Tour',
    'Moalboal Tour',
    'Oslob Tour',
    'Bohol Tour',
    'Cebu Bohol Package',
    'Private Tour',
    'Joiner Package'
  ];

  const setup = () => {
    const form = document.getElementById('home-package-search');
    const input = document.getElementById('home-search-input');
    const suggestions = document.getElementById('home-search-suggestions');
    const clear = document.getElementById('home-clear-search');
    if (!form || !input || !suggestions) return;

    searchTerms.forEach(term => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'hero-suggestion';
      chip.textContent = term;
      chip.addEventListener('click', () => {
        input.value = term;
        handleHomeSearch(term);
      });
      suggestions.appendChild(chip);
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      handleHomeSearch(input.value);
    });

    if (clear) {
      clear.addEventListener('click', clearHomeSearch);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();

function handleHomeSearch(rawQuery) {
  const query = rawQuery.trim();
  if (!query) return;

  const cards = Array.from(document.querySelectorAll('.featured-section .searchable-card'));
  const matchedCards = cards.filter(card => cardMatchesSearch(card, query));

  cards.forEach(card => {
    const isMatch = matchedCards.includes(card);
    card.classList.toggle('is-hidden', !isMatch);
    card.classList.toggle('pkg-card-match', isMatch);
  });

  if (matchedCards.length) {
    setHomeSearchStatus(`${matchedCards.length} featured result${matchedCards.length !== 1 ? 's' : ''} for "${query}"`, true);
    const section = document.querySelector('.featured-section');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.location.href = `packages?search=${encodeURIComponent(query)}`;
}

function clearHomeSearch() {
  document.querySelectorAll('.featured-section .searchable-card').forEach(card => {
    card.classList.remove('is-hidden', 'pkg-card-match');
  });
  const input = document.getElementById('home-search-input');
  if (input) input.value = '';
  setHomeSearchStatus('', false);
}

function setHomeSearchStatus(message, active) {
  const status = document.getElementById('home-search-status');
  const clear = document.getElementById('home-clear-search');
  if (status) status.textContent = message;
  if (clear) clear.hidden = !active;
}

function cardMatchesSearch(card, query) {
  const haystack = normalizeSearchText([
    card.dataset.search,
    card.dataset.type,
    card.dataset.dest,
    card.textContent
  ].join(' '));
  const tokens = normalizeSearchText(query).split(' ').filter(Boolean);
  return tokens.every(token => haystack.includes(token));
}

function normalizeSearchText(value) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

(function setupInfiniteMarquee() {
  const track = document.querySelector('.dest-track');
  const strip = document.querySelector('.dest-strip');
  if (!track || !strip) return;

  let resizeTimer;

  const getOriginalCards = () => {
    if (track.marqueeOriginalCards) return track.marqueeOriginalCards;

    const cards = Array.from(track.children).filter(child => child.classList.contains('dest-card'));
    if (!cards.length) return [];

    const midpoint = cards.length % 2 === 0 ? cards.length / 2 : cards.length;
    const firstHalf = cards.slice(0, midpoint);
    const secondHalf = cards.slice(midpoint);
    const hasDuplicateHalf = secondHalf.length === firstHalf.length && firstHalf.every((card, index) => card.isEqualNode(secondHalf[index]));
    const sourceCards = hasDuplicateHalf ? firstHalf : cards;

    track.marqueeOriginalCards = sourceCards.map(card => card.cloneNode(true));
    return track.marqueeOriginalCards;
  };

  const buildGroup = (sourceCards, hidden) => {
    const group = document.createElement('div');
    group.className = 'dest-marquee-group';
    if (hidden) group.setAttribute('aria-hidden', 'true');
    sourceCards.forEach(card => group.appendChild(card.cloneNode(true)));
    return group;
  };

  const render = () => {
    const sourceCards = getOriginalCards();
    if (!sourceCards.length) return;

    track.style.animation = 'none';
    track.replaceChildren(buildGroup(sourceCards, false));

    const originalGroup = track.querySelector('.dest-marquee-group');
    const originalWidth = originalGroup ? originalGroup.getBoundingClientRect().width : 0;
    const viewportWidth = strip.getBoundingClientRect().width || window.innerWidth;
    if (!originalWidth || !viewportWidth) return;

    let copies = 1;
    while ((copies * originalWidth) < viewportWidth * 3 || ((copies - 1) * originalWidth) < viewportWidth * 1.5) {
      copies += 1;
    }

    for (let index = 1; index < copies; index += 1) {
      track.appendChild(buildGroup(sourceCards, true));
    }

    track.style.setProperty('--marquee-shift', `${-originalWidth}px`);
    track.style.setProperty('--marquee-duration', `${Math.max(30, originalWidth / 34)}s`);
    track.getBoundingClientRect();
    track.style.animation = '';
  };

  const scheduleRender = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(render, 120);
  };

  render();
  window.addEventListener('resize', scheduleRender);

  track.querySelectorAll('img').forEach(image => {
    if (image.complete) return;
    image.addEventListener('load', scheduleRender, { once: true });
    image.addEventListener('error', scheduleRender, { once: true });
  });
})();
