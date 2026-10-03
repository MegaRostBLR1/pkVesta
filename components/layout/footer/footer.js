const accordionHeads = document.querySelectorAll(".accordion__head");

accordionHeads.forEach((item) => {
  item.addEventListener("click", () => {
    const accordion = item.closest(".accordion");
    accordion.classList.toggle("active");
  });
});
