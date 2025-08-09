document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("emergency-fund-form");
  const resultDiv = document.getElementById("emergency-fund-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateEmergencyFund();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['monthly-income', 'housing-costs', 'income-stability'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateEmergencyFund();
      }
    });
    document.getElementById(id).addEventListener("change", function () {
      if (validateInputs()) {
        calculateEmergencyFund();
      }
    });
  });

  function validateInputs() {
    const monthlyIncome = parseFloat(document.getElementById("monthly-income").value);
    const housingCosts = parseFloat(document.getElementById("housing-costs").value);
    return monthlyIncome > 0 && housingCosts >= 0;
  }

  function calculateEmergencyFund() {
    // Get monthly expenses
    const housingCosts = parseFloat(document.getElementById("housing-costs").value) || 0;
    const foodCosts = parseFloat(document.getElementById("food-costs").value) || 0;
    const transportation = parseFloat(document.getElementById("transportation").value) || 0;
    const insurance = parseFloat(document.getElementById("insurance").value) || 0;
    const debtPayments = parseFloat(document.getElementById("debt-payments").value) || 0;
    const otherEssentials = parseFloat(document.getElementById("other-essentials").value) || 0;
    
    // Get income and employment info
    const monthlyIncome = parseFloat(document.getElementById("monthly-income").value) || 0;
    const incomeStability = document.getElementById("income-stability").value;
    const employmentType = document.getElementById("employment-type").value;
    
    // Get risk factors
    const healthIssues = document.getElementById("health-issues").checked;
    const homeowner = document.getElementById("homeowner").checked;
    const dependents = document.getElementById("dependents").checked;
    const volatileIndustry = document.getElementById("volatile-industry").checked;
    const highDebt = document.getElementById("high-debt").checked;
    const limitedFamilySupport = document.getElementById("limited-family-support").checked;
    
    // Get safety net factors
    const goodInsurance = document.getElementById("good-insurance").checked;
    const liquidInvestments = document.getElementById("liquid-investments").checked;
    const backupIncome = document.getElementById("backup-income").checked;
    const familySafetyNet = document.getElementById("family-safety-net").checked;
    const creditLines = document.getElementById("credit-lines").checked;
    
    // Get current savings
    const currentEmergencyFund = parseFloat(document.getElementById("current-emergency-fund").value) || 0;
    const savingsRate = parseFloat(document.getElementById("savings-rate").value) || 0;

    if (monthlyIncome <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter a valid monthly income.</p>';
      return;
    }

    // Calculate total essential monthly expenses
    const essentialExpenses = housingCosts + foodCosts + transportation + insurance + debtPayments + otherEssentials;
    
    // Calculate base months needed based on income stability
    let baseMonths = getBaseMonths(incomeStability, employmentType);
    
    // Calculate risk adjustment
    const riskAdjustment = calculateRiskAdjustment({
      healthIssues, homeowner, dependents, volatileIndustry, highDebt, limitedFamilySupport
    });
    
    // Calculate safety net adjustment
    const safetyNetAdjustment = calculateSafetyNetAdjustment({
      goodInsurance, liquidInvestments, backupIncome, familySafetyNet, creditLines
    });
    
    // Calculate final target months
    const adjustedMonths = Math.max(1, baseMonths + riskAdjustment - safetyNetAdjustment);
    const targetEmergencyFund = essentialExpenses * adjustedMonths;
    
    // Calculate gap and timeline
    const gap = Math.max(0, targetEmergencyFund - currentEmergencyFund);
    const monthsToTarget = savingsRate > 0 ? Math.ceil(gap / savingsRate) : 0;
    
    // Calculate emergency fund adequacy
    const adequacy = getEmergencyFundAdequacy(currentEmergencyFund, essentialExpenses);
    
    // Generate recommendations
    const recommendations = generateRecommendations({
      currentEmergencyFund,
      targetEmergencyFund,
      essentialExpenses,
      monthlyIncome,
      gap,
      adjustedMonths,
      incomeStability,
      riskAdjustment,
      safetyNetAdjustment
    });

    displayResults({
      essentialExpenses,
      monthlyIncome,
      baseMonths,
      adjustedMonths,
      riskAdjustment,
      safetyNetAdjustment,
      targetEmergencyFund,
      currentEmergencyFund,
      gap,
      monthsToTarget,
      savingsRate,
      adequacy,
      recommendations,
      breakdown: {
        housing: housingCosts,
        food: foodCosts,
        transportation,
        insurance,
        debt: debtPayments,
        other: otherEssentials
      }
    });
  }

  function getBaseMonths(stability, employment) {
    // Base months by income stability
    const stabilityMonths = {
      'very-stable': 3,
      'stable': 4,
      'moderate': 5,
      'unstable': 7,
      'very-unstable': 9
    };
    
    // Adjustment by employment type
    const employmentAdjustment = {
      'single-income': 1,
      'dual-income-same': 0,
      'dual-income-different': -1,
      'multiple-income': -0.5
    };
    
    const base = stabilityMonths[stability] || 4;
    const adjustment = employmentAdjustment[employment] || 0;
    
    return Math.max(1, base + adjustment);
  }

  function calculateRiskAdjustment(risks) {
    let adjustment = 0;
    
    if (risks.healthIssues) adjustment += 1.5;
    if (risks.homeowner) adjustment += 1;
    if (risks.dependents) adjustment += 1;
    if (risks.volatileIndustry) adjustment += 1.5;
    if (risks.highDebt) adjustment += 1;
    if (risks.limitedFamilySupport) adjustment += 0.5;
    
    return adjustment;
  }

  function calculateSafetyNetAdjustment(safetyNets) {
    let adjustment = 0;
    
    if (safetyNets.goodInsurance) adjustment += 0.5;
    if (safetyNets.liquidInvestments) adjustment += 1;
    if (safetyNets.backupIncome) adjustment += 1;
    if (safetyNets.familySafetyNet) adjustment += 1;
    if (safetyNets.creditLines) adjustment += 0.5;
    
    return Math.min(adjustment, 3); // Cap reduction at 3 months
  }

  function getEmergencyFundAdequacy(current, monthlyExpenses) {
    const monthsCovered = current / monthlyExpenses;
    
    if (monthsCovered >= 6) {
      return {
        level: 'excellent',
        description: 'Excellent emergency fund coverage',
        monthsCovered: monthsCovered,
        class: 'excellent'
      };
    } else if (monthsCovered >= 3) {
      return {
        level: 'good',
        description: 'Good emergency fund coverage',
        monthsCovered: monthsCovered,
        class: 'good'
      };
    } else if (monthsCovered >= 1) {
      return {
        level: 'basic',
        description: 'Basic emergency fund - needs improvement',
        monthsCovered: monthsCovered,
        class: 'basic'
      };
    } else {
      return {
        level: 'inadequate',
        description: 'Inadequate emergency fund - high risk',
        monthsCovered: monthsCovered,
        class: 'inadequate'
      };
    }
  }

  function generateRecommendations(data) {
    const recommendations = [];
    const {
      currentEmergencyFund,
      targetEmergencyFund,
      essentialExpenses,
      monthlyIncome,
      gap,
      adjustedMonths,
      riskAdjustment,
      safetyNetAdjustment
    } = data;

    // Priority recommendations
    if (currentEmergencyFund < 1000) {
      recommendations.push({
        priority: 'high',
        title: 'Build Starter Emergency Fund',
        description: 'Focus on saving $1,000 as quickly as possible before other financial goals.',
        action: 'Consider selling items, picking up extra work, or temporarily reducing expenses.'
      });
    }

    if (gap > monthlyIncome * 3) {
      recommendations.push({
        priority: 'high',
        title: 'Large Gap - Consider Phased Approach',
        description: 'Your target emergency fund is large. Consider building it in phases.',
        action: 'Aim for 3 months first, then gradually build to your full target.'
      });
    }

    if (riskAdjustment > 2) {
      recommendations.push({
        priority: 'medium',
        title: 'High Risk Profile',
        description: 'You have several risk factors that increase your emergency fund needs.',
        action: 'Consider disability insurance, improving job security, or building additional income streams.'
      });
    }

    if (safetyNetAdjustment > 1) {
      recommendations.push({
        priority: 'low',
        title: 'Good Safety Net',
        description: 'Your safety nets allow for a smaller emergency fund.',
        action: 'Ensure safety nets remain reliable and consider investing excess emergency funds.'
      });
    }

    // Savings strategy recommendations
    if (gap / (data.savingsRate || 1) > 24) {
      recommendations.push({
        priority: 'medium',
        title: 'Increase Savings Rate',
        description: 'At current savings rate, it will take over 2 years to reach your target.',
        action: 'Look for ways to increase income or reduce expenses to boost monthly savings.'
      });
    }

    return recommendations;
  }

  function displayResults(data) {
    const {
      essentialExpenses,
      monthlyIncome,
      baseMonths,
      adjustedMonths,
      riskAdjustment,
      safetyNetAdjustment,
      targetEmergencyFund,
      currentEmergencyFund,
      gap,
      monthsToTarget,
      savingsRate,
      adequacy,
      recommendations,
      breakdown
    } = data;

    const expenseRatio = (essentialExpenses / monthlyIncome) * 100;

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🛡️ Emergency Fund Analysis</h3>
        
        <div class="fund-status ${adequacy.class}">
          <h4>${adequacy.description}</h4>
          
          <div class="insight-cards">
            <div class="insight-card ${adequacy.monthsCovered >= adjustedMonths ? 'success' : adequacy.monthsCovered >= adjustedMonths * 0.7 ? 'warning' : 'info'}">
              <h6>📅 Current Coverage</h6>
              <p class="big-number">${adequacy.monthsCovered.toFixed(1)}</p>
              <p class="insight-detail">months of expenses covered</p>
            </div>
            
            <div class="insight-card info">
              <h6>🎯 Target Coverage</h6>
              <p class="big-number">${adjustedMonths.toFixed(1)}</p>
              <p class="insight-detail">recommended months</p>
            </div>
            
            <div class="insight-card ${currentEmergencyFund >= targetEmergencyFund ? 'success' : 'warning'}">
              <h6>💰 Current Fund</h6>
              <p class="big-number">$${currentEmergencyFund.toLocaleString()}</p>
              <p class="insight-detail">your emergency savings</p>
            </div>
            
            <div class="insight-card success">
              <h6>🛡️ Target Fund</h6>
              <p class="big-number">$${targetEmergencyFund.toLocaleString()}</p>
              <p class="insight-detail">full protection goal</p>
            </div>
          </div>
        </div>

        ${gap > 0 ? `
          <div class="savings-plan">
            <h4>📈 Savings Plan to Target</h4>
            <div class="insight-cards">
              <div class="insight-card warning">
                <h6>💸 Amount Needed</h6>
                <p class="big-number">$${gap.toLocaleString()}</p>
                <p class="insight-detail">to reach your goal</p>
              </div>
              
              <div class="insight-card info">
                <h6>📊 Monthly Savings</h6>
                <p class="big-number">$${savingsRate.toLocaleString()}</p>
                <p class="insight-detail">recommended amount</p>
              </div>
              
              <div class="insight-card success">
                <h6>⏰ Time to Target</h6>
                <p class="big-number">${monthsToTarget}</p>
                <p class="insight-detail">months (${(monthsToTarget / 12).toFixed(1)} years)</p>
              </div>
              
              <div class="insight-card info">
                <h6>📈 Savings Rate</h6>
                <p class="big-number">${((savingsRate / monthlyIncome) * 100).toFixed(1)}%</p>
                <p class="insight-detail">of monthly income</p>
              </div>
            </div>
          </div>
        ` : `
          <div class="congratulations">
            <h4>🎉 Emergency Fund Complete!</h4>
            <p>You have reached your emergency fund target. Consider investing excess emergency savings or directing savings toward other goals.</p>
          </div>
        `}

        <div class="expense-breakdown">
          <h4>💰 Essential Monthly Expenses</h4>
          <div class="expense-grid">
            <div class="expense-item">
              <span class="category">Housing & Utilities:</span>
              <span class="amount">$${breakdown.housing.toLocaleString()}</span>
              <span class="percentage">(${((breakdown.housing / essentialExpenses) * 100).toFixed(1)}%)</span>
            </div>
            <div class="expense-item">
              <span class="category">Food & Groceries:</span>
              <span class="amount">$${breakdown.food.toLocaleString()}</span>
              <span class="percentage">(${((breakdown.food / essentialExpenses) * 100).toFixed(1)}%)</span>
            </div>
            <div class="expense-item">
              <span class="category">Transportation:</span>
              <span class="amount">$${breakdown.transportation.toLocaleString()}</span>
              <span class="percentage">(${((breakdown.transportation / essentialExpenses) * 100).toFixed(1)}%)</span>
            </div>
            <div class="expense-item">
              <span class="category">Insurance:</span>
              <span class="amount">$${breakdown.insurance.toLocaleString()}</span>
              <span class="percentage">(${((breakdown.insurance / essentialExpenses) * 100).toFixed(1)}%)</span>
            </div>
            <div class="expense-item">
              <span class="category">Debt Payments:</span>
              <span class="amount">$${breakdown.debt.toLocaleString()}</span>
              <span class="percentage">(${((breakdown.debt / essentialExpenses) * 100).toFixed(1)}%)</span>
            </div>
            <div class="expense-item">
              <span class="category">Other Essentials:</span>
              <span class="amount">$${breakdown.other.toLocaleString()}</span>
              <span class="percentage">(${((breakdown.other / essentialExpenses) * 100).toFixed(1)}%)</span>
            </div>
            <div class="expense-item total">
              <span class="category">Total Essential Expenses:</span>
              <span class="amount">$${essentialExpenses.toLocaleString()}</span>
              <span class="percentage">(${expenseRatio.toFixed(1)}% of income)</span>
            </div>
          </div>
        </div>

        <div class="target-calculation">
          <h4>🎯 Emergency Fund Target Calculation</h4>
          <div class="calculation-steps">
            <div class="calc-step">
              <span class="step">Base Recommendation:</span>
              <span class="value">${baseMonths.toFixed(1)} months</span>
              <span class="note">Based on income stability and employment type</span>
            </div>
            ${riskAdjustment > 0 ? `
              <div class="calc-step risk">
                <span class="step">Risk Factor Adjustment:</span>
                <span class="value">+${riskAdjustment.toFixed(1)} months</span>
                <span class="note">Health issues, homeownership, dependents, etc.</span>
              </div>
            ` : ''}
            ${safetyNetAdjustment > 0 ? `
              <div class="calc-step safety">
                <span class="step">Safety Net Adjustment:</span>
                <span class="value">-${safetyNetAdjustment.toFixed(1)} months</span>
                <span class="note">Insurance, family support, liquid investments</span>
              </div>
            ` : ''}
            <div class="calc-step final">
              <span class="step">Final Recommendation:</span>
              <span class="value">${adjustedMonths.toFixed(1)} months</span>
              <span class="note">$${targetEmergencyFund.toLocaleString()} total</span>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
          <div class="recommendations">
            <h4>💡 Personalized Recommendations</h4>
            ${recommendations.map(rec => `
              <div class="recommendation ${rec.priority}-priority">
                <div class="rec-header">
                  <h5>${rec.title}</h5>
                  <span class="priority">${rec.priority.toUpperCase()} PRIORITY</span>
                </div>
                <p><strong>Analysis:</strong> ${rec.description}</p>
                <p><strong>Action:</strong> ${rec.action}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="emergency-fund-tips">
          <h4>📋 Emergency Fund Best Practices</h4>
          <div class="tips-grid">
            <div class="tip-category">
              <h5>Where to Keep Emergency Funds</h5>
              <ul>
                <li>High-yield savings account (most common)</li>
                <li>Money market account</li>
                <li>Short-term CDs (ladder approach)</li>
                <li>Avoid: stocks, bonds, retirement accounts</li>
              </ul>
            </div>
            <div class="tip-category">
              <h5>Building Your Fund</h5>
              <ul>
                <li>Start with $1,000 starter emergency fund</li>
                <li>Automate monthly transfers</li>
                <li>Use windfalls (tax refunds, bonuses)</li>
                <li>Temporarily reduce other savings</li>
              </ul>
            </div>
            <div class="tip-category">
              <h5>When to Use Emergency Fund</h5>
              <ul>
                <li>✅ Job loss or income reduction</li>
                <li>✅ Major medical expenses</li>
                <li>✅ Essential home/car repairs</li>
                <li>❌ Vacations or luxury purchases</li>
              </ul>
            </div>
            <div class="tip-category">
              <h5>Maintaining Your Fund</h5>
              <ul>
                <li>Review target annually</li>
                <li>Replenish immediately after use</li>
                <li>Adjust for life changes</li>
                <li>Keep separate from other savings</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="savings-strategies">
          <h4>🚀 Strategies to Build Emergency Fund Faster</h4>
          <ul>
            <li><strong>Increase Income:</strong> Side hustles, freelancing, selling unused items</li>
            <li><strong>Reduce Expenses:</strong> Temporarily cut discretionary spending</li>
            <li><strong>Automate Savings:</strong> Set up automatic transfers on payday</li>
            <li><strong>Use Windfalls:</strong> Tax refunds, bonuses, gifts toward emergency fund</li>
            <li><strong>Challenge Yourself:</strong> No-spend months, savings challenges</li>
            <li><strong>Optimize Banking:</strong> High-yield accounts to earn more on savings</li>
            <li><strong>Round-Up Programs:</strong> Automatic savings from spare change</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps</h4>
          <ol>
            <li>Open a dedicated high-yield savings account for emergencies</li>
            <li>Set up automatic monthly transfers to build your fund</li>
            <li>Track progress toward your emergency fund target</li>
            <li>Review and adjust target when life circumstances change</li>
            <li>Once target is reached, redirect savings to other goals</li>
            <li>Consider supplemental insurance for major risks</li>
          </ol>
        </div>

        <div class="important-notes">
          <h4>📝 Important Considerations</h4>
          <ul>
            <li><strong>Personal Situation:</strong> Adjust recommendations based on your specific circumstances</li>
            <li><strong>Opportunity Cost:</strong> Balance emergency fund with debt payoff and investing</li>
            <li><strong>Inflation Impact:</strong> Review fund size annually for inflation adjustments</li>
            <li><strong>Life Changes:</strong> Reassess when income, expenses, or risks change</li>
            <li><strong>Access Speed:</strong> Ensure funds are available within 24-48 hours</li>
          </ul>
        </div>
      </div>
    `;
  }
});