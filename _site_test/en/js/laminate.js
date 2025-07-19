document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('laminate-form');
  const result = document.getElementById('laminate-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('laminate-area').value);
      const pack = parseFloat(document.getElementById('laminate-pack').value);
      const waste = parseFloat(document.getElementById('laminate-waste').value) || 0;
      
      if (area <= 0 || pack <= 0) {
        result.textContent = "Please enter room area and coverage per box.";
        return;
      }
      
      const totalArea = area * (1 + waste / 100);
      const packs = Math.ceil(totalArea / pack);
      const actualCoverage = packs * pack;
      const extraMaterial = actualCoverage - area;
      const extraPercent = (extraMaterial / area) * 100;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Laminate Flooring Needed:</h4>
          <p><strong>${packs} boxes</strong> required</p>
          <p>Total coverage: ${actualCoverage.toFixed(0)} sq ft</p>
          <p>Room area: ${area} sq ft</p>
        </div>
        <div class="result-details">
          <h4>Material Breakdown:</h4>
          <p>Base area: ${area} sq ft</p>
          <p>With ${waste}% waste factor: ${totalArea.toFixed(1)} sq ft</p>
          <p>Extra material for future repairs: ${extraMaterial.toFixed(1)} sq ft (${extraPercent.toFixed(1)}%)</p>
        </div>
        <div class="result-tips">
          <p><em>📦 Each box covers ${pack} sq ft</em></p>
          <p><em>✨ Store extra planks in a dry place for future repairs</em></p>
          <p><em>🔍 Check all boxes for defects before installation</em></p>
        </div>
      `;
    });
  }
});