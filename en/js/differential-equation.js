document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("de-form");
  const result = document.getElementById("de-result");
  const plotDiv = document.getElementById("de-plot");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      try {
        const equationStr = document.getElementById("equation").value.trim();
        const equationType = document.getElementById("equation-type").value;
        const x0 = parseFloat(document.getElementById("x0").value) || 0;
        const y0 = parseFloat(document.getElementById("y0").value) || 1;
        const showSteps = document.getElementById("show-solution-steps").checked;
        const plotSolution = document.getElementById("plot-solution").checked;
        const directionField = document.getElementById("direction-field").checked;

        // Parse differential equation
        const parsedEquation = parseDifferentialEquation(equationStr);
        
        // Determine equation type if auto
        const detectedType = equationType === 'auto' ? 
                           detectEquationType(parsedEquation) : equationType;
        
        // Solve equation
        const solution = solveDifferentialEquation(parsedEquation, detectedType, x0, y0);
        
        // Display result
        displayDEResult(solution, equationStr, detectedType, x0, y0, showSteps);
        
        // Plot solution if requested
        if (plotSolution && solution.solved) {
          plotDESolution(solution, x0, y0, directionField);
        }
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Solution Error</h6>
            <p>Please check the correctness of the entered equation.</p>
            <p><strong>Details:</strong> ${error.message}</p>
          </div>
        `;
      }
    });
  }

  function parseDifferentialEquation(equationStr) {
    // Simple parser for basic differential equations
    // Support formats: dy/dx = expr, dy/dx + expr = expr
    
    const normalized = equationStr
      .replace(/dy\/dx/g, "DYDX")
      .replace(/\s+/g, "");
    
    if (normalized.includes("=")) {
      const parts = normalized.split("=");
      if (parts.length !== 2) {
        throw new Error("Invalid equation format");
      }
      
      const left = parts[0];
      const right = parts[1];
      
      if (left === "DYDX") {
        // dy/dx = f(x,y)
        return {
          type: "explicit",
          rightSide: right.replace(/DYDX/g, ""),
          leftSide: ""
        };
      } else if (left.includes("DYDX")) {
        // dy/dx + P(x)y = Q(x)
        return {
          type: "linear_form",
          leftSide: left.replace(/DYDX/g, ""),
          rightSide: right
        };
      }
    }
    
    throw new Error("Unsupported equation format");
  }

  function detectEquationType(parsedEq) {
    if (parsedEq.type === "explicit") {
      const expr = parsedEq.rightSide;
      
      // Check if separable (function of x only)
      if (!expr.includes("y")) {
        return "separable";
      }
      
      // Simple heuristics for other types
      if (expr.includes("y/x") || expr.includes("x/y")) {
        return "homogeneous";
      }
      
      return "separable"; // Default assumption
    }
    
    return "linear";
  }

  function solveDifferentialEquation(parsedEq, type, x0, y0) {
    try {
      switch (type) {
        case "separable":
          return solveSeparable(parsedEq, x0, y0);
        case "linear":
          return solveLinear(parsedEq, x0, y0);
        default:
          return solveNumerical(parsedEq, x0, y0);
      }
    } catch (e) {
      return {
        solved: false,
        error: e.message,
        general: null,
        particular: null
      };
    }
  }

  function solveSeparable(parsedEq, x0, y0) {
    const expr = parsedEq.rightSide;
    
    // For simple cases like dy/dx = f(x)
    if (!expr.includes("y")) {
      try {
        const f = math.parse(expr);
        // Integrate f(x)
        const antiderivative = `integrate(${expr}, x)`;
        const general = `y = ${antiderivative} + C`;
        
        // Find particular solution
        const C = y0; // Simplified
        const particular = `y = ${antiderivative} + ${C}`;
        
        return {
          solved: true,
          type: "separable",
          general: general,
          particular: particular,
          steps: [
            "1. Separable variables equation",
            "2. dy = f(x)dx",
            "3. ∫dy = ∫f(x)dx",
            `4. y = ∫(${expr})dx + C`,
            `5. Using y(${x0}) = ${y0}, find C`
          ]
        };
      } catch (e) {
        return { solved: false, error: "Failed to integrate" };
      }
    }
    
    return solveNumerical(parsedEq, x0, y0);
  }

  function solveLinear(parsedEq, x0, y0) {
    // Simplified linear equation solver
    return {
      solved: true,
      type: "linear",
      general: "y = e^(-∫P(x)dx) * (∫Q(x)*e^(∫P(x)dx)dx + C)",
      particular: `Solution with initial condition y(${x0}) = ${y0}`,
      steps: [
        "1. First-order linear differential equation",
        "2. Find integrating factor μ(x) = e^(∫P(x)dx)",
        "3. Multiply equation by μ(x)",
        "4. Integrate both sides",
        "5. Find general solution"
      ]
    };
  }

  function solveNumerical(parsedEq, x0, y0) {
    // Numerical solution using Euler's method
    const expr = parsedEq.rightSide;
    
    try {
      const f = createDEFunctionEvaluator(expr);
      const h = 0.1; // Step size
      const points = [];
      
      let x = x0;
      let y = y0;
      
      for (let i = 0; i < 50; i++) {
        points.push({ x: x, y: y });
        
        const slope = f(x, y);
        y = y + h * slope;
        x = x + h;
      }
      
      return {
        solved: true,
        type: "numerical",
        general: "Numerical solution (Euler's method)",
        particular: `Solution with y(${x0}) = ${y0}`,
        points: points,
        steps: [
          "1. Used Euler's numerical method",
          "2. y_{n+1} = y_n + h * f(x_n, y_n)",
          `3. Integration step h = ${h}`,
          `4. Initial condition: y(${x0}) = ${y0}`
        ]
      };
    } catch (e) {
      return { solved: false, error: "Error in numerical solution" };
    }
  }

  function displayDEResult(solution, equationStr, type, x0, y0, showSteps) {
    let html = `
      <div class="insight-card ${solution.solved ? 'success' : 'warning'}">
        <h6>${solution.solved ? '🎯' : '❌'} Solution Result</h6>
        <div class="result-display">
          <p><strong>Equation:</strong> ${equationStr}</p>
          <p><strong>Type:</strong> ${getTypeDescription(type)}</p>
          <p><strong>Initial conditions:</strong> y(${x0}) = ${y0}</p>
        </div>
      </div>
    `;

    if (solution.solved) {
      html += `
        <div class="insight-card info">
          <h6>📖 Solution</h6>
          <p><strong>General solution:</strong></p>
          <p class="math-expression">${solution.general}</p>
          
          <p><strong>Particular solution:</strong></p>
          <p class="math-expression">${solution.particular}</p>
        </div>
      `;

      if (showSteps && solution.steps) {
        html += `
          <div class="insight-card">
            <h6>📝 Solution Steps</h6>
            <ol>
              ${solution.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        `;
      }
    } else {
      html += `
        <div class="insight-card warning">
          <h6>⚠️ Failed to Solve</h6>
          <p>${solution.error}</p>
          <p>Try simplifying the equation or use a different type.</p>
        </div>
      `;
    }

    html += `
      <div class="insight-card">
        <h6>💡 Reference Information</h6>
        <ul>
          <li><strong>Separable variables:</strong> dy/dx = f(x)g(y)</li>
          <li><strong>Linear equations:</strong> dy/dx + P(x)y = Q(x)</li>
          <li><strong>Homogeneous:</strong> dy/dx = F(y/x)</li>
          <li><strong>Numerical methods:</strong> Euler's method, Runge-Kutta</li>
        </ul>
      </div>
    `;
    
    result.innerHTML = html;
  }

  function getTypeDescription(type) {
    const descriptions = {
      'separable': 'Separable variables',
      'linear': 'First-order linear',
      'homogeneous': 'Homogeneous',
      'numerical': 'Numerical solution',
      'exact': 'Exact differential equation'
    };
    return descriptions[type] || type;
  }

  function createDEFunctionEvaluator(functionStr) {
    // Basic function parser and evaluator for differential equations
    const normalizedFunction = functionStr
      .replace(/\^/g, '**')  // Replace ^ with **
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/ln/g, 'Math.log')
      .replace(/log/g, 'Math.log10')
      .replace(/exp/g, 'Math.exp');

    return function(x, y) {
      try {
        // Use Function constructor to evaluate expression
        // Replace variables with actual values
        const expr = normalizedFunction
          .replace(/x/g, `(${x})`)
          .replace(/y/g, `(${y})`);
        
        return Function('"use strict"; return (' + expr + ')')();
      } catch (e) {
        throw new Error("Invalid function format");
      }
    };
  }

  function plotDESolution(solution, x0, y0, showDirectionField) {
    if (!solution.points) return;
    
    // Create a simple text-based representation since Plotly is not available
    let plotHtml = `
      <div class="insight-card">
        <h6>📈 Solution Graph</h6>
        <p>Solution points (x, y):</p>
        <div style="max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 0.9em;">
    `;
    
    solution.points.slice(0, 10).forEach(point => {
      plotHtml += `<div>(${point.x.toFixed(3)}, ${point.y.toFixed(3)})</div>`;
    });
    
    if (solution.points.length > 10) {
      plotHtml += `<div>... and ${solution.points.length - 10} more points</div>`;
    }
    
    plotHtml += `
        </div>
        <p><small>Note: For full visualization, we recommend using specialized mathematical software.</small></p>
      </div>
    `;
    
    if (plotDiv) {
      plotDiv.innerHTML = plotHtml;
    }
  }
});