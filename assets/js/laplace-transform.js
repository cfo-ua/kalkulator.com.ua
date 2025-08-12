document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('laplace-form');
  const result = document.getElementById('laplace-result');
  const functionType = document.getElementById('function-type');
  const paramInputs = document.getElementById('parameter-inputs');
  
  // Function to update parameter inputs based on selected function type
  function updateParameterInputs() {
    const type = functionType.value;
    let html = '';
    
    switch(type) {
      case 'constant':
        html = `
          <label>
            📊 Константа c:
            <input type="number" id="param-a" value="1" step="0.1" required>
          </label>`;
        break;
      case 'power':
        html = `
          <label>
            📊 Степінь n:
            <input type="number" id="param-a" value="1" min="0" step="1" required>
          </label>`;
        break;
      case 'exponential':
      case 't_exp':
        html = `
          <label>
            📊 Параметр a:
            <input type="number" id="param-a" value="1" step="0.1" required>
          </label>`;
        break;
      case 'sin':
      case 'cos':
      case 'sinh':
      case 'cosh':
      case 't_sin':
      case 't_cos':
        html = `
          <label>
            📊 Частота a:
            <input type="number" id="param-a" value="1" step="0.1" required>
          </label>`;
        break;
    }
    paramInputs.innerHTML = html;
  }
  
  // Function to calculate factorial
  function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }
  
  // Function to format complex expressions
  function formatTransform(numerator, denominator, description) {
    return `
      <div class="insight-card info">
        <h6>🎯 Результат перетворення</h6>
        <div class="big-number">F(s) = ${numerator}/${denominator}</div>
        <p>${description}</p>
      </div>
    `;
  }
  
  if (form && functionType) {
    // Initialize parameter inputs
    updateParameterInputs();
    
    // Update inputs when function type changes
    functionType.addEventListener('change', updateParameterInputs);
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const type = functionType.value;
      const paramA = Number(document.getElementById('param-a').value);
      
      let transform = '';
      let description = '';
      
      try {
        switch(type) {
          case 'constant':
            if (paramA === 0) {
              transform = formatTransform('0', '1', 'Перетворення Лапласа від нуля');
            } else {
              transform = formatTransform(paramA.toString(), 's', `Перетворення Лапласа константи ${paramA}`);
            }
            break;
            
          case 'power':
            if (paramA < 0) {
              transform = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Степінь має бути невід\'ємною</p></div>';
            } else {
              const fact = factorial(paramA);
              transform = formatTransform(fact.toString(), `s^${paramA + 1}`, `Перетворення Лапласа від t^${paramA}`);
            }
            break;
            
          case 'exponential':
            if (paramA === 0) {
              transform = formatTransform('1', 's', 'L{e^(0·t)} = L{1}');
            } else {
              transform = formatTransform('1', `(s - ${paramA})`, `Перетворення Лапласа від e^(${paramA}t)`);
            }
            break;
            
          case 'sin':
            if (paramA === 0) {
              transform = formatTransform('0', '1', 'L{sin(0)} = 0');
            } else {
              transform = formatTransform(paramA.toString(), `(s² + ${paramA * paramA})`, `Перетворення Лапласа від sin(${paramA}t)`);
            }
            break;
            
          case 'cos':
            if (paramA === 0) {
              transform = formatTransform('1', 's', 'L{cos(0)} = L{1}');
            } else {
              transform = formatTransform('s', `(s² + ${paramA * paramA})`, `Перетворення Лапласа від cos(${paramA}t)`);
            }
            break;
            
          case 'sinh':
            if (paramA === 0) {
              transform = formatTransform('0', '1', 'L{sinh(0)} = 0');
            } else {
              transform = formatTransform(paramA.toString(), `(s² - ${paramA * paramA})`, `Перетворення Лапласа від sinh(${paramA}t)`);
            }
            break;
            
          case 'cosh':
            if (paramA === 0) {
              transform = formatTransform('1', 's', 'L{cosh(0)} = L{1}');
            } else {
              transform = formatTransform('s', `(s² - ${paramA * paramA})`, `Перетворення Лапласа від cosh(${paramA}t)`);
            }
            break;
            
          case 't_exp':
            transform = formatTransform('1', `(s - ${paramA})²`, `Перетворення Лапласа від t·e^(${paramA}t)`);
            break;
            
          case 't_sin':
            if (paramA === 0) {
              transform = formatTransform('0', '1', 'L{t·sin(0)} = 0');
            } else {
              transform = formatTransform(`2·${paramA}·s`, `(s² + ${paramA * paramA})²`, `Перетворення Лапласа від t·sin(${paramA}t)`);
            }
            break;
            
          case 't_cos':
            if (paramA === 0) {
              transform = formatTransform('1', 's²', 'L{t·cos(0)} = L{t}');
            } else {
              transform = formatTransform(`s² - ${paramA * paramA}`, `(s² + ${paramA * paramA})²`, `Перетворення Лапласа від t·cos(${paramA}t)`);
            }
            break;
            
          default:
            transform = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Невідомий тип функції</p></div>';
        }
        
        // Add convergence information
        const convergenceInfo = getConvergenceInfo(type, paramA);
        
        result.innerHTML = `
          ${transform}
          <div class="insight-card success">
            <h6>📈 Область збіжності</h6>
            <div class="result-value">${convergenceInfo}</div>
          </div>
          <div class="insight-card info">
            <h6>💡 Корисна інформація</h6>
            <p>Перетворення Лапласа існує для функцій експоненціального порядку. Зворотне перетворення можна знайти за таблицями або за допомогою теорем розкладу.</p>
          </div>
        `;
        
      } catch (error) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Помилка при обчисленні: ' + error.message + '</p></div>';
      }
    });
  }
  
  function getConvergenceInfo(type, paramA) {
    switch(type) {
      case 'constant':
      case 'power':
      case 'sin':
      case 'cos':
      case 't_sin':
      case 't_cos':
        return 'Re(s) > 0';
      case 'exponential':
      case 't_exp':
        return `Re(s) > ${paramA}`;
      case 'sinh':
      case 'cosh':
        return `Re(s) > |${paramA}|`;
      default:
        return 'Re(s) > 0';
    }
  }
});