document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('construction-form');
  const result = document.getElementById('construction-result');

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

      const companyType = document.getElementById('company-type').value;
      const initialEmployees = parseInt(document.getElementById('initial-employees').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const officeCost = parseFloat(document.getElementById('office-cost').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const avgProjectValue = parseFloat(document.getElementById('avg-project-value').value);
      const profitMargin = parseFloat(document.getElementById('profit-margin').value);
      const highSeasonProjects = parseFloat(document.getElementById('high-season-projects').value);
      const lowSeasonProjects = parseFloat(document.getElementById('low-season-projects').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const rentCosts = parseFloat(document.getElementById('rent-costs').value);
      const transportCosts = parseFloat(document.getElementById('transport-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (initialEmployees <= 0 || avgProjectValue <= 0 || profitMargin <= 0 || highSeasonProjects <= 0 || lowSeasonProjects <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + officeCost + workingCapital;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;

      // Monthly revenue calculations
      const highSeasonMonthlyRevenue = highSeasonProjects * avgProjectValue;
      const lowSeasonMonthlyRevenue = lowSeasonProjects * avgProjectValue;
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Profit calculations based on margin
      const profitMarginDecimal = profitMargin / 100;
      const highSeasonMonthlyProfit = highSeasonMonthlyRevenue * profitMarginDecimal;
      const lowSeasonMonthlyProfit = lowSeasonMonthlyRevenue * profitMarginDecimal;
      const annualGrossProfit = totalAnnualRevenue * profitMarginDecimal;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + rentCosts + transportCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Net profit calculations
      const annualNetProfit = annualGrossProfit - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const netProfitMargin = (annualNetProfit / totalAnnualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerEmployee = totalAnnualRevenue / initialEmployees;
      const profitPerEmployee = annualNetProfit / initialEmployees;
      const avgProjectsPerMonth = ((highSeasonProjects * highSeasonMonths) + (lowSeasonProjects * lowSeasonMonths)) / 12;
      const profitPerProject = (annualGrossProfit / 12) / avgProjectsPerMonth;

      // Company type specific factors
      const companyTypeNames = {
        'small-renovation': 'Small Renovation Company',
        'residential': 'Residential Construction',
        'commercial': 'Commercial Construction',
        'general-contractor': 'General Contractor'
      };

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (netProfitMargin > 20) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      let efficiencyType = 'info';
      if (revenuePerEmployee < 50000) efficiencyType = 'warning';
      else if (revenuePerEmployee > 150000) efficiencyType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏗️ Construction Company Business Plan Analysis</h3>
          <div class="company-type-indicator">
            <span class="company-type-badge">${companyTypeNames[companyType]}</span>
          </div>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Net margin: ${formatPercent(netProfitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('👥 Revenue per Employee', formatNumber(revenuePerEmployee), 'Staff efficiency', efficiencyType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Equipment & machinery</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Office & warehouse setup</span>
                  <span>${formatNumber(officeCost)}</span>
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
              <h5>💵 Annual Revenue</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>High season (${highSeasonMonths} months × ${highSeasonProjects} projects)</span>
                  <span>${formatNumber(highSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Low season (${lowSeasonMonths} months × ${lowSeasonProjects} projects)</span>
                  <span>${formatNumber(lowSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Gross profit (${formatPercent(profitMargin)} margin)</span>
                  <span>${formatNumber(annualGrossProfit)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Total Annual Revenue</strong></span>
                  <span><strong>${formatNumber(totalAnnualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Monthly Expenses</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Staff payroll (${initialEmployees} employees)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Office & warehouse rent</span>
                  <span>${formatNumber(rentCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Transportation & equipment maintenance</span>
                  <span>${formatNumber(transportCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Other operating expenses</span>
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
              <h6>📊 Project Efficiency</h6>
              <div class="metric-subtitle">
                Average project value: <strong>${formatNumber(avgProjectValue)}</strong><br>
                Profit per project: <strong>${formatNumber(profitPerProject)}</strong><br>
                Projects per month: <strong>${avgProjectsPerMonth.toFixed(1)} units</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Seasonal Analysis</h6>
              <div class="metric-subtitle">
                High season: <strong>${formatNumber(highSeasonMonthlyRevenue)}/month</strong><br>
                Low season: <strong>${formatNumber(lowSeasonMonthlyRevenue)}/month</strong><br>
                Variance: <strong>${formatPercent(((highSeasonMonthlyRevenue - lowSeasonMonthlyRevenue) / lowSeasonMonthlyRevenue) * 100)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Profitability Forecast</h6>
              <div class="metric-subtitle">
                Annual net profit: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Weekly profit: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Profit per employee: <strong>${formatNumber(profitPerEmployee)}/year</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>🎯 Growth Potential</h6>
              <div class="metric-subtitle">
                +1 project/month: <strong>+${formatNumber(avgProjectValue * profitMarginDecimal * 12)}/year</strong><br>
                +5% margin increase: <strong>+${formatNumber(totalAnnualRevenue * 0.05)}/year</strong><br>
                50% team expansion: <strong>potential +${formatPercent(50)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${netProfitMargin < 15 ? '<li>⚠️ Low profitability. Consider increasing margins or reducing costs.</li>' : ''}
              ${revenuePerEmployee < 75000 ? '<li>📍 Low productivity. Improve work efficiency or increase pricing.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Long payback period. Optimize startup costs or increase profitability.</li>' : ''}
              ${avgProjectsPerMonth < 2 ? '<li>📈 Few projects. Intensify marketing and client acquisition.</li>' : ''}
              ${netProfitMargin > 25 ? '<li>🎉 Excellent profitability! Consider business expansion.</li>' : ''}
              <li>🏆 Specialize in profitable niches: luxury homes, commercial real estate.</li>
              <li>📊 Implement CRM system for project and client management.</li>
              <li>🤝 Develop long-term partnerships with material suppliers.</li>
              <li>⭐ Invest in reputation: project portfolio, client testimonials, certifications.</li>
              <li>💡 Adopt new technologies: BIM modeling, energy-efficient solutions.</li>
              <li>📈 Diversify services: design-build, engineering, maintenance contracts.</li>
              <li>🎯 Participate in government tenders for stable project pipeline.</li>
              <li>🏗️ Invest in modern equipment to increase productivity.</li>
              <li>📚 Continuously train staff on new technologies and standards.</li>
              <li>💰 Create reserve fund to cover seasonal fluctuations.</li>
              <li>🔄 Implement lean construction principles to reduce waste.</li>
              <li>📱 Use project management software for better coordination.</li>
              <li>🛡️ Maintain comprehensive insurance coverage for all projects.</li>
              <li>🎨 Offer design services to increase project value and margins.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.constructionBusinessData = {
        'Company Type': companyTypeNames[companyType],
        'Number of Employees': initialEmployees,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalAnnualRevenue,
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
        'Projects per Month': avgProjectsPerMonth
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.constructionBusinessData) return;
    
    const csv = Object.entries(window.constructionBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'construction-business-plan.csv';
    link.click();
  };
});