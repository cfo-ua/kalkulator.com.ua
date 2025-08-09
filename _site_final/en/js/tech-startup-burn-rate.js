document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("burn-rate-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const currentCash = parseFloat(document.getElementById("currentCash").value) || 0;
    const monthlyRevenue = parseFloat(document.getElementById("monthlyRevenue").value) || 0;
    const founderSalaries = parseFloat(document.getElementById("foundersalaries").value) || 0;
    const employeeSalaries = parseFloat(document.getElementById("employeeSalaries").value) || 0;
    const benefitsTaxes = parseFloat(document.getElementById("benefitsTaxes").value) || 0;
    const contractorFees = parseFloat(document.getElementById("contractorFees").value) || 0;
    const technologyCosts = parseFloat(document.getElementById("technologyCosts").value) || 0;
    const officeRent = parseFloat(document.getElementById("officeRent").value) || 0;
    const marketingSpend = parseFloat(document.getElementById("marketingSpend").value) || 0;
    const professionalServices = parseFloat(document.getElementById("professionalServices").value) || 0;
    const adminOther = parseFloat(document.getElementById("adminOther").value) || 0;
    const monthlyGrowthRate = parseFloat(document.getElementById("monthlyGrowthRate").value) || 0;
    const targetRunwayMonths = parseInt(document.getElementById("targetRunwayMonths").value) || 18;
    const nextFundraisingAmount = parseFloat(document.getElementById("nextFundraisingAmount").value) || 0;

    // Calculate expense categories
    const totalPersonnelCosts = founderSalaries + employeeSalaries + benefitsTaxes + contractorFees;
    const totalOperationalCosts = technologyCosts + officeRent + marketingSpend + professionalServices + adminOther;
    const grossBurnRate = totalPersonnelCosts + totalOperationalCosts;
    const netBurnRate = grossBurnRate - monthlyRevenue;

    // Calculate runway scenarios
    const runwayResults = calculateRunwayScenarios(
      currentCash, 
      netBurnRate, 
      monthlyGrowthRate / 100,
      36 // months to project
    );

    // Calculate optimization scenarios
    const optimizationScenarios = [
      {
        name: "10% Cost Reduction",
        burnReduction: grossBurnRate * 0.1,
        description: "Reduce all expenses by 10%"
      },
      {
        name: "Marketing Optimization",
        burnReduction: marketingSpend * 0.3,
        description: "Optimize marketing spend by 30%"
      },
      {
        name: "Personnel Efficiency",
        burnReduction: totalPersonnelCosts * 0.15,
        description: "Reduce personnel costs by 15%"
      },
      {
        name: "Office/Tech Savings",
        burnReduction: (officeRent + technologyCosts) * 0.25,
        description: "Remote work & tech optimization"
      }
    ];

    // Calculate fundraising requirements
    const targetMonthlyBurn = currentCash / targetRunwayMonths;
    const burnReductionNeeded = Math.max(0, netBurnRate - targetMonthlyBurn);
    const additionalFundingNeeded = Math.max(0, (netBurnRate * targetRunwayMonths) - currentCash);

    // Format currency function
    const formatCurrency = (num) => {
      return num.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    };

    // Generate comprehensive results
    const resultHTML = `
      <h3>Startup Burn Rate Analysis</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">🔥 Current Burn Rate Breakdown</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div style="text-align: center; padding: 1rem; background: #e8f4fd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #0066cc;">Gross Burn Rate</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(grossBurnRate)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Total monthly expenses
            </p>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #e8f5e8; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #27ae60;">Monthly Revenue</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(monthlyRevenue)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Recurring income
            </p>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: ${netBurnRate > 0 ? '#f8d7da' : '#d4edda'}; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: ${netBurnRate > 0 ? '#721c24' : '#155724'};">Net Burn Rate</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(netBurnRate)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Cash consumed monthly
            </p>
          </div>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #27ae60; margin-bottom: 1rem;">💰 Expense Category Analysis</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Personnel Costs (${((totalPersonnelCosts/grossBurnRate)*100).toFixed(0)}%):</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li>Founder Salaries: ${formatCurrency(founderSalaries)}</li>
              <li>Employee Salaries: ${formatCurrency(employeeSalaries)}</li>
              <li>Benefits & Taxes: ${formatCurrency(benefitsTaxes)}</li>
              <li>Contractors: ${formatCurrency(contractorFees)}</li>
            </ul>
            <p style="margin: 0.5rem 0; font-weight: bold;">Subtotal: ${formatCurrency(totalPersonnelCosts)}</p>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Operational Costs (${((totalOperationalCosts/grossBurnRate)*100).toFixed(0)}%):</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li>Technology: ${formatCurrency(technologyCosts)}</li>
              <li>Office & Facilities: ${formatCurrency(officeRent)}</li>
              <li>Marketing: ${formatCurrency(marketingSpend)}</li>
              <li>Professional Services: ${formatCurrency(professionalServices)}</li>
              <li>Administrative: ${formatCurrency(adminOther)}</li>
            </ul>
            <p style="margin: 0.5rem 0; font-weight: bold;">Subtotal: ${formatCurrency(totalOperationalCosts)}</p>
          </div>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #856404; margin-bottom: 1rem;">⏱️ Runway Analysis</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; text-align: center;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Current Runway</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0; color: ${runwayResults.currentRunway > 12 ? '#27ae60' : runwayResults.currentRunway > 6 ? '#856404' : '#dc3545'};">
              ${runwayResults.currentRunway.toFixed(1)} months
            </p>
            <p style="margin: 0; font-size: 0.8rem;">At current burn rate</p>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">With Growth</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0; color: ${runwayResults.growthAdjustedRunway > 12 ? '#27ae60' : runwayResults.growthAdjustedRunway > 6 ? '#856404' : '#dc3545'};">
              ${runwayResults.growthAdjustedRunway.toFixed(1)} months
            </p>
            <p style="margin: 0; font-size: 0.8rem;">${monthlyGrowthRate}% monthly growth</p>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Cash Depletion</h5>
            <p style="font-size: 1.1rem; font-weight: bold; margin: 0;">
              ${getDepletionDate(runwayResults.growthAdjustedRunway)}
            </p>
            <p style="margin: 0; font-size: 0.8rem;">Estimated date</p>
          </div>
        </div>
      </div>

      <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #0066cc; margin-bottom: 1rem;">🎯 Optimization Opportunities</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          ${optimizationScenarios.map(scenario => {
            const newBurnRate = netBurnRate - scenario.burnReduction;
            const newRunway = newBurnRate > 0 ? currentCash / newBurnRate : 999;
            const extensionMonths = newRunway - runwayResults.currentRunway;
            
            return `
            <div style="background: white; padding: 1rem; border-radius: 5px; border-left: 4px solid #007bff;">
              <h5 style="margin: 0 0 0.5rem 0;">${scenario.name}</h5>
              <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">${scenario.description}</p>
              <p style="margin: 0; font-weight: bold;">
                Extends runway by ${extensionMonths.toFixed(1)} months<br>
                <span style="color: #27ae60;">New burn: ${formatCurrency(newBurnRate)}</span>
              </p>
            </div>
            `;
          }).join('')}
        </div>
      </div>

      <div style="background: #f8d7da; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #721c24; margin-bottom: 1rem;">📊 Strategic Recommendations</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Fundraising Strategy:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Start fundraising:</strong> ${getFundraisingTiming(runwayResults.growthAdjustedRunway)}</li>
              <li><strong>Target amount:</strong> ${formatCurrency(nextFundraisingAmount)}</li>
              <li><strong>Post-funding runway:</strong> ${((nextFundraisingAmount + currentCash) / netBurnRate).toFixed(1)} months</li>
              ${additionalFundingNeeded > 0 ? `<li><strong>Additional needed:</strong> ${formatCurrency(additionalFundingNeeded)} for ${targetRunwayMonths}mo runway</li>` : ''}
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Immediate Actions:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getImmediateActions(runwayResults.growthAdjustedRunway, netBurnRate, totalPersonnelCosts, grossBurnRate).map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #e8f4fd; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #0066cc; margin-bottom: 0.5rem;">💡 Key Insights & Metrics</h5>
        <p style="margin: 0; font-size: 0.9rem; color: #2c3e50;">
          <strong>Burn Multiple:</strong> ${(netBurnRate / Math.max(monthlyRevenue, 1)).toFixed(1)}x monthly revenue | 
          <strong>Personnel Share:</strong> ${((totalPersonnelCosts/grossBurnRate)*100).toFixed(0)}% of burn | 
          <strong>Revenue Coverage:</strong> ${((monthlyRevenue/grossBurnRate)*100).toFixed(0)}% of expenses | 
          <strong>Monthly Cash Consumption:</strong> ${((netBurnRate/currentCash)*100).toFixed(1)}% of total cash
        </p>
      </div>
    `;

    document.getElementById("burn-rate-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("runway-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("runway-chart").getContext("2d");
      if (window.runwayChart) window.runwayChart.destroy();

      const chartData = generateRunwayChartData(currentCash, netBurnRate, monthlyGrowthRate / 100, 24);

      window.runwayChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Cash Balance",
              data: chartData.cashBalance,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              fill: true,
              tension: 0.1
            },
            {
              label: "Monthly Burn Rate",
              data: chartData.monthlyBurn,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              fill: false,
              tension: 0.1,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  if (context.datasetIndex === 0) {
                    return "Cash: " + formatCurrency(context.parsed.y);
                  } else {
                    return "Burn Rate: " + formatCurrency(context.parsed.y);
                  }
                }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: "Cash Balance ($)" },
              ticks: {
                callback: function (value) {
                  return formatCurrency(value);
                }
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: "Monthly Burn Rate ($)" },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: function (value) {
                  return formatCurrency(value);
                }
              }
            },
            x: {
              title: { display: true, text: "Months" }
            }
          }
        }
      });
    });
  });

  // Helper functions
  function calculateRunwayScenarios(cash, burnRate, growthRate, months) {
    const currentRunway = burnRate > 0 ? cash / burnRate : 999;
    
    // Calculate runway with growth
    let remainingCash = cash;
    let currentBurn = burnRate;
    let monthsToDepletion = 0;
    
    for (let month = 1; month <= months; month++) {
      if (remainingCash <= 0) break;
      remainingCash -= currentBurn;
      currentBurn *= (1 + growthRate);
      monthsToDepletion = month;
      if (remainingCash <= 0) break;
    }
    
    return {
      currentRunway,
      growthAdjustedRunway: remainingCash > 0 ? months : monthsToDepletion
    };
  }

  function generateRunwayChartData(cash, burnRate, growthRate, months) {
    const labels = [];
    const cashBalance = [];
    const monthlyBurn = [];
    
    let remainingCash = cash;
    let currentBurn = burnRate;
    
    for (let month = 0; month <= months; month++) {
      labels.push(`Month ${month}`);
      cashBalance.push(Math.max(0, remainingCash));
      monthlyBurn.push(currentBurn);
      
      if (month > 0) {
        remainingCash -= currentBurn;
        currentBurn *= (1 + growthRate);
      }
      
      if (remainingCash <= 0 && month > 0) break;
    }
    
    return { labels, cashBalance, monthlyBurn };
  }

  function getDepletionDate(runwayMonths) {
    const today = new Date();
    const depletionDate = new Date(today.getFullYear(), today.getMonth() + runwayMonths, today.getDate());
    return depletionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  function getFundraisingTiming(runway) {
    if (runway <= 6) return "🚨 Immediately - critical situation";
    if (runway <= 9) return "⚠️ Start now - begin outreach";
    if (runway <= 12) return "📅 Within 2-3 months";
    return "📊 Plan for 9-12 months out";
  }

  function getImmediateActions(runway, netBurn, personnelCosts, grossBurn) {
    const actions = [];
    
    if (runway <= 6) {
      actions.push("🚨 Implement emergency cost cuts immediately");
      actions.push("💰 Bridge funding or investor loans");
    }
    
    if (runway <= 12) {
      actions.push("📊 Weekly cash flow monitoring");
      actions.push("🎯 Accelerate fundraising timeline");
    }
    
    if (personnelCosts / grossBurn > 0.75) {
      actions.push("👥 Review hiring plans and contractor usage");
    }
    
    if (netBurn > 0) {
      actions.push("📈 Focus on revenue acceleration");
      actions.push("💡 Identify 10-20% cost reduction opportunities");
    }
    
    if (actions.length === 0) {
      actions.push("✅ Strong position - maintain current trajectory");
      actions.push("📋 Regular monthly financial reviews");
    }
    
    return actions;
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