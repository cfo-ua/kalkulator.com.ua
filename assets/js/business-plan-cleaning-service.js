document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('cleaning-form');
  const result = document.getElementById('cleaning-result');

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

      const initialStaff = parseInt(document.getElementById('initial-staff').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const vehicleCost = parseFloat(document.getElementById('vehicle-cost').value);
      const suppliesCost = parseFloat(document.getElementById('supplies-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const regularClients = parseInt(document.getElementById('regular-clients').value);
      const hourlyRate = parseFloat(document.getElementById('hourly-rate').value);
      const hoursPerClient = parseFloat(document.getElementById('hours-per-client').value);
      const serviceFrequency = parseInt(document.getElementById('service-frequency').value);
      const oneTimeJobs = parseInt(document.getElementById('one-time-jobs').value);
      const staffWages = parseFloat(document.getElementById('staff-wages').value);
      const monthlySupplies = parseFloat(document.getElementById('monthly-supplies').value);
      const transportCosts = parseFloat(document.getElementById('transport-costs').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (regularClients <= 0 || hourlyRate <= 0 || hoursPerClient <= 0 || serviceFrequency <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + vehicleCost + suppliesCost + additionalCosts;

      // Revenue calculations
      const monthlyHoursPerClient = hoursPerClient * serviceFrequency;
      const regularClientsRevenue = regularClients * monthlyHoursPerClient * hourlyRate;
      
      // One-time jobs revenue (higher rate, typically 1.2x)
      const oneTimeRate = hourlyRate * 1.2;
      const oneTimeRevenue = oneTimeJobs * hoursPerClient * oneTimeRate;
      
      // Total monthly revenue
      const totalMonthlyRevenue = regularClientsRevenue + oneTimeRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffWages + monthlySupplies + transportCosts + marketingCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const paybackMonths = paybackYears * 12;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Cleaning business specific metrics
      const totalMonthlyHours = (regularClients * monthlyHoursPerClient) + (oneTimeJobs * hoursPerClient);
      const revenuePerHour = totalMonthlyRevenue / totalMonthlyHours;
      const hoursPerStaff = totalMonthlyHours / initialStaff;
      const revenuePerClient = regularClientsRevenue / regularClients;
      const clientAcquisitionCost = marketingCosts / (regularClients * 0.1); // 10% new clients monthly
      
      // Efficiency metrics
      const laborCostPercentage = (staffWages / totalMonthlyRevenue) * 100;
      const suppliesCostPercentage = (monthlySupplies / totalMonthlyRevenue) * 100;
      const hoursPerDay = totalMonthlyHours / 22; // 22 working days
      
      // Growth potential
      const maxCapacityHours = initialStaff * 8 * 22; // 8 hours per day, 22 days
      const capacityUtilization = (totalMonthlyHours / maxCapacityHours) * 100;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 40) roiType = 'warning';
      else if (annualROI > 80) roiType = 'success';

      let utilizationType = 'info';
      if (capacityUtilization < 50) utilizationType = 'warning';
      else if (capacityUtilization > 80) utilizationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🧹 Бізнес-план клінінгової компанії</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackMonths.toFixed(0)} місяців`, `ROI: ${formatPercent(annualROI)}`, paybackMonths <= 12 ? 'success' : 'warning')}
            ${createInsightCard('👥 Завантаженість', formatPercent(capacityUtilization), `${totalMonthlyHours.toFixed(0)} годин/міс`, utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Обладнання та інструменти</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Транспорт</span>
                  <span>${formatNumber(vehicleCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початкові витратні матеріали</span>
                  <span>${formatNumber(suppliesCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові витрати</span>
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
                  <span>Регулярні клієнти (${regularClients} × ${monthlyHoursPerClient.toFixed(1)} год)</span>
                  <span>${formatNumber(regularClientsRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Разові замовлення (${oneTimeJobs} замовлень)</span>
                  <span>${formatNumber(oneTimeRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний щомісячний дохід</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Зарплати співробітників (${initialStaff} осіб)</span>
                  <span>${formatNumber(staffWages)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Витратні матеріали та хімія</span>
                  <span>${formatNumber(monthlySupplies)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Паливо та транспортні витрати</span>
                  <span>${formatNumber(transportCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та реклама</span>
                  <span>${formatNumber(marketingCosts)}</span>
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
              <h6>⏰ Ефективність роботи</h6>
              <div class="metric-subtitle">
                Дохід за годину: <strong>${formatNumber(revenuePerHour)}</strong><br>
                Годин на співробітника: <strong>${hoursPerStaff.toFixed(0)}/міс</strong><br>
                Робочих годин на день: <strong>${hoursPerDay.toFixed(1)}</strong>
              </div>
            </div>
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>👥 Клієнтські метрики</h6>
              <div class="metric-subtitle">
                Дохід з клієнта: <strong>${formatNumber(revenuePerClient)}/міс</strong><br>
                Вартість залучення: <strong>${formatNumber(clientAcquisitionCost)}</strong><br>
                Середня погодинна ставка: <strong>${formatNumber(hourlyRate)}</strong>
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
              <h6>📊 Структура витрат</h6>
              <div class="metric-subtitle">
                Зарплати: <strong>${formatPercent(laborCostPercentage)}</strong> від доходу<br>
                Матеріали: <strong>${formatPercent(suppliesCostPercentage)}</strong> від доходу<br>
                Максимальна місткість: <strong>${maxCapacityHours} годин/міс</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення тарифів або оптимізацію витрат.</li>' : ''}
              ${capacityUtilization < 50 ? '<li>📍 Низька завантаженість. Активізуйте маркетинг для залучення клієнтів.</li>' : ''}
              ${paybackMonths > 18 ? '<li>⏰ Довгий термін окупності. Збільште кількість клієнтів або підвищте ціни.</li>' : ''}
              ${capacityUtilization > 85 ? '<li>✅ Висока завантаженість! Розгляньте найм додаткових співробітників.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Відмінна рентабельність! Можете розглянути розширення команди.</li>' : ''}
              <li>🎯 Фокусуйтесь на регулярних клієнтах - вони дають стабільний дохід.</li>
              <li>📱 Створіть сайт та профілі в соціальних мережах для залучення клієнтів.</li>
              <li>⭐ Збирайте відгуки та рекомендації для підвищення довіри.</li>
              <li>🚗 Оптимізуйте маршрути для зниження транспортних витрат.</li>
              <li>💰 Впровадьте систему знижок для довгострокових клієнтів.</li>
              <li>🧽 Інвестуйте в якісне обладнання для підвищення ефективності.</li>
              <li>📋 Використовуйте чек-листи для забезпечення якості послуг.</li>
              <li>🤝 Розвивайте партнерства з управляючими компаніями.</li>
              <li>📈 Додайте спеціалізовані послуги: миття вікон, хімчистка меблів.</li>
              <li>💡 Навчайте персонал для підвищення якості та швидкості роботи.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.cleaningBusinessData = {
        'Кількість співробітників': initialStaff,
        'Регулярних клієнтів': regularClients,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalMonthlyRevenue,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (місяців)': paybackMonths,
        'Дохід за годину ($)': revenuePerHour,
        'Завантаженість (%)': capacityUtilization,
        'Робочих годин на місяць': totalMonthlyHours,
        'Дохід з клієнта ($)': revenuePerClient
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.cleaningBusinessData) return;
    
    const csv = Object.entries(window.cleaningBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-klinings.csv';
    link.click();
  };
});