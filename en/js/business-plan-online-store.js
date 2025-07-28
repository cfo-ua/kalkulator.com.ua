document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('store-form');
  const result = document.getElementById('store-result');

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

      const websiteCost = parseFloat(document.getElementById('website-cost').value);
      const inventoryCost = parseFloat(document.getElementById('inventory-cost').value);
      const initialMarketing = parseFloat(document.getElementById('initial-marketing').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyTraffic = parseInt(document.getElementById('monthly-traffic').value);
      const conversionRate = parseFloat(document.getElementById('conversion-rate').value);
      const averageOrder = parseFloat(document.getElementById('average-order').value);
      const grossMargin = parseFloat(document.getElementById('gross-margin').value);
      const repeatRate = parseFloat(document.getElementById('repeat-rate').value);
      const marketingCost = parseFloat(document.getElementById('marketing-cost').value);
      const logisticsCost = parseFloat(document.getElementById('logistics-cost').value);
      const techMaintenance = parseFloat(document.getElementById('tech-maintenance').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (monthlyTraffic <= 0 || conversionRate <= 0 || averageOrder <= 0 || grossMargin <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = websiteCost + inventoryCost + initialMarketing + additionalCosts;

      // Sales calculations
      const conversionDecimal = conversionRate / 100;
      const monthlyOrders = monthlyTraffic * conversionDecimal;
      const monthlyRevenue = monthlyOrders * averageOrder;
      
      // Add repeat purchase revenue
      const repeatPurchaseRevenue = monthlyRevenue * (repeatRate / 100);
      const totalMonthlyRevenue = monthlyRevenue + repeatPurchaseRevenue;
      
      // Gross profit calculation
      const grossProfitMargin = grossMargin / 100;
      const monthlyGrossProfit = totalMonthlyRevenue * grossProfitMargin;
      
      // Annual calculations
      const annualRevenue = totalMonthlyRevenue * 12;
      const annualGrossProfit = monthlyGrossProfit * 12;

      // Monthly expenses
      const totalMonthlyExpenses = marketingCost + logisticsCost + techMaintenance + staffCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = monthlyGrossProfit - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const netProfitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // E-commerce specific metrics
      const customerAcquisitionCost = marketingCost / monthlyOrders;
      const customerLifetimeValue = (averageOrder * grossProfitMargin) / (1 - (repeatRate / 100));
      const ltvcacRatio = customerLifetimeValue / customerAcquisitionCost;
      const returnOnAdSpend = (monthlyGrossProfit / marketingCost) * 100;
      
      // Traffic and conversion metrics
      const costPerVisitor = marketingCost / monthlyTraffic;
      const revenuePerVisitor = totalMonthlyRevenue / monthlyTraffic;
      const ordersPerDay = monthlyOrders / 30;

      // Inventory turnover (monthly)
      const inventoryTurnover = (monthlyRevenue * (1 - grossProfitMargin)) / (inventoryCost / 12);

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (netProfitMargin > 20) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 30) roiType = 'warning';
      else if (annualROI > 60) roiType = 'success';

      let conversionType = 'info';
      if (conversionRate < 2) conversionType = 'warning';
      else if (conversionRate > 4) conversionType = 'success';

      let ltvcacType = 'info';
      if (ltvcacRatio < 3) ltvcacType = 'warning';
      else if (ltvcacRatio > 5) ltvcacType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🛒 Online Store Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(netProfitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 2 ? 'success' : 'warning')}
            ${createInsightCard('🎯 Conversion Rate', formatPercent(conversionRate), `${monthlyOrders.toFixed(0)} orders/month`, conversionType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Website development & design</span>
                  <span>${formatNumber(websiteCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial inventory</span>
                  <span>${formatNumber(inventoryCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial marketing & advertising</span>
                  <span>${formatNumber(initialMarketing)}</span>
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
                  <span>Primary sales (${monthlyOrders.toFixed(0)} orders × $${averageOrder})</span>
                  <span>${formatNumber(monthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Repeat purchases (${formatPercent(repeatRate)})</span>
                  <span>${formatNumber(repeatPurchaseRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Monthly Revenue</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenue)}</strong></span>
                </div>
                <div class="breakdown-row">
                  <span>Gross profit (${formatPercent(grossMargin)} margin)</span>
                  <span>${formatNumber(monthlyGrossProfit)}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Marketing & advertising</span>
                  <span>${formatNumber(marketingCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Fulfillment & shipping</span>
                  <span>${formatNumber(logisticsCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Technology & hosting</span>
                  <span>${formatNumber(techMaintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Staff & personnel</span>
                  <span>${formatNumber(staffCosts)}</span>
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
            <div class="insight-card ${ltvcacType}">
              <h6>👥 Customer Metrics</h6>
              <div class="metric-subtitle">
                Acquisition cost (CAC): <strong>${formatNumber(customerAcquisitionCost)}</strong><br>
                Lifetime value (LTV): <strong>${formatNumber(customerLifetimeValue)}</strong><br>
                LTV/CAC ratio: <strong>${ltvcacRatio.toFixed(1)}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>📊 Marketing Metrics</h6>
              <div class="metric-subtitle">
                ROAS: <strong>${formatPercent(returnOnAdSpend)}</strong><br>
                Cost per visitor: <strong>${formatNumber(costPerVisitor)}</strong><br>
                Revenue per visitor: <strong>${formatNumber(revenuePerVisitor)}</strong>
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
              <h6>📦 Operational Metrics</h6>
              <div class="metric-subtitle">
                Orders per day: <strong>${ordersPerDay.toFixed(1)}</strong><br>
                Inventory turnover: <strong>${inventoryTurnover.toFixed(1)}x/month</strong><br>
                Annual revenue: <strong>${formatNumber(annualRevenue)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${netProfitMargin < 10 ? '<li>⚠️ Low profitability. Consider increasing prices or reducing costs.</li>' : ''}
              ${conversionRate < 2 ? '<li>📍 Low conversion rate. Optimize website UX/UI and product pages.</li>' : ''}
              ${ltvcacRatio < 3 ? '<li>💰 High acquisition costs. Optimize advertising campaigns and targeting.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Long payback period. Increase marketing budget or improve conversion.</li>' : ''}
              ${conversionRate > 4 ? '<li>✅ Excellent conversion rate! Scale up traffic acquisition.</li>' : ''}
              ${netProfitMargin > 25 ? '<li>🎉 Outstanding profitability! Consider expanding product lines.</li>' : ''}
              <li>🎯 A/B test product pages, checkout process, and pricing strategies.</li>
              <li>📱 Optimize for mobile - 60%+ of e-commerce traffic is mobile.</li>
              <li>📧 Implement email marketing campaigns to increase repeat purchases.</li>
              <li>⭐ Collect and display customer reviews to build trust and credibility.</li>
              <li>🚚 Improve logistics: fast shipping increases conversion rates.</li>
              <li>💳 Add multiple payment options for customer convenience.</li>
              <li>🎁 Create loyalty programs to encourage repeat business.</li>
              <li>📊 Use Google Analytics and pixels to track ROI accurately.</li>
              <li>🔍 Invest in SEO to reduce dependence on paid advertising.</li>
              <li>🤝 Develop affiliate programs and influencer partnerships.</li>
              <li>💬 Add live chat support to assist customers and reduce cart abandonment.</li>
              <li>🏆 Implement upselling and cross-selling strategies to increase AOV.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.storeBusinessData = {
        'Monthly Traffic': monthlyTraffic,
        'Conversion Rate (%)': conversionRate,
        'Average Order Value ($)': averageOrder,
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalMonthlyRevenue,
        'Gross Profit ($)': monthlyGrossProfit,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Net Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': netProfitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'CAC ($)': customerAcquisitionCost,
        'LTV ($)': customerLifetimeValue,
        'LTV/CAC Ratio': ltvcacRatio,
        'ROAS (%)': returnOnAdSpend
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.storeBusinessData) return;
    
    const csv = Object.entries(window.storeBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'online-store-business-plan.csv';
    link.click();
  };
});