document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("student-loan-form");
  const resultDiv = document.getElementById("student-loan-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateStudentLoan();
  });

  function calculateStudentLoan() {
    // Get form data
    const loanAmount = parseFloat(document.getElementById("loan-amount").value) || 0;
    const interestRate = parseFloat(document.getElementById("interest-rate").value) / 100 || 0;
    const loanTermYears = parseInt(document.getElementById("loan-term").value) || 10;
    const loanType = document.getElementById("loan-type").value;
    const educationType = document.getElementById("education-type").value;
    const studyDuration = parseInt(document.getElementById("study-duration").value) || 2;
    const gracePeriodMonths = parseInt(document.getElementById("grace-period").value) || 6;
    const defermentOption = document.getElementById("deferment-option").value;
    const expectedSalary = parseFloat(document.getElementById("expected-salary").value) || 0;
    const currentIncome = parseFloat(document.getElementById("current-income").value) || 0;
    const workStudy = document.getElementById("work-study").checked;
    const scholarship = document.getElementById("scholarship").checked;
    const governmentBenefits = document.getElementById("government-benefits").checked;
    const originationFee = parseFloat(document.getElementById("origination-fee").value) / 100 || 0;
    const insuranceRate = parseFloat(document.getElementById("insurance-rate").value) / 100 || 0;
    const currency = document.getElementById("currency").value;
    const earlyPayment = document.getElementById("early-payment").value;

    if (loanAmount <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, введіть позитивну суму кредиту.</p>';
      return;
    }

    // Calculate fees
    const originationAmount = loanAmount * originationFee;
    const totalLoanAmount = loanAmount + originationAmount;
    const monthlyInsuranceCost = (totalLoanAmount * insuranceRate) / 12;

    // Calculate payment phases
    const studyMonths = studyDuration * 12;
    const totalTermMonths = loanTermYears * 12;
    const monthlyInterestRate = interestRate / 12;

    let calculation;

    if (defermentOption === 'full') {
      // Full deferment during study
      calculation = calculateWithFullDeferment(totalLoanAmount, monthlyInterestRate, studyMonths, gracePeriodMonths, totalTermMonths, monthlyInsuranceCost);
    } else if (defermentOption === 'interest-only') {
      // Interest-only payments during study
      calculation = calculateWithInterestOnly(totalLoanAmount, monthlyInterestRate, studyMonths, gracePeriodMonths, totalTermMonths, monthlyInsuranceCost);
    } else {
      // No deferment
      calculation = calculateWithoutDeferment(totalLoanAmount, monthlyInterestRate, totalTermMonths, monthlyInsuranceCost);
    }

    // Add additional calculations
    calculation.originalLoanAmount = loanAmount;
    calculation.originationFee = originationAmount;
    calculation.totalLoanAmount = totalLoanAmount;
    calculation.loanType = loanType;
    calculation.educationType = educationType;
    calculation.expectedSalary = expectedSalary;
    calculation.currency = currency;
    calculation.studyDuration = studyDuration;
    calculation.gracePeriodMonths = gracePeriodMonths;
    calculation.defermentOption = defermentOption;

    // Calculate affordability metrics
    calculation.affordability = calculateAffordability(calculation.monthlyPayment, expectedSalary, currentIncome);

    // Calculate ROI
    calculation.roi = calculateEducationROI(totalLoanAmount, calculation.totalInterest, expectedSalary, currentIncome);

    displayResults(calculation);
  }

  function calculateWithFullDeferment(loanAmount, monthlyRate, studyMonths, graceMonths, totalTermMonths, monthlyInsurance) {
    // During study: no payments, interest capitalizes
    let balance = loanAmount;
    for (let i = 0; i < studyMonths; i++) {
      balance += balance * monthlyRate;
    }

    // During grace period: no payments, interest continues to capitalize
    for (let i = 0; i < graceMonths; i++) {
      balance += balance * monthlyRate;
    }

    // Calculate remaining term after study and grace period
    const repaymentMonths = totalTermMonths - studyMonths - graceMonths;
    
    if (repaymentMonths <= 0) {
      return {
        monthlyPayment: 0,
        totalInterest: balance - loanAmount,
        totalPaid: balance,
        finalBalance: balance,
        repaymentMonths: 0,
        studyPhaseInterest: balance - loanAmount
      };
    }

    // Calculate monthly payment for remaining term
    const monthlyPayment = calculateMonthlyPayment(balance, monthlyRate, repaymentMonths) + monthlyInsurance;
    
    // Calculate total payments and interest
    const totalPayments = monthlyPayment * repaymentMonths;
    const totalInterest = totalPayments - loanAmount - (monthlyInsurance * repaymentMonths);

    return {
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalPaid: totalPayments,
      repaymentMonths: repaymentMonths,
      studyPhaseInterest: balance - loanAmount,
      repaymentPhaseBalance: balance
    };
  }

  function calculateWithInterestOnly(loanAmount, monthlyRate, studyMonths, graceMonths, totalTermMonths, monthlyInsurance) {
    // During study: interest-only payments
    const studyMonthlyPayment = loanAmount * monthlyRate + monthlyInsurance;
    const studyPhasePayments = studyMonthlyPayment * studyMonths;

    // During grace period: no payments, interest capitalizes
    let balance = loanAmount;
    for (let i = 0; i < graceMonths; i++) {
      balance += balance * monthlyRate;
    }

    // Calculate remaining term
    const repaymentMonths = totalTermMonths - studyMonths - graceMonths;
    
    if (repaymentMonths <= 0) {
      return {
        monthlyPayment: studyMonthlyPayment,
        totalInterest: studyPhasePayments - (monthlyInsurance * studyMonths) + (balance - loanAmount),
        totalPaid: studyPhasePayments + balance,
        repaymentMonths: 0,
        studyPhaseInterest: studyPhasePayments - (monthlyInsurance * studyMonths)
      };
    }

    // Calculate monthly payment for remaining term
    const repaymentMonthlyPayment = calculateMonthlyPayment(balance, monthlyRate, repaymentMonths) + monthlyInsurance;
    
    // Calculate totals
    const repaymentPhasePayments = repaymentMonthlyPayment * repaymentMonths;
    const totalPayments = studyPhasePayments + repaymentPhasePayments;
    const totalInterest = totalPayments - loanAmount - (monthlyInsurance * (studyMonths + repaymentMonths));

    return {
      monthlyPayment: repaymentMonthlyPayment,
      studyMonthlyPayment: studyMonthlyPayment,
      totalInterest: totalInterest,
      totalPaid: totalPayments,
      repaymentMonths: repaymentMonths,
      studyPhasePayments: studyPhasePayments,
      studyPhaseInterest: studyPhasePayments - (monthlyInsurance * studyMonths)
    };
  }

  function calculateWithoutDeferment(loanAmount, monthlyRate, totalTermMonths, monthlyInsurance) {
    const monthlyPayment = calculateMonthlyPayment(loanAmount, monthlyRate, totalTermMonths) + monthlyInsurance;
    const totalPayments = monthlyPayment * totalTermMonths;
    const totalInterest = totalPayments - loanAmount - (monthlyInsurance * totalTermMonths);

    return {
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalPaid: totalPayments,
      repaymentMonths: totalTermMonths
    };
  }

  function calculateMonthlyPayment(principal, monthlyRate, months) {
    if (monthlyRate === 0) {
      return principal / months;
    }
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  }

  function calculateAffordability(monthlyPayment, expectedSalary, currentIncome) {
    const monthlyExpectedIncome = expectedSalary;
    const monthlyCurrentIncome = currentIncome;
    
    const currentAffordability = monthlyCurrentIncome > 0 ? (monthlyPayment / monthlyCurrentIncome) * 100 : 0;
    const futureAffordability = monthlyExpectedIncome > 0 ? (monthlyPayment / monthlyExpectedIncome) * 100 : 0;
    
    // Rule of thumb: student loan payments shouldn't exceed 10-15% of income
    const isAffordableNow = currentAffordability <= 15;
    const isAffordableFuture = futureAffordability <= 15;

    return {
      currentAffordability: currentAffordability,
      futureAffordability: futureAffordability,
      isAffordableNow: isAffordableNow,
      isAffordableFuture: isAffordableFuture,
      monthlyCurrentIncome: monthlyCurrentIncome,
      monthlyExpectedIncome: monthlyExpectedIncome
    };
  }

  function calculateEducationROI(totalCost, totalInterest, expectedSalary, currentIncome) {
    const annualSalaryIncrease = (expectedSalary * 12) - (currentIncome * 12);
    const totalEducationCost = totalCost + totalInterest;
    
    if (annualSalaryIncrease <= 0) {
      return {
        roiYears: Infinity,
        roiPercent: -100,
        annualSalaryIncrease: annualSalaryIncrease,
        totalEducationCost: totalEducationCost
      };
    }
    
    const roiYears = totalEducationCost / annualSalaryIncrease;
    const roiPercent = (annualSalaryIncrease / totalEducationCost) * 100;

    return {
      roiYears: roiYears,
      roiPercent: roiPercent,
      annualSalaryIncrease: annualSalaryIncrease,
      totalEducationCost: totalEducationCost
    };
  }

  function displayResults(calculation) {
    const currencySymbol = getCurrencySymbol(calculation.currency);
    
    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🎓 Розрахунок освітнього кредиту</h3>
        
        <div class="loan-summary">
          <h4>Загальний огляд кредиту</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Сума кредиту:</span>
              <span class="value">${calculation.originalLoanAmount.toLocaleString()} ${currencySymbol}</span>
            </div>
            <div class="summary-item">
              <span class="label">Комісія за видачу:</span>
              <span class="value">${calculation.originationFee.toLocaleString()} ${currencySymbol}</span>
            </div>
            <div class="summary-item">
              <span class="label">Загальна сума до погашення:</span>
              <span class="value">${calculation.totalLoanAmount.toLocaleString()} ${currencySymbol}</span>
            </div>
            <div class="summary-item">
              <span class="label">Щомісячний платіж:</span>
              <span class="value">${calculation.monthlyPayment.toLocaleString()} ${currencySymbol}</span>
            </div>
            <div class="summary-item">
              <span class="label">Загальні відсотки:</span>
              <span class="value">${calculation.totalInterest.toLocaleString()} ${currencySymbol}</span>
            </div>
            <div class="summary-item">
              <span class="label">Загальна переплата:</span>
              <span class="value">${calculation.totalPaid.toLocaleString()} ${currencySymbol}</span>
            </div>
          </div>
        </div>

        <div class="insights-section">
          <h4>💡 Ключові показники</h4>
          <div class="insight-cards">
            <div class="insight-card">
              <h6>⏰ Термін погашення</h6>
              <div class="big-number">${Math.round(calculation.repaymentMonths / 12)} років</div>
              <p class="insight-detail">${calculation.repaymentMonths} місяців активних платежів</p>
            </div>
            <div class="insight-card ${calculation.affordability.isAffordableFuture ? 'success' : 'warning'}">
              <h6>💰 Навантаження на бюджет</h6>
              <div class="big-number">${calculation.affordability.futureAffordability.toFixed(1)}%</div>
              <p class="insight-detail">від очікуваного доходу</p>
            </div>
            <div class="insight-card ${calculation.roi.roiYears <= 5 ? 'success' : calculation.roi.roiYears <= 10 ? 'info' : 'warning'}">
              <h6>📈 Окупність освіти</h6>
              <div class="big-number">${calculation.roi.roiYears === Infinity ? '∞' : calculation.roi.roiYears.toFixed(1)}</div>
              <p class="insight-detail">років до окупності</p>
            </div>
          </div>
        </div>

        ${createDefermentSection(calculation)}
        ${createAffordabilitySection(calculation, currencySymbol)}
        ${createROISection(calculation, currencySymbol)}
        ${createRecommendationsSection(calculation)}
      </div>
    `;

    createLoanChart(calculation);
  }

  function createDefermentSection(calculation) {
    if (calculation.defermentOption === 'full') {
      return `
        <div class="deferment-section">
          <h4>📚 Фаза навчання (повна відстрочка)</h4>
          <div class="deferment-info">
            <p><strong>Під час навчання:</strong> платежі не здійснюються, відсотки капіталізуються</p>
            <p><strong>Накопичені відсотки:</strong> ${calculation.studyPhaseInterest.toLocaleString()} грн</p>
            <p><strong>Баланс після навчання:</strong> ${calculation.repaymentPhaseBalance?.toLocaleString() || 'N/A'} грн</p>
          </div>
        </div>
      `;
    } else if (calculation.defermentOption === 'interest-only') {
      return `
        <div class="deferment-section">
          <h4>📚 Фаза навчання (тільки відсотки)</h4>
          <div class="deferment-info">
            <p><strong>Платіж під час навчання:</strong> ${calculation.studyMonthlyPayment?.toLocaleString() || 'N/A'} грн/міс</p>
            <p><strong>Загальні платежі під час навчання:</strong> ${calculation.studyPhasePayments?.toLocaleString() || 'N/A'} грн</p>
            <p><strong>Платіж після навчання:</strong> ${calculation.monthlyPayment.toLocaleString()} грн/міс</p>
          </div>
        </div>
      `;
    }
    return '';
  }

  function createAffordabilitySection(calculation, currencySymbol) {
    const affordability = calculation.affordability;
    
    return `
      <div class="affordability-section">
        <h4>💵 Аналіз доступності платежів</h4>
        <div class="affordability-grid">
          <div class="affordability-card">
            <h6>Поточна ситуація</h6>
            <p><strong>Поточний дохід:</strong> ${affordability.monthlyCurrentIncome.toLocaleString()} ${currencySymbol}/міс</p>
            <p><strong>Навантаження:</strong> ${affordability.currentAffordability.toFixed(1)}% доходу</p>
            <p class="status ${affordability.isAffordableNow ? 'success' : 'warning'}">
              ${affordability.isAffordableNow ? '✅ Доступно' : '⚠️ Високе навантаження'}
            </p>
          </div>
          <div class="affordability-card">
            <h6>Після навчання</h6>
            <p><strong>Очікуваний дохід:</strong> ${affordability.monthlyExpectedIncome.toLocaleString()} ${currencySymbol}/міс</p>
            <p><strong>Навантаження:</strong> ${affordability.futureAffordability.toFixed(1)}% доходу</p>
            <p class="status ${affordability.isAffordableFuture ? 'success' : 'warning'}">
              ${affordability.isAffordableFuture ? '✅ Доступно' : '⚠️ Високе навантаження'}
            </p>
          </div>
        </div>
        <div class="affordability-tips">
          <p><strong>💡 Рекомендації:</strong></p>
          <ul>
            <li>Оптимальне навантаження: до 10-15% доходу</li>
            <li>Максимально допустимо: до 20% доходу</li>
            <li>Понад 20% - ризик фінансових труднощів</li>
          </ul>
        </div>
      </div>
    `;
  }

  function createROISection(calculation, currencySymbol) {
    const roi = calculation.roi;
    
    return `
      <div class="roi-section">
        <h4>📊 Рентабельність інвестиції в освіту</h4>
        <div class="roi-grid">
          <div class="roi-metric">
            <span class="label">Загальна вартість освіти:</span>
            <span class="value">${roi.totalEducationCost.toLocaleString()} ${currencySymbol}</span>
          </div>
          <div class="roi-metric">
            <span class="label">Річне підвищення доходу:</span>
            <span class="value">${roi.annualSalaryIncrease.toLocaleString()} ${currencySymbol}</span>
          </div>
          <div class="roi-metric">
            <span class="label">Термін окупності:</span>
            <span class="value">${roi.roiYears === Infinity ? 'Не окупається' : `${roi.roiYears.toFixed(1)} років`}</span>
          </div>
          <div class="roi-metric">
            <span class="label">Річна віддача:</span>
            <span class="value">${roi.roiPercent.toFixed(1)}%</span>
          </div>
        </div>
        <div class="roi-analysis">
          <p><strong>📈 Аналіз окупності:</strong></p>
          ${roi.roiYears <= 3 ? '<p class="success">🟢 Відмінна інвестиція - швидка окупність</p>' : 
            roi.roiYears <= 5 ? '<p class="info">🟡 Хороша інвестиція - прийнятна окупність</p>' :
            roi.roiYears <= 10 ? '<p class="warning">🟠 Середня інвестиція - тривала окупність</p>' :
            '<p class="danger">🔴 Ризикована інвестиція - занадто тривала окупність</p>'}
        </div>
      </div>
    `;
  }

  function createRecommendationsSection(calculation) {
    const recommendations = [];
    
    if (calculation.affordability.futureAffordability > 20) {
      recommendations.push("⚠️ Розгляньте збільшення терміну кредиту для зменшення щомісячного платежу");
    }
    
    if (calculation.roi.roiYears > 10) {
      recommendations.push("💡 Переглядьте очікувані кар'єрні перспективи або розгляньте дешевші альтернативи");
    }
    
    if (calculation.defermentOption === 'full') {
      recommendations.push("💰 Розгляньте платежі тільки відсотків під час навчання для зменшення капіталізації");
    }
    
    if (calculation.totalInterest > calculation.originalLoanAmount * 0.5) {
      recommendations.push("📉 Розгляньте скорочення терміну кредиту або дострокове погашення");
    }
    
    recommendations.push("🎓 Шукайте додаткові джерела фінансування: стипендії, гранти, програми обміну");
    recommendations.push("💼 Розгляньте можливість роботи під час навчання для зменшення боргового навантаження");

    return `
      <div class="recommendations-section">
        <h4>💡 Рекомендації та поради</h4>
        <ul class="recommendations-list">
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function getCurrencySymbol(currency) {
    const symbols = {
      'UAH': 'грн',
      'USD': '$',
      'EUR': '€',
      'PLN': 'zł'
    };
    return symbols[currency] || currency;
  }

  function createLoanChart(calculation) {
    const chartBlock = document.getElementById('loan-chart-block');
    if (!chartBlock) return;

    chartBlock.style.display = 'block';
    
    const ctx = document.getElementById('loan-chart').getContext('2d');
    
    // Clear any existing chart
    if (window.loanChart instanceof Chart) {
      window.loanChart.destroy();
    }

    // Create payment schedule for chart
    const paymentSchedule = generatePaymentSchedule(calculation);
    
    const labels = paymentSchedule.map((_, index) => `Рік ${Math.floor(index / 12) + 1}`);
    const principalData = paymentSchedule.map(payment => payment.principalPayment);
    const interestData = paymentSchedule.map(payment => payment.interestPayment);
    const balanceData = paymentSchedule.map(payment => payment.remainingBalance);

    window.loanChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.filter((_, index) => index % 12 === 0), // Show only yearly labels
        datasets: [{
          label: 'Залишок боргу',
          data: balanceData.filter((_, index) => index % 12 === 0),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
          yAxisID: 'y'
        }, {
          label: 'Щомісячний платіж (основна сума)',
          data: principalData.filter((_, index) => index % 12 === 0),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.1,
          yAxisID: 'y1'
        }, {
          label: 'Щомісячний платіж (відсотки)',
          data: interestData.filter((_, index) => index % 12 === 0),
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
            text: 'Графік погашення освітнього кредиту'
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
              text: 'Залишок боргу (грн)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Щомісячний платіж (грн)'
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Час'
            }
          }
        }
      }
    });
  }

  function generatePaymentSchedule(calculation) {
    // Simplified payment schedule generation for chart
    const schedule = [];
    let balance = calculation.totalLoanAmount;
    const monthlyRate = 0.15 / 12; // Simplified rate
    const monthlyPayment = calculation.monthlyPayment;
    
    for (let month = 0; month < calculation.repaymentMonths && balance > 0; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
      balance -= principalPayment;
      
      schedule.push({
        month: month + 1,
        interestPayment: interestPayment,
        principalPayment: principalPayment,
        remainingBalance: Math.max(0, balance)
      });
    }
    
    return schedule;
  }
});