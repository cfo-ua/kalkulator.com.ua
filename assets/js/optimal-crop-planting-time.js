document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('crop-planting-form');
  const result = document.getElementById('crop-planting-result');
  const locationSelect = document.getElementById('location-zone');
  const customDatesDiv = document.getElementById('custom-dates');

  // Set current date as default
  const today = new Date();
  document.getElementById('current-date').value = today.toISOString().split('T')[0];

  // Handle custom dates visibility
  if (locationSelect) {
    locationSelect.addEventListener('change', function() {
      if (this.value === 'custom') {
        customDatesDiv.style.display = 'block';
      } else {
        customDatesDiv.style.display = 'none';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const location = document.getElementById('location-zone').value;
      const cropInfo = document.getElementById('crop-type').value;
      const plantingMethod = document.getElementById('planting-method').value;
      const succession = document.getElementById('succession-planting').value;
      const currentDate = new Date(document.getElementById('current-date').value);
      
      if (!location || !cropInfo) {
        result.textContent = "Будь ласка, виберіть розташування та тип культури.";
        return;
      }
      
      // Additional validation for location format
      if (location !== 'custom' && !location.includes(',')) {
        result.textContent = "Вибрано невірний формат розташування.";
        return;
      }
      
      // Parse crop information
      const [cropName, daysToMaturity, temperatureType, weeksFromFrost] = cropInfo.split(',');
      const maturityDays = parseInt(daysToMaturity);
      const frostOffset = parseInt(weeksFromFrost);
      
      // Get frost dates
      let lastSpringFrost, firstFallFrost, zone = 'custom'; // Initialize with default value
      
      if (location === 'custom') {
        lastSpringFrost = new Date(document.getElementById('custom-spring-frost').value);
        firstFallFrost = new Date(document.getElementById('custom-fall-frost').value);
        zone = 'custom';
      } else {
        // Use zone-based frost dates (approximate)
        zone = location.split(',')[0];
        const frostDates = getZoneFrostDates(zone);
        lastSpringFrost = frostDates.spring;
        firstFallFrost = frostDates.fall;
      }
      
      // Calculate planting dates
      const springPlantDate = new Date(lastSpringFrost);
      springPlantDate.setDate(springPlantDate.getDate() + (frostOffset * 7));
      
      // Indoor seed starting date (if transplanting)
      const seedStartDate = new Date(springPlantDate);
      if (plantingMethod === 'transplant') {
        seedStartDate.setDate(seedStartDate.getDate() - 42); // 6 weeks earlier
      }
      
      // Fall planting date (work backwards from fall frost)
      const fallPlantDate = new Date(firstFallFrost);
      fallPlantDate.setDate(fallPlantDate.getDate() - maturityDays - 14); // 2 weeks buffer
      
      // Calculate succession planting dates
      const successionDates = [];
      let nextPlantDate = new Date(springPlantDate);
      const maxPlantDate = new Date(fallPlantDate);
      
      const intervalDays = {
        'single': null,
        '2weeks': 14,
        '3weeks': 21,
        'monthly': 30
      };
      
      if (succession !== 'single') {
        while (nextPlantDate <= maxPlantDate) {
          successionDates.push(new Date(nextPlantDate));
          nextPlantDate.setDate(nextPlantDate.getDate() + intervalDays[succession]);
        }
      }
      
      // Calculate harvest dates
      const firstHarvest = new Date(springPlantDate);
      firstHarvest.setDate(firstHarvest.getDate() + maturityDays);
      
      const lastHarvest = new Date(fallPlantDate);
      lastHarvest.setDate(lastHarvest.getDate() + maturityDays);
      
      // Determine planting status
      const plantingStatus = getPlantingStatus(currentDate, springPlantDate, fallPlantDate, seedStartDate, plantingMethod);
      
      // Get climate-specific tips
      const climateTips = getClimateTips(temperatureType, zone || 'custom');
      
      // Translate crop name to Ukrainian
      const cropNameUA = translateCropName(cropName);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Графік посадки для ${cropNameUA}:</h4>
          <p>Кліматична зона: ${location.split(',')[0] || 'Користувацька'}</p>
          <p>Днів до дозрівання: ${maturityDays} днів</p>
          <p>Температурні переваги: ${translateTemperatureType(temperatureType)}</p>
          <p>Метод посадки: ${plantingMethod === 'direct' ? 'Прямий посів' : 'Початок в приміщенні + пересадка'}</p>
        </div>
        
        <div class="result-dates">
          <h4>Ключові дати:</h4>
          <p><strong>Останній весняний заморозок:</strong> ${formatDateUA(lastSpringFrost)}</p>
          <p><strong>Перший осінній заморозок:</strong> ${formatDateUA(firstFallFrost)}</p>
          ${plantingMethod === 'transplant' ? `<p><strong>Початок насіння в приміщенні:</strong> ${formatDateUA(seedStartDate)}</p>` : ''}
          <p><strong>Весняна дата посадки:</strong> ${formatDateUA(springPlantDate)}</p>
          <p><strong>Осіння дата посадки:</strong> ${formatDateUA(fallPlantDate)}</p>
        </div>
        
        <div class="result-status">
          <h4>Поточний статус:</h4>
          <p>${plantingStatus.message}</p>
          <p>${plantingStatus.action}</p>
          <p><strong>Днів до наступного вікна посадки:</strong> ${plantingStatus.daysToNext}</p>
        </div>
        
        <div class="result-harvest">
          <h4>Графік врожаю:</h4>
          <p><strong>Перший врожай:</strong> ${formatDateUA(firstHarvest)}</p>
          <p><strong>Останній можливий врожай:</strong> ${formatDateUA(lastHarvest)}</p>
          <p>Вегетаційний період: ${Math.floor((firstFallFrost - lastSpringFrost) / (1000 * 60 * 60 * 24))} днів</p>
          <p>Вікно збирання врожаю: ${Math.floor((lastHarvest - firstHarvest) / (1000 * 60 * 60 * 24))} днів</p>
        </div>
        
        ${succession !== 'single' ? `
        <div class="result-succession">
          <h4>Графік послідовної посадки:</h4>
          <p>Інтервал посадки: ${translateSuccessionInterval(succession)}</p>
          <p><strong>Дати посадки:</strong></p>
          <ul>
            ${successionDates.slice(0, 6).map((date, index) => 
              `<li>Посадка ${index + 1}: ${formatDateUA(date)}</li>`
            ).join('')}
            ${successionDates.length > 6 ? `<li>...та ще ${successionDates.length - 6} посадок</li>` : ''}
          </ul>
          <p>Загальна кількість посадок: ${successionDates.length}</p>
        </div>
        ` : ''}
        
        <div class="result-climate">
          <h4>Кліматичні поради:</h4>
          ${climateTips.map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-planting-tips">
          <h4>Рекомендації з посадки:</h4>
          <p>🌡️ Температура ґрунту: ${getSoilTempRecommendationUA(temperatureType)}</p>
          <p>💧 Вологість ґрунту: Підтримуйте постійно вологим, але не затопленим</p>
          <p>☀️ Вимоги до сонця: ${getSunRequirementsUA(cropName)}</p>
          <p>📏 Глибина посадки: ${getPlantingDepthUA(cropName)}</p>
          <p>🌱 Час проростання: ${getGerminationTimeUA(cropName)}</p>
        </div>
        
        <div class="result-protection">
          <h4>Захист від погоди:</h4>
          <p>❄️ Захист від заморозків: ${getFrostProtectionUA(temperatureType)}</p>
          <p>🌡️ Захист від спеки: ${getHeatProtectionUA(temperatureType)}</p>
          <p>🌧️ Захист від дощу: Використовуйте рядкові покриття під час сильних дощів</p>
          <p>💨 Захист від вітру: Підпирайте високі рослини, використовуйте вітрозахисти</p>
        </div>
        
        <div class="result-troubleshooting">
          <h4>Поширені проблеми:</h4>
          <p>🐛 Час шкідників: ${getPestTimingUA(cropName)}</p>
          <p>🦠 Профілактика хвороб: ${getDiseasePreventionUA(temperatureType)}</p>
          <p>📅 Пізня посадка: ${getLatePlantingAdviceUA(maturityDays)}</p>
          <p>🌡️ Затримки через погоду: ${getWeatherDelayAdviceUA()}</p>
        </div>
        
        <div class="result-records">
          <h4>Ведення записів:</h4>
          <p>📝 Відстежуйте фактичні дати посадки для вашого розташування</p>
          <p>🌡️ Моніторте температуру ґрунту та повітря</p>
          <p>📊 Записуйте врожаї та дати збирання</p>
          <p>🎯 Коригуйте час на основі результатів</p>
          <p>📱 Використовуйте садовий журнал або додаток для відстеження прогресу</p>
        </div>
      `;
    });
  }

  function getZoneFrostDates(zone) {
    const currentYear = new Date().getFullYear();
    // Adjusted for Ukrainian climate zones
    const zoneDates = {
      '3a': { spring: new Date(currentYear, 4, 30), fall: new Date(currentYear, 8, 10) }, // May 30, Sept 10
      '3b': { spring: new Date(currentYear, 4, 25), fall: new Date(currentYear, 8, 15) },
      '4a': { spring: new Date(currentYear, 4, 20), fall: new Date(currentYear, 8, 20) },
      '4b': { spring: new Date(currentYear, 4, 15), fall: new Date(currentYear, 8, 25) },
      '5a': { spring: new Date(currentYear, 4, 10), fall: new Date(currentYear, 8, 30) },
      '5b': { spring: new Date(currentYear, 4, 5), fall: new Date(currentYear, 9, 5) },
      '6a': { spring: new Date(currentYear, 3, 25), fall: new Date(currentYear, 9, 20) },
      '6b': { spring: new Date(currentYear, 3, 20), fall: new Date(currentYear, 9, 30) },
      '7a': { spring: new Date(currentYear, 3, 15), fall: new Date(currentYear, 10, 10) },
      '7b': { spring: new Date(currentYear, 3, 10), fall: new Date(currentYear, 10, 20) },
      '8a': { spring: new Date(currentYear, 3, 5), fall: new Date(currentYear, 10, 30) },
      '8b': { spring: new Date(currentYear, 2, 25), fall: new Date(currentYear, 11, 10) },
      '9a': { spring: new Date(currentYear, 2, 15), fall: new Date(currentYear, 11, 20) }
    };
    return zoneDates[zone] || { spring: new Date(currentYear, 4, 15), fall: new Date(currentYear, 9, 15) };
  }

  function getPlantingStatus(currentDate, springDate, fallDate, seedDate, method) {
    const msInDay = 1000 * 60 * 60 * 24;
    
    if (method === 'transplant' && currentDate < seedDate) {
      const daysToSeed = Math.ceil((seedDate - currentDate) / msInDay);
      return {
        message: "Занадто рано для початку насіння в приміщенні",
        action: "Зачекайте до дати початку насіння",
        daysToNext: daysToSeed
      };
    } else if (currentDate < springDate) {
      const daysToPlant = Math.ceil((springDate - currentDate) / msInDay);
      return {
        message: "Наближається весняне вікно посадки",
        action: method === 'transplant' ? "Почніть насіння в приміщенні зараз, якщо ще не зробили" : "Підготуйте садові грядки",
        daysToNext: daysToPlant
      };
    } else if (currentDate <= fallDate) {
      return {
        message: "Зараз сезон посадки",
        action: "Гарний час для посадки - перевірте вимоги конкретного сорту",
        daysToNext: 0
      };
    } else {
      return {
        message: "Сезон посадки закінчився",
        action: "Плануйте на наступний рік або спробуйте методи продовження сезону",
        daysToNext: "Наступна весна"
      };
    }
  }

  function getClimateTips(tempType, zone) {
    const tips = [];
    
    if (tempType === 'hardy') {
      tips.push("❄️ Може переносити заморозки - садіть рано для кращої якості");
      tips.push("🌡️ Надає перевагу прохолодній погоді, може втекти в спеку");
    } else if (tempType === 'cool') {
      tips.push("🌡️ Потребує прохолодної погоди, але захищайте від сильних заморозків");
      tips.push("🌱 Садіть ранньою весною або восени для кращих результатів");
    } else if (tempType === 'warm') {
      tips.push("☀️ Потребує теплого ґрунту та температури повітря");
      tips.push("❄️ Дуже чутливі до заморозків - зачекайте поки ґрунт прогріється");
    } else if (tempType === 'hot') {
      tips.push("🔥 Процвітає в жарку погоду, потребує дуже теплого ґрунту");
      tips.push("💧 Може потребувати додаткової води в найжаркіші періоди");
    }
    
    if (zone && (zone.includes('3') || zone.includes('4'))) {
      tips.push("🧊 Короткий вегетаційний період - виберіть швидкодозріваючі сорти");
      tips.push("🏠 Розгляньте продовження сезону з холодними рамками або теплицями");
    }
    
    return tips;
  }

  function translateCropName(cropName) {
    const translations = {
      'peas': 'горох',
      'spinach': 'шпинат',
      'kale': 'капуста',
      'onions': 'цибуля',
      'lettuce': 'салат',
      'radishes': 'редиска',
      'carrots': 'морква',
      'broccoli': 'броколі',
      'tomatoes': 'помідори',
      'peppers': 'перець',
      'eggplant': 'баклажани',
      'basil': 'базилік',
      'cucumbers': 'огірки',
      'squash': 'кабачки',
      'beans': 'квасоля',
      'corn': 'кукурудза'
    };
    return translations[cropName] || cropName;
  }

  function translateTemperatureType(tempType) {
    const translations = {
      'hardy': 'холодостійкий',
      'cool': 'прохолодний',
      'warm': 'теплий',
      'hot': 'жаркий'
    };
    return translations[tempType] || tempType;
  }

  function translateSuccessionInterval(succession) {
    const translations = {
      '2weeks': 'кожні 2 тижні',
      '3weeks': 'кожні 3 тижні',
      'monthly': 'щомісяця'
    };
    return translations[succession] || succession;
  }

  function getSoilTempRecommendationUA(tempType) {
    const temps = {
      'hardy': '2-7°C (може проростати в холодному ґрунті)',
      'cool': '7-18°C (прохолодний, але не замерзлий)',
      'warm': '15-24°C (потрібен теплий ґрунт)',
      'hot': '21-29°C (потрібен дуже теплий ґрунт)'
    };
    return temps[tempType] || '10-21°C';
  }

  function getSunRequirementsUA(crop) {
    const sunNeeds = {
      'peas': 'Повне сонце до напівтіні',
      'spinach': 'Повне сонце до напівтіні',
      'lettuce': 'Повне сонце до напівтіні',
      'tomatoes': 'Повне сонце (6-8 годин)',
      'peppers': 'Повне сонце (6-8 годин)',
      'cucumbers': 'Повне сонце (6-8 годин)',
      'beans': 'Повне сонце (6+ годин)',
      'corn': 'Повне сонце (6-8 годин)'
    };
    return sunNeeds[crop] || 'Повне сонце (6+ годин)';
  }

  function getPlantingDepthUA(crop) {
    const depths = {
      'peas': '2,5-5 см глибиною',
      'beans': '2,5-5 см глибиною', 
      'corn': '2,5-5 см глибиною',
      'lettuce': '0,6 см глибиною',
      'spinach': '1,3 см глибиною',
      'radishes': '1,3 см глибиною',
      'carrots': '0,6 см глибиною'
    };
    return depths[crop] || 'у 2 рази глибше діаметра насіння';
  }

  function getGerminationTimeUA(crop) {
    const times = {
      'radishes': '3-7 днів',
      'lettuce': '7-14 днів',
      'spinach': '7-14 днів',
      'beans': '7-14 днів',
      'peas': '7-21 день',
      'corn': '7-14 днів',
      'carrots': '14-21 день'
    };
    return times[crop] || '7-14 днів';
  }

  function getFrostProtectionUA(tempType) {
    const protection = {
      'hardy': 'Зазвичай не потрібен, може переносити заморозки',
      'cool': 'Рядкові покриття або міні-теплички для сильних заморозків',
      'warm': 'Рядкові покриття, пластикові тунелі або занесення в приміщення',
      'hot': 'Обов\'язковий захист - будь-які заморозки вб\'ють рослини'
    };
    return protection[tempType] || 'Рядкові покриття для легких заморозків';
  }

  function getHeatProtectionUA(tempType) {
    if (tempType === 'hardy' || tempType === 'cool') {
      return 'Затінююча сітка, додаткова вода, посадка в напівтіні';
    }
    return 'Зазвичай добре переносить спеку, забезпечте достатньо води';
  }

  function getPestTimingUA(crop) {
    const pests = {
      'tomatoes': 'Стежте за томатними червами в середині літа',
      'peppers': 'Попелиця та перцевий довгоносик у жарку погоду',
      'cucumbers': 'Огіркові жуки на початку сезону',
      'lettuce': 'Попелиця та слимаки в прохолодних, вологих умовах',
      'peas': 'Гороховий довгоносик та попелиця під час формування стручків'
    };
    return pests[crop] || 'Регулярно моніторте місцеві схеми шкідників';
  }

  function getDiseasePreventionUA(tempType) {
    if (tempType === 'warm' || tempType === 'hot') {
      return 'Забезпечте хорошу циркуляцію повітря, уникайте полив зверху';
    }
    return 'Стежте за грибковими проблемами в прохолодних, вологих умовах';
  }

  function getLatePlantingAdviceUA(maturityDays) {
    if (maturityDays <= 45) {
      return 'Можна садити до 2 тижнів пізніше з мінімальним впливом';
    } else if (maturityDays <= 75) {
      return 'Виберіть швидкодозріваючі сорти при пізній посадці';
    }
    return 'Пізня посадка може потребувати методів продовження сезону';
  }

  function getWeatherDelayAdviceUA() {
    return 'Чекайте підходящих умов замість примусу - кращі результати з терпінням';
  }

  function formatDateUA(date) {
    const months = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    const weekdays = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    
    return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }
});