document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  const nameInput = document.getElementById("nameInput");
  const resultBox = document.getElementById("result");

  const levels = [
    { min: 1, max: 2, title: "ساده و معمولی", icon: "fas fa-leaf", color: "#28a745", description: "اسم کوتاه و شیرینی داری!" },
    { min: 3, max: 4, title: "متعادل و شیک", icon: "fas fa-star", color: "#007bff", description: "اسم متعادل با تلفظی دل‌نشین!" },
    { min: 5, max: 6, title: "خاص و تاثیرگذار", icon: "fas fa-gem", color: "#6610f2", description: "اسم تو جلب توجه می‌کنه!" },
    { min: 7, max: 8, title: "کمیاب و یونیک", icon: "fas fa-crown", color: "#e83e8c", description: "اسم خیلی خاص و چشم‌نواز داری!" },
    { min: 9, max: 12, title: "افسانه‌ای و قدرتمند", icon: "fas fa-dragon", color: "#fd7e14", description: "اسم تو مثل یک پادشاه حماسیه." },
    { min: 13, max: 99, title: "فرازمینی و جاودانه", icon: "fas fa-meteor", color: "#6f42c1", description: "اسم نادری داری که هیچ‌کس فراموش نمی‌کنه!" }
  ];

  // تایپ انیمیشن
  function typeEffect(element, text, speed = 40) {
    element.innerHTML = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
  }

  // افکت نور
  function glowEffect() {
    resultBox.classList.add("glow-animate");
    setTimeout(() => {
      resultBox.classList.remove("glow-animate");
    }, 1500);
  }

  submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    resultBox.innerHTML = "";

    if (name.length === 0) {
      resultBox.innerHTML = `<p class="text-danger fw-bold animated fade-in"><i class="fas fa-times-circle"></i> لطفاً یک نام وارد کن!</p>`;
      return;
    }

    // امتیازدهی خلاقانه
    const score = name.length + Math.floor(Math.random() * 3); // کمی تصادفی برای جذابیت

    const category = levels.find(lvl => score >= lvl.min && score <= lvl.max) || levels[levels.length - 1];

    const resultHTML = `
      <div class="result-card animated bounceIn" style="border-color: ${category.color}">
        <div class="icon-box" style="color: ${category.color}"><i class="${category.icon} fa-3x"></i></div>
        <h3 class="mt-3">${category.title}</h3>
        <p class="description">${category.description}</p>
        <span class="badge" style="background-color: ${category.color}">امتیاز: ${score}</span>
      </div>
    `;

    glowEffect();
    setTimeout(() => {
      resultBox.innerHTML = resultHTML;
    }, 500);
  });
});