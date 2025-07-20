document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('intermittent-fasting-schedule-form');
  const result = document.getElementById('intermittent-fasting-schedule-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const goal = form.goal.value;
    const experience = form.experience.value;
    const workSchedule = form['work-schedule'].value;
    const wakeTime = form['wake-time'].value;
    const sleepTime = form['sleep-time'].value;
    const workoutTime = form['workout-time'].value;
    const socialMeals = form['social-meals'].value;
    const skipMeal = form['skip-meal'].value;
    const hungerTolerance = form['hunger-tolerance'].value;
    const weekendPreference = form['weekend-preference'].value;
    const energyLevels = form['energy-levels'].value;
    
    // Get health considerations
    const healthCheckboxes = form.querySelectorAll('input[name="health-considerations"]:checked');
    const healthConsiderations = Array.from(healthCheckboxes).map(cb => cb.value);

    // Validation
    if (!goal || !experience || !workSchedule || !wakeTime || !sleepTime || 
        !workoutTime || !socialMeals || !skipMeal || !hungerTolerance || 
        !weekendPreference || !energyLevels || healthConsiderations.length === 0) {
      result.innerHTML = '<p style="color:red;">Please fill in all fields and select at least one health consideration option.</p>';
      return;
    }

    // Parse times
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    
    // Calculate wake time in minutes from midnight
    const wakeMinutes = wakeHour * 60 + wakeMin;
    const sleepMinutes = sleepHour * 60 + sleepMin;

    // Recommend IF method based on inputs
    let recommendedMethod = '';
    let fastingHours = 16;
    let eatingHours = 8;
    let methodDescription = '';
    let difficulty = '';

    // Check for health concerns that might affect recommendations
    const hasHealthConcerns = healthConsiderations.some(h => h !== 'none');
    const hasEatingHistory = healthConsiderations.includes('eating-history');
    const hasMedicationRequirements = healthConsiderations.includes('medications');
    
    if (hasEatingHistory) {
      result.innerHTML = `
        <div style="background:#f8d7da;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#721c24;margin-top:0;">⚠️ Important Notice</h3>
          <p style="color:#721c24;">
            Given your history of disordered eating, intermittent fasting may not be appropriate. 
            Please consult with a healthcare professional or registered dietitian before starting 
            any fasting protocol. Your health and well-being are the top priority.
          </p>
        </div>
      `;
      return;
    }

    // Determine method based on experience and other factors
    if (experience === 'beginner') {
      if (hungerTolerance === 'low') {
        recommendedMethod = '14:10';
        fastingHours = 14;
        eatingHours = 10;
        difficulty = 'Easy';
        methodDescription = 'A gentle introduction to IF with a 14-hour fast and 10-hour eating window.';
      } else {
        recommendedMethod = '16:8';
        fastingHours = 16;
        eatingHours = 8;
        difficulty = 'Moderate';
        methodDescription = 'The most popular IF method with a 16-hour fast and 8-hour eating window.';
      }
    } else if (experience === 'some-experience') {
      recommendedMethod = '16:8';
      fastingHours = 16;
      eatingHours = 8;
      difficulty = 'Moderate';
      methodDescription = 'The classic 16:8 method - proven effective and sustainable for most people.';
    } else if (experience === 'experienced') {
      if (goal === 'weight-loss' && hungerTolerance === 'high') {
        recommendedMethod = '18:6';
        fastingHours = 18;
        eatingHours = 6;
        difficulty = 'Challenging';
        methodDescription = 'Extended fasting for enhanced weight loss and metabolic benefits.';
      } else {
        recommendedMethod = '16:8';
        fastingHours = 16;
        eatingHours = 8;
        difficulty = 'Moderate';
        methodDescription = 'Maintain the proven 16:8 method for consistency and sustainability.';
      }
    } else { // advanced
      if (goal === 'weight-loss' && hungerTolerance === 'very-high') {
        recommendedMethod = 'OMAD (23:1)';
        fastingHours = 23;
        eatingHours = 1;
        difficulty = 'Very Challenging';
        methodDescription = 'One Meal A Day - maximum autophagy and weight loss benefits.';
      } else if (hungerTolerance === 'high') {
        recommendedMethod = '20:4';
        fastingHours = 20;
        eatingHours = 4;
        difficulty = 'Challenging';
        methodDescription = 'Extended fasting with a 4-hour eating window for experienced practitioners.';
      } else {
        recommendedMethod = '18:6';
        fastingHours = 18;
        eatingHours = 6;
        difficulty = 'Challenging';
        methodDescription = 'Extended 18-hour fast with 6-hour eating window.';
      }
    }

    // Adjust for health considerations
    if (healthConsiderations.includes('diabetes')) {
      if (fastingHours > 16) {
        recommendedMethod = '16:8';
        fastingHours = 16;
        eatingHours = 8;
        methodDescription += ' (Modified for blood sugar management)';
      }
    }

    // Calculate optimal eating window based on preferences and schedule
    let startTime, endTime;
    
    if (skipMeal === 'breakfast' || skipMeal === 'flexible') {
      // Skip breakfast - most common approach
      if (socialMeals === 'regular' || socialMeals === 'frequent') {
        // Accommodate family dinners
        endTime = 20; // 8 PM
        startTime = endTime - eatingHours;
      } else if (workSchedule === 'regular-9-5') {
        // Standard lunch and dinner
        startTime = 12; // 12 PM
        endTime = startTime + eatingHours;
      } else {
        // Optimize based on wake time
        startTime = Math.max(10, wakeHour + 4); // At least 4 hours after waking
        endTime = startTime + eatingHours;
      }
    } else if (skipMeal === 'lunch') {
      // Early dinner approach
      startTime = Math.max(7, wakeHour + 1); // 1 hour after waking
      endTime = startTime + eatingHours;
    } else if (skipMeal === 'dinner') {
      // Late breakfast/lunch approach
      startTime = Math.max(8, wakeHour + 2); // 2 hours after waking
      endTime = Math.min(16, startTime + eatingHours); // End by 4 PM
    }

    // Ensure times are within reasonable bounds
    startTime = Math.max(6, Math.min(16, startTime));
    endTime = Math.max(12, Math.min(22, endTime));
    
    // Adjust if window is too small due to bounds
    if (endTime - startTime < eatingHours) {
      if (startTime <= 12) {
        endTime = startTime + eatingHours;
      } else {
        startTime = endTime - eatingHours;
      }
    }

    // Format times
    const formatTime = (hour) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:00 ${period}`;
    };

    const fastStart = endTime;
    const fastEnd = startTime + 24; // Next day

    // Generate weekly schedule
    const weeklySchedule = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ].map(day => {
      let dayStartTime = startTime;
      let dayEndTime = endTime;
      
      // Adjust weekend schedule if needed
      if ((day === 'Saturday' || day === 'Sunday') && weekendPreference !== 'same') {
        if (weekendPreference === 'flexible' || weekendPreference === 'social') {
          // Add 1-2 hours flexibility
          dayStartTime = Math.max(8, startTime - 1);
          dayEndTime = Math.min(22, endTime + 2);
          return {
            day,
            eating: `${formatTime(dayStartTime)} - ${formatTime(dayEndTime)}`,
            note: 'Flexible timing for social activities'
          };
        } else if (weekendPreference === 'relaxed') {
          return {
            day,
            eating: 'Intuitive eating',
            note: 'Listen to your body'
          };
        }
      }
      
      return {
        day,
        eating: `${formatTime(dayStartTime)} - ${formatTime(dayEndTime)}`,
        note: ''
      };
    });

    // Generate personalized tips
    let tips = [];
    
    if (experience === 'beginner') {
      tips.push('🌟 Start gradually: Try 12:12 for the first week, then extend to your target schedule');
      tips.push('💧 Stay hydrated: Drink plenty of water, herbal tea, and black coffee during fasting');
    }
    
    if (workoutTime !== 'none') {
      if (workoutTime === 'morning' && startTime > 12) {
        tips.push('🏋️ Pre-workout fuel: Consider having a small snack if working out in a fasted state feels difficult');
      } else {
        tips.push('🏋️ Post-workout nutrition: Time your first meal within 2 hours after intense workouts');
      }
    }
    
    if (socialMeals === 'frequent') {
      tips.push('👥 Social flexibility: It\'s okay to adjust your window for important social events');
    }
    
    if (energyLevels === 'low') {
      tips.push('⚡ Energy management: Monitor your energy levels and adjust fasting length if needed');
    }
    
    if (hasMedicationRequirements) {
      tips.push('💊 Medication timing: Coordinate with your doctor about taking medications during fasting periods');
    }

    // Warnings
    let warnings = [];
    
    if (healthConsiderations.includes('diabetes')) {
      warnings.push('⚠️ Blood sugar monitoring: Check glucose levels regularly and adjust as needed');
    }
    
    if (healthConsiderations.includes('high-stress')) {
      warnings.push('⚠️ Stress management: High stress can make fasting more challenging - prioritize sleep and relaxation');
    }
    
    if (fastingHours > 18) {
      warnings.push('⚠️ Extended fasting: This is an advanced protocol - ensure you\'re getting adequate nutrition');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Personalized Intermittent Fasting Schedule</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <h4 style="color:#157aff;margin-top:0;">Recommended Method: ${recommendedMethod}</h4>
          <div style="display:flex;justify-content:center;align-items:center;gap:20px;flex-wrap:wrap;margin:20px 0;">
            <div style="text-align:center;">
              <div style="background:#dc3545;color:white;padding:15px;border-radius:8px;margin-bottom:8px;">
                <div style="font-size:1.5em;font-weight:bold;">${fastingHours} Hours</div>
                <div style="font-size:0.9em;">Fasting Period</div>
              </div>
            </div>
            <div style="font-size:1.5em;color:#ccc;">+</div>
            <div style="text-align:center;">
              <div style="background:#28a745;color:white;padding:15px;border-radius:8px;margin-bottom:8px;">
                <div style="font-size:1.5em;font-weight:bold;">${eatingHours} Hours</div>
                <div style="font-size:0.9em;">Eating Window</div>
              </div>
            </div>
          </div>
          <p style="color:#666;margin:10px 0;"><strong>Difficulty:</strong> ${difficulty}</p>
          <p style="color:#666;margin:0;">${methodDescription}</p>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Your Daily Schedule</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="background:#d4edda;padding:15px;border-radius:6px;">
              <h5 style="color:#155724;margin-top:0;">🍽️ Eating Window</h5>
              <div style="font-size:1.2em;font-weight:bold;color:#155724;">${formatTime(startTime)} - ${formatTime(endTime)}</div>
              <div style="color:#155724;font-size:0.9em;margin-top:5px;">Time for all meals and snacks</div>
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;">
              <h5 style="color:#721c24;margin-top:0;">⏰ Fasting Period</h5>
              <div style="font-size:1.2em;font-weight:bold;color:#721c24;">${formatTime(endTime)} - ${formatTime(startTime)} (next day)</div>
              <div style="color:#721c24;font-size:0.9em;margin-top:5px;">Water, tea, black coffee only</div>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Weekly Schedule</h4>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Day</th>
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Eating Window</th>
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Notes</th>
                </tr>
              </thead>
              <tbody>
                ${weeklySchedule.map(schedule => `
                  <tr>
                    <td style="padding:10px;border-bottom:1px solid #dee2e6;font-weight:bold;">${schedule.day}</td>
                    <td style="padding:10px;border-bottom:1px solid #dee2e6;">${schedule.eating}</td>
                    <td style="padding:10px;border-bottom:1px solid #dee2e6;color:#666;font-size:0.9em;">${schedule.note}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Sample Meal Timing</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            ${eatingHours >= 8 ? `
              <div style="text-align:center;padding:10px;background:#fff3cd;border-radius:4px;">
                <div style="font-weight:bold;color:#856404;">First Meal</div>
                <div style="color:#856404;">${formatTime(startTime)}</div>
                <div style="font-size:0.8em;color:#856404;">Break your fast</div>
              </div>
              <div style="text-align:center;padding:10px;background:#d1ecf1;border-radius:4px;">
                <div style="font-weight:bold;color:#0c5460;">Lunch/Snack</div>
                <div style="color:#0c5460;">${formatTime(Math.round((startTime + endTime) / 2))}</div>
                <div style="font-size:0.8em;color:#0c5460;">Mid-window meal</div>
              </div>
              <div style="text-align:center;padding:10px;background:#d4edda;border-radius:4px;">
                <div style="font-weight:bold;color:#155724;">Last Meal</div>
                <div style="color:#155724;">${formatTime(endTime - 1)}</div>
                <div style="font-size:0.8em;color:#155724;">End eating window</div>
              </div>
            ` : eatingHours >= 6 ? `
              <div style="text-align:center;padding:10px;background:#fff3cd;border-radius:4px;">
                <div style="font-weight:bold;color:#856404;">First Meal</div>
                <div style="color:#856404;">${formatTime(startTime)}</div>
                <div style="font-size:0.8em;color:#856404;">Large meal to break fast</div>
              </div>
              <div style="text-align:center;padding:10px;background:#d4edda;border-radius:4px;">
                <div style="font-weight:bold;color:#155724;">Second Meal</div>
                <div style="color:#155724;">${formatTime(endTime - 1)}</div>
                <div style="font-size:0.8em;color:#155724;">Complete nutrition</div>
              </div>
            ` : `
              <div style="text-align:center;padding:15px;background:#fff3cd;border-radius:4px;">
                <div style="font-weight:bold;color:#856404;">Single Large Meal</div>
                <div style="color:#856404;">${formatTime(startTime)}</div>
                <div style="font-size:0.8em;color:#856404;">All daily nutrition in one meal</div>
              </div>
            `}
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
          <h4 style="margin-top:0;color:#155724;">🎯 Getting Started Action Plan</h4>
          <ol style="margin:5px 0;color:#155724;">
            <li><strong>Week 1:</strong> ${experience === 'beginner' ? 'Start with 12:12 to adapt gradually' : 'Begin your recommended schedule'}</li>
            <li><strong>Week 2-3:</strong> ${experience === 'beginner' ? 'Transition to your target schedule' : 'Fine-tune timing based on energy and hunger'}</li>
            <li><strong>Week 4+:</strong> Maintain consistency and monitor how you feel</li>
            <li><strong>Ongoing:</strong> Adjust window timing for social events when needed</li>
            <li><strong>Monthly:</strong> Reassess and modify if life circumstances change</li>
          </ol>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">🍽️ What to Eat During Your Window</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;color:#383d41;font-size:0.9em;">
            <div>
              <strong>Proteins:</strong> Lean meats, fish, eggs, legumes, Greek yogurt
            </div>
            <div>
              <strong>Healthy Fats:</strong> Avocados, nuts, olive oil, seeds
            </div>
            <div>
              <strong>Complex Carbs:</strong> Vegetables, fruits, whole grains, sweet potatoes
            </div>
            <div>
              <strong>Hydration:</strong> Water, herbal teas, electrolytes as needed
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});