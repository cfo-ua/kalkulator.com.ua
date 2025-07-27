document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('water-intake-marathon-form');
  const result = document.getElementById('water-intake-marathon-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const hours = +form.hours.value;
    const minutes = +form.minutes.value;
    const tempInput = +form.temperature.value;
    const tempUnit = form['temp-unit'].value;
    const humidity = form.humidity.value;
    const wind = form.wind.value;
    const sweatRateInput = +form['sweat-rate'].value;
    const fitness = form.fitness.value;
    const acclimatization = form.acclimatization.value;
    const experience = form.experience.value;
    const aidStations = form['aid-stations'].value;
    const paceStrategy = form['pace-strategy'].value;
    const clothing = form.clothing.value;
    const currentHydration = form['current-hydration'].value;
    const drinkPreference = form['drink-preference'].value;

    // Validation
    if (!weightInput || !hours || minutes < 0 || !tempInput || !humidity || !wind || 
        !fitness || !acclimatization || !experience || !aidStations || !paceStrategy || 
        !clothing || !currentHydration || !drinkPreference) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    if (hours < 2 || hours > 8) {
      result.innerHTML = '<p style="color:red;">Час марафону повинен бути між 2 та 8 годинами.</p>';
      return;
    }

    // Convert units
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;
    const tempCelsius = tempUnit === 'fahrenheit' ? (tempInput - 32) * 5/9 : tempInput;
    const raceTimeHours = hours + (minutes / 60);

    // Humidity factors
    const humidityFactors = {
      'low': 0.9,
      'moderate': 1.0,
      'high': 1.2,
      'very-high': 1.4
    };

    // Wind factors
    const windFactors = {
      'none': 1.1,
      'light': 1.0,
      'moderate': 0.95,
      'strong': 0.9
    };

    // Fitness level factors
    const fitnessFactors = {
      'beginner': 1.2,
      'recreational': 1.0,
      'competitive': 0.9,
      'elite': 0.8
    };

    // Acclimatization factors
    const acclimatizationFactors = {
      'none': 1.3,
      'partial': 1.1,
      'good': 1.0,
      'excellent': 0.9
    };

    // Calculate base sweat rate if not provided
    let sweatRate;
    if (sweatRateInput && sweatRateInput > 0) {
      sweatRate = sweatRateInput / 1000; // Convert ml to liters
    } else {
      // Base sweat rate calculation (in L/hour)
      let baseSweatRate = 0.5 + (weight * 0.02); // Base rate increases with weight
      
      // Temperature adjustment
      if (tempCelsius > 25) {
        baseSweatRate += (tempCelsius - 25) * 0.05;
      } else if (tempCelsius < 15) {
        baseSweatRate -= (15 - tempCelsius) * 0.02;
      }
      
      // Apply modifying factors
      sweatRate = baseSweatRate * 
                  humidityFactors[humidity] * 
                  windFactors[wind] * 
                  fitnessFactors[fitness] * 
                  acclimatizationFactors[acclimatization];
    }

    // Pace strategy adjustments
    const paceFactors = {
      'conservative': 0.9,
      'even': 1.0,
      'negative-split': 1.1,
      'aggressive': 1.2
    };
    sweatRate *= paceFactors[paceStrategy];

    // Clothing adjustments
    const clothingFactors = {
      'minimal': 0.95,
      'light': 1.0,
      'moderate': 1.1,
      'warm': 1.2
    };
    sweatRate *= clothingFactors[clothing];

    // Calculate total fluid loss during race
    const totalFluidLoss = sweatRate * raceTimeHours;
    
    // Calculate optimal fluid intake during race (aim for 60-70% replacement)
    const replacementRate = 0.65; // 65% replacement to avoid overhydration
    const duringRaceIntake = totalFluidLoss * replacementRate;
    const perHourIntake = duringRaceIntake / raceTimeHours;
    
    // Pre-race hydration (adjusted for current hydration status)
    let preRaceIntake = weight * 0.007; // 7ml per kg body weight
    const hydrationAdjustments = {
      'dehydrated': 1.5,
      'normal': 1.0,
      'well-hydrated': 0.8,
      'overhydrated': 0.5
    };
    preRaceIntake *= hydrationAdjustments[currentHydration];
    
    // Post-race recovery (150% of net fluid loss)
    const netFluidLoss = totalFluidLoss - duringRaceIntake;
    const postRaceIntake = netFluidLoss * 1.5;
    
    // Aid station strategy calculations
    const aidStationCounts = {
      'every-2km': 20,
      'every-5km': 8,
      'limited': 4,
      'self-sufficient': 1
    };
    const stationCount = aidStationCounts[aidStations];
    const perStationIntake = (duringRaceIntake * 1000) / stationCount; // in ml

    // Calculate electrolyte needs
    const electrolytesNeeded = raceTimeHours > 1.5;
    const sodiumNeeds = Math.round(weight * 0.5 * raceTimeHours); // mg sodium per hour

    // Format helper
    const formatFluid = (liters) => {
      if (liters < 1) {
        return `${Math.round(liters * 1000)} мл`;
      }
      return `${liters.toFixed(1)} л (${Math.round(liters * 1000)} мл)`;
    };

    // Generate warnings based on conditions
    let warnings = [];
    if (tempCelsius > 28) {
      warnings.push("⚠️ Ризик високої температури: Розгляньте відкладення старту або збільшення стратегій охолодження");
    }
    if (humidity === 'very-high' && tempCelsius > 22) {
      warnings.push("⚠️ Умови високого теплового стресу: Стежте за симптомами теплових захворювань");
    }
    if (sweatRate > 2.5) {
      warnings.push("⚠️ Дуже висока швидкість потовиділення: Розгляньте заміщення електролітів та практикуйте стратегію гідратації");
    }
    if (perHourIntake > 1.0) {
      warnings.push("⚠️ Високі потреби в рідині: Практикуйте споживання такого об'єму під час тренувань для уникнення шлунково-кишкових розладів");
    }
    if (currentHydration === 'dehydrated') {
      warnings.push("⚠️ Початкове зневоднення: Збільште споживання рідини за 24 години до забігу");
    }
    if (experience === 'first') {
      warnings.push("💡 Перший марафон: Будьте консервативними з гідратацією та практикуйте під час довгих пробіжок");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваш план гідратації марафону</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;">
              <div style="background:#157aff;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${sweatRate.toFixed(1)} л/год
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Швидкість потовиділення</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#dc3545;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${formatFluid(totalFluidLoss)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Загальна втрата рідини</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#28a745;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${Math.round(perHourIntake * 1000)} мл/год
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Споживання під час забігу</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">📊 Умови забігу</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#e8f4fd;padding:15px;border-radius:6px;">
              <strong>Вага:</strong> ${weightInput} ${weightUnit === 'kg' ? 'кг' : 'фунтів'}<br>
              <strong>Час забігу:</strong> ${hours}г ${minutes}хв<br>
              <strong>Температура:</strong> ${tempInput}°${tempUnit === 'celsius' ? 'C' : 'F'}
            </div>
            <div style="background:#f0f0f0;padding:15px;border-radius:6px;">
              <strong>Вологість:</strong> ${getHumidityText(humidity)}<br>
              <strong>Вітер:</strong> ${getWindText(wind)}<br>
              <strong>Рівень фітнесу:</strong> ${getFitnessText(fitness)}
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">🕒 Розклад гідратації</h4>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin:15px 0;">
            <div style="background:#e3f2fd;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#1976d2;margin-bottom:8px;">Перед забігом</div>
              <div style="font-size:1.2em;font-weight:bold;">${formatFluid(preRaceIntake)}</div>
              <div style="color:#666;font-size:0.9em;">За 2-4 години до старту</div>
            </div>
            
            <div style="background:#e8f5e8;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#388e3c;margin-bottom:8px;">Під час забігу</div>
              <div style="font-size:1.2em;font-weight:bold;">${formatFluid(perHourIntake)}/годину</div>
              <div style="color:#666;font-size:0.9em;">Загалом: ${formatFluid(duringRaceIntake)}</div>
            </div>
            
            <div style="background:#fff3e0;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#f57c00;margin-bottom:8px;">Після забігу</div>
              <div style="font-size:1.2em;font-weight:bold;">${formatFluid(postRaceIntake)}</div>
              <div style="color:#666;font-size:0.9em;">Для повного відновлення</div>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">🏃 Стратегія пунктів харчування</h4>
          <div style="background:#fff3cd;padding:15px;border-radius:6px;">
            <p><strong>На кожному пункті харчування:</strong> <span style="color:#856404;font-size:1.2em;font-weight:bold;">${Math.round(perStationIntake)} мл</span></p>
            <p style="color:#856404;margin:10px 0;">Кількість пунктів: ~${stationCount} (${getAidStationText(aidStations)})</p>
            
            <div style="background:white;padding:10px;border-radius:4px;margin-top:10px;">
              <strong style="color:#856404;">Поради стратегії:</strong>
              <ul style="margin:5px 0;color:#856404;">
                <li>Не пропускайте ранні пункти харчування - почніть гідратацію з 5-10 км</li>
                <li>П'ійте невеликими порціями часто, а не великими ковтками</li>
                <li>Проходьте пункти харчування пішки, якщо потрібно для правильного споживання</li>
                <li>Розгляньте спортивні напої для заміщення електролітів після 1 години</li>
                ${aidStations === 'self-sufficient' ? '<li>Несіть власну рідину або плануйте заправку рюкзака</li>' : ''}
              </ul>
            </div>
          </div>
        </div>

        ${electrolytesNeeded ? `
        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">⚡ Потреби в електролітах</h4>
          <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
            <p><strong>Натрій:</strong> ~${sodiumNeeds} мг/годину</p>
            <p><strong>Рекомендації:</strong></p>
            <ul style="margin:5px 0;color:#666;">
              <li>${getDrinkRecommendation(drinkPreference)}</li>
              <li>Для забігів понад 90 хвилин завжди включайте електроліти</li>
              <li>Уникайте лише води для тривалих забігів (ризик гіпонатріємії)</li>
              <li>Практикуйте вашу електролітну стратегію під час тренувань</li>
            </ul>
          </div>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #ffc107;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Важливі попередження</h4>
          <ul style="margin:0;color:#856404;">
            ${warnings.map(warning => `<li style="margin:5px 0;">${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #17a2b8;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Ключові нагадування</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="color:#0c5460;">
              <strong>🏃 Практика:</strong> Тестуйте цей план гідратації під час довгих тренувальних пробіжок
            </div>
            <div style="color:#0c5460;">
              <strong>👂 Слухайте тіло:</strong> Коригуйте на основі спраги та комфорту
            </div>
            <div style="color:#0c5460;">
              <strong>⚖️ Не перебільшуйте:</strong> Надмірна гідратація так само небезпечна, як зневоднення
            </div>
            <div style="color:#0c5460;">
              <strong>🌡️ Моніторинг:</strong> Стежте за температурою тіла та симптомами теплових захворювань
            </div>
          </div>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">📋 Чек-лист дня забігу</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;">
            <div style="color:#383d41;">
              <strong>За 2-4 години:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Випийте ${formatFluid(preRaceIntake)}</li>
                <li>Перевірте колір сечі (світло-жовтий)</li>
                <li>Уникайте надмірної кількості кофеїну</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>Перед стартом:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>200-300 мл за 15-20 хвилин</li>
                <li>Використайте туалет</li>
                <li>Перевірте пояс для пляшок</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>Під час забігу:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Почніть пити рано (5-10 км)</li>
                <li>Маленькими ковтками кожні 15-20 хв</li>
                <li>Не чекайте спраги</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function getHumidityText(humidity) {
    const texts = {
      'low': 'Низька (< 40%)',
      'moderate': 'Помірна (40-60%)',
      'high': 'Висока (60-80%)',
      'very-high': 'Дуже висока (> 80%)'
    };
    return texts[humidity] || humidity;
  }

  function getWindText(wind) {
    const texts = {
      'none': 'Безвітря',
      'light': 'Легкий',
      'moderate': 'Помірний',
      'strong': 'Сильний'
    };
    return texts[wind] || wind;
  }

  function getFitnessText(fitness) {
    const texts = {
      'beginner': 'Початківець',
      'recreational': 'Любитель',
      'competitive': 'Змагальний',
      'elite': 'Еліта'
    };
    return texts[fitness] || fitness;
  }

  function getAidStationText(aidStations) {
    const texts = {
      'every-2km': 'кожні 2 км',
      'every-5km': 'кожні 5 км',
      'limited': 'обмежено',
      'self-sufficient': 'самозабезпечення'
    };
    return texts[aidStations] || aidStations;
  }

  function getDrinkRecommendation(preference) {
    const recommendations = {
      'water-only': 'Додайте електролітні таблетки до води або чергуйте з спортивними напоями',
      'sports-drinks': 'Ідеально! Спортивні напої забезпечують баланс рідини та електролітів',
      'mixed': 'Відмінна стратегія - чергуйте воду та спортивні напої',
      'electrolyte-tabs': 'Хороший вибір - розчиняйте таблетки згідно з інструкціями',
      'natural': 'Переконайтесь, що природні напої містять достатньо натрію'
    };
    return recommendations[preference] || 'Включайте електроліти для тривалих забігів';
  }
});