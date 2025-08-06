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
        result.innerHTML = '<div class="insight-card warning">⚠️ Помилка: Число має бути додатним</div>';
        return;
      }

      if (type === 'custom' && (isNaN(base) || base <= 0 || base === 1)) {
        result.innerHTML = '<div class="insight-card warning">⚠️ Помилка: Основа має бути додатною і не дорівнювати 1</div>';
        return;
      }

      let logResult, baseValue, baseName;

      // Calculate logarithm based on type
      switch (type) {
        case 'natural':
          logResult = Math.log(number);
          baseValue = Math.E;
          baseName = 'e (натуральний)';
          break;
        case 'decimal':
          logResult = Math.log10(number);
          baseValue = 10;
          baseName = '10 (десятковий)';
          break;
        case 'binary':
          logResult = Math.log2(number);
          baseValue = 2;
          baseName = '2 (двійковий)';
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
        interpretation = 'Логарифм дорівнює нулю, оскільки будь-яке число в степені 0 дорівнює 1.';
      } else if (formattedResult === 1) {
        interpretation = 'Логарифм дорівнює одиниці, оскільки основа в першому степені дорівнює самій собі.';
      } else if (formattedResult > 0) {
        interpretation = formattedResult > 1 ? 
          'Позитивний логарифм більший за 1 означає, що число більше за основу.' :
          'Позитивний логарифм менший за 1 означає, що число знаходиться між 1 та основою.';
      } else {
        interpretation = 'Від\'ємний логарифм означає, що число менше за 1.';
      }

      // Create result display with insight cards
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>📊 Результат</h6>
            <div class="big-number">${formattedResult}</div>
            <div class="insight-detail">log<sub>${baseName}</sub>(${number}) = ${formattedResult}</div>
          </div>
          
          <div class="insight-card info">
            <h6>🔍 Перевірка</h6>
            <div class="result-value">${baseValue.toFixed(3)}<sup>${formattedResult}</sup> = ${verificationFormatted}</div>
            <div class="insight-detail">Підставляємо результат назад у формулу</div>
          </div>
        </div>

        <div class="insight-card">
          <h6>💡 Пояснення</h6>
          <p>${interpretation}</p>
          <p><strong>Це означає:</strong> щоб отримати число ${number}, потрібно піднести ${baseName} в степінь ${formattedResult}.</p>
        </div>

        <div style="margin-top: 1.5rem;">
          <h6>📚 Корисні факти:</h6>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
              <strong>Властивості:</strong><br>
              • log<sub>a</sub>(1) = 0<br>
              • log<sub>a</sub>(a) = 1<br>
              • log<sub>a</sub>(a<sup>x</sup>) = x
            </div>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
              <strong>Операції:</strong><br>
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