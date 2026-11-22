function initCalculator() {
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
  
  // Крестик закрывает подсказку «Что включает демонстрация?»
  const tooltipDemo = document.querySelector('.tooltip-demo');
  const tooltipDemoClose = tooltipDemo?.querySelector('.tooltip-demo__close');

  if (tooltipDemoClose && tooltipDemo.dataset.initialized !== 'true') {
    tooltipDemo.dataset.initialized = 'true';

    tooltipDemoClose.addEventListener('click', () => {
      tooltipDemo.open = false;
    });
  }

  const comparison = document.querySelector('.comparison');
  const comparisonTable = comparison?.querySelector('.comparison__table');
  const comparisonHeader = comparisonTable?.querySelector('.comparison__nav .comparison__slider-wrapper');

  // Сравнение: слайдер колонок. Стрелки листают по одной колонке и ходят по кругу,
  // точки на телефоне показывают положение, на тач-экранах листается свайпом.
  // Колонки шапки и всех строк сдвигает одна переменная --comparison-shift у таблицы
  if (comparisonHeader && comparisonHeader.children.length && comparison.dataset.sliderInitialized !== 'true') {
    comparison.dataset.sliderInitialized = 'true';

    const columns = comparisonHeader.children;
    const arrows = comparison.querySelectorAll('.comparison__nav-arr');
    const prevArrows = comparison.querySelectorAll('.comparison__nav-arr--prev');
    const nextArrows = comparison.querySelectorAll('.comparison__nav-arr--next');
    const dotsWrapper = comparison.querySelector('.slider-controls__dots');
    let index = 0;

    // До какой колонки можно долистать: всего колонок минус те, что помещаются
    const getMaxIndex = () => {
      const visible = Math.round(comparisonHeader.getBoundingClientRect().width / columns[0].getBoundingClientRect().width);

      return Math.max(0, columns.length - Math.max(visible, 1));
    };

    const goTo = (newIndex) => {
      const maxIndex = getMaxIndex();
      const firstLeft = columns[0].getBoundingClientRect().left;
      // На последнем положении последняя колонка прижимается к правому краю
      const maxShift =
        columns[columns.length - 1].getBoundingClientRect().right - firstLeft - comparisonHeader.getBoundingClientRect().width;

      index = Math.min(Math.max(newIndex, 0), maxIndex);

      const shift = index === maxIndex ? Math.max(maxShift, 0) : columns[index].getBoundingClientRect().left - firstLeft;

      comparisonTable.style.setProperty('--comparison-shift', `${-shift}px`);
      arrows.forEach((arrow) => {
        arrow.disabled = maxIndex === 0;
      });

      // Точек столько, сколько положений у слайдера
      if (dotsWrapper && dotsWrapper.children.length !== maxIndex + 1) {
        dotsWrapper.innerHTML = '';

        for (let i = 0; i <= maxIndex; i++) {
          const dot = document.createElement('button');

          dot.className = 'slider-controls__dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', `Слайд ${i + 1}`);
          dot.addEventListener('click', () => goTo(i));
          dotsWrapper.append(dot);
        }
      }

      Array.from(dotsWrapper?.children || []).forEach((dot, i) => {
        dot.classList.toggle('slider-controls__dot--active', i === index);

        if (i === index) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    };

    prevArrows.forEach((arrow) => {
      arrow.addEventListener('click', () => goTo(index > 0 ? index - 1 : getMaxIndex()));
    });

    nextArrows.forEach((arrow) => {
      arrow.addEventListener('click', () => goTo(index < getMaxIndex() ? index + 1 : 0));
    });

    // Свайп: листает, только если палец сдвинулся по горизонтали сильнее, чем по вертикали
    let touchStartX = 0;
    let touchStartY = 0;

    comparisonTable.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    comparisonTable.addEventListener('touchend', (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goTo(deltaX < 0 ? index + 1 : index - 1);
      }
    }, { passive: true });

    window.addEventListener('resize', () => goTo(index));
    goTo(0);
  }

  // Сравнение: строка открывается и закрывается по клику на свой заголовок
  if (comparisonTable && comparisonTable.dataset.rowsInitialized !== 'true') {
    comparisonTable.dataset.rowsInitialized = 'true';

    comparisonTable.addEventListener('click', (event) => {
      const header = event.target.closest('.comparison__row-header');

      if (!header) {
        return;
      }

      const isOpen = header.closest('.comparison__row').classList.toggle('comparison__row--open');

      header.querySelector('.comparison__row-btn')?.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Сравнение: «Показать еще» показывает скрытые строки, повторное нажатие снова их прячет
  const comparisonMore = comparison?.querySelector('.comparison__btn');

  if (comparisonTable && comparisonMore && comparisonMore.dataset.initialized !== 'true') {
    comparisonMore.dataset.initialized = 'true';

    comparisonMore.addEventListener('click', () => {
      const isExpanded = comparisonTable.classList.toggle('is-expanded');

      comparisonMore.setAttribute('aria-expanded', String(isExpanded));
      comparisonMore.textContent = isExpanded ? 'Свернуть' : 'Показать еще';
    });
  }
}
