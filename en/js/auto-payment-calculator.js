document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('auto-payment-form');
  const result = document.getElementById('auto-payment-result');
  const affordabilityDiv = document.getElementById('affordability-analysis');
  const comparisonDiv = document.getElementById('loan-comparison');
  const leaseVsBuyDiv = document.getElementById('lease-vs-buy');
  const totalCostDiv = document.getElementById('total-cost-analysis');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateAutoPayment();
  });

  // Toggle custom term field
  document.getElementById('loanTerm').addEventListener('change', function() {
    const customField = document.getElementById('customTerm');
    const isCustom = this.value === 'custom';
    customField.style.display = isCustom ? 'block' : 'none';
    customField.required = isCustom;
  });

  function calculateAutoPayment() {
    const vehiclePrice = parseFloat(document.getElementById('vehiclePrice').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const tradeInValue = parseFloat(document.getElementById('tradeInValue').value) || 0;
    const tradeInOwed = parseFloat(document.getElementById('tradeInOwed').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTermSelect = document.getElementById('loanTerm').value;
    const customTerm = parseFloat(document.getElementById('customTerm').value);
    const salesTax = parseFloat(document.getElementById('salesTax').value) || 0;
    const additionalFees = parseFloat(document.getElementById('additionalFees').value) || 0;
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    const analysisType = document.getElementById('analysisType').value;

    if (!vehiclePrice || !interestRate || (!loanTermSelect && !customTerm)) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    const loanTerm = loanTermSelect === 'custom' ? customTerm : parseFloat(loanTermSelect);
    
    // Calculate loan amount
    const netTradeIn = Math.max(0, tradeInValue - tradeInOwed);
    const totalVehicleCost = vehiclePrice + (vehiclePrice * salesTax / 100) + additionalFees;
    const loanAmount = totalVehicleCost - downPayment - netTradeIn;

    if (loanAmount <= 0) {
      result.innerHTML = '<div class="error">Down payment and trade-in value exceed vehicle cost.</div>';
      return;
    }

    // Calculate monthly payment
    const monthlyRate = interestRate / 12 / 100;
    let monthlyPayment;
    
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / loanTerm;
    } else {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                     (Math.pow(1 + monthlyRate, loanTerm) - 1);
    }

    const totalInterest = (monthlyPayment * loanTerm) - loanAmount;
    const totalCost = totalVehicleCost + totalInterest;

    // Perform different types of analysis
    switch(analysisType) {
      case 'payment':
        displayPaymentResults(vehiclePrice, loanAmount, monthlyPayment, totalInterest, totalCost, loanTerm);
        break;
      case 'affordability':
        displayAffordabilityAnalysis(monthlyPayment, monthlyIncome, vehiclePrice, loanAmount);
        break;
      case 'lease-vs-buy':
        displayLeaseVsBuyAnalysis(monthlyPayment, totalCost, loanTerm);
        break;
      case 'term-comparison':
        displayTermComparison(loanAmount, interestRate);
        break;
    }

    if (document.getElementById('showAffordability').checked) {
      showAffordabilityGuidelines(monthlyPayment, monthlyIncome);
    }

    if (document.getElementById('includeInsurance').checked || document.getElementById('includeMaintenance').checked) {
      showTotalCostOfOwnership(vehiclePrice, monthlyPayment, loanTerm);
    }
  }

  function displayPaymentResults(vehiclePrice, loanAmount, monthlyPayment, totalInterest, totalCost, loanTerm) {
    const downPaymentPct = ((vehiclePrice - loanAmount) / vehiclePrice * 100);
    const interestPct = (totalInterest / loanAmount * 100);

    let resultHtml = `
      <div class="result-summary">
        <h3>🚗 Auto Loan Payment Summary</h3>
        <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="result-item highlight">
            <strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Loan Amount:</strong> $${loanAmount.toLocaleString()}
          </div>
          <div class="result-item">
            <strong>Total Interest:</strong> $${totalInterest.toLocaleString()}
          </div>
          <div class="result-item">
            <strong>Total Cost:</strong> $${totalCost.toLocaleString()}
          </div>
        </div>
      </div>

      <div class="loan-breakdown" style="margin-top: 1.5rem;">
        <h4>💰 Loan Breakdown</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div><strong>Vehicle Price:</strong> $${vehiclePrice.toLocaleString()}</div>
          <div><strong>Down Payment:</strong> $${(vehiclePrice - loanAmount).toLocaleString()} (${downPaymentPct.toFixed(1)}%)</div>
          <div><strong>Loan Term:</strong> ${loanTerm} months (${(loanTerm/12).toFixed(1)} years)</div>
          <div><strong>Interest Rate:</strong> ${document.getElementById('interestRate').value}% APR</div>
        </div>
      </div>
    `;

    // Add payment insights
    resultHtml += `
      <div class="payment-insights" style="margin-top: 1.5rem;">
        <h4>💡 Payment Insights</h4>
        <ul>
    `;

    if (interestPct > 30) {
      resultHtml += `<li class="warning"><strong>High Interest Cost:</strong> ${interestPct.toFixed(1)}% of loan amount goes to interest</li>`;
    }

    if (loanTerm > 60) {
      resultHtml += `<li class="warning"><strong>Long Term:</strong> ${(loanTerm/12).toFixed(1)} year loan may outlast vehicle reliability</li>`;
    }

    if (downPaymentPct < 10) {
      resultHtml += `<li class="warning"><strong>Low Down Payment:</strong> Consider larger down payment to reduce monthly costs</li>`;
    }

    if (downPaymentPct >= 20) {
      resultHtml += `<li class="highlight"><strong>Good Down Payment:</strong> ${downPaymentPct.toFixed(1)}% down helps avoid being upside down</li>`;
    }

    resultHtml += `
        </ul>
      </div>
    `;

    // Interest vs principal breakdown for first year
    resultHtml += generatePaymentSchedule(loanAmount, monthlyPayment, parseFloat(document.getElementById('interestRate').value) / 100, 12);

    result.innerHTML = resultHtml;
  }

  function generatePaymentSchedule(loanAmount, monthlyPayment, annualRate, months) {
    const monthlyRate = annualRate / 12;
    let balance = loanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;

    let scheduleHtml = `
      <div class="payment-schedule" style="margin-top: 1.5rem;">
        <h4>📊 First Year Payment Breakdown</h4>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Month</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Payment</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Principal</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Interest</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Balance</th>
              </tr>
            </thead>
            <tbody>
    `;

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;

      scheduleHtml += `
        <tr>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">${month}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${monthlyPayment.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${principalPayment.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${interestPayment.toFixed(2)}</td>
          <td style="padding: 0.5rem; border: 1px solid #ddd;">$${balance.toFixed(2)}</td>
        </tr>
      `;
    }

    scheduleHtml += `
            </tbody>
          </table>
        </div>
        <div style="margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          <div><strong>Year 1 Interest:</strong> $${totalInterest.toFixed(2)}</div>
          <div><strong>Year 1 Principal:</strong> $${totalPrincipal.toFixed(2)}</div>
          <div><strong>Remaining Balance:</strong> $${balance.toFixed(2)}</div>
        </div>
      </div>
    `;

    return scheduleHtml;
  }

  function displayAffordabilityAnalysis(monthlyPayment, monthlyIncome, vehiclePrice, loanAmount) {
    if (!monthlyIncome) {
      result.innerHTML = '<div class="error">Please enter monthly income for affordability analysis.</div>';
      return;
    }

    const paymentToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;
    const maxRecommendedPayment = monthlyIncome * 0.15; // 15% of income
    const maxAffordableVehicle = calculateAffordableVehiclePrice(monthlyIncome);

    let resultHtml = `
      <div class="affordability-summary">
        <h3>💰 Auto Affordability Analysis</h3>
        <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="result-item">
            <strong>Monthly Income:</strong> $${monthlyIncome.toLocaleString()}
          </div>
          <div class="result-item ${paymentToIncomeRatio > 15 ? 'warning' : 'highlight'}">
            <strong>Payment-to-Income:</strong> ${paymentToIncomeRatio.toFixed(1)}%
          </div>
          <div class="result-item">
            <strong>Recommended Max Payment:</strong> $${maxRecommendedPayment.toFixed(2)}
          </div>
          <div class="result-item">
            <strong>Affordable Vehicle Price:</strong> $${maxAffordableVehicle.toLocaleString()}
          </div>
        </div>
      </div>
    `;

    // Affordability assessment
    resultHtml += `
      <div class="affordability-assessment" style="margin-top: 1.5rem;">
        <h4>📊 Affordability Assessment</h4>
    `;

    if (paymentToIncomeRatio <= 10) {
      resultHtml += `
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 0.5rem; padding: 1rem;">
          <h5 style="color: #155724;">✅ Very Affordable</h5>
          <p style="color: #155724; margin: 0;">This payment represents ${paymentToIncomeRatio.toFixed(1)}% of your income, well within recommended guidelines.</p>
        </div>
      `;
    } else if (paymentToIncomeRatio <= 15) {
      resultHtml += `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 0.5rem; padding: 1rem;">
          <h5 style="color: #856404;">⚠️ Manageable</h5>
          <p style="color: #856404; margin: 0;">This payment is at the upper limit of recommended guidelines (${paymentToIncomeRatio.toFixed(1)}% of income).</p>
        </div>
      `;
    } else {
      resultHtml += `
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 0.5rem; padding: 1rem;">
          <h5 style="color: #721c24;">❌ Over Budget</h5>
          <p style="color: #721c24; margin: 0;">This payment (${paymentToIncomeRatio.toFixed(1)}% of income) exceeds recommended guidelines and may strain your budget.</p>
        </div>
      `;
    }

    resultHtml += `
      </div>
    `;

    result.innerHTML = resultHtml;
    showAffordabilityGuidelines(monthlyPayment, monthlyIncome);
  }

  function calculateAffordableVehiclePrice(monthlyIncome) {
    const maxPayment = monthlyIncome * 0.15;
    const assumedRate = 0.065; // 6.5% APR
    const assumedTerm = 60; // 5 years
    const assumedDownPayment = 0.20; // 20%
    
    const monthlyRate = assumedRate / 12;
    const loanAmount = maxPayment * (Math.pow(1 + monthlyRate, assumedTerm) - 1) / 
                     (monthlyRate * Math.pow(1 + monthlyRate, assumedTerm));
    
    return loanAmount / (1 - assumedDownPayment);
  }

  function displayTermComparison(loanAmount, interestRate) {
    const terms = [36, 48, 60, 72, 84];
    const comparisonBody = document.getElementById('comparison-body');
    comparisonBody.innerHTML = '';

    const basePayment = calculateMonthlyPayment(loanAmount, interestRate, 60);
    const baseInterest = (basePayment * 60) - loanAmount;

    terms.forEach(term => {
      const payment = calculateMonthlyPayment(loanAmount, interestRate, term);
      const totalInterest = (payment * term) - loanAmount;
      const totalCost = loanAmount + totalInterest;
      const interestDiff = totalInterest - baseInterest;

      const row = document.createElement('tr');
      const savingsClass = interestDiff < 0 ? 'style="background: #d4edda;"' : '';
      
      row.innerHTML = `
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${savingsClass}>${term} months (${(term/12).toFixed(1)} years)</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${savingsClass}>$${payment.toFixed(2)}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${savingsClass}>$${totalInterest.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${savingsClass}>$${totalCost.toLocaleString()}</td>
        <td style="padding: 0.5rem; border: 1px solid #ddd;" ${savingsClass}>${interestDiff >= 0 ? '+' : ''}$${interestDiff.toLocaleString()}</td>
      `;
      comparisonBody.appendChild(row);
    });

    comparisonDiv.style.display = 'block';
  }

  function displayLeaseVsBuyAnalysis(buyPayment, buyTotalCost, buyTerm) {
    const leasePayment = parseFloat(document.getElementById('leasePrice').value);
    const leaseTerm = parseFloat(document.getElementById('leaseTerm').value);
    const totalLeasePayments = leasePayment * leaseTerm;

    // Calculate costs for lease vs buy over same period
    const buyPaymentsForLeaseTerm = buyPayment * leaseTerm;
    const vehiclePrice = parseFloat(document.getElementById('vehiclePrice').value);
    const estimatedValueAfterLease = vehiclePrice * (1 - (0.15 * leaseTerm / 12)); // 15% depreciation per year

    let leaseVsBuyHtml = `
      <div class="lease-vs-buy-analysis">
        <h4>🆚 Lease vs Buy Comparison (${leaseTerm} months)</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem;">
          <div style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 0.5rem; padding: 1rem;">
            <h5 style="color: #0c5460;">🚗 Leasing</h5>
            <div><strong>Monthly Payment:</strong> $${leasePayment.toFixed(2)}</div>
            <div><strong>Total Payments:</strong> $${totalLeasePayments.toLocaleString()}</div>
            <div><strong>Down Payment:</strong> Usually lower</div>
            <div><strong>Ownership:</strong> No equity built</div>
            <div><strong>Mileage:</strong> Restrictions apply</div>
            <div><strong>Wear & Tear:</strong> Charges may apply</div>
          </div>
          
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 0.5rem; padding: 1rem;">
            <h5 style="color: #155724;">💰 Buying</h5>
            <div><strong>Monthly Payment:</strong> $${buyPayment.toFixed(2)}</div>
            <div><strong>Payments for ${leaseTerm} months:</strong> $${buyPaymentsForLeaseTerm.toLocaleString()}</div>
            <div><strong>Estimated Value:</strong> $${estimatedValueAfterLease.toLocaleString()}</div>
            <div><strong>Net Cost:</strong> $${(buyPaymentsForLeaseTerm - estimatedValueAfterLease).toLocaleString()}</div>
            <div><strong>Ownership:</strong> Building equity</div>
            <div><strong>Freedom:</strong> No restrictions</div>
          </div>
        </div>

        <h5>Financial Comparison</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div><strong>Lease Total Cost:</strong> $${totalLeasePayments.toLocaleString()}</div>
          <div><strong>Buy Net Cost:</strong> $${(buyPaymentsForLeaseTerm - estimatedValueAfterLease).toLocaleString()}</div>
          <div><strong>Difference:</strong> ${totalLeasePayments > (buyPaymentsForLeaseTerm - estimatedValueAfterLease) ? 'Buying saves' : 'Leasing saves'} $${Math.abs(totalLeasePayments - (buyPaymentsForLeaseTerm - estimatedValueAfterLease)).toLocaleString()}</div>
        </div>
      </div>
    `;

    // Recommendations
    leaseVsBuyHtml += `
      <div style="margin-top: 1.5rem;">
        <h5>🎯 Recommendations</h5>
    `;

    if (totalLeasePayments < (buyPaymentsForLeaseTerm - estimatedValueAfterLease)) {
      leaseVsBuyHtml += `
        <div style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 0.5rem; padding: 1rem;">
          <p style="color: #0c5460; margin: 0;"><strong>Consider Leasing if:</strong> You drive less than 15,000 miles/year, want lower payments, always want a newer car, and don't mind continuous payments.</p>
        </div>
      `;
    } else {
      leaseVsBuyHtml += `
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 0.5rem; padding: 1rem;">
          <p style="color: #155724; margin: 0;"><strong>Consider Buying if:</strong> You drive more than 15,000 miles/year, want to build equity, plan to keep the car long-term, or want freedom from restrictions.</p>
        </div>
      `;
    }

    leaseVsBuyHtml += `
      </div>
    `;

    document.getElementById('lease-buy-details').innerHTML = leaseVsBuyHtml;
    leaseVsBuyDiv.style.display = 'block';
  }

  function showAffordabilityGuidelines(monthlyPayment, monthlyIncome) {
    if (!monthlyIncome) return;

    const otherDebts = parseFloat(document.getElementById('otherDebts').value) || 0;
    const totalTransportationBudget = monthlyIncome * 0.20; // 20% for total transportation
    const estimatedInsurance = estimateInsurance();
    const estimatedFuel = estimateFuelCost();
    const estimatedMaintenance = estimateMaintenance();
    const totalTransportationCost = monthlyPayment + estimatedInsurance + estimatedFuel + estimatedMaintenance;

    const affordabilityHtml = `
      <div class="affordability-guidelines">
        <h4>📋 Affordability Guidelines</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div><strong>Monthly Income:</strong> $${monthlyIncome.toLocaleString()}</div>
          <div><strong>Current Car Payment:</strong> $${monthlyPayment.toFixed(2)}</div>
          <div><strong>Estimated Insurance:</strong> $${estimatedInsurance.toFixed(2)}</div>
          <div><strong>Estimated Fuel:</strong> $${estimatedFuel.toFixed(2)}</div>
          <div><strong>Estimated Maintenance:</strong> $${estimatedMaintenance.toFixed(2)}</div>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 0.5rem; padding: 1rem;">
          <h5>Transportation Budget Analysis</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div><strong>Total Transportation Cost:</strong> $${totalTransportationCost.toFixed(2)}</div>
            <div><strong>Recommended Budget (20%):</strong> $${totalTransportationBudget.toFixed(2)}</div>
            <div><strong>Budget Status:</strong> ${totalTransportationCost <= totalTransportationBudget ? '✅ Within budget' : '⚠️ Over budget'}</div>
            <div><strong>Remaining Budget:</strong> $${Math.max(0, totalTransportationBudget - totalTransportationCost).toFixed(2)}</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('affordability-details').innerHTML = affordabilityHtml;
    affordabilityDiv.style.display = 'block';
  }

  function showTotalCostOfOwnership(vehiclePrice, monthlyPayment, loanTerm) {
    const estimatedInsurance = estimateInsurance() * loanTerm;
    const estimatedFuel = estimateFuelCost() * loanTerm;
    const estimatedMaintenance = estimateMaintenance() * loanTerm;
    const estimatedRegistration = 150 * (loanTerm / 12); // Annual registration
    const totalLoanPayments = monthlyPayment * loanTerm;
    const totalOwnershipCost = totalLoanPayments + estimatedInsurance + estimatedFuel + estimatedMaintenance + estimatedRegistration;

    const costBreakdownHtml = `
      <div class="total-cost-breakdown">
        <h4>💸 ${(loanTerm/12).toFixed(1)}-Year Total Cost of Ownership</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div><strong>Loan Payments:</strong> $${totalLoanPayments.toLocaleString()}</div>
          <div><strong>Insurance:</strong> $${estimatedInsurance.toLocaleString()}</div>
          <div><strong>Fuel:</strong> $${estimatedFuel.toLocaleString()}</div>
          <div><strong>Maintenance:</strong> $${estimatedMaintenance.toLocaleString()}</div>
          <div><strong>Registration/Fees:</strong> $${estimatedRegistration.toLocaleString()}</div>
          <div><strong>Total Cost:</strong> $${totalOwnershipCost.toLocaleString()}</div>
        </div>
        
        <div style="margin-top: 1rem; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 0.5rem; padding: 1rem;">
          <h5 style="color: #856404;">📊 Cost Breakdown</h5>
          <div style="color: #856404;">
            <div><strong>Vehicle Payment:</strong> ${((totalLoanPayments / totalOwnershipCost) * 100).toFixed(1)}% of total cost</div>
            <div><strong>Operating Costs:</strong> ${(((totalOwnershipCost - totalLoanPayments) / totalOwnershipCost) * 100).toFixed(1)}% of total cost</div>
            <div><strong>Monthly Average:</strong> $${(totalOwnershipCost / loanTerm).toFixed(2)}</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('cost-breakdown').innerHTML = costBreakdownHtml;
    totalCostDiv.style.display = 'block';
  }

  function calculateMonthlyPayment(loanAmount, annualRate, termMonths) {
    const monthlyRate = annualRate / 12 / 100;
    
    if (monthlyRate === 0) {
      return loanAmount / termMonths;
    }
    
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
           (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  function estimateInsurance() {
    const vehiclePrice = parseFloat(document.getElementById('vehiclePrice').value);
    const vehicleType = document.getElementById('vehicleType').value;
    
    // Basic insurance estimation based on vehicle value and type
    let baseRate = vehiclePrice * 0.01 / 12; // 1% annually
    
    if (vehicleType === 'new') baseRate *= 1.2;
    else if (vehicleType === 'used-recent') baseRate *= 1.0;
    else baseRate *= 0.8;
    
    return Math.max(100, baseRate); // Minimum $100/month
  }

  function estimateFuelCost() {
    // Estimate based on average driving (12,000 miles/year)
    const avgMPG = 25;
    const avgGasPrice = 3.50;
    const annualMiles = 12000;
    
    return (annualMiles / avgMPG * avgGasPrice) / 12;
  }

  function estimateMaintenance() {
    const vehicleType = document.getElementById('vehicleType').value;
    const vehiclePrice = parseFloat(document.getElementById('vehiclePrice').value);
    
    // Estimate maintenance as percentage of vehicle value
    let annualMaintenanceRate = 0.03; // 3% for new cars
    
    if (vehicleType === 'used-recent') annualMaintenanceRate = 0.04;
    else if (vehicleType === 'used-older') annualMaintenanceRate = 0.06;
    
    return (vehiclePrice * annualMaintenanceRate) / 12;
  }

  // Update interest rate suggestions based on credit score
  document.getElementById('creditScore').addEventListener('change', function() {
    const interestRateField = document.getElementById('interestRate');
    const vehicleType = document.getElementById('vehicleType').value;
    
    const rateRanges = {
      'excellent': { new: 5.5, used: 6.5 },
      'good': { new: 7.5, used: 9.0 },
      'fair': { new: 12.0, used: 15.0 },
      'poor': { new: 18.0, used: 20.0 },
      'unknown': { new: 8.0, used: 10.0 }
    };
    
    const isNew = vehicleType === 'new' || vehicleType === 'certified';
    const suggestedRate = rateRanges[this.value][isNew ? 'new' : 'used'];
    
    interestRateField.value = suggestedRate;
  });
});