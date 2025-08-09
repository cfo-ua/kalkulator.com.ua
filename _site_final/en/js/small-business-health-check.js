document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('health-check-form');
  const result = document.getElementById('health-check-result');

  function getScoreColor(score) {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'warning';
  }

  function getScoreLevel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Needs Attention';
    return 'Critical';
  }

  function getRecommendations(categoryScores) {
    const recommendations = [];
    
    if (categoryScores.financial < 7) {
      recommendations.push("💰 <strong>Financial Health:</strong> Focus on improving cash flow management and expense tracking. Consider implementing better budgeting tools and financial controls.");
    }
    
    if (categoryScores.operations < 7) {
      recommendations.push("⚙️ <strong>Operations:</strong> Streamline your processes and consider automation opportunities. Invest in technology to improve efficiency and reduce manual work.");
    }
    
    if (categoryScores.marketing < 7) {
      recommendations.push("📈 <strong>Marketing:</strong> Develop a comprehensive marketing strategy. Focus on customer retention and building a stronger online presence.");
    }
    
    if (categoryScores.growth < 7) {
      recommendations.push("🚀 <strong>Growth Strategy:</strong> Define clear, measurable business goals and develop actionable plans. Conduct thorough competitive analysis to identify opportunities.");
    }
    
    if (categoryScores.team < 7) {
      recommendations.push("👥 <strong>Team & Leadership:</strong> Invest in team development and improve leadership skills. Focus on communication and productivity enhancement.");
    }
    
    if (categoryScores.risk < 7) {
      recommendations.push("🛡️ <strong>Risk Management:</strong> Develop contingency plans and diversify revenue streams. Create comprehensive risk management strategies.");
    }

    if (recommendations.length === 0) {
      recommendations.push("🎉 <strong>Excellent Performance:</strong> Your business shows strong health across all areas. Focus on maintaining this performance and identifying new growth opportunities.");
    }

    return recommendations;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect all form values
      const values = {
        cashFlow: parseInt(document.getElementById('cash-flow').value) || 0,
        profitMargin: parseInt(document.getElementById('profit-margin').value) || 0,
        expenseManagement: parseInt(document.getElementById('expense-management').value) || 0,
        processEfficiency: parseInt(document.getElementById('process-efficiency').value) || 0,
        inventoryManagement: parseInt(document.getElementById('inventory-management').value) || 0,
        technologyUsage: parseInt(document.getElementById('technology-usage').value) || 0,
        customerRetention: parseInt(document.getElementById('customer-retention').value) || 0,
        marketingEffectiveness: parseInt(document.getElementById('marketing-effectiveness').value) || 0,
        digitalPresence: parseInt(document.getElementById('digital-presence').value) || 0,
        businessGoals: parseInt(document.getElementById('business-goals').value) || 0,
        growthPotential: parseInt(document.getElementById('growth-potential').value) || 0,
        competitiveAnalysis: parseInt(document.getElementById('competitive-analysis').value) || 0,
        teamProductivity: parseInt(document.getElementById('team-productivity').value) || 0,
        leadershipEffectiveness: parseInt(document.getElementById('leadership-effectiveness').value) || 0,
        riskPreparedness: parseInt(document.getElementById('risk-preparedness').value) || 0,
        diversification: parseInt(document.getElementById('diversification').value) || 0
      };

      // Check if all fields are filled
      const hasEmptyFields = Object.values(values).some(value => value === 0);
      if (hasEmptyFields) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Incomplete Assessment</h6>
            <p>Please answer all questions to get an accurate business health score.</p>
          </div>
        `;
        return;
      }

      // Calculate category scores
      const categoryScores = {
        financial: ((values.cashFlow + values.profitMargin + values.expenseManagement) / 3),
        operations: ((values.processEfficiency + values.inventoryManagement + values.technologyUsage) / 3),
        marketing: ((values.customerRetention + values.marketingEffectiveness + values.digitalPresence) / 3),
        growth: ((values.businessGoals + values.growthPotential + values.competitiveAnalysis) / 3),
        team: ((values.teamProductivity + values.leadershipEffectiveness) / 2),
        risk: ((values.riskPreparedness + values.diversification) / 2)
      };

      // Calculate overall score
      const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
      const overallScore = Math.round((totalScore / 6) * 10);

      const scoreLevel = getScoreLevel(overallScore);
      const scoreColor = getScoreColor(overallScore);
      const recommendations = getRecommendations(categoryScores);

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${scoreColor}">
            <h6>🏆 Overall Business Health Score</h6>
            <div class="big-number">${overallScore}/100</div>
            <p><strong>${scoreLevel}</strong></p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card">
            <h6>💰 Financial Health</h6>
            <div class="big-number">${Math.round(categoryScores.financial * 10)}/100</div>
            <p>Cash flow, profitability & expense management</p>
          </div>
          <div class="insight-card">
            <h6>⚙️ Operations</h6>
            <div class="big-number">${Math.round(categoryScores.operations * 10)}/100</div>
            <p>Process efficiency & technology usage</p>
          </div>
          <div class="insight-card">
            <h6>📈 Marketing</h6>
            <div class="big-number">${Math.round(categoryScores.marketing * 10)}/100</div>
            <p>Customer relations & digital presence</p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card">
            <h6>🚀 Growth Strategy</h6>
            <div class="big-number">${Math.round(categoryScores.growth * 10)}/100</div>
            <p>Goal setting & competitive positioning</p>
          </div>
          <div class="insight-card">
            <h6>👥 Team & Leadership</h6>
            <div class="big-number">${Math.round(categoryScores.team * 10)}/100</div>
            <p>Team productivity & leadership effectiveness</p>
          </div>
          <div class="insight-card">
            <h6>🛡️ Risk Management</h6>
            <div class="big-number">${Math.round(categoryScores.risk * 10)}/100</div>
            <p>Risk preparedness & diversification</p>
          </div>
        </div>

        <div class="insight-card info">
          <h6>📋 Key Recommendations</h6>
          <ul style="text-align: left; margin: 1rem 0;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="insight-card">
          <h6>📊 Score Interpretation</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>90-100:</strong> Excellent - Strong business with sustainable growth</p>
            <p><strong>80-89:</strong> Good - Solid foundation with optimization opportunities</p>
            <p><strong>70-79:</strong> Fair - Average performance, improvement needed</p>
            <p><strong>60-69:</strong> Needs Attention - Significant issues requiring action</p>
            <p><strong>Below 60:</strong> Critical - Immediate intervention required</p>
          </div>
        </div>

        <div class="insight-card warning">
          <h6>💡 Next Steps</h6>
          <div style="text-align: left;">
            <p>1. <strong>Focus on lowest-scoring areas</strong> - These represent your biggest risks</p>
            <p>2. <strong>Create action plans</strong> - Set specific, measurable improvement goals</p>
            <p>3. <strong>Monitor progress</strong> - Retake this assessment quarterly</p>
            <p>4. <strong>Seek expert advice</strong> - Consult professionals for complex issues</p>
          </div>
        </div>
      `;
    });
  }
});