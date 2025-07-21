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
        
        <div class="wedding-summary">
          <h4>Your Wedding Details</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Wedding Style:</span>
              <span class="value">${weddingStyle.charAt(0).toUpperCase() + weddingStyle.slice(1)}</span>
            </div>
            <div class="summary-item">
              <span class="label">Number of Guests:</span>
              <span class="value">${guestCount}</span>
            </div>
            <div class="summary-item">
              <span class="label">Location Type:</span>
              <span class="value">${locationType.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </div>
            <div class="summary-item highlight">
              <span class="label">Total Estimated Cost:</span>
              <span class="value">$${totalWeddingCost.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Cost Per Guest:</span>
              <span class="value">$${costPerGuest.toFixed(0)}</span>
            </div>
            <div class="summary-item">
              <span class="label">Wedding Category:</span>
              <span class="value">${weddingCategory}</span>
            </div>
          </div>
        </div>

        <div class="budget-breakdown">
          <h4>💰 Detailed Budget Breakdown</h4>
          <div class="breakdown-chart">
            <div class="breakdown-item venue">
              <div class="category-header">
                <span class="category">Venue & Catering</span>
                <span class="amount">$${budgetBreakdown.venueCatering.total.toLocaleString()}</span>
                <span class="percentage">(${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
              </div>
              <div class="subcategories">
                <div class="subcategory">
                  <span>Venue: $${budgetBreakdown.venueCatering.venue.toLocaleString()}</span>
                </div>
                <div class="subcategory">
                  <span>Food: $${budgetBreakdown.venueCatering.food.toLocaleString()}</span>
                </div>
                <div class="subcategory">
                  <span>Bar: $${budgetBreakdown.venueCatering.bar.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="breakdown-item photography">
              <div class="category-header">
                <span class="category">Photography & Video</span>
                <span class="amount">$${budgetBreakdown.photography.total.toLocaleString()}</span>
                <span class="percentage">(${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
              </div>
              ${budgetBreakdown.photography.videography > 0 ? `
                <div class="subcategories">
                  <div class="subcategory">
                    <span>Photography: $${budgetBreakdown.photography.photography.toLocaleString()}</span>
                  </div>
                  <div class="subcategory">
                    <span>Videography: $${budgetBreakdown.photography.videography.toLocaleString()}</span>
                  </div>
                </div>
              ` : ''}
            </div>

            <div class="breakdown-item flowers">
              <div class="category-header">
                <span class="category">Flowers & Decorations</span>
                <span class="amount">$${budgetBreakdown.flowers.total.toLocaleString()}</span>
                <span class="percentage">(${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div class="breakdown-item music">
              <div class="category-header">
                <span class="category">Music & Entertainment</span>
                <span class="amount">$${budgetBreakdown.music.total.toLocaleString()}</span>
                <span class="percentage">(${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div class="breakdown-item attire">
              <div class="category-header">
                <span class="category">Attire & Beauty</span>
                <span class="amount">$${budgetBreakdown.attireBeauty.total.toLocaleString()}</span>
                <span class="percentage">(${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
              </div>
              <div class="subcategories">
                <div class="subcategory">
                  <span>Dress: $${budgetBreakdown.attireBeauty.dress.toLocaleString()}</span>
                </div>
                <div class="subcategory">
                  <span>Groom: $${budgetBreakdown.attireBeauty.groom.toLocaleString()}</span>
                </div>
                <div class="subcategory">
                  <span>Beauty: $${budgetBreakdown.attireBeauty.beauty.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="breakdown-item additional">
              <div class="category-header">
                <span class="category">Additional Services</span>
                <span class="amount">$${budgetBreakdown.additional.total.toLocaleString()}</span>
                <span class="percentage">(${((budgetBreakdown.additional.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            ${Math.abs(budgetBreakdown.adjustments.total) > 100 ? `
              <div class="breakdown-item adjustments">
                <div class="category-header">
                  <span class="category">Location & Season Adjustments</span>
                  <span class="amount">${budgetBreakdown.adjustments.total >= 0 ? '+' : ''}$${budgetBreakdown.adjustments.total.toLocaleString()}</span>
                  <span class="percentage">(${budgetBreakdown.adjustments.seasonal.toFixed(1)}% season, ${budgetBreakdown.adjustments.location.toFixed(1)}% location)</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="cost-savings">
          <h4>💡 Top Cost-Saving Opportunities</h4>
          <div class="savings-list">
            ${costSavings.map(saving => `
              <div class="saving-item">
                <div class="saving-category">${saving.category}</div>
                <div class="saving-suggestion">${saving.suggestion}</div>
                <div class="saving-amount">Potential Savings: $${saving.savings.toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
          <div class="total-potential-savings">
            <strong>Total Potential Savings: $${costSavings.reduce((sum, saving) => sum + saving.savings, 0).toLocaleString()}</strong>
          </div>
        </div>

        <div class="wedding-planning-tips">
          <h4>📋 Wedding Planning Tips</h4>
          <div class="tips-grid">
            <div class="tip-category">
              <h5>Budget Management</h5>
              <ul>
                <li>Set aside 5-10% for unexpected costs</li>
                <li>Prioritize your "must-haves" vs. "nice-to-haves"</li>
                <li>Get all quotes in writing</li>
                <li>Track expenses in a spreadsheet</li>
              </ul>
            </div>
            <div class="tip-category">
              <h5>Cost-Saving Strategies</h5>
              <ul>
                <li>Choose Friday or Sunday for 10-30% savings</li>
                <li>Book during off-peak season</li>
                <li>Consider brunch or lunch receptions</li>
                <li>Limit open bar hours</li>
              </ul>
            </div>
            <div class="tip-category">
              <h5>Timeline & Booking</h5>
              <ul>
                <li>Book venue 12-18 months in advance</li>
                <li>Book photographer 6-12 months ahead</li>
                <li>Order dress 6-8 months in advance</li>
                <li>Send invitations 6-8 weeks before</li>
              </ul>
            </div>
            <div class="tip-category">
              <h5>Hidden Costs to Consider</h5>
              <ul>
                <li>Gratuities for vendors (15-20%)</li>
                <li>Service charges and taxes</li>
                <li>Vendor meals during event</li>
                <li>Overtime fees</li>
                <li>Marriage license and officiant</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="budget-allocation">
          <h4>📊 Typical Budget Allocation Guidelines</h4>
          <div class="allocation-grid">
            <div class="allocation-item">
              <span class="category">Reception Venue & Catering:</span>
              <span class="range">40-50%</span>
              <span class="your-percentage">(Your: ${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
            </div>
            <div class="allocation-item">
              <span class="category">Photography & Videography:</span>
              <span class="range">10-15%</span>
              <span class="your-percentage">(Your: ${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
            </div>
            <div class="allocation-item">
              <span class="category">Flowers & Decorations:</span>
              <span class="range">8-10%</span>
              <span class="your-percentage">(Your: ${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
            </div>
            <div class="allocation-item">
              <span class="category">Music & Entertainment:</span>
              <span class="range">8-10%</span>
              <span class="your-percentage">(Your: ${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
            </div>
            <div class="allocation-item">
              <span class="category">Attire & Beauty:</span>
              <span class="range">8-10%</span>
              <span class="your-percentage">(Your: ${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <h4>🎯 Next Steps</h4>
          <ul>
            <li>Set your final budget and stick to it</li>
            <li>Start with booking your venue (affects many other decisions)</li>
            <li>Get quotes from multiple vendors in each category</li>
            <li>Create a detailed timeline working backward from your date</li>
            <li>Consider hiring a day-of coordinator even with DIY planning</li>
            <li>Set up a separate wedding savings account</li>
            <li>Track all expenses and vendor payments</li>
          </ul>
        </div>

        <div class="important-notes">
          <h4>📝 Important Notes</h4>
          <ul>
            <li><strong>Estimates Only:</strong> Actual costs vary by specific vendors and local markets</li>
            <li><strong>Regional Variations:</strong> Costs can vary 50-100% between different areas</li>
            <li><strong>Seasonal Pricing:</strong> Peak season can add 20-50% to vendor costs</li>
            <li><strong>Vendor Availability:</strong> Popular vendors book up 12+ months in advance</li>
            <li><strong>Contract Details:</strong> Always read contracts carefully for cancellation policies</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getWeddingCategory(cost) {
    if (cost < 15000) return "Budget Wedding";
    if (cost < 25000) return "Small Wedding";
    if (cost < 40000) return "Medium Wedding";
    if (cost < 60000) return "Large Wedding";
    return "Luxury Wedding";
  }
});