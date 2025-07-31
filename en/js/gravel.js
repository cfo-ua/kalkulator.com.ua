document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gravel-form');
  const result = document.getElementById('gravel-result');
  
  // Global function for preset buttons
  window.setPreset = function(length, width, depth) {
    document.getElementById('gravel-length').value = length;
    document.getElementById('gravel-width').value = width;
    document.getElementById('gravel-depth').value = depth;
    
    // Trigger calculation automatically
    form.dispatchEvent(new Event('submit'));
  };
  
  // Add quick conversion calculator
  function addQuickConverter() {
    const converterHTML = `
      <div class="quick-converter" style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <h4>🔄 Quick Gravel Conversion Calculator</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
          <div>
            <label>Cubic Yards: <input type="number" id="yards-input" step="0.1" placeholder="Enter cubic yards"></label>
          </div>
          <div>
            <label>Gravel Type: 
              <select id="conversion-type">
                <option value="1.5">Crushed Stone (1.5 tons/yard)</option>
                <option value="1.3">Pea Gravel (1.3 tons/yard)</option>
                <option value="1.2">River Rock (1.2 tons/yard)</option>
                <option value="1.6">Crusher Run (1.6 tons/yard)</option>
                <option value="1.4">Decomposed Granite (1.4 tons/yard)</option>
              </select>
            </label>
          </div>
        </div>
        <div id="conversion-result" style="margin-top: 10px; font-weight: bold; color: #2c5530;"></div>
      </div>
    `;
    
    const formElement = document.getElementById('gravel-form');
    if (formElement) {
      formElement.insertAdjacentHTML('beforebegin', converterHTML);
      
      // Add conversion functionality
      const yardsInput = document.getElementById('yards-input');
      const conversionType = document.getElementById('conversion-type');
      const conversionResult = document.getElementById('conversion-result');
      
      function updateConversion() {
        const yards = parseFloat(yardsInput.value);
        const factor = parseFloat(conversionType.value);
        
        if (yards > 0) {
          const tons = yards * factor;
          const coverage3inch = tons * (100 / factor * 1.3); // Approximate coverage
          conversionResult.innerHTML = `
            ${yards} cubic yards = <strong>${tons.toFixed(1)} tons</strong><br>
            Coverage: ~${coverage3inch.toFixed(0)} sq ft at 3" deep
          `;
        } else {
          conversionResult.innerHTML = '';
        }
      }
      
      yardsInput.addEventListener('input', updateConversion);
      conversionType.addEventListener('change', updateConversion);
    }
  }
  
  // Initialize quick converter
  addQuickConverter();
  
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
        <div class="result-header" style="background: #2c5530; color: white; padding: 15px; border-radius: 8px 8px 0 0; margin-top: 20px;">
          <h3 style="margin: 0; color: white;">📊 Your Gravel Calculator Results</h3>
        </div>
        
        <div class="result-content" style="border: 2px solid #2c5530; border-radius: 0 0 8px 8px; padding: 20px;">
          <div class="result-section">
            <h4>🏗️ Project Specifications:</h4>
            <p><strong>Area:</strong> ${length}' × ${width}' = ${area} sq ft</p>
            <p><strong>Depth:</strong> ${depth} inches (${depthInFeet.toFixed(2)} feet)</p>
            <p><strong>Base volume:</strong> ${volumeCubicYards.toFixed(2)} cubic yards</p>
            <p><strong>With compaction factor:</strong> ${adjustedVolume.toFixed(2)} cubic yards</p>
          </div>
          
          <div class="result-materials" style="background: #f0f8f0; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h4>📦 Material Requirements (ORDER THESE AMOUNTS):</h4>
            <p><strong>🎯 Order: ${orderYards} cubic yards</strong></p>
            <p><strong>⚖️ Order: ${orderTons} tons</strong></p>
            <p><strong>Weight:</strong> ${(orderTons * 2000).toLocaleString()} pounds</p>
            <p><strong>Density:</strong> ${tonsPerYard} tons per cubic yard</p>
            <p><strong>Weight per sq ft:</strong> ${weightPerSqFt.toFixed(1)} lbs</p>
          </div>
          
          <div class="result-conversions" style="background: #fff8e1; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h4>🔄 Cubic Yards to Tons Conversion:</h4>
            <p><strong>Your project:</strong> ${volumeCubicYards.toFixed(1)} yards = ${totalTons.toFixed(1)} tons</p>
            <p><strong>Conversion rate:</strong> 1 cubic yard = ${tonsPerYard} tons (${document.getElementById('gravel-type').selectedOptions[0].text.split(' (')[0]})</p>
            <p><strong>Coverage rate:</strong> 1 ton covers ~${(108 / (depth/3) / tonsPerYard).toFixed(0)} sq ft at ${depth}\" depth</p>
          </div>
          
          <div class="result-delivery">
            <h4>🚚 Delivery & Cost Information:</h4>
            <p><strong>Truck loads needed:</strong> ${truckLoads} (12-ton trucks)</p>
            <p><strong>Material cost:</strong> $${materialCost.toFixed(0)}</p>
            ${deliveryFee > 0 ? `<p><strong>Delivery fee:</strong> $${deliveryFee}</p>` : '<p><strong>Self-pickup:</strong> no delivery fee</p>'}
            <p style="font-size: 1.2em; font-weight: bold; color: #2c5530;"><strong>💰 Total cost: $${totalCost.toFixed(0)}</strong></p>
            <p><strong>Cost per sq ft:</strong> $${(totalCost / area).toFixed(2)}</p>
          </div>
          
          <div class="result-installation">
            <h4>🔧 Installation Guide:</h4>
            <p><strong>1.</strong> Excavate to ${(depth + 2).toFixed(0)}\" depth (includes base)</p>
            <p><strong>2.</strong> Install landscape fabric/geotextile</p>
            <p><strong>3.</strong> Add and compact gravel in 2-3\" lifts</p>
            <p><strong>4.</strong> Final grade with 2% crown for drainage</p>
            <p><strong>5.</strong> Install edge restraints to contain gravel</p>
          </div>
          
          <div class="result-coverage">
            <h4>📐 Coverage Comparison:</h4>
            <p><strong>At ${depth}\":</strong> covers ${area} sq ft (your project)</p>
            <p><strong>At 3\":</strong> would cover ${(adjustedVolume * 108 / (3/12)).toFixed(0)} sq ft</p>
            <p><strong>At 6\":</strong> would cover ${(adjustedVolume * 108 / (6/12)).toFixed(0)} sq ft</p>
          </div>
          
          <div class="result-maintenance">
            <h4>🔄 Annual Maintenance:</h4>
            <p><strong>Top-up needed:</strong> ${annualTopUp.toFixed(2)} cubic yards</p>
            <p><strong>Top-up weight:</strong> ${(annualTopUp * tonsPerYard).toFixed(1)} tons</p>
            <p><strong>Annual cost:</strong> $${annualCost.toFixed(0)}</p>
            <p><strong>Frequency:</strong> ${depth >= 6 ? 'Every 2-3 years' : 'Annually'}</p>
          </div>
          
          <div class="result-tools">
            <h4>🛠️ Tools & Equipment Needed:</h4>
            <p>🚜 Excavator or shovel (for excavation)</p>
            <p>🎢 Plate compactor (rent $50-75/day)</p>
            <p>📐 Level and string line</p>
            <p>🔧 Rake and hand tools</p>
            <p>🧤 Safety equipment (gloves, glasses)</p>
          </div>
          
          <div class="result-tips">
            <h4>💡 Professional Tips:</h4>
            <p>📏 Verify delivery truck access (12+ ft wide)</p>
            <p>⏰ Schedule delivery after excavation complete</p>
            <p>🌦️ Avoid delivery in wet weather</p>
            <p>📋 Check local permits for driveway work</p>
            <p>💡 Consider hiring contractor for large projects (${area > 1000 ? 'RECOMMENDED for your project size' : 'optional for your project size'})</p>
          </div>
        </div>
      `;
    });
  }
});