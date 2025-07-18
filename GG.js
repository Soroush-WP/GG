// ===== GG.js =====

(() => {
  const guessInput = document.getElementById('guessInput');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const feedback = document.getElementById('feedback');
  const attemptsDisplay = document.getElementById('attempts');

  let targetNumber = 0;
  let attempts = 0;
  let gameOver = false;

  // انیمیشن پیام‌ها
  function showMessage(text, color = '#ffd166', duration = 2500) {
    feedback.style.opacity = 0;
    feedback.style.color = color;
    feedback.textContent = text;
    setTimeout(() => {
      feedback.style.opacity = 1;
    }, 100);
    if (duration > 0) {
      setTimeout(() => {
        feedback.style.opacity = 0;
      }, duration);
    }
  }

  // انیمیشن دکمه (بزرگ‌نمایی کوتاه)
  function animateButton(btn) {
    btn.style.transform = 'scale(1.1)';
    btn.style.boxShadow = '0 0 15px #ffd166';
    setTimeout(() => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    }, 200);
  }

  // ساخت عدد تصادفی ۱ تا ۱۰۰
  function generateNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  // بروزرسانی نمایش تعداد تلاش‌ها
  function updateAttempts() {
    attemptsDisplay.textContent = attempts;
  }

  // ذخیره بهترین رکورد در localStorage
  function saveRecord(attempts) {
    const prevRecord = localStorage.getItem('gg_bestRecord');
    if (!prevRecord || attempts < +prevRecord) {
      localStorage.setItem('gg_bestRecord', attempts);
      showMessage(`🎉 رکورد جدید: ${attempts} تلاش!`, '#06d6a0', 4000);
    }
  }

  // بارگذاری رکورد قبلی
  function loadRecord() {
    const rec = localStorage.getItem('gg_bestRecord');
    if (rec) {
      showMessage(`🥇 بهترین رکورد: ${rec} تلاش`, '#ffd166', 4000);
    }
  }

  // بررسی حدس کاربر
  function checkGuess() {
    if (gameOver) return;
    const guess = +guessInput.value;
    if (!guess || guess < 1 || guess > 100) {
      showMessage('⚠️ لطفا عددی بین 1 تا 100 وارد کن!', '#ef476f');
      animateButton(submitBtn);
      return;
    }
    attempts++;
    updateAttempts();

    if (guess === targetNumber) {
      showMessage(`🎉 تبریک! درست حدس زدی در ${attempts} تلاش!`, '#06d6a0', 6000);
      saveRecord(attempts);
      gameOver = true;
      submitBtn.disabled = true;
      guessInput.disabled = true;
      return;
    }
    if (guess < targetNumber) {
      showMessage('⬆️ عدد بزرگ‌تر! ادامه بده...', '#ffd166');
    } else {
      showMessage('⬇️ عدد کوچک‌تر! تلاش کن...', '#ffd166');
    }

    animateButton(submitBtn);
    guessInput.value = '';
    guessInput.focus();
  }

  // شروع بازی جدید
  function resetGame() {
    targetNumber = generateNumber();
    attempts = 0;
    gameOver = false;
    updateAttempts();
    feedback.style.opacity = 0;
    guessInput.value = '';
    guessInput.disabled = false;
    submitBtn.disabled = false;
    guessInput.focus();
    showMessage('🎯 بازی شروع شد! عدد بین 1 تا 100 رو حدس بزن.', '#90e0ef', 3000);
  }

  // رویدادها
  submitBtn.addEventListener('click', checkGuess);
  guessInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkGuess();
  });
  resetBtn.addEventListener('click', resetGame);

  // اجرای اولیه
  loadRecord();
  resetGame();
})();
