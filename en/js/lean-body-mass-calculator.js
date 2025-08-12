document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('lean-body-mass-form');
  const result = document.getElementById('lean-body-mass-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const gender = form.gender.value;
    const age = +form.age.value;
    const heightInput = +form.height.value;
    const heightUnit = form['height-unit'].value;
    const inches = form.inches ? +form.inches.value || 0 : 0;
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const bodyFatPercent = +form['body-fat'].value;
    const measurementMethod = form['measurement-method'].value;
    const activityLevel = form['activity-level'].value;
    const strengthTraining = +form['strength-training'].value;
    const goal = form.goal.value;

    // Validation
    if (!gender || !age || !heightInput || !weightInput || !bodyFatPercent || !activityLevel || strengthTraining === '' || !goal) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields.</p>';
      return;
    }

    // Convert height to cm
    let height;
    if (heightUnit === 'ft') {
      height = (heightInput * 12 + inches) * 2.54; // Convert ft+in to cm
    } else {
      height = heightInput;
    }

    // Convert weight to kg
    const weightKg = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Calculate lean body mass
    const fatMass = (bodyFatPercent / 100) * weightKg;
    const leanBodyMass = weightKg - fatMass;

    // Calculate BMI for comparison
    const heightM = height / 100;
    const bmi = weightKg / (heightM * heightM);

    // Calculate LBM percentage
    const lbmPercentage = (leanBodyMass / weightKg) * 100;

    // Determine normal ranges based on age and gender
    let normalRange, category, categoryColor, categoryDescription;
    
    if (gender === 'male') {
      if (age <= 25) normalRange = '75-85%';
      else if (age <= 35) normalRange = '73-83%';
      else if (age <= 45) normalRange = '70-80%';
      else if (age <= 55) normalRange = '67-77%';
      else normalRange = '65-75%';
      
      if (lbmPercentage >= 80) {
        category = 'Excellent';
        categoryColor = '#28a745';
        categoryDescription = 'Excellent lean body mass level. High muscle content and low body fat percentage.';
      } else if (lbmPercentage >= 75) {
        category = 'Good';
        categoryColor = '#17a2b8';
        categoryDescription = 'Good lean body mass level. Healthy body composition with good muscle development.';
      } else if (lbmPercentage >= 70) {
        category = 'Average';
        categoryColor = '#ffc107';
        categoryDescription = 'Average lean body mass level. Room for improvement through training.';
      } else if (lbmPercentage >= 65) {
        category = 'Below Average';
        categoryColor = '#fd7e14';
        categoryDescription = 'Below average level. Strength training and muscle building recommended.';
      } else {
        category = 'Low';
        categoryColor = '#dc3545';
        categoryDescription = 'Low lean body mass level. Significant changes in training and nutrition needed.';
      }
    } else {
      if (age <= 25) normalRange = '65-75%';
      else if (age <= 35) normalRange = '63-73%';
      else if (age <= 45) normalRange = '60-70%';
      else if (age <= 55) normalRange = '57-67%';
      else normalRange = '55-65%';
      
      if (lbmPercentage >= 70) {
        category = 'Excellent';
        categoryColor = '#28a745';
        categoryDescription = 'Excellent lean body mass level. High muscle content and low body fat percentage.';
      } else if (lbmPercentage >= 65) {
        category = 'Good';
        categoryColor = '#17a2b8';
        categoryDescription = 'Good lean body mass level. Healthy body composition with good muscle development.';
      } else if (lbmPercentage >= 60) {
        category = 'Average';
        categoryColor = '#ffc107';
        categoryDescription = 'Average lean body mass level. Room for improvement through training.';
      } else if (lbmPercentage >= 55) {
        category = 'Below Average';
        categoryColor = '#fd7e14';
        categoryDescription = 'Below average level. Strength training and muscle building recommended.';
      } else {
        category = 'Low';
        categoryColor = '#dc3545';
        categoryDescription = 'Low lean body mass level. Significant changes in training and nutrition needed.';
      }
    }

    // Calculate metabolic rate based on LBM
    const basalMetabolicRate = gender === 'male' ? 
      leanBodyMass * 23 : leanBodyMass * 21;
    
    // Activity multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'high': 1.725,
      'extreme': 1.9
    };
    
    const totalDailyExpenditure = basalMetabolicRate * activityMultipliers[activityLevel];

    // Calculate protein needs
    const proteinNeeds = {
      maintenance: leanBodyMass * 1.6,
      building: leanBodyMass * 2.2,
      cutting: leanBodyMass * 2.6
    };

    // Generate recommendations based on goal
    let recommendations = [];
    let calorieAdjustment = '';
    
    switch (goal) {
      case 'build':
        recommendations.push('📈 Create a caloric surplus of 300-500 calories for muscle growth');
        recommendations.push('🥩 Consume ' + proteinNeeds.building.toFixed(0) + 'g of protein daily');
        recommendations.push('🏋️ Increase strength training to 4-5 times per week');
        calorieAdjustment = `For muscle building: ${(totalDailyExpenditure + 400).toFixed(0)} calories/day`;
        break;
      case 'lose':
        recommendations.push('🔥 Create a moderate caloric deficit of 300-500 calories');
        recommendations.push('🥩 Consume ' + proteinNeeds.cutting.toFixed(0) + 'g of protein daily to preserve muscle');
        recommendations.push('💪 Continue strength training during weight loss');
        calorieAdjustment = `For fat loss while preserving muscle: ${(totalDailyExpenditure - 400).toFixed(0)} calories/day`;
        break;
      case 'recomp':
        recommendations.push('⚖️ Maintain caloric balance with high protein intake');
        recommendations.push('🥩 Consume ' + proteinNeeds.building.toFixed(0) + 'g of protein daily');
        recommendations.push('🔄 Combine strength training with moderate cardio');
        calorieAdjustment = `For body recomposition: ${totalDailyExpenditure.toFixed(0)} calories/day`;
        break;
      default:
        recommendations.push('🥩 Consume ' + proteinNeeds.maintenance.toFixed(0) + 'g of protein daily');
        calorieAdjustment = `For maintenance: ${totalDailyExpenditure.toFixed(0)} calories/day`;
    }
    
    if (strengthTraining < 3) {
      recommendations.push('📅 Increase strength training frequency to 3-4 times per week');
    }
    
    if (bodyFatPercent > (gender === 'male' ? 25 : 30)) {
      recommendations.push('🏃 Add cardio training to reduce body fat percentage');
    }
    
    if (bodyFatPercent < (gender === 'male' ? 8 : 16)) {
      recommendations.push('⚠️ Body fat percentage is very low - may impact health and hormones');
    }

    // Universal recommendations
    recommendations.push('😴 Ensure 7-9 hours of quality sleep for muscle recovery');
    recommendations.push('💧 Drink ' + (leanBodyMass * 35).toFixed(0) + 'ml of water daily');

    // Method names
    const methodNames = {
      'bioimpedance': 'Bioimpedance',
      'calipers': 'Skinfold Calipers',
      'dexa': 'DEXA Scan',
      'visual': 'Visual Estimation',
      'photo': 'Photo Comparison',
      'underwater': 'Underwater Weighing',
      'bodpod': 'BOD POD',
      'other': 'Other Method'
    };

    const activityNames = {
      'sedentary': 'Sedentary',
      'light': 'Light Activity',
      'moderate': 'Moderate Activity',
      'high': 'High Activity',
      'extreme': 'Extreme Activity'
    };

    const goalNames = {
      'maintain': 'Maintain Physique',
      'build': 'Build Muscle Mass',
      'lose': 'Lose Fat',
      'recomp': 'Body Recomposition',
      'strength': 'Increase Strength',
      'health': 'Improve Health'
    };

    result.innerHTML = `
      <div class="mental-health-results">
        <h3 style="color:#157aff;margin-top:0;text-align:center;">💪 Your Lean Body Mass Analysis</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>⚖️ Lean Body Mass</h6>
            <div class="big-number" style="color: ${categoryColor};">${leanBodyMass.toFixed(1)}</div>
            <p>kg</p>
          </div>
          
          <div class="insight-card info">
            <h6>📊 LBM Percentage</h6>
            <div class="big-number" style="color: ${categoryColor};">${lbmPercentage.toFixed(1)}</div>
            <p>% of total weight</p>
          </div>
          
          <div class="insight-card ${lbmPercentage >= (gender === 'male' ? 75 : 65) ? 'success' : lbmPercentage >= (gender === 'male' ? 65 : 55) ? 'warning' : 'info'}" style="border-color: ${categoryColor};">
            <h6>🏆 Category</h6>
            <div class="result-value" style="color: ${categoryColor};">${category}</div>
            <p>LBM level</p>
          </div>
        </div>

        <div class="insight-card ${lbmPercentage >= (gender === 'male' ? 75 : 65) ? 'success' : lbmPercentage >= (gender === 'male' ? 65 : 55) ? 'warning' : 'info'}" style="margin: 20px 0; border-color: ${categoryColor};">
          <h4 style="color: ${categoryColor}; margin: 5px 0; text-align: center;">${category} Lean Body Mass Level</h4>
          <p style="margin: 10px 0; text-align: center;">${categoryDescription}</p>
          <div style="text-align: center; margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.8); border-radius: 6px;">
            <strong>Normal range for your age and gender: ${normalRange}</strong>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📋 Detailed Body Composition Analysis</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Total Weight:</strong> ${weightKg.toFixed(1)} kg
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Lean Body Mass:</strong> ${leanBodyMass.toFixed(1)} kg (${lbmPercentage.toFixed(1)}%)
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Fat Mass:</strong> ${fatMass.toFixed(1)} kg (${bodyFatPercent.toFixed(1)}%)
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>BMI:</strong> ${bmi.toFixed(1)} kg/m²
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Activity Level:</strong> ${activityNames[activityLevel]}
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Goal:</strong> ${goalNames[goal]}
            </div>
          </div>
          ${measurementMethod ? `
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 15px; text-align: center;">
            <strong>Body Fat Measurement Method:</strong> ${methodNames[measurementMethod] || measurementMethod}
          </div>
          ` : ''}
        </div>

        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">🔥 Metabolic Analysis</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong style="color: #155724;">Basal Metabolic Rate (BMR)</strong>
              <div style="font-size: 1.4em; color: #28a745; margin: 5px 0;">${basalMetabolicRate.toFixed(0)}</div>
              <div style="font-size: 0.9em; color: #666;">calories/day</div>
              <div style="font-size: 0.8em; color: #666; margin-top: 5px;">Based on LBM</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong style="color: #155724;">Total Daily Energy Expenditure (TDEE)</strong>
              <div style="font-size: 1.4em; color: #28a745; margin: 5px 0;">${totalDailyExpenditure.toFixed(0)}</div>
              <div style="font-size: 0.9em; color: #666;">calories/day</div>
              <div style="font-size: 0.8em; color: #666; margin-top: 5px;">Including activity</div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px; padding: 12px; background: #e8f5e8; border-radius: 8px;">
            <strong style="color: #155724;">${calorieAdjustment}</strong>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">🥩 Protein Requirements Based on LBM</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>Maintenance</strong>
              <div style="font-size: 1.3em; color: #17a2b8; margin: 5px 0;">${proteinNeeds.maintenance.toFixed(0)}g</div>
              <div style="font-size: 0.8em; color: #666;">1.6g per kg LBM</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>Muscle Building</strong>
              <div style="font-size: 1.3em; color: #28a745; margin: 5px 0;">${proteinNeeds.building.toFixed(0)}g</div>
              <div style="font-size: 0.8em; color: #666;">2.2g per kg LBM</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>Fat Loss</strong>
              <div style="font-size: 1.3em; color: #ffc107; margin: 5px 0;">${proteinNeeds.cutting.toFixed(0)}g</div>
              <div style="font-size: 0.8em; color: #666;">2.6g per kg LBM</div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card warning" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #e65100;">🎯 Personalized Recommendations</h4>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">📈 Lean Body Mass Optimization Plan</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">💪 Strength Training:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>3-5 training sessions per week</li>
                <li>Compound exercises: squats, deadlifts, bench press</li>
                <li>8-12 repetitions for hypertrophy</li>
                <li>Progressive overload principle</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🍽️ Nutrition:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Quality protein with each meal</li>
                <li>20-40g protein per serving</li>
                <li>Even distribution throughout day</li>
                <li>Adequate calories for goals</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">😴 Recovery:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>7-9 hours of quality sleep</li>
                <li>48-72 hours rest between muscle groups</li>
                <li>Stress management</li>
                <li>Adequate hydration</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">📊 Monitoring:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Monthly body composition measurements</li>
                <li>Track strength performance</li>
                <li>Progress photos</li>
                <li>Body circumference measurements</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📊 Age-Based Lean Body Mass Norms</h4>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
              <thead>
                <tr style="background: var(--accent); color: white;">
                  <th style="padding: 10px; border: 1px solid #ddd;">Age</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Men (%)</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Women (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: ${age <= 25 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age <= 25 ? 'bold' : 'normal'};">18-25</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age <= 25 ? 'bold' : 'normal'};">75-85%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age <= 25 ? 'bold' : 'normal'};">65-75%</td>
                </tr>
                <tr style="background: ${age > 25 && age <= 35 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 25 && age <= 35 ? 'bold' : 'normal'};">26-35</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 25 && age <= 35 ? 'bold' : 'normal'};">73-83%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 25 && age <= 35 ? 'bold' : 'normal'};">63-73%</td>
                </tr>
                <tr style="background: ${age > 35 && age <= 45 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 35 && age <= 45 ? 'bold' : 'normal'};">36-45</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 35 && age <= 45 ? 'bold' : 'normal'};">70-80%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 35 && age <= 45 ? 'bold' : 'normal'};">60-70%</td>
                </tr>
                <tr style="background: ${age > 45 && age <= 55 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 45 && age <= 55 ? 'bold' : 'normal'};">46-55</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 45 && age <= 55 ? 'bold' : 'normal'};">67-77%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 45 && age <= 55 ? 'bold' : 'normal'};">57-67%</td>
                </tr>
                <tr style="background: ${age > 55 ? '#e8f4fd' : 'white'};">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 55 ? 'bold' : 'normal'};">56+</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 55 ? 'bold' : 'normal'};">65-75%</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: ${age > 55 ? 'bold' : 'normal'};">55-65%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="disclaimer" style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💪 <strong>Important:</strong> Calculations are based on your entered body fat percentage data. Result accuracy depends on the precision of body composition measurements. 
            For the most accurate results, professional DEXA scanning or other laboratory methods are recommended.
          </p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});