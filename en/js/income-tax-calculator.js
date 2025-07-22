document.getElementById("tax-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const filingStatus = document.getElementById("filingStatus").value;
  const age = parseInt(document.getElementById("age").value) || 0;
  const spouseAge = parseInt(document.getElementById("spouseAge").value) || 0;
  const dependents = parseInt(document.getElementById("dependents").value) || 0;
  const qualifyingChildren = parseInt(document.getElementById("qualifyingChildren").value) || 0;
  const annualIncome = parseFloat(document.getElementById("annualIncome").value) || 0;
  const spouseIncome = parseFloat(document.getElementById("spouseIncome").value) || 0;
  const otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
  const selfEmploymentIncome = parseFloat(document.getElementById("selfEmploymentIncome").value) || 0;
  const capitalGains = parseFloat(document.getElementById("capitalGains").value) || 0;
  const state = document.getElementById("state").value;
  const federalWithheld = parseFloat(document.getElementById("federalWithheld").value) || 0;
  const stateWithheld = parseFloat(document.getElementById("stateWithheld").value) || 0;
  const socialSecurityWithheld = parseFloat(document.getElementById("socialSecurityWithheld").value) || 0;
  const medicareWithheld = parseFloat(document.getElementById("medicareWithheld").value) || 0;
  const deductionType = document.getElementById("deductionType").value;
  const saltDeduction = parseFloat(document.getElementById("saltDeduction").value) || 0;
  const mortgageInterest = parseFloat(document.getElementById("mortgageInterest").value) || 0;
  const charitableGiving = parseFloat(document.getElementById("charitableGiving").value) || 0;
  const retirementContributions = parseFloat(document.getElementById("retirementContributions").value) || 0;
  const hsaContributions = parseFloat(document.getElementById("hsaContributions").value) || 0;

  // Calculate total income
  const totalIncome = annualIncome + spouseIncome + otherIncome + selfEmploymentIncome + capitalGains;
  
  // Calculate adjusted gross income (AGI)
  const seDeduction = selfEmploymentIncome * 0.0765; // Half of SE tax
  const agi = totalIncome - retirementContributions - hsaContributions - seDeduction;

  // Calculate standard deduction
  const standardDeduction = getStandardDeduction(filingStatus, age, spouseAge);
  
  // Calculate itemized deductions
  const itemizedDeductions = Math.min(saltDeduction, 10000) + mortgageInterest + charitableGiving;
  
  // Determine which deduction to use
  let deductionUsed;
  let deductionAmount;
  
  if (deductionType === "itemized") {
    deductionUsed = "Itemized";
    deductionAmount = itemizedDeductions;
  } else if (deductionType === "compare") {
    if (itemizedDeductions > standardDeduction) {
      deductionUsed = "Itemized";
      deductionAmount = itemizedDeductions;
    } else {
      deductionUsed = "Standard";
      deductionAmount = standardDeduction;
    }
  } else {
    deductionUsed = "Standard";
    deductionAmount = standardDeduction;
  }

  // Calculate taxable income
  const taxableIncome = Math.max(0, agi - deductionAmount);

  // Calculate federal income tax
  const federalTax = calculateFederalTax(taxableIncome, filingStatus);
  
  // Calculate state tax
  const stateTax = calculateStateTax(agi, state, filingStatus);
  
  // Calculate FICA taxes
  const ficaTaxes = calculateFICATaxes(annualIncome + spouseIncome, selfEmploymentIncome, filingStatus);
  
  // Calculate tax credits
  const credits = calculateTaxCredits(agi, qualifyingChildren, dependents, filingStatus);
  
  // Calculate final tax liability
  const totalFederalTax = Math.max(0, federalTax - credits);
  const totalTaxes = totalFederalTax + stateTax + ficaTaxes.socialSecurity + ficaTaxes.medicare + ficaTaxes.additionalMedicare;
  
  // Calculate withholdings and refund/owed
  const totalWithheld = federalWithheld + stateWithheld + socialSecurityWithheld + medicareWithheld;
  const refundOrOwed = totalWithheld - totalTaxes;
  
  // Calculate effective and marginal tax rates
  const effectiveRate = totalIncome > 0 ? (totalTaxes / totalIncome) * 100 : 0;
  const marginalRate = getMarginalTaxRate(taxableIncome, filingStatus);

  document.getElementById("tax-result").innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
      <div>
        <h4>💰 Income Summary</h4>
        <p><strong>Total Income:</strong> $${totalIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Adjusted Gross Income:</strong> $${agi.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>${deductionUsed} Deduction:</strong> $${deductionAmount.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Taxable Income:</strong> $${taxableIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
      
      <div>
        <h4>🏛️ Federal Taxes</h4>
        <p><strong>Federal Income Tax:</strong> $${federalTax.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Tax Credits:</strong> -$${credits.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Net Federal Tax:</strong> $${totalFederalTax.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Marginal Tax Rate:</strong> ${marginalRate.toFixed(1)}%</p>
      </div>
      
      <div>
        <h4>🏢 FICA & State Taxes</h4>
        <p><strong>Social Security:</strong> $${ficaTaxes.socialSecurity.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Medicare:</strong> $${(ficaTaxes.medicare + ficaTaxes.additionalMedicare).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>State Income Tax:</strong> $${stateTax.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>SE Tax:</strong> $${ficaTaxes.seTax.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      </div>
      
      <div>
        <h4>📊 Final Results</h4>
        <p><strong>Total Tax Liability:</strong> $${totalTaxes.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>Effective Tax Rate:</strong> ${effectiveRate.toFixed(1)}%</p>
        <p><strong>Total Withheld:</strong> $${totalWithheld.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p><strong>${refundOrOwed >= 0 ? 'Estimated Refund' : 'Amount Owed'}:</strong> 
           <span style="color: ${refundOrOwed >= 0 ? '#00b894' : '#d63031'};">
             $${Math.abs(refundOrOwed).toLocaleString('en-US', {maximumFractionDigits: 0})}
           </span>
        </p>
      </div>
    </div>
    
    ${deductionType === "compare" ? `
    <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 0.5rem;">
      <h4>📋 Deduction Comparison</h4>
      <p><strong>Standard Deduction:</strong> $${standardDeduction.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      <p><strong>Itemized Deductions:</strong> $${itemizedDeductions.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
      <p><strong>Recommendation:</strong> Use ${deductionUsed.toLowerCase()} deduction for $${(Math.abs(itemizedDeductions - standardDeduction)).toLocaleString('en-US', {maximumFractionDigits: 0})} ${itemizedDeductions > standardDeduction ? 'additional' : 'less'} savings</p>
    </div>
    ` : ''}
    
    <div style="margin-top: 1.5rem; padding: 1rem; background: #e8f4fd; border-radius: 0.5rem;">
      <h4>💡 Tax Planning Tips</h4>
      <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
        ${totalIncome > 100000 ? '<li>Consider maxing out retirement contributions to reduce taxable income</li>' : ''}
        ${itemizedDeductions < standardDeduction - 2000 ? '<li>You may benefit from bunching charitable donations in alternate years</li>' : ''}
        ${Math.abs(refundOrOwed) > 1000 ? '<li>Consider adjusting your withholdings to get closer to break-even</li>' : ''}
        ${selfEmploymentIncome > 0 ? '<li>Remember to make quarterly estimated payments for self-employment income</li>' : ''}
        <li>This is an estimate - consult a tax professional for complex situations</li>
      </ul>
    </div>
  `;

  // Prepare chart data
  const chartData = {
    federal: totalFederalTax,
    state: stateTax,
    socialSecurity: ficaTaxes.socialSecurity,
    medicare: ficaTaxes.medicare + ficaTaxes.additionalMedicare,
    seTax: ficaTaxes.seTax,
    takeHome: totalIncome - totalTaxes
  };

  document.getElementById("tax-chart-block").style.display = "block";
  ensureChartJs(() => renderTaxChart(chartData));
});

function getStandardDeduction(filingStatus, age, spouseAge) {
  let base;
  switch (filingStatus) {
    case "single":
      base = 14600;
      if (age >= 65) base += 1950;
      break;
    case "marriedJoint":
      base = 29200;
      if (age >= 65) base += 1550;
      if (spouseAge >= 65) base += 1550;
      break;
    case "marriedSeparate":
      base = 14600;
      if (age >= 65) base += 1550;
      break;
    case "headOfHousehold":
      base = 21900;
      if (age >= 65) base += 1950;
      break;
    default:
      base = 14600;
  }
  return base;
}

function calculateFederalTax(taxableIncome, filingStatus) {
  const brackets = {
    single: [
      [11600, 0.10],
      [47150, 0.12],
      [100525, 0.22],
      [191950, 0.24],
      [243725, 0.32],
      [609350, 0.35],
      [Infinity, 0.37]
    ],
    marriedJoint: [
      [23200, 0.10],
      [94300, 0.12],
      [201050, 0.22],
      [383900, 0.24],
      [487450, 0.32],
      [731200, 0.35],
      [Infinity, 0.37]
    ],
    marriedSeparate: [
      [11600, 0.10],
      [47150, 0.12],
      [100525, 0.22],
      [191950, 0.24],
      [243725, 0.32],
      [365600, 0.35],
      [Infinity, 0.37]
    ],
    headOfHousehold: [
      [16550, 0.10],
      [63100, 0.12],
      [100500, 0.22],
      [191950, 0.24],
      [243725, 0.32],
      [609350, 0.35],
      [Infinity, 0.37]
    ]
  };

  const bracketSet = brackets[filingStatus] || brackets.single;
  let tax = 0;
  let previousBracket = 0;

  for (let [bracket, rate] of bracketSet) {
    if (taxableIncome <= bracket) {
      tax += (taxableIncome - previousBracket) * rate;
      break;
    } else {
      tax += (bracket - previousBracket) * rate;
      previousBracket = bracket;
    }
  }

  return tax;
}

function getMarginalTaxRate(taxableIncome, filingStatus) {
  const brackets = {
    single: [[11600, 10], [47150, 12], [100525, 22], [191950, 24], [243725, 32], [609350, 35], [Infinity, 37]],
    marriedJoint: [[23200, 10], [94300, 12], [201050, 22], [383900, 24], [487450, 32], [731200, 35], [Infinity, 37]],
    marriedSeparate: [[11600, 10], [47150, 12], [100525, 22], [191950, 24], [243725, 32], [365600, 35], [Infinity, 37]],
    headOfHousehold: [[16550, 10], [63100, 12], [100500, 22], [191950, 24], [243725, 32], [609350, 35], [Infinity, 37]]
  };

  const bracketSet = brackets[filingStatus] || brackets.single;
  
  for (let [bracket, rate] of bracketSet) {
    if (taxableIncome <= bracket) {
      return rate;
    }
  }
  return 37;
}

function calculateStateTax(agi, state, filingStatus) {
  const stateRates = {
    "CA": 0.093, "HI": 0.11, "NY": 0.109, "NJ": 0.1075, "DC": 0.0975,
    "OR": 0.099, "MN": 0.0985, "IL": 0.0495, "CT": 0.069, "ID": 0.058,
    "WI": 0.0765, "SC": 0.07, "GA": 0.0575, "IA": 0.0853, "KS": 0.057,
    "MA": 0.05, "ME": 0.0715, "MD": 0.0575, "MI": 0.0425, "MO": 0.054,
    "MT": 0.0675, "NE": 0.0684, "OH": 0.0399, "PA": 0.0307, "RI": 0.0599,
    "VT": 0.0875, "VA": 0.0575, "WV": 0.065, "AK": 0, "FL": 0, "NV": 0,
    "NH": 0, "SD": 0, "TN": 0, "TX": 0, "WA": 0, "WY": 0
  };

  const rate = stateRates[state] || 0.05; // Default 5% for unlisted states
  
  if (rate === 0) return 0;
  
  // Simplified state tax calculation (flat rate on AGI with basic deduction)
  const stateDeduction = filingStatus === "marriedJoint" ? 12000 : 6000;
  const stateTaxableIncome = Math.max(0, agi - stateDeduction);
  
  return stateTaxableIncome * rate;
}

function calculateFICATaxes(wageIncome, seIncome, filingStatus) {
  const ssMedicare = {
    ssRate: 0.062,
    medicareRate: 0.0145,
    ssWageBase: 168600,
    additionalMedicareThreshold: filingStatus === "marriedJoint" ? 250000 : 200000
  };

  // FICA on wages
  const ssWages = Math.min(wageIncome, ssMedicare.ssWageBase);
  const socialSecurity = ssWages * ssMedicare.ssRate;
  const medicare = wageIncome * ssMedicare.medicareRate;
  
  // Additional Medicare tax
  const additionalMedicare = Math.max(0, wageIncome - ssMedicare.additionalMedicareThreshold) * 0.009;
  
  // Self-employment tax
  const seTax = seIncome * 0.153; // 15.3% total SE tax
  
  return {
    socialSecurity: socialSecurity,
    medicare: medicare,
    additionalMedicare: additionalMedicare,
    seTax: seTax
  };
}

function calculateTaxCredits(agi, qualifyingChildren, dependents, filingStatus) {
  let credits = 0;
  
  // Child Tax Credit (phases out at higher incomes)
  const ctcPhaseout = filingStatus === "marriedJoint" ? 400000 : 200000;
  if (agi < ctcPhaseout) {
    credits += qualifyingChildren * 2000;
  }
  
  // Simplified credit calculation (in practice, more complex)
  return credits;
}

function renderTaxChart(data) {
  const ctx = document.getElementById("tax-chart").getContext("2d");
  
  if (window.taxChart) {
    window.taxChart.destroy();
  }
  
  window.taxChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Take Home', 'Federal Tax', 'State Tax', 'Social Security', 'Medicare', 'SE Tax'],
      datasets: [{
        data: [
          data.takeHome,
          data.federal,
          data.state,
          data.socialSecurity,
          data.medicare,
          data.seTax
        ].filter(value => value > 0),
        backgroundColor: [
          '#00b894',
          '#e17055',
          '#6c5ce7',
          '#a29bfe',
          '#fd79a8',
          '#fdcb6e'
        ],
        borderWidth: 2,
        borderColor: '#fff'
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
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return context.label + ': $' + value.toLocaleString('en-US', {maximumFractionDigits: 0}) + 
                     ' (' + percentage + '%)';
            }
          }
        }
      }
    }
  });
}

function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}