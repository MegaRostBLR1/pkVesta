function initArticles() {
  const loadMoreButton = document.querySelector(".press-center__load-more");
  const cardsContainer = document.querySelector(".articles__list");

  if (loadMoreButton && cardsContainer) {
    function checkButtonVisibility() {
      const totalCards = cardsContainer.querySelectorAll(".articles__card").length;

      let visibleByDefault = 3;
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
