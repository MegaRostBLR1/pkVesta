(() => {
  const STORAGE_KEY = 'cookie-consent';

  function initCookiesPopup() {
    const popup = document.querySelector('.cookies');
    const settings = document.querySelector('.cookies-settings');

    if (!popup || popup.dataset.initialized === 'true') {
      return;
    }

    popup.dataset.initialized = 'true';

    let savedConsent = null;

    try {
      savedConsent = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      // Storage may be unavailable; keep the consent controls usable for this visit.
    }

    if (!savedConsent) {
      popup.hidden = false;
    }

    const settingsButton = popup.querySelector('[data-cookies-settings]');
    const closeSettingsButton = settings?.querySelector('[data-cookies-settings-close]');
    const acceptButtons = [
      popup.querySelector('[data-cookies-accept]'),
      settings?.querySelector('[data-cookies-settings-accept]')
    ].filter(Boolean);
    const rejectButtons = [
      popup.querySelector('[data-cookies-reject]'),
      settings?.querySelector('[data-cookies-settings-reject]')
    ].filter(Boolean);

    function saveConsent(value) {
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch (error) {
        // Do not block the UI if storage is unavailable.
      }

      popup.hidden = true;

      if (settings) {
        settings.hidden = true;
      }
    }

    function openSettings() {
      if (!settings) {
        popup.dispatchEvent(new CustomEvent('cookies:settings', { bubbles: true }));
        return;
      }

      popup.hidden = true;
      settings.hidden = false;
      closeSettingsButton?.focus();
    }

    function closeSettings() {
      if (!settings) {
        return;
      }

      settings.hidden = true;

      if (!savedConsent) {
        popup.hidden = false;
        settingsButton?.focus();
      }
    }

    acceptButtons.forEach((button) => {
      button.addEventListener('click', () => saveConsent('accepted'));
    });

    rejectButtons.forEach((button) => {
      button.addEventListener('click', () => saveConsent('rejected'));
    });

    popup.querySelector('[data-cookies-close]')?.addEventListener('click', () => {
      popup.hidden = true;
    });

    settingsButton?.addEventListener('click', openSettings);
    closeSettingsButton?.addEventListener('click', closeSettings);

    settings?.querySelectorAll('[data-cookies-policy]').forEach((link) => {
      link.addEventListener('click', (event) => event.preventDefault());
    });

    popup.querySelectorAll('[data-cookies-policy]').forEach((link) => {
      link.addEventListener('click', (event) => event.preventDefault());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && settings && !settings.hidden) {
        closeSettings();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookiesPopup, { once: true });
  } else {
    initCookiesPopup();
  }
})();
