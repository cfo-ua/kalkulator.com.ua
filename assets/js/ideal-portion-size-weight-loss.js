document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('portion-size-form');
  const result = document.getElementById('portion-size-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    let weight = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    let targetWeight = +form['target-weight'].value;
    const targetWeightUnit = form['target-weight-unit'].value;
    const heightFt = +form['height-ft'].value || 0;
    const heightIn = +form['height-in'].value || 0;
    const heightCm = +form['height-cm'].value || 0;
    const age = +form.age.value;
    const gender = form.gender.value;
    const weightLossRate = form['weight-loss-rate'].value;
    const activityLevel = form['activity-level'].value;
    const dietStyle = form['diet-style'].value;
    const mealFrequency = form['meal-frequency'].value;
    const diabetes = form.diabetes.value;
    const foodRestrictions = form['food-restrictions'].value;
    const cookingFrequency = form['cooking-frequency'].value;
    const foodBudget = form['food-budget'].value;

    // Validation
    if (!weight || (!heightCm && (!heightFt || heightFt < 4)) || !age || !gender || 
        !targetWeight || !weightLossRate || !activityLevel || !dietStyle || 
        !mealFrequency || !diabetes || !foodRestrictions || !cookingFrequency || !foodBudget) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля для розрахунку ідеальних розмірів порцій.</p>';
      return;
    }

    // Convert weights to kg if needed
    if (weightUnit === 'lbs') weight = weight / 2.205;
    if (targetWeightUnit === 'lbs') targetWeight = targetWeight / 2.205;
    
    // Convert height to cm if needed
    let heightInCm = heightCm;
    if (heightFt && heightIn !== null) {
      heightInCm = (heightFt * 12 + heightIn) * 2.54;
    }

    // Validate weight loss goal
    const weightToLose = weight - targetWeight;
    if (weightToLose <= 0) {
      result.innerHTML = '<p style="color:red;">Цільова вага має бути меншою за поточну вагу для схуднення.</p>';
      return;
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * heightInCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * heightInCm) - (4.330 * age);
    }

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };
    
    const tdee = bmr * activityMultipliers[activityLevel];

    // Calculate calorie deficit based on weight loss rate
    const deficitMap = {
      'conservative': 350, // 0.2-0.5 kg/week
      'moderate': 600,     // 0.5-0.7 kg/week  
      'aggressive': 850    // 0.7-1 kg/week
    };
    
    const dailyDeficit = deficitMap[weightLossRate];
    const targetCalories = Math.max(1200, tdee - dailyDeficit); // Minimum 1200 calories

    // Calculate macronutrient distribution based on diet style
    let proteinPercent, carbPercent, fatPercent;
    
    switch (dietStyle) {
      case 'balanced':
        proteinPercent = 25; carbPercent = 45; fatPercent = 30;
        break;
      case 'low-carb':
        proteinPercent = 30; carbPercent = 25; fatPercent = 45;
        break;
      case 'keto':
        proteinPercent = 25; carbPercent = 5; fatPercent = 70;
        break;
      case 'mediterranean':
        proteinPercent = 20; carbPercent = 40; fatPercent = 40;
        break;
      case 'vegetarian':
      case 'vegan':
        proteinPercent = 20; carbPercent = 50; fatPercent = 30;
        break;
      case 'paleo':
        proteinPercent = 30; carbPercent = 30; fatPercent = 40;
        break;
      default:
        proteinPercent = 25; carbPercent = 45; fatPercent = 30;
    }

    // Calculate macronutrient calories and grams
    const proteinCalories = targetCalories * (proteinPercent / 100);
    const carbCalories = targetCalories * (carbPercent / 100);
    const fatCalories = targetCalories * (fatPercent / 100);
    
    const proteinGrams = Math.round(proteinCalories / 4);
    const carbGrams = Math.round(carbCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    // Calculate meal distribution based on frequency
    let mealCalories = [];
    let mealNames = [];
    
    switch (mealFrequency) {
      case '3-meals-2-snacks':
        mealCalories = [
          Math.round(targetCalories * 0.30), // Breakfast
          Math.round(targetCalories * 0.10), // Morning snack
          Math.round(targetCalories * 0.35), // Lunch
          Math.round(targetCalories * 0.10), // Afternoon snack
          Math.round(targetCalories * 0.25)  // Dinner
        ];
        mealNames = ['Сніданок', 'Ранковий перекус', 'Обід', 'Післяобідній перекус', 'Вечеря'];
        break;
      case '3-meals':
        mealCalories = [
          Math.round(targetCalories * 0.30), // Breakfast
          Math.round(targetCalories * 0.40), // Lunch
          Math.round(targetCalories * 0.30)  // Dinner
        ];
        mealNames = ['Сніданок', 'Обід', 'Вечеря'];
        break;
      case '5-6-small':
        const mealSize = Math.round(targetCalories / 5);
        mealCalories = [mealSize, mealSize, mealSize, mealSize, mealSize];
        mealNames = ['Прийом їжі 1', 'Прийом їжі 2', 'Прийом їжі 3', 'Прийом їжі 4', 'Прийом їжі 5'];
        break;
      case 'intermittent-fasting':
        mealCalories = [
          Math.round(targetCalories * 0.40), // First meal
          Math.round(targetCalories * 0.60)  // Second meal
        ];
        mealNames = ['Перший прийом їжі', 'Другий прийом їжі'];
        break;
    }

    // Calculate portion sizes for different food groups
    const portionSizes = calculatePortionSizes(proteinGrams, carbGrams, fatGrams, mealCalories.length, dietStyle);
    
    // Calculate weekly weight loss
    const weeklyWeightLoss = (dailyDeficit * 7) / 7700; // 7700 calories ≈ 1 kg
    const weeksToGoal = Math.ceil(weightToLose / weeklyWeightLoss);
    
    // Generate recommendations based on user preferences
    const recommendations = generateRecommendations(diabetes, foodRestrictions, cookingFrequency, foodBudget, dietStyle);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваш персоналізований план порцій для схуднення</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;">
              <div style="background:#157aff;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${Math.round(targetCalories)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Калорій на день</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#28a745;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${weightToLose.toFixed(1)} кг
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">До втрати</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#fd7e14;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${weeksToGoal} тижнів
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">До цілі</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">📊 Розподіл макронутрієнтів</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#e8f4fd;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-size:1.5em;font-weight:bold;color:#157aff;">${proteinGrams}г</div>
              <div style="color:#666;">Білки (${proteinPercent}%)</div>
              <div style="background:#157aff;height:8px;border-radius:4px;margin:10px 0;"></div>
              <div style="font-size:0.8em;color:#666;">${Math.round(proteinCalories)} ккал</div>
            </div>
            <div style="background:#d4edda;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-size:1.5em;font-weight:bold;color:#28a745;">${carbGrams}г</div>
              <div style="color:#666;">Вуглеводи (${carbPercent}%)</div>
              <div style="background:#28a745;height:8px;border-radius:4px;margin:10px 0;"></div>
              <div style="font-size:0.8em;color:#666;">${Math.round(carbCalories)} ккал</div>
            </div>
            <div style="background:#fff3cd;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-size:1.5em;font-weight:bold;color:#856404;">${fatGrams}г</div>
              <div style="color:#666;">Жири (${fatPercent}%)</div>
              <div style="background:#856404;height:8px;border-radius:4px;margin:10px 0;"></div>
              <div style="font-size:0.8em;color:#666;">${Math.round(fatCalories)} ккал</div>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">🥗 Рекомендовані розміри порцій</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${generatePortionDisplay(portionSizes)}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">🍽️ Розподіл калорій за прийомами їжі</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            ${mealNames.map((name, index) => `
              <div style="background:#f8f9fa;padding:10px;border-radius:6px;text-align:center;">
                <div style="font-weight:bold;color:#fd7e14;">${name}</div>
                <div style="font-size:1.2em;margin:5px 0;">${mealCalories[index]} ккал</div>
                <div style="background:#fd7e14;height:6px;border-radius:3px;"></div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">💡 Персоналізовані рекомендації</h4>
          <ul style="margin:10px 0;color:#666;">
            ${recommendations.map(rec => `<li style="margin:5px 0;">${rec}</li>`).join('')}
          </ul>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #17a2b8;">
          <h4 style="margin-top:0;color:#0c5460;">📏 Візуальні орієнтири розмірів порцій</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div>
              <strong>🥩 Білки:</strong> Розмір долоні (85-115г)
            </div>
            <div>
              <strong>🥕 Овочі:</strong> 2 жмені або бейсбольний м'яч
            </div>
            <div>
              <strong>🍞 Вуглеводи:</strong> Жменя або тенісний м'яч
            </div>
            <div>
              <strong>🥑 Жири:</strong> Розмір великого пальця
            </div>
            <div>
              <strong>🍎 Фрукти:</strong> Розмір кулака
            </div>
            <div>
              <strong>🥜 Горіхи:</strong> Невелика жменя (30г)
            </div>
          </div>
        </div>

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #dc3545;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Важливі поради</h4>
          <ul style="color:#721c24;margin:10px 0;">
            <li>Пийте щонайменше 8 склянок води щодня</li>
            <li>Їжте повільно та усвідомлено</li>
            <li>Використовуйте менші тарілки для контролю порцій</li>
            <li>Готуйте заздалегідь та порціонуйте їжу</li>
            <li>Слухайте сигнали голоду та насичення свого тіла</li>
            <li>Регулярно коригуйте план на основі прогресу</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function calculatePortionSizes(proteinGrams, carbGrams, fatGrams, mealsPerDay, dietStyle) {
    const proteinPerMeal = Math.round(proteinGrams / mealsPerDay);
    const carbPerMeal = Math.round(carbGrams / mealsPerDay);
    const fatPerMeal = Math.round(fatGrams / mealsPerDay);

    return {
      protein: {
        grams: proteinPerMeal,
        examples: dietStyle === 'vegan' ? 
          ['Тофу: 150г', 'Квасоля: 120г', 'Горіхи: 60г'] :
          ['Курка: 100г', 'Риба: 120г', 'Яйця: 2 шт', 'Творог: 150г']
      },
      carbs: {
        grams: carbPerMeal,
        examples: dietStyle === 'keto' ? 
          ['Листова зелень: необмежено', 'Авокадо: 1/2 шт'] :
          ['Гречка: 60г (сухої)', 'Рис: 50г (сухого)', 'Овес: 40г', 'Картопля: 150г']
      },
      fats: {
        grams: fatPerMeal,
        examples: ['Оливкова олія: 1 ст.л.', 'Авокадо: 1/4 шт', 'Горіхи: 20г', 'Насіння: 15г']
      },
      vegetables: {
        grams: '200-300',
        examples: ['Салат: 2 жмені', 'Броколі: 150г', 'Помідори: 2 середніх', 'Огірки: 1 великий']
      }
    };
  }

  function generatePortionDisplay(portions) {
    return `
      <div style="background:#e8f4fd;padding:15px;border-radius:6px;">
        <strong style="color:#157aff;">🥩 Білки на прийом їжі:</strong>
        <div style="margin:5px 0;font-weight:bold;">${portions.protein.grams}г</div>
        <div style="font-size:0.9em;color:#666;">
          ${portions.protein.examples.join(', ')}
        </div>
      </div>
      <div style="background:#d4edda;padding:15px;border-radius:6px;">
        <strong style="color:#28a745;">🍞 Вуглеводи на прийом їжі:</strong>
        <div style="margin:5px 0;font-weight:bold;">${portions.carbs.grams}г</div>
        <div style="font-size:0.9em;color:#666;">
          ${portions.carbs.examples.join(', ')}
        </div>
      </div>
      <div style="background:#fff3cd;padding:15px;border-radius:6px;">
        <strong style="color:#856404;">🥑 Жири на прийом їжі:</strong>
        <div style="margin:5px 0;font-weight:bold;">${portions.fats.grams}г</div>
        <div style="font-size:0.9em;color:#666;">
          ${portions.fats.examples.join(', ')}
        </div>
      </div>
      <div style="background:#f0f0f0;padding:15px;border-radius:6px;">
        <strong style="color:#333;">🥕 Овочі на прийом їжі:</strong>
        <div style="margin:5px 0;font-weight:bold;">${portions.vegetables.grams}г</div>
        <div style="font-size:0.9em;color:#666;">
          ${portions.vegetables.examples.join(', ')}
        </div>
      </div>
    `;
  }

  function generateRecommendations(diabetes, foodRestrictions, cookingFrequency, foodBudget, dietStyle) {
    const recommendations = [];

    if (diabetes !== 'none') {
      recommendations.push('При діабеті контролюйте вуглеводи та регулярно перевіряйте рівень цукру в крові');
      recommendations.push('Віддавайте перевагу продуктам з низьким глікемічним індексом');
    }

    if (foodRestrictions !== 'none') {
      recommendations.push('Перевіряйте етикетки продуктів на наявність алергенів та заборонених інгредієнтів');
    }

    if (cookingFrequency === 'rarely' || cookingFrequency === 'never') {
      recommendations.push('Розгляньте варіанти здорових готових страв або сервісів доставки');
      recommendations.push('Вивчіть прості рецепти, які не потребують багато часу на приготування');
    }

    if (foodBudget === 'low') {
      recommendations.push('Фокусуйтесь на доступних білках: яйця, бобові, курка');
      recommendations.push('Купуйте заморожені овочі та фрукти - вони дешевші та довше зберігаються');
      recommendations.push('Готуйте великі порції та заморожуйте частинами');
    }

    if (dietStyle === 'vegan') {
      recommendations.push('Комбінуйте різні рослинні білки для повного амінокислотного профілю');
      recommendations.push('Доповнюйте раціон вітаміном B12 та залізом');
    }

    if (recommendations.length === 0) {
      recommendations.push('Їжте різноманітно та збалансовано');
      recommendations.push('Готуйте заздалегідь для успішного дотримання плану');
      recommendations.push('Слухайте свій організм та коригуйте порції за потребою');
    }

    return recommendations;
  }
});