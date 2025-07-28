document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('flower-shop-form');
  const result = document.getElementById('flower-shop-result');

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

      const shopArea = parseInt(document.getElementById('shop-area').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const refrigerationCost = parseFloat(document.getElementById('refrigeration-cost').value);
      const initialInventory = parseFloat(document.getElementById('initial-inventory').value);
      const avgTicket = parseFloat(document.getElementById('avg-ticket').value);
      const dailyCustomers = parseInt(document.getElementById('daily-customers').value);
      const peakMultiplier = parseFloat(document.getElementById('peak-multiplier').value);
      const peakDays = parseInt(document.getElementById('peak-days').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const cogsPercentage = parseFloat(document.getElementById('cogs-percentage').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (shopArea <= 0 || avgTicket <= 0 || dailyCustomers <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + refrigerationCost + initialInventory;

      // Revenue calculations
      const regularDays = 30 - peakDays;
      const regularDailyRevenue = dailyCustomers * avgTicket;
      const peakDailyRevenue = dailyCustomers * peakMultiplier * avgTicket;
      
      const monthlyRegularRevenue = regularDailyRevenue * regularDays;
      const monthlyPeakRevenue = peakDailyRevenue * peakDays;
      const totalMonthlyRevenue = monthlyRegularRevenue + monthlyPeakRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Additional revenue streams (estimated)
      const additionalServices = annualRevenue * 0.08; // 8% from delivery, arrangements
      const totalRevenueWithExtras = annualRevenue + additionalServices;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Cost of goods sold
      const monthlyCoGS = (totalMonthlyRevenue * cogsPercentage) / 100;
      const annualCoGS = monthlyCoGS * 12;

      // Other monthly expenses
      const totalOtherMonthlyExpenses = rent + staffCosts + otherExpenses;
      const totalMonthlyExpenses = monthlyCoGS + totalOtherMonthlyExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerSqm = totalRevenueWithExtras / shopArea;
      const avgDailyRevenue = totalMonthlyRevenue / 30;
      const peakToRegularRatio = (peakDailyRevenue / regularDailyRevenue);

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🌸 Бізнес-план квіткового магазину</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🛍️ Середній дохід', formatNumber(avgDailyRevenue), 'За день', 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Обладнання та ремонт</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Холодильне обладнання</span>
                  <span>${formatNumber(refrigerationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий асортимент</span>
                  <span>${formatNumber(initialInventory)}</span>
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
                  <span>Звичайні дні (${regularDays} днів × $${regularDailyRevenue.toFixed(0)})</span>
                  <span>${formatNumber(monthlyRegularRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Святкові дні (${peakDays} днів × $${peakDailyRevenue.toFixed(0)})</span>
                  <span>${formatNumber(monthlyPeakRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги (доставка, оформлення)</span>
                  <span>${formatNumber(additionalServices / 12)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний місячний дохід</strong></span>
                  <span><strong>${formatNumber(avgMonthlyRevenueWithExtras)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Закупівля товару (${cogsPercentage}% від виручки)</span>
                  <span>${formatNumber(monthlyCoGS)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Оренда приміщення</span>
                  <span>${formatNumber(rent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Персонал (флорист, продавець)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні та інші витрати</span>
                  <span>${formatNumber(otherExpenses)}</span>
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
              <h6>📏 Ефективність площі</h6>
              <div class="metric-subtitle">
                Дохід на м²: <strong>${formatNumber(revenuePerSqm)}/рік</strong><br>
                Площа магазину: <strong>${shopArea} м²</strong><br>
                Середній чек: <strong>${formatNumber(avgTicket)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Сезонний аналіз</h6>
              <div class="metric-subtitle">
                Звичайний день: <strong>${formatNumber(regularDailyRevenue)}</strong><br>
                Святковий день: <strong>${formatNumber(peakDailyRevenue)}</strong><br>
                Коефіцієнт піку: <strong>${peakMultiplier.toFixed(1)}x</strong>
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
              <h6>💡 Операційні показники</h6>
              <div class="metric-subtitle">
                Покупців на день: <strong>${dailyCustomers} чол.</strong><br>
                Піковий днів/місяць: <strong>${peakDays} днів</strong><br>
                Валова маржа: <strong>${formatPercent(100 - cogsPercentage)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Низька рентабельність. Розгляньте зниження частки закупівель або підвищення цін.</li>' : ''}
              ${avgTicket < 20 ? '<li>💰 Низький середній чек. Пропонуйте додаткові товари та послуги.</li>' : ''}
              ${paybackYears > 3 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште прохідність.</li>' : ''}
              ${peakMultiplier < 3 ? '<li>📈 Низький коефіцієнт піку. Активніше рекламуйте святкові акції.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Відмінна рентабельність! Розгляньте відкриття додаткових точок.</li>' : ''}
              <li>🌹 Спеціалізуйтеся на весільній флористиці для збільшення середнього чеку.</li>
              <li>📱 Розвивайте інтернет-магазин та доставку для розширення клієнтської бази.</li>
              <li>🎨 Пропонуйте флористичні майстер-класи як додатковий дохід.</li>
              <li>🤝 Співпрацюйте з ресторанами, готелями та організаторами весіль.</li>
              <li>📊 Ведіть точний облік втрат товару та оптимізуйте закупівлі.</li>
              <li>⭐ Створюйте унікальні композиції для відмінності від конкурентів.</li>
              <li>🎁 Додайте супутні товари: листівки, упаковка, невеликі подарунки.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.flowerShopBusinessData = {
        'Площа магазину (м²)': shopArea,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': totalRevenueWithExtras,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Середній чек ($)': avgTicket,
        'Покупців на день': dailyCustomers,
        'Дохід на м² ($)': revenuePerSqm
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.flowerShopBusinessData) return;
    
    const csv = Object.entries(window.flowerShopBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-flower-shop.csv';
    link.click();
  };
});