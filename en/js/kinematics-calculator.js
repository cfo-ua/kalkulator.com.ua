document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('kinematics-form');
  const result = document.getElementById('kinematics-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get input values
      const v0 = parseFloat(document.getElementById('v0').value);
      const v = parseFloat(document.getElementById('v').value);
      const a = parseFloat(document.getElementById('a').value);
      const t = parseFloat(document.getElementById('t').value);
      const s = parseFloat(document.getElementById('s').value);
      
      // Count known variables
      const known = [v0, v, a, t, s].filter(val => !isNaN(val));
      
      if (known.length < 3) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Insufficient Data</h6>
            <p>Enter at least 3 known quantities to perform calculations</p>
          </div>
        `;
        return;
      }
      
      // Create results object
      let results = {
        v0: isNaN(v0) ? null : v0,
        v: isNaN(v) ? null : v,
        a: isNaN(a) ? null : a,
        t: isNaN(t) ? null : t,
        s: isNaN(s) ? null : s
      };
      
      // Calculate missing values using kinematic equations
      try {
        // If we know v0, a, t but not v or s
        if (!isNaN(v0) && !isNaN(a) && !isNaN(t)) {
          if (isNaN(v)) results.v = v0 + a * t;
          if (isNaN(s)) results.s = v0 * t + 0.5 * a * t * t;
        }
        
        // If we know v, a, t but not v0 or s
        if (!isNaN(v) && !isNaN(a) && !isNaN(t)) {
          if (isNaN(v0)) results.v0 = v - a * t;
          if (isNaN(s)) results.s = v * t - 0.5 * a * t * t;
        }
        
        // If we know v0, v, a but not t or s
        if (!isNaN(v0) && !isNaN(v) && !isNaN(a)) {
          if (isNaN(t) && a !== 0) results.t = (v - v0) / a;
          if (isNaN(s)) results.s = (v * v - v0 * v0) / (2 * a);
        }
        
        // If we know v0, v, t but not a or s
        if (!isNaN(v0) && !isNaN(v) && !isNaN(t)) {
          if (isNaN(a) && t !== 0) results.a = (v - v0) / t;
          if (isNaN(s)) results.s = (v0 + v) * t / 2;
        }
        
        // If we know v0, a, s but not v or t
        if (!isNaN(v0) && !isNaN(a) && !isNaN(s)) {
          if (isNaN(v)) {
            const vSquared = v0 * v0 + 2 * a * s;
            results.v = vSquared >= 0 ? Math.sqrt(vSquared) : null;
          }
          if (isNaN(t) && a !== 0) {
            // Using quadratic formula: s = v0*t + 0.5*a*t²
            const discriminant = v0 * v0 + 2 * a * s;
            if (discriminant >= 0 && a !== 0) {
              results.t = (-v0 + Math.sqrt(discriminant)) / a;
            }
          }
        }
        
        // If we know v, a, s but not v0 or t
        if (!isNaN(v) && !isNaN(a) && !isNaN(s)) {
          if (isNaN(v0)) {
            const v0Squared = v * v - 2 * a * s;
            results.v0 = v0Squared >= 0 ? Math.sqrt(v0Squared) : null;
          }
          if (isNaN(t) && a !== 0) results.t = (v - results.v0) / a;
        }
        
        // If we know v0, v, s but not a or t
        if (!isNaN(v0) && !isNaN(v) && !isNaN(s)) {
          if (isNaN(a) && s !== 0) results.a = (v * v - v0 * v0) / (2 * s);
          if (isNaN(t) && (v0 + v) !== 0) results.t = 2 * s / (v0 + v);
        }
        
        // If we know v0, t, s but not v or a
        if (!isNaN(v0) && !isNaN(t) && !isNaN(s)) {
          if (isNaN(a) && t !== 0) results.a = 2 * (s - v0 * t) / (t * t);
          if (isNaN(v)) results.v = v0 + results.a * t;
        }
        
        // If we know v, t, s but not v0 or a
        if (!isNaN(v) && !isNaN(t) && !isNaN(s)) {
          if (isNaN(v0) && t !== 0) results.v0 = 2 * s / t - v;
          if (isNaN(a) && t !== 0) results.a = (v - results.v0) / t;
        }
        
        // If we know a, t, s but not v0 or v
        if (!isNaN(a) && !isNaN(t) && !isNaN(s)) {
          if (isNaN(v0) && t !== 0) results.v0 = (s - 0.5 * a * t * t) / t;
          if (isNaN(v)) results.v = results.v0 + a * t;
        }
        
        displayResults(results);
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Calculation Error</h6>
            <p>Please check the entered data for validity</p>
          </div>
        `;
      }
    });
  }
  
  function displayResults(results) {
    let html = '<div class="insight-cards">';
    
    if (results.v0 !== null) {
      html += `
        <div class="insight-card info">
          <h6>Initial Velocity</h6>
          <div class="big-number">${results.v0.toFixed(2)}</div>
          <div>m/s</div>
        </div>
      `;
    }
    
    if (results.v !== null) {
      html += `
        <div class="insight-card info">
          <h6>Final Velocity</h6>
          <div class="big-number">${results.v.toFixed(2)}</div>
          <div>m/s</div>
        </div>
      `;
    }
    
    if (results.a !== null) {
      html += `
        <div class="insight-card ${results.a >= 0 ? 'success' : 'warning'}">
          <h6>Acceleration</h6>
          <div class="big-number">${results.a.toFixed(2)}</div>
          <div>m/s²</div>
        </div>
      `;
    }
    
    if (results.t !== null) {
      html += `
        <div class="insight-card info">
          <h6>Time</h6>
          <div class="big-number">${results.t.toFixed(2)}</div>
          <div>s</div>
        </div>
      `;
    }
    
    if (results.s !== null) {
      html += `
        <div class="insight-card info">
          <h6>Displacement</h6>
          <div class="big-number">${results.s.toFixed(2)}</div>
          <div>m</div>
        </div>
      `;
    }
    
    html += '</div>';
    
    // Add explanation
    html += `
      <div style="margin-top: 2rem;">
        <h4>📋 Equations Used:</h4>
        <ul>
          <li><strong>v = v₀ + at</strong> - for finding velocity</li>
          <li><strong>s = v₀t + ½at²</strong> - for finding displacement</li>
          <li><strong>v² = v₀² + 2as</strong> - velocity-displacement relationship</li>
        </ul>
      </div>
    `;
    
    document.getElementById('kinematics-result').innerHTML = html;
  }
});