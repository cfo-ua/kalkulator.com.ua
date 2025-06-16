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

  let lastChangedField = null;

  Object.entries(inputs).forEach(([key, el]) => {
    el.addEventListener('input', () => {
      lastChangedField = key;
      recalculate();
    });
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    recalculate();
  });

  function parse(val) {
    val = parseFloat(val?.replace(',', '.'));
    return isNaN(val) || val <= 0 ? null : val;
  }

  function write(el, val) {
    if (val !== null && isFinite(val)) {
      el.value = val.toFixed(2).replace('.', ',');
    } else {
      el.value = '';
    }
  }

  function recalculate() {
    const values = {
      consumption: parse(inputs.consumption.value),
      range: parse(inputs.range.value),
      price: parse(inputs.price.value),
      liters: parse(inputs.liters.value),
      totalCost: parse(inputs.totalCost.value),
    };

    const original = { ...values };

    const needed = (fields) => fields.every(f => values[f] !== null);
    const clearAll = (except = []) => {
      for (const key of Object.keys(inputs)) {
        if (!except.includes(key)) {
          inputs[key].value = '';
        }
      }
    };

    let c = values.consumption;
    let r = values.range;
    let p = values.price;
    let l = values.liters;
    let t = values.totalCost;

    let valid = true;
    let message = '';

    // Recalculation logic based on lastChangedField
    switch (lastChangedField) {
      case 'consumption':
        if (needed(['range'])) {
          l = c * r / 100;
        } else {
          valid = false;
          message = 'Вкажіть пробіг для обчислення витрати пального.';
        }
        break;

      case 'range':
        if (needed(['consumption'])) {
          l = c * r / 100;
        } else {
          valid = false;
          message = 'Вкажіть витрату пального для обчислення.';
        }
        break;

      case 'liters':
        if (needed(['range'])) {
          c = (l / r) * 100;
        } else if (needed(['consumption'])) {
          r = (l * 100) / c;
        } else {
          valid = false;
          message = 'Вкажіть пробіг або витрату пального.';
        }
        break;

      case 'price':
        if (needed(['liters'])) {
          t = l * p;
        } else if (needed(['totalCost'])) {
          l = t / p;
        } else {
          valid = false;
          message = 'Вкажіть кількість пального або загальну вартість.';
        }
        break;

      case 'totalCost':
        if (needed(['price'])) {
          l = t / p;
        } else {
          valid = false;
          message = 'Вкажіть ціну за літр.';
        }
        break;
    }

    // Now try to complete the rest
    if (valid) {
      if (!c && l !== null && r !== null) c = (l / r) * 100;
      if (!r && l !== null && c !== null) r = (l * 100) / c;
      if (!l && c !== null && r !== null) l = (c / 100) * r;
      if (!t && l !== null && p !== null) t = l * p;
      if (!p && l !== null && t !== null) p = t / l;
    }

    const resultValues = { consumption: c, range: r, price: p, liters: l, totalCost: t };

    // Validation: if any is null → display message + blank fields
    if (!valid || Object.values(resultValues).some(v => v === null || !isFinite(v))) {
      resultDiv.textContent = message || 'Недостатньо даних для розрахунку. Введіть щонайменше три значення.';
      clearAll([lastChangedField]);
      return;
    }

    // Write back all fields
    for (const key in resultValues) {
      write(inputs[key], resultValues[key]);
    }

    resultDiv.innerHTML = `
      <strong>Результати розрахунку:</strong><br>
      Витрата пального: ${c.toFixed(2)} л/100 км<br>
      Пробіг: ${r.toFixed(2)} км<br>
      Ціна за 1 літр: ${p.toFixed(2)}<br>
      Витрачено пального: ${l.toFixed(2)} л<br>
      Загальна вартість: ${t.toFixed(2)}
    `;
  }
});
