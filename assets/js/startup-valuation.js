document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("startup-valuation-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Отримання даних з форми
    const companyStage = document.getElementById("companyStage").value;
    const industry = document.getElementById("industry").value;
    const foundingYear = parseInt(document.getElementById("foundingYear").value) || new Date().getFullYear();
    
    const currentRevenue = parseFloat(document.getElementById("currentRevenue").value) || 0;
    const revenueGrowthRate = parseFloat(document.getElementById("revenueGrowthRate").value) || 0;
    const grossMargin = parseFloat(document.getElementById("grossMargin").value) || 0;
    const monthlyBurnRate = parseFloat(document.getElementById("monthlyBurnRate").value) || 0;
    const currentCash = parseFloat(document.getElementById("currentCash").value) || 0;
    
    const totalAddressableMarket = parseFloat(document.getElementById("totalAddressableMarket").value) || 0;
    const activeUsers = parseInt(document.getElementById("activeUsers").value) || 0;
    const customerAcquisitionCost = parseFloat(document.getElementById("customerAcquisitionCost").value) || 0;
    const lifetimeValue = parseFloat(document.getElementById("lifetimeValue").value) || 0;
    
    const teamExperience = document.getElementById("teamExperience").value;
    const intellectualProperty = document.getElementById("intellectualProperty").value;
    const competitivePosition = document.getElementById("competitivePosition").value;

    // Розрахунок різних методів оцінки
    const valuationMethods = calculateValuations({
      companyStage, industry, foundingYear, currentRevenue, revenueGrowthRate,
      grossMargin, monthlyBurnRate, currentCash, totalAddressableMarket,
      activeUsers, customerAcquisitionCost, lifetimeValue, teamExperience,
      intellectualProperty, competitivePosition
    });

    // Розрахунок зваженої оцінки
    const weightedValuation = calculateWeightedValuation(valuationMethods, companyStage);
    
    // Аналіз ризиків та коригувань
    const riskAnalysis = analyzeRisks({
      companyStage, currentRevenue, monthlyBurnRate, currentCash,
      lifetimeValue, customerAcquisitionCost, competitivePosition,
      intellectualProperty, teamExperience
    });

    // Форматування валюти
    const formatCurrency = (amount, currency = 'USD') => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const formatNumber = (number, decimals = 1) => {
      return new Intl.NumberFormat('uk-UA', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(number);
    };

    // Відображення результатів
    document.getElementById("startup-valuation-result").innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${weightedValuation.confidenceColor}">
          <h6>💎 Оцінка вартості</h6>
          <div class="big-number">${formatCurrency(weightedValuation.value)}</div>
          <p>Зважена оцінка</p>
        </div>
        
        <div class="insight-card info">
          <h6>📊 Діапазон оцінки</h6>
          <div class="result-value">
            ${formatCurrency(weightedValuation.lowRange)} - 
            ${formatCurrency(weightedValuation.highRange)}
          </div>
          <p>Мін - Макс</p>
        </div>
        
        <div class="insight-card ${riskAnalysis.overallRiskColor}">
          <h6>⚖️ Рівень ризику</h6>
          <div class="big-number">${riskAnalysis.riskScore}/10</div>
          <p>${riskAnalysis.riskLevel}</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>🔍 Детальний аналіз методів оцінки</h4>
        
        <div class="insight-cards">
          <div class="insight-card">
            <h6>📈 DCF метод</h6>
            <div class="result-value">${formatCurrency(valuationMethods.dcf.value)}</div>
            <small>
              • Прогнозний дохід (5р): ${formatCurrency(valuationMethods.dcf.futureRevenue)}<br>
              • Термінальна вартість: ${formatCurrency(valuationMethods.dcf.terminalValue)}<br>
              • Ставка дисконту: ${valuationMethods.dcf.discountRate}%
            </small>
          </div>
          
          <div class="insight-card">
            <h6>🏢 Ринкові мультиплікатори</h6>
            <div class="result-value">${formatCurrency(valuationMethods.multiples.value)}</div>
            <small>
              • Revenue multiple: ${valuationMethods.multiples.revenueMultiple}x<br>
              • Галузевий коефіцієнт: ${valuationMethods.multiples.industryAdjustment}<br>
              • Стадійний коефіцієнт: ${valuationMethods.multiples.stageAdjustment}
            </small>
          </div>
          
          <div class="insight-card">
            <h6>👥 Метод аналогів</h6>
            <div class="result-value">${formatCurrency(valuationMethods.comparables.value)}</div>
            <small>
              • Базова оцінка: ${formatCurrency(valuationMethods.comparables.baseValue)}<br>
              • Коригування команди: ${valuationMethods.comparables.teamAdjustment}%<br>
              • Коригування IP: ${valuationMethods.comparables.ipAdjustment}%
            </small>
          </div>
        </div>

        ${activeUsers > 0 ? `
          <div class="insight-card">
            <h6>📊 User-based оцінка</h6>
            <div class="result-value">${formatCurrency(valuationMethods.userBased.value)}</div>
            <small>
              • Вартість на користувача: ${formatCurrency(valuationMethods.userBased.valuePerUser)}<br>
              • Активні користувачі: ${formatNumber(activeUsers, 0)}<br>
              • Коефіцієнт зростання: ${valuationMethods.userBased.growthMultiplier}x
            </small>
          </div>
        ` : ''}

        <div style="margin-top: 1.5rem;">
          <h4>⚖️ Аналіз ризиків та коригувань</h4>
          
          <div class="insight-cards">
            <div class="insight-card ${riskAnalysis.financialHealthColor}">
              <h6>💰 Фінансове здоров'я</h6>
              <div class="result-value">${riskAnalysis.financialHealthScore}/10</div>
              <small>
                • Runway: ${riskAnalysis.runwayMonths} міс<br>
                • LTV/CAC: ${riskAnalysis.ltvCacRatio.toFixed(1)}x<br>
                • Burn efficiency: ${riskAnalysis.burnEfficiency}
              </small>
            </div>
            
            <div class="insight-card ${riskAnalysis.marketPositionColor}">
              <h6>🎯 Ринкова позиція</h6>
              <div class="result-value">${riskAnalysis.marketPositionScore}/10</div>
              <small>
                • Конкурентна позиція: ${getCompetitivePositionText(competitivePosition)}<br>
                • IP захист: ${getIPText(intellectualProperty)}<br>
                • Ринкова частка: ${riskAnalysis.marketShare}%
              </small>
            </div>
            
            <div class="insight-card ${riskAnalysis.teamQualityColor}">
              <h6>👥 Якість команди</h6>
              <div class="result-value">${riskAnalysis.teamQualityScore}/10</div>
              <small>
                • Досвід: ${getTeamExperienceText(teamExperience)}<br>
                • Execution risk: ${riskAnalysis.executionRisk}<br>
                • Leadership strength: ${riskAnalysis.leadershipStrength}
              </small>
            </div>
          </div>
        </div>

        ${generateInvestmentRecommendations(weightedValuation, riskAnalysis, {
          currentRevenue, revenueGrowthRate, monthlyBurnRate, currentCash
        })}
      </div>
    `;

    // Показати графік
    const chartBlock = document.getElementById("valuation-chart-block");
    if (chartBlock) {
      chartBlock.style.display = "block";
      createValuationChart(valuationMethods, weightedValuation);
    }
  });

  function calculateValuations(params) {
    const {
      companyStage, industry, currentRevenue, revenueGrowthRate,
      grossMargin, monthlyBurnRate, totalAddressableMarket,
      activeUsers, customerAcquisitionCost, lifetimeValue,
      teamExperience, intellectualProperty, competitivePosition
    } = params;

    // DCF метод
    const dcf = calculateDCF(currentRevenue, revenueGrowthRate, grossMargin, companyStage);
    
    // Ринкові мультиплікатори
    const multiples = calculateMultiples(currentRevenue, industry, companyStage, revenueGrowthRate);
    
    // Метод аналогів
    const comparables = calculateComparables(currentRevenue, industry, companyStage, 
      teamExperience, intellectualProperty, competitivePosition);
    
    // User-based оцінка
    const userBased = calculateUserBased(activeUsers, lifetimeValue, revenueGrowthRate);

    return { dcf, multiples, comparables, userBased };
  }

  function calculateDCF(currentRevenue, growthRate, grossMargin, stage) {
    const discountRates = {
      'pre-seed': 50,
      'seed': 40,
      'series-a': 30,
      'series-b': 25,
      'growth': 20
    };
    
    const discountRate = discountRates[stage] || 30;
    const terminalGrowthRate = 3; // Довготерміновий темп зростання
    
    let projectedRevenue = currentRevenue;
    let presentValue = 0;
    
    // 5-річний прогноз
    for (let year = 1; year <= 5; year++) {
      const yearlyGrowthRate = Math.max(growthRate * Math.pow(0.8, year - 1), 10); // Зменшення темпу росту
      projectedRevenue *= (1 + yearlyGrowthRate / 100);
      const ebitda = projectedRevenue * (grossMargin / 100) * 0.3; // 30% EBITDA margin
      const discountFactor = Math.pow(1 + discountRate / 100, year);
      presentValue += ebitda / discountFactor;
    }
    
    // Термінальна вартість
    const terminalEbitda = projectedRevenue * (grossMargin / 100) * 0.3;
    const terminalValue = (terminalEbitda * (1 + terminalGrowthRate / 100)) / 
                         ((discountRate - terminalGrowthRate) / 100);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, 5);
    
    const totalValue = presentValue + discountedTerminalValue;
    
    return {
      value: totalValue,
      futureRevenue: projectedRevenue,
      terminalValue: discountedTerminalValue,
      discountRate: discountRate
    };
  }

  function calculateMultiples(currentRevenue, industry, stage, growthRate) {
    const industryMultiples = {
      'saas': { base: 10, growth: 0.5 },
      'fintech': { base: 8, growth: 0.4 },
      'ecommerce': { base: 3, growth: 0.2 },
      'healthtech': { base: 12, growth: 0.6 },
      'edtech': { base: 6, growth: 0.3 },
      'agtech': { base: 5, growth: 0.3 },
      'cleantech': { base: 8, growth: 0.4 },
      'other': { base: 5, growth: 0.3 }
    };
    
    const stageMultipliers = {
      'pre-seed': 0.3,
      'seed': 0.5,
      'series-a': 0.8,
      'series-b': 1.0,
      'growth': 1.2
    };
    
    const industryData = industryMultiples[industry] || industryMultiples['other'];
    const baseMultiple = industryData.base;
    const growthFactor = Math.min(growthRate / 100 * industryData.growth, 5);
    const adjustedMultiple = baseMultiple + growthFactor;
    const stageAdjustment = stageMultipliers[stage] || 0.8;
    
    const finalMultiple = adjustedMultiple * stageAdjustment;
    
    return {
      value: currentRevenue * finalMultiple,
      revenueMultiple: finalMultiple.toFixed(1),
      industryAdjustment: industryData.base,
      stageAdjustment: stageAdjustment
    };
  }

  function calculateComparables(currentRevenue, industry, stage, teamExp, ip, competitive) {
    const baseValues = {
      'pre-seed': 500000,
      'seed': 2000000,
      'series-a': 8000000,
      'series-b': 25000000,
      'growth': 80000000
    };
    
    const baseValue = baseValues[stage] || 5000000;
    
    // Коригування за команду
    const teamAdjustments = {
      'novice': -20,
      'experienced': 0,
      'serial': 25,
      'expert': 40
    };
    
    // Коригування за IP
    const ipAdjustments = {
      'none': -10,
      'pending': 0,
      'limited': 10,
      'strong': 25,
      'moat': 50
    };
    
    // Коригування за конкурентну позицію
    const competitiveAdjustments = {
      'weak': -20,
      'moderate': 0,
      'strong': 20,
      'dominant': 40
    };
    
    const teamAdj = teamAdjustments[teamExp] || 0;
    const ipAdj = ipAdjustments[ip] || 0;
    const compAdj = competitiveAdjustments[competitive] || 0;
    
    const totalAdjustment = (100 + teamAdj + ipAdj + compAdj) / 100;
    const adjustedValue = baseValue * totalAdjustment;
    
    // Додаємо revenue-based component
    const revenueComponent = currentRevenue * 2;
    const finalValue = Math.max(adjustedValue, revenueComponent);
    
    return {
      value: finalValue,
      baseValue: baseValue,
      teamAdjustment: teamAdj,
      ipAdjustment: ipAdj,
      competitiveAdjustment: compAdj
    };
  }

  function calculateUserBased(activeUsers, ltv, growthRate) {
    if (activeUsers === 0) {
      return { value: 0, valuePerUser: 0, growthMultiplier: 1 };
    }
    
    const baseValuePerUser = ltv * 0.5; // 50% of LTV as valuation base
    const growthMultiplier = 1 + Math.min(growthRate / 100, 3);
    const adjustedValuePerUser = baseValuePerUser * growthMultiplier;
    
    return {
      value: activeUsers * adjustedValuePerUser,
      valuePerUser: adjustedValuePerUser,
      growthMultiplier: growthMultiplier.toFixed(1)
    };
  }

  function calculateWeightedValuation(methods, stage) {
    // Ваги для різних методів залежно від стадії
    const weights = {
      'pre-seed': { dcf: 0.1, multiples: 0.2, comparables: 0.6, userBased: 0.1 },
      'seed': { dcf: 0.2, multiples: 0.3, comparables: 0.4, userBased: 0.1 },
      'series-a': { dcf: 0.3, multiples: 0.4, comparables: 0.2, userBased: 0.1 },
      'series-b': { dcf: 0.4, multiples: 0.4, comparables: 0.1, userBased: 0.1 },
      'growth': { dcf: 0.5, multiples: 0.3, comparables: 0.1, userBased: 0.1 }
    };
    
    const stageWeights = weights[stage] || weights['series-a'];
    
    const weightedValue = 
      methods.dcf.value * stageWeights.dcf +
      methods.multiples.value * stageWeights.multiples +
      methods.comparables.value * stageWeights.comparables +
      methods.userBased.value * stageWeights.userBased;
    
    // Діапазон оцінки (±30%)
    const lowRange = weightedValue * 0.7;
    const highRange = weightedValue * 1.3;
    
    // Оцінка впевненості
    const valuations = [methods.dcf.value, methods.multiples.value, methods.comparables.value];
    const avgValuation = valuations.reduce((a, b) => a + b, 0) / valuations.length;
    const variance = valuations.reduce((acc, val) => acc + Math.pow(val - avgValuation, 2), 0) / valuations.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgValuation;
    
    let confidenceColor = 'success';
    if (coefficientOfVariation > 0.5) confidenceColor = 'warning';
    if (coefficientOfVariation > 1) confidenceColor = 'warning';
    
    return {
      value: weightedValue,
      lowRange,
      highRange,
      confidence: 1 - Math.min(coefficientOfVariation, 1),
      confidenceColor
    };
  }

  function analyzeRisks(params) {
    const {
      companyStage, currentRevenue, monthlyBurnRate, currentCash,
      lifetimeValue, customerAcquisitionCost, competitivePosition,
      intellectualProperty, teamExperience
    } = params;

    // Фінансове здоров'я
    const runwayMonths = monthlyBurnRate > 0 ? currentCash / monthlyBurnRate : 999;
    const ltvCacRatio = customerAcquisitionCost > 0 ? lifetimeValue / customerAcquisitionCost : 0;
    let financialHealthScore = 0;
    
    if (runwayMonths >= 18) financialHealthScore += 4;
    else if (runwayMonths >= 12) financialHealthScore += 3;
    else if (runwayMonths >= 6) financialHealthScore += 2;
    else financialHealthScore += 1;
    
    if (ltvCacRatio >= 3) financialHealthScore += 3;
    else if (ltvCacRatio >= 2) financialHealthScore += 2;
    else if (ltvCacRatio >= 1) financialHealthScore += 1;
    
    if (currentRevenue >= 1000000) financialHealthScore += 3;
    else if (currentRevenue >= 100000) financialHealthScore += 2;
    else if (currentRevenue > 0) financialHealthScore += 1;

    // Ринкова позиція
    const competitiveScores = { 'weak': 2, 'moderate': 5, 'strong': 8, 'dominant': 10 };
    const ipScores = { 'none': 2, 'pending': 4, 'limited': 6, 'strong': 8, 'moat': 10 };
    
    const competitiveScore = competitiveScores[competitivePosition] || 5;
    const ipScore = ipScores[intellectualProperty] || 5;
    const marketPositionScore = Math.round((competitiveScore + ipScore) / 2);

    // Якість команди
    const teamScores = { 'novice': 3, 'experienced': 6, 'serial': 8, 'expert': 10 };
    const teamQualityScore = teamScores[teamExperience] || 6;

    // Загальний ризик
    const riskScore = Math.round((financialHealthScore + marketPositionScore + teamQualityScore) / 3);
    
    let riskLevel, overallRiskColor;
    if (riskScore >= 8) {
      riskLevel = 'Низький';
      overallRiskColor = 'success';
    } else if (riskScore >= 6) {
      riskLevel = 'Помірний';
      overallRiskColor = 'info';
    } else if (riskScore >= 4) {
      riskLevel = 'Високий';
      overallRiskColor = 'warning';
    } else {
      riskLevel = 'Критичний';
      overallRiskColor = 'warning';
    }

    return {
      riskScore,
      riskLevel,
      overallRiskColor,
      financialHealthScore,
      financialHealthColor: financialHealthScore >= 7 ? 'success' : financialHealthScore >= 5 ? 'info' : 'warning',
      marketPositionScore,
      marketPositionColor: marketPositionScore >= 7 ? 'success' : marketPositionScore >= 5 ? 'info' : 'warning',
      teamQualityScore,
      teamQualityColor: teamQualityScore >= 7 ? 'success' : teamQualityScore >= 5 ? 'info' : 'warning',
      runwayMonths: runwayMonths.toFixed(1),
      ltvCacRatio,
      burnEfficiency: runwayMonths >= 18 ? 'Відмінна' : runwayMonths >= 12 ? 'Хороша' : 'Потребує покращення',
      marketShare: Math.min((currentRevenue / 10000000) * 100, 100).toFixed(1),
      executionRisk: teamQualityScore >= 7 ? 'Низький' : 'Помірний',
      leadershipStrength: teamQualityScore >= 8 ? 'Сильне' : 'Середнє'
    };
  }

  function getCompetitivePositionText(position) {
    const texts = {
      'weak': 'Слабка',
      'moderate': 'Помірна',
      'strong': 'Сильна',
      'dominant': 'Домінуюча'
    };
    return texts[position] || 'Помірна';
  }

  function getIPText(ip) {
    const texts = {
      'none': 'Відсутній',
      'pending': 'В процесі',
      'limited': 'Обмежений',
      'strong': 'Сильний',
      'moat': 'Дуже сильний'
    };
    return texts[ip] || 'Обмежений';
  }

  function getTeamExperienceText(experience) {
    const texts = {
      'novice': 'Початківці',
      'experienced': 'Досвідчені',
      'serial': 'Серійні підприємці',
      'expert': 'Експерти галузі'
    };
    return texts[experience] || 'Досвідчені';
  }

  function generateInvestmentRecommendations(valuation, risks, financial) {
    const recommendations = [];

    if (risks.riskScore >= 7) {
      recommendations.push("✅ Стартап показує сильні показники для інвестування");
    }
    
    if (risks.financialHealthScore < 5) {
      recommendations.push("💰 Рекомендується збільшити runway до 18+ місяців");
    }
    
    if (financial.revenueGrowthRate < 50 && financial.currentRevenue > 0) {
      recommendations.push("📈 Фокус на прискоренні темпів зростання доходів");
    }
    
    if (risks.ltvCacRatio < 3 && risks.ltvCacRatio > 0) {
      recommendations.push("🎯 Покращити unit economics (LTV/CAC співвідношення)");
    }
    
    if (risks.marketPositionScore < 6) {
      recommendations.push("🛡️ Укріплення конкурентних переваг та IP захисту");
    }

    const investmentAmount = valuation.value * 0.2; // 20% equity
    const suggestedEquity = valuation.value > 10000000 ? "15-25%" : "20-30%";

    return `
      <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid var(--accent);">
        <h5>💡 Рекомендації для інвесторів:</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          <li>💎 Рекомендована частка для інвестора: ${suggestedEquity}</li>
          <li>💵 Орієнтовна сума інвестицій: ${new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(investmentAmount)}</li>
          <li>📊 Регулярно переглядати оцінку при досягненні етапів</li>
        </ul>
      </div>
    `;
  }

  function createValuationChart(methods, weighted) {
    const canvas = document.getElementById("valuation-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Налаштування canvas - responsive height from container
    const width = canvas.offsetWidth;
    const container = canvas.parentElement;
    const height = container ? container.offsetHeight - 40 : Math.min(340, Math.max(168, width * 0.4));
    canvas.width = width;
    canvas.height = height;

    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const data = [
      { name: 'DCF', value: methods.dcf.value, color: '#157aff' },
      { name: 'Мультипл.', value: methods.multiples.value, color: '#28a745' },
      { name: 'Аналоги', value: methods.comparables.value, color: '#ffc107' },
      { name: 'Зважена', value: weighted.value, color: '#dc3545' }
    ];

    if (methods.userBased.value > 0) {
      data.splice(3, 0, { name: 'User-based', value: methods.userBased.value, color: '#6f42c1' });
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length * 0.6;
    const spacing = chartWidth / data.length;

    // Малювання стовпчиків
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * spacing + spacing / 2 - barWidth / 2;
      const y = padding + chartHeight - barHeight;

      // Стовпчик
      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Підпис методу
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, x + barWidth / 2, height - padding + 20);

      // Значення
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      const formattedValue = '$' + (item.value / 1000000).toFixed(1) + 'M';
      ctx.fillText(formattedValue, x + barWidth / 2, y - 5);
    });

    // Осі
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Заголовок
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Порівняння методів оцінки', width / 2, 30);
  }
});