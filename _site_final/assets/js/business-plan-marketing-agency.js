document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('marketing-form');
  const result = document.getElementById('marketing-result');

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

      const agencyType = document.getElementById('agency-type').value;
      const initialEmployees = parseInt(document.getElementById('initial-employees').value);
      const softwareCost = parseFloat(document.getElementById('software-cost').value);
      const officeCost = parseFloat(document.getElementById('office-cost').value);
      const marketingCapital = parseFloat(document.getElementById('marketing-capital').value);
      const avgProjectValue = parseFloat(document.getElementById('avg-project-value').value);
      const profitMargin = parseFloat(document.getElementById('profit-margin').value);
      const newClientsMonth = parseFloat(document.getElementById('new-clients-month').value);
      const clientRetention = parseFloat(document.getElementById('client-retention').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const softwareMonthly = parseFloat(document.getElementById('software-monthly').value);
      const rentCosts = parseFloat(document.getElementById('rent-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (initialEmployees <= 0 || avgProjectValue <= 0 || profitMargin <= 0 || newClientsMonth <= 0 || clientRetention <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = softwareCost + officeCost + marketingCapital;

      // Client and revenue calculations
      const monthsInYear = 12;
      const newClientsPerYear = newClientsMonth * monthsInYear;
      
      // Calculate active clients over time considering retention
      const avgActiveClients = (newClientsMonth * clientRetention) / 2; // Simplified average
      const maxActiveClients = newClientsMonth * clientRetention; // Maximum when fully ramped
      
      // Monthly revenue calculations
      const monthlyRevenue = avgActiveClients * avgProjectValue / clientRetention;
      const annualRevenue = monthlyRevenue * monthsInYear;
      
      // Profit calculations based on margin
      const profitMarginDecimal = profitMargin / 100;
      const monthlyGrossProfit = monthlyRevenue * profitMarginDecimal;
      const annualGrossProfit = annualRevenue * profitMarginDecimal;

      // Monthly expenses
      const totalMonthlyExpenses = staffCosts + softwareMonthly + rentCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * monthsInYear;
      
      // Net profit calculations
      const annualNetProfit = annualGrossProfit - annualExpenses;
      const monthlyNetProfit = annualNetProfit / monthsInYear;
      const netProfitMargin = (annualNetProfit / annualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerEmployee = annualRevenue / initialEmployees;
      const profitPerEmployee = annualNetProfit / initialEmployees;
      const revenuePerClient = avgProjectValue;
      const clientLifetimeValue = avgProjectValue * (clientRetention / 12);

      // Agency type specific factors
      const agencyTypeNames = {
        'smm-agency': 'SMM-агентство',
        'seo-agency': 'SEO/SEM-агентство',
        'performance-agency': 'Performance-агентство',
        'full-service': 'Digital-агентство повного циклу'
      };

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (netProfitMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 30) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let efficiencyType = 'info';
      if (revenuePerEmployee < 60000) efficiencyType = 'warning';
      else if (revenuePerEmployee > 120000) efficiencyType = 'success';

      // Growth potential calculations
      const potentialClientsYear3 = Math.min(maxActiveClients, avgActiveClients * 2);
      const year3Revenue = (potentialClientsYear3 * avgProjectValue / clientRetention) * monthsInYear;
      const growthPotential = ((year3Revenue - annualRevenue) / annualRevenue) * 100;

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>📈 Бізнес-план маркетингового агентства</h3>
          <div class="agency-type-indicator">
            <span class="agency-type-badge">${agencyTypeNames[agencyType]}</span>
          </div>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Чиста маржа: ${formatPercent(netProfitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 2 ? 'success' : 'warning')}
            ${createInsightCard('👥 Активних клієнтів', `${avgActiveClients.toFixed(0)} шт`, 'Середня база', 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Програмне забезпечення та інструменти</span>
                  <span>${formatNumber(softwareCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Офіс та обладнання</span>
                  <span>${formatNumber(officeCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та оборотний капітал</span>
                  <span>${formatNumber(marketingCapital)}</span>
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
                  <span>Щомісячний оборот (${avgActiveClients.toFixed(0)} клієнтів)</span>
                  <span>${formatNumber(monthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Річний оборот</span>
                  <span>${formatNumber(annualRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Валовий прибуток (маржа ${formatPercent(profitMargin)})</span>
                  <span>${formatNumber(annualGrossProfit)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний річний дохід</strong></span>
                  <span><strong>${formatNumber(annualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Заробітна плата команди (${initialEmployees} осіб)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>ПЗ, інструменти та підписки</span>
                  <span>${formatNumber(softwareMonthly)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Оренда офісу</span>
                  <span>${formatNumber(rentCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та інші витрати</span>
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
              <h6>📊 Ефективність клієнтів</h6>
              <div class="metric-subtitle">
                Середня вартість проекту: <strong>${formatNumber(avgProjectValue)}</strong><br>
                LTV клієнта: <strong>${formatNumber(clientLifetimeValue)}</strong><br>
                Нових клієнтів/міс: <strong>${newClientsMonth} шт</strong>
              </div>
            </div>
            <div class="insight-card ${revenuePerEmployee > 80000 ? 'success' : 'info'}">
              <h6>👨‍💼 Продуктивність команди</h6>
              <div class="metric-subtitle">
                Дохід на співробітника: <strong>${formatNumber(revenuePerEmployee)}/рік</strong><br>
                Прибуток на співробітника: <strong>${formatNumber(profitPerEmployee)}/рік</strong><br>
                Середня ЗП: <strong>${formatNumber(staffCosts / initialEmployees)}/міс</strong>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>💰 Прогноз прибутковості</h6>
              <div class="metric-subtitle">
                Річний чистий прибуток: <strong>${formatNumber(annualNetProfit)}</strong><br>
                Щотижневий прибуток: <strong>${formatNumber(annualNetProfit / 52)}</strong><br>
                Тривалість співпраці: <strong>${clientRetention} міс</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>🎯 Потенціал росту</h6>
              <div class="metric-subtitle">
                Потенціал за 3 роки: <strong>+${formatPercent(growthPotential)}</strong><br>
                При +2 клієнта/міс: <strong>+${formatNumber(avgProjectValue * 24)}/рік</strong><br>
                При +10% маржі: <strong>+${formatNumber(annualRevenue * 0.1)}/рік</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${netProfitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження витрат.</li>' : ''}
              ${revenuePerEmployee < 80000 ? '<li>📍 Низька продуктивність. Покращте ефективність команди або підвищте ціни.</li>' : ''}
              ${paybackYears > 3 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште клієнтську базу.</li>' : ''}
              ${avgActiveClients < 10 ? '<li>📈 Мало клієнтів. Активізуйте маркетинг та продажі.</li>' : ''}
              ${clientRetention < 9 ? '<li>🔄 Низька утримуваність. Покращте якість послуг та клієнтський сервіс.</li>' : ''}
              ${netProfitMargin > 30 ? '<li>🎉 Відмінна рентабельність! Розгляньте розширення команди та послуг.</li>' : ''}
              <li>🏆 Спеціалізуйтесь на прибуткових нішах: e-commerce, B2B, фінтех.</li>
              <li>📊 Впровадьте CRM-систему для управління клієнтами та проектами.</li>
              <li>🤖 Автоматизуйте рутинні процеси: звітність, соціальні мережі, email-розсилки.</li>
              <li>⭐ Створюйте кейси та портфоліо для залучення нових клієнтів.</li>
              <li>💡 Впровадьте нові послуги: маркетингову аналітику, automation.</li>
              <li>📈 Розвивайте довгострокові retainer-контракти для стабільного доходу.</li>
              <li>🎯 Інвестуйте в навчання команди новим інструментам та технологіям.</li>
              <li>🌐 Створіть партнерську мережу з іншими агентствами та фрилансерами.</li>
              <li>📱 Розвивайте власні digital-продукти: курси, інструменти, консультації.</li>
              <li>💰 Впровадьте систему KPI та мотивації для підвищення продуктивності.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.marketingBusinessData = {
        'Тип агентства': agencyTypeNames[agencyType],
        'Кількість співробітників': initialEmployees,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний оборот ($)': annualRevenue,
        'Валовий прибуток ($)': annualGrossProfit,
        'Річні витрати ($)': annualExpenses,
        'Річний чистий прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Валова маржа (%)': profitMargin,
        'Чиста маржа (%)': netProfitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Дохід на співробітника ($)': revenuePerEmployee,
        'Прибуток на співробітника ($)': profitPerEmployee,
        'Середня вартість проекту ($)': avgProjectValue,
        'Активних клієнтів': avgActiveClients,
        'Нових клієнтів/міс': newClientsMonth,
        'Тривалість співпраці (міс)': clientRetention,
        'LTV клієнта ($)': clientLifetimeValue
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.marketingBusinessData) return;
    
    const csv = Object.entries(window.marketingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-marketing-agentstvo.csv';
    link.click();
  };
});