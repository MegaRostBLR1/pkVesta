function initObjectDetail() {
  const root = document.querySelector('.object-detail-page');

  if (!root || root.dataset.initialized === 'true') {
    return;
  }

  root.dataset.initialized = 'true';

  const reviewText = root.querySelector('.object-detail__review-text');
  const reviewToggle = root.querySelector('.object-detail__review-more');

  if (reviewText && reviewToggle) {
    reviewToggle.addEventListener('click', () => {
      const isExpanded = reviewToggle.getAttribute('aria-expanded') === 'true';

      reviewToggle.setAttribute('aria-expanded', String(!isExpanded));
      reviewText.classList.toggle('is-expanded', !isExpanded);
      reviewToggle.textContent = isExpanded ? 'Читать больше' : 'Свернуть';
    });
  }
}

function initObjectParameters() {
  const root = document.querySelector('.object-parameters');

  if (!root || root.dataset.initialized === 'true') {
    return;
  }

  root.dataset.initialized = 'true';

  const grid = root.querySelector('.object-parameters__details');
  const items = grid ? Array.from(grid.querySelectorAll('.object-parameters__item')) : [];
  const toggle = root.querySelector('.object-parameters__show-more');
  const label = toggle?.querySelector('.object-parameters__show-more-label');
  const icon = toggle?.querySelector('.object-parameters__show-more-icon');

  if (!grid || !toggle || items.length <= 5) {
    if (toggle) toggle.hidden = true;
    return;
  }

  const compactQuery = window.matchMedia('(max-width: 900px)');
  let expanded = false;

  function updateVisibility() {
    items.forEach((item, index) => {
      item.hidden = compactQuery.matches && !expanded && index >= 5;
    });

    toggle.hidden = !compactQuery.matches;
    toggle.setAttribute('aria-expanded', String(expanded));
    if (label) label.textContent = expanded ? 'Свернуть' : 'Показать еще';
    if (icon) icon.classList.toggle('is-expanded', expanded);
  }

  toggle.addEventListener('click', () => {
    expanded = !expanded;
    updateVisibility();
  });

  compactQuery.addEventListener('change', () => {
    expanded = false;
    updateVisibility();
  });

  updateVisibility();
}

function initObjectCharacteristics() {
  const root = document.querySelector('.object-characteristics');

  if (!root || root.dataset.initialized === 'true') {
    return;
  }

  root.dataset.initialized = 'true';

  const grid = root.querySelector('.object-characteristics__grid');
  const items = grid ? Array.from(grid.querySelectorAll('.object-characteristics__item')) : [];

  if (items.length <= 5) {
    return;
  }

  const toggle = document.createElement('button');
  toggle.className = 'object-characteristics__show-more';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span class="object-characteristics__show-more-label">Показать еще</span><svg class="object-characteristics__show-more-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  const mediaQuery = window.matchMedia('(max-width: 760px)');
  const visibleCount = 5;
  let expanded = false;

  function updateVisibility() {
    items.forEach((item, index) => {
      item.hidden = mediaQuery.matches && !expanded && index >= visibleCount;
    });

    toggle.hidden = !mediaQuery.matches;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.querySelector('.object-characteristics__show-more-label').textContent = expanded ? 'Скрыть' : 'Показать еще';
    toggle.querySelector('.object-characteristics__show-more-icon').classList.toggle('is-expanded', expanded);
  }

  toggle.addEventListener('click', () => {
    expanded = !expanded;
    updateVisibility();
  });

  grid.insertAdjacentElement('afterend', toggle);
  mediaQuery.addEventListener('change', () => {
    expanded = false;
    updateVisibility();
  });

  updateVisibility();
}

const OBJECT_PAGE_SECTIONS = {
  'object-detail': 'object-detail',
  'object-characteristics': 'object-characteristics',
  'object-parameters': 'object-parameters'
};

function setObjectPageSection(route) {
  const activePanel = OBJECT_PAGE_SECTIONS[route];

  if (!activePanel) {
    return;
  }

  const root = document.querySelector('.object-detail-page');

  if (!root) {
    return;
  }

  root.querySelectorAll('[data-object-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.objectPanel !== activePanel;
  });

  root.querySelectorAll('.object-section__tab').forEach((tab) => {
    const isActive = tab.getAttribute('href') === `#/${route}`;

    tab.classList.toggle('is-active', isActive);

    if (isActive) {
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.removeAttribute('aria-current');
    }
  });
}

function initObjectPage(route) {
  initObjectDetail();
  initObjectParameters();
  initObjectCharacteristics();
  setObjectPageSection(route);
}
