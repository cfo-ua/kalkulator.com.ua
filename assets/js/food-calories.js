// Food Calories Calculator — English Version with US/UK Food Database
// Enhanced with better UX, validation, and comprehensive nutrition display

// Attach FOOD_DB to window for global access
window.FOOD_DB = [];
fetch('/assets/data/food-db-en.json')
  .then(resp => resp.json())
  .then(data => { 
    window.FOOD_DB = data;
    initializeAutocomplete();
  })
  .catch(err => {
    console.error('Failed to load food database:', err);
    window.FOOD_DB = []; // Fallback to empty array
  });

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
            placeholder="Enter food name (e.g., chicken breast, apple)" 
            autocomplete="off"
          >
          <div class="autocomplete-suggestions" id="suggestions-${idx}"></div>
        </div>
        <input 
          type="number" 
          class="food-amount" 
          id="food-amount-${idx}" 
          name="food-amount-${idx}" 
          min="0" 
          step="any" 
          value="100"
          placeholder="Weight"
        >
        <select class="food-unit" id="food-unit-${idx}" name="food-unit-${idx}">
          <option value="grams">grams</option>
          <option value="ounces">ounces</option>
          <option value="pounds">pounds</option>
          <option value="pieces">pieces</option>
          <option value="cups">cups</option>
          <option value="ml">ml</option>
        </select>
        <button type="button" class="remove-food-btn" onclick="removeFoodRow(${idx})" title="Remove this ingredient">
          ✕
        </button>
      </div>
    </div>
  `;
}

let foodRowCount = 0;

function addFoodRow() {
  foodRowCount++;
  const container = document.getElementById('food-rows');
  if (!container) return;
  
  const newRow = document.createElement('div');
  newRow.innerHTML = createFoodRow(foodRowCount);
  container.appendChild(newRow.firstElementChild);
  
  // Initialize autocomplete for the new row
  initializeRowAutocomplete(foodRowCount);
}

function removeFoodRow(idx) {
  const row = document.querySelector(`[data-row="${idx}"]`);
  if (row) {
    row.closest('.food-row-card').remove();
    calculateTotals(); // Recalculate when removing items
  }
}

function initializeAutocomplete() {
  // Initialize autocomplete for existing rows
  document.querySelectorAll('.food-name').forEach((input, index) => {
    initializeRowAutocomplete(index);
  });
}

function initializeRowAutocomplete(rowIdx) {
  const input = document.getElementById(`food-name-${rowIdx}`);
  const suggestionsDiv = document.getElementById(`suggestions-${rowIdx}`);
  
  if (!input || !suggestionsDiv) return;

  input.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      suggestionsDiv.style.display = 'none';
      return;
    }

    // Filter foods based on query
    const matches = window.FOOD_DB.filter(food => 
      food.name.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 suggestions

    if (matches.length === 0) {
      suggestionsDiv.style.display = 'none';
      return;
    }

    // Create suggestions HTML
    const suggestionsHTML = matches.map(food => `
      <div class="suggestion-item" onclick="selectFood(${rowIdx}, '${food.name.replace(/'/g, "\\'")}')">
        <strong>${food.name}</strong>
        <span class="suggestion-nutrition">${food.calories} cal/100g</span>
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

function selectFood(rowIdx, foodName) {
  const input = document.getElementById(`food-name-${rowIdx}`);
  const suggestionsDiv = document.getElementById(`suggestions-${rowIdx}`);
  
  if (input) {
    input.value = foodName;
    input.dataset.selectedFood = foodName;
  }
  
  if (suggestionsDiv) {
    suggestionsDiv.style.display = 'none';
  }
  
  calculateTotals();
}

function convertToGrams(amount, unit, foodData) {
  switch(unit) {
    case 'grams':
      return amount;
    case 'ounces':
      return amount * 28.35; // 1 oz = 28.35g
    case 'pounds':
      return amount * 453.6; // 1 lb = 453.6g
    case 'pieces':
      return amount * (foodData.weight_per_piece || 100); // Default 100g if no piece weight
    case 'cups':
      return amount * 240 * (foodData.density || 1); // 1 cup ≈ 240ml, adjusted for density
    case 'ml':
      return amount * (foodData.density || 1); // Convert ml to grams using density
    default:
      return amount;
  }
}

function calculateTotals() {
  const resultDiv = document.getElementById('food-result');
  if (!resultDiv) return;

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  let totalWeight = 0;
  let validItems = 0;

  const rows = document.querySelectorAll('.food-row-grid');
  const itemsBreakdown = [];

  rows.forEach(row => {
    const nameInput = row.querySelector('.food-name');
    const amountInput = row.querySelector('.food-amount');
    const unitSelect = row.querySelector('.food-unit');
    
    if (!nameInput || !amountInput || !unitSelect) return;

    const foodName = nameInput.value.trim();
    const amount = parseFloat(amountInput.value) || 0;
    const unit = unitSelect.value;

    if (!foodName || amount <= 0) return;

    // Find food in database
    const foodData = window.FOOD_DB.find(food => 
      food.name.toLowerCase() === foodName.toLowerCase()
    );

    if (!foodData) return;

    // Convert amount to grams
    const weightInGrams = convertToGrams(amount, unit, foodData);
    const factor = weightInGrams / 100; // Nutrition per 100g

    const itemCalories = foodData.calories * factor;
    const itemProtein = foodData.protein * factor;
    const itemFat = foodData.fat * factor;
    const itemCarbs = foodData.carb * factor;

    totalCalories += itemCalories;
    totalProtein += itemProtein;
    totalFat += itemFat;
    totalCarbs += itemCarbs;
    totalWeight += weightInGrams;
    validItems++;

    // Store for breakdown display
    itemsBreakdown.push({
      name: foodData.name,
      amount: amount,
      unit: unit,
      weight: weightInGrams,
      calories: itemCalories,
      protein: itemProtein,
      fat: itemFat,
      carbs: itemCarbs
    });
  });

  if (validItems === 0) {
    resultDiv.innerHTML = '<p style="color:#666;">Add some ingredients to see nutrition information.</p>';
    return;
  }

  // Calculate macro percentages
  const proteinCals = totalProtein * 4;
  const fatCals = totalFat * 9;
  const carbCals = totalCarbs * 4;
  const macroTotal = proteinCals + fatCals + carbCals;

  const proteinPercent = macroTotal > 0 ? (proteinCals / macroTotal * 100) : 0;
  const fatPercent = macroTotal > 0 ? (fatCals / macroTotal * 100) : 0;
  const carbPercent = macroTotal > 0 ? (carbCals / macroTotal * 100) : 0;

  // Generate breakdown HTML
  const breakdownHTML = itemsBreakdown.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td>${item.amount} ${item.unit} (${Math.round(item.weight)}g)</td>
      <td>${Math.round(item.calories)}</td>
      <td>${item.protein.toFixed(1)}g</td>
      <td>${item.fat.toFixed(1)}g</td>
      <td>${item.carbs.toFixed(1)}g</td>
    </tr>
  `).join('');

  resultDiv.innerHTML = `
    <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
      <h3 style="color:#157aff;margin-top:0;">Nutrition Summary</h3>
      
      <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;text-align:center;">
          <div style="background:#e3f2fd;padding:15px;border-radius:6px;">
            <div style="font-size:2em;font-weight:bold;color:#1976d2;">${Math.round(totalCalories)}</div>
            <div style="color:#1976d2;font-weight:bold;">Total Calories</div>
            <div style="color:#666;font-size:0.9em;">${(totalCalories/totalWeight*100).toFixed(1)} cal/100g</div>
          </div>
          <div style="background:#e8f5e8;padding:15px;border-radius:6px;">
            <div style="font-size:1.5em;font-weight:bold;color:#2e7d32;">${totalWeight.toFixed(0)}g</div>
            <div style="color:#2e7d32;font-weight:bold;">Total Weight</div>
            <div style="color:#666;font-size:0.9em;">${validItems} ingredient${validItems > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
        <h4 style="margin-top:0;">Macronutrient Breakdown</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;">
          <div style="text-align:center;padding:15px;background:#fff3e0;border-radius:6px;">
            <div style="font-weight:bold;color:#f57c00;font-size:1.1em;">Protein</div>
            <div style="font-size:1.3em;margin:5px 0;">${totalProtein.toFixed(1)}g</div>
            <div style="color:#666;">${Math.round(proteinCals)} cal (${proteinPercent.toFixed(1)}%)</div>
          </div>
          <div style="text-align:center;padding:15px;background:#fce4ec;border-radius:6px;">
            <div style="font-weight:bold;color:#c2185b;font-size:1.1em;">Fat</div>
            <div style="font-size:1.3em;margin:5px 0;">${totalFat.toFixed(1)}g</div>
            <div style="color:#666;">${Math.round(fatCals)} cal (${fatPercent.toFixed(1)}%)</div>
          </div>
          <div style="text-align:center;padding:15px;background:#e1f5fe;border-radius:6px;">
            <div style="font-weight:bold;color:#0277bd;font-size:1.1em;">Carbs</div>
            <div style="font-size:1.3em;margin:5px 0;">${totalCarbs.toFixed(1)}g</div>
            <div style="color:#666;">${Math.round(carbCals)} cal (${carbPercent.toFixed(1)}%)</div>
          </div>
        </div>
      </div>

      <div style="background:white;padding:20px;border-radius:6px;">
        <h4 style="margin-top:0;">Ingredient Breakdown</h4>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:10px;text-align:left;border-bottom:1px solid #ddd;">Ingredient</th>
                <th style="padding:10px;text-align:left;border-bottom:1px solid #ddd;">Amount</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Calories</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Protein</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Fat</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Carbs</th>
              </tr>
            </thead>
            <tbody>
              ${breakdownHTML}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background:#fff3cd;padding:15px;border-radius:6px;margin-top:15px;">
        <h4 style="margin-top:0;color:#856404;">Tips for Using These Results</h4>
        <ul style="margin:5px 0;color:#856404;font-size:0.9em;">
          <li>Use these values for meal planning and calorie tracking</li>
          <li>Adjust portions to meet your daily nutrition goals</li>
          <li>Consider cooking methods that may affect final nutrition</li>
          <li>Values are estimates based on standard food composition data</li>
        </ul>
      </div>
    </div>
  `;
}

// Initialize the calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Add initial food row if container exists
  const container = document.getElementById('food-rows');
  if (container && container.children.length === 0) {
    addFoodRow();
  }

  // Add calculate button event listener
  const calculateBtn = document.getElementById('calculate-food-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateTotals);
  }

  // Add new ingredient button
  const addBtn = document.getElementById('add-food-btn');
  if (addBtn) {
    addBtn.addEventListener('click', addFoodRow);
  }
});