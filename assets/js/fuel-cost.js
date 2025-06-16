document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fuel-cost-form');
  const resultDiv = document.getElementById('fuel-cost-result');

  const inputs = {
    consumption: document.getElementById('consumption'),
    range: document.getElementById('range'),
    price: document.getElementById('pricePerLiter'),
    liters: document.getElementById('liters'),
    totalCost: document.getElementById('totalCost'),
  };

  let lastChangedField = null;

  // Attach event listeners
  Object.entries(inputs).forEach(([key, input]) => {
    input.addEventListener('input', () => {
      lastChangedField = key;
      calculateAndUpdate();
    });
  });

  function parseValue(el) {
    const val = parseFloat(el.value.replace(',', '.'));
    return isNaN(val) || val <= 0 || !isFinite(val) ? null : val;
  }

  function setValue(el, val) {
    if (val === null || isNaN(val) || !isFinite(val)) return;
    el.value = val.toFixed(2);
  }

  function calculateAndUpdate() {
    const raw = {
      consumption: parseValue(inputs.consumption),
      range: parseValue(inputs.range),
      price: parseValue(inputs.price),
      liters: parseValue(inputs.liters),
      totalCost: parseValue(inputs.totalCost),
    };

    const filled = Object.entries(raw).filter(([_, val]) => val !== null);
    if (filled.length < 3) {
      resultDiv.textContent = 'Будь ласка, введіть щонайменше 3 параметри для обчислення інших.';
      return;
    }

    let { consumption, range, price, liters, totalCost } = raw;

    try {
      switch (lastChangedField) {
        case 'consumption':
          if (range && !liters) liters = (consumption / 100) * range;
          else if (liters && !range) range = (liters * 100) / consumption;
          break;

        case 'range':
          if (consumption && !liters) liters = (consumption / 100) * range;
          else if (liters && !consumption) consumption = (liters / range) * 100;
          break;

        case 'liters':
          if (consumption && !range) range = (liters * 100) / consumption;
          else if (range && !consumption) consumption = (liters / range) * 100;
          break;

        case 'price':
          if (liters && !totalCost) totalCost = liters * price;
          else if (totalCost && !liters) liters = totalCost / price;
          break;

        case 'totalCost':
          if (liters && !price) price = totalCost / liters;
          else if (price && !liters) liters = totalCost / price;
          break;
      }

      // Back-fill any remaining possible values
      if (!liters && consumption && range) liters = (consumption / 100) * range;
      if (!consumption && liters && range) consumption = (liters / range) * 100;
      if (!range && liters && consumption) range = (liters * 100) / consumption;
      if (!totalCost && liters && price) totalCost = liters * price;
      if (!price && totalCost && liters) price = totalCost / liters;

      const all = [consumption, range, price, liters, totalCost];
      if (all.some(v => v === null || v <= 0 || !isFinite(v))) {
        resultDiv.textContent = 'Введені дані некоректні або недостатні.';
        return;
      }

      // Update fields with recalculated values
      setValue(inputs.consumption, consumption);
      setValue(inputs.range, range);
      setValue(inputs.price, price);
      setValue(inputs.liters, liters);
      setValue(inputs.totalCost, totalCost);

      // Show result summary
      resultDiv.innerHTML = `
        <strong>Результати розрахунку:</strong><br>
        Витрата пального: ${consumption.toFixed(2)} л/100 км<br>
        Пробіг: ${range.toFixed(2)} км<br>
        Ціна за 1 літр: ${price.toFixed(2)}<br>
        Витрачено пального: ${liters.toFixed(2)} л<br>
        Загальна вартість: ${totalCost.toFixed(2)}
      `;
    } catch (err) {
      resultDiv.textContent = 'Сталася помилка при обробці даних.';
    }
  }
});
