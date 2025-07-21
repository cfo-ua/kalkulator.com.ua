document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('blockchain-fee-form');
  const result = document.getElementById('blockchain-fee-result');

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateBlockchainFees();
    });
  }

  function calculateBlockchainFees() {
    // Get form values
    const network = document.getElementById('network').value;
    const transactionType = document.getElementById('transaction-type').value;
    const priority = document.getElementById('priority').value;
    const amountUSD = parseFloat(document.getElementById('amount-usd').value) || 100;
    const transactionCount = parseInt(document.getElementById('transaction-count').value) || 1;
    const customGasLimit = parseInt(document.getElementById('custom-gas-limit').value);
    const congestionLevel = document.getElementById('congestion-level').value;
    const timePeriod = document.getElementById('time-period').value;
    const marketActivity = document.getElementById('market-activity').value;
    const defiActivity = document.getElementById('defi-activity').value;
    const optimizeCost = document.getElementById('optimize-cost').checked;
    const optimizeSpeed = document.getElementById('optimize-speed').checked;
    const includeLayer2 = document.getElementById('include-layer2').checked;
    const batchOptimization = document.getElementById('batch-optimization').checked;
    const timingRecommendation = document.getElementById('timing-recommendation').checked;

    // Validate required fields
    if (!network || !transactionType || !priority) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Calculate base fees for the network
    const networkData = getNetworkData(network);
    const transactionData = getTransactionData(transactionType, networkData);
    
    // Apply market conditions
    const marketMultiplier = calculateMarketMultiplier(congestionLevel, timePeriod, marketActivity, defiActivity);
    
    // Calculate priority-based fees
    const priorityMultiplier = getPriorityMultiplier(priority);
    
    // Calculate final fees
    const baseFee = transactionData.baseFee * marketMultiplier * priorityMultiplier;
    const gasLimit = customGasLimit || transactionData.gasLimit;
    const totalFee = baseFee * gasLimit / 1000000; // Convert to main unit
    
    // Calculate batch fees if applicable
    const batchFees = calculateBatchFees(totalFee, transactionCount, batchOptimization, networkData);
    
    // Calculate Layer 2 alternatives
    const layer2Alternatives = includeLayer2 ? calculateLayer2Alternatives(transactionData, marketMultiplier) : [];
    
    // Calculate optimization recommendations
    const optimizations = calculateOptimizations(totalFee, network, transactionType, optimizeCost, optimizeSpeed);
    
    // Calculate timing recommendations
    const timingRecs = timingRecommendation ? calculateTimingRecommendations(network, congestionLevel) : null;

    // Display results
    displayResults({
      network,
      transactionType,
      priority,
      amountUSD,
      transactionCount,
      networkData,
      transactionData,
      totalFee,
      batchFees,
      layer2Alternatives,
      optimizations,
      timingRecs,
      marketMultiplier,
      priorityMultiplier,
      gasLimit
    });
  }

  function getNetworkData(network) {
    const networks = {
      bitcoin: {
        name: 'Bitcoin',
        symbol: 'BTC',
        feeUnit: 'sat/vB',
        baseFeeRange: [1, 100], // sat/vB
        confirmationTime: [10, 60], // minutes
        avgTxSize: 250 // bytes
      },
      ethereum: {
        name: 'Ethereum',
        symbol: 'ETH',
        feeUnit: 'Gwei',
        baseFeeRange: [10, 200], // Gwei
        confirmationTime: [0.25, 5], // minutes
        gasPrice: true
      },
      polygon: {
        name: 'Polygon',
        symbol: 'MATIC',
        feeUnit: 'Gwei',
        baseFeeRange: [30, 100], // Gwei
        confirmationTime: [0.1, 1], // minutes
        gasPrice: true
      },
      bsc: {
        name: 'Binance Smart Chain',
        symbol: 'BNB',
        feeUnit: 'Gwei',
        baseFeeRange: [5, 20], // Gwei
        confirmationTime: [0.05, 0.5], // minutes
        gasPrice: true
      },
      solana: {
        name: 'Solana',
        symbol: 'SOL',
        feeUnit: 'lamports',
        baseFeeRange: [5000, 5000], // Fixed fee in lamports
        confirmationTime: [0.01, 0.1], // minutes
        fixedFee: true
      },
      cardano: {
        name: 'Cardano',
        symbol: 'ADA',
        feeUnit: 'ADA',
        baseFeeRange: [0.15, 0.20], // ADA
        confirmationTime: [1, 5], // minutes
        fixedFee: true
      },
      avalanche: {
        name: 'Avalanche',
        symbol: 'AVAX',
        feeUnit: 'nAVAX',
        baseFeeRange: [25, 100], // nAVAX
        confirmationTime: [0.05, 1], // minutes
        gasPrice: true
      },
      arbitrum: {
        name: 'Arbitrum',
        symbol: 'ETH',
        feeUnit: 'Gwei',
        baseFeeRange: [0.1, 2], // Much lower than mainnet
        confirmationTime: [0.05, 0.5], // minutes
        gasPrice: true,
        layer2: true
      },
      optimism: {
        name: 'Optimism',
        symbol: 'ETH',
        feeUnit: 'Gwei',
        baseFeeRange: [0.1, 1.5], // Much lower than mainnet
        confirmationTime: [0.05, 0.5], // minutes
        gasPrice: true,
        layer2: true
      },
      lightning: {
        name: 'Lightning Network',
        symbol: 'BTC',
        feeUnit: 'sat',
        baseFeeRange: [1, 10], // Base fee + routing
        confirmationTime: [0.001, 0.01], // Nearly instant
        fixedFee: true,
        layer2: true
      }
    };
    
    return networks[network] || networks.ethereum;
  }

  function getTransactionData(transactionType, networkData) {
    const gasLimits = {
      'simple-transfer': 21000,
      'token-transfer': 65000,
      'smart-contract': 100000,
      'defi-swap': 250000,
      'nft-mint': 150000,
      'nft-transfer': 85000,
      'defi-lending': 400000,
      'multi-sig': 120000,
      'contract-deploy': 1000000
    };

    const baseFees = {
      'simple-transfer': 1.0,
      'token-transfer': 1.2,
      'smart-contract': 1.5,
      'defi-swap': 2.0,
      'nft-mint': 1.8,
      'nft-transfer': 1.3,
      'defi-lending': 2.5,
      'multi-sig': 1.6,
      'contract-deploy': 3.0
    };

    const complexity = {
      'simple-transfer': 'Low',
      'token-transfer': 'Low-Medium',
      'smart-contract': 'Medium',
      'defi-swap': 'High',
      'nft-mint': 'Medium-High',
      'nft-transfer': 'Medium',
      'defi-lending': 'Very High',
      'multi-sig': 'Medium-High',
      'contract-deploy': 'Extreme'
    };

    return {
      gasLimit: gasLimits[transactionType] || 21000,
      baseFee: networkData.baseFeeRange[0] * (baseFees[transactionType] || 1.0),
      complexity: complexity[transactionType] || 'Medium',
      description: getTransactionDescription(transactionType)
    };
  }

  function getTransactionDescription(type) {
    const descriptions = {
      'simple-transfer': 'Basic cryptocurrency transfer',
      'token-transfer': 'ERC-20/BEP-20 token transfer',
      'smart-contract': 'General smart contract interaction',
      'defi-swap': 'Decentralized exchange token swap',
      'nft-mint': 'Non-fungible token minting',
      'nft-transfer': 'NFT transfer or sale',
      'defi-lending': 'DeFi lending or borrowing operation',
      'multi-sig': 'Multi-signature wallet transaction',
      'contract-deploy': 'Smart contract deployment'
    };
    return descriptions[type] || 'Custom transaction';
  }

  function calculateMarketMultiplier(congestion, time, market, defi) {
    let multiplier = 1.0;

    // Congestion impact
    const congestionMultipliers = {
      'low': 0.7,
      'normal': 1.0,
      'high': 1.8,
      'extreme': 3.5
    };
    multiplier *= congestionMultipliers[congestion] || 1.0;

    // Time period impact
    const timeMultipliers = {
      'weekday-business': 1.4,
      'weekday-evening': 1.2,
      'weekday-night': 0.8,
      'weekend': 0.9
    };
    multiplier *= timeMultipliers[time] || 1.0;

    // Market activity impact
    const marketMultipliers = {
      'calm': 0.9,
      'active': 1.0,
      'volatile': 1.5,
      'extreme': 2.2
    };
    multiplier *= marketMultipliers[market] || 1.0;

    // DeFi activity impact
    const defiMultipliers = {
      'low': 0.8,
      'normal': 1.0,
      'high': 1.6,
      'extreme': 2.5
    };
    multiplier *= defiMultipliers[defi] || 1.0;

    return Math.max(0.1, multiplier); // Minimum 10% of base
  }

  function getPriorityMultiplier(priority) {
    const multipliers = {
      'slow': 0.8,
      'standard': 1.0,
      'fast': 1.5,
      'urgent': 2.5
    };
    return multipliers[priority] || 1.0;
  }

  function calculateBatchFees(singleFee, count, batchOptimization, networkData) {
    if (count <= 1) {
      return {
        total: singleFee,
        savings: 0,
        perTransaction: singleFee
      };
    }

    let total, savings = 0;
    
    if (batchOptimization && networkData.gasPrice) {
      // Gas-based networks can benefit from batching
      const batchOverhead = 0.1; // 10% overhead for batching logic
      const savingsPerTx = 0.15; // 15% savings per additional transaction
      
      total = singleFee * (1 + batchOverhead);
      total += singleFee * (count - 1) * (1 - savingsPerTx);
      savings = (singleFee * count) - total;
    } else {
      // No batching benefits or fixed-fee networks
      total = singleFee * count;
    }

    return {
      total: total,
      savings: Math.max(0, savings),
      perTransaction: total / count
    };
  }

  function calculateLayer2Alternatives(transactionData, marketMultiplier) {
    const alternatives = [
      {
        name: 'Polygon',
        feeReduction: 0.95, // 95% cheaper
        confirmationTime: '5-10 seconds',
        bridgeCost: 15, // USD to bridge
        description: 'Ethereum-compatible sidechain'
      },
      {
        name: 'Arbitrum',
        feeReduction: 0.90, // 90% cheaper
        confirmationTime: '1-5 seconds',
        bridgeCost: 8, // USD to bridge
        description: 'Ethereum Layer 2 rollup'
      },
      {
        name: 'Optimism',
        feeReduction: 0.85, // 85% cheaper
        confirmationTime: '1-5 seconds',
        bridgeCost: 10, // USD to bridge
        description: 'Ethereum Layer 2 rollup'
      },
      {
        name: 'Lightning Network',
        feeReduction: 0.99, // 99% cheaper
        confirmationTime: 'Instant',
        bridgeCost: 2, // USD channel setup
        description: 'Bitcoin Layer 2 payment channels'
      }
    ];

    return alternatives.map(alt => {
      const estimatedFee = transactionData.baseFee * (1 - alt.feeReduction) * marketMultiplier / 1000000;
      return {
        ...alt,
        estimatedFee: estimatedFee,
        totalCostWithBridge: estimatedFee + alt.bridgeCost
      };
    });
  }

  function calculateOptimizations(totalFee, network, transactionType, optimizeCost, optimizeSpeed) {
    const optimizations = [];

    if (optimizeCost) {
      optimizations.push({
        type: 'cost',
        title: 'Cost Optimization',
        recommendations: [
          'Use "slow" priority during off-peak hours',
          'Batch multiple transactions together',
          'Consider Layer 2 solutions for frequent transactions',
          'Use SegWit addresses for Bitcoin transactions',
          'Avoid complex smart contract interactions during high congestion'
        ],
        potentialSavings: totalFee * 0.4 // Up to 40% savings
      });
    }

    if (optimizeSpeed) {
      optimizations.push({
        type: 'speed',
        title: 'Speed Optimization',
        recommendations: [
          'Use "fast" or "urgent" priority',
          'Set gas price 20-50% above current recommended',
          'Use wallets with RBF (Replace-by-Fee) support',
          'Monitor mempool before submitting',
          'Consider MEV protection for valuable transactions'
        ],
        additionalCost: totalFee * 0.8 // Up to 80% more cost
      });
    }

    // General optimizations
    optimizations.push({
      type: 'general',
      title: 'General Recommendations',
      recommendations: [
        'Monitor network congestion before transacting',
        'Use gas trackers for real-time fee estimates',
        'Set reasonable gas limits to avoid failed transactions',
        'Consider transaction timing for best rates',
        'Use reputable wallets with good fee estimation'
      ]
    });

    return optimizations;
  }

  function calculateTimingRecommendations(network, congestionLevel) {
    const currentHour = new Date().getUTCHours();
    const recommendations = [];

    // General timing patterns
    if (currentHour >= 14 && currentHour <= 20) { // Peak hours
      recommendations.push({
        type: 'warning',
        message: 'Currently peak hours (US/EU overlap) - fees typically 30-50% higher',
        suggestion: 'Consider waiting until after 22:00 UTC or before 12:00 UTC'
      });
    } else if (currentHour >= 22 || currentHour <= 6) { // Off-peak
      recommendations.push({
        type: 'success',
        message: 'Good timing! Off-peak hours typically have 20-40% lower fees',
        suggestion: 'Current time is optimal for cost-conscious transactions'
      });
    }

    // Weekend vs weekday
    const dayOfWeek = new Date().getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      recommendations.push({
        type: 'info',
        message: 'Weekend hours often have reduced network activity',
        suggestion: 'Good time for non-urgent transactions'
      });
    }

    // Network-specific recommendations
    if (network === 'ethereum') {
      recommendations.push({
        type: 'info',
        message: 'Ethereum fees spike during DeFi activity and NFT launches',
        suggestion: 'Check for major events before high-value transactions'
      });
    }

    return recommendations;
  }

  function displayResults(data) {
    const { totalFee, batchFees, networkData, transactionData } = data;
    const feePercentage = (totalFee / data.amountUSD * 100).toFixed(2);

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>💰 Estimated Fee</h6>
          <div class="big-number">$${totalFee.toFixed(4)}</div>
          <p class="insight-detail">${feePercentage}% of transaction amount</p>
        </div>
        <div class="insight-card success">
          <h6>⏱️ Confirmation Time</h6>
          <div class="big-number">${getConfirmationTimeDisplay(data.priority, networkData)}</div>
          <p class="insight-detail">${data.priority} priority</p>
        </div>
        <div class="insight-card warning">
          <h6>🌐 Network</h6>
          <div class="big-number">${networkData.name}</div>
          <p class="insight-detail">${transactionData.complexity} complexity</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Fee Breakdown</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>⚡ Base Calculation</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Network:</strong> ${networkData.name}</li>
                <li><strong>Transaction:</strong> ${transactionData.description}</li>
                <li><strong>Gas Limit:</strong> ${data.gasLimit.toLocaleString()}</li>
                <li><strong>Base Fee:</strong> ${transactionData.baseFee.toFixed(2)} ${networkData.feeUnit}</li>
              </ul>
            </div>

            <div>
              <h4>📈 Market Adjustments</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Market Multiplier:</strong> ${data.marketMultiplier.toFixed(2)}x</li>
                <li><strong>Priority Multiplier:</strong> ${data.priorityMultiplier.toFixed(2)}x</li>
                <li><strong>Final Rate:</strong> ${(transactionData.baseFee * data.marketMultiplier * data.priorityMultiplier).toFixed(2)} ${networkData.feeUnit}</li>
                <li><strong>USD Cost:</strong> $${totalFee.toFixed(4)}</li>
              </ul>
            </div>

            <div>
              <h4>🎯 Transaction Details</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Type:</strong> ${transactionData.description}</li>
                <li><strong>Complexity:</strong> ${transactionData.complexity}</li>
                <li><strong>Priority:</strong> ${data.priority}</li>
                <li><strong>Count:</strong> ${data.transactionCount} transaction(s)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    // Batch analysis
    if (data.transactionCount > 1) {
      html += `
        <div style="margin-top: 2rem;">
          <h3>📦 Batch Transaction Analysis</h3>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Total Cost:</strong><br>
                <span style="font-size: 1.5rem; color: var(--accent);">$${batchFees.total.toFixed(4)}</span><br>
                <small>All ${data.transactionCount} transactions</small>
              </div>
              <div>
                <strong>Per Transaction:</strong><br>
                <span style="font-size: 1.5rem; color: var(--accent);">$${batchFees.perTransaction.toFixed(4)}</span><br>
                <small>Average cost each</small>
              </div>
              <div>
                <strong>Batch Savings:</strong><br>
                <span style="font-size: 1.5rem; color: ${batchFees.savings > 0 ? 'green' : 'var(--accent)'};">$${batchFees.savings.toFixed(4)}</span><br>
                <small>${batchFees.savings > 0 ? 'Saved by batching' : 'No batch savings'}</small>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Layer 2 alternatives
    if (data.layer2Alternatives && data.layer2Alternatives.length > 0) {
      html += `
        <div style="margin-top: 2rem;">
          <h3>🌉 Layer 2 Alternatives</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
      `;
      
      data.layer2Alternatives.forEach(alt => {
        html += `
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">${alt.name}</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Fee:</strong> $${alt.estimatedFee.toFixed(6)}</li>
              <li><strong>Savings:</strong> ${(alt.feeReduction * 100).toFixed(0)}%</li>
              <li><strong>Bridge Cost:</strong> $${alt.bridgeCost}</li>
              <li><strong>Speed:</strong> ${alt.confirmationTime}</li>
            </ul>
            <small>${alt.description}</small>
          </div>
        `;
      });
      
      html += '</div></div>';
    }

    // Optimization recommendations
    if (data.optimizations && data.optimizations.length > 0) {
      html += `
        <div style="margin-top: 2rem;">
          <h3>💡 Optimization Recommendations</h3>
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
      `;
      
      data.optimizations.forEach(opt => {
        html += `
          <div style="margin-bottom: 1.5rem;">
            <h4>${opt.title}</h4>
            <ul style="margin: 0.5rem 0;">
              ${opt.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            ${opt.potentialSavings ? `<small><strong>Potential savings:</strong> Up to $${opt.potentialSavings.toFixed(4)}</small>` : ''}
            ${opt.additionalCost ? `<small><strong>Additional cost:</strong> Up to $${opt.additionalCost.toFixed(4)}</small>` : ''}
          </div>
        `;
      });
      
      html += '</div></div>';
    }

    // Timing recommendations
    if (data.timingRecs && data.timingRecs.length > 0) {
      html += `
        <div style="margin-top: 2rem;">
          <h3>⏰ Timing Recommendations</h3>
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
      `;
      
      data.timingRecs.forEach(rec => {
        const bgColor = rec.type === 'success' ? '#d4edda' : 
                       rec.type === 'warning' ? '#fff3cd' : '#d1ecf1';
        const borderColor = rec.type === 'success' ? '#28a745' : 
                           rec.type === 'warning' ? '#ffc107' : '#17a2b8';
        
        html += `
          <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 1rem; margin: 1rem 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: 500;">${rec.message}</p>
            <small>${rec.suggestion}</small>
          </div>
        `;
      });
      
      html += '</div></div>';
    }

    // Fee comparison chart
    html += `
      <div style="margin-top: 2rem;">
        <h3>📊 Fee Comparison</h3>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          ${generateFeeComparisonChart(data)}
        </div>
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>⚠️ Disclaimer:</strong> Blockchain fees are highly volatile and depend on real-time network conditions. 
        These estimates are based on current typical patterns but actual costs may vary significantly. 
        Always confirm fees in your wallet before submitting transactions.
      </div>
    `;

    result.innerHTML = html;
  }

  function getConfirmationTimeDisplay(priority, networkData) {
    const [minTime, maxTime] = networkData.confirmationTime;
    const priorityMultipliers = {
      'slow': { min: 2, max: 5 },
      'standard': { min: 1, max: 1.5 },
      'fast': { min: 0.3, max: 0.8 },
      'urgent': { min: 0.1, max: 0.5 }
    };
    
    const multiplier = priorityMultipliers[priority] || priorityMultipliers['standard'];
    const estimatedMin = minTime * multiplier.min;
    const estimatedMax = maxTime * multiplier.max;
    
    if (estimatedMax < 1) {
      return `${Math.round(estimatedMax * 60)}s`;
    } else if (estimatedMax < 60) {
      return `${Math.round(estimatedMin)}-${Math.round(estimatedMax)}min`;
    } else {
      return `${Math.round(estimatedMin / 60)}-${Math.round(estimatedMax / 60)}hr`;
    }
  }

  function generateFeeComparisonChart(data) {
    const priorities = ['slow', 'standard', 'fast', 'urgent'];
    const priorityLabels = {
      'slow': 'Slow (Low Cost)',
      'standard': 'Standard',
      'fast': 'Fast',
      'urgent': 'Urgent (High Cost)'
    };
    
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">';
    
    priorities.forEach(priority => {
      const multiplier = getPriorityMultiplier(priority);
      const fee = data.totalFee * multiplier / data.priorityMultiplier;
      const isSelected = priority === data.priority;
      
      html += `
        <div style="text-align: center; padding: 1rem; border-radius: 8px; ${isSelected ? 'background: var(--accent); color: white;' : 'background: var(--card-bg);'}">
          <div style="font-weight: bold; margin-bottom: 0.5rem;">${priorityLabels[priority]}</div>
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">$${fee.toFixed(4)}</div>
          <div style="font-size: 0.9rem;">${getConfirmationTimeDisplay(priority, data.networkData)}</div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }
});