document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('travel-agency-form');
  const result = document.getElementById('travel-agency-result');

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

      const licensingCosts = parseFloat(document.getElementById('licensing-costs').value);
      const officeSetup = parseFloat(document.getElementById('office-setup').value);
      const equipmentSoftware = parseFloat(document.getElementById('equipment-software').value);
      const initialMarketing = parseFloat(document.getElementById('initial-marketing').value);
      const highSeasonClients = parseFloat(document.getElementById('high-season-clients').value);
      const lowSeasonClients = parseFloat(document.getElementById('low-season-clients').value);
      const averageTransaction = parseFloat(document.getElementById('average-transaction').value);
      const commissionRate = parseFloat(document.getElementById('commission-rate').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const officeRent = parseFloat(document.getElementById('office-rent').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const monthlyMarketing = parseFloat(document.getElementById('monthly-marketing').value);
      const utilitiesOther = parseFloat(document.getElementById('utilities-other').value);
      const visaServices = parseFloat(document.getElementById('visa-services').value);
      const insuranceServices = parseFloat(document.getElementById('insurance-services').value);

      if (highSeasonClients <= 0 || lowSeasonClients <= 0 || averageTransaction <= 0 || commissionRate <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = licensingCosts + officeSetup + equipmentSoftware + initialMarketing;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;
      const commissionDecimal = commissionRate / 100;

      // Monthly revenue calculations
      const highSeasonCommissionRevenue = highSeasonClients * averageTransaction * commissionDecimal;
      const lowSeasonCommissionRevenue = lowSeasonClients * averageTransaction * commissionDecimal;
      
      const highSeasonMonthlyRevenue = highSeasonCommissionRevenue + visaServices + insuranceServices;
      const lowSeasonMonthlyRevenue = lowSeasonCommissionRevenue + (visaServices * 0.6) + (insuranceServices * 0.7);
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Monthly expenses
      const totalMonthlyExpenses = officeRent + staffSalaries + monthlyMarketing + utilitiesOther;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalAnnualRevenue - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalAnnualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const avgClientsPerMonth = ((highSeasonClients * highSeasonMonths) + (lowSeasonClients * lowSeasonMonths)) / 12;
      const revenuePerClient = totalAnnualRevenue / (avgClientsPerMonth * 12);
      const totalClientsPerYear = avgClientsPerMonth * 12;
      const totalTourValue = totalClientsPerYear * averageTransaction;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let clientsType = 'info';
      if (avgClientsPerMonth < 20) clientsType = 'warning';
      else if (avgClientsPerMonth > 40) clientsType = 'success';

      let commissionType = 'info';
      if (commissionRate < 8) commissionType = 'warning';
      else if (commissionRate > 12) commissionType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>✈️ Бізнес-план туристичного агентства</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('👥 Клієнтів на місяць', `${avgClientsPerMonth.toFixed(0)}`, 'Середня кількість', clientsType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Ліцензування та дозволи</span>
                  <span>${formatNumber(licensingCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Офіс та ремонт</span>
                  <span>${formatNumber(officeSetup)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання та програмне забезпечення</span>
                  <span>${formatNumber(equipmentSoftware)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий маркетинг</span>
                  <span>${formatNumber(initialMarketing)}</span>
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
                  <span>Високий сезон (${highSeasonMonths} міс.) - комісійні</span>
                  <span>${formatNumber(highSeasonCommissionRevenue * highSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Низький сезон (${lowSeasonMonths} міс.) - комісійні</span>
                  <span>${formatNumber(lowSeasonCommissionRevenue * lowSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Віза-сервіс</span>
                  <span>${formatNumber((visaServices * highSeasonMonths) + (visaServices * 0.6 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row">
                  <span>Страхування</span>
                  <span>${formatNumber((insuranceServices * highSeasonMonths) + (insuranceServices * 0.7 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний річний дохід</strong></span>
                  <span><strong>${formatNumber(totalAnnualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Оренда офісу</span>
                  <span>${formatNumber(officeRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Зарплати персоналу</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та реклама</span>
                  <span>${formatNumber(monthlyMarketing)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні та інші витрати</span>
                  <span>${formatNumber(utilitiesOther)}</span>
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
              <h6>💼 Ефективність продажів</h6>
              <div class="metric-subtitle">
                Дохід на клієнта: <strong>${formatNumber(revenuePerClient)}</strong><br>
                Середній чек: <strong>${formatNumber(averageTransaction)}</strong><br>
                Комісійні: <strong>${formatPercent(commissionRate)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Сезонний аналіз</h6>
              <div class="metric-subtitle">
                Високий сезон: <strong>${formatNumber(highSeasonMonthlyRevenue)}/міс</strong><br>
                Низький сезон: <strong>${formatNumber(lowSeasonMonthlyRevenue)}/міс</strong><br>
                Сезонна різниця: <strong>${formatPercent(((highSeasonMonthlyRevenue - lowSeasonMonthlyRevenue) / lowSeasonMonthlyRevenue) * 100)}</strong>
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
              <h6>💡 Потенціал масштабування</h6>
              <div class="metric-subtitle">
                Клієнтів на рік: <strong>${totalClientsPerYear.toFixed(0)}</strong><br>
                Загальна вартість турів: <strong>${formatNumber(totalTourValue)}</strong><br>
                Потенціал росту: <strong>+50% клієнтів = +${formatNumber(totalAnnualRevenue * 0.5)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення комісійних або зниження витрат.</li>' : ''}
              ${avgClientsPerMonth < 25 ? '<li>👥 Мало клієнтів. Покращте маркетинг та розвивайте онлайн-присутність.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або підвищте продажі.</li>' : ''}
              ${commissionRate < 9 ? '<li>💰 Низькі комісійні. Переговоріть з партнерами або змініть спеціалізацію.</li>' : ''}
              ${avgClientsPerMonth > 50 ? '<li>✅ Висока клієнтська активність! Розгляньте розширення команди.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Відмінна рентабельність! Можете відкрити додатковий офіс.</li>' : ''}
              <li>🌐 Розвивайте онлайн-канали продажів для зниження витрат на оренду.</li>
              <li>📱 Впровадьте CRM-систему для управління клієнтською базою.</li>
              <li>🎯 Спеціалізуйтеся на високомаржинальних напрямках (VIP, корпоративний туризм).</li>
              <li>🤝 Розвивайте партнерства з готелями та авіакомпаніями.</li>
              <li>📈 Запустіть програми лояльності для постійних клієнтів.</li>
              <li>⭐ Активно використовуйте соціальні мережі для залучення клієнтів.</li>
              <li>🏆 Сертифікуйтеся як експерт по популярних напрямках.</li>
              <li>💳 Впровадьте розстрочку та гнучкі умови оплати.</li>
              <li>🎪 Організовуйте тематичні заходи та презентації турів.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.travelAgencyBusinessData = {
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': totalAnnualRevenue,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Клієнтів на місяць': avgClientsPerMonth,
        'Дохід на клієнта ($)': revenuePerClient,
        'Середній чек ($)': averageTransaction,
        'Комісійні (%)': commissionRate
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.travelAgencyBusinessData) return;
    
    const csv = Object.entries(window.travelAgencyBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-turagentstvo.csv';
    link.click();
  };
});