function initArticleItem() {
  const root = document.querySelector('.article-item');

  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const contentsList = root.querySelector('.article-item__contents-list');
  const popup = root.querySelector('.article-item__contents-popup');

  if (!contentsList || !popup) return;

  const isCompactLayout = () => window.matchMedia('(max-width: 1300px)').matches;

  function toggleContents() {
    if (!isCompactLayout()) return;
    const isExpanded = contentsList.getAttribute('aria-expanded') === 'true';
    contentsList.setAttribute('aria-expanded', String(!isExpanded));
    popup.hidden = isExpanded;
  }

  contentsList.addEventListener('click', (event) => {
    if (!isCompactLayout()) return;
    if (event.target.closest('a')) event.preventDefault();
    toggleContents();
  });
  contentsList.addEventListener('keydown', (event) => {
    if (!isCompactLayout() || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    toggleContents();
  });

  window.addEventListener('resize', () => {
    if (!isCompactLayout()) {
      popup.hidden = true;
      contentsList.setAttribute('aria-expanded', 'false');
    }
  });
}