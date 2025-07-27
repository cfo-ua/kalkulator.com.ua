document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('athlete-hydration-needs-form');
  const result = document.getElementById('athlete-hydration-needs-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const sportType = form['sport-type'].value;
    const durationHours = +form['duration-hours'].value;
    const durationMinutes = +(form['duration-minutes'].value || 0);
    const intensity = form.intensity.value;
    const tempInput = +form.temperature.value;
    const tempUnit = form['temp-unit'].value;
    const humidity = form.humidity.value;
    const environment = form.environment.value;
    const sweatRateInput = form['sweat-rate'].value;
    const trainingPhase = form['training-phase'].value;
    const acclimatization = form.acclimatization.value;
    const sessionType = form['session-type'].value;
    const hydrationAccess = form['hydration-access'].value;

    // Validation
    if (!weightInput || !sportType || !durationHours || !intensity || !tempInput || 
        !humidity || !environment || !trainingPhase || !acclimatization || 
        !sessionType || !hydrationAccess) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    // Convert units
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;
    const tempCelsius = tempUnit === 'fahrenheit' ? (tempInput - 32) * 5/9 : tempInput;
    const totalDurationHours = durationHours + (durationMinutes / 60);

    // Estimate sweat rate if not provided
    let sweatRate;
    if (sweatRateInput) {
      sweatRate = +sweatRateInput;
    } else {
      // Base sweat rate calculation (L/hour)
      let baseSweatRate = 0.8; // Starting point for athletes
      
      // Adjust for body weight
      baseSweatRate += (weight - 70) * 0.01;
      
      // Adjust for sport type
      const sportMultipliers = {
        'endurance': 1.3,
        'team-sports': 1.2,
        'strength-power': 1.0,
        'combat': 1.4,
        'racquet': 1.2,
        'water-sports': 0.7, // Less sweat loss in water
        'aesthetic': 1.1,
        'outdoor': 1.2,
        'multiple': 1.2
      };
      baseSweatRate *= sportMultipliers[sportType];
      
      // Adjust for intensity
      const intensityMultipliers = {
        'light': 0.7,
        'moderate': 1.0,
        'vigorous': 1.3,
        'high': 1.5,
        'maximal': 1.7
      };
      baseSweatRate *= intensityMultipliers[intensity];
      
      // Temperature adjustment
      if (tempCelsius > 25) {
        baseSweatRate *= 1.0 + (tempCelsius - 25) * 0.04;
      } else if (tempCelsius < 15) {
        baseSweatRate *= 0.8;
      }
      
      // Humidity adjustment
      const humidityMultipliers = {
        'low': 0.9,
        'moderate': 1.0,
        'high': 1.2,
        'very-high': 1.4
      };
      baseSweatRate *= humidityMultipliers[humidity];
      
      // Environment adjustment
      const environmentMultipliers = {
        'indoor-ac': 0.8,
        'indoor-no-ac': 1.0,
        'outdoor-shade': 1.1,
        'outdoor-sun': 1.3,
        'pool': 0.6,
        'altitude': 1.2
      };
      baseSweatRate *= environmentMultipliers[environment];
      
      // Acclimatization adjustment
      const acclimMultipliers = {
        'none': 1.2,
        'partial': 1.1,
        'full': 1.0,
        'resident': 0.95
      };
      baseSweatRate *= acclimMultipliers[acclimatization];
      
      sweatRate = Math.max(0.5, Math.min(4.0, baseSweatRate));
    }

    // Calculate total fluid losses
    const totalFluidLoss = sweatRate * totalDurationHours;
    
    // Pre-exercise hydration (ml/kg body weight)
    const preExercise4h = weight * 6; // 6ml/kg 4 hours before
    const preExercise2h = weight * 4; // 4ml/kg 2 hours before (if needed)
    const preExercise30min = 250; // 250ml 30 min before

    // During-exercise hydration strategy
    let duringExerciseStrategy = '';
    let targetFluidIntake = 0;
    let sodiumNeeds = 0;
    
    if (totalDurationHours <= 0.5) {
      // Short sessions - minimal during-exercise needs
      targetFluidIntake = 0;
      duringExerciseStrategy = 'Коротка сесія - фокус на гідратацію до та після';
    } else if (totalDurationHours <= 1) {
      // Medium sessions - moderate intake
      targetFluidIntake = totalFluidLoss * 0.5;
      sodiumNeeds = 200 * totalDurationHours;
      duringExerciseStrategy = 'Помірне заміщення рідини під час фізичних навантажень';
    } else {
      // Long sessions - aggressive replacement
      targetFluidIntake = totalFluidLoss * 0.8;
      sodiumNeeds = 400 * totalDurationHours;
      duringExerciseStrategy = 'Агресивне заміщення рідини для відповідності втратам поту';
    }

    // Adjust for hydration access
    const accessMultipliers = {
      'unlimited': 1.0,
      'limited': 0.7,
      'scheduled': 0.6,
      'minimal': 0.3
    };
    targetFluidIntake *= accessMultipliers[hydrationAccess];

    // Post-exercise rehydration (150% of losses)
    const postExerciseFluid = totalFluidLoss * 1.5;
    const postExerciseSodium = totalFluidLoss * 1200; // mg (1.2g per liter)

    // Calculate practical drinking schedule
    const calculateDrinkingSchedule = () => {
      if (targetFluidIntake === 0) return null;
      
      const drinkingOpportunities = Math.max(1, Math.floor(totalDurationHours * 4)); // Every 15 min
      const mlPerOpportunity = Math.round(targetFluidIntake * 1000 / drinkingOpportunities);
      const intervalMinutes = Math.round((totalDurationHours * 60) / drinkingOpportunities);
      
      return {
        frequency: `Кожні ${intervalMinutes} хвилин`,
        volume: `${mlPerOpportunity}мл`,
        opportunities: drinkingOpportunities
      };
    };

    const drinkingSchedule = calculateDrinkingSchedule();

    // Generate recommendations based on conditions
    let recommendations = [];
    
    if (tempCelsius > 30) {
      recommendations.push('🌡️ Попередження про екстремальне тепло: Розгляньте стратегії попереднього охолодження (холодний душ, льодовий жилет)');
    }
    
    if (humidity === 'very-high' && tempCelsius > 25) {
      recommendations.push('💨 Високий тепловий стрес: Зменшіть інтенсивність за можливості, робіть часті перерви');
    }
    
    if (sweatRate > 2.5) {
      recommendations.push('💧 Висока швидкість потовиділення: Ви інтенсивно потієте - надавайте пріоритет заміщенню натрію');
    }
    
    if (sessionType === 'competition') {
      recommendations.push('🏆 День змагань: Дотримуйтеся вашої перевіреної стратегії гідратації, ніяких експериментів');
    }
    
    if (sessionType === 'multiple-sessions') {
      recommendations.push('🔄 Кілька сесій: Повна регідратація між сесіями критична');
    }
    
    if (hydrationAccess === 'limited' || hydrationAccess === 'minimal') {
      recommendations.push('⏰ Обмежений доступ: Максимізуйте прегідратацію та негайне заміщення після фізичних навантажень');
    }
    
    if (sportType === 'water-sports') {
      recommendations.push('🏊 Водні види спорту: Не припускайте, що ви гідратовані, бо знаходитеся у воді');
    }
    
    if (environment === 'altitude') {
      recommendations.push('⛰️ Висока висота: Збільшені потреби рідини через вищі дихальні втрати');
    }

    // Warnings
    let warnings = [];
    
    if (totalFluidLoss > 3) {
      warnings.push('⚠️ Очікуються дуже високі втрати рідини - моніторьте ознаки теплової хвороби');
    }
    
    if (targetFluidIntake > 1.5 && totalDurationHours < 2) {
      warnings.push('⚠️ Висока швидкість споживання рідини - практикуйте в тренуваннях для уникнення шлунково-кишкового дистресу');
    }
    
    if (acclimatization === 'none' && (tempCelsius > 28 || humidity === 'very-high')) {
      warnings.push('⚠️ Ризик теплового стресу: Розгляньте період акліматизації перед інтенсивними тренуваннями');
    }

    // Format helper functions
    const formatFluid = (liters) => {
      if (liters < 1) {
        return `${Math.round(liters * 1000)} мл`;
      }
      return `${liters.toFixed(1)} л (${Math.round(liters * 1000)} мл)`;
    };

    const formatSodium = (mg) => {
      if (mg >= 1000) {
        return `${(mg/1000).toFixed(1)}г`;
      }
      return `${Math.round(mg)}мг`;
    };

    // Translate sport types
    const sportNames = {
      'endurance': 'Витривалість',
      'team-sports': 'Командні види спорту',
      'strength-power': 'Сила/Потужність',
      'combat': 'Бойові види спорту',
      'racquet': 'Ракетні види спорту',
      'water-sports': 'Водні види спорту',
      'aesthetic': 'Естетичні види спорту',
      'outdoor': 'Зовнішні види спорту',
      'multiple': 'Кілька видів спорту'
    };

    const intensityNames = {
      'light': 'Легка',
      'moderate': 'Помірна',
      'vigorous': 'Інтенсивна',
      'high': 'Висока',
      'maximal': 'Максимальна'
    };

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваш план спортивної гідратації</h3>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Огляд сесії</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div><strong>Вид спорту:</strong> ${sportNames[sportType] || sportType}</div>
            <div><strong>Тривалість:</strong> ${durationHours}г ${durationMinutes}хв</div>
            <div><strong>Інтенсивність:</strong> ${intensityNames[intensity] || intensity}</div>
            <div><strong>Температура:</strong> ${tempInput}°${tempUnit.charAt(0).toUpperCase()}</div>
            <div><strong>Вага:</strong> ${weightInput} ${weightUnit === 'kg' ? 'кг' : 'фунтів'}</div>
            <div><strong>Оцінена швидкість потовиділення:</strong> ${sweatRate.toFixed(1)} л/год</div>
          </div>
          <div style="margin-top:15px;padding:15px;background:#fff3cd;border-radius:6px;">
            <strong>Очікувана втрата рідини:</strong> <span style="color:#856404;font-size:1.1em;">${formatFluid(totalFluidLoss)}</span>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Протокол гідратації перед фізичними навантаженнями</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#e3f2fd;border-radius:6px;">
              <div style="font-weight:bold;color:#1976d2;">За 4 години до</div>
              <div style="font-size:1.2em;color:#1976d2;">${formatFluid(preExercise4h/1000)}</div>
              <div style="color:#666;font-size:0.9em;">Основна фаза гідратації</div>
            </div>
            <div style="text-align:center;padding:15px;background:#e8f5e8;border-radius:6px;">
              <div style="font-weight:bold;color:#388e3c;">За 2 години до</div>
              <div style="font-size:1.2em;color:#388e3c;">${formatFluid(preExercise2h/1000)}</div>
              <div style="color:#666;font-size:0.9em;">Якщо сеча не блідо-жовта</div>
            </div>
            <div style="text-align:center;padding:15px;background:#fff3e0;border-radius:6px;">
              <div style="font-weight:bold;color:#f57c00;">За 30 хв до</div>
              <div style="font-size:1.2em;color:#f57c00;">${formatFluid(preExercise30min/1000)}</div>
              <div style="color:#666;font-size:0.9em;">Фінальна підготовка</div>
            </div>
          </div>
        </div>

        ${targetFluidIntake > 0 ? `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Гідратація під час фізичних навантажень</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;margin:10px 0;">
            <div style="text-align:center;">
              <div style="font-size:1.3em;font-weight:bold;color:#155724;">Ціль: ${formatFluid(targetFluidIntake)}</div>
              <div style="color:#155724;margin:5px 0;">${duringExerciseStrategy}</div>
            </div>
          </div>
          
          ${drinkingSchedule ? `
          <div style="background:#f8f9fa;padding:15px;border-radius:6px;margin:10px 0;">
            <h5 style="margin-top:0;">Розклад споживання</h5>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
              <div><strong>Частота:</strong> ${drinkingSchedule.frequency}</div>
              <div><strong>Об'єм:</strong> ${drinkingSchedule.volume}</div>
              <div><strong>Загальні випивки:</strong> ${drinkingSchedule.opportunities}</div>
            </div>
          </div>
          ` : ''}
          
          ${sodiumNeeds > 0 ? `
          <div style="background:#e2e3e5;padding:10px;border-radius:4px;">
            <strong>Заміщення натрію:</strong> ${formatSodium(sodiumNeeds)} загалом (${formatSodium(sodiumNeeds/totalDurationHours)} на годину)
          </div>
          ` : ''}
        </div>
        ` : `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Гідратація під час фізичних навантажень</h4>
          <div style="background:#f8d7da;padding:15px;border-radius:6px;">
            <p style="color:#721c24;margin:0;"><strong>Коротка сесія:</strong> Фокус на гідратацію до та після фізичних навантажень. Невеликі ковтки якщо відчуваєте спрагу.</p>
          </div>
        </div>
        `}

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Відновлення після фізичних навантажень</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#f8d7da;border-radius:6px;">
              <div style="font-weight:bold;color:#721c24;">Негайно (0-30 хв)</div>
              <div style="font-size:1.2em;color:#721c24;">Почніть регідратацію</div>
              <div style="color:#666;font-size:0.9em;">Розпочніть протягом 30 хвилин</div>
            </div>
            <div style="text-align:center;padding:15px;background:#d1ecf1;border-radius:6px;">
              <div style="font-weight:bold;color:#0c5460;">Загальне відновлення</div>
              <div style="font-size:1.2em;color:#0c5460;">${formatFluid(postExerciseFluid)}</div>
              <div style="color:#666;font-size:0.9em;">150% втрат</div>
            </div>
            <div style="text-align:center;padding:15px;background:#e2e3e5;border-radius:6px;">
              <div style="font-weight:bold;color:#383d41;">З натрієм</div>
              <div style="font-size:1.2em;color:#383d41;">${formatSodium(postExerciseSodium)}</div>
              <div style="color:#666;font-size:0.9em;">Для утримання рідини</div>
            </div>
          </div>
          <div style="background:#fff3cd;padding:10px;border-radius:4px;margin-top:10px;">
            <strong>Часові рамки:</strong> Повна регідратація протягом 6 годин для тренувань наступного дня
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Моніторинг гідратації</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div>
              <strong>🏋️ Вага тіла:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Зважуйтесь до і після фізичних навантажень</li>
                <li>1кг втрати = ~1л дефіцит рідини</li>
                <li>Ціль <2% втрати ваги</li>
              </ul>
            </div>
            <div>
              <strong>🚽 Перевірка сечі:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Блідо-жовта = добре гідратований</li>
                <li>Темно-жовта = зневоднений</li>
                <li>Моніторьте об'єм та частоту</li>
              </ul>
            </div>
            <div>
              <strong>💓 Ознаки результативності:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Підтримуйте звичайний темп тренувань</li>
                <li>Нормальна відповідь частоти серцевих скорочень</li>
                <li>Відсутність надмірної втоми</li>
              </ul>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Персоналізовані рекомендації</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Важливі попередження</h4>
          <ul style="margin:5px 0;color:#856404;">
            ${warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🎯 Ключові стратегії успіху</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>📋 Перед тренуванням:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Перевірте колір сечі (блідо-жовта)</li>
                <li>Почніть гідратацію за 4 години заздалегідь</li>
                <li>Включайте натрій для довгих сесій</li>
              </ul>
            </div>
            <div>
              <strong>⏰ Під час тренування:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Почніть пити протягом 15-20 хвилин</li>
                <li>Невеликі, часті ковтки проти великих об'ємів</li>
                <li>Не чекайте поки відчуєте спрагу</li>
              </ul>
            </div>
            <div>
              <strong>🔄 Після тренування:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Розпочніть регідратацію негайно</li>
                <li>Включайте натрій для утримання рідин</li>
                <li>Моніторьте відновлення кольору сечі</li>
              </ul>
            </div>
            <div>
              <strong>📊 Відстежуйте та корегуйте:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Тестуйте стратегії в тренуваннях</li>
                <li>Розрахуйте особисту швидкість потовиділення</li>
                <li>Корегуйте для умов</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#721c24;">🚨 Зверніться за медичною допомогою, якщо відчуваєте:</h4>
          <ul style="margin:0;color:#721c24;font-size:0.9em;">
            <li>Запаморочення, плутанина або зміни психічного стану</li>
            <li>Нудота, блювання або сильний головний біль</li>
            <li>Відсутність потовиділення незважаючи на тепло та зусилля</li>
            <li>Швидка частота серцевих скорочень, що не зменшується з відпочинком</li>
            <li>М'язові судоми, що не минають з розтягуванням</li>
            <li>Ознаки теплового виснаження або теплового удару</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});