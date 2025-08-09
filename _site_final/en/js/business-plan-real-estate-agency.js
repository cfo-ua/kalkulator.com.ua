document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('realestate-form');
  const result = document.getElementById('realestate-result');

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

      const agentsCount = parseInt(document.getElementById('agents-count').value);
      const officeSetup = parseFloat(document.getElementById('office-setup').value);
      const legalCosts = parseFloat(document.getElementById('legal-costs').value);
      const marketingSetup = parseFloat(document.getElementById('marketing-setup').value);
      const commissionRate = parseFloat(document.getElementById('commission-rate').value);
      const monthlyDeals = parseFloat(document.getElementById('monthly-deals').value);
      const avgPropertyPrice = parseFloat(document.getElementById('avg-property-price').value);
      const agentCommissionShare = parseFloat(document.getElementById('agent-commission-share').value);
      const officeRent = parseFloat(document.getElementById('office-rent').value);
      const baseSalaries = parseFloat(document.getElementById('base-salaries').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherCosts = parseFloat(document.getElementById('other-costs').value);

      if (agentsCount <= 0 || commissionRate <= 0 || monthlyDeals <= 0 || avgPropertyPrice <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = officeSetup + legalCosts + marketingSetup;

      // Revenue calculations
      const grossCommissionPerDeal = (avgPropertyPrice * commissionRate) / 100;
      const monthlyGrossCommission = monthlyDeals * grossCommissionPerDeal;
      const agentCommissionPayout = (monthlyGrossCommission * agentCommissionShare) / 100;
      const agencyNetCommission = monthlyGrossCommission - agentCommissionPayout;
      
      // Annual revenue
      const annualGrossCommission = monthlyGrossCommission * 12;
      const annualNetCommission = agencyNetCommission * 12;

      // Monthly expenses
      const totalMonthlyExpenses = officeRent + baseSalaries + marketingCosts + otherCosts;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = agencyNetCommission - totalMonthlyExpenses;
      const annualNetProfit = annualNetCommission - annualExpenses;
      const profitMargin = (annualNetProfit / annualNetCommission) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerAgent = annualNetCommission / agentsCount;
      const dealsPerAgent = monthlyDeals / agentsCount;
      const commissionPerDeal = grossCommissionPerDeal;
      const agencyCommissionPerDeal = grossCommissionPerDeal - (grossCommissionPerDeal * agentCommissionShare / 100);

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      let dealsType = 'info';
      if (dealsPerAgent < 2) dealsType = 'warning';
      else if (dealsPerAgent > 4) dealsType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏢 Real Estate Agency Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 1.5 ? 'success' : 'warning')}
            ${createInsightCard('📊 Deals per Agent', `${dealsPerAgent.toFixed(1)}/month`, `Total: ${monthlyDeals} deals`, dealsType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Office lease & setup</span>
                  <span>${formatNumber(officeSetup)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licenses & legal costs</span>
                  <span>${formatNumber(legalCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial marketing & equipment</span>
                  <span>${formatNumber(marketingSetup)}</span>
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
                  <span>Gross commission (${monthlyDeals} deals × ${formatNumber(commissionPerDeal)})</span>
                  <span>${formatNumber(annualGrossCommission)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Agent payouts (${formatPercent(agentCommissionShare)})</span>
                  <span>-${formatNumber(agentCommissionPayout * 12)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Net Agency Revenue</strong></span>
                  <span><strong>${formatNumber(annualNetCommission)}</strong></span>
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
                  <span>Base staff salaries</span>
                  <span>${formatNumber(baseSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & advertising</span>
                  <span>${formatNumber(marketingCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Other expenses</span>
                  <span>${formatNumber(otherCosts)}</span>
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
              <h6>🔄 Agent Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per agent: <strong>${formatNumber(revenuePerAgent)}/year</strong><br>
                Deals per agent: <strong>${dealsPerAgent.toFixed(1)}/month</strong><br>
                Agency commission per deal: <strong>${formatNumber(agencyCommissionPerDeal)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Deal Analysis</h6>
              <div class="metric-subtitle">
                Average property price: <strong>${formatNumber(avgPropertyPrice)}</strong><br>
                Agency commission rate: <strong>${formatPercent(commissionRate)}</strong><br>
                Gross commission per deal: <strong>${formatNumber(commissionPerDeal)}</strong>
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
                +1 deal/month impact: <strong>+${formatNumber(agencyCommissionPerDeal * 12)}/year</strong><br>
                +1 agent potential: <strong>+${formatNumber(revenuePerAgent - (baseSalaries * 12 / agentsCount))}/year</strong><br>
                +0.5% commission rate: <strong>+${formatNumber((avgPropertyPrice * 0.5 / 100) * monthlyDeals * 12)}/year</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Low profitability. Consider increasing commission rates or reducing agent costs.</li>' : ''}
              ${dealsPerAgent < 2 ? '<li>📍 Low agent productivity. Improve training or motivation systems.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Long payback period. Optimize startup costs or increase deal volume.</li>' : ''}
              ${dealsPerAgent > 4 ? '<li>✅ High productivity! Consider team expansion or commission increases.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Excellent profitability! Consider opening additional offices.</li>' : ''}
              <li>💼 Implement CRM system for effective client and deal management.</li>
              <li>📱 Develop online presence: website, social media, digital advertising.</li>
              <li>🎯 Specialize in profitable segments: commercial real estate, new developments.</li>
              <li>🤝 Build partnerships with developers, banks, insurance companies.</li>
              <li>📈 Implement KPI system for agents: deal count, sales volume, service quality.</li>
              <li>⭐ Invest in staff training and professional development.</li>
              <li>🎪 Consider additional services: valuation, legal support, mortgage assistance.</li>
              <li>🌐 Leverage technology: virtual tours, automated marketing, document management.</li>
              <li>💳 Develop referral programs and client retention strategies.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.realEstateBusinessData = {
        'Number of Agents': agentsCount,
        'Total Investment ($)': totalStartupCost,
        'Annual Agency Revenue ($)': annualNetCommission,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Monthly Deals': monthlyDeals,
        'Deals per Agent': dealsPerAgent,
        'Agency Commission (%)': commissionRate,
        'Revenue per Agent ($)': revenuePerAgent
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.realEstateBusinessData) return;
    
    const csv = Object.entries(window.realEstateBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'real-estate-agency-business-plan.csv';
    link.click();
  };
});