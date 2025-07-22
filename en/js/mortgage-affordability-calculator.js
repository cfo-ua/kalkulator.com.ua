document.getElementById("affordability-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const annualIncome = parseFloat(document.getElementById("annualIncome").value) || 0;
  const spouseIncome = parseFloat(document.getElementById("spouseIncome").value) || 0;
  const otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
  const incomeType = document.getElementById("incomeType").value;
  const creditCards = parseFloat(document.getElementById("creditCards").value) || 0;
  const autoLoans = parseFloat(document.getElementById("autoLoans").value) || 0;
  const studentLoans = parseFloat(document.getElementById("studentLoans").value) || 0;
  const otherDebts = parseFloat(document.getElementById("otherDebts").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const loanTerm = parseInt(document.getElementById("loanTerm").value) || 30;
  const loanType = document.getElementById("loanType").value;
  const propertyTaxRate = parseFloat(document.getElementById("propertyTaxRate").value) || 0;
  const homeInsurance = parseFloat(document.getElementById("homeInsurance").value) || 0;
  const hoaFees = parseFloat(document.getElementById("hoaFees").value) || 0;
  const creditScore = parseInt(document.getElementById("creditScore").value) || 750;
  const includeDebts = document.getElementById("includeDebts").checked;

  // Calculate total monthly income
  const totalAnnualIncome = annualIncome + spouseIncome;
  const monthlyIncome = (totalAnnualIncome / 12) + otherIncome;
  
  // Adjust income based on type (lenders may use different calculations)
  let qualifyingIncome = monthlyIncome;
  if (incomeType === "commission" || incomeType === "self-employed") {
    qualifyingIncome *= 0.9; // Conservative estimate for variable income
  }

  // Calculate existing monthly debts
  const totalMonthlyDebts = creditCards + autoLoans + studentLoans + otherDebts;

  // Determine DTI limits based on loan type and credit score
  let maxFrontEndRatio, maxBackEndRatio;
  
  switch (loanType) {
    case "fha":
      maxFrontEndRatio = 0.31;
      maxBackEndRatio = creditScore >= 580 ? 0.57 : 0.43;
      break;
    case "va":
      maxFrontEndRatio = 0.41; // VA is more flexible
      maxBackEndRatio = 0.41; // VA uses residual income method, simplified here
      break;
    case "usda":
      maxFrontEndRatio = 0.29;
      maxBackEndRatio = 0.41;
      break;
    default: // conventional
      maxFrontEndRatio = 0.28;
      maxBackEndRatio = creditScore >= 740 ? 0.45 : 0.43;
  }

  // Adjust ratios based on credit score
  if (creditScore < 620) {
    maxFrontEndRatio *= 0.9;
    maxBackEndRatio *= 0.9;
  }

  // Calculate maximum affordable PITI based on front-end ratio
  const maxPITI = qualifyingIncome * maxFrontEndRatio;
  
  // Calculate maximum affordable total debt based on back-end ratio
  const maxTotalDebt = qualifyingIncome * maxBackEndRatio;
  const maxPITIFromBackEnd = includeDebts ? maxTotalDebt - totalMonthlyDebts : maxTotalDebt;
  
  // Use the more restrictive limit
  const maxAffordablePITI = Math.min(maxPITI, maxPITIFromBackEnd);
  
  if (maxAffordablePITI <= 0) {
    document.getElementById("affordability-result").innerHTML = `
      <div style="padding: 1rem; background: #f8d7da; border-radius: 0.5rem; color: #721c24;">
        <h4>⚠️ Affordability Issue</h4>
        <p>Based on your current debt levels, you may not qualify for a mortgage. Consider:</p>
        <ul>
          <li>Paying down existing debts</li>
          <li>Increasing your income</li>
          <li>Consulting with a mortgage professional</li>
        </ul>
      </div>
    `;
    return;
  }

  // Calculate monthly taxes, insurance, and other costs
  const monthlyInsurance = homeInsurance / 12;
  
  // Calculate affordable home price using iterative approach
  let homePrice = 100000; // Starting point
  let step = 50000;
  let bestPrice = 0;
  
  for (let i = 0; i < 20; i++) { // Iterative approach to find maximum price
    const loanAmount = homePrice - downPayment;
    
    if (loanAmount <= 0) {
      homePrice -= step;
      step /= 2;
      continue;
    }
    
    // Calculate monthly principal and interest
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPI = monthlyRate > 0 ? 
      loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1) : 
      loanAmount / numPayments;
    
    // Calculate monthly property taxes
    const monthlyTaxes = (homePrice * propertyTaxRate / 100) / 12;
    
    // Calculate PMI if needed
    const downPaymentPercent = (downPayment / homePrice) * 100;
    let monthlyPMI = 0;
    
    if (loanType === "conventional" && downPaymentPercent < 20) {
      monthlyPMI = loanAmount * 0.005 / 12; // 0.5% annually
    } else if (loanType === "fha") {
      monthlyPMI = loanAmount * 0.0085 / 12; // 0.85% annually for FHA MIP
    }
    
    // Total PITI
    const totalPITI = monthlyPI + monthlyInsurance + monthlyTaxes + monthlyPMI + hoaFees;
    
    if (totalPITI <= maxAffordablePITI) {
      bestPrice = homePrice;
      homePrice += step;
    } else {
      homePrice -= step;
      step /= 2;
    }
    
    if (step < 1000) break; // Stop when step is small enough
  }

  // Calculate final numbers based on best affordable price
  const finalLoanAmount = bestPrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const finalMonthlyPI = monthlyRate > 0 ? 
    finalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1) : 
    finalLoanAmount / numPayments;
  
  const finalMonthlyTaxes = (bestPrice * propertyTaxRate / 100) / 12;
  const finalDownPaymentPercent = (downPayment / bestPrice) * 100;
  
  let finalMonthlyPMI = 0;
  if (loanType === "conventional" && finalDownPaymentPercent < 20) {
    finalMonthlyPMI = finalLoanAmount * 0.005 / 12;
  } else if (loanType === "fha") {
    finalMonthlyPMI = finalLoanAmount * 0.0085 / 12;
  }
  
  const finalTotalPITI = finalMonthlyPI + monthlyInsurance + finalMonthlyTaxes + finalMonthlyPMI + hoaFees;
  
  // Calculate DTI ratios
  const frontEndRatio = (finalTotalPITI / qualifyingIncome) * 100;
  const backEndRatio = ((finalTotalPITI + totalMonthlyDebts) / qualifyingIncome) * 100;
  
  // Calculate closing costs estimate
  const closingCosts = bestPrice * 0.025; // Estimate 2.5% of home price
  
  // Calculate remaining monthly budget
  const remainingBudget = qualifyingIncome - finalTotalPITI - totalMonthlyDebts;

  document.getElementById("affordability-result").innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
      <div style="padding: 1.5rem; background: #d4edda; border-radius: 0.5rem;">
        <h4>🏠 Maximum Home Price</h4>
        <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #155724;">$${bestPrice.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p style="margin: 0.5rem 0 0 0;">Based on your income and debts</p>
      </div>
      
      <div style="padding: 1.5rem; background: #cce5ff; border-radius: 0.5rem;">
        <h4>💰 Loan Details</h4>
        <p><strong>Loan Amount:</strong> $${finalLoanAmount.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Down Payment:</strong> $${downPayment.toLocaleString('en-US', {maximumFractionDigits: 0})} (${finalDownPaymentPercent.toFixed(1)}%)</p>
        <p><strong>Loan Type:</strong> ${loanType.toUpperCase()}</p>
      </div>
      
      <div style="padding: 1.5rem; background: #fff3cd; border-radius: 0.5rem;">
        <h4>📊 Monthly Payment</h4>
        <p><strong>Total PITI:</strong> $${finalTotalPITI.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Principal & Interest:</strong> $${finalMonthlyPI.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Taxes & Insurance:</strong> $${(finalMonthlyTaxes + monthlyInsurance).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        ${finalMonthlyPMI > 0 ? `<p><strong>PMI/MIP:</strong> $${finalMonthlyPMI.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>` : ''}
      </div>
      
      <div style="padding: 1.5rem; background: #f8d7da; border-radius: 0.5rem;">
        <h4>📈 Debt Ratios</h4>
        <p><strong>Front-End DTI:</strong> ${frontEndRatio.toFixed(1)}%</p>
        <p><strong>Back-End DTI:</strong> ${backEndRatio.toFixed(1)}%</p>
        <p><strong>Monthly Income:</strong> $${qualifyingIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
      <div style="padding: 1rem; background: #f8f9fa; border-radius: 0.5rem;">
        <h4>💸 Additional Costs to Consider</h4>
        <p><strong>Estimated Closing Costs:</strong> $${closingCosts.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Moving Expenses:</strong> $2,000 - $5,000</p>
        <p><strong>Home Inspection:</strong> $400 - $800</p>
        <p><strong>Immediate Repairs/Updates:</strong> $2,000 - $10,000</p>
      </div>
      
      <div style="padding: 1rem; background: #e8f5e8; border-radius: 0.5rem;">
        <h4>📋 Monthly Budget Remaining</h4>
        <p><strong>After Housing & Debts:</strong> $${remainingBudget.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p style="font-size: 0.9rem;">For utilities, groceries, savings, entertainment, and emergencies</p>
      </div>
    </div>
    
    ${frontEndRatio > maxFrontEndRatio * 100 || backEndRatio > maxBackEndRatio * 100 ? `
    <div style="padding: 1rem; background: #fff3cd; border-radius: 0.5rem; margin-bottom: 1rem;">
      <h4>⚠️ Qualification Notes</h4>
      <p>Your DTI ratios are at or near the maximum limits. Consider:</p>
      <ul style="margin: 0.5rem 0;">
        <li>Paying down existing debts to lower your back-end ratio</li>
        <li>Considering a larger down payment</li>
        <li>Looking at homes below the maximum price for comfort</li>
        <li>Getting pre-approved to confirm actual qualification</li>
      </ul>
    </div>
    ` : ''}
    
    <div style="padding: 1rem; background: #e8f4fd; border-radius: 0.5rem;">
      <h4>💡 Tips to Increase Your Home Buying Power</h4>
      <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
        <li><strong>Improve Credit Score:</strong> Even 20 points can significantly lower your rate</li>
        <li><strong>Pay Down Debts:</strong> Lower DTI = higher qualification amount</li>
        <li><strong>Save More Down Payment:</strong> Reduces loan amount and potentially eliminates PMI</li>
        <li><strong>Shop for Better Rates:</strong> 0.25% rate difference = ~$50/month on $300K loan</li>
        <li><strong>Consider Different Loan Types:</strong> FHA, VA, or USDA may offer better terms</li>
        <li><strong>Increase Income:</strong> Side job or promotion can boost qualification significantly</li>
      </ul>
    </div>
  `;

  // Prepare chart data
  const chartData = {
    housingPI: finalMonthlyPI,
    housingTI: finalMonthlyTaxes + monthlyInsurance + finalMonthlyPMI + hoaFees,
    existingDebts: totalMonthlyDebts,
    remaining: remainingBudget
  };

  document.getElementById("affordability-chart-block").style.display = "block";
  ensureChartJs(() => renderAffordabilityChart(chartData, qualifyingIncome));
});

function renderAffordabilityChart(data, totalIncome) {
  const ctx = document.getElementById("affordability-chart").getContext("2d");
  
  if (window.affordabilityChart) {
    window.affordabilityChart.destroy();
  }
  
  window.affordabilityChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Principal & Interest', 'Taxes, Insurance & PMI', 'Existing Debts', 'Remaining Budget'],
      datasets: [{
        data: [
          data.housingPI,
          data.housingTI,
          data.existingDebts,
          data.remaining
        ].filter(value => value > 0),
        backgroundColor: [
          '#0071e3',
          '#34c759',
          '#ff3b30',
          '#00c896'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed;
              const percentage = ((value / totalIncome) * 100).toFixed(1);
              return context.label + ': $' + value.toLocaleString('en-US', {maximumFractionDigits: 0}) + 
                     ' (' + percentage + '% of income)';
            }
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      }
    }
  });
}

function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}

// Auto-calculate down payment percentage when values change
document.getElementById("downPayment").addEventListener("input", updateDownPaymentInfo);

function updateDownPaymentInfo() {
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  
  // Estimate home price for percentage calculation (rough estimate)
  const estimatedPrice = downPayment * 5; // Assume 20% down as baseline
  if (estimatedPrice > 0) {
    const percentage = (downPayment / estimatedPrice) * 100;
    // Could add a display element to show this percentage
  }
}