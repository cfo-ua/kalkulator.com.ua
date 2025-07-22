document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('crypto-prediction-form');
  const result = document.getElementById('crypto-prediction-result');

  function formatCurrency(value, decimals = 6) {
    if (value >= 1000) {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else if (value >= 1) {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });
    } else {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
  }

  function formatPercentage(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
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
    
    if (totalScore >= 6 && confidence === 'high') return { action: 'Strong Buy Signal', color: 'success' };
    if (totalScore >= 3) return { action: 'Buy Signal', color: 'info' };
    if (totalScore >= -2) return { action: 'Hold/Neutral', color: 'warning' };
    if (totalScore >= -5) return { action: 'Sell Signal', color: 'warning' };
    return { action: 'Strong Sell Signal', color: 'warning' };
  }

  function getRiskLevel(volatilityMultiplier, confidence, totalScore) {
    let riskScore = 0;
    
    if (volatilityMultiplier > 1.5) riskScore += 2;
    else if (volatilityMultiplier > 1.2) riskScore += 1;
    
    if (confidence === 'low') riskScore += 2;
    else if (confidence === 'medium') riskScore += 1;
    
    if (Math.abs(totalScore) > 6) riskScore += 1;
    
    if (riskScore >= 4) return { level: 'Very High', color: 'warning' };
    if (riskScore >= 2) return { level: 'High', color: 'warning' };
    if (riskScore >= 1) return { level: 'Medium', color: 'info' };
    return { level: 'Low', color: 'success' };
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
            <h6>⚠️ Missing Information</h6>
            <p>Please fill in all required fields to generate price prediction.</p>
          </div>
        `;
        return;
      }

      if (currentPrice <= 0) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Invalid Price</h6>
            <p>Please enter a valid current price greater than zero.</p>
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

      const cryptoName = cryptoSymbol === 'other' ? 'Selected Cryptocurrency' : 
                        cryptoSymbol.charAt(0).toUpperCase() + cryptoSymbol.slice(1);

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${recommendation.color}">
            <h6>🎯 ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}-term Prediction</h6>
            <div class="big-number">${recommendation.action}</div>
            <p><strong>${cryptoName}</strong></p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💰 Target Price</h6>
            <div class="big-number">${formatCurrency(prediction.target)}</div>
            <p>Expected change: ${formatPercentage(prediction.changePercentage)}</p>
          </div>
          <div class="insight-card">
            <h6>📈 Conservative</h6>
            <div class="big-number">${formatCurrency(prediction.conservative)}</div>
            <p>Low-risk scenario</p>
          </div>
          <div class="insight-card">
            <h6>🚀 Aggressive</h6>
            <div class="big-number">${formatCurrency(prediction.aggressive)}</div>
            <p>High-confidence scenario</p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card">
            <h6>📊 Technical Score</h6>
            <div class="big-number">${technicalScore > 0 ? '+' : ''}${technicalScore}</div>
            <p>${technicalScore > 2 ? 'Bullish' : technicalScore < -2 ? 'Bearish' : 'Neutral'} signals</p>
          </div>
          <div class="insight-card">
            <h6>💭 Sentiment Score</h6>
            <div class="big-number">${sentimentScore > 0 ? '+' : ''}${sentimentScore}</div>
            <p>${sentimentScore > 1 ? 'Positive' : sentimentScore < -1 ? 'Negative' : 'Neutral'} sentiment</p>
          </div>
          <div class="insight-card ${riskAssessment.color}">
            <h6>⚠️ Risk Level</h6>
            <div class="big-number">${riskAssessment.level}</div>
            <p>Based on volatility & confidence</p>
          </div>
        </div>

        <div class="insight-card info">
          <h6>🎯 Key Price Levels</h6>
          <div style="text-align: left;">
            <p><strong>Current Price:</strong> ${formatCurrency(currentPrice)}</p>
            <p><strong>Support Level:</strong> ${formatCurrency(keyLevels.support)}</p>
            <p><strong>Resistance Level:</strong> ${formatCurrency(keyLevels.resistance)}</p>
            <p><strong>Suggested Stop Loss:</strong> ${formatCurrency(keyLevels.stopLoss)}</p>
            <p><strong>Take Profit Target:</strong> ${formatCurrency(keyLevels.takeProfit)}</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📊 Technical Analysis Summary</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>RSI:</strong> ${rsi} (${rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'})</p>
            <p><strong>MACD:</strong> ${macdSignal.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Moving Averages:</strong> ${maPosition.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Support/Resistance:</strong> ${supportResistance.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Volume:</strong> ${volumeLevel.replace('-', ' ').toUpperCase()}</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>💭 Market Sentiment Analysis</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>Fear & Greed Index:</strong> ${fearGreed.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Social Media:</strong> ${socialSentiment.replace('-', ' ').toUpperCase()}</p>
            <p><strong>News Impact:</strong> ${newsImpact.replace('-', ' ').toUpperCase()}</p>
            <p><strong>BTC Correlation:</strong> ${btcCorrelation.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Recent Performance:</strong> 24h: ${formatPercentage(dailyChange)}, 7d: ${formatPercentage(weeklyChange)}</p>
          </div>
        </div>

        <div class="insight-card warning">
          <h6>🎲 Trading Strategy Suggestions</h6>
          <div style="text-align: left;">
            ${prediction.changePercentage > 5 ? `
              <p><strong>Bullish Strategy:</strong></p>
              <ul>
                <li>Consider gradual position building on dips</li>
                <li>Set stop-loss at ${formatCurrency(keyLevels.stopLoss)}</li>
                <li>Take partial profits at ${formatCurrency(prediction.target)}</li>
                <li>Monitor ${timeframe === 'short' ? 'hourly' : 'daily'} charts for confirmation</li>
              </ul>
            ` : prediction.changePercentage < -5 ? `
              <p><strong>Bearish Strategy:</strong></p>
              <ul>
                <li>Consider reducing exposure or shorting</li>
                <li>Wait for support at ${formatCurrency(keyLevels.support)}</li>
                <li>Use tight stop-losses for any long positions</li>
                <li>Look for reversal signals near key support</li>
              </ul>
            ` : `
              <p><strong>Neutral Strategy:</strong></p>
              <ul>
                <li>Range trading between support and resistance</li>
                <li>Wait for clearer directional signals</li>
                <li>Use smaller position sizes due to uncertainty</li>
                <li>Focus on other opportunities with clearer setups</li>
              </ul>
            `}
          </div>
        </div>

        <div class="insight-card warning">
          <h6>⚠️ Critical Investment Disclaimers</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>• Not Investment Advice:</strong> This analysis is purely educational and should not be considered financial advice.</p>
            <p><strong>• High Risk Investment:</strong> Cryptocurrencies are extremely volatile and speculative. You could lose all invested capital.</p>
            <p><strong>• Past Performance:</strong> Historical data and technical analysis do not guarantee future results.</p>
            <p><strong>• Professional Consultation:</strong> Always consult qualified financial advisors before making investment decisions.</p>
            <p><strong>• Risk Management:</strong> Never invest more than you can afford to lose completely. Use proper position sizing and stop-losses.</p>
            <p><strong>• Market Manipulation:</strong> Crypto markets can be subject to manipulation, especially for smaller altcoins.</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📚 Educational Notes</h6>
          <div style="text-align: left;">
            <p><strong>Prediction Confidence:</strong> ${confidence.toUpperCase()}</p>
            <p><strong>Key Factors:</strong> This prediction considers technical indicators, market sentiment, volume, and recent price action.</p>
            <p><strong>Timeframe Considerations:</strong> ${timeframe === 'short' ? 'Short-term predictions focus on momentum and immediate signals' : timeframe === 'medium' ? 'Medium-term analysis balances technical and fundamental factors' : 'Long-term outlook considers major trends and adoption cycles'}</p>
            <p><strong>Market Context:</strong> Always consider broader market conditions, Bitcoin trends, and regulatory developments when trading.</p>
          </div>
        </div>
      `;
    });
  }
});