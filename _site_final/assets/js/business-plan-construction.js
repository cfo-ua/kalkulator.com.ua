document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('construction-form');
  const result = document.getElementById('construction-result');

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

      const companyType = document.getElementById('company-type').value;
      const initialEmployees = parseInt(document.getElementById('initial-employees').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const officeCost = parseFloat(document.getElementById('office-cost').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const avgProjectValue = parseFloat(document.getElementById('avg-project-value').value);
      const profitMargin = parseFloat(document.getElementById('profit-margin').value);
      const highSeasonProjects = parseFloat(document.getElementById('high-season-projects').value);
      const lowSeasonProjects = parseFloat(document.getElementById('low-season-projects').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const rentCosts = parseFloat(document.getElementById('rent-costs').value);
      const transportCosts = parseFloat(document.getElementById('transport-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (initialEmployees <= 0 || avgProjectValue <= 0 || profitMargin <= 0 || highSeasonProjects <= 0 || lowSeasonProjects <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + officeCost + workingCapital;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;

      // Monthly revenue calculations
      const highSeasonMonthlyRevenue = highSeasonProjects * avgProjectValue;
      const lowSeasonMonthlyRevenue = lowSeasonProjects * avgProjectValue;
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Profit calculations based on margin
      const profitMarginDecimal = profitMargin / 100;
      const highSeasonMonthlyProfit = highSeasonMonthlyRevenue * profitMarginDecimal;
      const lowSeasonMonthlyProfit = lowSeasonMonthlyRevenue * profitMarginDecimal;
      const annualGrossProfit = totalAnnualRevenue * profitMarginDecimal;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + rentCosts + transportCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Net profit calculations
      const annualNetProfit = annualGrossProfit - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const netProfitMargin = (annualNetProfit / totalAnnualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerEmployee = totalAnnualRevenue / initialEmployees;
      const profitPerEmployee = annualNetProfit / initialEmployees;
      const avgProjectsPerMonth = ((highSeasonProjects * highSeasonMonths) + (lowSeasonProjects * lowSeasonMonths)) / 12;
      const profitPerProject = (annualGrossProfit / 12) / avgProjectsPerMonth;

      // Company type specific factors
      const companyTypeNames = {
        'small-renovation': 'Невелика ремонтна компанія',
        'residential': 'Житлове будівництво',
        'commercial': 'Комерційне будівництво',
        'general-contractor': 'Генеральний підрядник'
      };

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (netProfitMargin > 20) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      let efficiencyType = 'info';
      if (revenuePerEmployee < 50000) efficiencyType = 'warning';
      else if (revenuePerEmployee > 150000) efficiencyType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏗️ Бізнес-план будівельної компанії</h3>
          <div class="company-type-indicator">
            <span class="company-type-badge">${companyTypeNames[companyType]}</span>
          </div>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Чиста маржа: ${formatPercent(netProfitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('👥 Дохід на працівника', formatNumber(revenuePerEmployee), 'Ефективність персоналу', efficiencyType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Обладнання та техніка</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Офіс та склади</span>
                  <span>${formatNumber(officeCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії та оборотний капітал</span>
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
                  <span>Високий сезон (${highSeasonMonths} міс. × ${highSeasonProjects} проектів)</span>
                  <span>${formatNumber(highSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Низький сезон (${lowSeasonMonths} міс. × ${lowSeasonProjects} проектів)</span>
                  <span>${formatNumber(lowSeasonAnnualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Валовий прибуток (маржа ${formatPercent(profitMargin)})</span>
                  <span>${formatNumber(annualGrossProfit)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний річний оборот</strong></span>
                  <span><strong>${formatNumber(totalAnnualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Заробітна плата персоналу (${initialEmployees} осіб)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Оренда офісу та складів</span>
                  <span>${formatNumber(rentCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Транспорт та обслуговування техніки</span>
                  <span>${formatNumber(transportCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Інші операційні витрати</span>
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
              <h6>📊 Ефективність проектів</h6>
              <div class="metric-subtitle">
                Середня вартість проекту: <strong>${formatNumber(avgProjectValue)}</strong><br>
                Прибуток з проекту: <strong>${formatNumber(profitPerProject)}</strong><br>
                Проектів на місяць: <strong>${avgProjectsPerMonth.toFixed(1)} шт</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Сезонний аналіз</h6>
              <div class="metric-subtitle">
                Високий сезон: <strong>${formatNumber(highSeasonMonthlyRevenue)}/міс</strong><br>
                Низький сезон: <strong>${formatNumber(lowSeasonMonthlyRevenue)}/міс</strong><br>
                Різниця: <strong>${formatPercent(((highSeasonMonthlyRevenue - lowSeasonMonthlyRevenue) / lowSeasonMonthlyRevenue) * 100)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Прогноз прибутковості</h6>
              <div class="metric-subtitle">
                Річний чистий прибуток: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Щотижневий прибуток: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Прибуток на працівника: <strong>${formatNumber(profitPerEmployee)}/рік</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>🎯 Потенціал росту</h6>
              <div class="metric-subtitle">
                При +1 проект/міс: <strong>+${formatNumber(avgProjectValue * profitMarginDecimal * 12)}/рік</strong><br>
                При +5% маржі: <strong>+${formatNumber(totalAnnualRevenue * 0.05)}/рік</strong><br>
                При збільшенні команди на 50%: <strong>потенціал +${formatPercent(50)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${netProfitMargin < 15 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення маржі або зниження витрат.</li>' : ''}
              ${revenuePerEmployee < 75000 ? '<li>📍 Низька продуктивність. Покращте ефективність роботи або підвищте ціни.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або підвищте прибутковість.</li>' : ''}
              ${avgProjectsPerMonth < 2 ? '<li>📈 Мало проектів. Активізуйте маркетинг та пошук клієнтів.</li>' : ''}
              ${netProfitMargin > 25 ? '<li>🎉 Відмінна рентабельність! Розгляньте розширення бізнесу.</li>' : ''}
              <li>🏆 Спеціалізуйтесь на прибуткових нішах: елітне житло, комерційна нерухомість.</li>
              <li>📊 Впровадьте CRM-систему для управління проектами та клієнтами.</li>
              <li>🤝 Розвивайте довгострокові партнерства з постачальниками матеріалів.</li>
              <li>⭐ Інвестуйте в репутацію: портфоліо робіт, відгуки клієнтів, сертифікації.</li>
              <li>💡 Освойте нові технології: BIM-моделювання, енергоефективні рішення.</li>
              <li>📈 Диверсифікуйте послуги: проектування, дизайн, сервісне обслуговування.</li>
              <li>🎯 Участь у державних тендерах для стабільного завантаження.</li>
              <li>🏗️ Інвестуйте в сучасне обладнання для підвищення продуктивності.</li>
              <li>📚 Постійно навчайте персонал новим технологіям та стандартам.</li>
              <li>💰 Створіть резервний фонд для покриття сезонних коливань.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.constructionBusinessData = {
        'Тип компанії': companyTypeNames[companyType],
        'Кількість працівників': initialEmployees,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний оборот ($)': totalAnnualRevenue,
        'Валовий прибуток ($)': annualGrossProfit,
        'Річні витрати ($)': annualExpenses,
        'Річний чистий прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Валова маржа (%)': profitMargin,
        'Чиста маржа (%)': netProfitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Дохід на працівника ($)': revenuePerEmployee,
        'Прибуток на працівника ($)': profitPerEmployee,
        'Середня вартість проекту ($)': avgProjectValue,
        'Проектів на місяць': avgProjectsPerMonth
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.constructionBusinessData) return;
    
    const csv = Object.entries(window.constructionBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-budivnictvo.csv';
    link.click();
  };
});