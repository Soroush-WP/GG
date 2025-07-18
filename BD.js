(() => {
  const birthForm = document.getElementById('birthForm');
  const ageSpan = document.getElementById('age');
  const persianDateSpan = document.getElementById('persianDate');
  const gregorianDateSpan = document.getElementById('gregorianDate');
  const nextBirthdaySpan = document.getElementById('nextBirthday');
  const birthWeekdaySpan = document.getElementById('birthWeekday');
  const funFactSpan = document.getElementById('funFact');

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const persianWeekdays = [
    'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'
  ];

  // اعتبارسنجی روزها بر اساس ماه شمسی (اسفند 29 یا 30 روز)
  function isValidPersianDate(year, month, day) {
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;

    if (month <= 6 && day > 31) return false;
    if (month > 6 && month < 12 && day > 30) return false;

    // بررسی سال کبیسه برای اسفند (سال‌های کبیسه 30 روزه است)
    if (month === 12) {
      if (isPersianLeapYear(year)) {
        if (day > 30) return false;
      } else {
        if (day > 29) return false;
      }
    }
    return true;
  }

  // تشخیص سال کبیسه شمسی (Jalali)
  function isPersianLeapYear(jy) {
    // الگوریتم تقریباً دقیق سال کبیسه شمسی (33 ساله)
    const breaks = [
      -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
      1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ];
    let bl = breaks.length;
    let leapJ = -14;
    let jp = breaks[0];
    let jm, jump, N, leap, gy, march, i;

    if (jy < jp || jy >= breaks[bl - 1])
      throw new Error('سال خارج از محدوده محاسبه');

    for (i = 1; i < bl; i++) {
      jm = breaks[i];
      jump = jm - jp;
      if (jy < jm) break;
      leapJ = leapJ + Math.floor(jump / 33) * 8 + Math.floor(((jump % 33) + 3) / 4);
      jp = jm;
    }
    N = jy - jp;

    leapJ = leapJ + Math.floor(N / 33) * 8 + Math.floor(((N % 33) + 3) / 4);
    if (((jump % 33) === 4) && (jump - N === 4)) leapJ++;

    leap = ((leapJ + 1) % 33) - 1;
    return leap === -1 || leap === 0;
  }

  // تبدیل تاریخ شمسی به میلادی (تقریب دقیق)
  function toGregorian(jy, jm, jd) {
    const g_days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
    const j_days_in_month = [31,31,31,31,31,31,30,30,30,30,30,29];

    jy += 1595;
    let days = -355668 + (365 * jy) + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd;

    for (let i = 0; i < jm - 1; ++i) days += j_days_in_month[i];

    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;

    if (days > 36524) {
      gy += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }

    gy += 4 * Math.floor(days / 1461);
    days %= 1461;

    if (days > 365) {
      gy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }

    let gm = 0;
    let gd = 0;
    for (let i = 0; i < 12; i++) {
      let v = g_days_in_month[i];
      if (i === 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) v++;
      if (days < v) {
        gm = i + 1;
        gd = days + 1;
        break;
      }
      days -= v;
    }

    return { gy, gm, gd };
  }

  // محاسبه سن دقیق (سال، ماه، روز)
  function calculateAge(birthDate) {
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  // پیدا کردن تاریخ تولد بعدی در میلادی
  function nextBirthday(birthDate) {
    const now = new Date();
    let next = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (next < now) next.setFullYear(now.getFullYear() + 1);
    return next;
  }

  // تبدیل روز هفته میلادی به فارسی (شنبه = 0 شمسی)
  function getPersianWeekday(date) {
    // JS 0=Sun=یکشنبه ولی ما شنبه رو اول هفته شمسی می‌گیریم
    let d = date.getDay(); // 0=یکشنبه
    // شیفت روزها برای شمسی: شنبه=0، یکشنبه=1، ...
    d = (d + 1) % 7;
    return persianWeekdays[d];
  }

  // متن بامزه با سن
  function funFact(age) {
    if (age.years < 10) return 'تو یه کوچولو شیرین و بانمک هستی! 🧸';
    if (age.years < 20) return 'جوان و پرانرژی، همه چیز در اختیارت! 🚀';
    if (age.years < 40) return 'اوج قدرت و انرژی، عالییی! 💪';
    if (age.years < 60) return 'تجربه و مهارتت تحسین برانگیزه! 🎓';
    return 'یک افسانه و اسطوره‌ی واقعی! 🦄';
  }

  birthForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let day = Number(birthForm.day.value);
    let month = Number(birthForm.month.value);
    let year = Number(birthForm.year.value);

    if (!isValidPersianDate(year, month, day)) {
      alert('تاریخ وارد شده معتبر نیست! لطفاً بازبینی کنید.');
      return;
    }

    // تبدیل به میلادی برای محاسبات بعدی
    let gDate = toGregorian(year, month, day);
    let birthDate = new Date(gDate.gy, gDate.gm - 1, gDate.gd);

    // محاسبه سن
    let age = calculateAge(birthDate);
    ageSpan.textContent = `${age.years} سال و ${age.months} ماه و ${age.days} روز`;

    // نمایش تاریخ شمسی
    persianDateSpan.textContent = `${day} ${persianMonths[month - 1]} ${year}`;

    // نمایش تاریخ میلادی با فرمت زیبا
    gregorianDateSpan.textContent = `${gDate.gd} / ${gDate.gm} / ${gDate.gy}`;

    // تاریخ تولد بعدی
    let nextBday = nextBirthday(birthDate);
    nextBirthdaySpan.textContent = `${nextBday.getDate()} / ${nextBday.getMonth() + 1} / ${nextBday.getFullYear()}`;

    // روز هفته تولد
    birthWeekdaySpan.textContent = getPersianWeekday(birthDate);

    // توضیح بامزه
    funFactSpan.textContent = funFact(age);

    document.getElementById('result').hidden = false;
  });
})();
