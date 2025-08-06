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
          result.innerHTML = '<div class="insight-card warning">⚠️ Будь ласка, введіть правильне число</div>';
          return;
        }
        
        const scientific = toScientificNotation(num, sf);
        
        const orderOfMagnitude = Math.abs(scientific.exponent);
        let classification = '';
        if (scientific.exponent > 6) {
          classification = 'Дуже велике число (мільйони і більше)';
        } else if (scientific.exponent > 3) {
          classification = 'Велике число (тисячі)';
        } else if (scientific.exponent >= 0) {
          classification = 'Звичайне число';
        } else if (scientific.exponent >= -3) {
          classification = 'Мале число (частки)';
        } else {
          classification = 'Дуже мале число (мікроскопічне)';
        }

        result.innerHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🔬 Наукова нотація</h6>
              <div class="big-number">${scientific.formatted}</div>
              <div class="insight-detail">Експоненціальна форма</div>
            </div>
            
            <div class="insight-card info">
              <h6>📊 Компоненти</h6>
              <div class="result-value">Мантиса: ${scientific.mantissa}</div>
              <div class="result-value">Експонента: ${scientific.exponent}</div>
              <div class="insight-detail">a × 10^n формат</div>
            </div>
          </div>

          <div class="insight-card">
            <h6>🔍 Аналіз числа</h6>
            <p><strong>Класифікація:</strong> ${classification}</p>
            <p><strong>Порядок величини:</strong> 10^${scientific.exponent}</p>
            <p><strong>Пояснення:</strong> Це число в ${orderOfMagnitude === 0 ? '1' : orderOfMagnitude} раз${orderOfMagnitude === 1 ? '' : 'и'} ${scientific.exponent >= 0 ? 'більше' : 'менше'} за одиницю.</p>
          </div>

          <div style="margin-top: 1.5rem;">
            <h6>💡 Корисна інформація:</h6>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
                <strong>Альтернативні записи:</strong><br>
                • ${scientific.mantissa}E${scientific.exponent}<br>
                • ${scientific.mantissa}e${scientific.exponent}<br>
                • ${scientific.mantissa} * 10^${scientific.exponent}
              </div>
              <div style="background: #f8fff0; padding: 1rem; border-radius: 8px;">
                <strong>Приклади використання:</strong><br>
                ${scientific.exponent > 6 ? '• Астрономічні відстані<br>• Населення країн' : 
                  scientific.exponent > 3 ? '• Зарплати, ціни<br>• Розміри міст' :
                  scientific.exponent >= 0 ? '• Повсякденні вимірювання<br>• Бытові числа' :
                  scientific.exponent >= -6 ? '• Розміри клітин<br>• Хімічні концентрації' :
                  '• Атомні розміри<br>• Квантові ефекти'}
              </div>
            </div>
          </div>
        `;
        
      } else if (currentMode === 'from-scientific') {
        const m = parseFloat(mantissa.value);
        const e = parseInt(exponent.value);
        
        if (isNaN(m) || isNaN(e)) {
          result.innerHTML = '<div class="insight-card warning">⚠️ Будь ласка, введіть правильні значення мантиси та експоненти</div>';
          return;
        }
        
        if (m < 1 || m >= 10) {
          result.innerHTML = '<div class="insight-card warning">⚠️ Мантиса має бути від 1 (включно) до 10 (не включаючи)</div>';
          return;
        }
        
        const regularNum = fromScientificNotation(m, e);
        const formatted = regularNum.toLocaleString('uk-UA');
        
        result.innerHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🔢 Звичайне число</h6>
              <div class="big-number">${formatted}</div>
              <div class="insight-detail">Десяткова форма</div>
            </div>
            
            <div class="insight-card info">
              <h6>📏 Точне значення</h6>
              <div class="result-value">${regularNum}</div>
              <div class="insight-detail">Без форматування</div>
            </div>
          </div>

          <div class="insight-card">
            <h6>🔄 Перевірка</h6>
            <p><strong>Вихідна наукова нотація:</strong> ${m} × 10^${e}</p>
            <p><strong>Розрахунок:</strong> ${m} × ${Math.pow(10, e).toLocaleString('uk-UA')} = ${formatted}</p>
            <p><strong>Кількість цифр:</strong> ${regularNum.toString().replace(/[.-]/g, '').length}</p>
          </div>
        `;
        
      } else if (currentMode === 'operations') {
        const operationResult = performOperation(num1.value, num2.value, operation.value);
        
        if (operationResult === null) {
          result.innerHTML = '<div class="insight-card warning">⚠️ Помилка в обчисленнях. Перевірте введені числа</div>';
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
          multiply: 'Множення',
          divide: 'Ділення',
          add: 'Додавання',
          subtract: 'Віднімання'
        };

        result.innerHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🧮 Результат</h6>
              <div class="big-number">${resultSci.formatted}</div>
              <div class="insight-detail">${operationNames[operation.value]}</div>
            </div>
            
            <div class="insight-card info">
              <h6>📊 Звичайна форма</h6>
              <div class="result-value">${operationResult.toLocaleString('uk-UA')}</div>
              <div class="insight-detail">Десяткова нотація</div>
            </div>
          </div>

          <div class="insight-card">
            <h6>🔍 Детальний розрахунок</h6>
            <p><strong>Операція:</strong> ${sci1.formatted} ${operationSymbols[operation.value]} ${sci2.formatted}</p>
            <p><strong>В десятковій формі:</strong> ${num1Parsed.toLocaleString('uk-UA')} ${operationSymbols[operation.value]} ${num2Parsed.toLocaleString('uk-UA')}</p>
            <p><strong>Результат:</strong> ${operationResult.toLocaleString('uk-UA')}</p>
          </div>

          <div style="margin-top: 1.5rem;">
            <h6>💡 Правила операцій в науковій нотації:</h6>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
                <strong>Множення:</strong><br>
                (a×10^m) × (b×10^n) = (a×b)×10^(m+n)
              </div>
              <div style="background: #fff0f8; padding: 1rem; border-radius: 8px;">
                <strong>Ділення:</strong><br>
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