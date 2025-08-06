document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('pythagorean-form');
  const result = document.getElementById('pythagorean-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const sideA = parseFloat(document.getElementById('side-a-input').value);
      const sideB = parseFloat(document.getElementById('side-b-input').value);
      const sideC = parseFloat(document.getElementById('side-c-input').value);
      
      // Count how many sides are provided
      const providedSides = [sideA, sideB, sideC].filter(side => !isNaN(side) && side > 0);
      
      if (providedSides.length < 2) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Введіть принаймні два значення сторін трикутника.</p></div>';
        return;
      }
      
      try {
        let a, b, c, calculationType;
        
        // Determine what to calculate
        if (!isNaN(sideA) && !isNaN(sideB) && (isNaN(sideC) || sideC === 0)) {
          // Calculate hypotenuse
          a = sideA;
          b = sideB;
          c = Math.sqrt(a * a + b * b);
          calculationType = 'hypotenuse';
        } else if (!isNaN(sideA) && !isNaN(sideC) && (isNaN(sideB) || sideB === 0)) {
          // Calculate side b
          a = sideA;
          c = sideC;
          if (c <= a) {
            result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Гіпотенуза має бути довшою за катет.</p></div>';
            return;
          }
          b = Math.sqrt(c * c - a * a);
          calculationType = 'cathetus_b';
        } else if (!isNaN(sideB) && !isNaN(sideC) && (isNaN(sideA) || sideA === 0)) {
          // Calculate side a
          b = sideB;
          c = sideC;
          if (c <= b) {
            result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Гіпотенуза має бути довшою за катет.</p></div>';
            return;
          }
          a = Math.sqrt(c * c - b * b);
          calculationType = 'cathetus_a';
        } else {
          // All three sides provided - verify Pythagorean theorem
          a = sideA;
          b = sideB;
          c = sideC;
          calculationType = 'verify';
        }
        
        // Calculate triangle properties
        const area = (a * b) / 2;
        const perimeter = a + b + c;
        const angleA = Math.asin(a / c) * (180 / Math.PI);
        const angleB = Math.asin(b / c) * (180 / Math.PI);
        const angleC = 90; // Right angle
        
        // Check if it's a Pythagorean triple
        const isPythagoreanTriple = Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c) && 
                                   Math.abs(a * a + b * b - c * c) < 0.0001;
        
        let calculationExplanation = '';
        switch (calculationType) {
          case 'hypotenuse':
            calculationExplanation = `<p><em>💡 Обчислена гіпотенуза: c = √(${a}² + ${b}²) = √${(a*a + b*b).toFixed(2)} = ${c.toFixed(4)}</em></p>`;
            break;
          case 'cathetus_a':
            calculationExplanation = `<p><em>💡 Обчислений катет a: a = √(${c}² - ${b}²) = √${(c*c - b*b).toFixed(2)} = ${a.toFixed(4)}</em></p>`;
            break;
          case 'cathetus_b':
            calculationExplanation = `<p><em>💡 Обчислений катет b: b = √(${c}² - ${a}²) = √${(c*c - a*a).toFixed(2)} = ${b.toFixed(4)}</em></p>`;
            break;
          case 'verify':
            const leftSide = a * a + b * b;
            const rightSide = c * c;
            const isValid = Math.abs(leftSide - rightSide) < 0.0001;
            calculationExplanation = `<p><em>💡 Перевірка: ${a}² + ${b}² = ${leftSide.toFixed(2)}, c² = ${rightSide.toFixed(2)} - ${isValid ? '✅ Правильний прямокутний трикутник' : '❌ Не прямокутний трикутник'}</em></p>`;
            break;
        }
        
        result.innerHTML = `
          <div class="insight-card success">
            <h6>🔺 Прямокутний трикутник</h6>
            <div class="big-number">a² + b² = c²</div>
            ${calculationExplanation}
            ${isPythagoreanTriple ? '<p><strong>🎯 Піфагорова трійка!</strong></p>' : ''}
          </div>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>📏 Катет a</h6>
              <div class="big-number">${a.toFixed(4)}</div>
            </div>
            <div class="insight-card info">
              <h6>📏 Катет b</h6>
              <div class="big-number">${b.toFixed(4)}</div>
            </div>
            <div class="insight-card info">
              <h6>📐 Гіпотенуза c</h6>
              <div class="big-number">${c.toFixed(4)}</div>
            </div>
          </div>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>📐 Площа</h6>
              <div class="big-number">${area.toFixed(4)}</div>
            </div>
            <div class="insight-card info">
              <h6>⭕ Периметр</h6>
              <div class="big-number">${perimeter.toFixed(4)}</div>
            </div>
            <div class="insight-card info">
              <h6>🔄 Співвідношення</h6>
              <div class="big-number">${a.toFixed(1)}:${b.toFixed(1)}:${c.toFixed(1)}</div>
            </div>
          </div>
          
          <div class="insight-card">
            <h6>📊 Детальна інформація</h6>
            <table>
              <tr><td><strong>Катет a:</strong></td><td>${a.toFixed(6)}</td></tr>
              <tr><td><strong>Катет b:</strong></td><td>${b.toFixed(6)}</td></tr>
              <tr><td><strong>Гіпотенуза c:</strong></td><td>${c.toFixed(6)}</td></tr>
              <tr><td><strong>Площа:</strong></td><td>${area.toFixed(6)}</td></tr>
              <tr><td><strong>Периметр:</strong></td><td>${perimeter.toFixed(6)}</td></tr>
              <tr><td><strong>Кут A:</strong></td><td>${angleA.toFixed(2)}°</td></tr>
              <tr><td><strong>Кут B:</strong></td><td>${angleB.toFixed(2)}°</td></tr>
              <tr><td><strong>Кут C:</strong></td><td>90°</td></tr>
            </table>
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