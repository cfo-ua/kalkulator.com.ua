document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bnb-form');
  const result = document.getElementById('bnb-result');

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

      const rooms = parseInt(document.getElementById('rooms').value);
      const propertyCost = parseFloat(document.getElementById('property-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const avgNightlyRate = parseFloat(document.getElementById('avg-nightly-rate').value);
      const highSeasonOccupancy = parseFloat(document.getElementById('high-season-occupancy').value);
      const lowSeasonOccupancy = parseFloat(document.getElementById('low-season-occupancy').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const marketing = parseFloat(document.getElementById('marketing').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (rooms <= 0 || avgNightlyRate <= 0 || highSeasonOccupancy <= 0 || lowSeasonOccupancy <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = propertyCost + renovationCost + additionalCosts;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;
      const highSeasonOccupancyRate = highSeasonOccupancy / 100;
      const lowSeasonOccupancyRate = lowSeasonOccupancy / 100;

      // Monthly revenue calculations
      const daysInMonth = 30;
      const highSeasonRoomNights = rooms * daysInMonth * highSeasonOccupancyRate;
      const lowSeasonRoomNights = rooms * daysInMonth * lowSeasonOccupancyRate;
      
      const highSeasonMonthlyRevenue = highSeasonRoomNights * avgNightlyRate;
      const lowSeasonMonthlyRevenue = lowSeasonRoomNights * avgNightlyRate;
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Additional revenue streams (estimated)
      const additionalRevenue = totalAnnualRevenue * 0.12; // 12% from breakfast, services
      const totalRevenueWithExtras = totalAnnualRevenue + additionalRevenue;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + utilities + marketing + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerRoom = totalRevenueWithExtras / rooms;
      const avgOccupancyRate = ((highSeasonOccupancyRate * highSeasonMonths) + (lowSeasonOccupancyRate * lowSeasonMonths)) / 12;
      const maxPotentialRevenue = rooms * daysInMonth * 12 * avgNightlyRate;
      const revenueEfficiency = (totalAnnualRevenue / maxPotentialRevenue) * 100;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 15) roiType = 'warning';
      else if (annualROI > 25) roiType = 'success';

      let occupancyType = 'info';
      if (avgOccupancyRate < 0.5) occupancyType = 'warning';
      else if (avgOccupancyRate > 0.7) occupancyType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏨 Бізнес-план Bed & Breakfast</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 5 ? 'success' : 'warning')}
            ${createInsightCard('🛏️ Заповнюваність', formatPercent(avgOccupancyRate * 100), 'Середня за рік', occupancyType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Нерухомість (купівля/застава)</span>
                  <span>${formatNumber(propertyCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ремонт та меблювання</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії, дозволи та обладнання</span>
                  <span>${formatNumber(additionalCosts)}</span>
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
                  <span>Високий сезон (${highSeasonMonths} міс. × ${formatPercent(highSeasonOccupancy)})</span>
                  <span>${formatNumber(highSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Низький сезон (${lowSeasonMonths} міс. × ${formatPercent(lowSeasonOccupancy)})</span>
                  <span>${formatNumber(lowSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги (сніданки, трансфер)</span>
                  <span>${formatNumber(additionalRevenue)}</span>
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
                  <span>Персонал (прибирання, адміністрація)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні послуги</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та комісії платформ</span>
                  <span>${formatNumber(marketing)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Інші витрати</span>
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
              <h6>🔄 Ефективність номерів</h6>
              <div class="metric-subtitle">
                Дохід на номер: <strong>${formatNumber(revenuePerRoom)}/рік</strong><br>
                Середня ціна: <strong>${formatNumber(avgNightlyRate)}/ніч</strong><br>
                Ефективність заповнення: <strong>${formatPercent(revenueEfficiency)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Сезонний аналіз</h6>
              <div class="metric-subtitle">
                Високий сезон: <strong>${formatNumber(highSeasonMonthlyRevenue)}/міс</strong><br>
                Низький сезон: <strong>${formatNumber(lowSeasonMonthlyRevenue)}/міс</strong><br>
                Різниця: <strong>${formatPercent(((highSeasonMonthlyRevenue - lowSeasonMonthlyRevenue) / lowSeasonMonthlyRevenue) * 100)}</strong>
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
              <h6>💡 Потенціал росту</h6>
              <div class="metric-subtitle">
                Максимальний дохід: <strong>${formatNumber(maxPotentialRevenue)}/рік</strong><br>
                Резерв росту: <strong>${formatPercent(100 - revenueEfficiency)}</strong><br>
                При 100% заповненості: <strong>+${formatNumber(maxPotentialRevenue - totalAnnualRevenue)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження витрат.</li>' : ''}
              ${avgOccupancyRate < 0.5 ? '<li>📍 Низька заповнюваність. Покращте маркетинг або знизьте ціни.</li>' : ''}
              ${paybackYears > 6 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або підвищте доходи.</li>' : ''}
              ${avgOccupancyRate > 0.8 ? '<li>✅ Висока заповнюваність! Розгляньте підвищення цін або розширення.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових об\'єктів.</li>' : ''}
              <li>🍳 Додайте послуги сніданків та вечерь для збільшення доходу на 15-25%.</li>
              <li>📱 Оптимізуйте присутність на Booking.com, AirBnB та власному сайті.</li>
              <li>🎯 Впровадьте динамічне ціноутворення залежно від сезону та попиту.</li>
              <li>🚗 Розгляньте додаткові послуги: трансфер, екскурсії, прання.</li>
              <li>🤝 Партнерство з туроператорами та корпоративними клієнтами.</li>
              <li>⭐ Інвестуйте в покращення відгуків гостей для підвищення рейтингу.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.bnbBusinessData = {
        'Кількість номерів': rooms,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': totalRevenueWithExtras,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Середня заповнюваність (%)': avgOccupancyRate * 100,
        'Дохід на номер ($)': revenuePerRoom,
        'Середня ціна за ніч ($)': avgNightlyRate
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.bnbBusinessData) return;
    
    const csv = Object.entries(window.bnbBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-bnb.csv';
    link.click();
  };
});