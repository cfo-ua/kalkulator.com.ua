document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('raised-bed-form');
  const result = document.getElementById('raised-bed-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('bed-length').value);
      const width = parseFloat(document.getElementById('bed-width').value);
      const depth = parseFloat(document.getElementById('bed-depth').value);
      const quantity = parseFloat(document.getElementById('bed-quantity').value);
      const soilCostPerYard = parseFloat(document.getElementById('soil-mix').value);
      const purchaseMethod = document.getElementById('purchase-method').value;
      
      if (length <= 0 || width <= 0 || depth <= 0 || quantity <= 0) {
        result.textContent = "Please enter valid measurements.";
        return;
      }
      
      // Calculate volume for one bed
      const bedVolumeCubicFeet = length * width * (depth / 12); // Convert depth to feet
      const bedVolumeCubicYards = bedVolumeCubicFeet / 27;
      
      // Calculate total for all beds
      const totalVolumeCubicFeet = bedVolumeCubicFeet * quantity;
      const totalVolumeCubicYards = bedVolumeCubicYards * quantity;
      
      // Add settlement factor (15% extra for initial settling)
      const volumeWithSettlement = totalVolumeCubicYards * 1.15;
      
      // Calculate based on purchase method
      let purchaseQuantity, purchaseUnit, totalCost, bagEquivalent;
      
      if (purchaseMethod === 'bulk') {
        // Round up to nearest 0.5 cubic yard for bulk delivery
        purchaseQuantity = Math.ceil(volumeWithSettlement * 2) / 2;
        purchaseUnit = 'cubic yards';
        totalCost = purchaseQuantity * soilCostPerYard;
        
        // Add delivery fee for small orders
        if (purchaseQuantity < 3) {
          totalCost += 75; // Delivery fee for small orders
        }
        
        bagEquivalent = Math.ceil(totalVolumeCubicFeet / 2); // 2 cu ft bags
      } else {
        // Bagged soil calculation
        bagEquivalent = Math.ceil(totalVolumeCubicFeet * 1.15 / 2); // 2 cu ft bags with settlement
        purchaseQuantity = bagEquivalent;
        purchaseUnit = 'bags (2 cu ft each)';
        
        // Bagged soil is more expensive per cubic yard
        const bagCostPerCubicYard = soilCostPerYard * 2.5; // 2.5x more expensive
        totalCost = (totalVolumeCubicFeet * 1.15 / 27) * bagCostPerCubicYard;
      }
      
      // Calculate annual maintenance
      const annualTopUp = length * width * quantity * (1/12) / 27; // 1 inch annually
      const annualCost = annualTopUp * soilCostPerYard * 0.8; // Compost is 80% of soil cost
      
      // Calculate bed construction materials estimate
      const perimeterPerBed = (length + width) * 2;
      const totalPerimeter = perimeterPerBed * quantity;
      const lumber8ft = Math.ceil(totalPerimeter / 8); // 8ft boards
      const lumberCost = lumber8ft * 15; // $15 per 8ft cedar board
      const hardwareCost = quantity * 20; // $20 hardware per bed
      const constructionCost = lumberCost + hardwareCost;
      
      // Soil composition breakdown
      const soilComponents = {
        35: { compost: 30, topsoil: 60, amendments: 10 },
        45: { compost: 40, topsoil: 40, amendments: 20 },
        55: { compost: 50, topsoil: 30, amendments: 20 },
        65: { compost: 60, topsoil: 20, amendments: 20 },
        30: { compost: 20, topsoil: 70, amendments: 10 }
      };
      
      const composition = soilComponents[soilCostPerYard];
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Raised Bed Specifications:</h4>
          <p>Bed size: ${length}' × ${width}' × ${depth}"</p>
          <p>Number of beds: ${quantity}</p>
          <p>Volume per bed: ${bedVolumeCubicFeet.toFixed(2)} cu ft (${bedVolumeCubicYards.toFixed(2)} cu yds)</p>
          <p><strong>Total volume needed: ${totalVolumeCubicYards.toFixed(2)} cubic yards</strong></p>
        </div>
        
        <div class="result-soil">
          <h4>Soil Requirements:</h4>
          <p>Base requirement: ${totalVolumeCubicYards.toFixed(2)} cubic yards</p>
          <p>With settlement factor: ${volumeWithSettlement.toFixed(2)} cubic yards</p>
          <p><strong>Order: ${purchaseQuantity} ${purchaseUnit}</strong></p>
          <p><strong>Total cost: $${totalCost.toFixed(0)}</strong></p>
          ${purchaseMethod === 'bulk' && purchaseQuantity < 3 ? '<p><em>Includes $75 delivery fee for small orders</em></p>' : ''}
        </div>
        
        <div class="result-composition">
          <h4>Soil Mix Composition:</h4>
          <p>Compost/Organic matter: ${composition.compost}%</p>
          <p>Topsoil/Base material: ${composition.topsoil}%</p>
          <p>Amendments (perlite, sand): ${composition.amendments}%</p>
          <p>pH level: 6.0-7.0 (ideal for vegetables)</p>
        </div>
        
        <div class="result-comparison">
          <h4>Cost Comparison:</h4>
          <p>Bulk delivery: $${totalCost.toFixed(0)}</p>
          ${purchaseMethod === 'bulk' ? 
            `<p>Bagged equivalent: $${(bagEquivalent * 4).toFixed(0)} (${bagEquivalent} bags @ $4 each)</p>
             <p>💰 Bulk saves: $${(bagEquivalent * 4 - totalCost).toFixed(0)}</p>` :
            `<p>Bulk alternative: $${(volumeWithSettlement * soilCostPerYard + (volumeWithSettlement < 3 ? 75 : 0)).toFixed(0)}</p>
             <p>💰 ${purchaseMethod === 'bags' ? 'Bulk saves' : 'Bagged costs'}: $${Math.abs(totalCost - (volumeWithSettlement * soilCostPerYard + (volumeWithSettlement < 3 ? 75 : 0))).toFixed(0)} more</p>`
          }
        </div>
        
        <div class="result-construction">
          <h4>Bed Construction (Optional):</h4>
          <p>Lumber needed: ${lumber8ft} pieces (8ft cedar boards)</p>
          <p>Total perimeter: ${totalPerimeter} linear feet</p>
          <p>Lumber cost: $${lumberCost.toFixed(0)}</p>
          <p>Hardware cost: $${hardwareCost.toFixed(0)}</p>
          <p><strong>Construction materials: $${constructionCost.toFixed(0)}</strong></p>
        </div>
        
        <div class="result-maintenance">
          <h4>Annual Maintenance:</h4>
          <p>Yearly top-up: ${annualTopUp.toFixed(2)} cubic yards</p>
          <p>Annual compost cost: $${annualCost.toFixed(0)}</p>
          <p>Maintenance: Add 1-2\" compost each spring</p>
          <p>Soil testing: Every 2-3 years ($15-25)</p>
        </div>
        
        <div class="result-delivery">
          <h4>Delivery & Installation:</h4>
          ${purchaseMethod === 'bulk' ? `
          <p>Delivery truck access: 12+ feet wide needed</p>
          <p>Wheelbarrow trips: ${Math.ceil(volumeWithSettlement * 27 / 4)} (4 cu ft per trip)</p>
          <p>Installation time: ${(volumeWithSettlement * 2).toFixed(1)} hours</p>
          ` : `
          <p>Bag transport: ${bagEquivalent} bags @ 40 lbs each</p>
          <p>Total weight: ${(bagEquivalent * 40).toLocaleString()} lbs</p>
          <p>Vehicle trips: ${Math.ceil(bagEquivalent / 20)} (20 bags per trip)</p>
          `}
        </div>
        
        <div class="result-planting">
          <h4>Planting Guidelines:</h4>
          <p>Planting area: ${(length * width * quantity).toFixed(0)} sq ft total</p>
          ${depth >= 12 ? '<p>✅ Suitable for all vegetables</p>' : '<p>⚠️ Limited to shallow-root crops</p>'}
          <p>Plant spacing: Follow seed packet recommendations</p>
          <p>First planting: Wait 1-2 weeks after filling</p>
        </div>
        
        <div class="result-benefits">
          <h4>Raised Bed Benefits:</h4>
          <p>🌱 Better drainage and soil aeration</p>
          <p>🔥 Faster soil warming in spring</p>
          <p>🚫 Reduced soil compaction</p>
          <p>🌿 Easier weed control</p>
          <p>♿ Accessible gardening height</p>
        </div>
        
        <div class="result-tips">
          <h4>Installation Tips:</h4>
          <p>📍 Choose sunny location (6-8 hours daily)</p>
          <p>💧 Install near water source</p>
          <p>📏 Level the bed foundation</p>
          <p>🛡️ Consider landscape fabric liner</p>
          <p>⏰ Fill beds just before planting season</p>
        </div>
      `;
    });
  }
});