document.querySelectorAll(".accordion__btn").forEach((accordionButton) => {
  if (accordionButton.dataset.initialized === "true") return;
  accordionButton.dataset.initialized = "true";

  const accordionBody = document.getElementById(accordionButton.getAttribute("aria-controls"));
  if (!accordionBody) return;

  accordionButton.addEventListener("click", () => {
    const isExpanded = accordionButton.getAttribute("aria-expanded") === "true";
    accordionButton.setAttribute("aria-expanded", String(!isExpanded));
    accordionBody.hidden = isExpanded;
  });
});
