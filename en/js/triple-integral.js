function initTripleIntegralCalculator() {
  const form = document.getElementById("triple-integral-form");
  const result = document.getElementById("triple-integral-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      try {
        const functionStr = document.getElementById("function").value.trim();
        const xLower = parseFloat(document.getElementById("x-lower").value.trim());
        const xUpper = parseFloat(document.getElementById("x-upper").value.trim());
        const yLower = parseFloat(document.getElementById("y-lower").value.trim());
        const yUpper = parseFloat(document.getElementById("y-upper").value.trim());
        const zLower = parseFloat(document.getElementById("z-lower").value.trim());
        const zUpper = parseFloat(document.getElementById("z-upper").value.trim());
        const precision = parseInt(document.getElementById("precision").value);

        // Validate inputs
        if (isNaN(xLower) || isNaN(xUpper) || isNaN(yLower) || isNaN(yUpper) || isNaN(zLower) || isNaN(zUpper)) {
          throw new Error("All integration bounds must be numbers");
        }

        // Create function evaluator
        const f = createFunctionEvaluator(functionStr);
        const bounds = {
          x: [xLower, xUpper],
          y: [yLower, yUpper],
          z: [zLower, zUpper]
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

  function createFunctionEvaluator(functionStr) {
    // Basic function parser and evaluator
    const normalizedFunction = functionStr
      .replace(/\^/g, '**')  // Replace ^ with **
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/ln/g, 'Math.log')
      .replace(/log/g, 'Math.log10')
      .replace(/exp/g, 'Math.exp');

    return function(x, y, z) {
      try {
        // Use Function constructor to evaluate expression
        // Replace variables with actual values
        const expr = normalizedFunction
          .replace(/x/g, `(${x})`)
          .replace(/y/g, `(${y})`)
          .replace(/z/g, `(${z})`);
        
        return Function('"use strict"; return (' + expr + ')')();
      } catch (e) {
        throw new Error("Invalid function format");
      }
    };
  }

  function calculateTripleIntegral(f, bounds, samples) {
    // Monte Carlo integration for triple integrals
    const [xMin, xMax] = bounds.x;
    const [yMin, yMax] = bounds.y;
    const [zMin, zMax] = bounds.z;
    
    const volume = (xMax - xMin) * (yMax - yMin) * (zMax - zMin);
    let sum = 0;
    let validSamples = 0;
    
    for (let i = 0; i < samples; i++) {
      const x = xMin + Math.random() * (xMax - xMin);
      const y = yMin + Math.random() * (yMax - yMin);
      const z = zMin + Math.random() * (zMax - zMin);
      
      try {
        const value = f(x, y, z);
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          sum += value;
          validSamples++;
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    if (validSamples === 0) {
      throw new Error("Could not evaluate function at any point");
    }
    
    return (sum / validSamples) * volume;
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
        <h6>🧮 Supported Functions</h6>
        <ul>
          <li><strong>Basic operations:</strong> +, -, *, /, ^ (or **)</li>
          <li><strong>Trigonometric:</strong> sin, cos, tan</li>
          <li><strong>Other:</strong> sqrt, ln, log, exp</li>
          <li><strong>Examples:</strong> x*y*z, x^2+y^2+z^2, sin(x)*cos(y)</li>
        </ul>
      </div>
    `;
    
    result.innerHTML = html;
  }
}

// Initialize the calculator when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTripleIntegralCalculator);
} else {
  initTripleIntegralCalculator();
}