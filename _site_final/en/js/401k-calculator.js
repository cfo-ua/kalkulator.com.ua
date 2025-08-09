document.getElementById("401k-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const currentAge = parseInt(document.getElementById("currentAge").value) || 30;
  const retirementAge = parseInt(document.getElementById("retirementAge").value) || 65;
  const currentBalance = parseFloat(document.getElementById("currentBalance").value) || 0;
  const annualSalary = parseFloat(document.getElementById("annualSalary").value) || 0;
  const employeeContribution = parseFloat(document.getElementById("employeeContribution").value) || 0;
  const employerMatch = parseFloat(document.getElementById("employerMatch").value) || 0;
  const maxMatchPercent = parseFloat(document.getElementById("maxMatchPercent").value) || 0;
  const annualRaise = parseFloat(document.getElementById("annualRaise").value) || 0;
  const investmentReturn = parseFloat(document.getElementById("investmentReturn").value) || 0;
  const inflationRate = parseFloat(document.getElementById("inflationRate").value) || 0;
  const contributionLimit = parseFloat(document.getElementById("contributionLimit").value) || 23500;
  const catchUpAge = parseInt(document.getElementById("catchUpAge").value) || 50;
  const catchUpAmount = parseFloat(document.getElementById("catchUpAmount").value) || 7500;

  const yearsToRetirement = retirementAge - currentAge;
  
  if (yearsToRetirement <= 0) {
    document.getElementById("401k-result").innerHTML = 
      '<p style="color: red;">Please enter a retirement age greater than your current age.</p>';
    return;
  }

  let balance = currentBalance;
  let salary = annualSalary;
  let data = [];
  let labels = [];
  let totalContributions = 0;
  let totalEmployerMatch = 0;

  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = currentAge + year;
    
    if (year > 0) {
      // Calculate contributions for this year
      const employeeContribAmount = salary * (employeeContribution / 100);
      const employerMatchAmount = Math.min(
        salary * (employerMatch / 100),
        salary * (maxMatchPercent / 100)
      );
      
      // Apply contribution limits
      let actualLimit = contributionLimit;
      if (age >= catchUpAge) {
        actualLimit += catchUpAmount;
      }
      
      const finalEmployeeContrib = Math.min(employeeContribAmount, actualLimit);
      
      totalContributions += finalEmployeeContrib;
      totalEmployerMatch += employerMatchAmount;
      
      // Add contributions to balance
      balance += finalEmployeeContrib + employerMatchAmount;
      
      // Apply investment return
      balance *= (1 + investmentReturn / 100);
      
      // Increase salary
      salary *= (1 + annualRaise / 100);
    }

    data.push(parseFloat(balance.toFixed(0)));
    labels.push(age.toString());
  }

  const finalBalance = balance;
  const totalInvested = currentBalance + totalContributions + totalEmployerMatch;
  const investmentGains = finalBalance - totalInvested;
  const realValue = finalBalance / Math.pow(1 + inflationRate / 100, yearsToRetirement);
  
  // Calculate monthly retirement income (4% rule)
  const monthlyIncome = (finalBalance * 0.04) / 12;
  const realMonthlyIncome = (realValue * 0.04) / 12;

  document.getElementById("401k-result").innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
      <div>
        <h4>📊 Final Results</h4>
        <p><strong>Final 401k Balance:</strong> $${finalBalance.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Real Value (inflation-adjusted):</strong> $${realValue.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Total Investment Gains:</strong> $${investmentGains.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
      
      <div>
        <h4>💰 Contributions</h4>
        <p><strong>Your Total Contributions:</strong> $${totalContributions.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Employer Match Total:</strong> $${totalEmployerMatch.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Starting Balance:</strong> $${currentBalance.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
      
      <div>
        <h4>🏠 Retirement Income (4% Rule)</h4>
        <p><strong>Monthly Income:</strong> $${monthlyIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Real Monthly Income:</strong> $${realMonthlyIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Annual Income:</strong> $${(monthlyIncome * 12).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
    </div>
    
    <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 0.5rem;">
      <h4>💡 Key Insights</h4>
      <p><strong>Years to Retirement:</strong> ${yearsToRetirement} years</p>
      <p><strong>Total Return:</strong> ${((finalBalance / totalInvested - 1) * 100).toFixed(1)}%</p>
      <p><strong>Free Money from Employer:</strong> $${totalEmployerMatch.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      ${totalContributions < contributionLimit * yearsToRetirement ? 
        '<p style="color: #d63031;"><strong>Tip:</strong> You could contribute more to maximize your retirement savings!</p>' : 
        '<p style="color: #00b894;"><strong>Great!</strong> You\'re maximizing your 401k contributions.</p>'
      }
    </div>
  `;

  document.getElementById("401k-chart-block").style.display = "block";
  ensureChartJs(() => render401kChart(labels, data));
});

function render401kChart(labels, data) {
  const ctx = document.getElementById("401k-chart").getContext("2d");
  
  if (window.chart401k) {
    window.chart401k.destroy();
  }
  
  window.chart401k = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '401k Balance',
        data: data,
        borderColor: '#0071e3',
        backgroundColor: 'rgba(0, 113, 227, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + (value / 1000).toFixed(0) + 'K';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Age'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Balance: $' + context.parsed.y.toLocaleString('en-US', {maximumFractionDigits: 0});
            }
          }
        },
        legend: {
          display: false
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