function initFaq() {
    const faqRoot = document.querySelector('.press-faq');

    if (!faqRoot) return;

    const categories = faqRoot.querySelectorAll('.press-faq__category');
    const items = document.querySelectorAll('.press-faq-item');

    categories.forEach((category) => {
        category.addEventListener('click', () => {
            categories.forEach((item) => {
                const isActive = item === category;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });

            const selectedCategory = category.dataset.category;
            items.forEach((item) => {
                const itemCategories = (item.dataset.categories || '').split(/\s+/);
                item.hidden = selectedCategory !== 'all' && !itemCategories.includes(selectedCategory);
            });
        });
    });

    items.forEach((item) => {
        const trigger = item.querySelector('.press-faq-item__question');
        const answer = item.querySelector('.press-faq-item__answer');
        if (!trigger || !answer) return;

        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!isExpanded));
            item.classList.toggle('press-faq-item--expanded', !isExpanded);
            answer.hidden = isExpanded;

            const icon = trigger.querySelector('.press-faq-item__toggle');
            if (icon) {
                icon.replaceChildren();
                const symbol = document.createElement('span');
                symbol.className = isExpanded ? 'press-faq-item__plus' : 'press-faq-item__minus';
                icon.append(symbol);
            }
        });
    });

    document.querySelectorAll('.press-faq-item__show-more').forEach((button) => {
        button.addEventListener('click', () => {
            const item = button.closest('.press-faq-item');
            if (!item) return;

            const isExpanded = item.classList.toggle('press-faq-item--show-all');
            button.setAttribute('aria-expanded', String(isExpanded));
            const label = button.querySelector('span');
            if (label) label.textContent = isExpanded ? 'Скрыть' : 'Показать еще';
        });
    });

    document.querySelectorAll('.press-faq-item__zoom').forEach((button) => {
        button.addEventListener('click', () => {
            const image = button.closest('.press-faq-item__media')?.querySelector('img');
            if (image?.src) window.open(image.src, '_blank', 'noopener,noreferrer');
        });
    });
}
