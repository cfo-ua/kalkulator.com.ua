document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wind-turbine-form');
  const result = document.getElementById('wind-turbine-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const averageWindSpeed = parseFloat(document.getElementById('averageWindSpeed').value);
      const windSpeedDistribution = document.getElementById('windSpeedDistribution').value;
      const hubHeight = parseFloat(document.getElementById('hubHeight').value);
      const terrainRoughness = parseFloat(document.getElementById('terrainRoughness').value);
      
      const turbineType = document.getElementById('turbineType').value;
      const ratedPower = parseFloat(document.getElementById('ratedPower').value);
      const cutInSpeed = parseFloat(document.getElementById('cutInSpeed').value);
      const ratedSpeed = parseFloat(document.getElementById('ratedSpeed').value);
      const cutOutSpeed = parseFloat(document.getElementById('cutOutSpeed').value);
      
      const turbineCost = parseFloat(document.getElementById('turbineCost').value);
      const installationCost = parseFloat(document.getElementById('installationCost').value);
      const electricityRate = parseFloat(document.getElementById('electricityRate').value);
      const feedInTariff = parseFloat(document.getElementById('feedInTariff').value);
      const maintenanceCostPerYear = parseFloat(document.getElementById('maintenanceCostPerYear').value);
      
      const homeEnergyConsumption = parseFloat(document.getElementById('homeEnergyConsumption').value);
      const selfConsumptionRatio = parseFloat(document.getElementById('selfConsumptionRatio').value) / 100;
      const gridConnectionCost = parseFloat(document.getElementById('gridConnectionCost').value);
      const analysisYears = parseFloat(document.getElementById('analysisYears').value);
      
      const availabilityFactor = parseFloat(document.getElementById('availabilityFactor').value) / 100;
      const performanceDegradation = parseFloat(document.getElementById('performanceDegradation').value) / 100;
      const discountRate = parseFloat(document.getElementById('discountRate').value) / 100;
      const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;
      
      if (averageWindSpeed <= 0 || ratedPower <= 0 || cutInSpeed <= 0) {
        result.textContent = "Будь ласка, заповніть всі поля дійсними значеннями.";
        return;
      }

      // Wind speed adjustment for height using power law
      const referenceHeight = 10; // meters
      const powerLawExponent = Math.pow(terrainRoughness, 0.2);
      const adjustedWindSpeed = averageWindSpeed * Math.pow(hubHeight / referenceHeight, powerLawExponent);
      
      // Turbine specifications database
      const turbineSpecs = {
        'horizontal_3kw': { 
          name: 'Горизонтальна 3 кВт', 
          efficiency: 0.35, 
          diameter: 3.5,
          noiseLevel: 42 
        },
        'horizontal_5kw': { 
          name: 'Горизонтальна 5 кВт', 
          efficiency: 0.38, 
          diameter: 5.2,
          noiseLevel: 44 
        },
        'horizontal_10kw': { 
          name: 'Горизонтальна 10 кВт', 
          efficiency: 0.40, 
          diameter: 7.5,
          noiseLevel: 46 
        },
        'vertical_2kw': { 
          name: 'Вертикальна 2 кВт', 
          efficiency: 0.25, 
          diameter: 3.0,
          noiseLevel: 38 
        },
        'vertical_5kw': { 
          name: 'Вертикальна 5 кВт', 
          efficiency: 0.28, 
          diameter: 4.5,
          noiseLevel: 40 
        },
        'custom': { 
          name: 'Користувацька', 
          efficiency: 0.35, 
          diameter: Math.sqrt(ratedPower * 1000 / (0.5 * 1.225 * Math.PI * 0.35 * Math.pow(ratedSpeed, 3))),
          noiseLevel: 42 
        }
      };
      
      const turbine = turbineSpecs[turbineType] || turbineSpecs['custom'];
      
      // Power curve calculation
      function calculatePower(windSpeed) {
        if (windSpeed < cutInSpeed) return 0;
        if (windSpeed >= cutOutSpeed) return 0;
        if (windSpeed >= ratedSpeed) return ratedPower;
        
        // Simplified power curve: cubic relationship below rated speed
        const powerRatio = Math.pow(windSpeed / ratedSpeed, 3);
        return Math.min(ratedPower * powerRatio, ratedPower);
      }
      
      // Wind speed distribution calculation
      function getWindSpeedProbability(speed, avgSpeed, distribution) {
        switch (distribution) {
          case 'rayleigh':
            // Rayleigh distribution
            const c = avgSpeed * Math.sqrt(2 / Math.PI);
            return (speed / (c * c)) * Math.exp(-0.5 * Math.pow(speed / c, 2));
          case 'weibull_k2':
            // Weibull with k=2 (similar to Rayleigh)
            const c2 = avgSpeed / Math.gamma(1 + 1/2);
            return (2 / c2) * Math.pow(speed / c2, 1) * Math.exp(-Math.pow(speed / c2, 2));
          case 'weibull_k3':
            // Weibull with k=3
            const c3 = avgSpeed / Math.gamma(1 + 1/3);
            return (3 / c3) * Math.pow(speed / c3, 2) * Math.exp(-Math.pow(speed / c3, 3));
          case 'uniform':
            // Uniform distribution around average
            return speed >= avgSpeed * 0.5 && speed <= avgSpeed * 1.5 ? 1 / avgSpeed : 0;
          default:
            return 0;
        }
      }
      
      // Gamma function approximation
      function gamma(z) {
        if (z === 1) return 1;
        if (z === 0.5) return Math.sqrt(Math.PI);
        return Math.sqrt(2 * Math.PI / z) * Math.pow(z / Math.E, z);
      }
      
      // Calculate annual energy production
      let annualEnergyProduction = 0;
      const hoursPerYear = 8760;
      
      // Integrate over wind speed distribution
      for (let speed = 0; speed <= 30; speed += 0.5) {
        const probability = getWindSpeedProbability(speed, adjustedWindSpeed, windSpeedDistribution);
        const power = calculatePower(speed);
        annualEnergyProduction += power * probability * hoursPerYear * availabilityFactor * 0.5; // 0.5 is step size
      }
      
      // Apply turbine efficiency
      annualEnergyProduction *= turbine.efficiency;
      
      // Calculate capacity factor
      const capacityFactor = annualEnergyProduction / (ratedPower * hoursPerYear);
      
      // Economic calculations
      const totalSystemCost = turbineCost + installationCost + gridConnectionCost;
      const selfConsumedEnergy = Math.min(annualEnergyProduction * selfConsumptionRatio, homeEnergyConsumption);
      const excessEnergy = Math.max(0, annualEnergyProduction - selfConsumedEnergy);
      
      const annualSelfConsumptionSavings = selfConsumedEnergy * electricityRate;
      const annualFeedInIncome = excessEnergy * feedInTariff;
      const totalAnnualIncome = annualSelfConsumptionSavings + annualFeedInIncome;
      
      // Lifecycle analysis
      let cumulativeIncome = 0;
      let cumulativeCosts = totalSystemCost;
      const yearlyBreakdown = [];
      
      for (let year = 1; year <= analysisYears; year++) {
        // Performance degradation
        const performanceFactor = Math.pow(1 - performanceDegradation, year - 1);
        const yearlyProduction = annualEnergyProduction * performanceFactor;
        
        // Inflation on energy prices
        const inflatedElectricityRate = electricityRate * Math.pow(1 + inflationRate, year - 1);
        const inflatedFeedInTariff = feedInTariff * Math.pow(1 + inflationRate, year - 1);
        
        const yearlySelfConsumption = Math.min(yearlyProduction * selfConsumptionRatio, homeEnergyConsumption);
        const yearlyExcess = Math.max(0, yearlyProduction - yearlySelfConsumption);
        
        const yearlySavings = yearlySelfConsumption * inflatedElectricityRate;
        const yearlyFeedIncome = yearlyExcess * inflatedFeedInTariff;
        const yearlyTotalIncome = yearlySavings + yearlyFeedIncome;
        
        cumulativeIncome += yearlyTotalIncome / Math.pow(1 + discountRate, year);
        cumulativeCosts += maintenanceCostPerYear / Math.pow(1 + discountRate, year);
        
        yearlyBreakdown.push({
          year: year,
          production: yearlyProduction,
          income: yearlyTotalIncome,
          netCashFlow: cumulativeIncome - cumulativeCosts,
          electricityRate: inflatedElectricityRate,
          feedInTariff: inflatedFeedInTariff
        });
      }
      
      const netPresentValue = cumulativeIncome - cumulativeCosts;
      const roi = (netPresentValue / totalSystemCost) * 100;
      const levelizedCostOfEnergy = totalSystemCost / (annualEnergyProduction * analysisYears);
      
      // Payback period calculation
      let paybackPeriod = 0;
      let cumulativePayback = 0;
      for (let month = 1; month <= analysisYears * 12; month++) {
        const monthlyRate = electricityRate * Math.pow(1 + inflationRate, (month - 1) / 12);
        const monthlyFeedInRate = feedInTariff * Math.pow(1 + inflationRate, (month - 1) / 12);
        const monthlyProduction = annualEnergyProduction / 12 * Math.pow(1 - performanceDegradation, (month - 1) / 12);
        
        const monthlySelfConsumption = Math.min(monthlyProduction * selfConsumptionRatio, homeEnergyConsumption / 12);
        const monthlyExcess = Math.max(0, monthlyProduction - monthlySelfConsumption);
        const monthlyIncome = monthlySelfConsumption * monthlyRate + monthlyExcess * monthlyFeedInRate;
        
        cumulativePayback += monthlyIncome - (maintenanceCostPerYear / 12);
        
        if (cumulativePayback >= totalSystemCost) {
          paybackPeriod = month;
          break;
        }
      }
      
      // Environmental impact
      const co2ReductionKgPerYear = annualEnergyProduction * 0.55; // kg CO2 per kWh for Ukraine
      const totalCo2Reduction = co2ReductionKgPerYear * analysisYears;
      
      // Wind resource assessment
      const windResourceQuality = adjustedWindSpeed >= 7 ? 'Відмінний' : 
                                  adjustedWindSpeed >= 6 ? 'Хороший' : 
                                  adjustedWindSpeed >= 5 ? 'Задовільний' : 'Недостатній';
      
      // Technical viability
      const technicalViability = {
        windResource: windResourceQuality,
        capacityFactor: capacityFactor > 0.25 ? 'Високий' : capacityFactor > 0.15 ? 'Середній' : 'Низький',
        economicViability: roi > 50 ? 'Відмінна' : roi > 0 ? 'Прийнятна' : 'Неприбуткова'
      };

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>⚡ Річне виробництво</h6>
            <div class="big-number">${annualEnergyProduction.toFixed(0)}</div>
            <p class="insight-detail">кВт·год на рік</p>
          </div>
          
          <div class="insight-card ${capacityFactor > 0.2 ? 'success' : 'warning'}">
            <h6>🌪️ Коефіцієнт використання</h6>
            <div class="big-number">${(capacityFactor * 100).toFixed(1)}%</div>
            <p class="insight-detail">Ефективність турбіни</p>
          </div>
          
          <div class="insight-card info">
            <h6>💰 Річний дохід</h6>
            <div class="big-number">${totalAnnualIncome.toFixed(0)}</div>
            <p class="insight-detail">грн на рік</p>
          </div>
          
          <div class="insight-card ${paybackPeriod > 0 && paybackPeriod <= 180 ? 'success' : 'warning'}">
            <h6>⏰ Окупність</h6>
            <div class="big-number">${paybackPeriod > 0 ? (paybackPeriod / 12).toFixed(1) : 'N/A'}</div>
            <p class="insight-detail">років до повернення інвестицій</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🌪️ Аналіз вітрового ресурсу</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border); margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Швидкість на висоті:</strong><br>
                ${adjustedWindSpeed.toFixed(1)} м/с<br>
                <span style="color: #666;">На висоті ${hubHeight} м</span>
              </div>
              <div>
                <strong>Якість ресурсу:</strong><br>
                <span style="color: ${windResourceQuality === 'Відмінний' ? '#28a745' : windResourceQuality === 'Хороший' ? '#ffc107' : '#dc3545'}; font-weight: bold;">
                  ${windResourceQuality}
                </span><br>
                <span style="color: #666;">Вітровий потенціал</span>
              </div>
              <div>
                <strong>Тип турбіни:</strong><br>
                ${turbine.name}<br>
                <span style="color: #666;">Ефективність: ${(turbine.efficiency * 100).toFixed(0)}%</span>
              </div>
              <div>
                <strong>Діаметр ротора:</strong><br>
                ${turbine.diameter.toFixed(1)} м<br>
                <span style="color: #666;">Рівень шуму: ${turbine.noiseLevel} дБ</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>⚡ Аналіз виробництва енергії</h4>
          <div style="background: ${capacityFactor > 0.2 ? 'linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%)' : 'linear-gradient(135deg, #fff3cd 0%, #f5f5dc 100%)'}; padding: 1.5rem; border-radius: 12px; border: 2px solid ${capacityFactor > 0.2 ? '#28a745' : '#ffc107'};">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Покриття споживання:</strong><br>
                ${(annualEnergyProduction / homeEnergyConsumption * 100).toFixed(0)}%<br>
                <span style="color: #666;">Від річних потреб</span>
              </div>
              <div>
                <strong>Самоспоживання:</strong><br>
                ${selfConsumedEnergy.toFixed(0)} кВт·год<br>
                <span style="color: #666;">${(selfConsumptionRatio * 100).toFixed(0)}% виробленої енергії</span>
              </div>
              <div>
                <strong>Продаж надлишків:</strong><br>
                ${excessEnergy.toFixed(0)} кВт·год<br>
                <span style="color: #666;">За зеленим тарифом</span>
              </div>
              <div>
                <strong>Еквівалентні години:</strong><br>
                ${(annualEnergyProduction / ratedPower).toFixed(0)} год/рік<br>
                <span style="color: #666;">Номінальної потужності</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💸 Детальний економічний аналіз</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <strong>Економія на електроенергії:</strong><br>
                ${annualSelfConsumptionSavings.toFixed(0)} грн/рік<br>
                <span style="color: #666;">Самоспоживання</span>
              </div>
              <div>
                <strong>Дохід від продажу:</strong><br>
                ${annualFeedInIncome.toFixed(0)} грн/рік<br>
                <span style="color: #666;">Зелений тариф</span>
              </div>
              <div>
                <strong>Початкові інвестиції:</strong><br>
                ${totalSystemCost.toFixed(0)} грн<br>
                <span style="color: #666;">Система + встановлення</span>
              </div>
              <div>
                <strong>Чистий прибуток (${analysisYears} років):</strong><br>
                <span style="color: ${netPresentValue > 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">
                  ${netPresentValue.toFixed(0)} грн
                </span><br>
                <span style="color: #666;">ROI: ${roi.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🔧 Технічний аналіз системи</h4>
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--accent);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Швидкість запуску:</strong><br>
                ${cutInSpeed} м/с<br>
                <span style="color: #666;">Мінімальна для роботи</span>
              </div>
              <div>
                <strong>Номінальна швидкість:</strong><br>
                ${ratedSpeed} м/с<br>
                <span style="color: #666;">Максимальна потужність</span>
              </div>
              <div>
                <strong>Швидкість відключення:</strong><br>
                ${cutOutSpeed} м/с<br>
                <span style="color: #666;">Захист від штормів</span>
              </div>
              <div>
                <strong>Доступність системи:</strong><br>
                ${(availabilityFactor * 100).toFixed(0)}%<br>
                <span style="color: #666;">Час роботи в році</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🌿 Екологічний вплив</h4>
          <div style="background: linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid #28a745;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>🌍 Зменшення викидів CO₂:</strong><br>
                ${totalCo2Reduction.toFixed(0)} кг за ${analysisYears} років<br>
                <span style="color: #666;">${co2ReductionKgPerYear.toFixed(0)} кг/рік</span>
              </div>
              <div>
                <strong>🌱 Еквівалент дерев:</strong><br>
                ${(totalCo2Reduction / 22).toFixed(0)} дерев<br>
                <span style="color: #666;">Поглинання CO₂</span>
              </div>
              <div>
                <strong>♻️ Чиста енергія:</strong><br>
                ${(annualEnergyProduction * analysisYears / 1000).toFixed(1)} МВт·год<br>
                <span style="color: #666;">За весь термін служби</span>
              </div>
              <div>
                <strong>🔋 Енергетична незалежність:</strong><br>
                ${Math.min(100, (annualEnergyProduction / homeEnergyConsumption * 100)).toFixed(0)}%<br>
                <span style="color: #666;">Покриття потреб</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📈 Прогноз доходів по роках</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Рік</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Виробництво</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Дохід</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Накопичений</div>
              ${yearlyBreakdown.slice(0, 5).map(year => `
                <div style="padding: 0.5rem;">${year.year}</div>
                <div style="padding: 0.5rem;">${year.production.toFixed(0)} кВт·год</div>
                <div style="padding: 0.5rem; color: #28a745;">${year.income.toFixed(0)} грн</div>
                <div style="padding: 0.5rem; font-weight: bold; ${year.netCashFlow > 0 ? 'color: #28a745;' : 'color: #dc3545;'}">${year.netCashFlow.toFixed(0)} грн</div>
              `).join('')}
            </div>
            ${yearlyBreakdown.length > 5 ? `<p style="text-align: center; margin-top: 1rem; color: #666; font-style: italic;">Показані перші 5 років. Загальний чистий прибуток за ${analysisYears} років: ${netPresentValue.toFixed(0)} грн</p>` : ''}
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💡 Рекомендації та висновки</h4>
          <div style="background: #fff3cd; padding: 1.5rem; border-radius: 12px; border: 2px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li><strong>Вітровий ресурс:</strong> ${windResourceQuality} - ${adjustedWindSpeed < 5 ? 'Недостатній для ефективної роботи' : adjustedWindSpeed < 6.5 ? 'Прийнятний для малих турбін' : 'Відмінний для всіх типів турбін'}</li>
              ${roi > 50 ? '<li><strong>Високий ROI:</strong> Відмінна рентабельність інвестицій</li>' : roi > 0 ? '<li><strong>Позитивний ROI:</strong> Система окупається</li>' : '<li><strong>Негативний ROI:</strong> Переглянути параметри системи</li>'}
              ${capacityFactor > 0.25 ? '<li><strong>Високий коефіцієнт використання:</strong> Ефективна робота турбіни</li>' : '<li><strong>Низький коефіцієнт використання:</strong> Розглянути інший тип турбіни</li>'}
              ${paybackPeriod > 0 && paybackPeriod <= 120 ? '<li><strong>Прийнятна окупність:</strong> Термін повернення інвестицій в межах норми</li>' : ''}
              <li><strong>Пріоритет:</strong> ${adjustedWindSpeed > 7 ? 'Високий - відмінні вітрові умови' : adjustedWindSpeed > 5.5 ? 'Середній - хороші умови' : 'Низький - слабкі вітрові умови'}</li>
              <li><strong>Додатково:</strong> ${excessEnergy > 0 ? 'Розгляньте акумуляторну систему для накопичення надлишків' : 'Система оптимально відповідає споживанню'}</li>
              <li><strong>Безпека:</strong> Дотримуйтесь відстані ${Math.max(150, turbine.diameter * 10)} м від житлових будівель</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});