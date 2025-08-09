document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('pet-grooming-form');
  const result = document.getElementById('pet-grooming-result');

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

      const workstations = parseInt(document.getElementById('workstations').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const avgServicePrice = parseFloat(document.getElementById('avg-service-price').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const insurance = parseFloat(document.getElementById('insurance').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (workstations <= 0 || clientsPerDay <= 0 || avgServicePrice <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + renovationCost + additionalCosts;

      // Monthly revenue calculations
      const monthlyClients = clientsPerDay * workingDays;
      const totalMonthlyRevenue = monthlyClients * avgServicePrice;

      // Additional revenue streams (estimated)
      const retailRevenue = totalMonthlyRevenue * 0.15; // 15% from retail products
      const totalRevenueWithRetail = totalMonthlyRevenue + retailRevenue;

      // Monthly expenses
      const totalMonthlyExpenses = monthlyRent + staffSalaries + supplies + insurance + otherExpenses;
      
      // Profit calculations
      const monthlyNetProfit = totalRevenueWithRetail - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalRevenueWithRetail) * 100;
      
      // ROI and payback calculations
      const paybackMonths = totalStartupCost / monthlyNetProfit;
      const paybackYears = paybackMonths / 12;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerStation = totalRevenueWithRetail / workstations;
      const clientsPerStation = monthlyClients / workstations;
      const avgRevenuePerClient = totalRevenueWithRetail / monthlyClients;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      // Market capacity analysis
      const maxCapacityPerDay = workstations * 4; // 4 pets per station per day max
      const utilizationRate = (clientsPerDay / maxCapacityPerDay) * 100;

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🐕 Бізнес-план груммінг-салону</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `${paybackMonths.toFixed(0)} місяців`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🎯 ROI на рік', formatPercent(annualROI), 'Рентабельність інвестицій', roiType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Обладнання для груммінгу</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ремонт та обладнання приміщення</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії, дозволи та початковий капітал</span>
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
                  <span>Груммінг послуги (${Math.round(monthlyClients)} клієнтів × $${avgServicePrice})</span>
                  <span>${formatNumber(totalMonthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Роздрібна торгівля (товари для тварин)</span>
                  <span>${formatNumber(retailRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний дохід</strong></span>
                  <span><strong>${formatNumber(totalRevenueWithRetail)}</strong></span>
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
                  <span>Зарплати персоналу</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Витратні матеріали</span>
                  <span>${formatNumber(supplies)}</span>
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
              <h6>🔄 Ефективність роботи</h6>
              <div class="metric-subtitle">
                Дохід на робоче місце: <strong>${formatNumber(revenuePerStation)}/міс</strong><br>
                Клієнтів на робоче місце: <strong>${Math.round(clientsPerStation)}/міс</strong><br>
                Середній чек: <strong>${formatNumber(avgRevenuePerClient)}</strong>
              </div>
            </div>
            <div class="insight-card ${utilizationRate > 70 ? 'success' : utilizationRate < 40 ? 'warning' : 'info'}">
              <h6>📊 Завантаженість салону</h6>
              <div class="metric-subtitle">
                Поточна завантаженість: <strong>${formatPercent(utilizationRate)}</strong><br>
                Максимальна ємність: <strong>${maxCapacityPerDay} клієнтів/день</strong><br>
                Можливість росту: <strong>${formatPercent(100 - utilizationRate)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Прогноз прибутковості</h6>
              <div class="metric-subtitle">
                Річний прибуток: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Щотижневий прибуток: <strong>${formatNumber(monthlyNetProfit * 12 / 52)}</strong><br>
                Щоденний прибуток: <strong>${formatNumber(monthlyNetProfit / 30)}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>💡 Потенціал розширення</h6>
              <div class="metric-subtitle">
                Додаткові послуги: <strong>+15-25% доходу</strong><br>
                Мобільний груммінг: <strong>+30-50% до ціни</strong><br>
                Корпоративні клієнти: <strong>стабільний дохід</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження витрат.</li>' : ''}
              ${utilizationRate < 40 ? '<li>📍 Низька завантаженість. Покращте маркетинг або додайте послуги.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати.</li>' : ''}
              ${utilizationRate > 80 ? '<li>✅ Висока завантаженість! Розгляньте розширення або підвищення цін.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових салонів.</li>' : ''}
              <li>🛍️ Додайте роздрібну торгівлю товарами для тварин (корми, іграшки, аксесуари).</li>
              <li>📱 Впровадьте онлайн-запис та нагадування для покращення обслуговування.</li>
              <li>🎓 Інвестуйте в навчання персоналу для підвищення якості послуг.</li>
              <li>🚗 Розгляньте мобільний груммінг для преміальних клієнтів.</li>
              <li>🏥 Партнерство з ветклініками для комплексного обслуговування.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.groomingBusinessData = {
        'Робочих місць': workstations,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalRevenueWithRetail,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Клієнтів на місяць': monthlyClients,
        'Середній чек ($)': avgRevenuePerClient,
        'Завантаженість (%)': utilizationRate
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.groomingBusinessData) return;
    
    const csv = Object.entries(window.groomingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-gromming.csv';
    link.click();
  };
});