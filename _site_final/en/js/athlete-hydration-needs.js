document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('athlete-hydration-needs-form');
  const result = document.getElementById('athlete-hydration-needs-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const sportType = form['sport-type'].value;
    const durationHours = +form['duration-hours'].value;
    const durationMinutes = +(form['duration-minutes'].value || 0);
    const intensity = form.intensity.value;
    const tempInput = +form.temperature.value;
    const tempUnit = form['temp-unit'].value;
    const humidity = form.humidity.value;
    const environment = form.environment.value;
    const sweatRateInput = form['sweat-rate'].value;
    const trainingPhase = form['training-phase'].value;
    const acclimatization = form.acclimatization.value;
    const sessionType = form['session-type'].value;
    const hydrationAccess = form['hydration-access'].value;

    // Validation
    if (!weightInput || !sportType || !durationHours || !intensity || !tempInput || 
        !humidity || !environment || !trainingPhase || !acclimatization || 
        !sessionType || !hydrationAccess) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields.</p>';
      return;
    }

    // Convert units
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;
    const tempCelsius = tempUnit === 'fahrenheit' ? (tempInput - 32) * 5/9 : tempInput;
    const totalDurationHours = durationHours + (durationMinutes / 60);

    // Estimate sweat rate if not provided
    let sweatRate;
    if (sweatRateInput) {
      sweatRate = +sweatRateInput;
    } else {
      // Base sweat rate calculation (L/hour)
      let baseSweatRate = 0.8; // Starting point for athletes
      
      // Adjust for body weight
      baseSweatRate += (weight - 70) * 0.01;
      
      // Adjust for sport type
      const sportMultipliers = {
        'endurance': 1.3,
        'team-sports': 1.2,
        'strength-power': 1.0,
        'combat': 1.4,
        'racquet': 1.2,
        'water-sports': 0.7, // Less sweat loss in water
        'aesthetic': 1.1,
        'outdoor': 1.2,
        'multiple': 1.2
      };
      baseSweatRate *= sportMultipliers[sportType];
      
      // Adjust for intensity
      const intensityMultipliers = {
        'light': 0.7,
        'moderate': 1.0,
        'vigorous': 1.3,
        'high': 1.5,
        'maximal': 1.7
      };
      baseSweatRate *= intensityMultipliers[intensity];
      
      // Temperature adjustment
      if (tempCelsius > 25) {
        baseSweatRate *= 1.0 + (tempCelsius - 25) * 0.04;
      } else if (tempCelsius < 15) {
        baseSweatRate *= 0.8;
      }
      
      // Humidity adjustment
      const humidityMultipliers = {
        'low': 0.9,
        'moderate': 1.0,
        'high': 1.2,
        'very-high': 1.4
      };
      baseSweatRate *= humidityMultipliers[humidity];
      
      // Environment adjustment
      const environmentMultipliers = {
        'indoor-ac': 0.8,
        'indoor-no-ac': 1.0,
        'outdoor-shade': 1.1,
        'outdoor-sun': 1.3,
        'pool': 0.6,
        'altitude': 1.2
      };
      baseSweatRate *= environmentMultipliers[environment];
      
      // Acclimatization adjustment
      const acclimMultipliers = {
        'none': 1.2,
        'partial': 1.1,
        'full': 1.0,
        'resident': 0.95
      };
      baseSweatRate *= acclimMultipliers[acclimatization];
      
      sweatRate = Math.max(0.5, Math.min(4.0, baseSweatRate));
    }

    // Calculate total fluid losses
    const totalFluidLoss = sweatRate * totalDurationHours;
    
    // Pre-exercise hydration (ml/kg body weight)
    const preExercise4h = weight * 6; // 6ml/kg 4 hours before
    const preExercise2h = weight * 4; // 4ml/kg 2 hours before (if needed)
    const preExercise30min = 250; // 250ml 30 min before

    // During-exercise hydration strategy
    let duringExerciseStrategy = '';
    let targetFluidIntake = 0;
    let sodiumNeeds = 0;
    
    if (totalDurationHours <= 0.5) {
      // Short sessions - minimal during-exercise needs
      targetFluidIntake = 0;
      duringExerciseStrategy = 'Short session - focus on pre and post hydration';
    } else if (totalDurationHours <= 1) {
      // Medium sessions - moderate intake
      targetFluidIntake = totalFluidLoss * 0.5;
      sodiumNeeds = 200 * totalDurationHours;
      duringExerciseStrategy = 'Moderate fluid replacement during exercise';
    } else {
      // Long sessions - aggressive replacement
      targetFluidIntake = totalFluidLoss * 0.8;
      sodiumNeeds = 400 * totalDurationHours;
      duringExerciseStrategy = 'Aggressive fluid replacement to match sweat losses';
    }

    // Adjust for hydration access
    const accessMultipliers = {
      'unlimited': 1.0,
      'limited': 0.7,
      'scheduled': 0.6,
      'minimal': 0.3
    };
    targetFluidIntake *= accessMultipliers[hydrationAccess];

    // Post-exercise rehydration (150% of losses)
    const postExerciseFluid = totalFluidLoss * 1.5;
    const postExerciseSodium = totalFluidLoss * 1200; // mg (1.2g per liter)

    // Calculate practical drinking schedule
    const calculateDrinkingSchedule = () => {
      if (targetFluidIntake === 0) return null;
      
      const drinkingOpportunities = Math.max(1, Math.floor(totalDurationHours * 4)); // Every 15 min
      const mlPerOpportunity = Math.round(targetFluidIntake * 1000 / drinkingOpportunities);
      const intervalMinutes = Math.round((totalDurationHours * 60) / drinkingOpportunities);
      
      return {
        frequency: `Every ${intervalMinutes} minutes`,
        volume: `${mlPerOpportunity}ml`,
        opportunities: drinkingOpportunities
      };
    };

    const drinkingSchedule = calculateDrinkingSchedule();

    // Generate recommendations based on conditions
    let recommendations = [];
    
    if (tempCelsius > 30) {
      recommendations.push('🌡️ Extreme heat warning: Consider pre-cooling strategies (cold shower, ice vest)');
    }
    
    if (humidity === 'very-high' && tempCelsius > 25) {
      recommendations.push('💨 High heat stress: Reduce intensity if possible, take frequent breaks');
    }
    
    if (sweatRate > 2.5) {
      recommendations.push('💧 High sweat rate: You\'re a heavy sweater - prioritize sodium replacement');
    }
    
    if (sessionType === 'competition') {
      recommendations.push('🏆 Competition day: Stick to your tested hydration strategy, no experiments');
    }
    
    if (sessionType === 'multiple-sessions') {
      recommendations.push('🔄 Multiple sessions: Complete rehydration between sessions is critical');
    }
    
    if (hydrationAccess === 'limited' || hydrationAccess === 'minimal') {
      recommendations.push('⏰ Limited access: Maximize pre-hydration and immediate post-exercise replacement');
    }
    
    if (sportType === 'water-sports') {
      recommendations.push('🏊 Water sports: Don\'t assume you\'re hydrated because you\'re in water');
    }
    
    if (environment === 'altitude') {
      recommendations.push('⛰️ High altitude: Increased fluid needs due to higher respiratory losses');
    }

    // Warnings
    let warnings = [];
    
    if (totalFluidLoss > 3) {
      warnings.push('⚠️ Very high fluid losses expected - monitor for signs of heat illness');
    }
    
    if (targetFluidIntake > 1.5 && totalDurationHours < 2) {
      warnings.push('⚠️ High fluid intake rate - practice in training to avoid GI distress');
    }
    
    if (acclimatization === 'none' && (tempCelsius > 28 || humidity === 'very-high')) {
      warnings.push('⚠️ Heat stress risk: Consider acclimatization period before intense training');
    }

    // Format helper functions
    const formatFluid = (liters) => {
      if (liters < 1) {
        return `${Math.round(liters * 1000)} ml`;
      }
      return `${liters.toFixed(1)} L (${Math.round(liters * 1000)} ml)`;
    };

    const formatSodium = (mg) => {
      if (mg >= 1000) {
        return `${(mg/1000).toFixed(1)}g`;
      }
      return `${Math.round(mg)}mg`;
    };

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Athletic Hydration Plan</h3>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Session Overview</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div><strong>Sport:</strong> ${sportType.charAt(0).toUpperCase() + sportType.slice(1).replace('-', ' ')}</div>
            <div><strong>Duration:</strong> ${durationHours}h ${durationMinutes}m</div>
            <div><strong>Intensity:</strong> ${intensity.charAt(0).toUpperCase() + intensity.slice(1)}</div>
            <div><strong>Temperature:</strong> ${tempInput}°${tempUnit.charAt(0).toUpperCase()}</div>
            <div><strong>Weight:</strong> ${weightInput} ${weightUnit}</div>
            <div><strong>Estimated Sweat Rate:</strong> ${sweatRate.toFixed(1)} L/hour</div>
          </div>
          <div style="margin-top:15px;padding:15px;background:#fff3cd;border-radius:6px;">
            <strong>Expected Fluid Loss:</strong> <span style="color:#856404;font-size:1.1em;">${formatFluid(totalFluidLoss)}</span>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Pre-Exercise Hydration Protocol</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#e3f2fd;border-radius:6px;">
              <div style="font-weight:bold;color:#1976d2;">4 Hours Before</div>
              <div style="font-size:1.2em;color:#1976d2;">${formatFluid(preExercise4h/1000)}</div>
              <div style="color:#666;font-size:0.9em;">Primary hydration phase</div>
            </div>
            <div style="text-align:center;padding:15px;background:#e8f5e8;border-radius:6px;">
              <div style="font-weight:bold;color:#388e3c;">2 Hours Before</div>
              <div style="font-size:1.2em;color:#388e3c;">${formatFluid(preExercise2h/1000)}</div>
              <div style="color:#666;font-size:0.9em;">If urine not pale yellow</div>
            </div>
            <div style="text-align:center;padding:15px;background:#fff3e0;border-radius:6px;">
              <div style="font-weight:bold;color:#f57c00;">30 Min Before</div>
              <div style="font-size:1.2em;color:#f57c00;">${formatFluid(preExercise30min/1000)}</div>
              <div style="color:#666;font-size:0.9em;">Final preparation</div>
            </div>
          </div>
        </div>

        ${targetFluidIntake > 0 ? `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">During-Exercise Hydration</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;margin:10px 0;">
            <div style="text-align:center;">
              <div style="font-size:1.3em;font-weight:bold;color:#155724;">Target: ${formatFluid(targetFluidIntake)}</div>
              <div style="color:#155724;margin:5px 0;">${duringExerciseStrategy}</div>
            </div>
          </div>
          
          ${drinkingSchedule ? `
          <div style="background:#f8f9fa;padding:15px;border-radius:6px;margin:10px 0;">
            <h5 style="margin-top:0;">Drinking Schedule</h5>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
              <div><strong>Frequency:</strong> ${drinkingSchedule.frequency}</div>
              <div><strong>Volume:</strong> ${drinkingSchedule.volume}</div>
              <div><strong>Total drinks:</strong> ${drinkingSchedule.opportunities}</div>
            </div>
          </div>
          ` : ''}
          
          ${sodiumNeeds > 0 ? `
          <div style="background:#e2e3e5;padding:10px;border-radius:4px;">
            <strong>Sodium Replacement:</strong> ${formatSodium(sodiumNeeds)} total (${formatSodium(sodiumNeeds/totalDurationHours)} per hour)
          </div>
          ` : ''}
        </div>
        ` : `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">During-Exercise Hydration</h4>
          <div style="background:#f8d7da;padding:15px;border-radius:6px;">
            <p style="color:#721c24;margin:0;"><strong>Short Session:</strong> Focus on pre and post-exercise hydration. Small sips if thirsty.</p>
          </div>
        </div>
        `}

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Post-Exercise Recovery</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#f8d7da;border-radius:6px;">
              <div style="font-weight:bold;color:#721c24;">Immediate (0-30 min)</div>
              <div style="font-size:1.2em;color:#721c24;">Start rehydration</div>
              <div style="color:#666;font-size:0.9em;">Begin within 30 minutes</div>
            </div>
            <div style="text-align:center;padding:15px;background:#d1ecf1;border-radius:6px;">
              <div style="font-weight:bold;color:#0c5460;">Total Recovery</div>
              <div style="font-size:1.2em;color:#0c5460;">${formatFluid(postExerciseFluid)}</div>
              <div style="color:#666;font-size:0.9em;">150% of losses</div>
            </div>
            <div style="text-align:center;padding:15px;background:#e2e3e5;border-radius:6px;">
              <div style="font-weight:bold;color:#383d41;">With Sodium</div>
              <div style="font-size:1.2em;color:#383d41;">${formatSodium(postExerciseSodium)}</div>
              <div style="color:#666;font-size:0.9em;">For fluid retention</div>
            </div>
          </div>
          <div style="background:#fff3cd;padding:10px;border-radius:4px;margin-top:10px;">
            <strong>Timeline:</strong> Complete rehydration within 6 hours for next-day training
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Hydration Monitoring</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div>
              <strong>🏋️ Body Weight:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Weigh before and after exercise</li>
                <li>1kg loss = ~1L fluid deficit</li>
                <li>Target <2% weight loss</li>
              </ul>
            </div>
            <div>
              <strong>🚽 Urine Check:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Pale yellow = well hydrated</li>
                <li>Dark yellow = dehydrated</li>
                <li>Monitor volume and frequency</li>
              </ul>
            </div>
            <div>
              <strong>💓 Performance Signs:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Maintain usual training pace</li>
                <li>Normal heart rate response</li>
                <li>No excessive fatigue</li>
              </ul>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Personalized Recommendations</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Important Warnings</h4>
          <ul style="margin:5px 0;color:#856404;">
            ${warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🎯 Key Success Strategies</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>📋 Before Training:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Check urine color (pale yellow)</li>
                <li>Start hydrating 4 hours early</li>
                <li>Include sodium for long sessions</li>
              </ul>
            </div>
            <div>
              <strong>⏰ During Training:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Start drinking within 15-20 minutes</li>
                <li>Small, frequent sips vs. large volumes</li>
                <li>Don't wait until you feel thirsty</li>
              </ul>
            </div>
            <div>
              <strong>🔄 After Training:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Begin rehydration immediately</li>
                <li>Include sodium to retain fluids</li>
                <li>Monitor urine color recovery</li>
              </ul>
            </div>
            <div>
              <strong>📊 Track & Adjust:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Test strategies in training</li>
                <li>Calculate personal sweat rate</li>
                <li>Adjust for conditions</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#721c24;">🚨 Seek Medical Help If You Experience:</h4>
          <ul style="margin:0;color:#721c24;font-size:0.9em;">
            <li>Dizziness, confusion, or altered mental state</li>
            <li>Nausea, vomiting, or severe headache</li>
            <li>No sweating despite heat and exertion</li>
            <li>Rapid heart rate that doesn't decrease with rest</li>
            <li>Muscle cramps that don't resolve with stretching</li>
            <li>Signs of heat exhaustion or heat stroke</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});