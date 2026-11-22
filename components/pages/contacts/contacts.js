function initContacts() {
    const downloadLink = document.querySelector('.contacts__download');

    if (!downloadLink) {
        return;
    }

    // Replace the temporary Figma reference with the official requisites PDF URL when it is available.
    downloadLink.addEventListener('click', (event) => {
        if (downloadLink.href.includes('figma.com/design/')) {
            event.preventDefault();
        }
    });

    const representations = document.querySelector('.contacts-representations');
    if (representations) {
        const filters = Array.from(representations.querySelectorAll('.contacts-representations__filter'));
        const cards = Array.from(representations.querySelectorAll('.contacts-representations__card'));

        filters.forEach((filter) => {
            filter.addEventListener('click', () => {
                const selectedCountry = filter.dataset.country;
                filters.forEach((item) => {
                    const isActive = item === filter;
                    item.classList.toggle('is-active', isActive);
                    item.setAttribute('aria-pressed', String(isActive));
                });
                cards.forEach((card) => {
                    card.hidden = selectedCountry !== 'all' && card.dataset.country !== selectedCountry;
                });
            });
        });

        // Additional office details are not present in the supplied design data.
        const moreButton = representations.querySelector('.contacts-representations__more');
        moreButton?.addEventListener('click', () => {
            representations.querySelectorAll('.contacts-representations__card[data-layout-1920]')
                .forEach((card) => card.removeAttribute('data-layout-1920'));

            moreButton.querySelector('span').textContent = 'Все представительства показаны';
            moreButton.disabled = true;
        });
    }
}
