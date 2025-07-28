document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('stock-valuation-form');
  const result = document.getElementById('stock-valuation-result');

  function formatCurrency(value) {
    return value.toLocaleString('uk-UA', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatPercentage(value) {
    return `${value.toFixed(1).replace('.', ',')}%`;
  }

  function calculateGrahamNumber(eps, bookValue) {
    if (eps <= 0 || bookValue <= 0) return 0;
    return Math.sqrt(22.5 * eps * bookValue);
  }

  function calculateEarningsBasedValue(eps, growthRate, industryType) {
    if (eps <= 0) return 0;
    
    // Base P/E ratios by industry (Graham's conservative approach)
    const basePE = {
      'defensive': 12,
      'stable': 10,
      'cyclical': 8,
      'growth': 15,
      'speculative': 6
    };
    
    const pe = basePE[industryType] || 10;
    
    // Adjust for growth (Graham's formula: PE = 8.5 + 2 * growth rate, capped at 15)
    const adjustedPE = Math.min(8.5 + (2 * Math.max(0, growthRate)), pe);
    
    return eps * adjustedPE;
  }

  function calculateDividendValue(dividend, growthRate, requiredReturn) {
    if (dividend <= 0 || requiredReturn <= growthRate) return 0;
    
    const dividendGrowth = Math.min(growthRate, 6); // Cap dividend growth at 6%
    return dividend * (1 + dividendGrowth / 100) / ((requiredReturn - dividendGrowth) / 100);
  }

  function calculateAssetValue(bookValue, industryType) {
    if (bookValue <= 0) return 0;
    
    // Asset-based multipliers by industry
    const assetMultipliers = {
      'defensive': 1.2,
      'stable': 1.0,
      'cyclical': 0.8,
      'growth': 0.6,
      'speculative': 0.4
    };
    
    return bookValue * (assetMultipliers[industryType] || 1.0);
  }

  function getQualityScore(earningsStability, dividendHistory, competitivePosition, debtEquity) {
    let score = 0;
    
    // Earnings stability score
    const stabilityScores = { 'excellent': 3, 'good': 2, 'moderate': 1, 'poor': 0, 'unknown': 0 };
    score += stabilityScores[earningsStability] || 0;
    
    // Dividend history score
    const dividendScores = { 'excellent': 3, 'good': 2, 'moderate': 1, 'poor': 0, 'none': 0 };
    score += dividendScores[dividendHistory] || 0;
    
    // Competitive position score
    const competitiveScores = { 'dominant': 3, 'strong': 2, 'average': 1, 'weak': 0, 'unknown': 0 };
    score += competitiveScores[competitivePosition] || 0;
    
    // Debt level score (Graham preferred debt-to-equity below 50%)
    if (debtEquity <= 25) score += 2;
    else if (debtEquity <= 50) score += 1;
    else if (debtEquity <= 100) score += 0;
    else score -= 1;
    
    return Math.max(0, Math.min(11, score)); // Score range 0-11
  }

  function getInvestmentRecommendation(currentPrice, fairValue, qualityScore, riskTolerance) {
    const priceToValue = currentPrice / fairValue;
    const marginOfSafety = (1 - priceToValue) * 100;
    
    // Adjust recommendation based on quality and risk tolerance
    const qualityMultiplier = qualityScore >= 8 ? 1.0 : qualityScore >= 5 ? 0.85 : 0.7;
    const riskMultiplier = riskTolerance === 'conservative' ? 0.8 : riskTolerance === 'moderate' ? 0.9 : 1.0;
    
    const adjustedMargin = marginOfSafety * qualityMultiplier * riskMultiplier;
    
    if (adjustedMargin >= 40) return { action: 'Сильна покупка', color: 'success' };
    if (adjustedMargin >= 20) return { action: 'Покупка', color: 'info' };
    if (adjustedMargin >= -20) return { action: 'Утримання', color: 'warning' };
    if (adjustedMargin >= -40) return { action: 'Продаж', color: 'warning' };
    return { action: 'Сильний продаж', color: 'warning' };
  }

  function getGrahamCriteria(eps, bookValue, currentPrice, debtEquity, earningsStability) {
    const criteria = [];
    
    // P/E ratio check
    const pe = currentPrice / eps;
    criteria.push({
      test: 'P/E коефіцієнт ≤ 15',
      passed: pe <= 15,
      value: pe.toFixed(1).replace('.', ',')
    });
    
    // P/B ratio check  
    const pb = currentPrice / bookValue;
    criteria.push({
      test: 'P/B коефіцієнт ≤ 1,5',
      passed: pb <= 1.5,
      value: pb.toFixed(1).replace('.', ',')
    });
    
    // P/E × P/B check
    criteria.push({
      test: 'P/E × P/B ≤ 22,5',
      passed: (pe * pb) <= 22.5,
      value: (pe * pb).toFixed(1).replace('.', ',')
    });
    
    // Debt-to-equity check
    criteria.push({
      test: 'Борг/Капітал ≤ 50%',
      passed: debtEquity <= 50,
      value: `${debtEquity}%`
    });
    
    // Earnings stability
    const stabilityNames = {
      'excellent': 'Відмінна',
      'good': 'Хороша', 
      'moderate': 'Помірна',
      'poor': 'Погана',
      'unknown': 'Невідома'
    };
    criteria.push({
      test: 'Стабільні прибутки',
      passed: ['excellent', 'good'].includes(earningsStability),
      value: stabilityNames[earningsStability] || earningsStability
    });
    
    return criteria;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form values
      const currentPrice = parseFloat(document.getElementById('current-price').value);
      const eps = parseFloat(document.getElementById('eps').value);
      const bookValue = parseFloat(document.getElementById('book-value').value);
      const dividend = parseFloat(document.getElementById('dividend').value) || 0;
      const growthRate = parseFloat(document.getElementById('growth-rate').value) || 0;
      const debtEquity = parseFloat(document.getElementById('debt-equity').value) || 0;
      const requiredReturn = parseFloat(document.getElementById('required-return').value) || 12;
      
      const earningsStability = document.getElementById('earnings-stability').value;
      const dividendHistory = document.getElementById('dividend-history').value;
      const competitivePosition = document.getElementById('competitive-position').value;
      const industryType = document.getElementById('industry-type').value;
      const timeHorizon = document.getElementById('time-horizon').value;
      const riskTolerance = document.getElementById('risk-tolerance').value;

      // Validation
      if (!currentPrice || !eps || !bookValue || !earningsStability || !dividendHistory || 
          !competitivePosition || !industryType || !timeHorizon || !riskTolerance) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Відсутня інформація</h6>
            <p>Будь ласка, заповніть всі обов'язкові поля для розрахунку справедливої вартості.</p>
          </div>
        `;
        return;
      }

      if (eps <= 0 || bookValue <= 0) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Неправильні фінансові дані</h6>
            <p>EPS та балансова вартість повинні бути позитивними. Цей метод не застосовується до збиткових компаній або тих, що мають негативну балансову вартість.</p>
          </div>
        `;
        return;
      }

      // Calculate different valuation methods
      const grahamNumber = calculateGrahamNumber(eps, bookValue);
      const earningsValue = calculateEarningsBasedValue(eps, growthRate, industryType);
      const dividendValue = dividend > 0 ? calculateDividendValue(dividend, growthRate, requiredReturn) : 0;
      const assetValue = calculateAssetValue(bookValue, industryType);

      // Calculate weighted average fair value
      const validValues = [grahamNumber, earningsValue, assetValue];
      if (dividendValue > 0) validValues.push(dividendValue);
      
      const fairValue = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
      
      // Calculate quality score and recommendation
      const qualityScore = getQualityScore(earningsStability, dividendHistory, competitivePosition, debtEquity);
      const recommendation = getInvestmentRecommendation(currentPrice, fairValue, qualityScore, riskTolerance);
      const marginOfSafety = ((fairValue - currentPrice) / fairValue) * 100;
      
      // Graham criteria analysis
      const criteria = getGrahamCriteria(eps, bookValue, currentPrice, debtEquity, earningsStability);
      const passedCriteria = criteria.filter(c => c.passed).length;

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${recommendation.color}">
            <h6>🎯 Інвестиційна рекомендація</h6>
            <div class="big-number">${recommendation.action}</div>
            <p><strong>Рейтинг якості: ${qualityScore}/11</strong></p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💰 Оцінена справедлива вартість</h6>
            <div class="big-number">${formatCurrency(fairValue)}</div>
            <p>Поточна: ${formatCurrency(currentPrice)} | Межа: ${formatPercentage(marginOfSafety)}</p>
          </div>
          <div class="insight-card">
            <h6>📊 Число Грема</h6>
            <div class="big-number">${formatCurrency(grahamNumber)}</div>
            <p>Консервативна внутрішня вартість</p>
          </div>
          <div class="insight-card">
            <h6>📈 Вартість за прибутками</h6>
            <div class="big-number">${formatCurrency(earningsValue)}</div>
            <p>На основі P/E та зростання</p>
          </div>
        </div>

        ${dividendValue > 0 ? `
        <div class="insight-cards">
          <div class="insight-card">
            <h6>💵 Дивідендна вартість</h6>
            <div class="big-number">${formatCurrency(dividendValue)}</div>
            <p>Модель дисконтування дивідендів</p>
          </div>
          <div class="insight-card">
            <h6>🏢 Вартість активів</h6>
            <div class="big-number">${formatCurrency(assetValue)}</div>
            <p>Скоригована балансова вартість</p>
          </div>
        </div>
        ` : `
        <div class="insight-cards">
          <div class="insight-card">
            <h6>🏢 Вартість активів</h6>
            <div class="big-number">${formatCurrency(assetValue)}</div>
            <p>Скоригована балансова вартість</p>
          </div>
        </div>
        `}

        <div class="insight-card info">
          <h6>📋 Критерії Бенджаміна Грема (${passedCriteria}/${criteria.length} пройдено)</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            ${criteria.map(c => `
              <p>${c.passed ? '✅' : '❌'} <strong>${c.test}:</strong> ${c.value}</p>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h6>📊 Аналіз оцінки</h6>
          <div style="text-align: left;">
            <p><strong>Поточний P/E коефіцієнт:</strong> ${(currentPrice / eps).toFixed(1).replace('.', ',')}x</p>
            <p><strong>Поточний P/B коефіцієнт:</strong> ${(currentPrice / bookValue).toFixed(1).replace('.', ',')}x</p>
            ${dividend > 0 ? `<p><strong>Дивідендна дохідність:</strong> ${formatPercentage((dividend / currentPrice) * 100)}</p>` : ''}
            <p><strong>Ціна проти числа Грема:</strong> ${formatPercentage((currentPrice / grahamNumber - 1) * 100)}</p>
            <p><strong>Очікуваний темп зростання:</strong> ${formatPercentage(growthRate)}</p>
          </div>
        </div>

        <div class="insight-card ${marginOfSafety >= 25 ? 'success' : marginOfSafety >= 0 ? 'warning' : 'warning'}">
          <h6>🛡️ Оцінка ризику</h6>
          <div style="text-align: left;">
            <p><strong>Межа безпеки:</strong> ${formatPercentage(marginOfSafety)}</p>
            <p><strong>Рейтинг якості:</strong> ${qualityScore}/11 (${qualityScore >= 8 ? 'Висока' : qualityScore >= 5 ? 'Середня' : 'Низька'} якість)</p>
            <p><strong>Критерії Грема:</strong> ${passedCriteria}/${criteria.length} вимог виконано</p>
            <p><strong>Рівень ризику:</strong> ${marginOfSafety >= 25 ? 'Низький' : marginOfSafety >= 0 ? 'Середній' : 'Високий'}</p>
          </div>
        </div>

        <div class="insight-card warning">
          <h6>⚠️ Інвестиційні застереження</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>• Не інвестиційна порада:</strong> Цей аналіз призначений лише для навчальних цілей. Минула продуктивність не гарантує майбутніх результатів.</p>
            <p><strong>• Значний ризик:</strong> Інвестиції в акції несуть значний ризик, включаючи потенційну втрату основної суми. Ринкові ціни можуть бути волатильними.</p>
            <p><strong>• Професійні консультації:</strong> Завжди консультуйтеся з кваліфікованими фінансовими консультантами перед прийняттям інвестиційних рішень.</p>
            <p><strong>• Необхідна належна перевірка:</strong> Проводьте ретельне дослідження поза цими розрахунками, включаючи останні новини, галузеві тренди та розвиток компанії.</p>
            <p><strong>• Обмеження моделі:</strong> Моделі оцінки надають оцінки на основі історичних даних та припущень, які можуть не відображати майбутню реальність.</p>
            <p><strong>• Українське законодавство:</strong> Прибуток від акцій в Україні оподатковується за ставкою 18% + військовий збір 1,5%.</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📈 Керівництво з інвестиційної стратегії</h6>
          <div style="text-align: left;">
            <p><strong>При покупці:</strong></p>
            <ul>
              <li>Чекайте цін ${formatPercentage(25)} або більше нижче справедливої вартості</li>
              <li>Переконайтеся, що компанія відповідає принаймні 3/5 критеріям Грема</li>
              <li>Диверсифікуйте серед кількох якісних акцій</li>
              <li>Плануйте утримувати протягом ${timeHorizon === 'long' ? '5+ років' : timeHorizon === 'medium' ? '2-5 років' : '1-2 років'}</li>
            </ul>
            <p><strong>Регулярно відстежуйте:</strong></p>
            <ul>
              <li>Щоквартальні прибутки та розвиток бізнесу</li>
              <li>Зміни в конкурентній позиції</li>
              <li>Оновлені розрахунки справедливої вартості</li>
              <li>Загальну диверсифікацію портфеля</li>
            </ul>
            <p><strong>Українські особливості:</strong></p>
            <ul>
              <li>Врахуйте валютні ризики (USD/UAH)</li>
              <li>Моніторьте геополітичну ситуацію</li>
              <li>Використовуйте ліцензованих українських брокерів</li>
              <li>Відслідковуйте податкові зобов'язання</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});