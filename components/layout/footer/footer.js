document.querySelectorAll(".app-footer .footer-accordion__head").forEach((button) => {
  if (button.dataset.initialized === "true") return;

  const body = document.getElementById(button.getAttribute("aria-controls"));
  if (!body) return;

  button.dataset.initialized = "true";

  const syncExpandedState = (expanded) => {
    button.setAttribute("aria-expanded", String(expanded));
    body.classList.toggle("is-open", expanded);
  };

  syncExpandedState(button.getAttribute("aria-expanded") === "true");

  button.addEventListener("click", () => {
    syncExpandedState(button.getAttribute("aria-expanded") !== "true");
  });
});