document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('plaster-form');
  const result = document.getElementById('plaster-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('plaster-area').value);
      const thickness = parseFloat(document.getElementById('plaster-thickness').value);
      
      if (area <= 0 || thickness <= 0) {
        result.textContent = "Please enter wall area and plaster thickness.";
        return;
      }
      
      // Calculate volume in cubic feet
      const volumeCubicFeet = area * thickness / 12; // thickness in inches, convert to feet
      const volumeCubicYards = volumeCubicFeet / 27;
      
      // Calculate bags needed (assuming 50lb bag covers ~4 cubic feet)
      const bags50lb = Math.ceil(volumeCubicFeet / 4);
      const bags25lb = Math.ceil(volumeCubicFeet / 2);
      
      // Calculate by thickness type
      let coatType = "";
      let coverage50lb = 0;
      if (thickness <= 0.125) {
        coatType = "Finish coat";
        coverage50lb = Math.ceil(area / 100); // 100 sq ft per 50lb bag at 1/8"
      } else if (thickness <= 0.25) {
        coatType = "Finish coat";
        coverage50lb = Math.ceil(area / 80); // 80 sq ft per 50lb bag at 1/4"
      } else {
        coatType = "Base coat";
        coverage50lb = Math.ceil(area / 40); // 40 sq ft per 50lb bag at 1/2"
      }
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Plaster Material Needed:</h4>
          <p><strong>${volumeCubicFeet.toFixed(2)} cubic feet</strong></p>
          <p><strong>${volumeCubicYards.toFixed(3)} cubic yards</strong></p>
          <p>Coverage: ${area} sq ft at ${thickness}\" thick</p>
        </div>
        <div class="result-bags">
          <h4>Bag Estimates:</h4>
          <p><strong>50lb bags:</strong> ${bags50lb} bags (standard calculation)</p>
          <p><strong>25lb bags:</strong> ${bags25lb} bags</p>
          <p><strong>By coverage method:</strong> ${coverage50lb} bags (50lb)</p>
          <p>Coat type: ${coatType}</p>
        </div>
        <div class="result-tips">
          <p><em>🔧 Always order 10-15% extra for waste and touch-ups</em></p>
          <p><em>⏱️ Apply in thin, multiple coats for best results</em></p>
          <p><em>💧 Keep surface moist during curing for maximum strength</em></p>
        </div>
      `;
    });
  }
});