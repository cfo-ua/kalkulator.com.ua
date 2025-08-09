document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('hair-growth-form');
  const result = document.getElementById('hair-growth-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const currentLength = +form['current-length'].value;
    const targetLength = +form['target-length'].value;
    const gender = form.gender.value;
    const age = +form.age.value;
    const hairType = form['hair-type'].value;
    const hairThickness = form['hair-thickness'].value;
    const hairDensity = form['hair-density'].value;
    const healthStatus = form['health-status'].value;
    const stressLevel = form['stress-level'].value;
    const sleepQuality = form['sleep-quality'].value;
    const physicalActivity = form['physical-activity'].value;
    const dietQuality = form['diet-quality'].value;
    const supplements = form.supplements.value;
    const waterIntake = +form['water-intake'].value;
    const washingFrequency = form['washing-frequency'].value;
    const heatStyling = form['heat-styling'].value;
    const chemicalTreatments = form['chemical-treatments'].value;
    const scalpMassage = form['scalp-massage'].value;
    const season = form.season.value;
    const climate = form.climate.value;
    const pollution = form.pollution.value;

    // Validation
    if (!currentLength || !targetLength || !gender || !age || !hairType || 
        !hairThickness || !hairDensity || !healthStatus || !stressLevel || 
        !sleepQuality || !physicalActivity || !dietQuality || !supplements || 
        !waterIntake || !washingFrequency || !heatStyling || !chemicalTreatments || 
        !scalpMassage || !season || !climate || !pollution) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    if (targetLength <= currentLength) {
      result.innerHTML = '<p style="color:red;">Бажана довжина повинна бути більшою за поточну.</p>';
      return;
    }

    // Base growth rate (cm per month)
    let baseGrowthRate = 1.2; // average 1.2 cm per month

    // Gender factor
    const genderFactors = {
      'female': 1.0,
      'male': 0.95
    };
    baseGrowthRate *= genderFactors[gender];

    // Age factor
    let ageFactor = 1.0;
    if (age < 18) ageFactor = 1.1;
    else if (age <= 30) ageFactor = 1.0;
    else if (age <= 45) ageFactor = 0.95;
    else if (age <= 60) ageFactor = 0.9;
    else ageFactor = 0.85;
    baseGrowthRate *= ageFactor;

    // Hair type factor
    const hairTypeFactors = {
      'straight': 1.0,
      'wavy': 0.98,
      'curly': 0.95,
      'coily': 0.9
    };
    baseGrowthRate *= hairTypeFactors[hairType];

    // Thickness factor
    const thicknessFactors = {
      'fine': 0.95,
      'medium': 1.0,
      'thick': 1.05
    };
    baseGrowthRate *= thicknessFactors[hairThickness];

    // Health status factor
    const healthFactors = {
      'excellent': 1.1,
      'good': 1.0,
      'fair': 0.9,
      'poor': 0.75
    };
    baseGrowthRate *= healthFactors[healthStatus];

    // Stress factor
    const stressFactors = {
      'low': 1.1,
      'moderate': 1.0,
      'high': 0.85,
      'extreme': 0.7
    };
    baseGrowthRate *= stressFactors[stressLevel];

    // Sleep quality factor
    const sleepFactors = {
      'excellent': 1.1,
      'good': 1.0,
      'fair': 0.9,
      'poor': 0.8
    };
    baseGrowthRate *= sleepFactors[sleepQuality];

    // Physical activity factor
    const activityFactors = {
      'high': 1.1,
      'moderate': 1.05,
      'low': 1.0,
      'sedentary': 0.95
    };
    baseGrowthRate *= activityFactors[physicalActivity];

    // Diet quality factor
    const dietFactors = {
      'excellent': 1.15,
      'good': 1.05,
      'fair': 1.0,
      'poor': 0.85
    };
    baseGrowthRate *= dietFactors[dietQuality];

    // Supplements factor
    const supplementFactors = {
      'yes-targeted': 1.1,
      'yes-general': 1.05,
      'occasionally': 1.02,
      'no': 1.0
    };
    baseGrowthRate *= supplementFactors[supplements];

    // Water intake factor
    let waterFactor = 1.0;
    if (waterIntake >= 2.5) waterFactor = 1.05;
    else if (waterIntake >= 2.0) waterFactor = 1.0;
    else if (waterIntake >= 1.5) waterFactor = 0.98;
    else waterFactor = 0.95;
    baseGrowthRate *= waterFactor;

    // Heat styling factor
    const heatFactors = {
      'never': 1.1,
      'rarely': 1.05,
      'sometimes': 1.0,
      'often': 0.9,
      'daily': 0.8
    };
    baseGrowthRate *= heatFactors[heatStyling];

    // Chemical treatments factor
    const chemicalFactors = {
      'none': 1.1,
      'occasional': 1.0,
      'regular': 0.9,
      'frequent': 0.8
    };
    baseGrowthRate *= chemicalFactors[chemicalTreatments];

    // Scalp massage factor
    const massageFactors = {
      'daily': 1.1,
      'several-times': 1.05,
      'weekly': 1.02,
      'rarely': 1.0,
      'never': 0.98
    };
    baseGrowthRate *= massageFactors[scalpMassage];

    // Seasonal factor
    const seasonFactors = {
      'spring': 1.05,
      'summer': 1.1,
      'autumn': 1.0,
      'winter': 0.95
    };
    baseGrowthRate *= seasonFactors[season];

    // Climate factor
    const climateFactors = {
      'tropical': 1.05,
      'temperate': 1.0,
      'continental': 0.98,
      'cold': 0.95
    };
    baseGrowthRate *= climateFactors[climate];

    // Pollution factor
    const pollutionFactors = {
      'low': 1.05,
      'moderate': 1.0,
      'high': 0.95,
      'extreme': 0.9
    };
    baseGrowthRate *= pollutionFactors[pollution];

    // Calculate required growth
    const requiredGrowth = targetLength - currentLength;
    const timeToReachTarget = requiredGrowth / baseGrowthRate; // months

    // Calculate various scenarios
    const optimizedGrowthRate = baseGrowthRate * 1.2; // with perfect conditions
    const optimizedTime = requiredGrowth / optimizedGrowthRate;
    
    const minimalGrowthRate = baseGrowthRate * 0.8; // with poor conditions
    const maximalTime = requiredGrowth / minimalGrowthRate;

    // Calculate milestones
    const threeMonthLength = currentLength + (baseGrowthRate * 3);
    const sixMonthLength = currentLength + (baseGrowthRate * 6);
    const twelveMonthLength = currentLength + (baseGrowthRate * 12);

    // Format helper functions
    const formatTime = (months) => {
      if (months < 1) {
        return `${Math.round(months * 30)} днів`;
      } else if (months < 12) {
        return `${months.toFixed(1)} місяців`;
      } else {
        const years = Math.floor(months / 12);
        const remainingMonths = Math.round(months % 12);
        return `${years} ${years === 1 ? 'рік' : years < 5 ? 'роки' : 'років'}${remainingMonths > 0 ? ` ${remainingMonths} міс.` : ''}`;
      }
    };

    const formatLength = (length) => `${length.toFixed(1)} см`;

    // Generate recommendations based on factors
    let recommendations = [];
    if (stressLevel === 'high' || stressLevel === 'extreme') {
      recommendations.push("🧘 Зменшіть рівень стресу: медитація, йога, достатній відпочинок");
    }
    if (sleepQuality === 'fair' || sleepQuality === 'poor') {
      recommendations.push("😴 Покращте якість сну: 7-9 годин щоночі, регулярний режим");
    }
    if (dietQuality === 'fair' || dietQuality === 'poor') {
      recommendations.push("🥗 Збалансуйте харчування: більше білка, залізо, вітаміни групи B");
    }
    if (waterIntake < 2.0) {
      recommendations.push("💧 Збільшіть споживання води до 2-2.5 літрів на день");
    }
    if (heatStyling === 'often' || heatStyling === 'daily') {
      recommendations.push("🔥 Зменшіть використання термоінструментів, використовуйте термозахист");
    }
    if (chemicalTreatments === 'regular' || chemicalTreatments === 'frequent') {
      recommendations.push("💇 Скоротіть хімічні процедури, робіть поживні маски");
    }
    if (scalpMassage === 'rarely' || scalpMassage === 'never') {
      recommendations.push("👐 Робіть щоденний масаж голови для стимуляції кровообігу");
    }
    if (supplements === 'no') {
      recommendations.push("💊 Розгляньте прийом біотину, вітамінів D та B-комплексу");
    }

    // Generate warnings
    let warnings = [];
    if (baseGrowthRate < 0.8) {
      warnings.push("⚠️ Дуже повільний ріст: рекомендується консультація трихолога");
    }
    if (timeToReachTarget > 36) {
      warnings.push("⚠️ Дуже тривалий період досягнення мети: розгляньте проміжні цілі");
    }
    if (age > 50 && targetLength > 60) {
      warnings.push("⚠️ З віком максимальна довжина волосся може зменшуватися");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Прогноз росту вашого волосся</h3>
        
        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">📊 Основні показники</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;background:#e3f2fd;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#1976d2;">
                ${baseGrowthRate.toFixed(1)} см/міс
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Ваша швидкість росту</p>
            </div>
            <div style="text-align:center;background:#e8f5e8;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#388e3c;">
                ${formatTime(timeToReachTarget)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Час до бажаної довжини</p>
            </div>
            <div style="text-align:center;background:#fff3e0;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#f57c00;">
                ${formatLength(requiredGrowth)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Потрібно відростити</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">📅 Прогнози довжини</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Період</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Очікувана довжина</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Приріст</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Зараз</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(currentLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">—</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Через 3 місяці</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(threeMonthLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">+${formatLength(baseGrowthRate * 3)}</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Через 6 місяців</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(sixMonthLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">+${formatLength(baseGrowthRate * 6)}</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Через рік</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(twelveMonthLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">+${formatLength(baseGrowthRate * 12)}</td>
                </tr>
                <tr style="background:#e8f5e8;">
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Бажана довжина</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatLength(targetLength)}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatTime(timeToReachTarget)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">⏱️ Сценарії росту</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#d1ecf1;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#0c5460;margin-bottom:8px;">Оптимальні умови</div>
              <div style="font-size:1.2em;font-weight:bold;color:#0c5460;">${formatTime(optimizedTime)}</div>
              <div style="color:#0c5460;font-size:0.9em;">при ідеальному догляді</div>
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#383d41;margin-bottom:8px;">Поточні умови</div>
              <div style="font-size:1.2em;font-weight:bold;color:#383d41;">${formatTime(timeToReachTarget)}</div>
              <div style="color:#383d41;font-size:0.9em;">за наявних факторів</div>
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#721c24;margin-bottom:8px;">Несприятливі умови</div>
              <div style="font-size:1.2em;font-weight:bold;color:#721c24;">${formatTime(maximalTime)}</div>
              <div style="color:#721c24;font-size:0.9em;">при негативних факторах</div>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">🔍 Аналіз факторів</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Особисті фактори:</strong><br>
              👤 Стать: ${gender === 'female' ? 'жінка' : 'чоловік'}<br>
              🎂 Вік: ${age} років<br>
              💇 Тип: ${getHairTypeText(hairType)}<br>
              📏 Товщина: ${getThicknessText(hairThickness)}
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Здоров'я та спосіб життя:</strong><br>
              ❤️ Здоров'я: ${getHealthText(healthStatus)}<br>
              😰 Стрес: ${getStressText(stressLevel)}<br>
              😴 Сон: ${getSleepText(sleepQuality)}<br>
              🏃 Активність: ${getActivityText(physicalActivity)}
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Харчування:</strong><br>
              🥗 Дієта: ${getDietText(dietQuality)}<br>
              💊 Добавки: ${getSupplementsText(supplements)}<br>
              💧 Вода: ${waterIntake} л/день
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Догляд:</strong><br>
              🚿 Миття: ${getWashingText(washingFrequency)}<br>
              🔥 Тепло: ${getHeatText(heatStyling)}<br>
              💅 Хімія: ${getChemicalText(chemicalTreatments)}<br>
              👐 Масаж: ${getMassageText(scalpMassage)}
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">💡 Рекомендації для прискорення росту</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <ul style="margin:0;color:#155724;">
              ${recommendations.map(rec => `<li style="margin:8px 0;">${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #ffc107;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Важливі зауваження</h4>
          <ul style="margin:0;color:#856404;">
            ${warnings.map(warning => `<li style="margin:5px 0;">${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">📋 План дій для здорового росту волосся</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="color:#383d41;">
              <strong>🥗 Харчування:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Білки: яйця, риба, м'ясо (щодня)</li>
                <li>Залізо: червоне м'ясо, шпинат</li>
                <li>Вітаміни B: горіхи, зелені овочі</li>
                <li>Омега-3: риба, льняне насіння</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>💅 Догляд:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>М'який шампунь без сульфатів</li>
                <li>Кондиціонер щоразу</li>
                <li>Маски 1-2 рази на тиждень</li>
                <li>Термозахист обов'язково</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>🧘 Спосіб життя:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>7-9 годин сну щоночі</li>
                <li>Управління стресом</li>
                <li>Регулярна фізична активність</li>
                <li>2+ літри води на день</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>👐 Стимуляція:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Щоденний масаж голови 5-10 хв</li>
                <li>Уникання тугих зачісок</li>
                <li>Захист від УФ-променів</li>
                <li>Регулярні підрізання кінчиків</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  // Helper functions for text conversion
  function getHairTypeText(type) {
    const texts = {
      'straight': 'пряме',
      'wavy': 'хвилясте',
      'curly': 'кучеряве',
      'coily': 'дуже кучеряве'
    };
    return texts[type] || type;
  }

  function getThicknessText(thickness) {
    const texts = {
      'fine': 'тонке',
      'medium': 'середнє',
      'thick': 'товсте'
    };
    return texts[thickness] || thickness;
  }

  function getHealthText(health) {
    const texts = {
      'excellent': 'відмінне',
      'good': 'хороше',
      'fair': 'задовільне',
      'poor': 'погане'
    };
    return texts[health] || health;
  }

  function getStressText(stress) {
    const texts = {
      'low': 'низький',
      'moderate': 'помірний',
      'high': 'високий',
      'extreme': 'екстремальний'
    };
    return texts[stress] || stress;
  }

  function getSleepText(sleep) {
    const texts = {
      'excellent': 'відмінна',
      'good': 'хороша',
      'fair': 'задовільна',
      'poor': 'погана'
    };
    return texts[sleep] || sleep;
  }

  function getActivityText(activity) {
    const texts = {
      'high': 'висока',
      'moderate': 'помірна',
      'low': 'низька',
      'sedentary': 'сидячий'
    };
    return texts[activity] || activity;
  }

  function getDietText(diet) {
    const texts = {
      'excellent': 'відмінна',
      'good': 'хороша',
      'fair': 'задовільна',
      'poor': 'погана'
    };
    return texts[diet] || diet;
  }

  function getSupplementsText(supplements) {
    const texts = {
      'yes-targeted': 'спеціальні',
      'yes-general': 'загальні',
      'occasionally': 'іноді',
      'no': 'не приймаю'
    };
    return texts[supplements] || supplements;
  }

  function getWashingText(washing) {
    const texts = {
      'daily': 'щодня',
      'every-other': 'через день',
      '2-3-times': '2-3 рази/тиждень',
      'weekly': 'раз/тиждень',
      'less': 'рідше'
    };
    return texts[washing] || washing;
  }

  function getHeatText(heat) {
    const texts = {
      'never': 'ніколи',
      'rarely': 'рідко',
      'sometimes': 'іноді',
      'often': 'часто',
      'daily': 'щодня'
    };
    return texts[heat] || heat;
  }

  function getChemicalText(chemical) {
    const texts = {
      'none': 'немає',
      'occasional': 'іноді',
      'regular': 'регулярно',
      'frequent': 'часто'
    };
    return texts[chemical] || chemical;
  }

  function getMassageText(massage) {
    const texts = {
      'daily': 'щодня',
      'several-times': 'кілька разів',
      'weekly': 'раз/тиждень',
      'rarely': 'рідко',
      'never': 'ніколи'
    };
    return texts[massage] || massage;
  }
});