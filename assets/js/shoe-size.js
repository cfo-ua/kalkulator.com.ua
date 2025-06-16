document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shoe-size-form');
  const unitSelect = document.getElementById('unit');
  const valueInput = document.getElementById('value');
  const resultDiv = document.getElementById('shoe-size-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultDiv.textContent = '';

    const unit = unitSelect.value;
    const val = parseFloat(valueInput.value.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      resultDiv.textContent = 'Будь ласка, введіть коректне значення.';
      return;
    }

    let mondo, eu, uk, us_m, us_w;

    if (unit === 'mondopoint') {
      mondo = val;
    } else if (unit === 'eu') {
      eu = val;
      mondo = eu * 6.67 - 10;
    } else if (unit === 'uk') {
      mondo = 25.5 + 8.467 * val;
    } else if (unit === 'us_m') {
      mondo = 24 + 8.467 * val;
    } else if (unit === 'us_w') {
      mondo = 22.5 + 8.467 * val;
    }

    if (unit !== 'eu' && typeof mondo === 'number') {
      eu = (mondo + 10) / 6.67;
    }

    uk = (mondo - 25.5) / 8.467;
    us_m = (mondo - 24) / 8.467;
    us_w = (mondo - 22.5) / 8.467;

    resultDiv.innerHTML = `
      <strong>Результати:</strong><br>
      Mondopoint (мм): ${mondo.toFixed(0)}<br>
      EU: ${eu.toFixed(1)}<br>
      UK: ${uk.toFixed(1)}<br>
      US (чоловіки): ${us_m.toFixed(1)}<br>
      US (жінки): ${us_w.toFixed(1)}
    `;
  });
});
