document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('mental-health-assessment-form');
  const result = document.getElementById('mental-health-assessment-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get wellness questions (1-10)
    let wellnessScore = 0;
    for (let i = 1; i <= 10; i++) {
      const value = +form[`wellness-q${i}`].value;
      wellnessScore += value;
    }
    
    // Get resilience questions (11-20) 
    let resilienceScore = 0;
    for (let i = 1; i <= 10; i++) {
      const value = +form[`resilience-q${i}`].value;
      resilienceScore += value;
    }

    // Validate all questions answered
    let allAnswered = true;
    for (let i = 1; i <= 10; i++) {
      if (!form[`wellness-q${i}`].value) allAnswered = false;
      if (!form[`resilience-q${i}`].value) allAnswered = false;
    }

    if (!allAnswered) {
      result.innerHTML = '<p style="color:red;">Please answer all questions to get an accurate mental health assessment.</p>';
      return;
    }

    // Calculate percentages
    // Wellness: Lower scores are better (0-30 total, invert to 0-100 scale)
    const wellnessPercentage = Math.max(0, Math.round(((30 - wellnessScore) / 30) * 100));
    
    // Resilience: Higher scores are better (0-40 total, convert to 0-100 scale)  
    const resiliencePercentage = Math.round((resilienceScore / 40) * 100);

    // Determine wellness level
    let wellnessLevel, wellnessColor, wellnessIcon;
    if (wellnessPercentage >= 85) {
      wellnessLevel = 'Excellent';
      wellnessColor = '#4CAF50';
      wellnessIcon = '🟢';
    } else if (wellnessPercentage >= 70) {
      wellnessLevel = 'Good';
      wellnessColor = '#2196F3';
      wellnessIcon = '🔵';
    } else if (wellnessPercentage >= 55) {
      wellnessLevel = 'Moderate';
      wellnessColor = '#FF9800';
      wellnessIcon = '🟡';
    } else if (wellnessPercentage >= 40) {
      wellnessLevel = 'Concerning';
      wellnessColor = '#FF5722';
      wellnessIcon = '🟠';
    } else {
      wellnessLevel = 'Severe';
      wellnessColor = '#F44336';
      wellnessIcon = '🔴';
    }

    // Determine resilience level
    let resilienceLevel, resilienceColor, resilienceIcon;
    if (resiliencePercentage >= 85) {
      resilienceLevel = 'Highly Resilient';
      resilienceColor = '#4CAF50';
      resilienceIcon = '🟢';
    } else if (resiliencePercentage >= 70) {
      resilienceLevel = 'Resilient';
      resilienceColor = '#2196F3';
      resilienceIcon = '🔵';
    } else if (resiliencePercentage >= 55) {
      resilienceLevel = 'Moderately Resilient';
      resilienceColor = '#FF9800';
      resilienceIcon = '🟡';
    } else if (resiliencePercentage >= 40) {
      resilienceLevel = 'Low Resilience';
      resilienceColor = '#FF5722';
      resilienceIcon = '🟠';
    } else {
      resilienceLevel = 'Very Low Resilience';
      resilienceColor = '#F44336';
      resilienceIcon = '🔴';
    }

    // Generate recommendations
    let recommendations = [];
    let urgentWarning = '';

    // Critical warning for severe scores
    if (wellnessPercentage < 40 || wellnessScore >= 20) {
      urgentWarning = `
        <div style="background: #ffebee; border: 2px solid #f44336; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h4 style="color: #d32f2f; margin: 0 0 10px 0;">🚨 Important: Seek Professional Help</h4>
          <p style="margin: 0; color: #d32f2f;">Your responses indicate significant mental health concerns. Please consider reaching out to a mental health professional, your doctor, or a crisis helpline for support.</p>
          <p style="margin: 10px 0 0 0; color: #d32f2f;"><strong>Crisis Resources: National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741</strong></p>
        </div>
      `;
    }

    // Wellness recommendations
    if (wellnessPercentage < 70) {
      recommendations.push('🧘 Practice daily mindfulness or meditation (10-15 minutes)');
      recommendations.push('🏃 Engage in regular physical activity (30 minutes, 5x/week)');
      recommendations.push('😴 Prioritize sleep hygiene (7-9 hours, consistent schedule)');
      recommendations.push('👥 Connect with supportive friends or family members');
    }
    
    if (wellnessPercentage < 55) {
      recommendations.push('⚕️ Consider speaking with a mental health professional');
      recommendations.push('📝 Start a mood journal to track patterns and triggers');
      recommendations.push('🚫 Limit alcohol and avoid drugs as coping mechanisms');
    }

    // Resilience recommendations  
    if (resiliencePercentage < 70) {
      recommendations.push('💪 Practice problem-solving skills for daily challenges');
      recommendations.push('🧠 Work on cognitive reframing (challenging negative thoughts)');
      recommendations.push('🎯 Set small, achievable goals to build confidence');
      recommendations.push('📚 Learn new skills or hobbies to increase adaptability');
    }

    if (resiliencePercentage < 55) {
      recommendations.push('🤝 Build and strengthen your social support network');
      recommendations.push('🙏 Consider therapy focused on resilience building (CBT, DBT)');
      recommendations.push('📖 Read about resilience and coping strategies');
    }

    // Positive reinforcement for good scores
    let positiveMessage = '';
    if (wellnessPercentage >= 70 && resiliencePercentage >= 70) {
      positiveMessage = `
        <div style="background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h4 style="color: #2e7d32; margin: 0 0 10px 0;">🎉 Great Mental Health!</h4>
          <p style="margin: 0; color: #2e7d32;">You're showing strong mental wellness and resilience. Keep up the excellent self-care practices!</p>
        </div>
      `;
    }

    // Display results
    result.innerHTML = `
      <div class="mental-health-results">
        ${urgentWarning}
        ${positiveMessage}
        
        <h3>🧠 Your Mental Health Assessment Results</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: ${wellnessColor};">${wellnessIcon} Mental Wellness</h4>
            <div style="font-size: 2em; font-weight: bold; color: ${wellnessColor};">${wellnessPercentage}%</div>
            <div style="color: ${wellnessColor}; font-weight: bold; margin-top: 5px;">${wellnessLevel}</div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #666;">Based on mood, anxiety, and daily functioning</div>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: ${resilienceColor};">${resilienceIcon} Resilience</h4>
            <div style="font-size: 2em; font-weight: bold; color: ${resilienceColor};">${resiliencePercentage}%</div>
            <div style="color: ${resilienceColor}; font-weight: bold; margin-top: 5px;">${resilienceLevel}</div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #666;">Based on coping skills and adaptability</div>
          </div>
        </div>

        <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 15px 0; color: #1976d2;">📊 Score Interpretation</h4>
          <div style="margin-bottom: 15px;">
            <strong>Mental Wellness (${wellnessPercentage}%):</strong> ${
              wellnessPercentage >= 85 ? 'You\'re experiencing optimal mental health with minimal symptoms of depression, anxiety, or stress.' :
              wellnessPercentage >= 70 ? 'You have generally good mental health with some minor concerns that could benefit from attention.' :
              wellnessPercentage >= 55 ? 'You\'re experiencing moderate mental health challenges that would benefit from support and self-care strategies.' :
              wellnessPercentage >= 40 ? 'You\'re showing significant mental health symptoms that warrant professional support and intervention.' :
              'You\'re experiencing severe mental health concerns that require immediate professional attention and support.'
            }
          </div>
          <div>
            <strong>Resilience (${resiliencePercentage}%):</strong> ${
              resiliencePercentage >= 85 ? 'You have exceptional ability to cope with stress and bounce back from challenges.' :
              resiliencePercentage >= 70 ? 'You have good resilience with strong coping mechanisms for handling adversity.' :
              resiliencePercentage >= 55 ? 'You have moderate resilience with room to develop stronger coping strategies.' :
              resiliencePercentage >= 40 ? 'You may struggle with managing stress and recovering from setbacks.' :
              'You face significant challenges in coping with stress and adversity.'
            }
          </div>
        </div>

        ${recommendations.length > 0 ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 15px 0; color: #856404;">💡 Personalized Recommendations</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${recommendations.map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 15px 0; color: #1976d2;">📈 Next Steps</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Take this assessment monthly to track your progress</li>
            <li style="margin-bottom: 8px;">Keep a daily mood and stress journal</li>
            <li style="margin-bottom: 8px;">Share these results with healthcare providers if relevant</li>
            <li style="margin-bottom: 8px;">Focus on building both wellness and resilience together</li>
            ${wellnessPercentage < 55 || resiliencePercentage < 55 ? 
              '<li style="margin-bottom: 8px;">Consider professional counseling or therapy</li>' : ''}
          </ul>
        </div>

        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 0.9em;">
          <p style="margin: 0;"><strong>Disclaimer:</strong> This assessment is for educational purposes only and does not constitute professional medical advice. Always consult qualified mental health professionals for personalized care.</p>
        </div>
      </div>
    `;

    result.scrollIntoView({ behavior: 'smooth' });
  });
});