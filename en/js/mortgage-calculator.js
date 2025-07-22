document.getElementById("mortgage-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const loanTerm = parseInt(document.getElementById("loanTerm").value) || 30;
  const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const propertyTax = parseFloat(document.getElementById("propertyTax").value) || 0;
  const homeInsurance = parseFloat(document.getElementById("homeInsurance").value) || 0;
  const pmiRate = parseFloat(document.getElementById("pmiRate").value) || 0;
  const hoaFees = parseFloat(document.getElementById("hoaFees").value) || 0;
  const extraPayment = parseFloat(document.getElementById("extraPayment").value) || 0;
  const mortgagePoints = parseFloat(document.getElementById("mortgagePoints").value) || 0;
  const closingCosts = parseFloat(document.getElementById("closingCosts").value) || 0;
  const includeExtras = document.getElementById("includeExtras").checked;

  const loanAmount = homePrice - downPayment;
  const downPaymentPercent = (downPayment / homePrice) * 100;
  
  if (loanAmount <= 0) {
    document.getElementById("mortgage-result").innerHTML = 
      '<p style="color: red;">Down payment cannot be greater than or equal to home price.</p>';
    return;
  }

  // Adjust interest rate for points (typically 0.25% reduction per point)
  const adjustedRate = Math.max(0, interestRate - (mortgagePoints * 0.25));
  const monthlyRate = adjustedRate / 100 / 12;
  const totalPayments = loanTerm * 12;

  // Calculate basic mortgage payment (P&I only)
  const monthlyPI = monthlyRate > 0 ? 
    loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1) : 
    loanAmount / totalPayments;

  // Calculate additional monthly costs
  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * pmiRate / 100) / 12 : 0;

  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + hoaFees;
  const totalInterest = (monthlyPI * totalPayments) - loanAmount;
  const totalCost = homePrice + totalInterest + closingCosts + (mortgagePoints * loanAmount / 100);

  // Calculate payoff with extra payments
  let payoffCalculation = calculateEarlyPayoff(loanAmount, monthlyRate, monthlyPI, extraPayment);

  // Generate amortization data for chart
  let balance = loanAmount;
  let principalData = [];
  let interestData = [];
  let labels = [];
  let amortizationSchedule = [];

  for (let month = 1; month <= Math.min(totalPayments, 360); month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPI - interestPayment;
    
    if (month <= 12) {
      amortizationSchedule.push({
        payment: month,
        principal: principalPayment,
        interest: interestPayment,
        total: monthlyPI,
        balance: balance - principalPayment
      });
    }
    
    balance -= principalPayment;
    
    if (month % 12 === 0) {
      principalData.push(principalPayment * 12);
      interestData.push(interestPayment * 12);
      labels.push(`Year ${month / 12}`);
    }
    
    if (balance <= 0) break;
  }

  document.getElementById("mortgage-result").innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
      <div>
        <h4>💰 Monthly Payments</h4>
        <p><strong>Principal & Interest:</strong> $${monthlyPI.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Property Tax:</strong> $${monthlyPropertyTax.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Home Insurance:</strong> $${monthlyInsurance.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        ${monthlyPMI > 0 ? `<p><strong>PMI:</strong> $${monthlyPMI.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>` : ''}
        ${hoaFees > 0 ? `<p><strong>HOA Fees:</strong> $${hoaFees.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>` : ''}
        <p><strong>Total Monthly Payment:</strong> $${totalMonthlyPayment.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
      
      <div>
        <h4>🏠 Loan Summary</h4>
        <p><strong>Home Price:</strong> $${homePrice.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Down Payment:</strong> $${downPayment.toLocaleString('en-US', {maximumFractionDigits: 0})} (${downPaymentPercent.toFixed(1)}%)</p>
        <p><strong>Loan Amount:</strong> $${loanAmount.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Interest Rate:</strong> ${adjustedRate.toFixed(3)}%</p>
        <p><strong>Loan Term:</strong> ${loanTerm} years</p>
      </div>
      
      <div>
        <h4>📊 Total Costs</h4>
        <p><strong>Total Interest Paid:</strong> $${totalInterest.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Total of Payments:</strong> $${(monthlyPI * totalPayments).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        ${mortgagePoints > 0 ? `<p><strong>Points Cost:</strong> $${(mortgagePoints * loanAmount / 100).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>` : ''}
        <p><strong>Closing Costs:</strong> $${closingCosts.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Total Cost:</strong> $${totalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
    </div>
    
    ${extraPayment > 0 ? `
    <div style="margin-top: 1.5rem; padding: 1rem; background: #e8f5e8; border-radius: 0.5rem;">
      <h4>🚀 Early Payoff Benefits</h4>
      <p><strong>With $${extraPayment}/month extra:</strong></p>
      <p>Payoff Time: ${payoffCalculation.years} years, ${payoffCalculation.months} months</p>
      <p>Interest Savings: $${payoffCalculation.interestSaved.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      <p>Time Saved: ${(loanTerm * 12 - payoffCalculation.totalMonths)} months</p>
    </div>
    ` : ''}
    
    ${downPaymentPercent < 20 ? `
    <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 0.5rem;">
      <h4>ℹ️ PMI Information</h4>
      <p>You'll pay PMI until you reach 20% equity (about $${(homePrice * 0.2).toLocaleString('en-US', {maximumFractionDigits: 0})} in home value).</p>
      <p>Monthly PMI: $${monthlyPMI.toLocaleString('en-US', {maximumFractionDigits: 0})} | Annual: $${(monthlyPMI * 12).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
    </div>
    ` : ''}
  `;

  // Generate amortization table
  generateAmortizationTable(amortizationSchedule);

  document.getElementById("mortgage-chart-block").style.display = "block";
  document.getElementById("amortization-table").style.display = "block";
  ensureChartJs(() => renderMortgageChart(labels, principalData, interestData));
});

function calculateEarlyPayoff(loanAmount, monthlyRate, monthlyPI, extraPayment) {
  let balance = loanAmount;
  let totalMonths = 0;
  let totalInterest = 0;
  
  while (balance > 0 && totalMonths < 360) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(monthlyPI - interestPayment + extraPayment, balance);
    
    balance -= principalPayment;
    totalInterest += interestPayment;
    totalMonths++;
  }
  
  const originalInterest = (monthlyPI * 360) - loanAmount;
  const interestSaved = originalInterest - totalInterest;
  
  return {
    totalMonths: totalMonths,
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    interestSaved: interestSaved
  };
}

function generateAmortizationTable(schedule) {
  const tbody = document.getElementById("amortization-body");
  tbody.innerHTML = "";
  
  schedule.forEach(payment => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${payment.payment}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">$${payment.principal.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">$${payment.interest.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">$${payment.total.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">$${payment.balance.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
    `;
  });
}

function renderMortgageChart(labels, principalData, interestData) {
  const ctx = document.getElementById("mortgage-chart").getContext("2d");
  
  if (window.mortgageChart) {
    window.mortgageChart.destroy();
  }
  
  window.mortgageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Principal',
          data: principalData,
          backgroundColor: '#00b894',
          borderColor: '#00a085',
          borderWidth: 1
        },
        {
          label: 'Interest',
          data: interestData,
          backgroundColor: '#e17055',
          borderColor: '#d63031',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + (value / 1000).toFixed(0) + 'K';
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.parsed.y.toLocaleString('en-US', {maximumFractionDigits: 0});
            }
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

// Auto-calculate down payment percentage
document.getElementById("homePrice").addEventListener("input", updateDownPaymentInfo);
document.getElementById("downPayment").addEventListener("input", updateDownPaymentInfo);

function updateDownPaymentInfo() {
  const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  
  if (homePrice > 0) {
    const percentage = (downPayment / homePrice) * 100;
    const pmiField = document.getElementById("pmiRate");
    
    // Auto-adjust PMI field
    if (percentage >= 20) {
      pmiField.value = "0";
      pmiField.style.backgroundColor = "#e8f5e8";
    } else {
      if (pmiField.value === "0") {
        pmiField.value = "0.5";
      }
      pmiField.style.backgroundColor = "#fff3cd";
    }
  }
}