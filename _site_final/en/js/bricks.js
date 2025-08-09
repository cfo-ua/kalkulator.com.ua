document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bricks-form');
  const result = document.getElementById('bricks-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const area = parseFloat(document.getElementById('bricks-area').value);
      const length = parseFloat(document.getElementById('bricks-length').value);
      const height = parseFloat(document.getElementById('bricks-height').value);
      const width = parseFloat(document.getElementById('bricks-width').value);
      const joint = parseFloat(document.getElementById('bricks-joint').value) || 0;
      const layerMultiplier = parseFloat(document.getElementById('bricks-layer').value);

      if (area <= 0 || length <= 0 || height <= 0 || width <= 0 || layerMultiplier <= 0) {
        result.textContent = "Please enter all brick dimensions, wall area, and select wall type.";
        return;
      }

      // Convert inches to feet for calculation
      const brickLength = (length + joint) / 12; // ft
      const brickHeight = (height + joint) / 12; // ft
      const brickWidth = (width + joint) / 12;   // ft

      // Calculate brick face area (what shows on the wall)
      const brickFaceArea = brickLength * brickHeight; // sq ft

      // Calculate bricks needed per square foot of wall
      const bricksPerSqFt = 1 / brickFaceArea;
      
      // Total bricks needed
      const bricks = area * bricksPerSqFt * layerMultiplier;
      const bricksWithWaste = bricks * 1.1; // 10% extra

      // Calculate mortar needed (approximate)
      const mortarCubicFeet = area * (joint / 12) * layerMultiplier * 0.3; // Rough estimate
      const mortarBags = Math.ceil(mortarCubicFeet / 0.6); // ~0.6 cubic feet per 80lb bag

      result.innerHTML = `
        <div class="result-section">
          <h4>Bricks Needed:</h4>
          <p><strong>${Math.ceil(bricks)} bricks</strong> (exact calculation)</p>
          <p><strong>${Math.ceil(bricksWithWaste)} bricks</strong> (with 10% waste allowance)</p>
          <p>Rate: ${bricksPerSqFt.toFixed(1)} bricks per sq ft</p>
        </div>
        <div class="result-materials">
          <h4>Additional Materials:</h4>
          <p>Mortar bags (80lb): ~${mortarBags} bags</p>
          <p>Wall area: ${area} sq ft</p>
          <p>Wall thickness: ${layerMultiplier === 1 ? 'Single wythe' : layerMultiplier === 2 ? 'Double wythe' : 'Cavity wall'}</p>
        </div>
        <div class="result-tips">
          <p><em>💡 Always order 5-10% extra bricks for breakage and future repairs</em></p>
          <p><em>🧱 Standard delivery is by the pallet (typically 500-1000 bricks)</em></p>
        </div>
      `;
    });
  }
});