document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('rebar-form');
  const result = document.getElementById('rebar-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('rebar-length').value);
      const width = parseFloat(document.getElementById('rebar-width').value);
      const [rebarNumber, rebarDiameter, costPerStick] = document.getElementById('rebar-size').value.split(',').map(Number);
      const spacing = parseFloat(document.getElementById('rebar-spacing').value);
      const projectType = document.getElementById('rebar-project').value;
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Please enter valid dimensions.";
        return;
      }
      
      // Convert feet to inches for calculations
      const lengthInches = length * 12;
      const widthInches = width * 12;
      
      let lengthwiseBars, widthwiseBars, totalBars;
      
      switch(projectType) {
        case 'slab':
        case 'driveway':
          // Grid pattern - bars in both directions
          lengthwiseBars = Math.floor(widthInches / spacing) + 1;
          widthwiseBars = Math.floor(lengthInches / spacing) + 1;
          totalBars = lengthwiseBars + widthwiseBars;
          break;
        case 'footing':
          // Parallel bars along length
          lengthwiseBars = Math.floor(widthInches / spacing) + 1;
          widthwiseBars = 0;
          totalBars = lengthwiseBars;
          break;
        case 'wall':
          // Vertical and horizontal reinforcement
          const wallHeight = 8; // Assume 8 ft wall height
          lengthwiseBars = Math.floor(lengthInches / spacing) + 1; // Horizontal
          widthwiseBars = Math.floor((wallHeight * 12) / spacing) + 1; // Vertical
          totalBars = lengthwiseBars + widthwiseBars;
          break;
        default:
          lengthwiseBars = widthwiseBars = totalBars = 0;
      }
      
      // Calculate linear feet of rebar needed
      const lengthwiseLinearFeet = lengthwiseBars * length;
      const widthwiseLinearFeet = widthwiseBars * width;
      const totalLinearFeet = lengthwiseLinearFeet + widthwiseLinearFeet;
      
      // Add 10% for overlaps, bends, and waste
      const linearFeetWithWaste = totalLinearFeet * 1.1;
      
      // Calculate number of 20-foot sticks needed
      const sticksNeeded = Math.ceil(linearFeetWithWaste / 20);
      
      // Calculate costs
      const rebarCost = sticksNeeded * costPerStick;
      
      // Calculate accessories
      const intersections = lengthwiseBars * widthwiseBars;
      const tieWires = Math.ceil(intersections * 1.1); // 10% extra for ties
      const chairs = Math.ceil(totalLinearFeet / 4); // Support every 4 feet
      
      const accessoryCost = (tieWires * 0.05) + (chairs * 2); // $0.05 per tie, $2 per chair
      const totalCost = rebarCost + accessoryCost;
      
      // Calculate weight (approximate)
      const weightPerFoot = {
        3: 0.376, // #3 rebar weight per foot
        4: 0.668,
        5: 1.043,
        6: 1.502,
        7: 2.044
      };
      
      const totalWeight = linearFeetWithWaste * weightPerFoot[rebarNumber];
      
      // Calculate concrete cover requirements
      let coverRequirement = '';
      switch(projectType) {
        case 'slab':
        case 'driveway':
          coverRequirement = '3" from bottom, 2" from top';
          break;
        case 'footing':
          coverRequirement = '3" from all sides';
          break;
        case 'wall':
          coverRequirement = '2" exterior, 3/4" interior';
          break;
      }
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Project Specifications:</h4>
          <p>Dimensions: ${length}' × ${width}'</p>
          <p>Rebar size: #${rebarNumber} (${rebarDiameter}")</p>
          <p>Spacing: ${spacing}" on center</p>
          <p>Project type: ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}</p>
        </div>
        
        <div class="result-layout">
          <h4>Rebar Layout:</h4>
          ${projectType === 'slab' || projectType === 'driveway' ? `
          <p><strong>Lengthwise bars:</strong> ${lengthwiseBars} pieces @ ${length}' each</p>
          <p><strong>Widthwise bars:</strong> ${widthwiseBars} pieces @ ${width}' each</p>
          <p>Grid intersections: ${intersections}</p>
          ` : projectType === 'footing' ? `
          <p><strong>Parallel bars:</strong> ${lengthwiseBars} pieces @ ${length}' each</p>
          ` : `
          <p><strong>Horizontal bars:</strong> ${lengthwiseBars} pieces @ ${length}' each</p>
          <p><strong>Vertical bars:</strong> ${widthwiseBars} pieces @ 8' each</p>
          `}
          <p><strong>Total bars needed: ${totalBars}</strong></p>
        </div>
        
        <div class="result-materials">
          <h4>Material Requirements:</h4>
          <p>Linear feet: ${totalLinearFeet.toFixed(1)} ft</p>
          <p>With waste (10%): ${linearFeetWithWaste.toFixed(1)} ft</p>
          <p><strong>20-foot sticks: ${sticksNeeded}</strong></p>
          <p>Total weight: ${totalWeight.toFixed(0)} lbs</p>
          <p>Rebar cost: $${rebarCost.toFixed(0)}</p>
        </div>
        
        <div class="result-accessories">
          <h4>Installation Accessories:</h4>
          <p>Tie wires needed: ${tieWires}</p>
          <p>Rebar chairs: ${chairs}</p>
          <p>Accessory cost: $${accessoryCost.toFixed(0)}</p>
          <p><strong>Total project cost: $${totalCost.toFixed(0)}</strong></p>
        </div>
        
        <div class="result-placement">
          <h4>Placement Guidelines:</h4>
          <p>Concrete cover: ${coverRequirement}</p>
          <p>Lap splices: ${rebarNumber * 12}" minimum (${rebarNumber} × diameter × 12)</p>
          <p>Bend radius: ${rebarNumber * 3}" minimum</p>
          <p>Support spacing: Every 4-5 feet</p>
        </div>
        
        <div class="result-installation">
          <h4>Installation Steps:</h4>
          <p>1. Place chairs/supports at proper spacing</p>
          <p>2. Lay lengthwise bars first</p>
          <p>3. Place widthwise bars on top</p>
          <p>4. Secure intersections with tie wire</p>
          <p>5. Check cover distances</p>
          <p>6. Pour concrete within 24 hours</p>
        </div>
        
        <div class="result-strength">
          <h4>Reinforcement Benefits:</h4>
          <p>✅ Prevents cracking from temperature changes</p>
          <p>✅ Increases load-bearing capacity</p>
          <p>✅ Improves durability and lifespan</p>
          <p>✅ Required for most commercial applications</p>
          <p>✅ Provides structural integrity</p>
        </div>
        
        <div class="result-tools">
          <h4>Tools Required:</h4>
          <p>🔧 Rebar cutter or angle grinder</p>
          <p>🪝 Rebar bender (for smaller sizes)</p>
          <p>✂️ Tie wire twisters</p>
          <p>📏 Measuring tape</p>
          <p>🧤 Work gloves (cut-resistant)</p>
          <p>👀 Safety glasses</p>
        </div>
        
        <div class="result-delivery">
          <h4>Delivery & Handling:</h4>
          <p>Delivery weight: ${totalWeight.toFixed(0)} lbs</p>
          <p>Transport: ${totalWeight > 1000 ? 'Truck delivery recommended' : 'Can fit in pickup truck'}</p>
          <p>Storage: Keep dry, off ground</p>
          <p>Handling: Use proper lifting techniques</p>
        </div>
        
        <div class="result-tips">
          <h4>Professional Tips:</h4>
          <p>📐 Plan layout to minimize cutting and waste</p>
          <p>🔗 Stagger lap joints for strength</p>
          <p>📏 Double-check spacing before concrete pour</p>
          <p>⏰ Complete pour within 24 hours of placement</p>
          <p>🌦️ Protect from weather during installation</p>
        </div>
      `;
    });
  }
});