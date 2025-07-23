document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('student-loan-form');
  const result = document.getElementById('student-loan-result');
  const comparisonDiv = document.getElementById('repayment-comparison');
  const pslfDiv = document.getElementById('pslf-analysis');

  // Federal poverty guidelines (user can update these if needed)
  let povertyGuidelines = {
    1: 14580,
    2: 19720,
    3: 24860,
    4: 30000,
    5: 35140,
    6: 40280,
    7: 45420,
    8: 50560
  };

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateStudentLoan();
  });

  function calculateStudentLoan() {
    const loanBalance = parseFloat(document.getElementById('loanBalance').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanType = document.getElementById('loanType').value;
    const repaymentPlan = document.getElementById('repaymentPlan').value;
    const customPayment = parseFloat(document.getElementById('customPayment').value) || 0;
    const extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;
    const annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    const familySize = parseInt(document.getElementById('familySize').value) || 1;
    const includeAutopay = document.getElementById('includeAutopay').checked;
    const includePslf = document.getElementById('includePslf').checked;
    const payoffGoal = document.getElementById('payoffGoal').value;

    if (!loanBalance || !interestRate) {
      result.innerHTML = '<div class="error">Please enter loan balance and interest rate.</div>';
      return;
    }

    // Apply autopay discount
    const adjustedRate = includeAutopay ? Math.max(0, interestRate - 0.25) : interestRate;
    const monthlyRate = adjustedRate / 12 / 100;

    let monthlyPayment;
    let totalInterest;
    let payoffTime;
    let forgiveAmount = 0;

    // Calculate payment based on repayment plan
    if (repaymentPlan === 'custom') {
      monthlyPayment = customPayment + extraPayment;
      const calculation = calculateLoanDetails(loanBalance, monthlyRate, monthlyPayment);
      totalInterest = calculation.totalInterest;
      payoffTime = calculation.months;
    } else if (repaymentPlan.startsWith('idr-')) {
      const idrResult = calculateIncomeBasedPayment(repaymentPlan, annualIncome, familySize, loanBalance, monthlyRate);
      monthlyPayment = idrResult.payment + extraPayment;
      totalInterest = idrResult.totalInterest;
      payoffTime = idrResult.months;
      forgiveAmount = idrResult.forgiveAmount;
    } else {
      const standardResult = calculateStandardPayment(repaymentPlan, loanBalance, monthlyRate);
      monthlyPayment = standardResult.payment + extraPayment;
      const calculation = calculateLoanDetails(loanBalance, monthlyRate, monthlyPayment);
      totalInterest = calculation.totalInterest;
      payoffTime = calculation.months;
    }

    displayResults(monthlyPayment, totalInterest, payoffTime, loanBalance, forgiveAmount, adjustedRate);
    
    if (includePslf) {
      calculatePSLFAnalysis(loanBalance, monthlyRate, annualIncome, familySize);
    }

    showRepaymentComparison(loanBalance, monthlyRate, annualIncome, familySize);
  }

  function calculateStandardPayment(plan, balance, monthlyRate) {
    let termMonths;
    
    switch(plan) {
      case 'standard':
        termMonths = 120; // 10 years
        break;
      case 'extended':
        termMonths = 300; // 25 years
        break;
      case 'graduated':
        termMonths = 120; // 10 years, but graduated
        return calculateGraduatedPayment(balance, monthlyRate);
      default:
        termMonths = 120;
    }

    if (monthlyRate === 0) {
      return { payment: balance / termMonths };
    }

    const payment = balance * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    return { payment: payment };
  }

  function calculateGraduatedPayment(balance, monthlyRate) {
    // Simplified graduated calculation - starts at ~50% of standard payment
    const standardPayment = balance * (monthlyRate * Math.pow(1 + monthlyRate, 120)) / 
                           (Math.pow(1 + monthlyRate, 120) - 1);
    return { payment: standardPayment * 0.5 }; // Starting payment
  }

  function calculateIncomeBasedPayment(plan, income, familySize, balance, monthlyRate) {
    if (!income) return { payment: 0, totalInterest: 0, months: 0, forgiveAmount: 0 };

    const povertyLine = povertyGuidelines[Math.min(familySize, 8)] || 
                       (povertyGuidelines[8] + (familySize - 8) * 5140);
    const discretionaryIncome = Math.max(0, income - (1.5 * povertyLine));

    let paymentPercent;
    let forgiveYears;

    switch(plan) {
      case 'idr-ibr':
        paymentPercent = 0.15; // 15% for new borrowers, 10% for older
        forgiveYears = 25;
        break;
      case 'idr-paye':
        paymentPercent = 0.10;
        forgiveYears = 20;
        break;
      case 'idr-repaye':
        paymentPercent = 0.10;
        forgiveYears = 20; // 25 for graduate loans
        break;
      case 'idr-icr':
        paymentPercent = 0.20;
        forgiveYears = 25;
        break;
      default:
        paymentPercent = 0.10;
        forgiveYears = 20;
    }

    const monthlyPayment = (discretionaryIncome * paymentPercent) / 12;
    const forgiveMonths = forgiveYears * 12;

    // Simulate payment over forgiveness period
    let remainingBalance = balance;
    let totalInterest = 0;
    
    for (let month = 1; month <= forgiveMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.max(0, monthlyPayment - interestPayment);
      
      totalInterest += interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);
      
      if (remainingBalance === 0) {
        return {
          payment: monthlyPayment,
          totalInterest: totalInterest,
          months: month,
          forgiveAmount: 0
        };
      }
    }

    return {
      payment: monthlyPayment,
      totalInterest: totalInterest,
      months: forgiveMonths,
      forgiveAmount: remainingBalance
    };
  }

  function calculateLoanDetails(balance, monthlyRate, payment) {
    if (payment <= 0) return { totalInterest: 0, months: 0 };

    let remainingBalance = balance;
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 600; // 50 years maximum

    while (remainingBalance > 0.01 && months < maxMonths) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(payment - interestPayment, remainingBalance);
      
      if (principalPayment <= 0) {
        // Payment doesn't cover interest - negative amortization
        remainingBalance += interestPayment;
        totalInterest += payment; // All payment goes to interest
      } else {
        totalInterest += interestPayment;
        remainingBalance -= principalPayment;
      }
      
      months++;
    }

    return { totalInterest, months };
  }

  function calculatePSLFAnalysis(balance, monthlyRate, income, familySize) {
    if (!income) return;

    // Calculate REPAYE payment for PSLF
    const repayeResult = calculateIncomeBasedPayment('idr-repaye', income, familySize, balance, monthlyRate);
    const payment120 = repayeResult.payment * 120; // 10 years of payments
    const savings = balance - payment120;

    const pslfHtml = `
      <div class="pslf-analysis">
        <h4>🏛️ PSLF Analysis</h4>
        <div class="result-grid">
          <div class="result-item">
            <strong>Monthly Payment (REPAYE):</strong> $${repayeResult.payment.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Total Payments (120 months):</strong> $${payment120.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Amount Forgiven:</strong> $${Math.max(0, savings).toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Potential Savings:</strong> $${Math.max(0, savings).toFixed(2)}
          </div>
        </div>
        <div class="pslf-requirements">
          <h5>PSLF Requirements:</h5>
          <ul>
            <li>Work for qualifying government or non-profit employer</li>
            <li>Make 120 qualifying payments on income-driven plan</li>
            <li>Have Direct Loans (consolidate if needed)</li>
            <li>Submit annual employment certification</li>
          </ul>
        </div>
      </div>
    `;

    pslfDiv.innerHTML = pslfHtml;
    pslfDiv.style.display = 'block';
  }

  function showRepaymentComparison(balance, monthlyRate, income, familySize) {
    const plans = [
      { name: 'Standard (10 yr)', plan: 'standard' },
      { name: 'Extended (25 yr)', plan: 'extended' },
      { name: 'IBR', plan: 'idr-ibr' },
      { name: 'PAYE', plan: 'idr-paye' },
      { name: 'REPAYE', plan: 'idr-repaye' }
    ];

    const comparisonBody = document.getElementById('comparison-body');
    comparisonBody.innerHTML = '';

    plans.forEach(planInfo => {
      let result;
      if (planInfo.plan.startsWith('idr-')) {
        result = calculateIncomeBasedPayment(planInfo.plan, income, familySize, balance, monthlyRate);
      } else {
        const standardResult = calculateStandardPayment(planInfo.plan, balance, monthlyRate);
        const calculation = calculateLoanDetails(balance, monthlyRate, standardResult.payment);
        result = {
          payment: standardResult.payment,
          totalInterest: calculation.totalInterest,
          months: calculation.months,
          forgiveAmount: 0
        };
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 0.5rem; border: 1px solid #ddd;">${planInfo.name}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${result.payment.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${result.totalInterest.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">${Math.floor(result.months / 12)} years ${result.months % 12} months</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">${result.forgiveAmount > 0 ? '$' + result.forgiveAmount.toFixed(2) : 'None'}</td>
      `;
      comparisonBody.appendChild(row);
    });

    comparisonDiv.style.display = 'block';
  }

  function displayResults(monthlyPayment, totalInterest, payoffTime, originalBalance, forgiveAmount, interestRate) {
    const totalPaid = (monthlyPayment * payoffTime) - forgiveAmount;
    const years = Math.floor(payoffTime / 12);
    const months = payoffTime % 12;

    let resultHtml = `
      <div class="result-summary">
        <h3>📊 Payment Summary</h3>
        <div class="result-grid">
          <div class="result-item">
            <strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Payoff Time:</strong> ${years} years ${months} months
          </div>
          <div class="result-item">
            <strong>Total Interest:</strong> $${totalInterest.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Total Paid:</strong> $${totalPaid.toFixed(2)}
          </div>
    `;

    if (forgiveAmount > 0) {
      resultHtml += `
          <div class="result-item highlight">
            <strong>Amount Forgiven:</strong> $${forgiveAmount.toFixed(2)}
          </div>
          <div class="result-item highlight">
            <strong>Taxable Forgiveness:</strong> May be subject to income tax
          </div>
      `;
    }

    resultHtml += `
        </div>
      </div>
      
      <div class="payment-breakdown">
        <h4>💡 Key Insights</h4>
        <ul>
          <li><strong>Interest Rate:</strong> ${interestRate.toFixed(2)}% annually</li>
          <li><strong>Interest vs Principal:</strong> ${((totalInterest / originalBalance) * 100).toFixed(1)}% of original loan</li>
    `;

    if (totalInterest > originalBalance * 0.5) {
      resultHtml += `<li class="warning"><strong>High Interest Cost:</strong> Consider extra payments or shorter term</li>`;
    }

    if (monthlyPayment < originalBalance * 0.01) {
      resultHtml += `<li class="warning"><strong>Low Payment Warning:</strong> Payment may not cover all interest</li>`;
    }

    resultHtml += `
        </ul>
      </div>
      
      <div class="tax-info">
        <h4>💰 Tax Benefits</h4>
        <ul>
          <li><strong>Interest Deduction:</strong> Up to $2,500 annually (income limits apply)</li>
          <li><strong>Income Limits:</strong> Phaseout starts at $70,000 (single) / $145,000 (married)</li>
          <li><strong>Employer Assistance:</strong> Up to $5,250 annually tax-free through 2025</li>
        </ul>
      </div>
    `;

    result.innerHTML = resultHtml;
  }

  // Update custom payment visibility
  document.getElementById('repaymentPlan').addEventListener('change', function() {
    const customPaymentField = document.getElementById('customPayment');
    const isCustom = this.value === 'custom';
    customPaymentField.style.display = isCustom ? 'block' : 'none';
    customPaymentField.required = isCustom;
  });

  // Auto-calculate discretionary income display
  document.getElementById('annualIncome').addEventListener('input', updateDiscretionaryIncome);
  document.getElementById('familySize').addEventListener('input', updateDiscretionaryIncome);

  function updateDiscretionaryIncome() {
    const income = parseFloat(document.getElementById('annualIncome').value) || 0;
    const familySize = parseInt(document.getElementById('familySize').value) || 1;
    
    if (income > 0) {
      const povertyLine = povertyGuidelines[Math.min(familySize, 8)] || 
                         (povertyGuidelines[8] + (familySize - 8) * 5140);
      const discretionary = Math.max(0, income - (1.5 * povertyLine));
      
      // Could add a display element for this if desired
      console.log(`Discretionary income: $${discretionary.toFixed(2)}`);
    }
  }
});