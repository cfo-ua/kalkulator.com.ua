document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('marketing-form');
  const result = document.getElementById('marketing-result');

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

      const agencyType = document.getElementById('agency-type').value;
      const initialEmployees = parseInt(document.getElementById('initial-employees').value);
      const softwareCost = parseFloat(document.getElementById('software-cost').value);
      const officeCost = parseFloat(document.getElementById('office-cost').value);
      const marketingCapital = parseFloat(document.getElementById('marketing-capital').value);
      const avgProjectValue = parseFloat(document.getElementById('avg-project-value').value);
      const profitMargin = parseFloat(document.getElementById('profit-margin').value);
      const newClientsMonth = parseFloat(document.getElementById('new-clients-month').value);
      const clientRetention = parseFloat(document.getElementById('client-retention').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const softwareMonthly = parseFloat(document.getElementById('software-monthly').value);
      const rentCosts = parseFloat(document.getElementById('rent-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (initialEmployees <= 0 || avgProjectValue <= 0 || profitMargin <= 0 || newClientsMonth <= 0 || clientRetention <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = softwareCost + officeCost + marketingCapital;

      // Client and revenue calculations
      const monthsInYear = 12;
      const newClientsPerYear = newClientsMonth * monthsInYear;
      
      // Calculate active clients over time considering retention
      const avgActiveClients = (newClientsMonth * clientRetention) / 2; // Simplified average
      const maxActiveClients = newClientsMonth * clientRetention; // Maximum when fully ramped
      
      // Monthly revenue calculations
      const monthlyRevenue = avgActiveClients * avgProjectValue / clientRetention;
      const annualRevenue = monthlyRevenue * monthsInYear;
      
      // Profit calculations based on margin
      const profitMarginDecimal = profitMargin / 100;
      const monthlyGrossProfit = monthlyRevenue * profitMarginDecimal;
      const annualGrossProfit = annualRevenue * profitMarginDecimal;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + softwareMonthly + rentCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * monthsInYear;
      
      // Net profit calculations
      const annualNetProfit = annualGrossProfit - annualExpenses;
      const monthlyNetProfit = annualNetProfit / monthsInYear;
      const netProfitMargin = (annualNetProfit / annualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerEmployee = annualRevenue / initialEmployees;
      const profitPerEmployee = annualNetProfit / initialEmployees;
      const revenuePerClient = avgProjectValue;
      const clientLifetimeValue = avgProjectValue * (clientRetention / 12);

      // Agency type specific factors
      const agencyTypeNames = {
        'smm-agency': 'Social Media Agency',
        'seo-agency': 'SEO/SEM Agency',
        'performance-agency': 'Performance Agency',
        'full-service': 'Full-Service Digital Agency'
      };

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (netProfitMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 30) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let efficiencyType = 'info';
      if (revenuePerEmployee < 60000) efficiencyType = 'warning';
      else if (revenuePerEmployee > 120000) efficiencyType = 'success';

      // Growth potential calculations
      const potentialClientsYear3 = Math.min(maxActiveClients, avgActiveClients * 2);
      const year3Revenue = (potentialClientsYear3 * avgProjectValue / clientRetention) * monthsInYear;
      const growthPotential = ((year3Revenue - annualRevenue) / annualRevenue) * 100;

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>📈 Marketing Agency Business Plan Analysis</h3>
          <div class="agency-type-indicator">
            <span class="agency-type-badge">${agencyTypeNames[agencyType]}</span>
          </div>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Net margin: ${formatPercent(netProfitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 2 ? 'success' : 'warning')}
            ${createInsightCard('👥 Active Clients', `${avgActiveClients.toFixed(0)} clients`, 'Average client base', 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Software & tools setup</span>
                  <span>${formatNumber(softwareCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Office & equipment</span>
                  <span>${formatNumber(officeCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & working capital</span>
                  <span>${formatNumber(marketingCapital)}</span>
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
                  <span>Monthly revenue (${avgActiveClients.toFixed(0)} clients)</span>
                  <span>${formatNumber(monthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Annual revenue</span>
                  <span>${formatNumber(annualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Gross profit (${formatPercent(profitMargin)} margin)</span>
                  <span>${formatNumber(annualGrossProfit)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Annual Revenue</strong></span>
                  <span><strong>${formatNumber(annualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Team payroll (${initialEmployees} employees)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Software, tools & subscriptions</span>
                  <span>${formatNumber(softwareMonthly)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Office rent</span>
                  <span>${formatNumber(rentCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & other expenses</span>
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
              <h6>📊 Client Efficiency</h6>
              <div class="metric-subtitle">
                Average project value: <strong>${formatNumber(avgProjectValue)}</strong><br>
                Client lifetime value: <strong>${formatNumber(clientLifetimeValue)}</strong><br>
                New clients/month: <strong>${newClientsMonth} clients</strong>
              </div>
            </div>
            <div class="insight-card ${revenuePerEmployee > 80000 ? 'success' : 'info'}">
              <h6>👨‍💼 Team Productivity</h6>
              <div class="metric-subtitle">
                Revenue per employee: <strong>${formatNumber(revenuePerEmployee)}/year</strong><br>
                Profit per employee: <strong>${formatNumber(profitPerEmployee)}/year</strong><br>
                Average salary: <strong>${formatNumber(staffCosts / initialEmployees)}/month</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Profitability Forecast</h6>
              <div class="metric-subtitle">
                Annual net profit: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Weekly profit: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Client retention: <strong>${clientRetention} months</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>🎯 Growth Potential</h6>
              <div class="metric-subtitle">
                3-year potential: <strong>+${formatPercent(growthPotential)}</strong><br>
                +2 clients/month: <strong>+${formatNumber(avgProjectValue * 24)}/year</strong><br>
                +10% margin increase: <strong>+${formatNumber(annualRevenue * 0.1)}/year</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${netProfitMargin < 20 ? '<li>⚠️ Low profitability. Consider increasing prices or reducing costs.</li>' : ''}
              ${revenuePerEmployee < 80000 ? '<li>📍 Low productivity. Improve team efficiency or increase pricing.</li>' : ''}
              ${paybackYears > 3 ? '<li>⏰ Long payback period. Optimize startup costs or increase client base.</li>' : ''}
              ${avgActiveClients < 10 ? '<li>📈 Few clients. Intensify marketing and sales efforts.</li>' : ''}
              ${clientRetention < 9 ? '<li>🔄 Low retention. Improve service quality and customer support.</li>' : ''}
              ${netProfitMargin > 30 ? '<li>🎉 Excellent profitability! Consider team expansion and new services.</li>' : ''}
              <li>🏆 Specialize in profitable niches: e-commerce, B2B, fintech, healthcare.</li>
              <li>📊 Implement CRM system for client and project management.</li>
              <li>🤖 Automate routine processes: reporting, social media, email campaigns.</li>
              <li>⭐ Build case studies and portfolio to attract new clients.</li>
              <li>💡 Introduce new services: marketing analytics, automation, AI tools.</li>
              <li>📈 Develop long-term retainer contracts for stable revenue.</li>
              <li>🎯 Invest in team training for new tools and technologies.</li>
              <li>🌐 Build partner network with other agencies and freelancers.</li>
              <li>📱 Develop proprietary digital products: courses, tools, consultations.</li>
              <li>💰 Implement KPI system and incentives for productivity improvement.</li>
              <li>📈 Consider white-label partnerships to expand service offerings.</li>
              <li>🎨 Invest in brand building and thought leadership content.</li>
              <li>📊 Use data analytics to demonstrate ROI to clients.</li>
              <li>🤝 Build strategic partnerships with complementary service providers.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.marketingBusinessData = {
        'Agency Type': agencyTypeNames[agencyType],
        'Number of Employees': initialEmployees,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': annualRevenue,
        'Gross Profit ($)': annualGrossProfit,
        'Annual Expenses ($)': annualExpenses,
        'Annual Net Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Gross Margin (%)': profitMargin,
        'Net Margin (%)': netProfitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Revenue per Employee ($)': revenuePerEmployee,
        'Profit per Employee ($)': profitPerEmployee,
        'Average Project Value ($)': avgProjectValue,
        'Active Clients': avgActiveClients,
        'New Clients/Month': newClientsMonth,
        'Client Retention (months)': clientRetention,
        'Client Lifetime Value ($)': clientLifetimeValue
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.marketingBusinessData) return;
    
    const csv = Object.entries(window.marketingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'marketing-agency-business-plan.csv';
    link.click();
  };
});