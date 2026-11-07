function initBuildings() {
  const advantages = document.querySelector(".buildings-advantages");

  if (advantages && advantages.dataset.initialized !== "true") {
    advantages.dataset.initialized = "true";

    const items = Array.from(
      advantages.querySelectorAll(".buildings-advantages__item:not(.buildings-advantages__item--responsive)")
    );
    const previousButton = advantages.querySelector(".buildings-advantages__arrow--prev");
    const nextButton = advantages.querySelector(".buildings-advantages__arrow--next");
    let activeIndex = 0;

    const setActiveItem = (index) => {
      activeIndex = (index + items.length) % items.length;

      items.forEach((item, itemIndex) => {
        const isActive = itemIndex === activeIndex;
        item.classList.toggle("is-active", isActive);

        if (isActive) {
          item.setAttribute("aria-current", "step");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      if (previousButton) {
        previousButton.disabled = activeIndex === 0;
      }

      if (nextButton) {
        nextButton.disabled = activeIndex === items.length - 1;
      }
    };

    previousButton?.addEventListener("click", () => {
      if (activeIndex > 0) {
        setActiveItem(activeIndex - 1);
      }
    });

    nextButton?.addEventListener("click", () => {
      if (activeIndex < items.length - 1) {
        setActiveItem(activeIndex + 1);
      }
    });

    setActiveItem(0);
  }

  const tabs = document.querySelector(".buildings-agro__tabs");
  const toggle = tabs?.querySelector(".buildings-agro__tabs-toggle");
  const link = event.target.closest(".buildings-agro__tab");
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
  }

  const description = document.querySelector(".buildings-description");

  if (!description) {
    return;
  }

  const industries = description.querySelector(".buildings-description__industries");
  const industriesToggle = description.querySelector(".buildings-description__industries-toggle");

  if (industries && industriesToggle && industries.dataset.toggleInitialized !== "true") {
    industries.dataset.toggleInitialized = "true";
    industriesToggle.addEventListener("click", () => {
      const expanded = industriesToggle.getAttribute("aria-expanded") !== "true";
      industries.classList.toggle("is-expanded", expanded);
      industriesToggle.setAttribute("aria-expanded", String(expanded));
      industriesToggle.querySelector("span").textContent = expanded ? "Скрыть" : "Показать еще";
    });
  }

  //  аккордеон
  const accordion = description.querySelector(".buildings-description__accordion");
  const mainImage = description.querySelector(
    ".buildings-description__accordion-media--main .buildings-description__image"
  );
  const modalOverlay = description.querySelector(".accordion-item__modal-overlay");
  const lightboxOverlay = description.querySelector(".accordion-item__lightbox-overlay");

  if (accordion && mainImage && modalOverlay && lightboxOverlay) {
    const modalImage = modalOverlay.querySelector(".accordion-item__modal-image");
    const modalTitle = modalOverlay.querySelector(".accordion-item__modal-title");
    const modalText = modalOverlay.querySelector(".accordion-item__modal-text");
    const modalSlider = modalOverlay.querySelector(".accordion-item__modal-slider");
    const modalPagination = modalSlider.querySelector(".slider-controls__pagination");
    const lightboxImage = lightboxOverlay.querySelector(".accordion-item__lightbox-image");
    const lightboxCaption = lightboxOverlay.querySelector(".accordion-item__lightbox-caption");
    const openedPopups = [];
    let modalPhotos = [];
    let photoIndex = 0;

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

    const openLightbox = (image, opener) => {
      lightboxImage.src = image.dataset.fullSrc || image.getAttribute("src");
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.dataset.caption || "";
      lightboxCaption.hidden = !image.dataset.caption;
      openPopup(lightboxOverlay, opener);
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

    [modalOverlay, lightboxOverlay].forEach((overlay) => {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay || event.target.closest("[data-popup-close]")) {
          closePopup();
        }
      });
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
  }

  const gallery = document.querySelector(".buildings-gallery");

  if (gallery && gallery.dataset.initialized !== "true") {
    gallery.dataset.initialized = "true";

    const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
    const dots = Array.from(gallery.querySelectorAll(".buildings-gallery__dot"));
    const previous = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const lightbox = gallery.querySelector(".buildings-gallery__lightbox");
    const lightboxImage = gallery.querySelector(".buildings-gallery__lightbox-image");
    const zoom = gallery.querySelector(".buildings-gallery__zoom");
    const galleryImages = ["/static/images/bildings/gallery.jpg", "/static/images/bildings/gallery.jpg"];
    let activeIndex = 0;

    const renderGallery = () => {
      slides.forEach((slide, index) => {
        const isCenter = index === 1;
        slide.classList.toggle("buildings-gallery__slide--active", isCenter);
        slide.classList.toggle("buildings-gallery__slide--side", !isCenter);
      });

      const centerImage = slides[1]?.querySelector("img");
      if (centerImage) {
        centerImage.src = galleryImages[activeIndex % galleryImages.length];
      }

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle("is-active", isActive);
        if (isActive) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });

      if (centerImage && lightboxImage) {
        lightboxImage.src = centerImage.src;
        lightboxImage.alt = centerImage.alt;
      }
    };

    const move = (direction) => {
      activeIndex = (activeIndex + direction + dots.length) % dots.length;
      renderGallery();
    };

    previous?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
    zoom?.addEventListener("click", () => {
      if (lightbox && typeof lightbox.showModal === "function") lightbox.showModal();
    });
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
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
}
