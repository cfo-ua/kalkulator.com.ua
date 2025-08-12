document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('projectile-form');
  const result = document.getElementById('projectile-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get input values
      const v0 = parseFloat(document.getElementById('v0').value) || 20;
      const angleDeg = parseFloat(document.getElementById('angle').value) || 45;
      const h0 = parseFloat(document.getElementById('h0').value) || 0;
      const g = parseFloat(document.getElementById('g').value) || 9.81;
      
      // Validate inputs
      if (v0 <= 0 || angleDeg < 0 || angleDeg > 90 || g <= 0) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Invalid Data</h6>
            <p>Please check the entered values:<br>
            • Initial velocity > 0<br>
            • Angle: 0° - 90°<br>
            • Gravitational acceleration > 0</p>
          </div>
        `;
        return;
      }
      
      // Convert angle to radians
      const angle = angleDeg * Math.PI / 180;
      
      // Calculate projectile motion parameters
      const vx = v0 * Math.cos(angle);  // Horizontal velocity component
      const vy = v0 * Math.sin(angle);  // Vertical velocity component
      
      // Time to reach maximum height
      const timeToMax = vy / g;
      
      // Maximum height above launch point
      const maxHeightAboveLaunch = (vy * vy) / (2 * g);
      const maxHeight = h0 + maxHeightAboveLaunch;
      
      // Total flight time (using quadratic formula)
      const discriminant = vy * vy + 2 * g * h0;
      const totalTime = (vy + Math.sqrt(discriminant)) / g;
      
      // Range (horizontal distance)
      const range = vx * totalTime;
      
      // Calculate trajectory points for visualization
      const trajectoryPoints = [];
      const numPoints = 20;
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * totalTime;
        const x = vx * t;
        const y = h0 + vy * t - 0.5 * g * t * t;
        if (y >= 0) {
          trajectoryPoints.push({ x: x.toFixed(1), y: y.toFixed(1) });
        }
      }
      
      displayResults({
        v0, angleDeg, h0, g,
        vx, vy, maxHeight, totalTime, range, timeToMax,
        trajectoryPoints
      });
    });
  }
  
  function displayResults(data) {
    let html = '<div class="insight-cards">';
    
    // Main results
    html += `
      <div class="insight-card success">
        <h6>🎯 Range</h6>
        <div class="big-number">${data.range.toFixed(2)}</div>
        <div>m</div>
      </div>
      
      <div class="insight-card info">
        <h6>⬆️ Maximum Height</h6>
        <div class="big-number">${data.maxHeight.toFixed(2)}</div>
        <div>m</div>
      </div>
      
      <div class="insight-card info">
        <h6>⏱️ Flight Time</h6>
        <div class="big-number">${data.totalTime.toFixed(2)}</div>
        <div>s</div>
      </div>
      
      <div class="insight-card info">
        <h6>📈 Time to Peak</h6>
        <div class="big-number">${data.timeToMax.toFixed(2)}</div>
        <div>s</div>
      </div>
    `;
    
    html += '</div>';
    
    // Velocity components
    html += `
      <h4>🧭 Velocity Components:</h4>
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>Horizontal (vₓ)</h6>
          <div class="result-value">${data.vx.toFixed(2)} m/s</div>
        </div>
        <div class="insight-card info">
          <h6>Vertical (vᵧ)</h6>
          <div class="result-value">${data.vy.toFixed(2)} m/s</div>
        </div>
      </div>
    `;
    
    // Trajectory table
    html += `
      <h4>📊 Trajectory Points:</h4>
      <div style="overflow-x: auto; margin: 1rem 0;">
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--card-bg);">
              <th style="padding: 0.5rem; border: 1px solid var(--border);">x (m)</th>
              <th style="padding: 0.5rem; border: 1px solid var(--border);">y (m)</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Show every 4th point to avoid clutter
    data.trajectoryPoints.filter((_, i) => i % 4 === 0).forEach(point => {
      html += `
        <tr>
          <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${point.x}</td>
          <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${point.y}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
    
    // Physics explanation
    html += `
      <h4>📋 Formulas Used:</h4>
      <ul>
        <li><strong>vₓ = v₀ cos(θ)</strong> - horizontal velocity component</li>
        <li><strong>vᵧ = v₀ sin(θ)</strong> - vertical velocity component</li>
        <li><strong>h = h₀ + v₀²sin²(θ)/(2g)</strong> - maximum height</li>
        <li><strong>R = vₓ × t</strong> - range</li>
        <li><strong>t = (vᵧ + √(vᵧ² + 2gh₀))/g</strong> - flight time</li>
      </ul>
    `;
    
    // Tips
    html += `
      <div class="insight-card" style="margin-top: 1rem;">
        <h6>💡 Useful Information:</h6>
        <ul style="text-align: left; margin: 0;">
          <li>For maximum range at h₀=0, use 45° angle</li>
          <li>Trajectory follows a parabolic path</li>
          <li>Horizontal velocity remains constant</li>
          <li>At maximum height, vertical velocity = 0</li>
        </ul>
      </div>
    `;
    
    document.getElementById('projectile-result').innerHTML = html;
  }
});