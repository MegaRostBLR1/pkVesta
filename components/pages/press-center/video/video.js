function initVideo() {
  const filterButtons = document.querySelectorAll(".filter-dropdown__button[data-filter-type]");
  const selected = {};

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

  filterButtons.forEach((button) => {
    const type = button.dataset.filterType;
    const menu = document.getElementById(button.getAttribute("aria-controls"));
    const prefix = button.dataset.label ?? (button.querySelector("span")?.textContent.trim() || "");

    button.addEventListener("click", () => {
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";
      closeMenus(button);
      button.setAttribute("aria-expanded", String(shouldOpen));
      if (menu) menu.hidden = !shouldOpen;
    });

    menu?.querySelectorAll(".filter-dropdown__option").forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.filterValue || "";
        menu.querySelectorAll(".filter-dropdown__option").forEach((item) => {
          const active = item === option;
          item.classList.toggle("is-selected", active);
          item.setAttribute("aria-selected", String(active));
        });
        selected[type] = value;
        syncLabel(button, prefix, value);
        closeMenus();
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".filter-dropdown")) closeMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenus();
  });

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
    if (!event.target.closest(".filter-dropdown")) closeMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenus();
  });

  const mobileFilterButton = document.querySelector(".mob-filter-button");
  const mobileFilterOverlay = document.querySelector("#video-mobile-filter");

  if (mobileFilterButton && mobileFilterOverlay) {
    const mobileFilterCloseButton = mobileFilterOverlay.querySelector(".mob-filter-dialog__close");
    const mobileFilterBackButton = mobileFilterOverlay.querySelector(".mob-filter-overlay__back");
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
      list?.querySelectorAll(".mob-filter-dialog__option").forEach((option) => {
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
      document.body.classList.add("mob-filter-open");
      updateShowMore();
      mobileFilterCloseButton?.focus();
    };

    const closeDialog = () => {
      mobileFilterOverlay.hidden = true;
      mobileFilterButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("mob-filter-open");
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
      list.querySelectorAll(".mob-filter-dialog__option").forEach((option) => {
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
