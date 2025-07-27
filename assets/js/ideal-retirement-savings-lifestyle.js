document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("retirement-lifestyle-form");
  const resultDiv = document.getElementById("retirement-lifestyle-result");

  // Update income replacement based on lifestyle type
  document.getElementById("lifestyle-type").addEventListener("change", function() {
    const lifestyleType = this.value;
    const incomeReplacementInput = document.getElementById("income-replacement");
    
    const replacementRates = {
      'fire': 45,
      'modest': 60,
      'comfortable': 80,
      'luxury': 125,
      'custom': incomeReplacementInput.value
    };
    
    if (lifestyleType !== 'custom') {
      incomeReplacementInput.value = replacementRates[lifestyleType];
    }
  });

  // Update expected return based on risk tolerance
  document.getElementById("risk-tolerance").addEventListener("change", function() {
    const riskLevel = this.value;
    const expectedReturnInput = document.getElementById("expected-return");
    
    const returnRates = {
      'conservative': 6.5,
      'moderate': 10,
      'aggressive': 15
    };
    
    expectedReturnInput.value = returnRates[riskLevel];
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateRetirementPlan();
  });

  function calculateRetirementPlan() {
    // Get form data
    const currentAge = parseInt(document.getElementById("current-age").value);
    const retirementAge = parseInt(document.getElementById("retirement-age").value);
    const lifeExpectancy = parseInt(document.getElementById("life-expectancy").value);
    const currentIncome = parseFloat(document.getElementById("current-income").value);
    const currentSavings = parseFloat(document.getElementById("current-savings").value);
    const monthlySavings = parseFloat(document.getElementById("monthly-savings").value);
    const incomeGrowth = parseFloat(document.getElementById("income-growth").value) / 100;
    const incomeReplacement = parseFloat(document.getElementById("income-replacement").value) / 100;
    const expectedReturn = parseFloat(document.getElementById("expected-return").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflation-rate").value) / 100;
    const withdrawalRate = parseFloat(document.getElementById("withdrawal-rate").value) / 100;
    const healthcareBudget = parseFloat(document.getElementById("healthcare-budget").value) / 100;
    const travelBudget = parseFloat(document.getElementById("travel-budget").value) / 100;
    const familySupport = parseFloat(document.getElementById("family-support").value) || 0;
    
    const lifestyleType = document.getElementById("lifestyle-type").value;
    const housingStatus = document.getElementById("housing-status").value;
    const maritalStatus = document.getElementById("marital-status").value;
    
    const statePension = document.getElementById("state-pension").checked;
    const inheritance = document.getElementById("inheritance").checked;
    const partTimeWork = document.getElementById("part-time-work").checked;
    const longTermCare = document.getElementById("long-term-care").checked;

    if (currentAge >= retirementAge) {
      resultDiv.innerHTML = '<p style="color: red;">Вік виходу на пенсію повинен бути більшим за поточний вік.</p>';
      return;
    }

    if (retirementAge >= lifeExpectancy) {
      resultDiv.innerHTML = '<p style="color: red;">Очікувана тривалість життя повинна бути більшою за вік виходу на пенсію.</p>';
      return;
    }

    // Calculate retirement needs
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Calculate future income at retirement (adjusted for growth and inflation)
    const realIncomeGrowth = incomeGrowth - inflationRate;
    const futureIncome = currentIncome * Math.pow(1 + realIncomeGrowth, yearsToRetirement);
    
    // Calculate required retirement income
    let baseRetirementIncome = futureIncome * incomeReplacement;
    
    // Add specific lifestyle costs
    const healthcareCosts = baseRetirementIncome * healthcareBudget;
    const travelCosts = baseRetirementIncome * travelBudget;
    const totalRetirementIncome = baseRetirementIncome + familySupport + 
                                  (longTermCare ? baseRetirementIncome * 0.2 : 0);

    // Calculate required retirement capital using withdrawal rate
    const requiredCapital = totalRetirementIncome * 12 / withdrawalRate;
    
    // Calculate future value of current savings
    const realReturn = expectedReturn - inflationRate;
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + realReturn, yearsToRetirement);
    
    // Calculate future value of monthly savings
    const monthlyRealReturn = realReturn / 12;
    const futureValueMonthlySavings = monthlySavings * 
      (Math.pow(1 + monthlyRealReturn, yearsToRetirement * 12) - 1) / monthlyRealReturn;
    
    // Total projected savings
    const totalProjectedSavings = futureValueCurrentSavings + futureValueMonthlySavings;
    
    // Calculate gap
    const savingsGap = requiredCapital - totalProjectedSavings;
    
    // Calculate additional monthly savings needed
    const additionalMonthlySavings = savingsGap > 0 ? 
      (savingsGap * monthlyRealReturn) / (Math.pow(1 + monthlyRealReturn, yearsToRetirement * 12) - 1) : 0;

    // State pension estimation (simplified)
    const statePensionAmount = statePension ? Math.min(currentIncome * 0.4, 7100) : 0; // 40% up to average wage
    
    // Part-time work income
    const partTimeIncome = partTimeWork ? futureIncome * 0.3 : 0; // 30% of pre-retirement income
    
    // Calculate various scenarios
    const scenarios = calculateScenarios(currentAge, retirementAge, currentIncome, currentSavings, monthlySavings, expectedReturn, inflationRate);

    const calculation = {
      currentAge,
      retirementAge,
      lifeExpectancy,
      yearsToRetirement,
      yearsInRetirement,
      currentIncome,
      futureIncome,
      baseRetirementIncome,
      totalRetirementIncome,
      requiredCapital,
      currentSavings,
      totalProjectedSavings,
      savingsGap,
      additionalMonthlySavings,
      statePensionAmount,
      partTimeIncome,
      lifestyleType,
      housingStatus,
      scenarios,
      affordability: calculateAffordability(totalRetirementIncome, requiredCapital, withdrawalRate),
      recommendations: generateRecommendations(savingsGap, yearsToRetirement, currentAge, lifestyleType)
    };

    displayResults(calculation);
  }

  function calculateScenarios(currentAge, retirementAge, currentIncome, currentSavings, monthlySavings, expectedReturn, inflationRate) {
    const scenarios = [];
    const yearsToRetirement = retirementAge - currentAge;
    const realReturn = expectedReturn - inflationRate;
    const monthlyRealReturn = realReturn / 12;
    
    // Scenario 1: Conservative (lower returns)
    const conservativeReturn = realReturn * 0.7;
    const conservativeMonthlyReturn = conservativeReturn / 12;
    const conservativeFuture = currentSavings * Math.pow(1 + conservativeReturn, yearsToRetirement) +
      monthlySavings * (Math.pow(1 + conservativeMonthlyReturn, yearsToRetirement * 12) - 1) / conservativeMonthlyReturn;
    
    scenarios.push({
      name: 'Консервативний сценарій',
      description: 'Нижча дохідність (-30%)',
      projectedSavings: conservativeFuture,
      monthlyIncome: conservativeFuture * 0.04 / 12
    });
    
    // Scenario 2: Base case
    const baseFuture = currentSavings * Math.pow(1 + realReturn, yearsToRetirement) +
      monthlySavings * (Math.pow(1 + monthlyRealReturn, yearsToRetirement * 12) - 1) / monthlyRealReturn;
    
    scenarios.push({
      name: 'Базовий сценарій',
      description: 'Очікувана дохідність',
      projectedSavings: baseFuture,
      monthlyIncome: baseFuture * 0.04 / 12
    });
    
    // Scenario 3: Optimistic (higher returns)
    const optimisticReturn = realReturn * 1.3;
    const optimisticMonthlyReturn = optimisticReturn / 12;
    const optimisticFuture = currentSavings * Math.pow(1 + optimisticReturn, yearsToRetirement) +
      monthlySavings * (Math.pow(1 + optimisticMonthlyReturn, yearsToRetirement * 12) - 1) / optimisticMonthlyReturn;
    
    scenarios.push({
      name: 'Оптимістичний сценарій',
      description: 'Вища дохідність (+30%)',
      projectedSavings: optimisticFuture,
      monthlyIncome: optimisticFuture * 0.04 / 12
    });
    
    return scenarios;
  }

  function calculateAffordability(totalRetirementIncome, requiredCapital, withdrawalRate) {
    const currentMinWage = 7100;
    const averageWage = 16000;
    
    return {
      versusMinWage: totalRetirementIncome / currentMinWage,
      versusAverage: totalRetirementIncome / averageWage,
      sustainabilityYears: requiredCapital / (totalRetirementIncome * 12),
      safeWithdrawalRate: withdrawalRate <= 0.04
    };
  }

  function generateRecommendations(savingsGap, yearsToRetirement, currentAge, lifestyleType) {
    const recommendations = [];
    
    if (savingsGap > 0) {
      recommendations.push({
        priority: 'high',
        text: `Збільште щомісячні інвестиції або розгляньте відтермінування пенсії на ${Math.ceil(savingsGap / 500000)} років`
      });
    }
    
    if (currentAge < 35) {
      recommendations.push({
        priority: 'medium',
        text: 'Ви молоді - розгляньте агресивнішу інвестиційну стратегію для максимізації росту'
      });
    }
    
    if (yearsToRetirement < 15) {
      recommendations.push({
        priority: 'high',
        text: 'Мало часу до пенсії - збільшіть інвестиції та розгляньте зниження ризиків'
      });
    }
    
    if (lifestyleType === 'luxury') {
      recommendations.push({
        priority: 'medium',
        text: 'Розкішний стиль життя вимагає значних накопичень - розгляньте часткову зайнятість на пенсії'
      });
    }
    
    recommendations.push({
      priority: 'low',
      text: 'Диверсифікуйте інвестиції між українськими та іноземними активами'
    });
    
    recommendations.push({
      priority: 'medium',
      text: 'Розгляньте страхування життя та медичне страхування для захисту від ризиків'
    });
    
    return recommendations;
  }

  function displayResults(calculation) {
    const gapStatus = calculation.savingsGap <= 0 ? 'success' : 
                     calculation.savingsGap < 1000000 ? 'warning' : 'danger';
    
    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🏖️ План пенсійного забезпечення</h3>
        
        <div class="retirement-summary">
          <h4>Загальний огляд плану</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Років до пенсії:</span>
              <span class="value">${calculation.yearsToRetirement}</span>
            </div>
            <div class="summary-item">
              <span class="label">Років на пенсії:</span>
              <span class="value">${calculation.yearsInRetirement}</span>
            </div>
            <div class="summary-item">
              <span class="label">Поточний дохід:</span>
              <span class="value">${calculation.currentIncome.toLocaleString()} грн/міс</span>
            </div>
            <div class="summary-item">
              <span class="label">Дохід на пенсії:</span>
              <span class="value">${calculation.totalRetirementIncome.toLocaleString()} грн/міс</span>
            </div>
            <div class="summary-item">
              <span class="label">Необхідний капітал:</span>
              <span class="value">${calculation.requiredCapital.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Прогноз накопичень:</span>
              <span class="value">${calculation.totalProjectedSavings.toLocaleString()} грн</span>
            </div>
            <div class="summary-item ${gapStatus}">
              <span class="label">Дефіцит/профіцит:</span>
              <span class="value">${calculation.savingsGap > 0 ? '-' : '+'}${Math.abs(calculation.savingsGap).toLocaleString()} грн</span>
            </div>
          </div>
        </div>

        <div class="insights-section">
          <h4>💡 Ключові показники</h4>
          <div class="insight-cards">
            <div class="insight-card ${gapStatus}">
              <h6>📊 Готовність до пенсії</h6>
              <div class="big-number">${calculation.savingsGap <= 0 ? '✅' : Math.round((calculation.totalProjectedSavings / calculation.requiredCapital) * 100) + '%'}</div>
              <p class="insight-detail">${calculation.savingsGap <= 0 ? 'Готові' : 'від необхідної суми'}</p>
            </div>
            <div class="insight-card">
              <span class="label">Рівень життя:</span>
              <div class="big-number">${calculation.affordability.versusAverage.toFixed(1)}x</div>
              <p class="insight-detail">до середньої зарплати</p>
            </div>
            <div class="insight-card ${calculation.additionalMonthlySavings > 0 ? 'warning' : 'success'}">
              <h6>💰 Додатково потрібно</h6>
              <div class="big-number">${calculation.additionalMonthlySavings > 0 ? calculation.additionalMonthlySavings.toLocaleString() : '0'}</div>
              <p class="insight-detail">грн/міс для досягнення мети</p>
            </div>
          </div>
        </div>

        ${createScenariosSection(calculation.scenarios)}
        ${createLifestyleAnalysisSection(calculation)}
        ${createRecommendationsSection(calculation.recommendations)}
        ${createActionPlanSection(calculation)}
      </div>
    `;

    createRetirementChart(calculation);
  }

  function createScenariosSection(scenarios) {
    return `
      <div class="scenarios-section">
        <h4>📈 Сценарії розвитку</h4>
        <div class="scenarios-grid">
          ${scenarios.map((scenario, index) => `
            <div class="scenario-card ${index === 1 ? 'highlighted' : ''}">
              <h6>${scenario.name}</h6>
              <p class="scenario-description">${scenario.description}</p>
              <div class="scenario-data">
                <div class="scenario-metric">
                  <span class="label">Накопичення:</span>
                  <span class="value">${scenario.projectedSavings.toLocaleString()} грн</span>
                </div>
                <div class="scenario-metric">
                  <span class="label">Місячний дохід:</span>
                  <span class="value">${scenario.monthlyIncome.toLocaleString()} грн</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function createLifestyleAnalysisSection(calculation) {
    const lifestyleNames = {
      'fire': 'FIRE (мінімалістичний)',
      'modest': 'Скромний',
      'comfortable': 'Комфортний',
      'luxury': 'Розкішний',
      'custom': 'Індивідуальний'
    };

    return `
      <div class="lifestyle-analysis">
        <h4>🎯 Аналіз стилю життя</h4>
        <div class="lifestyle-details">
          <h6>Обраний стиль: ${lifestyleNames[calculation.lifestyleType]}</h6>
          <div class="lifestyle-breakdown">
            <div class="breakdown-item">
              <span class="label">Базовий дохід на пенсії:</span>
              <span class="value">${calculation.baseRetirementIncome.toLocaleString()} грн/міс</span>
            </div>
            ${calculation.statePensionAmount > 0 ? `
            <div class="breakdown-item">
              <span class="label">Державна пенсія:</span>
              <span class="value">${calculation.statePensionAmount.toLocaleString()} грн/міс</span>
            </div>
            ` : ''}
            ${calculation.partTimeIncome > 0 ? `
            <div class="breakdown-item">
              <span class="label">Підробіток на пенсії:</span>
              <span class="value">${calculation.partTimeIncome.toLocaleString()} грн/міс</span>
            </div>
            ` : ''}
          </div>
          
          <div class="lifestyle-comparison">
            <h6>Порівняння зі стандартами:</h6>
            <p><strong>Мінімальна пенсія:</strong> ${(calculation.totalRetirementIncome / 2100).toFixed(1)}x від прожиткового мінімуму</p>
            <p><strong>Середня зарплата:</strong> ${calculation.affordability.versusAverage.toFixed(1)}x від середньої зарплати в країні</p>
          </div>
        </div>
      </div>
    `;
  }

  function createRecommendationsSection(recommendations) {
    const priorityColors = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'info'
    };

    return `
      <div class="recommendations-section">
        <h4>💡 Рекомендації</h4>
        <div class="recommendations-list">
          ${recommendations.map(rec => `
            <div class="recommendation-item ${priorityColors[rec.priority]}">
              <span class="priority-badge">${rec.priority === 'high' ? 'Важливо' : rec.priority === 'medium' ? 'Середньо' : 'Додатково'}</span>
              <p>${rec.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function createActionPlanSection(calculation) {
    const actions = [];
    
    if (calculation.additionalMonthlySavings > 0) {
      actions.push(`Збільшіть щомісячні інвестиції до ${(parseFloat(document.getElementById("monthly-savings").value) + calculation.additionalMonthlySavings).toLocaleString()} грн`);
    }
    
    actions.push('Диверсифікуйте портфель: 30% ОВДП, 40% українські акції, 30% міжнародні ETF');
    actions.push('Щорічно переглядайте та корегуйте інвестиційну стратегію');
    actions.push('Розгляньте страхування життя на суму не менше річного доходу');
    
    if (calculation.yearsToRetirement > 15) {
      actions.push('Почніть з агресивної стратегії, поступово знижуючи ризики');
    }

    return `
      <div class="action-plan-section">
        <h4>📋 План дій</h4>
        <ol class="action-list">
          ${actions.map(action => `<li>${action}</li>`).join('')}
        </ol>
        
        <div class="investment-allocation">
          <h6>🎯 Рекомендований розподіл активів:</h6>
          <div class="allocation-grid">
            ${calculation.currentAge < 40 ? `
            <div class="allocation-item">
              <span class="asset-type">Акції (українські та світові):</span>
              <span class="allocation-percent">60%</span>
            </div>
            <div class="allocation-item">
              <span class="asset-type">Облігації (ОВДП та корпоративні):</span>
              <span class="allocation-percent">30%</span>
            </div>
            <div class="allocation-item">
              <span class="asset-type">Альтернативи (нерухомість, золото):</span>
              <span class="allocation-percent">10%</span>
            </div>
            ` : calculation.currentAge < 55 ? `
            <div class="allocation-item">
              <span class="asset-type">Акції:</span>
              <span class="allocation-percent">45%</span>
            </div>
            <div class="allocation-item">
              <span class="asset-type">Облігації:</span>
              <span class="allocation-percent">45%</span>
            </div>
            <div class="allocation-item">
              <span class="asset-type">Готівка та альтернативи:</span>
              <span class="allocation-percent">10%</span>
            </div>
            ` : `
            <div class="allocation-item">
              <span class="asset-type">Акції:</span>
              <span class="allocation-percent">30%</span>
            </div>
            <div class="allocation-item">
              <span class="asset-type">Облігації:</span>
              <span class="allocation-percent">60%</span>
            </div>
            <div class="allocation-item">
              <span class="asset-type">Готівка:</span>
              <span class="allocation-percent">10%</span>
            </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  function createRetirementChart(calculation) {
    const chartBlock = document.getElementById('retirement-chart-block');
    if (!chartBlock) return;

    chartBlock.style.display = 'block';
    
    const ctx = document.getElementById('retirement-chart').getContext('2d');
    
    // Clear any existing chart
    if (window.retirementChart instanceof Chart) {
      window.retirementChart.destroy();
    }

    // Generate projection data
    const projectionYears = calculation.yearsToRetirement + calculation.yearsInRetirement;
    const labels = [];
    const savingsData = [];
    const incomeData = [];
    
    let currentSavings = parseFloat(document.getElementById("current-savings").value);
    const monthlySavings = parseFloat(document.getElementById("monthly-savings").value);
    const expectedReturn = parseFloat(document.getElementById("expected-return").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflation-rate").value) / 100;
    const realReturn = expectedReturn - inflationRate;
    
    for (let year = 0; year <= projectionYears; year++) {
      const currentYear = new Date().getFullYear() + year;
      labels.push(currentYear);
      
      if (year < calculation.yearsToRetirement) {
        // Accumulation phase
        currentSavings = currentSavings * (1 + realReturn) + monthlySavings * 12;
        savingsData.push(currentSavings);
        incomeData.push(0);
      } else {
        // Withdrawal phase
        const withdrawalAmount = calculation.totalRetirementIncome * 12;
        currentSavings = currentSavings * (1 + realReturn) - withdrawalAmount;
        savingsData.push(Math.max(0, currentSavings));
        incomeData.push(withdrawalAmount);
      }
    }

    window.retirementChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Накопичення (грн)',
          data: savingsData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
          yAxisID: 'y'
        }, {
          label: 'Річні витрати (грн)',
          data: incomeData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.1,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Прогноз накопичення та витрат на пенсії'
          },
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Накопичення (грн)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Річні витрати (грн)'
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Рік'
            }
          }
        },
        elements: {
          point: {
            radius: 1
          }
        }
      }
    });
  }
});