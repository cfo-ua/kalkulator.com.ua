<script>
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
      if (contribution > 0 && i % (frequency / contributionFrequency) === 0) {
        balance += contribution;
      }
    }

    if (i % frequency === 0 || i === periods) {
      data.push(balance.toFixed(2));
      labels.push((i / frequency).toFixed(0));
    }
  }

  const finalAmount = balance.toFixed(2);
  const totalContributions = contribution * (periods / (frequency / contributionFrequency));
  const profit = (balance - initial - totalContributions).toFixed(2);

  document.getElementById("compound-result").innerHTML = `
    <p><strong>Підсумкова сума:</strong> ${finalAmount} грн</p>
    <p><strong>Чистий прибуток:</strong> ${profit} грн</p>
    <p><strong>Загальні внески:</strong> ${totalContributions.toFixed(2)} грн</p>
  `;

  document.getElementById("compound-chart-block").style.display = "block";
  renderCompoundChart(labels, data);
});

let compoundChart;
function renderCompoundChart(labels, data) {
  const ctx = document.getElementById("compound-chart").getContext("2d");

  if (compoundChart) {
    compoundChart.destroy();
  }

  compoundChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Сума на рахунку",
        data: data,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.parsed.y + " грн";
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Роки"
          }
        },
        y: {
          title: {
            display: true,
            text: "Капітал, грн"
          },
          beginAtZero: true
        }
      }
    }
  });
}
</script>
