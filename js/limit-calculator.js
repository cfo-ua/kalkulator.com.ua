document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("limit-form");
  const result = document.getElementById("limit-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      try {
        const functionStr = document.getElementById("limit-function").value.trim();
        const pointStr = document.getElementById("limit-point").value.trim();
        const limitType = document.getElementById("limit-type").value;
        const showSteps = document.getElementById("show-steps").checked;
        const checkContinuity = document.getElementById("check-continuity").checked;

        // Parse function
        let f;
        try {
          // Replace common notations
          const normalizedFunction = functionStr
            .replace(/\bln\(/g, "log(")
            .replace(/\be\^/g, "exp(");
          f = math.parse(normalizedFunction);
        } catch (e) {
          throw new Error("Невірний формат функції");
        }

        // Parse point
        let point;
        if (pointStr.toLowerCase() === 'infinity' || pointStr === '∞' || pointStr === 'inf') {
          point = Infinity;
        } else if (pointStr.toLowerCase() === '-infinity' || pointStr === '-∞') {
          point = -Infinity;
        } else {
          point = parseFloat(pointStr);
          if (isNaN(point)) {
            throw new Error("Невірний формат точки");
          }
        }

        // Calculate limit
        const limitResult = calculateLimit(f, point, limitType);
        
        // Check continuity if requested
        let continuityResult = null;
        if (checkContinuity && isFinite(point)) {
          continuityResult = checkFunctionContinuity(f, point);
        }
        
        // Display result
        displayLimitResult(limitResult, functionStr, point, limitType, showSteps, continuityResult);
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Помилка обчислення</h6>
            <p>Перевірте правильність введеного виразу та точки.</p>
            <p><strong>Деталі:</strong> ${error.message}</p>
          </div>
        `;
      }
    });
  }

  function calculateLimit(f, point, type) {
    const h = 0.000001; // Small step for numerical calculation
    
    if (point === Infinity) {
      return calculateLimitAtInfinity(f, true);
    } else if (point === -Infinity) {
      return calculateLimitAtInfinity(f, false);
    }
    
    let leftLimit, rightLimit;
    
    try {
      // Calculate left limit
      leftLimit = calculateNumericalLimit(f, point, -h);
    } catch (e) {
      leftLimit = null;
    }
    
    try {
      // Calculate right limit
      rightLimit = calculateNumericalLimit(f, point, h);
    } catch (e) {
      rightLimit = null;
    }
    
    if (type === 'left') {
      return { value: leftLimit, type: 'left', exists: leftLimit !== null };
    } else if (type === 'right') {
      return { value: rightLimit, type: 'right', exists: rightLimit !== null };
    } else {
      // Two-sided limit
      const exists = leftLimit !== null && rightLimit !== null && 
                    Math.abs(leftLimit - rightLimit) < 0.0001;
      return {
        value: exists ? leftLimit : null,
        leftValue: leftLimit,
        rightValue: rightLimit,
        type: 'both',
        exists: exists
      };
    }
  }

  function calculateNumericalLimit(f, point, direction) {
    const steps = 10;
    let h = direction > 0 ? 0.1 : -0.1;
    
    for (let i = 0; i < steps; i++) {
      const x = point + h;
      const value = f.evaluate({ x: x });
      
      if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
        h /= 10;
        continue;
      }
      
      return value;
    }
    
    return null;
  }

  function calculateLimitAtInfinity(f, positive) {
    const values = [];
    const start = positive ? 10 : -10;
    const multiplier = positive ? 10 : -10;
    
    for (let i = 1; i <= 5; i++) {
      const x = start * Math.pow(10, i);
      try {
        const value = f.evaluate({ x: x });
        if (typeof value === 'number' && !isNaN(value)) {
          values.push(value);
        }
      } catch (e) {
        // Skip
      }
    }
    
    if (values.length === 0) return null;
    
    // Check if converging
    const lastValue = values[values.length - 1];
    return isFinite(lastValue) ? lastValue : null;
  }

  function checkFunctionContinuity(f, point) {
    try {
      const functionValue = f.evaluate({ x: point });
      const limitResult = calculateLimit(f, point, 'both');
      
      const isContinuous = limitResult.exists && 
                          Math.abs(limitResult.value - functionValue) < 0.0001;
      
      return {
        functionValue: functionValue,
        limitValue: limitResult.value,
        isContinuous: isContinuous
      };
    } catch (e) {
      return null;
    }
  }

  function displayLimitResult(limitResult, functionStr, point, type, showSteps, continuityResult) {
    const pointStr = point === Infinity ? '∞' : point === -Infinity ? '-∞' : point.toString();
    const typeStr = type === 'left' ? '⁻' : type === 'right' ? '⁺' : '';
    
    let html = `
      <div class="insight-card ${limitResult.exists ? 'success' : 'warning'}">
        <h6>${limitResult.exists ? '🎯' : '⚠️'} Результат обчислення границі</h6>
        <div class="result-display">
          <p><strong>Функція:</strong> f(x) = ${functionStr}</p>
          <p><strong>Границя:</strong> lim(x→${pointStr}${typeStr}) f(x)</p>
          <div class="main-result">
    `;
    
    if (limitResult.exists) {
      const value = typeof limitResult.value === 'number' ? 
                   limitResult.value.toFixed(6) : limitResult.value;
      html += `<p><strong>Результат: ${value}</strong></p>`;
    } else {
      html += `<p><strong>Границя не існує</strong></p>`;
      if (limitResult.leftValue !== null && limitResult.rightValue !== null) {
        html += `
          <p>Ліва границя: ${limitResult.leftValue.toFixed(6)}</p>
          <p>Права границя: ${limitResult.rightValue.toFixed(6)}</p>
        `;
      }
    }
    
    html += `
        </div>
      </div>
    `;

    if (showSteps) {
      html += `
        <div class="insight-card info">
          <h6>📝 Методика обчислення</h6>
          <ol>
            <li>Спроба прямої підстановки x = ${pointStr}</li>
            <li>Якщо невизначеність — використання чисельних методів</li>
            <li>Обчислення лівої та правої границь</li>
            <li>Порівняння результатів для двосторонньої границі</li>
          </ol>
        </div>
      `;
    }

    if (continuityResult) {
      html += `
        <div class="insight-card ${continuityResult.isContinuous ? 'success' : 'warning'}">
          <h6>${continuityResult.isContinuous ? '✅' : '❌'} Перевірка неперервності</h6>
          <p><strong>Значення функції в точці:</strong> f(${point}) = ${continuityResult.functionValue.toFixed(6)}</p>
          <p><strong>Значення границі:</strong> ${continuityResult.limitValue ? continuityResult.limitValue.toFixed(6) : 'не існує'}</p>
          <p><strong>Висновок:</strong> Функція ${continuityResult.isContinuous ? 'неперервна' : 'розривна'} в точці x = ${point}</p>
        </div>
      `;
    }

    html += `
      <div class="insight-card">
        <h6>💡 Корисна інформація</h6>
        <ul>
          <li><strong>Невизначеності:</strong> 0/0, ∞/∞, 0·∞, ∞-∞, 1^∞</li>
          <li><strong>Правило Лопіталя:</strong> для форм 0/0 та ∞/∞</li>
          <li><strong>Границі на ∞:</strong> аналіз найвищих степенів</li>
          <li><strong>Неперервність:</strong> lim f(x) = f(a) в точці a</li>
        </ul>
      </div>
    `;
    
    result.innerHTML = html;
  }
});