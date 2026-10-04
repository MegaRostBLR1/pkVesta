function initHome() {
  const home = document.querySelector('.home');

  if (!home) {
    return;
  }

  home.querySelectorAll('.home__button').forEach((button) => {
    button.addEventListener('click', () => {
      // CTA actions will be connected when the corresponding routes/forms are available.
    });
  });
}
