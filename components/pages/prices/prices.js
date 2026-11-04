function initPrices() {
  const parametersToggle = document.querySelector(".prices__parameters-toggle");
  const filtersModal = document.querySelector(".prices__filters-modal");
  const filtersDialog = filtersModal?.querySelector(".prices__filters-dialog");
  const closeButtons = filtersModal?.querySelectorAll("[data-prices-filters-close]") || [];
  let previouslyFocusedElement = null;

  const closeFilters = () => {
    if (!filtersModal || !parametersToggle) {
      return;
    }

    filtersModal.classList.remove("is-open");
    const isMobile = window.matchMedia("(max-width: 680px)").matches;
    filtersModal.setAttribute("aria-hidden", String(isMobile));
    parametersToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("prices-filters-open");

    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
  };

  const openFilters = () => {
    if (!filtersModal || !parametersToggle || !filtersDialog) {
      return;
    }

    previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : parametersToggle;
    filtersModal.classList.add("is-open");
    filtersModal.setAttribute("aria-hidden", "false");
    parametersToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("prices-filters-open");
    filtersDialog.focus();
  };

  if (parametersToggle && filtersModal) {
    parametersToggle.addEventListener("click", (event) => {
      event.preventDefault();
      openFilters();
    });
    closeButtons.forEach((button) => button.addEventListener("click", closeFilters));

    document.addEventListener("keydown", (event) => {
      if (!filtersModal.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        closeFilters();
        return;
      }

      if (event.key !== "Tab" || !filtersDialog) {
        return;
      }

      const focusable = Array.from(
        filtersDialog.querySelectorAll(
          'button:not([disabled]), select:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element instanceof HTMLElement && element.getClientRects().length > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        filtersDialog.focus();
        return;
      }

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

    const desktopMedia = window.matchMedia("(min-width: 681px)");
    desktopMedia.addEventListener?.("change", (event) => {
      if (event.matches) {
        closeFilters();
      }
    });
  }

  const notice = document.querySelector(".prices__notice");
  const noticeToggle = notice?.querySelector(".prices__notice-toggle");

  if (notice && noticeToggle) {
    noticeToggle.addEventListener("click", () => {
      const isExpanded = notice.classList.toggle("is-expanded");
      noticeToggle.setAttribute("aria-expanded", String(isExpanded));
      noticeToggle.querySelector("span").textContent = isExpanded ? "Скрыть" : "Показать еще";
    });
  }

  document.querySelectorAll(".prices__segmented").forEach((group) => {
    const options = Array.from(group.querySelectorAll(".prices__option"));

    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((item) => {
          const isActive = item === option;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });
      });
    });
  });
}

function initPricesTechAccordion() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new WeakMap();

  const setDescriptionExpanded = (description, expanded) => {
    const previousAnimation = animations.get(description);
    const currentHeight = description.getBoundingClientRect().height;
    previousAnimation?.cancel();

    if (expanded) {
      description.hidden = false;
    }

    const targetHeight = expanded ? description.scrollHeight : 0;

    if (reducedMotion.matches) {
      description.hidden = !expanded;
      return;
    }

    const animation = description.animate(
      [
        { height: `${currentHeight}px`, opacity: expanded ? 0.7 : 1 },
        { height: `${targetHeight}px`, opacity: expanded ? 1 : 0.7 },
      ],
      {
        duration: 260,
        easing: "ease-in-out",
      }
    );

    animations.set(description, animation);
    animation.addEventListener(
      "finish",
      () => {
        if (animations.get(description) !== animation) return;
        animations.delete(description);
        if (!expanded) description.hidden = true;
      },
      { once: true }
    );
  };

  document.querySelectorAll(".accordion__btn").forEach((btn) => {
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
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPricesTechAccordion, { once: true });
} else {
  initPricesTechAccordion();
}
