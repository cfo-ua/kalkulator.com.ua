// Food Weight by Quantity Calculator — English Version with US/UK Food Database
// Enhanced UX with better autocomplete, validation, and comprehensive weight calculations

window.FOOD_DB = [];
fetch('/assets/data/food-db.json')
  .then(resp => resp.json())
  .then(data => { 
    window.FOOD_DB = data;
    initializeAutocomplete();
  })
  .catch(err => {
    console.error('Failed to load food database:', err);
    window.FOOD_DB = [];
  });

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
            placeholder="Введіть назву продукту (напр., яблуко, банан)" 
            autocomplete="off"
          >
          <div class="autocomplete-suggestions" id="weight-suggestions-${idx}"></div>
        </div>
        <input 
          type="number" 
          class="food-qty" 
          id="weight-qty-${idx}" 
          name="weight-qty-${idx}" 
          min="1" 
          step="1" 
          value="1"
          placeholder="Кількість"
        >
        <span class="food-weight" id="weight-result-${idx}">—</span>
        <button type="button" class="remove-food-btn" onclick="removeWeightRow(${idx})" title="Видалити цей продукт">
          ✕
        </button>
      </div>
    </div>
  `;
}

let weightRowCount = 0;

function addWeightRow() {
  weightRowCount++;
  const container = document.getElementById('weight-rows');
  if (!container) return;
  
  const newRow = document.createElement('div');
  newRow.innerHTML = createWeightRow(weightRowCount);
  container.appendChild(newRow.firstElementChild);
  
  // Initialize autocomplete and event listeners for the new row
  initializeRowWeightAutocomplete(weightRowCount);
  addRowEventListeners(weightRowCount);
}

function removeWeightRow(idx) {
  const row = document.querySelector(`[data-row="${idx}"]`);
  if (row) {
    row.closest('.food-row-card').remove();
    recalculateAllWeights();
  }
}

function addRowEventListeners(rowIdx) {
  const nameInput = document.getElementById(`weight-name-${rowIdx}`);
  const qtyInput = document.getElementById(`weight-qty-${rowIdx}`);
  
  if (nameInput) {
    nameInput.addEventListener('input', () => recalculateRowWeight(rowIdx));
    nameInput.addEventListener('change', () => recalculateRowWeight(rowIdx));
  }
  
  if (qtyInput) {
    qtyInput.addEventListener('input', () => recalculateRowWeight(rowIdx));
    qtyInput.addEventListener('change', () => recalculateRowWeight(rowIdx));
  }
}

function initializeAutocomplete() {
  // Initialize autocomplete for existing rows
  document.querySelectorAll('.food-name').forEach((input, index) => {
    const rowIdx = input.id.split('-')[2];
    if (rowIdx) {
      initializeRowWeightAutocomplete(parseInt(rowIdx));
    }
  });
}

function initializeRowWeightAutocomplete(rowIdx) {
  const input = document.getElementById(`weight-name-${rowIdx}`);
  const suggestionsDiv = document.getElementById(`weight-suggestions-${rowIdx}`);
  
  if (!input || !suggestionsDiv) return;

  input.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      suggestionsDiv.style.display = 'none';
      return;
    }

    // Filter foods that have weight_per_piece data
    const matches = window.FOOD_DB.filter(food => 
      food.name.toLowerCase().includes(query) && 
      food.weight_per_piece && 
      food.weight_per_piece > 0
    ).slice(0, 8);

    if (matches.length === 0) {
      suggestionsDiv.style.display = 'none';
      return;
    }

    const suggestionsHTML = matches.map(food => `
      <div class="suggestion-item" onclick="selectWeightFood(${rowIdx}, '${food.name.replace(/'/g, "\\'")}')">
        <strong>${food.name}</strong>
        <span class="suggestion-nutrition">~${food.weight_per_piece}g each</span>
      </div>
    `).join('');

    suggestionsDiv.innerHTML = suggestionsHTML;
    suggestionsDiv.style.display = 'block';
  });

  // Hide suggestions when clicking outside
  document.addEventListener('click', function(e) {
    if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
      suggestionsDiv.style.display = 'none';
    }
  });
}

function selectWeightFood(rowIdx, foodName) {
  const input = document.getElementById(`weight-name-${rowIdx}`);
  const suggestionsDiv = document.getElementById(`weight-suggestions-${rowIdx}`);
  
  if (input) {
    input.value = foodName;
    input.dataset.selectedFood = foodName;
  }
  
  if (suggestionsDiv) {
    suggestionsDiv.style.display = 'none';
  }
  
  recalculateRowWeight(rowIdx);
}

function getFoodByName(name) {
  if (!name || !window.FOOD_DB) return null;
  
  name = name.trim().toLowerCase();
  return window.FOOD_DB.find(f =>
    f.name && f.name.toLowerCase() === name && f.weight_per_piece
  );
}

function recalculateRowWeight(rowIdx) {
  const nameInput = document.getElementById(`weight-name-${rowIdx}`);
  const qtyInput = document.getElementById(`weight-qty-${rowIdx}`);
  const weightSpan = document.getElementById(`weight-result-${rowIdx}`);
  
  if (!nameInput || !qtyInput || !weightSpan) return;
  
  const name = nameInput.value.trim();
  const qty = parseInt(qtyInput.value) || 0;
  
  if (!name || qty <= 0) {
    weightSpan.textContent = '—';
    weightSpan.style.color = '#666';
    recalculateAllWeights();
    return;
  }
  
  const food = getFoodByName(name);
  if (!food || !food.weight_per_piece) {
    weightSpan.textContent = 'Не знайдено';
    weightSpan.style.color = '#dc3545';
    recalculateAllWeights();
    return;
  }
  
  const totalWeight = food.weight_per_piece * qty;
  const weightOz = (totalWeight / 28.35).toFixed(1);
  const weightLbs = (totalWeight / 453.6).toFixed(2);
  
  weightSpan.innerHTML = `<strong>${totalWeight}g</strong><br><small>(${weightOz} oz, ${weightLbs} lbs)</small>`;
  weightSpan.style.color = '#28a745';
  
  recalculateAllWeights();
}

function recalculateAllWeights() {
  let totalWeight = 0;
  let validItems = 0;
  const itemsBreakdown = [];
  
  document.querySelectorAll('.food-row-grid').forEach(row => {
    const nameInput = row.querySelector('.food-name');
    const qtyInput = row.querySelector('.food-qty');
    
    if (!nameInput || !qtyInput) return;
    
    const name = nameInput.value.trim();
    const qty = parseInt(qtyInput.value) || 0;
    
    if (!name || qty <= 0) return;
    
    const food = getFoodByName(name);
    if (!food || !food.weight_per_piece) return;
    
    const itemWeight = food.weight_per_piece * qty;
    totalWeight += itemWeight;
    validItems++;
    
    itemsBreakdown.push({
      name: food.name,
      quantity: qty,
      unitWeight: food.weight_per_piece,
      totalWeight: itemWeight
    });
  });
  
  const resultDiv = document.getElementById('food-weight-result');
  if (!resultDiv) return;
  
  if (validItems === 0) {
    resultDiv.innerHTML = '<p style="color:#666;">Додайте продукти для розрахунку загальної ваги.</p>';
    return;
  }
  
  const totalOz = (totalWeight / 28.35).toFixed(1);
  const totalLbs = (totalWeight / 453.6).toFixed(2);
  
  const breakdownHTML = itemsBreakdown.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:center;">${item.unitWeight}g</td>
      <td style="text-align:center;"><strong>${item.totalWeight}g</strong></td>
      <td style="text-align:center;">${(item.totalWeight / 28.35).toFixed(1)} oz</td>
    </tr>
  `).join('');
  
  resultDiv.innerHTML = `
    <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
      <h3 style="color:#157aff;margin-top:0;">Результати розрахунку ваги</h3>
      
      <div style="background:#e8f5e8;padding:20px;border-radius:6px;text-align:center;margin:15px 0;">
        <h4 style="margin:0;color:#2e7d32;">Загальна вага</h4>
        <div style="font-size:2.5em;font-weight:bold;color:#1b5e20;margin:10px 0;">
          ${totalWeight.toLocaleString()}g
        </div>
        <div style="font-size:1.2em;color:#388e3c;">
          ${totalOz} унцій • ${totalLbs} фунтів
        </div>
        <div style="color:#666;margin-top:10px;">
          ${validItems} продукт${validItems > 1 ? (validItems < 5 ? 'и' : 'ів') : ''} розраховано
        </div>
      </div>

      <div style="background:white;padding:20px;border-radius:6px;">
        <h4 style="margin-top:0;">Деталі по продуктах</h4>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:12px;text-align:left;border-bottom:2px solid #ddd;">Продукт</th>
                <th style="padding:12px;text-align:center;border-bottom:2px solid #ddd;">Кількість</th>
                <th style="padding:12px;text-align:center;border-bottom:2px solid #ddd;">Вага за штуку</th>
                <th style="padding:12px;text-align:center;border-bottom:2px solid #ddd;">Загалом (г)</th>
                <th style="padding:12px;text-align:center;border-bottom:2px solid #ddd;">Загалом (унц)</th>
              </tr>
            </thead>
            <tbody>
              ${breakdownHTML}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background:#e3f2fd;padding:15px;border-radius:6px;margin-top:15px;">
        <h4 style="margin-top:0;color:#1565c0;">Корисні конверсії</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;color:#1976d2;">
          <div><strong>Грами в унції:</strong> Поділити на 28.35</div>
          <div><strong>Грами в фунти:</strong> Поділити на 453.6</div>
          <div><strong>1 фунт:</strong> 453.6 грамів</div>
          <div><strong>1 унція:</strong> 28.35 грамів</div>
        </div>
      </div>

      <div style="background:#fff3cd;padding:15px;border-radius:6px;margin-top:15px;">
        <h4 style="margin-top:0;color:#856404;">Важливі примітки</h4>
        <ul style="margin:5px 0;color:#856404;font-size:0.9em;">
          <li>Вага базується на середніх розмірах і може значно варіюватись</li>
          <li>Використовуйте ці оцінки для планування та загальної довідки</li>
          <li>Для точного відстеження харчування зважуйте продукти окремо</li>
          <li>Сезонні коливання можуть впливати на фактичну вагу</li>
          <li>Враховуйте відмінності в стиглості та сортах</li>
        </ul>
      </div>
    </div>
  `;
}

function initWeightCalculator() {
  // Add initial row if container is empty
  const container = document.getElementById('weight-rows');
  if (container && container.children.length === 0) {
    addWeightRow();
  }
  
  // Add event listener for add button
  const addBtn = document.getElementById('weight-add-row');
  if (addBtn) {
    addBtn.addEventListener('click', addWeightRow);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  function waitForDB() {
    if (window.FOOD_DB && window.FOOD_DB.length > 0) {
      initWeightCalculator();
    } else {
      setTimeout(waitForDB, 100);
    }
  }
  waitForDB();
});