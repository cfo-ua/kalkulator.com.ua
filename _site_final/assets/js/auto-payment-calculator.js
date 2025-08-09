document.getElementById("auto-payment-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const carPrice = parseFloat(document.getElementById("carPrice").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const tradeInValue = parseFloat(document.getElementById("tradeInValue").value) || 0;
  const carAge = document.getElementById("carAge").value;
  const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const loanTerm = parseInt(document.getElementById("loanTerm").value) || 3;
  const processingFee = parseFloat(document.getElementById("processingFee").value) || 0;
  const monthlyFee = parseFloat(document.getElementById("monthlyFee").value) || 0;
  const kaskoRate = parseFloat(document.getElementById("kaskoRate").value) || 0;
  const osago = parseFloat(document.getElementById("osago").value) || 0;
  const lifeInsurance = parseFloat(document.getElementById("lifeInsurance").value) || 0;
  const maintenance = parseFloat(document.getElementById("maintenance").value) || 0;
  const includeInsurance = document.getElementById("includeInsurance").checked;

  // Розрахунок ефективної суми кредиту
  const effectiveDownPayment = downPayment + tradeInValue;
  const loanAmount = carPrice - effectiveDownPayment;
  const downPaymentPercent = (effectiveDownPayment / carPrice) * 100;
  
  if (loanAmount <= 0) {
    document.getElementById("auto-payment-result").innerHTML = 
      '<p style="color: red;">Сума первинного внеску та trade-in не може перевищувати вартість автомобіля.</p>';
    return;
  }

  if (carPrice < 50000) {
    document.getElementById("auto-payment-result").innerHTML = 
      '<p style="color: red;">Мінімальна вартість автомобіля для кредитування — 50,000 грн.</p>';
    return;
  }

  // Розрахунок комісії за оформлення
  const processingFeeAmount = loanAmount * processingFee / 100;
  
  // Розрахунок щомісячного платежу
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;
  
  const monthlyLoanPayment = monthlyRate > 0 ? 
    loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1) : 
    loanAmount / totalPayments;

  // Розрахунок страхування
  const yearlyKasko = carPrice * kaskoRate / 100;
  const monthlyKasko = yearlyKasko / 12;
  const monthlyOsago = osago / 12;
  const monthlyLifeInsurance = lifeInsurance / 12;
  
  const totalInsurance = monthlyKasko + monthlyOsago + monthlyLifeInsurance;
  const totalMonthlyPayment = monthlyLoanPayment + monthlyFee + (includeInsurance ? totalInsurance : 0);
  
  // Загальна переплата
  const totalInterest = (monthlyLoanPayment * totalPayments) - loanAmount;
  const totalFees = processingFeeAmount + (monthlyFee * totalPayments);
  const totalInsuranceCost = totalInsurance * totalPayments;
  
  // Загальна вартість автомобіля
  const totalCost = carPrice + totalInterest + totalFees + (includeInsurance ? totalInsuranceCost : 0);
  
  // Оцінка ризиків та рекомендацій
  const riskAssessment = assessAutoLoanRisk(carAge, downPaymentPercent, loanTerm, interestRate);
  
  // Генерація даних для амортизації
  const amortizationData = generateAutoAmortization(loanAmount, monthlyRate, monthlyLoanPayment, totalPayments);

  const resultHTML = `
    <div class="calculation-results">
      <h3>🚗 Результати розрахунку автокредиту</h3>
      
      <div class="results-grid">
        <div class="result-section">
          <h4>🚙 Параметри авто та кредиту</h4>
          <div class="result-item">
            <span class="label">Вартість автомобіля:</span>
            <span class="value">${formatNumber(carPrice)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Первинний внесок:</span>
            <span class="value">${formatNumber(effectiveDownPayment)} грн (${downPaymentPercent.toFixed(1)}%)</span>
          </div>
          ${tradeInValue > 0 ? `
          <div class="result-item">
            <span class="label">Trade-in:</span>
            <span class="value">${formatNumber(tradeInValue)} грн</span>
          </div>
          ` : ''}
          <div class="result-item">
            <span class="label">Сума кредиту:</span>
            <span class="value">${formatNumber(loanAmount)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Термін кредиту:</span>
            <span class="value">${loanTerm} років (${totalPayments} місяців)</span>
          </div>
          <div class="result-item">
            <span class="label">Процентна ставка:</span>
            <span class="value">${interestRate}% річних</span>
          </div>
        </div>
        
        <div class="result-section">
          <h4>💰 Щомісячні платежі</h4>
          <div class="result-item highlight">
            <span class="label">Кредитний платіж:</span>
            <span class="value">${formatNumber(monthlyLoanPayment)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Комісія банку:</span>
            <span class="value">${formatNumber(monthlyFee)} грн</span>
          </div>
          ${includeInsurance ? `
          <div class="result-item">
            <span class="label">КАСКО:</span>
            <span class="value">${formatNumber(monthlyKasko)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">ОСАЦВ:</span>
            <span class="value">${formatNumber(monthlyOsago)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Страхування життя:</span>
            <span class="value">${formatNumber(monthlyLifeInsurance)} грн</span>
          </div>
          ` : ''}
          <div class="result-item highlight-total">
            <span class="label"><strong>Загальний щомісячний платіж:</strong></span>
            <span class="value"><strong>${formatNumber(totalMonthlyPayment)} грн</strong></span>
          </div>
        </div>
        
        <div class="result-section">
          <h4>💸 Загальні витрати</h4>
          <div class="result-item">
            <span class="label">Переплата по кредиту:</span>
            <span class="value">${formatNumber(totalInterest)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Комісія за оформлення:</span>
            <span class="value">${formatNumber(processingFeeAmount)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Банківські комісії:</span>
            <span class="value">${formatNumber(monthlyFee * totalPayments)} грн</span>
          </div>
          ${includeInsurance ? `
          <div class="result-item">
            <span class="label">Страхування:</span>
            <span class="value">${formatNumber(totalInsuranceCost)} грн</span>
          </div>
          ` : ''}
          <div class="result-item highlight-total">
            <span class="label"><strong>Загальна вартість авто:</strong></span>
            <span class="value"><strong>${formatNumber(totalCost)} грн</strong></span>
          </div>
        </div>
        
        <div class="result-section ${riskAssessment.riskClass}">
          <h4>⚠️ Оцінка ризиків</h4>
          <div class="risk-level">
            <span class="label">Рівень ризику:</span>
            <span class="value"><strong>${riskAssessment.riskLevel}</strong></span>
          </div>
          <p>${riskAssessment.description}</p>
        </div>
      </div>
      
      <div class="recommendations-section">
        <h4>💡 Рекомендації</h4>
        <ul>
          ${riskAssessment.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
      
      <div class="info-section">
        <h4>ℹ️ Додаткові витрати на утримання авто</h4>
        <ul>
          <li><strong>Технічне обслуговування:</strong> ${formatNumber(maintenance)} грн/місяць</li>
          <li><strong>Паливо:</strong> Залежить від пробігу (орієнтовно 3,000-8,000 грн/місяць)</li>
          <li><strong>Парковка:</strong> 500-3,000 грн/місяць (залежно від міста)</li>
          <li><strong>Штрафи та податки:</strong> Транспортний податок, штрафи ДАІ</li>
          <li><strong>Загальні витрати:</strong> Приблизно ${formatNumber(totalMonthlyPayment + maintenance + 4000)} грн/місяць</li>
        </ul>
      </div>
    </div>
  `;

  document.getElementById("auto-payment-result").innerHTML = resultHTML;
  
  // Показати графік та таблицю
  displayAutoChart(monthlyLoanPayment, monthlyFee, totalInsurance, maintenance);
  displayAutoAmortizationTable(amortizationData.slice(0, 12));
});

function assessAutoLoanRisk(carAge, downPaymentPercent, loanTerm, interestRate) {
  let riskScore = 0;
  let recommendations = [];
  
  // Оцінка ризику по віку авто
  if (carAge === 'new') {
    riskScore += 0;
  } else if (carAge === '1-3') {
    riskScore += 1;
  } else if (carAge === '3-5') {
    riskScore += 2;
  } else if (carAge === '5-7') {
    riskScore += 3;
    recommendations.push("Б/У авто 5-7 років може потребувати більших витрат на ремонт");
  } else {
    riskScore += 4;
    recommendations.push("Старі автомобілі мають високий ризик поломок та швидкої знецінки");
  }
  
  // Оцінка первинного внеску
  if (downPaymentPercent < 20) {
    riskScore += 3;
    recommendations.push("Низький первинний внесок збільшує ризик 'негативного капіталу'");
  } else if (downPaymentPercent < 30) {
    riskScore += 1;
  }
  
  // Оцінка терміну кредиту
  if (loanTerm > 5) {
    riskScore += 2;
    recommendations.push("Довгий термін кредиту збільшує загальну переплату");
  }
  
  // Оцінка процентної ставки
  if (interestRate > 30) {
    riskScore += 3;
    recommendations.push("Висока процентна ставка — розгляньте інші пропозиції банків");
  } else if (interestRate > 25) {
    riskScore += 1;
  }
  
  // Загальні рекомендації
  recommendations.push("Порівняйте пропозиції кількох банків перед остаточним рішенням");
  recommendations.push("Врахуйте витрати на технічне обслуговування та ремонт");
  
  if (downPaymentPercent < 50 && carAge !== 'new') {
    recommendations.push("Розгляньте збільшення первинного внеску для кращих умов");
  }
  
  // Визначення рівня ризику
  let riskLevel, riskClass, description;
  
  if (riskScore <= 2) {
    riskLevel = "Низький";
    riskClass = "low-risk";
    description = "Хороші умови кредитування з мінімальними ризиками.";
  } else if (riskScore <= 5) {
    riskLevel = "Помірний";
    riskClass = "medium-risk";
    description = "Прийнятні умови, але варто уважно оцінити всі витрати.";
  } else if (riskScore <= 8) {
    riskLevel = "Високий";
    riskClass = "high-risk";
    description = "Високий ризик. Рекомендується розглянути альтернативні варіанти.";
  } else {
    riskLevel = "Критичний";
    riskClass = "critical-risk";
    description = "Дуже ризикові умови. Не рекомендується до укладання.";
  }
  
  return {
    riskLevel,
    riskClass,
    description,
    recommendations
  };
}

function generateAutoAmortization(loanAmount, monthlyRate, monthlyPayment, totalPayments) {
  let balance = loanAmount;
  let amortizationData = [];
  
  for (let month = 1; month <= totalPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    amortizationData.push({
      month: month,
      principal: principalPayment,
      interest: interestPayment,
      payment: monthlyPayment,
      balance: Math.max(0, balance)
    });
    
    if (balance <= 0) break;
  }
  
  return amortizationData;
}

function displayAutoChart(loanPayment, fees, insurance, maintenance) {
  const chartBlock = document.getElementById("auto-payment-chart-block");
  const canvas = document.getElementById("auto-payment-chart");
  
  chartBlock.style.display = "block";
  
  // Ensure Chart.js is loaded before creating chart
  ensureChartJs(() => {
    const ctx = canvas.getContext("2d");
    
    // Очистити попередній графік
    if (window.autoPaymentChart) {
      window.autoPaymentChart.destroy();
    }
    
    window.autoPaymentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'Кредитний платіж',
        'Банківські комісії',
        'Страхування',
        'Технічне обслуговування'
      ],
      datasets: [{
        data: [loanPayment, fees, insurance, maintenance],
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
              const total = loanPayment + fees + insurance + maintenance;
              const percentage = ((value / total) * 100).toFixed(1);
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
  });
}

// Dynamic loader for Chart.js
function ensureChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.body.appendChild(script);
}

function displayAutoAmortizationTable(amortizationData) {
  const tableContainer = document.getElementById("auto-amortization-table");
  const tableBody = document.getElementById("auto-amortization-body");
  
  tableContainer.style.display = "block";
  tableBody.innerHTML = "";
  
  amortizationData.forEach(payment => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${payment.month}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">${formatNumber(payment.principal)} грн</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">${formatNumber(payment.interest)} грн</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">${formatNumber(payment.payment)} грн</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">${formatNumber(payment.balance)} грн</td>
    `;
    tableBody.appendChild(row);
  });
}

function formatNumber(num) {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(num));
}

// Автоматично оновити відсоток первинного внеску
document.getElementById("carPrice").addEventListener("input", updateDownPaymentPercent);
document.getElementById("downPayment").addEventListener("input", updateDownPaymentPercent);
document.getElementById("tradeInValue").addEventListener("input", updateDownPaymentPercent);

function updateDownPaymentPercent() {
  const carPrice = parseFloat(document.getElementById("carPrice").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const tradeInValue = parseFloat(document.getElementById("tradeInValue").value) || 0;
  
  if (carPrice > 0) {
    const totalDown = downPayment + tradeInValue;
    const percent = (totalDown / carPrice * 100).toFixed(1);
    const label = document.querySelector('label[for="downPayment"]');
    label.textContent = `Первинний внесок (${percent}% разом з trade-in)`;
  }
}