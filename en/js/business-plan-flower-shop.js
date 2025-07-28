document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('flower-shop-form');
  const result = document.getElementById('flower-shop-result');

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

      const shopArea = parseInt(document.getElementById('shop-area').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const refrigerationCost = parseFloat(document.getElementById('refrigeration-cost').value);
      const initialInventory = parseFloat(document.getElementById('initial-inventory').value);
      const avgTicket = parseFloat(document.getElementById('avg-ticket').value);
      const dailyCustomers = parseInt(document.getElementById('daily-customers').value);
      const peakMultiplier = parseFloat(document.getElementById('peak-multiplier').value);
      const peakDays = parseInt(document.getElementById('peak-days').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const cogsPercentage = parseFloat(document.getElementById('cogs-percentage').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (shopArea <= 0 || avgTicket <= 0 || dailyCustomers <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + refrigerationCost + initialInventory;

      // Revenue calculations
      const regularDays = 30 - peakDays;
      const regularDailyRevenue = dailyCustomers * avgTicket;
      const peakDailyRevenue = dailyCustomers * peakMultiplier * avgTicket;
      
      const monthlyRegularRevenue = regularDailyRevenue * regularDays;
      const monthlyPeakRevenue = peakDailyRevenue * peakDays;
      const totalMonthlyRevenue = monthlyRegularRevenue + monthlyPeakRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Additional revenue streams (estimated)
      const additionalServices = annualRevenue * 0.08; // 8% from delivery, arrangements
      const totalRevenueWithExtras = annualRevenue + additionalServices;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Cost of goods sold
      const monthlyCoGS = (totalMonthlyRevenue * cogsPercentage) / 100;
      const annualCoGS = monthlyCoGS * 12;

      // Other monthly expenses
      const totalOtherMonthlyExpenses = rent + staffCosts + otherExpenses;
      const totalMonthlyExpenses = monthlyCoGS + totalOtherMonthlyExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerSqft = totalRevenueWithExtras / shopArea;
      const avgDailyRevenue = totalMonthlyRevenue / 30;
      const peakToRegularRatio = (peakDailyRevenue / regularDailyRevenue);

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🌸 Flower Shop Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🛍️ Average Daily Revenue', formatNumber(avgDailyRevenue), 'Per day', 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Equipment & renovation</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Refrigeration equipment</span>
                  <span>${formatNumber(refrigerationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial inventory</span>
                  <span>${formatNumber(initialInventory)}</span>
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
                  <span>Regular days (${regularDays} days × $${regularDailyRevenue.toFixed(0)})</span>
                  <span>${formatNumber(monthlyRegularRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Peak days (${peakDays} days × $${peakDailyRevenue.toFixed(0)})</span>
                  <span>${formatNumber(monthlyPeakRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services (delivery, arrangements)</span>
                  <span>${formatNumber(additionalServices / 12)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Monthly Revenue</strong></span>
                  <span><strong>${formatNumber(avgMonthlyRevenueWithExtras)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Cost of goods sold (${cogsPercentage}% of revenue)</span>
                  <span>${formatNumber(monthlyCoGS)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Rent</span>
                  <span>${formatNumber(rent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Staff (florist, sales)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities & other expenses</span>
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
              <h6>📏 Space Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per sq ft: <strong>${formatNumber(revenuePerSqft)}/year</strong><br>
                Shop area: <strong>${shopArea} sq ft</strong><br>
                Average transaction: <strong>${formatNumber(avgTicket)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Seasonal Analysis</h6>
              <div class="metric-subtitle">
                Regular day: <strong>${formatNumber(regularDailyRevenue)}</strong><br>
                Peak day: <strong>${formatNumber(peakDailyRevenue)}</strong><br>
                Peak multiplier: <strong>${peakMultiplier.toFixed(1)}x</strong>
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
              <h6>💡 Operational Metrics</h6>
              <div class="metric-subtitle">
                Daily customers: <strong>${dailyCustomers} people</strong><br>
                Peak days/month: <strong>${peakDays} days</strong><br>
                Gross margin: <strong>${formatPercent(100 - cogsPercentage)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Low profitability. Consider reducing COGS percentage or increasing prices.</li>' : ''}
              ${avgTicket < 20 ? '<li>💰 Low average transaction. Promote add-on products and premium arrangements.</li>' : ''}
              ${paybackYears > 3 ? '<li>⏰ Long payback period. Optimize startup costs or increase foot traffic.</li>' : ''}
              ${peakMultiplier < 3 ? '<li>📈 Low peak multiplier. Market more aggressively for holidays and events.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Excellent profitability! Consider opening additional locations.</li>' : ''}
              <li>🌹 Specialize in wedding floristry to increase average transaction value.</li>
              <li>📱 Develop online ordering and delivery service to expand customer base.</li>
              <li>🎨 Offer floral design workshops as additional revenue stream.</li>
              <li>🤝 Partner with wedding planners, event venues, and funeral homes.</li>
              <li>📊 Track inventory waste closely and optimize purchasing patterns.</li>
              <li>⭐ Create signature arrangements to differentiate from competitors.</li>
              <li>🎁 Add complementary products: vases, cards, small gifts, plants.</li>
              <li>📅 Plan inventory carefully for seasonal peaks and valleys.</li>
              <li>🌐 Build strong social media presence with beautiful floral photography.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.flowerShopBusinessData = {
        'Shop Area (sq ft)': shopArea,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalRevenueWithExtras,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Average Transaction ($)': avgTicket,
        'Daily Customers': dailyCustomers,
        'Revenue per sq ft ($)': revenuePerSqft
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.flowerShopBusinessData) return;
    
    const csv = Object.entries(window.flowerShopBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'flower-shop-business-plan.csv';
    link.click();
  };
});