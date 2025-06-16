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

  // Run dynamic calculation on any input change
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', calculateAndShow);
  });

  // Prevent form submission from reloading the page
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAndShow();
  });

  function parseInput(input) {
    const val = parseFloat(input.value.replace(',', '.'));
    return isNaN(val) || val <= 0 || !isFinite(val) ? null : val;
  }

  function formatNum(num, decimals = 2) {
    return num.toLocaleString('uk-UA', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function calculateAndShow() {
    const raw = {
      consumption: parseInput(inputs.consumption),
      range: parseInput(inputs.range),
      price: parseInput(inputs.price),
      liters: parseInput(inputs.liters),
      totalCost: parseInput(inputs.totalCost),
    };

    // If fewer than 3 values are valid, don't calculate
    const filledCount = Object.values(raw).filter(v => v !== null).length;
    if (filledCount < 3) {
      resultDiv.textContent = 'Будь ласка, заповніть будь-які три параметри для розрахунку.';
      return;
    }

    let { consumption, range, price, liters, totalCost } = raw;

    // Step 1: derive liters
    if (!liters && consumption && range) {
      liters = (consumption / 100) * range;
    }

    // Step 2: derive consumption
    if (!consumption && liters && range) {
      consumption = (liters / range) * 100;
    }

    // Step 3: derive range
    if (!range && consumption && liters) {
      range = (liters * 100) / consumption;
    }

    // Step 4: derive total cost
    if (!totalCost && liters && price) {
      totalCost = liters * price;
    }

    // Step 5: derive price/liter
    if (!price && totalCost && liters) {
      price = totalCost / liters;
    }

    // Final validation
    const all = [consumption, range, price, liters, totalCost];
    if (all.some(v => v === null || v <= 0 || !isFinite(v))) {
      resultDiv.textContent = 'Некоректні або недостатні дані для розрахунку.';
      return;
    }

    // Prevent ridiculously large output
    if (range > 1e6 || totalCost > 1e6 || liters > 1e5) {
      resultDiv.textContent = 'Значення занадто великі для реалістичного розрахунку.';
      return;
    }

    // Show results
    resultDiv.innerHTML = `
      <strong>Результати розрахунку:</strong><br>
      Витрата пального: ${formatNum(consumption)} л/100 км<br>
      Пробіг: ${formatNum(range)} км<br>
      Ціна за 1 літр: ${formatNum(price)}<br>
      Витрачено пального: ${formatNum(liters)} л<br>
      Загальна вартість: ${formatNum(totalCost)}
    `;
  }
});
