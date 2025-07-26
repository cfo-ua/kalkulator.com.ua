document.getElementById("mortgage-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const loanTerm = parseInt(document.getElementById("loanTerm").value) || 20;
  const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const propertyInsurance = parseFloat(document.getElementById("propertyInsurance").value) || 0;
  const lifeInsurance = parseFloat(document.getElementById("lifeInsurance").value) || 0;
  const bankCommission = parseFloat(document.getElementById("bankCommission").value) || 0;
  const maintenanceFees = parseFloat(document.getElementById("maintenanceFees").value) || 0;
  const extraPayment = parseFloat(document.getElementById("extraPayment").value) || 0;
  const processingFee = parseFloat(document.getElementById("processingFee").value) || 0;
  const closingCosts = parseFloat(document.getElementById("closingCosts").value) || 0;
  const includeExtras = document.getElementById("includeExtras").checked;

  const loanAmount = homePrice - downPayment;
  const downPaymentPercent = (downPayment / homePrice) * 100;
  
  if (loanAmount <= 0) {
    document.getElementById("mortgage-result").innerHTML = 
      '<p style="color: red;">Первинний внесок не може бути більше або дорівнювати вартості нерухомості.</p>';
    return;
  }

  if (homePrice < 100000) {
    document.getElementById("mortgage-result").innerHTML = 
      '<p style="color: red;">Мінімальна вартість нерухомості — 100,000 грн.</p>';
    return;
  }

  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;

  // Розрахунок базового іпотечного платежу (основний борг + проценти)
  const monthlyPI = monthlyRate > 0 ? 
    loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1) : 
    loanAmount / totalPayments;

  // Розрахунок додаткових щомісячних витрат
  const monthlyPropertyInsurance = propertyInsurance / 12;
  const monthlyLifeInsurance = lifeInsurance / 12;

  const totalMonthlyPayment = monthlyPI + monthlyPropertyInsurance + monthlyLifeInsurance + bankCommission + maintenanceFees;
  const totalInterest = (monthlyPI * totalPayments) - loanAmount;
  const processingFeeAmount = loanAmount * processingFee / 100;
  const totalCost = homePrice + totalInterest + closingCosts + processingFeeAmount;

  // Розрахунок дострокового погашення
  let payoffCalculation = calculateEarlyPayoff(loanAmount, monthlyRate, monthlyPI, extraPayment);

  // Генерація даних для графіку амортизації
  let balance = loanAmount;
  let chartData = [];
  let amortizationData = [];
  
  for (let month = 1; month <= Math.min(totalPayments, 240); month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPI - interestPayment;
    balance -= principalPayment;
    
    chartData.push({
      month: month,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance)
    });
    
    // Зберегти перші 12 місяців для таблиці
    if (month <= 12) {
      amortizationData.push({
        month: month,
        principal: principalPayment,
        interest: interestPayment,
        total: monthlyPI,
        balance: Math.max(0, balance)
      });
    }
    
    if (balance <= 0) break;
  }

  // Форматування результатів
  const resultHTML = `
    <div class="calculation-results">
      <h3>📊 Результати розрахунку іпотеки</h3>
      
      <div class="results-grid">
        <div class="result-section">
          <h4>💰 Основні параметри</h4>
          <div class="result-item">
            <span class="label">Вартість нерухомості:</span>
            <span class="value">${formatNumber(homePrice)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Первинний внесок:</span>
            <span class="value">${formatNumber(downPayment)} грн (${downPaymentPercent.toFixed(1)}%)</span>
          </div>
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
          <h4>📅 Щомісячні платежі</h4>
          <div class="result-item highlight">
            <span class="label">Основний борг + проценти:</span>
            <span class="value">${formatNumber(monthlyPI)} грн</span>
          </div>
          ${includeExtras ? `
          <div class="result-item">
            <span class="label">Страхування нерухомості:</span>
            <span class="value">${formatNumber(monthlyPropertyInsurance)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Страхування життя:</span>
            <span class="value">${formatNumber(monthlyLifeInsurance)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Комісія банку:</span>
            <span class="value">${formatNumber(bankCommission)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Обслуговування:</span>
            <span class="value">${formatNumber(maintenanceFees)} грн</span>
          </div>
          <div class="result-item highlight-total">
            <span class="label"><strong>Загальний щомісячний платіж:</strong></span>
            <span class="value"><strong>${formatNumber(totalMonthlyPayment)} грн</strong></span>
          </div>
          ` : ''}
        </div>
        
        <div class="result-section">
          <h4>💸 Загальні витрати</h4>
          <div class="result-item">
            <span class="label">Загальна переплата:</span>
            <span class="value">${formatNumber(totalInterest)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Комісія за оформлення:</span>
            <span class="value">${formatNumber(processingFeeAmount)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Додаткові витрати:</span>
            <span class="value">${formatNumber(closingCosts)} грн</span>
          </div>
          <div class="result-item highlight-total">
            <span class="label"><strong>Загальна вартість житла:</strong></span>
            <span class="value"><strong>${formatNumber(totalCost)} грн</strong></span>
          </div>
        </div>
        
        ${extraPayment > 0 ? `
        <div class="result-section">
          <h4>⚡ Дострокове погашення</h4>
          <div class="result-item">
            <span class="label">Додатковий платіж:</span>
            <span class="value">${formatNumber(extraPayment)} грн/місяць</span>
          </div>
          <div class="result-item">
            <span class="label">Скорочення терміну:</span>
            <span class="value">${payoffCalculation.monthsSaved} місяців</span>
          </div>
          <div class="result-item">
            <span class="label">Економія на процентах:</span>
            <span class="value">${formatNumber(payoffCalculation.interestSaved)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Новий термін:</span>
            <span class="value">${Math.round(payoffCalculation.newTerm / 12)} років ${payoffCalculation.newTerm % 12} місяців</span>
          </div>
        </div>
        ` : ''}
      </div>
      
      <div class="info-section">
        <h4>ℹ️ Корисна інформація</h4>
        <ul>
          <li><strong>Співвідношення боргу до доходу:</strong> Рекомендується, щоб іпотечний платіж не перевищував 30-35% від вашого місячного доходу</li>
          <li><strong>Мінімальний дохід:</strong> Приблизно ${formatNumber(totalMonthlyPayment * 3)} грн на місяць для комфортного обслуговування кредиту</li>
          <li><strong>Переплата в відсотках:</strong> ${((totalInterest / loanAmount) * 100).toFixed(1)}% від суми кредиту</li>
          <li><strong>Ефективна ставка:</strong> З урахуванням всіх витрат — ${((totalCost - homePrice) / loanAmount / loanTerm * 100).toFixed(1)}% річних</li>
        </ul>
      </div>
    </div>
  `;

  document.getElementById("mortgage-result").innerHTML = resultHTML;
  
  // Показати графік та таблицю
  displayChart(chartData, loanTerm);
  displayAmortizationTable(amortizationData);
});

function calculateEarlyPayoff(loanAmount, monthlyRate, regularPayment, extraPayment) {
  if (extraPayment <= 0) {
    return { monthsSaved: 0, interestSaved: 0, newTerm: loanAmount / regularPayment };
  }
  
  let balance = loanAmount;
  let month = 0;
  let totalInterestWithExtra = 0;
  const totalPayment = regularPayment + extraPayment;
  
  while (balance > 0 && month < 600) { // максимум 50 років
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(totalPayment - interestPayment, balance);
    
    totalInterestWithExtra += interestPayment;
    balance -= principalPayment;
    month++;
    
    if (balance <= 0) break;
  }
  
  // Розрахунок без додаткових платежів
  const regularTermMonths = Math.ceil(Math.log(1 + (loanAmount * monthlyRate) / regularPayment) / Math.log(1 + monthlyRate));
  const totalInterestRegular = (regularPayment * regularTermMonths) - loanAmount;
  
  return {
    monthsSaved: regularTermMonths - month,
    interestSaved: totalInterestRegular - totalInterestWithExtra,
    newTerm: month
  };
}

function displayChart(chartData, termYears) {
  const chartBlock = document.getElementById("mortgage-chart-block");
  const canvas = document.getElementById("mortgage-chart");
  const ctx = canvas.getContext("2d");
  
  chartBlock.style.display = "block";
  
  // Очистити попередній графік
  if (window.mortgageChart) {
    window.mortgageChart.destroy();
  }
  
  const years = [];
  const principalData = [];
  const interestData = [];
  
  // Групувати дані по роках
  for (let year = 1; year <= termYears; year++) {
    years.push(`Рік ${year}`);
    const yearData = chartData.filter(d => d.month > (year-1)*12 && d.month <= year*12);
    const yearPrincipal = yearData.reduce((sum, d) => sum + d.principal, 0);
    const yearInterest = yearData.reduce((sum, d) => sum + d.interest, 0);
    
    principalData.push(yearPrincipal);
    interestData.push(yearInterest);
  }
  
  window.mortgageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Основний борг',
          data: principalData,
          backgroundColor: 'rgba(74, 144, 226, 0.8)',
          borderColor: 'rgba(74, 144, 226, 1)',
          borderWidth: 1
        },
        {
          label: 'Проценти',
          data: interestData,
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Роки'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Сума (грн)'
          },
          ticks: {
            callback: function(value) {
              return formatNumber(value) + ' грн';
            }
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

function displayAmortizationTable(amortizationData) {
  const tableContainer = document.getElementById("amortization-table");
  const tableBody = document.getElementById("amortization-body");
  
  tableContainer.style.display = "block";
  tableBody.innerHTML = "";
  
  amortizationData.forEach(payment => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${payment.month}</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">${formatNumber(payment.principal)} грн</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">${formatNumber(payment.interest)} грн</td>
      <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: right;">${formatNumber(payment.total)} грн</td>
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

// Автоматично оновити відсоток первинного внеску при зміні значень
document.getElementById("homePrice").addEventListener("input", updateDownPaymentPercent);
document.getElementById("downPayment").addEventListener("input", updateDownPaymentPercent);

function updateDownPaymentPercent() {
  const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  
  if (homePrice > 0) {
    const percent = (downPayment / homePrice * 100).toFixed(1);
    const label = document.querySelector('label[for="downPayment"]');
    label.textContent = `Первинний внесок (${percent}%)`;
  }
}