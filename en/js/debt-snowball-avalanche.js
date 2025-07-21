document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("debt-payoff-form");
  const resultDiv = document.getElementById("debt-payoff-result");
  const addDebtBtn = document.getElementById("add-debt");
  const removeDebtBtn = document.getElementById("remove-debt");
  const debtList = document.getElementById("debt-list");
  
  let debtCount = 1;

  // Add debt functionality
  addDebtBtn.addEventListener("click", function() {
    if (debtCount < 10) { // Limit to 10 debts
      debtCount++;
      const newDebt = createDebtItem(debtCount);
      debtList.appendChild(newDebt);
    }
  });

  // Remove debt functionality
  removeDebtBtn.addEventListener("click", function() {
    if (debtCount > 1) {
      const lastDebt = debtList.querySelector(`[data-debt="${debtCount}"]`);
      if (lastDebt) {
        lastDebt.remove();
        debtCount--;
      }
    }
  });

  function createDebtItem(number) {
    const div = document.createElement('div');
    div.className = 'debt-item';
    div.setAttribute('data-debt', number);
    div.innerHTML = `
      <h4>Debt #${number}</h4>
      <label for="debt${number}-name">Debt Name:</label>
      <input type="text" id="debt${number}-name" value="Debt ${number}" required>
      
      <label for="debt${number}-balance">Current Balance ($):</label>
      <input type="number" id="debt${number}-balance" min="0" step="0.01" value="3000" required>
      
      <label for="debt${number}-rate">Interest Rate (% annual):</label>
      <input type="number" id="debt${number}-rate" min="0" max="50" step="0.01" value="15.99" required>
      
      <label for="debt${number}-minimum">Minimum Payment ($):</label>
      <input type="number" id="debt${number}-minimum" min="0" step="0.01" value="75" required>
    `;
    return div;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateDebtPayoff();
  });

  function calculateDebtPayoff() {
    // Collect debt data
    const debts = [];
    for (let i = 1; i <= debtCount; i++) {
      const name = document.getElementById(`debt${i}-name`)?.value || `Debt ${i}`;
      const balance = parseFloat(document.getElementById(`debt${i}-balance`)?.value) || 0;
      const rate = parseFloat(document.getElementById(`debt${i}-rate`)?.value) / 100 || 0;
      const minimum = parseFloat(document.getElementById(`debt${i}-minimum`)?.value) || 0;
      
      if (balance > 0) {
        debts.push({
          id: i,
          name: name,
          balance: balance,
          rate: rate,
          minimum: minimum,
          originalBalance: balance
        });
      }
    }

    const extraPayment = parseFloat(document.getElementById("extra-payment").value) || 0;
    const showTimeline = document.getElementById("show-timeline").checked;
    const showMotivation = document.getElementById("show-motivation").checked;
    const showHybrid = document.getElementById("show-hybrid").checked;

    if (debts.length === 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter at least one debt with a positive balance.</p>';
      return;
    }

    // Calculate total minimum payment
    const totalMinimums = debts.reduce((sum, debt) => sum + debt.minimum, 0);
    const totalAvailable = totalMinimums + extraPayment;

    // Calculate snowball strategy
    const snowballResult = calculateStrategy(debts, totalAvailable, 'snowball');
    
    // Calculate avalanche strategy  
    const avalancheResult = calculateStrategy(debts, totalAvailable, 'avalanche');

    // Calculate hybrid strategies if requested
    let hybridResults = [];
    if (showHybrid) {
      hybridResults = calculateHybridStrategies(debts, totalAvailable);
    }

    displayResults({
      debts,
      extraPayment,
      totalAvailable,
      snowball: snowballResult,
      avalanche: avalancheResult,
      hybrid: hybridResults,
      showTimeline,
      showMotivation,
      showHybrid
    });
  }

  function calculateStrategy(debts, totalPayment, strategy) {
    // Create deep copy of debts
    const debtsCopy = debts.map(debt => ({...debt}));
    let month = 0;
    let totalInterestPaid = 0;
    const payoffOrder = [];
    const monthlyBreakdown = [];

    while (debtsCopy.some(debt => debt.balance > 0) && month < 600) { // 50 year max
      month++;
      let remainingPayment = totalPayment;
      let monthlyInterest = 0;

      // Calculate interest for all debts
      debtsCopy.forEach(debt => {
        if (debt.balance > 0) {
          const monthlyInterestAmount = debt.balance * (debt.rate / 12);
          debt.balance += monthlyInterestAmount;
          monthlyInterest += monthlyInterestAmount;
          totalInterestPaid += monthlyInterestAmount;
        }
      });

      // Sort debts based on strategy
      let sortedDebts;
      if (strategy === 'snowball') {
        sortedDebts = debtsCopy.filter(d => d.balance > 0).sort((a, b) => a.balance - b.balance);
      } else { // avalanche
        sortedDebts = debtsCopy.filter(d => d.balance > 0).sort((a, b) => b.rate - a.rate);
      }

      // Pay minimums first
      sortedDebts.forEach(debt => {
        if (debt.balance > 0 && remainingPayment > 0) {
          const minimumPayment = Math.min(debt.minimum, debt.balance, remainingPayment);
          debt.balance -= minimumPayment;
          remainingPayment -= minimumPayment;
        }
      });

      // Apply extra payment to target debt
      if (remainingPayment > 0 && sortedDebts.length > 0) {
        const targetDebt = sortedDebts[0];
        const extraToTarget = Math.min(remainingPayment, targetDebt.balance);
        targetDebt.balance -= extraToTarget;
        remainingPayment -= extraToTarget;
      }

      // Check for paid off debts
      debtsCopy.forEach(debt => {
        if (debt.balance <= 0.01 && debt.balance > -0.01 && !payoffOrder.find(p => p.id === debt.id)) {
          payoffOrder.push({
            id: debt.id,
            name: debt.name,
            month: month,
            originalBalance: debt.originalBalance
          });
          debt.balance = 0;
        }
      });

      // Store monthly breakdown
      if (monthlyBreakdown.length < 60) { // Store first 5 years for timeline
        monthlyBreakdown.push({
          month: month,
          totalBalance: debtsCopy.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0),
          monthlyInterest: monthlyInterest,
          debts: debtsCopy.map(debt => ({
            name: debt.name,
            balance: Math.max(0, debt.balance)
          }))
        });
      }
    }

    return {
      months: month,
      years: (month / 12).toFixed(1),
      totalInterest: totalInterestPaid,
      payoffOrder: payoffOrder,
      monthlyBreakdown: monthlyBreakdown
    };
  }

  function calculateHybridStrategies(debts, totalPayment) {
    const strategies = [];
    
    // Strategy 1: Small debts first (under $1000), then avalanche
    const hybrid1 = calculateHybridStrategy(debts, totalPayment, 'small-first-avalanche', 1000);
    strategies.push({
      name: "Small Debts First ($1000+), then Avalanche",
      description: "Pay off debts under $1000 first, then highest interest rates",
      ...hybrid1
    });

    // Strategy 2: High-rate debts first (over 20%), then snowball
    const hybrid2 = calculateHybridStrategy(debts, totalPayment, 'high-rate-first', 0.20);
    strategies.push({
      name: "High Rate First (20%+), then Snowball",
      description: "Pay off debts over 20% interest first, then smallest balances",
      ...hybrid2
    });

    return strategies;
  }

  function calculateHybridStrategy(debts, totalPayment, type, threshold) {
    const debtsCopy = debts.map(debt => ({...debt}));
    let month = 0;
    let totalInterestPaid = 0;
    const payoffOrder = [];
    let phase = 1; // Track which phase we're in

    while (debtsCopy.some(debt => debt.balance > 0) && month < 600) {
      month++;
      let remainingPayment = totalPayment;
      let monthlyInterest = 0;

      // Calculate interest
      debtsCopy.forEach(debt => {
        if (debt.balance > 0) {
          const monthlyInterestAmount = debt.balance * (debt.rate / 12);
          debt.balance += monthlyInterestAmount;
          monthlyInterest += monthlyInterestAmount;
          totalInterestPaid += monthlyInterestAmount;
        }
      });

      // Determine target debt based on hybrid strategy
      let targetDebt = null;
      const activeDebts = debtsCopy.filter(d => d.balance > 0);

      if (type === 'small-first-avalanche') {
        const smallDebts = activeDebts.filter(d => d.originalBalance < threshold);
        if (smallDebts.length > 0) {
          targetDebt = smallDebts.sort((a, b) => a.balance - b.balance)[0];
          phase = 1;
        } else {
          targetDebt = activeDebts.sort((a, b) => b.rate - a.rate)[0];
          phase = 2;
        }
      } else if (type === 'high-rate-first') {
        const highRateDebts = activeDebts.filter(d => d.rate > threshold);
        if (highRateDebts.length > 0) {
          targetDebt = highRateDebts.sort((a, b) => b.rate - a.rate)[0];
          phase = 1;
        } else {
          targetDebt = activeDebts.sort((a, b) => a.balance - b.balance)[0];
          phase = 2;
        }
      }

      // Pay minimums
      activeDebts.forEach(debt => {
        if (remainingPayment > 0) {
          const minimumPayment = Math.min(debt.minimum, debt.balance, remainingPayment);
          debt.balance -= minimumPayment;
          remainingPayment -= minimumPayment;
        }
      });

      // Apply extra to target
      if (remainingPayment > 0 && targetDebt) {
        const extraToTarget = Math.min(remainingPayment, targetDebt.balance);
        targetDebt.balance -= extraToTarget;
      }

      // Check for payoffs
      debtsCopy.forEach(debt => {
        if (debt.balance <= 0.01 && debt.balance > -0.01 && !payoffOrder.find(p => p.id === debt.id)) {
          payoffOrder.push({
            id: debt.id,
            name: debt.name,
            month: month,
            originalBalance: debt.originalBalance
          });
          debt.balance = 0;
        }
      });
    }

    return {
      months: month,
      years: (month / 12).toFixed(1),
      totalInterest: totalInterestPaid,
      payoffOrder: payoffOrder
    };
  }

  function displayResults(data) {
    const {
      debts,
      extraPayment,
      totalAvailable,
      snowball,
      avalanche,
      hybrid,
      showTimeline,
      showMotivation,
      showHybrid
    } = data;

    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const interestSavings = snowball.totalInterest - avalanche.totalInterest;
    const timeSavings = snowball.months - avalanche.months;

    // Determine recommendation
    const recommendation = getRecommendation(snowball, avalanche, debts);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>💳 Debt Payoff Strategy Analysis</h3>
        
        <div class="debt-summary">
          <h4>Your Debt Overview</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Total Debt:</span>
              <span class="value">$${totalDebt.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Number of Debts:</span>
              <span class="value">${debts.length}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Minimum Payments:</span>
              <span class="value">$${(totalAvailable - extraPayment).toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Extra Payment Available:</span>
              <span class="value">$${extraPayment.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Monthly Payment:</span>
              <span class="value">$${totalAvailable.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="strategy-comparison">
          <h4>📊 Strategy Comparison</h4>
          <div class="comparison-table">
            <div class="comparison-header">
              <div class="metric">Metric</div>
              <div class="snowball">Debt Snowball</div>
              <div class="avalanche">Debt Avalanche</div>
              <div class="difference">Difference</div>
            </div>
            
            <div class="comparison-row">
              <div class="metric">Payoff Time</div>
              <div class="snowball">${snowball.years} years (${snowball.months} months)</div>
              <div class="avalanche">${avalanche.years} years (${avalanche.months} months)</div>
              <div class="difference ${timeSavings > 0 ? 'avalanche-better' : timeSavings < 0 ? 'snowball-better' : 'equal'}">
                ${timeSavings > 0 ? `${timeSavings} months faster` : 
                  timeSavings < 0 ? `${Math.abs(timeSavings)} months slower` : 'Same time'}
              </div>
            </div>
            
            <div class="comparison-row">
              <div class="metric">Total Interest Paid</div>
              <div class="snowball">$${snowball.totalInterest.toLocaleString()}</div>
              <div class="avalanche">$${avalanche.totalInterest.toLocaleString()}</div>
              <div class="difference ${interestSavings > 0 ? 'avalanche-better' : interestSavings < 0 ? 'snowball-better' : 'equal'}">
                ${interestSavings > 0 ? `$${interestSavings.toLocaleString()} savings` : 
                  interestSavings < 0 ? `$${Math.abs(interestSavings).toLocaleString()} more` : 'Same cost'}
              </div>
            </div>
            
            <div class="comparison-row">
              <div class="metric">Total Cost</div>
              <div class="snowball">$${(totalDebt + snowball.totalInterest).toLocaleString()}</div>
              <div class="avalanche">$${(totalDebt + avalanche.totalInterest).toLocaleString()}</div>
              <div class="difference ${interestSavings > 0 ? 'avalanche-better' : interestSavings < 0 ? 'snowball-better' : 'equal'}">
                ${interestSavings > 0 ? `$${interestSavings.toLocaleString()} total savings` : 
                  interestSavings < 0 ? `$${Math.abs(interestSavings).toLocaleString()} more total` : 'Same total cost'}
              </div>
            </div>
          </div>
        </div>

        <div class="recommendation">
          <h4>🎯 Our Recommendation</h4>
          <div class="recommendation-box ${recommendation.method}">
            <h5>${recommendation.title}</h5>
            <p>${recommendation.reason}</p>
            <ul>
              ${recommendation.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="payoff-order">
          <h4>📅 Debt Payoff Order</h4>
          <div class="payoff-comparison">
            <div class="payoff-method">
              <h5>Snowball Method</h5>
              <div class="payoff-list">
                ${snowball.payoffOrder.map((debt, index) => `
                  <div class="payoff-item">
                    <span class="order">#${index + 1}</span>
                    <span class="debt-name">${debt.name}</span>
                    <span class="payoff-time">Month ${debt.month}</span>
                    <span class="balance">$${debt.originalBalance.toLocaleString()}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="payoff-method">
              <h5>Avalanche Method</h5>
              <div class="payoff-list">
                ${avalanche.payoffOrder.map((debt, index) => `
                  <div class="payoff-item">
                    <span class="order">#${index + 1}</span>
                    <span class="debt-name">${debt.name}</span>
                    <span class="payoff-time">Month ${debt.month}</span>
                    <span class="balance">$${debt.originalBalance.toLocaleString()}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        ${showHybrid && hybrid.length > 0 ? `
          <div class="hybrid-strategies">
            <h4>🔄 Hybrid Strategy Options</h4>
            ${hybrid.map(strategy => `
              <div class="hybrid-option">
                <h5>${strategy.name}</h5>
                <p>${strategy.description}</p>
                <div class="hybrid-stats">
                  <span>Payoff Time: ${strategy.years} years</span>
                  <span>Total Interest: $${strategy.totalInterest.toLocaleString()}</span>
                  <span>vs Snowball: ${strategy.totalInterest < snowball.totalInterest ? 
                    '$' + (snowball.totalInterest - strategy.totalInterest).toLocaleString() + ' savings' : 
                    '$' + (strategy.totalInterest - snowball.totalInterest).toLocaleString() + ' more'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${showMotivation ? `
          <div class="motivation-analysis">
            <h4>🧠 Psychological Factors</h4>
            <div class="motivation-grid">
              <div class="motivation-factor">
                <h5>Snowball Motivation</h5>
                <ul>
                  <li>First payoff in ${snowball.payoffOrder[0]?.month || 'N/A'} months</li>
                  <li>Quick wins build momentum</li>
                  <li>Simplified decision making</li>
                  <li>Visible progress early on</li>
                  <li>Good for emotional spenders</li>
                </ul>
              </div>
              <div class="motivation-factor">
                <h5>Avalanche Benefits</h5>
                <ul>
                  <li>Mathematically optimal</li>
                  <li>Maximum interest savings</li>
                  <li>Logical, numbers-based approach</li>
                  <li>Best for disciplined people</li>
                  <li>Ideal if rates vary significantly</li>
                </ul>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="debt-tips">
          <h4>💡 Debt Payoff Success Tips</h4>
          <ul>
            <li><strong>Stop Creating New Debt:</strong> Put credit cards away, create a budget</li>
            <li><strong>Find Extra Money:</strong> Side hustles, selling items, reducing expenses</li>
            <li><strong>Automate Payments:</strong> Set up automatic payments to avoid missed payments</li>
            <li><strong>Track Progress:</strong> Use apps or spreadsheets to visualize progress</li>
            <li><strong>Celebrate Milestones:</strong> Reward yourself for each debt paid off</li>
            <li><strong>Build Emergency Fund:</strong> Save $1,000 emergency fund to avoid new debt</li>
            <li><strong>Consider Balance Transfers:</strong> Lower rates can save money if disciplined</li>
            <li><strong>Stay Motivated:</strong> Remember your why - freedom, peace of mind, goals</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps</h4>
          <ol>
            <li>Choose your debt payoff method based on your personality and situation</li>
            <li>Set up automatic minimum payments for all debts</li>
            <li>Apply extra payments to your target debt each month</li>
            <li>Track your progress monthly and celebrate milestones</li>
            <li>Avoid creating new debt during payoff period</li>
            <li>Consider increasing payments when income rises</li>
            <li>Plan what to do with payments after debt is gone (emergency fund, investing)</li>
          </ol>
        </div>

        <div class="important-notes">
          <h4>📝 Important Considerations</h4>
          <ul>
            <li><strong>Minimum Payments:</strong> Always pay at least minimums to avoid late fees</li>
            <li><strong>Credit Score:</strong> Both methods will improve credit as balances decrease</li>
            <li><strong>Emergency Fund:</strong> Maintain small emergency fund to avoid new debt</li>
            <li><strong>High-Interest Debt:</strong> Consider avalanche method for rates above 20%</li>
            <li><strong>Consistency:</strong> The best method is the one you'll stick with</li>
            <li><strong>Professional Help:</strong> Consider credit counseling for complex situations</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getRecommendation(snowball, avalanche, debts) {
    const interestSavings = snowball.totalInterest - avalanche.totalInterest;
    const timeSavings = snowball.months - avalanche.months;
    
    // Calculate interest rate spread
    const rates = debts.map(d => d.rate).sort((a, b) => b - a);
    const rateSpread = rates[0] - rates[rates.length - 1];
    
    // Calculate balance variations
    const balances = debts.map(d => d.balance).sort((a, b) => b - a);
    const largestBalance = balances[0];
    const smallestBalance = balances[balances.length - 1];
    
    if (interestSavings > 1000 || rateSpread > 0.10) {
      return {
        method: 'avalanche',
        title: 'Debt Avalanche Method Recommended',
        reason: `The avalanche method will save you $${interestSavings.toLocaleString()} in interest${timeSavings > 0 ? ` and ${timeSavings} months` : ''}.`,
        benefits: [
          'Significant interest savings justify the approach',
          'Large interest rate differences favor avalanche',
          'Mathematically optimal solution',
          'Better long-term financial outcome'
        ]
      };
    } else if (interestSavings < 500 && largestBalance / smallestBalance > 3) {
      return {
        method: 'snowball',
        title: 'Debt Snowball Method Recommended',
        reason: 'Small interest savings make motivation more important than mathematical optimization.',
        benefits: [
          'Quick psychological wins build momentum',
          'Interest savings difference is minimal',
          'Easier to stay motivated with visible progress',
          'Higher success rate for most people'
        ]
      };
    } else {
      return {
        method: 'either',
        title: 'Either Method Works Well',
        reason: 'Both methods have similar outcomes. Choose based on your personality.',
        benefits: [
          'Modest difference in interest costs',
          'Choose snowball if you need motivation',
          'Choose avalanche if you prefer saving money',
          'Consistency matters more than method'
        ]
      };
    }
  }
});