document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('food-truck-form');
  const result = document.getElementById('food-truck-result');
  
  // Truck type automation
  const truckTypeSelect = document.getElementById('truck-type');
  const truckCostInput = document.getElementById('truck-cost');

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

  if (truckTypeSelect && truckCostInput) {
    truckTypeSelect.addEventListener('change', function() {
      const type = this.value;
      switch(type) {
        case 'used':
          truckCostInput.value = 45000;
          break;
        case 'new':
          truckCostInput.value = 75000;
          break;
        case 'custom':
          truckCostInput.value = 115000;
          break;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const truckCost = parseFloat(document.getElementById('truck-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const workingDaysWeek = parseFloat(document.getElementById('working-days-week').value);
      const workingHours = parseFloat(document.getElementById('working-hours').value);
      const avgCheck = parseFloat(document.getElementById('avg-check').value);
      const clientsPerHour = parseFloat(document.getElementById('clients-per-hour').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const cogsPercent = parseFloat(document.getElementById('cogs-percent').value);
      const fuelMaintenance = parseFloat(document.getElementById('fuel-maintenance').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Calculate total startup investment
      const totalInvestment = truckCost + equipmentCost + renovationCost + additionalCosts;

      // Calculate monthly operational metrics
      const monthlyWorkingDays = (workingDaysWeek * 4.33); // Average weeks per month
      const dailyRevenue = avgCheck * clientsPerHour * workingHours;
      const monthlyRevenue = dailyRevenue * monthlyWorkingDays;

      // Calculate monthly expenses
      const monthlyCoGS = monthlyRevenue * (cogsPercent / 100);
      const monthlyExpenses = staffSalaries + monthlyCoGS + fuelMaintenance + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate efficiency metrics
      const revenuePerHour = dailyRevenue / workingHours;
      const revenuePerDay = dailyRevenue;

      // Food truck specific analysis
      const laborCostPercent = (staffSalaries / monthlyRevenue) * 100;
      const fuelPercent = (fuelMaintenance / monthlyRevenue) * 100;

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
        recommendations.push('📈 Increase menu prices or reduce portion costs');
        recommendations.push('💰 Optimize food costs (target 25-30% of revenue)');
      }
      if (clientsPerHour < 8) {
        recommendations.push('📍 Find higher traffic locations');
        recommendations.push('📱 Use social media to announce location and specials');
      }
      if (avgCheck < 12) {
        recommendations.push('🍟 Add high-margin sides and beverages');
        recommendations.push('📦 Create combo meals to increase average check');
      }
      if (workingDaysWeek < 5) {
        recommendations.push('📅 Consider working more days per week');
        recommendations.push('🎪 Participate in events and festivals');
      }
      if (fuelPercent > 8) {
        recommendations.push('⛽ Optimize routes and reduce fuel costs');
        recommendations.push('📍 Focus on locations with longer stays');
      }

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🚚 Food Truck Business Plan Analysis</h3>
          
          <div class="insight-cards">
          ${createInsightCard(
            '💰 Total Investment',
            formatNumber(totalInvestment),
            'Truck + Equipment + Setup',
            'info'
          )}
          ${createInsightCard(
            '📈 Monthly Revenue',
            formatNumber(monthlyRevenue),
            `${clientsPerHour}/hr × ${workingHours}hrs × ${workingDaysWeek}days`,
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
          <h4>📋 Detailed Food Truck Analysis</h4>
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
              <span class="metric-label">Revenue per Hour:</span>
              <span class="metric-value">${formatNumber(revenuePerHour)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Revenue per Day:</span>
              <span class="metric-value">${formatNumber(revenuePerDay)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Working Days/Week:</span>
              <span class="metric-value">${workingDaysWeek} days</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Average Check:</span>
              <span class="metric-value">${formatNumber(avgCheck)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Labor Costs:</span>
              <span class="metric-value">${formatPercent(laborCostPercent)} of revenue</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Fuel & Maintenance:</span>
              <span class="metric-value">${formatPercent(fuelPercent)} of revenue</span>
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
      window.foodTruckBusinessData = {
        'Truck Cost ($)': truckCost,
        'Total Investment ($)': totalInvestment,
        'Annual Revenue ($)': annualRevenue,
        'Annual Expenses ($)': monthlyExpenses * 12,
        'Annual Profit ($)': annualProfit,
        'Monthly Profit ($)': monthlyProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': roi,
        'Payback Period (years)': paybackPeriod,
        'Revenue per Hour ($)': revenuePerHour,
        'Revenue per Day ($)': revenuePerDay,
        'Average Check ($)': avgCheck,
        'Clients per Hour': clientsPerHour,
        'Working Days per Week': workingDaysWeek,
        'Working Hours per Day': workingHours,
        'Labor Cost (%)': laborCostPercent,
        'COGS (%)': cogsPercent,
        'Fuel & Maintenance (%)': fuelPercent
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.foodTruckBusinessData) return;
    
    const csv = Object.entries(window.foodTruckBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'food-truck-business-plan.csv';
    link.click();
  };
});