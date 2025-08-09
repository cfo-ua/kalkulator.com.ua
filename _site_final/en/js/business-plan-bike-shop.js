document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bike-shop-form');
  const result = document.getElementById('bike-shop-result');

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
      const initialInventory = parseFloat(document.getElementById('initial-inventory').value);
      const renovationEquipment = parseFloat(document.getElementById('renovation-equipment').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const avgBikePrice = parseFloat(document.getElementById('avg-bike-price').value);
      const highSeasonBikes = parseFloat(document.getElementById('high-season-bikes').value);
      const lowSeasonBikes = parseFloat(document.getElementById('low-season-bikes').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const marketingOther = parseFloat(document.getElementById('marketing-other').value);
      const repairRevenue = parseFloat(document.getElementById('repair-revenue').value);
      const accessoriesRevenue = parseFloat(document.getElementById('accessories-revenue').value);

      if (avgBikePrice <= 0 || highSeasonBikes <= 0 || lowSeasonBikes <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = initialInventory + renovationEquipment + additionalCosts;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;

      // Monthly revenue calculations
      const highSeasonBikeRevenue = highSeasonBikes * avgBikePrice;
      const lowSeasonBikeRevenue = lowSeasonBikes * avgBikePrice;
      
      const highSeasonMonthlyRevenue = highSeasonBikeRevenue + repairRevenue + accessoriesRevenue;
      const lowSeasonMonthlyRevenue = lowSeasonBikeRevenue + (repairRevenue * 0.7) + (accessoriesRevenue * 0.8);
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Monthly expenses
      const totalMonthlyExpenses = rent + staffCosts + utilities + marketingOther;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Cost of goods sold (assume 60% of bike revenue, 50% of accessories)
      const highSeasonCOGS = (highSeasonBikeRevenue * 0.6) + (accessoriesRevenue * 0.5);
      const lowSeasonCOGS = (lowSeasonBikeRevenue * 0.6) + (accessoriesRevenue * 0.8 * 0.5);
      const annualCOGS = (highSeasonCOGS * highSeasonMonths) + (lowSeasonCOGS * lowSeasonMonths);
      
      // Profit calculations
      const grossProfit = totalAnnualRevenue - annualCOGS;
      const annualNetProfit = grossProfit - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalAnnualRevenue) * 100;
      const grossMargin = (grossProfit / totalAnnualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerSqft = totalAnnualRevenue / shopArea;
      const avgBikesPerMonth = ((highSeasonBikes * highSeasonMonths) + (lowSeasonBikes * lowSeasonMonths)) / 12;
      const inventoryTurnover = (annualCOGS / initialInventory);

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 20) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      let turnoverType = 'info';
      if (inventoryTurnover < 2) turnoverType = 'warning';
      else if (inventoryTurnover > 4) turnoverType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🚴 Bike Shop Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🔄 Inventory Turnover', `${inventoryTurnover.toFixed(1)} times/year`, 'Stock efficiency', turnoverType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Initial inventory investment</span>
                  <span>${formatNumber(initialInventory)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Renovation & equipment</span>
                  <span>${formatNumber(renovationEquipment)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licensing, marketing & other</span>
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
                  <span>Peak season (${highSeasonMonths} months) - bike sales</span>
                  <span>${formatNumber(highSeasonBikeRevenue * highSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Low season (${lowSeasonMonths} months) - bike sales</span>
                  <span>${formatNumber(lowSeasonBikeRevenue * lowSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Repair & service revenue</span>
                  <span>${formatNumber((repairRevenue * highSeasonMonths) + (repairRevenue * 0.7 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row">
                  <span>Accessories & parts</span>
                  <span>${formatNumber((accessoriesRevenue * highSeasonMonths) + (accessoriesRevenue * 0.8 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Annual Revenue</strong></span>
                  <span><strong>${formatNumber(totalAnnualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Annual Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Cost of goods sold (COGS)</span>
                  <span>${formatNumber(annualCOGS)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Store rent</span>
                  <span>${formatNumber(rent * 12)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Staff salaries</span>
                  <span>${formatNumber(staffCosts * 12)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities</span>
                  <span>${formatNumber(utilities * 12)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & other expenses</span>
                  <span>${formatNumber(marketingOther * 12)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Annual Expenses</strong></span>
                  <span><strong>${formatNumber(annualCOGS + annualExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🏪 Store Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per sq ft: <strong>${formatNumber(revenuePerSqft)}/year</strong><br>
                Bikes per month: <strong>${avgBikesPerMonth.toFixed(1)} units</strong><br>
                Gross margin: <strong>${formatPercent(grossMargin)}</strong>
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
              <h6>💡 Optimization Potential</h6>
              <div class="metric-subtitle">
                Gross profit: <strong>${formatNumber(grossProfit)}</strong><br>
                Operating expenses: <strong>${formatNumber(annualExpenses)}</strong><br>
                Cost reduction opportunity: <strong>${formatPercent((annualExpenses / totalAnnualRevenue) * 100)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 15 ? '<li>⚠️ Low profitability. Consider increasing prices or reducing costs.</li>' : ''}
              ${inventoryTurnover < 2 ? '<li>📦 Low inventory turnover. Improve product mix or reduce stock levels.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Long payback period. Optimize startup costs or increase sales.</li>' : ''}
              ${inventoryTurnover > 5 ? '<li>✅ High turnover! Consider expanding inventory or store size.</li>' : ''}
              ${profitMargin > 25 ? '<li>🎉 Excellent profitability! Consider opening additional location.</li>' : ''}
              <li>🔧 Develop service offerings for stable revenue stream.</li>
              <li>🛒 Add online sales to expand customer base.</li>
              <li>🎯 Focus on high-margin accessories and services.</li>
              <li>🤝 Partner with cycling clubs and sports organizations.</li>
              <li>📱 Use social media to attract customers and build community.</li>
              <li>⭐ Implement loyalty programs for repeat customers.</li>
              <li>🎪 Organize cycling events and new model test rides.</li>
              <li>❄️ Develop winter inventory: skis, snowboards, winter service.</li>
              <li>🚴 Offer bike fitting and customization services.</li>
              <li>📊 Use data analytics to optimize inventory management.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.bikeShopBusinessData = {
        'Store Size (sq ft)': shopArea,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalAnnualRevenue,
        'Annual Expenses ($)': annualCOGS + annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Inventory Turnover': inventoryTurnover,
        'Revenue per sq ft ($)': revenuePerSqft,
        'Average Bike Price ($)': avgBikePrice
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.bikeShopBusinessData) return;
    
    const csv = Object.entries(window.bikeShopBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bike-shop-business-plan.csv';
    link.click();
  };
});