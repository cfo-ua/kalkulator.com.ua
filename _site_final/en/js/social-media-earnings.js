document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("social-media-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tiktokFollowers = parseFloat(document.getElementById("tiktokFollowers").value) || 0;
    const tiktokEngagement = parseFloat(document.getElementById("tiktokEngagement").value) / 100 || 0;
    const instagramFollowers = parseFloat(document.getElementById("instagramFollowers").value) || 0;
    const instagramEngagement = parseFloat(document.getElementById("instagramEngagement").value) / 100 || 0;
    const youtubeSubscribers = parseFloat(document.getElementById("youtubeSubscribers").value) || 0;
    const youtubeEngagement = parseFloat(document.getElementById("youtubeEngagement").value) / 100 || 0;
    const twitterFollowers = parseFloat(document.getElementById("twitterFollowers").value) || 0;
    const contentNiche = document.getElementById("contentNiche").value;
    const audienceAge = document.getElementById("audienceAge").value;
    const audienceLocation = document.getElementById("audienceLocation").value;
    const monthlySponsored = parseInt(document.getElementById("monthlySponsored").value) || 0;
    const avgSponsoredRate = parseFloat(document.getElementById("avgSponsoredRate").value) || 0;
    const affiliateEnabled = document.getElementById("affiliateEnabled").value === 'true';
    const productsEnabled = document.getElementById("productsEnabled").value === 'true';
    const postsPerWeek = parseInt(document.getElementById("postsPerWeek").value);
    const growthRate = parseFloat(document.getElementById("growthRate").value) / 100;

    // Niche multipliers for brand appeal
    const nicheMultipliers = {
      'lifestyle': 1.0,
      'fashion': 1.4,
      'fitness': 1.2,
      'tech': 1.3,
      'business': 1.5,
      'food': 1.1,
      'travel': 1.2,
      'education': 0.8,
      'comedy': 0.9
    };

    // Audience demographic multipliers
    const ageMultipliers = {
      'genz': 0.8,
      'millennial': 1.2,
      'genx': 1.4,
      'boomer': 1.1
    };

    const locationMultipliers = {
      'us': 1.5,
      'western': 1.2,
      'global': 1.0,
      'developing': 0.6
    };

    const nicheMultiplier = nicheMultipliers[contentNiche];
    const ageMultiplier = ageMultipliers[audienceAge];
    const locationMultiplier = locationMultipliers[audienceLocation];

    // Calculate platform-specific earnings

    // TikTok earnings
    let tiktokEarnings = 0;
    if (tiktokFollowers > 0) {
      // Creator Fund (very low rates)
      const creatorFundEarnings = tiktokFollowers > 100000 ? tiktokFollowers * 0.002 : 0;
      
      // Brand partnerships (main income source)
      const tiktokCPM = (tiktokFollowers / 1000) * 15 * nicheMultiplier * ageMultiplier * locationMultiplier;
      const tiktokBrandEarnings = Math.min(tiktokCPM, tiktokFollowers * 0.08); // Cap per follower
      
      // Live gifts
      const liveGifts = tiktokFollowers > 1000 ? tiktokFollowers * 0.001 : 0;
      
      tiktokEarnings = creatorFundEarnings + tiktokBrandEarnings + liveGifts;
    }

    // Instagram earnings
    let instagramEarnings = 0;
    if (instagramFollowers > 0) {
      // Sponsored posts (main income)
      const instagramCPM = (instagramFollowers / 1000) * 25 * nicheMultiplier * ageMultiplier * locationMultiplier;
      const instagramBrandEarnings = Math.min(instagramCPM, instagramFollowers * 0.12);
      
      // Instagram Reels Play Bonus (if available)
      const reelsBonus = instagramFollowers > 50000 ? instagramFollowers * 0.003 : 0;
      
      // Story monetization
      const storyEarnings = instagramFollowers * 0.005;
      
      instagramEarnings = instagramBrandEarnings + reelsBonus + storyEarnings;
    }

    // YouTube earnings (mainly from brand partnerships, not ad revenue)
    let youtubeEarnings = 0;
    if (youtubeSubscribers > 0) {
      const youtubeCPM = (youtubeSubscribers / 1000) * 35 * nicheMultiplier * ageMultiplier * locationMultiplier;
      const youtubeBrandEarnings = Math.min(youtubeCPM, youtubeSubscribers * 0.15);
      
      // Channel memberships
      const memberships = youtubeSubscribers > 1000 ? youtubeSubscribers * 0.005 * 4.99 : 0;
      
      youtubeEarnings = youtubeBrandEarnings + memberships;
    }

    // Twitter/X earnings
    let twitterEarnings = 0;
    if (twitterFollowers > 0) {
      const twitterCPM = (twitterFollowers / 1000) * 8 * nicheMultiplier * ageMultiplier * locationMultiplier;
      twitterEarnings = Math.min(twitterCPM, twitterFollowers * 0.04);
    }

    // Current sponsored content earnings
    const currentSponsoredEarnings = monthlySponsored * avgSponsoredRate;

    // Affiliate marketing earnings
    let affiliateEarnings = 0;
    if (affiliateEnabled) {
      const totalFollowers = tiktokFollowers + instagramFollowers + youtubeSubscribers + twitterFollowers;
      affiliateEarnings = totalFollowers * 0.008 * nicheMultiplier; // Rough estimate
    }

    // Product sales earnings
    let productEarnings = 0;
    if (productsEnabled) {
      const totalFollowers = tiktokFollowers + instagramFollowers + youtubeSubscribers + twitterFollowers;
      const conversionRate = 0.001; // 0.1% conversion rate
      const avgOrderValue = contentNiche === 'fashion' ? 80 : contentNiche === 'tech' ? 150 : 50;
      productEarnings = totalFollowers * conversionRate * avgOrderValue;
    }

    // Total monthly earnings
    const platformEarnings = tiktokEarnings + instagramEarnings + youtubeEarnings + twitterEarnings;
    const totalMonthlyEarnings = platformEarnings + currentSponsoredEarnings + affiliateEarnings + productEarnings;

    // Calculate 12-month projections with growth
    const totalFollowersNow = tiktokFollowers + instagramFollowers + youtubeSubscribers + twitterFollowers;
    const totalFollowersFuture = totalFollowersNow * Math.pow(1 + growthRate, 12);
    const futureEarningsMultiplier = totalFollowersFuture / totalFollowersNow;
    const futureMonthlyEarnings = totalMonthlyEarnings * futureEarningsMultiplier;

    // Calculate earnings per follower
    const earningsPerFollower = totalFollowersNow > 0 ? totalMonthlyEarnings / totalFollowersNow : 0;

    // Determine creator tier
    let creatorTier = "";
    let tierClass = "";
    if (totalFollowersNow < 10000) {
      creatorTier = "🌱 Micro Creator";
      tierClass = "warning";
    } else if (totalFollowersNow < 100000) {
      creatorTier = "📈 Rising Creator";
      tierClass = "info";
    } else if (totalFollowersNow < 1000000) {
      creatorTier = "🚀 Macro Influencer";
      tierClass = "success";
    } else {
      creatorTier = "⭐ Mega Influencer";
      tierClass = "success";
    }

    // Calculate optimal posting strategy
    const totalEngagement = (tiktokEngagement + instagramEngagement + youtubeEngagement) / 3;
    const engagementQuality = totalEngagement > 0.05 ? "High" : totalEngagement > 0.03 ? "Good" : "Needs Work";

    // Display results
    const resultBlock = document.getElementById("social-media-result");
    resultBlock.innerHTML = `
      <h3>📱 Social Media Earnings Analysis</h3>
      
      <div class="insight-cards">
        <div class="insight-card ${tierClass}">
          <h6>💰 Monthly Earnings</h6>
          <div class="big-number">$${Math.round(totalMonthlyEarnings).toLocaleString()}</div>
          <p>${creatorTier}<br>
          Annual: $${Math.round(totalMonthlyEarnings * 12).toLocaleString()}<br>
          $${earningsPerFollower.toFixed(3)} per follower</p>
        </div>
        
        <div class="insight-card info">
          <h6>👥 Total Reach</h6>
          <div class="big-number">${Math.round(totalFollowersNow / 1000)}K</div>
          <p>Combined followers<br>
          ${engagementQuality} engagement<br>
          ${contentNiche} niche</p>
        </div>
        
        <div class="insight-card success">
          <h6>📈 12-Month Projection</h6>
          <div class="big-number">$${Math.round(futureMonthlyEarnings).toLocaleString()}</div>
          <p>With ${(growthRate * 100).toFixed(1)}% monthly growth<br>
          Followers: ${Math.round(totalFollowersFuture / 1000)}K<br>
          ${Math.round(((futureMonthlyEarnings - totalMonthlyEarnings) / Math.max(totalMonthlyEarnings, 1)) * 100)}% earnings increase</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📊 Platform Breakdown & Strategy</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${tiktokFollowers > 0 ? `
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #FF0050;">
            <strong>📱 TikTok</strong><br>
            ${(tiktokFollowers / 1000).toFixed(0)}K followers<br>
            ${(tiktokEngagement * 100).toFixed(1)}% engagement<br>
            <strong>$${Math.round(tiktokEarnings).toLocaleString()}/month</strong>
          </div>
          ` : ''}
          
          ${instagramFollowers > 0 ? `
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #E4405F;">
            <strong>📷 Instagram</strong><br>
            ${(instagramFollowers / 1000).toFixed(0)}K followers<br>
            ${(instagramEngagement * 100).toFixed(1)}% engagement<br>
            <strong>$${Math.round(instagramEarnings).toLocaleString()}/month</strong>
          </div>
          ` : ''}
          
          ${youtubeSubscribers > 0 ? `
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #FF0000;">
            <strong>📺 YouTube</strong><br>
            ${(youtubeSubscribers / 1000).toFixed(0)}K subscribers<br>
            ${(youtubeEngagement * 100).toFixed(1)}% engagement<br>
            <strong>$${Math.round(youtubeEarnings).toLocaleString()}/month</strong>
          </div>
          ` : ''}
          
          ${twitterFollowers > 0 ? `
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #1DA1F2;">
            <strong>🐦 Twitter/X</strong><br>
            ${(twitterFollowers / 1000).toFixed(0)}K followers<br>
            <strong>$${Math.round(twitterEarnings).toLocaleString()}/month</strong>
          </div>
          ` : ''}
        </div>
        
        <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <strong>💸 Revenue Sources:</strong><br>
            Platform earnings: $${Math.round(platformEarnings).toLocaleString()} (${((platformEarnings / Math.max(totalMonthlyEarnings, 1)) * 100).toFixed(1)}%)<br>
            Sponsored content: $${Math.round(currentSponsoredEarnings).toLocaleString()} (${((currentSponsoredEarnings / Math.max(totalMonthlyEarnings, 1)) * 100).toFixed(1)}%)<br>
            Affiliate marketing: $${Math.round(affiliateEarnings).toLocaleString()} (${((affiliateEarnings / Math.max(totalMonthlyEarnings, 1)) * 100).toFixed(1)}%)<br>
            Product sales: $${Math.round(productEarnings).toLocaleString()} (${((productEarnings / Math.max(totalMonthlyEarnings, 1)) * 100).toFixed(1)}%)
          </div>
          
          <div>
            <strong>🎯 Audience Insights:</strong><br>
            Primary age: ${audienceAge.replace('gen', 'Gen ').replace('millennial', 'Millennial')}<br>
            Location: ${audienceLocation.toUpperCase()}<br>
            Content niche: ${contentNiche}<br>
            Posts/week: ${postsPerWeek}<br>
            Avg engagement: ${(totalEngagement * 100).toFixed(1)}%<br>
            Growth rate: ${(growthRate * 100).toFixed(1)}%/month
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${totalMonthlyEarnings >= 5000 ? '#d4edda' : totalMonthlyEarnings >= 1000 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${totalMonthlyEarnings >= 5000 ? '#28a745' : totalMonthlyEarnings >= 1000 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Monetization Strategy:</strong><br>
          ${totalMonthlyEarnings >= 5000 ?
            '🎉 Excellent earning potential! Focus on premium brand partnerships, consider launching courses or coaching, and explore exclusive content offerings.' :
            totalMonthlyEarnings >= 1000 ?
            '✅ Strong foundation! Diversify income streams, improve engagement rates, and start building email list for direct marketing.' :
            '📈 Growing foundation. Focus on consistent content creation, engagement building, and platform optimization before heavy monetization focus.'
          }<br><br>
          
          <strong>🚀 Optimization Tips:</strong><br>
          • ${totalEngagement < 0.03 ? 'Boost engagement with more interactive content, stories, and community building' : 'Leverage high engagement for brand partnership negotiations'}<br>
          • ${monthlySponsored < 2 ? 'Increase outreach to brands or join influencer marketing platforms' : 'Maintain authentic sponsored content balance'}<br>
          • ${!affiliateEnabled ? 'Start affiliate marketing with products you genuinely use and recommend' : 'Optimize affiliate strategy with better product selection'}<br>
          • ${postsPerWeek < 7 ? 'Consider increasing posting frequency for algorithm favor' : 'Maintain consistent posting schedule'}
        </div>
      </div>
    `;
  });
});