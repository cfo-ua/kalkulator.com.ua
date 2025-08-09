document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cash-flow-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Отримання даних з форми
    const businessType = document.getElementById("businessType").value;
    const currentCash = parseFloat(document.getElementById("currentCash").value) || 0;
    
    const averageRevenue = parseFloat(document.getElementById("averageRevenue").value) || 0;
    const cashSalesPercent = parseFloat(document.getElementById("cashSalesPercent").value) || 0;
    const averageCollectionDays = parseInt(document.getElementById("averageCollectionDays").value) || 30;
    
    const salaries = parseFloat(document.getElementById("salaries").value) || 0;
    const rent = parseFloat(document.getElementById("rent").value) || 0;
    const supplies = parseFloat(document.getElementById("supplies").value) || 0;
    const marketing = parseFloat(document.getElementById("marketing").value) || 0;
    const otherExpenses = parseFloat(document.getElementById("otherExpenses").value) || 0;
    
    const quarterlyTaxes = parseFloat(document.getElementById("quarterlyTaxes").value) || 0;
    const equipmentPurchases = parseFloat(document.getElementById("equipmentPurchases").value) || 0;
    const annualInsurance = parseFloat(document.getElementById("annualInsurance").value) || 0;
    
    const seasonalVariation = parseFloat(document.getElementById("seasonalVariation").value) || 0;
    const peakMonthsSelect = document.getElementById("peakMonths");
    const peakMonths = Array.from(peakMonthsSelect.selectedOptions).map(option => parseInt(option.value));

    // Розрахунок базових щомісячних показників
    const monthlyOperatingExpenses = salaries + rent + supplies + marketing + otherExpenses;
    const monthlyTaxes = quarterlyTaxes / 3;
    const monthlyEquipment = equipmentPurchases / 12;
    const monthlyInsurance = annualInsurance / 12;

    // Створення 12-місячного прогнозу
    const forecast = [];
    let cumulativeCash = currentCash;

    for (let month = 1; month <= 12; month++) {
      // Сезонні коефіцієнти
      const seasonalMultiplier = calculateSeasonalMultiplier(month, peakMonths, seasonalVariation);
      
      // Доходи з врахуванням сезонності
      const monthlyRevenue = averageRevenue * seasonalMultiplier;
      const cashSales = monthlyRevenue * (cashSalesPercent / 100);
      const creditSales = monthlyRevenue * ((100 - cashSalesPercent) / 100);
      
      // Інкасація дебіторської заборгованості (з затримкою)
      const receivablesCollection = month === 1 ? 
        creditSales * 0.7 : // в першому місяці частково старі борги
        forecast[month - 2] ? forecast[month - 2].creditSales * 0.8 : creditSales * 0.8;

      const totalInflows = cashSales + receivablesCollection;

      // Витрати з врахуванням сезонності для змінних витрат
      const adjustedSupplies = supplies * seasonalMultiplier;
      const adjustedMarketing = marketing * (seasonalMultiplier > 1 ? seasonalMultiplier : 1);
      
      // Періодичні витрати
      const quarterlyTaxPayment = [3, 6, 9, 12].includes(month) ? quarterlyTaxes : 0;
      const annualInsurancePayment = month === 1 ? annualInsurance : 0;
      const equipmentPayment = month === 6 ? equipmentPurchases : 0; // раз на рік в середині року

      const totalOutflows = salaries + rent + adjustedSupplies + adjustedMarketing + 
                           otherExpenses + quarterlyTaxPayment + annualInsurancePayment + equipmentPayment;

      // Чистий грошовий потік
      const netCashFlow = totalInflows - totalOutflows;
      cumulativeCash += netCashFlow;

      forecast.push({
        month: month,
        monthName: getMonthName(month),
        revenue: monthlyRevenue,
        cashSales: cashSales,
        creditSales: creditSales,
        receivablesCollection: receivablesCollection,
        totalInflows: totalInflows,
        fixedExpenses: salaries + rent + otherExpenses,
        variableExpenses: adjustedSupplies + adjustedMarketing,
        periodicExpenses: quarterlyTaxPayment + annualInsurancePayment + equipmentPayment,
        totalOutflows: totalOutflows,
        netCashFlow: netCashFlow,
        cumulativeCash: cumulativeCash,
        seasonalMultiplier: seasonalMultiplier
      });
    }

    // Аналіз результатів
    const analysis = analyzeForcast(forecast, currentCash);

    // Форматування валюти
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    // Відображення результатів
    document.getElementById("cash-flow-result").innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${analysis.cashPositionColor}">
          <h6>💰 Мінімальний залишок</h6>
          <div class="big-number">${formatCurrency(analysis.minCash)}</div>
          <p>${analysis.minCashMonth}</p>
        </div>
        
        <div class="insight-card ${analysis.flowHealthColor}">
          <h6>📊 Середній місячний потік</h6>
          <div class="big-number">${formatCurrency(analysis.avgNetFlow)}</div>
          <p>${analysis.avgNetFlow >= 0 ? 'Позитивний' : 'Негативний'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📈 Загальне зростання</h6>
          <div class="big-number">${formatCurrency(analysis.totalGrowth)}</div>
          <p>за 12 місяців</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📋 Детальний аналіз грошових потоків</h4>
        
        ${analysis.criticalMonths.length > 0 ? `
          <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #ffc107;">
            <h5>⚠️ Критичні періоди:</h5>
            <p>Низький рівень грошових коштів очікується в: <strong>${analysis.criticalMonths.join(', ')}</strong></p>
          </div>
        ` : ''}

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Місяць</th>
                <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Доходи</th>
                <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Витрати</th>
                <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Чистий потік</th>
                <th style="padding: 0.5rem; border: 1px solid #dee2e6;">Залишок</th>
              </tr>
            </thead>
            <tbody>
              ${forecast.map(month => `
                <tr>
                  <td style="padding: 0.5rem; border: 1px solid #dee2e6; font-weight: 600;">${month.monthName}</td>
                  <td style="padding: 0.5rem; border: 1px solid #dee2e6; color: #28a745;">${formatCurrency(month.totalInflows)}</td>
                  <td style="padding: 0.5rem; border: 1px solid #dee2e6; color: #dc3545;">${formatCurrency(month.totalOutflows)}</td>
                  <td style="padding: 0.5rem; border: 1px solid #dee2e6; color: ${month.netCashFlow >= 0 ? '#28a745' : '#dc3545'}; font-weight: 600;">
                    ${formatCurrency(month.netCashFlow)}
                  </td>
                  <td style="padding: 0.5rem; border: 1px solid #dee2e6; color: ${month.cumulativeCash >= 0 ? '#157aff' : '#dc3545'}; font-weight: 600;">
                    ${formatCurrency(month.cumulativeCash)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 1.5rem;">
          <h4>🎯 Ключові показники</h4>
          
          <div class="insight-cards">
            <div class="insight-card">
              <h6>📊 Операційна ефективність</h6>
              <small>
                • Середня маржа: ${(analysis.avgMargin * 100).toFixed(1)}%<br>
                • Покриття фіксованих витрат: ${analysis.fixedCostCoverage.toFixed(1)}x<br>
                • Оборотність грошових коштів: ${analysis.cashTurnover.toFixed(1)} разів
              </small>
            </div>
            
            <div class="insight-card">
              <h6>⚡ Ліквідність</h6>
              <small>
                • Дні без надходжень: ${analysis.daysWithoutIncome} днів<br>
                • Коефіцієнт ліквідності: ${analysis.liquidityRatio.toFixed(2)}<br>
                • Безпечний резерв: ${formatCurrency(analysis.safetyReserve)}
              </small>
            </div>
            
            <div class="insight-card">
              <h6>📈 Сезонність</h6>
              <small>
                • Найкращий місяць: ${analysis.bestMonth}<br>
                • Найгірший місяць: ${analysis.worstMonth}<br>
                • Сезонна амплітуда: ${(analysis.seasonalAmplitude * 100).toFixed(1)}%
              </small>
            </div>
          </div>
        </div>

        ${generateRecommendations(analysis, forecast)}
      </div>
    `;

    // Показати графік
    const chartBlock = document.getElementById("cash-flow-chart-block");
    if (chartBlock) {
      chartBlock.style.display = "block";
      createCashFlowChart(forecast);
    }
  });

  function calculateSeasonalMultiplier(month, peakMonths, variation) {
    const baseMultiplier = 1.0;
    const maxVariation = variation / 100;
    
    if (peakMonths.includes(month)) {
      return baseMultiplier + maxVariation;
    } else if (peakMonths.length > 0) {
      // Інші місяці мають зниження
      return baseMultiplier - (maxVariation * 0.5);
    }
    
    return baseMultiplier;
  }

  function getMonthName(month) {
    const months = [
      'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
      'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];
    return months[month - 1];
  }

  function analyzeForcast(forecast, initialCash) {
    const minCash = Math.min(...forecast.map(m => m.cumulativeCash));
    const maxCash = Math.max(...forecast.map(m => m.cumulativeCash));
    const finalCash = forecast[forecast.length - 1].cumulativeCash;
    const totalGrowth = finalCash - initialCash;
    const avgNetFlow = forecast.reduce((sum, m) => sum + m.netCashFlow, 0) / 12;
    
    const minCashMonth = forecast.find(m => m.cumulativeCash === minCash);
    const criticalMonths = forecast.filter(m => m.cumulativeCash < 100000).map(m => m.monthName);
    
    // Аналіз маржі
    const totalRevenue = forecast.reduce((sum, m) => sum + m.revenue, 0);
    const totalExpenses = forecast.reduce((sum, m) => sum + m.totalOutflows, 0);
    const avgMargin = (totalRevenue - totalExpenses) / totalRevenue;
    
    // Аналіз покриття фіксованих витрат
    const avgFixedCosts = forecast.reduce((sum, m) => sum + m.fixedExpenses, 0) / 12;
    const avgRevenue = totalRevenue / 12;
    const fixedCostCoverage = avgRevenue / avgFixedCosts;
    
    // Оборотність грошових коштів
    const avgCash = (initialCash + finalCash) / 2;
    const cashTurnover = totalRevenue / avgCash;
    
    // Ліквідність
    const daysWithoutIncome = (minCash / (totalExpenses / 12)) * 30;
    const liquidityRatio = minCash / avgFixedCosts;
    const safetyReserve = avgFixedCosts * 2; // 2 місяці фіксованих витрат
    
    // Сезонність
    const revenues = forecast.map(m => m.revenue);
    const bestMonth = forecast.find(m => m.revenue === Math.max(...revenues)).monthName;
    const worstMonth = forecast.find(m => m.revenue === Math.min(...revenues)).monthName;
    const seasonalAmplitude = (Math.max(...revenues) - Math.min(...revenues)) / avgRevenue;

    return {
      minCash,
      minCashMonth: minCashMonth.monthName,
      cashPositionColor: minCash < 0 ? 'warning' : minCash < 100000 ? 'info' : 'success',
      totalGrowth,
      avgNetFlow,
      flowHealthColor: avgNetFlow >= 0 ? 'success' : 'warning',
      criticalMonths,
      avgMargin,
      fixedCostCoverage,
      cashTurnover,
      daysWithoutIncome: Math.max(0, daysWithoutIncome),
      liquidityRatio,
      safetyReserve,
      bestMonth,
      worstMonth,
      seasonalAmplitude
    };
  }

  function generateRecommendations(analysis, forecast) {
    const recommendations = [];

    if (analysis.minCash < 0) {
      recommendations.push("🚨 <strong>Критично:</strong> Прогнозується дефіцит коштів. Розгляньте залучення кредитної лінії");
    }
    
    if (analysis.minCash < 100000) {
      recommendations.push("⚠️ Низький рівень ліквідності. Створіть резерв щонайменше на 2 місяці витрат");
    }
    
    if (analysis.avgMargin < 0.15) {
      recommendations.push("📊 Низька маржа прибутку. Розгляньте оптимізацію витрат або підвищення цін");
    }
    
    if (analysis.seasonalAmplitude > 0.5) {
      recommendations.push("📈 Висока сезонність. Плануйте додаткові кошти на низький сезон");
    }
    
    if (analysis.daysWithoutIncome < 30) {
      recommendations.push("💰 Створіть резерв грошових коштів принаймні на 30 днів роботи");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ Прогноз виглядає стабільно. Продовжуйте моніторити показники");
    }

    return `
      <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid var(--accent);">
        <h5>💡 Рекомендації з оптимізації:</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          <li>📋 Регулярно оновлюйте прогноз на основі фактичних даних</li>
          <li>🤝 Ведіть переговори з постачальниками про відстрочку платежів</li>
          <li>⚡ Стимулюйте швидші платежі від клієнтів знижками</li>
          <li>📊 Автоматизуйте процес інкасації дебіторської заборгованості</li>
        </ul>
      </div>
    `;
  }

  function createCashFlowChart(forecast) {
    const canvas = document.getElementById("cash-flow-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Налаштування canvas - responsive height from container
    const width = canvas.offsetWidth;
    const container = canvas.parentElement;
    const height = container ? container.offsetHeight - 40 : Math.min(340, Math.max(168, width * 0.4));
    canvas.width = width;
    canvas.height = height;

    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Знаходимо мінімальні та максимальні значення
    const revenues = forecast.map(m => m.totalInflows);
    const expenses = forecast.map(m => m.totalOutflows);
    const cashBalances = forecast.map(m => m.cumulativeCash);
    
    const maxRevenue = Math.max(...revenues);
    const maxExpense = Math.max(...expenses);
    const maxCash = Math.max(...cashBalances);
    const minCash = Math.min(...cashBalances);
    
    const maxValue = Math.max(maxRevenue, maxExpense, maxCash);
    const minValue = Math.min(0, minCash);
    const range = maxValue - minValue;

    // Функції для перетворення координат
    const xScale = (index) => padding + (index / 11) * chartWidth;
    const yScale = (value) => padding + (1 - (value - minValue) / range) * chartHeight;

    // Малювання сітки
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;

    // Вертикальні лінії (місяці)
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(xScale(i), padding);
      ctx.lineTo(xScale(i), height - padding);
      ctx.stroke();
    }

    // Горизонтальні лінії
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Малювання стовпчиків доходів (зелений)
    ctx.fillStyle = 'rgba(40, 167, 69, 0.7)';
    forecast.forEach((month, index) => {
      const x = xScale(index);
      const y = yScale(month.totalInflows);
      const barWidth = chartWidth / 12 * 0.3;
      ctx.fillRect(x - barWidth/2, y, barWidth, yScale(0) - y);
    });

    // Малювання стовпчиків витрат (червоний)
    ctx.fillStyle = 'rgba(220, 53, 69, 0.7)';
    forecast.forEach((month, index) => {
      const x = xScale(index) + chartWidth / 12 * 0.2;
      const y = yScale(month.totalOutflows);
      const barWidth = chartWidth / 12 * 0.3;
      ctx.fillRect(x - barWidth/2, y, barWidth, yScale(0) - y);
    });

    // Лінія залишку грошових коштів (синя)
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    forecast.forEach((month, index) => {
      const x = xScale(index);
      const y = yScale(month.cumulativeCash);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Маркери на лінії
    ctx.fillStyle = '#157aff';
    forecast.forEach((month, index) => {
      const x = xScale(index);
      const y = yScale(month.cumulativeCash);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Нульова лінія
    if (minValue < 0) {
      ctx.strokeStyle = '#dc3545';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, yScale(0));
      ctx.lineTo(width - padding, yScale(0));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Підписи місяців
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    forecast.forEach((month, index) => {
      ctx.fillText(month.monthName.substring(0, 3), xScale(index), height - 20);
    });

    // Підписи значень на осі Y
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (range * (5 - i) / 5);
      const formattedValue = (value / 1000000).toFixed(1) + 'М';
      ctx.fillText(formattedValue, padding - 10, padding + (i / 5) * chartHeight + 5);
    }

    // Легенда
    ctx.textAlign = 'left';
    ctx.font = '14px Arial';

    // Доходи
    ctx.fillStyle = 'rgba(40, 167, 69, 0.7)';
    ctx.fillRect(20, 20, 15, 15);
    ctx.fillStyle = '#28a745';
    ctx.fillText('Доходи', 45, 32);

    // Витрати
    ctx.fillStyle = 'rgba(220, 53, 69, 0.7)';
    ctx.fillRect(20, 45, 15, 15);
    ctx.fillStyle = '#dc3545';
    ctx.fillText('Витрати', 45, 57);

    // Залишок коштів
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, 75);
    ctx.lineTo(35, 75);
    ctx.stroke();
    ctx.fillStyle = '#157aff';
    ctx.fillText('Залишок коштів', 45, 80);

    // Заголовки осей
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Місяці', width / 2, height - 5);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Сума (грн)', 0, 0);
    ctx.restore();
  }
});