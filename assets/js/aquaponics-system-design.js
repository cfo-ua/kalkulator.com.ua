document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('aquaponics-design-form');
  const result = document.getElementById('aquaponics-design-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const systemType = document.getElementById('system-type').value;
      const productionGoal = document.getElementById('production-goal').value;
      const availableSpace = parseFloat(document.getElementById('available-space').value);
      const fishSpecies = document.getElementById('fish-species').value;
      const primaryCrops = document.getElementById('primary-crops').value;
      const climateControl = document.getElementById('climate-control').value;
      const experienceLevel = document.getElementById('experience-level').value;
      const budgetLevel = document.getElementById('budget-level').value;
      const fishPrice = parseFloat(document.getElementById('fish-price').value);
      const vegetablePrice = parseFloat(document.getElementById('vegetable-price').value);
      
      if (!systemType || !productionGoal || !availableSpace || !fishSpecies || !primaryCrops || !climateControl || !experienceLevel || !budgetLevel || !fishPrice || !vegetablePrice) {
        result.textContent = "Будь ласка, заповніть всі поля.";
        return;
      }
      
      // Parse input data
      const [systemName, systemMultiplier] = systemType.split(',');
      const [goalName, baseSize] = productionGoal.split(',');
      const [fishName, fishDensity, fishMarketPrice] = fishSpecies.split(',');
      const [cropName, cropValue] = primaryCrops.split(',');
      const [climateName, climateMultiplier] = climateControl.split(',');
      const [expName, expMultiplier] = experienceLevel.split(',');
      const [budgetName, budgetMultiplier] = budgetLevel.split(',');
      
      const systemEfficiency = parseFloat(systemMultiplier);
      const targetSize = Math.min(availableSpace, parseInt(baseSize));
      const fishDensityNum = parseFloat(fishDensity);
      const fishMarketPriceNum = parseFloat(fishMarketPrice);
      const cropValueNum = parseFloat(cropValue);
      const climateMultiplierNum = parseFloat(climateMultiplier);
      const expMultiplierNum = parseFloat(expMultiplier);
      const budgetMultiplierNum = parseFloat(budgetMultiplier);
      
      // Calculate system dimensions
      const growingArea = targetSize * 0.7; // 70% for growing, 30% for tanks/equipment
      const fishTankVolume = calculateFishTankVolume(growingArea, systemName);
      const growBedVolume = calculateGrowBedVolume(growingArea, systemName);
      
      // Calculate fish stocking
      const maxFishWeight = fishTankVolume * fishDensityNum * 3.785; // Convert gallons to liters, then to kg
      const numberOfFish = Math.floor(maxFishWeight / 0.7); // Assuming 0.7 kg average fish weight
      
      // Calculate plant capacity
      const plantSpacing = getPlantSpacing(cropName);
      const plantsPerSqM = 1 / plantSpacing;
      const totalPlants = Math.floor(growingArea * plantsPerSqM);
      
      // Calculate production
      const annualFishProduction = maxFishWeight * 2; // 2 cycles per year
      const annualPlantProduction = calculatePlantProduction(cropName, growingArea, systemEfficiency, climateMultiplierNum);
      
      // Calculate equipment needs
      const pumpSize = calculatePumpSize(fishTankVolume + growBedVolume);
      const aerationNeeds = calculateAeration(fishTankVolume);
      const heatingNeeds = calculateHeating(fishTankVolume, climateName, fishName);
      
      // Calculate costs
      const setupCosts = calculateSetupCosts(fishTankVolume, growBedVolume, systemName, budgetMultiplierNum, climateMultiplierNum);
      const annualOperatingCosts = calculateOperatingCosts(maxFishWeight, growingArea, climateName);
      
      // Calculate revenue
      const fishRevenue = annualFishProduction * fishPrice;
      const plantRevenue = annualPlantProduction * vegetablePrice;
      const totalRevenue = fishRevenue + plantRevenue;
      
      // Calculate profitability
      const annualProfit = totalRevenue - annualOperatingCosts;
      const roiYears = setupCosts / Math.max(annualProfit, 1);
      const profitPerSqM = annualProfit / targetSize;
      
      // Water quality parameters
      const waterVolumeL = (fishTankVolume + (growBedVolume * 0.3)) * 3.785; // Convert to liters
      const dailyWaterChangeL = waterVolumeL * 0.05; // 5% daily water change
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🏗️ Проект аквапонічної системи:</h4>
          <p><strong>Тип системи:</strong> ${getSystemTypeName(systemName)}</p>
          <p><strong>Цільовий розмір:</strong> ${targetSize} кв. м загалом</p>
          <p><strong>Площа вирощування:</strong> ${growingArea.toFixed(1)} кв. м</p>
          <p><strong>Вид риби:</strong> ${getFishName(fishName)}</p>
          <p><strong>Основні культури:</strong> ${getCropName(cropName)}</p>
          <p><strong>Клімат:</strong> ${getClimateName(climateName)}</p>
        </div>
        
        <div class="insight-card">
          <h4>📏 Специфікації системи:</h4>
          <p><strong>Резервуар для риби: ${(fishTankVolume * 3.785).toFixed(0)} літрів</strong></p>
          <p>Розміри резервуара: ${getTankDimensions(fishTankVolume)}</p>
          <p><strong>Об'єм вирощувальних лож: ${(growBedVolume * 3.785).toFixed(0)} літрів</strong></p>
          <p>Площа вирощувальних лож: ${growingArea.toFixed(1)} кв. м</p>
          <p>Загальний об'єм води: ${waterVolumeL.toFixed(0)} літрів</p>
        </div>
        
        <div class="insight-card">
          <h4>🐟 Ємність риби та рослин:</h4>
          <p><strong>Ємність риби: ${maxFishWeight.toFixed(0)} кг (${numberOfFish} риб)</strong></p>
          <p>Щільність поголів'я: ${(fishDensityNum * 3.785).toFixed(2)} кг на літр</p>
          <p><strong>Ємність рослин: ${totalPlants} рослин</strong></p>
          <p>Щільність рослин: ${plantsPerSqM.toFixed(1)} рослин на кв. м</p>
          <p>Відстань між рослинами: ${(plantSpacing * 100).toFixed(0)} см</p>
        </div>
        
        <div class="insight-card">
          <h4>⚙️ Вимоги до обладнання:</h4>
          <p><strong>Водяний насос: ${(pumpSize * 3.785).toFixed(0)} л/год</strong></p>
          <p>Швидкість циркуляції: ${(pumpSize / (fishTankVolume + growBedVolume)).toFixed(1)} оборотів на годину</p>
          <p><strong>Аерація: ${aerationNeeds} повітряних каменів</strong></p>
          <p>Повітряний насос: ${(aerationNeeds * 10).toFixed(0)} л/год потужність</p>
          ${heatingNeeds > 0 ? `<p><strong>Обігрів: ${heatingNeeds}Вт нагрівач</strong></p>` : ''}
          <p>Моніторинг: pH-метр, термометр, кисневий метр</p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Річні оцінки виробництва:</h4>
          <p><strong>Виробництво риби: ${annualFishProduction.toFixed(0)} кг/рік</strong></p>
          <p>Збір риби: 2 цикли на рік</p>
          <p><strong>Виробництво рослин: ${annualPlantProduction.toFixed(0)} кг/рік</strong></p>
          <p>Цикли рослин: ${getPlantCycles(cropName)} на рік</p>
          <p>Виробництво на кв. м: ${(annualPlantProduction / growingArea).toFixed(1)} кг/кв. м</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Аналіз витрат:</h4>
          <p><strong>Початкові витрати: ${setupCosts.toFixed(0)} грн</strong></p>
          <p>Вартість за літр: ${(setupCosts / waterVolumeL).toFixed(2)} грн</p>
          <p>Вартість за кв. м: ${(setupCosts / targetSize).toFixed(2)} грн</p>
          <p><strong>Річні експлуатаційні: ${annualOperatingCosts.toFixed(0)} грн</strong></p>
          <p>Місячні експлуатаційні: ${(annualOperatingCosts / 12).toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>📈 Прогноз доходів:</h4>
          <p><strong>Дохід від риби: ${fishRevenue.toFixed(0)} грн/рік</strong></p>
          <p>Дохід від рослин: ${plantRevenue.toFixed(0)} грн/рік</p>
          <p><strong>Загальний дохід: ${totalRevenue.toFixed(0)} грн/рік</strong></p>
          <p>Дохід на кв. м: ${(totalRevenue / targetSize).toFixed(2)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Аналіз прибутковості:</h4>
          <p><strong>Річний прибуток: ${annualProfit.toFixed(0)} грн</strong></p>
          <p>Норма прибутку: ${((annualProfit / totalRevenue) * 100).toFixed(1)}%</p>
          <p>Період окупності: ${roiYears.toFixed(1)} років</p>
          <p>Прибуток на кв. м: ${profitPerSqM.toFixed(2)} грн</p>
          <p>Беззбитковість: ${Math.ceil(setupCosts / (totalRevenue / 12))} місяців</p>
        </div>
        
        <div class="insight-card">
          <h4>💧 Управління водою:</h4>
          <p>💧 <strong>Щоденна зміна води: ${dailyWaterChangeL.toFixed(1)} літрів</strong></p>
          <p>🌡️ <strong>Діапазон температур: ${getTemperatureRange(fishName)}</strong></p>
          <p>🧪 <strong>Діапазон pH: ${getPHRange(fishName)}</strong></p>
          <p>💨 <strong>Розчинений кисень: ${getDORequirements()}</strong></p>
          <p>🔄 <strong>Циркуляція: ${((pumpSize / (fishTankVolume + growBedVolume)) * 24).toFixed(0)} повних циклів/день</strong></p>
        </div>
        
        <div class="insight-card">
          <h4>🍽️ Графік годування:</h4>
          <p>🐟 <strong>Щоденний корм: ${(maxFishWeight * 0.02).toFixed(2)} кг</strong></p>
          <p>📅 Частота годування: ${getFeedingFrequency(fishName)}</p>
          <p>💰 Річна вартість корму: ${(maxFishWeight * 0.02 * 365 * 45).toFixed(0)} грн</p>
          <p>🌱 Живлення рослин: Рибні відходи забезпечують всі поживні речовини</p>
          <p>⚡ Конверсія корму: ${getFeedConversion(fishName)} FCR</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Вимоги до обслуговування:</h4>
          ${getMaintenanceTasks(systemName).map(task => `<p>${task}</p>`).join('')}
        </div>
        
        <div class="insight-card">
          <h4>🌅 Сезонне управління:</h4>
          <p>🌱 <strong>Весна:</strong> ${getSpringTasks()}</p>
          <p>☀️ <strong>Літо:</strong> ${getSummerTasks()}</p>
          <p>🍂 <strong>Осінь:</strong> ${getFallTasks()}</p>
          <p>❄️ <strong>Зима:</strong> ${getWinterTasks(climateName)}</p>
        </div>
        
        <div class="insight-card">
          <h4>⚡ Оптимізація системи:</h4>
          ${getOptimizationTips(systemName, expName, cropName).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="insight-card">
          <h4>🚨 Поширені проблеми та рішення:</h4>
          <p>🐟 <strong>Здоров'я риби:</strong> ${getFishHealthTips()}</p>
          <p>🌱 <strong>Проблеми рослин:</strong> ${getPlantHealthTips()}</p>
          <p>💧 <strong>Якість води:</strong> ${getWaterQualityTips()}</p>
          <p>🔧 <strong>Проблеми обладнання:</strong> ${getEquipmentTips()}</p>
        </div>
        
        <div class="insight-card">
          <h4>📈 Можливості масштабування:</h4>
          <p>📈 <strong>Потенціал розширення:</strong> ${getExpansionAdvice(profitPerSqM, availableSpace)}</p>
          <p>🔄 <strong>Реплікація системи:</strong> ${getReplicationAdvice(annualProfit)}</p>
          <p>🎯 <strong>Ринковий фокус:</strong> ${getMarketAdvice(cropName, fishName)}</p>
          <p>💼 <strong>Бізнес-потенціал:</strong> ${getBusinessAdvice(totalRevenue, targetSize)}</p>
        </div>
        
        <div class="insight-card">
          <h4>♻️ Особливості сталості:</h4>
          <p>♻️ <strong>Ефективність води:</strong> 95% економії води порівняно з традиційним землеробством</p>
          <p>🌱 <strong>Без ґрунту:</strong> Усуває проблеми деградації ґрунту</p>
          <p>🚫 <strong>Без пестицидів:</strong> Закрита система запобігає проблемам шкідників</p>
          <p>🎣 <strong>Подвійне виробництво:</strong> Риба та овочі з тих же ресурсів</p>
          <p>🌍 <strong>Місцева їжа:</strong> Зменшує вуглецевий слід транспортування</p>
        </div>
      `;
    });
  }

  function calculateFishTankVolume(growingArea, systemType) {
    // Base calculation: 1 gallon per 0.1 sq ft of growing area, convert to metric
    const baseVolume = growingArea * 37.85; // liters per sq meter
    
    // Adjust based on system type
    const multipliers = {
      'media-bed': 1.0,
      'dwc': 0.8,
      'nft': 1.2,
      'vertical': 0.9,
      'hybrid': 1.1
    };
    
    return (baseVolume * (multipliers[systemType] || 1.0)) / 3.785; // Convert back to gallons for compatibility
  }

  function calculateGrowBedVolume(growingArea, systemType) {
    // Deep Water Culture has minimal grow bed volume
    if (systemType === 'dwc') {
      return growingArea * 2; // 2 gallons per sq ft for DWC
    }
    
    // Media beds: 12 inches deep
    return growingArea * 7.48; // 1 sq ft × 1 ft deep = 7.48 gallons
  }

  function getPlantSpacing(cropType) {
    const spacings = {
      'leafy-greens': 0.25, // 4 plants per sq ft
      'herbs': 0.33, // 3 plants per sq ft
      'microgreens': 0.1, // 10 plants per sq ft
      'fruiting': 1.0, // 1 plant per sq ft
      'mixed': 0.5 // 2 plants per sq ft
    };
    return spacings[cropType] || 0.25;
  }

  function calculatePlantProduction(cropType, area, systemEff, climateEff) {
    const baseYields = {
      'leafy-greens': 8, // kg per sq meter per year
      'herbs': 6,
      'microgreens': 20,
      'fruiting': 12,
      'mixed': 10
    };
    
    const baseYield = baseYields[cropType] || 8;
    return area * baseYield * systemEff * climateEff;
  }

  function calculatePumpSize(totalVolume) {
    // Pump should circulate entire volume every 1-2 hours
    return Math.ceil(totalVolume / 1.5); // GPH
  }

  function calculateAeration(fishTankVolume) {
    // 1 air stone per 50 gallons
    return Math.ceil(fishTankVolume / 50);
  }

  function calculateHeating(tankVolume, climate, fishType) {
    if (climate === 'outdoor') return 0;
    
    const heatingNeeds = {
      'tilapia': 5, // watts per gallon
      'trout': 0, // cold water fish
      'catfish': 3,
      'bass': 3,
      'goldfish': 2
    };
    
    return (heatingNeeds[fishType] || 3) * tankVolume;
  }

  function calculateSetupCosts(fishTankVol, growBedVol, systemType, budgetMult, climateMult) {
    const baseCostPerGallon = {
      'media-bed': 240, // UAH per gallon equivalent
      'dwc': 360,
      'nft': 450,
      'vertical': 600,
      'hybrid': 540
    };
    
    const costPerGallon = (baseCostPerGallon[systemType] || 300) * budgetMult;
    const totalVolume = fishTankVol + growBedVol;
    
    return totalVolume * costPerGallon * climateMult;
  }

  function calculateOperatingCosts(fishWeight, growingArea, climate) {
    const feedCost = fishWeight * 0.02 * 365 * 45; // Daily feed × price in UAH
    const electricityCost = growingArea * 150 * 12; // 150 UAH per sq meter per month
    const climateCost = climate === 'indoor' ? growingArea * 225 * 12 : 0;
    const miscCosts = growingArea * 37.5 * 12; // Seeds, supplements, etc.
    
    return feedCost + electricityCost + climateCost + miscCosts;
  }

  function getSystemTypeName(type) {
    const names = {
      'media-bed': 'Система субстратних лож',
      'dwc': 'Глибоководна культура',
      'nft': 'Технологія поживної плівки',
      'vertical': 'Вертикальна система вирощування',
      'hybrid': 'Гібридна система'
    };
    return names[type] || type;
  }

  function getFishName(type) {
    const names = {
      'tilapia': 'Тиляпія',
      'trout': 'Форель',
      'catfish': 'Сом',
      'bass': 'Окунь',
      'goldfish': 'Золота рибка'
    };
    return names[type] || type;
  }

  function getCropName(type) {
    const names = {
      'leafy-greens': 'Листова зелень',
      'herbs': 'Трави',
      'microgreens': 'Мікрозелень',
      'fruiting': 'Плодові рослини',
      'mixed': 'Змішані овочі'
    };
    return names[type] || type;
  }

  function getClimateName(type) {
    const names = {
      'outdoor': 'Відкритий грунт',
      'greenhouse': 'Теплиця',
      'indoor': 'Приміщення'
    };
    return names[type] || type;
  }

  function getTankDimensions(volume) {
    // Assume round tank, 1.2 meters deep
    const volumeL = volume * 3.785;
    const radius = Math.sqrt(volumeL / (3.14159 * 120)); // 120 cm deep
    const diameter = radius * 2;
    return `${(diameter / 100).toFixed(1)} м діаметр × 1,2 м глибина`;
  }

  function getPlantCycles(cropType) {
    const cycles = {
      'leafy-greens': 6,
      'herbs': 4,
      'microgreens': 12,
      'fruiting': 2,
      'mixed': 4
    };
    return cycles[cropType] || 4;
  }

  function getTemperatureRange(fishType) {
    const ranges = {
      'tilapia': '24-29°C',
      'trout': '10-18°C',
      'catfish': '24-29°C',
      'bass': '21-27°C',
      'goldfish': '18-24°C'
    };
    return ranges[fishType] || '21-27°C';
  }

  function getPHRange(fishType) {
    const ranges = {
      'tilapia': '6,5-8,5',
      'trout': '6,5-7,5',
      'catfish': '6,5-8,0',
      'bass': '6,5-8,0',
      'goldfish': '7,0-8,0'
    };
    return ranges[fishType] || '6,5-8,0';
  }

  function getDORequirements() {
    return '5+ мг/л для здоров\'я риби';
  }

  function getFeedingFrequency(fishType) {
    return fishType === 'trout' ? '3-4 рази на день' : '2-3 рази на день';
  }

  function getFeedConversion(fishType) {
    const fcr = {
      'tilapia': '1,5:1',
      'trout': '1,2:1',
      'catfish': '1,8:1',
      'bass': '1,6:1',
      'goldfish': '2,0:1'
    };
    return fcr[fishType] || '1,5:1';
  }

  function getMaintenanceTasks(systemType) {
    const baseTasks = [
      '🔍 Щодня: Перевіряйте поведінку риби, температуру води',
      '🧪 Щотижня: Тестуйте рівні pH, аміаку, нітритів, нітратів',
      '🔧 Щомісяця: Чистіть насоси, перевіряйте трубопроводи на протікання',
      '🌱 Постійно: Збирайте рослини, садіть нові розсади'
    ];
    
    if (systemType === 'media-bed') {
      baseTasks.push('🪨 Щоквартально: Очищуйте субстрат вирощувальних лож за потреби');
    }
    
    return baseTasks;
  }

  function getSpringTasks() {
    return 'Запуск системи, додавання малька риби, посадка весняних культур';
  }

  function getSummerTasks() {
    return 'Пікове виробництво, часті збори, моніторинг температури води';
  }

  function getFallTasks() {
    return 'Збір зрілої риби, посадка холодостійких культур, підготовка до зими';
  }

  function getWinterTasks(climate) {
    if (climate === 'outdoor') {
      return 'Зупинка системи в холодному кліматі, обслуговування обладнання';
    }
    return 'Зменшене годування, моніторинг обігріву, продовження легкого виробництва';
  }

  function getOptimizationTips(systemType, experience, cropType) {
    const tips = [];
    
    if (experience === 'beginner') {
      tips.push('🎓 Починайте з листової зелені - вона найбільш вибачлива');
      tips.push('📚 Приєднуйтесь до аквапонічних форумів та місцевих груп для підтримки');
    }
    
    if (systemType === 'media-bed') {
      tips.push('🪨 Використовуйте розширені глиняні гранули для кращого потоку води');
    }
    
    if (cropType === 'fruiting') {
      tips.push('🌶️ Зачекайте 6+ місяців для дозрівання системи перед плодовими рослинами');
    }
    
    tips.push('📊 Ведіть детальні записи параметрів води та виробництва');
    tips.push('🔄 Впровадьте резервні системи для перебоїв електроенергії');
    
    return tips;
  }

  function getFishHealthTips() {
    return 'Моніторьте хвороби, підтримуйте якість води, уникайте перегодовування';
  }

  function getPlantHealthTips() {
    return 'Перевіряйте дефіцит поживних речовин, моніторьте шкідників, забезпечте правильне освітлення';
  }

  function getWaterQualityTips() {
    return 'Регулярне тестування, правильна фільтрація, підтримка корисних бактерій';
  }

  function getEquipmentTips() {
    return 'Регулярне обслуговування, резервні насоси, інвентар запчастин';
  }

  function getExpansionAdvice(profitPerSqM, availableSpace) {
    if (profitPerSqM > 750 && availableSpace > 50) {
      return 'Високий потенціал прибутку - розгляньте розширення системи';
    }
    return 'Оптимізуйте поточну систему перед розширенням';
  }

  function getReplicationAdvice(annualProfit) {
    if (annualProfit > 150000) {
      return 'Розгляньте будівництво додаткових ідентичних систем';
    }
    return 'Удосконаліть поточну систему перед реплікацією';
  }

  function getMarketAdvice(crops, fish) {
    if (crops === 'herbs' || crops === 'microgreens') {
      return 'Зосередьтесь на високоцінних продажах ресторанам та фермерським ринкам';
    }
    return 'Розвивайте місцевий ринок свіжої риби та овочів';
  }

  function getBusinessAdvice(revenue, size) {
    if (revenue > 450000 && size > 20) {
      return 'Потенціал для повноцінного аквапонічного бізнесу';
    } else if (revenue > 150000) {
      return 'Хороша можливість додаткового бізнесу';
    }
    return 'Відмінне хобі з деяким потенціалом доходу';
  }
});