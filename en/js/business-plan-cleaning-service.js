document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('cleaning-form');
  const result = document.getElementById('cleaning-result');

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

      const initialStaff = parseInt(document.getElementById('initial-staff').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const vehicleCost = parseFloat(document.getElementById('vehicle-cost').value);
      const suppliesCost = parseFloat(document.getElementById('supplies-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const regularClients = parseInt(document.getElementById('regular-clients').value);
      const hourlyRate = parseFloat(document.getElementById('hourly-rate').value);
      const hoursPerClient = parseFloat(document.getElementById('hours-per-client').value);
      const serviceFrequency = parseInt(document.getElementById('service-frequency').value);
      const oneTimeJobs = parseInt(document.getElementById('one-time-jobs').value);
      const staffWages = parseFloat(document.getElementById('staff-wages').value);
      const monthlySupplies = parseFloat(document.getElementById('monthly-supplies').value);
      const transportCosts = parseFloat(document.getElementById('transport-costs').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (regularClients <= 0 || hourlyRate <= 0 || hoursPerClient <= 0 || serviceFrequency <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + vehicleCost + suppliesCost + additionalCosts;

      // Revenue calculations
      const monthlyHoursPerClient = hoursPerClient * serviceFrequency;
      const regularClientsRevenue = regularClients * monthlyHoursPerClient * hourlyRate;
      
      // One-time jobs revenue (higher rate, typically 1.2x)
      const oneTimeRate = hourlyRate * 1.2;
      const oneTimeRevenue = oneTimeJobs * hoursPerClient * oneTimeRate;
      
      // Total monthly revenue
      const totalMonthlyRevenue = regularClientsRevenue + oneTimeRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffWages + monthlySupplies + transportCosts + marketingCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const paybackMonths = paybackYears * 12;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Cleaning business specific metrics
      const totalMonthlyHours = (regularClients * monthlyHoursPerClient) + (oneTimeJobs * hoursPerClient);
      const revenuePerHour = totalMonthlyRevenue / totalMonthlyHours;
      const hoursPerStaff = totalMonthlyHours / initialStaff;
      const revenuePerClient = regularClientsRevenue / regularClients;
      const clientAcquisitionCost = marketingCosts / (regularClients * 0.1); // 10% new clients monthly
      
      // Efficiency metrics
      const laborCostPercentage = (staffWages / totalMonthlyRevenue) * 100;
      const suppliesCostPercentage = (monthlySupplies / totalMonthlyRevenue) * 100;
      const hoursPerDay = totalMonthlyHours / 22; // 22 working days
      
      // Growth potential
      const maxCapacityHours = initialStaff * 8 * 22; // 8 hours per day, 22 days
      const capacityUtilization = (totalMonthlyHours / maxCapacityHours) * 100;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 40) roiType = 'warning';
      else if (annualROI > 80) roiType = 'success';

      let utilizationType = 'info';
      if (capacityUtilization < 50) utilizationType = 'warning';
      else if (capacityUtilization > 80) utilizationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🧹 Cleaning Service Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackMonths.toFixed(0)} months`, `ROI: ${formatPercent(annualROI)}`, paybackMonths <= 12 ? 'success' : 'warning')}
            ${createInsightCard('👥 Capacity Usage', formatPercent(capacityUtilization), `${totalMonthlyHours.toFixed(0)} hours/month`, utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Equipment & tools</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Vehicle(s)</span>
                  <span>${formatNumber(vehicleCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial supplies & chemicals</span>
                  <span>${formatNumber(suppliesCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional costs</span>
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
                  <span>Regular clients (${regularClients} × ${monthlyHoursPerClient.toFixed(1)} hours)</span>
                  <span>${formatNumber(regularClientsRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>One-time jobs (${oneTimeJobs} jobs)</span>
                  <span>${formatNumber(oneTimeRevenue)}</span>
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
                  <span>Staff wages (${initialStaff} employees)</span>
                  <span>${formatNumber(staffWages)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Supplies & chemicals</span>
                  <span>${formatNumber(monthlySupplies)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Fuel & transportation</span>
                  <span>${formatNumber(transportCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & advertising</span>
                  <span>${formatNumber(marketingCosts)}</span>
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
              <h6>⏰ Work Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per hour: <strong>${formatNumber(revenuePerHour)}</strong><br>
                Hours per employee: <strong>${hoursPerStaff.toFixed(0)}/month</strong><br>
                Working hours per day: <strong>${hoursPerDay.toFixed(1)}</strong>
              </div>
            </div>
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>👥 Client Metrics</h6>
              <div class="metric-subtitle">
                Revenue per client: <strong>${formatNumber(revenuePerClient)}/month</strong><br>
                Acquisition cost: <strong>${formatNumber(clientAcquisitionCost)}</strong><br>
                Average hourly rate: <strong>${formatNumber(hourlyRate)}</strong>
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
              <h6>📊 Cost Structure</h6>
              <div class="metric-subtitle">
                Labor costs: <strong>${formatPercent(laborCostPercentage)}</strong> of revenue<br>
                Supply costs: <strong>${formatPercent(suppliesCostPercentage)}</strong> of revenue<br>
                Maximum capacity: <strong>${maxCapacityHours} hours/month</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Low profitability. Consider increasing rates or optimizing operations.</li>' : ''}
              ${capacityUtilization < 50 ? '<li>📍 Low utilization. Intensify marketing to acquire more clients.</li>' : ''}
              ${paybackMonths > 18 ? '<li>⏰ Long payback period. Increase client count or raise prices.</li>' : ''}
              ${capacityUtilization > 85 ? '<li>✅ High utilization! Consider hiring additional staff.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Excellent profitability! Consider expanding your team.</li>' : ''}
              <li>🎯 Focus on regular clients - they provide stable recurring revenue.</li>
              <li>📱 Build website and social media presence for client acquisition.</li>
              <li>⭐ Collect reviews and testimonials to build trust and credibility.</li>
              <li>🚗 Optimize routes to reduce transportation costs and time.</li>
              <li>💰 Implement loyalty discounts for long-term clients.</li>
              <li>🧽 Invest in quality equipment to improve efficiency and results.</li>
              <li>📋 Use checklists to ensure consistent service quality.</li>
              <li>🤝 Develop partnerships with property management companies.</li>
              <li>📈 Add specialized services: window cleaning, carpet cleaning, organizing.</li>
              <li>💡 Train staff to improve quality and speed of service delivery.</li>
              <li>📞 Implement online booking system for customer convenience.</li>
              <li>🎪 Offer seasonal promotions to attract new clients during peak periods.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.cleaningBusinessData = {
        'Staff Count': initialStaff,
        'Regular Clients': regularClients,
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalMonthlyRevenue,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (months)': paybackMonths,
        'Revenue per Hour ($)': revenuePerHour,
        'Capacity Utilization (%)': capacityUtilization,
        'Working Hours per Month': totalMonthlyHours,
        'Revenue per Client ($)': revenuePerClient
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.cleaningBusinessData) return;
    
    const csv = Object.entries(window.cleaningBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cleaning-service-business-plan.csv';
    link.click();
  };
});