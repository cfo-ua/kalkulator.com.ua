document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('beauty-salon-form');
  const result = document.getElementById('beauty-salon-result');

  // Detect language based on URL
  const isEnglish = window.location.pathname.includes('/en/');

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
    a.download = 'beauty_salon_business_plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const area = parseFloat(document.getElementById('area').value);
      const workstations = parseFloat(document.getElementById('workstations').value);
      const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
      const renovationCost = parseFloat(document.getElementById('renovation-cost').value);
      const furnitureCost = parseFloat(document.getElementById('furniture-cost').value);
      const additionalCosts = parseFloat(document.getElementById('additional-costs').value);
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
      const avgCheck = parseFloat(document.getElementById('avg-check').value);
      const clientsPerDay = parseFloat(document.getElementById('clients-per-day').value);
      const workingDays = parseFloat(document.getElementById('working-days').value);
      const staffSalaries = parseFloat(document.getElementById('staff-salaries').value);
      const supplies = parseFloat(document.getElementById('supplies').value);
      const utilities = parseFloat(document.getElementById('utilities').value);
      const otherExpenses = parseFloat(document.getElementById('other-expenses').value);

      // Calculate total startup investment
      const totalInvestment = equipmentCost + renovationCost + furnitureCost + additionalCosts;

      // Calculate monthly revenue
      const monthlyRevenue = avgCheck * clientsPerDay * workingDays;

      // Calculate monthly expenses
      const monthlyExpenses = monthlyRent + staffSalaries + supplies + utilities + otherExpenses;

      // Calculate profit metrics
      const monthlyProfit = monthlyRevenue - monthlyExpenses;
      const annualRevenue = monthlyRevenue * 12;
      const annualProfit = monthlyProfit * 12;
      
      // Calculate payback period and ROI
      const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit / 12 : 0;
      const roi = monthlyProfit > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Calculate efficiency metrics
      const revenuePerWorkstation = monthlyRevenue / workstations;
      const revenuePerSqUnit = monthlyRevenue / area;
      const clientsPerWorkstation = clientsPerDay / workstations;

      // Beauty salon specific analysis
      const laborCostPercent = (staffSalaries / monthlyRevenue) * 100;
      const rentPercent = (monthlyRent / monthlyRevenue) * 100;
      const supplyCostPercent = (supplies / monthlyRevenue) * 100;

      // Determine business viability
      let viabilityType = 'warning';
      let viabilityMessage = isEnglish ? 'Needs optimization' : 'Потребує оптимізації';
      if (roi >= 25 && profitMargin >= 20) {
        viabilityType = 'success';
        viabilityMessage = isEnglish ? 'Highly profitable salon' : 'Високоприбутковий салон';
      } else if (roi >= 15 && profitMargin >= 12) {
        viabilityType = 'info';
        viabilityMessage = isEnglish ? 'Stable business' : 'Стабільний бізнес';
      }

      // Language-specific text
      const labels = isEnglish ? {
        title: '💅 Beauty Salon Business Plan',
        totalInvestment: 'Total Investment',
        startupCapital: 'Startup Capital',
        monthlyRevenue: 'Monthly Revenue',
        monthlyExpenses: 'Monthly Expenses',
        rent: 'Rent',
        staff: 'Staff',
        netProfit: 'Net Profit',
        margin: 'Margin',
        payback: 'Payback Period',
        roi: 'ROI',
        fastPayback: 'Fast payback',
        moderatePayback: 'Moderate payback',
        slowPayback: 'Slow payback',
        detailedAnalysis: '📋 Detailed Beauty Salon Analysis',
        annualRevenue: 'Annual Revenue',
        annualProfit: 'Annual Profit',
        revenuePerStation: 'Revenue per Station',
        revenuePerSqUnit: 'Revenue per Sq Ft',
        clientsPerStation: 'Clients per Station',
        laborCost: 'Labor Cost',
        rentCost: 'Rent Cost',
        supplyCost: 'Supply Cost',
        recommendations: '💡 Optimization Recommendations',
        printReport: '🖨️ Print Report',
        downloadData: '📊 Download CSV Data',
        disclaimer: '⚠️ Calculations are approximate and based on entered data. Actual results may vary depending on market conditions, location, seasonality, and beauty salon management efficiency.'
      } : {
        title: '💅 Бізнес-план салону краси',
        totalInvestment: 'Загальні інвестиції',
        startupCapital: 'Початковий капітал',
        monthlyRevenue: 'Щомісячний дохід',
        monthlyExpenses: 'Щомісячні витрати',
        rent: 'Оренда',
        staff: 'Персонал',
        netProfit: 'Чистий прибуток',
        margin: 'Маржа',
        payback: 'Окупність',
        roi: 'ROI',
        fastPayback: 'Швидка окупність',
        moderatePayback: 'Помірна окупність',
        slowPayback: 'Повільна окупність',
        detailedAnalysis: '📋 Детальний аналіз салону краси',
        annualRevenue: 'Річний дохід',
        annualProfit: 'Річний прибуток',
        revenuePerStation: 'Дохід на робоче місце',
        revenuePerSqUnit: 'Дохід на м²',
        clientsPerStation: 'Клієнтів на робоче місце',
        laborCost: 'Витрати на персонал',
        rentCost: 'Витрати на оренду',
        supplyCost: 'Витрати на матеріали',
        recommendations: '💡 Рекомендації для оптимізації',
        printReport: '🖨️ Друкувати звіт',
        downloadData: '📊 Завантажити дані CSV',
        disclaimer: '⚠️ Розрахунки є приблизними і базуються на введених даних. Реальні показники можуть відрізнятися залежно від ринкових умов, локації, сезонності та ефективності управління салоном краси.'
      };

      // Generate recommendations
      let recommendations = [];
      if (profitMargin < 15) {
        recommendations.push(isEnglish ? 
          '📈 Increase prices on popular services' : 
          '📈 Підвищіть ціни на популярні послуги');
        recommendations.push(isEnglish ?
          '💰 Add retail cosmetics with high margin' :
          '💰 Додайте продаж косметики з високою маржею');
      }
      if (laborCostPercent > 40) {
        recommendations.push(isEnglish ?
          '👥 Optimize staff schedules' :
          '👥 Оптимізуйте графік роботи майстрів');
        recommendations.push(isEnglish ?
          '📈 Increase clients per stylist' :
          '📈 Збільшіть кількість клієнтів на майстра');
      }
      if (rentPercent > 15) {
        recommendations.push(isEnglish ?
          '🏢 Consider relocating to lower rent location' :
          '🏢 Розгляньте переїзд у приміщення з меншою орендою');
        recommendations.push(isEnglish ?
          '📦 Add home services for VIP clients' :
          '📦 Додайте послуги на дому для VIP-клієнтів');
      }
      if (clientsPerWorkstation < 3) {
        recommendations.push(isEnglish ?
          '🎯 Improve marketing to attract clients' :
          '🎯 Покращіть маркетинг для залучення клієнтів');
        recommendations.push(isEnglish ?
          '📅 Implement loyalty programs and packages' :
          '📅 Впровадьте програми лояльності та абонементи');
      }
      if (avgCheck < 30) {
        recommendations.push(isEnglish ?
          '💅 Offer comprehensive services and packages' :
          '💅 Запропонуйте комплексні послуги та пакети');
        recommendations.push(isEnglish ?
          '✨ Add premium procedures with higher price' :
          '✨ Додайте преміум-процедури з вищою ціною');
      }
      if (supplyCostPercent > 10) {
        recommendations.push(isEnglish ?
          '🛒 Optimize material purchasing' :
          '🛒 Оптимізуйте закупівлі матеріалів');
        recommendations.push(isEnglish ?
          '📊 Analyze costs per service' :
          '📊 Аналізуйте витрати по кожній послузі');
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
        <div class="business-plan-results">
          <h3>${labels.title}</h3>
          
          <div class="insight-cards">
            ${createInsightCard(
              labels.totalInvestment,
              formatNumber(totalInvestment),
              labels.startupCapital,
              'info'
            )}
            ${createInsightCard(
              labels.monthlyRevenue,
              formatNumber(monthlyRevenue),
              `${clientsPerDay} ${isEnglish ? 'clients' : 'клієнтів'} × ${formatNumber(avgCheck)} × ${workingDays} ${isEnglish ? 'days' : 'днів'}`,
              'success'
            )}
            ${createInsightCard(
              labels.monthlyExpenses,
              formatNumber(monthlyExpenses),
              `${labels.rent} ${formatNumber(monthlyRent)} + ${labels.staff} ${formatNumber(staffSalaries)}`,
              'warning'
            )}
            ${createInsightCard(
              labels.netProfit,
              formatNumber(monthlyProfit),
              `${labels.margin}: ${formatPercent(profitMargin)}`,
              viabilityType
            )}
            ${createInsightCard(
              labels.payback,
              `${paybackPeriod.toFixed(1)} ${isEnglish ? 'years' : 'років'}`,
              paybackPeriod < 3 ? labels.fastPayback : paybackPeriod < 5 ? labels.moderatePayback : labels.slowPayback,
              paybackPeriod < 3 ? 'success' : paybackPeriod < 5 ? 'info' : 'warning'
            )}
            ${createInsightCard(
              labels.roi,
              formatPercent(roi),
              viabilityMessage,
              viabilityType
            )}
          </div>

          <div class="financial-breakdown">
            <h4>${labels.detailedAnalysis}</h4>
            
            <div class="breakdown-table">
              <div class="breakdown-row">
                <span>${labels.annualRevenue}:</span>
                <span>${formatNumber(annualRevenue)}</span>
              </div>
              <div class="breakdown-row">
                <span>${labels.annualProfit}:</span>
                <span>${formatNumber(annualProfit)}</span>
              </div>
              <div class="breakdown-row">
                <span>${labels.revenuePerStation}:</span>
                <span>${formatNumber(revenuePerWorkstation)}/${isEnglish ? 'month' : 'місяць'}</span>
              </div>
              <div class="breakdown-row">
                <span>${labels.revenuePerSqUnit}:</span>
                <span>${formatNumber(revenuePerSqUnit)}/${isEnglish ? 'month' : 'місяць'}</span>
              </div>
              <div class="breakdown-row">
                <span>${labels.clientsPerStation}:</span>
                <span>${clientsPerWorkstation.toFixed(1)}/${isEnglish ? 'day' : 'день'}</span>
              </div>
              <div class="breakdown-row">
                <span>${labels.laborCost}:</span>
                <span>${formatPercent(laborCostPercent)} ${isEnglish ? 'of revenue' : 'від доходу'}</span>
              </div>
              <div class="breakdown-row">
                <span>${labels.rentCost}:</span>
                <span>${formatPercent(rentPercent)} ${isEnglish ? 'of revenue' : 'від доходу'}</span>
              </div>
              <div class="breakdown-row">
                <span>${labels.supplyCost}:</span>
                <span>${formatPercent(supplyCostPercent)} ${isEnglish ? 'of revenue' : 'від доходу'}</span>
              </div>
            </div>
          </div>

          ${recommendations.length > 0 ? `
            <div class="recommendations">
              <h4>${labels.recommendations}</h4>
              <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="action-buttons">
            <button onclick="window.print()" class="btn-secondary">${labels.printReport}</button>
            <button onclick="downloadCSV(${JSON.stringify(data).replace(/"/g, '&quot;')})" class="btn-primary">${labels.downloadData}</button>
          </div>

          <div class="disclaimer">
            <p><small>${labels.disclaimer}</small></p>
          </div>
        </div>
      `;

      // Expose downloadCSV function globally for the button
      window.downloadCSV = downloadCSV;
    });
  }
});