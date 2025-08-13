document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('asphalt-form');
  const result = document.getElementById('asphalt-result');
  
  if (form) {
    // Set default values
    document.getElementById('asphalt-length').value = 200;
    document.getElementById('asphalt-width').value = 12;
    document.getElementById('asphalt-thickness').value = 3;
    document.getElementById('asphalt-price').value = 65;
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateAsphalt();
    });
    
    // Auto-calculate on input change
    form.addEventListener('input', function() {
      if (form.checkValidity()) {
        calculateAsphalt();
      }
    });
    
    // Initial calculation
    calculateAsphalt();
  }
  
  function calculateAsphalt() {
    const length = parseFloat(document.getElementById('asphalt-length').value) || 0;
    const width = parseFloat(document.getElementById('asphalt-width').value) || 0;
    const thicknessInches = parseFloat(document.getElementById('asphalt-thickness').value) || 0;
    const density = parseFloat(document.getElementById('asphalt-type').value) || 145; // lbs/ft³
    const pricePerTon = parseFloat(document.getElementById('asphalt-price').value) || 65;
    
    if (length <= 0 || width <= 0 || thicknessInches <= 0) {
      result.innerHTML = '<p class="error">⚠️ Please enter all dimensions with positive values.</p>';
      return;
    }
    
    // Calculations
    const area = length * width; // ft²
    const thicknessFt = thicknessInches / 12; // convert inches to feet
    const volumeFt3 = area * thicknessFt; // ft³
    const weightLbs = volumeFt3 * density; // lbs
    const weightTons = weightLbs / 2000; // tons
    const totalCost = weightTons * pricePerTon; // $
    const pricePerSqFt = totalCost / area; // $/ft²
    
    // Metric conversions
    const areaM2 = area * 0.092903; // m²
    const volumeM3 = volumeFt3 * 0.0283168; // m³
    const weightMetricTons = weightTons * 0.907185; // metric tons
    
    // Recommendations
    const extraTons = weightTons * 1.05; // 5% extra
    const extraCost = extraTons * pricePerTon;
    
    // Truck calculations (standard asphalt truck carries 25-30 tons)
    const trucksNeeded = Math.ceil(extraTons / 25);
    
    result.innerHTML = `
      <div class="insight-card">
        <div class="result-section">
          <h4>📊 Project Calculations</h4>
          <div class="result-grid">
            <div class="result-item">
              <span class="label">Area:</span>
              <span class="value">${area.toFixed(0)} ft² (${areaM2.toFixed(1)} m²)</span>
            </div>
            <div class="result-item">
              <span class="label">Volume:</span>
              <span class="value">${volumeFt3.toFixed(1)} ft³ (${volumeM3.toFixed(2)} m³)</span>
            </div>
            <div class="result-item">
              <span class="label">Weight:</span>
              <span class="value">${weightTons.toFixed(1)} tons (${weightMetricTons.toFixed(1)} metric tons)</span>
            </div>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section cost-section">
          <h4>💰 Material Cost</h4>
          <div class="cost-highlight">
            <p><strong>$${totalCost.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</strong></p>
            <p class="cost-per-sqft">$${pricePerSqFt.toFixed(2)}/ft²</p>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section recommendations">
          <h4>📋 Ordering Recommendations</h4>
          <div class="recommendation-grid">
            <div class="rec-item">
              <span class="rec-label">🎯 Order with 5% extra:</span>
              <span class="rec-value">${extraTons.toFixed(1)} tons</span>
            </div>
            <div class="rec-item">
              <span class="rec-label">🚛 Truck loads needed:</span>
              <span class="rec-value">${trucksNeeded} trucks (25 tons each)</span>
            </div>
            <div class="rec-item">
              <span class="rec-label">💸 Total with extra:</span>
              <span class="rec-value">$${extraCost.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-tips">
          <h4>💡 Professional Tips</h4>
          <ul>
            <li><strong>Base preparation:</strong> Install 6-8 inch compacted gravel base</li>
            <li><strong>Weather:</strong> Install when temperature is 45-85°F, no rain</li>
            <li><strong>Compaction:</strong> Use proper rolling equipment while asphalt is hot</li>
            <li><strong>Curing:</strong> Allow 24-48 hours before heavy traffic</li>
            <li><strong>Edges:</strong> Install curbing or edge restraints for durability</li>
          </ul>
        </div>
      </div>
      
      <style>
        .insight-card { 
          background: #f8f9fa; 
          border: 1px solid #e9ecef; 
          border-radius: 8px; 
          padding: 20px; 
          margin: 20px 0; 
        }
        .result-section { margin-bottom: 15px; }
        .result-grid, .recommendation-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 15px; 
          margin-top: 10px; 
        }
        .result-item, .rec-item { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px; 
          background: white; 
          border-radius: 5px; 
          border-left: 4px solid #007bff; 
        }
        .label, .rec-label { font-weight: 500; color: #495057; }
        .value, .rec-value { font-weight: bold; color: #007bff; }
        .cost-section { text-align: center; }
        .cost-highlight { 
          background: linear-gradient(135deg, #28a745, #20c997); 
          color: white; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 10px 0; 
        }
        .cost-highlight p { margin: 5px 0; }
        .cost-per-sqft { font-size: 0.9em; opacity: 0.9; }
        .divider { 
          border: none; 
          height: 2px; 
          background: linear-gradient(to right, transparent, #007bff, transparent); 
          margin: 20px 0; 
        }
        .result-tips ul { margin: 10px 0; }
        .result-tips li { margin: 8px 0; padding: 5px 0; }
        .error { color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 5px; }
      </style>
    `;
  }
});