document.addEventListener("DOMContentLoaded", function () {
  // Helper function to find GCD (Greatest Common Divisor)
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Helper function to find LCM (Least Common Multiple)
  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  // Class to represent and work with fractions
  class Fraction {
    constructor(numerator, denominator = 1) {
      if (denominator === 0) {
        throw new Error("Знаменник не може дорівнювати нулю");
      }
      
      this.numerator = parseInt(numerator) || 0;
      this.denominator = parseInt(denominator) || 1;
      
      // Handle negative signs
      if (this.denominator < 0) {
        this.numerator = -this.numerator;
        this.denominator = -this.denominator;
      }
    }

    // Simplify the fraction
    simplify() {
      const divisor = gcd(this.numerator, this.denominator);
      return new Fraction(this.numerator / divisor, this.denominator / divisor);
    }

    // Add another fraction
    add(other) {
      const commonDenominator = lcm(this.denominator, other.denominator);
      const newNum1 = this.numerator * (commonDenominator / this.denominator);
      const newNum2 = other.numerator * (commonDenominator / other.denominator);
      return new Fraction(newNum1 + newNum2, commonDenominator).simplify();
    }

    // Subtract another fraction
    subtract(other) {
      const commonDenominator = lcm(this.denominator, other.denominator);
      const newNum1 = this.numerator * (commonDenominator / this.denominator);
      const newNum2 = other.numerator * (commonDenominator / other.denominator);
      return new Fraction(newNum1 - newNum2, commonDenominator).simplify();
    }

    // Multiply by another fraction
    multiply(other) {
      return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator).simplify();
    }

    // Divide by another fraction
    divide(other) {
      if (other.numerator === 0) {
        throw new Error("Неможливо ділити на нуль");
      }
      return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator).simplify();
    }

    // Convert to decimal
    toDecimal() {
      return this.numerator / this.denominator;
    }

    // Convert to mixed number
    toMixed() {
      if (Math.abs(this.numerator) < Math.abs(this.denominator)) {
        return this.toString(); // Already a proper fraction
      }
      
      const wholePart = Math.floor(Math.abs(this.numerator) / Math.abs(this.denominator));
      const remainder = Math.abs(this.numerator) % Math.abs(this.denominator);
      
      if (remainder === 0) {
        return (this.numerator < 0 ? "-" : "") + wholePart.toString();
      }
      
      const sign = this.numerator < 0 ? "-" : "";
      return `${sign}${wholePart} ${remainder}/${this.denominator}`;
    }

    // String representation
    toString() {
      if (this.denominator === 1) {
        return this.numerator.toString();
      }
      return `${this.numerator}/${this.denominator}`;
    }

    // Check if fraction is improper
    isImproper() {
      return Math.abs(this.numerator) >= Math.abs(this.denominator);
    }
  }

  // DOM elements
  const operationRadios = document.querySelectorAll('input[name="operation"]');
  const operationSymbol = document.getElementById('operation-symbol');
  const num1Input = document.getElementById('num1');
  const den1Input = document.getElementById('den1');
  const num2Input = document.getElementById('num2');
  const den2Input = document.getElementById('den2');
  const calculateBtn = document.getElementById('calculate-btn');
  const resultSection = document.getElementById('result-section');
  const resultDisplay = document.getElementById('result-display');
  const resultBreakdown = document.getElementById('result-breakdown');
  const simplifiedResult = document.getElementById('simplified-result');
  const decimalResult = document.getElementById('decimal-result');
  const calculationSteps = document.getElementById('calculation-steps');
  const stepsContent = document.getElementById('steps-content');

  // Operation symbols mapping
  const operationSymbols = {
    'add': '+',
    'subtract': '−',
    'multiply': '×',
    'divide': '÷'
  };

  // Update operation symbol when operation changes
  operationRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        operationSymbol.textContent = operationSymbols[this.value];
      }
    });
  });

  // Calculate function
  function calculate() {
    try {
      // Get input values
      const num1 = parseInt(num1Input.value) || 0;
      const den1 = parseInt(den1Input.value) || 1;
      const num2 = parseInt(num2Input.value) || 0;
      const den2 = parseInt(den2Input.value) || 1;

      // Validate denominators
      if (den1 === 0 || den2 === 0) {
        throw new Error("Знаменник не може дорівнювати нулю");
      }

      // Create fractions
      const fraction1 = new Fraction(num1, den1);
      const fraction2 = new Fraction(num2, den2);

      // Get selected operation
      const operation = document.querySelector('input[name="operation"]:checked').value;

      let result;
      let steps = [];
      let operationName = "";

      // Perform calculation based on operation
      switch (operation) {
        case 'add':
          result = fraction1.add(fraction2);
          operationName = "Додавання";
          steps = generateAdditionSteps(fraction1, fraction2, result);
          break;
        case 'subtract':
          result = fraction1.subtract(fraction2);
          operationName = "Віднімання";
          steps = generateSubtractionSteps(fraction1, fraction2, result);
          break;
        case 'multiply':
          result = fraction1.multiply(fraction2);
          operationName = "Множення";
          steps = generateMultiplicationSteps(fraction1, fraction2, result);
          break;
        case 'divide':
          result = fraction1.divide(fraction2);
          operationName = "Ділення";
          steps = generateDivisionSteps(fraction1, fraction2, result);
          break;
        default:
          throw new Error("Невідома операція");
      }

      // Display results
      displayResults(fraction1, fraction2, result, operationName, steps);

    } catch (error) {
      showError(error.message);
    }
  }

  function generateAdditionSteps(frac1, frac2, result) {
    const steps = [];
    
    steps.push(`<div class="step"><strong>Вихідний приклад:</strong> ${frac1} + ${frac2}</div>`);
    
    if (frac1.denominator === frac2.denominator) {
      steps.push(`<div class="step">Знаменники однакові, додаємо чисельники: ${frac1.numerator} + ${frac2.numerator} = ${frac1.numerator + frac2.numerator}</div>`);
      steps.push(`<div class="step">Результат: ${frac1.numerator + frac2.numerator}/${frac1.denominator}</div>`);
    } else {
      const commonDenom = lcm(frac1.denominator, frac2.denominator);
      const newNum1 = frac1.numerator * (commonDenom / frac1.denominator);
      const newNum2 = frac2.numerator * (commonDenom / frac2.denominator);
      
      steps.push(`<div class="step">Знаходимо спільний знаменник: НСК(${frac1.denominator}, ${frac2.denominator}) = ${commonDenom}</div>`);
      steps.push(`<div class="step">Приводимо до спільного знаменника:</div>`);
      steps.push(`<div class="step">${frac1} = ${newNum1}/${commonDenom}</div>`);
      steps.push(`<div class="step">${frac2} = ${newNum2}/${commonDenom}</div>`);
      steps.push(`<div class="step">Додаємо чисельники: ${newNum1} + ${newNum2} = ${newNum1 + newNum2}</div>`);
      steps.push(`<div class="step">Результат: ${newNum1 + newNum2}/${commonDenom}</div>`);
    }
    
    if (result.toString() !== `${result.numerator}/${result.denominator}`) {
      steps.push(`<div class="step">Спрощуємо дріб: ${result}</div>`);
    }
    
    return steps;
  }

  function generateSubtractionSteps(frac1, frac2, result) {
    const steps = [];
    
    steps.push(`<div class="step"><strong>Вихідний приклад:</strong> ${frac1} − ${frac2}</div>`);
    
    if (frac1.denominator === frac2.denominator) {
      steps.push(`<div class="step">Знаменники однакові, віднімаємо чисельники: ${frac1.numerator} − ${frac2.numerator} = ${frac1.numerator - frac2.numerator}</div>`);
      steps.push(`<div class="step">Результат: ${frac1.numerator - frac2.numerator}/${frac1.denominator}</div>`);
    } else {
      const commonDenom = lcm(frac1.denominator, frac2.denominator);
      const newNum1 = frac1.numerator * (commonDenom / frac1.denominator);
      const newNum2 = frac2.numerator * (commonDenom / frac2.denominator);
      
      steps.push(`<div class="step">Знаходимо спільний знаменник: НСК(${frac1.denominator}, ${frac2.denominator}) = ${commonDenom}</div>`);
      steps.push(`<div class="step">Приводимо до спільного знаменника:</div>`);
      steps.push(`<div class="step">${frac1} = ${newNum1}/${commonDenom}</div>`);
      steps.push(`<div class="step">${frac2} = ${newNum2}/${commonDenom}</div>`);
      steps.push(`<div class="step">Віднімаємо чисельники: ${newNum1} − ${newNum2} = ${newNum1 - newNum2}</div>`);
      steps.push(`<div class="step">Результат: ${newNum1 - newNum2}/${commonDenom}</div>`);
    }
    
    if (result.toString() !== `${result.numerator}/${result.denominator}`) {
      steps.push(`<div class="step">Спрощуємо дріб: ${result}</div>`);
    }
    
    return steps;
  }

  function generateMultiplicationSteps(frac1, frac2, result) {
    const steps = [];
    
    steps.push(`<div class="step"><strong>Вихідний приклад:</strong> ${frac1} × ${frac2}</div>`);
    steps.push(`<div class="step">Множимо чисельники: ${frac1.numerator} × ${frac2.numerator} = ${frac1.numerator * frac2.numerator}</div>`);
    steps.push(`<div class="step">Множимо знаменники: ${frac1.denominator} × ${frac2.denominator} = ${frac1.denominator * frac2.denominator}</div>`);
    steps.push(`<div class="step">Результат: ${frac1.numerator * frac2.numerator}/${frac1.denominator * frac2.denominator}</div>`);
    
    if (result.toString() !== `${frac1.numerator * frac2.numerator}/${frac1.denominator * frac2.denominator}`) {
      steps.push(`<div class="step">Спрощуємо дріб: ${result}</div>`);
    }
    
    return steps;
  }

  function generateDivisionSteps(frac1, frac2, result) {
    const steps = [];
    
    steps.push(`<div class="step"><strong>Вихідний приклад:</strong> ${frac1} ÷ ${frac2}</div>`);
    steps.push(`<div class="step">Ділення на дріб = множення на обернений дріб</div>`);
    steps.push(`<div class="step">Обернений до ${frac2} дріб: ${frac2.denominator}/${frac2.numerator}</div>`);
    steps.push(`<div class="step">Множимо: ${frac1} × ${frac2.denominator}/${frac2.numerator}</div>`);
    steps.push(`<div class="step">Чисельник: ${frac1.numerator} × ${frac2.denominator} = ${frac1.numerator * frac2.denominator}</div>`);
    steps.push(`<div class="step">Знаменник: ${frac1.denominator} × ${frac2.numerator} = ${frac1.denominator * frac2.numerator}</div>`);
    steps.push(`<div class="step">Результат: ${frac1.numerator * frac2.denominator}/${frac1.denominator * frac2.numerator}</div>`);
    
    if (result.toString() !== `${frac1.numerator * frac2.denominator}/${frac1.denominator * frac2.numerator}`) {
      steps.push(`<div class="step">Спрощуємо дріб: ${result}</div>`);
    }
    
    return steps;
  }

  function displayResults(frac1, frac2, result, operationName, steps) {
    // Show main result
    resultDisplay.textContent = result.toString();
    
    // Show operation breakdown
    const operation = document.querySelector('input[name="operation"]:checked').value;
    const symbol = operationSymbols[operation];
    resultBreakdown.innerHTML = `
      <strong>${operationName}:</strong> ${frac1} ${symbol} ${frac2} = ${result}<br>
      <small>Операція виконана успішно ✅</small>
    `;

    // Show simplified result
    simplifiedResult.textContent = result.toString();
    if (result.isImproper()) {
      simplifiedResult.innerHTML += `<br><small>Мішане число: ${result.toMixed()}</small>`;
    }

    // Show decimal equivalent
    decimalResult.textContent = result.toDecimal().toFixed(6);

    // Show steps
    stepsContent.innerHTML = steps.join('');
    calculationSteps.style.display = 'block';

    // Show result section
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showError(message) {
    resultDisplay.textContent = "Помилка";
    resultBreakdown.innerHTML = `<span style="color: red;">❌ ${message}</span>`;
    simplifiedResult.textContent = "—";
    decimalResult.textContent = "—";
    calculationSteps.style.display = 'none';
    resultSection.style.display = 'block';
  }

  // Event listeners
  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input change (optional)
  [num1Input, den1Input, num2Input, den2Input].forEach(input => {
    input.addEventListener('input', function() {
      // Auto-calculate if all fields have valid values
      if (num1Input.value && den1Input.value && num2Input.value && den2Input.value) {
        calculate();
      }
    });
  });

  // Also auto-calculate on operation change
  operationRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (num1Input.value && den1Input.value && num2Input.value && den2Input.value) {
        calculate();
      }
    });
  });

  // Initial calculation with default values
  calculate();
});