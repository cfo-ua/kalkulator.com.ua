let debts = [];
let debtIdCounter = 0;

document.getElementById("debt-info-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const name = document.getElementById("debt-name").value.trim();
  const balance = parseFloat(document.getElementById("debt-balance").value) || 0;
  const rate = parseFloat(document.getElementById("debt-rate").value) || 0;
  const minimum = parseFloat(document.getElementById("debt-minimum").value) || 0;
  
  if (name && balance > 0 && rate >= 0 && minimum > 0) {
    const debt = {
      id: debtIdCounter++,
      name: name,
      balance: balance,
      rate: rate,
      minimum: minimum,
      originalBalance: balance
    };
    
    debts.push(debt);
    updateDebtList();
    
    // Clear form
    document.getElementById("debt-name").value = "";
    document.getElementById("debt-balance").value = "";
    document.getElementById("debt-rate").value = "";
    document.getElementById("debt-minimum").value = "";
    
    // Show strategy form if we have debts
    if (debts.length > 0) {
      document.getElementById("debt-strategy-form").style.display = "block";
    }
  } else {
    alert("Please fill in all fields with valid values.");
  }
});

document.getElementById("debt-strategy-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  if (debts.length === 0) {
    alert("Please add at least one debt before calculating.");
    return;
  }
  
  const extraPayment = parseFloat(document.getElementById("extra-payment").value) || 0;
  const method = document.getElementById("payoff-method").value;
  
  if (method === "compare") {
    const snowballResult = calculateDebtPayoff(debts, extraPayment, "snowball");
    const avalancheResult = calculateDebtPayoff(debts, extraPayment, "avalanche");
    displayComparisonResults(snowballResult, avalancheResult, extraPayment);
  } else {
    const result = calculateDebtPayoff(debts, extraPayment, method);
    displayResults(result, method, extraPayment);
  }
});

function updateDebtList() {
  const listContainer = document.getElementById("debt-list");
  
  if (debts.length === 0) {
    listContainer.innerHTML = "";
    document.getElementById("debt-strategy-form").style.display = "none";
    return;
  }
  
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimum = debts.reduce((sum, debt) => sum + debt.minimum, 0);
  
  listContainer.innerHTML = `
    <h4>Your Debts:</h4>
    <div style="margin-bottom: 1rem;">
      <strong>Total Balance:</strong> $${totalBalance.toLocaleString('en-US', {maximumFractionDigits: 0})} | 
      <strong>Total Minimum Payments:</strong> $${totalMinimum.toLocaleString('en-US', {maximumFractionDigits: 0})}
    </div>
    <div style="display: grid; gap: 0.5rem;">
      ${debts.map(debt => `
        <div style="display: grid; grid-template-columns: 1fr auto auto auto auto; gap: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 0.25rem; align-items: center;">
          <strong>${debt.name}</strong>
          <span>$${debt.balance.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
          <span>${debt.rate}%</span>
          <span>$${debt.minimum}/mo</span>
          <button onclick="removeDebt(${debt.id})" style="background: #d63031; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer;">Remove</button>
        </div>
      `).join('')}
    </div>
  `;
}

function removeDebt(id) {
  debts = debts.filter(debt => debt.id !== id);
  updateDebtList();
}

function calculateDebtPayoff(debts, extraPayment, method) {
  // Create copies of debts to avoid modifying original
  let debtsCopy = debts.map(debt => ({...debt}));
  let totalMinimum = debtsCopy.reduce((sum, debt) => sum + debt.minimum, 0);
  let totalExtraPayment = extraPayment;
  let month = 0;
  let totalInterestPaid = 0;
  let schedule = [];
  let chartData = [];
  
  // Sort debts based on method
  if (method === "snowball") {
    debtsCopy.sort((a, b) => a.balance - b.balance);
  } else if (method === "avalanche") {
    debtsCopy.sort((a, b) => b.rate - a.rate);
  }
  
  while (debtsCopy.length > 0 && month < 600) { // Max 50 years
    month++;
    let monthlyInterest = 0;
    let remainingExtra = totalExtraPayment;
    let debtsPaidOff = [];
    
    // Calculate interest and make minimum payments
    for (let debt of debtsCopy) {
      const monthlyRate = debt.rate / 100 / 12;
      const interestPayment = debt.balance * monthlyRate;
      monthlyInterest += interestPayment;
      
      const principalPayment = Math.min(debt.minimum - interestPayment, debt.balance);
      debt.balance -= principalPayment;
      
      if (debt.balance <= 0) {
        debtsPaidOff.push(debt.name);
        debt.balance = 0;
      }
    }
    
    // Apply extra payment to target debt
    if (remainingExtra > 0 && debtsCopy.length > 0) {
      const targetDebt = debtsCopy.find(debt => debt.balance > 0);
      if (targetDebt) {
        const extraApplied = Math.min(remainingExtra, targetDebt.balance);
        targetDebt.balance -= extraApplied;
        remainingExtra -= extraApplied;
        
        if (targetDebt.balance <= 0) {
          if (!debtsPaidOff.includes(targetDebt.name)) {
            debtsPaidOff.push(targetDebt.name);
          }
          targetDebt.balance = 0;
        }
      }
    }
    
    totalInterestPaid += monthlyInterest;
    
    // Remove paid off debts and add their minimum payments to extra
    debtsCopy = debtsCopy.filter(debt => debt.balance > 0);
    if (debtsPaidOff.length > 0) {
      totalExtraPayment += debts.filter(d => debtsPaidOff.includes(d.name))
                               .reduce((sum, d) => sum + d.minimum, 0);
    }
    
    // Record data for chart and schedule
    const totalBalance = debtsCopy.reduce((sum, debt) => sum + debt.balance, 0);
    chartData.push({
      month: month,
      balance: totalBalance
    });
    
    if (debtsPaidOff.length > 0 || month % 12 === 0 || debtsCopy.length === 0) {
      schedule.push({
        month: month,
        debtsPaidOff: debtsPaidOff,
        payment: totalMinimum + extraPayment,
        remainingBalance: totalBalance,
        interestPaid: monthlyInterest
      });
    }
  }
  
  return {
    months: month,
    totalInterestPaid: totalInterestPaid,
    schedule: schedule,
    chartData: chartData,
    success: debtsCopy.length === 0
  };
}

function displayResults(result, method, extraPayment) {
  const years = Math.floor(result.months / 12);
  const months = result.months % 12;
  const totalPaid = debts.reduce((sum, debt) => sum + debt.balance, 0) + result.totalInterestPaid;
  
  const methodName = method === "snowball" ? "Debt Snowball" : "Debt Avalanche";
  const methodEmoji = method === "snowball" ? "🌨️" : "⛰️";
  
  document.getElementById("debt-result").innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h3>${methodEmoji} ${methodName} Results</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div style="padding: 1rem; background: #e8f5e8; border-radius: 0.5rem;">
          <h4>⏰ Payoff Timeline</h4>
          <p><strong>${years} years, ${months} months</strong></p>
          <p>Total: ${result.months} months</p>
        </div>
        <div style="padding: 1rem; background: #e8f4fd; border-radius: 0.5rem;">
          <h4>💰 Interest Costs</h4>
          <p><strong>$${result.totalInterestPaid.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong></p>
          <p>Total paid: $${totalPaid.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        </div>
        <div style="padding: 1rem; background: #fff3cd; border-radius: 0.5rem;">
          <h4>📊 Monthly Payment</h4>
          <p><strong>$${(debts.reduce((sum, debt) => sum + debt.minimum, 0) + extraPayment).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong></p>
          <p>Extra: $${extraPayment.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 0.5rem;">
      <h4>🎯 ${methodName} Strategy</h4>
      <p>${method === "snowball" ? 
        "Pay minimums on all debts, then put extra money toward the <strong>smallest balance</strong> first. This method provides quick wins and psychological motivation." :
        "Pay minimums on all debts, then put extra money toward the <strong>highest interest rate</strong> first. This method saves the most money mathematically."
      }</p>
    </div>
  `;
  
  generatePayoffSchedule(result.schedule);
  document.getElementById("debt-chart-block").style.display = "block";
  document.getElementById("debt-schedule").style.display = "block";
  ensureChartJs(() => renderDebtChart(result.chartData, methodName));
}

function displayComparisonResults(snowballResult, avalancheResult, extraPayment) {
  const snowballYears = Math.floor(snowballResult.months / 12);
  const snowballMonths = snowballResult.months % 12;
  const avalancheYears = Math.floor(avalancheResult.months / 12);
  const avalancheMonths = avalancheResult.months % 12;
  
  const interestSavings = snowballResult.totalInterestPaid - avalancheResult.totalInterestPaid;
  const timeSavings = snowballResult.months - avalancheResult.months;
  
  document.getElementById("debt-result").innerHTML = `
    <h3>📊 Snowball vs Avalanche Comparison</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
      <div style="padding: 1.5rem; background: #e8f5e8; border-radius: 0.5rem;">
        <h4>🌨️ Debt Snowball Method</h4>
        <p><strong>Payoff Time:</strong> ${snowballYears} years, ${snowballMonths} months</p>
        <p><strong>Total Interest:</strong> $${snowballResult.totalInterestPaid.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Strategy:</strong> Smallest balance first</p>
        <p><strong>Best for:</strong> Motivation and quick wins</p>
      </div>
      
      <div style="padding: 1.5rem; background: #e8f4fd; border-radius: 0.5rem;">
        <h4>⛰️ Debt Avalanche Method</h4>
        <p><strong>Payoff Time:</strong> ${avalancheYears} years, ${avalancheMonths} months</p>
        <p><strong>Total Interest:</strong> $${avalancheResult.totalInterestPaid.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Strategy:</strong> Highest rate first</p>
        <p><strong>Best for:</strong> Saving money</p>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
      <div style="padding: 1rem; background: ${interestSavings > 0 ? '#d4edda' : '#f8d7da'}; border-radius: 0.5rem;">
        <h4>💰 Interest Savings (Avalanche)</h4>
        <p><strong>${interestSavings > 0 ? '$' + interestSavings.toLocaleString('en-US', {maximumFractionDigits: 0}) + ' saved' : 'No difference'}</strong></p>
        <p>${interestSavings > 0 ? 'Avalanche saves money' : 'Methods are similar'}</p>
      </div>
      
      <div style="padding: 1rem; background: ${timeSavings > 0 ? '#d4edda' : '#f8d7da'}; border-radius: 0.5rem;">
        <h4>⏰ Time Savings (Avalanche)</h4>
        <p><strong>${timeSavings > 0 ? timeSavings + ' months faster' : 'Same timeline'}</strong></p>
        <p>${timeSavings > 0 ? 'Avalanche is faster' : 'Methods take same time'}</p>
      </div>
    </div>
    
    <div style="padding: 1rem; background: #fff3cd; border-radius: 0.5rem;">
      <h4>🎯 Recommendation</h4>
      <p><strong>${Math.abs(interestSavings) > 1000 || Math.abs(timeSavings) > 6 ? 
        (interestSavings > 500 ? 'Debt Avalanche' : 'Debt Snowball') : 
        'Either method works well'
      }</strong></p>
      <p>${Math.abs(interestSavings) > 1000 ? 
        (interestSavings > 500 ? 
          'The avalanche method will save you significant money in interest.' : 
          'The snowball method provides better motivation with similar costs.') :
        'Both methods are very similar in cost and time. Choose based on your personality - snowball for motivation, avalanche for math optimization.'
      }</p>
    </div>
  `;
  
  // Show avalanche schedule by default for comparison
  generatePayoffSchedule(avalancheResult.schedule);
  document.getElementById("debt-chart-block").style.display = "block";
  document.getElementById("debt-schedule").style.display = "block";
  ensureChartJs(() => renderDebtComparisonChart(snowballResult.chartData, avalancheResult.chartData));
}

function generatePayoffSchedule(schedule) {
  const tbody = document.getElementById("schedule-body");
  tbody.innerHTML = "";
  
  schedule.slice(0, 24).forEach(entry => { // Show first 24 months
    const row = tbody.insertRow();
    row.innerHTML = `
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${entry.month}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd;">${entry.debtsPaidOff.join(', ') || '-'}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">$${entry.payment.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">$${entry.remainingBalance.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">$${entry.interestPaid.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
    `;
  });
  
  if (schedule.length > 24) {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td colspan="5" style="padding: 0.5rem; border: 1px solid #ddd; text-align: center; font-style: italic;">
        ... showing first 24 months of ${schedule.length} total payments
      </td>
    `;
  }
}

function renderDebtChart(chartData, methodName) {
  const ctx = document.getElementById("debt-chart").getContext("2d");
  
  if (window.debtChart) {
    window.debtChart.destroy();
  }
  
  window.debtChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.map(d => d.month),
      datasets: [{
        label: 'Remaining Debt Balance',
        data: chartData.map(d => d.balance),
        borderColor: '#e17055',
        backgroundColor: 'rgba(225, 112, 85, 0.1)',
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
            text: 'Months'
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

function renderDebtComparisonChart(snowballData, avalancheData) {
  const ctx = document.getElementById("debt-chart").getContext("2d");
  
  if (window.debtChart) {
    window.debtChart.destroy();
  }
  
  const maxLength = Math.max(snowballData.length, avalancheData.length);
  const labels = Array.from({length: maxLength}, (_, i) => i + 1);
  
  window.debtChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Snowball Method',
          data: snowballData.map(d => d.balance),
          borderColor: '#74b9ff',
          backgroundColor: 'rgba(116, 185, 255, 0.1)',
          borderWidth: 3,
          tension: 0.1
        },
        {
          label: 'Avalanche Method',
          data: avalancheData.map(d => d.balance),
          borderColor: '#e17055',
          backgroundColor: 'rgba(225, 112, 85, 0.1)',
          borderWidth: 3,
          tension: 0.1
        }
      ]
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
            text: 'Months'
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