document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('vegan-protein-form');
  const result = document.getElementById('vegan-protein-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const age = +form.age.value;
    const gender = form.gender.value;
    const dietType = form['diet-type'].value;
    const dietDuration = form['diet-duration'].value;
    const activityLevel = form['activity-level'].value;
    const primaryGoal = form['primary-goal'].value;
    const cookingFrequency = form['cooking-frequency'].value;
    const supplements = form.supplements.value;
    const foodBudget = form['food-budget'].value;
    
    // Get arrays
    const exerciseTypes = Array.from(form.querySelectorAll('input[name="exercise-types"]:checked')).map(input => input.value);
    const specialConditions = Array.from(form.querySelectorAll('input[name="special-conditions"]:checked')).map(input => input.value);
    const proteinSources = Array.from(form.querySelectorAll('input[name="protein-sources"]:checked')).map(input => input.value);

    // Validation
    if (!weightInput || !age || !gender || !dietType || !dietDuration || !activityLevel || 
        !primaryGoal || !cookingFrequency || !supplements || !foodBudget) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    // Convert weight to kg
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Calculate protein requirements
    const proteinNeeds = calculateProteinNeeds(weight, age, gender, activityLevel, primaryGoal, specialConditions, exerciseTypes);
    
    // Generate meal recommendations
    const mealRecommendations = generateMealRecommendations(proteinNeeds, proteinSources, dietType, cookingFrequency, foodBudget);
    
    // Generate supplement recommendations
    const supplementRecommendations = generateSupplementRecommendations(supplements, dietType, specialConditions, exerciseTypes);
    
    // Calculate distribution throughout day
    const proteinDistribution = calculateProteinDistribution(proteinNeeds.total, exerciseTypes);
    
    // Generate specific tips based on user profile
    const personalizedTips = generatePersonalizedTips(dietDuration, proteinSources, specialConditions, primaryGoal);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваш персоналізований план веганського білка</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;">
              <div style="background:#157aff;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${Math.round(proteinNeeds.total)}г
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Щоденна потреба в білку</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#28a745;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${proteinNeeds.perKg.toFixed(1)} г/кг
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Білка на кг ваги</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#fd7e14;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${getDietTypeDisplay(dietType)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Тип дієти</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">📊 Розподіл білка протягом дня</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            ${Object.entries(proteinDistribution).map(([meal, amount]) => `
              <div style="background:#e8f4fd;padding:15px;border-radius:6px;text-align:center;">
                <div style="font-weight:bold;color:#157aff;margin-bottom:5px;">${getMealName(meal)}</div>
                <div style="font-size:1.2em;font-weight:bold;color:#157aff;">${Math.round(amount)}г</div>
                <div style="font-size:0.8em;color:#666;margin-top:5px;">білка</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">🌱 Рекомендовані джерела білка</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:15px;">
            ${mealRecommendations.sources.map(source => `
              <div style="background:#d4edda;padding:15px;border-radius:6px;">
                <div style="font-weight:bold;color:#155724;margin-bottom:8px;">${source.name}</div>
                <div style="font-size:0.9em;color:#155724;margin-bottom:8px;">${source.protein} білка на порцію</div>
                <div style="font-size:0.8em;color:#6c757d;">
                  <strong>Порція:</strong> ${source.serving}<br>
                  <strong>Переваги:</strong> ${source.benefits}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">🍽️ Приклади страв</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${mealRecommendations.meals.map(meal => `
              <div style="background:#fff3cd;padding:15px;border-radius:6px;">
                <div style="font-weight:bold;color:#856404;margin-bottom:8px;">${meal.name}</div>
                <div style="font-size:0.9em;color:#856404;margin-bottom:8px;">~${meal.protein}г білка</div>
                <div style="font-size:0.8em;color:#6c757d;">
                  <strong>Інгредієнти:</strong> ${meal.ingredients}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">💊 Рекомендації щодо добавок</h4>
          <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
            <ul style="margin:0;color:#666;list-style-type:none;padding:0;">
              ${supplementRecommendations.map(rec => `
                <li style="margin:8px 0;padding:8px;background:white;border-radius:4px;border-left:4px solid #6f42c1;">
                  <strong>${rec.name}:</strong> ${rec.description}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#dc3545;">🎯 Персоналізовані поради</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${personalizedTips.map(tip => `
              <div style="background:#f8d7da;padding:15px;border-radius:6px;border-left:4px solid #dc3545;">
                <div style="font-weight:bold;color:#721c24;margin-bottom:5px;">${tip.title}</div>
                <div style="font-size:0.9em;color:#721c24;">${tip.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #17a2b8;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Швидкі поради</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="color:#0c5460;">
              <strong>🥜 Комбінування:</strong> Поєднуйте зерна з бобовими для повноцінного білка
            </div>
            <div style="color:#0c5460;">
              <strong>⏰ Час:</strong> Розподіляйте білок рівномірно протягом дня
            </div>
            <div style="color:#0c5460;">
              <strong>🔍 Якість:</strong> Фокусуйтесь на цільних, необроблених продуктах
            </div>
            <div style="color:#0c5460;">
              <strong>💧 Приготування:</strong> Замочуйте бобові для кращого засвоєння
            </div>
          </div>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">⚠️ Важливі нагадування</h4>
          <ul style="color:#383d41;margin:10px 0;">
            <li>Різноманітність - ключ до отримання всіх амінокислот</li>
            <li>B12 критично важливий - обов'язково приймайте добавку</li>
            <li>Слідкуйте за рівнями заліза, цинку та вітаміну D</li>
            <li>Поступово збільшуйте споживання клітковини</li>
            <li>Консультуйтесь з дієтологом при серйозних змінах дієти</li>
            <li>Регулярно перевіряйте аналізи крові</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function calculateProteinNeeds(weight, age, gender, activityLevel, goal, specialConditions, exerciseTypes) {
    // Base protein requirements (g/kg body weight)
    let baseProteinPerKg = 0.8; // RDA baseline

    // Adjust for activity level
    const activityMultipliers = {
      'sedentary': 1.0,
      'lightly-active': 1.2,
      'moderately-active': 1.4,
      'very-active': 1.6,
      'extremely-active': 1.8
    };
    baseProteinPerKg *= activityMultipliers[activityLevel];

    // Adjust for exercise type
    if (exerciseTypes.includes('strength')) {
      baseProteinPerKg += 0.3;
    }
    if (exerciseTypes.includes('endurance')) {
      baseProteinPerKg += 0.2;
    }

    // Adjust for goal
    const goalAdjustments = {
      'maintain': 1.0,
      'weight-loss': 1.2,
      'muscle-gain': 1.4,
      'athletic-performance': 1.3,
      'general-health': 1.0,
      'recovery': 1.3
    };
    baseProteinPerKg *= goalAdjustments[goal];

    // Adjust for special conditions
    if (specialConditions.includes('pregnancy')) {
      baseProteinPerKg += 0.4;
    }
    if (specialConditions.includes('breastfeeding')) {
      baseProteinPerKg += 0.5;
    }
    if (specialConditions.includes('elderly')) {
      baseProteinPerKg += 0.2;
    }

    // Plant-based adjustment (10-15% higher for lower digestibility)
    baseProteinPerKg *= 1.15;

    // Age adjustment
    if (age > 65) {
      baseProteinPerKg += 0.2;
    }

    // Gender adjustment (males typically need slightly more)
    if (gender === 'male') {
      baseProteinPerKg *= 1.05;
    }

    const totalProtein = weight * baseProteinPerKg;

    return {
      total: totalProtein,
      perKg: baseProteinPerKg,
      adjustments: {
        activity: activityMultipliers[activityLevel],
        goal: goalAdjustments[goal],
        plantBased: 1.15
      }
    };
  }

  function calculateProteinDistribution(totalProtein, exerciseTypes) {
    // Post-workout considerations
    const hasStrength = exerciseTypes.includes('strength');
    const hasEndurance = exerciseTypes.includes('endurance');
    
    if (hasStrength || hasEndurance) {
      return {
        breakfast: totalProtein * 0.25,
        lunch: totalProtein * 0.25,
        dinner: totalProtein * 0.30,
        postWorkout: totalProtein * 0.20
      };
    } else {
      return {
        breakfast: totalProtein * 0.25,
        lunch: totalProtein * 0.35,
        dinner: totalProtein * 0.30,
        snacks: totalProtein * 0.10
      };
    }
  }

  function generateMealRecommendations(proteinNeeds, currentSources, dietType, cookingFrequency, foodBudget) {
    const sources = [
      {
        name: 'Квасоля та сочевиця',
        protein: '15-18г на склянку',
        serving: '1 склянка приготованої',
        benefits: 'Високий вміст клітковини, залоза, фолату'
      },
      {
        name: 'Тофу та темпе',
        protein: '20-30г на порцію',
        serving: '150г',
        benefits: 'Повноцінний білок, кальцій, пробіотики (темпе)'
      },
      {
        name: 'Кіноа',
        protein: '8г на склянку',
        serving: '1 склянка приготованої',
        benefits: 'Повноцінний білок, магній, клітковина'
      },
      {
        name: 'Горіхи та насіння',
        protein: '15-20г на порцію',
        serving: '30г (жменя)',
        benefits: 'Здорові жири, вітамін E, мінерали'
      },
      {
        name: 'Нут',
        protein: '15г на склянку',
        serving: '1 склянка приготованого',
        benefits: 'Клітковина, фолат, марганець'
      },
      {
        name: 'Гречка',
        protein: '6г на склянку',
        serving: '1 склянка приготованої',
        benefits: 'Повноцінний білок, магній, рутин'
      }
    ];

    const meals = [
      {
        name: 'Сніданок: Овсянка з мигдалем',
        protein: '15-18',
        ingredients: 'Овес, мигдальне молоко, мигдаль, чіа насіння'
      },
      {
        name: 'Обід: Салат з нутом',
        protein: '20-25',
        ingredients: 'Нут, кіноа, овочі, тахіні заправка'
      },
      {
        name: 'Вечеря: Тофу стір-фрай',
        protein: '25-30',
        ingredients: 'Тофу, овочі, коричневий рис, соєвий соус'
      },
      {
        name: 'Перекус: Хумус з овочами',
        protein: '8-10',
        ingredients: 'Хумус, морква, болгарський перець'
      }
    ];

    return {
      sources: sources.slice(0, 6),
      meals: meals
    };
  }

  function generateSupplementRecommendations(currentSupplements, dietType, specialConditions, exerciseTypes) {
    const recommendations = [];

    // Essential for all vegans
    if (currentSupplements === 'none' || !currentSupplements.includes('b12')) {
      recommendations.push({
        name: 'Вітамін B12',
        description: 'КРИТИЧНО ВАЖЛИВО: 250 мкг щодня або 2500 мкг щотижня. Не знаходиться в рослинних продуктах.'
      });
    }

    // Common deficiencies
    if (!currentSupplements.includes('comprehensive')) {
      recommendations.push({
        name: 'Вітамін D3',
        description: '2000-4000 МО щодня, особливо взимку. Веганська версія з лишайників.'
      });

      recommendations.push({
        name: 'Омега-3 (EPA/DHA)',
        description: 'З водоростей, 300-600 мг щодня для здоров\'я мозку та серця.'
      });
    }

    // For athletes or strength training
    if (exerciseTypes.includes('strength') || exerciseTypes.includes('endurance')) {
      recommendations.push({
        name: 'Креатин',
        description: '3-5г щодня для покращення силових показників (креатин з рослинних джерел).'
      });

      if (currentSupplements !== 'protein-powder') {
        recommendations.push({
          name: 'Рослинний протеїн',
          description: 'Гороховий, рисовий або конопляний протеїн. 20-30г після тренування.'
        });
      }
    }

    // Special conditions
    if (specialConditions.includes('pregnancy') || specialConditions.includes('breastfeeding')) {
      recommendations.push({
        name: 'Пренатальні вітаміни',
        description: 'Спеціальні веганські пренатальні добавки з фолатом, залізом, кальцієм.'
      });
    }

    // Iron for women
    recommendations.push({
      name: 'Залізо (за потребою)',
      description: 'Особливо для жінок. Перевіряйте рівні та приймайте з вітаміном C.'
    });

    return recommendations.slice(0, 6);
  }

  function generatePersonalizedTips(dietDuration, proteinSources, specialConditions, goal) {
    const tips = [];

    // Based on diet duration
    if (dietDuration === 'new') {
      tips.push({
        title: 'Новачок у веганстві',
        description: 'Поступово збільшуйте споживання бобових. Експериментуйте з різними джерелами білка щотижня.'
      });
    }

    // Based on protein sources
    if (proteinSources.length < 4) {
      tips.push({
        title: 'Розширте джерела білка',
        description: 'Додайте більше різноманітності: темпе, насіння конопель, харчові дріжджі, спіруліну.'
      });
    }

    // Based on goal
    if (goal === 'muscle-gain') {
      tips.push({
        title: 'Набір м\'язової маси',
        description: 'Їжте білок протягом 30-60 хвилин після тренування. Розгляньте лейцин добавки.'
      });
    }

    if (goal === 'weight-loss') {
      tips.push({
        title: 'Схуднення',
        description: 'Білок допомагає відчувати ситість. Включайте білок у кожен прийом їжі та перекус.'
      });
    }

    // Special conditions
    if (specialConditions.includes('digestive-issues')) {
      tips.push({
        title: 'Проблеми з травленням',
        description: 'Замочуйте бобові на ніч, готуйте добре. Починайте з невеликих порцій та поступово збільшуйте.'
      });
    }

    // General tips if not many specific ones
    if (tips.length < 3) {
      tips.push({
        title: 'Поєднання амінокислот',
        description: 'Їжте різні джерела білка протягом дня: зерна + бобові = повноцінний білок.'
      });

      tips.push({
        title: 'Планування страв',
        description: 'Готуйте бобові порціями наперед. Заморожуйте приготовані страви для зручності.'
      });
    }

    return tips.slice(0, 4);
  }

  function getDietTypeDisplay(dietType) {
    const types = {
      'vegan': 'Веганська',
      'vegetarian': 'Вегетаріанська',
      'pescatarian': 'Пескатаріанська',
      'flexitarian': 'Флекситаріанська',
      'transitioning': 'Перехід'
    };
    return types[dietType] || dietType;
  }

  function getMealName(meal) {
    const names = {
      'breakfast': 'Сніданок',
      'lunch': 'Обід',
      'dinner': 'Вечеря',
      'snacks': 'Перекуси',
      'postWorkout': 'Після тренування'
    };
    return names[meal] || meal;
  }
});