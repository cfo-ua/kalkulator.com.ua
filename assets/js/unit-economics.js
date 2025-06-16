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

    const formatNumber = num => Math.round(num).toLocaleString("uk-UA");

    const result = document.getElementById("unit-economics-result");
    result.innerHTML = `
      <p><strong>Маржинальний прибуток:</strong> ${formatNumber(contribution)}</p>
      <p><strong>Маржинальність:</strong> ${marginPercent.toFixed(1)}%</p>
      <p><strong>Точка беззбитковості:</strong> ${formatNumber(breakevenUnits)} одиниць</p>
      <p><strong>Очікуваний місячний прибуток:</strong> ${formatNumber(monthlyProfit)}</p>
    `;

    const chartBlock = document.getElementById("unit-economics-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const labels = [];
      const data = [];

      for (let i = 1; i <= 12; i++) {
        labels.push(`${i}-й місяць`);
        data.push(monthlyProfit * i);
      }

      const ctx = document.getElementById("unit-economics-chart").getContext("2d");
      if (window.unitChart) window.unitChart.destroy();

      window.unitChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Накопичений прибуток",
            data: data,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
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
                  return context.parsed.y.toLocaleString("uk-UA");
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString("uk-UA");
                }
              }
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
