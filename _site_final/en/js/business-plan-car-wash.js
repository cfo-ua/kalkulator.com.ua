document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('carwash-form');
  const result = document.getElementById('carwash-result');

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

      const washType = document.getElementById('wash-type').value;
      const washBays = parseInt(document.getElementById('wash-bays').value);
      const landCost = parseFloat(document.getElementById('land-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const avgServicePrice = parseFloat(document.getElementById('avg-service-price').value);
      const highSeasonCars = parseFloat(document.getElementById('high-season-cars').value);
      const lowSeasonCars = parseFloat(document.getElementById('low-season-cars').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (washBays <= 0 || avgServicePrice <= 0 || highSeasonCars <= 0 || lowSeasonCars <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = landCost + equipmentCost + additionalCosts;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;
      const daysInMonth = 30;

      // Monthly revenue calculations
      const highSeasonMonthlyRevenue = highSeasonCars * avgServicePrice * daysInMonth;
      const lowSeasonMonthlyRevenue = lowSeasonCars * avgServicePrice * daysInMonth;
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Additional revenue streams (estimated based on car wash type)
      let additionalRevenueRate = 0.08; // 8% default
      if (washType === 'manual') additionalRevenueRate = 0.15; // 15% for manual (detailing, etc.)
      if (washType === 'tunnel') additionalRevenueRate = 0.12; // 12% for tunnel (upsells)
      if (washType === 'touchless') additionalRevenueRate = 0.10; // 10% for touchless
      
      const additionalRevenue = totalAnnualRevenue * additionalRevenueRate;
      const totalRevenueWithExtras = totalAnnualRevenue + additionalRevenue;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + utilities + supplies + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerBay = totalRevenueWithExtras / washBays;
      const avgCarsPerDay = ((highSeasonCars * highSeasonMonths) + (lowSeasonCars * lowSeasonMonths)) / 12;
      const revenuePerCar = avgMonthlyRevenueWithExtras / (avgCarsPerDay * daysInMonth);
      const maxPotentialRevenue = Math.max(highSeasonCars, lowSeasonCars) * avgServicePrice * daysInMonth * 12;
      const capacityUtilization = (totalAnnualRevenue / maxPotentialRevenue) * 100;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      let utilizationType = 'info';
      if (capacityUtilization < 60) utilizationType = 'warning';
      else if (capacityUtilization > 80) utilizationType = 'success';

      // Wash type specific insights
      const washTypeNames = {
        'self-service': 'Self-Service',
        'manual': 'Manual Wash',
        'tunnel': 'Tunnel Wash',
        'touchless': 'Touchless Wash'
      };

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🚗 Car Wash Business Plan Analysis</h3>
          <div class="wash-type-indicator">
            <span class="wash-type-badge">${washTypeNames[washType]}</span>
          </div>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🎯 Capacity Utilization', formatPercent(capacityUtilization), 'Efficiency rate', utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Land/lease and site preparation</span>
                  <span>${formatNumber(landCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment and setup</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licenses, permits and connections</span>
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
                  <span>High season (${highSeasonMonths} months × ${highSeasonCars} cars/day)</span>
                  <span>${formatNumber(highSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Low season (${lowSeasonMonths} months × ${lowSeasonCars} cars/day)</span>
                  <span>${formatNumber(lowSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services (detailing, interior)</span>
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
                  <span>Staff (washers, manager)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities (water, electric)</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Supplies (soap, chemicals)</span>
                  <span>${formatNumber(supplies)}</span>
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
              <h6>🔄 Bay Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per bay: <strong>${formatNumber(revenuePerBay)}/year</strong><br>
                Average price: <strong>${formatNumber(avgServicePrice)}/car</strong><br>
                Cars per day: <strong>${avgCarsPerDay.toFixed(0)} units</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Seasonal Analysis</h6>
              <div class="metric-subtitle">
                High season: <strong>${formatNumber(highSeasonMonthlyRevenue)}/month</strong><br>
                Low season: <strong>${formatNumber(lowSeasonMonthlyRevenue)}/month</strong><br>
                Variance: <strong>${formatPercent(((highSeasonMonthlyRevenue - lowSeasonMonthlyRevenue) / lowSeasonMonthlyRevenue) * 100)}</strong>
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
                Growth reserve: <strong>${formatPercent(100 - capacityUtilization)}</strong><br>
                At full capacity: <strong>+${formatNumber(maxPotentialRevenue - totalAnnualRevenue)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Low profitability. Consider increasing prices or reducing costs.</li>' : ''}
              ${capacityUtilization < 60 ? '<li>📍 Low utilization. Improve marketing or expand services.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Long payback period. Optimize startup costs or increase revenue.</li>' : ''}
              ${capacityUtilization > 85 ? '<li>✅ High utilization! Consider price increases or expansion.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Excellent profitability! Consider additional locations.</li>' : ''}
              <li>🧽 Implement additional services: detailing, interior cleaning, waxing.</li>
              <li>📱 Launch mobile app for booking and cashless payments.</li>
              <li>🎯 Introduce loyalty programs for regular customers.</li>
              <li>⏰ Optimize operating hours based on peak demand patterns.</li>
              <li>🤝 Establish corporate contracts with taxi and logistics companies.</li>
              <li>⭐ Invest in service quality to improve customer reviews.</li>
              <li>🌱 Consider eco-friendly technologies to attract conscious customers.</li>
              <li>📊 Implement analytics system to optimize bay utilization.</li>
              <li>💳 Offer subscription plans for unlimited monthly washes.</li>
              <li>🚗 Add express service options for time-conscious customers.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.carwashBusinessData = {
        'Car Wash Type': washTypeNames[washType],
        'Number of Bays': washBays,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalRevenueWithExtras,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Capacity Utilization (%)': capacityUtilization,
        'Revenue per Bay ($)': revenuePerBay,
        'Average Service Price ($)': avgServicePrice,
        'Average Cars per Day': avgCarsPerDay
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.carwashBusinessData) return;
    
    const csv = Object.entries(window.carwashBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'car-wash-business-plan.csv';
    link.click();
  };
});