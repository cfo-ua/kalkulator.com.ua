document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('portion-size-form');
  const result = document.getElementById('portion-size-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    let weight = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    let targetWeight = +form['target-weight'].value;
    const targetWeightUnit = form['target-weight-unit'].value;
    const heightFt = +form['height-ft'].value || 0;
    const heightIn = +form['height-in'].value || 0;
    const heightCm = +form['height-cm'].value || 0;
    const age = +form.age.value;
    const gender = form.gender.value;
    const weightLossRate = form['weight-loss-rate'].value;
    const activityLevel = form['activity-level'].value;
    const dietStyle = form['diet-style'].value;
    const mealFrequency = form['meal-frequency'].value;
    const diabetes = form.diabetes.value;
    const foodRestrictions = form['food-restrictions'].value;
    const cookingFrequency = form['cooking-frequency'].value;
    const foodBudget = form['food-budget'].value;

    // Validation
    if (!weight || (!heightCm && (!heightFt || heightFt < 4)) || !age || !gender || 
        !targetWeight || !weightLossRate || !activityLevel || !dietStyle || 
        !mealFrequency || !diabetes || !foodRestrictions || !cookingFrequency || !foodBudget) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields to calculate your ideal portion sizes.</p>';
      return;
    }

    // Convert weights to kg if needed
    if (weightUnit === 'lbs') weight = weight / 2.205;
    if (targetWeightUnit === 'lbs') targetWeight = targetWeight / 2.205;
    
    // Convert height to cm if needed
    let heightInCm = heightCm;
    if (heightFt && heightIn !== null) {
      heightInCm = (heightFt * 12 + heightIn) * 2.54;
    }

    // Validate weight loss goal
    const weightToLose = weight - targetWeight;
    if (weightToLose <= 0) {
      result.innerHTML = '<p style="color:red;">Target weight must be less than current weight for weight loss.</p>';
      return;
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * heightInCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * heightInCm) - (4.330 * age);
    }

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
      'extremely-active': 1.9
    };
    
    const tdee = bmr * activityMultipliers[activityLevel];

    // Calculate calorie deficit based on weight loss rate
    const deficitMap = {
      'conservative': 350, // 0.5-1 lb/week
      'moderate': 600,     // 1-1.5 lbs/week  
      'aggressive': 850    // 1.5-2 lbs/week
    };
    
    const dailyDeficit = deficitMap[weightLossRate];
    const targetCalories = Math.max(1200, tdee - dailyDeficit); // Minimum 1200 calories

    // Calculate macronutrient distribution based on diet style
    let proteinPercent, carbPercent, fatPercent;
    
    switch (dietStyle) {
      case 'balanced':
        proteinPercent = 25; carbPercent = 45; fatPercent = 30;
        break;
      case 'low-carb':
        proteinPercent = 30; carbPercent = 25; fatPercent = 45;
        break;
      case 'keto':
        proteinPercent = 25; carbPercent = 5; fatPercent = 70;
        break;
      case 'mediterranean':
        proteinPercent = 20; carbPercent = 40; fatPercent = 40;
        break;
      case 'vegetarian':
      case 'vegan':
        proteinPercent = 20; carbPercent = 50; fatPercent = 30;
        break;
      case 'paleo':
        proteinPercent = 30; carbPercent = 30; fatPercent = 40;
        break;
      default:
        proteinPercent = 25; carbPercent = 45; fatPercent = 30;
    }

    // Calculate macronutrient calories and grams
    const proteinCalories = targetCalories * (proteinPercent / 100);
    const carbCalories = targetCalories * (carbPercent / 100);
    const fatCalories = targetCalories * (fatPercent / 100);
    
    const proteinGrams = Math.round(proteinCalories / 4);
    const carbGrams = Math.round(carbCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    // Calculate meal distribution based on frequency
    let mealCalories = [];
    let mealNames = [];
    
    switch (mealFrequency) {
      case '3-meals-2-snacks':
        mealCalories = [
          Math.round(targetCalories * 0.30), // Breakfast
          Math.round(targetCalories * 0.10), // Morning snack
          Math.round(targetCalories * 0.35), // Lunch
          Math.round(targetCalories * 0.10), // Afternoon snack
          Math.round(targetCalories * 0.25)  // Dinner
        ];
        mealNames = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner'];
        break;
      case '3-meals':
        mealCalories = [
          Math.round(targetCalories * 0.30), // Breakfast
          Math.round(targetCalories * 0.40), // Lunch
          Math.round(targetCalories * 0.30)  // Dinner
        ];
        mealNames = ['Breakfast', 'Lunch', 'Dinner'];
        break;
      case '5-small-meals':
        const mealSize = Math.round(targetCalories / 5);
        mealCalories = [mealSize, mealSize, mealSize, mealSize, mealSize];
        mealNames = ['Meal 1', 'Meal 2', 'Meal 3', 'Meal 4', 'Meal 5'];
        break;
      case 'intermittent-fasting':
        mealCalories = [
          Math.round(targetCalories * 0.40), // First meal
          Math.round(targetCalories * 0.60)  // Second meal
        ];
        mealNames = ['First Meal', 'Second Meal'];
        break;
    }

    // Calculate portion sizes for different food groups
    const portions = calculatePortions(proteinGrams, carbGrams, fatGrams, mealCalories.length, dietStyle);

    // Generate meal-specific portions
    const mealPortions = mealCalories.map((calories, index) => {
      const mealPercent = calories / targetCalories;
      return {
        name: mealNames[index],
        calories: calories,
        protein: Math.round(proteinGrams * mealPercent),
        carbs: Math.round(carbGrams * mealPercent),
        fat: Math.round(fatGrams * mealPercent),
        portions: {
          protein: Math.round(portions.protein * mealPercent * 10) / 10,
          vegetables: Math.round(portions.vegetables * mealPercent * 10) / 10,
          carbs: Math.round(portions.carbs * mealPercent * 10) / 10,
          fat: Math.round(portions.fat * mealPercent * 10) / 10,
          fruit: index < 2 ? Math.round(portions.fruit * mealPercent * 10) / 10 : 0 // Fruit mainly in earlier meals
        }
      };
    });

    // Weight loss timeline
    const weeklyWeightLoss = {
      'conservative': 0.75,
      'moderate': 1.25,
      'aggressive': 1.75
    }[weightLossRate];
    
    const weeksToGoal = Math.ceil(weightToLose * 2.205 / weeklyWeightLoss);

    // Special considerations
    let specialNotes = [];
    
    if (diabetes !== 'none') {
      specialNotes.push('🍎 Focus on low glycemic index foods and consistent carb portions for blood sugar control');
    }
    
    if (foodRestrictions !== 'none') {
      specialNotes.push('⚠️ Portion sizes account for your dietary restrictions - ensure adequate nutrition');
    }
    
    if (cookingFrequency === 'rarely') {
      specialNotes.push('🍱 Consider meal prep containers to control portions when eating out or using prepared foods');
    }
    
    if (targetCalories < 1400) {
      specialNotes.push('⚡ Low calorie target - consider adding light exercise to allow for larger portions');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Personalized Portion Size Plan</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div>
              <div style="background:#157aff;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${Math.round(targetCalories)} calories/day
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Daily Target</p>
            </div>
            <div>
              <div style="background:#28a745;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${weightToLose.toFixed(1)} ${weightUnit} to lose
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Weight Goal</p>
            </div>
            <div>
              <div style="background:#6f9f6f;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${weeksToGoal} weeks
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Est. Timeline</p>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Daily Macronutrient Targets</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#e8f4fd;border-radius:6px;">
              <div style="font-size:1.5em;font-weight:bold;color:#157aff;">${proteinGrams}g</div>
              <div style="color:#666;">Protein (${proteinPercent}%)</div>
            </div>
            <div style="text-align:center;padding:15px;background:#fff3cd;border-radius:6px;">
              <div style="font-size:1.5em;font-weight:bold;color:#856404;">${carbGrams}g</div>
              <div style="color:#666;">Carbs (${carbPercent}%)</div>
            </div>
            <div style="text-align:center;padding:15px;background:#d4edda;border-radius:6px;">
              <div style="font-size:1.5em;font-weight:bold;color:#155724;">${fatGrams}g</div>
              <div style="color:#666;">Fat (${fatPercent}%)</div>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Daily Food Group Portions</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="padding:10px;background:#f8f9fa;border-radius:4px;">
              <strong>🥩 Protein:</strong> ${portions.protein} servings
              <br><small>1 serving = palm size (3-4 oz)</small>
            </div>
            <div style="padding:10px;background:#f8f9fa;border-radius:4px;">
              <strong>🥬 Vegetables:</strong> ${portions.vegetables} cups
              <br><small>Non-starchy vegetables</small>
            </div>
            <div style="padding:10px;background:#f8f9fa;border-radius:4px;">
              <strong>🍞 Carbs:</strong> ${portions.carbs} servings
              <br><small>1 serving = cupped hand</small>
            </div>
            <div style="padding:10px;background:#f8f9fa;border-radius:4px;">
              <strong>🥑 Healthy Fats:</strong> ${portions.fat} servings
              <br><small>1 serving = thumb size</small>
            </div>
            <div style="padding:10px;background:#f8f9fa;border-radius:4px;">
              <strong>🍎 Fruits:</strong> ${portions.fruit} servings
              <br><small>1 serving = fist size</small>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Meal-by-Meal Portion Breakdown</h4>
          <div style="display:grid;gap:15px;">
            ${mealPortions.map(meal => `
              <div style="border:1px solid #dee2e6;border-radius:6px;padding:15px;">
                <h5 style="margin:0 0 10px 0;color:#157aff;">${meal.name} (${meal.calories} calories)</h5>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;font-size:0.9em;">
                  <div><strong>Protein:</strong> ${meal.portions.protein} servings</div>
                  <div><strong>Vegetables:</strong> ${meal.portions.vegetables} cups</div>
                  <div><strong>Carbs:</strong> ${meal.portions.carbs} servings</div>
                  <div><strong>Fat:</strong> ${meal.portions.fat} servings</div>
                  ${meal.portions.fruit > 0 ? `<div><strong>Fruit:</strong> ${meal.portions.fruit} servings</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">📏 Visual Portion Size Guide</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🖐️ Hand Measurements:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#0c5460;">
                <li>Protein: Palm size (thickness too)</li>
                <li>Vegetables: 2 cupped hands</li>
                <li>Carbs: 1 cupped hand</li>
                <li>Fats: Thumb size</li>
              </ul>
            </div>
            <div>
              <strong>🏀 Common Objects:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#0c5460;">
                <li>Protein: Deck of cards</li>
                <li>Vegetables: Baseball</li>
                <li>Carbs: Tennis ball</li>
                <li>Fats: Golf ball or dice</li>
              </ul>
            </div>
            <div>
              <strong>📏 Measuring Tools:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#0c5460;">
                <li>Food scale for accuracy</li>
                <li>Measuring cups/spoons</li>
                <li>Portion control plates</li>
                <li>Pre-portioned containers</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">💡 Smart Portion Control Tips</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🍽️ Plate Strategy:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Use smaller 9-10 inch plates</li>
                <li>Fill half with vegetables</li>
                <li>Quarter with protein</li>
                <li>Quarter with carbs</li>
              </ul>
            </div>
            <div>
              <strong>🧠 Mindful Eating:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Eat slowly and chew thoroughly</li>
                <li>Put fork down between bites</li>
                <li>Stop when 80% full</li>
                <li>Eliminate distractions</li>
              </ul>
            </div>
            <div>
              <strong>📦 Prep Strategies:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Pre-portion snacks in containers</li>
                <li>Prep vegetables for easy access</li>
                <li>Cook proteins in batch</li>
                <li>Use divided lunch containers</li>
              </ul>
            </div>
          </div>
        </div>

        ${specialNotes.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Special Considerations for You</h4>
          <ul style="margin:5px 0;color:#856404;">
            ${specialNotes.map(note => `<li>${note}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">🍽️ Sample ${dietStyle.charAt(0).toUpperCase() + dietStyle.slice(1)} Meal Ideas</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${getSampleMeals(dietStyle, mealPortions[0]).map(meal => `
              <div>
                <strong>${meal.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                  ${meal.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#721c24;">📋 Success Tracking Tips</h4>
          <ul style="margin:5px 0;color:#721c24;font-size:0.9em;">
            <li>Track portions for the first 2-3 weeks to establish habits</li>
            <li>Take progress photos and measurements, not just weight</li>
            <li>Adjust portions if weight loss stalls for 2+ weeks</li>
            <li>Focus on how you feel - energy, hunger, satisfaction</li>
            <li>Allow for flexibility - 80/20 rule for long-term success</li>
            <li>Consult a registered dietitian for personalized guidance</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function calculatePortions(proteinGrams, carbGrams, fatGrams, mealCount, dietStyle) {
    // Base portion calculations
    const proteinServings = Math.round((proteinGrams / 25) * 10) / 10; // ~25g protein per serving
    const vegetablesCups = Math.round((5 + (proteinGrams / 20)) * 10) / 10; // More vegetables with higher protein
    const carbServings = Math.round((carbGrams / 30) * 10) / 10; // ~30g carbs per serving
    const fatServings = Math.round((fatGrams / 8) * 10) / 10; // ~8g fat per serving
    const fruitServings = Math.round((carbGrams / 60) * 10) / 10; // ~15g carbs per fruit serving

    return {
      protein: Math.max(0.5, proteinServings),
      vegetables: Math.max(2, vegetablesCups),
      carbs: Math.max(0, carbServings),
      fat: Math.max(1, fatServings),
      fruit: Math.max(1, Math.min(3, fruitServings))
    };
  }

  function getSampleMeals(dietStyle, sampleMeal) {
    const mealIdeas = {
      'balanced': [
        {
          name: 'Breakfast Example',
          items: ['2 eggs + 1 slice whole grain toast', '1/2 avocado', '1 cup spinach (sautéed)', '1 medium apple']
        },
        {
          name: 'Lunch Example', 
          items: ['4 oz grilled chicken breast', '2 cups mixed green salad', '1/2 cup quinoa', '2 tbsp olive oil dressing']
        },
        {
          name: 'Dinner Example',
          items: ['4 oz salmon fillet', '2 cups roasted vegetables', '1/2 cup brown rice', '1 tbsp nuts/seeds']
        }
      ],
      'low-carb': [
        {
          name: 'Breakfast Example',
          items: ['3 eggs cooked in butter', '2 cups spinach', '1/4 avocado', '1 oz cheese']
        },
        {
          name: 'Lunch Example',
          items: ['5 oz grilled chicken thigh', '3 cups leafy greens', '2 tbsp olive oil', '1/4 cup nuts']
        },
        {
          name: 'Dinner Example',
          items: ['5 oz grass-fed beef', '2 cups cauliflower rice', '2 cups broccoli', '1 tbsp butter']
        }
      ],
      'mediterranean': [
        {
          name: 'Breakfast Example',
          items: ['Greek yogurt with berries', '2 tbsp walnuts', '1 tbsp honey', 'Fresh herbs']
        },
        {
          name: 'Lunch Example',
          items: ['4 oz grilled fish', '2 cups Mediterranean salad', '2 tbsp olive oil', '1/2 cup chickpeas']
        },
        {
          name: 'Dinner Example',
          items: ['4 oz lean lamb', '2 cups grilled vegetables', '1/2 cup farro', 'Olives and herbs']
        }
      ]
    };

    return mealIdeas[dietStyle] || mealIdeas['balanced'];
  }
});