document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('vending-form');
  const result = document.getElementById('vending-result');

  function formatNumber(value) {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    } else {
      return value.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      });
    }
  }

  function formatPercent(value) {
    return `${value.toFixed(1)}%`;
  }

  function createInsightCard(title, value, subtitle, type = 'info') {
    return `
      <div class="insight-card ${type}">
        <h6>${title}</h6>
        <div class="metric-value">${value}</div>
        <div class="metric-subtitle">${subtitle}</div>
      </div>
    `;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const machines = parseInt(document.getElementById('machines').value);
      const machineCost = parseFloat(document.getElementById('machine-cost').value);
      const installationCost = parseFloat(document.getElementById('installation-cost').value);
      const initialStock = parseFloat(document.getElementById('initial-stock').value);
      const permits = parseFloat(document.getElementById('permits').value);
      const dailySales = parseFloat(document.getElementById('daily-sales').value);
      const avgPrice = parseFloat(document.getElementById('avg-price').value);
      const costPercentage = parseFloat(document.getElementById('cost-percentage').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const locationRent = parseFloat(document.getElementById('location-rent').value);
      const maintenance = parseFloat(document.getElementById('maintenance').value);
      const transport = parseFloat(document.getElementById('transport').value);
      const otherCosts = parseFloat(document.getElementById('other-costs').value);

      if (machines <= 0 || dailySales <= 0 || avgPrice <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = machines * (machineCost + installationCost + initialStock) + permits;

      // Revenue calculations
      const dailyRevenuePerMachine = dailySales * avgPrice;
      const monthlyRevenuePerMachine = dailyRevenuePerMachine * workingDays;
      const totalMonthlyRevenue = monthlyRevenuePerMachine * machines;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Cost of goods sold
      const costPercentageDecimal = costPercentage / 100;
      const monthlyCOGS = totalMonthlyRevenue * costPercentageDecimal;
      const grossProfit = totalMonthlyRevenue - monthlyCOGS;

      // Operating expenses
      const monthlyLocationRent = locationRent * machines;
      const monthlyMaintenance = maintenance * machines;
      const totalMonthlyExpenses = monthlyLocationRent + monthlyMaintenance + transport + otherCosts;
      const annualExpenses = (monthlyCOGS + totalMonthlyExpenses) * 12;
      
      // Profit calculations
      const monthlyNetProfit = grossProfit - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const grossMargin = (grossProfit / totalMonthlyRevenue) * 100;
      const netMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerMachine = monthlyRevenuePerMachine;
      const profitPerMachine = monthlyNetProfit / machines;
      const salesEfficiency = dailySales; // sales per machine per day
      const avgTransactionValue = avgPrice;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (netMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      let paybackType = 'info';
      if (paybackYears > 3) paybackType = 'warning';
      else if (paybackYears <= 2) paybackType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏪 Vending Machine Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), `${machines} machines`, 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(netMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackType)}
            ${createInsightCard('🏪 Profit per Machine', formatNumber(profitPerMachine), 'Per month', profitabilityType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Equipment (${machines} machines × ${formatNumber(machineCost)})</span>
                  <span>${formatNumber(machines * machineCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Installation & setup</span>
                  <span>${formatNumber(machines * installationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial inventory</span>
                  <span>${formatNumber(machines * initialStock)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Permits & licenses</span>
                  <span>${formatNumber(permits)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Startup Investment</strong></span>
                  <span><strong>${formatNumber(totalStartupCost)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💵 Monthly Revenue</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Daily sales (${dailySales} × ${formatNumber(avgPrice)})</span>
                  <span>${formatNumber(dailyRevenuePerMachine)}/machine</span>
                </div>
                <div class="breakdown-row">
                  <span>Monthly revenue (${workingDays} days)</span>
                  <span>${formatNumber(monthlyRevenuePerMachine)}/machine</span>
                </div>
                <div class="breakdown-row">
                  <span>Gross revenue (${machines} machines)</span>
                  <span>${formatNumber(totalMonthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Cost of goods sold (${formatPercent(costPercentage)})</span>
                  <span>-${formatNumber(monthlyCOGS)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Gross Profit</strong></span>
                  <span><strong>${formatNumber(grossProfit)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Location fees (${formatNumber(locationRent)} × ${machines})</span>
                  <span>${formatNumber(monthlyLocationRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Maintenance & repairs</span>
                  <span>${formatNumber(monthlyMaintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Transportation & restocking</span>
                  <span>${formatNumber(transport)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Other operating expenses</span>
                  <span>${formatNumber(otherCosts)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Operating Expenses</strong></span>
                  <span><strong>${formatNumber(totalMonthlyExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔄 Sales Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per machine: <strong>${formatNumber(revenuePerMachine)}/month</strong><br>
                Daily sales volume: <strong>${dailySales} units</strong><br>
                Average transaction: <strong>${formatNumber(avgTransactionValue)}</strong>
              </div>
            </div>
            <div class="insight-card ${grossMargin > 40 ? 'success' : 'info'}">
              <h6>📊 Profitability Metrics</h6>
              <div class="metric-subtitle">
                Gross margin: <strong>${formatPercent(grossMargin)}</strong><br>
                Net margin: <strong>${formatPercent(netMargin)}</strong><br>
                Product cost: <strong>${formatPercent(costPercentage)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Profitability Forecast</h6>
              <div class="metric-subtitle">
                Annual profit: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Weekly profit: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Daily profit: <strong>${formatNumber(annualNetProfit / 365)}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>💡 Scaling Potential</h6>
              <div class="metric-subtitle">
                Profit per machine: <strong>${formatNumber(profitPerMachine)}/month</strong><br>
                With 10 machines: <strong>${formatNumber(profitPerMachine * 10)}/month</strong><br>
                Potential ROI: <strong>${formatPercent(annualROI)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${netMargin < 15 ? '<li>⚠️ Low profitability. Consider raising prices or reducing product costs.</li>' : ''}
              ${dailySales < 30 ? '<li>📍 Low sales volume. Improve locations or expand product variety.</li>' : ''}
              ${paybackYears > 3 ? '<li>⏰ Long payback period. Optimize startup costs or increase sales.</li>' : ''}
              ${dailySales > 70 ? '<li>✅ High sales volume! Consider installing additional machines.</li>' : ''}
              ${netMargin > 25 ? '<li>🎉 Excellent profitability! Scale your business more aggressively.</li>' : ''}
              <li>🏢 Target high-traffic locations: offices, schools, hospitals for stable revenue.</li>
              <li>💳 Implement cashless payments to increase sales by 20-30%.</li>
              <li>📊 Analyze sales data to optimize product mix and pricing.</li>
              <li>🤝 Negotiate long-term placement contracts for location stability.</li>
              <li>🛠️ Maintain regular service schedules to minimize downtime.</li>
              <li>📈 Test different pricing strategies and product assortments.</li>
              <li>🎯 Research customer preferences specific to each location.</li>
              <li>📱 Use telemetry for remote inventory monitoring and route optimization.</li>
              <li>🌟 Focus on popular, high-margin products for maximum profitability.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.vendingBusinessData = {
        'Number of Machines': machines,
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalMonthlyRevenue,
        'Monthly Expenses ($)': totalMonthlyExpenses + monthlyCOGS,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Gross Margin (%)': grossMargin,
        'Net Margin (%)': netMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Daily Sales (units)': dailySales,
        'Average Product Price ($)': avgPrice,
        'Profit per Machine ($)': profitPerMachine
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.vendingBusinessData) return;
    
    const csv = Object.entries(window.vendingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vending-business-plan.csv';
    link.click();
  };
});