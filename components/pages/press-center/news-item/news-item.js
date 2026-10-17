function initNewsItem() {
    const gallery = document.querySelector('.news-gallery');

    if (!gallery) {
        return;
    }

    const moreButton = gallery.querySelector('.news-gallery__more');

    if (!moreButton) {
        return;
    }

    moreButton.addEventListener('click', () => {
        const isExpanded = moreButton.getAttribute('aria-expanded') === 'true';

        gallery.querySelectorAll('.news-gallery__item--additional').forEach((item) => {
            item.style.display = isExpanded ? '' : 'block';
        });

        moreButton.setAttribute('aria-expanded', String(!isExpanded));
        moreButton.textContent = isExpanded ? 'Показать еще' : 'Скрыть';
    });
}
