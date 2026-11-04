function initHome() {
  const hero = document.querySelector(".home-hero");

  if (!hero) {
    return;
  }

  const contactForm = document.querySelector(".services-contact__form");

  if (contactForm && !contactForm.dataset.validationInitialized) {
    contactForm.dataset.validationInitialized = "true";

    const requiredFields = Array.from(contactForm.querySelectorAll("input[required]"));

    const updateFieldValidity = (field) => {
      const isInvalid = !field.checkValidity();
      field.classList.toggle("is-invalid", isInvalid);
      return isInvalid;
    };

    requiredFields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.checkValidity()) {
          field.classList.remove("is-invalid");
        }
      });

      field.addEventListener("change", () => updateFieldValidity(field));
    });

    contactForm.addEventListener("submit", (event) => {
      const invalidFields = requiredFields.filter((field) => updateFieldValidity(field));

      if (invalidFields.length > 0) {
        event.preventDefault();
        invalidFields[0].focus();
      }
    });
  }

  const countrySelector = document.querySelector(".services-contact__field--phone");

  if (countrySelector && !countrySelector.dataset.countrySelectorInitialized) {
    countrySelector.dataset.countrySelectorInitialized = "true";

    const countryTrigger = countrySelector.querySelector(".services-contact__phone-country");
    const countryPopup = countrySelector.querySelector(".services-contact__country-popup");
    const countryCode = countrySelector.querySelector(".services-contact__phone-code");
    const countryFlag = countrySelector.querySelector(".services-contact__phone-flag");
    const countryOptions = Array.from(countrySelector.querySelectorAll(".services-contact__country-option"));
    const countryPopupClose = countrySelector.querySelector(".services-contact__country-popup-close");
    const countryPopupBackButton = countrySelector.querySelector(".back-btn");

    const phoneInput = countrySelector.querySelector(".services-contact__phone-input");

    const updatePhoneInputPadding = () => {
      if (!countryTrigger || !phoneInput) return;

      const triggerRect = countryTrigger.getBoundingClientRect();
      const inputRect = phoneInput.getBoundingClientRect();
      const gap = 12;
      const paddingLeft = Math.ceil(triggerRect.right - inputRect.left + gap);

      phoneInput.style.setProperty("--phone-country-padding-left", `${paddingLeft}px`);
    };

    updatePhoneInputPadding();

    if ("ResizeObserver" in window) {
      const countrySelectorResizeObserver = new ResizeObserver(updatePhoneInputPadding);
      countrySelectorResizeObserver.observe(countryTrigger);
      countrySelectorResizeObserver.observe(phoneInput);
    }

    // ResizeObserver не отслеживает изменение положения элемента без изменения его размера.
    // Поэтому пересчитываем отступ и при каждом изменении ширины/размера окна.
    window.addEventListener("resize", updatePhoneInputPadding, { passive: true });

    const setCountryPopupOpen = (isOpen) => {
      countryPopup.hidden = !isOpen;
      countryTrigger.setAttribute("aria-expanded", String(isOpen));
      countrySelector.classList.toggle("is-country-popup-open", isOpen);
      document.documentElement.classList.toggle("is-country-popup-open", isOpen);
    };

    const closeCountryPopup = () => {
      setCountryPopupOpen(false);
      countryTrigger.focus();
    };

    countryTrigger.addEventListener("click", () => {
      setCountryPopupOpen(countryPopup.hidden);
    });

    countryPopupClose?.addEventListener("click", closeCountryPopup);
    countryPopupBackButton?.addEventListener("click", closeCountryPopup);

    countryOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedCode = option.dataset.code;
        const selectedName = option.dataset.name;
        const selectedFlag = option.querySelector("svg");

        countryCode.textContent = selectedCode;
        countryFlag.innerHTML = selectedFlag.innerHTML;
        countryFlag.setAttribute("viewBox", selectedFlag.getAttribute("viewBox"));
        countryTrigger.setAttribute("aria-label", `Код страны ${selectedName}, ${selectedCode}`);

        countryOptions.forEach((countryOption) => {
          const isSelected = countryOption === option;
          countryOption.classList.toggle("is-selected", isSelected);
          countryOption.setAttribute("aria-selected", String(isSelected));
        });

        const phoneInput = countrySelector.querySelector(".services-contact__phone-input");
        phoneInput.dataset.countryCode = selectedCode;
        setCountryPopupOpen(false);
        countryTrigger.focus();
      });
    });

    document.addEventListener("click", (event) => {
      if (!countrySelector.contains(event.target)) {
        setCountryPopupOpen(false);
      }
    });

    countrySelector.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !countryPopup.hidden) {
        setCountryPopupOpen(false);
        countryTrigger.focus();
      }

      if (event.key === "ArrowDown" && event.target === countryTrigger) {
        event.preventDefault();
        setCountryPopupOpen(true);
        countryOptions[0]?.focus();
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const currentIndex = countryOptions.indexOf(event.target);
        if (currentIndex === -1) return;
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (currentIndex + direction + countryOptions.length) % countryOptions.length;
        countryOptions[nextIndex]?.focus();
      }
    });
  }

  const processGrid = document.querySelector(".home-process__grid");

  if (processGrid && !processGrid.dataset.headersEqualized) {
    processGrid.dataset.headersEqualized = "true";

    const cardHeaders = Array.from(processGrid.querySelectorAll(".home-process__card-header"));
    const cardTitles = cardHeaders.map((header) => header.querySelector(".home-process__card-title")).filter(Boolean);

    const equalizeCardHeaders = () => {
      cardHeaders.forEach((header) => header.style.removeProperty("height"));

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
