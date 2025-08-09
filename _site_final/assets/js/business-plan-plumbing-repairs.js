document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('plumbing-form');
  const result = document.getElementById('plumbing-result');

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

      const toolsCost = parseFloat(document.getElementById('tools-cost').value);
      const vehicleCost = parseFloat(document.getElementById('vehicle-cost').value);
      const licensesInsurance = parseFloat(document.getElementById('licenses-insurance').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const callsPerDay = parseFloat(document.getElementById('calls-per-day').value);
      const avgCallPrice = parseFloat(document.getElementById('avg-call-price').value);
      const materialsMarkup = parseFloat(document.getElementById('materials-markup').value);
      const fuelCosts = parseFloat(document.getElementById('fuel-costs').value);
      const materialsCost = parseFloat(document.getElementById('materials-cost').value);
      const marketingCosts = parseFloat(document.getElementById('marketing-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (workingDays <= 0 || callsPerDay <= 0 || avgCallPrice <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = toolsCost + vehicleCost + licensesInsurance + workingCapital;

      // Revenue calculations
      const monthlyCallsTotal = workingDays * callsPerDay;
      const monthlyServiceRevenue = monthlyCallsTotal * avgCallPrice;
      
      // Materials revenue (with markup)
      const materialsRevenueWithMarkup = materialsCost * (1 + materialsMarkup / 100);
      const materialsProfit = materialsRevenueWithMarkup - materialsCost;
      
      const totalMonthlyRevenue = monthlyServiceRevenue + materialsRevenueWithMarkup;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = fuelCosts + materialsCost + marketingCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const grossProfit = monthlyServiceRevenue + materialsProfit; // Service + materials markup
      const monthlyNetProfit = grossProfit - (fuelCosts + marketingCosts + otherExpenses);
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerCall = avgCallPrice;
      const callsPerMonth = monthlyCallsTotal;
      const profitPerCall = monthlyNetProfit / monthlyCallsTotal;
      const dailyRevenue = totalMonthlyRevenue / workingDays;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 40) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let paybackType = 'info';
      if (paybackYears > 2) paybackType = 'warning';
      else if (paybackYears <= 1) paybackType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🔧 Бізнес-план сантехнічних послуг</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackType)}
            ${createInsightCard('🔧 Виклики', `${monthlyCallsTotal} на місяць`, `${formatNumber(profitPerCall)} прибуток/виклик`, 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Професійні інструменти</span>
                  <span>${formatNumber(toolsCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Транспорт (авто + обладнання)</span>
                  <span>${formatNumber(vehicleCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії та страхування</span>
                  <span>${formatNumber(licensesInsurance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий капітал</span>
                  <span>${formatNumber(workingCapital)}</span>
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
                  <span>Сервісні послуги (${monthlyCallsTotal} викликів × ${formatNumber(avgCallPrice)})</span>
                  <span>${formatNumber(monthlyServiceRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Продаж матеріалів (наценка ${formatPercent(materialsMarkup)})</span>
                  <span>${formatNumber(materialsRevenueWithMarkup)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Прибуток з матеріалів</span>
                  <span>${formatNumber(materialsProfit)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний місячний дохід</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Паливо та транспортні витрати</span>
                  <span>${formatNumber(fuelCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Матеріали та запчастини (собівартість)</span>
                  <span>${formatNumber(materialsCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Реклама та маркетинг</span>
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
              <h6>🔄 Ефективність роботи</h6>
              <div class="metric-subtitle">
                Виклики на день: <strong>${callsPerDay}</strong><br>
                Дохід на день: <strong>${formatNumber(dailyRevenue)}</strong><br>
                Дохід на виклик: <strong>${formatNumber(revenuePerCall)}</strong>
              </div>
            </div>
            <div class="insight-card ${materialsMarkup >= 100 ? 'success' : 'info'}">
              <h6>📊 Структура доходів</h6>
              <div class="metric-subtitle">
                Послуги: <strong>${formatPercent((monthlyServiceRevenue/totalMonthlyRevenue)*100)}</strong><br>
                Матеріали: <strong>${formatPercent((materialsRevenueWithMarkup/totalMonthlyRevenue)*100)}</strong><br>
                Наценка: <strong>${formatPercent(materialsMarkup)}</strong>
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
                При +2 виклики/день: <strong>${formatNumber(monthlyNetProfit + (2 * workingDays * profitPerCall))}/міс</strong><br>
                З помічником: <strong>${formatNumber((monthlyNetProfit * 1.8) - 2500)}/міс</strong><br>
                Аварійні виклики (+50%): <strong>${formatNumber(monthlyNetProfit * 1.5)}/міс</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження витрат.</li>' : ''}
              ${callsPerDay < 3 ? '<li>📍 Мало викликів. Покращте маркетинг та онлайн-присутність.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште ціни.</li>' : ''}
              ${callsPerDay > 6 ? '<li>✅ Висока завантаженість! Розгляньте найм помічника або підвищення цін.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Відмінна рентабельність! Масштабуйте бізнес та розширюйте послуги.</li>' : ''}
              <li>📱 Створіть онлайн-присутність: сайт, соціальні мережі, Google My Business.</li>
              <li>🚨 Додайте аварійні виклики 24/7 для підвищення доходів на 30-50%.</li>
              <li>🤝 Встановіть партнерства з управляючими компаніями.</li>
              <li>⭐ Збирайте відгуки клієнтів для покращення репутації.</li>
              <li>🛠️ Інвестуйте в професійне обладнання для складних робіт.</li>
              <li>📚 Додайте додаткові послуги: електрика, плитка, діагностика.</li>
              <li>💳 Запровадьте безготівкові платежі для зручності клієнтів.</li>
              <li>📊 Ведіть облік викликів та аналізуйте найприбутковіші види робіт.</li>
              <li>🎯 Спеціалізуйтеся на певних видах робіт для підвищення експертизи.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.plumbingBusinessData = {
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalMonthlyRevenue,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Виклики на місяць': monthlyCallsTotal,
        'Середня ціна виклику ($)': avgCallPrice,
        'Прибуток на виклик ($)': profitPerCall,
        'Робочих днів': workingDays,
        'Наценка на матеріали (%)': materialsMarkup
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.plumbingBusinessData) return;
    
    const csv = Object.entries(window.plumbingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-santekhnika.csv';
    link.click();
  };
});