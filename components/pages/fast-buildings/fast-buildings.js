function initFastBuildings() {

  const characteristics = document.querySelector('.fast-buildings-characteristics');
  const characteristicsMore = characteristics?.querySelector('.fast-buildings-characteristics__more');
  const characteristicsTable = characteristics?.querySelector('.fast-buildings-characteristics__table');

  if (characteristicsMore && characteristicsTable && !characteristicsMore.dataset.initialized) {
    characteristicsMore.addEventListener('click', () => {
      const expanded = characteristicsMore.getAttribute('aria-expanded') === 'true';
      characteristicsMore.setAttribute('aria-expanded', String(!expanded));
      characteristicsTable.classList.toggle('is-expanded', !expanded);
      characteristicsMore.querySelector('span').textContent = expanded ? 'Показать еще' : 'Скрыть';
    });
    characteristicsMore.dataset.initialized = 'true';
  }


  const factors = document.querySelector('.fast-buildings-factors');
  const factorsGrid = factors?.querySelector('.fast-buildings-factors__grid');
  const factorsMore = factors?.querySelector('.fast-buildings-factors__more');

  if (factorsGrid && factorsMore && !factorsMore.dataset.initialized) {
    factorsMore.addEventListener('click', () => {
      const expanded = factorsMore.getAttribute('aria-expanded') === 'true';
      factorsMore.setAttribute('aria-expanded', String(!expanded));
      factorsGrid.classList.toggle('is-expanded', !expanded);
      factorsMore.querySelector('span').textContent = expanded ? 'Показать еще' : 'Скрыть';
    });
    factorsMore.dataset.initialized = 'true';
  }

  const comfort = document.querySelector('.fast-buildings-comfort');

  if (comfort && !comfort.dataset.accordionInitialized) {
    const comfortItems = Array.from(comfort.querySelectorAll('.fast-buildings-comfort__item'));

    comfortItems.forEach((item) => {
      const toggle = item.querySelector('.fast-buildings-comfort__item-heading button');
      const description = item.querySelector('.fast-buildings-comfort__description');

      if (!toggle || !description) {
        return;
      }

      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute('aria-expanded', String(!expanded));
        description.hidden = expanded;
        item.classList.toggle('fast-buildings-comfort__item--active', !expanded);
      });
    });

    comfort.dataset.accordionInitialized = 'true';
  }


  const complectation = document.querySelector('.fast-buildings-complectation');

  if (complectation && !complectation.dataset.accordionInitialized) {
    const content = complectation.querySelector('.fast-buildings-complectation__content');
    const overlay = complectation.querySelector('.fast-buildings-complectation__overlay');
    const listAreas = Array.from(complectation.querySelectorAll('.fast-buildings-complectation__list-area'));
    const items = Array.from(complectation.querySelectorAll('.fast-buildings-complectation__item'));
    const tabs = Array.from(complectation.querySelectorAll('[data-category-tab]'));
    const compactMode = window.matchMedia('(max-width: 1300px)');
    const mobileMode = window.matchMedia('(max-width: 600px)');
    const panels = new Map(items.map((item) => [
      item,
      item.querySelector('.fast-buildings-complectation__panel')
    ]));

    const restorePanel = (item, panel) => {
      if (!panel || !item) {
        return;
      }

      if (overlay && panel.parentElement === overlay) {
        item.appendChild(panel);
      }

      panel.style.removeProperty('top');
      panel.style.removeProperty('left');
      panel.style.removeProperty('width');
    };

    const positionOverlayPanel = (item, panel) => {
      if (!content || !overlay || !compactMode.matches || panel.parentElement !== overlay) {
        return;
      }

      const itemRect = item.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const panelWidth = mobileMode.matches ? Math.min(240, contentRect.width) : itemRect.width;

      panel.style.width = panelWidth + 'px';

      const left = mobileMode.matches
        ? (contentRect.width - panelWidth) / 2 - 5
        : itemRect.left - contentRect.left + (itemRect.width - panelWidth) / 2;
      const top = itemRect.bottom - contentRect.top - panel.offsetHeight;

      panel.style.left = Math.max(0, Math.min(left, content.clientWidth - panelWidth)) + 'px';
      panel.style.top = Math.max(0, top) + 'px';
    };

    const getExpandedItem = () => items.find((item) => (
      item.classList.contains('fast-buildings-complectation__item--expanded')
    ));

    const updateExpandedState = (selectedItem) => {
      items.forEach((item) => {
        const toggle = item.querySelector('.fast-buildings-complectation__toggle');
        const panel = panels.get(item);
        if (!toggle || !panel) {
          return;
        }

        restorePanel(item, panel);
        const expanded = item === selectedItem;
        toggle.setAttribute('aria-expanded', String(expanded));
        panel.setAttribute('aria-hidden', String(!expanded));
        panel.classList.toggle('is-collapsed', !expanded);
        item.classList.toggle('fast-buildings-complectation__item--expanded', expanded);

        const overlayToggle = panel.querySelector('[data-overlay-toggle]');
        overlayToggle?.setAttribute('aria-expanded', String(expanded));
      });

      content?.classList.toggle('has-expanded', Boolean(selectedItem));

      if (selectedItem && compactMode.matches && overlay) {
        const panel = panels.get(selectedItem);
        if (panel) {
          overlay.appendChild(panel);
          positionOverlayPanel(selectedItem, panel);
        }
      }
    };

    const activateCategory = (category) => {
      const selectedArea = listAreas.find((area) => area.dataset.categoryPanel === category);
      if (!selectedArea) {
        return;
      }

      listAreas.forEach((area) => {
        const active = area === selectedArea;
        area.hidden = !active;
        area.setAttribute('aria-hidden', String(!active));
      });

      tabs.forEach((tab) => {
        const active = tab.dataset.categoryTab === category;
        tab.classList.toggle('fast-buildings-complectation__category--active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      const list = selectedArea.querySelector('.fast-buildings-complectation__list');
      if (list) {
        list.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }

      const initiallyExpanded = category === 'cladding'
        ? selectedArea.querySelector('.fast-buildings-complectation__item')
        : null;
      updateExpandedState(initiallyExpanded);
    };

    const syncOverlayPanel = () => {
      const item = getExpandedItem();
      const panel = item ? panels.get(item) : null;

      if (item && panel && panel.parentElement === overlay) {
        positionOverlayPanel(item, panel);
      }
    };

    const syncResponsiveLayout = () => {
      const item = getExpandedItem();
      const panel = item ? panels.get(item) : null;

      if (!item || !panel) {
        return;
      }

      if (compactMode.matches) {
        if (panel.parentElement !== overlay) {
          overlay?.appendChild(panel);
        }
        positionOverlayPanel(item, panel);
      } else {
        restorePanel(item, panel);
      }

      content?.classList.toggle('has-expanded', true);
    };

    items.forEach((item) => {
      const toggle = item.querySelector('.fast-buildings-complectation__toggle');
      const panel = panels.get(item);
      const overlayToggle = panel?.querySelector('[data-overlay-toggle]');

      toggle?.addEventListener('click', () => {
        const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
        updateExpandedState(shouldOpen ? item : null);
      });

      overlayToggle?.addEventListener('click', () => {
        updateExpandedState(null);
      });
    });

    tabs.forEach((tab) => {
      if (tab.disabled) {
        return;
      }

      tab.addEventListener('click', () => {
        activateCategory(tab.dataset.categoryTab);
      });

      tab.addEventListener('keydown', (event) => {
        const availableTabs = tabs.filter((candidate) => !candidate.disabled);
        const currentIndex = availableTabs.indexOf(tab);
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % availableTabs.length;
        } else if (event.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + availableTabs.length) % availableTabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = availableTabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        const nextTab = availableTabs[nextIndex];
        nextTab.focus();
        activateCategory(nextTab.dataset.categoryTab);
      });
    });

    listAreas.forEach((area) => {
      const list = area.querySelector('.fast-buildings-complectation__list');
      if (!list) {
        return;
      }

      list.addEventListener('scroll', syncOverlayPanel, { passive: true });

      area.querySelectorAll('[data-list-direction]').forEach((control) => {
        control.addEventListener('click', () => {
          const direction = control.dataset.listDirection === 'previous' ? -1 : 1;
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const behavior = reducedMotion ? 'auto' : 'smooth';

          if (compactMode.matches) {
            list.scrollBy({ left: direction * list.clientWidth * 0.72, behavior });
          } else {
            list.scrollBy({ top: direction * list.clientHeight * 0.72, behavior });
          }
        });
      });
    });

    window.addEventListener('resize', syncResponsiveLayout, { passive: true });
    compactMode.addEventListener('change', syncResponsiveLayout);

    // В макете по умолчанию все карточки каркасов свернуты.
    // При переходе в категорию «Обшивка» первая карточка раскрывается, как в Figma.
    updateExpandedState(null);
    complectation.dataset.accordionInitialized = 'true';
  }

  const page = document.querySelector('.fast-buildings');

  if (page) {
    page.dataset.initialized = 'true';
  }

  const catalog = document.querySelector('.fast-buildings-catalog');

  if (!catalog || catalog.dataset.carouselInitialized) {
    return;
  }

  const previous = catalog.querySelector('.slider-controls__arrow--prev');
  const next = catalog.querySelector('.slider-controls__arrow--next');
  const dots = Array.from(catalog.querySelectorAll('.slider-controls__dot'));
  const cards = Array.from(catalog.querySelectorAll('.fast-buildings-catalog__card'));
  let activeIndex = 0;

  const updateCarousel = (index) => {
    activeIndex = Math.max(0, Math.min(index, cards.length - 1));

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('slider-controls__dot--active', dotIndex === activeIndex);
    });

    if (window.matchMedia('(max-width: 1300px)').matches && cards[activeIndex]) {
      cards[activeIndex].scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  };

  previous.addEventListener('click', () => updateCarousel(activeIndex - 1));
  next.addEventListener('click', () => updateCarousel(activeIndex + 1));
  catalog.dataset.carouselInitialized = 'true';
}
