document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('depression-tracker-form');
  const result = document.getElementById('depression-tracker-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const timePeriod = form['time-period'].value;
    const depressedMood = +form['depressed-mood'].value;
    const anhedonia = +form.anhedonia.value;
    const selfWorth = +form['self-worth'].value;
    const guilt = +form.guilt.value;
    const fatigue = +form.fatigue.value;
    const sleepProblems = +form['sleep-problems'].value;
    const appetiteChanges = +form['appetite-changes'].value;
    const concentration = +form.concentration.value;
    const decisionMaking = +form['decision-making'].value;
    const negativeThoughts = +form['negative-thoughts'].value;
    const socialWithdrawal = +form['social-withdrawal'].value;
    const psychomotorChanges = +form['psychomotor-changes'].value;
    const selfCare = +form['self-care'].value;
    const suicidalThoughts = +form['suicidal-thoughts'].value;
    const functionalImpairment = +form['functional-impairment'].value;
    const currentTreatment = form['current-treatment'].value;
    const symptomDuration = form['symptom-duration'].value;

    // Get selected stressors
    const stressors = Array.from(form.querySelectorAll('input[name="stressors"]:checked')).map(input => input.value);

    // Validation
    if (!age || !gender || !timePeriod || depressedMood === '' || anhedonia === '' || 
        selfWorth === '' || guilt === '' || fatigue === '' || sleepProblems === '' || 
        appetiteChanges === '' || concentration === '' || decisionMaking === '' || 
        negativeThoughts === '' || socialWithdrawal === '' || psychomotorChanges === '' || 
        selfCare === '' || suicidalThoughts === '' || functionalImpairment === '' || 
        !currentTreatment || !symptomDuration) {
      result.innerHTML = '<p style="color:red;">Please answer all questions to get an accurate depression assessment.</p>';
      return;
    }

    // Calculate PHQ-9 style score (core 9 symptoms)
    const coreSymptoms = depressedMood + anhedonia + sleepProblems + fatigue + 
                        appetiteChanges + selfWorth + concentration + psychomotorChanges + 
                        suicidalThoughts;

    // Calculate additional symptom severity
    const additionalSymptoms = guilt + negativeThoughts + socialWithdrawal + selfCare + 
                              decisionMaking + functionalImpairment;

    // Total depression score (0-54 scale)
    const totalScore = coreSymptoms + additionalSymptoms;

    // Determine depression severity based on PHQ-9 guidelines
    let severityLevel, severityColor, severityDescription, urgencyLevel;
    
    if (coreSymptoms <= 4) {
      severityLevel = 'Minimal';
      severityColor = '#28a745';
      severityDescription = 'Minimal depression symptoms. Continue monitoring your mental health.';
      urgencyLevel = 'Self-care and monitoring';
    } else if (coreSymptoms <= 9) {
      severityLevel = 'Mild';
      severityColor = '#6f9f6f';
      severityDescription = 'Mild depression symptoms that may benefit from self-care strategies.';
      urgencyLevel = 'Self-help with professional consultation';
    } else if (coreSymptoms <= 14) {
      severityLevel = 'Moderate';
      severityColor = '#ffc107';
      severityDescription = 'Moderate depression symptoms affecting daily functioning.';
      urgencyLevel = 'Professional treatment recommended';
    } else if (coreSymptoms <= 19) {
      severityLevel = 'Moderately Severe';
      severityColor = '#fd7e14';
      severityDescription = 'Moderately severe depression requiring professional treatment.';
      urgencyLevel = 'Professional treatment needed';
    } else {
      severityLevel = 'Severe';
      severityColor = '#dc3545';
      severityDescription = 'Severe depression requiring immediate professional attention.';
      urgencyLevel = 'Immediate professional help required';
    }

    // Check for critical warning signs
    let warningFlags = [];
    let immediateHelp = false;

    if (suicidalThoughts >= 1) {
      warningFlags.push('Suicidal thoughts detected');
      immediateHelp = true;
    }
    
    if (functionalImpairment >= 2) {
      warningFlags.push('Significant functional impairment');
    }
    
    if (coreSymptoms >= 15 && currentTreatment === 'none') {
      warningFlags.push('Severe symptoms without professional treatment');
    }
    
    if (selfCare >= 2) {
      warningFlags.push('Significant self-care neglect');
    }

    // Generate symptom analysis
    const symptomAnalysis = {
      emotional: Math.round(((depressedMood + anhedonia + selfWorth + guilt) / 12) * 100),
      physical: Math.round(((fatigue + sleepProblems + appetiteChanges) / 9) * 100),
      cognitive: Math.round(((concentration + decisionMaking + negativeThoughts) / 9) * 100),
      behavioral: Math.round(((socialWithdrawal + psychomotorChanges + selfCare) / 9) * 100)
    };

    // Generate personalized recommendations
    let recommendations = [];
    
    if (symptomAnalysis.emotional > 60) {
      recommendations.push('🧘 Practice emotional regulation techniques: mindfulness, journaling, therapy');
    }
    
    if (symptomAnalysis.physical > 60) {
      recommendations.push('💪 Address physical symptoms: regular exercise, sleep hygiene, nutrition');
    }
    
    if (symptomAnalysis.cognitive > 60) {
      recommendations.push('🧠 Support cognitive function: cognitive behavioral therapy, brain exercises');
    }
    
    if (symptomAnalysis.behavioral > 60) {
      recommendations.push('👥 Increase behavioral activation: social activities, daily routines, pleasant events');
    }
    
    if (currentTreatment === 'none' && coreSymptoms >= 10) {
      recommendations.push('👨‍⚕️ Strongly consider professional mental health treatment');
    }
    
    if (stressors.length > 0 && !stressors.includes('none')) {
      recommendations.push('🛡️ Develop healthy coping strategies for recent life stressors');
    }

    // Duration-specific insights
    let durationInsight = '';
    switch(symptomDuration) {
      case 'weeks':
        durationInsight = 'Recent onset symptoms may be related to specific stressors or life changes.';
        break;
      case 'months':
        durationInsight = 'Symptoms persisting for months suggest clinical depression that would benefit from treatment.';
        break;
      case '6-months':
      case 'years':
        durationInsight = 'Long-term symptoms indicate chronic depression requiring comprehensive treatment approach.';
        break;
      case 'episodic':
        durationInsight = 'Episodic pattern may suggest recurrent depression or bipolar disorder - professional evaluation recommended.';
        break;
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Depression Symptom Assessment</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div>
              <div style="background:${severityColor};color:white;padding:15px 25px;border-radius:50px;font-size:1.3em;font-weight:bold;">
                ${coreSymptoms}/27
              </div>
              <h4 style="color:${severityColor};margin:10px 0;">${severityLevel} Depression</h4>
            </div>
            <div>
              <div style="background:#157aff;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${timePeriod.replace('-', ' ').replace('past ', '')}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Assessment Period</p>
            </div>
            <div>
              <div style="background:#6f9f6f;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${symptomDuration.replace('-', ' ')}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Duration</p>
            </div>
          </div>
          <p style="color:#666;margin:0;">${severityDescription}</p>
          <p style="color:#666;margin:10px 0;"><strong>Recommended Action:</strong> ${urgencyLevel}</p>
        </div>

        ${warningFlags.length > 0 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #dc3545;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Important Concerns Detected</h4>
          <ul style="margin:5px 0;color:#721c24;">
            ${warningFlags.map(flag => `<li>${flag}</li>`).join('')}
          </ul>
          ${immediateHelp ? `
          <p style="color:#721c24;font-weight:bold;margin:10px 0;">
            If you are having thoughts of self-harm, please seek immediate help:
            <br>• National Suicide Prevention Lifeline: 988
            <br>• Crisis Text Line: Text HOME to 741741
            <br>• Emergency Services: 911
          </p>
          ` : ''}
        </div>
        ` : ''}

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Symptom Domain Analysis</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Emotional Symptoms:</span>
              <span style="font-weight:bold;color:${symptomAnalysis.emotional >= 70 ? '#dc3545' : symptomAnalysis.emotional >= 50 ? '#ffc107' : '#28a745'};">${symptomAnalysis.emotional}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Physical Symptoms:</span>
              <span style="font-weight:bold;color:${symptomAnalysis.physical >= 70 ? '#dc3545' : symptomAnalysis.physical >= 50 ? '#ffc107' : '#28a745'};">${symptomAnalysis.physical}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Cognitive Symptoms:</span>
              <span style="font-weight:bold;color:${symptomAnalysis.cognitive >= 70 ? '#dc3545' : symptomAnalysis.cognitive >= 50 ? '#ffc107' : '#28a745'};">${symptomAnalysis.cognitive}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Behavioral Symptoms:</span>
              <span style="font-weight:bold;color:${symptomAnalysis.behavioral >= 70 ? '#dc3545' : symptomAnalysis.behavioral >= 50 ? '#ffc107' : '#28a745'};">${symptomAnalysis.behavioral}%</span>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Duration & Context Analysis</h4>
          <p style="color:#666;margin:10px 0;"><strong>Symptom Duration:</strong> ${durationInsight}</p>
          ${stressors.length > 0 && !stressors.includes('none') ? `
          <p style="color:#666;margin:10px 0;"><strong>Recent Stressors:</strong> You've indicated recent life stressors which may contribute to depression symptoms. Addressing these stressors alongside depression treatment is important.</p>
          ` : ''}
          <p style="color:#666;margin:10px 0;"><strong>Current Treatment:</strong> ${getTreatmentDescription(currentTreatment)}</p>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Personalized Depression Management Recommendations</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🌱 Daily Depression Management Strategies</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🌅 Morning Routine:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Consistent wake time</li>
                <li>Morning light exposure</li>
                <li>Gentle movement or stretching</li>
                <li>Positive intention setting</li>
              </ul>
            </div>
            <div>
              <strong>💪 Physical Wellness:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Regular exercise (even 10-15 minutes)</li>
                <li>Nutritious meals at regular times</li>
                <li>Adequate hydration</li>
                <li>Fresh air and nature exposure</li>
              </ul>
            </div>
            <div>
              <strong>👥 Social Connection:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Daily contact with supportive people</li>
                <li>Participate in one social activity</li>
                <li>Avoid complete isolation</li>
                <li>Share feelings with trusted person</li>
              </ul>
            </div>
            <div>
              <strong>🎯 Meaningful Activities:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>One small accomplishment daily</li>
                <li>Engage in previously enjoyed activities</li>
                <li>Creative expression or hobbies</li>
                <li>Helping others when possible</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">🧠 Evidence-Based Depression Treatments</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>💬 Psychotherapy:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Cognitive Behavioral Therapy (CBT)</li>
                <li>Interpersonal Therapy (IPT)</li>
                <li>Dialectical Behavior Therapy (DBT)</li>
                <li>Acceptance and Commitment Therapy</li>
              </ul>
            </div>
            <div>
              <strong>💊 Medication Options:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>SSRIs (Selective Serotonin Reuptake Inhibitors)</li>
                <li>SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)</li>
                <li>Discuss with psychiatrist or primary care doctor</li>
                <li>Monitor effectiveness and side effects</li>
              </ul>
            </div>
            <div>
              <strong>🏃 Lifestyle Interventions:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Regular aerobic exercise program</li>
                <li>Sleep hygiene improvement</li>
                <li>Stress management techniques</li>
                <li>Mindfulness and meditation practice</li>
              </ul>
            </div>
            <div>
              <strong>👥 Support Systems:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Depression support groups</li>
                <li>Family therapy when appropriate</li>
                <li>Peer support programs</li>
                <li>Online therapy platforms</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">📊 Tracking Your Progress</h4>
          <div style="color:#495057;font-size:0.95em;">
            <p><strong>Weekly Monitoring (rate 1-10):</strong></p>
            <ul style="margin:5px 0;">
              <li>Overall mood and emotional state</li>
              <li>Energy levels and motivation</li>
              <li>Sleep quality and patterns</li>
              <li>Social engagement and relationships</li>
              <li>Ability to enjoy activities</li>
              <li>Concentration and decision-making</li>
            </ul>
            <p><strong>Monthly Goals:</strong></p>
            <ul style="margin:5px 0;">
              <li>Retake this assessment to track changes</li>
              <li>Review treatment effectiveness with providers</li>
              <li>Adjust strategies based on what's working</li>
              <li>Celebrate improvements, no matter how small</li>
            </ul>
          </div>
        </div>

        ${coreSymptoms >= 10 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">👨‍⚕️ Professional Help Resources</h4>
          <div style="color:#0c5460;font-size:0.95em;">
            <p><strong>Finding Mental Health Professionals:</strong></p>
            <ul style="margin:5px 0;">
              <li>Psychology Today therapist finder</li>
              <li>Your insurance provider directory</li>
              <li>Primary care physician referrals</li>
              <li>Community mental health centers</li>
              <li>Employee assistance programs</li>
            </ul>
            <p><strong>What to Expect in Treatment:</strong></p>
            <ul style="margin:5px 0;">
              <li>Initial assessment and diagnosis</li>
              <li>Collaborative treatment planning</li>
              <li>Regular therapy sessions (weekly initially)</li>
              <li>Possible medication evaluation</li>
              <li>Progress monitoring and plan adjustments</li>
            </ul>
          </div>
        </div>
        ` : ''}

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">💪 Remember: Recovery is Possible</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <ul style="margin:5px 0;">
              <li><strong>Depression is treatable:</strong> Effective treatments are available and helpful</li>
              <li><strong>Recovery takes time:</strong> Be patient with yourself during the healing process</li>
              <li><strong>Small steps matter:</strong> Every positive action contributes to recovery</li>
              <li><strong>You're not alone:</strong> Many people experience depression and recover</li>
              <li><strong>Setbacks are normal:</strong> Recovery isn't always linear - that's okay</li>
              <li><strong>Hope is important:</strong> Things can and will get better with proper support</li>
            </ul>
          </div>
        </div>

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Important Reminders</h4>
          <ul style="margin:5px 0;color:#721c24;font-size:0.9em;">
            <li>This assessment is for tracking purposes only, not diagnosis</li>
            <li>Professional evaluation is recommended for persistent symptoms</li>
            <li>Seek immediate help if you have thoughts of self-harm</li>
            <li>Depression affects medical conditions - inform all healthcare providers</li>
            <li>Medication changes should only be made with professional guidance</li>
            <li>Support from family and friends is crucial during treatment</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function getTreatmentDescription(treatment) {
    const descriptions = {
      'none': 'You are not currently receiving professional treatment. Consider consulting with a mental health professional.',
      'therapy': 'You are receiving therapy/counseling, which is excellent for depression management.',
      'medication': 'You are taking medication for depression. Continue working with your prescribing physician.',
      'both': 'You are receiving both therapy and medication - the most comprehensive treatment approach.',
      'other': 'You are receiving other forms of treatment. Continue with what\'s helping you.'
    };
    return descriptions[treatment] || 'Please specify your current treatment status.';
  }
});