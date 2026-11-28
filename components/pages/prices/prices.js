function initPrices() {
  const container = document.querySelector(".prices__table-container");
  window.initMobilePriceFilter?.(container);

  const notice = container?.closest(".prices")?.querySelector(".prices__notice");
  const noticeToggle = notice?.querySelector(".prices__notice-toggle");

  if (notice && noticeToggle && notice.dataset.initialized !== "true") {
    notice.dataset.initialized = "true";
    noticeToggle.addEventListener("click", () => {
      const expanded = notice.classList.toggle("is-expanded");
      noticeToggle.setAttribute("aria-expanded", String(expanded));
      const label = noticeToggle.querySelector("span");
      if (label) label.textContent = expanded ? "Скрыть" : "Показать еще";
    });
  }
}