document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('clothing-store-form');
  const result = document.getElementById('clothing-store-result');

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

  function generateCSVData(data) {
    const csvData = [
      ['Показник', 'Значення'],
      ['Загальні стартові інвестиції', `$${data.totalInvestment.toLocaleString()}`],
      ['Щомісячний дохід', `$${data.monthlyRevenue.toLocaleString()}`],
      ['Щомісячні витрати', `$${data.monthlyExpenses.toLocaleString()}`],
      ['Щомісячний чистий прибуток', `$${data.monthlyProfit.toLocaleString()}`],
      ['Річний дохід', `$${data.annualRevenue.toLocaleString()}`],
      ['Річний чистий прибуток', `$${data.annualProfit.toLocaleString()}`],
      ['Термін окупності (років)', data.paybackPeriod.toFixed(1)],
      ['ROI (%)', data.roi.toFixed(1)],
      ['Маржа прибутку (%)', data.profitMargin.toFixed(1)]
    ];
    
    return csvData.map(row => row.join(',')).join('\n');
  }

  function downloadCSV(data) {
    const csv = generateCSVData(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clothing_store_business_plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Update markup based on store type selection
  const storeTypeSelect = document.getElementById('store-type');
  const markupInput = document.getElementById('markup-percent');

  if (storeTypeSelect && markupInput) {
    storeTypeSelect.addEventListener('change', function() {
      const type = this.value;
      switch(type) {
        case 'mass':
          markupInput.value = 120;
          break;
        case 'mid':
          markupInput.value = 180;
          break;
        case 'premium':
          markupInput.value = 250;
          break;
        case 'boutique':
          markupInput.value = 300;
          break;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const area = parseFloat(document.getElementById('area').value);
      const storeType = document.getElementById('store-type').value;
      const inventoryCost = parseFloat(document.getElementById('inventory-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const markupPercent = parseFloat(document.getElementById('markup-percent').value);
      const monthlySalesCost = parseFloat(document.getElementById('monthly-sales-cost').value);
      const inventoryTurnover = parseFloat(document.getElementById('inventory-turnover').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const marketing = parseFloat(document.getElementById('marketing').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Calculate total startup investment
      const totalInvestment = inventoryCost + equipmentCost + renovationCost + additionalCosts;

      // Calculate monthly revenue (Cost + Markup)
      const monthlyRevenue = monthlySalesCost * (1 + markupPercent / 100);

      // Calculate monthly expenses
      const monthlyExpenses = monthlyRent + staffSalaries + monthlySalesCost + utilities + marketing + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate efficiency metrics
      const revenuePerSqUnit = monthlyRevenue / area;
      const grossMargin = ((monthlyRevenue - monthlySalesCost) / monthlyRevenue) * 100;
      const averageInventoryValue = inventoryCost;
      const inventoryTurnoverMonthly = inventoryTurnover / 12;

      // Retail specific analysis
      const rentPercent = (monthlyRent / monthlyRevenue) * 100;
      const laborCostPercent = (staffSalaries / monthlyRevenue) * 100;
      const cogsPercent = (monthlySalesCost / monthlyRevenue) * 100;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = 'Потребує оптимізації';
      if (roi >= 20 && profitMargin >= 15) {
        viabilityType = 'success';
        viabilityMessage = 'Високоприбутковий магазин';
      } else if (roi >= 12 && profitMargin >= 8) {
        viabilityType = 'info';
        viabilityMessage = 'Стабільний бізнес';
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 10) {
        recommendations.push('📈 Підвищіть наукову на товари або знизьте витрати');
        recommendations.push('🛒 Зосередьтеся на товарах з вищою маржею');
      }
      if (rentPercent > 15) {
        recommendations.push('🏢 Розгляньте переїзд у приміщення з меншою орендою');
        recommendations.push('📦 Додайте онлайн-продажі для збільшення оборотності');
      }
      if (inventoryTurnover < 4) {
        recommendations.push('📊 Покращіте управління запасами');
        recommendations.push('💰 Проводьте розпродажі застарілих товарів');
      }
      if (laborCostPercent > 20) {
        recommendations.push('👥 Оптимізуйте графік роботи персоналу');
        recommendations.push('🤖 Впровадьте самообслуговування де можливо');
      }
      if (revenuePerSqUnit < 60) {
        recommendations.push('🎯 Покращіть мерчандайзинг та викладку товарів');
        recommendations.push('📱 Активізуйте маркетинг для залучення клієнтів');
      }
      if (grossMargin < 50) {
        recommendations.push('💎 Додайте товари преміум-сегменту');
        recommendations.push('🏷️ Переглянте ціноутворення та постачальників');
      }

      // Store type specific insights
      const storeTypeNames = {
        'mass': 'Масовий сегмент',
        'mid': 'Середній сегмент', 
        'premium': 'Преміум сегмент',
        'boutique': 'Бутік'
      };

      const data = {
        totalInvestment,
        monthlyRevenue,
        monthlyExpenses,
        monthlyProfit,
        annualRevenue,
        annualProfit,
        paybackPeriod,
        roi,
        profitMargin
      };

      result.innerHTML = `
        <div class="insight-cards">
          ${createInsightCard(
            '💰 Загальні інвестиції',
            formatNumber(totalInvestment),
            'Початковий капітал',
            'info'
          )}
          ${createInsightCard(
            '📈 Щомісячний дохід',
            formatNumber(monthlyRevenue),
            `${storeTypeNames[storeType]}, наукова ${markupPercent}%`,
            'success'
          )}
          ${createInsightCard(
            '💸 Щомісячні витрати',
            formatNumber(monthlyExpenses),
            `Включно з собівартістю ${formatNumber(monthlySalesCost)}`,
            'warning'
          )}
          ${createInsightCard(
            '💵 Чистий прибуток',
            formatNumber(monthlyProfit),
            `Маржа: ${formatPercent(profitMargin)}`,
            viabilityType
          )}
          ${createInsightCard(
            '⏳ Окупність',
            `${paybackPeriod.toFixed(1)} років`,
            paybackPeriod < 3 ? 'Швидка окупність' : paybackPeriod < 5 ? 'Помірна окупність' : 'Повільна окупність',
            paybackPeriod < 3 ? 'success' : paybackPeriod < 5 ? 'info' : 'warning'
          )}
          ${createInsightCard(
            '📊 ROI',
            formatPercent(roi),
            viabilityMessage,
            viabilityType
          )}
        </div>

        <div class="analysis-section">
          <h4>📋 Детальний аналіз магазину одягу</h4>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Річний дохід:</span>
              <span class="metric-value">${formatNumber(annualRevenue)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Річний прибуток:</span>
              <span class="metric-value">${formatNumber(annualProfit)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Дохід на м²:</span>
              <span class="metric-value">${formatNumber(revenuePerSqUnit)}/місяць</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Валова маржа:</span>
              <span class="metric-value">${formatPercent(grossMargin)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Оборотність запасів:</span>
              <span class="metric-value">${inventoryTurnover.toFixed(1)} разів/рік</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Витрати на оренду:</span>
              <span class="metric-value">${formatPercent(rentPercent)} від доходу</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Витрати на персонал:</span>
              <span class="metric-value">${formatPercent(laborCostPercent)} від доходу</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Собівартість товарів:</span>
              <span class="metric-value">${formatPercent(cogsPercent)} від доходу</span>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
          <div class="recommendations">
            <h4>💡 Рекомендації для оптимізації</h4>
            <ul>
              ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="action-buttons">
          <button onclick="window.print()" class="btn-secondary">🖨️ Друкувати звіт</button>
          <button onclick="downloadCSV(${JSON.stringify(data).replace(/"/g, '&quot;')})" class="btn-primary">📊 Завантажити дані CSV</button>
        </div>

        <div class="disclaimer">
          <p><small>⚠️ Розрахунки є приблизними і базуються на введених даних. Реальні показники можуть відрізнятися залежно від сезонності, трендів моди, ефективності закупівель та управління запасами.</small></p>
        </div>
      `;

      // Expose downloadCSV function globally for the button
      window.downloadCSV = downloadCSV;
    });
  }
});