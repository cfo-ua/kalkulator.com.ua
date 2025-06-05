// Food Calories Calculator — Pixel-perfect, fully tested, adaptive for desktop & mobile

let FOOD_DB = [];
fetch('/assets/data/food-db.json')
  .then(resp => resp.json())
  .then(data => { FOOD_DB = data; });

function createFoodRow(idx) {
  return `
    <div class="food-row-card">
      <div class="food-row-grid" data-row="${idx}">
        <input type="text" class="food-name" placeholder="Назва продукту" autocomplete="off">
        <input type="number" class="food-amount" min="0" step="any" value="100">
        <select class="food-unit">
          <option value="g">г</option>
          <option value="ml">мл</option>
          <option value="pcs">шт</option>
        </select>
        <div class="food-metrics">
          <span class="food-calories">—</span>
          <span class="food-macros">—</span>
        </div>
        <button type="button" class="food-remove" aria-label="Видалити">✕</button>
      </div>
    </div>
  `;
}

function getFoodByName(name) {
  name = name.trim().toLowerCase();
  return FOOD_DB.find(f => f.name_uk.toLowerCase() === name || f.name_en?.toLowerCase() === name);
}

function recalcAll() {
  let total = {cal:0,p:0,f:0,c:0,amount:0};
  document.querySelectorAll('.food-row-grid').forEach(row => {
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
    calSpan.textContent = cal.toFixed(2);
    macroSpan.innerHTML = `<span style="color:#157aff;">Б:</span>${p.toFixed(2)} <span style="color:#157aff;">Ж:</span>${f.toFixed(2)} <span style="color:#157aff;">В:</span>${c.toFixed(2)}`;
    total.cal += cal;
    total.p += p;
    total.f += f;
    total.c += c;
    total.amount += relAmount;
  });

  document.getElementById('food-calories-result').innerHTML = `
    <div class="result-card">
      <div class="result-main">
        Загальна калорійність: <span>${total.cal.toFixed(2)} ккал</span>
      </div>
      <div class="result-macros">
        <b>Білки:</b> ${total.p.toFixed(2)} г &nbsp; 
        <b>Жири:</b> ${total.f.toFixed(2)} г &nbsp; 
        <b>Вуглеводи:</b> ${total.c.toFixed(2)} г
      </div>
      <div class="result-100g">
        Калорійність на 100 г: <b>${total.amount > 0 ? (total.cal*100/total.amount).toFixed(1) : '—'} ккал</b>
      </div>
    </div>
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
