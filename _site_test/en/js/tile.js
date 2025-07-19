document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('tile-form');
  const result = document.getElementById('tile-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('tile-area').value);
      const length = parseFloat(document.getElementById('tile-length').value);
      const width = parseFloat(document.getElementById('tile-width').value);
      const waste = parseFloat(document.getElementById('tile-waste').value);
      
      if (area <= 0 || length <= 0 || width <= 0) {
        result.textContent = "Please enter all parameters with positive values.";
        return;
      }
      
      // Convert inches to square feet for tile area
      const tileAreaSqFt = (length * width) / 144; // 144 sq inches per sq ft
      let tiles = area / tileAreaSqFt;
      const tilesWithWaste = tiles * (1 + (waste / 100));
      
      // Calculate boxes needed (assuming 10 sq ft per box - common packaging)
      const boxesTenSqFt = Math.ceil((area * (1 + waste/100)) / 10);
      
      // Calculate material costs helpers
      const sqFtNeeded = area * (1 + waste/100);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Tiles Needed:</h4>
          <p><strong>${Math.ceil(tiles)} tiles</strong> (exact calculation)</p>
          <p><strong>${Math.ceil(tilesWithWaste)} tiles</strong> (with ${waste}% waste factor)</p>
        </div>
        <div class="result-coverage">
          <h4>Coverage & Ordering:</h4>
          <p>Area to cover: ${area} sq ft</p>
          <p>Total material needed: ${sqFtNeeded.toFixed(1)} sq ft</p>
          <p>Tile size: ${length}\" × ${width}\" (${tileAreaSqFt.toFixed(3)} sq ft each)</p>
          <p>Estimated boxes needed: ${boxesTenSqFt} boxes (assuming 10 sq ft/box)</p>
        </div>
        <div class="result-tips">
          <p><em>💡 Order from the same production lot to ensure color consistency</em></p>
          <p><em>📦 Check actual box coverage - varies by manufacturer (8-20 sq ft typical)</em></p>
          <p><em>🔧 Consider ordering extra for complex cuts and future repairs</em></p>
        </div>
      `;
    });
  }
});