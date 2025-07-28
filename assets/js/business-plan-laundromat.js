document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('laundromat-form');
  const result = document.getElementById('laundromat-result');

  function formatNumber(value) {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    } else {
      return value.toLocaleString('uk-UA', { 
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
    // Set default values on load
    form.addEventListener('input', function() {
      // Auto-calculate on input change for better UX
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const washingMachines = parseInt(document.getElementById('washing-machines').value);
      const dryers = parseInt(document.getElementById('dryers').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const washPrice = parseFloat(document.getElementById('wash-price').value);
      const dryPrice = parseFloat(document.getElementById('dry-price').value);
      const utilization = parseFloat(document.getElementById('utilization').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const maintenance = parseFloat(document.getElementById('maintenance').value);
      const insurance = parseFloat(document.getElementById('insurance').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (washingMachines <= 0 || dryers <= 0 || utilization <= 0 || utilization > 100) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Equipment costs
      const avgWasherCost = 3500; // Average commercial washer cost
      const avgDryerCost = 2800; // Average commercial dryer cost
      const equipmentCost = (washingMachines * avgWasherCost) + (dryers * avgDryerCost);
      
      // Total startup investment
      const totalStartupCost = equipmentCost + renovationCost + additionalCosts;

      // Daily operations (assume 16 hours/day operation)
      const operatingHours = 16;
      const cyclesPerDay = operatingHours / 1.5; // Average 1.5 hours per cycle
      const utilizationRate = utilization / 100;
      
      // Monthly revenue calculations
      const washCyclesPerMonth = washingMachines * cyclesPerDay * 30 * utilizationRate;
      const dryCyclesPerMonth = dryers * cyclesPerDay * 30 * utilizationRate;
      const monthlyWashRevenue = washCyclesPerMonth * washPrice;
      const monthlyDryRevenue = dryCyclesPerMonth * dryPrice;
      const totalMonthlyRevenue = monthlyWashRevenue + monthlyDryRevenue;

      // Monthly expenses
      const totalMonthlyExpenses = monthlyRent + utilities + maintenance + insurance + otherExpenses;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackMonths = totalStartupCost / monthlyNetProfit;
      const paybackYears = paybackMonths / 12;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Revenue per machine metrics
      const revenuePerWasher = monthlyWashRevenue / washingMachines;
      const revenuePerDryer = monthlyDryRevenue / dryers;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 15) roiType = 'warning';
      else if (annualROI > 25) roiType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>📋 Бізнес-план пральні самообслуговування</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `${paybackMonths.toFixed(0)} місяців`, paybackYears <= 4 ? 'success' : 'warning')}
            ${createInsightCard('🎯 ROI на рік', formatPercent(annualROI), 'Рентабельність інвестицій', roiType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Пральні машини (${washingMachines} шт × $${avgWasherCost})</span>
                  <span>${formatNumber(washingMachines * avgWasherCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Сушильні машини (${dryers} шт × $${avgDryerCost})</span>
                  <span>${formatNumber(dryers * avgDryerCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ремонт та обладнання приміщення</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії, дозволи та інше</span>
                  <span>${formatNumber(additionalCosts)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загалом стартових витрат</strong></span>
                  <span><strong>${formatNumber(totalStartupCost)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💵 Щомісячні доходи</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Прання (${Math.round(washCyclesPerMonth)} циклів × $${washPrice})</span>
                  <span>${formatNumber(monthlyWashRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Сушіння (${Math.round(dryCyclesPerMonth)} циклів × $${dryPrice})</span>
                  <span>${formatNumber(monthlyDryRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний дохід</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Оренда приміщення</span>
                  <span>${formatNumber(monthlyRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні послуги</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обслуговування та ремонт</span>
                  <span>${formatNumber(maintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Страхування</span>
                  <span>${formatNumber(insurance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Інші витрати</span>
                  <span>${formatNumber(otherExpenses)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальні витрати</strong></span>
                  <span><strong>${formatNumber(totalMonthlyExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔄 Ефективність обладнання</h6>
              <div class="metric-subtitle">
                Дохід на пральну машину: <strong>${formatNumber(revenuePerWasher)}/міс</strong><br>
                Дохід на сушильну машину: <strong>${formatNumber(revenuePerDryer)}/міс</strong><br>
                Завантаженість: <strong>${utilization}%</strong>
              </div>
            </div>
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Прогноз прибутковості</h6>
              <div class="metric-subtitle">
                Річний прибуток: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Щотижневий прибуток: <strong>${formatNumber(monthlyNetProfit * 12 / 52)}</strong><br>
                Щоденний прибуток: <strong>${formatNumber(monthlyNetProfit / 30)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте зниження витрат або підвищення цін.</li>' : ''}
              ${utilization < 50 ? '<li>📍 Низька завантаженість. Поліпшіть маркетинг або оберіть кращу локацію.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Довгий термін окупності. Розгляньте зменшення стартових витрат.</li>' : ''}
              ${utilization > 80 ? '<li>✅ Висока завантаженість! Розгляньте розширення або підвищення цін.</li>' : ''}
              ${profitMargin > 25 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових локацій.</li>' : ''}
              <li>💡 Розгляньте додаткові джерела доходу: торгові автомати, послуги прання/складання, WiFi-реклама.</li>
              <li>🔧 Інвестуйте в якісне обладнання для зменшення витрат на ремонт.</li>
              <li>📱 Додайте мобільні платежі та програму лояльності для підвищення доходів.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.laundryBusinessData = {
        'Пральні машини': washingMachines,
        'Сушильні машини': dryers,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalMonthlyRevenue,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Завантаженість (%)': utilization
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.laundryBusinessData) return;
    
    const csv = Object.entries(window.laundryBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-pralnya.csv';
    link.click();
  };
});