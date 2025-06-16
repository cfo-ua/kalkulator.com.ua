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

    // Calculation formulas
    // Known formulas:
    // liters = (consumption / 100) * range
    // totalCost = liters * price

    let { consumption, range, price, liters, totalCost } = vals;

    // Try to solve for missing parameters stepwise:

    // If liters missing and consumption & range known:
    if ((isNaN(liters) || liters === 0) && !isNaN(consumption) && !isNaN(range)) {
      liters = (consumption / 100) * range;
      inputs.liters.value = liters.toFixed(2);
    }

    // If consumption missing and liters & range known:
    if ((isNaN(consumption) || consumption === 0) && !isNaN(liters) && !isNaN(range) && range !== 0) {
      consumption = (liters / range) * 100;
      inputs.consumption.value = consumption.toFixed(2);
    }

    // If range missing and liters & consumption known:
    if ((isNaN(range) || range === 0) && !isNaN(liters) && !isNaN(consumption) && consumption !== 0) {
      range = (liters * 100) / consumption;
      inputs.range.value = range.toFixed(2);
    }

    // If totalCost missing and liters & price known:
    if ((isNaN(totalCost) || totalCost === 0) && !isNaN(liters) && !isNaN(price)) {
      totalCost = liters * price;
      inputs.totalCost.value = totalCost.toFixed(2);
    }

    // If price missing and totalCost & liters known:
    if ((isNaN(price) || price === 0) && !isNaN(totalCost) && !isNaN(liters) && liters !== 0) {
      price = totalCost / liters;
      inputs.price.value = price.toFixed(2);
    }

    // If liters missing and totalCost & price known:
    if ((isNaN(liters) || liters === 0) && !isNaN(totalCost) && !isNaN(price) && price !== 0) {
      liters = totalCost / price;
      inputs.liters.value = liters.toFixed(2);
    }

    // Final check to ensure all filled
    if ([consumption, range, price, liters, totalCost].some(v => isNaN(v) || v <= 0)) {
      resultDiv.textContent = 'Введені дані неконсистентні або недостатні для повного розрахунку.';
      return;
    }

    // Show results
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
