function initNews() {
    const filterButtons = document.querySelectorAll('.press-news__filter-button[data-filter-type]');
    const mobileButton = document.querySelector('.press-news__mobile-filter-button');
    const overlay = document.querySelector('#press-news-filter-dialog');
    const dialog = overlay?.querySelector('.press-news__filter-dialog');
    const closeButton = overlay?.querySelector('.press-news__filter-dialog-close');
    const backButton = overlay?.querySelector('.press-news__filter-back');
    const showMoreButtons = overlay?.querySelectorAll('[data-expand-list]');
    let previousFocus = null;
    const selected = { months: '', years: '' };

    document.querySelectorAll('.press-news__card').forEach((card) => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('a, button, input, select, textarea, [role="button"], [role="link"]')) return;
            window.location.hash = '/news-item';
        });
    });

    const closeMenus = (exceptButton = null) => {
        filterButtons.forEach((button) => {
            if (button === exceptButton) return;
            button.setAttribute('aria-expanded', 'false');
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            if (menu) menu.hidden = true;
        });
    };

    const syncDesktopLabel = (type, value) => {
        const button = document.querySelector('[data-filter-type="' + type + '"]');
        const label = button?.querySelector('span');
        if (label) {
            const prefix = type === 'months' ? 'По месяцам:' : 'По годам:';
            label.textContent = value ? prefix + ' ' + value : prefix;
        }
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
        menu?.querySelectorAll('.press-news__filter-option').forEach((option) => {
            option.addEventListener('click', () => {
                const value = option.dataset.filterValue || '';
                menu.querySelectorAll('.press-news__filter-option').forEach((item) => {
                    const active = item === option;
                    item.classList.toggle('is-selected', active);
                    item.setAttribute('aria-selected', String(active));
                });
                selected[type] = value;
                syncDesktopLabel(type, value);
                closeMenus();
            });
        });
    });

    const openDialog = () => {
        if (!overlay || !dialog) return;
        previousFocus = document.activeElement;
        overlay.hidden = false;
        mobileButton?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('press-news-filter-open');
        closeButton?.focus();
    };

    const closeDialog = () => {
        if (!overlay) return;
        overlay.hidden = true;
        mobileButton?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('press-news-filter-open');
        if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };

    mobileButton?.addEventListener('click', openDialog);
    closeButton?.addEventListener('click', closeDialog);
    backButton?.addEventListener('click', closeDialog);
    overlay?.addEventListener('click', (event) => {
        if (event.target === overlay) closeDialog();
    });

    overlay?.querySelectorAll('[data-filter-list]').forEach((list) => {
        const type = list.dataset.filterList;
        list.querySelectorAll('.press-news__filter-option').forEach((option) => {
            option.addEventListener('click', () => {
                const value = option.dataset.filterValue || '';
                list.querySelectorAll('.press-news__filter-option').forEach((item) => {
                    const active = item === option;
                    item.classList.toggle('is-selected', active);
                    item.setAttribute('aria-pressed', String(active));
                });
                selected[type] = value;
                syncDesktopLabel(type, value);
            });
        });
    });

    showMoreButtons?.forEach((button) => {
        button.addEventListener('click', () => {
            const type = button.dataset.expandList;
            const list = overlay?.querySelector('[data-filter-list="' + type + '"]');
            const expanded = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(expanded));
            if (list) list.classList.toggle('is-expanded', expanded);
            if (list) list.style.maxHeight = expanded ? 'none' : (type === 'months' ? '166px' : '130px');
            const label = button.querySelector('span');
            if (label) label.textContent = expanded ? 'Скрыть' : 'Показать еще';
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.press-news__filter-dropdown')) closeMenus();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenus();
            if (overlay && !overlay.hidden) closeDialog();
        }
        if (event.key === 'Tab' && overlay && !overlay.hidden && dialog) {
            const focusable = dialog.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}