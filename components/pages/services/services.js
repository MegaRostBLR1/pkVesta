function initServices() {
    const categories = document.querySelectorAll('.services__category');

    categories.forEach((category) => {
        category.addEventListener('click', () => {
            categories.forEach((item) => {
                const isActive = item === category;

                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });
        });
    });

    const grid = document.querySelector('.services-list__grid');
    const moreButton = document.querySelector('.services-list__more');

    if (!grid || !moreButton) {
        return;
    }

    const cards = Array.from(grid.querySelectorAll('.service-card'));
    const mobileQuery = window.matchMedia('(max-width: 680px)');
    let expanded = false;

    const updateCards = () => {
        cards.forEach((card, index) => {
            card.hidden = mobileQuery.matches && !expanded && index >= 3;
        });

        moreButton.hidden = !mobileQuery.matches || cards.length <= 3;
        moreButton.setAttribute('aria-expanded', String(expanded));
        moreButton.textContent = expanded ? 'Скрыть' : 'Показать ещё';
    };

    moreButton.addEventListener('click', () => {
        expanded = !expanded;
        updateCards();
    });

    mobileQuery.addEventListener('change', () => {
        expanded = false;
        updateCards();
    });

    updateCards();
}