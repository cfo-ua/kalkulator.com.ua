document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('childcare-form');
  const result = document.getElementById('childcare-result');

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

      const childrenCapacity = parseInt(document.getElementById('children-capacity').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const licensingCost = parseFloat(document.getElementById('licensing-cost').value);
      const monthlyFee = parseFloat(document.getElementById('monthly-fee').value);
      const occupancyRate = parseFloat(document.getElementById('occupancy-rate').value);
      const additionalServices = parseFloat(document.getElementById('additional-services').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const foodCosts = parseFloat(document.getElementById('food-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (childrenCapacity <= 0 || monthlyFee <= 0 || occupancyRate <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = renovationCost + equipmentCost + licensingCost;

      // Revenue calculations
      const actualChildren = Math.round(childrenCapacity * (occupancyRate / 100));
      const monthlyTuitionRevenue = actualChildren * monthlyFee;
      const monthlyAdditionalRevenue = actualChildren * additionalServices;
      const totalMonthlyRevenue = monthlyTuitionRevenue + monthlyAdditionalRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = rent + staffSalaries + foodCosts + utilities + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = annualRevenue - annualExpenses;
      const profitMargin = (annualNetProfit / annualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerChild = annualRevenue / actualChildren;
      const expensePerChild = annualExpenses / actualChildren;
      const profitPerChild = annualNetProfit / actualChildren;
      const staffToChildRatio = Math.round(actualChildren / Math.max(1, Math.floor(staffSalaries / 800))); // Assuming $800 avg salary per staff

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let occupancyType = 'info';
      if (occupancyRate < 75) occupancyType = 'warning';
      else if (occupancyRate > 90) occupancyType = 'success';

      let ratioType = 'info';
      if (staffToChildRatio > 8) ratioType = 'warning';
      else if (staffToChildRatio <= 6) ratioType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>👶 Childcare Center Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 4 ? 'success' : 'warning')}
            ${createInsightCard('👥 Enrollment', `${actualChildren} children`, `${formatPercent(occupancyRate)} of capacity`, occupancyType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Facility renovation & setup</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment & furniture</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Licensing & permits</span>
                  <span>${formatNumber(licensingCost)}</span>
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
                  <span>Tuition fees (${actualChildren} children × ${formatNumber(monthlyFee)})</span>
                  <span>${formatNumber(monthlyTuitionRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services (enrichment, extended care)</span>
                  <span>${formatNumber(monthlyAdditionalRevenue)}</span>
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
                  <span>Facility rent/lease</span>
                  <span>${formatNumber(rent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Staff salaries</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Food & meal costs</span>
                  <span>${formatNumber(foodCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities</span>
                  <span>${formatNumber(utilities)}</span>
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
              <h6>👶 Per Child Metrics</h6>
              <div class="metric-subtitle">
                Annual revenue: <strong>${formatNumber(revenuePerChild)}</strong><br>
                Annual expenses: <strong>${formatNumber(expensePerChild)}</strong><br>
                Annual profit: <strong>${formatNumber(profitPerChild)}</strong>
              </div>
            </div>
            <div class="insight-card ${ratioType}">
              <h6>👥 Staff-to-Child Ratio</h6>
              <div class="metric-subtitle">
                Children per caregiver: <strong>${staffToChildRatio}:1</strong><br>
                Recommended: <strong>6:1 - 8:1</strong><br>
                Care quality: <strong>${staffToChildRatio <= 6 ? 'Excellent' : staffToChildRatio <= 8 ? 'Good' : 'Needs improvement'}</strong>
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
                Maximum capacity: <strong>${childrenCapacity} children</strong><br>
                Current enrollment: <strong>${actualChildren} children</strong><br>
                Growth opportunity: <strong>${childrenCapacity - actualChildren} spaces</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Low profitability. Consider increasing tuition rates or reducing costs.</li>' : ''}
              ${occupancyRate < 80 ? '<li>👥 Low enrollment. Improve marketing and service quality.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Long payback period. Optimize startup costs or increase revenue.</li>' : ''}
              ${staffToChildRatio > 8 ? '<li>👥 High child-to-staff ratio. Consider adding caregivers for better quality.</li>' : ''}
              ${occupancyRate > 95 ? '<li>✅ Excellent enrollment! Consider expansion or rate increases.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Outstanding profitability! Consider opening additional locations.</li>' : ''}
              <li>🎨 Add specialized programs: art, music, foreign language classes.</li>
              <li>🌍 Implement bilingual or multilingual education programs.</li>
              <li>📱 Use parent communication apps for daily updates and photos.</li>
              <li>🏃 Offer extended hours and weekend care services.</li>
              <li>👨‍⚕️ Provide specialist consultations: pediatric nurse, speech therapist.</li>
              <li>🎪 Host family events and seasonal celebrations.</li>
              <li>📚 Develop partnerships with local elementary schools.</li>
              <li>💻 Integrate educational technology and STEAM programs.</li>
              <li>🏆 Pursue quality certifications and accreditation.</li>
              <li>🚌 Add transportation services for school-age programs.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.childcareBusinessData = {
        'Capacity (children)': childrenCapacity,
        'Actual Enrollment': actualChildren,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': annualRevenue,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Enrollment Rate (%)': occupancyRate,
        'Revenue per Child ($)': revenuePerChild,
        'Monthly Tuition ($)': monthlyFee
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.childcareBusinessData) return;
    
    const csv = Object.entries(window.childcareBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'childcare-center-business-plan.csv';
    link.click();
  };
});