document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shoe-size-form');
  const unitSelect = document.getElementById('unit');
  const valueInput = document.getElementById('value');
  const resultDiv = document.getElementById('shoe-size-result');

  // Update placeholder based on selected unit
  unitSelect.addEventListener('change', () => {
    const unit = unitSelect.value;
    switch(unit) {
      case 'mondopoint':
        valueInput.placeholder = 'e.g., 270';
        break;
      case 'eu':
        valueInput.placeholder = 'e.g., 42';
        break;
      case 'uk':
        valueInput.placeholder = 'e.g., 8';
        break;
      case 'us_m':
        valueInput.placeholder = 'e.g., 9';
        break;
      case 'us_w':
        valueInput.placeholder = 'e.g., 10.5';
        break;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultDiv.textContent = '';

    const unit = unitSelect.value;
    const val = parseFloat(valueInput.value.replace(',', '.'));
    
    if (isNaN(val) || val <= 0) {
      resultDiv.innerHTML = '<p>Please enter a valid value.</p>';
      return;
    }

    let mondo, eu, uk, us_m, us_w;

    // Convert input to Mondopoint (foot length in mm)
    if (unit === 'mondopoint') {
      mondo = val;
    } else if (unit === 'eu') {
      eu = val;
      mondo = eu * 6.67 - 10;
    } else if (unit === 'uk') {
      mondo = 25.5 + 8.467 * val;
    } else if (unit === 'us_m') {
      mondo = 24 + 8.467 * val;
    } else if (unit === 'us_w') {
      mondo = 22.5 + 8.467 * val;
    }

    // Convert Mondopoint to all other sizes
    if (unit !== 'eu' && typeof mondo === 'number') {
      eu = (mondo + 10) / 6.67;
    }
    
    uk = (mondo - 25.5) / 8.467;
    us_m = (mondo - 24) / 8.467;
    us_w = (mondo - 22.5) / 8.467;

    // Format results
    const formatSize = (size) => {
      return size > 0 ? size.toFixed(1) : 'N/A';
    };

    resultDiv.innerHTML = `
      <h3>Shoe Size Conversion Results:</h3>
      <div class="size-conversion-table">
        <div class="size-row">
          <span class="size-label">Foot Length (Mondopoint):</span>
          <span class="size-value">${mondo.toFixed(0)} mm</span>
        </div>
        <div class="size-row">
          <span class="size-label">European (EU):</span>
          <span class="size-value">${formatSize(eu)}</span>
        </div>
        <div class="size-row">
          <span class="size-label">UK Size:</span>
          <span class="size-value">${formatSize(uk)}</span>
        </div>
        <div class="size-row">
          <span class="size-label">US Men's:</span>
          <span class="size-value">${formatSize(us_m)}</span>
        </div>
        <div class="size-row">
          <span class="size-label">US Women's:</span>
          <span class="size-value">${formatSize(us_w)}</span>
        </div>
      </div>
      
      <div class="conversion-notes">
        <h4>Important Sizing Notes:</h4>
        <ul>
          <li><strong>Half sizes:</strong> If your result falls between whole sizes (e.g., 8.3), you can choose either 8 or 8.5 based on your fit preference</li>
          <li><strong>Brand variations:</strong> Sizes can vary between brands by up to ½ size, so always check specific brand charts</li>
          <li><strong>Shoe type:</strong> Athletic shoes often run larger than dress shoes in the same size</li>
          <li><strong>Width consideration:</strong> This converter focuses on length; consider width fittings (narrow, medium, wide) separately</li>
          <li><strong>Best practice:</strong> When shopping online, read customer reviews about sizing and fit</li>
        </ul>
      </div>
      
      <div class="measurement-tip">
        <h4>Pro Tip:</h4>
        <p>Your foot length is <strong>${mondo.toFixed(0)}mm</strong>. When shopping online, look for brands that provide foot length measurements in their size charts for the most accurate fit.</p>
      </div>
    `;
  });
});