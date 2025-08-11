document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fish-tank-form');
  const result = document.getElementById('fish-tank-result');
  const tankSizeSelect = document.getElementById('tank-size');
  const customSizeDiv = document.getElementById('custom-size');

  // Show/hide custom size inputs
  tankSizeSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
      customSizeDiv.style.display = 'block';
    } else {
      customSizeDiv.style.display = 'none';
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const tankType = document.getElementById('tank-type').value;
      const tankSize = document.getElementById('tank-size').value;
      const experience = document.getElementById('experience-level').value;
      const budget = document.getElementById('budget-range').value;

      if (!tankType || !tankSize || !experience || !budget) {
        result.innerHTML = '<div class="error">❌ Please fill in all fields</div>';
        return;
      }

      let volumeGallons, volumeLiters;
      
      if (tankSize === 'custom') {
        const length = parseFloat(document.getElementById('tank-length').value);
        const width = parseFloat(document.getElementById('tank-width').value);
        const height = parseFloat(document.getElementById('tank-height').value);
        
        if (!length || !width || !height) {
          result.innerHTML = '<div class="error">❌ Please enter all dimensions for custom tank</div>';
          return;
        }
        
        volumeGallons = (length * width * height) / 231; // Convert cubic inches to gallons
        volumeLiters = volumeGallons * 3.78541;
      } else {
        volumeGallons = parseFloat(tankSize);
        volumeLiters = volumeGallons * 3.78541;
      }

      const calculations = calculateTankRequirements(tankType, volumeGallons, volumeLiters, experience, budget);
      displayResults(calculations);
    });
  }

  function calculateTankRequirements(tankType, gallons, liters, experience, budget) {
    const calc = {
      volume: { gallons: gallons, liters: liters },
      tankType: tankType,
      experience: experience,
      budget: budget
    };

    // Equipment calculations
    calc.equipment = calculateEquipment(tankType, gallons, budget);
    
    // Fish capacity
    calc.fishCapacity = calculateFishCapacity(tankType, gallons, experience);
    
    // Maintenance schedule
    calc.maintenance = calculateMaintenance(tankType, gallons);
    
    // Costs
    calc.costs = calculateCosts(tankType, gallons, budget);
    
    // Recommendations
    calc.recommendations = getRecommendations(tankType, gallons, experience);

    return calc;
  }

  function calculateEquipment(tankType, gallons, budget) {
    const equipment = {};
    
    // Filter calculation (4-10x tank volume per hour)
    const filterFlowMin = gallons * 4;
    const filterFlowMax = gallons * 8;
    equipment.filter = {
      flowRate: `${Math.round(filterFlowMin)}-${Math.round(filterFlowMax)} GPH`,
      type: tankType === 'saltwater' ? 'Canister + protein skimmer' : gallons > 40 ? 'Canister filter' : 'HOB or internal'
    };

    // Heater calculation (5W per gallon for tropical)
    if (tankType !== 'coldwater') {
      const heaterWatts = Math.round(gallons * 5);
      equipment.heater = {
        watts: heaterWatts,
        type: heaterWatts > 300 ? '2 heaters of ' + Math.round(heaterWatts/2) + 'W each' : heaterWatts + 'W heater'
      };
    }

    // Lighting (LED 1-3W per gallon)
    const lightingWatts = tankType === 'planted' ? 
      Math.round(gallons * 3) : Math.round(gallons * 1.5);
    equipment.lighting = {
      watts: lightingWatts,
      type: tankType === 'planted' ? 'Full spectrum LED' : 'Standard LED'
    };

    // Air pump for certain setups
    if (tankType === 'betta' || gallons < 10) {
      equipment.airPump = {
        required: true,
        type: 'Small air pump 2-5W'
      };
    }

    return equipment;
  }

  function calculateFishCapacity(tankType, gallons, experience) {
    let baseCapacity;
    
    switch (tankType) {
      case 'betta':
        baseCapacity = { count: 1, description: '1 betta + possible tank mates' };
        break;
      case 'saltwater':
        baseCapacity = { 
          count: Math.floor(gallons / 5), 
          description: 'Marine fish need more space' 
        };
        break;
      case 'cichlid':
        baseCapacity = { 
          count: Math.floor(gallons / 4), 
          description: 'Cichlids are territorial, need space' 
        };
        break;
      default:
        baseCapacity = { 
          count: Math.floor(gallons * 0.8), 
          description: 'Small fish: ~1 inch per gallon' 
        };
    }

    // Adjust for experience
    if (experience === 'beginner') {
      baseCapacity.count = Math.floor(baseCapacity.count * 0.7);
      baseCapacity.description += ' (reduced for beginners)';
    }

    return baseCapacity;
  }

  function calculateMaintenance(tankType, gallons) {
    const waterChangePercent = tankType === 'saltwater' ? 20 : 25;
    const waterChangeAmount = Math.round(gallons * waterChangePercent / 100);
    
    return {
      waterChange: {
        frequency: 'Weekly',
        amount: `${waterChangeAmount} gallons (${waterChangePercent}%)`
      },
      cleaning: {
        substrate: 'Every 2 weeks',
        glass: 'Weekly',
        filter: tankType === 'saltwater' ? 'Monthly' : 'Every 2-4 weeks'
      },
      testing: {
        frequency: tankType === 'saltwater' ? 'Weekly' : 'Bi-weekly',
        parameters: tankType === 'saltwater' ? 
          'pH, ammonia, nitrite, nitrate, salinity' : 
          'pH, ammonia, nitrite, nitrate'
      }
    };
  }

  function calculateCosts(tankType, gallons, budget) {
    let baseCostPerGallon;
    
    switch (budget) {
      case 'low': baseCostPerGallon = 20; break;
      case 'medium': baseCostPerGallon = 40; break;
      case 'high': baseCostPerGallon = 65; break;
    }

    // Saltwater multiplier
    if (tankType === 'saltwater') {
      baseCostPerGallon *= 1.8;
    }

    const initialCost = Math.round(gallons * baseCostPerGallon);
    
    // Monthly costs
    const monthlyCosts = {
      food: Math.round(gallons * 0.5),
      electricity: Math.round(gallons * 0.8),
      chemicals: tankType === 'saltwater' ? Math.round(gallons * 2) : Math.round(gallons * 0.5),
      maintenance: Math.round(gallons * 0.4)
    };

    const totalMonthly = Object.values(monthlyCosts).reduce((a, b) => a + b, 0);

    return {
      initial: initialCost,
      monthly: {
        breakdown: monthlyCosts,
        total: totalMonthly
      },
      yearly: totalMonthly * 12
    };
  }

  function getRecommendations(tankType, gallons, experience) {
    const recommendations = [];

    if (gallons < 10 && tankType !== 'betta') {
      recommendations.push('⚠️ Tanks under 10 gallons are challenging for beginners');
    }

    if (tankType === 'saltwater' && experience === 'beginner') {
      recommendations.push('💡 Consider starting with freshwater first');
    }

    if (gallons >= 55) {
      recommendations.push('✅ Excellent size for a stable ecosystem');
    }

    if (tankType === 'betta') {
      recommendations.push('🐠 Bettas need warm water (78-80°F) and gentle filtration');
    }

    if (tankType === 'planted') {
      recommendations.push('🌱 Planted tanks need CO2 injection and specialized lighting');
    }

    if (gallons >= 20 && gallons <= 40 && experience === 'beginner') {
      recommendations.push('🎯 Perfect beginner size - large enough to be stable');
    }

    return recommendations;
  }

  function displayResults(calc) {
    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>📏 Tank Volume</h6>
          <div class="big-number">${Math.round(calc.volume.gallons)}</div>
          <div>gallons (${Math.round(calc.volume.liters)} liters)</div>
        </div>
        
        <div class="insight-card success">
          <h6>🐠 Fish Capacity</h6>
          <div class="big-number">${calc.fishCapacity.count}</div>
          <div>${calc.fishCapacity.description}</div>
        </div>
        
        <div class="insight-card warning">
          <h6>💰 Initial Cost</h6>
          <div class="big-number">$${calc.costs.initial.toLocaleString()}</div>
          <div>including equipment</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>⚙️ Required Equipment</h4>
        <div class="equipment-list">
          <div><strong>Filter:</strong> ${calc.equipment.filter.type}, ${calc.equipment.filter.flowRate}</div>
          ${calc.equipment.heater ? `<div><strong>Heater:</strong> ${calc.equipment.heater.type}</div>` : ''}
          <div><strong>Lighting:</strong> ${calc.equipment.lighting.type}, ${calc.equipment.lighting.watts}W</div>
          ${calc.equipment.airPump ? `<div><strong>Air Pump:</strong> ${calc.equipment.airPump.type}</div>` : ''}
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>🗓️ Maintenance Schedule</h4>
        <div class="maintenance-schedule">
          <div><strong>Water Changes:</strong> ${calc.maintenance.waterChange.frequency} - ${calc.maintenance.waterChange.amount}</div>
          <div><strong>Glass Cleaning:</strong> ${calc.maintenance.cleaning.glass}</div>
          <div><strong>Substrate Cleaning:</strong> ${calc.maintenance.cleaning.substrate}</div>
          <div><strong>Filter Maintenance:</strong> ${calc.maintenance.cleaning.filter}</div>
          <div><strong>Water Testing:</strong> ${calc.maintenance.testing.frequency} (${calc.maintenance.testing.parameters})</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>💸 Monthly Operating Costs</h4>
        <div class="cost-breakdown">
          <div>Food: $${calc.costs.monthly.breakdown.food}</div>
          <div>Electricity: $${calc.costs.monthly.breakdown.electricity}</div>
          <div>Chemicals/Supplements: $${calc.costs.monthly.breakdown.chemicals}</div>
          <div>Maintenance: $${calc.costs.monthly.breakdown.maintenance}</div>
          <div style="border-top: 1px solid #ddd; padding-top: 0.5rem; margin-top: 0.5rem;">
            <strong>Total: $${calc.costs.monthly.total}/month</strong>
          </div>
          <div style="color: #666; font-size: 0.9rem;">Annual cost: $${calc.costs.yearly.toLocaleString()}</div>
        </div>
      </div>

      ${calc.recommendations.length > 0 ? `
        <div style="margin-top: 2rem;">
          <h4>💡 Recommendations</h4>
          <div class="recommendations">
            ${calc.recommendations.map(rec => `<div>${rec}</div>`).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
        <p><strong>📝 Note:</strong> These calculations are estimates and may vary based on specific conditions, chosen fish species, and equipment quality. For saltwater tanks, consultation with experienced aquarists is highly recommended.</p>
      </div>
    `;

    result.innerHTML = html;
  }
});