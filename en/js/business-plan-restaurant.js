document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('restaurant-form');
  const result = document.getElementById('restaurant-result');

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

      // Calculate efficiency metrics
      const revenuePerSeat = monthlyRevenue / seats;
      const revenuePerSqUnit = monthlyRevenue / area;
      const seatTurnover = clientsPerDay / seats;

      // Restaurant-specific analysis
      const laborCostPercent = (staffSalaries / monthlyRevenue) * 100;
      const rentPercent = (monthlyRent / monthlyRevenue) * 100;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = 'Needs Optimization';
      if (roi >= 15 && profitMargin >= 12) {
        viabilityType = 'success';
        viabilityMessage = 'High Profit Restaurant';
      } else if (roi >= 8 && profitMargin >= 6) {
        viabilityType = 'info';
        viabilityMessage = 'Stable Business';
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 8) {
        recommendations.push('📈 Increase average check through premium menu items');
        recommendations.push('💰 Optimize food costs (target 28-32% of revenue)');
      }
      if (laborCostPercent > 35) {
        recommendations.push('👥 Optimize staff size (target 25-32% of revenue)');
        recommendations.push('🤖 Implement automation to reduce labor needs');
      }
      if (rentPercent > 10) {
        recommendations.push('🏢 Consider relocating to lower rent location');
        recommendations.push('📦 Add delivery to increase turnover without extra seating');
      }
      if (seatTurnover < 2) {
        recommendations.push('⏰ Increase table turnover through faster service');
        recommendations.push('🎯 Run marketing campaigns to attract customers');
      }
      if (avgCheck < 20) {
        recommendations.push('🍷 Add alcoholic beverages and high-margin desserts');
        recommendations.push('🎉 Create special offers and set menus');
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
        <div class="business-plan-results">
          <h3>🍽️ Restaurant Business Plan Analysis</h3>
          
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
            paybackPeriod < 4 ? 'Fast Payback' : paybackPeriod < 6 ? 'Moderate Payback' : 'Slow Payback',
            paybackPeriod < 4 ? 'success' : paybackPeriod < 6 ? 'info' : 'warning'
          )}
          ${createInsightCard(
            '📊 ROI',
            formatPercent(roi),
            viabilityMessage,
            viabilityType
          )}
        </div>

        <div class="analysis-section">
          <h4>📋 Detailed Restaurant Analysis</h4>
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
              <span class="metric-label">Revenue per Seat:</span>
              <span class="metric-value">${formatNumber(revenuePerSeat)}/month</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Revenue per Sq Ft:</span>
              <span class="metric-value">${formatNumber(revenuePerSqUnit)}/month</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Table Turnover:</span>
              <span class="metric-value">${seatTurnover.toFixed(1)} per day</span>
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

        <div class="print-section">
          <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
          <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
        </div>

        <div class="disclaimer">
          <p><small>⚠️ Calculations are approximate and based on input data. Actual results may vary depending on market conditions, location, and management efficiency.</small></p>
        </div>
        </div>
      `;

      // Store data for CSV download
      window.restaurantBusinessData = {
        'Restaurant Area (sq ft)': area,
        'Number of Seats': seats,
        'Total Investment ($)': totalInvestment,
        'Annual Revenue ($)': annualRevenue,
        'Annual Expenses ($)': monthlyExpenses * 12,
        'Annual Profit ($)': annualProfit,
        'Monthly Profit ($)': monthlyProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': roi,
        'Payback Period (years)': paybackPeriod,
        'Revenue per Seat ($)': revenuePerSeat,
        'Revenue per Sq Ft ($)': revenuePerSqUnit,
        'Average Check ($)': avgCheck,
        'Seat Turnover': seatTurnover,
        'Labor Cost (%)': laborCostPercent,
        'Rent as % of Revenue': rentPercent
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.restaurantBusinessData) return;
    
    const csv = Object.entries(window.restaurantBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'restaurant-business-plan.csv';
    link.click();
  };
});