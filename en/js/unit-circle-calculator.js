document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('unit-circle-main');
  const ctx = canvas.getContext('2d');
  
  let animationId = null;
  
  // Standard angles and their exact values
  const standardAngles = {
    0: { sin: 0, cos: 1, x: 1, y: 0 },
    30: { sin: 0.5, cos: Math.sqrt(3)/2, x: Math.sqrt(3)/2, y: 0.5 },
    45: { sin: Math.sqrt(2)/2, cos: Math.sqrt(2)/2, x: Math.sqrt(2)/2, y: Math.sqrt(2)/2 },
    60: { sin: Math.sqrt(3)/2, cos: 0.5, x: 0.5, y: Math.sqrt(3)/2 },
    90: { sin: 1, cos: 0, x: 0, y: 1 },
    120: { sin: Math.sqrt(3)/2, cos: -0.5, x: -0.5, y: Math.sqrt(3)/2 },
    135: { sin: Math.sqrt(2)/2, cos: -Math.sqrt(2)/2, x: -Math.sqrt(2)/2, y: Math.sqrt(2)/2 },
    150: { sin: 0.5, cos: -Math.sqrt(3)/2, x: -Math.sqrt(3)/2, y: 0.5 },
    180: { sin: 0, cos: -1, x: -1, y: 0 },
    210: { sin: -0.5, cos: -Math.sqrt(3)/2, x: -Math.sqrt(3)/2, y: -0.5 },
    225: { sin: -Math.sqrt(2)/2, cos: -Math.sqrt(2)/2, x: -Math.sqrt(2)/2, y: -Math.sqrt(2)/2 },
    240: { sin: -Math.sqrt(3)/2, cos: -0.5, x: -0.5, y: -Math.sqrt(3)/2 },
    270: { sin: -1, cos: 0, x: 0, y: -1 },
    300: { sin: -Math.sqrt(3)/2, cos: 0.5, x: 0.5, y: -Math.sqrt(3)/2 },
    315: { sin: -Math.sqrt(2)/2, cos: Math.sqrt(2)/2, x: Math.sqrt(2)/2, y: -Math.sqrt(2)/2 },
    330: { sin: -0.5, cos: Math.sqrt(3)/2, x: Math.sqrt(3)/2, y: -0.5 },
    360: { sin: 0, cos: 1, x: 1, y: 0 }
  };
  
  // Calculator initialization
  function initCalculator() {
    const degreesInput = document.getElementById('calc-degrees');
    const radiansInput = document.getElementById('calc-radians');
    const xInput = document.getElementById('calc-x');
    const yInput = document.getElementById('calc-y');
    const findAngleBtn = document.getElementById('find-angle-btn');
    const result = document.getElementById('calculator-result');
    
    function updateFromDegrees() {
      const degrees = parseFloat(degreesInput.value);
      if (!isNaN(degrees)) {
        const radians = degrees * Math.PI / 180;
        const x = Math.cos(radians);
        const y = Math.sin(radians);
        
        radiansInput.value = radians.toFixed(4);
        xInput.value = x.toFixed(4);
        yInput.value = y.toFixed(4);
        
        displayCalculatorResult(degrees, radians, x, y);
        drawUnitCircle(degrees);
      }
    }
    
    function updateFromRadians() {
      const radians = parseFloat(radiansInput.value);
      if (!isNaN(radians)) {
        const degrees = radians * 180 / Math.PI;
        const x = Math.cos(radians);
        const y = Math.sin(radians);
        
        degreesInput.value = degrees.toFixed(2);
        xInput.value = x.toFixed(4);
        yInput.value = y.toFixed(4);
        
        displayCalculatorResult(degrees, radians, x, y);
        drawUnitCircle(degrees);
      }
    }
    
    function findAngleFromCoordinates() {
      const x = parseFloat(xInput.value);
      const y = parseFloat(yInput.value);
      
      if (!isNaN(x) && !isNaN(y)) {
        // Check if point is on unit circle
        const distance = Math.sqrt(x*x + y*y);
        if (Math.abs(distance - 1) > 0.01) {
          result.innerHTML = '<div class="error">⚠️ Point is not on the unit circle (distance from center must equal 1)</div>';
          return;
        }
        
        let radians = Math.atan2(y, x);
        if (radians < 0) radians += 2 * Math.PI;
        let degrees = radians * 180 / Math.PI;
        
        degreesInput.value = degrees.toFixed(2);
        radiansInput.value = radians.toFixed(4);
        
        displayCalculatorResult(degrees, radians, x, y);
        drawUnitCircle(degrees);
      }
    }
    
    degreesInput.addEventListener('input', updateFromDegrees);
    radiansInput.addEventListener('input', updateFromRadians);
    findAngleBtn.addEventListener('click', findAngleFromCoordinates);
    
    // Initial calculation
    updateFromDegrees();
  }
  
  function displayCalculatorResult(degrees, radians, x, y) {
    const result = document.getElementById('calculator-result');
    const normalizedDeg = ((degrees % 360) + 360) % 360;
    
    // Check for exact values
    let exactInfo = '';
    const closestStandard = Object.keys(standardAngles).find(angle => 
      Math.abs(parseFloat(angle) - normalizedDeg) < 0.1
    );
    
    if (closestStandard) {
      exactInfo = `<div class="exact-values">
        ✨ <strong>Exact Values:</strong>
        <span>sin(${closestStandard}°) = ${getExactValue(standardAngles[closestStandard].sin)}</span>
        <span>cos(${closestStandard}°) = ${getExactValue(standardAngles[closestStandard].cos)}</span>
      </div>`;
    }
    
    result.innerHTML = `
      <div class="unit-circle-result">
        <h4>⭕ Results for angle ${degrees.toFixed(2)}°</h4>
        <div class="result-grid">
          <div class="angle-info">
            <h5>📐 Angle:</h5>
            <span>Degrees: <strong>${degrees.toFixed(2)}°</strong></span>
            <span>Radians: <strong>${radians.toFixed(4)}</strong></span>
            <span>Quadrant: <strong>${getQuadrant(normalizedDeg)}</strong></span>
          </div>
          
          <div class="coordinates-info">
            <h5>📍 Coordinates:</h5>
            <span>x = cos(θ) = <strong>${x.toFixed(4)}</strong></span>
            <span>y = sin(θ) = <strong>${y.toFixed(4)}</strong></span>
            <span>Point: <strong>(${x.toFixed(4)}, ${y.toFixed(4)})</strong></span>
          </div>
          
          <div class="trig-info">
            <h5>📊 Trigonometric Functions:</h5>
            <span>sin(θ) = <strong>${y.toFixed(4)}</strong></span>
            <span>cos(θ) = <strong>${x.toFixed(4)}</strong></span>
            <span>tan(θ) = <strong>${Math.abs(x) < 1e-10 ? '∞' : (y/x).toFixed(4)}</strong></span>
          </div>
        </div>
        ${exactInfo}
      </div>
    `;
  }
  
  function getExactValue(decimal) {
    if (Math.abs(decimal) < 1e-10) return '0';
    if (Math.abs(decimal - 1) < 1e-10) return '1';
    if (Math.abs(decimal + 1) < 1e-10) return '-1';
    if (Math.abs(decimal - 0.5) < 1e-10) return '1/2';
    if (Math.abs(decimal + 0.5) < 1e-10) return '-1/2';
    if (Math.abs(decimal - Math.sqrt(2)/2) < 1e-10) return '√2/2';
    if (Math.abs(decimal + Math.sqrt(2)/2) < 1e-10) return '-√2/2';
    if (Math.abs(decimal - Math.sqrt(3)/2) < 1e-10) return '√3/2';
    if (Math.abs(decimal + Math.sqrt(3)/2) < 1e-10) return '-√3/2';
    return decimal.toFixed(4);
  }
  
  function getQuadrant(degrees) {
    const normalized = ((degrees % 360) + 360) % 360;
    if (normalized >= 0 && normalized < 90) return 'I';
    if (normalized >= 90 && normalized < 180) return 'II';
    if (normalized >= 180 && normalized < 270) return 'III';
    return 'IV';
  }
  
  // Unit circle drawing
  function drawUnitCircle(highlightAngle = null) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = -200; i <= 200; i += 25) {
      ctx.beginPath();
      ctx.moveTo(centerX + i, 0);
      ctx.lineTo(centerX + i, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, centerY + i);
      ctx.lineTo(canvas.width, centerY + i);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Draw unit circle
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw angle marks
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    Object.keys(standardAngles).forEach(angle => {
      const rad = parseFloat(angle) * Math.PI / 180;
      const x = Math.cos(rad) * radius;
      const y = -Math.sin(rad) * radius;
      
      ctx.beginPath();
      ctx.arc(centerX + x, centerY + y, 3, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Label important angles
      if ([0, 30, 45, 60, 90, 120, 135, 150, 180, 270].includes(parseFloat(angle))) {
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(`${angle}°`, centerX + x + 10, centerY + y - 10);
      }
    });
    
    // Highlight specific angle if provided
    if (highlightAngle !== null) {
      const rad = highlightAngle * Math.PI / 180;
      const x = Math.cos(rad) * radius;
      const y = -Math.sin(rad) * radius;
      
      // Draw radius line
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + x, centerY + y);
      ctx.stroke();
      
      // Draw point
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(centerX + x, centerY + y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw projections
      ctx.strokeStyle = '#2ed573';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + x, centerY + y);
      ctx.lineTo(centerX + x, centerY);
      ctx.moveTo(centerX + x, centerY + y);
      ctx.lineTo(centerX, centerY + y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  // Canvas controls
  document.getElementById('show-angles-btn').addEventListener('click', () => {
    drawUnitCircle();
  });
  
  document.getElementById('show-coordinates-btn').addEventListener('click', () => {
    drawUnitCircle();
  });
  
  document.getElementById('animate-btn').addEventListener('click', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
      document.getElementById('animate-btn').textContent = '▶️ Animate';
    } else {
      startAnimation();
      document.getElementById('animate-btn').textContent = '⏸️ Stop';
    }
  });
  
  function startAnimation() {
    let angle = 0;
    function animate() {
      drawUnitCircle(angle);
      angle = (angle + 2) % 360;
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }
  
  // Initialize
  initCalculator();
  drawUnitCircle(45);
});