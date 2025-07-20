document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("salary-equity-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const jobTitle = document.getElementById("jobTitle").value || "Employee";
    const experienceLevel = document.getElementById("experienceLevel").value;
    const baseSalary = parseFloat(document.getElementById("baseSalary").value) || 0;
    const benefitsValue = parseFloat(document.getElementById("benefitsValue").value) || 0;
    const performanceBonus = parseFloat(document.getElementById("performanceBonus").value) || 0;
    const equityPercentage = parseFloat(document.getElementById("equityPercentage").value) || 0;
    const currentValuation = parseFloat(document.getElementById("currentValuation").value) || 0;
    const vestingYears = parseInt(document.getElementById("vestingYears").value) || 4;
    const cliffMonths = parseInt(document.getElementById("cliffMonths").value) || 12;
    const conservativeMultiple = parseFloat(document.getElementById("conservativeMultiple").value) || 0.8;
    const moderateMultiple = parseFloat(document.getElementById("moderateMultiple").value) || 3.0;
    const optimisticMultiple = parseFloat(document.getElementById("optimisticMultiple").value) || 8.0;

    // Calculate cash compensation
    const totalCashComp = baseSalary + benefitsValue + performanceBonus;

    // Calculate equity values
    const currentEquityValue = (currentValuation * equityPercentage) / 100;
    const conservativeEquityValue = currentEquityValue * conservativeMultiple;
    const moderateEquityValue = currentEquityValue * moderateMultiple;
    const optimisticEquityValue = currentEquityValue * optimisticMultiple;

    // Calculate total compensation scenarios
    const conservativeTotalComp = totalCashComp + (conservativeEquityValue / vestingYears);
    const moderateTotalComp = totalCashComp + (moderateEquityValue / vestingYears);
    const optimisticTotalComp = totalCashComp + (optimisticEquityValue / vestingYears);

    // Calculate vesting schedule
    const monthlyVestingRate = equityPercentage / (vestingYears * 12);
    const vestedAtCliff = cliffMonths * monthlyVestingRate;

    // Market benchmarking based on experience level
    const marketData = getMarketBenchmark(experienceLevel);

    // Format currency function
    const formatCurrency = (num) => {
      return num.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    };

    // Generate detailed results
    const resultHTML = `
      <h3>Compensation Analysis for ${jobTitle}</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">💰 Annual Cash Compensation</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li>Base Salary: ${formatCurrency(baseSalary)}</li>
              <li>Benefits Value: ${formatCurrency(benefitsValue)}</li>
              <li>Performance Bonus: ${formatCurrency(performanceBonus)}</li>
            </ul>
          </div>
          <div>
            <p style="font-size: 1.2rem; font-weight: bold; color: #e74c3c; margin: 0;">
              Total Cash: ${formatCurrency(totalCashComp)}
            </p>
            <p style="margin: 0.5rem 0; color: #666;">
              ${getMarketComparison(totalCashComp, marketData.cashRange)}
            </p>
          </div>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #27ae60; margin-bottom: 1rem;">📈 Equity Compensation</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li>Equity Percentage: ${equityPercentage}%</li>
              <li>Current Value: ${formatCurrency(currentEquityValue)}</li>
              <li>Vesting: ${vestingYears} years, ${cliffMonths}mo cliff</li>
              <li>Monthly Vesting: ${(monthlyVestingRate).toFixed(3)}%</li>
            </ul>
          </div>
          <div>
            <p style="margin: 0; color: #666;">
              ${getEquityComparison(equityPercentage, marketData.equityRange)}
            </p>
            <p style="margin: 0.5rem 0; font-weight: bold;">
              Vested after cliff: ${vestedAtCliff.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #856404; margin-bottom: 1rem;">🎯 Total Compensation Scenarios</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; text-align: center;">
          <div style="background: #f8d7da; padding: 1rem; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #721c24;">Conservative</h5>
            <p style="font-size: 1.1rem; font-weight: bold; margin: 0;">
              ${formatCurrency(conservativeTotalComp)}
            </p>
            <p style="margin: 0.25rem 0; font-size: 0.9rem;">
              Equity: ${formatCurrency(conservativeEquityValue)}
            </p>
          </div>
          
          <div style="background: #d4edda; padding: 1rem; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #155724;">Moderate</h5>
            <p style="font-size: 1.1rem; font-weight: bold; margin: 0;">
              ${formatCurrency(moderateTotalComp)}
            </p>
            <p style="margin: 0.25rem 0; font-size: 0.9rem;">
              Equity: ${formatCurrency(moderateEquityValue)}
            </p>
          </div>
          
          <div style="background: #cce5ff; padding: 1rem; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #004085;">Optimistic</h5>
            <p style="font-size: 1.1rem; font-weight: bold; margin: 0;">
              ${formatCurrency(optimisticTotalComp)}
            </p>
            <p style="margin: 0.25rem 0; font-size: 0.9rem;">
              Equity: ${formatCurrency(optimisticEquityValue)}
            </p>
          </div>
        </div>
      </div>

      <div style="background: #e7f3ff; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #0066cc; margin-bottom: 0.5rem;">💡 Key Insights & Recommendations:</h5>
        <ul style="margin: 0; color: #2c3e50;">
          <li><strong>Cash vs Market:</strong> ${getCashRecommendation(totalCashComp, marketData.cashRange)}</li>
          <li><strong>Equity Stake:</strong> ${getEquityRecommendation(equityPercentage, experienceLevel)}</li>
          <li><strong>Risk Assessment:</strong> ${getRiskAssessment(totalCashComp, currentEquityValue)}</li>
          <li><strong>Retention Factor:</strong> ${getRetentionAnalysis(vestingYears, cliffMonths)}</li>
        </ul>
      </div>
    `;

    document.getElementById("salary-equity-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("equity-value-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("equity-value-chart").getContext("2d");
      if (window.equityValueChart) window.equityValueChart.destroy();

      window.equityValueChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Conservative", "Moderate", "Optimistic"],
          datasets: [
            {
              label: "Cash Compensation",
              data: [totalCashComp, totalCashComp, totalCashComp],
              backgroundColor: "#3498db",
              stack: "Stack 0"
            },
            {
              label: "Equity Value",
              data: [conservativeEquityValue, moderateEquityValue, optimisticEquityValue],
              backgroundColor: "#2ecc71",
              stack: "Stack 0"
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.dataset.label + ": " + formatCurrency(context.parsed.y);
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              title: { display: true, text: "Total Compensation Value ($)" },
              ticks: {
                callback: function (value) {
                  return formatCurrency(value);
                }
              }
            },
            x: {
              stacked: true,
              title: { display: true, text: "Exit Scenarios" }
            }
          }
        }
      });
    });
  });

  // Market benchmark data based on experience level
  function getMarketBenchmark(level) {
    const benchmarks = {
      junior: { cashRange: [70000, 110000], equityRange: [0.05, 0.25] },
      mid: { cashRange: [110000, 160000], equityRange: [0.1, 0.4] },
      senior: { cashRange: [160000, 220000], equityRange: [0.15, 0.6] },
      lead: { cashRange: [200000, 300000], equityRange: [0.25, 1.0] },
      executive: { cashRange: [250000, 500000], equityRange: [0.5, 3.0] }
    };
    return benchmarks[level] || benchmarks.mid;
  }

  // Helper functions for analysis
  function getMarketComparison(cash, range) {
    if (cash < range[0]) return "⚠️ Below market range";
    if (cash > range[1]) return "💰 Above market range";
    return "✅ Within market range";
  }

  function getEquityComparison(equity, range) {
    if (equity < range[0]) return "Lower than typical equity range";
    if (equity > range[1]) return "Higher than typical equity range";
    return "Within typical equity range";
  }

  function getCashRecommendation(cash, range) {
    const midpoint = (range[0] + range[1]) / 2;
    if (cash < range[0]) return "Consider increasing base salary to remain competitive";
    if (cash > midpoint) return "Strong cash compensation, attractive for risk-averse candidates";
    return "Balanced cash compensation for the role level";
  }

  function getEquityRecommendation(equity, level) {
    if (equity < 0.1) return "Low equity stake, may need higher cash compensation";
    if (equity > 1.0 && level !== "executive") return "Generous equity package, strong retention incentive";
    return "Reasonable equity allocation for role and stage";
  }

  function getRiskAssessment(cash, equityValue) {
    const ratio = equityValue / cash;
    if (ratio < 0.5) return "Lower risk profile, more predictable compensation";
    if (ratio > 2.0) return "Higher risk/reward profile, equity-heavy package";
    return "Balanced risk profile between cash and equity";
  }

  function getRetentionAnalysis(years, cliff) {
    if (cliff >= 12 && years >= 4) return "Strong retention structure with industry-standard vesting";
    if (cliff < 6) return "Shorter cliff may reduce retention effectiveness";
    return "Custom vesting schedule, ensure competitive retention";
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