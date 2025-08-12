document.addEventListener("DOMContentLoaded", function () {
  const shapeButtons = document.querySelectorAll('.shape-btn');
  const shapeForms = document.querySelectorAll('.shape-form');
  const result = document.getElementById('geometry-result');
  
  // Shape selection
  shapeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const shape = this.dataset.shape;
      
      // Update active button
      shapeButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding form
      shapeForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${shape}-form`) {
          form.classList.add('active');
        }
      });
      
      // Clear previous results
      result.innerHTML = '';
    });
  });
  
  // Form submissions
  shapeForms.forEach(form => {
    const formElement = form.querySelector('form');
    if (formElement) {
      formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        const shapeType = form.id.replace('-form', '');
        calculateGeometry(shapeType);
      });
    }
  });
  
  // Auto-calculate on input change
  const inputs = document.querySelectorAll('#prism-form input, #cylinder-form input, #cone-form input, #pyramid-form input');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      const activeForm = document.querySelector('.shape-form.active');
      if (activeForm) {
        const shapeType = activeForm.id.replace('-form', '');
        calculateGeometry(shapeType);
      }
    });
  });
  
  function calculateGeometry(shapeType) {
    let volume, surfaceArea, details;
    
    switch(shapeType) {
      case 'prism':
        const length = parseFloat(document.getElementById('prism-length').value);
        const width = parseFloat(document.getElementById('prism-width').value);
        const height = parseFloat(document.getElementById('prism-height').value);
        
        if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) {
          result.innerHTML = '<div class="error">⚠️ Please enter valid values for all parameters</div>';
          return;
        }
        
        volume = length * width * height;
        surfaceArea = 2 * (length * width + length * height + width * height);
        
        details = `
          <div class="calculation-details">
            <h4>📦 Rectangular Prism</h4>
            <div class="parameters">
              <span>Length: <strong>${length} cm</strong></span>
              <span>Width: <strong>${width} cm</strong></span>
              <span>Height: <strong>${height} cm</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Volume:</strong> ${volume.toFixed(2)} cm³
                <small>V = a × b × h = ${length} × ${width} × ${height}</small>
              </div>
              <div class="surface-result">
                📐 <strong>Surface Area:</strong> ${surfaceArea.toFixed(2)} cm²
                <small>S = 2(ab + ah + bh) = 2(${length}×${width} + ${length}×${height} + ${width}×${height})</small>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'cylinder':
        const radius = parseFloat(document.getElementById('cylinder-radius').value);
        const cylHeight = parseFloat(document.getElementById('cylinder-height').value);
        
        if (isNaN(radius) || isNaN(cylHeight) || radius <= 0 || cylHeight <= 0) {
          result.innerHTML = '<div class="error">⚠️ Please enter valid values for all parameters</div>';
          return;
        }
        
        volume = Math.PI * radius * radius * cylHeight;
        surfaceArea = 2 * Math.PI * radius * (radius + cylHeight);
        
        details = `
          <div class="calculation-details">
            <h4>🥤 Cylinder</h4>
            <div class="parameters">
              <span>Radius: <strong>${radius} cm</strong></span>
              <span>Height: <strong>${cylHeight} cm</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Volume:</strong> ${volume.toFixed(2)} cm³
                <small>V = π × r² × h = π × ${radius}² × ${cylHeight}</small>
              </div>
              <div class="surface-result">
                📐 <strong>Surface Area:</strong> ${surfaceArea.toFixed(2)} cm²
                <small>S = 2πr(r + h) = 2π×${radius}×(${radius} + ${cylHeight})</small>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'cone':
        const coneRadius = parseFloat(document.getElementById('cone-radius').value);
        const coneHeight = parseFloat(document.getElementById('cone-height').value);
        
        if (isNaN(coneRadius) || isNaN(coneHeight) || coneRadius <= 0 || coneHeight <= 0) {
          result.innerHTML = '<div class="error">⚠️ Please enter valid values for all parameters</div>';
          return;
        }
        
        volume = (1/3) * Math.PI * coneRadius * coneRadius * coneHeight;
        const slantHeight = Math.sqrt(coneRadius * coneRadius + coneHeight * coneHeight);
        surfaceArea = Math.PI * coneRadius * (coneRadius + slantHeight);
        
        details = `
          <div class="calculation-details">
            <h4>🏔️ Cone</h4>
            <div class="parameters">
              <span>Radius: <strong>${coneRadius} cm</strong></span>
              <span>Height: <strong>${coneHeight} cm</strong></span>
              <span>Slant Height: <strong>${slantHeight.toFixed(2)} cm</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Volume:</strong> ${volume.toFixed(2)} cm³
                <small>V = (1/3) × π × r² × h = (1/3) × π × ${coneRadius}² × ${coneHeight}</small>
              </div>
              <div class="surface-result">
                📐 <strong>Surface Area:</strong> ${surfaceArea.toFixed(2)} cm²
                <small>S = πr(r + l) = π×${coneRadius}×(${coneRadius} + ${slantHeight.toFixed(2)})</small>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'pyramid':
        const baseArea = parseFloat(document.getElementById('pyramid-base').value);
        const pyrHeight = parseFloat(document.getElementById('pyramid-height').value);
        
        if (isNaN(baseArea) || isNaN(pyrHeight) || baseArea <= 0 || pyrHeight <= 0) {
          result.innerHTML = '<div class="error">⚠️ Please enter valid values for all parameters</div>';
          return;
        }
        
        volume = (1/3) * baseArea * pyrHeight;
        
        details = `
          <div class="calculation-details">
            <h4>🔺 Pyramid</h4>
            <div class="parameters">
              <span>Base Area: <strong>${baseArea} cm²</strong></span>
              <span>Height: <strong>${pyrHeight} cm</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Volume:</strong> ${volume.toFixed(2)} cm³
                <small>V = (1/3) × A_base × h = (1/3) × ${baseArea} × ${pyrHeight}</small>
              </div>
              <div class="info">
                💡 <em>To calculate pyramid surface area, you need to know the base shape and lateral faces</em>
              </div>
            </div>
          </div>
        `;
        break;
    }
    
    result.innerHTML = details;
  }
  
  // Initial calculation
  calculateGeometry('prism');
});