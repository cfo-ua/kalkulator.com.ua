document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("rent-buy-form");
  const propertyCostInput = document.getElementById("propertyCost");
  const monthlyRentInput = document.getElementById("monthlyRent");
  const investmentRateInput = document.getElementById("investmentRate");
  const resultDiv = document.getElementById("rent-buy-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateRentVsBuy();
  });

  function calculateRentVsBuy() {
    const propertyCost = parseFloat(propertyCostInput.value) || 0;
    const monthlyRent = parseFloat(monthlyRentInput.value) || 0;
    const annualInvestmentRate = parseFloat(investmentRateInput.value) || 0;

    if (propertyCost <= 0 || monthlyRent <= 0 || annualInvestmentRate < 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid values for all fields.</p>';
      return;
    }

    const years = 10;
    const monthlyInvestmentRate = annualInvestmentRate / 100 / 12;

    let cumulativeRentCosts = [];
    let cumulativeInvestmentReturns = [];
    let yearLabels = [];

    // Calculate for each year
    for (let year = 1; year <= years; year++) {
      // Cumulative rent costs
      const totalRentCost = monthlyRent * 12 * year;
      cumulativeRentCosts.push(totalRentCost);

      // Cumulative investment returns (net profit only, not including principal)
      const totalInvestmentReturn = propertyCost * (Math.pow(1 + annualInvestmentRate / 100, year) - 1);
      cumulativeInvestmentReturns.push(totalInvestmentReturn);

      yearLabels.push(year.toString());
    }

    // Final comparison
    const finalRentCost = cumulativeRentCosts[years - 1];
    const finalInvestmentReturn = cumulativeInvestmentReturns[years - 1];
    const difference = finalInvestmentReturn - finalRentCost;
    const betterOption = difference > 0 ? "investment" : "renting";

    // Calculate break-even point
    let breakEvenYear = null;
    for (let year = 1; year <= years; year++) {
      if (cumulativeInvestmentReturns[year - 1] > cumulativeRentCosts[year - 1]) {
        breakEvenYear = year;
        break;
      }
    }

    displayResults({
      propertyCost,
      monthlyRent,
      annualInvestmentRate,
      finalRentCost,
      finalInvestmentReturn,
      difference,
      betterOption,
      breakEvenYear,
      years
    });

    // Show chart
    document.getElementById("rent-buy-chart-block").style.display = "block";
    ensureChartJs(() => renderChart(yearLabels, cumulativeRentCosts, cumulativeInvestmentReturns));
  }

  function displayResults(data) {
    const {
      propertyCost,
      monthlyRent,
      annualInvestmentRate,
      finalRentCost,
      finalInvestmentReturn,
      difference,
      betterOption,
      breakEvenYear,
      years
    } = data;

    const rentToValueRatio = (monthlyRent * 12 / propertyCost * 100).toFixed(2);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>Rent vs Buy Analysis (${years} Years)</h3>
        
        <div class="comparison-summary ${betterOption === 'investment' ? 'investment-wins' : 'rent-wins'}">
          <div class="winner">
            <strong>${betterOption === 'investment' ? '🏆 Investment Strategy Wins' : '🏆 Renting Strategy Wins'}</strong>
            <p>By $${Math.abs(difference).toLocaleString()} over ${years} years</p>
          </div>
        </div>

        <div class="financial-insights">
          <div class="insight-cards">
            <div class="insight-card ${betterOption === 'investment' ? 'success' : 'warning'}">
              <h6>🏆 Winner</h6>
              <p class="big-number">${betterOption === 'investment' ? 'Invest' : 'Buy'}</p>
              <p class="insight-detail">${betterOption === 'investment' ? 'rent & invest wins' : 'buying wins'}</p>
            </div>
            
            <div class="insight-card info">
              <h6>💰 Advantage</h6>
              <p class="big-number">$${Math.abs(difference).toLocaleString()}</p>
              <p class="insight-detail">over ${years} years</p>
            </div>
            
            <div class="insight-card ${rentToValueRatio <= 5 ? 'success' : rentToValueRatio <= 8 ? 'warning' : 'info'}">
              <h6>📊 Rent-to-Value</h6>
              <p class="big-number">${rentToValueRatio}%</p>
              <p class="insight-detail">annual rent ratio</p>
            </div>
            
            <div class="insight-card info">
              <h6>📈 Investment Rate</h6>
              <p class="big-number">${annualInvestmentRate}%</p>
              <p class="insight-detail">assumed return</p>
            </div>
          </div>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <span class="label">Property Price:</span>
            <span class="value">$${propertyCost.toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="label">Monthly Rent:</span>
            <span class="value">$${monthlyRent.toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="label">Investment Return Rate:</span>
            <span class="value">${annualInvestmentRate}% annually</span>
          </div>
          <div class="result-item">
            <span class="label">Rent-to-Value Ratio:</span>
            <span class="value">${rentToValueRatio}% annually</span>
          </div>
        </div>

        <div class="comparison-results">
          <div class="scenario rent-scenario">
            <h4>💰 Renting + Investing</h4>
            <div class="scenario-details">
              <p><strong>Total Rent Paid:</strong> $${finalRentCost.toLocaleString()}</p>
              <p><strong>Investment Returns:</strong> $${finalInvestmentReturn.toLocaleString()}</p>
              <p><strong>Net Position:</strong> $${(finalInvestmentReturn - finalRentCost).toLocaleString()}</p>
            </div>
          </div>
          
          <div class="scenario buy-scenario">
            <h4>🏠 Buying Property</h4>
            <div class="scenario-details">
              <p><strong>Initial Investment:</strong> $${propertyCost.toLocaleString()}</p>
              <p><strong>Opportunity Cost:</strong> $${finalInvestmentReturn.toLocaleString()}</p>
              <p><strong>Rent Savings:</strong> $${finalRentCost.toLocaleString()}</p>
            </div>
          </div>
        </div>

        ${breakEvenYear ? `
        <div class="break-even">
          <p><strong>Break-even Point:</strong> Investment returns exceed rent costs after ${breakEvenYear} year${breakEvenYear > 1 ? 's' : ''}</p>
        </div>
        ` : `
        <div class="break-even">
          <p><strong>Break-even:</strong> Investment returns don't exceed rent costs within ${years} years</p>
        </div>
        `}

        <div class="disclaimer">
          <p><em>Note: This simplified calculation doesn't include property taxes, maintenance, closing costs, property appreciation, tax benefits, or inflation. Consider these factors in your real-world decision.</em></p>
        </div>
      </div>
    `;
  }

  let chart;
  function renderChart(labels, rentCosts, investmentReturns) {
    const ctx = document.getElementById("rent-buy-chart").getContext("2d");

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Cumulative Rent Costs",
            data: rentCosts,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Cumulative Investment Returns",
            data: investmentReturns,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
          x: {
            title: {
              display: true,
              text: "Years",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ": $" + context.parsed.y.toLocaleString();
              },
            },
          },
        },
      },
    });
  }

  function ensureChartJs(callback) {
    if (typeof Chart !== "undefined") {
      callback();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = callback;
      document.head.appendChild(script);
    }
  }
});