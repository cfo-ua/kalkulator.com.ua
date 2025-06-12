// assets/js/business-profit.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("business-profit-form");
  const result = document.getElementById("business-profit-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const targetProfit = parseFloat(document.getElementById("target-profit").value);
      const margin = parseFloat(document.getElementById("business-margin").value);

      if (targetProfit <= 0 || margin <= 0 || margin >= 100) {
        result.textContent = "Будь ласка, введіть коректні значення: прибуток > 0, маржа в межах 0–100%.";
        return;
      }

      // Calculate required revenue
      const monthlyRevenue = targetProfit / (margin / 100);

      // Profit is same as input, revenue derived
      const annualRevenue = monthlyRevenue * 12;
      const weeklyRevenue = monthlyRevenue / 4.345; // average weeks in month
      const dailyRevenue = monthlyRevenue / 30.437; // average days in month

      const annualProfit = targetProfit * 12;
      const weeklyProfit = targetProfit / 4.345;
      const dailyProfit = targetProfit / 30.437;

      result.innerHTML = `
        <h3>Необхідні обсяги продажів:</h3>
        <ul>
          <li><b>Місячний виторг:</b> ${monthlyRevenue.toFixed(2)} грн</li>
          <li><b>Річний виторг:</b> ${annualRevenue.toFixed(2)} грн</li>
          <li><b>Тижневий виторг:</b> ${weeklyRevenue.toFixed(2)} грн</li>
          <li><b>Денний виторг:</b> ${dailyRevenue.toFixed(2)} грн</li>
        </ul>
        <h3>Відповідний прибуток:</h3>
        <ul>
          <li><b>Місячний прибуток:</b> ${targetProfit.toFixed(2)} грн</li>
          <li><b>Річний прибуток:</b> ${annualProfit.toFixed(2)} грн</li>
          <li><b>Тижневий прибуток:</b> ${weeklyProfit.toFixed(2)} грн</li>
          <li><b>Денний прибуток:</b> ${dailyProfit.toFixed(2)} грн</li>
        </ul>
      `;
    });
  }
});
