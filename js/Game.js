"use strict";

const maxRandomNumber = 100;
const maxChances = 10;

const scoreDisplay = document.getElementById("high-score");
const maxNumberInput = document.getElementById("max-number");
const chancesInput = document.getElementById("chances");
const guessInput = document.getElementById("guess");
const startBtn = document.getElementById("start-game");
const submitGuessBtn = document.getElementById("submit-guess");
const restartBtn = document.getElementById("restart-game");
const resetScoreBtn = document.getElementById("reset-score");
const messageEl = document.getElementById("message");
const guessesList = document.getElementById("guesses-list");
const gameSettingsSection = document.querySelector(".game-settings");
const gamePlaySection = document.querySelector(".game-play");
const body = document.body;

// -------------------- تم‌ها --------------------
const themes = {
  light: { name: "روشن", minScore: 30, className: "theme-light", font: "'Vazir', sans-serif" },
  stars: { name: "ستاره‌ای", minScore: 40, className: "theme-stars", font: "'Cairo', sans-serif" },
  sky: { name: "آسمانی", minScore: 60, className: "theme-sky", font: "'Tajawal', sans-serif" }
};

const themeButtons = {};
const themeContainer = document.createElement("div");
themeContainer.className = "d-flex justify-content-center gap-3 my-3";

for (const [key, { name }] of Object.entries(themes)) {
  const btn = document.createElement("button");
  btn.id = `theme-${key}`;
  btn.className = "btn btn-outline-secondary fw-bold px-4";
  btn.textContent = name;
  btn.disabled = true;
  themeButtons[key] = btn;
  themeContainer.appendChild(btn);
}

const resetThemeBtn = document.createElement("button");
resetThemeBtn.id = "reset-theme";
resetThemeBtn.className = "btn btn-outline-secondary fw-bold px-4";
resetThemeBtn.textContent = "حالت پیش‌فرض";
themeContainer.appendChild(resetThemeBtn);

gameSettingsSection.after(themeContainer);

// -------------------- متغیرهای بازی --------------------
let randomNumber = null;
let chancesLeft = 0;
let guessesMade = [];
let gameStarted = false;
let currentScore = 0;
let activeTheme = null;

// -------------------- توابع پایه --------------------
function getHighScore() {
  return Number(localStorage.getItem("highScore")) || 0;
}

function saveHighScore(score) {
  const highScore = getHighScore();
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    return true;
  }
  return false;
}

function updateScoreDisplay() {
  scoreDisplay.textContent = getHighScore();
}

// -------------------- تم --------------------
function applyTheme(themeKey) {
  Object.keys(themes).forEach(k => body.classList.remove(themes[k].className));
  const theme = themes[themeKey];
  if (!theme) return;

  activeTheme = themeKey;
  body.classList.add(theme.className);
  body.style.fontFamily = theme.font;
  localStorage.setItem("theme", themeKey);
  showMessage(`تم "${theme.name}" فعال شد.`, "success");
}

function resetTheme() {
  Object.keys(themes).forEach(k => body.classList.remove(themes[k].className));
  activeTheme = null;
  body.style.fontFamily = "";
  body.style.backgroundColor = "";
  body.style.background = "";
  body.style.color = "";
  localStorage.removeItem("theme");
  showMessage("تم به حالت پیش‌فرض بازگشت.", "warning");
}

function updateThemeButtons() {
  const score = getHighScore();
  for (const [key, theme] of Object.entries(themes)) {
    const btn = themeButtons[key];
    if (score >= theme.minScore) {
      btn.disabled = false;
      btn.title = `فعال! امتیاز کافی دارید (${theme.minScore}+ امتیاز)`;
      btn.classList.remove("btn-outline-secondary");
      btn.classList.add("btn-success");
    } else {
      btn.disabled = true;
      btn.title = `برای فعال‌سازی به ${theme.minScore} امتیاز نیاز دارید`;
      btn.classList.add("btn-outline-secondary");
      btn.classList.remove("btn-success");
      if (activeTheme === key) resetTheme();
    }
  }
}

// -------------------- گیم‌پلی --------------------
function startGame() {
  const maxNum = Number(maxNumberInput.value);
  const chances = Number(chancesInput.value);

  if (isNaN(maxNum) || maxNum < 1 || maxNum > maxRandomNumber || isNaN(chances) || chances < 1 || chances > maxChances) {
    showMessage("ورودی‌ها معتبر نیستند. لطفاً بررسی کنید.", "error");
    return;
  }

  randomNumber = Math.floor(Math.random() * maxNum) + 1;
  chancesLeft = chances;
  guessesMade = [];
  gameStarted = true;
  currentScore = 0;

  guessInput.disabled = false;
  submitGuessBtn.disabled = false;
  guessInput.value = "";
  guessInput.setAttribute("min", 1);
  guessInput.setAttribute("max", maxNum);
  guessInput.focus();

  startBtn.disabled = true;

  gamePlaySection.classList.remove("d-none");
  gameSettingsSection.classList.add("d-none");

  showMessage(`بازی شروع شد! عددی بین 1 تا ${maxNum} حدس بزنید.`, "warning");
  guessesList.innerHTML = "";
}

function calculateScore(maxNum, maxChances, guessesCount) {
  const numberFactor = Math.log(maxNum) / Math.log(maxRandomNumber);
  const chanceFactor = (maxChances - guessesCount + 1) / maxChances;
  let score = Math.round(100 * numberFactor * chanceFactor);
  return Math.max(score, 10);
}

function submitGuess() {
  if (!gameStarted) return;

  const maxNum = Number(maxNumberInput.value);
  let guess = Number(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > maxNum) {
    showMessage(`عدد باید بین 1 تا ${maxNum} باشد.`, "error");
    return;
  }

  if (guessesMade.includes(guess)) {
    showMessage("این عدد قبلاً حدس زده شده است.", "error");
    return;
  }

  guessesMade.push(guess);
  chancesLeft--;

  if (guess === randomNumber) {
    currentScore = calculateScore(maxNum, Number(chancesInput.value), guessesMade.length);
    const isNewHighScore = saveHighScore(currentScore);
    updateScoreDisplay();
    updateThemeButtons();
    showMessage(`🎉 درست بود! امتیاز: ${currentScore}`, "success");
    if (isNewHighScore && window.confetti) confetti();

    endGame();
  } else {
    showMessage(guess < randomNumber ? "عدد بزرگ‌تر است." : "عدد کوچک‌تر است.", "error");
    addGuessToList(guess);
    if (chancesLeft === 0) {
      showMessage(`❌ شانس تمام شد! عدد صحیح: ${randomNumber}`, "error");
      endGame();
    }
  }

  guessInput.value = "";
  guessInput.focus();
}

function endGame() {
  guessInput.disabled = true;
  submitGuessBtn.disabled = true;
  startBtn.disabled = false;
}

function addGuessToList(guess) {
  const li = document.createElement("li");
  li.textContent = `حدس شما: ${guess}`;
  guessesList.appendChild(li);
}

function resetGame() {
  randomNumber = null;
  chancesLeft = 0;
  guessesMade = [];
  gameStarted = false;
  currentScore = 0;

  guessInput.value = "";
  guessInput.disabled = true;
  submitGuessBtn.disabled = true;
  messageEl.textContent = "";
  messageEl.className = "message";

  guessesList.innerHTML = "";
  startBtn.disabled = false;

  gamePlaySection.classList.add("d-none");
  gameSettingsSection.classList.remove("d-none");

  updateScoreDisplay();
  updateThemeButtons();
}

function showMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = "message";
  if (type) messageEl.classList.add(`message-${type}`);
}

// -------------------- رویدادها --------------------
startBtn.addEventListener("click", startGame);
submitGuessBtn.addEventListener("click", submitGuess);
restartBtn.addEventListener("click", resetGame);
resetScoreBtn.addEventListener("click", () => {
  localStorage.removeItem("highScore");
  updateScoreDisplay();
  updateThemeButtons();
  resetTheme();
  showMessage("امتیاز پاک شد.", "warning");
});

resetThemeBtn.addEventListener("click", resetTheme);

Object.entries(themeButtons).forEach(([key, btn]) => {
  btn.addEventListener("click", () => {
    const score = getHighScore();
    if (score >= themes[key].minScore) {
      applyTheme(key);
    } else {
      alert(`برای فعال‌سازی "${themes[key].name}" باید حداقل ${themes[key].minScore} امتیاز داشته باشید.`);
    }
  });
});

// -------------------- بارگذاری اولیه --------------------
window.addEventListener("load", () => {
  updateScoreDisplay();
  updateThemeButtons();
  resetGame();
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme);
  }
});
