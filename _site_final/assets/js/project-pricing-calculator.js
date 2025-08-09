document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("project-pricing-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const baseProjectCost = parseFloat(document.getElementById("baseProjectCost").value);
    const baseProjectHours = parseFloat(document.getElementById("baseProjectHours").value);
    const baseProjectComplexity = parseInt(document.getElementById("baseProjectComplexity").value);
    const currentComplexity = parseInt(document.getElementById("currentComplexity").value);
    const timelinePressure = document.getElementById("timelinePressure").value;
    const clientTier = document.getElementById("clientTier").value;
    const projectScope = document.getElementById("projectScope").value;
    const riskLevel = document.getElementById("riskLevel").value;
    const revisions = parseInt(document.getElementById("revisions").value);
    const profitMargin = parseFloat(document.getElementById("profitMargin").value) / 100;

    // Розрахунок базової погодинної ставки з історичного проекту
    const baseHourlyRate = baseProjectCost / baseProjectHours;

    // Коригування складності
    const complexityMultiplier = currentComplexity / baseProjectComplexity;

    // Множник тиску термінів
    const timelineMultipliers = {
      'relaxed': 0.9,
      'normal': 1.0,
      'tight': 1.3,
      'rush': 1.8
    };

    // Множник рівня клієнта
    const clientMultipliers = {
      'startup': 0.8,
      'medium': 1.0,
      'enterprise': 1.4,
      'nonprofit': 0.7
    };

    // Множник обсягу проекту
    const scopeMultipliers = {
      'smaller': 0.5,
      'similar': 1.0,
      'larger': 1.5,
      'much-larger': 2.0
    };

    // Буфер ризику
    const riskBuffers = {
      'low': 1.1,
      'medium': 1.2,
      'high': 1.4
    };

    // Розрахунок скоригованої вартості проекту
    let adjustedCost = baseProjectCost * 
                      complexityMultiplier * 
                      timelineMultipliers[timelinePressure] * 
                      clientMultipliers[clientTier] * 
                      scopeMultipliers[projectScope] * 
                      riskBuffers[riskLevel];

    // Додавання вартості ревізій (кожна ревізія = 10% від базової вартості)
    const revisionCost = adjustedCost * 0.1 * revisions;
    adjustedCost += revisionCost;

    // Додавання маржі прибутку
    const finalPrice = adjustedCost * (1 + profitMargin);

    // Розрахунок оцінки годин
    const estimatedHours = baseProjectHours * 
                          complexityMultiplier * 
                          scopeMultipliers[projectScope] * 
                          (timelinePressure === 'rush' ? 1.2 : 1.0);

    // Розрахунок ефективної погодинної ставки
    const effectiveHourlyRate = finalPrice / estimatedHours;

    // Створення цінових рівнів
    const basicPrice = adjustedCost;
    const recommendedPrice = finalPrice;
    const premiumPrice = finalPrice * 1.3;

    // Пропозиція графіка платежів
    const upfrontPayment = finalPrice * 0.4;
    const milestonePayment = finalPrice * 0.4;
    const finalPayment = finalPrice * 0.2;

    // Оцінка ризику
    let riskWarning = "";
    if (riskLevel === 'high' || timelinePressure === 'rush') {
      riskWarning = "⚠️ Високоризиковий проект - розгляньте додатковий захист обсягу";
    } else if (currentComplexity > baseProjectComplexity + 1) {
      riskWarning = "📈 Значне збільшення складності - уважно контролюйте обсяг";
    } else {
      riskWarning = "✅ Керований рівень ризику при правильному плануванні";
    }

    // Форматування валюти
    const formatCurrency = (amount) => {
      return amount.toLocaleString('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    };

    // Відображення результатів
    const resultBlock = document.getElementById("project-pricing-result");
    resultBlock.innerHTML = `
      <h3>💼 Аналіз ціноутворення проекту</h3>
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>💰 Ціна на основі витрат</h6>
          <div class="big-number">${formatCurrency(Math.round(basicPrice))}</div>
          <p>Покриває витрати + буфер ризику<br>
          Без маржі прибутку<br>
          Мінімальна життєздатна ціна</p>
        </div>
        
        <div class="insight-card success">
          <h6>🎯 Рекомендована ціна</h6>
          <div class="big-number">${formatCurrency(Math.round(recommendedPrice))}</div>
          <p>Включає ${(profitMargin * 100)}% маржу прибутку<br>
          ${Math.round(effectiveHourlyRate)} грн ефективно за годину<br>
          Стійке ціноутворення</p>
        </div>
        
        <div class="insight-card info">
          <h6>🚀 Преміальна ціна</h6>
          <div class="big-number">${formatCurrency(Math.round(premiumPrice))}</div>
          <p>Позиціонування високої цінності<br>
          Ціноутворення експертного рівня<br>
          Тестування реакції ринку</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📊 Розбивка аналізу проекту</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>📈 Коригування ціноутворення:</strong><br>
            Базовий проект: ${formatCurrency(baseProjectCost)}<br>
            Складність: ${(complexityMultiplier * 100).toFixed(0)}% (${currentComplexity} vs ${baseProjectComplexity})<br>
            Терміни: ${(timelineMultipliers[timelinePressure] * 100).toFixed(0)}% (${getTimelineName(timelinePressure)})<br>
            Рівень клієнта: ${(clientMultipliers[clientTier] * 100).toFixed(0)}% (${getClientName(clientTier)})<br>
            Обсяг: ${(scopeMultipliers[projectScope] * 100).toFixed(0)}% (${getScopeName(projectScope)})<br>
            Буфер ризику: ${(riskBuffers[riskLevel] * 100).toFixed(0)}% (${getRiskName(riskLevel)} ризик)
          </div>
          
          <div>
            <strong>⏱️ Оцінка часу:</strong><br>
            Години базового проекту: ${baseProjectHours}<br>
            Оцінені години: ${Math.round(estimatedHours)}<br>
            Базова погодинна ставка: ${Math.round(baseHourlyRate)} грн<br>
            Ефективна погодинна: ${Math.round(effectiveHourlyRate)} грн<br>
            Ревізій включено: ${revisions} раундів<br>
            Вартість ревізій: ${formatCurrency(Math.round(revisionCost))}
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px;">
          <strong>💳 Пропонований графік платежів (маржа ${(profitMargin * 100)}%):</strong><br>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 0.5rem; text-align: center;">
            <div style="padding: 0.5rem; background: #e8f5e8; border-radius: 6px;">
              <strong>40% Авансом</strong><br>
              ${formatCurrency(Math.round(upfrontPayment))}
            </div>
            <div style="padding: 0.5rem; background: #e3f2fd; border-radius: 6px;">
              <strong>40% Етап</strong><br>
              ${formatCurrency(Math.round(milestonePayment))}
            </div>
            <div style="padding: 0.5rem; background: #fff3cd; border-radius: 6px;">
              <strong>20% Завершення</strong><br>
              ${formatCurrency(Math.round(finalPayment))}
            </div>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${riskLevel === 'high' ? '#f8d7da' : riskLevel === 'medium' ? '#fff3cd' : '#d4edda'}; border-radius: 8px; border-left: 4px solid ${riskLevel === 'high' ? '#dc3545' : riskLevel === 'medium' ? '#ffc107' : '#28a745'};">
          <strong>🎯 Стратегія ціноутворення:</strong><br>
          ${riskWarning}<br><br>
          
          <strong>💡 Поради для переговорів:</strong><br>
          • Починайте з рекомендованої ціни (${formatCurrency(Math.round(recommendedPrice))}) для клієнтів, орієнтованих на цінність<br>
          • Мінімальна прийнятна: ${formatCurrency(Math.round(basicPrice))} (покриває витрати, але без прибутку)<br>
          • Преміальне позиціонування: ${formatCurrency(Math.round(premiumPrice))} для корпоративних клієнтів<br>
          • Включіть процес зміни обсягу та погодинну ставку для додаткової роботи<br>
          • Розгляньте пропозицію пакетних опцій на різних рівнях обслуговування
          
          <div style="margin-top: 1rem; padding: 0.8rem; background: rgba(255,255,255,0.8); border-radius: 6px;">
            <strong>🇺🇦 Українські особливості:</strong><br>
            • При роботі з міжнародними клієнтами ціни краще встановлювати в USD/EUR<br>
            • Враховуйте конкурентні переваги українських IT-послуг<br>
            • Використовуйте часовий пояс як перевагу для європейських клієнтів<br>
            • Підкреслюйте високу якість та досвід українських фахівців
          </div>
        </div>
      </div>
    `;
  });

  // Допоміжні функції для перекладу значень
  function getTimelineName(timeline) {
    const names = {
      'relaxed': 'вільний',
      'normal': 'нормальний',
      'tight': 'жорсткий',
      'rush': 'терміновий'
    };
    return names[timeline] || timeline;
  }

  function getClientName(client) {
    const names = {
      'startup': 'стартап',
      'medium': 'середній бізнес',
      'enterprise': 'корпорація',
      'nonprofit': 'некомерційна'
    };
    return names[client] || client;
  }

  function getScopeName(scope) {
    const names = {
      'smaller': 'менший',
      'similar': 'схожий',
      'larger': 'більший',
      'much-larger': 'значно більший'
    };
    return names[scope] || scope;
  }

  function getRiskName(risk) {
    const names = {
      'low': 'низький',
      'medium': 'середній',
      'high': 'високий'
    };
    return names[risk] || risk;
  }
});