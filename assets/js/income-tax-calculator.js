document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tax-calculator-form");
  const resultDiv = document.getElementById("tax-result");

  // Ukrainian tax constants for 2024
  const TAX_CONSTANTS = {
    PDFO_RATE: 0.18,                    // 18% PDFO
    MILITARY_TAX_RATE: 0.015,           // 1.5% Military tax
    ESV_RATE: 0.22,                     // 22% Single Social Contribution (paid by employer)
    PSP_AMOUNT: 1440,                   // Tax social benefit amount (UAH per month)
    PSP_THRESHOLD_MIN: 2880,            // PSP starts reducing at this income
    PSP_THRESHOLD_MAX: 4320,            // PSP is zero at this income
    CHILD_BENEFIT: 933,                 // UAH per child per month
    MIN_WAGE: 7100,                     // Minimum wage UAH per month 2024
    MAX_ESV_BASE: 141000,               // Maximum ESV base (25 min wages)
    EDUCATION_DEDUCTION_MAX: 15200,     // Maximum education expense deduction per year
    RENTAL_LOW_RATE: 0.05,              // 5% tax rate for rental income under 50k UAH
    RENTAL_THRESHOLD: 50000,            // Rental income threshold for 5% rate
    DIVIDEND_RATE: 0.09,                // 9% tax rate for dividends
  };

  // Auto-calculate annual income when monthly changes
  document.getElementById("monthly-income").addEventListener("input", function() {
    const monthlyIncome = parseFloat(this.value) || 0;
    document.getElementById("annual-income").value = monthlyIncome * 12;
  });

  // Auto-calculate monthly income when annual changes
  document.getElementById("annual-income").addEventListener("input", function() {
    const annualIncome = parseFloat(this.value) || 0;
    document.getElementById("monthly-income").value = Math.round(annualIncome / 12);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateTax();
  });

  function calculateTax() {
    // Get form data
    const incomeType = document.getElementById("income-type").value;
    const monthlyIncome = parseFloat(document.getElementById("monthly-income").value) || 0;
    const annualIncome = parseFloat(document.getElementById("annual-income").value) || 0;
    const childrenCount = parseInt(document.getElementById("children-count").value) || 0;
    const maritalStatus = document.getElementById("marital-status").value;
    const disabilityGroup = document.getElementById("disability-group").value;
    
    const isVeteran = document.getElementById("is-veteran").checked;
    const isVPO = document.getElementById("is-vpo").checked;
    const isPensioner = document.getElementById("is-pensioner").checked;
    
    const educationExpenses = parseFloat(document.getElementById("education-expenses").value) || 0;
    const medicalExpenses = parseFloat(document.getElementById("medical-expenses").value) || 0;
    const charityExpenses = parseFloat(document.getElementById("charity-expenses").value) || 0;
    const insuranceExpenses = parseFloat(document.getElementById("insurance-expenses").value) || 0;
    
    const usePSP = document.getElementById("use-psp").checked;
    const useChildBenefit = document.getElementById("use-child-benefit").checked;

    // Calculate taxes based on income type
    let calculation;
    switch (incomeType) {
      case 'salary':
        calculation = calculateSalaryTax(monthlyIncome, annualIncome, childrenCount, usePSP, useChildBenefit, educationExpenses, medicalExpenses, charityExpenses, insuranceExpenses, isVeteran, isVPO);
        break;
      case 'rental':
        calculation = calculateRentalTax(annualIncome);
        break;
      case 'dividends':
        calculation = calculateDividendTax(annualIncome);
        break;
      case 'investment':
        calculation = calculateInvestmentTax(annualIncome);
        break;
      case 'fop':
        calculation = calculateFOPTax(annualIncome);
        break;
      default:
        calculation = calculateGeneralTax(monthlyIncome, annualIncome, childrenCount, usePSP, useChildBenefit, educationExpenses, medicalExpenses, charityExpenses, insuranceExpenses);
    }

    displayResults(calculation, incomeType, monthlyIncome, annualIncome);
  }

  function calculateSalaryTax(monthlyIncome, annualIncome, childrenCount, usePSP, useChildBenefit, educationExpenses, medicalExpenses, charityExpenses, insuranceExpenses, isVeteran, isVPO) {
    let monthlyPDFO = 0;
    let monthlyMilitaryTax = 0;
    let monthlyESV = monthlyIncome * TAX_CONSTANTS.ESV_RATE; // Paid by employer
    let monthlyNetIncome = monthlyIncome;
    
    // Calculate PSP (Tax Social Benefit)
    let monthlyPSP = 0;
    if (usePSP && monthlyIncome <= TAX_CONSTANTS.PSP_THRESHOLD_MAX) {
      if (monthlyIncome <= TAX_CONSTANTS.PSP_THRESHOLD_MIN) {
        monthlyPSP = TAX_CONSTANTS.PSP_AMOUNT;
      } else {
        // PSP reduces by 1 UAH for each 1 UAH of income over the threshold
        monthlyPSP = TAX_CONSTANTS.PSP_AMOUNT - (monthlyIncome - TAX_CONSTANTS.PSP_THRESHOLD_MIN);
        monthlyPSP = Math.max(0, monthlyPSP);
      }
    }

    // Calculate child benefit
    let monthlyChildBenefit = 0;
    if (useChildBenefit && childrenCount > 0) {
      monthlyChildBenefit = TAX_CONSTANTS.CHILD_BENEFIT * childrenCount;
    }

    // Calculate monthly deductions
    const monthlyEducationDeduction = Math.min(educationExpenses / 12, TAX_CONSTANTS.EDUCATION_DEDUCTION_MAX / 12);
    const monthlyMedicalDeduction = medicalExpenses / 12;
    const monthlyCharityDeduction = Math.min(charityExpenses / 12, annualIncome * 0.04 / 12);
    const monthlyInsuranceDeduction = insuranceExpenses / 12;

    const totalMonthlyDeductions = monthlyPSP + monthlyChildBenefit + monthlyEducationDeduction + 
                                   monthlyMedicalDeduction + monthlyCharityDeduction + monthlyInsuranceDeduction;

    // Calculate taxable income
    const taxableIncome = Math.max(0, monthlyIncome - totalMonthlyDeductions);

    // Calculate PDFO (18%)
    monthlyPDFO = taxableIncome * TAX_CONSTANTS.PDFO_RATE;

    // Calculate Military Tax (1.5%) - applied to gross income
    monthlyMilitaryTax = monthlyIncome * TAX_CONSTANTS.MILITARY_TAX_RATE;

    // Special exemptions for veterans and VPO
    if (isVeteran) {
      // Veterans may have certain exemptions - simplified for this calculator
      monthlyPDFO *= 0.9; // 10% reduction as example
    }

    if (isVPO) {
      // VPO may have exemptions on certain aid
      // This would need specific implementation based on aid type
    }

    // Calculate net income (what employee receives)
    monthlyNetIncome = monthlyIncome - monthlyPDFO - monthlyMilitaryTax;

    return {
      monthlyGrossIncome: monthlyIncome,
      monthlyNetIncome: monthlyNetIncome,
      monthlyPDFO: monthlyPDFO,
      monthlyMilitaryTax: monthlyMilitaryTax,
      monthlyESV: monthlyESV, // Paid by employer
      monthlyPSP: monthlyPSP,
      monthlyChildBenefit: monthlyChildBenefit,
      monthlyDeductions: totalMonthlyDeductions,
      taxableIncome: taxableIncome,
      annualPDFO: monthlyPDFO * 12,
      annualMilitaryTax: monthlyMilitaryTax * 12,
      annualESV: monthlyESV * 12,
      totalEmployerCost: (monthlyIncome + monthlyESV) * 12,
      effectiveTaxRate: ((monthlyPDFO + monthlyMilitaryTax) / monthlyIncome) * 100,
      type: 'salary'
    };
  }

  function calculateRentalTax(annualIncome) {
    let annualPDFO = 0;
    let annualMilitaryTax = 0;
    let taxRate = 0;

    if (annualIncome <= TAX_CONSTANTS.RENTAL_THRESHOLD) {
      // Option for 5% rate if income is under 50,000 UAH and declared voluntarily
      taxRate = TAX_CONSTANTS.RENTAL_LOW_RATE;
      annualPDFO = annualIncome * taxRate;
      annualMilitaryTax = 0; // No military tax at 5% rate
    } else {
      // Standard rates for rental income over 50,000 UAH
      taxRate = TAX_CONSTANTS.PDFO_RATE + TAX_CONSTANTS.MILITARY_TAX_RATE;
      annualPDFO = annualIncome * TAX_CONSTANTS.PDFO_RATE;
      annualMilitaryTax = annualIncome * TAX_CONSTANTS.MILITARY_TAX_RATE;
    }

    const netIncome = annualIncome - annualPDFO - annualMilitaryTax;

    return {
      annualGrossIncome: annualIncome,
      annualNetIncome: netIncome,
      annualPDFO: annualPDFO,
      annualMilitaryTax: annualMilitaryTax,
      annualESV: 0, // No ESV for rental income
      taxRate: taxRate * 100,
      effectiveTaxRate: ((annualPDFO + annualMilitaryTax) / annualIncome) * 100,
      type: 'rental',
      canUse5Percent: annualIncome <= TAX_CONSTANTS.RENTAL_THRESHOLD
    };
  }

  function calculateDividendTax(annualIncome) {
    const annualPDFO = annualIncome * TAX_CONSTANTS.DIVIDEND_RATE;
    const annualMilitaryTax = 0; // No military tax on dividends
    const netIncome = annualIncome - annualPDFO;

    return {
      annualGrossIncome: annualIncome,
      annualNetIncome: netIncome,
      annualPDFO: annualPDFO,
      annualMilitaryTax: annualMilitaryTax,
      annualESV: 0,
      taxRate: TAX_CONSTANTS.DIVIDEND_RATE * 100,
      effectiveTaxRate: (annualPDFO / annualIncome) * 100,
      type: 'dividends'
    };
  }

  function calculateInvestmentTax(annualIncome) {
    const annualPDFO = annualIncome * TAX_CONSTANTS.PDFO_RATE;
    const annualMilitaryTax = annualIncome * TAX_CONSTANTS.MILITARY_TAX_RATE;
    const netIncome = annualIncome - annualPDFO - annualMilitaryTax;

    return {
      annualGrossIncome: annualIncome,
      annualNetIncome: netIncome,
      annualPDFO: annualPDFO,
      annualMilitaryTax: annualMilitaryTax,
      annualESV: 0,
      taxRate: (TAX_CONSTANTS.PDFO_RATE + TAX_CONSTANTS.MILITARY_TAX_RATE) * 100,
      effectiveTaxRate: ((annualPDFO + annualMilitaryTax) / annualIncome) * 100,
      type: 'investment'
    };
  }

  function calculateFOPTax(annualIncome) {
    // Simplified FOP calculation - would need more detailed implementation for different groups
    let taxAmount = 0;
    let group = "";
    
    if (annualIncome <= 1167000) {
      group = "1 група";
      taxAmount = TAX_CONSTANTS.MIN_WAGE * 0.10 * 12; // 10% of min wage monthly
    } else if (annualIncome <= 5835000) {
      group = "2 група";
      taxAmount = annualIncome * 0.20; // 20% of income
    } else {
      group = "3 група";
      taxAmount = annualIncome * 0.05; // 5% + VAT (simplified)
    }

    const minESV = TAX_CONSTANTS.MIN_WAGE * TAX_CONSTANTS.ESV_RATE * 12;
    const netIncome = annualIncome - taxAmount - minESV;

    return {
      annualGrossIncome: annualIncome,
      annualNetIncome: netIncome,
      annualTax: taxAmount,
      annualESV: minESV,
      fopGroup: group,
      effectiveTaxRate: ((taxAmount + minESV) / annualIncome) * 100,
      type: 'fop'
    };
  }

  function calculateGeneralTax(monthlyIncome, annualIncome, childrenCount, usePSP, useChildBenefit, educationExpenses, medicalExpenses, charityExpenses, insuranceExpenses) {
    // General calculation similar to salary but without ESV
    return calculateSalaryTax(monthlyIncome, annualIncome, childrenCount, usePSP, useChildBenefit, educationExpenses, medicalExpenses, charityExpenses, insuranceExpenses, false, false);
  }

  function displayResults(calculation, incomeType, monthlyIncome, annualIncome) {
    let resultHTML = `
      <div class="result-section">
        <h3>🇺🇦 Розрахунок податків в Україні</h3>
        
        <div class="tax-summary">
          <h4>Загальний огляд</h4>
          <div class="summary-grid">
    `;

    if (calculation.type === 'salary') {
      resultHTML += `
            <div class="summary-item">
              <span class="label">Нарахована зарплата:</span>
              <span class="value">${calculation.monthlyGrossIncome.toLocaleString()} грн/міс</span>
            </div>
            <div class="summary-item">
              <span class="label">До виплати працівнику:</span>
              <span class="value">${calculation.monthlyNetIncome.toLocaleString()} грн/міс</span>
            </div>
            <div class="summary-item">
              <span class="label">ПДФО (18%):</span>
              <span class="value">${calculation.monthlyPDFO.toLocaleString()} грн/міс</span>
            </div>
            <div class="summary-item">
              <span class="label">Військовий збір (1.5%):</span>
              <span class="value">${calculation.monthlyMilitaryTax.toLocaleString()} грн/міс</span>
            </div>
            <div class="summary-item">
              <span class="label">ЄСВ роботодавця (22%):</span>
              <span class="value">${calculation.monthlyESV.toLocaleString()} грн/міс</span>
            </div>
            <div class="summary-item">
              <span class="label">Загальні витрати роботодавця:</span>
              <span class="value">${(calculation.monthlyGrossIncome + calculation.monthlyESV).toLocaleString()} грн/міс</span>
            </div>
      `;
    } else if (calculation.type === 'rental') {
      resultHTML += `
            <div class="summary-item">
              <span class="label">Річний дохід від оренди:</span>
              <span class="value">${calculation.annualGrossIncome.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Чистий дохід:</span>
              <span class="value">${calculation.annualNetIncome.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">ПДФО:</span>
              <span class="value">${calculation.annualPDFO.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Військовий збір:</span>
              <span class="value">${calculation.annualMilitaryTax.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Ставка оподаткування:</span>
              <span class="value">${calculation.taxRate.toFixed(1)}%</span>
            </div>
            ${calculation.canUse5Percent ? `
            <div class="summary-item info">
              <span class="label">💡 Пільгова ставка 5%:</span>
              <span class="value">Доступна при декларуванні</span>
            </div>
            ` : ''}
      `;
    } else if (calculation.type === 'dividends') {
      resultHTML += `
            <div class="summary-item">
              <span class="label">Річні дивіденди:</span>
              <span class="value">${calculation.annualGrossIncome.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Чистий дохід:</span>
              <span class="value">${calculation.annualNetIncome.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">ПДФО (9%):</span>
              <span class="value">${calculation.annualPDFO.toLocaleString()} грн</span>
            </div>
            <div class="summary-item info">
              <span class="label">Військовий збір:</span>
              <span class="value">Не утримується</span>
            </div>
      `;
    } else if (calculation.type === 'fop') {
      resultHTML += `
            <div class="summary-item">
              <span class="label">Річний дохід ФОП:</span>
              <span class="value">${calculation.annualGrossIncome.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Група ФОП:</span>
              <span class="value">${calculation.fopGroup}</span>
            </div>
            <div class="summary-item">
              <span class="label">Чистий дохід:</span>
              <span class="value">${calculation.annualNetIncome.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Податок:</span>
              <span class="value">${calculation.annualTax.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">ЄСВ (мінімум):</span>
              <span class="value">${calculation.annualESV.toLocaleString()} грн</span>
            </div>
      `;
    }

    resultHTML += `
          </div>
        </div>

        <div class="insights-section">
          <h4>💡 Ключові показники</h4>
          <div class="insight-cards">
            <div class="insight-card">
              <h6>📊 Ефективна ставка оподаткування</h6>
              <div class="big-number">${calculation.effectiveTaxRate.toFixed(1)}%</div>
              <p class="insight-detail">Відсоток доходу, що йде на податки</p>
            </div>
    `;

    if (calculation.type === 'salary') {
      resultHTML += `
            <div class="insight-card success">
              <h6>💰 Річний чистий дохід</h6>
              <div class="big-number">${(calculation.monthlyNetIncome * 12).toLocaleString()}</div>
              <p class="insight-detail">грн на рік після податків</p>
            </div>
            ${calculation.monthlyPSP > 0 ? `
            <div class="insight-card info">
              <h6>🎯 Податкова соціальна пільга</h6>
              <div class="big-number">${calculation.monthlyPSP.toLocaleString()}</div>
              <p class="insight-detail">грн економії щомісяця</p>
            </div>
            ` : ''}
      `;
    } else {
      resultHTML += `
            <div class="insight-card success">
              <h6>💰 Річний чистий дохід</h6>
              <div class="big-number">${calculation.annualNetIncome.toLocaleString()}</div>
              <p class="insight-detail">грн на рік після податків</p>
            </div>
      `;
    }

    resultHTML += `
          </div>
        </div>

        ${createOptimizationSection(calculation, incomeType)}
        ${createComparisonSection(calculation)}
      </div>
    `;

    resultDiv.innerHTML = resultHTML;
    createTaxChart(calculation);
  }

  function createOptimizationSection(calculation, incomeType) {
    return `
      <div class="optimization-section">
        <h4>🔧 Можливості оптимізації</h4>
        <div class="optimization-tips">
          ${incomeType === 'salary' ? `
          <div class="tip-card">
            <h6>📚 Освітні витрати</h6>
            <p>Можете зменшити оподатковуваний дохід на витрати на навчання до 15,200 грн на рік</p>
          </div>
          <div class="tip-card">
            <h6>🏥 Медичні витрати</h6>
            <p>Витрати на лікування та ліки можуть зменшити базу оподаткування</p>
          </div>
          <div class="tip-card">
            <h6>❤️ Благодійність</h6>
            <p>Благодійні внески до 4% річного доходу знижують податкову базу</p>
          </div>
          ` : ''}
          ${incomeType === 'rental' && calculation.canUse5Percent ? `
          <div class="tip-card success">
            <h6>💰 Пільгова ставка 5%</h6>
            <p>При доході до 50,000 грн на рік можете використати ставку 5% замість 18% + 1.5%</p>
          </div>
          ` : ''}
          ${incomeType === 'fop' ? `
          <div class="tip-card">
            <h6>📊 Вибір групи ФОП</h6>
            <p>Розгляньте можливість зміни групи оподаткування для оптимізації податкового навантаження</p>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function createComparisonSection(calculation) {
    if (calculation.type === 'salary') {
      return `
        <div class="comparison-section">
          <h4>📈 Порівняння з мінімальною зарплатою</h4>
          <div class="comparison-grid">
            <div class="comparison-item">
              <span class="label">Ваша зарплата до податків:</span>
              <span class="value">${calculation.monthlyGrossIncome.toLocaleString()} грн</span>
            </div>
            <div class="comparison-item">
              <span class="label">Мінімальна зарплата 2024:</span>
              <span class="value">${TAX_CONSTANTS.MIN_WAGE.toLocaleString()} грн</span>
            </div>
            <div class="comparison-item">
              <span class="label">Кратність до мінімалки:</span>
              <span class="value">${(calculation.monthlyGrossIncome / TAX_CONSTANTS.MIN_WAGE).toFixed(1)}x</span>
            </div>
            <div class="comparison-item">
              <span class="label">Податки з мінімалки:</span>
              <span class="value">${((TAX_CONSTANTS.MIN_WAGE * (TAX_CONSTANTS.PDFO_RATE + TAX_CONSTANTS.MILITARY_TAX_RATE)) - TAX_CONSTANTS.PSP_AMOUNT * TAX_CONSTANTS.PDFO_RATE).toLocaleString()} грн</span>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }

  function createTaxChart(calculation) {
    const chartBlock = document.getElementById('tax-chart-block');
    if (!chartBlock) return;

    chartBlock.style.display = 'block';
    
    const ctx = document.getElementById('tax-chart').getContext('2d');
    
    // Clear any existing chart
    if (window.taxChart instanceof Chart) {
      window.taxChart.destroy();
    }

    let data, labels;

    if (calculation.type === 'salary') {
      data = [
        calculation.monthlyNetIncome,
        calculation.monthlyPDFO,
        calculation.monthlyMilitaryTax,
        calculation.monthlyESV
      ];
      labels = ['Чистий дохід', 'ПДФО (18%)', 'Військовий збір (1.5%)', 'ЄСВ роботодавця (22%)'];
    } else if (calculation.type === 'fop') {
      data = [
        calculation.annualNetIncome,
        calculation.annualTax,
        calculation.annualESV
      ];
      labels = ['Чистий дохід', 'Податок ФОП', 'ЄСВ'];
    } else {
      const annualIncome = calculation.annualGrossIncome;
      data = [
        calculation.annualNetIncome,
        calculation.annualPDFO,
        calculation.annualMilitaryTax || 0
      ];
      labels = ['Чистий дохід', 'ПДФО', 'Військовий збір'];
    }

    window.taxChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#10b981', // Green for net income
            '#3b82f6', // Blue for PDFO
            '#f59e0b', // Orange for military tax
            '#ef4444'  // Red for ESV
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Розподіл доходів та податків'
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value.toLocaleString()} грн (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
});