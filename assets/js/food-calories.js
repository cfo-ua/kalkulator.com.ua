// Minimal MVP for Food Calories Calculator with dynamic rows and local JSON DB

let FOOD_DB = [];
// Fetch food DB on demand
fetch('/assets/data/food-db.json')
  .then(resp => resp.json())
  .then(data => { FOOD_DB = data; });

function createFoodRow(idx) {
  return `
    <div class="food-row" data-row="${idx}" style="display:flex;gap:0.6em;margin-bottom:0.5em;align-items:center;">
      <input type="text" class="food-name" placeholder="Назва продукту" autocomplete="off" style="flex:2;min-width:120px;">
      <input type="number" class="food-amount" min="0" step="any" value="100" style="width:70px;">
      <select class="food-unit" style="width:78px;">
        <option value="g">г</option>
        <option value="ml">мл</option>
        <option value="pcs">шт</option>
      </select>
      <span class="food-calories" style="width:70px;color:#157aff;">—</span>
      <span class="food-macros" style="width:82px;font-size:0.95em;color:#555;">—</span>
      <button type="button" class="food-remove" aria-label="Видалити" style="font-size:1.2em;background:none;border:none;color:#c00;">✕</button>
    </div>
  `;
}

function renderFoodRows(rows) {
  const container = document.getElementById('food-rows');
  container.innerHTML = rows.map((r, idx) => createFoodRow(idx)).join('');
}

function getFoodByName(name) {
  name = name.trim().toLowerCase();
  return FOOD_DB.find(f => f.name_uk.toLowerCase() === name || f.name_en?.toLowerCase() === name);
}

function recalcAll() {
  let total = {cal:0,p:0,f:0,c:0,amount:0};
  document.querySelectorAll('.food-row').forEach(row => {
    const name = row.querySelector('.food-name').value.trim();
    const amount = parseFloat(row.querySelector('.food-amount').value) || 0;
    const unit = row.querySelector('.food-unit').value;
    const calSpan = row.querySelector('.food-calories');
    const macroSpan = row.querySelector('.food-macros');
    let food = getFoodByName(name);
    if (!food) {
      calSpan.textContent = '—';
      macroSpan.textContent = '—';
      return;
    }
    let mult = 1.0;
    if (unit === 'ml' && food.density) mult = food.density;
    let relAmount = amount * (unit === 'g' ? 1 : (unit === 'ml' ? mult : (food.weight_per_piece || 1)));
    let cal = food.calories * relAmount / 100;
    let p = food.protein * relAmount / 100;
    let f = food.fat * relAmount / 100;
    let c = food.carb * relAmount / 100;
    calSpan.textContent = cal.toFixed(1);
    macroSpan.textContent = `Б:${p.toFixed(1)} Ж:${f.toFixed(1)} В:${c.toFixed(1)}`;
    total.cal += cal;
    total.p += p;
    total.f += f;
    total.c += c;
    total.amount += relAmount;
  });
  // Show result
  document.getElementById('food-calories-result').innerHTML = `
    <b>Сума:</b> <span style="color:#157aff;">${total.cal.toFixed(2)} ккал</span> 
    (Б: ${total.p.toFixed(2)}, Ж: ${total.f.toFixed(2)}, В: ${total.c.toFixed(2)})<br>
    <small>На 100г: ${total.amount > 0 ? (total.cal*100/total.amount).toFixed(1) : '—'} ккал</small>
  `;
}

function addAutocomplete(row) {
  const input = row.querySelector('.food-name');
  input.addEventListener('input', function() {
    const val = this.value.toLowerCase();
    if (val.length < 2) return;
    const matches = FOOD_DB.filter(f => f.name_uk.toLowerCase().includes(val)).slice(0,8);
    let ac = row.querySelector('.food-ac');
    if (!ac) {
      ac = document.createElement('div');
      ac.className = 'food-ac';
      ac.style.position = 'absolute'; ac.style.background = '#fff'; ac.style.zIndex = 50;
      ac.style.border = '1px solid #ddd'; ac.style.width = '99%'; ac.style.fontSize = '0.97em';
      ac.style.maxHeight = '180px'; ac.style.overflowY = 'auto';
      ac.style.left = 0; ac.style.top = '2.3em';
      input.parentNode.appendChild(ac);
    }
    ac.innerHTML = matches.map(f => `<div class="food-ac-item" style="padding:4px 8px;cursor:pointer;">${f.name_uk}</div>`).join('');
    ac.querySelectorAll('.food-ac-item').forEach(el => {
      el.onclick = () => {
        input.value = el.textContent;
        ac.innerHTML = '';
        recalcAll();
      }
    });
    if (matches.length === 0) ac.innerHTML = '';
  });
  input.addEventListener('blur', function() {
    setTimeout(() => {
      const ac = row.querySelector('.food-ac');
      if (ac) ac.innerHTML = '';
    }, 180);
  });
}

function addRow() {
  const idx = document.querySelectorAll('.food-row').length;
  const container = document.getElementById('food-rows');
  const div = document.createElement('div');
  div.innerHTML = createFoodRow(idx);
  container.appendChild(div.firstElementChild);
  const row = container.lastElementChild;
  addAutocomplete(row);
  row.querySelectorAll('input,select').forEach(el => {
    el.addEventListener('input', recalcAll);
    el.addEventListener('change', recalcAll);
  });
  row.querySelector('.food-remove').onclick = () => {
    row.parentNode.removeChild(row);
    recalcAll();
  };
}

document.addEventListener('DOMContentLoaded', function() {
  // Initial row
  addRow();
  document.getElementById('food-add-row').onclick = addRow;
});
