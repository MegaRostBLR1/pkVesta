function initPressCenter() {
    const root = document.querySelector('.press-center');

    if (!root || root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';

    const categories = root.querySelectorAll('.press-center__category');
    categories.forEach((category) => {
        category.addEventListener('click', () => {
            categories.forEach((item) => {
                item.classList.remove('is-active');
                item.removeAttribute('aria-current');
            });
            category.classList.add('is-active');
            category.setAttribute('aria-current', 'page');
        });
    });

    const loadMoreButton = root.querySelector('.press-center__load-more');
    const extraCards = root.querySelectorAll('.press-center__card--extra');
    loadMoreButton?.addEventListener('click', () => {
        const expanded = loadMoreButton.getAttribute('aria-expanded') === 'true';
        extraCards.forEach((card) => { card.hidden = expanded; });
        loadMoreButton.setAttribute('aria-expanded', String(!expanded));
        loadMoreButton.textContent = expanded ? 'Показать еще' : 'Скрыть';
    });
}