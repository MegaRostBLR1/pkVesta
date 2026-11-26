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

      // В закрытом меню видна только текущая вкладка: нажатие на неё открывает список, а не переходит по ссылке.
      // В открытом меню переход по любой вкладке закрывает список
      if (link && !isExpanded) {
        event.preventDefault();
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
  const industries = description?.querySelector(".buildings-description__industries");
  const industriesToggle = description?.querySelector(".buildings-description__industries-toggle");

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
  const accordion = description?.querySelector(".buildings-description__accordion");
  const mainImage = description?.querySelector(
    ".buildings-description__accordion-media--main .buildings-description__image"
  );
  const modalOverlay = description?.querySelector(".accordion-item__modal-overlay");

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
      const zoom = event.target.closest(".zoom-button");
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

   // «Преимущества»: стрелки листают пункты по одному. На десктопе список вертикальный, на ≤1100 — горизонтальный.
  // На тач-экранах стрелки скрыты, пункты листают свайпом
  const advantages = document.querySelector(".buildings-advantages");
  const advantagesList = advantages?.querySelector(".buildings-advantages__list");
  const advantagesPrev = advantages?.querySelector(".slider-controls__arrow--prev");
  const advantagesNext = advantages?.querySelector(".slider-controls__arrow--next");

  if (advantagesList && advantagesPrev && advantagesNext && advantages.dataset.sliderInitialized !== "true") {
    advantages.dataset.sliderInitialized = "true";

    const isVertical = () => getComputedStyle(advantagesList).flexDirection === "column";

    // Стрелки активны, только когда часть пунктов не влезла
    const updateAdvantagesArrows = () => {
      const hasHiddenItems = isVertical()
        ? advantagesList.scrollHeight - advantagesList.clientHeight > 1
        : advantagesList.scrollWidth - advantagesList.clientWidth > 1;

      advantagesPrev.disabled = !hasHiddenItems;
      advantagesNext.disabled = !hasHiddenItems;
    };

    // Листает на один пункт. С последнего переходит на первый, с первого — на последний
    const scrollAdvantages = (direction) => {
      const side = isVertical() ? "top" : "left";
      const position = side === "top" ? advantagesList.scrollTop : advantagesList.scrollLeft;
      const max =
        side === "top"
          ? advantagesList.scrollHeight - advantagesList.clientHeight
          : advantagesList.scrollWidth - advantagesList.clientWidth;
      const listStart = advantagesList.getBoundingClientRect()[side];
      // Где начинается каждый видимый пункт внутри списка
      const starts = Array.from(advantagesList.children)
        .filter((item) => item.getClientRects().length)
        .map((item) => item.getBoundingClientRect()[side] - listStart + position);
      let target;

      if (direction > 0) {
        target = position >= max - 1 ? 0 : starts.find((start) => start > position + 1) ?? max;
      } else {
        target = position <= 1 ? max : starts.filter((start) => start < position - 1).pop() ?? 0;
      }

      advantagesList.scrollTo({ [side]: target, behavior: "smooth" });
    };

    advantagesPrev.addEventListener("click", () => scrollAdvantages(-1));
    advantagesNext.addEventListener("click", () => scrollAdvantages(1));

    // Раскрытая карточка может быть выше списка (больше 4 пунктов) — тогда список вырастает под неё,
    // чтобы текст не обрезался. Когда такие карточки свёрнуты, список снова высотой в 4 пункта
    const fitOpenItems = () => {
      advantagesList.style.maxHeight = "";

      if (!isVertical()) {
        return;
      }

      // Полная высота раскрытой карточки, даже если анимация ещё не закончилась
      const openHeights = Array.from(advantagesList.querySelectorAll('.accordion__btn[aria-expanded="true"]'), (button) => {
        const item = button.closest(".buildings-advantages__item");
        const inner = item.querySelector(".accordion__inner");

        return item.offsetHeight + (inner ? inner.scrollHeight - inner.clientHeight : 0);
      });
      const tallest = Math.max(0, ...openHeights);

      if (tallest > advantagesList.clientHeight) {
        advantagesList.style.maxHeight = `${tallest}px`;
      }
    };

    // Пока раскрытая карточка растёт (анимация аккордеона — 0.3s), прокручиваем список вместе с ней:
    // низ карточки не уходит за край списка, а её верх не уезжает выше списка
    const followItem = (item) => {
      const start = performance.now();

      const step = (now) => {
        const listRect = advantagesList.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const shift = Math.min(itemRect.bottom - listRect.bottom, itemRect.top - listRect.top);

        if (shift > 0) {
          advantagesList.scrollTop += shift;
        }

        if (now - start < 350) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    // На десктопе высота списка меняется вместе с карточкой (transition в CSS), а раскрытая карточка не уходит за край
    advantagesList.addEventListener("click", (event) => {
      const button = event.target.closest(".accordion__btn");

      if (!button || !isVertical()) {
        return;
      }

      fitOpenItems();

      if (button.getAttribute("aria-expanded") === "true") {
        followItem(button.closest(".buildings-advantages__item"));
      }
    });

    // На ≤1100 ряд карточек растягивается по высоте самой высокой карточки. Если раскрытая карточка ушла за край ленты,
    // под видимыми карточками остаётся пустое место. Поэтому раскрытые карточки за краем ленты сворачиваем
    const closeHiddenItems = () => {
      if (isVertical()) {
        return;
      }

      const listRect = advantagesList.getBoundingClientRect();

      advantagesList.querySelectorAll('.accordion__btn[aria-expanded="true"]').forEach((button) => {
        const itemRect = button.closest(".buildings-advantages__item").getBoundingClientRect();

        if (itemRect.right <= listRect.left || itemRect.left >= listRect.right) {
          button.click();
        }
      });
    };

    advantagesList.addEventListener("scroll", closeHiddenItems, { passive: true });
    window.addEventListener("resize", () => {
      fitOpenItems();
      updateAdvantagesArrows();
      closeHiddenItems();
    });
    updateAdvantagesArrows();
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
  const catalogViewport = catalog?.querySelector(".buildings-catalog__cards");
  const catalogTrack = catalog?.querySelector(".buildings-catalog__track");
  const catalogPrev = catalog?.querySelector(".slider-controls__arrow--prev");
  const catalogNext = catalog?.querySelector(".slider-controls__arrow--next");
  const catalogPagination = catalog?.querySelector(".slider-controls__pagination");

  if (
    catalogViewport &&
    catalogTrack &&
    catalogPrev &&
    catalogNext &&
    catalog.dataset.sliderInitialized !== "true"
  ) {
    catalog.dataset.sliderInitialized = "true";

    const catalogCards = Array.from(catalogTrack.children);
    const paginationDots = Array.from(catalogPagination?.children || []);
    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const getMetrics = () => {
      const firstCard = catalogCards[0];
      const trackStyles = getComputedStyle(catalogTrack);
      const gap = parseFloat(trackStyles.columnGap) || 0;
      const cardWidth = firstCard?.getBoundingClientRect().width || 0;
      const step = cardWidth + gap;
      const visibleCount = step
        ? Math.max(1, Math.floor((catalogViewport.clientWidth + gap) / step))
        : 1;

      return {
        step,
        maxIndex: Math.max(0, catalogCards.length - visibleCount)
      };
    };

    const updateSlider = () => {
      const { step, maxIndex } = getMetrics();
      currentIndex = Math.min(currentIndex, maxIndex);

      catalogTrack.style.transform = `translateX(-${currentIndex * step}px)`;
      catalogPrev.disabled = maxIndex === 0;
      catalogNext.disabled = maxIndex === 0;

      paginationDots.forEach((dot, index) => {
        dot.hidden = index > maxIndex;
        dot.classList.toggle("slider-controls__dot--active", index === currentIndex);
      });

      if (catalogPagination) {
        catalogPagination.setAttribute(
          "aria-label",
          `Слайд ${currentIndex + 1} из ${maxIndex + 1}`
        );
      }
    };

    const moveSlider = (direction) => {
      const { maxIndex } = getMetrics();

      if (maxIndex === 0) return;

      if (direction > 0) {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      } else {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      }

      updateSlider();
    };

    catalogPrev.addEventListener("click", () => moveSlider(-1));
    catalogNext.addEventListener("click", () => moveSlider(1));

    catalogViewport.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      },
      { passive: true }
    );

    catalogViewport.addEventListener(
      "touchend",
      (event) => {
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
          return;
        }

        moveSlider(deltaX < 0 ? 1 : -1);
      },
      { passive: true }
    );

    window.addEventListener("resize", updateSlider);
    updateSlider();
  }
}
