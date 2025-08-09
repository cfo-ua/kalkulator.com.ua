document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('stock-valuation-form');
  const result = document.getElementById('stock-valuation-result');

  function formatCurrency(value) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
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
    
    if (adjustedMargin >= 40) return { action: 'Strong Buy', color: 'success' };
    if (adjustedMargin >= 20) return { action: 'Buy', color: 'info' };
    if (adjustedMargin >= -20) return { action: 'Hold', color: 'warning' };
    if (adjustedMargin >= -40) return { action: 'Sell', color: 'warning' };
    return { action: 'Strong Sell', color: 'warning' };
  }

  function getGrahamCriteria(eps, bookValue, currentPrice, debtEquity, earningsStability) {
    const criteria = [];
    
    // P/E ratio check
    const pe = currentPrice / eps;
    criteria.push({
      test: 'P/E Ratio ≤ 15',
      passed: pe <= 15,
      value: pe.toFixed(1)
    });
    
    // P/B ratio check  
    const pb = currentPrice / bookValue;
    criteria.push({
      test: 'P/B Ratio ≤ 1.5',
      passed: pb <= 1.5,
      value: pb.toFixed(1)
    });
    
    // P/E × P/B check
    criteria.push({
      test: 'P/E × P/B ≤ 22.5',
      passed: (pe * pb) <= 22.5,
      value: (pe * pb).toFixed(1)
    });
    
    // Debt-to-equity check
    criteria.push({
      test: 'Debt/Equity ≤ 50%',
      passed: debtEquity <= 50,
      value: `${debtEquity}%`
    });
    
    // Earnings stability
    criteria.push({
      test: 'Stable Earnings',
      passed: ['excellent', 'good'].includes(earningsStability),
      value: earningsStability
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
      const requiredReturn = parseFloat(document.getElementById('required-return').value) || 10;
      
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
            <h6>⚠️ Missing Information</h6>
            <p>Please fill in all required fields to calculate fair value.</p>
          </div>
        `;
        return;
      }

      if (eps <= 0 || bookValue <= 0) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Invalid Financial Data</h6>
            <p>EPS and Book Value must be positive. This method doesn't apply to loss-making companies or those with negative book value.</p>
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
            <h6>🎯 Investment Recommendation</h6>
            <div class="big-number">${recommendation.action}</div>
            <p><strong>Quality Score: ${qualityScore}/11</strong></p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💰 Estimated Fair Value</h6>
            <div class="big-number">${formatCurrency(fairValue)}</div>
            <p>Current: ${formatCurrency(currentPrice)} | Margin: ${formatPercentage(marginOfSafety)}</p>
          </div>
          <div class="insight-card">
            <h6>📊 Graham Number</h6>
            <div class="big-number">${formatCurrency(grahamNumber)}</div>
            <p>Conservative intrinsic value</p>
          </div>
          <div class="insight-card">
            <h6>📈 Earnings Value</h6>
            <div class="big-number">${formatCurrency(earningsValue)}</div>
            <p>Based on P/E and growth</p>
          </div>
        </div>

        ${dividendValue > 0 ? `
        <div class="insight-cards">
          <div class="insight-card">
            <h6>💵 Dividend Value</h6>
            <div class="big-number">${formatCurrency(dividendValue)}</div>
            <p>Dividend discount model</p>
          </div>
          <div class="insight-card">
            <h6>🏢 Asset Value</h6>
            <div class="big-number">${formatCurrency(assetValue)}</div>
            <p>Adjusted book value</p>
          </div>
        </div>
        ` : `
        <div class="insight-cards">
          <div class="insight-card">
            <h6>🏢 Asset Value</h6>
            <div class="big-number">${formatCurrency(assetValue)}</div>
            <p>Adjusted book value</p>
          </div>
        </div>
        `}

        <div class="insight-card info">
          <h6>📋 Benjamin Graham Criteria (${passedCriteria}/${criteria.length} passed)</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            ${criteria.map(c => `
              <p>${c.passed ? '✅' : '❌'} <strong>${c.test}:</strong> ${c.value}</p>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h6>📊 Valuation Analysis</h6>
          <div style="text-align: left;">
            <p><strong>Current P/E Ratio:</strong> ${(currentPrice / eps).toFixed(1)}x</p>
            <p><strong>Current P/B Ratio:</strong> ${(currentPrice / bookValue).toFixed(1)}x</p>
            ${dividend > 0 ? `<p><strong>Dividend Yield:</strong> ${formatPercentage((dividend / currentPrice) * 100)}</p>` : ''}
            <p><strong>Price vs Graham Number:</strong> ${formatPercentage((currentPrice / grahamNumber - 1) * 100)}</p>
            <p><strong>Expected Growth Rate:</strong> ${formatPercentage(growthRate)}</p>
          </div>
        </div>

        <div class="insight-card ${marginOfSafety >= 25 ? 'success' : marginOfSafety >= 0 ? 'warning' : 'warning'}">
          <h6>🛡️ Risk Assessment</h6>
          <div style="text-align: left;">
            <p><strong>Margin of Safety:</strong> ${formatPercentage(marginOfSafety)}</p>
            <p><strong>Quality Score:</strong> ${qualityScore}/11 (${qualityScore >= 8 ? 'High' : qualityScore >= 5 ? 'Medium' : 'Low'} quality)</p>
            <p><strong>Graham Criteria:</strong> ${passedCriteria}/${criteria.length} requirements met</p>
            <p><strong>Risk Level:</strong> ${marginOfSafety >= 25 ? 'Low' : marginOfSafety >= 0 ? 'Medium' : 'High'}</p>
          </div>
        </div>

        <div class="insight-card warning">
          <h6>⚠️ Investment Disclaimers</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>• Not Investment Advice:</strong> This analysis is for educational purposes only. Past performance does not guarantee future results.</p>
            <p><strong>• Substantial Risk:</strong> Stock investments carry significant risk including potential loss of principal. Market prices can be volatile.</p>
            <p><strong>• Professional Consultation:</strong> Always consult qualified financial advisors before making investment decisions.</p>
            <p><strong>• Due Diligence Required:</strong> Conduct thorough research beyond these calculations including recent news, industry trends, and company developments.</p>
            <p><strong>• Model Limitations:</strong> Valuation models provide estimates based on historical data and assumptions that may not reflect future reality.</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📈 Investment Strategy Guidance</h6>
          <div style="text-align: left;">
            <p><strong>If Buying:</strong></p>
            <ul>
              <li>Wait for prices ${formatPercentage(25)} or more below fair value</li>
              <li>Ensure the company meets at least 3/5 Graham criteria</li>
              <li>Diversify across multiple quality stocks</li>
              <li>Plan to hold for ${timeHorizon === 'long' ? '5+ years' : timeHorizon === 'medium' ? '2-5 years' : '1-2 years'}</li>
            </ul>
            <p><strong>Monitor Regularly:</strong></p>
            <ul>
              <li>Quarterly earnings and business developments</li>
              <li>Changes in competitive position</li>
              <li>Updated fair value calculations</li>
              <li>Overall portfolio diversification</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});