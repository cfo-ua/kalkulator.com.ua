document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gallery-form');
  const result = document.getElementById('gallery-result');

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

      const galleryArea = parseFloat(document.getElementById('gallery-area').value);
      const renovationCostSqm = parseFloat(document.getElementById('renovation-cost-sqm').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const initialExpenses = parseFloat(document.getElementById('initial-expenses').value);
      const avgArtworkPrice = parseFloat(document.getElementById('avg-artwork-price').value);
      const monthlySales = parseFloat(document.getElementById('monthly-sales').value);
      const commissionRate = parseFloat(document.getElementById('commission-rate').value);
      const additionalServices = parseFloat(document.getElementById('additional-services').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const marketing = parseFloat(document.getElementById('marketing').value);
      const utilitiesOther = parseFloat(document.getElementById('utilities-other').value);

      if (galleryArea <= 0 || monthlySales <= 0 || avgArtworkPrice <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const renovationCost = galleryArea * renovationCostSqm;
      const totalStartupCost = renovationCost + equipmentCost + initialExpenses;

      // Revenue calculations
      const monthlyArtworkRevenue = monthlySales * avgArtworkPrice;
      const galleryCommission = monthlyArtworkRevenue * (commissionRate / 100);
      const totalMonthlyRevenue = galleryCommission + additionalServices;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = rent + staffCosts + marketing + utilitiesOther;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerSqft = totalMonthlyRevenue / galleryArea;
      const salesVolume = monthlySales;
      const avgCommissionPerSale = galleryCommission / monthlySales;
      const costPerSqft = totalMonthlyExpenses / galleryArea;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 15) roiType = 'warning';
      else if (annualROI > 30) roiType = 'success';

      let paybackType = 'info';
      if (paybackYears > 5) paybackType = 'warning';
      else if (paybackYears <= 3) paybackType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🎨 Art Gallery Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), `${galleryArea} sq ft`, 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackType)}
            ${createInsightCard('🎯 Sales Volume', `${monthlySales} artworks/month`, `${formatNumber(avgCommissionPerSale)} commission`, 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Renovation & build-out (${galleryArea} sq ft × ${formatNumber(renovationCostSqm)})</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment (lighting, security, furniture)</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Initial expenses (marketing, initial artworks)</span>
                  <span>${formatNumber(initialExpenses)}</span>
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
                  <span>Artwork sales (${monthlySales} × ${formatNumber(avgArtworkPrice)})</span>
                  <span>${formatNumber(monthlyArtworkRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Gallery commission (${formatPercent(commissionRate)})</span>
                  <span>${formatNumber(galleryCommission)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services (workshops, events)</span>
                  <span>${formatNumber(additionalServices)}</span>
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
                  <span>Rent/lease payments</span>
                  <span>${formatNumber(rent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Staff (curator, assistant, security)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Marketing & promotion</span>
                  <span>${formatNumber(marketing)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Utilities & other expenses</span>
                  <span>${formatNumber(utilitiesOther)}</span>
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
              <h6>🔄 Space Efficiency</h6>
              <div class="metric-subtitle">
                Revenue per sq ft: <strong>${formatNumber(revenuePerSqft)}/month</strong><br>
                Costs per sq ft: <strong>${formatNumber(costPerSqft)}/month</strong><br>
                Average commission: <strong>${formatNumber(avgCommissionPerSale)}</strong>
              </div>
            </div>
            <div class="insight-card ${commissionRate >= 50 ? 'success' : 'info'}">
              <h6>📊 Revenue Structure</h6>
              <div class="metric-subtitle">
                Sales commission: <strong>${formatPercent((galleryCommission/totalMonthlyRevenue)*100)}</strong><br>
                Additional services: <strong>${formatPercent((additionalServices/totalMonthlyRevenue)*100)}</strong><br>
                Commission rate: <strong>${formatPercent(commissionRate)}</strong>
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
                With +50% sales: <strong>${formatNumber(monthlyNetProfit + (galleryCommission * 0.5))}/month</strong><br>
                With 20% price increase: <strong>${formatNumber(monthlyNetProfit + (galleryCommission * 0.2))}/month</strong><br>
                Turnover per sq ft: <strong>${formatNumber(monthlyArtworkRevenue / galleryArea)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Low profitability. Consider increasing commission rates or reducing costs.</li>' : ''}
              ${monthlySales < 5 ? '<li>📍 Low sales volume. Improve curatorial program and marketing efforts.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Long payback period. Optimize startup costs or increase revenue streams.</li>' : ''}
              ${monthlySales > 15 ? '<li>✅ High sales volume! Consider gallery expansion or premium pricing.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Excellent profitability! Invest in growth and expansion opportunities.</li>' : ''}
              <li>🎨 Develop relationships with local artists and art schools for emerging talent.</li>
              <li>📱 Build strong online presence with virtual exhibitions and e-commerce.</li>
              <li>🎪 Host regular art events, openings, and collector receptions.</li>
              <li>🤝 Partner with interior designers for commercial art placement.</li>
              <li>💼 Develop corporate client base for office art installations.</li>
              <li>📚 Add educational programs and workshops for stable revenue.</li>
              <li>🌐 Participate in art fairs and international exhibitions.</li>
              <li>🎯 Focus on unique artists and exclusive representation agreements.</li>
              <li>📊 Use data analytics to track best-selling artists and styles.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.galleryBusinessData = {
        'Gallery Area (sq ft)': galleryArea,
        'Total Investment ($)': totalStartupCost,
        'Monthly Revenue ($)': totalMonthlyRevenue,
        'Monthly Expenses ($)': totalMonthlyExpenses,
        'Monthly Profit ($)': monthlyNetProfit,
        'Annual Profit ($)': annualNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Monthly Sales (units)': monthlySales,
        'Average Artwork Price ($)': avgArtworkPrice,
        'Gallery Commission (%)': commissionRate,
        'Revenue per sq ft ($)': revenuePerSqft
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.galleryBusinessData) return;
    
    const csv = Object.entries(window.galleryBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'art-gallery-business-plan.csv';
    link.click();
  };
});