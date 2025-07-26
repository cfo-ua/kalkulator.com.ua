document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('fitness-age-form');
  const result = document.getElementById('fitness-age-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const height = +form.height.value;
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const restingHR = form['resting-hr'].value ? +form['resting-hr'].value : null;
    const exerciseFreq = +form['exercise-frequency'].value;
    const exerciseType = form['exercise-type'].value;
    const exerciseDuration = +form['exercise-duration'].value;
    const exerciseIntensity = form['exercise-intensity'].value;
    const strengthTraining = form['strength-training'].value;
    const healthStatus = form['health-status'].value;
    const smoking = form.smoking.value;
    const dailyActivity = form['daily-activity'].value;

    // Validation
    if (!age || !gender || !height || !weightInput || exerciseFreq === '' || 
        !exerciseType || exerciseDuration === '' || !exerciseIntensity || 
        !strengthTraining || !healthStatus || !smoking || !dailyActivity) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    // Convert units
    const heightCm = height;
    const weightKg = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Calculate BMI
    const bmi = weightKg / Math.pow(heightCm / 100, 2);

    // Estimate VO2 max based on various factors
    let estimatedVO2max;
    
    // Base VO2 max by age and gender (sedentary population)
    let baseVO2max;
    if (gender === 'male') {
      baseVO2max = 47.0 - (0.37 * age); // Male baseline
    } else {
      baseVO2max = 42.0 - (0.31 * age); // Female baseline
    }

    // Adjust for exercise frequency and intensity
    let exerciseMultiplier = 1.0;
    if (exerciseFreq === 0) {
      exerciseMultiplier = 0.85; // Sedentary penalty
    } else {
      // Base multiplier from frequency
      const freqMultipliers = [0.85, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
      exerciseMultiplier = freqMultipliers[exerciseFreq];
      
      // Adjust for intensity
      const intensityMultipliers = {
        'none': 0.85,
        'light': 1.0,
        'moderate': 1.1,
        'vigorous': 1.25,
        'high': 1.4
      };
      exerciseMultiplier *= intensityMultipliers[exerciseIntensity];
      
      // Adjust for duration
      if (exerciseDuration >= 60) exerciseMultiplier *= 1.1;
      else if (exerciseDuration >= 45) exerciseMultiplier *= 1.05;
      else if (exerciseDuration <= 15) exerciseMultiplier *= 0.9;
    }

    // Exercise type adjustments
    const typeMultipliers = {
      'none': 0.85,
      'walking': 1.0,
      'jogging': 1.2,
      'cycling': 1.15,
      'swimming': 1.25,
      'weights': 1.05,
      'sports': 1.2,
      'fitness-classes': 1.1,
      'mixed': 1.15
    };
    exerciseMultiplier *= typeMultipliers[exerciseType];

    // Strength training bonus
    const strengthMultipliers = {
      'never': 1.0,
      'rarely': 1.02,
      'weekly': 1.05,
      'regular': 1.1
    };
    exerciseMultiplier *= strengthMultipliers[strengthTraining];

    // Apply exercise adjustments
    estimatedVO2max = baseVO2max * exerciseMultiplier;

    // Adjust for health status
    const healthMultipliers = {
      'excellent': 1.05,
      'good': 1.0,
      'fair': 0.9,
      'poor': 0.8
    };
    estimatedVO2max *= healthMultipliers[healthStatus];

    // Adjust for smoking
    const smokingMultipliers = {
      'never': 1.0,
      'former': 0.95,
      'recent-quit': 0.9,
      'current': 0.8
    };
    estimatedVO2max *= smokingMultipliers[smoking];

    // Adjust for daily activity
    const activityMultipliers = {
      'sedentary': 0.95,
      'light': 1.0,
      'moderate': 1.05,
      'active': 1.1
    };
    estimatedVO2max *= activityMultipliers[dailyActivity];

    // BMI adjustment (optimal BMI range gets bonus)
    if (bmi >= 18.5 && bmi <= 24.9) {
      estimatedVO2max *= 1.0; // Optimal range
    } else if (bmi >= 25 && bmi <= 29.9) {
      estimatedVO2max *= 0.95; // Overweight
    } else if (bmi >= 30) {
      estimatedVO2max *= 0.85; // Obese
    } else {
      estimatedVO2max *= 0.9; // Underweight
    }

    // Resting heart rate adjustment (if provided)
    if (restingHR) {
      if (restingHR <= 60) estimatedVO2max *= 1.1; // Excellent
      else if (restingHR <= 70) estimatedVO2max *= 1.05; // Good
      else if (restingHR <= 80) estimatedVO2max *= 1.0; // Average
      else if (restingHR <= 90) estimatedVO2max *= 0.95; // Below average
      else estimatedVO2max *= 0.9; // Poor
    }

    // Calculate fitness age based on VO2 max
    // Using regression to find age where VO2 max matches current estimated value
    let fitnessAge;
    if (gender === 'male') {
      // Solve: estimatedVO2max = 47.0 - (0.37 * fitnessAge)
      fitnessAge = (47.0 - estimatedVO2max) / 0.37;
    } else {
      // Solve: estimatedVO2max = 42.0 - (0.31 * fitnessAge)
      fitnessAge = (42.0 - estimatedVO2max) / 0.31;
    }

    // Ensure reasonable bounds
    fitnessAge = Math.max(18, Math.min(100, fitnessAge));

    // Calculate difference from chronological age
    const ageDifference = fitnessAge - age;

    // Determine fitness level category
    let fitnessLevel, levelColor, levelDescription;
    if (ageDifference <= -10) {
      fitnessLevel = 'Винятковий';
      levelColor = '#28a745';
      levelDescription = 'Ваш рівень фізичної форми винятковий! Ваше серцево-судинне здоров\'я на рівні набагато молодшої людини.';
    } else if (ageDifference <= -5) {
      fitnessLevel = 'Відмінний';
      levelColor = '#6f9f6f';
      levelDescription = 'Відмінний рівень фізичної форми! Ваша серцево-судинна система функціонує краще за середній показник для вашого віку.';
    } else if (ageDifference <= -2) {
      fitnessLevel = 'Добрий';
      levelColor = '#17a2b8';
      levelDescription = 'Добрий рівень фізичної форми. Ви в кращій формі, ніж більшість людей вашого віку.';
    } else if (ageDifference <= 2) {
      fitnessLevel = 'Середній';
      levelColor = '#ffc107';
      levelDescription = 'Середній рівень фізичної форми для вашого віку. Є можливості для покращення через регулярні тренування.';
    } else if (ageDifference <= 5) {
      fitnessLevel = 'Нижче середнього';
      levelColor = '#fd7e14';
      levelDescription = 'Нижче середнього рівня фізичної форми. Зосередьтеся на збільшенні фізичної активності та серцево-судинних вправах.';
    } else if (ageDifference <= 10) {
      fitnessLevel = 'Поганий';
      levelColor = '#dc3545';
      levelDescription = 'Поганий рівень фізичної форми. Потрібні значні зміни способу життя для покращення здоров\'я.';
    } else {
      fitnessLevel = 'Дуже поганий';
      levelColor = '#721c24';
      levelDescription = 'Дуже поганий рівень фізичної форми. Розгляньте консультацію з лікарем перед початком програми тренувань.';
    }

    // Generate personalized recommendations
    let recommendations = [];
    
    if (exerciseFreq < 3) {
      recommendations.push('🏃 Збільшіть частоту тренувань: Прагніть до принаймні 3-4 днів фізичної активності на тиждень');
    }
    
    if (exerciseIntensity === 'none' || exerciseIntensity === 'light') {
      recommendations.push('💪 Підвищіть інтенсивність тренувань: Включіть помірні та енергійні активності в свій режим');
    }
    
    if (exerciseDuration < 30) {
      recommendations.push('⏱️ Збільшіть тривалість тренувань: Прагніть до 30-60 хвилин на сесію для оптимальних результатів');
    }
    
    if (strengthTraining === 'never' || strengthTraining === 'rarely') {
      recommendations.push('🏋️ Додайте силові тренування: Включіть вправи з опором 2-3 рази на тиждень');
    }
    
    if (bmi >= 25) {
      recommendations.push('⚖️ Управління вагою: Досягнення здорового ІМТ може значно покращити фітнес-вік');
    }
    
    if (restingHR && restingHR > 80) {
      recommendations.push('❤️ Покращіть серцево-судинне здоров\'я: Зосередьтеся на аеробних вправах для зниження пульсу спокою');
    }
    
    if (smoking === 'current') {
      recommendations.push('🚭 Киньте курити: Ця єдина зміна може драматично покращити ваш фітнес-вік');
    }
    
    if (dailyActivity === 'sedentary') {
      recommendations.push('🚶 Збільшіть щоденну активність: Користуйтеся сходами, більше ходіть, регулярно вставайте протягом дня');
    }

    // Add specific exercise recommendations based on current level
    if (exerciseFreq === 0) {
      recommendations.push('🌟 Почніть з ходьби: Розпочніть з 20-30 хвилин швидкої ходьби 3 рази на тиждень');
    } else if (fitnessAge > age + 5) {
      recommendations.push('🎯 Високоінтенсивні інтервали: Додайте HIIT тренування 1-2 рази на тиждень для підвищення серцево-судинної форми');
    }

    // Exercise type names in Ukrainian
    const exerciseTypeNames = {
      'none': 'Не займаюся',
      'walking': 'Ходьба',
      'jogging': 'Біг',
      'cycling': 'Велоспорт',
      'swimming': 'Плавання',
      'weights': 'Силові тренування',
      'sports': 'Командні види спорту',
      'fitness-classes': 'Фітнес-класи',
      'mixed': 'Змішані тренування'
    };

    const healthStatusNames = {
      'excellent': 'Відмінне',
      'good': 'Добре',
      'fair': 'Задовільне',
      'poor': 'Погане'
    };

    result.innerHTML = `
      <div class="mental-health-results">
        <h3 style="color:#157aff;margin-top:0;text-align:center;">💪 Оцінка вашого фітнес-віку</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📅 Ваш хронологічний вік</h6>
            <div class="big-number">${age}</div>
            <p>років</p>
          </div>
          
          <div class="insight-card ${ageDifference <= 0 ? 'success' : ageDifference <= 5 ? 'warning' : 'info'}" style="border-color: ${levelColor};">
            <h6>💪 Ваш фітнес-вік</h6>
            <div class="big-number" style="color: ${levelColor};">${Math.round(fitnessAge)}</div>
            <p>років</p>
          </div>
          
          <div class="insight-card ${ageDifference <= 0 ? 'success' : ageDifference <= 5 ? 'warning' : 'info'}" style="border-color: ${levelColor};">
            <h6>📊 Різниця</h6>
            <div class="big-number" style="color: ${levelColor};">
              ${ageDifference > 0 ? '+' : ''}${Math.round(ageDifference)}
            </div>
            <p>років</p>
          </div>
        </div>

        <div class="insight-card ${ageDifference <= 0 ? 'success' : ageDifference <= 5 ? 'warning' : 'info'}" style="margin: 20px 0; border-color: ${levelColor};">
          <h4 style="color: ${levelColor}; margin: 5px 0; text-align: center;">${fitnessLevel} рівень фізичної форми</h4>
          <p style="margin: 10px 0; text-align: center;">${levelDescription}</p>
          <div style="font-size: 1.1em; margin-top: 15px; text-align: center; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 6px;">
            ${ageDifference > 0 ? 
              `<span style="color: ${levelColor};">Ви біологічно <strong>${Math.abs(Math.round(ageDifference))} ${Math.abs(Math.round(ageDifference)) === 1 ? 'рік' : Math.abs(Math.round(ageDifference)) < 5 ? 'роки' : 'років'} старші</strong>, ніж за хронологічним віком</span>` :
              ageDifference < 0 ?
              `<span style="color: ${levelColor};">Ви біологічно <strong>${Math.abs(Math.round(ageDifference))} ${Math.abs(Math.round(ageDifference)) === 1 ? 'рік' : Math.abs(Math.round(ageDifference)) < 5 ? 'роки' : 'років'} молодші</strong>, ніж за хронологічним віком</span>` :
              `<span style="color: ${levelColor};">Ваш фітнес-вік відповідає хронологічному віку</span>`
            }
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📋 Деталі оцінки</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>ІМТ:</strong> ${bmi.toFixed(1)} кг/м²
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Оцінений VO2 Max:</strong> ${estimatedVO2max.toFixed(1)} мл/кг/хв
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Частота тренувань:</strong> ${exerciseFreq} днів/тиждень
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Тип активності:</strong> ${exerciseTypeNames[exerciseType]}
            </div>
            ${restingHR ? `
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Пульс спокою:</strong> ${restingHR} уд/хв
            </div>
            ` : ''}
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Стан здоров'я:</strong> ${healthStatusNames[healthStatus]}
            </div>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📊 Порівняння VO2 Max за віком</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; font-size: 0.9em;">
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 6px;">
              <div style="font-weight: bold; color: #dc3545;">Поганий</div>
              <div>< ${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 15) : Math.round(42.0 - (0.31 * age) - 15)}</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 6px;">
              <div style="font-weight: bold; color: #fd7e14;">Задовільний</div>
              <div>${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 15) : Math.round(42.0 - (0.31 * age) - 15)}-${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 5) : Math.round(42.0 - (0.31 * age) - 5)}</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 6px;">
              <div style="font-weight: bold; color: #ffc107;">Середній</div>
              <div>${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 5) : Math.round(42.0 - (0.31 * age) - 5)}-${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 5) : Math.round(42.0 - (0.31 * age) + 5)}</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 6px;">
              <div style="font-weight: bold; color: #17a2b8;">Добрий</div>
              <div>${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 5) : Math.round(42.0 - (0.31 * age) + 5)}-${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 15) : Math.round(42.0 - (0.31 * age) + 15)}</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #e8f5e8; border-radius: 6px;">
              <div style="font-weight: bold; color: #28a745;">Відмінний</div>
              <div>> ${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 15) : Math.round(42.0 - (0.31 * age) + 15)}</div>
            </div>
          </div>
          <div style="text-align: center; margin: 10px 0; padding: 10px; background: #e3f2fd; border-radius: 6px;">
            <strong>Ваш результат: <span style="color: ${levelColor};">${estimatedVO2max.toFixed(1)} мл/кг/хв</span></strong>
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
          <h4 style="margin-top: 0; color: #155724;">🏆 План покращення фітнес-віку</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">💓 Кардіо тренування:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>150+ хвилин помірної активності на тиждень</li>
                <li>75+ хвилин енергійної активності на тиждень</li>
                <li>Включіть HIIT 1-2 рази на тиждень</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">💪 Силові тренування:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>2-3 сесії опору на тиждень</li>
                <li>Зосередження на основних групах м'язів</li>
                <li>Принцип прогресивного навантаження</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🧘 Відновлення та спосіб життя:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>7-9 годин якісного сну</li>
                <li>Техніки управління стресом</li>
                <li>Збалансоване харчування</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">📈 Поради щодо прогресу:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Починайте поступово та нарощуйте</li>
                <li>Відстежуйте свій прогрес</li>
                <li>Переоцінюйте кожні 3-6 місяців</li>
              </ul>
            </div>
          </div>
        </div>

        ${fitnessAge > age + 10 ? `
        <div class="insight-card" style="background: #f8d7da; border-color: #721c24; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #721c24;">⚠️ Важливі рекомендації</h4>
          <ul style="margin: 0; color: #721c24; font-size: 0.9em;">
            <li>Розгляньте консультацію з лікарем перед початком інтенсивних тренувань</li>
            <li>Починайте з низькоінтенсивних активностей та прогресуйте поступово</li>
            <li>Зосередьтеся на постійності, а не інтенсивності спочатку</li>
            <li>Розгляньте роботу з кваліфікованим фітнес-професіоналом</li>
            <li>Моніторьте свою реакцію на тренування та коригуйте відповідно</li>
          </ul>
        </div>
        ` : ''}

        <div class="disclaimer" style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💪 <strong>Пам'ятайте:</strong> Ця оцінка є освітнім інструментом на основі наукових досліджень. Для точної оцінки фізичної форми розгляньте професійне тестування VO2 max. Консультуйтеся з лікарями перед початком нових програм тренувань.
          </p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});