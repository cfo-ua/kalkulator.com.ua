document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fuel-cost-form');
  const resultDiv = document.getElementById('fuel-cost-result');

  const inputs = {
    consumption: document.getElementById('consumption'),   // L/100 km
    range: document.getElementById('range'),               // km
    price: document.getElementById('pricePerLiter'),       // $/L
    liters: document.getElementById('liters'),             // L
    totalCost: document.getElementById('totalCost'),       // $
  };

  const parse = (el) => {
    const v = parseFloat(el.value.replace(',', '.'));
    return isNaN(v) || v <= 0 ? null : v;
  };

  const format = (num) => num.toFixed(2);

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
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
        <strong>Calculation Results:</strong><br>
        <div style="margin-top: 10px; line-height: 1.6;">
          <strong>Fuel consumption:</strong> ${vals.consumption ? format(vals.consumption) + ' L/100 km' : '—'}<br>
          <strong>Distance:</strong> ${vals.range ? format(vals.range) + ' km' : '—'}<br>
          <strong>Price per liter:</strong> ${vals.price ? '$' + format(vals.price) : '—'}<br>
          <strong>Fuel used:</strong> ${vals.liters ? format(vals.liters) + ' L' : '—'}<br>
          <strong>Total cost:</strong> ${vals.totalCost ? '$' + format(vals.totalCost) : '—'}
        </div>
      </div>
    `;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearOutput();

    let { consumption, range, price, liters, totalCost } = getValues();
    const initial = { consumption, range, price, liters, totalCost };

    let changed = false;

    // Priority 1: Calculate liters from consumption and range
    if (!liters && consumption && range) {
      liters = (consumption / 100) * range;
      changed = true;
    }

    // Priority 2: Calculate consumption from liters and range
    if (!consumption && liters && range) {
      consumption = (liters / range) * 100;
      changed = true;
    }

    // Priority 3: Calculate range from liters and consumption
    if (!range && liters && consumption) {
      range = (liters * 100) / consumption;
      changed = true;
    }

    // Priority 4: Calculate total cost from liters and price
    if (!totalCost && liters && price) {
      totalCost = liters * price;
      changed = true;
    }

    // Priority 5: Calculate price from total cost and liters
    if (!price && totalCost && liters) {
      price = totalCost / liters;
      changed = true;
    }

    // Priority 6: Calculate liters from total cost and price
    if (!liters && totalCost && price) {
      liters = totalCost / price;
      changed = true;
      
      // If we now have liters, try to calculate other values
      if (consumption && !range) {
        range = (liters * 100) / consumption;
      } else if (range && !consumption) {
        consumption = (liters / range) * 100;
      }
    }

    const result = { consumption, range, price, liters, totalCost };

    // Clear inconsistent or invalid fields
    for (const key in result) {
      if (result[key] === null || !isFinite(result[key]) || result[key] < 0) {
        result[key] = null;
      }
    }

    const hasOutput = Object.values(result).some(v => v !== null);

    if (!hasOutput) {
      resultDiv.innerHTML = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; color: #856404;">
          <strong>Insufficient or incorrect data for calculation.</strong><br>
          Please enter at least two valid values to perform calculations.
        </div>
      `;
      return;
    }

    // Check for unrealistic values and show warnings
    let warnings = [];
    if (result.consumption && (result.consumption < 1 || result.consumption > 50)) {
      warnings.push("Fuel consumption seems unrealistic (typical range: 4-20 L/100km)");
    }
    if (result.price && (result.price < 0.5 || result.price > 5)) {
      warnings.push("Fuel price seems unusual (typical range: $0.80-$2.50/L)");
    }

    setValues(result);
    showResults(result);

    if (warnings.length > 0) {
      resultDiv.innerHTML += `
        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; border-left: 4px solid #ffc107; color: #856404; margin-top: 10px; font-size: 0.9em;">
          <strong>Note:</strong> ${warnings.join('. ')}.
        </div>
      `;
    }
  });

  // Clear result if user changes any input
  Object.values(inputs).forEach(el => {
    el.addEventListener('input', clearOutput);
  });

  // Add helpful placeholder text updates
  inputs.consumption.addEventListener('focus', () => {
    if (!inputs.consumption.value) {
      inputs.consumption.placeholder = "Enter L/100km (e.g., 8.5)";
    }
  });

  inputs.price.addEventListener('focus', () => {
    if (!inputs.price.value) {
      inputs.price.placeholder = "Enter price per liter (e.g., 1.45)";
    }
  });
});