document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('efficiency-form');
  const result = document.getElementById('efficiency-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const panelTechnology = document.getElementById('panelTechnology').value;
      const ratedPower = parseFloat(document.getElementById('ratedPower').value);
      const panelEfficiency = parseFloat(document.getElementById('panelEfficiency').value);
      const panelArea = parseFloat(document.getElementById('panelArea').value);
      
      const averageIrradiance = parseFloat(document.getElementById('averageIrradiance').value);
      const averageTemperature = parseFloat(document.getElementById('averageTemperature').value);
      const tempCoefficient = parseFloat(document.getElementById('tempCoefficient').value);
      const peakSunHours = parseFloat(document.getElementById('peakSunHours').value);
      
      const tiltAngle = parseFloat(document.getElementById('tiltAngle').value);
      const azimuthAngle = parseFloat(document.getElementById('azimuthAngle').value);
      const shadingLoss = parseFloat(document.getElementById('shadingLoss').value);
      const inverterEfficiency = parseFloat(document.getElementById('inverterEfficiency').value);
      
      const systemAge = parseFloat(document.getElementById('systemAge').value);
      const degradationRate = parseFloat(document.getElementById('degradationRate').value);
      const analysisYears = parseFloat(document.getElementById('analysisYears').value);
      const electricityRate = parseFloat(document.getElementById('electricityRate').value);
      
      if (ratedPower <= 0 || panelEfficiency <= 0 || panelArea <= 0) {
        result.textContent = "Будь ласка, заповніть всі поля дійсними значеннями.";
        return;
      }

      // Calculate temperature effects
      const tempDifference = averageTemperature - 25; // Standard test condition is 25°C
      const tempLoss = tempDifference * (tempCoefficient / 100);
      const temperatureAdjustedEfficiency = panelEfficiency * (1 + tempLoss);
      
      // Calculate irradiance effects (STC is 1000 W/m²)
      const irradianceRatio = averageIrradiance / 1000;
      
      // Calculate actual panel output
      const actualPanelOutput = ratedPower * irradianceRatio * (temperatureAdjustedEfficiency / panelEfficiency);
      
      // Calculate system losses
      const shadingFactor = (100 - shadingLoss) / 100;
      const inverterFactor = inverterEfficiency / 100;
      const azimuthLoss = calculateAzimuthLoss(azimuthAngle);
      const tiltLoss = calculateTiltLoss(tiltAngle, 49); // Latitude for Ukraine center
      
      // Calculate daily energy production
      const dailyEnergyProduction = actualPanelOutput * peakSunHours * shadingFactor * inverterFactor * azimuthLoss * tiltLoss;
      
      // Calculate annual energy production
      const annualEnergyProduction = dailyEnergyProduction * 365;
      
      // Calculate degradation over time
      const currentYearDegradation = Math.pow((1 - degradationRate / 100), systemAge);
      const currentAnnualProduction = annualEnergyProduction * currentYearDegradation;
      
      // Calculate lifetime production
      let lifetimeProduction = 0;
      const yearlyProductions = [];
      for (let year = 0; year < analysisYears; year++) {
        const yearDegradation = Math.pow((1 - degradationRate / 100), systemAge + year);
        const yearProduction = annualEnergyProduction * yearDegradation;
        lifetimeProduction += yearProduction;
        yearlyProductions.push({
          year: year + 1,
          production: yearProduction,
          efficiency: temperatureAdjustedEfficiency * yearDegradation
        });
      }
      
      // Calculate financial metrics
      const annualSavings = currentAnnualProduction * electricityRate;
      const lifetimeSavings = lifetimeProduction * electricityRate;
      
      // Performance ratios
      const performanceRatio = (currentAnnualProduction / (ratedPower * peakSunHours * 365)) * 100;
      const specificYield = currentAnnualProduction / ratedPower; // kWh/kWp
      
      // Environmental impact
      const co2Saved = currentAnnualProduction * 0.55; // kg CO2 per kWh for Ukraine grid
      const lifetimeCO2Saved = lifetimeProduction * 0.55;
      
      // Technology comparison
      const techComparison = getTechnologyComparison(panelTechnology, temperatureAdjustedEfficiency);

      const techLabels = {
        'monocrystalline': 'Монокристалічний кремній',
        'polycrystalline': 'Полікристалічний кремній',
        'thin-film-cdte': 'Тонкоплівкові (CdTe)',
        'thin-film-cigs': 'Тонкоплівкові (CIGS)',
        'bifacial': 'Двосторонні панелі',
        'perc': 'PERC технологія'
      };

      result.innerHTML = `
        <div class="result-section">
          <h4>☀️ Специфікації системи:</h4>
          <p>Технологія: ${techLabels[panelTechnology]}</p>
          <p>Номінальна потужність: ${ratedPower} Вт</p>
          <p>Площа панелі: ${panelArea} м²</p>
          <p>Номінальна ефективність: ${panelEfficiency}%</p>
          <p>Ефективність з урахуванням температури: ${temperatureAdjustedEfficiency.toFixed(1)}%</p>
        </div>
        
        <div class="result-performance">
          <h4>📊 Ефективність системи:</h4>
          <p><strong>Поточний річний виробіток: ${currentAnnualProduction.toFixed(0)} кВтг</strong></p>
          <p>Денний виробіток: ${dailyEnergyProduction.toFixed(1)} кВтг</p>
          <p>Коефіцієнт ефективності: ${performanceRatio.toFixed(1)}%</p>
          <p>Питомий виробіток: ${specificYield.toFixed(0)} кВтг/кВт</p>
          <p>Фактична потужність: ${actualPanelOutput.toFixed(0)} Вт</p>
        </div>
        
        <div class="result-environmental">
          <h4>🌱 Екологічні умови:</h4>
          <p>Середня освітленість: ${averageIrradiance} Вт/м²</p>
          <p>Середня температура панелі: ${averageTemperature}°C</p>
          <p>Втрата через температуру: ${(tempLoss * 100).toFixed(1)}%</p>
          <p>Години пікового сонця: ${peakSunHours} год/день</p>
          <p>Втрати від затінення: ${shadingLoss}%</p>
        </div>
        
        <div class="result-positioning">
          <h4>📐 Вплив розташування:</h4>
          <p>Кут нахилу: ${tiltAngle}° (втрата: ${((1 - tiltLoss) * 100).toFixed(1)}%)</p>
          <p>Азимутний кут: ${azimuthAngle}° (втрата: ${((1 - azimuthLoss) * 100).toFixed(1)}%)</p>
          <p>Ефективність інвертора: ${inverterEfficiency}%</p>
          <p>Загальні системні втрати: ${((1 - shadingFactor * inverterFactor * azimuthLoss * tiltLoss) * 100).toFixed(1)}%</p>
        </div>
        
        <div class="result-degradation">
          <h4>📉 Деградація з часом:</h4>
          <p>Вік системи: ${systemAge} років</p>
          <p>Річна деградація: ${degradationRate}%</p>
          <p>Поточна ефективність: ${(currentYearDegradation * 100).toFixed(1)}% від початкової</p>
          <p>Ефективність через ${analysisYears} років: ${(Math.pow((1 - degradationRate / 100), systemAge + analysisYears) * 100).toFixed(1)}%</p>
        </div>
        
        <div class="result-financial">
          <h4>💰 Фінансові показники:</h4>
          <p><strong>Річна економія: ${annualSavings.toFixed(0)} грн</strong></p>
          <p>Економія за ${analysisYears} років: ${lifetimeSavings.toFixed(0)} грн</p>
          <p>Тариф на електроенергію: ${electricityRate} грн/кВтг</p>
          <p>Виробіток за весь термін служби: ${lifetimeProduction.toFixed(0)} кВтг</p>
        </div>
        
        <div class="result-carbon">
          <h4>🌍 Екологічний вплив:</h4>
          <p><strong>Річне скорочення CO₂: ${co2Saved.toFixed(0)} кг</strong></p>
          <p>Скорочення CO₂ за весь термін: ${lifetimeCO2Saved.toFixed(0)} кг</p>
          <p>Еквівалент: ${(lifetimeCO2Saved / 22).toFixed(1)} дерев протягом ${analysisYears} років</p>
          <p>Запобігання спалюванню: ${(lifetimeCO2Saved / 2.3).toFixed(0)} кг вугілля</p>
        </div>
        
        <div class="result-technology">
          <h4>🔬 Порівняння технологій:</h4>
          <p><strong>Ваша технологія: ${techLabels[panelTechnology]}</strong></p>
          ${techComparison.map(tech => `
            <p>${tech.name}: ${tech.efficiency}% ефективності - ${tech.description}</p>
          `).join('')}
        </div>
        
        <div class="result-optimization">
          <h4>⚡ Рекомендації для оптимізації:</h4>
          ${getOptimizationRecommendations(tiltAngle, azimuthAngle, shadingLoss, averageTemperature, panelTechnology).map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>🌤️ Сезонні варіації:</h4>
          <p>☀️ Літо: Очікуйте +15-25% виробітку через довші дні</p>
          <p>❄️ Зима: Очікуйте -20-30% виробітку через коротші дні</p>
          <p>🌸 Весна/Осінь: Оптимальні умови для ефективності панелей</p>
          <p>🌧️ Хмарні дні: Виробіток знижується до 10-25% від пікового</p>
          <p>🌨️ Сніг: Може блокувати панелі, але підвищує відбиття світла</p>
        </div>
        
        <div class="result-maintenance">
          <h4>🧹 Поради з обслуговування:</h4>
          <p>🧽 Чистіть панелі кожні 3-6 місяців або після пилових бур</p>
          <p>🔍 Перевіряйте затінення від ростучих дерев щорічно</p>
          <p>📊 Моніторте виробіток щомісяця для виявлення проблем</p>
          <p>⚡ Перевіряйте інвертор та з'єднання щорічно</p>
          <p>🌿 Обрізайте рослинність, що створює затінення</p>
        </div>
        
        <div class="result-future">
          <h4>🔮 Майбутні покращення:</h4>
          <p>📈 Розгляньте додавання панелей при підвищенні споживання</p>
          <p>🔋 Додайте накопичувачі енергії для незалежності</p>
          <p>🏠 Інтегруйте з системами розумного дому</p>
          <p>⚡ Оновіть інвертор через 10-15 років</p>
          <p>🌐 Слідкуйте за новими технологіями панелей</p>
        </div>
        
        <div class="result-roi">
          <h4>📈 Показники окупності:</h4>
          <p>Річна віддача: ${((annualSavings / (ratedPower * 35)) * 100).toFixed(1)}% (припускаючи 35 грн/Вт)</p>
          <p>Простий період окупності: ~${(ratedPower * 35 / annualSavings).toFixed(1)} років</p>
          <p>Внутрішня норма прибутку: ~${(Math.pow(lifetimeSavings / (ratedPower * 35), 1/analysisYears) - 1) * 100 || 0).toFixed(1)}%</p>
          <p>💡 Врахуйте державні субсидії та пільги при розрахунку ROI</p>
        </div>
      `;
      
      // Show chart
      const chartBlock = document.getElementById('efficiency-chart-block');
      if (chartBlock) {
        chartBlock.style.display = 'block';
        createEfficiencyChart(yearlyProductions.slice(0, 10)); // Show first 10 years
      }
    });
  }

  function calculateAzimuthLoss(azimuthAngle) {
    // Optimal azimuth is 0° (south), calculate loss for deviation
    const azimuthLoss = Math.cos(azimuthAngle * Math.PI / 180);
    return Math.max(0.8, azimuthLoss); // Minimum 80% to avoid extreme values
  }

  function calculateTiltLoss(tiltAngle, latitude) {
    // Optimal tilt is roughly equal to latitude
    const optimalTilt = latitude;
    const tiltDifference = Math.abs(tiltAngle - optimalTilt);
    const tiltLoss = 1 - (tiltDifference * 0.002); // Approximate 0.2% loss per degree
    return Math.max(0.85, tiltLoss); // Minimum 85%
  }

  function getTechnologyComparison(currentTech, currentEfficiency) {
    const technologies = [
      { name: 'Монокристалічний', efficiency: '20-22', description: 'Найвища ефективність, довговічність' },
      { name: 'Полікристалічний', efficiency: '15-17', description: 'Економічний, добра ефективність' },
      { name: 'Тонкоплівкові CdTe', efficiency: '11-13', description: 'Низька вартість, гнучкість' },
      { name: 'Тонкоплівкові CIGS', efficiency: '13-15', description: 'Хороша ефективність при слабкому світлі' },
      { name: 'Двосторонні', efficiency: '18-22', description: 'Захоплення світла з обох сторін' },
      { name: 'PERC', efficiency: '19-21', description: 'Покращене захоплення світла' }
    ];
    
    return technologies.filter(tech => {
      // Show all technologies for comparison
      return true;
    });
  }

  function getOptimizationRecommendations(tilt, azimuth, shading, temperature, technology) {
    const recommendations = [];
    
    if (Math.abs(azimuth) > 20) {
      recommendations.push(`🧭 Розгляньте переорієнтацію панелей ближче до півдня (поточний азимут: ${azimuth}°)`);
    }
    
    if (tilt < 30 || tilt > 50) {
      recommendations.push(`📐 Оптимізуйте кут нахилу до 35-40° для України (поточний: ${tilt}°)`);
    }
    
    if (shading > 10) {
      recommendations.push(`🌳 Зменшіть затінення - поточні втрати ${shading}% значно впливають на виробіток`);
    }
    
    if (temperature > 60) {
      recommendations.push(`🌡️ Покращіть вентиляцію панелей - висока температура (${temperature}°C) знижує ефективність`);
    }
    
    if (technology === 'thin-film-cdte' || technology === 'thin-film-cigs') {
      recommendations.push(`⚡ Розгляньте перехід на кристалічні панелі для вищої ефективності`);
    }
    
    recommendations.push(`🔧 Регулярно чистіть панелі та перевіряйте з'єднання`);
    recommendations.push(`📊 Встановіть систему моніторингу для відстеження ефективності`);
    
    return recommendations;
  }

  function createEfficiencyChart(yearlyData) {
    const canvas = document.getElementById('efficiency-chart');
    if (!canvas || !window.Chart) return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: yearlyData.map(d => `Рік ${d.year}`),
        datasets: [
          {
            label: 'Виробіток енергії (кВтг)',
            data: yearlyData.map(d => d.production.toFixed(0)),
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            yAxisID: 'y'
          },
          {
            label: 'Ефективність (%)',
            data: yearlyData.map(d => d.efficiency.toFixed(1)),
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Виробіток енергії (кВтг)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Ефективність (%)'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Зміна ефективності та виробітку з часом'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
});