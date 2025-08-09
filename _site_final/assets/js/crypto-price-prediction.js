document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('crypto-prediction-form');
  const result = document.getElementById('crypto-prediction-result');

  function formatCurrency(value, decimals = 6) {
    if (value >= 1000) {
      return value.toLocaleString('uk-UA', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).replace('$', '$');
    } else if (value >= 1) {
      return value.toLocaleString('uk-UA', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }).replace('$', '$');
    } else {
      return value.toLocaleString('uk-UA', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).replace('$', '$');
    }
  }

  function formatPercentage(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1).replace('.', ',')}%`;
  }

  function calculateTechnicalScore(rsi, macdSignal, maPosition, supportResistance) {
    let score = 0;
    
    // RSI scoring
    if (rsi <= 30) score += 2; // Oversold - bullish
    else if (rsi <= 40) score += 1;
    else if (rsi <= 60) score += 0;
    else if (rsi <= 70) score -= 1;
    else score -= 2; // Overbought - bearish
    
    // MACD scoring
    const macdScores = {
      'strong-bullish': 3,
      'bullish': 2,
      'neutral': 0,
      'bearish': -2,
      'strong-bearish': -3
    };
    score += macdScores[macdSignal] || 0;
    
    // Moving average scoring
    const maScores = {
      'above-all': 3,
      'above-short': 1,
      'mixed': 0,
      'below-short': -1,
      'below-all': -3
    };
    score += maScores[maPosition] || 0;
    
    // Support/Resistance scoring
    const srScores = {
      'breakout': 2,
      'near-resistance': -1,
      'mid-range': 0,
      'near-support': 1,
      'breakdown': -2
    };
    score += srScores[supportResistance] || 0;
    
    return score;
  }

  function calculateSentimentScore(fearGreed, socialSentiment, newsImpact, btcCorrelation) {
    let score = 0;
    
    // Fear & Greed (contrarian indicator)
    const fgScores = {
      'extreme-greed': -2, // Contrarian - too much greed is bearish
      'greed': -1,
      'neutral': 0,
      'fear': 1,
      'extreme-fear': 2 // Contrarian - extreme fear is bullish
    };
    score += fgScores[fearGreed] || 0;
    
    // Social sentiment
    const socialScores = {
      'very-bullish': 2,
      'bullish': 1,
      'neutral': 0,
      'bearish': -1,
      'very-bearish': -2
    };
    score += socialScores[socialSentiment] || 0;
    
    // News impact
    const newsScores = {
      'very-positive': 3,
      'positive': 1,
      'neutral': 0,
      'negative': -1,
      'very-negative': -3
    };
    score += newsScores[newsImpact] || 0;
    
    // BTC correlation (affects altcoins mainly)
    const corrScores = {
      'high-positive': 0, // Neutral - follows general market
      'moderate-positive': 0,
      'independent': 1, // Positive - independent strength
      'negative': -1 // Negative - going against market
    };
    score += corrScores[btcCorrelation] || 0;
    
    return score;
  }

  function calculateVolumeMultiplier(volumeLevel) {
    const multipliers = {
      'very-high': 1.5,
      'high': 1.2,
      'normal': 1.0,
      'low': 0.8,
      'very-low': 0.6
    };
    return multipliers[volumeLevel] || 1.0;
  }

  function getVolatilityMultiplier(volatility, timeframe) {
    const baseMultipliers = {
      'very-high': 2.0,
      'high': 1.5,
      'normal': 1.0,
      'low': 0.7
    };
    
    const timeMultipliers = {
      'short': 0.5,
      'medium': 1.0,
      'long': 1.5
    };
    
    return (baseMultipliers[volatility] || 1.0) * (timeMultipliers[timeframe] || 1.0);
  }

  function calculatePricePrediction(currentPrice, technicalScore, sentimentScore, volumeMultiplier, volatilityMultiplier, confidence, timeframe) {
    // Base prediction calculation
    const totalScore = technicalScore + sentimentScore;
    
    // Convert score to percentage change expectation
    let baseChange = totalScore * 2; // Each point = ~2% change
    
    // Apply multipliers
    baseChange *= volumeMultiplier;
    baseChange *= volatilityMultiplier;
    
    // Confidence adjustment
    const confidenceMultipliers = { 'high': 1.0, 'medium': 0.7, 'low': 0.4 };
    baseChange *= confidenceMultipliers[confidence] || 0.7;
    
    // Timeframe adjustments
    const timeMultipliers = { 'short': 0.3, 'medium': 0.7, 'long': 1.0 };
    baseChange *= timeMultipliers[timeframe] || 0.7;
    
    // Calculate price ranges
    const conservativeChange = baseChange * 0.6;
    const aggressiveChange = baseChange * 1.4;
    
    return {
      conservative: currentPrice * (1 + conservativeChange / 100),
      target: currentPrice * (1 + baseChange / 100),
      aggressive: currentPrice * (1 + aggressiveChange / 100),
      changePercentage: baseChange
    };
  }

  function getPredictionRecommendation(technicalScore, sentimentScore, confidence) {
    const totalScore = technicalScore + sentimentScore;
    
    if (totalScore >= 6 && confidence === 'high') return { action: 'Сильний сигнал покупки', color: 'success' };
    if (totalScore >= 3) return { action: 'Сигнал покупки', color: 'info' };
    if (totalScore >= -2) return { action: 'Утримання/Нейтральний', color: 'warning' };
    if (totalScore >= -5) return { action: 'Сигнал продажу', color: 'warning' };
    return { action: 'Сильний сигнал продажу', color: 'warning' };
  }

  function getRiskLevel(volatilityMultiplier, confidence, totalScore) {
    let riskScore = 0;
    
    if (volatilityMultiplier > 1.5) riskScore += 2;
    else if (volatilityMultiplier > 1.2) riskScore += 1;
    
    if (confidence === 'low') riskScore += 2;
    else if (confidence === 'medium') riskScore += 1;
    
    if (Math.abs(totalScore) > 6) riskScore += 1;
    
    if (riskScore >= 4) return { level: 'Дуже високий', color: 'warning' };
    if (riskScore >= 2) return { level: 'Високий', color: 'warning' };
    if (riskScore >= 1) return { level: 'Середній', color: 'info' };
    return { level: 'Низький', color: 'success' };
  }

  function getKeyLevels(currentPrice, supportResistance, prediction) {
    const levels = {};
    
    // Calculate support and resistance based on current position
    if (supportResistance === 'breakout') {
      levels.support = currentPrice * 0.95;
      levels.resistance = prediction.aggressive;
    } else if (supportResistance === 'near-resistance') {
      levels.resistance = currentPrice * 1.05;
      levels.support = currentPrice * 0.90;
    } else if (supportResistance === 'near-support') {
      levels.support = currentPrice * 0.95;
      levels.resistance = currentPrice * 1.10;
    } else if (supportResistance === 'breakdown') {
      levels.resistance = currentPrice * 1.05;
      levels.support = prediction.conservative;
    } else {
      levels.support = currentPrice * 0.90;
      levels.resistance = currentPrice * 1.10;
    }
    
    // Stop loss and take profit suggestions
    levels.stopLoss = currentPrice * (prediction.changePercentage > 0 ? 0.92 : 1.08);
    levels.takeProfit = prediction.changePercentage > 0 ? prediction.aggressive : prediction.conservative;
    
    return levels;
  }

  // Ukrainian crypto name mapping
  function getCryptoNameUkrainian(cryptoSymbol) {
    const names = {
      'bitcoin': 'Біткоїн',
      'ethereum': 'Ефіріум',
      'cardano': 'Кардано',
      'solana': 'Солана',
      'polkadot': 'Полкадот',
      'chainlink': 'Чейнлінк',
      'other': 'Вибрана криптовалюта'
    };
    return names[cryptoSymbol] || cryptoSymbol.charAt(0).toUpperCase() + cryptoSymbol.slice(1);
  }

  // Ukrainian timeframe mapping
  function getTimeframeUkrainian(timeframe) {
    const timeframes = {
      'short': 'Короткострокові',
      'medium': 'Середньострокові',
      'long': 'Довгострокові'
    };
    return timeframes[timeframe] || timeframe;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form values
      const cryptoSymbol = document.getElementById('crypto-symbol').value;
      const currentPrice = parseFloat(document.getElementById('current-price').value);
      const dailyChange = parseFloat(document.getElementById('daily-change').value) || 0;
      const weeklyChange = parseFloat(document.getElementById('weekly-change').value) || 0;
      const volumeLevel = document.getElementById('volume-level').value;
      const rsi = parseFloat(document.getElementById('rsi').value) || 50;
      const macdSignal = document.getElementById('macd-signal').value;
      const maPosition = document.getElementById('ma-position').value;
      const supportResistance = document.getElementById('support-resistance').value;
      const fearGreed = document.getElementById('fear-greed').value;
      const socialSentiment = document.getElementById('social-sentiment').value;
      const newsImpact = document.getElementById('news-impact').value;
      const btcCorrelation = document.getElementById('btc-correlation').value;
      const timeframe = document.getElementById('timeframe').value;
      const confidence = document.getElementById('confidence').value;
      const volatility = document.getElementById('volatility').value;

      // Validation
      if (!cryptoSymbol || !currentPrice || !volumeLevel || !macdSignal || !maPosition || 
          !supportResistance || !fearGreed || !socialSentiment || !newsImpact || 
          !btcCorrelation || !timeframe || !confidence || !volatility) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Відсутня інформація</h6>
            <p>Будь ласка, заповніть всі обов'язкові поля для генерації прогнозу ціни.</p>
          </div>
        `;
        return;
      }

      if (currentPrice <= 0) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Неправильна ціна</h6>
            <p>Будь ласка, введіть дійсну поточну ціну більше нуля.</p>
          </div>
        `;
        return;
      }

      // Calculate scores and predictions
      const technicalScore = calculateTechnicalScore(rsi, macdSignal, maPosition, supportResistance);
      const sentimentScore = calculateSentimentScore(fearGreed, socialSentiment, newsImpact, btcCorrelation);
      const volumeMultiplier = calculateVolumeMultiplier(volumeLevel);
      const volatilityMultiplier = getVolatilityMultiplier(volatility, timeframe);
      
      const prediction = calculatePricePrediction(
        currentPrice, technicalScore, sentimentScore, 
        volumeMultiplier, volatilityMultiplier, confidence, timeframe
      );
      
      const recommendation = getPredictionRecommendation(technicalScore, sentimentScore, confidence);
      const riskAssessment = getRiskLevel(volatilityMultiplier, confidence, technicalScore + sentimentScore);
      const keyLevels = getKeyLevels(currentPrice, supportResistance, prediction);

      const cryptoName = getCryptoNameUkrainian(cryptoSymbol);
      const timeframeName = getTimeframeUkrainian(timeframe);

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${recommendation.color}">
            <h6>🎯 ${timeframeName} прогноз</h6>
            <div class="big-number">${recommendation.action}</div>
            <p><strong>${cryptoName}</strong></p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💰 Цільова ціна</h6>
            <div class="big-number">${formatCurrency(prediction.target)}</div>
            <p>Очікувана зміна: ${formatPercentage(prediction.changePercentage)}</p>
          </div>
          <div class="insight-card">
            <h6>📈 Консервативна</h6>
            <div class="big-number">${formatCurrency(prediction.conservative)}</div>
            <p>Сценарій низького ризику</p>
          </div>
          <div class="insight-card">
            <h6>🚀 Агресивна</h6>
            <div class="big-number">${formatCurrency(prediction.aggressive)}</div>
            <p>Сценарій високої впевненості</p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card">
            <h6>📊 Технічний рахунок</h6>
            <div class="big-number">${technicalScore > 0 ? '+' : ''}${technicalScore}</div>
            <p>${technicalScore > 2 ? 'Бичачі' : technicalScore < -2 ? 'Ведмежі' : 'Нейтральні'} сигнали</p>
          </div>
          <div class="insight-card">
            <h6>💭 Рахунок настроїв</h6>
            <div class="big-number">${sentimentScore > 0 ? '+' : ''}${sentimentScore}</div>
            <p>${sentimentScore > 1 ? 'Позитивні' : sentimentScore < -1 ? 'Негативні' : 'Нейтральні'} настрої</p>
          </div>
          <div class="insight-card ${riskAssessment.color}">
            <h6>⚠️ Рівень ризику</h6>
            <div class="big-number">${riskAssessment.level}</div>
            <p>На основі волатильності та впевненості</p>
          </div>
        </div>

        <div class="insight-card info">
          <h6>🎯 Ключові цінові рівні</h6>
          <div style="text-align: left;">
            <p><strong>Поточна ціна:</strong> ${formatCurrency(currentPrice)}</p>
            <p><strong>Рівень підтримки:</strong> ${formatCurrency(keyLevels.support)}</p>
            <p><strong>Рівень опору:</strong> ${formatCurrency(keyLevels.resistance)}</p>
            <p><strong>Рекомендований стоп-лос:</strong> ${formatCurrency(keyLevels.stopLoss)}</p>
            <p><strong>Ціль тейк-профіту:</strong> ${formatCurrency(keyLevels.takeProfit)}</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📊 Підсумок технічного аналізу</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>RSI:</strong> ${rsi} (${rsi > 70 ? 'Перекуплений' : rsi < 30 ? 'Переproданий' : 'Нейтральний'})</p>
            <p><strong>MACD:</strong> ${macdSignal.replace('strong-bullish', 'Сильно бичачий').replace('bullish', 'Бичачий').replace('neutral', 'Нейтральний').replace('bearish', 'Ведмежий').replace('strong-bearish', 'Сильно ведмежий')}</p>
            <p><strong>Ковзні середні:</strong> ${maPosition.replace('above-all', 'Вище всіх').replace('above-short', 'Вище коротких').replace('mixed', 'Змішані').replace('below-short', 'Нижче коротких').replace('below-all', 'Нижче всіх')}</p>
            <p><strong>Підтримка/Опір:</strong> ${supportResistance.replace('breakout', 'Пробій').replace('near-resistance', 'Біля опору').replace('mid-range', 'Середина діапазону').replace('near-support', 'Біля підтримки').replace('breakdown', 'Пробиття')}</p>
            <p><strong>Обсяг:</strong> ${volumeLevel.replace('very-high', 'Дуже високий').replace('high', 'Високий').replace('normal', 'Нормальний').replace('low', 'Низький').replace('very-low', 'Дуже низький')}</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>💭 Аналіз ринкових настроїв</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>Індекс страху та жадібності:</strong> ${fearGreed.replace('extreme-greed', 'Крайня жадібність').replace('greed', 'Жадібність').replace('neutral', 'Нейтральний').replace('fear', 'Страх').replace('extreme-fear', 'Крайній страх')}</p>
            <p><strong>Соціальні медіа:</strong> ${socialSentiment.replace('very-bullish', 'Дуже бичачі').replace('bullish', 'Бичачі').replace('neutral', 'Нейтральні').replace('bearish', 'Ведмежі').replace('very-bearish', 'Дуже ведмежі')}</p>
            <p><strong>Вплив новин:</strong> ${newsImpact.replace('very-positive', 'Дуже позитивний').replace('positive', 'Позитивний').replace('neutral', 'Нейтральний').replace('negative', 'Негативний').replace('very-negative', 'Дуже негативний')}</p>
            <p><strong>Кореляція з BTC:</strong> ${btcCorrelation.replace('high-positive', 'Висока позитивна').replace('moderate-positive', 'Помірна позитивна').replace('independent', 'Незалежна').replace('negative', 'Негативна')}</p>
            <p><strong>Недавня продуктивність:</strong> 24г: ${formatPercentage(dailyChange)}, 7д: ${formatPercentage(weeklyChange)}</p>
          </div>
        </div>

        <div class="insight-card warning">
          <h6>🎲 Пропозиції торгової стратегії</h6>
          <div style="text-align: left;">
            ${prediction.changePercentage > 5 ? `
              <p><strong>Бичача стратегія:</strong></p>
              <ul>
                <li>Розгляньте поступове нарощування позиції на спадах</li>
                <li>Встановіть стоп-лос на ${formatCurrency(keyLevels.stopLoss)}</li>
                <li>Беріть часткові прибутки на ${formatCurrency(prediction.target)}</li>
                <li>Відстежуйте ${timeframe === 'short' ? 'погодинні' : 'денні'} графіки для підтвердження</li>
              </ul>
            ` : prediction.changePercentage < -5 ? `
              <p><strong>Ведмежа стратегія:</strong></p>
              <ul>
                <li>Розгляньте зменшення експозиції або короткі позиції</li>
                <li>Чекайте підтримки на ${formatCurrency(keyLevels.support)}</li>
                <li>Використовуйте тугі стоп-лоси для довгих позицій</li>
                <li>Шукайте сигнали розворота біля ключової підтримки</li>
              </ul>
            ` : `
              <p><strong>Нейтральна стратегія:</strong></p>
              <ul>
                <li>Торгівля в діапазоні між підтримкою та опором</li>
                <li>Чекайте більш чітких направлених сигналів</li>
                <li>Використовуйте менші розміри позицій через невизначеність</li>
                <li>Зосередьтеся на інших можливостях з чіткішими налаштуваннями</li>
              </ul>
            `}
          </div>
        </div>

        <div class="insight-card warning">
          <h6>⚠️ Критичні інвестиційні застереження</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>• Не інвестиційна порада:</strong> Цей аналіз є суто навчальним і не повинен розглядатися як фінансова порада.</p>
            <p><strong>• Високоризикова інвестиція:</strong> Криптовалюти надзвичайно волатильні та спекулятивні. Ви можете втратити весь інвестований капітал.</p>
            <p><strong>• Минула продуктивність:</strong> Історичні дані та технічний аналіз не гарантують майбутніх результатів.</p>
            <p><strong>• Професійні консультації:</strong> Завжди консультуйтеся з кваліфікованими фінансовими консультантами перед прийняттям інвестиційних рішень.</p>
            <p><strong>• Управління ризиками:</strong> Ніколи не інвестуйте більше, ніж можете дозволити собі повністю втратити. Використовуйте правильне планування позицій та стоп-лоси.</p>
            <p><strong>• Маніпуляції ринком:</strong> Крипторинки можуть підлягати маніпуляціям, особливо для менших альткоїнів.</p>
            <p><strong>• Українське законодавство:</strong> Прибуток від криптовалют підлягає оподаткуванню згідно з українським законодавством.</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📚 Навчальні нотатки</h6>
          <div style="text-align: left;">
            <p><strong>Впевненість прогнозування:</strong> ${confidence === 'high' ? 'ВИСОКИЙ' : confidence === 'medium' ? 'СЕРЕДНІЙ' : 'НИЗЬКИЙ'}</p>
            <p><strong>Ключові фактори:</strong> Цей прогноз враховує технічні індикатори, ринкові настрої, обсяг та недавню цінову дію.</p>
            <p><strong>Часові рамки:</strong> ${timeframe === 'short' ? 'Короткострокові прогнози фокусуються на моментумі та негайних сигналах' : timeframe === 'medium' ? 'Середньостроковий аналіз збалансовує технічні та фундаментальні фактори' : 'Довгострокові перспективи враховують основні тренди та цикли прийняття'}</p>
            <p><strong>Ринковий контекст:</strong> Завжди враховуйте більш широкі ринкові умови, тренди Біткоїна та регуляторні розробки при торгівлі.</p>
            <p><strong>Українські особливості:</strong> Враховуйте місцеве законодавство, доступність бірж та ринкові умови в Україні.</p>
          </div>
        </div>
      `;
    });
  }
});