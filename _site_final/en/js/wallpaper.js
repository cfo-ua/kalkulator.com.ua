document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wallpaper-form');
  const result = document.getElementById('wallpaper-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const wallArea = parseFloat(document.getElementById('wallpaper-wall-area').value);
      const rollLength = parseFloat(document.getElementById('wallpaper-roll-length').value);
      const rollWidthInches = parseFloat(document.getElementById('wallpaper-roll-width').value);
      const wasteFactor = parseFloat(document.getElementById('wallpaper-pattern').value);
      
      if (wallArea <= 0 || rollLength <= 0 || rollWidthInches <= 0) {
        result.textContent = "Please enter all parameters with positive values.";
        return;
      }
      
      // Convert roll width from inches to feet
      const rollWidthFeet = rollWidthInches / 12;
      const rollArea = rollLength * rollWidthFeet;
      
      // Calculate rolls needed with waste factor
      const adjustedArea = wallArea * (1 + wasteFactor / 100);
      const rollsNeeded = Math.ceil(adjustedArea / rollArea);
      
      // Calculate total coverage and waste
      const totalCoverage = rollsNeeded * rollArea;
      const wasteAmount = totalCoverage - wallArea;
      const wastePercent = (wasteAmount / wallArea) * 100;
      
      // Determine pattern type text
      let patternType = "";
      switch(wasteFactor) {
        case 5: patternType = "No pattern/Random"; break;
        case 12: patternType = "Straight match"; break;
        case 20: patternType = "Drop match"; break;
        case 25: patternType = "Large repeat"; break;
        default: patternType = "Custom pattern";
      }
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Wallpaper Needed:</h4>
          <p><strong>${rollsNeeded} rolls</strong> required</p>
          <p>Wall area: ${wallArea} sq ft</p>
          <p>Total coverage: ${totalCoverage.toFixed(1)} sq ft</p>
        </div>
        <div class="result-details">
          <h4>Roll Specifications:</h4>
          <p>Roll size: ${rollWidthInches}\" × ${rollLength}' (${rollArea.toFixed(1)} sq ft each)</p>
          <p>Pattern type: ${patternType}</p>
          <p>Waste allowance: ${wasteFactor}% (${wasteAmount.toFixed(1)} sq ft)</p>
        </div>
        <div class="result-tips">
          <p><em>🎨 Order all rolls from the same dye lot for color consistency</em></p>
          <p><em>📏 Keep one extra roll for future repairs or touch-ups</em></p>
          <p><em>🔄 Consider pattern direction when ordering</em></p>
        </div>
      `;
    });
  }
});