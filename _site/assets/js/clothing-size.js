document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("clothing-size-form");
  const result = document.getElementById("clothing-size-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const bust = parseFloat(document.getElementById("bust").value);
    const waist = parseFloat(document.getElementById("waist").value);
    const hips = parseFloat(document.getElementById("hips").value);

    if ([bust, waist, hips].some(val => isNaN(val) || val <= 0)) {
      result.textContent = "Будь ласка, введіть коректні параметри.";
      return;
    }

    // Simplified size chart (women)
    const sizeChart = [
      { int: "XS", eu: "34", us: "2", bust: 80, waist: 62, hips: 86 },
      { int: "S",  eu: "36", us: "4", bust: 84, waist: 66, hips: 90 },
      { int: "M",  eu: "38", us: "6", bust: 88, waist: 70, hips: 94 },
      { int: "L",  eu: "40", us: "8", bust: 92, waist: 74, hips: 98 },
      { int: "XL", eu: "42", us: "10", bust: 96, waist: 78, hips: 102 },
      { int: "XXL", eu: "44", us: "12", bust: 100, waist: 82, hips: 106 }
    ];

    const match = sizeChart.find(size =>
      bust <= size.bust &&
      waist <= size.waist &&
      hips <= size.hips
    );

    if (match) {
      result.innerHTML = `
        <b>Ваш рекомендований розмір:</b><br>
        <ul>
          <li>INT: <b>${match.int}</b></li>
          <li>EU: <b>${match.eu}</b></li>
          <li>US: <b>${match.us}</b></li>
        </ul>
      `;
    } else {
      result.textContent = "Не вдалося знайти відповідний розмір. Перевірте введені дані.";
    }
  });
});
