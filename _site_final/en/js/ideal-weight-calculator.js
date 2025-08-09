document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('ideal-weight-form');
  const result = document.getElementById('ideal-weight-result');

  // Auto-convert between feet/inches and cm
  const heightFt = form['height-ft'];
  const heightIn = form['height-in'];
  const heightCm = form['height-cm'];
  
  // Weight unit validation
  const currentWeightInput = form['current-weight'];
  const weightUnitSelect = form['weight-unit'];

  heightFt.addEventListener('input', updateCmFromFtIn);
  heightIn.addEventListener('input', updateCmFromFtIn);
  heightCm.addEventListener('input', updateFtInFromCm);
  
  // Update weight input constraints based on selected unit
  weightUnitSelect.addEventListener('change', updateWeightConstraints);
  
  // Initialize weight constraints
  updateWeightConstraints();

  function updateCmFromFtIn() {
    const ft = parseInt(heightFt.value) || 0;
    const inches = parseInt(heightIn.value) || 0;
    if (ft > 0 || inches > 0) {
      const totalInches = ft * 12 + inches;
      const cm = Math.round(totalInches * 2.54);
      heightCm.value = cm;
    }
  }

  function updateFtInFromCm() {
    const cm = parseInt(heightCm.value) || 0;
    if (cm > 0) {
      const totalInches = cm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      heightFt.value = ft;
      heightIn.value = inches;
    }
  }
  
  function updateWeightConstraints() {
    const unit = weightUnitSelect.value;
    if (unit === 'kg') {
      currentWeightInput.min = '30';
      currentWeightInput.max = '227';
      currentWeightInput.placeholder = '67';
    } else {
      currentWeightInput.min = '70';
      currentWeightInput.max = '500';
      currentWeightInput.placeholder = '150';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const gender = form.gender.value;
    const heightFeet = parseInt(form['height-ft'].value) || 0;
    const heightInches = parseInt(form['height-in'].value) || 0;
    const heightCentimeters = parseInt(form['height-cm'].value) || 0;
    const currentWeightInput = parseFloat(form['current-weight'].value) || 0;
    const weightUnit = form['weight-unit'].value;
    const age = parseInt(form.age.value) || 25;
    const frameSize = form['frame-size'].value;

    // Validation
    if (!gender) {
      result.innerHTML = '<p style="color:red;">Please select your gender.</p>';
      return;
    }

    // Calculate total height in inches
    let totalInches;
    if (heightCentimeters > 0) {
      totalInches = heightCentimeters / 2.54;
    } else if (heightFeet > 0 || heightInches > 0) {
      totalInches = heightFeet * 12 + heightInches;
    } else {
      result.innerHTML = '<p style="color:red;">Please enter your height.</p>';
      return;
    }

    if (totalInches < 48 || totalInches > 84) {
      result.innerHTML = '<p style="color:red;">Please enter a realistic height (4\'0" to 7\'0").</p>';
      return;
    }

    // Validate current weight if provided
    if (currentWeightInput > 0) {
      if (weightUnit === 'kg') {
        if (currentWeightInput < 30 || currentWeightInput > 227) {
          result.innerHTML = '<p style="color:red;">Please enter a realistic weight (30-227 kg).</p>';
          return;
        }
      } else {
        if (currentWeightInput < 70 || currentWeightInput > 500) {
          result.innerHTML = '<p style="color:red;">Please enter a realistic weight (70-500 lbs).</p>';
          return;
        }
      }
    }

    // Convert current weight to pounds if needed
    const currentWeight = weightUnit === 'kg' ? currentWeightInput * 2.20462 : currentWeightInput;

    // Calculate ideal weights using different formulas
    const results = {};

    // 1. BMI Method (healthy range)
    const heightMeters = totalInches * 0.0254;
    const bmiLowWeight = 18.5 * heightMeters * heightMeters * 2.20462; // Convert to pounds
    const bmiHighWeight = 24.9 * heightMeters * heightMeters * 2.20462;
    results.bmi = { low: bmiLowWeight, high: bmiHighWeight };

    // 2. Devine Formula
    // Men: 50 kg + 2.3 kg × (height in inches - 60)
    // Women: 45.5 kg + 2.3 kg × (height in inches - 60)
    const devineBase = gender === 'male' ? 50 : 45.5;
    const devineKg = devineBase + 2.3 * (totalInches - 60);
    results.devine = devineKg * 2.20462;

    // 3. Hamwi Formula
    // Men: 48 kg + 2.7 kg × (height in inches - 60)
    // Women: 45.5 kg + 2.2 kg × (height in inches - 60)
    const hamwiBase = gender === 'male' ? 48 : 45.5;
    const hamwiMultiplier = gender === 'male' ? 2.7 : 2.2;
    const hamwiKg = hamwiBase + hamwiMultiplier * (totalInches - 60);
    results.hamwi = hamwiKg * 2.20462;

    // 4. Robinson Formula
    // Men: 52 kg + 1.9 kg × (height in inches - 60)
    // Women: 49 kg + 1.7 kg × (height in inches - 60)
    const robinsonBase = gender === 'male' ? 52 : 49;
    const robinsonMultiplier = gender === 'male' ? 1.9 : 1.7;
    const robinsonKg = robinsonBase + robinsonMultiplier * (totalInches - 60);
    results.robinson = robinsonKg * 2.20462;

    // 5. Miller Formula
    // Men: 56.2 kg + 1.41 kg × (height in inches - 60)
    // Women: 53.1 kg + 1.36 kg × (height in inches - 60)
    const millerBase = gender === 'male' ? 56.2 : 53.1;
    const millerMultiplier = gender === 'male' ? 1.41 : 1.36;
    const millerKg = millerBase + millerMultiplier * (totalInches - 60);
    results.miller = millerKg * 2.20462;

    // Frame size adjustments (±10% for small/large frames)
    const frameAdjustment = frameSize === 'small' ? 0.9 : frameSize === 'large' ? 1.1 : 1.0;

    // Calculate averages and ranges
    const formulaWeights = [results.devine, results.hamwi, results.robinson, results.miller];
    const adjustedWeights = formulaWeights.map(weight => weight * frameAdjustment);
    const averageWeight = adjustedWeights.reduce((sum, weight) => sum + weight, 0) / adjustedWeights.length;
    const minFormulaWeight = Math.min(...adjustedWeights);
    const maxFormulaWeight = Math.max(...adjustedWeights);

    // Current BMI calculation
    let currentBMI = 0;
    let bmiCategory = '';
    let bmiColor = '#666';
    
    if (currentWeight > 0) {
      currentBMI = (currentWeight / 2.20462) / (heightMeters * heightMeters);
      
      if (currentBMI < 18.5) {
        bmiCategory = 'Underweight';
        bmiColor = '#2196f3';
      } else if (currentBMI < 25) {
        bmiCategory = 'Normal Weight';
        bmiColor = '#4caf50';
      } else if (currentBMI < 30) {
        bmiCategory = 'Overweight';
        bmiColor = '#ff9800';
      } else {
        bmiCategory = 'Obese';
        bmiColor = '#f44336';
      }
    }

    // Weight difference calculation
    let weightDifference = 0;
    let differenceText = '';
    let differenceColor = '#666';
    
    if (currentWeight > 0) {
      weightDifference = currentWeight - averageWeight;
      if (Math.abs(weightDifference) < 5) {
        differenceText = 'At ideal weight range';
        differenceColor = '#4caf50';
      } else if (weightDifference > 0) {
        differenceText = `${Math.abs(weightDifference).toFixed(1)} lbs above ideal`;
        differenceColor = '#ff9800';
      } else {
        differenceText = `${Math.abs(weightDifference).toFixed(1)} lbs below ideal`;
        differenceColor = '#2196f3';
      }
    }

    // Format numbers
    const formatWeight = (weight) => Math.round(weight);
    const formatWeightKg = (weight) => Math.round(weight / 2.20462);

    // Age-related adjustment note
    const ageAdjustment = age > 40 ? Math.floor((age - 40) / 10) * 5 : 0;

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #4caf50;">
        <h3 style="color: #2e7d32; margin-top: 0; text-align: center;">⚖️ Your Ideal Weight Analysis</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;">
            <strong>Profile:</strong> ${gender === 'male' ? 'Male' : 'Female'}, 
            ${Math.floor(totalInches / 12)}'${Math.round(totalInches % 12)}" 
            (${Math.round(totalInches * 2.54)}cm), ${frameSize} frame
          </p>
        </div>

        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🎯 Average Ideal Weight</h6>
            <div class="big-number">${formatWeight(averageWeight)} lbs</div>
            <p>${formatWeightKg(averageWeight)} kg</p>
          </div>
          
          <div class="insight-card info">
            <h6>📊 BMI Healthy Range</h6>
            <div class="big-number">${formatWeight(bmiLowWeight)}-${formatWeight(bmiHighWeight)}</div>
            <p>lbs (BMI 18.5-24.9)</p>
          </div>
          
          ${currentWeight > 0 ? `
          <div class="insight-card" style="border-color: ${bmiColor}; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);">
            <h6>📈 Current Status</h6>
            <div class="big-number" style="color: ${bmiColor};">${bmiCategory}</div>
            <p>BMI: ${currentBMI.toFixed(1)}</p>
          </div>
          ` : `
          <div class="insight-card warning">
            <h6>📝 Formula Range</h6>
            <div class="big-number">${formatWeight(minFormulaWeight)}-${formatWeight(maxFormulaWeight)}</div>
            <p>lbs variation</p>
          </div>
          `}
        </div>

        ${currentWeight > 0 ? `
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid ${differenceColor};">
          <h4 style="color: ${differenceColor}; margin-top: 0; text-align: center;">📊 Weight Analysis</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #333;">Current Weight</div>
              <div style="font-size: 1.3rem; margin: 5px 0;">${formatWeight(currentWeight)} lbs</div>
              <div style="font-size: 0.9rem; color: #666;">${formatWeightKg(currentWeight)} kg</div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #333;">Difference</div>
              <div style="font-size: 1.3rem; margin: 5px 0; color: ${differenceColor};">${differenceText}</div>
              <div style="font-size: 0.9rem; color: #666;">From ideal average</div>
            </div>
          </div>
        </div>
        ` : ''}

        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #2196f3;">
          <h4 style="color: #1565c0; margin-top: 0; text-align: center;">🔬 Formula Breakdown</h4>
          
          <div style="display: grid; gap: 12px;">
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🏥 BMI Method (Range):</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(bmiLowWeight)}-${formatWeight(bmiHighWeight)} lbs</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>⚕️ Devine Formula:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.devine * frameAdjustment)} lbs</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🔬 Hamwi Formula:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.hamwi * frameAdjustment)} lbs</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>📈 Robinson Formula:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.robinson * frameAdjustment)} lbs</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🧮 Miller Formula:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.miller * frameAdjustment)} lbs</span>
            </div>
          </div>
          
          ${frameAdjustment !== 1.0 ? `
          <div style="background: rgba(255,255,255,0.8); padding: 12px; border-radius: 6px; margin-top: 15px;">
            <p style="margin: 0; font-style: italic; color: #1565c0;">
              <strong>Note:</strong> Weights adjusted ${frameAdjustment > 1 ? 'up' : 'down'} 10% for ${frameSize} body frame.
            </p>
          </div>
          ` : ''}
        </div>

        <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ff9800;">
          <h4 style="color: #e65100; margin-top: 0; text-align: center;">💡 Recommendations</h4>
          
          <div style="display: grid; gap: 10px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">🎯 Target Range:</strong> Aim for ${formatWeight(averageWeight - 10)}-${formatWeight(averageWeight + 10)} lbs for flexibility and sustainability.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">⚖️ Healthy Approach:</strong> Focus on gradual changes, 1-2 lbs per week maximum weight loss.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">🏋️ Beyond Weight:</strong> Consider body composition, fitness level, and overall health markers.
            </div>
            
            ${ageAdjustment > 0 ? `
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">📅 Age Factor:</strong> At age ${age}, adding ${ageAdjustment} lbs to ideal weight is often acceptable.
            </div>
            ` : ''}
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #9c27b0;">
          <h4 style="color: #6a1b9a; margin-top: 0; text-align: center;">📋 Health Guidelines</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #6a1b9a; margin-top: 0;">🥗 Nutrition</h6>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                <li>Balanced macronutrients</li>
                <li>Portion control</li>
                <li>Whole foods focus</li>
                <li>Adequate hydration</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #6a1b9a; margin-top: 0;">🏃 Exercise</h6>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                <li>150 min cardio/week</li>
                <li>Strength training 2-3x</li>
                <li>Daily movement</li>
                <li>Progressive challenges</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #6a1b9a; margin-top: 0;">😴 Lifestyle</h6>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                <li>7-9 hours sleep</li>
                <li>Stress management</li>
                <li>Regular health checkups</li>
                <li>Consistent routine</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            ⚖️ <strong>Remember:</strong> These are general guidelines. Individual optimal weight varies based on genetics, muscle mass, health conditions, and personal factors. Consult healthcare professionals for personalized advice.
          </p>
        </div>
      </div>
    `;
  });
});