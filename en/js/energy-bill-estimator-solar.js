document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("solar-calculator-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const monthlyUsage = parseFloat(document.getElementById("monthlyUsage").value);
    const electricityRate = parseFloat(document.getElementById("electricityRate").value);
    const systemSize = parseFloat(document.getElementById("systemSize").value);
    const installationCost = parseFloat(document.getElementById("installationCost").value);
    const peakSunHours = parseFloat(document.getElementById("peakSunHours").value);
    const systemEfficiency = parseFloat(document.getElementById("systemEfficiency").value) / 100;

    // Calculate monthly solar generation
    const dailyGeneration = systemSize * peakSunHours * systemEfficiency;
    const monthlyGeneration = dailyGeneration * 30.44; // average days per month
    const annualGeneration = dailyGeneration * 365;

    // Calculate savings
    const monthlyBillBefore = monthlyUsage * electricityRate;
    const monthlySolarValue = monthlyGeneration * electricityRate;
    const netMonthlyUsage = Math.max(0, monthlyUsage - monthlyGeneration);
    const monthlyBillAfter = netMonthlyUsage * electricityRate;
    const monthlySavings = monthlyBillBefore - monthlyBillAfter;
    const annualSavings = monthlySavings * 12;

    // Calculate payback period
    const paybackYears = installationCost / annualSavings;
    const paybackMonths = Math.round(paybackYears * 12);

    // Calculate 25-year totals
    const totalSavings25Years = annualSavings * 25;
    const netProfit25Years = totalSavings25Years - installationCost;
    const roi = (netProfit25Years / installationCost) * 100;

    // Generate timeline data for chart
    const timelineData = [];
    const years = [];
    let cumulativeSavings = 0;
    
    for (let year = 1; year <= 25; year++) {
      cumulativeSavings += annualSavings;
      const netValue = cumulativeSavings - installationCost;
      timelineData.push(netValue);
      years.push(`Year ${year}`);
    }

    // Display results
    const resultBlock = document.getElementById("solar-result");
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🔋 Monthly Generation</h6>
          <div class="big-number">${monthlyGeneration.toFixed(0)}</div>
          <p class="insight-detail">kWh generated per month</p>
        </div>
        <div class="insight-card success">
          <h6>💰 Monthly Savings</h6>
          <div class="big-number">$${monthlySavings.toFixed(0)}</div>
          <p class="insight-detail">${((monthlySavings/monthlyBillBefore)*100).toFixed(0)}% bill reduction</p>
        </div>
        <div class="insight-card warning">
          <h6>⏱️ Payback Period</h6>
          <div class="big-number">${paybackYears.toFixed(1)}</div>
          <p class="insight-detail">years (${paybackMonths} months)</p>
        </div>
        <div class="insight-card success">
          <h6>📈 25-Year ROI</h6>
          <div class="big-number">${roi.toFixed(0)}%</div>
          <p class="insight-detail">$${netProfit25Years.toLocaleString()} profit</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">📊 Financial Summary</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div>
            <p><strong>Before Solar:</strong></p>
            <p>Monthly Bill: $${monthlyBillBefore.toFixed(2)}</p>
            <p>Annual Cost: $${(monthlyBillBefore * 12).toFixed(0)}</p>
          </div>
          <div>
            <p><strong>After Solar:</strong></p>
            <p>Monthly Bill: $${monthlyBillAfter.toFixed(2)}</p>
            <p>Annual Cost: $${(monthlyBillAfter * 12).toFixed(0)}</p>
          </div>
          <div>
            <p><strong>System Performance:</strong></p>
            <p>Coverage: ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% of usage</p>
            <p>Daily Generation: ${dailyGeneration.toFixed(1)} kWh</p>
          </div>
          <div>
            <p><strong>Investment Analysis:</strong></p>
            <p>Total Investment: $${installationCost.toLocaleString()}</p>
            <p>25-Year Savings: $${totalSavings25Years.toLocaleString()}</p>
          </div>
        </div>
        ${monthlyGeneration > monthlyUsage ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #e8f8e8; border-radius: 8px; border: 2px solid #28a745;">
            <p><strong>✅ Excellent Coverage!</strong> Your solar system generates ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% of your electricity usage. 
            You may have excess energy to sell back to the grid through net metering programs.</p>
          </div>` : 
          monthlyGeneration > monthlyUsage * 0.8 ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #fff8e1; border-radius: 8px; border: 2px solid #ffc107;">
            <p><strong>⚡ Good Coverage!</strong> Your solar system covers ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% of your electricity usage. 
            Consider adding more panels to achieve full energy independence.</p>
          </div>` :
          `<div style="margin-top: 1rem; padding: 1rem; background: #ffe8e8; border-radius: 8px; border: 2px solid #dc3545;">
            <p><strong>⚠️ Partial Coverage</strong> Your solar system covers only ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% of your electricity usage. 
            Consider increasing system size for better savings.</p>
          </div>`
        }
      </div>
    `;

    // Show chart
    const chartBlock = document.getElementById("solar-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("solar-chart").getContext("2d");
      if (window.solarChart) window.solarChart.destroy();

      window.solarChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [{
            label: "Net Savings (Cumulative - Investment Cost)",
            data: timelineData,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            fill: true,
            tension: 0.1
          }, {
            label: "Break-even Line",
            data: new Array(25).fill(0),
            borderColor: "#FF5722",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Solar Panel Investment Timeline"
            },
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Net Savings ($)"
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              title: {
                display: true,
                text: "Years"
              }
            }
          },
          elements: {
            point: {
              radius: 3,
              hoverRadius: 6
            }
          }
        }
      });
    });
  });
});

// Ensure Chart.js is loaded
function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}