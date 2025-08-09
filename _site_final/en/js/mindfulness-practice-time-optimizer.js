document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('mindfulness-optimizer-form');
  const result = document.getElementById('mindfulness-optimizer-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const lifeStage = form['life-stage'].value;
    const experienceLevel = form['experience-level'].value;
    const dailyTimeCommitment = +form['daily-time-commitment'].value;
    const scheduleConsistency = form['schedule-consistency'].value;
    const guidancePreference = form['guidance-preference'].value;
    const stressLevel = form['stress-level'].value;
    const energyPattern = form['energy-pattern'].value;
    const physicalLimitations = form['physical-limitations'].value;
    const technologyComfort = form['technology-comfort'].value;
    const motivationType = form['motivation-type'].value;

    // Get selected checkboxes
    const goals = Array.from(form.querySelectorAll('input[name="goals"]:checked')).map(input => input.value);
    const practiceTypes = Array.from(form.querySelectorAll('input[name="practice-types"]:checked')).map(input => input.value);
    const preferredTimes = Array.from(form.querySelectorAll('input[name="preferred-times"]:checked')).map(input => input.value);
    const practiceLocations = Array.from(form.querySelectorAll('input[name="practice-locations"]:checked')).map(input => input.value);

    // Validation
    if (!age || !lifeStage || !experienceLevel || !dailyTimeCommitment || !scheduleConsistency || 
        !guidancePreference || !stressLevel || !energyPattern || !physicalLimitations || 
        !technologyComfort || !motivationType || goals.length === 0 || practiceTypes.length === 0 || 
        preferredTimes.length === 0 || practiceLocations.length === 0) {
      result.innerHTML = '<p style="color:red;">Please answer all questions and select at least one option for each checkbox section to generate your personalized mindfulness practice plan.</p>';
      return;
    }

    // Calculate recommended session durations based on experience
    const sessionDurations = getSessionDurations(experienceLevel, dailyTimeCommitment, stressLevel);
    
    // Generate optimal practice schedule
    const practiceSchedule = generatePracticeSchedule(preferredTimes, dailyTimeCommitment, scheduleConsistency, energyPattern);
    
    // Create practice progression plan
    const progressionPlan = createProgressionPlan(experienceLevel, goals, dailyTimeCommitment);
    
    // Generate personalized practice recommendations
    const practiceRecommendations = generatePracticeRecommendations(practiceTypes, goals, physicalLimitations);
    
    // Create environment and setup suggestions
    const environmentSuggestions = getEnvironmentSuggestions(practiceLocations, physicalLimitations, technologyComfort);
    
    // Generate motivation and habit-building strategies
    const habitStrategies = getHabitBuildingStrategies(motivationType, experienceLevel, scheduleConsistency);
    
    // Create technology and resource recommendations
    const technologyRecommendations = getTechnologyRecommendations(technologyComfort, guidancePreference, goals);

    // Calculate practice intensity based on various factors
    let practiceIntensity = 'Gentle';
    let intensityColor = '#28a745';
    
    if ((stressLevel === 'high' || stressLevel === 'very-high') && dailyTimeCommitment >= 25) {
      practiceIntensity = 'Focused';
      intensityColor = '#ffc107';
    }
    
    if (experienceLevel === 'advanced' && dailyTimeCommitment >= 40) {
      practiceIntensity = 'Intensive';
      intensityColor = '#157aff';
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Personalized Mindfulness Practice Plan</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div>
              <div style="background:#157aff;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${dailyTimeCommitment} Min/Day
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Daily Commitment</p>
            </div>
            <div>
              <div style="background:${intensityColor};color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${practiceIntensity}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Practice Intensity</p>
            </div>
            <div>
              <div style="background:#6f9f6f;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${experienceLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Experience Level</p>
            </div>
          </div>
          <p style="color:#666;margin:0;">Customized for ${lifeStage.replace('-', ' ')} with focus on ${goals.slice(0,2).join(' and ')}</p>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">📅 Your Optimal Daily Practice Schedule</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${practiceSchedule.map(session => `
              <div style="border:1px solid #c3e6cb;border-radius:6px;padding:15px;background:white;">
                <h5 style="margin:0 0 10px 0;color:#155724;">${session.time}</h5>
                <p style="margin:5px 0;"><strong>Duration:</strong> ${session.duration} minutes</p>
                <p style="margin:5px 0;"><strong>Type:</strong> ${session.type}</p>
                <p style="margin:5px 0;"><strong>Focus:</strong> ${session.focus}</p>
                ${session.notes ? `<p style="margin:5px 0;font-size:0.9em;color:#666;"><em>${session.notes}</em></p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">🧘 Recommended Practice Types for You</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${practiceRecommendations.map(practice => `
              <div>
                <strong>${practice.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#157aff;">
                  ${practice.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
                <p style="margin:5px 0;font-size:0.9em;color:#666;"><strong>Suggested frequency:</strong> ${practice.frequency}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">📈 Your 12-Week Progression Plan</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${progressionPlan.map(phase => `
              <div>
                <strong>${phase.period}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                  ${phase.goals.map(goal => `<li>${goal}</li>`).join('')}
                </ul>
                <p style="margin:5px 0;font-size:0.9em;color:#666;"><strong>Duration:</strong> ${phase.duration}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">🌍 Environment & Setup Optimization</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${environmentSuggestions.map(suggestion => `
              <div>
                <strong>${suggestion.category}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                  ${suggestion.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💪 Habit Building & Motivation Strategies</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${habitStrategies.map(strategy => `
              <div>
                <strong>${strategy.category}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#0c5460;">
                  ${strategy.techniques.map(technique => `<li>${technique}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        ${technologyRecommendations.length > 0 ? `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">📱 Technology & Resource Recommendations</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${technologyRecommendations.map(tech => `
              <div>
                <strong>${tech.category}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#666;">
                  ${tech.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">📊 Progress Tracking & Milestones</h4>
          <div style="color:#155724;font-size:0.95em;">
            <p><strong>Weekly Check-ins (rate 1-10):</strong></p>
            <ul style="margin:5px 0;">
              <li>Consistency of practice (days practiced out of 7)</li>
              <li>Quality of attention during practice</li>
              <li>Stress levels throughout the day</li>
              <li>Overall mood and emotional balance</li>
              <li>Sleep quality and energy levels</li>
            </ul>
            <p><strong>Monthly Milestones:</strong></p>
            <ul style="margin:5px 0;">
              <li>Month 1: Establish consistent daily habit</li>
              <li>Month 2: Deepen practice quality and awareness</li>
              <li>Month 3: Integrate mindfulness into daily activities</li>
              <li>Month 4+: Explore advanced techniques and share practice</li>
            </ul>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚡ Quick Mindfulness Techniques for Busy Days</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🫁 1-Minute Breathing:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Focus on 10 conscious breaths</li>
                <li>Count: in-2-3-4, out-2-3-4</li>
                <li>Use during transitions</li>
              </ul>
            </div>
            <div>
              <strong>👁️ Mindful Moments:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Mindful eating first bite</li>
                <li>Mindful walking to next location</li>
                <li>Mindful listening in conversations</li>
              </ul>
            </div>
            <div>
              <strong>⏱️ 3-Minute Reset:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Body scan from head to toe</li>
                <li>Notice tensions and breathe into them</li>
                <li>Set intention for next activity</li>
              </ul>
            </div>
            <div>
              <strong>📱 Tech Reminders:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Hourly mindfulness bell</li>
                <li>Breathing app notifications</li>
                <li>Mindful phone unlocking</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">🔧 Troubleshooting Common Challenges</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>😴 "I fall asleep during practice":</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Practice with eyes slightly open</li>
                <li>Sit rather than lie down</li>
                <li>Choose more alert times of day</li>
                <li>Try walking meditation</li>
              </ul>
            </div>
            <div>
              <strong>🧠 "My mind is too busy":</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>This is normal - not a problem to solve</li>
                <li>Use noting technique ("thinking")</li>
                <li>Return gently to breath/focus</li>
                <li>Try shorter sessions initially</li>
              </ul>
            </div>
            <div>
              <strong>⏰ "I keep forgetting to practice":</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Link to existing habits</li>
                <li>Set phone reminders</li>
                <li>Place visual cues in environment</li>
                <li>Start with same time daily</li>
              </ul>
            </div>
            <div>
              <strong>😤 "I don't feel any benefits":</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Benefits often subtle at first</li>
                <li>Keep a practice journal</li>
                <li>Ask others if they notice changes</li>
                <li>Trust the process - effects accumulate</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">🎯 Your Personalized Success Formula</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <p><strong>Based on your profile, here's your path to sustainable practice:</strong></p>
            <ul style="margin:5px 0;">
              <li><strong>Start:</strong> ${getStartingAdvice(experienceLevel, dailyTimeCommitment)}</li>
              <li><strong>Timing:</strong> ${getTimingAdvice(preferredTimes, energyPattern)}</li>
              <li><strong>Location:</strong> ${getLocationAdvice(practiceLocations)}</li>
              <li><strong>Motivation:</strong> ${getMotivationAdvice(motivationType, goals)}</li>
              <li><strong>Progression:</strong> ${getProgressionAdvice(experienceLevel, stressLevel)}</li>
            </ul>
          </div>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">🌟 Remember: Your Practice is Unique</h4>
          <div style="color:#0c5460;font-size:0.95em;">
            <ul style="margin:5px 0;">
              <li><strong>Flexibility is key:</strong> Adapt recommendations to what works for you</li>
              <li><strong>Consistency over perfection:</strong> Better to practice 5 minutes daily than 60 minutes weekly</li>
              <li><strong>Be patient:</strong> Mindfulness benefits accumulate over time</li>
              <li><strong>Stay curious:</strong> Approach practice with beginner's mind</li>
              <li><strong>Seek community:</strong> Practice with others when possible</li>
              <li><strong>Professional guidance:</strong> Consider working with a qualified teacher</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function getSessionDurations(experienceLevel, dailyTime, stressLevel) {
    const baseDurations = {
      'complete-beginner': { main: 5, mini: 2 },
      'some-experience': { main: 8, mini: 3 },
      'occasional': { main: 12, mini: 5 },
      'regular-beginner': { main: 15, mini: 5 },
      'intermediate': { main: 25, mini: 10 },
      'advanced': { main: 40, mini: 15 }
    };
    
    let durations = baseDurations[experienceLevel];
    
    // Adjust based on available time and stress
    if (dailyTime >= 40) durations.main += 10;
    if (stressLevel === 'very-high') durations.mini += 3;
    
    return durations;
  }

  function generatePracticeSchedule(preferredTimes, dailyTime, consistency, energyPattern) {
    const schedule = [];
    
    // Determine primary session timing
    let primaryTime = 'Morning';
    if (preferredTimes.includes('early-morning') || preferredTimes.includes('morning')) {
      primaryTime = 'Morning (7-9 AM)';
    } else if (preferredTimes.includes('evening') || preferredTimes.includes('night')) {
      primaryTime = 'Evening (6-8 PM)';
    } else if (preferredTimes.includes('lunch')) {
      primaryTime = 'Midday (12-1 PM)';
    }
    
    // Primary session
    schedule.push({
      time: primaryTime,
      duration: Math.floor(dailyTime * 0.7),
      type: 'Formal meditation',
      focus: 'Main practice session',
      notes: energyPattern === 'morning-person' && primaryTime.includes('Morning') ? 
        'Perfect timing for your natural energy peak' : null
    });
    
    // Secondary sessions if time allows
    if (dailyTime >= 20) {
      schedule.push({
        time: 'Throughout day',
        duration: Math.floor(dailyTime * 0.3),
        type: 'Mindful moments',
        focus: 'Integration practice',
        notes: 'Break into 2-3 mini sessions'
      });
    }
    
    return schedule;
  }

  function createProgressionPlan(experienceLevel, goals, dailyTime) {
    const progression = [
      {
        period: 'Weeks 1-3: Foundation',
        duration: 'Current practice length',
        goals: [
          'Establish consistent daily habit',
          'Learn basic breath awareness',
          'Develop comfortable posture',
          'Create practice environment'
        ]
      },
      {
        period: 'Weeks 4-8: Development',
        duration: '+5 minutes to sessions',
        goals: [
          'Deepen concentration skills',
          'Add body scan practice',
          'Integrate mindful daily activities',
          'Track practice benefits'
        ]
      },
      {
        period: 'Weeks 9-12: Expansion',
        duration: '+5 more minutes if desired',
        goals: [
          'Explore different meditation types',
          'Handle difficult emotions mindfully',
          'Share practice with others',
          'Plan long-term practice goals'
        ]
      }
    ];
    
    // Adjust based on experience level
    if (experienceLevel === 'advanced') {
      progression[2].goals.push('Consider retreat participation');
      progression[2].goals.push('Develop teaching or mentoring skills');
    }
    
    return progression;
  }

  function generatePracticeRecommendations(practiceTypes, goals, physicalLimitations) {
    const recommendations = [];
    
    if (practiceTypes.includes('breathing')) {
      recommendations.push({
        name: 'Breath Awareness Meditation',
        benefits: ['Improves concentration', 'Reduces anxiety', 'Accessible anywhere'],
        frequency: 'Daily primary practice'
      });
    }
    
    if (practiceTypes.includes('body-scan')) {
      recommendations.push({
        name: 'Body Scan Practice',
        benefits: ['Releases physical tension', 'Increases body awareness', 'Promotes relaxation'],
        frequency: '3-4 times per week'
      });
    }
    
    if (practiceTypes.includes('walking') || physicalLimitations !== 'none') {
      recommendations.push({
        name: 'Walking Meditation',
        benefits: ['Combines movement with mindfulness', 'Good for restless minds', 'Energizing practice'],
        frequency: '2-3 times per week'
      });
    }
    
    if (practiceTypes.includes('loving-kindness') || goals.includes('emotional-regulation')) {
      recommendations.push({
        name: 'Loving-Kindness Meditation',
        benefits: ['Develops compassion', 'Improves relationships', 'Reduces self-criticism'],
        frequency: '1-2 times per week'
      });
    }
    
    return recommendations;
  }

  function getEnvironmentSuggestions(locations, physicalLimitations, technologyComfort) {
    const suggestions = [];
    
    if (locations.includes('home-quiet')) {
      suggestions.push({
        category: 'Home Practice Space',
        tips: [
          'Choose consistent location for practice',
          'Use cushion or chair for comfort',
          'Keep space clean and uncluttered',
          'Add plants or natural elements if possible'
        ]
      });
    }
    
    if (locations.includes('outdoor')) {
      suggestions.push({
        category: 'Outdoor Practice',
        tips: [
          'Find quiet natural settings when possible',
          'Practice early morning for peaceful environment',
          'Use weather-appropriate clothing',
          'Try walking meditation on nature paths'
        ]
      });
    }
    
    if (physicalLimitations !== 'none') {
      suggestions.push({
        category: 'Physical Comfort',
        tips: [
          'Use supportive chair instead of floor sitting',
          'Try lying down meditation if needed',
          'Use props (cushions, blankets) for support',
          'Consider walking or movement-based practices'
        ]
      });
    }
    
    return suggestions;
  }

  function getHabitBuildingStrategies(motivationType, experienceLevel, consistency) {
    const strategies = [
      {
        category: 'Habit Formation',
        techniques: [
          'Start with tiny habit (2-3 minutes)',
          'Link practice to existing routine',
          'Use visual reminders and cues',
          'Track practice streak with simple calendar'
        ]
      }
    ];
    
    if (motivationType === 'health-benefits') {
      strategies.push({
        category: 'Health-Focused Motivation',
        techniques: [
          'Track stress levels and sleep quality',
          'Note physical sensations of relaxation',
          'Journal about health improvements',
          'Celebrate reduced anxiety or tension'
        ]
      });
    }
    
    if (motivationType === 'performance') {
      strategies.push({
        category: 'Performance Enhancement',
        techniques: [
          'Practice before important tasks',
          'Time concentration improvements',
          'Note enhanced creativity or focus',
          'Use meditation as productivity tool'
        ]
      });
    }
    
    return strategies;
  }

  function getTechnologyRecommendations(comfort, guidance, goals) {
    if (comfort === 'prefer-analog') return [];
    
    const recommendations = [];
    
    if (comfort !== 'prefer-analog') {
      recommendations.push({
        category: 'Meditation Apps',
        recommendations: [
          'Headspace - Great for beginners',
          'Calm - Excellent sleep stories',
          'Insight Timer - Large free content library',
          'Ten Percent Happier - Practical approach'
        ]
      });
    }
    
    if (goals.includes('stress-reduction')) {
      recommendations.push({
        category: 'Stress Management Tools',
        recommendations: [
          'Heart rate variability monitors',
          'Breathing pattern apps',
          'Stress tracking wearables',
          'Biofeedback meditation devices'
        ]
      });
    }
    
    return recommendations;
  }

  function getStartingAdvice(experience, time) {
    if (experience === 'complete-beginner') {
      return `Begin with just 5 minutes daily focusing on breath awareness`;
    } else if (experience === 'advanced') {
      return `Maintain your ${time}-minute daily practice while exploring new techniques`;
    } else {
      return `Start with ${Math.min(10, time)} minutes and gradually increase`;
    }
  }

  function getTimingAdvice(times, energy) {
    if (times.includes('early-morning') && energy === 'morning-person') {
      return `Early morning practice aligns perfectly with your natural energy`;
    } else if (times.includes('evening') && energy === 'evening-person') {
      return `Evening practice suits your energy patterns and helps transition to rest`;
    } else {
      return `Practice when you feel most alert and can be consistent`;
    }
  }

  function getLocationAdvice(locations) {
    if (locations.includes('outdoor')) {
      return `Take advantage of nature settings - they enhance mindfulness naturally`;
    } else if (locations.includes('home-quiet')) {
      return `Create a dedicated space at home for consistent, distraction-free practice`;
    } else {
      return `Practice wherever you feel comfortable and can maintain focus`;
    }
  }

  function getMotivationAdvice(motivation, goals) {
    const motivationMap = {
      'health-benefits': 'Track how practice improves your physical and mental health',
      'performance': 'Notice enhanced focus and productivity from regular practice',
      'emotional-wellbeing': 'Pay attention to improved emotional balance and peace',
      'spiritual-growth': 'Focus on the deeper wisdom and connection meditation brings',
      'social-connection': 'Share your practice journey with others for mutual support',
      'personal-challenge': 'Set practice goals and celebrate achieving mindfulness milestones'
    };
    return motivationMap[motivation] || 'Focus on the benefits most important to you';
  }

  function getProgressionAdvice(experience, stress) {
    if (stress === 'very-high') {
      return `Increase practice duration slowly - consistency more important than length when stressed`;
    } else if (experience === 'complete-beginner') {
      return `Increase by 1-2 minutes every 2 weeks to build sustainable habits`;
    } else {
      return `Progress at your own pace, adding new techniques as you feel ready`;
    }
  }
});