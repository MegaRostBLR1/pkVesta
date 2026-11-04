function initHome() {
  const hero = document.querySelector(".home-hero");

  if (!hero) {
    return;
  }

  const processGrid = document.querySelector(".home-process__grid");

  if (processGrid && !processGrid.dataset.headersEqualized) {
    processGrid.dataset.headersEqualized = "true";

    const cardHeaders = Array.from(processGrid.querySelectorAll(".home-process__card-header"));
    const cardTitles = cardHeaders.map((header) => header.querySelector(".home-process__card-title")).filter(Boolean);

    const equalizeCardHeaders = () => {
      cardHeaders.forEach((header) => {
        header.style.removeProperty("height");
      });

      const maxHeight = Math.max(0, ...cardHeaders.map((header) => header.getBoundingClientRect().height));

      cardHeaders.forEach((header) => {
        header.style.height = `${maxHeight}px`;
      });
    };

    equalizeCardHeaders();

    if ("ResizeObserver" in window) {
      const headerResizeObserver = new ResizeObserver(equalizeCardHeaders);
      cardTitles.forEach((title) => headerResizeObserver.observe(title));
    }

    window.addEventListener("resize", equalizeCardHeaders, { passive: true });
    document.fonts?.ready.then(equalizeCardHeaders);
  }

  // Навигация слайдера остаётся неактивной, пока в проект не добавлены остальные слайды.

  const accordionAnimations = new WeakMap();
  const animateAccordionContent = (content, expanded) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wasHidden = content.hidden;
    const computed = window.getComputedStyle(content);
    const currentHeight = computed.height;
    const currentPaddingTop = computed.paddingTop;
    const targetPaddingTop = computed.paddingTop;
    const targetPaddingBottom = computed.paddingBottom;
    const boxSizing = computed.boxSizing;

    accordionAnimations.get(content)?.cancel();

    if (expanded) {
      content.hidden = false;
    }

    if (reducedMotion.matches) {
      content.hidden = !expanded;
      content.style.removeProperty("height");
      content.style.removeProperty("overflow");
      content.style.removeProperty("padding-top");
      accordionAnimations.delete(content);
      return;
    }

    if (expanded && wasHidden) {
      content.style.height = "0px";
      content.style.paddingTop = "0px";
    } else {
      content.style.height = currentHeight;
      content.style.paddingTop = currentPaddingTop;
    }
    content.style.overflow = "hidden";

    const startHeight = Number.parseFloat(content.style.height) || 0;
    const startPaddingTop = Number.parseFloat(content.style.paddingTop) || 0;
    const targetHeight = expanded
      ? content.scrollHeight -
        (boxSizing === "border-box" ? 0 : Number.parseFloat(targetPaddingTop) + Number.parseFloat(targetPaddingBottom))
      : 0;
    const animation = content.animate(
      [
        { height: `${startHeight}px`, paddingTop: `${startPaddingTop}px` },
        { height: `${Math.max(0, targetHeight)}px`, paddingTop: expanded ? targetPaddingTop : "0px" },
      ],
      { duration: 300, easing: "ease-in-out" }
    );

    accordionAnimations.set(content, animation);
    animation.addEventListener(
      "finish",
      () => {
        if (accordionAnimations.get(content) !== animation) return;
        accordionAnimations.delete(content);
        content.hidden = !expanded;
        content.style.removeProperty("height");
        content.style.removeProperty("overflow");
        content.style.removeProperty("padding-top");
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
