document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('circumference-form');
  const result = document.getElementById('circumference-result');
  const radiusInput = document.getElementById('radius-input');
  const diameterInput = document.getElementById('diameter-input');
  
  if (form) {
    // Sync radius and diameter inputs
    radiusInput.addEventListener('input', function() {
      if (this.value) {
        diameterInput.value = (parseFloat(this.value) * 2).toString();
      }
    });
    
    diameterInput.addEventListener('input', function() {
      if (this.value) {
        radiusInput.value = (parseFloat(this.value) / 2).toString();
      }
    });
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      let radius = parseFloat(radiusInput.value);
      let diameter = parseFloat(diameterInput.value);
      
      // Determine which input to use
      if (!isNaN(radius) && radius > 0) {
        diameter = radius * 2;
      } else if (!isNaN(diameter) && diameter > 0) {
        radius = diameter / 2;
      } else {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Error</h6><p>Please enter radius or diameter (positive number).</p></div>';
        return;
      }
      
      try {
        const circumference = 2 * Math.PI * radius;
        const area = Math.PI * radius * radius;
        
        result.innerHTML = `
          <div class="insight-card success">
            <h6>📐 Calculation Results</h6>
            <div class="big-number">C = ${circumference.toFixed(4)}</div>
            <p><em>💡 Circumference using formula C = 2πr</em></p>
          </div>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔴 Radius</h6>
              <div class="big-number">${radius.toFixed(2)}</div>
            </div>
            <div class="insight-card info">
              <h6>↔️ Diameter</h6>
              <div class="big-number">${diameter.toFixed(2)}</div>
            </div>
            <div class="insight-card info">
              <h6>⭕ Circle Area</h6>
              <div class="big-number">${area.toFixed(4)}</div>
            </div>
          </div>
          
          <div class="insight-card">
            <h6>📊 Additional Information</h6>
            <table>
              <tr><td><strong>Circumference:</strong></td><td>${circumference.toFixed(6)}</td></tr>
              <tr><td><strong>Circle Area:</strong></td><td>${area.toFixed(6)}</td></tr>
              <tr><td><strong>Radius:</strong></td><td>${radius.toFixed(6)}</td></tr>
              <tr><td><strong>Diameter:</strong></td><td>${diameter.toFixed(6)}</td></tr>
              <tr><td><strong>Pi (π):</strong></td><td>${Math.PI.toFixed(6)}</td></tr>
            </table>
          </div>
        `;
        
      } catch (error) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Error</h6><p>Unable to calculate result.</p></div>';
      }
    });
    
    // Calculate on page load with default values
    form.dispatchEvent(new Event('submit'));
  }
});