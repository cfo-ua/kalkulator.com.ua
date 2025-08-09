document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('transportation-form');
  const result = document.getElementById('transportation-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const distance = parseFloat(document.getElementById('trip-distance').value);
      const tripsPerWeek = parseFloat(document.getElementById('trips-per-week').value);
      const transportMode = document.getElementById('transport-mode').value;
      const alternativeMode = document.getElementById('alternative-mode').value;
      const fuelPrice = parseFloat(document.getElementById('fuel-price').value);
      const electricityRate = parseFloat(document.getElementById('electricity-rate').value);
      const timePeriod = document.getElementById('time-period').value;
      
      if (distance <= 0 || tripsPerWeek <= 0 || !transportMode) {
        result.textContent = "Please fill in all required fields with valid values.";
        return;
      }
      
      // Parse transportation mode data
      const [modeName, co2PerMile, costPerMile, avgSpeedMph] = transportMode.split(',');
      const co2Grams = parseFloat(co2PerMile);
      const costBase = parseFloat(costPerMile);
      const avgSpeed = parseFloat(avgSpeedMph);
      
      // Calculate time multipliers
      const timeMultiplier = {
        'week': 1,
        'month': 4.33,
        'year': 52
      };
      
      const multiplier = timeMultiplier[timePeriod];
      const totalDistance = distance * tripsPerWeek * multiplier;
      
      // Calculate emissions
      const totalCO2Grams = totalDistance * co2Grams;
      const totalCO2Kg = totalCO2Grams / 1000;
      const totalCO2Tons = totalCO2Kg / 1000;
      
      // Calculate costs
      let totalCost = 0;
      if (modeName === 'gasoline' || modeName === 'diesel' || modeName === 'hybrid') {
        const mpg = modeName === 'hybrid' ? 50 : modeName === 'diesel' ? 35 : 25;
        const gallonsUsed = totalDistance / mpg;
        totalCost = gallonsUsed * fuelPrice;
      } else if (modeName === 'electric' || modeName === 'ebike') {
        const kwhPer100Miles = modeName === 'electric' ? 30 : 1.5;
        const kwhUsed = (totalDistance / 100) * kwhPer100Miles;
        totalCost = kwhUsed * electricityRate;
      } else if (modeName === 'bus' || modeName === 'train') {
        totalCost = totalDistance * costBase;
      }
      
      // Calculate time
      const totalTimeHours = avgSpeed > 0 ? totalDistance / avgSpeed : 0;
      const travelTimePerTrip = avgSpeed > 0 ? (distance / avgSpeed) * 60 : 0; // minutes
      
      // Calculate health benefits (calories burned for active transportation)
      let caloriesBurned = 0;
      if (modeName === 'walk') {
        caloriesBurned = totalDistance * 60; // ~60 calories per mile walking
      } else if (modeName === 'bicycle') {
        caloriesBurned = totalDistance * 40; // ~40 calories per mile cycling
      }
      
      // Calculate alternative mode if selected
      let alternativeData = null;
      if (alternativeMode) {
        const [altName, altCO2, altCost, altSpeed] = alternativeMode.split(',');
        const altCO2Total = totalDistance * parseFloat(altCO2);
        const altCO2Kg = altCO2Total / 1000;
        
        let altTotalCost = 0;
        if (altName === 'gasoline' || altName === 'diesel' || altName === 'hybrid') {
          const mpg = altName === 'hybrid' ? 50 : altName === 'diesel' ? 35 : 25;
          const gallons = totalDistance / mpg;
          altTotalCost = gallons * fuelPrice;
        } else if (altName === 'electric' || altName === 'ebike') {
          const kwhPer100 = altName === 'electric' ? 30 : 1.5;
          const kwh = (totalDistance / 100) * kwhPer100;
          altTotalCost = kwh * electricityRate;
        } else if (altName === 'bus' || altName === 'train') {
          altTotalCost = totalDistance * parseFloat(altCost);
        }
        
        alternativeData = {
          name: altName,
          co2Kg: altCO2Kg,
          cost: altTotalCost,
          co2Savings: altCO2Kg - totalCO2Kg,
          costSavings: altTotalCost - totalCost
        };
      }
      
      // Environmental equivalents
      const treesNeeded = totalCO2Kg / 22; // Average tree absorbs ~22kg CO2/year
      const coalEquivalent = totalCO2Kg / 2.3; // ~2.3kg CO2 per kg coal
      const gasEquivalent = totalCO2Kg / 2.3; // ~2.3kg CO2 per liter gasoline
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Transportation Analysis (${timePeriod}):</h4>
          <p>Mode: ${modeName.charAt(0).toUpperCase() + modeName.slice(1)}</p>
          <p>Distance per trip: ${distance} miles</p>
          <p>Trips per week: ${tripsPerWeek}</p>
          <p>Total distance: ${totalDistance.toFixed(1)} miles</p>
          ${avgSpeed > 0 ? `<p>Travel time per trip: ${travelTimePerTrip.toFixed(1)} minutes</p>` : ''}
        </div>
        
        <div class="result-emissions">
          <h4>Carbon Emissions:</h4>
          <p><strong>${totalCO2Kg.toFixed(2)} kg CO₂</strong> (${totalCO2Tons.toFixed(3)} tons)</p>
          <p>Per mile: ${co2Grams.toFixed(0)} grams CO₂</p>
          <p>Per trip: ${(distance * co2Grams / 1000).toFixed(2)} kg CO₂</p>
          ${totalCO2Kg > 0 ? `<p>Equivalent to burning ${coalEquivalent.toFixed(1)} kg of coal</p>` : '<p>🌱 Zero direct emissions - great choice!</p>'}
        </div>
        
        <div class="result-cost">
          <h4>Cost Analysis:</h4>
          <p><strong>Total cost: $${totalCost.toFixed(2)}</strong></p>
          <p>Cost per mile: $${(totalCost / totalDistance).toFixed(3)}</p>
          <p>Cost per trip: $${(totalCost / (tripsPerWeek * multiplier)).toFixed(2)}</p>
          ${totalCost === 0 ? '<p>💰 Free transportation - saves money!</p>' : ''}
        </div>
        
        ${alternativeData ? `
        <div class="result-comparison">
          <h4>Comparison with ${alternativeData.name.charAt(0).toUpperCase() + alternativeData.name.slice(1)}:</h4>
          <p><strong>CO₂ difference:</strong> ${alternativeData.co2Savings > 0 ? 
            `${alternativeData.co2Savings.toFixed(2)} kg MORE emissions` : 
            `${Math.abs(alternativeData.co2Savings).toFixed(2)} kg LESS emissions`}</p>
          <p><strong>Cost difference:</strong> ${alternativeData.costSavings > 0 ? 
            `$${alternativeData.costSavings.toFixed(2)} MORE expensive` : 
            `$${Math.abs(alternativeData.costSavings).toFixed(2)} LESS expensive`}</p>
          <p>Environmental impact: ${alternativeData.co2Savings > 0 ? '🌱 Current choice is better' : '⚠️ Alternative is more eco-friendly'}</p>
        </div>
        ` : ''}
        
        <div class="result-environmental">
          <h4>Environmental Context:</h4>
          ${totalCO2Kg > 0 ? `
            <p>🌳 Trees needed to offset: ${treesNeeded.toFixed(1)} trees for one year</p>
            <p>🏭 Equivalent to: ${gasEquivalent.toFixed(1)} liters of gasoline</p>
            <p>🌍 Global impact: Transportation is 14% of global emissions</p>
          ` : `
            <p>🌱 Zero emissions - you're helping fight climate change!</p>
            <p>🌍 Every zero-emission mile counts toward sustainability</p>
          `}
          <p>🏙️ Local air quality: ${getAirQualityImpact(modeName)}</p>
        </div>
        
        ${caloriesBurned > 0 ? `
        <div class="result-health">
          <h4>Health Benefits:</h4>
          <p><strong>Calories burned: ${caloriesBurned.toFixed(0)} calories</strong></p>
          <p>Exercise equivalent: ${(caloriesBurned / 100).toFixed(1)} hours of moderate activity</p>
          <p>Health value: ~$${(caloriesBurned * 0.05).toFixed(2)} in healthcare savings</p>
          <p>💪 Active transportation improves cardiovascular health</p>
          <p>🧠 Regular exercise enhances mental well-being</p>
        </div>
        ` : ''}
        
        <div class="result-recommendations">
          <h4>Recommendations:</h4>
          ${getRecommendations(modeName, distance, totalCO2Kg).map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-tips">
          <h4>Improvement Tips:</h4>
          ${getImprovementTips(modeName, distance).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>Seasonal Considerations:</h4>
          <p>☀️ Summer: Consider heat, air conditioning impact on efficiency</p>
          <p>❄️ Winter: Cold weather reduces vehicle efficiency, dress warmly for active transport</p>
          <p>🌧️ Rain: Have backup plans, waterproof gear for cycling/walking</p>
          <p>🍂 Fall/Spring: Ideal weather for active transportation</p>
        </div>
        
        <div class="result-offset">
          <h4>Carbon Offset Options:</h4>
          ${totalCO2Kg > 0 ? `
            <p>💰 Offset cost: ~$${(totalCO2Kg * 0.02).toFixed(2)} (at $20/ton CO₂)</p>
            <p>🌳 Tree planting: Plant ${Math.ceil(treesNeeded)} trees</p>
            <p>⚡ Renewable energy: Support clean energy projects</p>
            <p>🏠 Home efficiency: Improve insulation, LED lights</p>
          ` : `
            <p>🌱 No offsets needed - you're already carbon neutral for transport!</p>
            <p>🌟 Consider supporting others to adopt clean transportation</p>
          `}
        </div>
        
        <div class="result-longterm">
          <h4>Long-term Impact:</h4>
          <p>📊 Annual CO₂: ${(totalCO2Kg * (52 / multiplier)).toFixed(1)} kg per year</p>
          <p>💵 Annual cost: $${(totalCost * (52 / multiplier)).toFixed(0)} per year</p>
          <p>🌍 Lifetime impact: Consider total environmental footprint</p>
          <p>📈 Trend: Transportation emissions are changing with technology</p>
          <p>🎯 Goal: Aim for continuous improvement in sustainability</p>
        </div>
      `;
    });
  }

  function getAirQualityImpact(mode) {
    const impacts = {
      'walk': 'No local pollutants - improves air quality',
      'bicycle': 'No local pollutants - improves air quality', 
      'ebike': 'Minimal local impact - very clean',
      'electric': 'No local pollutants - cleaner city air',
      'bus': 'Shared emissions - better than individual cars',
      'train': 'Very low per-person local impact',
      'hybrid': 'Reduced local pollutants vs conventional cars',
      'gasoline': 'Produces NOx, CO, particulates affecting local air',
      'diesel': 'Higher NOx and particulates than gasoline',
      'motorcycle': 'Lower total emissions but less efficient per passenger'
    };
    return impacts[mode] || 'Varies by specific vehicle and conditions';
  }

  function getRecommendations(mode, distance, co2Kg) {
    const recommendations = [];
    
    if (distance <= 1 && mode !== 'walk') {
      recommendations.push('🚶 Consider walking for trips under 1 mile');
    }
    
    if (distance <= 3 && mode !== 'bicycle' && mode !== 'walk') {
      recommendations.push('🚴 Cycling could be faster and cleaner for this distance');
    }
    
    if (mode === 'gasoline' || mode === 'diesel') {
      recommendations.push('⚡ Consider an electric or hybrid vehicle for regular trips');
      recommendations.push('🚌 Check if public transit is available for this route');
    }
    
    if (co2Kg > 100) {
      recommendations.push('🌱 High emissions - consider combining trips or alternative modes');
    }
    
    recommendations.push('📱 Use apps to find the most efficient routes and modes');
    
    return recommendations;
  }

  function getImprovementTips(mode, distance) {
    const tips = [];
    
    if (mode === 'gasoline' || mode === 'diesel') {
      tips.push('⛽ Maintain your vehicle: proper tire pressure, regular tune-ups');
      tips.push('🚗 Combine errands into one trip when possible');
      tips.push('🏃 Use eco-driving techniques: gentle acceleration, maintain steady speed');
    }
    
    if (mode === 'electric') {
      tips.push('☀️ Charge with renewable energy if available');
      tips.push('🔋 Pre-condition the battery in extreme weather');
    }
    
    tips.push('📅 Plan trips to avoid peak traffic and reduce idling');
    tips.push('👥 Consider carpooling to share emissions with others');
    tips.push('🏠 Choose to live closer to work and amenities when possible');
    
    return tips;
  }
});