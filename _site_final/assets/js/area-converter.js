document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("area-input");
  const from = document.getElementById("area-from");
  const to = document.getElementById("area-to");
  const result = document.getElementById("area-result");

  const conversionRates = {
    m2: 1,
    cm2: 0.0001,
    ha: 10000,
    a: 100,
    ft2: 0.092903,
    in2: 0.00064516,
    ac: 4046.86,
  };

  function convertArea() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка вводу</h6><p>Будь ласка, введіть числове значення.</p></div>';
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInM2 = value * conversionRates[fromUnit];
    const convertedValue = valueInM2 / conversionRates[toUnit];

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;

    // Generate additional useful conversions
    let additionalInfo = '';
    if (toUnit === 'm2') {
      if (convertedValue >= 10000) {
        additionalInfo += `<p>📐 ${(convertedValue / 10000).toFixed(4)} га</p>`;
      }
      if (convertedValue >= 100) {
        additionalInfo += `<p>🏡 ${(convertedValue / 100).toFixed(2)} ар (соток)</p>`;
      }
    }
    
    // Add context based on size
    let context = '';
    if (toUnit === 'm2') {
      if (convertedValue < 1) {
        context = '🔍 Дуже невелика площа (менше 1 м²)';
      } else if (convertedValue < 100) {
        context = '🏠 Розмір кімнати або невеликої ділянки';
      } else if (convertedValue < 1000) {
        context = '🏡 Розмір великої квартири або дому';
      } else if (convertedValue < 10000) {
        context = '🌳 Розмір великої ділянки';
      } else {
        context = '🌾 Площа для сільського господарства';
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
        ${context ? `<div class="insight-card info"><h6>💡 Контекст</h6><p>${context}</p></div>` : ''}
      </div>
    `;
  }

  input.addEventListener("input", convertArea);
  from.addEventListener("change", convertArea);
  to.addEventListener("change", convertArea);
});
