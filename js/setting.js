(function(){
  const langSelect = document.getElementById('lang-select');
  const themeSwitch = document.getElementById('theme-switch');
  const fontRadios = document.getElementsByName('font-radio');
  const resetBtn = document.getElementById('reset-all-btn');

  // ترجمه کل المنت‌ها بر اساس دیتا
  function translatePage(lang) {
    document.querySelectorAll('[data-text-fa]').forEach(el => {
      const fa = el.getAttribute('data-text-fa');
      const en = el.getAttribute('data-text-en');
      el.textContent = lang === 'fa' ? fa : en;
    });
  }

  function applyLang(lang) {
    if(lang === 'en') document.documentElement.setAttribute('lang','en'), document.documentElement.setAttribute('dir','ltr');
    else document.documentElement.setAttribute('lang','fa'), document.documentElement.setAttribute('dir','rtl');
    translatePage(lang);
    localStorage.setItem('lang', lang);
  }

  function applyTheme(dark) {
    document.body.classList.toggle('bg-dark', dark);
    document.body.classList.toggle('bg-light', !dark);
    localStorage.setItem('darkTheme', dark);
  }

  function applyFont(font) {
    document.body.style.fontFamily = font === 'vazir' ? `'Vazir', sans-serif` : `system-ui, sans-serif`;
    localStorage.setItem('font', font);
  }

  function loadSettings() {
    const lang = localStorage.getItem('lang') || 'fa';
    langSelect.value = lang;
    applyLang(lang);

    const dark = localStorage.getItem('darkTheme') === 'true';
    themeSwitch.checked = dark;
    applyTheme(dark);

    const font = localStorage.getItem('font') || 'vazir';
    document.getElementById('font-'+font).checked = true;
    applyFont(font);
  }

  function resetAll() {
    localStorage.clear();
    loadSettings();
    alert(langSelect.value === 'fa' ? 'تمام تنظیمات ریست شدند' : 'All settings reset!');
  }

  // لیسنر‌ها
  langSelect.addEventListener('change', e=>applyLang(e.target.value));
  themeSwitch.addEventListener('change', e=>applyTheme(e.target.checked));
  fontRadios.forEach(r=>r.addEventListener('change', ()=>applyFont(document.querySelector('input[name="font-radio"]:checked').value)));
  resetBtn.addEventListener('click', resetAll);

  // بارگذاری اولیه
  loadSettings();
})();
