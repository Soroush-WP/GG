// ===== Calculator.js =====

(() => {
  const screen = document.getElementById('screen');
  let expression = '';
  let lastInputType = null; // 'number', 'operator', 'decimal'

  const operators = ['+', '-', '*', '/', '%'];

  // انیمیشن کوچک هنگام کلیک دکمه
  function animateButton(btn) {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 100);
  }

  // نمایش مقدار در صفحه
  function updateScreen(value) {
    screen.textContent = value || '0';
  }

  // پاک کردن همه
  function clearAll() {
    expression = '';
    updateScreen('0');
    lastInputType = null;
  }

  // حذف آخرین کاراکتر
  function backspace() {
    expression = expression.slice(0, -1);
    updateScreen(expression || '0');
    lastInputType = /\d/.test(expression.slice(-1)) ? 'number' : (operators.includes(expression.slice(-1)) ? 'operator' : null);
  }

  // اعتبارسنجی ورودی برای جلوگیری از خطاهای ریاضی
  function canAppend(char) {
    if (operators.includes(char)) {
      // اپراتور نمی‌تواند پشت سر هم باشد
      if (!expression || operators.includes(expression.slice(-1))) return false;
      return true;
    }
    if (char === '.') {
      // فقط یک نقطه می‌تواند در عدد باشد
      // پیدا کردن آخرین عدد از راست
      const parts = expression.split(/[\+\-\*\/\%]/);
      const lastNumber = parts[parts.length - 1];
      if (lastNumber.includes('.')) return false;
      return true;
    }
    return true; // برای اعداد
  }

  // افزودن ورودی به عبارت
  function appendInput(char) {
    if (!canAppend(char)) return;
    expression += char;
    updateScreen(expression);
    lastInputType = operators.includes(char) ? 'operator' : (char === '.' ? 'decimal' : 'number');
  }

  // محاسبه عبارت با امنیت بیشتر
  function calculate() {
    if (!expression) return;

    // اگر آخرین کاراکتر اپراتور است، آن را حذف کن
    while (operators.includes(expression.slice(-1))) {
      expression = expression.slice(0, -1);
    }
    try {
      // eslint-disable-next-line no-eval
      let result = eval(expression);

      // اصلاح نتایج عددی
      if (typeof result === 'number' && !Number.isInteger(result)) {
        result = +result.toFixed(8); // تا 8 رقم اعشار
      }
      expression = result.toString();
      updateScreen(expression);
    } catch (e) {
      updateScreen('خطا');
      expression = '';
    }
  }

  // مدیریت کلیک روی دکمه‌ها
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;

      animateButton(btn);

      if (action === 'clear') {
        clearAll();
        return;
      }
      if (action === 'back') {
        backspace();
        return;
      }
      if (action === 'calculate') {
        calculate();
        return;
      }
      if (value) {
        appendInput(value);
      }
    });
  });

  // پشتیبانی از کلیدهای صفحه کلید (keyboard)
  window.addEventListener('keydown', e => {
    e.preventDefault();
    const key = e.key;

    if (key === 'Enter' || key === '=') {
      calculate();
      return;
    }
    if (key === 'Backspace') {
      backspace();
      return;
    }
    if (key === 'Escape') {
      clearAll();
      return;
    }
    if (/[\d\.]/.test(key)) {
      appendInput(key);
      return;
    }
    if (['+', '-', '*', '/', '%'].includes(key)) {
      appendInput(key);
      return;
    }
  });

  // شروع با مقدار صفر
  clearAll();
})();
