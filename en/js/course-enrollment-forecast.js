document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("course-enrollment-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const coursePrice = parseFloat(document.getElementById("coursePrice").value);
    const courseDuration = parseFloat(document.getElementById("courseDuration").value);
    const courseQuality = document.getElementById("courseQuality").value;
    const courseNiche = document.getElementById("courseNiche").value;
    const instructorExperience = document.getElementById("instructorExperience").value;
    const existingAudience = document.getElementById("existingAudience").value;
    const industryCredibility = document.getElementById("industryCredibility").value;
    const marketingBudget = parseFloat(document.getElementById("marketingBudget").value) || 0;
    const marketingChannels = document.getElementById("marketingChannels").value;
    const launchStrategy = document.getElementById("launchStrategy").value;
    const marketDemand = document.getElementById("marketDemand").value;
    const competitionLevel = document.getElementById("competitionLevel").value;
    const projectionMonths = parseInt(document.getElementById("projectionMonths").value);

    // Base enrollment calculation factors
    
    // Course quality multiplier
    const qualityMultipliers = {
      'basic': 0.6,
      'good': 1.0,
      'premium': 1.4,
      'exceptional': 1.8
    };

    // Niche popularity and conversion rates
    const nicheMultipliers = {
      'business': 1.2,
      'tech': 1.4,
      'marketing': 1.3,
      'design': 1.0,
      'personal': 1.1,
      'health': 0.9,
      'finance': 1.3,
      'language': 0.8,
      'music': 0.7,
      'academic': 0.6
    };

    // Instructor experience impact
    const experienceMultipliers = {
      'beginner': 0.5,
      'intermediate': 1.0,
      'experienced': 1.5,
      'expert': 2.2
    };

    // Existing audience impact
    const audienceMultipliers = {
      'none': 0.3,
      'small': 1.0,
      'medium': 2.5,
      'large': 4.0
    };

    // Industry credibility impact
    const credibilityMultipliers = {
      'building': 0.8,
      'recognized': 1.0,
      'established': 1.4,
      'renowned': 1.8
    };

    // Marketing channel effectiveness
    const channelMultipliers = {
      'organic': 0.7,
      'social': 1.0,
      'paid': 1.5,
      'email': 1.2,
      'partnerships': 1.3,
      'marketplace': 0.9
    };

    // Launch strategy impact
    const launchMultipliers = {
      'soft': 0.6,
      'standard': 1.0,
      'intensive': 1.8,
      'evergreen': 0.8
    };

    // Market demand impact
    const demandMultipliers = {
      'low': 0.5,
      'medium': 1.0,
      'high': 1.4,
      'trending': 1.8
    };

    // Competition impact (inverse relationship)
    const competitionMultipliers = {
      'low': 1.4,
      'medium': 1.0,
      'high': 0.7,
      'saturated': 0.4
    };

    // Price impact on enrollment (sweet spot analysis)
    let priceMultiplier = 1.0;
    if (coursePrice < 50) priceMultiplier = 1.3; // High volume, low value perception
    else if (coursePrice <= 100) priceMultiplier = 1.4; // Sweet spot
    else if (coursePrice <= 200) priceMultiplier = 1.2; // Good value
    else if (coursePrice <= 500) priceMultiplier = 1.0; // Premium pricing
    else priceMultiplier = 0.6; // High-end, limited audience

    // Marketing budget impact (diminishing returns)
    let marketingMultiplier = 1.0;
    if (marketingBudget > 0) {
      marketingMultiplier = 1 + Math.min(marketingBudget / 1000 * 0.5, 1.0); // Max 100% boost
    }

    // Calculate base monthly enrollments
    const baseEnrollments = 25; // Starting baseline
    const totalMultiplier = qualityMultipliers[courseQuality] *
                           nicheMultipliers[courseNiche] *
                           experienceMultipliers[instructorExperience] *
                           audienceMultipliers[existingAudience] *
                           credibilityMultipliers[industryCredibility] *
                           channelMultipliers[marketingChannels] *
                           launchMultipliers[launchStrategy] *
                           demandMultipliers[marketDemand] *
                           competitionMultipliers[competitionLevel] *
                           priceMultiplier *
                           marketingMultiplier;

    const monthlyEnrollments = Math.round(baseEnrollments * totalMultiplier);

    // Calculate growth over time with decay
    let currentMonthlyEnrollments = monthlyEnrollments;
    let totalStudents = 0;
    let totalRevenue = 0;
    const monthlyData = [];

    for (let month = 1; month <= projectionMonths; month++) {
      // Apply growth decay (initial launch boost fades)
      let growthFactor = 1.0;
      if (month <= 3) growthFactor = 1.3; // Launch period boost
      else if (month <= 6) growthFactor = 1.1; // Early growth
      else if (month <= 12) growthFactor = 1.0; // Steady state
      else growthFactor = 0.9; // Potential decline without updates

      const monthEnrollments = Math.round(currentMonthlyEnrollments * growthFactor);
      const monthRevenue = monthEnrollments * coursePrice;
      
      totalStudents += monthEnrollments;
      totalRevenue += monthRevenue;
      
      monthlyData.push({
        month: month,
        enrollments: monthEnrollments,
        revenue: monthRevenue
      });

      // Slight decay for next month (need fresh marketing)
      currentMonthlyEnrollments = monthEnrollments * 0.95;
    }

    // Calculate course completion rate
    let completionRate = 0.25; // Base 25%
    if (courseQuality === 'premium') completionRate = 0.35;
    else if (courseQuality === 'exceptional') completionRate = 0.45;
    else if (courseQuality === 'basic') completionRate = 0.15;

    // Adjust completion rate by course duration
    if (courseDuration <= 2) completionRate += 0.1; // Short courses have higher completion
    else if (courseDuration >= 10) completionRate -= 0.1; // Long courses harder to complete

    // Calculate additional metrics
    const avgMonthlyRevenue = totalRevenue / projectionMonths;
    const studentLifetimeValue = coursePrice * 1.2; // Assume some upsells/repeat purchases
    const totalLTV = totalStudents * studentLifetimeValue;
    const completedStudents = Math.round(totalStudents * completionRate);

    // Market penetration estimate (very rough)
    const estimatedMarketSize = {
      'business': 500000,
      'tech': 800000,
      'marketing': 300000,
      'design': 200000,
      'personal': 400000,
      'health': 300000,
      'finance': 250000,
      'language': 150000,
      'music': 100000,
      'academic': 200000
    };

    const marketPenetration = (totalStudents / estimatedMarketSize[courseNiche]) * 100;

    // Success assessment
    let successLevel = "";
    let successClass = "";
    if (totalStudents >= 5000) {
      successLevel = "🚀 Exceptional Success";
      successClass = "success";
    } else if (totalStudents >= 1000) {
      successLevel = "✅ Strong Performance";
      successClass = "success";
    } else if (totalStudents >= 200) {
      successLevel = "📈 Good Growth";
      successClass = "info";
    } else {
      successLevel = "🌱 Building Foundation";
      successClass = "warning";
    }

    // Display results
    const resultBlock = document.getElementById("course-enrollment-result");
    resultBlock.innerHTML = `
      <h3>🎓 Course Enrollment Forecast</h3>
      
      <div class="insight-cards">
        <div class="insight-card ${successClass}">
          <h6>👥 Total Students (${projectionMonths}M)</h6>
          <div class="big-number">${totalStudents.toLocaleString()}</div>
          <p>${successLevel}<br>
          Avg: ${Math.round(totalStudents / projectionMonths)} students/month<br>
          Completion: ${Math.round(completedStudents).toLocaleString()} (${(completionRate * 100).toFixed(1)}%)</p>
        </div>
        
        <div class="insight-card success">
          <h6>💰 Revenue Projection</h6>
          <div class="big-number">$${Math.round(totalRevenue).toLocaleString()}</div>
          <p>Total over ${projectionMonths} months<br>
          Monthly avg: $${Math.round(avgMonthlyRevenue).toLocaleString()}<br>
          Student LTV: $${Math.round(studentLifetimeValue).toLocaleString()}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📊 Market Impact</h6>
          <div class="big-number">${marketPenetration.toFixed(3)}%</div>
          <p>Market penetration<br>
          Course price: $${coursePrice}<br>
          ${courseDuration}h of content</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📈 Growth Analysis & Strategy</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>🎯 Success Factors:</strong><br>
            Course quality: ${courseQuality} (${(qualityMultipliers[courseQuality] * 100).toFixed(0)}%)<br>
            Niche appeal: ${courseNiche} (${(nicheMultipliers[courseNiche] * 100).toFixed(0)}%)<br>
            Instructor exp: ${instructorExperience} (${(experienceMultipliers[instructorExperience] * 100).toFixed(0)}%)<br>
            Audience size: ${existingAudience} (${(audienceMultipliers[existingAudience] * 100).toFixed(0)}%)<br>
            Credibility: ${industryCredibility} (${(credibilityMultipliers[industryCredibility] * 100).toFixed(0)}%)<br>
            Market demand: ${marketDemand} (${(demandMultipliers[marketDemand] * 100).toFixed(0)}%)
          </div>
          
          <div>
            <strong>📊 Strategy Impact:</strong><br>
            Marketing channel: ${marketingChannels} (${(channelMultipliers[marketingChannels] * 100).toFixed(0)}%)<br>
            Launch strategy: ${launchStrategy} (${(launchMultipliers[launchStrategy] * 100).toFixed(0)}%)<br>
            Competition level: ${competitionLevel} (${(competitionMultipliers[competitionLevel] * 100).toFixed(0)}%)<br>
            Price optimization: $${coursePrice} (${(priceMultiplier * 100).toFixed(0)}%)<br>
            Marketing budget: $${marketingBudget}/month (${(marketingMultiplier * 100).toFixed(0)}%)<br>
            Overall multiplier: ${totalMultiplier.toFixed(2)}x
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px;">
          <strong>📅 Monthly Enrollment Timeline:</strong><br>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; margin-top: 0.5rem; font-size: 0.9em;">
            ${monthlyData.slice(0, 12).map((data, index) => `
              <div style="text-align: center; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                Month ${data.month}<br>
                <strong>${data.enrollments}</strong> students<br>
                <small>$${(data.revenue / 1000).toFixed(0)}K</small>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${totalStudents >= 1000 ? '#d4edda' : totalStudents >= 200 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${totalStudents >= 1000 ? '#28a745' : totalStudents >= 200 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Success Strategy Recommendations:</strong><br>
          ${totalStudents >= 1000 ?
            '🎉 Excellent forecast! Focus on student success and retention, consider advanced courses and coaching upsells. Build community around your expertise.' :
            totalStudents >= 200 ?
            '✅ Solid potential! Optimize completion rates, gather testimonials, and plan follow-up courses. Invest in email marketing and community building.' :
            '📈 Building phase. Focus on course quality, student outcomes, and organic marketing. Consider lowering price initially to build reviews and testimonials.'
          }<br><br>
          
          <strong>🚀 Growth Optimization Tips:</strong><br>
          • ${completionRate < 0.3 ? 'Improve course structure and engagement to boost completion rates' : 'Excellent completion rate - leverage for testimonials and referrals'}<br>
          • ${marketingBudget < 300 ? 'Consider increasing marketing budget for faster growth' : 'Optimize current marketing spend for better ROI'}<br>
          • ${totalMultiplier < 1.0 ? 'Focus on building credibility and audience before launch' : 'Strong positioning - maintain quality and consistency'}<br>
          • ${coursePrice < 100 ? 'Consider price testing - may be undervaluing your expertise' : coursePrice > 500 ? 'High price point - ensure exceptional value delivery' : 'Good price positioning for market'}
        </div>
      </div>
    `;
  });
});