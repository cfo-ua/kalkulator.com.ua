// Food Calories Calculator — Apple-style, Only Calories, Clean Version (Fixed Autocomplete)

let FOOD_DB = [];
fetch('/assets/data/food-db.json')
  .then(resp => resp.json())
  .then(data => { FOOD_DB = data; });

function createFoodRow(idx) {
  return `
    <div class="food-row-card">
      <div class="food-row-grid" data-row="${idx}">
        <div class="food-row-input-wrap">
          <input 
            type="text" 
            class="food-name" 
            id="food-name-${idx}" 
            name="food-name-${idx}" 
            placeholder="Назва продукту" 
            autocomplete="off"
          >
        </div>
        <input 
          type="number" 
          class="food-amount" 
          id="food-amount-${idx}" 
          name="food-amount-${idx}" 
          min="0" 
          step="any" 
          value="100"
        >
        <select 
          class="food-unit" 
          id="food-unit-${idx}" 
          name="food-unit-${idx}"
        >
          <option value="g">г</option>
          <option value="ml">мл</option>
          <option value="pcs">шт</option>
        </select>
        <span class="food-calories">—</span>
        <button type="button" class="food-remove" aria-label="Видалити"></button>
      </div>
    </div>
  `;
}

function getFoodByName(name) {
  name = name.trim().toLowerCase();
  return FOOD_DB.find(f =>
    (f.name_uk && f.name_uk.toLowerCase() === name) ||
    (f.name_en && f.name_en.toLowerCase() === name)
  );
}

function recalcAll() {
  let total = {cal:0, amount:0};
  document.querySelectorAll('.food-row-grid').forEach(row => {
    const name = row.querySelector('.food-name').value.trim();
    const amount = parseFloat(row.querySelector('.food-amount').value) || 0;
    const unit = row.querySelector('.food-unit').value;
    const calSpan = row.querySelector('.food-calories');
    let food = getFoodByName(name);
    if (!food) {
      calSpan.textContent = '—';
      return;
    }
    let mult = 1.0;
    if (unit === 'ml' && food.density) mult = food.density;
    let relAmount = amount * (unit === 'g' ? 1 : (unit === 'ml' ? mult : (food.weight_per_piece || 1)));
    let cal = food.calories * relAmount / 100;
    calSpan.textContent = Math.round(cal);
    total.cal += cal;
    total.amount += relAmount;
  });

  document.getElementById('food-calories-result').innerHTML = `
    <div class="result-card">
      <div class="result-main">
        Загальна калорійність: <span>${Math.round(total.cal)} ккал</span>
      </div>
      <div class="result-100g">
        Калорійність на 100 г: <b>${total.amount > 0 ? Math.round(total.cal*100/total.amount) : '—'} ккал</b>
      </div>
    </div>
  `;
}

function addAutocomplete(row) {
  const wrap = row.querySelector('.food-row-input-wrap');
  const input = wrap.querySelector('.food-name');
  input.addEventListener('input', function() {
    const val = this.value.toLowerCase();
    let ac = wrap.querySelector('.food-ac');
    if (val.length < 2) {
      if (ac) ac.innerHTML = '';
      return;
    }
    const matches = FOOD_DB
      .filter(f => f.name_uk && f.name_uk.toLowerCase().includes(val))
      .slice(0,8);
    if (!ac) {
      ac = document.createElement('div');
      ac.className = 'food-ac';
      wrap.appendChild(ac);
    }
    ac.innerHTML = matches.map(f => `<div class="food-ac-item">${f.name_uk}</div>`).join('');
    ac.querySelectorAll('.food-ac-item').forEach(el => {
      el.onclick = () => {
        input.value = el.textContent;
        ac.innerHTML = '';
        recalcAll();
      };
    });
    if (matches.length === 0) ac.innerHTML = '';
  });
  input.addEventListener('blur', function() {
    setTimeout(() => {
      const ac = wrap.querySelector('.food-ac');
      if (ac) ac.innerHTML = '';
    }, 180);
  });
}

function addRow() {
  const idx = document.querySelectorAll('.food-row-grid').length;
  const container = document.getElementById('food-rows');
  const div = document.createElement('div');
  div.innerHTML = createFoodRow(idx);
  container.appendChild(div.firstElementChild);
  const row = container.lastElementChild.querySelector('.food-row-grid');
  addAutocomplete(row);
  row.querySelectorAll('input,select').forEach(el => {
    el.addEventListener('input', recalcAll);
    el.addEventListener('change', recalcAll);
  });
  row.querySelector('.food-remove').onclick = () => {
    row.closest('.food-row-card').remove();
    recalcAll();
  };
}

document.addEventListener('DOMContentLoaded', function() {
  addRow();
  document.getElementById('food-add-row').onclick = addRow;
});
