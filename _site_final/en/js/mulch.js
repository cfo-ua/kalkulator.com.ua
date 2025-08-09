document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('mulch-form');
  const result = document.getElementById('mulch-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('mulch-length').value);
      const width = parseFloat(document.getElementById('mulch-width').value);
      const additionalArea = parseFloat(document.getElementById('mulch-additional').value);
      const depth = parseFloat(document.getElementById('mulch-depth').value);
      const pricePerYard = parseFloat(document.getElementById('mulch-type').value);
      const purchaseMethod = document.getElementById('mulch-purchase').value;
      
      if (length <= 0 || width <= 0 || depth <= 0) {
        result.textContent = "Please enter valid dimensions.";
        return;
      }
      
      // Calculate total area
      const mainArea = length * width;
      const totalArea = mainArea + additionalArea;
      
      // Calculate volume needed in cubic feet
      const depthInFeet = depth / 12; // Convert inches to feet
      const volumeCubicFeet = totalArea * depthInFeet;
      
      // Convert to cubic yards (27 cubic feet = 1 cubic yard)
      const volumeCubicYards = volumeCubicFeet / 27;
      
      // Add 10% extra for settling and waste
      const extraVolume = volumeCubicYards * 0.1;
      const totalVolumeNeeded = volumeCubicYards + extraVolume;
      
      // Calculate for different purchase methods
      let purchaseQuantity, purchaseUnit, bagCost, totalCost;
      
      if (purchaseMethod === 'bulk') {
        purchaseQuantity = Math.ceil(totalVolumeNeeded * 2) / 2; // Round to nearest 0.5 yard
        purchaseUnit = 'cubic yards';
        totalCost = purchaseQuantity * pricePerYard;
        
        // Add delivery fee for bulk orders
        const deliveryFee = purchaseQuantity >= 3 ? 75 : 100; // Lower fee for larger orders
        totalCost += deliveryFee;
      } else {
        // Bagged mulch calculation (2 cubic feet per bag typical)
        const bagsNeeded = Math.ceil(volumeCubicFeet / 2);
        const bagsWithWaste = Math.ceil(bagsNeeded * 1.1);
        bagCost = pricePerYard / 13.5; // Approximate bag cost (27 cu ft / 2 cu ft per bag)
        purchaseQuantity = bagsWithWaste;
        purchaseUnit = 'bags (2 cu ft each)';
        totalCost = bagsWithWaste * bagCost;
      }
      
      // Calculate coverage at standard depth for comparison
      const standardCoverage = volumeCubicYards * (36 / depth); // Coverage at 3 inches
      
      // Calculate annual maintenance needs
      const annualRefresh = totalArea * (1/12) / 27; // 1 inch refresh annually
      
      // Calculate environmental benefits
      const waterSavings = totalArea * 0.3; // 30% water savings per sq ft per year
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Area & Volume Calculations:</h4>
          <p>Main bed: ${length}' × ${width}' = ${mainArea} sq ft</p>
          ${additionalArea > 0 ? `<p>Additional area: ${additionalArea} sq ft</p>` : ''}
          <p><strong>Total area: ${totalArea} sq ft</strong></p>
          <p><strong>Mulch depth: ${depth} inches</strong></p>
          <p><strong>Volume needed: ${volumeCubicYards.toFixed(2)} cubic yards</strong></p>
          <p>With 10% extra: ${totalVolumeNeeded.toFixed(2)} cubic yards</p>
        </div>
        
        <div class="result-purchase">
          <h4>Purchase Recommendations:</h4>
          <p><strong>Order: ${purchaseQuantity} ${purchaseUnit}</strong></p>
          <p><strong>Estimated cost: $${totalCost.toFixed(0)}</strong></p>
          ${purchaseMethod === 'bulk' ? `
          <p><em>Includes delivery fee ($75-100)</em></p>
          <p>💡 Bulk delivery requires truck access</p>
          ` : `
          <p><em>Bagged mulch @ ~$${bagCost.toFixed(2)} per bag</em></p>
          <p>💡 Can transport in standard vehicle</p>
          `}
        </div>
        
        <div class="result-coverage">
          <h4>Coverage Information:</h4>
          <p>At ${depth}\" depth: covers ${totalArea} sq ft</p>
          <p>At 3\" depth: would cover ${standardCoverage.toFixed(0)} sq ft</p>
          <p>Weight estimate: ${(totalVolumeNeeded * 1000).toFixed(0)} lbs</p>
          <p>Truck loads: ${Math.ceil(totalVolumeNeeded / 10)} (10 yard truck)</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Annual Maintenance:</h4>
          <p>Yearly refresh: ${annualRefresh.toFixed(2)} cubic yards</p>
          <p>Refresh cost: $${(annualRefresh * pricePerYard).toFixed(0)} annually</p>
          <p>Complete replacement: every 2-3 years</p>
        </div>
        
        <div class="result-benefits">
          <h4>Environmental Benefits:</h4>
          <p>💧 Water savings: ~${waterSavings.toFixed(0)} gallons/year</p>
          <p>🌡️ Soil temperature moderation</p>
          <p>🌱 Reduced weed growth (up to 90%)</p>
          <p>🏠 Enhanced curb appeal and property value</p>
        </div>
        
        <div class="result-application">
          <h4>Application Tips:</h4>
          <p>📏 Keep 3-6\" away from plant stems</p>
          <p>🌿 Apply after soil warms in spring</p>
          <p>🔧 Use rake to spread evenly</p>
          <p>💡 Edge beds before applying mulch</p>
        </div>
        
        <div class="result-comparison">
          <h4>Cost Comparison:</h4>
          ${purchaseMethod === 'bulk' ? `
          <p>Bulk: $${totalCost.toFixed(0)} (${purchaseQuantity} yards)</p>
          <p>Bagged equivalent: $${(Math.ceil(volumeCubicFeet / 2) * bagCost * 1.5).toFixed(0)} (${Math.ceil(volumeCubicFeet / 2)} bags)</p>
          <p>💰 Bulk saves: $${(Math.ceil(volumeCubicFeet / 2) * bagCost * 1.5 - totalCost).toFixed(0)}</p>
          ` : `
          <p>Bagged: $${totalCost.toFixed(0)} (${purchaseQuantity} bags)</p>
          <p>Bulk equivalent: $${(volumeCubicYards * pricePerYard + 75).toFixed(0)} (${volumeCubicYards.toFixed(1)} yards)</p>
          <p>💰 Bulk saves: $${(totalCost - (volumeCubicYards * pricePerYard + 75)).toFixed(0)}</p>
          `}
        </div>
        
        <div class="result-tips">
          <p><em>🚛 Bulk delivery is most economical for areas over 5 cubic yards</em></p>
          <p><em>🏪 Bagged mulch offers convenience for smaller projects</em></p>
          <p><em>📅 Order in early spring for best selection and pricing</em></p>
        </div>
      `;
    });
  }
});