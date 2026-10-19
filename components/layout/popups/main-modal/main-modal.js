window.initMainModal = function() {
  const overlay = document.getElementById('mainModalOverlay');
  const closeBtn = document.getElementById('mainModalCloseBtn');
  const openBtn = document.getElementById('openMainModalBtn');
  const form = document.getElementById('mainModalForm');

  if (!overlay || !openBtn) return;

  window.openModal = function() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', window.openModal);
  closeBtn.addEventListener('click', closeModal);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    form.reset();
  });
};