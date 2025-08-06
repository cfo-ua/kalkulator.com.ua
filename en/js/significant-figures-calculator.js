document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('sigfig-form');
  const result = document.getElementById('sigfig-result');
  const numberInput = document.getElementById('sigfig-number');
  const roundToInput = document.getElementById('round-to');

  // Set default value
  numberInput.value = '0.00450';

  function analyzeSignificantFigures(numStr) {
    // Remove any whitespace
    numStr = numStr.trim();
    
    // Check if it's a valid number
    if (isNaN(parseFloat(numStr)) || !isFinite(parseFloat(numStr))) {
      return null;
    }

    // Handle scientific notation
    const scientificMatch = numStr.match(/^([+-]?\d*\.?\d+)[eE]([+-]?\d+)$/);
    if (scientificMatch) {
      const mantissa = scientificMatch[1];
      const exponent = scientificMatch[2];
      return analyzeSignificantFigures(mantissa);
    }

    // Remove sign for analysis
    const cleanNum = numStr.replace(/^[+-]/, '');
    
    // Check if number has decimal point
    const hasDecimal = cleanNum.includes('.');
    const parts = cleanNum.split('.');
    const integerPart = parts[0] || '';
    const decimalPart = parts[1] || '';

    let significantDigits = [];
    let digitDetails = [];

    // Analyze integer part
    let foundNonZero = false;
    for (let i = 0; i < integerPart.length; i++) {
      const digit = integerPart[i];
      if (digit !== '0') {
        foundNonZero = true;
      }
      
      if (foundNonZero) {
        significantDigits.push(digit);
        digitDetails.push({
          digit: digit,
          position: integerPart.length - i,
          isSignificant: true,
          reason: digit === '0' ? 'Zero between significant digits' : 'Non-zero digit'
        });
      } else {
        digitDetails.push({
          digit: digit,
          position: integerPart.length - i,
          isSignificant: false,
          reason: 'Leading zero'
        });
      }
    }

    // Analyze decimal part
    if (hasDecimal) {
      for (let i = 0; i < decimalPart.length; i++) {
        const digit = decimalPart[i];
        if (digit !== '0') {
          foundNonZero = true;
        }
        
        if (foundNonZero) {
          significantDigits.push(digit);
          digitDetails.push({
            digit: digit,
            position: -(i + 1),
            isSignificant: true,
            reason: digit === '0' ? 'Trailing zero after decimal' : 'Non-zero digit'
          });
        } else {
          digitDetails.push({
            digit: digit,
            position: -(i + 1),
            isSignificant: false,
            reason: 'Leading zero after decimal'
          });
        }
      }
    }

    return {
      originalNumber: numStr,
      significantDigits: significantDigits,
      count: significantDigits.length,
      digitDetails: digitDetails,
      hasDecimal: hasDecimal
    };
  }

  function roundToSignificantFigures(numStr, sigFigs) {
    const num = parseFloat(numStr);
    if (num === 0) return '0';
    
    const digits = Math.floor(Math.log10(Math.abs(num))) + 1;
    const roundedNum = parseFloat(num.toPrecision(sigFigs));
    
    // Format the result appropriately
    if (Math.abs(roundedNum) >= 1) {
      return roundedNum.toPrecision(sigFigs);
    } else {
      return roundedNum.toString();
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const numStr = numberInput.value;
      const roundTo = parseInt(roundToInput.value);

      if (!numStr) {
        result.innerHTML = '<div class="insight-card warning">⚠️ Please enter a number</div>';
        return;
      }

      const analysis = analyzeSignificantFigures(numStr);
      if (!analysis) {
        result.innerHTML = '<div class="insight-card warning">⚠️ Invalid number. Please check your input.</div>';
        return;
      }

      // Create visual representation of the number
      let visualNumber = '';
      let allDigits = '';
      
      // Reconstruct the number with highlighting
      const cleanNum = numStr.replace(/^[+-]/, '');
      const hasSign = numStr !== cleanNum;
      const sign = hasSign ? numStr[0] : '';

      if (hasSign) visualNumber += sign;

      for (let i = 0; i < cleanNum.length; i++) {
        const char = cleanNum[i];
        if (char === '.') {
          visualNumber += char;
          allDigits += char;
        } else {
          const isSignificant = analysis.digitDetails.find(d => 
            allDigits.replace('.', '').length === analysis.digitDetails.indexOf(d)
          )?.isSignificant;
          
          if (analysis.significantDigits.includes(char) && 
              analysis.digitDetails[allDigits.replace('.', '').length]?.isSignificant !== false) {
            visualNumber += `<span style="background: #e3f2fd; padding: 0 2px; border-radius: 3px; font-weight: bold;">${char}</span>`;
          } else {
            visualNumber += `<span style="color: #999;">${char}</span>`;
          }
          allDigits += char;
        }
      }

      // Generate rounded result if requested
      let roundedResult = '';
      if (roundTo && roundTo > 0) {
        const rounded = roundToSignificantFigures(numStr, roundTo);
        roundedResult = `
          <div class="insight-card info">
            <h6>🔄 Rounding</h6>
            <div class="result-value">To ${roundTo} significant figures: ${rounded}</div>
          </div>
        `;
      }

      // Create detailed breakdown
      const detailsTable = analysis.digitDetails.map((detail, index) => {
        const status = detail.isSignificant ? '✅' : '❌';
        const bgColor = detail.isSignificant ? '#e8f5e8' : '#f5f5f5';
        return `
          <tr style="background: ${bgColor};">
            <td style="text-align: center; font-weight: bold;">${detail.digit}</td>
            <td>${detail.reason}</td>
            <td style="text-align: center;">${status}</td>
          </tr>
        `;
      }).join('');

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>📊 Result</h6>
            <div class="big-number">${analysis.count}</div>
            <div class="insight-detail">significant figures</div>
          </div>
        </div>

        ${roundedResult}

        <div class="insight-card">
          <h6>🔍 Visual Analysis</h6>
          <div style="font-size: 1.5rem; text-align: center; margin: 1rem 0; font-family: monospace;">
            ${visualNumber}
          </div>
          <p style="text-align: center; color: #666; font-size: 0.9rem;">
            Highlighted digits are significant
          </p>
        </div>

        <div class="insight-card">
          <h6>📋 Detailed Breakdown</h6>
          <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Digit</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Rule</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">Significant</th>
              </tr>
            </thead>
            <tbody>
              ${detailsTable}
            </tbody>
          </table>
        </div>

        <div class="insight-card">
          <h6>💡 Significant Figures Rules</h6>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
              <strong>Always significant:</strong><br>
              • Non-zero digits<br>
              • Zeros between non-zeros<br>
              • Trailing zeros after decimal
            </div>
            <div style="background: #fff0f0; padding: 1rem; border-radius: 8px;">
              <strong>Never significant:</strong><br>
              • Leading zeros<br>
              • Trailing zeros without decimal<br>
              (unless otherwise specified)
            </div>
          </div>
        </div>
      `;
    });

    // Calculate default result on page load
    if (numberInput.value) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});