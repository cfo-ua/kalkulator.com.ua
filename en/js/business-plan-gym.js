document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gym-form');
  const result = document.getElementById('gym-result');

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

      const gymArea = parseInt(document.getElementById('gym-area').value);
      const propertyCost = parseFloat(document.getElementById('property-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyFee = parseFloat(document.getElementById('monthly-fee').value);
      const targetMembers = parseInt(document.getElementById('target-members').value);
      const retentionRate = parseFloat(document.getElementById('retention-rate').value);
      const personalTrainingRate = parseFloat(document.getElementById('personal-training-rate').value);
      const personalSessions = parseInt(document.getElementById('personal-sessions').value);
      const rentCost = parseFloat(document.getElementById('rent-cost').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const marketing = parseFloat(document.getElementById('marketing').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (gymArea <= 0 || monthlyFee <= 0 || targetMembers <= 0 || retentionRate <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = propertyCost + equipmentCost + renovationCost + additionalCosts;

      // Member calculations with retention rate
      const effectiveMembers = targetMembers * (retentionRate / 100);
      const monthlyMembershipRevenue = effectiveMembers * monthlyFee;
      
      // Personal training revenue
      const personalTrainingRevenue = personalSessions * personalTrainingRate;
      
      // Additional revenue streams (supplements, drinks, merchandise)
      const additionalRevenue = monthlyMembershipRevenue * 0.08; // 8% from additional services
      
      // Total monthly revenue
      const totalMonthlyRevenue = monthlyMembershipRevenue + personalTrainingRevenue + additionalRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = rentCost + staffCosts + utilities + marketing + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerMember = (monthlyMembershipRevenue / effectiveMembers) || 0;
      const revenuePerSqFt = totalMonthlyRevenue / gymArea;
      const membersPerSqFt = effectiveMembers / gymArea;
      const capacityUtilization = (effectiveMembers / (gymArea / 100)) * 100; // 100 sqft per person standard

      // Member acquisition cost
      const memberAcquisitionCost = (marketing * 12) / (targetMembers * 0.3); // 30% new members annually
      
      // Breakeven analysis
      const breakEvenMembers = totalMonthlyExpenses / monthlyFee;
      const membershipFillRate = (effectiveMembers / targetMembers) * 100;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      let utilizationType = 'info';
      if (capacityUtilization < 50) utilizationType = 'warning';
      else if (capacityUtilization > 80) utilizationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏋️ Gym Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 4 ? 'success' : 'warning')}
            ${createInsightCard('👥 Active Members', effectiveMembers.toFixed(0), `Fill Rate: ${formatPercent(membershipFillRate)}`, utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Facility (purchase/down payment)</span>
                  <span>${formatNumber(propertyCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment & machines</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Renovation & design</span>
                  <span>${formatNumber(renovationCost)}</span>
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
                  <span>Memberships (${effectiveMembers.toFixed(0)} members × $${monthlyFee})</span>
                  <span>${formatNumber(monthlyMembershipRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Personal training (${personalSessions} sessions)</span>
                  <span>${formatNumber(personalTrainingRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services & retail</span>
                  <span>${formatNumber(additionalRevenue)}</span>
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
                  <span>Facility rent</span>
                  <span>${formatNumber(rentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Staff (trainers, front desk)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & advertising</span>
                  <span>${formatNumber(marketing)}</span>
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
              <h6>📊 Facility Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per sq ft: <strong>${formatNumber(revenuePerSqFt)}/month</strong><br>
                Members per sq ft: <strong>${membersPerSqFt.toFixed(3)}</strong><br>
                Capacity utilization: <strong>${formatPercent(capacityUtilization)}</strong>
              </div>
            </div>
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>👥 Membership Analysis</h6>
              <div class="metric-subtitle">
                Revenue per member: <strong>${formatNumber(revenuePerMember)}/month</strong><br>
                Break-even members: <strong>${breakEvenMembers.toFixed(0)} members</strong><br>
                Acquisition cost: <strong>${formatNumber(memberAcquisitionCost)}</strong>
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
                Max revenue (100% capacity): <strong>${formatNumber((targetMembers * monthlyFee + personalTrainingRevenue + additionalRevenue) * 12)}/year</strong><br>
                Growth reserve: <strong>${formatPercent(100 - membershipFillRate)}</strong><br>
                Potential additional revenue: <strong>+${formatNumber((targetMembers - effectiveMembers) * monthlyFee * 12)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 15 ? '<li>⚠️ Low profitability. Consider increasing membership fees or reducing costs.</li>' : ''}
              ${capacityUtilization < 50 ? '<li>📍 Low utilization. Improve marketing or adjust pricing strategy.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Long payback period. Optimize startup costs or increase revenue.</li>' : ''}
              ${capacityUtilization > 85 ? '<li>✅ High utilization! Consider rate increases or facility expansion.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Excellent profitability! Consider opening additional locations.</li>' : ''}
              <li>🏋️ Develop personal training services - they provide highest margins (50-70%).</li>
              <li>📱 Implement fitness app for booking, tracking, and member engagement.</li>
              <li>🎯 Create specialized programs: women's fitness, functional training, senior fitness.</li>
              <li>🤝 Develop corporate wellness programs for stable revenue.</li>
              <li>💊 Add supplement and fitness accessory sales for additional revenue.</li>
              <li>⭐ Invest in member retention - it's cheaper than acquiring new members.</li>
              <li>📈 Implement tiered membership pricing: basic, premium, VIP options.</li>
              <li>🌟 Regularly update equipment and introduce new fitness programs.</li>
              <li>🏆 Create member challenges and rewards programs to boost engagement.</li>
              <li>📊 Use data analytics to optimize class schedules and equipment usage.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.gymBusinessData = {
        'Gym Area (sq ft)': gymArea,
        'Total Investment ($)': totalStartupCost,
        'Target Members': targetMembers,
        'Effective Members': effectiveMembers.toFixed(0),
        'Monthly Revenue ($)': totalMonthlyRevenue,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Revenue per Member ($)': revenuePerMember,
        'Capacity Utilization (%)': capacityUtilization,
        'Break-even Members': breakEvenMembers.toFixed(0)
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.gymBusinessData) return;
    
    const csv = Object.entries(window.gymBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gym-business-plan.csv';
    link.click();
  };
});