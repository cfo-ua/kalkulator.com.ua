document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('compliance-form');
  const result = document.getElementById('compliance-result');

  function getComplianceLevel(score) {
    if (score >= 90) return { level: 'Excellent', color: 'success' };
    if (score >= 80) return { level: 'Good', color: 'info' };
    if (score >= 70) return { level: 'Moderate', color: 'warning' };
    if (score >= 60) return { level: 'Needs Improvement', color: 'warning' };
    return { level: 'Critical Issues', color: 'warning' };
  }

  function getFrameworkRecommendations(frameworks) {
    const recommendations = [];
    
    if (frameworks.gdpr < 75) {
      recommendations.push({
        icon: '🔒',
        title: 'GDPR Data Protection',
        text: 'Strengthen data protection measures. Focus on documenting lawful basis, improving data subject rights handling, and implementing comprehensive breach response procedures.'
      });
    }
    
    if (frameworks.sox < 75) {
      recommendations.push({
        icon: '📊',
        title: 'SOX Financial Controls',
        text: 'Enhance internal controls over financial reporting. Implement better documentation, strengthen segregation of duties, and establish formal deficiency remediation processes.'
      });
    }
    
    if (frameworks.esg < 75) {
      recommendations.push({
        icon: '🌱',
        title: 'ESG Sustainability',
        text: 'Improve sustainability practices. Develop comprehensive environmental impact measurement, strengthen social responsibility programs, and enhance governance structures.'
      });
    }
    
    if (frameworks.security < 75) {
      recommendations.push({
        icon: '🔐',
        title: 'Information Security',
        text: 'Bolster cybersecurity posture. Implement comprehensive access controls, develop incident response capabilities, and consider formal security management system certification.'
      });
    }
    
    if (frameworks.industry < 75) {
      recommendations.push({
        icon: '🏥',
        title: 'Industry Standards',
        text: 'Strengthen industry-specific compliance. Focus on relevant regulations like HIPAA, PCI DSS, or sector-specific requirements. Improve vendor compliance management.'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        icon: '🎉',
        title: 'Excellent Compliance',
        text: 'Your organization demonstrates strong compliance across all assessed frameworks. Focus on maintaining this performance through regular monitoring and continuous improvement.'
      });
    }

    return recommendations;
  }

  function getPriorityActions(frameworks) {
    const actions = [];
    const sortedFrameworks = Object.entries(frameworks)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => a.score - b.score);

    // Focus on lowest scoring areas
    if (sortedFrameworks[0].score < 60) {
      actions.push(`🚨 <strong>Immediate Action Required:</strong> Address critical gaps in ${getFrameworkName(sortedFrameworks[0].name)} (${sortedFrameworks[0].score}% compliance)`);
    }
    
    if (sortedFrameworks[1] && sortedFrameworks[1].score < 70) {
      actions.push(`⚠️ <strong>Priority Focus:</strong> Improve ${getFrameworkName(sortedFrameworks[1].name)} compliance (${sortedFrameworks[1].score}% compliance)`);
    }
    
    actions.push(`📈 <strong>Continuous Improvement:</strong> Implement regular quarterly assessments and monitoring`);
    actions.push(`👥 <strong>Training & Awareness:</strong> Conduct compliance training focusing on identified weak areas`);
    actions.push(`📋 <strong>Documentation:</strong> Ensure all policies and procedures are current and accessible`);

    return actions;
  }

  function getFrameworkName(key) {
    const names = {
      'gdpr': 'GDPR Data Protection',
      'sox': 'SOX Financial Controls', 
      'esg': 'ESG Sustainability',
      'security': 'Information Security',
      'industry': 'Industry-Specific Standards'
    };
    return names[key] || key;
  }

  function getComplianceInsights(overallScore, frameworks) {
    const insights = [];
    
    if (overallScore >= 90) {
      insights.push('🏆 Your organization demonstrates excellent compliance readiness across multiple frameworks');
      insights.push('💼 Consider pursuing formal certifications to validate your compliance maturity');
    } else if (overallScore >= 80) {
      insights.push('✅ Good overall compliance foundation with targeted improvement opportunities');
      insights.push('🎯 Focus resources on the lowest-scoring framework areas for maximum impact');
    } else if (overallScore >= 70) {
      insights.push('⚠️ Moderate compliance level requires systematic improvement across multiple areas');
      insights.push('📋 Develop a comprehensive compliance improvement plan with timeline and resources');
    } else {
      insights.push('🚨 Significant compliance gaps present material risk to your organization');
      insights.push('🏃‍♂️ Immediate action required - consider engaging compliance professionals for assistance');
    }

    return insights;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect all form values
      const values = {
        gdprLawfulBasis: parseInt(document.getElementById('gdpr-lawful-basis').value) || 0,
        gdprRights: parseInt(document.getElementById('gdpr-rights').value) || 0,
        gdprDpia: parseInt(document.getElementById('gdpr-dpia').value) || 0,
        gdprBreach: parseInt(document.getElementById('gdpr-breach').value) || 0,
        soxIcfr: parseInt(document.getElementById('sox-icfr').value) || 0,
        soxDocumentation: parseInt(document.getElementById('sox-documentation').value) || 0,
        soxSegregation: parseInt(document.getElementById('sox-segregation').value) || 0,
        soxRemediation: parseInt(document.getElementById('sox-remediation').value) || 0,
        esgEnvironmental: parseInt(document.getElementById('esg-environmental').value) || 0,
        esgSocial: parseInt(document.getElementById('esg-social').value) || 0,
        esgGovernance: parseInt(document.getElementById('esg-governance').value) || 0,
        esgSupplyChain: parseInt(document.getElementById('esg-supply-chain').value) || 0,
        securityIsms: parseInt(document.getElementById('security-isms').value) || 0,
        securityAccess: parseInt(document.getElementById('security-access').value) || 0,
        securityIncident: parseInt(document.getElementById('security-incident').value) || 0,
        industrySpecific: parseInt(document.getElementById('industry-specific').value) || 0,
        vendorCompliance: parseInt(document.getElementById('vendor-compliance').value) || 0
      };

      // Check if all fields are filled
      const hasEmptyFields = Object.values(values).some(value => value === 0 && value !== 0);
      const totalFields = Object.keys(values).length;
      const filledFields = Object.values(values).filter(value => value > 0).length;
      
      if (filledFields < totalFields) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Incomplete Assessment</h6>
            <p>Please answer all questions to get an accurate compliance score. Completed: ${filledFields}/${totalFields}</p>
          </div>
        `;
        return;
      }

      // Calculate framework scores (convert to percentage)
      const frameworks = {
        gdpr: ((values.gdprLawfulBasis + values.gdprRights + values.gdprDpia + values.gdprBreach) / 16) * 100,
        sox: ((values.soxIcfr + values.soxDocumentation + values.soxSegregation + values.soxRemediation) / 16) * 100,
        esg: ((values.esgEnvironmental + values.esgSocial + values.esgGovernance + values.esgSupplyChain) / 16) * 100,
        security: ((values.securityIsms + values.securityAccess + values.securityIncident) / 12) * 100,
        industry: ((values.industrySpecific + values.vendorCompliance) / 8) * 100
      };

      // Calculate overall score
      const overallScore = Math.round(Object.values(frameworks).reduce((sum, score) => sum + score, 0) / 5);
      const complianceLevel = getComplianceLevel(overallScore);
      const recommendations = getFrameworkRecommendations(frameworks);
      const priorityActions = getPriorityActions(frameworks);
      const insights = getComplianceInsights(overallScore, frameworks);

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${complianceLevel.color}">
            <h6>🏆 Overall Compliance Score</h6>
            <div class="big-number">${overallScore}%</div>
            <p><strong>${complianceLevel.level}</strong></p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card">
            <h6>🔒 GDPR Data Protection</h6>
            <div class="big-number">${Math.round(frameworks.gdpr)}%</div>
            <p>Data privacy & protection compliance</p>
          </div>
          <div class="insight-card">
            <h6>📊 SOX Financial Controls</h6>
            <div class="big-number">${Math.round(frameworks.sox)}%</div>
            <p>Financial reporting & internal controls</p>
          </div>
          <div class="insight-card">
            <h6>🌱 ESG Sustainability</h6>
            <div class="big-number">${Math.round(frameworks.esg)}%</div>
            <p>Environmental, social & governance</p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card">
            <h6>🔐 Information Security</h6>
            <div class="big-number">${Math.round(frameworks.security)}%</div>
            <p>Cybersecurity & data protection</p>
          </div>
          <div class="insight-card">
            <h6>🏥 Industry Standards</h6>
            <div class="big-number">${Math.round(frameworks.industry)}%</div>
            <p>Sector-specific & vendor compliance</p>
          </div>
        </div>

        <div class="insight-card info">
          <h6>📊 Compliance Insights</h6>
          <ul style="text-align: left; margin: 1rem 0;">
            ${insights.map(insight => `<li>${insight}</li>`).join('')}
          </ul>
        </div>

        <div class="insight-card warning">
          <h6>🎯 Priority Actions</h6>
          <ol style="text-align: left; margin: 1rem 0;">
            ${priorityActions.map(action => `<li>${action}</li>`).join('')}
          </ol>
        </div>

        <div class="insight-cards">
          ${recommendations.map(rec => `
            <div class="insight-card">
              <h6>${rec.icon} ${rec.title}</h6>
              <p style="font-size: 0.9rem; text-align: left;">${rec.text}</p>
            </div>
          `).join('')}
        </div>

        <div class="insight-card">
          <h6>📈 Score Interpretation</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>90-100%:</strong> Excellent compliance readiness - maintain and optimize</p>
            <p><strong>80-89%:</strong> Good compliance foundation - address specific gaps</p>
            <p><strong>70-79%:</strong> Moderate compliance - systematic improvement needed</p>
            <p><strong>60-69%:</strong> Significant gaps - prioritize remediation efforts</p>
            <p><strong>Below 60%:</strong> Critical issues - immediate professional assistance recommended</p>
          </div>
        </div>

        <div class="insight-card warning">
          <h6>⚠️ Important Disclaimers</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>• General Guidance Only:</strong> This assessment provides general compliance insights. Specific requirements vary by jurisdiction, industry, and organization.</p>
            <p><strong>• Professional Consultation:</strong> Always consult qualified compliance professionals and legal advisors for definitive guidance.</p>
            <p><strong>• Regular Updates:</strong> Compliance requirements evolve continuously. Maintain current knowledge and regular assessments.</p>
            <p><strong>• Context Dependent:</strong> Consider your specific business model, size, geography, and industry when interpreting results.</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📋 Next Steps</h6>
          <div style="text-align: left;">
            <p>1. <strong>Address Critical Gaps:</strong> Focus immediately on areas scoring below 60%</p>
            <p>2. <strong>Develop Action Plans:</strong> Create specific, time-bound improvement initiatives</p>
            <p>3. <strong>Assign Ownership:</strong> Designate responsible parties for each compliance area</p>
            <p>4. <strong>Regular Monitoring:</strong> Conduct quarterly reassessments to track progress</p>
            <p>5. <strong>Professional Support:</strong> Engage experts for complex or high-risk areas</p>
            <p>6. <strong>Training Programs:</strong> Implement organization-wide compliance training</p>
          </div>
        </div>
      `;
    });
  }
});