document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('cafe-form');
  const result = document.getElementById('cafe-result');
  
  // Detect language based on URL
  const isEnglish = window.location.pathname.includes('/en/');
  
  // Language-specific text
  const text = {
    uk: {
      totalInvestment: '💰 Загальні інвестиції',
      initialCapital: 'Початковий капітал',
      monthlyRevenue: '📈 Щомісячний дохід',
      monthlyExpenses: '💸 Щомісячні витрати',
      netProfit: '💵 Чистий прибуток',
      margin: 'Маржа',
      paybackPeriod: '⏳ Окупність',
      roi: '📊 ROI',
      detailedAnalysis: '📋 Детальний аналіз',
      annualRevenue: 'Річний дохід:',
      annualProfit: 'Річний прибуток:',
      capacityUtilization: 'Використання місць:',
      revenuePerSqUnit: 'Дохід на м²:',
      revenuePerSeat: 'Дохід на місце:',
      costOfGoods: 'Собівартість продуктів:',
      recommendations: '💡 Рекомендації',
      optimizationRecommendations: '💡 Рекомендації для оптимізації',
      printReport: '🖨️ Друкувати звіт',
      downloadCsv: '📊 Завантажити дані CSV',
      disclaimer: '⚠️ Розрахунки є приблизними і базуються на введених даних. Реальні показники можуть відрізнятися залежно від ринкових умов, локації та ефективності управління.',
      month: '/місяць',
      errorMessage: 'Будь ласка, введіть коректні значення для всіх полів.',
      csvHeaders: {
        metric: 'Показник',
        value: 'Значення',
        totalInvestment: 'Загальні інвестиції',
        monthlyRevenue: 'Щомісячний дохід',
        monthlyExpenses: 'Щомісячні витрати',
        monthlyProfit: 'Щомісячний прибуток',
        annualRevenue: 'Річний дохід',
        annualProfit: 'Річний прибуток',
        paybackPeriod: 'Термін окупності (років)',
        roiPercent: 'ROI (%)',
        profitMargin: 'Маржа прибутку (%)'
      }
      fastPayback: 'Швидка окупність',
      moderatePayback: 'Помірна окупність',
      slowPayback: 'Повільна окупність',
      highProfitBusiness: 'Високоприбутковий бізнес',
      stableBusiness: 'Стабільний бізнес',
      needsOptimization: 'Потребує оптимізації',
      includesCogs: 'Включно з',
      costOfGoods: 'собівартості',
      clients: 'клієнтів',
      days: 'днів',
      years: 'років',
      recommendations: {
        increaseAvgCheck: '📈 Підвищіть середній чек через меню преміум-класу',
        optimizeCosts: '💰 Оптимізуйте витрати на продукти (цільовий показник 25-30%)',
        attractClients: '🎯 Залучіть більше клієнтів через маркетинг та програми лояльності',
        expandHours: '⏰ Розширте робочі години або додайте послуги доставки',
        reduceSpace: '🏢 Розгляньте меншу площу для зниження оренди',
        addTakeaway: '📦 Додайте takeaway формат для збільшення оборотності',
        addSpecialties: '☕ Запропонуйте спеціальні кавові напої та десерти',
        expandMenu: '🥐 Розширте меню снідаків та легких обідів'
      }
    },
    en: {
      totalInvestment: '💰 Total Investment',
      initialCapital: 'Initial Capital',
      monthlyRevenue: '📈 Monthly Revenue',
      monthlyExpenses: '💸 Monthly Expenses',
      netProfit: '💵 Net Profit',
      margin: 'Margin',
      paybackPeriod: '⏳ Payback Period',
      roi: '📊 ROI',
      detailedAnalysis: '📋 Detailed Analysis',
      annualRevenue: 'Annual Revenue:',
      annualProfit: 'Annual Profit:',
      capacityUtilization: 'Capacity Utilization:',
      revenuePerSqUnit: 'Revenue per sq ft:',
      revenuePerSeat: 'Revenue per Seat:',
      costOfGoods: 'Cost of Goods:',
      recommendations: '💡 Recommendations',
      optimizationRecommendations: '💡 Optimization Recommendations',
      printReport: '🖨️ Print Report',
      downloadCsv: '📊 Download CSV Data',
      disclaimer: '⚠️ Calculations are approximate and based on input data. Actual results may vary depending on market conditions, location, and management efficiency.',
      month: '/month',
      errorMessage: 'Please enter valid values for all fields.',
      csvHeaders: {
        metric: 'Metric',
        value: 'Value',
        totalInvestment: 'Total Startup Investment',
        monthlyRevenue: 'Monthly Revenue',
        monthlyExpenses: 'Monthly Expenses',
        monthlyProfit: 'Monthly Net Profit',
        annualRevenue: 'Annual Revenue',
        annualProfit: 'Annual Net Profit',
        paybackPeriod: 'Payback Period (years)',
        roiPercent: 'ROI (%)',
        profitMargin: 'Profit Margin (%)'
      }
      fastPayback: 'Fast Payback',
      moderatePayback: 'Moderate Payback',
      slowPayback: 'Slow Payback',
      highProfitBusiness: 'High Profit Business',
      stableBusiness: 'Stable Business',
      needsOptimization: 'Needs Optimization',
      includesCogs: 'Including',
      costOfGoods: 'COGS',
      clients: 'customers',
      days: 'days',
      years: 'years',
      recommendations: {
        increaseAvgCheck: '📈 Increase average transaction with premium menu items',
        optimizeCosts: '💰 Optimize food costs (target 25-30% of revenue)',
        attractClients: '🎯 Attract more customers through marketing and loyalty programs',
        expandHours: '⏰ Extend operating hours or add delivery services',
        reduceSpace: '🏢 Consider smaller space to reduce rent costs',
        addTakeaway: '📦 Add takeaway format to increase turnover',
        addSpecialties: '☕ Offer specialty coffee drinks and desserts',
        expandMenu: '🥐 Expand breakfast and light lunch menu'
      }
    }
  };
  
  const t = text[isEnglish ? 'en' : 'uk'];

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
      [t.csvHeaders.metric, t.csvHeaders.value],
      [t.csvHeaders.totalInvestment, `$${data.totalInvestment.toLocaleString()}`],
      [t.csvHeaders.monthlyRevenue, `$${data.monthlyRevenue.toLocaleString()}`],
      [t.csvHeaders.monthlyExpenses, `$${data.monthlyExpenses.toLocaleString()}`],
      [t.csvHeaders.monthlyProfit, `$${data.monthlyProfit.toLocaleString()}`],
      [t.csvHeaders.annualRevenue, `$${data.annualRevenue.toLocaleString()}`],
      [t.csvHeaders.annualProfit, `$${data.annualProfit.toLocaleString()}`],
      [t.csvHeaders.paybackPeriod, data.paybackPeriod.toFixed(1)],
      [t.csvHeaders.roiPercent, data.roi.toFixed(1)],
      [t.csvHeaders.profitMargin, data.profitMargin.toFixed(1)]
    ];
    
    return csvData.map(row => row.join(',')).join('\n');
  }

  function downloadCSV(data) {
    const csv = generateCSVData(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cafe_business_plan.csv';
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

      // Calculate capacity utilization
      const maxDailyCapacity = seats * 4; // Assume 4 turnovers per day
      const capacityUtilization = (clientsPerDay / maxDailyCapacity) * 100;

      // Calculate revenue per square meter/foot
      const revenuePerSqUnit = monthlyRevenue / area;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = t.needsOptimization;
      if (roi >= 20 && profitMargin >= 15) {
        viabilityType = 'success';
        viabilityMessage = t.highProfitBusiness;
      } else if (roi >= 12 && profitMargin >= 8) {
        viabilityType = 'info';
        viabilityMessage = t.stableBusiness;
      }

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 10) {
        recommendations.push(t.recommendations.increaseAvgCheck);
        recommendations.push(t.recommendations.optimizeCosts);
      }
      if (capacityUtilization < 50) {
        recommendations.push(t.recommendations.attractClients);
        recommendations.push(t.recommendations.expandHours);
      }
      if (revenuePerSqUnit < 50) {
        recommendations.push(t.recommendations.reduceSpace);
        recommendations.push(t.recommendations.addTakeaway);
      }
      if (avgCheck < 8) {
        recommendations.push(t.recommendations.addSpecialties);
        recommendations.push(t.recommendations.expandMenu);
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
            t.totalInvestment,
            formatNumber(totalInvestment),
            t.initialCapital,
            'info'
          )}
          ${createInsightCard(
            t.monthlyRevenue,
            formatNumber(monthlyRevenue),
            `${clientsPerDay} ${t.clients} × ${avgCheck}$ × ${workingDays} ${t.days}`,
            'success'
          )}
          ${createInsightCard(
            t.monthlyExpenses,
            formatNumber(monthlyExpenses),
            `${t.includesCogs} ${formatPercent(cogsPercent)} ${t.costOfGoods}`,
            'warning'
          )}
          ${createInsightCard(
            t.netProfit,
            formatNumber(monthlyProfit),
            `${t.margin}: ${formatPercent(profitMargin)}`,
            viabilityType
          )}
          ${createInsightCard(
            t.paybackPeriod,
            `${paybackPeriod.toFixed(1)} ${t.years}`,
            paybackPeriod < 3 ? t.fastPayback : paybackPeriod < 5 ? t.moderatePayback : t.slowPayback,
            paybackPeriod < 3 ? 'success' : paybackPeriod < 5 ? 'info' : 'warning'
          )}
          ${createInsightCard(
            t.roi,
            formatPercent(roi),
            viabilityMessage,
            viabilityType
          )}
        </div>

        <div class="analysis-section">
          <h4>${t.detailedAnalysis}</h4>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">${t.annualRevenue}</span>
              <span class="metric-value">${formatNumber(annualRevenue)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">${t.annualProfit}</span>
              <span class="metric-value">${formatNumber(annualProfit)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">${t.capacityUtilization}</span>
              <span class="metric-value">${formatPercent(capacityUtilization)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">${t.revenuePerSqUnit}</span>
              <span class="metric-value">${formatNumber(revenuePerSqUnit)}${t.month}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">${t.revenuePerSeat}</span>
              <span class="metric-value">${formatNumber(monthlyRevenue / seats)}${t.month}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">${t.costOfGoods}</span>
              <span class="metric-value">${formatNumber(monthlyCoGS)}${t.month}</span>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
          <div class="recommendations">
            <h4>${t.optimizationRecommendations}</h4>
            <ul>
              ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="action-buttons">
          <button onclick="window.print()" class="btn-secondary">${t.printReport}</button>
          <button onclick="downloadCSV(${JSON.stringify(data).replace(/"/g, '&quot;')})" class="btn-primary">${t.downloadCsv}</button>
        </div>

        <div class="disclaimer">
          <p><small>${t.disclaimer}</small></p>
        </div>
      `;

      // Expose downloadCSV function globally for the button
      window.downloadCSV = downloadCSV;
    });
  }
});