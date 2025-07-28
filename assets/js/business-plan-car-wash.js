document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('carwash-form');
  const result = document.getElementById('carwash-result');

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

      const washType = document.getElementById('wash-type').value;
      const washBays = parseInt(document.getElementById('wash-bays').value);
      const landCost = parseFloat(document.getElementById('land-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const avgServicePrice = parseFloat(document.getElementById('avg-service-price').value);
      const highSeasonCars = parseFloat(document.getElementById('high-season-cars').value);
      const lowSeasonCars = parseFloat(document.getElementById('low-season-cars').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (washBays <= 0 || avgServicePrice <= 0 || highSeasonCars <= 0 || lowSeasonCars <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = landCost + equipmentCost + additionalCosts;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;
      const daysInMonth = 30;

      // Monthly revenue calculations
      const highSeasonMonthlyRevenue = highSeasonCars * avgServicePrice * daysInMonth;
      const lowSeasonMonthlyRevenue = lowSeasonCars * avgServicePrice * daysInMonth;
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Additional revenue streams (estimated based on car wash type)
      let additionalRevenueRate = 0.08; // 8% default
      if (washType === 'manual') additionalRevenueRate = 0.15; // 15% for manual (detailing, etc.)
      if (washType === 'tunnel') additionalRevenueRate = 0.12; // 12% for tunnel (upsells)
      if (washType === 'touchless') additionalRevenueRate = 0.10; // 10% for touchless
      
      const additionalRevenue = totalAnnualRevenue * additionalRevenueRate;
      const totalRevenueWithExtras = totalAnnualRevenue + additionalRevenue;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + utilities + supplies + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerBay = totalRevenueWithExtras / washBays;
      const avgCarsPerDay = ((highSeasonCars * highSeasonMonths) + (lowSeasonCars * lowSeasonMonths)) / 12;
      const revenuePerCar = avgMonthlyRevenueWithExtras / (avgCarsPerDay * daysInMonth);
      const maxPotentialRevenue = Math.max(highSeasonCars, lowSeasonCars) * avgServicePrice * daysInMonth * 12;
      const capacityUtilization = (totalAnnualRevenue / maxPotentialRevenue) * 100;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      let utilizationType = 'info';
      if (capacityUtilization < 60) utilizationType = 'warning';
      else if (capacityUtilization > 80) utilizationType = 'success';

      // Wash type specific insights
      const washTypeNames = {
        'self-service': 'Self-service',
        'manual': 'Ручна мийка',
        'tunnel': 'Тунельна мийка',
        'touchless': 'Безконтактна мийка'
      };

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🚗 Бізнес-план автомийки</h3>
          <div class="wash-type-indicator">
            <span class="wash-type-badge">${washTypeNames[washType]}</span>
          </div>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🎯 Завантаженість', formatPercent(capacityUtilization), 'Використання потужності', utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Земля/оренда приміщення</span>
                  <span>${formatNumber(landCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання та облаштування</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії, дозволи та підключення</span>
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
                  <span>Високий сезон (${highSeasonMonths} міс. × ${highSeasonCars} авто/день)</span>
                  <span>${formatNumber(highSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Низький сезон (${lowSeasonMonths} міс. × ${lowSeasonCars} авто/день)</span>
                  <span>${formatNumber(lowSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги (детейлінг, хімчистка)</span>
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
                  <span>Персонал (мийщики, адміністратор)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні послуги (вода, електрика)</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Витратні матеріали (шампуні, віск)</span>
                  <span>${formatNumber(supplies)}</span>
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
              <h6>🔄 Ефективність боксів</h6>
              <div class="metric-subtitle">
                Дохід на бокс: <strong>${formatNumber(revenuePerBay)}/рік</strong><br>
                Середня ціна: <strong>${formatNumber(avgServicePrice)}/авто</strong><br>
                Авто на день: <strong>${avgCarsPerDay.toFixed(0)} шт</strong>
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
                Резерв росту: <strong>${formatPercent(100 - capacityUtilization)}</strong><br>
                При повній завантаженості: <strong>+${formatNumber(maxPotentialRevenue - totalAnnualRevenue)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження витрат.</li>' : ''}
              ${capacityUtilization < 60 ? '<li>📍 Низька завантаженість. Покращте маркетинг або розширте послуги.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або підвищте доходи.</li>' : ''}
              ${capacityUtilization > 85 ? '<li>✅ Висока завантаженість! Розгляньте підвищення цін або розширення.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових точок.</li>' : ''}
              <li>🧽 Впровадьте додаткові послуги: детейлінг, хімчистка салону, воскування.</li>
              <li>📱 Запустіть мобільний додаток для бронювання та безготівкової оплати.</li>
              <li>🎯 Впровадьте програму лояльності для регулярних клієнтів.</li>
              <li>⏰ Оптимізуйте години роботи відповідно до пікових навантажень.</li>
              <li>🤝 Налагодьте корпоративні договори з таксі та логістичними компаніями.</li>
              <li>⭐ Інвестуйте в якість обслуговування для покращення відгуків клієнтів.</li>
              <li>🌱 Розгляньте екологічні технології для залучення свідомих клієнтів.</li>
              <li>📊 Впровадьте систему аналітики для оптимізації завантаженості боксів.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.carwashBusinessData = {
        'Тип автомийки': washTypeNames[washType],
        'Кількість боксів': washBays,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': totalRevenueWithExtras,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Завантаженість (%)': capacityUtilization,
        'Дохід на бокс ($)': revenuePerBay,
        'Середня ціна за послугу ($)': avgServicePrice,
        'Середня кількість авто/день': avgCarsPerDay
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.carwashBusinessData) return;
    
    const csv = Object.entries(window.carwashBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-avtomyika.csv';
    link.click();
  };
});