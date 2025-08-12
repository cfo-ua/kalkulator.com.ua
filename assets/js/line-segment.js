document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('segment-form');
  const result = document.getElementById('segment-result');
  
  function calculateSegmentProperties(x1, y1, x2, y2, m, n, x3, y3) {
    // Calculate segment length
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Calculate midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Calculate division point in ratio m:n
    let divisionX = null;
    let divisionY = null;
    if (m > 0 && n > 0) {
      divisionX = (m * x2 + n * x1) / (m + n);
      divisionY = (m * y2 + n * y1) / (m + n);
    }
    
    // Calculate slope and angle
    let slope = null;
    let angleRad = null;
    let angleDeg = null;
    if (x2 !== x1) {
      slope = (y2 - y1) / (x2 - x1);
      angleRad = Math.atan(slope);
      angleDeg = angleRad * 180 / Math.PI;
      // Adjust angle to be between 0° and 180°
      if (angleDeg < 0) angleDeg += 180;
    } else {
      // Vertical line
      angleDeg = 90;
      angleRad = Math.PI / 2;
    }
    
    // Calculate line equation coefficients (Ax + By + C = 0)
    const A = y2 - y1;
    const B = x1 - x2;
    const C = x2 * y1 - x1 * y2;
    
    // Distance from point C to line AB
    let distanceToLine = null;
    if (x3 !== null && y3 !== null) {
      distanceToLine = Math.abs(A * x3 + B * y3 + C) / Math.sqrt(A * A + B * B);
    }
    
    // Parametric equations
    const paramX = `x = ${x1} + t·(${x2 - x1})`;
    const paramY = `y = ${y1} + t·(${y2 - y1})`;
    
    // Vector representation
    const vectorX = x2 - x1;
    const vectorY = y2 - y1;
    
    return {
      length,
      midpoint: { x: midX, y: midY },
      divisionPoint: { x: divisionX, y: divisionY },
      slope,
      angle: { rad: angleRad, deg: angleDeg },
      lineEquation: { A, B, C },
      distanceToLine,
      parametric: { x: paramX, y: paramY },
      vector: { x: vectorX, y: vectorY }
    };
  }
  
  function formatLineEquation(A, B, C) {
    let equation = "";
    
    // Handle coefficient A
    if (A === 1) equation += "x";
    else if (A === -1) equation += "-x";
    else if (A !== 0) equation += `${A}x`;
    
    // Handle coefficient B
    if (B === 1) {
      equation += equation ? " + y" : "y";
    } else if (B === -1) {
      equation += " - y";
    } else if (B > 0) {
      equation += equation ? ` + ${B}y` : `${B}y`;
    } else if (B < 0) {
      equation += ` - ${Math.abs(B)}y`;
    }
    
    // Handle coefficient C
    if (C > 0) {
      equation += ` + ${C}`;
    } else if (C < 0) {
      equation += ` - ${Math.abs(C)}`;
    }
    
    equation += " = 0";
    
    return equation;
  }
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const x1 = parseFloat(document.getElementById('x1').value);
      const y1 = parseFloat(document.getElementById('y1').value);
      const x2 = parseFloat(document.getElementById('x2').value);
      const y2 = parseFloat(document.getElementById('y2').value);
      const m = parseFloat(document.getElementById('ratio-m').value) || null;
      const n = parseFloat(document.getElementById('ratio-n').value) || null;
      const x3 = parseFloat(document.getElementById('x3').value) || null;
      const y3 = parseFloat(document.getElementById('y3').value) || null;
      
      try {
        // Check if points are the same
        if (x1 === x2 && y1 === y2) {
          throw new Error("Точки A та B не можуть співпадати");
        }
        
        const props = calculateSegmentProperties(x1, y1, x2, y2, m, n, x3, y3);
        
        let resultHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>📏 Основні параметри</h6>
              <div class="result-value">Довжина: ${props.length.toFixed(4)}</div>
              <div class="result-value">Середина: (${props.midpoint.x.toFixed(3)}, ${props.midpoint.y.toFixed(3)})</div>
              ${props.slope !== null ? 
                `<div class="result-value">Нахил: ${props.slope.toFixed(4)}</div>` :
                `<div class="result-value">Нахил: ∞ (вертикальна)</div>`
              }
              <div class="result-value">Кут: ${props.angle.deg.toFixed(2)}°</div>
            </div>
            
            <div class="insight-card info">
              <h6>📐 Рівняння прямої</h6>
              <div class="result-value">${formatLineEquation(props.lineEquation.A, props.lineEquation.B, props.lineEquation.C)}</div>
              <div class="result-value">Параметричне:</div>
              <div class="result-value">${props.parametric.x}</div>
              <div class="result-value">${props.parametric.y}</div>
            </div>
            
            <div class="insight-card warning">
              <h6>🎯 Вектор і напрямок</h6>
              <div class="result-value">Вектор AB: (${props.vector.x.toFixed(3)}, ${props.vector.y.toFixed(3)})</div>
              <div class="result-value">Довжина вектора: ${props.length.toFixed(4)}</div>
              <div class="result-value">Одиничний вектор: (${(props.vector.x/props.length).toFixed(3)}, ${(props.vector.y/props.length).toFixed(3)})</div>
            </div>
          </div>
        `;
        
        // Add division point if ratio is provided
        if (props.divisionPoint.x !== null && props.divisionPoint.y !== null) {
          resultHTML += `
            <div class="insight-card info">
              <h6>✂️ Точка поділу (${m}:${n})</h6>
              <div class="result-value">P(${props.divisionPoint.x.toFixed(3)}, ${props.divisionPoint.y.toFixed(3)})</div>
              <div class="result-value">Відстань AP: ${(props.length * m / (m + n)).toFixed(4)}</div>
              <div class="result-value">Відстань PB: ${(props.length * n / (m + n)).toFixed(4)}</div>
            </div>
          `;
        }
        
        // Add distance to line if point C is provided
        if (props.distanceToLine !== null) {
          resultHTML += `
            <div class="insight-card warning">
              <h6>📏 Відстань від точки C</h6>
              <div class="result-value">Точка C: (${x3}, ${y3})</div>
              <div class="result-value">Відстань до прямої AB: ${props.distanceToLine.toFixed(4)}</div>
            </div>
          `;
        }
        
        result.innerHTML = resultHTML;
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Помилка</h6>
            <p>${error.message}</p>
          </div>
        `;
      }
    });
  }
});