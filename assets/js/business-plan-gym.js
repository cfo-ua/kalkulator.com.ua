document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gym-form');
  const result = document.getElementById('gym-result');

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

      const gymArea = parseInt(document.getElementById('gym-area').value);
      const propertyCost = parseFloat(document.getElementById('property-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyFee = parseFloat(document.getElementById('monthly-fee').value);
      const targetMembers = parseInt(document.getElementById('target-members').value);
      const retentionRate = parseFloat(document.getElementById('retention-rate').value);
      const personalTrainingRate = parseFloat(document.getElementById('personal-training-rate').value);
      const personalSessions = parseInt(document.getElementById('personal-sessions').value);
      const rentCost = parseFloat(document.getElementById('rent-cost').value);
      const staffCosts = parseFloat(document.getElementById('staff-costs').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const marketing = parseFloat(document.getElementById('marketing').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      if (gymArea <= 0 || monthlyFee <= 0 || targetMembers <= 0 || retentionRate <= 0) {
        result.innerHTML = '<div class="error">Будь ласка, введіть коректні значення для всіх полів.</div>';
        return;
      }

      // Total startup investment
      const totalStartupCost = propertyCost + equipmentCost + renovationCost + additionalCosts;

      // Member calculations with retention rate
      const effectiveMembers = targetMembers * (retentionRate / 100);
      const monthlyMembershipRevenue = effectiveMembers * monthlyFee;
      
      // Personal training revenue
      const personalTrainingRevenue = personalSessions * personalTrainingRate;
      
      // Additional revenue streams (supplements, drinks, merchandise)
      const additionalRevenue = monthlyMembershipRevenue * 0.08; // 8% from additional services
      
      // Total monthly revenue
      const totalMonthlyRevenue = monthlyMembershipRevenue + personalTrainingRevenue + additionalRevenue;
      const annualRevenue = totalMonthlyRevenue * 12;

      // Monthly expenses
      const totalMonthlyExpenses = rentCost + staffCosts + utilities + marketing + otherExpenses;
      const annualExpenses = totalMonthlyExpenses * 12;
      
      // Profit calculations
      const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
      const annualNetProfit = monthlyNetProfit * 12;
      const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;
      
      // ROI and payback calculations
      const paybackYears = totalStartupCost / annualNetProfit;
      const annualROI = (annualNetProfit / totalStartupCost) * 100;

      // Efficiency metrics
      const revenuePerMember = (monthlyMembershipRevenue / effectiveMembers) || 0;
      const revenuePerSqM = totalMonthlyRevenue / gymArea;
      const membersPerSqM = effectiveMembers / gymArea;
      const capacityUtilization = (effectiveMembers / (gymArea / 10)) * 100; // 10 sqm per person standard

      // Member acquisition cost
      const memberAcquisitionCost = (marketing * 12) / (targetMembers * 0.3); // 30% new members annually
      
      // Breakeven analysis
      const breakEvenMembers = totalMonthlyExpenses / monthlyFee;
      const membershipFillRate = (effectiveMembers / targetMembers) * 100;

      let profitabilityType = 'info';
      if (monthlyNetProfit < 0) profitabilityType = 'warning';
      else if (profitMargin > 25) profitabilityType = 'success';

      let roiType = 'info';
      if (annualROI < 20) roiType = 'warning';
      else if (annualROI > 35) roiType = 'success';

      let utilizationType = 'info';
      if (capacityUtilization < 50) utilizationType = 'warning';
      else if (capacityUtilization > 80) utilizationType = 'success';

      result.innerHTML = `
        <div class="business-plan-results">
          <h3>🏋️ Бізнес-план спортзалу</h3>
          
          <div class="insight-cards">
            ${createInsightCard('💰 Загальні інвестиції', formatNumber(totalStartupCost), 'Стартовий капітал', 'info')}
            ${createInsightCard('📈 Щомісячний прибуток', formatNumber(monthlyNetProfit), `Маржа: ${formatPercent(profitMargin)}`, profitabilityType)}
            ${createInsightCard('⏱️ Термін окупності', `${paybackYears.toFixed(1)} років`, `ROI: ${formatPercent(annualROI)}`, paybackYears <= 4 ? 'success' : 'warning')}
            ${createInsightCard('👥 Активні члени', effectiveMembers.toFixed(0), `Заповнення: ${formatPercent(membershipFillRate)}`, utilizationType)}
          </div>

          <div class="financial-breakdown">
            <h4>💼 Детальний фінансовий аналіз</h4>
            
            <div class="section">
              <h5>🏗️ Стартові витрати</h5>
              <div class="breakdown-table">
                <div class="breakdown-row">
                  <span>Приміщення (купівля/застава)</span>
                  <span>${formatNumber(propertyCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Обладнання та тренажери</span>
                  <span>${formatNumber(equipmentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Ремонт та дизайн</span>
                  <span>${formatNumber(renovationCost)}</span>
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
                  <span>Абонементи (${effectiveMembers.toFixed(0)} членів × $${monthlyFee})</span>
                  <span>${formatNumber(monthlyMembershipRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Персональні тренування (${personalSessions} сесій)</span>
                  <span>${formatNumber(personalTrainingRevenue)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Додаткові послуги та товари</span>
                  <span>${formatNumber(additionalRevenue)}</span>
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
                  <span>${formatNumber(rentCost)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Персонал (тренери, адміністратори)</span>
                  <span>${formatNumber(staffCosts)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Комунальні послуги</span>
                  <span>${formatNumber(utilities)}</span>
                </div>
                <div class="breakdown-row">
                  <span>Маркетинг та реклама</span>
                  <span>${formatNumber(marketing)}</span>
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
              <h6>📊 Ефективність залу</h6>
              <div class="metric-subtitle">
                Дохід на м²: <strong>${formatNumber(revenuePerSqM)}/місяць</strong><br>
                Членів на м²: <strong>${membersPerSqM.toFixed(1)}</strong><br>
                Завантаженість: <strong>${formatPercent(capacityUtilization)}</strong>
              </div>
            </div>
            <div class="insight-card ${monthlyNetProfit > 0 ? 'success' : 'warning'}">
              <h6>👥 Аналіз членства</h6>
              <div class="metric-subtitle">
                Дохід на члена: <strong>${formatNumber(revenuePerMember)}/місяць</strong><br>
                Точка беззбитковості: <strong>${breakEvenMembers.toFixed(0)} членів</strong><br>
                Вартість залучення: <strong>${formatNumber(memberAcquisitionCost)}</strong>
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
                Макс. дохід (100% заповнення): <strong>${formatNumber((targetMembers * monthlyFee + personalTrainingRevenue + additionalRevenue) * 12)}/рік</strong><br>
                Резерв росту: <strong>${formatPercent(100 - membershipFillRate)}</strong><br>
                Потенційний додатковий дохід: <strong>+${formatNumber((targetMembers - effectiveMembers) * monthlyFee * 12)}</strong>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h4>🎯 Рекомендації для оптимізації</h4>
            <ul>
              ${profitMargin < 15 ? '<li>⚠️ Низька рентабельність. Розгляньте підвищення тарифів або зниження витрат.</li>' : ''}
              ${capacityUtilization < 50 ? '<li>📍 Низька завантаженість. Покращте маркетинг або знизьте ціни.</li>' : ''}
              ${paybackYears > 5 ? '<li>⏰ Довгий термін окупності. Оптимізуйте стартові витрати або підвищте доходи.</li>' : ''}
              ${capacityUtilization > 85 ? '<li>✅ Висока завантаженість! Розгляньте підвищення тарифів або розширення.</li>' : ''}
              ${profitMargin > 30 ? '<li>🎉 Відмінна рентабельність! Можете розглянути відкриття додаткових залів.</li>' : ''}
              <li>🏋️ Розвивайте персональні тренування - вони дають найвищу маржу (50-70%).</li>
              <li>📱 Впровадьте мобільний додаток для бронювання та лояльності клієнтів.</li>
              <li>🎯 Створіть спеціалізовані програми: жіночий фітнес, функціонал, кросфіт.</li>
              <li>🤝 Розвивайте корпоративні програми для стабільного доходу.</li>
              <li>💊 Додайте продаж спортивного харчування та аксесуарів.</li>
              <li>⭐ Інвестуйте в утримання клієнтів - дешевше, ніж залучення нових.</li>
              <li>📈 Впровадьте різні типи абонементів: преміум, студентські, сімейні.</li>
              <li>🌟 Регулярно оновлюйте обладнання та програми тренувань.</li>
            </ul>
          </div>

          <div class="print-section">
            <button onclick="window.print()" class="print-btn">🖨️ Роздрукувати бізнес-план</button>
            <button onclick="downloadCSV()" class="download-btn">📥 Завантажити дані (CSV)</button>
          </div>
        </div>
      `;

      // Store data for CSV download
      window.gymBusinessData = {
        'Площа залу (м²)': gymArea,
        'Загальні інвестиції ($)': totalStartupCost,
        'Цільова кількість членів': targetMembers,
        'Ефективна кількість членів': effectiveMembers.toFixed(0),
        'Щомісячний дохід ($)': totalMonthlyRevenue,
        'Щомісячні витрати ($)': totalMonthlyExpenses,
        'Щомісячний прибуток ($)': monthlyNetProfit,
        'Річний прибуток ($)': annualNetProfit,
        'Маржа прибутку (%)': profitMargin,
        'ROI на рік (%)': annualROI,
        'Термін окупності (років)': paybackYears,
        'Дохід на члена ($)': revenuePerMember,
        'Завантаженість залу (%)': capacityUtilization,
        'Точка беззбитковості (членів)': breakEvenMembers.toFixed(0)
      };
    });
  }

  // CSV download function
  window.downloadCSV = function() {
    if (!window.gymBusinessData) return;
    
    const csv = Object.entries(window.gymBusinessData)
      .map(([key, value]) => `"${key}","${typeof value === 'number' ? value.toFixed(2) : value}"`)
      .join('\n');
    
    const blob = new Blob(['\ufeff' + 'Показник,Значення\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biznes-plan-sportzal.csv';
    link.click();
  };
});