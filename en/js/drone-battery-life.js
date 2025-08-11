document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("drone-form");
  const result = document.getElementById("drone-result");

  // Set default values
  const defaultValues = {
    batteryCapacity: 5000,
    batteryVoltage: 14.8,
    droneWeight: 1500,
    payload: 400,
    flightConditions: 'moderate',
    flightStyle: 'normal',
    temperature: 20,
    batteryCondition: 'new'
  };

  // Initialize form with defaults
  Object.keys(defaultValues).forEach(key => {
    const element = document.getElementById(key);
    if (element && element.tagName === 'INPUT') {
      element.value = defaultValues[key];
    } else if (element && element.tagName === 'SELECT') {
      element.value = defaultValues[key];
    }
  });

  // Calculate on form submission and input changes
  form.addEventListener("submit", calculateFlightTime);
  form.addEventListener("input", calculateFlightTime);
  form.addEventListener("change", calculateFlightTime);

  // Calculate initial values
  calculateFlightTime({ preventDefault: () => {} });

  function calculateFlightTime(e) {
    e.preventDefault();

    const batteryCapacity = parseFloat(document.getElementById("batteryCapacity").value) || 5000;
    const batteryVoltage = parseFloat(document.getElementById("batteryVoltage").value) || 14.8;
    const droneWeight = parseFloat(document.getElementById("droneWeight").value) || 1500;
    const payload = parseFloat(document.getElementById("payload").value) || 0;
    const flightConditions = document.getElementById("flightConditions").value || 'moderate';
    const flightStyle = document.getElementById("flightStyle").value || 'normal';
    const temperature = parseFloat(document.getElementById("temperature").value) || 20;
    const batteryCondition = document.getElementById("batteryCondition").value || 'new';

    // Calculate total weight
    const totalWeight = droneWeight + payload;

    // Battery energy in Wh (Watt-hours)
    let batteryEnergyWh = (batteryCapacity * batteryVoltage) / 1000;

    // Apply temperature coefficient
    let tempCoeff = 1.0;
    if (temperature < 0) tempCoeff = 0.7;
    else if (temperature < 10) tempCoeff = 0.85;
    else if (temperature < 20) tempCoeff = 0.95;
    else if (temperature > 40) tempCoeff = 0.9;

    // Apply battery condition coefficient
    const batteryCondCoeff = {
      'new': 1.0,
      'good': 0.9,
      'moderate': 0.75,
      'poor': 0.6
    };

    batteryEnergyWh *= tempCoeff * batteryCondCoeff[batteryCondition];

    // Base power consumption calculation (simplified model)
    // Formula based on weight, aerodynamics, and hover efficiency
    let basePowerW = Math.max(50, (totalWeight * 0.15)); // Base consumption in Watts

    // Flight style multiplier
    const flightStyleMultiplier = {
      'smooth': 0.8,
      'normal': 1.0,
      'aggressive': 1.4,
      'hover': 1.2
    };

    // Weather conditions multiplier
    const weatherMultiplier = {
      'calm': 1.0,
      'moderate': 1.25,
      'windy': 1.6,
      'extreme': 2.2
    };

    const totalPowerW = basePowerW * flightStyleMultiplier[flightStyle] * weatherMultiplier[flightConditions];

    // Flight time in hours
    const flightTimeHours = batteryEnergyWh / totalPowerW;
    const flightTimeMinutes = flightTimeHours * 60;

    // Safety margin (reserve 25% for safe return)
    const safeFlightTime = flightTimeMinutes * 0.75;

    // Calculate additional metrics
    const totalRange = calculateRange(safeFlightTime, flightStyle);
    const recommendedBatteries = Math.ceil(60 / safeFlightTime); // For 1 hour of operation
    const powerEfficiency = batteryEnergyWh / totalPowerW;

    // Generate insights based on results
    let efficiencyStatus = "info";
    let efficiencyText = "Normal";
    if (safeFlightTime > 25) {
      efficiencyStatus = "success";
      efficiencyText = "Excellent";
    } else if (safeFlightTime < 10) {
      efficiencyStatus = "warning";
      efficiencyText = "Low";
    }

    // Display results
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${efficiencyStatus}">
          <h6>🕐 Flight Time</h6>
          <div class="big-number">${safeFlightTime.toFixed(1)}</div>
          <div class="result-value">minutes (with reserve)</div>
        </div>

        <div class="insight-card info">
          <h6>📏 Estimated Range</h6>
          <div class="big-number">${totalRange.toFixed(1)}</div>
          <div class="result-value">km (round trip)</div>
        </div>

        <div class="insight-card">
          <h6>⚡ Power Consumption</h6>
          <div class="big-number">${totalPowerW.toFixed(0)}</div>
          <div class="result-value">Watts</div>
        </div>

        <div class="insight-card">
          <h6>🔋 Efficiency</h6>
          <div class="result-value">${efficiencyText}</div>
          <div>${powerEfficiency.toFixed(2)} hrs/W</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 Detailed Analysis</h4>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>🔍 Calculation Parameters</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div>• <strong>Total weight:</strong> ${totalWeight.toFixed(0)} g</div>
            <div>• <strong>Battery energy:</strong> ${batteryEnergyWh.toFixed(1)} Wh</div>
            <div>• <strong>Theoretical time:</strong> ${flightTimeMinutes.toFixed(1)} min</div>
            <div>• <strong>Battery reserve:</strong> 25% (safety)</div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>⚠️ Recommendations</h5>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${generateRecommendations(safeFlightTime, totalWeight, flightConditions, temperature)}
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>📈 Additional Information</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div><strong>Batteries for 1 hour operation:</strong> ${recommendedBatteries}</div>
            <div><strong>Maximum range:</strong> ${(totalRange * 1.33).toFixed(1)} km</div>
            <div><strong>Charging time (1C):</strong> ${(batteryCapacity / 1000).toFixed(1)} hrs</div>
            <div><strong>Energy efficiency:</strong> ${(safeFlightTime / totalWeight * 1000).toFixed(2)} min/kg</div>
          </div>
        </div>
      </div>
    `;
  }

  function calculateRange(flightTimeMinutes, flightStyle) {
    // Average speed based on flight style (km/h)
    const speeds = {
      'smooth': 25,
      'normal': 35,
      'aggressive': 45,
      'hover': 15
    };
    
    const speed = speeds[flightStyle] || 35;
    // Return trip calculation (60% of time for forward flight)
    return (flightTimeMinutes / 60) * speed * 0.6;
  }

  function generateRecommendations(flightTime, weight, conditions, temperature) {
    let recommendations = [];

    if (flightTime < 10) {
      recommendations.push('<li>🔋 <strong>Critically short time!</strong> Consider higher capacity battery or reduce weight</li>');
    }

    if (weight > 2000) {
      recommendations.push('<li>🏋️ Excessive weight may reduce efficiency - verify all equipment is necessary</li>');
    }

    if (conditions === 'windy' || conditions === 'extreme') {
      recommendations.push('<li>💨 In strong wind conditions consider postponing flight or reducing payload</li>');
    }

    if (temperature < 10) {
      recommendations.push('<li>🌡️ Low temperature detected - preheat battery before flight and keep spares warm</li>');
    }

    if (flightTime > 20) {
      recommendations.push('<li>✅ Excellent efficiency! Your configuration is optimally balanced</li>');
    }

    recommendations.push('<li>📏 Always plan return route considering 30% battery reserve checkpoint</li>');
    recommendations.push('<li>🔧 Regularly calibrate compass and check propeller condition for maximum efficiency</li>');

    return recommendations.join('\n            ');
  }
});