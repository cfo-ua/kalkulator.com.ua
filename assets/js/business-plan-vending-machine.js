document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('vending-form');
  const result = document.getElementById('vending-result');

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

      const machines = parseInt(document.getElementById('machines').value);
      const machineCost = parseFloat(document.getElementById('machine-cost').value);
      const installationCost = parseFloat(document.getElementById('installation-cost').value);
      const initialStock = parseFloat(document.getElementById('initial-stock').value);
      const permits = parseFloat(document.getElementById('permits').value);
      const dailySales = parseFloat(document.getElementById('daily-sales').value);
      const avgPrice = parseFloat(document.getElementById('avg-price').value);
      const costPercentage = parseFloat(document.getElementById('cost-percentage').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const locationRent = parseFloat(document.getElementById('location-rent').value);
      const maintenance = parseFloat(document.getElementById('maintenance').value);
      const transport = parseFloat(document.getElementById('transport').value);
      const otherCosts = parseFloat(document.getElementById('other-costs').value);

      if (machines <= 0 || dailySales <= 0 || avgPrice <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = machines * (machineCost + installationCost + initialStock) + permits;

      // Revenue calculations
      const dailyRevenuePerMachine = dailySales * avgPrice;
      const monthlyRevenuePerMachine = dailyRevenuePerMachine * workingDays;
      const totalMonthlyRevenue = monthlyRevenuePerMachine * machines;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Cost of goods sold
      const costPercentageDecimal = costPercentage / 100;
      const monthlyCOGS = totalMonthlyRevenue * costPercentageDecimal;
      const grossProfit = totalMonthlyRevenue - monthlyCOGS;

      // Operating expenses
      const monthlyLocationRent = locationRent * machines;
      const monthlyMaintenance = maintenance * machines;
      const totalMonthlyExpenses = monthlyLocationRent + monthlyMaintenance + transport + otherCosts;
      const annualExpenses = (monthlyCOGS + totalMonthlyExpenses) * 12;
      
      // Profit calculations
      const monthlyNetProfit = grossProfit - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const grossMargin = (grossProfit / totalMonthlyRevenue) * 100;
      const netMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerMachine = monthlyRevenuePerMachine;
      const profitPerMachine = monthlyNetProfit / machines;
      const salesEfficiency = dailySales; // sales per machine per day
      const avgTransactionValue = avgPrice;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (netMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 40) roiType = 'success';

      let paybackType = 'info';
      if (paybackYears > 3) paybackType = 'warning';
      else if (paybackYears <= 2) paybackType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏪 Бізнес-план торгових автоматів</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), `${machines} автоматів`, 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(netMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackType)}
            ${createInsightCard('🏪 Прибуток на автомат', formatNumber(profitPerMachine), 'На місяць', profitabilityType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Обладнання (${machines} автоматів × ${formatNumber(machineCost)})</span>
                  <span>${formatNumber(machines * machineCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Установка та підключення</span>
                  <span>${formatNumber(machines * installationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий товар</span>
                  <span>${formatNumber(machines * initialStock)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Дозволи та ліцензії</span>
                  <span>${formatNumber(permits)}</span>
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
                  <span>Продажі на день (${dailySales} × ${formatNumber(avgPrice)})</span>
                  <span>${formatNumber(dailyRevenuePerMachine)}/автомат</span>
                </div>
                <div class="breakdown-row">
                  <span>Місячний дохід (${workingDays} днів)</span>
                  <span>${formatNumber(monthlyRevenuePerMachine)}/автомат</span>
                </div>
                <div class="breakdown-row">
                  <span>Валова виручка (${machines} автоматів)</span>
                  <span>${formatNumber(totalMonthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Собівартість товару (${formatPercent(costPercentage)})</span>
                  <span>-${formatNumber(monthlyCOGS)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Валовий прибуток</strong></span>
                  <span><strong>${formatNumber(grossProfit)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Оренда місць (${formatNumber(locationRent)} × ${machines})</span>
                  <span>${formatNumber(monthlyLocationRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Технічне обслуговування</span>
                  <span>${formatNumber(monthlyMaintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Транспорт та доставка</span>
                  <span>${formatNumber(transport)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Інші операційні витрати</span>
                  <span>${formatNumber(otherCosts)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальні операційні витрати</strong></span>
                  <span><strong>${formatNumber(totalMonthlyExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔄 Ефективність продажів</h6>
              <div class="metric-subtitle">
                Дохід на автомат: <strong>${formatNumber(revenuePerMachine)}/міс</strong><br>
                Продажі на день: <strong>${dailySales} одиниць</strong><br>
                Середній чек: <strong>${formatNumber(avgTransactionValue)}</strong>
              </div>
            </div>
            <div class="insight-card ${grossMargin > 40 ? 'success' : 'info'}">
              <h6>📊 Рентабельність</h6>
              <div class="metric-subtitle">
                Валова маржа: <strong>${formatPercent(grossMargin)}</strong><br>
                Чиста маржа: <strong>${formatPercent(netMargin)}</strong><br>
                Собівартість: <strong>${formatPercent(costPercentage)}</strong>
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
                Прибуток на 1 автомат: <strong>${formatNumber(profitPerMachine)}/міс</strong><br>
                При 10 автоматах: <strong>${formatNumber(profitPerMachine * 10)}/міс</strong><br>
                Потенційний ROI: <strong>${formatPercent(annualROI)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${netMargin < 15 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження собівартості.</li>' : ''}
              ${dailySales < 30 ? '<li>📍 Низькі продажі. Покращте локації або розширте асортимент.</li>' : ''}
              ${paybackYears > 3 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште продажі.</li>' : ''}
              ${dailySales > 70 ? '<li>✅ Високі продажі! Розгляньте встановлення додаткових автоматів.</li>' : ''}
              ${netMargin > 25 ? '<li>🎉 Відмінна рентабельність! Масштабуйте бізнес активніше.</li>' : ''}
              <li>🏢 Шукайте локації з високою прохідністю: офіси, школи, лікарні.</li>
              <li>💳 Впроваджуйте безготівкові платежі для збільшення продажів на 20-30%.</li>
              <li>📊 Аналізуйте дані продажів для оптимізації асортименту.</li>
              <li>🤝 Укладайте довгострокові договори оренди для стабільності.</li>
              <li>🛠️ Проводьте регулярне технічне обслуговування для мінімізації простоїв.</li>
              <li>📈 Тестуйте різні цінові стратегії та асортимент товарів.</li>
              <li>🎯 Досліджуйте потреби та уподобання клієнтів у кожній локації.</li>
              <li>📱 Використовуйте телеметрію для віддаленого моніторингу запасів.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.vendingBusinessData = {
        'Кількість автоматів': machines,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalMonthlyRevenue,
        'Щомісячні витрати ($)': totalMonthlyExpenses + monthlyCOGS,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Валова маржа (%)': grossMargin,
        'Чиста маржа (%)': netMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Продажі на день (шт)': dailySales,
        'Середня ціна товару ($)': avgPrice,
        'Прибуток на автомат ($)': profitPerMachine
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.vendingBusinessData) return;
    
    const csv = Object.entries(window.vendingBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-vending.csv';
    link.click();
  };
});