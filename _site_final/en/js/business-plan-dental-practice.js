document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('dental-practice-form');
  const result = document.getElementById('dental-practice-result');

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

      const dentalChairs = parseInt(document.getElementById('dental-chairs').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const patientsPerDay = parseInt(document.getElementById('patients-per-day').value);
      const avgVisitCost = parseFloat(document.getElementById('avg-visit-cost').value);
      const workingDays = parseInt(document.getElementById('working-days').value);
      const chairUtilization = parseFloat(document.getElementById('chair-utilization').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const materialsCost = parseFloat(document.getElementById('materials-cost').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (dentalChairs <= 0 || patientsPerDay <= 0 || avgVisitCost <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + renovationCost + workingCapital;

      // Revenue calculations
      const utilizationRate = chairUtilization / 100;
      const effectivePatientsPerDay = patientsPerDay * utilizationRate;
      const dailyRevenue = dentalChairs * effectivePatientsPerDay * avgVisitCost;
      const monthlyRevenue = dailyRevenue * workingDays;
      const annualRevenue = monthlyRevenue * 12;

      // Additional revenue streams (estimated)
      const specialtyServices = annualRevenue * 0.15; // 15% from specialty procedures
      const totalRevenueWithExtras = annualRevenue + specialtyServices;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffSalaries + materialsCost + rent + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerChair = totalRevenueWithExtras / dentalChairs;
      const patientsPerMonth = dentalChairs * effectivePatientsPerDay * workingDays;
      const revenuePerPatient = avgMonthlyRevenueWithExtras / patientsPerMonth;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 50) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let utilizationType = 'info';
      if (chairUtilization < 60) utilizationType = 'warning';
      else if (chairUtilization > 80) utilizationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🦷 Dental Practice Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🪑 Chair Utilization', formatPercent(chairUtilization), 'Efficiency rate', utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Dental equipment</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Facility buildout</span>
                  <span>${formatNumber(renovationCost)}</span>
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
                  <span>Core services (${Math.round(patientsPerMonth * 12)} patients/year)</span>
                  <span>${formatNumber(annualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Specialty procedures (implants, orthodontics)</span>
                  <span>${formatNumber(specialtyServices)}</span>
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
                  <span>Staff salaries (dentists & hygienists)</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Dental materials & lab costs</span>
                  <span>${formatNumber(materialsCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Facility rent</span>
                  <span>${formatNumber(rent)}</span>
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
              <h6>🏥 Operational Metrics</h6>
              <div class="metric-subtitle">
                Dental chairs: <strong>${dentalChairs} units</strong><br>
                Patients/day: <strong>${Math.round(effectivePatientsPerDay)} per chair</strong><br>
                Average visit fee: <strong>${formatNumber(avgVisitCost)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Practice Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per chair: <strong>${formatNumber(revenuePerChair)}/year</strong><br>
                Patients/month: <strong>${Math.round(patientsPerMonth)}</strong><br>
                Revenue per patient: <strong>${formatNumber(revenuePerPatient)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Profitability Forecast</h6>
              <div class="metric-subtitle">
                Annual profit: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Weekly profit: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Daily profit: <strong>${formatNumber(annualNetProfit / (workingDays * 12))}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>🎯 Growth Potential</h6>
              <div class="metric-subtitle">
                Working days: <strong>${workingDays}/month</strong><br>
                Expansion potential: <strong>+${dentalChairs} chairs</strong><br>
                Utilization reserve: <strong>${formatPercent(100 - chairUtilization)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 40 ? '<li>⚠️ Low profitability. Consider increasing fees or reducing operating costs.</li>' : ''}
              ${chairUtilization < 70 ? '<li>📅 Low chair utilization. Improve scheduling efficiency and patient flow.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Long payback period. Optimize startup costs or increase patient volume.</li>' : ''}
              ${avgVisitCost < 60 ? '<li>💰 Low average visit fee. Expand high-value specialty services.</li>' : ''}
              ${profitMargin > 60 ? '<li>🎉 Excellent profitability! Consider expanding operatory capacity.</li>' : ''}
              <li>🦷 Add specialty services: implants, orthodontics, cosmetic dentistry for higher margins.</li>
              <li>📱 Implement online scheduling and patient communication systems.</li>
              <li>🤝 Contract with insurance providers for steady patient flow.</li>
              <li>⭐ Develop patient loyalty programs and referral incentives.</li>
              <li>📊 Track detailed analytics on procedure profitability and patient retention.</li>
              <li>🎓 Invest in continuing education and advanced training for staff.</li>
              <li>🔄 Optimize scheduling for maximum chair utilization and efficiency.</li>
              <li>🌐 Build strong online presence and reputation management.</li>
              <li>💳 Offer flexible payment plans and financing options.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.dentalPracticeBusinessData = {
        'Number of Chairs': dentalChairs,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalRevenueWithExtras,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Patients per Day (per chair)': patientsPerDay,
        'Average Visit Fee ($)': avgVisitCost,
        'Chair Utilization (%)': chairUtilization,
        'Revenue per Chair ($)': revenuePerChair
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.dentalPracticeBusinessData) return;
    
    const csv = Object.entries(window.dentalPracticeBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dental-practice-business-plan.csv';
    link.click();
  };
});