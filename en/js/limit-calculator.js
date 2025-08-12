document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("limit-form");
  const result = document.getElementById("limit-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      try {
        const functionStr = document.getElementById("limit-function").value.trim();
        const pointStr = document.getElementById("limit-point").value.trim();
        const limitType = document.getElementById("limit-type").value;
        const showSteps = document.getElementById("show-steps").checked;
        const checkContinuity = document.getElementById("check-continuity").checked;

        // Parse function
        let f;
        try {
          // Replace common notations and create function evaluator
          const normalizedFunction = functionStr
            .replace(/\bln\(/g, "log(")
            .replace(/\be\^/g, "exp(")
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log')
            .replace(/exp/g, 'Math.exp');
          
          f = function(x) {
            try {
              const expr = normalizedFunction.replace(/x/g, `(${x})`);
              return Function('"use strict"; return (' + expr + ')')();
            } catch (e) {
              throw new Error("Invalid function format");
            }
          };
        } catch (e) {
          throw new Error("Invalid function format");
        }

        // Parse point
        let point;
        if (pointStr.toLowerCase() === 'infinity' || pointStr === '∞' || pointStr === 'inf') {
          point = Infinity;
        } else if (pointStr.toLowerCase() === '-infinity' || pointStr === '-∞') {
          point = -Infinity;
        } else {
          point = parseFloat(pointStr);
          if (isNaN(point)) {
            throw new Error("Invalid point format");
          }
        }

        // Calculate limit
        const limitResult = calculateLimit(f, point, limitType);
        
        // Check continuity if requested
        let continuityResult = null;
        if (checkContinuity && isFinite(point)) {
          continuityResult = checkFunctionContinuity(f, point);
        }
        
        // Display result
        displayLimitResult(limitResult, functionStr, point, limitType, showSteps, continuityResult);
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Calculation Error</h6>
            <p>Please check the correctness of the entered expression and point.</p>
            <p><strong>Details:</strong> ${error.message}</p>
          </div>
        `;
      }
    });
  }

  function calculateLimit(f, point, type) {
    const h = 0.000001; // Small step for numerical calculation
    
    if (point === Infinity) {
      return calculateLimitAtInfinity(f, true);
    } else if (point === -Infinity) {
      return calculateLimitAtInfinity(f, false);
    }
    
    let leftLimit, rightLimit;
    
    try {
      // Calculate left limit
      leftLimit = calculateNumericalLimit(f, point, -h);
    } catch (e) {
      leftLimit = null;
    }
    
    try {
      // Calculate right limit
      rightLimit = calculateNumericalLimit(f, point, h);
    } catch (e) {
      rightLimit = null;
    }
    
    if (type === 'left') {
      return { value: leftLimit, type: 'left', exists: leftLimit !== null };
    } else if (type === 'right') {
      return { value: rightLimit, type: 'right', exists: rightLimit !== null };
    } else {
      // Two-sided limit
      const exists = leftLimit !== null && rightLimit !== null && 
                    Math.abs(leftLimit - rightLimit) < 0.0001;
      return {
        value: exists ? leftLimit : null,
        leftValue: leftLimit,
        rightValue: rightLimit,
        type: 'both',
        exists: exists
      };
    }
  }

  function calculateNumericalLimit(f, point, direction) {
    const steps = 10;
    let h = direction > 0 ? 0.1 : -0.1;
    
    for (let i = 0; i < steps; i++) {
      const x = point + h;
      try {
        const value = f(x);
        
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
          h /= 10;
          continue;
        }
        
        return value;
      } catch (e) {
        h /= 10;
        continue;
      }
    }
    
    return null;
  }

  function calculateLimitAtInfinity(f, positive) {
    const values = [];
    const start = positive ? 10 : -10;
    const multiplier = positive ? 10 : -10;
    
    for (let i = 1; i <= 5; i++) {
      const x = start * Math.pow(10, i);
      try {
        const value = f(x);
        if (typeof value === 'number' && !isNaN(value)) {
          values.push(value);
        }
      } catch (e) {
        // Skip
      }
    }
    
    if (values.length === 0) return null;
    
    // Check if converging
    const lastValue = values[values.length - 1];
    return isFinite(lastValue) ? lastValue : null;
  }

  function checkFunctionContinuity(f, point) {
    try {
      const functionValue = f(point);
      const limitResult = calculateLimit(f, point, 'both');
      
      const isContinuous = limitResult.exists && 
                          Math.abs(limitResult.value - functionValue) < 0.0001;
      
      return {
        functionValue: functionValue,
        limitValue: limitResult.value,
        isContinuous: isContinuous
      };
    } catch (e) {
      return null;
    }
  }

  function displayLimitResult(limitResult, functionStr, point, type, showSteps, continuityResult) {
    const pointStr = point === Infinity ? '∞' : point === -Infinity ? '-∞' : point.toString();
    const typeStr = type === 'left' ? '⁻' : type === 'right' ? '⁺' : '';
    
    let html = `
      <div class="insight-card ${limitResult.exists ? 'success' : 'warning'}">
        <h6>${limitResult.exists ? '🎯' : '⚠️'} Limit Calculation Result</h6>
        <div class="result-display">
          <p><strong>Function:</strong> f(x) = ${functionStr}</p>
          <p><strong>Limit:</strong> lim(x→${pointStr}${typeStr}) f(x)</p>
          <div class="main-result">
    `;
    
    if (limitResult.exists) {
      const value = typeof limitResult.value === 'number' ? 
                   limitResult.value.toFixed(6) : limitResult.value;
      html += `<p><strong>Result: ${value}</strong></p>`;
    } else {
      html += `<p><strong>Limit does not exist</strong></p>`;
      if (limitResult.leftValue !== null && limitResult.rightValue !== null) {
        html += `
          <p>Left limit: ${limitResult.leftValue.toFixed(6)}</p>
          <p>Right limit: ${limitResult.rightValue.toFixed(6)}</p>
        `;
      }
    }
    
    html += `
        </div>
      </div>
    `;

    if (showSteps) {
      html += `
        <div class="insight-card info">
          <h6>📝 Calculation Method</h6>
          <ol>
            <li>Attempt direct substitution x = ${pointStr}</li>
            <li>If indeterminate — use numerical methods</li>
            <li>Calculate left and right limits</li>
            <li>Compare results for two-sided limit</li>
          </ol>
        </div>
      `;
    }

    if (continuityResult) {
      html += `
        <div class="insight-card ${continuityResult.isContinuous ? 'success' : 'warning'}">
          <h6>${continuityResult.isContinuous ? '✅' : '❌'} Continuity Check</h6>
          <p><strong>Function value at point:</strong> f(${point}) = ${continuityResult.functionValue.toFixed(6)}</p>
          <p><strong>Limit value:</strong> ${continuityResult.limitValue ? continuityResult.limitValue.toFixed(6) : 'does not exist'}</p>
          <p><strong>Conclusion:</strong> Function is ${continuityResult.isContinuous ? 'continuous' : 'discontinuous'} at point x = ${point}</p>
        </div>
      `;
    }

    html += `
      <div class="insight-card">
        <h6>💡 Useful Information</h6>
        <ul>
          <li><strong>Indeterminate forms:</strong> 0/0, ∞/∞, 0·∞, ∞-∞, 1^∞</li>
          <li><strong>L'Hôpital's rule:</strong> for forms 0/0 and ∞/∞</li>
          <li><strong>Limits at ∞:</strong> analysis of highest powers</li>
          <li><strong>Continuity:</strong> lim f(x) = f(a) at point a</li>
        </ul>
      </div>
    `;
    
    result.innerHTML = html;
  }
});