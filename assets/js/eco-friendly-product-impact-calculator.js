document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('eco-impact-form');
  const result = document.getElementById('eco-impact-result');

  // Show/hide sub-options when checkboxes are clicked
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const subOption = this.parentNode.querySelector('.sub-option');
      if (subOption) {
        subOption.style.display = this.checked ? 'block' : 'none';
      }
    });
  });

  // Update range displays
  const ranges = ['local-percentage', 'organic-percentage', 'waste-reduction', 'secondhand-percentage'];
  ranges.forEach(rangeId => {
    const range = document.getElementById(rangeId);
    const display = document.getElementById(rangeId.replace('percentage', 'display').replace('reduction', 'display'));
    if (range && display) {
      range.addEventListener('input', function() {
        display.textContent = this.value + '%';
      });
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const householdSize = parseInt(document.getElementById('household-size').value);
      const timePeriod = document.getElementById('time-period').value;
      const includeCost = document.getElementById('include-cost').checked;
      const baseline = document.getElementById('comparison-baseline').value;
      
      // Initialize impact calculations
      let totalCO2Saved = 0;
      let totalWaterSaved = 0;
      let totalWasteDiverted = 0;
      let totalEnergySaved = 0;
      let totalCostSavings = 0;
      let impactDetails = [];

      // Home & Household Products
      if (document.getElementById('led-bulbs').checked) {
        const count = parseInt(document.getElementById('led-count').value);
        const co2 = count * 85; // kg CO2 per bulb per year
        const energy = count * 100; // kWh per bulb per year
        const cost = count * 300; // UAH savings per bulb per year
        
        totalCO2Saved += co2;
        totalEnergySaved += energy;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'LED лампи',
          co2: co2,
          water: 0,
          waste: 0,
          energy: energy,
          cost: cost,
          description: `${count} LED ламп економлять енергію та довше служать`
        });
      }

      if (document.getElementById('eco-cleaning').checked) {
        const count = parseInt(document.getElementById('cleaning-count').value);
        const co2 = count * 2.5; // kg CO2 per product per month
        const water = count * 150; // liters saved per product per month
        const cost = count * 50; // UAH extra cost per month (but health benefits)
        
        totalCO2Saved += co2 * 12;
        totalWaterSaved += water * 12;
        totalCostSavings -= cost * 12; // Actually costs more initially
        
        impactDetails.push({
          category: 'Екологічні миючі засоби',
          co2: co2 * 12,
          water: water * 12,
          waste: 0,
          energy: 0,
          cost: -cost * 12,
          description: `${count} продуктів на місяць зменшують хімічне забруднення`
        });
      }

      if (document.getElementById('reusable-bottles').checked) {
        const users = parseInt(document.getElementById('bottle-users').value);
        const co2 = users * 150; // kg CO2 saved per person per year
        const waste = users * 50; // kg plastic waste diverted per person per year
        const cost = users * 1200; // UAH saved per person per year
        
        totalCO2Saved += co2;
        totalWasteDiverted += waste;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Багаторазові пляшки',
          co2: co2,
          water: 0,
          waste: waste,
          energy: 0,
          cost: cost,
          description: `${users} осіб уникають ~${users * 1460} пластикових пляшок на рік`
        });
      }

      if (document.getElementById('efficient-appliances').checked) {
        const count = parseInt(document.getElementById('appliance-count').value);
        const co2 = count * 200; // kg CO2 saved per appliance per year
        const energy = count * 500; // kWh saved per appliance per year
        const cost = count * 2000; // UAH saved per appliance per year
        const water = count * 2000; // liters saved per appliance per year
        
        totalCO2Saved += co2;
        totalEnergySaved += energy;
        totalWaterSaved += water;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Енергоефективні прилади',
          co2: co2,
          water: water,
          waste: 0,
          energy: energy,
          cost: cost,
          description: `${count} приладів зменшують споживання енергії та води`
        });
      }

      if (document.getElementById('low-flow-fixtures').checked) {
        const count = parseInt(document.getElementById('fixture-count').value);
        const water = count * 15000; // liters saved per fixture per year
        const cost = count * 800; // UAH saved per fixture per year
        const co2 = count * 25; // kg CO2 saved (from water heating)
        
        totalCO2Saved += co2;
        totalWaterSaved += water;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Водозберігаючі прилади',
          co2: co2,
          water: water,
          waste: 0,
          energy: 0,
          cost: cost,
          description: `${count} приладів зменшують споживання води на 30-60%`
        });
      }

      // Transportation
      const transportType = document.getElementById('transport-type').value;
      const weeklyMiles = parseFloat(document.getElementById('weekly-miles').value) || 0;
      
      if (transportType && weeklyMiles > 0) {
        const yearlyKm = weeklyMiles * 52 * 1.6; // Convert miles to km
        let co2PerKm = 0;
        let costPerKm = 0;
        let description = '';
        
        switch (transportType) {
          case 'electric':
            co2PerKm = 0.05; // kg CO2 per km (accounting for Ukraine's electricity mix)
            costPerKm = 0.6; // UAH per km
            description = 'Електромобіль значно зменшує викиди';
            break;
          case 'hybrid':
            co2PerKm = 0.12; // kg CO2 per km
            costPerKm = 1.2; // UAH per km
            description = 'Гібрид зменшує споживання палива на 40%';
            break;
          case 'public':
            co2PerKm = 0.08; // kg CO2 per km per person
            costPerKm = 0.5; // UAH per km
            description = 'Громадський транспорт зменшує викиди на особу';
            break;
          case 'bike-walk':
            co2PerKm = 0; // kg CO2 per km
            costPerKm = 0; // UAH per km
            description = 'Активний транспорт має нульові викиди';
            break;
          case 'gas-car':
            co2PerKm = 0.25; // kg CO2 per km (baseline for comparison)
            costPerKm = 2.5; // UAH per km
            description = 'Бензиновий автомобіль (базова лінія)';
            break;
        }
        
        // Calculate savings compared to average gas car
        const baselineCO2 = yearlyKm * 0.25; // Average gas car emissions
        const actualCO2 = yearlyKm * co2PerKm;
        const co2Saved = baselineCO2 - actualCO2;
        
        const baselineCost = yearlyKm * 2.5; // Average gas car cost
        const actualCost = yearlyKm * costPerKm;
        const costSaved = baselineCost - actualCost;
        
        if (co2Saved > 0) {
          totalCO2Saved += co2Saved;
          totalCostSavings += costSaved;
          
          impactDetails.push({
            category: 'Транспорт',
            co2: co2Saved,
            water: 0,
            waste: 0,
            energy: 0,
            cost: costSaved,
            description: `${description} (${yearlyKm.toFixed(0)} км на рік)`
          });
        }
      }

      // Carpool
      if (document.getElementById('carpool').checked) {
        const days = parseInt(document.getElementById('carpool-days').value);
        const co2 = days * 52 * 10; // kg CO2 saved per day per year
        const cost = days * 52 * 200; // UAH saved per day per year
        
        totalCO2Saved += co2;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Спільні поїздки',
          co2: co2,
          water: 0,
          waste: 0,
          energy: 0,
          cost: cost,
          description: `${days} днів на тиждень спільних поїздок`
        });
      }

      // Remote work
      if (document.getElementById('remote-work').checked) {
        const days = parseInt(document.getElementById('remote-days').value);
        const co2 = days * 52 * 8; // kg CO2 saved per day per year
        const cost = days * 52 * 150; // UAH saved per day per year
        
        totalCO2Saved += co2;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Віддалена робота',
          co2: co2,
          water: 0,
          waste: 0,
          energy: 0,
          cost: cost,
          description: `${days} днів на тиждень роботи з дому`
        });
      }

      // Diet
      const dietType = document.getElementById('diet-type').value;
      if (dietType) {
        let co2Savings = 0;
        let waterSavings = 0;
        let description = '';
        
        switch (dietType) {
          case 'vegan':
            co2Savings = 1500; // kg CO2 per person per year
            waterSavings = 200000; // liters per person per year
            description = 'Веганська дієта має найменший екологічний слід';
            break;
          case 'vegetarian':
            co2Savings = 1200;
            waterSavings = 150000;
            description = 'Вегетаріанська дієта значно зменшує вплив';
            break;
          case 'pescatarian':
            co2Savings = 800;
            waterSavings = 100000;
            description = 'Пескетаріанська дієта зменшує викиди від тваринництва';
            break;
          case 'reduced-meat':
            co2Savings = 400;
            waterSavings = 50000;
            description = 'Зменшене споживання м\'яса допомагає довкіллю';
            break;
        }
        
        if (co2Savings > 0) {
          totalCO2Saved += co2Savings * householdSize;
          totalWaterSaved += waterSavings * householdSize;
          
          impactDetails.push({
            category: 'Дієта',
            co2: co2Savings * householdSize,
            water: waterSavings * householdSize,
            waste: 0,
            energy: 0,
            cost: 0,
            description: `${description} для ${householdSize} осіб`
          });
        }
      }

      // Local food
      if (document.getElementById('local-food').checked) {
        const percentage = parseInt(document.getElementById('local-percentage').value);
        const co2 = (percentage / 100) * 300 * householdSize; // kg CO2 saved per year
        const cost = (percentage / 100) * 2000 * householdSize; // UAH saved per year
        
        totalCO2Saved += co2;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Місцеві продукти',
          co2: co2,
          water: 0,
          waste: 0,
          energy: 0,
          cost: cost,
          description: `${percentage}% місцевих продуктів зменшують транспортні викиди`
        });
      }

      // Organic food
      if (document.getElementById('organic-food').checked) {
        const percentage = parseInt(document.getElementById('organic-percentage').value);
        const co2 = (percentage / 100) * 200 * householdSize; // kg CO2 saved per year
        const water = (percentage / 100) * 10000 * householdSize; // liters saved per year
        const cost = -(percentage / 100) * 5000 * householdSize; // UAH extra cost per year
        
        totalCO2Saved += co2;
        totalWaterSaved += water;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Органічні продукти',
          co2: co2,
          water: water,
          waste: 0,
          energy: 0,
          cost: cost,
          description: `${percentage}% органічних продуктів зменшують використання пестицидів`
        });
      }

      // Food waste reduction
      if (document.getElementById('food-waste-reduction').checked) {
        const percentage = parseInt(document.getElementById('waste-reduction').value);
        const co2 = (percentage / 100) * 500 * householdSize; // kg CO2 saved per year
        const waste = (percentage / 100) * 200 * householdSize; // kg waste diverted per year
        const cost = (percentage / 100) * 8000 * householdSize; // UAH saved per year
        
        totalCO2Saved += co2;
        totalWasteDiverted += waste;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Зменшення харчових відходів',
          co2: co2,
          water: 0,
          waste: waste,
          energy: 0,
          cost: cost,
          description: `${percentage}% зменшення харчових відходів`
        });
      }

      // Sustainable clothing
      if (document.getElementById('sustainable-clothing').checked) {
        const items = parseInt(document.getElementById('sustainable-items').value);
        const co2 = items * 15; // kg CO2 saved per item per year
        const water = items * 2000; // liters saved per item
        const cost = -items * 500; // UAH extra cost per item
        
        totalCO2Saved += co2;
        totalWaterSaved += water;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Сталий одяг',
          co2: co2,
          water: water,
          waste: 0,
          energy: 0,
          cost: cost,
          description: `${items} предметів сталого одягу`
        });
      }

      // Secondhand purchases
      if (document.getElementById('secondhand').checked) {
        const percentage = parseInt(document.getElementById('secondhand-percentage').value);
        const co2 = (percentage / 100) * 400; // kg CO2 saved per year
        const waste = (percentage / 100) * 50; // kg waste diverted per year
        const cost = (percentage / 100) * 6000; // UAH saved per year
        
        totalCO2Saved += co2;
        totalWasteDiverted += waste;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Секонд-хенд одяг',
          co2: co2,
          water: 0,
          waste: waste,
          energy: 0,
          cost: cost,
          description: `${percentage}% одягу куплено секонд-хенд`
        });
      }

      // Natural cosmetics
      if (document.getElementById('natural-cosmetics').checked) {
        const products = parseInt(document.getElementById('cosmetic-count').value);
        const co2 = products * 5 * 12; // kg CO2 saved per year
        const water = products * 500 * 12; // liters saved per year
        const cost = -products * 200 * 12; // UAH extra cost per year
        
        totalCO2Saved += co2;
        totalWaterSaved += water;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Натуральна косметика',
          co2: co2,
          water: water,
          waste: 0,
          energy: 0,
          cost: cost,
          description: `${products} натуральних продуктів на місяць`
        });
      }

      // Refillable products
      if (document.getElementById('refillable-products').checked) {
        const products = parseInt(document.getElementById('refillable-count').value);
        const co2 = products * 8; // kg CO2 saved per year
        const waste = products * 5; // kg packaging waste diverted per year
        const cost = products * 600; // UAH saved per year
        
        totalCO2Saved += co2;
        totalWasteDiverted += waste;
        totalCostSavings += cost;
        
        impactDetails.push({
          category: 'Продукти з дозаправкою',
          co2: co2,
          water: 0,
          waste: waste,
          energy: 0,
          cost: cost,
          description: `${products} продуктів з можливістю дозаправки`
        });
      }

      // Apply time period multiplier
      const timeMultipliers = {
        'monthly': 1/12,
        'yearly': 1,
        'lifetime': 50
      };
      
      const multiplier = timeMultipliers[timePeriod];
      totalCO2Saved *= multiplier;
      totalWaterSaved *= multiplier;
      totalWasteDiverted *= multiplier;
      totalEnergySaved *= multiplier;
      totalCostSavings *= multiplier;

      // Environmental equivalents
      const treesEquivalent = totalCO2Saved / 22; // trees needed to absorb CO2
      const coalAvoided = totalCO2Saved / 2.3; // kg of coal not burned
      const carsOffRoad = totalCO2Saved / 4600; // average car emissions per year

      const timePeriodLabels = {
        'monthly': 'місячний',
        'yearly': 'річний',
        'lifetime': 'протягом життя'
      };

      result.innerHTML = `
        <div class="result-section">
          <h4>🌱 Загальний екологічний вплив (${timePeriodLabels[timePeriod]}):</h4>
          <p>Розмір домогосподарства: ${householdSize} осіб</p>
          <p>Період оцінки: ${timePeriodLabels[timePeriod]}</p>
          <p>Активних екологічних практик: ${impactDetails.length}</p>
        </div>
        
        <div class="result-totals">
          <h4>📊 Загальні результати:</h4>
          <p><strong>🌿 CO₂ заощаджено: ${totalCO2Saved.toFixed(1)} кг</strong></p>
          <p><strong>💧 Води заощаджено: ${totalWaterSaved.toFixed(0)} літрів</strong></p>
          <p><strong>♻️ Відходів відвернуто: ${totalWasteDiverted.toFixed(1)} кг</strong></p>
          <p><strong>⚡ Енергії заощаджено: ${totalEnergySaved.toFixed(0)} кВтг</strong></p>
          ${includeCost ? `<p><strong>💰 Фінансовий вплив: ${totalCostSavings >= 0 ? '+' : ''}${totalCostSavings.toFixed(0)} грн</strong></p>` : ''}
        </div>
        
        <div class="result-equivalents">
          <h4>🌍 Екологічні еквіваленти:</h4>
          <p>🌳 Дерев для поглинання CO₂: ${treesEquivalent.toFixed(1)} дерев на рік</p>
          <p>🏭 Вугілля не спалено: ${coalAvoided.toFixed(1)} кг</p>
          <p>🚗 Автомобілів "з дороги": ${carsOffRoad.toFixed(2)} автомобілів на рік</p>
          <p>🏠 Домогосподарств: ваш вплив дорівнює ${(totalCO2Saved / 4000).toFixed(2)} середніх українських домогосподарств</p>
        </div>
        
        <div class="result-breakdown">
          <h4>📋 Детальний розбір:</h4>
          ${impactDetails.map(detail => `
            <div class="impact-item" style="margin: 1rem 0; padding: 1rem; border-left: 4px solid #157aff; background: #f8f9fa;">
              <h5>${detail.category}</h5>
              <p>🌿 CO₂: ${detail.co2.toFixed(1)} кг</p>
              ${detail.water > 0 ? `<p>💧 Вода: ${detail.water.toFixed(0)} л</p>` : ''}
              ${detail.waste > 0 ? `<p>♻️ Відходи: ${detail.waste.toFixed(1)} кг</p>` : ''}
              ${detail.energy > 0 ? `<p>⚡ Енергія: ${detail.energy.toFixed(0)} кВтг</p>` : ''}
              ${includeCost ? `<p>💰 Вплив на бюджет: ${detail.cost >= 0 ? '+' : ''}${detail.cost.toFixed(0)} грн</p>` : ''}
              <p><em>${detail.description}</em></p>
            </div>
          `).join('')}
        </div>
        
        <div class="result-recommendations">
          <h4>💡 Рекомендації для покращення:</h4>
          ${getRecommendations(impactDetails, totalCO2Saved).map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-comparison">
          <h4>📈 Порівняння з базовою лінією:</h4>
          ${getComparisonData(baseline, totalCO2Saved, totalWaterSaved, householdSize, timePeriod).map(comp => `<p>${comp}</p>`).join('')}
        </div>
        
        <div class="result-progress">
          <h4>🎯 Цілі сталого розвитку:</h4>
          <p>📊 Ваш внесок у цілі Паризької угоди: ${((totalCO2Saved / (householdSize * 4000)) * 100).toFixed(1)}% від потрібного скорочення</p>
          <p>🌍 Глобальна середня: ваш слід ${totalCO2Saved > 2000 * householdSize ? 'вище' : 'нижче'} світового середнього</p>
          <p>🇺🇦 Український середній: ${getUkrainianComparison(totalCO2Saved, householdSize)}</p>
        </div>
        
        <div class="result-next-steps">
          <h4>🚀 Наступні кроки:</h4>
          ${getNextSteps(impactDetails, totalCO2Saved).map(step => `<p>${step}</p>`).join('')}
        </div>
        
        <div class="result-impact-over-time">
          <h4>📅 Вплив з часом:</h4>
          <p>📆 Щомісячно: ${(totalCO2Saved / multiplier / 12).toFixed(1)} кг CO₂</p>
          <p>📅 Щорічно: ${(totalCO2Saved / multiplier).toFixed(1)} кг CO₂</p>
          <p>🔮 За 10 років: ${(totalCO2Saved / multiplier * 10).toFixed(0)} кг CO₂</p>
          <p>👥 Вплив на спільноту: якщо 100 сімей повторять ваші дії, вони заощадять ${(totalCO2Saved / multiplier * 100).toFixed(0)} кг CO₂ на рік</p>
        </div>
        
        <div class="result-motivation">
          <h4>🌟 Мотиваційні факти:</h4>
          <p>🌱 Кожен кілограм заощадженого CO₂ допомагає стабілізувати клімат</p>
          <p>💪 Ваші дії надихають інших робити екологічні вибори</p>
          <p>🏆 Ви є частиною глобального руху за сталий розвиток</p>
          <p>🌈 Маленькі дії накопичуються для великого впливу</p>
          <p>💚 Кожен екологічний вибір створює хвильовий ефект позитивних змін</p>
        </div>
      `;
    });
  }

  function getRecommendations(impacts, totalCO2) {
    const recommendations = [];
    const categories = impacts.map(i => i.category);
    
    if (!categories.includes('LED лампи')) {
      recommendations.push('💡 Розгляньте перехід на LED лампи - швидка окупність та значна економія енергії');
    }
    
    if (!categories.includes('Транспорт') && totalCO2 < 1000) {
      recommendations.push('🚗 Транспорт має великий потенціал - розгляньте електромобіль або громадський транспорт');
    }
    
    if (!categories.includes('Дієта')) {
      recommendations.push('🥗 Зменшення споживання м\'яса може мати значний екологічний вплив');
    }
    
    if (!categories.includes('Багаторазові пляшки')) {
      recommendations.push('🚰 Багаторазові пляшки для води - проста та ефективна зміна');
    }
    
    if (totalCO2 > 3000) {
      recommendations.push('🌟 Відмінно! Ви вже робите багато для довкілля. Продовжуйте у тому ж дусі!');
    } else if (totalCO2 > 1000) {
      recommendations.push('👍 Хороший початок! Розгляньте додаткові можливості для покращення');
    } else {
      recommendations.push('🌱 Є багато можливостей для зменшення екологічного сліду - починайте з найпростіших змін');
    }
    
    recommendations.push('📱 Розгляньте використання додатків для відстеження вашого прогресу');
    
    return recommendations;
  }

  function getComparisonData(baseline, co2Saved, waterSaved, householdSize, timePeriod) {
    const comparisons = [];
    const multiplier = timePeriod === 'monthly' ? 12 : timePeriod === 'lifetime' ? 1/50 : 1;
    const annualCO2 = co2Saved * multiplier;
    const annualWater = waterSaved * multiplier;
    
    switch (baseline) {
      case 'average':
        const ukrainianAverage = 6000; // kg CO2 per person per year
        const yourAverage = annualCO2 / householdSize;
        const difference = ukrainianAverage - yourAverage;
        comparisons.push(`🇺🇦 Порівняно з середнім українцем: ви заощаджуєте ${difference.toFixed(0)} кг CO₂ на особу на рік`);
        break;
      case 'global':
        const globalAverage = 4800; // kg CO2 per person per year
        const yourGlobalAverage = annualCO2 / householdSize;
        const globalDifference = globalAverage - yourGlobalAverage;
        comparisons.push(`🌍 Порівняно з глобальним середнім: ваш слід ${globalDifference > 0 ? 'нижче' : 'вище'} на ${Math.abs(globalDifference).toFixed(0)} кг CO₂`);
        break;
      case 'traditional':
        comparisons.push(`📊 Порівняно з традиційними продуктами: ви уникаєте ${annualCO2.toFixed(0)} кг CO₂ щорічно`);
        break;
    }
    
    comparisons.push(`💧 Ваша річна економія води еквівалентна ${(annualWater / 1000).toFixed(1)} тоннам води`);
    
    return comparisons;
  }

  function getNextSteps(impacts, totalCO2) {
    const steps = [];
    const categories = impacts.map(i => i.category);
    
    steps.push('1️⃣ Відстежуйте свій прогрес щомісяця');
    steps.push('2️⃣ Поділіться своїми успіхами з друзями та родиною');
    
    if (totalCO2 < 500) {
      steps.push('3️⃣ Оберіть одну нову екологічну практику для впровадження наступного місяця');
    } else if (totalCO2 < 2000) {
      steps.push('3️⃣ Розширте існуючі практики або додайте нові категорії');
    } else {
      steps.push('3️⃣ Станьте амбасадором сталого розвитку у вашій спільноті');
    }
    
    steps.push('4️⃣ Досліджуйте місцеві ініціативи з охорони довкілля');
    steps.push('5️⃣ Розгляньте компенсацію залишкового вуглецевого сліду');
    
    return steps;
  }

  function getUkrainianComparison(co2Saved, householdSize) {
    const ukrainianAverage = 6000; // kg per person per year
    const yourPerPerson = co2Saved / householdSize;
    
    if (yourPerPerson > ukrainianAverage * 0.7) {
      return 'ви значно екологічніші за середнього українця';
    } else if (yourPerPerson > ukrainianAverage * 0.3) {
      return 'ви на шляху до екологічнішого способу життя';
    } else {
      return 'є чимало можливостей наблизитися до екологічних стандартів';
    }
  }
});