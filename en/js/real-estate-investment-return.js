document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("real-estate-form");
  const resultDiv = document.getElementById("real-estate-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateRealEstateReturns();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['property-value', 'down-payment', 'monthly-rent', 'interest-rate'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateRealEstateReturns();
      }
    });
  });

  function validateInputs() {
    const propertyValue = parseFloat(document.getElementById("property-value").value);
    const downPayment = parseFloat(document.getElementById("down-payment").value);
    const monthlyRent = parseFloat(document.getElementById("monthly-rent").value);
    
    return propertyValue > 0 && downPayment >= 0 && monthlyRent > 0;
  }

  function calculateRealEstateReturns() {
    // Get inputs
    const propertyValue = parseFloat(document.getElementById("property-value").value) || 0;
    const downPayment = parseFloat(document.getElementById("down-payment").value) || 0;
    const closingCosts = parseFloat(document.getElementById("closing-costs").value) || 0;
    const renovationCosts = parseFloat(document.getElementById("renovation-costs").value) || 0;
    const interestRate = parseFloat(document.getElementById("interest-rate").value) / 100 || 0;
    const loanTerm = parseFloat(document.getElementById("loan-term").value) || 30;
    const pmi = parseFloat(document.getElementById("pmi").value) || 0;
    const monthlyRent = parseFloat(document.getElementById("monthly-rent").value) || 0;
    const annualRentIncrease = parseFloat(document.getElementById("annual-rent-increase").value) / 100 || 0;
    const vacancyRate = parseFloat(document.getElementById("vacancy-rate").value) / 100 || 0;
    const propertyTaxes = parseFloat(document.getElementById("property-taxes").value) || 0;
    const insurance = parseFloat(document.getElementById("insurance").value) || 0;
    const maintenance = parseFloat(document.getElementById("maintenance").value) || 0;
    const propertyManagement = parseFloat(document.getElementById("property-management").value) || 0;
    const otherExpenses = parseFloat(document.getElementById("other-expenses").value) || 0;
    const holdPeriod = parseFloat(document.getElementById("hold-period").value) || 10;
    const appreciationRate = parseFloat(document.getElementById("appreciation-rate").value) / 100 || 0;
    const sellingCosts = parseFloat(document.getElementById("selling-costs").value) / 100 || 0;

    if (propertyValue <= 0 || monthlyRent <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid property value and monthly rent.</p>';
      return;
    }

    // Calculate loan details
    const loanAmount = propertyValue - downPayment;
    const monthlyInterestRate = interestRate / 12;
    const totalPayments = loanTerm * 12;
    
    let monthlyMortgagePayment = 0;
    if (loanAmount > 0 && interestRate > 0) {
      monthlyMortgagePayment = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    }

    // Calculate total cash invested
    const totalCashInvested = downPayment + closingCosts + renovationCosts;

    // Calculate monthly expenses
    const totalMonthlyExpenses = propertyTaxes + insurance + maintenance + 
                                propertyManagement + otherExpenses + monthlyMortgagePayment + pmi;

    // Calculate effective monthly income (after vacancy)
    const effectiveMonthlyRent = monthlyRent * (1 - vacancyRate);
    const monthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // Calculate key metrics
    const annualGrossRent = monthlyRent * 12;
    const annualNetOperatingIncome = effectiveMonthlyRent * 12 - 
                                   (propertyTaxes + insurance + maintenance + propertyManagement + otherExpenses) * 12;
    
    const capRate = (annualNetOperatingIncome / propertyValue) * 100;
    const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
    const grossRentMultiplier = propertyValue / annualGrossRent;
    const onePercentRule = (monthlyRent / propertyValue) * 100;

    // Calculate long-term projections
    let totalCashFlows = 0;
    let projectionData = [];
    
    for (let year = 1; year <= holdPeriod; year++) {
      const yearlyRent = monthlyRent * Math.pow(1 + annualRentIncrease, year - 1) * 12;
      const effectiveYearlyRent = yearlyRent * (1 - vacancyRate);
      const yearlyOperatingExpenses = (propertyTaxes + insurance + maintenance + 
                                     propertyManagement + otherExpenses) * 12;
      const yearlyMortgagePayments = monthlyMortgagePayment * 12;
      const yearlyCashFlow = effectiveYearlyRent - yearlyOperatingExpenses - yearlyMortgagePayments - (pmi * 12);
      
      totalCashFlows += yearlyCashFlow;
      
      projectionData.push({
        year: year,
        rent: yearlyRent,
        cashFlow: yearlyCashFlow,
        cumulativeCashFlow: totalCashFlows
      });
    }

    // Calculate sale proceeds
    const futurePropertyValue = propertyValue * Math.pow(1 + appreciationRate, holdPeriod);
    const sellingCostAmount = futurePropertyValue * sellingCosts;
    
    // Calculate remaining loan balance
    let remainingBalance = loanAmount;
    if (loanAmount > 0 && interestRate > 0) {
      const paymentsRemaining = totalPayments - (holdPeriod * 12);
      if (paymentsRemaining > 0) {
        remainingBalance = loanAmount * 
          (Math.pow(1 + monthlyInterestRate, totalPayments) - Math.pow(1 + monthlyInterestRate, holdPeriod * 12)) /
          (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
      } else {
        remainingBalance = 0;
      }
    }

    const netSaleProceeds = futurePropertyValue - sellingCostAmount - remainingBalance;
    const totalReturn = totalCashFlows + netSaleProceeds - totalCashInvested;
    const totalROI = totalCashInvested > 0 ? (totalReturn / totalCashInvested) * 100 : 0;
    const annualizedROI = Math.pow((totalReturn + totalCashInvested) / totalCashInvested, 1 / holdPeriod) - 1;

    displayResults({
      propertyValue,
      totalCashInvested,
      loanAmount,
      monthlyMortgagePayment,
      monthlyRent,
      effectiveMonthlyRent,
      totalMonthlyExpenses,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      grossRentMultiplier,
      onePercentRule,
      futurePropertyValue,
      netSaleProceeds,
      totalReturn,
      totalROI,
      annualizedROI: annualizedROI * 100,
      holdPeriod,
      projectionData,
      breakdown: {
        mortgage: monthlyMortgagePayment,
        taxes: propertyTaxes,
        insurance: insurance,
        maintenance: maintenance,
        management: propertyManagement,
        other: otherExpenses,
        pmi: pmi
      }
    });
  }

  function displayResults(data) {
    const {
      propertyValue,
      totalCashInvested,
      loanAmount,
      monthlyRent,
      effectiveMonthlyRent,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      grossRentMultiplier,
      onePercentRule,
      futurePropertyValue,
      netSaleProceeds,
      totalReturn,
      totalROI,
      annualizedROI,
      holdPeriod,
      projectionData,
      breakdown
    } = data;

    const isGoodInvestment = capRate >= 6 && cashOnCashReturn >= 8 && monthlyCashFlow > 0;
    const profitabilityRating = getProfitabilityRating(capRate, cashOnCashReturn, monthlyCashFlow);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🏠 Real Estate Investment Analysis</h3>
        
        <div class="investment-rating ${profitabilityRating.class}">
          <h4>${profitabilityRating.rating}</h4>
          <p>${profitabilityRating.description}</p>
        </div>

        <div class="key-metrics">
          <h4>📊 Key Investment Metrics</h4>
          <div class="insight-cards">
            <div class="insight-card ${monthlyCashFlow > 0 ? 'success' : 'warning'}">
              <h6>💰 Monthly Cash Flow</h6>
              <p class="big-number">${monthlyCashFlow >= 0 ? '+' : ''}$${monthlyCashFlow.toFixed(0)}</p>
              <p class="insight-detail">${monthlyCashFlow > 0 ? 'positive cash flow' : 'negative cash flow'}</p>
            </div>
            
            <div class="insight-card ${capRate >= 6 ? 'success' : 'warning'}">
              <h6>📈 Cap Rate</h6>
              <p class="big-number">${capRate.toFixed(2)}%</p>
              <p class="insight-detail">${capRate >= 6 ? 'strong return' : 'below target'}</p>
            </div>
            
            <div class="insight-card ${cashOnCashReturn >= 8 ? 'success' : 'info'}">
              <h6>💵 Cash-on-Cash</h6>
              <p class="big-number">${cashOnCashReturn.toFixed(1)}%</p>
              <p class="insight-detail">annual cash return</p>
            </div>
            
            <div class="insight-card info">
              <h6>🔢 Rent Multiplier</h6>
              <p class="big-number">${grossRentMultiplier.toFixed(1)}</p>
              <p class="insight-detail">price to rent ratio</p>
            </div>
            
            <div class="insight-card ${onePercentRule >= 1 ? 'success' : onePercentRule >= 0.8 ? 'warning' : 'info'}">
              <h6>📊 1% Rule</h6>
              <p class="big-number">${onePercentRule.toFixed(2)}%</p>
              <p class="insight-detail">${onePercentRule >= 1 ? 'excellent' : onePercentRule >= 0.8 ? 'good' : 'below target'}</p>
            </div>
            
            <div class="insight-card ${totalROI >= 50 ? 'success' : 'info'}">
              <h6>🎯 Total ROI</h6>
              <p class="big-number">${totalROI.toFixed(1)}%</p>
              <p class="insight-detail">${holdPeriod} year projection</p>
            </div>
          </div>
        </div>

        <div class="financial-summary">
          <h4>💰 Financial Summary</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Property Value:</span>
              <span class="value">$${propertyValue.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Cash Invested:</span>
              <span class="value">$${totalCashInvested.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Loan Amount:</span>
              <span class="value">$${loanAmount.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Monthly Gross Rent:</span>
              <span class="value">$${monthlyRent.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Effective Monthly Rent:</span>
              <span class="value">$${effectiveMonthlyRent.toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span class="label">Annual Cash Flow:</span>
              <span class="value">$${annualCashFlow.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="expense-breakdown">
          <h4>📋 Monthly Expense Breakdown</h4>
          <div class="expense-grid">
            <div class="expense-item">
              <span class="category">Mortgage Payment:</span>
              <span class="amount">$${breakdown.mortgage.toFixed(2)}</span>
            </div>
            <div class="expense-item">
              <span class="category">Property Taxes:</span>
              <span class="amount">$${breakdown.taxes.toFixed(2)}</span>
            </div>
            <div class="expense-item">
              <span class="category">Insurance:</span>
              <span class="amount">$${breakdown.insurance.toFixed(2)}</span>
            </div>
            <div class="expense-item">
              <span class="category">Maintenance:</span>
              <span class="amount">$${breakdown.maintenance.toFixed(2)}</span>
            </div>
            <div class="expense-item">
              <span class="category">Property Management:</span>
              <span class="amount">$${breakdown.management.toFixed(2)}</span>
            </div>
            <div class="expense-item">
              <span class="category">Other Expenses:</span>
              <span class="amount">$${breakdown.other.toFixed(2)}</span>
            </div>
            ${breakdown.pmi > 0 ? `
              <div class="expense-item">
                <span class="category">PMI:</span>
                <span class="amount">$${breakdown.pmi.toFixed(2)}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="long-term-projection">
          <h4>📈 ${holdPeriod}-Year Investment Projection</h4>
          <div class="projection-summary">
            <div class="projection-item">
              <span class="label">Future Property Value:</span>
              <span class="value">$${futurePropertyValue.toLocaleString()}</span>
            </div>
            <div class="projection-item">
              <span class="label">Net Sale Proceeds:</span>
              <span class="value">$${netSaleProceeds.toLocaleString()}</span>
            </div>
            <div class="projection-item highlight">
              <span class="label">Total Return:</span>
              <span class="value">$${totalReturn.toLocaleString()}</span>
            </div>
            <div class="projection-item">
              <span class="label">Annualized ROI:</span>
              <span class="value">${annualizedROI.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div class="rule-of-thumb">
          <h4>📏 Investment Rule Analysis</h4>
          <div class="rules-grid">
            <div class="rule ${onePercentRule >= 1 ? 'pass' : 'fail'}">
              <strong>1% Rule:</strong> ${onePercentRule.toFixed(2)}% 
              <span>${onePercentRule >= 1 ? '✅ Pass' : '❌ Fail'}</span>
              <p>Monthly rent should be ≥1% of purchase price</p>
            </div>
            <div class="rule ${capRate >= 6 ? 'pass' : 'caution'}">
              <strong>Cap Rate:</strong> ${capRate.toFixed(2)}%
              <span>${capRate >= 8 ? '✅ Excellent' : capRate >= 6 ? '⚠️ Good' : '❌ Poor'}</span>
              <p>Higher cap rates indicate better returns</p>
            </div>
            <div class="rule ${monthlyCashFlow > 200 ? 'pass' : 'caution'}">
              <strong>Cash Flow:</strong> $${monthlyCashFlow.toFixed(2)}
              <span>${monthlyCashFlow > 200 ? '✅ Strong' : monthlyCashFlow > 0 ? '⚠️ Minimal' : '❌ Negative'}</span>
              <p>Positive cash flow is essential for sustainability</p>
            </div>
          </div>
        </div>

        <div class="investment-tips">
          <h4>💡 Investment Recommendations</h4>
          ${getInvestmentRecommendations(capRate, cashOnCashReturn, monthlyCashFlow, onePercentRule)}
        </div>

        <div class="risk-factors">
          <h4>⚠️ Key Risk Factors to Consider</h4>
          <ul>
            <li><strong>Market Risk:</strong> Property values and rents can decline</li>
            <li><strong>Vacancy Risk:</strong> Extended vacancies reduce cash flow</li>
            <li><strong>Maintenance Risk:</strong> Major repairs can exceed budgeted amounts</li>
            <li><strong>Interest Rate Risk:</strong> Rising rates affect refinancing and property values</li>
            <li><strong>Liquidity Risk:</strong> Real estate can take months to sell</li>
            <li><strong>Management Risk:</strong> Difficult tenants or poor management</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps</h4>
          <ul>
            <li>Verify rent estimates with comparable properties in the area</li>
            <li>Get professional property inspection and appraisal</li>
            <li>Research local rental market trends and regulations</li>
            <li>Consider property management costs vs. self-management</li>
            <li>Consult with real estate attorney and tax professional</li>
            <li>Secure financing pre-approval if using leverage</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getProfitabilityRating(capRate, cashOnCash, monthlyCashFlow) {
    if (capRate >= 8 && cashOnCash >= 12 && monthlyCashFlow > 300) {
      return {
        rating: "🟢 Excellent Investment",
        description: "Strong cash flow and returns across all metrics",
        class: "excellent"
      };
    } else if (capRate >= 6 && cashOnCash >= 8 && monthlyCashFlow > 100) {
      return {
        rating: "🟡 Good Investment",
        description: "Solid returns with positive cash flow",
        class: "good"
      };
    } else if (capRate >= 4 && monthlyCashFlow > 0) {
      return {
        rating: "🟠 Marginal Investment", 
        description: "Modest returns, consider market conditions",
        class: "marginal"
      };
    } else {
      return {
        rating: "🔴 Poor Investment",
        description: "Low returns or negative cash flow",
        class: "poor"
      };
    }
  }

  function getInvestmentRecommendations(capRate, cashOnCash, monthlyCashFlow, onePercentRule) {
    const recommendations = [];
    
    if (monthlyCashFlow < 0) {
      recommendations.push("❌ Avoid this investment - negative cash flow is unsustainable");
    } else if (monthlyCashFlow < 100) {
      recommendations.push("⚠️ Consider negotiating a lower purchase price or higher rent");
    } else {
      recommendations.push("✅ Positive cash flow supports good investment potential");
    }

    if (capRate < 4) {
      recommendations.push("⚠️ Low cap rate - ensure appreciation potential justifies low current yield");
    } else if (capRate > 10) {
      recommendations.push("⚠️ High cap rate may indicate higher risk area - research thoroughly");
    }

    if (onePercentRule < 0.7) {
      recommendations.push("❌ Fails 1% rule significantly - consider other properties");
    } else if (onePercentRule >= 1) {
      recommendations.push("✅ Meets 1% rule - good cash flow potential");
    }

    return `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>`;
  }
});