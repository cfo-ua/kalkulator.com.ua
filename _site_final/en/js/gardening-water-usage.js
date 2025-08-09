document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('water-usage-form');
  const result = document.getElementById('water-usage-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const gardenArea = parseFloat(document.getElementById('garden-area').value);
      const gardenType = document.getElementById('garden-type').value;
      const climateZone = document.getElementById('climate-zone').value;
      const soilType = document.getElementById('soil-type').value;
      const mulchCoverage = parseFloat(document.getElementById('mulch-coverage').value);
      const irrigationMethod = document.getElementById('irrigation-method').value;
      const rainfall = parseFloat(document.getElementById('rainfall').value);
      const waterCost = parseFloat(document.getElementById('water-cost').value);
      const analysisPeriod = document.getElementById('analysis-period').value;
      
      if (gardenArea <= 0 || !gardenType || !climateZone || !soilType || !irrigationMethod) {
        result.textContent = "Please fill in all required fields.";
        return;
      }
      
      // Parse input data
      const [gardenTypeName, baseWaterNeed] = gardenType.split(',');
      const [climateName, climateMultiplier] = climateZone.split(',');
      const [soilName, soilMultiplier] = soilType.split(',');
      const [irrigationName, irrigationEfficiency] = irrigationMethod.split(',');
      
      const baseWater = parseFloat(baseWaterNeed);
      const climateFactor = parseFloat(climateMultiplier);
      const soilFactor = parseFloat(soilMultiplier);
      const efficiency = parseFloat(irrigationEfficiency);
      
      // Calculate mulch water savings (percentage reduction)
      const mulchSavings = mulchCoverage * 0.005; // 0.5% savings per 1% coverage
      
      // Calculate weekly water need in inches
      const adjustedWaterNeed = baseWater * climateFactor * soilFactor * (1 - mulchSavings);
      
      // Convert to gallons per week
      const gallonsPerInch = gardenArea * 0.623; // 1 inch of water over 1 sq ft = 0.623 gallons
      const weeklyWaterNeedGallons = adjustedWaterNeed * gallonsPerInch;
      
      // Account for rainfall
      const irrigationNeedInches = Math.max(0, adjustedWaterNeed - rainfall);
      const weeklyIrrigationGallons = irrigationNeedInches * gallonsPerInch;
      
      // Account for irrigation efficiency
      const actualWaterUsed = weeklyIrrigationGallons / efficiency;
      
      // Calculate for different time periods
      const periodMultipliers = {
        'week': 1,
        'month': 4.33,
        'season': 26, // 6 months
        'year': 52
      };
      
      const multiplier = periodMultipliers[analysisPeriod];
      const totalWaterUsed = actualWaterUsed * multiplier;
      const totalCost = (totalWaterUsed / 1000) * waterCost;
      
      // Calculate water savings with improvements
      const improvedEfficiency = Math.min(0.9, efficiency + 0.1); // 10% improvement max 90%
      const improvedMulch = Math.min(100, mulchCoverage + 25); // Add 25% more mulch
      const improvedMulchSavings = improvedMulch * 0.005;
      const improvedWaterNeed = baseWater * climateFactor * soilFactor * (1 - improvedMulchSavings);
      const improvedIrrigation = Math.max(0, improvedWaterNeed - rainfall) * gallonsPerInch / improvedEfficiency;
      const potentialSavings = (actualWaterUsed - improvedIrrigation) * multiplier;
      const costSavings = (potentialSavings / 1000) * waterCost;
      
      // Rainwater harvesting potential
      const roofArea = gardenArea * 2; // Estimate roof area as 2x garden area
      const rainwaterPotential = roofArea * (rainfall / 12) * 0.623 * multiplier; // Annual collection
      const rainwaterValue = (rainwaterPotential / 1000) * waterCost;
      
      // Environmental impact
      const co2PerGallon = 0.002; // kg CO2 per gallon of treated water
      const co2Impact = totalWaterUsed * co2PerGallon;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Garden Water Analysis (${analysisPeriod}):</h4>
          <p>Garden: ${gardenArea.toLocaleString()} sq ft ${gardenTypeName}</p>
          <p>Climate: ${climateName} conditions</p>
          <p>Soil: ${soilName}</p>
          <p>Irrigation: ${irrigationName} (${(efficiency * 100).toFixed(0)}% efficient)</p>
          <p>Mulch coverage: ${mulchCoverage}%</p>
        </div>
        
        <div class="result-water-needs">
          <h4>Water Requirements:</h4>
          <p><strong>Base water need:</strong> ${baseWater}" per week</p>
          <p><strong>Adjusted for conditions:</strong> ${adjustedWaterNeed.toFixed(2)}" per week</p>
          <p><strong>After rainfall:</strong> ${irrigationNeedInches.toFixed(2)}" irrigation needed</p>
          <p><strong>Weekly irrigation:</strong> ${weeklyIrrigationGallons.toFixed(0)} gallons needed</p>
          <p><strong>With efficiency loss:</strong> ${actualWaterUsed.toFixed(0)} gallons applied</p>
        </div>
        
        <div class="result-usage">
          <h4>Total Water Usage:</h4>
          <p><strong>${totalWaterUsed.toFixed(0)} gallons</strong> for ${analysisPeriod}</p>
          <p>Daily average: ${(totalWaterUsed / (multiplier * 7)).toFixed(1)} gallons</p>
          <p>Per square foot: ${(totalWaterUsed / gardenArea).toFixed(2)} gallons</p>
          <p><strong>Total cost: $${totalCost.toFixed(2)}</strong></p>
          <p>Cost per sq ft: $${(totalCost / gardenArea).toFixed(3)}</p>
        </div>
        
        <div class="result-efficiency">
          <h4>Efficiency Analysis:</h4>
          <p>Water wasted: ${((1 - efficiency) * 100).toFixed(0)}% (${((actualWaterUsed - weeklyIrrigationGallons) * multiplier).toFixed(0)} gallons)</p>
          <p>Mulch water savings: ${(mulchSavings * 100).toFixed(1)}%</p>
          <p>Rainfall contribution: ${rainfall > 0 ? `${((rainfall / adjustedWaterNeed) * 100).toFixed(0)}%` : 'None this period'}</p>
          <p>Irrigation efficiency: ${irrigationName} performs ${efficiency >= 0.85 ? 'excellent' : efficiency >= 0.75 ? 'good' : 'needs improvement'}</p>
        </div>
        
        <div class="result-improvements">
          <h4>Potential Improvements:</h4>
          <p><strong>Water savings:</strong> ${potentialSavings.toFixed(0)} gallons ${analysisPeriod}</p>
          <p><strong>Cost savings:</strong> $${costSavings.toFixed(2)} ${analysisPeriod}</p>
          <p>Better irrigation: Upgrade to ${efficiency < 0.85 ? 'drip system' : 'more efficient timers'}</p>
          <p>More mulch: Increase coverage to ${improvedMulch}%</p>
          <p>Soil improvement: Add compost to increase water retention</p>
        </div>
        
        ${rainfall > 0 ? `
        <div class="result-rainwater">
          <h4>Rainwater Harvesting Potential:</h4>
          <p><strong>Collectable rainwater:</strong> ${rainwaterPotential.toFixed(0)} gallons ${analysisPeriod}</p>
          <p><strong>Value:</strong> $${rainwaterValue.toFixed(2)} ${analysisPeriod}</p>
          <p>Roof collection area: ${roofArea.toLocaleString()} sq ft (estimated)</p>
          <p>Payback: Rain barrels pay for themselves in ${(200 / rainwaterValue).toFixed(1)} periods</p>
          <p>Environmental benefit: Reduces stormwater runoff</p>
        </div>
        ` : ''}
        
        <div class="result-schedule">
          <h4>Watering Schedule:</h4>
          <p>🌅 <strong>Best time:</strong> Early morning (5-9 AM)</p>
          <p>🕐 <strong>Frequency:</strong> ${getWateringFrequency(soilName, irrigationNeedInches)}</p>
          <p>⏱️ <strong>Duration:</strong> ${getWateringDuration(irrigationName, irrigationNeedInches)}</p>
          <p>🌡️ <strong>Adjust for weather:</strong> ${getWeatherAdjustments()}</p>
          <p>📅 <strong>Seasonal changes:</strong> ${getSeasonalTips()}</p>
        </div>
        
        <div class="result-conservation">
          <h4>Water Conservation Tips:</h4>
          <p>🌿 Mulch saves ${(mulchSavings * adjustedWaterNeed * gallonsPerInch * 52).toFixed(0)} gallons annually</p>
          <p>🌱 Native plants can reduce water needs by 50-70%</p>
          <p>🕐 Timer systems prevent overwatering and save 15-25%</p>
          <p>🌧️ Rain sensors automatically skip watering when it rains</p>
          <p>💧 Drip irrigation can save 30-50% compared to sprinklers</p>
        </div>
        
        <div class="result-plant-health">
          <h4>Plant Health Indicators:</h4>
          <p>✅ <strong>Proper watering signs:</strong> ${getHealthySigns()}</p>
          <p>⚠️ <strong>Overwatering signs:</strong> ${getOverwateringSigns()}</p>
          <p>🚨 <strong>Underwatering signs:</strong> ${getUnderwateringSigns()}</p>
          <p>🧪 <strong>Soil check:</strong> Moisture 4-6" deep indicates root zone health</p>
        </div>
        
        <div class="result-environmental">
          <h4>Environmental Impact:</h4>
          <p>🌍 Carbon footprint: ${co2Impact.toFixed(2)} kg CO₂ from water treatment</p>
          <p>💧 Water conservation helps preserve local water resources</p>
          <p>🌊 Efficient irrigation reduces runoff and erosion</p>
          <p>🐛 Proper watering supports beneficial soil organisms</p>
          <p>🌳 Healthy plants improve air quality and provide habitat</p>
        </div>
        
        <div class="result-troubleshooting">
          <h4>Common Issues & Solutions:</h4>
          <p>🏃 <strong>Runoff:</strong> ${getRunoffSolutions(soilName)}</p>
          <p>🦠 <strong>Disease prevention:</strong> ${getDiseasePrevention()}</p>
          <p>💸 <strong>High water bills:</strong> ${getHighBillSolutions()}</p>
          <p>🌡️ <strong>Heat stress:</strong> ${getHeatStressSolutions()}</p>
          <p>❄️ <strong>Winter preparation:</strong> ${getWinterPrep()}</p>
        </div>
        
        <div class="result-monitoring">
          <h4>Monitoring Your Garden:</h4>
          <p>📏 Use a rain gauge to track natural water input</p>
          <p>🌡️ Monitor soil moisture with a probe or finger test</p>
          <p>📱 Weather apps help predict rain and adjust schedules</p>
          <p>📊 Keep watering logs to optimize your schedule</p>
          <p>🎯 Adjust based on plant response and seasonal changes</p>
        </div>
      `;
    });
  }

  function getWateringFrequency(soilType, waterNeed) {
    if (soilType === 'clay') {
      return waterNeed > 1 ? '2-3 times per week (deep watering)' : '1-2 times per week';
    } else if (soilType === 'sandy') {
      return waterNeed > 1 ? 'Daily light watering or every other day' : '3-4 times per week';
    }
    return waterNeed > 1 ? '3-4 times per week' : '2-3 times per week';
  }

  function getWateringDuration(irrigationType, waterNeed) {
    const baseTimes = {
      'drip': Math.round(waterNeed * 60), // minutes
      'soaker': Math.round(waterNeed * 45),
      'sprinkler': Math.round(waterNeed * 30),
      'hand': Math.round(waterNeed * 20),
      'overhead': Math.round(waterNeed * 25)
    };
    return `${baseTimes[irrigationType] || 30} minutes per session`;
  }

  function getWeatherAdjustments() {
    return 'Skip watering if rain expected within 24 hours, increase 25% during heat waves';
  }

  function getSeasonalTips() {
    return 'Reduce watering 50% in fall, minimal in winter, increase gradually in spring';
  }

  function getHealthySigns() {
    return 'Vibrant color, steady growth, firm stems, no wilting during cool parts of day';
  }

  function getOverwateringSigns() {
    return 'Yellow leaves, fungal growth, soft stems, constantly wet soil surface';
  }

  function getUnderwateringSigns() {
    return 'Wilting, dry/crispy leaves, stunted growth, hard/cracked soil';
  }

  function getRunoffSolutions(soilType) {
    if (soilType === 'clay') {
      return 'Water slowly, add organic matter, consider drip irrigation';
    }
    return 'Create small berms, use mulch to slow water movement, improve soil structure';
  }

  function getDiseasePrevention() {
    return 'Water at soil level, avoid late evening watering, ensure good air circulation';
  }

  function getHighBillSolutions() {
    return 'Check for leaks, upgrade to efficient irrigation, increase mulch coverage';
  }

  function getHeatStressSolutions() {
    return 'Water early morning, provide afternoon shade, increase mulch thickness';
  }

  function getWinterPrep() {
    return 'Drain irrigation lines, protect tender plants, reduce watering frequency';
  }
});