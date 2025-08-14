// Food Calories Calculator — Ukrainian Version
// Enhanced with better UX, validation, and comprehensive nutrition display

// Attach FOOD_DB to window for global access
window.FOOD_DB = [];
fetch('/assets/data/food-db.json')
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
            placeholder="Введіть назву продукту (напр., куряче філе, яблуко)" 
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
          placeholder="Вага"
        >
        <select class="food-unit" id="food-unit-${idx}" name="food-unit-${idx}">
          <option value="grams">грами</option>
          <option value="pieces">штуки</option>
          <option value="ml">мл</option>
        </select>
        <button type="button" class="remove-food-btn" onclick="removeFoodRow(${idx})" title="Видалити цей інгредієнт">
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
  
  // Auto-calculate if there are other rows with data
  calculateTotals();
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
        <span class="suggestion-nutrition">${food.calories} кал/100г</span>
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
  
  // Auto-calculate when input changes
  input.addEventListener('blur', function() {
    setTimeout(calculateTotals, 100); // Small delay to allow selection
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
    case 'pieces':
      return amount * (foodData.weight_per_piece || 100); // Default 100g if no piece weight
    case 'ml':
      return amount * (foodData.density || 1); // Convert ml to grams using density
    default:
      return amount;
  }
}

function calculateTotals() {
  const resultDiv = document.getElementById('food-calories-result');
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
      unit: unit === 'grams' ? 'г' : unit === 'pieces' ? 'шт' : 'мл',
      weight: weightInGrams,
      calories: itemCalories,
      protein: itemProtein,
      fat: itemFat,
      carbs: itemCarbs
    });
  });

  if (validItems === 0) {
    resultDiv.innerHTML = '<p style="color:#666;">Додайте інгредієнти, щоб побачити інформацію про калорійність.</p>';
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
      <td>${item.amount} ${item.unit} (${Math.round(item.weight)}г)</td>
      <td>${Math.round(item.calories)}</td>
      <td>${item.protein.toFixed(1)}г</td>
      <td>${item.fat.toFixed(1)}г</td>
      <td>${item.carbs.toFixed(1)}г</td>
    </tr>
  `).join('');

  resultDiv.innerHTML = `
    <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
      <h3 style="color:#157aff;margin-top:0;">Загальна інформація про калорійність</h3>
      
      <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;text-align:center;">
          <div style="background:#e3f2fd;padding:15px;border-radius:6px;">
            <div style="font-size:2em;font-weight:bold;color:#1976d2;">${Math.round(totalCalories)}</div>
            <div style="color:#1976d2;font-weight:bold;">Загалом калорій</div>
            <div style="color:#666;font-size:0.9em;">${(totalCalories/totalWeight*100).toFixed(1)} кал/100г</div>
          </div>
          <div style="background:#e8f5e8;padding:15px;border-radius:6px;">
            <div style="font-size:1.5em;font-weight:bold;color:#2e7d32;">${totalWeight.toFixed(0)}г</div>
            <div style="color:#2e7d32;font-weight:bold;">Загальна вага</div>
            <div style="color:#666;font-size:0.9em;">${validItems} інгредієнт${validItems > 1 ? (validItems < 5 ? 'и' : 'ів') : ''}</div>
          </div>
        </div>
      </div>

      <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
        <h4 style="margin-top:0;">Білки, жири, вуглеводи (БЖВ)</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;">
          <div style="text-align:center;padding:15px;background:#fff3e0;border-radius:6px;">
            <div style="font-weight:bold;color:#f57c00;font-size:1.1em;">Білки</div>
            <div style="font-size:1.3em;margin:5px 0;">${totalProtein.toFixed(1)}г</div>
            <div style="color:#666;">${Math.round(proteinCals)} кал (${proteinPercent.toFixed(1)}%)</div>
          </div>
          <div style="text-align:center;padding:15px;background:#fce4ec;border-radius:6px;">
            <div style="font-weight:bold;color:#c2185b;font-size:1.1em;">Жири</div>
            <div style="font-size:1.3em;margin:5px 0;">${totalFat.toFixed(1)}г</div>
            <div style="color:#666;">${Math.round(fatCals)} кал (${fatPercent.toFixed(1)}%)</div>
          </div>
          <div style="text-align:center;padding:15px;background:#e1f5fe;border-radius:6px;">
            <div style="font-weight:bold;color:#0277bd;font-size:1.1em;">Вуглеводи</div>
            <div style="font-size:1.3em;margin:5px 0;">${totalCarbs.toFixed(1)}г</div>
            <div style="color:#666;">${Math.round(carbCals)} кал (${carbPercent.toFixed(1)}%)</div>
          </div>
        </div>
      </div>

      <div style="background:white;padding:20px;border-radius:6px;">
        <h4 style="margin-top:0;">Деталі по інгредієнтах</h4>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:10px;text-align:left;border-bottom:1px solid #ddd;">Інгредієнт</th>
                <th style="padding:10px;text-align:left;border-bottom:1px solid #ddd;">Кількість</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Калорії</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Білки</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Жири</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #ddd;">Вуглеводи</th>
              </tr>
            </thead>
            <tbody>
              ${breakdownHTML}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background:#fff3cd;padding:15px;border-radius:6px;margin-top:15px;">
        <h4 style="margin-top:0;color:#856404;">Поради по використанню результатів</h4>
        <ul style="margin:5px 0;color:#856404;font-size:0.9em;">
          <li>Використовуйте ці дані для планування раціону і підрахунку калорій</li>
          <li>Змінюйте порції відповідно до ваших щоденних цілей</li>
          <li>Враховуйте способи приготування, які можуть впливати на калорійність</li>
          <li>Значення є приблизними, базуються на стандартних даних складу продуктів</li>
        </ul>
      </div>
      
      <div style="background:white;padding:20px;border-radius:6px;margin-top:15px;border-left:4px solid #28a745;">
        <h4 style="margin-top:0;color:#28a745;">Рекомендації по харчуванню</h4>
        ${generateNutritionRecommendations(totalCalories, totalProtein, totalFat, totalCarbs, totalWeight)}
      </div>
      
      <div style="background:white;padding:20px;border-radius:6px;margin-top:15px;border-left:4px solid #007bff;">
        <h4 style="margin-top:0;color:#007bff;">Ідеї для додавання до страви</h4>
        ${generateMealSuggestions(itemsBreakdown)}
      </div>
    </div>
  `;
}

function generateNutritionRecommendations(calories, protein, fat, carbs, weight) {
  let recommendations = [];
  
  // Calorie density assessment
  const caloriesPerGram = calories / weight;
  if (caloriesPerGram > 4) {
    recommendations.push("📊 Висока калорійність страви - підходить для набору ваги або інтенсивних тренувань");
  } else if (caloriesPerGram < 1.5) {
    recommendations.push("✅ Низькокалорійна страва - чудово підходить для схуднення");
  } else {
    recommendations.push("⚖️ Помірна калорійність - підходить для підтримки ваги");
  }
  
  // Protein assessment
  const proteinPercent = (protein * 4 / calories) * 100;
  if (proteinPercent > 30) {
    recommendations.push("💪 Високий вміст білка - відмінно для м'язової маси та відновлення");
  } else if (proteinPercent < 15) {
    recommendations.push("🥩 Додайте білкові продукти: м'ясо, рибу, яйця або бобові");
  }
  
  // Fat assessment
  const fatPercent = (fat * 9 / calories) * 100;
  if (fatPercent > 35) {
    recommendations.push("🥑 Високий вміст жирів - контролюйте порції для схуднення");
  }
  
  // Carb assessment
  const carbPercent = (carbs * 4 / calories) * 100;
  if (carbPercent > 60) {
    recommendations.push("🍞 Багато вуглеводів - підходить перед тренуванням або фізичною активністю");
  }
  
  // Portion recommendations
  if (calories > 800) {
    recommendations.push("🍽️ Розділіть на 2-3 порції для комфортного споживання");
  } else if (calories < 300) {
    recommendations.push("🥗 Підходить як легкий перекус або гарнір");
  }
  
  return `<ul style="margin:5px 0;color:#666;font-size:0.9em;">${recommendations.map(r => `<li>${r}</li>`).join('')}</ul>`;
}

function generateMealSuggestions(items) {
  const hasProtein = items.some(item => item.name.includes('м\'ясо') || item.name.includes('курка') || item.name.includes('яйце'));
  const hasVegetables = items.some(item => item.name.includes('огірок') || item.name.includes('помідор') || item.name.includes('морква'));
  const hasGrains = items.some(item => item.name.includes('рис') || item.name.includes('гречка') || item.name.includes('хліб'));
  
  let suggestions = [];
  
  if (!hasProtein) {
    suggestions.push("🍗 Додайте білок: куряче філе, риба, яйця, сир або бобові");
  }
  
  if (!hasVegetables) {
    suggestions.push("🥬 Додайте овочі: огірки, помідори, капуста, морква для вітамінів");
  }
  
  if (!hasGrains) {
    suggestions.push("🌾 Додайте складні вуглеводи: рис, гречка, вівсянка для енергії");
  }
  
  // Healthy additions
  suggestions.push("🥑 Корисні добавки: авокадо, горіхи, насіння для здорових жирів");
  suggestions.push("🌿 Зелень та спеції: петрушка, кріп, часник для смаку та користі");
  
  if (suggestions.length === 2) { // Only the healthy additions
    suggestions = ["✅ Збалансована страва! Містить основні групи нутрієнтів", ...suggestions];
  }
  
  return `<ul style="margin:5px 0;color:#666;font-size:0.9em;">${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
}

// Auto-calculation on input changes
function setupAutoCalculation() {
  document.addEventListener('input', function(e) {
    if (e.target.matches('.food-amount, .food-unit')) {
      calculateTotals();
    }
  });
}

// Initialize the calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Add initial food row if container exists
  const container = document.getElementById('food-rows');
  if (container && container.children.length === 0) {
    addFoodRow();
  }

  // Add event listener for the Ukrainian button
  const addBtn = document.getElementById('food-add-row');
  if (addBtn) {
    addBtn.addEventListener('click', addFoodRow);
  }
  
  // Add event listener for the calculate button
  const calculateBtn = document.getElementById('food-calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateTotals);
  }
  
  // Setup auto-calculation
  setupAutoCalculation();
});