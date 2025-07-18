// ===== menu.js =====

function openTool(url) {
  const overlay = document.createElement('div');
  overlay.classList.add('page-transition');
  document.body.appendChild(overlay);

  overlay.style.animation = 'fadeOut 0.5s ease';
  setTimeout(() => {
    window.location.href = url;
  }, 400);
}

// Transition CSS injector
const style = document.createElement('style');
style.innerHTML = `
  .page-transition {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: #0077b6;
    z-index: 1000;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);

// Entry animation for cards
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }, 150 * i);
  });
});
