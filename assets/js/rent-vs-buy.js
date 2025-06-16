document.getElementById("rent-buy-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const apartmentCost = parseFloat(document.getElementById("apartment-cost").value);
  const monthlyRent = parseFloat(document.getElementById("monthly-rent").value);
  const annualReturn = parseFloat(document.getElementById("annual-return").value) / 100;
  const years = 10;

  const rentCosts = [];
  const investmentValues = [];
  const labels = [];

  let investment = apartmentCost;
  let rentTotal = 0;

  for (let year = 1; year <= years; year++) {
    rentTotal += monthlyRent * 12;
    investment *= (1 + annualReturn);

    labels.push(`${year}-й рік`);
    rentCosts.push(rentTotal);
    investmentValues.push(investment);
  }

  // Вивід текстових результатів
  const resultBlock = document.getElementById("rent-buy-result");
  resultBlock.innerHTML = `
    <h3>Результат:</h3>
    <p>Через ${years} років ви заплатите за оренду <b>${rentTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} грн</b>.</p>
    <p>Якщо б ви інвестували ${apartmentCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} грн під ${annualReturn * 100}% річних, ви б отримали <b>${investment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} грн</b>.</p>
    <p><b>${investment > rentTotal ? "Інвестувати вигідніше." : "Орендувати вигідніше."}</b></p>
  `;

  // Побудова графіка
  const chartBlock = document.getElementById("rent-buy-chart-block");
  chartBlock.style.display = "block";

  const ctx = document.getElementById("rent-buy-chart").getContext("2d");
  if (window.rentBuyChart) window.rentBuyChart.destroy(); // очищення попереднього графіка

  window.rentBuyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Вартість оренди (накопичена)",
          data: rentCosts,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Інвестиція (накопичена)",
          data: investmentValues,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.parsed.y.toLocaleString("uk-UA") + " грн";
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString("uk-UA") + " грн";
            }
          }
        }
      }
    }
  });
});
