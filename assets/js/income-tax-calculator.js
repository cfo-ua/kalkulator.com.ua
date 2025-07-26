document.getElementById("income-tax-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const monthlyIncome = parseFloat(document.getElementById("monthlyIncome").value) || 0;
  const bonuses = parseFloat(document.getElementById("bonuses").value) || 0;
  const otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
  const incomeType = document.getElementById("incomeType").value;
  const residencyStatus = document.getElementById("residencyStatus").value;
  const militaryStatus = document.getElementById("militaryStatus").value;
  const disabilityGroup = document.getElementById("disabilityGroup").value;
  const hasMinors = document.getElementById("hasMinors").checked;
  const educationExpenses = parseFloat(document.getElementById("educationExpenses").value) || 0;
  const medicalExpenses = parseFloat(document.getElementById("medicalExpenses").value) || 0;
  const charityDonations = parseFloat(document.getElementById("charityDonations").value) || 0;
  const pensionContributions = parseFloat(document.getElementById("pensionContributions").value) || 0;
  const calculateAnnual = document.getElementById("calculateAnnual").checked;

  // Константи для розрахунків (2024)
  const PDFO_RATE_RESIDENT = 0.18;
  const PDFO_RATE_NON_RESIDENT = 0.20;
  const MILITARY_TAX_RATE = 0.015;
  const ESV_EMPLOYEE_RATE = 0.03;
  const ESV_EMPLOYER_RATE = 0.22;
  const MINIMUM_WAGE = 7100;
  const LIVING_WAGE = 2759;
  const PSP_AMOUNT = LIVING_WAGE * 0.5; // 1379 грн
  const PSP_THRESHOLD_MIN = PSP_AMOUNT * 3; // 4137 грн
  const PSP_THRESHOLD_MAX = PSP_AMOUNT * 6; // 8274 грн

  // Річний дохід
  const annualIncome = monthlyIncome * 12 + bonuses + otherIncome;
  
  // Перевірка на мінімальну зарплату
  if (incomeType === 'employee' && monthlyIncome < MINIMUM_WAGE) {
    document.getElementById("income-tax-result").innerHTML = 
      `<p style="color: red;">Мінімальна зарплата в Україні становить ${formatNumber(MINIMUM_WAGE)} грн/місяць.</p>`;
    return;
  }

  let calculation = {};

  if (incomeType === 'employee') {
    calculation = calculateEmployeeTax(monthlyIncome, bonuses, otherIncome, residencyStatus, militaryStatus, disabilityGroup, hasMinors);
  } else if (incomeType.startsWith('fop')) {
    calculation = calculateFOPTax(annualIncome, incomeType, militaryStatus, disabilityGroup);
  } else if (incomeType === 'investment') {
    calculation = calculateInvestmentTax(annualIncome, residencyStatus, militaryStatus);
  }

  // Податкові знижки
  const taxReductions = calculateTaxReductions(educationExpenses, medicalExpenses, charityDonations, pensionContributions, calculation.pdfoBase);
  
  // Коригування ПДФО з урахуванням знижок
  if (taxReductions.totalReduction > 0) {
    calculation.pdfoReduced = Math.max(0, calculation.pdfo - taxReductions.totalReduction);
    calculation.taxSavings = calculation.pdfo - calculation.pdfoReduced;
  } else {
    calculation.pdfoReduced = calculation.pdfo;
    calculation.taxSavings = 0;
  }

  // Підсумкові розрахунки
  const netIncome = calculateAnnual ? 
    annualIncome - calculation.pdfoReduced - calculation.militaryTax - calculation.esvEmployee :
    monthlyIncome - (calculation.pdfoReduced / 12) - (calculation.militaryTax / 12) - (calculation.esvEmployee / 12);

  const effectiveTaxRate = ((calculation.pdfoReduced + calculation.militaryTax + calculation.esvEmployee) / annualIncome) * 100;

  const resultHTML = `
    <div class="calculation-results">
      <h3>💼 Результати розрахунку податку на доходи</h3>
      
      <div class="results-grid">
        <div class="result-section">
          <h4>💰 Доходи та база оподаткування</h4>
          <div class="result-item">
            <span class="label">Щомісячний дохід:</span>
            <span class="value">${formatNumber(monthlyIncome)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Річний дохід:</span>
            <span class="value">${formatNumber(annualIncome)} грн</span>
          </div>
          ${calculation.psp > 0 ? `
          <div class="result-item">
            <span class="label">Податкова соціальна пільга:</span>
            <span class="value">${formatNumber(calculation.psp)} грн/місяць</span>
          </div>
          ` : ''}
          <div class="result-item">
            <span class="label">База оподаткування ПДФО:</span>
            <span class="value">${formatNumber(calculation.pdfoBase)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Тип платника:</span>
            <span class="value">${getIncomeTypeLabel(incomeType)}</span>
          </div>
        </div>
        
        <div class="result-section">
          <h4>🏛️ Податки та збори (річні)</h4>
          <div class="result-item">
            <span class="label">ПДФО (${getIncomeTypeLabel(residencyStatus === 'resident' ? 'resident' : 'non-resident')} ${(residencyStatus === 'resident' ? PDFO_RATE_RESIDENT : PDFO_RATE_NON_RESIDENT) * 100}%):</span>
            <span class="value">${formatNumber(calculation.pdfo)} грн</span>
          </div>
          ${calculation.taxSavings > 0 ? `
          <div class="result-item success">
            <span class="label">Економія від знижок:</span>
            <span class="value">-${formatNumber(calculation.taxSavings)} грн</span>
          </div>
          <div class="result-item highlight">
            <span class="label">ПДФО після знижок:</span>
            <span class="value">${formatNumber(calculation.pdfoReduced)} грн</span>
          </div>
          ` : ''}
          <div class="result-item">
            <span class="label">Військовий збір (1.5%):</span>
            <span class="value">${formatNumber(calculation.militaryTax)} грн</span>
          </div>
          ${calculation.esvEmployee > 0 ? `
          <div class="result-item">
            <span class="label">ЄСВ працівника (3%):</span>
            <span class="value">${formatNumber(calculation.esvEmployee)} грн</span>
          </div>
          ` : ''}
          ${calculation.esvEmployer > 0 ? `
          <div class="result-item">
            <span class="label">ЄСВ роботодавця (22%):</span>
            <span class="value">${formatNumber(calculation.esvEmployer)} грн</span>
          </div>
          ` : ''}
          ${calculation.esvFOP > 0 ? `
          <div class="result-item">
            <span class="label">ЄСВ ФОП:</span>
            <span class="value">${formatNumber(calculation.esvFOP)} грн</span>
          </div>
          ` : ''}
        </div>
        
        <div class="result-section highlight-section">
          <h4>📊 Підсумкові показники</h4>
          <div class="result-item highlight-total">
            <span class="label"><strong>Загальні податки та збори:</strong></span>
            <span class="value"><strong>${formatNumber(calculation.pdfoReduced + calculation.militaryTax + calculation.esvEmployee + calculation.esvFOP)} грн</strong></span>
          </div>
          <div class="result-item highlight-total">
            <span class="label"><strong>${calculateAnnual ? 'Чистий річний' : 'Чистий місячний'} дохід:</strong></span>
            <span class="value"><strong>${formatNumber(netIncome)} грн</strong></span>
          </div>
          <div class="result-item">
            <span class="label">Ефективна податкова ставка:</span>
            <span class="value">${effectiveTaxRate.toFixed(1)}%</span>
          </div>
          ${calculateAnnual ? `
          <div class="result-item">
            <span class="label">Чистий місячний дохід:</span>
            <span class="value">${formatNumber(netIncome / 12)} грн</span>
          </div>
          ` : `
          <div class="result-item">
            <span class="label">Чистий річний дохід:</span>
            <span class="value">${formatNumber(netIncome * 12)} грн</span>
          </div>
          `}
        </div>
        
        ${taxReductions.totalReduction > 0 ? `
        <div class="result-section success-section">
          <h4>💡 Податкові знижки</h4>
          ${taxReductions.education > 0 ? `
          <div class="result-item">
            <span class="label">Знижка за навчання:</span>
            <span class="value">${formatNumber(taxReductions.education)} грн</span>
          </div>
          ` : ''}
          ${taxReductions.medical > 0 ? `
          <div class="result-item">
            <span class="label">Знижка за лікування:</span>
            <span class="value">${formatNumber(taxReductions.medical)} грн</span>
          </div>
          ` : ''}
          ${taxReductions.charity > 0 ? `
          <div class="result-item">
            <span class="label">Знижка за благодійність:</span>
            <span class="value">${formatNumber(taxReductions.charity)} грн</span>
          </div>
          ` : ''}
          ${taxReductions.pension > 0 ? `
          <div class="result-item">
            <span class="label">Знижка за пенсійні внески:</span>
            <span class="value">${formatNumber(taxReductions.pension)} грн</span>
          </div>
          ` : ''}
          <div class="result-item highlight">
            <span class="label"><strong>Загальна знижка:</strong></span>
            <span class="value"><strong>${formatNumber(taxReductions.totalReduction)} грн</strong></span>
          </div>
        </div>
        ` : ''}
      </div>
      
      ${incomeType === 'employee' && calculation.esvEmployer > 0 ? `
      <div class="info-section">
        <h4>ℹ️ Витрати роботодавця</h4>
        <ul>
          <li><strong>Нарахована зарплата:</strong> ${formatNumber(annualIncome)} грн/рік</li>
          <li><strong>ЄСВ роботодавця:</strong> ${formatNumber(calculation.esvEmployer)} грн/рік</li>
          <li><strong>Загальні витрати роботодавця:</strong> ${formatNumber(annualIncome + calculation.esvEmployer)} грн/рік</li>
          <li><strong>Щомісячні витрати роботодавця:</strong> ${formatNumber((annualIncome + calculation.esvEmployer) / 12)} грн</li>
        </ul>
      </div>
      ` : ''}
      
      <div class="info-section">
        <h4>📅 Важливі терміни</h4>
        <ul>
          <li><strong>ПДФО та військовий збір:</strong> До 15 числа наступного місяця</li>
          <li><strong>ЄСВ:</strong> До 20 числа наступного місяця</li>
          <li><strong>Річна декларація:</strong> До 31 березня наступного року</li>
          <li><strong>Доплата по декларації:</strong> До 31 липня</li>
          ${taxReductions.totalReduction > 0 ? '<li><strong>Податкові знижки:</strong> Подаються через річну декларацію до ДПС</li>' : ''}
        </ul>
      </div>
    </div>
  `;

  document.getElementById("income-tax-result").innerHTML = resultHTML;
  
  // Показати графік
  displayTaxChart(
    calculation.pdfoReduced, 
    calculation.militaryTax, 
    calculation.esvEmployee + calculation.esvFOP, 
    netIncome,
    calculateAnnual
  );
});

function calculateEmployeeTax(monthlyIncome, bonuses, otherIncome, residencyStatus, militaryStatus, disabilityGroup, hasMinors) {
  const annualIncome = monthlyIncome * 12 + bonuses + otherIncome;
  
  // Розрахунок ПСП
  let psp = 0;
  if (monthlyIncome <= PSP_THRESHOLD_MIN) {
    psp = PSP_AMOUNT;
  } else if (monthlyIncome <= PSP_THRESHOLD_MAX) {
    psp = PSP_AMOUNT - (PSP_AMOUNT * (monthlyIncome - PSP_THRESHOLD_MIN) / PSP_THRESHOLD_MIN);
  }
  
  // Пільги для учасників бойових дій
  let pdfoExemption = false;
  if (militaryStatus === 'ato' || militaryStatus === 'current') {
    pdfoExemption = true;
  }
  
  // База оподаткування ПДФО
  const pdfoBase = Math.max(0, annualIncome - (psp * 12));
  
  // Розрахунок ПДФО
  const pdfoRate = residencyStatus === 'resident' ? PDFO_RATE_RESIDENT : PDFO_RATE_NON_RESIDENT;
  const pdfo = pdfoExemption ? 0 : pdfoBase * pdfoRate;
  
  // Військовий збір
  const militaryTax = pdfoExemption ? 0 : annualIncome * MILITARY_TAX_RATE;
  
  // ЄСВ
  const maxESVBase = MINIMUM_WAGE * 25 * 12; // 25 мінімальних зарплат
  const esvBase = Math.min(annualIncome, maxESVBase);
  const esvEmployee = esvBase * ESV_EMPLOYEE_RATE;
  const esvEmployer = esvBase * ESV_EMPLOYER_RATE;
  
  return {
    pdfoBase,
    pdfo,
    militaryTax,
    esvEmployee,
    esvEmployer,
    esvFOP: 0,
    psp
  };
}

function calculateFOPTax(annualIncome, fopGroup, militaryStatus, disabilityGroup) {
  let pdfo = 0;
  let esvFOP = 0;
  let militaryTax = 0;
  
  // Пільги для учасників бойових дій
  const pdfoExemption = militaryStatus === 'ato' || militaryStatus === 'current';
  
  if (fopGroup === 'fop1') {
    // I група - до 167,700 грн/рік, без ПДФО
    pdfo = 0;
    esvFOP = 1421 * 12; // Фіксована сума
    militaryTax = pdfoExemption ? 0 : annualIncome * MILITARY_TAX_RATE;
  } else if (fopGroup === 'fop2') {
    // II група - до 3,354,000 грн/рік, без ПДФО
    pdfo = 0;
    esvFOP = Math.max(annualIncome * 0.20, 1421 * 12);
    militaryTax = pdfoExemption ? 0 : annualIncome * MILITARY_TAX_RATE;
  } else if (fopGroup === 'fop3') {
    // III група - загальний порядок
    pdfo = pdfoExemption ? 0 : annualIncome * PDFO_RATE_RESIDENT;
    esvFOP = annualIncome * 0.22;
    militaryTax = pdfoExemption ? 0 : annualIncome * MILITARY_TAX_RATE;
  }
  
  return {
    pdfoBase: annualIncome,
    pdfo,
    militaryTax,
    esvEmployee: 0,
    esvEmployer: 0,
    esvFOP,
    psp: 0
  };
}

function calculateInvestmentTax(annualIncome, residencyStatus, militaryStatus) {
  const pdfoExemption = militaryStatus === 'ato' || militaryStatus === 'current';
  const pdfoRate = residencyStatus === 'resident' ? PDFO_RATE_RESIDENT : PDFO_RATE_NON_RESIDENT;
  
  const pdfo = pdfoExemption ? 0 : annualIncome * pdfoRate;
  const militaryTax = pdfoExemption ? 0 : annualIncome * MILITARY_TAX_RATE;
  
  return {
    pdfoBase: annualIncome,
    pdfo,
    militaryTax,
    esvEmployee: 0,
    esvEmployer: 0,
    esvFOP: 0,
    psp: 0
  };
}

function calculateTaxReductions(education, medical, charity, pension, pdfoBase) {
  // Максимальні розміри знижок
  const maxEducation = 18500;
  const maxCharity = pdfoBase * 0.04; // 4% від доходу
  const maxPension = pdfoBase * 0.15; // 15% від доходу
  
  const educationReduction = Math.min(education, maxEducation) * PDFO_RATE_RESIDENT;
  const medicalReduction = medical * PDFO_RATE_RESIDENT; // Без ліміту при наявності документів
  const charityReduction = Math.min(charity, maxCharity) * PDFO_RATE_RESIDENT;
  const pensionReduction = Math.min(pension, maxPension) * PDFO_RATE_RESIDENT;
  
  return {
    education: educationReduction,
    medical: medicalReduction,
    charity: charityReduction,
    pension: pensionReduction,
    totalReduction: educationReduction + medicalReduction + charityReduction + pensionReduction
  };
}

function getIncomeTypeLabel(type) {
  const labels = {
    employee: 'Найманий працівник',
    fop1: 'ФОП I група',
    fop2: 'ФОП II група', 
    fop3: 'ФОП III група',
    investment: 'Інвестиційні доходи',
    resident: '18%',
    'non-resident': '20%'
  };
  return labels[type] || type;
}

function displayTaxChart(pdfo, militaryTax, esv, netIncome, isAnnual) {
  const chartBlock = document.getElementById("income-tax-chart-block");
  const canvas = document.getElementById("income-tax-chart");
  const ctx = canvas.getContext("2d");
  
  chartBlock.style.display = "block";
  
  // Очистити попередній графік
  if (window.incomeTaxChart) {
    window.incomeTaxChart.destroy();
  }
  
  const chartData = [];
  const chartLabels = [];
  
  if (pdfo > 0) {
    chartData.push(isAnnual ? pdfo : pdfo / 12);
    chartLabels.push('ПДФО');
  }
  
  if (militaryTax > 0) {
    chartData.push(isAnnual ? militaryTax : militaryTax / 12);
    chartLabels.push('Військовий збір');
  }
  
  if (esv > 0) {
    chartData.push(isAnnual ? esv : esv / 12);
    chartLabels.push('ЄСВ');
  }
  
  chartData.push(isAnnual ? netIncome : netIncome);
  chartLabels.push('Чистий дохід');
  
  window.incomeTaxChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
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
              const total = chartData.reduce((sum, val) => sum + val, 0);
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
}

function formatNumber(num) {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(num));
}