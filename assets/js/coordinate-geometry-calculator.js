document.addEventListener("DOMContentLoaded", function () {
  const calcButtons = document.querySelectorAll('.calc-btn');
  const result = document.getElementById('coordinate-result');
  const canvas = document.getElementById('coordinate-canvas');
  const ctx = canvas.getContext('2d');
  
  // Define the main calculation function first
  window.calculateCoordinateGeometry = function() {
    // Get elements each time to ensure they're available
    const result = document.getElementById('coordinate-result');
    const canvas = document.getElementById('coordinate-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
    
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      if (result) result.innerHTML = '<div class="error">⚠️ Введіть коректні значення для всіх координат</div>';
      return;
    }
    
    // Calculate distance
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Calculate midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Calculate slope
    let slope, slopeText, angle, angleText;
    if (x2 === x1) {
      slopeText = "не визначений (вертикальна пряма)";
      angleText = "90°";
      slope = null;
      angle = 90;
    } else {
      slope = (y2 - y1) / (x2 - x1);
      angle = Math.atan(slope) * 180 / Math.PI;
      slopeText = slope.toFixed(4);
      angleText = angle.toFixed(2) + "°";
    }
    
    const activeCalc = document.querySelector('.calc-btn.active').dataset.calc;
    
    let details = `
      <div class="calculation-details">
        <h4>📊 Результати розрахунків</h4>
        <div class="points-info">
          <span>Точка A: (${x1}, ${y1})</span>
          <span>Точка B: (${x2}, ${y2})</span>
        </div>
        <hr>
    `;
    
    switch(activeCalc) {
      case 'distance':
        details += `
          <div class="distance-result highlight">
            📏 <strong>Відстань між точками:</strong> ${distance.toFixed(4)}
            <small>d = √[(${x2} - ${x1})² + (${y2} - ${y1})²] = √[${Math.pow(x2-x1,2)} + ${Math.pow(y2-y1,2)}]</small>
          </div>
        `;
        break;
      case 'midpoint':
        details += `
          <div class="midpoint-result highlight">
            📍 <strong>Середина відрізка:</strong> (${midX.toFixed(4)}, ${midY.toFixed(4)})
            <small>M = ((${x1} + ${x2})/2, (${y1} + ${y2})/2) = (${midX.toFixed(4)}, ${midY.toFixed(4)})</small>
          </div>
        `;
        break;
      case 'slope':
        details += `
          <div class="slope-result highlight">
            📐 <strong>Нахил прямої:</strong> ${slopeText}
            <div class="slope-details">
              <span>Кутовий коефіцієнт: ${slopeText}</span>
              <span>Кут нахилу: ${angleText}</span>
            </div>
            ${slope !== null ? 
              `<small>m = (${y2} - ${y1})/(${x2} - ${x1}) = ${(y2-y1).toFixed(2)}/${(x2-x1).toFixed(2)}</small>` : 
              '<small>Пряма вертикальна: x₁ = x₂</small>'
            }
          </div>
        `;
        break;
    }
    
    details += `
        <div class="all-results">
          <h5>🔍 Всі розрахунки:</h5>
          <div class="results-grid">
            <div class="result-item">
              📏 <span>Відстань:</span> <strong>${distance.toFixed(4)}</strong>
            </div>
            <div class="result-item">
              📍 <span>Середина:</span> <strong>(${midX.toFixed(2)}, ${midY.toFixed(2)})</strong>
            </div>
            <div class="result-item">
              📐 <span>Нахил:</span> <strong>${slopeText}</strong>
            </div>
            <div class="result-item">
              🔄 <span>Кут:</span> <strong>${angleText}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
    
    if (result) result.innerHTML = details;
    if (ctx) drawCoordinatePlane(x1, y1, x2, y2, midX, midY);
  };
  
  function drawCoordinatePlane(x1, y1, x2, y2, midX, midY) {
    const canvas = document.getElementById('coordinate-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate scale to fit points
    const maxCoord = Math.max(Math.abs(x1), Math.abs(y1), Math.abs(x2), Math.abs(y2)) || 1;
    const scale = Math.min(150, 150 / maxCoord);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      if (i !== 0) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * 20, 0);
        ctx.lineTo(centerX + i * 20, height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * 20);
        ctx.lineTo(width, centerY + i * 20);
        ctx.stroke();
      }
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Calculate pixel coordinates
    const px1 = centerX + x1 * scale;
    const py1 = centerY - y1 * scale;
    const px2 = centerX + x2 * scale;
    const py2 = centerY - y2 * scale;
    const pmidX = centerX + midX * scale;
    const pmidY = centerY - midY * scale;
    
    // Draw line between points
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.stroke();
    
    // Draw points
    // Point A
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(px1, py1, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Point B
    ctx.fillStyle = '#2ed573';
    ctx.beginPath();
    ctx.arc(px2, py2, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Midpoint
    ctx.fillStyle = '#ffa502';
    ctx.beginPath();
    ctx.arc(pmidX, pmidY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`A(${x1}, ${y1})`, px1 + 10, py1 - 10);
    ctx.fillText(`B(${x2}, ${y2})`, px2 + 10, py2 - 10);
    ctx.fillText(`M(${midX.toFixed(1)}, ${midY.toFixed(1)})`, pmidX + 10, pmidY - 10);
  }
  
  // Calculation type selection
  calcButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      calcButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      calculateCoordinateGeometry();
    });
  });
  
  // Auto-calculate on input change
  const inputs = document.querySelectorAll('#x1, #y1, #x2, #y2');
  inputs.forEach(input => {
    input.addEventListener('input', calculateCoordinateGeometry);
  });

  // Initial calculation
  calculateCoordinateGeometry();
});