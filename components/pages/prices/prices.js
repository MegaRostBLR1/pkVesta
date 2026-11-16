function initPrices() {
  const filterButtons = document.querySelectorAll(".filter-dropdown__button[data-filter-type]");
  const mobileButton = document.querySelector(".mob-filter-button");
  const overlay = document.querySelector("#prices-filter-dialog");
  const dialog = overlay?.querySelector(".mob-filter-dialog");
  const closeButton = overlay?.querySelector(".mob-filter-dialog__close");
  const backButton = overlay?.querySelector(".mob-filter-overlay__back");
  const showMoreButtons = overlay?.querySelectorAll("[data-expand-list]");
  const prefixes = {};
  const selected = {};
  let previousFocus = null;

  /* ===== Общие функции ===== */

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
    selected[type] = value;

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

  // при переходе на десктоп закрываем мобильный фильтр
  window.matchMedia("(min-width: 681px)").addEventListener?.("change", (event) => {
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

  /* ===== Уведомление «Показать еще» ===== */
  const notice = document.querySelector(".prices__notice");
  const noticeToggle = notice?.querySelector(".prices__notice-toggle");

  if (notice && noticeToggle) {
    noticeToggle.addEventListener("click", () => {
      const isExpanded = notice.classList.toggle("is-expanded");
      noticeToggle.setAttribute("aria-expanded", String(isExpanded));
      noticeToggle.querySelector("span").textContent = isExpanded ? "Скрыть" : "Показать еще";
    });
  }
}