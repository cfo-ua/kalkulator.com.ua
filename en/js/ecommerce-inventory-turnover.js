document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inventory-turnover-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const beginningInventory = parseFloat(document.getElementById("beginningInventory").value) || 0;
    const endingInventory = parseFloat(document.getElementById("endingInventory").value) || 0;
    const costOfGoodsSold = parseFloat(document.getElementById("costOfGoodsSold").value) || 0;
    const totalRevenue = parseFloat(document.getElementById("totalRevenue").value) || 0;
    const analysisType = document.getElementById("analysisType").value;
    const productCategory = document.getElementById("productCategory").value;
    const seasonalBusiness = document.getElementById("seasonalBusiness").value;
    const deadStock = parseFloat(document.getElementById("deadStock").value) || 0;
    const averageLeadTime = parseInt(document.getElementById("averageLeadTime").value) || 21;
    const safetyStockDays = parseInt(document.getElementById("safetyStockDays").value) || 14;
    const carryingCostRate = parseFloat(document.getElementById("carryingCostRate").value) || 25;
    const warehouseCost = parseFloat(document.getElementById("warehouseCost").value) || 0;
    const opportunityCostRate = parseFloat(document.getElementById("opportunityCostRate").value) || 12;

    // Calculate core metrics
    const averageInventory = (beginningInventory + endingInventory) / 2;
    const inventoryTurnover = averageInventory > 0 ? costOfGoodsSold / averageInventory : 0;
    const daysInInventory = inventoryTurnover > 0 ? 365 / inventoryTurnover : 365;
    
    // Adjust for analysis period
    const periodMultiplier = analysisType === 'quarterly' ? 4 : analysisType === 'monthly' ? 12 : 1;
    const adjustedTurnover = inventoryTurnover * periodMultiplier;
    const adjustedDaysInInventory = daysInInventory / periodMultiplier;

    // Calculate financial metrics
    const grossMargin = totalRevenue > 0 ? ((totalRevenue - costOfGoodsSold) / totalRevenue) * 100 : 0;
    const inventoryToRevenueRatio = totalRevenue > 0 ? (averageInventory / totalRevenue) * 100 : 0;
    const sellThroughRate = beginningInventory > 0 ? (costOfGoodsSold / beginningInventory) * 100 : 0;
    
    // Calculate carrying costs
    const annualCarryingCost = averageInventory * (carryingCostRate / 100);
    const monthlyCarryingCost = annualCarryingCost / 12;
    const totalStorageCost = warehouseCost * 12;
    const opportunityCost = averageInventory * (opportunityCostRate / 100);

    // Calculate dead stock metrics
    const deadStockPercentage = averageInventory > 0 ? (deadStock / averageInventory) * 100 : 0;
    const activeInventory = averageInventory - deadStock;
    const activeTurnover = activeInventory > 0 ? costOfGoodsSold / activeInventory : 0;

    // Get industry benchmarks
    const benchmarks = getIndustryBenchmarks(productCategory);
    
    // Calculate optimization scenarios
    const optimizationScenarios = calculateOptimizationScenarios(
      costOfGoodsSold, averageInventory, benchmarks, deadStock
    );

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
      <h3>E-commerce Inventory Turnover Analysis</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">📊 Core Inventory Metrics</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; text-align: center;">
          <div style="padding: 1rem; background: #e8f4fd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #0066cc;">Turnover Ratio</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${inventoryTurnover.toFixed(1)}x
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              ${getBenchmarkComparison(inventoryTurnover, benchmarks.turnover)}
            </p>
          </div>
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #27ae60;">Days in Inventory</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${daysInInventory.toFixed(0)} days
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              ${getBenchmarkComparison(daysInInventory, benchmarks.daysInInventory, true)}
            </p>
          </div>
          
          <div style="padding: 1rem; background: #fff3cd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #856404;">Sell-Through Rate</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${sellThroughRate.toFixed(1)}%
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              ${analysisType} period
            </p>
          </div>
          
          <div style="padding: 1rem; background: #f8d7da; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #721c24;">Dead Stock</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${deadStockPercentage.toFixed(1)}%
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              ${formatCurrency(deadStock)}
            </p>
          </div>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #27ae60; margin-bottom: 1rem;">💰 Financial Impact Analysis</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Inventory Investment:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Average Inventory:</strong> ${formatCurrency(averageInventory)}</li>
              <li><strong>Active Inventory:</strong> ${formatCurrency(activeInventory)}</li>
              <li><strong>Inventory-to-Revenue:</strong> ${inventoryToRevenueRatio.toFixed(1)}%</li>
              <li><strong>Gross Margin:</strong> ${grossMargin.toFixed(1)}%</li>
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Carrying Costs (Annual):</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Total Carrying Cost:</strong> ${formatCurrency(annualCarryingCost)}</li>
              <li><strong>Storage/Warehouse:</strong> ${formatCurrency(totalStorageCost)}</li>
              <li><strong>Opportunity Cost:</strong> ${formatCurrency(opportunityCost)}</li>
              <li><strong>Cost per Dollar of Inventory:</strong> ${(carryingCostRate / 100).toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #0066cc; margin-bottom: 1rem;">🎯 Optimization Opportunities</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          ${optimizationScenarios.map(scenario => `
            <div style="background: white; padding: 1rem; border-radius: 5px; border-left: 4px solid #007bff;">
              <h5 style="margin: 0 0 0.5rem 0; color: #0066cc;">${scenario.name}</h5>
              <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">${scenario.description}</p>
              <p style="margin: 0; font-weight: bold;">
                <span style="color: #27ae60;">Turnover: ${scenario.newTurnover.toFixed(1)}x</span><br>
                <span style="color: #856404;">Cash Freed: ${formatCurrency(scenario.cashFreed)}</span>
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="background: #fff3cd; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #856404; margin-bottom: 1rem;">📋 Industry Benchmarks & Comparison</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">${getCategoryName(productCategory)} Benchmarks:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Typical Turnover:</strong> ${benchmarks.turnover[0]}-${benchmarks.turnover[1]}x annually</li>
              <li><strong>Days in Inventory:</strong> ${benchmarks.daysInInventory[0]}-${benchmarks.daysInInventory[1]} days</li>
              <li><strong>Seasonal Variation:</strong> ${getSeasonalityDescription(seasonalBusiness)}</li>
              <li><strong>Dead Stock Target:</strong> <5% of total inventory</li>
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Your Performance:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Current Turnover:</strong> ${getPerformanceRating(inventoryTurnover, benchmarks.turnover)}</li>
              <li><strong>Inventory Efficiency:</strong> ${getEfficiencyRating(daysInInventory, deadStockPercentage)}</li>
              <li><strong>Working Capital Usage:</strong> ${getWorkingCapitalRating(inventoryToRevenueRatio)}</li>
              <li><strong>Overall Grade:</strong> ${getOverallGrade(inventoryTurnover, benchmarks.turnover, deadStockPercentage)}</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #f8d7da; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #721c24; margin-bottom: 1rem;">🚀 Action Plan & Recommendations</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Immediate Actions:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getImmediateActions(inventoryTurnover, deadStockPercentage, daysInInventory, benchmarks).map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Strategic Improvements:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getStrategicActions(inventoryTurnover, benchmarks, averageLeadTime, safetyStockDays).map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #e8f4fd; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #0066cc; margin-bottom: 0.5rem;">💡 Key Performance Insights</h5>
        <p style="margin: 0; font-size: 0.9rem; color: #2c3e50;">
          <strong>Inventory Velocity:</strong> ${(365 / daysInInventory).toFixed(1)} times per year | 
          <strong>Capital Efficiency:</strong> ${(costOfGoodsSold / averageInventory).toFixed(2)} revenue per $ invested | 
          <strong>Active Turnover:</strong> ${activeTurnover.toFixed(1)}x (excluding dead stock) | 
          <strong>Lead Time Coverage:</strong> ${(daysInInventory / averageLeadTime).toFixed(1)}x average lead time
        </p>
      </div>
    `;

    document.getElementById("inventory-turnover-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("inventory-metrics-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("inventory-metrics-chart").getContext("2d");
      if (window.inventoryMetricsChart) window.inventoryMetricsChart.destroy();

      const chartData = prepareChartData(inventoryTurnover, daysInInventory, benchmarks, optimizationScenarios);

      window.inventoryMetricsChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Current Performance", "Industry Low", "Industry High", "Optimized Target"],
          datasets: [
            {
              label: "Inventory Turnover (x)",
              data: [
                inventoryTurnover,
                benchmarks.turnover[0],
                benchmarks.turnover[1],
                optimizationScenarios[0].newTurnover
              ],
              backgroundColor: ["#3498db", "#95a5a6", "#27ae60", "#e74c3c"],
              borderColor: ["#2980b9", "#7f8c8d", "#229954", "#c0392b"],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.dataset.label + ": " + context.parsed.y.toFixed(1) + "x";
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Inventory Turnover Ratio" },
              ticks: {
                callback: function (value) {
                  return value.toFixed(1) + "x";
                }
              }
            },
            x: {
              title: { display: true, text: "Performance Comparison" }
            }
          }
        }
      });
    });
  });

  // Helper functions
  function getIndustryBenchmarks(category) {
    const benchmarks = {
      fashion: { turnover: [4, 6], daysInInventory: [60, 90] },
      electronics: { turnover: [8, 12], daysInInventory: [30, 45] },
      home: { turnover: [3, 5], daysInInventory: [75, 120] },
      beauty: { turnover: [4, 8], daysInInventory: [45, 90] },
      sports: { turnover: [4, 7], daysInInventory: [50, 90] },
      books: { turnover: [2, 4], daysInInventory: [90, 180] },
      toys: { turnover: [4, 6], daysInInventory: [60, 90] },
      auto: { turnover: [6, 10], daysInInventory: [35, 60] },
      other: { turnover: [4, 8], daysInInventory: [45, 90] }
    };
    return benchmarks[category] || benchmarks.other;
  }

  function calculateOptimizationScenarios(cogs, avgInventory, benchmarks, deadStock) {
    const scenarios = [
      {
        name: "Target Industry High",
        description: "Achieve top industry performance",
        targetTurnover: benchmarks.turnover[1],
        newInventory: cogs / benchmarks.turnover[1],
        newTurnover: benchmarks.turnover[1],
        cashFreed: avgInventory - (cogs / benchmarks.turnover[1])
      },
      {
        name: "Remove Dead Stock",
        description: "Liquidate slow-moving inventory",
        targetTurnover: cogs / (avgInventory - deadStock),
        newInventory: avgInventory - deadStock,
        newTurnover: deadStock > 0 ? cogs / (avgInventory - deadStock) : cogs / avgInventory,
        cashFreed: deadStock
      },
      {
        name: "Optimize Lead Times",
        description: "Reduce safety stock by 50%",
        targetTurnover: cogs / (avgInventory * 0.9),
        newInventory: avgInventory * 0.9,
        newTurnover: cogs / (avgInventory * 0.9),
        cashFreed: avgInventory * 0.1
      }
    ];
    
    return scenarios;
  }

  function getBenchmarkComparison(value, benchmarkRange, reverse = false) {
    if (reverse) {
      if (value <= benchmarkRange[0]) return "✅ Excellent";
      if (value <= benchmarkRange[1]) return "👍 Good";
      return "⚠️ Needs improvement";
    } else {
      if (value >= benchmarkRange[1]) return "✅ Excellent";
      if (value >= benchmarkRange[0]) return "👍 Good";
      return "⚠️ Below benchmark";
    }
  }

  function getCategoryName(category) {
    const names = {
      fashion: "Fashion & Apparel",
      electronics: "Electronics & Tech",
      home: "Home & Garden",
      beauty: "Health & Beauty",
      sports: "Sports & Outdoors",
      books: "Books & Media",
      toys: "Toys & Games",
      auto: "Automotive",
      other: "General Retail"
    };
    return names[category] || "General Retail";
  }

  function getSeasonalityDescription(seasonal) {
    const descriptions = {
      none: "Stable year-round demand",
      low: "Minor seasonal variations",
      moderate: "Significant seasonal peaks",
      high: "Extreme seasonal fluctuations"
    };
    return descriptions[seasonal] || "Variable demand";
  }

  function getPerformanceRating(turnover, benchmark) {
    if (turnover >= benchmark[1]) return "🎯 Top performer";
    if (turnover >= benchmark[0]) return "✅ Meeting standards";
    return "⚠️ Below industry average";
  }

  function getEfficiencyRating(daysInInventory, deadStockPercent) {
    if (daysInInventory <= 45 && deadStockPercent <= 5) return "🚀 Highly efficient";
    if (daysInInventory <= 90 && deadStockPercent <= 10) return "✅ Efficient";
    return "⚠️ Needs optimization";
  }

  function getWorkingCapitalRating(inventoryToRevenue) {
    if (inventoryToRevenue <= 15) return "💰 Excellent capital efficiency";
    if (inventoryToRevenue <= 25) return "👍 Good capital usage";
    return "⚠️ High capital requirements";
  }

  function getOverallGrade(turnover, benchmark, deadStockPercent) {
    let score = 0;
    if (turnover >= benchmark[1]) score += 3;
    else if (turnover >= benchmark[0]) score += 2;
    else score += 1;
    
    if (deadStockPercent <= 5) score += 2;
    else if (deadStockPercent <= 10) score += 1;
    
    if (score >= 4) return "A";
    if (score >= 3) return "B";
    if (score >= 2) return "C";
    return "D";
  }

  function getImmediateActions(turnover, deadStock, daysInInventory, benchmarks) {
    const actions = [];
    
    if (deadStock > 10) {
      actions.push("🎯 Liquidate dead stock through sales/discounts");
    }
    
    if (turnover < benchmarks.turnover[0]) {
      actions.push("📊 Analyze slow-moving SKUs and adjust purchasing");
    }
    
    if (daysInInventory > benchmarks.daysInInventory[1]) {
      actions.push("⚡ Implement more aggressive marketing campaigns");
    }
    
    actions.push("📋 Review and update reorder points");
    
    return actions;
  }

  function getStrategicActions(turnover, benchmarks, leadTime, safetyStock) {
    const actions = [
      "🤖 Implement automated demand forecasting",
      "🔄 Establish vendor-managed inventory programs",
      "📱 Use inventory management software with analytics"
    ];
    
    if (leadTime > 30) {
      actions.push("🤝 Negotiate shorter supplier lead times");
    }
    
    if (safetyStock > 21) {
      actions.push("📉 Optimize safety stock levels");
    }
    
    return actions;
  }

  function prepareChartData(currentTurnover, daysInInventory, benchmarks, scenarios) {
    return {
      turnoverComparison: [
        currentTurnover,
        benchmarks.turnover[0],
        benchmarks.turnover[1],
        scenarios[0].newTurnover
      ]
    };
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