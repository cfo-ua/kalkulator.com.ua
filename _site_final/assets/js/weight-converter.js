document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("weight-input");
  const from = document.getElementById("weight-from");
  const to = document.getElementById("weight-to");
  const result = document.getElementById("weight-result");

  const conversionRates = {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    t: 1000,
    lb: 0.45359237,
    oz: 0.0283495,
  };

  function convertWeight() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка вводу</h6><p>Будь ласка, введіть числове значення.</p></div>';
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInKg = value * conversionRates[fromUnit];
    const convertedValue = valueInKg / conversionRates[toUnit];

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;

    // Generate additional useful conversions
    let additionalInfo = '';
    if (toUnit !== 'kg' && valueInKg !== convertedValue) {
      additionalInfo += `<p>⚖️ ${valueInKg.toFixed(4)} кг</p>`;
    }
    if (toUnit !== 'g' && valueInKg < 10) {
      additionalInfo += `<p>📏 ${(valueInKg * 1000).toFixed(2)} г</p>`;
    }
    if (toUnit !== 'lb' && valueInKg > 0.1) {
      additionalInfo += `<p>🇺🇸 ${(valueInKg / 0.45359237).toFixed(2)} фунтів</p>`;
    }
    
    // Add context based on weight
    let context = '';
    let emoji = '⚖️';
    if (valueInKg < 0.001) {
      context = 'Вага комах або дрібних предметів';
      emoji = '🪲';
    } else if (valueInKg < 0.01) {
      context = 'Вага монет або ювелірних виробів';
      emoji = '🪙';
    } else if (valueInKg < 0.5) {
      context = 'Вага телефону або невеликих предметів';
      emoji = '📱';
    } else if (valueInKg < 5) {
      context = 'Вага продуктів або дрібних тварин';
      emoji = '🐱';
    } else if (valueInKg < 100) {
      context = 'Вага людини або великих тварин';
      emoji = '🧍';
    } else if (valueInKg < 1000) {
      context = 'Вага автомобіля або меблів';
      emoji = '🚗';
    } else {
      context = 'Вага вантажівки або будівельних матеріалів';
      emoji = '🚛';
    }

    result.innerHTML = `
      <div class="insight-cards" style="margin-top: 1rem;">
        <div class="insight-card success">
          <h6>✅ Результат конвертації</h6>
          <div class="big-number">${convertedValue.toFixed(4)}</div>
          <p><strong>${value} ${fromLabel} = ${convertedValue.toFixed(4)} ${toLabel}</strong></p>
          ${additionalInfo}
        </div>
        <div class="insight-card info">
          <h6>${emoji} Контекст</h6>
          <p>${context}</p>
        </div>
      </div>
    `;
  }

  input.addEventListener("input", convertWeight);
  from.addEventListener("change", convertWeight);
  to.addEventListener("change", convertWeight);
});
