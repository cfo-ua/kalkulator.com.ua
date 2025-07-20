document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('aquaponics-design-form');
  const result = document.getElementById('aquaponics-design-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const systemType = document.getElementById('system-type').value;
      const productionGoal = document.getElementById('production-goal').value;
      const availableSpace = parseFloat(document.getElementById('available-space').value);
      const fishSpecies = document.getElementById('fish-species').value;
      const primaryCrops = document.getElementById('primary-crops').value;
      const climateControl = document.getElementById('climate-control').value;
      const experienceLevel = document.getElementById('experience-level').value;
      const budgetLevel = document.getElementById('budget-level').value;
      const fishPrice = parseFloat(document.getElementById('fish-price').value);
      const vegetablePrice = parseFloat(document.getElementById('vegetable-price').value);
      
      if (!systemType || !productionGoal || !availableSpace || !fishSpecies || !primaryCrops || !climateControl || !experienceLevel || !budgetLevel || !fishPrice || !vegetablePrice) {
        result.textContent = "Please fill in all fields.";
        return;
      }
      
      // Parse input data
      const [systemName, systemMultiplier] = systemType.split(',');
      const [goalName, baseSize] = productionGoal.split(',');
      const [fishName, fishDensity, fishMarketPrice] = fishSpecies.split(',');
      const [cropName, cropValue] = primaryCrops.split(',');
      const [climateName, climateMultiplier] = climateControl.split(',');
      const [expName, expMultiplier] = experienceLevel.split(',');
      const [budgetName, budgetMultiplier] = budgetLevel.split(',');
      
      const systemEfficiency = parseFloat(systemMultiplier);
      const targetSize = Math.min(availableSpace, parseInt(baseSize));
      const fishDensityNum = parseFloat(fishDensity);
      const fishMarketPriceNum = parseFloat(fishMarketPrice);
      const cropValueNum = parseFloat(cropValue);
      const climateMultiplierNum = parseFloat(climateMultiplier);
      const expMultiplierNum = parseFloat(expMultiplier);
      const budgetMultiplierNum = parseFloat(budgetMultiplier);
      
      // Calculate system dimensions
      const growingArea = targetSize * 0.7; // 70% for growing, 30% for tanks/equipment
      const fishTankVolume = calculateFishTankVolume(growingArea, systemName);
      const growBedVolume = calculateGrowBedVolume(growingArea, systemName);
      
      // Calculate fish stocking
      const maxFishWeight = fishTankVolume * fishDensityNum;
      const numberOfFish = Math.floor(maxFishWeight / 1.5); // Assuming 1.5 lb average fish weight
      
      // Calculate plant capacity
      const plantSpacing = getPlantSpacing(cropName);
      const plantsPerSqFt = 1 / plantSpacing;
      const totalPlants = Math.floor(growingArea * plantsPerSqFt);
      
      // Calculate production
      const annualFishProduction = maxFishWeight * 2; // 2 cycles per year
      const annualPlantProduction = calculatePlantProduction(cropName, growingArea, systemEfficiency, climateMultiplierNum);
      
      // Calculate equipment needs
      const pumpSize = calculatePumpSize(fishTankVolume + growBedVolume);
      const aerationNeeds = calculateAeration(fishTankVolume);
      const heatingNeeds = calculateHeating(fishTankVolume, climateName, fishName);
      
      // Calculate costs
      const setupCosts = calculateSetupCosts(fishTankVolume, growBedVolume, systemName, budgetMultiplierNum, climateMultiplierNum);
      const annualOperatingCosts = calculateOperatingCosts(maxFishWeight, growingArea, climateName);
      
      // Calculate revenue
      const fishRevenue = annualFishProduction * fishPrice;
      const plantRevenue = annualPlantProduction * vegetablePrice;
      const totalRevenue = fishRevenue + plantRevenue;
      
      // Calculate profitability
      const annualProfit = totalRevenue - annualOperatingCosts;
      const roiYears = setupCosts / Math.max(annualProfit, 1);
      const profitPerSqFt = annualProfit / targetSize;
      
      // Water quality parameters
      const waterVolume = fishTankVolume + (growBedVolume * 0.3); // Growing media displaces water
      const dailyWaterChange = waterVolume * 0.05; // 5% daily water change
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Aquaponics System Design:</h4>
          <p>System type: ${getSystemTypeName(systemName)}</p>
          <p>Target size: ${targetSize} sq ft total</p>
          <p>Growing area: ${growingArea.toFixed(1)} sq ft</p>
          <p>Fish species: ${fishName.charAt(0).toUpperCase() + fishName.slice(1)}</p>
          <p>Primary crops: ${cropName.replace('-', ' ')}</p>
          <p>Climate: ${climateName}</p>
        </div>
        
        <div class="result-dimensions">
          <h4>System Specifications:</h4>
          <p><strong>Fish tank: ${fishTankVolume.toFixed(0)} gallons</strong></p>
          <p>Tank dimensions: ${getTankDimensions(fishTankVolume)}</p>
          <p><strong>Grow bed volume: ${growBedVolume.toFixed(0)} gallons</strong></p>
          <p>Grow bed area: ${growingArea.toFixed(1)} sq ft</p>
          <p>Total water volume: ${waterVolume.toFixed(0)} gallons</p>
        </div>
        
        <div class="result-stocking">
          <h4>Fish & Plant Capacity:</h4>
          <p><strong>Fish capacity: ${maxFishWeight.toFixed(0)} lbs (${numberOfFish} fish)</strong></p>
          <p>Stocking density: ${fishDensityNum} lbs per gallon</p>
          <p><strong>Plant capacity: ${totalPlants} plants</strong></p>
          <p>Plant density: ${plantsPerSqFt.toFixed(1)} plants per sq ft</p>
          <p>Plant spacing: ${(plantSpacing * 12).toFixed(0)} inches apart</p>
        </div>
        
        <div class="result-equipment">
          <h4>Equipment Requirements:</h4>
          <p><strong>Water pump: ${pumpSize} GPH</strong></p>
          <p>Circulation rate: ${(pumpSize / waterVolume).toFixed(1)} turnovers per hour</p>
          <p><strong>Aeration: ${aerationNeeds} air stones</strong></p>
          <p>Air pump: ${(aerationNeeds * 10).toFixed(0)} LPH capacity</p>
          ${heatingNeeds > 0 ? `<p><strong>Heating: ${heatingNeeds}W heater</strong></p>` : ''}
          <p>Monitoring: pH meter, thermometer, DO meter</p>
        </div>
        
        <div class="result-production">
          <h4>Annual Production Estimates:</h4>
          <p><strong>Fish production: ${annualFishProduction.toFixed(0)} lbs/year</strong></p>
          <p>Fish harvest: 2 cycles per year</p>
          <p><strong>Plant production: ${annualPlantProduction.toFixed(0)} lbs/year</strong></p>
          <p>Plant cycles: ${getPlantCycles(cropName)} per year</p>
          <p>Production per sq ft: ${(annualPlantProduction / growingArea).toFixed(1)} lbs/sq ft</p>
        </div>
        
        <div class="result-costs">
          <h4>Cost Analysis:</h4>
          <p><strong>Initial setup: $${setupCosts.toFixed(0)}</strong></p>
          <p>Cost per gallon: $${(setupCosts / waterVolume).toFixed(2)}</p>
          <p>Cost per sq ft: $${(setupCosts / targetSize).toFixed(2)}</p>
          <p><strong>Annual operating: $${annualOperatingCosts.toFixed(0)}</strong></p>
          <p>Monthly operating: $${(annualOperatingCosts / 12).toFixed(0)}</p>
        </div>
        
        <div class="result-revenue">
          <h4>Revenue Projection:</h4>
          <p><strong>Fish revenue: $${fishRevenue.toFixed(0)}/year</strong></p>
          <p>Plant revenue: $${plantRevenue.toFixed(0)}/year</p>
          <p><strong>Total revenue: $${totalRevenue.toFixed(0)}/year</strong></p>
          <p>Revenue per sq ft: $${(totalRevenue / targetSize).toFixed(2)}</p>
        </div>
        
        <div class="result-profitability">
          <h4>Profitability Analysis:</h4>
          <p><strong>Annual profit: $${annualProfit.toFixed(0)}</strong></p>
          <p>Profit margin: ${((annualProfit / totalRevenue) * 100).toFixed(1)}%</p>
          <p>ROI period: ${roiYears.toFixed(1)} years</p>
          <p>Profit per sq ft: $${profitPerSqFt.toFixed(2)}</p>
          <p>Break-even: ${Math.ceil(setupCosts / (totalRevenue / 12))} months</p>
        </div>
        
        <div class="result-water-management">
          <h4>Water Management:</h4>
          <p>💧 <strong>Daily water change: ${dailyWaterChange.toFixed(1)} gallons</strong></p>
          <p>🌡️ <strong>Temperature range: ${getTemperatureRange(fishName)}</strong></p>
          <p>🧪 <strong>pH range: ${getPHRange(fishName)}</strong></p>
          <p>💨 <strong>Dissolved oxygen: ${getDORequirements()}</strong></p>
          <p>🔄 <strong>Circulation: ${((pumpSize / waterVolume) * 24).toFixed(0)} full cycles/day</strong></p>
        </div>
        
        <div class="result-feeding">
          <h4>Feeding Schedule:</h4>
          <p>🐟 <strong>Daily feed: ${(maxFishWeight * 0.02).toFixed(2)} lbs</strong></p>
          <p>📅 Feed frequency: ${getFeedingFrequency(fishName)}</p>
          <p>💰 Annual feed cost: $${(maxFishWeight * 0.02 * 365 * 1.5).toFixed(0)}</p>
          <p>🌱 Plant nutrition: Fish waste provides all nutrients</p>
          <p>⚡ Feed conversion: ${getFeedConversion(fishName)} FCR</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Maintenance Requirements:</h4>
          ${getMaintenanceTasks(systemName).map(task => `<p>${task}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>Seasonal Management:</h4>
          <p>🌱 <strong>Spring:</strong> ${getSpringTasks()}</p>
          <p>☀️ <strong>Summer:</strong> ${getSummerTasks()}</p>
          <p>🍂 <strong>Fall:</strong> ${getFallTasks()}</p>
          <p>❄️ <strong>Winter:</strong> ${getWinterTasks(climateName)}</p>
        </div>
        
        <div class="result-optimization">
          <h4>System Optimization:</h4>
          ${getOptimizationTips(systemName, expName, cropName).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-troubleshooting">
          <h4>Common Issues & Solutions:</h4>
          <p>🐟 <strong>Fish health:</strong> ${getFishHealthTips()}</p>
          <p>🌱 <strong>Plant problems:</strong> ${getPlantHealthTips()}</p>
          <p>💧 <strong>Water quality:</strong> ${getWaterQualityTips()}</p>
          <p>🔧 <strong>Equipment issues:</strong> ${getEquipmentTips()}</p>
        </div>
        
        <div class="result-scaling">
          <h4>Scaling Opportunities:</h4>
          <p>📈 <strong>Expansion potential:</strong> ${getExpansionAdvice(profitPerSqFt, availableSpace)}</p>
          <p>🔄 <strong>System replication:</strong> ${getReplicationAdvice(annualProfit)}</p>
          <p>🎯 <strong>Market focus:</strong> ${getMarketAdvice(cropName, fishName)}</p>
          <p>💼 <strong>Business potential:</strong> ${getBusinessAdvice(totalRevenue, targetSize)}</p>
        </div>
        
        <div class="result-sustainability">
          <h4>Sustainability Features:</h4>
          <p>♻️ <strong>Water efficiency:</strong> 95% water savings vs. traditional farming</p>
          <p>🌱 <strong>No soil needed:</strong> Eliminates soil degradation issues</p>
          <p>🚫 <strong>Pesticide-free:</strong> Closed system prevents pest issues</p>
          <p>🎣 <strong>Dual production:</strong> Fish and vegetables from same resources</p>
          <p>🌍 <strong>Local food:</strong> Reduces transportation carbon footprint</p>
        </div>
      `;
    });
  }

  function calculateFishTankVolume(growingArea, systemType) {
    // Base calculation: 1 gallon per 0.1 sq ft of growing area
    const baseVolume = growingArea * 10;
    
    // Adjust based on system type
    const multipliers = {
      'media-bed': 1.0,
      'dwc': 0.8,
      'nft': 1.2,
      'vertical': 0.9,
      'hybrid': 1.1
    };
    
    return baseVolume * (multipliers[systemType] || 1.0);
  }

  function calculateGrowBedVolume(growingArea, systemType) {
    // Deep Water Culture has minimal grow bed volume
    if (systemType === 'dwc') {
      return growingArea * 2; // 2 gallons per sq ft for DWC
    }
    
    // Media beds: 12 inches deep
    return growingArea * 7.48; // 1 sq ft × 1 ft deep = 7.48 gallons
  }

  function getPlantSpacing(cropType) {
    const spacings = {
      'leafy-greens': 0.25, // 4 plants per sq ft
      'herbs': 0.33, // 3 plants per sq ft
      'microgreens': 0.1, // 10 plants per sq ft
      'fruiting': 1.0, // 1 plant per sq ft
      'mixed': 0.5 // 2 plants per sq ft
    };
    return spacings[cropType] || 0.25;
  }

  function calculatePlantProduction(cropType, area, systemEff, climateEff) {
    const baseYields = {
      'leafy-greens': 8, // lbs per sq ft per year
      'herbs': 6,
      'microgreens': 20,
      'fruiting': 12,
      'mixed': 10
    };
    
    const baseYield = baseYields[cropType] || 8;
    return area * baseYield * systemEff * climateEff;
  }

  function calculatePumpSize(totalVolume) {
    // Pump should circulate entire volume every 1-2 hours
    return Math.ceil(totalVolume / 1.5); // GPH
  }

  function calculateAeration(fishTankVolume) {
    // 1 air stone per 50 gallons
    return Math.ceil(fishTankVolume / 50);
  }

  function calculateHeating(tankVolume, climate, fishType) {
    if (climate === 'outdoor') return 0;
    
    const heatingNeeds = {
      'tilapia': 5, // watts per gallon
      'trout': 0, // cold water fish
      'catfish': 3,
      'bass': 3,
      'goldfish': 2
    };
    
    return (heatingNeeds[fishType] || 3) * tankVolume;
  }

  function calculateSetupCosts(fishTankVol, growBedVol, systemType, budgetMult, climateMult) {
    const baseCostPerGallon = {
      'media-bed': 8,
      'dwc': 12,
      'nft': 15,
      'vertical': 20,
      'hybrid': 18
    };
    
    const costPerGallon = (baseCostPerGallon[systemType] || 10) * budgetMult;
    const totalVolume = fishTankVol + growBedVol;
    
    return totalVolume * costPerGallon * climateMult;
  }

  function calculateOperatingCosts(fishWeight, growingArea, climate) {
    const feedCost = fishWeight * 0.02 * 365 * 1.5; // Daily feed × price
    const electricityCost = growingArea * 2 * 12; // $2 per sq ft per month
    const climateCost = climate === 'indoor' ? growingArea * 3 * 12 : 0;
    const miscCosts = growingArea * 0.5 * 12; // Seeds, supplements, etc.
    
    return feedCost + electricityCost + climateCost + miscCosts;
  }

  function getSystemTypeName(type) {
    const names = {
      'media-bed': 'Media Bed System',
      'dwc': 'Deep Water Culture',
      'nft': 'Nutrient Film Technique',
      'vertical': 'Vertical Growing System',
      'hybrid': 'Hybrid System'
    };
    return names[type] || type;
  }

  function getTankDimensions(volume) {
    // Assume round tank, 4 feet deep
    const radius = Math.sqrt(volume / (3.14159 * 4 * 7.48));
    const diameter = radius * 2;
    return `${diameter.toFixed(1)}' diameter × 4' deep`;
  }

  function getPlantCycles(cropType) {
    const cycles = {
      'leafy-greens': 6,
      'herbs': 4,
      'microgreens': 12,
      'fruiting': 2,
      'mixed': 4
    };
    return cycles[cropType] || 4;
  }

  function getTemperatureRange(fishType) {
    const ranges = {
      'tilapia': '75-85°F',
      'trout': '50-65°F',
      'catfish': '75-85°F',
      'bass': '70-80°F',
      'goldfish': '65-75°F'
    };
    return ranges[fishType] || '70-80°F';
  }

  function getPHRange(fishType) {
    const ranges = {
      'tilapia': '6.5-8.5',
      'trout': '6.5-7.5',
      'catfish': '6.5-8.0',
      'bass': '6.5-8.0',
      'goldfish': '7.0-8.0'
    };
    return ranges[fishType] || '6.5-8.0';
  }

  function getDORequirements() {
    return '5+ mg/L for fish health';
  }

  function getFeedingFrequency(fishType) {
    return fishType === 'trout' ? '3-4 times daily' : '2-3 times daily';
  }

  function getFeedConversion(fishType) {
    const fcr = {
      'tilapia': '1.5:1',
      'trout': '1.2:1',
      'catfish': '1.8:1',
      'bass': '1.6:1',
      'goldfish': '2.0:1'
    };
    return fcr[fishType] || '1.5:1';
  }

  function getMaintenanceTasks(systemType) {
    const baseTasks = [
      '🔍 Daily: Check fish behavior, water temperature',
      '🧪 Weekly: Test pH, ammonia, nitrite, nitrate levels',
      '🔧 Monthly: Clean pumps, check plumbing for leaks',
      '🌱 Ongoing: Harvest plants, plant new seedlings'
    ];
    
    if (systemType === 'media-bed') {
      baseTasks.push('🪨 Quarterly: Clean grow bed media if needed');
    }
    
    return baseTasks;
  }

  function getSpringTasks() {
    return 'System startup, add fish fingerlings, plant spring crops';
  }

  function getSummerTasks() {
    return 'Peak production, frequent harvesting, monitor water temperature';
  }

  function getFallTasks() {
    return 'Harvest mature fish, plant cool-season crops, prepare for winter';
  }

  function getWinterTasks(climate) {
    if (climate === 'outdoor') {
      return 'System shutdown in cold climates, equipment maintenance';
    }
    return 'Reduced feeding, monitor heating, continue light production';
  }

  function getOptimizationTips(systemType, experience, cropType) {
    const tips = [];
    
    if (experience === 'beginner') {
      tips.push('🎓 Start with leafy greens - they\'re most forgiving');
      tips.push('📚 Join aquaponics forums and local groups for support');
    }
    
    if (systemType === 'media-bed') {
      tips.push('🪨 Use expanded clay pebbles for best water flow');
    }
    
    if (cropType === 'fruiting') {
      tips.push('🌶️ Wait 6+ months for system to mature before fruiting plants');
    }
    
    tips.push('📊 Keep detailed logs of water parameters and production');
    tips.push('🔄 Implement backup systems for power outages');
    
    return tips;
  }

  function getFishHealthTips() {
    return 'Monitor for diseases, maintain water quality, avoid overfeeding';
  }

  function getPlantHealthTips() {
    return 'Check for nutrient deficiencies, pest monitoring, proper lighting';
  }

  function getWaterQualityTips() {
    return 'Regular testing, proper filtration, maintain beneficial bacteria';
  }

  function getEquipmentTips() {
    return 'Regular maintenance, backup pumps, spare parts inventory';
  }

  function getExpansionAdvice(profitPerSqFt, availableSpace) {
    if (profitPerSqFt > 10 && availableSpace > 500) {
      return 'High profit potential - consider expanding system';
    }
    return 'Optimize current system before expanding';
  }

  function getReplicationAdvice(annualProfit) {
    if (annualProfit > 5000) {
      return 'Consider building additional identical systems';
    }
    return 'Perfect current system before replication';
  }

  function getMarketAdvice(crops, fish) {
    if (crops === 'herbs' || crops === 'microgreens') {
      return 'Focus on high-value restaurant and farmers market sales';
    }
    return 'Develop local market for fresh fish and vegetables';
  }

  function getBusinessAdvice(revenue, size) {
    if (revenue > 15000 && size > 200) {
      return 'Potential for full-time aquaponics business';
    } else if (revenue > 5000) {
      return 'Good side business opportunity';
    }
    return 'Excellent hobby with some income potential';
  }
});