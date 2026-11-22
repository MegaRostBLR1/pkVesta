function initAbout() {
    const documentsGrid = document.querySelector('.about-documents__grid');
    const documentsMore = document.querySelector('.about-documents__more');

    if (documentsGrid && documentsMore) {
        documentsMore.addEventListener('click', () => {
            const expanded = documentsGrid.classList.toggle('is-expanded');
            documentsMore.setAttribute('aria-expanded', String(expanded));
            documentsMore.querySelector('span').textContent = expanded ? 'Скрыть' : 'Показать еще';
        });
    }
    const tabs = document.querySelectorAll('.about__media-tab');

    const gallery = document.querySelector('.about-team__featured-row');
    const previousButton = document.querySelector('.about-team__arrow--previous');
    const nextButton = document.querySelector('.about-team__arrow--next');

    if (gallery && previousButton && nextButton) {
        previousButton.addEventListener('click', () => {
            gallery.scrollBy({ left: -gallery.clientWidth * 0.7, behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            gallery.scrollBy({ left: gallery.clientWidth * 0.7, behavior: 'smooth' });
        });
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((item) => {
                const active = item === tab;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', String(active));
            });
        });
    });

    const reasonTabs = document.querySelectorAll('.about-reasons__tab');
    reasonTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            reasonTabs.forEach((item) => {
                const active = item === tab;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', String(active));
            });
        });
    });
}
