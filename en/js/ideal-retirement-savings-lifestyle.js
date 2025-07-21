document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("lifestyle-retirement-form");
  const resultDiv = document.getElementById("lifestyle-retirement-result");
  const lifestyleSelect = document.getElementById("lifestyle-type");
  const customPercentageDiv = document.getElementById("custom-percentage");

  // Show/hide custom percentage input
  lifestyleSelect.addEventListener("change", function() {
    if (this.value === "custom") {
      customPercentageDiv.style.display = "block";
    } else {
      customPercentageDiv.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateLifestyleRetirement();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['current-age', 'retirement-age', 'current-income', 'lifestyle-type'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateLifestyleRetirement();
      }
    });
    document.getElementById(id).addEventListener("change", function () {
      if (validateInputs()) {
        calculateLifestyleRetirement();
      }
    });
  });

  function validateInputs() {
    const currentAge = parseFloat(document.getElementById("current-age").value);
    const retirementAge = parseFloat(document.getElementById("retirement-age").value);
    const currentIncome = parseFloat(document.getElementById("current-income").value);
    
    return currentAge > 0 && retirementAge > currentAge && currentIncome > 0;
  }

  function calculateLifestyleRetirement() {
    // Get inputs
    const currentAge = parseFloat(document.getElementById("current-age").value) || 0;
    const retirementAge = parseFloat(document.getElementById("retirement-age").value) || 0;
    const currentIncome = parseFloat(document.getElementById("current-income").value) || 0;
    const currentSavings = parseFloat(document.getElementById("current-savings").value) || 0;
    const lifestyleType = document.getElementById("lifestyle-type").value;
    const customIncomeReplacement = parseFloat(document.getElementById("custom-income-replacement").value) / 100 || 0;
    
    const housingPlan = document.getElementById("housing-plan").value;
    const travelFrequency = document.getElementById("travel-frequency").value;
    const healthcarePreference = document.getElementById("healthcare-preference").value;
    const hobbySpending = document.getElementById("hobby-spending").value;
    
    const socialSecurity = parseFloat(document.getElementById("social-security").value) || 0;
    const pension = parseFloat(document.getElementById("pension").value) || 0;
    const partTimeIncome = parseFloat(document.getElementById("part-time-income").value) || 0;
    const rentalIncome = parseFloat(document.getElementById("rental-income").value) || 0;
    
    const withdrawalRate = parseFloat(document.getElementById("withdrawal-rate").value) / 100 || 0;
    const inflationRate = parseFloat(document.getElementById("inflation-rate").value) / 100 || 0;
    const investmentReturn = parseFloat(document.getElementById("investment-return").value) / 100 || 0;

    if (currentAge >= retirementAge) {
      resultDiv.innerHTML = '<p style="color: red;">Retirement age must be greater than current age.</p>';
      return;
    }

    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = 30; // Assume 30 years in retirement

    // Calculate income replacement percentage based on lifestyle
    let incomeReplacementRatio;
    let lifestyleDescription;
    
    switch(lifestyleType) {
      case 'luxury':
        incomeReplacementRatio = 1.1; // 110%
        lifestyleDescription = "Luxury retirement with premium services and frequent travel";
        break;
      case 'comfortable':
        incomeReplacementRatio = 0.8; // 80%
        lifestyleDescription = "Comfortable retirement maintaining good quality of life";
        break;
      case 'modest':
        incomeReplacementRatio = 0.6; // 60%
        lifestyleDescription = "Modest retirement covering essentials with some extras";
        break;
      case 'lean':
        incomeReplacementRatio = 0.45; // 45%
        lifestyleDescription = "Lean FIRE focused on frugal living and early retirement";
        break;
      case 'custom':
        incomeReplacementRatio = customIncomeReplacement;
        lifestyleDescription = `Custom lifestyle requiring ${(customIncomeReplacement * 100).toFixed(0)}% income replacement`;
        break;
      default:
        incomeReplacementRatio = 0.8;
        lifestyleDescription = "Comfortable retirement";
    }

    // Apply lifestyle adjustments based on preferences
    const lifestyleAdjustments = calculateLifestyleAdjustments(
      housingPlan, travelFrequency, healthcarePreference, hobbySpending, incomeReplacementRatio
    );
    
    const adjustedIncomeReplacement = incomeReplacementRatio * lifestyleAdjustments.multiplier;
    
    // Calculate inflation-adjusted income need at retirement
    const futureCurrentIncome = currentIncome * Math.pow(1 + inflationRate, yearsToRetirement);
    const annualRetirementIncome = futureCurrentIncome * adjustedIncomeReplacement;
    
    // Calculate other income sources (inflation-adjusted)
    const futureOtherIncome = ((socialSecurity + pension + partTimeIncome + rentalIncome) * 12) * 
                             Math.pow(1 + inflationRate, yearsToRetirement);
    
    // Calculate required income from personal savings
    const requiredPersonalIncome = Math.max(0, annualRetirementIncome - futureOtherIncome);
    
    // Calculate required retirement fund using withdrawal rate
    const requiredRetirementFund = requiredPersonalIncome / withdrawalRate;
    
    // Calculate current savings growth
    const currentSavingsAtRetirement = currentSavings * Math.pow(1 + investmentReturn, yearsToRetirement);
    
    // Calculate shortfall
    const shortfall = Math.max(0, requiredRetirementFund - currentSavingsAtRetirement);
    
    // Calculate required annual savings
    let requiredAnnualSavings = 0;
    if (shortfall > 0) {
      // Future value of annuity formula
      const annuityFactor = (Math.pow(1 + investmentReturn, yearsToRetirement) - 1) / investmentReturn;
      requiredAnnualSavings = shortfall / annuityFactor;
    }
    
    const requiredMonthlySavings = requiredAnnualSavings / 12;
    const requiredSavingsRate = (requiredAnnualSavings / currentIncome) * 100;
    
    // Calculate current retirement readiness
    const retirementReadiness = currentSavingsAtRetirement / requiredRetirementFund * 100;
    
    // Age-based savings benchmarks
    const savingsBenchmarks = calculateSavingsBenchmarks(currentIncome, currentAge);

    displayResults({
      currentAge,
      retirementAge,
      yearsToRetirement,
      currentIncome,
      lifestyleType,
      lifestyleDescription,
      incomeReplacementRatio: adjustedIncomeReplacement,
      annualRetirementIncome,
      futureOtherIncome,
      requiredPersonalIncome,
      requiredRetirementFund,
      currentSavings,
      currentSavingsAtRetirement,
      shortfall,
      requiredAnnualSavings,
      requiredMonthlySavings,
      requiredSavingsRate,
      retirementReadiness,
      withdrawalRate,
      lifestyleAdjustments,
      savingsBenchmarks
    });
  }

  function calculateLifestyleAdjustments(housing, travel, healthcare, hobbies, baseRatio) {
    let multiplier = 1.0;
    let adjustments = [];

    // Housing adjustments
    switch(housing) {
      case 'same':
        adjustments.push("Staying in current home (paid off)");
        break;
      case 'downsize':
        multiplier *= 0.85;
        adjustments.push("15% savings from downsizing");
        break;
      case 'luxury':
        multiplier *= 1.25;
        adjustments.push("25% increase for luxury community");
        break;
      case 'relocate':
        multiplier *= 0.75;
        adjustments.push("25% savings from relocating to lower cost area");
        break;
    }

    // Travel adjustments
    switch(travel) {
      case 'frequent':
        multiplier *= 1.15;
        adjustments.push("15% increase for frequent travel");
        break;
      case 'moderate':
        adjustments.push("Moderate travel included in base estimate");
        break;
      case 'occasional':
        multiplier *= 0.95;
        adjustments.push("5% savings from occasional travel");
        break;
      case 'minimal':
        multiplier *= 0.85;
        adjustments.push("15% savings from minimal travel");
        break;
    }

    // Healthcare adjustments
    switch(healthcare) {
      case 'premium':
        multiplier *= 1.3;
        adjustments.push("30% increase for premium healthcare");
        break;
      case 'standard':
        adjustments.push("Standard healthcare included in base estimate");
        break;
      case 'basic':
        multiplier *= 0.9;
        adjustments.push("10% savings with basic Medicare coverage");
        break;
    }

    // Hobby spending adjustments
    switch(hobbies) {
      case 'high':
        multiplier *= 1.1;
        adjustments.push("10% increase for extensive hobbies");
        break;
      case 'moderate':
        adjustments.push("Moderate hobby spending included");
        break;
      case 'low':
        multiplier *= 0.95;
        adjustments.push("5% savings from modest hobbies");
        break;
      case 'minimal':
        multiplier *= 0.9;
        adjustments.push("10% savings from minimal hobby spending");
        break;
    }

    return { multiplier, adjustments };
  }

  function calculateSavingsBenchmarks(income, age) {
    // Common retirement savings benchmarks
    const benchmarks = {
      30: 1,    // 1x salary by 30
      35: 2,    // 2x salary by 35
      40: 3,    // 3x salary by 40
      45: 4,    // 4x salary by 45
      50: 6,    // 6x salary by 50
      55: 7,    // 7x salary by 55
      60: 8,    // 8x salary by 60
      65: 10    // 10x salary by 65
    };

    // Find the nearest benchmark age
    const benchmarkAges = Object.keys(benchmarks).map(Number).sort((a, b) => a - b);
    let targetMultiplier = 0;
    
    for (let benchmarkAge of benchmarkAges) {
      if (age <= benchmarkAge) {
        targetMultiplier = benchmarks[benchmarkAge];
        break;
      }
    }
    
    if (targetMultiplier === 0) {
      targetMultiplier = benchmarks[65]; // Default to 65 if older
    }

    return {
      targetAmount: income * targetMultiplier,
      multiplier: targetMultiplier,
      description: `${targetMultiplier}x annual salary by age ${age <= 65 ? Math.ceil(age/5)*5 : 65}`
    };
  }

  function displayResults(data) {
    const {
      currentAge,
      retirementAge,
      yearsToRetirement,
      currentIncome,
      lifestyleDescription,
      incomeReplacementRatio,
      annualRetirementIncome,
      futureOtherIncome,
      requiredPersonalIncome,
      requiredRetirementFund,
      currentSavings,
      currentSavingsAtRetirement,
      shortfall,
      requiredAnnualSavings,
      requiredMonthlySavings,
      requiredSavingsRate,
      retirementReadiness,
      withdrawalRate,
      lifestyleAdjustments,
      savingsBenchmarks
    } = data;

    const isOnTrack = retirementReadiness >= 100;
    const readinessClass = retirementReadiness >= 100 ? 'excellent' : 
                          retirementReadiness >= 75 ? 'good' : 
                          retirementReadiness >= 50 ? 'fair' : 'poor';

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🎯 Your Ideal Retirement Plan</h3>
        
        <div class="lifestyle-summary">
          <h4>Selected Lifestyle: ${lifestyleDescription}</h4>
          <p><strong>Income Replacement:</strong> ${(incomeReplacementRatio * 100).toFixed(1)}% of current income</p>
          <p><strong>Required Annual Income:</strong> $${annualRetirementIncome.toLocaleString()} (in ${yearsToRetirement} years)</p>
        </div>

        <div class="readiness-meter ${readinessClass}">
          <h4>Retirement Readiness: ${retirementReadiness.toFixed(1)}%</h4>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(retirementReadiness, 100)}%"></div>
          </div>
          <p>${isOnTrack ? 
            '✅ You\'re on track for your desired retirement lifestyle!' : 
            `⚠️ You need to save more to achieve your retirement goals.`}</p>
        </div>

        <div class="key-numbers">
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🎯 Required Fund</h6>
              <p class="big-number">$${requiredRetirementFund.toLocaleString()}</p>
              <p class="insight-detail">total retirement goal</p>
            </div>
            
            <div class="insight-card info">
              <h6>📊 Projected Savings</h6>
              <p class="big-number">$${currentSavingsAtRetirement.toLocaleString()}</p>
              <p class="insight-detail">at retirement age</p>
            </div>
            
            <div class="insight-card ${shortfall > 0 ? 'warning' : 'success'}">
              <h6>${shortfall > 0 ? '⚠️ Shortfall' : '🎉 Surplus'}</h6>
              <p class="big-number">$${Math.abs(shortfall).toLocaleString()}</p>
              <p class="insight-detail">${shortfall > 0 ? 'additional needed' : 'above target'}</p>
            </div>
            
            <div class="insight-card info">
              <h6>💰 Monthly Target</h6>
              <p class="big-number">$${requiredMonthlySavings.toLocaleString()}</p>
              <p class="insight-detail">savings needed</p>
            </div>
            
            <div class="insight-card ${requiredSavingsRate <= 15 ? 'success' : requiredSavingsRate <= 25 ? 'warning' : 'info'}">
              <h6>📈 Savings Rate</h6>
              <p class="big-number">${requiredSavingsRate.toFixed(1)}%</p>
              <p class="insight-detail">of income needed</p>
            </div>
            
            <div class="insight-card info">
              <h6>📉 Withdrawal Rate</h6>
              <p class="big-number">${(withdrawalRate * 100).toFixed(1)}%</p>
              <p class="insight-detail">sustainable rate</p>
            </div>
          </div>
        </div>

        <div class="income-breakdown">
          <h4>💰 Retirement Income Breakdown (Annual)</h4>
          <div class="income-sources">
            <div class="income-item">
              <span class="source">Personal Savings (${(withdrawalRate * 100).toFixed(1)}% withdrawal):</span>
              <span class="amount">$${requiredPersonalIncome.toLocaleString()}</span>
            </div>
            <div class="income-item">
              <span class="source">Other Sources (Social Security, Pension, etc.):</span>
              <span class="amount">$${futureOtherIncome.toLocaleString()}</span>
            </div>
            <div class="income-item total">
              <span class="source">Total Retirement Income:</span>
              <span class="amount">$${annualRetirementIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="lifestyle-adjustments">
          <h4>🏡 Lifestyle Adjustments Applied</h4>
          <ul>
            ${lifestyleAdjustments.adjustments.map(adj => `<li>${adj}</li>`).join('')}
          </ul>
          <p><strong>Net Adjustment:</strong> ${((lifestyleAdjustments.multiplier - 1) * 100).toFixed(1)}% from base lifestyle</p>
        </div>

        <div class="savings-benchmark">
          <h4>📊 Savings Benchmark Analysis</h4>
          <div class="benchmark-comparison">
            <div class="benchmark-item">
              <span class="label">Your Current Savings:</span>
              <span class="value">$${currentSavings.toLocaleString()}</span>
            </div>
            <div class="benchmark-item">
              <span class="label">${savingsBenchmarks.description}:</span>
              <span class="value">$${savingsBenchmarks.targetAmount.toLocaleString()}</span>
            </div>
            <div class="benchmark-item ${currentSavings >= savingsBenchmarks.targetAmount ? 'ahead' : 'behind'}">
              <span class="label">Status:</span>
              <span class="value">${currentSavings >= savingsBenchmarks.targetAmount ? '✅ Ahead of benchmark' : '⚠️ Behind benchmark'}</span>
            </div>
          </div>
        </div>

        ${shortfall > 0 ? `
          <div class="action-plan">
            <h4>🎯 Action Plan to Meet Your Goals</h4>
            <div class="strategies">
              <div class="strategy">
                <h5>Increase Savings</h5>
                <p>Save an additional <strong>$${requiredMonthlySavings.toFixed(0)} per month</strong> (${requiredSavingsRate.toFixed(1)}% of income)</p>
              </div>
              
              ${requiredSavingsRate > 20 ? `
                <div class="strategy alternative">
                  <h5>Alternative Strategies</h5>
                  <ul>
                    <li>Delay retirement by 2-3 years</li>
                    <li>Consider a more modest lifestyle</li>
                    <li>Plan to work part-time in early retirement</li>
                    <li>Increase investment returns through higher-risk investments</li>
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        ` : `
          <div class="congratulations">
            <h4>🎉 Congratulations!</h4>
            <p>You're on track to achieve your desired retirement lifestyle. Continue your current savings plan and consider:</p>
            <ul>
              <li>Increasing savings if income grows</li>
              <li>Reviewing and rebalancing investments annually</li>
              <li>Considering whether you can afford a more luxurious lifestyle</li>
              <li>Planning for healthcare costs and inflation</li>
            </ul>
          </div>
        `}

        <div class="retirement-tips">
          <h4>💡 Retirement Planning Tips</h4>
          <ul>
            <li><strong>Tax Diversification:</strong> Use mix of traditional and Roth accounts</li>
            <li><strong>Healthcare Planning:</strong> Consider HSAs and long-term care insurance</li>
            <li><strong>Inflation Protection:</strong> Include inflation-protected investments</li>
            <li><strong>Geographic Arbitrage:</strong> Consider lower-cost retirement locations</li>
            <li><strong>Phased Retirement:</strong> Gradually reduce work hours instead of stopping abruptly</li>
            <li><strong>Estate Planning:</strong> Update wills and beneficiaries regularly</li>
          </ul>
        </div>

        <div class="lifestyle-considerations">
          <h4>🌟 Lifestyle-Specific Considerations</h4>
          ${getLifestyleAdvice(data.lifestyleType)}
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps</h4>
          <ul>
            <li>Review and optimize your investment portfolio allocation</li>
            <li>Maximize employer 401(k) matching contributions</li>
            <li>Consider increasing savings rate when income grows</li>
            <li>Plan for healthcare costs and long-term care needs</li>
            <li>Review Social Security benefits and optimization strategies</li>
            <li>Consult with a financial advisor for personalized advice</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getLifestyleAdvice(lifestyleType) {
    const advice = {
      luxury: `
        <ul>
          <li><strong>Premium Healthcare:</strong> Budget for concierge medicine and comprehensive insurance</li>
          <li><strong>Luxury Housing:</strong> Consider high-end retirement communities or aging-in-place modifications</li>
          <li><strong>Travel Fund:</strong> Separate budget for international and luxury travel experiences</li>
          <li><strong>Estate Planning:</strong> Complex estate planning may be needed for wealth preservation</li>
        </ul>
      `,
      comfortable: `
        <ul>
          <li><strong>Balanced Approach:</strong> Mix of comfort and financial prudence</li>
          <li><strong>Healthcare Buffer:</strong> Plan for medical expenses beyond Medicare</li>
          <li><strong>Flexible Spending:</strong> Ability to adjust spending based on market conditions</li>
          <li><strong>Family Support:</strong> Budget for helping adult children or grandchildren</li>
        </ul>
      `,
      modest: `
        <ul>
          <li><strong>Budget Discipline:</strong> Focus on essential expenses and simple pleasures</li>
          <li><strong>Community Resources:</strong> Take advantage of senior discounts and free activities</li>
          <li><strong>Healthcare Efficiency:</strong> Maximize Medicare benefits and generic medications</li>
          <li><strong>Housing Optimization:</strong> Consider downsizing or house hacking strategies</li>
        </ul>
      `,
      lean: `
        <ul>
          <li><strong>Geographic Arbitrage:</strong> Consider low-cost living areas or international retirement</li>
          <li><strong>Frugal Living:</strong> Embrace minimalism and DIY approaches</li>
          <li><strong>Early Retirement:</strong> Plan bridge strategies until Social Security eligibility</li>
          <li><strong>Healthcare Strategy:</strong> Consider healthcare ministry or international options</li>
        </ul>
      `,
      custom: `
        <ul>
          <li><strong>Tailored Approach:</strong> Your custom plan requires careful monitoring</li>
          <li><strong>Flexibility:</strong> Be prepared to adjust spending based on actual costs</li>
          <li><strong>Regular Reviews:</strong> Reassess assumptions and goals annually</li>
          <li><strong>Professional Guidance:</strong> Consider working with a financial advisor</li>
        </ul>
      `
    };

    return advice[lifestyleType] || advice.comfortable;
  }
});