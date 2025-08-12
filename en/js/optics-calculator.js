document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('optics-form');
  const result = document.getElementById('optics-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get input values
      const f = parseFloat(document.getElementById('focal-length').value);
      const do_val = parseFloat(document.getElementById('object-distance').value);
      const di_val = parseFloat(document.getElementById('image-distance').value);
      const ho = parseFloat(document.getElementById('object-height').value);
      const hi = parseFloat(document.getElementById('image-height').value);
      const opticsType = document.querySelector('input[name="optics-type"]:checked').value;
      
      // Count known variables for main calculation
      const knownMain = [f, do_val, di_val].filter(val => !isNaN(val));
      
      if (knownMain.length < 2) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Insufficient Data</h6>
            <p>Enter at least 2 of the 3 main parameters:<br>
            • Focal length (f)<br>
            • Object distance (d₀)<br>
            • Image distance (dᵢ)</p>
          </div>
        `;
        return;
      }
      
      let results = {
        f: isNaN(f) ? null : f,
        do: isNaN(do_val) ? null : do_val,
        di: isNaN(di_val) ? null : di_val,
        ho: isNaN(ho) ? null : ho,
        hi: isNaN(hi) ? null : hi,
        opticsType: opticsType
      };
      
      try {
        // Calculate missing optical parameters using lens/mirror equation: 1/f = 1/do + 1/di
        
        // If we know f and do, calculate di
        if (!isNaN(f) && !isNaN(do_val) && isNaN(di_val)) {
          if (f !== 0 && do_val !== f) {
            results.di = (f * do_val) / (do_val - f);
          }
        }
        
        // If we know f and di, calculate do
        if (!isNaN(f) && isNaN(do_val) && !isNaN(di_val)) {
          if (f !== 0 && di_val !== f) {
            results.do = (f * di_val) / (di_val - f);
          }
        }
        
        // If we know do and di, calculate f
        if (isNaN(f) && !isNaN(do_val) && !isNaN(di_val)) {
          if (do_val !== 0 && di_val !== 0) {
            results.f = (do_val * di_val) / (do_val + di_val);
          }
        }
        
        // Calculate magnification if possible
        let magnification = null;
        if (results.do !== null && results.di !== null && results.do !== 0) {
          magnification = -results.di / results.do;
        }
        
        // Calculate missing heights
        if (magnification !== null) {
          if (results.ho !== null && results.hi === null) {
            results.hi = magnification * results.ho;
          }
          if (results.hi !== null && results.ho === null && magnification !== 0) {
            results.ho = results.hi / magnification;
          }
        }
        
        // Calculate optical power
        let opticalPower = null;
        if (results.f !== null && results.f !== 0) {
          opticalPower = 100 / results.f; // Convert cm to m and calculate diopters
        }
        
        displayResults(results, magnification, opticalPower);
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Calculation Error</h6>
            <p>Please check the entered data. Some values may lead to undefined results.</p>
          </div>
        `;
      }
    });
  }
  
  function displayResults(results, magnification, opticalPower) {
    let html = '<div class="insight-cards">';
    
    // Main optical parameters
    if (results.f !== null) {
      const fType = results.f > 0 ? 'success' : 'warning';
      const fDesc = results.f > 0 ? 
        (results.opticsType === 'lens' ? 'Converging lens' : 'Concave mirror') :
        (results.opticsType === 'lens' ? 'Diverging lens' : 'Convex mirror');
      html += `
        <div class="insight-card ${fType}">
          <h6>🔍 Focal Length</h6>
          <div class="big-number">${results.f.toFixed(2)}</div>
          <div>cm</div>
          <small>${fDesc}</small>
        </div>
      `;
    }
    
    if (results.do !== null) {
      html += `
        <div class="insight-card info">
          <h6>📏 Object Distance</h6>
          <div class="big-number">${results.do.toFixed(2)}</div>
          <div>cm</div>
        </div>
      `;
    }
    
    if (results.di !== null) {
      const diType = results.di > 0 ? 'success' : 'warning';
      const diDesc = results.di > 0 ? 'Real image' : 'Virtual image';
      html += `
        <div class="insight-card ${diType}">
          <h6>📐 Image Distance</h6>
          <div class="big-number">${results.di.toFixed(2)}</div>
          <div>cm</div>
          <small>${diDesc}</small>
        </div>
      `;
    }
    
    if (magnification !== null) {
      const magType = Math.abs(magnification) > 1 ? 'success' : 'info';
      const magDesc = magnification > 0 ? 'Upright' : 'Inverted';
      html += `
        <div class="insight-card ${magType}">
          <h6>🔍 Magnification</h6>
          <div class="big-number">${magnification.toFixed(2)}×</div>
          <small>${magDesc} image</small>
        </div>
      `;
    }
    
    html += '</div>';
    
    // Heights section
    if (results.ho !== null || results.hi !== null) {
      html += `<h4>📏 Dimensions:</h4><div class="insight-cards">`;
      
      if (results.ho !== null) {
        html += `
          <div class="insight-card info">
            <h6>Object Height</h6>
            <div class="result-value">${results.ho.toFixed(2)} cm</div>
          </div>
        `;
      }
      
      if (results.hi !== null) {
        html += `
          <div class="insight-card info">
            <h6>Image Height</h6>
            <div class="result-value">${results.hi.toFixed(2)} cm</div>
          </div>
        `;
      }
      
      html += '</div>';
    }
    
    // Additional parameters
    if (opticalPower !== null) {
      html += `
        <h4>⚡ Additional Parameters:</h4>
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>Optical Power</h6>
            <div class="result-value">${opticalPower.toFixed(2)} D</div>
          </div>
        </div>
      `;
    }
    
    // Analysis
    html += `<h4>📋 Results Analysis:</h4><ul>`;
    
    if (results.f !== null) {
      if (results.f > 0) {
        html += `<li>✅ ${results.opticsType === 'lens' ? 'Converging lens' : 'Concave mirror'} (positive focus)</li>`;
      } else {
        html += `<li>⚠️ ${results.opticsType === 'lens' ? 'Diverging lens' : 'Convex mirror'} (negative focus)</li>`;
      }
    }
    
    if (results.di !== null) {
      if (results.di > 0) {
        html += `<li>✅ Real image (can be projected on screen)</li>`;
      } else {
        html += `<li>ℹ️ Virtual image (visible only through the device)</li>`;
      }
    }
    
    if (magnification !== null) {
      if (Math.abs(magnification) > 1) {
        html += `<li>🔍 Enlarged image (|m| > 1)</li>`;
      } else if (Math.abs(magnification) < 1) {
        html += `<li>🔎 Reduced image (|m| < 1)</li>`;
      } else {
        html += `<li>📏 Life-size image (|m| = 1)</li>`;
      }
      
      if (magnification > 0) {
        html += `<li>⬆️ Upright image (not inverted)</li>`;
      } else {
        html += `<li>⬇️ Inverted image (upside down)</li>`;
      }
    }
    
    html += `</ul>`;
    
    // Formulas used
    html += `
      <h4>📐 Formulas Used:</h4>
      <ul>
        <li><strong>1/f = 1/d₀ + 1/dᵢ</strong> - thin lens/mirror equation</li>
        <li><strong>m = -dᵢ/d₀</strong> - linear magnification</li>
        <li><strong>m = hᵢ/h₀</strong> - magnification from heights</li>
        <li><strong>D = 1/f</strong> - optical power (in diopters)</li>
      </ul>
    `;
    
    document.getElementById('optics-result').innerHTML = html;
  }
});