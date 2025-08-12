document.addEventListener("DOMContentLoaded", function () {
  const standardInput = document.getElementById('standard-number');
  const mantissaInput = document.getElementById('mantissa');
  const exponentInput = document.getElementById('exponent');
  const convertToScientificBtn = document.getElementById('convert-to-scientific');
  const convertToStandardBtn = document.getElementById('convert-to-standard');
  const result = document.getElementById('scientific-result');

  if (!standardInput || !mantissaInput || !exponentInput || !result) return;

  // Function to convert to scientific notation
  function toScientificNotation(number) {
    if (number === 0) return { mantissa: 0, exponent: 0 };
    
    const absNumber = Math.abs(number);
    const exponent = Math.floor(Math.log10(absNumber));
    const mantissa = number / Math.pow(10, exponent);
    
    return { mantissa: parseFloat(mantissa.toFixed(10)), exponent };
  }

  // Function to convert from scientific notation
  function fromScientificNotation(mantissa, exponent) {
    return mantissa * Math.pow(10, exponent);
  }

  // Function to format number for display
  function formatNumber(num) {
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-4 && num !== 0)) {
      return num.toExponential(6);
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
  }

  // Convert to scientific notation
  convertToScientificBtn.addEventListener('click', function() {
    const inputValue = standardInput.value.replace(/,/g, '').replace(/\s/g, '');
    const number = parseFloat(inputValue);
    
    if (isNaN(number)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Error</h6><p>Please enter a valid number</p></div>';
      return;
    }

    const scientific = toScientificNotation(number);
    mantissaInput.value = scientific.mantissa;
    exponentInput.value = scientific.exponent;

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🔬 Scientific Notation</h6>
          <div class="big-number">${scientific.mantissa} × 10<sup>${scientific.exponent}</sup></div>
        </div>
        <div class="insight-card info">
          <h6>📊 Details</h6>
          <div class="result-value">Mantissa: ${scientific.mantissa}</div>
          <div class="result-value">Exponent: ${scientific.exponent}</div>
        </div>
      </div>
      <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
        <strong>Explanation:</strong> The number ${formatNumber(number)} is written as ${scientific.mantissa} × 10<sup>${scientific.exponent}</sup>
      </div>
    `;
  });

  // Convert to standard notation
  convertToStandardBtn.addEventListener('click', function() {
    const mantissa = parseFloat(mantissaInput.value);
    const exponent = parseInt(exponentInput.value);
    
    if (isNaN(mantissa) || isNaN(exponent)) {
      result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Error</h6><p>Please enter valid mantissa and exponent values</p></div>';
      return;
    }

    const standardNumber = fromScientificNotation(mantissa, exponent);
    standardInput.value = standardNumber.toString();

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>📈 Standard Notation</h6>
          <div class="big-number">${formatNumber(standardNumber)}</div>
        </div>
        <div class="insight-card info">
          <h6>🔢 Input Data</h6>
          <div class="result-value">Mantissa: ${mantissa}</div>
          <div class="result-value">Exponent: ${exponent}</div>
        </div>
      </div>
      <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
        <strong>Explanation:</strong> ${mantissa} × 10<sup>${exponent}</sup> = ${formatNumber(standardNumber)}
      </div>
    `;
  });

  // Auto-convert when typing in standard input
  standardInput.addEventListener('input', function() {
    const inputValue = this.value.replace(/,/g, '').replace(/\s/g, '');
    const number = parseFloat(inputValue);
    
    if (!isNaN(number) && number !== 0) {
      const scientific = toScientificNotation(number);
      mantissaInput.value = scientific.mantissa;
      exponentInput.value = scientific.exponent;
    }
  });

  // Auto-convert when typing in mantissa or exponent
  function updateStandardFromScientific() {
    const mantissa = parseFloat(mantissaInput.value);
    const exponent = parseInt(exponentInput.value);
    
    if (!isNaN(mantissa) && !isNaN(exponent)) {
      const standardNumber = fromScientificNotation(mantissa, exponent);
      standardInput.value = standardNumber.toString();
    }
  }

  mantissaInput.addEventListener('input', updateStandardFromScientific);
  exponentInput.addEventListener('input', updateStandardFromScientific);

  // Initialize with default values
  convertToScientificBtn.click();
});