document.addEventListener('DOMContentLoaded', () => {
  const inputs = {
    consumption: document.getElementById('consumption'),   // л/100 км
    range: document.getElementById('range'),               // км
    price: document.getElementById('pricePerLiter'),       // грн/л
    liters: document.getElementById('liters'),             // л
    totalCost: document.getElementById('totalCost'),       // грн
  };

  const resultDiv = document.getElementById('fuel-cost-result');
  let lastChanged = null;

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

  const recalculate = () => {
    const v = getValues();
    const known = Object.entries(v).filter(([_, val]) => val !== null);

    if (known.length < 3) {
      resultDiv.textContent = '';
      return;
    }

    let { consumption, range, price, liters, totalCost } = v;

    // Try to calculate missing fields
    // Priority: liters → totalCost → consumption → range → price

    if (!liters && consumption && range) {
      liters = (consumption / 100) * range;
    } else if (!consumption && liters && range) {
      consumption = (liters / range) * 100;
    } else if (!range && liters && consumption) {
      range = (liters * 100) / consumption;
    }

    if (!totalCost && liters && price) {
      totalCost = liters * price;
    } else if (!price && totalCost && liters) {
      price = totalCost / liters;
    } else if (!liters && totalCost && price) {
      liters = totalCost / price;
    }

    const calculated = { consumption, range, price, liters, totalCost };

    // If any still null → reset
    if (Object.values(calculated).some(v => v === null || !isFinite(v))) {
      resultDiv.textContent = '';
      return;
    }

    // Update all inputs with recalculated values
    for (const [k, val] of Object.entries(calculated)) {
      updateVal(inputs[k], val);
    }

    // Show result
    resultDiv.innerHTML = `
      <strong>Результати розрахунку:</strong><br>
      Витрата пального: ${consumption.toFixed(2)} л/100 км<br>
      Пробіг: ${range.toFixed(2)} км<br>
      Ціна за 1 літр: ${price.toFixed(2)}<br>
      Витрачено пального: ${liters.toFixed(2)} л<br>
      Загальна вартість: ${totalCost.toFixed(2)}
    `;
  };

  // Trigger recalc on any input
  Object.entries(inputs).forEach(([key, el]) => {
    el.addEventListener('input', () => {
      lastChanged = key;
      recalculate();
    });
  });
});
