document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("triple-integral-form");
  const result = document.getElementById("triple-integral-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      try {
        const functionStr = document.getElementById("function").value.trim();
        const xLower = document.getElementById("x-lower").value.trim();
        const xUpper = document.getElementById("x-upper").value.trim();
        const yLower = document.getElementById("y-lower").value.trim();
        const yUpper = document.getElementById("y-upper").value.trim();
        const zLower = document.getElementById("z-lower").value.trim();
        const zUpper = document.getElementById("z-upper").value.trim();
        const precision = parseInt(document.getElementById("precision").value);

        // Parse the function
        const f = math.parse(functionStr);
        
        // Convert bounds to numbers (simplified - assume they are constants for now)
        const bounds = {
          x: [parseFloat(xLower), parseFloat(xUpper)],
          y: [parseFloat(yLower), parseFloat(yUpper)],
          z: [parseFloat(zLower), parseFloat(zUpper)]
        };

        // Calculate triple integral using numerical integration (Monte Carlo method)
        const integralResult = calculateTripleIntegral(f, bounds, precision * 1000);
        
        // Display result
        displayResult(integralResult, functionStr, bounds);
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Calculation Error</h6>
            <p>Please check the correctness of the entered expression and integration bounds.</p>
            <p><strong>Details:</strong> ${error.message}</p>
          </div>
        `;
      }
    });
  }

  function calculateTripleIntegral(f, bounds, samples) {
    // Monte Carlo integration for triple integrals
    const [xMin, xMax] = bounds.x;
    const [yMin, yMax] = bounds.y;
    const [zMin, zMax] = bounds.z;
    
    const volume = (xMax - xMin) * (yMax - yMin) * (zMax - zMin);
    let sum = 0;
    
    for (let i = 0; i < samples; i++) {
      const x = xMin + Math.random() * (xMax - xMin);
      const y = yMin + Math.random() * (yMax - yMin);
      const z = zMin + Math.random() * (zMax - zMin);
      
      try {
        const value = f.evaluate({ x: x, y: y, z: z });
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          sum += value;
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    return (sum / samples) * volume;
  }

  function displayResult(result, functionStr, bounds) {
    const formattedResult = typeof result === 'number' ? result.toFixed(6) : 'Undefined';
    const volume = (bounds.x[1] - bounds.x[0]) * (bounds.y[1] - bounds.y[0]) * (bounds.z[1] - bounds.z[0]);
    
    const html = `
      <div class="insight-card success">
        <h6>🎯 Triple Integral Calculation Result</h6>
        <div class="result-display">
          <p><strong>Function:</strong> f(x,y,z) = ${functionStr}</p>
          <p><strong>Integration bounds:</strong></p>
          <ul>
            <li>x: from ${bounds.x[0]} to ${bounds.x[1]}</li>
            <li>y: from ${bounds.y[0]} to ${bounds.y[1]}</li>
            <li>z: from ${bounds.z[0]} to ${bounds.z[1]}</li>
          </ul>
          <div class="main-result">
            <p><strong>∫∫∫ f(x,y,z) dxdydz = ${formattedResult}</strong></p>
          </div>
        </div>
      </div>
      
      <div class="insight-card info">
        <h6>📊 Additional Information</h6>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
          <div>
            <p><strong>Region volume:</strong></p>
            <p>${volume.toFixed(6)}</p>
          </div>
          <div>
            <p><strong>Average function value:</strong></p>
            <p>${(parseFloat(formattedResult) / volume).toFixed(6)}</p>
          </div>
        </div>
        
        <hr style="margin: 15px 0; border: 1px solid #e0e0e0;">
        
        <h6>💡 Result Interpretation</h6>
        <ul>
          <li>If f(x,y,z) = 1, then the result is the <strong>volume</strong> of the integration region</li>
          <li>If f(x,y,z) is density, then the result is the <strong>mass</strong> of the body</li>
          <li>For negative values, the result can be negative</li>
        </ul>
      </div>
      
      <div class="insight-card">
        <h6>🔧 Calculation Method</h6>
        <p>Monte Carlo method used for numerical integration. Accuracy depends on the number of random points.</p>
        <p><strong>Note:</strong> For exact analytical results, we recommend verifying the answer with other methods.</p>
      </div>
    `;
    
    result.innerHTML = html;
  }
});