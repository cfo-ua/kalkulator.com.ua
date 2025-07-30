document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("clothing-size-form");
  const result = document.getElementById("clothing-size-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const bust = parseFloat(document.getElementById("bust").value);
    const underbust = parseFloat(document.getElementById("underbust").value);
    const waist = parseFloat(document.getElementById("waist").value);
    const hips = parseFloat(document.getElementById("hips").value);

    if ([bust, underbust, waist, hips].some(val => isNaN(val) || val <= 0)) {
      result.textContent = "Будь ласка, введіть коректні параметри.";
      return;
    }

    if (bust <= underbust) {
      result.textContent = "Обхват грудей має бути більшим за обхват під грудьми.";
      return;
    }

    // Calculate bra size
    const braSize = calculateBraSize(bust, underbust);
    
    // Simplified clothing size chart (women)
    const sizeChart = [
      { int: "XS", eu: "34", ua: "40", us: "2", uk: "6", bust: 80, waist: 62, hips: 86 },
      { int: "S",  eu: "36", ua: "42", us: "4", uk: "8", bust: 84, waist: 66, hips: 90 },
      { int: "M",  eu: "38", ua: "44", us: "6", uk: "10", bust: 88, waist: 70, hips: 94 },
      { int: "L",  eu: "40", ua: "46", us: "8", uk: "12", bust: 92, waist: 74, hips: 98 },
      { int: "XL", eu: "42", ua: "48", us: "10", uk: "14", bust: 96, waist: 78, hips: 102 },
      { int: "XXL", eu: "44", ua: "50", us: "12", uk: "16", bust: 100, waist: 82, hips: 106 },
      { int: "3XL", eu: "46", ua: "52", us: "14", uk: "18", bust: 104, waist: 86, hips: 110 }
    ];

    const clothingMatch = sizeChart.find(size =>
      bust <= size.bust + 4 &&
      waist <= size.waist + 4 &&
      hips <= size.hips + 4
    ) || sizeChart[sizeChart.length - 1];

    if (braSize && clothingMatch) {
      result.innerHTML = `
        <div class="size-results">
          <h3>🩱 Ваш розмір бюстгальтера:</h3>
          <div class="bra-size"><strong>${braSize}</strong></div>
          
          <h3>👗 Ваш розмір одягу:</h3>
          <ul>
            <li>INT: <b>${clothingMatch.int}</b></li>
            <li>EU: <b>${clothingMatch.eu}</b></li>
            <li>UA: <b>${clothingMatch.ua}</b></li>
            <li>US: <b>${clothingMatch.us}</b></li>
            <li>UK: <b>${clothingMatch.uk}</b></li>
          </ul>
          
          <div class="measurements-summary">
            <h4>📏 Ваші виміри:</h4>
            <ul>
              <li>Обхват грудей: ${bust} см</li>
              <li>Обхват під грудьми: ${underbust} см</li>
              <li>Обхват талії: ${waist} см</li>
              <li>Обхват стегон: ${hips} см</li>
            </ul>
          </div>
          
          <div class="tips">
            <h4>💡 Поради:</h4>
            <ul>
              <li>Завжди перевіряйте таблицю розмірів конкретного бренду</li>
              <li>Для бюстгальтерів з push-up розгляньте розмір на півчашки менше</li>
              <li>При купівлі онлайн читайте відгуки про посадку</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      result.textContent = "Не вдалося знайти відповідний розмір. Перевірте введені дані.";
    }
  });

  function calculateBraSize(bust, underbust) {
    // Round underbust to nearest 5
    const bandSize = Math.round(underbust / 5) * 5;
    
    // Calculate cup size
    const difference = bust - underbust;
    let cupSize = '';
    
    if (difference < 10) cupSize = 'AA';
    else if (difference < 12.5) cupSize = 'A';
    else if (difference < 15) cupSize = 'B';
    else if (difference < 17.5) cupSize = 'C';
    else if (difference < 20) cupSize = 'D';
    else if (difference < 22.5) cupSize = 'DD';
    else if (difference < 25) cupSize = 'E';
    else if (difference < 27.5) cupSize = 'F';
    else if (difference < 30) cupSize = 'FF';
    else cupSize = 'G';
    
    return `${bandSize}${cupSize}`;
  }
});
