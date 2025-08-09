document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('water-intake-marathon-form');
  const result = document.getElementById('water-intake-marathon-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const hours = +form.hours.value;
    const minutes = +form.minutes.value;
    const tempInput = +form.temperature.value;
    const tempUnit = form['temp-unit'].value;
    const humidity = form.humidity.value;
    const wind = form.wind.value;
    const sweatRateInput = form['sweat-rate'].value;
    const fitness = form.fitness.value;
    const acclimatization = form.acclimatization.value;

    // Validation
    if (!weightInput || !hours || minutes < 0 || !tempInput || !humidity || !wind || !fitness || !acclimatization) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields.</p>';
      return;
    }

    if (hours < 2 || hours > 8) {
      result.innerHTML = '<p style="color:red;">Marathon time should be between 2 and 8 hours.</p>';
      return;
    }

    // Convert units
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;
    const tempCelsius = tempUnit === 'fahrenheit' ? (tempInput - 32) * 5/9 : tempInput;
    const raceTimeHours = hours + (minutes / 60);

    // Humidity factors
    const humidityFactors = {
      'low': 0.9,
      'moderate': 1.0,
      'high': 1.2,
      'very-high': 1.4
    };

    // Wind factors
    const windFactors = {
      'none': 1.1,
      'light': 1.0,
      'moderate': 0.95,
      'strong': 0.9
    };

    // Fitness factors (affect baseline sweat rate)
    const fitnessFactors = {
      'beginner': 1.0,
      'recreational': 1.1,
      'experienced': 1.2,
      'elite': 1.3
    };

    // Acclimatization factors
    const acclimFactors = {
      'none': 1.2,
      'partial': 1.05,
      'full': 1.0
    };

    // Calculate or use provided sweat rate
    let sweatRate;
    if (sweatRateInput) {
      sweatRate = +sweatRateInput;
    } else {
      // Base sweat rate calculation (L/hour)
      // Base rate: 0.4-0.8 L/hour for average person during exercise
      let baseSweatRate = 0.5 + (weight - 60) * 0.005; // Adjust for weight
      
      // Temperature adjustment
      if (tempCelsius > 25) {
        baseSweatRate *= 1.0 + (tempCelsius - 25) * 0.03;
      } else if (tempCelsius < 15) {
        baseSweatRate *= 0.8;
      }
      
      // Apply factors
      sweatRate = baseSweatRate * 
                  humidityFactors[humidity] * 
                  windFactors[wind] * 
                  fitnessFactors[fitness] * 
                  acclimFactors[acclimatization];
    }

    // Total fluid loss during race
    const totalFluidLoss = sweatRate * raceTimeHours;
    
    // Recommended fluid intake during race (80-100% of sweat loss to prevent overhydration)
    const duringRaceIntake = totalFluidLoss * 0.9;
    
    // Per hour intake
    const perHourIntake = duringRaceIntake / raceTimeHours;
    
    // Pre-race hydration (2-4 hours before)
    const preRaceIntake = weight * 0.007; // 7ml per kg body weight
    
    // Post-race recovery (150% of net fluid loss)
    const postRaceIntake = totalFluidLoss * 1.5;
    
    // Aid station strategy (assuming stations every 5km, ~20 stations)
    const aidStations = 20;
    const perStationIntake = (duringRaceIntake * 1000) / aidStations; // in ml

    // Format helper
    const formatFluid = (liters) => {
      if (liters < 1) {
        return `${Math.round(liters * 1000)} ml`;
      }
      return `${liters.toFixed(1)} L (${Math.round(liters * 1000)} ml)`;
    };

    // Generate warnings based on conditions
    let warnings = [];
    if (tempCelsius > 28) {
      warnings.push("⚠️ High temperature risk: Consider delaying start or increasing cooling strategies");
    }
    if (humidity === 'very-high' && tempCelsius > 22) {
      warnings.push("⚠️ High heat stress conditions: Monitor for heat illness symptoms");
    }
    if (sweatRate > 2.5) {
      warnings.push("⚠️ Very high sweat rate: Consider electrolyte replacement and practice hydration strategy");
    }
    if (perHourIntake > 1.0) {
      warnings.push("⚠️ High fluid needs: Practice drinking this volume during training to avoid GI distress");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Marathon Hydration Plan</h3>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Race Conditions Summary</h4>
          <p><strong>Weight:</strong> ${weightInput} ${weightUnit} ${weightUnit === 'lbs' ? `(${weight.toFixed(1)} kg)` : ''}</p>
          <p><strong>Race Time:</strong> ${hours}h ${minutes}m (${raceTimeHours.toFixed(1)} hours)</p>
          <p><strong>Temperature:</strong> ${tempInput}°${tempUnit.charAt(0).toUpperCase()} ${tempUnit === 'fahrenheit' ? `(${tempCelsius.toFixed(1)}°C)` : ''}</p>
          <p><strong>Estimated Sweat Rate:</strong> ${sweatRate.toFixed(1)} L/hour</p>
          <p><strong>Total Expected Fluid Loss:</strong> <span style="color:#dc3545;">${formatFluid(totalFluidLoss)}</span></p>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Hydration Schedule</h4>
          
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin:15px 0;">
            <div style="background:#e3f2fd;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#1976d2;margin-bottom:8px;">Pre-Race</div>
              <div style="font-size:1.2em;font-weight:bold;">${formatFluid(preRaceIntake)}</div>
              <div style="color:#666;font-size:0.9em;">2-4 hours before start</div>
            </div>
            
            <div style="background:#e8f5e8;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#388e3c;margin-bottom:8px;">During Race</div>
              <div style="font-size:1.2em;font-weight:bold;">${formatFluid(perHourIntake)}/hour</div>
              <div style="color:#666;font-size:0.9em;">Total: ${formatFluid(duringRaceIntake)}</div>
            </div>
            
            <div style="background:#fff3e0;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#f57c00;margin-bottom:8px;">Post-Race</div>
              <div style="font-size:1.2em;font-weight:bold;">${formatFluid(postRaceIntake)}</div>
              <div style="color:#666;font-size:0.9em;">For full recovery</div>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Aid Station Strategy</h4>
          <p><strong>Per Aid Station:</strong> <span style="color:#157aff;font-size:1.1em;">${Math.round(perStationIntake)} ml</span></p>
          <p style="color:#666;font-size:0.9em;">Assuming ~20 aid stations (every 2km). Adjust based on actual course layout.</p>
          <div style="background:#f0f0f0;padding:10px;border-radius:4px;margin-top:10px;">
            <strong>Strategy Tips:</strong>
            <ul style="margin:5px 0;">
              <li>Don't skip early aid stations - start hydrating from km 5-10</li>
              <li>Drink small amounts frequently rather than large gulps</li>
              <li>Walk through aid stations if needed to drink properly</li>
              <li>Consider sports drinks for electrolyte replacement after hour 1</li>
            </ul>
          </div>
        </div>

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Important Warnings</h4>
          <ul style="margin:0;color:#856404;">
            ${warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#155724;">💡 Key Reminders</h4>
          <ul style="margin:0;color:#155724;">
            <li><strong>Practice:</strong> Test this hydration plan during long training runs</li>
            <li><strong>Listen to your body:</strong> Adjust based on thirst and comfort</li>
            <li><strong>Electrolytes:</strong> Include sodium (200-700mg/hour) for races >1 hour</li>
            <li><strong>Temperature matters:</strong> Cooler fluids are absorbed faster</li>
            <li><strong>Start early:</strong> Begin hydrating 2-3 days before the race</li>
            <li><strong>Recovery:</strong> Continue hydrating post-race until urine is pale yellow</li>
          </ul>
        </div>

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#721c24;">🚨 Seek Medical Help If You Experience:</h4>
          <ul style="margin:0;color:#721c24;font-size:0.9em;">
            <li>Dizziness, confusion, or altered mental state</li>
            <li>Nausea, vomiting, or severe headache</li>
            <li>No sweating despite heat</li>
            <li>Swollen hands, feet, or face during/after race</li>
            <li>Dark urine or no urination for several hours post-race</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});