document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('mental-health-assessment-form');
  const result = document.getElementById('mental-health-assessment-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const depression = +form.depression.value;
    const anhedonia = +form.anhedonia.value;
    const anxiety = +form.anxiety.value;
    const worry = +form.worry.value;
    const sleepTrouble = +form['sleep-trouble'].value;
    const fatigue = +form.fatigue.value;
    const concentration = +form.concentration.value;
    const decisionMaking = +form['decision-making'].value;
    const appetite = +form.appetite.value;
    const selfWorth = +form['self-worth'].value;
    const socialAvoidance = +form['social-avoidance'].value;
    const restlessness = +form.restlessness.value;
    const coping = +form.coping.value;
    const lifeSatisfaction = +form['life-satisfaction'].value;
    const supportSystem = +form['support-system'].value;

    // Validation
    if (!age || !gender || depression === '' || anhedonia === '' || anxiety === '' || 
        worry === '' || sleepTrouble === '' || fatigue === '' || concentration === '' || 
        decisionMaking === '' || appetite === '' || selfWorth === '' || socialAvoidance === '' || 
        restlessness === '' || coping === '' || lifeSatisfaction === '' || supportSystem === '') {
      result.innerHTML = '<p style="color:red;">Please answer all questions to get an accurate mental health assessment.</p>';
      return;
    }

    // Calculate component scores
    let totalScore = 0;
    let maxScore = 0;
    let scoreBreakdown = {};

    // Depression symptoms (PHQ-9 inspired) - Higher scores indicate more symptoms
    // Invert these scores since higher frequency = worse mental health
    const depressionScore = Math.max(0, 24 - (depression + anhedonia + sleepTrouble + fatigue + concentration + appetite + selfWorth + restlessness) * 3);
    scoreBreakdown.depression = Math.round(depressionScore);
    totalScore += depressionScore;
    maxScore += 24;

    // Anxiety symptoms (GAD-7 inspired) - Higher scores indicate more symptoms
    const anxietyScore = Math.max(0, 18 - (anxiety + worry + restlessness) * 6);
    scoreBreakdown.anxiety = Math.round(anxietyScore);
    totalScore += anxietyScore;
    maxScore += 18;

    // Cognitive function
    const cognitiveScore = Math.max(0, 18 - (concentration + decisionMaking + fatigue) * 6);
    scoreBreakdown.cognitive = Math.round(cognitiveScore);
    totalScore += cognitiveScore;
    maxScore += 18;

    // Social functioning
    const socialScore = Math.max(0, 12 - socialAvoidance * 4) + supportSystem * 3;
    scoreBreakdown.social = Math.round(socialScore);
    totalScore += socialScore;
    maxScore += 21;

    // Positive coping and life satisfaction (these are already positive)
    const copingScore = coping * 5 + lifeSatisfaction * 4;
    scoreBreakdown.coping = Math.round(copingScore);
    totalScore += copingScore;
    maxScore += 19;

    // Calculate final percentage score
    const mentalHealthScore = Math.round((totalScore / maxScore) * 100);

    // Determine mental health category
    let category, color, description, riskLevel;
    if (mentalHealthScore >= 85) {
      category = 'Excellent';
      color = '#28a745';
      description = 'Your mental health appears to be excellent with strong wellbeing indicators.';
      riskLevel = 'Very Low';
    } else if (mentalHealthScore >= 70) {
      category = 'Good';
      color = '#6f9f6f';
      description = 'You have good mental health with some areas that could benefit from attention.';
      riskLevel = 'Low';
    } else if (mentalHealthScore >= 55) {
      category = 'Moderate';
      color = '#ffc107';
      description = 'Your mental health shows some concerning patterns that warrant attention.';
      riskLevel = 'Moderate';
    } else if (mentalHealthScore >= 40) {
      category = 'Concerning';
      color = '#fd7e14';
      description = 'Your responses suggest significant mental health challenges that need support.';
      riskLevel = 'High';
    } else {
      category = 'Severe';
      color = '#dc3545';
      description = 'Your responses indicate serious mental health concerns. Please seek professional help.';
      riskLevel = 'Very High';
    }

    // Generate specific recommendations based on responses
    let recommendations = [];
    let warningFlags = [];

    // Depression indicators
    if (depression >= 2 || anhedonia >= 2) {
      recommendations.push('🧠 Consider speaking with a mental health professional about depression symptoms');
      if (depression >= 3 || anhedonia >= 3) {
        warningFlags.push('Severe depression symptoms detected');
      }
    }

    // Anxiety indicators
    if (anxiety >= 2 || worry >= 2) {
      recommendations.push('😰 Practice anxiety management techniques like deep breathing, mindfulness, or progressive muscle relaxation');
      if (anxiety >= 3 || worry >= 3) {
        warningFlags.push('Severe anxiety symptoms detected');
      }
    }

    // Sleep issues
    if (sleepTrouble >= 2) {
      recommendations.push('😴 Prioritize sleep hygiene: consistent bedtime, dark room, no screens before bed');
    }

    // Energy and fatigue
    if (fatigue >= 2) {
      recommendations.push('⚡ Address fatigue through regular exercise, balanced nutrition, and medical evaluation if persistent');
    }

    // Cognitive concerns
    if (concentration >= 2 || decisionMaking >= 2) {
      recommendations.push('🧩 Improve cognitive function through meditation, brain exercises, and stress reduction');
    }

    // Self-worth issues
    if (selfWorth >= 2) {
      recommendations.push('💝 Practice self-compassion and challenge negative self-talk with evidence-based thinking');
    }

    // Social withdrawal
    if (socialAvoidance >= 2) {
      recommendations.push('👥 Gradually increase social connections, even if starting with brief interactions');
    }

    // Poor coping
    if (coping <= 1) {
      recommendations.push('🛠️ Develop healthy coping strategies: journaling, exercise, hobbies, relaxation techniques');
    }

    // Weak support system
    if (supportSystem <= 1) {
      recommendations.push('🤝 Build your support network through community groups, counseling, or online support communities');
    }

    // Low life satisfaction
    if (lifeSatisfaction <= 1) {
      recommendations.push('🎯 Explore what brings meaning and purpose to your life; consider goal-setting or life coaching');
    }

    // General recommendations
    if (mentalHealthScore < 70) {
      recommendations.push('🏃 Engage in regular physical activity - even 10 minutes of walking can improve mood');
      recommendations.push('🧘 Try mindfulness or meditation apps for 5-10 minutes daily');
      recommendations.push('📱 Consider using mental health apps for mood tracking and guided exercises');
    }

    if (mentalHealthScore < 55) {
      recommendations.push('👨‍⚕️ Strongly consider professional mental health support - therapy can be very effective');
      recommendations.push('📞 Reach out to a trusted friend or family member about how you\'re feeling');
    }

    // Age-specific recommendations
    if (age < 25 && mentalHealthScore < 60) {
      recommendations.push('🎓 Young adult mental health resources and college counseling services can be very helpful');
    }

    if (age > 65 && mentalHealthScore < 60) {
      recommendations.push('👴 Consider age-specific mental health resources and social programs for older adults');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Mental Health Assessment Results</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:inline-block;background:${color};color:white;padding:15px 30px;border-radius:50px;font-size:1.5em;font-weight:bold;margin-bottom:15px;">
            ${mentalHealthScore}/100
          </div>
          <h4 style="color:${color};margin:10px 0;">${category} Mental Health</h4>
          <p style="color:#666;margin:0;">${description}</p>
          <p style="color:#666;margin:10px 0;"><strong>Risk Level:</strong> ${riskLevel}</p>
        </div>

        ${warningFlags.length > 0 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #dc3545;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Important Alerts</h4>
          <ul style="margin:5px 0;color:#721c24;">
            ${warningFlags.map(flag => `<li>${flag}</li>`).join('')}
          </ul>
          <p style="color:#721c24;font-weight:bold;margin:10px 0;">Please consider seeking professional mental health support immediately.</p>
        </div>
        ` : ''}

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Assessment Breakdown</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Mood Stability:</span>
              <span style="font-weight:bold;">${scoreBreakdown.depression}/24</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Anxiety Management:</span>
              <span style="font-weight:bold;">${scoreBreakdown.anxiety}/18</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Cognitive Function:</span>
              <span style="font-weight:bold;">${scoreBreakdown.cognitive}/18</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Social Wellbeing:</span>
              <span style="font-weight:bold;">${scoreBreakdown.social}/21</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Coping & Satisfaction:</span>
              <span style="font-weight:bold;">${scoreBreakdown.coping}/19</span>
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
          <h4 style="margin-top:0;color:#155724;">🌱 Daily Mental Health Practices</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🧘 Mindfulness (5-10 min):</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Deep breathing exercises</li>
                <li>Body scan meditation</li>
                <li>Mindful walking or eating</li>
              </ul>
            </div>
            <div>
              <strong>🏃 Physical Activity (20-30 min):</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Brisk walking or jogging</li>
                <li>Yoga or stretching</li>
                <li>Dancing or sports</li>
              </ul>
            </div>
            <div>
              <strong>👥 Social Connection:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Call a friend or family member</li>
                <li>Join social activities or groups</li>
                <li>Practice active listening</li>
              </ul>
            </div>
            <div>
              <strong>📝 Emotional Processing:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Journaling thoughts and feelings</li>
                <li>Gratitude practice</li>
                <li>Creative expression</li>
              </ul>
            </div>
          </div>
        </div>

        ${mentalHealthScore < 60 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">🆘 Crisis Resources</h4>
          <div style="color:#856404;font-size:0.95em;">
            <p><strong>If you're having thoughts of self-harm or suicide:</strong></p>
            <ul style="margin:5px 0;">
              <li><strong>National Suicide Prevention Lifeline:</strong> 988 (USA)</li>
              <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              <li><strong>Emergency Services:</strong> 911 (immediate danger)</li>
              <li><strong>International:</strong> befrienders.org for worldwide crisis support</li>
            </ul>
          </div>
        </div>
        ` : ''}

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#495057;">📚 Professional Mental Health Resources</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🏥 Types of Professionals:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Licensed therapists/counselors</li>
                <li>Psychologists</li>
                <li>Psychiatrists (medication)</li>
                <li>Clinical social workers</li>
              </ul>
            </div>
            <div>
              <strong>💊 Treatment Options:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Cognitive Behavioral Therapy (CBT)</li>
                <li>Dialectical Behavior Therapy (DBT)</li>
                <li>Mindfulness-based interventions</li>
                <li>Medication when appropriate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});