"use strict";

// مدیریت کلیک روی دکمه‌ها
document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    if (target.startsWith("#")) {
      // اسکرول به بخش داخلی صفحه
      const section = document.querySelector(target);
      if (section) {
        section.classList.add("visible");
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // انتقال به صفحه دیگر
      window.location.href = target;
    }
  });
});

(function applyGlobalLanguageSetting() {
  const lang = localStorage.getItem('lang') || 'fa';

  // تنظیم جهت و زبان صفحه
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

  // ترجمه المنت‌هایی که data-text-fa و data-text-en دارند
  document.querySelectorAll('[data-text-fa]').forEach(el => {
    const fa = el.getAttribute('data-text-fa');
    const en = el.getAttribute('data-text-en');
    el.textContent = lang === 'fa' ? fa : en;
  });

  // تغییر کلاس‌های زبان در body
  document.body.classList.toggle('lang-fa', lang === 'fa');
  document.body.classList.toggle('lang-en', lang === 'en');
})();
