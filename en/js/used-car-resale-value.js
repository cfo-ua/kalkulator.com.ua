document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("car-value-form");
  const resultDiv = document.getElementById("car-value-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateCarValue();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['purchase-price', 'current-year', 'purchase-year', 'current-mileage'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateCarValue();
      }
    });
  });

  function validateInputs() {
    const purchasePrice = parseFloat(document.getElementById("purchase-price").value);
    const purchaseYear = parseFloat(document.getElementById("purchase-year").value);
    const currentYear = parseFloat(document.getElementById("current-year").value);
    const currentMileage = parseFloat(document.getElementById("current-mileage").value);
    
    return purchasePrice > 0 && currentYear >= purchaseYear && currentMileage >= 0;
  }

  function calculateCarValue() {
    // Get inputs
    const purchasePrice = parseFloat(document.getElementById("purchase-price").value) || 0;
    const purchaseYear = parseFloat(document.getElementById("purchase-year").value) || 0;
    const currentYear = parseFloat(document.getElementById("current-year").value) || 0;
    const vehicleMake = document.getElementById("vehicle-make").value;
    const vehicleType = document.getElementById("vehicle-type").value;
    const currentMileage = parseFloat(document.getElementById("current-mileage").value) || 0;
    const annualMileage = parseFloat(document.getElementById("annual-mileage").value) || 0;
    const vehicleCondition = document.getElementById("vehicle-condition").value;
    const maintenanceHistory = document.getElementById("maintenance-history").value;
    const accidentHistory = document.getElementById("accident-history").value;
    const modifications = document.getElementById("modifications").value;
    const marketDemand = document.getElementById("market-demand").value;
    const projectionYears = parseFloat(document.getElementById("projection-years").value) || 0;
    const plannedMileage = parseFloat(document.getElementById("planned-mileage").value) || 0;

    if (purchasePrice <= 0 || currentYear < purchaseYear) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid purchase price and years.</p>';
      return;
    }

    const vehicleAge = currentYear - purchaseYear;
    const futureAge = vehicleAge + projectionYears;
    const futureMileage = currentMileage + (plannedMileage * projectionYears);
    
    // Get depreciation factors
    const brandFactor = getBrandDepreciationFactor(vehicleMake);
    const typeFactor = getVehicleTypeDepreciationFactor(vehicleType);
    const conditionFactor = getConditionFactor(vehicleCondition);
    const maintenanceFactor = getMaintenanceFactor(maintenanceHistory);
    const accidentFactor = getAccidentFactor(accidentHistory);
    const modificationFactor = getModificationFactor(modifications);
    const marketFactor = getMarketDemandFactor(marketDemand);
    const mileageFactor = getMileageFactor(currentMileage, vehicleAge, annualMileage);
    const futureMileageFactor = getMileageFactor(futureMileage, futureAge, plannedMileage);

    // Calculate current value
    const baseDepreciation = calculateBaseDepreciation(vehicleAge);
    let currentValue = purchasePrice * baseDepreciation;
    
    // Apply all factors to current value
    currentValue *= brandFactor * typeFactor * conditionFactor * maintenanceFactor * 
                   accidentFactor * modificationFactor * marketFactor * mileageFactor;

    // Calculate future value
    const futureBaseDepreciation = calculateBaseDepreciation(futureAge);
    let futureValue = purchasePrice * futureBaseDepreciation;
    
    // Apply factors to future value (some factors may worsen over time)
    const futureConditionFactor = Math.max(conditionFactor * 0.95, 0.5); // Condition deteriorates slightly
    futureValue *= brandFactor * typeFactor * futureConditionFactor * maintenanceFactor * 
                   accidentFactor * modificationFactor * marketFactor * futureMileageFactor;

    // Calculate depreciation amounts
    const totalDepreciationToDate = purchasePrice - currentValue;
    const additionalDepreciation = currentValue - futureValue;
    const totalDepreciationFuture = purchasePrice - futureValue;
    
    // Calculate annual depreciation rates
    const currentAnnualDepreciation = vehicleAge > 0 ? (totalDepreciationToDate / vehicleAge) : 0;
    const futureAnnualDepreciation = projectionYears > 0 ? (additionalDepreciation / projectionYears) : 0;

    displayResults({
      purchasePrice,
      purchaseYear,
      currentYear,
      vehicleAge,
      futureAge,
      currentMileage,
      futureMileage,
      currentValue,
      futureValue,
      totalDepreciationToDate,
      additionalDepreciation,
      totalDepreciationFuture,
      currentAnnualDepreciation,
      futureAnnualDepreciation,
      projectionYears,
      vehicleMake,
      vehicleType,
      factors: {
        brand: brandFactor,
        type: typeFactor,
        condition: conditionFactor,
        maintenance: maintenanceFactor,
        accident: accidentFactor,
        modification: modificationFactor,
        market: marketFactor,
        mileage: mileageFactor,
        futureMileage: futureMileageFactor
      }
    });
  }

  function calculateBaseDepreciation(age) {
    // Typical depreciation curve: steep first few years, then gradual
    if (age <= 0) return 1.0;
    if (age === 1) return 0.78; // 22% first year
    if (age === 2) return 0.67; // 15% second year
    if (age === 3) return 0.58; // 13% third year
    if (age === 4) return 0.51; // 12% fourth year
    if (age === 5) return 0.45; // 11% fifth year
    
    // After 5 years, depreciate ~8% per year
    const additionalYears = age - 5;
    return Math.max(0.45 * Math.pow(0.92, additionalYears), 0.05); // Floor at 5% of original
  }

  function getBrandDepreciationFactor(make) {
    const brandFactors = {
      'toyota': 1.15,      // 15% better than average
      'honda': 1.12,       // 12% better than average
      'subaru': 1.10,      // 10% better than average
      'lexus': 1.08,       // 8% better than average
      'porsche': 1.05,     // 5% better than average
      'jeep': 1.03,        // 3% better than average
      'ford': 1.0,         // Average
      'chevrolet': 0.98,   // 2% worse than average
      'nissan': 0.96,      // 4% worse than average
      'hyundai': 0.94,     // 6% worse than average
      'bmw': 0.90,         // 10% worse (luxury depreciation)
      'mercedes': 0.88,    // 12% worse (luxury depreciation)
      'audi': 0.90,        // 10% worse (luxury depreciation)
      'acura': 1.05,       // 5% better than average
      'ram': 1.02,         // 2% better than average
      'gmc': 1.01,         // 1% better than average
      'other': 0.95        // 5% worse than average
    };
    return brandFactors[make] || 1.0;
  }

  function getVehicleTypeDepreciationFactor(type) {
    const typeFactors = {
      'truck': 1.10,       // Trucks hold value well
      'suv': 1.08,         // SUVs in high demand
      'wagon': 1.02,       // Steady demand
      'sedan': 1.0,        // Average
      'hatchback': 0.98,   // Slightly below average
      'coupe': 0.95,       // Limited demand
      'minivan': 0.92,     // Lower demand
      'convertible': 0.90  // Niche market
    };
    return typeFactors[type] || 1.0;
  }

  function getConditionFactor(condition) {
    const conditionFactors = {
      'excellent': 1.15,   // 15% premium for excellent condition
      'good': 1.0,         // Baseline
      'fair': 0.85,        // 15% discount for fair condition
      'poor': 0.65         // 35% discount for poor condition
    };
    return conditionFactors[condition] || 1.0;
  }

  function getMaintenanceFactor(maintenance) {
    const maintenanceFactors = {
      'excellent': 1.10,   // 10% premium for excellent maintenance
      'good': 1.0,         // Baseline
      'fair': 0.95,        // 5% discount for fair maintenance
      'poor': 0.85         // 15% discount for poor maintenance
    };
    return maintenanceFactors[maintenance] || 1.0;
  }

  function getAccidentFactor(accident) {
    const accidentFactors = {
      'none': 1.0,         // No impact
      'minor': 0.90,       // 10% discount for minor accident
      'moderate': 0.80,    // 20% discount for moderate accident
      'major': 0.65        // 35% discount for major accident
    };
    return accidentFactors[accident] || 1.0;
  }

  function getModificationFactor(modification) {
    const modificationFactors = {
      'none': 1.0,         // No impact
      'minor': 0.98,       // 2% discount (not appealing to all buyers)
      'performance': 0.90, // 10% discount (limited market)
      'extensive': 0.80    // 20% discount (very limited market)
    };
    return modificationFactors[modification] || 1.0;
  }

  function getMarketDemandFactor(demand) {
    const demandFactors = {
      'high': 1.10,        // 10% premium for high demand
      'average': 1.0,      // Baseline
      'low': 0.90          // 10% discount for low demand
    };
    return demandFactors[demand] || 1.0;
  }

  function getMileageFactor(mileage, age, annualMileage) {
    if (age <= 0) return 1.0;
    
    const averageAnnualMileage = 12000;
    const expectedMileage = age * averageAnnualMileage;
    const mileageDifference = mileage - expectedMileage;
    
    // For every 1000 miles over/under average, adjust value by 0.5%
    const mileageAdjustment = (mileageDifference / 1000) * -0.005;
    
    // Cap the adjustment between -30% and +15%
    const cappedAdjustment = Math.max(-0.30, Math.min(0.15, mileageAdjustment));
    
    return 1 + cappedAdjustment;
  }

  function displayResults(data) {
    const {
      purchasePrice,
      purchaseYear,
      currentYear,
      vehicleAge,
      futureAge,
      currentMileage,
      futureMileage,
      currentValue,
      futureValue,
      totalDepreciationToDate,
      additionalDepreciation,
      totalDepreciationFuture,
      currentAnnualDepreciation,
      futureAnnualDepreciation,
      projectionYears,
      vehicleMake,
      vehicleType,
      factors
    } = data;

    const currentDepreciationPercentage = ((totalDepreciationToDate / purchasePrice) * 100);
    const futureDepreciationPercentage = ((totalDepreciationFuture / purchasePrice) * 100);
    const retentionPercentage = ((currentValue / purchasePrice) * 100);
    const futureRetentionPercentage = ((futureValue / purchasePrice) * 100);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🚗 Vehicle Resale Value Analysis</h3>
        
        <div class="vehicle-summary">
          <h4>${vehicleMake.charAt(0).toUpperCase() + vehicleMake.slice(1)} ${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} (${purchaseYear})</h4>
          <p><strong>Current Age:</strong> ${vehicleAge} year${vehicleAge !== 1 ? 's' : ''} | <strong>Current Mileage:</strong> ${currentMileage.toLocaleString()} miles</p>
        </div>

        <div class="value-comparison">
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>💸 Purchase Price</h6>
              <p class="big-number">$${purchasePrice.toLocaleString()}</p>
              <p class="insight-detail">original cost</p>
            </div>
            
            <div class="insight-card success">
              <h6>💰 Current Value</h6>
              <p class="big-number">$${currentValue.toLocaleString()}</p>
              <p class="insight-detail">estimated worth</p>
            </div>
            
            <div class="insight-card ${retentionPercentage >= 70 ? 'success' : retentionPercentage >= 50 ? 'warning' : 'info'}">
              <h6>📊 Value Retention</h6>
              <p class="big-number">${retentionPercentage.toFixed(1)}%</p>
              <p class="insight-detail">value preserved</p>
            </div>
            
            <div class="insight-card warning">
              <h6>📉 Total Loss</h6>
              <p class="big-number">$${totalDepreciationToDate.toLocaleString()}</p>
              <p class="insight-detail">depreciation to date</p>
            </div>
            
            <div class="insight-card info">
              <h6>📅 Annual Loss</h6>
              <p class="big-number">$${currentAnnualDepreciation.toLocaleString()}</p>
              <p class="insight-detail">per year average</p>
            </div>
            
            <div class="insight-card info">
              <h6>📈 Depreciation Rate</h6>
              <p class="big-number">${currentDepreciationPercentage.toFixed(1)}%</p>
              <p class="insight-detail">current rate</p>
            </div>
          </div>
        </div>

        ${projectionYears > 0 ? `
          <div class="future-projection">
            <h4>📈 ${projectionYears}-Year Future Projection</h4>
            <div class="projection-grid">
              <div class="projection-item">
                <span class="label">Estimated Value in ${projectionYears} year${projectionYears !== 1 ? 's' : ''}:</span>
                <span class="value">$${futureValue.toLocaleString()}</span>
              </div>
              <div class="projection-item">
                <span class="label">Expected Mileage:</span>
                <span class="value">${futureMileage.toLocaleString()} miles</span>
              </div>
              <div class="projection-item">
                <span class="label">Additional Depreciation:</span>
                <span class="value">$${additionalDepreciation.toLocaleString()}</span>
              </div>
              <div class="projection-item">
                <span class="label">Future Value Retention:</span>
                <span class="value">${futureRetentionPercentage.toFixed(1)}%</span>
              </div>
              <div class="projection-item">
                <span class="label">Annual Depreciation (future):</span>
                <span class="value">$${futureAnnualDepreciation.toLocaleString()}/year</span>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="factors-analysis">
          <h4>📊 Value Impact Factors</h4>
          <div class="factors-grid">
            <div class="factor-item ${factors.brand >= 1.05 ? 'positive' : factors.brand <= 0.95 ? 'negative' : 'neutral'}">
              <span class="factor-name">Brand Reputation:</span>
              <span class="factor-impact">${((factors.brand - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-item ${factors.type >= 1.05 ? 'positive' : factors.type <= 0.95 ? 'negative' : 'neutral'}">
              <span class="factor-name">Vehicle Type:</span>
              <span class="factor-impact">${((factors.type - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-item ${factors.condition >= 1.05 ? 'positive' : factors.condition <= 0.95 ? 'negative' : 'neutral'}">
              <span class="factor-name">Condition:</span>
              <span class="factor-impact">${((factors.condition - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-item ${factors.maintenance >= 1.02 ? 'positive' : factors.maintenance <= 0.98 ? 'negative' : 'neutral'}">
              <span class="factor-name">Maintenance:</span>
              <span class="factor-impact">${((factors.maintenance - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-item ${factors.accident >= 0.99 ? 'neutral' : 'negative'}">
              <span class="factor-name">Accident History:</span>
              <span class="factor-impact">${((factors.accident - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-item ${factors.mileage >= 1.02 ? 'positive' : factors.mileage <= 0.98 ? 'negative' : 'neutral'}">
              <span class="factor-name">Mileage:</span>
              <span class="factor-impact">${((factors.mileage - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-item ${factors.market >= 1.02 ? 'positive' : factors.market <= 0.98 ? 'negative' : 'neutral'}">
              <span class="factor-name">Market Demand:</span>
              <span class="factor-impact">${((factors.market - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="factor-item ${factors.modification >= 0.99 ? 'neutral' : 'negative'}">
              <span class="factor-name">Modifications:</span>
              <span class="factor-impact">${((factors.modification - 1) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div class="selling-strategy">
          <h4>💡 Selling Strategy Recommendations</h4>
          ${getSellingRecommendations(data)}
        </div>

        <div class="value-improvement">
          <h4>⬆️ Ways to Improve Resale Value</h4>
          <ul>
            <li><strong>Maintain Service Records:</strong> Keep detailed maintenance documentation</li>
            <li><strong>Address Minor Issues:</strong> Fix small problems before they become major</li>
            <li><strong>Keep Mileage Reasonable:</strong> Avoid excessive driving when possible</li>
            <li><strong>Clean Regularly:</strong> Maintain interior and exterior appearance</li>
            <li><strong>Avoid Modifications:</strong> Keep the vehicle close to original condition</li>
            <li><strong>Use Quality Parts:</strong> OEM or high-quality aftermarket parts only</li>
          </ul>
        </div>

        <div class="market-timing">
          <h4>📅 Best Time to Sell</h4>
          <ul>
            <li><strong>Before Major Repairs:</strong> Sell before expensive maintenance is due</li>
            <li><strong>Spring/Summer:</strong> Generally better demand for most vehicles</li>
            <li><strong>Model Refresh Years:</strong> Sell before your model gets refreshed</li>
            <li><strong>High Demand Periods:</strong> SUVs in winter, convertibles in spring</li>
            <li><strong>Low Mileage Milestones:</strong> Before hitting 60k, 100k, 150k mile marks</li>
          </ul>
        </div>

        <div class="important-notes">
          <h4>📝 Important Notes</h4>
          <ul>
            <li><strong>Estimates Only:</strong> Actual values depend on specific condition and local market</li>
            <li><strong>Market Fluctuations:</strong> Used car values can change rapidly with market conditions</li>
            <li><strong>Individual Variation:</strong> Specific features and options affect value</li>
            <li><strong>Professional Appraisal:</strong> Get expert evaluation for precise valuation</li>
            <li><strong>Regional Differences:</strong> Values vary significantly by geographic location</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getSellingRecommendations(data) {
    const recommendations = [];
    const { currentValue, factors, vehicleAge, currentMileage } = data;

    if (factors.condition < 0.95) {
      recommendations.push("🔧 <strong>Improve Condition:</strong> Address maintenance issues before selling");
    }

    if (factors.mileage < 0.95) {
      recommendations.push("📊 <strong>Highlight Low Mileage:</strong> Emphasize below-average mileage in listings");
    } else if (factors.mileage > 1.05) {
      recommendations.push("⚠️ <strong>Price Accordingly:</strong> High mileage may require competitive pricing");
    }

    if (vehicleAge >= 8) {
      recommendations.push("⏰ <strong>Consider Selling Soon:</strong> Older vehicles depreciate faster");
    }

    if (currentValue > 15000) {
      recommendations.push("🏪 <strong>Private Sale:</strong> Higher value justifies private party sale effort");
    } else {
      recommendations.push("🚗 <strong>Consider Trade-in:</strong> Lower values may favor trade-in convenience");
    }

    if (factors.accident < 0.95) {
      recommendations.push("📋 <strong>Transparency:</strong> Be upfront about accident history with documentation");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ <strong>Well Positioned:</strong> Your vehicle shows good value retention");
    }

    return `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>`;
  }
});