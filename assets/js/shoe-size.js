document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shoe-size-form');
  const unitSelect = document.getElementById('unit');
  const valueInput = document.getElementById('value');
  const resultDiv = document.getElementById('shoe-size-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedUnit = unitSelect.value;
    const val = parseFloat(valueInput.value.replace(',', '.'));

    if (isNaN(val) || val <= 0) {
      resultDiv.textContent = 'Будь ласка, введіть коректне значення.';
      return;
    }

    let mondopoint, eu, uk, us_m, us_w;

    if (selectedUnit === 'eu') {
      eu = val;
      mondopoint = eu * 6.67 - 10;
    } else if (selectedUnit === 'mondopoint') {
      mondopoint = val;
    } else if (selectedUnit === 'uk') {
      mondopoint = 25.5 + 8.467 * val;
    } else if (selectedUnit === 'us_m') {
      mondopoint = 24 + 8.467 * val;
    } else if (selectedUnit === 'us_w') {
      mondopoint = 22.5 + 8.467 * val;
    }

    if (selectedUnit !== 'eu') {
      eu = (mondopoint + 10) / 6.67;
    }

    uk = (mondopoint - 25.5) / 8.467;
    us_m = (mondopoint - 24) / 8.467;
    us_w = (mondopoint - 22.5) / 8.467;

    resultDiv.innerHTML = `
      <strong>Результати:</strong><br>
      Довжина стопи (Mondopoint): ${mondopoint.toFixed(0)} мм<br>
      Розмір EU: ${selectedUnit === 'eu' ? val : eu.toFixed(1)}<br>
      UK: ${uk.toFixed(1)}<br>
      US (чоловічий): ${us_m.toFixed(1)}<br>
      US (жіночий): ${us_w.toFixed(1)}
    `;
  });
});
