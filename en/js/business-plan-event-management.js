document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('event-form');
  const result = document.getElementById('event-result');

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

      const eventManagers = parseInt(document.getElementById('event-managers').value);
      const officeSetup = parseFloat(document.getElementById('office-setup').value);
      const equipment = parseFloat(document.getElementById('equipment').value);
      const marketingWorkingCapital = parseFloat(document.getElementById('marketing-working-capital').value);
      const monthlyEvents = parseFloat(document.getElementById('monthly-events').value);
      const avgEventBudget = parseFloat(document.getElementById('avg-event-budget').value);
      const agencyMargin = parseFloat(document.getElementById('agency-margin').value);
      const managerCommission = parseFloat(document.getElementById('manager-commission').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const baseSalaries = parseFloat(document.getElementById('base-salaries').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherCosts = parseFloat(document.getElementById('other-costs').value);

      if (eventManagers <= 0 || monthlyEvents <= 0 || avgEventBudget <= 0 || agencyMargin <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = officeSetup + equipment + marketingWorkingCapital;

      // Revenue calculations
      const monthlyEventBudgets = monthlyEvents * avgEventBudget;
      const monthlyGrossMargin = (monthlyEventBudgets * agencyMargin) / 100;
      const managerCommissions = (monthlyGrossMargin * managerCommission) / 100;
      const monthlyNetMargin = monthlyGrossMargin - managerCommissions;
      
      // Annual calculations
      const annualEventBudgets = monthlyEventBudgets * 12;
      const annualGrossMargin = monthlyGrossMargin * 12;
      const annualNetMargin = monthlyNetMargin * 12;

      // Monthly expenses
      const totalFixedExpenses = monthlyRent + baseSalaries + marketingCosts + otherCosts;
      const totalMonthlyExpenses = totalFixedExpenses + managerCommissions;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = monthlyNetMargin - totalFixedExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (annualNetProfit / annualGrossMargin) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerManager = annualGrossMargin / eventManagers;
      const eventsPerManager = monthlyEvents / eventManagers;
      const avgMarginPerEvent = monthlyGrossMargin / monthlyEvents;
      const eventCapacityUtilization = (eventsPerManager / 5) * 100; // Assuming max 5 events per manager

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 30) roiType = 'warning';
      else if (annualROI > 60) roiType = 'success';

      let capacityType = 'info';
      if (eventCapacityUtilization < 60) capacityType = 'warning';
      else if (eventCapacityUtilization > 85) capacityType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🎉 Event Management Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 1 ? 'success' : 'warning')}
            ${createInsightCard('📊 Team Utilization', formatPercent(eventCapacityUtilization), `${eventsPerManager.toFixed(1)} events/manager`, capacityType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Office lease & setup</span>
                  <span>${formatNumber(officeSetup)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment (tech, furniture)</span>
                  <span>${formatNumber(equipment)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial marketing & working capital</span>
                  <span>${formatNumber(marketingWorkingCapital)}</span>
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
                  <span>Total event budgets (${monthlyEvents} × ${formatNumber(avgEventBudget)})</span>
                  <span>${formatNumber(monthlyEventBudgets)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Agency gross margin (${formatPercent(agencyMargin)})</span>
                  <span>${formatNumber(monthlyGrossMargin)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Manager commissions (${formatPercent(managerCommission)})</span>
                  <span>-${formatNumber(managerCommissions)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Net Agency Margin</strong></span>
                  <span><strong>${formatNumber(monthlyNetMargin)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Office rent</span>
                  <span>${formatNumber(monthlyRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Base staff salaries</span>
                  <span>${formatNumber(baseSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & advertising</span>
                  <span>${formatNumber(marketingCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Other expenses</span>
                  <span>${formatNumber(otherCosts)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Fixed Expenses</strong></span>
                  <span><strong>${formatNumber(totalFixedExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔄 Team Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per manager: <strong>${formatNumber(revenuePerManager)}/year</strong><br>
                Events per manager: <strong>${eventsPerManager.toFixed(1)}/month</strong><br>
                Margin per event: <strong>${formatNumber(avgMarginPerEvent)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Project Analysis</h6>
              <div class="metric-subtitle">
                Average event budget: <strong>${formatNumber(avgEventBudget)}</strong><br>
                Agency margin: <strong>${formatPercent(agencyMargin)}</strong><br>
                Manager commission: <strong>${formatPercent(managerCommission)}</strong>
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
              <h6>💡 Growth Potential</h6>
              <div class="metric-subtitle">
                +1 event/month impact: <strong>+${formatNumber(avgMarginPerEvent * 12 * (1 - managerCommission/100))}/year</strong><br>
                +$1,000 budget increase: <strong>+${formatNumber((1000 * agencyMargin / 100) * monthlyEvents * 12 * (1 - managerCommission/100))}/year</strong><br>
                +1 manager potential: <strong>+${formatNumber(revenuePerManager * (1 - managerCommission/100) - (baseSalaries * 12 / eventManagers))}/year</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Low profitability. Consider increasing margins or reducing manager commission rates.</li>' : ''}
              ${eventCapacityUtilization < 60 ? '<li>📍 Low team utilization. Improve marketing or hire fewer managers initially.</li>' : ''}
              ${paybackYears > 1.5 ? '<li>⏰ Long payback period. Optimize startup costs or increase project volume.</li>' : ''}
              ${eventCapacityUtilization > 90 ? '<li>✅ High utilization! Consider team expansion or price increases.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Excellent profitability! Consider expanding service offerings or locations.</li>' : ''}
              <li>💼 Implement CRM system for effective project and client management.</li>
              <li>📱 Develop strong online portfolio and social media presence.</li>
              <li>🎯 Specialize in profitable niches: corporate events, conferences.</li>
              <li>🤝 Build partnerships with venues, catering, and decoration vendors.</li>
              <li>📈 Implement KPI system for managers: project profitability, client satisfaction.</li>
              <li>⭐ Invest in team training for new trends and technologies.</li>
              <li>🎪 Consider additional services: decor, catering, technical support.</li>
              <li>🌐 Implement digital solutions: virtual events, participant mobile apps.</li>
              <li>💎 Create premium service packages for VIP clients.</li>
              <li>🔄 Develop vendor partnership programs for additional revenue streams.</li>
              <li>📋 Standardize processes and create service packages for efficiency.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.eventBusinessData = {
        'Number of Event Managers': eventManagers,
        'Total Investment ($)': totalStartupCost,
        'Monthly Gross Margin ($)': monthlyGrossMargin,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Monthly Events': monthlyEvents,
        'Events per Manager': eventsPerManager,
        'Agency Margin (%)': agencyMargin,
        'Average Event Budget ($)': avgEventBudget,
        'Revenue per Manager ($)': revenuePerManager
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.eventBusinessData) return;
    
    const csv = Object.entries(window.eventBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'event-management-business-plan.csv';
    link.click();
  };
});