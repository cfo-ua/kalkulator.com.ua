document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('laundromat-form');
  const result = document.getElementById('laundromat-result');

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

      const washingMachines = parseInt(document.getElementById('washing-machines').value);
      const dryers = parseInt(document.getElementById('dryers').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const washPrice = parseFloat(document.getElementById('wash-price').value);
      const dryPrice = parseFloat(document.getElementById('dry-price').value);
      const utilization = parseFloat(document.getElementById('utilization').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const maintenance = parseFloat(document.getElementById('maintenance').value);
      const insurance = parseFloat(document.getElementById('insurance').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (washingMachines <= 0 || dryers <= 0 || utilization <= 0 || utilization > 100) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Equipment costs
      const avgWasherCost = 3500; // Average commercial washer cost
      const avgDryerCost = 2800; // Average commercial dryer cost
      const equipmentCost = (washingMachines * avgWasherCost) + (dryers * avgDryerCost);
      
      // Total startup investment
      const totalStartupCost = equipmentCost + renovationCost + additionalCosts;

      // Daily operations (assume 16 hours/day operation)
      const operatingHours = 16;
      const cyclesPerDay = operatingHours / 1.5; // Average 1.5 hours per cycle
      const utilizationRate = utilization / 100;
      
      // Monthly revenue calculations
      const washCyclesPerMonth = washingMachines * cyclesPerDay * 30 * utilizationRate;
      const dryCyclesPerMonth = dryers * cyclesPerDay * 30 * utilizationRate;
      const monthlyWashRevenue = washCyclesPerMonth * washPrice;
      const monthlyDryRevenue = dryCyclesPerMonth * dryPrice;
      const totalMonthlyRevenue = monthlyWashRevenue + monthlyDryRevenue;

      // Monthly expenses
      const totalMonthlyExpenses = monthlyRent + utilities + maintenance + insurance + otherExpenses;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackMonths = totalStartupCost / monthlyNetProfit;
      const paybackYears = paybackMonths / 12;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Revenue per machine metrics
      const revenuePerWasher = monthlyWashRevenue / washingMachines;
      const revenuePerDryer = monthlyDryRevenue / dryers;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 15) roiType = 'warning';
      else if (annualROI > 25) roiType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>📋 Laundromat Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `${paybackMonths.toFixed(0)} months`, paybackYears <= 4 ? 'success' : 'warning')}
            ${createInsightCard('🎯 Annual ROI', formatPercent(annualROI), 'Return on investment', roiType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Washing machines (${washingMachines} × $${avgWasherCost})</span>
                  <span>${formatNumber(washingMachines * avgWasherCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Dryers (${dryers} × $${avgDryerCost})</span>
                  <span>${formatNumber(dryers * avgDryerCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Renovation & setup</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Permits, licenses & other</span>
                  <span>${formatNumber(additionalCosts)}</span>
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
                  <span>Washing (${Math.round(washCyclesPerMonth)} cycles × $${washPrice})</span>
                  <span>${formatNumber(monthlyWashRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Drying (${Math.round(dryCyclesPerMonth)} cycles × $${dryPrice})</span>
                  <span>${formatNumber(monthlyDryRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Monthly Revenue</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Rent</span>
                  <span>${formatNumber(monthlyRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities (water, electric, gas)</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Maintenance & repairs</span>
                  <span>${formatNumber(maintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Insurance</span>
                  <span>${formatNumber(insurance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Other expenses</span>
                  <span>${formatNumber(otherExpenses)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Monthly Expenses</strong></span>
                  <span><strong>${formatNumber(totalMonthlyExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔄 Equipment Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per washer: <strong>${formatNumber(revenuePerWasher)}/month</strong><br>
                Revenue per dryer: <strong>${formatNumber(revenuePerDryer)}/month</strong><br>
                Utilization rate: <strong>${utilization}%</strong>
              </div>
            </div>
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Profitability Forecast</h6>
              <div class="metric-subtitle">
                Annual profit: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Weekly profit: <strong>${formatNumber(monthlyNetProfit * 12 / 52)}</strong><br>
                Daily profit: <strong>${formatNumber(monthlyNetProfit / 30)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Low profitability. Consider reducing costs or increasing prices.</li>' : ''}
              ${utilization < 50 ? '<li>📍 Low utilization. Improve marketing or choose better location.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Long payback period. Consider reducing startup costs.</li>' : ''}
              ${utilization > 80 ? '<li>✅ High utilization! Consider expansion or premium pricing.</li>' : ''}
              ${profitMargin > 25 ? '<li>🎉 Excellent profitability! Consider additional locations.</li>' : ''}
              <li>💡 Consider additional revenue streams: vending machines, wash-dry-fold services, WiFi advertising.</li>
              <li>🔧 Invest in quality equipment to reduce maintenance costs and downtime.</li>
              <li>📱 Add mobile payments and loyalty programs to increase customer retention and revenue.</li>
              <li>⏰ Optimize peak hour pricing to maximize revenue during busy periods.</li>
              <li>🏪 Partner with nearby businesses or apartments for corporate washing services.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.laundryBusinessData = {
        'Washing Machines': washingMachines,
        'Dryers': dryers,
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalMonthlyRevenue,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Utilization Rate (%)': utilization
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.laundryBusinessData) return;
    
    const csv = Object.entries(window.laundryBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'laundromat-business-plan.csv';
    link.click();
  };
});