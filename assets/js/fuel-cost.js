document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fuel-cost-form');
  const resultDiv = document.getElementById('fuel-cost-result');

  const inputs = {
    consumption: document.getElementById('consumption'),   // л/100 км
    range: document.getElementById('range'),               // км
    price: document.getElementById('pricePerLiter'),       // грн/л
    liters: document.getElementById('liters'),             // л
    totalCost: document.getElementById('totalCost'),       // грн
  };

  const parse = (el) => {
    const v = parseFloat(el.value.replace(',', '.'));
    return isNaN(v) || v <= 0 ? null : v;
  };

  const format = (num) => num.toFixed(2).replace('.', ',');

  const updateField = (el, val) => {
    if (val !== null && isFinite(val)) el.value = format(val);
    else el.value = '';
  };

  const getValues = () => {
    const vals = {};
    for (const k in inputs) {
      vals[k] = parse(inputs[k]);
    }
    return vals;
  };

  const setValues = (vals) => {
    for (const k in vals) {
      updateField(inputs[k], vals[k]);
    }
  };

  const clearOutput = () => resultDiv.textContent = '';

  const showResults = (vals) => {
    resultDiv.innerHTML = `
      <strong>Результати розрахунку:</strong><br>
      Витрата пального: ${vals.consumption ? format(vals.consumption) + ' л/100 км' : '—'}<br>
      Пробіг: ${vals.range ? format(vals.range) + ' км' : '—'}<br>
      Ціна за 1 літр: ${vals.price ? format(vals.price) : '—'}<br>
      Витрачено пального: ${vals.liters ? format(vals.liters) + ' л' : '—'}<br>
      Загальна вартість: ${vals.totalCost ? format(vals.totalCost) : '—'}
    `;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearOutput();

    let { consumption, range, price, liters, totalCost } = getValues();
    const initial = { consumption, range, price, liters, totalCost };

    let changed = false;

    // Priority 1: Calculate liters
    if (!liters && consumption && range) {
      liters = (consumption / 100) * range;
      changed = true;
    }

    // Priority 2: Calculate consumption
    if (!consumption && liters && range) {
      consumption = (liters / range) * 100;
      changed = true;
    }

    // Priority 3: Calculate range
    if (!range && liters && consumption) {
      range = (liters * 100) / consumption;
      changed = true;
    }

    // Priority 4: Calculate totalCost
    if (!totalCost && liters && price) {
      totalCost = liters * price;
      changed = true;
    }

    // Priority 5: Calculate price
    if (!price && totalCost && liters) {
      price = totalCost / liters;
      changed = true;
    }

    // Priority 6: Calculate liters (again, but from cost)
    if (!liters && totalCost && price) {
      liters = totalCost / price;
      changed = true;
    }

    const result = { consumption, range, price, liters, totalCost };

    // Clear inconsistent fields
    for (const key in result) {
      if (result[key] === null || !isFinite(result[key])) result[key] = null;
    }

    const hasOutput = Object.values(result).some(v => v !== null);

    if (!hasOutput) {
      resultDiv.textContent = 'Недостатньо або некоректні дані для розрахунку.';
      return;
    }

    setValues(result);
    showResults(result);
  });

  // Clear result if user changes any input
  Object.values(inputs).forEach(el => {
    el.addEventListener('input', clearOutput);
  });
});
