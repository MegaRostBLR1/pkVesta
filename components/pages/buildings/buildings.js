function initBuildings() {
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

      if (link) {
        if (link.getAttribute("href")?.startsWith("#/")) {
          setExpanded(false);
          return;
        }

        if (!isExpanded) {
          event.preventDefault();
          setExpanded(true);
        }

        return;
      }

      setExpanded(!isExpanded);
    });

    // Первый экран целиком ушёл вверх — меню прилипает к низу экрана
    const agro = tabs.closest(".buildings-agro");

    if (agro && "IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        tabs.classList.toggle("is-fixed", !entry.isIntersecting && entry.boundingClientRect.top < 0);
      }).observe(agro);
    }
  }

  // Кнопка «Наверх» появляется, когда пролистали больше экрана
  const scrollTopButton = document.querySelector(".scroll-top");

  if (scrollTopButton && scrollTopButton.dataset.initialized !== "true") {
    scrollTopButton.dataset.initialized = "true";

    const updateScrollTop = () => {
      const isScrolled = window.scrollY > window.innerHeight * 2;

      scrollTopButton.classList.toggle("is-visible", isScrolled);
      tabs?.classList.toggle("is-narrow", isScrolled);
    };

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", updateScrollTop, { passive: true });
    updateScrollTop();
  }

  // Попапы страницы: окно «Подробнее» и увеличенное фото.
  // Открытые попапы лежат стопкой: Esc, «Закрыть» и клик по затемнению закрывают верхний
  const lightboxOverlay = document.querySelector(".photo-lightbox-overlay");
  const openedPopups = [];

  // Переносит фото вместе с большой картинкой и подписью
  const copyPhoto = (from, to) => {
    to.src = from.getAttribute("src");
    to.alt = from.alt;
    to.dataset.fullSrc = from.dataset.fullSrc || from.getAttribute("src");
    to.dataset.caption = from.dataset.caption || "";
  };

  const openPopup = (overlay, opener) => {
    overlay.classList.add("active");
    openedPopups.push({ overlay, opener });
    document.body.style.overflow = "hidden";
    overlay.querySelector("[data-popup-close]").focus();
  };

  const closePopup = () => {
    const popup = openedPopups.pop();

    if (!popup) {
      return;
    }

    popup.overlay.classList.remove("active");

    if (!openedPopups.length) {
      document.body.style.overflow = "";
    }

    popup.opener.focus();
  };

  // Увеличенное фото: большая картинка из data-full-src, подпись из data-caption
  const openLightbox = (image, opener) => {
    const lightboxImage = lightboxOverlay.querySelector(".photo-lightbox__image");
    const lightboxCaption = lightboxOverlay.querySelector(".photo-lightbox__caption");

    lightboxImage.src = image.dataset.fullSrc || image.getAttribute("src");
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.dataset.caption || "";
    lightboxCaption.hidden = !image.dataset.caption;
    openPopup(lightboxOverlay, opener);
  };

  document.addEventListener("click", (event) => {
    const popup = openedPopups[openedPopups.length - 1];

    if (popup && (event.target === popup.overlay || event.target.closest("[data-popup-close]"))) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    const popup = openedPopups[openedPopups.length - 1];

    if (!popup) {
      return;
    }

    if (event.key === "Escape") {
      closePopup();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    // Tab ходит по кругу внутри открытого окна
    const focusable = Array.from(popup.overlay.querySelectorAll("a[href], button:not([disabled])")).filter(
      (element) => element.getClientRects().length
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isInside = popup.overlay.contains(document.activeElement);

    if (event.shiftKey && (!isInside || document.activeElement === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (!isInside || document.activeElement === last)) {
      event.preventDefault();
      first.focus();
    }
  });

  const description = document.querySelector(".buildings-description");

  if (!description) {
    return;
  }

  const industries = description.querySelector(".buildings-description__industries");
  const industriesToggle = description.querySelector(".buildings-description__industries-toggle");

  if (industries && industriesToggle && industries.dataset.toggleInitialized !== "true") {
    industries.dataset.toggleInitialized = "true";

    const industryItems = industries.querySelectorAll(".buildings-description__industries-list li");

    // Кнопка нужна, только если отрасли не влезли в одну строку:
    // последняя отрасль начинается ниже первой строки, значит в свёрнутом виде она скрыта
    const updateIndustriesToggle = () => {
      const first = industryItems[0];
      const last = industryItems[industryItems.length - 1];

      industriesToggle.hidden = !last || last.offsetTop < first.offsetTop + first.offsetHeight;
    };

    industriesToggle.addEventListener("click", () => {
      const expanded = industriesToggle.getAttribute("aria-expanded") !== "true";
      industries.classList.toggle("is-expanded", expanded);
      industriesToggle.setAttribute("aria-expanded", String(expanded));
      industriesToggle.querySelector("span").textContent = expanded ? "Скрыть" : "Показать еще";
    });

    window.addEventListener("resize", updateIndustriesToggle);
    document.fonts?.ready.then(updateIndustriesToggle);
    updateIndustriesToggle();
  }

  //  аккордеон
  const accordion = description.querySelector(".buildings-description__accordion");
  const mainImage = description.querySelector(
    ".buildings-description__accordion-media--main .buildings-description__image"
  );
  const modalOverlay = description.querySelector(".accordion-item__modal-overlay");

  if (accordion && mainImage && modalOverlay && lightboxOverlay && accordion.dataset.initialized !== "true") {
    accordion.dataset.initialized = "true";

    const modalImage = modalOverlay.querySelector(".accordion-item__modal-image");
    const modalTitle = modalOverlay.querySelector(".accordion-item__modal-title");
    const modalText = modalOverlay.querySelector(".accordion-item__modal-text");
    const modalSlider = modalOverlay.querySelector(".accordion-item__modal-slider");
    const modalPagination = modalSlider.querySelector(".slider-controls__pagination");
    let modalPhotos = [];
    let photoIndex = 0;

    const showModalPhoto = (index) => {
      photoIndex = (index + modalPhotos.length) % modalPhotos.length;
      copyPhoto(modalPhotos[photoIndex], modalImage);
      modalPagination.setAttribute("aria-label", `Фото ${photoIndex + 1} из ${modalPhotos.length}`);
      modalPagination.querySelectorAll(".slider-controls__dot").forEach((dot, dotIndex) => {
        dot.classList.toggle("slider-controls__dot--active", dotIndex === photoIndex);
      });
    };

    const openModal = (item, opener) => {
      const details = item.querySelector(".buildings-description__details");

      modalTitle.textContent = item.querySelector(".buildings-description__item-title").textContent;
      modalText.innerHTML = details.querySelector(".buildings-description__details-content").innerHTML;
      modalPhotos = [
        item.querySelector(".buildings-description__image"),
        ...details.querySelectorAll(".buildings-description__details-photos img"),
      ];
      modalPagination.innerHTML = modalPhotos
        .map(() => '<span class="slider-controls__dot" aria-hidden="true"></span>')
        .join("");
      modalSlider.hidden = modalPhotos.length < 2;
      showModalPhoto(0);
      openPopup(modalOverlay, opener);
    };

    description.addEventListener("click", (event) => {
      const trigger = event.target.closest(".buildings-description__accordion-trigger");
      const more = event.target.closest(".buildings-description__more");
      const zoom = event.target.closest(".buildings-description__zoom, .accordion-item__modal-zoom");
      const arrow = event.target.closest(".accordion-item__modal-slider .slider-controls__arrow");

      // Открыли пункт аккордеона: большое фото слева меняется на фото этого пункта
      if (trigger && trigger.getAttribute("aria-expanded") === "true") {
        const item = trigger.closest(".buildings-description__item");
        copyPhoto(item.querySelector(".buildings-description__image"), mainImage);
      }

      if (more) {
        openModal(more.closest(".buildings-description__item"), more);
      }

      if (zoom) {
        openLightbox(zoom.parentElement.querySelector("img"), zoom);
      }

      if (arrow) {
        showModalPhoto(photoIndex + (arrow.classList.contains("slider-controls__arrow--prev") ? -1 : 1));
      }
    });
  }

  const gallery = document.querySelector(".buildings-gallery");
  const galleryPhotos = gallery ? Array.from(gallery.querySelectorAll(".buildings-gallery__photos img")) : [];
  const galleryPrev = gallery?.querySelector("[data-gallery-prev]");
  const galleryNext = gallery?.querySelector("[data-gallery-next]");

  if (galleryPhotos.length && galleryPrev && galleryNext && gallery.dataset.initialized !== "true") {
    gallery.dataset.initialized = "true";

    // Три места на экране: слева, по центру, справа
    const slideImages = Array.from(gallery.querySelectorAll("[data-gallery-slide] > img"));
    const pagination = gallery.querySelector(".slider-controls__pagination");
    const zoom = gallery.querySelector(".buildings-gallery__zoom");
    let activeIndex = 0;

    // Точек столько же, сколько фото
    pagination.innerHTML = galleryPhotos
      .map(() => '<span class="slider-controls__dot" aria-hidden="true"></span>')
      .join("");

    const renderGallery = () => {
      // Слева предыдущее фото, по центру текущее, справа следующее
      [-1, 0, 1].forEach((shift, slideIndex) => {
        const photo = galleryPhotos[(activeIndex + shift + galleryPhotos.length) % galleryPhotos.length];

        copyPhoto(photo, slideImages[slideIndex]);
      });

      pagination.setAttribute("aria-label", `Слайд ${activeIndex + 1} из ${galleryPhotos.length}`);
      Array.from(pagination.children).forEach((dot, dotIndex) => {
        dot.classList.toggle("slider-controls__dot--active", dotIndex === activeIndex);
      });
    };

    // По кругу: после последнего фото — первое, перед первым — последнее
    const move = (direction) => {
      activeIndex = (activeIndex + direction + galleryPhotos.length) % galleryPhotos.length;
      renderGallery();
    };

    galleryPrev.disabled = galleryPhotos.length < 2;
    galleryNext.disabled = galleryPhotos.length < 2;
    galleryPrev.addEventListener("click", () => move(-1));
    galleryNext.addEventListener("click", () => move(1));

    // Лупа открывает тот же лайтбокс, что и в «Описании», с текущим фото
    if (zoom && lightboxOverlay) {
      zoom.addEventListener("click", () => openLightbox(slideImages[1], zoom));
    }

    renderGallery();
  }

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
