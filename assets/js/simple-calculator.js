document.addEventListener("DOMContentLoaded", function () {
  // Get language for localized messages
  const isUkrainian = !window.location.pathname.includes('/en/');
  
  // Calculator state
  let currentInput = '0';
  let previousInput = '';
  let operator = '';
  let waitingForOperand = false;
  let memory = 0;
  let history = [];

  // UI Elements
  const screen = document.getElementById('calc-screen');
  const historyDisplay = document.getElementById('calc-history');
  const memoryIndicator = document.getElementById('calc-memory');
  const historyPanel = document.getElementById('calc-history-panel');
  const clearHistoryBtn = document.getElementById('clear-history');

  // Messages
  const messages = {
    uk: {
      error: "Помилка",
      divideByZero: "Ділення на нуль",
      historyEmpty: "Історія порожня",
      historyCleared: "Історію очищено",
      memoryCleared: "Пам'ять очищена"
    },
    en: {
      error: "Error",
      divideByZero: "Cannot divide by zero",
      historyEmpty: "History is empty",
      historyCleared: "History cleared",
      memoryCleared: "Memory cleared"
    }
  };

  const msg = messages[isUkrainian ? 'uk' : 'en'];

  // Event listeners
  document.querySelectorAll('.calc-btn').forEach(button => {
    button.addEventListener('click', handleButtonClick);
  });

  // Keyboard support
  document.addEventListener('keydown', handleKeyPress);

  // Clear history button
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearHistory);
  }

  // Handle button clicks
  function handleButtonClick(e) {
    const button = e.target;
    
    if (button.dataset.number) {
      inputNumber(button.dataset.number);
    } else if (button.dataset.action) {
      handleAction(button.dataset.action);
    }
  }

  // Handle keyboard input
  function handleKeyPress(e) {
    // Prevent default for calculator keys
    if ('0123456789+-*/.=Enter'.includes(e.key) || e.key === 'Escape' || e.key === 'Backspace') {
      e.preventDefault();
    }

    if (e.key >= '0' && e.key <= '9') {
      inputNumber(e.key);
    } else {
      switch (e.key) {
        case '+':
          handleAction('add');
          break;
        case '-':
          handleAction('subtract');
          break;
        case '*':
          handleAction('multiply');
          break;
        case '/':
          handleAction('divide');
          break;
        case '.':
          handleAction('decimal');
          break;
        case '=':
        case 'Enter':
          handleAction('equals');
          break;
        case 'Escape':
          handleAction('clear');
          break;
        case 'Backspace':
          handleAction('backspace');
          break;
        case '%':
          handleAction('percent');
          break;
      }
    }
  }

  // Input number
  function inputNumber(num) {
    if (waitingForOperand) {
      currentInput = num;
      waitingForOperand = false;
    } else {
      currentInput = currentInput === '0' ? num : currentInput + num;
    }
    
    updateDisplay();
  }

  // Handle actions
  function handleAction(action) {
    switch (action) {
      case 'clear':
        clear();
        break;
      case 'clear-entry':
        clearEntry();
        break;
      case 'backspace':
        backspace();
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'percent':
        percent();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        performOperation(action);
        break;
      case 'equals':
        calculate();
        break;
      case 'mc':
        memoryClear();
        break;
      case 'mr':
        memoryRecall();
        break;
      case 'm-plus':
        memoryAdd();
        break;
      case 'm-minus':
        memorySubtract();
        break;
    }
  }

  // Clear all
  function clear() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForOperand = false;
    updateDisplay();
    updateHistory('');
  }

  // Clear entry
  function clearEntry() {
    currentInput = '0';
    updateDisplay();
  }

  // Backspace
  function backspace() {
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    updateDisplay();
  }

  // Input decimal point
  function inputDecimal() {
    if (waitingForOperand) {
      currentInput = '0.';
      waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
      currentInput += '.';
    }
    updateDisplay();
  }

  // Percent function
  function percent() {
    const current = parseFloat(currentInput);
    if (operator && previousInput) {
      const previous = parseFloat(previousInput);
      const percentValue = (previous * current) / 100;
      currentInput = percentValue.toString();
    } else {
      currentInput = (current / 100).toString();
    }
    updateDisplay();
  }

  // Perform operation
  function performOperation(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === '') {
      previousInput = inputValue;
    } else if (operator) {
      const prevValue = parseFloat(previousInput);
      const result = calculate(prevValue, inputValue, operator);

      if (result === null) return; // Error occurred

      currentInput = String(result);
      previousInput = result;
    }

    waitingForOperand = true;
    operator = nextOperator;
    updateDisplay();
    updateHistory(`${previousInput} ${getOperatorSymbol(operator)}`);
  }

  // Calculate result
  function calculate(firstOperand, secondOperand, operator) {
    if (arguments.length === 0) {
      // Called from equals button
      if (operator && previousInput !== '') {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        const result = performCalculation(prev, current, operator);
        
        if (result === null) return;
        
        // Add to history
        addToHistory(`${prev} ${getOperatorSymbol(operator)} ${current} = ${result}`);
        
        currentInput = String(result);
        previousInput = '';
        operator = '';
        waitingForOperand = true;
        updateDisplay();
        updateHistory('');
        return;
      }
      return;
    }

    return performCalculation(firstOperand, secondOperand, operator);
  }

  // Perform actual calculation
  function performCalculation(a, b, op) {
    try {
      switch (op) {
        case 'add':
          return a + b;
        case 'subtract':
          return a - b;
        case 'multiply':
          return a * b;
        case 'divide':
          if (b === 0) {
            showError(msg.divideByZero);
            return null;
          }
          return a / b;
        default:
          return b;
      }
    } catch (error) {
      showError(msg.error);
      return null;
    }
  }

  // Memory functions
  function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
    showTemporaryMessage(msg.memoryCleared);
  }

  function memoryRecall() {
    currentInput = String(memory);
    waitingForOperand = false;
    updateDisplay();
  }

  function memoryAdd() {
    memory += parseFloat(currentInput);
    updateMemoryIndicator();
  }

  function memorySubtract() {
    memory -= parseFloat(currentInput);
    updateMemoryIndicator();
  }

  // Update memory indicator
  function updateMemoryIndicator() {
    if (memory !== 0) {
      memoryIndicator.style.display = 'block';
    } else {
      memoryIndicator.style.display = 'none';
    }
  }

  // Get operator symbol
  function getOperatorSymbol(op) {
    const symbols = {
      'add': '+',
      'subtract': '−',
      'multiply': '×',
      'divide': '÷'
    };
    return symbols[op] || op;
  }

  // Update display
  function updateDisplay() {
    // Format number for display
    let displayValue = currentInput;
    
    // Handle very large numbers
    if (Math.abs(parseFloat(displayValue)) > 999999999999) {
      displayValue = parseFloat(displayValue).toExponential(6);
    } else if (displayValue.length > 12) {
      displayValue = parseFloat(displayValue).toPrecision(10);
    }
    
    screen.textContent = displayValue;
  }

  // Update history display
  function updateHistory(text) {
    historyDisplay.textContent = text;
  }

  // Add to history
  function addToHistory(calculation) {
    history.unshift(calculation);
    
    // Keep only last 50 calculations
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    updateHistoryPanel();
  }

  // Update history panel
  function updateHistoryPanel() {
    if (history.length === 0) {
      historyPanel.innerHTML = `<div class="history-item">${isUkrainian ? 'Історія з\'явиться тут після перших розрахунків' : 'History will appear here after first calculations'}</div>`;
      return;
    }

    const historyHTML = history.map(item => 
      `<div class="history-item" onclick="useHistoryValue('${item.split(' = ')[1]}')">${item}</div>`
    ).join('');
    
    historyPanel.innerHTML = historyHTML;
  }

  // Use history value
  window.useHistoryValue = function(value) {
    if (value && !isNaN(parseFloat(value))) {
      currentInput = value;
      waitingForOperand = false;
      updateDisplay();
    }
  };

  // Clear history
  function clearHistory() {
    history = [];
    updateHistoryPanel();
    showTemporaryMessage(msg.historyCleared);
  }

  // Show error
  function showError(message) {
    screen.textContent = message;
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForOperand = false;
    
    setTimeout(() => {
      updateDisplay();
    }, 2000);
  }

  // Show temporary message
  function showTemporaryMessage(message) {
    const originalText = screen.textContent;
    screen.textContent = message;
    
    setTimeout(() => {
      screen.textContent = originalText;
    }, 1500);
  }

  // Initialize display
  updateDisplay();
  updateHistoryPanel();
  updateMemoryIndicator();
});