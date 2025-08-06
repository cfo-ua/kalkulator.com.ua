document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("wedding-cost-form");
  const resultDiv = document.getElementById("wedding-cost-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateWeddingCosts();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['guest-count', 'wedding-style', 'location-type'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateWeddingCosts();
      }
    });
    document.getElementById(id).addEventListener("change", function () {
      if (validateInputs()) {
        calculateWeddingCosts();
      }
    });
  });

  function validateInputs() {
    const guestCount = parseFloat(document.getElementById("guest-count").value);
    return guestCount > 0;
  }

  function calculateWeddingCosts() {
    // Get inputs
    const guestCount = parseFloat(document.getElementById("guest-count").value) || 0;
    const weddingStyle = document.getElementById("wedding-style").value;
    const locationType = document.getElementById("location-type").value;
    const weddingSeason = document.getElementById("wedding-season").value;
    const venueType = document.getElementById("venue-type").value;
    const cateringStyle = document.getElementById("catering-style").value;
    const barService = document.getElementById("bar-service").value;
    const photographyLevel = document.getElementById("photography-level").value;
    const videography = document.getElementById("videography").value;
    const flowersLevel = document.getElementById("flowers-level").value;
    const musicEntertainment = document.getElementById("music-entertainment").value;
    const dressBudget = document.getElementById("dress-budget").value;
    const groomAttire = document.getElementById("groom-attire").value;
    const beautyServices = document.getElementById("beauty-services").value;
    
    // Additional options
    const weddingPlanner = document.getElementById("wedding-planner").checked;
    const transportation = document.getElementById("transportation").checked;
    const favors = document.getElementById("favors").checked;
    const welcomeBags = document.getElementById("welcome-bags").checked;
    const rehearsalDinner = document.getElementById("rehearsal-dinner").checked;
    const dayAfterBrunch = document.getElementById("day-after-brunch").checked;

    if (guestCount <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter a valid number of guests.</p>';
      return;
    }

    // Calculate base cost per guest
    const basePerGuestCost = getBasePerGuestCost(weddingStyle, locationType);
    
    // Calculate venue and catering costs
    const venueCateringCosts = calculateVenueCatering(guestCount, venueType, cateringStyle, barService, basePerGuestCost);
    
    // Calculate photography costs
    const photographyCosts = calculatePhotography(photographyLevel, videography);
    
    // Calculate flowers and decorations
    const flowersCosts = calculateFlowers(flowersLevel, guestCount);
    
    // Calculate music and entertainment
    const musicCosts = calculateMusic(musicEntertainment);
    
    // Calculate attire and beauty
    const attireBeautyCosts = calculateAttireBeauty(dressBudget, groomAttire, beautyServices);
    
    // Calculate additional services
    const additionalCosts = calculateAdditionalServices({
      weddingPlanner, transportation, favors, welcomeBags, 
      rehearsalDinner, dayAfterBrunch, guestCount, basePerGuestCost
    });
    
    // Apply seasonal and location multipliers
    const seasonMultiplier = weddingSeason === 'peak' ? 1.25 : 1.0;
    const locationMultiplier = getLocationMultiplier(locationType);
    
    // Calculate total costs
    const subtotalBeforeMultipliers = venueCateringCosts.total + photographyCosts.total + 
                                     flowersCosts.total + musicCosts.total + 
                                     attireBeautyCosts.total + additionalCosts.total;
    
    const adjustmentAmount = subtotalBeforeMultipliers * (seasonMultiplier * locationMultiplier - 1);
    const totalWeddingCost = subtotalBeforeMultipliers * seasonMultiplier * locationMultiplier;
    
    // Calculate cost per guest
    const costPerGuest = totalWeddingCost / guestCount;
    
    // Generate budget breakdown
    const budgetBreakdown = {
      venueCatering: venueCateringCosts,
      photography: photographyCosts,
      flowers: flowersCosts,
      music: musicCosts,
      attireBeauty: attireBeautyCosts,
      additional: additionalCosts,
      adjustments: {
        seasonal: (seasonMultiplier - 1) * 100,
        location: (locationMultiplier - 1) * 100,
        total: adjustmentAmount
      },
      total: totalWeddingCost,
      perGuest: costPerGuest
    };

    // Generate cost-saving suggestions
    const costSavings = generateCostSavings(budgetBreakdown, guestCount, weddingStyle);

    displayResults({
      guestCount,
      weddingStyle,
      locationType,
      totalWeddingCost,
      costPerGuest,
      budgetBreakdown,
      costSavings,
      seasonMultiplier,
      locationMultiplier
    });
  }

  function getBasePerGuestCost(style, location) {
    const styleCosts = {
      'budget': 75,
      'casual': 125,
      'traditional': 200,
      'upscale': 300,
      'luxury': 500,
      'destination': 250
    };
    
    return styleCosts[style] || 200;
  }

  function getLocationMultiplier(location) {
    const multipliers = {
      'rural': 0.75,
      'suburban': 1.0,
      'urban': 1.2,
      'major-city': 1.6,
      'destination': 1.3
    };
    
    return multipliers[location] || 1.0;
  }

  function calculateVenueCatering(guests, venue, catering, bar, basePerGuest) {
    let venueCost = 0;
    let foodCost = 0;
    let barCost = 0;
    
    // Venue costs
    const venueCosts = {
      'backyard': 500,
      'community': 800,
      'restaurant': guests * 15,
      'banquet': guests * 25,
      'hotel': guests * 35,
      'unique': guests * 30,
      'luxury': guests * 60
    };
    venueCost = venueCosts[venue] || guests * 25;
    
    // Food costs per guest
    const foodCosts = {
      'appetizers': 35,
      'buffet': 45,
      'family-style': 55,
      'plated': 65,
      'stations': 70
    };
    foodCost = (foodCosts[catering] || 55) * guests;
    
    // Bar costs per guest
    const barCosts = {
      'none': 0,
      'beer-wine': 15,
      'limited': 25,
      'full': 35,
      'premium': 50
    };
    barCost = (barCosts[bar] || 25) * guests;
    
    const total = venueCost + foodCost + barCost;
    
    return {
      venue: venueCost,
      food: foodCost,
      bar: barCost,
      total: total
    };
  }

  function calculatePhotography(level, video) {
    const photographyCosts = {
      'basic': 1200,
      'standard': 2500,
      'premium': 4000,
      'luxury': 6500
    };
    
    const videoCosts = {
      'none': 0,
      'basic': 1500,
      'cinematic': 3500
    };
    
    const photoCost = photographyCosts[level] || 2500;
    const videoCost = videoCosts[video] || 0;
    
    return {
      photography: photoCost,
      videography: videoCost,
      total: photoCost + videoCost
    };
  }

  function calculateFlowers(level, guests) {
    const flowerBudgets = {
      'minimal': 300,
      'basic': 800,
      'standard': 1500,
      'elaborate': 3000
    };
    
    const baseCost = flowerBudgets[level] || 1500;
    // Add per-guest cost for centerpieces
    const centerpiececCost = guests > 50 ? (guests / 8) * 75 : 0;
    
    return {
      flowers: baseCost + centerpiececCost,
      total: baseCost + centerpiececCost
    };
  }

  function calculateMusic(entertainment) {
    const musicCosts = {
      'playlist': 200,
      'dj': 1200,
      'band': 3500,
      'premium': 6000
    };
    
    const cost = musicCosts[entertainment] || 1200;
    
    return {
      entertainment: cost,
      total: cost
    };
  }

  function calculateAttireBeauty(dress, groom, beauty) {
    const dressCosts = {
      'budget': 500,
      'moderate': 1200,
      'designer': 2300,
      'luxury': 4500
    };
    
    const groomCosts = {
      'owned': 100, // Accessories only
      'rental': 250,
      'purchase': 600,
      'custom': 1500
    };
    
    const beautyCosts = {
      'diy': 150,
      'basic': 400,
      'full': 800,
      'bridal-party': 1200
    };
    
    const dressTotal = dressCosts[dress] || 1200;
    const groomTotal = groomCosts[groom] || 250;
    const beautyTotal = beautyCosts[beauty] || 800;
    
    return {
      dress: dressTotal,
      groom: groomTotal,
      beauty: beautyTotal,
      total: dressTotal + groomTotal + beautyTotal
    };
  }

  function calculateAdditionalServices(options) {
    let total = 0;
    const costs = {};
    
    if (options.weddingPlanner) {
      costs.planner = Math.max(2000, options.basePerGuestCost * options.guestCount * 0.10);
      total += costs.planner;
    }
    
    if (options.transportation) {
      costs.transportation = 600;
      total += costs.transportation;
    }
    
    if (options.favors) {
      costs.favors = options.guestCount * 8;
      total += costs.favors;
    }
    
    if (options.welcomeBags) {
      costs.welcomeBags = options.guestCount * 25;
      total += costs.welcomeBags;
    }
    
    if (options.rehearsalDinner) {
      costs.rehearsalDinner = Math.min(options.guestCount * 0.3, 20) * 45; // 30% of guests, max 20 people
      total += costs.rehearsalDinner;
    }
    
    if (options.dayAfterBrunch) {
      costs.dayAfterBrunch = Math.min(options.guestCount * 0.5, 40) * 30; // 50% of guests, max 40 people
      total += costs.dayAfterBrunch;
    }
    
    // Miscellaneous costs (invitations, rings, etc.)
    costs.miscellaneous = 1500;
    total += costs.miscellaneous;
    
    return {
      ...costs,
      total: total
    };
  }

  function generateCostSavings(breakdown, guests, style) {
    const suggestions = [];
    
    // Venue and catering suggestions
    if (breakdown.venueCatering.total > breakdown.total * 0.55) {
      suggestions.push({
        category: "Venue & Catering",
        suggestion: "Consider buffet instead of plated dinner",
        savings: breakdown.venueCatering.food * 0.2
      });
    }
    
    // Photography suggestions
    if (breakdown.photography.total > 4000) {
      suggestions.push({
        category: "Photography",
        suggestion: "Choose shorter coverage or single photographer",
        savings: breakdown.photography.photography * 0.3
      });
    }
    
    // Guest count impact
    const guestReduction = Math.ceil(guests * 0.2); // 20% reduction
    const perGuestSavings = breakdown.total / guests;
    suggestions.push({
      category: "Guest List",
      suggestion: `Reduce guest count by ${guestReduction} people`,
      savings: guestReduction * perGuestSavings
    });
    
    // Off-peak timing
    if (breakdown.adjustments.seasonal > 0) {
      suggestions.push({
        category: "Timing",
        suggestion: "Move to off-peak season (fall/winter)",
        savings: breakdown.total * 0.2
      });
    }
    
    // DIY options
    if (breakdown.flowers.total > 1000) {
      suggestions.push({
        category: "Flowers",
        suggestion: "DIY centerpieces and simple bouquets",
        savings: breakdown.flowers.total * 0.4
      });
    }
    
    return suggestions.sort((a, b) => b.savings - a.savings).slice(0, 5);
  }

  function displayResults(data) {
    const {
      guestCount,
      weddingStyle,
      locationType,
      totalWeddingCost,
      costPerGuest,
      budgetBreakdown,
      costSavings,
      seasonMultiplier,
      locationMultiplier
    } = data;

    const weddingCategory = getWeddingCategory(totalWeddingCost);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>💒 Wedding Cost Estimate</h3>
        
        <div class="wedding-hero">
          <div class="hero-content">
            <div class="main-cost">
              <h4>💖 Your Dream Wedding</h4>
              <div class="cost-display">
                <span class="currency">$</span>
                <span class="amount">${totalWeddingCost.toLocaleString()}</span>
              </div>
              <p class="cost-subtitle">${weddingCategory} • ${guestCount} guests • $${costPerGuest.toFixed(0)} per guest</p>
            </div>
            <div class="wedding-details">
              <div class="detail-card">
                <div class="detail-icon">🎭</div>
                <div class="detail-info">
                  <span class="detail-label">Style</span>
                  <span class="detail-value">${weddingStyle.charAt(0).toUpperCase() + weddingStyle.slice(1)}</span>
                </div>
              </div>
              <div class="detail-card">
                <div class="detail-icon">📍</div>
                <div class="detail-info">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">${locationType.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                </div>
              </div>
              <div class="detail-card">
                <div class="detail-icon">👥</div>
                <div class="detail-info">
                  <span class="detail-label">Guests</span>
                  <span class="detail-value">${guestCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="budget-breakdown">
          <h4>💰 Detailed Budget Breakdown</h4>
          <div class="breakdown-visual">
            <div class="breakdown-chart">
              <div class="breakdown-item venue" style="--percentage: ${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">🏰</span>
                    <span class="category-name">Venue & Catering</span>
                    <span class="category-amount">$${budgetBreakdown.venueCatering.total.toLocaleString()}</span>
                    <span class="category-percentage">${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                  <div class="subcategories">
                    <div class="subcategory">
                      <span class="sub-icon">🍽️</span>
                      <span>Venue: $${budgetBreakdown.venueCatering.venue.toLocaleString()}</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">🥘</span>
                      <span>Food: $${budgetBreakdown.venueCatering.food.toLocaleString()}</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">🍷</span>
                      <span>Bar: $${budgetBreakdown.venueCatering.bar.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="breakdown-item photography" style="--percentage: ${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">📸</span>
                    <span class="category-name">Photography & Video</span>
                    <span class="category-amount">$${budgetBreakdown.photography.total.toLocaleString()}</span>
                    <span class="category-percentage">${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                  ${budgetBreakdown.photography.videography > 0 ? `
                    <div class="subcategories">
                      <div class="subcategory">
                        <span class="sub-icon">📷</span>
                        <span>Photography: $${budgetBreakdown.photography.photography.toLocaleString()}</span>
                      </div>
                      <div class="subcategory">
                        <span class="sub-icon">🎥</span>
                        <span>Videography: $${budgetBreakdown.photography.videography.toLocaleString()}</span>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="breakdown-item flowers" style="--percentage: ${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">🌸</span>
                    <span class="category-name">Flowers & Decorations</span>
                    <span class="category-amount">$${budgetBreakdown.flowers.total.toLocaleString()}</span>
                    <span class="category-percentage">${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div class="breakdown-item music" style="--percentage: ${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">🎵</span>
                    <span class="category-name">Music & Entertainment</span>
                    <span class="category-amount">$${budgetBreakdown.music.total.toLocaleString()}</span>
                    <span class="category-percentage">${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div class="breakdown-item attire" style="--percentage: ${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">👗</span>
                    <span class="category-name">Attire & Beauty</span>
                    <span class="category-amount">$${budgetBreakdown.attireBeauty.total.toLocaleString()}</span>
                    <span class="category-percentage">${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                  <div class="subcategories">
                    <div class="subcategory">
                      <span class="sub-icon">👰</span>
                      <span>Dress: $${budgetBreakdown.attireBeauty.dress.toLocaleString()}</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">🤵</span>
                      <span>Groom: $${budgetBreakdown.attireBeauty.groom.toLocaleString()}</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">💄</span>
                      <span>Beauty: $${budgetBreakdown.attireBeauty.beauty.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="breakdown-item additional" style="--percentage: ${((budgetBreakdown.additional.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.additional.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">✨</span>
                    <span class="category-name">Additional Services</span>
                    <span class="category-amount">$${budgetBreakdown.additional.total.toLocaleString()}</span>
                    <span class="category-percentage">${((budgetBreakdown.additional.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              ${Math.abs(budgetBreakdown.adjustments.total) > 100 ? `
                <div class="breakdown-item adjustments ${budgetBreakdown.adjustments.total >= 0 ? 'positive' : 'negative'}">
                  <div class="category-content">
                    <div class="category-header">
                      <span class="category-icon">${budgetBreakdown.adjustments.total >= 0 ? '📈' : '📉'}</span>
                      <span class="category-name">Location & Season Adjustments</span>
                      <span class="category-amount">${budgetBreakdown.adjustments.total >= 0 ? '+' : ''}$${budgetBreakdown.adjustments.total.toLocaleString()}</span>
                      <span class="category-percentage">(${Math.abs((budgetBreakdown.adjustments.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="cost-savings">
          <h4>💡 Top Money-Saving Opportunities</h4>
          <div class="savings-cards">
            ${costSavings.map((saving, index) => `
              <div class="saving-card rank-${index + 1}">
                <div class="saving-rank">#${index + 1}</div>
                <div class="saving-content">
                  <div class="saving-category">${saving.category}</div>
                  <div class="saving-suggestion">${saving.suggestion}</div>
                  <div class="saving-amount">
                    <span class="save-label">Potential Savings:</span>
                    <span class="save-value">$${saving.savings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="total-savings-summary">
            <div class="summary-content">
              <span class="summary-label">💰 Total Potential Savings:</span>
              <span class="summary-amount">$${costSavings.reduce((sum, saving) => sum + saving.savings, 0).toLocaleString()}</span>
            </div>
            <div class="summary-subtitle">Your budget could be as low as $${(totalWeddingCost - costSavings.reduce((sum, saving) => sum + saving.savings, 0)).toLocaleString()}</div>
          </div>
        </div>

        <div class="wedding-planning-guide">
          <h4>📋 Wedding Planning Guide</h4>
          <div class="guide-tabs">
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">💳</span>
                <h5>Budget Management</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">✅</span> Set aside 5-10% for unexpected costs</li>
                <li><span class="tip-icon">🎯</span> Prioritize your "must-haves" vs. "nice-to-haves"</li>
                <li><span class="tip-icon">📝</span> Get all quotes in writing</li>
                <li><span class="tip-icon">📊</span> Track expenses in a spreadsheet</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">💰</span>
                <h5>Cost-Saving Strategies</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">📅</span> Choose Friday or Sunday for 10-30% savings</li>
                <li><span class="tip-icon">🍂</span> Book during off-peak season</li>
                <li><span class="tip-icon">🥐</span> Consider brunch or lunch receptions</li>
                <li><span class="tip-icon">🍷</span> Limit open bar hours</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">⏰</span>
                <h5>Timeline & Booking</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">🏰</span> Book venue 12-18 months in advance</li>
                <li><span class="tip-icon">📸</span> Book photographer 6-12 months ahead</li>
                <li><span class="tip-icon">👗</span> Order dress 6-8 months in advance</li>
                <li><span class="tip-icon">💌</span> Send invitations 6-8 weeks before</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">⚠️</span>
                <h5>Hidden Costs to Consider</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">💝</span> Gratuities for vendors (15-20%)</li>
                <li><span class="tip-icon">📋</span> Service charges and taxes</li>
                <li><span class="tip-icon">🍽️</span> Vendor meals during event</li>
                <li><span class="tip-icon">⏱️</span> Overtime fees</li>
                <li><span class="tip-icon">📜</span> Marriage license and officiant</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="budget-guidelines">
          <h4>📊 Budget Allocation Guidelines</h4>
          <div class="guidelines-comparison">
            <div class="guideline-header">
              <span>Category</span>
              <span>Typical Range</span>
              <span>Your Allocation</span>
              <span>Status</span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">🏰 Reception & Catering</span>
              <span class="typical-range">40-50%</span>
              <span class="your-allocation">${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100), 40, 50)}">
                ${getStatusIcon(((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100), 40, 50)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">📸 Photography & Video</span>
              <span class="typical-range">10-15%</span>
              <span class="your-allocation">${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.photography.total / totalWeddingCost) * 100), 10, 15)}">
                ${getStatusIcon(((budgetBreakdown.photography.total / totalWeddingCost) * 100), 10, 15)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">👗 Attire & Beauty</span>
              <span class="typical-range">8-10%</span>
              <span class="your-allocation">${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100), 8, 10)}">
                ${getStatusIcon(((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100), 8, 10)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">🌸 Flowers & Decorations</span>
              <span class="typical-range">8-10%</span>
              <span class="your-allocation">${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.flowers.total / totalWeddingCost) * 100), 8, 10)}">
                ${getStatusIcon(((budgetBreakdown.flowers.total / totalWeddingCost) * 100), 8, 10)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">🎵 Music & Entertainment</span>
              <span class="typical-range">8-10%</span>
              <span class="your-allocation">${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.music.total / totalWeddingCost) * 100), 8, 10)}">
                ${getStatusIcon(((budgetBreakdown.music.total / totalWeddingCost) * 100), 8, 10)}
              </span>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <h4>🎯 Next Steps</h4>
          <div class="steps-checklist">
            <div class="step-item">
              <span class="step-number">1</span>
              <span class="step-text">Prioritize your must-have elements and set a realistic budget</span>
            </div>
            <div class="step-item">
              <span class="step-number">2</span>
              <span class="step-text">Start with venue selection - it affects all other vendor choices</span>
            </div>
            <div class="step-item">
              <span class="step-number">3</span>
              <span class="step-text">Get quotes from multiple vendors in each category</span>
            </div>
            <div class="step-item">
              <span class="step-number">4</span>
              <span class="step-text">Consider the cost-saving opportunities that align with your vision</span>
            </div>
            <div class="step-item">
              <span class="step-number">5</span>
              <span class="step-text">Build in a 5-10% buffer for unexpected expenses</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getStatusClass(value, min, max) {
    if (value >= min && value <= max) return 'optimal';
    if (value < min) return 'under';
    return 'over';
  }

  function getStatusIcon(value, min, max) {
    if (value >= min && value <= max) return '✅ Optimal';
    if (value < min) return '⬇️ Under';
    return '⬆️ Over';
  }

  function getWeddingCategory(cost) {
    if (cost < 15000) return "Budget Wedding";
    if (cost < 25000) return "Small Wedding";
    if (cost < 40000) return "Medium Wedding";
    if (cost < 60000) return "Large Wedding";
    return "Luxury Wedding";
  }
  
  // Auto-calculate with default values on page load
  setTimeout(() => {
    calculateWeddingCosts();
  }, 100);
});