document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("blockchain-fee-form");
  if (!form) return;

  // Network fee structures and characteristics
  const networkData = {
    bitcoin: {
      name: "Bitcoin",
      symbol: "BTC",
      baseFee: { slow: 1, standard: 5, fast: 15, urgent: 30 },
      gasUnit: "sat/vB",
      avgBlockTime: 600,
      description: "Найбільш безпечна та децентралізована мережа"
    },
    ethereum: {
      name: "Ethereum",
      symbol: "ETH", 
      baseFee: { slow: 10, standard: 25, fast: 50, urgent: 100 },
      gasUnit: "Gwei",
      avgBlockTime: 13,
      description: "Провідна платформа для смарт-контрактів та DeFi"
    },
    polygon: {
      name: "Polygon",
      symbol: "MATIC",
      baseFee: { slow: 0.01, standard: 0.05, fast: 0.2, urgent: 0.5 },
      gasUnit: "Gwei",
      avgBlockTime: 2,
      description: "Layer 2 рішення з низькими комісіями"
    },
    bsc: {
      name: "Binance Smart Chain",
      symbol: "BNB",
      baseFee: { slow: 0.2, standard: 0.5, fast: 2, urgent: 5 },
      gasUnit: "Gwei",
      avgBlockTime: 3,
      description: "Швидка мережа з помірними комісіями"
    },
    solana: {
      name: "Solana",
      symbol: "SOL",
      baseFee: { slow: 0.0001, standard: 0.0005, fast: 0.002, urgent: 0.01 },
      gasUnit: "SOL",
      avgBlockTime: 0.4,
      description: "Надшвидка мережа з мінімальними комісіями"
    },
    cardano: {
      name: "Cardano",
      symbol: "ADA",
      baseFee: { slow: 0.15, standard: 0.17, fast: 0.2, urgent: 0.25 },
      gasUnit: "ADA",
      avgBlockTime: 20,
      description: "Енергоефективна мережа з фіксованими комісіями"
    },
    avalanche: {
      name: "Avalanche",
      symbol: "AVAX",
      baseFee: { slow: 0.5, standard: 1, fast: 3, urgent: 8 },
      gasUnit: "nAVAX",
      avgBlockTime: 1,
      description: "Швидка мережа з масштабованістю"
    },
    arbitrum: {
      name: "Arbitrum",
      symbol: "ETH",
      baseFee: { slow: 0.2, standard: 0.5, fast: 2, urgent: 5 },
      gasUnit: "Gwei",
      avgBlockTime: 1,
      description: "Ethereum Layer 2 з дешевими транзакціями"
    },
    optimism: {
      name: "Optimism", 
      symbol: "ETH",
      baseFee: { slow: 0.1, standard: 0.3, fast: 1, urgent: 3 },
      gasUnit: "Gwei",
      avgBlockTime: 2,
      description: "Оптимістичний rollup для Ethereum"
    },
    lightning: {
      name: "Lightning Network",
      symbol: "BTC",
      baseFee: { slow: 0.001, standard: 0.003, fast: 0.01, urgent: 0.05 },
      gasUnit: "sat",
      avgBlockTime: 1,
      description: "Bitcoin Layer 2 для миттєвих платежів"
    }
  };

  // Transaction type gas multipliers
  const transactionMultipliers = {
    "simple-transfer": 1,
    "token-transfer": 1.5,
    "smart-contract": 3,
    "defi-swap": 4,
    "nft-mint": 5,
    "nft-transfer": 2,
    "defi-lending": 6,
    "multi-sig": 2.5,
    "contract-deploy": 10
  };

  // Priority multipliers
  const priorityMultipliers = {
    slow: 0.7,
    standard: 1,
    fast: 1.8,
    urgent: 3.5
  };

  // Congestion multipliers
  const congestionMultipliers = {
    low: 0.6,
    medium: 1,
    high: 2.5
  };

  // Elements
  const network = document.getElementById("network");
  const transactionType = document.getElementById("transaction-type");
  const priority = document.getElementById("priority");
  const amountUsd = document.getElementById("amount-usd");
  const transactionCount = document.getElementById("transaction-count");
  const gasPrice = document.getElementById("gas-price");
  const networkCongestion = document.getElementById("network-congestion");
  const includeLayer2 = document.getElementById("include-layer2");

  // Event listeners
  form.addEventListener("submit", calculateFees);

  function calculateFees(e) {
    e.preventDefault();

    const selectedNetwork = network.value;
    const selectedType = transactionType.value;
    const selectedPriority = priority.value;
    const amount = parseFloat(amountUsd.value) || 0;
    const txCount = parseInt(transactionCount.value) || 1;
    const customGasPrice = parseFloat(gasPrice.value) || null;
    const congestion = networkCongestion.value;
    const showLayer2 = includeLayer2.checked;

    if (!selectedNetwork || !selectedType || !selectedPriority) {
      alert("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    const networkInfo = networkData[selectedNetwork];
    const results = calculateNetworkFees(
      networkInfo, 
      selectedNetwork, 
      selectedType, 
      selectedPriority, 
      amount, 
      txCount, 
      customGasPrice, 
      congestion
    );

    let alternativeResults = [];
    if (showLayer2 && selectedNetwork === 'ethereum') {
      // Show Layer 2 alternatives for Ethereum
      ['polygon', 'arbitrum', 'optimism'].forEach(l2Network => {
        const l2Info = networkData[l2Network];
        const l2Results = calculateNetworkFees(
          l2Info, 
          l2Network, 
          selectedType, 
          selectedPriority, 
          amount, 
          txCount, 
          null, 
          congestion
        );
        alternativeResults.push(l2Results);
      });
    }

    displayResults(results, alternativeResults, networkInfo, selectedType, selectedPriority);
  }

  function calculateNetworkFees(networkInfo, networkKey, txType, priority, amount, txCount, customGas, congestion) {
    const baseFee = networkInfo.baseFee[priority];
    const typeMultiplier = transactionMultipliers[txType] || 1;
    const priorityMultiplier = priorityMultipliers[priority];
    const congestionMultiplier = congestionMultipliers[congestion];
    
    let finalFee = baseFee * typeMultiplier * priorityMultiplier * congestionMultiplier;
    
    if (customGas && networkKey === 'ethereum') {
      finalFee = customGas * 0.000000001 * 21000 * typeMultiplier; // Convert Gwei to ETH
    }

    const totalFee = finalFee * txCount;
    const feePercentage = amount > 0 ? (totalFee / amount) * 100 : 0;
    
    // Estimate confirmation time
    const baseConfirmTime = networkInfo.avgBlockTime;
    const estimatedTime = baseConfirmTime * (priority === 'urgent' ? 0.5 : 
                                            priority === 'fast' ? 1 : 
                                            priority === 'standard' ? 2 : 4);

    return {
      networkName: networkInfo.name,
      networkKey: networkKey,
      symbol: networkInfo.symbol,
      feePerTransaction: finalFee,
      totalFee: totalFee,
      feePercentage: feePercentage,
      estimatedTime: estimatedTime,
      gasUnit: networkInfo.gasUnit,
      description: networkInfo.description
    };
  }

  function displayResults(mainResult, alternatives, networkInfo, txType, priority) {
    const resultContainer = document.getElementById("blockchain-fee-result");
    
    // Get transaction type name in Ukrainian
    const txTypeNames = {
      "simple-transfer": "Простий переказ",
      "token-transfer": "Переказ токенів",
      "smart-contract": "Смарт-контракт",
      "defi-swap": "DeFi обмін",
      "nft-mint": "Мінтинг NFT",
      "nft-transfer": "Передача NFT",
      "defi-lending": "DeFi кредитування",
      "multi-sig": "Мультипідпис",
      "contract-deploy": "Розгортання контракту"
    };

    const priorityNames = {
      slow: "Повільний",
      standard: "Стандартний", 
      fast: "Швидкий",
      urgent: "Терміновий"
    };

    resultContainer.innerHTML = `
      <h3>💰 Розрахунок комісій блокчейн транзакцій</h3>
      
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🌐 ${mainResult.networkName}</h6>
          <div class="big-number">$${mainResult.totalFee.toFixed(mainResult.totalFee < 1 ? 4 : 2)}</div>
          <p>Загальна комісія<br>
          ${mainResult.feePerTransaction.toFixed(mainResult.feePerTransaction < 1 ? 4 : 2)} ${mainResult.symbol} за транзакцію<br>
          ${mainResult.description}</p>
        </div>
        
        <div class="insight-card ${mainResult.feePercentage > 5 ? 'warning' : mainResult.feePercentage > 1 ? 'info' : 'success'}">
          <h6>📊 Відсоток комісії</h6>
          <div class="big-number">${mainResult.feePercentage.toFixed(2)}%</div>
          <p>Від суми транзакції<br>
          ${mainResult.feePercentage > 5 ? 'Висока комісія' : 
            mainResult.feePercentage > 1 ? 'Помірна комісія' : 'Низька комісія'}</p>
        </div>
        
        <div class="insight-card success">
          <h6>⏱️ Час підтвердження</h6>
          <div class="big-number">${
            mainResult.estimatedTime < 60 ? 
            `${Math.round(mainResult.estimatedTime)}с` :
            mainResult.estimatedTime < 3600 ?
            `${Math.round(mainResult.estimatedTime / 60)}хв` :
            `${Math.round(mainResult.estimatedTime / 3600)}год`
          }</div>
          <p>Очікуваний час<br>
          Пріоритет: ${priorityNames[priority]}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📈 Деталі транзакції</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
          <div>
            <strong>🔗 Параметри мережі:</strong><br>
            Мережа: ${mainResult.networkName} (${mainResult.symbol})<br>
            Тип транзакції: ${txTypeNames[txType]}<br>
            Пріоритет: ${priorityNames[priority]}<br>
            Одиниця газу: ${mainResult.gasUnit}<br><br>
            
            <strong>💸 Структура комісій:</strong><br>
            Комісія за транзакцію: $${mainResult.feePerTransaction.toFixed(4)}<br>
            Кількість транзакцій: ${parseInt(document.getElementById('transaction-count').value)}<br>
            Загальна комісія: $${mainResult.totalFee.toFixed(4)}<br>
            Відсоток від суми: ${mainResult.feePercentage.toFixed(3)}%
          </div>
          
          <div>
            <strong>⏰ Прогноз часу:</strong><br>
            Середній час блоку: ${networkInfo.avgBlockTime}с<br>
            Очікуваний час підтвердження: ${
              mainResult.estimatedTime < 60 ? 
              `${Math.round(mainResult.estimatedTime)} секунд` :
              mainResult.estimatedTime < 3600 ?
              `${Math.round(mainResult.estimatedTime / 60)} хвилин` :
              `${Math.round(mainResult.estimatedTime / 3600)} годин`
            }<br><br>
            
            <strong>🎯 Рекомендації:</strong><br>
            ${getRecommendations(mainResult, alternatives.length > 0)}
          </div>
        </div>
        
        ${alternatives.length > 0 ? `
          <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 8px;">
            <strong>🚀 Альтернативи Layer 2 (дешевші):</strong><br>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
              ${alternatives.map(alt => `
                <div style="padding: 1rem; background: #e8f5e8; border-radius: 6px; text-align: center;">
                  <strong>${alt.networkName}</strong><br>
                  $${alt.totalFee.toFixed(4)}<br>
                  <small>${alt.feePercentage.toFixed(2)}% від суми</small><br>
                  <small>~${Math.round(alt.estimatedTime / 60)}хв</small>
                </div>
              `).join('')}
            </div>
            <small style="color: #666; margin-top: 0.5rem; display: block;">
              * Layer 2 рішення вимагають моста (bridge) з основної мережі
            </small>
          </div>
        ` : ''}
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: ${
          mainResult.feePercentage > 5 ? '#fff3cd' : 
          mainResult.feePercentage > 1 ? '#e3f2fd' : '#d4edda'
        }; border-radius: 8px; border-left: 4px solid ${
          mainResult.feePercentage > 5 ? '#ffc107' : 
          mainResult.feePercentage > 1 ? '#2196f3' : '#28a745'
        };">
          <strong>💡 Поради для економії:</strong><br>
          ${getSavingTips(mainResult, txType, priority)}<br><br>
          
          <strong>⚠️ Важливо пам'ятати:</strong><br>
          • Комісії можуть змінюватися швидко залежно від завантаженості мережі<br>
          • Завжди перевіряйте комісії перед підтвердженням транзакції<br>
          • Невдалі транзакції також стягують комісії в більшості мереж<br>
          • Використовуйте калькулятори газу вашого гаманця для точніших оцінок
        </div>
      </div>
    `;
  }

  function getRecommendations(result, hasAlternatives) {
    if (result.feePercentage > 5) {
      return "Висока комісія! Розгляньте інші мережі або зачекайте зниження завантаженості.";
    } else if (result.feePercentage > 1) {
      return hasAlternatives ? "Помірна комісія. Перевірте альтернативи Layer 2 нижче." : "Помірна комісія для цієї мережі.";
    } else {
      return "Низька комісія - гарний час для транзакції!";
    }
  }

  function getSavingTips(result, txType, priority) {
    const tips = [];
    
    if (priority === 'urgent' || priority === 'fast') {
      tips.push("• Зменшіть пріоритет якщо не поспішаєте");
    }
    
    if (result.networkKey === 'ethereum') {
      tips.push("• Розгляньте Layer 2 рішення (Polygon, Arbitrum, Optimism)");
    }
    
    if (txType.includes('defi') || txType === 'smart-contract') {
      tips.push("• Групуйте кілька операцій в одну транзакцію якщо можливо");
    }
    
    tips.push("• Здійснюйте транзакції у неpікові години (вихідні, рано вранці UTC)");
    tips.push("• Моніторьте завантаженість мережі перед транзакціями");
    
    return tips.join('<br>');
  }
});