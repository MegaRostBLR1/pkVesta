function initNewsItem() {
  const root = document.querySelector(".news-item");

  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const galleryGrid = root.querySelector(".news-gallery__grid");
  const moreButton = root.querySelector(".news-gallery__more");

  if (galleryGrid && moreButton) {
    const moreButtonText = moreButton.querySelector("span");

    moreButton.addEventListener("click", () => {
      const isExpanded = moreButton.getAttribute("aria-expanded") === "true";

      galleryGrid.classList.toggle("is-expanded", !isExpanded);
      moreButton.setAttribute("aria-expanded", String(!isExpanded));
      moreButtonText.textContent = isExpanded ? "Показать еще" : "Скрыть";
    });
  }

  const articles = root.querySelector(".news-article__columns");
  const moreButtonArticle = root.querySelector(".news-article__more");

  if (moreButtonArticle && articles) {
    const moreButtonArticleText = moreButtonArticle.querySelector("span");

    moreButtonArticle.addEventListener("click", () => {
      const isExpanded = moreButtonArticle.getAttribute("aria-expanded") === "true";

      articles.classList.toggle("is-expanded", !isExpanded);
      moreButtonArticle.setAttribute("aria-expanded", String(!isExpanded));
      moreButtonArticleText.textContent = isExpanded ? "Показать еще" : "Скрыть";
    });
  }
}