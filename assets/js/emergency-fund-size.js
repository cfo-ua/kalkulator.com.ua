document.getElementById("emergency-fund-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const housingCosts = parseFloat(document.getElementById("housingCosts").value) || 0;
  const foodCosts = parseFloat(document.getElementById("foodCosts").value) || 0;
  const transportCosts = parseFloat(document.getElementById("transportCosts").value) || 0;
  const healthCosts = parseFloat(document.getElementById("healthCosts").value) || 0;
  const debtPayments = parseFloat(document.getElementById("debtPayments").value) || 0;
  const otherExpenses = parseFloat(document.getElementById("otherExpenses").value) || 0;
  const employmentStatus = document.getElementById("employmentStatus").value;
  const incomeSourcesCount = parseInt(document.getElementById("incomeSourcesCount").value);
  const dependentsCount = parseInt(document.getElementById("dependentsCount").value);
  const healthStatus = document.getElementById("healthStatus").value;
  const monthlyIncome = parseFloat(document.getElementById("monthlyIncome").value) || 0;
  const currentSavings = parseFloat(document.getElementById("currentSavings").value) || 0;
  const monthlySavings = parseFloat(document.getElementById("monthlySavings").value) || 0;
  const riskTolerance = document.getElementById("riskTolerance").value;
  const hasInsurance = document.getElementById("hasInsurance").checked;
  const hasProperty = document.getElementById("hasProperty").checked;

  // Розрахунок загальних щомісячних витрат
  const totalMonthlyExpenses = housingCosts + foodCosts + transportCosts + healthCosts + debtPayments + otherExpenses;
  
  if (totalMonthlyExpenses <= 0) {
    document.getElementById("emergency-fund-result").innerHTML = 
      '<p style="color: red;">Будь ласка, вкажіть ваші щомісячні витрати.</p>';
    return;
  }

  // Базовий розрахунок кількості місяців
  let baseMonths = 6; // Стандартна рекомендація
  
  // Коригування на основі статусу зайнятості
  const employmentMultiplier = {
    'stable': 1.0,
    'unstable': 1.3,
    'freelance': 1.8,
    'seasonal': 2.0,
    'unemployed': 2.5
  };
  
  baseMonths *= employmentMultiplier[employmentStatus] || 1.0;
  
  // Коригування на основі кількості джерел доходу
  if (incomeSourcesCount === 1) {
    baseMonths *= 1.2;
  } else if (incomeSourcesCount === 2) {
    baseMonths *= 1.0;
  } else {
    baseMonths *= 0.8;
  }
  
  // Коригування на основі утриманців
  baseMonths += dependentsCount * 1.5;
  
  // Коригування на основі стану здоров'я
  const healthMultiplier = {
    'good': 1.0,
    'fair': 1.2,
    'poor': 1.5,
    'chronic': 1.8
  };
  
  baseMonths *= healthMultiplier[healthStatus] || 1.0;
  
  // Коригування на основі страхування
  if (!hasInsurance) {
    baseMonths += 1;
  }
  
  // Коригування на основі власності
  if (hasProperty) {
    baseMonths += 1; // Додаткові витрати на утримання
  }
  
  // Коригування для українських реалій (війна)
  baseMonths *= 1.2;
  
  // Округлення та обмеження
  const recommendedMonths = Math.min(Math.max(Math.round(baseMonths), 3), 18);
  const emergencyFundSize = totalMonthlyExpenses * recommendedMonths;
  
  // Розрахунок часу накопичення
  const currentShortfall = Math.max(0, emergencyFundSize - currentSavings);
  const monthsToSave = monthlySavings > 0 ? Math.ceil(currentShortfall / monthlySavings) : 0;
  
  // Розрахунок рівнів фонду
  const minimalFund = totalMonthlyExpenses * 3;
  const standardFund = totalMonthlyExpenses * 6;
  const optimalFund = emergencyFundSize;
  const maximalFund = totalMonthlyExpenses * 12;
  
  // Оцінка поточного стану
  const currentLevel = getCurrentLevel(currentSavings, minimalFund, standardFund, optimalFund, maximalFund);
  
  // Рекомендації по розміщенню коштів
  const allocationRecommendations = getAllocationRecommendations(emergencyFundSize, riskTolerance);
  
  // Стратегія накопичення
  const savingsStrategy = getSavingsStrategy(currentSavings, emergencyFundSize, monthlyIncome, monthlySavings);

  const resultHTML = `
    <div class="calculation-results">
      <h3>🛡️ Результати розрахунку резервного фонду</h3>
      
      <div class="results-grid">
        <div class="result-section">
          <h4>💰 Ваші щомісячні витрати</h4>
          <div class="result-item">
            <span class="label">Житло:</span>
            <span class="value">${formatNumber(housingCosts)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Харчування:</span>
            <span class="value">${formatNumber(foodCosts)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Транспорт:</span>
            <span class="value">${formatNumber(transportCosts)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Здоров'я:</span>
            <span class="value">${formatNumber(healthCosts)} грн</span>
          </div>
          ${debtPayments > 0 ? `
          <div class="result-item">
            <span class="label">Борги:</span>
            <span class="value">${formatNumber(debtPayments)} грн</span>
          </div>
          ` : ''}
          <div class="result-item">
            <span class="label">Інші витрати:</span>
            <span class="value">${formatNumber(otherExpenses)} грн</span>
          </div>
          <div class="result-item highlight-total">
            <span class="label"><strong>Загальні витрати:</strong></span>
            <span class="value"><strong>${formatNumber(totalMonthlyExpenses)} грн/місяць</strong></span>
          </div>
        </div>
        
        <div class="result-section highlight-section">
          <h4>🎯 Рекомендований розмір фонду</h4>
          <div class="result-item highlight-total">
            <span class="label"><strong>Оптимальний резервний фонд:</strong></span>
            <span class="value"><strong>${formatNumber(emergencyFundSize)} грн</strong></span>
          </div>
          <div class="result-item highlight">
            <span class="label">Кількість місяців покриття:</span>
            <span class="value">${recommendedMonths} місяців</span>
          </div>
          <div class="result-item">
            <span class="label">Поточні накопичення:</span>
            <span class="value">${formatNumber(currentSavings)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Потрібно накопичити:</span>
            <span class="value">${formatNumber(currentShortfall)} грн</span>
          </div>
          ${monthsToSave > 0 ? `
          <div class="result-item">
            <span class="label">Час накопичення:</span>
            <span class="value">${monthsToSave} місяців</span>
          </div>
          ` : ''}
        </div>
        
        <div class="result-section">
          <h4>📊 Рівні резервного фонду</h4>
          <div class="result-item">
            <span class="label">Мінімальний (3 місяці):</span>
            <span class="value">${formatNumber(minimalFund)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Стандартний (6 місяців):</span>
            <span class="value">${formatNumber(standardFund)} грн</span>
          </div>
          <div class="result-item highlight">
            <span class="label">Ваш оптимальний:</span>
            <span class="value">${formatNumber(optimalFund)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Максимальний (12 місяців):</span>
            <span class="value">${formatNumber(maximalFund)} грн</span>
          </div>
        </div>
        
        <div class="result-section ${currentLevel.class}">
          <h4>⚠️ Поточний стан</h4>
          <div class="status-level">
            <span class="label">Ваш рівень:</span>
            <span class="value"><strong>${currentLevel.level}</strong></span>
          </div>
          <p>${currentLevel.description}</p>
          <div class="result-item">
            <span class="label">Покриття витрат:</span>
            <span class="value">${(currentSavings / totalMonthlyExpenses).toFixed(1)} місяців</span>
          </div>
        </div>
      </div>
      
      <div class="allocation-section">
        <h4>🏦 Рекомендований розподіл коштів</h4>
        <div class="allocation-grid">
          ${allocationRecommendations.map(rec => `
          <div class="allocation-item">
            <div class="allocation-type">${rec.type}</div>
            <div class="allocation-amount">${formatNumber(rec.amount)} грн</div>
            <div class="allocation-percentage">${rec.percentage}%</div>
            <div class="allocation-description">${rec.description}</div>
          </div>
          `).join('')}
        </div>
      </div>
      
      <div class="strategy-section">
        <h4>📈 Стратегія накопичення</h4>
        <div class="strategy-steps">
          ${savingsStrategy.steps.map((step, index) => `
          <div class="strategy-step">
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
              <div class="step-title">${step.title}</div>
              <div class="step-description">${step.description}</div>
              <div class="step-amount">${step.amount}</div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
      
      <div class="info-section">
        <h4>💡 Важливі поради</h4>
        <ul>
          <li><strong>Автоматизація:</strong> Налаштуйте автоматичне перерахування ${formatNumber(monthlySavings)} грн щомісяця</li>
          <li><strong>Поступовість:</strong> Краще накопичувати поступово, ніж не накопичувати взагалі</li>
          <li><strong>Доступність:</strong> Кошти мають бути доступні протягом 1-3 днів</li>
          <li><strong>Безпека:</strong> Використовуйте тільки надійні банки з гарантією ФГВФО</li>
          <li><strong>Перегляд:</strong> Переглядайте розмір фонду кожні 6-12 місяців</li>
          <li><strong>Призначення:</strong> Використовуйте тільки для справжніх екстрених ситуацій</li>
        </ul>
      </div>
    </div>
  `;

  document.getElementById("emergency-fund-result").innerHTML = resultHTML;
  
  // Показати графік накопичення
  displayEmergencyFundChart(currentSavings, emergencyFundSize, monthlySavings, monthsToSave);
});

function getCurrentLevel(currentSavings, minimal, standard, optimal, maximal) {
  if (currentSavings < minimal) {
    return {
      level: "Критичний",
      class: "critical-level",
      description: "У вас недостатньо накопичень для фінансової безпеки. Необхідно терміново почати накопичення резервного фонду."
    };
  } else if (currentSavings < standard) {
    return {
      level: "Базовий",
      class: "basic-level",
      description: "У вас є мінімальний резерв, але його недостатньо для повної фінансової безпеки. Продовжуйте накопичення."
    };
  } else if (currentSavings < optimal) {
    return {
      level: "Достатній",
      class: "sufficient-level",
      description: "У вас хороший рівень фінансової безпеки. Допоповніть фонд до оптимального розміру з урахуванням ваших обставин."
    };
  } else if (currentSavings < maximal) {
    return {
      level: "Оптимальний",
      class: "optimal-level",
      description: "Відмінно! У вас достатній резервний фонд для вашої ситуації. Підтримуйте цей рівень."
    };
  } else {
    return {
      level: "Надлишковий",
      class: "excessive-level",
      description: "У вас більше коштів, ніж потрібно для резервного фонду. Розгляньте можливість інвестування частини коштів."
    };
  }
}

function getAllocationRecommendations(totalAmount, riskTolerance) {
  const allocations = [];
  
  if (riskTolerance === 'conservative') {
    allocations.push({
      type: "Поточний рахунок",
      amount: totalAmount * 0.2,
      percentage: 20,
      description: "Негайний доступ до коштів"
    });
    allocations.push({
      type: "Депозит (3-6 місяців)",
      amount: totalAmount * 0.5,
      percentage: 50,
      description: "Збереження з невеликим доходом"
    });
    allocations.push({
      type: "ОВДП",
      amount: totalAmount * 0.3,
      percentage: 30,
      description: "Державна гарантія + дохід"
    });
  } else if (riskTolerance === 'moderate') {
    allocations.push({
      type: "Поточний рахунок",
      amount: totalAmount * 0.15,
      percentage: 15,
      description: "Негайний доступ"
    });
    allocations.push({
      type: "Депозити",
      amount: totalAmount * 0.4,
      percentage: 40,
      description: "Стабільний дохід"
    });
    allocations.push({
      type: "ОВДП",
      amount: totalAmount * 0.3,
      percentage: 30,
      description: "Державні облігації"
    });
    allocations.push({
      type: "Валюта",
      amount: totalAmount * 0.15,
      percentage: 15,
      description: "Захист від інфляції"
    });
  } else {
    allocations.push({
      type: "Поточний рахунок",
      amount: totalAmount * 0.1,
      percentage: 10,
      description: "Мінімальна готівка"
    });
    allocations.push({
      type: "Депозити",
      amount: totalAmount * 0.3,
      percentage: 30,
      description: "Базова частина"
    });
    allocations.push({
      type: "ОВДП",
      amount: totalAmount * 0.25,
      percentage: 25,
      description: "Державні облігації"
    });
    allocations.push({
      type: "Валюта",
      amount: totalAmount * 0.35,
      percentage: 35,
      description: "Диверсифікація ризиків"
    });
  }
  
  return allocations;
}

function getSavingsStrategy(currentSavings, targetAmount, monthlyIncome, monthlySavings) {
  const shortfall = targetAmount - currentSavings;
  const steps = [];
  
  if (shortfall <= 0) {
    steps.push({
      title: "Підтримання фонду",
      description: "Ваш резервний фонд вже сформований. Регулярно переглядайте його розмір при зміні витрат.",
      amount: "Поточний розмір достатній"
    });
  } else {
    // Етап 1: Перший місяць витрат
    const firstGoal = Math.min(shortfall, targetAmount * 0.2);
    steps.push({
      title: "Етап 1: Перша подушка безпеки",
      description: "Накопичіть суму для покриття 1-2 місяців витрат як пріоритет",
      amount: formatNumber(firstGoal) + " грн"
    });
    
    // Етап 2: Половина цільової суми
    if (shortfall > firstGoal) {
      const secondGoal = Math.min(shortfall - firstGoal, targetAmount * 0.3);
      steps.push({
        title: "Етап 2: Розширення фонду",
        description: "Доведіть фонд до половини цільової суми",
        amount: formatNumber(secondGoal) + " грн"
      });
    }
    
    // Етап 3: Повна сума
    if (shortfall > firstGoal + (targetAmount * 0.3)) {
      const thirdGoal = shortfall - firstGoal - (targetAmount * 0.3);
      steps.push({
        title: "Етап 3: Досягнення цілі",
        description: "Накопичіть повну цільову суму резервного фонду",
        amount: formatNumber(thirdGoal) + " грн"
      });
    }
  }
  
  // Поради по оптимізації
  if (monthlySavings < monthlyIncome * 0.1) {
    steps.push({
      title: "Оптимізація накопичень",
      description: "Спробуйте збільшити щомісячні накопичення до 10-15% від доходу",
      amount: formatNumber(monthlyIncome * 0.1) + " грн/місяць"
    });
  }
  
  return { steps };
}

function displayEmergencyFundChart(currentSavings, targetAmount, monthlySavings, monthsToSave) {
  const chartBlock = document.getElementById("emergency-fund-chart-block");
  const canvas = document.getElementById("emergency-fund-chart");
  const ctx = canvas.getContext("2d");
  
  chartBlock.style.display = "block";
  
  // Очистити попередній графік
  if (window.emergencyFundChart) {
    window.emergencyFundChart.destroy();
  }
  
  // Генерація даних для графіку накопичення
  const months = [];
  const savingsProgress = [];
  
  let currentAmount = currentSavings;
  
  for (let month = 0; month <= Math.min(monthsToSave + 6, 60); month++) {
    months.push(month === 0 ? 'Зараз' : `${month} міс`);
    savingsProgress.push(currentAmount);
    
    if (month > 0 && currentAmount < targetAmount) {
      currentAmount = Math.min(currentAmount + monthlySavings, targetAmount);
    }
  }
  
  window.emergencyFundChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Накопичення',
          data: savingsProgress,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 3,
          fill: true
        },
        {
          label: 'Ціль',
          data: Array(months.length).fill(targetAmount),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Сума (грн)'
          },
          ticks: {
            callback: function(value) {
              return formatNumber(value) + ' грн';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Час'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatNumber(context.parsed.y) + ' грн';
            }
          }
        },
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });
}

function formatNumber(num) {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(num));
}