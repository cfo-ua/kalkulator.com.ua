document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('energy-audit-form');
  const result = document.getElementById('energy-audit-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const homeSize = parseFloat(document.getElementById('homeSize').value);
      const homeAge = parseFloat(document.getElementById('homeAge').value);
      const homeType = document.getElementById('homeType').value;
      const stories = parseFloat(document.getElementById('stories').value);
      
      const monthlyElectric = parseFloat(document.getElementById('monthlyElectric').value);
      const monthlyGas = parseFloat(document.getElementById('monthlyGas').value);
      const electricRate = parseFloat(document.getElementById('electricRate').value);
      const gasRate = parseFloat(document.getElementById('gasRate').value);
      
      const heatingType = document.getElementById('heatingType').value;
      const heatingAge = parseFloat(document.getElementById('heatingAge').value);
      const coolingType = document.getElementById('coolingType').value;
      const programmableThermostat = document.getElementById('programmableThermostat').value;
      
      const insulationLevel = document.getElementById('insulationLevel').value;
      const windowType = document.getElementById('windowType').value;
      const airLeakage = document.getElementById('airLeakage').value;
      
      const waterHeaterType = document.getElementById('waterHeaterType').value;
      const waterHeaterAge = parseFloat(document.getElementById('waterHeaterAge').value);
      const waterHeaterInsulation = document.getElementById('waterHeaterInsulation').value;
      
      const lightingType = document.getElementById('lightingType').value;
      const applianceAge = document.getElementById('applianceAge').value;
      const energyStarAppliances = document.getElementById('energyStarAppliances').value;
      
      const climateZone = document.getElementById('climateZone').value;
      const heatingDegreeeDays = parseFloat(document.getElementById('heatingDegreeeDays').value);
      const coolingDegreeDays = parseFloat(document.getElementById('coolingDegreeDays').value);
      
      if (homeSize <= 0 || monthlyElectric <= 0) {
        result.textContent = "Будь ласка, заповніть всі обов'язкові поля дійсними значеннями.";
        return;
      }

      // Calculate current usage
      const monthlyElectricKwh = monthlyElectric / electricRate;
      const monthlyGasM3 = monthlyGas / gasRate;
      const annualElectricKwh = monthlyElectricKwh * 12;
      const annualGasM3 = monthlyGasM3 * 12;
      const annualEnergyCost = (monthlyElectric + monthlyGas) * 12;
      
      // Calculate energy intensity
      const electricIntensity = monthlyElectricKwh / homeSize; // kWh/m²/month
      const gasIntensity = monthlyGasM3 / homeSize; // m³/m²/month
      
      // Efficiency factors
      const insulationFactors = { poor: 0.6, fair: 0.75, good: 0.9, excellent: 1.0 };
      const airLeakageFactors = { high: 0.7, moderate: 0.85, low: 1.0 };
      const windowFactors = { single: 0.6, double: 0.8, triple: 0.95, storm: 0.85 };
      const heatingEfficiencyFactors = {
        'gas-furnace': heatingAge > 15 ? 0.7 : 0.85,
        'electric-heat-pump': heatingAge > 10 ? 0.8 : 0.9,
        'electric-resistance': 0.95,
        'oil-furnace': heatingAge > 20 ? 0.65 : 0.8,
        'boiler': heatingAge > 15 ? 0.75 : 0.88
      };
      
      // Calculate potential improvements
      const insulationImprovement = insulationLevel === 'poor' || insulationLevel === 'fair' ? 0.2 : 0.1;
      const airSealingImprovement = airLeakage === 'high' ? 0.25 : airLeakage === 'moderate' ? 0.15 : 0.05;
      const windowImprovement = windowType === 'single' ? 0.3 : windowType === 'double' ? 0.15 : 0.05;
      const heatingImprovement = heatingAge > 15 ? 0.25 : heatingAge > 10 ? 0.15 : 0.05;
      const lightingImprovement = lightingType === 'incandescent' ? 0.75 : lightingType === 'cfl' ? 0.5 : lightingType === 'mixed' ? 0.4 : 0.1;
      const applianceImprovement = applianceAge === 'old' ? 0.3 : applianceAge === 'moderate' ? 0.2 : 0.1;
      const thermostatImprovement = programmableThermostat === 'no' ? 0.15 : programmableThermostat === 'basic' ? 0.1 : 0.05;
      
      // Calculate water heating efficiency
      const waterHeaterEfficiency = getWaterHeaterEfficiency(waterHeaterType, waterHeaterAge, waterHeaterInsulation);
      const waterHeatingImprovement = waterHeaterAge > 10 ? 0.25 : waterHeaterInsulation === 'none' ? 0.15 : 0.1;
      
      // Calculate potential savings
      const totalPotentialSavings = Math.min(0.4, 
        insulationImprovement * 0.3 + 
        airSealingImprovement * 0.25 + 
        windowImprovement * 0.15 + 
        heatingImprovement * 0.2 + 
        lightingImprovement * 0.05 + 
        applianceImprovement * 0.1 + 
        thermostatImprovement * 0.1 + 
        waterHeatingImprovement * 0.15
      );
      
      const annualSavings = annualEnergyCost * totalPotentialSavings;
      const monthlySavings = annualSavings / 12;
      
      // Calculate improvement costs and payback periods
      const improvements = calculateImprovements(homeSize, totalPotentialSavings, annualSavings);
      
      // Calculate carbon footprint
      const annualCO2Electric = annualElectricKwh * 0.55; // kg CO2/kWh for Ukraine grid
      const annualCO2Gas = annualGasM3 * 2.0; // kg CO2/m³ for natural gas
      const totalCO2 = annualCO2Electric + annualCO2Gas;
      const co2Reduction = totalCO2 * totalPotentialSavings;
      
      // Energy efficiency rating
      const currentRating = calculateEnergyRating(electricIntensity, gasIntensity, homeAge, insulationLevel);
      const improvedRating = calculateEnergyRating(
        electricIntensity * (1 - totalPotentialSavings * 0.6),
        gasIntensity * (1 - totalPotentialSavings * 0.7),
        homeAge,
        'good'
      );

      result.innerHTML = `
        <div class="result-section">
          <h4>🏠 Поточний енергетичний профіль:</h4>
          <p>Площа дому: ${homeSize} м²</p>
          <p>Вік дому: ${homeAge} років</p>
          <p>Тип: ${getHomeTypeLabel(homeType)}</p>
          <p>Поверхів: ${stories}</p>
        </div>
        
        <div class="result-usage">
          <h4>📊 Споживання енергії:</h4>
          <p><strong>Місячні витрати: ${(monthlyElectric + monthlyGas).toFixed(0)} грн</strong></p>
          <p>Електроенергія: ${monthlyElectricKwh.toFixed(0)} кВтг (${monthlyElectric.toFixed(0)} грн)</p>
          <p>Газ: ${monthlyGasM3.toFixed(0)} м³ (${monthlyGas.toFixed(0)} грн)</p>
          <p>Річні витрати: ${annualEnergyCost.toFixed(0)} грн</p>
          <p>Інтенсивність електроенергії: ${electricIntensity.toFixed(1)} кВтг/м²/місяць</p>
          <p>Інтенсивність газу: ${gasIntensity.toFixed(2)} м³/м²/місяць</p>
        </div>
        
        <div class="result-rating">
          <h4>⭐ Енергетичний рейтинг:</h4>
          <p><strong>Поточний рейтинг: ${currentRating}</strong></p>
          <p>Потенційний рейтинг після покращень: ${improvedRating}</p>
          <p>Клас ефективності: ${getEfficiencyClass(currentRating)}</p>
        </div>
        
        <div class="result-savings">
          <h4>💰 Потенційна економія:</h4>
          <p><strong>Загальний потенціал економії: ${(totalPotentialSavings * 100).toFixed(1)}%</strong></p>
          <p><strong>Річна економія: ${annualSavings.toFixed(0)} грн</strong></p>
          <p>Місячна економія: ${monthlySavings.toFixed(0)} грн</p>
          <p>Економія за 10 років: ${(annualSavings * 10).toFixed(0)} грн</p>
        </div>
        
        <div class="result-carbon">
          <h4>🌱 Вплив на довкілля:</h4>
          <p>Поточні річні викиди CO₂: ${totalCO2.toFixed(0)} кг</p>
          <p><strong>Потенційне скорочення CO₂: ${co2Reduction.toFixed(0)} кг/рік</strong></p>
          <p>Еквівалент: ${(co2Reduction / 22).toFixed(1)} дерев на рік</p>
          <p>Скорочення викидів від електроенергії: ${(annualCO2Electric * totalPotentialSavings).toFixed(0)} кг/рік</p>
          <p>Скорочення викидів від газу: ${(annualCO2Gas * totalPotentialSavings).toFixed(0)} кг/рік</p>
        </div>
        
        <div class="result-improvements">
          <h4>🔧 Рекомендовані покращення:</h4>
          ${improvements.map(imp => `
            <div class="improvement-item" style="margin: 1rem 0; padding: 1rem; border-left: 4px solid #157aff; background: #f8f9fa;">
              <h5>${imp.name}</h5>
              <p><strong>Потенційна економія:</strong> ${imp.savings.toFixed(0)} грн/рік</p>
              <p><strong>Орієнтовна вартість:</strong> ${imp.cost.toFixed(0)} грн</p>
              <p><strong>Період окупності:</strong> ${imp.payback.toFixed(1)} років</p>
              <p><strong>Пріоритет:</strong> ${imp.priority}</p>
              <p>${imp.description}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="result-efficiency-tips">
          <h4>💡 Швидкі поради для енергоефективності:</h4>
          ${getEfficiencyTips(insulationLevel, airLeakage, heatingType, lightingType).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>🌡️ Сезонні рекомендації:</h4>
          <p>❄️ Зима: Встановіть термостат на 18-20°C, заклейте витоки повітря</p>
          <p>☀️ Літо: Використовуйте вентилятори, закривайте штори вдень</p>
          <p>🍂 Осінь: Перевірте ущільнення вікон, почистіть фільтри HVAC</p>
          <p>🌸 Весна: Заплануйте енергетичні модернізації, провітріть природно</p>
        </div>
        
        <div class="result-financial">
          <h4>💳 Фінансові міркування:</h4>
          <p>Загальна вартість усіх покращень: ${improvements.reduce((sum, imp) => sum + imp.cost, 0).toFixed(0)} грн</p>
          <p>Середній період окупності: ${(improvements.reduce((sum, imp) => sum + imp.payback, 0) / improvements.length).toFixed(1)} років</p>
          <p>Збільшення вартості дому: ~${(annualSavings * 15).toFixed(0)} грн</p>
          <p>💡 Шукайте державні програми енергоефективності та пільги</p>
        </div>
        
        <div class="result-next-steps">
          <h4>📋 Наступні кроки:</h4>
          <p>1️⃣ Почніть з найрентабельніших покращень (герметизація повітря)</p>
          <p>2️⃣ Отримайте професійні оцінки для великих модернізацій</p>
          <p>3️⃣ Дослідіджуйте місцеві програми знижок та пільг</p>
          <p>4️⃣ Розгляньте фінансування енергоефективності</p>
          <p>5️⃣ Моніторте споживання енергії після покращень</p>
        </div>
      `;
      
      // Show chart if available
      const chartBlock = document.getElementById('energy-audit-chart-block');
      if (chartBlock) {
        chartBlock.style.display = 'block';
        createEnergyChart(monthlyElectricKwh, monthlyGasM3, improvements);
      }
    });
  }

  function getHomeTypeLabel(type) {
    const labels = {
      'single-family': 'Приватний дім',
      'townhouse': 'Таунхаус',
      'condo': 'Квартира/Кондомініум',
      'mobile': 'Мобільний будинок'
    };
    return labels[type] || type;
  }

  function getWaterHeaterEfficiency(type, age, insulation) {
    let baseEfficiency = 0.8;
    
    if (type === 'gas-tankless' || type === 'electric-tankless') {
      baseEfficiency = 0.95;
    } else if (type === 'heat-pump') {
      baseEfficiency = 3.0; // COP
    }
    
    if (age > 10) baseEfficiency *= 0.9;
    if (insulation === 'blanket') baseEfficiency *= 1.05;
    if (insulation === 'built-in') baseEfficiency *= 1.1;
    
    return baseEfficiency;
  }

  function calculateEnergyRating(electricIntensity, gasIntensity, homeAge, insulationLevel) {
    let score = 100;
    
    // Electric intensity penalty
    if (electricIntensity > 15) score -= 20;
    else if (electricIntensity > 12) score -= 15;
    else if (electricIntensity > 10) score -= 10;
    
    // Gas intensity penalty
    if (gasIntensity > 0.8) score -= 20;
    else if (gasIntensity > 0.6) score -= 15;
    else if (gasIntensity > 0.4) score -= 10;
    
    // Age penalty
    if (homeAge > 30) score -= 15;
    else if (homeAge > 20) score -= 10;
    else if (homeAge > 10) score -= 5;
    
    // Insulation bonus/penalty
    if (insulationLevel === 'excellent') score += 10;
    else if (insulationLevel === 'poor') score -= 15;
    else if (insulationLevel === 'fair') score -= 5;
    
    return Math.max(0, Math.min(100, score)).toFixed(0);
  }

  function getEfficiencyClass(rating) {
    if (rating >= 90) return 'A (Відмінно)';
    if (rating >= 80) return 'B (Добре)';
    if (rating >= 70) return 'C (Задовільно)';
    if (rating >= 60) return 'D (Середнє)';
    if (rating >= 50) return 'E (Погано)';
    return 'F (Дуже погано)';
  }

  function calculateImprovements(homeSize, totalSavings, annualSavings) {
    const improvements = [
      {
        name: '🌬️ Герметизація повітря',
        savings: annualSavings * 0.25,
        cost: homeSize * 80, // 80 грн/м²
        priority: 'Високий',
        description: 'Заклейте витоки повітря навколо вікон, дверей та отворів. Найрентабельніше покращення.'
      },
      {
        name: '🏠 Покращення утеплення',
        savings: annualSavings * 0.3,
        cost: homeSize * 200, // 200 грн/м²
        priority: 'Високий',
        description: 'Додайте або покращіть утеплення горища, стін та підвалу.'
      },
      {
        name: '🌡️ Програмований термостат',
        savings: annualSavings * 0.1,
        cost: 3500, // 3500 грн
        priority: 'Середній',
        description: 'Автоматично регулюйте температуру для економії енергії.'
      },
      {
        name: '🪟 Покращення вікон',
        savings: annualSavings * 0.15,
        cost: homeSize * 150, // 150 грн/м² площі вікон
        priority: 'Середній',
        description: 'Замініть старі вікна або додайте штормові вікна.'
      },
      {
        name: '💡 LED освітлення',
        savings: annualSavings * 0.05,
        cost: 5000, // 5000 грн
        priority: 'Низький',
        description: 'Замініть всі лампи на енергоефективні LED.'
      },
      {
        name: '💧 Утеплення водонагрівача',
        savings: annualSavings * 0.1,
        cost: 2000, // 2000 грн
        priority: 'Середній',
        description: 'Додайте утеплюючий кожух та утепліть труби.'
      }
    ];

    return improvements.map(imp => ({
      ...imp,
      payback: imp.cost / imp.savings
    })).sort((a, b) => a.payback - b.payback);
  }

  function getEfficiencyTips(insulation, airLeakage, heating, lighting) {
    const tips = [];
    
    if (insulation === 'poor' || insulation === 'fair') {
      tips.push('🏠 Покращте утеплення - це може заощадити до 30% енергії');
    }
    
    if (airLeakage === 'high' || airLeakage === 'moderate') {
      tips.push('🌬️ Загерметизуйте витоки повітря герметиком та ущільнювачами');
    }
    
    if (heating === 'gas-furnace') {
      tips.push('🔧 Регулярно міняйте фільтри HVAC кожні 1-3 місяці');
    }
    
    if (lighting === 'incandescent' || lighting === 'mixed') {
      tips.push('💡 Замініть лампи розжарювання на LED - економія до 75% енергії');
    }
    
    tips.push('❄️ Знизьте термостат на 1°C - заощадьте 5-10% витрат на опалення');
    tips.push('💧 Використовуйте холодну воду для прання - заощадьте до 90% енергії');
    tips.push('🔌 Відключайте електроприлади коли не користуєтесь');
    
    return tips;
  }

  function createEnergyChart(electricKwh, gasM3, improvements) {
    const canvas = document.getElementById('energy-audit-chart');
    if (!canvas || !window.Chart) return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Опалення/Охолодження', 'Нагрівання води', 'Освітлення', 'Побутова техніка', 'Інше'],
        datasets: [{
          data: [45, 18, 12, 20, 5],
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Розподіл споживання енергії'
          }
        }
      }
    });
  }
});