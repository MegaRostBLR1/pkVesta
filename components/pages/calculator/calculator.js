function initCalculator() {
  document.querySelector('.tooltip-demo__close').addEventListener('click', () => {
  const details = document.querySelector('.tooltip-demo');
  // С той же анимацией закрытия, что выше
  details.open = false; 
});
}
