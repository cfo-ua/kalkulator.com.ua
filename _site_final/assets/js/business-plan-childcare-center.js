document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('childcare-form');
  const result = document.getElementById('childcare-result');

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

      const childrenCapacity = parseInt(document.getElementById('children-capacity').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const licensingCost = parseFloat(document.getElementById('licensing-cost').value);
      const monthlyFee = parseFloat(document.getElementById('monthly-fee').value);
      const occupancyRate = parseFloat(document.getElementById('occupancy-rate').value);
      const additionalServices = parseFloat(document.getElementById('additional-services').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const foodCosts = parseFloat(document.getElementById('food-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (childrenCapacity <= 0 || monthlyFee <= 0 || occupancyRate <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = renovationCost + equipmentCost + licensingCost;

      // Revenue calculations
      const actualChildren = Math.round(childrenCapacity * (occupancyRate / 100));
      const monthlyTuitionRevenue = actualChildren * monthlyFee;
      const monthlyAdditionalRevenue = actualChildren * additionalServices;
      const totalMonthlyRevenue = monthlyTuitionRevenue + monthlyAdditionalRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = rent + staffSalaries + foodCosts + utilities + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = annualRevenue - annualExpenses;
      const profitMargin = (annualNetProfit / annualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerChild = annualRevenue / actualChildren;
      const expensePerChild = annualExpenses / actualChildren;
      const profitPerChild = annualNetProfit / actualChildren;
      const staffToChildRatio = Math.round(actualChildren / Math.max(1, Math.floor(staffSalaries / 800))); // Assuming $800 avg salary per staff

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let occupancyType = 'info';
      if (occupancyRate < 75) occupancyType = 'warning';
      else if (occupancyRate > 90) occupancyType = 'success';

      let ratioType = 'info';
      if (staffToChildRatio > 8) ratioType = 'warning';
      else if (staffToChildRatio <= 6) ratioType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>👶 Бізнес-план дитячого садка</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 4 ? 'success' : 'warning')}
            ${createInsightCard('👥 Заповнюваність', `${actualChildren} дітей`, `${formatPercent(occupancyRate)} від місткості`, occupancyType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Ремонт та облаштування</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання та меблі</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензування та дозволи</span>
                  <span>${formatNumber(licensingCost)}</span>
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
                  <span>Плата за навчання (${actualChildren} дітей × ${formatNumber(monthlyFee)})</span>
                  <span>${formatNumber(monthlyTuitionRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги (гуртки, харчування)</span>
                  <span>${formatNumber(monthlyAdditionalRevenue)}</span>
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
                  <span>Оренда приміщення</span>
                  <span>${formatNumber(rent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Зарплати персоналу</span>
                  <span>${formatNumber(staffSalaries)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Харчування дітей</span>
                  <span>${formatNumber(foodCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні послуги</span>
                  <span>${formatNumber(utilities)}</span>
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
              <h6>👶 Показники на дитину</h6>
              <div class="metric-subtitle">
                Річний дохід: <strong>${formatNumber(revenuePerChild)}</strong><br>
                Річні витрати: <strong>${formatNumber(expensePerChild)}</strong><br>
                Річний прибуток: <strong>${formatNumber(profitPerChild)}</strong>
              </div>
            </div>
            <div class="insight-card ${ratioType}">
              <h6>👥 Співвідношення персоналу</h6>
              <div class="metric-subtitle">
                Дітей на вихователя: <strong>${staffToChildRatio}:1</strong><br>
                Рекомендовано: <strong>6:1 - 8:1</strong><br>
                Якість догляду: <strong>${staffToChildRatio <= 6 ? 'Висока' : staffToChildRatio <= 8 ? 'Нормальна' : 'Потребує покращення'}</strong>
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
                Максимальна місткість: <strong>${childrenCapacity} дітей</strong><br>
                Поточна заповнюваність: <strong>${actualChildren} дітей</strong><br>
                Резерв для росту: <strong>${childrenCapacity - actualChildren} місць</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення плати або зниження витрат.</li>' : ''}
              ${occupancyRate < 80 ? '<li>👥 Низька заповнюваність. Покращте маркетинг та якість послуг.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або підвищте доходи.</li>' : ''}
              ${staffToChildRatio > 8 ? '<li>👥 Занадто багато дітей на вихователя. Розгляньте додавання персоналу.</li>' : ''}
              ${occupancyRate > 95 ? '<li>✅ Висока заповнюваність! Розгляньте розширення або підвищення цін.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових груп.</li>' : ''}
              <li>🎨 Додайте спеціалізовані гуртки: мистецтво, музика, спорт.</li>
              <li>🌍 Впровадьте білінгвальну програму для збільшення цінності.</li>
              <li>📱 Використовуйте мобільний додаток для спілкування з батьками.</li>
              <li>🏃 Організуйте додаткові послуги: продовжений день, вихідні.</li>
              <li>👨‍⚕️ Додайте консультації спеціалістів: психолог, логопед.</li>
              <li>🎪 Проводьте тематичні заходи та свята для дітей.</li>
              <li>📚 Розвивайте партнерства з освітніми установами.</li>
              <li>💻 Впровадьте цифрові технології в навчальний процес.</li>
              <li>🏆 Участь у конкурсах та сертифікації якості освіти.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.childcareBusinessData = {
        'Місткість (дітей)': childrenCapacity,
        'Фактична кількість дітей': actualChildren,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': annualRevenue,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Заповнюваність (%)': occupancyRate,
        'Дохід на дитину ($)': revenuePerChild,
        'Щомісячна плата ($)': monthlyFee
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.childcareBusinessData) return;
    
    const csv = Object.entries(window.childcareBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-dytjachyj-sadok.csv';
    link.click();
  };
});