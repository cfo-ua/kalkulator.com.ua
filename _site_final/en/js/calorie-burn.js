// Comprehensive activities list with MET values for calories burned calculator
const ACTIVITIES = [
  // Running & Jogging
  { name: "Running (5 mph/8 km/h)", met: 8.3 },
  { name: "Running (6 mph/9.7 km/h)", met: 9.8 },
  { name: "Running (7 mph/11.3 km/h)", met: 11.0 },
  { name: "Running (8 mph/12.9 km/h)", met: 11.8 },
  { name: "Running (9 mph/14.5 km/h)", met: 12.8 },
  { name: "Running (10 mph/16 km/h)", met: 14.5 },
  { name: "Jogging (general)", met: 7.0 },
  { name: "Jogging in place", met: 8.0 },

  // Walking
  { name: "Walking (2 mph/3.2 km/h, slow)", met: 2.8 },
  { name: "Walking (3 mph/4.8 km/h, moderate)", met: 3.5 },
  { name: "Walking (3.5 mph/5.6 km/h, brisk)", met: 4.3 },
  { name: "Walking (4 mph/6.4 km/h, very brisk)", met: 5.0 },
  { name: "Walking uphill (3.5 mph)", met: 6.0 },
  { name: "Walking stairs", met: 8.8 },
  { name: "Hiking", met: 6.0 },
  { name: "Hiking with backpack", met: 7.0 },

  // Cycling
  { name: "Cycling (leisurely, <10 mph)", met: 4.0 },
  { name: "Cycling (moderate, 12-14 mph)", met: 8.0 },
  { name: "Cycling (vigorous, 14-16 mph)", met: 10.0 },
  { name: "Cycling (very fast, 16-19 mph)", met: 12.0 },
  { name: "Cycling (racing, >20 mph)", met: 15.8 },
  { name: "Stationary bike (moderate)", met: 6.8 },
  { name: "Stationary bike (vigorous)", met: 8.8 },
  { name: "Mountain biking", met: 8.5 },

  // Swimming
  { name: "Swimming (leisurely)", met: 6.0 },
  { name: "Swimming (moderate pace)", met: 5.8 },
  { name: "Swimming (fast pace)", met: 9.8 },
  { name: "Swimming (butterfly)", met: 13.8 },
  { name: "Swimming (backstroke)", met: 7.2 },
  { name: "Swimming (breaststroke)", met: 10.3 },
  { name: "Swimming (freestyle, slow)", met: 7.0 },
  { name: "Swimming (freestyle, fast)", met: 10.0 },
  { name: "Water aerobics", met: 4.0 },

  // Gym & Fitness
  { name: "Weight lifting (general)", met: 3.0 },
  { name: "Weight lifting (vigorous)", met: 6.0 },
  { name: "Circuit training", met: 7.2 },
  { name: "CrossFit", met: 5.6 },
  { name: "HIIT (High Intensity Interval)", met: 8.0 },
  { name: "Elliptical trainer", met: 5.0 },
  { name: "Rowing machine (moderate)", met: 4.8 },
  { name: "Rowing machine (vigorous)", met: 8.5 },
  { name: "Stair climber", met: 9.0 },
  { name: "Treadmill (walking)", met: 4.3 },
  { name: "Treadmill (running)", met: 8.0 },

  // Group Fitness & Classes
  { name: "Aerobics (low impact)", met: 5.0 },
  { name: "Aerobics (high impact)", met: 7.3 },
  { name: "Step aerobics", met: 6.0 },
  { name: "Zumba", met: 6.5 },
  { name: "Spinning class", met: 7.2 },
  { name: "Kickboxing", met: 7.3 },
  { name: "Pilates", met: 3.7 },
  { name: "Yoga (Hatha)", met: 2.5 },
  { name: "Yoga (Vinyasa)", met: 3.0 },
  { name: "Yoga (Power)", met: 4.0 },

  // Sports
  { name: "Basketball (general)", met: 6.5 },
  { name: "Basketball (competitive)", met: 8.0 },
  { name: "Soccer/Football", met: 7.0 },
  { name: "Tennis (singles)", met: 8.0 },
  { name: "Tennis (doubles)", met: 6.0 },
  { name: "Volleyball (recreational)", met: 3.0 },
  { name: "Volleyball (competitive)", met: 4.0 },
  { name: "Baseball/Softball", met: 5.0 },
  { name: "Golf (walking with cart)", met: 3.5 },
  { name: "Golf (walking, carrying clubs)", met: 4.3 },
  { name: "Bowling", met: 3.0 },
  { name: "Table tennis", met: 4.0 },
  { name: "Badminton", met: 4.5 },

  // Combat Sports & Martial Arts
  { name: "Boxing (general)", met: 7.8 },
  { name: "Boxing (sparring)", met: 9.0 },
  { name: "Karate", met: 10.3 },
  { name: "Judo", met: 10.3 },
  { name: "Taekwondo", met: 10.3 },
  { name: "Wrestling", met: 6.0 },
  { name: "Fencing", met: 6.0 },

  // Dancing
  { name: "Dancing (general)", met: 4.8 },
  { name: "Dancing (ballroom)", met: 3.0 },
  { name: "Dancing (fast/disco)", met: 5.5 },
  { name: "Dancing (ballet)", met: 4.8 },

  // Outdoor Activities
  { name: "Rock climbing", met: 8.0 },
  { name: "Kayaking", met: 5.0 },
  { name: "Canoeing (leisurely)", met: 3.5 },
  { name: "Skiing (cross-country)", met: 7.0 },
  { name: "Skiing (downhill)", met: 4.3 },
  { name: "Snowboarding", met: 4.3 },
  { name: "Ice skating", met: 7.0 },
  { name: "Roller skating", met: 7.0 },
  { name: "Skateboarding", met: 5.0 },

  // Daily Activities
  { name: "House cleaning (general)", met: 3.0 },
  { name: "House cleaning (vigorous)", met: 3.8 },
  { name: "Vacuuming", met: 3.3 },
  { name: "Mopping floors", met: 3.5 },
  { name: "Washing dishes", met: 2.3 },
  { name: "Cooking", met: 2.5 },
  { name: "Gardening (general)", met: 4.0 },
  { name: "Mowing lawn (push mower)", met: 5.5 },
  { name: "Raking leaves", met: 4.3 },
  { name: "Shoveling snow", met: 6.0 },
  { name: "Playing with children", met: 4.0 },
  { name: "Walking dog", met: 3.0 },

  // Work Activities
  { name: "Office work (sitting)", met: 1.3 },
  { name: "Standing (light work)", met: 2.0 },
  { name: "Construction work", met: 5.5 },
  { name: "Carrying heavy loads", met: 8.0 },
  { name: "Farm work", met: 5.5 }
];

document.addEventListener('DOMContentLoaded', function () {
  const sel = document.getElementById('burn-activity');
  
  // Sort activities alphabetically for better user experience
  const sortedActivities = ACTIVITIES.sort((a, b) => a.name.localeCompare(b.name));
  
  sortedActivities.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.met;
    opt.textContent = a.name;
    sel.appendChild(opt);
  });

  const form = document.getElementById('calorie-burn-form');
  const result = document.getElementById('calorie-burn-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const weightInput = +form['burn-weight'].value;
    const weightUnit = form['burn-weight-unit'].value;
    const min = +form['burn-min'].value;
    const met = +form['burn-activity'].value;
    
    // Convert weight to kg if necessary
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;
    
    // Validation
    const maxWeight = weightUnit === 'lbs' ? 700 : 300;
    if (weightInput < 30 || weightInput > maxWeight) {
      result.innerHTML = `<p style="color:red;">Please enter a valid weight (30-${maxWeight} ${weightUnit}).</p>`;
      return;
    }
    if (min <= 0 || min > 1440) {
      result.innerHTML = '<p style="color:red;">Please enter a valid duration (1-1440 minutes).</p>';
      return;
    }
    if (met <= 0) {
      result.innerHTML = '<p style="color:red;">Please select an activity.</p>';
      return;
    }

    const hours = min / 60;
    const calories = met * weight * hours;
    
    // Get selected activity name for display
    const selectedActivity = sortedActivities.find(a => a.met == met);
    const activityName = selectedActivity ? selectedActivity.name : 'Selected activity';
    
    // Calculate calories per minute and per hour for additional context
    const caloriesPerMinute = calories / min;
    const caloriesPerHour = met * weight;

    result.innerHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Calories Burned Results</h3>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <p><strong>Activity:</strong> ${activityName}</p>
          <p><strong>Duration:</strong> ${min} minutes (${hours.toFixed(1)} hours)</p>
          <p><strong>Body Weight:</strong> ${weightInput} ${weightUnit} ${weightUnit === 'lbs' ? `(${weight.toFixed(1)} kg)` : ''}</p>
          <p><strong>MET Value:</strong> ${met}</p>
        </div>

        <div style="background:#e8f5e8;padding:15px;border-radius:6px;text-align:center;">
          <h4 style="margin:0;color:#388e3c;">Total Calories Burned</h4>
          <div style="font-size:2em;font-weight:bold;color:#2e7d32;margin:10px 0;">
            ${Math.round(calories).toLocaleString()} kcal
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;">Additional Information</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div>
              <strong>Calories per minute:</strong><br>
              <span style="color:#157aff;font-size:1.1em;">${caloriesPerMinute.toFixed(1)} kcal/min</span>
            </div>
            <div>
              <strong>Calories per hour:</strong><br>
              <span style="color:#157aff;font-size:1.1em;">${Math.round(caloriesPerHour).toLocaleString()} kcal/hr</span>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#856404;">Weight Loss Context</h4>
          <p style="margin:0;color:#856404;">
            To lose 1 pound of fat, you need to burn approximately 3,500 calories. 
            This activity session burned ${((calories/3500)*100).toFixed(1)}% of that amount.
          </p>
        </div>
      </div>
    `;
  });
});