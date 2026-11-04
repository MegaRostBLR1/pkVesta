function initFaq() {
  const faqContent = document.querySelector(".press-faq-content");

  if (!faqContent || faqContent.dataset.initialized === "true") return;
  faqContent.dataset.initialized = "true";

  const categories = document.querySelectorAll(".press-faq__category");
  const groups = faqContent.querySelectorAll(".press-faq-group");
  const items = faqContent.querySelectorAll(".press-faq-item");

  categories.forEach((category) => {
    category.addEventListener("click", () => {
      categories.forEach((item) => {
        const isActive = item === category;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      const selectedCategory = category.dataset.category;
      items.forEach((item) => {
        const itemCategories = (item.dataset.categories || "").split(/\s+/);
        item.hidden = selectedCategory !== "all" && !itemCategories.includes(selectedCategory);
      });

      groups.forEach((group) => {
        group.hidden = !group.querySelector(".press-faq-item:not([hidden])");
      });
    });
  });

  // items.forEach((item) => {
  //     const trigger = item.querySelector('.press-faq-item__question');
  //     const answer = item.querySelector('.press-faq-item__answer');
  //     if (!trigger || !answer) return;

  //     trigger.addEventListener('click', () => {
  //         const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
  //         trigger.setAttribute('aria-expanded', String(!isExpanded));
  //         item.classList.toggle('press-faq-item--expanded', !isExpanded);
  //         answer.hidden = isExpanded;

  //         const icon = trigger.querySelector('.press-faq-item__toggle');
  //         if (icon) {
  //             icon.replaceChildren();
  //             const symbol = document.createElement('span');
  //             symbol.className = isExpanded ? 'press-faq-item__plus' : 'press-faq-item__minus';
  //             icon.append(symbol);
  //         }
  //     });
  // });

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

  faqContent.querySelectorAll(".press-faq-item__show-more").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".press-faq-item");
      if (!item) return;

      const isExpanded = item.classList.toggle("press-faq-item--show-all");
      button.setAttribute("aria-expanded", String(isExpanded));
      const label = button.querySelector("span");
      if (label) label.textContent = isExpanded ? "Скрыть" : "Показать еще";
    });
  });
}
