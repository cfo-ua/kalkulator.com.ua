document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("length-input");
  const from = document.getElementById("length-from");
  const to = document.getElementById("length-to");
  const result = document.getElementById("length-result");

  const conversionRates = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  };

  function convertLength() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка вводу</h6><p>Будь ласка, введіть числове значення.</p></div>';
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInMeters = value * conversionRates[fromUnit];
    const convertedValue = valueInMeters / conversionRates[toUnit];

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;

    // Generate additional useful conversions
    let additionalInfo = '';
    if (toUnit === 'm') {
      if (convertedValue >= 1000) {
        additionalInfo += `<p>🛣️ ${(convertedValue / 1000).toFixed(3)} км</p>`;
      }
      if (convertedValue < 1) {
        additionalInfo += `<p>📐 ${(convertedValue * 100).toFixed(2)} см</p>`;
      }
    }
    
    // Add context based on length
    let context = '';
    let emoji = '📏';
    if (toUnit === 'm') {
      if (convertedValue < 0.01) {
        context = 'Розмір комах або деталей';
        emoji = '🔍';
      } else if (convertedValue < 0.1) {
        context = 'Розмір монет або дрібних предметів';
        emoji = '🪙';
      } else if (convertedValue < 1) {
        context = 'Розмір ручки або телефону';
        emoji = '📱';
      } else if (convertedValue < 3) {
        context = 'Зріст людини';
        emoji = '🧍';
      } else if (convertedValue < 100) {
        context = 'Розмір кімнати або дерева';
        emoji = '🏠';
      } else if (convertedValue < 1000) {
        context = 'Довжина вулиці або спортивного поля';
        emoji = '🏟️';
      } else {
        context = 'Відстань між містами';
        emoji = '🛣️';
      }
    }

    result.innerHTML = `
      <div class="insight-cards" style="margin-top: 1rem;">
        <div class="insight-card success">
          <h6>✅ Результат конвертації</h6>
          <div class="big-number">${convertedValue.toFixed(4)}</div>
          <p><strong>${value} ${fromLabel} = ${convertedValue.toFixed(4)} ${toLabel}</strong></p>
          ${additionalInfo}
        </div>
        ${context ? `<div class="insight-card info"><h6>${emoji} Контекст</h6><p>${context}</p></div>` : ''}
      </div>
    `;
  }

  input.addEventListener("input", convertLength);
  from.addEventListener("change", convertLength);
  to.addEventListener("change", convertLength);
});
