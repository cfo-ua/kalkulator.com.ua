document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('store-form');
  const result = document.getElementById('store-result');

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

      const websiteCost = parseFloat(document.getElementById('website-cost').value);
      const inventoryCost = parseFloat(document.getElementById('inventory-cost').value);
      const initialMarketing = parseFloat(document.getElementById('initial-marketing').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyTraffic = parseInt(document.getElementById('monthly-traffic').value);
      const conversionRate = parseFloat(document.getElementById('conversion-rate').value);
      const averageOrder = parseFloat(document.getElementById('average-order').value);
      const grossMargin = parseFloat(document.getElementById('gross-margin').value);
      const repeatRate = parseFloat(document.getElementById('repeat-rate').value);
      const marketingCost = parseFloat(document.getElementById('marketing-cost').value);
      const logisticsCost = parseFloat(document.getElementById('logistics-cost').value);
      const techMaintenance = parseFloat(document.getElementById('tech-maintenance').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (monthlyTraffic <= 0 || conversionRate <= 0 || averageOrder <= 0 || grossMargin <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = websiteCost + inventoryCost + initialMarketing + additionalCosts;

      // Sales calculations
      const conversionDecimal = conversionRate / 100;
      const monthlyOrders = monthlyTraffic * conversionDecimal;
      const monthlyRevenue = monthlyOrders * averageOrder;
      
      // Add repeat purchase revenue
      const repeatPurchaseRevenue = monthlyRevenue * (repeatRate / 100);
      const totalMonthlyRevenue = monthlyRevenue + repeatPurchaseRevenue;
      
      // Gross profit calculation
      const grossProfitMargin = grossMargin / 100;
      const monthlyGrossProfit = totalMonthlyRevenue * grossProfitMargin;
      
      // Annual calculations
      const annualRevenue = totalMonthlyRevenue * 12;
      const annualGrossProfit = monthlyGrossProfit * 12;

      // Monthly expenses
      const totalMonthlyExpenses = marketingCost + logisticsCost + techMaintenance + staffCosts + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = monthlyGrossProfit - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const netProfitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // E-commerce specific metrics
      const customerAcquisitionCost = marketingCost / monthlyOrders;
      const customerLifetimeValue = (averageOrder * grossProfitMargin) / (1 - (repeatRate / 100));
      const ltvcacRatio = customerLifetimeValue / customerAcquisitionCost;
      const returnOnAdSpend = (monthlyGrossProfit / marketingCost) * 100;
      
      // Traffic and conversion metrics
      const costPerVisitor = marketingCost / monthlyTraffic;
      const revenuePerVisitor = totalMonthlyRevenue / monthlyTraffic;
      const ordersPerDay = monthlyOrders / 30;

      // Inventory turnover (monthly)
      const inventoryTurnover = (monthlyRevenue * (1 - grossProfitMargin)) / (inventoryCost / 12);

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (netProfitMargin > 20) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 30) roiType = 'warning';
      else if (annualROI > 60) roiType = 'success';

      let conversionType = 'info';
      if (conversionRate < 2) conversionType = 'warning';
      else if (conversionRate > 4) conversionType = 'success';

      let ltvcacType = 'info';
      if (ltvcacRatio < 3) ltvcacType = 'warning';
      else if (ltvcacRatio > 5) ltvcacType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🛒 Бізнес-план інтернет-магазину</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(netProfitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 2 ? 'success' : 'warning')}
            ${createInsightCard('🎯 Конверсія', formatPercent(conversionRate), `${monthlyOrders.toFixed(0)} замовлень/міс`, conversionType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Розробка сайту та дизайн</span>
                  <span>${formatNumber(websiteCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий товарний запас</span>
                  <span>${formatNumber(inventoryCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початковий маркетинг та реклама</span>
                  <span>${formatNumber(initialMarketing)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові витрати</span>
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
                  <span>Основні продажі (${monthlyOrders.toFixed(0)} замовлень × $${averageOrder})</span>
                  <span>${formatNumber(monthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Повторні покупки (${formatPercent(repeatRate)})</span>
                  <span>${formatNumber(repeatPurchaseRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний щомісячний дохід</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenue)}</strong></span>
                </div>
                <div class="breakdown-row">
                  <span>Валовий прибуток (${formatPercent(grossMargin)} маржа)</span>
                  <span>${formatNumber(monthlyGrossProfit)}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Маркетинг та реклама</span>
                  <span>${formatNumber(marketingCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Логістика та доставка</span>
                  <span>${formatNumber(logisticsCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Технічне обслуговування</span>
                  <span>${formatNumber(techMaintenance)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Зарплати та персонал</span>
                  <span>${formatNumber(staffCosts)}</span>
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
            <div class="insight-card ${ltvcacType}">
              <h6>👥 Клієнтські метрики</h6>
              <div class="metric-subtitle">
                Вартість залучення (CAC): <strong>${formatNumber(customerAcquisitionCost)}</strong><br>
                Цінність клієнта (LTV): <strong>${formatNumber(customerLifetimeValue)}</strong><br>
                LTV/CAC співвідношення: <strong>${ltvcacRatio.toFixed(1)}</strong>
              </div>
            </div>
            <div class="insight-card info">
              <h6>📊 Маркетингові метрики</h6>
              <div class="metric-subtitle">
                ROAS: <strong>${formatPercent(returnOnAdSpend)}</strong><br>
                Вартість за відвідувача: <strong>${formatNumber(costPerVisitor)}</strong><br>
                Дохід з відвідувача: <strong>${formatNumber(revenuePerVisitor)}</strong>
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
              <h6>📦 Операційні показники</h6>
              <div class="metric-subtitle">
                Замовлень на день: <strong>${ordersPerDay.toFixed(1)}</strong><br>
                Оборотність запасів: <strong>${inventoryTurnover.toFixed(1)}х/міс</strong><br>
                Річний оборот: <strong>${formatNumber(annualRevenue)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${netProfitMargin < 10 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження витрат.</li>' : ''}
              ${conversionRate < 2 ? '<li>📍 Низька конверсія. Оптимізуйте сайт, покращте UX/UI.</li>' : ''}
              ${ltvcacRatio < 3 ? '<li>💰 Високі витрати на залучення. Оптимізуйте рекламні кампанії.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Довгий термін окупності. Збільште маркетинговий бюджет або покращте конверсію.</li>' : ''}
              ${conversionRate > 4 ? '<li>✅ Відмінна конверсія! Збільшуйте трафік для масштабування.</li>' : ''}
              ${netProfitMargin > 25 ? '<li>🎉 Чудова рентабельність! Розгляньте розширення асортименту.</li>' : ''}
              <li>🎯 A/B тестуйте сторінки товарів та процес оформлення замовлення.</li>
              <li>📱 Оптимізуйте сайт для мобільних пристроїв - 60%+ трафіку.</li>
              <li>📧 Впровадьте email-маркетинг для підвищення повторних покупок.</li>
              <li>⭐ Збирайте та показуйте відгуки клієнтів для підвищення довіри.</li>
              <li>🚚 Покращте логістику: швидка доставка збільшує конверсію.</li>
              <li>💳 Додайте різні способи оплати для зручності клієнтів.</li>
              <li>🎁 Створіть програму лояльності для стимулювання повторних покупок.</li>
              <li>📊 Використовуйте Google Analytics та пікселі для відстеження ROI.</li>
              <li>🔍 Інвестуйте в SEO для зниження залежності від платної реклами.</li>
              <li>🤝 Розвивайте партнерські програми та співпрацю з блогерами.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.storeBusinessData = {
        'Щомісячний трафік': monthlyTraffic,
        'Конверсія (%)': conversionRate,
        'Середній чек ($)': averageOrder,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalMonthlyRevenue,
        'Валовий прибуток ($)': monthlyGrossProfit,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Чистий прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': netProfitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'CAC ($)': customerAcquisitionCost,
        'LTV ($)': customerLifetimeValue,
        'LTV/CAC': ltvcacRatio,
        'ROAS (%)': returnOnAdSpend
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.storeBusinessData) return;
    
    const csv = Object.entries(window.storeBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-internet-magazin.csv';
    link.click();
  };
});