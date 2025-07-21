document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("freelancer-retirement-form");
  const resultDiv = document.getElementById("freelancer-retirement-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateFreelancerRetirement();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['current-age', 'retirement-age', 'annual-income', 'retirement-income'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateFreelancerRetirement();
      }
    });
  });

  function validateInputs() {
    const currentAge = parseFloat(document.getElementById("current-age").value);
    const retirementAge = parseFloat(document.getElementById("retirement-age").value);
    const annualIncome = parseFloat(document.getElementById("annual-income").value);
    
    return currentAge > 0 && retirementAge > currentAge && annualIncome > 0;
  }

  function calculateFreelancerRetirement() {
    // Get inputs
    const currentAge = parseFloat(document.getElementById("current-age").value) || 0;
    const retirementAge = parseFloat(document.getElementById("retirement-age").value) || 0;
    const currentSavings = parseFloat(document.getElementById("current-savings").value) || 0;
    const annualIncome = parseFloat(document.getElementById("annual-income").value) || 0;
    const incomeGrowth = parseFloat(document.getElementById("income-growth").value) / 100 || 0;
    const incomeVariability = document.getElementById("income-variability").value;
    const retirementIncome = parseFloat(document.getElementById("retirement-income").value) || 0;
    const retirementYears = parseFloat(document.getElementById("retirement-years").value) || 0;
    const currentContribution = parseFloat(document.getElementById("current-contribution").value) || 0;
    const contributionPercentage = parseFloat(document.getElementById("contribution-percentage").value) / 100 || 0;
    const investmentReturn = parseFloat(document.getElementById("investment-return").value) / 100 || 0;

    if (currentAge >= retirementAge) {
      resultDiv.innerHTML = '<p style="color: red;">Retirement age must be greater than current age.</p>';
      return;
    }

    const yearsToRetirement = retirementAge - currentAge;
    
    // Calculate required retirement fund
    const requiredRetirementFund = retirementIncome * retirementYears;
    
    // Adjust for inflation (assume 3% annually)
    const inflationRate = 0.03;
    const inflationAdjustedFund = requiredRetirementFund * Math.pow(1 + inflationRate, yearsToRetirement);
    
    // Calculate current savings growth
    const currentSavingsAtRetirement = currentSavings * Math.pow(1 + investmentReturn, yearsToRetirement);
    
    // Calculate income variability impact
    const variabilityMultipliers = {
      'low': { emergency: 6, savingsConsistency: 0.95 },
      'moderate': { emergency: 9, savingsConsistency: 0.85 },
      'high': { emergency: 12, savingsConsistency: 0.75 },
      'very-high': { emergency: 18, savingsConsistency: 0.65 }
    };
    
    const variability = variabilityMultipliers[incomeVariability];
    const recommendedEmergencyFund = (annualIncome / 12) * variability.emergency;
    
    // Calculate future value of contributions
    const targetAnnualContribution = annualIncome * contributionPercentage;
    let totalContributions = 0;
    let futureValueOfContributions = 0;
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearlyIncome = annualIncome * Math.pow(1 + incomeGrowth, year - 1);
      const yearlyContribution = yearlyIncome * contributionPercentage * variability.savingsConsistency;
      const yearsRemaining = yearsToRetirement - year + 1;
      
      totalContributions += yearlyContribution;
      futureValueOfContributions += yearlyContribution * Math.pow(1 + investmentReturn, yearsRemaining - 1);
    }
    
    const totalRetirementFund = currentSavingsAtRetirement + futureValueOfContributions;
    const shortfall = inflationAdjustedFund - totalRetirementFund;
    
    // Calculate contribution limits for 2023
    const contributionLimits = calculateContributionLimits(annualIncome, currentAge);
    
    // Account type recommendations
    const accountRecommendations = getAccountRecommendations(annualIncome, targetAnnualContribution, contributionLimits);
    
    // Monthly savings needed if there's a shortfall
    const monthlyShortfallContribution = shortfall > 0 ? 
      (shortfall / ((Math.pow(1 + investmentReturn, yearsToRetirement) - 1) / investmentReturn)) / 12 : 0;

    displayResults({
      currentAge,
      retirementAge,
      yearsToRetirement,
      currentSavings,
      annualIncome,
      retirementIncome,
      retirementYears,
      requiredRetirementFund,
      inflationAdjustedFund,
      totalRetirementFund,
      shortfall,
      currentContribution,
      targetAnnualContribution,
      totalContributions,
      futureValueOfContributions,
      recommendedEmergencyFund,
      variability,
      contributionLimits,
      accountRecommendations,
      monthlyShortfallContribution,
      incomeVariability
    });
  }

  function calculateContributionLimits(income, age) {
    const catchUpAge = age >= 50;
    
    return {
      traditionalIRA: catchUpAge ? 7500 : 6500,
      rothIRA: catchUpAge ? 7500 : 6500,
      sepIRA: Math.min(income * 0.25, 66000),
      solo401k: catchUpAge ? 73500 : 66000,
      simpleIRA: catchUpAge ? 19000 : 15500
    };
  }

  function getAccountRecommendations(income, targetContribution, limits) {
    const recommendations = [];
    
    if (income <= 50000) {
      recommendations.push({
        account: "Roth IRA",
        reason: "Lower current tax bracket, tax-free growth",
        maxContribution: limits.rothIRA
      });
    } else if (income <= 100000) {
      recommendations.push({
        account: "SEP-IRA + Roth IRA",
        reason: "Higher contribution limits with tax diversification",
        maxContribution: limits.sepIRA + limits.rothIRA
      });
    } else {
      recommendations.push({
        account: "Solo 401(k)",
        reason: "Highest contribution limits for high earners",
        maxContribution: limits.solo401k
      });
    }

    return recommendations;
  }

  function displayResults(data) {
    const {
      currentAge,
      retirementAge,
      yearsToRetirement,
      annualIncome,
      retirementIncome,
      requiredRetirementFund,
      inflationAdjustedFund,
      totalRetirementFund,
      shortfall,
      targetAnnualContribution,
      totalContributions,
      recommendedEmergencyFund,
      variability,
      contributionLimits,
      accountRecommendations,
      monthlyShortfallContribution,
      incomeVariability
    } = data;

    const isOnTrack = shortfall <= 0;
    const replacementRatio = (retirementIncome / annualIncome * 100).toFixed(1);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>💼 Your Freelancer Retirement Plan</h3>
        
        <div class="retirement-status ${isOnTrack ? 'on-track' : 'needs-attention'}">
          <h4>${isOnTrack ? '✅ On Track!' : '⚠️ Needs Attention'}</h4>
          <p>${isOnTrack ? 
            'Your current savings plan should meet your retirement goals.' : 
            'You may need to adjust your savings strategy to meet your retirement goals.'}</p>
        </div>

        <div class="result-grid">
          <div class="result-item highlight">
            <span class="label">Projected Retirement Fund:</span>
            <span class="value">$${totalRetirementFund.toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="label">Required Fund (inflation-adjusted):</span>
            <span class="value">$${inflationAdjustedFund.toLocaleString()}</span>
          </div>
          <div class="result-item ${shortfall > 0 ? 'shortage' : 'surplus'}">
            <span class="label">${shortfall > 0 ? 'Shortfall:' : 'Surplus:'}</span>
            <span class="value">$${Math.abs(shortfall).toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="label">Years to Retirement:</span>
            <span class="value">${yearsToRetirement} years</span>
          </div>
          <div class="result-item">
            <span class="label">Income Replacement Ratio:</span>
            <span class="value">${replacementRatio}%</span>
          </div>
          <div class="result-item">
            <span class="label">Target Annual Savings:</span>
            <span class="value">$${targetAnnualContribution.toLocaleString()}</span>
          </div>
        </div>

        ${shortfall > 0 ? `
          <div class="shortfall-solution">
            <h4>🎯 To Close the Gap:</h4>
            <p>You need to save an additional <strong>$${monthlyShortfallContribution.toFixed(2)} per month</strong> or <strong>$${(monthlyShortfallContribution * 12).toFixed(0)} per year</strong> to meet your retirement goal.</p>
          </div>
        ` : ''}

        <div class="freelancer-challenges">
          <h4>📊 Freelancer-Specific Considerations</h4>
          <div class="challenge-grid">
            <div class="challenge-item">
              <strong>Income Variability: ${incomeVariability.charAt(0).toUpperCase() + incomeVariability.slice(1)}</strong>
              <p>Recommended emergency fund: <strong>$${recommendedEmergencyFund.toLocaleString()}</strong></p>
              <p>Savings consistency factor: ${((1 - variability.savingsConsistency) * 100).toFixed(0)}% reduction due to income volatility</p>
            </div>
          </div>
        </div>

        <div class="contribution-limits">
          <h4>📋 2023 Contribution Limits</h4>
          <div class="limits-grid">
            <div class="limit-item">
              <span class="account">Traditional/Roth IRA:</span>
              <span class="limit">$${contributionLimits.traditionalIRA.toLocaleString()}</span>
            </div>
            <div class="limit-item">
              <span class="account">SEP-IRA (25% of income):</span>
              <span class="limit">$${contributionLimits.sepIRA.toLocaleString()}</span>
            </div>
            <div class="limit-item">
              <span class="account">Solo 401(k):</span>
              <span class="limit">$${contributionLimits.solo401k.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="account-recommendations">
          <h4>🏆 Recommended Account Strategy</h4>
          ${accountRecommendations.map(rec => `
            <div class="recommendation">
              <strong>${rec.account}</strong>
              <p>${rec.reason}</p>
              <p>Max contribution: $${rec.maxContribution.toLocaleString()}</p>
            </div>
          `).join('')}
        </div>

        <div class="freelancer-tips">
          <h4>💡 Freelancer Retirement Tips</h4>
          <ul>
            <li><strong>Automate Savings:</strong> Set up automatic transfers from business to retirement accounts</li>
            <li><strong>Quarterly Strategy:</strong> Make larger contributions when big payments arrive</li>
            <li><strong>Tax Planning:</strong> Coordinate retirement contributions with quarterly tax payments</li>
            <li><strong>Emergency Fund First:</strong> Build 6-12 months expenses before aggressive retirement saving</li>
            <li><strong>Business Structure:</strong> Consider S-Corp election to reduce self-employment tax</li>
            <li><strong>Health Savings:</strong> Use HSA as additional retirement vehicle if eligible</li>
          </ul>
        </div>

        <div class="income-smoothing">
          <h4>🔄 Income Smoothing Strategies</h4>
          <ul>
            <li><strong>Retainer Clients:</strong> Aim for 40-60% recurring revenue</li>
            <li><strong>Separate Accounts:</strong> Keep business, taxes, and retirement funds separate</li>
            <li><strong>Good Year Strategy:</strong> Save 25-30% of income during high-earning periods</li>
            <li><strong>Lean Year Plan:</strong> Maintain minimum IRA contributions even in slow periods</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps</h4>
          <ul>
            <li>Open appropriate retirement accounts based on recommendations above</li>
            <li>Set up automatic monthly transfers for retirement savings</li>
            <li>Review and adjust quarterly based on actual income</li>
            <li>Consult with a financial advisor familiar with freelancer finances</li>
            <li>Track net worth and retirement progress annually</li>
          </ul>
        </div>
      </div>
    `;
  }
});