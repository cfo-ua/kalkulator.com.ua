document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("travel-budget-form");
  const resultDiv = document.getElementById("travel-budget-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateTravelBudget();
  });

  // Auto-calculate when inputs change for better UX
  const inputs = form.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener("input", function () {
      if (validateInputs()) {
        calculateTravelBudget();
      }
    });
  });

  function validateInputs() {
    const duration = parseFloat(document.getElementById("trip-duration").value);
    const travelers = parseFloat(document.getElementById("travelers").value);
    return duration > 0 && travelers > 0;
  }

  function calculateTravelBudget() {
    // Get inputs
    const duration = parseFloat(document.getElementById("trip-duration").value) || 0;
    const travelers = parseFloat(document.getElementById("travelers").value) || 1;
    
    // Daily costs per person
    const accommodation = parseFloat(document.getElementById("accommodation").value) || 0;
    const food = parseFloat(document.getElementById("food").value) || 0;
    const transport = parseFloat(document.getElementById("transport").value) || 0;
    const activities = parseFloat(document.getElementById("activities").value) || 0;
    const miscellaneous = parseFloat(document.getElementById("miscellaneous").value) || 0;
    
    // One-time costs
    const flights = parseFloat(document.getElementById("flights").value) || 0;
    const visas = parseFloat(document.getElementById("visas").value) || 0;
    const gear = parseFloat(document.getElementById("gear").value) || 0;
    const emergencyBuffer = parseFloat(document.getElementById("emergency-buffer").value) || 0;

    if (duration <= 0 || travelers <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid trip duration and number of travelers.</p>';
      return;
    }

    // Calculate daily costs
    const dailyPerPerson = accommodation + food + transport + activities + miscellaneous;
    const dailyTotal = dailyPerPerson * travelers;
    
    // Calculate trip totals
    const totalDailyCosts = dailyTotal * duration;
    const totalOneTimeCosts = (flights + visas + gear) * travelers;
    const subtotal = totalDailyCosts + totalOneTimeCosts;
    const emergencyAmount = subtotal * (emergencyBuffer / 100);
    const grandTotal = subtotal + emergencyAmount;

    // Per person totals
    const totalPerPerson = grandTotal / travelers;
    const dailyBudgetPerPerson = dailyPerPerson;

    // Budget category classification
    let budgetCategory, budgetDescription, budgetTips;
    if (dailyBudgetPerPerson <= 25) {
      budgetCategory = "Ultra Budget Backpacker";
      budgetDescription = "Hostels, street food, free activities";
      budgetTips = ["Stay in hostel dorms", "Cook your own meals", "Use public transport", "Free walking tours"];
    } else if (dailyBudgetPerPerson <= 50) {
      budgetCategory = "Budget Backpacker";
      budgetDescription = "Mix of hostels/budget hotels, local food";
      budgetTips = ["Mix dorms and private rooms", "Eat local restaurants", "Use local transport", "Some paid activities"];
    } else if (dailyBudgetPerPerson <= 100) {
      budgetCategory = "Mid-Range Backpacker";
      budgetDescription = "Private rooms, restaurants, paid activities";
      budgetTips = ["Private hostel rooms", "Restaurant meals", "Taxis when needed", "Popular tours"];
    } else {
      budgetCategory = "Comfort Backpacker";
      budgetDescription = "Hotels, dining out, tours";
      budgetTips = ["Budget hotels", "All restaurant meals", "Convenient transport", "Multiple tours"];
    }

    // Regional cost comparison
    const regionalComparison = [
      { region: "Southeast Asia", cost: "$15-30/day", suitable: dailyBudgetPerPerson >= 15 && dailyBudgetPerPerson <= 60 },
      { region: "Central America", cost: "$20-40/day", suitable: dailyBudgetPerPerson >= 20 && dailyBudgetPerPerson <= 70 },
      { region: "Eastern Europe", cost: "$25-50/day", suitable: dailyBudgetPerPerson >= 25 && dailyBudgetPerPerson <= 80 },
      { region: "South America", cost: "$25-60/day", suitable: dailyBudgetPerPerson >= 25 && dailyBudgetPerPerson <= 90 },
      { region: "Western Europe", cost: "$50-100/day", suitable: dailyBudgetPerPerson >= 50 },
      { region: "Australia/New Zealand", cost: "$60-120/day", suitable: dailyBudgetPerPerson >= 60 }
    ];

    displayResults({
      duration,
      travelers,
      dailyPerPerson: dailyBudgetPerPerson,
      dailyTotal,
      totalDailyCosts,
      totalOneTimeCosts,
      emergencyAmount,
      grandTotal,
      totalPerPerson,
      budgetCategory,
      budgetDescription,
      budgetTips,
      regionalComparison,
      breakdown: {
        accommodation,
        food,
        transport,
        activities,
        miscellaneous,
        flights: flights * travelers,
        visas: visas * travelers,
        gear: gear * travelers
      }
    });
  }

  function displayResults(data) {
    const {
      duration,
      travelers,
      dailyPerPerson,
      dailyTotal,
      totalDailyCosts,
      totalOneTimeCosts,
      emergencyAmount,
      grandTotal,
      totalPerPerson,
      budgetCategory,
      budgetDescription,
      budgetTips,
      regionalComparison,
      breakdown
    } = data;

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🎒 Your Backpacking Budget</h3>
        
        <div class="budget-overview">
          <div class="budget-category">
            <h4>${budgetCategory}</h4>
            <p>${budgetDescription}</p>
            <div class="daily-budget">$${dailyPerPerson.toFixed(2)} per person per day</div>
          </div>
        </div>

        <div class="result-grid">
          <div class="result-item highlight">
            <span class="label">Total Trip Cost:</span>
            <span class="value">$${grandTotal.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Cost Per Person:</span>
            <span class="value">$${totalPerPerson.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Daily Budget (all travelers):</span>
            <span class="value">$${dailyTotal.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Trip Duration:</span>
            <span class="value">${duration} day${duration > 1 ? 's' : ''}</span>
          </div>
          <div class="result-item">
            <span class="label">Number of Travelers:</span>
            <span class="value">${travelers}</span>
          </div>
          <div class="result-item">
            <span class="label">Emergency Buffer:</span>
            <span class="value">$${emergencyAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="cost-breakdown">
          <h4>📊 Cost Breakdown</h4>
          <div class="breakdown-grid">
            <div class="breakdown-item">
              <span class="category">Daily Costs (${duration} days):</span>
              <span class="amount">$${totalDailyCosts.toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Accommodation: $${(breakdown.accommodation * travelers * duration).toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Food & Drinks: $${(breakdown.food * travelers * duration).toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Transportation: $${(breakdown.transport * travelers * duration).toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Activities: $${(breakdown.activities * travelers * duration).toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Miscellaneous: $${(breakdown.miscellaneous * travelers * duration).toFixed(2)}</span>
            </div>
            
            <div class="breakdown-item">
              <span class="category">One-time Costs:</span>
              <span class="amount">$${totalOneTimeCosts.toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Flights: $${breakdown.flights.toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Visas & Insurance: $${breakdown.visas.toFixed(2)}</span>
            </div>
            <div class="breakdown-sub">
              <span>• Gear & Equipment: $${breakdown.gear.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="regional-comparison">
          <h4>🌍 Your Budget vs. Popular Backpacking Regions</h4>
          <div class="regions-grid">
            ${regionalComparison.map(region => `
              <div class="region ${region.suitable ? 'suitable' : 'challenging'}">
                <strong>${region.region}</strong>
                <span class="region-cost">${region.cost}</span>
                <span class="suitability">${region.suitable ? '✅ Good fit' : '⚠️ May be tight'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="budget-tips">
          <h4>💡 Tips for Your Budget Level</h4>
          <ul>
            ${budgetTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>

        <div class="savings-suggestions">
          <h4>💰 Ways to Reduce Costs</h4>
          <ul>
            <li><strong>Accommodation:</strong> Choose hostel dorms over private rooms</li>
            <li><strong>Food:</strong> Cook in hostel kitchens, eat street food</li>
            <li><strong>Transport:</strong> Use overnight buses/trains, walk more</li>
            <li><strong>Activities:</strong> Look for free walking tours and hiking</li>
            <li><strong>General:</strong> Travel slower, avoid tourist traps</li>
          </ul>
        </div>

        <div class="packing-reminder">
          <h4>🎯 Don't Forget</h4>
          <ul>
            <li>Keep emergency funds separate from daily spending money</li>
            <li>Notify banks of your travel plans</li>
            <li>Research visa requirements early</li>
            <li>Consider travel insurance coverage limits</li>
            <li>Download offline maps and translation apps</li>
          </ul>
        </div>
      </div>
    `;
  }
});