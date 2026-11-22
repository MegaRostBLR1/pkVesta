(() => {
  function initSubscribePopup() {
    const popup = document.querySelector('.subscribe');

    if (!popup || popup.dataset.initialized === 'true') return;
    popup.dataset.initialized = 'true';

    const form = popup.querySelector('[data-subscribe-form]');
    const closeButton = popup.querySelector('[data-subscribe-close]');
    const backButton = popup.querySelector('[data-subscribe-back]');
    const message = popup.querySelector('[data-subscribe-message]');
    let opener = null;

    function closePopup() {
      popup.hidden = true;
      opener?.focus();
    }

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('.footer__subscribe-btn');

      if (!trigger) return;

      event.preventDefault();
      opener = trigger;
      popup.hidden = false;
      popup.querySelector('#subscribe-email')?.focus();
    });

    closeButton?.addEventListener('click', closePopup);
    backButton?.addEventListener('click', closePopup);

    popup.addEventListener('click', (event) => {
      if (event.target === popup) closePopup();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !popup.hidden) closePopup();
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (message) {
        message.textContent = 'Форма заполнена. Для оформления подписки необходимо подключить API.';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubscribePopup, { once: true });
  } else {
    initSubscribePopup();
  }
})();
