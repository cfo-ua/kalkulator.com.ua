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
        result.textContent = "Please fill all fields with valid values.";
        return;
      }

      // Wind speed adjustment for height using power law
      const referenceHeight = 10; // meters
      const powerLawExponent = Math.pow(terrainRoughness, 0.2);
      const adjustedWindSpeed = averageWindSpeed * Math.pow(hubHeight / referenceHeight, powerLawExponent);
      
      // Turbine specifications database
      const turbineSpecs = {
        'horizontal_3kw': { 
          name: 'Horizontal 3 kW', 
          efficiency: 0.35, 
          diameter: 3.5,
          noiseLevel: 42 
        },
        'horizontal_5kw': { 
          name: 'Horizontal 5 kW', 
          efficiency: 0.38, 
          diameter: 5.2,
          noiseLevel: 44 
        },
        'horizontal_10kw': { 
          name: 'Horizontal 10 kW', 
          efficiency: 0.40, 
          diameter: 7.5,
          noiseLevel: 46 
        },
        'vertical_2kw': { 
          name: 'Vertical 2 kW', 
          efficiency: 0.25, 
          diameter: 3.0,
          noiseLevel: 38 
        },
        'vertical_5kw': { 
          name: 'Vertical 5 kW', 
          efficiency: 0.28, 
          diameter: 4.5,
          noiseLevel: 40 
        },
        'custom': { 
          name: 'Custom', 
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
      const co2ReductionKgPerYear = annualEnergyProduction * 0.4; // kg CO2 per kWh for US average
      const totalCo2Reduction = co2ReductionKgPerYear * analysisYears;
      
      // Wind resource assessment
      const windResourceQuality = adjustedWindSpeed >= 7 ? 'Excellent' : 
                                  adjustedWindSpeed >= 6 ? 'Good' : 
                                  adjustedWindSpeed >= 5 ? 'Fair' : 'Poor';
      
      // Technical viability
      const technicalViability = {
        windResource: windResourceQuality,
        capacityFactor: capacityFactor > 0.25 ? 'High' : capacityFactor > 0.15 ? 'Medium' : 'Low',
        economicViability: roi > 50 ? 'Excellent' : roi > 0 ? 'Acceptable' : 'Unprofitable'
      };

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>⚡ Annual Production</h6>
            <div class="big-number">${annualEnergyProduction.toFixed(0)}</div>
            <p class="insight-detail">kWh per year</p>
          </div>
          
          <div class="insight-card ${capacityFactor > 0.2 ? 'success' : 'warning'}">
            <h6>🌪️ Capacity Factor</h6>
            <div class="big-number">${(capacityFactor * 100).toFixed(1)}%</div>
            <p class="insight-detail">Turbine efficiency</p>
          </div>
          
          <div class="insight-card info">
            <h6>💰 Annual Income</h6>
            <div class="big-number">$${totalAnnualIncome.toFixed(0)}</div>
            <p class="insight-detail">Per year</p>
          </div>
          
          <div class="insight-card ${paybackPeriod > 0 && paybackPeriod <= 180 ? 'success' : 'warning'}">
            <h6>⏰ Payback</h6>
            <div class="big-number">${paybackPeriod > 0 ? (paybackPeriod / 12).toFixed(1) : 'N/A'}</div>
            <p class="insight-detail">Years to return investment</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>🌪️ Wind Resource Analysis</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border); margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Speed at height:</strong><br>
                ${adjustedWindSpeed.toFixed(1)} m/s<br>
                <span style="color: #666;">At ${hubHeight} m height</span>
              </div>
              <div>
                <strong>Resource quality:</strong><br>
                <span style="color: ${windResourceQuality === 'Excellent' ? '#28a745' : windResourceQuality === 'Good' ? '#ffc107' : '#dc3545'}; font-weight: bold;">
                  ${windResourceQuality}
                </span><br>
                <span style="color: #666;">Wind potential</span>
              </div>
              <div>
                <strong>Turbine type:</strong><br>
                ${turbine.name}<br>
                <span style="color: #666;">Efficiency: ${(turbine.efficiency * 100).toFixed(0)}%</span>
              </div>
              <div>
                <strong>Rotor diameter:</strong><br>
                ${turbine.diameter.toFixed(1)} m<br>
                <span style="color: #666;">Noise level: ${turbine.noiseLevel} dB</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>⚡ Energy Production Analysis</h4>
          <div style="background: ${capacityFactor > 0.2 ? 'linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%)' : 'linear-gradient(135deg, #fff3cd 0%, #f5f5dc 100%)'}; padding: 1.5rem; border-radius: 12px; border: 2px solid ${capacityFactor > 0.2 ? '#28a745' : '#ffc107'};">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Consumption coverage:</strong><br>
                ${(annualEnergyProduction / homeEnergyConsumption * 100).toFixed(0)}%<br>
                <span style="color: #666;">Of annual needs</span>
              </div>
              <div>
                <strong>Self-consumption:</strong><br>
                ${selfConsumedEnergy.toFixed(0)} kWh<br>
                <span style="color: #666;">${(selfConsumptionRatio * 100).toFixed(0)}% of production</span>
              </div>
              <div>
                <strong>Excess sales:</strong><br>
                ${excessEnergy.toFixed(0)} kWh<br>
                <span style="color: #666;">Feed-in tariff</span>
              </div>
              <div>
                <strong>Equivalent hours:</strong><br>
                ${(annualEnergyProduction / ratedPower).toFixed(0)} hrs/year<br>
                <span style="color: #666;">At rated power</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>💸 Detailed Economic Analysis</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <strong>Electricity savings:</strong><br>
                $${annualSelfConsumptionSavings.toFixed(0)}/year<br>
                <span style="color: #666;">Self-consumption</span>
              </div>
              <div>
                <strong>Sales income:</strong><br>
                $${annualFeedInIncome.toFixed(0)}/year<br>
                <span style="color: #666;">Feed-in tariff</span>
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
          <h4>🔧 Technical System Analysis</h4>
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--accent);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <strong>Cut-in speed:</strong><br>
                ${cutInSpeed} m/s<br>
                <span style="color: #666;">Minimum for operation</span>
              </div>
              <div>
                <strong>Rated speed:</strong><br>
                ${ratedSpeed} m/s<br>
                <span style="color: #666;">Maximum power</span>
              </div>
              <div>
                <strong>Cut-out speed:</strong><br>
                ${cutOutSpeed} m/s<br>
                <span style="color: #666;">Storm protection</span>
              </div>
              <div>
                <strong>System availability:</strong><br>
                ${(availabilityFactor * 100).toFixed(0)}%<br>
                <span style="color: #666;">Operating time per year</span>
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
                <strong>🌱 Tree equivalent:</strong><br>
                ${(totalCo2Reduction / 22).toFixed(0)} trees<br>
                <span style="color: #666;">CO₂ absorption</span>
              </div>
              <div>
                <strong>♻️ Clean energy:</strong><br>
                ${(annualEnergyProduction * analysisYears / 1000).toFixed(1)} MWh<br>
                <span style="color: #666;">Over entire lifespan</span>
              </div>
              <div>
                <strong>🔋 Energy independence:</strong><br>
                ${Math.min(100, (annualEnergyProduction / homeEnergyConsumption * 100)).toFixed(0)}%<br>
                <span style="color: #666;">Needs coverage</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4>📈 Yearly Income Forecast</h4>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Year</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Production</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Income</div>
              <div style="font-weight: bold; padding: 0.5rem; background: var(--card-bg);">Cumulative</div>
              ${yearlyBreakdown.slice(0, 5).map(year => `
                <div style="padding: 0.5rem;">${year.year}</div>
                <div style="padding: 0.5rem;">${year.production.toFixed(0)} kWh</div>
                <div style="padding: 0.5rem; color: #28a745;">$${year.income.toFixed(0)}</div>
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
              <li><strong>Wind resource:</strong> ${windResourceQuality} - ${adjustedWindSpeed < 5 ? 'Insufficient for efficient operation' : adjustedWindSpeed < 6.5 ? 'Acceptable for small turbines' : 'Excellent for all turbine types'}</li>
              ${roi > 50 ? '<li><strong>High ROI:</strong> Excellent return on investment</li>' : roi > 0 ? '<li><strong>Positive ROI:</strong> System pays for itself</li>' : '<li><strong>Negative ROI:</strong> Review system parameters</li>'}
              ${capacityFactor > 0.25 ? '<li><strong>High capacity factor:</strong> Efficient turbine operation</li>' : '<li><strong>Low capacity factor:</strong> Consider different turbine type</li>'}
              ${paybackPeriod > 0 && paybackPeriod <= 120 ? '<li><strong>Acceptable payback:</strong> Return time within normal range</li>' : ''}
              <li><strong>Priority:</strong> ${adjustedWindSpeed > 7 ? 'High - excellent wind conditions' : adjustedWindSpeed > 5.5 ? 'Medium - good conditions' : 'Low - poor wind conditions'}</li>
              <li><strong>Additional:</strong> ${excessEnergy > 0 ? 'Consider battery storage for excess energy' : 'System optimally matches consumption'}</li>
              <li><strong>Safety:</strong> Maintain ${Math.max(150, turbine.diameter * 10)} m distance from residential buildings</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});