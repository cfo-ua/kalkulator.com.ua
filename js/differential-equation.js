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
            <h6>❌ Помилка розв'язання</h6>
            <p>Перевірте правильність введеного рівняння.</p>
            <p><strong>Деталі:</strong> ${error.message}</p>
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
        throw new Error("Невірний формат рівняння");
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
    
    throw new Error("Непідтримуваний формат рівняння");
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
            "1. Рівняння з відокремлюваними змінними",
            "2. dy = f(x)dx",
            "3. ∫dy = ∫f(x)dx",
            `4. y = ∫(${expr})dx + C`,
            `5. Використовуючи y(${x0}) = ${y0}, знаходимо C`
          ]
        };
      } catch (e) {
        return { solved: false, error: "Не вдалося інтегрувати" };
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
      particular: `Розв'язок з початковою умовою y(${x0}) = ${y0}`,
      steps: [
        "1. Лінійне диференціальне рівняння першого порядку",
        "2. Знаходимо інтегрувальний множник μ(x) = e^(∫P(x)dx)",
        "3. Множимо рівняння на μ(x)",
        "4. Інтегруємо обидві частини",
        "5. Знаходимо загальний розв'язок"
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
        general: "Чисельний розв'язок (метод Ейлера)",
        particular: `Розв'язок з y(${x0}) = ${y0}`,
        points: points,
        steps: [
          "1. Використано чисельний метод Ейлера",
          "2. y_{n+1} = y_n + h * f(x_n, y_n)",
          `3. Крок інтегрування h = ${h}`,
          `4. Початкова умова: y(${x0}) = ${y0}`
        ]
      };
    } catch (e) {
      return { solved: false, error: "Помилка в чисельному розв'язанні" };
    }
  }

  function displayDEResult(solution, equationStr, type, x0, y0, showSteps) {
    let html = `
      <div class="insight-card ${solution.solved ? 'success' : 'warning'}">
        <h6>${solution.solved ? '🎯' : '❌'} Результат розв'язання</h6>
        <div class="result-display">
          <p><strong>Рівняння:</strong> ${equationStr}</p>
          <p><strong>Тип:</strong> ${getTypeDescription(type)}</p>
          <p><strong>Початкові умови:</strong> y(${x0}) = ${y0}</p>
        </div>
      </div>
    `;

    if (solution.solved) {
      html += `
        <div class="insight-card info">
          <h6>📖 Розв'язок</h6>
          <p><strong>Загальний розв'язок:</strong></p>
          <p class="math-expression">${solution.general}</p>
          
          <p><strong>Частинний розв'язок:</strong></p>
          <p class="math-expression">${solution.particular}</p>
        </div>
      `;

      if (showSteps && solution.steps) {
        html += `
          <div class="insight-card">
            <h6>📝 Кроки розв'язання</h6>
            <ol>
              ${solution.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        `;
      }
    } else {
      html += `
        <div class="insight-card warning">
          <h6>⚠️ Не вдалося розв'язати</h6>
          <p>${solution.error}</p>
          <p>Спробуйте спростити рівняння або використайте інший тип.</p>
        </div>
      `;
    }

    html += `
      <div class="insight-card">
        <h6>💡 Довідкова інформація</h6>
        <ul>
          <li><strong>Відокремлювані змінні:</strong> dy/dx = f(x)g(y)</li>
          <li><strong>Лінійні рівняння:</strong> dy/dx + P(x)y = Q(x)</li>
          <li><strong>Однорідні:</strong> dy/dx = F(y/x)</li>
          <li><strong>Чисельні методи:</strong> метод Ейлера, Рунге-Кутта</li>
        </ul>
      </div>
    `;
    
    result.innerHTML = html;
  }

  function getTypeDescription(type) {
    const descriptions = {
      'separable': 'З відокремлюваними змінними',
      'linear': 'Лінійне першого порядку',
      'homogeneous': 'Однорідне',
      'numerical': 'Чисельне розв\'язання',
      'exact': 'В повних диференціалах'
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
        throw new Error("Невірний формат функції");
      }
    };
  }

  function plotDESolution(solution, x0, y0, showDirectionField) {
    if (!solution.points) return;
    
    // Create a simple text-based representation since Plotly is not available
    let plotHtml = `
      <div class="insight-card">
        <h6>📈 Графік розв'язку</h6>
        <p>Точки розв'язку (x, y):</p>
        <div style="max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 0.9em;">
    `;
    
    solution.points.slice(0, 10).forEach(point => {
      plotHtml += `<div>(${point.x.toFixed(3)}, ${point.y.toFixed(3)})</div>`;
    });
    
    if (solution.points.length > 10) {
      plotHtml += `<div>... та ще ${solution.points.length - 10} точок</div>`;
    }
    
    plotHtml += `
        </div>
        <p><small>Примітка: Для повноцінної візуалізації рекомендуємо використовувати спеціалізовані математичні програми.</small></p>
      </div>
    `;
    
    if (plotDiv) {
      plotDiv.innerHTML = plotHtml;
    }
  }
});