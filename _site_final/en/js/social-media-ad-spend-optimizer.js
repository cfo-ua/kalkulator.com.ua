document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ad-spend-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const totalMonthlyBudget = parseFloat(document.getElementById("totalMonthlyBudget").value) || 0;
    const businessType = document.getElementById("businessType").value;
    const primaryGoal = document.getElementById("primaryGoal").value;
    const averageOrderValue = parseFloat(document.getElementById("averageOrderValue").value) || 0;
    const customerLifetimeValue = parseFloat(document.getElementById("customerLifetimeValue").value) || 0;
    const profitMargin = parseFloat(document.getElementById("profitMargin").value) || 40;

    // Platform data
    const platforms = [
      {
        name: "Facebook/Instagram",
        spend: parseFloat(document.getElementById("fbSpend").value) || 0,
        revenue: parseFloat(document.getElementById("fbRevenue").value) || 0,
        conversions: parseFloat(document.getElementById("fbConversions").value) || 0
      },
      {
        name: "Google Ads",
        spend: parseFloat(document.getElementById("googleSpend").value) || 0,
        revenue: parseFloat(document.getElementById("googleRevenue").value) || 0,
        conversions: parseFloat(document.getElementById("googleConversions").value) || 0
      },
      {
        name: "LinkedIn",
        spend: parseFloat(document.getElementById("linkedinSpend").value) || 0,
        revenue: parseFloat(document.getElementById("linkedinRevenue").value) || 0,
        conversions: parseFloat(document.getElementById("linkedinConversions").value) || 0
      },
      {
        name: "Other Platforms",
        spend: parseFloat(document.getElementById("otherSpend").value) || 0,
        revenue: parseFloat(document.getElementById("otherRevenue").value) || 0,
        conversions: parseFloat(document.getElementById("otherConversions").value) || 0
      }
    ];

    // Calculate performance metrics for each platform
    const platformAnalysis = platforms.map(platform => {
      const roas = platform.spend > 0 ? platform.revenue / platform.spend : 0;
      const cac = platform.conversions > 0 ? platform.spend / platform.conversions : 0;
      const conversionRate = platform.spend > 0 && averageOrderValue > 0 ? 
        (platform.conversions / (platform.spend / 2.5)) * 100 : 0; // Assuming $2.5 avg CPC
      const ltvcacRatio = cac > 0 ? customerLifetimeValue / cac : 0;
      const profitPerConversion = (averageOrderValue * (profitMargin / 100)) - cac;
      const monthlyProfit = platform.conversions * profitPerConversion;
      
      return {
        ...platform,
        roas,
        cac,
        conversionRate,
        ltvcacRatio,
        profitPerConversion,
        monthlyProfit,
        efficiency: roas * ltvcacRatio // Combined efficiency score
      };
    });

    // Calculate current totals
    const totalCurrentSpend = platforms.reduce((sum, p) => sum + p.spend, 0);
    const totalCurrentRevenue = platforms.reduce((sum, p) => sum + p.revenue, 0);
    const totalCurrentConversions = platforms.reduce((sum, p) => sum + p.conversions, 0);
    const overallRoas = totalCurrentSpend > 0 ? totalCurrentRevenue / totalCurrentSpend : 0;
    const overallCac = totalCurrentConversions > 0 ? totalCurrentSpend / totalCurrentConversions : 0;

    // Optimize budget allocation
    const optimizedAllocation = optimizeBudgetAllocation(platformAnalysis, totalMonthlyBudget, businessType);
    
    // Get industry benchmarks
    const benchmarks = getIndustryBenchmarks(businessType, primaryGoal);

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
      <h3>Social Media Ad Spend Optimization</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">📊 Current Performance Overview</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; text-align: center;">
          <div style="padding: 1rem; background: #e8f4fd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #0066cc;">Total Spend</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${formatCurrency(totalCurrentSpend)}
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              vs ${formatCurrency(totalMonthlyBudget)} budget
            </p>
          </div>
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #27ae60;">Overall ROAS</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${overallRoas.toFixed(1)}:1
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              ${getRoasAssessment(overallRoas, benchmarks.targetRoas)}
            </p>
          </div>
          
          <div style="padding: 1rem; background: #fff3cd; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #856404;">Avg CAC</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${formatCurrency(overallCac)}
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              vs ${formatCurrency(customerLifetimeValue)} LTV
            </p>
          </div>
          
          <div style="padding: 1rem; background: #f8d7da; border-radius: 5px;">
            <h5 style="margin: 0 0 0.5rem 0; color: #721c24;">Total Conversions</h5>
            <p style="font-size: 1.2rem; font-weight: bold; margin: 0;">
              ${totalCurrentConversions}
            </p>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">
              ${formatCurrency(totalCurrentRevenue)} revenue
            </p>
          </div>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #27ae60; margin-bottom: 1rem;">🎯 Platform Performance Analysis</h4>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
              <tr style="background: #d4edda;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #c3e6cb;">Platform</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">Spend</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">ROAS</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">CAC</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">LTV:CAC</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">Profit/Conv</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">Rating</th>
              </tr>
            </thead>
            <tbody>
              ${platformAnalysis.map(platform => `
                <tr style="border-bottom: 1px solid #c3e6cb;">
                  <td style="padding: 0.75rem; border: 1px solid #c3e6cb; font-weight: bold;">${platform.name}</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">${formatCurrency(platform.spend)}</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb; color: ${platform.roas >= benchmarks.targetRoas ? '#27ae60' : '#dc3545'};">
                    ${platform.roas.toFixed(1)}:1
                  </td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">${formatCurrency(platform.cac)}</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb; color: ${platform.ltvcacRatio >= 3 ? '#27ae60' : '#dc3545'};">
                    ${platform.ltvcacRatio.toFixed(1)}:1
                  </td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb; color: ${platform.profitPerConversion > 0 ? '#27ae60' : '#dc3545'};">
                    ${formatCurrency(platform.profitPerConversion)}
                  </td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #c3e6cb;">
                    ${getPlatformRating(platform, benchmarks)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #0066cc; margin-bottom: 1rem;">🚀 Optimized Budget Allocation</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Current vs Recommended:</h5>
            ${optimizedAllocation.map(opt => `
              <div style="background: white; padding: 0.75rem; margin: 0.5rem 0; border-radius: 3px; border-left: 4px solid #007bff;">
                <div style="display: flex; justify-content: between; align-items: center;">
                  <span style="font-weight: bold;">${opt.platform}</span>
                  <div style="text-align: right;">
                    <div style="font-size: 0.9rem;">
                      Current: ${formatCurrency(opt.currentSpend)} 
                      <span style="color: ${opt.change > 0 ? '#27ae60' : '#dc3545'};">(${opt.change > 0 ? '+' : ''}${opt.change.toFixed(0)}%)</span>
                    </div>
                    <div style="font-weight: bold; color: #0066cc;">
                      Recommended: ${formatCurrency(opt.recommendedSpend)}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Expected Improvements:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              <li><strong>Projected ROAS:</strong> ${calculateProjectedRoas(optimizedAllocation, platformAnalysis).toFixed(1)}:1 
                <span style="color: #27ae60;">(+${((calculateProjectedRoas(optimizedAllocation, platformAnalysis) - overallRoas) / overallRoas * 100).toFixed(0)}%)</span>
              </li>
              <li><strong>Additional Conversions:</strong> +${calculateAdditionalConversions(optimizedAllocation, platformAnalysis, totalMonthlyBudget).toFixed(0)} per month</li>
              <li><strong>Efficiency Gain:</strong> Better allocation to high-performing channels</li>
              <li><strong>Risk Reduction:</strong> Diversified spend across proven platforms</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #856404; margin-bottom: 1rem;">💡 Optimization Recommendations</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Immediate Actions:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getImmediateActions(platformAnalysis, overallRoas, benchmarks).map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
          
          <div>
            <h5 style="margin: 0 0 0.5rem 0;">Strategic Improvements:</h5>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
              ${getStrategicActions(platformAnalysis, businessType, primaryGoal).map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #f8d7da; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #721c24; margin-bottom: 1rem;">⚠️ Performance Alerts & Warnings</h4>
        
        <div style="font-size: 0.9rem;">
          ${getPerformanceAlerts(platformAnalysis, overallRoas, overallCac, benchmarks).map(alert => `
            <div style="background: white; padding: 0.75rem; margin: 0.5rem 0; border-radius: 3px; border-left: 4px solid #dc3545;">
              ${alert}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="background: #e8f4fd; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #0066cc; margin-bottom: 0.5rem;">📈 Key Performance Insights</h5>
        <p style="margin: 0; font-size: 0.9rem; color: #2c3e50;">
          <strong>Best Performer:</strong> ${getBestPerformer(platformAnalysis)} | 
          <strong>Budget Utilization:</strong> ${((totalCurrentSpend / totalMonthlyBudget) * 100).toFixed(0)}% | 
          <strong>Profit Margin Impact:</strong> ${((profitMargin / 100) * totalCurrentRevenue).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} gross profit | 
          <strong>Customer Value:</strong> ${(customerLifetimeValue / overallCac).toFixed(1)}x CAC recovery
        </p>
      </div>
    `;

    document.getElementById("ad-spend-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("ad-performance-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("ad-performance-chart").getContext("2d");
      if (window.adPerformanceChart) window.adPerformanceChart.destroy();

      const chartData = prepareChartData(platformAnalysis, optimizedAllocation);

      window.adPerformanceChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Current Spend",
              data: chartData.currentSpend,
              backgroundColor: "#3498db",
              borderColor: "#2980b9",
              borderWidth: 1
            },
            {
              label: "Recommended Spend",
              data: chartData.recommendedSpend,
              backgroundColor: "#27ae60",
              borderColor: "#229954",
              borderWidth: 1
            },
            {
              label: "ROAS",
              data: chartData.roas,
              type: 'line',
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              fill: false,
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
                  if (context.dataset.label === "ROAS") {
                    return "ROAS: " + context.parsed.y.toFixed(1) + ":1";
                  }
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
              title: { display: true, text: "Ad Spend ($)" },
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
              title: { display: true, text: "ROAS" },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: function (value) {
                  return value.toFixed(1) + ":1";
                }
              }
            },
            x: {
              title: { display: true, text: "Platforms" }
            }
          }
        }
      });
    });
  });

  // Helper functions
  function getIndustryBenchmarks(businessType, goal) {
    const benchmarks = {
      ecommerce: { targetRoas: 4.0, targetCac: 50, conversionRate: 3.0 },
      saas: { targetRoas: 3.0, targetCac: 100, conversionRate: 2.0 },
      local: { targetRoas: 3.5, targetCac: 30, conversionRate: 4.0 },
      b2b: { targetRoas: 2.5, targetCac: 150, conversionRate: 1.5 },
      app: { targetRoas: 3.0, targetCac: 25, conversionRate: 5.0 },
      content: { targetRoas: 2.0, targetCac: 20, conversionRate: 8.0 },
      nonprofit: { targetRoas: 2.0, targetCac: 40, conversionRate: 3.0 }
    };
    
    return benchmarks[businessType] || benchmarks.ecommerce;
  }

  function optimizeBudgetAllocation(platforms, totalBudget, businessType) {
    // Calculate efficiency scores
    const platformsWithScores = platforms.map(p => ({
      ...p,
      efficiencyScore: (p.roas * 0.4) + (p.ltvcacRatio * 0.3) + (p.conversions / 10 * 0.3)
    }));

    // Sort by efficiency
    platformsWithScores.sort((a, b) => b.efficiencyScore - a.efficiencyScore);

    // Allocate budget based on performance
    let allocations = [];
    let remainingBudget = totalBudget;
    
    // Give top performer 40-50% of budget
    const topPerformer = platformsWithScores[0];
    const topAllocation = Math.min(remainingBudget * 0.45, topPerformer.spend * 1.5);
    allocations.push({
      platform: topPerformer.name,
      currentSpend: topPerformer.spend,
      recommendedSpend: topAllocation,
      change: ((topAllocation - topPerformer.spend) / Math.max(topPerformer.spend, 1)) * 100
    });
    remainingBudget -= topAllocation;

    // Allocate remaining budget proportionally
    const remainingPlatforms = platformsWithScores.slice(1);
    const totalRemainingScore = remainingPlatforms.reduce((sum, p) => sum + p.efficiencyScore, 0);
    
    remainingPlatforms.forEach(platform => {
      const allocation = totalRemainingScore > 0 ? 
        (platform.efficiencyScore / totalRemainingScore) * remainingBudget :
        remainingBudget / remainingPlatforms.length;
      
      allocations.push({
        platform: platform.name,
        currentSpend: platform.spend,
        recommendedSpend: allocation,
        change: ((allocation - platform.spend) / Math.max(platform.spend, 1)) * 100
      });
    });

    return allocations;
  }

  function getRoasAssessment(roas, target) {
    if (roas >= target) return "✅ Meeting target";
    if (roas >= target * 0.8) return "⚠️ Close to target";
    return "❌ Below target";
  }

  function getPlatformRating(platform, benchmarks) {
    let score = 0;
    if (platform.roas >= benchmarks.targetRoas) score += 2;
    else if (platform.roas >= benchmarks.targetRoas * 0.8) score += 1;
    
    if (platform.ltvcacRatio >= 3) score += 2;
    else if (platform.ltvcacRatio >= 2) score += 1;
    
    if (platform.profitPerConversion > 0) score += 1;

    if (score >= 4) return "🎯 Excellent";
    if (score >= 3) return "✅ Good";
    if (score >= 2) return "⚠️ Average";
    return "❌ Poor";
  }

  function calculateProjectedRoas(allocations, currentPlatforms) {
    let totalProjectedRevenue = 0;
    let totalProjectedSpend = 0;

    allocations.forEach(alloc => {
      const platform = currentPlatforms.find(p => p.name === alloc.platform);
      if (platform && platform.roas > 0) {
        const projectedRevenue = alloc.recommendedSpend * platform.roas;
        totalProjectedRevenue += projectedRevenue;
        totalProjectedSpend += alloc.recommendedSpend;
      }
    });

    return totalProjectedSpend > 0 ? totalProjectedRevenue / totalProjectedSpend : 0;
  }

  function calculateAdditionalConversions(allocations, currentPlatforms, totalBudget) {
    let additionalConversions = 0;

    allocations.forEach(alloc => {
      const platform = currentPlatforms.find(p => p.name === alloc.platform);
      if (platform && platform.cac > 0) {
        const currentConversions = platform.spend / platform.cac;
        const projectedConversions = alloc.recommendedSpend / platform.cac;
        additionalConversions += (projectedConversions - currentConversions);
      }
    });

    return Math.max(0, additionalConversions);
  }

  function getBestPerformer(platforms) {
    const sorted = platforms.sort((a, b) => b.efficiency - a.efficiency);
    return sorted[0]?.name || "None";
  }

  function getImmediateActions(platforms, overallRoas, benchmarks) {
    const actions = [];
    
    if (overallRoas < benchmarks.targetRoas) {
      actions.push("🎯 Focus budget on highest ROAS platforms");
    }
    
    const underperformers = platforms.filter(p => p.roas < benchmarks.targetRoas);
    if (underperformers.length > 0) {
      actions.push("⚠️ Pause or reduce spend on underperforming platforms");
    }
    
    const profitable = platforms.filter(p => p.profitPerConversion > 0);
    if (profitable.length > 0) {
      actions.push("📈 Scale profitable campaigns with additional budget");
    }
    
    actions.push("🔄 Test new audiences and creative formats");
    
    return actions;
  }

  function getStrategicActions(platforms, businessType, goal) {
    const actions = [
      "📊 Implement cross-platform attribution tracking",
      "🎨 Develop platform-specific creative strategies",
      "👥 Create lookalike audiences from top converters"
    ];
    
    if (businessType === 'b2b') {
      actions.push("💼 Focus LinkedIn budget on lead generation");
    }
    
    if (goal === 'awareness') {
      actions.push("👀 Allocate more budget to reach and impression-based campaigns");
    }
    
    return actions;
  }

  function getPerformanceAlerts(platforms, overallRoas, overallCac, benchmarks) {
    const alerts = [];
    
    if (overallRoas < benchmarks.targetRoas * 0.7) {
      alerts.push("🚨 Overall ROAS significantly below target - review targeting and creatives");
    }
    
    const highCacPlatforms = platforms.filter(p => p.cac > benchmarks.targetCac * 1.5);
    if (highCacPlatforms.length > 0) {
      alerts.push(`⚠️ High CAC detected on: ${highCacPlatforms.map(p => p.name).join(', ')}`);
    }
    
    const lowRoasPlatforms = platforms.filter(p => p.roas < 1.0 && p.spend > 0);
    if (lowRoasPlatforms.length > 0) {
      alerts.push(`❌ Negative ROI platforms: ${lowRoasPlatforms.map(p => p.name).join(', ')}`);
    }
    
    if (alerts.length === 0) {
      alerts.push("✅ No critical performance issues detected");
    }
    
    return alerts;
  }

  function prepareChartData(platforms, allocations) {
    return {
      labels: platforms.map(p => p.name.replace(' Ads', '').replace('Facebook/', 'FB/')),
      currentSpend: platforms.map(p => p.spend),
      recommendedSpend: allocations.map(a => a.recommendedSpend),
      roas: platforms.map(p => p.roas)
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