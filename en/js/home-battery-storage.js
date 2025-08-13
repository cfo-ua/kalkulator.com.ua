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
        result.textContent = "Please fill all fields with valid values.";
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
          tempRange: '-4°F to 140°F'
        },
        'li-ion': { 
          name: 'Li-ion', 
          depth: 0.90, 
          cycles: 4000, 
          efficiency: 0.92, 
          costPerKwh: 500,
          lifespan: 12,
          tempRange: '14°F to 113°F'
        },
        'lead-acid': { 
          name: 'Lead-acid', 
          depth: 0.50, 
          cycles: 1200, 
          efficiency: 0.85, 
          costPerKwh: 200,
          lifespan: 5,
          tempRange: '32°F to 104°F'
        },
        'salt-water': { 
          name: 'Salt-water', 
          depth: 1.0, 
          cycles: 5000, 
          efficiency: 0.85, 
          costPerKwh: 350,
          lifespan: 10,
          tempRange: '23°F to 122°F'
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
      const co2ReductionKgPerYear = annualGridEnergyReduced * 0.4; // kg CO2 per kWh for US average
      const totalCo2Reduction = co2ReductionKgPerYear * analysisYears;
      
      // System adequacy assessment
      const systemAdequacy = {
        capacity: usableCapacity >= (averagePowerDemand * backupDuration) ? 'Adequate' : 'Insufficient',
        power: inverterPower >= peakPowerDemand ? 'Adequate' : 'Insufficient',
        overall: (usableCapacity >= (averagePowerDemand * backupDuration) && 
                 inverterPower >= peakPowerDemand) ? 'Optimal' : 'Needs adjustment'
      };

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${canMeetBackupRequirement ? 'success' : 'warning'}">
            <h6>⚡ Backup Time</h6>
            <div class="big-number">${fullBackupTime.toFixed(1)}h</div>
            <p class="insight-detail">At average load</p>
          </div>
          
          <div class="insight-card ${canMeetPeakDemand ? 'success' : 'warning'}">
            <h6>🔌 System Power</h6>
            <div class="big-number">${powerAdequacy.toFixed(0)}%</div>
            <p class="insight-detail">Of peak demand</p>
          </div>
          
          <div class="insight-card info">
            <h6>💰 Annual Savings</h6>
            <div class="big-number">$${totalAnnualSavings.toFixed(0)}</div>
            <p class="insight-detail">Per year</p>
          </div>
          
          <div class="insight-card ${paybackPeriod > 0 && paybackPeriod <= 120 ? 'success' : 'warning'}">
            <h6>⏰ Payback</h6>
            <div class="big-number">${paybackPeriod > 0 ? (paybackPeriod / 12).toFixed(1) : 'N/A'}</div>
            <p class="insight-detail">Years to return investment</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🔋 Battery System Analysis</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border); margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Battery type:</strong><br>
                ${battery.name}<br>
                <span style="color: #666;">Efficiency: ${(battery.efficiency * 100).toFixed(0)}%</span>
              </div>
              <div>
                <strong>Usable capacity:</strong><br>
                ${usableCapacity.toFixed(1)} kWh<br>
                <span style="color: #666;">DoD: ${(battery.depth * 100).toFixed(0)}%</span>
              </div>
              <div>
                <strong>Expected lifespan:</strong><br>
                ${batteryLifeYears.toFixed(1)} years<br>
                <span style="color: #666;">${battery.cycles.toLocaleString()} cycles</span>
              </div>
              <div>
                <strong>Operating range:</strong><br>
                ${battery.tempRange}<br>
                <span style="color: #666;">Temperature tolerance</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>⚡ Backup Power Analysis</h4>
          <div style="background: ${canMeetBackupRequirement ? 'linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%)' : 'linear-gradient(135deg, #fff3cd 0%, #f5f5dc 100%)'}; padding: 1.5rem; border-radius: 12px; border: 2px solid ${canMeetBackupRequirement ? '#28a745' : '#ffc107'};">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Full load backup:</strong><br>
                ${fullBackupTime.toFixed(1)} hours<br>
                <span style="color: #666;">${averagePowerDemand} kW load</span>
              </div>
              <div>
                <strong>Critical loads backup:</strong><br>
                ${criticalBackupTime.toFixed(1)} hours<br>
                <span style="color: #666;">${(criticalLoadsConsumption/24).toFixed(1)} kW load</span>
              </div>
              <div>
                <strong>Requirement compliance:</strong><br>
                <span style="color: ${canMeetBackupRequirement ? '#28a745' : '#dc3545'}; font-weight: bold;">
                  ${systemAdequacy.overall}
                </span><br>
                <span style="color: #666;">Need: ${backupDuration} hours</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💸 Detailed Economic Analysis</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <strong>Rate arbitrage:</strong><br>
                $${annualArbitrageSavings.toFixed(0)}/year<br>
                <span style="color: #666;">Difference: $${(peakRate - electricityRate).toFixed(3)}/kWh</span>
              </div>
              <div>
                <strong>Outage cost avoidance:</strong><br>
                $${annualOutageCostSavings.toFixed(0)}/year<br>
                <span style="color: #666;">${annualOutageHours.toFixed(0)} hours of outages</span>
              </div>
              <div>
                <strong>Initial investment:</strong><br>
                $${totalSystemCost.toFixed(0)}<br>
                <span style="color: #666;">System + installation</span>
              </div>
              <div>
                <strong>Net profit (${analysisYears} years):</strong><br>
                <span style="color: ${netPresentValue > 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">
                  $${netPresentValue.toFixed(0)}
                </span><br>
                <span style="color: #666;">ROI: ${roi.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🔄 Cycling Analysis</h4>
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--accent);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Daily cycles:</strong><br>
                ${dailyCycles.toFixed(1)}<br>
                <span style="color: #666;">${cyclesPerWeek} cycles/week</span>
              </div>
              <div>
                <strong>Annual cycles:</strong><br>
                ${annualCycles.toFixed(0)}<br>
                <span style="color: #666;">Usage intensity</span>
              </div>
              <div>
                <strong>Expected lifespan:</strong><br>
                ${batteryLifeYears.toFixed(1)} years<br>
                <span style="color: #666;">Until replacement</span>
              </div>
              <div>
                <strong>Cycle utilization:</strong><br>
                ${((annualCycles / battery.cycles) * 100).toFixed(1)}% per year<br>
                <span style="color: #666;">Of total capacity</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🌿 Environmental Impact</h4>
          <div style="background: linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid #28a745;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>🌍 CO₂ emissions reduction:</strong><br>
                ${totalCo2Reduction.toFixed(0)} kg over ${analysisYears} years<br>
                <span style="color: #666;">${co2ReductionKgPerYear.toFixed(0)} kg/year</span>
              </div>
              <div>
                <strong>⚡ Grid consumption reduction:</strong><br>
                ${annualGridEnergyReduced.toFixed(0)} kWh/year<br>
                <span style="color: #666;">Autonomous energy</span>
              </div>
              <div>
                <strong>🌱 Tree equivalent:</strong><br>
                ${(totalCo2Reduction / 22).toFixed(0)} trees<br>
                <span style="color: #666;">CO₂ absorption</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📈 Yearly Savings Forecast</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Year</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Savings</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Cumulative</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Net profit</div>
              ${yearlyBreakdown.slice(0, 5).map(year => `
                <div style="padding: 0.5rem;">${year.year}</div>
                <div style="padding: 0.5rem; color: #28a745;">$${year.savings.toFixed(0)}</div>
                <div style="padding: 0.5rem;">$${(year.savings * year.year).toFixed(0)}</div>
                <div style="padding: 0.5rem; font-weight: bold; ${year.netCashFlow > 0 ? 'color: #28a745;' : 'color: #dc3545;'}">$${year.netCashFlow.toFixed(0)}</div>
              `).join('')}
            </div>
            ${yearlyBreakdown.length > 5 ? `<p style="text-align: center; margin-top: 1rem; color: #666; font-style: italic;">Showing first 5 years. Total net profit over ${analysisYears} years: $${netPresentValue.toFixed(0)}</p>` : ''}
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💡 Recommendations and Conclusions</h4>
          <div style="background: #fff3cd; padding: 1.5rem; border-radius: 12px; border: 2px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.2rem;">
              ${systemAdequacy.overall === 'Optimal' ? '<li><strong>System balanced:</strong> Capacity and power meet requirements</li>' : '<li><strong>Needs adjustment:</strong> Consider increasing capacity or power</li>'}
              ${roi > 50 ? '<li><strong>High ROI:</strong> Excellent return on investment</li>' : roi > 0 ? '<li><strong>Positive ROI:</strong> System pays for itself</li>' : '<li><strong>Negative ROI:</strong> Review economic parameters</li>'}
              ${paybackPeriod > 0 && paybackPeriod <= 60 ? '<li><strong>Quick payback:</strong> Acceptable return time</li>' : ''}
              ${batteryLifeYears > 10 ? '<li><strong>Long lifespan:</strong> Minimal replacement costs</li>' : '<li><strong>Shorter lifespan:</strong> Factor in replacement costs</li>'}
              <li><strong>Priority:</strong> ${outageFrequency > 6 ? 'High - frequent outages' : outageFrequency > 2 ? 'Medium - moderate outages' : 'Low - rare outages'}</li>
              <li><strong>Additional:</strong> Consider solar panel integration for maximum efficiency</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});