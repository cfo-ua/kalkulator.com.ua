document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('career-salary-form');
  const result = document.getElementById('career-salary-result');
  const careerFieldSelect = document.getElementById('career-field');
  const specificRoleSelect = document.getElementById('specific-role');
  
  // Role options by career field
  const rolesByField = {
    'technology': [
      { value: 'software-engineer', text: 'Software Engineer/Developer' },
      { value: 'data-scientist', text: 'Data Scientist' },
      { value: 'ai-ml-engineer', text: 'AI/Machine Learning Engineer' },
      { value: 'cybersecurity', text: 'Cybersecurity Specialist' },
      { value: 'product-manager', text: 'Product Manager' },
      { value: 'devops', text: 'DevOps Engineer' },
      { value: 'ui-ux', text: 'UI/UX Designer' },
      { value: 'cloud-architect', text: 'Cloud Architect' }
    ],
    'healthcare': [
      { value: 'physician-family', text: 'Family Medicine Physician' },
      { value: 'physician-specialist', text: 'Medical Specialist' },
      { value: 'surgeon', text: 'Surgeon' },
      { value: 'nurse-rn', text: 'Registered Nurse (RN)' },
      { value: 'nurse-practitioner', text: 'Nurse Practitioner' },
      { value: 'physician-assistant', text: 'Physician Assistant' },
      { value: 'pharmacist', text: 'Pharmacist' },
      { value: 'physical-therapist', text: 'Physical Therapist' }
    ],
    'engineering': [
      { value: 'software-engineer', text: 'Software Engineer' },
      { value: 'electrical-engineer', text: 'Electrical Engineer' },
      { value: 'mechanical-engineer', text: 'Mechanical Engineer' },
      { value: 'civil-engineer', text: 'Civil Engineer' },
      { value: 'chemical-engineer', text: 'Chemical Engineer' },
      { value: 'aerospace-engineer', text: 'Aerospace Engineer' },
      { value: 'biomedical-engineer', text: 'Biomedical Engineer' }
    ],
    'finance': [
      { value: 'investment-banker', text: 'Investment Banker' },
      { value: 'financial-analyst', text: 'Financial Analyst' },
      { value: 'actuary', text: 'Actuary' },
      { value: 'accountant', text: 'Accountant/CPA' },
      { value: 'financial-advisor', text: 'Financial Advisor' },
      { value: 'quant-analyst', text: 'Quantitative Analyst' },
      { value: 'risk-manager', text: 'Risk Manager' }
    ],
    'legal': [
      { value: 'corporate-lawyer', text: 'Corporate Lawyer' },
      { value: 'litigation-lawyer', text: 'Litigation Lawyer' },
      { value: 'public-defender', text: 'Public Defender' },
      { value: 'paralegal', text: 'Paralegal' },
      { value: 'legal-consultant', text: 'Legal Consultant' }
    ],
    'education': [
      { value: 'k12-teacher', text: 'K-12 Teacher' },
      { value: 'professor', text: 'College Professor' },
      { value: 'principal', text: 'School Principal' },
      { value: 'education-admin', text: 'Education Administrator' },
      { value: 'counselor', text: 'School Counselor' }
    ],
    'pharmaceutical': [
      { value: 'research-scientist', text: 'Research Scientist' },
      { value: 'clinical-researcher', text: 'Clinical Researcher' },
      { value: 'regulatory-affairs', text: 'Regulatory Affairs' },
      { value: 'biotech-engineer', text: 'Biotechnology Engineer' }
    ],
    'consulting': [
      { value: 'management-consultant', text: 'Management Consultant' },
      { value: 'strategy-consultant', text: 'Strategy Consultant' },
      { value: 'it-consultant', text: 'IT Consultant' },
      { value: 'business-analyst', text: 'Business Analyst' }
    ],
    'marketing': [
      { value: 'marketing-manager', text: 'Marketing Manager' },
      { value: 'sales-rep', text: 'Sales Representative' },
      { value: 'digital-marketer', text: 'Digital Marketing Specialist' },
      { value: 'brand-manager', text: 'Brand Manager' }
    ],
    'construction': [
      { value: 'architect', text: 'Architect' },
      { value: 'project-manager', text: 'Construction Project Manager' },
      { value: 'civil-engineer', text: 'Civil Engineer' },
      { value: 'contractor', text: 'General Contractor' }
    ]
  };
  
  // Update role options when career field changes
  careerFieldSelect.addEventListener('change', function() {
    const selectedField = this.value;
    const roles = rolesByField[selectedField] || [];
    
    // Clear current options
    specificRoleSelect.innerHTML = '<option value="">Select role...</option>';
    
    // Add new options
    roles.forEach(role => {
      const option = document.createElement('option');
      option.value = role.value;
      option.textContent = role.text;
      specificRoleSelect.appendChild(option);
    });
  });
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const careerField = document.getElementById('career-field').value;
      const specificRole = document.getElementById('specific-role').value;
      const industry = document.getElementById('industry').value;
      const educationLevel = document.getElementById('education-level').value;
      const experienceYears = document.getElementById('experience-years').value;
      const careerLevel = document.getElementById('career-level').value;
      const location = document.getElementById('location').value;
      const companySize = document.getElementById('company-size').value;
      const workArrangement = document.getElementById('work-arrangement').value;
      const careerGoal = document.getElementById('career-goal').value;
      const riskTolerance = document.getElementById('risk-tolerance').value;
      const timeline = document.getElementById('timeline').value;
      
      // Check additional factors
      const professionalCerts = document.getElementById('professional-certs').checked;
      const advancedSkills = document.getElementById('advanced-skills').checked;
      const leadershipExperience = document.getElementById('leadership-experience').checked;
      const willingRelocate = document.getElementById('willing-relocate').checked;
      const consideringCareerChange = document.getElementById('considering-career-change').checked;
      const interestedManagement = document.getElementById('interested-management').checked;
      
      // Validation
      if (!careerField || !specificRole || !industry || !educationLevel || !experienceYears || !careerLevel || !location || !companySize || !workArrangement || !careerGoal || !riskTolerance || !timeline) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Base salary data by role (in thousands, for mid-level)
      const baseSalaries = {
        'software-engineer': 95,
        'data-scientist': 110,
        'ai-ml-engineer': 130,
        'cybersecurity': 105,
        'product-manager': 120,
        'devops': 100,
        'ui-ux': 85,
        'cloud-architect': 140,
        'physician-family': 220,
        'physician-specialist': 350,
        'surgeon': 400,
        'nurse-rn': 75,
        'nurse-practitioner': 110,
        'physician-assistant': 115,
        'pharmacist': 125,
        'physical-therapist': 85,
        'electrical-engineer': 85,
        'mechanical-engineer': 80,
        'civil-engineer': 75,
        'chemical-engineer': 90,
        'aerospace-engineer': 95,
        'biomedical-engineer': 88,
        'investment-banker': 150,
        'financial-analyst': 75,
        'actuary': 105,
        'accountant': 65,
        'financial-advisor': 85,
        'quant-analyst': 140,
        'risk-manager': 95,
        'corporate-lawyer': 160,
        'litigation-lawyer': 140,
        'public-defender': 65,
        'paralegal': 50,
        'legal-consultant': 110,
        'k12-teacher': 50,
        'professor': 85,
        'principal': 95,
        'education-admin': 75,
        'counselor': 55,
        'research-scientist': 95,
        'clinical-researcher': 105,
        'regulatory-affairs': 100,
        'biotech-engineer': 90,
        'management-consultant': 130,
        'strategy-consultant': 140,
        'it-consultant': 95,
        'business-analyst': 75,
        'marketing-manager': 75,
        'sales-rep': 65,
        'digital-marketer': 65,
        'brand-manager': 85,
        'architect': 80,
        'project-manager': 85,
        'contractor': 70
      };
      
      let baseSalary = baseSalaries[specificRole] || 70;
      
      // Experience multipliers
      const experienceMultipliers = {
        '0': 0.7,
        '1-2': 0.85,
        '3-5': 1.0,
        '6-10': 1.25,
        '11-15': 1.5,
        '16-20': 1.7,
        '20+': 1.9
      };
      
      baseSalary *= experienceMultipliers[experienceYears] || 1.0;
      
      // Education multipliers
      const educationMultipliers = {
        'high-school': 0.8,
        'associate': 0.9,
        'bachelors': 1.0,
        'masters': 1.15,
        'phd': 1.3,
        'professional': 1.5,
        'bootcamp': 0.95
      };
      
      baseSalary *= educationMultipliers[educationLevel] || 1.0;
      
      // Career level adjustments
      const careerLevelMultipliers = {
        'entry': 0.8,
        'mid': 1.0,
        'senior': 1.3,
        'lead': 1.5,
        'manager': 1.4,
        'director': 1.8,
        'executive': 2.5
      };
      
      baseSalary *= careerLevelMultipliers[careerLevel] || 1.0;
      
      // Location adjustments
      const locationMultipliers = {
        'sf-bay': 1.6,
        'nyc': 1.4,
        'seattle': 1.3,
        'los-angeles': 1.25,
        'boston': 1.2,
        'washington-dc': 1.15,
        'chicago': 1.1,
        'austin': 1.05,
        'denver': 1.0,
        'atlanta': 0.95,
        'other-major': 0.9,
        'mid-size': 0.8,
        'small-city': 0.7,
        'remote': 1.1
      };
      
      baseSalary *= locationMultipliers[location] || 1.0;
      
      // Company size adjustments
      const companySizeMultipliers = {
        'startup': 0.9,
        'small': 0.95,
        'medium': 1.0,
        'large': 1.1,
        'enterprise': 1.15,
        'government': 0.85
      };
      
      baseSalary *= companySizeMultipliers[companySize] || 1.0;
      
      // Industry adjustments
      const industryMultipliers = {
        'tech-startup': 1.0,
        'tech-large': 1.2,
        'healthcare-hospital': 1.0,
        'healthcare-private': 1.1,
        'financial-services': 1.15,
        'consulting': 1.1,
        'government': 0.8,
        'non-profit': 0.7,
        'manufacturing': 0.9,
        'retail': 0.85,
        'energy': 1.05,
        'other': 1.0
      };
      
      baseSalary *= industryMultipliers[industry] || 1.0;
      
      // Skill bonuses
      let skillBonus = 0;
      if (professionalCerts) skillBonus += 0.08;
      if (advancedSkills) skillBonus += 0.12;
      if (leadershipExperience) skillBonus += 0.1;
      
      baseSalary *= (1 + skillBonus);
      
      // Calculate current salary estimate
      const currentSalary = Math.round(baseSalary * 1000);
      
      // Calculate salary ranges
      const salaryRange = {
        low: Math.round(currentSalary * 0.85),
        high: Math.round(currentSalary * 1.25)
      };
      
      // Calculate 5-year projection
      const yearlyGrowthRate = careerField === 'technology' ? 0.08 : 
                             careerField === 'healthcare' ? 0.06 :
                             careerField === 'finance' ? 0.07 : 0.05;
      
      const fiveYearSalary = Math.round(currentSalary * Math.pow(1 + yearlyGrowthRate, 5));
      
      // Generate career insights
      const careerInsights = generateCareerInsights(specificRole, careerField, careerLevel, careerGoal);
      const recommendations = generateRecommendations(specificRole, careerField, careerLevel, advancedSkills, interestedManagement);
      
      // Calculate total compensation estimate
      const totalCompensation = calculateTotalCompensation(currentSalary, companySize, careerLevel, industry);
      
      // Determine salary competitiveness
      let competitivenessLevel = '';
      let cardClass = '';
      let competitivenessMessage = '';
      
      if (currentSalary >= 150000) {
        competitivenessLevel = 'Excellent';
        cardClass = 'success';
        competitivenessMessage = 'Your estimated salary is in the top tier for your field and experience level.';
      } else if (currentSalary >= 100000) {
        competitivenessLevel = 'Very Good';
        cardClass = 'success';
        competitivenessMessage = 'Your estimated salary is above average and competitive in the market.';
      } else if (currentSalary >= 70000) {
        competitivenessLevel = 'Good';
        cardClass = 'info';
        competitivenessMessage = 'Your estimated salary is solid and in line with market averages.';
      } else if (currentSalary >= 50000) {
        competitivenessLevel = 'Fair';
        cardClass = 'info';
        competitivenessMessage = 'Your estimated salary is reasonable but has room for growth.';
      } else {
        competitivenessLevel = 'Below Average';
        cardClass = 'warning';
        competitivenessMessage = 'Consider strategies to increase your earning potential.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>💰 Est. Annual Salary</h6>
            <div class="big-number">$${currentSalary.toLocaleString()}</div>
            <p class="insight-detail">${competitivenessLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>📈 5-Year Projection</h6>
            <div class="big-number">$${fiveYearSalary.toLocaleString()}</div>
            <p class="insight-detail">${Math.round(((fiveYearSalary/currentSalary - 1) * 100))}% Growth</p>
          </div>
          
          <div class="insight-card info">
            <h6>💼 Total Compensation</h6>
            <div class="big-number">$${totalCompensation.toLocaleString()}</div>
            <p class="insight-detail">Including Benefits</p>
          </div>
          
          <div class="insight-card info">
            <h6>📊 Salary Range</h6>
            <div class="big-number">±20%</div>
            <p class="insight-detail">$${salaryRange.low.toLocaleString()} - $${salaryRange.high.toLocaleString()}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Salary Assessment</h4>
          <p><strong>${competitivenessMessage}</strong></p>
        </div>`;
      
      // Add career insights
      if (careerInsights.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Career Insights for ${careerInsights[0].role}</h4>
            <ul>`;
        careerInsights.forEach(insight => {
          if (insight.description) {
            resultHTML += `<li>${insight.description}</li>`;
          }
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add detailed breakdown
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🔍 Salary Breakdown Factors</h4>
          <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>Base Role Salary</span>
              <span><strong>$${Math.round(baseSalaries[specificRole] * 1000).toLocaleString()}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>Experience Adjustment</span>
              <span><strong>${((experienceMultipliers[experienceYears] - 1) * 100).toFixed(0)}%</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>Location Adjustment</span>
              <span><strong>${((locationMultipliers[location] - 1) * 100).toFixed(0)}%</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>Education Bonus</span>
              <span><strong>${((educationMultipliers[educationLevel] - 1) * 100).toFixed(0)}%</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>Skills & Certs Bonus</span>
              <span><strong>${(skillBonus * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        </div>`;
      
      // Add recommendations
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🚀 Career Growth Recommendations</h4>
            <ul>`;
        recommendations.forEach(rec => {
          resultHTML += `<li>${rec}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add market insights
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📈 Market Insights & Trends</h4>
          ${getMarketInsights(careerField, specificRole)}
        </div>`;
      
      // Add negotiation tips
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>💼 Salary Negotiation Tips</h4>
          <ul>
            <li><strong>📊 Research thoroughly:</strong> Use multiple salary sources and local market data</li>
            <li><strong>🎯 Focus on total compensation:</strong> Consider benefits, stock options, bonuses</li>
            <li><strong>📈 Highlight achievements:</strong> Quantify your impact and unique value</li>
            <li><strong>⏰ Time it right:</strong> Negotiate during performance reviews or job offers</li>
            <li><strong>🤝 Be professional:</strong> Present data-driven requests respectfully</li>
            <li><strong>🔄 Consider alternatives:</strong> Flexible work, professional development, promotion timeline</li>
          </ul>
        </div>`;
      
      // Add disclaimer
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
          <h4>⚠️ Important Notes</h4>
          <p>These estimates are based on current market data and industry averages. Actual salaries vary significantly based on specific companies, individual performance, negotiation skills, and market conditions. Always research specific companies and roles for accurate compensation information.</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function generateCareerInsights(role, field, level, goal) {
    const insights = [];
    
    if (field === 'technology') {
      insights.push({
        role: 'Technology Professional',
        description: 'Tech sector offers excellent growth potential with remote work opportunities and stock compensation'
      });
      
      if (role === 'data-scientist') {
        insights.push({
          description: 'Data science demand is growing 15% annually, with AI/ML skills commanding premium salaries'
        });
      }
    }
    
    if (field === 'healthcare') {
      insights.push({
        role: 'Healthcare Professional',
        description: 'Healthcare offers job security and societal impact, with growing demand due to aging population'
      });
    }
    
    return insights;
  }
  
  function generateRecommendations(role, field, level, hasAdvancedSkills, interestedManagement) {
    const recommendations = [];
    
    if (field === 'technology' && !hasAdvancedSkills) {
      recommendations.push('🔧 Develop specialized skills in AI/ML, cloud computing, or cybersecurity for 15-30% salary boost');
    }
    
    if (level === 'entry' || level === 'mid') {
      recommendations.push('📜 Obtain relevant certifications to increase marketability and salary potential');
    }
    
    if (interestedManagement && level === 'senior') {
      recommendations.push('👥 Develop leadership skills and seek management opportunities for career advancement');
    }
    
    recommendations.push('🌐 Consider remote work opportunities to access higher-paying markets');
    recommendations.push('📈 Track industry salary trends and negotiate annually based on performance');
    
    return recommendations;
  }
  
  function calculateTotalCompensation(baseSalary, companySize, careerLevel, industry) {
    let multiplier = 1.2; // Base 20% for benefits
    
    // Company size affects total comp
    if (companySize === 'startup') multiplier += 0.1; // Equity potential
    if (companySize === 'large' || companySize === 'enterprise') multiplier += 0.15; // Better benefits
    
    // Industry affects total comp
    if (industry === 'tech-large') multiplier += 0.2; // Stock options
    if (industry === 'financial-services') multiplier += 0.15; // Bonuses
    
    // Career level affects total comp
    if (careerLevel === 'director' || careerLevel === 'executive') multiplier += 0.3; // Equity, bonuses
    
    return Math.round(baseSalary * multiplier);
  }
  
  function getMarketInsights(field, role) {
    const insights = {
      'technology': `
        <ul>
          <li><strong>🚀 High Growth:</strong> Tech salaries growing 8-12% annually</li>
          <li><strong>🌐 Remote Friendly:</strong> 60% of tech jobs offer remote options</li>
          <li><strong>📈 Stock Compensation:</strong> Large tech companies offer significant equity packages</li>
          <li><strong>🔥 Hot Skills:</strong> AI/ML, Cloud, Cybersecurity command premium salaries</li>
        </ul>
      `,
      'healthcare': `
        <ul>
          <li><strong>📊 Stable Growth:</strong> Healthcare salaries growing 5-7% annually</li>
          <li><strong>🏥 Job Security:</strong> High demand due to aging population</li>
          <li><strong>📍 Location Dependent:</strong> Rural areas often pay premiums for healthcare professionals</li>
          <li><strong>⏰ Work-Life Balance:</strong> Some roles offer better balance than others</li>
        </ul>
      `,
      'finance': `
        <ul>
          <li><strong>💰 Bonus Heavy:</strong> Total compensation often 30-50% higher than base salary</li>
          <li><strong>🏙️ Location Concentrated:</strong> Highest salaries in major financial centers</li>
          <li><strong>📈 Performance Based:</strong> Compensation closely tied to individual and firm performance</li>
          <li><strong>🎓 Education Premium:</strong> MBA and CFA command significant salary premiums</li>
        </ul>
      `
    };
    
    return insights[field] || `
      <ul>
        <li><strong>📊 Market Trends:</strong> Research specific industry trends for your field</li>
        <li><strong>🌟 Skill Development:</strong> Focus on developing in-demand skills</li>
        <li><strong>📍 Location Impact:</strong> Consider geographic arbitrage opportunities</li>
        <li><strong>🔄 Career Flexibility:</strong> Many skills transfer across industries</li>
      </ul>
    `;
  }
});