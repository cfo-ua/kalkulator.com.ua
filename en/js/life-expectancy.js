document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('life-expectancy-form');
  const result = document.getElementById('life-expectancy-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const country = form.country.value;
    const familyLongevity = form['family-longevity'].value;
    const familyDiseases = form['family-diseases'].value;
    const healthStatus = form['health-status'].value;
    const bmi = form.bmi.value;
    const smoking = form.smoking.value;
    const alcohol = form.alcohol.value;
    const exercise = form.exercise.value;
    const diet = form.diet.value;
    const processedFood = form['processed-food'].value;
    const stress = form.stress.value;
    const social = form.social.value;
    const sleep = form.sleep.value;
    const environment = form.environment.value;
    const occupationRisk = form['occupation-risk'].value;

    // Validation
    if (!age || !gender || !country || !familyLongevity || !familyDiseases || 
        !healthStatus || !bmi || !smoking || !alcohol || !exercise || !diet || 
        !processedFood || !stress || !social || !sleep || !environment || !occupationRisk) {
      result.innerHTML = '<p style="color:red;">Please answer all questions to get an accurate life expectancy calculation.</p>';
      return;
    }

    // Base life expectancy by country and gender
    let baseLifeExpectancy = 0;
    const countryAdjustments = {
      'high': { male: 82, female: 87 },
      'medium-high': { male: 78, female: 83 },
      'medium': { male: 74, female: 79 },
      'low-medium': { male: 70, female: 75 },
      'low': { male: 65, female: 70 }
    };
    
    baseLifeExpectancy = countryAdjustments[country][gender];

    // Initialize adjustments
    let lifeExpectancyAdjustment = 0;
    let factorImpacts = {};

    // Family genetics impact (±8 years)
    let familyAdjustment = 0;
    switch (familyLongevity) {
      case 'excellent': familyAdjustment = +6; break;
      case 'good': familyAdjustment = +3; break;
      case 'average': familyAdjustment = 0; break;
      case 'poor': familyAdjustment = -4; break;
      case 'unknown': familyAdjustment = -1; break;
    }
    
    switch (familyDiseases) {
      case 'none': familyAdjustment += 2; break;
      case 'minimal': familyAdjustment += 1; break;
      case 'moderate': familyAdjustment -= 2; break;
      case 'significant': familyAdjustment -= 4; break;
    }
    
    factorImpacts.genetics = familyAdjustment;
    lifeExpectancyAdjustment += familyAdjustment;

    // Current health status impact (±6 years)
    let healthAdjustment = 0;
    switch (healthStatus) {
      case 'excellent': healthAdjustment = +4; break;
      case 'very-good': healthAdjustment = +2; break;
      case 'good': healthAdjustment = 0; break;
      case 'fair': healthAdjustment = -3; break;
      case 'poor': healthAdjustment = -6; break;
    }
    factorImpacts.currentHealth = healthAdjustment;
    lifeExpectancyAdjustment += healthAdjustment;

    // BMI impact (±4 years)
    let bmiAdjustment = 0;
    switch (bmi) {
      case 'underweight': bmiAdjustment = -2; break;
      case 'normal': bmiAdjustment = +2; break;
      case 'overweight': bmiAdjustment = -1; break;
      case 'obese': bmiAdjustment = -3; break;
      case 'severely-obese': bmiAdjustment = -4; break;
    }
    factorImpacts.bmi = bmiAdjustment;
    lifeExpectancyAdjustment += bmiAdjustment;

    // Smoking impact (±8 years)
    let smokingAdjustment = 0;
    switch (smoking) {
      case 'never': smokingAdjustment = +3; break;
      case 'former': smokingAdjustment = +1; break;
      case 'recent-former': smokingAdjustment = -1; break;
      case 'light': smokingAdjustment = -4; break;
      case 'moderate': smokingAdjustment = -6; break;
      case 'heavy': smokingAdjustment = -8; break;
    }
    factorImpacts.smoking = smokingAdjustment;
    lifeExpectancyAdjustment += smokingAdjustment;

    // Alcohol impact (±3 years)
    let alcoholAdjustment = 0;
    switch (alcohol) {
      case 'none': alcoholAdjustment = +1; break;
      case 'light': alcoholAdjustment = +2; break; // Moderate alcohol can be protective
      case 'moderate': alcoholAdjustment = 0; break;
      case 'heavy': alcoholAdjustment = -2; break;
      case 'binge': alcoholAdjustment = -3; break;
    }
    factorImpacts.alcohol = alcoholAdjustment;
    lifeExpectancyAdjustment += alcoholAdjustment;

    // Exercise impact (±6 years)
    let exerciseAdjustment = 0;
    switch (exercise) {
      case 'very-active': exerciseAdjustment = +5; break;
      case 'active': exerciseAdjustment = +4; break;
      case 'somewhat-active': exerciseAdjustment = +2; break;
      case 'lightly-active': exerciseAdjustment = 0; break;
      case 'sedentary': exerciseAdjustment = -3; break;
    }
    factorImpacts.exercise = exerciseAdjustment;
    lifeExpectancyAdjustment += exerciseAdjustment;

    // Diet impact (±4 years)
    let dietAdjustment = 0;
    switch (diet) {
      case 'excellent': dietAdjustment = +3; break;
      case 'very-good': dietAdjustment = +2; break;
      case 'good': dietAdjustment = +1; break;
      case 'fair': dietAdjustment = -1; break;
      case 'poor': dietAdjustment = -3; break;
    }
    
    switch (processedFood) {
      case 'minimal': dietAdjustment += 1; break;
      case 'low': dietAdjustment += 0; break;
      case 'moderate': dietAdjustment -= 1; break;
      case 'high': dietAdjustment -= 2; break;
      case 'very-high': dietAdjustment -= 3; break;
    }
    
    factorImpacts.diet = dietAdjustment;
    lifeExpectancyAdjustment += dietAdjustment;

    // Stress impact (±4 years)
    let stressAdjustment = 0;
    switch (stress) {
      case 'low': stressAdjustment = +3; break;
      case 'moderate': stressAdjustment = +1; break;
      case 'high': stressAdjustment = -2; break;
      case 'chronic': stressAdjustment = -4; break;
    }
    factorImpacts.stress = stressAdjustment;
    lifeExpectancyAdjustment += stressAdjustment;

    // Social connections impact (±4 years)
    let socialAdjustment = 0;
    switch (social) {
      case 'very-strong': socialAdjustment = +3; break;
      case 'strong': socialAdjustment = +2; break;
      case 'moderate': socialAdjustment = +1; break;
      case 'weak': socialAdjustment = -1; break;
      case 'isolated': socialAdjustment = -3; break;
    }
    factorImpacts.social = socialAdjustment;
    lifeExpectancyAdjustment += socialAdjustment;

    // Sleep impact (±3 years)
    let sleepAdjustment = 0;
    switch (sleep) {
      case 'excellent': sleepAdjustment = +2; break;
      case 'good': sleepAdjustment = +1; break;
      case 'fair': sleepAdjustment = 0; break;
      case 'poor': sleepAdjustment = -2; break;
      case 'very-poor': sleepAdjustment = -3; break;
    }
    factorImpacts.sleep = sleepAdjustment;
    lifeExpectancyAdjustment += sleepAdjustment;

    // Environment impact (±3 years)
    let environmentAdjustment = 0;
    switch (environment) {
      case 'very-safe': environmentAdjustment = +2; break;
      case 'safe': environmentAdjustment = +1; break;
      case 'moderate': environmentAdjustment = 0; break;
      case 'concerning': environmentAdjustment = -2; break;
      case 'hazardous': environmentAdjustment = -3; break;
    }
    factorImpacts.environment = environmentAdjustment;
    lifeExpectancyAdjustment += environmentAdjustment;

    // Occupation risk impact (±2 years)
    let occupationAdjustment = 0;
    switch (occupationRisk) {
      case 'low': occupationAdjustment = +1; break;
      case 'moderate': occupationAdjustment = 0; break;
      case 'high': occupationAdjustment = -1; break;
      case 'extreme': occupationAdjustment = -2; break;
    }
    factorImpacts.occupation = occupationAdjustment;
    lifeExpectancyAdjustment += occupationAdjustment;

    // Calculate final life expectancy
    const estimatedLifeExpectancy = Math.round(baseLifeExpectancy + lifeExpectancyAdjustment);
    const yearsRemaining = Math.max(0, estimatedLifeExpectancy - age);
    
    // Calculate healthy life expectancy (typically 85-90% of total)
    const healthyLifeExpectancy = Math.round(estimatedLifeExpectancy * 0.88);
    const healthyYearsRemaining = Math.max(0, healthyLifeExpectancy - age);

    // Determine risk categories
    let overallRisk, riskColor;
    const totalNegativeImpact = Object.values(factorImpacts).filter(val => val < 0).reduce((sum, val) => sum + Math.abs(val), 0);
    
    if (totalNegativeImpact <= 5) {
      overallRisk = 'Low Risk';
      riskColor = '#28a745';
    } else if (totalNegativeImpact <= 15) {
      overallRisk = 'Moderate Risk';
      riskColor = '#ffc107';
    } else if (totalNegativeImpact <= 25) {
      overallRisk = 'High Risk';
      riskColor = '#fd7e14';
    } else {
      overallRisk = 'Very High Risk';
      riskColor = '#dc3545';
    }

    // Generate recommendations
    let recommendations = [];
    
    if (factorImpacts.smoking < 0) {
      recommendations.push('🚭 Quit smoking: This is the most impactful change you can make (+10 years potential)');
    }
    
    if (factorImpacts.exercise <= 2) {
      recommendations.push('🏃 Increase physical activity: Aim for 150+ minutes moderate exercise weekly (+4-6 years)');
    }
    
    if (factorImpacts.diet <= 1) {
      recommendations.push('🥗 Improve diet quality: Adopt Mediterranean-style eating patterns (+3-5 years)');
    }
    
    if (factorImpacts.bmi < 0) {
      recommendations.push('⚖️ Achieve healthy weight: Target BMI 18.5-24.9 for optimal longevity (+2-4 years)');
    }
    
    if (factorImpacts.stress < 0) {
      recommendations.push('🧘 Manage stress: Practice meditation, yoga, or other stress-reduction techniques (+2-4 years)');
    }
    
    if (factorImpacts.social <= 1) {
      recommendations.push('👥 Strengthen relationships: Build and maintain strong social connections (+2-4 years)');
    }
    
    if (factorImpacts.sleep <= 0) {
      recommendations.push('😴 Optimize sleep: Maintain 7-9 hours of quality sleep nightly (+2-3 years)');
    }
    
    if (factorImpacts.alcohol < 0) {
      recommendations.push('🍷 Moderate alcohol: Limit to light-moderate consumption or eliminate (+2-3 years)');
    }

    // Top lifestyle changes for this person
    const sortedFactors = Object.entries(factorImpacts)
      .filter(([key, value]) => value < 1)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 3);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Life Expectancy Assessment</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
            <div>
              <div style="display:inline-block;background:#157aff;color:white;padding:15px 25px;border-radius:50px;font-size:1.3em;font-weight:bold;margin-bottom:10px;">
                ${estimatedLifeExpectancy} years
              </div>
              <h4 style="color:#157aff;margin:5px 0;">Estimated Life Expectancy</h4>
              <p style="color:#666;margin:0;">${yearsRemaining} years remaining</p>
            </div>
            <div>
              <div style="display:inline-block;background:#6f9f6f;color:white;padding:15px 25px;border-radius:50px;font-size:1.3em;font-weight:bold;margin-bottom:10px;">
                ${healthyLifeExpectancy} years
              </div>
              <h4 style="color:#6f9f6f;margin:5px 0;">Healthy Life Expectancy</h4>
              <p style="color:#666;margin:0;">${healthyYearsRemaining} healthy years remaining</p>
            </div>
          </div>
          <div style="background:${riskColor};color:white;padding:10px 20px;border-radius:25px;display:inline-block;">
            <strong>Overall Risk Level: ${overallRisk}</strong>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Life Expectancy Factors Impact</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            ${Object.entries(factorImpacts).map(([factor, impact]) => {
              const displayName = {
                genetics: 'Family History',
                currentHealth: 'Current Health',
                bmi: 'Body Weight',
                smoking: 'Smoking',
                alcohol: 'Alcohol',
                exercise: 'Exercise',
                diet: 'Diet Quality',
                stress: 'Stress Level',
                social: 'Social Connections',
                sleep: 'Sleep Quality',
                environment: 'Environment',
                occupation: 'Occupation Risk'
              }[factor];
              
              const color = impact > 0 ? '#28a745' : impact < 0 ? '#dc3545' : '#6c757d';
              const sign = impact > 0 ? '+' : '';
              
              return `
                <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
                  <span>${displayName}:</span>
                  <span style="font-weight:bold;color:${color};">${sign}${impact} years</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Comparison to National Average</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div>
              <strong>Your Estimate:</strong> ${estimatedLifeExpectancy} years<br>
              <strong>National Average:</strong> ${baseLifeExpectancy} years<br>
              <strong>Difference:</strong> 
              <span style="color:${lifeExpectancyAdjustment >= 0 ? '#28a745' : '#dc3545'};font-weight:bold;">
                ${lifeExpectancyAdjustment >= 0 ? '+' : ''}${lifeExpectancyAdjustment} years
              </span>
            </div>
            <div>
              <strong>Biological Age:</strong> ${Math.round(age - lifeExpectancyAdjustment/2)} years<br>
              <strong>Health Span:</strong> ~${Math.round(healthyLifeExpectancy - age)} years<br>
              <strong>Decline Period:</strong> ~${Math.round(estimatedLifeExpectancy - healthyLifeExpectancy)} years
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">🎯 Priority Recommendations for Longevity</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🌟 Evidence-Based Longevity Strategies</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🏃 Exercise Longevity:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>150 min moderate cardio weekly</li>
                <li>2+ strength training sessions</li>
                <li>Daily walking (8,000+ steps)</li>
                <li>Flexibility and balance work</li>
              </ul>
            </div>
            <div>
              <strong>🥗 Nutrition Longevity:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Mediterranean diet pattern</li>
                <li>80% plant-based foods</li>
                <li>Omega-3 rich fish 2x/week</li>
                <li>Limit processed foods</li>
              </ul>
            </div>
            <div>
              <strong>🧘 Mental Longevity:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Daily stress management</li>
                <li>Strong social connections</li>
                <li>Sense of purpose</li>
                <li>Continuous learning</li>
              </ul>
            </div>
            <div>
              <strong>😴 Sleep Longevity:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>7-9 hours nightly</li>
                <li>Consistent sleep schedule</li>
                <li>Cool, dark environment</li>
                <li>No screens before bed</li>
              </ul>
            </div>
          </div>
        </div>

        ${sortedFactors.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚡ Top 3 Areas for Improvement</h4>
          <ol style="margin:5px 0;color:#856404;">
            ${sortedFactors.map(([factor, impact]) => {
              const improvements = {
                smoking: 'Quit smoking completely - single biggest longevity improvement',
                exercise: 'Increase physical activity to 150+ minutes per week',
                diet: 'Adopt Mediterranean diet with more vegetables and fish',
                bmi: 'Achieve healthy BMI through diet and exercise',
                stress: 'Practice daily stress management techniques',
                social: 'Build stronger social connections and relationships',
                sleep: 'Improve sleep quality and maintain 7-9 hours nightly',
                alcohol: 'Reduce alcohol consumption to light-moderate levels',
                environment: 'Consider relocating to safer, cleaner environment',
                occupation: 'Reduce occupational risks where possible'
              }[factor] || 'Focus on improving this health factor';
              
              return `<li>${improvements} (potential +${Math.abs(impact)} years)</li>`;
            }).join('')}
          </ol>
        </div>
        ` : ''}

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#495057;">📊 Blue Zone Longevity Principles</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🥬 Plant-Based Diet:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Beans and legumes daily</li>
                <li>Nuts and seeds regularly</li>
                <li>Whole grains over refined</li>
                <li>Minimal meat consumption</li>
              </ul>
            </div>
            <div>
              <strong>🎯 Life Purpose:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Clear sense of purpose</li>
                <li>Regular goal setting</li>
                <li>Meaningful work/volunteering</li>
                <li>Spiritual or philosophical practice</li>
              </ul>
            </div>
            <div>
              <strong>👨‍👩‍👧‍👦 Family First:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Strong family bonds</li>
                <li>Multi-generational living</li>
                <li>Elder care and respect</li>
                <li>Regular family meals</li>
              </ul>
            </div>
            <div>
              <strong>🍷 Wine & Wisdom:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Moderate wine with meals</li>
                <li>Social drinking patterns</li>
                <li>Mindful consumption</li>
                <li>Quality over quantity</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Important Notes</h4>
          <ul style="margin:0;color:#721c24;font-size:0.9em;">
            <li>Life expectancy estimates are based on statistical models and current research</li>
            <li>Individual variation is significant - genetics, luck, and medical advances matter</li>
            <li>Focus on healthspan (healthy years) as much as lifespan</li>
            <li>Many factors can be modified to improve both quantity and quality of life</li>
            <li>Regular medical checkups and preventive care are essential</li>
            <li>This calculator is for educational purposes only, not medical advice</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});