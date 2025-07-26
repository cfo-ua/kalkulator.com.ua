document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("volume-input");
  const from = document.getElementById("volume-from");
  const to = document.getElementById("volume-to");
  const result = document.getElementById("volume-result");

  const conversionRates = {
    l: 1,
    ml: 0.001,
    m3: 1000,
    us_gal: 3.78541,
    uk_gal: 4.54609,
    qt: 0.946353,
    pt: 0.473176,
    oz: 0.0295735,
  };

  function convertVolume() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка вводу</h6><p>Будь ласка, введіть числове значення.</p></div>';
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInLiters = value * conversionRates[fromUnit];
    const convertedValue = valueInLiters / conversionRates[toUnit];

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;

    // Generate additional useful conversions
    let additionalInfo = '';
    if (toUnit !== 'l' && valueInLiters !== convertedValue) {
      additionalInfo += `<p>🥤 ${valueInLiters.toFixed(3)} літрів</p>`;
    }
    if (toUnit !== 'ml' && valueInLiters < 10) {
      additionalInfo += `<p>💧 ${(valueInLiters * 1000).toFixed(1)} мл</p>`;
    }
    
    // Add context based on volume
    let context = '';
    let emoji = '🥤';
    if (valueInLiters < 0.001) {
      context = 'Дуже малий об\'єм (краплі)';
      emoji = '💧';
    } else if (valueInLiters < 0.05) {
      context = 'Ложка або невеликий ковток';
      emoji = '🥄';
    } else if (valueInLiters < 0.5) {
      context = 'Склянка або чашка';
      emoji = '🥤';
    } else if (valueInLiters < 2) {
      context = 'Пляшка води або напою';
      emoji = '🍼';
    } else if (valueInLiters < 20) {
      context = 'Каструля або відро';
      emoji = '🪣';
    } else if (valueInLiters < 200) {
      context = 'Бочка або великий контейнер';
      emoji = '🛢️';
    } else {
      context = 'Резервуар або басейн';
      emoji = '🏊';
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

  input.addEventListener("input", convertVolume);
  from.addEventListener("change", convertVolume);
  to.addEventListener("change", convertVolume);
});
