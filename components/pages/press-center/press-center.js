function initPressCenter() {
  const root = document.querySelector(".press-center");

  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const categories = root.querySelectorAll(".press-center__category");
  categories.forEach((category) => {
    category.addEventListener("click", () => {
      categories.forEach((item) => {
        item.classList.remove("is-active");
        item.removeAttribute("aria-current");
      });
      category.classList.add("is-active");
      category.setAttribute("aria-current", "page");
    });
  });

  const loadMoreButton = document.querySelector(".press-center__load-more");
  const cardsContainer = document.querySelector(".press-center__cards");

  if (loadMoreButton && cardsContainer) {
    function checkButtonVisibility() {
      const totalCards = cardsContainer.querySelectorAll(".press-center__card").length;

      let visibleByDefault = 6; // десктоп
      if (window.matchMedia("(max-width: 1300px)").matches) visibleByDefault = 4;
      if (window.matchMedia("(max-width: 680px)").matches) visibleByDefault = 1;

      loadMoreButton.hidden = totalCards <= visibleByDefault;
    }

    loadMoreButton.addEventListener("click", () => {
      const isExpanded = loadMoreButton.getAttribute("aria-expanded") === "true";
      loadMoreButton.setAttribute("aria-expanded", String(!isExpanded));
      loadMoreButton.textContent = isExpanded ? "Показать еще" : "Скрыть";

      cardsContainer.classList.toggle("is-expanded", !isExpanded);
    });

    checkButtonVisibility();
    window.addEventListener("resize", checkButtonVisibility);
  }
}
