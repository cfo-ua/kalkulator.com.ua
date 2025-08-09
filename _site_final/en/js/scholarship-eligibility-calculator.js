document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('scholarship-form');
  const result = document.getElementById('scholarship-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const educationLevel = document.getElementById('education-level').value;
      const gpa = document.getElementById('gpa').value;
      const field = document.getElementById('field').value;
      const satScore = document.getElementById('sat-score').value;
      const greScore = document.getElementById('gre-score').value;
      const englishScore = document.getElementById('english-score').value;
      const familyIncome = document.getElementById('family-income').value;
      const financialNeed = document.getElementById('financial-need').value;
      const origin = document.getElementById('origin').value;
      const gender = document.getElementById('gender').value;
      const leadership = document.getElementById('leadership').value;
      const volunteering = document.getElementById('volunteering').value;
      const experience = document.getElementById('experience').value;
      
      // Check additional factors
      const isFirstGeneration = document.getElementById('first-generation').checked;
      const isMinority = document.getElementById('minority').checked;
      const hasAwards = document.getElementById('awards').checked;
      const hasCompetitions = document.getElementById('competitions').checked;
      const hasSports = document.getElementById('sports').checked;
      
      // Validation
      if (!educationLevel || !gpa || !field || !englishScore || !familyIncome || !financialNeed || !origin || !gender || !leadership || !volunteering || !experience) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Calculate scholarship eligibility scores
      let meritScore = 0;
      let needScore = 0;
      let diversityScore = 0;
      let leadershipScore = 0;
      
      let tips = [];
      let warnings = [];
      let recommendations = [];
      
      // Academic Performance (Merit) - 40% weight
      const gpaScores = {
        'below3': 10,
        '3.0-3.3': 25,
        '3.3-3.6': 40,
        '3.6-3.8': 70,
        'above3.8': 100
      };
      meritScore += (gpaScores[gpa] || 0) * 0.4;
      
      if (gpaScores[gpa] < 40) {
        warnings.push("📚 GPA below 3.3 may limit merit scholarship opportunities");
        tips.push("Focus on improving academic performance and consider taking additional courses");
      }
      
      // Standardized Test Scores (Merit) - 30% weight
      let testScore = 0;
      if (satScore) {
        const satScores = {
          'below1200': 20,
          '1200-1350': 40,
          '1350-1450': 60,
          '1450-1550': 80,
          'above1550': 100
        };
        testScore = Math.max(testScore, satScores[satScore] || 0);
      }
      
      if (greScore) {
        const greScores = {
          'below310': 20,
          '310-320': 50,
          '320-330': 75,
          'above330': 100
        };
        testScore = Math.max(testScore, greScores[greScore] || 0);
      }
      
      meritScore += testScore * 0.3;
      
      // English Proficiency - 20% weight for international students
      const englishScores = {
        'low': 30,
        'good': 60,
        'high': 80,
        'excellent': 100
      };
      meritScore += (englishScores[englishScore] || 0) * 0.2;
      
      if (englishScore === 'low') {
        warnings.push("🗣️ Low English scores may limit scholarship options");
        tips.push("Consider retaking IELTS/TOEFL to improve scores above 7.0/100");
      }
      
      // Field-specific bonus (STEM gets preference)
      const fieldMultipliers = {
        'stem': 1.2,
        'medicine': 1.15,
        'business': 1.0,
        'education': 1.1,
        'social-sciences': 0.95,
        'humanities': 0.9,
        'arts': 0.9,
        'law': 1.0
      };
      meritScore *= (fieldMultipliers[field] || 1.0);
      
      // Financial Need Score
      const incomeScores = {
        'under10k': 100,
        '10k-25k': 85,
        '25k-50k': 65,
        '50k-100k': 35,
        'over100k': 10
      };
      
      const needScores = {
        'high': 100,
        'moderate': 70,
        'low': 40,
        'none': 5
      };
      
      needScore = ((incomeScores[familyIncome] || 0) + (needScores[financialNeed] || 0)) / 2;
      
      // Diversity Score
      const originScores = {
        'africa': 90,
        'south-america': 80,
        'middle-east': 75,
        'asia': 60,
        'eastern-europe': 65,
        'other-developing': 85,
        'developed': 30
      };
      diversityScore += (originScores[origin] || 0) * 0.4;
      
      // Gender diversity (especially for STEM)
      if (gender === 'female' && (field === 'stem' || field === 'business')) {
        diversityScore += 20;
        recommendations.push("🚀 Women in STEM/Business scholarships are widely available");
      }
      
      // First-generation bonus
      if (isFirstGeneration) {
        diversityScore += 15;
        recommendations.push("🎓 First-generation student scholarships are available");
      }
      
      // Minority status bonus
      if (isMinority) {
        diversityScore += 15;
        recommendations.push("🌟 Diversity and inclusion scholarships target underrepresented groups");
      }
      
      diversityScore = Math.min(diversityScore, 100);
      
      // Leadership & Extracurricular Score
      const leadershipScores = {
        'none': 10,
        'some': 40,
        'significant': 70,
        'exceptional': 100
      };
      
      const volunteeringScores = {
        'none': 5,
        'occasional': 30,
        'regular': 60,
        'extensive': 90
      };
      
      const experienceScores = {
        'none': 10,
        'internships': 40,
        'research': 70,
        'publications': 100
      };
      
      leadershipScore = (
        (leadershipScores[leadership] || 0) * 0.4 +
        (volunteeringScores[volunteering] || 0) * 0.3 +
        (experienceScores[experience] || 0) * 0.3
      );
      
      // Additional achievements bonus
      let achievementBonus = 0;
      if (hasAwards) achievementBonus += 15;
      if (hasCompetitions) achievementBonus += 10;
      if (hasSports) achievementBonus += 10;
      
      leadershipScore = Math.min(leadershipScore + achievementBonus, 100);
      
      if (leadershipScore < 30) {
        tips.push("Start volunteering or taking leadership roles to strengthen applications");
      }
      
      // Calculate overall scores for different scholarship types
      const meritEligibility = Math.round(meritScore);
      const needEligibility = Math.round(needScore);
      const diversityEligibility = Math.round(diversityScore);
      const leadershipEligibility = Math.round(leadershipScore);
      
      // Overall composite score
      const overallScore = Math.round(
        meritScore * 0.35 + 
        needScore * 0.25 + 
        diversityScore * 0.2 + 
        leadershipScore * 0.2
      );
      
      // Generate specific scholarship recommendations
      const scholarshipTypes = getScholarshipRecommendations(
        meritEligibility, needEligibility, diversityEligibility, 
        leadershipEligibility, field, origin, educationLevel
      );
      
      // Generate result
      let overallLevel = '';
      let cardClass = '';
      let mainRecommendation = '';
      
      if (overallScore >= 80) {
        overallLevel = 'Excellent';
        cardClass = 'success';
        mainRecommendation = 'You have excellent scholarship prospects! Apply to competitive scholarships and consider prestigious programs.';
      } else if (overallScore >= 65) {
        overallLevel = 'Good';
        cardClass = 'info';
        mainRecommendation = 'You have good scholarship potential. Target multiple scholarship types to maximize success.';
      } else if (overallScore >= 50) {
        overallLevel = 'Fair';
        cardClass = 'warning';
        mainRecommendation = 'You have fair chances. Focus on improving weak areas and apply to less competitive scholarships.';
      } else {
        overallLevel = 'Improving';
        cardClass = 'warning';
        mainRecommendation = 'Work on strengthening your profile before applying to increase success chances significantly.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🎯 Overall Score</h6>
            <div class="big-number">${overallScore}%</div>
            <p class="insight-detail">${overallLevel} Prospects</p>
          </div>
          
          <div class="insight-card info">
            <h6>🏆 Merit Score</h6>
            <div class="big-number">${meritEligibility}%</div>
            <p class="insight-detail">Academic Excellence</p>
          </div>
          
          <div class="insight-card info">
            <h6>💰 Need Score</h6>
            <div class="big-number">${needEligibility}%</div>
            <p class="insight-detail">Financial Need</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌟 Diversity Score</h6>
            <div class="big-number">${diversityEligibility}%</div>
            <p class="insight-detail">Background Factors</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Assessment Summary</h4>
          <p><strong>${mainRecommendation}</strong></p>
        </div>`;
      
      // Add scholarship type recommendations
      if (scholarshipTypes.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🎯 Recommended Scholarship Types</h4>
            <ul>`;
        scholarshipTypes.forEach(type => {
          resultHTML += `<li><strong>${type.name}:</strong> ${type.description}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add specific recommendations
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Specific Opportunities</h4>
            <ul>`;
        recommendations.forEach(rec => {
          resultHTML += `<li>${rec}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add warnings if any
      if (warnings.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Areas for Improvement</h4>
            <ul>`;
        warnings.forEach(warning => {
          resultHTML += `<li>${warning}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add tips if any
      if (tips.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Improvement Tips</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add application timeline
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📅 Application Timeline Tips</h4>
          <ul>
            <li><strong>12-18 months before:</strong> Research scholarships, improve test scores</li>
            <li><strong>6-12 months before:</strong> Prepare essays, gather documents, request recommendations</li>
            <li><strong>3-6 months before:</strong> Submit applications, follow up requirements</li>
            <li><strong>1-3 months before:</strong> Interviews, final document submissions</li>
          </ul>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getScholarshipRecommendations(merit, need, diversity, leadership, field, origin, level) {
    const recommendations = [];
    
    // Merit-based scholarships
    if (merit >= 70) {
      recommendations.push({
        name: "Merit-Based Scholarships",
        description: "Academic excellence scholarships, university honors programs, National Merit scholarships"
      });
    }
    
    // Need-based scholarships
    if (need >= 60) {
      recommendations.push({
        name: "Need-Based Financial Aid",
        description: "Federal/state grants, institutional need-based aid, emergency assistance funds"
      });
    }
    
    // Diversity scholarships
    if (diversity >= 65) {
      recommendations.push({
        name: "Diversity & Inclusion Scholarships",
        description: "Minority scholarships, international student funds, first-generation student aid"
      });
    }
    
    // Leadership scholarships
    if (leadership >= 60) {
      recommendations.push({
        name: "Leadership Scholarships",
        description: "Community service awards, student government scholarships, leadership development programs"
      });
    }
    
    // Field-specific recommendations
    if (field === 'stem') {
      recommendations.push({
        name: "STEM Scholarships",
        description: "NSF fellowships, industry-sponsored programs, women in STEM awards"
      });
    }
    
    if (field === 'business') {
      recommendations.push({
        name: "Business Scholarships",
        description: "MBA scholarships, entrepreneurship awards, corporate sponsorship programs"
      });
    }
    
    // Country-specific
    if (['africa', 'south-america', 'asia'].includes(origin)) {
      recommendations.push({
        name: "Developing Country Scholarships",
        description: "World Bank scholarships, Fulbright Foreign Student Program, government exchange programs"
      });
    }
    
    // Level-specific
    if (level === 'phd') {
      recommendations.push({
        name: "Graduate Research Fellowships",
        description: "Research assistantships, NSF Graduate Research Fellowship, dissertation grants"
      });
    }
    
    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }
});