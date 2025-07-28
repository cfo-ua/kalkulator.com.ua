document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('clothing-store-form');
  const result = document.getElementById('clothing-store-result');
  
  // Store type automation
  const storeTypeSelect = document.getElementById('store-type');
  const markupInput = document.getElementById('markup-percent');

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

  if (storeTypeSelect && markupInput) {
    storeTypeSelect.addEventListener('change', function() {
      const type = this.value;
      switch(type) {
        case 'mass':
          markupInput.value = 120;
          break;
        case 'mid':
          markupInput.value = 180;
          break;
        case 'premium':
          markupInput.value = 250;
          break;
        case 'boutique':
          markupInput.value = 300;
          break;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const area = parseFloat(document.getElementById('area').value);
      const storeType = document.getElementById('store-type').value;
      const inventoryCost = parseFloat(document.getElementById('inventory-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const markupPercent = parseFloat(document.getElementById('markup-percent').value);
      const monthlySalesCost = parseFloat(document.getElementById('monthly-sales-cost').value);
      const inventoryTurnover = parseFloat(document.getElementById('inventory-turnover').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Store type names
      const storeTypeNames = {
        mass: 'Mass Market',
        mid: 'Mid-Range',
        premium: 'Premium',
        boutique: 'Boutique'
      };

      // Calculate total startup investment
      const totalInvestment = inventoryCost + equipmentCost + renovationCost + additionalCosts;

      // Calculate monthly revenue
      const monthlyRevenue = (monthlySalesCost * markupPercent) / 100;

      // Calculate monthly expenses
      const monthlyExpenses = monthlyRent + staffSalaries + monthlySalesCost + utilities + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate efficiency metrics
      const revenuePerSqUnit = monthlyRevenue / area;
      const inventoryEfficiency = (monthlySalesCost * 12) / inventoryCost;

      // Clothing store specific analysis
      const rentPercent = (monthlyRent / monthlyRevenue) * 100;
      const staffPercent = (staffSalaries / monthlyRevenue) * 100;
      const cogPercent = (monthlySalesCost / monthlyRevenue) * 100;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = 'Needs Optimization';
      if (roi >= 25 && profitMargin >= 20) {
        viabilityType = 'success';
        viabilityMessage = 'High Profit Store';
      } else if (roi >= 15 && profitMargin >= 12) {
        viabilityType = 'info';
        viabilityMessage = 'Stable Business';
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 15) {
        recommendations.push('📈 Increase markup or reduce cost of goods');
        recommendations.push('💰 Negotiate better wholesale prices');
      }
      if (inventoryTurnover < 4) {
        recommendations.push('📦 Improve inventory management and turnover');
        recommendations.push('🔄 Reduce slow-moving stock with promotions');
      }
      if (rentPercent > 15) {
        recommendations.push('🏢 Consider relocating to reduce rent costs');
        recommendations.push('🌐 Add online sales to increase revenue per sq ft');
      }
      if (revenuePerSqUnit < 100) {
        recommendations.push('📈 Optimize store layout for better sales');
        recommendations.push('🛍️ Add complementary products and accessories');
      }
      if (cogPercent > 60) {
        recommendations.push('💎 Focus on higher-margin products');
        recommendations.push('🤝 Negotiate volume discounts with suppliers');
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
            `${storeTypeNames[storeType]}, ${markupPercent}% markup`,
            'success'
          )}
          ${createInsightCard(
            '💸 Monthly Expenses',
            formatNumber(monthlyExpenses),
            `Including COGS ${formatNumber(monthlySalesCost)}`,
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
          <h4>📋 Detailed Clothing Store Analysis</h4>
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
              <span class="metric-label">Revenue per Sq Ft:</span>
              <span class="metric-value">${formatNumber(revenuePerSqUnit)}/month</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Inventory Turnover:</span>
              <span class="metric-value">${inventoryEfficiency.toFixed(1)}x per year</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Rent Costs:</span>
              <span class="metric-value">${formatPercent(rentPercent)} of revenue</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Staff Costs:</span>
              <span class="metric-value">${formatPercent(staffPercent)} of revenue</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Cost of Goods:</span>
              <span class="metric-value">${formatPercent(cogPercent)} of revenue</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Store Type:</span>
              <span class="metric-value">${storeTypeNames[storeType]}</span>
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
      window.clothingBusinessData = {
        'Store Area (sq ft)': area,
        'Store Type': storeTypeNames[storeType],
        'Total Investment ($)': totalInvestment,
        'Annual Revenue ($)': annualRevenue,
        'Annual Expenses ($)': monthlyExpenses * 12,
        'Annual Profit ($)': annualProfit,
        'Monthly Profit ($)': monthlyProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': roi,
        'Payback Period (years)': paybackPeriod,
        'Revenue per Sq Ft ($)': revenuePerSqUnit,
        'Inventory Turnover': inventoryEfficiency,
        'Markup (%)': markupPercent,
        'Rent as % of Revenue': rentPercent,
        'Staff as % of Revenue': staffPercent,
        'COGS as % of Revenue': cogPercent
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.clothingBusinessData) return;
    
    const csv = Object.entries(window.clothingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clothing-store-business-plan.csv';
    link.click();
  };
});