document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('amortization-form');
  const result = document.getElementById('amortization-result');
  const comparisonDiv = document.getElementById('payment-comparison');
  const chartsDiv = document.getElementById('amortization-charts');
  const scheduleDiv = document.getElementById('amortization-schedule');

  // Set default start date to current month
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);
  document.getElementById('startDate').value = currentMonth;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateAmortization();
  });

  // Toggle custom term field
  document.getElementById('loanTerm').addEventListener('change', function() {
    const customField = document.getElementById('customTerm');
    const isCustom = this.value === 'custom';
    customField.style.display = isCustom ? 'block' : 'none';
    customField.required = isCustom;
  });

  function calculateAmortization() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTermSelect = document.getElementById('loanTerm').value;
    const customTerm = parseFloat(document.getElementById('customTerm').value);
    const extraMonthly = parseFloat(document.getElementById('extraMonthly').value) || 0;
    const extraAnnual = parseFloat(document.getElementById('extraAnnual').value) || 0;
    const oneTimeExtra = parseFloat(document.getElementById('oneTimeExtra').value) || 0;
    const oneTimeMonth = parseInt(document.getElementById('oneTimeMonth').value) || 0;
    const paymentFrequency = document.getElementById('paymentFrequency').value;
    const taxBracket = parseFloat(document.getElementById('taxBracket').value) || 0;

    if (!loanAmount || !interestRate || (!loanTermSelect && !customTerm)) {
      result.innerHTML = '<div class="error">Please enter all required loan details.</div>';
      return;
    }

    const loanTermYears = loanTermSelect === 'custom' ? customTerm : parseFloat(loanTermSelect);
    
    // Calculate base loan without extra payments
    const baseLoan = calculateLoanSchedule(loanAmount, interestRate, loanTermYears, 0, 0, 0, 0, paymentFrequency);
    
    // Calculate loan with extra payments
    const extraLoan = calculateLoanSchedule(
      loanAmount, interestRate, loanTermYears, extraMonthly, extraAnnual, 
      oneTimeExtra, oneTimeMonth, paymentFrequency
    );

    displayResults(baseLoan, extraLoan, taxBracket);
    
    if (document.getElementById('compareScenarios').checked) {
      showComparison(loanAmount, interestRate, loanTermYears, extraMonthly, paymentFrequency);
    }

    if (document.getElementById('showCharts').checked) {
      showCharts(extraLoan);
    }

    showAmortizationSchedule(extraLoan);
  }

  function calculateLoanSchedule(principal, annualRate, years, extraMonthly, extraAnnual, oneTimeExtra, oneTimeMonth, frequency) {
    const monthlyRate = annualRate / 12 / 100;
    let totalMonths = years * 12;
    
    // Adjust for payment frequency
    let paymentsPerYear = 12;
    let periodRate = monthlyRate;
    
    if (frequency === 'biweekly') {
      paymentsPerYear = 26;
      periodRate = annualRate / 26 / 100;
      totalMonths = years * 26;
    } else if (frequency === 'weekly') {
      paymentsPerYear = 52;
      periodRate = annualRate / 52 / 100;
      totalMonths = years * 52;
    }

    // Calculate base payment
    let basePayment;
    if (periodRate === 0) {
      basePayment = principal / totalMonths;
    } else {
      basePayment = principal * (periodRate * Math.pow(1 + periodRate, totalMonths)) / 
                   (Math.pow(1 + periodRate, totalMonths) - 1);
    }

    const schedule = [];
    let remainingBalance = principal;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let paymentNumber = 0;
    let currentDate = new Date(document.getElementById('startDate').value + '-01');

    while (remainingBalance > 0.01 && paymentNumber < totalMonths * 2) {
      paymentNumber++;
      
      const interestPayment = remainingBalance * periodRate;
      let principalPayment = basePayment - interestPayment;
      
      // Add extra payments
      let extraPayment = extraMonthly;
      
      // Add annual extra payment
      if (frequency === 'monthly') {
        const extraAnnualMonth = parseInt(document.getElementById('extraAnnualMonth').value);
        if (currentDate.getMonth() + 1 === extraAnnualMonth && extraAnnual > 0) {
          extraPayment += extraAnnual;
        }
      }
      
      // Add one-time extra payment
      if (paymentNumber === oneTimeMonth && oneTimeExtra > 0) {
        extraPayment += oneTimeExtra;
      }
      
      // Don't pay more than remaining balance
      const totalPrincipalPayment = Math.min(principalPayment + extraPayment, remainingBalance);
      const actualPayment = interestPayment + totalPrincipalPayment;
      
      remainingBalance -= totalPrincipalPayment;
      totalInterest += interestPayment;
      totalPrincipal += totalPrincipalPayment;

      schedule.push({
        paymentNumber,
        date: new Date(currentDate),
        payment: actualPayment,
        principal: totalPrincipalPayment,
        interest: interestPayment,
        extraPayment: extraPayment,
        balance: remainingBalance
      });

      // Advance date based on frequency
      if (frequency === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (frequency === 'biweekly') {
        currentDate.setDate(currentDate.getDate() + 14);
      } else if (frequency === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      }

      if (remainingBalance <= 0.01) break;
    }

    return {
      schedule,
      basePayment,
      totalPayments: paymentNumber,
      totalInterest,
      totalPrincipal,
      totalPaid: totalInterest + totalPrincipal,
      payoffDate: schedule[schedule.length - 1]?.date,
      frequency
    };
  }

  function displayResults(baseLoan, extraLoan, taxBracket) {
    const interestSaved = baseLoan.totalInterest - extraLoan.totalInterest;
    const timeSaved = baseLoan.totalPayments - extraLoan.totalPayments;
    const taxDeduction = (baseLoan.totalInterest * taxBracket / 100);
    const taxSavings = (interestSaved * taxBracket / 100);

    let resultHtml = `
      <div class="result-summary">
        <h3>📊 Loan Analysis Summary</h3>
        <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="result-item">
            <strong>Base Payment:</strong> $${baseLoan.basePayment.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Payment Frequency:</strong> ${extraLoan.frequency}
          </div>
          <div class="result-item">
            <strong>Total Payments:</strong> ${extraLoan.totalPayments}
          </div>
          <div class="result-item">
            <strong>Payoff Date:</strong> ${extraLoan.payoffDate ? extraLoan.payoffDate.toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      <div class="comparison-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
        <div class="loan-scenario">
          <h4>🏦 Base Loan (No Extra Payments)</h4>
          <div class="scenario-details">
            <div><strong>Monthly Payment:</strong> $${baseLoan.basePayment.toFixed(2)}</div>
            <div><strong>Total Interest:</strong> $${baseLoan.totalInterest.toFixed(2)}</div>
            <div><strong>Total Paid:</strong> $${baseLoan.totalPaid.toFixed(2)}</div>
            <div><strong>Payoff Time:</strong> ${Math.floor(baseLoan.totalPayments / 12)} years ${baseLoan.totalPayments % 12} payments</div>
          </div>
        </div>

        <div class="loan-scenario">
          <h4>💰 With Extra Payments</h4>
          <div class="scenario-details">
            <div><strong>Base + Extra:</strong> $${(extraLoan.basePayment + (parseFloat(document.getElementById('extraMonthly').value) || 0)).toFixed(2)}</div>
            <div><strong>Total Interest:</strong> $${extraLoan.totalInterest.toFixed(2)}</div>
            <div><strong>Total Paid:</strong> $${extraLoan.totalPaid.toFixed(2)}</div>
            <div><strong>Payoff Time:</strong> ${Math.floor(extraLoan.totalPayments / 12)} years ${extraLoan.totalPayments % 12} payments</div>
          </div>
        </div>
      </div>
    `;

    if (interestSaved > 0) {
      resultHtml += `
        <div class="savings-summary" style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 0.5rem; padding: 1rem; margin-top: 2rem;">
          <h4 style="color: #155724; margin-bottom: 1rem;">💡 Savings with Extra Payments</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div><strong>Interest Saved:</strong> $${interestSaved.toFixed(2)}</div>
            <div><strong>Time Saved:</strong> ${Math.floor(timeSaved / 12)} years ${timeSaved % 12} payments</div>
            <div><strong>Savings Rate:</strong> ${((interestSaved / baseLoan.totalInterest) * 100).toFixed(1)}%</div>
            <div><strong>ROI on Extra Payments:</strong> ${(baseLoan.schedule[0]?.interest / baseLoan.basePayment * 100).toFixed(1)}%</div>
          </div>
        </div>
      `;
    }

    if (document.getElementById('showTaxDeduction').checked && taxBracket > 0) {
      resultHtml += `
        <div class="tax-analysis" style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 0.5rem; padding: 1rem; margin-top: 2rem;">
          <h4 style="color: #856404; margin-bottom: 1rem;">📋 Tax Deduction Analysis</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div><strong>Tax Bracket:</strong> ${taxBracket}%</div>
            <div><strong>Total Interest Deduction:</strong> $${taxDeduction.toFixed(2)}</div>
            <div><strong>Effective Interest Rate:</strong> ${(parseFloat(document.getElementById('interestRate').value) * (1 - taxBracket / 100)).toFixed(2)}%</div>
            <div><strong>Tax Savings from Extra Payments:</strong> $${taxSavings.toFixed(2)}</div>
          </div>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #856404;">
            <strong>Note:</strong> Tax deductions reduce your taxable income, not your tax bill directly. 
            Consult a tax professional for specific advice.
          </p>
        </div>
      `;
    }

    resultHtml += `
      <div class="insights" style="margin-top: 2rem;">
        <h4>💡 Key Insights</h4>
        <ul>
    `;

    if (interestSaved > 10000) {
      resultHtml += `<li class="highlight"><strong>Significant Savings:</strong> Extra payments save over $${Math.floor(interestSaved / 1000)}k in interest</li>`;
    }

    const interestToTotal = (extraLoan.totalInterest / extraLoan.totalPaid) * 100;
    if (interestToTotal > 50) {
      resultHtml += `<li class="warning"><strong>High Interest Cost:</strong> ${interestToTotal.toFixed(1)}% of total payments go to interest</li>`;
    }

    const currentRate = parseFloat(document.getElementById('interestRate').value);
    if (currentRate > 7) {
      resultHtml += `<li class="warning"><strong>High Rate:</strong> Consider refinancing or aggressive extra payments</li>`;
    }

    if (extraLoan.totalPayments < baseLoan.totalPayments / 2) {
      resultHtml += `<li class="highlight"><strong>Excellent Strategy:</strong> Extra payments cut loan term by more than half</li>`;
    }

    resultHtml += `
        </ul>
      </div>
    `;

    result.innerHTML = resultHtml;
  }

  function showComparison(principal, baseRate, baseYears, baseExtra, frequency) {
    const scenarios = [
      { name: 'Current Scenario', rate: baseRate, years: baseYears, extra: baseExtra },
      { name: 'Lower Rate', rate: parseFloat(document.getElementById('compareRate1').value) || baseRate - 1, years: baseYears, extra: baseExtra },
      { name: 'Higher Rate', rate: parseFloat(document.getElementById('compareRate2').value) || baseRate + 1, years: baseYears, extra: baseExtra },
      { name: 'Shorter Term', rate: baseRate, years: parseFloat(document.getElementById('compareTerm1').value) || 15, extra: baseExtra },
      { name: 'Longer Term', rate: baseRate, years: parseFloat(document.getElementById('compareTerm2').value) || 30, extra: baseExtra },
      { name: 'More Extra Payment', rate: baseRate, years: baseYears, extra: parseFloat(document.getElementById('compareExtra').value) || baseExtra + 200 }
    ];

    const comparisonBody = document.getElementById('comparison-body');
    comparisonBody.innerHTML = '';

    const baseLoan = calculateLoanSchedule(principal, baseRate, baseYears, baseExtra, 0, 0, 0, frequency);

    scenarios.forEach(scenario => {
      const loan = calculateLoanSchedule(principal, scenario.rate, scenario.years, scenario.extra, 0, 0, 0, frequency);
      const interestSaved = baseLoan.totalInterest - loan.totalInterest;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">${scenario.name}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${(loan.basePayment + scenario.extra).toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${loan.totalInterest.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${loan.totalPaid.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">${Math.floor(loan.totalPayments / 12)}y ${loan.totalPayments % 12}m</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd; color: ${interestSaved >= 0 ? 'green' : 'red'};">
          ${interestSaved >= 0 ? '+' : ''}$${interestSaved.toFixed(2)}
        </td>
      `;
      comparisonBody.appendChild(row);
    });

    comparisonDiv.style.display = 'block';
  }

  function showCharts(loan) {
    // This would require a charting library like Chart.js
    // For now, we'll show a placeholder
    chartsDiv.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 0.5rem;">
        <h4>📈 Amortization Charts</h4>
        <p>Interactive charts showing principal vs interest breakdown and remaining balance over time would be displayed here with a charting library like Chart.js.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
          <div style="height: 200px; background: #e9ecef; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">
            Principal vs Interest Chart
          </div>
          <div style="height: 200px; background: #e9ecef; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">
            Remaining Balance Chart
          </div>
        </div>
      </div>
    `;
    chartsDiv.style.display = 'block';
  }

  function showAmortizationSchedule(loan) {
    const displayOption = document.getElementById('displayMonths').value;
    const scheduleBody = document.getElementById('schedule-body');
    scheduleBody.innerHTML = '';

    let scheduleToShow = loan.schedule;
    
    if (displayOption === 'yearly') {
      // Group by year
      scheduleToShow = groupByYear(loan.schedule);
    } else if (displayOption !== 'all') {
      const limit = parseInt(displayOption);
      scheduleToShow = loan.schedule.slice(0, limit);
    }

    scheduleToShow.forEach(payment => {
      const row = document.createElement('tr');
      
      if (displayOption === 'yearly') {
        row.innerHTML = `
          <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">Year ${payment.year}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">${payment.date}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.totalPayments.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.totalPrincipal.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.totalInterest.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.totalExtra.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.endBalance.toFixed(2)}</td>
        `;
      } else {
        row.innerHTML = `
          <td style="padding: 0.5rem; border: 1px solid #ddd;">${payment.paymentNumber}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">${payment.date.toLocaleDateString()}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.payment.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${(payment.principal - payment.extraPayment).toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.interest.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.extraPayment.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${payment.balance.toFixed(2)}</td>
        `;
      }
      
      scheduleBody.appendChild(row);
    });

    // Update table headers for yearly view
    if (displayOption === 'yearly') {
      const headers = document.querySelectorAll('#schedule-table th');
      headers[0].textContent = 'Year';
      headers[1].textContent = 'Period';
      headers[2].textContent = 'Total Payments';
      headers[3].textContent = 'Total Principal';
      headers[4].textContent = 'Total Interest';
      headers[5].textContent = 'Total Extra';
      headers[6].textContent = 'End Balance';
    } else {
      const headers = document.querySelectorAll('#schedule-table th');
      headers[0].textContent = 'Payment #';
      headers[1].textContent = 'Date';
      headers[2].textContent = 'Payment';
      headers[3].textContent = 'Principal';
      headers[4].textContent = 'Interest';
      headers[5].textContent = 'Extra';
      headers[6].textContent = 'Balance';
    }

    scheduleDiv.style.display = 'block';
  }

  function groupByYear(schedule) {
    const yearlyData = [];
    let currentYear = new Date(schedule[0].date).getFullYear();
    let yearData = {
      year: currentYear,
      date: `${currentYear}`,
      totalPayments: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalExtra: 0,
      endBalance: 0
    };

    schedule.forEach(payment => {
      const paymentYear = new Date(payment.date).getFullYear();
      
      if (paymentYear !== currentYear) {
        yearlyData.push(yearData);
        currentYear = paymentYear;
        yearData = {
          year: currentYear,
          date: `${currentYear}`,
          totalPayments: 0,
          totalPrincipal: 0,
          totalInterest: 0,
          totalExtra: 0,
          endBalance: 0
        };
      }
      
      yearData.totalPayments += payment.payment;
      yearData.totalPrincipal += payment.principal - payment.extraPayment;
      yearData.totalInterest += payment.interest;
      yearData.totalExtra += payment.extraPayment;
      yearData.endBalance = payment.balance;
    });

    if (yearData.totalPayments > 0) {
      yearlyData.push(yearData);
    }

    return yearlyData;
  }
});