document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("speed-input");
  const from = document.getElementById("speed-from");
  const to = document.getElementById("speed-to");
  const result = document.getElementById("speed-result");

  const toMps = {
    kmh: 0.277778,
    ms: 1,
    mph: 0.44704,
    knot: 0.514444,
    fts: 0.3048,
  };

  function convertSpeed() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка вводу</h6><p>Введіть коректне число.</p></div>';
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const inMps = value * toMps[fromUnit];
    const finalValue = inMps / toMps[toUnit];

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;

    // Generate additional useful conversions
    let additionalInfo = '';
    if (toUnit === 'kmh') {
      additionalInfo += `<p>🏃 ${(finalValue / 3.6).toFixed(2)} м/с (біг людини)</p>`;
      if (finalValue > 60) {
        additionalInfo += `<p>✈️ ${(finalValue * 0.539957).toFixed(1)} вузлів (авіація)</p>`;
      }
    }
    
    // Add context based on speed
    let context = '';
    let emoji = '🚗';
    if (toUnit === 'kmh') {
      if (finalValue < 5) {
        context = 'Швидкість ходьби людини';
        emoji = '🚶';
      } else if (finalValue < 15) {
        context = 'Швидкість велосипеда';
        emoji = '🚴';
      } else if (finalValue < 50) {
        context = 'Міська швидкість автомобіля';
        emoji = '🚗';
      } else if (finalValue < 120) {
        context = 'Швидкість на автобані';
        emoji = '🏎️';
      } else if (finalValue < 300) {
        context = 'Швидкість потяга';
        emoji = '🚄';
      } else {
        context = 'Швидкість літака';
        emoji = '✈️';
      }
    }

    result.innerHTML = `
      <div class="insight-cards" style="margin-top: 1rem;">
        <div class="insight-card success">
          <h6>✅ Результат конвертації</h6>
          <div class="big-number">${finalValue.toFixed(4)}</div>
          <p><strong>${value} ${fromLabel} = ${finalValue.toFixed(4)} ${toLabel}</strong></p>
          ${additionalInfo}
        </div>
        ${context ? `<div class="insight-card info"><h6>${emoji} Контекст</h6><p>${context}</p></div>` : ''}
      </div>
    `;
  }

  input.addEventListener("input", convertSpeed);
  from.addEventListener("change", convertSpeed);
  to.addEventListener("change", convertSpeed);
});
