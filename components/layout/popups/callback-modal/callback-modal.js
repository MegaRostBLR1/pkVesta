window.initCallbackModal = function() {
  const overlay = document.getElementById('callbackModalOverlay');

  if (!overlay || overlay.dataset.initialized === 'true') {
    return;
  }

  overlay.dataset.initialized = 'true';

  const dialog = overlay.querySelector('.callback-modal');
  const form = overlay.querySelector('#callbackModalForm');
  const nameInput = overlay.querySelector('#callbackModalName');
  const status = overlay.querySelector('#callbackModalStatus');
  const countrySelector = overlay.querySelector('[data-callback-country-selector]');
  const countryTrigger = countrySelector?.querySelector('.services-contact__phone-country');
  const countryPopup = countrySelector?.querySelector('.services-contact__country-popup');
  const countryCode = countrySelector?.querySelector('.services-contact__phone-code');
  const countryFlag = countrySelector?.querySelector('.services-contact__phone-flag');
  const phoneInput = countrySelector?.querySelector('#callbackModalPhone');
  const countryOptions = Array.from(countrySelector?.querySelectorAll('.services-contact__country-option') || []);
  const countryPopupClose = countrySelector?.querySelector('.services-contact__country-popup-close');
  const countryPopupBack = countrySelector?.querySelector('[data-callback-country-close]');

  let opener = null;
  let previousBodyOverflow = '';

  function setCountryPopupOpen(isOpen) {
    if (!countryPopup || !countryTrigger || !countrySelector) {
      return;
    }

    countryPopup.hidden = !isOpen;
    countryTrigger.setAttribute('aria-expanded', String(isOpen));
    countrySelector.classList.toggle('is-country-popup-open', isOpen);
    document.documentElement.classList.toggle('is-country-popup-open', isOpen);
  }

  function closeCountryPopup(restoreFocus = true) {
    if (!countryPopup || countryPopup.hidden) {
      return;
    }

    setCountryPopupOpen(false);

    if (restoreFocus) {
      countryTrigger?.focus();
    }
  }

  function openCallbackModal(trigger = document.activeElement) {
    if (!overlay.hidden) {
      return;
    }

    opener = trigger instanceof HTMLElement ? trigger : null;
    previousBodyOverflow = document.body.style.overflow;

    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (status) {
      status.hidden = true;
      status.textContent = '';
    }

    window.requestAnimationFrame(() => {
      nameInput?.focus({ preventScroll: true });
    });
  }

  function closeCallbackModal() {
    if (overlay.hidden) {
      return;
    }

    closeCountryPopup(false);
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;

    if (opener?.isConnected) {
      opener.focus();
    }

    opener = null;
  }

  function selectCountry(option) {
    if (!option || !countryCode || !countryFlag || !countryTrigger) {
      return;
    }

    const selectedCode = option.dataset.code;
    const selectedName = option.dataset.name;
    const selectedFlag = option.querySelector('.services-contact__country-flag');

    if (!selectedCode || !selectedName || !selectedFlag) {
      return;
    }

    countryCode.textContent = selectedCode;
    countryFlag.innerHTML = selectedFlag.innerHTML;
    countryFlag.setAttribute('viewBox', selectedFlag.getAttribute('viewBox') || '0 0 22 15');
    countryTrigger.setAttribute('aria-label', `Код страны ${selectedName}, ${selectedCode}`);

    countryOptions.forEach((countryOption) => {
      const isSelected = countryOption === option;
      countryOption.classList.toggle('is-selected', isSelected);
      countryOption.setAttribute('aria-selected', String(isSelected));
    });

    if (phoneInput) {
      phoneInput.dataset.countryCode = selectedCode;
    }

    closeCountryPopup();
  }

  window.openCallbackModal = openCallbackModal;
  window.closeCallbackModal = closeCallbackModal;

  countryTrigger?.addEventListener('click', () => {
    setCountryPopupOpen(Boolean(countryPopup?.hidden));
  });

  countryPopupClose?.addEventListener('click', () => closeCountryPopup());
  countryPopupBack?.addEventListener('click', () => closeCountryPopup());

  countryOptions.forEach((option) => {
    option.addEventListener('click', () => selectCountry(option));
  });

  countrySelector?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && countryPopup && !countryPopup.hidden) {
      event.preventDefault();
      event.stopPropagation();
      closeCountryPopup();
      return;
    }

    if (event.key === 'ArrowDown' && event.target === countryTrigger) {
      event.preventDefault();
      setCountryPopupOpen(true);
      countryOptions[0]?.focus();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const currentIndex = countryOptions.indexOf(event.target);

      if (currentIndex === -1) {
        return;
      }

      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (currentIndex + direction + countryOptions.length) % countryOptions.length;
      countryOptions[nextIndex]?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const trigger = event.target.closest('[data-callback-modal-open]');

    if (trigger) {
      event.preventDefault();
      openCallbackModal(trigger);
      return;
    }

    if (!overlay.hidden && countrySelector && !countrySelector.contains(event.target)) {
      closeCountryPopup(false);
    }

    const closeTrigger = event.target.closest('[data-callback-modal-close]');

    if (closeTrigger && overlay.contains(closeTrigger)) {
      closeCallbackModal();
    }
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeCallbackModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (overlay.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();

      if (countryPopup && !countryPopup.hidden) {
        closeCountryPopup();
      } else {
        closeCallbackModal();
      }

      return;
    }

    if (event.key !== 'Tab' || !dialog) {
      return;
    }

    const focusable = Array.from(dialog.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), summary, [href], [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.getClientRects().length > 0);

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    if (status) {
      status.textContent = 'Форма заполнена. Для отправки заявки необходимо подключить API.';
      status.hidden = false;
    }
  });
};
