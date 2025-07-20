document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('crop-planting-form');
  const result = document.getElementById('crop-planting-result');
  const locationSelect = document.getElementById('location-zone');
  const customDatesDiv = document.getElementById('custom-dates');

  // Set current date as default
  const today = new Date();
  document.getElementById('current-date').value = today.toISOString().split('T')[0];

  // Handle custom dates visibility
  if (locationSelect) {
    locationSelect.addEventListener('change', function() {
      if (this.value === 'custom') {
        customDatesDiv.style.display = 'block';
      } else {
        customDatesDiv.style.display = 'none';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const location = document.getElementById('location-zone').value;
      const cropInfo = document.getElementById('crop-type').value;
      const plantingMethod = document.getElementById('planting-method').value;
      const succession = document.getElementById('succession-planting').value;
      const currentDate = new Date(document.getElementById('current-date').value);
      
      if (!location || !cropInfo) {
        result.textContent = "Please select location and crop type.";
        return;
      }
      
      // Additional validation for location format
      if (location !== 'custom' && !location.includes(',')) {
        result.textContent = "Invalid location format selected.";
        return;
      }
      
      // Parse crop information
      const [cropName, daysToMaturity, temperatureType, weeksFromFrost] = cropInfo.split(',');
      const maturityDays = parseInt(daysToMaturity);
      const frostOffset = parseInt(weeksFromFrost);
      
      // Get frost dates
      let lastSpringFrost, firstFallFrost, zone = 'custom'; // Initialize with default value
      
      if (location === 'custom') {
        lastSpringFrost = new Date(document.getElementById('custom-spring-frost').value);
        firstFallFrost = new Date(document.getElementById('custom-fall-frost').value);
        zone = 'custom';
      } else {
        // Use zone-based frost dates (approximate)
        zone = location.split(',')[0];
        const frostDates = getZoneFrostDates(zone);
        lastSpringFrost = frostDates.spring;
        firstFallFrost = frostDates.fall;
      }
      
      // Calculate planting dates
      const springPlantDate = new Date(lastSpringFrost);
      springPlantDate.setDate(springPlantDate.getDate() + (frostOffset * 7));
      
      // Indoor seed starting date (if transplanting)
      const seedStartDate = new Date(springPlantDate);
      if (plantingMethod === 'transplant') {
        seedStartDate.setDate(seedStartDate.getDate() - 42); // 6 weeks earlier
      }
      
      // Fall planting date (work backwards from fall frost)
      const fallPlantDate = new Date(firstFallFrost);
      fallPlantDate.setDate(fallPlantDate.getDate() - maturityDays - 14); // 2 weeks buffer
      
      // Calculate succession planting dates
      const successionDates = [];
      let nextPlantDate = new Date(springPlantDate);
      const maxPlantDate = new Date(fallPlantDate);
      
      const intervalDays = {
        'single': null,
        '2weeks': 14,
        '3weeks': 21,
        'monthly': 30
      };
      
      if (succession !== 'single') {
        while (nextPlantDate <= maxPlantDate) {
          successionDates.push(new Date(nextPlantDate));
          nextPlantDate.setDate(nextPlantDate.getDate() + intervalDays[succession]);
        }
      }
      
      // Calculate harvest dates
      const firstHarvest = new Date(springPlantDate);
      firstHarvest.setDate(firstHarvest.getDate() + maturityDays);
      
      const lastHarvest = new Date(fallPlantDate);
      lastHarvest.setDate(lastHarvest.getDate() + maturityDays);
      
      // Determine planting status
      const plantingStatus = getPlantingStatus(currentDate, springPlantDate, fallPlantDate, seedStartDate, plantingMethod);
      
      // Get climate-specific tips
      const climateTips = getClimateTips(temperatureType, zone || 'custom');
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Planting Schedule for ${cropName.charAt(0).toUpperCase() + cropName.slice(1)}:</h4>
          <p>Climate zone: ${location.split(',')[0] || 'Custom'}</p>
          <p>Days to maturity: ${maturityDays} days</p>
          <p>Temperature preference: ${temperatureType}</p>
          <p>Planting method: ${plantingMethod === 'direct' ? 'Direct seeding' : 'Indoor start + transplant'}</p>
        </div>
        
        <div class="result-dates">
          <h4>Key Dates:</h4>
          <p><strong>Last spring frost:</strong> ${formatDate(lastSpringFrost)}</p>
          <p><strong>First fall frost:</strong> ${formatDate(firstFallFrost)}</p>
          ${plantingMethod === 'transplant' ? `<p><strong>Start seeds indoors:</strong> ${formatDate(seedStartDate)}</p>` : ''}
          <p><strong>Spring planting date:</strong> ${formatDate(springPlantDate)}</p>
          <p><strong>Fall planting date:</strong> ${formatDate(fallPlantDate)}</p>
        </div>
        
        <div class="result-status">
          <h4>Current Status:</h4>
          <p>${plantingStatus.message}</p>
          <p>${plantingStatus.action}</p>
          <p><strong>Days until next planting window:</strong> ${plantingStatus.daysToNext}</p>
        </div>
        
        <div class="result-harvest">
          <h4>Harvest Timeline:</h4>
          <p><strong>First harvest:</strong> ${formatDate(firstHarvest)}</p>
          <p><strong>Last possible harvest:</strong> ${formatDate(lastHarvest)}</p>
          <p>Growing season: ${Math.floor((firstFallFrost - lastSpringFrost) / (1000 * 60 * 60 * 24))} days</p>
          <p>Harvest window: ${Math.floor((lastHarvest - firstHarvest) / (1000 * 60 * 60 * 24))} days</p>
        </div>
        
        ${succession !== 'single' ? `
        <div class="result-succession">
          <h4>Succession Planting Schedule:</h4>
          <p>Planting interval: ${succession.replace('weeks', ' weeks').replace('monthly', 'monthly')}</p>
          <p><strong>Planting dates:</strong></p>
          <ul>
            ${successionDates.slice(0, 6).map((date, index) => 
              `<li>Planting ${index + 1}: ${formatDate(date)}</li>`
            ).join('')}
            ${successionDates.length > 6 ? `<li>...and ${successionDates.length - 6} more plantings</li>` : ''}
          </ul>
          <p>Total plantings: ${successionDates.length}</p>
        </div>
        ` : ''}
        
        <div class="result-climate">
          <h4>Climate-Specific Tips:</h4>
          ${climateTips.map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-planting-tips">
          <h4>Planting Guidelines:</h4>
          <p>🌡️ Soil temperature: ${getSoilTempRecommendation(temperatureType)}</p>
          <p>💧 Soil moisture: Keep consistently moist but not waterlogged</p>
          <p>☀️ Sun requirements: ${getSunRequirements(cropName)}</p>
          <p>📏 Planting depth: ${getPlantingDepth(cropName)}</p>
          <p>🌱 Germination time: ${getGerminationTime(cropName)}</p>
        </div>
        
        <div class="result-protection">
          <h4>Weather Protection:</h4>
          <p>❄️ Frost protection: ${getFrostProtection(temperatureType)}</p>
          <p>🌡️ Heat protection: ${getHeatProtection(temperatureType)}</p>
          <p>🌧️ Rain protection: Use row covers during heavy rain periods</p>
          <p>💨 Wind protection: Stake tall plants, use windbreaks</p>
        </div>
        
        <div class="result-troubleshooting">
          <h4>Common Issues:</h4>
          <p>🐛 Pest timing: ${getPestTiming(cropName)}</p>
          <p>🦠 Disease prevention: ${getDiseasePreention(temperatureType)}</p>
          <p>📅 Late planting: ${getLatePlantingAdvice(maturityDays)}</p>
          <p>🌡️ Weather delays: ${getWeatherDelayAdvice()}</p>
        </div>
        
        <div class="result-records">
          <h4>Record Keeping:</h4>
          <p>📝 Track actual planting dates for your location</p>
          <p>🌡️ Monitor soil and air temperatures</p>
          <p>📊 Note yields and harvest dates</p>
          <p>🎯 Adjust timing based on results</p>
          <p>📱 Use garden journal or app to track progress</p>
        </div>
      `;
    });
  }

  function getZoneFrostDates(zone) {
    const currentYear = new Date().getFullYear();
    const zoneDates = {
      '3a': { spring: new Date(currentYear, 4, 30), fall: new Date(currentYear, 8, 10) }, // May 30, Sept 10
      '3b': { spring: new Date(currentYear, 4, 25), fall: new Date(currentYear, 8, 15) },
      '4a': { spring: new Date(currentYear, 4, 20), fall: new Date(currentYear, 8, 20) },
      '4b': { spring: new Date(currentYear, 4, 15), fall: new Date(currentYear, 8, 25) },
      '5a': { spring: new Date(currentYear, 4, 10), fall: new Date(currentYear, 8, 30) },
      '5b': { spring: new Date(currentYear, 4, 5), fall: new Date(currentYear, 9, 5) },
      '6a': { spring: new Date(currentYear, 3, 30), fall: new Date(currentYear, 9, 15) },
      '6b': { spring: new Date(currentYear, 3, 25), fall: new Date(currentYear, 9, 25) },
      '7a': { spring: new Date(currentYear, 3, 20), fall: new Date(currentYear, 10, 5) },
      '7b': { spring: new Date(currentYear, 3, 15), fall: new Date(currentYear, 10, 15) },
      '8a': { spring: new Date(currentYear, 3, 10), fall: new Date(currentYear, 10, 25) },
      '8b': { spring: new Date(currentYear, 3, 5), fall: new Date(currentYear, 11, 5) },
      '9a': { spring: new Date(currentYear, 2, 20), fall: new Date(currentYear, 11, 15) },
      '9b': { spring: new Date(currentYear, 2, 10), fall: new Date(currentYear, 11, 30) },
      '10a': { spring: new Date(currentYear, 0, 1), fall: new Date(currentYear, 11, 31) }
    };
    return zoneDates[zone] || { spring: new Date(currentYear, 4, 15), fall: new Date(currentYear, 9, 15) };
  }

  function getPlantingStatus(currentDate, springDate, fallDate, seedDate, method) {
    const msInDay = 1000 * 60 * 60 * 24;
    
    if (method === 'transplant' && currentDate < seedDate) {
      const daysToSeed = Math.ceil((seedDate - currentDate) / msInDay);
      return {
        message: "Too early to start seeds indoors",
        action: "Wait until seed starting date",
        daysToNext: daysToSeed
      };
    } else if (currentDate < springDate) {
      const daysToPlant = Math.ceil((springDate - currentDate) / msInDay);
      return {
        message: "Spring planting window approaching",
        action: method === 'transplant' ? "Start seeds indoors now if not already done" : "Prepare garden beds",
        daysToNext: daysToPlant
      };
    } else if (currentDate <= fallDate) {
      return {
        message: "Currently in planting season",
        action: "Good time to plant - check specific variety requirements",
        daysToNext: 0
      };
    } else {
      return {
        message: "Planting season has ended",
        action: "Plan for next year or try season extension methods",
        daysToNext: "Next spring"
      };
    }
  }

  function getClimateTips(tempType, zone) {
    const tips = [];
    
    if (tempType === 'hardy') {
      tips.push("❄️ Can tolerate frost - plant early for best quality");
      tips.push("🌡️ Prefers cool weather, may bolt in heat");
    } else if (tempType === 'cool') {
      tips.push("🌡️ Needs cool weather but protect from hard frost");
      tips.push("🌱 Plant early spring or fall for best results");
    } else if (tempType === 'warm') {
      tips.push("☀️ Needs warm soil and air temperatures");
      tips.push("❄️ Very sensitive to frost - wait until soil warms");
    } else if (tempType === 'hot') {
      tips.push("🔥 Thrives in hot weather, needs very warm soil");
      tips.push("💧 May need extra water during hottest periods");
    }
    
    if (zone && (zone.includes('3') || zone.includes('4'))) {
      tips.push("🧊 Short growing season - choose fast-maturing varieties");
      tips.push("🏠 Consider season extension with cold frames or greenhouses");
    }
    
    return tips;
  }

  function getSoilTempRecommendation(tempType) {
    const temps = {
      'hardy': '35-45°F (can germinate in cold soil)',
      'cool': '45-65°F (cool but not frozen)',
      'warm': '60-75°F (warm soil required)',
      'hot': '70-85°F (very warm soil needed)'
    };
    return temps[tempType] || '50-70°F';
  }

  function getSunRequirements(crop) {
    const sunNeeds = {
      'peas': 'Full sun to partial shade',
      'spinach': 'Full sun to partial shade',
      'lettuce': 'Full sun to partial shade',
      'tomatoes': 'Full sun (6-8 hours)',
      'peppers': 'Full sun (6-8 hours)',
      'cucumbers': 'Full sun (6-8 hours)',
      'beans': 'Full sun (6+ hours)',
      'corn': 'Full sun (6-8 hours)'
    };
    return sunNeeds[crop] || 'Full sun (6+ hours)';
  }

  function getPlantingDepth(crop) {
    const depths = {
      'peas': '1-2 inches deep',
      'beans': '1-2 inches deep', 
      'corn': '1-2 inches deep',
      'lettuce': '1/4 inch deep',
      'spinach': '1/2 inch deep',
      'radishes': '1/2 inch deep',
      'carrots': '1/4 inch deep'
    };
    return depths[crop] || '2x seed diameter deep';
  }

  function getGerminationTime(crop) {
    const times = {
      'radishes': '3-7 days',
      'lettuce': '7-14 days',
      'spinach': '7-14 days',
      'beans': '7-14 days',
      'peas': '7-21 days',
      'corn': '7-14 days',
      'carrots': '14-21 days'
    };
    return times[crop] || '7-14 days';
  }

  function getFrostProtection(tempType) {
    const protection = {
      'hardy': 'Usually none needed, can handle frost',
      'cool': 'Row covers or cloches for hard frost',
      'warm': 'Row covers, plastic tunnels, or move indoors',
      'hot': 'Essential protection - any frost will kill plants'
    };
    return protection[tempType] || 'Row covers for light frost';
  }

  function getHeatProtection(tempType) {
    if (tempType === 'hardy' || tempType === 'cool') {
      return 'Shade cloth, extra water, plant in partial shade';
    }
    return 'Usually tolerates heat well, ensure adequate water';
  }

  function getPestTiming(crop) {
    const pests = {
      'tomatoes': 'Watch for hornworms in mid-summer',
      'peppers': 'Aphids and pepper weevils in hot weather',
      'cucumbers': 'Cucumber beetles early in season',
      'lettuce': 'Aphids and slugs in cool, moist conditions',
      'peas': 'Pea weevils and aphids during pod formation'
    };
    return pests[crop] || 'Monitor regularly for local pest patterns';
  }

  function getDiseasePreention(tempType) {
    if (tempType === 'warm' || tempType === 'hot') {
      return 'Ensure good air circulation, avoid overhead watering';
    }
    return 'Watch for fungal issues in cool, wet conditions';
  }

  function getLatePlantingAdvice(maturityDays) {
    if (maturityDays <= 45) {
      return 'Can plant up to 2 weeks late with minimal impact';
    } else if (maturityDays <= 75) {
      return 'Choose fast-maturing varieties if planting late';
    }
    return 'Late planting may require season extension methods';
  }

  function getWeatherDelayAdvice() {
    return 'Wait for proper conditions rather than forcing - better results with patience';
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
});