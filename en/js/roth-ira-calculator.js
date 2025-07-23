document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('roth-ira-form');
  const result = document.getElementById('roth-ira-result');
  const comparisonDiv = document.getElementById('comparison-analysis');
  const contributionDiv = document.getElementById('contribution-chart');
  const withdrawalDiv = document.getElementById('withdrawal-strategy');
  const projectionDiv = document.getElementById('year-by-year');

  // 2024 Contribution limits and income thresholds
  const CONTRIBUTION_LIMITS = {
    2024: {
      under50: 7000,
      over50: 8000,
      incomePhaseout: {
        single: { start: 138000, end: 153000 },
        marriedJoint: { start: 218000, end: 228000 },
        marriedSeparate: { start: 0, end: 10000 }
      }
    }
  };

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateRothIRA();
  });

  function calculateRothIRA() {
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const currentBalance = parseFloat(document.getElementById('currentBalance').value) || 0;
    const annualIncome = parseFloat(document.getElementById('annualIncome').value);
    const filingStatus = document.getElementById('filingStatus').value;
    const contributionType = document.getElementById('contributionType').value;
    const baseContribution = parseFloat(document.getElementById('annualContribution').value);
    const contributionGrowth = parseFloat(document.getElementById('contributionGrowth').value) / 100;
    const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) / 100;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;
    const expenseRatio = parseFloat(document.getElementById('expenseRatio').value) / 100;
    const currentTaxBracket = parseFloat(document.getElementById('currentTaxBracket').value) / 100;
    const retirementTaxBracket = parseFloat(document.getElementById('retirementTaxBracket').value) / 100;

    if (!currentAge || !retirementAge || !annualIncome || !expectedReturn) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    if (retirementAge <= currentAge) {
      result.innerHTML = '<div class="error">Retirement age must be greater than current age.</div>';
      return;
    }

    // Calculate Roth IRA projections
    const rothProjection = calculateRothProjection(
      currentAge, retirementAge, currentBalance, annualIncome, filingStatus,
      contributionType, baseContribution, contributionGrowth, expectedReturn, expenseRatio
    );

    // Calculate Traditional IRA comparison if selected
    let traditionalProjection = null;
    if (document.getElementById('compareTraditional').checked) {
      traditionalProjection = calculateTraditionalProjection(
        currentAge, retirementAge, currentBalance, annualIncome, filingStatus,
        contributionType, baseContribution, contributionGrowth, expectedReturn, expenseRatio,
        currentTaxBracket, retirementTaxBracket
      );
    }

    displayResults(rothProjection, traditionalProjection, inflationRate);
    showContributionAnalysis(annualIncome, filingStatus, currentAge, baseContribution);
    showWithdrawalStrategy(rothProjection, retirementAge);
    showYearByYear(rothProjection.yearByYear.slice(0, 10), inflationRate); // First 10 years
    
    if (traditionalProjection) {
      showComparison(rothProjection, traditionalProjection);
    }
  }

  function calculateRothProjection(currentAge, retirementAge, startBalance, income, filingStatus, 
                                  contributionType, baseContribution, contributionGrowth, 
                                  expectedReturn, expenseRatio) {
    const yearsToRetirement = retirementAge - currentAge;
    let balance = startBalance;
    let totalContributions = startBalance;
    const yearByYear = [];
    const netReturn = expectedReturn - expenseRatio;

    for (let year = 0; year < yearsToRetirement; year++) {
      const currentYearAge = currentAge + year;
      const adjustedIncome = income * Math.pow(1.03, year); // 3% income growth
      
      // Calculate contribution for this year
      let contribution = calculateAnnualContribution(
        contributionType, baseContribution, adjustedIncome, currentYearAge, 
        filingStatus, year, contributionGrowth
      );

      // Investment growth
      const investmentReturn = balance * netReturn;
      
      // Add contribution (beginning, monthly, or end of year)
      const contributionTiming = document.getElementById('contributionTiming').value;
      let yearEndBalance;
      
      if (contributionTiming === 'beginning') {
        yearEndBalance = (balance + contribution) * (1 + netReturn);
      } else if (contributionTiming === 'monthly') {
        // Monthly contributions with monthly compounding
        let monthlyBalance = balance;
        const monthlyContribution = contribution / 12;
        const monthlyReturn = netReturn / 12;
        
        for (let month = 0; month < 12; month++) {
          monthlyBalance = (monthlyBalance + monthlyContribution) * (1 + monthlyReturn);
        }
        yearEndBalance = monthlyBalance;
      } else { // end of year
        yearEndBalance = balance * (1 + netReturn) + contribution;
      }

      balance = yearEndBalance;
      totalContributions += contribution;

      yearByYear.push({
        age: currentYearAge,
        year: new Date().getFullYear() + year,
        contribution: contribution,
        investmentReturn: investmentReturn,
        balance: balance,
        totalContributions: totalContributions
      });
    }

    return {
      finalBalance: balance,
      totalContributions: totalContributions,
      totalEarnings: balance - totalContributions,
      yearsToRetirement: yearsToRetirement,
      yearByYear: yearByYear,
      averageAnnualReturn: netReturn
    };
  }

  function calculateTraditionalProjection(currentAge, retirementAge, startBalance, income, filingStatus,
                                        contributionType, baseContribution, contributionGrowth, 
                                        expectedReturn, expenseRatio, currentTaxBracket, retirementTaxBracket) {
    // Same growth calculation as Roth
    const rothCalc = calculateRothProjection(currentAge, retirementAge, startBalance, income, 
                                           filingStatus, contributionType, baseContribution, 
                                           contributionGrowth, expectedReturn, expenseRatio);
    
    // Calculate tax implications
    const totalTaxSavings = rothCalc.totalContributions * currentTaxBracket;
    const taxOnWithdrawals = rothCalc.finalBalance * retirementTaxBracket;
    const afterTaxValue = rothCalc.finalBalance - taxOnWithdrawals;

    return {
      ...rothCalc,
      currentTaxSavings: totalTaxSavings,
      taxOnWithdrawals: taxOnWithdrawals,
      afterTaxValue: afterTaxValue,
      effectiveRate: retirementTaxBracket
    };
  }

  function calculateAnnualContribution(contributionType, baseContribution, income, age, 
                                     filingStatus, year, contributionGrowth) {
    let contribution = baseContribution;

    // Adjust contribution based on type
    if (contributionType === 'percentage') {
      contribution = income * (baseContribution / 100);
    } else if (contributionType === 'maximum') {
      contribution = getMaxContribution(age, income, filingStatus);
    }

    // Apply growth to contribution
    if (contributionGrowth > 0) {
      contribution = contribution * Math.pow(1 + contributionGrowth, year);
    }

    // Apply contribution limits and income phaseouts
    const maxAllowed = getMaxContribution(age, income, filingStatus);
    contribution = Math.min(contribution, maxAllowed);

    return Math.max(0, contribution);
  }

  function getMaxContribution(age, income, filingStatus) {
    const limits = CONTRIBUTION_LIMITS[2024];
    let maxContribution = age >= 50 ? limits.over50 : limits.under50;
    
    // Apply income phaseout
    let phaseout;
    switch(filingStatus) {
      case 'single':
      case 'head':
        phaseout = limits.incomePhaseout.single;
        break;
      case 'married-joint':
        phaseout = limits.incomePhaseout.marriedJoint;
        break;
      case 'married-separate':
        phaseout = limits.incomePhaseout.marriedSeparate;
        break;
      default:
        phaseout = limits.incomePhaseout.single;
    }

    if (income <= phaseout.start) {
      return maxContribution;
    } else if (income >= phaseout.end) {
      return 0; // No contribution allowed
    } else {
      // Phaseout calculation
      const phaseoutAmount = (income - phaseout.start) / (phaseout.end - phaseout.start);
      return maxContribution * (1 - phaseoutAmount);
    }
  }

  function displayResults(rothProjection, traditionalProjection, inflationRate) {
    const includeInflation = document.getElementById('includeInflation').checked;
    const inflationAdjustedBalance = includeInflation ? 
      rothProjection.finalBalance / Math.pow(1 + inflationRate, rothProjection.yearsToRetirement) : 
      rothProjection.finalBalance;

    let resultHtml = `
      <div class="result-summary">
        <h3>📊 Roth IRA Projection Summary</h3>
        <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="result-item">
            <strong>Years to Retirement:</strong> ${rothProjection.yearsToRetirement}
          </div>
          <div class="result-item">
            <strong>Total Contributions:</strong> $${rothProjection.totalContributions.toLocaleString()}
          </div>
          <div class="result-item highlight">
            <strong>Final Balance:</strong> $${rothProjection.finalBalance.toLocaleString()}
          </div>
          <div class="result-item highlight">
            <strong>Total Earnings:</strong> $${rothProjection.totalEarnings.toLocaleString()}
          </div>
        </div>
      </div>
    `;

    if (includeInflation) {
      resultHtml += `
        <div class="inflation-adjusted" style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
          <h4 style="color: #856404; margin-bottom: 0.5rem;">💰 Purchasing Power Analysis</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div><strong>Nominal Value:</strong> $${rothProjection.finalBalance.toLocaleString()}</div>
            <div><strong>Today's Purchasing Power:</strong> $${inflationAdjustedBalance.toLocaleString()}</div>
            <div><strong>Real Return:</strong> ${((rothProjection.averageAnnualReturn - inflationRate) * 100).toFixed(1)}%</div>
          </div>
        </div>
      `;
    }

    // Tax-free benefits
    resultHtml += `
      <div class="tax-benefits" style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
        <h4 style="color: #155724; margin-bottom: 1rem;">🎯 Roth IRA Tax Advantages</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div>
            <h5>Tax-Free Withdrawals</h5>
            <ul>
              <li>All ${rothProjection.totalEarnings.toLocaleString()} in earnings are tax-free</li>
              <li>No taxes on qualified distributions</li>
              <li>No required minimum distributions</li>
            </ul>
          </div>
          <div>
            <h5>Flexibility Benefits</h5>
            <ul>
              <li>Withdraw contributions anytime penalty-free</li>
              <li>Estate planning advantages</li>
              <li>Tax diversification in retirement</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Monthly income projection
    const monthlyIncome4pct = (rothProjection.finalBalance * 0.04) / 12;
    const monthlyIncomeContrib = (rothProjection.totalContributions / rothProjection.yearsToRetirement) / 12;

    resultHtml += `
      <div class="retirement-income" style="margin-top: 1.5rem;">
        <h4>💸 Estimated Retirement Income</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="result-item">
            <strong>4% Rule Monthly:</strong> $${monthlyIncome4pct.toLocaleString()}
          </div>
          <div class="result-item">
            <strong>Annual (4% Rule):</strong> $${(rothProjection.finalBalance * 0.04).toLocaleString()}
          </div>
          <div class="result-item">
            <strong>vs Annual Contributions:</strong> ${((rothProjection.finalBalance * 0.04) / (rothProjection.totalContributions / rothProjection.yearsToRetirement)).toFixed(1)}x
          </div>
        </div>
        <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
          <strong>4% Rule:</strong> Conservative withdrawal rate considered sustainable for 30+ year retirement.
        </p>
      </div>
    `;

    // Key insights
    resultHtml += `
      <div class="insights" style="margin-top: 1.5rem;">
        <h4>💡 Key Insights</h4>
        <ul>
    `;

    const earningsToContributionsRatio = rothProjection.totalEarnings / rothProjection.totalContributions;
    if (earningsToContributionsRatio > 3) {
      resultHtml += `<li class="highlight"><strong>Excellent Growth:</strong> Your earnings (${earningsToContributionsRatio.toFixed(1)}x contributions) demonstrate the power of compound growth</li>`;
    }

    if (rothProjection.yearsToRetirement >= 30) {
      resultHtml += `<li><strong>Time Advantage:</strong> With ${rothProjection.yearsToRetirement} years to grow, you're maximizing the benefit of tax-free compounding</li>`;
    }

    const maxAnnualContribution = getMaxContribution(parseInt(document.getElementById('currentAge').value), 
                                                   parseFloat(document.getElementById('annualIncome').value), 
                                                   document.getElementById('filingStatus').value);
    if (parseFloat(document.getElementById('annualContribution').value) < maxAnnualContribution) {
      resultHtml += `<li class="warning"><strong>Contribution Opportunity:</strong> You could contribute up to $${maxAnnualContribution.toLocaleString()} annually</li>`;
    }

    if (traditionalProjection && rothProjection.finalBalance > traditionalProjection.afterTaxValue) {
      const advantage = rothProjection.finalBalance - traditionalProjection.afterTaxValue;
      resultHtml += `<li class="highlight"><strong>Roth Advantage:</strong> $${advantage.toLocaleString()} more than Traditional IRA after taxes</li>`;
    }

    resultHtml += `
        </ul>
      </div>
    `;

    result.innerHTML = resultHtml;
  }

  function showContributionAnalysis(income, filingStatus, age, currentContribution) {
    const maxContribution = getMaxContribution(age, income, filingStatus);
    const eligibilityStatus = maxContribution > 0 ? 'eligible' : 'not eligible';
    
    let contributionHtml = `
      <div class="contribution-analysis">
        <h4>📈 Contribution Limits & Eligibility</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div><strong>2024 Limit (Under 50):</strong> $${CONTRIBUTION_LIMITS[2024].under50.toLocaleString()}</div>
          <div><strong>2024 Limit (50+):</strong> $${CONTRIBUTION_LIMITS[2024].over50.toLocaleString()}</div>
          <div><strong>Your Maximum:</strong> $${maxContribution.toLocaleString()}</div>
          <div><strong>Current Contribution:</strong> $${currentContribution.toLocaleString()}</div>
        </div>
    `;

    if (maxContribution === 0) {
      contributionHtml += `
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
          <h5 style="color: #721c24;">⚠️ Income Too High for Direct Roth IRA</h5>
          <p style="color: #721c24; margin: 0;">
            Consider a backdoor Roth IRA strategy: contribute to a non-deductible Traditional IRA and convert to Roth.
          </p>
        </div>
      `;
    } else if (currentContribution < maxContribution) {
      const additionalSpace = maxContribution - currentContribution;
      contributionHtml += `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
          <h5 style="color: #856404;">💰 Opportunity to Increase</h5>
          <p style="color: #856404; margin: 0;">
            You could contribute an additional $${additionalSpace.toLocaleString()} annually to maximize your tax-free growth.
          </p>
        </div>
      `;
    }

    // Income phaseout information
    const phaseout = CONTRIBUTION_LIMITS[2024].incomePhaseout[filingStatus === 'married-joint' ? 'marriedJoint' : 'single'];
    contributionHtml += `
      <h5>Income Phaseout Ranges (2024)</h5>
      <ul>
        <li><strong>Single/Head of Household:</strong> $${CONTRIBUTION_LIMITS[2024].incomePhaseout.single.start.toLocaleString()} - $${CONTRIBUTION_LIMITS[2024].incomePhaseout.single.end.toLocaleString()}</li>
        <li><strong>Married Filing Jointly:</strong> $${CONTRIBUTION_LIMITS[2024].incomePhaseout.marriedJoint.start.toLocaleString()} - $${CONTRIBUTION_LIMITS[2024].incomePhaseout.marriedJoint.end.toLocaleString()}</li>
        <li><strong>Married Filing Separately:</strong> $${CONTRIBUTION_LIMITS[2024].incomePhaseout.marriedSeparate.start.toLocaleString()} - $${CONTRIBUTION_LIMITS[2024].incomePhaseout.marriedSeparate.end.toLocaleString()}</li>
      </ul>
      </div>
    `;

    document.getElementById('contribution-details').innerHTML = contributionHtml;
    contributionDiv.style.display = 'block';
  }

  function showWithdrawalStrategy(projection, retirementAge) {
    const contributionsAvailable = projection.totalContributions;
    const earningsAvailable = projection.totalEarnings;
    const monthlyIncome4pct = (projection.finalBalance * 0.04) / 12;
    const monthlyIncome3pct = (projection.finalBalance * 0.03) / 12;

    const withdrawalHtml = `
      <div class="withdrawal-strategy">
        <h4>🏦 Tax-Free Withdrawal Strategy</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 0.5rem; padding: 1rem;">
            <h5 style="color: #155724;">Contributions Available</h5>
            <p style="color: #155724; font-size: 1.1rem; font-weight: bold; margin: 0;">$${contributionsAvailable.toLocaleString()}</p>
            <small style="color: #155724;">Available anytime, tax and penalty-free</small>
          </div>
          <div style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 0.5rem; padding: 1rem;">
            <h5 style="color: #0c5460;">Earnings Available</h5>
            <p style="color: #0c5460; font-size: 1.1rem; font-weight: bold; margin: 0;">$${earningsAvailable.toLocaleString()}</p>
            <small style="color: #0c5460;">Tax-free after age ${retirementAge} (if 5-year rule met)</small>
          </div>
        </div>

        <h5>Sustainable Withdrawal Rates</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div><strong>3% Rule (Conservative):</strong> $${monthlyIncome3pct.toLocaleString()}/month</div>
          <div><strong>4% Rule (Standard):</strong> $${monthlyIncome4pct.toLocaleString()}/month</div>
          <div><strong>Total Annual (4%):</strong> $${(projection.finalBalance * 0.04).toLocaleString()}</div>
        </div>

        <h5>Withdrawal Order Strategy</h5>
        <ol>
          <li><strong>Age ${retirementAge}-70:</strong> Use contributions first (${(contributionsAvailable / (monthlyIncome4pct * 12)).toFixed(1)} years at 4% rate)</li>
          <li><strong>After contributions exhausted:</strong> Withdraw earnings tax-free</li>
          <li><strong>Flexibility:</strong> No required minimum distributions unlike Traditional IRAs</li>
          <li><strong>Estate planning:</strong> Remaining balance passes tax-free to beneficiaries</li>
        </ol>

        <h5>Early Retirement Considerations</h5>
        <ul>
          <li><strong>Before ${retirementAge}:</strong> Can access contributions penalty-free for early retirement</li>
          <li><strong>Earnings access:</strong> Limited exceptions (first home, education, medical)</li>
          <li><strong>5-year rule:</strong> Each conversion has its own 5-year clock</li>
          <li><strong>Roth IRA ladder:</strong> Annual conversions from Traditional to access earnings early</li>
        </ul>
      </div>
    `;

    document.getElementById('withdrawal-details').innerHTML = withdrawalHtml;
    withdrawalDiv.style.display = 'block';
  }

  function showComparison(rothProjection, traditionalProjection) {
    const comparisonBody = document.getElementById('comparison-body');
    comparisonBody.innerHTML = '';

    const rothAdvantage = rothProjection.finalBalance - traditionalProjection.afterTaxValue;
    const taxSavingsAdvantage = traditionalProjection.currentTaxSavings;

    const scenarios = [
      {
        name: 'Roth IRA',
        contributions: rothProjection.totalContributions,
        accountValue: rothProjection.finalBalance,
        afterTaxValue: rothProjection.finalBalance, // Already tax-free
        taxSavings: 0,
        advantage: rothAdvantage > 0 ? `+$${rothAdvantage.toLocaleString()}` : ''
      },
      {
        name: 'Traditional IRA',
        contributions: traditionalProjection.totalContributions,
        accountValue: traditionalProjection.finalBalance,
        afterTaxValue: traditionalProjection.afterTaxValue,
        taxSavings: traditionalProjection.currentTaxSavings,
        advantage: rothAdvantage < 0 ? `+$${(-rothAdvantage).toLocaleString()}` : ''
      }
    ];

    scenarios.forEach(scenario => {
      const row = document.createElement('tr');
      const advantageClass = scenario.advantage ? 'style="background: #d4edda;"' : '';
      
      row.innerHTML = `
        <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;" ${advantageClass}>${scenario.name}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${advantageClass}>$${scenario.contributions.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${advantageClass}>$${scenario.accountValue.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${advantageClass}>$${scenario.afterTaxValue.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${advantageClass}>$${scenario.taxSavings.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold; color: green;" ${advantageClass}>${scenario.advantage}</td>
      `;
      comparisonBody.appendChild(row);
    });

    comparisonDiv.style.display = 'block';
  }

  function showYearByYear(yearlyData, inflationRate) {
    const projectionBody = document.getElementById('projection-body');
    projectionBody.innerHTML = '';
    const includeInflation = document.getElementById('includeInflation').checked;

    yearlyData.forEach((year, index) => {
      const inflationAdjusted = includeInflation ? 
        year.balance / Math.pow(1 + inflationRate, index + 1) : 
        year.balance;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 0.5rem; border: 1px solid #ddd;">${year.age}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">${year.year}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${year.contribution.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${year.investmentReturn.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${year.balance.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${inflationAdjusted.toLocaleString()}</td>
      `;
      projectionBody.appendChild(row);
    });

    projectionDiv.style.display = 'block';
  }

  // Update contribution field when type changes
  document.getElementById('contributionType').addEventListener('change', function() {
    const contributionInput = document.getElementById('annualContribution');
    const income = parseFloat(document.getElementById('annualIncome').value) || 75000;
    const age = parseInt(document.getElementById('currentAge').value) || 30;
    const filingStatus = document.getElementById('filingStatus').value;

    if (this.value === 'maximum') {
      contributionInput.value = getMaxContribution(age, income, filingStatus);
    } else if (this.value === 'percentage') {
      contributionInput.value = 8; // 8% default
      contributionInput.placeholder = 'Percentage of income';
    } else {
      contributionInput.placeholder = 'Annual dollar amount';
    }
  });

  // Update max contribution when income or age changes
  document.getElementById('annualIncome').addEventListener('input', updateMaxContribution);
  document.getElementById('currentAge').addEventListener('input', updateMaxContribution);
  document.getElementById('filingStatus').addEventListener('change', updateMaxContribution);

  function updateMaxContribution() {
    const income = parseFloat(document.getElementById('annualIncome').value) || 0;
    const age = parseInt(document.getElementById('currentAge').value) || 30;
    const filingStatus = document.getElementById('filingStatus').value;
    
    if (income > 0) {
      const maxContrib = getMaxContribution(age, income, filingStatus);
      // Could update a display element showing current max contribution
    }
  }
});