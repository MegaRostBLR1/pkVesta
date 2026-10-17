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

  const mobileQuery = window.matchMedia('(max-width: 680px)');
  let expanded = false;

  function updateVisibility() {
    items.forEach((item, index) => {
      item.hidden = mobileQuery.matches && !expanded && index >= 5;
    });

    toggle.hidden = !mobileQuery.matches;
    toggle.setAttribute('aria-expanded', String(expanded));
    if (label) label.textContent = expanded ? 'Свернуть' : 'Показать еще';
    if (icon) icon.classList.toggle('is-expanded', expanded);
  }

  toggle.addEventListener('click', () => {
    expanded = !expanded;
    updateVisibility();
  });

  mobileQuery.addEventListener('change', () => {
    expanded = false;
    updateVisibility();
  });

  updateVisibility();
}
