document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("salary-period-form");
  const resultDiv = document.getElementById("salary-period-result");

  if (!form || !resultDiv) return;

  const periods = {
    year: 1,
    month: 12,
    week: 52,
    day: 260, // work days per year
    hour: 2080 // work hours per year (40*52)
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const selectedPeriod = document.getElementById("period").value;

    if (isNaN(amount) || amount <= 0 || !periods[selectedPeriod]) {
      resultDiv.innerHTML = "<p>Please enter a valid salary amount and select a period.</p>";
      return;
    }

    const yearly = amount * (selectedPeriod === "year" ? 1 : periods[selectedPeriod]);
    const results = {
      "per year": yearly,
      "per month": yearly / periods["month"],
      "per week": yearly / periods["week"],
      "per day": yearly / periods["day"],
      "per hour": yearly / periods["hour"]
    };

    const format = (num) => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let html = "<h3>Salary Conversion Results:</h3><ul>";
    for (const [label, value] of Object.entries(results)) {
      html += `<li><strong>${label}:</strong> $${format(value)}</li>`;
    }
    html += "</ul>";

    // Add some helpful context
    html += "<div class='conversion-note'>";
    html += "<p><strong>Note:</strong> Calculations are based on standard full-time work:</p>";
    html += "<ul>";
    html += "<li>260 work days per year (52 weeks × 5 days)</li>";
    html += "<li>2,080 work hours per year (52 weeks × 40 hours)</li>";
    html += "</ul>";
    html += "<p><em>Results show gross salary before taxes and deductions.</em></p>";
    html += "</div>";

    resultDiv.innerHTML = html;
  });
});