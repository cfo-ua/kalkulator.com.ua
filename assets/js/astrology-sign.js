document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("astrology-sign-form");
  const result = document.getElementById("astrology-sign-result");

  const signs = [
    { name: "Козеріг", start: "12-22", end: "01-19" },
    { name: "Водолій", start: "01-20", end: "02-18" },
    { name: "Риби", start: "02-19", end: "03-20" },
    { name: "Овен", start: "03-21", end: "04-19" },
    { name: "Телець", start: "04-20", end: "05-20" },
    { name: "Близнюки", start: "05-21", end: "06-20" },
    { name: "Рак", start: "06-21", end: "07-22" },
    { name: "Лев", start: "07-23", end: "08-22" },
    { name: "Діва", start: "08-23", end: "09-22" },
    { name: "Терези", start: "09-23", end: "10-22" },
    { name: "Скорпіон", start: "10-23", end: "11-21" },
    { name: "Стрілець", start: "11-22", end: "12-21" },
  ];

  function getSign(date) {
    const monthDay = date.toISOString().slice(5, 10); // "MM-DD"

    for (const sign of signs) {
      if (sign.start > sign.end) {
        // знак перетинає рік (Козеріг)
        if (monthDay >= sign.start || monthDay <= sign.end) {
          return sign.name;
        }
      } else {
        if (monthDay >= sign.start && monthDay <= sign.end) {
          return sign.name;
        }
      }
    }
    return null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthDateInput = document.getElementById("birthdate").value;

    if (!birthDateInput) {
      result.textContent = "Будь ласка, введіть дату народження.";
      return;
    }

    const birthDate = new Date(birthDateInput);
    if (isNaN(birthDate)) {
      result.textContent = "Неправильний формат дати.";
      return;
    }

    const sign = getSign(birthDate);
    if (!sign) {
      result.textContent = "Не вдалося визначити знак зодіаку.";
      return;
    }

    result.innerHTML = `<b>Ваш знак зодіаку:</b> ${sign}`;
  });
});
