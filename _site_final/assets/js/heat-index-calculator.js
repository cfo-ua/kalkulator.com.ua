document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('heat-index-form');
  const result = document.getElementById('heat-index-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const temperature = +document.getElementById('temperature').value;
    const tempUnit = document.getElementById('tempUnit').value;
    const humidity = +document.getElementById('humidity').value;
    const windSpeed = +document.getElementById('windSpeed').value || 0;
    const windUnit = document.getElementById('windUnit').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const activityLevel = document.getElementById('activityLevel').value;
    const exposureTime = +document.getElementById('exposureTime').value;
    const location = form.location.value;
    const clothing = form.clothing.value;
    
    // Get conditions array
    const conditions = Array.from(form.querySelectorAll('input[name="conditions"]:checked')).map(input => input.value);

    // Validation
    if (!temperature || !humidity || !ageGroup || !activityLevel || !exposureTime || !location || !clothing) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    if (humidity < 0 || humidity > 100) {
      result.innerHTML = '<p style="color:red;">Вологість повинна бути між 0 та 100%.</p>';
      return;
    }

    // Convert temperature to Fahrenheit for calculation if needed
    let tempF = temperature;
    if (tempUnit === 'celsius') {
      tempF = (temperature * 9/5) + 32;
    }

    // Calculate heat index using simplified equation
    const heatIndexF = calculateHeatIndex(tempF, humidity);
    
    // Convert back to user's preferred unit
    let heatIndexDisplay = heatIndexF;
    let displayUnit = '°F';
    if (tempUnit === 'celsius') {
      heatIndexDisplay = (heatIndexF - 32) * 5/9;
      displayUnit = '°C';
    }

    // Calculate wind chill factor if applicable
    const windSpeedMph = windUnit === 'kmh' ? windSpeed * 0.621371 : windSpeed;
    const adjustedHeatIndex = calculateWindEffect(heatIndexF, windSpeedMph);
    
    // Adjust for location and clothing
    const environmentalAdjustment = getEnvironmentalAdjustment(location, clothing);
    const finalHeatIndex = adjustedHeatIndex + environmentalAdjustment;
    
    let finalDisplay = finalHeatIndex;
    if (tempUnit === 'celsius') {
      finalDisplay = (finalHeatIndex - 32) * 5/9;
    }

    // Assess risk level
    const riskLevel = assessHeatRisk(finalHeatIndex, ageGroup, activityLevel, exposureTime, conditions);
    
    // Generate recommendations
    const recommendations = generateRecommendations(riskLevel, activityLevel, exposureTime, conditions, ageGroup);
    
    // Generate hydration guide
    const hydrationGuide = generateHydrationGuide(finalHeatIndex, activityLevel, exposureTime);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Результати індексу спеки</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;">
              <div style="background:#157aff;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${Math.round(heatIndexDisplay)}${displayUnit}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Базовий індекс спеки</p>
            </div>
            <div style="text-align:center;">
              <div style="background:${getRiskColor(riskLevel.level)};color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${Math.round(finalDisplay)}${displayUnit}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Скоригований індекс</p>
            </div>
            <div style="text-align:center;">
              <div style="background:${getRiskColor(riskLevel.level)};color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${riskLevel.label}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Рівень ризику</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:${getRiskColor(riskLevel.level)};">⚠️ Рівень ризику: ${riskLevel.label}</h4>
          <div style="background:${getRiskBgColor(riskLevel.level)};padding:15px;border-radius:6px;border-left:4px solid ${getRiskColor(riskLevel.level)};">
            <p style="margin:0;color:${getRiskTextColor(riskLevel.level)};font-weight:bold;margin-bottom:10px;">${riskLevel.description}</p>
            <div style="color:${getRiskTextColor(riskLevel.level)};font-size:0.9em;">
              <strong>Ризик для вашої вікової групи:</strong> ${getAgeGroupRisk(ageGroup, riskLevel.level)}<br>
              <strong>Ризик для вашої активності:</strong> ${getActivityRisk(activityLevel, riskLevel.level)}
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">💧 Рекомендації з гідратації</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
              <div style="text-align:center;">
                <div style="font-size:1.5em;font-weight:bold;color:#155724;">${hydrationGuide.hourly} мл</div>
                <div style="font-size:0.9em;color:#155724;">на годину</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:1.5em;font-weight:bold;color:#155724;">${hydrationGuide.total} мл</div>
                <div style="font-size:0.9em;color:#155724;">загалом за ${exposureTime} хв</div>
              </div>
            </div>
            <div style="margin-top:10px;color:#155724;font-size:0.9em;">
              <strong>Рекомендації:</strong>
              <ul style="margin:5px 0;">
                ${hydrationGuide.tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">🛡️ Рекомендації з безпеки</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${recommendations.map(rec => `
              <div style="background:#fff3cd;padding:15px;border-radius:6px;border-left:4px solid #fd7e14;">
                <div style="font-weight:bold;color:#856404;margin-bottom:5px;">${rec.category}</div>
                <div style="font-size:0.9em;color:#856404;">${rec.advice}</div>
              </div>
            `).join('')}
          </div>
        </div>

        ${getEmergencyInfo(riskLevel.level)}

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #17a2b8;">
          <h4 style="margin-top:0;color:#0c5460;">📊 Фактори, що впливають на ваш ризик</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="color:#0c5460;">
              <strong>Температура:</strong> ${temperature}${tempUnit === 'celsius' ? '°C' : '°F'}
            </div>
            <div style="color:#0c5460;">
              <strong>Вологість:</strong> ${humidity}%
            </div>
            <div style="color:#0c5460;">
              <strong>Вітер:</strong> ${windSpeed || 0} ${windUnit === 'kmh' ? 'км/год' : 'миль/год'}
            </div>
            <div style="color:#0c5460;">
              <strong>Вік:</strong> ${getAgeGroupText(ageGroup)}
            </div>
            <div style="color:#0c5460;">
              <strong>Активність:</strong> ${getActivityText(activityLevel)}
            </div>
            <div style="color:#0c5460;">
              <strong>Час:</strong> ${exposureTime} хвилин
            </div>
          </div>
        </div>

        ${conditions.length > 0 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #dc3545;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Додатковий ризик</h4>
          <p style="color:#721c24;margin-bottom:10px;">Ваші особливі умови збільшують ризик:</p>
          <ul style="color:#721c24;margin:0;">
            ${conditions.map(condition => `<li>${getConditionText(condition)}</li>`).join('')}
          </ul>
          <p style="color:#721c24;margin-top:10px;font-weight:bold;">Рекомендується додаткова обережність та консультація з лікарем.</p>
        </div>
        ` : ''}
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function calculateHeatIndex(tempF, humidity) {
    // Simplified heat index calculation
    if (tempF < 80) {
      return tempF; // No heat index calculation needed for cool temperatures
    }

    // Rothfusz equation coefficients
    const c1 = -42.379;
    const c2 = 2.04901523;
    const c3 = 10.14333127;
    const c4 = -0.22475541;
    const c5 = -0.00683783;
    const c6 = -0.05481717;
    const c7 = 0.00122874;
    const c8 = 0.00085282;
    const c9 = -0.00000199;

    const T = tempF;
    const RH = humidity;

    let HI = c1 + (c2 * T) + (c3 * RH) + (c4 * T * RH) + 
             (c5 * T * T) + (c6 * RH * RH) + (c7 * T * T * RH) + 
             (c8 * T * RH * RH) + (c9 * T * T * RH * RH);

    // Adjustments for extreme conditions
    if (RH < 13 && T >= 80 && T <= 112) {
      HI -= ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
    } else if (RH > 85 && T >= 80 && T <= 87) {
      HI += ((RH - 85) / 10) * ((87 - T) / 5);
    }

    return HI;
  }

  function calculateWindEffect(heatIndex, windSpeedMph) {
    // Wind reduces effective heat index
    if (windSpeedMph > 3) {
      const windReduction = Math.min(windSpeedMph * 0.5, 10); // Max 10°F reduction
      return heatIndex - windReduction;
    }
    return heatIndex;
  }

  function getEnvironmentalAdjustment(location, clothing) {
    let adjustment = 0;
    
    // Location adjustments
    const locationAdjustments = {
      'direct-sun': 15,
      'partial-shade': 5,
      'full-shade': -5,
      'indoors-no-ac': 0,
      'indoors-ac': -15
    };
    adjustment += locationAdjustments[location] || 0;

    // Clothing adjustments
    const clothingAdjustments = {
      'minimal': -2,
      'light': 0,
      'moderate': 5,
      'heavy': 10,
      'protective': 8
    };
    adjustment += clothingAdjustments[clothing] || 0;

    return adjustment;
  }

  function assessHeatRisk(heatIndex, ageGroup, activityLevel, exposureTime, conditions) {
    let riskScore = 0;
    
    // Base risk from heat index
    if (heatIndex < 80) {
      riskScore = 0;
    } else if (heatIndex < 90) {
      riskScore = 1;
    } else if (heatIndex < 105) {
      riskScore = 2;
    } else if (heatIndex < 130) {
      riskScore = 3;
    } else {
      riskScore = 4;
    }

    // Age group modifiers
    const ageModifiers = {
      'child': 1,
      'teen': 0,
      'young-adult': 0,
      'middle-aged': 0.5,
      'elderly': 1.5
    };
    riskScore += ageModifiers[ageGroup] || 0;

    // Activity modifiers
    const activityModifiers = {
      'resting': 0,
      'light': 0.5,
      'moderate': 1,
      'heavy': 1.5,
      'extreme': 2
    };
    riskScore += activityModifiers[activityLevel] || 0;

    // Exposure time modifier
    if (exposureTime > 120) riskScore += 1;
    if (exposureTime > 240) riskScore += 1;

    // Special conditions
    riskScore += conditions.length * 0.5;

    // Determine final risk level
    if (riskScore <= 1) {
      return { level: 'low', label: 'Низький', description: 'Мінімальний ризик захворювань від спеки. Дотримуйтесь основних заходів безпеки.' };
    } else if (riskScore <= 2.5) {
      return { level: 'moderate', label: 'Помірний', description: 'Будьте обережні. Можлива втома при тривалому перебуванні та фізичній активності.' };
    } else if (riskScore <= 4) {
      return { level: 'high', label: 'Високий', description: 'Можливі теплові судоми та виснаження. Уникайте тривалого перебування на сонці.' };
    } else if (riskScore <= 6) {
      return { level: 'very-high', label: 'Дуже високий', description: 'Теплові судоми та виснаження ймовірні. Тепловий удар можливий при тривалому перебуванні.' };
    } else {
      return { level: 'extreme', label: 'Надзвичайний', description: 'Тепловий удар та виснаження дуже ймовірні. Уникайте всієї діяльності на відкритому повітрі.' };
    }
  }

  function generateRecommendations(riskLevel, activityLevel, exposureTime, conditions, ageGroup) {
    const recommendations = [];

    // Activity recommendations
    if (riskLevel.level === 'high' || riskLevel.level === 'very-high' || riskLevel.level === 'extreme') {
      recommendations.push({
        category: 'Активність',
        advice: activityLevel === 'extreme' || activityLevel === 'heavy' ? 
          'Припиніть важку фізичну активність. Перейдіть у прохолодне місце.' :
          'Обмежте фізичну активність до мінімуму. Робіть часті перерви.'
      });
    } else {
      recommendations.push({
        category: 'Активність',
        advice: 'Робіть перерви кожні 30 хвилин. Слухайте своє тіло.'
      });
    }

    // Hydration recommendations
    recommendations.push({
      category: 'Гідратація',
      advice: riskLevel.level === 'extreme' ? 
        'Пийте прохолодну воду кожні 15 хвилин. Уникайте алкоголю та кофеїну.' :
        'Пийте воду регулярно, навіть якщо не відчуваєте спраги.'
    });

    // Clothing recommendations
    recommendations.push({
      category: 'Одяг',
      advice: 'Носіть легкий, світлий, вільний одяг. Використовуйте капелюх із широкими полями.'
    });

    // Shelter recommendations
    if (riskLevel.level === 'very-high' || riskLevel.level === 'extreme') {
      recommendations.push({
        category: 'Укриття',
        advice: 'Шукайте кондиціоноване приміщення. Уникайте прямого сонячного світла.'
      });
    } else {
      recommendations.push({
        category: 'Укриття',
        advice: 'Залишайтесь у тіні під час найжаркіших годин дня (10:00-16:00).'
      });
    }

    return recommendations;
  }

  function generateHydrationGuide(heatIndex, activityLevel, exposureTime) {
    let baseHourly = 250; // Base ml per hour

    // Adjust for heat index
    if (heatIndex > 90) baseHourly += 100;
    if (heatIndex > 105) baseHourly += 150;
    if (heatIndex > 130) baseHourly += 200;

    // Adjust for activity
    const activityMultipliers = {
      'resting': 1,
      'light': 1.2,
      'moderate': 1.5,
      'heavy': 2,
      'extreme': 2.5
    };
    baseHourly *= activityMultipliers[activityLevel] || 1;

    const hourlyNeeds = Math.round(baseHourly);
    const totalNeeds = Math.round((exposureTime / 60) * hourlyNeeds);

    const tips = [];
    if (heatIndex > 100) {
      tips.push('Пийте прохолодну воду (10-15°C)');
      tips.push('Додайте електроліти при інтенсивному потовиділенні');
    } else {
      tips.push('Пийте воду кімнатної температури');
    }
    
    tips.push('Почніть гідратацію до виходу на сонце');
    tips.push('Не чекайте відчуття спраги');
    
    if (activityLevel === 'heavy' || activityLevel === 'extreme') {
      tips.push('Розгляньте спортивні напої для тривалої активності');
    }

    return {
      hourly: hourlyNeeds,
      total: totalNeeds,
      tips: tips
    };
  }

  function getEmergencyInfo(riskLevel) {
    if (riskLevel === 'very-high' || riskLevel === 'extreme') {
      return `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #dc3545;">
          <h4 style="margin-top:0;color:#721c24;">🚨 Інформація про екстрену ситуацію</h4>
          <div style="color:#721c24;">
            <p><strong>Симптоми теплового удару (ВИКЛИКАЙТЕ ШВИДКУ!):</strong></p>
            <ul>
              <li>Температура тіла вище 40°C</li>
              <li>Гаряча, суха шкіра або профузне потовиділення</li>
              <li>Швидкий пульс</li>
              <li>Втрата свідомості або плутанина</li>
              <li>Нудота та блювання</li>
            </ul>
            <p><strong>Перша допомога:</strong></p>
            <ul>
              <li>Негайно перемістіться в прохолодне місце</li>
              <li>Прикладіть холод до шиї, пахв, паху</li>
              <li>Якщо у свідомості - давайте прохолодну воду</li>
              <li>Викличте швидку допомогу: 103</li>
            </ul>
          </div>
        </div>
      `;
    }
    return '';
  }

  // Helper functions for UI
  function getRiskColor(level) {
    const colors = {
      'low': '#28a745',
      'moderate': '#ffc107',
      'high': '#fd7e14',
      'very-high': '#dc3545',
      'extreme': '#6f42c1'
    };
    return colors[level] || '#6c757d';
  }

  function getRiskBgColor(level) {
    const colors = {
      'low': '#d4edda',
      'moderate': '#fff3cd',
      'high': '#ffe8cc',
      'very-high': '#f8d7da',
      'extreme': '#e7d6f0'
    };
    return colors[level] || '#f8f9fa';
  }

  function getRiskTextColor(level) {
    const colors = {
      'low': '#155724',
      'moderate': '#856404',
      'high': '#8a4f00',
      'very-high': '#721c24',
      'extreme': '#493267'
    };
    return colors[level] || '#6c757d';
  }

  function getAgeGroupText(ageGroup) {
    const texts = {
      'child': 'Дитина',
      'teen': 'Підліток',
      'young-adult': 'Молодий дорослий',
      'middle-aged': 'Середній вік',
      'elderly': 'Літній вік'
    };
    return texts[ageGroup] || ageGroup;
  }

  function getActivityText(activityLevel) {
    const texts = {
      'resting': 'Відпочинок',
      'light': 'Легка',
      'moderate': 'Помірна',
      'heavy': 'Важка',
      'extreme': 'Інтенсивна'
    };
    return texts[activityLevel] || activityLevel;
  }

  function getConditionText(condition) {
    const texts = {
      'chronic-illness': 'Хронічне захворювання',
      'medications': 'Прийом ліків',
      'heart-disease': 'Захворювання серця',
      'diabetes': 'Діабет',
      'kidney-disease': 'Захворювання нирок',
      'pregnant': 'Вагітність',
      'overweight': 'Надмірна вага',
      'dehydrated': 'Зневоднення'
    };
    return texts[condition] || condition;
  }

  function getAgeGroupRisk(ageGroup, riskLevel) {
    if (ageGroup === 'child' || ageGroup === 'elderly') {
      return 'Підвищений - віддаєте перевагу обережності';
    }
    return 'Стандартний для вашого віку';
  }

  function getActivityRisk(activityLevel, riskLevel) {
    if (activityLevel === 'heavy' || activityLevel === 'extreme') {
      return 'Підвищений через високу активність';
    }
    return 'Відповідає вашому рівню активності';
  }
});