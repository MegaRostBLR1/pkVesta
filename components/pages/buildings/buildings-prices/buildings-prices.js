/* Инициализация страницы «Цены». */
function initBuildingsPrices() {
  const tabs = document.querySelector(".buildings-agro__tabs");
  const toggle = tabs?.querySelector(".buildings-agro__tabs-toggle");
  if (tabs && toggle && tabs.dataset.initialized !== "true") {
    tabs.dataset.initialized = "true";

    const setExpanded = (isExpanded) => {
      tabs.classList.toggle("is-open", isExpanded);
      toggle.setAttribute("aria-expanded", String(isExpanded));
      toggle.setAttribute("aria-label", isExpanded ? "Закрыть разделы агрокомплекса" : "Открыть разделы агрокомплекса");
    };

    tabs.addEventListener("click", (event) => {
      if (!window.matchMedia("(max-width: 680px)").matches) {
        return;
      }

      const link = event.target.closest(".buildings-agro__tab");
      const isExpanded = tabs.classList.contains("is-open");

      // В закрытом меню видна только текущая вкладка: нажатие на неё открывает список, а не переходит по ссылке.
      // В открытом меню переход по любой вкладке закрывает список
      if (link && !isExpanded) {
        event.preventDefault();
      }

      setExpanded(!isExpanded);
    });

  }

  // Кнопка «Наверх» появляется, когда пролистали больше экрана
  const scrollTopButton = document.querySelector(".scroll-top");

  if (scrollTopButton && scrollTopButton.dataset.initialized !== "true") {
    scrollTopButton.dataset.initialized = "true";

    const updateScrollTop = () => {
      const isScrolled = window.scrollY > window.innerHeight * 2;

      scrollTopButton.classList.toggle("is-visible", isScrolled);
    };

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", updateScrollTop, { passive: true });
    updateScrollTop();
  }

  // Фильтры цен (код со страницы «Цены»): на десктопе — кнопки и выпадающие списки,
  // на ≤1200 — кнопка «Параметры» с попапом. Выбранное значение синхронизируется везде
  const pricesFilters = document.querySelector(".prices__table-container");

  if (pricesFilters && pricesFilters.dataset.initialized !== "true") {
    pricesFilters.dataset.initialized = "true";

    const filterButtons = document.querySelectorAll(".filter-dropdown__button[data-filter-type]");
    const mobileButton = document.querySelector(".mob-filter-button");
    const overlay = document.querySelector("#prices-filter-dialog");
    const dialog = overlay?.querySelector(".mob-filter-dialog");
    const closeButton = overlay?.querySelector(".mob-filter-dialog__close");
    const backButton = overlay?.querySelector(".mob-filter-overlay__back");
    const showMoreButtons = overlay?.querySelectorAll("[data-expand-list]");
    const prefixes = {};
    let previousFocus = null;

    /* ===== Общие функции ===== */

    // Кнопка «Параметры» показывает выбранные ширину и высоту: «Параметры: (Ш: 12м, В: 4м)»
    const filterSummary = mobileButton?.querySelector(".mob-filter-button__values");

    const updateFilterSummary = () => {
      if (!filterSummary) return;
      const value = (type) =>
        (overlay?.querySelector('[data-filter-list="' + type + '"] .is-selected')?.dataset.filterValue || "").replace(/\s+/g, "");
      filterSummary.textContent = "(Ш: " + value("width") + ", В: " + value("height") + ")";
    };

    const closeMenus = (exceptButton = null) => {
      filterButtons.forEach((button) => {
        if (button === exceptButton) return;
        button.setAttribute("aria-expanded", "false");
        const menu = document.getElementById(button.getAttribute("aria-controls"));
        if (menu) menu.hidden = true;
      });
    };

    const syncLabel = (button, prefix, value) => {
      const label = button.querySelector("span");
      if (!label) return;
      const text = value && value !== "Все" ? value : "";
      label.textContent = prefix && text ? prefix + " " + text : prefix || text;
    };

    // выбирает значение сразу везде: десктопные кнопки, выпадающие списки и мобильный фильтр
    const setFilter = (type, value) => {

      document.querySelectorAll('[data-segmented="' + type + '"] .prices__option').forEach((item) => {
        const active = item.dataset.filterValue === value;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      const dropdownButton = document.querySelector('.filter-dropdown__button[data-filter-type="' + type + '"]');
      const menu = dropdownButton && document.getElementById(dropdownButton.getAttribute("aria-controls"));
      menu?.querySelectorAll(".filter-dropdown__option").forEach((item) => {
        const active = item.dataset.filterValue === value;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-selected", String(active));
      });
      if (dropdownButton) syncLabel(dropdownButton, prefixes[type], value);

      overlay?.querySelectorAll('[data-filter-list="' + type + '"] .mob-filter-dialog__option').forEach((item) => {
        const active = item.dataset.filterValue === value;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-pressed", String(active));
      });

      updateFilterSummary();
    };

    /* ===== Десктоп: выпадающие списки ===== */

    filterButtons.forEach((button) => {
      const type = button.dataset.filterType;
      const menu = document.getElementById(button.getAttribute("aria-controls"));
      prefixes[type] = button.dataset.label ?? (button.querySelector("span")?.textContent.trim() || "");

      button.addEventListener("click", () => {
        const shouldOpen = button.getAttribute("aria-expanded") !== "true";
        closeMenus(button);
        button.setAttribute("aria-expanded", String(shouldOpen));
        if (menu) menu.hidden = !shouldOpen;
      });

      menu?.querySelectorAll(".filter-dropdown__option").forEach((option) => {
        option.addEventListener("click", () => {
          setFilter(type, option.dataset.filterValue || "");
          closeMenus();
        });
      });
    });

    /* ===== Десктоп: регион и кровля ===== */

    document.querySelectorAll(".prices__segmented[data-segmented]").forEach((group) => {
      const type = group.dataset.segmented;
      group.querySelectorAll(".prices__option").forEach((option) => {
        option.addEventListener("click", () => setFilter(type, option.dataset.filterValue || ""));
      });
    });

    /* ===== Мобильный фильтр ===== */

    overlay?.querySelectorAll("[data-filter-list]").forEach((list) => {
      const type = list.dataset.filterList;
      list.querySelectorAll(".mob-filter-dialog__option").forEach((option) => {
        option.addEventListener("click", () => setFilter(type, option.dataset.filterValue || ""));
      });
    });

    // В свёрнутом списке видны первые 3 значения, остальные прячутся.
    // Кнопка «Показать еще» нужна, только если значений больше трёх
    const visibleOptions = 3;

    const updateShowMore = () => {
      showMoreButtons?.forEach((button) => {
        const list = overlay?.querySelector('[data-filter-list="' + button.dataset.expandList + '"]');
        if (!list) return;
        const options = list.querySelectorAll(".mob-filter-dialog__option");
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.hidden = options.length <= visibleOptions;
        options.forEach((option, index) => {
          option.hidden = !expanded && index >= visibleOptions;
        });
      });
    };

    const openDialog = () => {
      if (!overlay || !dialog) return;
      previousFocus = document.activeElement;
      overlay.hidden = false;
      mobileButton?.setAttribute("aria-expanded", "true");
      document.body.classList.add("prices-filters-open");
      updateShowMore();
      closeButton?.focus();
    };

    const closeDialog = () => {
      if (!overlay || overlay.hidden) return;
      overlay.hidden = true;
      mobileButton?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("prices-filters-open");
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };

    mobileButton?.addEventListener("click", openDialog);
    closeButton?.addEventListener("click", closeDialog);
    backButton?.addEventListener("click", closeDialog);
    overlay?.addEventListener("click", (event) => {
      if (event.target === overlay) closeDialog();
    });

    showMoreButtons?.forEach((button) => {
      button.addEventListener("click", () => {
        const list = overlay?.querySelector('[data-filter-list="' + button.dataset.expandList + '"]');
        const expanded = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(expanded));
        if (list) list.classList.toggle("is-expanded", expanded);
        const label = button.querySelector("span");
        if (label) label.textContent = expanded ? "Скрыть" : "Показать еще";
        updateShowMore();
      });
    });

    // при переходе на десктоп (шире 1200px) закрываем мобильный фильтр
    window.matchMedia("(min-width: 1201px)").addEventListener?.("change", (event) => {
      if (event.matches) closeDialog();
    });

    /* ===== Клики вне меню и клавиатура ===== */

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".filter-dropdown")) closeMenus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenus();
        closeDialog();
      }
      if (event.key === "Tab" && overlay && !overlay.hidden) {
        const focusable = Array.from(
          overlay.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        ).filter((element) => element.getClientRects().length > 0);
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

    updateFilterSummary();
  }

  document.querySelectorAll("#app-main .accordion__btn").forEach((btn) => {
    if (btn.dataset.initialized === "true") return;
    btn.dataset.initialized = "true";

    const body = document.getElementById(btn.getAttribute("aria-controls"));
    if (!body) return;

    const sync = (expanded) => {
      btn.setAttribute("aria-expanded", String(expanded));
      body.classList.toggle("is-open", expanded);
    };

    sync(btn.getAttribute("aria-expanded") === "true");

    btn.addEventListener("click", () => {
      sync(btn.getAttribute("aria-expanded") !== "true");
    });
  });

  const advantages = document.querySelector(".buildings-advantages");
  const advantagesList = advantages?.querySelector(".buildings-advantages__list");
  const advantagesPrev = advantages?.querySelector(".slider-controls__arrow--prev");
  const advantagesNext = advantages?.querySelector(".slider-controls__arrow--next");

  if (advantagesList && advantagesPrev && advantagesNext && advantages.dataset.sliderInitialized !== "true") {
    advantages.dataset.sliderInitialized = "true";

    const isVertical = () => getComputedStyle(advantagesList).flexDirection === "column";

    // Стрелки активны, только когда часть пунктов не влезла
    const updateAdvantagesArrows = () => {
      const hasHiddenItems = isVertical()
        ? advantagesList.scrollHeight - advantagesList.clientHeight > 1
        : advantagesList.scrollWidth - advantagesList.clientWidth > 1;

      advantagesPrev.disabled = !hasHiddenItems;
      advantagesNext.disabled = !hasHiddenItems;
    };

    // Листает на один пункт. С последнего переходит на первый, с первого — на последний
    const scrollAdvantages = (direction) => {
      const side = isVertical() ? "top" : "left";
      const position = side === "top" ? advantagesList.scrollTop : advantagesList.scrollLeft;
      const max =
        side === "top"
          ? advantagesList.scrollHeight - advantagesList.clientHeight
          : advantagesList.scrollWidth - advantagesList.clientWidth;
      const listStart = advantagesList.getBoundingClientRect()[side];
      // Где начинается каждый видимый пункт внутри списка
      const starts = Array.from(advantagesList.children)
        .filter((item) => item.getClientRects().length)
        .map((item) => item.getBoundingClientRect()[side] - listStart + position);
      let target;

      if (direction > 0) {
        target = position >= max - 1 ? 0 : starts.find((start) => start > position + 1) ?? max;
      } else {
        target = position <= 1 ? max : starts.filter((start) => start < position - 1).pop() ?? 0;
      }

      advantagesList.scrollTo({ [side]: target, behavior: "smooth" });
    };

    advantagesPrev.addEventListener("click", () => scrollAdvantages(-1));
    advantagesNext.addEventListener("click", () => scrollAdvantages(1));

    // Раскрытая карточка может быть выше списка (больше 4 пунктов) — тогда список вырастает под неё,
    // чтобы текст не обрезался. Когда такие карточки свёрнуты, список снова высотой в 4 пункта
    const fitOpenItems = () => {
      advantagesList.style.maxHeight = "";

      if (!isVertical()) {
        return;
      }

      // Полная высота раскрытой карточки, даже если анимация ещё не закончилась
      const openHeights = Array.from(
        advantagesList.querySelectorAll('.accordion__btn[aria-expanded="true"]'),
        (button) => {
          const item = button.closest(".buildings-advantages__item");
          const inner = item.querySelector(".accordion__inner");

          return item.offsetHeight + (inner ? inner.scrollHeight - inner.clientHeight : 0);
        }
      );
      const tallest = Math.max(0, ...openHeights);

      if (tallest > advantagesList.clientHeight) {
        advantagesList.style.maxHeight = `${tallest}px`;
      }
    };

    // Пока раскрытая карточка растёт (анимация аккордеона — 0.3s), прокручиваем список вместе с ней:
    // низ карточки не уходит за край списка, а её верх не уезжает выше списка
    const followItem = (item) => {
      const start = performance.now();

      const step = (now) => {
        const listRect = advantagesList.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const shift = Math.min(itemRect.bottom - listRect.bottom, itemRect.top - listRect.top);

        if (shift > 0) {
          advantagesList.scrollTop += shift;
        }

        if (now - start < 350) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    // На десктопе высота списка меняется вместе с карточкой (transition в CSS), а раскрытая карточка не уходит за край
    advantagesList.addEventListener("click", (event) => {
      const button = event.target.closest(".accordion__btn");

      if (!button || !isVertical()) {
        return;
      }

      fitOpenItems();

      if (button.getAttribute("aria-expanded") === "true") {
        followItem(button.closest(".buildings-advantages__item"));
      }
    });

    // На ≤1100 ряд карточек растягивается по высоте самой высокой карточки. Если раскрытая карточка ушла за край ленты,
    // под видимыми карточками остаётся пустое место. Поэтому раскрытые карточки за краем ленты сворачиваем
    const closeHiddenItems = () => {
      if (isVertical()) {
        return;
      }

      const listRect = advantagesList.getBoundingClientRect();

      advantagesList.querySelectorAll('.accordion__btn[aria-expanded="true"]').forEach((button) => {
        const itemRect = button.closest(".buildings-advantages__item").getBoundingClientRect();

        if (itemRect.right <= listRect.left || itemRect.left >= listRect.right) {
          button.click();
        }
      });
    };

    advantagesList.addEventListener("scroll", closeHiddenItems, { passive: true });
    window.addEventListener("resize", () => {
      fitOpenItems();
      updateAdvantagesArrows();
      closeHiddenItems();
    });
    updateAdvantagesArrows();
  }

  const catalog = document.querySelector(".buildings-catalog");
  const catalogCards = catalog?.querySelector(".buildings-catalog__cards");
  const catalogPrev = catalog?.querySelector(".slider-controls__arrow--prev");
  const catalogNext = catalog?.querySelector(".slider-controls__arrow--next");

  if (catalogCards && catalogPrev && catalogNext && catalog.dataset.sliderInitialized !== "true") {
    catalog.dataset.sliderInitialized = "true";

    // Стрелки активны, только когда часть карточек не влезла
    const updateArrows = () => {
      const hasHiddenCards = catalogCards.scrollWidth - catalogCards.clientWidth > 1;

      catalogPrev.disabled = !hasHiddenCards;
      catalogNext.disabled = !hasHiddenCards;
    };

    // Листает на одну карточку. С последней переходит на первую, с первой — на последнюю
    const scrollCards = (direction) => {
      const maxLeft = catalogCards.scrollWidth - catalogCards.clientWidth;
      // Шаг — ширина карточки плюс отступ между карточками
      const step =
        catalogCards.firstElementChild.getBoundingClientRect().width +
        parseFloat(getComputedStyle(catalogCards).columnGap);
      let left = (Math.round(catalogCards.scrollLeft / step) + direction) * step;

      if (direction > 0 && catalogCards.scrollLeft >= maxLeft - 1) {
        left = 0;
      } else if (direction < 0 && catalogCards.scrollLeft <= 1) {
        left = maxLeft;
      }

      catalogCards.scrollTo({ left, behavior: "smooth" });
    };

    catalogPrev.addEventListener("click", () => scrollCards(-1));
    catalogNext.addEventListener("click", () => scrollCards(1));

    // Свайп листает ленту сам, без JS. Здесь только круг:
    // свайп дальше последней карточки ведёт на первую, дальше первой — на последнюю
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartLeft = 0;

    catalogCards.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchStartLeft = catalogCards.scrollLeft;
      },
      { passive: true }
    );

    catalogCards.addEventListener("touchend", (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      const maxLeft = catalogCards.scrollWidth - catalogCards.clientWidth;

      // Короткое или вертикальное движение пальца — не свайп по ленте
      if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }

      if (deltaX < 0 && touchStartLeft >= maxLeft - 1) {
        scrollCards(1);
      } else if (deltaX > 0 && touchStartLeft <= 1) {
        scrollCards(-1);
      }
    });

    window.addEventListener("resize", updateArrows);
    updateArrows();
  }
}
