document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('hair-growth-form');
  const result = document.getElementById('hair-growth-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const currentLength = +form['current-length'].value;
    const targetLength = +form['target-length'].value;
    const gender = form.gender.value;
    const age = +form.age.value;
    const hairType = form['hair-type'].value;
    const hairThickness = form['hair-thickness'].value;
    const hairDensity = form['hair-density'].value;
    const healthStatus = form['health-status'].value;
    const stressLevel = form['stress-level'].value;
    const sleepQuality = form['sleep-quality'].value;
    const physicalActivity = form['physical-activity'].value;
    const dietQuality = form['diet-quality'].value;
    const supplements = form.supplements.value;
    const waterIntake = +form['water-intake'].value;
    const washingFrequency = form['washing-frequency'].value;
    const heatStyling = form['heat-styling'].value;
    const chemicalTreatments = form['chemical-treatments'].value;
    const scalpMassage = form['scalp-massage'].value;
    const season = form.season.value;
    const climate = form.climate.value;
    const pollution = form.pollution.value;

    // Validation
    if (!currentLength || !targetLength || !gender || !age || !hairType || 
        !hairThickness || !hairDensity || !healthStatus || !stressLevel || 
        !sleepQuality || !physicalActivity || !dietQuality || !supplements || 
        !waterIntake || !washingFrequency || !heatStyling || !chemicalTreatments || 
        !scalpMassage || !season || !climate || !pollution) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields.</p>';
      return;
    }

    if (targetLength <= currentLength) {
      result.innerHTML = '<p style="color:red;">Target length must be greater than current length.</p>';
      return;
    }

    // Base growth rate (cm per month)
    let baseGrowthRate = 1.2; // average 1.2 cm per month

    // Gender factor
    const genderFactors = {
      'female': 1.0,
      'male': 0.95
    };
    baseGrowthRate *= genderFactors[gender];

    // Age factor
    let ageFactor = 1.0;
    if (age < 18) ageFactor = 1.1;
    else if (age <= 30) ageFactor = 1.0;
    else if (age <= 45) ageFactor = 0.95;
    else if (age <= 60) ageFactor = 0.9;
    else ageFactor = 0.85;
    baseGrowthRate *= ageFactor;

    // Hair type factor
    const hairTypeFactors = {
      'straight': 1.0,
      'wavy': 0.98,
      'curly': 0.95,
      'coily': 0.9
    };
    baseGrowthRate *= hairTypeFactors[hairType];

    // Thickness factor
    const thicknessFactors = {
      'fine': 0.95,
      'medium': 1.0,
      'thick': 1.05
    };
    baseGrowthRate *= thicknessFactors[hairThickness];

    // Health status factor
    const healthFactors = {
      'excellent': 1.1,
      'good': 1.0,
      'fair': 0.9,
      'poor': 0.75
    };
    baseGrowthRate *= healthFactors[healthStatus];

    // Stress factor
    const stressFactors = {
      'low': 1.1,
      'moderate': 1.0,
      'high': 0.85,
      'extreme': 0.7
    };
    baseGrowthRate *= stressFactors[stressLevel];

    // Sleep quality factor
    const sleepFactors = {
      'excellent': 1.1,
      'good': 1.0,
      'fair': 0.9,
      'poor': 0.8
    };
    baseGrowthRate *= sleepFactors[sleepQuality];

    // Physical activity factor
    const activityFactors = {
      'high': 1.1,
      'moderate': 1.05,
      'low': 1.0,
      'sedentary': 0.95
    };
    baseGrowthRate *= activityFactors[physicalActivity];

    // Diet quality factor
    const dietFactors = {
      'excellent': 1.15,
      'good': 1.05,
      'fair': 1.0,
      'poor': 0.85
    };
    baseGrowthRate *= dietFactors[dietQuality];

    // Supplements factor
    const supplementFactors = {
      'yes-targeted': 1.1,
      'yes-general': 1.05,
      'occasionally': 1.02,
      'no': 1.0
    };
    baseGrowthRate *= supplementFactors[supplements];

    // Water intake factor
    let waterFactor = 1.0;
    if (waterIntake >= 2.5) waterFactor = 1.05;
    else if (waterIntake >= 2.0) waterFactor = 1.0;
    else if (waterIntake >= 1.5) waterFactor = 0.98;
    else waterFactor = 0.95;
    baseGrowthRate *= waterFactor;

    // Heat styling factor
    const heatFactors = {
      'never': 1.1,
      'rarely': 1.05,
      'sometimes': 1.0,
      'often': 0.9,
      'daily': 0.8
    };
    baseGrowthRate *= heatFactors[heatStyling];

    // Chemical treatments factor
    const chemicalFactors = {
      'none': 1.1,
      'occasional': 1.0,
      'regular': 0.9,
      'frequent': 0.8
    };
    baseGrowthRate *= chemicalFactors[chemicalTreatments];

    // Scalp massage factor
    const massageFactors = {
      'daily': 1.1,
      'several-times': 1.05,
      'weekly': 1.02,
      'rarely': 1.0,
      'never': 0.98
    };
    baseGrowthRate *= massageFactors[scalpMassage];

    // Seasonal factor
    const seasonFactors = {
      'spring': 1.05,
      'summer': 1.1,
      'autumn': 1.0,
      'winter': 0.95
    };
    baseGrowthRate *= seasonFactors[season];

    // Climate factor
    const climateFactors = {
      'tropical': 1.05,
      'temperate': 1.0,
      'continental': 0.98,
      'cold': 0.95
    };
    baseGrowthRate *= climateFactors[climate];

    // Pollution factor
    const pollutionFactors = {
      'low': 1.05,
      'moderate': 1.0,
      'high': 0.95,
      'extreme': 0.9
    };
    baseGrowthRate *= pollutionFactors[pollution];

    // Calculate required growth
    const requiredGrowth = targetLength - currentLength;
    const timeToReachTarget = requiredGrowth / baseGrowthRate; // months

    // Calculate various scenarios
    const optimizedGrowthRate = baseGrowthRate * 1.2; // with perfect conditions
    const optimizedTime = requiredGrowth / optimizedGrowthRate;
    
    const minimalGrowthRate = baseGrowthRate * 0.8; // with poor conditions
    const maximalTime = requiredGrowth / minimalGrowthRate;

    // Calculate milestones
    const threeMonthLength = currentLength + (baseGrowthRate * 3);
    const sixMonthLength = currentLength + (baseGrowthRate * 6);
    const twelveMonthLength = currentLength + (baseGrowthRate * 12);

    // Format helper functions
    const formatTime = (months) => {
      if (months < 1) {
        return `${Math.round(months * 30)} days`;
      } else if (months < 12) {
        return `${months.toFixed(1)} months`;
      } else {
        const years = Math.floor(months / 12);
        const remainingMonths = Math.round(months % 12);
        return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} mo.` : ''}`;
      }
    };

    const formatLength = (length) => `${length.toFixed(1)} cm`;

    // Generate recommendations based on factors
    let recommendations = [];
    if (stressLevel === 'high' || stressLevel === 'extreme') {
      recommendations.push("🧘 Reduce stress levels: meditation, yoga, adequate rest");
    }
    if (sleepQuality === 'fair' || sleepQuality === 'poor') {
      recommendations.push("😴 Improve sleep quality: 7-9 hours nightly, regular schedule");
    }
    if (dietQuality === 'fair' || dietQuality === 'poor') {
      recommendations.push("🥗 Balance nutrition: more protein, iron, B vitamins");
    }
    if (waterIntake < 2.0) {
      recommendations.push("💧 Increase water intake to 2-2.5 liters per day");
    }
    if (heatStyling === 'often' || heatStyling === 'daily') {
      recommendations.push("🔥 Reduce heat tool usage, use heat protection");
    }
    if (chemicalTreatments === 'regular' || chemicalTreatments === 'frequent') {
      recommendations.push("💇 Reduce chemical treatments, use nourishing masks");
    }
    if (scalpMassage === 'rarely' || scalpMassage === 'never') {
      recommendations.push("👐 Daily scalp massage to stimulate circulation");
    }
    if (supplements === 'no') {
      recommendations.push("💊 Consider biotin, vitamin D and B-complex supplements");
    }

    // Generate warnings
    let warnings = [];
    if (baseGrowthRate < 0.8) {
      warnings.push("⚠️ Very slow growth: trichologist consultation recommended");
    }
    if (timeToReachTarget > 36) {
      warnings.push("⚠️ Very long timeline: consider intermediate goals");
    }
    if (age > 50 && targetLength > 60) {
      warnings.push("⚠️ Maximum hair length may decrease with age");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Hair Growth Prediction</h3>
        
        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">📊 Key Metrics</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;background:#e3f2fd;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#1976d2;">
                ${baseGrowthRate.toFixed(1)} cm/mo
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Your growth rate</p>
            </div>
            <div style="text-align:center;background:#e8f5e8;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#388e3c;">
                ${formatTime(timeToReachTarget)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Time to desired length</p>
            </div>
            <div style="text-align:center;background:#fff3e0;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#f57c00;">
                ${formatLength(requiredGrowth)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Growth needed</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">📅 Length Predictions</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Timeline</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Expected Length</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Current</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(currentLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">—</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">In 3 months</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(threeMonthLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">+${formatLength(baseGrowthRate * 3)}</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">In 6 months</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(sixMonthLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">+${formatLength(baseGrowthRate * 6)}</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">In 1 year</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatLength(twelveMonthLength)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">+${formatLength(baseGrowthRate * 12)}</td>
                </tr>
                <tr style="background:#e8f5e8;">
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Target length</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatLength(targetLength)}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatTime(timeToReachTarget)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">⏱️ Growth Scenarios</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#d1ecf1;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#0c5460;margin-bottom:8px;">Optimal conditions</div>
              <div style="font-size:1.2em;font-weight:bold;color:#0c5460;">${formatTime(optimizedTime)}</div>
              <div style="color:#0c5460;font-size:0.9em;">with perfect care</div>
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#383d41;margin-bottom:8px;">Current conditions</div>
              <div style="font-size:1.2em;font-weight:bold;color:#383d41;">${formatTime(timeToReachTarget)}</div>
              <div style="color:#383d41;font-size:0.9em;">with current factors</div>
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#721c24;margin-bottom:8px;">Poor conditions</div>
              <div style="font-size:1.2em;font-weight:bold;color:#721c24;">${formatTime(maximalTime)}</div>
              <div style="color:#721c24;font-size:0.9em;">with negative factors</div>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">🔍 Factor Analysis</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Personal factors:</strong><br>
              👤 Gender: ${gender}<br>
              🎂 Age: ${age} years<br>
              💇 Type: ${getHairTypeText(hairType)}<br>
              📏 Thickness: ${getThicknessText(hairThickness)}
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Health & lifestyle:</strong><br>
              ❤️ Health: ${getHealthText(healthStatus)}<br>
              😰 Stress: ${getStressText(stressLevel)}<br>
              😴 Sleep: ${getSleepText(sleepQuality)}<br>
              🏃 Activity: ${getActivityText(physicalActivity)}
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Nutrition:</strong><br>
              🥗 Diet: ${getDietText(dietQuality)}<br>
              💊 Supplements: ${getSupplementsText(supplements)}<br>
              💧 Water: ${waterIntake} L/day
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Hair care:</strong><br>
              🚿 Washing: ${getWashingText(washingFrequency)}<br>
              🔥 Heat: ${getHeatText(heatStyling)}<br>
              💅 Chemical: ${getChemicalText(chemicalTreatments)}<br>
              👐 Massage: ${getMassageText(scalpMassage)}
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">💡 Growth Acceleration Tips</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <ul style="margin:0;color:#155724;">
              ${recommendations.map(rec => `<li style="margin:8px 0;">${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #ffc107;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Important Notes</h4>
          <ul style="margin:0;color:#856404;">
            ${warnings.map(warning => `<li style="margin:5px 0;">${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">📋 Action Plan for Healthy Hair Growth</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="color:#383d41;">
              <strong>🥗 Nutrition:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Proteins: eggs, fish, meat (daily)</li>
                <li>Iron: red meat, spinach</li>
                <li>B vitamins: nuts, green vegetables</li>
                <li>Omega-3: fish, flax seeds</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>💅 Hair care:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Gentle sulfate-free shampoo</li>
                <li>Conditioner every time</li>
                <li>Hair masks 1-2 times/week</li>
                <li>Heat protection always</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>🧘 Lifestyle:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>7-9 hours sleep nightly</li>
                <li>Stress management</li>
                <li>Regular physical activity</li>
                <li>2+ liters water daily</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>👐 Stimulation:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Daily scalp massage 5-10 min</li>
                <li>Avoid tight hairstyles</li>
                <li>UV protection</li>
                <li>Regular end trims</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  // Helper functions for text conversion
  function getHairTypeText(type) {
    const texts = {
      'straight': 'straight',
      'wavy': 'wavy',
      'curly': 'curly',
      'coily': 'very curly'
    };
    return texts[type] || type;
  }

  function getThicknessText(thickness) {
    const texts = {
      'fine': 'fine',
      'medium': 'medium',
      'thick': 'thick'
    };
    return texts[thickness] || thickness;
  }

  function getHealthText(health) {
    const texts = {
      'excellent': 'excellent',
      'good': 'good',
      'fair': 'fair',
      'poor': 'poor'
    };
    return texts[health] || health;
  }

  function getStressText(stress) {
    const texts = {
      'low': 'low',
      'moderate': 'moderate',
      'high': 'high',
      'extreme': 'extreme'
    };
    return texts[stress] || stress;
  }

  function getSleepText(sleep) {
    const texts = {
      'excellent': 'excellent',
      'good': 'good',
      'fair': 'fair',
      'poor': 'poor'
    };
    return texts[sleep] || sleep;
  }

  function getActivityText(activity) {
    const texts = {
      'high': 'high',
      'moderate': 'moderate',
      'low': 'low',
      'sedentary': 'sedentary'
    };
    return texts[activity] || activity;
  }

  function getDietText(diet) {
    const texts = {
      'excellent': 'excellent',
      'good': 'good',
      'fair': 'fair',
      'poor': 'poor'
    };
    return texts[diet] || diet;
  }

  function getSupplementsText(supplements) {
    const texts = {
      'yes-targeted': 'hair-specific',
      'yes-general': 'general',
      'occasionally': 'occasionally',
      'no': 'none'
    };
    return texts[supplements] || supplements;
  }

  function getWashingText(washing) {
    const texts = {
      'daily': 'daily',
      'every-other': 'every other day',
      '2-3-times': '2-3 times/week',
      'weekly': 'weekly',
      'less': 'less often'
    };
    return texts[washing] || washing;
  }

  function getHeatText(heat) {
    const texts = {
      'never': 'never',
      'rarely': 'rarely',
      'sometimes': 'sometimes',
      'often': 'often',
      'daily': 'daily'
    };
    return texts[heat] || heat;
  }

  function getChemicalText(chemical) {
    const texts = {
      'none': 'none',
      'occasional': 'occasional',
      'regular': 'regular',
      'frequent': 'frequent'
    };
    return texts[chemical] || chemical;
  }

  function getMassageText(massage) {
    const texts = {
      'daily': 'daily',
      'several-times': 'several times',
      'weekly': 'weekly',
      'rarely': 'rarely',
      'never': 'never'
    };
    return texts[massage] || massage;
  }
});