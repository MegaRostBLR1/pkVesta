function initVideo() {
  const filterButtons = document.querySelectorAll(".video-page__filter-button[data-filter-type]");

  const closeMenus = (exceptButton = null) => {
    filterButtons.forEach((button) => {
      if (button === exceptButton) return;
      button.setAttribute("aria-expanded", "false");
      const menu = document.getElementById(button.getAttribute("aria-controls"));
      if (menu) menu.hidden = true;
    });
  };

  filterButtons.forEach((button) => {
    const type = button.dataset.filterType;
    const menu = document.getElementById(button.getAttribute("aria-controls"));

    button.addEventListener("click", () => {
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";
      closeMenus(button);
      button.setAttribute("aria-expanded", String(shouldOpen));
      if (menu) menu.hidden = !shouldOpen;
    });

    menu?.querySelectorAll(".video-page__filter-option").forEach((option) => {
      option.addEventListener("click", () => {
        menu.querySelectorAll(".video-page__filter-option").forEach((item) => {
          const selected = item === option;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-selected", String(selected));
        });

        const label = button.querySelector("span");
        if (label) label.textContent = typeLabel(type) + " " + (option.dataset.filterValue || "");
        closeMenus();
      });
    });
  });

  function typeLabel(type) {
    const labels = {
      years: "Год:",
      countries: "Страна:",
      regions: "Регион:",
      segments: "Сегменты:",
      technology: "Технология:",
    };
    return labels[type] || "";
  }

  const loadMoreButton = document.querySelector(".press-center__load-more");
  const cardsContainer = document.querySelector(".video-page__grid");

  if (loadMoreButton && cardsContainer) {
    function checkButtonVisibility() {
      const totalCards = cardsContainer.querySelectorAll(".video-page__card").length;

      let visibleByDefault = 6;
      if (window.matchMedia("(max-width: 1300px)").matches) visibleByDefault = 4;
      if (window.matchMedia("(max-width: 680px)").matches) visibleByDefault = 1;

      loadMoreButton.hidden = totalCards <= visibleByDefault;
    }

    loadMoreButton.addEventListener("click", () => {
      const isExpanded = loadMoreButton.getAttribute("aria-expanded") === "true";
      loadMoreButton.setAttribute("aria-expanded", String(!isExpanded));
      loadMoreButton.textContent = isExpanded ? "Показать еще" : "Скрыть";

      cardsContainer.classList.toggle("is-expanded", !isExpanded);
    });

    checkButtonVisibility();
    window.addEventListener("resize", checkButtonVisibility);
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".video-page__filter-dropdown")) closeMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenus();
  });

  const mobileFilterButton = document.querySelector(".press__mobile-filter-button");
  const mobileFilterOverlay = document.querySelector("#video-mobile-filter");

  if (mobileFilterButton && mobileFilterOverlay) {
    const mobileFilterCloseButton = mobileFilterOverlay.querySelector(".press__filter-dialog-close");
    const mobileFilterBackButton = mobileFilterOverlay.querySelector(".press__filter-back");
    const showMoreButtons = mobileFilterOverlay.querySelectorAll("[data-expand-list]");
    const desktopQuery = window.matchMedia("(min-width: 681px)");

    const ALL = "Все";
    const selected = { years: "", countries: "", regions: "", segments: "", technology: "" };
    let previousFocus = null;

    const toValue = (raw) => (raw === ALL ? "" : raw ?? "");

    const applyFilters = () => {
      // Здесь фильтрация карточек или запрос на сервер. Текущие значения лежат в selected.
    };

    const renderList = (type) => {
      const list = mobileFilterOverlay.querySelector('[data-filter-list="' + type + '"]');
      list?.querySelectorAll(".press__filter-option").forEach((option) => {
        const raw = option.dataset.filterValue;
        const active = raw !== undefined && toValue(raw) === selected[type];
        option.classList.toggle("is-selected", active);
        option.setAttribute("aria-pressed", String(active));
      });
    };

    const getFocusable = () =>
      [
        ...mobileFilterOverlay.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((element) => element.getClientRects().length > 0);

    // Кнопка «Показать еще» нужна, только если список реально не помещается
    const updateShowMore = () => {
      showMoreButtons.forEach((button) => {
        const list = mobileFilterOverlay.querySelector('[data-filter-list="' + button.dataset.expandList + '"]');
        if (!list) return;
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.hidden = !expanded && list.scrollHeight <= list.clientHeight;
      });
    };

    const openDialog = () => {
      previousFocus = document.activeElement;
      mobileFilterOverlay.hidden = false;
      mobileFilterButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("press-filter-open");
      updateShowMore();
      mobileFilterCloseButton?.focus();
    };

    const closeDialog = () => {
      mobileFilterOverlay.hidden = true;
      mobileFilterButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("press-filter-open");
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };

    mobileFilterButton.addEventListener("click", openDialog);
    mobileFilterCloseButton?.addEventListener("click", closeDialog);
    mobileFilterBackButton?.addEventListener("click", closeDialog);
    mobileFilterOverlay.addEventListener("click", (event) => {
      if (event.target === mobileFilterOverlay) closeDialog();
    });

    // Если окно расширили до десктопа, закрываем диалог, чтобы не остался scroll lock
    desktopQuery.addEventListener("change", (event) => {
      if (event.matches && !mobileFilterOverlay.hidden) closeDialog();
    });

    mobileFilterOverlay.querySelectorAll("[data-filter-list]").forEach((list) => {
      const type = list.dataset.filterList;
      list.querySelectorAll(".press__filter-option").forEach((option) => {
        option.addEventListener("click", () => {
          const value = toValue(option.dataset.filterValue);
          // Повторный клик по выбранному значению снимает выбор
          selected[type] = selected[type] === value ? "" : value;
          renderList(type);
          applyFilters();
        });
      });
    });

    showMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const list = mobileFilterOverlay.querySelector('[data-filter-list="' + button.dataset.expandList + '"]');
        const expanded = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(expanded));
        list?.classList.toggle("is-expanded", expanded);
        const label = button.querySelector("span");
        if (label) label.textContent = expanded ? "Скрыть" : "Показать еще";
      });
    });

    document.addEventListener("keydown", (event) => {
      if (mobileFilterOverlay.hidden) return;

      if (event.key === "Escape") {
        closeDialog();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = getFocusable();
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
    });

    Object.keys(selected).forEach(renderList);
  }
}
