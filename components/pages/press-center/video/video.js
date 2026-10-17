function initVideo() {
    const filterButtons = document.querySelectorAll('.video-page__filter-button[data-filter-type]');
    const cards = Array.from(document.querySelectorAll('.video-page__card'));
    const loadMoreButton = document.querySelector('.video-page__load-more');
    let visibleCards = 6;

    const closeMenus = (exceptButton = null) => {
        filterButtons.forEach((button) => {
            if (button === exceptButton) return;
            button.setAttribute('aria-expanded', 'false');
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            if (menu) menu.hidden = true;
        });
    };

    filterButtons.forEach((button) => {
        const type = button.dataset.filterType;
        const menu = document.getElementById(button.getAttribute('aria-controls'));

        button.addEventListener('click', () => {
            const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
            closeMenus(button);
            button.setAttribute('aria-expanded', String(shouldOpen));
            if (menu) menu.hidden = !shouldOpen;
        });

        menu?.querySelectorAll('.video-page__filter-option').forEach((option) => {
            option.addEventListener('click', () => {
                menu.querySelectorAll('.video-page__filter-option').forEach((item) => {
                    const selected = item === option;
                    item.classList.toggle('is-selected', selected);
                    item.setAttribute('aria-selected', String(selected));
                });

                const label = button.querySelector('span');
                if (label) label.textContent = typeLabel(type) + ' ' + (option.dataset.filterValue || '');
                closeMenus();
            });
        });
    });

    function typeLabel(type) {
        const labels = {
            years: 'Год:',
            countries: 'Страна:',
            regions: 'Регион:',
            segments: 'Сегменты:',
            technology: 'Технология:'
        };
        return labels[type] || '';
    }

    loadMoreButton?.addEventListener('click', () => {
        const nextVisibleCards = Math.min(visibleCards + 3, cards.length);
        cards.forEach((card, index) => {
            card.hidden = index >= nextVisibleCards;
        });
        visibleCards = nextVisibleCards;

        if (visibleCards >= cards.length && loadMoreButton) {
            loadMoreButton.hidden = true;
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.video-page__filter-dropdown')) closeMenus();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenus();
    });

    const mobileFilterButton = document.querySelector('.video-page__mobile-filter-button');
    const mobileFilterDialog = document.querySelector('#video-mobile-filter');
    const mobileFilterForm = mobileFilterDialog?.querySelector('.video-page__mobile-filter-form');
    const mobileFilterClose = mobileFilterDialog?.querySelector('.video-page__mobile-filter-close');
    let previousMobileFilterFocus = null;

    const closeMobileFilter = () => {
        if (!mobileFilterDialog || mobileFilterDialog.hidden) return;
        mobileFilterDialog.hidden = true;
        mobileFilterButton?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('video-page-filter-open');
        previousMobileFilterFocus?.focus();
    };

    mobileFilterButton?.addEventListener('click', () => {
        if (!mobileFilterDialog) return;
        previousMobileFilterFocus = document.activeElement;
        mobileFilterDialog.hidden = false;
        mobileFilterButton.setAttribute('aria-expanded', 'true');
        document.body.classList.add('video-page-filter-open');
        mobileFilterClose?.focus();
    });

    mobileFilterClose?.addEventListener('click', closeMobileFilter);
    mobileFilterDialog?.addEventListener('click', (event) => {
        if (event.target === mobileFilterDialog) closeMobileFilter();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMobileFilter();
    });

    mobileFilterForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = new FormData(mobileFilterForm);
        filterButtons.forEach((button) => {
            const type = button.dataset.filterType;
            const value = values.get(type);
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            const option = Array.from(menu?.querySelectorAll('.video-page__filter-option') || [])
                .find((item) => item.dataset.filterValue === value);
            if (!option) return;
            menu.querySelectorAll('.video-page__filter-option').forEach((item) => {
                const selected = item === option;
                item.classList.toggle('is-selected', selected);
                item.setAttribute('aria-selected', String(selected));
            });
            const label = button.querySelector('span');
            if (label) label.textContent = typeLabel(type) + ' ' + value;
        });
        closeMobileFilter();
    });

}
