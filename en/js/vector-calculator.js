document.addEventListener("DOMContentLoaded", function () {
  const vectorAInputs = {
    x: document.getElementById('vector-a-x'),
    y: document.getElementById('vector-a-y'),
    z: document.getElementById('vector-a-z')
  };
  
  const vectorBInputs = {
    x: document.getElementById('vector-b-x'),
    y: document.getElementById('vector-b-y'),
    z: document.getElementById('vector-b-z')
  };
  
  const buttons = {
    add: document.getElementById('vector-add'),
    subtract: document.getElementById('vector-subtract'),
    dotProduct: document.getElementById('vector-dot-product'),
    crossProduct: document.getElementById('vector-cross-product'),
    magnitude: document.getElementById('vector-magnitude'),
    unit: document.getElementById('vector-unit')
  };
  
  const result = document.getElementById('vector-result');

  if (!result) return;

  // Get vector values
  function getVector(inputs) {
    return {
      x: parseFloat(inputs.x.value) || 0,
      y: parseFloat(inputs.y.value) || 0,
      z: parseFloat(inputs.z.value) || 0
    };
  }

  // Format vector for display
  function formatVector(vector, precision = 4) {
    return `(${vector.x.toFixed(precision)}, ${vector.y.toFixed(precision)}, ${vector.z.toFixed(precision)})`;
  }

  // Vector addition
  function vectorAdd(a, b) {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z
    };
  }

  // Vector subtraction
  function vectorSubtract(a, b) {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
      z: a.z - b.z
    };
  }

  // Dot product
  function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  // Cross product
  function crossProduct(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  // Vector magnitude
  function magnitude(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  }

  // Unit vector
  function unitVector(vector) {
    const mag = magnitude(vector);
    if (mag === 0) return { x: 0, y: 0, z: 0 };
    return {
      x: vector.x / mag,
      y: vector.y / mag,
      z: vector.z / mag
    };
  }

  // Event handlers
  buttons.add.addEventListener('click', function() {
    const a = getVector(vectorAInputs);
    const b = getVector(vectorBInputs);
    const sum = vectorAdd(a, b);
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>➕ Vector Addition</h6>
          <div class="big-number">${formatVector(sum)}</div>
        </div>
        <div class="insight-card info">
          <h6>📝 Calculation</h6>
          <div class="result-value">A + B = ${formatVector(a)} + ${formatVector(b)}</div>
          <div class="result-value">= (${a.x} + ${b.x}, ${a.y} + ${b.y}, ${a.z} + ${b.z})</div>
          <div class="result-value">= ${formatVector(sum)}</div>
        </div>
      </div>
    `;
  });

  buttons.subtract.addEventListener('click', function() {
    const a = getVector(vectorAInputs);
    const b = getVector(vectorBInputs);
    const diff = vectorSubtract(a, b);
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>➖ Vector Subtraction</h6>
          <div class="big-number">${formatVector(diff)}</div>
        </div>
        <div class="insight-card info">
          <h6>📝 Calculation</h6>
          <div class="result-value">A - B = ${formatVector(a)} - ${formatVector(b)}</div>
          <div class="result-value">= (${a.x} - ${b.x}, ${a.y} - ${b.y}, ${a.z} - ${b.z})</div>
          <div class="result-value">= ${formatVector(diff)}</div>
        </div>
      </div>
    `;
  });

  buttons.dotProduct.addEventListener('click', function() {
    const a = getVector(vectorAInputs);
    const b = getVector(vectorBInputs);
    const dot = dotProduct(a, b);
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>⚫ Dot Product</h6>
          <div class="big-number">${dot.toFixed(4)}</div>
        </div>
        <div class="insight-card info">
          <h6>📝 Calculation</h6>
          <div class="result-value">A · B = ${formatVector(a)} · ${formatVector(b)}</div>
          <div class="result-value">= ${a.x} × ${b.x} + ${a.y} × ${b.y} + ${a.z} × ${b.z}</div>
          <div class="result-value">= ${(a.x * b.x).toFixed(4)} + ${(a.y * b.y).toFixed(4)} + ${(a.z * b.z).toFixed(4)}</div>
          <div class="result-value">= ${dot.toFixed(4)}</div>
        </div>
      </div>
    `;
  });

  buttons.crossProduct.addEventListener('click', function() {
    const a = getVector(vectorAInputs);
    const b = getVector(vectorBInputs);
    const cross = crossProduct(a, b);
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>❌ Cross Product</h6>
          <div class="big-number">${formatVector(cross)}</div>
        </div>
        <div class="insight-card info">
          <h6>📝 Calculation</h6>
          <div class="result-value">A × B = ${formatVector(a)} × ${formatVector(b)}</div>
          <div class="result-value">x: ${a.y} × ${b.z} - ${a.z} × ${b.y} = ${cross.x.toFixed(4)}</div>
          <div class="result-value">y: ${a.z} × ${b.x} - ${a.x} × ${b.z} = ${cross.y.toFixed(4)}</div>
          <div class="result-value">z: ${a.x} × ${b.y} - ${a.y} × ${b.x} = ${cross.z.toFixed(4)}</div>
        </div>
      </div>
    `;
  });

  buttons.magnitude.addEventListener('click', function() {
    const a = getVector(vectorAInputs);
    const b = getVector(vectorBInputs);
    const magA = magnitude(a);
    const magB = magnitude(b);
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>📏 Vector A Magnitude</h6>
          <div class="big-number">${magA.toFixed(4)}</div>
          <div class="result-value">|A| = √(${a.x}² + ${a.y}² + ${a.z}²)</div>
          <div class="result-value">= √${(a.x*a.x + a.y*a.y + a.z*a.z).toFixed(4)}</div>
        </div>
        <div class="insight-card info">
          <h6>📏 Vector B Magnitude</h6>
          <div class="big-number">${magB.toFixed(4)}</div>
          <div class="result-value">|B| = √(${b.x}² + ${b.y}² + ${b.z}²)</div>
          <div class="result-value">= √${(b.x*b.x + b.y*b.y + b.z*b.z).toFixed(4)}</div>
        </div>
      </div>
    `;
  });

  buttons.unit.addEventListener('click', function() {
    const a = getVector(vectorAInputs);
    const b = getVector(vectorBInputs);
    const unitA = unitVector(a);
    const unitB = unitVector(b);
    const magA = magnitude(a);
    const magB = magnitude(b);
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🎯 Unit Vector A</h6>
          <div class="big-number">${formatVector(unitA)}</div>
          <div class="result-value">û_A = A/|A| = ${formatVector(a)}/${magA.toFixed(4)}</div>
        </div>
        <div class="insight-card info">
          <h6>🎯 Unit Vector B</h6>
          <div class="big-number">${formatVector(unitB)}</div>
          <div class="result-value">û_B = B/|B| = ${formatVector(b)}/${magB.toFixed(4)}</div>
        </div>
      </div>
      <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
        <strong>Note:</strong> A unit vector has the same direction as the original vector but magnitude of 1.
      </div>
    `;
  });

  // Initialize with addition
  buttons.add.click();
});