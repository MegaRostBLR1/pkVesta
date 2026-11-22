function initHeaderLocationChoices() {
    const header = document.querySelector('.app-header-component');

    if (!header) {
        return;
    }

    header.addEventListener('click', (event) => {
        const item = event.target.closest('.header__location-choice-item');

        if (!item || !header.contains(item)) {
            return;
        }

        const choice = item.closest('.header__location-choice');

        if (!choice) {
            return;
        }

        choice.querySelector('.header__location-choice-item--selected')
            ?.classList.remove('header__location-choice-item--selected');

        item.classList.add('header__location-choice-item--selected');

        const trigger = choice.parentElement;
        const current = trigger?.querySelector('.header__location-current');

        if (current) {
            current.textContent = getHeaderChoiceLabel(item);
        }
    });
}

function getHeaderChoiceLabel(item) {
    return item.querySelector('.header__location-choice-name')?.textContent.trim()
        || item.querySelector('.header__location-choice-code')?.textContent.trim()
        || item.querySelector('.header__location-choice-country')?.textContent.trim()
        || item.textContent.trim();
}

function initHeaderMobileMenu() {
    const header = document.querySelector('.app-header-component');
    const trigger = header?.querySelector('.header-burger');
    const navigation = header?.querySelector('.header__nav');

    if (!header || !trigger || !navigation) {
        return;
    }

    navigation.id ||= 'header-mobile-navigation';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-controls', navigation.id);
    trigger.setAttribute('aria-expanded', String(header.classList.contains('is-menu-open')));

    const setMenuOpen = (isOpen) => {
        header.classList.toggle('is-menu-open', isOpen);
        document.documentElement.classList.toggle('is-header-menu-open', isOpen);
        trigger.setAttribute('aria-expanded', String(isOpen));
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!header.classList.contains('is-menu-open'));
    };

    setMenuOpen(header.classList.contains('is-menu-open'));

    trigger.addEventListener('click', toggleMenu);

    trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        toggleMenu();
    });

    header.addEventListener('click', (event) => {
        if (event.target.closest('.header__nav a')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    const desktopBreakpoint = window.matchMedia('(min-width: 1301px)');
    desktopBreakpoint.addEventListener('change', (event) => {
        if (event.matches) {
            closeMenu();
        }
    });
}

initHeaderLocationChoices();
initHeaderMobileMenu();
