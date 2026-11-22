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

        const moreButton = representations.querySelector('.contacts-representations__more');

        if (moreButton && cards.length > 4) {
            const moreButtonLabel = moreButton.querySelector('span');
            let isExpanded = false;

            const hasExpandableCards = () => {
                const firstExpandableIndex = window.matchMedia('(max-width: 1440px)').matches ? 4 : 6;
                const selectedCountry = representations.querySelector(
                  '.contacts-representations__filter.is-active'
                )?.dataset.country || 'all';

                return cards.slice(firstExpandableIndex).some((card) => (
                  selectedCountry === 'all' || card.dataset.country === selectedCountry
                ));
            };

            const updateMoreButton = () => {
                moreButtonLabel.textContent = isExpanded ? 'Свернуть' : 'Показать еще';
                moreButton.setAttribute('aria-expanded', String(isExpanded));
                moreButton.classList.toggle('is-expanded', isExpanded);
                representations.classList.toggle('is-expanded', isExpanded);
            };

            updateMoreButton();

            moreButton.addEventListener('click', () => {
                if (!hasExpandableCards()) {
                    return;
                }

                isExpanded = !isExpanded;
                updateMoreButton();
            });
        }
    }
}
