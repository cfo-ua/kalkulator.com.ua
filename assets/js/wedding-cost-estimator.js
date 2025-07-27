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
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, введіть коректну кількість гостей.</p>';
      return;
    }

    // Calculate base cost per guest (UAH)
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
    const seasonMultiplier = weddingSeason === 'peak' ? 1.2 : 1.0;
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
    // Prices in UAH adapted for Ukrainian market
    const styleCosts = {
      'budget': 2500,       // ~$75 USD equivalent
      'casual': 4000,       // ~$125 USD equivalent  
      'traditional': 6500,  // ~$200 USD equivalent
      'upscale': 10000,     // ~$300 USD equivalent
      'luxury': 16500,      // ~$500 USD equivalent
      'destination': 8500   // ~$250 USD equivalent
    };
    
    return styleCosts[style] || 6500;
  }

  function getLocationMultiplier(location) {
    const multipliers = {
      'rural': 0.8,
      'suburban': 1.0,
      'urban': 1.15,
      'major-city': 1.4,
      'destination': 1.25
    };
    
    return multipliers[location] || 1.0;
  }

  function calculateVenueCatering(guests, venue, catering, bar, basePerGuest) {
    let venueCost = 0;
    let foodCost = 0;
    let barCost = 0;
    
    // Venue costs in UAH
    const venueCosts = {
      'backyard': 15000,
      'community': 25000,
      'restaurant': guests * 500,
      'banquet': guests * 800,
      'hotel': guests * 1200,
      'unique': guests * 1000,
      'luxury': guests * 2000
    };
    venueCost = venueCosts[venue] || guests * 800;
    
    // Food costs per guest in UAH
    const foodCosts = {
      'appetizers': 1200,
      'buffet': 1500,
      'family-style': 1800,
      'plated': 2200,
      'stations': 2400
    };
    foodCost = (foodCosts[catering] || 1800) * guests;
    
    // Bar costs per guest in UAH
    const barCosts = {
      'none': 0,
      'beer-wine': 500,
      'limited': 800,
      'full': 1200,
      'premium': 1700
    };
    barCost = (barCosts[bar] || 800) * guests;
    
    const total = venueCost + foodCost + barCost;
    
    return {
      venue: venueCost,
      food: foodCost,
      bar: barCost,
      total: total
    };
  }

  function calculatePhotography(level, video) {
    // Photography costs in UAH
    const photographyCosts = {
      'basic': 40000,
      'standard': 80000,
      'premium': 130000,
      'luxury': 220000
    };
    
    const videoCosts = {
      'none': 0,
      'basic': 50000,
      'cinematic': 120000
    };
    
    const photoCost = photographyCosts[level] || 80000;
    const videoCost = videoCosts[video] || 0;
    
    return {
      photography: photoCost,
      videography: videoCost,
      total: photoCost + videoCost
    };
  }

  function calculateFlowers(level, guests) {
    // Flower costs in UAH
    const flowerBudgets = {
      'minimal': 10000,
      'basic': 25000,
      'standard': 50000,
      'elaborate': 100000
    };
    
    const baseCost = flowerBudgets[level] || 50000;
    // Add per-guest cost for centerpieces
    const centerpiececCost = guests > 50 ? (guests / 8) * 2500 : 0;
    
    return {
      flowers: baseCost + centerpiececCost,
      total: baseCost + centerpiececCost
    };
  }

  function calculateMusic(entertainment) {
    // Music costs in UAH
    const musicCosts = {
      'playlist': 7000,
      'dj': 40000,
      'band': 120000,
      'premium': 200000
    };
    
    const cost = musicCosts[entertainment] || 40000;
    
    return {
      entertainment: cost,
      total: cost
    };
  }

  function calculateAttireBeauty(dress, groom, beauty) {
    // Attire costs in UAH
    const dressCosts = {
      'budget': 15000,
      'moderate': 40000,
      'designer': 75000,
      'luxury': 150000
    };
    
    const groomCosts = {
      'owned': 3000,     // Accessories only
      'rental': 8000,
      'purchase': 20000,
      'custom': 50000
    };
    
    const beautyCosts = {
      'diy': 5000,
      'basic': 13000,
      'full': 25000,
      'bridal-party': 40000
    };
    
    const dressTotal = dressCosts[dress] || 40000;
    const groomTotal = groomCosts[groom] || 8000;
    const beautyTotal = beautyCosts[beauty] || 25000;
    
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
      costs.planner = Math.max(65000, options.basePerGuestCost * options.guestCount * 0.10);
      total += costs.planner;
    }
    
    if (options.transportation) {
      costs.transportation = 20000;
      total += costs.transportation;
    }
    
    if (options.favors) {
      costs.favors = options.guestCount * 250;
      total += costs.favors;
    }
    
    if (options.welcomeBags) {
      costs.welcomeBags = options.guestCount * 800;
      total += costs.welcomeBags;
    }
    
    if (options.rehearsalDinner) {
      costs.rehearsalDinner = Math.min(options.guestCount * 0.3, 20) * 1500; // 30% of guests, max 20 people
      total += costs.rehearsalDinner;
    }
    
    if (options.dayAfterBrunch) {
      costs.dayAfterBrunch = Math.min(options.guestCount * 0.5, 40) * 1000; // 50% of guests, max 40 people
      total += costs.dayAfterBrunch;
    }
    
    // Miscellaneous costs (invitations, rings, etc.)
    costs.miscellaneous = 50000;
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
        category: "Місце та кейтеринг",
        suggestion: "Розгляньте фуршет замість подачі до столу",
        savings: breakdown.venueCatering.food * 0.2
      });
    }
    
    // Photography suggestions
    if (breakdown.photography.total > 130000) {
      suggestions.push({
        category: "Фотографія",
        suggestion: "Оберіть коротше покриття або одного фотографа",
        savings: breakdown.photography.photography * 0.3
      });
    }
    
    // Guest count impact
    const guestReduction = Math.ceil(guests * 0.2); // 20% reduction
    const perGuestSavings = breakdown.total / guests;
    suggestions.push({
      category: "Список гостей",
      suggestion: `Зменшіть кількість гостей на ${guestReduction} осіб`,
      savings: guestReduction * perGuestSavings
    });
    
    // Off-peak timing
    if (breakdown.adjustments.seasonal > 0) {
      suggestions.push({
        category: "Час проведення",
        suggestion: "Перенесіть на низький сезон (осінь/зима)",
        savings: breakdown.total * 0.15
      });
    }
    
    // DIY options
    if (breakdown.flowers.total > 35000) {
      suggestions.push({
        category: "Квіти",
        suggestion: "DIY композиції та прості букети",
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
        <h3>💒 Оцінка вартості весілля</h3>
        
        <div class="wedding-hero insight-card">
          <div class="hero-content">
            <div class="main-cost">
              <h4>💖 Ваше весілля мрії</h4>
              <div class="cost-display">
                <span class="amount">${Math.round(totalWeddingCost).toLocaleString()}</span>
                <span class="currency">грн</span>
              </div>
              <p class="cost-subtitle">${weddingCategory} • ${guestCount} гостей • ${Math.round(costPerGuest).toLocaleString()} грн на гостя</p>
            </div>
            <div class="wedding-details">
              <div class="detail-card">
                <div class="detail-icon">🎭</div>
                <div class="detail-info">
                  <span class="detail-label">Стиль</span>
                  <span class="detail-value">${getWeddingStyleName(weddingStyle)}</span>
                </div>
              </div>
              <div class="detail-card">
                <div class="detail-icon">📍</div>
                <div class="detail-info">
                  <span class="detail-label">Локація</span>
                  <span class="detail-value">${getLocationName(locationType)}</span>
                </div>
              </div>
              <div class="detail-card">
                <div class="detail-icon">👥</div>
                <div class="detail-info">
                  <span class="detail-label">Гості</span>
                  <span class="detail-value">${guestCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="budget-breakdown insight-card">
          <h4>💰 Детальний розбиття бюджету</h4>
          <div class="breakdown-visual">
            <div class="breakdown-chart">
              <div class="breakdown-item venue" style="--percentage: ${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">🏰</span>
                    <span class="category-name">Місце та кейтеринг</span>
                    <span class="category-amount">${Math.round(budgetBreakdown.venueCatering.total).toLocaleString()} грн</span>
                    <span class="category-percentage">${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                  <div class="subcategories">
                    <div class="subcategory">
                      <span class="sub-icon">🍽️</span>
                      <span>Місце: ${Math.round(budgetBreakdown.venueCatering.venue).toLocaleString()} грн</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">🥘</span>
                      <span>Їжа: ${Math.round(budgetBreakdown.venueCatering.food).toLocaleString()} грн</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">🍷</span>
                      <span>Бар: ${Math.round(budgetBreakdown.venueCatering.bar).toLocaleString()} грн</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="breakdown-item photography" style="--percentage: ${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">📸</span>
                    <span class="category-name">Фото та відео</span>
                    <span class="category-amount">${Math.round(budgetBreakdown.photography.total).toLocaleString()} грн</span>
                    <span class="category-percentage">${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                  ${budgetBreakdown.photography.videography > 0 ? `
                    <div class="subcategories">
                      <div class="subcategory">
                        <span class="sub-icon">📷</span>
                        <span>Фотографія: ${Math.round(budgetBreakdown.photography.photography).toLocaleString()} грн</span>
                      </div>
                      <div class="subcategory">
                        <span class="sub-icon">🎥</span>
                        <span>Відеозйомка: ${Math.round(budgetBreakdown.photography.videography).toLocaleString()} грн</span>
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
                    <span class="category-name">Квіти та декорації</span>
                    <span class="category-amount">${Math.round(budgetBreakdown.flowers.total).toLocaleString()} грн</span>
                    <span class="category-percentage">${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div class="breakdown-item music" style="--percentage: ${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">🎵</span>
                    <span class="category-name">Музика та розваги</span>
                    <span class="category-amount">${Math.round(budgetBreakdown.music.total).toLocaleString()} грн</span>
                    <span class="category-percentage">${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div class="breakdown-item attire" style="--percentage: ${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">👗</span>
                    <span class="category-name">Одяг та краса</span>
                    <span class="category-amount">${Math.round(budgetBreakdown.attireBeauty.total).toLocaleString()} грн</span>
                    <span class="category-percentage">${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                  <div class="subcategories">
                    <div class="subcategory">
                      <span class="sub-icon">👰</span>
                      <span>Сукня: ${Math.round(budgetBreakdown.attireBeauty.dress).toLocaleString()} грн</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">🤵</span>
                      <span>Наречений: ${Math.round(budgetBreakdown.attireBeauty.groom).toLocaleString()} грн</span>
                    </div>
                    <div class="subcategory">
                      <span class="sub-icon">💄</span>
                      <span>Краса: ${Math.round(budgetBreakdown.attireBeauty.beauty).toLocaleString()} грн</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="breakdown-item additional" style="--percentage: ${((budgetBreakdown.additional.total / totalWeddingCost) * 100).toFixed(1)}%">
                <div class="category-bar" style="width: ${((budgetBreakdown.additional.total / totalWeddingCost) * 100).toFixed(1)}%"></div>
                <div class="category-content">
                  <div class="category-header">
                    <span class="category-icon">✨</span>
                    <span class="category-name">Додаткові послуги</span>
                    <span class="category-amount">${Math.round(budgetBreakdown.additional.total).toLocaleString()} грн</span>
                    <span class="category-percentage">${((budgetBreakdown.additional.total / totalWeddingCost) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              ${Math.abs(budgetBreakdown.adjustments.total) > 3000 ? `
                <div class="breakdown-item adjustments ${budgetBreakdown.adjustments.total >= 0 ? 'positive' : 'negative'}">
                  <div class="category-content">
                    <div class="category-header">
                      <span class="category-icon">${budgetBreakdown.adjustments.total >= 0 ? '📈' : '📉'}</span>
                      <span class="category-name">Корекція за локацією та сезоном</span>
                      <span class="category-amount">${budgetBreakdown.adjustments.total >= 0 ? '+' : ''}${Math.round(budgetBreakdown.adjustments.total).toLocaleString()} грн</span>
                      <span class="category-percentage">(${Math.abs((budgetBreakdown.adjustments.total / totalWeddingCost) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="cost-savings insight-card">
          <h4>💡 Топ можливостей для економії</h4>
          <div class="savings-cards">
            ${costSavings.map((saving, index) => `
              <div class="saving-card rank-${index + 1}">
                <div class="saving-rank">#${index + 1}</div>
                <div class="saving-content">
                  <div class="saving-category">${saving.category}</div>
                  <div class="saving-suggestion">${saving.suggestion}</div>
                  <div class="saving-amount">
                    <span class="save-label">Потенційна економія:</span>
                    <span class="save-value">${Math.round(saving.savings).toLocaleString()} грн</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="total-savings-summary">
            <div class="summary-content">
              <span class="summary-label">💰 Загальна потенційна економія:</span>
              <span class="summary-amount">${Math.round(costSavings.reduce((sum, saving) => sum + saving.savings, 0)).toLocaleString()} грн</span>
            </div>
            <div class="summary-subtitle">Ваш бюджет може бути всього ${Math.round(totalWeddingCost - costSavings.reduce((sum, saving) => sum + saving.savings, 0)).toLocaleString()} грн</div>
          </div>
        </div>

        <div class="wedding-planning-guide insight-card">
          <h4>📋 Гід по плануванню весілля</h4>
          <div class="guide-tabs">
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">💳</span>
                <h5>Управління бюджетом</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">✅</span> Відкладіть 5-10% на непередбачені витрати</li>
                <li><span class="tip-icon">🎯</span> Визначте пріоритети: "обов'язково" проти "було б добре"</li>
                <li><span class="tip-icon">📝</span> Отримайте всі кошториси письмово</li>
                <li><span class="tip-icon">📊</span> Відстежуйте витрати в таблиці</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">💰</span>
                <h5>Стратегії економії</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">📅</span> Оберіть п'ятницю або неділю для економії 10-30%</li>
                <li><span class="tip-icon">🍂</span> Бронюйте в низький сезон</li>
                <li><span class="tip-icon">🥐</span> Розгляньте сніданок або обідній прийом</li>
                <li><span class="tip-icon">🍷</span> Обмежте години відкритого бару</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">⏰</span>
                <h5>Терміни та бронювання</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">🏰</span> Бронюйте місце за 12-18 місяців наперед</li>
                <li><span class="tip-icon">📸</span> Бронюйте фотографа за 6-12 місяців наперед</li>
                <li><span class="tip-icon">👗</span> Замовляйте сукню за 6-8 місяців наперед</li>
                <li><span class="tip-icon">💌</span> Надсилайте запрошення за 6-8 тижнів до весілля</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <div class="section-header">
                <span class="section-icon">⚠️</span>
                <h5>Приховані витрати для врахування</h5>
              </div>
              <ul class="guide-list">
                <li><span class="tip-icon">💝</span> Чайові для постачальників (10-20%)</li>
                <li><span class="tip-icon">📋</span> Сервісні збори та податки</li>
                <li><span class="tip-icon">🍽️</span> Харчування персоналу під час заходу</li>
                <li><span class="tip-icon">⏱️</span> Штрафи за понаднормовий час</li>
                <li><span class="tip-icon">📜</span> Свідоцтво про шлюб та церемоніймейстер</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="budget-guidelines insight-card">
          <h4>📊 Рекомендації щодо розподілу бюджету</h4>
          <div class="guidelines-comparison">
            <div class="guideline-header">
              <span>Категорія</span>
              <span>Типовий діапазон</span>
              <span>Ваш розподіл</span>
              <span>Статус</span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">🏰 Банкет та кейтеринг</span>
              <span class="typical-range">40-50%</span>
              <span class="your-allocation">${((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100), 40, 50)}">
                ${getStatusIcon(((budgetBreakdown.venueCatering.total / totalWeddingCost) * 100), 40, 50)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">📸 Фото та відео</span>
              <span class="typical-range">10-15%</span>
              <span class="your-allocation">${((budgetBreakdown.photography.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.photography.total / totalWeddingCost) * 100), 10, 15)}">
                ${getStatusIcon(((budgetBreakdown.photography.total / totalWeddingCost) * 100), 10, 15)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">👗 Одяг та краса</span>
              <span class="typical-range">8-10%</span>
              <span class="your-allocation">${((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100), 8, 10)}">
                ${getStatusIcon(((budgetBreakdown.attireBeauty.total / totalWeddingCost) * 100), 8, 10)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">🌸 Квіти та декорації</span>
              <span class="typical-range">8-10%</span>
              <span class="your-allocation">${((budgetBreakdown.flowers.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.flowers.total / totalWeddingCost) * 100), 8, 10)}">
                ${getStatusIcon(((budgetBreakdown.flowers.total / totalWeddingCost) * 100), 8, 10)}
              </span>
            </div>
            
            <div class="guideline-row">
              <span class="category-name">🎵 Музика та розваги</span>
              <span class="typical-range">8-10%</span>
              <span class="your-allocation">${((budgetBreakdown.music.total / totalWeddingCost) * 100).toFixed(1)}%</span>
              <span class="status ${getStatusClass(((budgetBreakdown.music.total / totalWeddingCost) * 100), 8, 10)}">
                ${getStatusIcon(((budgetBreakdown.music.total / totalWeddingCost) * 100), 8, 10)}
              </span>
            </div>
          </div>
        </div>

        <div class="next-steps insight-card">
          <h4>🎯 Наступні кроки</h4>
          <div class="steps-checklist">
            <div class="step-item">
              <span class="step-number">1</span>
              <span class="step-text">Визначте пріоритети та встановіть реалістичний бюджет</span>
            </div>
            <div class="step-item">
              <span class="step-number">2</span>
              <span class="step-text">Почніть з вибору місця - це впливає на всі інші рішення</span>
            </div>
            <div class="step-item">
              <span class="step-number">3</span>
              <span class="step-text">Отримайте кошториси від кількох постачальників у кожній категорії</span>
            </div>
            <div class="step-item">
              <span class="step-number">4</span>
              <span class="step-text">Розгляньте можливості економії, що відповідають вашому баченню</span>
            </div>
            <div class="step-item">
              <span class="step-number">5</span>
              <span class="step-text">Закладіть буфер 5-10% на непередбачені витрати</span>
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
    if (value >= min && value <= max) return '✅ Оптимально';
    if (value < min) return '⬇️ Нижче';
    return '⬆️ Вище';
  }

  function getWeddingCategory(cost) {
    if (cost < 450000) return "Бюджетне весілля";
    if (cost < 750000) return "Невелике весілля";
    if (cost < 1200000) return "Середнє весілля";
    if (cost < 1800000) return "Велике весілля";
    return "Розкішне весілля";
  }

  function getWeddingStyleName(style) {
    const names = {
      'budget': 'Бюджетне',
      'casual': 'Неформальне',
      'traditional': 'Традиційне',
      'upscale': 'Елегантне',
      'luxury': 'Розкішне',
      'destination': 'За кордоном'
    };
    return names[style] || 'Традиційне';
  }

  function getLocationName(location) {
    const names = {
      'rural': 'Сільська місцевість',
      'suburban': 'Приміський район',
      'urban': 'Місто',
      'major-city': 'Мегаполіс',
      'destination': 'Курорт'
    };
    return names[location] || 'Приміський район';
  }
});