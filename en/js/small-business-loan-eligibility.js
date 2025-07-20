document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loan-eligibility-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const businessAge = parseFloat(document.getElementById("businessAge").value) || 0;
    const annualRevenue = parseFloat(document.getElementById("annualRevenue").value) || 0;
    const monthlyRevenue = parseFloat(document.getElementById("monthlyRevenue").value) || 0;
    const monthlyCashFlow = parseFloat(document.getElementById("monthlyCashFlow").value) || 0;
    const industryType = document.getElementById("industryType").value;
    const personalCreditScore = parseInt(document.getElementById("personalCreditScore").value) || 0;
    const businessCreditScore = parseInt(document.getElementById("businessCreditScore").value) || 0;
    const existingBusinessDebt = parseFloat(document.getElementById("existingBusinessDebt").value) || 0;
    const personalDebt = parseFloat(document.getElementById("personalDebt").value) || 0;
    const personalIncome = parseFloat(document.getElementById("personalIncome").value) || 0;
    const loanAmount = parseFloat(document.getElementById("loanAmount").value) || 0;
    const loanPurpose = document.getElementById("loanPurpose").value;
    const collateralValue = parseFloat(document.getElementById("collateralValue").value) || 0;

    // Calculate key ratios
    const totalPersonalIncome = personalIncome + monthlyCashFlow * 12;
    const totalDebt = existingBusinessDebt + personalDebt;
    const debtToIncomeRatio = totalPersonalIncome > 0 ? (totalDebt / totalPersonalIncome) * 100 : 100;
    const debtServiceCoverage = monthlyCashFlow > 0 ? (monthlyCashFlow * 12) / (existingBusinessDebt * 0.12) : 0;
    const loanToCollateralRatio = collateralValue > 0 ? (loanAmount / collateralValue) * 100 : 100;

    // Industry risk factors
    const industryRiskFactors = {
      'professional-services': 1.0,
      'retail': 0.8,
      'restaurant': 0.6,
      'manufacturing': 0.9,
      'construction': 0.7,
      'healthcare': 1.0,
      'technology': 1.1,
      'transportation': 0.8,
      'real-estate': 0.9,
      'other': 0.8
    };

    const industryMultiplier = industryRiskFactors[industryType] || 0.8;

    // Evaluate different loan types
    const loanTypes = [
      {
        name: "SBA 7(a) Loan",
        maxAmount: 5000000,
        minCreditScore: 680,
        minRevenue: 100000,
        minBusinessAge: 2,
        interestRate: "Prime + 2.25-4.75%",
        description: "Versatile SBA loan for most business purposes"
      },
      {
        name: "SBA Express Loan",
        maxAmount: 500000,
        minCreditScore: 680,
        minRevenue: 100000,
        minBusinessAge: 2,
        interestRate: "Prime + 4.5-6.5%",
        description: "Fast-track SBA loan with 36-hour approval"
      },
      {
        name: "SBA Microloan",
        maxAmount: 50000,
        minCreditScore: 640,
        minRevenue: 50000,
        minBusinessAge: 1,
        interestRate: "8-13%",
        description: "Small SBA loans for startups and small businesses"
      },
      {
        name: "Traditional Bank Term Loan",
        maxAmount: 10000000,
        minCreditScore: 700,
        minRevenue: 250000,
        minBusinessAge: 2,
        interestRate: "Prime + 1-3%",
        description: "Low-rate loans for established businesses"
      },
      {
        name: "Bank Line of Credit",
        maxAmount: 1000000,
        minCreditScore: 680,
        minRevenue: 200000,
        minBusinessAge: 2,
        interestRate: "Prime + 1.5-4%",
        description: "Flexible credit line for working capital"
      },
      {
        name: "Equipment Financing",
        maxAmount: 5000000,
        minCreditScore: 650,
        minRevenue: 100000,
        minBusinessAge: 1,
        interestRate: "6-20%",
        description: "Asset-backed loans for equipment purchases"
      },
      {
        name: "Online Term Loan",
        maxAmount: 500000,
        minCreditScore: 580,
        minRevenue: 75000,
        minBusinessAge: 0.5,
        interestRate: "12-35%",
        description: "Fast approval online lenders"
      },
      {
        name: "Revenue-Based Financing",
        maxAmount: 2000000,
        minCreditScore: 550,
        minRevenue: 150000,
        minBusinessAge: 1,
        interestRate: "Factor rate 1.2-1.5",
        description: "Repayment based on percentage of sales"
      },
      {
        name: "Merchant Cash Advance",
        maxAmount: 1000000,
        minCreditScore: 500,
        minRevenue: 50000,
        minBusinessAge: 0.25,
        interestRate: "Factor rate 1.15-1.5",
        description: "Advance against future credit card sales"
      },
      {
        name: "Invoice Factoring",
        maxAmount: 10000000,
        minCreditScore: 550,
        minRevenue: 100000,
        minBusinessAge: 0.5,
        interestRate: "1-5% per month",
        description: "Sell invoices for immediate cash"
      }
    ];

    // Calculate eligibility scores for each loan type
    const eligibilityResults = loanTypes.map(loan => {
      let score = 0;
      let issues = [];

      // Credit score assessment
      if (personalCreditScore >= loan.minCreditScore) {
        score += 25;
      } else {
        issues.push(`Credit score below ${loan.minCreditScore}`);
        score += Math.max(0, (personalCreditScore / loan.minCreditScore) * 25);
      }

      // Revenue requirement
      if (annualRevenue >= loan.minRevenue) {
        score += 20;
      } else {
        issues.push(`Revenue below $${loan.minRevenue.toLocaleString()}`);
        score += Math.max(0, (annualRevenue / loan.minRevenue) * 20);
      }

      // Business age requirement
      if (businessAge >= loan.minBusinessAge) {
        score += 15;
      } else {
        issues.push(`Business age below ${loan.minBusinessAge} years`);
        score += Math.max(0, (businessAge / loan.minBusinessAge) * 15);
      }

      // Loan amount vs maximum
      if (loanAmount <= loan.maxAmount) {
        score += 15;
      } else {
        issues.push(`Loan amount exceeds $${loan.maxAmount.toLocaleString()} limit`);
        score += Math.max(0, (loan.maxAmount / loanAmount) * 15);
      }

      // Cash flow adequacy
      const requiredCashFlow = loanAmount * 0.15 / 12; // Assuming 15% annual debt service
      if (monthlyCashFlow >= requiredCashFlow) {
        score += 15;
      } else {
        issues.push("Insufficient cash flow for debt service");
        score += Math.max(0, (monthlyCashFlow / requiredCashFlow) * 15);
      }

      // Debt-to-income ratio
      if (debtToIncomeRatio <= 40) {
        score += 10;
      } else {
        issues.push("High debt-to-income ratio");
        score += Math.max(0, (40 / debtToIncomeRatio) * 10);
      }

      // Apply industry multiplier
      score *= industryMultiplier;

      // Special adjustments for specific loan types
      if (loan.name.includes("Equipment") && loanPurpose === "equipment") {
        score += 10;
      }
      if (loan.name.includes("SBA") && businessAge >= 2) {
        score += 5;
      }
      if (loan.name.includes("Collateral") && collateralValue >= loanAmount * 0.8) {
        score += 10;
      }

      return {
        ...loan,
        score: Math.min(100, Math.max(0, score)),
        issues: issues,
        eligible: score >= 60
      };
    });

    // Sort by score
    eligibilityResults.sort((a, b) => b.score - a.score);

    // Format currency function
    const formatCurrency = (num) => {
      return num.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    };

    // Generate results
    const qualifiedLoans = eligibilityResults.filter(loan => loan.eligible);
    const partiallyQualified = eligibilityResults.filter(loan => loan.score >= 40 && loan.score < 60);

    const resultHTML = `
      <h3>Loan Eligibility Analysis Results</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">📊 Financial Profile Summary</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li><strong>Annual Revenue:</strong> ${formatCurrency(annualRevenue)}</li>
              <li><strong>Monthly Cash Flow:</strong> ${formatCurrency(monthlyCashFlow)}</li>
              <li><strong>Business Age:</strong> ${businessAge} years</li>
              <li><strong>Personal Credit Score:</strong> ${personalCreditScore}</li>
            </ul>
          </div>
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li><strong>Debt-to-Income Ratio:</strong> ${debtToIncomeRatio.toFixed(1)}%</li>
              <li><strong>Requested Amount:</strong> ${formatCurrency(loanAmount)}</li>
              <li><strong>Available Collateral:</strong> ${formatCurrency(collateralValue)}</li>
              <li><strong>Industry:</strong> ${industryType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
            </ul>
          </div>
        </div>
      </div>

      ${qualifiedLoans.length > 0 ? `
      <div style="background: #d4edda; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #155724; margin-bottom: 1rem;">✅ Recommended Loan Options (${qualifiedLoans.length})</h4>
        
        ${qualifiedLoans.slice(0, 3).map((loan, index) => `
          <div style="background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 5px; border-left: 4px solid #28a745;">
            <div style="display: flex; justify-content: between; align-items: center;">
              <div style="flex: 1;">
                <h5 style="margin: 0 0 0.5rem 0; color: #155724;">${loan.name}</h5>
                <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem;">${loan.description}</p>
                <p style="margin: 0; font-size: 0.9rem;">
                  <strong>Max:</strong> ${formatCurrency(loan.maxAmount)} | 
                  <strong>Rate:</strong> ${loan.interestRate}
                </p>
              </div>
              <div style="text-align: right; margin-left: 1rem;">
                <div style="background: #28a745; color: white; padding: 0.25rem 0.5rem; border-radius: 15px; font-size: 0.8rem; font-weight: bold;">
                  ${loan.score.toFixed(0)}% Match
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${partiallyQualified.length > 0 ? `
      <div style="background: #fff3cd; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #856404; margin-bottom: 1rem;">⚠️ Potential Options with Improvements (${partiallyQualified.length})</h4>
        
        ${partiallyQualified.slice(0, 2).map((loan, index) => `
          <div style="background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 5px; border-left: 4px solid #ffc107;">
            <div style="display: flex; justify-content: between; align-items: center;">
              <div style="flex: 1;">
                <h5 style="margin: 0 0 0.5rem 0; color: #856404;">${loan.name}</h5>
                <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem;">${loan.description}</p>
                ${loan.issues.length > 0 ? `
                  <p style="margin: 0; font-size: 0.8rem; color: #dc3545;">
                    <strong>Issues:</strong> ${loan.issues.slice(0, 2).join(', ')}
                  </p>
                ` : ''}
              </div>
              <div style="text-align: right; margin-left: 1rem;">
                <div style="background: #ffc107; color: #212529; padding: 0.25rem 0.5rem; border-radius: 15px; font-size: 0.8rem; font-weight: bold;">
                  ${loan.score.toFixed(0)}% Match
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #0066cc; margin-bottom: 1rem;">💡 Recommendations & Next Steps</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Strengthen Your Profile:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getImprovementSuggestions(personalCreditScore, debtToIncomeRatio, businessAge, monthlyCashFlow, annualRevenue).map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Application Strategy:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li>Start with highest-match lenders</li>
              <li>Prepare 2-3 years of financial statements</li>
              <li>Document loan purpose and repayment plan</li>
              <li>Consider multiple applications simultaneously</li>
              <li>Build relationships before applying</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #f8d7da; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #721c24; margin-bottom: 0.5rem;">📋 Required Documentation Checklist</h5>
        <div style="font-size: 0.9rem; color: #2c3e50;">
          <strong>Financial Documents:</strong> Business tax returns (2-3 years), Personal tax returns (2 years), Bank statements (6 months), 
          Financial statements (P&L, Balance Sheet)<br>
          <strong>Business Documents:</strong> Business plan, Articles of incorporation, Business licenses, 
          Commercial lease agreement<br>
          <strong>Additional:</strong> Personal financial statement, Resume/business experience, 
          Collateral documentation (if applicable)
        </div>
      </div>
    `;

    document.getElementById("loan-eligibility-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("loan-options-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("loan-options-chart").getContext("2d");
      if (window.loanOptionsChart) window.loanOptionsChart.destroy();

      const chartData = eligibilityResults.slice(0, 8);
      const colors = chartData.map(loan => {
        if (loan.score >= 60) return "#28a745";
        if (loan.score >= 40) return "#ffc107";
        return "#dc3545";
      });

      window.loanOptionsChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.map(loan => loan.name.replace(' Loan', '').replace(' Financing', '')),
          datasets: [{
            label: "Approval Probability (%)",
            data: chartData.map(loan => loan.score),
            backgroundColor: colors,
            borderColor: colors.map(color => color),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Approval Probability: ${context.parsed.y.toFixed(0)}%`;
                }
              }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: "Approval Probability %" },
              ticks: {
                callback: function (value) {
                  return value + "%";
                }
              }
            },
            x: {
              title: { display: true, text: "Loan Types" },
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      });
    });
  });

  // Helper function to generate improvement suggestions
  function getImprovementSuggestions(creditScore, debtRatio, businessAge, cashFlow, revenue) {
    const suggestions = [];
    
    if (creditScore < 680) {
      suggestions.push("Improve personal credit score above 680");
    }
    if (debtRatio > 40) {
      suggestions.push("Reduce debt-to-income ratio below 40%");
    }
    if (businessAge < 2) {
      suggestions.push("Establish longer business operating history");
    }
    if (cashFlow < 5000) {
      suggestions.push("Increase monthly cash flow and profitability");
    }
    if (revenue < 100000) {
      suggestions.push("Grow annual revenue above $100,000");
    }
    
    if (suggestions.length === 0) {
      suggestions.push("Strong profile - focus on loan documentation");
    }
    
    return suggestions;
  }
});

// Dynamic loader for Chart.js
function ensureChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.body.appendChild(script);
}