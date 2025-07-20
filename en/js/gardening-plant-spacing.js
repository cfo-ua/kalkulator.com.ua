document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('plant-spacing-form');
  const result = document.getElementById('plant-spacing-result');
  const plantTypeSelect = document.getElementById('plant-type');
  const customSpacingDiv = document.getElementById('custom-spacing');

  // Handle custom spacing visibility
  if (plantTypeSelect) {
    plantTypeSelect.addEventListener('change', function() {
      if (this.value === 'custom') {
        customSpacingDiv.style.display = 'block';
      } else {
        customSpacingDiv.style.display = 'none';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const length = parseFloat(document.getElementById('garden-length').value);
      const width = parseFloat(document.getElementById('garden-width').value);
      const plantType = document.getElementById('plant-type').value;
      const pattern = document.getElementById('spacing-pattern').value;
      const layout = document.getElementById('garden-layout').value;
      const borderSpace = parseFloat(document.getElementById('border-space').value);
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Please enter valid garden dimensions.";
        return;
      }
      
      let spacingX, spacingY;
      
      if (plantType === 'custom') {
        spacingX = parseFloat(document.getElementById('custom-length').value);
        spacingY = parseFloat(document.getElementById('custom-width').value);
        if (!spacingX || !spacingY || spacingX <= 0 || spacingY <= 0) {
          result.textContent = "Please enter valid custom spacing values.";
          return;
        }
      } else if (plantType === '') {
        result.textContent = "Please select a plant type.";
        return;
      } else {
        [spacingX, spacingY] = plantType.split(',').map(Number);
      }
      
      // Convert feet to inches
      const lengthInches = length * 12;
      const widthInches = width * 12;
      
      // Account for border space
      const plantableLength = Math.max(0, lengthInches - (borderSpace * 2));
      const plantableWidth = Math.max(0, widthInches - (borderSpace * 2));
      
      // Calculate based on layout type
      let effectiveLength = plantableLength;
      let effectiveWidth = plantableWidth;
      let pathInfo = '';
      
      if (layout === 'rows') {
        // Account for 18" paths between rows
        const pathWidth = 18;
        const rowWidth = spacingY;
        const totalRowsAndPaths = Math.floor(plantableWidth / (rowWidth + pathWidth));
        const actualRows = totalRowsAndPaths;
        effectiveWidth = actualRows * rowWidth;
        pathInfo = `${actualRows} planting rows with 18" paths`;
      }
      
      // Calculate number of plants
      let plantsX, plantsY, totalPlants;
      
      if (pattern === 'square') {
        plantsX = Math.floor(effectiveLength / spacingX) + 1;
        plantsY = Math.floor(effectiveWidth / spacingY) + 1;
        totalPlants = plantsX * plantsY;
      } else { // triangular
        plantsX = Math.floor(effectiveLength / spacingX) + 1;
        plantsY = Math.floor(effectiveWidth / spacingY) + 1;
        
        // Triangular spacing calculation - offset every other row
        const evenRows = Math.ceil(plantsY / 2);
        const oddRows = Math.floor(plantsY / 2);
        const offsetPlantsX = Math.floor((effectiveLength - spacingX/2) / spacingX) + 1;
        
        totalPlants = (evenRows * plantsX) + (oddRows * offsetPlantsX);
      }
      
      // Calculate area and density
      const totalArea = length * width; // sq ft
      const plantableArea = (plantableLength * plantableWidth) / 144; // sq ft
      const plantsPerSqFt = totalPlants / plantableArea;
      
      // Calculate spacing for other common layouts
      const sqftPlants = layout === 'sqft' ? Math.floor(plantableArea) * Math.floor(144 / (spacingX * spacingY)) : null;
      
      // Generate layout description
      let layoutDescription = '';
      if (pattern === 'square') {
        layoutDescription = `${plantsX} plants × ${plantsY} plants in square grid`;
      } else {
        layoutDescription = `${plantsY} rows with alternating ${plantsX} and ${Math.floor((effectiveLength - spacingX/2) / spacingX) + 1} plants (triangular pattern)`;
      }
      
      // Plant-specific tips
      const plantTypeName = plantType === 'custom' ? 'Custom plant' : 
        document.getElementById('plant-type').options[document.getElementById('plant-type').selectedIndex].text.split(' (')[0];
      
      // Calculate materials needed
      const seedsNeeded = Math.ceil(totalPlants * 1.1); // 10% extra for germination failure
      const wateredArea = plantableArea;
      const mulchNeeded = plantableArea * 0.1; // 4 inches deep in cubic feet
      
      // Maintenance calculations
      const waterPerWeek = plantableArea * 1; // 1 inch per week
      const waterGallons = waterPerWeek * 0.623; // convert to gallons
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Garden Layout Results:</h4>
          <p>Garden size: ${length}' × ${width}' (${totalArea.toFixed(1)} sq ft)</p>
          <p>Plantable area: ${plantableArea.toFixed(1)} sq ft</p>
          <p>Plant spacing: ${spacingX}" × ${spacingY}"</p>
          <p>Pattern: ${pattern === 'square' ? 'Square grid' : 'Triangular offset'}</p>
          ${pathInfo ? `<p>Layout: ${pathInfo}</p>` : ''}
        </div>
        
        <div class="result-plants">
          <h4>Plant Count:</h4>
          <p><strong>${totalPlants} total plants</strong></p>
          <p>${layoutDescription}</p>
          <p>Density: ${plantsPerSqFt.toFixed(2)} plants per sq ft</p>
          ${sqftPlants ? `<p>Square foot method: ${sqftPlants} plants</p>` : ''}
        </div>
        
        <div class="result-materials">
          <h4>Materials Needed:</h4>
          <p><strong>Seeds/Seedlings:</strong> ${seedsNeeded} (includes 10% extra)</p>
          <p><strong>Mulch:</strong> ${mulchNeeded.toFixed(1)} cubic feet (4" deep)</p>
          <p><strong>Weekly watering:</strong> ${waterGallons.toFixed(1)} gallons</p>
          <p><strong>Border space:</strong> ${borderSpace}" around edges</p>
        </div>
        
        <div class="result-planting">
          <h4>Planting Instructions:</h4>
          <p>🌱 Start from one corner, measure ${spacingX}" between plants</p>
          <p>📏 Space rows ${spacingY}" apart</p>
          ${pattern === 'triangular' ? '<p>🔄 Offset every other row by half the spacing distance</p>' : ''}
          <p>💧 Water thoroughly after planting</p>
          <p>🌿 Apply mulch around plants (avoid touching stems)</p>
        </div>
        
        <div class="result-layout-tips">
          <h4>Layout Optimization:</h4>
          <p>📐 Use string lines or measuring tape for straight rows</p>
          <p>🎯 Mark plant positions with stakes before planting</p>
          <p>🌞 Orient rows north-south for even sun exposure</p>
          <p>🚶 Leave 18-24" paths for access and maintenance</p>
          <p>📏 Consider mature plant size, not seedling size</p>
        </div>
        
        <div class="result-companion">
          <h4>Companion Planting Tips:</h4>
          <p>🌿 Herbs can be planted between larger vegetables</p>
          <p>🥕 Root vegetables work well with leafy greens</p>
          <p>🌻 Tall plants (tomatoes) pair with short ones (lettuce)</p>
          <p>🐛 Marigolds can be scattered throughout for pest control</p>
          <p>🌽 Three Sisters: corn, beans, and squash together</p>
        </div>
        
        <div class="result-timing">
          <h4>Planting Schedule:</h4>
          <p>📅 Check frost dates for your area</p>
          <p>🌱 Start warm-season crops after last frost</p>
          <p>❄️ Cool-season crops can handle light frost</p>
          <p>🔄 Succession plant every 2-3 weeks for continuous harvest</p>
          <p>📋 Keep planting records for future planning</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Maintenance Requirements:</h4>
          <p>💧 Water: ${waterGallons.toFixed(1)} gallons/week (1" depth)</p>
          <p>✂️ Space between plants allows air circulation</p>
          <p>🌿 Mulch maintains moisture and suppresses weeds</p>
          <p>🔍 Regular spacing improves pest/disease monitoring</p>
          <p>🌱 Proper spacing reduces competition and stress</p>
        </div>
        
        <div class="result-alternatives">
          <h4>Alternative Layouts:</h4>
          <p><strong>Intensive beds:</strong> ${Math.floor(totalPlants * 1.15)} plants (closer spacing)</p>
          <p><strong>Container garden:</strong> ${Math.ceil(totalPlants / 4)} large containers needed</p>
          <p><strong>Vertical growing:</strong> Use trellises to save 30-50% space</p>
          <p><strong>Raised beds:</strong> Allow 20% closer spacing than ground level</p>
        </div>
      `;
    });
  }
});