document.addEventListener("DOMContentLoaded", function () {
  // Get language for localized messages
  const isUkrainian = !window.location.pathname.includes('/en/');
  
  // UI Messages
  const messages = {
    uk: {
      linearSolution: "Розв'язок лінійного рівняння",
      quadraticSolution: "Розв'язок квадратного рівняння", 
      expressionResult: "Спрощений вираз",
      polynomialResult: "Значення многочлена",
      equation: "Рівняння",
      discriminant: "Дискримінант",
      twoRoots: "Два корені",
      oneRoot: "Один корінь",
      noRealRoots: "Немає дійсних коренів",
      infiniteSolutions: "Безліч розв'язків",
      noSolution: "Немає розв'язків",
      steps: "Кроки розв'язання",
      coefficient: "Коефіцієнт",
      cannotBeZero: "не може дорівнювати нулю",
      polynomial: "Многочлен",
      atValue: "при x =",
      invalidExpression: "Некоректний вираз",
      simplified: "Спрощено",
      original: "Початковий вираз"
    },
    en: {
      linearSolution: "Linear Equation Solution",
      quadraticSolution: "Quadratic Equation Solution",
      expressionResult: "Simplified Expression", 
      polynomialResult: "Polynomial Value",
      equation: "Equation",
      discriminant: "Discriminant",
      twoRoots: "Two roots",
      oneRoot: "One root", 
      noRealRoots: "No real roots",
      infiniteSolutions: "Infinite solutions",
      noSolution: "No solution",
      steps: "Solution Steps",
      coefficient: "Coefficient",
      cannotBeZero: "cannot be zero",
      polynomial: "Polynomial",
      atValue: "at x =",
      invalidExpression: "Invalid expression",
      simplified: "Simplified",
      original: "Original expression"
    }
  };
  
  const msg = messages[isUkrainian ? 'uk' : 'en'];

  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Remove active class from all tabs and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').classList.add('active');
      
      // Clear results when switching tabs
      document.getElementById('algebra-result').innerHTML = '';
    });
  });

  // Linear equation solver
  const linearForm = document.getElementById('linear-form');
  if (linearForm) {
    linearForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const a = parseFloat(document.getElementById('linear-a').value) || 0;
      const b = parseFloat(document.getElementById('linear-b').value) || 0;
      
      const result = solveLinear(a, b);
      displayResult(result);
    });
  }

  // Quadratic equation solver
  const quadraticForm = document.getElementById('quadratic-form');
  if (quadraticForm) {
    quadraticForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const a = parseFloat(document.getElementById('quad-a').value) || 0;
      const b = parseFloat(document.getElementById('quad-b').value) || 0;
      const c = parseFloat(document.getElementById('quad-c').value) || 0;
      
      const result = solveQuadratic(a, b, c);
      displayResult(result);
    });
  }

  // Expression simplifier
  const expressionForm = document.getElementById('expression-form');
  if (expressionForm) {
    expressionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const expression = document.getElementById('expression-input').value.trim();
      const result = simplifyExpression(expression);
      displayResult(result);
    });
  }

  // Polynomial calculator
  const polynomialForm = document.getElementById('polynomial-form');
  if (polynomialForm) {
    polynomialForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const coeffsStr = document.getElementById('poly-coeffs').value.trim();
      const x = parseFloat(document.getElementById('poly-x').value) || 0;
      
      const result = calculatePolynomial(coeffsStr, x);
      displayResult(result);
    });
  }

  // Linear equation solver function
  function solveLinear(a, b) {
    if (a === 0) {
      if (b === 0) {
        return {
          type: 'linear',
          title: msg.linearSolution,
          equation: `0x + 0 = 0`,
          result: 'infinite',
          message: msg.infiniteSolutions,
          steps: [
            `0x = 0`,
            `${msg.infiniteSolutions} (0 = 0 ${isUkrainian ? 'завжди істинно' : 'is always true'})`
          ]
        };
      } else {
        return {
          type: 'linear',
          title: msg.linearSolution,
          equation: `0x + ${b} = 0`,
          result: 'no-solution',
          message: msg.noSolution,
          steps: [
            `0x = ${-b}`,
            `${msg.noSolution} (0 ≠ ${-b})`
          ]
        };
      }
    }
    
    const x = -b / a;
    return {
      type: 'linear',
      title: msg.linearSolution,
      equation: `${a}x + ${b} = 0`,
      result: 'solution',
      x: x,
      steps: [
        `${a}x = ${-b}`,
        `x = ${-b}/${a}`,
        `x = ${x.toFixed(4)}`
      ]
    };
  }

  // Quadratic equation solver function
  function solveQuadratic(a, b, c) {
    if (a === 0) {
      return solveLinear(b, c);
    }
    
    const discriminant = b * b - 4 * a * c;
    const equation = `${a}x² + ${b}x + ${c} = 0`;
    
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      
      return {
        type: 'quadratic',
        title: msg.quadraticSolution,
        equation: equation,
        result: 'two-roots',
        discriminant: discriminant,
        x1: x1,
        x2: x2,
        message: msg.twoRoots,
        steps: [
          `D = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant.toFixed(4)}`,
          `x₁ = (-b + √D)/(2a) = (${-b} + √${discriminant.toFixed(4)})/${2*a} = ${x1.toFixed(4)}`,
          `x₂ = (-b - √D)/(2a) = (${-b} - √${discriminant.toFixed(4)})/${2*a} = ${x2.toFixed(4)}`
        ]
      };
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      
      return {
        type: 'quadratic',
        title: msg.quadraticSolution,
        equation: equation,
        result: 'one-root',
        discriminant: discriminant,
        x: x,
        message: msg.oneRoot,
        steps: [
          `D = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
          `x = -b/(2a) = ${-b}/${2*a} = ${x.toFixed(4)}`
        ]
      };
    } else {
      return {
        type: 'quadratic',
        title: msg.quadraticSolution,
        equation: equation,
        result: 'no-real-roots',
        discriminant: discriminant,
        message: msg.noRealRoots,
        steps: [
          `D = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant.toFixed(4)}`,
          `${msg.noRealRoots} (D < 0)`
        ]
      };
    }
  }

  // Expression simplifier function (basic implementation)
  function simplifyExpression(expression) {
    try {
      // Remove spaces and validate basic format
      const cleaned = expression.replace(/\s+/g, '');
      
      // Basic simplification: combine like terms
      const simplified = combineLinearTerms(cleaned);
      
      return {
        type: 'expression',
        title: msg.expressionResult,
        original: expression,
        simplified: simplified,
        steps: [
          `${msg.original}: ${expression}`,
          `${msg.simplified}: ${simplified}`
        ]
      };
    } catch (error) {
      return {
        type: 'expression',
        title: msg.expressionResult,
        error: msg.invalidExpression,
        original: expression
      };
    }
  }

  // Basic linear term combiner
  function combineLinearTerms(expression) {
    // Very basic implementation for linear expressions like "3x + 2x - 5 + 1"
    let xCoeff = 0;
    let constant = 0;
    
    // Split by + and - while keeping the signs
    const terms = expression.split(/([+-])/).filter(term => term.trim() !== '');
    let currentSign = 1;
    
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i].trim();
      
      if (term === '+') {
        currentSign = 1;
      } else if (term === '-') {
        currentSign = -1;
      } else {
        if (term.includes('x')) {
          // Extract coefficient of x
          const coeff = term.replace('x', '') || '1';
          xCoeff += currentSign * parseFloat(coeff);
        } else {
          // Constant term
          constant += currentSign * parseFloat(term);
        }
      }
    }
    
    // Build simplified expression
    let result = '';
    
    if (xCoeff !== 0) {
      if (xCoeff === 1) result = 'x';
      else if (xCoeff === -1) result = '-x';
      else result = `${xCoeff}x`;
    }
    
    if (constant !== 0) {
      if (result === '') {
        result = constant.toString();
      } else {
        result += constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`;
      }
    }
    
    return result || '0';
  }

  // Polynomial calculator function
  function calculatePolynomial(coeffsStr, x) {
    try {
      const coeffs = coeffsStr.split(',').map(c => parseFloat(c.trim()));
      
      if (coeffs.some(isNaN)) {
        throw new Error('Invalid coefficients');
      }
      
      let result = 0;
      let polynomialStr = '';
      
      for (let i = 0; i < coeffs.length; i++) {
        const power = coeffs.length - 1 - i;
        const coeff = coeffs[i];
        
        result += coeff * Math.pow(x, power);
        
        // Build polynomial string
        if (i > 0) {
          polynomialStr += coeff >= 0 ? ' + ' : ' - ';
          polynomialStr += Math.abs(coeff);
        } else {
          polynomialStr += coeff;
        }
        
        if (power > 1) {
          polynomialStr += `x^${power}`;
        } else if (power === 1) {
          polynomialStr += 'x';
        }
      }
      
      return {
        type: 'polynomial',
        title: msg.polynomialResult,
        polynomial: polynomialStr,
        x: x,
        result: result,
        steps: [
          `${msg.polynomial}: ${polynomialStr}`,
          `${msg.atValue} ${x}`,
          `${isUkrainian ? 'Результат' : 'Result'}: ${result.toFixed(4)}`
        ]
      };
    } catch (error) {
      return {
        type: 'polynomial',
        title: msg.polynomialResult,
        error: msg.invalidExpression
      };
    }
  }

  // Display result function
  function displayResult(result) {
    const resultDiv = document.getElementById('algebra-result');
    
    if (result.error) {
      resultDiv.innerHTML = `
        <div class="insight-card warning">
          <h6>❌ ${result.error}</h6>
        </div>
      `;
      return;
    }
    
    let html = `
      <div class="insight-card success">
        <h6>📊 ${result.title}</h6>
        ${result.equation ? `<p><strong>${msg.equation}:</strong> ${result.equation}</p>` : ''}
        ${result.polynomial ? `<p><strong>${msg.polynomial}:</strong> ${result.polynomial}</p>` : ''}
    `;
    
    if (result.type === 'linear') {
      if (result.result === 'solution') {
        html += `<div class="big-number">x = ${result.x.toFixed(4)}</div>`;
      } else {
        html += `<div class="result-value">${result.message}</div>`;
      }
    } else if (result.type === 'quadratic') {
      html += `<p><strong>${msg.discriminant}:</strong> ${result.discriminant.toFixed(4)}</p>`;
      
      if (result.result === 'two-roots') {
        html += `
          <div class="result-value">x₁ = ${result.x1.toFixed(4)}</div>
          <div class="result-value">x₂ = ${result.x2.toFixed(4)}</div>
        `;
      } else if (result.result === 'one-root') {
        html += `<div class="big-number">x = ${result.x.toFixed(4)}</div>`;
      } else {
        html += `<div class="result-value">${result.message}</div>`;
      }
    } else if (result.type === 'expression') {
      html += `
        <p><strong>${msg.original}:</strong> ${result.original}</p>
        <div class="big-number">${result.simplified}</div>
      `;
    } else if (result.type === 'polynomial') {
      html += `<div class="big-number">${result.result.toFixed(4)}</div>`;
    }
    
    if (result.steps) {
      html += `
        <div style="margin-top: 1rem;">
          <strong>📝 ${msg.steps}:</strong>
          <ol>
            ${result.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      `;
    }
    
    html += '</div>';
    
    resultDiv.innerHTML = html;
  }

  // Initialize with default calculation
  if (linearForm) {
    linearForm.dispatchEvent(new Event('submit'));
  }
});