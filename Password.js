(() => {
  const lengthInput = document.getElementById('length');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const generateBtn = document.getElementById('generateBtn');
  const passwordOutput = document.getElementById('passwordOutput');
  const copyBtn = document.getElementById('copyBtn');
  const strengthIndicator = document.getElementById('strengthIndicator');
  const strengthText = document.getElementById('strengthText');

  // کاراکترهای مختلف
  const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/~`',
  };

  // تولید پسورد
  function generatePassword(length, options) {
    let chars = '';
    if (options.uppercase) chars += CHAR_SETS.uppercase;
    if (options.lowercase) chars += CHAR_SETS.lowercase;
    if (options.numbers) chars += CHAR_SETS.numbers;
    if (options.symbols) chars += CHAR_SETS.symbols;

    if (!chars) return '';

    let password = '';
    // حتما از هر دسته حداقل یک کاراکتر اضافه شود (اگر انتخاب شده باشد)
    const mustInclude = [];
    if (options.uppercase) mustInclude.push(randomChar(CHAR_SETS.uppercase));
    if (options.lowercase) mustInclude.push(randomChar(CHAR_SETS.lowercase));
    if (options.numbers) mustInclude.push(randomChar(CHAR_SETS.numbers));
    if (options.symbols) mustInclude.push(randomChar(CHAR_SETS.symbols));

    for (let i = 0; i < length - mustInclude.length; i++) {
      password += randomChar(chars);
    }
    // جایگذاری تصادفی کاراکترهای اجباری
    password += mustInclude.join('');
    password = shuffleString(password);
    return password;
  }

  // تابع برای انتخاب کاراکتر تصادفی از رشته
  function randomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
  }

  // تابع برای به هم ریختن رشته
  function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  // ارزیابی قدرت پسورد
  function evaluateStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { level: 'ضعیف', className: 'weak' };
    else if (score <= 4) return { level: 'متوسط', className: 'medium' };
    else if (score === 5) return { level: 'قوی', className: 'strong' };
    else return { level: 'خیلی قوی', className: 'very-strong' };
  }

  // بروزرسانی وضعیت قدرت پسورد
  function updateStrengthUI(pwd) {
    const result = evaluateStrength(pwd);
    strengthText.textContent = result.level;
    strengthIndicator.className = 'strength ' + result.className;
  }

  // کپی پسورد به کلیپ‌بورد با انیمیشن کوتاه
  function copyToClipboard() {
    const text = passwordOutput.value;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = '✔️';
      copyBtn.style.backgroundColor = '#06d6a0';
      setTimeout(() => {
        copyBtn.textContent = '📋';
        copyBtn.style.backgroundColor = '#6c63ff';
      }, 1600);
    });
  }

  // event listeners
  generateBtn.addEventListener('click', () => {
    const length = Math.min(Math.max(parseInt(lengthInput.value, 10) || 16, 6), 64);
    lengthInput.value = length;

    const options = {
      uppercase: uppercaseCheckbox.checked,
      lowercase: lowercaseCheckbox.checked,
      numbers: numbersCheckbox.checked,
      symbols: symbolsCheckbox.checked,
    };

    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
      alert('لطفاً حداقل یک نوع کاراکتر را انتخاب کنید!');
      return;
    }

    const password = generatePassword(length, options);
    passwordOutput.value = password;
    updateStrengthUI(password);
  });

  copyBtn.addEventListener('click', copyToClipboard);

  // تولید اولیه پسورد هنگام بارگذاری صفحه
  window.addEventListener('DOMContentLoaded', () => {
    generateBtn.click();
  });
})();
