document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("time-input");
  const from = document.getElementById("time-from");
  const to = document.getElementById("time-to");
  const result = document.getElementById("time-result");

  const toMilliseconds = {
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000,
    millisecond: 1
  };

  function convertTime() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка вводу</h6><p>Введіть коректне число.</p></div>';
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const inMs = value * toMilliseconds[fromUnit];
    const finalValue = inMs / toMilliseconds[toUnit];

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;

    // Generate additional useful conversions
    let additionalInfo = '';
    const inSeconds = inMs / 1000;
    
    if (toUnit !== 'second' && inSeconds > 1) {
      additionalInfo += `<p>⏱️ ${inSeconds.toFixed(2)} секунд</p>`;
    }
    if (toUnit !== 'minute' && inSeconds >= 60) {
      additionalInfo += `<p>⏰ ${(inSeconds / 60).toFixed(2)} хвилин</p>`;
    }
    if (toUnit !== 'hour' && inSeconds >= 3600) {
      additionalInfo += `<p>🕐 ${(inSeconds / 3600).toFixed(2)} годин</p>`;
    }
    
    // Add context based on time duration
    let context = '';
    let emoji = '⏰';
    if (inSeconds < 1) {
      context = 'Дуже короткий проміжок часу';
      emoji = '⚡';
    } else if (inSeconds < 60) {
      context = 'Короткий інтервал (секунди)';
      emoji = '⏱️';
    } else if (inSeconds < 3600) {
      context = 'Середній інтервал (хвилини)';
      emoji = '⏰';
    } else if (inSeconds < 86400) {
      context = 'Тривалий період (години)';
      emoji = '🕐';
    } else if (inSeconds < 604800) {
      context = 'Кілька днів';
      emoji = '📅';
    } else {
      context = 'Тижні або більше';
      emoji = '🗓️';
    }

    result.innerHTML = `
      <div class="insight-cards" style="margin-top: 1rem;">
        <div class="insight-card success">
          <h6>✅ Результат конвертації</h6>
          <div class="big-number">${finalValue.toFixed(4)}</div>
          <p><strong>${value} ${fromLabel} = ${finalValue.toFixed(4)} ${toLabel}</strong></p>
          ${additionalInfo}
        </div>
        <div class="insight-card info">
          <h6>${emoji} Контекст</h6>
          <p>${context}</p>
        </div>
      </div>
    `;
  }

  input.addEventListener("input", convertTime);
  from.addEventListener("change", convertTime);
  to.addEventListener("change", convertTime);
});
