document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("wedding-cost-form");
  const resultDiv = document.getElementById("wedding-cost-result");

  if (form && resultDiv) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      calculateWeddingCosts();
    });

    // Auto-calculate when key inputs change
    const keyInputs = ['guest-count', 'wedding-style', 'location-type'];
    keyInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("input", function () {
          if (validateInputs()) {
            calculateWeddingCosts();
          }
        });
        element.addEventListener("change", function () {
          if (validateInputs()) {
            calculateWeddingCosts();
          }
        });
      }
    });
  }

  function validateInputs() {
    const guestCount = parseFloat(document.getElementById("guest-count")?.value);
    return guestCount > 0;
  }

  function calculateWeddingCosts() {
    // Get inputs
    const guestCount = parseFloat(document.getElementById("guest-count")?.value) || 0;
    const weddingStyle = document.getElementById("wedding-style")?.value;
    const locationType = document.getElementById("location-type")?.value;
    const weddingSeason = document.getElementById("wedding-season")?.value;
    const venueType = document.getElementById("venue-type")?.value;
    const cateringStyle = document.getElementById("catering-style")?.value;
    const barService = document.getElementById("bar-service")?.value;
    const photographyLevel = document.getElementById("photography-level")?.value;
    const videography = document.getElementById("videography")?.value;
    const flowersLevel = document.getElementById("flowers-level")?.value;
    const musicEntertainment = document.getElementById("music-entertainment")?.value;
    const dressBudget = document.getElementById("dress-budget")?.value;
    const groomAttire = document.getElementById("groom-attire")?.value;
    const beautyServices = document.getElementById("beauty-services")?.value;
    
    // Additional options
    const weddingPlanner = document.getElementById("wedding-planner")?.checked || false;
    const transportation = document.getElementById("transportation")?.checked || false;
    const favors = document.getElementById("favors")?.checked || false;
    const welcomeBags = document.getElementById("welcome-bags")?.checked || false;
    const rehearsalDinner = document.getElementById("rehearsal-dinner")?.checked || false;
    const dayAfterBrunch = document.getElementById("day-after-brunch")?.checked || false;

    if (guestCount <= 0) {
      resultDiv.innerHTML = '<div class="error">Будь ласка, введіть правильну кількість гостей.</div>';
      return;
    }

    // Calculate base cost per guest (in UAH)
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
    const seasonMultiplier = weddingSeason === 'peak' ? 1.25 : weddingSeason === 'off-peak' ? 0.85 : 1.0;
    const locationMultiplier = getLocationMultiplier(locationType);
    
    // Calculate total costs
    const subtotalBeforeMultipliers = venueCateringCosts.total + photographyCosts.total + 
                                     flowersCosts.total + musicCosts.total + 
                                     attireBeautyCosts.total + additionalCosts.total;
    
    const totalWeddingCost = subtotalBeforeMultipliers * seasonMultiplier * locationMultiplier;
    
    // Calculate cost per guest
    const costPerGuest = totalWeddingCost / guestCount;
    
    displayResults({
      guestCount,
      weddingStyle,
      locationType,
      weddingSeason,
      venueCateringCosts,
      photographyCosts,
      flowersCosts,
      musicCosts,
      attireBeautyCosts,
      additionalCosts,
      subtotalBeforeMultipliers,
      seasonMultiplier,
      locationMultiplier,
      totalWeddingCost,
      costPerGuest
    });
  }

  function getBasePerGuestCost(style, location) {
    const baseCosts = {
      'budget': { 'rural': 1000, 'urban': 1200, 'big-city': 1500 },
      'mid-range': { 'rural': 1500, 'urban': 2000, 'big-city': 2500 },
      'luxury': { 'rural': 2500, 'urban': 3500, 'big-city': 5000 },
      'ultra-luxury': { 'rural': 4000, 'urban': 6000, 'big-city': 8000 }
    };
    return baseCosts[style]?.[location] || 1500;
  }

  function getLocationMultiplier(location) {
    const multipliers = {
      'rural': 0.8,
      'urban': 1.0,
      'big-city': 1.3
    };
    return multipliers[location] || 1.0;
  }

  function calculateVenueCatering(guests, venue, catering, bar, basePerGuest) {
    const venueMultipliers = {
      'hotel': 1.2,
      'restaurant': 1.0,
      'banquet-hall': 0.9,
      'outdoor': 0.8,
      'home': 0.6,
      'church': 0.7
    };

    const cateringMultipliers = {
      'buffet': 0.8,
      'plated': 1.0,
      'family-style': 0.9,
      'cocktail': 0.7,
      'food-trucks': 0.6
    };

    const barMultipliers = {
      'open-bar': 1.3,
      'beer-wine': 1.1,
      'signature-cocktails': 1.2,
      'cash-bar': 0.8,
      'no-alcohol': 0.7
    };

    const venueMultiplier = venueMultipliers[venue] || 1.0;
    const cateringMultiplier = cateringMultipliers[catering] || 1.0;
    const barMultiplier = barMultipliers[bar] || 1.0;

    const baseCost = basePerGuest * guests;
    const venueCost = baseCost * 0.4 * venueMultiplier;
    const foodCost = baseCost * 0.3 * cateringMultiplier;
    const drinksCost = baseCost * 0.2 * barMultiplier;

    return {
      venue: venueCost,
      food: foodCost,
      drinks: drinksCost,
      total: venueCost + foodCost + drinksCost
    };
  }

  function calculatePhotography(photography, videography) {
    const photographyCosts = {
      'budget': 15000,
      'mid-range': 30000,
      'premium': 50000,
      'luxury': 80000
    };

    const videographyCosts = {
      'none': 0,
      'basic': 20000,
      'cinematic': 40000,
      'luxury': 70000
    };

    const photoCost = photographyCosts[photography] || 30000;
    const videoCost = videographyCosts[videography] || 0;

    return {
      photography: photoCost,
      videography: videoCost,
      total: photoCost + videoCost
    };
  }

  function calculateFlowers(level, guests) {
    const flowersBase = {
      'minimal': 100,
      'moderate': 200,
      'elaborate': 400,
      'luxury': 600
    };

    const perGuestCost = flowersBase[level] || 200;
    const total = perGuestCost * guests;

    return {
      flowers: total,
      total: total
    };
  }

  function calculateMusic(entertainment) {
    const entertainmentCosts = {
      'dj': 8000,
      'band': 25000,
      'live-musician': 15000,
      'playlist': 2000,
      'orchestra': 50000
    };

    const cost = entertainmentCosts[entertainment] || 8000;

    return {
      entertainment: cost,
      total: cost
    };
  }

  function calculateAttireBeauty(dress, groom, beauty) {
    const dressCosts = {
      'budget': 8000,
      'mid-range': 20000,
      'designer': 40000,
      'luxury': 80000
    };

    const groomCosts = {
      'rental': 3000,
      'purchase': 8000,
      'designer': 20000,
      'luxury': 40000
    };

    const beautyCosts = {
      'diy': 2000,
      'salon': 5000,
      'professional': 8000,
      'luxury': 15000
    };

    const dressTotal = dressCosts[dress] || 20000;
    const groomTotal = groomCosts[groom] || 8000;
    const beautyTotal = beautyCosts[beauty] || 5000;

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
      costs.planner = options.basePerGuestCost * options.guestCount * 0.15;
      total += costs.planner;
    }

    if (options.transportation) {
      costs.transportation = 5000;
      total += costs.transportation;
    }

    if (options.favors) {
      costs.favors = options.guestCount * 100;
      total += costs.favors;
    }

    if (options.welcomeBags) {
      costs.welcomeBags = options.guestCount * 200;
      total += costs.welcomeBags;
    }

    if (options.rehearsalDinner) {
      costs.rehearsalDinner = options.guestCount * 300;
      total += costs.rehearsalDinner;
    }

    if (options.dayAfterBrunch) {
      costs.dayAfterBrunch = options.guestCount * 250;
      total += costs.dayAfterBrunch;
    }

    return {
      ...costs,
      total: total
    };
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function getStyleDescription(style) {
    const descriptions = {
      'budget': 'Економний',
      'mid-range': 'Середній',
      'luxury': 'Розкішний',
      'ultra-luxury': 'Ультра-розкішний'
    };
    return descriptions[style] || style;
  }

  function getLocationDescription(location) {
    const descriptions = {
      'rural': 'Сільська місцевість',
      'urban': 'Місто',
      'big-city': 'Великі міста (Київ, Львів, Одеса)'
    };
    return descriptions[location] || location;
  }

  function getSeasonDescription(season) {
    const descriptions = {
      'peak': 'Пікові місяці (травень-вересень)',
      'shoulder': 'Середні місяці',
      'off-peak': 'Низький сезон (грудень-лютий)'
    };
    return descriptions[season] || season;
  }

  function displayResults(data) {
    const seasonText = data.seasonMultiplier > 1 ? 'Пікові місяці (+25%)' : 
                      data.seasonMultiplier < 1 ? 'Низький сезон (-15%)' : 'Середні місяці';
    
    const locationText = data.locationMultiplier > 1 ? 'Велике місто (+30%)' : 
                         data.locationMultiplier < 1 ? 'Сільська місцевість (-20%)' : 'Міська місцевість';

    resultDiv.innerHTML = `
      <div class="insight-card">
        <h3 style="text-align: center; margin-bottom: 1.5rem; color: #2c3e50;">
          💒 Розрахунок вартості весілля
        </h3>
        
        <div style="text-align: center; margin: 1rem 0;">
          <div style="font-size: 3rem; font-weight: bold; color: #e91e63; margin-bottom: 0.5rem;">
            ${formatCurrency(data.totalWeddingCost)}
          </div>
          <div style="font-size: 1.2rem; color: #666; margin-bottom: 1rem;">
            Загальна вартість весілля
          </div>
          <div style="font-size: 1rem; color: #888;">
            ${formatCurrency(data.costPerGuest)} на гостя (${data.guestCount} гостей)
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
          <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Стиль</div>
            <div style="font-size: 1rem; font-weight: bold; color: #495057;">
              ${getStyleDescription(data.weddingStyle)}
            </div>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Локація</div>
            <div style="font-size: 1rem; font-weight: bold; color: #495057;">
              ${getLocationDescription(data.locationType)}
            </div>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Сезон</div>
            <div style="font-size: 1rem; font-weight: bold; color: #495057;">
              ${getSeasonDescription(data.weddingSeason)}
            </div>
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h4 style="margin-bottom: 1rem; color: #495057;">💰 Детальний розклад витрат</h4>
        
        <div style="display: grid; gap: 0.8rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
            <div>
              <strong>🏛️ Банкетний зал та харчування</strong>
              <small style="display: block; color: #666;">Зал: ${formatCurrency(data.venueCateringCosts.venue)}, Їжа: ${formatCurrency(data.venueCateringCosts.food)}, Напої: ${formatCurrency(data.venueCateringCosts.drinks)}</small>
            </div>
            <div style="font-weight: bold; color: #495057;">
              ${formatCurrency(data.venueCateringCosts.total)}
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
            <div>
              <strong>📸 Фотографія та відеозйомка</strong>
              <small style="display: block; color: #666;">Фото: ${formatCurrency(data.photographyCosts.photography)}, Відео: ${formatCurrency(data.photographyCosts.videography)}</small>
            </div>
            <div style="font-weight: bold; color: #495057;">
              ${formatCurrency(data.photographyCosts.total)}
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
            <div>
              <strong>🌸 Квіти та декорації</strong>
            </div>
            <div style="font-weight: bold; color: #495057;">
              ${formatCurrency(data.flowersCosts.total)}
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
            <div>
              <strong>🎵 Музика та розваги</strong>
            </div>
            <div style="font-weight: bold; color: #495057;">
              ${formatCurrency(data.musicCosts.total)}
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
            <div>
              <strong>👗 Вбрання та краса</strong>
              <small style="display: block; color: #666;">Сукня: ${formatCurrency(data.attireBeautyCosts.dress)}, Наречений: ${formatCurrency(data.attireBeautyCosts.groom)}, Краса: ${formatCurrency(data.attireBeautyCosts.beauty)}</small>
            </div>
            <div style="font-weight: bold; color: #495057;">
              ${formatCurrency(data.attireBeautyCosts.total)}
            </div>
          </div>
          
          ${data.additionalCosts.total > 0 ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
              <div>
                <strong>🎁 Додаткові послуги</strong>
              </div>
              <div style="font-weight: bold; color: #495057;">
                ${formatCurrency(data.additionalCosts.total)}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div style="border-top: 2px solid #e9ecef; margin: 1rem 0; padding-top: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong>Проміжний підсумок:</strong>
            <strong>${formatCurrency(data.subtotalBeforeMultipliers)}</strong>
          </div>
          
          ${data.seasonMultiplier !== 1 || data.locationMultiplier !== 1 ? `
            <div style="font-size: 0.9rem; color: #666; margin: 0.5rem 0;">
              ${data.seasonMultiplier !== 1 ? `<div>Сезонні коригування: ${seasonText}</div>` : ''}
              ${data.locationMultiplier !== 1 ? `<div>Локаційні коригування: ${locationText}</div>` : ''}
            </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.2rem; font-weight: bold; color: #e91e63; padding: 1rem; background: #fce4ec; border-radius: 8px; margin-top: 1rem;">
            <span>Загальна вартість:</span>
            <span>${formatCurrency(data.totalWeddingCost)}</span>
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h4 style="margin-bottom: 1rem; color: #495057;">📊 Аналіз бюджету</h4>
        
        <div style="display: grid; gap: 1rem;">
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
            <strong style="color: #155724;">💡 Поради з економії</strong><br>
            <small style="color: #28a745;">
              • Розгляньте весілля у низький сезон для економії до 15%<br>
              • Буфет замість подачі по тарілках може заощадити 20%<br>
              • Спростіть квіткові композиції або використайте сезонні квіти
            </small>
          </div>
          
          <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
            <strong style="color: #856404;">⚠️ Резерв бюджету</strong><br>
            <small style="color: #d39e00;">
              Рекомендуємо додати 10-15% до розрахованої суми на непередбачені витрати: ${formatCurrency(data.totalWeddingCost * 0.125)}
            </small>
          </div>
          
          <div style="padding: 1rem; background: #d1ecf1; border-radius: 8px; border-left: 4px solid #17a2b8;">
            <strong style="color: #0c5460;">📈 Планування оплат</strong><br>
            <small style="color: #17a2b8;">
              • Зазвичай потрібно сплатити 25-50% авансу при бронюванні<br>
              • Розподіліть оплати протягом 6-12 місяців до весілля<br>
              • Залишіть 10% на останні тижні перед весіллям
            </small>
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h4 style="margin-bottom: 1rem; color: #495057;">🎯 Варіанти бюджету</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div style="text-align: center; padding: 1rem; background: #f0f9ff; border-radius: 12px; border: 2px solid #0ea5e9;">
            <div style="font-size: 0.9rem; color: #0369a1; margin-bottom: 0.5rem;">ЕКОНОМНИЙ</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #0369a1;">
              ${formatCurrency(data.totalWeddingCost * 0.7)}
            </div>
            <small style="color: #0369a1;">-30% від поточного</small>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #ecfdf5; border-radius: 12px; border: 2px solid #10b981;">
            <div style="font-size: 0.9rem; color: #047857; margin-bottom: 0.5rem;">ПОТОЧНИЙ</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #047857;">
              ${formatCurrency(data.totalWeddingCost)}
            </div>
            <small style="color: #047857;">Ваш розрахунок</small>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: #fef3c7; border-radius: 12px; border: 2px solid #f59e0b;">
            <div style="font-size: 0.9rem; color: #92400e; margin-bottom: 0.5rem;">РОЗКІШНИЙ</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #92400e;">
              ${formatCurrency(data.totalWeddingCost * 1.5)}
            </div>
            <small style="color: #92400e;">+50% від поточного</small>
          </div>
        </div>
      </div>

      <div class="insight-card" style="background: #f8f9fa; border-left: 4px solid #6c757d;">
        <p style="margin: 0; font-size: 0.9rem; color: #6c757d; font-style: italic;">
          <strong>Примітка:</strong> Ці розрахунки є приблизними та базуються на середніх цінах в Україні станом на 2024 рік. 
          Фактичні витрати можуть відрізнятися залежно від конкретних постачальників, регіону та індивідуальних вимог. 
          Рекомендуємо отримати детальні пропозиції від декількох постачальників для точного планування бюджету.
        </p>
      </div>
    `;
  }
});