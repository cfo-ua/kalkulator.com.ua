document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('cafe-form');
  const result = document.getElementById('cafe-result');

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

  function generateCSVData(data) {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Investment', `$${data.totalInvestment.toLocaleString()}`],
      ['Monthly Revenue', `$${data.monthlyRevenue.toLocaleString()}`],
      ['Monthly Expenses', `$${data.monthlyExpenses.toLocaleString()}`],
      ['Monthly Net Profit', `$${data.monthlyProfit.toLocaleString()}`],
      ['Annual Revenue', `$${data.annualRevenue.toLocaleString()}`],
      ['Annual Net Profit', `$${data.annualProfit.toLocaleString()}`],
      ['Payback Period (years)', data.paybackPeriod.toFixed(1)],
      ['ROI (%)', data.roi.toFixed(1)],
      ['Profit Margin (%)', data.profitMargin.toFixed(1)]
    ];
    
    return csvData.map(row => row.join(',')).join('\n');
  }

  function downloadCSV(data) {
    const csv = generateCSVData(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cafe_business_plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const area = parseFloat(document.getElementById('area').value);
      const seats = parseFloat(document.getElementById('seats').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const furnitureCost = parseFloat(document.getElementById('furniture-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const avgCheck = parseFloat(document.getElementById('avg-check').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const cogsPercent = parseFloat(document.getElementById('cogs-percent').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Calculate total startup investment
      const totalInvestment = equipmentCost + renovationCost + furnitureCost + additionalCosts;

      // Calculate monthly revenue
      const monthlyRevenue = avgCheck * clientsPerDay * workingDays;

      // Calculate monthly expenses
      const monthlyCoGS = monthlyRevenue * (cogsPercent / 100);
      const monthlyExpenses = monthlyRent + staffSalaries + monthlyCoGS + utilities + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate capacity utilization
      const maxDailyCapacity = seats * 4; // Assume 4 turnovers per day
      const capacityUtilization = (clientsPerDay / maxDailyCapacity) * 100;

      // Calculate revenue per square meter/foot
      const revenuePerSqUnit = monthlyRevenue / area;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = 'Needs Optimization';
      if (roi >= 20 && profitMargin >= 15) {
        viabilityType = 'success';
        viabilityMessage = 'High Profit Business';
      } else if (roi >= 12 && profitMargin >= 8) {
        viabilityType = 'info';
        viabilityMessage = 'Stable Business';
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 10) {
        recommendations.push('📈 Increase average transaction with premium menu items');
        recommendations.push('💰 Optimize food costs (target 25-30% of revenue)');
      }
      if (capacityUtilization < 50) {
        recommendations.push('🎯 Attract more customers through marketing and loyalty programs');
        recommendations.push('⏰ Extend operating hours or add delivery services');
      }
      if (revenuePerSqUnit < 50) {
        recommendations.push('🏢 Consider smaller space to reduce rent costs');
        recommendations.push('📦 Add takeaway format to increase turnover');
      }
      if (avgCheck < 8) {
        recommendations.push('☕ Offer specialty coffee drinks and desserts');
        recommendations.push('🥐 Expand breakfast and light lunch menu');
      }

      const data = {
        totalInvestment,
        monthlyRevenue,
        monthlyExpenses,
        monthlyProfit,
        annualRevenue,
        annualProfit,
        paybackPeriod,
        roi,
        profitMargin
      };

      result.innerHTML = `
        <div class="insight-cards">
          ${createInsightCard(
            '💰 Total Investment',
            formatNumber(totalInvestment),
            'Initial Capital',
            'info'
          )}
          ${createInsightCard(
            '📈 Monthly Revenue',
            formatNumber(monthlyRevenue),
            `${clientsPerDay} customers × $${avgCheck} × ${workingDays} days`,
            'success'
          )}
          ${createInsightCard(
            '💸 Monthly Expenses',
            formatNumber(monthlyExpenses),
            `Including ${formatPercent(cogsPercent)} COGS`,
            'warning'
          )}
          ${createInsightCard(
            '💵 Net Profit',
            formatNumber(monthlyProfit),
            `Margin: ${formatPercent(profitMargin)}`,
            viabilityType
          )}
          ${createInsightCard(
            '⏳ Payback Period',
            `${paybackPeriod.toFixed(1)} years`,
            paybackPeriod < 3 ? 'Fast Payback' : paybackPeriod < 5 ? 'Moderate Payback' : 'Slow Payback',
            paybackPeriod < 3 ? 'success' : paybackPeriod < 5 ? 'info' : 'warning'
          )}
          ${createInsightCard(
            '📊 ROI',
            formatPercent(roi),
            viabilityMessage,
            viabilityType
          )}
        </div>

        <div class="analysis-section">
          <h4>📋 Detailed Analysis</h4>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Annual Revenue:</span>
              <span class="metric-value">${formatNumber(annualRevenue)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Annual Profit:</span>
              <span class="metric-value">${formatNumber(annualProfit)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Capacity Utilization:</span>
              <span class="metric-value">${formatPercent(capacityUtilization)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Revenue per sq ft:</span>
              <span class="metric-value">${formatNumber(revenuePerSqUnit)}/month</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Revenue per Seat:</span>
              <span class="metric-value">${formatNumber(monthlyRevenue / seats)}/month</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Cost of Goods:</span>
              <span class="metric-value">${formatNumber(monthlyCoGS)}/month</span>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
          <div class="recommendations">
            <h4>💡 Optimization Recommendations</h4>
            <ul>
              ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="action-buttons">
          <button onclick="window.print()" class="btn-secondary">🖨️ Print Report</button>
          <button onclick="downloadCSV(${JSON.stringify(data).replace(/"/g, '&quot;')})" class="btn-primary">📊 Download CSV Data</button>
        </div>

        <div class="disclaimer">
          <p><small>⚠️ Calculations are approximate and based on input data. Actual results may vary depending on market conditions, location, and management efficiency.</small></p>
        </div>
      `;

      // Expose downloadCSV function globally for the button
      window.downloadCSV = downloadCSV;
    });
  }
});