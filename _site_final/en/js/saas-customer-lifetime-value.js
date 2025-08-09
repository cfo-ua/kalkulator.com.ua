document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("saas-clv-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const monthlyArpu = parseFloat(document.getElementById("monthlyArpu").value) || 0;
    const grossMargin = parseFloat(document.getElementById("grossMargin").value) || 80;
    const monthlyChurn = parseFloat(document.getElementById("monthlyChurn").value) || 3.5;
    const expansionRate = parseFloat(document.getElementById("expansionRate").value) || 0;
    const customerAcquisitionCost = parseFloat(document.getElementById("customerAcquisitionCost").value) || 0;
    const newCustomersMonthly = parseFloat(document.getElementById("newCustomersMonthly").value) || 0;
    const discountRate = parseFloat(document.getElementById("discountRate").value) || 10;
    const projectionMonths = parseInt(document.getElementById("projectionMonths").value) || 36;

    // Calculate core metrics
    const monthlyChurnDecimal = monthlyChurn / 100;
    const grossMarginDecimal = grossMargin / 100;
    const expansionDecimal = expansionRate / 100;
    const monthlyNetArpu = monthlyArpu * grossMarginDecimal;

    // Customer Lifetime calculations
    const customerLifespanMonths = monthlyChurnDecimal > 0 ? 1 / monthlyChurnDecimal : 999;
    const annualChurnRate = 1 - Math.pow(1 - monthlyChurnDecimal, 12);

    // CLV calculations (multiple methods)
    const basicClv = monthlyChurnDecimal > 0 ? monthlyNetArpu / monthlyChurnDecimal : monthlyNetArpu * 999;
    
    // CLV with expansion revenue
    const netMonthlyGrowth = expansionDecimal - monthlyChurnDecimal;
    const expandedClv = netMonthlyGrowth > 0 ? monthlyNetArpu / netMonthlyGrowth : basicClv;

    // NPV-adjusted CLV
    const monthlyDiscountRate = Math.pow(1 + discountRate / 100, 1/12) - 1;
    const npvClv = calculateNpvClv(monthlyNetArpu, monthlyChurnDecimal, monthlyDiscountRate, projectionMonths);

    // Business metrics
    const ltvCacRatio = customerAcquisitionCost > 0 ? basicClv / customerAcquisitionCost : 0;
    const paybackPeriodMonths = customerAcquisitionCost > 0 ? customerAcquisitionCost / monthlyNetArpu : 0;
    const customerRoi = customerAcquisitionCost > 0 ? ((basicClv - customerAcquisitionCost) / customerAcquisitionCost) * 100 : 0;

    // Generate cohort analysis data for chart
    const cohortData = generateCohortData(monthlyArpu, grossMarginDecimal, monthlyChurnDecimal, expansionDecimal, projectionMonths);

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
      <h3>SaaS Customer Lifetime Value Analysis</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">💰 Customer Lifetime Value Metrics</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div style="text-align: center; padding: 1rem; background: #e8f5e8; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #27ae60;">Basic CLV</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(basicClv)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Standard calculation
            </p>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #cce5ff; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #0066cc;">Expanded CLV</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(expandedClv)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              With expansion revenue
            </p>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #fff3cd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #856404;">NPV-Adjusted CLV</h5>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">
              ${formatCurrency(npvClv)}
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Present value adjusted
            </p>
          </div>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #27ae60; margin-bottom: 1rem;">📊 Key Business Metrics</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li><strong>Monthly ARPU:</strong> ${formatCurrency(monthlyArpu)}</li>
              <li><strong>Monthly Net Revenue:</strong> ${formatCurrency(monthlyNetArpu)}</li>
              <li><strong>Customer Lifespan:</strong> ${customerLifespanMonths.toFixed(1)} months</li>
              <li><strong>Annual Churn Rate:</strong> ${(annualChurnRate * 100).toFixed(1)}%</li>
            </ul>
          </div>
          <div>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li><strong>LTV:CAC Ratio:</strong> ${ltvCacRatio.toFixed(1)}:1 ${getLtvCacAssessment(ltvCacRatio)}</li>
              <li><strong>Payback Period:</strong> ${paybackPeriodMonths.toFixed(1)} months</li>
              <li><strong>Customer ROI:</strong> ${customerRoi.toFixed(0)}%</li>
              <li><strong>Expansion Impact:</strong> ${getExpansionImpact(expansionRate, monthlyChurn)}</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #0066cc; margin-bottom: 1rem;">🎯 Strategic Insights & Recommendations</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Unit Economics Health:</h5>
            <p style="margin: 0; padding: 0.5rem; background: ${getHealthColor(ltvCacRatio)}; border-radius: 3px;">
              ${getUnitEconomicsHealth(ltvCacRatio, paybackPeriodMonths)}
            </p>
          </div>
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Growth Recommendations:</h5>
            <p style="margin: 0; padding: 0.5rem; background: #f8f9fa; border-radius: 3px;">
              ${getGrowthRecommendations(monthlyChurn, expansionRate)}
            </p>
          </div>
        </div>
        
        <div style="margin-top: 1rem;">
          <h5 style="margin: 0 0 0.5rem 0;">Optimization Priorities:</h5>
          <ul style="margin: 0; padding-left: 1.2rem;">
            ${getOptimizationPriorities(monthlyChurn, expansionRate, ltvCacRatio).map(priority => `<li>${priority}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="background: #f8d7da; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #721c24; margin-bottom: 0.5rem;">📈 Revenue Projections</h5>
        <p style="margin: 0; color: #2c3e50;">
          <strong>Monthly New Customer Value:</strong> ${formatCurrency(newCustomersMonthly * basicClv)} (${newCustomersMonthly} customers × ${formatCurrency(basicClv)} CLV)<br>
          <strong>Customer Acquisition Investment:</strong> ${formatCurrency(newCustomersMonthly * customerAcquisitionCost)}<br>
          <strong>Net Customer Value Created:</strong> ${formatCurrency(newCustomersMonthly * (basicClv - customerAcquisitionCost))}
        </p>
      </div>
    `;

    document.getElementById("saas-clv-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("clv-metrics-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("clv-metrics-chart").getContext("2d");
      if (window.clvMetricsChart) window.clvMetricsChart.destroy();

      window.clvMetricsChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: cohortData.labels,
          datasets: [
            {
              label: "Cumulative Revenue",
              data: cohortData.cumulativeRevenue,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              fill: true,
              tension: 0.1
            },
            {
              label: "Customers Remaining",
              data: cohortData.customersRemaining,
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
                    return "Revenue: " + formatCurrency(context.parsed.y);
                  } else {
                    return "Customers: " + context.parsed.y.toFixed(0) + "%";
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
              title: { display: true, text: "Cumulative Revenue ($)" },
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
              title: { display: true, text: "Customer Retention %" },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: function (value) {
                  return value.toFixed(0) + "%";
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
  function calculateNpvClv(monthlyRevenue, churnRate, discountRate, months) {
    let npvTotal = 0;
    let survivingCustomers = 1;
    
    for (let month = 1; month <= months; month++) {
      const monthlyValue = survivingCustomers * monthlyRevenue;
      const discountedValue = monthlyValue / Math.pow(1 + discountRate, month);
      npvTotal += discountedValue;
      survivingCustomers *= (1 - churnRate);
      
      if (survivingCustomers < 0.01) break; // Stop when <1% remain
    }
    
    return npvTotal;
  }

  function generateCohortData(arpu, marginDecimal, churnRate, expansionRate, months) {
    const labels = [];
    const cumulativeRevenue = [];
    const customersRemaining = [];
    
    let customers = 1; // Start with 1 customer cohort
    let totalRevenue = 0;
    let currentArpu = arpu * marginDecimal;
    
    for (let month = 1; month <= months; month++) {
      labels.push(`Month ${month}`);
      
      // Calculate revenue for this month
      const monthlyRevenue = customers * currentArpu;
      totalRevenue += monthlyRevenue;
      cumulativeRevenue.push(totalRevenue);
      
      // Track customer retention
      customersRemaining.push(customers * 100);
      
      // Apply churn and expansion for next month
      customers *= (1 - churnRate);
      currentArpu *= (1 + expansionRate);
      
      if (customers < 0.001) break; // Stop when virtually no customers remain
    }
    
    return { labels, cumulativeRevenue, customersRemaining };
  }

  function getLtvCacAssessment(ratio) {
    if (ratio < 1) return "❌";
    if (ratio < 3) return "⚠️";
    if (ratio < 5) return "✅";
    return "🎯";
  }

  function getHealthColor(ratio) {
    if (ratio < 3) return "#f8d7da";
    if (ratio < 5) return "#fff3cd";
    return "#d4edda";
  }

  function getUnitEconomicsHealth(ltvCacRatio, payback) {
    if (ltvCacRatio < 1) return "❌ Unsustainable - CAC exceeds CLV";
    if (ltvCacRatio < 3) return "⚠️ Marginal - Need to improve retention or reduce CAC";
    if (payback > 18) return "⚠️ Good ratio but long payback period";
    if (ltvCacRatio >= 5) return "🎯 Excellent - Strong unit economics";
    return "✅ Healthy - Good balance of growth and efficiency";
  }

  function getExpansionImpact(expansion, churn) {
    const netGrowth = expansion - churn;
    if (netGrowth > 0) return `${expansion.toFixed(1)}% expansion creates net growth`;
    if (expansion > churn * 0.5) return `${expansion.toFixed(1)}% expansion significantly reduces churn impact`;
    return `${expansion.toFixed(1)}% expansion helps offset churn`;
  }

  function getGrowthRecommendations(churn, expansion) {
    if (churn > 5) return "Focus on churn reduction - high churn rate limiting growth";
    if (expansion < 2) return "Increase expansion revenue through upsells and cross-sells";
    return "Well-balanced retention and expansion strategy";
  }

  function getOptimizationPriorities(churn, expansion, ltvCac) {
    const priorities = [];
    
    if (churn > 5) priorities.push("🎯 <strong>Critical:</strong> Reduce monthly churn below 3-5%");
    if (expansion < 2) priorities.push("📈 <strong>High:</strong> Implement expansion revenue strategies");
    if (ltvCac < 3) priorities.push("💰 <strong>Critical:</strong> Improve LTV:CAC ratio above 3:1");
    if (ltvCac > 8) priorities.push("🚀 <strong>Opportunity:</strong> Consider increasing marketing spend");
    
    if (priorities.length === 0) {
      priorities.push("✅ <strong>Optimization:</strong> Focus on incremental improvements across all metrics");
    }
    
    return priorities;
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