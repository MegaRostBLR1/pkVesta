function initPressCenter() {
    const root = document.querySelector('.press-center');

    if (!root || root.dataset.initialized === 'true') {
        return;
    }

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
}
