document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('plumbing-form');
  const result = document.getElementById('plumbing-result');

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

      const toolsCost = parseFloat(document.getElementById('tools-cost').value);
      const vehicleCost = parseFloat(document.getElementById('vehicle-cost').value);
      const licensesInsurance = parseFloat(document.getElementById('licenses-insurance').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const callsPerDay = parseFloat(document.getElementById('calls-per-day').value);
      const avgCallPrice = parseFloat(document.getElementById('avg-call-price').value);
      const materialsMarkup = parseFloat(document.getElementById('materials-markup').value);
      const fuelCosts = parseFloat(document.getElementById('fuel-costs').value);
      const materialsCost = parseFloat(document.getElementById('materials-cost').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (workingDays <= 0 || callsPerDay <= 0 || avgCallPrice <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = toolsCost + vehicleCost + licensesInsurance + workingCapital;

      // Revenue calculations
      const monthlyCallsTotal = workingDays * callsPerDay;
      const monthlyServiceRevenue = monthlyCallsTotal * avgCallPrice;
      
      // Materials revenue (with markup)
      const materialsRevenueWithMarkup = materialsCost * (1 + materialsMarkup / 100);
      const materialsProfit = materialsRevenueWithMarkup - materialsCost;
      
      const totalMonthlyRevenue = monthlyServiceRevenue + materialsRevenueWithMarkup;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = fuelCosts + materialsCost + marketingCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const grossProfit = monthlyServiceRevenue + materialsProfit; // Service + materials markup
      const monthlyNetProfit = grossProfit - (fuelCosts + marketingCosts + otherExpenses);
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerCall = avgCallPrice;
      const callsPerMonth = monthlyCallsTotal;
      const profitPerCall = monthlyNetProfit / monthlyCallsTotal;
      const dailyRevenue = totalMonthlyRevenue / workingDays;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 40) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let paybackType = 'info';
      if (paybackYears > 2) paybackType = 'warning';
      else if (paybackYears <= 1) paybackType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🔧 Plumbing & Home Repairs Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackType)}
            ${createInsightCard('🔧 Service Calls', `${monthlyCallsTotal} per month`, `${formatNumber(profitPerCall)} profit/call`, 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Professional tools & equipment</span>
                  <span>${formatNumber(toolsCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Service vehicle & equipment</span>
                  <span>${formatNumber(vehicleCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licenses & insurance</span>
                  <span>${formatNumber(licensesInsurance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Working capital</span>
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
                  <span>Service revenue (${monthlyCallsTotal} calls × ${formatNumber(avgCallPrice)})</span>
                  <span>${formatNumber(monthlyServiceRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Materials sales (${formatPercent(materialsMarkup)} markup)</span>
                  <span>${formatNumber(materialsRevenueWithMarkup)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Materials profit</span>
                  <span>${formatNumber(materialsProfit)}</span>
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
                  <span>Fuel & transportation</span>
                  <span>${formatNumber(fuelCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Materials & parts (cost basis)</span>
                  <span>${formatNumber(materialsCost)}</span>
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
              <h6>🔄 Work Efficiency</h6>
              <div class="metric-subtitle">
                Calls per day: <strong>${callsPerDay}</strong><br>
                Daily revenue: <strong>${formatNumber(dailyRevenue)}</strong><br>
                Revenue per call: <strong>${formatNumber(revenuePerCall)}</strong>
              </div>
            </div>
            <div class="insight-card ${materialsMarkup >= 100 ? 'success' : 'info'}">
              <h6>📊 Revenue Structure</h6>
              <div class="metric-subtitle">
                Service revenue: <strong>${formatPercent((monthlyServiceRevenue/totalMonthlyRevenue)*100)}</strong><br>
                Materials revenue: <strong>${formatPercent((materialsRevenueWithMarkup/totalMonthlyRevenue)*100)}</strong><br>
                Materials markup: <strong>${formatPercent(materialsMarkup)}</strong>
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
                With +2 calls/day: <strong>${formatNumber(monthlyNetProfit + (2 * workingDays * profitPerCall))}/month</strong><br>
                With assistant: <strong>${formatNumber((monthlyNetProfit * 1.8) - 2500)}/month</strong><br>
                Emergency calls (+50%): <strong>${formatNumber(monthlyNetProfit * 1.5)}/month</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Low profitability. Consider increasing rates or reducing operational costs.</li>' : ''}
              ${callsPerDay < 3 ? '<li>📍 Low call volume. Improve marketing and online presence.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Long payback period. Optimize startup costs or increase pricing.</li>' : ''}
              ${callsPerDay > 6 ? '<li>✅ High workload! Consider hiring help or increasing rates.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Excellent profitability! Scale your business and expand services.</li>' : ''}
              <li>📱 Build strong online presence: website, social media, Google My Business.</li>
              <li>🚨 Offer 24/7 emergency services for 30-50% premium pricing.</li>
              <li>🤝 Develop partnerships with property management companies.</li>
              <li>⭐ Focus on customer reviews and referral programs.</li>
              <li>🛠️ Invest in professional equipment for complex, high-value jobs.</li>
              <li>📚 Expand services: electrical, tile work, HVAC diagnostics.</li>
              <li>💳 Accept digital payments for customer convenience.</li>
              <li>📊 Track job types and focus on most profitable services.</li>
              <li>🎯 Specialize in specific areas for premium pricing opportunities.</li>
              <li>📋 Offer maintenance contracts for steady recurring revenue.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.plumbingBusinessData = {
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalMonthlyRevenue,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Monthly Service Calls': monthlyCallsTotal,
        'Average Call Price ($)': avgCallPrice,
        'Profit per Call ($)': profitPerCall,
        'Working Days': workingDays,
        'Materials Markup (%)': materialsMarkup
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.plumbingBusinessData) return;
    
    const csv = Object.entries(window.plumbingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plumbing-business-plan.csv';
    link.click();
  };
});