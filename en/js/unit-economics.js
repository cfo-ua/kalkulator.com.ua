document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("unit-economics-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const price = parseFloat(document.getElementById("unitPrice").value);
    const cost = parseFloat(document.getElementById("unitCost").value);
    const fixed = parseFloat(document.getElementById("fixedCosts").value);
    const monthlyUnits = parseInt(document.getElementById("monthlyUnits").value);

    const contribution = price - cost;
    const marginPercent = (contribution / price) * 100;
    const breakevenUnits = Math.ceil(fixed / contribution);
    const monthlyProfit = (contribution * monthlyUnits) - fixed;

    const formatCurrency = num => {
      return Math.round(num).toLocaleString("en-US", {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    };

    const result = document.getElementById("unit-economics-result");
    result.innerHTML = `
      <h3>Unit Economics Analysis:</h3>
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <p style="margin: 0; font-size: 0.9em; color: #666;">Contribution Margin</p>
            <p style="margin: 0; font-weight: bold; font-size: 1.1em;">${formatCurrency(contribution)} per unit</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 0.9em; color: #666;">Margin Percentage</p>
            <p style="margin: 0; font-weight: bold; font-size: 1.1em;">${marginPercent.toFixed(1)}%</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 0.9em; color: #666;">Break-Even Point</p>
            <p style="margin: 0; font-weight: bold; font-size: 1.1em;">${breakevenUnits.toLocaleString()} units</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 0.9em; color: #666;">Monthly Profit</p>
            <p style="margin: 0; font-weight: bold; font-size: 1.1em; color: ${monthlyProfit >= 0 ? '#28a745' : '#dc3545'}">${formatCurrency(monthlyProfit)}</p>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; font-style: italic;">
            ${monthlyUnits >= breakevenUnits 
              ? `✓ Your expected sales (${monthlyUnits.toLocaleString()} units) exceed break-even. Business is profitable!` 
              : `⚠ You need ${(breakevenUnits - monthlyUnits).toLocaleString()} more units to reach break-even.`}
          </p>
        </div>
      </div>
    `;

    const chartBlock = document.getElementById("unit-economics-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const labels = [];
      const data = [];

      for (let i = 1; i <= 12; i++) {
        labels.push(`Month ${i}`);
        data.push(monthlyProfit * i);
      }

      const ctx = document.getElementById("unit-economics-chart").getContext("2d");
      if (window.unitChart) window.unitChart.destroy();

      window.unitChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Cumulative Profit",
            data: data,
            borderColor: monthlyProfit >= 0 ? "#4CAF50" : "#F44336",
            backgroundColor: monthlyProfit >= 0 ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return "$" + context.parsed.y.toLocaleString("en-US");
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Cumulative Profit ($)" },
              ticks: {
                callback: function (value) {
                  return "$" + value.toLocaleString("en-US");
                }
              }
            },
            x: {
              title: { display: true, text: "Months" }
            }
          }
        }
      });
    });
  });
});

function ensureChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.body.appendChild(script);
}