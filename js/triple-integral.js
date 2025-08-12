function initTripleIntegralCalculator() {
  const form = document.getElementById("triple-integral-form");
  const result = document.getElementById("triple-integral-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      try {
        const functionStr = document.getElementById("function").value.trim();
        const xLower = parseFloat(document.getElementById("x-lower").value.trim());
        const xUpper = parseFloat(document.getElementById("x-upper").value.trim());
        const yLower = parseFloat(document.getElementById("y-lower").value.trim());
        const yUpper = parseFloat(document.getElementById("y-upper").value.trim());
        const zLower = parseFloat(document.getElementById("z-lower").value.trim());
        const zUpper = parseFloat(document.getElementById("z-upper").value.trim());
        const precision = parseInt(document.getElementById("precision").value);

        // Validate inputs
        if (isNaN(xLower) || isNaN(xUpper) || isNaN(yLower) || isNaN(yUpper) || isNaN(zLower) || isNaN(zUpper)) {
          throw new Error("Всі межі інтегрування повинні бути числами");
        }

        // Create function evaluator
        const f = createFunctionEvaluator(functionStr);
        
        const bounds = {
          x: [xLower, xUpper],
          y: [yLower, yUpper],
          z: [zLower, zUpper]
        };

        // Calculate triple integral using numerical integration (Monte Carlo method)
        const integralResult = calculateTripleIntegral(f, bounds, precision * 1000);
        
        // Display result
        displayResult(integralResult, functionStr, bounds);
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Помилка обчислення</h6>
            <p>Перевірте правильність введеного виразу та меж інтегрування.</p>
            <p><strong>Деталі:</strong> ${error.message}</p>
          </div>
        `;
      }
    });
  }

  function createFunctionEvaluator(functionStr) {
    // Basic function parser and evaluator
    const normalizedFunction = functionStr
      .replace(/\^/g, '**')  // Replace ^ with **
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/ln/g, 'Math.log')
      .replace(/log/g, 'Math.log10')
      .replace(/exp/g, 'Math.exp');

    return function(x, y, z) {
      try {
        // Use Function constructor to evaluate expression
        // Replace variables with actual values
        const expr = normalizedFunction
          .replace(/x/g, `(${x})`)
          .replace(/y/g, `(${y})`)
          .replace(/z/g, `(${z})`);
        
        return Function('"use strict"; return (' + expr + ')')();
      } catch (e) {
        throw new Error("Невірний формат функції");
      }
    };
  }

  function calculateTripleIntegral(f, bounds, samples) {
    // Monte Carlo integration for triple integrals
    const [xMin, xMax] = bounds.x;
    const [yMin, yMax] = bounds.y;
    const [zMin, zMax] = bounds.z;
    
    const volume = (xMax - xMin) * (yMax - yMin) * (zMax - zMin);
    let sum = 0;
    let validSamples = 0;
    
    for (let i = 0; i < samples; i++) {
      const x = xMin + Math.random() * (xMax - xMin);
      const y = yMin + Math.random() * (yMax - yMin);
      const z = zMin + Math.random() * (zMax - zMin);
      
      try {
        const value = f(x, y, z);
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          sum += value;
          validSamples++;
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    if (validSamples === 0) {
      throw new Error("Не вдалося обчислити функцію в жодній точці");
    }
    
    return (sum / validSamples) * volume;
  }

  function displayResult(result, functionStr, bounds) {
    const formattedResult = typeof result === 'number' ? result.toFixed(6) : 'Невизначено';
    const volume = (bounds.x[1] - bounds.x[0]) * (bounds.y[1] - bounds.y[0]) * (bounds.z[1] - bounds.z[0]);
    
    const html = `
      <div class="insight-card success">
        <h6>🎯 Результат обчислення потрійного інтеграла</h6>
        <div class="result-display">
          <p><strong>Функція:</strong> f(x,y,z) = ${functionStr}</p>
          <p><strong>Межі інтегрування:</strong></p>
          <ul>
            <li>x: від ${bounds.x[0]} до ${bounds.x[1]}</li>
            <li>y: від ${bounds.y[0]} до ${bounds.y[1]}</li>
            <li>z: від ${bounds.z[0]} до ${bounds.z[1]}</li>
          </ul>
          <div class="main-result">
            <p><strong>∫∫∫ f(x,y,z) dxdydz = ${formattedResult}</strong></p>
          </div>
        </div>
      </div>
      
      <div class="insight-card info">
        <h6>📊 Додаткова інформація</h6>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
          <div>
            <p><strong>Об'єм області:</strong></p>
            <p>${volume.toFixed(6)}</p>
          </div>
          <div>
            <p><strong>Середнє значення функції:</strong></p>
            <p>${(parseFloat(formattedResult) / volume).toFixed(6)}</p>
          </div>
        </div>
        
        <hr style="margin: 15px 0; border: 1px solid #e0e0e0;">
        
        <h6>💡 Інтерпретація результату</h6>
        <ul>
          <li>Якщо f(x,y,z) = 1, то результат — це <strong>об'єм</strong> області інтегрування</li>
          <li>Якщо f(x,y,z) — щільність, то результат — це <strong>маса</strong> тіла</li>
          <li>Для від'ємних значень результат може бути від'ємним</li>
        </ul>
      </div>
      
      <div class="insight-card">
        <h6>🔧 Методика обчислення</h6>
        <p>Використано метод Монте-Карло для чисельного інтегрування. Точність залежить від кількості випадкових точок.</p>
        <p><strong>Примітка:</strong> Для точних аналітичних результатів рекомендуємо перевіряти відповідь іншими методами.</p>
        <h6>🧮 Підтримувані функції</h6>
        <ul>
          <li><strong>Основні операції:</strong> +, -, *, /, ^ (або **)</li>
          <li><strong>Тригонометричні:</strong> sin, cos, tan</li>
          <li><strong>Інші:</strong> sqrt, ln, log, exp</li>
          <li><strong>Приклади:</strong> x*y*z, x^2+y^2+z^2, sin(x)*cos(y)</li>
        </ul>
      </div>
    `;
    
    result.innerHTML = html;
  }
}

// Initialize the calculator when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTripleIntegralCalculator);
} else {
  initTripleIntegralCalculator();
}