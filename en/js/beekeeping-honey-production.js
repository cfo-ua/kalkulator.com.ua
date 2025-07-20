document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('honey-production-form');
  const result = document.getElementById('honey-production-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const hiveCount = parseInt(document.getElementById('hive-count').value);
      const hiveAge = document.getElementById('hive-age').value;
      const climateZone = document.getElementById('climate-zone').value;
      const nectarSources = document.getElementById('nectar-sources').value;
      const experienceLevel = document.getElementById('experience-level').value;
      const colonyManagement = document.getElementById('colony-management').value;
      const weatherConditions = document.getElementById('weather-conditions').value;
      const honeyPrice = parseFloat(document.getElementById('honey-price').value);
      const productionGoal = document.getElementById('production-goal').value;
      
      if (!hiveCount || !hiveAge || !climateZone || !nectarSources || !experienceLevel || !colonyManagement || !weatherConditions || !honeyPrice || !productionGoal) {
        result.textContent = "Please fill in all fields.";
        return;
      }
      
      // Parse input data
      const [ageLevel, ageMultiplier] = hiveAge.split(',');
      const [climateName, baseYield] = climateZone.split(',');
      const [nectarLevel, nectarMultiplier] = nectarSources.split(',');
      const [expLevel, expMultiplier] = experienceLevel.split(',');
      const [managementLevel, managementMultiplier] = colonyManagement.split(',');
      const [weatherLevel, weatherMultiplier] = weatherConditions.split(',');
      
      const ageMultiplierNum = parseFloat(ageMultiplier);
      const baseYieldNum = parseFloat(baseYield);
      const nectarMultiplierNum = parseFloat(nectarMultiplier);
      const expMultiplierNum = parseFloat(expMultiplier);
      const managementMultiplierNum = parseFloat(managementMultiplier);
      const weatherMultiplierNum = parseFloat(weatherMultiplier);
      
      // Calculate honey production per hive
      const honeyPerHive = baseYieldNum * ageMultiplierNum * nectarMultiplierNum * expMultiplierNum * managementMultiplierNum * weatherMultiplierNum;
      
      // Calculate total production
      const totalHoneyProduction = honeyPerHive * hiveCount;
      
      // Calculate revenue
      const totalRevenue = totalHoneyProduction * honeyPrice;
      const revenuePerHive = honeyPerHive * honeyPrice;
      
      // Calculate costs
      const setupCostPerHive = 200; // Average initial setup
      const annualMaintenancePerHive = 75; // Annual maintenance
      const extractionEquipmentCost = getExtractionCost(hiveCount, productionGoal);
      const totalSetupCosts = (hiveCount * setupCostPerHive) + extractionEquipmentCost;
      const annualOperatingCosts = hiveCount * annualMaintenancePerHive;
      
      // Calculate profitability
      const annualProfit = totalRevenue - annualOperatingCosts;
      const profitPerHive = annualProfit / hiveCount;
      const roiYears = totalSetupCosts / Math.max(annualProfit, 1);
      
      // Calculate honey reserves needed for bees
      const winterReservePerHive = getWinterReserve(climateName);
      const totalWinterReserves = winterReservePerHive * hiveCount;
      const surplusHoney = Math.max(0, totalHoneyProduction - totalWinterReserves);
      const surplusRevenue = surplusHoney * honeyPrice;
      
      // Production efficiency metrics
      const honeyPerPound = 12; // Approximate number of 1-lb jars per hive
      const totalJars = Math.floor(surplusHoney);
      const workHoursPerHive = getWorkHours(managementLevel, hiveCount);
      const hourlyReturn = profitPerHive / workHoursPerHive;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Honey Production Estimate:</h4>
          <p>Number of hives: ${hiveCount}</p>
          <p>Hive status: ${ageLevel}</p>
          <p>Climate: ${climateName} zone</p>
          <p>Experience: ${expLevel} beekeeper</p>
          <p>Management: ${managementLevel} level</p>
        </div>
        
        <div class="result-production">
          <h4>Expected Production:</h4>
          <p><strong>Per hive: ${honeyPerHive.toFixed(1)} lbs honey</strong></p>
          <p><strong>Total production: ${totalHoneyProduction.toFixed(1)} lbs</strong></p>
          <p>Winter reserves needed: ${totalWinterReserves.toFixed(1)} lbs</p>
          <p><strong>Surplus for harvest: ${surplusHoney.toFixed(1)} lbs</strong></p>
          <p>Honey jars (1 lb): ${totalJars} jars</p>
        </div>
        
        <div class="result-revenue">
          <h4>Revenue Analysis:</h4>
          <p><strong>Total revenue: $${surplusRevenue.toFixed(0)}</strong></p>
          <p>Revenue per hive: $${(surplusRevenue / hiveCount).toFixed(0)}</p>
          <p>Revenue per pound: $${honeyPrice.toFixed(2)}</p>
          <p>Gross revenue (if all sold): $${totalRevenue.toFixed(0)}</p>
        </div>
        
        <div class="result-costs">
          <h4>Cost Analysis:</h4>
          <p><strong>Initial setup costs: $${totalSetupCosts.toFixed(0)}</strong></p>
          <p>• Hive equipment: $${(hiveCount * setupCostPerHive).toFixed(0)}</p>
          <p>• Extraction equipment: $${extractionEquipmentCost.toFixed(0)}</p>
          <p><strong>Annual operating costs: $${annualOperatingCosts.toFixed(0)}</strong></p>
          <p>• Per hive maintenance: $${annualMaintenancePerHive}/year</p>
        </div>
        
        <div class="result-profitability">
          <h4>Profitability:</h4>
          <p><strong>Annual profit: $${(surplusRevenue - annualOperatingCosts).toFixed(0)}</strong></p>
          <p>Profit per hive: $${((surplusRevenue - annualOperatingCosts) / hiveCount).toFixed(0)}</p>
          <p>Return on investment: ${roiYears.toFixed(1)} years to break even</p>
          <p>Hourly return: $${hourlyReturn.toFixed(2)}/hour</p>
          <p>Profit margin: ${(((surplusRevenue - annualOperatingCosts) / surplusRevenue) * 100).toFixed(1)}%</p>
        </div>
        
        <div class="result-management">
          <h4>Management Requirements:</h4>
          <p>⏱️ <strong>Time commitment:</strong> ${(workHoursPerHive * hiveCount).toFixed(0)} hours/year total</p>
          <p>📅 <strong>Per hive:</strong> ${workHoursPerHive.toFixed(1)} hours/year</p>
          <p>🔍 <strong>Inspections:</strong> ${getInspectionSchedule(managementLevel)}</p>
          <p>💉 <strong>Treatments:</strong> ${getTreatmentSchedule()}</p>
          <p>🍯 <strong>Harvest timing:</strong> ${getHarvestTiming(climateName)}</p>
        </div>
        
        <div class="result-factors">
          <h4>Production Factors Analysis:</h4>
          <p>🏠 Hive age impact: ${getImpactDescription(ageMultiplierNum)}</p>
          <p>🌸 Nectar sources: ${getImpactDescription(nectarMultiplierNum)}</p>
          <p>🎓 Experience level: ${getImpactDescription(expMultiplierNum)}</p>
          <p>⚙️ Management quality: ${getImpactDescription(managementMultiplierNum)}</p>
          <p>🌤️ Weather conditions: ${getImpactDescription(weatherMultiplierNum)}</p>
        </div>
        
        <div class="result-improvement">
          <h4>Improvement Opportunities:</h4>
          ${getImprovementTips(ageLevel, nectarLevel, expLevel, managementLevel).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>Seasonal Management Calendar:</h4>
          <p>🌸 <strong>Early Spring (March-April):</strong> ${getSpringManagement()}</p>
          <p>☀️ <strong>Late Spring (May-June):</strong> ${getLateSpringManagement()}</p>
          <p>🌻 <strong>Summer (July-August):</strong> ${getSummerManagement()}</p>
          <p>🍂 <strong>Fall (September-October):</strong> ${getFallManagement()}</p>
          <p>❄️ <strong>Winter (November-February):</strong> ${getWinterManagement()}</p>
        </div>
        
        <div class="result-equipment">
          <h4>Equipment Recommendations:</h4>
          ${getEquipmentRecommendations(hiveCount, productionGoal).map(item => `<p>${item}</p>`).join('')}
        </div>
        
        <div class="result-marketing">
          <h4>Marketing & Sales:</h4>
          <p>🎯 <strong>Target market:</strong> ${getTargetMarket(productionGoal, surplusHoney)}</p>
          <p>💰 <strong>Pricing strategy:</strong> ${getPricingStrategy(honeyPrice)}</p>
          <p>📦 <strong>Packaging needs:</strong> ${getPackagingNeeds(totalJars)}</p>
          <p>📍 <strong>Sales channels:</strong> ${getSalesChannels(productionGoal)}</p>
          <p>📋 <strong>Regulations:</strong> ${getRegulationInfo()}</p>
        </div>
        
        <div class="result-expansion">
          <h4>Expansion Planning:</h4>
          <p>📈 <strong>Growth potential:</strong> ${getGrowthPotential(profitPerHive, hiveCount)}</p>
          <p>🐝 <strong>Optimal hive count:</strong> ${getOptimalHiveCount(productionGoal, workHoursPerHive)}</p>
          <p>💡 <strong>Next steps:</strong> ${getNextSteps(expLevel, hiveCount, profitPerHive)}</p>
          <p>🌱 <strong>Diversification:</strong> ${getDiversificationOptions()}</p>
        </div>
        
        <div class="result-risks">
          <h4>Risk Management:</h4>
          <p>🦠 <strong>Disease prevention:</strong> ${getDiseasePreventionTips()}</p>
          <p>🌡️ <strong>Weather risks:</strong> ${getWeatherRiskManagement()}</p>
          <p>📉 <strong>Market risks:</strong> ${getMarketRiskTips()}</p>
          <p>🐻 <strong>Physical protection:</strong> ${getPhysicalProtectionTips()}</p>
        </div>
        
        <div class="result-sustainability">
          <h4>Sustainable Practices:</h4>
          <p>🌿 <strong>Habitat improvement:</strong> ${getHabitatTips()}</p>
          <p>🌱 <strong>Chemical-free management:</strong> ${getOrganicTips()}</p>
          <p>♻️ <strong>Waste reduction:</strong> ${getWasteReductionTips()}</p>
          <p>🌍 <strong>Environmental impact:</strong> ${getEnvironmentalTips()}</p>
        </div>
      `;
    });
  }

  function getExtractionCost(hiveCount, goal) {
    if (hiveCount <= 5) return 300; // Hand crank extractor
    if (hiveCount <= 20) return 800; // Electric extractor
    if (goal === 'commercial') return 2500; // Commercial equipment
    return 1200; // Large hobby setup
  }

  function getWinterReserve(climate) {
    const reserves = {
      'northern': 60,
      'temperate': 45,
      'southern': 30,
      'subtropical': 20
    };
    return reserves[climate] || 45;
  }

  function getWorkHours(managementLevel, hiveCount) {
    const baseHours = {
      'minimal': 8,
      'standard': 12,
      'intensive': 18
    };
    
    const hours = baseHours[managementLevel] || 12;
    // Economies of scale - more hives = slightly less time per hive
    const efficiency = Math.max(0.7, 1 - (hiveCount * 0.02));
    return hours * efficiency;
  }

  function getImpactDescription(factor) {
    if (factor <= 0.6) return '🔴 Significantly reduces production';
    if (factor <= 0.8) return '🟡 Moderately reduces production';
    if (factor <= 1.1) return '🟢 Normal/neutral impact';
    if (factor <= 1.3) return '🟢 Increases production';
    return '🟢 Significantly increases production';
  }

  function getImprovementTips(age, nectar, exp, management) {
    const tips = [];
    
    if (age === 'new') {
      tips.push('🐝 Focus on colony building in first year, don\'t expect surplus honey');
    }
    
    if (nectar === 'poor' || nectar === 'fair') {
      tips.push('🌸 Plant bee-friendly flowers, locate hives near better nectar sources');
    }
    
    if (exp === 'beginner') {
      tips.push('📚 Take beekeeping courses, join local beekeeping associations');
    }
    
    if (management === 'minimal') {
      tips.push('🔍 Increase inspection frequency, implement proper disease monitoring');
    }
    
    tips.push('📊 Keep detailed records to track what practices work best');
    tips.push('🐛 Monitor and treat for varroa mites regularly');
    
    return tips;
  }

  function getInspectionSchedule(level) {
    const schedules = {
      'minimal': 'Monthly during active season',
      'standard': 'Bi-weekly during active season',
      'intensive': 'Weekly during peak season'
    };
    return schedules[level] || 'Bi-weekly';
  }

  function getTreatmentSchedule() {
    return 'Varroa mite treatments 2-3 times annually, monitor for diseases';
  }

  function getHarvestTiming(climate) {
    const timings = {
      'northern': 'Late July to early August',
      'temperate': 'July to September',
      'southern': 'June to October',
      'subtropical': 'Multiple harvests year-round'
    };
    return timings[climate] || 'Late summer';
  }

  function getSpringManagement() {
    return 'Colony assessment, feeding if needed, add supers before flow';
  }

  function getLateSpringManagement() {
    return 'Monitor for swarming, ensure adequate space, disease checks';
  }

  function getSummerManagement() {
    return 'Peak honey flow management, harvest mature honey, pest monitoring';
  }

  function getFallManagement() {
    return 'Final harvest, winter preparation, reduce hive size, mite treatments';
  }

  function getWinterManagement() {
    return 'Minimal disturbance, emergency feeding if needed, equipment maintenance';
  }

  function getEquipmentRecommendations(hiveCount, goal) {
    const equipment = [];
    
    equipment.push('🥽 Protective gear: suit, gloves, hive tool');
    equipment.push('📦 Extra supers and frames for honey storage');
    
    if (hiveCount <= 5) {
      equipment.push('🍯 Hand-crank extractor for small batches');
    } else {
      equipment.push('⚡ Electric extractor for efficiency');
    }
    
    equipment.push('🌡️ Hive thermometer and moisture meter');
    equipment.push('💨 Smoker and quality fuel');
    
    if (goal === 'commercial') {
      equipment.push('🚚 Transport equipment for moving hives');
      equipment.push('🏭 Commercial processing equipment');
    }
    
    return equipment;
  }

  function getTargetMarket(goal, production) {
    if (goal === 'hobby') return 'Family, friends, neighbors';
    if (goal === 'sideline') return 'Farmers markets, local stores, direct sales';
    return 'Wholesale distributors, commercial buyers';
  }

  function getPricingStrategy(price) {
    if (price <= 8) return 'Competitive bulk pricing';
    if (price <= 15) return 'Mid-range local market pricing';
    return 'Premium artisanal pricing';
  }

  function getPackagingNeeds(jars) {
    if (jars <= 50) return `${jars} glass jars, labels, simple packaging`;
    if (jars <= 200) return `${jars} jars, professional labels, branded packaging`;
    return `${jars}+ jars, bulk containers, commercial packaging`;
  }

  function getSalesChannels(goal) {
    if (goal === 'hobby') return 'Direct sales, word of mouth';
    if (goal === 'sideline') return 'Farmers markets, online sales, local retail';
    return 'Wholesale, distributors, commercial contracts';
  }

  function getRegulationInfo() {
    return 'Check local cottage food laws, labeling requirements, FDA regulations';
  }

  function getGrowthPotential(profitPerHive, hiveCount) {
    if (profitPerHive > 300 && hiveCount < 50) {
      return 'High - consider expanding operations';
    } else if (profitPerHive > 150) {
      return 'Moderate - selective expansion possible';
    }
    return 'Focus on optimizing current operation';
  }

  function getOptimalHiveCount(goal, workHours) {
    if (goal === 'hobby') return '5-20 hives for manageable hobby operation';
    if (goal === 'sideline') return '20-100 hives for significant side income';
    return '100+ hives for commercial viability';
  }

  function getNextSteps(exp, hiveCount, profit) {
    if (exp === 'beginner') return 'Gain experience, focus on learning before expanding';
    if (hiveCount < 10 && profit > 200) return 'Consider doubling hive count next season';
    return 'Optimize current operations, explore value-added products';
  }

  function getDiversificationOptions() {
    return 'Beeswax products, pollen, royal jelly, bee breeding, equipment sales';
  }

  function getDiseasePreventionTips() {
    return 'Regular varroa monitoring, hygienic practices, disease-resistant genetics';
  }

  function getWeatherRiskManagement() {
    return 'Multiple apiary locations, emergency feeding, weather monitoring';
  }

  function getMarketRiskTips() {
    return 'Diversify sales channels, build customer relationships, value-added products';
  }

  function getPhysicalProtectionTips() {
    return 'Electric fencing for bears, secure hive stands, theft prevention';
  }

  function getHabitatTips() {
    return 'Plant native flowers, maintain pesticide-free zones, habitat corridors';
  }

  function getOrganicTips() {
    return 'Integrated pest management, natural treatments, organic certification';
  }

  function getWasteReductionTips() {
    return 'Reuse old equipment, recycle packaging, minimize single-use items';
  }

  function getEnvironmentalTips() {
    return 'Pollinator support, biodiversity enhancement, sustainable beekeeping practices';
  }
});