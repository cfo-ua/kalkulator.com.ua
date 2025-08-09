document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("travel-insurance-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const destination = document.getElementById("destination").value;
    const duration = parseInt(document.getElementById("duration").value);
    const age = parseInt(document.getElementById("age").value);
    const tripValue = parseFloat(document.getElementById("tripValue").value);
    const coverage = document.getElementById("coverage").value;
    const activities = document.getElementById("activities").value;
    const travelers = parseInt(document.getElementById("travelers").value);

    // Base rate per day per person
    let baseRatePerDay = 8; // Starting rate for low risk, young traveler, basic coverage

    // Destination risk multiplier
    const destinationMultiplier = {
      'low': 1.0,
      'medium': 1.4,
      'high': 2.2
    };

    // Age multiplier
    let ageMultiplier = 1.0;
    if (age >= 65) ageMultiplier = 2.5;
    else if (age >= 55) ageMultiplier = 1.8;
    else if (age >= 45) ageMultiplier = 1.4;
    else if (age >= 35) ageMultiplier = 1.1;

    // Coverage level multiplier
    const coverageMultiplier = {
      'basic': 1.0,
      'standard': 1.6,
      'comprehensive': 2.4
    };

    // Activities multiplier
    const activitiesMultiplier = {
      'none': 1.0,
      'moderate': 1.3,
      'extreme': 2.0
    };

    // Duration discounts (longer trips get better daily rates)
    let durationMultiplier = 1.0;
    if (duration >= 30) durationMultiplier = 0.8;
    else if (duration >= 14) durationMultiplier = 0.9;
    else if (duration >= 7) durationMultiplier = 0.95;

    // Group discount
    let groupDiscount = 1.0;
    if (travelers >= 4) groupDiscount = 0.85;
    else if (travelers >= 2) groupDiscount = 0.95;

    // Calculate premium per person per day
    const dailyRate = baseRatePerDay * 
                     destinationMultiplier[destination] * 
                     ageMultiplier * 
                     coverageMultiplier[coverage] * 
                     activitiesMultiplier[activities] * 
                     durationMultiplier * 
                     groupDiscount;

    // Total costs
    const totalPerPerson = dailyRate * duration;
    const totalForGroup = totalPerPerson * travelers;

    // Coverage limits based on level
    const coverageLimits = {
      'basic': {
        medical: 100000,
        evacuation: 500000,
        cancellation: 0,
        baggage: 0
      },
      'standard': {
        medical: 250000,
        evacuation: 1000000,
        cancellation: tripValue,
        baggage: 2500
      },
      'comprehensive': {
        medical: 500000,
        evacuation: 1500000,
        cancellation: tripValue,
        baggage: 5000
      }
    };

    const limits = coverageLimits[coverage];

    // Calculate percentage of trip value
    const percentageOfTrip = (totalForGroup / (tripValue * travelers)) * 100;

    // Get destination name and risk description
    const destinationInfo = {
      'low': { name: 'Low Risk Destination', risk: 'Excellent healthcare, stable conditions' },
      'medium': { name: 'Medium Risk Destination', risk: 'Good healthcare, some regional concerns' },
      'high': { name: 'High Risk Destination', risk: 'Limited healthcare, elevated risks' }
    };

    const coverageDescriptions = {
      'basic': 'Essential medical and evacuation coverage',
      'standard': 'Medical, evacuation, and trip protection',
      'comprehensive': 'Complete protection with enhanced benefits'
    };

    // Display results
    const resultBlock = document.getElementById("travel-insurance-result");
    resultBlock.innerHTML = `
      <h3>✈️ Your Travel Insurance Estimate</h3>
      
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>💰 Total Premium</h6>
          <div class="big-number">$${Math.round(totalForGroup).toLocaleString()}</div>
          <p>${travelers} traveler(s) for ${duration} days<br>
          $${Math.round(totalPerPerson).toLocaleString()} per person<br>
          ${percentageOfTrip.toFixed(1)}% of trip value</p>
        </div>
        
        <div class="insight-card success">
          <h6>🏥 Medical Coverage</h6>
          <div class="big-number">$${limits.medical.toLocaleString()}</div>
          <p>Emergency medical expenses<br>
          Evacuation: $${limits.evacuation.toLocaleString()}<br>
          ${destinationInfo[destination].name}</p>
        </div>
        
        <div class="insight-card ${coverage === 'basic' ? 'warning' : 'info'}">
          <h6>🛡️ Trip Protection</h6>
          <div class="big-number">${limits.cancellation > 0 ? '$' + limits.cancellation.toLocaleString() : 'Not Covered'}</div>
          <p>Cancellation/Interruption<br>
          Baggage: ${limits.baggage > 0 ? '$' + limits.baggage.toLocaleString() : 'Not covered'}<br>
          ${coverageDescriptions[coverage]}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📋 Coverage Breakdown</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>📍 Trip Details:</strong><br>
            Destination: ${destinationInfo[destination].name}<br>
            Duration: ${duration} days<br>
            Travelers: ${travelers} person(s)<br>
            Age group: ${age < 35 ? 'Young adult' : age < 55 ? 'Middle-aged' : age < 65 ? 'Mature' : 'Senior'}<br>
            Activities: ${activities.charAt(0).toUpperCase() + activities.slice(1)} risk
          </div>
          
          <div>
            <strong>💵 Cost Analysis:</strong><br>
            Daily rate: $${dailyRate.toFixed(2)} per person<br>
            Base rate: $${baseRatePerDay}/day<br>
            Risk adjustment: ${(destinationMultiplier[destination] * ageMultiplier * activitiesMultiplier[activities]).toFixed(1)}x<br>
            Coverage level: ${coverageMultiplier[coverage]}x<br>
            Discounts applied: ${((1 - durationMultiplier) * 100 + (1 - groupDiscount) * 100).toFixed(0)}%
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #2196f3;">
          <strong>✅ What's Covered:</strong><br>
          ${coverage === 'basic' ? 
            '• Emergency medical treatment and hospitalization<br>• Medical evacuation and repatriation<br>• 24/7 emergency assistance' :
            coverage === 'standard' ?
            '• All basic coverage benefits<br>• Trip cancellation and interruption<br>• Baggage loss and delay protection<br>• Travel delay compensation' :
            '• All standard coverage benefits<br>• Enhanced coverage limits<br>• Additional baggage protection<br>• Rental car coverage<br>• Personal liability protection'
          }
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <strong>⚠️ Important Notes:</strong><br>
          • ${destinationInfo[destination].risk}<br>
          • Pre-existing medical conditions may require additional coverage<br>
          • ${activities !== 'none' ? 'High-risk activities increase premium and may have exclusions' : 'Standard activities covered'}<br>
          • Purchase before your first non-refundable trip payment for full benefits
        </div>
      </div>
    `;
  });
});