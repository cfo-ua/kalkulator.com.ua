document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('stress-assessment-form');
  const result = document.getElementById('stress-assessment-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const workOverwhelm = +form['work-overwhelm'].value;
    const workLifeBalance = +form['work-life-balance'].value;
    const workWorry = +form['work-worry'].value;
    const financialWorry = +form['financial-worry'].value;
    const financialSleep = +form['financial-sleep'].value;
    const relationshipStress = +form['relationship-stress'].value;
    const socialIsolation = +form['social-isolation'].value;
    const physicalSymptoms = +form['physical-symptoms'].value;
    const healthWorry = +form['health-worry'].value;
    const lifeChanges = +form['life-changes'].value;
    const uncertaintyHandling = +form['uncertainty-handling'].value;
    const sleepInterference = +form['sleep-interference'].value;
    const mentalExhaustion = +form['mental-exhaustion'].value;
    const copingEffectiveness = +form['coping-effectiveness'].value;
    const unhealthyCoping = +form['unhealthy-coping'].value;
    const socialSupport = +form['social-support'].value;

    // Validation
    if (!age || !gender || workOverwhelm === '' || workLifeBalance === '' || workWorry === '' || 
        financialWorry === '' || financialSleep === '' || relationshipStress === '' || 
        socialIsolation === '' || physicalSymptoms === '' || healthWorry === '' || 
        lifeChanges === '' || uncertaintyHandling === '' || sleepInterference === '' || 
        mentalExhaustion === '' || copingEffectiveness === '' || unhealthyCoping === '' || 
        socialSupport === '') {
      result.innerHTML = '<p style="color:red;">Please answer all questions to get an accurate stress assessment.</p>';
      return;
    }

    // Calculate stress domain scores
    let stressDomains = {};
    let totalStressScore = 0;

    // Work/Academic Stress (0-30)
    const workStress = workOverwhelm + workLifeBalance + workWorry;
    stressDomains.work = Math.round((workStress / 12) * 100);
    totalStressScore += workStress;

    // Financial Stress (0-20)
    const financialStress = financialWorry + financialSleep;
    stressDomains.financial = Math.round((financialStress / 8) * 100);
    totalStressScore += financialStress;

    // Relationship/Social Stress (0-20)
    const socialStress = relationshipStress + socialIsolation;
    stressDomains.social = Math.round((socialStress / 8) * 100);
    totalStressScore += socialStress;

    // Health Stress (0-20)
    const healthStress = physicalSymptoms + healthWorry;
    stressDomains.health = Math.round((healthStress / 8) * 100);
    totalStressScore += healthStress;

    // Life Changes/Uncertainty Stress (0-20)
    const changeStress = lifeChanges + uncertaintyHandling;
    stressDomains.changes = Math.round((changeStress / 8) * 100);
    totalStressScore += changeStress;

    // Sleep/Energy Stress (0-20)
    const sleepStress = sleepInterference + mentalExhaustion;
    stressDomains.sleep = Math.round((sleepStress / 8) * 100);
    totalStressScore += sleepStress;

    // Coping Resources (0-30) - Lower scores are better (inverted for display)
    const copingStress = copingEffectiveness + unhealthyCoping + socialSupport;
    stressDomains.coping = Math.round((copingStress / 12) * 100);
    totalStressScore += copingStress;

    // Calculate overall stress percentage (0-100)
    const maxPossibleScore = 150; // Sum of all maximum scores
    const stressPercentage = Math.round((totalStressScore / maxPossibleScore) * 100);

    // Determine stress level category
    let stressCategory, stressColor, stressDescription, urgencyLevel;
    
    if (stressPercentage <= 30) {
      stressCategory = 'Low Stress';
      stressColor = '#28a745';
      stressDescription = 'Your stress levels are manageable and within healthy ranges.';
      urgencyLevel = 'Maintenance';
    } else if (stressPercentage <= 50) {
      stressCategory = 'Moderate Stress';
      stressColor = '#6f9f6f';
      stressDescription = 'You have moderate stress that may benefit from attention and management.';
      urgencyLevel = 'Preventive Action';
    } else if (stressPercentage <= 70) {
      stressCategory = 'High Stress';
      stressColor = '#ffc107';
      stressDescription = 'You are experiencing significant stress that requires active management.';
      urgencyLevel = 'Active Management Needed';
    } else if (stressPercentage <= 85) {
      stressCategory = 'Very High Stress';
      stressColor = '#fd7e14';
      stressDescription = 'You have very high stress levels that are likely affecting your daily life and health.';
      urgencyLevel = 'Immediate Attention Required';
    } else {
      stressCategory = 'Extreme Stress';
      stressColor = '#dc3545';
      stressDescription = 'You are experiencing extreme stress levels that require immediate professional support.';
      urgencyLevel = 'Crisis Level - Seek Help';
    }

    // Generate personalized recommendations
    let recommendations = [];
    let warningFlags = [];

    // Check for concerning patterns
    if (physicalSymptoms >= 3) {
      warningFlags.push('Frequent physical stress symptoms detected');
      recommendations.push('🏥 Consider medical evaluation for stress-related physical symptoms');
    }
    
    if (sleepInterference >= 3) {
      warningFlags.push('Severe sleep disruption from stress');
      recommendations.push('😴 Prioritize sleep hygiene and consider sleep medicine consultation');
    }
    
    if (mentalExhaustion >= 3) {
      warningFlags.push('Signs of burnout or chronic exhaustion');
      recommendations.push('🧘 Take immediate steps to reduce commitments and increase self-care');
    }
    
    if (unhealthyCoping >= 3) {
      warningFlags.push('Reliance on unhealthy coping mechanisms');
      recommendations.push('🆘 Seek professional help to develop healthier coping strategies');
    }

    // Domain-specific recommendations
    if (stressDomains.work > 60) {
      recommendations.push('💼 Address workplace stress through better time management, boundaries, or career counseling');
    }
    
    if (stressDomains.financial > 60) {
      recommendations.push('💰 Consider financial planning, budgeting assistance, or debt counseling');
    }
    
    if (stressDomains.social > 60) {
      recommendations.push('👥 Work on relationship skills, communication, or consider family/couples counseling');
    }
    
    if (stressDomains.health > 60) {
      recommendations.push('🏥 Address health concerns with medical professionals and practice stress-reduction techniques');
    }
    
    if (stressDomains.changes > 60) {
      recommendations.push('🔄 Develop adaptability skills and seek support during life transitions');
    }
    
    if (stressDomains.coping > 60) {
      recommendations.push('🛠️ Learn new stress management techniques and build stronger support networks');
    }

    // General stress management recommendations
    if (stressPercentage > 50) {
      recommendations.push('🧘 Practice daily stress reduction: meditation, deep breathing, or progressive muscle relaxation');
      recommendations.push('🏃 Engage in regular physical exercise to reduce stress hormones');
      recommendations.push('📱 Limit news and social media exposure if they increase stress');
    }

    if (stressPercentage > 70) {
      recommendations.push('👨‍⚕️ Consider professional counseling or therapy for stress management');
      recommendations.push('📞 Reach out to trusted friends, family, or support groups');
    }

    // Identify top stress domains
    const sortedDomains = Object.entries(stressDomains)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Stress Level Assessment Results</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:inline-block;background:${stressColor};color:white;padding:15px 30px;border-radius:50px;font-size:1.5em;font-weight:bold;margin-bottom:15px;">
            ${stressPercentage}/100
          </div>
          <h4 style="color:${stressColor};margin:10px 0;">${stressCategory}</h4>
          <p style="color:#666;margin:0;">${stressDescription}</p>
          <p style="color:#666;margin:10px 0;"><strong>Action Level:</strong> ${urgencyLevel}</p>
        </div>

        ${warningFlags.length > 0 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #dc3545;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Urgent Concerns Detected</h4>
          <ul style="margin:5px 0;color:#721c24;">
            ${warningFlags.map(flag => `<li>${flag}</li>`).join('')}
          </ul>
          <p style="color:#721c24;font-weight:bold;margin:10px 0;">These patterns suggest you may benefit from immediate professional support.</p>
        </div>
        ` : ''}

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Stress Domain Analysis</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            ${Object.entries(stressDomains).map(([domain, score]) => {
              const displayNames = {
                work: 'Work/Academic',
                financial: 'Financial',
                social: 'Social/Relationships',
                health: 'Health & Physical',
                changes: 'Life Changes',
                sleep: 'Sleep & Energy',
                coping: 'Coping Resources'
              };
              
              const domainColor = score >= 70 ? '#dc3545' : score >= 50 ? '#ffc107' : score >= 30 ? '#6f9f6f' : '#28a745';
              
              return `
                <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
                  <span>${displayNames[domain]}:</span>
                  <span style="font-weight:bold;color:${domainColor};">${score}%</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Top 3 Stress Areas Requiring Attention</h4>
          <ol style="margin:5px 0;color:#666;">
            ${sortedDomains.map(([domain, score], index) => {
              const displayNames = {
                work: 'Work/Academic Stress',
                financial: 'Financial Stress',
                social: 'Social/Relationship Stress',
                health: 'Health & Physical Stress',
                changes: 'Life Changes & Uncertainty',
                sleep: 'Sleep & Energy Issues',
                coping: 'Coping & Support Resources'
              };
              return `<li><strong>${displayNames[domain]}:</strong> ${score}% stress level</li>`;
            }).join('')}
          </ol>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">🎯 Personalized Stress Management Recommendations</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🌟 Immediate Stress Relief Techniques</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🫁 Breathing Exercises (2-5 minutes):</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>4-7-8 breathing: Inhale 4, hold 7, exhale 8</li>
                <li>Box breathing: 4 counts each direction</li>
                <li>Deep belly breathing with hand on chest</li>
              </ul>
            </div>
            <div>
              <strong>💪 Quick Physical Relief:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Progressive muscle relaxation</li>
                <li>Neck and shoulder stretches</li>
                <li>5-minute walk outside</li>
                <li>Gentle yoga poses</li>
              </ul>
            </div>
            <div>
              <strong>🧠 Mental Techniques:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>5-4-3-2-1 grounding exercise</li>
                <li>Positive self-talk and affirmations</li>
                <li>Mindful moment with focus on present</li>
                <li>Brief meditation or prayer</li>
              </ul>
            </div>
            <div>
              <strong>🎵 Sensory Calming:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Listen to calming music</li>
                <li>Use aromatherapy (lavender, chamomile)</li>
                <li>Hold a warm cup of tea</li>
                <li>Look at nature or calming images</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">📅 Long-Term Stress Management Plan</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>⏰ Daily Habits (5-30 minutes):</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Morning meditation or mindfulness</li>
                <li>Regular exercise routine</li>
                <li>Stress-free meals without distractions</li>
                <li>Evening relaxation ritual</li>
              </ul>
            </div>
            <div>
              <strong>📅 Weekly Practices:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Schedule downtime and fun activities</li>
                <li>Connect with supportive friends/family</li>
                <li>Review and adjust priorities</li>
                <li>Practice a hobby or creative outlet</li>
              </ul>
            </div>
            <div>
              <strong>🗓️ Monthly Reviews:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Assess stress levels and triggers</li>
                <li>Evaluate coping strategy effectiveness</li>
                <li>Set realistic goals and boundaries</li>
                <li>Consider professional support if needed</li>
              </ul>
            </div>
            <div>
              <strong>🌱 Lifestyle Changes:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Improve sleep environment and routine</li>
                <li>Optimize nutrition for stress resilience</li>
                <li>Build stronger social support networks</li>
                <li>Learn time management skills</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">🧘 Evidence-Based Stress Reduction Programs</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🧘‍♀️ Mindfulness-Based Programs:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Mindfulness-Based Stress Reduction (MBSR)</li>
                <li>Mindfulness-Based Cognitive Therapy</li>
                <li>Acceptance and Commitment Therapy</li>
                <li>Meditation apps and guided practices</li>
              </ul>
            </div>
            <div>
              <strong>🏃 Physical Stress Relief:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Regular aerobic exercise program</li>
                <li>Yoga or tai chi classes</li>
                <li>Nature-based activities</li>
                <li>Dance or movement therapy</li>
              </ul>
            </div>
            <div>
              <strong>🧠 Cognitive Approaches:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Cognitive Behavioral Therapy (CBT)</li>
                <li>Stress inoculation training</li>
                <li>Problem-solving therapy</li>
                <li>Relaxation response training</li>
              </ul>
            </div>
            <div>
              <strong>👥 Social Support:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#856404;">
                <li>Support groups for stress management</li>
                <li>Group therapy or counseling</li>
                <li>Community wellness programs</li>
                <li>Workplace stress management training</li>
              </ul>
            </div>
          </div>
        </div>

        ${stressPercentage > 70 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#721c24;">🆘 When to Seek Professional Help</h4>
          <ul style="margin:5px 0;color:#721c24;font-size:0.9em;">
            <li>Stress significantly interferes with work, relationships, or daily activities</li>
            <li>Physical symptoms persist despite stress management efforts</li>
            <li>You're using alcohol, drugs, or other substances to cope</li>
            <li>You feel hopeless, overwhelmed, or have thoughts of self-harm</li>
            <li>Family or friends express concern about your stress levels</li>
            <li>You've tried stress management techniques without improvement</li>
          </ul>
          <p style="color:#721c24;font-weight:bold;margin:10px 0;">
            Professional Resources: Therapists, counselors, employee assistance programs, 
            stress management specialists, or your primary care physician.
          </p>
        </div>
        ` : ''}

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#157aff;">📊 Tracking Your Progress</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <p><strong>Weekly Stress Monitoring:</strong></p>
            <ul style="margin:5px 0;">
              <li>Rate your stress level daily (1-10 scale)</li>
              <li>Note your main stress triggers each day</li>
              <li>Track which coping strategies you used</li>
              <li>Record sleep quality and physical symptoms</li>
            </ul>
            <p><strong>Monthly Re-assessment:</strong> Retake this assessment to monitor changes and adjust your stress management approach.</p>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});