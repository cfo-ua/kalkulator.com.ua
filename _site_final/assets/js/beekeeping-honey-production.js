document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('honey-production-form');
  const result = document.getElementById('honey-production-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const hiveCount = parseInt(document.getElementById('hive-count').value);
      const hiveAge = document.getElementById('hive-age').value;
      const climateZone = document.getElementById('climate-zone').value;
      const nectarSources = document.getElementById('nectar-sources').value;
      const experienceLevel = document.getElementById('experience-level').value;
      const colonyManagement = document.getElementById('colony-management').value;
      const weatherConditions = document.getElementById('weather-conditions').value;
      const honeyPrice = parseFloat(document.getElementById('honey-price').value);
      const productionGoal = document.getElementById('production-goal').value;
      
      if (!hiveCount || !hiveAge || !climateZone || !nectarSources || !experienceLevel || !colonyManagement || !weatherConditions || !honeyPrice || !productionGoal) {
        result.textContent = "Будь ласка, заповніть всі поля.";
        return;
      }
      
      // Parse input data
      const [ageLevel, ageMultiplier] = hiveAge.split(',');
      const [climateName, baseYield] = climateZone.split(',');
      const [nectarLevel, nectarMultiplier] = nectarSources.split(',');
      const [expLevel, expMultiplier] = experienceLevel.split(',');
      const [managementLevel, managementMultiplier] = colonyManagement.split(',');
      const [weatherLevel, weatherMultiplier] = weatherConditions.split(',');
      
      const ageMultiplierNum = parseFloat(ageMultiplier);
      const baseYieldNum = parseFloat(baseYield);
      const nectarMultiplierNum = parseFloat(nectarMultiplier);
      const expMultiplierNum = parseFloat(expMultiplier);
      const managementMultiplierNum = parseFloat(managementMultiplier);
      const weatherMultiplierNum = parseFloat(weatherMultiplier);
      
      // Calculate honey production per hive (in kg)
      const honeyPerHive = baseYieldNum * ageMultiplierNum * nectarMultiplierNum * expMultiplierNum * managementMultiplierNum * weatherMultiplierNum;
      
      // Calculate total production
      const totalHoneyProduction = honeyPerHive * hiveCount;
      
      // Calculate revenue
      const totalRevenue = totalHoneyProduction * honeyPrice;
      const revenuePerHive = honeyPerHive * honeyPrice;
      
      // Calculate costs (converted to UAH)
      const setupCostPerHive = 6000; // Average initial setup in UAH
      const annualMaintenancePerHive = 2250; // Annual maintenance in UAH
      const extractionEquipmentCost = getExtractionCost(hiveCount, productionGoal);
      const totalSetupCosts = (hiveCount * setupCostPerHive) + extractionEquipmentCost;
      const annualOperatingCosts = hiveCount * annualMaintenancePerHive;
      
      // Calculate profitability
      const annualProfit = totalRevenue - annualOperatingCosts;
      const profitPerHive = annualProfit / hiveCount;
      const roiYears = totalSetupCosts / Math.max(annualProfit, 1);
      
      // Calculate honey reserves needed for bees
      const winterReservePerHive = getWinterReserve(climateName);
      const totalWinterReserves = winterReservePerHive * hiveCount;
      const surplusHoney = Math.max(0, totalHoneyProduction - totalWinterReserves);
      const surplusRevenue = surplusHoney * honeyPrice;
      
      // Production efficiency metrics
      const totalJars = Math.floor(surplusHoney); // 1kg jars
      const workHoursPerHive = getWorkHours(managementLevel, hiveCount);
      const hourlyReturn = profitPerHive / workHoursPerHive;
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🍯 Оцінка виробництва меду:</h4>
          <p><strong>Кількість вуликів:</strong> ${hiveCount}</p>
          <p><strong>Стан вулика:</strong> ${getHiveStatusName(ageLevel)}</p>
          <p><strong>Клімат:</strong> ${getClimateName(climateName)} зона</p>
          <p><strong>Досвід:</strong> ${getExperienceName(expLevel)} бджоляр</p>
          <p><strong>Управління:</strong> ${getManagementName(managementLevel)} рівень</p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Очікуване виробництво:</h4>
          <p><strong>На вулик: ${honeyPerHive.toFixed(1)} кг меду</strong></p>
          <p><strong>Загальне виробництво: ${totalHoneyProduction.toFixed(1)} кг</strong></p>
          <p>Зимові запаси потрібні: ${totalWinterReserves.toFixed(1)} кг</p>
          <p><strong>Надлишок для збору: ${surplusHoney.toFixed(1)} кг</strong></p>
          <p>Банки меду (1 кг): ${totalJars} банок</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Аналіз доходів:</h4>
          <p><strong>Загальний дохід: ${surplusRevenue.toFixed(0)} грн</strong></p>
          <p>Дохід на вулик: ${(surplusRevenue / hiveCount).toFixed(0)} грн</p>
          <p>Дохід за кілограм: ${honeyPrice.toFixed(2)} грн</p>
          <p>Валовий дохід (якщо все продано): ${totalRevenue.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>💸 Аналіз витрат:</h4>
          <p><strong>Початкові витрати: ${totalSetupCosts.toFixed(0)} грн</strong></p>
          <p>• Обладнання вуликів: ${(hiveCount * setupCostPerHive).toFixed(0)} грн</p>
          <p>• Обладнання для екстракції: ${extractionEquipmentCost.toFixed(0)} грн</p>
          <p><strong>Річні експлуатаційні витрати: ${annualOperatingCosts.toFixed(0)} грн</strong></p>
          <p>• Обслуговування на вулик: ${annualMaintenancePerHive} грн/рік</p>
        </div>
        
        <div class="insight-card">
          <h4>📈 Прибутковість:</h4>
          <p><strong>Річний прибуток: ${(surplusRevenue - annualOperatingCosts).toFixed(0)} грн</strong></p>
          <p>Прибуток на вулик: ${((surplusRevenue - annualOperatingCosts) / hiveCount).toFixed(0)} грн</p>
          <p>Віддача від інвестицій: ${roiYears.toFixed(1)} років до окупності</p>
          <p>Почасова віддача: ${hourlyReturn.toFixed(2)} грн/год</p>
          <p>Норма прибутку: ${(((surplusRevenue - annualOperatingCosts) / surplusRevenue) * 100).toFixed(1)}%</p>
        </div>
        
        <div class="insight-card">
          <h4>⏰ Вимоги до управління:</h4>
          <p>⏱️ <strong>Часові зобов'язання:</strong> ${(workHoursPerHive * hiveCount).toFixed(0)} годин/рік загалом</p>
          <p>📅 <strong>На вулик:</strong> ${workHoursPerHive.toFixed(1)} годин/рік</p>
          <p>🔍 <strong>Інспекції:</strong> ${getInspectionSchedule(managementLevel)}</p>
          <p>💉 <strong>Лікування:</strong> ${getTreatmentSchedule()}</p>
          <p>🍯 <strong>Час збору:</strong> ${getHarvestTiming(climateName)}</p>
        </div>
        
        <div class="insight-card">
          <h4>📋 Аналіз факторів виробництва:</h4>
          <p>🏠 Вплив віку вулика: ${getImpactDescription(ageMultiplierNum)}</p>
          <p>🌸 Джерела нектару: ${getImpactDescription(nectarMultiplierNum)}</p>
          <p>🎓 Рівень досвіду: ${getImpactDescription(expMultiplierNum)}</p>
          <p>⚙️ Якість управління: ${getImpactDescription(managementMultiplierNum)}</p>
          <p>🌤️ Погодні умови: ${getImpactDescription(weatherMultiplierNum)}</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Можливості покращення:</h4>
          ${getImprovementTips(ageLevel, nectarLevel, expLevel, managementLevel).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="insight-card">
          <h4>📅 Календар сезонного управління:</h4>
          <p>🌸 <strong>Рання весна (березень-квітень):</strong> ${getSpringManagement()}</p>
          <p>☀️ <strong>Пізня весна (травень-червень):</strong> ${getLateSpringManagement()}</p>
          <p>🌻 <strong>Літо (липень-серпень):</strong> ${getSummerManagement()}</p>
          <p>🍂 <strong>Осінь (вересень-жовтень):</strong> ${getFallManagement()}</p>
          <p>❄️ <strong>Зима (листопад-лютий):</strong> ${getWinterManagement()}</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Рекомендації щодо обладнання:</h4>
          ${getEquipmentRecommendations(hiveCount, productionGoal).map(item => `<p>${item}</p>`).join('')}
        </div>
        
        <div class="insight-card">
          <h4>🛒 Маркетинг та продажі:</h4>
          <p>🎯 <strong>Цільовий ринок:</strong> ${getTargetMarket(productionGoal, surplusHoney)}</p>
          <p>💰 <strong>Стратегія ціноутворення:</strong> ${getPricingStrategy(honeyPrice)}</p>
          <p>📦 <strong>Потреби в упаковці:</strong> ${getPackagingNeeds(totalJars)}</p>
          <p>📍 <strong>Канали продажів:</strong> ${getSalesChannels(productionGoal)}</p>
          <p>📋 <strong>Регулювання:</strong> ${getRegulationInfo()}</p>
        </div>
        
        <div class="insight-card">
          <h4>📈 Планування розширення:</h4>
          <p>📈 <strong>Потенціал росту:</strong> ${getGrowthPotential(profitPerHive, hiveCount)}</p>
          <p>🐝 <strong>Оптимальна кількість вуликів:</strong> ${getOptimalHiveCount(productionGoal, workHoursPerHive)}</p>
          <p>💡 <strong>Наступні кроки:</strong> ${getNextSteps(expLevel, hiveCount, profitPerHive)}</p>
          <p>🌱 <strong>Диверсифікація:</strong> ${getDiversificationOptions()}</p>
        </div>
        
        <div class="insight-card">
          <h4>⚠️ Управління ризиками:</h4>
          <p>🦠 <strong>Профілактика хвороб:</strong> ${getDiseasePreventionTips()}</p>
          <p>🌡️ <strong>Погодні ризики:</strong> ${getWeatherRiskManagement()}</p>
          <p>📉 <strong>Ринкові ризики:</strong> ${getMarketRiskTips()}</p>
          <p>🐻 <strong>Фізичний захист:</strong> ${getPhysicalProtectionTips()}</p>
        </div>
        
        <div class="insight-card">
          <h4>🌿 Сталі практики:</h4>
          <p>🌿 <strong>Покращення середовища:</strong> ${getHabitatTips()}</p>
          <p>🌱 <strong>Управління без хімікатів:</strong> ${getOrganicTips()}</p>
          <p>♻️ <strong>Зменшення відходів:</strong> ${getWasteReductionTips()}</p>
          <p>🌍 <strong>Екологічний вплив:</strong> ${getEnvironmentalTips()}</p>
        </div>
      `;
    });
  }

  function getExtractionCost(hiveCount, goal) {
    if (hiveCount <= 5) return 9000; // Hand crank extractor in UAH
    if (hiveCount <= 20) return 24000; // Electric extractor in UAH
    if (goal === 'commercial') return 75000; // Commercial equipment in UAH
    return 36000; // Large hobby setup in UAH
  }

  function getWinterReserve(climate) {
    const reserves = {
      'northern': 27,
      'temperate': 20,
      'southern': 14,
      'subtropical': 9
    };
    return reserves[climate] || 20;
  }

  function getWorkHours(managementLevel, hiveCount) {
    const baseHours = {
      'minimal': 8,
      'standard': 12,
      'intensive': 18
    };
    
    const hours = baseHours[managementLevel] || 12;
    // Economies of scale - more hives = slightly less time per hive
    const efficiency = Math.max(0.7, 1 - (hiveCount * 0.02));
    return hours * efficiency;
  }

  function getHiveStatusName(status) {
    const names = {
      'new': 'Нові вулики',
      'second-year': 'Вулики другого року',
      'established': 'Встановлені вулики',
      'split': 'Вулики з поділів'
    };
    return names[status] || status;
  }

  function getClimateName(climate) {
    const names = {
      'northern': 'Північний',
      'temperate': 'Помірний',
      'southern': 'Південний',
      'subtropical': 'Субтропічний'
    };
    return names[climate] || climate;
  }

  function getExperienceName(exp) {
    const names = {
      'beginner': 'Початківець',
      'intermediate': 'Середній',
      'experienced': 'Досвідчений',
      'commercial': 'Комерційний'
    };
    return names[exp] || exp;
  }

  function getManagementName(mgmt) {
    const names = {
      'minimal': 'Мінімальний',
      'standard': 'Стандартний',
      'intensive': 'Інтенсивний'
    };
    return names[mgmt] || mgmt;
  }

  function getImpactDescription(factor) {
    if (factor <= 0.6) return '🔴 Значно зменшує виробництво';
    if (factor <= 0.8) return '🟡 Помірно зменшує виробництво';
    if (factor <= 1.1) return '🟢 Нормальний/нейтральний вплив';
    if (factor <= 1.3) return '🟢 Збільшує виробництво';
    return '🟢 Значно збільшує виробництво';
  }

  function getImprovementTips(age, nectar, exp, management) {
    const tips = [];
    
    if (age === 'new') {
      tips.push('🐝 Зосередьтеся на будівництві колонії в перший рік, не очікуйте надлишкового меду');
    }
    
    if (nectar === 'poor' || nectar === 'fair') {
      tips.push('🌸 Садіть медоносні квіти, розміщуйте вулики поблизу кращих джерел нектару');
    }
    
    if (exp === 'beginner') {
      tips.push('📚 Проходьте курси бджільництва, приєднуйтесь до місцевих асоціацій бджолярів');
    }
    
    if (management === 'minimal') {
      tips.push('🔍 Збільште частоту інспекцій, впровадьте правильний моніторинг хвороб');
    }
    
    tips.push('📊 Ведіть детальні записи для відстеження найкращих практик');
    tips.push('🐛 Регулярно моніторьте та лікуйте кліщів варроа');
    
    return tips;
  }

  function getInspectionSchedule(level) {
    const schedules = {
      'minimal': 'Щомісяця під час активного сезону',
      'standard': 'Двічі на місяць під час активного сезону',
      'intensive': 'Щотижня під час пікового сезону'
    };
    return schedules[level] || 'Двічі на місяць';
  }

  function getTreatmentSchedule() {
    return 'Лікування кліщів варроа 2-3 рази щорічно, моніторинг хвороб';
  }

  function getHarvestTiming(climate) {
    const timings = {
      'northern': 'Кінець липня - початок серпня',
      'temperate': 'Липень - вересень',
      'southern': 'Червень - жовтень',
      'subtropical': 'Кілька зборів цілий рік'
    };
    return timings[climate] || 'Кінець літа';
  }

  function getSpringManagement() {
    return 'Оцінка колонії, годування за потреби, додавання надставок перед потоком';
  }

  function getLateSpringManagement() {
    return 'Моніторинг роїння, забезпечення достатнього простору, перевірки хвороб';
  }

  function getSummerManagement() {
    return 'Управління піковим потоком меду, збір зрілого меду, моніторинг шкідників';
  }

  function getFallManagement() {
    return 'Фінальний збір, підготовка до зими, зменшення розміру вулика, лікування кліщів';
  }

  function getWinterManagement() {
    return 'Мінімальне втручання, екстрене годування за потреби, обслуговування обладнання';
  }

  function getEquipmentRecommendations(hiveCount, goal) {
    const equipment = [];
    
    equipment.push('🥽 Захисне спорядження: костюм, рукавички, стамеска');
    equipment.push('📦 Додаткові надставки та рамки для зберігання меду');
    
    if (hiveCount <= 5) {
      equipment.push('🍯 Ручна медогонка для невеликих партій');
    } else {
      equipment.push('⚡ Електрична медогонка для ефективності');
    }
    
    equipment.push('🌡️ Термометр для вулика та вологомір');
    equipment.push('💨 Димар та якісне паливо');
    
    if (goal === 'commercial') {
      equipment.push('🚚 Транспортне обладнання для переміщення вуликів');
      equipment.push('🏭 Комерційне обладнання для обробки');
    }
    
    return equipment;
  }

  function getTargetMarket(goal, production) {
    if (goal === 'hobby') return 'Сім\'я, друзі, сусіди';
    if (goal === 'sideline') return 'Фермерські ринки, місцеві магазини, прямі продажі';
    return 'Оптові дистриб\'ютори, комерційні покупці';
  }

  function getPricingStrategy(price) {
    if (price <= 240) return 'Конкурентне оптове ціноутворення';
    if (price <= 450) return 'Середнє ціноутворення місцевого ринку';
    return 'Преміальне ремісниче ціноутворення';
  }

  function getPackagingNeeds(jars) {
    if (jars <= 50) return `${jars} скляних банок, етикетки, проста упаковка`;
    if (jars <= 200) return `${jars} банок, професійні етикетки, брендована упаковка`;
    return `${jars}+ банок, оптові контейнери, комерційна упаковка`;
  }

  function getSalesChannels(goal) {
    if (goal === 'hobby') return 'Прямі продажі, молва';
    if (goal === 'sideline') return 'Фермерські ринки, онлайн-продажі, місцева роздрібна торгівля';
    return 'Оптова торгівля, дистриб\'ютори, комерційні контракти';
  }

  function getRegulationInfo() {
    return 'Перевірте місцеві закони про домашню їжу, вимоги до маркування, регулювання Держпродспоживслужби';
  }

  function getGrowthPotential(profitPerHive, hiveCount) {
    if (profitPerHive > 9000 && hiveCount < 50) {
      return 'Високий - розгляньте розширення операцій';
    } else if (profitPerHive > 4500) {
      return 'Помірний - можливе селективне розширення';
    }
    return 'Зосередьтеся на оптимізації поточної операції';
  }

  function getOptimalHiveCount(goal, workHours) {
    if (goal === 'hobby') return '5-20 вуликів для керованої хобі-операції';
    if (goal === 'sideline') return '20-100 вуликів для значного додаткового доходу';
    return '100+ вуликів для комерційної життєздатності';
  }

  function getNextSteps(exp, hiveCount, profit) {
    if (exp === 'beginner') return 'Набирайтеся досвіду, зосередьтеся на навчанні перед розширенням';
    if (hiveCount < 10 && profit > 6000) return 'Розгляньте подвоєння кількості вуликів наступного сезону';
    return 'Оптимізуйте поточні операції, досліджуйте продукти з доданою вартістю';
  }

  function getDiversificationOptions() {
    return 'Продукти з бджолиного воску, пилок, маточне молочко, розведення бджіл, продаж обладнання';
  }

  function getDiseasePreventionTips() {
    return 'Регулярний моніторинг варроа, гігієнічні практики, стійка до хвороб генетика';
  }

  function getWeatherRiskManagement() {
    return 'Кілька локацій пасік, екстрене годування, моніторинг погоди';
  }

  function getMarketRiskTips() {
    return 'Диверсифікуйте канали продажів, будуйте стосунки з клієнтами, продукти з доданою вартістю';
  }

  function getPhysicalProtectionTips() {
    return 'Електричне огородження від ведмедів, безпечні підставки для вуликів, запобігання крадіжці';
  }

  function getHabitatTips() {
    return 'Садіть місцеві квіти, підтримуйте зони без пестицидів, коридори середовища';
  }

  function getOrganicTips() {
    return 'Інтегроване управління шкідниками, природні методи лікування, органічна сертифікація';
  }

  function getWasteReductionTips() {
    return 'Повторно використовуйте старе обладнання, переробляйте упаковку, мінімізуйте одноразові предмети';
  }

  function getEnvironmentalTips() {
    return 'Підтримка запилювачів, збільшення біорізноманіття, сталі практики бджільництва';
  }
});