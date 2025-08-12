document.addEventListener("DOMContentLoaded", function () {
  const degreesInput = document.getElementById('degrees');
  const radiansInput = document.getElementById('radians');
  const angleButtons = document.querySelectorAll('.angle-btn');
  const result = document.getElementById('trig-result');
  const canvas = document.getElementById('unit-circle-canvas');
  const ctx = canvas.getContext('2d');
  const table = document.getElementById('exact-values-table').getElementsByTagName('tbody')[0];
  
  // Exact trigonometric values for standard angles
  const exactValues = {
    0: { sin: '0', cos: '1', tan: '0', rad: '0', radFrac: '0' },
    30: { sin: '1/2', cos: '√3/2', tan: '√3/3', rad: 'π/6', radFrac: Math.PI/6 },
    45: { sin: '√2/2', cos: '√2/2', tan: '1', rad: 'π/4', radFrac: Math.PI/4 },
    60: { sin: '√3/2', cos: '1/2', tan: '√3', rad: 'π/3', radFrac: Math.PI/3 },
    90: { sin: '1', cos: '0', tan: '∞', rad: 'π/2', radFrac: Math.PI/2 },
    120: { sin: '√3/2', cos: '-1/2', tan: '-√3', rad: '2π/3', radFrac: 2*Math.PI/3 },
    135: { sin: '√2/2', cos: '-√2/2', tan: '-1', rad: '3π/4', radFrac: 3*Math.PI/4 },
    150: { sin: '1/2', cos: '-√3/2', tan: '-√3/3', rad: '5π/6', radFrac: 5*Math.PI/6 },
    180: { sin: '0', cos: '-1', tan: '0', rad: 'π', radFrac: Math.PI },
    210: { sin: '-1/2', cos: '-√3/2', tan: '√3/3', rad: '7π/6', radFrac: 7*Math.PI/6 },
    225: { sin: '-√2/2', cos: '-√2/2', tan: '1', rad: '5π/4', radFrac: 5*Math.PI/4 },
    240: { sin: '-√3/2', cos: '-1/2', tan: '√3', rad: '4π/3', radFrac: 4*Math.PI/3 },
    270: { sin: '-1', cos: '0', tan: '∞', rad: '3π/2', radFrac: 3*Math.PI/2 },
    300: { sin: '-√3/2', cos: '1/2', tan: '-√3', rad: '5π/3', radFrac: 5*Math.PI/3 },
    315: { sin: '-√2/2', cos: '√2/2', tan: '-1', rad: '7π/4', radFrac: 7*Math.PI/4 },
    330: { sin: '-1/2', cos: '√3/2', tan: '-√3/3', rad: '11π/6', radFrac: 11*Math.PI/6 },
    360: { sin: '0', cos: '1', tan: '0', rad: '2π', radFrac: 2*Math.PI }
  };
  
  // Event listeners
  degreesInput.addEventListener('input', function() {
    const degrees = parseFloat(this.value);
    if (!isNaN(degrees)) {
      const radians = degrees * Math.PI / 180;
      radiansInput.value = radians.toFixed(6);
      updateTrigValues(degrees);
      drawUnitCircle(degrees);
    }
  });
  
  radiansInput.addEventListener('input', function() {
    const radians = parseFloat(this.value);
    if (!isNaN(radians)) {
      const degrees = radians * 180 / Math.PI;
      degreesInput.value = degrees.toFixed(4);
      updateTrigValues(degrees);
      drawUnitCircle(degrees);
    }
  });
  
  angleButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const degrees = parseFloat(this.dataset.deg);
      degreesInput.value = degrees;
      const radians = degrees * Math.PI / 180;
      radiansInput.value = radians.toFixed(6);
      updateTrigValues(degrees);
      drawUnitCircle(degrees);
    });
  });
  
  function updateTrigValues(degrees) {
    const rad = degrees * Math.PI / 180;
    const normalizedDeg = ((degrees % 360) + 360) % 360;
    
    let sinVal, cosVal, tanVal, cotVal, secVal, cscVal;
    let sinText, cosText, tanText;
    
    // Check if we have exact values
    if (exactValues[normalizedDeg]) {
      const exact = exactValues[normalizedDeg];
      sinText = exact.sin;
      cosText = exact.cos;
      tanText = exact.tan;
      
      // Calculate numerical values for other functions
      sinVal = Math.sin(rad);
      cosVal = Math.cos(rad);
      tanVal = Math.abs(cosVal) < 1e-10 ? null : Math.tan(rad);
    } else {
      sinVal = Math.sin(rad);
      cosVal = Math.cos(rad);
      tanVal = Math.abs(cosVal) < 1e-10 ? null : Math.tan(rad);
      
      sinText = sinVal.toFixed(6);
      cosText = cosVal.toFixed(6);
      tanText = tanVal === null ? '∞' : tanVal.toFixed(6);
    }
    
    // Calculate reciprocal functions
    cotVal = tanVal === null || Math.abs(tanVal) < 1e-10 ? null : 1/tanVal;
    secVal = Math.abs(cosVal) < 1e-10 ? null : 1/cosVal;
    cscVal = Math.abs(sinVal) < 1e-10 ? null : 1/sinVal;
    
    const radText = exactValues[normalizedDeg] ? exactValues[normalizedDeg].rad : rad.toFixed(6);
    
    result.innerHTML = `
      <div class="trig-calculations">
        <h4>🧮 Тригонометричні значення для ${degrees}°</h4>
        <div class="conversion-result">
          <span><strong>${degrees}°</strong> = <strong>${radText}</strong> радіан</span>
        </div>
        <hr>
        <div class="trig-functions">
          <div class="primary-functions">
            <h5>Основні функції:</h5>
            <div class="function-grid">
              <div class="function-item">
                📊 <span>sin(${degrees}°) =</span> <strong>${sinText}</strong>
              </div>
              <div class="function-item">
                📊 <span>cos(${degrees}°) =</span> <strong>${cosText}</strong>
              </div>
              <div class="function-item">
                📊 <span>tan(${degrees}°) =</span> <strong>${tanText}</strong>
              </div>
            </div>
          </div>
          
          <div class="reciprocal-functions">
            <h5>Зворотні функції:</h5>
            <div class="function-grid">
              <div class="function-item">
                📐 <span>cot(${degrees}°) =</span> <strong>${cotVal === null ? '∞' : cotVal.toFixed(6)}</strong>
              </div>
              <div class="function-item">
                📐 <span>sec(${degrees}°) =</span> <strong>${secVal === null ? '∞' : secVal.toFixed(6)}</strong>
              </div>
              <div class="function-item">
                📐 <span>csc(${degrees}°) =</span> <strong>${cscVal === null ? '∞' : cscVal.toFixed(6)}</strong>
              </div>
            </div>
          </div>
        </div>
        
        <div class="angle-info">
          <h5>🎯 Інформація про кут:</h5>
          <div class="info-grid">
            <span>Квадрант: <strong>${getQuadrant(normalizedDeg)}</strong></span>
            <span>Референсний кут: <strong>${getReferenceAngle(normalizedDeg)}°</strong></span>
            <span>Коterminальний кут: <strong>${normalizedDeg}°</strong></span>
          </div>
        </div>
      </div>
    `;
  }
  
  function getQuadrant(degrees) {
    const normalized = ((degrees % 360) + 360) % 360;
    if (normalized >= 0 && normalized < 90) return 'I';
    if (normalized >= 90 && normalized < 180) return 'II';
    if (normalized >= 180 && normalized < 270) return 'III';
    return 'IV';
  }
  
  function getReferenceAngle(degrees) {
    const normalized = ((degrees % 360) + 360) % 360;
    if (normalized <= 90) return normalized;
    if (normalized <= 180) return 180 - normalized;
    if (normalized <= 270) return normalized - 180;
    return 360 - normalized;
  }
  
  function drawUnitCircle(degrees) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw unit circle
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    // X-axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 20, centerY);
    ctx.lineTo(centerX + radius + 20, centerY);
    ctx.stroke();
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.stroke();
    
    // Draw angle
    const rad = degrees * Math.PI / 180;
    const x = Math.cos(rad) * radius;
    const y = -Math.sin(rad) * radius; // Negative because canvas Y increases downward
    
    // Draw angle arc
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, -rad, rad < 0);
    ctx.stroke();
    
    // Draw radius line
    ctx.strokeStyle = '#ff4757';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x, centerY + y);
    ctx.stroke();
    
    // Draw point on circle
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(centerX + x, centerY + y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw projections
    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    // X projection
    ctx.beginPath();
    ctx.moveTo(centerX + x, centerY + y);
    ctx.lineTo(centerX + x, centerY);
    ctx.stroke();
    // Y projection
    ctx.beginPath();
    ctx.moveTo(centerX + x, centerY + y);
    ctx.lineTo(centerX, centerY + y);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`(${Math.cos(rad).toFixed(2)}, ${Math.sin(rad).toFixed(2)})`, 
                 centerX + x + 10, centerY + y - 10);
    ctx.fillText(`${degrees}°`, centerX + 40, centerY - 10);
  }
  
  function populateExactValuesTable() {
    const standardAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360];
    
    standardAngles.forEach(deg => {
      if (exactValues[deg]) {
        const row = table.insertRow();
        const exact = exactValues[deg];
        
        row.insertCell(0).textContent = `${deg}°`;
        row.insertCell(1).textContent = `${deg}°`;
        row.insertCell(2).textContent = exact.rad;
        row.insertCell(3).textContent = exact.sin;
        row.insertCell(4).textContent = exact.cos;
        row.insertCell(5).textContent = exact.tan;
      }
    });
  }
  
  // Initialize
  populateExactValuesTable();
  updateTrigValues(45);
  drawUnitCircle(45);
  radiansInput.value = (45 * Math.PI / 180).toFixed(6);
});