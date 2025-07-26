document.getElementById("salary-gross-net-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const calculationType = document.getElementById("calculationType").value;
  const salaryAmount = parseFloat(document.getElementById("salaryAmount").value) || 0;
  const salaryPeriod = document.getElementById("salaryPeriod").value;
  const includePSP = document.getElementById("includePSP").checked;
  const residencyStatus = document.getElementById("residencyStatus").value;
  const militaryStatus = document.getElementById("militaryStatus").value;
  const disabilityGroup = document.getElementById("disabilityGroup").value;
  const hasMinorChildren = document.getElementById("hasMinorChildren").checked;
  const workingHours = parseInt(document.getElementById("workingHours").value) || 160;
  const workingDays = parseInt(document.getElementById("workingDays").value) || 20;
  const bonuses = parseFloat(document.getElementById("bonuses").value) || 0;
  const materialAid = parseFloat(document.getElementById("materialAid").value) || 0;
  const showEmployerCosts = document.getElementById("showEmployerCosts").checked;

  // Константи для розрахунків (2024)
  const PDFO_RATE_RESIDENT = 0.18;
  const PDFO_RATE_NON_RESIDENT = 0.20;
  const MILITARY_TAX_RATE = 0.015;
  const ESV_EMPLOYEE_RATE = 0.03;
  const ESV_EMPLOYER_RATE = 0.22;
  const MINIMUM_WAGE = 7100;
  const LIVING_WAGE = 2759;
  const PSP_AMOUNT = Math.round(LIVING_WAGE * 0.5); // 1379 грн
  const PSP_THRESHOLD_MIN = PSP_AMOUNT * 3; // 4137 грн
  const PSP_THRESHOLD_MAX = PSP_AMOUNT * 6; // 8274 грн
  const MAX_ESV_BASE = MINIMUM_WAGE * 25; // 177,500 грн

  // Конвертація до щомісячної суми
  let monthlySalary = salaryAmount;
  if (salaryPeriod === 'yearly') {
    monthlySalary = salaryAmount / 12;
  } else if (salaryPeriod === 'hourly') {
    monthlySalary = salaryAmount * workingHours;
  }

  if (monthlySalary < 0) {
    document.getElementById("salary-gross-net-result").innerHTML = 
      '<p style="color: red;">Сума зарплати не може бути від\'ємною.</p>';
    return;
  }

  let calculation = {};

  if (calculationType === 'gross-to-net') {
    calculation = calculateNetFromGross(monthlySalary, bonuses, includePSP, residencyStatus, militaryStatus, disabilityGroup);
  } else if (calculationType === 'net-to-gross') {
    calculation = calculateGrossFromNet(monthlySalary, bonuses, includePSP, residencyStatus, militaryStatus, disabilityGroup);
  } else if (calculationType === 'employer-cost') {
    const grossCalc = calculateNetFromGross(monthlySalary, bonuses, includePSP, residencyStatus, militaryStatus, disabilityGroup);
    calculation = {...grossCalc, isEmployerCost: true};
  }

  // Розрахунок різних періодів
  const periodCalculations = calculatePeriods(calculation, workingHours, workingDays);
  
  // Розрахунок витрат роботодавця
  const employerESV = Math.min(calculation.grossSalary, MAX_ESV_BASE) * ESV_EMPLOYER_RATE;
  const totalEmployerCost = calculation.grossSalary + employerESV;

  const resultHTML = `
    <div class="calculation-results">
      <h3>💼 Результати розрахунку зарплати</h3>
      
      <div class="results-grid">
        <div class="result-section highlight-section">
          <h4>💰 Основні результати</h4>
          <div class="result-item highlight-total">
            <span class="label"><strong>Брутто зарплата:</strong></span>
            <span class="value"><strong>${formatNumber(calculation.grossSalary)} грн/місяць</strong></span>
          </div>
          <div class="result-item highlight-total">
            <span class="label"><strong>Нетто зарплата (на руки):</strong></span>
            <span class="value"><strong>${formatNumber(calculation.netSalary)} грн/місяць</strong></span>
          </div>
          <div class="result-item">
            <span class="label">Ефективна ставка податків:</span>
            <span class="value">${((calculation.totalTaxes / calculation.grossSalary) * 100).toFixed(1)}%</span>
          </div>
          ${calculation.isEmployerCost ? `
          <div class="result-item highlight">
            <span class="label">Загальні витрати роботодавця:</span>
            <span class="value">${formatNumber(totalEmployerCost)} грн/місяць</span>
          </div>
          ` : ''}
        </div>
        
        <div class="result-section">
          <h4>🏛️ Податки та збори</h4>
          ${calculation.psp > 0 ? `
          <div class="result-item success">
            <span class="label">Податкова соціальна пільга:</span>
            <span class="value">${formatNumber(calculation.psp)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">База оподаткування ПДФО:</span>
            <span class="value">${formatNumber(calculation.pdfoBase)} грн</span>
          </div>
          ` : `
          <div class="result-item">
            <span class="label">База оподаткування ПДФО:</span>
            <span class="value">${formatNumber(calculation.pdfoBase)} грн</span>
          </div>
          `}
          <div class="result-item">
            <span class="label">ПДФО (${residencyStatus === 'resident' ? '18' : '20'}%):</span>
            <span class="value">${formatNumber(calculation.pdfo)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Військовий збір (1.5%):</span>
            <span class="value">${formatNumber(calculation.militaryTax)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">ЄСВ працівника (3%):</span>
            <span class="value">${formatNumber(calculation.esvEmployee)} грн</span>
          </div>
          ${showEmployerCosts ? `
          <div class="result-item">
            <span class="label">ЄСВ роботодавця (22%):</span>
            <span class="value">${formatNumber(employerESV)} грн</span>
          </div>
          ` : ''}
          <div class="result-item highlight">
            <span class="label"><strong>Всього утримано:</strong></span>
            <span class="value"><strong>${formatNumber(calculation.totalTaxes)} грн</strong></span>
          </div>
        </div>
        
        <div class="result-section">
          <h4>📅 Зарплата за періодами</h4>
          <div class="result-item">
            <span class="label">Річна брутто:</span>
            <span class="value">${formatNumber(periodCalculations.yearlyGross)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Річна нетто:</span>
            <span class="value">${formatNumber(periodCalculations.yearlyNet)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Денна нетто:</span>
            <span class="value">${formatNumber(periodCalculations.dailyNet)} грн</span>
          </div>
          <div class="result-item">
            <span class="label">Погодинна нетто:</span>
            <span class="value">${formatNumber(periodCalculations.hourlyNet)} грн</span>
          </div>
          ${bonuses > 0 ? `
          <div class="result-item">
            <span class="label">Премії (нетто):</span>
            <span class="value">${formatNumber(periodCalculations.bonusesNet)} грн/місяць</span>
          </div>
          ` : ''}
        </div>
        
        ${calculation.exemptions && calculation.exemptions.length > 0 ? `
        <div class="result-section success-section">
          <h4>🎯 Пільги та звільнення</h4>
          ${calculation.exemptions.map(exemption => `
          <div class="result-item success">
            <span class="label">${exemption.type}:</span>
            <span class="value">${exemption.description}</span>
          </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
      
      ${showEmployerCosts ? `
      <div class="employer-section">
        <h4>🏢 Витрати роботодавця</h4>
        <div class="employer-breakdown">
          <div class="employer-item">
            <span class="label">Нарахована зарплата:</span>
            <span class="value">${formatNumber(calculation.grossSalary)} грн</span>
          </div>
          <div class="employer-item">
            <span class="label">ЄСВ роботодавця (22%):</span>
            <span class="value">${formatNumber(employerESV)} грн</span>
          </div>
          <div class="employer-item highlight">
            <span class="label"><strong>Загальні витрати на місяць:</strong></span>
            <span class="value"><strong>${formatNumber(totalEmployerCost)} грн</strong></span>
          </div>
          <div class="employer-item">
            <span class="label">Річні витрати роботодавця:</span>
            <span class="value">${formatNumber(totalEmployerCost * 12)} грн</span>
          </div>
        </div>
      </div>
      ` : ''}
      
      <div class="comparison-section">
        <h4>📊 Порівняльна таблиця</h4>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Показник</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Сума (грн)</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">% від брутто</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">% від витрат роботодавця</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">Брутто зарплата</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${formatNumber(calculation.grossSalary)}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">100.0%</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((calculation.grossSalary / totalEmployerCost) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">ПДФО</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${formatNumber(calculation.pdfo)}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((calculation.pdfo / calculation.grossSalary) * 100).toFixed(1)}%</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((calculation.pdfo / totalEmployerCost) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">Військовий збір</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${formatNumber(calculation.militaryTax)}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((calculation.militaryTax / calculation.grossSalary) * 100).toFixed(1)}%</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((calculation.militaryTax / totalEmployerCost) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">ЄСВ працівника</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${formatNumber(calculation.esvEmployee)}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((calculation.esvEmployee / calculation.grossSalary) * 100).toFixed(1)}%</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((calculation.esvEmployee / totalEmployerCost) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">ЄСВ роботодавця</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${formatNumber(employerESV)}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((employerESV / calculation.grossSalary) * 100).toFixed(1)}%</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${((employerESV / totalEmployerCost) * 100).toFixed(1)}%</td>
              </tr>
              <tr style="background: #e8f5e8;">
                <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>Нетто зарплата</strong></td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>${formatNumber(calculation.netSalary)}</strong></td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>${((calculation.netSalary / calculation.grossSalary) * 100).toFixed(1)}%</strong></td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>${((calculation.netSalary / totalEmployerCost) * 100).toFixed(1)}%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="info-section">
        <h4>ℹ️ Корисна інформація</h4>
        <ul>
          <li><strong>Мінімальна зарплата в Україні:</strong> ${formatNumber(MINIMUM_WAGE)} грн/місяць</li>
          <li><strong>Податкова соціальна пільга:</strong> ${formatNumber(PSP_AMOUNT)} грн при зарплаті до ${formatNumber(PSP_THRESHOLD_MIN)} грн</li>
          <li><strong>Максимальна база ЄСВ:</strong> ${formatNumber(MAX_ESV_BASE)} грн/місяць</li>
          <li><strong>Термін виплати зарплати:</strong> Не пізніше ніж кожні 16 календарних днів</li>
          <li><strong>Термін утримання податків:</strong> ПДФО та військовий збір до 15 числа, ЄСВ до 20 числа</li>
        </ul>
      </div>
    </div>
  `;

  document.getElementById("salary-gross-net-result").innerHTML = resultHTML;
  
  // Показати графік
  displaySalaryChart(calculation, employerESV);
});

function calculateNetFromGross(grossSalary, bonuses, includePSP, residencyStatus, militaryStatus, disabilityGroup) {
  const totalGross = grossSalary + bonuses;
  const exemptions = [];
  
  // Розрахунок ПСП
  let psp = 0;
  if (includePSP && militaryStatus === 'none') {
    if (grossSalary <= PSP_THRESHOLD_MIN) {
      psp = PSP_AMOUNT;
    } else if (grossSalary <= PSP_THRESHOLD_MAX) {
      psp = PSP_AMOUNT - (PSP_AMOUNT * (grossSalary - PSP_THRESHOLD_MIN) / PSP_THRESHOLD_MIN);
    }
  }
  
  // Пільги для учасників бойових дій
  let pdfoExemption = false;
  let militaryTaxExemption = false;
  
  if (militaryStatus === 'ato' || militaryStatus === 'current') {
    pdfoExemption = true;
    militaryTaxExemption = true;
    exemptions.push({
      type: "Звільнення від ПДФО та військового збору",
      description: "Учасники АТО/ООС звільнені від оподаткування"
    });
  }
  
  // Розрахунок податків
  const pdfoBase = Math.max(0, totalGross - psp);
  const pdfoRate = residencyStatus === 'resident' ? PDFO_RATE_RESIDENT : PDFO_RATE_NON_RESIDENT;
  const pdfo = pdfoExemption ? 0 : pdfoBase * pdfoRate;
  const militaryTax = militaryTaxExemption ? 0 : totalGross * MILITARY_TAX_RATE;
  
  // ЄСВ
  const maxESVBase = Math.min(totalGross, MAX_ESV_BASE);
  const esvEmployee = maxESVBase * ESV_EMPLOYEE_RATE;
  
  const totalTaxes = pdfo + militaryTax + esvEmployee;
  const netSalary = totalGross - totalTaxes;
  
  return {
    grossSalary: totalGross,
    netSalary,
    pdfoBase,
    pdfo,
    militaryTax,
    esvEmployee,
    totalTaxes,
    psp,
    exemptions
  };
}

function calculateGrossFromNet(targetNet, bonuses, includePSP, residencyStatus, militaryStatus, disabilityGroup) {
  // Ітеративний метод для знаходження брутто зарплати
  let grossGuess = targetNet * 1.3; // Початкове припущення
  let iterations = 0;
  const maxIterations = 50;
  const tolerance = 1; // 1 грн точності
  
  while (iterations < maxIterations) {
    const calculation = calculateNetFromGross(grossGuess - bonuses, bonuses, includePSP, residencyStatus, militaryStatus, disabilityGroup);
    const netDifference = calculation.netSalary - targetNet;
    
    if (Math.abs(netDifference) < tolerance) {
      return calculation;
    }
    
    // Коригування оцінки
    if (netDifference > 0) {
      grossGuess -= Math.abs(netDifference) * 1.1;
    } else {
      grossGuess += Math.abs(netDifference) * 1.1;
    }
    
    iterations++;
  }
  
  // Якщо не вдалося знайти точне значення, повертаємо найближче
  return calculateNetFromGross(grossGuess - bonuses, bonuses, includePSP, residencyStatus, militaryStatus, disabilityGroup);
}

function calculatePeriods(calculation, workingHours, workingDays) {
  const yearlyGross = calculation.grossSalary * 12;
  const yearlyNet = calculation.netSalary * 12;
  const dailyNet = calculation.netSalary / workingDays;
  const hourlyNet = calculation.netSalary / workingHours;
  
  // Бонуси (якщо є)
  const bonusesNet = calculation.grossSalary > calculation.netSalary ? 
    calculation.grossSalary - calculation.netSalary : 0;
  
  return {
    yearlyGross,
    yearlyNet,
    dailyNet,
    hourlyNet,
    bonusesNet
  };
}

function displaySalaryChart(calculation, employerESV) {
  const chartBlock = document.getElementById("salary-chart-block");
  const canvas = document.getElementById("salary-chart");
  const ctx = canvas.getContext("2d");
  
  chartBlock.style.display = "block";
  
  // Очистити попередній графік
  if (window.salaryChart) {
    window.salaryChart.destroy();
  }
  
  window.salaryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'Нетто зарплата',
        'ПДФО',
        'Військовий збір', 
        'ЄСВ працівника',
        'ЄСВ роботодавця'
      ],
      datasets: [{
        data: [
          calculation.netSalary,
          calculation.pdfo,
          calculation.militaryTax,
          calculation.esvEmployee,
          employerESV
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)'
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
              const total = calculation.grossSalary + employerESV;
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