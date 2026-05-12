/* ============================================================
   ES HAPPY TOURS - PACKAGES PAGE SCRIPTS
   ============================================================ */

let activeType = 'private';
let activeDest = 'all';
let activeSearch = '';

const toggleBtns = document.querySelectorAll('.toggle-btn');
const filterChips = document.querySelectorAll('.filter-chip');
const pkgCards = Array.from(document.querySelectorAll('.pkg-card'));
const pkgCount = document.getElementById('pkg-count');
const pkgEmptySearch = document.getElementById('pkg-empty-search');
const clearSearchBtns = document.querySelectorAll('#pkg-clear-search, [data-clear-search]');

function normalizeSearchText(value) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function getCardSearchText(card) {
  return normalizeSearchText([
    card.dataset.search,
    card.dataset.type,
    card.dataset.dest,
    card.textContent
  ].join(' '));
}

function cardMatchesSearch(card, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const haystack = getCardSearchText(card);
  const tokens = normalizedQuery.split(' ').filter(Boolean);
  return tokens.every(token => haystack.includes(token));
}

function applyFilters() {
  const searchMode = Boolean(activeSearch);
  let visible = 0;

  pkgCards.forEach(card => {
    const typeMatch = card.dataset.type === activeType;
    const destMatch = activeDest === 'all' || card.dataset.dest === activeDest;
    const searchMatch = cardMatchesSearch(card, activeSearch);
    const shouldShow = searchMode ? searchMatch : (typeMatch && destMatch);

    card.classList.toggle('hidden', !shouldShow);
    card.classList.toggle('searchable-card-match', searchMode && searchMatch);
    if (shouldShow) visible++;
  });

  if (pkgEmptySearch) {
    pkgEmptySearch.hidden = !searchMode || visible > 0;
  }

  clearSearchBtns.forEach(btn => {
    btn.hidden = !searchMode;
  });

  updatePackageCount(
    visible,
    searchMode ? `result${visible !== 1 ? 's' : ''}` : `package${visible !== 1 ? 's' : ''}`,
    searchMode ? activeSearch : ''
  );
}

function updatePackageCount(count, label, query) {
  if (!pkgCount) return;

  pkgCount.replaceChildren(
    document.createTextNode('Showing '),
    createStrongText(String(count)),
    document.createTextNode(` ${label}`)
  );

  if (query) {
    pkgCount.append(
      document.createTextNode(' for "'),
      createStrongText(query),
      document.createTextNode('"')
    );
  }
}

function createStrongText(text) {
  const strong = document.createElement('strong');
  strong.textContent = text;
  return strong;
}

function setActiveSearch(query, updateUrl) {
  activeSearch = query.trim();

  if (activeSearch) {
    toggleBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    filterChips.forEach(chip => chip.classList.remove('active'));
  }

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (activeSearch) {
      url.searchParams.set('search', activeSearch);
      url.searchParams.delete('q');
    } else {
      url.searchParams.delete('search');
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url);
  }

  applyFilters();
}

window.applyPackageSearch = function applyPackageSearch(query) {
  setActiveSearch(query, true);
};

function clearSearch() {
  activeSearch = '';
  activeType = 'private';
  activeDest = 'all';

  toggleBtns.forEach(btn => {
    const isPrivate = btn.dataset.type === activeType;
    btn.classList.toggle('active', isPrivate);
    btn.setAttribute('aria-pressed', String(isPrivate));
  });

  filterChips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.dest === 'all');
  });

  const url = new URL(window.location.href);
  url.searchParams.delete('search');
  url.searchParams.delete('q');
  window.history.replaceState({}, '', url);

  applyFilters();
}

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeSearch = '';
    toggleBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    activeType = btn.dataset.type;
    activeDest = 'all';
    filterChips.forEach(chip => chip.classList.toggle('active', chip.dataset.dest === 'all'));
    setActiveSearch('', true);
  });
});

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    activeSearch = '';
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeDest = chip.dataset.dest;
    setActiveSearch('', true);
  });
});

clearSearchBtns.forEach(btn => {
  btn.addEventListener('click', clearSearch);
});

(function readSearchParam() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('search') || params.get('q') || '';
  if (query) {
    setActiveSearch(query, false);
    return;
  }

  applyFilters();
})();
