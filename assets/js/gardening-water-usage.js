document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('water-usage-form');
  const result = document.getElementById('water-usage-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const gardenArea = parseFloat(document.getElementById('gardenArea').value);
      const gardenType = document.getElementById('gardenType').value;
      const plantDensity = document.getElementById('plantDensity').value;
      const plantMaturity = document.getElementById('plantMaturity').value;
      
      const soilType = document.getElementById('soilType').value;
      const climateZone = document.getElementById('climateZone').value;
      const sunExposure = document.getElementById('sunExposure').value;
      const windExposure = document.getElementById('windExposure').value;
      
      const irrigationMethod = document.getElementById('irrigationMethod').value;
      const irrigationEfficiency = parseFloat(document.getElementById('irrigationEfficiency').value);
      const mulchCoverage = parseFloat(document.getElementById('mulchCoverage').value);
      const rainwaterCollection = document.getElementById('rainwaterCollection').value;
      
      const season = document.getElementById('season').value;
      const averageTemp = parseFloat(document.getElementById('averageTemp').value);
      const humidity = parseFloat(document.getElementById('humidity').value);
      const weeklyRainfall = parseFloat(document.getElementById('weeklyRainfall').value);
      const waterCost = parseFloat(document.getElementById('waterCost').value);
      
      const maxYield = document.getElementById('maxYield').checked;
      const conserveWater = document.getElementById('conserveWater').checked;
      const reduceWeeds = document.getElementById('reduceWeeds').checked;
      const preventDisease = document.getElementById('preventDisease').checked;
      const lowMaintenance = document.getElementById('lowMaintenance').checked;
      
      if (gardenArea <= 0 || averageTemp < -20 || averageTemp > 50) {
        result.textContent = "Будь ласка, заповніть всі поля дійсними значеннями.";
        return;
      }

      // Calculate base water requirements
      const baseWaterNeeds = calculateBaseWaterNeeds(gardenType, plantMaturity);
      
      // Apply environmental adjustments
      const environmentAdjustment = calculateEnvironmentalAdjustment(
        soilType, climateZone, sunExposure, windExposure, averageTemp, humidity, season
      );
      
      // Calculate irrigation needs
      const irrigationNeeds = calculateIrrigationNeeds(
        baseWaterNeeds, environmentAdjustment, plantDensity, mulchCoverage, weeklyRainfall
      );
      
      // Calculate water application
      const waterApplication = calculateWaterApplication(
        gardenArea, irrigationNeeds, irrigationMethod, irrigationEfficiency
      );
      
      // Calculate costs
      const costs = calculateWaterCosts(waterApplication, waterCost);
      
      // Calculate conservation potential
      const conservation = calculateConservationPotential(
        waterApplication, mulchCoverage, rainwaterCollection, irrigationMethod
      );
      
      // Generate recommendations
      const recommendations = getWateringRecommendations(
        irrigationNeeds, soilType, gardenType, season, maxYield, conserveWater
      );
      
      // Generate watering schedule
      const schedule = generateWateringSchedule(
        irrigationNeeds, soilType, season, preventDisease, lowMaintenance
      );

      const gardenTypeLabels = {
        'vegetable': 'Овочевий сад',
        'flower': 'Квітковий сад',
        'mixed': 'Змішаний сад',
        'lawn': 'Газон',
        'trees-shrubs': 'Дерева та кущі',
        'container': 'Контейнерний сад',
        'herb': 'Трав\'яний сад'
      };

      const soilTypeLabels = {
        'clay': 'Глинистий',
        'loam': 'Суглинок',
        'sandy': 'Піщаний',
        'silty': 'Мулистий',
        'rocky': 'Кам\'янистий'
      };

      const irrigationLabels = {
        'hand': 'Ручний полив',
        'sprinkler': 'Розпилювачі',
        'drip': 'Крапельне зрошення',
        'soaker': 'Сочасі шланги',
        'micro-spray': 'Мікророзпилювачі',
        'overhead': 'Верхнє зрошення'
      };

      result.innerHTML = `
        <div class="result-section">
          <h4>🌱 Основна інформація:</h4>
          <p>Площа саду: ${gardenArea} м²</p>
          <p>Тип саду: ${gardenTypeLabels[gardenType]}</p>
          <p>Тип ґрунту: ${soilTypeLabels[soilType]}</p>
          <p>Метод поливу: ${irrigationLabels[irrigationMethod]}</p>
          <p>Ефективність системи: ${irrigationEfficiency}%</p>
        </div>
        
        <div class="result-water-needs">
          <h4>💧 Потреби у воді:</h4>
          <p><strong>Базова потреба: ${baseWaterNeeds.toFixed(1)} мм/тиждень</strong></p>
          <p>З урахуванням умов: ${irrigationNeeds.needed.toFixed(1)} мм/тиждень</p>
          <p>Опади цього тижня: ${weeklyRainfall} мм</p>
          <p><strong>Потрібно додати поливом: ${irrigationNeeds.additional.toFixed(1)} мм/тиждень</strong></p>
          <p>Літрів на тиждень: ${waterApplication.litersPerWeek.toFixed(0)} л</p>
          <p>Літрів на м²: ${(waterApplication.litersPerWeek / gardenArea).toFixed(1)} л/м²</p>
        </div>
        
        <div class="result-application">
          <h4>🚿 Застосування води:</h4>
          <p>Загальна потреба (з втратами): ${waterApplication.totalWithLosses.toFixed(0)} л/тиждень</p>
          <p>Час поливу за сеанс: ${waterApplication.timePerSession.toFixed(0)} хвилин</p>
          <p>Частота поливу: ${waterApplication.frequency}</p>
          <p>Літрів за сеанс: ${waterApplication.litersPerSession.toFixed(0)} л</p>
          <p>Глибина промочування: ${waterApplication.soakDepth.toFixed(1)} см</p>
        </div>
        
        <div class="result-environmental">
          <h4>🌡️ Екологічні фактори:</h4>
          <p>Температурний коефіцієнт: ${(environmentAdjustment.temperature * 100).toFixed(0)}%</p>
          <p>Вплив вологості: ${(environmentAdjustment.humidity * 100).toFixed(0)}%</p>
          <p>Вплив вітру: ${(environmentAdjustment.wind * 100).toFixed(0)}%</p>
          <p>Сезонний фактор: ${(environmentAdjustment.season * 100).toFixed(0)}%</p>
          <p>Загальна корекція: ${(environmentAdjustment.total * 100).toFixed(0)}%</p>
        </div>
        
        <div class="result-costs">
          <h4>💰 Витрати на воду:</h4>
          <p><strong>Тижневі витрати: ${costs.weekly.toFixed(2)} грн</strong></p>
          <p>Місячні витрати: ${costs.monthly.toFixed(2)} грн</p>
          <p>Річні витрати: ${costs.yearly.toFixed(0)} грн</p>
          <p>Вартість на м²: ${costs.perSqM.toFixed(2)} грн/м²/рік</p>
          <p>Вартість літра: ${waterCost.toFixed(2)} грн/м³</p>
        </div>
        
        <div class="result-conservation">
          <h4>🌿 Потенціал збереження:</h4>
          <p>Економія від мульчі: ${conservation.mulchSavings.toFixed(0)} л/тиждень (${(conservation.mulchSavings * waterCost / 1000).toFixed(2)} грн)</p>
          <p>Ефективність зрошення: економія ${conservation.irrigationSavings.toFixed(0)} л/тиждень</p>
          <p>Збір дощової води: ${conservation.rainwaterPotential.toFixed(0)} л/тиждень</p>
          <p><strong>Загальна економія: ${conservation.totalSavings.toFixed(0)} л/тиждень (${(conservation.totalSavings * waterCost / 1000).toFixed(2)} грн)</strong></p>
          <p>Річна економія: ${(conservation.totalSavings * 52 * waterCost / 1000).toFixed(0)} грн</p>
        </div>
        
        <div class="result-schedule">
          <h4>📅 Графік поливу:</h4>
          ${schedule.map((day, index) => `
            <p><strong>${getDayName(index)}:</strong> ${day.action} ${day.duration ? `(${day.duration} хв)` : ''} ${day.note ? `- ${day.note}` : ''}</p>
          `).join('')}
        </div>
        
        <div class="result-recommendations">
          <h4>💡 Рекомендації:</h4>
          ${recommendations.map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-seasonal-tips">
          <h4>🌤️ Сезонні поради:</h4>
          ${getSeasonalTips(season, gardenType, climateZone).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-troubleshooting">
          <h4>⚠️ Вирішення проблем:</h4>
          ${getTroubleshootingTips(soilType, irrigationMethod, plantMaturity).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-efficiency">
          <h4>⚡ Підвищення ефективності:</h4>
          ${getEfficiencyTips(irrigationMethod, mulchCoverage, rainwaterCollection, conserveWater).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-technology">
          <h4>🤖 Технологічні рішення:</h4>
          <p>💧 Датчики вологості ґрунту: автоматичний контроль поливу</p>
          <p>⏰ Програмовані таймери: полив у оптимальний час</p>
          <p>📱 Розумні системи: віддалене управління через додаток</p>
          <p>🌦️ Датчики дощу: автоматичне відключення під час опадів</p>
          <p>📊 Лічильники води: точний облік споживання</p>
        </div>
        
        <div class="result-plant-specific">
          <h4>🌱 Специфічні потреби рослин:</h4>
          ${getPlantSpecificTips(gardenType, plantMaturity).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-emergency">
          <h4>🚨 Екстрені ситуації:</h4>
          <p>🔥 Спекотна хвиля: збільшіть полив на 50%, додайте тінь</p>
          <p>☔ Надмірні дощі: припиніть полив, забезпечте дренаж</p>
          <p>🌪️ Сильний вітер: збільшіть частоту, зменшіть тривалість</p>
          <p>❄️ Заморозки: не поливайте замерзлий ґрунт</p>
          <p>🏜️ Посуха: пріоритет життєво важливим рослинам</p>
        </div>
      `;
    });
  }

  function calculateBaseWaterNeeds(gardenType, plantMaturity) {
    // Base water needs in mm per week
    const baseNeeds = {
      'vegetable': 35,
      'flower': 25,
      'mixed': 30,
      'lawn': 25,
      'trees-shrubs': 20,
      'container': 40,
      'herb': 20
    };

    const maturityMultipliers = {
      'seedling': 1.5,
      'young': 1.2,
      'mature': 1.0,
      'mixed': 1.1
    };

    return (baseNeeds[gardenType] || 30) * (maturityMultipliers[plantMaturity] || 1.0);
  }

  function calculateEnvironmentalAdjustment(soilType, climateZone, sunExposure, windExposure, temp, humidity, season) {
    // Temperature adjustment (baseline 20°C)
    let tempAdjustment = 1.0;
    if (temp > 25) {
      tempAdjustment += (temp - 25) * 0.03;
    } else if (temp < 15) {
      tempAdjustment -= (15 - temp) * 0.02;
    }

    // Humidity adjustment
    const humidityAdjustment = humidity < 50 ? 1.2 : humidity > 70 ? 0.9 : 1.0;

    // Wind adjustment
    const windAdjustments = {
      'sheltered': 0.9,
      'moderate': 1.0,
      'windy': 1.15,
      'very-windy': 1.3
    };

    // Sun exposure adjustment
    const sunAdjustments = {
      'full-shade': 0.7,
      'partial-shade': 0.85,
      'partial-sun': 1.0,
      'full-sun': 1.15
    };

    // Seasonal adjustment
    const seasonAdjustments = {
      'spring': 0.8,
      'summer': 1.2,
      'fall': 0.9,
      'winter': 0.6
    };

    // Soil type adjustment
    const soilAdjustments = {
      'clay': 0.85,     // Retains water longer
      'loam': 1.0,      // Baseline
      'sandy': 1.25,    // Drains quickly
      'silty': 0.95,    // Good retention
      'rocky': 1.4      // Poor retention
    };

    const total = tempAdjustment * 
                  humidityAdjustment * 
                  (windAdjustments[windExposure] || 1.0) * 
                  (sunAdjustments[sunExposure] || 1.0) * 
                  (seasonAdjustments[season] || 1.0) * 
                  (soilAdjustments[soilType] || 1.0);

    return {
      temperature: tempAdjustment,
      humidity: humidityAdjustment,
      wind: windAdjustments[windExposure] || 1.0,
      sun: sunAdjustments[sunExposure] || 1.0,
      season: seasonAdjustments[season] || 1.0,
      soil: soilAdjustments[soilType] || 1.0,
      total: total
    };
  }

  function calculateIrrigationNeeds(baseNeeds, environmentAdjustment, plantDensity, mulchCoverage, rainfall) {
    const densityMultipliers = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.15,
      'intensive': 1.3
    };

    const adjustedNeeds = baseNeeds * environmentAdjustment.total * (densityMultipliers[plantDensity] || 1.0);
    
    // Mulch reduces water needs
    const mulchReduction = (mulchCoverage / 100) * 0.3; // Up to 30% reduction
    const needsWithMulch = adjustedNeeds * (1 - mulchReduction);
    
    // Account for rainfall
    const additionalNeeded = Math.max(0, needsWithMulch - rainfall);

    return {
      base: baseNeeds,
      adjusted: adjustedNeeds,
      needed: needsWithMulch,
      additional: additionalNeeded,
      rainfall: rainfall
    };
  }

  function calculateWaterApplication(gardenArea, irrigationNeeds, irrigationMethod, efficiency) {
    const litersPerWeek = (irrigationNeeds.additional / 10) * gardenArea; // mm to cm, then to liters
    const efficiencyFactor = 100 / efficiency;
    const totalWithLosses = litersPerWeek * efficiencyFactor;

    // Irrigation frequency and duration based on method and soil
    const frequencies = {
      'hand': 'Щодня в спеку, через день в помірну погоду',
      'sprinkler': '2-3 рази на тиждень',
      'drip': 'Щодня короткими сеансами',
      'soaker': '2-3 рази на тиждень',
      'micro-spray': 'Щодня в спеку, через день інколи',
      'overhead': '2-3 рази на тиждень'
    };

    const sessionsPerWeek = {
      'hand': 5,
      'sprinkler': 3,
      'drip': 7,
      'soaker': 3,
      'micro-spray': 5,
      'overhead': 3
    };

    const sessions = sessionsPerWeek[irrigationMethod] || 3;
    const litersPerSession = totalWithLosses / sessions;
    
    // Estimate application time (assuming 10L/min average flow rate)
    const timePerSession = litersPerSession / 10;
    
    // Estimate soil penetration depth
    const soakDepth = (irrigationNeeds.additional / 10) * 10; // Rough estimate in cm

    return {
      litersPerWeek: litersPerWeek,
      totalWithLosses: totalWithLosses,
      litersPerSession: litersPerSession,
      timePerSession: timePerSession,
      frequency: frequencies[irrigationMethod] || '2-3 рази на тиждень',
      sessionsPerWeek: sessions,
      soakDepth: soakDepth
    };
  }

  function calculateWaterCosts(waterApplication, waterCost) {
    const weeklyVolume = waterApplication.totalWithLosses / 1000; // Convert to m³
    const weekly = weeklyVolume * waterCost;
    const monthly = weekly * 4.33;
    const yearly = weekly * 52;
    
    return {
      weekly: weekly,
      monthly: monthly,
      yearly: yearly,
      perSqM: yearly / parseFloat(document.getElementById('gardenArea').value)
    };
  }

  function calculateConservationPotential(waterApplication, mulchCoverage, rainwaterCollection, irrigationMethod) {
    // Mulch savings (potential if not already using)
    const maxMulchSavings = waterApplication.litersPerWeek * 0.3;
    const currentMulchSavings = maxMulchSavings * (mulchCoverage / 100);
    const additionalMulchSavings = maxMulchSavings - currentMulchSavings;

    // Irrigation efficiency savings
    const efficiencyPotential = {
      'hand': 0.05,
      'sprinkler': 0.15,
      'drip': 0.02,
      'soaker': 0.08,
      'micro-spray': 0.05,
      'overhead': 0.20
    };
    const irrigationSavings = waterApplication.litersPerWeek * (efficiencyPotential[irrigationMethod] || 0.1);

    // Rainwater collection potential
    const collectionPotential = {
      'none': waterApplication.litersPerWeek * 0.5,
      'basic': waterApplication.litersPerWeek * 0.3,
      'advanced': waterApplication.litersPerWeek * 0.1,
      'comprehensive': 0
    };

    const totalSavings = additionalMulchSavings + irrigationSavings + (collectionPotential[rainwaterCollection] || 0);

    return {
      mulchSavings: additionalMulchSavings,
      irrigationSavings: irrigationSavings,
      rainwaterPotential: collectionPotential[rainwaterCollection] || 0,
      totalSavings: totalSavings
    };
  }

  function getWateringRecommendations(irrigationNeeds, soilType, gardenType, season, maxYield, conserveWater) {
    const recommendations = [];
    
    if (irrigationNeeds.additional > 40) {
      recommendations.push('💧 Високі потреби у воді - розгляньте крапельне зрошення для ефективності');
    }
    
    if (soilType === 'sandy') {
      recommendations.push('🏖️ Піщаний ґрунт: поливайте частіше меншими порціями');
    } else if (soilType === 'clay') {
      recommendations.push('🏺 Глинистий ґрунт: поливайте рідше, але глибше');
    }
    
    if (season === 'summer') {
      recommendations.push('☀️ Літній полив: поливайте рано вранці (5-9 годин) для мінімізації випаровування');
    }
    
    if (maxYield) {
      recommendations.push('🎯 Для максимального врожаю: підтримуйте постійну вологість без переливу');
    }
    
    if (conserveWater) {
      recommendations.push('🌿 Економія води: використовуйте мульчу та групуйте рослини за потребами у воді');
    }
    
    if (gardenType === 'container') {
      recommendations.push('🪴 Контейнерний сад: перевіряйте вологість щодня, контейнери висихають швидше');
    }
    
    recommendations.push('📏 Використовуйте дощомір для відстеження природних опадів');
    recommendations.push('👆 Перевіряйте вологість ґрунту пальцем на глибині 5-10 см');
    
    return recommendations;
  }

  function generateWateringSchedule(irrigationNeeds, soilType, season, preventDisease, lowMaintenance) {
    const schedule = [];
    const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
    
    // Base schedule depends on soil type and maintenance preference
    let wateringDays = [];
    let duration = 30;
    
    if (soilType === 'sandy') {
      wateringDays = lowMaintenance ? [1, 3, 5] : [1, 2, 3, 4, 5];
      duration = 20;
    } else if (soilType === 'clay') {
      wateringDays = [1, 4];
      duration = 45;
    } else {
      wateringDays = lowMaintenance ? [1, 4] : [1, 3, 5];
      duration = 30;
    }
    
    if (season === 'summer') {
      duration += 10;
    } else if (season === 'winter') {
      duration = Math.max(10, duration - 15);
      wateringDays = wateringDays.slice(0, Math.max(1, wateringDays.length - 1));
    }
    
    for (let i = 0; i < 7; i++) {
      if (wateringDays.includes(i)) {
        let note = '';
        if (preventDisease && i === 0) {
          note = 'Ранковий полив для запобігання хворобам';
        }
        if (irrigationNeeds.additional < 10 && i > 2) {
          note = 'Перевірте вологість перед поливом';
        }
        
        schedule.push({
          action: 'Полив',
          duration: duration,
          note: note
        });
      } else {
        schedule.push({
          action: 'Перевірка вологості',
          duration: null,
          note: 'Оцініть стан рослин'
        });
      }
    }
    
    return schedule;
  }

  function getSeasonalTips(season, gardenType, climateZone) {
    const tips = [];
    
    switch (season) {
      case 'spring':
        tips.push('🌱 Весна: Поступово збільшуйте полив з потеплінням');
        tips.push('🌧️ Використовуйте природні дощі, доповнюйте за потребою');
        break;
      case 'summer':
        tips.push('☀️ Літо: Пік поливного сезону, моніторте щодня');
        tips.push('🌡️ Уникайте поливу в найспекотніші години дня');
        break;
      case 'fall':
        tips.push('🍂 Осінь: Зменшуйте полив, готуйте рослини до зими');
        tips.push('🌿 Збирайте листя для компосту та мульчі');
        break;
      case 'winter':
        tips.push('❄️ Зима: Мінімальний полив, захищайте від вимерзання');
        tips.push('🏠 Поливайте тільки кімнатні та контейнерні рослини');
        break;
    }
    
    if (climateZone === 'dry') {
      tips.push('🏜️ Посушливий клімат: Інвестуйте в водозберігаючі технології');
    }
    
    return tips;
  }

  function getTroubleshootingTips(soilType, irrigationMethod, plantMaturity) {
    const tips = [];
    
    tips.push('🟡 Пожовтіння листя: можливо переполив або недостача азоту');
    tips.push('💧 В\'янення при вологому ґрунті: проблеми з корінням або дренажем');
    tips.push('🦠 Грибкові захворювання: поливайте ранком, уникайте змочування листя');
    
    if (soilType === 'clay') {
      tips.push('🏺 Глинистий ґрунт: якщо вода стоїть на поверхні, зробіть перерву');
    }
    
    if (irrigationMethod === 'overhead') {
      tips.push('☔ Верхнє зрошення: переключіться на ранковий полив для зменшення захворювань');
    }
    
    if (plantMaturity === 'seedling') {
      tips.push('🌱 Саджанці: підтримуйте постійну легку вологість, не перезволожуйте');
    }
    
    return tips;
  }

  function getEfficiencyTips(irrigationMethod, mulchCoverage, rainwaterCollection, conserveWater) {
    const tips = [];
    
    if (irrigationMethod !== 'drip') {
      tips.push('💧 Перехід на крапельне зрошення може заощадити до 50% води');
    }
    
    if (mulchCoverage < 80) {
      tips.push('🌾 Збільшення мульчування до 80% може зменшити потреби у воді на 25%');
    }
    
    if (rainwaterCollection === 'none') {
      tips.push('☔ Встановіть збірники дощової води для безкоштовного джерела поливу');
    }
    
    if (conserveWater) {
      tips.push('🌿 Групуйте рослини з подібними потребами у воді');
      tips.push('📊 Встановіть датчики вологості для точного моніторингу');
    }
    
    tips.push('⏰ Використовуйте таймери поливу для автоматизації графіку');
    tips.push('🌦️ Встановіть датчик дощу для автоматичного відключення');
    
    return tips;
  }

  function getPlantSpecificTips(gardenType, plantMaturity) {
    const tips = [];
    
    switch (gardenType) {
      case 'vegetable':
        tips.push('🥕 Овочі: Плоди потребують більше води, листя - менше');
        tips.push('🍅 Помідори: Рівномірний полив запобігає тріщинам та гнилі');
        break;
      case 'flower':
        tips.push('🌸 Квіти: Уникайте змочування пелюстків для довшого цвітіння');
        break;
      case 'trees-shrubs':
        tips.push('🌳 Дерева: Глибокий, рідкий полив краще за часті поверхневі');
        break;
      case 'herb':
        tips.push('🌿 Трави: Більшість трав віддають перевагу злегка сухому ґрунту');
        break;
      case 'container':
        tips.push('🪴 Контейнери: Перевіряйте дренажні отвори, поливайте до стікання');
        break;
    }
    
    if (plantMaturity === 'seedling') {
      tips.push('🌱 Саджанці потребують частого, але легкого поливу');
    } else if (plantMaturity === 'mature') {
      tips.push('🌳 Дорослі рослини віддають перевагу глибокому, рідшому поливу');
    }
    
    return tips;
  }

  function getDayName(index) {
    const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
    return days[index];
  }
});