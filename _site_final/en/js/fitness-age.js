document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('fitness-age-form');
  const result = document.getElementById('fitness-age-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const heightInput = +form.height.value;
    const heightUnit = form['height-unit'].value;
    const inches = +(form.inches?.value || 0);
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const restingHR = form['resting-hr'].value ? +form['resting-hr'].value : null;
    const exerciseFreq = +form['exercise-frequency'].value;
    const exerciseType = form['exercise-type'].value;
    const exerciseDuration = +form['exercise-duration'].value;
    const exerciseIntensity = form['exercise-intensity'].value;
    const strengthTraining = form['strength-training'].value;
    const healthStatus = form['health-status'].value;
    const smoking = form.smoking.value;
    const dailyActivity = form['daily-activity'].value;

    // Validation
    if (!age || !gender || !heightInput || !weightInput || exerciseFreq === '' || 
        !exerciseType || exerciseDuration === '' || !exerciseIntensity || 
        !strengthTraining || !healthStatus || !smoking || !dailyActivity) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields.</p>';
      return;
    }

    // Convert units
    let heightCm;
    if (heightUnit === 'ft') {
      heightCm = (heightInput * 12 + inches) * 2.54;
    } else {
      heightCm = heightInput;
    }
    
    const weightKg = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Calculate BMI
    const bmi = weightKg / Math.pow(heightCm / 100, 2);

    // Estimate VO2 max based on various factors
    let estimatedVO2max;
    
    // Base VO2 max by age and gender (sedentary population)
    let baseVO2max;
    if (gender === 'male') {
      baseVO2max = 47.0 - (0.37 * age); // Male baseline
    } else {
      baseVO2max = 42.0 - (0.31 * age); // Female baseline
    }

    // Adjust for exercise frequency and intensity
    let exerciseMultiplier = 1.0;
    if (exerciseFreq === 0) {
      exerciseMultiplier = 0.85; // Sedentary penalty
    } else {
      // Base multiplier from frequency
      const freqMultipliers = [0.85, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
      exerciseMultiplier = freqMultipliers[exerciseFreq];
      
      // Adjust for intensity
      const intensityMultipliers = {
        'none': 0.85,
        'light': 1.0,
        'moderate': 1.1,
        'vigorous': 1.25,
        'high': 1.4
      };
      exerciseMultiplier *= intensityMultipliers[exerciseIntensity];
      
      // Adjust for duration
      if (exerciseDuration >= 60) exerciseMultiplier *= 1.1;
      else if (exerciseDuration >= 45) exerciseMultiplier *= 1.05;
      else if (exerciseDuration <= 15) exerciseMultiplier *= 0.9;
    }

    // Exercise type adjustments
    const typeMultipliers = {
      'none': 0.85,
      'walking': 1.0,
      'jogging': 1.2,
      'cycling': 1.15,
      'swimming': 1.25,
      'weights': 1.05,
      'sports': 1.2,
      'fitness-classes': 1.1,
      'mixed': 1.15
    };
    exerciseMultiplier *= typeMultipliers[exerciseType];

    // Strength training bonus
    const strengthMultipliers = {
      'never': 1.0,
      'rarely': 1.02,
      'weekly': 1.05,
      'regular': 1.1
    };
    exerciseMultiplier *= strengthMultipliers[strengthTraining];

    // Apply exercise adjustments
    estimatedVO2max = baseVO2max * exerciseMultiplier;

    // Adjust for health status
    const healthMultipliers = {
      'excellent': 1.05,
      'good': 1.0,
      'fair': 0.9,
      'poor': 0.8
    };
    estimatedVO2max *= healthMultipliers[healthStatus];

    // Adjust for smoking
    const smokingMultipliers = {
      'never': 1.0,
      'former': 0.95,
      'recent-quit': 0.9,
      'current': 0.8
    };
    estimatedVO2max *= smokingMultipliers[smoking];

    // Adjust for daily activity
    const activityMultipliers = {
      'sedentary': 0.95,
      'light': 1.0,
      'moderate': 1.05,
      'active': 1.1
    };
    estimatedVO2max *= activityMultipliers[dailyActivity];

    // BMI adjustment (optimal BMI range gets bonus)
    if (bmi >= 18.5 && bmi <= 24.9) {
      estimatedVO2max *= 1.0; // Optimal range
    } else if (bmi >= 25 && bmi <= 29.9) {
      estimatedVO2max *= 0.95; // Overweight
    } else if (bmi >= 30) {
      estimatedVO2max *= 0.85; // Obese
    } else {
      estimatedVO2max *= 0.9; // Underweight
    }

    // Resting heart rate adjustment (if provided)
    if (restingHR) {
      if (restingHR <= 60) estimatedVO2max *= 1.1; // Excellent
      else if (restingHR <= 70) estimatedVO2max *= 1.05; // Good
      else if (restingHR <= 80) estimatedVO2max *= 1.0; // Average
      else if (restingHR <= 90) estimatedVO2max *= 0.95; // Below average
      else estimatedVO2max *= 0.9; // Poor
    }

    // Calculate fitness age based on VO2 max
    // Using regression to find age where VO2 max matches current estimated value
    let fitnessAge;
    if (gender === 'male') {
      // Solve: estimatedVO2max = 47.0 - (0.37 * fitnessAge)
      fitnessAge = (47.0 - estimatedVO2max) / 0.37;
    } else {
      // Solve: estimatedVO2max = 42.0 - (0.31 * fitnessAge)
      fitnessAge = (42.0 - estimatedVO2max) / 0.31;
    }

    // Ensure reasonable bounds
    fitnessAge = Math.max(18, Math.min(100, fitnessAge));

    // Calculate difference from chronological age
    const ageDifference = fitnessAge - age;

    // Determine fitness level category
    let fitnessLevel, levelColor, levelDescription;
    if (ageDifference <= -10) {
      fitnessLevel = 'Exceptional';
      levelColor = '#28a745';
      levelDescription = 'Your fitness level is exceptional! You have the cardiovascular health of someone much younger.';
    } else if (ageDifference <= -5) {
      fitnessLevel = 'Excellent';
      levelColor = '#6f9f6f';
      levelDescription = 'Excellent fitness level! Your cardiovascular system is functioning better than average for your age.';
    } else if (ageDifference <= -2) {
      fitnessLevel = 'Good';
      levelColor = '#17a2b8';
      levelDescription = 'Good fitness level. You\'re in better shape than most people your age.';
    } else if (ageDifference <= 2) {
      fitnessLevel = 'Average';
      levelColor = '#ffc107';
      levelDescription = 'Average fitness level for your age. There\'s room for improvement with regular exercise.';
    } else if (ageDifference <= 5) {
      fitnessLevel = 'Below Average';
      levelColor = '#fd7e14';
      levelDescription = 'Below average fitness. Focus on increasing physical activity and cardiovascular exercise.';
    } else if (ageDifference <= 10) {
      fitnessLevel = 'Poor';
      levelColor = '#dc3545';
      levelDescription = 'Poor fitness level. Significant lifestyle changes are needed to improve your health.';
    } else {
      fitnessLevel = 'Very Poor';
      levelColor = '#721c24';
      levelDescription = 'Very poor fitness level. Consider consulting a healthcare provider before starting an exercise program.';
    }

    // Generate personalized recommendations
    let recommendations = [];
    
    if (exerciseFreq < 3) {
      recommendations.push('🏃 Increase exercise frequency: Aim for at least 3-4 days per week of physical activity');
    }
    
    if (exerciseIntensity === 'none' || exerciseIntensity === 'light') {
      recommendations.push('💪 Increase exercise intensity: Include moderate to vigorous activities in your routine');
    }
    
    if (exerciseDuration < 30) {
      recommendations.push('⏱️ Extend exercise duration: Aim for 30-60 minutes per session for optimal benefits');
    }
    
    if (strengthTraining === 'never' || strengthTraining === 'rarely') {
      recommendations.push('🏋️ Add strength training: Include resistance exercises 2-3 times per week');
    }
    
    if (bmi >= 25) {
      recommendations.push('⚖️ Weight management: Achieving a healthy BMI can significantly improve fitness age');
    }
    
    if (restingHR && restingHR > 80) {
      recommendations.push('❤️ Improve cardiovascular health: Focus on aerobic exercise to lower resting heart rate');
    }
    
    if (smoking === 'current') {
      recommendations.push('🚭 Quit smoking: This single change can dramatically improve your fitness age');
    }
    
    if (dailyActivity === 'sedentary') {
      recommendations.push('🚶 Increase daily activity: Take stairs, walk more, stand regularly throughout the day');
    }

    // Add specific exercise recommendations based on current level
    if (exerciseFreq === 0) {
      recommendations.push('🌟 Start with walking: Begin with 20-30 minutes of brisk walking 3 times per week');
    } else if (fitnessAge > age + 5) {
      recommendations.push('🎯 High-intensity intervals: Add HIIT workouts 1-2 times per week to boost cardiovascular fitness');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Fitness Age Assessment</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:flex;justify-content:center;align-items:center;gap:20px;flex-wrap:wrap;">
            <div style="text-align:center;">
              <div style="color:#666;font-size:0.9em;">Your Chronological Age</div>
              <div style="font-size:2em;font-weight:bold;color:#666;">${age}</div>
            </div>
            <div style="font-size:2em;color:#ccc;">vs</div>
            <div style="text-align:center;">
              <div style="color:${levelColor};font-size:0.9em;">Your Fitness Age</div>
              <div style="font-size:2em;font-weight:bold;color:${levelColor};">${Math.round(fitnessAge)}</div>
            </div>
          </div>
          
          <div style="margin:20px 0;padding:15px;background:${levelColor}15;border-radius:6px;">
            <h4 style="color:${levelColor};margin:5px 0;">${fitnessLevel} Fitness Level</h4>
            <p style="margin:5px 0;color:#666;">${levelDescription}</p>
            <div style="font-size:1.1em;margin-top:10px;">
              ${ageDifference > 0 ? 
                `<span style="color:${levelColor};">You are <strong>${Math.abs(Math.round(ageDifference))} years older</strong> biologically than chronologically</span>` :
                ageDifference < 0 ?
                `<span style="color:${levelColor};">You are <strong>${Math.abs(Math.round(ageDifference))} years younger</strong> biologically than chronologically</span>` :
                `<span style="color:${levelColor};">Your fitness age matches your chronological age</span>`
              }
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Assessment Details</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div><strong>BMI:</strong> ${bmi.toFixed(1)} kg/m²</div>
            <div><strong>Estimated VO2 Max:</strong> ${estimatedVO2max.toFixed(1)} ml/kg/min</div>
            <div><strong>Exercise Frequency:</strong> ${exerciseFreq} days/week</div>
            <div><strong>Exercise Type:</strong> ${exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1).replace('-', ' ')}</div>
            ${restingHR ? `<div><strong>Resting Heart Rate:</strong> ${restingHR} bpm</div>` : ''}
            <div><strong>Health Status:</strong> ${healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}</div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">VO2 Max by Age Comparison</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;font-size:0.9em;">
            <div style="text-align:center;padding:8px;background:#f8f9fa;border-radius:4px;">
              <div style="font-weight:bold;">Poor</div>
              <div style="color:#dc3545;">< ${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 15) : Math.round(42.0 - (0.31 * age) - 15)}</div>
            </div>
            <div style="text-align:center;padding:8px;background:#f8f9fa;border-radius:4px;">
              <div style="font-weight:bold;">Fair</div>
              <div style="color:#fd7e14;">${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 15) : Math.round(42.0 - (0.31 * age) - 15)}-${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 5) : Math.round(42.0 - (0.31 * age) - 5)}</div>
            </div>
            <div style="text-align:center;padding:8px;background:#fff3cd;border-radius:4px;">
              <div style="font-weight:bold;">Average</div>
              <div style="color:#856404;">${gender === 'male' ? Math.round(47.0 - (0.37 * age) - 5) : Math.round(42.0 - (0.31 * age) - 5)}-${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 5) : Math.round(42.0 - (0.31 * age) + 5)}</div>
            </div>
            <div style="text-align:center;padding:8px;background:#d4edda;border-radius:4px;">
              <div style="font-weight:bold;">Good</div>
              <div style="color:#155724;">${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 5) : Math.round(42.0 - (0.31 * age) + 5)}-${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 15) : Math.round(42.0 - (0.31 * age) + 15)}</div>
            </div>
            <div style="text-align:center;padding:8px;background:#d1ecf1;border-radius:4px;">
              <div style="font-weight:bold;">Excellent</div>
              <div style="color:#0c5460;">> ${gender === 'male' ? Math.round(47.0 - (0.37 * age) + 15) : Math.round(42.0 - (0.31 * age) + 15)}</div>
            </div>
          </div>
          <div style="text-align:center;margin-top:10px;padding:10px;background:#e3f2fd;border-radius:4px;">
            <strong>Your VO2 Max: <span style="color:#1976d2;">${estimatedVO2max.toFixed(1)} ml/kg/min</span></strong>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Personalized Recommendations to Lower Your Fitness Age</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🎯 Action Plan to Improve Your Fitness Age</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🏃 Cardiovascular Training:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>150+ minutes moderate activity per week</li>
                <li>75+ minutes vigorous activity per week</li>
                <li>Include HIIT 1-2 times per week</li>
              </ul>
            </div>
            <div>
              <strong>💪 Strength Training:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>2-3 resistance sessions per week</li>
                <li>Focus on major muscle groups</li>
                <li>Progressive overload principle</li>
              </ul>
            </div>
            <div>
              <strong>🧘 Recovery & Lifestyle:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>7-9 hours quality sleep</li>
                <li>Stress management techniques</li>
                <li>Balanced nutrition</li>
              </ul>
            </div>
            <div>
              <strong>📈 Progression Tips:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Start gradually and build up</li>
                <li>Track your progress</li>
                <li>Reassess every 3-6 months</li>
              </ul>
            </div>
          </div>
        </div>

        ${fitnessAge > age + 10 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Important Recommendations</h4>
          <ul style="margin:0;color:#721c24;font-size:0.9em;">
            <li>Consider consulting a healthcare provider before starting intense exercise</li>
            <li>Start with low-intensity activities and progress gradually</li>
            <li>Focus on consistency rather than intensity initially</li>
            <li>Consider working with a qualified fitness professional</li>
            <li>Monitor your response to exercise and adjust accordingly</li>
          </ul>
        </div>
        ` : ''}
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});