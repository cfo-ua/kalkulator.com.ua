document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('scientific-form');
  const result = document.getElementById('scientific-result');
  
  // Mode buttons
  const toScientificBtn = document.getElementById('to-scientific');
  const fromScientificBtn = document.getElementById('from-scientific');
  const operationsBtn = document.getElementById('operations');
  
  // Mode sections
  const toScientificMode = document.getElementById('to-scientific-mode');
  const fromScientificMode = document.getElementById('from-scientific-mode');
  const operationsMode = document.getElementById('operations-mode');
  
  // Inputs
  const regularNumber = document.getElementById('regular-number');
  const sigFigs = document.getElementById('sig-figs');
  const mantissa = document.getElementById('mantissa');
  const exponent = document.getElementById('exponent');
  const num1 = document.getElementById('num1');
  const num2 = document.getElementById('num2');
  const operation = document.getElementById('operation');

  // Set default values
  regularNumber.value = '123456789';
  mantissa.value = '1.23';
  exponent.value = '5';
  num1.value = '2.5e3';
  num2.value = '1.2e-2';

  let currentMode = 'to-scientific';

  // Mode switching
  function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode).classList.add('active');
    
    // Show/hide sections
    toScientificMode.style.display = mode === 'to-scientific' ? 'block' : 'none';
    fromScientificMode.style.display = mode === 'from-scientific' ? 'block' : 'none';
    operationsMode.style.display = mode === 'operations' ? 'block' : 'none';
  }

  toScientificBtn.addEventListener('click', () => switchMode('to-scientific'));
  fromScientificBtn.addEventListener('click', () => switchMode('from-scientific'));
  operationsBtn.addEventListener('click', () => switchMode('operations'));

  // Scientific notation functions
  function toScientificNotation(num, sigFigs = 6) {
    if (num === 0) return { mantissa: 0, exponent: 0, formatted: '0' };
    
    const absNum = Math.abs(num);
    const exponent = Math.floor(Math.log10(absNum));
    const mantissa = num / Math.pow(10, exponent);
    
    const roundedMantissa = parseFloat(mantissa.toPrecision(sigFigs));
    const formatted = `${roundedMantissa} × 10^${exponent}`;
    
    return { mantissa: roundedMantissa, exponent, formatted, original: num };
  }

  function fromScientificNotation(mantissa, exponent) {
    return mantissa * Math.pow(10, exponent);
  }

  function parseScientificInput(input) {
    // Handle different formats: 1.23e5, 1.23E5, 1.23×10^5, 1.23*10^5
    input = input.replace(/\s/g, '').replace(/×/g, '*').replace(/\^/g, '');
    
    // Try scientific notation format first
    let match = input.match(/^([+-]?\d*\.?\d+)[eE]([+-]?\d+)$/);
    if (match) {
      return parseFloat(input);
    }
    
    // Try mantissa * 10^exponent format
    match = input.match(/^([+-]?\d*\.?\d+)\*10([+-]?\d+)$/);
    if (match) {
      const mantissa = parseFloat(match[1]);
      const exponent = parseInt(match[2]);
      return mantissa * Math.pow(10, exponent);
    }
    
    // Try regular number
    return parseFloat(input);
  }

  function performOperation(num1, num2, op) {
    const a = parseScientificInput(num1);
    const b = parseScientificInput(num2);
    
    if (isNaN(a) || isNaN(b)) {
      return null;
    }
    
    let result;
    switch (op) {
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        result = b !== 0 ? a / b : null;
        break;
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      default:
        return null;
    }
    
    return result;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      if (currentMode === 'to-scientific') {
        const num = parseFloat(regularNumber.value);
        const sf = parseInt(sigFigs.value) || 6;
        
        if (isNaN(num)) {
          result.innerHTML = '<div class="insight-card warning">⚠️ Please enter a valid number</div>';
          return;
        }
        
        const scientific = toScientificNotation(num, sf);
        
        const orderOfMagnitude = Math.abs(scientific.exponent);
        let classification = '';
        if (scientific.exponent > 6) {
          classification = 'Very large number (millions and above)';
        } else if (scientific.exponent > 3) {
          classification = 'Large number (thousands)';
        } else if (scientific.exponent >= 0) {
          classification = 'Regular number';
        } else if (scientific.exponent >= -3) {
          classification = 'Small number (fractions)';
        } else {
          classification = 'Very small number (microscopic)';
        }

        result.innerHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🔬 Scientific Notation</h6>
              <div class="big-number">${scientific.formatted}</div>
              <div class="insight-detail">Exponential form</div>
            </div>
            
            <div class="insight-card info">
              <h6>📊 Components</h6>
              <div class="result-value">Mantissa: ${scientific.mantissa}</div>
              <div class="result-value">Exponent: ${scientific.exponent}</div>
              <div class="insight-detail">a × 10^n format</div>
            </div>
          </div>

          <div class="insight-card">
            <h6>🔍 Number Analysis</h6>
            <p><strong>Classification:</strong> ${classification}</p>
            <p><strong>Order of magnitude:</strong> 10^${scientific.exponent}</p>
            <p><strong>Explanation:</strong> This number is ${orderOfMagnitude === 0 ? '1' : orderOfMagnitude} time${orderOfMagnitude === 1 ? '' : 's'} ${scientific.exponent >= 0 ? 'larger' : 'smaller'} than one.</p>
          </div>

          <div style="margin-top: 1.5rem;">
            <h6>💡 Useful Information:</h6>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
                <strong>Alternative notations:</strong><br>
                • ${scientific.mantissa}E${scientific.exponent}<br>
                • ${scientific.mantissa}e${scientific.exponent}<br>
                • ${scientific.mantissa} * 10^${scientific.exponent}
              </div>
              <div style="background: #f8fff0; padding: 1rem; border-radius: 8px;">
                <strong>Usage examples:</strong><br>
                ${scientific.exponent > 6 ? '• Astronomical distances<br>• Country populations' : 
                  scientific.exponent > 3 ? '• Salaries, prices<br>• City sizes' :
                  scientific.exponent >= 0 ? '• Daily measurements<br>• Common numbers' :
                  scientific.exponent >= -6 ? '• Cell sizes<br>• Chemical concentrations' :
                  '• Atomic sizes<br>• Quantum effects'}
              </div>
            </div>
          </div>
        `;
        
      } else if (currentMode === 'from-scientific') {
        const m = parseFloat(mantissa.value);
        const e = parseInt(exponent.value);
        
        if (isNaN(m) || isNaN(e)) {
          result.innerHTML = '<div class="insight-card warning">⚠️ Please enter valid mantissa and exponent values</div>';
          return;
        }
        
        if (m < 1 || m >= 10) {
          result.innerHTML = '<div class="insight-card warning">⚠️ Mantissa must be from 1 (inclusive) to 10 (exclusive)</div>';
          return;
        }
        
        const regularNum = fromScientificNotation(m, e);
        const formatted = regularNum.toLocaleString('en-US');
        
        result.innerHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🔢 Regular Number</h6>
              <div class="big-number">${formatted}</div>
              <div class="insight-detail">Decimal form</div>
            </div>
            
            <div class="insight-card info">
              <h6>📏 Exact Value</h6>
              <div class="result-value">${regularNum}</div>
              <div class="insight-detail">Without formatting</div>
            </div>
          </div>

          <div class="insight-card">
            <h6>🔄 Verification</h6>
            <p><strong>Original scientific notation:</strong> ${m} × 10^${e}</p>
            <p><strong>Calculation:</strong> ${m} × ${Math.pow(10, e).toLocaleString('en-US')} = ${formatted}</p>
            <p><strong>Number of digits:</strong> ${regularNum.toString().replace(/[.-]/g, '').length}</p>
          </div>
        `;
        
      } else if (currentMode === 'operations') {
        const operationResult = performOperation(num1.value, num2.value, operation.value);
        
        if (operationResult === null) {
          result.innerHTML = '<div class="insight-card warning">⚠️ Calculation error. Please check the entered numbers</div>';
          return;
        }
        
        const num1Parsed = parseScientificInput(num1.value);
        const num2Parsed = parseScientificInput(num2.value);
        const sci1 = toScientificNotation(num1Parsed);
        const sci2 = toScientificNotation(num2Parsed);
        const resultSci = toScientificNotation(operationResult);
        
        const operationSymbols = {
          multiply: '×',
          divide: '÷',
          add: '+',
          subtract: '-'
        };
        
        const operationNames = {
          multiply: 'Multiplication',
          divide: 'Division',
          add: 'Addition',
          subtract: 'Subtraction'
        };

        result.innerHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🧮 Result</h6>
              <div class="big-number">${resultSci.formatted}</div>
              <div class="insight-detail">${operationNames[operation.value]}</div>
            </div>
            
            <div class="insight-card info">
              <h6>📊 Regular Form</h6>
              <div class="result-value">${operationResult.toLocaleString('en-US')}</div>
              <div class="insight-detail">Decimal notation</div>
            </div>
          </div>

          <div class="insight-card">
            <h6>🔍 Detailed Calculation</h6>
            <p><strong>Operation:</strong> ${sci1.formatted} ${operationSymbols[operation.value]} ${sci2.formatted}</p>
            <p><strong>In decimal form:</strong> ${num1Parsed.toLocaleString('en-US')} ${operationSymbols[operation.value]} ${num2Parsed.toLocaleString('en-US')}</p>
            <p><strong>Result:</strong> ${operationResult.toLocaleString('en-US')}</p>
          </div>

          <div style="margin-top: 1.5rem;">
            <h6>💡 Scientific notation operation rules:</h6>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
                <strong>Multiplication:</strong><br>
                (a×10^m) × (b×10^n) = (a×b)×10^(m+n)
              </div>
              <div style="background: #fff0f8; padding: 1rem; border-radius: 8px;">
                <strong>Division:</strong><br>
                (a×10^m) ÷ (b×10^n) = (a÷b)×10^(m-n)
              </div>
            </div>
          </div>
        `;
      }
    });

    // Calculate default result on page load
    form.dispatchEvent(new Event('submit'));
  }
});