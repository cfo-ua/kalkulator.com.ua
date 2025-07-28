document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('beauty-salon-form');
  const result = document.getElementById('beauty-salon-result');

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

      const area = parseFloat(document.getElementById('area').value);
      const workstations = parseFloat(document.getElementById('workstations').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const furnitureCost = parseFloat(document.getElementById('furniture-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const avgCheck = parseFloat(document.getElementById('avg-check').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Calculate total startup investment
      const totalInvestment = equipmentCost + renovationCost + furnitureCost + additionalCosts;

      // Calculate monthly revenue
      const monthlyRevenue = avgCheck * clientsPerDay * workingDays;

      // Calculate monthly expenses
      const monthlyExpenses = monthlyRent + staffSalaries + supplies + utilities + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate efficiency metrics
      const revenuePerWorkstation = monthlyRevenue / workstations;
      const revenuePerSqUnit = monthlyRevenue / area;
      const clientsPerWorkstation = clientsPerDay / workstations;

      // Beauty salon specific analysis
      const laborCostPercent = (staffSalaries / monthlyRevenue) * 100;
      const rentPercent = (monthlyRent / monthlyRevenue) * 100;
      const supplyCostPercent = (supplies / monthlyRevenue) * 100;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = 'Needs Optimization';
      if (roi >= 20 && profitMargin >= 15) {
        viabilityType = 'success';
        viabilityMessage = 'High Profit Business';
      } else if (roi >= 12 && profitMargin >= 10) {
        viabilityType = 'info';
        viabilityMessage = 'Stable Business';
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 12) {
        recommendations.push('📈 Increase service prices or reduce costs');
        recommendations.push('💰 Optimize supply costs (target 8-12% of revenue)');
      }
      if (laborCostPercent > 45) {
        recommendations.push('👥 Optimize staff schedule (target 35-40% of revenue)');
        recommendations.push('🤖 Consider booking automation to improve efficiency');
      }
      if (rentPercent > 15) {
        recommendations.push('🏢 Consider relocating to a more affordable location');
        recommendations.push('📦 Add mobile services or product sales');
      }
      if (clientsPerWorkstation < 8) {
        recommendations.push('🎯 Increase marketing to attract more clients');
        recommendations.push('⏰ Extend operating hours or offer online booking');
      }
      if (avgCheck < 35) {
        recommendations.push('💅 Add premium services and packages');
        recommendations.push('🛍️ Sell beauty products with higher margins');
      }

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
            `${clientsPerDay} clients × $${avgCheck} × ${workingDays} days`,
            'success'
          )}
          ${createInsightCard(
            '💸 Monthly Expenses',
            formatNumber(monthlyExpenses),
            `Including supplies & staff`,
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
          <h4>📋 Detailed Beauty Salon Analysis</h4>
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
              <span class="metric-label">Revenue per Station:</span>
              <span class="metric-value">${formatNumber(revenuePerWorkstation)}/month</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Revenue per Sq Ft:</span>
              <span class="metric-value">${formatNumber(revenuePerSqUnit)}/month</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Clients per Station:</span>
              <span class="metric-value">${clientsPerWorkstation.toFixed(1)} per day</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Labor Costs:</span>
              <span class="metric-value">${formatPercent(laborCostPercent)} of revenue</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Rent Costs:</span>
              <span class="metric-value">${formatPercent(rentPercent)} of revenue</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Supply Costs:</span>
              <span class="metric-value">${formatPercent(supplyCostPercent)} of revenue</span>
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
          <button onclick="downloadCSV()" class="btn-primary">📊 Download CSV Data</button>
        </div>

        <div class="disclaimer">
          <p><small>⚠️ Calculations are approximate and based on input data. Actual results may vary depending on market conditions, location, and management efficiency.</small></p>
        </div>
      `;

      // Store data for CSV download
      window.beautyBusinessData = {
        'Salon Area (sq ft)': area,
        'Number of Workstations': workstations,
        'Total Investment ($)': totalInvestment,
        'Annual Revenue ($)': annualRevenue,
        'Annual Expenses ($)': monthlyExpenses * 12,
        'Annual Profit ($)': annualProfit,
        'Monthly Profit ($)': monthlyProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': roi,
        'Payback Period (years)': paybackPeriod,
        'Revenue per Station ($)': revenuePerWorkstation,
        'Revenue per Sq Ft ($)': revenuePerSqUnit,
        'Average Check ($)': avgCheck,
        'Clients per Station': clientsPerWorkstation,
        'Labor Cost (%)': laborCostPercent,
        'Rent as % of Revenue': rentPercent,
        'Supply Cost (%)': supplyCostPercent
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.beautyBusinessData) return;
    
    const csv = Object.entries(window.beautyBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'beauty-salon-business-plan.csv';
    link.click();
  };
});