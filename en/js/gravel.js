document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gravel-form');
  const result = document.getElementById('gravel-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('gravel-length').value);
      const width = parseFloat(document.getElementById('gravel-width').value);
      const depth = parseFloat(document.getElementById('gravel-depth').value);
      const [tonsPerYard, pricePerTon] = document.getElementById('gravel-type').value.split(',').map(Number);
      const compactionFactor = parseFloat(document.getElementById('gravel-project').value);
      const deliveryFee = parseFloat(document.getElementById('gravel-delivery').value);
      
      if (length <= 0 || width <= 0 || depth <= 0) {
        result.textContent = "Please enter valid dimensions.";
        return;
      }
      
      // Calculate area and volume
      const area = length * width;
      const depthInFeet = depth / 12; // Convert inches to feet
      const volumeCubicFeet = area * depthInFeet;
      const volumeCubicYards = volumeCubicFeet / 27; // 27 cubic feet = 1 cubic yard
      
      // Apply compaction factor
      const adjustedVolume = volumeCubicYards * compactionFactor;
      
      // Convert to tons
      const totalTons = adjustedVolume * tonsPerYard;
      
      // Round up to nearest half-ton for ordering
      const orderTons = Math.ceil(totalTons * 2) / 2;
      const orderYards = Math.ceil(adjustedVolume * 2) / 2;
      
      // Calculate costs
      const materialCost = orderTons * pricePerTon;
      const totalCost = materialCost + deliveryFee;
      
      // Calculate coverage information
      const actualCoverage = adjustedVolume * (108 / (depth * 3)); // Coverage at given depth vs 3"
      const weightPerSqFt = totalTons * 2000 / area; // Weight in pounds per sq ft
      
      // Calculate truck loads (typical gravel truck carries 10-15 tons)
      const truckLoads = Math.ceil(orderTons / 12);
      
      // Annual maintenance estimate
      const annualTopUp = area * 0.5 / 12 / 27; // 0.5 inch annually
      const annualCost = annualTopUp * tonsPerYard * pricePerTon;
      
      // Calculate alternative depths for comparison
      const at3inches = (area * 3/12) / 27 * compactionFactor;
      const at6inches = (area * 6/12) / 27 * compactionFactor;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Project Specifications:</h4>
          <p>Area: ${length}' × ${width}' = ${area} sq ft</p>
          <p>Depth: ${depth} inches (${depthInFeet.toFixed(2)} feet)</p>
          <p>Base volume: ${volumeCubicYards.toFixed(2)} cubic yards</p>
          <p>With compaction factor: ${adjustedVolume.toFixed(2)} cubic yards</p>
        </div>
        
        <div class="result-materials">
          <h4>Material Requirements:</h4>
          <p><strong>Order: ${orderYards} cubic yards</strong></p>
          <p><strong>Order: ${orderTons} tons</strong></p>
          <p>Weight: ${(orderTons * 2000).toLocaleString()} pounds</p>
          <p>Density: ${tonsPerYard} tons per cubic yard</p>
          <p>Weight per sq ft: ${weightPerSqFt.toFixed(1)} lbs</p>
        </div>
        
        <div class="result-delivery">
          <h4>Delivery Information:</h4>
          <p>Truck loads needed: ${truckLoads} (12-ton trucks)</p>
          <p>Material cost: $${materialCost.toFixed(0)}</p>
          ${deliveryFee > 0 ? `<p>Delivery fee: $${deliveryFee}</p>` : '<p>Self-pickup (no delivery fee)</p>'}
          <p><strong>Total cost: $${totalCost.toFixed(0)}</strong></p>
        </div>
        
        <div class="result-installation">
          <h4>Installation Guide:</h4>
          <p>1. Excavate to ${(depth + 2).toFixed(0)}" depth (includes base)</p>
          <p>2. Install landscape fabric</p>
          <p>3. Add and compact gravel in 2-3" lifts</p>
          <p>4. Final grade with 2% crown for drainage</p>
          <p>5. Install edge restraints to contain gravel</p>
        </div>
        
        <div class="result-coverage">
          <h4>Coverage Comparison:</h4>
          <p>At ${depth}": covers ${area} sq ft</p>
          <p>At 3": would cover ${(at3inches * 108 / (3/12)).toFixed(0)} sq ft</p>
          <p>At 6": would cover ${(at6inches * 108 / (6/12)).toFixed(0)} sq ft</p>
          <p>Cost per sq ft: $${(totalCost / area).toFixed(2)}</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Annual Maintenance:</h4>
          <p>Top-up needed: ${annualTopUp.toFixed(2)} cubic yards</p>
          <p>Top-up weight: ${(annualTopUp * tonsPerYard).toFixed(1)} tons</p>
          <p>Annual cost: $${annualCost.toFixed(0)}</p>
          <p>Frequency: ${depth >= 6 ? 'Every 2-3 years' : 'Annually'}</p>
        </div>
        
        <div class="result-tools">
          <h4>Tools & Equipment Needed:</h4>
          <p>🚜 Excavator or shovel (for excavation)</p>
          <p>🎢 Plate compactor (rent $50-75/day)</p>
          <p>📐 Level and string line</p>
          <p>🔧 Rake and hand tools</p>
          <p>🧤 Safety equipment (gloves, glasses)</p>
        </div>
        
        <div class="result-tips">
          <h4>Professional Tips:</h4>
          <p>📏 Verify delivery truck access (12+ ft wide)</p>
          <p>⏰ Schedule delivery after excavation complete</p>
          <p>🌦️ Avoid delivery in wet weather</p>
          <p>📋 Check local permits for driveway work</p>
          <p>💡 Consider hiring contractor for large projects</p>
        </div>
        
        <div class="result-alternatives">
          <h4>Cost per Cubic Yard:</h4>
          <p>Material: $${(pricePerTon * tonsPerYard).toFixed(0)}/yard</p>
          <p>Delivered: $${((materialCost + deliveryFee) / orderYards).toFixed(0)}/yard</p>
          <p>💰 Break-even vs pickup: ${(deliveryFee / (pricePerTon * tonsPerYard) * 100).toFixed(0)}% markup</p>
        </div>
        
        <div class="result-environmental">
          <h4>Environmental Benefits:</h4>
          <p>💧 Permeable surface reduces runoff</p>
          <p>🌱 Natural drainage improves water quality</p>
          <p>♻️ Recyclable material (can be reused)</p>
          <p>🏞️ Lower environmental impact than concrete</p>
        </div>
      `;
    });
  }
});