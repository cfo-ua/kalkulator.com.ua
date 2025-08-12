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
            <h6>⚠️ Некоректні дані</h6>
            <p>Перевірте правильність введених значень:<br>
            • Початкова швидкість > 0<br>
            • Кут: 0° - 90°<br>
            • Прискорення вільного падіння > 0</p>
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
        <h6>🎯 Дальність польоту</h6>
        <div class="big-number">${data.range.toFixed(2)}</div>
        <div>м</div>
      </div>
      
      <div class="insight-card info">
        <h6>⬆️ Максимальна висота</h6>
        <div class="big-number">${data.maxHeight.toFixed(2)}</div>
        <div>м</div>
      </div>
      
      <div class="insight-card info">
        <h6>⏱️ Час польоту</h6>
        <div class="big-number">${data.totalTime.toFixed(2)}</div>
        <div>с</div>
      </div>
      
      <div class="insight-card info">
        <h6>📈 Час до максимуму</h6>
        <div class="big-number">${data.timeToMax.toFixed(2)}</div>
        <div>с</div>
      </div>
    `;
    
    html += '</div>';
    
    // Velocity components
    html += `
      <h4>🧭 Складові швидкості:</h4>
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>Горизонтальна (vₓ)</h6>
          <div class="result-value">${data.vx.toFixed(2)} м/с</div>
        </div>
        <div class="insight-card info">
          <h6>Вертикальна (vᵧ)</h6>
          <div class="result-value">${data.vy.toFixed(2)} м/с</div>
        </div>
      </div>
    `;
    
    // Trajectory table
    html += `
      <h4>📊 Точки траєкторії:</h4>
      <div style="overflow-x: auto; margin: 1rem 0;">
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--card-bg);">
              <th style="padding: 0.5rem; border: 1px solid var(--border);">x (м)</th>
              <th style="padding: 0.5rem; border: 1px solid var(--border);">y (м)</th>
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
      <h4>📋 Використані формули:</h4>
      <ul>
        <li><strong>vₓ = v₀ cos(θ)</strong> - горизонтальна складова швидкості</li>
        <li><strong>vᵧ = v₀ sin(θ)</strong> - вертикальна складова швидкості</li>
        <li><strong>h = h₀ + v₀²sin²(θ)/(2g)</strong> - максимальна висота</li>
        <li><strong>R = vₓ × t</strong> - дальність польоту</li>
        <li><strong>t = (vᵧ + √(vᵧ² + 2gh₀))/g</strong> - час польоту</li>
      </ul>
    `;
    
    // Tips
    html += `
      <div class="insight-card" style="margin-top: 1rem;">
        <h6>💡 Корисна інформація:</h6>
        <ul style="text-align: left; margin: 0;">
          <li>Для максимальної дальності при h₀=0 використовуйте кут 45°</li>
          <li>Траєкторія має форму параболи</li>
          <li>Горизонтальна швидкість залишається постійною</li>
          <li>У найвищій точці вертикальна швидкість = 0</li>
        </ul>
      </div>
    `;
    
    document.getElementById('projectile-result').innerHTML = html;
  }
});