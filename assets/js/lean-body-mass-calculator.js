document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('lean-body-mass-form');
  const result = document.getElementById('lean-body-mass-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const gender = form.gender.value;
    const age = +form.age.value;
    const height = +form.height.value;
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const bodyFatPercent = +form['body-fat'].value;
    const measurementMethod = form['measurement-method'].value;
    const activityLevel = form['activity-level'].value;
    const strengthTraining = +form['strength-training'].value;
    const goal = form.goal.value;

    // Validation
    if (!gender || !age || !height || !weightInput || !bodyFatPercent || !activityLevel || strengthTraining === '' || !goal) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    // Convert weight to kg
    const weightKg = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Calculate lean body mass
    const fatMass = (bodyFatPercent / 100) * weightKg;
    const leanBodyMass = weightKg - fatMass;

    // Calculate BMI for comparison
    const heightM = height / 100;
    const bmi = weightKg / (heightM * heightM);

    // Calculate LBM percentage
    const lbmPercentage = (leanBodyMass / weightKg) * 100;

    // Determine normal ranges based on age and gender
    let normalRange, category, categoryColor, categoryDescription;
    
    if (gender === 'male') {
      if (age <= 25) normalRange = '75-85%';
      else if (age <= 35) normalRange = '73-83%';
      else if (age <= 45) normalRange = '70-80%';
      else if (age <= 55) normalRange = '67-77%';
      else normalRange = '65-75%';
      
      if (lbmPercentage >= 80) {
        category = 'Відмінний';
        categoryColor = '#28a745';
        categoryDescription = 'Відмінний рівень безжирової маси. Високий вміст м\'язів та низький відсоток жиру.';
      } else if (lbmPercentage >= 75) {
        category = 'Добрий';
        categoryColor = '#17a2b8';
        categoryDescription = 'Добрий рівень безжирової маси. Здорова композиція тіла з хорошим м\'язовим розвитком.';
      } else if (lbmPercentage >= 70) {
        category = 'Середній';
        categoryColor = '#ffc107';
        categoryDescription = 'Середній рівень безжирової маси. Є можливості для покращення через тренування.';
      } else if (lbmPercentage >= 65) {
        category = 'Нижче середнього';
        categoryColor = '#fd7e14';
        categoryDescription = 'Нижче середнього рівня. Рекомендуються силові тренування та збільшення м\'язової маси.';
      } else {
        category = 'Низький';
        categoryColor = '#dc3545';
        categoryDescription = 'Низький рівень безжирової маси. Необхідні значні зміни в тренуваннях та харчуванні.';
      }
    } else {
      if (age <= 25) normalRange = '65-75%';
      else if (age <= 35) normalRange = '63-73%';
      else if (age <= 45) normalRange = '60-70%';
      else if (age <= 55) normalRange = '57-67%';
      else normalRange = '55-65%';
      
      if (lbmPercentage >= 70) {
        category = 'Відмінний';
        categoryColor = '#28a745';
        categoryDescription = 'Відмінний рівень безжирової маси. Високий вміст м\'язів та низький відсоток жиру.';
      } else if (lbmPercentage >= 65) {
        category = 'Добрий';
        categoryColor = '#17a2b8';
        categoryDescription = 'Добрий рівень безжирової маси. Здорова композиція тіла з хорошим м\'язовим розвитком.';
      } else if (lbmPercentage >= 60) {
        category = 'Середній';
        categoryColor = '#ffc107';
        categoryDescription = 'Середній рівень безжирової маси. Є можливості для покращення через тренування.';
      } else if (lbmPercentage >= 55) {
        category = 'Нижче середнього';
        categoryColor = '#fd7e14';
        categoryDescription = 'Нижче середнього рівня. Рекомендуються силові тренування та збільшення м\'язової маси.';
      } else {
        category = 'Низький';
        categoryColor = '#dc3545';
        categoryDescription = 'Низький рівень безжирової маси. Необхідні значні зміни в тренуваннях та харчуванні.';
      }
    }

    // Calculate metabolic rate based on LBM
    const basalMetabolicRate = gender === 'male' ? 
      leanBodyMass * 23 : leanBodyMass * 21;
    
    // Activity multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'high': 1.725,
      'extreme': 1.9
    };
    
    const totalDailyExpenditure = basalMetabolicRate * activityMultipliers[activityLevel];

    // Calculate protein needs
    const proteinNeeds = {
      maintenance: leanBodyMass * 1.6,
      building: leanBodyMass * 2.2,
      cutting: leanBodyMass * 2.6
    };

    // Generate recommendations based on goal
    let recommendations = [];
    let calorieAdjustment = '';
    
    switch (goal) {
      case 'build':
        recommendations.push('📈 Створіть калорійний профіцит 300-500 ккал для росту м\'язів');
        recommendations.push('🥩 Споживайте ' + proteinNeeds.building.toFixed(0) + ' г протеїну на день');
        recommendations.push('🏋️ Збільшіть силові тренування до 4-5 разів на тиждень');
        calorieAdjustment = `Для набору м'язової маси: ${(totalDailyExpenditure + 400).toFixed(0)} ккал/день`;
        break;
      case 'lose':
        recommendations.push('🔥 Створіть помірний калорійний дефіцит 300-500 ккал');
        recommendations.push('🥩 Споживайте ' + proteinNeeds.cutting.toFixed(0) + ' г протеїну на день для збереження м\'язів');
        recommendations.push('💪 Продовжуйте силові тренування під час схуднення');
        calorieAdjustment = `Для схуднення зі збереженням м'язів: ${(totalDailyExpenditure - 400).toFixed(0)} ккал/день`;
        break;
      case 'recomp':
        recommendations.push('⚖️ Дотримуйтесь калорійного балансу з високим протеїном');
        recommendations.push('🥩 Споживайте ' + proteinNeeds.building.toFixed(0) + ' г протеїну на день');
        recommendations.push('🔄 Поєднуйте силові тренування з помірним кардіо');
        calorieAdjustment = `Для рекомпозиції тіла: ${totalDailyExpenditure.toFixed(0)} ккал/день`;
        break;
      default:
        recommendations.push('🥩 Споживайте ' + proteinNeeds.maintenance.toFixed(0) + ' г протеїну на день');
        calorieAdjustment = `Для підтримання: ${totalDailyExpenditure.toFixed(0)} ккал/день`;
    }
    
    if (strengthTraining < 3) {
      recommendations.push('📅 Збільшіть частоту силових тренувань до 3-4 разів на тиждень');
    }
    
    if (bodyFatPercent > (gender === 'male' ? 25 : 30)) {
      recommendations.push('🏃 Додайте кардіо-тренування для зниження відсотка жиру');
    }
    
    if (bodyFatPercent < (gender === 'male' ? 8 : 16)) {
      recommendations.push('⚠️ Відсоток жиру дуже низький - може вплинути на здоров\'я та гормони');
    }

    // Universal recommendations
    recommendations.push('😴 Забезпечте 7-9 годин якісного сну для відновлення м\'язів');
    recommendations.push('💧 Пийте ' + (leanBodyMass * 35).toFixed(0) + ' мл води на день');

    // Method names
    const methodNames = {
      'bioimpedance': 'Біоімпеданс',
      'calipers': 'Калібри',
      'dexa': 'DEXA сканування',
      'visual': 'Візуальна оцінка',
      'photo': 'Порівняння з фото',
      'underwater': 'Подводне зважування',
      'bodpod': 'BOD POD',
      'other': 'Інший метод'
    };

    const activityNames = {
      'sedentary': 'Малорухливий',
      'light': 'Легка активність',
      'moderate': 'Помірна активність',
      'high': 'Висока активність',
      'extreme': 'Екстремальна активність'
    };

    const goalNames = {
      'maintain': 'Підтримання форми',
      'build': 'Набір м\'язової маси',
      'lose': 'Схуднення',
      'recomp': 'Рекомпозиція тіла',
      'strength': 'Збільшення сили',
      'health': 'Покращення здоров\'я'
    };

    result.innerHTML = `
      <div class="mental-health-results">
        <h3 style="color:#157aff;margin-top:0;text-align:center;">💪 Аналіз безжирової маси тіла</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>⚖️ Безжирова маса</h6>
            <div class="big-number" style="color: ${categoryColor};">${leanBodyMass.toFixed(1)}</div>
            <p>кг</p>
          </div>
          
          <div class="insight-card info">
            <h6>📊 Відсоток LBM</h6>
            <div class="big-number" style="color: ${categoryColor};">${lbmPercentage.toFixed(1)}</div>
            <p>% від загальної ваги</p>
          </div>
          
          <div class="insight-card ${lbmPercentage >= (gender === 'male' ? 75 : 65) ? 'success' : lbmPercentage >= (gender === 'male' ? 65 : 55) ? 'warning' : 'info'}" style="border-color: ${categoryColor};">
            <h6>🏆 Категорія</h6>
            <div class="result-value" style="color: ${categoryColor};">${category}</div>
            <p>рівень LBM</p>
          </div>
        </div>

        <div class="insight-card ${lbmPercentage >= (gender === 'male' ? 75 : 65) ? 'success' : lbmPercentage >= (gender === 'male' ? 65 : 55) ? 'warning' : 'info'}" style="margin: 20px 0; border-color: ${categoryColor};">
          <h4 style="color: ${categoryColor}; margin: 5px 0; text-align: center;">${category} рівень безжирової маси</h4>
          <p style="margin: 10px 0; text-align: center;">${categoryDescription}</p>
          <div style="text-align: center; margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.8); border-radius: 6px;">
            <strong>Норма для вашого віку та статі: ${normalRange}</strong>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📋 Детальний аналіз композиції тіла</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Загальна вага:</strong> ${weightKg.toFixed(1)} кг
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Безжирова маса:</strong> ${leanBodyMass.toFixed(1)} кг (${lbmPercentage.toFixed(1)}%)
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Жирова маса:</strong> ${fatMass.toFixed(1)} кг (${bodyFatPercent.toFixed(1)}%)
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>ІМТ:</strong> ${bmi.toFixed(1)} кг/м²
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Рівень активності:</strong> ${activityNames[activityLevel]}
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Мета:</strong> ${goalNames[goal]}
            </div>
          </div>
          ${measurementMethod ? `
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 15px; text-align: center;">
            <strong>Метод вимірювання жиру:</strong> ${methodNames[measurementMethod] || measurementMethod}
          </div>
          ` : ''}
        </div>

        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">🔥 Метаболічний аналіз</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong style="color: #155724;">Базовий метаболізм (BMR)</strong>
              <div style="font-size: 1.4em; color: #28a745; margin: 5px 0;">${basalMetabolicRate.toFixed(0)}</div>
              <div style="font-size: 0.9em; color: #666;">ккал/день</div>
              <div style="font-size: 0.8em; color: #666; margin-top: 5px;">На основі LBM</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong style="color: #155724;">Загальні витрати (TDEE)</strong>
              <div style="font-size: 1.4em; color: #28a745; margin: 5px 0;">${totalDailyExpenditure.toFixed(0)}</div>
              <div style="font-size: 0.9em; color: #666;">ккал/день</div>
              <div style="font-size: 0.8em; color: #666; margin-top: 5px;">З урахуванням активності</div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px; padding: 12px; background: #e8f5e8; border-radius: 8px;">
            <strong style="color: #155724;">${calorieAdjustment}</strong>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">🥩 Потреби в протеїні на основі LBM</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>Підтримання</strong>
              <div style="font-size: 1.3em; color: #17a2b8; margin: 5px 0;">${proteinNeeds.maintenance.toFixed(0)} г</div>
              <div style="font-size: 0.8em; color: #666;">1.6 г на кг LBM</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>Ріст м'язів</strong>
              <div style="font-size: 1.3em; color: #28a745; margin: 5px 0;">${proteinNeeds.building.toFixed(0)} г</div>
              <div style="font-size: 0.8em; color: #666;">2.2 г на кг LBM</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>Схуднення</strong>
              <div style="font-size: 1.3em; color: #ffc107; margin: 5px 0;">${proteinNeeds.cutting.toFixed(0)} г</div>
              <div style="font-size: 0.8em; color: #666;">2.6 г на кг LBM</div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card warning" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #e65100;">🎯 Персональні рекомендації</h4>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">📈 План оптимізації безжирової маси</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">💪 Силові тренування:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>3-5 тренувань на тиждень</li>
                <li>Складні вправи: присідання, тяга, жим</li>
                <li>8-12 повторень для гіпертрофії</li>
                <li>Прогресивне збільшення навантаження</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🍽️ Харчування:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Якісний протеїн в кожному прийомі</li>
                <li>20-40 г протеїну за раз</li>
                <li>Рівномірний розподіл протягом дня</li>
                <li>Достатні калорії для цілей</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">😴 Відновлення:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>7-9 годин якісного сну</li>
                <li>48-72 години відпочинку між тренуваннями груп</li>
                <li>Управління стресом</li>
                <li>Достатня гідратація</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">📊 Моніторинг:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Щомісячні вимірювання композиції</li>
                <li>Відстеження силових показників</li>
                <li>Фото прогресу</li>
                <li>Обхвати тіла</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📊 Вікові норми безжирової маси</h4>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
              <thead>
                <tr style="background: var(--accent); color: white;">
                  <th style="padding: 10px; border: 1px solid #ddd;">Вік</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Чоловіки (%)</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Жінки (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: ${age <= 25 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age <= 25 ? 'bold' : 'normal'};">18-25</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age <= 25 ? 'bold' : 'normal'};">75-85%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age <= 25 ? 'bold' : 'normal'};">65-75%</td>
                </tr>
                <tr style="background: ${age > 25 && age <= 35 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 25 && age <= 35 ? 'bold' : 'normal'};">26-35</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 25 && age <= 35 ? 'bold' : 'normal'};">73-83%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 25 && age <= 35 ? 'bold' : 'normal'};">63-73%</td>
                </tr>
                <tr style="background: ${age > 35 && age <= 45 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 35 && age <= 45 ? 'bold' : 'normal'};">36-45</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 35 && age <= 45 ? 'bold' : 'normal'};">70-80%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 35 && age <= 45 ? 'bold' : 'normal'};">60-70%</td>
                </tr>
                <tr style="background: ${age > 45 && age <= 55 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 45 && age <= 55 ? 'bold' : 'normal'};">46-55</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 45 && age <= 55 ? 'bold' : 'normal'};">67-77%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 45 && age <= 55 ? 'bold' : 'normal'};">57-67%</td>
                </tr>
                <tr style="background: ${age > 55 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 55 ? 'bold' : 'normal'};">56+</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 55 ? 'bold' : 'normal'};">65-75%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 55 ? 'bold' : 'normal'};">55-65%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="disclaimer" style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💪 <strong>Важливо:</strong> Розрахунки базуються на введених даних про відсоток жиру. Точність результатів залежить від точності вимірювання композиції тіла. 
            Для найточніших результатів рекомендується професійне DEXA сканування або інші лабораторні методи.
          </p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});