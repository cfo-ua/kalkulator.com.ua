document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('food-truck-form');
  const result = document.getElementById('food-truck-result');

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
    a.download = 'food_truck_business_plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Update truck cost based on type selection
  const truckTypeSelect = document.getElementById('truck-type');
  const truckCostInput = document.getElementById('truck-cost');

  if (truckTypeSelect && truckCostInput) {
    truckTypeSelect.addEventListener('change', function() {
      const type = this.value;
      switch(type) {
        case 'used':
          truckCostInput.value = 45000;
          break;
        case 'new':
          truckCostInput.value = 75000;
          break;
        case 'custom':
          truckCostInput.value = 115000;
          break;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const truckCost = parseFloat(document.getElementById('truck-cost').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const workingDaysWeek = parseFloat(document.getElementById('working-days-week').value);
      const workingHours = parseFloat(document.getElementById('working-hours').value);
      const avgCheck = parseFloat(document.getElementById('avg-check').value);
      const clientsPerHour = parseFloat(document.getElementById('clients-per-hour').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const cogsPercent = parseFloat(document.getElementById('cogs-percent').value);
      const fuelMaintenance = parseFloat(document.getElementById('fuel-maintenance').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Calculate total startup investment
      const totalInvestment = truckCost + equipmentCost + renovationCost + additionalCosts;

      // Calculate monthly revenue (4.33 weeks per month on average)
      const weeksPerMonth = 4.33;
      const monthlyRevenue = avgCheck * clientsPerHour * workingHours * workingDaysWeek * weeksPerMonth;

      // Calculate monthly expenses
      const monthlyCoGS = monthlyRevenue * (cogsPercent / 100);
      const monthlyExpenses = staffSalaries + monthlyCoGS + fuelMaintenance + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate efficiency metrics
      const dailyRevenue = monthlyRevenue / (workingDaysWeek * weeksPerMonth);
      const hourlyRevenue = dailyRevenue / workingHours;
      const revenuePerCustomer = avgCheck;
      const customersPerDay = clientsPerHour * workingHours;

      // Food truck specific analysis
      const laborCostPercent = (staffSalaries / monthlyRevenue) * 100;
      const fuelCostPercent = (fuelMaintenance / monthlyRevenue) * 100;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = 'Потребує оптимізації';
      if (roi >= 20 && profitMargin >= 18) {
        viabilityType = 'success';
        viabilityMessage = 'Високоприбутковий фуд-трак';
      } else if (roi >= 12 && profitMargin >= 10) {
        viabilityType = 'info';
        viabilityMessage = 'Стабільний бізнес';
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 12) {
        recommendations.push('📈 Підвищіть середній чек через комбо-пропозиції');
        recommendations.push('💰 Оптимізуйте витрати на продукти (цільовий показник 25-30%)');
      }
      if (laborCostPercent > 25) {
        recommendations.push('👥 Оптимізуйте штат персоналу для пікових годин');
        recommendations.push('🤖 Впровадьте систему попереднього замовлення');
      }
      if (customersPerDay < 50) {
        recommendations.push('📍 Змініть локації або розклад роботи');
        recommendations.push('📱 Активізуйте маркетинг в соціальних мережах');
      }
      if (hourlyRevenue < 80) {
        recommendations.push('⚡ Прискорьте сервіс для обслуговування більше клієнтів');
        recommendations.push('🎯 Зосередьтеся на найприбутковіших позиціях меню');
      }
      if (fuelCostPercent > 8) {
        recommendations.push('🚚 Оптимізуйте маршрути та локації для економії палива');
        recommendations.push('📍 Шукайте постійні локації зі стабільним трафіком');
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
            `${Math.round(customersPerDay)} клієнтів/день × ${avgCheck}$`,
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
          <h4>📋 Детальний аналіз фуд-траку</h4>
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
              <span class="metric-label">Дохід за годину:</span>
              <span class="metric-value">${formatNumber(hourlyRevenue)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Дохід за день:</span>
              <span class="metric-value">${formatNumber(dailyRevenue)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Клієнтів за день:</span>
              <span class="metric-value">${Math.round(customersPerDay)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Витрати на персонал:</span>
              <span class="metric-value">${formatPercent(laborCostPercent)} від доходу</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Витрати на паливо:</span>
              <span class="metric-value">${formatPercent(fuelCostPercent)} від доходу</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Робочих годин/тиждень:</span>
              <span class="metric-value">${workingHours * workingDaysWeek} годин</span>
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
          <p><small>⚠️ Розрахунки є приблизними і базуються на введених даних. Реальні показники можуть відрізнятися залежно від сезонності, локацій, погодних умов та ефективності управління фуд-траком.</small></p>
        </div>
      `;

      // Expose downloadCSV function globally for the button
      window.downloadCSV = downloadCSV;
    });
  }
});