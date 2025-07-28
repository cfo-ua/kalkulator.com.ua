document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bnb-form');
  const result = document.getElementById('bnb-result');

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

      const rooms = parseInt(document.getElementById('rooms').value);
      const propertyCost = parseFloat(document.getElementById('property-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const avgNightlyRate = parseFloat(document.getElementById('avg-nightly-rate').value);
      const highSeasonOccupancy = parseFloat(document.getElementById('high-season-occupancy').value);
      const lowSeasonOccupancy = parseFloat(document.getElementById('low-season-occupancy').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const marketing = parseFloat(document.getElementById('marketing').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (rooms <= 0 || avgNightlyRate <= 0 || highSeasonOccupancy <= 0 || lowSeasonOccupancy <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = propertyCost + renovationCost + additionalCosts;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;
      const highSeasonOccupancyRate = highSeasonOccupancy / 100;
      const lowSeasonOccupancyRate = lowSeasonOccupancy / 100;

      // Monthly revenue calculations
      const daysInMonth = 30;
      const highSeasonRoomNights = rooms * daysInMonth * highSeasonOccupancyRate;
      const lowSeasonRoomNights = rooms * daysInMonth * lowSeasonOccupancyRate;
      
      const highSeasonMonthlyRevenue = highSeasonRoomNights * avgNightlyRate;
      const lowSeasonMonthlyRevenue = lowSeasonRoomNights * avgNightlyRate;
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Additional revenue streams (estimated)
      const additionalRevenue = totalAnnualRevenue * 0.12; // 12% from breakfast, services
      const totalRevenueWithExtras = totalAnnualRevenue + additionalRevenue;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + utilities + marketing + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerRoom = totalRevenueWithExtras / rooms;
      const avgOccupancyRate = ((highSeasonOccupancyRate * highSeasonMonths) + (lowSeasonOccupancyRate * lowSeasonMonths)) / 12;
      const maxPotentialRevenue = rooms * daysInMonth * 12 * avgNightlyRate;
      const revenueEfficiency = (totalAnnualRevenue / maxPotentialRevenue) * 100;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 15) roiType = 'warning';
      else if (annualROI > 25) roiType = 'success';

      let occupancyType = 'info';
      if (avgOccupancyRate < 0.5) occupancyType = 'warning';
      else if (avgOccupancyRate > 0.7) occupancyType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏨 Bed & Breakfast Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 5 ? 'success' : 'warning')}
            ${createInsightCard('🛏️ Occupancy Rate', formatPercent(avgOccupancyRate * 100), 'Annual average', occupancyType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Property (purchase/down payment)</span>
                  <span>${formatNumber(propertyCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Renovation & furnishing</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licenses, permits & equipment</span>
                  <span>${formatNumber(additionalCosts)}</span>
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
                  <span>High season (${highSeasonMonths} months × ${formatPercent(highSeasonOccupancy)})</span>
                  <span>${formatNumber(highSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Low season (${lowSeasonMonths} months × ${formatPercent(lowSeasonOccupancy)})</span>
                  <span>${formatNumber(lowSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services (breakfast, transfers)</span>
                  <span>${formatNumber(additionalRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Annual Revenue</strong></span>
                  <span><strong>${formatNumber(totalRevenueWithExtras)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Staff (housekeeping, front desk)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities (electric, water, internet)</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & platform commissions</span>
                  <span>${formatNumber(marketing)}</span>
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
              <h6>🔄 Room Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per room: <strong>${formatNumber(revenuePerRoom)}/year</strong><br>
                Average nightly rate: <strong>${formatNumber(avgNightlyRate)}/night</strong><br>
                Revenue efficiency: <strong>${formatPercent(revenueEfficiency)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Seasonal Analysis</h6>
              <div class="metric-subtitle">
                High season: <strong>${formatNumber(highSeasonMonthlyRevenue)}/month</strong><br>
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
              <h6>💡 Growth Potential</h6>
              <div class="metric-subtitle">
                Maximum revenue: <strong>${formatNumber(maxPotentialRevenue)}/year</strong><br>
                Growth reserve: <strong>${formatPercent(100 - revenueEfficiency)}</strong><br>
                At 100% occupancy: <strong>+${formatNumber(maxPotentialRevenue - totalAnnualRevenue)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Low profitability. Consider increasing rates or reducing costs.</li>' : ''}
              ${avgOccupancyRate < 0.5 ? '<li>📍 Low occupancy. Improve marketing or adjust pricing strategy.</li>' : ''}
              ${paybackYears > 6 ? '<li>⏰ Long payback period. Optimize startup costs or increase revenue.</li>' : ''}
              ${avgOccupancyRate > 0.8 ? '<li>✅ High occupancy! Consider rate increases or expansion.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Excellent profitability! Consider additional properties.</li>' : ''}
              <li>🍳 Add breakfast and meal services to increase revenue by 15-25%.</li>
              <li>📱 Optimize presence on Booking.com, AirBnB, and own website.</li>
              <li>🎯 Implement dynamic pricing based on seasonality and demand.</li>
              <li>🚗 Consider additional services: transfers, tours, laundry.</li>
              <li>🤝 Partner with tour operators and corporate clients.</li>
              <li>⭐ Invest in guest review improvement to boost online ratings.</li>
              <li>💳 Offer package deals and loyalty programs for repeat guests.</li>
              <li>🌐 Develop direct booking channels to avoid platform commissions.</li>
              <li>🎪 Host events and workshops during low season to increase occupancy.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.bnbBusinessData = {
        'Number of Rooms': rooms,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalRevenueWithExtras,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Average Occupancy (%)': avgOccupancyRate * 100,
        'Revenue per Room ($)': revenuePerRoom,
        'Average Nightly Rate ($)': avgNightlyRate
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.bnbBusinessData) return;
    
    const csv = Object.entries(window.bnbBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bnb-business-plan.csv';
    link.click();
  };
});