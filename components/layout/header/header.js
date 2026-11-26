function initHeader() {
  const header = document.querySelector(".app-header-component");
  const burger = header?.querySelector(".header-burger");
  const menu = header?.querySelector(".header-top");
  const navigation = header?.querySelector(".header__nav");
  const navList = navigation?.querySelector(".nav-list");
  const location = header?.querySelector(".header__location");
  // Ширина, с которой шапка переключается на бургер-меню, как в CSS
  const menuMedia = window.matchMedia("(max-width: 1250px)");

  // Страна, валюта и язык: пункт выбирается мышкой, Enter или пробелом.
  // Выбранный пункт отмечается галочкой, его название пишется в шапке
  if (header && header.dataset.locationInitialized !== "true") {
    header.dataset.locationInitialized = "true";

    const getChoiceLabel = (item) => {
      return (
        item.querySelector(".header__location-choice-name")?.textContent.trim() ||
        item.querySelector(".header__location-choice-code")?.textContent.trim() ||
        item.querySelector(".header__location-choice-country")?.textContent.trim() ||
        item.textContent.trim()
      );
    };

    header.addEventListener("click", (event) => {
      const item = event.target.closest(".header__location-choice-item");
      const choice = item?.closest(".header__location-choice");

      if (!choice) {
        return;
      }

      choice
        .querySelector(".header__location-choice-item--selected")
        ?.classList.remove("header__location-choice-item--selected");

      item.classList.add("header__location-choice-item--selected");

      const current = choice.parentElement.querySelector(".header__location-current");

      if (current) {
        current.textContent = getChoiceLabel(item);
      }
    });

    header.addEventListener("keydown", (event) => {
      const item = event.target.closest(".header__location-choice-item");

      if (item && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        item.click();
      }
    });
  }

  // Бургер-меню: открывается и закрывается кнопкой «Меню», клавишей Esc и переходом по ссылке.
  // При закрытии все раскрытые списки внутри меню сворачиваются
  if (burger && menu && header.dataset.menuInitialized !== "true") {
    header.dataset.menuInitialized = "true";

    if (!menu.id) {
      menu.id = "header-menu";
    }

    burger.setAttribute("role", "button");
    burger.setAttribute("tabindex", "0");
    burger.setAttribute("aria-controls", menu.id);

    const setMenuOpen = (isOpen) => {
      header.classList.toggle("is-menu-open", isOpen);
      document.documentElement.classList.toggle("is-header-menu-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));

      if (!isOpen) {
        header.querySelectorAll(".is-open").forEach((element) => {
          element.classList.remove("is-open");
        });

        header.querySelectorAll(".nav-link[aria-expanded]").forEach((link) => {
          link.setAttribute("aria-expanded", "false");
        });
      }
    };

    const toggleMenu = () => {
      setMenuOpen(!header.classList.contains("is-menu-open"));
    };

    // Элементы, на которые можно перейти с клавиатуры, в том порядке, в каком они видны в открытом меню.
    // В html меню стоит раньше кнопки «Меню», а страна, язык и валюта идут в другом порядке,
    // поэтому обычный переход по Tab в открытом меню прыгал бы не туда
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = (container) => {
      return Array.from(container?.querySelectorAll(focusableSelector) || []).filter((element) => {
        return element.getClientRects().length && getComputedStyle(element).visibility !== "hidden";
      });
    };

    const getMenuFocusOrder = () => {
      return [
        burger,
        ...getFocusable(navigation),
        ...getFocusable(header.querySelector(".header__contacts")),
        ...getFocusable(header.querySelector(".header__location-country")),
        ...getFocusable(header.querySelector(".header__location-country-code")),
        ...getFocusable(header.querySelector(".header__location-money")),
        ...getFocusable(header.querySelector(".header-bottom")).filter((element) => element !== burger),
      ];
    };

    setMenuOpen(header.classList.contains("is-menu-open"));

    burger.addEventListener("click", toggleMenu);

    burger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      }
    });

    // Ссылка, которая раскрыла подменю (preventDefault), меню не закрывает
    header.addEventListener("click", (event) => {
      if (event.target.closest(".header__nav a") && !event.defaultPrevented) {
        setMenuOpen(false);
      }
    });

    // В открытом меню Tab и Shift+Tab ходят по кругу только внутри меню, Esc закрывает меню
    document.addEventListener("keydown", (event) => {
      if (!header.classList.contains("is-menu-open")) {
        return;
      }

      if (event.key === "Escape") {
        setMenuOpen(false);
        burger.focus();
      }

      if (event.key === "Tab") {
        const order = getMenuFocusOrder();
        const index = order.indexOf(document.activeElement);
        const step = event.shiftKey ? -1 : 1;
        const firstIndex = event.shiftKey ? order.length - 1 : 0;

        event.preventDefault();
        order[index === -1 ? firstIndex : (index + step + order.length) % order.length].focus();
      }
    });

    menuMedia.addEventListener("change", (event) => {
      if (!event.matches) {
        setMenuOpen(false);
      }
    });
  }

  // Бургер-меню: пункт с подменю раскрывается первым нажатием (мышкой или Enter), второе нажатие ведёт по ссылке.
  // Сейчас ссылка растянута на весь пункт (.nav-link::after), поэтому нажатие на иконку справа тоже считается нажатием на ссылку
  if (navList && navList.dataset.initialized !== "true") {
    navList.dataset.initialized = "true";

    navList.addEventListener("click", (event) => {
      const item = event.target.closest(".nav-list__item");
      const submenu = item?.querySelector(".nav-list__nested-list");

      if (!menuMedia.matches || !submenu || submenu.contains(event.target)) {
        return;
      }

      const link = item.querySelector(".nav-link");

      if (link?.contains(event.target) && item.classList.contains("is-open")) {
        return;
      }

      event.preventDefault();

      const isOpen = item.classList.toggle("is-open");

      link?.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Бургер-меню: списки страны, языка и валюты открываются нажатием на выбранное значение (мышкой, Enter или пробелом).
  // После выбора пункта список сворачивается, фокус возвращается на выбранное значение
  if (location && location.dataset.initialized !== "true") {
    location.dataset.initialized = "true";

    const toggleSelector = ".header__location-country, .header__location-money, .header__location-country-code";

    location.addEventListener("click", (event) => {
      const block = event.target.closest(toggleSelector);

      if (!menuMedia.matches || !block) {
        return;
      }

      if (event.target.closest(".header__location-choice-item")) {
        block.classList.remove("is-open");
        block.querySelector(".header__location-current")?.focus();
      } else if (!event.target.closest(".header__location-choice")) {
        block.classList.toggle("is-open");
      }
    });

    location.addEventListener("keydown", (event) => {
      const current = event.target.closest(".header__location-current");

      if (menuMedia.matches && current && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        current.closest(toggleSelector)?.classList.toggle("is-open");
      }
    });
  }
}

initHeader();
