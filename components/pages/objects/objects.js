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
    const moreFiltersButton = root.querySelector('.objects-map__more');
    const extraFilters = root.querySelector('.objects-map__extra-filters');
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

        const closeDropdown = (dropdown, returnFocus = false) => {
            if (!dropdown) return;
            const trigger = dropdown.querySelector('.objects-map__select-trigger');
            const options = dropdown.querySelector('.objects-map__select-options');
            dropdown.classList.remove('is-open');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            if (options) options.hidden = true;
            if (returnFocus && trigger) trigger.focus();
            if (openDropdown === dropdown) openDropdown = null;
        };

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
                item.textContent = option.textContent;
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
                        closeDropdown(dropdown, true);
                        return;
                    } else if (event.key === 'Tab') {
                        closeDropdown(dropdown);
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
            if (openDropdown && !openDropdown.contains(event.target)) closeDropdown(openDropdown);
        });
        filtersForm.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && openDropdown) closeDropdown(openDropdown, true);
        });
    }

    if (mobileFiltersToggle && filtersForm) {
        mobileFiltersToggle.addEventListener('click', () => {
            const expanded = mobileFiltersToggle.getAttribute('aria-expanded') === 'true';
            mobileFiltersToggle.setAttribute('aria-expanded', String(!expanded));
            filtersForm.classList.toggle('is-expanded', !expanded);
            if (extraFilters) {
                extraFilters.hidden = expanded;
            }
        });
    }

    if (moreFiltersButton && extraFilters) {
        moreFiltersButton.addEventListener('click', () => {
            const expanded = moreFiltersButton.getAttribute('aria-expanded') === 'true';
            moreFiltersButton.setAttribute('aria-expanded', String(!expanded));
            extraFilters.hidden = expanded;
        });
    }

    if (closeCardButton && mapCard) {
        closeCardButton.addEventListener('click', () => {
            mapCard.hidden = true;
        });
    }

    viewControls.forEach((control) => {
        control.addEventListener('click', () => {
            const selectedView = control.dataset.objectsView;

            viewControls.forEach((item) => {
                const isActive = item.dataset.objectsView === selectedView;

                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });
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
