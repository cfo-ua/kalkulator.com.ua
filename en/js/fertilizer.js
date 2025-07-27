document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fertilizer-form');
  const result = document.getElementById('fertilizer-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('fertilizer-area').value);
      const nitrogenRate = parseFloat(document.getElementById('fertilizer-plant-type').value);
      const [nitrogen, phosphorus, potassium, costPer50lb] = document.getElementById('fertilizer-npk').value.split(',').map(Number);
      const applications = parseFloat(document.getElementById('fertilizer-application').value);
      const form = document.getElementById('fertilizer-form-type').value;
      
      if (area <= 0) {
        result.textContent = "Please enter a valid area.";
        return;
      }
      
      // Calculate nitrogen needed per application
      const nitrogenNeededPerApp = (area / 1000) * (nitrogenRate / applications);
      const annualNitrogenNeeded = (area / 1000) * nitrogenRate;
      
      // Calculate fertilizer needed based on nitrogen content
      const fertilizerPerApp = nitrogenNeededPerApp / (nitrogen / 100);
      const annualFertilizer = fertilizerPerApp * applications;
      
      // Calculate bags needed (50 lb bags standard)
      const bagsPerApp = Math.ceil(fertilizerPerApp / 50);
      const annualBags = Math.ceil(annualFertilizer / 50);
      
      // Calculate costs
      const costPerApp = bagsPerApp * costPer50lb;
      const annualCost = annualBags * costPer50lb;
      
      // Calculate actual nutrients applied
      const actualNitrogen = annualFertilizer * (nitrogen / 100);
      const actualPhosphorus = annualFertilizer * (phosphorus / 100);
      const actualPotassium = annualFertilizer * (potassium / 100);
      
      // Calculate application rate per 1000 sq ft
      const ratePerApp = (fertilizerPerApp / (area / 1000));
      
      // Spreader settings estimate
      let spreaderSetting = '';
      if (ratePerApp <= 2) spreaderSetting = 'Setting 2-3 (light application)';
      else if (ratePerApp <= 4) spreaderSetting = 'Setting 3-4 (medium application)';
      else spreaderSetting = 'Setting 4-5 (heavy application)';
      
      // Application timing recommendations
      const timingByApplications = {
        1: ['Early spring (March-April)'],
        2: ['Early spring (March-April)', 'Fall (September-October)'],
        3: ['Early spring (March)', 'Late spring (May)', 'Fall (September)'],
        4: ['Early spring (March)', 'Late spring (May)', 'Summer (July)', 'Fall (September)']
      };
      
      const timing = timingByApplications[applications] || [];
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Fertilizer Requirements:</h4>
          <p>Area: ${area.toLocaleString()} sq ft</p>
          <p>Fertilizer: ${nitrogen}-${phosphorus}-${potassium}</p>
          <p>Application schedule: ${applications} times per year</p>
          <p>Target nitrogen rate: ${nitrogenRate} lbs/1000 sq ft annually</p>
        </div>
        
        <div class="result-application">
          <h4>Per Application:</h4>
          <p><strong>${fertilizerPerApp.toFixed(1)} lbs fertilizer needed</strong></p>
          <p><strong>${bagsPerApp} bags</strong> (50 lb bags)</p>
          <p>Nitrogen applied: ${nitrogenNeededPerApp.toFixed(1)} lbs</p>
          <p>Application rate: ${ratePerApp.toFixed(1)} lbs per 1000 sq ft</p>
          <p>Cost per application: $${costPerApp.toFixed(0)}</p>
        </div>
        
        <div class="result-annual">
          <h4>Annual Totals:</h4>
          <p><strong>${annualFertilizer.toFixed(1)} lbs fertilizer</strong></p>
          <p><strong>${annualBags} bags needed</strong></p>
          <p>Total nitrogen: ${actualNitrogen.toFixed(1)} lbs</p>
          <p>Total phosphorus: ${actualPhosphorus.toFixed(1)} lbs</p>
          <p>Total potassium: ${actualPotassium.toFixed(1)} lbs</p>
          <p><strong>Annual cost: $${annualCost.toFixed(0)}</strong></p>
        </div>
        
        <div class="result-timing">
          <h4>Application Schedule:</h4>
          ${timing.map((time, index) => `<p><strong>Application ${index + 1}:</strong> ${time}</p>`).join('')}
          <p>Wait 6-8 weeks between applications</p>
          <p>Avoid application during drought or extreme heat</p>
        </div>
        
        <div class="result-spreader">
          <h4>Spreader Settings:</h4>
          <p>${spreaderSetting}</p>
          <p>Calibrate spreader before first use</p>
          <p>Walk at steady 3 mph pace</p>
          <p>Overlap patterns by 6 inches</p>
          <p>Apply when grass is dry, soil is moist</p>
        </div>
        
        <div class="result-nutrients">
          <h4>Nutrient Analysis:</h4>
          <p>Nitrogen: ${((actualNitrogen / area) * 1000).toFixed(2)} lbs/1000 sq ft</p>
          <p>Phosphorus: ${((actualPhosphorus / area) * 1000).toFixed(2)} lbs/1000 sq ft</p>
          <p>Potassium: ${((actualPotassium / area) * 1000).toFixed(2)} lbs/1000 sq ft</p>
          <p>NPK ratio maintained throughout year</p>
        </div>
        
        <div class="result-application-tips">
          <h4>Application Guidelines:</h4>
          <p>🌡️ Apply when temperature is 60-80°F</p>
          <p>💧 Water lightly after granular application</p>
          <p>🌱 Avoid applying to wet grass</p>
          <p>⏰ Apply in early morning or evening</p>
          <p>🚫 Don't apply before heavy rain</p>
        </div>
        
        <div class="result-safety">
          <h4>Safety & Environment:</h4>
          <p>🧤 Wear gloves and avoid skin contact</p>
          <p>💧 Don't apply near water sources</p>
          <p>🌬️ Avoid windy conditions</p>
          <p>🏠 Keep children and pets off treated areas</p>
          <p>♻️ Dispose of empty bags properly</p>
        </div>
        
        <div class="result-alternatives">
          <h4>Cost Comparison:</h4>
          <p>Current plan: $${annualCost.toFixed(0)}/year</p>
          <p>Organic alternative: $${(annualCost * 1.5).toFixed(0)}/year (50% more)</p>
          <p>Professional service: $${(area * 0.15).toFixed(0)}/year ($0.15/sq ft)</p>
          <p>Cost per sq ft: $${(annualCost / area).toFixed(3)}</p>
        </div>
        
        <div class="result-storage">
          <h4>Storage & Handling:</h4>
          <p>📦 Store in cool, dry location</p>
          <p>🛡️ Keep in original sealed containers</p>
          <p>📅 Use within 2-3 years of purchase</p>
          <p>🐭 Protect from rodents and moisture</p>
          <p>📋 Keep application records</p>
        </div>
      `;
    });
  }
});