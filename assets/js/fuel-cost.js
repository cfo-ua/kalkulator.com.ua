document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fuel-cost-form');
  const inputs = {
    consumption: document.getElementById('consumption'),   // л/100 км
    range: document.getElementById('range'),               // км
    price: document.getElementById('pricePerLiter'),       // грн/л
    liters: document.getElementById('liters'),             // л
    totalCost: document.getElementById('totalCost'),       // грн
  };
  const resultDiv = document.getElementById('fuel-cost-result');

  const parseVal = el => {
    const val = parseFloat(el.value.replace(',', '.'));
    return isNaN(val) || val <= 0 ? null : val;
  };

  const updateVal = (el, val) => {
    if (val !== null && isFinite(val)) {
      el.value = val.toFixed(2).replace('.', ',');
    }
  };

  const getValues = () => {
    return Object.fromEntries(
      Object.entries(inputs).map(([k, el]) => [k, parseVal(el)])
    );
  };

  const isEnoughData = (vals) => {
    const filledCount = Object.values(vals).filter(v => v !== null).length;

    // Special cases: allow just 2 for simple outputs
    const hasLiters = vals.consumption && vals.range;
    const hasCost   = vals.liters && vals.price;

    return filledCount >= 3 || hasLiters || hasCost;
  };

  const clearOutput = () => {
    resultDiv.textContent = '';
  };

  const calculate = () => {
    const vals = getValues();
    clearOutput();

    if (!isEnoughData(vals)) {
      resultDiv.textContent = 'Будь ласка, заповніть щонайменше 3 параметри (або 2 для розрахунку літрів чи вартості).';
      return;
    }

    let { consumption, range, price, liters, totalCost } = vals;

    // Calculate what can be derived
    if (!liters && consumption && range) {
      liters = (consumption / 100) * range;
    }

    if (!consumption && liters && range) {
      consumption = (liters / range) * 100;
    }

    if (!range && liters && consumption) {
      range = (liters * 100) / consumption;
    }

    if (!totalCost && liters && price) {
      totalCost = liters * price;
    }

    if (!price && totalCost && liters) {
      price = totalCost / liters;
    }

    if (!liters && totalCost && price) {
      liters = totalCost / price;
    }

    const final = { consumption, range, price, liters, totalCost };

    // Only show results if all values are valid
    if (Object.values(final).some(v => v === null || !isFinite(v))) {
      resultDiv.textContent = 'Недостатньо або некоректні дані для повного розрахунку.';
      return;
    }

    // Update inputs
    Object.entries(final).forEach(([k, v]) => updateVal(inputs[k], v));

    // Show result
    resultDiv.innerHTML = `
      <strong>Результати розрахунку:</strong><br>
      Витрата пального: ${final.consumption.toFixed(2)} л/100 км<br>
      Пробіг: ${final.range.toFixed(2)} км<br>
      Ціна за 1 літр: ${final.price.toFixed(2)}<br>
      Витрачено пального: ${final.liters.toFixed(2)} л<br>
      Загальна вартість: ${final.totalCost.toFixed(2)}
    `;
  };

  // Clear output when any field is changed
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', clearOutput);
  });

  // Main form submit logic
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculate();
  });
});
