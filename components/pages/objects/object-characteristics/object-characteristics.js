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
