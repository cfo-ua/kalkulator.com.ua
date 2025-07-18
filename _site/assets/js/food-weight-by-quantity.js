window.FOOD_DB = [];
fetch('/assets/data/food-db.json')
  .then(resp => resp.json())
  .then(data => { window.FOOD_DB = data; });

function createWeightRow(idx) {
  return `
    <div class="food-row-card">
      <div class="food-row-grid" data-row="${idx}">
        <div class="food-row-input-wrap">
          <input 
            type="text" 
            class="food-name" 
            id="weight-name-${idx}" 
            name="weight-name-${idx}" 
            placeholder="Назва продукту" 
            autocomplete="off"
          >
        </div>
        <input 
          type="number" 
          class="food-qty" 
          id="weight-qty-${idx}" 
          name="weight-qty-${idx}" 
          min="0" 
          step="1" 
          value="1"
        >
        <span class="food-weight">—</span>
        <button type="button" class="food-remove" aria-label="Видалити"></button>
      </div>
    </div>
  `;
}

function getFoodByName(name) {
  name = name.trim().toLowerCase();
  return window.FOOD_DB.find(f =>
    (f.name && f.name.toLowerCase() === name)
  );
}

function recalcAllWeights() {
  let totalWeight = 0;
  document.querySelectorAll('.food-row-grid').forEach(row => {
    const name = row.querySelector('.food-name').value.trim();
    const qty = parseInt(row.querySelector('.food-qty').value) || 0;
    const weightSpan = row.querySelector('.food-weight');
    let food = getFoodByName(name);
    if (!food || !food.weight_per_piece) {
      weightSpan.textContent = '—';
      return;
    }
    const weight = food.weight_per_piece * qty;
    weightSpan.textContent = `${weight} г`;
    totalWeight += weight;
  });

  document.getElementById('food-weight-result').innerHTML = `
    <div class="result-card">
      <div class="result-main">
        Загальна вага: <span>${totalWeight} г</span>
      </div>
    </div>
  `;
}

function addAutocomplete(row) {
  const wrap = row.querySelector('.food-row-input-wrap');
  const input = wrap.querySelector('.food-name');
  let lastClick = false;

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
      .filter(f => f.name && f.name.toLowerCase().includes(val) && f.weight_per_piece)
      .slice(0, 8);
    if (matches.length > 0) {
      ac.innerHTML = matches.map(f => `<div class="food-ac-item">${f.name}</div>`).join('');
      ac.querySelectorAll('.food-ac-item').forEach(el => {
        el.onmousedown = (e) => {
          e.preventDefault();
          lastClick = true;
          input.value = el.textContent;
          ac.innerHTML = '';
          recalcAllWeights();
        };
      });
    } else {
      ac.innerHTML = '';
    }
  });

  input.addEventListener('blur', function() {
    setTimeout(() => {
      if (!lastClick) {
        const ac = wrap.querySelector('.food-ac');
        if (ac) ac.innerHTML = '';
      }
      lastClick = false;
    }, 150);
  });
}

function addWeightRow() {
  const idx = document.querySelectorAll('.food-row-grid').length;
  const container = document.getElementById('weight-rows');
  const div = document.createElement('div');
  div.innerHTML = createWeightRow(idx);
  container.appendChild(div.firstElementChild);
  const row = container.lastElementChild.querySelector('.food-row-grid');
  addAutocomplete(row);
  row.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', recalcAllWeights);
    el.addEventListener('change', recalcAllWeights);
  });
  row.querySelector('.food-remove').onclick = () => {
    row.closest('.food-row-card').remove();
    recalcAllWeights();
  };
}

function initWeightCalculator() {
  addWeightRow();
  document.getElementById('weight-add-row').onclick = addWeightRow;
}

document.addEventListener('DOMContentLoaded', function () {
  function waitForDB() {
    if (window.FOOD_DB && window.FOOD_DB.length > 0) {
      initWeightCalculator();
    } else {
      setTimeout(waitForDB, 50);
    }
  }
  waitForDB();
});
