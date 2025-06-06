// Food Calories Calculator — Apple-style, Calories, Proteins, Fats, Carbs, Clean Version (2025-06-06, direct "carb" support, responsive macros row)

// Attach FOOD_DB to window for global/debug/autocomplete access
window.FOOD_DB = [];
fetch('/assets/data/food-db.json')
  .then(resp => resp.json())
  .then(data => { window.FOOD_DB = data; });

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
  return window.FOOD_DB.find(f =>
    (f.name_uk && f.name_uk.toLowerCase() === name) ||
    (f.name_en && f.name_en.toLowerCase() === name)
  );
}

function recalcAll() {
  let total = {cal:0, protein:0, fat:0, carb:0, amount:0};
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
    let cal = (food.calories || 0) * relAmount / 100;
    let protein = (food.protein || 0) * relAmount / 100;
    let fat = (food.fat || 0) * relAmount / 100;
    let carb = (food.carb || 0) * relAmount / 100;
    calSpan.textContent = Math.round(cal);
    total.cal += cal;
    total.protein += protein;
    total.fat += fat;
    total.carb += carb;
    total.amount += relAmount;
  });

  // Responsive macros row: row on desktop, column on mobile
  const macrosRow = `
    <div class="result-macros-row" style="
      display: flex;
      gap: 2em;
      justify-content: flex-start;
      margin-bottom: 0.4em;
      flex-wrap: wrap;
    ">
      <div class="macro-item" style="color:#1b7e1b;min-width:120px;"><b>Білки:</b> ${total.protein ? total.protein.toFixed(1) : '—'} г</div>
      <div class="macro-item" style="color:#b88d00;min-width:120px;"><b>Жири:</b> ${total.fat ? total.fat.toFixed(1) : '—'} г</div>
      <div class="macro-item" style="color:#991c1c;min-width:120px;"><b>Вуглеводи:</b> ${total.carb ? total.carb.toFixed(1) : '—'} г</div>
    </div>
    <style>
      @media (max-width: 600px) {
        .result-macros-row {
          flex-direction: column !important;
          gap: 0.3em !important;
        }
        .result-macros-row .macro-item {
          min-width: 0 !important;
          margin-bottom: 0.3em;
          font-size: 1.07em;
        }
      }
    </style>
  `;

  document.getElementById('food-calories-result').innerHTML = `
    <div class="result-card">
      <div class="result-main" style="margin-bottom:0.6em;">
        Загальна калорійність: <span>${Math.round(total.cal)} ккал</span>
      </div>
      ${macrosRow}
    </div>
  `;
}

// --- FIXED AUTOCOMPLETE: Robust against blur/select race, no premature dropdown close ---
function addAutocomplete(row) {
  const wrap = row.querySelector('.food-row-input-wrap');
  const input = wrap.querySelector('.food-name');
  let lastAcClick = false;

  input.addEventListener('input', function() {
    const val = this.value.toLowerCase();
    let ac = wrap.querySelector('.food-ac');
    if (!ac) {
      ac = document.createElement('div');
      ac.className = 'food-ac';
      wrap.appendChild(ac);
    }
    if (val.length < 2) {
      ac.innerHTML = '';
      return;
    }
    const matches = window.FOOD_DB
      .filter(f => f.name_uk && f.name_uk.toLowerCase().includes(val))
      .slice(0,8);
    if (matches.length > 0) {
      ac.innerHTML = matches.map(f => `<div class="food-ac-item">${f.name_uk}</div>`).join('');
      ac.querySelectorAll('.food-ac-item').forEach(el => {
        // Use onmousedown (fires before blur) for robust UX
        el.onmousedown = (e) => {
          e.preventDefault();
          lastAcClick = true;
          input.value = el.textContent;
          ac.innerHTML = '';
          recalcAll();
        };
      });
    } else {
      ac.innerHTML = '';
    }
  });

  input.addEventListener('blur', function() {
    setTimeout(() => {
      if (!lastAcClick) {
        const ac = wrap.querySelector('.food-ac');
        if (ac) ac.innerHTML = '';
      }
      lastAcClick = false;
    }, 150);
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

// Wait until DB is loaded before allowing row add
function initFoodCalculator() {
  addRow();
  document.getElementById('food-add-row').onclick = addRow;
}

if (window.FOOD_DB && window.FOOD_DB.length > 0) {
  // If DB is already present for any reason (edge case)
  document.addEventListener('DOMContentLoaded', initFoodCalculator);
} else {
  // Wait for DB to load before initializing UI
  document.addEventListener('DOMContentLoaded', function() {
    // Poll until DB is loaded (quick and reliable for static sites)
    function waitForDB() {
      if (window.FOOD_DB && window.FOOD_DB.length > 0) {
        initFoodCalculator();
      } else {
        setTimeout(waitForDB, 50);
      }
    }
    waitForDB();
  });
}
