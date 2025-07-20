document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('sleep-assessment-form');
  const result = document.getElementById('sleep-assessment-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const sleepHours = +form['sleep-hours'].value;
    const sleepMinutes = +(form['sleep-minutes'].value || 0);
    const sleepOnset = +form['sleep-onset'].value;
    const nightAwakenings = +form['night-awakenings'].value;
    const wakeFeeling = form['wake-feeling'].value;
    const sleepConsistency = form['sleep-consistency'].value;
    const napping = form.napping.value;
    const caffeine = form.caffeine.value;
    const alcohol = form.alcohol.value;
    const exercise = form.exercise.value;
    const screenTime = form['screen-time'].value;
    const stress = form.stress.value;

    // Validation
    if (!age || !gender || !sleepHours || sleepOnset === '' || nightAwakenings === '' || 
        !wakeFeeling || !sleepConsistency || !napping || !caffeine || !alcohol || 
        !exercise || !screenTime || !stress) {
      result.innerHTML = '<p style="color:red;">Please answer all questions to get an accurate assessment.</p>';
      return;
    }

    // Calculate total sleep time
    const totalSleepHours = sleepHours + (sleepMinutes / 60);

    // Age-based sleep recommendations
    let optimalSleepMin, optimalSleepMax;
    if (age >= 18 && age <= 25) {
      optimalSleepMin = 7; optimalSleepMax = 9;
    } else if (age >= 26 && age <= 64) {
      optimalSleepMin = 7; optimalSleepMax = 9;
    } else { // 65+
      optimalSleepMin = 7; optimalSleepMax = 8;
    }

    // Calculate sleep score components (0-100 scale)
    let sleepScore = 0;
    let scoreBreakdown = {};

    // 1. Sleep Duration Score (25 points)
    let durationScore = 0;
    if (totalSleepHours >= optimalSleepMin && totalSleepHours <= optimalSleepMax) {
      durationScore = 25;
    } else if (totalSleepHours >= optimalSleepMin - 0.5 && totalSleepHours <= optimalSleepMax + 0.5) {
      durationScore = 20;
    } else if (totalSleepHours >= optimalSleepMin - 1 && totalSleepHours <= optimalSleepMax + 1) {
      durationScore = 15;
    } else if (totalSleepHours >= 5 && totalSleepHours <= 11) {
      durationScore = 10;
    } else {
      durationScore = 5;
    }
    scoreBreakdown.duration = durationScore;

    // 2. Sleep Onset Score (15 points)
    let onsetScore = 0;
    if (sleepOnset <= 15) onsetScore = 15;
    else if (sleepOnset <= 30) onsetScore = 12;
    else if (sleepOnset <= 45) onsetScore = 8;
    else if (sleepOnset <= 60) onsetScore = 5;
    else onsetScore = 2;
    scoreBreakdown.onset = onsetScore;

    // 3. Night Awakenings Score (15 points)
    let awakeningsScore = 0;
    if (nightAwakenings === 0) awakeningsScore = 15;
    else if (nightAwakenings === 1) awakeningsScore = 12;
    else if (nightAwakenings === 3) awakeningsScore = 8;
    else awakeningsScore = 4;
    scoreBreakdown.awakenings = awakeningsScore;

    // 4. Wake Feeling Score (15 points)
    let wakeFeelingScore = 0;
    if (wakeFeeling === 'refreshed') wakeFeelingScore = 15;
    else if (wakeFeeling === 'okay') wakeFeelingScore = 12;
    else if (wakeFeeling === 'tired') wakeFeelingScore = 8;
    else wakeFeelingScore = 4;
    scoreBreakdown.wakeFeeling = wakeFeelingScore;

    // 5. Sleep Consistency Score (10 points)
    let consistencyScore = 0;
    if (sleepConsistency === 'very-consistent') consistencyScore = 10;
    else if (sleepConsistency === 'mostly-consistent') consistencyScore = 8;
    else if (sleepConsistency === 'somewhat-variable') consistencyScore = 5;
    else consistencyScore = 2;
    scoreBreakdown.consistency = consistencyScore;

    // 6. Lifestyle Factors Score (20 points total)
    let lifestyleScore = 0;

    // Napping (3 points)
    if (napping === 'never') lifestyleScore += 3;
    else if (napping === 'occasional') lifestyleScore += 2;
    else if (napping === 'regular') lifestyleScore += 1;

    // Caffeine (4 points)
    if (caffeine === 'none' || caffeine === 'morning') lifestyleScore += 4;
    else if (caffeine === 'afternoon') lifestyleScore += 2;
    else lifestyleScore += 1;

    // Alcohol (3 points)
    if (alcohol === 'never') lifestyleScore += 3;
    else if (alcohol === 'rarely') lifestyleScore += 2;
    else if (alcohol === 'weekly') lifestyleScore += 1;

    // Exercise (4 points)
    if (exercise === 'moderate') lifestyleScore += 4;
    else if (exercise === 'light' || exercise === 'intense') lifestyleScore += 3;
    else lifestyleScore += 1;

    // Screen time (3 points)
    if (screenTime === 'none') lifestyleScore += 3;
    else if (screenTime === 'minimal') lifestyleScore += 2;
    else if (screenTime === 'moderate') lifestyleScore += 1;

    // Stress (3 points)
    if (stress === 'low') lifestyleScore += 3;
    else if (stress === 'moderate') lifestyleScore += 2;
    else if (stress === 'high') lifestyleScore += 1;

    scoreBreakdown.lifestyle = lifestyleScore;

    // Calculate total score
    sleepScore = durationScore + onsetScore + awakeningsScore + wakeFeelingScore + consistencyScore + lifestyleScore;

    // Determine sleep quality category
    let qualityCategory, qualityColor, qualityDescription;
    if (sleepScore >= 90) {
      qualityCategory = 'Excellent';
      qualityColor = '#28a745';
      qualityDescription = 'Your sleep quality is excellent! You have optimal sleep habits and duration.';
    } else if (sleepScore >= 75) {
      qualityCategory = 'Good';
      qualityColor = '#6f9f6f';
      qualityDescription = 'You have good sleep quality with minor areas for improvement.';
    } else if (sleepScore >= 60) {
      qualityCategory = 'Fair';
      qualityColor = '#ffc107';
      qualityDescription = 'Your sleep quality is fair. Several improvements could enhance your rest.';
    } else if (sleepScore >= 40) {
      qualityCategory = 'Poor';
      qualityColor = '#fd7e14';
      qualityDescription = 'Your sleep quality is poor. Significant changes are needed for better health.';
    } else {
      qualityCategory = 'Very Poor';
      qualityColor = '#dc3545';
      qualityDescription = 'Your sleep quality is very poor. Consider consulting a healthcare professional.';
    }

    // Generate personalized recommendations
    let recommendations = [];
    
    if (durationScore < 20) {
      if (totalSleepHours < optimalSleepMin) {
        recommendations.push('⏰ Increase sleep duration: Aim for ' + optimalSleepMin + '-' + optimalSleepMax + ' hours per night');
      } else {
        recommendations.push('⏰ Reduce sleep duration: Too much sleep can be counterproductive');
      }
    }
    
    if (onsetScore < 12) {
      recommendations.push('😴 Improve sleep onset: Try relaxation techniques, limit screen time, keep bedroom cool');
    }
    
    if (awakeningsScore < 12) {
      recommendations.push('🌙 Reduce night awakenings: Avoid large meals/drinks before bed, optimize bedroom environment');
    }
    
    if (wakeFeelingScore < 12) {
      recommendations.push('☀️ Improve morning alertness: Ensure consistent wake time, get morning sunlight exposure');
    }
    
    if (consistencyScore < 8) {
      recommendations.push('📅 Maintain consistent schedule: Go to bed and wake up at the same time daily, even weekends');
    }
    
    if (caffeine === 'evening') {
      recommendations.push('☕ Limit evening caffeine: Avoid caffeine 6+ hours before bedtime');
    }
    
    if (alcohol === 'weekly' || alcohol === 'daily') {
      recommendations.push('🍷 Reduce evening alcohol: Alcohol disrupts sleep quality and REM sleep');
    }
    
    if (screenTime === 'moderate' || screenTime === 'heavy') {
      recommendations.push('📱 Reduce pre-sleep screen time: Blue light disrupts circadian rhythm');
    }
    
    if (exercise === 'none') {
      recommendations.push('🏃 Add regular exercise: Physical activity improves sleep quality (but not close to bedtime)');
    }
    
    if (stress === 'high' || stress === 'very-high') {
      recommendations.push('🧘 Manage stress: Try meditation, journaling, or relaxation techniques before bed');
    }

    if (napping === 'regular' || napping === 'daily') {
      recommendations.push('💤 Limit daytime naps: Long or late naps can interfere with nighttime sleep');
    }

    // Additional specific recommendations
    if (age >= 65 && nightAwakenings >= 3) {
      recommendations.push('👴 Age-related considerations: Night awakenings are more common with age - focus on sleep hygiene');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Sleep Quality Assessment</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:inline-block;background:${qualityColor};color:white;padding:15px 30px;border-radius:50px;font-size:1.5em;font-weight:bold;margin-bottom:15px;">
            ${sleepScore}/100
          </div>
          <h4 style="color:${qualityColor};margin:10px 0;">${qualityCategory} Sleep Quality</h4>
          <p style="color:#666;margin:0;">${qualityDescription}</p>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Sleep Profile Summary</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div><strong>Age:</strong> ${age} years</div>
            <div><strong>Sleep Duration:</strong> ${sleepHours}h ${sleepMinutes}m</div>
            <div><strong>Recommended:</strong> ${optimalSleepMin}-${optimalSleepMax} hours</div>
            <div><strong>Sleep Onset:</strong> ${sleepOnset} minutes</div>
            <div><strong>Night Awakenings:</strong> ${nightAwakenings === 0 ? 'Rarely' : nightAwakenings + (nightAwakenings === 1 ? ' time' : ' times')}</div>
            <div><strong>Wake Feeling:</strong> ${wakeFeeling.charAt(0).toUpperCase() + wakeFeeling.slice(1)}</div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Score Breakdown</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;">
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Sleep Duration:</span>
              <span style="font-weight:bold;">${scoreBreakdown.duration}/25</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Sleep Onset:</span>
              <span style="font-weight:bold;">${scoreBreakdown.onset}/15</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Night Continuity:</span>
              <span style="font-weight:bold;">${scoreBreakdown.awakenings}/15</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Morning Alertness:</span>
              <span style="font-weight:bold;">${scoreBreakdown.wakeFeeling}/15</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Sleep Consistency:</span>
              <span style="font-weight:bold;">${scoreBreakdown.consistency}/10</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Lifestyle Factors:</span>
              <span style="font-weight:bold;">${scoreBreakdown.lifestyle}/20</span>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Personalized Recommendations</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🌟 Quick Sleep Improvement Tips</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🛏️ Sleep Environment:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Keep bedroom cool (60-67°F/15-19°C)</li>
                <li>Make room as dark as possible</li>
                <li>Reduce noise or use white noise</li>
              </ul>
            </div>
            <div>
              <strong>⏰ Sleep Schedule:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Same bedtime and wake time daily</li>
                <li>No long weekend sleep-ins</li>
                <li>Limit naps to 20-30 minutes</li>
              </ul>
            </div>
            <div>
              <strong>🍽️ Evening Habits:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>No large meals 3 hours before bed</li>
                <li>Limit fluids 2 hours before sleep</li>
                <li>Avoid caffeine after 2 PM</li>
              </ul>
            </div>
            <div>
              <strong>📱 Pre-Sleep Routine:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>No screens 1 hour before bed</li>
                <li>Relaxing activities (reading, bath)</li>
                <li>Deep breathing or meditation</li>
              </ul>
            </div>
          </div>
        </div>

        ${sleepScore < 60 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Consider Professional Help If:</h4>
          <ul style="margin:0;color:#721c24;font-size:0.9em;">
            <li>Sleep problems persist despite good sleep hygiene</li>
            <li>Loud snoring with breathing pauses</li>
            <li>Excessive daytime sleepiness</li>
            <li>Restless legs or unusual movements during sleep</li>
            <li>Sleep problems affect work or relationships</li>
            <li>Chronic insomnia lasting more than 3 weeks</li>
          </ul>
        </div>
        ` : ''}
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});