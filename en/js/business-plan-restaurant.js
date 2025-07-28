document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('restaurant-form');
  const result = document.getElementById('restaurant-result');

  function formatNumber(value) {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    } else {
      return value.toLocaleString('en-US', { 
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
      ['Metric', 'Value'],
      ['Total Startup Investment', `$${data.totalInvestment.toLocaleString()}`],
      ['Monthly Revenue', `$${data.monthlyRevenue.toLocaleString()}`],
      ['Monthly Expenses', `$${data.monthlyExpenses.toLocaleString()}`],
      ['Monthly Net Profit', `$${data.monthlyProfit.toLocaleString()}`],
      ['Annual Revenue', `$${data.annualRevenue.toLocaleString()}`],
      ['Annual Net Profit', `$${data.annualProfit.toLocaleString()}`],
      ['Payback Period (years)', data.paybackPeriod.toFixed(1)],
      ['ROI (%)', data.roi.toFixed(1)],
      ['Profit Margin (%)', data.profitMargin.toFixed(1)]
    ];
    
    return csvData.map(row => row.join(',')).join('\n');
  }

  function downloadCSV(data) {
    const csv = generateCSVData(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'restaurant_business_plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const area = parseFloat(document.getElementById('area').value);
      const seats = parseFloat(document.getElementById('seats').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const furnitureCost = parseFloat(document.getElementById('furniture-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const avgCheck = parseFloat(document.getElementById('avg-check').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const cogsPercent = parseFloat(document.getElementById('cogs-percent').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Calculate total startup investment
      const totalInvestment = equipmentCost + renovationCost + furnitureCost + additionalCosts;

      // Calculate monthly revenue
      const monthlyRevenue = avgCheck * clientsPerDay * workingDays;

      // Calculate monthly expenses
      const monthlyCoGS = monthlyRevenue * (cogsPercent / 100);
      const monthlyExpenses = monthlyRent + staffSalaries + monthlyCoGS + utilities + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate efficiency metrics
      const revenuePerSeat = monthlyRevenue / seats;
      const revenuePerSqUnit = monthlyRevenue / area;
      const seatTurnover = clientsPerDay / seats;

      // Restaurant-specific analysis
      const laborCostPercent = (staffSalaries / monthlyRevenue) * 100;
      const rentPercent = (monthlyRent / monthlyRevenue) * 100;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = 'Потребує оптимізації';
      if (roi >= 15 && profitMargin >= 12) {
        viabilityType = 'success';
        viabilityMessage = 'Високоприбутковий ресторан';
      } else if (roi >= 8 && profitMargin >= 6) {
        viabilityType = 'info';
        viabilityMessage = 'Стабільний бізнес';
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 8) {
        recommendations.push('📈 Підвищіть середній чек через меню преміум-позиції');
        recommendations.push('💰 Оптимізуйте витрати на продукти (цільовий показник 28-32%)');
      }
      if (laborCostPercent > 35) {
        recommendations.push('👥 Оптимізуйте штат персоналу (цільовий показник 25-32% від виручки)');
        recommendations.push('🤖 Впровадьте автоматизацію для зменшення потреби в персоналі');
      }
      if (rentPercent > 10) {
        recommendations.push('🏢 Розгляньте переїзд у приміщення з меншою орендою');
        recommendations.push('📦 Додайте доставку для збільшення оборотності без додаткових місць');
      }
      if (seatTurnover < 2) {
        recommendations.push('⏰ Збільшіть оборотність столів через швидший сервіс');
        recommendations.push('🎯 Проведіть маркетингові кампанії для залучення клієнтів');
      }
      if (avgCheck < 20) {
        recommendations.push('🍷 Додайте алкогольні напої та десерти з високою маржею');
        recommendations.push('🎉 Створіть спеціальні пропозиції та сети-меню');
      }

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
            `${clientsPerDay} клієнтів × ${avgCheck}$ × ${workingDays} днів`,
            'success'
          )}
          ${createInsightCard(
            '💸 Щомісячні витрати',
            formatNumber(monthlyExpenses),
            `Включно з ${formatPercent(cogsPercent)} собівартості`,
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
            paybackPeriod < 4 ? 'Швидка окупність' : paybackPeriod < 6 ? 'Помірна окупність' : 'Повільна окупність',
            paybackPeriod < 4 ? 'success' : paybackPeriod < 6 ? 'info' : 'warning'
          )}
          ${createInsightCard(
            '📊 ROI',
            formatPercent(roi),
            viabilityMessage,
            viabilityType
          )}
        </div>

        <div class="analysis-section">
          <h4>📋 Детальний аналіз ресторану</h4>
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
              <span class="metric-label">Дохід на місце:</span>
              <span class="metric-value">${formatNumber(revenuePerSeat)}/місяць</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Дохід на м²:</span>
              <span class="metric-value">${formatNumber(revenuePerSqUnit)}/місяць</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Оборотність столів:</span>
              <span class="metric-value">${seatTurnover.toFixed(1)} за день</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Витрати на персонал:</span>
              <span class="metric-value">${formatPercent(laborCostPercent)} від доходу</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Витрати на оренду:</span>
              <span class="metric-value">${formatPercent(rentPercent)} від доходу</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Собівартість продуктів:</span>
              <span class="metric-value">${formatNumber(monthlyCoGS)}/місяць</span>
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
          <p><small>⚠️ Розрахунки є приблизними і базуються на введених даних. Реальні показники можуть відрізнятися залежно від ринкових умов, локації та ефективності управління ресторану.</small></p>
        </div>
      `;

      // Expose downloadCSV function globally for the button
      window.downloadCSV = downloadCSV;
    });
  }
});