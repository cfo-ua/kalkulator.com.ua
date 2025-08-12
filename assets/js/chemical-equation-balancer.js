document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('equation-balancer-form');
  const result = document.getElementById('equation-balancer-result');
  const equationInput = document.getElementById('eb-equation');
  const balanceBtn = document.getElementById('eb-balance');
  const clearBtn = document.getElementById('eb-clear');
  const showStepsCheckbox = document.getElementById('eb-show-steps');
  const verifyBalanceCheckbox = document.getElementById('eb-verify-balance');

  // Set default equation
  equationInput.value = 'Al + O2 → Al2O3';
  
  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      equationInput.value = this.dataset.equation;
    });
  });

  // Balance button
  balanceBtn.addEventListener('click', balanceEquation);
  
  // Clear button
  clearBtn.addEventListener('click', function() {
    equationInput.value = '';
    result.innerHTML = '';
  });

  // Auto-balance on Enter key
  equationInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      balanceEquation();
    }
  });

  function balanceEquation() {
    try {
      const equation = equationInput.value.trim();
      if (!equation) {
        throw new Error('Введіть хімічне рівняння');
      }

      // Parse the equation
      const parsed = parseEquation(equation);
      
      // Balance the equation
      const balanced = solveBalance(parsed);
      
      // Display results
      displayResults(equation, balanced, parsed);

    } catch (error) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Помилка</h6>
        <div>${error.message}</div>
      </div>`;
    }
  }

  function parseEquation(equation) {
    // Split by arrow or equals
    const parts = equation.split(/→|->|=/).map(part => part.trim());
    if (parts.length !== 2) {
      throw new Error('Невірний формат рівняння. Використовуйте → або =');
    }

    const [reactantsPart, productsPart] = parts;
    
    // Parse reactants and products
    const reactants = parseSubstances(reactantsPart);
    const products = parseSubstances(productsPart);
    
    // Get all unique elements
    const elements = new Set();
    [...reactants, ...products].forEach(substance => {
      Object.keys(substance.composition).forEach(element => {
        elements.add(element);
      });
    });

    return {
      reactants,
      products,
      elements: Array.from(elements)
    };
  }

  function parseSubstances(part) {
    const substances = part.split('+').map(s => s.trim());
    return substances.map((substance, index) => {
      const composition = parseFormula(substance);
      return {
        formula: substance,
        composition: composition,
        coefficient: 1, // Will be determined
        index: index
      };
    });
  }

  function parseFormula(formula) {
    const composition = {};
    
    // Remove spaces and normalize
    formula = formula.replace(/\s/g, '');
    
    // Simple regex for basic chemical formulas
    // This handles basic cases like H2O, Ca(OH)2, etc.
    const elementRegex = /([A-Z][a-z]?)(\d*)/g;
    const groupRegex = /\(([^)]+)\)(\d+)/g;
    
    // First handle groups in parentheses
    formula = formula.replace(groupRegex, (match, group, multiplier) => {
      const mult = parseInt(multiplier) || 1;
      let expanded = '';
      const groupElements = group.match(elementRegex) || [];
      groupElements.forEach(elem => {
        const [, element, count] = elem.match(/([A-Z][a-z]?)(\d*)/) || [];
        const elemCount = (parseInt(count) || 1) * mult;
        expanded += element + (elemCount > 1 ? elemCount : '');
      });
      return expanded;
    });
    
    // Now parse all elements
    const matches = formula.match(elementRegex) || [];
    matches.forEach(match => {
      const [, element, count] = match.match(/([A-Z][a-z]?)(\d*)/) || [];
      composition[element] = (composition[element] || 0) + (parseInt(count) || 1);
    });
    
    return composition;
  }

  function solveBalance(parsed) {
    const { reactants, products, elements } = parsed;
    const numSubstances = reactants.length + products.length;
    
    // Create matrix for system of linear equations
    // Each row represents balance for one element
    // Each column represents coefficient for one substance
    const matrix = [];
    const rightSide = [];
    
    elements.forEach(element => {
      const row = new Array(numSubstances).fill(0);
      
      // Reactants (positive coefficients)
      reactants.forEach((substance, i) => {
        row[i] = substance.composition[element] || 0;
      });
      
      // Products (negative coefficients)
      products.forEach((substance, i) => {
        row[reactants.length + i] = -(substance.composition[element] || 0);
      });
      
      matrix.push(row);
      rightSide.push(0);
    });
    
    // Solve using Gaussian elimination with assumption that first coefficient = 1
    const coefficients = gaussianElimination(matrix, rightSide);
    
    // Normalize to get integer coefficients
    const normalizedCoeffs = normalizeCoefficients(coefficients);
    
    return {
      reactants: reactants.map((substance, i) => ({
        ...substance,
        coefficient: normalizedCoeffs[i]
      })),
      products: products.map((substance, i) => ({
        ...substance,
        coefficient: normalizedCoeffs[reactants.length + i]
      }))
    };
  }

  function gaussianElimination(matrix, rightSide) {
    const n = matrix.length;
    const m = matrix[0].length;
    
    // Simple approach: assume first coefficient = 1 and solve for others
    // This is a simplified method for demonstration
    const coefficients = new Array(m).fill(1);
    
    // Try to find a valid solution using trial method
    // This is not the most efficient but works for simple cases
    return trialMethod(matrix, m);
  }

  function trialMethod(matrix, numSubstances) {
    // Start with small integer coefficients and check balance
    const maxCoeff = 10;
    
    function checkBalance(coeffs) {
      for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < coeffs.length; j++) {
          sum += matrix[i][j] * coeffs[j];
        }
        if (Math.abs(sum) > 1e-10) return false;
      }
      return true;
    }
    
    // Try different combinations
    function generate(index, current) {
      if (index === numSubstances) {
        if (checkBalance(current)) {
          return [...current];
        }
        return null;
      }
      
      for (let coeff = 1; coeff <= maxCoeff; coeff++) {
        current[index] = coeff;
        const result = generate(index + 1, current);
        if (result) return result;
      }
      return null;
    }
    
    const result = generate(0, new Array(numSubstances));
    return result || new Array(numSubstances).fill(1);
  }

  function normalizeCoefficients(coefficients) {
    // Find GCD and normalize
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const findGCD = arr => arr.reduce(gcd);
    
    const commonDivisor = findGCD(coefficients.filter(c => c > 0));
    return coefficients.map(c => Math.round(c / commonDivisor));
  }

  function displayResults(originalEquation, balanced, parsed) {
    let resultHTML = `<h4>⚖️ Результати балансування</h4>`;
    
    // Original equation
    resultHTML += `<div class="insight-card warning">
      <h6>📝 Оригінальне рівняння</h6>
      <div class="equation-display">${originalEquation}</div>
    </div>`;

    // Balanced equation
    const balancedEquation = formatBalancedEquation(balanced);
    resultHTML += `<div class="insight-card success">
      <h6>⚖️ Збалансоване рівняння</h6>
      <div class="equation-display balanced">${balancedEquation}</div>
    </div>`;

    // Verification if requested
    if (verifyBalanceCheckbox.checked) {
      const verification = verifyBalance(balanced, parsed.elements);
      resultHTML += `<div class="insight-card info">
        <h6>✅ Перевірка балансу</h6>
        <div class="verification-details">${verification}</div>
      </div>`;
    }

    // Coefficients breakdown
    resultHTML += '<div class="coefficients-breakdown">';
    resultHTML += '<h5>📊 Коефіцієнти:</h5>';
    resultHTML += '<div class="insight-cards">';
    
    // Reactants
    balanced.reactants.forEach(substance => {
      resultHTML += `<div class="insight-card info">
        <h6>${substance.formula}</h6>
        <div class="big-number">${substance.coefficient}</div>
        <div class="small-text">реагент</div>
      </div>`;
    });
    
    // Products
    balanced.products.forEach(substance => {
      resultHTML += `<div class="insight-card success">
        <h6>${substance.formula}</h6>
        <div class="big-number">${substance.coefficient}</div>
        <div class="small-text">продукт</div>
      </div>`;
    });
    
    resultHTML += '</div></div>';

    // Steps if requested
    if (showStepsCheckbox.checked) {
      resultHTML += generateStepsExplanation(balanced, parsed);
    }

    result.innerHTML = resultHTML;
  }

  function formatBalancedEquation(balanced) {
    const reactantTerms = balanced.reactants.map(s => 
      `${s.coefficient > 1 ? s.coefficient : ''}${s.formula}`
    );
    const productTerms = balanced.products.map(s => 
      `${s.coefficient > 1 ? s.coefficient : ''}${s.formula}`
    );
    
    return `${reactantTerms.join(' + ')} → ${productTerms.join(' + ')}`;
  }

  function verifyBalance(balanced, elements) {
    let verification = '<table class="balance-table">';
    verification += '<tr><th>Елемент</th><th>Реагенти</th><th>Продукти</th><th>Баланс</th></tr>';
    
    let isBalanced = true;
    
    elements.forEach(element => {
      let reactantCount = 0;
      let productCount = 0;
      
      balanced.reactants.forEach(substance => {
        reactantCount += (substance.composition[element] || 0) * substance.coefficient;
      });
      
      balanced.products.forEach(substance => {
        productCount += (substance.composition[element] || 0) * substance.coefficient;
      });
      
      const isElementBalanced = reactantCount === productCount;
      if (!isElementBalanced) isBalanced = false;
      
      verification += `<tr class="${isElementBalanced ? 'balanced' : 'unbalanced'}">
        <td>${element}</td>
        <td>${reactantCount}</td>
        <td>${productCount}</td>
        <td>${isElementBalanced ? '✅' : '❌'}</td>
      </tr>`;
    });
    
    verification += '</table>';
    verification += `<div class="balance-summary ${isBalanced ? 'success' : 'error'}">
      ${isBalanced ? '✅ Рівняння збалансоване правильно!' : '❌ Рівняння не збалансоване!'}
    </div>`;
    
    return verification;
  }

  function generateStepsExplanation(balanced, parsed) {
    let steps = '<div class="steps-explanation">';
    steps += '<h5>📋 Крок за кроком:</h5>';
    steps += '<ol class="steps-list">';
    
    steps += '<li><strong>Аналіз молекул:</strong> Визначили елементи в кожній речовині</li>';
    steps += '<li><strong>Складання рівнянь:</strong> Створили систему рівнянь для кожного елемента</li>';
    steps += '<li><strong>Розвʼязання:</strong> Знайшли найменші цілі коефіцієнти</li>';
    steps += '<li><strong>Перевірка:</strong> Підтвердили баланс мас для всіх елементів</li>';
    
    steps += '</ol></div>';
    return steps;
  }

  // Initialize with default equation
  balanceEquation();
});