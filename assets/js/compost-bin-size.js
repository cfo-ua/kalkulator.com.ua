document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('compost-size-form');
  const result = document.getElementById('compost-size-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const householdSize = parseInt(document.getElementById('household-size').value);
      const cookingHabits = document.getElementById('cooking-habits').value;
      const yardSize = document.getElementById('yard-size').value;
      const gardeningActivity = document.getElementById('gardening-activity').value;
      const compostingMethod = document.getElementById('composting-method').value;
      const availableSpace = document.getElementById('available-space').value;
      const experienceLevel = document.getElementById('experience-level').value;
      const yardWaste = document.getElementById('yard-waste').value;
      const compostUsage = document.getElementById('compost-usage').value;
      
      if (!householdSize || !cookingHabits || !yardSize || !gardeningActivity || !compostingMethod || !availableSpace || !experienceLevel || !yardWaste || !compostUsage) {
        result.textContent = "Будь ласка, заповніть всі поля.";
        return;
      }
      
      // Parse input data
      const [cookingLevel, cookingMultiplier] = cookingHabits.split(',');
      const [yardLevel, yardMultiplier] = yardSize.split(',');
      const [gardenLevel, gardenMultiplier] = gardeningActivity.split(',');
      const [methodName, baseSize, methodType] = compostingMethod.split(',');
      const [spaceLevel, spaceMultiplier] = availableSpace.split(',');
      const [expLevel, expMultiplier] = experienceLevel.split(',');
      const [wasteLevel, wasteMultiplier] = yardWaste.split(',');
      const [usageLevel, usageMultiplier] = compostUsage.split(',');
      
      // Calculate daily organic waste generation (kg per day)
      const baseWastePerPerson = 0.6; // kg per person per day (kitchen scraps) - adapted for Ukraine
      const cookingFactor = parseFloat(cookingMultiplier);
      const yardFactor = parseFloat(yardMultiplier);
      const gardenFactor = parseFloat(gardenMultiplier);
      const spaceFactor = parseFloat(spaceMultiplier);
      const expFactor = parseFloat(expMultiplier);
      const wasteFactor = parseFloat(wasteMultiplier);
      const usageFactor = parseFloat(usageMultiplier);
      
      // Calculate total daily waste
      const kitchenWasteDaily = householdSize * baseWastePerPerson * cookingFactor;
      const yardWasteDaily = householdSize * 0.25 * wasteFactor; // Yard waste varies more
      const totalWasteDaily = kitchenWasteDaily + yardWasteDaily;
      
      // Calculate weekly and annual waste
      const weeklyWaste = totalWasteDaily * 7;
      const annualWaste = totalWasteDaily * 365;
      
      // Convert to volume (compost materials are roughly 300-400 kg per cubic meter)
      const kgPerCubicMeter = 350; // Approximate for fresh organic materials
      const dailyVolume = totalWasteDaily / kgPerCubicMeter * 1000; // Convert to liters
      const weeklyVolume = weeklyWaste / kgPerCubicMeter * 1000;
      const annualVolume = annualWaste / kgPerCubicMeter * 1000;
      
      // Calculate recommended bin size based on method
      let recommendedSize = parseInt(baseSize);
      
      if (methodType !== 'worm-bin') {
        // Adjust size based on factors
        recommendedSize = recommendedSize * spaceFactor * expFactor * usageFactor;
        
        // Ensure minimum size for hot composting
        if (methodType === 'open-pile' || methodType === 'wire' || methodType === 'wooden') {
          recommendedSize = Math.max(27, recommendedSize); // 765 liters minimum (27 cubic feet)
        }
        
        // Account for household size directly
        recommendedSize += (householdSize - 2) * 10; // Extra 10 cubic feet per person over 2
        
        // Account for total waste volume (need to handle at least 6 months of input)
        const minimumForWaste = weeklyVolume * 26 / 28.3; // 6 months of waste, convert liters to cubic feet
        recommendedSize = Math.max(recommendedSize, minimumForWaste);
      } else {
        // Worm composting is different - based on feeding rate
        recommendedSize = Math.max(2, kitchenWasteDaily * 4.4); // 2 cubic feet per kg daily kitchen waste (converted)
      }
      
      // Convert final size to liters for display
      const recommendedSizeL = recommendedSize * 28.3; // Convert cubic feet to liters
      
      // Calculate production estimates
      const compostReductionFactor = 0.35; // Materials reduce to about 35% of original volume
      const annualCompostProduction = annualVolume * compostReductionFactor;
      const compostPerSqM = 14; // Liters of compost per square meter of garden annually
      const gardenAreaCovered = annualCompostProduction / compostPerSqM;
      
      // Calculate costs (in UAH)
      const binCosts = {
        'tumbler': 6000,
        'wire': 1500,
        'wooden': 4500,
        'three-bin': 9000,
        'open-pile': 750,
        'worm-bin': 3000
      };
      
      const estimatedCost = binCosts[methodName] || 3000;
      
      // Environmental calculations
      const wasteReduction = annualWaste; // kg diverted from landfill
      const co2Savings = wasteReduction * 0.5; // Approximate CO2 savings (kg)
      const fertilizerSavings = annualCompostProduction / 20; // Approximate fertilizer replacement (kg)
      
      // Timeline calculations
      const compostTimeline = getCompostTimeline(methodType);
      const maintenanceSchedule = getMaintenanceSchedule(methodType);
      
      // Display results
      displayResults({
        householdSize,
        methodType,
        methodName,
        recommendedSize: recommendedSizeL,
        totalWasteDaily,
        weeklyWaste,
        annualWaste,
        annualCompostProduction,
        gardenAreaCovered,
        estimatedCost,
        wasteReduction,
        co2Savings,
        fertilizerSavings,
        compostTimeline,
        maintenanceSchedule,
        cookingLevel,
        yardLevel,
        gardenLevel,
        expLevel
      });
    });
  }

  function getCompostTimeline(methodType) {
    const timelines = {
      'tumbler': '6-8 тижнів з регулярним перемішуванням',
      'wire': '3-6 місяців з періодичним перемішуванням',
      'wooden': '3-6 місяців з хорошою ізоляцією',
      'three-bin': 'Безперервне виробництво цілий рік',
      'open-pile': '6-12 місяців залежно від обслуговування',
      'worm-bin': '3-6 місяців для готових відливок'
    };
    return timelines[methodType] || '3-6 місяців';
  }

  function getMaintenanceSchedule(methodType) {
    const schedules = {
      'tumbler': 'Перемішувати 2-3 рази на тиждень, моніторити вологість',
      'wire': 'Перемішувати кожні 2-3 тижні, додавати коричневі матеріали',
      'wooden': 'Перемішувати щомісяця, перевіряти температуру',
      'three-bin': 'Переміщати матеріал між ящиками кожні 2-3 місяці',
      'open-pile': 'Перемішувати кожні 4-6 тижнів, додавати матеріали шарами',
      'worm-bin': 'Годувати тижнево, збирати відливки кожні 3-6 місяців'
    };
    return schedules[methodType] || 'Перемішувати щомісяця';
  }

  function displayResults(data) {
    result.innerHTML = `
      <div class="insight-card">
        <h4>📦 Рекомендований розмір компостного ящика</h4>
        <p><strong>Тип системи:</strong> ${getMethodName(data.methodName)}</p>
        <p><strong>Рекомендований об'єм: ${data.recommendedSize.toFixed(0)} літрів</strong></p>
        <p><strong>Орієнтовна вартість: ${data.estimatedCost.toFixed(0)} грн</strong></p>
        <p>Для домогосподарства з ${data.householdSize} осіб</p>
      </div>

      <div class="insight-card">
        <h4>♻️ Обробка відходів</h4>
        <p><strong>Щоденні органічні відходи: ${data.totalWasteDaily.toFixed(1)} кг</strong></p>
        <p>Тижневі відходи: ${data.weeklyWaste.toFixed(1)} кг</p>
        <p>Річні відходи: ${data.annualWaste.toFixed(0)} кг</p>
        <p><strong>Річне виробництво компосту: ${data.annualCompostProduction.toFixed(0)} літрів</strong></p>
        <p>Покриття площі саду: ${data.gardenAreaCovered.toFixed(1)} кв. м</p>
      </div>

      <div class="insight-card">
        <h4>🌱 Екологічні переваги</h4>
        <p><strong>Зменшення відходів: ${data.wasteReduction.toFixed(0)} кг/рік</strong></p>
        <p>Економія CO₂: ${data.co2Savings.toFixed(0)} кг/рік</p>
        <p>Заміна добрив: ${data.fertilizerSavings.toFixed(1)} кг/рік</p>
        <p>Відведення зі звалища: ${((data.wasteReduction / 1000) * 100).toFixed(1)}% відходів домогосподарства</p>
      </div>

      <div class="insight-card">
        <h4>⏰ Часова шкала та обслуговування</h4>
        <p><strong>Час до готового компосту:</strong> ${data.compostTimeline}</p>
        <p><strong>Графік обслуговування:</strong> ${data.maintenanceSchedule}</p>
        <p><strong>Рівень досвіду:</strong> ${getExperienceName(data.expLevel)}</p>
      </div>

      <div class="insight-card">
        <h4>📋 Рекомендації з налаштування</h4>
        ${getSetupRecommendations(data).map(rec => `<p>${rec}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>🎯 Поради для успіху</h4>
        ${getSuccessTips(data.methodType, data.expLevel).map(tip => `<p>${tip}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>📏 Розміри ящика</h4>
        ${getBinDimensions(data.recommendedSize, data.methodType).map(dim => `<p>${dim}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>🌿 Що компостувати</h4>
        <p><strong>✅ Зелені матеріали (азот):</strong></p>
        <p>• Кухонні обрізки (шкірка овочів/фруктів)</p>
        <p>• Кавова гуща та чайні пакетики</p>
        <p>• Свіжа скошена трава</p>
        <p>• Свіжі садові обрізки</p>
        
        <p><strong>✅ Коричневі матеріали (вуглець):</strong></p>
        <p>• Сухе листя</p>
        <p>• Подрібнений папір та картон</p>
        <p>• Солома та сіно</p>
        <p>• Дрібні гілки та тирса</p>
        
        <p><strong>❌ Не компостувати:</strong></p>
        <p>• М'ясо, рибу, молочні продукти</p>
        <p>• Жири та масла</p>
        <p>• Екскременти домашніх тварин</p>
        <p>• Хворі рослини</p>
      </div>

      <div class="insight-card">
        <h4>💰 Економічні переваги</h4>
        <p><strong>Річна економія:</strong></p>
        <p>• Добрива: ${(data.fertilizerSavings * 50).toFixed(0)} грн</p>
        <p>• Зменшення вивозу сміття: ${(data.wasteReduction * 2).toFixed(0)} грн</p>
        <p>• Покращення ґрунту: ${(data.gardenAreaCovered * 100).toFixed(0)} грн цінності</p>
        <p><strong>Окупність через:</strong> ${(data.estimatedCost / ((data.fertilizerSavings * 50) + (data.wasteReduction * 2))).toFixed(1)} років</p>
      </div>
    `;
  }

  function getMethodName(methodName) {
    const names = {
      'tumbler': 'Барабанний ящик',
      'wire': 'Дротяний ящик',
      'wooden': 'Дерев\'яний ящик',
      'three-bin': 'Система з трьох ящиків',
      'open-pile': 'Відкрита купа',
      'worm-bin': 'Черв\'ячний ящик'
    };
    return names[methodName] || methodName;
  }

  function getExperienceName(expLevel) {
    const names = {
      'beginner': 'Початківець',
      'some': 'Деякий досвід',
      'experienced': 'Досвідчений'
    };
    return names[expLevel] || expLevel;
  }

  function getSetupRecommendations(data) {
    const recommendations = [];
    
    if (data.methodType === 'tumbler') {
      recommendations.push('🔄 Розмістіть барабан у частково затіненому місці для легкого доступу');
      recommendations.push('⚖️ Підтримуйте співвідношення зелених до коричневих матеріалів 1:3');
    } else if (data.methodType === 'three-bin') {
      recommendations.push('📍 Розмістіть ящики в ряд для легкого переміщення матеріалу');
      recommendations.push('🔄 Використовуйте систему ротації: заповнення → активне → дозрівання');
    } else if (data.methodType === 'worm-bin') {
      recommendations.push('🏠 Тримайте при температурі 15-25°C, уникайте прямого сонячного світла');
      recommendations.push('💧 Підтримуйте вологість, як відтиснута губка');
    } else {
      recommendations.push('📍 Виберіть добре дренований, частково затінений майданчик');
      recommendations.push('🌡️ Забезпечте хорошу циркуляцію повітря навколо ящика');
    }
    
    if (data.gardenLevel === 'extensive') {
      recommendations.push('🌱 Розгляньте декілька ящиків для безперервного виробництва');
    }
    
    if (data.expLevel === 'beginner') {
      recommendations.push('📚 Почніть з простих рецептів компостування та ведіть журнал');
    }
    
    recommendations.push('🕒 Плануйте розмістити ящик у межах 30 метрів від кухні');
    
    return recommendations;
  }

  function getSuccessTips(methodType, expLevel) {
    const tips = [];
    
    if (expLevel === 'beginner') {
      tips.push('📖 Дотримуйтесь правила 30:1 (коричневе:зелене) для оптимального розкладання');
      tips.push('💧 Компост повинен бути вологим, як відтиснута губка');
    }
    
    if (methodType === 'tumbler') {
      tips.push('🔄 Обертайте барабан кожні 2-3 дні для найкращих результатів');
      tips.push('📏 Подрібніть великі матеріали для швидшого розкладання');
    } else if (methodType === 'worm-bin') {
      tips.push('🐛 Годуйте червів малими порціями, уникайте перегодовування');
      tips.push('🥬 Червям подобаються м\'які відходи: банани, кавова гуща, листя салату');
    } else {
      tips.push('🌡️ Перевіряйте температуру - гарячий компост повинен нагріватися до 50-70°C');
      tips.push('🔄 Перемішуйте для додавання кисню та прискорення процесу');
    }
    
    tips.push('⚡ Терпіння - якісний компост потребує часу!');
    tips.push('🌿 Готовий компост повинен пахнути землею та мати темно-коричневий колір');
    
    return tips;
  }

  function getBinDimensions(volumeL, methodType) {
    const dimensions = [];
    
    if (methodType === 'worm-bin') {
      const length = Math.cbrt(volumeL * 0.001) * 100;
      dimensions.push(`📐 Приблизні розміри: ${length.toFixed(0)}×${length.toFixed(0)}×${(length*0.5).toFixed(0)} см`);
      dimensions.push(`🪣 Об'єм: ${volumeL.toFixed(0)} літрів`);
    } else if (methodType === 'tumbler') {
      const diameter = Math.cbrt(volumeL * 0.001 * 6 / Math.PI) * 100;
      dimensions.push(`🥁 Діаметр барабана: ${diameter.toFixed(0)} см`);
      dimensions.push(`📏 Довжина: ${(diameter * 1.2).toFixed(0)} см`);
    } else {
      const side = Math.cbrt(volumeL * 0.001) * 100;
      dimensions.push(`📐 Рекомендовані розміри: ${side.toFixed(0)}×${side.toFixed(0)}×${side.toFixed(0)} см`);
      dimensions.push(`📦 Об'єм: ${volumeL.toFixed(0)} літрів`);
      
      if (methodType === 'three-bin') {
        dimensions.push(`🔢 Кожен ящик: ${(side * 0.8).toFixed(0)}×${(side * 0.8).toFixed(0)}×${(side * 0.8).toFixed(0)} см`);
      }
    }
    
    return dimensions;
  }
});