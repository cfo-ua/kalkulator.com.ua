document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('exponent-form');
  const result = document.getElementById('exponent-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const base = parseFloat(document.getElementById('base-input').value);
      const exponent = parseFloat(document.getElementById('exponent-input').value);
      
      if (isNaN(base) || isNaN(exponent)) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Error</h6><p>Please enter valid numeric values.</p></div>';
        return;
      }
      
      try {
        const power = Math.pow(base, exponent);
        
        // Check for special cases
        let explanation = '';
        if (exponent === 0) {
          explanation = '<p><em>💡 Any number to the power of zero equals 1</em></p>';
        } else if (exponent === 1) {
          explanation = '<p><em>💡 Any number to the power of one equals itself</em></p>';
        } else if (exponent < 0) {
          explanation = `<p><em>💡 Negative exponent: ${base}^${exponent} = 1/${base}^${Math.abs(exponent)}</em></p>`;
        } else if (exponent % 1 !== 0) {
          explanation = '<p><em>💡 Fractional exponent means a root</em></p>';
        }
        
        // Format result
        let formattedResult;
        if (power === Infinity) {
          formattedResult = '∞ (infinity)';
        } else if (power === -Infinity) {
          formattedResult = '-∞ (negative infinity)';
        } else if (isNaN(power)) {
          formattedResult = 'Undefined';
        } else if (Math.abs(power) > 1e15 || (Math.abs(power) < 1e-6 && power !== 0)) {
          formattedResult = power.toExponential(6);
        } else {
          formattedResult = Number(power.toPrecision(10)).toString();
        }
        
        result.innerHTML = `
          <div class="insight-card success">
            <h6>📊 Result</h6>
            <div class="big-number">${base}^${exponent} = ${formattedResult}</div>
            ${explanation}
          </div>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔢 Base</h6>
              <div class="big-number">${base}</div>
            </div>
            <div class="insight-card info">
              <h6>⬆️ Exponent</h6>
              <div class="big-number">${exponent}</div>
            </div>
          </div>
        `;
        
      } catch (error) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Error</h6><p>Unable to calculate result.</p></div>';
      }
    });
    
    // Calculate on page load with default values
    form.dispatchEvent(new Event('submit'));
  }
});