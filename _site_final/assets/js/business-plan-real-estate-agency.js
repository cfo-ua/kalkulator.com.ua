document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('realestate-form');
  const result = document.getElementById('realestate-result');

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

      const agentsCount = parseInt(document.getElementById('agents-count').value);
      const officeSetup = parseFloat(document.getElementById('office-setup').value);
      const legalCosts = parseFloat(document.getElementById('legal-costs').value);
      const marketingSetup = parseFloat(document.getElementById('marketing-setup').value);
      const commissionRate = parseFloat(document.getElementById('commission-rate').value);
      const monthlyDeals = parseFloat(document.getElementById('monthly-deals').value);
      const avgPropertyPrice = parseFloat(document.getElementById('avg-property-price').value);
      const agentCommissionShare = parseFloat(document.getElementById('agent-commission-share').value);
      const officeRent = parseFloat(document.getElementById('office-rent').value);
      const baseSalaries = parseFloat(document.getElementById('base-salaries').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherCosts = parseFloat(document.getElementById('other-costs').value);

      if (agentsCount <= 0 || commissionRate <= 0 || monthlyDeals <= 0 || avgPropertyPrice <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = officeSetup + legalCosts + marketingSetup;

      // Revenue calculations
      const grossCommissionPerDeal = (avgPropertyPrice * commissionRate) / 100;
      const monthlyGrossCommission = monthlyDeals * grossCommissionPerDeal;
      const agentCommissionPayout = (monthlyGrossCommission * agentCommissionShare) / 100;
      const agencyNetCommission = monthlyGrossCommission - agentCommissionPayout;
      
      // Annual revenue
      const annualGrossCommission = monthlyGrossCommission * 12;
      const annualNetCommission = agencyNetCommission * 12;

      // Monthly expenses
      const totalMonthlyExpenses = officeRent + baseSalaries + marketingCosts + otherCosts;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = agencyNetCommission - totalMonthlyExpenses;
      const annualNetProfit = annualNetCommission - annualExpenses;
      const profitMargin = (annualNetProfit / annualNetCommission) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerAgent = annualNetCommission / agentsCount;
      const dealsPerAgent = monthlyDeals / agentsCount;
      const commissionPerDeal = grossCommissionPerDeal;
      const agencyCommissionPerDeal = grossCommissionPerDeal - (grossCommissionPerDeal * agentCommissionShare / 100);

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 30) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      let dealsType = 'info';
      if (dealsPerAgent < 2) dealsType = 'warning';
      else if (dealsPerAgent > 4) dealsType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏢 Бізнес-план агентства нерухомості</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 1.5 ? 'success' : 'warning')}
            ${createInsightCard('📊 Угод на агента', `${dealsPerAgent.toFixed(1)}/міс`, `Всього: ${monthlyDeals} угод`, dealsType)}
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
                  <span>Ліцензії та правові витрати</span>
                  <span>${formatNumber(legalCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий маркетинг та обладнання</span>
                  <span>${formatNumber(marketingSetup)}</span>
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
                  <span>Валова комісія (${monthlyDeals} угод × ${formatNumber(commissionPerDeal)})</span>
                  <span>${formatNumber(annualGrossCommission)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Виплати агентам (${formatPercent(agentCommissionShare)})</span>
                  <span>-${formatNumber(agentCommissionPayout * 12)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Чистий дохід агентства</strong></span>
                  <span><strong>${formatNumber(annualNetCommission)}</strong></span>
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
                  <span><strong>Загальні щомісячні витрати</strong></span>
                  <span><strong>${formatNumber(totalMonthlyExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔄 Ефективність агентів</h6>
              <div class="metric-subtitle">
                Дохід на агента: <strong>${formatNumber(revenuePerAgent)}/рік</strong><br>
                Угод на агента: <strong>${dealsPerAgent.toFixed(1)}/місяць</strong><br>
                Комісія з угоди: <strong>${formatNumber(agencyCommissionPerDeal)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Аналіз угод</h6>
              <div class="metric-subtitle">
                Середня вартість об'єкта: <strong>${formatNumber(avgPropertyPrice)}</strong><br>
                Комісія агентства: <strong>${formatPercent(commissionRate)}</strong><br>
                Валова комісія з угоди: <strong>${formatNumber(commissionPerDeal)}</strong>
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
                При +1 угоді/місяць: <strong>+${formatNumber(agencyCommissionPerDeal * 12)}/рік</strong><br>
                При +1 агенті: <strong>+${formatNumber(revenuePerAgent - (baseSalaries * 12 / agentsCount))}/рік</strong><br>
                При +0.5% комісії: <strong>+${formatNumber((avgPropertyPrice * 0.5 / 100) * monthlyDeals * 12)}/рік</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення комісії або зниження витрат на агентів.</li>' : ''}
              ${dealsPerAgent < 2 ? '<li>📍 Низька продуктивність агентів. Покращте навчання або систему мотивації.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште кількість угод.</li>' : ''}
              ${dealsPerAgent > 4 ? '<li>✅ Висока продуктивність! Розгляньте розширення команди або підвищення комісії.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових офісів.</li>' : ''}
              <li>💼 Впровадьте CRM-систему для ефективного управління клієнтами та угодами.</li>
              <li>📱 Розвивайте онлайн-присутність: сайт, соціальні мережі, контекстна реклама.</li>
              <li>🎯 Спеціалізуйтеся на прибуткових сегментах: комерційна нерухомість, новобудови.</li>
              <li>🤝 Налагоджуйте партнерство з забудовниками, банками, страховими компаніями.</li>
              <li>📈 Впровадьте систему KPI для агентів: кількість угод, обсяг продажів, якість обслуговування.</li>
              <li>⭐ Інвестуйте в навчання персоналу та підвищення кваліфікації.</li>
              <li>🎪 Розгляньте додаткові послуги: оцінка, юридичний супровід, іпотечне кредитування.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.realEstateBusinessData = {
        'Кількість агентів': agentsCount,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід агентства ($)': annualNetCommission,
        'Річні витрати ($)': annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Угод на місяць': monthlyDeals,
        'Угод на агента': dealsPerAgent,
        'Комісія агентства (%)': commissionRate,
        'Дохід на агента ($)': revenuePerAgent
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.realEstateBusinessData) return;
    
    const csv = Object.entries(window.realEstateBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-agentstvo-neruhomosti.csv';
    link.click();
  };
});