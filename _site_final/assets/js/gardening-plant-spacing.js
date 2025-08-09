document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('plant-spacing-form');
  const result = document.getElementById('plant-spacing-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const plantType = document.getElementById('plantType').value;
      const plantVariety = document.getElementById('plantVariety').value;
      const customSpacing = parseFloat(document.getElementById('customSpacing').value) || 0;
      
      const gardenLength = parseFloat(document.getElementById('gardenLength').value);
      const gardenWidth = parseFloat(document.getElementById('gardenWidth').value);
      const spacingPattern = document.getElementById('spacingPattern').value;
      const pathWidth = parseFloat(document.getElementById('pathWidth').value);
      
      const soilQuality = document.getElementById('soilQuality').value;
      const gardenType = document.getElementById('gardenType').value;
      const irrigationMethod = document.getElementById('irrigationMethod').value;
      const experienceLevel = document.getElementById('experienceLevel').value;
      
      const gardeningGoal = document.getElementById('gardeningGoal').value;
      const climateZone = document.getElementById('climateZone').value;
      const companionPlanting = document.getElementById('companionPlanting').value;
      
      if (!plantType || gardenLength <= 0 || gardenWidth <= 0) {
        result.textContent = "Будь ласка, заповніть всі обов'язкові поля дійсними значеннями.";
        return;
      }

      // Calculate optimal spacing
      const spacing = calculatePlantSpacing(plantType, plantVariety, customSpacing, soilQuality, gardenType, irrigationMethod, experienceLevel, climateZone);
      
      // Calculate garden layout
      const layout = calculateGardenLayout(gardenLength, gardenWidth, spacing, spacingPattern, pathWidth);
      
      // Get plant information
      const plantInfo = getPlantInfo(plantType);
      
      // Calculate planting recommendations
      const recommendations = getPlantingRecommendations(plantType, plantVariety, spacing, soilQuality, gardenType, companionPlanting);
      
      // Calculate seasonal considerations
      const seasonal = getSeasonalConsiderations(plantType, climateZone);
      
      // Calculate care requirements
      const careRequirements = getCareRequirements(plantType, spacing, layout.plantsPerSqM);

      const plantLabels = {
        'tomato': 'Помідори',
        'pepper': 'Перець',
        'cucumber': 'Огірки',
        'lettuce': 'Салат',
        'cabbage': 'Капуста',
        'carrot': 'Морква',
        'radish': 'Редис',
        'bean': 'Квасоля',
        'peas': 'Горох',
        'potato': 'Картопля',
        'onion': 'Цибуля',
        'garlic': 'Часник',
        'basil': 'Базилік',
        'parsley': 'Петрушка',
        'dill': 'Кріп',
        'spinach': 'Шпинат',
        'beet': 'Буряк',
        'zucchini': 'Кабачки',
        'squash': 'Гарбузи',
        'custom': 'Власна рослина'
      };

      const varietyLabels = {
        'standard': 'Стандартний',
        'compact': 'Компактний/карликовий',
        'large': 'Великий/гігантський',
        'bush': 'Кущовий',
        'vining': 'В\'юнкий'
      };

      const patternLabels = {
        'square': 'Квадратна',
        'triangular': 'Трикутна (зміщена)',
        'rows': 'Рядкова',
        'intensive': 'Інтенсивна'
      };

      result.innerHTML = `
        <div class="result-section">
          <h4>🌱 Інформація про рослину:</h4>
          <p>Рослина: ${plantLabels[plantType] || plantType}</p>
          <p>Сорт: ${varietyLabels[plantVariety]}</p>
          <p>Рекомендована відстань: ${spacing.optimal} см</p>
          <p>Мінімальна відстань: ${spacing.minimum} см</p>
          <p>Максимальна відстань: ${spacing.maximum} см</p>
        </div>
        
        <div class="result-layout">
          <h4>📐 Схема саду:</h4>
          <p>Розмір ділянки: ${gardenLength} × ${gardenWidth} м (${layout.totalArea} м²)</p>
          <p>Схема посадки: ${patternLabels[spacingPattern]}</p>
          <p>Корисна площа: ${layout.plantingArea} м²</p>
          <p>Площа доріжок: ${layout.pathArea} м²</p>
          <p><strong>Загальна кількість рослин: ${layout.totalPlants}</strong></p>
          <p>Рослин на м²: ${layout.plantsPerSqM.toFixed(1)}</p>
        </div>
        
        <div class="result-spacing">
          <h4>📏 Деталі відстаней:</h4>
          <p>Відстань між рослинами: ${spacing.optimal} см</p>
          <p>Відстань між рядами: ${spacing.rowSpacing} см</p>
          <p>Кількість рядів: ${layout.rows}</p>
          <p>Рослин в ряду: ${layout.plantsPerRow}</p>
          ${spacingPattern === 'triangular' ? '<p>📊 Трикутна схема: +15% більше рослин</p>' : ''}
        </div>
        
        <div class="result-plant-info">
          <h4>🌿 Характеристики рослини:</h4>
          <p>Час до збирання: ${plantInfo.daysToHarvest} днів</p>
          <p>Розмір дорослої рослини: ${plantInfo.matureSize}</p>
          <p>Потреби у воді: ${plantInfo.waterNeeds}</p>
          <p>Світлові потреби: ${plantInfo.lightRequirements}</p>
          <p>Глибина посадки: ${plantInfo.plantingDepth}</p>
          <p>Температурні потреби: ${plantInfo.temperatureRange}</p>
        </div>
        
        <div class="result-recommendations">
          <h4>💡 Рекомендації для посадки:</h4>
          ${recommendations.map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-materials">
          <h4>📦 Необхідні матеріали:</h4>
          <p>Насіння/саджанці: ${layout.totalPlants} штук</p>
          <p>Додатково (10%): ${Math.ceil(layout.totalPlants * 0.1)} штук</p>
          <p>Компост/добрива: ${(layout.plantingArea * 5).toFixed(1)} кг</p>
          <p>Мульча: ${(layout.plantingArea * 0.05).toFixed(1)} м³</p>
          <p>Довжина підтримки (якщо потрібно): ${getSupport(plantType, layout.totalPlants)} м</p>
        </div>
        
        <div class="result-seasonal">
          <h4>📅 Сезонні міркування:</h4>
          ${seasonal.map(season => `<p>${season}</p>`).join('')}
        </div>
        
        <div class="result-care">
          <h4>🌱 Догляд та обслуговування:</h4>
          ${careRequirements.map(care => `<p>${care}</p>`).join('')}
        </div>
        
        <div class="result-companion">
          <h4>🤝 Супутні рослини:</h4>
          <p><strong>Хороші сусіди:</strong> ${getCompanionPlants(plantType).good.join(', ')}</p>
          <p><strong>Уникати поруч:</strong> ${getCompanionPlants(plantType).bad.join(', ')}</p>
          <p><strong>Переваги:</strong> ${getCompanionPlants(plantType).benefits}</p>
        </div>
        
        <div class="result-troubleshooting">
          <h4>⚠️ Поширені проблеми:</h4>
          ${getTroubleshooting(plantType, spacing.optimal, layout.plantsPerSqM).map(issue => `<p>${issue}</p>`).join('')}
        </div>
        
        <div class="result-optimization">
          <h4>🎯 Поради для оптимізації:</h4>
          ${getOptimizationTips(gardeningGoal, spacingPattern, soilQuality, experienceLevel).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-succession">
          <h4>🔄 Послідовна посадка:</h4>
          <p>Для безперервного врожаю садіть нові рослини кожні ${getSuccessionInterval(plantType)} тижнів</p>
          <p>Наступна посадка: ${getNextPlantingDate(plantType)}</p>
          <p>Оптимальний розмір ділянки для послідовності: ${(layout.plantingArea / 4).toFixed(1)} м²</p>
        </div>
        
        <div class="result-budget">
          <h4>💰 Орієнтовні витрати:</h4>
          <p>Насіння/саджанці: ${calculateSeedCost(plantType, layout.totalPlants)} грн</p>
          <p>Добрива/компост: ${((layout.plantingArea * 5) * 15).toFixed(0)} грн</p>
          <p>Мульча: ${((layout.plantingArea * 0.05) * 300).toFixed(0)} грн</p>
          <p>Підтримки (якщо потрібно): ${calculateSupportCost(plantType, layout.totalPlants)} грн</p>
          <p><strong>Загальні витрати: ${(calculateSeedCost(plantType, layout.totalPlants) + (layout.plantingArea * 5) * 15 + (layout.plantingArea * 0.05) * 300 + calculateSupportCost(plantType, layout.totalPlants)).toFixed(0)} грн</strong></p>
        </div>
        
        <div class="result-yield">
          <h4>🥕 Очікуваний врожай:</h4>
          <p>Врожай з рослини: ${getYieldPerPlant(plantType)}</p>
          <p><strong>Загальний очікуваний врожай: ${calculateTotalYield(plantType, layout.totalPlants)}</strong></p>
          <p>Врожай на м²: ${(calculateTotalYield(plantType, layout.totalPlants, true) / layout.plantingArea).toFixed(1)} кг/м²</p>
          <p>Періодичність збирання: ${getHarvestFrequency(plantType)}</p>
        </div>
      `;
    });
  }

  function calculatePlantSpacing(plantType, variety, customSpacing, soilQuality, gardenType, irrigation, experience, climate) {
    // Base spacing for different plants (in cm)
    const baseSpacings = {
      'tomato': { min: 40, opt: 60, max: 80 },
      'pepper': { min: 30, opt: 45, max: 60 },
      'cucumber': { min: 30, opt: 50, max: 70 },
      'lettuce': { min: 15, opt: 20, max: 30 },
      'cabbage': { min: 30, opt: 40, max: 50 },
      'carrot': { min: 3, opt: 5, max: 8 },
      'radish': { min: 3, opt: 5, max: 8 },
      'bean': { min: 15, opt: 20, max: 30 },
      'peas': { min: 5, opt: 10, max: 15 },
      'potato': { min: 25, opt: 35, max: 45 },
      'onion': { min: 8, opt: 12, max: 15 },
      'garlic': { min: 8, opt: 10, max: 15 },
      'basil': { min: 15, opt: 20, max: 25 },
      'parsley': { min: 10, opt: 15, max: 20 },
      'dill': { min: 15, opt: 20, max: 25 },
      'spinach': { min: 8, opt: 12, max: 18 },
      'beet': { min: 8, opt: 12, max: 18 },
      'zucchini': { min: 60, opt: 90, max: 120 },
      'squash': { min: 90, opt: 120, max: 150 },
      'custom': { min: customSpacing * 0.8, opt: customSpacing, max: customSpacing * 1.2 }
    };

    let spacing = baseSpacings[plantType] || baseSpacings['custom'];
    
    // Adjust for variety
    if (variety === 'compact') {
      spacing.opt *= 0.75;
      spacing.min *= 0.75;
      spacing.max *= 0.75;
    } else if (variety === 'large') {
      spacing.opt *= 1.25;
      spacing.min *= 1.25;
      spacing.max *= 1.25;
    }
    
    // Adjust for soil quality
    if (soilQuality === 'rich' || soilQuality === 'excellent') {
      spacing.opt *= 0.9; // Can plant closer in rich soil
    } else if (soilQuality === 'poor') {
      spacing.opt *= 1.1; // Need more space in poor soil
    }
    
    // Adjust for garden type
    if (gardenType === 'raised') {
      spacing.opt *= 0.85; // Raised beds allow closer spacing
    } else if (gardenType === 'container') {
      spacing.opt *= 0.8; // Containers can be more intensive
    }
    
    // Adjust for experience
    if (experience === 'beginner') {
      spacing.opt *= 1.1; // Beginners should use wider spacing
    } else if (experience === 'advanced') {
      spacing.opt *= 0.9; // Experienced gardeners can push boundaries
    }

    // Row spacing (typically 1.5-2x plant spacing)
    const rowSpacing = spacing.opt * 1.7;

    return {
      minimum: Math.round(spacing.min),
      optimal: Math.round(spacing.opt),
      maximum: Math.round(spacing.max),
      rowSpacing: Math.round(rowSpacing)
    };
  }

  function calculateGardenLayout(length, width, spacing, pattern, pathWidth) {
    const totalArea = length * width;
    const pathWidthM = pathWidth / 100;
    
    let plantsPerRow, rows, totalPlants, plantingArea;
    
    if (pattern === 'rows') {
      // Account for paths between rows
      const effectiveWidth = width - (Math.floor(width / 1.5) * pathWidthM);
      plantsPerRow = Math.floor((length * 100) / spacing.optimal);
      rows = Math.floor((effectiveWidth * 100) / spacing.rowSpacing);
      totalPlants = plantsPerRow * rows;
      plantingArea = totalArea - (Math.floor(width / 1.5) * pathWidthM * length);
    } else if (pattern === 'triangular') {
      // Triangular pattern fits ~15% more plants
      const spacingM = spacing.optimal / 100;
      const baseLayout = Math.floor(length / spacingM) * Math.floor(width / spacingM);
      totalPlants = Math.round(baseLayout * 1.15);
      plantsPerRow = Math.floor(length / spacingM);
      rows = Math.ceil(totalPlants / plantsPerRow);
      plantingArea = totalArea * 0.9;
    } else if (pattern === 'intensive') {
      // Intensive uses minimum spacing
      const spacingM = spacing.minimum / 100;
      plantsPerRow = Math.floor(length / spacingM);
      rows = Math.floor(width / spacingM);
      totalPlants = plantsPerRow * rows;
      plantingArea = totalArea * 0.95;
    } else {
      // Square pattern
      const spacingM = spacing.optimal / 100;
      plantsPerRow = Math.floor(length / spacingM);
      rows = Math.floor(width / spacingM);
      totalPlants = plantsPerRow * rows;
      plantingArea = totalArea * 0.9;
    }
    
    const pathArea = totalArea - plantingArea;
    const plantsPerSqM = totalPlants / plantingArea;

    return {
      totalArea,
      plantingArea: plantingArea.toFixed(1),
      pathArea: pathArea.toFixed(1),
      totalPlants,
      plantsPerRow,
      rows,
      plantsPerSqM
    };
  }

  function getPlantInfo(plantType) {
    const plantData = {
      'tomato': {
        daysToHarvest: '70-85',
        matureSize: '1-2 м висотою',
        waterNeeds: 'Високі (25-30 мм/тиждень)',
        lightRequirements: 'Повне сонце (6-8 годин)',
        plantingDepth: '0.5-1 см',
        temperatureRange: '18-30°C'
      },
      'pepper': {
        daysToHarvest: '60-80',
        matureSize: '40-60 см висотою',
        waterNeeds: 'Помірні (20-25 мм/тиждень)',
        lightRequirements: 'Повне сонце (6-8 годин)',
        plantingDepth: '0.5 см',
        temperatureRange: '20-30°C'
      },
      'cucumber': {
        daysToHarvest: '50-70',
        matureSize: '1-3 м довжиною',
        waterNeeds: 'Високі (25-35 мм/тиждень)',
        lightRequirements: 'Повне сонце (6-8 годин)',
        plantingDepth: '1-2 см',
        temperatureRange: '18-30°C'
      },
      'lettuce': {
        daysToHarvest: '30-60',
        matureSize: '15-30 см діаметром',
        waterNeeds: 'Помірні (15-20 мм/тиждень)',
        lightRequirements: 'Часткове сонце (4-6 годин)',
        plantingDepth: '0.5 см',
        temperatureRange: '15-20°C'
      },
      'cabbage': {
        daysToHarvest: '70-100',
        matureSize: '30-40 см діаметром',
        waterNeeds: 'Високі (25-30 мм/тиждень)',
        lightRequirements: 'Повне сонце (6-8 годин)',
        plantingDepth: '0.5 см',
        temperatureRange: '15-20°C'
      }
    };

    return plantData[plantType] || {
      daysToHarvest: '50-80',
      matureSize: 'Варіюється',
      waterNeeds: 'Помірні',
      lightRequirements: 'Повне або часткове сонце',
      plantingDepth: '1-2 см',
      temperatureRange: '15-25°C'
    };
  }

  function getPlantingRecommendations(plantType, variety, spacing, soilQuality, gardenType, companionPlanting) {
    const recommendations = [];
    
    if (spacing.optimal < 15) {
      recommendations.push('🌱 Дрібні рослини: використовуйте маркери рядів для точної посадки');
    }
    
    if (gardenType === 'raised') {
      recommendations.push('📦 Високі грядки: забезпечте хороший дренаж та якісний ґрунт');
    }
    
    if (soilQuality === 'poor') {
      recommendations.push('🌱 Поганий ґрунт: додайте компост та органічні добрива перед посадкою');
    }
    
    if (companionPlanting !== 'no') {
      recommendations.push('🤝 Супутнє садівництво: плануйте сумісні рослини для взаємної користі');
    }
    
    if (['tomato', 'pepper', 'cucumber'].includes(plantType)) {
      recommendations.push('🎋 Великі рослини: підготуйте опори або решітки для підтримки');
    }
    
    recommendations.push('💧 Встановіть системи поливу до посадки для рівномірного зволоження');
    recommendations.push('🌾 Використовуйте мульчу для зберігання вологи та придушення бур\'янів');
    
    return recommendations;
  }

  function getSeasonalConsiderations(plantType, climate) {
    const seasons = [];
    
    seasons.push('🌱 Весна: Почніть з саджанців в приміщенні за 6-8 тижнів до останніх заморозків');
    seasons.push('☀️ Літо: Забезпечте достатній полив та затінення в спекотні дні');
    seasons.push('🍂 Осінь: Зберіть насіння для наступного сезону');
    seasons.push('❄️ Зима: Плануйте наступний сезон та готуйте ґрунт');
    
    if (climate === 'hot') {
      seasons.push('🌡️ Жаркий клімат: Садіть раніше весною або пізніше восени');
    }
    
    if (['lettuce', 'spinach', 'peas'].includes(plantType)) {
      seasons.push('🌿 Прохолодні культури: можна вирощувати восени та ранньою весною');
    }
    
    return seasons;
  }

  function getCareRequirements(plantType, spacing, plantsPerSqM) {
    const care = [];
    
    if (plantsPerSqM > 10) {
      care.push('🌱 Висока щільність: моніторте на предмет захворювань та забезпечте хорошу циркуляцію повітря');
    }
    
    care.push('💧 Регулярний полив: перевіряйте вологість ґрунту щодня в спекотну погоду');
    care.push('🌾 Мульчування: підтримуйте шар мульчі 5-7 см навколо рослин');
    care.push('✂️ Обрізка: видаляйте хворі або пошкоджені листя регулярно');
    care.push('🐛 Моніторинг шкідників: перевіряйте рослини тричі на тиждень');
    
    if (['tomato', 'pepper', 'cucumber'].includes(plantType)) {
      care.push('🎋 Підтримка: встановіть опори коли рослини досягнуть 20-30 см');
    }
    
    return care;
  }

  function getCompanionPlants(plantType) {
    const companions = {
      'tomato': {
        good: ['базилік', 'морква', 'петрушка', 'цибуля'],
        bad: ['капуста', 'фенхель', 'горох'],
        benefits: 'Базилік покращує смак, цибуля відлякує шкідників'
      },
      'pepper': {
        good: ['базилік', 'морква', 'цибуля', 'помідори'],
        bad: ['квасоля', 'капуста'],
        benefits: 'Базилік покращує ріст, морква не конкурує за простір'
      },
      'lettuce': {
        good: ['морква', 'редис', 'цибуля', 'трави'],
        bad: ['капуста', 'броколі'],
        benefits: 'Швидко росте між повільними культурами'
      },
      'carrot': {
        good: ['цибуля', 'салат', 'помідори', 'трави'],
        bad: ['кріп', 'фенхель'],
        benefits: 'Розпушує ґрунт для інших рослин'
      }
    };

    return companions[plantType] || {
      good: ['цибуля', 'трави', 'салат'],
      bad: ['споріднені види'],
      benefits: 'Різноманітність рослин покращує здоров\'я саду'
    };
  }

  function getTroubleshooting(plantType, spacing, density) {
    const issues = [];
    
    if (spacing < 10) {
      issues.push('⚠️ Занадто щільна посадка може призвести до конкуренції за поживні речовини');
    }
    
    if (density > 15) {
      issues.push('⚠️ Висока щільність збільшує ризик захворювань - забезпечте хорошу вентиляцію');
    }
    
    issues.push('🐛 Пожовтіння листя: можливо переполив або нестача азоту');
    issues.push('🦠 Пошкоджені плоди: покращіть циркуляцію повітря та зменшіть вологість');
    issues.push('📏 Нерівний ріст: перевірте рівномірність поливу та освітлення');
    
    if (['tomato', 'pepper'].includes(plantType)) {
      issues.push('🍅 Вершинна гниль: забезпечте рівномірний полив та достатній кальцій');
    }
    
    return issues;
  }

  function getOptimizationTips(goal, pattern, soil, experience) {
    const tips = [];
    
    if (goal === 'maximum-yield') {
      tips.push('🎯 Максимальний врожай: використовуйте інтенсивну схему та регулярні підкормки');
    }
    
    if (pattern === 'triangular') {
      tips.push('📐 Трикутна схема: позначте ряди мотузкою для точного розміщення');
    }
    
    if (soil === 'poor') {
      tips.push('🌱 Покращення ґрунту: додавайте компост та органічну речовину кожного сезону');
    }
    
    if (experience === 'beginner') {
      tips.push('📚 Новачок: починайте з простих культур та ведіть садовий щоденник');
    }
    
    tips.push('📊 Плануйте сівозміну для підтримання здоров\'я ґрунту');
    tips.push('🌿 Експериментуйте з різними сортами для найкращих результатів');
    
    return tips;
  }

  function getSuccessionInterval(plantType) {
    const intervals = {
      'lettuce': 2,
      'radish': 2,
      'spinach': 2,
      'carrot': 3,
      'bean': 3,
      'peas': 3,
      'cucumber': 4,
      'tomato': 4,
      'pepper': 6
    };
    
    return intervals[plantType] || 3;
  }

  function getNextPlantingDate(plantType) {
    const now = new Date();
    const interval = getSuccessionInterval(plantType);
    const nextDate = new Date(now.getTime() + (interval * 7 * 24 * 60 * 60 * 1000));
    return nextDate.toLocaleDateString('uk-UA');
  }

  function calculateSeedCost(plantType, quantity) {
    const seedCosts = {
      'tomato': 3,
      'pepper': 4,
      'cucumber': 2.5,
      'lettuce': 1,
      'cabbage': 2,
      'carrot': 0.5,
      'radish': 0.5,
      'bean': 1.5,
      'peas': 1,
      'potato': 2,
      'onion': 1,
      'garlic': 1.5,
      'basil': 2,
      'parsley': 1,
      'dill': 1,
      'spinach': 1,
      'beet': 1,
      'zucchini': 5,
      'squash': 6
    };
    
    return Math.round((seedCosts[plantType] || 2) * quantity);
  }

  function getSupport(plantType, quantity) {
    const supportNeeds = {
      'tomato': 2,
      'pepper': 1.5,
      'cucumber': 2,
      'bean': 1.5,
      'peas': 1
    };
    
    return supportNeeds[plantType] ? Math.round(supportNeeds[plantType] * quantity) : 0;
  }

  function calculateSupportCost(plantType, quantity) {
    const supportLength = getSupport(plantType, quantity);
    return supportLength * 25; // 25 грн за метр підтримки
  }

  function getYieldPerPlant(plantType) {
    const yields = {
      'tomato': '2-4 кг',
      'pepper': '0.5-1 кг',
      'cucumber': '3-5 кг',
      'lettuce': '200-300 г',
      'cabbage': '1-2 кг',
      'carrot': '100-200 г',
      'radish': '50-100 г',
      'bean': '200-400 г',
      'peas': '150-250 г',
      'potato': '0.5-1 кг',
      'onion': '100-200 г',
      'garlic': '50-100 г',
      'basil': '100-200 г',
      'parsley': '50-100 г',
      'dill': '50-100 г',
      'spinach': '100-200 г',
      'beet': '200-400 г',
      'zucchini': '3-6 кг',
      'squash': '2-4 кг'
    };
    
    return yields[plantType] || '100-500 г';
  }

  function calculateTotalYield(plantType, quantity, asKg = false) {
    const yieldRanges = {
      'tomato': 3,
      'pepper': 0.75,
      'cucumber': 4,
      'lettuce': 0.25,
      'cabbage': 1.5,
      'carrot': 0.15,
      'radish': 0.075,
      'bean': 0.3,
      'peas': 0.2,
      'potato': 0.75,
      'onion': 0.15,
      'garlic': 0.075,
      'basil': 0.15,
      'parsley': 0.075,
      'dill': 0.075,
      'spinach': 0.15,
      'beet': 0.3,
      'zucchini': 4.5,
      'squash': 3
    };
    
    const avgYield = yieldRanges[plantType] || 0.25;
    const totalKg = avgYield * quantity;
    
    if (asKg) return totalKg;
    return totalKg >= 1 ? `${totalKg.toFixed(1)} кг` : `${(totalKg * 1000).toFixed(0)} г`;
  }

  function getHarvestFrequency(plantType) {
    const frequencies = {
      'tomato': 'Щотижня 6-8 тижнів',
      'pepper': 'Щотижня 4-6 тижнів',
      'cucumber': 'Щодня в піковий сезон',
      'lettuce': 'Одноразово або зрізання',
      'cabbage': 'Одноразово',
      'carrot': 'Поступово за потребою',
      'radish': 'Одноразово через 3-4 тижні',
      'bean': 'Щотижня 4-6 тижнів',
      'peas': 'Щотижня 3-4 тижні',
      'basil': 'Постійно (зрізання)',
      'spinach': 'Зрізання кожні 2-3 тижні'
    };
    
    return frequencies[plantType] || 'Варіюється за сортом';
  }
});