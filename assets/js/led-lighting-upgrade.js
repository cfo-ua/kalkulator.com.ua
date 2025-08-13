document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('led-upgrade-form');
  const result = document.getElementById('led-upgrade-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const currentLampType = document.getElementById('currentLampType').value;
      const currentWattage = parseFloat(document.getElementById('currentWattage').value);
      const numberOfLamps = parseFloat(document.getElementById('numberOfLamps').value);
      const currentLifespan = parseFloat(document.getElementById('currentLifespan').value);
      
      const ledWattage = parseFloat(document.getElementById('ledWattage').value);
      const ledLifespan = parseFloat(document.getElementById('ledLifespan').value);
      const ledCostPerLamp = parseFloat(document.getElementById('ledCostPerLamp').value);
      const currentLampCost = parseFloat(document.getElementById('currentLampCost').value);
      
      const dailyUsageHours = parseFloat(document.getElementById('dailyUsageHours').value);
      const daysPerYear = parseFloat(document.getElementById('daysPerYear').value);
      const electricityRate = parseFloat(document.getElementById('electricityRate').value);
      const replacementLaborCost = parseFloat(document.getElementById('replacementLaborCost').value);
      
      const analysisYears = parseFloat(document.getElementById('analysisYears').value);
      const discountRate = parseFloat(document.getElementById('discountRate').value) / 100;
      const annualTariffIncrease = parseFloat(document.getElementById('annualTariffIncrease').value) / 100;
      
      if (currentWattage <= 0 || numberOfLamps <= 0 || ledWattage <= 0) {
        result.textContent = "Будь ласка, заповніть всі поля дійсними значеннями.";
        return;
      }

      // Calculate annual energy consumption and costs
      const annualHours = dailyUsageHours * daysPerYear;
      
      const currentAnnualEnergyKwh = (currentWattage * numberOfLamps * annualHours) / 1000;
      const ledAnnualEnergyKwh = (ledWattage * numberOfLamps * annualHours) / 1000;
      const annualEnergySavingsKwh = currentAnnualEnergyKwh - ledAnnualEnergyKwh;
      
      const currentAnnualEnergyCost = currentAnnualEnergyKwh * electricityRate;
      const ledAnnualEnergyCost = ledAnnualEnergyKwh * electricityRate;
      const annualEnergySavings = currentAnnualEnergyCost - ledAnnualEnergyCost;
      
      // Calculate replacement frequency and costs over analysis period
      const currentReplacementsNeeded = Math.ceil((annualHours * analysisYears) / currentLifespan);
      const ledReplacementsNeeded = Math.ceil((annualHours * analysisYears) / ledLifespan);
      
      const currentLampCostTotal = currentReplacementsNeeded * numberOfLamps * (currentLampCost + replacementLaborCost);
      const ledLampCostTotal = ledReplacementsNeeded * numberOfLamps * (ledCostPerLamp + replacementLaborCost);
      const maintenanceSavings = currentLampCostTotal - ledLampCostTotal;
      
      // Calculate initial investment
      const initialInvestment = numberOfLamps * ledCostPerLamp;
      
      // Calculate cumulative savings over analysis period with inflation
      let cumulativeEnergySavings = 0;
      let cumulativeMaintenanceSavings = maintenanceSavings;
      const yearlyBreakdown = [];
      
      for (let year = 1; year <= analysisYears; year++) {
        const inflatedRate = electricityRate * Math.pow(1 + annualTariffIncrease, year - 1);
        const yearlyEnergySavings = annualEnergySavingsKwh * inflatedRate;
        cumulativeEnergySavings += yearlyEnergySavings / Math.pow(1 + discountRate, year);
        
        yearlyBreakdown.push({
          year: year,
          energySavings: yearlyEnergySavings,
          cumulativeSavings: cumulativeEnergySavings + cumulativeMaintenanceSavings - initialInvestment,
          electricityRate: inflatedRate
        });
      }
      
      const totalSavings = cumulativeEnergySavings + cumulativeMaintenanceSavings;
      const netSavings = totalSavings - initialInvestment;
      const roi = (netSavings / initialInvestment) * 100;
      
      // Calculate payback period
      let paybackPeriod = 0;
      let cumulativePayback = 0;
      for (let month = 1; month <= analysisYears * 12; month++) {
        const monthlyRate = electricityRate * Math.pow(1 + annualTariffIncrease, (month - 1) / 12);
        const monthlySavings = (annualEnergySavingsKwh / 12) * monthlyRate;
        cumulativePayback += monthlySavings;
        
        if (cumulativePayback >= initialInvestment) {
          paybackPeriod = month;
          break;
        }
      }
      
      // Environmental impact
      const co2ReductionKgPerYear = annualEnergySavingsKwh * 0.55; // kg CO2 per kWh for Ukraine
      const totalCo2Reduction = co2ReductionKgPerYear * analysisYears;
      const equivalentTrees = totalCo2Reduction / 22; // kg CO2 absorbed per tree per year
      
      // Energy efficiency improvement
      const efficiencyImprovement = ((currentWattage - ledWattage) / currentWattage) * 100;
      
      // Lamp type characteristics
      const lampTypes = {
        'incandescent': { name: 'Лампи розжарювання', efficiency: 10, heat: 'високе' },
        'halogen': { name: 'Галогенні лампи', efficiency: 15, heat: 'високе' },
        'cfl': { name: 'CFL лампи', efficiency: 60, heat: 'середнє' },
        'fluorescent_t8': { name: 'Люмінесцентні T8', efficiency: 65, heat: 'низьке' },
        'fluorescent_t5': { name: 'Люмінесцентні T5', efficiency: 70, heat: 'низьке' },
        'metal_halide': { name: 'Металогалогенні', efficiency: 75, heat: 'високе' }
      };
      
      const currentLampInfo = lampTypes[currentLampType];

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>💰 Річні заощадження</h6>
            <div class="big-number">${annualEnergySavings.toFixed(0)} грн</div>
            <p class="insight-detail">Економія на електроенергії</p>
          </div>
          
          <div class="insight-card info">
            <h6>⚡ Зменшення споживання</h6>
            <div class="big-number">${efficiencyImprovement.toFixed(0)}%</div>
            <p class="insight-detail">Ефективність використання енергії</p>
          </div>
          
          <div class="insight-card warning">
            <h6>⏰ Термін окупності</h6>
            <div class="big-number">${paybackPeriod > 0 ? (paybackPeriod / 12).toFixed(1) : 'N/A'}</div>
            <p class="insight-detail">Років до повернення інвестицій</p>
          </div>
          
          <div class="insight-card success">
            <h6>🌱 Екологія</h6>
            <div class="big-number">${co2ReductionKgPerYear.toFixed(0)}</div>
            <p class="insight-detail">кг CO₂ економії на рік</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📊 Детальний аналіз економії</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border); margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <strong>Поточне споживання:</strong><br>
                ${currentAnnualEnergyKwh.toFixed(0)} кВт·год/рік<br>
                <span style="color: #666;">${currentLampInfo.name}</span>
              </div>
              <div>
                <strong>LED споживання:</strong><br>
                ${ledAnnualEnergyKwh.toFixed(0)} кВт·год/рік<br>
                <span style="color: #666;">Економія ${annualEnergySavingsKwh.toFixed(0)} кВт·год</span>
              </div>
              <div>
                <strong>Початкові інвестиції:</strong><br>
                ${initialInvestment.toFixed(0)} грн<br>
                <span style="color: #666;">${numberOfLamps} × ${ledCostPerLamp} грн</span>
              </div>
              <div>
                <strong>Чистий прибуток (${analysisYears} років):</strong><br>
                <span style="color: #28a745; font-weight: bold;">${netSavings.toFixed(0)} грн</span><br>
                <span style="color: #666;">ROI: ${roi.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🔧 Аналіз обслуговування</h4>
          <div style="background: linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid #28a745;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Поточні лампи:</strong><br>
                Замін: ${currentReplacementsNeeded} разів<br>
                Вартість: ${currentLampCostTotal.toFixed(0)} грн
              </div>
              <div>
                <strong>LED лампи:</strong><br>
                Замін: ${ledReplacementsNeeded} разів<br>
                Вартість: ${ledLampCostTotal.toFixed(0)} грн
              </div>
              <div>
                <strong>Економія на обслуговуванні:</strong><br>
                <span style="color: #28a745; font-weight: bold;">${maintenanceSavings.toFixed(0)} грн</span><br>
                За ${analysisYears} років
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🌿 Екологічний вплив</h4>
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--accent);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>🌍 Зменшення викидів CO₂:</strong><br>
                ${totalCo2Reduction.toFixed(0)} кг за ${analysisYears} років<br>
                <span style="color: #666;">≈ ${equivalentTrees.toFixed(0)} дерев</span>
              </div>
              <div>
                <strong>♻️ Зменшення відходів:</strong><br>
                ${(currentReplacementsNeeded - ledReplacementsNeeded) * numberOfLamps} ламп<br>
                <span style="color: #666;">Менше на сміттєзвалищі</span>
              </div>
              <div>
                <strong>🔥 Зменшення тепла:</strong><br>
                ${currentLampInfo.heat} → низьке<br>
                <span style="color: #666;">Менше навантаження на кондиціонер</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📈 Прогноз заощаджень по роках</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Рік</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Тариф</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Економія</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Накопичена</div>
              ${yearlyBreakdown.slice(0, 5).map(year => `
                <div style="padding: 0.5rem;">${year.year}</div>
                <div style="padding: 0.5rem;">${year.electricityRate.toFixed(2)} грн</div>
                <div style="padding: 0.5rem; color: #28a745;">${year.energySavings.toFixed(0)} грн</div>
                <div style="padding: 0.5rem; font-weight: bold; ${year.cumulativeSavings > 0 ? 'color: #28a745;' : 'color: #dc3545;'}">${year.cumulativeSavings.toFixed(0)} грн</div>
              `).join('')}
            </div>
            ${yearlyBreakdown.length > 5 ? `<p style="text-align: center; margin-top: 1rem; color: #666; font-style: italic;">Показані перші 5 років. Загальна економія за ${analysisYears} років: ${netSavings.toFixed(0)} грн</p>` : ''}
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💡 Рекомендації</h4>
          <div style="background: #fff3cd; padding: 1.5rem; border-radius: 12px; border: 2px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.2rem;">
              ${paybackPeriod > 0 && paybackPeriod <= 24 ? '<li><strong>Швидка окупність:</strong> Модернізація економічно вигідна</li>' : ''}
              ${roi > 100 ? '<li><strong>Високий ROI:</strong> Відмінна рентабельність інвестицій</li>' : ''}
              ${efficiencyImprovement > 70 ? '<li><strong>Значна економія:</strong> Максимальний ефект від модернізації</li>' : ''}
              <li><strong>Пріоритетність:</strong> ${dailyUsageHours > 8 ? 'Висока - багато годин роботи' : dailyUsageHours > 4 ? 'Середня - помірне використання' : 'Низька - мало годин роботи'}</li>
              <li><strong>Додатково:</strong> Розгляньте диммовані LED для додаткової економії</li>
              <li><strong>Обслуговування:</strong> LED потребують значно менше обслуговування</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});