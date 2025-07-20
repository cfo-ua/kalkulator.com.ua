// Format currency function
const formatCurrency = (num) => {
  return num.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  });
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cash-flow-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const startingCash = parseFloat(document.getElementById("startingCash").value) || 0;
    const monthlyRevenue = parseFloat(document.getElementById("monthlyRevenue").value) || 0;
    const seasonalVariation = parseFloat(document.getElementById("seasonalVariation").value) || 0;
    const peakMonth = parseInt(document.getElementById("peakMonth").value) || 12;
    const lowMonth = parseInt(document.getElementById("lowMonth").value) || 2;
    const averageCollectionDays = parseInt(document.getElementById("averageCollectionDays").value) || 30;
    const costOfGoodsSold = parseFloat(document.getElementById("costOfGoodsSold").value) || 40;
    const fixedExpenses = parseFloat(document.getElementById("fixedExpenses").value) || 0;
    const variableExpenses = parseFloat(document.getElementById("variableExpenses").value) || 15;
    const debtPayments = parseFloat(document.getElementById("debtPayments").value) || 0;
    const ownerDraws = parseFloat(document.getElementById("ownerDraws").value) || 0;
    const quarterlyTaxes = parseFloat(document.getElementById("quarterlyTaxes").value) || 0;
    const annualExpenses = parseFloat(document.getElementById("annualExpenses").value) || 0;
    const plannedCapex = parseFloat(document.getElementById("plannedCapex").value) || 0;

    // Generate 12-month cash flow projection
    const cashFlowProjection = generateCashFlowProjection({
      startingCash,
      monthlyRevenue,
      seasonalVariation: seasonalVariation / 100,
      peakMonth,
      lowMonth,
      averageCollectionDays,
      costOfGoodsSold: costOfGoodsSold / 100,
      fixedExpenses,
      variableExpenses: variableExpenses / 100,
      debtPayments,
      ownerDraws,
      quarterlyTaxes,
      annualExpenses,
      plannedCapex
    });

    // Analyze cash flow results
    const analysis = analyzeCashFlow(cashFlowProjection);

    // Generate comprehensive results
    const resultHTML = `
      <h3>12-Month Cash Flow Forecast</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">💰 Cash Flow Summary</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; text-align: center;">
          <div style="padding: 1rem; background: #e8f4fd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #0066cc;">Starting Cash</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${formatCurrency(startingCash)}
            </p>
          </div>
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #27ae60;">Total Inflows</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${formatCurrency(analysis.totalInflows)}
            </p>
          </div>
          
          <div style="padding: 1rem; background: #f8d7da; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #721c24;">Total Outflows</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${formatCurrency(analysis.totalOutflows)}
            </p>
          </div>
          
          <div style="padding: 1rem; background: ${analysis.endingCash > 0 ? '#d4edda' : '#f8d7da'}; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: ${analysis.endingCash > 0 ? '#155724' : '#721c24'};">Ending Cash</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${formatCurrency(analysis.endingCash)}
            </p>
          </div>
        </div>
      </div>

      ${analysis.negativeMonths.length > 0 ? `
      <div style="background: #f8d7da; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #721c24; margin-bottom: 1rem;">⚠️ Cash Flow Warnings</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Negative Cash Flow Months:</h5>
            <ul style="margin: 0; padding-left: 1.2rem;">
              ${analysis.negativeMonths.map(month => `<li>${month.month}: ${formatCurrency(month.netCashFlow)}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Lowest Cash Balance:</h5>
            <p style="margin: 0; font-size: 1.1rem; font-weight: bold; color: #721c24;">
              ${formatCurrency(analysis.lowestCash.amount)} in ${analysis.lowestCash.month}
            </p>
            <p style="margin: 0.5rem 0; font-size: 0.9rem;">
              ${analysis.lowestCash.amount < 0 ? '🚨 Cash deficit requiring immediate financing' : '⚠️ Low cash balance requiring attention'}
            </p>
          </div>
        </div>
      </div>
      ` : ''}

      <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #27ae60; margin-bottom: 1rem;">📊 Monthly Average Analysis</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Revenue & Collections:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Average Monthly Sales:</strong> ${formatCurrency(analysis.avgMonthlySales)}</li>
              <li><strong>Peak Month Sales:</strong> ${formatCurrency(analysis.peakSales)} (${getMonthName(peakMonth)})</li>
              <li><strong>Low Month Sales:</strong> ${formatCurrency(analysis.lowSales)} (${getMonthName(lowMonth)})</li>
              <li><strong>Collection Timing:</strong> ${averageCollectionDays} days average</li>
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Expenses & Costs:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Fixed Expenses:</strong> ${formatCurrency(fixedExpenses)}/month</li>
              <li><strong>Variable Costs:</strong> ${variableExpenses}% of revenue</li>
              <li><strong>COGS:</strong> ${costOfGoodsSold}% of revenue</li>
              <li><strong>Total Monthly Burn:</strong> ${formatCurrency(analysis.avgMonthlyExpenses)}</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #856404; margin-bottom: 1rem;">🎯 Cash Flow Optimization Opportunities</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Receivables Management:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li>Reduce collection period to 25 days: <strong>+${formatCurrency(getCollectionImprovement(monthlyRevenue, averageCollectionDays, 25))}</strong></li>
              <li>Offer 2% early payment discount</li>
              <li>Implement automated invoicing</li>
              <li>Weekly collection follow-ups</li>
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Payables Optimization:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li>Negotiate 45-day payment terms</li>
              <li>Take advantage of early pay discounts</li>
              <li>Align payment dates with cash inflows</li>
              <li>Use credit cards for short-term float</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #0066cc; margin-bottom: 1rem;">💡 Strategic Recommendations</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Immediate Actions:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getImmediateActions(analysis).map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Financing Strategy:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getFinancingRecommendations(analysis, startingCash).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">📋 Monthly Cash Flow Details</h4>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
              <tr style="background: #e9ecef;">
                <th style="padding: 0.5rem; text-align: left; border: 1px solid #dee2e6;">Month</th>
                <th style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">Sales</th>
                <th style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">Collections</th>
                <th style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">Total Expenses</th>
                <th style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">Net Cash Flow</th>
                <th style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              ${cashFlowProjection.map((month, index) => `
                <tr style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 0.5rem; border: 1px solid #dee2e6;">${month.month}</td>
                  <td style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">${formatCurrency(month.sales)}</td>
                  <td style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">${formatCurrency(month.collections)}</td>
                  <td style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6;">${formatCurrency(month.totalExpenses)}</td>
                  <td style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6; color: ${month.netCashFlow >= 0 ? '#27ae60' : '#dc3545'};">
                    ${formatCurrency(month.netCashFlow)}
                  </td>
                  <td style="padding: 0.5rem; text-align: right; border: 1px solid #dee2e6; font-weight: bold; color: ${month.endingCash >= 0 ? '#27ae60' : '#dc3545'};">
                    ${formatCurrency(month.endingCash)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background: #e8f4fd; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #0066cc; margin-bottom: 0.5rem;">📈 Key Performance Indicators</h5>
        <p style="margin: 0; font-size: 0.9rem; color: #2c3e50;">
          <strong>Operating Cash Flow Margin:</strong> ${((analysis.totalInflows - analysis.totalOutflows) / analysis.totalInflows * 100).toFixed(1)}% | 
          <strong>Cash Conversion Cycle:</strong> ${averageCollectionDays + 15} days | 
          <strong>Seasonal Variation:</strong> ${seasonalVariation}% | 
          <strong>Cash Coverage Ratio:</strong> ${(startingCash / analysis.avgMonthlyExpenses).toFixed(1)} months
        </p>
      </div>
    `;

    document.getElementById("cash-flow-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("cash-flow-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("cash-flow-chart").getContext("2d");
      if (window.cashFlowChart) window.cashFlowChart.destroy();

      const chartData = prepareChartData(cashFlowProjection);

      window.cashFlowChart = new Chart(ctx, {
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
              tension: 0.1,
              yAxisID: 'y'
            },
            {
              label: "Monthly Cash Flow",
              data: chartData.netCashFlow,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              fill: false,
              tension: 0.1,
              yAxisID: 'y1'
            },
            {
              label: "Collections",
              data: chartData.collections,
              borderColor: "#27ae60",
              backgroundColor: "rgba(39, 174, 96, 0.1)",
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
                  return context.dataset.label + ": " + formatCurrency(context.parsed.y);
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
              title: { display: true, text: "Monthly Cash Flow ($)" },
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
  function generateCashFlowProjection(params) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const projection = [];
    let runningCash = params.startingCash;
    let accountsReceivable = 0;

    for (let i = 0; i < 12; i++) {
      const monthNum = i + 1;
      const monthName = months[i];
      
      // Calculate seasonal adjustment
      const seasonalFactor = getSeasonalFactor(monthNum, params.peakMonth, params.lowMonth, params.seasonalVariation);
      const monthlySales = params.monthlyRevenue * seasonalFactor;
      
      // Calculate collections based on collection period
      const collectionDelay = Math.round(params.averageCollectionDays / 30);
      let collections = 0;
      if (i === 0) {
        collections = monthlySales * (1 - collectionDelay * 0.8); // Partial month collection
        accountsReceivable = monthlySales * collectionDelay * 0.8;
      } else {
        collections = accountsReceivable + (monthlySales * (1 - collectionDelay * 0.8));
        accountsReceivable = monthlySales * collectionDelay * 0.8;
      }

      // Calculate expenses
      const cogs = monthlySales * params.costOfGoodsSold;
      const variableExp = monthlySales * params.variableExpenses;
      const quarterlyTax = [3, 6, 9, 12].includes(monthNum) ? params.quarterlyTaxes : 0;
      const annualExp = monthNum === 1 ? params.annualExpenses : 0;
      const capex = monthNum === 6 ? params.plannedCapex : 0; // Assume mid-year capex

      const totalExpenses = cogs + params.fixedExpenses + variableExp + 
                           params.debtPayments + params.ownerDraws + 
                           quarterlyTax + annualExp + capex;

      const netCashFlow = collections - totalExpenses;
      runningCash += netCashFlow;

      projection.push({
        month: monthName,
        sales: monthlySales,
        collections: collections,
        cogs: cogs,
        fixedExpenses: params.fixedExpenses,
        variableExpenses: variableExp,
        debtPayments: params.debtPayments,
        ownerDraws: params.ownerDraws,
        taxes: quarterlyTax,
        annualExpenses: annualExp,
        capex: capex,
        totalExpenses: totalExpenses,
        netCashFlow: netCashFlow,
        endingCash: runningCash
      });
    }

    return projection;
  }

  function getSeasonalFactor(monthNum, peakMonth, lowMonth, variation) {
    const baseValue = 1.0;
    const range = variation;
    
    // Create seasonal curve
    const monthDiff = Math.abs(monthNum - peakMonth);
    const adjustedDiff = Math.min(monthDiff, 12 - monthDiff);
    
    if (monthNum === peakMonth) {
      return baseValue + range;
    } else if (monthNum === lowMonth) {
      return baseValue - range;
    } else {
      // Interpolate between peak and low
      const factor = 1 - (adjustedDiff / 6);
      return baseValue + (range * factor * 0.5);
    }
  }

  function analyzeCashFlow(projection) {
    const totalInflows = projection.reduce((sum, month) => sum + month.collections, 0);
    const totalOutflows = projection.reduce((sum, month) => sum + month.totalExpenses, 0);
    const endingCash = projection[projection.length - 1].endingCash;
    
    const negativeMonths = projection.filter(month => month.netCashFlow < 0);
    const lowestCash = projection.reduce((min, month) => 
      month.endingCash < min.amount ? {amount: month.endingCash, month: month.month} : min,
      {amount: Infinity, month: ''}
    );

    const avgMonthlySales = projection.reduce((sum, month) => sum + month.sales, 0) / 12;
    const avgMonthlyExpenses = projection.reduce((sum, month) => sum + month.totalExpenses, 0) / 12;
    
    const peakSales = Math.max(...projection.map(month => month.sales));
    const lowSales = Math.min(...projection.map(month => month.sales));

    return {
      totalInflows,
      totalOutflows,
      endingCash,
      negativeMonths,
      lowestCash,
      avgMonthlySales,
      avgMonthlyExpenses,
      peakSales,
      lowSales
    };
  }

  function prepareChartData(projection) {
    return {
      labels: projection.map(month => month.month),
      cashBalance: projection.map(month => month.endingCash),
      netCashFlow: projection.map(month => month.netCashFlow),
      collections: projection.map(month => month.collections)
    };
  }

  function getCollectionImprovement(monthlyRevenue, currentDays, targetDays) {
    const currentAR = (monthlyRevenue * currentDays) / 30;
    const targetAR = (monthlyRevenue * targetDays) / 30;
    return currentAR - targetAR;
  }

  function getMonthName(monthNum) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1];
  }

  function getImmediateActions(analysis) {
    const actions = [];
    
    if (analysis.negativeMonths.length > 0) {
      actions.push("🚨 Address negative cash flow months immediately");
      actions.push("💰 Establish credit line for cash flow gaps");
    }
    
    if (analysis.lowestCash.amount < 10000) {
      actions.push("📊 Weekly cash flow monitoring required");
    }
    
    if (analysis.endingCash < 0) {
      actions.push("🎯 Reduce expenses or increase financing");
    }
    
    actions.push("📋 Improve collection procedures");
    actions.push("🤝 Negotiate better payment terms");
    
    return actions;
  }

  function getFinancingRecommendations(analysis, startingCash) {
    const recommendations = [];
    
    if (analysis.lowestCash.amount < 0) {
      const shortfall = Math.abs(analysis.lowestCash.amount);
      recommendations.push(`💳 Line of credit: ${formatCurrency(shortfall * 1.5)} minimum`);
    }
    
    if (startingCash < analysis.avgMonthlyExpenses * 3) {
      recommendations.push("🏦 Build cash reserves to 3-6 months expenses");
    }
    
    if (analysis.negativeMonths.length > 2) {
      recommendations.push("📄 Consider invoice factoring or AR financing");
    }
    
    recommendations.push("🤝 Establish banking relationships before needed");
    
    return recommendations;
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