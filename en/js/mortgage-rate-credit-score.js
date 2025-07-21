document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mortgage-rate-form");
  const resultDiv = document.getElementById("mortgage-rate-result");
  const creditScoreInput = document.getElementById("credit-score");
  const creditRangeSelect = document.getElementById("credit-range");

  // Update credit range when score changes
  creditScoreInput.addEventListener("input", function() {
    const score = parseFloat(this.value);
    if (score >= 760) creditRangeSelect.value = "excellent";
    else if (score >= 700) creditRangeSelect.value = "very-good";
    else if (score >= 660) creditRangeSelect.value = "good";
    else if (score >= 620) creditRangeSelect.value = "fair";
    else creditRangeSelect.value = "poor";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateMortgageRates();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['home-price', 'down-payment', 'credit-score', 'current-interest-rate'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateMortgateRates();
      }
    });
  });

  function validateInputs() {
    const homePrice = parseFloat(document.getElementById("home-price").value);
    const downPayment = parseFloat(document.getElementById("down-payment").value);
    const creditScore = parseFloat(document.getElementById("credit-score").value);
    
    return homePrice > 0 && downPayment >= 0 && creditScore >= 300 && creditScore <= 850;
  }

  function calculateMortgageRates() {
    // Get inputs
    const homePrice = parseFloat(document.getElementById("home-price").value) || 0;
    const downPayment = parseFloat(document.getElementById("down-payment").value) || 0;
    const loanTerm = parseFloat(document.getElementById("loan-term").value) || 30;
    const loanType = document.getElementById("loan-type").value;
    const creditScore = parseFloat(document.getElementById("credit-score").value) || 720;
    const annualIncome = parseFloat(document.getElementById("annual-income").value) || 0;
    const monthlyDebts = parseFloat(document.getElementById("monthly-debts").value) || 0;
    const currentMarketRate = parseFloat(document.getElementById("current-interest-rate").value) / 100 || 0;
    const propertyTax = parseFloat(document.getElementById("property-tax").value) || 0;
    const homeInsurance = parseFloat(document.getElementById("home-insurance").value) || 0;
    const hoaFees = parseFloat(document.getElementById("hoa-fees").value) || 0;
    
    const compareCredit = document.getElementById("compare-credit").checked;
    const showImprovements = document.getElementById("show-improvements").checked;
    const includePMI = document.getElementById("include-pmi").checked;

    if (homePrice <= 0 || downPayment > homePrice) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid home price and down payment amounts.</p>';
      return;
    }

    const loanAmount = homePrice - downPayment;
    const downPaymentPercentage = (downPayment / homePrice) * 100;
    
    // Calculate credit-adjusted interest rate
    const adjustedRate = getAdjustedInterestRate(currentMarketRate, creditScore, loanType, downPaymentPercentage);
    
    // Calculate monthly payment
    const monthlyRate = adjustedRate / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, monthlyRate, totalPayments);
    
    // Calculate PMI if applicable
    const pmiAmount = calculatePMI(loanAmount, downPaymentPercentage, loanType);
    
    // Calculate total monthly payment
    const monthlyTaxInsurance = (propertyTax + homeInsurance) / 12;
    const totalMonthlyPayment = monthlyPayment + pmiAmount + monthlyTaxInsurance + hoaFees;
    
    // Calculate debt-to-income ratio
    const monthlyIncome = annualIncome / 12;
    const totalMonthlyDebts = monthlyDebts + totalMonthlyPayment;
    const dti = (totalMonthlyDebts / monthlyIncome) * 100;
    
    // Calculate loan qualification
    const qualification = assessLoanQualification(creditScore, dti, downPaymentPercentage, loanType);
    
    // Calculate total interest and loan cost
    const totalInterestPaid = (monthlyPayment * totalPayments) - loanAmount;
    const totalLoanCost = loanAmount + totalInterestPaid;
    
    // Credit comparison scenarios
    const creditComparisons = compareCredit ? generateCreditComparisons(
      currentMarketRate, loanAmount, loanTerm, loanType, downPaymentPercentage
    ) : null;
    
    // Credit improvement scenarios
    const improvementScenarios = showImprovements ? generateImprovementScenarios(
      creditScore, currentMarketRate, loanAmount, loanTerm, loanType, downPaymentPercentage
    ) : null;

    displayResults({
      homePrice,
      loanAmount,
      downPayment,
      downPaymentPercentage,
      creditScore,
      adjustedRate: adjustedRate * 100,
      monthlyPayment,
      pmiAmount,
      totalMonthlyPayment,
      monthlyTaxInsurance,
      hoaFees,
      dti,
      qualification,
      totalInterestPaid,
      totalLoanCost,
      loanTerm,
      loanType,
      creditComparisons,
      improvementScenarios,
      includePMI
    });
  }

  function getAdjustedInterestRate(baseRate, creditScore, loanType, downPaymentPercentage) {
    let adjustment = 0;
    
    // Credit score adjustments
    if (creditScore >= 760) adjustment -= 0.005; // -0.5%
    else if (creditScore >= 700) adjustment += 0.000; // baseline
    else if (creditScore >= 660) adjustment += 0.003; // +0.3%
    else if (creditScore >= 620) adjustment += 0.008; // +0.8%
    else adjustment += 0.015; // +1.5%
    
    // Loan type adjustments
    switch(loanType) {
      case 'fha':
        adjustment += 0.002; // FHA typically 0.2% higher
        break;
      case 'va':
        adjustment -= 0.001; // VA typically 0.1% lower
        break;
      case 'usda':
        adjustment += 0.001; // USDA slightly higher
        break;
      case 'jumbo':
        adjustment += 0.003; // Jumbo typically higher
        break;
    }
    
    // Down payment adjustments
    if (downPaymentPercentage >= 20) adjustment -= 0.001; // -0.1% for 20%+ down
    else if (downPaymentPercentage < 10) adjustment += 0.002; // +0.2% for low down payment
    
    return Math.max(baseRate + adjustment, 0.02); // Floor at 2%
  }

  function calculateMonthlyPayment(principal, monthlyRate, payments) {
    if (monthlyRate === 0) return principal / payments;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
           (Math.pow(1 + monthlyRate, payments) - 1);
  }

  function calculatePMI(loanAmount, downPaymentPercentage, loanType) {
    if (loanType === 'va' || loanType === 'usda') return 0; // No PMI for VA/USDA
    if (downPaymentPercentage >= 20) return 0; // No PMI with 20%+ down
    
    let pmiRate;
    if (loanType === 'fha') {
      pmiRate = 0.0085; // FHA MIP rate (approximately)
    } else {
      pmiRate = 0.005; // Conventional PMI rate (approximately)
    }
    
    return (loanAmount * pmiRate) / 12;
  }

  function assessLoanQualification(creditScore, dti, downPaymentPercentage, loanType) {
    let status = 'qualified';
    let issues = [];
    let recommendations = [];
    
    // Credit score requirements
    const minCreditScore = {
      'conventional': 620,
      'fha': 580,
      'va': 580,
      'usda': 640,
      'jumbo': 700
    };
    
    if (creditScore < minCreditScore[loanType]) {
      status = 'not-qualified';
      issues.push(`Credit score too low for ${loanType.toUpperCase()} loan (minimum ${minCreditScore[loanType]})`);
    }
    
    // DTI requirements
    const maxDTI = loanType === 'fha' ? 57 : 45;
    if (dti > maxDTI) {
      status = dti > maxDTI + 5 ? 'not-qualified' : 'conditional';
      issues.push(`Debt-to-income ratio too high (${dti.toFixed(1)}% vs ${maxDTI}% max)`);
      recommendations.push('Reduce monthly debt or increase income');
    }
    
    // Down payment requirements
    const minDownPayment = {
      'conventional': 3,
      'fha': 3.5,
      'va': 0,
      'usda': 0,
      'jumbo': 10
    };
    
    if (downPaymentPercentage < minDownPayment[loanType]) {
      status = 'not-qualified';
      issues.push(`Down payment too low for ${loanType.toUpperCase()} loan (minimum ${minDownPayment[loanType]}%)`);
    }
    
    // Credit score recommendations
    if (creditScore < 740) {
      recommendations.push('Improve credit score for better rates');
    }
    
    if (downPaymentPercentage < 20 && loanType === 'conventional') {
      recommendations.push('Consider 20% down payment to eliminate PMI');
    }
    
    return { status, issues, recommendations };
  }

  function generateCreditComparisons(baseRate, loanAmount, loanTerm, loanType, downPaymentPercentage) {
    const creditScores = [620, 660, 700, 740, 780];
    const comparisons = [];
    
    creditScores.forEach(score => {
      const rate = getAdjustedInterestRate(baseRate, score, loanType, downPaymentPercentage);
      const monthlyRate = rate / 12;
      const totalPayments = loanTerm * 12;
      const payment = calculateMonthlyPayment(loanAmount, monthlyRate, totalPayments);
      const totalInterest = (payment * totalPayments) - loanAmount;
      
      comparisons.push({
        creditScore: score,
        interestRate: rate * 100,
        monthlyPayment: payment,
        totalInterest: totalInterest
      });
    });
    
    return comparisons;
  }

  function generateImprovementScenarios(currentScore, baseRate, loanAmount, loanTerm, loanType, downPaymentPercentage) {
    const improvements = [
      { points: 0, description: 'Current Score' },
      { points: 40, description: '40 Point Improvement' },
      { points: 80, description: '80 Point Improvement' },
      { points: 120, description: 'Excellent Credit (760+)' }
    ];
    
    return improvements.map(improvement => {
      const newScore = Math.min(currentScore + improvement.points, 760);
      const rate = getAdjustedInterestRate(baseRate, newScore, loanType, downPaymentPercentage);
      const monthlyRate = rate / 12;
      const totalPayments = loanTerm * 12;
      const payment = calculateMonthlyPayment(loanAmount, monthlyRate, totalPayments);
      const totalInterest = (payment * totalPayments) - loanAmount;
      
      return {
        description: improvement.description,
        creditScore: newScore,
        interestRate: rate * 100,
        monthlyPayment: payment,
        totalInterest: totalInterest
      };
    });
  }

  function displayResults(data) {
    const {
      homePrice,
      loanAmount,
      downPaymentPercentage,
      creditScore,
      adjustedRate,
      monthlyPayment,
      pmiAmount,
      totalMonthlyPayment,
      monthlyTaxInsurance,
      hoaFees,
      dti,
      qualification,
      totalInterestPaid,
      totalLoanCost,
      loanTerm,
      loanType,
      creditComparisons,
      improvementScenarios
    } = data;

    const qualificationClass = qualification.status === 'qualified' ? 'qualified' : 
                              qualification.status === 'conditional' ? 'conditional' : 'not-qualified';

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🏠 Mortgage Rate Analysis</h3>
        
        <div class="loan-summary">
          <h4>Your Mortgage Details</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Home Price:</span>
              <span class="value">$${homePrice.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Loan Amount:</span>
              <span class="value">$${loanAmount.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Down Payment:</span>
              <span class="value">$${(homePrice - loanAmount).toLocaleString()} (${downPaymentPercentage.toFixed(1)}%)</span>
            </div>
            <div class="summary-item">
              <span class="label">Credit Score:</span>
              <span class="value">${creditScore}</span>
            </div>
            <div class="summary-item highlight">
              <span class="label">Interest Rate:</span>
              <span class="value">${adjustedRate.toFixed(3)}%</span>
            </div>
            <div class="summary-item">
              <span class="label">Loan Term:</span>
              <span class="value">${loanTerm} years</span>
            </div>
          </div>
        </div>

        <div class="qualification-status ${qualificationClass}">
          <h4>Loan Qualification: ${qualification.status.replace('-', ' ').toUpperCase()}</h4>
          ${qualification.issues.length > 0 ? `
            <div class="issues">
              <strong>Issues:</strong>
              <ul>${qualification.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${qualification.recommendations.length > 0 ? `
            <div class="recommendations">
              <strong>Recommendations:</strong>
              <ul>${qualification.recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </div>

        <div class="payment-breakdown">
          <h4>💰 Monthly Payment Breakdown</h4>
          <div class="payment-grid">
            <div class="payment-item principal">
              <span class="label">Principal & Interest:</span>
              <span class="value">$${monthlyPayment.toFixed(2)}</span>
            </div>
            ${pmiAmount > 0 ? `
              <div class="payment-item pmi">
                <span class="label">PMI/MIP:</span>
                <span class="value">$${pmiAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="payment-item taxes">
              <span class="label">Property Tax & Insurance:</span>
              <span class="value">$${monthlyTaxInsurance.toFixed(2)}</span>
            </div>
            ${hoaFees > 0 ? `
              <div class="payment-item hoa">
                <span class="label">HOA Fees:</span>
                <span class="value">$${hoaFees.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="payment-item total highlight">
              <span class="label">Total Monthly Payment:</span>
              <span class="value">$${totalMonthlyPayment.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="dti-analysis">
            <p><strong>Debt-to-Income Ratio:</strong> ${dti.toFixed(1)}%</p>
            <p class="dti-status ${dti <= 28 ? 'excellent' : dti <= 36 ? 'good' : dti <= 45 ? 'acceptable' : 'high'}">
              ${dti <= 28 ? '✅ Excellent DTI' : 
                dti <= 36 ? '✅ Good DTI' : 
                dti <= 45 ? '⚠️ Acceptable DTI' : '❌ High DTI'}
            </p>
          </div>
        </div>

        <div class="loan-cost-analysis">
          <h4>📊 Total Loan Cost Analysis</h4>
          <div class="cost-grid">
            <div class="cost-item">
              <span class="label">Total Interest Paid:</span>
              <span class="value">$${totalInterestPaid.toLocaleString()}</span>
            </div>
            <div class="cost-item">
              <span class="label">Total of Payments:</span>
              <span class="value">$${totalLoanCost.toLocaleString()}</span>
            </div>
            <div class="cost-item">
              <span class="label">Interest as % of Loan:</span>
              <span class="value">${((totalInterestPaid / loanAmount) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        ${creditComparisons ? `
          <div class="credit-comparison">
            <h4>📈 Credit Score Impact Comparison</h4>
            <div class="comparison-table">
              <div class="table-header">
                <span>Credit Score</span>
                <span>Interest Rate</span>
                <span>Monthly Payment</span>
                <span>Total Interest</span>
                <span>Potential Savings</span>
              </div>
              ${creditComparisons.map(comp => {
                const savings = creditComparisons[0].totalInterest - comp.totalInterest;
                return `
                  <div class="table-row ${comp.creditScore === creditScore ? 'current' : ''}">
                    <span>${comp.creditScore}</span>
                    <span>${comp.interestRate.toFixed(3)}%</span>
                    <span>$${comp.monthlyPayment.toFixed(0)}</span>
                    <span>$${comp.totalInterest.toLocaleString()}</span>
                    <span class="${savings >= 0 ? 'savings' : 'cost'}">
                      ${savings >= 0 ? '$' + savings.toLocaleString() : '-$' + Math.abs(savings).toLocaleString()}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${improvementScenarios ? `
          <div class="improvement-scenarios">
            <h4>⬆️ Credit Improvement Scenarios</h4>
            <div class="scenarios-grid">
              ${improvementScenarios.map(scenario => {
                const savings = improvementScenarios[0].totalInterest - scenario.totalInterest;
                return `
                  <div class="scenario ${scenario.creditScore === creditScore ? 'current' : ''}">
                    <h5>${scenario.description}</h5>
                    <p><strong>Credit Score:</strong> ${scenario.creditScore}</p>
                    <p><strong>Interest Rate:</strong> ${scenario.interestRate.toFixed(3)}%</p>
                    <p><strong>Monthly Payment:</strong> $${scenario.monthlyPayment.toFixed(0)}</p>
                    <p><strong>Total Interest:</strong> $${scenario.totalInterest.toLocaleString()}</p>
                    ${savings > 0 ? `<p class="savings"><strong>Potential Savings:</strong> $${savings.toLocaleString()}</p>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <div class="credit-improvement-tips">
          <h4>💡 Credit Improvement Tips</h4>
          <ul>
            <li><strong>Pay Bills on Time:</strong> Payment history is 35% of your credit score</li>
            <li><strong>Reduce Credit Utilization:</strong> Keep balances below 30% of credit limits</li>
            <li><strong>Don't Close Old Accounts:</strong> Length of credit history matters</li>
            <li><strong>Check Credit Reports:</strong> Dispute errors with credit bureaus</li>
            <li><strong>Avoid New Credit:</strong> Don't apply for credit before mortgage application</li>
            <li><strong>Pay Down Debt:</strong> Lower balances improve credit utilization</li>
          </ul>
        </div>

        <div class="shopping-tips">
          <h4>🛒 Mortgage Shopping Tips</h4>
          <ul>
            <li><strong>Shop Multiple Lenders:</strong> Rates can vary by 0.5% or more between lenders</li>
            <li><strong>Compare APRs:</strong> APR includes fees and gives true cost comparison</li>
            <li><strong>Lock Your Rate:</strong> Consider rate locks during volatile markets</li>
            <li><strong>Understand Points:</strong> Decide if paying points for lower rates makes sense</li>
            <li><strong>Review Loan Estimates:</strong> Compare fees and closing costs carefully</li>
            <li><strong>Time Your Application:</strong> Apply to multiple lenders within 14-45 days</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps</h4>
          <ul>
            <li>Get pre-approved from multiple lenders to compare actual rates</li>
            <li>Work on credit improvement if score is below 740</li>
            <li>Save for larger down payment if below 20%</li>
            <li>Calculate total monthly housing costs including maintenance</li>
            <li>Consider mortgage pre-payment strategies</li>
            <li>Review different loan programs and their benefits</li>
          </ul>
        </div>
      </div>
    `;
  }
});