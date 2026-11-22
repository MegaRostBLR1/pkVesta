const HOME_HERO_SLIDES = [
  "./static/images/home/featured.png",
  "./static/images/home/home-about.png",
  "./static/images/home/home-lstk.png",
  "./static/images/home/home-advantages-factory.png"
];

function initHomeHeroSlider(hero) {
  const background = hero.querySelector(".home-hero__background");
  const controls = hero.querySelector(".slider-controls");
  const pagination = controls?.querySelector(".slider-controls__pagination");
  const previousButton = controls?.querySelector(".slider-controls__arrow--prev");
  const nextButton = controls?.querySelector(".slider-controls__arrow--next");

  if (
    !background ||
    !pagination ||
    !previousButton ||
    !nextButton ||
    controls.dataset.initialized === "true"
  ) {
    return;
  }

  controls.dataset.initialized = "true";

  let activeIndex = 0;
  let isTransitioning = false;
  let activeSlide = document.createElement("div");

  activeSlide.className = "home-hero__slide";
  activeSlide.style.backgroundImage = `url("${HOME_HERO_SLIDES[0]}")`;
  background.replaceChildren(activeSlide);

  // Изображения загружаются по запросу и кешируются.
  const imageCache = new Map();

  const loadImage = (src) => {
    if (!imageCache.has(src)) {
      const imagePromise = new Promise((resolve) => {
        const image = new Image();

        image.addEventListener("load", () => resolve(true), { once: true });
        image.addEventListener("error", () => resolve(false), { once: true });

        image.src = src;
      });

      imageCache.set(src, imagePromise);
    }

    return imageCache.get(src);
  };

  const dots = HOME_HERO_SLIDES.map((_, index) => {
    const dot = document.createElement("button");

    dot.className = "slider-controls__dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать слайд ${index + 1}`);
    dot.addEventListener("click", () => {
      const forwardDistance =
        (index - activeIndex + HOME_HERO_SLIDES.length) % HOME_HERO_SLIDES.length;
      const backwardDistance =
        (activeIndex - index + HOME_HERO_SLIDES.length) % HOME_HERO_SLIDES.length;
      const direction = forwardDistance <= backwardDistance ? 1 : -1;

      setActiveSlide(index, direction);
    });

    return dot;
  });

  pagination.replaceChildren(...dots);

  const updatePagination = () => {
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;

      dot.classList.toggle("slider-controls__dot--active", isActive);
      dot.disabled = isTransitioning;

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    pagination.setAttribute(
      "aria-label",
      `Слайд ${activeIndex + 1} из ${HOME_HERO_SLIDES.length}`
    );
  };

  const updateControls = () => {
    previousButton.disabled = isTransitioning;
    nextButton.disabled = isTransitioning;
    updatePagination();
  };

  async function setActiveSlide(index, direction) {
    const nextIndex = (index + HOME_HERO_SLIDES.length) % HOME_HERO_SLIDES.length;

    if (nextIndex === activeIndex || isTransitioning) {
      return;
    }

    isTransitioning = true;
    updateControls();

    try {
      const isLoaded = await loadImage(HOME_HERO_SLIDES[nextIndex]);

      if (!isLoaded) {
        return;
      }

      const nextSlide = document.createElement("div");
      nextSlide.className = "home-hero__slide";
      nextSlide.style.backgroundImage = `url("${HOME_HERO_SLIDES[nextIndex]}")`;
      background.append(nextSlide);

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        activeSlide.remove();
        activeSlide = nextSlide;
      } else {
        const slideDirection = direction ?? (nextIndex > activeIndex ? 1 : -1);
        const outgoingAnimation = activeSlide.animate(
          [
            { transform: "translateX(0)" },
            { transform: `translateX(${slideDirection * -100}%)` },
          ],
          { duration: 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
        const incomingAnimation = nextSlide.animate(
          [
            { transform: `translateX(${slideDirection * 100}%)` },
            { transform: "translateX(0)" },
          ],
          { duration: 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );

        try {
          await Promise.all([
            outgoingAnimation.finished,
            incomingAnimation.finished,
          ]);
        } catch {
          // При прерывании анимации оставляем актуальный слайд видимым.
        }

        activeSlide.remove();
        nextSlide.style.transform = "none";
        activeSlide = nextSlide;
      }

      activeIndex = nextIndex;
    } finally {
      isTransitioning = false;
      updateControls();
    }
  }

  previousButton.addEventListener("click", () => {
    setActiveSlide(activeIndex - 1, -1);
  });

  nextButton.addEventListener("click", () => {
    setActiveSlide(activeIndex + 1, 1);
  });

  updateControls();
}

function initHomeProcessCards() {
  const processGrid = document.querySelector(".home-process__grid");

  if (!processGrid || processGrid.dataset.headersEqualized === "true") {
    return;
  }

  processGrid.dataset.headersEqualized = "true";

  const cardHeaders = Array.from(
    processGrid.querySelectorAll(".home-process__card-header")
  );
  const cardTitles = cardHeaders
    .map((header) => header.querySelector(".home-process__card-title"))
    .filter(Boolean);

  if (cardHeaders.length < 2) {
    return;
  }

  const equalizeCardHeaders = () => {
    cardHeaders.forEach((header) => header.style.removeProperty("height"));

    const maxHeight = Math.max(
      0,
      ...cardHeaders.map((header) => header.getBoundingClientRect().height)
    );

    cardHeaders.forEach((header) => {
      header.style.height = `${maxHeight}px`;
    });
  };

  equalizeCardHeaders();

  if ("ResizeObserver" in window) {
    const headerResizeObserver = new ResizeObserver(equalizeCardHeaders);
    cardTitles.forEach((title) => headerResizeObserver.observe(title));
  } else {
    window.addEventListener("resize", equalizeCardHeaders, { passive: true });
  }

  document.fonts?.ready.then(equalizeCardHeaders);
}


function initHomeProjectsSlider() {
  const section = document.querySelector(".home-projects");
  const viewport = section?.querySelector(".home-projects__cards-viewport");
  const track = viewport?.querySelector(".home-projects__cards");
  const controls = section?.querySelector(".slider-controls--dark");
  const pagination = controls?.querySelector(".slider-controls__pagination");
  const previousButton = controls?.querySelector(".slider-controls__arrow--prev");
  const nextButton = controls?.querySelector(".slider-controls__arrow--next");

  if (
    !viewport ||
    !track ||
    !pagination ||
    !previousButton ||
    !nextButton ||
    track.dataset.initialized === "true"
  ) {
    return;
  }

  const cards = Array.from(track.querySelectorAll(":scope > .project-card--compact"));

  if (cards.length === 0) {
    return;
  }

  track.dataset.initialized = "true";

  let cardsPerPage = 0;
  let activePage = 0;
  let paginationDots = [];

  const getCardsPerPage = () => {
    const value = window
      .getComputedStyle(track)
      .getPropertyValue("--projects-visible-cards")
      .trim();
    const parsedValue = Number.parseInt(value, 10);

    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1;
  };

  const renderPagination = (pageCount) => {
    paginationDots = Array.from({ length: pageCount }, (_, index) => {
      const dot = document.createElement("button");

      dot.className = "slider-controls__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Показать группу проектов ${index + 1} из ${pageCount}`);
      dot.setAttribute("aria-controls", viewport.id);
      dot.addEventListener("click", () => setActivePage(index));

      return dot;
    });

    pagination.replaceChildren(...paginationDots);
  };

  const updateSlider = () => {
    const nextCardsPerPage = getCardsPerPage();
    const currentFirstCardIndex = activePage * cardsPerPage;

    if (nextCardsPerPage !== cardsPerPage) {
      cardsPerPage = nextCardsPerPage;
      activePage = Math.floor(currentFirstCardIndex / cardsPerPage);
    }

    const pageCount = Math.ceil(cards.length / cardsPerPage);
    activePage = Math.min(Math.max(activePage, 0), pageCount - 1);

    if (paginationDots.length !== pageCount) {
      renderPagination(pageCount);
    }

    const firstVisibleCard = cards[activePage * cardsPerPage];
    const trackOffset = firstVisibleCard.getBoundingClientRect().left -
      track.getBoundingClientRect().left;

    track.style.transform = `translate3d(${-trackOffset}px, 0, 0)`;
    previousButton.disabled = activePage === 0;
    nextButton.disabled = activePage === pageCount - 1;

    paginationDots.forEach((dot, index) => {
      const isActive = index === activePage;

      dot.classList.toggle("slider-controls__dot--active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    pagination.setAttribute("aria-label", `Группа ${activePage + 1} из ${pageCount}`);
  };

  const setActivePage = (page) => {
    activePage = page;
    updateSlider();
  };

  previousButton.setAttribute("aria-controls", viewport.id);
  nextButton.setAttribute("aria-controls", viewport.id);

  previousButton.addEventListener("click", () => setActivePage(activePage - 1));
  nextButton.addEventListener("click", () => setActivePage(activePage + 1));

  let touchStartX = null;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }

    touchStartX = event.clientX;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (touchStartX === null) {
      return;
    }

    const swipeDistance = touchStartX - event.clientX;
    touchStartX = null;

    if (Math.abs(swipeDistance) >= 50) {
      setActivePage(activePage + (swipeDistance > 0 ? 1 : -1));
    }
  });

  viewport.addEventListener("pointercancel", () => {
    touchStartX = null;
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.target !== viewport) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setActivePage(activePage + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  if ("ResizeObserver" in window) {
    const sliderResizeObserver = new ResizeObserver(updateSlider);
    sliderResizeObserver.observe(viewport);
  }

  window.addEventListener("resize", updateSlider, { passive: true });
  document.fonts?.ready.then(updateSlider);

  updateSlider();
}

function initServicesContact() {
  const section = document.querySelector(".services-contact");

  if (!section || section.dataset.initialized === "true") {
    return;
  }

  section.dataset.initialized = "true";

  initServicesContactValidation(section);
  initServicesContactCountrySelector(section);
}

function initServicesContactValidation(section) {
  const form = section.querySelector(".services-contact__form");

  if (!form || form.dataset.validationInitialized === "true") {
    return;
  }

  form.dataset.validationInitialized = "true";

  const requiredFields = Array.from(form.querySelectorAll(":required"));

  const updateFieldValidity = (field) => {
    const isInvalid = !field.checkValidity();

    field.classList.toggle("is-invalid", isInvalid);
    field.setAttribute("aria-invalid", String(isInvalid));

    return isInvalid;
  };

  const handleFieldInput = (event) => {
    const field = event.target;

    if (requiredFields.includes(field) && field.checkValidity()) {
      field.classList.remove("is-invalid");
      field.setAttribute("aria-invalid", "false");
    }
  };

  const handleFieldChange = (event) => {
    if (requiredFields.includes(event.target)) {
      updateFieldValidity(event.target);
    }
  };

  form.addEventListener("input", handleFieldInput);
  form.addEventListener("change", handleFieldChange);

  form.addEventListener("submit", (event) => {
    const invalidFields = requiredFields.filter(updateFieldValidity);

    if (invalidFields.length === 0) {
      return;
    }

    event.preventDefault();
    invalidFields[0].focus();
  });
}

function initServicesContactCountrySelector(section) {
  const countrySelector = section.querySelector(".services-contact__field--phone");

  if (!countrySelector || countrySelector.dataset.countrySelectorInitialized === "true") {
    return;
  }

  const countryTrigger = countrySelector.querySelector(".services-contact__phone-country");
  const countryPopup = countrySelector.querySelector(".services-contact__country-popup");
  const countryCode = countrySelector.querySelector(".services-contact__phone-code");
  const countryFlag = countrySelector.querySelector(".services-contact__phone-flag");
  const phoneInput = countrySelector.querySelector(".services-contact__phone-input");
  const countryOptions = Array.from(
    countrySelector.querySelectorAll(".services-contact__country-option")
  );
  const countryPopupClose = countrySelector.querySelector(".services-contact__country-popup-close");
  const countryPopupBackButton = countrySelector.querySelector(".back-btn");

  if (
    !countryTrigger ||
    !countryPopup ||
    !countryCode ||
    !countryFlag ||
    !phoneInput ||
    countryOptions.length === 0
  ) {
    return;
  }

  countrySelector.dataset.countrySelectorInitialized = "true";

  const selectedOption = countryOptions.find((option) => option.getAttribute("aria-selected") === "true")
    || countryOptions[0];

  const updatePhoneInputPadding = () => {
    const triggerRect = countryTrigger.getBoundingClientRect();
    const inputRect = phoneInput.getBoundingClientRect();
    const gap = 12;
    const paddingLeft = Math.ceil(triggerRect.right - inputRect.left + gap);

    phoneInput.style.setProperty("--phone-country-padding-left", `${paddingLeft}px`);
  };

  const setCountryPopupOpen = (isOpen) => {
    countryPopup.hidden = !isOpen;
    countryTrigger.setAttribute("aria-expanded", String(isOpen));
    countrySelector.classList.toggle("is-country-popup-open", isOpen);
    document.documentElement.classList.toggle("is-country-popup-open", isOpen);
  };

  const closeCountryPopup = ({ restoreFocus = true } = {}) => {
    setCountryPopupOpen(false);

    if (restoreFocus) {
      countryTrigger.focus();
    }
  };

  const renderCountrySelection = (option) => {
    const selectedCode = option.dataset.code;
    const selectedName = option.dataset.name;
    const selectedFlag = option.querySelector("svg");

    if (!selectedCode || !selectedName || !selectedFlag) {
      return false;
    }

    countryCode.textContent = selectedCode;
    countryFlag.setAttribute("viewBox", selectedFlag.getAttribute("viewBox") || "0 0 22 15");
    countryFlag.replaceChildren(
      ...Array.from(selectedFlag.childNodes, (node) => node.cloneNode(true))
    );
    countryTrigger.setAttribute("aria-label", `Код страны ${selectedName}, ${selectedCode}`);
    phoneInput.dataset.countryCode = selectedCode;

    countryOptions.forEach((countryOption) => {
      const isSelected = countryOption === option;

      countryOption.classList.toggle("is-selected", isSelected);
      countryOption.setAttribute("aria-selected", String(isSelected));
    });

    return true;
  };

  const selectCountry = (option) => {
    if (renderCountrySelection(option)) {
      closeCountryPopup();
    }
  };

  countryTrigger.addEventListener("click", () => {
    setCountryPopupOpen(countryPopup.hidden);
  });

  countryPopupClose?.addEventListener("click", () => closeCountryPopup());
  countryPopupBackButton?.addEventListener("click", () => closeCountryPopup());

  countryOptions.forEach((option) => {
    option.addEventListener("click", () => selectCountry(option));
  });

  document.addEventListener("click", (event) => {
    if (!countrySelector.contains(event.target) && !countryPopup.hidden) {
      closeCountryPopup({ restoreFocus: false });
    }
  });

  countrySelector.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !countryPopup.hidden) {
      event.preventDefault();
      closeCountryPopup();
      return;
    }

    if (event.target === countryTrigger && event.key === "ArrowDown") {
      event.preventDefault();
      setCountryPopupOpen(true);
      countryOptions[0].focus();
      return;
    }

    const currentIndex = countryOptions.indexOf(event.target);

    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % countryOptions.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + countryOptions.length) % countryOptions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = countryOptions.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    countryOptions[nextIndex].focus();
  });

  if ("ResizeObserver" in window) {
    const countrySelectorResizeObserver = new ResizeObserver(updatePhoneInputPadding);
    countrySelectorResizeObserver.observe(countryTrigger);
    countrySelectorResizeObserver.observe(phoneInput);
  }

  window.addEventListener("resize", updatePhoneInputPadding, { passive: true });

  if (selectedOption) {
    renderCountrySelection(selectedOption);
  }

  updatePhoneInputPadding();
}

function initHomeNewsSlider() {
  const section = document.querySelector(".home-news");
  const viewport = section?.querySelector(".home-news__viewport");
  const track = viewport?.querySelector(".home-news__grid");
  const controls = section?.querySelector(".slider-controls");
  const pagination = controls?.querySelector(".slider-controls__pagination");
  const previousButton = controls?.querySelector(".slider-controls__arrow--prev");
  const nextButton = controls?.querySelector(".slider-controls__arrow--next");

  if (
    !viewport ||
    !track ||
    !pagination ||
    !previousButton ||
    !nextButton ||
    track.dataset.initialized === "true"
  ) {
    return;
  }

  const cards = Array.from(track.querySelectorAll(":scope > .home-news__card"));

  if (cards.length < 2) {
    return;
  }

  track.dataset.initialized = "true";

  let activeIndex = 0;
  let paginationDots = [];

  const getVisibleCards = () => {
    const value = window
      .getComputedStyle(viewport)
      .getPropertyValue("--home-news-visible-cards")
      .trim();
    const parsedValue = Number.parseInt(value, 10);

    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1;
  };

  const renderPagination = () => {
    paginationDots = Array.from({ length: cards.length }, (_, index) => {
      const dot = document.createElement("button");

      dot.className = "slider-controls__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Показать новость " + (index + 1));
      dot.setAttribute("aria-controls", viewport.id);
      dot.addEventListener("click", () => setActiveIndex(index));

      return dot;
    });

    pagination.replaceChildren(...paginationDots);
  };

  const updateSlider = () => {
    if (!section.isConnected) {
      return;
    }

    const visibleCards = getVisibleCards();
    const lastIndex = Math.max(0, cards.length - visibleCards);

    activeIndex = Math.min(Math.max(activeIndex, 0), lastIndex);

    if (paginationDots.length !== cards.length) {
      renderPagination();
    }

    const activeCard = cards[activeIndex];
    const trackOffset = activeCard.offsetLeft - cards[0].offsetLeft;

    track.style.transform = "translate3d(-" + trackOffset + "px, 0, 0)";
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === lastIndex;

    paginationDots.forEach((dot, index) => {
      const isActive = index === activeIndex;

      dot.classList.toggle("slider-controls__dot--active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    pagination.setAttribute(
      "aria-label",
      "Новости. Активная карточка " + (activeIndex + 1) + " из " + cards.length
    );
  };

  const setActiveIndex = (index) => {
    activeIndex = index;
    updateSlider();
  };

  previousButton.setAttribute("aria-controls", viewport.id);
  nextButton.setAttribute("aria-controls", viewport.id);

  previousButton.addEventListener("click", () => setActiveIndex(activeIndex - 1));
  nextButton.addEventListener("click", () => setActiveIndex(activeIndex + 1));

  viewport.addEventListener("keydown", (event) => {
    if (event.target !== viewport) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  const handleResize = () => {
    if (!section.isConnected) {
      window.removeEventListener("resize", handleResize);
      return;
    }

    updateSlider();
  };

  window.addEventListener("resize", handleResize, { passive: true });

  document.fonts?.ready.then(updateSlider);

  updateSlider();
}
function initHome() {
  const hero = document.querySelector(".home-hero");

  if (!hero) {
    return;
  }

  initHomeHeroSlider(hero);
  initHomeNewsSlider();
  initHomeProjectsSlider();
  initServicesContact();
  initHomeProcessCards();

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
