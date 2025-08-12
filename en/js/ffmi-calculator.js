document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('ffmi-form');
  const result = document.getElementById('ffmi-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const gender = form.gender.value;
    const heightInput = +form.height.value;
    const heightUnit = form['height-unit'].value;
    const inches = form.inches ? +form.inches.value || 0 : 0;
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const bodyFatPercent = +form['body-fat'].value;
    const measurementMethod = form['measurement-method'].value;
    const trainingLevel = form['training-level'].value;
    const trainingFrequency = +form['training-frequency'].value;

    // Validation
    if (!gender || !heightInput || !weightInput || !bodyFatPercent || !trainingLevel || trainingFrequency === '') {
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

    // Calculate fat mass and lean body mass
    const fatMass = (bodyFatPercent / 100) * weightKg;
    const leanBodyMass = weightKg - fatMass;

    // Calculate FFMI
    const heightM = height / 100;
    const ffmi = leanBodyMass / (heightM * heightM);

    // Calculate normalized FFMI (adjusted for height)
    const normalizedFFMI = ffmi + (6.1 * (1.8 - heightM));

    // Calculate BMI for comparison
    const bmi = weightKg / (heightM * heightM);

    // Determine FFMI category based on gender
    let category, categoryColor, categoryDescription, naturalLimit;
    
    if (gender === 'male') {
      naturalLimit = 25;
      if (ffmi < 16) {
        category = 'Low';
        categoryColor = '#dc3545';
        categoryDescription = 'Insufficient muscle mass. Strength training and increased protein intake recommended.';
      } else if (ffmi < 18) {
        category = 'Normal';
        categoryColor = '#ffc107';
        categoryDescription = 'Average muscle mass for untrained individuals. Significant improvement potential exists.';
      } else if (ffmi < 20) {
        category = 'Good';
        categoryColor = '#17a2b8';
        categoryDescription = 'Good muscle mass. Result of regular training and proper nutrition.';
      } else if (ffmi < 22) {
        category = 'Excellent';
        categoryColor = '#28a745';
        categoryDescription = 'Excellent muscle mass. Level of an experienced athlete or bodybuilder.';
      } else if (ffmi < 25) {
        category = 'Elite';
        categoryColor = '#6f42c1';
        categoryDescription = 'Elite level muscle mass. Result of years of intensive training.';
      } else {
        category = 'Extreme';
        categoryColor = '#e83e8c';
        categoryDescription = 'Extreme muscle mass level, often exceeding natural genetic limits.';
      }
    } else {
      naturalLimit = 20;
      if (ffmi < 14) {
        category = 'Low';
        categoryColor = '#dc3545';
        categoryDescription = 'Insufficient muscle mass. Strength training and increased protein intake recommended.';
      } else if (ffmi < 16) {
        category = 'Normal';
        categoryColor = '#ffc107';
        categoryDescription = 'Average muscle mass for untrained individuals. Significant improvement potential exists.';
      } else if (ffmi < 17) {
        category = 'Good';
        categoryColor = '#17a2b8';
        categoryDescription = 'Good muscle mass. Result of regular training and proper nutrition.';
      } else if (ffmi < 18) {
        category = 'Excellent';
        categoryColor = '#28a745';
        categoryDescription = 'Excellent muscle mass. Level of an experienced female athlete or fitness model.';
      } else if (ffmi < 20) {
        category = 'Elite';
        categoryColor = '#6f42c1';
        categoryDescription = 'Elite level muscle mass. Result of years of intensive training.';
      } else {
        category = 'Extreme';
        categoryColor = '#e83e8c';
        categoryDescription = 'Extreme muscle mass level, often exceeding natural genetic limits.';
      }
    }

    // Generate recommendations based on current level and training
    let recommendations = [];
    
    if (ffmi < (gender === 'male' ? 18 : 16)) {
      recommendations.push('🏋️ Start regular strength training 3-4 times per week');
      recommendations.push('🥩 Increase protein intake to 1.6-2.2g per kg body weight');
      recommendations.push('📈 Create a caloric surplus of 200-500 calories for muscle growth');
    }
    
    if (trainingFrequency < 3) {
      recommendations.push('📅 Increase strength training frequency to 3-5 times per week');
    }
    
    if (bodyFatPercent > (gender === 'male' ? 20 : 25)) {
      recommendations.push('🔥 Consider reducing body fat percentage for better muscle definition');
    }
    
    if (bodyFatPercent < (gender === 'male' ? 8 : 16)) {
      recommendations.push('⚠️ Body fat percentage is very low - may negatively impact health and hormones');
    }

    // General recommendations
    recommendations.push('😴 Ensure 7-9 hours of quality sleep for muscle recovery');
    recommendations.push('💧 Drink 2.5-3.5 liters of water daily for optimal muscle function');
    
    if (ffmi >= (gender === 'male' ? 22 : 18)) {
      recommendations.push('🎯 You\'ve reached a high level - focus on maintenance and fine improvements');
    }

    // Training level names
    const trainingLevelNames = {
      'beginner': 'Beginner',
      'novice': 'Novice', 
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert'
    };

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

    // Calculate potential improvements
    const potentialFFMI = gender === 'male' ? 
      Math.min(ffmi + (4 - Math.max(0, trainingLevel === 'expert' ? 4 : trainingLevel === 'advanced' ? 3 : trainingLevel === 'intermediate' ? 2 : trainingLevel === 'novice' ? 1 : 0)), 25) :
      Math.min(ffmi + (3 - Math.max(0, trainingLevel === 'expert' ? 3 : trainingLevel === 'advanced' ? 2.5 : trainingLevel === 'intermediate' ? 1.5 : trainingLevel === 'novice' ? 1 : 0)), 20);

    result.innerHTML = `
      <div class="mental-health-results">
        <h3 style="color:#157aff;margin-top:0;text-align:center;">💪 Your FFMI Analysis</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📊 Your FFMI</h6>
            <div class="big-number" style="color: ${categoryColor};">${ffmi.toFixed(1)}</div>
            <p>kg/m²</p>
          </div>
          
          <div class="insight-card info">
            <h6>📏 Normalized FFMI</h6>
            <div class="big-number">${normalizedFFMI.toFixed(1)}</div>
            <p>kg/m² (height adjusted)</p>
          </div>
          
          <div class="insight-card ${ffmi >= (gender === 'male' ? 20 : 17) ? 'success' : ffmi >= (gender === 'male' ? 16 : 14) ? 'warning' : 'info'}" style="border-color: ${categoryColor};">
            <h6>🏆 Category</h6>
            <div class="result-value" style="color: ${categoryColor};">${category}</div>
            <p>muscle mass level</p>
          </div>
        </div>

        <div class="insight-card ${ffmi >= (gender === 'male' ? 20 : 17) ? 'success' : ffmi >= (gender === 'male' ? 16 : 14) ? 'warning' : 'info'}" style="margin: 20px 0; border-color: ${categoryColor};">
          <h4 style="color: ${categoryColor}; margin: 5px 0; text-align: center;">${category} Muscle Mass Level</h4>
          <p style="margin: 10px 0; text-align: center;">${categoryDescription}</p>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📋 Detailed Body Composition Analysis</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Total Weight:</strong> ${weightKg.toFixed(1)} kg
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Fat-Free Mass:</strong> ${leanBodyMass.toFixed(1)} kg
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Fat Mass:</strong> ${fatMass.toFixed(1)} kg
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Body Fat %:</strong> ${bodyFatPercent.toFixed(1)}%
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>BMI:</strong> ${bmi.toFixed(1)} kg/m²
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Training Level:</strong> ${trainingLevelNames[trainingLevel]}
            </div>
          </div>
          ${measurementMethod ? `
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 15px; text-align: center;">
            <strong>Body Fat Measurement:</strong> ${methodNames[measurementMethod] || measurementMethod}
          </div>
          ` : ''}
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📊 FFMI Standards by Gender</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; font-size: 0.9em;">
            ${gender === 'male' ? `
            <div style="text-align: center; padding: 12px; background: ${ffmi < 16 ? '#ffebee' : '#f8f9fa'}; border-radius: 6px; ${ffmi < 16 ? 'border: 2px solid #f44336;' : ''}">
              <div style="font-weight: bold; color: #dc3545;">Low</div>
              <div>< 16</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 16 && ffmi < 18 ? '#fff8e1' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 16 && ffmi < 18 ? 'border: 2px solid #ffc107;' : ''}">
              <div style="font-weight: bold; color: #ffc107;">Normal</div>
              <div>16-18</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 18 && ffmi < 20 ? '#e1f5fe' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 18 && ffmi < 20 ? 'border: 2px solid #17a2b8;' : ''}">
              <div style="font-weight: bold; color: #17a2b8;">Good</div>
              <div>18-20</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 20 && ffmi < 22 ? '#e8f5e8' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 20 && ffmi < 22 ? 'border: 2px solid #28a745;' : ''}">
              <div style="font-weight: bold; color: #28a745;">Excellent</div>
              <div>20-22</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 22 && ffmi < 25 ? '#f3e5f5' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 22 && ffmi < 25 ? 'border: 2px solid #6f42c1;' : ''}">
              <div style="font-weight: bold; color: #6f42c1;">Elite</div>
              <div>22-25</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 25 ? '#fce4ec' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 25 ? 'border: 2px solid #e83e8c;' : ''}">
              <div style="font-weight: bold; color: #e83e8c;">Extreme</div>
              <div>> 25</div>
            </div>
            ` : `
            <div style="text-align: center; padding: 12px; background: ${ffmi < 14 ? '#ffebee' : '#f8f9fa'}; border-radius: 6px; ${ffmi < 14 ? 'border: 2px solid #f44336;' : ''}">
              <div style="font-weight: bold; color: #dc3545;">Low</div>
              <div>< 14</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 14 && ffmi < 16 ? '#fff8e1' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 14 && ffmi < 16 ? 'border: 2px solid #ffc107;' : ''}">
              <div style="font-weight: bold; color: #ffc107;">Normal</div>
              <div>14-16</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 16 && ffmi < 17 ? '#e1f5fe' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 16 && ffmi < 17 ? 'border: 2px solid #17a2b8;' : ''}">
              <div style="font-weight: bold; color: #17a2b8;">Good</div>
              <div>16-17</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 17 && ffmi < 18 ? '#e8f5e8' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 17 && ffmi < 18 ? 'border: 2px solid #28a745;' : ''}">
              <div style="font-weight: bold; color: #28a745;">Excellent</div>
              <div>17-18</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 18 && ffmi < 20 ? '#f3e5f5' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 18 && ffmi < 20 ? 'border: 2px solid #6f42c1;' : ''}">
              <div style="font-weight: bold; color: #6f42c1;">Elite</div>
              <div>18-20</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 20 ? '#fce4ec' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 20 ? 'border: 2px solid #e83e8c;' : ''}">
              <div style="font-weight: bold; color: #e83e8c;">Extreme</div>
              <div>> 20</div>
            </div>
            `}
          </div>
        </div>

        ${potentialFFMI > ffmi + 0.5 ? `
        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">🎯 Improvement Potential</h4>
          <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center;">
              <div>
                <div style="font-size: 1.2em; font-weight: bold;">Current FFMI</div>
                <div style="font-size: 1.5em; color: ${categoryColor};">${ffmi.toFixed(1)}</div>
              </div>
              <div style="font-size: 2em;">→</div>
              <div>
                <div style="font-size: 1.2em; font-weight: bold;">Potential FFMI</div>
                <div style="font-size: 1.5em; color: #28a745;">${potentialFFMI.toFixed(1)}</div>
              </div>
            </div>
            <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
              Possible gain: <strong>+${(potentialFFMI - ffmi).toFixed(1)} points</strong> with optimal training and nutrition
            </div>
          </div>
        </div>
        ` : ''}

        ${recommendations.length > 0 ? `
        <div class="insight-card warning" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #e65100;">🎯 Personalized Recommendations</h4>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">🏆 FFMI Improvement Plan</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">💪 Strength Training:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>3-5 training sessions per week</li>
                <li>Compound exercises: squats, deadlifts, bench press</li>
                <li>6-12 repetitions for hypertrophy</li>
                <li>Progressive overload principle</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🥗 Nutrition:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>1.6-2.2g protein per kg body weight</li>
                <li>Caloric surplus of 200-500 kcal</li>
                <li>Complex carbs and healthy fats</li>
                <li>4-6 meals throughout the day</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">😴 Recovery:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>7-9 hours of sleep nightly</li>
                <li>48-72 hours rest between sessions</li>
                <li>Stress management</li>
                <li>Adequate hydration</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">⏱️ Realistic Timeline:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>First year: +2-4 FFMI points</li>
                <li>Second year: +1-2 points</li>
                <li>Thereafter: +0.5-1 point annually</li>
                <li>Genetic limit: 3-5 years</li>
              </ul>
            </div>
          </div>
        </div>

        ${ffmi >= naturalLimit ? `
        <div class="insight-card" style="background: #fff3cd; border-color: #ffc107; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #856404;">⚠️ High FFMI Level</h4>
          <p style="margin: 0; color: #856404;">
            Your FFMI reaches or exceeds natural genetic limits (${naturalLimit} for ${gender === 'male' ? 'men' : 'women'}). 
            This level is rarely achieved through natural training alone. If achieved naturally, this represents exceptional genetics and dedication!
          </p>
        </div>
        ` : ''}

        <div class="disclaimer" style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💪 <strong>Remember:</strong> FFMI is an assessment tool, not an absolute measure of success. Accuracy depends on proper body fat measurement. 
            Focus on health, progress, and enjoyment of training, not just numbers.
          </p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});