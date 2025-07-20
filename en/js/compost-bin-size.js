document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('compost-size-form');
  const result = document.getElementById('compost-size-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const householdSize = parseInt(document.getElementById('household-size').value);
      const cookingHabits = document.getElementById('cooking-habits').value;
      const yardSize = document.getElementById('yard-size').value;
      const gardeningActivity = document.getElementById('gardening-activity').value;
      const compostingMethod = document.getElementById('composting-method').value;
      const availableSpace = document.getElementById('available-space').value;
      const experienceLevel = document.getElementById('experience-level').value;
      const yardWaste = document.getElementById('yard-waste').value;
      const compostUsage = document.getElementById('compost-usage').value;
      
      if (!householdSize || !cookingHabits || !yardSize || !gardeningActivity || !compostingMethod || !availableSpace || !experienceLevel || !yardWaste || !compostUsage) {
        result.textContent = "Please fill in all fields.";
        return;
      }
      
      // Parse input data
      const [cookingLevel, cookingMultiplier] = cookingHabits.split(',');
      const [yardLevel, yardMultiplier] = yardSize.split(',');
      const [gardenLevel, gardenMultiplier] = gardeningActivity.split(',');
      const [methodName, baseSize, methodType] = compostingMethod.split(',');
      const [spaceLevel, spaceMultiplier] = availableSpace.split(',');
      const [expLevel, expMultiplier] = experienceLevel.split(',');
      const [wasteLevel, wasteMultiplier] = yardWaste.split(',');
      const [usageLevel, usageMultiplier] = compostUsage.split(',');
      
      // Calculate daily organic waste generation (lbs per day)
      const baseWastePerPerson = 1.3; // lbs per person per day (kitchen scraps)
      const cookingFactor = parseFloat(cookingMultiplier);
      const yardFactor = parseFloat(yardMultiplier);
      const gardenFactor = parseFloat(gardenMultiplier);
      const spaceFactor = parseFloat(spaceMultiplier);
      const expFactor = parseFloat(expMultiplier);
      const wasteFactor = parseFloat(wasteMultiplier);
      const usageFactor = parseFloat(usageMultiplier);
      
      // Calculate total daily waste
      const kitchenWasteDaily = householdSize * baseWastePerPerson * cookingFactor;
      const yardWasteDaily = householdSize * 0.5 * wasteFactor; // Yard waste varies more
      const totalWasteDaily = kitchenWasteDaily + yardWasteDaily;
      
      // Calculate weekly and annual waste
      const weeklyWaste = totalWasteDaily * 7;
      const annualWaste = totalWasteDaily * 365;
      
      // Convert to volume (compost materials are roughly 300-400 lbs per cubic yard)
      const lbsPerCubicFoot = 25; // Approximate for fresh organic materials
      const dailyVolume = totalWasteDaily / lbsPerCubicFoot;
      const weeklyVolume = weeklyWaste / lbsPerCubicFoot;
      const annualVolume = annualWaste / lbsPerCubicFoot;
      
      // Calculate recommended bin size based on method
      let recommendedSize = parseInt(baseSize);
      
      if (methodType !== 'worm-bin') {
        // Adjust size based on factors
        recommendedSize = recommendedSize * spaceFactor * expFactor * usageFactor;
        
        // Ensure minimum size for hot composting
        if (methodType === 'open-pile' || methodType === 'wire' || methodType === 'wooden') {
          recommendedSize = Math.max(27, recommendedSize); // 3x3x3 feet minimum
        }
        
        // Account for household size directly
        recommendedSize += (householdSize - 2) * 10; // Extra 10 cubic feet per person over 2
        
        // Account for total waste volume (need to handle at least 6 months of input)
        const minimumForWaste = weeklyVolume * 26; // 6 months of waste
        recommendedSize = Math.max(recommendedSize, minimumForWaste);
      } else {
        // Worm composting is different - based on feeding rate
        recommendedSize = Math.max(2, kitchenWasteDaily * 2); // 2 cubic feet per lb daily kitchen waste
      }
      
      // Calculate production estimates
      const compostReductionFactor = 0.35; // Materials reduce to about 35% of original volume
      const annualCompostProduction = annualVolume * compostReductionFactor;
      const compostPerSqFt = 0.5; // Cubic feet of compost per square foot of garden annually
      const gardenAreaCovered = annualCompostProduction / compostPerSqFt;
      
      // Calculate costs
      const binCosts = {
        'tumbler': 200,
        'wire': 50,
        'wooden': 150,
        'three-bin': 300,
        'open-pile': 25,
        'worm-bin': 100
      };
      
      const estimatedCost = binCosts[methodName] || 100;
      
      // Environmental calculations
      const wasteReductionPercent = (annualWaste / (householdSize * 1500)) * 100; // Average household waste
      const co2Savings = annualWaste * 0.5; // Approximate CO2 savings from diverting from landfill (lbs)
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Recommended Compost Bin Size:</h4>
          <p>Household: ${householdSize} people</p>
          <p>Method: ${getMethodName(methodName)}</p>
          <p><strong>Recommended size: ${Math.round(recommendedSize)} cubic feet</strong></p>
          <p>Dimensions: ${getDimensions(recommendedSize, methodType)}</p>
          <p>Estimated cost: $${estimatedCost}</p>
        </div>
        
        <div class="result-waste">
          <h4>Waste Generation Analysis:</h4>
          <p><strong>Daily organic waste: ${totalWasteDaily.toFixed(1)} lbs</strong></p>
          <p>Kitchen scraps: ${kitchenWasteDaily.toFixed(1)} lbs/day</p>
          <p>Yard waste: ${yardWasteDaily.toFixed(1)} lbs/day</p>
          <p>Weekly total: ${weeklyWaste.toFixed(0)} lbs</p>
          <p>Annual total: ${(annualWaste / 1000).toFixed(1)} thousand lbs</p>
        </div>
        
        <div class="result-production">
          <h4>Compost Production:</h4>
          <p><strong>Annual compost: ${annualCompostProduction.toFixed(0)} cubic feet</strong></p>
          <p>Monthly average: ${(annualCompostProduction / 12).toFixed(1)} cubic feet</p>
          <p>Garden coverage: ${gardenAreaCovered.toFixed(0)} square feet annually</p>
          <p>Equivalent to: ${(annualCompostProduction / 27).toFixed(1)} cubic yards</p>
          <p>Market value: $${(annualCompostProduction * 3).toFixed(0)} (at $3/cubic foot)</p>
        </div>
        
        <div class="result-environmental">
          <h4>Environmental Impact:</h4>
          <p><strong>Waste diverted: ${wasteReductionPercent.toFixed(1)}%</strong> of household waste</p>
          <p><strong>CO₂ savings: ${(co2Savings / 1000).toFixed(1)} tons</strong> annually</p>
          <p>Landfill reduction: ${(annualWaste / 2000).toFixed(2)} tons/year</p>
          <p>Methane prevention: Significant greenhouse gas reduction</p>
          <p>Soil improvement: ${gardenAreaCovered.toFixed(0)} sq ft enriched annually</p>
        </div>
        
        <div class="result-setup">
          <h4>Setup Recommendations:</h4>
          <p>📍 <strong>Location:</strong> ${getLocationAdvice(methodType)}</p>
          <p>📏 <strong>Space needed:</strong> ${getSpaceNeeded(recommendedSize, methodType)}</p>
          <p>🔧 <strong>Assembly:</strong> ${getAssemblyInfo(methodName)}</p>
          <p>💰 <strong>Budget:</strong> $${estimatedCost} initial investment</p>
          <p>⏱️ <strong>Setup time:</strong> ${getSetupTime(methodName)}</p>
        </div>
        
        <div class="result-materials">
          <h4>Materials Balance:</h4>
          <p>🟢 <strong>Green materials (nitrogen):</strong> ${(kitchenWasteDaily * 365).toFixed(0)} lbs/year</p>
          <p>🤎 <strong>Brown materials needed:</strong> ${(kitchenWasteDaily * 365 * 2).toFixed(0)} lbs/year</p>
          <p>📰 Brown sources: Leaves, newspaper, cardboard, paper</p>
          <p>🍂 Collect fall leaves for year-round brown material</p>
          <p>📊 Target ratio: 2 parts brown to 1 part green by volume</p>
        </div>
        
        <div class="result-timeline">
          <h4>Composting Timeline:</h4>
          <p>⏰ <strong>Time to finished compost:</strong> ${getCompostTime(methodType)}</p>
          <p>🔄 <strong>Turning schedule:</strong> ${getTurningSchedule(methodType)}</p>
          <p>🌡️ <strong>Temperature monitoring:</strong> ${getTemperatureInfo(methodType)}</p>
          <p>💧 <strong>Moisture management:</strong> ${getMoistureInfo()}</p>
          <p>✅ <strong>Ready signs:</strong> Dark, crumbly, earthy smell</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Maintenance Requirements:</h4>
          ${getMaintenanceInfo(methodType).map(item => `<p>${item}</p>`).join('')}
        </div>
        
        <div class="result-troubleshooting">
          <h4>Common Issues & Solutions:</h4>
          <p>🦨 <strong>Odors:</strong> ${getOdorSolutions()}</p>
          <p>🐭 <strong>Pests:</strong> ${getPestSolutions()}</p>
          <p>🐌 <strong>Slow decomposition:</strong> ${getSlowDecompSolutions()}</p>
          <p>💧 <strong>Too wet/dry:</strong> ${getMoistureSolutions()}</p>
          <p>🌡️ <strong>Not heating up:</strong> ${getHeatSolutions()}</p>
        </div>
        
        <div class="result-expansion">
          <h4>Future Expansion:</h4>
          <p>📈 <strong>Growth potential:</strong> ${getExpansionAdvice(spaceLevel, recommendedSize)}</p>
          <p>🔄 <strong>System upgrades:</strong> ${getUpgradeOptions(methodName)}</p>
          <p>👥 <strong>Community sharing:</strong> Consider neighborhood composting programs</p>
          <p>🎓 <strong>Learning resources:</strong> Local extension service, Master Gardener programs</p>
        </div>
        
        <div class="result-alternatives">
          <h4>Alternative Options:</h4>
          ${getAlternativeOptions(methodName, householdSize).map(alt => `<p>${alt}</p>`).join('')}
        </div>
        
        <div class="result-season">
          <h4>Seasonal Considerations:</h4>
          <p>🌸 <strong>Spring:</strong> Add fresh green materials, harvest finished compost</p>
          <p>☀️ <strong>Summer:</strong> Monitor moisture, shade bin if needed</p>
          <p>🍂 <strong>Fall:</strong> Collect leaves for brown materials, prepare for winter</p>
          <p>❄️ <strong>Winter:</strong> ${getWinterAdvice(methodType)}</p>
        </div>
      `;
    });
  }

  function getMethodName(code) {
    const names = {
      'tumbler': 'Tumbler Bin',
      'wire': 'Wire Bin',
      'wood': 'Wooden Bin',
      'three-bin': 'Three-Bin System',
      'pile': 'Open Pile',
      'worm': 'Worm Composting'
    };
    return names[code] || code;
  }

  function getDimensions(size, method) {
    if (method === 'worm-bin') {
      return `${Math.round(size)} cubic feet (typical worm bin dimensions)`;
    }
    
    const cubicFeet = Math.round(size);
    const sideLength = Math.round(Math.pow(cubicFeet, 1/3) * 10) / 10;
    
    if (method === 'tumbler') {
      return `${Math.round(size)}-gallon tumbler`;
    } else if (method === 'three-bin') {
      const binSize = Math.round(size / 3);
      const binSide = Math.round(Math.pow(binSize, 1/3) * 10) / 10;
      return `Three bins: ${binSide}' × ${binSide}' × ${binSide}' each`;
    } else {
      return `Approximately ${sideLength}' × ${sideLength}' × ${sideLength}'`;
    }
  }

  function getLocationAdvice(method) {
    if (method === 'worm-bin') {
      return 'Indoor or outdoor, 55-77°F, good drainage';
    }
    return 'Partial shade, good drainage, 10-15 feet from house, easy access';
  }

  function getSpaceNeeded(size, method) {
    if (method === 'worm-bin') {
      return '2x3 feet floor space';
    } else if (method === 'three-bin') {
      return '12x4 feet area plus access space';
    } else {
      const side = Math.pow(size, 1/3);
      return `${Math.round(side + 2)}x${Math.round(side + 2)} feet including access`;
    }
  }

  function getAssemblyInfo(method) {
    const info = {
      'tumbler': '1-2 hours assembly, pre-built base',
      'wire': '30 minutes, simple wire forming',
      'wood': '2-4 hours, basic carpentry skills',
      'three-bin': '4-6 hours, moderate construction',
      'pile': 'No assembly required',
      'worm': '1 hour setup, bedding preparation'
    };
    return info[method] || '1-2 hours assembly';
  }

  function getSetupTime(method) {
    const times = {
      'tumbler': '1-2 hours',
      'wire': '30 minutes',
      'wood': '2-4 hours',
      'three-bin': '4-6 hours',
      'pile': '15 minutes',
      'worm': '1 hour'
    };
    return times[method] || '1-2 hours';
  }

  function getCompostTime(method) {
    const times = {
      'tumbler': '6-8 weeks with regular turning',
      'wire': '3-6 months with hot composting',
      'wooden': '3-6 months with hot composting',
      'three-bin': 'Continuous, 3-month rotation',
      'open-pile': '6-12 months depending on management',
      'worm-bin': '3-6 months for finished castings'
    };
    return times[method] || '3-6 months';
  }

  function getTurningSchedule(method) {
    const schedules = {
      'tumbler': '2-3 times per week',
      'wire': 'Every 2-3 weeks',
      'wooden': 'Every 2-3 weeks',
      'three-bin': 'Transfer between bins monthly',
      'open-pile': 'Monthly or when convenient',
      'worm-bin': 'No turning needed'
    };
    return schedules[method] || 'Every 2-3 weeks';
  }

  function getTemperatureInfo(method) {
    if (method === 'worm-bin') {
      return 'Keep between 55-77°F, avoid temperature extremes';
    }
    return '130-160°F center temperature for hot composting, monitor with thermometer';
  }

  function getMoistureInfo() {
    return 'Maintain like a wrung-out sponge, 50-60% moisture content';
  }

  function getMaintenanceInfo(method) {
    const maintenance = {
      'tumbler': [
        '🔄 Turn 2-3 times per week',
        '💧 Check moisture weekly',
        '🌡️ Monitor temperature',
        '🧹 Clean bin annually'
      ],
      'wire': [
        '🔄 Turn pile every 2-3 weeks',
        '💧 Water as needed',
        '🌡️ Check center temperature',
        '🔧 Adjust wire as needed'
      ],
      'wooden': [
        '🔄 Turn pile every 2-3 weeks',
        '💧 Monitor moisture',
        '🌡️ Temperature monitoring',
        '🪚 Annual wood treatment'
      ],
      'three-bin': [
        '🔄 Monthly bin transfers',
        '💧 Water management',
        '🌡️ Temperature checks',
        '🧹 Keep bins clean'
      ],
      'open-pile': [
        '🔄 Turn monthly',
        '💧 Water in dry weather',
        '🌡️ Optional temperature monitoring',
        '🍂 Add browns as needed'
      ],
      'worm-bin': [
        '🍽️ Feed worms weekly',
        '💧 Maintain proper moisture',
        '🌡️ Keep temperature stable',
        '✂️ Chop food scraps small'
      ]
    };
    return maintenance[method] || maintenance['wire'];
  }

  function getOdorSolutions() {
    return 'Add more brown materials, turn more frequently, check moisture levels';
  }

  function getPestSolutions() {
    return 'Avoid meat/dairy, bury food scraps, use tight-fitting lids';
  }

  function getSlowDecompSolutions() {
    return 'Add nitrogen (greens), increase turning, check moisture and temperature';
  }

  function getMoistureSolutions() {
    return 'Add water if too dry, add browns/turn if too wet';
  }

  function getHeatSolutions() {
    return 'Add nitrogen, increase pile size, turn to add oxygen';
  }

  function getExpansionAdvice(spaceLevel, currentSize) {
    if (spaceLevel === 'limited') {
      return 'Consider vertical or tumbler systems for expansion';
    } else if (spaceLevel === 'moderate') {
      return 'Could add second bin or upgrade to three-bin system';
    } else {
      return 'Plenty of space for multi-bin systems or large-scale composting';
    }
  }

  function getUpgradeOptions(currentMethod) {
    const upgrades = {
      'tumbler': 'Add second tumbler for continuous production',
      'wire': 'Upgrade to wooden bin or three-bin system',
      'wood': 'Expand to three-bin system',
      'three-bin': 'Add more bins or mechanized turning',
      'pile': 'Upgrade to contained system for better management',
      'worm': 'Add outdoor bin for yard waste composting'
    };
    return upgrades[currentMethod] || 'Consider additional bins for expansion';
  }

  function getAlternativeOptions(method, householdSize) {
    const alternatives = [];
    
    if (method !== 'worm') {
      alternatives.push('🪱 Add worm composting for kitchen scraps year-round');
    }
    
    if (method !== 'tumbler') {
      alternatives.push('🥤 Consider tumbler for faster results and easier maintenance');
    }
    
    if (householdSize <= 2) {
      alternatives.push('🏘️ Community composting programs in your area');
    }
    
    alternatives.push('♻️ Municipal composting pickup services');
    alternatives.push('🥬 Bokashi composting for all food scraps including meat');
    
    return alternatives;
  }

  function getWinterAdvice(method) {
    if (method === 'worm-bin') {
      return 'Move indoors or insulate well, feed less frequently';
    }
    return 'Insulate bins, continue adding materials, decomposition slows but continues';
  }
});