document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('error-propagation-form');
  const result = document.getElementById('error-propagation-result');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId + '-operations' || content.id === tabId + '-combination') {
          content.classList.add('active');
        }
      });
    });
  });
  
  // Handle operation selection for basic operations
  const basicOperationSelect = document.getElementById('basic-operation');
  if (basicOperationSelect) {
    basicOperationSelect.addEventListener('change', function() {
      const operation = this.value;
      const secondValueGroup = document.getElementById('second-value-group');
      const powerGroup = document.getElementById('power-group');
      
      if (operation === 'power') {
        secondValueGroup.style.display = 'none';
        powerGroup.style.display = 'block';
      } else {
        secondValueGroup.style.display = 'block';
        powerGroup.style.display = 'none';
      }
    });
  }
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const activeTab = document.querySelector('.tab-button.active').getAttribute('data-tab');
      
      try {
        if (activeTab === 'basic') {
          calculateBasicOperation();
        } else if (activeTab === 'functions') {
          calculateFunctionOperation();
        } else if (activeTab === 'linear') {
          calculateLinearCombination();
        }
      } catch (error) {
        result.innerHTML = `<div class="error">Помилка: ${error.message}</div>`;
      }
    });
  }
  
  function calculateBasicOperation() {
    const operation = document.getElementById('basic-operation').value;
    const valueA = parseFloat(document.getElementById('value-a').value);
    const errorA = parseFloat(document.getElementById('error-a').value);
    
    let resultValue, resultError, formula, calculation;
    
    if (operation === 'power') {
      const n = parseFloat(document.getElementById('power-n').value);
      resultValue = Math.pow(valueA, n);
      resultError = Math.abs(n) * Math.abs(resultValue) * (errorA / Math.abs(valueA));
      formula = `δ(A^n) = |n| × |A^n| × (δA/|A|)`;
      calculation = `δ(${valueA}^${n}) = ${Math.abs(n)} × ${Math.abs(resultValue).toFixed(6)} × (${errorA}/${Math.abs(valueA)}) = ${resultError.toFixed(6)}`;
    } else {
      const valueB = parseFloat(document.getElementById('value-b').value);
      const errorB = parseFloat(document.getElementById('error-b').value);
      
      if (operation === 'add') {
        resultValue = valueA + valueB;
        resultError = Math.sqrt(errorA * errorA + errorB * errorB);
        formula = `δ(A + B) = √(δA² + δB²)`;
        calculation = `δ(${valueA} + ${valueB}) = √(${errorA}² + ${errorB}²) = √${(errorA * errorA + errorB * errorB).toFixed(6)} = ${resultError.toFixed(6)}`;
      } else if (operation === 'subtract') {
        resultValue = valueA - valueB;
        resultError = Math.sqrt(errorA * errorA + errorB * errorB);
        formula = `δ(A - B) = √(δA² + δB²)`;
        calculation = `δ(${valueA} - ${valueB}) = √(${errorA}² + ${errorB}²) = √${(errorA * errorA + errorB * errorB).toFixed(6)} = ${resultError.toFixed(6)}`;
      } else if (operation === 'multiply') {
        resultValue = valueA * valueB;
        const relativeErrorA = errorA / Math.abs(valueA);
        const relativeErrorB = errorB / Math.abs(valueB);
        const relativeError = Math.sqrt(relativeErrorA * relativeErrorA + relativeErrorB * relativeErrorB);
        resultError = Math.abs(resultValue) * relativeError;
        formula = `δ(A × B)/|A × B| = √((δA/A)² + (δB/B)²)`;
        calculation = `δ(${valueA} × ${valueB})/${Math.abs(resultValue)} = √((${errorA}/${Math.abs(valueA)})² + (${errorB}/${Math.abs(valueB)})²) = ${relativeError.toFixed(6)}<br>δ(A × B) = ${resultError.toFixed(6)}`;
      } else if (operation === 'divide') {
        if (valueB === 0) throw new Error("Ділення на нуль неможливе");
        resultValue = valueA / valueB;
        const relativeErrorA = errorA / Math.abs(valueA);
        const relativeErrorB = errorB / Math.abs(valueB);
        const relativeError = Math.sqrt(relativeErrorA * relativeErrorA + relativeErrorB * relativeErrorB);
        resultError = Math.abs(resultValue) * relativeError;
        formula = `δ(A ÷ B)/|A ÷ B| = √((δA/A)² + (δB/B)²)`;
        calculation = `δ(${valueA} ÷ ${valueB})/${Math.abs(resultValue)} = √((${errorA}/${Math.abs(valueA)})² + (${errorB}/${Math.abs(valueB)})²) = ${relativeError.toFixed(6)}<br>δ(A ÷ B) = ${resultError.toFixed(6)}`;
      }
    }
    
    displayResult(resultValue, resultError, formula, calculation, operation);
  }
  
  function calculateFunctionOperation() {
    const func = document.getElementById('function-operation').value;
    const valueA = parseFloat(document.getElementById('func-value-a').value);
    const errorA = parseFloat(document.getElementById('func-error-a').value);
    
    let resultValue, resultError, formula, calculation;
    
    switch (func) {
      case 'sqrt':
        if (valueA < 0) throw new Error("Квадратний корінь з від'ємного числа");
        resultValue = Math.sqrt(valueA);
        resultError = errorA / (2 * Math.sqrt(valueA));
        formula = `δ(√A) = δA/(2√A)`;
        calculation = `δ(√${valueA}) = ${errorA}/(2×√${valueA}) = ${errorA}/${(2 * Math.sqrt(valueA)).toFixed(6)} = ${resultError.toFixed(6)}`;
        break;
        
      case 'ln':
        if (valueA <= 0) throw new Error("Логарифм від неположного числа");
        resultValue = Math.log(valueA);
        resultError = errorA / valueA;
        formula = `δ(ln A) = δA/A`;
        calculation = `δ(ln ${valueA}) = ${errorA}/${valueA} = ${resultError.toFixed(6)}`;
        break;
        
      case 'log10':
        if (valueA <= 0) throw new Error("Логарифм від неположного числа");
        resultValue = Math.log10(valueA);
        resultError = errorA / (valueA * Math.LN10);
        formula = `δ(log₁₀ A) = δA/(A × ln 10)`;
        calculation = `δ(log₁₀ ${valueA}) = ${errorA}/(${valueA} × ${Math.LN10.toFixed(6)}) = ${resultError.toFixed(6)}`;
        break;
        
      case 'exp':
        resultValue = Math.exp(valueA);
        resultError = Math.abs(resultValue) * errorA;
        formula = `δ(e^A) = |e^A| × δA`;
        calculation = `δ(e^${valueA}) = ${Math.abs(resultValue).toFixed(6)} × ${errorA} = ${resultError.toFixed(6)}`;
        break;
        
      case 'sin':
        resultValue = Math.sin(valueA);
        resultError = Math.abs(Math.cos(valueA)) * errorA;
        formula = `δ(sin A) = |cos A| × δA`;
        calculation = `δ(sin ${valueA}) = |cos ${valueA}| × ${errorA} = ${Math.abs(Math.cos(valueA)).toFixed(6)} × ${errorA} = ${resultError.toFixed(6)}`;
        break;
        
      case 'cos':
        resultValue = Math.cos(valueA);
        resultError = Math.abs(Math.sin(valueA)) * errorA;
        formula = `δ(cos A) = |sin A| × δA`;
        calculation = `δ(cos ${valueA}) = |sin ${valueA}| × ${errorA} = ${Math.abs(Math.sin(valueA)).toFixed(6)} × ${errorA} = ${resultError.toFixed(6)}`;
        break;
        
      case 'tan':
        resultValue = Math.tan(valueA);
        const secant = 1 / Math.cos(valueA);
        resultError = Math.abs(secant * secant) * errorA;
        formula = `δ(tan A) = sec²A × δA`;
        calculation = `δ(tan ${valueA}) = sec²${valueA} × ${errorA} = ${Math.abs(secant * secant).toFixed(6)} × ${errorA} = ${resultError.toFixed(6)}`;
        break;
    }
    
    displayResult(resultValue, resultError, formula, calculation, func);
  }
  
  function calculateLinearCombination() {
    const coeffs = [
      parseFloat(document.getElementById('coeff-1').value),
      parseFloat(document.getElementById('coeff-2').value),
      parseFloat(document.getElementById('coeff-3').value)
    ];
    
    const values = [
      parseFloat(document.getElementById('linear-value-1').value),
      parseFloat(document.getElementById('linear-value-2').value),
      parseFloat(document.getElementById('linear-value-3').value)
    ];
    
    const errors = [
      parseFloat(document.getElementById('linear-error-1').value),
      parseFloat(document.getElementById('linear-error-2').value),
      parseFloat(document.getElementById('linear-error-3').value)
    ];
    
    // Calculate result value
    let resultValue = 0;
    let resultErrorSquared = 0;
    let activeTerms = [];
    
    for (let i = 0; i < 3; i++) {
      if (coeffs[i] !== 0 && values[i] !== 0) {
        resultValue += coeffs[i] * values[i];
        resultErrorSquared += (coeffs[i] * errors[i]) * (coeffs[i] * errors[i]);
        activeTerms.push(i + 1);
      }
    }
    
    const resultError = Math.sqrt(resultErrorSquared);
    
    // Generate formula and calculation
    const formula = `δ(z) = √(∑(cᵢ × δxᵢ)²)`;
    let calculation = `z = `;
    let errorCalc = `δz = √(`;
    
    let firstTerm = true;
    for (let i = 0; i < 3; i++) {
      if (coeffs[i] !== 0 && values[i] !== 0) {
        if (!firstTerm) {
          calculation += ` + `;
          errorCalc += ` + `;
        }
        calculation += `${coeffs[i]} × ${values[i]}`;
        errorCalc += `(${coeffs[i]} × ${errors[i]})²`;
        firstTerm = false;
      }
    }
    calculation += ` = ${resultValue.toFixed(6)}`;
    errorCalc += `) = ${resultError.toFixed(6)}`;
    
    const fullCalculation = calculation + '<br>' + errorCalc;
    
    displayResult(resultValue, resultError, formula, fullCalculation, 'linear');
  }
  
  function displayResult(value, error, formula, calculation, operation) {
    const relativeError = Math.abs(value) > 0 ? (error / Math.abs(value)) * 100 : 0;
    
    let html = '<div class="insight-card">';
    html += '<h3>📊 Результат поширення похибки</h3>';
    
    // Main result
    html += '<div class="result-main">';
    html += `<h4>🎯 Результат: <span class="result-value">${value.toFixed(6)} ± ${error.toFixed(6)}</span></h4>`;
    html += `<p>📈 Відносна похибка: <strong>${relativeError.toFixed(3)}%</strong></p>`;
    html += '</div>';
    
    // Formula
    html += '<div class="formula-section">';
    html += '<h4>📐 Формула:</h4>';
    html += `<p class="formula"><code>${formula}</code></p>';
    html += '</div>';
    
    // Calculation steps
    html += '<div class="calculation-section">';
    html += '<h4>🔢 Розрахунок:</h4>';
    html += `<p class="calculation">${calculation}</p>`;
    html += '</div>';
    
    // Analysis and recommendations
    html += '<div class="analysis">';
    html += '<h4>💡 Аналіз:</h4>';
    
    if (relativeError < 1) {
      html += '<p>✅ <strong>Висока точність:</strong> Відносна похибка менше 1%</p>';
    } else if (relativeError < 5) {
      html += '<p>🟡 <strong>Хороша точність:</strong> Відносна похибка менше 5%</p>';
    } else if (relativeError < 10) {
      html += '<p>🟠 <strong>Прийнятна точність:</strong> Відносна похибка менше 10%</p>';
    } else {
      html += '<p>🔴 <strong>Низька точність:</strong> Відносна похибка більше 10%</p>';
    }
    
    // Scientific notation
    const scientificValue = value.toExponential(3);
    const scientificError = error.toExponential(2);
    html += `<p>🔬 <strong>Науковий запис:</strong> (${scientificValue} ± ${scientificError})</p>`;
    
    // Significant figures recommendation
    const errorOrder = Math.floor(Math.log10(error));
    const recommendedDecimals = Math.max(0, -errorOrder + 1);
    const roundedValue = parseFloat(value.toFixed(recommendedDecimals));
    const roundedError = parseFloat(error.toFixed(Math.max(0, -errorOrder + 1)));
    html += `<p>📝 <strong>Рекомендований запис:</strong> ${roundedValue} ± ${roundedError}</p>`;
    
    html += '</div>';
    html += '</div>';
    
    result.innerHTML = html;
  }
});

// Add CSS for error propagation styling
const style = document.createElement('style');
style.textContent = `
  .calculator-tabs {
    display: flex;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--border);
  }
  
  .tab-button {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .tab-button.active {
    border-bottom-color: var(--accent);
    color: var(--accent);
    font-weight: bold;
  }
  
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
  }
  
  .operation-group,
  .input-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .input-row label {
    flex: 1;
    min-width: 200px;
  }
  
  .linear-term {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card-bg);
  }
  
  .result-main {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%);
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }
  
  .result-value {
    font-family: monospace;
    font-size: 1.4rem;
    color: var(--accent);
    font-weight: bold;
  }
  
  .formula-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
  }
  
  .formula {
    font-family: monospace;
    font-size: 1.2rem;
    background: white;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--border);
  }
  
  .calculation-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
  }
  
  .calculation {
    font-family: monospace;
    background: white;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    line-height: 1.6;
  }
  
  .analysis {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
  }
  
  .analysis h4 {
    margin: 0 0 1rem 0;
    color: var(--accent);
  }
  
  .analysis p {
    margin: 0.5rem 0;
  }
  
  .error {
    color: #721c24;
    background: #f8d7da;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #f5c6cb;
  }
`;
document.head.appendChild(style);