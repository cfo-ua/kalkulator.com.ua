document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wall-area-form');
  const result = document.getElementById('wall-area-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('wall-length').value);
      const width = parseFloat(document.getElementById('wall-width').value);
      const height = parseFloat(document.getElementById('wall-height').value);
      const doorsWindows = parseFloat(document.getElementById('wall-doors').value) || 0;
      
      if (length <= 0 || width <= 0 || height <= 0) {
        result.textContent = "Please enter positive values for room dimensions and wall height.";
        return;
      }
      
      const totalWallArea = 2 * (length + width) * height;
      const netWallArea = totalWallArea - doorsWindows;
      
      // Paint calculations
      const paintGallons1Coat = Math.ceil(netWallArea / 375); // Conservative estimate
      const paintGallons2Coats = Math.ceil((netWallArea * 2) / 375);
      const primerGallons = Math.ceil(netWallArea / 325);
      
      // Wallpaper calculations (assuming standard 20.5" wide rolls covering ~28 sq ft)
      const wallpaperRolls = Math.ceil(netWallArea / 28);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Wall Surface Area:</h4>
          <p><strong>${totalWallArea.toFixed(1)} sq ft</strong> (total wall area)</p>
          <p><strong>${netWallArea.toFixed(1)} sq ft</strong> (minus doors & windows)</p>
          <p>Room perimeter: ${(2 * (length + width)).toFixed(1)} ft</p>
        </div>
        <div class="result-materials">
          <h4>Material Estimates:</h4>
          <p><strong>Paint needed:</strong></p>
          <ul>
            <li>1 coat: ${paintGallons1Coat} gallon${paintGallons1Coat > 1 ? 's' : ''}</li>
            <li>2 coats: ${paintGallons2Coats} gallon${paintGallons2Coats > 1 ? 's' : ''}</li>
          </ul>
          <p><strong>Primer:</strong> ${primerGallons} gallon${primerGallons > 1 ? 's' : ''}</p>
          <p><strong>Wallpaper:</strong> ~${wallpaperRolls} rolls (standard width)</p>
        </div>
        <div class="result-tips">
          <p><em>🎨 Paint coverage: ~375 sq ft per gallon (varies by brand and surface)</em></p>
          <p><em>📏 Always buy slightly more than calculated for touch-ups</em></p>
          <p><em>🏠 For textured walls, add 10-20% more paint</em></p>
        </div>
      `;
    });
  }
});