document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('heat-index-form');
  const result = document.getElementById('heat-index-result');
  const safetyDiv = document.getElementById('safety-recommendations');
  const emergencyDiv = document.getElementById('emergency-info');
  const hydrationDiv = document.getElementById('hydration-guide');
  const workplaceDiv = document.getElementById('workplace-safety');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateHeatIndex();
  });

  function calculateHeatIndex() {
    const temperature = parseFloat(document.getElementById('temperature').value);
    const tempUnit = document.getElementById('tempUnit').value;
    const humidity = parseFloat(document.getElementById('humidity').value);
    const windSpeed = parseFloat(document.getElementById('windSpeed').value) || 0;
    const windUnit = document.getElementById('windUnit').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const activityLevel = document.getElementById('activityLevel').value;
    const exposureTime = parseFloat(document.getElementById('exposureTime').value);

    if (!temperature || !humidity) {
      result.innerHTML = '<div class="error">Please enter temperature and humidity values.</div>';
      return;
    }

    // Convert temperature to Fahrenheit for calculation
    let tempF = temperature;
    if (tempUnit === 'celsius') {
      tempF = (temperature * 9/5) + 32;
    }

    // Calculate heat index using Rothfusz equation
    const heatIndexF = calculateHeatIndexRothfusz(tempF, humidity);
    
    // Convert back to user's preferred unit
    let heatIndexDisplay = heatIndexF;
    let displayUnit = '°F';
    if (tempUnit === 'celsius') {
      heatIndexDisplay = (heatIndexF - 32) * 5/9;
      displayUnit = '°C';
    }

    // Calculate wind chill factor if applicable
    const windSpeedMph = windUnit === 'kmh' ? windSpeed * 0.621371 : windSpeed;
    const adjustedTemp = calculateWindEffect(heatIndexF, windSpeedMph);

    // Assess risk level
    const riskAssessment = assessHeatRisk(heatIndexF, ageGroup, activityLevel, exposureTime);

    displayResults(tempF, humidity, heatIndexF, heatIndexDisplay, displayUnit, windSpeedMph, riskAssessment);
    showSafetyRecommendations(riskAssessment, activityLevel, exposureTime);
    showHydrationGuide(riskAssessment, activityLevel, exposureTime);

    if (document.getElementById('workplaceSafety').checked) {
      showWorkplaceSafety(riskAssessment, heatIndexF);
    }

    if (riskAssessment.level >= 3 || document.getElementById('highRiskAlert').checked) {
      showEmergencyInfo(riskAssessment);
    }
  }

  function calculateHeatIndexRothfusz(tempF, humidity) {
    // Rothfusz equation for heat index calculation
    if (tempF < 80) {
      // Simple formula for lower temperatures
      return 0.5 * (tempF + 61.0 + ((tempF - 68.0) * 1.2) + (humidity * 0.094));
    }

    // Full Rothfusz equation for temperatures 80°F and above
    const T = tempF;
    const RH = humidity;
    
    let HI = -42.379 + 
             2.04901523 * T + 
             10.14333127 * RH - 
             0.22475541 * T * RH - 
             0.00683783 * T * T - 
             0.05481717 * RH * RH + 
             0.00122874 * T * T * RH + 
             0.00085282 * T * RH * RH - 
             0.00000199 * T * T * RH * RH;

    // Adjustments for specific conditions
    if (RH < 13 && T >= 80 && T <= 112) {
      const adjustment = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
      HI -= adjustment;
    } else if (RH > 85 && T >= 80 && T <= 87) {
      const adjustment = ((RH - 85) / 10) * ((87 - T) / 5);
      HI += adjustment;
    }

    return HI;
  }

  function calculateWindEffect(heatIndex, windSpeedMph) {
    // Wind provides cooling effect, but less effective at higher temperatures
    if (windSpeedMph <= 3) {
      return heatIndex; // No significant wind effect
    }

    // Wind cooling becomes less effective as temperature rises above 95°F
    const coolingFactor = Math.max(0, 1 - (heatIndex - 95) / 50);
    const windCooling = Math.min(10, windSpeedMph * 0.7) * coolingFactor;
    
    return heatIndex - windCooling;
  }

  function assessHeatRisk(heatIndexF, ageGroup, activityLevel, exposureTime) {
    let baseRisk = 0;
    let riskLevel = '';
    let description = '';
    let recommendations = [];

    // Base risk from heat index
    if (heatIndexF < 80) {
      baseRisk = 0;
      riskLevel = 'Minimal';
      description = 'Low risk of heat-related illness';
    } else if (heatIndexF < 90) {
      baseRisk = 1;
      riskLevel = 'Caution';
      description = 'Fatigue possible with prolonged exposure';
    } else if (heatIndexF < 105) {
      baseRisk = 2;
      riskLevel = 'Extreme Caution';
      description = 'Heat exhaustion and cramps possible';
    } else if (heatIndexF < 130) {
      baseRisk = 3;
      riskLevel = 'Danger';
      description = 'Heat exhaustion and cramps likely; heat stroke possible';
    } else {
      baseRisk = 4;
      riskLevel = 'Extreme Danger';
      description = 'Heat stroke highly likely';
    }

    // Adjust risk based on personal factors
    let riskMultiplier = 1;

    // Age adjustments
    if (ageGroup === 'child' || ageGroup === 'senior') {
      riskMultiplier += 0.5;
    }

    // Activity level adjustments
    const activityMultipliers = {
      'rest': 0.8,
      'light': 1.0,
      'moderate': 1.3,
      'heavy': 1.6,
      'extreme': 2.0
    };
    riskMultiplier *= activityMultipliers[activityLevel] || 1.0;

    // Exposure time adjustments
    if (exposureTime > 4) {
      riskMultiplier += 0.3;
    } else if (exposureTime > 2) {
      riskMultiplier += 0.2;
    }

    // Health condition adjustments
    if (document.getElementById('heartDisease').checked ||
        document.getElementById('diabetes').checked ||
        document.getElementById('kidneyDisease').checked ||
        document.getElementById('pregnant').checked ||
        document.getElementById('medications').checked) {
      riskMultiplier += 0.5;
    }

    // Fitness level adjustments
    const fitnessLevel = document.getElementById('fitnessLevel').value;
    if (fitnessLevel === 'low') {
      riskMultiplier += 0.3;
    } else if (fitnessLevel === 'high' || fitnessLevel === 'athlete') {
      riskMultiplier -= 0.2;
    }

    // Heat acclimatization adjustments
    const acclimatization = document.getElementById('heatAcclimation').value;
    if (acclimatization === 'none') {
      riskMultiplier += 0.4;
    } else if (acclimatization === 'full') {
      riskMultiplier -= 0.3;
    }

    const adjustedRisk = Math.min(4, Math.max(0, baseRisk * riskMultiplier));

    // Update risk level based on adjusted risk
    if (adjustedRisk > baseRisk + 0.5) {
      if (baseRisk === 0) riskLevel = 'Caution';
      else if (baseRisk === 1) riskLevel = 'Extreme Caution';
      else if (baseRisk === 2) riskLevel = 'Danger';
      else riskLevel = 'Extreme Danger';
    }

    return {
      level: Math.round(adjustedRisk),
      category: riskLevel,
      description: description,
      heatIndex: heatIndexF,
      personalizedRisk: adjustedRisk,
      riskMultiplier: riskMultiplier
    };
  }

  function displayResults(tempF, humidity, heatIndexF, heatIndexDisplay, unit, windSpeed, risk) {
    const tempDiff = heatIndexF - tempF;
    
    let resultHtml = `
      <div class="result-summary">
        <h3>🌡️ Heat Index Analysis</h3>
        <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="result-item">
            <strong>Heat Index:</strong> ${heatIndexDisplay.toFixed(1)}${unit}
          </div>
          <div class="result-item">
            <strong>Feels Like:</strong> ${tempDiff > 0 ? '+' : ''}${tempDiff.toFixed(1)}°F warmer
          </div>
          <div class="result-item risk-${risk.level}">
            <strong>Risk Level:</strong> ${risk.category}
          </div>
          <div class="result-item">
            <strong>Humidity Impact:</strong> ${getHumidityImpact(humidity)}
          </div>
        </div>
      </div>
    `;

    if (windSpeed > 3) {
      resultHtml += `
        <div class="wind-info" style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
          <h4>💨 Wind Effect</h4>
          <p>Wind speed of ${windSpeed.toFixed(1)} mph provides some cooling relief, but effectiveness decreases as temperature rises above 95°F.</p>
        </div>
      `;
    }

    resultHtml += `
      <div class="risk-assessment" style="margin-top: 1.5rem;">
        <h4>⚠️ Risk Assessment</h4>
        <div class="risk-details" style="padding: 1rem; border-radius: 0.5rem; ${getRiskStyling(risk.level)}">
          <p><strong>${risk.category}:</strong> ${risk.description}</p>
          <div style="margin-top: 0.5rem;">
            <small>Personal risk factors applied: ${(risk.riskMultiplier * 100).toFixed(0)}% of base risk</small>
          </div>
        </div>
      </div>
    `;

    // Add specific warnings for extreme conditions
    if (risk.level >= 3) {
      resultHtml += `
        <div class="emergency-warning" style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
          <h4 style="color: #721c24; margin-bottom: 0.5rem;">🚨 High Risk Warning</h4>
          <p style="color: #721c24; margin: 0;">Heat stroke and severe heat exhaustion are possible. Avoid prolonged outdoor exposure and seek air conditioning.</p>
        </div>
      `;
    }

    result.innerHTML = resultHtml;
  }

  function getHumidityImpact(humidity) {
    if (humidity < 30) return 'Low - Good sweat evaporation';
    if (humidity < 50) return 'Moderate - Normal evaporation';
    if (humidity < 70) return 'High - Reduced evaporation';
    return 'Very High - Poor sweat evaporation';
  }

  function getRiskStyling(level) {
    const styles = {
      0: 'background: #d4edda; border: 1px solid #c3e6cb;',
      1: 'background: #fff3cd; border: 1px solid #ffeaa7;',
      2: 'background: #ffeaa7; border: 1px solid #ffc107;',
      3: 'background: #f8d7da; border: 1px solid #f5c6cb;',
      4: 'background: #d1ecf1; border: 1px solid #b8daff;'
    };
    return styles[level] || styles[2];
  }

  function showSafetyRecommendations(risk, activityLevel, exposureTime) {
    const safetyHtml = generateSafetyRecommendations(risk, activityLevel, exposureTime);
    document.getElementById('safety-details').innerHTML = safetyHtml;
    safetyDiv.style.display = 'block';
  }

  function generateSafetyRecommendations(risk, activityLevel, exposureTime) {
    let recommendations = [];

    // General recommendations based on risk level
    if (risk.level >= 1) {
      recommendations.push({
        category: '💧 Hydration',
        items: [
          'Drink water regularly, even if not thirsty',
          'Avoid alcohol and caffeine',
          'Monitor urine color (should be light yellow)'
        ]
      });

      recommendations.push({
        category: '👕 Clothing & Protection',
        items: [
          'Wear light-colored, loose-fitting clothes',
          'Use wide-brimmed hat and sunglasses',
          'Apply and reapply sunscreen (SPF 30+)'
        ]
      });
    }

    if (risk.level >= 2) {
      recommendations.push({
        category: '⏰ Activity Modifications',
        items: [
          'Schedule activities for cooler times (early morning/evening)',
          'Take frequent breaks in shade or air conditioning',
          'Reduce intensity and duration of outdoor activities'
        ]
      });

      recommendations.push({
        category: '🏠 Environment',
        items: [
          'Seek air-conditioned spaces when possible',
          'Use fans to improve air circulation',
          'Create shade with umbrellas or canopies'
        ]
      });
    }

    if (risk.level >= 3) {
      recommendations.push({
        category: '🚨 High Risk Precautions',
        items: [
          'Minimize all outdoor activities',
          'Stay in air-conditioned buildings',
          'Use buddy system - never be alone',
          'Have emergency plan ready'
        ]
      });
    }

    // Activity-specific recommendations
    if (activityLevel === 'heavy' || activityLevel === 'extreme') {
      recommendations.push({
        category: '🏃 High-Intensity Activity',
        items: [
          'Consider postponing strenuous activities',
          'Increase rest periods significantly',
          'Monitor heart rate and breathing',
          'Have cooling towels available'
        ]
      });
    }

    let html = '';
    recommendations.forEach(rec => {
      html += `
        <div style="margin-bottom: 1.5rem;">
          <h5>${rec.category}</h5>
          <ul>
            ${rec.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    });

    return html;
  }

  function showHydrationGuide(risk, activityLevel, exposureTime) {
    const hydrationHtml = generateHydrationGuide(risk, activityLevel, exposureTime);
    document.getElementById('hydration-details').innerHTML = hydrationHtml;
    hydrationDiv.style.display = 'block';
  }

  function generateHydrationGuide(risk, activityLevel, exposureTime) {
    const activityMultipliers = {
      'rest': 1.0,
      'light': 1.5,
      'moderate': 2.0,
      'heavy': 2.5,
      'extreme': 3.0
    };

    const baseFluidOz = 8; // Base fluid ounces per hour
    const multiplier = activityMultipliers[activityLevel] || 1.0;
    const riskMultiplier = 1 + (risk.level * 0.25);
    
    const fluidPerHour = baseFluidOz * multiplier * riskMultiplier;
    const totalFluid = fluidPerHour * exposureTime;

    return `
      <div class="hydration-plan">
        <h4>💧 Personalized Hydration Plan</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div><strong>Per Hour:</strong> ${fluidPerHour.toFixed(1)} oz (${(fluidPerHour * 29.5735).toFixed(0)} ml)</div>
          <div><strong>Total for ${exposureTime}h:</strong> ${totalFluid.toFixed(1)} oz (${(totalFluid * 29.5735).toFixed(0)} ml)</div>
          <div><strong>Frequency:</strong> Every ${Math.max(10, 60 / Math.ceil(fluidPerHour / 8))} minutes</div>
        </div>
        
        <h5>Hydration Guidelines:</h5>
        <ul>
          <li><strong>Pre-hydration:</strong> Drink 16-24 oz 2 hours before exposure</li>
          <li><strong>During activity:</strong> 6-8 oz every 15-20 minutes</li>
          <li><strong>Post-activity:</strong> Drink 150% of fluid lost through sweat</li>
          <li><strong>Electrolytes:</strong> Add electrolytes for activities >1 hour</li>
          <li><strong>Temperature:</strong> Cool fluids (50-60°F) are absorbed faster</li>
        </ul>

        <h5>Warning Signs of Dehydration:</h5>
        <ul>
          <li>Dark yellow urine</li>
          <li>Decreased urination</li>
          <li>Fatigue and dizziness</li>
          <li>Dry mouth and increased thirst</li>
          <li>Headache</li>
        </ul>
      </div>
    `;
  }

  function showEmergencyInfo(risk) {
    const emergencyHtml = `
      <div class="emergency-plan">
        <h4>🚨 Heat Emergency Recognition & Response</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem;">
          <div style="padding: 1rem; border: 2px solid #ffc107; border-radius: 0.5rem; background: #fff3cd;">
            <h5 style="color: #856404;">⚠️ Heat Exhaustion</h5>
            <p><strong>Symptoms:</strong></p>
            <ul style="margin-bottom: 1rem;">
              <li>Heavy sweating or no sweating</li>
              <li>Muscle cramps</li>
              <li>Fatigue, dizziness, nausea</li>
              <li>Cool, moist skin</li>
            </ul>
            <p><strong>Response:</strong></p>
            <ul>
              <li>Move to cool area immediately</li>
              <li>Remove excess clothing</li>
              <li>Apply cool water to skin</li>
              <li>Provide small sips of water</li>
              <li>Seek medical attention</li>
            </ul>
          </div>
          
          <div style="padding: 1rem; border: 2px solid #dc3545; border-radius: 0.5rem; background: #f8d7da;">
            <h5 style="color: #721c24;">🚨 Heat Stroke (EMERGENCY)</h5>
            <p><strong>Symptoms:</strong></p>
            <ul style="margin-bottom: 1rem;">
              <li>Body temperature 104°F+</li>
              <li>Hot, dry skin (or profuse sweating)</li>
              <li>Rapid pulse</li>
              <li>Confusion, altered mental state</li>
              <li>Loss of consciousness</li>
            </ul>
            <p><strong>Response:</strong></p>
            <ul>
              <li style="font-weight: bold; color: #721c24;">CALL 911 IMMEDIATELY</li>
              <li>Move to cool area</li>
              <li>Cool aggressively with ice/cold water</li>
              <li>Monitor vital signs</li>
              <li>Do not give fluids if unconscious</li>
            </ul>
          </div>
        </div>

        <h5>📞 Emergency Contacts</h5>
        <ul>
          <li><strong>Emergency Services:</strong> 911</li>
          <li><strong>Poison Control:</strong> 1-800-222-1222</li>
          <li><strong>Local Emergency Room:</strong> [Add your local ER number]</li>
        </ul>

        <h5>🎒 Emergency Kit Recommendations</h5>
        <ul>
          <li>Plenty of water and electrolyte solutions</li>
          <li>Instant cold packs</li>
          <li>Thermometer</li>
          <li>First aid supplies</li>
          <li>Emergency contact information</li>
          <li>Cooling towels or wet cloths</li>
        </ul>
      </div>
    `;

    document.getElementById('emergency-details').innerHTML = emergencyHtml;
    emergencyDiv.style.display = 'block';
  }

  function showWorkplaceSafety(risk, heatIndexF) {
    const workplaceHtml = generateWorkplaceSafety(risk, heatIndexF);
    document.getElementById('workplace-details').innerHTML = workplaceHtml;
    workplaceDiv.style.display = 'block';
  }

  function generateWorkplaceSafety(risk, heatIndexF) {
    let workRestRatio = '';
    let additionalMeasures = [];

    // OSHA recommended work/rest schedules
    if (heatIndexF < 90) {
      workRestRatio = 'Normal work schedule';
    } else if (heatIndexF < 95) {
      workRestRatio = '45 minutes work / 15 minutes rest each hour';
    } else if (heatIndexF < 100) {
      workRestRatio = '30 minutes work / 30 minutes rest each hour';
    } else if (heatIndexF < 105) {
      workRestRatio = '15 minutes work / 45 minutes rest each hour';
    } else {
      workRestRatio = 'Discontinue non-essential outdoor work';
      additionalMeasures.push('Consider postponing work until cooler conditions');
    }

    if (risk.level >= 2) {
      additionalMeasures.push('Implement buddy system');
      additionalMeasures.push('Increase supervisor monitoring');
      additionalMeasures.push('Provide cooling stations');
    }

    if (risk.level >= 3) {
      additionalMeasures.push('Medical personnel on standby');
      additionalMeasures.push('Pre-shift health screening');
      additionalMeasures.push('Mandatory cooling periods');
    }

    return `
      <div class="workplace-guidelines">
        <h4>👷 OSHA Heat Safety Guidelines</h4>
        
        <div style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
          <h5>⏰ Recommended Work/Rest Schedule</h5>
          <p style="font-size: 1.1rem; font-weight: bold;">${workRestRatio}</p>
        </div>

        <h5>🛠️ Required Safety Measures</h5>
        <ul>
          <li>Provide cool drinking water (1 quart per hour per worker)</li>
          <li>Ensure rest areas are shaded or air-conditioned</li>
          <li>Train workers to recognize heat illness symptoms</li>
          <li>Gradual acclimatization for new workers (7-14 days)</li>
          <li>Allow self-paced work when possible</li>
          ${additionalMeasures.map(measure => `<li>${measure}</li>`).join('')}
        </ul>

        <h5>📋 Worker Rights & Responsibilities</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <h6>Rights:</h6>
            <ul>
              <li>Access to water and shade</li>
              <li>Rest breaks without penalty</li>
              <li>Report unsafe conditions</li>
              <li>Medical attention for heat illness</li>
            </ul>
          </div>
          <div>
            <h6>Responsibilities:</h6>
            <ul>
              <li>Drink water regularly</li>
              <li>Report symptoms immediately</li>
              <li>Watch out for coworkers</li>
              <li>Follow safety procedures</li>
            </ul>
          </div>
        </div>

        <h5>🏭 Employer Requirements</h5>
        <ul>
          <li>Develop written heat illness prevention program</li>
          <li>Provide training on heat illness prevention</li>
          <li>Maintain emergency action plan</li>
          <li>Document incidents and near misses</li>
          <li>Regular review and updates of procedures</li>
        </ul>
      </div>
    `;
  }

  // Auto-update when units change
  document.getElementById('tempUnit').addEventListener('change', function() {
    const tempInput = document.getElementById('temperature');
    const currentValue = parseFloat(tempInput.value);
    
    if (!isNaN(currentValue)) {
      if (this.value === 'celsius' && tempInput.dataset.lastUnit === 'fahrenheit') {
        tempInput.value = ((currentValue - 32) * 5/9).toFixed(1);
      } else if (this.value === 'fahrenheit' && tempInput.dataset.lastUnit === 'celsius') {
        tempInput.value = ((currentValue * 9/5) + 32).toFixed(1);
      }
    }
    
    tempInput.dataset.lastUnit = this.value;
  });

  // Initialize with current unit
  document.getElementById('temperature').dataset.lastUnit = 'fahrenheit';
});