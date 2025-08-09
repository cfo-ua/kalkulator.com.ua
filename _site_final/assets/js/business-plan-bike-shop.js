document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bike-shop-form');
  const result = document.getElementById('bike-shop-result');

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

      const shopArea = parseInt(document.getElementById('shop-area').value);
      const initialInventory = parseFloat(document.getElementById('initial-inventory').value);
      const renovationEquipment = parseFloat(document.getElementById('renovation-equipment').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const avgBikePrice = parseFloat(document.getElementById('avg-bike-price').value);
      const highSeasonBikes = parseFloat(document.getElementById('high-season-bikes').value);
      const lowSeasonBikes = parseFloat(document.getElementById('low-season-bikes').value);
      const highSeasonMonths = parseFloat(document.getElementById('high-season-months').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const marketingOther = parseFloat(document.getElementById('marketing-other').value);
      const repairRevenue = parseFloat(document.getElementById('repair-revenue').value);
      const accessoriesRevenue = parseFloat(document.getElementById('accessories-revenue').value);

      if (avgBikePrice <= 0 || highSeasonBikes <= 0 || lowSeasonBikes <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = initialInventory + renovationEquipment + additionalCosts;

      // Seasonal calculations
      const lowSeasonMonths = 12 - highSeasonMonths;

      // Monthly revenue calculations
      const highSeasonBikeRevenue = highSeasonBikes * avgBikePrice;
      const lowSeasonBikeRevenue = lowSeasonBikes * avgBikePrice;
      
      const highSeasonMonthlyRevenue = highSeasonBikeRevenue + repairRevenue + accessoriesRevenue;
      const lowSeasonMonthlyRevenue = lowSeasonBikeRevenue + (repairRevenue * 0.7) + (accessoriesRevenue * 0.8);
      
      // Annual calculations
      const highSeasonAnnualRevenue = highSeasonMonthlyRevenue * highSeasonMonths;
      const lowSeasonAnnualRevenue = lowSeasonMonthlyRevenue * lowSeasonMonths;
      const totalAnnualRevenue = highSeasonAnnualRevenue + lowSeasonAnnualRevenue;
      const avgMonthlyRevenue = totalAnnualRevenue / 12;

      // Monthly expenses
      const totalMonthlyExpenses = rent + staffCosts + utilities + marketingOther;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Cost of goods sold (assume 60% of bike revenue, 50% of accessories)
      const highSeasonCOGS = (highSeasonBikeRevenue * 0.6) + (accessoriesRevenue * 0.5);
      const lowSeasonCOGS = (lowSeasonBikeRevenue * 0.6) + (accessoriesRevenue * 0.8 * 0.5);
      const annualCOGS = (highSeasonCOGS * highSeasonMonths) + (lowSeasonCOGS * lowSeasonMonths);
      
      // Profit calculations
      const grossProfit = totalAnnualRevenue - annualCOGS;
      const annualNetProfit = grossProfit - annualExpenses;
      const monthlyNetProfit = annualNetProfit / 12;
      const profitMargin = (annualNetProfit / totalAnnualRevenue) * 100;
      const grossMargin = (grossProfit / totalAnnualRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerSqm = totalAnnualRevenue / shopArea;
      const avgBikesPerMonth = ((highSeasonBikes * highSeasonMonths) + (lowSeasonBikes * lowSeasonMonths)) / 12;
      const inventoryTurnover = (annualCOGS / initialInventory);

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 20) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      let turnoverType = 'info';
      if (inventoryTurnover < 2) turnoverType = 'warning';
      else if (inventoryTurnover > 4) turnoverType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🚴 Бізнес-план велосипедного магазину</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 3 ? 'success' : 'warning')}
            ${createInsightCard('🔄 Оборотність запасів', `${inventoryTurnover.toFixed(1)} разів/рік`, 'Ефективність товарів', turnoverType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Початкові товарні запаси</span>
                  <span>${formatNumber(initialInventory)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ремонт та обладнання</span>
                  <span>${formatNumber(renovationEquipment)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ліцензії, реклама та інше</span>
                  <span>${formatNumber(additionalCosts)}</span>
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
                  <span>Високий сезон (${highSeasonMonths} міс.) - велосипеди</span>
                  <span>${formatNumber(highSeasonBikeRevenue * highSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Низький сезон (${lowSeasonMonths} міс.) - велосипеди</span>
                  <span>${formatNumber(lowSeasonBikeRevenue * lowSeasonMonths)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ремонт та сервіс</span>
                  <span>${formatNumber((repairRevenue * highSeasonMonths) + (repairRevenue * 0.7 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row">
                  <span>Аксесуари та запчастини</span>
                  <span>${formatNumber((accessoriesRevenue * highSeasonMonths) + (accessoriesRevenue * 0.8 * lowSeasonMonths))}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний річний дохід</strong></span>
                  <span><strong>${formatNumber(totalAnnualRevenue)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Річні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Собівартість товарів (COGS)</span>
                  <span>${formatNumber(annualCOGS)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Оренда приміщення</span>
                  <span>${formatNumber(rent * 12)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Персонал</span>
                  <span>${formatNumber(staffCosts * 12)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні послуги</span>
                  <span>${formatNumber(utilities * 12)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та інші витрати</span>
                  <span>${formatNumber(marketingOther * 12)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальні річні витрати</strong></span>
                  <span><strong>${formatNumber(annualCOGS + annualExpenses)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🏪 Ефективність магазину</h6>
              <div class="metric-subtitle">
                Дохід на кв.м: <strong>${formatNumber(revenuePerSqm)}/рік</strong><br>
                Велосипедів на місяць: <strong>${avgBikesPerMonth.toFixed(1)} шт</strong><br>
                Валова маржа: <strong>${formatPercent(grossMargin)}</strong>
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
              <h6>💡 Потенціал оптимізації</h6>
              <div class="metric-subtitle">
                Валовий прибуток: <strong>${formatNumber(grossProfit)}</strong><br>
                Операційні витрати: <strong>${formatNumber(annualExpenses)}</strong><br>
                Можливість економії: <strong>${formatPercent((annualExpenses / totalAnnualRevenue) * 100)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 15 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження витрат.</li>' : ''}
              ${inventoryTurnover < 2 ? '<li>📦 Низька оборотність запасів. Покращте асортимент або знизьте залишки.</li>' : ''}
              ${paybackYears > 4 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або підвищте продажі.</li>' : ''}
              ${inventoryTurnover > 5 ? '<li>✅ Висока оборотність! Можете збільшити асортимент або розширити площу.</li>' : ''}
              ${profitMargin > 25 ? '<li>🎉 Відмінна рентабельність! Розгляньте відкриття додаткового магазину.</li>' : ''}
              <li>🔧 Розвивайте сервісне обслуговування для стабільного доходу.</li>
              <li>🛒 Додайте онлайн-продажі для розширення клієнтської бази.</li>
              <li>🎯 Фокусуйтеся на високомаржинальних аксесуарах та послугах.</li>
              <li>🤝 Співпрацюйте з велоклубами та спортивними організаціями.</li>
              <li>📱 Використовуйте соціальні мережі для залучення клієнтів.</li>
              <li>⭐ Впроваджуйте програми лояльності для постійних клієнтів.</li>
              <li>🎪 Організовуйте велозаїзди та тест-драйви нових моделей.</li>
              <li>❄️ Розвивайте зимовий асортимент: лижі, снігокати, сервіс.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.bikeShopBusinessData = {
        'Площа магазину (кв.м)': shopArea,
        'Загальні інвестиції ($)': totalStartupCost,
        'Річний дохід ($)': totalAnnualRevenue,
        'Річні витрати ($)': annualCOGS + annualExpenses,
        'Річний прибуток ($)': annualNetProfit,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Оборотність запасів': inventoryTurnover,
        'Дохід на кв.м ($)': revenuePerSqm,
        'Середня ціна велосипеду ($)': avgBikePrice
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.bikeShopBusinessData) return;
    
    const csv = Object.entries(window.bikeShopBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-velomagazyn.csv';
    link.click();
  };
});