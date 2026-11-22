function initSearchResult() {
  const section = document.querySelector('.search-result');

  if (!section) {
    return;
  }

  section.querySelectorAll('[data-remove-query]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.search-result__suggestion');

      if (item) {
        item.remove();
      }
    });
  });

  const clearButton = section.querySelector('.search-result__clear');

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      section.querySelectorAll('.search-result__suggestion').forEach((item) => item.remove());
    });
  }
}