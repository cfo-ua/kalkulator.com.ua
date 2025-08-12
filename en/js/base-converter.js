document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('base-converter-form');
  const result = document.getElementById('base-converter-result');
  const inputs = {
    decimal: document.getElementById('bc-decimal'),
    binary: document.getElementById('bc-binary'),
    octal: document.getElementById('bc-octal'),
    hex: document.getElementById('bc-hex')
  };
  const convertBtn = document.getElementById('bc-convert');
  const clearBtn = document.getElementById('bc-clear');
  const signedCheckbox = document.getElementById('bc-signed');
  const twosComplementCheckbox = document.getElementById('bc-twos-complement');
  const bitWidthSelect = document.getElementById('bc-bit-width');

  // Set default values
  inputs.decimal.value = '255';
  
  // Auto-convert on input
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', function() {
      if (this.value.trim()) {
        convertFromInput(this);
      }
    });
  });

  // Convert button
  convertBtn.addEventListener('click', function() {
    const activeInput = Object.values(inputs).find(input => input.value.trim() !== '');
    if (activeInput) {
      convertFromInput(activeInput);
    } else {
      convertFromInput(inputs.decimal);
    }
  });

  // Clear button
  clearBtn.addEventListener('click', function() {
    Object.values(inputs).forEach(input => input.value = '');
    result.innerHTML = '';
  });

  function convertFromInput(sourceInput) {
    try {
      const value = sourceInput.value.trim();
      if (!value) return;

      let decimalValue;
      const isSigned = signedCheckbox.checked;
      const useTwosComplement = twosComplementCheckbox.checked;
      const bitWidth = parseInt(bitWidthSelect.value);
      const maxUnsigned = Math.pow(2, bitWidth) - 1;
      const maxSigned = Math.pow(2, bitWidth - 1) - 1;
      const minSigned = -Math.pow(2, bitWidth - 1);

      // Parse input based on source
      switch (sourceInput.id) {
        case 'bc-decimal':
          decimalValue = parseInt(value, 10);
          break;
        case 'bc-binary':
          if (!/^[01]+$/.test(value)) {
            throw new Error('Invalid binary format');
          }
          decimalValue = parseInt(value, 2);
          break;
        case 'bc-octal':
          if (!/^[0-7]+$/.test(value)) {
            throw new Error('Invalid octal format');
          }
          decimalValue = parseInt(value, 8);
          break;
        case 'bc-hex':
          if (!/^[0-9A-Fa-f]+$/.test(value)) {
            throw new Error('Invalid hexadecimal format');
          }
          decimalValue = parseInt(value, 16);
          break;
        default:
          throw new Error('Unknown source');
      }

      if (isNaN(decimalValue)) {
        throw new Error('Invalid number');
      }

      // Validate range
      if (isSigned) {
        if (decimalValue > maxSigned || decimalValue < minSigned) {
          throw new Error(`Number out of range for ${bitWidth}-bit signed number (${minSigned} to ${maxSigned})`);
        }
      } else {
        if (decimalValue > maxUnsigned || decimalValue < 0) {
          throw new Error(`Number out of range for ${bitWidth}-bit unsigned number (0 to ${maxUnsigned})`);
        }
      }

      // Handle negative numbers with two's complement
      let workingValue = decimalValue;
      if (isSigned && useTwosComplement && decimalValue < 0) {
        workingValue = Math.pow(2, bitWidth) + decimalValue;
      }

      // Convert to all bases
      const binary = workingValue.toString(2).padStart(bitWidth, '0');
      const octal = workingValue.toString(8);
      const hex = workingValue.toString(16).toUpperCase();

      // Update all inputs except the source
      if (sourceInput.id !== 'bc-decimal') {
        inputs.decimal.value = decimalValue.toString();
      }
      if (sourceInput.id !== 'bc-binary') {
        inputs.binary.value = binary;
      }
      if (sourceInput.id !== 'bc-octal') {
        inputs.octal.value = octal;
      }
      if (sourceInput.id !== 'bc-hex') {
        inputs.hex.value = hex;
      }

      // Display detailed results
      displayResults(decimalValue, binary, octal, hex, isSigned, useTwosComplement, bitWidth);

    } catch (error) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Error</h6>
        <div>${error.message}</div>
      </div>`;
    }
  }

  function displayResults(decimal, binary, octal, hex, isSigned, useTwosComplement, bitWidth) {
    let resultHTML = '<div class="insight-cards">';
    
    // Main results
    resultHTML += `
      <div class="insight-card success">
        <h6>🔟 Decimal</h6>
        <div class="big-number">${decimal}</div>
      </div>
      
      <div class="insight-card info">
        <h6>💻 Binary</h6>
        <div class="result-value">${binary}</div>
        <div class="small-text">${binary.length} bits</div>
      </div>
      
      <div class="insight-card info">
        <h6>🔢 Octal</h6>
        <div class="result-value">${octal}</div>
      </div>
      
      <div class="insight-card info">
        <h6>🔠 Hexadecimal</h6>
        <div class="result-value">${hex}</div>
      </div>
    `;

    resultHTML += '</div>';

    // Additional information
    resultHTML += '<div class="additional-info">';
    
    // Bit analysis
    resultHTML += `<h4>🔍 Detailed Analysis</h4>`;
    resultHTML += '<div class="bit-analysis">';
    
    if (isSigned && useTwosComplement && decimal < 0) {
      resultHTML += `<p><strong>Two's complement:</strong> ${binary}</p>`;
      resultHTML += `<p><strong>Original negative value:</strong> ${decimal}</p>`;
    }
    
    // Power breakdown for decimal
    if (binary.length <= 16) { // Only for reasonable lengths
      resultHTML += '<p><strong>Power breakdown:</strong><br>';
      const powers = [];
      for (let i = 0; i < binary.length; i++) {
        if (binary[binary.length - 1 - i] === '1') {
          powers.push(`2^${i} = ${Math.pow(2, i)}`);
        }
      }
      resultHTML += powers.join(' + ') + ` = ${Math.abs(decimal)}`;
      resultHTML += '</p>';
    }
    
    resultHTML += '</div>';
    resultHTML += '</div>';

    result.innerHTML = resultHTML;
  }

  // Initial conversion with default value
  convertFromInput(inputs.decimal);
});