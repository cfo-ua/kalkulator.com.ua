document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('herb-yield-form');
  const result = document.getElementById('herb-yield-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const gardenType = document.getElementById('garden-type').value;
      const gardenSize = document.getElementById('garden-size').value;
      const herbSelection = Array.from(document.getElementById('herb-selection').selectedOptions).map(option => option.value);
      const experienceLevel = document.getElementById('experience-level').value;
      const seasonLength = document.getElementById('season-length').value;
      const maintenanceLevel = document.getElementById('maintenance-level').value;
      const herbUsage = document.getElementById('herb-usage').value;
      const successionPlanting = document.getElementById('succession-planting').value;
      
      if (!gardenType || !gardenSize || herbSelection.length === 0 || !experienceLevel || !seasonLength || !maintenanceLevel || !herbUsage || !successionPlanting) {
        result.textContent = "Please fill in all fields and select at least one herb.";
        return;
      }
      
      // Parse input data
      const [gardenTypeName, gardenMultiplier] = gardenType.split(',');
      const [sizeName, plantCapacity] = gardenSize.split(',');
      const [expLevel, expMultiplier] = experienceLevel.split(',');
      const [seasonName, seasonMultiplier] = seasonLength.split(',');
      const [maintLevel, maintMultiplier] = maintenanceLevel.split(',');
      const [usageLevel, usageMultiplier] = herbUsage.split(',');
      const [successionLevel, successionMultiplier] = successionPlanting.split(',');
      
      const gardenFactor = parseFloat(gardenMultiplier);
      const capacity = parseInt(plantCapacity);
      const expFactor = parseFloat(expMultiplier);
      const seasonFactor = parseFloat(seasonMultiplier);
      const maintFactor = parseFloat(maintMultiplier);
      const usageFactor = parseFloat(usageMultiplier);
      const successionFactor = parseFloat(successionMultiplier);
      
      // Calculate plants per herb type
      const plantsPerHerb = Math.floor(capacity / herbSelection.length);
      const totalPlants = plantsPerHerb * herbSelection.length;
      
      // Calculate yields for each herb
      const herbYields = [];
      let totalWeeklyYield = 0;
      let totalSeasonYield = 0;
      let totalCostSavings = 0;
      
      herbSelection.forEach(herbData => {
        const [herbName, weeklyYieldPerPlant, seasonLength] = herbData.split(',');
        const baseWeeklyYield = parseFloat(weeklyYieldPerPlant);
        const weeks = parseInt(seasonLength);
        
        // Apply all multipliers
        const adjustedWeeklyYield = baseWeeklyYield * plantsPerHerb * gardenFactor * expFactor * seasonFactor * maintFactor * successionFactor;
        const adjustedSeasonLength = weeks * seasonFactor;
        const seasonYield = adjustedWeeklyYield * adjustedSeasonLength;
        
        // Calculate cost savings (fresh herbs average $3 per 0.25 cup package)
        const packagesPerWeek = adjustedWeeklyYield / 0.25;
        const weeklySavings = packagesPerWeek * 3;
        const seasonSavings = weeklySavings * adjustedSeasonLength;
        
        herbYields.push({
          name: herbName,
          plantsCount: plantsPerHerb,
          weeklyYield: adjustedWeeklyYield,
          seasonYield: seasonYield,
          seasonLength: adjustedSeasonLength,
          weeklySavings: weeklySavings,
          seasonSavings: seasonSavings
        });
        
        totalWeeklyYield += adjustedWeeklyYield;
        totalSeasonYield += seasonYield;
        totalCostSavings += seasonSavings;
      });
      
      // Calculate preservation yields
      const driedHerbYield = totalSeasonYield * 0.25; // 1:4 ratio fresh to dried
      const frozenHerbYield = totalSeasonYield * 0.8; // 80% retention when frozen
      
      // Calculate garden efficiency
      const yieldPerPlant = totalSeasonYield / totalPlants;
      const yieldPerSqFt = totalSeasonYield / (capacity * 0.5); // Estimate 0.5 sq ft per plant
      
      // Generate recommendations
      const recommendations = getRecommendations(herbYields, usageLevel, gardenTypeName);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Herb Garden Yield Estimate:</h4>
          <p>Garden: ${sizeName} ${gardenTypeName} garden</p>
          <p>Total plants: ${totalPlants} (${plantsPerHerb} per herb type)</p>
          <p>Growing season: ${seasonName}</p>
          <p>Experience level: ${expLevel}</p>
        </div>
        
        <div class="result-yields">
          <h4>Expected Yields:</h4>
          <p><strong>Weekly harvest: ${totalWeeklyYield.toFixed(2)} cups fresh herbs</strong></p>
          <p><strong>Season total: ${totalSeasonYield.toFixed(1)} cups fresh herbs</strong></p>
          <p>Daily average: ${(totalWeeklyYield / 7).toFixed(2)} cups</p>
          <p>Yield per plant: ${yieldPerPlant.toFixed(2)} cups per season</p>
        </div>
        
        <div class="result-by-herb">
          <h4>Yield by Herb Type:</h4>
          ${herbYields.map(herb => `
            <div class="herb-details">
              <p><strong>${herb.name.charAt(0).toUpperCase() + herb.name.slice(1)}:</strong></p>
              <p>• ${herb.plantsCount} plants</p>
              <p>• ${herb.weeklyYield.toFixed(2)} cups/week for ${Math.round(herb.seasonLength)} weeks</p>
              <p>• Season total: ${herb.seasonYield.toFixed(1)} cups</p>
              <p>• Savings: $${herb.seasonSavings.toFixed(0)}/season</p>
            </div>
          `).join('')}
        </div>
        
        <div class="result-preservation">
          <h4>Preservation Yields:</h4>
          <p><strong>If dried:</strong> ${driedHerbYield.toFixed(1)} cups dried herbs</p>
          <p><strong>If frozen:</strong> ${frozenHerbYield.toFixed(1)} cups frozen herbs</p>
          <p>Herb salt potential: ${(totalSeasonYield * 2).toFixed(1)} cups herb salt</p>
          <p>Oil infusions: ${Math.floor(totalSeasonYield / 2)} cups herb-infused oil</p>
        </div>
        
        <div class="result-economics">
          <h4>Economic Analysis:</h4>
          <p><strong>Total cost savings: $${totalCostSavings.toFixed(0)} per season</strong></p>
          <p>Weekly savings: $${(totalCostSavings / (herbYields[0]?.seasonLength || 20)).toFixed(0)}</p>
          <p>Cost per cup produced: $${(50 / totalSeasonYield).toFixed(2)} (estimated)</p>
          <p>Return on investment: ${((totalCostSavings / 100) * 100).toFixed(0)}% (vs. $100 setup)</p>
          <p>Break-even time: ${Math.ceil(100 / (totalCostSavings / (herbYields[0]?.seasonLength || 20)))} weeks</p>
        </div>
        
        <div class="result-harvest-schedule">
          <h4>Harvest Schedule:</h4>
          <p>🌱 <strong>Start harvesting:</strong> ${getHarvestStart()}</p>
          <p>⏰ <strong>Harvest frequency:</strong> ${getHarvestFrequency(maintLevel)}</p>
          <p>✂️ <strong>Best time:</strong> ${getBestHarvestTime()}</p>
          <p>📅 <strong>Peak production:</strong> ${getPeakProduction(seasonName)}</p>
          <p>🔄 <strong>Succession planting:</strong> ${getSuccessionAdvice(successionLevel)}</p>
        </div>
        
        <div class="result-growing-tips">
          <h4>Growing Tips for Maximum Yield:</h4>
          ${getGrowingTips(gardenTypeName, expLevel).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-harvest-tips">
          <h4>Harvesting Best Practices:</h4>
          <p>✂️ <strong>Cut method:</strong> ${getCuttingAdvice()}</p>
          <p>🌸 <strong>Flower management:</strong> ${getFlowerAdvice()}</p>
          <p>🌅 <strong>Timing:</strong> ${getTimingAdvice()}</p>
          <p>💧 <strong>Post-harvest:</strong> ${getPostHarvestAdvice()}</p>
        </div>
        
        <div class="result-preservation-guide">
          <h4>Preservation Methods:</h4>
          ${getPreservationMethods().map(method => `<p>${method}</p>`).join('')}
        </div>
        
        <div class="result-planning">
          <h4>Garden Planning Recommendations:</h4>
          ${recommendations.map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>Seasonal Management:</h4>
          <p>🌱 <strong>Spring:</strong> ${getSpringAdvice()}</p>
          <p>☀️ <strong>Summer:</strong> ${getSummerAdvice()}</p>
          <p>🍂 <strong>Fall:</strong> ${getFallAdvice()}</p>
          <p>❄️ <strong>Winter:</strong> ${getWinterAdvice(gardenTypeName)}</p>
        </div>
        
        <div class="result-troubleshooting">
          <h4>Common Issues & Solutions:</h4>
          <p>🐛 <strong>Pests:</strong> ${getPestSolutions()}</p>
          <p>🦠 <strong>Diseases:</strong> ${getDiseaseSolutions()}</p>
          <p>📉 <strong>Low yields:</strong> ${getLowYieldSolutions()}</p>
          <p>🥀 <strong>Plant decline:</strong> ${getPlantDeclineSolutions()}</p>
        </div>
        
        <div class="result-expansion">
          <h4>Garden Expansion Ideas:</h4>
          <p>📈 <strong>Next season:</strong> ${getExpansionAdvice(totalSeasonYield, usageLevel)}</p>
          <p>🌿 <strong>New herbs to try:</strong> ${getNewHerbSuggestions(herbSelection)}</p>
          <p>🏠 <strong>Indoor growing:</strong> ${getIndoorOptions()}</p>
          <p>🎁 <strong>Sharing/selling:</strong> ${getSharingAdvice(totalCostSavings)}</p>
        </div>
      `;
    });
  }

  function getRecommendations(herbYields, usageLevel, gardenType) {
    const recommendations = [];
    
    const totalYield = herbYields.reduce((sum, herb) => sum + herb.seasonYield, 0);
    
    if (usageLevel === 'light' && totalYield > 10) {
      recommendations.push('💡 Consider reducing garden size or focus on preservation methods');
    }
    
    if (usageLevel === 'heavy' && totalYield < 20) {
      recommendations.push('📈 Consider expanding garden or adding more productive herbs');
    }
    
    if (gardenType === 'indoor') {
      recommendations.push('🌿 Supplement with cut-and-come-again herbs like chives and parsley');
    }
    
    recommendations.push('🌱 Start with 2-3 herb types initially, expand as you gain experience');
    recommendations.push('📅 Plan succession plantings every 3-4 weeks for continuous harvest');
    
    return recommendations;
  }

  function getHarvestStart() {
    return 'When plants reach 4-6 inches tall (4-8 weeks after planting)';
  }

  function getHarvestFrequency(maintLevel) {
    const frequencies = {
      'minimal': 'Weekly harvests',
      'regular': '2-3 times per week',
      'intensive': 'Daily harvesting possible'
    };
    return frequencies[maintLevel] || 'Weekly harvests';
  }

  function getBestHarvestTime() {
    return 'Early morning after dew dries, before 10 AM for best flavor';
  }

  function getPeakProduction(season) {
    const peaks = {
      'short': 'Mid to late summer (July-August)',
      'medium': 'Mid-summer through early fall (June-September)',
      'long': 'Late spring through mid-fall (May-October)',
      'year-round': 'Continuous production with seasonal peaks'
    };
    return peaks[season] || 'Mid-summer';
  }

  function getSuccessionAdvice(level) {
    const advice = {
      'none': 'Consider succession planting for continuous harvest',
      'limited': 'Plant cilantro and basil every 3-4 weeks',
      'full': 'Excellent approach for continuous production'
    };
    return advice[level] || 'Plant every 3-4 weeks for best results';
  }

  function getGrowingTips(gardenType, expLevel) {
    const tips = [];
    
    if (gardenType === 'containers') {
      tips.push('🪴 Use containers at least 6-8 inches deep for herbs');
      tips.push('💧 Check soil moisture daily - containers dry out faster');
    }
    
    if (gardenType === 'indoor') {
      tips.push('💡 Provide 6+ hours of bright light or grow lights');
      tips.push('🌡️ Maintain 65-75°F for optimal growth');
    }
    
    if (expLevel === 'beginner') {
      tips.push('🌱 Start with easy herbs: basil, chives, parsley, mint');
      tips.push('📖 Keep a garden journal to track what works');
    }
    
    tips.push('☀️ Most herbs need 6+ hours of direct sunlight daily');
    tips.push('💧 Water when top inch of soil feels dry');
    tips.push('🌿 Regular harvesting encourages bushier growth');
    
    return tips;
  }

  function getCuttingAdvice() {
    return 'Cut stems just above a leaf pair, never more than 1/3 of plant at once';
  }

  function getFlowerAdvice() {
    return 'Pinch off flower buds to encourage leaf production (except when saving seeds)';
  }

  function getTimingAdvice() {
    return 'Harvest before flowering for best flavor, oils are most concentrated in morning';
  }

  function getPostHarvestAdvice() {
    return 'Use immediately, store in water, or process within 2 hours of harvest';
  }

  function getPreservationMethods() {
    return [
      '🌬️ Air drying: hang bundles in warm, dry, dark place',
      '❄️ Freezing: chop and freeze in ice cube trays with oil',
      '🧂 Herb salt: mix 4:1 salt to fresh herbs, store in fridge',
      '🫒 Oil infusions: submerge herbs in oil, strain after 2 weeks',
      '🥶 Freeze-drying: maintains color and flavor better than air drying'
    ];
  }

  function getSpringAdvice() {
    return 'Start seeds indoors, prepare beds, plant after last frost';
  }

  function getSummerAdvice() {
    return 'Harvest regularly, provide shade in extreme heat, maintain consistent watering';
  }

  function getFallAdvice() {
    return 'Final heavy harvest, start preservation, plant winter herbs indoors';
  }

  function getWinterAdvice(gardenType) {
    if (gardenType === 'indoor') {
      return 'Continue growing with supplemental lighting';
    }
    return 'Plan next year\'s garden, use preserved herbs, maintain indoor plants';
  }

  function getPestSolutions() {
    return 'Companion plant with marigolds, hand-pick pests, use insecticidal soap';
  }

  function getDiseaseSolutions() {
    return 'Ensure good air circulation, avoid overhead watering, remove affected plants';
  }

  function getLowYieldSolutions() {
    return 'Check soil fertility, increase light exposure, harvest more frequently';
  }

  function getPlantDeclineSolutions() {
    return 'Check for root bound plants, improve drainage, consider succession planting';
  }

  function getExpansionAdvice(totalYield, usageLevel) {
    if (usageLevel === 'heavy' || totalYield < 15) {
      return 'Consider doubling garden size or adding more productive varieties';
    }
    return 'Current size seems appropriate, focus on improving yields';
  }

  function getNewHerbSuggestions(currentHerbs) {
    const allHerbs = ['basil', 'parsley', 'cilantro', 'chives', 'rosemary', 'thyme', 'oregano', 'sage', 'mint', 'dill'];
    const suggested = allHerbs.filter(herb => !currentHerbs.some(current => current.includes(herb)));
    return suggested.slice(0, 3).join(', ') || 'Tarragon, lavender, lemon balm';
  }

  function getIndoorOptions() {
    return 'Windowsill gardens, grow lights setup, hydroponic systems for year-round production';
  }

  function getSharingAdvice(savings) {
    if (savings > 200) {
      return 'Excess production ideal for farmers markets or sharing with neighbors';
    }
    return 'Perfect amount for family use with some sharing opportunities';
  }
});