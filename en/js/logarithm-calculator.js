document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('logarithm-form');
  const result = document.getElementById('logarithm-result');
  const logType = document.getElementById('log-type');
  const baseGroup = document.getElementById('base-group');
  const logBase = document.getElementById('log-base');
  const logNumber = document.getElementById('log-number');

  // Set default values
  logNumber.value = '100';

  // Show/hide base input based on logarithm type
  if (logType) {
    logType.addEventListener('change', function () {
      if (this.value === 'custom') {
        baseGroup.style.display = 'block';
        logBase.required = true;
        logBase.value = logBase.value || '5';
      } else {
        baseGroup.style.display = 'none';
        logBase.required = false;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const type = logType.value;
      const number = parseFloat(logNumber.value);
      const base = parseFloat(logBase.value);

      // Validation
      if (isNaN(number) || number <= 0) {
        result.innerHTML = '<div class="insight-card warning">⚠️ Error: Number must be positive</div>';
        return;
      }

      if (type === 'custom' && (isNaN(base) || base <= 0 || base === 1)) {
        result.innerHTML = '<div class="insight-card warning">⚠️ Error: Base must be positive and not equal to 1</div>';
        return;
      }

      let logResult, baseValue, baseName;

      // Calculate logarithm based on type
      switch (type) {
        case 'natural':
          logResult = Math.log(number);
          baseValue = Math.E;
          baseName = 'e (natural)';
          break;
        case 'decimal':
          logResult = Math.log10(number);
          baseValue = 10;
          baseName = '10 (common)';
          break;
        case 'binary':
          logResult = Math.log2(number);
          baseValue = 2;
          baseName = '2 (binary)';
          break;
        case 'custom':
          logResult = Math.log(number) / Math.log(base);
          baseValue = base;
          baseName = base.toString();
          break;
      }

      // Format the result
      const formattedResult = Math.abs(logResult) < 1e-10 ? 0 : parseFloat(logResult.toFixed(10));
      const verification = Math.pow(baseValue, logResult);
      const verificationFormatted = Math.abs(verification - number) < 1e-10 ? number : parseFloat(verification.toFixed(10));

      // Generate insights
      let interpretation = '';
      if (formattedResult === 0) {
        interpretation = 'The logarithm equals zero because any number to the power of 0 equals 1.';
      } else if (formattedResult === 1) {
        interpretation = 'The logarithm equals one because the base to the first power equals itself.';
      } else if (formattedResult > 0) {
        interpretation = formattedResult > 1 ? 
          'A positive logarithm greater than 1 means the number is greater than the base.' :
          'A positive logarithm less than 1 means the number is between 1 and the base.';
      } else {
        interpretation = 'A negative logarithm means the number is less than 1.';
      }

      // Create result display with insight cards
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>📊 Result</h6>
            <div class="big-number">${formattedResult}</div>
            <div class="insight-detail">log<sub>${baseName}</sub>(${number}) = ${formattedResult}</div>
          </div>
          
          <div class="insight-card info">
            <h6>🔍 Verification</h6>
            <div class="result-value">${baseValue.toFixed(3)}<sup>${formattedResult}</sup> = ${verificationFormatted}</div>
            <div class="insight-detail">Substituting result back into formula</div>
          </div>
        </div>

        <div class="insight-card">
          <h6>💡 Explanation</h6>
          <p>${interpretation}</p>
          <p><strong>This means:</strong> to get the number ${number}, you need to raise ${baseName} to the power of ${formattedResult}.</p>
        </div>

        <div style="margin-top: 1.5rem;">
          <h6>📚 Useful Facts:</h6>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
              <strong>Properties:</strong><br>
              • log<sub>a</sub>(1) = 0<br>
              • log<sub>a</sub>(a) = 1<br>
              • log<sub>a</sub>(a<sup>x</sup>) = x
            </div>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
              <strong>Operations:</strong><br>
              • log(xy) = log(x) + log(y)<br>
              • log(x/y) = log(x) - log(y)<br>
              • log(x<sup>n</sup>) = n·log(x)
            </div>
          </div>
        </div>
      `;
    });

    // Calculate default result on page load
    if (logNumber.value) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});