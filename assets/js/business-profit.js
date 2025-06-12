document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('business-profit-form');
  const result = document.getElementById('business-profit-result');

  function formatNumber(value) {
    if (value >= 1_000_000) {
      return `${Math.round(value / 1_000_000)} млн`;
    } else if (value >= 1_000) {
      return `${Math.round(value / 1_000)} тис.`;
    } else {
      return value.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const targetMonthlyProfit = parseFloat(document.getElementById('target-profit').value);
      const marginPercent = parseFloat(document.getElementById('business-margin').value);

      if (targetMonthlyProfit <= 0 || marginPercent <= 0 || marginPercent >= 100) {
        result.textContent = "Введіть коректні значення прибутку та маржі.";
        return;
      }

      const margin = marginPercent / 100;

      const monthlyRevenue = targetMonthlyProfit / margin;
      const yearlyRevenue = monthlyRevenue * 12;
      const weeklyRevenue = yearlyRevenue / 52;
      const dailyRevenue = yearlyRevenue / 365;

      const yearlyProfit = targetMonthlyProfit * 12;
      const weeklyProfit = yearlyProfit / 52;
      const dailyProfit = yearlyProfit / 365;

      result.innerHTML = `
        <h3>Необхідні обсяги продажів:</h3>
        <ul>
          <li><strong>Місячний виторг:</strong> ${formatNumber(monthlyRevenue)}</li>
          <li><strong>Річний виторг:</strong> ${formatNumber(yearlyRevenue)}</li>
          <li><strong>Тижневий виторг:</strong> ${formatNumber(weeklyRevenue)}</li>
          <li><strong>Денний виторг:</strong> ${formatNumber(dailyRevenue)}</li>
        </ul>
        <h3>Відповідний прибуток:</h3>
        <ul>
          <li><strong>Місячний прибуток:</strong> ${formatNumber(targetMonthlyProfit)}</li>
          <li><strong>Річний прибуток:</strong> ${formatNumber(yearlyProfit)}</li>
          <li><strong>Тижневий прибуток:</strong> ${formatNumber(weeklyProfit)}</li>
          <li><strong>Денний прибуток:</strong> ${formatNumber(dailyProfit)}</li>
        </ul>
      `;
    });
  }
});
