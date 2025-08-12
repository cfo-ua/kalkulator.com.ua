document.addEventListener("DOMContentLoaded", function () {
  const matrixSizeRadios = document.querySelectorAll('input[name="matrix-size"]');
  const matrixInputsContainer = document.getElementById('matrix-inputs');
  const calculateBtn = document.getElementById('calculate-inverse');
  const resetBtn = document.getElementById('reset-matrix');
  const result = document.getElementById('matrix-result');

  if (!matrixInputsContainer || !calculateBtn || !resetBtn || !result) return;

  let currentSize = 2;

  // Generate matrix input fields
  function generateMatrixInputs(size) {
    currentSize = size;
    matrixInputsContainer.innerHTML = '';
    matrixInputsContainer.className = `matrix-grid matrix-${size}x${size}`;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.id = `matrix-${i}-${j}`;
        input.placeholder = `a${i+1}${j+1}`;
        input.value = i === j ? '1' : '0'; // Identity matrix as default
        matrixInputsContainer.appendChild(input);
      }
    }
  }

  // Get matrix values
  function getMatrix(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        const input = document.getElementById(`matrix-${i}-${j}`);
        matrix[i][j] = parseFloat(input.value) || 0;
      }
    }
    return matrix;
  }

  // Format matrix for display
  function formatMatrix(matrix, precision = 4) {
    const size = matrix.length;
    let html = '<div class="matrix-display">';
    html += '<table class="matrix-table">';
    for (let i = 0; i < size; i++) {
      html += '<tr>';
      for (let j = 0; j < size; j++) {
        html += `<td>${matrix[i][j].toFixed(precision)}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    html += '</div>';
    return html;
  }

  // Calculate determinant for 2x2 matrix
  function determinant2x2(matrix) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  // Calculate determinant for 3x3 matrix
  function determinant3x3(matrix) {
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
    
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  }

  // Calculate determinant
  function calculateDeterminant(matrix) {
    const size = matrix.length;
    if (size === 2) {
      return determinant2x2(matrix);
    } else if (size === 3) {
      return determinant3x3(matrix);
    }
    return 0;
  }

  // Calculate inverse for 2x2 matrix
  function inverse2x2(matrix) {
    const det = determinant2x2(matrix);
    if (Math.abs(det) < 1e-10) return null;
    
    const invDet = 1 / det;
    return [
      [matrix[1][1] * invDet, -matrix[0][1] * invDet],
      [-matrix[1][0] * invDet, matrix[0][0] * invDet]
    ];
  }

  // Calculate adjugate matrix for 3x3
  function adjugate3x3(matrix) {
    const adj = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    // Calculate cofactors
    adj[0][0] = matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1];
    adj[0][1] = -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]);
    adj[0][2] = matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0];
    
    adj[1][0] = -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]);
    adj[1][1] = matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0];
    adj[1][2] = -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]);
    
    adj[2][0] = matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1];
    adj[2][1] = -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]);
    adj[2][2] = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    // Transpose
    return [
      [adj[0][0], adj[1][0], adj[2][0]],
      [adj[0][1], adj[1][1], adj[2][1]],
      [adj[0][2], adj[1][2], adj[2][2]]
    ];
  }

  // Calculate inverse for 3x3 matrix
  function inverse3x3(matrix) {
    const det = determinant3x3(matrix);
    if (Math.abs(det) < 1e-10) return null;
    
    const adj = adjugate3x3(matrix);
    const invDet = 1 / det;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        adj[i][j] *= invDet;
      }
    }
    
    return adj;
  }

  // Calculate matrix inverse
  function calculateInverse(matrix) {
    const size = matrix.length;
    if (size === 2) {
      return inverse2x2(matrix);
    } else if (size === 3) {
      return inverse3x3(matrix);
    }
    return null;
  }

  // Event handlers
  matrixSizeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        generateMatrixInputs(parseInt(this.value));
      }
    });
  });

  calculateBtn.addEventListener('click', function() {
    const matrix = getMatrix(currentSize);
    const det = calculateDeterminant(matrix);
    const inverse = calculateInverse(matrix);
    
    if (Math.abs(det) < 1e-10) {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>⚠️ Матриця невиродження</h6>
          <div class="result-value">Детермінант = ${det.toFixed(8)}</div>
          <p>Обернена матриця не існує, оскільки детермінант дорівнює нулю.</p>
        </div>
      `;
      return;
    }
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🎯 Детермінант</h6>
          <div class="big-number">${det.toFixed(6)}</div>
        </div>
        <div class="insight-card info">
          <h6>✅ Статус</h6>
          <div class="result-value">Матриця невироджена</div>
          <div class="result-value">Обернена матриця існує</div>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h4>🔄 Обернена матриця A⁻¹:</h4>
        ${formatMatrix(inverse)}
      </div>
      
      <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
        <strong>Перевірка:</strong> A × A⁻¹ = I (одинична матриця)
      </div>
    `;
  });

  resetBtn.addEventListener('click', function() {
    generateMatrixInputs(currentSize);
  });

  // Initialize with 2x2 matrix
  generateMatrixInputs(2);
});