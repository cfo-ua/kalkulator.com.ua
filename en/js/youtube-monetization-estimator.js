document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("youtube-monetization-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const subscribers = parseFloat(document.getElementById("subscribers").value);
    const monthlyViews = parseFloat(document.getElementById("monthlyViews").value);
    const avgViewDuration = parseFloat(document.getElementById("avgViewDuration").value) / 100;
    const videosPerMonth = parseInt(document.getElementById("videosPerMonth").value);
    const contentCategory = document.getElementById("contentCategory").value;
    const audienceLocation = document.getElementById("audienceLocation").value;
    const engagementRate = parseFloat(document.getElementById("engagementRate").value) / 100;
    const monetizationEnabled = document.getElementById("monetizationEnabled").value === 'true';
    const membershipsEnabled = document.getElementById("membershipsEnabled").value === 'true';
    const sponsorshipRate = parseInt(document.getElementById("sponsorshipRate").value) || 0;
    const merchandiseEnabled = document.getElementById("merchandiseEnabled").value === 'true';
    const monthlyGrowthRate = parseFloat(document.getElementById("monthlyGrowthRate").value) / 100;
    const projectionMonths = parseInt(document.getElementById("projectionMonths").value);

    // CPM rates by category and location
    const cpmRates = {
      'gaming': { tier1: 2.5, tier2: 1.8, tier3: 1.2, tier4: 0.8 },
      'tech': { tier1: 4.0, tier2: 2.8, tier3: 1.8, tier4: 1.2 },
      'lifestyle': { tier1: 2.0, tier2: 1.4, tier3: 0.9, tier4: 0.6 },
      'entertainment': { tier1: 1.8, tier2: 1.3, tier3: 0.8, tier4: 0.5 },
      'business': { tier1: 5.0, tier2: 3.5, tier3: 2.2, tier4: 1.5 },
      'health': { tier1: 3.2, tier2: 2.2, tier3: 1.4, tier4: 0.9 },
      'music': { tier1: 1.5, tier2: 1.1, tier3: 0.7, tier4: 0.4 },
      'comedy': { tier1: 1.8, tier2: 1.3, tier3: 0.8, tier4: 0.5 }
    };

    const baseCPM = cpmRates[contentCategory][audienceLocation];

    // Calculate current monthly ad revenue
    let currentAdRevenue = 0;
    if (monetizationEnabled) {
      // RPM is typically 60-80% of CPM after YouTube's cut
      const rpm = baseCPM * 0.7;
      currentAdRevenue = (monthlyViews / 1000) * rpm;
    }

    // Channel membership revenue (if enabled)
    let membershipRevenue = 0;
    if (membershipsEnabled && subscribers >= 1000) {
      // Typical conversion rate: 0.1-1% of subscribers become members at $4.99/month average
      const membershipConversionRate = Math.min(engagementRate / 2, 0.01); // Cap at 1%
      const avgMembershipPrice = 4.99;
      membershipRevenue = subscribers * membershipConversionRate * avgMembershipPrice;
    }

    // Sponsorship revenue
    let sponsorshipRevenue = 0;
    if (sponsorshipRate > 0 && subscribers >= 10000) {
      // Sponsorship rates: $1-5 per 1000 views, varies by niche
      const sponsorshipMultiplier = {
        'gaming': 2,
        'tech': 4,
        'lifestyle': 2.5,
        'entertainment': 1.5,
        'business': 5,
        'health': 3,
        'music': 1.5,
        'comedy': 1.5
      };
      
      const avgSponsorshipRate = sponsorshipMultiplier[contentCategory];
      sponsorshipRevenue = sponsorshipRate * (monthlyViews / 1000) * avgSponsorshipRate;
    }

    // Super Chat/Thanks revenue (estimated)
    let superChatRevenue = 0;
    if (monetizationEnabled) {
      // Highly variable, estimate based on engagement
      superChatRevenue = subscribers * engagementRate * 0.02; // Very rough estimate
    }

    // Merchandise revenue (if enabled)
    let merchandiseRevenue = 0;
    if (merchandiseEnabled && subscribers >= 1000) {
      // Very rough estimate: 0.5-2% of subscribers buy something monthly
      const merchConversionRate = Math.min(engagementRate, 0.02);
      const avgOrderValue = 25;
      merchandiseRevenue = subscribers * merchConversionRate * avgOrderValue;
    }

    // Total current monthly revenue
    const totalCurrentRevenue = currentAdRevenue + membershipRevenue + sponsorshipRevenue + superChatRevenue + merchandiseRevenue;

    // Project growth over time
    let projectedSubscribers = subscribers;
    let projectedViews = monthlyViews;
    
    for (let month = 1; month <= projectionMonths; month++) {
      projectedSubscribers *= (1 + monthlyGrowthRate);
      projectedViews *= (1 + monthlyGrowthRate);
    }

    // Calculate future revenue with growth
    let futureAdRevenue = 0;
    if (monetizationEnabled || (projectedSubscribers >= 1000 && projectedViews >= 4000 * 12 / 12)) {
      const rpm = baseCPM * 0.7;
      futureAdRevenue = (projectedViews / 1000) * rpm;
    }

    let futureMembershipRevenue = 0;
    if (membershipsEnabled || projectedSubscribers >= 1000) {
      const membershipConversionRate = Math.min(engagementRate / 2, 0.01);
      futureMembershipRevenue = projectedSubscribers * membershipConversionRate * 4.99;
    }

    let futureSponsorshipRevenue = 0;
    if (projectedSubscribers >= 10000) {
      const sponsorshipMultiplier = {
        'gaming': 2, 'tech': 4, 'lifestyle': 2.5, 'entertainment': 1.5,
        'business': 5, 'health': 3, 'music': 1.5, 'comedy': 1.5
      };
      const avgSponsorshipRate = sponsorshipMultiplier[contentCategory];
      const futureOpportunities = Math.min(sponsorshipRate + Math.floor(projectedSubscribers / 50000), 8);
      futureSponsorshipRevenue = futureOpportunities * (projectedViews / 1000) * avgSponsorshipRate;
    }

    let futureSuperChatRevenue = projectedSubscribers * engagementRate * 0.02;
    
    let futureMerchandiseRevenue = 0;
    if (merchandiseEnabled || projectedSubscribers >= 5000) {
      const merchConversionRate = Math.min(engagementRate, 0.02);
      futureMerchandiseRevenue = projectedSubscribers * merchConversionRate * 25;
    }

    const totalFutureRevenue = futureAdRevenue + futureMembershipRevenue + futureSponsorshipRevenue + futureSuperChatRevenue + futureMerchandiseRevenue;

    // Annual projections
    const currentAnnualRevenue = totalCurrentRevenue * 12;
    const futureAnnualRevenue = totalFutureRevenue * 12;

    // Monetization status
    let monetizationStatus = "";
    let statusClass = "";
    if (!monetizationEnabled && (subscribers < 1000 || monthlyViews < 4000)) {
      monetizationStatus = "🔄 Building to Partner Program eligibility";
      statusClass = "warning";
    } else if (totalCurrentRevenue < 100) {
      monetizationStatus = "🌱 Early monetization stage";
      statusClass = "info";
    } else if (totalCurrentRevenue < 1000) {
      monetizationStatus = "📈 Growing revenue streams";
      statusClass = "info";
    } else {
      monetizationStatus = "💰 Strong monetization";
      statusClass = "success";
    }

    // Display results
    const resultBlock = document.getElementById("youtube-monetization-result");
    resultBlock.innerHTML = `
      <h3>📺 YouTube Monetization Analysis</h3>
      
      <div class="insight-cards">
        <div class="insight-card ${statusClass}">
          <h6>💰 Current Monthly Revenue</h6>
          <div class="big-number">$${Math.round(totalCurrentRevenue).toLocaleString()}</div>
          <p>${monetizationStatus}<br>
          Annual: $${Math.round(currentAnnualRevenue).toLocaleString()}<br>
          RPM: $${monetizationEnabled ? (currentAdRevenue / monthlyViews * 1000).toFixed(2) : '0.00'}</p>
        </div>
        
        <div class="insight-card success">
          <h6>🚀 Projected Revenue (${projectionMonths}M)</h6>
          <div class="big-number">$${Math.round(totalFutureRevenue).toLocaleString()}</div>
          <p>Monthly with ${(monthlyGrowthRate * 100).toFixed(1)}% growth<br>
          Annual: $${Math.round(futureAnnualRevenue).toLocaleString()}<br>
          ${Math.round(((totalFutureRevenue - totalCurrentRevenue) / Math.max(totalCurrentRevenue, 1)) * 100)}% increase</p>
        </div>
        
        <div class="insight-card info">
          <h6>👥 Channel Growth</h6>
          <div class="big-number">${Math.round(projectedSubscribers).toLocaleString()}</div>
          <p>Projected subscribers<br>
          Views: ${Math.round(projectedViews / 1000)}K/month<br>
          Growth: +${Math.round(((projectedSubscribers - subscribers) / subscribers) * 100)}%</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>💸 Revenue Breakdown Analysis</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>📊 Current Revenue Sources:</strong><br>
            Ad Revenue: $${Math.round(currentAdRevenue).toLocaleString()} (${((currentAdRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Sponsorships: $${Math.round(sponsorshipRevenue).toLocaleString()} (${((sponsorshipRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Memberships: $${Math.round(membershipRevenue).toLocaleString()} (${((membershipRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Merchandise: $${Math.round(merchandiseRevenue).toLocaleString()} (${((merchandiseRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Super Chat/Thanks: $${Math.round(superChatRevenue).toLocaleString()} (${((superChatRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)
          </div>
          
          <div>
            <strong>🎯 Channel Metrics:</strong><br>
            Subscribers: ${subscribers.toLocaleString()}<br>
            Monthly views: ${(monthlyViews / 1000).toFixed(0)}K<br>
            Avg view duration: ${(avgViewDuration * 100).toFixed(1)}%<br>
            Engagement rate: ${(engagementRate * 100).toFixed(1)}%<br>
            Content category: ${contentCategory}<br>
            Audience: ${audienceLocation.replace('tier', 'Tier ')} countries
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          ${!monetizationEnabled && subscribers < 1000 ? `
          <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; text-align: center;">
            <strong>🎯 Next Milestone</strong><br>
            ${1000 - subscribers} more subscribers<br>
            for Partner Program
          </div>
          ` : ''}
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; text-align: center;">
            <strong>💡 Optimization</strong><br>
            Focus on ${avgViewDuration < 0.4 ? 'watch time' : engagementRate < 0.03 ? 'engagement' : 'consistency'}
          </div>
          
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; text-align: center;">
            <strong>📈 Growth Rate</strong><br>
            ${(monthlyGrowthRate * 100).toFixed(1)}% monthly<br>
            ${((Math.pow(1 + monthlyGrowthRate, 12) - 1) * 100).toFixed(0)}% annually
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${totalFutureRevenue >= 1000 ? '#d4edda' : totalFutureRevenue >= 100 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${totalFutureRevenue >= 1000 ? '#28a745' : totalFutureRevenue >= 100 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Monetization Strategy:</strong><br>
          ${totalFutureRevenue >= 1000 ?
            '🎉 Excellent earning potential! Diversify income streams, consider premium content, and explore brand partnerships. Focus on audience retention and community building.' :
            totalFutureRevenue >= 100 ?
            '✅ Good foundation for growth! Optimize ad placement, improve engagement, and start building email list. Consider affiliate marketing and product creation.' :
            '📈 Focus on growth fundamentals: consistent uploads, SEO optimization, audience engagement, and content quality. Monetization will follow audience growth.'
          }<br><br>
          
          <strong>🚀 Revenue Optimization Tips:</strong><br>
          • ${avgViewDuration < 0.4 ? 'Improve video retention with better hooks and pacing' : 'Create longer videos (8+ min) for mid-roll ads'}<br>
          • ${engagementRate < 0.03 ? 'Boost engagement with CTAs and community posts' : 'Leverage high engagement for brand partnerships'}<br>
          • ${sponsorshipRevenue === 0 && subscribers >= 10000 ? 'Start reaching out to brands for sponsorship deals' : 'Continue building audience for sponsor appeal'}
        </div>
      </div>
    `;
  });
});