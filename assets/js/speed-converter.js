document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("salary-period-form");
  const resultDiv = document.getElementById("salary-period-result");

  const periods = {
    year: 1,
    month: 12,
    week: 52,
    day: 260, // приблизна кількість робочих днів
    hour: 2080 // 40 год × 52 тижні
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const selectedPeriod = document.getElementById("period").value;

    if (isNaN(amount) || amount <= 0 || !periods[selectedPeriod]) {
      resultDiv.innerHTML = "<p>Будь ласка, введіть коректну суму та період.</p>";
      return;
    }

    const yearly = amount * (selectedPeriod === "year" ? 1 : periods[selectedPeriod]);
    const results = {
      рік: yearly,
      місяць: yearly / periods["month"],
      тиждень: yearly / periods["week"],
      день: yearly / periods["day"],
      година: yearly / periods["hour"]
    };

    let html = "<h3>Результати:</h3><ul>";
    for (const [label, value] of Object.entries(results)) {
      html += `<li><strong>за ${label}:</strong> ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} грн</li>`;
    }
    html += "</ul>";

    resultDiv.innerHTML = html;
  });
});
