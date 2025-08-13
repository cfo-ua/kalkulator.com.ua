document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('battery-storage-form');
  const result = document.getElementById('battery-storage-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const dailyEnergyConsumption = parseFloat(document.getElementById('dailyEnergyConsumption').value);
      const criticalLoadsConsumption = parseFloat(document.getElementById('criticalLoadsConsumption').value);
      const peakPowerDemand = parseFloat(document.getElementById('peakPowerDemand').value);
      const averagePowerDemand = parseFloat(document.getElementById('averagePowerDemand').value);
      
      const batteryType = document.getElementById('batteryType').value;
      const batteryCapacity = parseFloat(document.getElementById('batteryCapacity').value);
      const inverterPower = parseFloat(document.getElementById('inverterPower').value);
      const systemEfficiency = parseFloat(document.getElementById('systemEfficiency').value) / 100;
      
      const backupDuration = parseFloat(document.getElementById('backupDuration').value);
      const outageFrequency = parseFloat(document.getElementById('outageFrequency').value);
      const averageOutageDuration = parseFloat(document.getElementById('averageOutageDuration').value);
      const cyclesPerWeek = parseFloat(document.getElementById('cyclesPerWeek').value);
      
      const batterySystemCost = parseFloat(document.getElementById('batterySystemCost').value);
      const installationCost = parseFloat(document.getElementById('installationCost').value);
      const electricityRate = parseFloat(document.getElementById('electricityRate').value);
      const peakRate = parseFloat(document.getElementById('peakRate').value);
      
      const analysisYears = parseFloat(document.getElementById('analysisYears').value);
      const annualRateIncrease = parseFloat(document.getElementById('annualRateIncrease').value) / 100;
      const maintenanceCostPerYear = parseFloat(document.getElementById('maintenanceCostPerYear').value);
      const outageCostPerHour = parseFloat(document.getElementById('outageCostPerHour').value);
      
      if (dailyEnergyConsumption <= 0 || batteryCapacity <= 0 || inverterPower <= 0) {
        result.textContent = "Будь ласка, заповніть всі поля дійсними значеннями.";
        return;
      }

      // Battery characteristics
      const batterySpecs = {
        'lifepo4': { 
          name: 'LiFePO4', 
          depth: 0.95, 
          cycles: 6000, 
          efficiency: 0.95, 
          costPerKwh: 400,
          lifespan: 15,
          tempRange: '-20°C до +60°C'
        },
        'li-ion': { 
          name: 'Li-ion', 
          depth: 0.90, 
          cycles: 4000, 
          efficiency: 0.92, 
          costPerKwh: 500,
          lifespan: 12,
          tempRange: '-10°C до +45°C'
        },
        'lead-acid': { 
          name: 'Свинцево-кислотний', 
          depth: 0.50, 
          cycles: 1200, 
          efficiency: 0.85, 
          costPerKwh: 200,
          lifespan: 5,
          tempRange: '0°C до +40°C'
        },
        'salt-water': { 
          name: 'Сольовий', 
          depth: 1.0, 
          cycles: 5000, 
          efficiency: 0.85, 
          costPerKwh: 350,
          lifespan: 10,
          tempRange: '-5°C до +50°C'
        }
      };
      
      const battery = batterySpecs[batteryType];
      const usableCapacity = batteryCapacity * battery.depth;
      const totalSystemCost = batterySystemCost + installationCost;
      
      // Calculate backup capability
      const fullBackupTime = usableCapacity / averagePowerDemand; // hours at average load
      const criticalBackupTime = usableCapacity / (criticalLoadsConsumption / 24); // hours for critical loads
      const canMeetBackupRequirement = usableCapacity >= (averagePowerDemand * backupDuration);
      
      // Power adequacy check
      const canMeetPeakDemand = inverterPower >= peakPowerDemand;
      const powerAdequacy = (inverterPower / peakPowerDemand) * 100;
      
      // Daily cycling analysis
      const dailyCycles = cyclesPerWeek / 7;
      const annualCycles = dailyCycles * 365;
      const batteryLifeYears = Math.min(battery.cycles / annualCycles, battery.lifespan);
      
      // Economic analysis
      const dailyRateArbitrage = (peakRate - electricityRate) * (batteryCapacity * systemEfficiency * battery.efficiency);
      const annualArbitrageSavings = dailyRateArbitrage * dailyCycles * 365;
      
      // Outage cost savings
      const annualOutageHours = outageFrequency * averageOutageDuration;
      const annualOutageCostSavings = annualOutageHours * outageCostPerHour;
      
      // Total annual savings
      const totalAnnualSavings = annualArbitrageSavings + annualOutageCostSavings;
      
      // Lifecycle cost analysis
      let cumulativeSavings = 0;
      let cumulativeCosts = totalSystemCost;
      const yearlyBreakdown = [];
      
      for (let year = 1; year <= analysisYears; year++) {
        const inflatedElectricityRate = electricityRate * Math.pow(1 + annualRateIncrease, year - 1);
        const inflatedPeakRate = peakRate * Math.pow(1 + annualRateIncrease, year - 1);
        
        const yearlyArbitrageSavings = (inflatedPeakRate - inflatedElectricityRate) * 
          (batteryCapacity * systemEfficiency * battery.efficiency) * dailyCycles * 365;
        const yearlyOutageSavings = annualOutageCostSavings * Math.pow(1 + annualRateIncrease, year - 1);
        const yearlyTotalSavings = yearlyArbitrageSavings + yearlyOutageSavings;
        
        cumulativeSavings += yearlyTotalSavings;
        cumulativeCosts += maintenanceCostPerYear;
        
        // Battery replacement cost
        if (year === Math.ceil(batteryLifeYears) && year < analysisYears) {
          cumulativeCosts += batterySystemCost * 0.7; // Assume 70% cost for replacement
        }
        
        yearlyBreakdown.push({
          year: year,
          savings: yearlyTotalSavings,
          netCashFlow: cumulativeSavings - cumulativeCosts,
          electricityRate: inflatedElectricityRate,
          peakRate: inflatedPeakRate
        });
      }
      
      const netPresentValue = cumulativeSavings - cumulativeCosts;
      const roi = (netPresentValue / totalSystemCost) * 100;
      
      // Payback period calculation
      let paybackPeriod = 0;
      let cumulativePayback = 0;
      for (let month = 1; month <= analysisYears * 12; month++) {
        const monthlyRate = electricityRate * Math.pow(1 + annualRateIncrease, (month - 1) / 12);
        const monthlyPeakRate = peakRate * Math.pow(1 + annualRateIncrease, (month - 1) / 12);
        const monthlySavings = ((monthlyPeakRate - monthlyRate) * 
          (batteryCapacity * systemEfficiency * battery.efficiency) * dailyCycles * 30.44) +
          (annualOutageCostSavings / 12);
        
        cumulativePayback += monthlySavings;
        
        if (cumulativePayback >= totalSystemCost) {
          paybackPeriod = month;
          break;
        }
      }

      // Environmental impact
      const annualGridEnergyReduced = (batteryCapacity * systemEfficiency * battery.efficiency) * annualCycles;
      const co2ReductionKgPerYear = annualGridEnergyReduced * 0.55; // kg CO2 per kWh for Ukraine
      const totalCo2Reduction = co2ReductionKgPerYear * analysisYears;
      
      // System adequacy assessment
      const systemAdequacy = {
        capacity: usableCapacity >= (averagePowerDemand * backupDuration) ? 'Достатня' : 'Недостатня',
        power: inverterPower >= peakPowerDemand ? 'Достатня' : 'Недостатня',
        overall: (usableCapacity >= (averagePowerDemand * backupDuration) && 
                 inverterPower >= peakPowerDemand) ? 'Оптимальна' : 'Потребує коригування'
      };

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${canMeetBackupRequirement ? 'success' : 'warning'}">
            <h6>⚡ Час автономії</h6>
            <div class="big-number">${fullBackupTime.toFixed(1)}h</div>
            <p class="insight-detail">При середньому навантаженні</p>
          </div>
          
          <div class="insight-card ${canMeetPeakDemand ? 'success' : 'warning'}">
            <h6>🔌 Потужність системи</h6>
            <div class="big-number">${powerAdequacy.toFixed(0)}%</div>
            <p class="insight-detail">Від пікової потреби</p>
          </div>
          
          <div class="insight-card info">
            <h6>💰 Річна економія</h6>
            <div class="big-number">${totalAnnualSavings.toFixed(0)}</div>
            <p class="insight-detail">грн на рік</p>
          </div>
          
          <div class="insight-card ${paybackPeriod > 0 && paybackPeriod <= 120 ? 'success' : 'warning'}">
            <h6>⏰ Окупність</h6>
            <div class="big-number">${paybackPeriod > 0 ? (paybackPeriod / 12).toFixed(1) : 'N/A'}</div>
            <p class="insight-detail">років до повернення інвестицій</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🔋 Аналіз системи батарей</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border); margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Тип акумулятора:</strong><br>
                ${battery.name}<br>
                <span style="color: #666;">ККД: ${(battery.efficiency * 100).toFixed(0)}%</span>
              </div>
              <div>
                <strong>Корисна ємність:</strong><br>
                ${usableCapacity.toFixed(1)} кВт·год<br>
                <span style="color: #666;">Глибина розряду: ${(battery.depth * 100).toFixed(0)}%</span>
              </div>
              <div>
                <strong>Термін служби:</strong><br>
                ${batteryLifeYears.toFixed(1)} років<br>
                <span style="color: #666;">${battery.cycles.toLocaleString()} циклів</span>
              </div>
              <div>
                <strong>Робочий діапазон:</strong><br>
                ${battery.tempRange}<br>
                <span style="color: #666;">Температурна стійкість</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>⚡ Аналіз резервного живлення</h4>
          <div style="background: ${canMeetBackupRequirement ? 'linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%)' : 'linear-gradient(135deg, #fff3cd 0%, #f5f5dc 100%)'}; padding: 1.5rem; border-radius: 12px; border: 2px solid ${canMeetBackupRequirement ? '#28a745' : '#ffc107'};">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Повне навантаження:</strong><br>
                ${fullBackupTime.toFixed(1)} годин<br>
                <span style="color: #666;">${averagePowerDemand} кВт навантаження</span>
              </div>
              <div>
                <strong>Критичні навантаження:</strong><br>
                ${criticalBackupTime.toFixed(1)} годин<br>
                <span style="color: #666;">${(criticalLoadsConsumption/24).toFixed(1)} кВт навантаження</span>
              </div>
              <div>
                <strong>Відповідність вимогам:</strong><br>
                <span style="color: ${canMeetBackupRequirement ? '#28a745' : '#dc3545'}; font-weight: bold;">
                  ${systemAdequacy.overall}
                </span><br>
                <span style="color: #666;">Потрібно: ${backupDuration} годин</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💸 Детальний економічний аналіз</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <strong>Арбітраж тарифів:</strong><br>
                ${annualArbitrageSavings.toFixed(0)} грн/рік<br>
                <span style="color: #666;">Різниця: ${(peakRate - electricityRate).toFixed(2)} грн/кВт·год</span>
              </div>
              <div>
                <strong>Уникнення збитків:</strong><br>
                ${annualOutageCostSavings.toFixed(0)} грн/рік<br>
                <span style="color: #666;">${annualOutageHours.toFixed(0)} годин відключень</span>
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
          <h4>🔄 Аналіз циклування</h4>
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--accent);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Щоденних циклів:</strong><br>
                ${dailyCycles.toFixed(1)}<br>
                <span style="color: #666;">${cyclesPerWeek} циклів/тиждень</span>
              </div>
              <div>
                <strong>Річних циклів:</strong><br>
                ${annualCycles.toFixed(0)}<br>
                <span style="color: #666;">Інтенсивність використання</span>
              </div>
              <div>
                <strong>Очікуваний термін:</strong><br>
                ${batteryLifeYears.toFixed(1)} років<br>
                <span style="color: #666;">До заміни батарей</span>
              </div>
              <div>
                <strong>Використання ресурсу:</strong><br>
                ${((annualCycles / battery.cycles) * 100).toFixed(1)}% на рік<br>
                <span style="color: #666;">Від загального ресурсу</span>
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
                <strong>⚡ Зменшення споживання мережі:</strong><br>
                ${annualGridEnergyReduced.toFixed(0)} кВт·год/рік<br>
                <span style="color: #666;">Автономна енергія</span>
              </div>
              <div>
                <strong>🌱 Еквівалент дерев:</strong><br>
                ${(totalCo2Reduction / 22).toFixed(0)} дерев<br>
                <span style="color: #666;">Поглинання CO₂</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📈 Прогноз економії по роках</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Рік</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Економія</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Накопичена</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Чистий прибуток</div>
              ${yearlyBreakdown.slice(0, 5).map(year => `
                <div style="padding: 0.5rem;">${year.year}</div>
                <div style="padding: 0.5rem; color: #28a745;">${year.savings.toFixed(0)} грн</div>
                <div style="padding: 0.5rem;">${(year.savings * year.year).toFixed(0)} грн</div>
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
              ${systemAdequacy.overall === 'Оптимальна' ? '<li><strong>Система збалансована:</strong> Ємність та потужність відповідають потребам</li>' : '<li><strong>Потрібне коригування:</strong> Розгляньте збільшення ємності або потужності</li>'}
              ${roi > 50 ? '<li><strong>Високий ROI:</strong> Відмінна рентабельність інвестицій</li>' : roi > 0 ? '<li><strong>Позитивний ROI:</strong> Система окупається</li>' : '<li><strong>Негативний ROI:</strong> Переглянути економічні параметри</li>'}
              ${paybackPeriod > 0 && paybackPeriod <= 60 ? '<li><strong>Швидка окупність:</strong> Прийнятний термін повернення інвестицій</li>' : ''}
              ${batteryLifeYears > 10 ? '<li><strong>Довгий термін служби:</strong> Мінімальні витрати на заміну</li>' : '<li><strong>Коротший термін служби:</strong> Врахуйте витрати на заміну батарей</li>'}
              <li><strong>Пріоритет:</strong> ${outageFrequency > 6 ? 'Високий - часті відключення' : outageFrequency > 2 ? 'Середній - помірні відключення' : 'Низький - рідкі відключення'}</li>
              <li><strong>Додатково:</strong> Розгляньте інтеграцію з сонячними панелями для максимальної ефективності</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});