function initServices() {
    const moreButton = document.querySelector('.services__more');
    const servicesGrid = document.querySelector('.services__grid');

    if (!moreButton || !servicesGrid) {
        return;
    }

    moreButton.addEventListener('click', () => {
        servicesGrid.classList.add('is-expanded');
        moreButton.setAttribute('aria-expanded', 'true');
        moreButton.classList.add('is-expanded');
    });
}