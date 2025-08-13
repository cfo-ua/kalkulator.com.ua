document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("affiliate-earnings-form");
  const result = document.getElementById("affiliate-earnings-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateAffiliateEarnings();
  });

  function calculateAffiliateEarnings() {
    // Get form values
    const monthlyTraffic = parseInt(document.getElementById("monthly-traffic").value) || 0;
    const conversionRate = parseFloat(document.getElementById("conversion-rate").value) || 0;
    const averageOrderValue = parseFloat(document.getElementById("average-order-value").value) || 0;
    const commissionRate = parseFloat(document.getElementById("commission-rate").value) || 0;
    const advertisingCost = parseFloat(document.getElementById("advertising-cost").value) || 0;
    const contentCost = parseFloat(document.getElementById("content-cost").value) || 0;
    const toolsCost = parseFloat(document.getElementById("tools-cost").value) || 0;
    const otherCosts = parseFloat(document.getElementById("other-costs").value) || 0;
    const repeatRate = parseFloat(document.getElementById("repeat-rate").value) || 0;
    const cookieDuration = parseInt(document.getElementById("cookie-duration").value) || 30;

    if (monthlyTraffic <= 0 || conversionRate <= 0 || averageOrderValue <= 0 || commissionRate <= 0) {
      result.innerHTML = '<div class="error">Please fill in all required fields with valid values.</div>';
      return;
    }

    // Calculate earnings metrics
    const earnings = calculateEarningsMetrics(
      monthlyTraffic, conversionRate, averageOrderValue, commissionRate,
      advertisingCost, contentCost, toolsCost, otherCosts, repeatRate, cookieDuration
    );

    // Get affiliate level and recommendations
    const affiliateLevel = getAffiliateLevel(monthlyTraffic, earnings.netProfit);
    const recommendations = getRecommendations(affiliateLevel, earnings);

    displayResults(earnings, affiliateLevel, recommendations);
  }

  function calculateEarningsMetrics(traffic, conversionRate, aov, commissionRate, 
                                   adCost, contentCost, toolsCost, otherCosts, repeatRate, cookieDuration) {
    
    // Basic calculations
    const conversions = traffic * (conversionRate / 100);
    const grossRevenue = conversions * aov;
    const grossCommission = grossRevenue * (commissionRate / 100);
    
    // Repeat purchases (simplified model)
    const repeatPurchases = conversions * (repeatRate / 100);
    const repeatRevenue = repeatPurchases * aov * (commissionRate / 100);
    
    // Total monthly earnings
    const totalEarnings = grossCommission + repeatRevenue;
    
    // Total costs
    const totalCosts = adCost + contentCost + toolsCost + otherCosts;
    
    // Net profit
    const netProfit = totalEarnings - totalCosts;
    
    // Key metrics
    const epc = totalEarnings / traffic; // Earnings Per Click
    const roi = totalCosts > 0 ? ((netProfit / totalCosts) * 100) : 0;
    const costPerConversion = totalCosts > 0 ? (totalCosts / conversions) : 0;
    const profitMargin = totalEarnings > 0 ? ((netProfit / totalEarnings) * 100) : 0;

    return {
      traffic: traffic,
      conversions: Math.round(conversions * 10) / 10,
      grossRevenue: grossRevenue,
      grossCommission: grossCommission,
      repeatRevenue: repeatRevenue,
      totalEarnings: totalEarnings,
      totalCosts: totalCosts,
      netProfit: netProfit,
      yearlyProfit: netProfit * 12,
      epc: epc,
      roi: roi,
      costPerConversion: costPerConversion,
      profitMargin: profitMargin,
      conversionRate: conversionRate
    };
  }

  function getAffiliateLevel(traffic, netProfit) {
    if (traffic < 1000 || netProfit < 100) {
      return {
        name: "Beginner",
        description: "Learning and first steps in affiliate marketing",
        color: "info",
        stage: "learning"
      };
    } else if (traffic < 10000 || netProfit < 1000) {
      return {
        name: "Growing",
        description: "Scaling and optimizing campaigns",
        color: "warning",
        stage: "growing"
      };
    } else if (traffic < 50000 || netProfit < 5000) {
      return {
        name: "Professional",
        description: "Stable affiliate business",
        color: "success",
        stage: "professional"
      };
    } else {
      return {
        name: "Expert",
        description: "Full-scale affiliate company",
        color: "success",
        stage: "expert"
      };
    }
  }

  function getRecommendations(level, earnings) {
    const recommendations = {
      "learning": [
        "Focus on creating quality content and building audience trust",
        "Study successful case studies in your chosen niche",
        "Start with free traffic sources (SEO, social media)",
        "Test different affiliate programs and products",
        "Use Google Analytics to track your results"
      ],
      "growing": [
        "Invest in paid advertising to scale traffic",
        "Diversify traffic sources and affiliate programs",
        "Build email lists to increase customer LTV",
        "A/B test landing pages and content to improve conversion",
        "Start building personal brand in your niche"
      ],
      "professional": [
        "Automate processes using specialized tools",
        "Expand to new niches and geographical markets",
        "Create your own products to increase margins",
        "Hire freelancers for content and advertising",
        "Implement retargeting and email marketing"
      ],
      "expert": [
        "Consider creating your own affiliate network",
        "Invest in technology solutions and analytics",
        "Expand team and delegate responsibilities",
        "Create strategic partnerships with major brands",
        "Consider M&A opportunities in adjacent areas"
      ]
    };

    return recommendations[level.stage] || recommendations["learning"];
  }

  function displayResults(earnings, level, recommendations) {
    const profitabilityStatus = earnings.netProfit > 0 ? "💰 Profitable" : "⚠️ Loss-making";
    const profitabilityColor = earnings.netProfit > 0 ? "success" : "warning";

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>💰 Net Profit</h6>
          <div class="big-number">$${earnings.netProfit.toFixed(0)}</div>
          <p>Monthly income after expenses</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Annual Projection</h6>
          <div class="big-number">$${earnings.yearlyProfit.toFixed(0)}</div>
          <p>Yearly extrapolation</p>
        </div>

        <div class="insight-card ${level.color}">
          <h6>🎯 Affiliate Level</h6>
          <div class="big-number">${level.name}</div>
          <p>${level.description}</p>
        </div>

        <div class="insight-card ${profitabilityColor}">
          <h6>📊 Profitability</h6>
          <div class="big-number">${earnings.roi.toFixed(1)}%</div>
          <p>Campaign ROI</p>
        </div>
      </div>

      <div class="earnings-breakdown">
        <h4>📈 Earnings Breakdown</h4>
        <div class="earnings-chart">
          <div class="earning-item">
            <span class="earning-label">🎯 Conversions:</span>
            <span class="earning-value">${earnings.conversions} out of ${earnings.traffic} clicks</span>
          </div>
          
          <div class="earning-item">
            <span class="earning-label">💵 Gross Revenue:</span>
            <span class="earning-value">$${earnings.grossRevenue.toFixed(2)}</span>
          </div>
          
          <div class="earning-item">
            <span class="earning-label">💰 Commission:</span>
            <span class="earning-value">$${earnings.grossCommission.toFixed(2)}</span>
          </div>
          
          <div class="earning-item">
            <span class="earning-label">🔄 Repeat Purchases:</span>
            <span class="earning-value">$${earnings.repeatRevenue.toFixed(2)}</span>
          </div>
          
          <div class="earning-item total">
            <span class="earning-label">📊 Total Earnings:</span>
            <span class="earning-value">$${earnings.totalEarnings.toFixed(2)}</span>
          </div>
          
          <div class="earning-item cost">
            <span class="earning-label">💸 Total Costs:</span>
            <span class="earning-value">$${earnings.totalCosts.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="key-metrics">
        <h4>📊 Key Metrics</h4>
        <div class="metrics-grid">
          <div class="metric-item">
            <strong>EPC (Earnings Per Click):</strong> $${earnings.epc.toFixed(3)}
          </div>
          <div class="metric-item">
            <strong>Conversion Rate:</strong> ${earnings.conversionRate}%
          </div>
          <div class="metric-item">
            <strong>Cost Per Conversion:</strong> $${earnings.costPerConversion.toFixed(2)}
          </div>
          <div class="metric-item">
            <strong>Profit Margin:</strong> ${earnings.profitMargin.toFixed(1)}%
          </div>
        </div>
      </div>

      <div class="optimization-tips">
        <h4>💡 Optimization Recommendations</h4>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      ${earnings.roi < 0 ? `
        <div class="warning-section">
          <h4>⚠️ Loss-making Campaign Warning</h4>
          <p>Your current campaign is operating at a loss. Recommendations:</p>
          <ul>
            <li>Reduce advertising costs or find cheaper traffic sources</li>
            <li>Improve conversion rates through content optimization</li>
            <li>Choose products with higher commission rates</li>
            <li>Focus on organic traffic (SEO, content marketing)</li>
          </ul>
        </div>
      ` : ''}

      <div class="disclaimer">
        <h4>📋 Important Notes</h4>
        <ul>
          <li>Calculations are based on input data and average industry metrics</li>
          <li>Actual results may vary significantly depending on niche and traffic quality</li>
          <li>Consider seasonality and trends in your niche</li>
          <li>Always test and optimize campaigns based on real data</li>
          <li>Don't forget about tax obligations on affiliate income</li>
        </ul>
      </div>
    `;
  }
});