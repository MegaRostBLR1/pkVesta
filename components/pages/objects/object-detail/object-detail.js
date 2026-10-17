function initObjectDetail() {
  const root = document.querySelector('.object-detail');

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
