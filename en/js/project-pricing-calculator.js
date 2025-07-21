document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("project-pricing-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const baseProjectCost = parseFloat(document.getElementById("baseProjectCost").value);
    const baseProjectHours = parseFloat(document.getElementById("baseProjectHours").value);
    const baseProjectComplexity = parseInt(document.getElementById("baseProjectComplexity").value);
    const currentComplexity = parseInt(document.getElementById("currentComplexity").value);
    const timelinePressure = document.getElementById("timelinePressure").value;
    const clientTier = document.getElementById("clientTier").value;
    const projectScope = document.getElementById("projectScope").value;
    const riskLevel = document.getElementById("riskLevel").value;
    const revisions = parseInt(document.getElementById("revisions").value);
    const profitMargin = parseFloat(document.getElementById("profitMargin").value) / 100;

    // Calculate base hourly rate from historical project
    const baseHourlyRate = baseProjectCost / baseProjectHours;

    // Complexity adjustment
    const complexityMultiplier = currentComplexity / baseProjectComplexity;

    // Timeline pressure multiplier
    const timelineMultipliers = {
      'relaxed': 0.9,
      'normal': 1.0,
      'tight': 1.3,
      'rush': 1.8
    };

    // Client tier multiplier
    const clientMultipliers = {
      'startup': 0.8,
      'medium': 1.0,
      'enterprise': 1.4,
      'nonprofit': 0.7
    };

    // Project scope multiplier
    const scopeMultipliers = {
      'smaller': 0.5,
      'similar': 1.0,
      'larger': 1.5,
      'much-larger': 2.0
    };

    // Risk buffer
    const riskBuffers = {
      'low': 1.1,
      'medium': 1.2,
      'high': 1.4
    };

    // Calculate adjusted project cost
    let adjustedCost = baseProjectCost * 
                      complexityMultiplier * 
                      timelineMultipliers[timelinePressure] * 
                      clientMultipliers[clientTier] * 
                      scopeMultipliers[projectScope] * 
                      riskBuffers[riskLevel];

    // Add revision costs (each revision = 10% of base cost)
    const revisionCost = adjustedCost * 0.1 * revisions;
    adjustedCost += revisionCost;

    // Add profit margin
    const finalPrice = adjustedCost * (1 + profitMargin);

    // Calculate estimated hours
    const estimatedHours = baseProjectHours * 
                          complexityMultiplier * 
                          scopeMultipliers[projectScope] * 
                          (timelinePressure === 'rush' ? 1.2 : 1.0);

    // Calculate effective hourly rate
    const effectiveHourlyRate = finalPrice / estimatedHours;

    // Create pricing tiers
    const basicPrice = adjustedCost;
    const recommendedPrice = finalPrice;
    const premiumPrice = finalPrice * 1.3;

    // Payment schedule suggestion
    const upfrontPayment = finalPrice * 0.4;
    const milestonePayment = finalPrice * 0.4;
    const finalPayment = finalPrice * 0.2;

    // Risk assessment
    let riskWarning = "";
    if (riskLevel === 'high' || timelinePressure === 'rush') {
      riskWarning = "⚠️ High-risk project - consider additional scope protection";
    } else if (currentComplexity > baseProjectComplexity + 1) {
      riskWarning = "📈 Significant complexity increase - monitor scope carefully";
    } else {
      riskWarning = "✅ Manageable risk level with proper planning";
    }

    // Display results
    const resultBlock = document.getElementById("project-pricing-result");
    resultBlock.innerHTML = `
      <h3>💼 Project Pricing Analysis</h3>
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>💰 Cost-Based Price</h6>
          <div class="big-number">$${Math.round(basicPrice).toLocaleString()}</div>
          <p>Covers costs + risk buffer<br>
          No profit margin<br>
          Minimum viable price</p>
        </div>
        
        <div class="insight-card success">
          <h6>🎯 Recommended Price</h6>
          <div class="big-number">$${Math.round(recommendedPrice).toLocaleString()}</div>
          <p>Includes ${(profitMargin * 100)}% profit margin<br>
          $${Math.round(effectiveHourlyRate)} effective hourly<br>
          Sustainable pricing</p>
        </div>
        
        <div class="insight-card info">
          <h6>🚀 Premium Price</h6>
          <div class="big-number">$${Math.round(premiumPrice).toLocaleString()}</div>
          <p>High-value positioning<br>
          Expert-level pricing<br>
          Test market response</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📊 Project Analysis Breakdown</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>📈 Pricing Adjustments:</strong><br>
            Base project: $${baseProjectCost.toLocaleString()}<br>
            Complexity: ${(complexityMultiplier * 100).toFixed(0)}% (${currentComplexity} vs ${baseProjectComplexity})<br>
            Timeline: ${(timelineMultipliers[timelinePressure] * 100).toFixed(0)}% (${timelinePressure})<br>
            Client tier: ${(clientMultipliers[clientTier] * 100).toFixed(0)}% (${clientTier})<br>
            Scope: ${(scopeMultipliers[projectScope] * 100).toFixed(0)}% (${projectScope})<br>
            Risk buffer: ${(riskBuffers[riskLevel] * 100).toFixed(0)}% (${riskLevel} risk)
          </div>
          
          <div>
            <strong>⏱️ Time Estimation:</strong><br>
            Base project hours: ${baseProjectHours}<br>
            Estimated hours: ${Math.round(estimatedHours)}<br>
            Base hourly rate: $${Math.round(baseHourlyRate)}<br>
            Effective hourly: $${Math.round(effectiveHourlyRate)}<br>
            Revisions included: ${revisions} rounds<br>
            Revision cost: $${Math.round(revisionCost).toLocaleString()}
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px;">
          <strong>💳 Suggested Payment Schedule (${(profitMargin * 100)}% margin):</strong><br>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 0.5rem; text-align: center;">
            <div style="padding: 0.5rem; background: #e8f5e8; border-radius: 6px;">
              <strong>40% Upfront</strong><br>
              $${Math.round(upfrontPayment).toLocaleString()}
            </div>
            <div style="padding: 0.5rem; background: #e3f2fd; border-radius: 6px;">
              <strong>40% Milestone</strong><br>
              $${Math.round(milestonePayment).toLocaleString()}
            </div>
            <div style="padding: 0.5rem; background: #fff3cd; border-radius: 6px;">
              <strong>20% Completion</strong><br>
              $${Math.round(finalPayment).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${riskLevel === 'high' ? '#f8d7da' : riskLevel === 'medium' ? '#fff3cd' : '#d4edda'}; border-radius: 8px; border-left: 4px solid ${riskLevel === 'high' ? '#dc3545' : riskLevel === 'medium' ? '#ffc107' : '#28a745'};">
          <strong>🎯 Pricing Strategy:</strong><br>
          ${riskWarning}<br><br>
          
          <strong>💡 Negotiation Tips:</strong><br>
          • Start with recommended price ($${Math.round(recommendedPrice).toLocaleString()}) for value-focused clients<br>
          • Minimum acceptable: $${Math.round(basicPrice).toLocaleString()}} (covers costs but no profit)<br>
          • Premium positioning: $${Math.round(premiumPrice).toLocaleString()}} for enterprise clients<br>
          • Include scope change process and hourly rate for additional work<br>
          • Consider offering package options at different service levels
        </div>
      </div>
    `;
  });
});