document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ev-range-form");
  if (!form) return;

  // Vehicle database with specifications
  const vehicleDatabase = {
    "tesla-model-3": { batteryCapacity: 75, epaRange: 358, efficiency: 4.8 },
    "tesla-model-y": { batteryCapacity: 75, epaRange: 326, efficiency: 4.3 },
    "tesla-model-s": { batteryCapacity: 100, epaRange: 405, efficiency: 4.1 },
    "ford-mustang-mache": { batteryCapacity: 88, epaRange: 314, efficiency: 3.6 },
    "nissan-leaf": { batteryCapacity: 62, epaRange: 226, efficiency: 3.6 },
    "chevy-bolt": { batteryCapacity: 65, epaRange: 259, efficiency: 4.0 },
    "bmw-i4": { batteryCapacity: 84, epaRange: 324, efficiency: 3.9 },
    "audi-etron": { batteryCapacity: 95, epaRange: 222, efficiency: 2.3 },
    "hyundai-ioniq5": { batteryCapacity: 77, epaRange: 303, efficiency: 3.9 },
    "volkswagen-id4": { batteryCapacity: 82, epaRange: 275, efficiency: 3.4 }
  };

  // Update form fields when vehicle model changes
  document.getElementById("evModel").addEventListener("change", function() {
    const vehicle = vehicleDatabase[this.value];
    if (vehicle) {
      document.getElementById("batteryCapacity").value = vehicle.batteryCapacity;
      document.getElementById("epaRange").value = vehicle.epaRange;
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const evModel = document.getElementById("evModel").value;
    const batteryCapacity = parseFloat(document.getElementById("batteryCapacity").value);
    const epaRange = parseFloat(document.getElementById("epaRange").value);
    const currentBattery = parseFloat(document.getElementById("currentBattery").value) / 100;
    const outsideTemperature = parseFloat(document.getElementById("outsideTemperature").value);
    const weatherCondition = document.getElementById("weatherCondition").value;
    const terrain = document.getElementById("terrain").value;
    const drivingType = document.getElementById("drivingType").value;
    const averageSpeed = parseFloat(document.getElementById("averageSpeed").value);
    const drivingStyle = document.getElementById("drivingStyle").value;
    const trafficLevel = document.getElementById("trafficLevel").value;
    const hvacUsage = document.getElementById("hvacUsage").value;
    const passengerCount = parseInt(document.getElementById("passengerCount").value);
    const cargoWeight = parseFloat(document.getElementById("cargoWeight").value);
    const preconditioning = document.getElementById("preconditioning").value === "yes";
    const electricityRate = parseFloat(document.getElementById("electricityRate").value);
    const chargingEfficiency = parseFloat(document.getElementById("chargingEfficiency").value) / 100;
    const targetChargeLevel = parseFloat(document.getElementById("targetChargeLevel").value) / 100;

    // Calculate baseline efficiency (miles per kWh)
    const baseEfficiency = epaRange / batteryCapacity;

    // Calculate range impact factors
    const temperatureImpact = calculateTemperatureImpact(outsideTemperature, preconditioning);
    const weatherImpact = calculateWeatherImpact(weatherCondition);
    const terrainImpact = calculateTerrainImpact(terrain);
    const drivingImpact = calculateDrivingImpact(drivingType, averageSpeed, drivingStyle, trafficLevel);
    const hvacImpact = calculateHVACImpact(hvacUsage, outsideTemperature);
    const loadImpact = calculateLoadImpact(passengerCount, cargoWeight);

    // Calculate total impact factor
    const totalImpactFactor = temperatureImpact * weatherImpact * terrainImpact * 
                             drivingImpact * hvacImpact * loadImpact;

    // Calculate adjusted efficiency and range
    const adjustedEfficiency = baseEfficiency * totalImpactFactor;
    const availableCapacity = batteryCapacity * currentBattery;
    const estimatedRange = availableCapacity * adjustedEfficiency;

    // Calculate range at different battery levels
    const rangeAtLevels = [
      { level: 100, range: batteryCapacity * adjustedEfficiency },
      { level: 90, range: batteryCapacity * 0.9 * adjustedEfficiency },
      { level: 80, range: batteryCapacity * 0.8 * adjustedEfficiency },
      { level: 70, range: batteryCapacity * 0.7 * adjustedEfficiency },
      { level: 50, range: batteryCapacity * 0.5 * adjustedEfficiency },
      { level: 20, range: batteryCapacity * 0.2 * adjustedEfficiency }
    ];

    // Calculate charging information
    const chargingAnalysis = calculateChargingAnalysis(
      batteryCapacity, currentBattery, targetChargeLevel, 
      electricityRate, chargingEfficiency
    );

    // Generate trip planning data
    const tripPlanning = generateTripPlanning(estimatedRange, adjustedEfficiency);

    // Get efficiency rating
    const efficiencyRating = getEfficiencyRating(adjustedEfficiency, baseEfficiency);

    // Create impact breakdown for chart
    const impactBreakdown = {
      temperature: (1 - temperatureImpact) * 100,
      weather: (1 - weatherImpact) * 100,
      terrain: (1 - terrainImpact) * 100,
      driving: (1 - drivingImpact) * 100,
      hvac: (1 - hvacImpact) * 100,
      load: (1 - loadImpact) * 100
    };

    // Display results
    displayResults({
      evModel,
      batteryCapacity,
      epaRange,
      currentBattery: currentBattery * 100,
      baseEfficiency,
      adjustedEfficiency,
      estimatedRange,
      totalImpactFactor,
      rangeAtLevels,
      chargingAnalysis,
      tripPlanning,
      efficiencyRating,
      impactBreakdown,
      outsideTemperature,
      drivingType,
      hvacUsage
    });

    // Show impact factors chart
    showImpactChart(impactBreakdown);
  });

  function calculateTemperatureImpact(temperature, preconditioning) {
    // Optimal temperature range is 65-75°F
    let impact = 1.0;
    
    if (temperature < 32) {
      impact = 0.6; // 40% reduction in freezing
    } else if (temperature < 50) {
      impact = 0.7; // 30% reduction in cold
    } else if (temperature < 65) {
      impact = 0.85; // 15% reduction
    } else if (temperature > 85) {
      impact = 0.9; // 10% reduction in heat
    } else if (temperature > 95) {
      impact = 0.85; // 15% reduction in very hot
    }
    
    // Preconditioning helps in extreme temperatures
    if (preconditioning && (temperature < 50 || temperature > 85)) {
      impact += 0.05; // 5% improvement
    }
    
    return Math.max(0.5, Math.min(1.0, impact));
  }

  function calculateWeatherImpact(weather) {
    const impacts = {
      clear: 1.0,
      cloudy: 0.98,
      rain: 0.95,
      snow: 0.85,
      wind: 0.92
    };
    return impacts[weather] || 1.0;
  }

  function calculateTerrainImpact(terrain) {
    const impacts = {
      flat: 1.0,
      rolling: 0.92,
      mountainous: 0.8,
      city: 1.05 // Regen braking helps
    };
    return impacts[terrain] || 1.0;
  }

  function calculateDrivingImpact(type, speed, style, traffic) {
    let impact = 1.0;
    
    // Driving type impact
    const typeImpacts = {
      city: 1.1, // Better efficiency due to regen
      mixed: 1.0,
      highway: 0.85,
      suburban: 0.95
    };
    impact *= typeImpacts[type] || 1.0;
    
    // Speed impact (efficiency drops significantly above 65 mph)
    if (speed > 75) {
      impact *= 0.75;
    } else if (speed > 65) {
      impact *= 0.85;
    } else if (speed > 55) {
      impact *= 0.95;
    }
    
    // Driving style impact
    const styleImpacts = {
      eco: 1.15,
      normal: 1.0,
      sport: 0.8
    };
    impact *= styleImpacts[style] || 1.0;
    
    // Traffic impact
    const trafficImpacts = {
      light: 1.0,
      moderate: 0.95,
      heavy: 1.05 // Stop-and-go can help with regen
    };
    impact *= trafficImpacts[traffic] || 1.0;
    
    return Math.max(0.6, Math.min(1.2, impact));
  }

  function calculateHVACImpact(usage, temperature) {
    let impact = 1.0;
    
    const usageImpacts = {
      off: 1.0,
      minimal: 0.98,
      moderate: 0.9,
      heavy: 0.8
    };
    
    impact *= usageImpacts[usage] || 1.0;
    
    // HVAC impact is greater in extreme temperatures
    if (temperature < 32 || temperature > 90) {
      impact *= 0.95; // Additional 5% impact in extreme weather
    }
    
    return Math.max(0.7, impact);
  }

  function calculateLoadImpact(passengers, cargoWeight) {
    // Base impact from passenger count
    let impact = 1.0 - ((passengers - 1) * 0.02); // 2% per additional passenger
    
    // Cargo weight impact (every 100 lbs reduces efficiency by ~1%)
    impact -= (cargoWeight / 100) * 0.01;
    
    return Math.max(0.85, impact);
  }

  function calculateChargingAnalysis(capacity, currentLevel, targetLevel, rate, efficiency) {
    const currentkWh = capacity * currentLevel;
    const targetkWh = capacity * targetLevel;
    const kWhNeeded = targetkWh - currentkWh;
    const kWhFromGrid = kWhNeeded / efficiency;
    const chargingCost = kWhFromGrid * rate;
    
    // Estimate charging time (simplified - varies by charger type)
    const level1Time = kWhNeeded / 1.4; // 1.4 kW (120V)
    const level2Time = kWhNeeded / 7.2; // 7.2 kW (240V)
    const dcFastTime = kWhNeeded / 50; // 50 kW DC fast charging
    
    return {
      kWhNeeded: kWhNeeded,
      chargingCost: chargingCost,
      chargingTimes: {
        level1: level1Time,
        level2: level2Time,
        dcFast: dcFastTime
      }
    };
  }

  function generateTripPlanning(range, efficiency) {
    const recommendedStops = [];
    const safetyBuffer = 0.2; // 20% safety buffer
    const usableRange = range * (1 - safetyBuffer);
    
    // Generate charging stop recommendations for different trip distances
    const tripDistances = [100, 200, 300, 500, 800];
    
    tripDistances.forEach(distance => {
      if (distance > usableRange) {
        const stopsNeeded = Math.ceil(distance / usableRange) - 1;
        const stopInterval = distance / (stopsNeeded + 1);
        
        recommendedStops.push({
          distance: distance,
          stopsNeeded: stopsNeeded,
          stopInterval: stopInterval,
          timeAdded: stopsNeeded * 0.5 // Assume 30 min per stop
        });
      } else {
        recommendedStops.push({
          distance: distance,
          stopsNeeded: 0,
          stopInterval: distance,
          timeAdded: 0
        });
      }
    });
    
    return {
      usableRange: usableRange,
      costPerMile: 1 / efficiency, // kWh per mile
      recommendedStops: recommendedStops
    };
  }

  function getEfficiencyRating(current, baseline) {
    const ratio = current / baseline;
    
    if (ratio >= 1.1) {
      return { rating: "Excellent", class: "success", description: "Above EPA estimates" };
    } else if (ratio >= 0.9) {
      return { rating: "Good", class: "success", description: "Near EPA estimates" };
    } else if (ratio >= 0.7) {
      return { rating: "Fair", class: "warning", description: "Below EPA estimates" };
    } else {
      return { rating: "Poor", class: "warning", description: "Significantly below EPA" };
    }
  }

  function displayResults(data) {
    const resultBlock = document.getElementById("ev-range-result");
    const modelName = data.evModel === "custom" ? "Custom Vehicle" : 
                     data.evModel.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🚗 Estimated Range</h6>
          <div class="big-number">${data.estimatedRange.toFixed(0)}</div>
          <p class="insight-detail">miles remaining</p>
        </div>
        <div class="insight-card ${data.efficiencyRating.class}">
          <h6>⚡ Efficiency Rating</h6>
          <div class="big-number">${data.efficiencyRating.rating}</div>
          <p class="insight-detail">${data.efficiencyRating.description}</p>
        </div>
        <div class="insight-card warning">
          <h6>📊 Current Efficiency</h6>
          <div class="big-number">${data.adjustedEfficiency.toFixed(1)}</div>
          <p class="insight-detail">miles per kWh</p>
        </div>
        <div class="insight-card success">
          <h6>💰 Cost per Mile</h6>
          <div class="big-number">${(data.tripPlanning.costPerMile * document.getElementById("electricityRate").value).toFixed(3)}</div>
          <p class="insight-detail">$ per mile</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">🔋 ${modelName} Range Analysis</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <h5>📈 Vehicle Performance</h5>
            <p><strong>Battery Capacity:</strong> ${data.batteryCapacity} kWh</p>
            <p><strong>EPA Range:</strong> ${data.epaRange} miles</p>
            <p><strong>EPA Efficiency:</strong> ${data.baseEfficiency.toFixed(1)} mi/kWh</p>
            <p><strong>Current Efficiency:</strong> ${data.adjustedEfficiency.toFixed(1)} mi/kWh</p>
            <p><strong>Efficiency Impact:</strong> ${((data.totalImpactFactor - 1) * 100).toFixed(0)}%</p>
          </div>
          
          <div>
            <h5>🔋 Current Status</h5>
            <p><strong>Battery Level:</strong> ${data.currentBattery.toFixed(0)}%</p>
            <p><strong>Available Energy:</strong> ${(data.batteryCapacity * data.currentBattery / 100).toFixed(1)} kWh</p>
            <p><strong>Estimated Range:</strong> ${data.estimatedRange.toFixed(0)} miles</p>
            <p><strong>Safe Range:</strong> ${data.tripPlanning.usableRange.toFixed(0)} miles (with 20% buffer)</p>
          </div>
          
          <div>
            <h5>⚙️ Current Conditions</h5>
            <p><strong>Temperature:</strong> ${data.outsideTemperature}°F</p>
            <p><strong>Driving Type:</strong> ${data.drivingType}</p>
            <p><strong>HVAC Usage:</strong> ${data.hvacUsage}</p>
            <p><strong>Total Impact:</strong> ${((1 - data.totalImpactFactor) * 100).toFixed(0)}% range reduction</p>
          </div>
        </div>

        <h5>🔋 Range at Different Battery Levels</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          ${data.rangeAtLevels.map(level => `
            <div style="padding: 0.75rem; background: ${level.level <= 20 ? '#ffe8e8' : level.level <= 50 ? '#fff8e1' : '#e8f8e8'}; 
                        border-radius: 8px; text-align: center; border: 2px solid ${level.level <= 20 ? '#dc3545' : level.level <= 50 ? '#ffc107' : '#28a745'};">
              <p style="margin: 0; font-weight: 600;">${level.level}% Battery</p>
              <p style="margin: 0.25rem 0 0 0; font-size: 1.1rem;">${level.range.toFixed(0)} miles</p>
            </div>
          `).join('')}
        </div>

        ${data.chargingAnalysis.kWhNeeded > 0 ? `
          <h5>🔌 Charging to ${(document.getElementById("targetChargeLevel").value)}%</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #4caf50;">
              <h6>Energy & Cost</h6>
              <p>Energy Needed: ${data.chargingAnalysis.kWhNeeded.toFixed(1)} kWh</p>
              <p>Charging Cost: $${data.chargingAnalysis.chargingCost.toFixed(2)}</p>
            </div>
            
            <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h6>Charging Times</h6>
              <p>Level 1 (120V): ${data.chargingAnalysis.chargingTimes.level1.toFixed(1)} hours</p>
              <p>Level 2 (240V): ${data.chargingAnalysis.chargingTimes.level2.toFixed(1)} hours</p>
              <p>DC Fast: ${(data.chargingAnalysis.chargingTimes.dcFast * 60).toFixed(0)} minutes</p>
            </div>
          </div>
        ` : ''}

        <h5>🗺️ Trip Planning Guide</h5>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: var(--accent); color: white;">
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Trip Distance</th>
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Charging Stops</th>
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Stop Interval</th>
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Added Time</th>
              </tr>
            </thead>
            <tbody>
              ${data.tripPlanning.recommendedStops.map(stop => `
                <tr style="background: ${stop.stopsNeeded === 0 ? '#e8f8e8' : stop.stopsNeeded <= 2 ? '#fff8e1' : '#ffe8e8'};">
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;">${stop.distance} miles</td>
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;">${stop.stopsNeeded}</td>
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;">${stop.stopInterval.toFixed(0)} miles</td>
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;">${stop.timeAdded.toFixed(1)} hours</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <h6 style="margin-top: 0; color: #1976d2;">💡 Efficiency Tips</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Precondition battery while plugged in</li>
              <li>Use eco mode for maximum efficiency</li>
              <li>Maintain steady speeds, avoid rapid acceleration</li>
              <li>Use regenerative braking effectively</li>
            </ul>
          </div>
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border: 2px solid #28a745;">
            <h6 style="margin-top: 0; color: #28a745;">🔋 Charging Best Practices</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Charge to 80% for daily use</li>
              <li>Plan stops at 20% remaining charge</li>
              <li>Use DC fast charging for road trips</li>
              <li>Avoid frequent 100% charges</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function showImpactChart(impactData) {
    const chartBlock = document.getElementById("ev-range-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("ev-range-chart").getContext("2d");
      if (window.evRangeChart) window.evRangeChart.destroy();

      const labels = ['Temperature', 'Weather', 'Terrain', 'Driving Style', 'HVAC', 'Vehicle Load'];
      const data = [
        impactData.temperature,
        impactData.weather,
        impactData.terrain,
        impactData.driving,
        impactData.hvac,
        impactData.load
      ];

      window.evRangeChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Range Reduction (%)",
            data: data,
            backgroundColor: [
              '#f44336', '#ff9800', '#9c27b0', '#3f51b5', '#009688', '#795548'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Factors Reducing EV Range from EPA Estimate'
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Range Reduction (%)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Impact Factors'
              }
            }
          }
        }
      });
    });
  }
});

// Ensure Chart.js is loaded
function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}