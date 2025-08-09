document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('courier-service-form');
  const result = document.getElementById('courier-service-result');

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

      const courierCount = parseInt(document.getElementById('courier-count').value);
      const vehicleCost = parseFloat(document.getElementById('vehicle-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const dailyDeliveries = parseInt(document.getElementById('daily-deliveries').value);
      const avgDeliveryFee = parseFloat(document.getElementById('avg-delivery-fee').value);
      const workingDays = parseInt(document.getElementById('working-days').value);
      const seasonalGrowth = parseFloat(document.getElementById('seasonal-growth').value);
      const courierSalaries = parseFloat(document.getElementById('courier-salaries').value);
      const fuelMaintenance = parseFloat(document.getElementById('fuel-maintenance').value);
      const insuranceLicenses = parseFloat(document.getElementById('insurance-licenses').value);
      const officeExpenses = parseFloat(document.getElementById('office-expenses').value);

      if (courierCount <= 0 || dailyDeliveries <= 0 || avgDeliveryFee <= 0) {
        result.innerHTML = '<div class="error">Please enter valid values for all fields.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = vehicleCost + equipmentCost + workingCapital;

      // Revenue calculations
      const baseMonthlyDeliveries = courierCount * dailyDeliveries * workingDays;
      const baseMonthlyRevenue = baseMonthlyDeliveries * avgDeliveryFee;
      
      // Seasonal adjustment (peak months vs regular months)
      const peakMonths = 4; // Holiday seasons, sales periods
      const regularMonths = 12 - peakMonths;
      const peakMonthlyRevenue = baseMonthlyRevenue * (1 + seasonalGrowth / 100);
      
      const annualRevenue = (peakMonthlyRevenue * peakMonths) + (baseMonthlyRevenue * regularMonths);
      const avgMonthlyRevenue = annualRevenue / 12;

      // Additional revenue streams (estimated)
      const additionalServices = annualRevenue * 0.10; // 10% from express, insurance, packaging
      const totalRevenueWithExtras = annualRevenue + additionalServices;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Monthly expenses
      const totalMonthlyExpenses = courierSalaries + fuelMaintenance + insuranceLicenses + officeExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerCourier = totalRevenueWithExtras / courierCount;
      const profitPerDelivery = annualNetProfit / (baseMonthlyDeliveries * 12);
      const deliveryCapacity = courierCount * dailyDeliveries * 365;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🚚 Courier Service Business Plan Analysis</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Total Investment', formatNumber(totalStartupCost), 'Initial capital required', 'info')}
            ${createInsightCard('📈 Monthly Profit', formatNumber(monthlyNetProfit), `Margin: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Payback Period', `${paybackYears.toFixed(1)} years`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 2 ? 'success' : 'warning')}
            ${createInsightCard('🚴 Revenue per Courier', formatNumber(revenuePerCourier), 'Annual', 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Detailed Financial Analysis</h4>
            
            <div class="section">
              <h5>🏗️ Startup Costs</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Vehicle fleet (${courierCount} couriers)</span>
                  <span>${formatNumber(vehicleCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Equipment & technology</span>
                  <span>${formatNumber(equipmentCost)}</span>
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
                  <span>Regular months (${regularMonths} months × ${baseMonthlyDeliveries} deliveries)</span>
                  <span>${formatNumber(baseMonthlyRevenue * regularMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Peak months (${peakMonths} months × ${formatPercent(seasonalGrowth)} growth)</span>
                  <span>${formatNumber(peakMonthlyRevenue * peakMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Additional services (express, insurance)</span>
                  <span>${formatNumber(additionalServices)}</span>
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
                  <span>Courier wages</span>
                  <span>${formatNumber(courierSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Fuel & maintenance</span>
                  <span>${formatNumber(fuelMaintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Insurance & licenses</span>
                  <span>${formatNumber(insuranceLicenses)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Office & other expenses</span>
                  <span>${formatNumber(officeExpenses)}</span>
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
              <h6>📊 Operational Metrics</h6>
              <div class="metric-subtitle">
                Couriers: <strong>${courierCount} people</strong><br>
                Deliveries/day: <strong>${dailyDeliveries} per courier</strong><br>
                Delivery rate: <strong>${formatNumber(avgDeliveryFee)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Delivery Efficiency</h6>
              <div class="metric-subtitle">
                Profit per delivery: <strong>${formatNumber(profitPerDelivery)}</strong><br>
                Annual deliveries: <strong>${Math.round(deliveryCapacity).toLocaleString()}</strong><br>
                Monthly revenue: <strong>${formatNumber(avgMonthlyRevenueWithExtras)}</strong>
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
              <h6>🎯 Growth Potential</h6>
              <div class="metric-subtitle">
                Seasonal growth: <strong>${formatPercent(seasonalGrowth)}</strong><br>
                Working days: <strong>${workingDays}/month</strong><br>
                Expansion potential: <strong>+${courierCount * 2} couriers</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Optimization Recommendations</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Low profitability. Consider increasing rates or reducing operating costs.</li>' : ''}
              ${avgDeliveryFee < 4 ? '<li>💰 Low delivery rates. Add express delivery and premium services.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Long payback period. Increase delivery volume or optimize expenses.</li>' : ''}
              ${dailyDeliveries < 25 ? '<li>📦 Low productivity. Optimize routes and operational processes.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Excellent profitability! Consider expanding your courier team.</li>' : ''}
              <li>📱 Develop mobile app for orders and real-time tracking.</li>
              <li>🤝 Secure long-term contracts with e-commerce businesses.</li>
              <li>🚀 Add express delivery with 50-100% premium pricing.</li>
              <li>📊 Implement GPS monitoring for route optimization.</li>
              <li>💳 Integrate multiple payment methods for customer convenience.</li>
              <li>⭐ Create loyalty program for repeat customers.</li>
              <li>📈 Analyze peak hours and scale team accordingly.</li>
              <li>🔄 Diversify services: food, documents, shopping, medical.</li>
              <li>🌐 Partner with local businesses and online marketplaces.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Print Business Plan</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Download Data (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.courierServiceBusinessData = {
        'Number of Couriers': courierCount,
        'Total Investment ($)': totalStartupCost,
        'Annual Revenue ($)': totalRevenueWithExtras,
        'Annual Expenses ($)': annualExpenses,
        'Annual Profit ($)': annualNetProfit,
        'Monthly Profit ($)': monthlyNetProfit,
        'Profit Margin (%)': profitMargin,
        'Annual ROI (%)': annualROI,
        'Payback Period (years)': paybackYears,
        'Daily Deliveries (per courier)': dailyDeliveries,
        'Delivery Fee ($)': avgDeliveryFee,
        'Revenue per Courier ($)': revenuePerCourier
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.courierServiceBusinessData) return;
    
    const csv = Object.entries(window.courierServiceBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Metric,Value\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'courier-service-business-plan.csv';
    link.click();
  };
});