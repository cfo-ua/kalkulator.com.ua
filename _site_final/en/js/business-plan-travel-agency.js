document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('travel-agency-form');
  const result = document.getElementById('travel-agency-result');

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

      const licensingCosts = parseFloat(document.getElementById('licensing-costs').value);
      const officeSetup = parseFloat(document.getElementById('office-setup').value);
      const equipmentSoftware = parseFloat(document.getElementById('equipment-software').value);
      const initialMarketing = parseFloat(document.getElementById('initial-marketing').value);
      const highSeasonClients = parseFloat(document.getElementById('high-season-clients').value);
      const lowSeasonClients = parseFloat(document.getElementById('low-season-clients').value);
      const averageTransaction = parseFloat(document.getElementById('average-transaction').value);
      const commissionRate = parseFloat(document.getElementById('commission-rate').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const officeRent = parseFloat(document.getElementById('office-rent').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const monthlyMarketing = parseFloat(document.getElementById('monthly-marketing').value);
      const utilitiesOther = parseFloat(document.getElementById('utilities-other').value);
      const visaServices = parseFloat(document.getElementById('visa-services').value);
      const insuranceServices = parseFloat(document.getElementById('insurance-services').value);

      if (highSeasonClients <= 0 || lowSeasonClients <= 0 || averageTransaction <= 0 || commissionRate <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = licensingCosts + officeSetup + equipmentSoftware + initialMarketing;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;
      const commissionDecimal = commissionRate / 100;

      // Monthly revenue calculations
      const highSeasonCommissionRevenue = highSeasonClients * averageTransaction * commissionDecimal;
      const lowSeasonCommissionRevenue = lowSeasonClients * averageTransaction * commissionDecimal;
      
      const highSeasonMonthlyRevenue = highSeasonCommissionRevenue + visaServices + insuranceServices;
      const lowSeasonMonthlyRevenue = lowSeasonCommissionRevenue + (visaServices * 0.6) + (insuranceServices * 0.7);
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Monthly expenses
      const totalMonthlyExpenses = officeRent + staffSalaries + monthlyMarketing + utilitiesOther;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalAnnualRevenue - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalAnnualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const avgClientsPerMonth = ((highSeasonClients * highSeasonMonths) + (lowSeasonClients * lowSeasonMonths)) / 12;
      const revenuePerClient = totalAnnualRevenue / (avgClientsPerMonth * 12);
      const totalClientsPerYear = avgClientsPerMonth * 12;
      const totalTourValue = totalClientsPerYear * averageTransaction;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let clientsType = 'info';
      if (avgClientsPerMonth < 20) clientsType = 'warning';
      else if (avgClientsPerMonth > 40) clientsType = 'success';

      let commissionType = 'info';
      if (commissionRate < 8) commissionType = 'warning';
      else if (commissionRate > 12) commissionType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>✈️ Travel Agency Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('👥 Clients per Month', `${avgClientsPerMonth.toFixed(0)}`, 'Average volume', clientsType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Licensing & permits</span>
                  <span>${formatNumber(licensingCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Office setup & renovation</span>
                  <span>${formatNumber(officeSetup)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment & software</span>
                  <span>${formatNumber(equipmentSoftware)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial marketing & branding</span>
                  <span>${formatNumber(initialMarketing)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Startup Investment</strong></span>
                  <span><strong>${formatNumber(totalStartupCost)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💵 Annual Revenue</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Peak season (${highSeasonMonths} months) - commissions</span>
                  <span>${formatNumber(highSeasonCommissionRevenue * highSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Low season (${lowSeasonMonths} months) - commissions</span>
                  <span>${formatNumber(lowSeasonCommissionRevenue * lowSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Visa services</span>
                  <span>${formatNumber((visaServices * highSeasonMonths) + (visaServices * 0.6 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row">
                  <span>Insurance services</span>
                  <span>${formatNumber((insuranceServices * highSeasonMonths) + (insuranceServices * 0.7 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Annual Revenue</strong></span>
                  <span><strong>${formatNumber(totalAnnualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Office rent</span>
                  <span>${formatNumber(officeRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Staff salaries</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & advertising</span>
                  <span>${formatNumber(monthlyMarketing)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities & other expenses</span>
                  <span>${formatNumber(utilitiesOther)}</span>
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
              <h6>💼 Sales Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per client: <strong>${formatNumber(revenuePerClient)}</strong><br>
                Average transaction: <strong>${formatNumber(averageTransaction)}</strong><br>
                Commission rate: <strong>${formatPercent(commissionRate)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Seasonal Analysis</h6>
              <div class="metric-subtitle">
                Peak season: <strong>${formatNumber(highSeasonMonthlyRevenue)}/month</strong><br>
                Low season: <strong>${formatNumber(lowSeasonMonthlyRevenue)}/month</strong><br>
                Seasonal variance: <strong>${formatPercent(((highSeasonMonthlyRevenue - lowSeasonMonthlyRevenue) / lowSeasonMonthlyRevenue) * 100)}</strong>
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
                Clients per year: <strong>${totalClientsPerYear.toFixed(0)}</strong><br>
                Total tour value: <strong>${formatNumber(totalTourValue)}</strong><br>
                Growth potential: <strong>+50% clients = +${formatNumber(totalAnnualRevenue * 0.5)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Low profitability. Consider increasing commission rates or reducing costs.</li>' : ''}
              ${avgClientsPerMonth < 25 ? '<li>👥 Low client volume. Improve marketing and develop online presence.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Long payback period. Optimize startup costs or increase sales.</li>' : ''}
              ${commissionRate < 9 ? '<li>💰 Low commission rates. Negotiate with suppliers or change specialization.</li>' : ''}
              ${avgClientsPerMonth > 50 ? '<li>✅ High client activity! Consider expanding your team.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Excellent profitability! Consider opening additional location.</li>' : ''}
              <li>🌐 Develop online sales channels to reduce office overhead costs.</li>
              <li>📱 Implement CRM system for customer relationship management.</li>
              <li>🎯 Specialize in high-margin destinations (luxury, corporate travel).</li>
              <li>🤝 Develop partnerships with hotels and airlines for better rates.</li>
              <li>📈 Launch loyalty programs for repeat customers.</li>
              <li>⭐ Actively use social media to attract new clients.</li>
              <li>🏆 Get certified as destination specialist for popular locations.</li>
              <li>💳 Implement flexible payment plans and financing options.</li>
              <li>🎪 Organize travel seminars and destination presentations.</li>
              <li>📧 Develop email marketing campaigns for seasonal promotions.</li>
              <li>🔄 Create subscription-based travel planning services.</li>
              <li>🌍 Expand into niche markets: eco-tourism, adventure travel, wellness.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.travelAgencyBusinessData = {
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalAnnualRevenue,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Clients per Month': avgClientsPerMonth,
        'Revenue per Client ($)': revenuePerClient,
        'Average Transaction ($)': averageTransaction,
        'Commission Rate (%)': commissionRate
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.travelAgencyBusinessData) return;
    
    const csv = Object.entries(window.travelAgencyBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'travel-agency-business-plan.csv';
    link.click();
  };
});