document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('boiler-power-form');
  const result = document.getElementById('boiler-power-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('boiler-area').value);
      const height = parseFloat(document.getElementById('boiler-height').value);
      const insulationBtu = parseFloat(document.getElementById('boiler-insulation').value);
      const climate = parseFloat(document.getElementById('boiler-climate').value);
      
      if (area <= 0 || height <= 0) {
        result.textContent = "Please enter home area and ceiling height.";
        return;
      }
      
      // Base calculation: BTU per sq ft based on insulation
      let baseBtu = area * insulationBtu;
      
      // Adjust for ceiling height (8 ft is standard)
      const heightFactor = height / 8;
      baseBtu *= heightFactor;
      
      // Apply climate factor
      const totalBtu = baseBtu * climate;
      
      // Add safety factor (15% for peak demand)
      const recommendedBtu = totalBtu * 1.15;
      
      // Calculate annual fuel costs (rough estimates)
      const gasThermsCost = (recommendedBtu / 100000) * 800 * 1.20; // $1.20/therm average
      const oilGallonsCost = (recommendedBtu / 140000) * 800 * 3.00; // $3.00/gallon average
      const electricKwhCost = (recommendedBtu / 3412) * 2000 * 0.12; // $0.12/kWh average
      
      // Determine insulation description
      const insulationDesc = {
        30: "Excellent insulation",
        40: "Good insulation", 
        50: "Average insulation",
        60: "Poor insulation"
      }[insulationBtu] || "Custom insulation";
      
      // Determine climate description
      const climateDesc = {
        0.8: "Very hot climate",
        1.0: "Warm/mixed climate",
        1.2: "Cool/cold climate", 
        1.4: "Very cold climate"
      }[climate] || "Custom climate";
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Recommended Boiler Size:</h4>
          <p><strong>${Math.round(recommendedBtu).toLocaleString()} BTU/hour</strong></p>
          <p>Base calculation: ${Math.round(totalBtu).toLocaleString()} BTU + 15% safety factor</p>
        </div>
        <div class="result-breakdown">
          <h4>Calculation Details:</h4>
          <p>Area: ${area.toLocaleString()} sq ft</p>
          <p>Ceiling height: ${height} ft (factor: ${heightFactor.toFixed(2)})</p>
          <p>${insulationDesc}: ${insulationBtu} BTU/sq ft</p>
          <p>${climateDesc}: ×${climate} adjustment</p>
        </div>
        <div class="result-costs">
          <h4>Estimated Annual Fuel Costs:</h4>
          <p><strong>Natural Gas:</strong> ~$${Math.round(gasThermsCost).toLocaleString()}</p>
          <p><strong>Heating Oil:</strong> ~$${Math.round(oilGallonsCost).toLocaleString()}</p>
          <p><strong>Electric:</strong> ~$${Math.round(electricKwhCost).toLocaleString()}</p>
        </div>
        <div class="result-tips">
          <p><em>🔥 Consider a condensing boiler for 15% better efficiency</em></p>
          <p><em>🏠 Improve insulation to reduce boiler size requirements</em></p>
          <p><em>⚡ Get a Manual J calculation for precise sizing</em></p>
        </div>
      `;
    });
  }
});