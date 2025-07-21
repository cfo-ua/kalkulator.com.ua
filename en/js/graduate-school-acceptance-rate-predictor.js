document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('grad-school-form');
  const result = document.getElementById('grad-school-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const programType = document.getElementById('program-type').value;
      const universityTier = document.getElementById('university-tier').value;
      const field = document.getElementById('field').value;
      const gpa = document.getElementById('gpa').value;
      const undergradSchool = document.getElementById('undergrad-school').value;
      const academicTrend = document.getElementById('academic-trend').value;
      const greQuant = document.getElementById('gre-quant').value;
      const greVerbal = document.getElementById('gre-verbal').value;
      const gmatScore = document.getElementById('gmat-score').value;
      const lsatScore = document.getElementById('lsat-score').value;
      const researchExperience = document.getElementById('research-experience').value;
      const publications = document.getElementById('publications').value;
      const teachingExperience = document.getElementById('teaching-experience').value;
      const workExperience = document.getElementById('work-experience').value;
      const leadership = document.getElementById('leadership').value;
      const extracurriculars = document.getElementById('extracurriculars').value;
      const sopQuality = document.getElementById('sop-quality').value;
      const recommendations = document.getElementById('recommendations').value;
      const programFit = document.getElementById('program-fit').value;
      
      // Check additional factors
      const honorsProgram = document.getElementById('honors-program').checked;
      const relevantCoursework = document.getElementById('relevant-coursework').checked;
      const additionalDegree = document.getElementById('additional-degree').checked;
      const academicAwards = document.getElementById('academic-awards').checked;
      const conferenceAttendance = document.getElementById('conference-attendance').checked;
      const researchFunding = document.getElementById('research-funding').checked;
      const volunteerWork = document.getElementById('volunteer-work').checked;
      const uniqueBackground = document.getElementById('unique-background').checked;
      const entrepreneurship = document.getElementById('entrepreneurship').checked;
      const facultyContact = document.getElementById('faculty-contact').checked;
      const applicationHelp = document.getElementById('application-help').checked;
      
      // Validation
      if (!programType || !universityTier || !field || !gpa || !undergradSchool || !academicTrend || !researchExperience || !publications || !teachingExperience || !workExperience || !leadership || !extracurriculars || !sopQuality || !recommendations || !programFit) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Calculate acceptance probability
      let acceptanceScore = 50; // Base 50%
      let strengthFactors = [];
      let weaknessFactors = [];
      let recommendations = [];
      
      // GPA Impact (30% weight for most programs)
      const gpaScores = {
        'below-3.0': -25,
        '3.0-3.2': -15,
        '3.2-3.4': -5,
        '3.4-3.6': 5,
        '3.6-3.8': 15,
        '3.8-4.0': 25
      };
      
      const gpaImpact = gpaScores[gpa] || 0;
      acceptanceScore += gpaImpact;
      
      if (gpaImpact >= 15) {
        strengthFactors.push(`📈 Excellent GPA (${gpa.replace('-', ' - ')}) - major strength`);
      } else if (gpaImpact <= -15) {
        weaknessFactors.push(`📉 Low GPA (${gpa.replace('-', ' - ')}) - significant challenge`);
        recommendations.push('Consider explaining GPA in personal statement if there are extenuating circumstances');
      }
      
      // Standardized Test Scores
      let testScore = 0;
      if (programType === 'mba' && gmatScore) {
        const gmatScores = {
          'below-600': -20,
          '600-650': -5,
          '650-700': 10,
          '700-750': 20,
          'above-750': 30
        };
        testScore = gmatScores[gmatScore] || 0;
        if (testScore >= 20) {
          strengthFactors.push(`💼 Strong GMAT score (${gmatScore.replace('-', ' - ')}) for MBA programs`);
        }
      } else if (programType === 'law' && lsatScore) {
        const lsatScores = {
          'below-155': -25,
          '155-160': -10,
          '160-165': 10,
          '165-170': 25,
          'above-170': 35
        };
        testScore = lsatScores[lsatScore] || 0;
        if (testScore >= 25) {
          strengthFactors.push(`⚖️ Excellent LSAT score (${lsatScore.replace('-', ' - ')}) for law school`);
        }
      } else if (greQuant) {
        const quantScores = {
          'below-150': -15,
          '150-155': -5,
          '155-160': 5,
          '160-165': 15,
          '165-170': 25
        };
        const verbalScores = {
          'below-150': -10,
          '150-155': -3,
          '155-160': 3,
          '160-165': 10,
          '165-170': 15
        };
        
        testScore = (quantScores[greQuant] || 0) + (verbalScores[greVerbal] || 0);
        
        if (programType.includes('stem') && quantScores[greQuant] >= 15) {
          strengthFactors.push(`🔢 Strong GRE Quantitative (${greQuant.replace('-', ' - ')}) for STEM field`);
        }
        if (programType.includes('humanities') && verbalScores[greVerbal] >= 10) {
          strengthFactors.push(`📚 Strong GRE Verbal (${greVerbal.replace('-', ' - ')}) for humanities field`);
        }
      }
      
      acceptanceScore += testScore;
      
      // Research Experience (Critical for PhD, helpful for others)
      const researchScores = {
        'extensive': 25,
        'significant': 15,
        'some': 5,
        'minimal': -5,
        'none': -15
      };
      
      let researchImpact = researchScores[researchExperience] || 0;
      
      // Weight research experience more heavily for PhD programs
      if (programType.includes('phd')) {
        researchImpact *= 1.5;
      }
      
      acceptanceScore += researchImpact;
      
      if (researchImpact >= 20) {
        strengthFactors.push(`🔬 Excellent research experience - ${researchExperience} level`);
      } else if (researchImpact <= -10 && programType.includes('phd')) {
        weaknessFactors.push('🔬 Limited research experience for PhD program');
        recommendations.push('Gain research experience through volunteering in labs or independent projects');
      }
      
      // Publications (Very important for PhD, good for others)
      const pubScores = {
        'first-author': 20,
        'co-author': 12,
        'conference': 8,
        'submitted': 5,
        'none': 0
      };
      
      let pubImpact = pubScores[publications] || 0;
      if (programType.includes('phd')) {
        pubImpact *= 1.2;
      }
      
      acceptanceScore += pubImpact;
      
      if (pubImpact >= 15) {
        strengthFactors.push(`📄 Strong publication record - ${publications.replace('-', ' ')}`);
      }
      
      // Work Experience (Critical for MBA, varies for others)
      const workScores = {
        'highly-relevant': 15,
        'somewhat-relevant': 8,
        'general': 3,
        'internships': 1,
        'minimal': -2
      };
      
      let workImpact = workScores[workExperience] || 0;
      if (programType === 'mba') {
        workImpact *= 2; // Work experience much more important for MBA
      }
      
      acceptanceScore += workImpact;
      
      if (programType === 'mba' && workImpact >= 20) {
        strengthFactors.push(`💼 Strong work experience for MBA application`);
      } else if (programType === 'mba' && workImpact < 10) {
        weaknessFactors.push('💼 Limited work experience for MBA program');
        recommendations.push('Consider gaining more professional experience before applying to top MBA programs');
      }
      
      // Undergraduate School Prestige
      const schoolScores = {
        'top-tier': 15,
        'r1-research': 10,
        'good-state': 5,
        'regional': 0,
        'liberal-arts': 5,
        'community-college': -5,
        'international': 0
      };
      
      acceptanceScore += schoolScores[undergradSchool] || 0;
      
      // Academic Trend
      const trendScores = {
        'improving': 8,
        'stable-high': 5,
        'stable-average': 0,
        'declining': -10,
        'mixed': -2
      };
      
      acceptanceScore += trendScores[academicTrend] || 0;
      
      // Application Quality
      const sopScores = {
        'excellent': 15,
        'good': 8,
        'average': 0,
        'weak': -12,
        'not-written': -8
      };
      
      const recScores = {
        'outstanding': 15,
        'strong': 10,
        'good': 5,
        'average': 0,
        'weak': -10
      };
      
      const fitScores = {
        'excellent': 15,
        'good': 8,
        'decent': 3,
        'poor': -10,
        'unsure': -5
      };
      
      acceptanceScore += sopScores[sopQuality] || 0;
      acceptanceScore += recScores[recommendations] || 0;
      acceptanceScore += fitScores[programFit] || 0;
      
      if (sopQuality === 'excellent' && recommendations === 'outstanding') {
        strengthFactors.push('📄 Outstanding application materials - SOP and recommendations');
      }
      
      if (programFit === 'excellent') {
        strengthFactors.push('🎯 Excellent program fit - strong research/career alignment');
      } else if (programFit === 'poor') {
        weaknessFactors.push('🎯 Poor program fit - unclear alignment with goals');
        recommendations.push('Research programs more thoroughly to find better alignment');
      }
      
      // Bonus factors
      let bonusPoints = 0;
      if (honorsProgram) bonusPoints += 5;
      if (academicAwards) bonusPoints += 5;
      if (researchFunding) bonusPoints += 8;
      if (uniqueBackground) bonusPoints += 10;
      if (facultyContact && programType.includes('phd')) bonusPoints += 8;
      if (conferenceAttendance) bonusPoints += 3;
      if (entrepreneurship && programType === 'mba') bonusPoints += 8;
      
      acceptanceScore += bonusPoints;
      
      // University tier adjustment
      const tierMultipliers = {
        'top': 0.6,      // Much harder
        'high': 0.8,     // Harder
        'mid': 1.0,      // Standard
        'safety': 1.4,   // Easier
        'mixed': 1.0     // Average across tiers
      };
      
      acceptanceScore *= tierMultipliers[universityTier] || 1.0;
      
      // Program-specific adjustments
      const programDifficulty = {
        'phd-humanities': 0.7,    // Very competitive
        'phd-stem': 0.8,         // Competitive
        'masters-stem': 1.0,     // Standard
        'masters-humanities': 0.9, // Somewhat competitive
        'mba': 0.8,              // Competitive
        'law': 0.9,              // Competitive
        'medical': 0.6,          // Very competitive
        'professional': 0.9      // Competitive
      };
      
      acceptanceScore *= programDifficulty[programType] || 1.0;
      
      // Cap between 5% and 95%
      acceptanceScore = Math.max(5, Math.min(95, Math.round(acceptanceScore)));
      
      // Generate tier-specific predictions
      const tierPredictions = generateTierPredictions(acceptanceScore, universityTier);
      
      // Generate improvement recommendations
      const improvements = generateImprovements(
        acceptanceScore, gpa, researchExperience, publications, 
        workExperience, sopQuality, recommendations, programType
      );
      
      // Determine overall assessment
      let assessmentLevel = '';
      let cardClass = '';
      let assessmentMessage = '';
      
      if (acceptanceScore >= 80) {
        assessmentLevel = 'Excellent Chances';
        cardClass = 'success';
        assessmentMessage = 'You have very strong chances across your target programs!';
      } else if (acceptanceScore >= 65) {
        assessmentLevel = 'Good Chances';
        cardClass = 'success';
        assessmentMessage = 'You have solid chances with a well-balanced application strategy.';
      } else if (acceptanceScore >= 45) {
        assessmentLevel = 'Moderate Chances';
        cardClass = 'info';
        assessmentMessage = 'You have reasonable chances but should include safety schools.';
      } else if (acceptanceScore >= 25) {
        assessmentLevel = 'Lower Chances';
        cardClass = 'warning';
        assessmentMessage = 'Consider improving your profile or adjusting your school list.';
      } else {
        assessmentLevel = 'Need Improvement';
        cardClass = 'warning';
        assessmentMessage = 'Focus on strengthening your application before applying.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🎯 Acceptance Rate</h6>
            <div class="big-number">${acceptanceScore}%</div>
            <p class="insight-detail">${assessmentLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🎓 Program Type</h6>
            <div class="big-number">${getProgramEmoji(programType)}</div>
            <p class="insight-detail">${getProgramName(programType)}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🏫 Target Tier</h6>
            <div class="big-number">${getTierEmoji(universityTier)}</div>
            <p class="insight-detail">${universityTier.charAt(0).toUpperCase() + universityTier.slice(1)} Tier</p>
          </div>
          
          <div class="insight-card info">
            <h6>📚 Field</h6>
            <div class="big-number">${getFieldEmoji(field)}</div>
            <p class="insight-detail">${field.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Admission Assessment</h4>
          <p><strong>${assessmentMessage}</strong></p>
        </div>`;
      
      // Add tier predictions
      if (tierPredictions.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🎯 Predictions by University Tier</h4>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">`;
        
        tierPredictions.forEach(prediction => {
          const predictionClass = prediction.rate >= 60 ? 'success' : prediction.rate >= 30 ? 'info' : 'warning';
          resultHTML += `
            <div class="insight-card ${predictionClass}">
              <h6>${prediction.tier}</h6>
              <div class="big-number">${prediction.rate}%</div>
              <p class="insight-detail">${prediction.description}</p>
            </div>`;
        });
        
        resultHTML += `</div></div>`;
      }
      
      // Add strength factors
      if (strengthFactors.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💪 Application Strengths</h4>
            <ul>`;
        strengthFactors.forEach(strength => {
          resultHTML += `<li>${strength}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add weakness factors
      if (weaknessFactors.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Areas for Improvement</h4>
            <ul>`;
        weaknessFactors.forEach(weakness => {
          resultHTML += `<li>${weakness}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add improvement recommendations
      if (improvements.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🚀 Recommendations to Improve Chances</h4>
            <ul>`;
        improvements.forEach(improvement => {
          resultHTML += `<li>${improvement}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add application strategy
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📋 Application Strategy Recommendations</h4>
          ${getApplicationStrategy(acceptanceScore, universityTier, programType)}
        </div>`;
      
      // Add timeline
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📅 Application Timeline</h4>
          <ul>
            <li><strong>12+ months before:</strong> Research programs, prepare for standardized tests, gain experience</li>
            <li><strong>8-12 months before:</strong> Take tests, request transcripts, identify recommenders</li>
            <li><strong>4-8 months before:</strong> Draft statements, contact faculty (for PhD), finalize school list</li>
            <li><strong>2-4 months before:</strong> Submit applications, request recommendations, prepare for interviews</li>
            <li><strong>Application season:</strong> Complete interviews, submit any additional materials</li>
          </ul>
        </div>`;
      
      // Add disclaimer
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
          <h4>⚠️ Important Notes</h4>
          <p>These predictions are estimates based on typical admission patterns and should be used as guidance only. Actual admission decisions depend on many factors including program fit, application quality, year-specific competition, and subjective evaluation. Always apply to a range of programs and have backup plans.</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function generateTierPredictions(baseScore, currentTier) {
    const predictions = [];
    
    if (currentTier === 'mixed') {
      predictions.push({
        tier: '🏆 Top Tier Schools',
        rate: Math.round(baseScore * 0.6),
        description: 'Reach schools - apply to 2-3'
      });
      predictions.push({
        tier: '⭐ High Tier Schools',
        rate: Math.round(baseScore * 0.8),
        description: 'Target schools - apply to 4-6'
      });
      predictions.push({
        tier: '📚 Mid Tier Schools',
        rate: Math.round(baseScore * 1.0),
        description: 'Match schools - apply to 3-4'
      });
      predictions.push({
        tier: '🎯 Safety Schools',
        rate: Math.round(Math.min(baseScore * 1.4, 90)),
        description: 'Safety schools - apply to 2-3'
      });
    }
    
    return predictions;
  }
  
  function generateImprovements(score, gpa, research, publications, work, sop, recs, programType) {
    const improvements = [];
    
    if (score < 60) {
      if (gpa.includes('below-3.0') || gpa.includes('3.0-3.2')) {
        improvements.push('📈 Consider taking additional courses to improve GPA or pursue a post-baccalaureate program');
      }
      
      if (research === 'none' || research === 'minimal') {
        improvements.push('🔬 Gain research experience through volunteering in labs, independent study, or research programs');
      }
      
      if (publications === 'none' && programType.includes('phd')) {
        improvements.push('📄 Work toward getting research published or presented at conferences');
      }
      
      if (work === 'minimal' && programType === 'mba') {
        improvements.push('💼 Gain more professional work experience before applying to competitive MBA programs');
      }
      
      if (sop === 'weak' || sop === 'not-written') {
        improvements.push('📝 Invest significant time in crafting compelling personal statements that show clear fit');
      }
      
      if (recs === 'weak' || recs === 'average') {
        improvements.push('🤝 Build stronger relationships with faculty/supervisors who can write detailed recommendations');
      }
    }
    
    improvements.push('🎯 Apply to a range of programs including reach, target, and safety schools');
    improvements.push('📞 For PhD programs, contact potential advisors to discuss research fit');
    improvements.push('🔍 Thoroughly research each program to demonstrate genuine interest and fit');
    
    return improvements;
  }
  
  function getApplicationStrategy(score, tier, programType) {
    if (score >= 70) {
      return `
        <p><strong>Strong Candidate Strategy:</strong></p>
        <ul>
          <li>Apply to 8-12 programs including several top-tier schools</li>
          <li>Focus on programs that align well with your interests and goals</li>
          <li>Use your strong profile to negotiate for funding/assistantships</li>
          <li>Consider applying for external fellowships and scholarships</li>
        </ul>
      `;
    } else if (score >= 45) {
      return `
        <p><strong>Balanced Strategy:</strong></p>
        <ul>
          <li>Apply to 10-15 programs across different tiers</li>
          <li>Include more mid-tier and safety schools in your mix</li>
          <li>Spend extra time on fit and personalization for each application</li>
          <li>Consider applying to programs with higher acceptance rates</li>
        </ul>
      `;
    } else {
      return `
        <p><strong>Conservative Strategy:</strong></p>
        <ul>
          <li>Focus on improving your profile before applying to top programs</li>
          <li>Apply primarily to mid-tier and safety schools</li>
          <li>Consider taking a gap year to strengthen your application</li>
          <li>Look into less competitive programs or alternative pathways</li>
        </ul>
      `;
    }
  }
  
  function getProgramEmoji(program) {
    const emojis = {
      'phd-stem': '🔬',
      'phd-humanities': '📚',
      'masters-stem': '⚙️',
      'masters-humanities': '📖',
      'mba': '💼',
      'law': '⚖️',
      'medical': '🩺',
      'professional': '🎓'
    };
    return emojis[program] || '🎓';
  }
  
  function getProgramName(program) {
    const names = {
      'phd-stem': 'PhD STEM',
      'phd-humanities': 'PhD Humanities',
      'masters-stem': 'Masters STEM',
      'masters-humanities': 'Masters Humanities',
      'mba': 'MBA',
      'law': 'Law School',
      'medical': 'Medical School',
      'professional': 'Professional'
    };
    return names[program] || 'Graduate';
  }
  
  function getTierEmoji(tier) {
    const emojis = {
      'top': '🏆',
      'high': '⭐',
      'mid': '🎓',
      'safety': '🎯',
      'mixed': '🎭'
    };
    return emojis[tier] || '🏫';
  }
  
  function getFieldEmoji(field) {
    const emojis = {
      'computer-science': '💻',
      'engineering': '⚙️',
      'biology-life-sciences': '🧬',
      'chemistry': '⚗️',
      'physics': '⚛️',
      'mathematics': '🔢',
      'psychology': '🧠',
      'economics': '📊',
      'business': '💼',
      'english': '📚',
      'history': '📜',
      'political-science': '🏛️',
      'sociology': '👥',
      'education': '🎓',
      'public-policy': '📋'
    };
    return emojis[field] || '📚';
  }
});