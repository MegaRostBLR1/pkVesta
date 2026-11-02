function initArticleItem() {
  const root = document.querySelector('.article-item');

  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const toggle = root.querySelector('.article-item__contents-toggle');
  const popup = root.querySelector('.article-item__contents-popup');

  if (!toggle || !popup) return;

  const isCompactLayout = () => window.matchMedia('(max-width: 1300px)').matches;

  function onOutsideClick(event) {
    if (!toggle.contains(event.target) && !popup.contains(event.target)) setExpanded(false);
  }

  function onResize() {
    if (!isCompactLayout()) setExpanded(false);
  }

  function setExpanded(isExpanded) {
    toggle.setAttribute('aria-expanded', String(isExpanded));
    popup.hidden = !isExpanded;

    if (isExpanded) {
      document.addEventListener('click', onOutsideClick);
      window.addEventListener('resize', onResize);
    } else {
      document.removeEventListener('click', onOutsideClick);
      window.removeEventListener('resize', onResize);
    }
  }

  toggle.addEventListener('click', () => {
    setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
  });

  popup.addEventListener('click', (event) => {
    if (event.target.closest('a')) setExpanded(false);
  });

  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || popup.hidden) return;
    setExpanded(false);
    toggle.focus();
  });
}