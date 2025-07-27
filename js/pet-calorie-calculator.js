document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('pet-calorie-form');
  const result = document.getElementById('pet-calorie-result');

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculatePetCalories();
    });
  }

  function calculatePetCalories() {
    // Get form values
    const petType = document.getElementById('pet-type').value;
    const petWeight = parseFloat(document.getElementById('pet-weight').value);
    const weightUnit = document.getElementById('weight-unit').value;
    const lifeStage = document.getElementById('life-stage').value;
    const spayNeuter = document.getElementById('spay-neuter').value;
    const activityLevel = document.getElementById('activity-level').value;
    const environment = document.getElementById('environment').value;
    const exerciseDuration = parseInt(document.getElementById('exercise-duration').value) || 30;
    const weightGoal = document.getElementById('weight-goal').value;
    const bodyCondition = document.getElementById('body-condition').value;
    const healthConditions = document.getElementById('health-conditions').value;
    const climate = document.getElementById('climate').value;

    // Validate required fields
    if (!petType || !petWeight || !lifeStage || !spayNeuter || !activityLevel || !weightGoal) {
      result.innerHTML = '<div class="error">Будь ласка, заповніть всі обов\'язкові поля.</div>';
      return;
    }

    // Convert weight to kg if needed
    const weightKg = weightUnit === 'lbs' ? petWeight / 2.205 : petWeight;
    const weightLbs = weightUnit === 'kg' ? petWeight * 2.205 : petWeight;

    // Calculate Resting Energy Requirement (RER)
    let rer = calculateRER(weightKg, petType);

    // Calculate Daily Energy Requirement (DER) multiplier
    let derMultiplier = calculateDERMultiplier(lifeStage, activityLevel, spayNeuter, environment, climate, healthConditions);

    // Calculate base DER
    let der = rer * derMultiplier;

    // Adjust for weight goal
    der = adjustForWeightGoal(der, weightGoal, bodyCondition);

    // Calculate food portions for different food types
    const portions = calculateFoodPortions(der, weightKg);

    // Display results
    displayResults({
      rer: rer,
      der: der,
      weightKg: weightKg,
      weightLbs: weightLbs,
      derMultiplier: derMultiplier,
      portions: portions,
      petType: petType,
      lifeStage: lifeStage,
      activityLevel: activityLevel,
      weightGoal: weightGoal,
      bodyCondition: bodyCondition,
      exerciseDuration: exerciseDuration
    });
  }

  function calculateRER(weightKg, petType) {
    // Standard RER formula: 70 × (body weight in kg)^0.75
    let rer = 70 * Math.pow(weightKg, 0.75);

    // Adjustments for different pet types
    switch (petType) {
      case 'cat':
        // Cats have slightly lower RER
        rer *= 0.95;
        break;
      case 'rabbit':
        // Rabbits have higher metabolic rate
        rer *= 1.1;
        break;
      case 'guinea-pig':
        // Guinea pigs have very high metabolic rate
        rer *= 1.3;
        break;
      case 'ferret':
        // Ferrets have extremely high metabolic rate
        rer *= 1.5;
        break;
      case 'dog':
      default:
        // Standard calculation for dogs
        break;
    }

    return Math.round(rer);
  }

  function calculateDERMultiplier(lifeStage, activityLevel, spayNeuter, environment, climate, healthConditions) {
    let multiplier = 1.0;

    // Life stage multipliers
    switch (lifeStage) {
      case 'puppy-kitten':
        multiplier = 2.0; // Growing animals need more energy
        break;
      case 'young-adult':
        multiplier = 1.8;
        break;
      case 'adult':
        multiplier = 1.6;
        break;
      case 'senior':
        multiplier = 1.4; // Slower metabolism
        break;
      case 'pregnant':
        multiplier = 1.8; // Increases throughout pregnancy
        break;
      case 'lactating':
        multiplier = 3.0; // Very high energy needs
        break;
    }

    // Activity level adjustments
    switch (activityLevel) {
      case 'sedentary':
        multiplier *= 0.8;
        break;
      case 'light':
        multiplier *= 0.9;
        break;
      case 'moderate':
        multiplier *= 1.0;
        break;
      case 'high':
        multiplier *= 1.2;
        break;
      case 'very-high':
        multiplier *= 1.4;
        break;
    }

    // Spay/neuter adjustment
    if (spayNeuter === 'neutered-male' || spayNeuter === 'spayed-female') {
      multiplier *= 0.9; // Reduced metabolism after surgery
    }

    // Environment adjustment
    switch (environment) {
      case 'outdoor':
        multiplier *= 1.1; // More energy for temperature regulation
        break;
      case 'mixed':
        multiplier *= 1.05;
        break;
      case 'indoor':
      default:
        // No adjustment
        break;
    }

    // Climate adjustment
    switch (climate) {
      case 'cold':
        multiplier *= 1.1; // More energy for warmth
        break;
      case 'hot':
        multiplier *= 0.95; // Reduced appetite in heat
        break;
      case 'moderate':
      default:
        // No adjustment
        break;
    }

    // Health condition adjustments
    switch (healthConditions) {
      case 'diabetes':
        multiplier *= 0.9; // Often need weight management
        break;
      case 'kidney':
        multiplier *= 0.95; // May need restricted diet
        break;
      case 'heart':
        multiplier *= 0.9; // Weight management important
        break;
      case 'arthritis':
        multiplier *= 0.85; // Reduced activity
        break;
      case 'thyroid':
        // Depends on hyper vs hypo - no standard adjustment
        break;
      case 'digestive':
        multiplier *= 0.95; // May need easily digestible food
        break;
    }

    return Math.round(multiplier * 100) / 100; // Round to 2 decimal places
  }

  function adjustForWeightGoal(der, weightGoal, bodyCondition) {
    switch (weightGoal) {
      case 'lose':
        return Math.round(der * 0.75); // 25% reduction for weight loss
      case 'gain':
        return Math.round(der * 1.25); // 25% increase for weight gain
      case 'maintain':
      default:
        // Body condition adjustments for maintenance
        if (bodyCondition) {
          const score = parseInt(bodyCondition);
          if (score <= 3) {
            return Math.round(der * 1.1); // Slightly more for thin pets
          } else if (score >= 7) {
            return Math.round(der * 0.9); // Slightly less for overweight pets
          }
        }
        return Math.round(der);
    }
  }

  function calculateFoodPortions(der, weightKg) {
    // Average calorie content per food type (kcal/unit)
    const calorieContent = {
      dryFood: 350, // kcal per cup
      wetFood: 85,  // kcal per 3oz can
      rawFood: 125, // kcal per oz
      treats: 25    // kcal per treat
    };

    // Calculate portions
    const dryFoodCups = der / calorieContent.dryFood;
    const wetFoodCans = der / calorieContent.wetFood;
    const rawFoodOz = der / calorieContent.rawFood;
    const treatsAllowed = Math.floor(der * 0.1 / calorieContent.treats); // 10% of calories

    return {
      dryFood: Math.round(dryFoodCups * 100) / 100,
      wetFood: Math.round(wetFoodCans * 10) / 10,
      rawFood: Math.round(rawFoodOz * 10) / 10,
      treats: treatsAllowed,
      mixedDry: Math.round((dryFoodCups * 0.5) * 100) / 100,
      mixedWet: Math.round((wetFoodCans * 0.5) * 10) / 10
    };
  }

  function displayResults(data) {
    const treatCalories = Math.round(data.der * 0.1);
    const mealCalories = data.der - treatCalories;

    const petTypeNames = {
      dog: 'Собака',
      cat: 'Кіт',
      rabbit: 'Кролик', 
      'guinea-pig': 'Морська свинка',
      ferret: 'Тхір',
      other: 'Інша тварина'
    };

    const lifeStageNames = {
      'puppy-kitten': 'Цуценя/Кошеня',
      'young-adult': 'Молодий дорослий',
      adult: 'Дорослий',
      senior: 'Літній',
      pregnant: 'Вагітна',
      lactating: 'Годуюча'
    };

    const activityNames = {
      sedentary: 'Малорухливий',
      light: 'Легкий',
      moderate: 'Помірний',
      high: 'Високий',
      'very-high': 'Дуже високий'
    };

    const weightGoalNames = {
      lose: 'Схуднення',
      maintain: 'Підтримання',
      gain: 'Набір ваги'
    };

    let html = `
      <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #4caf50;">
        <h3 style="color: #2e7d32; margin-top: 0; text-align: center;">🐾 Результати розрахунку калорій для ${petTypeNames[data.petType]}</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>🍽️ Щоденні калорії</h6>
            <div class="big-number">${data.der}</div>
            <p class="insight-detail">ккал на день</p>
          </div>
          <div class="insight-card success">
            <h6>🏃 Фактор активності</h6>
            <div class="big-number">${data.derMultiplier}x</div>
            <p class="insight-detail">Множник RER</p>
          </div>
          <div class="insight-card warning">
            <h6>⚖️ Статус ваги</h6>
            <div class="big-number">${data.weightKg.toFixed(1)}</div>
            <p class="insight-detail">кг (${data.weightLbs.toFixed(1)} фунти)</p>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <h3>📊 Детальний розподіл калорій</h3>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>🔄 Енергія спокою (RER):</strong><br>
                ${data.rer} ккал/день<br>
                <small>Базові метаболічні потреби</small>
              </div>
              <div>
                <strong>⚡ Множник активності:</strong><br>
                ${data.derMultiplier}x<br>
                <small>На основі ${activityNames[data.activityLevel]} способу життя</small>
              </div>
              <div>
                <strong>🎯 Корекція цілі:</strong><br>
                ${weightGoalNames[data.weightGoal]} ваги<br>
                <small>Модифіковано для цільової мети</small>
              </div>
              <div>
                <strong>🏃 Бонус вправ:</strong><br>
                ${data.exerciseDuration} хв/день<br>
                <small>Щоденний час активності</small>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <h3>🥘 Посібник з порцій корму</h3>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
              <div style="padding: 1rem; border: 2px solid #2196f3; border-radius: 8px;">
                <h4 style="margin: 0 0 1rem 0; color: #1976d2;">🍪 Сухий корм</h4>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #1976d2;">${data.portions.dryFood} чашок</p>
                <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">на день (350 ккал/чашка)</p>
              </div>
              
              <div style="padding: 1rem; border: 2px solid #ff9800; border-radius: 8px;">
                <h4 style="margin: 0 0 1rem 0; color: #f57c00;">🥫 Вологий корм</h4>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #f57c00;">${data.portions.wetFood} банок</p>
                <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">на день (85 ккал/банка 85г)</p>
              </div>
              
              <div style="padding: 1rem; border: 2px solid #4caf50; border-radius: 8px;">
                <h4 style="margin: 0 0 1rem 0; color: #388e3c;">🍖 Сира дієта</h4>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #388e3c;">${data.portions.rawFood} унцій</p>
                <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">на день (125 ккал/унція)</p>
              </div>
              
              <div style="padding: 1rem; border: 2px solid #9c27b0; border-radius: 8px;">
                <h4 style="margin: 0 0 1rem 0; color: #7b1fa2;">🍎 Ласощі</h4>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #7b1fa2;">${data.portions.treats} штук</p>
                <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">на день (25 ккал/ласощі)</p>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <h3>🥣 Змішане годування</h3>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <p style="margin: 0 0 1rem 0; color: #666;">Якщо ви годуєте комбінацією сухого та вологого корму (50/50):</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div style="text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                <strong>🍪 Сухий корм:</strong><br>
                <span style="font-size: 1.3rem; color: #1976d2; font-weight: bold;">${data.portions.mixedDry} чашок</span>
              </div>
              <div style="text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                <strong>🥫 Вологий корм:</strong><br>
                <span style="font-size: 1.3rem; color: #f57c00; font-weight: bold;">${data.portions.mixedWet} банок</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <h3>🎯 Розподіл калорій</h3>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div style="text-align: center; padding: 1rem; background: #e3f2fd; border-radius: 8px;">
                <strong>🍽️ Основні прийоми їжі:</strong><br>
                <span style="font-size: 1.5rem; color: #1976d2; font-weight: bold;">${mealCalories} ккал</span><br>
                <small>90% від загальних калорій</small>
              </div>
              <div style="text-align: center; padding: 1rem; background: #fce4ec; border-radius: 8px;">
                <strong>🍎 Ласощі та винагороди:</strong><br>
                <span style="font-size: 1.5rem; color: #c2185b; font-weight: bold;">${treatCalories} ккал</span><br>
                <small>10% від загальних калорій</small>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <h3>💡 Важливі поради з годування</h3>
          <div style="background: white; padding: 1.5rem; border-radius: 12px;">
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li><strong>Регулярне зважування:</strong> Зважуйте вашу тварину щотижня та коригуйте порції</li>
              <li><strong>Поступові зміни:</strong> Змінюйте кількість корму поступово протягом тижня</li>
              <li><strong>Ласощі рахуються:</strong> Включайте всі ласощі у щоденний підрахунок калорій</li>
              <li><strong>Свіжа вода:</strong> Завжди забезпечуйте доступ до чистої, свіжої води</li>
              <li><strong>Консультація ветеринара:</strong> Обговорюйте зміни дієти з вашим ветеринаром</li>
              <li><strong>Моніторинг стану тіла:</strong> Регулярно оцінюйте стан тіла вашої тварини</li>
            </ul>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            🐾 <strong>Пам'ятайте:</strong> Це загальні рекомендації. Завжди консультуйтеся з ветеринаром для персоналізованих порад щодо харчування!
          </p>
        </div>
      </div>
    `;

    result.innerHTML = html;
  }
});