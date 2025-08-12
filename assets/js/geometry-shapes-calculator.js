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
          result.innerHTML = '<div class="error">⚠️ Введіть коректні значення для всіх параметрів</div>';
          return;
        }
        
        volume = length * width * height;
        surfaceArea = 2 * (length * width + length * height + width * height);
        
        details = `
          <div class="calculation-details">
            <h4>📦 Прямокутна призма</h4>
            <div class="parameters">
              <span>Довжина: <strong>${length} см</strong></span>
              <span>Ширина: <strong>${width} см</strong></span>
              <span>Висота: <strong>${height} см</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Об'єм:</strong> ${volume.toFixed(2)} см³
                <small>V = a × b × h = ${length} × ${width} × ${height}</small>
              </div>
              <div class="surface-result">
                📐 <strong>Площа поверхні:</strong> ${surfaceArea.toFixed(2)} см²
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
          result.innerHTML = '<div class="error">⚠️ Введіть коректні значення для всіх параметрів</div>';
          return;
        }
        
        volume = Math.PI * radius * radius * cylHeight;
        surfaceArea = 2 * Math.PI * radius * (radius + cylHeight);
        
        details = `
          <div class="calculation-details">
            <h4>🥤 Циліндр</h4>
            <div class="parameters">
              <span>Радіус: <strong>${radius} см</strong></span>
              <span>Висота: <strong>${cylHeight} см</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Об'єм:</strong> ${volume.toFixed(2)} см³
                <small>V = π × r² × h = π × ${radius}² × ${cylHeight}</small>
              </div>
              <div class="surface-result">
                📐 <strong>Площа поверхні:</strong> ${surfaceArea.toFixed(2)} см²
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
          result.innerHTML = '<div class="error">⚠️ Введіть коректні значення для всіх параметрів</div>';
          return;
        }
        
        volume = (1/3) * Math.PI * coneRadius * coneRadius * coneHeight;
        const slantHeight = Math.sqrt(coneRadius * coneRadius + coneHeight * coneHeight);
        surfaceArea = Math.PI * coneRadius * (coneRadius + slantHeight);
        
        details = `
          <div class="calculation-details">
            <h4>🏔️ Конус</h4>
            <div class="parameters">
              <span>Радіус: <strong>${coneRadius} см</strong></span>
              <span>Висота: <strong>${coneHeight} см</strong></span>
              <span>Твірна: <strong>${slantHeight.toFixed(2)} см</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Об'єм:</strong> ${volume.toFixed(2)} см³
                <small>V = (1/3) × π × r² × h = (1/3) × π × ${coneRadius}² × ${coneHeight}</small>
              </div>
              <div class="surface-result">
                📐 <strong>Площа поверхні:</strong> ${surfaceArea.toFixed(2)} см²
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
          result.innerHTML = '<div class="error">⚠️ Введіть коректні значення для всіх параметрів</div>';
          return;
        }
        
        volume = (1/3) * baseArea * pyrHeight;
        
        details = `
          <div class="calculation-details">
            <h4>🔺 Піраміда</h4>
            <div class="parameters">
              <span>Площа основи: <strong>${baseArea} см²</strong></span>
              <span>Висота: <strong>${pyrHeight} см</strong></span>
            </div>
            <hr>
            <div class="results">
              <div class="volume-result">
                📊 <strong>Об'єм:</strong> ${volume.toFixed(2)} см³
                <small>V = (1/3) × S_осн × h = (1/3) × ${baseArea} × ${pyrHeight}</small>
              </div>
              <div class="info">
                💡 <em>Для розрахунку площі поверхні піраміди потрібно знати форму основи та бічні грані</em>
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