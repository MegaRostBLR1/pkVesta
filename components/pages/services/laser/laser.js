function initLaser() {
    document.querySelectorAll('.laser-work-with-us').forEach((root) => {
        const cards = root.querySelector('.laser-work-with-us__cards');
        const previous = root.querySelector('.laser-work-with-us__arrow--previous');
        const next = root.querySelector('.laser-work-with-us__arrow--next');
        const pagination = Array.from(root.querySelectorAll('.laser-work-with-us__pagination li'));

        if (!cards || !previous || !next || !pagination.length || cards.dataset.initialized === 'true') return;
        cards.dataset.initialized = 'true';

        const items = Array.from(cards.querySelectorAll('.laser-work-with-us__card'));
        if (!items.length) return;

        const getActiveIndex = () => {
            const scrollPosition = cards.scrollLeft;
            return items.reduce((activeIndex, item, index) => {
                const currentDistance = Math.abs(items[activeIndex].offsetLeft - cards.offsetLeft - scrollPosition);
                const nextDistance = Math.abs(item.offsetLeft - cards.offsetLeft - scrollPosition);
                return nextDistance < currentDistance ? index : activeIndex;
            }, 0);
        };

        const updateNavigation = () => {
            const activeIndex = getActiveIndex();
            const canScroll = cards.scrollWidth > cards.clientWidth + 1;

            previous.disabled = !canScroll || activeIndex === 0;
            next.disabled = !canScroll || activeIndex === items.length - 1;

            pagination.forEach((page, index) => {
                if (index === activeIndex) {
                    page.classList.add('is-active');
                    page.setAttribute('aria-current', 'page');
                } else {
                    page.classList.remove('is-active');
                    page.removeAttribute('aria-current');
                }
            });
        };

        previous.addEventListener('click', () => {
            const activeIndex = getActiveIndex();
            const target = items[Math.max(0, activeIndex - 1)];
            cards.scrollTo({ left: target.offsetLeft - cards.offsetLeft, behavior: 'smooth' });
        });

        next.addEventListener('click', () => {
            const activeIndex = getActiveIndex();
            const target = items[Math.min(items.length - 1, activeIndex + 1)];
            cards.scrollTo({ left: target.offsetLeft - cards.offsetLeft, behavior: 'smooth' });
        });

        cards.addEventListener('scroll', updateNavigation, { passive: true });
        window.addEventListener('resize', updateNavigation);
        updateNavigation();
    });
    document.querySelectorAll('.laser-materials').forEach((root) => {
        if (root.dataset.initialized === 'true') return;
        root.dataset.initialized = 'true';
        root.querySelectorAll('.laser-materials__toggle').forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const wasExpanded = toggle.getAttribute('aria-expanded') === 'true';
                root.querySelectorAll('.laser-materials__toggle').forEach((item) => {
                    item.setAttribute('aria-expanded', 'false');
                    const panel = root.querySelector(`#${item.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = true;
                });
                if (!wasExpanded) {
                    toggle.setAttribute('aria-expanded', 'true');
                    const panel = root.querySelector(`#${toggle.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = false;
                }
            });
        });
        root.querySelectorAll('.laser-materials__zoom').forEach((zoom) => {
            const image = zoom.closest('.laser-materials__visual')?.querySelector('.laser-materials__image');
            if (!image) return;
            zoom.addEventListener('click', () => {
                const preview = window.open(image.src, '_blank', 'noopener,noreferrer');
                if (preview) preview.opener = null;
            });
        });
    });
    const calculator = document.querySelector('.laser-calculator');
    const summary = calculator?.querySelector('.laser-calculator__mobile-summary');
    const dialog = calculator?.querySelector('.laser-calculator__mobile-dialog');

    if (summary && dialog && summary.dataset.initialized !== 'true') {
        summary.dataset.initialized = 'true';
        const closeButtons = dialog.querySelectorAll('.laser-calculator__mobile-close, .laser-calculator__mobile-back');
        let previousFocus = null;

        const closeDialog = () => {
            if (dialog.hidden) return;
            dialog.hidden = true;
            document.body.classList.remove('laser-calculator-dialog-open');
            summary.setAttribute('aria-expanded', 'false');
            if (previousFocus) previousFocus.focus();
        };

        const openDialog = () => {
            if (window.matchMedia('(min-width: 681px)').matches) return;
            previousFocus = document.activeElement;
            dialog.hidden = false;
            document.body.classList.add('laser-calculator-dialog-open');
            summary.setAttribute('aria-expanded', 'true');
            dialog.querySelector('.laser-calculator__mobile-close')?.focus();
        };

        summary.setAttribute('aria-expanded', 'false');
        summary.addEventListener('click', openDialog);
        closeButtons.forEach((button) => button.addEventListener('click', closeDialog));

        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) closeDialog();
        });

        dialog.addEventListener('click', (event) => {
            const option = event.target.closest('.laser-calculator__mobile-option');
            if (option) {
                const group = option.closest('.laser-calculator__mobile-options');
                group?.querySelectorAll('.laser-calculator__mobile-option').forEach((item) => {
                    const selected = item === option;
                    item.classList.toggle('is-selected', selected);
                    item.setAttribute('aria-pressed', String(selected));
                });
                return;
            }

            const moreButton = event.target.closest('.laser-calculator__mobile-more');
            if (moreButton) {
                const options = moreButton.previousElementSibling;
                const expanded = moreButton.getAttribute('aria-expanded') === 'true';
                options?.querySelectorAll('[data-extra-option]').forEach((option) => {
                    option.hidden = expanded;
                });
                moreButton.setAttribute('aria-expanded', String(!expanded));
                moreButton.firstChild.textContent = expanded ? 'Показать еще' : 'Скрыть';
            }
        });

        document.addEventListener('keydown', (event) => {
            if (dialog.hidden) return;
            if (event.key === 'Escape') {
                closeDialog();
                return;
            }
            if (event.key !== 'Tab') return;

            const focusable = Array.from(dialog.querySelectorAll('button:not([hidden]), [href], input:not([disabled])'))
                .filter((element) => element.getAttribute('aria-hidden') !== 'true');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        });
    }

    document.querySelectorAll('.laser-cutting-advantages').forEach((root) => {
        if (root.dataset.initialized === 'true') return;
        root.dataset.initialized = 'true';

        root.querySelectorAll('.laser-cutting-advantages__toggle').forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const wasExpanded = toggle.getAttribute('aria-expanded') === 'true';
                root.querySelectorAll('.laser-cutting-advantages__toggle').forEach((item) => {
                    item.setAttribute('aria-expanded', 'false');
                    const panel = root.querySelector(`#${item.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = true;
                });
                if (!wasExpanded) {
                    toggle.setAttribute('aria-expanded', 'true');
                    const panel = root.querySelector(`#${toggle.getAttribute('aria-controls')}`);
                    if (panel) panel.hidden = false;
                }
            });
        });

        root.querySelectorAll('.laser-cutting-advantages__zoom').forEach((zoom) => {
            const image = zoom.closest('.laser-cutting-advantages__visual')?.querySelector('.laser-cutting-advantages__image');
            if (!image) return;
            zoom.addEventListener('click', () => {
                const preview = window.open(image.src, '_blank', 'noopener,noreferrer');
                if (preview) preview.opener = null;
            });
        });
    });

}