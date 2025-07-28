document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('barbershop-form');
  const result = document.getElementById('barbershop-result');

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

      const workstations = parseInt(document.getElementById('workstations').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const workingCapital = parseFloat(document.getElementById('working-capital').value);
      const avgHaircutPrice = parseFloat(document.getElementById('avg-haircut-price').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const barberCommission = parseFloat(document.getElementById('barber-commission').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (workstations <= 0 || avgHaircutPrice <= 0 || clientsPerDay <= 0 || workingDays <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = renovationCost + equipmentCost + workingCapital;

      // Revenue calculations
      const totalClientsPerDay = workstations * clientsPerDay;
      const dailyRevenue = totalClientsPerDay * avgHaircutPrice;
      const weeklyRevenue = dailyRevenue * workingDays;
      const monthlyRevenue = weeklyRevenue * 4.33; // Average weeks per month
      const annualRevenue = monthlyRevenue * 12;

      // Barber commission costs
      const monthlyBarberCommissions = (monthlyRevenue * barberCommission) / 100;
      const netMonthlyRevenue = monthlyRevenue - monthlyBarberCommissions;

      // Additional services revenue (estimated 15% uplift)
      const additionalServicesRevenue = monthlyRevenue * 0.15;
      const totalMonthlyRevenueWithExtras = monthlyRevenue + additionalServicesRevenue;
      const totalAnnualRevenueWithExtras = totalMonthlyRevenueWithExtras * 12;

      // Monthly expenses
      const totalFixedExpenses = monthlyRent + utilities + supplies + otherExpenses;
      const totalMonthlyExpenses = totalFixedExpenses + monthlyBarberCommissions;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenueWithExtras - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (annualNetProfit / totalAnnualRevenueWithExtras) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerWorkstation = totalAnnualRevenueWithExtras / workstations;
      const clientsPerMonth = totalClientsPerDay * workingDays * 4.33;
      const avgRevenuePerClient = totalMonthlyRevenueWithExtras / clientsPerMonth;
      const utilisationRate = (clientsPerDay / 25) * 100; // Assuming max 25 clients per day per station

      let profitabilityType = 'info';
      if (annualNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 25) roiType = 'warning';
      else if (annualROI > 50) roiType = 'success';

      let utilisationType = 'info';
      if (utilisationRate < 60) utilisationType = 'warning';
      else if (utilisationRate > 80) utilisationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>✂️ Бізнес-план барбершопу</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 1.5 ? 'success' : 'warning')}
            ${createInsightCard('📊 Завантаженість', formatPercent(utilisationRate), `${Math.round(clientsPerMonth)} клієнтів/міс`, utilisationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Ремонт та дизайн</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання та меблі</span>
                  <span>${formatNumber(equipmentCost)}</span>
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
              <h5>💵 Щомісячні доходи</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Основні послуги (${Math.round(clientsPerMonth)} клієнтів × ${formatNumber(avgHaircutPrice)})</span>
                  <span>${formatNumber(monthlyRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги (борода, косметика)</span>
                  <span>${formatNumber(additionalServicesRevenue)}</span>
                </div>
                <div class="breakdown-row total">
                  <span><strong>Загальний щомісячний дохід</strong></span>
                  <span><strong>${formatNumber(totalMonthlyRevenueWithExtras)}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <h5>💸 Щомісячні витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Комісії майстрів (${formatPercent(barberCommission)})</span>
                  <span>${formatNumber(monthlyBarberCommissions)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Оренда приміщення</span>
                  <span>${formatNumber(monthlyRent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні послуги</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Витратні матеріали</span>
                  <span>${formatNumber(supplies)}</span>
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
                Дохід на робоче місце: <strong>${formatNumber(revenuePerWorkstation)}/рік</strong><br>
                Клієнтів на день: <strong>${totalClientsPerDay} (${clientsPerDay}/місце)</strong><br>
                Середній чек: <strong>${formatNumber(avgRevenuePerClient)}</strong>
              </div>
            </div>
            <div class="insight-card ${annualNetProfit > 0 ? 'success' : 'warning'}">
              <h6>📊 Аналіз послуг</h6>
              <div class="metric-subtitle">
                Робочих днів: <strong>${workingDays}/тиждень</strong><br>
                Ціна стрижки: <strong>${formatNumber(avgHaircutPrice)}</strong><br>
                Комісія майстра: <strong>${formatPercent(barberCommission)}</strong>
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
                При +2 клієнти/день: <strong>+${formatNumber((2 * workstations * avgHaircutPrice * workingDays * 4.33 * 12) * (1 - barberCommission/100))}/рік</strong><br>
                При +$2 до ціни: <strong>+${formatNumber((2 * clientsPerMonth * 12) * (1 - barberCommission/100))}/рік</strong><br>
                При +1 робоче місце: <strong>+${formatNumber(revenuePerWorkstation * (1 - barberCommission/100) - (monthlyRent * 12 / workstations))}/рік</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 25 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення цін або зниження комісії майстрів.</li>' : ''}
              ${utilisationRate < 60 ? '<li>📍 Низька завантаженість. Покращте маркетинг або розгляньте зміну локації.</li>' : ''}
              ${paybackYears > 2 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште проходимість.</li>' : ''}
              ${utilisationRate > 85 ? '<li>✅ Висока завантаженість! Розгляньте підвищення цін або розширення.</li>' : ''}
              ${profitMargin > 40 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових точок.</li>' : ''}
              <li>💼 Впровадьте систему онлайн-запису для зручності клієнтів.</li>
              <li>📱 Розвивайте присутність в соціальних мережах, демонструйте роботу майстрів.</li>
              <li>🎯 Додайте послуги догляду за бородою та продаж чоловічої косметики.</li>
              <li>🤝 Створіть програму лояльності для постійних клієнтів.</li>
              <li>📈 Оптимізуйте робочий графік відповідно до пікових годин відвідувань.</li>
              <li>⭐ Інвестуйте в навчання майстрів новим техніками та трендам.</li>
              <li>🎪 Розгляньте тематичні акції та сезонні пропозиції.</li>
              <li>🚗 Забезпечте зручний паркування для клієнтів.</li>
              <li>💎 Створіть преміум-зону з додатковими послугами за вищими цінами.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.barbershopBusinessData = {
        'Кількість робочих місць': workstations,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalMonthlyRevenueWithExtras,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Клієнтів на місяць': clientsPerMonth,
        'Завантаженість (%)': utilisationRate,
        'Ціна стрижки ($)': avgHaircutPrice,
        'Дохід на робоче місце ($)': revenuePerWorkstation
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.barbershopBusinessData) return;
    
    const csv = Object.entries(window.barbershopBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-barbershop.csv';
    link.click();
  };
});