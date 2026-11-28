(function () {
  let activeController = null;

  window.initMobilePriceFilter = function (container, options = {}) {
    if (!container) return;
    activeController?.abort();

    const controller = new AbortController();
    const { signal } = controller;
    activeController = controller;

    const button = container.querySelector(".mob-filter-button");
    const overlay = container.querySelector(".mob-filter-overlay");
    const dialog = overlay?.querySelector(".mob-filter-dialog");
    if (!button || !overlay || !dialog) return;

    const closeButton = overlay.querySelector(".mob-filter-dialog__close");
    const backButton = overlay.querySelector(".mob-filter-overlay__back");
    const showMoreButtons = [...overlay.querySelectorAll("[data-expand-list]")];
    const dropdownButtons = [...container.querySelectorAll(".filter-dropdown__button[data-filter-type]")];
    const prefixes = new Map();
    const selected = new Map();
    let previousFocus = null;
    const body = document.body;

    // Fixed overlay is portalled to body to escape transformed/overflowing page containers.
    body.append(overlay);

    const getMenu = (dropdownButton) => {
      const id = dropdownButton.getAttribute("aria-controls");
      return id ? container.querySelector("#" + CSS.escape(id)) : null;
    };

    const closeMenus = (except = null) => {
      dropdownButtons.forEach((item) => {
        if (item === except) return;
        item.setAttribute("aria-expanded", "false");
        const menu = getMenu(item);
        if (menu) menu.hidden = true;
      });
    };

    const updateSummary = () => {
      const summary = button.querySelector(".mob-filter-button__values");
      if (!summary) return;
      summary.hidden = !options.showDimensions;
      if (!options.showDimensions) return;
      const compact = (type) => (selected.get(type) || "").replace(/\s+/g, "");
      summary.textContent = "(Ш: " + compact("width") + ", В: " + compact("height") + ")";
    };

    const setFilter = (type, value) => {
      selected.set(type, value);

      container.querySelectorAll('[data-segmented="' + type + '"] .prices__option').forEach((item) => {
        const active = item.dataset.filterValue === value;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      const dropdownButton = dropdownButtons.find((item) => item.dataset.filterType === type);
      const menu = dropdownButton && getMenu(dropdownButton);
      menu?.querySelectorAll(".filter-dropdown__option").forEach((item) => {
        const active = item.dataset.filterValue === value;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-selected", String(active));
      });

      if (dropdownButton) {
        const label = dropdownButton.querySelector("span");
        const prefix = prefixes.get(type) || "";
        const suffix = value && value !== "Все" ? value : "";
        if (label) label.textContent = prefix && suffix ? prefix + " " + suffix : prefix || suffix;
      }

      overlay.querySelectorAll('[data-filter-list="' + type + '"] .mob-filter-dialog__option').forEach((item) => {
        const active = item.dataset.filterValue === value;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateSummary();
    };

    dropdownButtons.forEach((item) => {
      const type = item.dataset.filterType;
      const menu = getMenu(item);
      prefixes.set(type, item.dataset.label ?? item.querySelector("span")?.textContent.trim() ?? "");

      const selectedOption = menu?.querySelector(".filter-dropdown__option.is-selected");
      if (selectedOption) selected.set(type, selectedOption.dataset.filterValue || "");

      item.addEventListener("click", () => {
        const shouldOpen = item.getAttribute("aria-expanded") !== "true";
        closeMenus(item);
        item.setAttribute("aria-expanded", String(shouldOpen));
        if (menu) menu.hidden = !shouldOpen;
      }, { signal });

      menu?.querySelectorAll(".filter-dropdown__option").forEach((option) => {
        option.addEventListener("click", () => {
          setFilter(type, option.dataset.filterValue || "");
          closeMenus();
        }, { signal });
      });
    });

    container.querySelectorAll(".prices__segmented[data-segmented]").forEach((group) => {
      const type = group.dataset.segmented;
      const active = group.querySelector(".prices__option.is-active");
      if (active && !selected.has(type)) selected.set(type, active.dataset.filterValue || "");
      group.querySelectorAll(".prices__option").forEach((option) => {
        option.addEventListener("click", () => setFilter(type, option.dataset.filterValue || ""), { signal });
      });
    });

    overlay.querySelectorAll("[data-filter-list]").forEach((list) => {
      const type = list.dataset.filterList;
      const active = list.querySelector(".mob-filter-dialog__option.is-selected");
      if (active && !selected.has(type)) selected.set(type, active.dataset.filterValue || "");
      list.querySelectorAll(".mob-filter-dialog__option").forEach((option) => {
        option.addEventListener("click", () => setFilter(type, option.dataset.filterValue || ""), { signal });
      });
    });

    const updateShowMore = () => {
      showMoreButtons.forEach((item) => {
        const list = overlay.querySelector('[data-filter-list="' + item.dataset.expandList + '"]');
        if (!list) return;
        const values = [...list.querySelectorAll(".mob-filter-dialog__option")];
        const expanded = item.getAttribute("aria-expanded") === "true";
        item.hidden = values.length <= 3;
        values.forEach((value, index) => { value.hidden = !expanded && index >= 3; });
      });
    };

    const openDialog = () => {
      if (!overlay.hidden) return;
      previousFocus = document.activeElement;
      overlay.hidden = false;
      button.setAttribute("aria-expanded", "true");
      body.classList.add("mob-filter-open");
      updateShowMore();
      closeButton?.focus();
    };

    const closeDialog = (restoreFocus = true) => {
      if (overlay.hidden) return;
      overlay.hidden = true;
      button.setAttribute("aria-expanded", "false");
      body.classList.remove("mob-filter-open");
      if (restoreFocus && previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };

    button.addEventListener("click", openDialog, { signal });
    closeButton?.addEventListener("click", () => closeDialog(), { signal });
    backButton?.addEventListener("click", () => closeDialog(), { signal });
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeDialog();
    }, { signal });

    showMoreButtons.forEach((item) => {
      item.addEventListener("click", () => {
        const list = overlay.querySelector('[data-filter-list="' + item.dataset.expandList + '"]');
        const expanded = item.getAttribute("aria-expanded") !== "true";
        item.setAttribute("aria-expanded", String(expanded));
        list?.classList.toggle("is-expanded", expanded);
        const label = item.querySelector("span");
        if (label) label.textContent = expanded ? "Скрыть" : "Показать еще";
        updateShowMore();
      }, { signal });
    });

    document.addEventListener("click", (event) => {
      if (!container.contains(event.target)) closeMenus();
      else if (!event.target.closest(".filter-dropdown")) closeMenus();
    }, { signal });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenus();
        closeDialog();
      }
      if (event.key !== "Tab" || overlay.hidden) return;
      const focusable = [...overlay.querySelectorAll('button:not([disabled]):not([hidden]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, { signal });

    const media = window.matchMedia("(min-width: 1201px)");
    media.addEventListener?.("change", (event) => {
      if (event.matches) closeDialog();
    }, { signal });

    updateShowMore();
    updateSummary();

    // The page can be replaced during SPA navigation; abort listeners and remove the portalled DOM.
    controller.signal.addEventListener("abort", () => {
      closeDialog(false);
      overlay.remove();
      activeController = null;
    }, { once: true });
  };

  window.destroyMobilePriceFilter = () => activeController?.abort();
})();