document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('courier-service-form');
  const result = document.getElementById('courier-service-result');

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
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
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
          <h3>🚚 Бізнес-план кур'єрської служби</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 2 ? 'success' : 'warning')}
            ${createInsightCard('🚴 Доходи на кур\'єра', formatNumber(revenuePerCourier), 'За рік', 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Транспорт (${courierCount} кур'єрів)</span>
                  <span>${formatNumber(vehicleCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання та технології</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії та оборотні кошти</span>
                  <span>${formatNumber(workingCapital)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загалом стартових витрат</strong></span>
                  <span><strong>${formatNumber(totalStartupCost)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💵 Річні доходи</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Звичайні місяці (${regularMonths} міс. × ${baseMonthlyDeliveries} доставок)</span>
                  <span>${formatNumber(baseMonthlyRevenue * regularMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Пікові місяці (${peakMonths} міс. × ${formatPercent(seasonalGrowth)} росту)</span>
                  <span>${formatNumber(peakMonthlyRevenue * peakMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги (експрес, страхування)</span>
                  <span>${formatNumber(additionalServices)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний річний дохід</strong></span>
                  <span><strong>${formatNumber(totalRevenueWithExtras)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Зарплати кур'єрів</span>
                  <span>${formatNumber(courierSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Паливо та обслуговування</span>
                  <span>${formatNumber(fuelMaintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Страхування та ліцензії</span>
                  <span>${formatNumber(insuranceLicenses)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Офісні та інші витрати</span>
                  <span>${formatNumber(officeExpenses)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальні щомісячні витрати</strong></span>
                  <span><strong>${formatNumber(totalMonthlyExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>📊 Операційні показники</h6>
              <div class="metric-subtitle">
                Кур'єрів: <strong>${courierCount} чол.</strong><br>
                Доставок/день: <strong>${dailyDeliveries} на кур'єра</strong><br>
                Вартість доставки: <strong>${formatNumber(avgDeliveryFee)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Ефективність доставок</h6>
              <div class="metric-subtitle">
                Прибуток на доставку: <strong>${formatNumber(profitPerDelivery)}</strong><br>
                Доставок на рік: <strong>${Math.round(deliveryCapacity).toLocaleString()}</strong><br>
                Місячний дохід: <strong>${formatNumber(avgMonthlyRevenueWithExtras)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Прогноз прибутковості</h6>
              <div class="metric-subtitle">
                Річний прибуток: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Щотижневий прибуток: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Щоденний прибуток: <strong>${formatNumber(annualNetProfit / 365)}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>🎯 Потенціал росту</h6>
              <div class="metric-subtitle">
                Сезонний приріст: <strong>${formatPercent(seasonalGrowth)}</strong><br>
                Робочих днів: <strong>${workingDays}/місяць</strong><br>
                Потенціал розширення: <strong>+${courierCount * 2} кур'єрів</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення тарифів або зниження витрат.</li>' : ''}
              ${avgDeliveryFee < 4 ? '<li>💰 Низькі тарифи. Додайте експрес-доставку та спеціальні послуги.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Довгий термін окупності. Збільште кількість замовлень або оптимізуйте витрати.</li>' : ''}
              ${dailyDeliveries < 25 ? '<li>📦 Низька продуктивність. Оптимізуйте маршрути та процеси.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Відмінна рентабельність! Розгляньте розширення команди.</li>' : ''}
              <li>📱 Розробіть мобільний додаток для замовлень та відстеження.</li>
              <li>🤝 Укладіть довгострокові контракти з інтернет-магазинами.</li>
              <li>🚀 Додайте експрес-доставку з надбавкою 50-100%.</li>
              <li>📊 Впровадьте GPS-моніторинг для оптимізації маршрутів.</li>
              <li>💳 Інтегруйте різні способи оплати для клієнтів.</li>
              <li>⭐ Створіть програму лояльності для постійних клієнтів.</li>
              <li>📈 Аналізуйте пікові години та збільшуйте команду в ці періоди.</li>
              <li>🔄 Диверсифікуйте послуги: їжа, документи, покупки.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.courierServiceBusinessData = {
        'Кількість кур\'єрів': courierCount,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': totalRevenueWithExtras,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Доставок на день (на кур\'єра)': dailyDeliveries,
        'Вартість доставки ($)': avgDeliveryFee,
        'Дохід на кур\'єра ($)': revenuePerCourier
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.courierServiceBusinessData) return;
    
    const csv = Object.entries(window.courierServiceBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-courier-service.csv';
    link.click();
  };
});