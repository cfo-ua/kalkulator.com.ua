document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('dental-practice-form');
  const result = document.getElementById('dental-practice-result');

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

      const dentalChairs = parseInt(document.getElementById('dental-chairs').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const patientsPerDay = parseInt(document.getElementById('patients-per-day').value);
      const avgVisitCost = parseFloat(document.getElementById('avg-visit-cost').value);
      const workingDays = parseInt(document.getElementById('working-days').value);
      const chairUtilization = parseFloat(document.getElementById('chair-utilization').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const materialsCost = parseFloat(document.getElementById('materials-cost').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (dentalChairs <= 0 || patientsPerDay <= 0 || avgVisitCost <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = equipmentCost + renovationCost + workingCapital;

      // Revenue calculations
      const utilizationRate = chairUtilization / 100;
      const effectivePatientsPerDay = patientsPerDay * utilizationRate;
      const dailyRevenue = dentalChairs * effectivePatientsPerDay * avgVisitCost;
      const monthlyRevenue = dailyRevenue * workingDays;
      const annualRevenue = monthlyRevenue * 12;

      // Additional revenue streams (estimated)
      const specialtyServices = annualRevenue * 0.15; // 15% from specialty procedures
      const totalRevenueWithExtras = annualRevenue + specialtyServices;
      const avgMonthlyRevenueWithExtras = totalRevenueWithExtras / 12;

      // Monthly expenses
      const totalMonthlyExpenses = staffSalaries + materialsCost + rent + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const annualNetProfit = totalRevenueWithExtras - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerChair = totalRevenueWithExtras / dentalChairs;
      const patientsPerMonth = dentalChairs * effectivePatientsPerDay * workingDays;
      const revenuePerPatient = avgMonthlyRevenueWithExtras / patientsPerMonth;

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 50) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let utilizationType = 'info';
      if (chairUtilization < 60) utilizationType = 'warning';
      else if (chairUtilization > 80) utilizationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🦷 Бізнес-план стоматологічної клініки</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🪑 Заповнюваність', formatPercent(chairUtilization), 'Крісел', utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Стоматологічне обладнання</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ремонт та облаштування</span>
                  <span>${formatNumber(renovationCost)}</span>
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
                  <span>Базові послуги (${Math.round(patientsPerMonth * 12)} пацієнтів/рік)</span>
                  <span>${formatNumber(annualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Спеціалізовані процедури (імплантація, ортодонтія)</span>
                  <span>${formatNumber(specialtyServices)}</span>
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
                  <span>Зарплати лікарів та персоналу</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Стоматологічні матеріали</span>
                  <span>${formatNumber(materialsCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Оренда приміщення</span>
                  <span>${formatNumber(rent)}</span>
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
              <h6>🏥 Операційні показники</h6>
              <div class="metric-subtitle">
                Крісел: <strong>${dentalChairs} шт.</strong><br>
                Пацієнтів/день: <strong>${Math.round(effectivePatientsPerDay)} на крісло</strong><br>
                Вартість прийому: <strong>${formatNumber(avgVisitCost)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Ефективність роботи</h6>
              <div class="metric-subtitle">
                Дохід на крісло: <strong>${formatNumber(revenuePerChair)}/рік</strong><br>
                Пацієнтів/місяць: <strong>${Math.round(patientsPerMonth)}</strong><br>
                Дохід на пацієнта: <strong>${formatNumber(revenuePerPatient)}</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📈 Прогноз прибутковості</h6>
              <div class="metric-subtitle">
                Річний прибуток: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Щотижневий прибуток: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Щоденний прибуток: <strong>${formatNumber(annualNetProfit / (workingDays * 12))}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>🎯 Потенціал росту</h6>
              <div class="metric-subtitle">
                Робочих днів: <strong>${workingDays}/місяць</strong><br>
                Можливих крісел: <strong>+${dentalChairs} (розширення)</strong><br>
                Резерв завантаження: <strong>${formatPercent(100 - chairUtilization)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 40 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення тарифів або зниження витрат.</li>' : ''}
              ${chairUtilization < 70 ? '<li>📅 Низька заповнюваність. Активніше залучайте пацієнтів через маркетинг.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште потік пацієнтів.</li>' : ''}
              ${avgVisitCost < 60 ? '<li>💰 Низька вартість прийому. Розширте спектр високомаржинальних послуг.</li>' : ''}
              ${profitMargin > 60 ? '<li>🎉 Відмінна рентабельність! Розгляньте відкриття додаткових крісел.</li>' : ''}
              <li>🦷 Додайте спеціалізовані послуги: імплантацію, ортодонтію, естетичну стоматологію.</li>
              <li>📱 Впровадьте систему онлайн-запису та нагадувань пацієнтам.</li>
              <li>🤝 Укладіть договори зі страховими компаніями для стабільного потоку.</li>
              <li>⭐ Створіть програму лояльності для постійних пацієнтів.</li>
              <li>📊 Ведіть детальну аналітику по видам послуг та їх прибутковості.</li>
              <li>🎓 Інвестуйте в підвищення кваліфікації лікарів.</li>
              <li>🔄 Оптимізуйте розклад для максимального використання крісел.</li>
              <li>🌐 Розвивайте інтернет-присутність та репутацію в мережі.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.dentalPracticeBusinessData = {
        'Кількість крісел': dentalChairs,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': totalRevenueWithExtras,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Пацієнтів на день (на крісло)': patientsPerDay,
        'Вартість прийому ($)': avgVisitCost,
        'Заповнюваність крісел (%)': chairUtilization,
        'Дохід на крісло ($)': revenuePerChair
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.dentalPracticeBusinessData) return;
    
    const csv = Object.entries(window.dentalPracticeBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-dental-practice.csv';
    link.click();
  };
});