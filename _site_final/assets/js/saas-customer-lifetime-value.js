document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("saas-clv-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Отримання значень форми
    const monthlyArpu = parseFloat(document.getElementById("monthlyArpu").value) || 0;
    const grossMargin = parseFloat(document.getElementById("grossMargin").value) || 80;
    const monthlyChurn = parseFloat(document.getElementById("monthlyChurn").value) || 3.5;
    const expansionRate = parseFloat(document.getElementById("expansionRate").value) || 0;
    const customerAcquisitionCost = parseFloat(document.getElementById("customerAcquisitionCost").value) || 0;
    const newCustomersMonthly = parseFloat(document.getElementById("newCustomersMonthly").value) || 0;
    const discountRate = parseFloat(document.getElementById("discountRate").value) || 10;
    const projectionMonths = parseInt(document.getElementById("projectionMonths").value) || 36;

    // Розрахунок основних метрик
    const monthlyChurnDecimal = monthlyChurn / 100;
    const grossMarginDecimal = grossMargin / 100;
    const expansionDecimal = expansionRate / 100;
    const monthlyNetArpu = monthlyArpu * grossMarginDecimal;

    // Розрахунок Customer Lifetime
    const customerLifespanMonths = monthlyChurnDecimal > 0 ? 1 / monthlyChurnDecimal : 999;
    const annualChurnRate = 1 - Math.pow(1 - monthlyChurnDecimal, 12);

    // Розрахунок CLV (кілька методів)
    const basicClv = monthlyChurnDecimal > 0 ? monthlyNetArpu / monthlyChurnDecimal : monthlyNetArpu * 999;
    
    // CLV з розширеним доходом
    const netMonthlyGrowth = expansionDecimal - monthlyChurnDecimal;
    const expandedClv = netMonthlyGrowth > 0 ? monthlyNetArpu / netMonthlyGrowth : basicClv;

    // NPV-скоригований CLV
    const monthlyDiscountRate = Math.pow(1 + discountRate / 100, 1/12) - 1;
    const npvClv = calculateNpvClv(monthlyNetArpu, monthlyChurnDecimal, monthlyDiscountRate, projectionMonths);

    // Бізнес-метрики
    const ltvCacRatio = customerAcquisitionCost > 0 ? basicClv / customerAcquisitionCost : 0;
    const paybackPeriodMonths = customerAcquisitionCost > 0 ? customerAcquisitionCost / monthlyNetArpu : 0;
    const customerRoi = customerAcquisitionCost > 0 ? ((basicClv - customerAcquisitionCost) / customerAcquisitionCost) * 100 : 0;

    // Генерація даних когортного аналізу для графіка
    const cohortData = generateCohortData(monthlyArpu, grossMarginDecimal, monthlyChurnDecimal, expansionDecimal, projectionMonths);

    // Функція форматування валюти
    const formatCurrency = (num) => {
      return num.toLocaleString('uk-UA', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    };

    // Генерація комплексних результатів
    const resultHTML = `
      <h3>Аналіз Customer Lifetime Value для SaaS</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">💰 Метрики Customer Lifetime Value</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div style="text-align: center; padding: 1rem; background: #e8f5e8; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #27ae60;">Базовий CLV</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(basicClv)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Стандартний розрахунок
            </p>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #cce5ff; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #0066cc;">Розширений CLV</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(expandedClv)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              З доходом від розширення
            </p>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #fff3cd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #856404;">NPV-скоригований CLV</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(npvClv)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Скоригований на поточну вартість
            </p>
          </div>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #27ae60; margin-bottom: 1rem;">📊 Ключові бізнес-метрики</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li><strong>Місячний ARPU:</strong> ${formatCurrency(monthlyArpu)}</li>
              <li><strong>Місячний чистий дохід:</strong> ${formatCurrency(monthlyNetArpu)}</li>
              <li><strong>Тривалість життя клієнта:</strong> ${customerLifespanMonths.toFixed(1)} місяців</li>
              <li><strong>Річний Churn Rate:</strong> ${(annualChurnRate * 100).toFixed(1)}%</li>
            </ul>
          </div>
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li><strong>Співвідношення LTV:CAC:</strong> ${ltvCacRatio.toFixed(1)}:1 ${getLtvCacAssessment(ltvCacRatio)}</li>
              <li><strong>Період окупності:</strong> ${paybackPeriodMonths.toFixed(1)} місяців</li>
              <li><strong>ROI клієнта:</strong> ${customerRoi.toFixed(0)}%</li>
              <li><strong>Вплив розширення:</strong> ${getExpansionImpact(expansionRate, monthlyChurn)}</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #0066cc; margin-bottom: 1rem;">🎯 Стратегічні інсайти та рекомендації</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Здоров'я юніт-економіки:</h5>
            <p style="margin: 0; padding: 0.5rem; background: ${getHealthColor(ltvCacRatio)}; border-radius: 3px;">
              ${getUnitEconomicsHealth(ltvCacRatio, paybackPeriodMonths)}
            </p>
          </div>
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Рекомендації для зростання:</h5>
            <p style="margin: 0; padding: 0.5rem; background: #f8f9fa; border-radius: 3px;">
              ${getGrowthRecommendations(monthlyChurn, expansionRate)}
            </p>
          </div>
        </div>
        
        <div style="margin-top: 1rem;">
          <h5 style="margin: 0 0 0.5rem 0;">Пріоритети оптимізації:</h5>
          <ul style="margin: 0; padding-left: 1.2rem;">
            ${getOptimizationPriorities(monthlyChurn, expansionRate, ltvCacRatio).map(priority => `<li>${priority}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="background: #f8d7da; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #721c24; margin-bottom: 0.5rem;">📈 Прогнози доходу</h5>
        <p style="margin: 0; color: #2c3e50;">
          <strong>Місячна вартість нових клієнтів:</strong> ${formatCurrency(newCustomersMonthly * basicClv)} (${newCustomersMonthly} клієнтів × ${formatCurrency(basicClv)} CLV)<br>
          <strong>Інвестиції в залучення клієнтів:</strong> ${formatCurrency(newCustomersMonthly * customerAcquisitionCost)}<br>
          <strong>Чиста створена вартість клієнтів:</strong> ${formatCurrency(newCustomersMonthly * (basicClv - customerAcquisitionCost))}
        </p>
      </div>
    `;

    document.getElementById("saas-clv-result").innerHTML = resultHTML;

    // Показати та оновити графік
    const chartBlock = document.getElementById("clv-metrics-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("clv-metrics-chart").getContext("2d");
      if (window.clvMetricsChart) window.clvMetricsChart.destroy();

      window.clvMetricsChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: cohortData.labels,
          datasets: [
            {
              label: "Накопичений дохід",
              data: cohortData.cumulativeRevenue,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              fill: true,
              tension: 0.1
            },
            {
              label: "Клієнти, що залишились",
              data: cohortData.customersRemaining,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              fill: false,
              tension: 0.1,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  if (context.datasetIndex === 0) {
                    return "Дохід: " + formatCurrency(context.parsed.y);
                  } else {
                    return "Клієнти: " + context.parsed.y.toFixed(0) + "%";
                  }
                }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: "Накопичений дохід ($)" },
              ticks: {
                callback: function (value) {
                  return formatCurrency(value);
                }
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: "Утримання клієнтів %" },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: function (value) {
                  return value.toFixed(0) + "%";
                }
              }
            },
            x: {
              title: { display: true, text: "Місяці" }
            }
          }
        }
      });
    });
  });

  // Допоміжні функції
  function calculateNpvClv(monthlyRevenue, churnRate, discountRate, months) {
    let npvTotal = 0;
    let survivingCustomers = 1;
    
    for (let month = 1; month <= months; month++) {
      const monthlyValue = survivingCustomers * monthlyRevenue;
      const discountedValue = monthlyValue / Math.pow(1 + discountRate, month);
      npvTotal += discountedValue;
      survivingCustomers *= (1 - churnRate);
      
      if (survivingCustomers < 0.01) break; // Зупинити коли <1% залишається
    }
    
    return npvTotal;
  }

  function generateCohortData(arpu, marginDecimal, churnRate, expansionRate, months) {
    const labels = [];
    const cumulativeRevenue = [];
    const customersRemaining = [];
    
    let customers = 1; // Початок з когорти з 1 клієнта
    let totalRevenue = 0;
    let currentArpu = arpu * marginDecimal;
    
    for (let month = 1; month <= months; month++) {
      labels.push(`Місяць ${month}`);
      
      // Розрахунок доходу за цей місяць
      const monthlyRevenue = customers * currentArpu;
      totalRevenue += monthlyRevenue;
      cumulativeRevenue.push(totalRevenue);
      
      // Відстеження утримання клієнтів
      customersRemaining.push(customers * 100);
      
      // Застосування churn та розширення для наступного місяця
      customers *= (1 - churnRate);
      currentArpu *= (1 + expansionRate);
      
      if (customers < 0.001) break; // Зупинити коли практично не залишається клієнтів
    }
    
    return { labels, cumulativeRevenue, customersRemaining };
  }

  function getLtvCacAssessment(ratio) {
    if (ratio < 1) return "❌";
    if (ratio < 3) return "⚠️";
    if (ratio < 5) return "✅";
    return "🎯";
  }

  function getHealthColor(ratio) {
    if (ratio < 3) return "#f8d7da";
    if (ratio < 5) return "#fff3cd";
    return "#d4edda";
  }

  function getUnitEconomicsHealth(ltvCacRatio, payback) {
    if (ltvCacRatio < 1) return "❌ Нестійко - CAC перевищує CLV";
    if (ltvCacRatio < 3) return "⚠️ Граничний стан - потрібно покращити утримання або зменшити CAC";
    if (payback > 18) return "⚠️ Гарне співвідношення, але довгий період окупності";
    if (ltvCacRatio >= 5) return "🎯 Відмінно - сильна юніт-економіка";
    return "✅ Здорово - гарний баланс зростання та ефективності";
  }

  function getExpansionImpact(expansion, churn) {
    const netGrowth = expansion - churn;
    if (netGrowth > 0) return `${expansion.toFixed(1)}% розширення створює чисте зростання`;
    if (expansion > churn * 0.5) return `${expansion.toFixed(1)}% розширення значно зменшує вплив churn`;
    return `${expansion.toFixed(1)}% розширення допомагає компенсувати churn`;
  }

  function getGrowthRecommendations(churn, expansion) {
    if (churn > 5) return "Зосередитися на зменшенні churn - високий відтік обмежує зростання";
    if (expansion < 2) return "Збільшити дохід від розширення через допродажі та крос-продажі";
    return "Збалансована стратегія утримання та розширення";
  }

  function getOptimizationPriorities(churn, expansion, ltvCac) {
    const priorities = [];
    
    if (churn > 5) priorities.push("🎯 <strong>Критично:</strong> Зменшити місячний churn нижче 3-5%");
    if (expansion < 2) priorities.push("📈 <strong>Високий:</strong> Впровадити стратегії доходу від розширення");
    if (ltvCac < 3) priorities.push("💰 <strong>Критично:</strong> Покращити співвідношення LTV:CAC вище 3:1");
    if (ltvCac > 8) priorities.push("🚀 <strong>Можливість:</strong> Розглянути збільшення маркетингових витрат");
    
    if (priorities.length === 0) {
      priorities.push("✅ <strong>Оптимізація:</strong> Зосередитися на поступових покращеннях всіх метрик");
    }
    
    return priorities;
  }
});

// Динамічний завантажувач для Chart.js
function ensureChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.body.appendChild(script);
}