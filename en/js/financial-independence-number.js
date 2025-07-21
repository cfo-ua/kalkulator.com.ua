document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("fire-calculator-form");
  const resultDiv = document.getElementById("fire-calculator-result");
  const expectedReturnInput = document.getElementById("expected-return");
  const inflationRateInput = document.getElementById("inflation-rate");
  const realReturnInput = document.getElementById("real-return");
  const fireTypeSelect = document.getElementById("fire-type");
  const annualExpensesInput = document.getElementById("annual-expenses");

  // Calculate real return when inputs change
  function updateRealReturn() {
    const expectedReturn = parseFloat(expectedReturnInput.value) || 0;
    const inflationRate = parseFloat(inflationRateInput.value) || 0;
    const realReturn = expectedReturn - inflationRate;
    realReturnInput.value = realReturn.toFixed(1);
  }

  expectedReturnInput.addEventListener("input", updateRealReturn);
  inflationRateInput.addEventListener("input", updateRealReturn);
  
  // Update expenses based on FIRE type
  fireTypeSelect.addEventListener("change", function() {
    const currentIncome = parseFloat(document.getElementById("annual-income").value) || 75000;
    let suggestedExpenses;
    
    switch(this.value) {
      case 'lean':
        suggestedExpenses = Math.min(40000, currentIncome * 0.4);
        break;
      case 'regular':
        suggestedExpenses = currentIncome * 0.7;
        break;
      case 'fat':
        suggestedExpenses = currentIncome * 1.2;
        break;
      case 'barista':
        suggestedExpenses = currentIncome * 0.5;
        break;
      case 'coast':
        suggestedExpenses = currentIncome * 0.7;
        break;
      default:
        return; // Custom - don't update
    }
    
    annualExpensesInput.value = Math.round(suggestedExpenses);
  });

  updateRealReturn(); // Initial calculation

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateFIRE();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['annual-expenses', 'withdrawal-rate', 'current-savings'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateFIRE();
      }
    });
  });

  function validateInputs() {
    const annualExpenses = parseFloat(document.getElementById("annual-expenses").value);
    const currentSavings = parseFloat(document.getElementById("current-savings").value);
    return annualExpenses > 0 && currentSavings >= 0;
  }

  function calculateFIRE() {
    // Get inputs
    const currentAge = parseFloat(document.getElementById("current-age").value) || 30;
    const currentSavings = parseFloat(document.getElementById("current-savings").value) || 0;
    const annualIncome = parseFloat(document.getElementById("annual-income").value) || 0;
    const monthlySavings = parseFloat(document.getElementById("monthly-savings").value) || 0;
    const fireType = document.getElementById("fire-type").value;
    const annualExpenses = parseFloat(document.getElementById("annual-expenses").value) || 0;
    const withdrawalRate = parseFloat(document.getElementById("withdrawal-rate").value) / 100 || 0.04;
    const expectedReturn = parseFloat(document.getElementById("expected-return").value) / 100 || 0.07;
    const inflationRate = parseFloat(document.getElementById("inflation-rate").value) / 100 || 0.03;
    const realReturn = expectedReturn - inflationRate;
    
    // Additional income
    const rentalIncome = parseFloat(document.getElementById("rental-income").value) || 0;
    const partTimeIncome = parseFloat(document.getElementById("part-time-income").value) || 0;
    const pensionIncome = parseFloat(document.getElementById("pension-income").value) || 0;
    const socialSecurity = parseFloat(document.getElementById("social-security").value) || 0;
    const includeSS = document.getElementById("include-social-security").checked;
    
    // Options
    const showScenarios = document.getElementById("show-scenarios").checked;
    const showTimeline = document.getElementById("show-timeline").checked;

    if (annualExpenses <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid annual expenses.</p>';
      return;
    }

    // Calculate total additional income
    const totalAdditionalIncome = rentalIncome + partTimeIncome + pensionIncome + 
                                  (includeSS ? socialSecurity : 0);
    
    // Calculate required portfolio income
    const requiredPortfolioIncome = Math.max(0, annualExpenses - totalAdditionalIncome);
    
    // Calculate FIRE number
    const fireNumber = requiredPortfolioIncome / withdrawalRate;
    
    // Calculate gap and timeline
    const gap = Math.max(0, fireNumber - currentSavings);
    const annualSavings = monthlySavings * 12;
    const savingsRate = annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;
    
    // Calculate time to FIRE
    const timeToFIRE = calculateTimeToFIRE(currentSavings, gap, annualSavings, realReturn);
    const fireAge = currentAge + timeToFIRE;
    
    // Calculate different FIRE scenarios
    const scenarios = showScenarios ? calculateFIREScenarios(annualIncome, totalAdditionalIncome, withdrawalRate) : null;
    
    // Generate timeline projection
    const timeline = showTimeline ? generateTimeline(currentSavings, annualSavings, realReturn, fireNumber, 10) : null;

    displayResults({
      currentAge,
      fireAge,
      timeToFIRE,
      fireType,
      annualExpenses,
      fireNumber,
      currentSavings,
      gap,
      requiredPortfolioIncome,
      totalAdditionalIncome,
      withdrawalRate: withdrawalRate * 100,
      savingsRate,
      annualSavings,
      monthlySavings,
      scenarios,
      timeline,
      realReturn: realReturn * 100
    });
  }

  function calculateTimeToFIRE(currentSavings, gap, annualSavings, realReturn) {
    if (gap <= 0) return 0;
    if (annualSavings <= 0) return Infinity;
    
    // Future value of annuity formula to solve for time
    if (realReturn === 0) {
      return gap / annualSavings;
    }
    
    // Using logarithmic formula for compound interest with regular contributions
    const numerator = Math.log(1 + (gap * realReturn) / annualSavings);
    const denominator = Math.log(1 + realReturn);
    
    return Math.max(0, numerator / denominator);
  }

  function calculateFIREScenarios(annualIncome, additionalIncome, withdrawalRate) {
    const scenarios = [
      {
        name: "Lean FIRE",
        description: "Minimal expenses, frugal lifestyle",
        expenses: Math.min(40000, annualIncome * 0.4),
        color: "lean"
      },
      {
        name: "Regular FIRE", 
        description: "Maintain current lifestyle",
        expenses: annualIncome * 0.7,
        color: "regular"
      },
      {
        name: "Fat FIRE",
        description: "Luxury lifestyle, higher expenses", 
        expenses: annualIncome * 1.2,
        color: "fat"
      },
      {
        name: "Barista FIRE",
        description: "Part-time work + investments",
        expenses: annualIncome * 0.5,
        partTimeIncome: 15000,
        color: "barista"
      }
    ];

    return scenarios.map(scenario => {
      const requiredIncome = Math.max(0, scenario.expenses - additionalIncome - (scenario.partTimeIncome || 0));
      const fireNumber = requiredIncome / withdrawalRate;
      
      return {
        ...scenario,
        requiredIncome,
        fireNumber,
        monthlyExpenses: scenario.expenses / 12
      };
    });
  }

  function generateTimeline(startingAmount, annualSavings, realReturn, targetAmount, years) {
    const timeline = [];
    let balance = startingAmount;
    
    for (let year = 0; year <= years; year++) {
      timeline.push({
        year: year,
        age: parseFloat(document.getElementById("current-age").value) + year,
        balance: balance,
        progressToFIRE: (balance / targetAmount) * 100
      });
      
      if (year < years) {
        balance = balance * (1 + realReturn) + annualSavings;
      }
    }
    
    return timeline;
  }

  function displayResults(data) {
    const {
      currentAge,
      fireAge,
      timeToFIRE,
      fireType,
      annualExpenses,
      fireNumber,
      currentSavings,
      gap,
      requiredPortfolioIncome,
      totalAdditionalIncome,
      withdrawalRate,
      savingsRate,
      annualSavings,
      monthlySavings,
      scenarios,
      timeline,
      realReturn
    } = data;

    const progress = (currentSavings / fireNumber) * 100;
    const isOnTrack = timeToFIRE < 50 && timeToFIRE !== Infinity;

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🔥 Your FIRE Analysis</h3>
        
        <div class="fire-summary">
          <h4>${fireType.charAt(0).toUpperCase() + fireType.slice(1)} FIRE Goal</h4>
          <div class="fire-overview">
            <div class="fire-item highlight">
              <span class="label">Your FIRE Number:</span>
              <span class="value">$${fireNumber.toLocaleString()}</span>
            </div>
            <div class="fire-item">
              <span class="label">Annual Expenses:</span>
              <span class="value">$${annualExpenses.toLocaleString()}</span>
            </div>
            <div class="fire-item">
              <span class="label">Portfolio Income Needed:</span>
              <span class="value">$${requiredPortfolioIncome.toLocaleString()}</span>
            </div>
            <div class="fire-item">
              <span class="label">Withdrawal Rate:</span>
              <span class="value">${withdrawalRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div class="fire-progress">
          <h4>📈 Progress to FIRE</h4>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
              <span class="progress-text">${progress.toFixed(1)}% Complete</span>
            </div>
          </div>
          
          <div class="progress-stats">
            <div class="stat-item">
              <span class="label">Current Savings:</span>
              <span class="value">$${currentSavings.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <span class="label">Amount Needed:</span>
              <span class="value">$${gap.toLocaleString()}</span>
            </div>
            <div class="stat-item ${isOnTrack ? 'on-track' : 'needs-attention'}">
              <span class="label">Time to FIRE:</span>
              <span class="value">${timeToFIRE === Infinity ? 'Never at current rate' : 
                timeToFIRE.toFixed(1) + ' years'}</span>
            </div>
            <div class="stat-item">
              <span class="label">FIRE Age:</span>
              <span class="value">${timeToFIRE === Infinity ? 'N/A' : fireAge.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div class="savings-analysis">
          <h4>💰 Savings Analysis</h4>
          <div class="savings-grid">
            <div class="savings-item">
              <span class="label">Monthly Savings:</span>
              <span class="value">$${monthlySavings.toLocaleString()}</span>
            </div>
            <div class="savings-item">
              <span class="label">Annual Savings:</span>
              <span class="value">$${annualSavings.toLocaleString()}</span>
            </div>
            <div class="savings-item ${savingsRate >= 20 ? 'excellent' : savingsRate >= 10 ? 'good' : 'needs-improvement'}">
              <span class="label">Savings Rate:</span>
              <span class="value">${savingsRate.toFixed(1)}%</span>
            </div>
            <div class="savings-item">
              <span class="label">Real Return (after inflation):</span>
              <span class="value">${realReturn.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        ${totalAdditionalIncome > 0 ? `
          <div class="additional-income">
            <h4>💵 Additional Income Sources</h4>
            <p><strong>Total Additional Income:</strong> $${totalAdditionalIncome.toLocaleString()}/year</p>
            <p>This reduces your required portfolio size by $${(totalAdditionalIncome / (withdrawalRate / 100)).toLocaleString()}</p>
          </div>
        ` : ''}

        ${scenarios ? `
          <div class="fire-scenarios">
            <h4>🎯 Different FIRE Scenarios</h4>
            <div class="scenarios-grid">
              ${scenarios.map(scenario => `
                <div class="scenario ${scenario.color}">
                  <h5>${scenario.name}</h5>
                  <p>${scenario.description}</p>
                  <div class="scenario-stats">
                    <p><strong>Annual Expenses:</strong> $${scenario.expenses.toLocaleString()}</p>
                    <p><strong>FIRE Number:</strong> $${scenario.fireNumber.toLocaleString()}</p>
                    <p><strong>Monthly Budget:</strong> $${scenario.monthlyExpenses.toLocaleString()}</p>
                    ${scenario.partTimeIncome ? `<p><strong>Part-time Income:</strong> $${scenario.partTimeIncome.toLocaleString()}</p>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${timeline ? `
          <div class="fire-timeline">
            <h4>📅 10-Year Projection</h4>
            <div class="timeline-table">
              <div class="timeline-header">
                <span>Year</span>
                <span>Age</span>
                <span>Portfolio Value</span>
                <span>FIRE Progress</span>
              </div>
              ${timeline.slice(0, 11).map(item => `
                <div class="timeline-row ${item.progressToFIRE >= 100 ? 'fire-achieved' : ''}">
                  <span>${item.year}</span>
                  <span>${item.age}</span>
                  <span>$${item.balance.toLocaleString()}</span>
                  <span>${item.progressToFIRE.toFixed(1)}%${item.progressToFIRE >= 100 ? ' 🔥' : ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="fire-strategies">
          <h4>🚀 Strategies to Reach FIRE Faster</h4>
          <div class="strategies-grid">
            <div class="strategy-category">
              <h5>Increase Income</h5>
              <ul>
                <li>Negotiate salary raises</li>
                <li>Develop new skills for promotions</li>
                <li>Start side hustles or freelancing</li>
                <li>Create passive income streams</li>
              </ul>
            </div>
            <div class="strategy-category">
              <h5>Reduce Expenses</h5>
              <ul>
                <li>Track and optimize spending</li>
                <li>Reduce housing costs (biggest expense)</li>
                <li>Cook at home more often</li>
                <li>Eliminate or reduce subscriptions</li>
              </ul>
            </div>
            <div class="strategy-category">
              <h5>Optimize Investments</h5>
              <ul>
                <li>Maximize tax-advantaged accounts</li>
                <li>Invest in low-cost index funds</li>
                <li>Consider geographic arbitrage</li>
                <li>Rebalance portfolio regularly</li>
              </ul>
            </div>
            <div class="strategy-category">
              <h5>Alternative Approaches</h5>
              <ul>
                <li>Consider Barista FIRE (part-time work)</li>
                <li>Geographic arbitrage (lower cost areas)</li>
                <li>House hacking for rental income</li>
                <li>Coast FIRE (let compound growth work)</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="fire-withdrawal-strategy">
          <h4>💸 Withdrawal Strategy in FIRE</h4>
          <ul>
            <li><strong>Bond Tent:</strong> Gradually shift to more bonds as you approach FIRE</li>
            <li><strong>Bucket Strategy:</strong> Separate short-term, medium-term, and long-term investments</li>
            <li><strong>Roth Ladder:</strong> Convert traditional IRA to Roth for tax-free withdrawals</li>
            <li><strong>Taxable First:</strong> Use taxable accounts before touching retirement accounts</li>
            <li><strong>Flexible Spending:</strong> Adjust withdrawal amounts based on market performance</li>
          </ul>
        </div>

        <div class="fire-considerations">
          <h4>⚠️ Important FIRE Considerations</h4>
          <ul>
            <li><strong>Healthcare:</strong> Plan for health insurance costs without employer coverage</li>
            <li><strong>Sequence Risk:</strong> Poor market returns early in retirement can derail plans</li>
            <li><strong>Inflation:</strong> Long retirement periods are vulnerable to inflation erosion</li>
            <li><strong>Taxes:</strong> Understand tax implications of different account withdrawals</li>
            <li><strong>Flexibility:</strong> Build in flexibility for unexpected expenses or market changes</li>
            <li><strong>Purpose:</strong> Plan meaningful activities and purpose beyond work</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps Toward FIRE</h4>
          <ol>
            <li>Maximize your savings rate through income increases and expense reductions</li>
            <li>Invest in low-cost, diversified index funds</li>
            <li>Utilize tax-advantaged accounts (401k, IRA, HSA)</li>
            <li>Track your progress monthly and adjust as needed</li>
            <li>Consider geographic arbitrage for lower cost of living</li>
            <li>Plan for healthcare coverage in early retirement</li>
            <li>Develop multiple income streams and skills</li>
            <li>Connect with the FIRE community for support and ideas</li>
          </ol>
        </div>

        <div class="important-notes">
          <h4>📝 Important Disclaimers</h4>
          <ul>
            <li><strong>Market Risk:</strong> Projections assume consistent returns; actual results will vary</li>
            <li><strong>Inflation Impact:</strong> Future costs may be higher than projected</li>
            <li><strong>Life Changes:</strong> Family, health, or career changes may affect timeline</li>
            <li><strong>Withdrawal Rates:</strong> 4% rule may not be safe for very long retirements</li>
            <li><strong>Professional Advice:</strong> Consider consulting a financial advisor for personalized guidance</li>
          </ul>
        </div>
      </div>
    `;
  }
});