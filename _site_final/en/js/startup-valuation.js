document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('startup-valuation-form');
  const result = document.getElementById('valuation-result');

  function formatCurrency(value) {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    } else {
      return value.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      });
    }
  }

  function getIndustryMultiple(industry, businessModel, growthRate) {
    const baseMultiples = {
      'saas': { min: 6, max: 15 },
      'ecommerce': { min: 2, max: 5 },
      'marketplace': { min: 8, max: 20 },
      'fintech': { min: 5, max: 12 },
      'healthtech': { min: 4, max: 10 },
      'edtech': { min: 3, max: 8 },
      'hardware': { min: 1, max: 3 },
      'biotech': { min: 3, max: 8 },
      'consumer': { min: 2, max: 6 },
      'b2b': { min: 3, max: 7 },
      'other': { min: 2, max: 6 }
    };

    const base = baseMultiples[industry] || baseMultiples['other'];
    
    // Adjust for growth rate
    let multiple = base.min + (base.max - base.min) * Math.min(growthRate / 100, 1);
    
    // Business model adjustments
    if (businessModel === 'subscription') multiple *= 1.2;
    if (businessModel === 'transaction') multiple *= 0.9;
    if (businessModel === 'marketplace') multiple *= 1.3;
    
    return Math.max(multiple, 1);
  }

  function getStageMultiplier(stage) {
    const multipliers = {
      'idea': 0.3,
      'prototype': 0.5,
      'early': 0.7,
      'growth': 1.0,
      'scaling': 1.2,
      'mature': 1.1
    };
    return multipliers[stage] || 0.7;
  }

  function getRiskMultiplier(marketSize, competitivePosition, ipStrength, teamExperience) {
    let multiplier = 1.0;
    
    // Market size impact
    const marketMultipliers = { 'large': 1.2, 'medium': 1.0, 'small': 0.8, 'niche': 0.6 };
    multiplier *= marketMultipliers[marketSize] || 1.0;
    
    // Competitive position impact
    const competitiveMultipliers = { 'leader': 1.3, 'strong': 1.1, 'emerging': 1.0, 'follower': 0.8, 'new': 0.7 };
    multiplier *= competitiveMultipliers[competitivePosition] || 1.0;
    
    // IP strength impact
    const ipMultipliers = { 'strong': 1.2, 'moderate': 1.0, 'limited': 0.9, 'none': 0.8 };
    multiplier *= ipMultipliers[ipStrength] || 1.0;
    
    // Team experience impact
    const teamMultipliers = { 'experienced': 1.2, 'mixed': 1.0, 'emerging': 0.9, 'first-time': 0.8 };
    multiplier *= teamMultipliers[teamExperience] || 1.0;
    
    return multiplier;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form values
      const annualRevenue = parseFloat(document.getElementById('annual-revenue').value) || 0;
      const growthRate = parseFloat(document.getElementById('growth-rate').value) || 0;
      const mrr = parseFloat(document.getElementById('mrr').value) || 0;
      const profitMargin = parseFloat(document.getElementById('profit-margin').value) || 0;
      const totalInvestment = parseFloat(document.getElementById('total-investment').value) || 0;
      const developmentCosts = parseFloat(document.getElementById('development-costs').value) || 0;
      const customers = parseInt(document.getElementById('customers').value) || 0;
      const teamSize = parseInt(document.getElementById('team-size').value) || 1;
      
      const industry = document.getElementById('industry').value;
      const businessModel = document.getElementById('business-model').value;
      const stage = document.getElementById('stage').value;
      const marketSize = document.getElementById('market-size').value;
      const competitivePosition = document.getElementById('competitive-position').value;
      const ipStrength = document.getElementById('ip-strength').value;
      const teamExperience = document.getElementById('team-experience').value;

      // Validation
      if (!industry || !businessModel || !stage || !marketSize || !competitivePosition || !ipStrength || !teamExperience) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Missing Information</h6>
            <p>Please fill in all required fields to calculate valuation.</p>
          </div>
        `;
        return;
      }

      // Calculate different valuation methods
      const calculations = {};
      
      // Revenue Multiple Method
      if (annualRevenue > 0) {
        const revenueToUse = mrr > 0 ? mrr * 12 : annualRevenue;
        const industryMultiple = getIndustryMultiple(industry, businessModel, growthRate);
        const stageMultiplier = getStageMultiplier(stage);
        const riskMultiplier = getRiskMultiplier(marketSize, competitivePosition, ipStrength, teamExperience);
        
        calculations.revenueMultiple = revenueToUse * industryMultiple * stageMultiplier * riskMultiplier;
      }
      
      // Cost Approach
      if (totalInvestment > 0 || developmentCosts > 0) {
        const totalCosts = totalInvestment + developmentCosts;
        const riskPremium = stage === 'idea' ? 0.5 : stage === 'prototype' ? 0.8 : 1.2;
        calculations.costApproach = totalCosts * riskPremium;
      }
      
      // DCF Simplified (3-year projection)
      if (annualRevenue > 0 && profitMargin > 0) {
        const projectedRevenue1 = annualRevenue * (1 + growthRate / 100);
        const projectedRevenue2 = projectedRevenue1 * (1 + Math.max(growthRate - 10, 10) / 100);
        const projectedRevenue3 = projectedRevenue2 * (1 + Math.max(growthRate - 20, 5) / 100);
        
        const cashFlow1 = projectedRevenue1 * (profitMargin / 100);
        const cashFlow2 = projectedRevenue2 * (profitMargin / 100);
        const cashFlow3 = projectedRevenue3 * (profitMargin / 100);
        
        const discountRate = 0.25; // 25% for startup risk
        const npv = cashFlow1 / (1 + discountRate) + 
                   cashFlow2 / Math.pow(1 + discountRate, 2) + 
                   cashFlow3 / Math.pow(1 + discountRate, 3);
        
        calculations.dcf = npv;
      }
      
      // Market Comparable (simplified)
      if (customers > 0) {
        const customerValues = {
          'saas': 5000,
          'ecommerce': 200,
          'marketplace': 1000,
          'fintech': 3000,
          'healthtech': 2000,
          'edtech': 1500,
          'hardware': 500,
          'biotech': 10000,
          'consumer': 300,
          'b2b': 2000,
          'other': 1000
        };
        
        const customerValue = customerValues[industry] || 1000;
        calculations.marketComparable = customers * customerValue;
      }

      // Calculate weighted average
      const validCalculations = Object.values(calculations).filter(val => val > 0);
      const averageValuation = validCalculations.length > 0 
        ? validCalculations.reduce((sum, val) => sum + val, 0) / validCalculations.length 
        : 0;

      // Generate results
      if (averageValuation === 0) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Insufficient Data</h6>
            <p>Please provide more financial information to calculate valuation.</p>
          </div>
        `;
        return;
      }

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🎯 Estimated Valuation Range</h6>
            <div class="big-number">${formatCurrency(averageValuation * 0.7)} - ${formatCurrency(averageValuation * 1.3)}</div>
            <p><strong>Average: ${formatCurrency(averageValuation)}</strong></p>
          </div>
        </div>

        <div class="insight-cards">
          ${calculations.revenueMultiple ? `
          <div class="insight-card">
            <h6>📈 Revenue Multiple</h6>
            <div class="big-number">${formatCurrency(calculations.revenueMultiple)}</div>
            <p>Based on ${(calculations.revenueMultiple / (mrr > 0 ? mrr * 12 : annualRevenue)).toFixed(1)}x revenue</p>
          </div>
          ` : ''}
          
          ${calculations.costApproach ? `
          <div class="insight-card">
            <h6>💰 Cost Approach</h6>
            <div class="big-number">${formatCurrency(calculations.costApproach)}</div>
            <p>Investment + risk premium</p>
          </div>
          ` : ''}
          
          ${calculations.dcf ? `
          <div class="insight-card">
            <h6>📊 DCF Method</h6>
            <div class="big-number">${formatCurrency(calculations.dcf)}</div>
            <p>3-year cash flow projection</p>
          </div>
          ` : ''}
          
          ${calculations.marketComparable ? `
          <div class="insight-card">
            <h6>🏢 Market Comparable</h6>
            <div class="big-number">${formatCurrency(calculations.marketComparable)}</div>
            <p>Based on customer value</p>
          </div>
          ` : ''}
        </div>

        <div class="insight-card info">
          <h6>📋 Valuation Factors</h6>
          <div style="text-align: left;">
            <p><strong>Industry:</strong> ${industry.toUpperCase()} (${getIndustryMultiple(industry, businessModel, growthRate).toFixed(1)}x multiple)</p>
            <p><strong>Stage:</strong> ${stage.charAt(0).toUpperCase() + stage.slice(1)} (${(getStageMultiplier(stage) * 100).toFixed(0)}% of mature value)</p>
            <p><strong>Risk Adjustment:</strong> ${(getRiskMultiplier(marketSize, competitivePosition, ipStrength, teamExperience) * 100).toFixed(0)}% based on market, team & IP</p>
            ${growthRate > 0 ? `<p><strong>Growth Rate:</strong> ${growthRate}% annual revenue growth</p>` : ''}
          </div>
        </div>

        <div class="insight-card warning">
          <h6>⚠️ Important Disclaimers</h6>
          <div style="text-align: left; font-size: 0.9rem;">
            <p><strong>• Not Investment Advice:</strong> This calculator provides estimates only. Actual valuations vary significantly based on market conditions, due diligence, and investor perspectives.</p>
            <p><strong>• Professional Guidance:</strong> Consult qualified financial advisors and valuation experts for fundraising and major financial decisions.</p>
            <p><strong>• Market Dependent:</strong> Valuations fluctuate with market conditions, investor sentiment, and economic factors.</p>
            <p><strong>• Company Specific:</strong> Unique factors like technology, team, partnerships, and competitive moats significantly impact value.</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>📈 Increasing Valuation</h6>
          <div style="text-align: left;">
            <p><strong>• Revenue Growth:</strong> Demonstrate consistent, sustainable revenue increases</p>
            <p><strong>• Market Traction:</strong> Prove product-market fit with growing customer base</p>
            <p><strong>• Operational Excellence:</strong> Improve unit economics and profit margins</p>
            <p><strong>• Competitive Moats:</strong> Build defensible advantages through IP, network effects, or scale</p>
            <p><strong>• Strong Team:</strong> Attract experienced talent and proven leadership</p>
          </div>
        </div>
      `;
    });
  }
});