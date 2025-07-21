document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("moving-cost-form");
  const resultDiv = document.getElementById("moving-cost-result");
  const homeSizeSelect = document.getElementById("home-size");
  const customSizeDiv = document.getElementById("custom-size");

  // Show/hide custom size inputs
  homeSizeSelect.addEventListener("change", function() {
    if (this.value === "custom") {
      customSizeDiv.style.display = "block";
    } else {
      customSizeDiv.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateMovingCosts();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['move-distance', 'home-size', 'move-type'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateMovingCosts();
      }
    });
    document.getElementById(id).addEventListener("change", function () {
      if (validateInputs()) {
        calculateMovingCosts();
      }
    });
  });

  function validateInputs() {
    const distance = parseFloat(document.getElementById("move-distance").value);
    const familySize = parseFloat(document.getElementById("family-size").value);
    
    return distance > 0 && familySize > 0;
  }

  function calculateMovingCosts() {
    // Get inputs
    const moveDistance = parseFloat(document.getElementById("move-distance").value) || 0;
    const homeSize = document.getElementById("home-size").value;
    const estimatedWeight = parseFloat(document.getElementById("estimated-weight").value) || 0;
    const cubicFeet = parseFloat(document.getElementById("cubic-feet").value) || 0;
    const moveType = document.getElementById("move-type").value;
    const familySize = parseFloat(document.getElementById("family-size").value) || 1;
    const travelDays = parseFloat(document.getElementById("travel-days").value) || 1;
    const hotelNights = parseFloat(document.getElementById("hotel-nights").value) || 0;
    const pets = parseFloat(document.getElementById("pets").value) || 0;
    const moveSeason = document.getElementById("move-season").value;
    const flexibility = document.getElementById("flexibility").value;
    const insuranceLevel = document.getElementById("insurance-level").value;
    const originCityType = document.getElementById("origin-city-type").value;
    const destinationCityType = document.getElementById("destination-city-type").value;
    
    // Services
    const packingService = document.getElementById("packing-service").checked;
    const unpackingService = document.getElementById("unpacking-service").checked;
    const storageService = document.getElementById("storage-service").checked;
    const applianceService = document.getElementById("appliance-service").checked;
    const specialtyItems = document.getElementById("specialty-items").checked;
    const autoTransport = document.getElementById("auto-transport").checked;

    if (moveDistance <= 0 || familySize <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid distance and family size.</p>';
      return;
    }

    // Calculate home size metrics
    const sizeMetrics = getHomeSizeMetrics(homeSize, estimatedWeight, cubicFeet);
    
    // Calculate base moving cost by type
    const baseCost = calculateBaseCost(moveType, moveDistance, sizeMetrics);
    
    // Apply service add-ons
    const servicesCost = calculateServicesCosts(
      moveType, sizeMetrics, packingService, unpackingService, storageService, 
      applianceService, specialtyItems, autoTransport
    );
    
    // Apply timing and flexibility adjustments
    const timingMultiplier = getTimingMultiplier(moveSeason, flexibility);
    
    // Apply location adjustments
    const locationMultiplier = getLocationMultiplier(originCityType, destinationCityType);
    
    // Calculate insurance costs
    const insuranceCost = calculateInsuranceCost(insuranceLevel, sizeMetrics);
    
    // Calculate travel and lodging costs
    const travelCosts = calculateTravelCosts(moveDistance, familySize, travelDays, hotelNights, pets, moveType);
    
    // Calculate total moving cost
    const movingServicesTotal = (baseCost + servicesCost) * timingMultiplier * locationMultiplier;
    const totalMovingCost = movingServicesTotal + insuranceCost + travelCosts.total;
    
    // Calculate alternative scenarios
    const alternatives = calculateAlternatives(moveDistance, sizeMetrics, timingMultiplier, locationMultiplier);

    displayResults({
      moveDistance,
      homeSize,
      sizeMetrics,
      moveType,
      baseCost,
      servicesCost,
      timingMultiplier,
      locationMultiplier,
      insuranceCost,
      travelCosts,
      movingServicesTotal,
      totalMovingCost,
      alternatives,
      services: {
        packing: packingService,
        unpacking: unpackingService,
        storage: storageService,
        appliances: applianceService,
        specialty: specialtyItems,
        auto: autoTransport
      }
    });
  }

  function getHomeSizeMetrics(homeSize, customWeight, customCubicFeet) {
    const standardSizes = {
      'studio': { weight: 2500, cubicFeet: 400, rooms: 1 },
      '1-bedroom': { weight: 4000, cubicFeet: 600, rooms: 1 },
      '2-bedroom': { weight: 6500, cubicFeet: 900, rooms: 2 },
      '3-bedroom': { weight: 9000, cubicFeet: 1200, rooms: 3 },
      '4-bedroom': { weight: 12000, cubicFeet: 1500, rooms: 4 }
    };

    if (homeSize === 'custom') {
      return {
        weight: customWeight || 8000,
        cubicFeet: customCubicFeet || 1000,
        rooms: Math.ceil((customCubicFeet || 1000) / 400)
      };
    }

    return standardSizes[homeSize] || standardSizes['2-bedroom'];
  }

  function calculateBaseCost(moveType, distance, sizeMetrics) {
    const { weight, cubicFeet, rooms } = sizeMetrics;

    switch (moveType) {
      case 'full-service':
        // Professional movers: $0.50-1.50 per pound + $1.50-2.50 per mile
        const weightCost = weight * 1.0;
        const distanceCost = distance * 2.0;
        return weightCost + distanceCost;

      case 'container':
        // Moving container: based on container size and distance
        const containersNeeded = Math.ceil(cubicFeet / 800); // 800 cubic feet per container
        const containerCost = containersNeeded * (800 + distance * 1.2);
        return containerCost;

      case 'truck-rental':
        // DIY truck rental: truck + gas + equipment
        const truckSize = cubicFeet <= 600 ? 'small' : cubicFeet <= 1000 ? 'medium' : 'large';
        const truckCosts = {
          'small': { daily: 30, mileage: 1.50, deposit: 150 },
          'medium': { daily: 40, mileage: 2.00, deposit: 200 },
          'large': { daily: 50, mileage: 2.50, deposit: 250 }
        };
        const truck = truckCosts[truckSize];
        const rentalDays = Math.ceil(distance / 500) + 2; // Travel days + loading/unloading
        return (truck.daily * rentalDays) + (truck.mileage * distance) + truck.deposit;

      case 'freight':
        // Freight shipping: per cubic foot + handling
        return cubicFeet * 1.50 + distance * 0.75;

      case 'hybrid':
        // Labor + truck rental
        const hybridTruck = calculateBaseCost('truck-rental', distance, sizeMetrics);
        const laborCost = rooms * 400; // Loading/unloading labor
        return hybridTruck + laborCost;

      default:
        return 2000; // Default estimate
    }
  }

  function calculateServicesCosts(moveType, sizeMetrics, packing, unpacking, storage, appliances, specialty, auto) {
    let servicesCost = 0;
    const { weight, rooms } = sizeMetrics;

    if (packing) {
      servicesCost += moveType === 'full-service' ? rooms * 300 : rooms * 200;
    }

    if (unpacking) {
      servicesCost += moveType === 'full-service' ? rooms * 200 : rooms * 150;
    }

    if (storage) {
      // 1-2 months storage
      const storageSize = Math.ceil(weight / 1000); // Storage units needed
      servicesCost += storageSize * 180; // $90/month average * 2 months
    }

    if (appliances) {
      servicesCost += 400; // Disconnect/reconnect major appliances
    }

    if (specialty) {
      servicesCost += 800; // Piano, artwork, antiques handling
    }

    if (auto) {
      servicesCost += 1200; // Vehicle transport across country
    }

    return servicesCost;
  }

  function getTimingMultiplier(season, flexibility) {
    let multiplier = 1.0;

    // Season adjustments
    if (season === 'peak') {
      multiplier *= 1.25; // 25% premium for peak season
    }

    // Flexibility adjustments
    switch (flexibility) {
      case 'flexible':
        multiplier *= 0.85; // 15% savings for flexible dates
        break;
      case 'specific':
        // No adjustment
        break;
      case 'rush':
        multiplier *= 1.50; // 50% premium for rush moves
        break;
    }

    return multiplier;
  }

  function getLocationMultiplier(origin, destination) {
    const cityMultipliers = {
      'major': 1.20,    // 20% premium for major cities
      'medium': 1.00,   // Baseline
      'small': 0.90     // 10% savings for small towns
    };

    const originMultiplier = cityMultipliers[origin] || 1.0;
    const destinationMultiplier = cityMultipliers[destination] || 1.0;

    // Average the origin and destination multipliers
    return (originMultiplier + destinationMultiplier) / 2;
  }

  function calculateInsuranceCost(level, sizeMetrics) {
    const { weight } = sizeMetrics;
    const estimatedValue = weight * 5; // $5 per pound estimated value

    switch (level) {
      case 'basic':
        return 0; // Basic coverage is free

      case 'declared':
        return weight * 0.10; // $0.10 per pound for declared value

      case 'full':
        return estimatedValue * 0.025; // 2.5% of declared value

      default:
        return 0;
    }
  }

  function calculateTravelCosts(distance, familySize, travelDays, hotelNights, pets, moveType) {
    // Gas costs (assuming family drives separately or with truck)
    const avgMPG = moveType === 'truck-rental' ? 8 : 25;
    const gasPrice = 3.50; // Average gas price
    const gasCost = (distance / avgMPG) * gasPrice;

    // Hotel costs
    const avgHotelRate = 120; // Per night
    const hotelCost = hotelNights * avgHotelRate;

    // Meal costs
    const mealsPerDay = 3;
    const avgMealCost = 15; // Per person per meal
    const mealCost = travelDays * mealsPerDay * avgMealCost * familySize;

    // Pet costs
    const petCost = pets * 200; // Pet-friendly hotels, health certificates, etc.

    // Miscellaneous travel expenses
    const miscCost = 200;

    const total = gasCost + hotelCost + mealCost + petCost + miscCost;

    return {
      gas: gasCost,
      hotel: hotelCost,
      meals: mealCost,
      pets: petCost,
      misc: miscCost,
      total: total
    };
  }

  function calculateAlternatives(distance, sizeMetrics, timingMultiplier, locationMultiplier) {
    const alternatives = [];
    const moveTypes = ['full-service', 'container', 'truck-rental', 'freight', 'hybrid'];

    moveTypes.forEach(type => {
      const baseCost = calculateBaseCost(type, distance, sizeMetrics);
      const adjustedCost = baseCost * timingMultiplier * locationMultiplier;
      
      alternatives.push({
        type: type,
        cost: adjustedCost,
        description: getMoveTypeDescription(type)
      });
    });

    return alternatives.sort((a, b) => a.cost - b.cost);
  }

  function getMoveTypeDescription(type) {
    const descriptions = {
      'full-service': 'Professional movers handle everything',
      'container': 'Portable storage containers (PODS, U-Pack)',
      'truck-rental': 'DIY truck rental (you pack, load, drive)',
      'freight': 'Freight/LTL shipping (palletized goods)',
      'hybrid': 'You rent truck, hire labor for loading'
    };
    return descriptions[type] || type;
  }

  function displayResults(data) {
    const {
      moveDistance,
      homeSize,
      sizeMetrics,
      moveType,
      baseCost,
      servicesCost,
      timingMultiplier,
      locationMultiplier,
      insuranceCost,
      travelCosts,
      movingServicesTotal,
      totalMovingCost,
      alternatives,
      services
    } = data;

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>📦 Cross-Country Moving Cost Estimate</h3>
        
        <div class="move-summary">
          <h4>Move Summary</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Distance:</span>
              <span class="value">${moveDistance.toLocaleString()} miles</span>
            </div>
            <div class="summary-item">
              <span class="label">Home Size:</span>
              <span class="value">${homeSize.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div class="summary-item">
              <span class="label">Estimated Weight:</span>
              <span class="value">${sizeMetrics.weight.toLocaleString()} lbs</span>
            </div>
            <div class="summary-item">
              <span class="label">Moving Method:</span>
              <span class="value">${getMoveTypeDescription(moveType)}</span>
            </div>
          </div>
        </div>

        <div class="cost-breakdown">
          <h4>💰 Cost Breakdown</h4>
          <div class="breakdown-grid">
            <div class="breakdown-item">
              <span class="category">Base Moving Cost:</span>
              <span class="amount">$${baseCost.toLocaleString()}</span>
            </div>
            ${servicesCost > 0 ? `
              <div class="breakdown-item">
                <span class="category">Additional Services:</span>
                <span class="amount">$${servicesCost.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="breakdown-item">
              <span class="category">Timing/Season Adjustment:</span>
              <span class="amount">${((timingMultiplier - 1) * 100).toFixed(0)}%</span>
            </div>
            <div class="breakdown-item">
              <span class="category">Location Adjustment:</span>
              <span class="amount">${((locationMultiplier - 1) * 100).toFixed(0)}%</span>
            </div>
            <div class="breakdown-item total">
              <span class="category">Moving Services Total:</span>
              <span class="amount">$${movingServicesTotal.toLocaleString()}</span>
            </div>
            ${insuranceCost > 0 ? `
              <div class="breakdown-item">
                <span class="category">Insurance:</span>
                <span class="amount">$${insuranceCost.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="breakdown-item">
              <span class="category">Travel & Lodging:</span>
              <span class="amount">$${travelCosts.total.toLocaleString()}</span>
            </div>
            <div class="breakdown-item grand-total highlight">
              <span class="category">Total Moving Cost:</span>
              <span class="amount">$${totalMovingCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="travel-breakdown">
          <h4>🚗 Travel & Lodging Breakdown</h4>
          <div class="travel-grid">
            <div class="travel-item">
              <span class="expense">Gas/Fuel:</span>
              <span class="cost">$${travelCosts.gas.toFixed(0)}</span>
            </div>
            ${travelCosts.hotel > 0 ? `
              <div class="travel-item">
                <span class="expense">Hotels:</span>
                <span class="cost">$${travelCosts.hotel.toFixed(0)}</span>
              </div>
            ` : ''}
            <div class="travel-item">
              <span class="expense">Meals:</span>
              <span class="cost">$${travelCosts.meals.toFixed(0)}</span>
            </div>
            ${travelCosts.pets > 0 ? `
              <div class="travel-item">
                <span class="expense">Pet Expenses:</span>
                <span class="cost">$${travelCosts.pets.toFixed(0)}</span>
              </div>
            ` : ''}
            <div class="travel-item">
              <span class="expense">Miscellaneous:</span>
              <span class="cost">$${travelCosts.misc.toFixed(0)}</span>
            </div>
          </div>
        </div>

        ${Object.values(services).some(service => service) ? `
          <div class="services-included">
            <h4>✅ Additional Services Included</h4>
            <ul>
              ${services.packing ? '<li>Professional Packing</li>' : ''}
              ${services.unpacking ? '<li>Professional Unpacking</li>' : ''}
              ${services.storage ? '<li>Temporary Storage (1-2 months)</li>' : ''}
              ${services.appliances ? '<li>Appliance Disconnect/Connect</li>' : ''}
              ${services.specialty ? '<li>Specialty Items Handling</li>' : ''}
              ${services.auto ? '<li>Vehicle Transport</li>' : ''}
            </ul>
          </div>
        ` : ''}

        <div class="alternatives-comparison">
          <h4>🔄 Alternative Moving Options</h4>
          <div class="alternatives-grid">
            ${alternatives.map(alt => `
              <div class="alternative ${alt.type === moveType ? 'selected' : ''}">
                <h5>${alt.description}</h5>
                <p class="alt-cost">$${alt.cost.toLocaleString()}</p>
                <p class="savings">${alt.type === moveType ? 'Current Selection' : 
                  alt.cost < movingServicesTotal ? 
                    `Save $${(movingServicesTotal - alt.cost).toLocaleString()}` : 
                    `+$${(alt.cost - movingServicesTotal).toLocaleString()}`}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="cost-saving-tips">
          <h4>💡 Ways to Reduce Moving Costs</h4>
          <ul>
            <li><strong>Declutter First:</strong> Sell/donate items to reduce weight and volume</li>
            <li><strong>Get Multiple Quotes:</strong> Compare at least 3 estimates from different companies</li>
            <li><strong>Move Off-Peak:</strong> Avoid summer months and end/beginning of month</li>
            <li><strong>Pack Yourself:</strong> Pack non-fragile items to save on labor costs</li>
            <li><strong>Be Flexible:</strong> Allow movers to choose delivery dates for savings</li>
            <li><strong>Use Your Own Boxes:</strong> Source free boxes from liquor stores, grocery stores</li>
            <li><strong>Compare Insurance:</strong> Check if homeowner's policy covers moving damage</li>
          </ul>
        </div>

        <div class="moving-timeline">
          <h4>📅 Moving Timeline Checklist</h4>
          <ul>
            <li><strong>8 Weeks Before:</strong> Get quotes, book movers, notify employers</li>
            <li><strong>6 Weeks Before:</strong> Start decluttering, order packing supplies</li>
            <li><strong>4 Weeks Before:</strong> Confirm move details, arrange time off work</li>
            <li><strong>2 Weeks Before:</strong> Confirm utilities, update address with banks</li>
            <li><strong>1 Week Before:</strong> Pack non-essentials, confirm arrival details</li>
            <li><strong>Moving Day:</strong> Do final walkthrough, inventory items, tip movers</li>
          </ul>
        </div>

        <div class="important-notes">
          <h4>📝 Important Considerations</h4>
          <ul>
            <li><strong>Binding vs. Non-Binding:</strong> Understand quote types and potential price changes</li>
            <li><strong>Licensed Movers:</strong> Verify USDOT number for interstate moves</li>
            <li><strong>Inventory List:</strong> Create detailed inventory for insurance purposes</li>
            <li><strong>Peak Season:</strong> Summer moves cost 20-30% more than off-season</li>
            <li><strong>Hidden Fees:</strong> Ask about stairs, elevator, long carry charges</li>
            <li><strong>Delivery Window:</strong> Cross-country moves may have 1-3 week delivery windows</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>📋 Next Steps</h4>
          <ul>
            <li>Get in-home estimates from 3+ licensed moving companies</li>
            <li>Check Better Business Bureau ratings and online reviews</li>
            <li>Verify mover's insurance and licensing status</li>
            <li>Read all contract terms carefully before signing</li>
            <li>Plan for additional costs like utility deposits and temporary lodging</li>
            <li>Keep important documents and valuables with you during the move</li>
          </ul>
        </div>
      </div>
    `;
  }
});