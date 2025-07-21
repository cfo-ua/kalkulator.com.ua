document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('pet-calorie-form');
  const result = document.getElementById('pet-calorie-result');

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculatePetCalories();
    });
  }

  function calculatePetCalories() {
    // Get form values
    const petType = document.getElementById('pet-type').value;
    const petWeight = parseFloat(document.getElementById('pet-weight').value);
    const weightUnit = document.getElementById('weight-unit').value;
    const lifeStage = document.getElementById('life-stage').value;
    const spayNeuter = document.getElementById('spay-neuter').value;
    const activityLevel = document.getElementById('activity-level').value;
    const environment = document.getElementById('environment').value;
    const exerciseDuration = parseInt(document.getElementById('exercise-duration').value) || 30;
    const weightGoal = document.getElementById('weight-goal').value;
    const bodyCondition = document.getElementById('body-condition').value;
    const healthConditions = document.getElementById('health-conditions').value;
    const climate = document.getElementById('climate').value;

    // Validate required fields
    if (!petType || !petWeight || !lifeStage || !spayNeuter || !activityLevel || !weightGoal) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Convert weight to kg if needed
    const weightKg = weightUnit === 'lbs' ? petWeight / 2.205 : petWeight;
    const weightLbs = weightUnit === 'kg' ? petWeight * 2.205 : petWeight;

    // Calculate Resting Energy Requirement (RER)
    let rer = calculateRER(weightKg, petType);

    // Calculate Daily Energy Requirement (DER) multiplier
    let derMultiplier = calculateDERMultiplier(lifeStage, activityLevel, spayNeuter, environment, climate, healthConditions);

    // Calculate base DER
    let der = rer * derMultiplier;

    // Adjust for weight goal
    der = adjustForWeightGoal(der, weightGoal, bodyCondition);

    // Calculate food portions for different food types
    const portions = calculateFoodPortions(der, weightKg);

    // Display results
    displayResults({
      rer: rer,
      der: der,
      weightKg: weightKg,
      weightLbs: weightLbs,
      derMultiplier: derMultiplier,
      portions: portions,
      petType: petType,
      lifeStage: lifeStage,
      activityLevel: activityLevel,
      weightGoal: weightGoal,
      bodyCondition: bodyCondition,
      exerciseDuration: exerciseDuration
    });
  }

  function calculateRER(weightKg, petType) {
    // Standard RER formula: 70 × (body weight in kg)^0.75
    let rer = 70 * Math.pow(weightKg, 0.75);

    // Adjustments for different pet types
    switch (petType) {
      case 'cat':
        // Cats have slightly lower RER
        rer *= 0.95;
        break;
      case 'rabbit':
        // Rabbits have higher metabolic rate
        rer *= 1.1;
        break;
      case 'guinea-pig':
        // Guinea pigs have very high metabolic rate
        rer *= 1.3;
        break;
      case 'ferret':
        // Ferrets have extremely high metabolic rate
        rer *= 1.5;
        break;
      case 'dog':
      default:
        // Standard calculation for dogs
        break;
    }

    return Math.round(rer);
  }

  function calculateDERMultiplier(lifeStage, activityLevel, spayNeuter, environment, climate, healthConditions) {
    let multiplier = 1.0;

    // Life stage multipliers
    switch (lifeStage) {
      case 'puppy-kitten':
        multiplier = 2.0; // Growing animals need more energy
        break;
      case 'young-adult':
        multiplier = 1.8;
        break;
      case 'adult':
        multiplier = 1.6;
        break;
      case 'senior':
        multiplier = 1.4; // Slower metabolism
        break;
      case 'pregnant':
        multiplier = 1.8; // Increases throughout pregnancy
        break;
      case 'lactating':
        multiplier = 3.0; // Very high energy needs
        break;
    }

    // Activity level adjustments
    switch (activityLevel) {
      case 'sedentary':
        multiplier *= 0.8;
        break;
      case 'light':
        multiplier *= 0.9;
        break;
      case 'moderate':
        multiplier *= 1.0;
        break;
      case 'high':
        multiplier *= 1.2;
        break;
      case 'very-high':
        multiplier *= 1.4;
        break;
    }

    // Spay/neuter adjustment
    if (spayNeuter === 'neutered-male' || spayNeuter === 'spayed-female') {
      multiplier *= 0.9; // Reduced metabolism after surgery
    }

    // Environment adjustment
    switch (environment) {
      case 'outdoor':
        multiplier *= 1.1; // More energy for temperature regulation
        break;
      case 'mixed':
        multiplier *= 1.05;
        break;
      case 'indoor':
      default:
        // No adjustment
        break;
    }

    // Climate adjustment
    switch (climate) {
      case 'cold':
        multiplier *= 1.1; // More energy for warmth
        break;
      case 'hot':
        multiplier *= 0.95; // Reduced appetite in heat
        break;
      case 'moderate':
      default:
        // No adjustment
        break;
    }

    // Health condition adjustments
    switch (healthConditions) {
      case 'diabetes':
        multiplier *= 0.9; // Often need weight management
        break;
      case 'kidney':
        multiplier *= 0.95; // May need restricted diet
        break;
      case 'heart':
        multiplier *= 0.9; // Weight management important
        break;
      case 'arthritis':
        multiplier *= 0.85; // Reduced activity
        break;
      case 'thyroid':
        // Depends on hyper vs hypo - no standard adjustment
        break;
      case 'digestive':
        multiplier *= 0.95; // May need easily digestible food
        break;
    }

    return Math.round(multiplier * 100) / 100; // Round to 2 decimal places
  }

  function adjustForWeightGoal(der, weightGoal, bodyCondition) {
    switch (weightGoal) {
      case 'lose':
        return Math.round(der * 0.75); // 25% reduction for weight loss
      case 'gain':
        return Math.round(der * 1.25); // 25% increase for weight gain
      case 'maintain':
      default:
        // Body condition adjustments for maintenance
        if (bodyCondition) {
          const score = parseInt(bodyCondition);
          if (score <= 3) {
            return Math.round(der * 1.1); // Slightly more for thin pets
          } else if (score >= 7) {
            return Math.round(der * 0.9); // Slightly less for overweight pets
          }
        }
        return Math.round(der);
    }
  }

  function calculateFoodPortions(der, weightKg) {
    // Average calorie content per food type (kcal/unit)
    const calorieContent = {
      dryFood: 350, // kcal per cup
      wetFood: 85,  // kcal per 3oz can
      rawFood: 125, // kcal per oz
      treats: 25    // kcal per treat
    };

    // Calculate portions
    const dryFoodCups = der / calorieContent.dryFood;
    const wetFoodCans = der / calorieContent.wetFood;
    const rawFoodOz = der / calorieContent.rawFood;
    const treatsAllowed = Math.floor(der * 0.1 / calorieContent.treats); // 10% of calories

    return {
      dryFood: Math.round(dryFoodCups * 100) / 100,
      wetFood: Math.round(wetFoodCans * 10) / 10,
      rawFood: Math.round(rawFoodOz * 10) / 10,
      treats: treatsAllowed,
      mixedDry: Math.round((dryFoodCups * 0.5) * 100) / 100,
      mixedWet: Math.round((wetFoodCans * 0.5) * 10) / 10
    };
  }

  function displayResults(data) {
    const treatCalories = Math.round(data.der * 0.1);
    const mealCalories = data.der - treatCalories;

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🍽️ Daily Calories</h6>
          <div class="big-number">${data.der}</div>
          <p class="insight-detail">kcal per day</p>
        </div>
        <div class="insight-card success">
          <h6>🏃 Activity Factor</h6>
          <div class="big-number">${data.derMultiplier}x</div>
          <p class="insight-detail">RER multiplier</p>
        </div>
        <div class="insight-card warning">
          <h6>⚖️ Weight Status</h6>
          <div class="big-number">${data.weightLbs.toFixed(1)}</div>
          <p class="insight-detail">lbs (${data.weightKg.toFixed(1)} kg)</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Detailed Calorie Breakdown</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <strong>🔄 Resting Energy (RER):</strong><br>
              ${data.rer} kcal/day<br>
              <small>Base metabolic needs</small>
            </div>
            <div>
              <strong>⚡ Activity Multiplier:</strong><br>
              ${data.derMultiplier}x<br>
              <small>Based on ${data.activityLevel} lifestyle</small>
            </div>
            <div>
              <strong>🎯 Goal Adjustment:</strong><br>
              ${data.weightGoal} weight<br>
              <small>Modified for target goal</small>
            </div>
            <div>
              <strong>🏃 Exercise Bonus:</strong><br>
              ${data.exerciseDuration} min/day<br>
              <small>Daily activity time</small>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>🥘 Food Portion Guide</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">🍪 Dry Food Only</h4>
            <div class="big-number" style="font-size: 1.5rem;">${data.portions.dryFood}</div>
            <p>cups per day</p>
            <small>Split into 2-3 meals</small>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">🥫 Wet Food Only</h4>
            <div class="big-number" style="font-size: 1.5rem;">${data.portions.wetFood}</div>
            <p>cans per day (3oz)</p>
            <small>Higher moisture content</small>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">🥩 Raw Food</h4>
            <div class="big-number" style="font-size: 1.5rem;">${data.portions.rawFood}</div>
            <p>ounces per day</p>
            <small>Balanced raw diet</small>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">🍖 Mixed Diet</h4>
            <div style="font-size: 1.2rem;">
              ${data.portions.mixedDry} cups dry<br>
              + ${data.portions.mixedWet} cans wet
            </div>
            <p>per day</p>
            <small>50/50 combination</small>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>🍬 Treat Allowance</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <strong>Daily Treat Calories:</strong><br>
              <span style="font-size: 1.5rem; color: var(--accent);">${treatCalories} kcal</span><br>
              <small>Maximum 10% of daily intake</small>
            </div>
            <div>
              <strong>Approximate Treats:</strong><br>
              <span style="font-size: 1.5rem; color: var(--accent);">${data.portions.treats}</span><br>
              <small>Standard training treats</small>
            </div>
            <div>
              <strong>Meal Adjustment:</strong><br>
              <span style="font-size: 1.5rem; color: var(--accent);">${mealCalories} kcal</span><br>
              <small>Reduce meals by treat calories</small>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: 12px;">
        <h3>💡 Feeding Guidelines</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          
          <div>
            <h4>📅 Feeding Schedule</h4>
            <ul style="margin: 0.5rem 0;">
              ${getFeedingSchedule(data.lifeStage)}
            </ul>
          </div>

          <div>
            <h4>📏 Measuring Tips</h4>
            <ul style="margin: 0.5rem 0;">
              <li>Use a kitchen scale for accuracy</li>
              <li>Level measuring cups for dry food</li>
              <li>Check food packaging for calories</li>
              <li>Adjust for treat calories</li>
            </ul>
          </div>

          <div>
            <h4>⚖️ Monitoring</h4>
            <ul style="margin: 0.5rem 0;">
              <li>Weigh pet weekly during diet changes</li>
              <li>Monitor body condition score</li>
              <li>Adjust portions based on weight trends</li>
              <li>Consult vet for concerns</li>
            </ul>
          </div>
        </div>

        ${getSpecialConsiderations(data.weightGoal, data.bodyCondition, data.lifeStage)}
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>⚠️ Important Disclaimer:</strong> These calculations provide estimates based on standard formulas. Individual pets may need 10-20% more or fewer calories. Always consult your veterinarian for personalized nutrition advice, especially for pets with health conditions, during weight management, or when changing diets.
      </div>
    `;

    result.innerHTML = html;
  }

  function getFeedingSchedule(lifeStage) {
    switch (lifeStage) {
      case 'puppy-kitten':
        return `
          <li>3-4 meals per day until 6 months</li>
          <li>2-3 meals per day from 6-12 months</li>
          <li>Free-choice for kittens under 6 months</li>
        `;
      case 'young-adult':
      case 'adult':
        return `
          <li>2 meals per day (morning & evening)</li>
          <li>12-hour spacing between meals</li>
          <li>Consistent feeding times</li>
        `;
      case 'senior':
        return `
          <li>2-3 smaller meals per day</li>
          <li>Easier digestion with frequent meals</li>
          <li>Monitor for decreased appetite</li>
        `;
      case 'pregnant':
        return `
          <li>2-3 meals per day early pregnancy</li>
          <li>Free-choice feeding later pregnancy</li>
          <li>High-quality puppy/kitten food</li>
        `;
      case 'lactating':
        return `
          <li>Free-choice feeding recommended</li>
          <li>High-quality puppy/kitten food</li>
          <li>Ensure constant access to fresh water</li>
        `;
      default:
        return `
          <li>2 meals per day recommended</li>
          <li>Consistent feeding schedule</li>
          <li>Monitor for changes in appetite</li>
        `;
    }
  }

  function getSpecialConsiderations(weightGoal, bodyCondition, lifeStage) {
    let considerations = [];
    
    if (weightGoal === 'lose') {
      considerations.push('🎯 <strong>Weight Loss:</strong> Reduce portions gradually, increase exercise, use low-calorie treats');
    }
    if (weightGoal === 'gain') {
      considerations.push('📈 <strong>Weight Gain:</strong> Increase portions gradually, ensure high-quality nutrition, monitor for underlying health issues');
    }
    if (bodyCondition && (parseInt(bodyCondition) <= 3 || parseInt(bodyCondition) >= 7)) {
      considerations.push('🩺 <strong>Body Condition:</strong> Consult veterinarian for body condition score outside ideal range (4-6)');
    }
    if (lifeStage === 'senior') {
      considerations.push('👴 <strong>Senior Care:</strong> Regular weight monitoring, joint supplements, easily digestible food');
    }
    if (lifeStage === 'puppy-kitten') {
      considerations.push('🐶 <strong>Growing Pet:</strong> High-quality growth formula, frequent meals, rapid calorie changes as they grow');
    }

    if (considerations.length === 0) {
      return '';
    }

    return `
      <div style="margin-top: 1.5rem;">
        <h4>🏥 Special Considerations</h4>
        <ul style="margin: 0.5rem 0;">
          ${considerations.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }
});