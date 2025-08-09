document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('eco-impact-form');
  const result = document.getElementById('eco-impact-result');

  // Setup sub-option visibility and sliders
  setupFormInteractions();

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateEcoImpact();
    });
  }

  function setupFormInteractions() {
    // Show/hide sub-options when checkboxes are clicked
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const subOption = this.parentElement.querySelector('.sub-option');
        if (subOption) {
          subOption.style.display = this.checked ? 'block' : 'none';
        }
      });
    });

    // Setup range sliders
    setupRangeSlider('local-percentage', 'local-display', '%');
    setupRangeSlider('organic-percentage', 'organic-display', '%');
    setupRangeSlider('waste-reduction', 'waste-display', '%');
    setupRangeSlider('secondhand-percentage', 'secondhand-display', '%');
  }

  function setupRangeSlider(sliderId, displayId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      slider.addEventListener('input', function() {
        display.textContent = this.value + suffix;
      });
    }
  }

  function calculateEcoImpact() {
    const timePeriod = document.getElementById('time-period').value;
    const householdSize = parseInt(document.getElementById('household-size').value) || 2;
    const comparison = document.getElementById('comparison-baseline').value;
    const includeCost = document.getElementById('include-cost').checked;

    let totalImpact = {
      carbonSaved: 0,      // lbs CO2e
      waterSaved: 0,       // gallons
      wasteSaved: 0,       // lbs
      energySaved: 0,      // kWh
      costSavings: 0,      // USD
      costInvestment: 0    // USD
    };

    // Calculate home & household impact
    if (document.getElementById('led-bulbs').checked) {
      const bulbCount = parseInt(document.getElementById('led-count').value) || 10;
      const ledImpact = calculateLEDImpact(bulbCount, timePeriod);
      addToTotal(totalImpact, ledImpact);
    }

    if (document.getElementById('eco-cleaning').checked) {
      const productCount = parseInt(document.getElementById('cleaning-count').value) || 5;
      const cleaningImpact = calculateCleaningImpact(productCount, timePeriod);
      addToTotal(totalImpact, cleaningImpact);
    }

    if (document.getElementById('reusable-bottles').checked) {
      const users = parseInt(document.getElementById('bottle-users').value) || 2;
      const bottleImpact = calculateBottleImpact(users, timePeriod);
      addToTotal(totalImpact, bottleImpact);
    }

    if (document.getElementById('efficient-appliances').checked) {
      const applianceCount = parseInt(document.getElementById('appliance-count').value) || 3;
      const applianceImpact = calculateApplianceImpact(applianceCount, timePeriod);
      addToTotal(totalImpact, applianceImpact);
    }

    if (document.getElementById('low-flow-fixtures').checked) {
      const fixtureCount = parseInt(document.getElementById('fixture-count').value) || 4;
      const fixtureImpact = calculateFixtureImpact(fixtureCount, timePeriod, householdSize);
      addToTotal(totalImpact, fixtureImpact);
    }

    // Calculate transportation impact
    const transportType = document.getElementById('transport-type').value;
    const weeklyMiles = parseInt(document.getElementById('weekly-miles').value) || 150;
    if (transportType) {
      const transportImpact = calculateTransportImpact(transportType, weeklyMiles, timePeriod);
      addToTotal(totalImpact, transportImpact);
    }

    if (document.getElementById('carpool').checked) {
      const carpoolDays = parseInt(document.getElementById('carpool-days').value) || 3;
      const carpoolImpact = calculateCarpoolImpact(carpoolDays, weeklyMiles, timePeriod);
      addToTotal(totalImpact, carpoolImpact);
    }

    if (document.getElementById('remote-work').checked) {
      const remoteDays = parseInt(document.getElementById('remote-days').value) || 2;
      const remoteImpact = calculateRemoteWorkImpact(remoteDays, timePeriod);
      addToTotal(totalImpact, remoteImpact);
    }

    // Calculate food impact
    const dietType = document.getElementById('diet-type').value;
    if (dietType) {
      const dietImpact = calculateDietImpact(dietType, timePeriod, householdSize);
      addToTotal(totalImpact, dietImpact);
    }

    if (document.getElementById('local-food').checked) {
      const localPercentage = parseInt(document.getElementById('local-percentage').value) || 30;
      const localImpact = calculateLocalFoodImpact(localPercentage, timePeriod, householdSize);
      addToTotal(totalImpact, localImpact);
    }

    if (document.getElementById('organic-food').checked) {
      const organicPercentage = parseInt(document.getElementById('organic-percentage').value) || 25;
      const organicImpact = calculateOrganicImpact(organicPercentage, timePeriod, householdSize);
      addToTotal(totalImpact, organicImpact);
    }

    if (document.getElementById('food-waste-reduction').checked) {
      const wasteReduction = parseInt(document.getElementById('waste-reduction').value) || 40;
      const wasteImpact = calculateWasteReductionImpact(wasteReduction, timePeriod, householdSize);
      addToTotal(totalImpact, wasteImpact);
    }

    // Calculate personal care impact
    if (document.getElementById('sustainable-clothing').checked) {
      const sustainableItems = parseInt(document.getElementById('sustainable-items').value) || 10;
      const clothingImpact = calculateSustainableClothingImpact(sustainableItems, timePeriod);
      addToTotal(totalImpact, clothingImpact);
    }

    if (document.getElementById('secondhand').checked) {
      const secondhandPercentage = parseInt(document.getElementById('secondhand-percentage').value) || 30;
      const secondhandImpact = calculateSecondhandImpact(secondhandPercentage, timePeriod);
      addToTotal(totalImpact, secondhandImpact);
    }

    if (document.getElementById('natural-cosmetics').checked) {
      const cosmeticCount = parseInt(document.getElementById('cosmetic-count').value) || 5;
      const cosmeticImpact = calculateNaturalCosmeticImpact(cosmeticCount, timePeriod);
      addToTotal(totalImpact, cosmeticImpact);
    }

    if (document.getElementById('refillable-products').checked) {
      const refillableCount = parseInt(document.getElementById('refillable-count').value) || 3;
      const refillableImpact = calculateRefillableImpact(refillableCount, timePeriod);
      addToTotal(totalImpact, refillableImpact);
    }

    // Display results
    displayResults(totalImpact, timePeriod, comparison, includeCost, householdSize);
  }

  function addToTotal(total, impact) {
    total.carbonSaved += impact.carbonSaved || 0;
    total.waterSaved += impact.waterSaved || 0;
    total.wasteSaved += impact.wasteSaved || 0;
    total.energySaved += impact.energySaved || 0;
    total.costSavings += impact.costSavings || 0;
    total.costInvestment += impact.costInvestment || 0;
  }

  // Impact calculation functions
  function calculateLEDImpact(bulbCount, period) {
    const multiplier = getTimeMultiplier(period);
    return {
      carbonSaved: bulbCount * 180 * multiplier,      // 180 lbs CO2/year per bulb
      energySaved: bulbCount * 200 * multiplier,      // 200 kWh/year per bulb
      costSavings: bulbCount * 60 * multiplier,       // $60/year savings per bulb
      costInvestment: bulbCount * 8                   // $8 per LED bulb
    };
  }

  function calculateCleaningImpact(productCount, period) {
    const multiplier = getTimeMultiplier(period);
    return {
      carbonSaved: productCount * 12 * multiplier,    // 12 lbs CO2/year per product
      waterSaved: productCount * 500 * multiplier,    // 500 gallons/year per product
      wasteSaved: productCount * 2 * multiplier,      // 2 lbs packaging/year
      costSavings: productCount * 5 * multiplier,     // $5/year savings
      costInvestment: productCount * 3                // $3 extra cost per product
    };
  }

  function calculateBottleImpact(users, period) {
    const multiplier = getTimeMultiplier(period);
    return {
      carbonSaved: users * 500 * multiplier,          // 500 lbs CO2/year per person
      waterSaved: users * 2000 * multiplier,          // 2000 gallons/year per person
      wasteSaved: users * 100 * multiplier,           // 100 lbs plastic/year per person
      costSavings: users * 400 * multiplier,          // $400/year savings per person
      costInvestment: users * 25                      // $25 per reusable bottle
    };
  }

  function calculateApplianceImpact(applianceCount, period) {
    const multiplier = getTimeMultiplier(period);
    return {
      carbonSaved: applianceCount * 800 * multiplier, // 800 lbs CO2/year per appliance
      energySaved: applianceCount * 600 * multiplier, // 600 kWh/year per appliance
      waterSaved: applianceCount * 3000 * multiplier, // 3000 gallons/year per appliance
      costSavings: applianceCount * 150 * multiplier, // $150/year savings
      costInvestment: applianceCount * 200            // $200 extra per efficient appliance
    };
  }

  function calculateFixtureImpact(fixtureCount, period, householdSize) {
    const multiplier = getTimeMultiplier(period);
    return {
      waterSaved: fixtureCount * householdSize * 2500 * multiplier, // 2500 gallons/year
      carbonSaved: fixtureCount * householdSize * 50 * multiplier,  // 50 lbs CO2/year
      costSavings: fixtureCount * householdSize * 40 * multiplier,  // $40/year savings
      costInvestment: fixtureCount * 50                             // $50 per fixture
    };
  }

  function calculateTransportImpact(transportType, weeklyMiles, period) {
    const multiplier = getTimeMultiplier(period);
    const yearlyMiles = weeklyMiles * 52;
    
    const impacts = {
      'hybrid': { carbonSaved: yearlyMiles * 0.3 * multiplier, costSavings: yearlyMiles * 0.08 * multiplier },
      'electric': { carbonSaved: yearlyMiles * 0.8 * multiplier, costSavings: yearlyMiles * 0.12 * multiplier },
      'public': { carbonSaved: yearlyMiles * 0.6 * multiplier, costSavings: yearlyMiles * 0.15 * multiplier },
      'bike-walk': { carbonSaved: yearlyMiles * 1.0 * multiplier, costSavings: yearlyMiles * 0.25 * multiplier }
    };
    
    return impacts[transportType] || { carbonSaved: 0, costSavings: 0 };
  }

  function calculateCarpoolImpact(carpoolDays, weeklyMiles, period) {
    const multiplier = getTimeMultiplier(period);
    const carpoolMiles = (weeklyMiles / 7) * carpoolDays * 52; // Yearly carpool miles
    return {
      carbonSaved: carpoolMiles * 0.5 * multiplier,           // 50% reduction
      costSavings: carpoolMiles * 0.1 * multiplier
    };
  }

  function calculateRemoteWorkImpact(remoteDays, period) {
    const multiplier = getTimeMultiplier(period);
    const yearlyRemoteDays = remoteDays * 50; // 50 work weeks
    return {
      carbonSaved: yearlyRemoteDays * 20 * multiplier,        // 20 lbs CO2 per remote day
      costSavings: yearlyRemoteDays * 15 * multiplier         // $15 per remote day
    };
  }

  function calculateDietImpact(dietType, period, householdSize) {
    const multiplier = getTimeMultiplier(period);
    const impacts = {
      'reduced-meat': { carbonSaved: 500 * householdSize * multiplier, waterSaved: 50000 * householdSize * multiplier },
      'pescatarian': { carbonSaved: 1000 * householdSize * multiplier, waterSaved: 80000 * householdSize * multiplier },
      'vegetarian': { carbonSaved: 1500 * householdSize * multiplier, waterSaved: 100000 * householdSize * multiplier },
      'vegan': { carbonSaved: 2000 * householdSize * multiplier, waterSaved: 150000 * householdSize * multiplier }
    };
    return impacts[dietType] || { carbonSaved: 0, waterSaved: 0 };
  }

  function calculateLocalFoodImpact(percentage, period, householdSize) {
    const multiplier = getTimeMultiplier(period);
    const factor = percentage / 100;
    return {
      carbonSaved: 200 * factor * householdSize * multiplier, // 200 lbs CO2/year at 100%
      costSavings: 300 * factor * householdSize * multiplier  // $300/year savings at 100%
    };
  }

  function calculateOrganicImpact(percentage, period, householdSize) {
    const multiplier = getTimeMultiplier(period);
    const factor = percentage / 100;
    return {
      carbonSaved: 150 * factor * householdSize * multiplier, // 150 lbs CO2/year at 100%
      waterSaved: 5000 * factor * householdSize * multiplier, // 5000 gallons/year at 100%
      costInvestment: 500 * factor * householdSize * multiplier // $500/year extra cost at 100%
    };
  }

  function calculateWasteReductionImpact(percentage, period, householdSize) {
    const multiplier = getTimeMultiplier(period);
    const factor = percentage / 100;
    return {
      carbonSaved: 300 * factor * householdSize * multiplier, // 300 lbs CO2/year at 100%
      wasteSaved: 200 * factor * householdSize * multiplier,  // 200 lbs waste/year at 100%
      costSavings: 400 * factor * householdSize * multiplier  // $400/year savings at 100%
    };
  }

  function calculateSustainableClothingImpact(items, period) {
    const multiplier = getTimeMultiplier(period);
    return {
      carbonSaved: items * 15 * multiplier,                   // 15 lbs CO2 per item
      waterSaved: items * 700 * multiplier,                   // 700 gallons per item
      costInvestment: items * 20                              // $20 extra per item
    };
  }

  function calculateSecondhandImpact(percentage, period) {
    const multiplier = getTimeMultiplier(period);
    const factor = percentage / 100;
    return {
      carbonSaved: 400 * factor * multiplier,                 // 400 lbs CO2/year at 100%
      waterSaved: 20000 * factor * multiplier,                // 20000 gallons/year at 100%
      wasteSaved: 50 * factor * multiplier,                   // 50 lbs waste/year at 100%
      costSavings: 800 * factor * multiplier                  // $800/year savings at 100%
    };
  }

  function calculateNaturalCosmeticImpact(productCount, period) {
    const multiplier = getTimeMultiplier(period);
    return {
      carbonSaved: productCount * 5 * multiplier,             // 5 lbs CO2 per product/year
      waterSaved: productCount * 100 * multiplier,            // 100 gallons per product/year
      costInvestment: productCount * 10 * multiplier          // $10 extra per product/year
    };
  }

  function calculateRefillableImpact(productCount, period) {
    const multiplier = getTimeMultiplier(period);
    return {
      carbonSaved: productCount * 8 * multiplier,             // 8 lbs CO2 per product/year
      wasteSaved: productCount * 5 * multiplier,              // 5 lbs packaging per product/year
      costSavings: productCount * 15 * multiplier             // $15 savings per product/year
    };
  }

  function getTimeMultiplier(period) {
    switch (period) {
      case 'monthly': return 1/12;
      case 'yearly': return 1;
      case 'lifetime': return 50;
      default: return 1;
    }
  }

  function displayResults(impact, timePeriod, comparison, includeCost, householdSize) {
    const timeLabel = timePeriod === 'monthly' ? 'per month' : 
                     timePeriod === 'yearly' ? 'per year' : 
                     'over lifetime (50 years)';

    // Calculate comparison baselines
    const baselines = getComparisonBaselines(comparison, timePeriod, householdSize);
    
    let html = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🌿 Carbon Saved</h6>
          <div class="big-number">${Math.round(impact.carbonSaved).toLocaleString()}</div>
          <p class="insight-detail">lbs CO2e ${timeLabel}</p>
        </div>
        <div class="insight-card info">
          <h6>💧 Water Saved</h6>
          <div class="big-number">${Math.round(impact.waterSaved).toLocaleString()}</div>
          <p class="insight-detail">gallons ${timeLabel}</p>
        </div>
        <div class="insight-card warning">
          <h6>♻️ Waste Diverted</h6>
          <div class="big-number">${Math.round(impact.wasteSaved).toLocaleString()}</div>
          <p class="insight-detail">lbs ${timeLabel}</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Environmental Impact Summary</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>🌱 Carbon Footprint</h4>
              <div style="font-size: 1.2rem; color: var(--accent); margin: 0.5rem 0;">
                ${Math.round(impact.carbonSaved).toLocaleString()} lbs CO2e saved
              </div>
              <small>Equivalent to planting ${Math.round(impact.carbonSaved / 48)} trees</small>
            </div>

            <div>
              <h4>💧 Water Conservation</h4>
              <div style="font-size: 1.2rem; color: var(--accent); margin: 0.5rem 0;">
                ${Math.round(impact.waterSaved).toLocaleString()} gallons saved
              </div>
              <small>Equivalent to ${Math.round(impact.waterSaved / 80)} days of average use</small>
            </div>

            <div>
              <h4>⚡ Energy Savings</h4>
              <div style="font-size: 1.2rem; color: var(--accent); margin: 0.5rem 0;">
                ${Math.round(impact.energySaved).toLocaleString()} kWh saved
              </div>
              <small>Powers average home for ${Math.round(impact.energySaved / 877)} months</small>
            </div>

            <div>
              <h4>♻️ Waste Reduction</h4>
              <div style="font-size: 1.2rem; color: var(--accent); margin: 0.5rem 0;">
                ${Math.round(impact.wasteSaved).toLocaleString()} lbs diverted
              </div>
              <small>Prevents ${Math.round(impact.wasteSaved / 2000)} tons from landfills</small>
            </div>
          </div>
        </div>
      </div>
    `;

    // Comparison section
    html += `
      <div style="margin-top: 2rem;">
        <h3>📈 Impact Comparison</h3>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          <h4>Your Impact vs ${getComparisonLabel(comparison)}</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            
            <div class="comparison-item">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span>Carbon Footprint Reduction</span>
                <span style="font-weight: bold; color: var(--accent);">${Math.round((impact.carbonSaved / baselines.carbon) * 100)}%</span>
              </div>
              <div style="background: var(--card-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: var(--accent); height: 100%; width: ${Math.min(100, (impact.carbonSaved / baselines.carbon) * 100)}%; border-radius: 4px;"></div>
              </div>
            </div>

            <div class="comparison-item">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span>Water Conservation</span>
                <span style="font-weight: bold; color: var(--accent);">${Math.round((impact.waterSaved / baselines.water) * 100)}%</span>
              </div>
              <div style="background: var(--card-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: var(--accent); height: 100%; width: ${Math.min(100, (impact.waterSaved / baselines.water) * 100)}%; border-radius: 4px;"></div>
              </div>
            </div>

            <div class="comparison-item">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span>Waste Reduction</span>
                <span style="font-weight: bold; color: var(--accent);">${Math.round((impact.wasteSaved / baselines.waste) * 100)}%</span>
              </div>
              <div style="background: var(--card-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: var(--accent); height: 100%; width: ${Math.min(100, (impact.wasteSaved / baselines.waste) * 100)}%; border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Cost analysis (if enabled)
    if (includeCost) {
      const netSavings = impact.costSavings - impact.costInvestment;
      html += `
        <div style="margin-top: 2rem;">
          <h3>💰 Financial Impact</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            
            <div class="insight-card success">
              <h6>💵 Cost Savings</h6>
              <div class="big-number">$${Math.round(impact.costSavings).toLocaleString()}</div>
              <p class="insight-detail">${timeLabel}</p>
            </div>

            <div class="insight-card warning">
              <h6>💸 Investment</h6>
              <div class="big-number">$${Math.round(impact.costInvestment).toLocaleString()}</div>
              <p class="insight-detail">upfront costs</p>
            </div>

            <div class="insight-card info">
              <h6>💎 Net Impact</h6>
              <div class="big-number" style="color: ${netSavings >= 0 ? 'green' : 'red'};">
                $${Math.round(Math.abs(netSavings)).toLocaleString()}
              </div>
              <p class="insight-detail">${netSavings >= 0 ? 'net savings' : 'net cost'}</p>
            </div>
          </div>
        </div>
      `;
    }

    // Action recommendations
    html += `
      <div style="margin-top: 2rem;">
        <h3>🎯 Next Steps & Recommendations</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          ${getRecommendations(impact, timePeriod)}
        </div>
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
        <strong>🌍 Your Impact Matters!</strong> Your eco-friendly choices are making a real difference. 
        Share your results with friends and family to multiply your positive impact. Every person who adopts 
        sustainable practices helps build a more sustainable future for everyone.
      </div>
    `;

    result.innerHTML = html;
  }

  function getComparisonBaselines(comparison, timePeriod, householdSize) {
    const multiplier = getTimeMultiplier(timePeriod);
    
    const baselines = {
      'average': {
        carbon: 15000 * householdSize * multiplier,      // US average 15,000 lbs CO2/person/year
        water: 80000 * householdSize * multiplier,       // 80,000 gallons/person/year
        waste: 1500 * householdSize * multiplier         // 1,500 lbs waste/person/year
      },
      'traditional': {
        carbon: 20000 * householdSize * multiplier,      // All traditional products
        water: 100000 * householdSize * multiplier,
        waste: 2000 * householdSize * multiplier
      },
      'global': {
        carbon: 8000 * householdSize * multiplier,       // Global average lower
        water: 50000 * householdSize * multiplier,
        waste: 800 * householdSize * multiplier
      }
    };
    
    return baselines[comparison] || baselines['average'];
  }

  function getComparisonLabel(comparison) {
    const labels = {
      'average': 'Average US Consumer',
      'traditional': 'All Traditional Products',
      'global': 'Global Average Consumer'
    };
    return labels[comparison] || 'Average Consumer';
  }

  function getRecommendations(impact, timePeriod) {
    const recommendations = [];
    
    if (impact.carbonSaved < 1000) {
      recommendations.push('🚗 <strong>Transportation:</strong> Consider electric vehicles, public transport, or remote work to maximize carbon savings');
    }
    
    if (impact.waterSaved < 5000) {
      recommendations.push('💧 <strong>Water Conservation:</strong> Install low-flow fixtures and choose water-efficient appliances');
    }
    
    if (impact.wasteSaved < 100) {
      recommendations.push('♻️ <strong>Waste Reduction:</strong> Focus on reusable products, bulk buying, and composting');
    }
    
    recommendations.push('📱 <strong>Track Progress:</strong> Reassess your impact quarterly and set new sustainability goals');
    recommendations.push('👥 <strong>Influence Others:</strong> Share your eco-friendly practices with family and friends');
    recommendations.push('🎓 <strong>Keep Learning:</strong> Stay informed about new sustainable products and practices');
    
    return '<ul style="margin: 0.5rem 0;">' + 
           recommendations.map(rec => `<li style="margin: 0.5rem 0;">${rec}</li>`).join('') + 
           '</ul>';
  }
});