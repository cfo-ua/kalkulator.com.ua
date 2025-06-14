document.getElementById("compound-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const initial = parseFloat(document.getElementById("initial").value);
  const rate = parseFloat(document.getElementById("rate").value) / 100;
  const years = parseFloat(document.getElementById("years").value);
  const frequency = parseInt(document.getElementById("compound-frequency").value);
  const contribution = parseFloat(document.getElementById("contribution").value);
  const contributionFrequency = parseInt(document.getElementById("contribution-frequency").value);

  const periods = years * frequency;
  const ratePerPeriod = rate / frequency;

  let balance = initial;
  let data = [];
  let labels = [];

  for (let i = 0; i <= periods; i++) {
    if (i !== 0) {
      balance *= (1 + ratePerPeriod);
      if (i % (frequency / contributionFrequency) === 0) {
        balance += contribution;
      }
    }

    if (i % frequency === 0 || i === periods) {
      data.push(balance.toFixed(2));
      labels.push((i / frequency).toFixed(0));
    }
  }

  // Підсумкові розрахунки
  const finalAmount = balance.toFixed(2);
  const totalContributions = contribution * (periods / (frequency / contributionFrequency));
  const profit = (balance - initial - totalContributions).toFixed(2);

  document.getElementById("compound-result").innerHTML = `
    <p><strong>Підсумкова сума:</strong> ${finalAmount}</p>
    <p><strong>Чистий прибуток:</strong> ${profit}</p>
  `;

  // Відображення графіка
  document.getElementById("compound-chart-block").style.display = "block";
  renderChart(labels, data);
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
      datasets: [{
        label: "Капітал",
        data: data,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
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
              return context.parsed.y + '';
            }
          }
        }
      },
      scales: {
        x: { title: { display: true, text: 'Роки' } },
        y: { title: { display: true, text: 'Капітал' } }
      }
    }
  });
}
