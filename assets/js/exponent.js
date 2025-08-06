document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('exponent-form');
  const result = document.getElementById('exponent-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const base = parseFloat(document.getElementById('base-input').value);
      const exponent = parseFloat(document.getElementById('exponent-input').value);
      
      if (isNaN(base) || isNaN(exponent)) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Будь ласка, введіть коректні числові значення.</p></div>';
        return;
      }
      
      try {
        const power = Math.pow(base, exponent);
        
        // Check for special cases
        let explanation = '';
        if (exponent === 0) {
          explanation = '<p><em>💡 Будь-яке число в нульовому степені дорівнює 1</em></p>';
        } else if (exponent === 1) {
          explanation = '<p><em>💡 Число в першому степені дорівнює собі</em></p>';
        } else if (exponent < 0) {
          explanation = `<p><em>💡 Від'ємний показник: ${base}^${exponent} = 1/${base}^${Math.abs(exponent)}</em></p>`;
        } else if (exponent % 1 !== 0) {
          explanation = '<p><em>💡 Дробовий показник означає корінь</em></p>';
        }
        
        // Format result
        let formattedResult;
        if (power === Infinity) {
          formattedResult = '∞ (нескінченність)';
        } else if (power === -Infinity) {
          formattedResult = '-∞ (від\'ємна нескінченність)';
        } else if (isNaN(power)) {
          formattedResult = 'Невизначено';
        } else if (Math.abs(power) > 1e15 || (Math.abs(power) < 1e-6 && power !== 0)) {
          formattedResult = power.toExponential(6);
        } else {
          formattedResult = Number(power.toPrecision(10)).toString();
        }
        
        result.innerHTML = `
          <div class="insight-card success">
            <h6>📊 Результат</h6>
            <div class="big-number">${base}^${exponent} = ${formattedResult}</div>
            ${explanation}
          </div>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>🔢 Основа</h6>
              <div class="big-number">${base}</div>
            </div>
            <div class="insight-card info">
              <h6>⬆️ Показник</h6>
              <div class="big-number">${exponent}</div>
            </div>
          </div>
        `;
        
      } catch (error) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Не вдається обчислити результат.</p></div>';
      }
    });
    
    // Calculate on page load with default values
    form.dispatchEvent(new Event('submit'));
  }
});