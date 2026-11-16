function initNews() {
  const filterButtons = document.querySelectorAll(".filter-dropdown__button[data-filter-type]");
  const mobileButton = document.querySelector(".mob-filter-button"); // ←
  const overlay = document.querySelector("#press-news-filter-dialog");
  const dialog = overlay?.querySelector(".mob-filter-dialog"); // ←
  const closeButton = overlay?.querySelector(".mob-filter-dialog__close"); // ←
  const backButton = overlay?.querySelector(".mob-filter-overlay__back"); // ←
  const showMoreButtons = overlay?.querySelectorAll("[data-expand-list]");
  let previousFocus = null;
  const selected = { months: "", years: "" };

  document.querySelectorAll(".press-news__card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest('a, button, input, select, textarea, [role="button"], [role="link"]')) return;
      window.location.hash = "/news-item";
    });
  });

  const closeMenus = (exceptButton = null) => {
    filterButtons.forEach((button) => {
      if (button === exceptButton) return;
      button.setAttribute("aria-expanded", "false");
      const menu = document.getElementById(button.getAttribute("aria-controls"));
      if (menu) menu.hidden = true;
    });
  };

  const syncDesktopLabel = (type, value) => {
    const button = document.querySelector('.filter-dropdown__button[data-filter-type="' + type + '"]');
    const label = button?.querySelector("span");
    if (label) {
      const prefix = type === "months" ? "По месяцам:" : "По годам:";
      label.textContent = value ? prefix + " " + value : prefix;
    }
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
    menu?.querySelectorAll(".filter-dropdown__option").forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.filterValue || "";
        menu.querySelectorAll(".filter-dropdown__option").forEach((item) => {
          const active = item === option;
          item.classList.toggle("is-selected", active);
          item.setAttribute("aria-selected", String(active));
        });
        selected[type] = value;
        syncDesktopLabel(type, value);
        closeMenus();
      });
    });
  });

   const updateShowMore = () => {
    showMoreButtons?.forEach((button) => {
      const list = overlay?.querySelector('[data-filter-list="' + button.dataset.expandList + '"]');
      if (!list) return;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.hidden = !expanded && list.scrollHeight <= list.clientHeight;
    });
  };

    const openDialog = () => {
    if (!overlay || !dialog) return;
    previousFocus = document.activeElement;
    overlay.hidden = false;
    mobileButton?.setAttribute("aria-expanded", "true");
    document.body.classList.add("mob-filter-open");
    updateShowMore();
    closeButton?.focus();
  };

  const closeDialog = () => {
    if (!overlay) return;
    overlay.hidden = true;
    mobileButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mob-filter-open");
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };

  mobileButton?.addEventListener("click", openDialog);
  closeButton?.addEventListener("click", closeDialog);
  backButton?.addEventListener("click", closeDialog);
  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) closeDialog();
  });

  overlay?.querySelectorAll("[data-filter-list]").forEach((list) => {
    const type = list.dataset.filterList;
    list.querySelectorAll(".mob-filter-dialog__option").forEach((option) => { // ←
      option.addEventListener("click", () => {
        const value = option.dataset.filterValue || "";
        list.querySelectorAll(".mob-filter-dialog__option").forEach((item) => { // ←
          const active = item === option;
          item.classList.toggle("is-selected", active);
          item.setAttribute("aria-pressed", String(active));
        });
        selected[type] = value;
        syncDesktopLabel(type, value);
      });
    });
  });

  showMoreButtons?.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.expandList;
      const list = overlay?.querySelector('[data-filter-list="' + type + '"]');
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded));
      if (list) list.classList.toggle("is-expanded", expanded);
      const label = button.querySelector("span");
      if (label) label.textContent = expanded ? "Скрыть" : "Показать еще";
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".filter-dropdown")) closeMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenus();
      if (overlay && !overlay.hidden) closeDialog();
    }
    if (event.key === "Tab" && overlay && !overlay.hidden) {
      const focusable = overlay.querySelectorAll( // ← overlay вместо dialog
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
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

  const loadMoreButton = document.querySelector(".press-center__load-more");
  const cardsContainer = document.querySelector(".press-news__grid");

  if (loadMoreButton && cardsContainer) {
    function checkButtonVisibility() {
      const totalCards = cardsContainer.querySelectorAll(".press-news__card").length;

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
}