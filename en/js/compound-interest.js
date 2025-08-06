document.getElementById("compound-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const initial = parseFloat(document.getElementById("initial").value) || 0;
  const rate = (parseFloat(document.getElementById("rate").value) || 0) / 100;
  const years = parseFloat(document.getElementById("years").value) || 0;
  const frequency = parseInt(document.getElementById("compound-frequency").value) || 1;
  const contribution = parseFloat(document.getElementById("contribution").value) || 0;
  const contributionFrequency = parseInt(document.getElementById("contribution-frequency").value) || 1;

  const periods = years * frequency;
  const ratePerPeriod = rate / frequency;

  let balance = initial;
  let data = [];
  let labels = [];

  for (let i = 0; i <= periods; i++) {
    if (i !== 0) {
      balance *= (1 + ratePerPeriod);
      if (contribution > 0 && contributionFrequency > 0) {
        // Add contribution at correct intervals
        if (i % (frequency / contributionFrequency) === 0) {
          balance += contribution;
        }
      }
    }

    // Record data points at full years or at end
    if (i % frequency === 0 || i === periods) {
      data.push(parseFloat(balance.toFixed(2)));
      labels.push((i / frequency).toFixed(0));
    }
  }

  const totalContributions = contribution * (periods / (frequency / contributionFrequency));
  const profit = (balance - initial - totalContributions).toFixed(2);
  const finalAmount = balance.toFixed(2);

  document.getElementById("compound-result").innerHTML = `
    <p><strong>Final Amount:</strong> $${finalAmount}</p>
    <p><strong>Net Profit:</strong> $${profit}</p>
    <p><strong>Total Contributions:</strong> $${totalContributions.toFixed(2)}</p>
    <p><strong>Initial Investment:</strong> $${initial.toFixed(2)}</p>
  `;

  document.getElementById("compound-chart-block").style.display = "block";
  ensureChartJs(() => renderChart(labels, data));
});

let chart;
function renderChart(labels, data) {
  const ctx = document.getElementById("compound-chart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Investment Value",
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
              return "Value: $" + context.parsed.y.toLocaleString();
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

// Auto-calculate with default values on page load
setTimeout(() => {
  const form = document.getElementById("compound-form");
  if (form) {
    form.dispatchEvent(new Event('submit'));
  }
}, 100);