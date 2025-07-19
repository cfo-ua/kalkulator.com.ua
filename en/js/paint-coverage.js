document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('paint-form');
  const result = document.getElementById('paint-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const wallArea = parseFloat(document.getElementById('paint-wall-area').value);
      const doors = parseFloat(document.getElementById('paint-doors').value);
      const windows = parseFloat(document.getElementById('paint-windows').value);
      const additionalArea = parseFloat(document.getElementById('paint-additional').value);
      const surfaceMultiplier = parseFloat(document.getElementById('paint-surface-type').value);
      const coveragePerGallon = parseFloat(document.getElementById('paint-quality').value);
      const coats = parseFloat(document.getElementById('paint-coats').value);
      const needsPrimer = document.getElementById('paint-primer').value === 'true';
      
      if (wallArea <= 0) {
        result.textContent = "Please enter a valid wall area.";
        return;
      }
      
      // Calculate net area to paint
      const doorArea = doors * 21; // Standard door = 21 sq ft
      const windowArea = windows * 15; // Standard window = 15 sq ft
      const netWallArea = wallArea - doorArea - windowArea;
      const totalArea = netWallArea + additionalArea;
      
      if (totalArea <= 0) {
        result.textContent = "Total area to paint must be positive. Check your measurements.";
        return;
      }
      
      // Adjust for surface type
      const adjustedCoverage = coveragePerGallon * surfaceMultiplier;
      
      // Calculate paint needed
      const paintAreaNeeded = totalArea * coats;
      const paintGallons = paintAreaNeeded / adjustedCoverage;
      const paintGallonsRounded = Math.ceil(paintGallons * 4) / 4; // Round to nearest quart
      
      // Calculate primer if needed
      let primerGallons = 0;
      let primerGallonsRounded = 0;
      if (needsPrimer) {
        const primerCoverage = 250 * surfaceMultiplier; // Primer covers less
        primerGallons = totalArea / primerCoverage;
        primerGallonsRounded = Math.ceil(primerGallons * 4) / 4;
      }
      
      // Add 10% extra for touch-ups
      const extraPaint = paintGallonsRounded * 0.1;
      const totalPaintRecommended = paintGallonsRounded + extraPaint;
      const totalPaintRounded = Math.ceil(totalPaintRecommended * 4) / 4;
      
      // Cost estimates (rough ranges)
      const paintCostLow = paintGallonsRounded * 25;
      const paintCostHigh = paintGallonsRounded * 80;
      const primerCostLow = primerGallonsRounded * 20;
      const primerCostHigh = primerGallonsRounded * 50;
      
      // Calculate quarts and additional gallons
      const paintQuarts = Math.round((paintGallonsRounded % 1) * 4);
      const paintFullGallons = Math.floor(paintGallonsRounded);
      const primerQuarts = Math.round((primerGallonsRounded % 1) * 4);
      const primerFullGallons = Math.floor(primerGallonsRounded);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Area Calculations:</h4>
          <p>Total wall area: ${wallArea} sq ft</p>
          <p>Less doors: ${doorArea} sq ft (${doors} doors)</p>
          <p>Less windows: ${windowArea} sq ft (${windows} windows)</p>
          <p>Net paintable area: ${netWallArea} sq ft</p>
          ${additionalArea > 0 ? `<p>Additional area: ${additionalArea} sq ft</p>` : ''}
          <p><strong>Total area to paint: ${totalArea} sq ft</strong></p>
          <p><strong>Paint needed for ${coats} coat${coats > 1 ? 's' : ''}: ${paintAreaNeeded} sq ft coverage</strong></p>
        </div>
        
        <div class="result-paint">
          <h4>Paint Requirements:</h4>
          <p><strong>${paintGallonsRounded} gallons of paint</strong></p>
          <p>(${paintFullGallons} gallons${paintQuarts > 0 ? ` + ${paintQuarts} quarts` : ''})</p>
          <p>Effective coverage: ${adjustedCoverage} sq ft/gallon</p>
          ${needsPrimer ? `
          <p><strong>${primerGallonsRounded} gallons of primer</strong></p>
          <p>(${primerFullGallons} gallons${primerQuarts > 0 ? ` + ${primerQuarts} quarts` : ''})</p>
          ` : ''}
        </div>
        
        <div class="result-recommendations">
          <h4>Purchase Recommendations:</h4>
          <p><strong>Buy: ${totalPaintRounded} gallons of paint</strong> <em>(includes 10% extra)</em></p>
          ${needsPrimer ? `<p><strong>Buy: ${primerGallonsRounded} gallons of primer</strong></p>` : ''}
          <p>💡 Always buy extra for touch-ups and color matching</p>
          <p>🎨 Purchase all paint from the same batch for color consistency</p>
        </div>
        
        <div class="result-costs">
          <h4>Estimated Costs:</h4>
          <p>Paint: $${paintCostLow}-$${paintCostHigh} (${paintGallonsRounded} gallons)</p>
          ${needsPrimer ? `<p>Primer: $${primerCostLow}-$${primerCostHigh} (${primerGallonsRounded} gallons)</p>` : ''}
          <p><em>Prices vary by brand, quality, and retailer</em></p>
        </div>
        
        <div class="result-supplies">
          <h4>Additional Supplies Needed:</h4>
          <p>🖌️ Brushes (2-3 different sizes)</p>
          <p>🎢 Rollers and roller covers</p>
          <p>📋 Paint trays and liners</p>
          <p>🛡️ Drop cloths and plastic sheeting</p>
          <p>📏 Painter's tape</p>
          <p>🧽 Cleaning supplies</p>
        </div>
        
        <div class="result-tips">
          <p><em>🏠 Consider hiring professionals for high ceilings or complex projects</em></p>
          <p><em>🌡️ Paint in temperatures between 50-85°F for best results</em></p>
          <p><em>⏰ Allow proper drying time between coats (2-4 hours typical)</em></p>
        </div>
      `;
    });
  }
});