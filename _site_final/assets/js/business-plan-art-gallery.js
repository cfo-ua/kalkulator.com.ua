document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gallery-form');
  const result = document.getElementById('gallery-result');

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

      const galleryArea = parseFloat(document.getElementById('gallery-area').value);
      const renovationCostSqm = parseFloat(document.getElementById('renovation-cost-sqm').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const initialExpenses = parseFloat(document.getElementById('initial-expenses').value);
      const avgArtworkPrice = parseFloat(document.getElementById('avg-artwork-price').value);
      const monthlySales = parseFloat(document.getElementById('monthly-sales').value);
      const commissionRate = parseFloat(document.getElementById('commission-rate').value);
      const additionalServices = parseFloat(document.getElementById('additional-services').value);
      const rent = parseFloat(document.getElementById('rent').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const marketing = parseFloat(document.getElementById('marketing').value);
      const utilitiesOther = parseFloat(document.getElementById('utilities-other').value);

      if (galleryArea <= 0 || monthlySales <= 0 || avgArtworkPrice <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const renovationCost = galleryArea * renovationCostSqm;
      const totalStartupCost = renovationCost + equipmentCost + initialExpenses;

      // Revenue calculations
      const monthlyArtworkRevenue = monthlySales * avgArtworkPrice;
      const galleryCommission = monthlyArtworkRevenue * (commissionRate / 100);
      const totalMonthlyRevenue = galleryCommission + additionalServices;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = rent + staffCosts + marketing + utilitiesOther;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerSqm = totalMonthlyRevenue / galleryArea;
      const salesVolume = monthlySales;
      const avgCommissionPerSale = galleryCommission / monthlySales;
      const costPerSqm = totalMonthlyExpenses / galleryArea;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 35) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 15) roiType = 'warning';
      else if (annualROI > 30) roiType = 'success';

      let paybackType = 'info';
      if (paybackYears > 5) paybackType = 'warning';
      else if (paybackYears <= 3) paybackType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🎨 Бізнес-план художньої галереї</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), `${galleryArea} м²`, 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackType)}
            ${createInsightCard('🎯 Продажі', `${monthlySales} робіт/міс`, `${formatNumber(avgCommissionPerSale)} комісія`, 'info')}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Ремонт та облаштування (${galleryArea} м² × ${formatNumber(renovationCostSqm)})</span>
                  <span>${formatNumber(renovationCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання (освітлення, безпека, меблі)</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Початкові витрати (реклама, перші роботи)</span>
                  <span>${formatNumber(initialExpenses)}</span>
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
                  <span>Продажі робіт (${monthlySales} × ${formatNumber(avgArtworkPrice)})</span>
                  <span>${formatNumber(monthlyArtworkRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комісія галереї (${formatPercent(commissionRate)})</span>
                  <span>${formatNumber(galleryCommission)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги (майстер-класи, оренда)</span>
                  <span>${formatNumber(additionalServices)}</span>
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
                  <span>Оренда приміщення</span>
                  <span>${formatNumber(rent)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Персонал (куратор, охорона)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та просування</span>
                  <span>${formatNumber(marketing)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні та інші витрати</span>
                  <span>${formatNumber(utilitiesOther)}</span>
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
              <h6>🔄 Ефективність площі</h6>
              <div class="metric-subtitle">
                Дохід на м²: <strong>${formatNumber(revenuePerSqm)}/міс</strong><br>
                Витрати на м²: <strong>${formatNumber(costPerSqm)}/міс</strong><br>
                Середня комісія: <strong>${formatNumber(avgCommissionPerSale)}</strong>
              </div>
            </div>
            <div class="insight-card ${commissionRate >= 50 ? 'success' : 'info'}">
              <h6>📊 Структура доходів</h6>
              <div class="metric-subtitle">
                Комісія з продажів: <strong>${formatPercent((galleryCommission/totalMonthlyRevenue)*100)}</strong><br>
                Додаткові послуги: <strong>${formatPercent((additionalServices/totalMonthlyRevenue)*100)}</strong><br>
                Ставка комісії: <strong>${formatPercent(commissionRate)}</strong>
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
                При +50% продажів: <strong>${formatNumber(monthlyNetProfit + (galleryCommission * 0.5))}/міс</strong><br>
                При підвищенні цін на 20%: <strong>${formatNumber(monthlyNetProfit + (galleryCommission * 0.2))}/міс</strong><br>
                Оборот на м²: <strong>${formatNumber(monthlyArtworkRevenue / galleryArea)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 20 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення комісії або зниження витрат.</li>' : ''}
              ${monthlySales < 5 ? '<li>📍 Низькі продажі. Покращте кураторську програму та маркетинг.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або збільште доходи.</li>' : ''}
              ${monthlySales > 15 ? '<li>✅ Високі продажі! Розгляньте розширення галереї або підвищення цін.</li>' : ''}
              ${profitMargin > 35 ? '<li>🎉 Відмінна рентабельність! Інвестуйте в розвиток та розширення.</li>' : ''}
              <li>🎨 Розвивайте стосунки з місцевими художниками та арт-школами.</li>
              <li>📱 Створюйте сильну онлайн-присутність та віртуальні виставки.</li>
              <li>🎪 Організовуйте регулярні арт-події та відкриття виставок.</li>
              <li>🤝 Встановлюйте партнерства з дизайнерами інтер'єрів.</li>
              <li>💼 Розвивайте корпоративний сегмент для оформлення офісів.</li>
              <li>📚 Додайте освітні програми та майстер-класи для стабільного доходу.</li>
              <li>🌐 Участь у арт-ярмарках та міжнародних виставках.</li>
              <li>🎯 Фокусуйтеся на унікальних художниках та ексклюзивних роботах.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.galleryBusinessData = {
        'Площа галереї (м²)': galleryArea,
        'Загальні інвестиції ($)': totalStartupCost,
        'Щомісячний дохід ($)': totalMonthlyRevenue,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Продажі на місяць (шт)': monthlySales,
        'Середня ціна роботи ($)': avgArtworkPrice,
        'Комісія галереї (%)': commissionRate,
        'Дохід на м² ($)': revenuePerSqm
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.galleryBusinessData) return;
    
    const csv = Object.entries(window.galleryBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-galereya.csv';
    link.click();
  };
});