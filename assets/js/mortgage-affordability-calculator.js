document.getElementById("affordability-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const monthlySalary = parseFloat(document.getElementById("monthlySalary").value) || 0;
  const bonuses = parseFloat(document.getElementById("bonuses").value) || 0;
  const additionalIncome = parseFloat(document.getElementById("additionalIncome").value) || 0;
  const spouseSalary = parseFloat(document.getElementById("spouseSalary").value) || 0;
  const existingLoans = parseFloat(document.getElementById("existingLoans").value) || 0;
  const creditCards = parseFloat(document.getElementById("creditCards").value) || 0;
  const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value) || 0;
  const dependents = parseInt(document.getElementById("dependents").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const loanTerm = parseInt(document.getElementById("loanTerm").value) || 20;
  const dtiRatio = parseFloat(document.getElementById("dtiRatio").value) || 45;

  // Розрахунок загального доходу (бонуси враховуються на 70%)
  const totalMonthlyIncome = monthlySalary + (bonuses * 0.7) + additionalIncome + spouseSalary;
  
  // Розрахунок загальних зобов'язань
  const totalDebts = existingLoans + creditCards;
  
  // Додаткові витрати на утриманців (орієнтовно 3000 грн на дитину)
  const dependentsCost = dependents * 3000;
  const totalExpenses = monthlyExpenses + dependentsCost;
  
  // Доступний дохід для іпотеки
  const availableIncome = totalMonthlyIncome - totalDebts - totalExpenses;
  
  if (availableIncome <= 0) {
    document.getElementById("affordability-result").innerHTML = 
      '<p style="color: red;">Ваших доходів недостатньо для отримання іпотечного кредиту. Розгляньте можливість збільшення доходів або зменшення витрат.</p>';
    return;
  }
  
  // Максимальний щомісячний платіж за DTI
  const maxMonthlyPayment = (totalMonthlyIncome * dtiRatio) / 100;
  
  // Скоригований максимальний платіж
  const adjustedMaxPayment = Math.min(maxMonthlyPayment - totalDebts, availableIncome);
  
  if (adjustedMaxPayment <= 0) {
    document.getElementById("affordability-result").innerHTML = 
      '<p style="color: red;">Максимальний платіж за співвідношенням DTI не дозволяє отримати іпотеку. Зменшіть наявні борги або збільшіть доходи.</p>';
    return;
  }
  
  // Розрахунок максимальної суми кредиту
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;
  
  const maxLoanAmount = monthlyRate > 0 ? 
    adjustedMaxPayment * (Math.pow(1 + monthlyRate, totalPayments) - 1) / 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) :
    adjustedMaxPayment * totalPayments;
  
  // Максимальна вартість житла
  const maxHomePrice = maxLoanAmount + downPayment;
  
  // Розрахунок фактичного щомісячного платежу
  const actualMonthlyPayment = monthlyRate > 0 ? 
    maxLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1) : 
    maxLoanAmount / totalPayments;
  
  // Рівень фінансового навантаження
  const actualDTI = ((actualMonthlyPayment + totalDebts) / totalMonthlyIncome) * 100;
  
  // Приблизна площа житла (з розрахунку 35,000 грн/м² в середньому)
  const estimatedArea = maxHomePrice / 35000;
  
  // Оцінка ризиків
  const riskLevel = getRiskLevel(actualDTI, availableIncome, actualMonthlyPayment);
  
  // Рекомендації
  const recommendations = getRecommendations(actualDTI, downPayment, maxHomePrice, totalMonthlyIncome);

  const resultHTML = `
    <div class="calculation-results">
      <h3>🏠 Результати розрахунку доступної іпотеки</h3>
      
      <div class="results-grid">
        <div class="result-section">
          <h4>💰 Ваші доходи</h4>
          <div class="result-item">
            <span class="label">Загальний дохід:</span>
            <span class="value">${formatNumber(totalMonthlyIncome)} грн/місяць</span>
          </div>
          <div class="result-item">
            <span class="label">Наявні борги:</span>
            <span class="value">${formatNumber(totalDebts)} грн/місяць</span>
          </div>
          <div class="result-item">
            <span class="label">Щомісячні витрати:</span>
            <span class="value">${formatNumber(totalExpenses)} грн/місяць</span>
          </div>
          <div class="result-item">
            <span class="label">Доступно для іпотеки:</span>
            <span class="value">${formatNumber(availableIncome)} грн/місяць</span>
          </div>
        </div>
        
        <div class="result-section highlight-section">
          <h4>🎯 Максимальні можливості</h4>
          <div class="result-item highlight-total">
            <span class="label"><strong>Максимальна сума кредиту:</strong></span>
            <span class="value"><strong>${formatNumber(maxLoanAmount)} грн</strong></span>
          </div>
          <div class="result-item highlight-total">
            <span class="label"><strong>Максимальна вартість житла:</strong></span>
            <span class="value"><strong>${formatNumber(maxHomePrice)} грн</strong></span>
          </div>
          <div class="result-item">
            <span class="label">Щомісячний платіж:</span>
            <span class="value">${formatNumber(actualMonthlyPayment)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Приблизна площа:</span>
            <span class="value">${estimatedArea.toFixed(1)} м²</span>
          </div>
        </div>
        
        <div class="result-section">
          <h4>📊 Фінансові показники</h4>
          <div class="result-item">
            <span class="label">Співвідношення DTI:</span>
            <span class="value ${actualDTI > 45 ? 'warning' : ''}">${actualDTI.toFixed(1)}%</span>
          </div>
          <div class="result-item">
            <span class="label">Первинний внесок:</span>
            <span class="value">${formatNumber(downPayment)} грн (${((downPayment / maxHomePrice) * 100).toFixed(1)}%)</span>
          </div>
          <div class="result-item">
            <span class="label">Термін кредиту:</span>
            <span class="value">${loanTerm} років</span>
          </div>
          <div class="result-item">
            <span class="label">Процентна ставка:</span>
            <span class="value">${interestRate}% річних</span>
          </div>
        </div>
        
        <div class="result-section ${riskLevel.class}">
          <h4>⚠️ Оцінка ризиків</h4>
          <div class="risk-level">
            <span class="label">Рівень ризику:</span>
            <span class="value"><strong>${riskLevel.level}</strong></span>
          </div>
          <p>${riskLevel.description}</p>
        </div>
      </div>
      
      <div class="recommendations-section">
        <h4>💡 Рекомендації</h4>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
      
      <div class="info-section">
        <h4>ℹ️ Важлива інформація</h4>
        <ul>
          <li><strong>Попереднє схвалення:</strong> Отримайте pre-approval від банку перед пошуком житла</li>
          <li><strong>Додаткові витрати:</strong> Врахуйте комісії банку, страхування, нотаріуса (3-5% від суми)</li>
          <li><strong>Резерв коштів:</strong> Залишіть 3-6 місячних доходів як резерв на непередбачені витрати</li>
          <li><strong>Зростання цін:</strong> Ціни на житло можуть змінюватися, закладіть 5-10% запас</li>
        </ul>
      </div>
    </div>
  `;

  document.getElementById("affordability-result").innerHTML = resultHTML;
  
  // Показати графік
  displayAffordabilityChart(totalMonthlyIncome, totalDebts, totalExpenses, actualMonthlyPayment);
});

function getRiskLevel(dti, availableIncome, monthlyPayment) {
  if (dti <= 30) {
    return {
      level: "Низький",
      class: "low-risk",
      description: "Відмінний рівень фінансової стабільності. Ваші доходи дозволяють комфортно обслуговувати кредит."
    };
  } else if (dti <= 40) {
    return {
      level: "Помірний", 
      class: "medium-risk",
      description: "Прийнятний рівень навантаження. Рекомендується мати додатковий резерв коштів."
    };
  } else if (dti <= 50) {
    return {
      level: "Високий",
      class: "high-risk", 
      description: "Високе фінансове навантаження. Будь-які зміни в доходах можуть створити проблеми з виплатами."
    };
  } else {
    return {
      level: "Критичний",
      class: "critical-risk",
      description: "Надмірне фінансове навантаження. Рекомендується зменшити суму кредиту або збільшити доходи."
    };
  }
}

function getRecommendations(dti, downPayment, maxHomePrice, totalIncome) {
  const recommendations = [];
  
  if (dti > 40) {
    recommendations.push("Розгляньте можливість збільшення первинного внеску для зменшення суми кредиту");
    recommendations.push("Спробуйте збільшити термін кредиту для зменшення щомісячного платежу");
  }
  
  if (downPayment / maxHomePrice < 0.2) {
    recommendations.push("Накопичення більшого первинного внеску (20%+) покращить умови кредиту");
  }
  
  if (totalIncome < 40000) {
    recommendations.push("Розгляньте можливість залучення співпозичальника для збільшення кредитоспроможності");
  }
  
  recommendations.push("Порівняйте пропозиції різних банків - ставки можуть відрізнятися на 1-3%");
  recommendations.push("Розгляньте державні програми підтримки молодих сімей та інших категорій");
  recommendations.push("Врахуйте можливість зростання доходів у майбутньому при виборі терміну кредиту");
  
  return recommendations;
}

function displayAffordabilityChart(totalIncome, debts, expenses, mortgagePayment) {
  const chartBlock = document.getElementById("affordability-chart-block");
  const canvas = document.getElementById("affordability-chart");
  const ctx = canvas.getContext("2d");
  
  chartBlock.style.display = "block";
  
  // Очистити попередній графік
  if (window.affordabilityChart) {
    window.affordabilityChart.destroy();
  }
  
  const remaining = totalIncome - debts - expenses - mortgagePayment;
  
  window.affordabilityChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'Іпотечний платіж',
        'Наявні борги', 
        'Щомісячні витрати',
        'Залишається'
      ],
      datasets: [{
        data: [mortgagePayment, debts, expenses, Math.max(0, remaining)],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)', 
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)', 
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed;
              const percentage = ((value / totalIncome) * 100).toFixed(1);
              return context.label + ': ' + formatNumber(value) + ' грн (' + percentage + '%)';
            }
          }
        },
        legend: {
          display: true,
          position: 'bottom'
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