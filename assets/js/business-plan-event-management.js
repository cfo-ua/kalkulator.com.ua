document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('event-form');
  const result = document.getElementById('event-result');

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

      const eventManagers = parseInt(document.getElementById('event-managers').value);
      const officeSetup = parseFloat(document.getElementById('office-setup').value);
      const equipment = parseFloat(document.getElementById('equipment').value);
      const marketingWorkingCapital = parseFloat(document.getElementById('marketing-working-capital').value);
      const monthlyEvents = parseFloat(document.getElementById('monthly-events').value);
      const avgEventBudget = parseFloat(document.getElementById('avg-event-budget').value);
      const agencyMargin = parseFloat(document.getElementById('agency-margin').value);
      const managerCommission = parseFloat(document.getElementById('manager-commission').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const baseSalaries = parseFloat(document.getElementById('base-salaries').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherCosts = parseFloat(document.getElementById('other-costs').value);

      if (eventManagers <= 0 || monthlyEvents <= 0 || avgEventBudget <= 0 || agencyMargin <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = officeSetup + equipment + marketingWorkingCapital;

      // Revenue calculations
      const monthlyEventBudgets = monthlyEvents * avgEventBudget;
      const monthlyGrossMargin = (monthlyEventBudgets * agencyMargin) / 100;
      const managerCommissions = (monthlyGrossMargin * managerCommission) / 100;
      const monthlyNetMargin = monthlyGrossMargin - managerCommissions;
      
      // Annual calculations
      const annualEventBudgets = monthlyEventBudgets * 12;
      const annualGrossMargin = monthlyGrossMargin * 12;
      const annualNetMargin = monthlyNetMargin * 12;

      // Monthly expenses
      const totalFixedExpenses = monthlyRent + baseSalaries + marketingCosts + otherCosts;
      const totalMonthlyExpenses = totalFixedExpenses + managerCommissions;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = monthlyNetMargin - totalFixedExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (annualNetProfit / annualGrossMargin) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerManager = annualGrossMargin / eventManagers;
      const eventsPerManager = monthlyEvents / eventManagers;
      const avgMarginPerEvent = monthlyGrossMargin / monthlyEvents;
      const eventCapacityUtilization = (eventsPerManager / 5) * 100; // Assuming max 5 events per manager

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 30) roiType = 'warning';
      else if (annualROI > 60) roiType = 'success';

      let capacityType = 'info';
      if (eventCapacityUtilization < 60) capacityType = 'warning';
      else if (eventCapacityUtilization > 85) capacityType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🎉 Бізнес-план Event-агентства</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 1 ? 'success' : 'warning')}
            ${createInsightCard('📊 Завантаженість команди', formatPercent(eventCapacityUtilization), `${eventsPerManager.toFixed(1)} заходів/менеджер`, capacityType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Оренда та облаштування офісу</span>
                  <span>${formatNumber(officeSetup)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання (техніка, меблі)</span>
                  <span>${formatNumber(equipment)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий маркетинг та оборотні кошти</span>
                  <span>${formatNumber(marketingWorkingCapital)}</span>
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
                  <span>Загальний бюджет заходів (${monthlyEvents} × ${formatNumber(avgEventBudget)})</span>
                  <span>${formatNumber(monthlyEventBudgets)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Валова маржа агентства (${formatPercent(agencyMargin)})</span>
                  <span>${formatNumber(monthlyGrossMargin)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комісії менеджерів (${formatPercent(managerCommission)})</span>
                  <span>-${formatNumber(managerCommissions)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Чиста маржа агентства</strong></span>
                  <span><strong>${formatNumber(monthlyNetMargin)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Оренда офісу</span>
                  <span>${formatNumber(monthlyRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Базова зарплата персоналу</span>
                  <span>${formatNumber(baseSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та реклама</span>
                  <span>${formatNumber(marketingCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Інші витрати</span>
                  <span>${formatNumber(otherCosts)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальні фіксовані витрати</strong></span>
                  <span><strong>${formatNumber(totalFixedExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔄 Ефективність команди</h6>
              <div class="metric-subtitle">
                Дохід на менеджера: <strong>${formatNumber(revenuePerManager)}/рік</strong><br>
                Заходів на менеджера: <strong>${eventsPerManager.toFixed(1)}/місяць</strong><br>
                Маржа з заходу: <strong>${formatNumber(avgMarginPerEvent)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Аналіз проектів</h6>
              <div class="metric-subtitle">
                Середній бюджет заходу: <strong>${formatNumber(avgEventBudget)}</strong><br>
                Маржа агентства: <strong>${formatPercent(agencyMargin)}</strong><br>
                Комісія менеджера: <strong>${formatPercent(managerCommission)}</strong>
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
                При +1 захід/місяць: <strong>+${formatNumber(avgMarginPerEvent * 12 * (1 - managerCommission/100))}/рік</strong><br>
                При +$1000 до бюджету: <strong>+${formatNumber((1000 * agencyMargin / 100) * monthlyEvents * 12 * (1 - managerCommission/100))}/рік</strong><br>
                При +1 менеджер: <strong>+${formatNumber(revenuePerManager * (1 - managerCommission/100) - (baseSalaries * 12 / eventManagers))}/рік</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення маржі або зниження комісій менеджерів.</li>' : ''}
              ${eventCapacityUtilization < 60 ? '<li>📍 Низька завантаженість команди. Покращте маркетинг або наймайте менше менеджерів.</li>' : ''}
              ${paybackYears > 1.5 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште кількість проектів.</li>' : ''}
              ${eventCapacityUtilization > 90 ? '<li>✅ Висока завантаженість! Розгляньте розширення команди або підвищення цін.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових напрямків.</li>' : ''}
              <li>💼 Впровадьте CRM-систему для ефективного управління проектами та клієнтами.</li>
              <li>📱 Розвивайте онлайн-портфоліо та присутність у соціальних мережах.</li>
              <li>🎯 Спеціалізуйтеся на прибуткових нішах: корпоративні заходи, конференції.</li>
              <li>🤝 Налагоджуйте партнерство з майданчиками, кейтерингом, декораторами.</li>
              <li>📈 Впровадьте систему KPI для менеджерів: прибутковість проектів, задоволеність клієнтів.</li>
              <li>⭐ Інвестуйте в навчання команди новим трендам та технологіям.</li>
              <li>🎪 Розгляньте додаткові послуги: декор, кейтеринг, технічна підтримка.</li>
              <li>🌐 Впроваджуйте digital-рішення: онлайн заходи, мобільні додатки для учасників.</li>
              <li>💎 Створюйте преміум-пакети послуг для VIP-клієнтів.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.eventBusinessData = {
        'Кількість event-менеджерів': eventManagers,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячна валова маржа ($)': monthlyGrossMargin,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Заходів на місяць': monthlyEvents,
        'Заходів на менеджера': eventsPerManager,
        'Маржа агентства (%)': agencyMargin,
        'Середній бюджет заходу ($)': avgEventBudget,
        'Дохід на менеджера ($)': revenuePerManager
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.eventBusinessData) return;
    
    const csv = Object.entries(window.eventBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-event-agentstvo.csv';
    link.click();
  };
});