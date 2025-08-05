document.getElementById("dividend-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const stockPrice = parseFloat(document.getElementById("stock-price").value) || 0;
  const annualDividend = parseFloat(document.getElementById("annual-dividend").value) || 0;
  const sharesCount = parseFloat(document.getElementById("shares-count").value) || 0;
  const investmentAmount = parseFloat(document.getElementById("investment-amount").value) || 0;
  const dividendGrowth = parseFloat(document.getElementById("dividend-growth").value) || 0;
  const reinvestment = document.getElementById("reinvestment").value === "true";
  const forecastYears = parseInt(document.getElementById("forecast-years").value) || 1;

  if (stockPrice === 0) {
    alert("Please enter stock price");
    return;
  }

  // Calculate dividend yield
  const dividendYield = (annualDividend / stockPrice) * 100;
  const annualDividendIncome = annualDividend * sharesCount;
  const monthlyDividendIncome = annualDividendIncome / 12;

  // Calculate forecast
  let projectionData = [];
  let cumulativeIncome = 0;
  let currentShares = sharesCount;
  let currentDividend = annualDividend;

  for (let year = 1; year <= forecastYears; year++) {
    // Grow dividend
    if (year > 1) {
      currentDividend *= (1 + dividendGrowth / 100);
    }

    const yearlyIncome = currentDividend * currentShares;
    cumulativeIncome += yearlyIncome;

    // If reinvesting, buy more shares
    if (reinvestment) {
      const newShares = yearlyIncome / stockPrice; // Simplified - assumes same stock price
      currentShares += newShares;
    }

    projectionData.push({
      year: year,
      shares: currentShares,
      dividend: currentDividend,
      yearlyIncome: yearlyIncome,
      cumulativeIncome: cumulativeIncome
    });
  }

  const finalYearData = projectionData[projectionData.length - 1];
  const totalReturn = (cumulativeIncome / investmentAmount) * 100;
  const annualizedReturn = Math.pow(1 + totalReturn / 100, 1 / forecastYears) - 1;

  // Dividend growth assessment
  let yieldAssessment = "";
  let yieldColor = "#007bff";
  if (dividendYield < 2) {
    yieldAssessment = "Low yield";
    yieldColor = "#dc3545";
  } else if (dividendYield < 4) {
    yieldAssessment = "Moderate yield";
    yieldColor = "#ffc107";
  } else if (dividendYield < 7) {
    yieldAssessment = "Good yield";
    yieldColor = "#28a745";
  } else if (dividendYield < 10) {
    yieldAssessment = "High yield";
    yieldColor = "#fd7e14";
  } else {
    yieldAssessment = "Very high (risky!)";
    yieldColor = "#dc3545";
  }

  document.getElementById("dividend-result").innerHTML = `
    <div class="insight-card success">
      <h6>📊 Dividend Yield</h6>
      <div style="font-size: 2.2em; font-weight: bold; color: ${yieldColor}; margin: 0.5em 0;">
        ${dividendYield.toFixed(2)}%
      </div>
      <p style="margin: 0; color: #666;">
        ${yieldAssessment}
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
      <div class="insight-card">
        <h6>💰 Annual Income</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #007bff;">
          $${annualDividendIncome.toLocaleString()}
        </div>
        <small>From dividends</small>
      </div>
      
      <div class="insight-card warning">
        <h6>📅 Monthly Income</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #856404;">
          $${monthlyDividendIncome.toLocaleString()}
        </div>
        <small>Average monthly</small>
      </div>
      
      <div class="insight-card">
        <h6>📈 Projection (${forecastYears} years)</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #6c757d;">
          $${finalYearData.cumulativeIncome.toLocaleString()}
        </div>
        <small>Total income</small>
      </div>
    </div>

    <div class="insight-card info">
      <h6>📋 Investment Details</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9em;">
          <div><strong>Investment amount:</strong></div>
          <div>$${investmentAmount.toLocaleString()}</div>
          
          <div><strong>Number of shares:</strong></div>
          <div>${sharesCount.toLocaleString()}</div>
          
          <div><strong>Price per share:</strong></div>
          <div>$${stockPrice.toLocaleString()}</div>
          
          <div><strong>Dividend per share:</strong></div>
          <div>$${annualDividend.toFixed(2)}</div>
          
          <div><strong>Dividend growth:</strong></div>
          <div>${dividendGrowth}% per year</div>
          
          <div><strong>Reinvestment:</strong></div>
          <div>${reinvestment ? "Yes" : "No"}</div>
        </div>
      </div>
    </div>

    ${reinvestment ? `
    <div class="insight-card">
      <h6>🔄 Reinvestment Effect</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9em;">
          <div><strong>Shares after ${forecastYears} years:</strong></div>
          <div>${finalYearData.shares.toFixed(0)}</div>
          
          <div><strong>Portfolio growth:</strong></div>
          <div>+${((finalYearData.shares - sharesCount) / sharesCount * 100).toFixed(1)}%</div>
          
          <div><strong>Dividend after ${forecastYears} years:</strong></div>
          <div>$${finalYearData.dividend.toFixed(2)} per share</div>
          
          <div><strong>Annual income after ${forecastYears} years:</strong></div>
          <div>$${finalYearData.yearlyIncome.toLocaleString()}</div>
        </div>
      </div>
    </div>` : ''}

    <div class="insight-card">
      <h6>💡 Recommendations</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <ul style="margin: 0; padding-left: 1.5rem;">
          ${generateRecommendations(dividendYield, dividendGrowth, reinvestment, investmentAmount)}
        </ul>
      </div>
    </div>
  `;

  // Show chart
  document.getElementById("dividend-chart-block").style.display = "block";
  ensureChartJs(() => renderDividendChart(projectionData));
});

function generateRecommendations(yield_, growth, reinvest, amount) {
  let recommendations = [];

  if (yield_ < 2) {
    recommendations.push("Low yield may indicate potential for stock price growth");
  } else if (yield_ > 8) {
    recommendations.push("High yield may signal risks - check company's financial health");
  }

  if (growth < 3) {
    recommendations.push("Low dividend growth - consider companies with history of increasing payments");
  }

  if (!reinvest) {
    recommendations.push("Reinvesting dividends significantly increases long-term returns");
  }

  if (amount < 50000) {
    recommendations.push("For diversification, consider dividend ETFs instead of individual companies");
  }

  recommendations.push("Regularly review financial health of companies in your portfolio");
  recommendations.push("Diversify investments across different economic sectors");

  return recommendations.map(rec => `<li>${rec}</li>`).join("");
}

let dividendChart;
function renderDividendChart(data) {
  const ctx = document.getElementById('dividend-chart').getContext('2d');
  
  if (dividendChart) {
    dividendChart.destroy();
  }

  const years = data.map(d => d.year);
  const cumulativeIncome = data.map(d => d.cumulativeIncome);
  const yearlyIncome = data.map(d => d.yearlyIncome);

  dividendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Cumulative Income ($)',
        data: cumulativeIncome,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.4
      }, {
        label: 'Annual Income ($)',
        data: yearlyIncome,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Years'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Chart.js loader
function ensureChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.body.appendChild(script);
}