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
        result.textContent = "Please fill all fields with valid values.";
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
      const co2ReductionKgPerYear = annualEnergySavingsKwh * 0.4; // kg CO2 per kWh for US average
      const totalCo2Reduction = co2ReductionKgPerYear * analysisYears;
      const equivalentTrees = totalCo2Reduction / 22; // kg CO2 absorbed per tree per year
      
      // Energy efficiency improvement
      const efficiencyImprovement = ((currentWattage - ledWattage) / currentWattage) * 100;
      
      // Lamp type characteristics
      const lampTypes = {
        'incandescent': { name: 'Incandescent bulbs', efficiency: 10, heat: 'high' },
        'halogen': { name: 'Halogen lamps', efficiency: 15, heat: 'high' },
        'cfl': { name: 'CFL bulbs', efficiency: 60, heat: 'medium' },
        'fluorescent_t8': { name: 'Fluorescent T8', efficiency: 65, heat: 'low' },
        'fluorescent_t5': { name: 'Fluorescent T5', efficiency: 70, heat: 'low' },
        'metal_halide': { name: 'Metal halide', efficiency: 75, heat: 'high' }
      };
      
      const currentLampInfo = lampTypes[currentLampType];

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>💰 Annual Savings</h6>
            <div class="big-number">$${annualEnergySavings.toFixed(0)}</div>
            <p class="insight-detail">Electricity cost savings</p>
          </div>
          
          <div class="insight-card info">
            <h6>⚡ Energy Reduction</h6>
            <div class="big-number">${efficiencyImprovement.toFixed(0)}%</div>
            <p class="insight-detail">Energy efficiency improvement</p>
          </div>
          
          <div class="insight-card warning">
            <h6>⏰ Payback Period</h6>
            <div class="big-number">${paybackPeriod > 0 ? (paybackPeriod / 12).toFixed(1) : 'N/A'}</div>
            <p class="insight-detail">Years to return investment</p>
          </div>
          
          <div class="insight-card success">
            <h6>🌱 Environment</h6>
            <div class="big-number">${co2ReductionKgPerYear.toFixed(0)}</div>
            <p class="insight-detail">kg CO₂ savings per year</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📊 Detailed Savings Analysis</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border); margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <strong>Current consumption:</strong><br>
                ${currentAnnualEnergyKwh.toFixed(0)} kWh/year<br>
                <span style="color: #666;">${currentLampInfo.name}</span>
              </div>
              <div>
                <strong>LED consumption:</strong><br>
                ${ledAnnualEnergyKwh.toFixed(0)} kWh/year<br>
                <span style="color: #666;">Saves ${annualEnergySavingsKwh.toFixed(0)} kWh</span>
              </div>
              <div>
                <strong>Initial investment:</strong><br>
                $${initialInvestment.toFixed(0)}<br>
                <span style="color: #666;">${numberOfLamps} × $${ledCostPerLamp}</span>
              </div>
              <div>
                <strong>Net profit (${analysisYears} years):</strong><br>
                <span style="color: #28a745; font-weight: bold;">$${netSavings.toFixed(0)}</span><br>
                <span style="color: #666;">ROI: ${roi.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🔧 Maintenance Analysis</h4>
          <div style="background: linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid #28a745;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Current bulbs:</strong><br>
                Replacements: ${currentReplacementsNeeded} times<br>
                Cost: $${currentLampCostTotal.toFixed(0)}
              </div>
              <div>
                <strong>LED bulbs:</strong><br>
                Replacements: ${ledReplacementsNeeded} times<br>
                Cost: $${ledLampCostTotal.toFixed(0)}
              </div>
              <div>
                <strong>Maintenance savings:</strong><br>
                <span style="color: #28a745; font-weight: bold;">$${maintenanceSavings.toFixed(0)}</span><br>
                Over ${analysisYears} years
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🌿 Environmental Impact</h4>
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--accent);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>🌍 CO₂ emissions reduction:</strong><br>
                ${totalCo2Reduction.toFixed(0)} kg over ${analysisYears} years<br>
                <span style="color: #666;">≈ ${equivalentTrees.toFixed(0)} trees</span>
              </div>
              <div>
                <strong>♻️ Waste reduction:</strong><br>
                ${(currentReplacementsNeeded - ledReplacementsNeeded) * numberOfLamps} fewer bulbs<br>
                <span style="color: #666;">Less landfill waste</span>
              </div>
              <div>
                <strong>🔥 Heat reduction:</strong><br>
                ${currentLampInfo.heat} → low<br>
                <span style="color: #666;">Less AC load</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📈 Yearly Savings Forecast</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Year</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Rate</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Savings</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Cumulative</div>
              ${yearlyBreakdown.slice(0, 5).map(year => `
                <div style="padding: 0.5rem;">${year.year}</div>
                <div style="padding: 0.5rem;">$${year.electricityRate.toFixed(3)}/kWh</div>
                <div style="padding: 0.5rem; color: #28a745;">$${year.energySavings.toFixed(0)}</div>
                <div style="padding: 0.5rem; font-weight: bold; ${year.cumulativeSavings > 0 ? 'color: #28a745;' : 'color: #dc3545;'}">$${year.cumulativeSavings.toFixed(0)}</div>
              `).join('')}
            </div>
            ${yearlyBreakdown.length > 5 ? `<p style="text-align: center; margin-top: 1rem; color: #666; font-style: italic;">Showing first 5 years. Total savings over ${analysisYears} years: $${netSavings.toFixed(0)}</p>` : ''}
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💡 Recommendations</h4>
          <div style="background: #fff3cd; padding: 1.5rem; border-radius: 12px; border: 2px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.2rem;">
              ${paybackPeriod > 0 && paybackPeriod <= 24 ? '<li><strong>Quick payback:</strong> Upgrade is economically viable</li>' : ''}
              ${roi > 100 ? '<li><strong>High ROI:</strong> Excellent return on investment</li>' : ''}
              ${efficiencyImprovement > 70 ? '<li><strong>Major savings:</strong> Maximum benefit from upgrade</li>' : ''}
              <li><strong>Priority:</strong> ${dailyUsageHours > 8 ? 'High - many operating hours' : dailyUsageHours > 4 ? 'Medium - moderate usage' : 'Low - few operating hours'}</li>
              <li><strong>Additional:</strong> Consider dimmable LEDs for extra savings</li>
              <li><strong>Maintenance:</strong> LEDs require significantly less maintenance</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});