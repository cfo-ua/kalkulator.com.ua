document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('pet-grooming-form');
  const result = document.getElementById('pet-grooming-result');

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

      const workstations = parseInt(document.getElementById('workstations').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const avgServicePrice = parseFloat(document.getElementById('avg-service-price').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const insurance = parseFloat(document.getElementById('insurance').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (workstations <= 0 || clientsPerDay <= 0 || avgServicePrice <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + renovationCost + additionalCosts;

      // Monthly revenue calculations
      const monthlyClients = clientsPerDay * workingDays;
      const totalMonthlyRevenue = monthlyClients * avgServicePrice;

      // Additional revenue streams (estimated)
      const retailRevenue = totalMonthlyRevenue * 0.15; // 15% from retail products
      const totalRevenueWithRetail = totalMonthlyRevenue + retailRevenue;

      // Monthly expenses
      const totalMonthlyExpenses = monthlyRent + staffSalaries + supplies + insurance + otherExpenses;
      
      // Profit calculations
      const monthlyNetProfit = totalRevenueWithRetail - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalRevenueWithRetail) * 100;
      
      // ROI and payback calculations
      const paybackMonths = totalStartupCost / monthlyNetProfit;
      const paybackYears = paybackMonths / 12;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerStation = totalRevenueWithRetail / workstations;
      const clientsPerStation = monthlyClients / workstations;
      const avgRevenuePerClient = totalRevenueWithRetail / monthlyClients;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      // Market capacity analysis
      const maxCapacityPerDay = workstations * 4; // 4 pets per station per day max
      const utilizationRate = (clientsPerDay / maxCapacityPerDay) * 100;

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🐕 Pet Grooming Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `${paybackMonths.toFixed(0)} months`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🎯 Annual ROI', formatPercent(annualROI), 'Return on investment', roiType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Grooming equipment & tools</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Renovation & setup</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licenses, permits & initial capital</span>
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
                  <span>Grooming services (${Math.round(monthlyClients)} clients × $${avgServicePrice})</span>
                  <span>${formatNumber(totalMonthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Retail products (estimated 15%)</span>
                  <span>${formatNumber(retailRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Monthly Revenue</strong></span>
                  <span><strong>${formatNumber(totalRevenueWithRetail)}</strong></span>
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
                  <span>Staff salaries</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Supplies & materials</span>
                  <span>${formatNumber(supplies)}</span>
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
              <h6>🔄 Operational Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per station: <strong>${formatNumber(revenuePerStation)}/month</strong><br>
                Clients per station: <strong>${Math.round(clientsPerStation)}/month</strong><br>
                Average ticket: <strong>${formatNumber(avgRevenuePerClient)}</strong>
              </div>
            </div>
            <div class="insight-card ${utilizationRate > 70 ? 'success' : utilizationRate < 40 ? 'warning' : 'info'}">
              <h6>📊 Capacity Utilization</h6>
              <div class="metric-subtitle">
                Current utilization: <strong>${formatPercent(utilizationRate)}</strong><br>
                Maximum capacity: <strong>${maxCapacityPerDay} clients/day</strong><br>
                Growth potential: <strong>${formatPercent(100 - utilizationRate)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Profitability Forecast</h6>
              <div class="metric-subtitle">
                Annual profit: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Weekly profit: <strong>${formatNumber(monthlyNetProfit * 12 / 52)}</strong><br>
                Daily profit: <strong>${formatNumber(monthlyNetProfit / 30)}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>💡 Expansion Potential</h6>
              <div class="metric-subtitle">
                Additional services: <strong>+15-25% revenue</strong><br>
                Mobile grooming: <strong>+30-50% premium</strong><br>
                Corporate clients: <strong>stable income</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Low profitability. Consider increasing prices or reducing costs.</li>' : ''}
              ${utilizationRate < 40 ? '<li>📍 Low utilization. Improve marketing or add services.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Long payback period. Optimize startup costs.</li>' : ''}
              ${utilizationRate > 80 ? '<li>✅ High utilization! Consider expansion or premium pricing.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Excellent profitability! Consider additional locations.</li>' : ''}
              <li>🛍️ Add retail pet products (food, toys, accessories) for additional revenue.</li>
              <li>📱 Implement online booking and appointment reminders for better service.</li>
              <li>🎓 Invest in staff training to improve service quality and upselling.</li>
              <li>🚗 Consider mobile grooming services for premium clients.</li>
              <li>🏥 Partner with veterinary clinics for comprehensive pet care.</li>
              <li>💳 Offer package deals and membership programs for customer retention.</li>
              <li>📊 Track peak hours and adjust pricing for demand optimization.</li>
              <li>🏆 Develop specialty services (show grooming, breed-specific cuts) for higher margins.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.groomingBusinessData = {
        'Grooming Stations': workstations,
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalRevenueWithRetail,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Monthly Clients': monthlyClients,
        'Average Ticket ($)': avgRevenuePerClient,
        'Utilization Rate (%)': utilizationRate
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.groomingBusinessData) return;
    
    const csv = Object.entries(window.groomingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pet-grooming-business-plan.csv';
    link.click();
  };
});