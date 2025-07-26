document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("temp-input");
  const from = document.getElementById("temp-from");
  const to = document.getElementById("temp-to");
  const result = document.getElementById("temp-result");

  function convertTemperature() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка вводу</h6><p>Будь ласка, введіть числове значення.</p></div>';
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;
    let celsius;

    // Конвертуємо спочатку до °C
    switch (fromUnit) {
      case "C":
        celsius = value;
        break;
      case "F":
        celsius = (value - 32) * 5 / 9;
        break;
      case "K":
        celsius = value - 273.15;
        break;
    }

    let converted;
    switch (toUnit) {
      case "C":
        converted = celsius;
        break;
      case "F":
        converted = (celsius * 9 / 5) + 32;
        break;
      case "K":
        converted = celsius + 273.15;
        break;
    }

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;

    // Generate additional conversions
    let additionalInfo = '';
    if (toUnit !== 'C') {
      additionalInfo += `<p>🌡️ ${celsius.toFixed(2)} °C</p>`;
    }
    if (toUnit !== 'F') {
      const fahrenheit = (celsius * 9 / 5) + 32;
      additionalInfo += `<p>🇺🇸 ${fahrenheit.toFixed(2)} °F</p>`;
    }
    if (toUnit !== 'K') {
      const kelvin = celsius + 273.15;
      additionalInfo += `<p>🔬 ${kelvin.toFixed(2)} K</p>`;
    }
    
    // Add context based on temperature
    let context = '';
    let emoji = '🌡️';
    if (celsius < -40) {
      context = 'Екстремальний холод (Антарктика)';
      emoji = '🥶';
    } else if (celsius < 0) {
      context = 'Температура заморозки';
      emoji = '❄️';
    } else if (celsius < 15) {
      context = 'Прохолодна погода';
      emoji = '🧥';
    } else if (celsius < 25) {
      context = 'Комфортна кімнатна температура';
      emoji = '🏠';
    } else if (celsius < 35) {
      context = 'Тепла літня погода';
      emoji = '☀️';
    } else if (celsius < 50) {
      context = 'Спекотна погода';
      emoji = '🔥';
    } else {
      context = 'Екстремальна спека';
      emoji = '🌋';
    }

    result.innerHTML = `
      <div class="insight-cards" style="margin-top: 1rem;">
        <div class="insight-card success">
          <h6>✅ Результат конвертації</h6>
          <div class="big-number">${converted.toFixed(2)}</div>
          <p><strong>${value} ${fromLabel} = ${converted.toFixed(2)} ${toLabel}</strong></p>
          ${additionalInfo}
        </div>
        <div class="insight-card info">
          <h6>${emoji} Контекст</h6>
          <p>${context}</p>
        </div>
      </div>
    `;
  }

  input.addEventListener("input", convertTemperature);
  from.addEventListener("change", convertTemperature);
  to.addEventListener("change", convertTemperature);
});
