document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('anxiety-plan-form');
  const result = document.getElementById('anxiety-plan-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const anxietyType = form['anxiety-type'].value;
    const anxietyFrequency = +form['anxiety-frequency'].value;
    const lifeInterference = +form['life-interference'].value;
    const timeAvailable = +form['time-available'].value;
    const livingSituation = form['living-situation'].value;
    const managementPreference = form['management-preference'].value;
    const sleepImpact = form['sleep-impact'].value;
    const currentTreatment = form['current-treatment'].value;
    const primaryGoal = form['primary-goal'].value;

    // Get selected symptoms
    const symptoms = Array.from(form.querySelectorAll('input[name="symptoms"]:checked')).map(input => input.value);
    const triggers = Array.from(form.querySelectorAll('input[name="triggers"]:checked')).map(input => input.value);
    const triedTechniques = Array.from(form.querySelectorAll('input[name="tried-techniques"]:checked')).map(input => input.value);
    const calmingActivities = Array.from(form.querySelectorAll('input[name="calming-activities"]:checked')).map(input => input.value);

    // Validation
    if (!age || !gender || !anxietyType || !anxietyFrequency || !lifeInterference || 
        !timeAvailable || !livingSituation || !managementPreference || !sleepImpact || 
        !currentTreatment || !primaryGoal) {
      result.innerHTML = '<p style="color:red;">Please answer all questions to generate your personalized anxiety management plan.</p>';
      return;
    }

    // Calculate anxiety severity score
    const anxietySeverity = anxietyFrequency + lifeInterference;
    let severityLevel, severityColor;
    
    if (anxietySeverity <= 4) {
      severityLevel = 'Mild';
      severityColor = '#28a745';
    } else if (anxietySeverity <= 6) {
      severityLevel = 'Moderate';
      severityColor = '#ffc107';
    } else if (anxietySeverity <= 8) {
      severityLevel = 'High';
      severityColor = '#fd7e14';
    } else {
      severityLevel = 'Severe';
      severityColor = '#dc3545';
    }

    // Generate personalized strategies based on anxiety type
    const typeSpecificStrategies = getTypeSpecificStrategies(anxietyType);
    
    // Generate trigger-specific strategies
    const triggerStrategies = getTriggerSpecificStrategies(triggers);
    
    // Generate immediate relief techniques based on symptoms
    const immediateReliefTechniques = getImmediateReliefTechniques(symptoms);
    
    // Generate daily management plan based on time available
    const dailyPlan = getDailyManagementPlan(timeAvailable, calmingActivities);
    
    // Generate emergency action plan
    const emergencyPlan = getEmergencyActionPlan(anxietyType, symptoms);
    
    // Generate lifestyle recommendations
    const lifestyleRecommendations = getLifestyleRecommendations(sleepImpact, age, currentTreatment);
    
    // Generate progress tracking plan
    const progressTracking = getProgressTrackingPlan(primaryGoal, anxietyFrequency);

    // Professional help recommendations
    let professionalHelp = [];
    if (severityLevel === 'Severe' || currentTreatment === 'none') {
      professionalHelp.push('Consider consulting with a mental health professional for comprehensive anxiety treatment');
    }
    if (anxietyType === 'panic' && !triedTechniques.includes('therapy')) {
      professionalHelp.push('Cognitive Behavioral Therapy (CBT) is highly effective for panic disorder');
    }
    if (anxietyType === 'social' && lifeInterference >= 4) {
      professionalHelp.push('Social anxiety therapy or group therapy can provide targeted support');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Personalized Anxiety Management Plan</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div>
              <div style="background:${severityColor};color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${severityLevel} Anxiety
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Current Level</p>
            </div>
            <div>
              <div style="background:#157aff;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${anxietyType.charAt(0).toUpperCase() + anxietyType.slice(1)} Type
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Primary Focus</p>
            </div>
            <div>
              <div style="background:#6f9f6f;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${timeAvailable} Min/Day
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Available Time</p>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #ffc107;">
          <h4 style="margin-top:0;color:#856404;">🎯 Your Primary Goal: ${getGoalDescription(primaryGoal)}</h4>
          <p style="color:#856404;margin:5px 0;">This plan is specifically designed to help you ${getGoalAction(primaryGoal)}.</p>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">⚡ Immediate Relief Techniques (Use When Anxiety Strikes)</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${immediateReliefTechniques.map(technique => `
              <div>
                <strong>${technique.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#0c5460;">
                  ${technique.steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">📅 Your Daily Anxiety Management Routine</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${dailyPlan.map(period => `
              <div>
                <strong>${period.time}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#157aff;">
                  ${period.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🧠 ${anxietyType.charAt(0).toUpperCase() + anxietyType.slice(1)} Anxiety Specific Strategies</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${typeSpecificStrategies.map(strategy => `
              <div>
                <strong>${strategy.category}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                  ${strategy.techniques.map(technique => `<li>${technique}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        ${triggers.length > 0 ? `
        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">🎯 Trigger-Specific Management Strategies</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${triggerStrategies.map(trigger => `
              <div>
                <strong>${trigger.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                  ${trigger.strategies.map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#721c24;">🆘 Emergency Action Plan for Severe Anxiety/Panic</h4>
          <div style="color:#721c24;">
            <p><strong>When anxiety becomes overwhelming, follow these steps:</strong></p>
            <ol style="margin:5px 0;">
              ${emergencyPlan.map(step => `<li>${step}</li>`).join('')}
            </ol>
            <p style="font-weight:bold;margin-top:10px;">
              If symptoms persist or worsen, contact: Emergency services (911), Crisis hotline (988), 
              or your healthcare provider immediately.
            </p>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">🌱 Lifestyle Optimization for Anxiety Management</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${lifestyleRecommendations.map(category => `
              <div>
                <strong>${category.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#666;">
                  ${category.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">📊 Progress Tracking & Adjustment Plan</h4>
          <div style="color:#856404;">
            <p><strong>Week 1-2: Foundation Building</strong></p>
            <ul style="margin:5px 0;font-size:0.9em;">
              ${progressTracking.weeks1_2.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p><strong>Week 3-4: Skill Development</strong></p>
            <ul style="margin:5px 0;font-size:0.9em;">
              ${progressTracking.weeks3_4.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p><strong>Month 2+: Integration & Mastery</strong></p>
            <ul style="margin:5px 0;font-size:0.9em;">
              ${progressTracking.month2_plus.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        ${professionalHelp.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">👨‍⚕️ Professional Support Recommendations</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${professionalHelp.map(help => `<li>${help}</li>`).join('')}
          </ul>
          <p style="color:#0c5460;font-size:0.9em;margin:10px 0;">
            <strong>Types of Professional Help:</strong> Cognitive Behavioral Therapy (CBT), 
            Exposure and Response Prevention (ERP), Acceptance and Commitment Therapy (ACT), 
            Medication consultation with psychiatrist or primary care physician.
          </p>
        </div>
        ` : ''}

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">📱 Helpful Tools & Resources</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>📱 Recommended Apps:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Headspace (meditation & mindfulness)</li>
                <li>Calm (sleep stories & relaxation)</li>
                <li>DARE (anxiety management)</li>
                <li>MindShift (CBT-based tools)</li>
              </ul>
            </div>
            <div>
              <strong>📚 Educational Resources:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Anxiety and Depression Association</li>
                <li>National Institute of Mental Health</li>
                <li>Psychology Today anxiety articles</li>
                <li>Local support groups</li>
              </ul>
            </div>
            <div>
              <strong>🆘 Crisis Resources:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Crisis Text Line: Text HOME to 741741</li>
                <li>National Suicide Prevention Lifeline: 988</li>
                <li>Emergency Services: 911</li>
                <li>SAMHSA Helpline: 1-800-662-HELP</li>
              </ul>
            </div>
            <div>
              <strong>💊 Medication Information:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Discuss options with healthcare provider</li>
                <li>SSRIs, SNRIs for long-term management</li>
                <li>Benzodiazepines for acute situations</li>
                <li>Natural supplements (with medical approval)</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">✅ Weekly Check-in Questions</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <p><strong>Rate yourself weekly (1-10 scale):</strong></p>
            <ul style="margin:5px 0;">
              <li>How effectively did I use my anxiety management techniques?</li>
              <li>How much did anxiety interfere with my daily activities?</li>
              <li>How confident do I feel in managing my anxiety?</li>
              <li>What technique worked best for me this week?</li>
              <li>What situation challenged me most, and how did I handle it?</li>
            </ul>
            <p><strong>Adjust your plan based on what's working best for you.</strong></p>
          </div>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🎉 Remember: Recovery is a Journey</h4>
          <div style="color:#155724;font-size:0.95em;">
            <ul style="margin:5px 0;">
              <li><strong>Progress isn't linear:</strong> Expect ups and downs - this is normal</li>
              <li><strong>Small steps count:</strong> Every technique you try is progress</li>
              <li><strong>Be patient:</strong> Anxiety management skills take time to develop</li>
              <li><strong>Celebrate victories:</strong> Acknowledge when you successfully manage anxiety</li>
              <li><strong>Stay flexible:</strong> Adjust techniques based on what works for you</li>
              <li><strong>Seek support:</strong> You don't have to do this alone</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function getTypeSpecificStrategies(anxietyType) {
    const strategies = {
      generalized: [
        {
          category: 'Worry Management',
          techniques: [
            'Set aside 15 minutes daily for "worry time"',
            'Practice the "worst case scenario" exercise',
            'Use thought challenging worksheets',
            'Create action plans for controllable worries'
          ]
        },
        {
          category: 'Present Moment Focus',
          techniques: [
            'Practice mindfulness meditation daily',
            'Use grounding techniques when worry spirals',
            'Engage in absorbing activities',
            'Focus on what you can control today'
          ]
        }
      ],
      social: [
        {
          category: 'Gradual Exposure',
          techniques: [
            'Start with low-stakes social situations',
            'Practice self-compassion for social mistakes',
            'Prepare conversation topics in advance',
            'Challenge negative thoughts about judgment'
          ]
        },
        {
          category: 'Confidence Building',
          techniques: [
            'Practice assertiveness skills',
            'Focus on connection rather than performance',
            'Use positive self-talk before social events',
            'Celebrate small social successes'
          ]
        }
      ],
      panic: [
        {
          category: 'Panic Prevention',
          techniques: [
            'Monitor early warning signs',
            'Practice controlled breathing regularly',
            'Avoid caffeine and stimulants',
            'Maintain regular sleep schedule'
          ]
        },
        {
          category: 'In-the-Moment Techniques',
          techniques: [
            'Use the STOP technique',
            'Practice box breathing (4-4-4-4)',
            'Remind yourself "This will pass"',
            'Stay in the current location if safe'
          ]
        }
      ],
      performance: [
        {
          category: 'Preparation Strategies',
          techniques: [
            'Practice relaxation before performances',
            'Use visualization of successful outcomes',
            'Prepare thoroughly but avoid over-preparation',
            'Focus on effort rather than perfect results'
          ]
        },
        {
          category: 'Mindset Shifts',
          techniques: [
            'Reframe nerves as excitement',
            'Focus on your message, not the audience',
            'Accept that some nervousness is normal',
            'Learn from each performance experience'
          ]
        }
      ]
    };

    return strategies[anxietyType] || strategies.generalized;
  }

  function getTriggerSpecificStrategies(triggers) {
    const triggerStrategies = {
      'work-school': {
        name: 'Work/School Stress',
        strategies: [
          'Break large tasks into smaller, manageable steps',
          'Use time management techniques like the Pomodoro method',
          'Practice saying no to non-essential commitments',
          'Create boundaries between work and personal time'
        ]
      },
      'social': {
        name: 'Social Situations',
        strategies: [
          'Practice social skills in low-pressure situations',
          'Prepare conversation topics beforehand',
          'Focus on being interested rather than interesting',
          'Remember that most people are focused on themselves'
        ]
      },
      'health': {
        name: 'Health Concerns',
        strategies: [
          'Limit health-related internet searches',
          'Schedule regular check-ups to address concerns',
          'Practice body scan meditation to reduce health anxiety',
          'Challenge catastrophic thinking about symptoms'
        ]
      },
      'financial': {
        name: 'Financial Worries',
        strategies: [
          'Create a realistic budget and stick to it',
          'Focus on what you can control about your finances',
          'Seek financial counseling if needed',
          'Practice gratitude for what you have'
        ]
      },
      'uncertainty': {
        name: 'Uncertainty & Change',
        strategies: [
          'Practice accepting uncertainty as part of life',
          'Focus on your responses rather than outcomes',
          'Develop flexibility and adaptability skills',
          'Create contingency plans when possible'
        ]
      }
    };

    return triggers.map(trigger => triggerStrategies[trigger]).filter(Boolean);
  }

  function getImmediateReliefTechniques(symptoms) {
    const techniques = [
      {
        name: '4-7-8 Breathing',
        steps: [
          'Inhale through nose for 4 counts',
          'Hold breath for 7 counts',
          'Exhale through mouth for 8 counts',
          'Repeat 3-4 times'
        ]
      },
      {
        name: '5-4-3-2-1 Grounding',
        steps: [
          'Name 5 things you can see',
          'Name 4 things you can touch',
          'Name 3 things you can hear',
          'Name 2 things you can smell',
          'Name 1 thing you can taste'
        ]
      }
    ];

    // Add symptom-specific techniques
    if (symptoms.includes('heart-racing') || symptoms.includes('shortness-breath')) {
      techniques.push({
        name: 'Chest Pressure Relief',
        steps: [
          'Place one hand on chest, one on belly',
          'Breathe slowly into your belly',
          'Feel the lower hand move more than upper',
          'Count breaths: in for 4, out for 6'
        ]
      });
    }

    if (symptoms.includes('muscle-tension') || symptoms.includes('trembling')) {
      techniques.push({
        name: 'Progressive Muscle Relaxation',
        steps: [
          'Tense shoulders for 5 seconds, then release',
          'Tense arms and hands, then release',
          'Tense face and jaw, then release',
          'Notice the difference between tense and relaxed'
        ]
      });
    }

    return techniques;
  }

  function getDailyManagementPlan(timeAvailable, calmingActivities) {
    const plans = {
      5: [
        {
          time: 'Morning (2 min)',
          activities: ['3 deep breaths', 'Set one positive intention for the day']
        },
        {
          time: 'Midday (2 min)',
          activities: ['Brief body scan', 'Check in with your emotions']
        },
        {
          time: 'Evening (1 min)',
          activities: ['Gratitude practice', 'Quick relaxation technique']
        }
      ],
      15: [
        {
          time: 'Morning (5 min)',
          activities: ['Breathing exercise', 'Mindful morning routine', 'Positive affirmations']
        },
        {
          time: 'Midday (5 min)',
          activities: ['Stress check-in', 'Brief walk or stretch', 'Calming activity']
        },
        {
          time: 'Evening (5 min)',
          activities: ['Reflection journaling', 'Relaxation technique', 'Tomorrow preparation']
        }
      ],
      30: [
        {
          time: 'Morning (10 min)',
          activities: ['Meditation or mindfulness', 'Exercise or movement', 'Day planning']
        },
        {
          time: 'Midday (10 min)',
          activities: ['Stress management break', 'Social connection', 'Enjoyable activity']
        },
        {
          time: 'Evening (10 min)',
          activities: ['Detailed journaling', 'Progressive relaxation', 'Tomorrow visualization']
        }
      ],
      60: [
        {
          time: 'Morning (20 min)',
          activities: ['Extended meditation', 'Physical exercise', 'Mindful breakfast', 'Goal setting']
        },
        {
          time: 'Midday (20 min)',
          activities: ['Stress relief activity', 'Social interaction', 'Creative pursuit', 'Nature time']
        },
        {
          time: 'Evening (20 min)',
          activities: ['Comprehensive journaling', 'Full relaxation routine', 'Reading or learning', 'Sleep preparation']
        }
      ]
    };

    return plans[timeAvailable] || plans[15];
  }

  function getEmergencyActionPlan(anxietyType, symptoms) {
    const basePlan = [
      'Find a safe, comfortable place to sit or lie down',
      'Focus on slow, deep breathing - in for 4, out for 6',
      'Use grounding technique: 5-4-3-2-1 or hold a cold object',
      'Remind yourself: "This is anxiety, it will pass, I am safe"',
      'Call someone supportive or use a calming app if needed'
    ];

    if (anxietyType === 'panic') {
      basePlan.splice(3, 0, 'Stay where you are - avoid leaving the situation if possible');
      basePlan.push('If symptoms persist >20 minutes, consider medical evaluation');
    }

    if (symptoms.includes('chest-pain') || symptoms.includes('heart-racing')) {
      basePlan.push('If chest pain is severe or different from usual anxiety, seek medical help');
    }

    return basePlan;
  }

  function getLifestyleRecommendations(sleepImpact, age, currentTreatment) {
    const recommendations = [
      {
        name: 'Sleep Optimization',
        recommendations: sleepImpact !== 'none' ? [
          'Maintain consistent sleep and wake times',
          'Create anxiety-free bedroom environment',
          'Avoid screens 1 hour before bed',
          'Use relaxation techniques before sleep'
        ] : [
          'Continue good sleep habits',
          'Use sleep time for relaxation practice'
        ]
      },
      {
        name: 'Physical Wellness',
        recommendations: [
          'Regular aerobic exercise (30 min, 3-5x/week)',
          'Limit caffeine, especially after 2 PM',
          'Stay hydrated throughout the day',
          'Consider yoga or tai chi for mind-body connection'
        ]
      },
      {
        name: 'Nutrition for Anxiety',
        recommendations: [
          'Eat regular, balanced meals to stabilize blood sugar',
          'Include omega-3 rich foods (fish, walnuts)',
          'Limit alcohol as it can worsen anxiety',
          'Consider magnesium-rich foods (leafy greens, nuts)'
        ]
      }
    ];

    if (currentTreatment === 'none') {
      recommendations.push({
        name: 'Professional Support',
        recommendations: [
          'Consider therapy (CBT is highly effective for anxiety)',
          'Discuss anxiety with your primary care doctor',
          'Look into local support groups',
          'Consider online therapy options if access is limited'
        ]
      });
    }

    return recommendations;
  }

  function getProgressTrackingPlan(primaryGoal, anxietyFrequency) {
    return {
      weeks1_2: [
        'Practice chosen techniques daily, even when not anxious',
        'Track anxiety episodes and triggers in a journal',
        'Rate anxiety levels daily (1-10 scale)',
        'Notice which techniques work best for you'
      ],
      weeks3_4: [
        'Gradually expose yourself to mild anxiety triggers',
        'Combine multiple techniques for stronger effect',
        'Track improvements in specific anxiety situations',
        'Adjust plan based on what\'s working'
      ],
      month2_plus: [
        'Focus on maintaining gains and preventing relapse',
        'Handle more challenging anxiety-provoking situations',
        'Help others with anxiety using your learned skills',
        'Continue professional treatment if recommended'
      ]
    };
  }

  function getGoalDescription(goal) {
    const descriptions = {
      'reduce-frequency': 'Reduce How Often Anxiety Occurs',
      'manage-symptoms': 'Better Manage Physical Anxiety Symptoms',
      'function-better': 'Improve Daily Life Functioning',
      'face-fears': 'Face Avoided Situations with Confidence',
      'prevent-panic': 'Prevent and Manage Panic Episodes',
      'overall-wellness': 'Improve Overall Mental Wellness'
    };
    return descriptions[goal] || 'Improve Anxiety Management';
  }

  function getGoalAction(goal) {
    const actions = {
      'reduce-frequency': 'experience fewer anxiety episodes through prevention strategies',
      'manage-symptoms': 'cope better with physical anxiety symptoms when they occur',
      'function-better': 'maintain your daily activities and responsibilities despite anxiety',
      'face-fears': 'gradually approach and master situations you\'ve been avoiding',
      'prevent-panic': 'recognize early signs and use techniques to prevent panic escalation',
      'overall-wellness': 'develop comprehensive anxiety management for long-term wellbeing'
    };
    return actions[goal] || 'manage your anxiety more effectively';
  }
});