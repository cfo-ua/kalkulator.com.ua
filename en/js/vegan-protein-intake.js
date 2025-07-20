document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('vegan-protein-intake-form');
  const result = document.getElementById('vegan-protein-intake-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const age = +form.age.value;
    const gender = form.gender.value;
    const goal = form.goal.value;
    const activityLevel = form['activity-level'].value;
    const exerciseType = form['exercise-type'].value;
    const dietType = form['diet-type'].value;
    const dietDuration = form['diet-duration'].value;
    const proteinKnowledge = form['protein-knowledge'].value;
    
    // Get special considerations
    const specialCheckboxes = form.querySelectorAll('input[name="special-considerations"]:checked');
    const specialConsiderations = Array.from(specialCheckboxes).map(cb => cb.value);
    
    // Get protein sources
    const proteinCheckboxes = form.querySelectorAll('input[name="protein-sources"]:checked');
    const proteinSources = Array.from(proteinCheckboxes).map(cb => cb.value);

    // Validation
    if (!weightInput || !age || !gender || !goal || !activityLevel || !exerciseType || 
        !dietType || !dietDuration || !proteinKnowledge || specialConsiderations.length === 0) {
      result.innerHTML = '<p style="color:red;">Please fill in all fields and select at least one option for special considerations.</p>';
      return;
    }

    // Convert weight to kg
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Base protein requirements (g/kg body weight)
    let baseProteinPerKg = 0.8; // RDA baseline

    // Adjust for activity level
    const activityMultipliers = {
      'sedentary': 1.0,
      'lightly-active': 1.2,
      'moderately-active': 1.4,
      'very-active': 1.6,
      'extremely-active': 1.8
    };
    baseProteinPerKg *= activityMultipliers[activityLevel];

    // Adjust for exercise type
    const exerciseMultipliers = {
      'none': 1.0,
      'cardio': 1.1,
      'strength': 1.4,
      'mixed': 1.3,
      'sports': 1.5,
      'yoga-pilates': 1.1
    };
    baseProteinPerKg *= exerciseMultipliers[exerciseType];

    // Adjust for goals
    const goalMultipliers = {
      'maintenance': 1.0,
      'weight-loss': 1.2, // Higher protein for muscle preservation
      'muscle-gain': 1.6,
      'athletic-performance': 1.4,
      'general-health': 1.0
    };
    baseProteinPerKg *= goalMultipliers[goal];

    // Plant-based diet adjustment (slightly higher due to lower digestibility)
    const plantProteinMultiplier = dietType === 'vegan' ? 1.1 : 
                                  dietType === 'vegetarian' ? 1.05 : 
                                  dietType === 'pescatarian' ? 1.02 : 1.0;
    baseProteinPerKg *= plantProteinMultiplier;

    // Age adjustments
    if (age >= 65) {
      baseProteinPerKg *= 1.2; // Higher needs for elderly
    } else if (age >= 50) {
      baseProteinPerKg *= 1.1;
    }

    // Gender adjustment
    if (gender === 'female') {
      baseProteinPerKg *= 0.95; // Slightly lower due to body composition
    }

    // Special considerations adjustments
    if (specialConsiderations.includes('pregnancy')) {
      baseProteinPerKg += 0.3; // Additional 25g protein during pregnancy
    }
    if (specialConsiderations.includes('breastfeeding')) {
      baseProteinPerKg += 0.4; // Additional 25g protein during breastfeeding
    }
    if (specialConsiderations.includes('competitive-athlete')) {
      baseProteinPerKg *= 1.3;
    }
    if (specialConsiderations.includes('recovering-illness')) {
      baseProteinPerKg *= 1.2;
    }

    // Calculate total daily protein
    const totalProtein = Math.round(baseProteinPerKg * weight);
    const proteinPerKg = baseProteinPerKg.toFixed(1);
    
    // Calculate protein per meal (assuming 3 meals + 1-2 snacks)
    const proteinPerMeal = Math.round(totalProtein * 0.3); // 30% per main meal
    const proteinPerSnack = Math.round(totalProtein * 0.1); // 10% per snack

    // Generate protein source recommendations based on selections
    const proteinSourcesData = {
      'legumes': {
        name: 'Legumes',
        examples: ['Lentils (18g/cup)', 'Chickpeas (15g/cup)', 'Black beans (15g/cup)', 'White beans (17g/cup)'],
        serving: '1 cup cooked = 15-18g protein'
      },
      'soy': {
        name: 'Soy Products',
        examples: ['Firm tofu (20g/cup)', 'Tempeh (31g/cup)', 'Edamame (17g/cup)', 'Soy milk (7g/cup)'],
        serving: '100g tofu = 15g protein'
      },
      'nuts-seeds': {
        name: 'Nuts & Seeds',
        examples: ['Hemp seeds (10g/3 tbsp)', 'Pumpkin seeds (9g/1oz)', 'Almonds (6g/1oz)', 'Chia seeds (5g/2 tbsp)'],
        serving: '1 oz nuts = 4-6g protein'
      },
      'grains': {
        name: 'Whole Grains',
        examples: ['Quinoa (8g/cup)', 'Amaranth (9g/cup)', 'Buckwheat (6g/cup)', 'Oats (6g/cup)'],
        serving: '1 cup cooked = 6-9g protein'
      },
      'protein-powder': {
        name: 'Plant Protein Powders',
        examples: ['Pea protein (20-25g/scoop)', 'Hemp protein (15g/scoop)', 'Rice protein (20g/scoop)', 'Blend proteins (20-30g/scoop)'],
        serving: '1 scoop = 15-30g protein'
      },
      'nutritional-yeast': {
        name: 'Nutritional Yeast',
        examples: ['Nutritional yeast (8g/2 tbsp)', 'Fortified with B12', 'Cheese-like flavor', 'Great on pasta/popcorn'],
        serving: '2 tbsp = 8g protein'
      },
      'plant-meat': {
        name: 'Plant-Based Meats',
        examples: ['Seitan (25g/100g)', 'Plant burgers (10-20g/patty)', 'Plant sausages (8-14g/link)', 'TVP (12g/1/4 cup dry)'],
        serving: 'Varies by product'
      },
      'spirulina': {
        name: 'Spirulina & Algae',
        examples: ['Spirulina powder (8g/2 tbsp)', 'Chlorella (4g/1 tbsp)', 'Complete amino acids', 'High bioavailability'],
        serving: '1 tbsp = 4g protein'
      }
    };

    // Create personalized meal plan suggestions
    const createMealSuggestions = () => {
      const suggestions = [];
      
      // Breakfast suggestions
      suggestions.push({
        meal: 'Breakfast',
        target: `${proteinPerMeal}g protein`,
        ideas: [
          'Protein smoothie with plant protein powder, hemp seeds, and nut butter',
          'Tofu scramble with nutritional yeast and vegetables',
          'Overnight oats with chia seeds, nuts, and protein powder',
          'Quinoa breakfast bowl with nuts, seeds, and plant milk'
        ]
      });
      
      // Lunch suggestions
      suggestions.push({
        meal: 'Lunch',
        target: `${proteinPerMeal}g protein`,
        ideas: [
          'Large salad with chickpeas, hemp seeds, and tahini dressing',
          'Lentil soup with whole grain bread and hummus',
          'Buddha bowl with quinoa, tempeh, and mixed vegetables',
          'Bean and grain burrito bowl with extra legumes'
        ]
      });
      
      // Dinner suggestions
      suggestions.push({
        meal: 'Dinner',
        target: `${proteinPerMeal}g protein`,
        ideas: [
          'Stir-fried tofu with vegetables and quinoa',
          'Lentil curry with brown rice and nuts',
          'Pasta with white beans and nutritional yeast',
          'Stuffed sweet potatoes with black beans and hemp seeds'
        ]
      });
      
      // Snack suggestions
      suggestions.push({
        meal: 'Snacks',
        target: `${proteinPerSnack * 2}g protein total`,
        ideas: [
          'Hummus with vegetables or whole grain crackers',
          'Trail mix with nuts, seeds, and dried fruit',
          'Protein smoothie or plant milk with protein powder',
          'Roasted chickpeas or edamame'
        ]
      });
      
      return suggestions;
    };

    // Generate tips based on knowledge level and diet duration
    let tips = [];
    
    if (proteinKnowledge === 'beginner' || dietDuration === 'new') {
      tips.push('🌱 Start with familiar proteins: Focus on beans, lentils, and nuts as your foundation');
      tips.push('📖 Learn protein combining: Mix grains + legumes (like rice + beans) for complete amino acids');
      tips.push('🥄 Try nutritional yeast: Great B12 source with cheesy flavor, adds 8g protein per 2 tbsp');
    }
    
    if (goal === 'muscle-gain' || exerciseType === 'strength') {
      tips.push('💪 Post-workout protein: Aim for 20-30g within 2 hours of strength training');
      tips.push('🥤 Consider plant protein powder: Convenient way to boost protein intake');
      tips.push('🔄 Distribute evenly: Spread protein across all meals for optimal muscle protein synthesis');
    }
    
    if (goal === 'weight-loss') {
      tips.push('😋 Protein for satiety: Higher protein helps control hunger and preserve muscle during weight loss');
      tips.push('🥗 Protein-rich snacks: Choose nuts, seeds, or hummus over processed snacks');
    }
    
    if (specialConsiderations.includes('digestive-issues')) {
      tips.push('🌿 Easy digestion: Try sprouted legumes, well-cooked beans, and fermented soy products');
      tips.push('💧 Gradual increase: Slowly increase fiber and protein to allow digestive adaptation');
    }

    // Warnings and special notes
    let warnings = [];
    
    if (totalProtein > weight * 2.5) {
      warnings.push('⚠️ Very high protein target: This level may be unnecessary - consider moderating intake');
    }
    
    if (specialConsiderations.includes('pregnancy') || specialConsiderations.includes('breastfeeding')) {
      warnings.push('🤱 Pregnancy/Breastfeeding: Consult with a healthcare provider familiar with plant-based nutrition');
    }
    
    if (dietDuration === 'new' && totalProtein > weight * 1.8) {
      warnings.push('📚 New to plant-based: Focus on variety and gradual protein increase to avoid digestive upset');
    }

    const selectedSources = proteinSources.length > 0 ? 
      proteinSources.map(source => proteinSourcesData[source]).filter(Boolean) : 
      Object.values(proteinSourcesData).slice(0, 4);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Vegan Protein Plan</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <h4 style="color:#28a745;margin-top:0;">Daily Protein Target</h4>
          <div style="font-size:2.5em;font-weight:bold;color:#28a745;margin:10px 0;">${totalProtein}g</div>
          <div style="color:#666;margin:5px 0;">${proteinPerKg}g per kg body weight</div>
          <div style="color:#666;font-size:0.9em;">Weight: ${weightInput} ${weightUnit} ${weightUnit === 'lbs' ? `(${weight.toFixed(1)} kg)` : ''}</div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Protein Distribution Strategy</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#e8f5e8;border-radius:6px;">
              <div style="font-weight:bold;color:#155724;">3 Main Meals</div>
              <div style="font-size:1.3em;color:#155724;">${proteinPerMeal}g each</div>
              <div style="font-size:0.8em;color:#155724;">90% of daily protein</div>
            </div>
            <div style="text-align:center;padding:15px;background:#fff3cd;border-radius:6px;">
              <div style="font-weight:bold;color:#856404;">2 Snacks</div>
              <div style="font-size:1.3em;color:#856404;">${proteinPerSnack}g each</div>
              <div style="font-size:0.8em;color:#856404;">10% of daily protein</div>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Your Recommended Protein Sources</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${selectedSources.map(source => `
              <div style="border:1px solid #dee2e6;border-radius:6px;padding:15px;">
                <h5 style="color:#28a745;margin-top:0;">${source.name}</h5>
                <div style="font-weight:bold;margin:8px 0;">${source.serving}</div>
                <ul style="margin:5px 0;font-size:0.9em;color:#666;">
                  ${source.examples.map(example => `<li>${example}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Daily Meal Plan Ideas</h4>
          ${createMealSuggestions().map(meal => `
            <div style="margin:15px 0;padding:15px;background:#f8f9fa;border-radius:6px;">
              <h5 style="color:#157aff;margin-top:0;">${meal.meal} (Target: ${meal.target})</h5>
              <ul style="margin:5px 0;color:#333;">
                ${meal.ideas.map(idea => `<li>${idea}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Complete Amino Acid Combinations</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;font-size:0.9em;">
            <div style="padding:10px;background:#e3f2fd;border-radius:4px;">
              <strong>Rice + Beans/Lentils</strong><br>
              <span style="color:#666;">Classic complete protein combo</span>
            </div>
            <div style="padding:10px;background:#e8f5e8;border-radius:4px;">
              <strong>Hummus + Whole Grain Pita</strong><br>
              <span style="color:#666;">Middle Eastern perfection</span>
            </div>
            <div style="padding:10px;background:#fff3cd;border-radius:4px;">
              <strong>Peanut Butter + Whole Grain Bread</strong><br>
              <span style="color:#666;">Simple and effective</span>
            </div>
            <div style="padding:10px;background:#f8d7da;border-radius:4px;">
              <strong>Quinoa + Any Vegetable</strong><br>
              <span style="color:#666;">Already complete protein</span>
            </div>
            <div style="padding:10px;background:#e2e3e5;border-radius:4px;">
              <strong>Nuts/Seeds + Legumes</strong><br>
              <span style="color:#666;">Trail mix or salad toppings</span>
            </div>
            <div style="padding:10px;background:#d1ecf1;border-radius:4px;">
              <strong>Soy Products + Grains</strong><br>
              <span style="color:#666;">Tofu stir-fry with rice</span>
            </div>
          </div>
        </div>

        ${tips.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Personalized Tips for Success</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Important Considerations</h4>
          <ul style="margin:5px 0;color:#856404;">
            ${warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🌟 Plant-Based Protein Success Tips</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🥣 Preparation Tips:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Soak beans overnight for better digestion</li>
                <li>Sprout legumes to increase protein availability</li>
                <li>Cook grains with protein-rich plant milk</li>
              </ul>
            </div>
            <div>
              <strong>⏰ Timing Strategies:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Include protein in every meal and snack</li>
                <li>Post-workout protein within 2 hours</li>
                <li>Spread protein throughout the day</li>
              </ul>
            </div>
            <div>
              <strong>🔄 Variety is Key:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Rotate different protein sources daily</li>
                <li>Try new recipes and combinations</li>
                <li>Mix colors and textures for nutrients</li>
              </ul>
            </div>
            <div>
              <strong>📊 Track Progress:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Monitor energy levels and recovery</li>
                <li>Log protein intake for first few weeks</li>
                <li>Adjust based on how you feel</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">🧪 Essential Nutrients to Monitor</h4>
          <div style="color:#383d41;font-size:0.9em;">
            <p><strong>Beyond protein, ensure adequate intake of:</strong></p>
            <ul>
              <li><strong>Vitamin B12:</strong> Supplement or fortified foods (critical for vegans)</li>
              <li><strong>Iron:</strong> Pair with vitamin C foods for better absorption</li>
              <li><strong>Zinc:</strong> Pumpkin seeds, cashews, chickpeas</li>
              <li><strong>Omega-3:</strong> Flax, chia, hemp seeds, algae supplements</li>
              <li><strong>Calcium:</strong> Tahini, almonds, leafy greens, fortified plant milks</li>
              <li><strong>Vitamin D:</strong> Sunlight exposure and/or supplements</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});