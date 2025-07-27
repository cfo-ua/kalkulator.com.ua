document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("debt-payoff-form");
  const resultDiv = document.getElementById("debt-payoff-result");
  const addDebtBtn = document.getElementById("add-debt");
  const removeDebtBtn = document.getElementById("remove-debt");
  const debtList = document.getElementById("debt-list");
  
  let debtCount = 1;

  // Add debt functionality
  addDebtBtn.addEventListener("click", function() {
    if (debtCount < 10) { // Limit to 10 debts
      debtCount++;
      const newDebt = createDebtItem(debtCount);
      debtList.appendChild(newDebt);
    }
  });

  // Remove debt functionality
  removeDebtBtn.addEventListener("click", function() {
    if (debtCount > 1) {
      const lastDebt = debtList.querySelector(`[data-debt="${debtCount}"]`);
      if (lastDebt) {
        lastDebt.remove();
        debtCount--;
      }
    }
  });

  function createDebtItem(number) {
    const div = document.createElement('div');
    div.className = 'debt-item';
    div.setAttribute('data-debt', number);
    div.innerHTML = `
      <h4>Борг №${number}</h4>
      <label for="debt${number}-name">Назва боргу:</label>
      <input type="text" id="debt${number}-name" value="Борг ${number}" required>
      
      <label for="debt${number}-balance">Поточний баланс (грн):</label>
      <input type="number" id="debt${number}-balance" min="0" step="0.01" value="75000" required>
      
      <label for="debt${number}-rate">Річна процентна ставка (%):</label>
      <input type="number" id="debt${number}-rate" min="0" max="100" step="0.01" value="25" required>
      
      <label for="debt${number}-minimum">Мінімальний платіж (грн):</label>
      <input type="number" id="debt${number}-minimum" min="0" step="0.01" value="2000" required>
    `;
    return div;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateDebtPayoff();
  });

  function calculateDebtPayoff() {
    // Collect debt data
    const debts = [];
    for (let i = 1; i <= debtCount; i++) {
      const name = document.getElementById(`debt${i}-name`)?.value || `Борг ${i}`;
      const balance = parseFloat(document.getElementById(`debt${i}-balance`)?.value) || 0;
      const rate = parseFloat(document.getElementById(`debt${i}-rate`)?.value) / 100 || 0;
      const minimum = parseFloat(document.getElementById(`debt${i}-minimum`)?.value) || 0;
      
      if (balance > 0) {
        debts.push({
          id: i,
          name: name,
          balance: balance,
          rate: rate,
          minimum: minimum,
          originalBalance: balance
        });
      }
    }

    const extraPayment = parseFloat(document.getElementById("extra-payment").value) || 0;
    const showTimeline = document.getElementById("show-timeline").checked;
    const showMotivation = document.getElementById("show-motivation").checked;
    const showHybrid = document.getElementById("show-hybrid").checked;

    if (debts.length === 0) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, введіть принаймні один борг з позитивним балансом.</p>';
      return;
    }

    // Calculate total minimum payment
    const totalMinimums = debts.reduce((sum, debt) => sum + debt.minimum, 0);
    const totalAvailable = totalMinimums + extraPayment;

    // Calculate snowball strategy
    const snowballResult = calculateStrategy(debts, totalAvailable, 'snowball');
    
    // Calculate avalanche strategy  
    const avalancheResult = calculateStrategy(debts, totalAvailable, 'avalanche');

    // Calculate hybrid strategies if requested
    let hybridResults = [];
    if (showHybrid) {
      hybridResults = calculateHybridStrategies(debts, totalAvailable);
    }

    displayResults({
      debts,
      extraPayment,
      totalAvailable,
      snowball: snowballResult,
      avalanche: avalancheResult,
      hybrid: hybridResults,
      showTimeline,
      showMotivation,
      showHybrid
    });
  }

  function calculateStrategy(debts, totalPayment, strategy) {
    // Create deep copy of debts
    const debtsCopy = debts.map(debt => ({...debt}));
    let month = 0;
    let totalInterestPaid = 0;
    const payoffOrder = [];
    const monthlyBreakdown = [];

    while (debtsCopy.some(debt => debt.balance > 0) && month < 600) { // 50 year max
      month++;
      let remainingPayment = totalPayment;
      let monthlyInterest = 0;

      // Calculate interest for all debts
      debtsCopy.forEach(debt => {
        if (debt.balance > 0) {
          const monthlyInterestAmount = debt.balance * (debt.rate / 12);
          debt.balance += monthlyInterestAmount;
          monthlyInterest += monthlyInterestAmount;
          totalInterestPaid += monthlyInterestAmount;
        }
      });

      // Sort debts based on strategy
      let sortedDebts;
      if (strategy === 'snowball') {
        sortedDebts = debtsCopy.filter(d => d.balance > 0).sort((a, b) => a.balance - b.balance);
      } else { // avalanche
        sortedDebts = debtsCopy.filter(d => d.balance > 0).sort((a, b) => b.rate - a.rate);
      }

      // Pay minimums first
      sortedDebts.forEach(debt => {
        if (debt.balance > 0 && remainingPayment > 0) {
          const minimumPayment = Math.min(debt.minimum, debt.balance, remainingPayment);
          debt.balance -= minimumPayment;
          remainingPayment -= minimumPayment;
        }
      });

      // Apply extra payment to target debt
      if (remainingPayment > 0 && sortedDebts.length > 0) {
        const targetDebt = sortedDebts[0];
        const extraToTarget = Math.min(remainingPayment, targetDebt.balance);
        targetDebt.balance -= extraToTarget;
        remainingPayment -= extraToTarget;
      }

      // Check for paid off debts
      debtsCopy.forEach(debt => {
        if (debt.balance <= 0.01 && debt.balance > -0.01 && !payoffOrder.find(p => p.id === debt.id)) {
          payoffOrder.push({
            id: debt.id,
            name: debt.name,
            month: month,
            originalBalance: debt.originalBalance
          });
          debt.balance = 0;
        }
      });

      // Store monthly breakdown
      if (monthlyBreakdown.length < 60) { // Store first 5 years for timeline
        monthlyBreakdown.push({
          month: month,
          totalBalance: debtsCopy.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0),
          monthlyInterest: monthlyInterest,
          debts: debtsCopy.map(debt => ({
            name: debt.name,
            balance: Math.max(0, debt.balance)
          }))
        });
      }
    }

    return {
      months: month,
      years: (month / 12).toFixed(1),
      totalInterest: totalInterestPaid,
      payoffOrder: payoffOrder,
      monthlyBreakdown: monthlyBreakdown
    };
  }

  function calculateHybridStrategies(debts, totalPayment) {
    const strategies = [];
    
    // Strategy 1: Small debts first (under 30000 UAH), then avalanche
    const hybrid1 = calculateHybridStrategy(debts, totalPayment, 'small-first-avalanche', 30000);
    strategies.push({
      name: "Спочатку малі борги (до 30,000 грн), потім лавина",
      description: "Погасіть борги менше 30,000 грн, потім найвищі відсотки",
      ...hybrid1
    });

    // Strategy 2: High-rate debts first (over 30%), then snowball
    const hybrid2 = calculateHybridStrategy(debts, totalPayment, 'high-rate-first', 0.30);
    strategies.push({
      name: "Спочатку високі ставки (30%+), потім сніжний ком",
      description: "Погасіть борги з відсотками понад 30%, потім найменші баланси",
      ...hybrid2
    });

    return strategies;
  }

  function calculateHybridStrategy(debts, totalPayment, type, threshold) {
    const debtsCopy = debts.map(debt => ({...debt}));
    let month = 0;
    let totalInterestPaid = 0;
    const payoffOrder = [];
    let phase = 1; // Track which phase we're in

    while (debtsCopy.some(debt => debt.balance > 0) && month < 600) {
      month++;
      let remainingPayment = totalPayment;
      let monthlyInterest = 0;

      // Calculate interest
      debtsCopy.forEach(debt => {
        if (debt.balance > 0) {
          const monthlyInterestAmount = debt.balance * (debt.rate / 12);
          debt.balance += monthlyInterestAmount;
          monthlyInterest += monthlyInterestAmount;
          totalInterestPaid += monthlyInterestAmount;
        }
      });

      // Determine target debt based on hybrid strategy
      let targetDebt = null;
      const activeDebts = debtsCopy.filter(d => d.balance > 0);

      if (type === 'small-first-avalanche') {
        const smallDebts = activeDebts.filter(d => d.originalBalance < threshold);
        if (smallDebts.length > 0) {
          targetDebt = smallDebts.sort((a, b) => a.balance - b.balance)[0];
          phase = 1;
        } else {
          targetDebt = activeDebts.sort((a, b) => b.rate - a.rate)[0];
          phase = 2;
        }
      } else if (type === 'high-rate-first') {
        const highRateDebts = activeDebts.filter(d => d.rate > threshold);
        if (highRateDebts.length > 0) {
          targetDebt = highRateDebts.sort((a, b) => b.rate - a.rate)[0];
          phase = 1;
        } else {
          targetDebt = activeDebts.sort((a, b) => a.balance - b.balance)[0];
          phase = 2;
        }
      }

      // Pay minimums
      activeDebts.forEach(debt => {
        if (remainingPayment > 0) {
          const minimumPayment = Math.min(debt.minimum, debt.balance, remainingPayment);
          debt.balance -= minimumPayment;
          remainingPayment -= minimumPayment;
        }
      });

      // Apply extra to target
      if (remainingPayment > 0 && targetDebt) {
        const extraToTarget = Math.min(remainingPayment, targetDebt.balance);
        targetDebt.balance -= extraToTarget;
      }

      // Check for payoffs
      debtsCopy.forEach(debt => {
        if (debt.balance <= 0.01 && debt.balance > -0.01 && !payoffOrder.find(p => p.id === debt.id)) {
          payoffOrder.push({
            id: debt.id,
            name: debt.name,
            month: month,
            originalBalance: debt.originalBalance
          });
          debt.balance = 0;
        }
      });
    }

    return {
      months: month,
      years: (month / 12).toFixed(1),
      totalInterest: totalInterestPaid,
      payoffOrder: payoffOrder
    };
  }

  function displayResults(data) {
    const {
      debts,
      extraPayment,
      totalAvailable,
      snowball,
      avalanche,
      hybrid,
      showTimeline,
      showMotivation,
      showHybrid
    } = data;

    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const interestSavings = snowball.totalInterest - avalanche.totalInterest;
    const timeSavings = snowball.months - avalanche.months;

    // Determine recommendation
    const recommendation = getRecommendation(snowball, avalanche, debts);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>💳 Аналіз стратегій погашення боргів</h3>
        
        <div class="debt-summary">
          <h4>Огляд ваших боргів</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Загальний борг:</span>
              <span class="value">${totalDebt.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Кількість боргів:</span>
              <span class="value">${debts.length}</span>
            </div>
            <div class="summary-item">
              <span class="label">Мінімальні платежі:</span>
              <span class="value">${(totalAvailable - extraPayment).toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Додатковий платіж:</span>
              <span class="value">${extraPayment.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Загальний щомісячний платіж:</span>
              <span class="value">${totalAvailable.toLocaleString()} грн</span>
            </div>
          </div>
        </div>

        <div class="strategy-comparison">
          <h4>📊 Порівняння стратегій</h4>
          <div class="comparison-visual">
            <div class="comparison-cards">
              <div class="method-card snowball">
                <div class="method-header">
                  <h5>❄️ Сніжний ком</h5>
                  <p class="method-subtitle">Спочатку найменший баланс</p>
                </div>
                <div class="method-stats">
                  <div class="stat-item">
                    <span class="stat-label">Час погашення</span>
                    <span class="stat-value">${snowball.years} років</span>
                    <span class="stat-detail">(${snowball.months} місяців)</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Загальні відсотки</span>
                    <span class="stat-value">${snowball.totalInterest.toLocaleString()} грн</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Загальна вартість</span>
                    <span class="stat-value">${(totalDebt + snowball.totalInterest).toLocaleString()} грн</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Перше погашення</span>
                    <span class="stat-value">Місяць ${snowball.payoffOrder[0]?.month || 'N/A'}</span>
                  </div>
                </div>
                <div class="method-benefits">
                  <h6>✅ Переваги:</h6>
                  <ul>
                    <li>Швидкі психологічні перемоги</li>
                    <li>Створює імпульс</li>
                    <li>Легше дотримуватися</li>
                    <li>Спрощує рішення</li>
                  </ul>
                </div>
              </div>
              
              <div class="method-card avalanche">
                <div class="method-header">
                  <h5>🏔️ Лавина</h5>
                  <p class="method-subtitle">Спочатку найвищі відсотки</p>
                </div>
                <div class="method-stats">
                  <div class="stat-item">
                    <span class="stat-label">Час погашення</span>
                    <span class="stat-value">${avalanche.years} років</span>
                    <span class="stat-detail">(${avalanche.months} місяців)</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Загальні відсотки</span>
                    <span class="stat-value">${avalanche.totalInterest.toLocaleString()} грн</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Загальна вартість</span>
                    <span class="stat-value">${(totalDebt + avalanche.totalInterest).toLocaleString()} грн</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Перше погашення</span>
                    <span class="stat-value">Місяць ${avalanche.payoffOrder[0]?.month || 'N/A'}</span>
                  </div>
                </div>
                <div class="method-benefits">
                  <h6>✅ Переваги:</h6>
                  <ul>
                    <li>Економить найбільше грошей</li>
                    <li>Математично оптимальний</li>
                    <li>Швидше загальне погашення</li>
                    <li>Максимальна економія на відсотках</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="insights-section">
          <h4>💡 Ключові висновки</h4>
          <div class="insight-cards">
            ${interestSavings > 0 ? `
            <div class="insight-card success">
              <h6>💰 Економія коштів (Лавина)</h6>
              <div class="big-number">${interestSavings.toLocaleString()} грн</div>
              <p class="insight-detail">Лавина економить ${interestSavings.toLocaleString()} грн відсотків порівняно зі сніжним комом</p>
            </div>
            ` : ''}
            ${timeSavings > 0 ? `
            <div class="insight-card info">
              <h6>⏰ Економія часу (Лавина)</h6>
              <div class="big-number">${timeSavings} міс.</div>
              <p class="insight-detail">Лавина швидше на ${timeSavings} місяців</p>
            </div>
            ` : ''}
            <div class="insight-card">
              <h6>🎯 Рекомендація</h6>
              <div class="big-number">${recommendation.method}</div>
              <p class="insight-detail">${recommendation.reason}</p>
            </div>
          </div>
        </div>

        ${showTimeline ? createTimelineSection(snowball, avalanche) : ''}
        ${showMotivation ? createMotivationSection(snowball, avalanche, debts) : ''}
        ${showHybrid && hybrid.length > 0 ? createHybridSection(hybrid) : ''}
      </div>
    `;

    // Show chart if available
    createDebtChart(snowball, avalanche);
  }

  function getRecommendation(snowball, avalanche, debts) {
    const interestSavings = snowball.totalInterest - avalanche.totalInterest;
    const timeSavings = snowball.months - avalanche.months;
    const savingsPercentage = (interestSavings / snowball.totalInterest) * 100;
    
    // Calculate interest rate spread
    const rates = debts.map(d => d.rate).sort((a, b) => b - a);
    const rateSpread = rates[0] - rates[rates.length - 1];
    
    // Calculate balance variation
    const balances = debts.map(d => d.balance).sort((a, b) => b - a);
    const balanceSpread = balances[0] / balances[balances.length - 1];

    if (savingsPercentage > 15 && rateSpread > 0.15) {
      return {
        method: "Лавина",
        reason: "Великі різниці в ставках роблять лавину найкращим вибором для економії коштів"
      };
    } else if (savingsPercentage < 5 && balanceSpread > 5) {
      return {
        method: "Сніжний ком",
        reason: "Різні розміри боргів та невелика економія роблять сніжний ком кращим для мотивації"
      };
    } else if (interestSavings > 0) {
      return {
        method: "Лавина",
        reason: "Лавина економить більше грошей при схожих термінах погашення"
      };
    } else {
      return {
        method: "На ваш вибір",
        reason: "Обидва методи дають схожі результати — обирайте той, що вам підходить"
      };
    }
  }

  function createTimelineSection(snowball, avalanche) {
    return `
      <div class="timeline-section">
        <h4>📅 Детальний план погашення</h4>
        <div class="timeline-comparison">
          <div class="timeline-method">
            <h5>❄️ Сніжний ком - Порядок погашення</h5>
            <ol class="payoff-order">
              ${snowball.payoffOrder.map(debt => `
                <li>
                  <strong>${debt.name}</strong> - Місяць ${debt.month}
                  <small>(Оригінальний баланс: ${debt.originalBalance.toLocaleString()} грн)</small>
                </li>
              `).join('')}
            </ol>
          </div>
          <div class="timeline-method">
            <h5>🏔️ Лавина - Порядок погашення</h5>
            <ol class="payoff-order">
              ${avalanche.payoffOrder.map(debt => `
                <li>
                  <strong>${debt.name}</strong> - Місяць ${debt.month}
                  <small>(Оригінальний баланс: ${debt.originalBalance.toLocaleString()} грн)</small>
                </li>
              `).join('')}
            </ol>
          </div>
        </div>
      </div>
    `;
  }

  function createMotivationSection(snowball, avalanche, debts) {
    const firstPayoffSnowball = snowball.payoffOrder[0]?.month || 0;
    const firstPayoffAvalanche = avalanche.payoffOrder[0]?.month || 0;
    const motivationDiff = firstPayoffAvalanche - firstPayoffSnowball;
    
    return `
      <div class="motivation-section">
        <h4>🧠 Психологічний аналіз</h4>
        <div class="motivation-grid">
          <div class="motivation-card">
            <h6>❄️ Мотиваційні переваги сніжного кома</h6>
            <ul>
              <li>Перша перемога через ${firstPayoffSnowball} місяців</li>
              <li>Зменшення кількості платежів кожного разу</li>
              <li>Відчуття прогресу з першого місяця</li>
              <li>Простіший для розуміння та виконання</li>
            </ul>
          </div>
          <div class="motivation-card">
            <h6>🏔️ Дисциплінарні переваги лавини</h6>
            <ul>
              <li>Максимальна математична ефективність</li>
              <li>Найбільша довгострокова економія</li>
              <li>Швидше загальне позбавлення від боргів</li>
              <li>Фокус на найдорожчих боргах</li>
            </ul>
          </div>
          ${motivationDiff > 6 ? `
          <div class="motivation-warning">
            <h6>⚠️ Увага</h6>
            <p>Лавина може бути на ${motivationDiff} місяців повільніше до першої перемоги. 
               Якщо вам потрібна швидка мотивація, розгляньте сніжний ком або гібридний підхід.</p>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function createHybridSection(hybrid) {
    return `
      <div class="hybrid-section">
        <h4>🔄 Гібридні стратегії</h4>
        <div class="hybrid-strategies">
          ${hybrid.map(strategy => `
            <div class="hybrid-strategy">
              <h6>${strategy.name}</h6>
              <p class="strategy-description">${strategy.description}</p>
              <div class="hybrid-stats">
                <span>Час: ${strategy.years} років</span>
                <span>Відсотки: ${strategy.totalInterest.toLocaleString()} грн</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function createDebtChart(snowball, avalanche) {
    const chartBlock = document.getElementById('debt-chart-block');
    if (!chartBlock) return;

    chartBlock.style.display = 'block';
    
    const ctx = document.getElementById('debt-chart').getContext('2d');
    
    // Clear any existing chart
    if (window.debtChart instanceof Chart) {
      window.debtChart.destroy();
    }

    const months = Math.max(snowball.months, avalanche.months);
    const labels = Array.from({length: Math.min(months, 60)}, (_, i) => `Місяць ${i + 1}`);
    
    const snowballData = snowball.monthlyBreakdown.map(item => item.totalBalance);
    const avalancheData = avalanche.monthlyBreakdown.map(item => item.totalBalance);

    window.debtChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Сніжний ком',
          data: snowballData,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          tension: 0.1
        }, {
          label: 'Лавина',
          data: avalancheData,
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Прогрес погашення боргів з часом'
          },
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Залишок боргу (грн)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Час (місяці)'
            }
          }
        }
      }
    });
  }
});