document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('resilience-score-form');
  const result = document.getElementById('resilience-score-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const setbackResponse = +form['setback-response'].value;
    const emotionManagement = +form['emotion-management'].value;
    const adaptability = +form.adaptability.value;
    const problemSolving = +form['problem-solving'].value;
    const challengePerception = +form['challenge-perception'].value;
    const negativeThoughts = +form['negative-thoughts'].value;
    const supportNetwork = +form['support-network'].value;
    const helpSeeking = +form['help-seeking'].value;
    const relationshipMaintenance = +form['relationship-maintenance'].value;
    const selfEfficacy = +form['self-efficacy'].value;
    const failureResponse = +form['failure-response'].value;
    const growthMindset = +form['growth-mindset'].value;
    const lifePurpose = +form['life-purpose'].value;
    const optimism = +form.optimism.value;
    const dailyMeaning = +form['daily-meaning'].value;
    const stressManagement = +form['stress-management'].value;
    const selfCare = +form['self-care'].value;
    const recoverySpeed = +form['recovery-speed'].value;

    // Validation
    if (!age || !gender || !setbackResponse || !emotionManagement || !adaptability || 
        !problemSolving || !challengePerception || !negativeThoughts || !supportNetwork || 
        !helpSeeking || !relationshipMaintenance || !selfEfficacy || !failureResponse || 
        !growthMindset || !lifePurpose || !optimism || !dailyMeaning || !stressManagement || 
        !selfCare || !recoverySpeed) {
      result.innerHTML = '<p style="color:red;">Please answer all questions to get an accurate resilience assessment.</p>';
      return;
    }

    // Calculate resilience component scores
    let resilienceScore = 0;
    let componentScores = {};

    // Emotional Regulation (25 points)
    const emotionalRegulation = setbackResponse + emotionManagement + adaptability + recoverySpeed;
    componentScores.emotional = Math.round((emotionalRegulation / 16) * 25);
    resilienceScore += componentScores.emotional;

    // Cognitive Flexibility (20 points)
    const cognitiveFlexibility = problemSolving + challengePerception + negativeThoughts + growthMindset;
    componentScores.cognitive = Math.round((cognitiveFlexibility / 16) * 20);
    resilienceScore += componentScores.cognitive;

    // Social Support (20 points)
    const socialSupport = supportNetwork + helpSeeking + relationshipMaintenance;
    componentScores.social = Math.round((socialSupport / 12) * 20);
    resilienceScore += componentScores.social;

    // Self-Efficacy (15 points)
    const selfEfficacyScore = selfEfficacy + failureResponse;
    componentScores.selfEfficacy = Math.round((selfEfficacyScore / 8) * 15);
    resilienceScore += componentScores.selfEfficacy;

    // Purpose & Optimism (15 points)
    const purposeOptimism = lifePurpose + optimism + dailyMeaning;
    componentScores.purpose = Math.round((purposeOptimism / 12) * 15);
    resilienceScore += componentScores.purpose;

    // Stress Management (5 points)
    const stressManagementScore = stressManagement + selfCare;
    componentScores.stress = Math.round((stressManagementScore / 8) * 5);
    resilienceScore += componentScores.stress;

    // Determine resilience category
    let category, color, description, recommendations = [];

    if (resilienceScore >= 85) {
      category = 'Highly Resilient';
      color = '#28a745';
      description = 'You demonstrate exceptional psychological resilience with strong coping mechanisms and adaptability.';
    } else if (resilienceScore >= 70) {
      category = 'Resilient';
      color = '#6f9f6f';
      description = 'You have good resilience skills and generally cope well with life\'s challenges.';
    } else if (resilienceScore >= 55) {
      category = 'Moderately Resilient';
      color = '#ffc107';
      description = 'You have average resilience with some areas that could benefit from strengthening.';
    } else if (resilienceScore >= 40) {
      category = 'Low Resilience';
      color = '#fd7e14';
      description = 'You may struggle with stress and setbacks. Building resilience skills would be beneficial.';
    } else {
      category = 'Very Low Resilience';
      color = '#dc3545';
      description = 'You face significant challenges in managing adversity. Consider seeking professional support.';
    }

    // Generate personalized recommendations based on component scores
    if (componentScores.emotional < 20) {
      recommendations.push('🧘 Practice emotional regulation techniques like deep breathing, mindfulness, and progressive muscle relaxation');
      recommendations.push('📝 Keep an emotion diary to identify patterns and triggers');
    }

    if (componentScores.cognitive < 16) {
      recommendations.push('🧠 Challenge negative thought patterns with cognitive restructuring techniques');
      recommendations.push('💡 Practice reframing exercises to find alternative perspectives on problems');
    }

    if (componentScores.social < 16) {
      recommendations.push('👥 Strengthen your support network by reaching out to friends and family');
      recommendations.push('🤝 Consider joining support groups or community organizations');
    }

    if (componentScores.selfEfficacy < 12) {
      recommendations.push('🎯 Set and achieve small, manageable goals to build confidence');
      recommendations.push('💪 Practice self-compassion and celebrate your successes');
    }

    if (componentScores.purpose < 12) {
      recommendations.push('🎯 Explore your values and life purpose through reflection or journaling');
      recommendations.push('🌟 Engage in meaningful activities that align with your values');
    }

    if (componentScores.stress < 4) {
      recommendations.push('🛀 Develop a regular self-care routine including exercise, relaxation, and hobbies');
      recommendations.push('⚖️ Practice stress management techniques like time management and boundary setting');
    }

    // Identify strongest resilience factors
    const strengths = [];
    if (componentScores.emotional >= 20) strengths.push('Emotional Regulation');
    if (componentScores.cognitive >= 16) strengths.push('Cognitive Flexibility');
    if (componentScores.social >= 16) strengths.push('Social Support');
    if (componentScores.selfEfficacy >= 12) strengths.push('Self-Efficacy');
    if (componentScores.purpose >= 12) strengths.push('Purpose & Optimism');
    if (componentScores.stress >= 4) strengths.push('Stress Management');

    // Age-specific considerations
    let ageInsights = '';
    if (age < 25) {
      ageInsights = 'Young adults often build resilience through new experiences and challenges. Focus on developing healthy coping strategies early.';
    } else if (age < 40) {
      ageInsights = 'This is a prime time for developing resilience skills as you navigate career and relationship challenges.';
    } else if (age < 60) {
      ageInsights = 'Middle age often brings increased resilience through life experience. Continue building on your strengths.';
    } else {
      ageInsights = 'Older adults often have well-developed resilience skills. Share your wisdom while staying open to growth.';
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Mental Health Resilience Assessment</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:inline-block;background:${color};color:white;padding:15px 30px;border-radius:50px;font-size:1.5em;font-weight:bold;margin-bottom:15px;">
            ${resilienceScore}/100
          </div>
          <h4 style="color:${color};margin:10px 0;">${category}</h4>
          <p style="color:#666;margin:0;">${description}</p>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Resilience Component Breakdown</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Emotional Regulation:</span>
              <span style="font-weight:bold;color:${componentScores.emotional >= 20 ? '#28a745' : componentScores.emotional >= 15 ? '#ffc107' : '#dc3545'};">${componentScores.emotional}/25</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Cognitive Flexibility:</span>
              <span style="font-weight:bold;color:${componentScores.cognitive >= 16 ? '#28a745' : componentScores.cognitive >= 12 ? '#ffc107' : '#dc3545'};">${componentScores.cognitive}/20</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Social Support:</span>
              <span style="font-weight:bold;color:${componentScores.social >= 16 ? '#28a745' : componentScores.social >= 12 ? '#ffc107' : '#dc3545'};">${componentScores.social}/20</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Self-Efficacy:</span>
              <span style="font-weight:bold;color:${componentScores.selfEfficacy >= 12 ? '#28a745' : componentScores.selfEfficacy >= 9 ? '#ffc107' : '#dc3545'};">${componentScores.selfEfficacy}/15</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Purpose & Optimism:</span>
              <span style="font-weight:bold;color:${componentScores.purpose >= 12 ? '#28a745' : componentScores.purpose >= 9 ? '#ffc107' : '#dc3545'};">${componentScores.purpose}/15</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
              <span>Stress Management:</span>
              <span style="font-weight:bold;color:${componentScores.stress >= 4 ? '#28a745' : componentScores.stress >= 3 ? '#ffc107' : '#dc3545'};">${componentScores.stress}/5</span>
            </div>
          </div>
        </div>

        ${strengths.length > 0 ? `
        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">💪 Your Resilience Strengths</h4>
          <p style="color:#155724;margin:5px 0;">You show particular strength in: <strong>${strengths.join(', ')}</strong></p>
          <p style="color:#155724;margin:5px 0;font-size:0.9em;">These are valuable assets that help you cope with challenges. Continue to leverage these strengths while working on other areas.</p>
        </div>
        ` : ''}

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">🎯 Personalized Resilience-Building Recommendations</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Age-Specific Insights</h4>
          <p style="color:#666;margin:5px 0;">${ageInsights}</p>
        </div>

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">🌱 Daily Resilience-Building Practices</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🧘 Mindfulness & Emotional Regulation:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>5-10 minutes daily meditation</li>
                <li>Deep breathing exercises</li>
                <li>Body scan relaxation</li>
                <li>Emotion naming and acceptance</li>
              </ul>
            </div>
            <div>
              <strong>🧠 Cognitive Flexibility Training:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Challenge negative thoughts</li>
                <li>Practice perspective-taking</li>
                <li>Reframe problems as opportunities</li>
                <li>Learn new skills regularly</li>
              </ul>
            </div>
            <div>
              <strong>👥 Social Connection Building:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Regular check-ins with loved ones</li>
                <li>Join community activities</li>
                <li>Practice active listening</li>
                <li>Offer support to others</li>
              </ul>
            </div>
            <div>
              <strong>🎯 Purpose & Growth Activities:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Values clarification exercises</li>
                <li>Set meaningful goals</li>
                <li>Volunteer for causes you care about</li>
                <li>Practice gratitude daily</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">🛠️ Evidence-Based Resilience Interventions</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>📚 Cognitive Behavioral Techniques:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Thought record keeping</li>
                <li>Behavioral activation</li>
                <li>Problem-solving training</li>
                <li>Exposure to manageable challenges</li>
              </ul>
            </div>
            <div>
              <strong>🧘 Mindfulness-Based Interventions:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Mindfulness-Based Stress Reduction (MBSR)</li>
                <li>Acceptance and Commitment Therapy (ACT)</li>
                <li>Dialectical Behavior Therapy skills</li>
                <li>Loving-kindness meditation</li>
              </ul>
            </div>
            <div>
              <strong>💪 Strength-Based Approaches:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Identify and use character strengths</li>
                <li>Build on past successes</li>
                <li>Develop mastery experiences</li>
                <li>Practice positive psychology exercises</li>
              </ul>
            </div>
            <div>
              <strong>🌐 Social Resilience Building:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Communication skills training</li>
                <li>Conflict resolution practice</li>
                <li>Empathy development exercises</li>
                <li>Community engagement activities</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">📈 Tracking Your Resilience Progress</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <p><strong>Weekly Check-ins:</strong></p>
            <ul style="margin:5px 0;">
              <li>Rate your stress levels and coping effectiveness (1-10 scale)</li>
              <li>Note which resilience skills you used during challenges</li>
              <li>Identify one area of growth and one area of strength</li>
              <li>Plan resilience-building activities for the coming week</li>
            </ul>
            <p><strong>Monthly Assessment:</strong> Retake this assessment to track improvements over time</p>
          </div>
        </div>

        ${resilienceScore < 55 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin-15px 0;">
          <h4 style="margin-top:0;color:#721c24;">🆘 When to Seek Professional Support</h4>
          <ul style="margin:5px 0;color:#721c24;font-size:0.9em;">
            <li>Persistent feelings of being overwhelmed or unable to cope</li>
            <li>Significant interference with work, relationships, or daily activities</li>
            <li>Thoughts of self-harm or feeling like giving up</li>
            <li>Reliance on alcohol, drugs, or other unhealthy coping mechanisms</li>
            <li>Difficulty recovering from traumatic events or major losses</li>
            <li>Chronic stress-related physical symptoms</li>
          </ul>
          <p style="color:#721c24;font-weight:bold;margin:10px 0;">Consider therapy, counseling, or resilience training programs for professional guidance.</p>
        </div>
        ` : ''}

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#495057;">🏆 Building Long-Term Resilience</h4>
          <div style="color:#495057;font-size:0.95em;">
            <p><strong>Remember:</strong> Resilience is not a trait you're born with - it's a skill that can be developed throughout life. Small, consistent practices often have the biggest impact over time.</p>
            <p><strong>Key Principles:</strong></p>
            <ul style="margin:5px 0;">
              <li>Progress over perfection - small improvements matter</li>
              <li>Practice during calm times to prepare for storms</li>
              <li>Use your strengths to support areas of growth</li>
              <li>Connect with others who inspire and support your growth</li>
              <li>View setbacks as opportunities to practice resilience skills</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});