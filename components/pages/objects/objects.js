function initObjects() {
    const root = document.querySelector('.objects');

    if (!root || root.dataset.initialized === 'true') {
        return;
    }

    root.dataset.initialized = 'true';

    const searchForm = root.querySelector('.objects__search-group');
    const viewControls = Array.from(root.querySelectorAll('[data-objects-view]'));

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }

    const filtersForm = root.querySelector('.objects-map__filters');
    const mobileFiltersToggle = root.querySelector('.objects-map__mobile-toggle');
    const closeFiltersButton = root.querySelector('.objects-map__filters-close');
    const filtersSubmitButton = root.querySelector('.objects-map__submit');
    const moreFiltersButton = root.querySelector('.objects-map__more');
    const extraFilters = root.querySelector('.objects-map__extra-filters');
    const extraFiltersCloseButton = root.querySelector('.objects-map__extra-filters-close');
    const extraFiltersSubmitButton = root.querySelector('.objects-map__extra-filters-submit');
    const mapSection = root.querySelector('.objects-map');
    const mapCard = root.querySelector('.objects-map__card');
    const closeCardButton = root.querySelector('.objects-map__card-close');

    if (filtersForm) {
        filtersForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }

    if (filtersForm) {
        const filterSelects = Array.from(filtersForm.querySelectorAll('.objects-map__filter select'));
        let openDropdown = null;

        document.querySelector('.objects-map__select-popup')?.remove();

        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'objects-map__select-overlay';
        popupOverlay.hidden = true;
        popupOverlay.setAttribute('aria-hidden', 'true');

        const mobilePopup = document.createElement('div');
        mobilePopup.className = 'objects-map__select-popup';
        mobilePopup.hidden = true;
        mobilePopup.setAttribute('role', 'dialog');
        mobilePopup.setAttribute('aria-modal', 'true');
        mobilePopup.setAttribute('aria-labelledby', 'objects-map-select-popup-title');

        const popupHeader = document.createElement('div');
        popupHeader.className = 'objects-map__select-popup-header';

        const popupTitle = document.createElement('h2');
        popupTitle.className = 'objects-map__select-popup-title';
        popupTitle.id = 'objects-map-select-popup-title';

        const popupClose = document.createElement('button');
        popupClose.className = 'objects-map__select-popup-close';
        popupClose.type = 'button';
        popupClose.setAttribute('aria-label', 'Закрыть список значений');
        popupClose.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m18 6-12 12M6 6l12 12"></path></svg>';

        const popupContent = document.createElement('div');
        popupContent.className = 'objects-map__select-popup-content';

        const popupFooter = document.createElement('div');
        popupFooter.className = 'objects-map__select-popup-footer';

        const popupBack = document.createElement('button');
        popupBack.className = 'objects-map__select-popup-back';
        popupBack.type = 'button';
        popupBack.textContent = 'Назад';

        popupHeader.append(popupTitle, popupClose);
        popupFooter.append(popupBack);
        mobilePopup.append(popupHeader, popupContent, popupFooter);
        document.body.append(popupOverlay, mobilePopup);

        const closeDropdown = (dropdown, returnFocus = false) => {
            if (!dropdown) return;
            const trigger = dropdown.querySelector('.objects-map__select-trigger');
            const options = dropdown.querySelector('.objects-map__select-options')
              || (openDropdown === dropdown ? popupContent.querySelector('.objects-map__select-options') : null);

            if (options && options.parentElement === popupContent) {
                dropdown.append(options);
            }

            dropdown.classList.remove('is-open');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            if (options) options.hidden = true;
            mobilePopup.hidden = true;
            popupOverlay.hidden = true;
            document.documentElement.classList.remove('objects-select-open');
            if (returnFocus && trigger) trigger.focus();
            if (openDropdown === dropdown) openDropdown = null;
        };

        popupClose.addEventListener('click', () => closeDropdown(openDropdown, true));
        popupBack.addEventListener('click', () => closeDropdown(openDropdown, true));
        popupOverlay.addEventListener('click', () => closeDropdown(openDropdown, true));

        mobilePopup.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeDropdown(openDropdown, true);
                return;
            }

            if (event.key !== 'Tab') return;

            const focusable = Array.from(mobilePopup.querySelectorAll('button:not([disabled])'));
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

        const mobileBreakpoint = window.matchMedia('(max-width: 680px)');
        mobileBreakpoint.addEventListener('change', () => {
            if (openDropdown) closeDropdown(openDropdown);
        });

        filterSelects.forEach((select, index) => {
            const filter = select.closest('.objects-map__filter');
            if (!filter) return;
            const dropdown = document.createElement('div');
            dropdown.className = 'objects-map__select';
            const trigger = document.createElement('button');
            trigger.className = 'objects-map__select-trigger';
            trigger.type = 'button';
            trigger.id = `objects-map-select-${select.name || index}`;
            trigger.setAttribute('aria-haspopup', 'listbox');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-label', filter.querySelector('.objects-map__filter-label')?.textContent.trim() || 'Выбрать значение');
            const value = document.createElement('span');
            value.className = 'objects-map__select-value';
            const chevron = document.createElement('span');
            chevron.className = 'objects-map__select-chevron';
            chevron.setAttribute('aria-hidden', 'true');
            chevron.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path d="m6 9 6 6 6-6"></path></svg>';
            trigger.append(value, chevron);

            const options = document.createElement('div');
            options.className = 'objects-map__select-options';
            options.id = `objects-map-options-${select.name || index}`;
            options.setAttribute('role', 'listbox');
            options.setAttribute('aria-label', trigger.getAttribute('aria-label'));
            options.hidden = true;
            trigger.setAttribute('aria-controls', options.id);
            let optionButtons = [];
            const updateSelection = () => {
                const selectedOption = select.options[select.selectedIndex];
                value.textContent = selectedOption ? selectedOption.textContent : '';
                optionButtons.forEach((item) => {
                    const selected = item.dataset.value === select.value;
                    item.classList.toggle('is-selected', selected);
                    item.setAttribute('aria-selected', String(selected));
                });
            };

            optionButtons = Array.from(select.options).map((option, optionIndex) => {
                const item = document.createElement('button');
                item.className = 'objects-map__select-option';
                item.type = 'button';
                item.setAttribute('role', 'option');
                item.dataset.value = option.value;

                const label = document.createElement('span');
                label.className = 'objects-map__select-option-label';
                label.textContent = option.textContent;

                const check = document.createElement('span');
                check.className = 'objects-map__select-option-check';
                check.setAttribute('aria-hidden', 'true');
                check.innerHTML = '<svg viewBox="0 0 18 18" focusable="false"><path d="m3.5 9 3.4 3.4 7.6-7.6"></path></svg>';

                item.append(label, check);
                item.setAttribute('aria-selected', String(option.selected));
                item.tabIndex = -1;
                if (option.selected) item.classList.add('is-selected');
                item.addEventListener('click', () => {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    updateSelection();
                    closeDropdown(dropdown);
                    trigger.focus();
                });
                item.addEventListener('keydown', (event) => {
                    let nextIndex = optionIndex;
                    if (event.key === 'ArrowDown') nextIndex = Math.min(optionButtons.length - 1, optionIndex + 1);
                    else if (event.key === 'ArrowUp') nextIndex = Math.max(0, optionIndex - 1);
                    else if (event.key === 'Home') nextIndex = 0;
                    else if (event.key === 'End') nextIndex = optionButtons.length - 1;
                    else if (event.key === 'Escape') {
                        event.preventDefault();
                        event.stopPropagation();
                        closeDropdown(dropdown, true);
                        return;
                    } else if (event.key === 'Tab') {
                        if (mobilePopup.hidden) closeDropdown(dropdown);
                        return;
                    } else return;
                    event.preventDefault();
                    optionButtons[nextIndex]?.focus();
                });
                options.append(item);
                return item;
            });

            trigger.addEventListener('click', () => {
                if (openDropdown && openDropdown !== dropdown) closeDropdown(openDropdown);
                if (!options.hidden) {
                    closeDropdown(dropdown);
                    return;
                }
                openDropdown = dropdown;
                dropdown.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');

                if (mobileBreakpoint.matches) {
                    const filterLabel = filter.querySelector('.objects-map__filter-label');
                    popupTitle.textContent = filterLabel ? filterLabel.textContent.replace(/:$/, '') : 'Выберите значение';
                    popupContent.append(options);
                    popupOverlay.hidden = false;
                    mobilePopup.hidden = false;
                    document.documentElement.classList.add('objects-select-open');
                }

                options.hidden = false;
                const selected = optionButtons.find((item) => item.getAttribute('aria-selected') === 'true');
                (selected || optionButtons[0])?.focus();
            });
            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (options.hidden) trigger.click();
                    else optionButtons[0]?.focus();
                } else if (event.key === 'Escape' && !options.hidden) {
                    event.preventDefault();
                    event.stopPropagation();
                    closeDropdown(dropdown, true);
                }
            });

            select.classList.add('objects-map__native-select');
            select.tabIndex = -1;
            select.setAttribute('aria-hidden', 'true');
            select.insertAdjacentElement('afterend', dropdown);
            dropdown.append(trigger, options);
            updateSelection();
            select.addEventListener('change', updateSelection);
        });

        document.addEventListener('click', (event) => {
            if (openDropdown && !openDropdown.contains(event.target) && !mobilePopup.contains(event.target)) {
                closeDropdown(openDropdown);
            }
        });
        filtersForm.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && openDropdown) closeDropdown(openDropdown, true);
        });
    }

    if (mobileFiltersToggle && filtersForm) {
        const setMobileFiltersExpanded = (expanded) => {
            if (!expanded) setExtraFiltersOpen(false);
            filtersForm.classList.toggle('is-expanded', expanded);
            mobileFiltersToggle.setAttribute('aria-expanded', String(expanded));
            document.documentElement.classList.toggle('objects-filters-open', expanded);
            document.body.classList.toggle('objects-filters-open', expanded);

            if (filtersSubmitButton) {
                filtersSubmitButton.textContent = expanded ? 'Назад' : 'Показать';
            }

            if (expanded) {
                closeFiltersButton?.focus();
            } else {
                mobileFiltersToggle.focus();
            }
        };

        mobileFiltersToggle.addEventListener('click', () => {
            const expanded = mobileFiltersToggle.getAttribute('aria-expanded') === 'true';
            setMobileFiltersExpanded(!expanded);
        });

        closeFiltersButton?.addEventListener('click', () => {
            setMobileFiltersExpanded(false);
        });

        filtersSubmitButton?.addEventListener('click', () => {
            if (filtersForm.classList.contains('is-expanded')) {
                setMobileFiltersExpanded(false);
            }
        });

        filtersForm.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && filtersForm.classList.contains('is-expanded')) {
                event.preventDefault();
                setMobileFiltersExpanded(false);
            }
        });
    }

    const setExtraFiltersOpen = (isOpen) => {
        if (!moreFiltersButton || !extraFilters) return;

        moreFiltersButton.setAttribute('aria-expanded', String(isOpen));
        extraFilters.hidden = !isOpen;
        mapSection?.classList.toggle('is-extra-filters-open', isOpen);

        if (isOpen) {
            extraFiltersCloseButton?.focus({ preventScroll: true });
        } else {
            moreFiltersButton.focus({ preventScroll: true });
        }
    };

    if (extraFilters) {
        const rangeFilters = Array.from(extraFilters.querySelectorAll('[data-range-filter]'));

        rangeFilters.forEach((rangeFilter) => {
            const minRange = rangeFilter.querySelector('[data-range-min]');
            const maxRange = rangeFilter.querySelector('[data-range-max]');
            const minNumber = rangeFilter.querySelector('[data-range-number="min"]');
            const maxNumber = rangeFilter.querySelector('[data-range-number="max"]');

            if (!minRange || !maxRange || !minNumber || !maxNumber) return;

            const updateRange = (source) => {
                if (Number(minRange.value) > Number(maxRange.value)) {
                    if (source === minRange || source === minNumber) {
                        maxRange.value = minRange.value;
                    } else {
                        minRange.value = maxRange.value;
                    }
                }

                minNumber.value = minRange.value;
                maxNumber.value = maxRange.value;

                const min = Number(minRange.min);
                const max = Number(minRange.max);
                const span = max - min || 1;
                const start = ((Number(minRange.value) - min) / span) * 100;
                const end = ((Number(maxRange.value) - min) / span) * 100;

                rangeFilter.style.setProperty('--range-start', `${start}%`);
                rangeFilter.style.setProperty('--range-end', `${end}%`);
            };

            [minRange, maxRange].forEach((input) => {
                input.addEventListener('input', () => updateRange(input));
            });
            [minNumber, maxNumber].forEach((input) => {
                input.addEventListener('input', () => {
                    const target = input === minNumber ? minRange : maxRange;
                    target.value = input.value;
                    updateRange(input);
                });
            });

            updateRange();
        });

        extraFilters.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !extraFilters.hidden) {
                event.preventDefault();
                event.stopPropagation();
                setExtraFiltersOpen(false);
            }
        });
    }

    if (moreFiltersButton && extraFilters) {
        moreFiltersButton.addEventListener('click', () => {
            setExtraFiltersOpen(moreFiltersButton.getAttribute('aria-expanded') !== 'true');
        });

        extraFiltersCloseButton?.addEventListener('click', () => {
            setExtraFiltersOpen(false);
        });

        extraFiltersSubmitButton?.addEventListener('click', () => {
            setExtraFiltersOpen(false);
        });
    }

    if (closeCardButton && mapCard) {
        closeCardButton.addEventListener('click', () => {
            mapCard.hidden = true;
        });
    }

    const catalog = root.querySelector('.objects-catalog');
    const catalogTitles = Array.from(catalog?.querySelectorAll('.objects-catalog__title') || []);
    let titleSyncFrame = 0;

    const syncCatalogTitleHeights = () => {
        if (!catalogTitles.length || catalog?.hidden) return;

        catalogTitles.forEach((title) => {
            title.style.minHeight = '';
        });

        const maxTitleHeight = Math.max(...catalogTitles.map((title) => title.getBoundingClientRect().height));
        catalogTitles.forEach((title) => {
            title.style.minHeight = `${maxTitleHeight}px`;
        });
    };

    const scheduleCatalogTitleSync = () => {
        if (titleSyncFrame) cancelAnimationFrame(titleSyncFrame);
        titleSyncFrame = requestAnimationFrame(() => {
            titleSyncFrame = 0;
            syncCatalogTitleHeights();
        });
    };

    window.addEventListener('resize', scheduleCatalogTitleSync);
    document.fonts?.ready.then(scheduleCatalogTitleSync);

    viewControls.forEach((control) => {
        control.addEventListener('click', () => {
            const selectedView = control.dataset.objectsView;
            const showCards = selectedView === 'cards';

            viewControls.forEach((item) => {
                const isActive = item.dataset.objectsView === selectedView;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });

            if (mapSection) mapSection.classList.toggle('is-cards-view', showCards);
            if (catalog) catalog.hidden = !showCards;
            if (showCards) scheduleCatalogTitleSync();
        });
    });


    const drawingsSection = root.querySelector('.objects-drawings');
    if (drawingsSection) {
        const dots = Array.from(drawingsSection.querySelectorAll('.objects-drawings__dot'));
        const previous = drawingsSection.querySelector('.objects-drawings__arrow--previous');
        const next = drawingsSection.querySelector('.objects-drawings__arrow--next');
        const pagination = drawingsSection.querySelector('.objects-drawings__pagination');
        let activeDrawing = 0;

        const selectDrawing = (index) => {
            if (!dots.length) return;
            activeDrawing = Math.max(0, Math.min(dots.length - 1, index));
            dots.forEach((dot, dotIndex) => {
                const active = dotIndex === activeDrawing;
                dot.classList.toggle('is-active', active);
                if (active) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
            if (pagination) pagination.setAttribute('aria-label', `Слайд ${activeDrawing + 1} из ${dots.length}`);
            const cards = Array.from(drawingsSection.querySelectorAll('.objects-drawings__card'));
            const track = drawingsSection.querySelector('.objects-drawings__grid');
            if (track && cards[activeDrawing]) {
                track.scrollLeft = cards[activeDrawing].offsetLeft - track.offsetLeft;
            }
            if (previous) previous.disabled = activeDrawing === 0;
            if (next) next.disabled = activeDrawing === dots.length - 1;
        };

        dots.forEach((dot, index) => dot.addEventListener('click', () => selectDrawing(index)));
        if (previous) previous.addEventListener('click', () => selectDrawing(activeDrawing - 1));
        if (next) next.addEventListener('click', () => selectDrawing(activeDrawing + 1));
    }

    const videoSection = root.querySelector('.objects-video');
    if (videoSection) {
        const dots = Array.from(videoSection.querySelectorAll('.objects-video__dot'));
        const previous = videoSection.querySelector('.objects-video__arrow--previous');
        const next = videoSection.querySelector('.objects-video__arrow--next');
        const pagination = videoSection.querySelector('.objects-video__pagination');
        let activeSlide = 0;
        const selectSlide = (index) => {
            activeSlide = Math.max(0, Math.min(dots.length - 1, index));
            dots.forEach((dot, dotIndex) => {
                const active = dotIndex === activeSlide;
                dot.classList.toggle('is-active', active);
                if (active) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
            if (pagination) pagination.setAttribute('aria-label', `Слайд ${activeSlide + 1} из ${dots.length}`);
            if (previous) previous.disabled = activeSlide === 0;
            if (next) next.disabled = activeSlide === dots.length - 1;
        };
        dots.forEach((dot, index) => dot.addEventListener('click', () => selectSlide(index)));
        if (previous) previous.addEventListener('click', () => selectSlide(activeSlide - 1));
        if (next) next.addEventListener('click', () => selectSlide(activeSlide + 1));
    }
}
