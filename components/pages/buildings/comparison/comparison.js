function initBuildingsComparison() {
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

  const comparison = document.querySelector(".buildings-comparison");
  const comparisonTable = comparison?.querySelector(".comparison__table");
  const comparisonHeader = comparisonTable?.querySelector(".comparison__nav .comparison__slider-wrapper");

  // Сравнение: слайдер колонок. Стрелки листают по одной колонке и ходят по кругу,
  // точки на телефоне показывают положение, на тач-экранах листается свайпом.
  // Колонки шапки и всех строк сдвигает одна переменная --comparison-shift у таблицы
  if (comparisonHeader && comparisonHeader.children.length && comparison.dataset.sliderInitialized !== "true") {
    comparison.dataset.sliderInitialized = "true";

    const columns = comparisonHeader.children;
    const arrows = comparison.querySelectorAll(".comparison__nav-arr");
    const prevArrows = comparison.querySelectorAll(".comparison__nav-arr--prev");
    const nextArrows = comparison.querySelectorAll(".comparison__nav-arr--next");
    const dotsWrapper = comparison.querySelector(".slider-controls__dots");
    let index = 0;

    // До какой колонки можно долистать: всего колонок минус те, что помещаются
    const getMaxIndex = () => {
      const visible = Math.round(
        comparisonHeader.getBoundingClientRect().width / columns[0].getBoundingClientRect().width
      );

      return Math.max(0, columns.length - Math.max(visible, 1));
    };

    const goTo = (newIndex) => {
      const maxIndex = getMaxIndex();
      const firstLeft = columns[0].getBoundingClientRect().left;
      // На последнем положении последняя колонка прижимается к правому краю
      const maxShift =
        columns[columns.length - 1].getBoundingClientRect().right -
        firstLeft -
        comparisonHeader.getBoundingClientRect().width;

      index = Math.min(Math.max(newIndex, 0), maxIndex);

      const shift =
        index === maxIndex ? Math.max(maxShift, 0) : columns[index].getBoundingClientRect().left - firstLeft;

      comparisonTable.style.setProperty("--comparison-shift", `${-shift}px`);
      arrows.forEach((arrow) => {
        arrow.disabled = maxIndex === 0;
      });

      // Точек столько, сколько положений у слайдера
      if (dotsWrapper && dotsWrapper.children.length !== maxIndex + 1) {
        dotsWrapper.innerHTML = "";

        for (let i = 0; i <= maxIndex; i++) {
          const dot = document.createElement("button");

          dot.className = "slider-controls__dot";
          dot.type = "button";
          dot.setAttribute("aria-label", `Слайд ${i + 1}`);
          dot.addEventListener("click", () => goTo(i));
          dotsWrapper.append(dot);
        }
      }

      Array.from(dotsWrapper?.children || []).forEach((dot, i) => {
        dot.classList.toggle("slider-controls__dot--active", i === index);

        if (i === index) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    prevArrows.forEach((arrow) => {
      arrow.addEventListener("click", () => goTo(index > 0 ? index - 1 : getMaxIndex()));
    });

    nextArrows.forEach((arrow) => {
      arrow.addEventListener("click", () => goTo(index < getMaxIndex() ? index + 1 : 0));
    });

    // Свайп: листает, только если палец сдвинулся по горизонтали сильнее, чем по вертикали
    let touchStartX = 0;
    let touchStartY = 0;

    comparisonTable.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      },
      { passive: true }
    );

    comparisonTable.addEventListener(
      "touchend",
      (event) => {
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          goTo(deltaX < 0 ? index + 1 : index - 1);
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", () => goTo(index));
    goTo(0);
  }

  // Сравнение: строка открывается и закрывается по клику на свой заголовок
  if (comparisonTable && comparisonTable.dataset.rowsInitialized !== "true") {
    comparisonTable.dataset.rowsInitialized = "true";

    comparisonTable.addEventListener("click", (event) => {
      const header = event.target.closest(".comparison__row-header");

      if (!header) {
        return;
      }

      const isOpen = header.closest(".comparison__row").classList.toggle("comparison__row--open");

      header.querySelector(".comparison__row-btn")?.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Сравнение: «Показать еще» показывает скрытые строки, повторное нажатие снова их прячет
  const comparisonMore = comparison?.querySelector(".comparison__btn");

  if (comparisonTable && comparisonMore && comparisonMore.dataset.initialized !== "true") {
    comparisonMore.dataset.initialized = "true";

    comparisonMore.addEventListener("click", () => {
      const isExpanded = comparisonTable.classList.toggle("is-expanded");

      comparisonMore.setAttribute("aria-expanded", String(isExpanded));
      comparisonMore.textContent = isExpanded ? "Свернуть" : "Показать еще";
    });
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
      const openHeights = Array.from(
        advantagesList.querySelectorAll('.accordion__btn[aria-expanded="true"]'),
        (button) => {
          const item = button.closest(".buildings-advantages__item");
          const inner = item.querySelector(".accordion__inner");

          return item.offsetHeight + (inner ? inner.scrollHeight - inner.clientHeight : 0);
        }
      );
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
