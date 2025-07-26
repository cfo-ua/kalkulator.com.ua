document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("business-health-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Отримання даних з форми
    const businessType = document.getElementById("businessType").value;
    const yearsInBusiness = parseFloat(document.getElementById("yearsInBusiness").value) || 0;
    const numberOfEmployees = parseInt(document.getElementById("numberOfEmployees").value) || 1;
    
    const annualRevenue = parseFloat(document.getElementById("annualRevenue").value) || 0;
    const costOfGoodsSold = parseFloat(document.getElementById("costOfGoodsSold").value) || 0;
    const operatingExpenses = parseFloat(document.getElementById("operatingExpenses").value) || 0;
    const netProfit = parseFloat(document.getElementById("netProfit").value) || 0;
    
    const currentAssets = parseFloat(document.getElementById("currentAssets").value) || 0;
    const currentLiabilities = parseFloat(document.getElementById("currentLiabilities").value) || 0;
    const totalDebt = parseFloat(document.getElementById("totalDebt").value) || 0;
    const totalEquity = parseFloat(document.getElementById("totalEquity").value) || 0;
    
    const averageTransactionValue = parseFloat(document.getElementById("averageTransactionValue").value) || 0;
    const monthlyCustomers = parseInt(document.getElementById("monthlyCustomers").value) || 0;
    const customerRetentionRate = parseFloat(document.getElementById("customerRetentionRate").value) || 0;
    const inventoryTurnover = parseFloat(document.getElementById("inventoryTurnover").value) || 0;
    
    const marketShare = parseFloat(document.getElementById("marketShare").value) || 0;
    const competitivePosition = document.getElementById("competitivePosition").value;
    const customerSatisfaction = parseFloat(document.getElementById("customerSatisfaction").value) || 0;

    // Розрахунок ключових фінансових показників
    const grossProfit = annualRevenue - costOfGoodsSold;
    const grossMargin = annualRevenue > 0 ? (grossProfit / annualRevenue) * 100 : 0;
    const netMargin = annualRevenue > 0 ? (netProfit / annualRevenue) * 100 : 0;
    const operatingMargin = annualRevenue > 0 ? ((grossProfit - operatingExpenses) / annualRevenue) * 100 : 0;
    
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const debtToEquityRatio = totalEquity > 0 ? totalDebt / totalEquity : 0;
    const revenuePerEmployee = numberOfEmployees > 0 ? annualRevenue / numberOfEmployees : 0;
    
    const monthlyRevenue = annualRevenue / 12;
    const customerLifetimeValue = customerRetentionRate > 0 ? 
      (averageTransactionValue * 12 * (customerRetentionRate / 100)) : 0;

    // Розрахунок оцінок за категоріями (1-10 балів)
    const healthScores = calculateHealthScores({
      businessType, yearsInBusiness, annualRevenue, grossMargin, netMargin,
      operatingMargin, currentRatio, debtToEquityRatio, revenuePerEmployee,
      customerRetentionRate, inventoryTurnover, marketShare, competitivePosition,
      customerSatisfaction, monthlyCustomers, netProfit
    });

    // Загальна оцінка здоров'я
    const overallHealth = calculateOverallHealth(healthScores);

    // Галузеві бенчмарки
    const benchmarks = getIndustryBenchmarks(businessType);

    // Форматування валюти
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const formatPercent = (percent) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(percent / 100);
    };

    // Відображення результатів
    document.getElementById("business-health-result").innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${overallHealth.color}">
          <h6>🏥 Загальне здоров'я</h6>
          <div class="big-number">${overallHealth.score.toFixed(1)}/10</div>
          <p>${overallHealth.status}</p>
        </div>
        
        <div class="insight-card ${healthScores.financial.score >= 7 ? 'success' : healthScores.financial.score >= 5 ? 'info' : 'warning'}">
          <h6>💰 Фінансове здоров'я</h6>
          <div class="big-number">${healthScores.financial.score.toFixed(1)}/10</div>
          <p>${healthScores.financial.comment}</p>
        </div>
        
        <div class="insight-card ${healthScores.operational.score >= 7 ? 'success' : healthScores.operational.score >= 5 ? 'info' : 'warning'}">
          <h6>⚙️ Операційна ефективність</h6>
          <div class="big-number">${healthScores.operational.score.toFixed(1)}/10</div>
          <p>${healthScores.operational.comment}</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 Детальний аналіз показників</h4>
        
        <div class="insight-cards">
          <div class="insight-card">
            <h6>💹 Прибутковість</h6>
            <small>
              • Валова маржа: ${formatPercent(grossMargin)} (норма: ${formatPercent(benchmarks.grossMargin)})<br>
              • Операційна маржа: ${formatPercent(operatingMargin)} (норма: ${formatPercent(benchmarks.operatingMargin)})<br>
              • Чиста маржа: ${formatPercent(netMargin)} (норма: ${formatPercent(benchmarks.netMargin)})<br>
              • Оцінка: ${healthScores.profitability.score.toFixed(1)}/10
            </small>
          </div>
          
          <div class="insight-card">
            <h6>💧 Ліквідність</h6>
            <small>
              • Коефіцієнт поточної ліквідності: ${currentRatio.toFixed(2)} (норма: ≥${benchmarks.currentRatio})<br>
              • Співвідношення боргу: ${debtToEquityRatio.toFixed(2)} (норма: ≤${benchmarks.debtToEquity})<br>
              • Грошовий потік: ${netProfit >= 0 ? 'Позитивний' : 'Негативний'}<br>
              • Оцінка: ${healthScores.liquidity.score.toFixed(1)}/10
            </small>
          </div>
          
          <div class="insight-card">
            <h6>⚡ Продуктивність</h6>
            <small>
              • Дохід на співробітника: ${formatCurrency(revenuePerEmployee)}<br>
              • Середній чек: ${formatCurrency(averageTransactionValue)}<br>
              • Оборотність запасів: ${inventoryTurnover} раз/рік<br>
              • Оцінка: ${healthScores.productivity.score.toFixed(1)}/10
            </small>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <h4>🎯 Ринкова позиція та клієнти</h4>
          
          <div class="insight-cards">
            <div class="insight-card ${healthScores.market.score >= 7 ? 'success' : healthScores.market.score >= 5 ? 'info' : 'warning'}">
              <h6>🏆 Конкурентна позиція</h6>
              <div class="result-value">${healthScores.market.score.toFixed(1)}/10</div>
              <small>
                • Ринкова частка: ${formatPercent(marketShare)}<br>
                • Позиція: ${getCompetitivePositionText(competitivePosition)}<br>
                • Стабільність: ${yearsInBusiness >= 3 ? 'Стабільна' : 'Розвивається'}
              </small>
            </div>
            
            <div class="insight-card ${healthScores.customer.score >= 7 ? 'success' : healthScores.customer.score >= 5 ? 'info' : 'warning'}">
              <h6>👥 Клієнтська база</h6>
              <div class="result-value">${healthScores.customer.score.toFixed(1)}/10</div>
              <small>
                • Утримання клієнтів: ${formatPercent(customerRetentionRate)}<br>
                • Задоволеність: ${customerSatisfaction}/10<br>
                • Клієнтів/місяць: ${monthlyCustomers.toLocaleString('uk-UA')}<br>
                • LTV: ${formatCurrency(customerLifetimeValue)}
              </small>
            </div>
            
            <div class="insight-card ${overallHealth.trend === 'growing' ? 'success' : overallHealth.trend === 'stable' ? 'info' : 'warning'}">
              <h6>📈 Потенціал зростання</h6>
              <div class="result-value">${healthScores.growth.score.toFixed(1)}/10</div>
              <small>
                • Років на ринку: ${yearsInBusiness}<br>
                • Розмір команди: ${numberOfEmployees} осіб<br>
                • Тренд: ${getTrendText(overallHealth.trend)}<br>
                • Масштабованість: ${getScalabilityText(businessType, revenuePerEmployee)}
              </small>
            </div>
          </div>
        </div>

        ${generateBenchmarkComparison(healthScores, benchmarks, businessType)}
        ${generateActionPlan(healthScores, overallHealth)}
      </div>
    `;

    // Показати радар-графік
    const chartBlock = document.getElementById("health-chart-block");
    if (chartBlock) {
      chartBlock.style.display = "block";
      createHealthRadarChart(healthScores);
    }
  });

  function calculateHealthScores(data) {
    const {
      businessType, yearsInBusiness, annualRevenue, grossMargin, netMargin,
      operatingMargin, currentRatio, debtToEquityRatio, revenuePerEmployee,
      customerRetentionRate, inventoryTurnover, marketShare, competitivePosition,
      customerSatisfaction, monthlyCustomers, netProfit
    } = data;

    // Прибутковість (1-10)
    let profitabilityScore = 0;
    if (netMargin >= 15) profitabilityScore += 4;
    else if (netMargin >= 10) profitabilityScore += 3;
    else if (netMargin >= 5) profitabilityScore += 2;
    else if (netMargin >= 0) profitabilityScore += 1;

    if (grossMargin >= 40) profitabilityScore += 3;
    else if (grossMargin >= 30) profitabilityScore += 2;
    else if (grossMargin >= 20) profitabilityScore += 1;

    if (operatingMargin >= 15) profitabilityScore += 3;
    else if (operatingMargin >= 10) profitabilityScore += 2;
    else if (operatingMargin >= 5) profitabilityScore += 1;

    // Ліквідність (1-10)
    let liquidityScore = 0;
    if (currentRatio >= 2) liquidityScore += 4;
    else if (currentRatio >= 1.5) liquidityScore += 3;
    else if (currentRatio >= 1.2) liquidityScore += 2;
    else if (currentRatio >= 1) liquidityScore += 1;

    if (debtToEquityRatio <= 0.3) liquidityScore += 3;
    else if (debtToEquityRatio <= 0.5) liquidityScore += 2;
    else if (debtToEquityRatio <= 1) liquidityScore += 1;

    if (netProfit > 0) liquidityScore += 3;
    else if (netProfit >= 0) liquidityScore += 1;

    // Продуктивність (1-10)
    const benchmarkRevPerEmployee = getBenchmarkRevenuePerEmployee(businessType);
    let productivityScore = 0;
    
    if (revenuePerEmployee >= benchmarkRevPerEmployee * 1.5) productivityScore += 4;
    else if (revenuePerEmployee >= benchmarkRevPerEmployee) productivityScore += 3;
    else if (revenuePerEmployee >= benchmarkRevPerEmployee * 0.8) productivityScore += 2;
    else if (revenuePerEmployee >= benchmarkRevPerEmployee * 0.6) productivityScore += 1;

    if (inventoryTurnover >= 12) productivityScore += 3;
    else if (inventoryTurnover >= 8) productivityScore += 2;
    else if (inventoryTurnover >= 4) productivityScore += 1;

    if (annualRevenue >= 10000000) productivityScore += 3;
    else if (annualRevenue >= 5000000) productivityScore += 2;
    else if (annualRevenue >= 1000000) productivityScore += 1;

    // Ринкова позиція (1-10)
    const competitiveScores = {
      'leader': 10, 'strong': 8, 'average': 6, 'weak': 4, 'struggling': 2
    };
    let marketScore = competitiveScores[competitivePosition] || 6;

    if (marketShare >= 20) marketScore = Math.min(marketScore + 2, 10);
    else if (marketShare >= 10) marketScore = Math.min(marketScore + 1, 10);

    if (yearsInBusiness >= 5) marketScore = Math.min(marketScore + 1, 10);

    // Клієнтська база (1-10)
    let customerScore = 0;
    if (customerRetentionRate >= 90) customerScore += 4;
    else if (customerRetentionRate >= 80) customerScore += 3;
    else if (customerRetentionRate >= 70) customerScore += 2;
    else if (customerRetentionRate >= 60) customerScore += 1;

    if (customerSatisfaction >= 9) customerScore += 3;
    else if (customerSatisfaction >= 8) customerScore += 2;
    else if (customerSatisfaction >= 7) customerScore += 1;

    if (monthlyCustomers >= 1000) customerScore += 3;
    else if (monthlyCustomers >= 500) customerScore += 2;
    else if (monthlyCustomers >= 100) customerScore += 1;

    // Потенціал зростання (1-10)
    let growthScore = 0;
    if (netMargin > 10 && currentRatio > 1.5) growthScore += 4;
    else if (netMargin > 5 && currentRatio > 1.2) growthScore += 3;
    else if (netMargin > 0) growthScore += 2;

    if (customerRetentionRate > 80) growthScore += 3;
    else if (customerRetentionRate > 70) growthScore += 2;
    else if (customerRetentionRate > 60) growthScore += 1;

    if (yearsInBusiness >= 3 && yearsInBusiness <= 10) growthScore += 3;
    else if (yearsInBusiness >= 1) growthScore += 2;

    return {
      profitability: {
        score: Math.min(profitabilityScore, 10),
        comment: profitabilityScore >= 8 ? 'Відмінна' : profitabilityScore >= 6 ? 'Хороша' : profitabilityScore >= 4 ? 'Задовільна' : 'Потребує покращення'
      },
      liquidity: {
        score: Math.min(liquidityScore, 10),
        comment: liquidityScore >= 8 ? 'Відмінна' : liquidityScore >= 6 ? 'Хороша' : liquidityScore >= 4 ? 'Задовільна' : 'Потребує покращення'
      },
      productivity: {
        score: Math.min(productivityScore, 10),
        comment: productivityScore >= 8 ? 'Відмінна' : productivityScore >= 6 ? 'Хороша' : productivityScore >= 4 ? 'Задовільна' : 'Потребує покращення'
      },
      market: {
        score: Math.min(marketScore, 10),
        comment: marketScore >= 8 ? 'Лідерська' : marketScore >= 6 ? 'Сильна' : marketScore >= 4 ? 'Стабільна' : 'Слабка'
      },
      customer: {
        score: Math.min(customerScore, 10),
        comment: customerScore >= 8 ? 'Відмінна' : customerScore >= 6 ? 'Хороша' : customerScore >= 4 ? 'Задовільна' : 'Потребує покращення'
      },
      growth: {
        score: Math.min(growthScore, 10),
        comment: growthScore >= 8 ? 'Високий' : growthScore >= 6 ? 'Помірний' : growthScore >= 4 ? 'Обмежений' : 'Низький'
      },
      financial: {
        score: (Math.min(profitabilityScore, 10) + Math.min(liquidityScore, 10)) / 2,
        comment: 'Комбінований показник'
      },
      operational: {
        score: (Math.min(productivityScore, 10) + Math.min(customerScore, 10)) / 2,
        comment: 'Комбінований показник'
      }
    };
  }

  function calculateOverallHealth(scores) {
    const weights = {
      profitability: 0.25,
      liquidity: 0.20,
      productivity: 0.20,
      market: 0.15,
      customer: 0.15,
      growth: 0.05
    };

    const weightedScore = 
      scores.profitability.score * weights.profitability +
      scores.liquidity.score * weights.liquidity +
      scores.productivity.score * weights.productivity +
      scores.market.score * weights.market +
      scores.customer.score * weights.customer +
      scores.growth.score * weights.growth;

    let status, color, trend;
    
    if (weightedScore >= 8.5) {
      status = 'Відмінне здоров\'я';
      color = 'success';
      trend = 'growing';
    } else if (weightedScore >= 7) {
      status = 'Хороше здоров\'я';
      color = 'success';
      trend = 'growing';
    } else if (weightedScore >= 5.5) {
      status = 'Задовільне здоров\'я';
      color = 'info';
      trend = 'stable';
    } else if (weightedScore >= 4) {
      status = 'Потребує уваги';
      color = 'warning';
      trend = 'declining';
    } else {
      status = 'Критичний стан';
      color = 'warning';
      trend = 'declining';
    }

    return { score: weightedScore, status, color, trend };
  }

  function getIndustryBenchmarks(businessType) {
    const benchmarks = {
      retail: { grossMargin: 25, operatingMargin: 5, netMargin: 3, currentRatio: 1.5, debtToEquity: 0.5 },
      restaurant: { grossMargin: 60, operatingMargin: 8, netMargin: 5, currentRatio: 1.2, debtToEquity: 0.8 },
      manufacturing: { grossMargin: 35, operatingMargin: 12, netMargin: 8, currentRatio: 1.8, debtToEquity: 0.6 },
      services: { grossMargin: 50, operatingMargin: 15, netMargin: 10, currentRatio: 1.3, debtToEquity: 0.4 },
      it: { grossMargin: 70, operatingMargin: 20, netMargin: 15, currentRatio: 2.0, debtToEquity: 0.3 },
      construction: { grossMargin: 20, operatingMargin: 6, netMargin: 4, currentRatio: 1.4, debtToEquity: 0.7 },
      transport: { grossMargin: 30, operatingMargin: 10, netMargin: 6, currentRatio: 1.3, debtToEquity: 0.8 }
    };
    
    return benchmarks[businessType] || benchmarks.services;
  }

  function getBenchmarkRevenuePerEmployee(businessType) {
    const benchmarks = {
      retail: 800000,
      restaurant: 600000,
      manufacturing: 1200000,
      services: 1000000,
      it: 1500000,
      construction: 1000000,
      transport: 800000
    };
    
    return benchmarks[businessType] || 1000000;
  }

  function getCompetitivePositionText(position) {
    const texts = {
      leader: 'Лідер ринку',
      strong: 'Сильна позиція',
      average: 'Середня позиція',
      weak: 'Слабка позиція',
      struggling: 'Боротьба за виживання'
    };
    return texts[position] || 'Середня позиція';
  }

  function getTrendText(trend) {
    const texts = {
      growing: 'Зростання',
      stable: 'Стабільність',
      declining: 'Спад'
    };
    return texts[trend] || 'Стабільність';
  }

  function getScalabilityText(businessType, revenuePerEmployee) {
    const benchmark = getBenchmarkRevenuePerEmployee(businessType);
    if (revenuePerEmployee >= benchmark * 1.5) return 'Висока';
    if (revenuePerEmployee >= benchmark) return 'Помірна';
    return 'Обмежена';
  }

  function generateBenchmarkComparison(scores, benchmarks, businessType) {
    return `
      <div style="margin-top: 1.5rem;">
        <h4>📈 Порівняння з галузевими стандартами</h4>
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #157aff;">
          <h6>🏭 ${businessType.charAt(0).toUpperCase() + businessType.slice(1)} - Галузеві норми:</h6>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div>
              <strong>Валова маржа:</strong> ${benchmarks.grossMargin}%<br>
              <strong>Операційна маржа:</strong> ${benchmarks.operatingMargin}%<br>
              <strong>Чиста маржа:</strong> ${benchmarks.netMargin}%
            </div>
            <div>
              <strong>Поточна ліквідність:</strong> ≥${benchmarks.currentRatio}<br>
              <strong>Борг/Капітал:</strong> ≤${benchmarks.debtToEquity}<br>
              <strong>Дохід/співроб.:</strong> ${(getBenchmarkRevenuePerEmployee(businessType)/1000000).toFixed(1)}М грн
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateActionPlan(scores, overallHealth) {
    const actions = [];

    if (scores.profitability.score < 6) {
      actions.push("💰 <strong>Покращення прибутковості:</strong> Оптимізуйте ціни, зменшіть витрати, автоматизуйте процеси");
    }
    
    if (scores.liquidity.score < 6) {
      actions.push("💧 <strong>Підвищення ліквідності:</strong> Прискорте інкасацію, оптимізуйте запаси, переглянете умови з постачальниками");
    }
    
    if (scores.productivity.score < 6) {
      actions.push("⚡ <strong>Підвищення продуктивності:</strong> Навчіть персонал, впровадьте KPI, оптимізуйте робочі процеси");
    }
    
    if (scores.customer.score < 6) {
      actions.push("👥 <strong>Покращення клієнтського сервісу:</strong> Програми лояльності, збір feedback, покращення якості");
    }
    
    if (scores.market.score < 6) {
      actions.push("🎯 <strong>Зміцнення ринкової позиції:</strong> Унікальна пропозиція, маркетинг, партнерства");
    }

    if (actions.length === 0) {
      actions.push("✅ <strong>Відмінна робота!</strong> Продовжуйте моніторити показники та підтримувати високі стандарти");
      actions.push("📈 <strong>Фокус на зростання:</strong> Розгляньте можливості розширення, нові ринки або продукти");
    }

    return `
      <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid var(--accent);">
        <h5>🎯 План дій для покращення:</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          ${actions.map(action => `<li style="margin-bottom: 0.5rem;">${action}</li>`).join('')}
          <li><strong>📊 Регулярний моніторинг:</strong> Проводьте оцінку щоквартально</li>
          <li><strong>📋 Встановлення цілей:</strong> Створіть KPI для кожної області</li>
          <li><strong>👥 Залучення команди:</strong> Поділіться результатами з ключовими співробітниками</li>
        </ul>
        
        <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 8px;">
          <h6>📅 Рекомендований график перегляду:</h6>
          <p style="margin: 0.5rem 0;">
            • <strong>Щомісячно:</strong> Фінансові показники (доходи, витрати, грошовий потік)<br>
            • <strong>Щоквартально:</strong> Повна оцінка здоров'я бізнесу<br>
            • <strong>Щорічно:</strong> Стратегічний огляд та планування
          </p>
        </div>
      </div>
    `;
  }

  function createHealthRadarChart(scores) {
    const canvas = document.getElementById("health-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.offsetWidth;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const categories = [
      { name: 'Прибутковість', key: 'profitability' },
      { name: 'Ліквідність', key: 'liquidity' },
      { name: 'Продуктивність', key: 'productivity' },
      { name: 'Ринкова позиція', key: 'market' },
      { name: 'Клієнти', key: 'customer' },
      { name: 'Зростання', key: 'growth' }
    ];

    const angleStep = (Math.PI * 2) / categories.length;

    // Малювання сітки
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;

    // Концентричні кола
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i * 2) / 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Лінії до вершин
    categories.forEach((category, index) => {
      const angle = index * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    });

    // Малювання фактичних показників
    ctx.strokeStyle = '#157aff';
    ctx.fillStyle = 'rgba(21, 122, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    categories.forEach((category, index) => {
      const score = scores[category.key].score;
      const percentage = score / 10;
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius * percentage;
      const y = centerY + Math.sin(angle) * radius * percentage;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Точки на графіку
    ctx.fillStyle = '#157aff';
    categories.forEach((category, index) => {
      const score = scores[category.key].score;
      const percentage = score / 10;
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius * percentage;
      const y = centerY + Math.sin(angle) * radius * percentage;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Підписи категорій
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    categories.forEach((category, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelRadius = radius + 30;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      ctx.fillText(category.name, x, y);

      // Показати оцінку
      ctx.font = '10px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(
        `${scores[category.key].score.toFixed(1)}/10`,
        x, y + 15
      );
      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
    });

    // Легенда значень
    ctx.font = '10px Arial';
    ctx.fillStyle = '#999';
    ctx.textAlign = 'right';
    for (let i = 1; i <= 5; i++) {
      ctx.fillText(
        `${i * 2}`,
        centerX - 5,
        centerY - (radius * i * 2) / 10 + 3
      );
    }
  }
});