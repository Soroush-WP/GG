// ===== scripts.js for index.html =====

function startMagic() {
  const intro = document.querySelector('.intro');
  intro.innerHTML = `
    <h2>✨ آماده‌ای؟</h2>
    <p>الان می‌تونی از منوی بالا یکی از ابزارهای خفن ما رو انتخاب کنی و استفاده ببری!</p>
    <img src="https://cdn-icons-png.flaticon.com/512/3658/3658752.png" alt="magic" style="width:100px; margin-top:1rem; animation: pulse 1s infinite;">
  `;
  intro.style.transition = 'all 0.5s ease';
  intro.style.backgroundColor = '#f0f4ff';
  intro.style.padding = '2rem';
}

// افکت کوچیک هنگام ورود صفحه
window.addEventListener('DOMContentLoaded', () => {
  const cta = document.querySelector('.cta-button');
  cta.style.opacity = 0;
  cta.style.transform = 'translateY(20px)';
  setTimeout(() => {
    cta.style.transition = 'all 0.6s ease';
    cta.style.opacity = 1;
    cta.style.transform = 'translateY(0)';
  }, 300);
});

// انیمیشن CSS برای ایمیج
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);
