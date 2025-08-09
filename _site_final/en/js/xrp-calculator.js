document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('xrp-form');
  const result = document.getElementById('xrp-result');
  const scenariosDiv = document.getElementById('price-scenarios');
  const dcaDiv = document.getElementById('dca-analysis');
  const riskDiv = document.getElementById('risk-assessment');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateXRP();
  });

  // Fetch current price button
  document.getElementById('fetchCurrentPrice').addEventListener('click', function() {
    fetchCurrentXRPPrice();
  });

  async function fetchCurrentXRPPrice() {
    try {
      // In a real implementation, you would fetch from a crypto API
      // For now, we'll simulate with a reasonable current price
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
      const data = await response.json();
      
      if (data.ripple && data.ripple.usd) {
        document.getElementById('currentPrice').value = data.ripple.usd.toFixed(6);
        showNotification('✅ Current XRP price updated!');
      } else {
        throw new Error('Unable to fetch price');
      }
    } catch (error) {
      // Fallback to simulated price if API fails
      const simulatedPrice = (0.40 + Math.random() * 0.40).toFixed(6); // $0.40-$0.80 range
      document.getElementById('currentPrice').value = simulatedPrice;
      showNotification('📡 Using simulated current price (API unavailable)');
    }
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
      padding: 1rem; border-radius: 0.5rem; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function calculateXRP() {
    const investmentType = document.getElementById('investmentType').value;
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const currentPrice = parseFloat(document.getElementById('currentPrice').value);
    const targetPrice = parseFloat(document.getElementById('targetPrice').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);
    const taxBracket = parseFloat(document.getElementById('taxBracket').value) / 100;
    const portfolioValue = parseFloat(document.getElementById('portfolioValue').value);
    const cryptoAllocation = parseFloat(document.getElementById('cryptoAllocation').value) / 100;

    if (!investmentAmount || !purchasePrice || !currentPrice) {
      result.innerHTML = '<div class="error">Please enter all required investment details.</div>';
      return;
    }

    let analysisResult;

    switch(investmentType) {
      case 'lump-sum':
        analysisResult = calculateLumpSum(investmentAmount, purchasePrice, currentPrice, targetPrice, stopLoss, taxBracket);
        break;
      case 'dca':
        analysisResult = calculateDCA();
        break;
      case 'existing':
        analysisResult = calculateExisting(investmentAmount, purchasePrice, currentPrice, targetPrice, taxBracket);
        break;
      case 'profit-target':
        analysisResult = calculateProfitTarget(investmentAmount, purchasePrice, targetPrice, taxBracket);
        break;
      default:
        analysisResult = calculateLumpSum(investmentAmount, purchasePrice, currentPrice, targetPrice, stopLoss, taxBracket);
    }

    displayResults(analysisResult);
    showPriceScenarios(analysisResult.xrpAmount, purchasePrice, taxBracket);
    assessRisk(investmentAmount, portfolioValue, cryptoAllocation);

    if (investmentType === 'dca') {
      showDCAAnalysis();
    }
  }

  function calculateLumpSum(investment, buyPrice, currentPrice, targetPrice, stopLoss, taxRate) {
    const xrpAmount = investment / buyPrice;
    const currentValue = xrpAmount * currentPrice;
    const currentProfit = currentValue - investment;
    const currentROI = (currentProfit / investment) * 100;

    const targetValue = xrpAmount * targetPrice;
    const targetProfit = targetValue - investment;
    const targetROI = (targetProfit / investment) * 100;

    const stopLossValue = xrpAmount * stopLoss;
    const stopLossLoss = stopLossValue - investment;
    const stopLossROI = (stopLossLoss / investment) * 100;

    // Tax calculations
    const taxOnCurrentProfit = Math.max(0, currentProfit * taxRate);
    const taxOnTargetProfit = Math.max(0, targetProfit * taxRate);
    const currentAfterTax = currentValue - taxOnCurrentProfit;
    const targetAfterTax = targetValue - taxOnTargetProfit;

    return {
      type: 'lump-sum',
      investment,
      xrpAmount,
      buyPrice,
      currentPrice,
      currentValue,
      currentProfit,
      currentROI,
      currentAfterTax,
      targetPrice,
      targetValue,
      targetProfit,
      targetROI,
      targetAfterTax,
      stopLoss,
      stopLossValue,
      stopLossLoss,
      stopLossROI,
      taxRate
    };
  }

  function calculateDCA() {
    const dcaAmount = parseFloat(document.getElementById('dcaAmount').value);
    const dcaPeriod = parseInt(document.getElementById('dcaPeriod').value);
    const dcaFrequency = document.getElementById('dcaFrequency').value;
    const currentPrice = parseFloat(document.getElementById('currentPrice').value);
    const targetPrice = parseFloat(document.getElementById('targetPrice').value);
    const taxRate = parseFloat(document.getElementById('taxBracket').value) / 100;

    const frequencyMultiplier = {
      'weekly': 52,
      'biweekly': 26,
      'monthly': 12,
      'quarterly': 4
    };

    const investmentsPerYear = frequencyMultiplier[dcaFrequency];
    const totalInvestments = Math.floor((dcaPeriod / 12) * investmentsPerYear);
    const totalInvested = dcaAmount * totalInvestments;

    // Simulate DCA with price volatility
    const volatility = document.getElementById('priceVolatility').value;
    const volatilityMap = { low: 0.1, medium: 0.25, high: 0.5, extreme: 1.0 };
    const priceVariation = volatilityMap[volatility];

    let totalXRP = 0;
    let avgPurchasePrice = 0;

    // Simulate purchases over time
    for (let i = 0; i < totalInvestments; i++) {
      // Simulate price variation
      const randomVariation = (Math.random() - 0.5) * 2 * priceVariation;
      const simulatedPrice = currentPrice * (1 + randomVariation);
      const xrpPurchased = dcaAmount / simulatedPrice;
      totalXRP += xrpPurchased;
    }

    avgPurchasePrice = totalInvested / totalXRP;

    const currentValue = totalXRP * currentPrice;
    const currentProfit = currentValue - totalInvested;
    const currentROI = (currentProfit / totalInvested) * 100;

    const targetValue = totalXRP * targetPrice;
    const targetProfit = targetValue - totalInvested;
    const targetROI = (targetProfit / totalInvested) * 100;

    const taxOnCurrentProfit = Math.max(0, currentProfit * taxRate);
    const taxOnTargetProfit = Math.max(0, targetProfit * taxRate);

    return {
      type: 'dca',
      investment: totalInvested,
      xrpAmount: totalXRP,
      buyPrice: avgPurchasePrice,
      currentPrice,
      currentValue,
      currentProfit,
      currentROI,
      currentAfterTax: currentValue - taxOnCurrentProfit,
      targetPrice,
      targetValue,
      targetProfit,
      targetROI,
      targetAfterTax: targetValue - taxOnTargetProfit,
      dcaDetails: {
        dcaAmount,
        dcaPeriod,
        dcaFrequency,
        totalInvestments,
        avgPurchasePrice
      },
      taxRate
    };
  }

  function calculateExisting(holdings, avgBuyPrice, currentPrice, targetPrice, taxRate) {
    const xrpAmount = holdings / avgBuyPrice;
    const investment = holdings; // Original investment
    
    const currentValue = xrpAmount * currentPrice;
    const currentProfit = currentValue - investment;
    const currentROI = (currentProfit / investment) * 100;

    const targetValue = xrpAmount * targetPrice;
    const targetProfit = targetValue - investment;
    const targetROI = (targetProfit / investment) * 100;

    const taxOnCurrentProfit = Math.max(0, currentProfit * taxRate);
    const taxOnTargetProfit = Math.max(0, targetProfit * taxRate);

    return {
      type: 'existing',
      investment,
      xrpAmount,
      buyPrice: avgBuyPrice,
      currentPrice,
      currentValue,
      currentProfit,
      currentROI,
      currentAfterTax: currentValue - taxOnCurrentProfit,
      targetPrice,
      targetValue,
      targetProfit,
      targetROI,
      targetAfterTax: targetValue - taxOnTargetProfit,
      taxRate
    };
  }

  function calculateProfitTarget(investment, buyPrice, targetPrice, taxRate) {
    const xrpAmount = investment / buyPrice;
    const targetValue = xrpAmount * targetPrice;
    const targetProfit = targetValue - investment;
    const targetROI = (targetProfit / investment) * 100;
    const taxOnProfit = Math.max(0, targetProfit * taxRate);
    const afterTaxProfit = targetProfit - taxOnProfit;

    // Calculate what price needs to be to achieve certain profit targets
    const profitTargets = [25, 50, 100, 200, 500]; // Percentage returns
    const priceTargets = profitTargets.map(percent => {
      const requiredValue = investment * (1 + percent / 100);
      return requiredValue / xrpAmount;
    });

    return {
      type: 'profit-target',
      investment,
      xrpAmount,
      buyPrice,
      targetPrice,
      targetValue,
      targetProfit,
      targetROI,
      afterTaxProfit,
      priceTargets: profitTargets.map((percent, index) => ({
        profitPercent: percent,
        requiredPrice: priceTargets[index]
      })),
      taxRate
    };
  }

  function displayResults(analysis) {
    let resultHtml = `
      <div class="result-summary">
        <h3>📊 XRP Investment Analysis</h3>
        <div class="result-grid">
          <div class="result-item">
            <strong>Investment Type:</strong> ${analysis.type.replace('-', ' ').toUpperCase()}
          </div>
          <div class="result-item">
            <strong>Total Investment:</strong> $${analysis.investment.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>XRP Holdings:</strong> ${analysis.xrpAmount.toFixed(2)} XRP
          </div>
          <div class="result-item">
            <strong>Average Buy Price:</strong> $${analysis.buyPrice.toFixed(6)}
          </div>
    `;

    if (analysis.type !== 'profit-target') {
      resultHtml += `
          <div class="result-item">
            <strong>Current Value:</strong> $${analysis.currentValue.toFixed(2)}
          </div>
          <div class="result-item ${analysis.currentProfit >= 0 ? 'profit' : 'loss'}">
            <strong>Current P&L:</strong> ${analysis.currentProfit >= 0 ? '+' : ''}$${analysis.currentProfit.toFixed(2)} (${analysis.currentROI.toFixed(1)}%)
          </div>
          <div class="result-item">
            <strong>After-Tax Value:</strong> $${analysis.currentAfterTax.toFixed(2)}
          </div>
      `;
    }

    if (analysis.targetPrice) {
      resultHtml += `
          <div class="result-item highlight">
            <strong>Target Price:</strong> $${analysis.targetPrice.toFixed(6)}
          </div>
          <div class="result-item highlight">
            <strong>Target Value:</strong> $${analysis.targetValue.toFixed(2)}
          </div>
          <div class="result-item highlight">
            <strong>Target Profit:</strong> +$${analysis.targetProfit.toFixed(2)} (${analysis.targetROI.toFixed(1)}%)
          </div>
          <div class="result-item highlight">
            <strong>After-Tax Target:</strong> $${analysis.targetAfterTax.toFixed(2)}
          </div>
      `;
    }

    if (analysis.stopLoss) {
      resultHtml += `
          <div class="result-item warning">
            <strong>Stop Loss:</strong> $${analysis.stopLoss.toFixed(6)}
          </div>
          <div class="result-item warning">
            <strong>Stop Loss Value:</strong> $${analysis.stopLossValue.toFixed(2)}
          </div>
          <div class="result-item warning">
            <strong>Stop Loss Loss:</strong> $${analysis.stopLossLoss.toFixed(2)} (${analysis.stopLossROI.toFixed(1)}%)
          </div>
      `;
    }

    resultHtml += `
        </div>
      </div>
    `;

    // Add DCA specific details
    if (analysis.dcaDetails) {
      resultHtml += `
        <div class="dca-summary">
          <h4>💰 DCA Strategy Details</h4>
          <ul>
            <li><strong>Investment Amount:</strong> $${analysis.dcaDetails.dcaAmount} ${analysis.dcaDetails.dcaFrequency}</li>
            <li><strong>Total Period:</strong> ${analysis.dcaDetails.dcaPeriod} months</li>
            <li><strong>Total Investments:</strong> ${analysis.dcaDetails.totalInvestments} purchases</li>
            <li><strong>Average Buy Price:</strong> $${analysis.dcaDetails.avgPurchasePrice.toFixed(6)}</li>
          </ul>
        </div>
      `;
    }

    // Add profit target details
    if (analysis.priceTargets) {
      resultHtml += `
        <div class="profit-targets">
          <h4>🎯 Profit Target Prices</h4>
          <ul>
      `;
      analysis.priceTargets.forEach(target => {
        resultHtml += `<li><strong>${target.profitPercent}% Profit:</strong> XRP needs to reach $${target.requiredPrice.toFixed(6)}</li>`;
      });
      resultHtml += `
          </ul>
        </div>
      `;
    }

    // Add key insights
    resultHtml += `
      <div class="insights">
        <h4>💡 Key Insights</h4>
        <ul>
    `;

    if (analysis.currentROI > 100) {
      resultHtml += `<li class="profit"><strong>Excellent Returns:</strong> Consider taking some profits</li>`;
    } else if (analysis.currentROI > 50) {
      resultHtml += `<li class="profit"><strong>Strong Performance:</strong> Monitor for profit-taking opportunities</li>`;
    } else if (analysis.currentROI < -50) {
      resultHtml += `<li class="warning"><strong>Significant Loss:</strong> Review your risk management strategy</li>`;
    }

    if (analysis.targetROI > 200) {
      resultHtml += `<li><strong>Ambitious Target:</strong> ${analysis.targetROI.toFixed(0)}% return requires ${(analysis.targetPrice / analysis.buyPrice).toFixed(1)}x price increase</li>`;
    }

    if (analysis.taxRate > 0) {
      const taxAmount = Math.max(0, analysis.targetProfit * analysis.taxRate);
      resultHtml += `<li><strong>Tax Impact:</strong> $${taxAmount.toFixed(2)} in taxes on target profits</li>`;
    }

    resultHtml += `
        </ul>
      </div>
    `;

    result.innerHTML = resultHtml;
  }

  function showPriceScenarios(xrpAmount, buyPrice, taxRate) {
    const scenarios = [0.25, 0.50, 1.00, 2.00, 3.00, 5.00, 10.00]; // XRP price scenarios
    const scenarioBody = document.getElementById('scenario-body');
    scenarioBody.innerHTML = '';

    const investment = xrpAmount * buyPrice;

    scenarios.forEach(price => {
      const value = xrpAmount * price;
      const profit = value - investment;
      const roi = (profit / investment) * 100;
      const taxes = Math.max(0, profit * taxRate);
      const afterTax = value - taxes;

      const row = document.createElement('tr');
      const profitClass = profit >= 0 ? 'profit' : 'loss';
      
      row.innerHTML = `
        <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">$${price.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${value.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" class="${profitClass}">${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" class="${profitClass}">${roi.toFixed(1)}%</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;">$${afterTax.toFixed(2)}</td>
      `;
      scenarioBody.appendChild(row);
    });

    scenariosDiv.style.display = 'block';
  }

  function showDCAAnalysis() {
    const dcaHtml = `
      <div class="dca-benefits">
        <h4>📈 DCA Strategy Benefits</h4>
        <ul>
          <li><strong>Volatility Smoothing:</strong> Regular purchases reduce timing risk</li>
          <li><strong>Emotional Discipline:</strong> Removes emotion from investment decisions</li>
          <li><strong>Lower Average Cost:</strong> Buys more when price is low, less when high</li>
          <li><strong>Gradual Exposure:</strong> Builds position over time rather than all at once</li>
        </ul>
        
        <h4>⚠️ DCA Considerations</h4>
        <ul>
          <li><strong>Opportunity Cost:</strong> May miss gains if XRP rises consistently</li>
          <li><strong>Transaction Fees:</strong> Multiple purchases mean more fees</li>
          <li><strong>Time Commitment:</strong> Requires consistent execution</li>
          <li><strong>Market Trends:</strong> Less effective in strong trending markets</li>
        </ul>
      </div>
    `;

    dcaDiv.innerHTML = dcaHtml;
    dcaDiv.style.display = 'block';
  }

  function assessRisk(investment, portfolio, cryptoAllocation) {
    const cryptoValue = portfolio * cryptoAllocation;
    const xrpPercentage = (investment / portfolio) * 100;
    const cryptoOverallocation = xrpPercentage > 10;
    const portfolioOverexposure = cryptoAllocation > 0.25;

    let riskLevel = 'Low';
    let riskColor = '#28a745';
    
    if (xrpPercentage > 15 || portfolioOverexposure) {
      riskLevel = 'High';
      riskColor = '#dc3545';
    } else if (xrpPercentage > 10) {
      riskLevel = 'Medium';
      riskColor = '#ffc107';
    }

    const riskHtml = `
      <div class="risk-summary">
        <h4>⚠️ Risk Assessment</h4>
        <div style="padding: 1rem; border-left: 4px solid ${riskColor}; background: #f8f9fa; margin-bottom: 1rem;">
          <strong>Risk Level: <span style="color: ${riskColor};">${riskLevel}</span></strong>
        </div>
        
        <div class="risk-metrics">
          <div><strong>XRP as % of Portfolio:</strong> ${xrpPercentage.toFixed(1)}%</div>
          <div><strong>Total Crypto Allocation:</strong> ${(cryptoAllocation * 100).toFixed(1)}%</div>
          <div><strong>Recommended XRP Limit:</strong> 5-10% of total portfolio</div>
          <div><strong>Recommended Crypto Limit:</strong> 5-20% of total portfolio</div>
        </div>
        
        <h5>Risk Factors for XRP:</h5>
        <ul>
          <li><strong>Regulatory Risk:</strong> Ongoing SEC legal challenges</li>
          <li><strong>Market Volatility:</strong> 50%+ price swings common</li>
          <li><strong>Centralization Concerns:</strong> Ripple holds significant XRP supply</li>
          <li><strong>Adoption Risk:</strong> Success depends on institutional adoption</li>
          <li><strong>Competition:</strong> Other cryptocurrencies targeting payments</li>
        </ul>
        
        <h5>Risk Management Recommendations:</h5>
        <ul>
          ${cryptoOverallocation ? '<li class="warning"><strong>Reduce Position:</strong> Consider reducing XRP allocation to 5-10% of portfolio</li>' : ''}
          ${portfolioOverexposure ? '<li class="warning"><strong>Rebalance:</strong> Total crypto allocation exceeds recommended 20% limit</li>' : ''}
          <li><strong>Set Stop Losses:</strong> Define exit points for both profits and losses</li>
          <li><strong>Stay Informed:</strong> Monitor regulatory developments closely</li>
          <li><strong>Diversify:</strong> Don't put all crypto allocation in XRP alone</li>
          <li><strong>Regular Review:</strong> Reassess position quarterly or after major events</li>
        </ul>
      </div>
    `;

    riskDiv.innerHTML = riskHtml;
    riskDiv.style.display = 'block';
  }

  // Update form visibility based on investment type
  document.getElementById('investmentType').addEventListener('change', function() {
    const dcaFields = document.querySelectorAll('#dcaAmount, #dcaFrequency, #dcaPeriod, #priceVolatility');
    const isDCA = this.value === 'dca';
    
    dcaFields.forEach(field => {
      field.closest('label').style.display = isDCA ? 'block' : 'none';
    });
  });

  // Auto-fetch price on load
  setTimeout(() => {
    fetchCurrentXRPPrice();
  }, 1000);
});