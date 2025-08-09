document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("podcast-growth-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentListeners = parseFloat(document.getElementById("currentListeners").value);
    const monthsActive = parseInt(document.getElementById("monthsActive").value);
    const episodesPublished = parseInt(document.getElementById("episodesPublished").value);
    const publishingFrequency = document.getElementById("publishingFrequency").value;
    const contentQuality = document.getElementById("contentQuality").value;
    const episodeLength = document.getElementById("episodeLength").value;
    const marketingBudget = parseFloat(document.getElementById("marketingBudget").value) || 0;
    const socialMediaEffort = document.getElementById("socialMediaEffort").value;
    const hostExperience = document.getElementById("hostExperience").value;
    const nicheCompetition = document.getElementById("nicheCompetition").value;
    const projectionMonths = parseInt(document.getElementById("projectionMonths").value);

    // Base growth rate calculation (monthly multiplier)
    let baseGrowthRate = 1.15; // 15% monthly growth baseline

    // Publishing frequency multiplier
    const frequencyMultipliers = {
      'daily': 1.4,
      'frequent': 1.25,
      'weekly': 1.0,
      'biweekly': 0.85,
      'monthly': 0.6
    };

    // Content quality multiplier
    const qualityMultipliers = {
      'basic': 0.8,
      'good': 1.0,
      'professional': 1.3,
      'exceptional': 1.6
    };

    // Episode length impact (sweet spot is medium)
    const lengthMultipliers = {
      'short': 0.9,
      'medium': 1.0,
      'long': 1.1,
      'extended': 0.95
    };

    // Marketing budget impact (diminishing returns)
    let marketingMultiplier = 1.0;
    if (marketingBudget > 0) {
      marketingMultiplier = 1 + Math.min(marketingBudget / 500 * 0.3, 0.5); // Max 50% boost
    }

    // Social media effort multiplier
    const socialMultipliers = {
      'minimal': 0.9,
      'moderate': 1.0,
      'active': 1.2,
      'intensive': 1.4
    };

    // Host experience multiplier
    const experienceMultipliers = {
      'new': 0.8,
      'some': 1.0,
      'experienced': 1.3,
      'influencer': 1.8
    };

    // Niche competition impact
    const competitionMultipliers = {
      'low': 1.3,
      'medium': 1.0,
      'high': 0.75,
      'extreme': 0.6
    };

    // Calculate compound growth rate
    const totalMultiplier = frequencyMultipliers[publishingFrequency] *
                           qualityMultipliers[contentQuality] *
                           lengthMultipliers[episodeLength] *
                           marketingMultiplier *
                           socialMultipliers[socialMediaEffort] *
                           experienceMultipliers[hostExperience] *
                           competitionMultipliers[nicheCompetition];

    const adjustedGrowthRate = Math.min(baseGrowthRate * totalMultiplier, 1.5); // Cap at 50% monthly growth

    // Apply decay factor for mature podcasts (growth slows over time)
    const maturityFactor = Math.max(0.7, 1 - (monthsActive / 100));
    const finalGrowthRate = adjustedGrowthRate * maturityFactor;

    // Project growth
    let projectedListeners = currentListeners;
    const growthData = [];
    
    for (let month = 1; month <= projectionMonths; month++) {
      projectedListeners *= finalGrowthRate;
      growthData.push({
        month: month,
        listeners: Math.round(projectedListeners)
      });
    }

    const finalListeners = projectedListeners;
    const totalGrowth = ((finalListeners - currentListeners) / currentListeners) * 100;

    // Calculate monetization potential
    const currentDownloads = currentListeners * (episodesPublished / Math.max(monthsActive, 1)) * 1.3; // Downloads per episode
    const projectedDownloads = finalListeners * 1.3;

    // Revenue projections (very rough estimates)
    const sponsorRevenue = finalListeners > 1000 ? (finalListeners / 1000) * 25 : 0; // $25 CPM estimate
    const affiliateRevenue = finalListeners * 0.02; // $0.02 per listener estimate
    const productRevenue = finalListeners > 500 ? finalListeners * 0.05 : 0; // Product sales estimate

    const totalMonthlyRevenue = sponsorRevenue + affiliateRevenue + productRevenue;

    // Growth phase assessment
    let growthPhase = "";
    let phaseClass = "";
    if (finalListeners < 1000) {
      growthPhase = "🌱 Foundation Building Phase";
      phaseClass = "warning";
    } else if (finalListeners < 5000) {
      growthPhase = "📈 Growth Phase";
      phaseClass = "info";
    } else if (finalListeners < 25000) {
      growthPhase = "🚀 Scaling Phase";
      phaseClass = "success";
    } else {
      growthPhase = "⭐ Established Show";
      phaseClass = "success";
    }

    // Display results
    const resultBlock = document.getElementById("podcast-growth-result");
    resultBlock.innerHTML = `
      <h3>🎙️ Your Podcast Growth Projection</h3>
      
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>👥 Current Status</h6>
          <div class="big-number">${currentListeners.toLocaleString()}</div>
          <p>Monthly listeners<br>
          ${episodesPublished} episodes published<br>
          Active for ${monthsActive} months</p>
        </div>
        
        <div class="insight-card ${phaseClass}">
          <h6>📊 Projected Growth (${projectionMonths}M)</h6>
          <div class="big-number">${Math.round(finalListeners).toLocaleString()}</div>
          <p>Monthly listeners<br>
          ${totalGrowth > 0 ? '+' : ''}${Math.round(totalGrowth)}% total growth<br>
          ${growthPhase}</p>
        </div>
        
        <div class="insight-card success">
          <h6>💰 Revenue Potential</h6>
          <div class="big-number">$${Math.round(totalMonthlyRevenue).toLocaleString()}</div>
          <p>Monthly revenue estimate<br>
          Sponsors: $${Math.round(sponsorRevenue).toLocaleString()}<br>
          Products/Affiliate: $${Math.round(affiliateRevenue + productRevenue).toLocaleString()}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📈 Growth Strategy Analysis</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>🎯 Strategy Factors:</strong><br>
            Publishing: ${publishingFrequency} (${(frequencyMultipliers[publishingFrequency] * 100).toFixed(0)}%)<br>
            Content quality: ${contentQuality} (${(qualityMultipliers[contentQuality] * 100).toFixed(0)}%)<br>
            Marketing budget: $${marketingBudget}/month (${(marketingMultiplier * 100).toFixed(0)}%)<br>
            Social media: ${socialMediaEffort} (${(socialMultipliers[socialMediaEffort] * 100).toFixed(0)}%)<br>
            Host experience: ${hostExperience} (${(experienceMultipliers[hostExperience] * 100).toFixed(0)}%)<br>
            Competition: ${nicheCompetition} (${(competitionMultipliers[nicheCompetition] * 100).toFixed(0)}%)
          </div>
          
          <div>
            <strong>📊 Growth Metrics:</strong><br>
            Base growth rate: ${((baseGrowthRate - 1) * 100).toFixed(1)}%/month<br>
            Strategy multiplier: ${totalMultiplier.toFixed(2)}x<br>
            Adjusted growth: ${((finalGrowthRate - 1) * 100).toFixed(1)}%/month<br>
            Downloads/episode: ${Math.round(projectedDownloads).toLocaleString()}<br>
            Monetization ready: ${finalListeners >= 1000 ? 'Yes' : 'In ' + Math.ceil((1000 - finalListeners) / (finalListeners - currentListeners) * projectionMonths) + ' months'}
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px;">
          <strong>📅 Monthly Growth Timeline:</strong><br>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; margin-top: 0.5rem; font-size: 0.9em;">
            ${growthData.slice(0, 12).map((data, index) => `
              <div style="text-align: center; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                M${data.month}<br>
                <strong>${data.listeners.toLocaleString()}</strong>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${finalListeners >= 5000 ? '#d4edda' : finalListeners >= 1000 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${finalListeners >= 5000 ? '#28a745' : finalListeners >= 1000 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Growth Recommendations:</strong><br>
          ${finalListeners >= 5000 ?
            '🎉 Excellent growth trajectory! Focus on monetization, premium content, and community building. Consider expanding to multiple shows or formats.' :
            finalListeners >= 1000 ?
            '✅ Good growth potential! Continue consistency, improve content quality, and start exploring sponsorship opportunities. Build email list and social following.' :
            '📈 Building foundation. Focus on consistency, audience engagement, and content quality. Increase marketing efforts and consider collaboration opportunities.'
          }<br><br>
          
          <strong>🚀 Next Steps:</strong> ${
            adjustedGrowthRate < 1.1 ?
            'Increase publishing frequency, improve content quality, or boost marketing efforts to accelerate growth.' :
            'Maintain current strategy while focusing on audience retention and engagement quality.'
          }
        </div>
      </div>
    `;
  });
});