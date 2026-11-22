function initBuildingsCharacteristics() {
  const panel = document.querySelector('.buildings-characteristics__technical-panel');
  const toggle = document.querySelector('.buildings-characteristics__show-more');

  if (!panel || !toggle || toggle.dataset.initialized === 'true') {
    return;
  }

  toggle.dataset.initialized = 'true';

  const label = toggle.querySelector('.buildings-characteristics__show-more-label');

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';

    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.classList.toggle('is-expanded', !expanded);

    if (label) {
      label.textContent = expanded ? 'Показать еще' : 'Свернуть';
    }
  });
}
