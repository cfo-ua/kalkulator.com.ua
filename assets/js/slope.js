document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('slope-form');
  const result = document.getElementById('slope-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const x1 = parseFloat(document.getElementById('x1-input').value);
      const y1 = parseFloat(document.getElementById('y1-input').value);
      const x2 = parseFloat(document.getElementById('x2-input').value);
      const y2 = parseFloat(document.getElementById('y2-input').value);
      
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        result.innerHTML = '<div class="insight-card warning"><h6>⚠️ Помилка</h6><p>Будь ласка, введіть коректні координати всіх точок.</p></div>';
        return;
      }
      
      try {
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        
        // Check for vertical line
        if (deltaX === 0) {
          result.innerHTML = `
            <div class="insight-card warning">
              <h6>📏 Вертикальна пряма</h6>
              <div class="big-number">Нахил = ∞ (не визначено)</div>
              <p><em>💡 Вертикальні прямі мають нескінченний нахил</em></p>
            </div>
            
            <div class="insight-cards">
              <div class="insight-card info">
                <h6>📍 Точка 1</h6>
                <div class="big-number">(${x1}, ${y1})</div>
              </div>
              <div class="insight-card info">
                <h6>📍 Точка 2</h6>
                <div class="big-number">(${x2}, ${y2})</div>
              </div>
              <div class="insight-card info">
                <h6>📏 Відстань</h6>
                <div class="big-number">${Math.abs(deltaY).toFixed(4)}</div>
              </div>
            </div>
            
            <div class="insight-card">
              <h6>📊 Рівняння прямої</h6>
              <p><strong>x = ${x1}</strong> (вертикальна пряма)</p>
            </div>
          `;
          return;
        }
        
        const slope = deltaY / deltaX;
        const angleRadians = Math.atan(slope);
        const angleDegrees = angleRadians * (180 / Math.PI);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Calculate y-intercept (b) using point-slope form: y = mx + b
        const yIntercept = y1 - slope * x1;
        
        // Determine slope direction
        let slopeDirection = '';
        if (slope > 0) {
          slopeDirection = '⬈ Пряма піднімається';
        } else if (slope < 0) {
          slopeDirection = '⬊ Пряма опускається';
        } else {
          slopeDirection = '➡️ Горизонтальна пряма';
        }
        
        result.innerHTML = `
          <div class="insight-card success">
            <h6>📐 Нахил прямої</h6>
            <div class="big-number">${slope.toFixed(6)}</div>
            <p><em>💡 ${slopeDirection}</em></p>
          </div>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>📐 Кут нахилу</h6>
              <div class="big-number">${angleDegrees.toFixed(2)}°</div>
            </div>
            <div class="insight-card info">
              <h6>📏 Відстань</h6>
              <div class="big-number">${distance.toFixed(4)}</div>
            </div>
            <div class="insight-card info">
              <h6>🔄 Зміна Y/X</h6>
              <div class="big-number">${deltaY}/${deltaX}</div>
            </div>
          </div>
          
          <div class="insight-card">
            <h6>📊 Рівняння прямої</h6>
            <p><strong>y = ${slope.toFixed(4)}x ${yIntercept >= 0 ? '+' : ''} ${yIntercept.toFixed(4)}</strong></p>
            <table style="margin-top: 1rem;">
              <tr><td><strong>Нахил (m):</strong></td><td>${slope.toFixed(6)}</td></tr>
              <tr><td><strong>Y-перетин (b):</strong></td><td>${yIntercept.toFixed(6)}</td></tr>
              <tr><td><strong>Кут нахилу:</strong></td><td>${angleDegrees.toFixed(4)}°</td></tr>
              <tr><td><strong>Відстань між точками:</strong></td><td>${distance.toFixed(6)}</td></tr>
            </table>
          </div>
          
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>📍 Точка 1</h6>
              <div class="big-number">(${x1}, ${y1})</div>
            </div>
            <div class="insight-card info">
              <h6>📍 Точка 2</h6>
              <div class="big-number">(${x2}, ${y2})</div>
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