document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("affiliate-earnings-form");
  const result = document.getElementById("affiliate-earnings-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateAffiliateEarnings();
  });

  function calculateAffiliateEarnings() {
    // Get form values
    const monthlyTraffic = parseInt(document.getElementById("monthly-traffic").value) || 0;
    const conversionRate = parseFloat(document.getElementById("conversion-rate").value) || 0;
    const averageOrderValue = parseFloat(document.getElementById("average-order-value").value) || 0;
    const commissionRate = parseFloat(document.getElementById("commission-rate").value) || 0;
    const advertisingCost = parseFloat(document.getElementById("advertising-cost").value) || 0;
    const contentCost = parseFloat(document.getElementById("content-cost").value) || 0;
    const toolsCost = parseFloat(document.getElementById("tools-cost").value) || 0;
    const otherCosts = parseFloat(document.getElementById("other-costs").value) || 0;
    const repeatRate = parseFloat(document.getElementById("repeat-rate").value) || 0;
    const cookieDuration = parseInt(document.getElementById("cookie-duration").value) || 30;

    if (monthlyTraffic <= 0 || conversionRate <= 0 || averageOrderValue <= 0 || commissionRate <= 0) {
      result.innerHTML = '<div class="error">Будь ласка, заповніть всі обов\'язкові поля коректними значеннями.</div>';
      return;
    }

    // Calculate earnings metrics
    const earnings = calculateEarningsMetrics(
      monthlyTraffic, conversionRate, averageOrderValue, commissionRate,
      advertisingCost, contentCost, toolsCost, otherCosts, repeatRate, cookieDuration
    );

    // Get affiliate level and recommendations
    const affiliateLevel = getAffiliateLevel(monthlyTraffic, earnings.netProfit);
    const recommendations = getRecommendations(affiliateLevel, earnings);

    displayResults(earnings, affiliateLevel, recommendations);
  }

  function calculateEarningsMetrics(traffic, conversionRate, aov, commissionRate, 
                                   adCost, contentCost, toolsCost, otherCosts, repeatRate, cookieDuration) {
    
    // Basic calculations
    const conversions = traffic * (conversionRate / 100);
    const grossRevenue = conversions * aov;
    const grossCommission = grossRevenue * (commissionRate / 100);
    
    // Repeat purchases (simplified model)
    const repeatPurchases = conversions * (repeatRate / 100);
    const repeatRevenue = repeatPurchases * aov * (commissionRate / 100);
    
    // Total monthly earnings
    const totalEarnings = grossCommission + repeatRevenue;
    
    // Total costs
    const totalCosts = adCost + contentCost + toolsCost + otherCosts;
    
    // Net profit
    const netProfit = totalEarnings - totalCosts;
    
    // Key metrics
    const epc = totalEarnings / traffic; // Earnings Per Click
    const roi = totalCosts > 0 ? ((netProfit / totalCosts) * 100) : 0;
    const costPerConversion = totalCosts > 0 ? (totalCosts / conversions) : 0;
    const profitMargin = totalEarnings > 0 ? ((netProfit / totalEarnings) * 100) : 0;

    return {
      traffic: traffic,
      conversions: Math.round(conversions * 10) / 10,
      grossRevenue: grossRevenue,
      grossCommission: grossCommission,
      repeatRevenue: repeatRevenue,
      totalEarnings: totalEarnings,
      totalCosts: totalCosts,
      netProfit: netProfit,
      yearlyProfit: netProfit * 12,
      epc: epc,
      roi: roi,
      costPerConversion: costPerConversion,
      profitMargin: profitMargin,
      conversionRate: conversionRate
    };
  }

  function getAffiliateLevel(traffic, netProfit) {
    if (traffic < 1000 || netProfit < 100) {
      return {
        name: "Початківець",
        description: "Навчання та перші кроки в афіліат маркетингу",
        color: "info",
        stage: "learning"
      };
    } else if (traffic < 10000 || netProfit < 1000) {
      return {
        name: "Розвиток",
        description: "Масштабування та оптимізація кампаній",
        color: "warning",
        stage: "growing"
      };
    } else if (traffic < 50000 || netProfit < 5000) {
      return {
        name: "Професіонал",
        description: "Стабільний афіліат бізнес",
        color: "success",
        stage: "professional"
      };
    } else {
      return {
        name: "Експерт",
        description: "Повноцінна афіліат компанія",
        color: "success",
        stage: "expert"
      };
    }
  }

  function getRecommendations(level, earnings) {
    const recommendations = {
      "learning": [
        "Фокусуйтеся на створенні якісного контенту та довіри аудиторії",
        "Вивчайте успішні кейси в обраній ніші",
        "Починайте з безкоштовного трафіку (SEO, соцмережі)",
        "Тестуйте різні афіліат програми та продукти",
        "Використовуйте Google Analytics для відстеження результатів"
      ],
      "growing": [
        "Інвестуйте в платну рекламу для масштабування трафіку",
        "Диверсифікуйте джерела трафіку та афіліат програми",
        "Створюйте email-списки для підвищення LTV клієнтів",
        "A/B тестуйте лендінги та контент для покращення конверсії",
        "Починайте будувати особистий бренд у ніші"
      ],
      "professional": [
        "Автоматизуйте процеси за допомогою інструментів",
        "Розширюйтеся на нові ніші та географічні ринки",
        "Створюйте власні продукти для підвищення маржі",
        "Наймайте фрілансерів для контенту та реклами",
        "Впроваджуйте ретаргетинг та email-маркетинг"
      ],
      "expert": [
        "Розгляньте створення власної афіліат мережі",
        "Інвестуйте в технологічні рішення та аналітику",
        "Розширюйте команду та делегуйте завдання",
        "Створюйте стратегічні партнерства з великими брендами",
        "Розгляньте M&A можливості у суміжних сферах"
      ]
    };

    return recommendations[level.stage] || recommendations["learning"];
  }

  function displayResults(earnings, level, recommendations) {
    const profitabilityStatus = earnings.netProfit > 0 ? "💰 Прибутковий" : "⚠️ Збитковий";
    const profitabilityColor = earnings.netProfit > 0 ? "success" : "warning";

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>💰 Чистий прибуток</h6>
          <div class="big-number">$${earnings.netProfit.toFixed(0)}</div>
          <p>Щомісячний дохід після витрат</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Річний прогноз</h6>
          <div class="big-number">$${earnings.yearlyProfit.toFixed(0)}</div>
          <p>Екстраполяція на рік</p>
        </div>

        <div class="insight-card ${level.color}">
          <h6>🎯 Рівень афіліата</h6>
          <div class="big-number">${level.name}</div>
          <p>${level.description}</p>
        </div>

        <div class="insight-card ${profitabilityColor}">
          <h6>📊 Рентабельність</h6>
          <div class="big-number">${earnings.roi.toFixed(1)}%</div>
          <p>ROI кампаній</p>
        </div>
      </div>

      <div class="earnings-breakdown">
        <h4>📈 Деталізація доходів</h4>
        <div class="earnings-chart">
          <div class="earning-item">
            <span class="earning-label">🎯 Конверсії:</span>
            <span class="earning-value">${earnings.conversions} з ${earnings.traffic} кліків</span>
          </div>
          
          <div class="earning-item">
            <span class="earning-label">💵 Валовий дохід:</span>
            <span class="earning-value">$${earnings.grossRevenue.toFixed(2)}</span>
          </div>
          
          <div class="earning-item">
            <span class="earning-label">💰 Комісія:</span>
            <span class="earning-value">$${earnings.grossCommission.toFixed(2)}</span>
          </div>
          
          <div class="earning-item">
            <span class="earning-label">🔄 Повторні покупки:</span>
            <span class="earning-value">$${earnings.repeatRevenue.toFixed(2)}</span>
          </div>
          
          <div class="earning-item total">
            <span class="earning-label">📊 Всього доходів:</span>
            <span class="earning-value">$${earnings.totalEarnings.toFixed(2)}</span>
          </div>
          
          <div class="earning-item cost">
            <span class="earning-label">💸 Всього витрат:</span>
            <span class="earning-value">$${earnings.totalCosts.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="key-metrics">
        <h4>📊 Ключові метрики</h4>
        <div class="metrics-grid">
          <div class="metric-item">
            <strong>EPC (Earnings Per Click):</strong> $${earnings.epc.toFixed(3)}
          </div>
          <div class="metric-item">
            <strong>Конверсія:</strong> ${earnings.conversionRate}%
          </div>
          <div class="metric-item">
            <strong>Вартість конверсії:</strong> $${earnings.costPerConversion.toFixed(2)}
          </div>
          <div class="metric-item">
            <strong>Маржа прибутку:</strong> ${earnings.profitMargin.toFixed(1)}%
          </div>
        </div>
      </div>

      <div class="optimization-tips">
        <h4>💡 Рекомендації для оптимізації</h4>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      ${earnings.roi < 0 ? `
        <div class="warning-section">
          <h4>⚠️ Попередження про збитковість</h4>
          <p>Ваша поточна кампанія є збитковою. Рекомендації:</p>
          <ul>
            <li>Знизьте витрати на рекламу або знайдіть дешевші джерела трафіку</li>
            <li>Покращте конверсію через оптимізацію контенту</li>
            <li>Оберіть продукти з вищими комісійними ставками</li>
            <li>Сфокусуйтеся на органічному трафіку (SEO, контент-маркетинг)</li>
          </ul>
        </div>
      ` : ''}

      <div class="disclaimer">
        <h4>📋 Важливі зауваження</h4>
        <ul>
          <li>Розрахунки базуються на введених даних та середніх показниках</li>
          <li>Реальні результати можуть значно відрізнятися залежно від ніші та якості трафіку</li>
          <li>Врахуйте сезонність та тренди у вашій ніші</li>
          <li>Завжди тестуйте та оптимізуйте кампанії на основі реальних даних</li>
          <li>Не забувайте про податкові зобов'язання з афіліат доходів</li>
        </ul>
      </div>
    `;
  }
});