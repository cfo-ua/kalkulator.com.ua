document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('barbershop-form');
  const result = document.getElementById('barbershop-result');

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
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const avgHaircutPrice = parseFloat(document.getElementById('avg-haircut-price').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const barberCommission = parseFloat(document.getElementById('barber-commission').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (workstations <= 0 || avgHaircutPrice <= 0 || clientsPerDay <= 0 || workingDays <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = renovationCost + equipmentCost + workingCapital;

      // Revenue calculations
      const totalClientsPerDay = workstations * clientsPerDay;
      const dailyRevenue = totalClientsPerDay * avgHaircutPrice;
      const weeklyRevenue = dailyRevenue * workingDays;
      const monthlyRevenue = weeklyRevenue * 4.33; // Average weeks per month
      const annualRevenue = monthlyRevenue * 12;

      // Barber commission costs
      const monthlyBarberCommissions = (monthlyRevenue * barberCommission) / 100;
      const netMonthlyRevenue = monthlyRevenue - monthlyBarberCommissions;

      // Additional services revenue (estimated 15% uplift)
      const additionalServicesRevenue = monthlyRevenue * 0.15;
      const totalMonthlyRevenueWithExtras = monthlyRevenue + additionalServicesRevenue;
      const totalAnnualRevenueWithExtras = totalMonthlyRevenueWithExtras * 12;

      // Monthly expenses
      const totalFixedExpenses = monthlyRent + utilities + supplies + otherExpenses;
      const totalMonthlyExpenses = totalFixedExpenses + monthlyBarberCommissions;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenueWithExtras - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (annualNetProfit / totalAnnualRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerWorkstation = totalAnnualRevenueWithExtras / workstations;
      const clientsPerMonth = totalClientsPerDay * workingDays * 4.33;
      const avgRevenuePerClient = totalMonthlyRevenueWithExtras / clientsPerMonth;
      const utilisationRate = (clientsPerDay / 25) * 100; // Assuming max 25 clients per day per station

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let utilisationType = 'info';
      if (utilisationRate < 60) utilisationType = 'warning';
      else if (utilisationRate > 80) utilisationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>✂️ Barbershop Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 1.5 ? 'success' : 'warning')}
            ${createInsightCard('📊 Utilization Rate', formatPercent(utilisationRate), `${Math.round(clientsPerMonth)} clients/month`, utilisationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Renovation & design</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment & furniture</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licenses & working capital</span>
                  <span>${formatNumber(workingCapital)}</span>
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
                  <span>Core services (${Math.round(clientsPerMonth)} clients × ${formatNumber(avgHaircutPrice)})</span>
                  <span>${formatNumber(monthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services (beard, products)</span>
                  <span>${formatNumber(additionalServicesRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Monthly Revenue</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenueWithExtras)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Barber commissions (${formatPercent(barberCommission)})</span>
                  <span>${formatNumber(monthlyBarberCommissions)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Rent</span>
                  <span>${formatNumber(monthlyRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Supplies & products</span>
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
              <h6>🔄 Operational Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per station: <strong>${formatNumber(revenuePerWorkstation)}/year</strong><br>
                Daily clients: <strong>${totalClientsPerDay} (${clientsPerDay}/station)</strong><br>
                Average ticket: <strong>${formatNumber(avgRevenuePerClient)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Service Analysis</h6>
              <div class="metric-subtitle">
                Working days: <strong>${workingDays}/week</strong><br>
                Haircut price: <strong>${formatNumber(avgHaircutPrice)}</strong><br>
                Barber commission: <strong>${formatPercent(barberCommission)}</strong>
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
                +2 clients/day impact: <strong>+${formatNumber((2 * workstations * avgHaircutPrice * workingDays * 4.33 * 12) * (1 - barberCommission/100))}/year</strong><br>
                +$2 price increase: <strong>+${formatNumber((2 * clientsPerMonth * 12) * (1 - barberCommission/100))}/year</strong><br>
                +1 workstation: <strong>+${formatNumber(revenuePerWorkstation * (1 - barberCommission/100) - (monthlyRent * 12 / workstations))}/year</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Low profitability. Consider increasing prices or reducing barber commission rates.</li>' : ''}
              ${utilisationRate < 60 ? '<li>📍 Low utilization. Improve marketing or consider location change.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Long payback period. Optimize startup costs or increase client traffic.</li>' : ''}
              ${utilisationRate > 85 ? '<li>✅ High utilization! Consider price increases or expansion.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Excellent profitability! Consider opening additional locations.</li>' : ''}
              <li>💼 Implement online booking system for client convenience.</li>
              <li>📱 Develop strong social media presence showcasing barber work.</li>
              <li>🎯 Add beard care services and men's grooming product sales.</li>
              <li>🤝 Create loyalty programs for regular customers.</li>
              <li>📈 Optimize working hours based on peak visitation times.</li>
              <li>⭐ Invest in barber training for new techniques and trends.</li>
              <li>🎪 Consider themed promotions and seasonal offers.</li>
              <li>🚗 Ensure convenient parking for customers.</li>
              <li>💎 Create premium service area with additional offerings.</li>
              <li>🌐 Implement customer feedback systems for continuous improvement.</li>
              <li>💳 Offer membership packages and subscription services.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.barbershopBusinessData = {
        'Number of Workstations': workstations,
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalMonthlyRevenueWithExtras,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Clients per Month': clientsPerMonth,
        'Utilization Rate (%)': utilisationRate,
        'Haircut Price ($)': avgHaircutPrice,
        'Revenue per Station ($)': revenuePerWorkstation
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.barbershopBusinessData) return;
    
    const csv = Object.entries(window.barbershopBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'barbershop-business-plan.csv';
    link.click();
  };
});