document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('herb-yield-form');
  const result = document.getElementById('herb-yield-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const gardenType = document.getElementById('garden-type').value;
      const gardenSize = document.getElementById('garden-size').value;
      const herbSelection = Array.from(document.getElementById('herb-selection').selectedOptions).map(option => option.value);
      const experienceLevel = document.getElementById('experience-level').value;
      const seasonLength = document.getElementById('season-length').value;
      const maintenanceLevel = document.getElementById('maintenance-level').value;
      const herbUsage = document.getElementById('herb-usage').value;
      const successionPlanting = document.getElementById('succession-planting').value;
      
      if (!gardenType || !gardenSize || herbSelection.length === 0 || !experienceLevel || !seasonLength || !maintenanceLevel || !herbUsage || !successionPlanting) {
        result.textContent = "Будь ласка, заповніть всі поля та виберіть принаймні одну траву.";
        return;
      }
      
      // Parse input data
      const [gardenTypeName, gardenMultiplier] = gardenType.split(',');
      const [sizeName, plantCapacity] = gardenSize.split(',');
      const [expLevel, expMultiplier] = experienceLevel.split(',');
      const [seasonName, seasonMultiplier] = seasonLength.split(',');
      const [maintLevel, maintMultiplier] = maintenanceLevel.split(',');
      const [usageLevel, usageMultiplier] = herbUsage.split(',');
      const [successionLevel, successionMultiplier] = successionPlanting.split(',');
      
      const gardenFactor = parseFloat(gardenMultiplier);
      const capacity = parseInt(plantCapacity);
      const expFactor = parseFloat(expMultiplier);
      const seasonFactor = parseFloat(seasonMultiplier);
      const maintFactor = parseFloat(maintMultiplier);
      const usageFactor = parseFloat(usageMultiplier);
      const successionFactor = parseFloat(successionMultiplier);
      
      // Calculate plants per herb type
      const plantsPerHerb = Math.floor(capacity / herbSelection.length);
      const totalPlants = plantsPerHerb * herbSelection.length;
      
      // Calculate yields for each herb
      const herbYields = [];
      let totalWeeklyYield = 0;
      let totalSeasonYield = 0;
      let totalCostSavings = 0;
      
      herbSelection.forEach(herbData => {
        const [herbName, weeklyYieldPerPlant, seasonLength] = herbData.split(',');
        const baseWeeklyYield = parseFloat(weeklyYieldPerPlant);
        const weeks = parseInt(seasonLength);
        
        // Apply all multipliers
        const adjustedWeeklyYield = baseWeeklyYield * plantsPerHerb * gardenFactor * expFactor * seasonFactor * maintFactor * successionFactor;
        const adjustedSeasonLength = weeks * seasonFactor;
        const seasonYield = adjustedWeeklyYield * adjustedSeasonLength;
        
        // Calculate cost savings (fresh herbs average 75 UAH per 60ml package in Ukraine)
        const packagesPerWeek = adjustedWeeklyYield / 0.25; // 0.25 cup = ~60ml
        const weeklySavings = packagesPerWeek * 75; // 75 UAH per package
        const seasonSavings = weeklySavings * adjustedSeasonLength;
        
        herbYields.push({
          name: herbName,
          plantsCount: plantsPerHerb,
          weeklyYield: adjustedWeeklyYield,
          seasonYield: seasonYield,
          seasonLength: adjustedSeasonLength,
          weeklySavings: weeklySavings,
          seasonSavings: seasonSavings
        });
        
        totalWeeklyYield += adjustedWeeklyYield;
        totalSeasonYield += seasonYield;
        totalCostSavings += seasonSavings;
      });
      
      // Calculate preservation yields
      const driedHerbYield = totalSeasonYield * 0.25; // 1:4 ratio fresh to dried
      const frozenHerbYield = totalSeasonYield * 0.8; // 80% retention when frozen
      
      // Calculate garden efficiency
      const yieldPerPlant = totalSeasonYield / totalPlants;
      const yieldPerSqFt = totalSeasonYield / (capacity * 0.5); // Estimate 0.5 sq ft per plant
      
      // Generate recommendations
      const recommendations = getRecommendationsUA(herbYields, usageLevel, gardenTypeName);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Оцінка врожайності трав'яного саду:</h4>
          <p>Сад: ${translateSizeName(sizeName)} ${translateGardenType(gardenTypeName)} сад</p>
          <p>Загальна кількість рослин: ${totalPlants} (${plantsPerHerb} на тип трави)</p>
          <p>Вегетаційний сезон: ${translateSeasonName(seasonName)}</p>
          <p>Рівень досвіду: ${translateExperienceLevel(expLevel)}</p>
        </div>
        
        <div class="result-yields">
          <h4>Очікувані врожаї:</h4>
          <p><strong>Тижневий збір: ${totalWeeklyYield.toFixed(2)} чашок свіжих трав</strong></p>
          <p><strong>Загальний за сезон: ${totalSeasonYield.toFixed(1)} чашок свіжих трав</strong></p>
          <p>Щоденний середній: ${(totalWeeklyYield / 7).toFixed(2)} чашок</p>
          <p>Врожайність на рослину: ${yieldPerPlant.toFixed(2)} чашок за сезон</p>
        </div>
        
        <div class="result-by-herb">
          <h4>Врожайність за типом трави:</h4>
          ${herbYields.map(herb => `
            <div class="herb-details">
              <p><strong>${translateHerbName(herb.name)}:</strong></p>
              <p>• ${herb.plantsCount} рослин</p>
              <p>• ${herb.weeklyYield.toFixed(2)} чашок/тиждень протягом ${Math.round(herb.seasonLength)} тижнів</p>
              <p>• Загальний за сезон: ${herb.seasonYield.toFixed(1)} чашок</p>
              <p>• Економія: ${herb.seasonSavings.toFixed(0)} грн/сезон</p>
            </div>
          `).join('')}
        </div>
        
        <div class="result-preservation">
          <h4>Врожаї для консервування:</h4>
          <p><strong>Якщо сушити:</strong> ${driedHerbYield.toFixed(1)} чашок сушених трав</p>
          <p><strong>Якщо заморожувати:</strong> ${frozenHerbYield.toFixed(1)} чашок заморожених трав</p>
          <p>Потенціал трав'яної солі: ${(totalSeasonYield * 2).toFixed(1)} чашок трав'яної солі</p>
          <p>Олійні настої: ${Math.floor(totalSeasonYield / 2)} чашок олії з травами</p>
        </div>
        
        <div class="result-economics">
          <h4>Економічний аналіз:</h4>
          <p><strong>Загальна економія коштів: ${totalCostSavings.toFixed(0)} грн за сезон</strong></p>
          <p>Тижнева економія: ${(totalCostSavings / (herbYields[0]?.seasonLength || 20)).toFixed(0)} грн</p>
          <p>Вартість за вироблену чашку: ${(1250 / totalSeasonYield).toFixed(2)} грн (оцінка)</p>
          <p>Повернення інвестицій: ${((totalCostSavings / 2500) * 100).toFixed(0)}% (проти 2500 грн налаштування)</p>
          <p>Час окупності: ${Math.ceil(2500 / (totalCostSavings / (herbYields[0]?.seasonLength || 20)))} тижнів</p>
        </div>
        
        <div class="result-harvest-schedule">
          <h4>Графік збирання врожаю:</h4>
          <p>🌱 <strong>Початок збирання:</strong> ${getHarvestStartUA()}</p>
          <p>⏰ <strong>Частота збирання:</strong> ${getHarvestFrequencyUA(maintLevel)}</p>
          <p>✂️ <strong>Найкращий час:</strong> ${getBestHarvestTimeUA()}</p>
          <p>📅 <strong>Пікове виробництво:</strong> ${getPeakProductionUA(seasonName)}</p>
          <p>🔄 <strong>Послідовна посадка:</strong> ${getSuccessionAdviceUA(successionLevel)}</p>
        </div>
        
        <div class="result-growing-tips">
          <h4>Поради для максимальної врожайності:</h4>
          ${getGrowingTipsUA(gardenTypeName, expLevel).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-harvest-tips">
          <h4>Найкращі практики збирання врожаю:</h4>
          <p>✂️ <strong>Метод зрізання:</strong> ${getCuttingAdviceUA()}</p>
          <p>🌸 <strong>Управління квітками:</strong> ${getFlowerAdviceUA()}</p>
          <p>🌅 <strong>Час:</strong> ${getTimingAdviceUA()}</p>
          <p>💧 <strong>Після збирання:</strong> ${getPostHarvestAdviceUA()}</p>
        </div>
        
        <div class="result-preservation-guide">
          <h4>Методи консервування:</h4>
          ${getPreservationMethodsUA().map(method => `<p>${method}</p>`).join('')}
        </div>
        
        <div class="result-planning">
          <h4>Рекомендації з планування саду:</h4>
          ${recommendations.map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>Сезонне управління:</h4>
          <p>🌱 <strong>Весна:</strong> ${getSpringAdviceUA()}</p>
          <p>☀️ <strong>Літо:</strong> ${getSummerAdviceUA()}</p>
          <p>🍂 <strong>Осінь:</strong> ${getFallAdviceUA()}</p>
          <p>❄️ <strong>Зима:</strong> ${getWinterAdviceUA(gardenTypeName)}</p>
        </div>
        
        <div class="result-troubleshooting">
          <h4>Поширені проблеми та рішення:</h4>
          <p>🐛 <strong>Шкідники:</strong> ${getPestSolutionsUA()}</p>
          <p>🦠 <strong>Хвороби:</strong> ${getDiseaseSolutionsUA()}</p>
          <p>📉 <strong>Низька врожайність:</strong> ${getLowYieldSolutionsUA()}</p>
          <p>🥀 <strong>Занепад рослин:</strong> ${getPlantDeclineSolutionsUA()}</p>
        </div>
        
        <div class="result-expansion">
          <h4>Ідеї розширення саду:</h4>
          <p>📈 <strong>Наступний сезон:</strong> ${getExpansionAdviceUA(totalSeasonYield, usageLevel)}</p>
          <p>🌿 <strong>Нові трави для спроби:</strong> ${getNewHerbSuggestionsUA(herbSelection)}</p>
          <p>🏠 <strong>Вирощування в приміщенні:</strong> ${getIndoorOptionsUA()}</p>
          <p>🎁 <strong>Ділення/продаж:</strong> ${getSharingAdviceUA(totalCostSavings)}</p>
        </div>
      `;
    });
  }

  // Ukrainian translation functions
  function translateGardenType(type) {
    const translations = {
      'ground': 'грядковий',
      'raised': 'піднятий',
      'containers': 'контейнерний',
      'indoor': 'внутрішній',
      'greenhouse': 'тепличний'
    };
    return translations[type] || type;
  }

  function translateSizeName(size) {
    const translations = {
      'small': 'малий',
      'medium': 'середній',
      'large': 'великий',
      'extensive': 'розширений'
    };
    return translations[size] || size;
  }

  function translateSeasonName(season) {
    const translations = {
      'short': 'короткий сезон',
      'medium': 'середній сезон',
      'long': 'довгий сезон',
      'year-round': 'цілорічний'
    };
    return translations[season] || season;
  }

  function translateExperienceLevel(level) {
    const translations = {
      'beginner': 'початківець',
      'intermediate': 'проміжний',
      'experienced': 'досвідчений'
    };
    return translations[level] || level;
  }

  function translateHerbName(herb) {
    const translations = {
      'basil': 'базилік',
      'parsley': 'петрушка',
      'cilantro': 'коріандр',
      'chives': 'зелена цибуля',
      'rosemary': 'розмарин',
      'thyme': 'чебрець',
      'oregano': 'орегано',
      'sage': 'шавлія',
      'mint': 'м\'ята',
      'dill': 'кріп'
    };
    return translations[herb] || herb;
  }

  function getRecommendationsUA(herbYields, usageLevel, gardenType) {
    const recommendations = [];
    
    const totalYield = herbYields.reduce((sum, herb) => sum + herb.seasonYield, 0);
    
    if (usageLevel === 'light' && totalYield > 10) {
      recommendations.push('💡 Розгляньте зменшення розміру саду або зосередьтесь на методах консервування');
    }
    
    if (usageLevel === 'heavy' && totalYield < 20) {
      recommendations.push('📈 Розгляньте розширення саду або додавання більш продуктивних трав');
    }
    
    if (gardenType === 'indoor') {
      recommendations.push('🌿 Доповніть травами типу "зрізай і знову росте", такими як зелена цибуля та петрушка');
    }
    
    recommendations.push('🌱 Починайте з 2-3 типів трав спочатку, розширюйтесь з набуттям досвіду');
    recommendations.push('📅 Плануйте послідовні посадки кожні 3-4 тижні для безперервного врожаю');
    
    return recommendations;
  }

  function getHarvestStartUA() {
    return 'Коли рослини досягнуть 10-15 см у висоту (4-8 тижнів після посадки)';
  }

  function getHarvestFrequencyUA(maintLevel) {
    const frequencies = {
      'minimal': 'Тижневі збори',
      'regular': '2-3 рази на тиждень',
      'intensive': 'Щоденний збір можливий'
    };
    return frequencies[maintLevel] || 'Тижневі збори';
  }

  function getBestHarvestTimeUA() {
    return 'Рано вранці після висихання роси, до 10:00 для найкращого смаку';
  }

  function getPeakProductionUA(season) {
    const peaks = {
      'short': 'Середина до кінця літа (липень-серпень)',
      'medium': 'Середина літа до ранньої осені (червень-вересень)',
      'long': 'Пізня весна до середини осені (травень-жовтень)',
      'year-round': 'Безперервне виробництво з сезонними піками'
    };
    return peaks[season] || 'Середина літа';
  }

  function getSuccessionAdviceUA(level) {
    const advice = {
      'none': 'Розгляньте послідовну посадку для безперервного врожаю',
      'limited': 'Садіть коріандр і базилік кожні 3-4 тижні',
      'full': 'Відмінний підхід для безперервного виробництва'
    };
    return advice[level] || 'Садіть кожні 3-4 тижні для найкращих результатів';
  }

  function getGrowingTipsUA(gardenType, expLevel) {
    const tips = [];
    
    if (gardenType === 'containers') {
      tips.push('🪴 Використовуйте контейнери глибиною принаймні 15-20 см для трав');
      tips.push('💧 Перевіряйте вологість ґрунту щодня - контейнери швидше висихають');
    }
    
    if (gardenType === 'indoor') {
      tips.push('💡 Забезпечте 6+ годин яскравого світла або лампи для росту');
      tips.push('🌡️ Підтримуйте 18-24°C для оптимального росту');
    }
    
    if (expLevel === 'beginner') {
      tips.push('🌱 Починайте з легких трав: базилік, зелена цибуля, петрушка, м\'ята');
      tips.push('📖 Ведіть садовий журнал для відстеження того, що працює');
    }
    
    tips.push('☀️ Більшість трав потребують 6+ годин прямого сонячного світла щодня');
    tips.push('💧 Поливайте, коли верхні 2,5 см ґрунту стануть сухими');
    tips.push('🌿 Регулярне збирання заохочує кущистий ріст');
    
    return tips;
  }

  function getCuttingAdviceUA() {
    return 'Зрізайте стебла безпосередньо над парою листків, ніколи не більше 1/3 рослини за раз';
  }

  function getFlowerAdviceUA() {
    return 'Відщипуйте квіткові бруньки для заохочення виробництва листя (крім збереження насіння)';
  }

  function getTimingAdviceUA() {
    return 'Збирайте до цвітіння для найкращого смаку, олії найбільш концентровані вранці';
  }

  function getPostHarvestAdviceUA() {
    return 'Використовуйте негайно, зберігайте у воді або обробляйте протягом 2 годин після збирання';
  }

  function getPreservationMethodsUA() {
    return [
      '🌬️ Повітряне сушіння: підвішуйте пучки у теплому, сухому, темному місці',
      '❄️ Заморожування: подрібніть і заморозьте у формочках для льоду з олією',
      '🧂 Трав\'яна сіль: змішайте 4:1 сіль до свіжих трав, зберігайте в холодильнику',
      '🫒 Олійні настої: занурюйте трави в олію, процідіть через 2 тижні',
      '🥶 Ліофілізація: краще зберігає колір і смак ніж повітряне сушіння'
    ];
  }

  function getSpringAdviceUA() {
    return 'Починайте насіння в приміщенні, готуйте грядки, садіть після останнього заморозку';
  }

  function getSummerAdviceUA() {
    return 'Збирайте регулярно, забезпечуйте затінення в екстремальну спеку, підтримуйте постійний полив';
  }

  function getFallAdviceUA() {
    return 'Останній великий збір, починайте консервування, садіть зимові трави в приміщенні';
  }

  function getWinterAdviceUA(gardenType) {
    if (gardenType === 'indoor') {
      return 'Продовжуйте вирощування з додатковим освітленням';
    }
    return 'Плануйте сад наступного року, використовуйте консервовані трави, доглядайте кімнатні рослини';
  }

  function getPestSolutionsUA() {
    return 'Супутня посадка з чорнобривцями, збирання шкідників вручну, використання інсектицидного мила';
  }

  function getDiseaseSolutionsUA() {
    return 'Забезпечте хорошу циркуляцію повітря, уникайте поливу зверху, видаляйте уражені рослини';
  }

  function getLowYieldSolutionsUA() {
    return 'Перевірте родючість ґрунту, збільшіть експозицію світла, збирайте частіше';
  }

  function getPlantDeclineSolutionsUA() {
    return 'Перевірте переповнені корені рослин, покращте дренаж, розгляньте послідовну посадку';
  }

  function getExpansionAdviceUA(totalYield, usageLevel) {
    if (usageLevel === 'heavy' || totalYield < 15) {
      return 'Розгляньте подвоєння розміру саду або додавання більш продуктивних сортів';
    }
    return 'Поточний розмір здається відповідним, зосередьтесь на покращенні врожайності';
  }

  function getNewHerbSuggestionsUA(currentHerbs) {
    const allHerbs = ['basil', 'parsley', 'cilantro', 'chives', 'rosemary', 'thyme', 'oregano', 'sage', 'mint', 'dill'];
    const herbTranslations = {
      'basil': 'базилік', 'parsley': 'петрушка', 'cilantro': 'коріандр', 
      'chives': 'зелена цибуля', 'rosemary': 'розмарин', 'thyme': 'чебрець', 
      'oregano': 'орегано', 'sage': 'шавлія', 'mint': 'м\'ята', 'dill': 'кріп'
    };
    
    const suggested = allHerbs.filter(herb => !currentHerbs.some(current => current.includes(herb)));
    const translatedSuggested = suggested.slice(0, 3).map(herb => herbTranslations[herb] || herb);
    
    return translatedSuggested.join(', ') || 'естрагон, лаванда, мелісса';
  }

  function getIndoorOptionsUA() {
    return 'Сади на підвіконні, налаштування ламп для росту, гідропонні системи для цілорічного виробництва';
  }

  function getSharingAdviceUA(savings) {
    if (savings > 5000) {
      return 'Надлишкове виробництво ідеально для фермерських ринків або ділення з сусідами';
    }
    return 'Ідеальна кількість для сімейного використання з деякими можливостями ділення';
  }
});