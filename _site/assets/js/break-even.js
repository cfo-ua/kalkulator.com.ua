document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("break-even-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fixedCosts = parseFloat(document.getElementById("fixedCosts").value);
    const variableCost = parseFloat(document.getElementById("variableCost").value);
    const unitPrice = parseFloat(document.getElementById("unitPrice").value);
    const monthlySales = parseFloat(document.getElementById("monthlySales").value);
    const months = 12;

    const contributionMargin = unitPrice - variableCost;
    const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : Infinity;

    const profitForecast = [];
    const labels = [];
    for (let i = 1; i <= months; i++) {
      const profit = monthlySales * contributionMargin - fixedCosts;
      profitForecast.push(profit * i); // cumulative profit
      labels.push(`${i}-й міс`);
    }

    // Result block
    const resultBlock = document.getElementById("break-even-result");
    resultBlock.innerHTML = `
      <h3>Результат:</h3>
      <p>Щоб вийти на беззбитковість, потрібно продати <b>${Math.ceil(breakEvenUnits)}</b> одиниць.</p>
      <p><b>${monthlySales >= breakEvenUnits ? "Очікувані продажі дозволяють отримати прибуток." : "Очікувані продажі недостатні для покриття витрат."}</b></p>
    `;

    // Chart display
    const chartBlock = document.getElementById("break-even-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("break-even-chart").getContext("2d");
      if (window.breakEvenChart) window.breakEvenChart.destroy();

      window.breakEvenChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Накопичений прибуток",
            data: profitForecast,
            borderColor: profitForecast[months - 1] >= 0 ? "#4CAF50" : "#F44336",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return "₴ " + context.parsed.y.toLocaleString("uk-UA");
                }
              }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Прибуток / Збиток, грн." },
              ticks: {
                callback: function (value) {
                  return value.toLocaleString("uk-UA");
                }
              }
            },
            x: {
              title: { display: true, text: "Місяці" }
            }
          }
        }
      });
    });
  });
});

// Dynamic loader for Chart.js
function ensureChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.body.appendChild(script);
}
