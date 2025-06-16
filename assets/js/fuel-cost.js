document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fuel-cost-form');
  const inputs = {
    consumption: document.getElementById('consumption'),
    range: document.getElementById('range'),
    price: document.getElementById('pricePerLiter'),
    liters: document.getElementById('liters'),
    totalCost: document.getElementById('totalCost'),
  };
  const resultDiv = document.getElementById('fuel-cost-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultDiv.textContent = '';

    // Parse input values or NaN if empty
    const vals = {};
    for (const key in inputs) {
      vals[key] = parseFloat(inputs[key].value.replace(',', '.'));
    }

    // Count how many inputs are filled and > 0
    const filledKeys = Object.keys(vals).filter(k => !isNaN(vals[k]) && vals[k] > 0);

    if (filledKeys.length < 3) {
      resultDiv.textContent = 'Будь ласка, заповніть будь-які три параметри для розрахунку інших.';
      return;
    }

    let { consumption, range, price, liters, totalCost } = vals;

    // Calculate missing values once, no updating inputs:

    if ((isNaN(liters) || liters === 0) && !isNaN(consumption) && !isNaN(range)) {
      liters = (consumption / 100) * range;
    }

    if ((isNaN(consumption) || consumption === 0) && !isNaN(liters) && !isNaN(range) && range !== 0) {
      consumption = (liters / range) * 100;
    }

    if ((isNaN(range) || range === 0) && !isNaN(liters) && !isNaN(consumption) && consumption !== 0) {
      range = (liters * 100) / consumption;
    }

    if ((isNaN(totalCost) || totalCost === 0) && !isNaN(liters) && !isNaN(price)) {
      totalCost = liters * price;
    }

    if ((isNaN(price) || price === 0) && !isNaN(totalCost) && !isNaN(liters) && liters !== 0) {
      price = totalCost / liters;
    }

    if ((isNaN(liters) || liters === 0) && !isNaN(totalCost) && !isNaN(price) && price !== 0) {
      liters = totalCost / price;
    }

    // Final validation: all values must be > 0 and numbers
    if ([consumption, range, price, liters, totalCost].some(v => isNaN(v) || v <= 0)) {
      resultDiv.textContent = 'Введені дані неконсистентні або недостатні для повного розрахунку.';
      return;
    }

    // Show results (not updating input fields)
    resultDiv.innerHTML = `
      <strong>Результати розрахунку:</strong><br>
      Витрата пального: ${consumption.toFixed(2)} л/100 км<br>
      Пробіг: ${range.toFixed(2)} км<br>
      Ціна за 1 літр: ${price.toFixed(2)}<br>
      Витрачено пального: ${liters.toFixed(2)} л<br>
      Загальна вартість: ${totalCost.toFixed(2)}
    `;
  });
});
