document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("streaming-revenue-form");
  const result = document.getElementById("streaming-revenue-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateStreamingRevenue();
  });

  function calculateStreamingRevenue() {
    // Get form values
    const platform = document.getElementById("platform").value;
    const followers = parseInt(document.getElementById("followers").value) || 0;
    const avgViewers = parseInt(document.getElementById("avg-viewers").value) || 0;
    const hoursPerStream = parseFloat(document.getElementById("hours-per-stream").value) || 0;
    const streamsPerWeek = parseInt(document.getElementById("streams-per-week").value) || 0;
    const subscribers = parseInt(document.getElementById("subscribers").value) || 0;
    const avgDonation = parseFloat(document.getElementById("avg-donation").value) || 0;
    const donationsPerStream = parseInt(document.getElementById("donations-per-stream").value) || 0;
    const sponsorshipMonthly = parseFloat(document.getElementById("sponsorship-monthly").value) || 0;
    const adRevenuePerHour = parseFloat(document.getElementById("ad-revenue-per-hour").value) || 0;

    if (!platform || followers < 0 || avgViewers < 0) {
      result.innerHTML = '<div class="error">Please fill in all required fields with valid values.</div>';
      return;
    }

    // Calculate various revenue streams
    const revenues = calculateRevenueStreams(
      platform, followers, avgViewers, hoursPerStream, streamsPerWeek,
      subscribers, avgDonation, donationsPerStream, sponsorshipMonthly, adRevenuePerHour
    );

    // Get streamer tier and recommendations
    const streamerTier = getStreamerTier(followers, avgViewers);
    const recommendations = getRecommendations(streamerTier, platform);

    displayResults(revenues, streamerTier, recommendations, platform);
  }

  function calculateRevenueStreams(platform, followers, avgViewers, hoursPerStream, streamsPerWeek, 
                                   subscribers, avgDonation, donationsPerStream, sponsorshipMonthly, adRevenuePerHour) {
    
    // Platform commission rates
    const commissionRates = {
      twitch: { subs: 0.5, donations: 0.05 },
      youtube: { subs: 0.3, donations: 0.05 },
      tiktok: { subs: 0.3, donations: 0.05 },
      facebook: { subs: 0.3, donations: 0.05 }
    };

    const rate = commissionRates[platform] || commissionRates.twitch;

    // Monthly calculations
    const weeksPerMonth = 4.33;
    const totalStreamsPerMonth = streamsPerWeek * weeksPerMonth;
    const totalHoursPerMonth = totalStreamsPerMonth * hoursPerStream;

    // Subscription revenue (monthly)
    const subPrice = 4.99; // Tier 1 subscription price
    const subscriptionRevenue = subscribers * subPrice * (1 - rate.subs);

    // Donation revenue (monthly)
    const totalDonationsPerMonth = donationsPerStream * totalStreamsPerMonth;
    const donationRevenue = totalDonationsPerMonth * avgDonation * (1 - rate.donations);

    // Ad revenue (monthly)
    const adRevenue = totalHoursPerMonth * adRevenuePerHour;

    // Sponsorship revenue (already monthly)
    const sponsorshipRevenue = sponsorshipMonthly;

    // Total monthly revenue
    const totalMonthly = subscriptionRevenue + donationRevenue + adRevenue + sponsorshipRevenue;

    return {
      subscriptions: subscriptionRevenue,
      donations: donationRevenue,
      ads: adRevenue,
      sponsorships: sponsorshipRevenue,
      total: totalMonthly,
      yearly: totalMonthly * 12,
      totalStreamsPerMonth: Math.round(totalStreamsPerMonth),
      totalHoursPerMonth: Math.round(totalHoursPerMonth * 10) / 10
    };
  }

  function getStreamerTier(followers, avgViewers) {
    if (followers < 100 || avgViewers < 10) {
      return {
        name: "Beginner",
        description: "Focus on content creation and finding audience",
        color: "info"
      };
    } else if (followers < 1000 || avgViewers < 50) {
      return {
        name: "Growing",
        description: "Building audience and first earnings",
        color: "warning"
      };
    } else if (followers < 10000 || avgViewers < 200) {
      return {
        name: "Partner",
        description: "Stable monetization and regular income",
        color: "success"
      };
    } else {
      return {
        name: "Top Streamer",
        description: "Full-time streaming career",
        color: "success"
      };
    }
  }

  function getRecommendations(tier, platform) {
    const baseRecommendations = {
      "Beginner": [
        "Establish a regular streaming schedule (minimum 3 times per week)",
        "Focus on content quality over viewer count", 
        "Actively engage with every viewer in chat",
        "Create social media profiles and share stream highlights",
        "Study successful streamers in your niche"
      ],
      "Growing": [
        "Start experimenting with different content types",
        "Set up donations and subscriptions through third-party services",
        "Develop personal branding and unique style",
        "Collaborate with other streamers of similar level",
        "Begin working with small sponsorship deals"
      ],
      "Partner": [
        "Diversify income sources (merch, courses, affiliate)",
        "Start working with sponsors and brands",
        "Consider hiring moderators and assistants",
        "Create additional content for social media",
        "Invest in improving equipment and setup"
      ],
      "Top Streamer": [
        "Consider creating your own team or organization",
        "Invest in long-term partnerships with major brands",
        "Create educational content and mentorship programs",
        "Expand to other platforms and media",
        "Consider investments in other business areas"
      ]
    };

    return baseRecommendations[tier.name] || baseRecommendations["Beginner"];
  }

  function displayResults(revenues, tier, recommendations, platform) {
    const platformEmojis = {
      twitch: "📺",
      youtube: "🎥", 
      tiktok: "🎵",
      facebook: "📘"
    };

    const platformNames = {
      twitch: "Twitch",
      youtube: "YouTube",
      tiktok: "TikTok Live",
      facebook: "Facebook Gaming"
    };

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>💰 Monthly Revenue</h6>
          <div class="big-number">$${revenues.total.toFixed(0)}</div>
          <p>Total potential income</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Annual Revenue</h6>
          <div class="big-number">$${revenues.yearly.toFixed(0)}</div>
          <p>Yearly extrapolation</p>
        </div>

        <div class="insight-card ${tier.color}">
          <h6>🎯 Streamer Level</h6>
          <div class="big-number">${tier.name}</div>
          <p>${tier.description}</p>
        </div>
      </div>

      <div class="revenue-breakdown">
        <h4>📊 Revenue Breakdown</h4>
        <div class="revenue-chart">
          <div class="revenue-item">
            <span class="revenue-label">💰 Subscriptions:</span>
            <span class="revenue-amount">$${revenues.subscriptions.toFixed(2)}/mo</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.subscriptions / revenues.total * 100)}%"></div>
            </div>
          </div>
          
          <div class="revenue-item">
            <span class="revenue-label">🎁 Donations:</span>
            <span class="revenue-amount">$${revenues.donations.toFixed(2)}/mo</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.donations / revenues.total * 100)}%"></div>
            </div>
          </div>
          
          <div class="revenue-item">
            <span class="revenue-label">📊 Advertising:</span>
            <span class="revenue-amount">$${revenues.ads.toFixed(2)}/mo</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.ads / revenues.total * 100)}%"></div>
            </div>
          </div>
          
          <div class="revenue-item">
            <span class="revenue-label">🤝 Sponsorships:</span>
            <span class="revenue-amount">$${revenues.sponsorships.toFixed(2)}/mo</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.sponsorships / revenues.total * 100)}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="streaming-stats">
        <h4>📈 Streaming Statistics</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <strong>Platform:</strong> ${platformEmojis[platform]} ${platformNames[platform]}
          </div>
          <div class="stat-item">
            <strong>Streams per month:</strong> ${revenues.totalStreamsPerMonth}
          </div>
          <div class="stat-item">
            <strong>Hours per month:</strong> ${revenues.totalHoursPerMonth}
          </div>
          <div class="stat-item">
            <strong>Revenue per hour:</strong> $${(revenues.total / revenues.totalHoursPerMonth).toFixed(2)}
          </div>
        </div>
      </div>

      <div class="recommendations">
        <h4>💡 Growth Recommendations</h4>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      <div class="disclaimer">
        <h4>⚠️ Important Notes</h4>
        <ul>
          <li>Calculations are based on average metrics and may vary significantly</li>
          <li>Income can fluctuate greatly depending on content and audience</li>
          <li>Consider platform commissions and taxes in your calculations</li>
          <li>Stable income requires time and consistent effort</li>
        </ul>
      </div>
    `;
  }
});