document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('business-profit-form');
  const result = document.getElementById('business-profit-result');

  function formatNumber(value) {
    if (value >= 1_000_000) {
      return `$${Math.round(value / 1_000_000)}M`;
    } else if (value >= 1_000) {
      return `$${Math.round(value / 1_000)}K`;
    } else {
      return value.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const targetMonthlyProfit = parseFloat(document.getElementById('target-profit').value);
      const marginPercent = parseFloat(document.getElementById('business-margin').value);

      if (targetMonthlyProfit <= 0 || marginPercent <= 0 || marginPercent >= 100) {
        result.textContent = "Please enter valid profit and margin values.";
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
        <h3>Required Sales Volume:</h3>
        <ul>
          <li><strong>Monthly Revenue:</strong> ${formatNumber(monthlyRevenue)}</li>
          <li><strong>Annual Revenue:</strong> ${formatNumber(yearlyRevenue)}</li>
          <li><strong>Weekly Revenue:</strong> ${formatNumber(weeklyRevenue)}</li>
          <li><strong>Daily Revenue:</strong> ${formatNumber(dailyRevenue)}</li>
        </ul>
        <h3>Corresponding Profit:</h3>
        <ul>
          <li><strong>Monthly Profit:</strong> ${formatNumber(targetMonthlyProfit)}</li>
          <li><strong>Annual Profit:</strong> ${formatNumber(yearlyProfit)}</li>
          <li><strong>Weekly Profit:</strong> ${formatNumber(weeklyProfit)}</li>
          <li><strong>Daily Profit:</strong> ${formatNumber(dailyProfit)}</li>
        </ul>
      `;
    });
  }
});