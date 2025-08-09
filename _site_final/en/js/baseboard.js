document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('baseboard-form');
  const result = document.getElementById('baseboard-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('baseboard-length').value);
      const width = parseFloat(document.getElementById('baseboard-width').value);
      const doors = parseFloat(document.getElementById('baseboard-doors').value) || 0;
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Please enter room length and width.";
        return;
      }
      
      const perimeter = 2 * (length + width);
      let baseboardNeeded = perimeter - doors;
      if (baseboardNeeded < 0) baseboardNeeded = 0;
      
      // Calculate with 10% waste factor
      const baseboardWithWaste = baseboardNeeded * 1.1;
      
      // Calculate number of pieces needed (assuming 8ft standard lengths)
      const pieces8ft = Math.ceil(baseboardWithWaste / 8);
      const pieces12ft = Math.ceil(baseboardWithWaste / 12);
      const pieces16ft = Math.ceil(baseboardWithWaste / 16);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Baseboard Length Needed:</h4>
          <p><strong>${baseboardNeeded.toFixed(1)} linear feet</strong> (exact)</p>
          <p><strong>${baseboardWithWaste.toFixed(1)} linear feet</strong> (with 10% waste)</p>
          <p>Room perimeter: ${perimeter.toFixed(1)} ft</p>
          ${doors > 0 ? `<p>Minus door openings: ${doors} ft</p>` : ''}
        </div>
        <div class="result-pieces">
          <h4>Material Purchasing Options:</h4>
          <p><strong>8-foot pieces:</strong> ${pieces8ft} pieces (${pieces8ft * 8} total ft)</p>
          <p><strong>12-foot pieces:</strong> ${pieces12ft} pieces (${pieces12ft * 12} total ft)</p>
          <p><strong>16-foot pieces:</strong> ${pieces16ft} pieces (${pieces16ft * 16} total ft)</p>
        </div>
        <div class="result-tips">
          <p><em>🔨 Plan cuts to minimize waste and joints</em></p>
          <p><em>📐 Use longer pieces to reduce visible seams</em></p>
          <p><em>✂️ Account for 45° miter cuts at corners</em></p>
        </div>
      `;
    });
  }
});