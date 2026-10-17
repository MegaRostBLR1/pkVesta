const accordionHeads = document.querySelectorAll(".accordion__head");

accordionHeads.forEach((item) => {
  const accordion = item.closest(".accordion");
  const button = item.querySelector(".accordion__btn");
  const title = item.querySelector(".footer-accordion__title")?.textContent.trim() || "меню";

  const syncExpandedState = () => {
    if (!button) return;
    const expanded = accordion.classList.contains("active");
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", (expanded ? "Свернуть" : "Развернуть") + " раздел «" + title + "»");
  };

  syncExpandedState();

  item.addEventListener("click", () => {
    accordion.classList.toggle("active");
    syncExpandedState();
  });
});
