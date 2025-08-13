document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('asphalt-form');
  const result = document.getElementById('asphalt-result');
  
  if (form) {
    // Set default values
    document.getElementById('asphalt-length').value = 50;
    document.getElementById('asphalt-width').value = 10;
    document.getElementById('asphalt-thickness').value = 6;
    document.getElementById('asphalt-price').value = 2500;
    
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
    const thicknessCm = parseFloat(document.getElementById('asphalt-thickness').value) || 0;
    const density = parseFloat(document.getElementById('asphalt-type').value) || 2.4;
    const pricePerTon = parseFloat(document.getElementById('asphalt-price').value) || 2500;
    
    if (length <= 0 || width <= 0 || thicknessCm <= 0) {
      result.innerHTML = '<p class="error">⚠️ Введіть всі розміри з додатними значеннями.</p>';
      return;
    }
    
    // Calculations
    const area = length * width; // m²
    const thicknessM = thicknessCm / 100; // convert cm to m
    const volume = area * thicknessM; // m³
    const weight = volume * density; // tons
    const totalCost = weight * pricePerTon; // грн
    const pricePerM2 = totalCost / area; // грн/м²
    
    // Recommendations
    const extraVolume = volume * 1.05; // 5% extra
    const extraWeight = extraVolume * density;
    const extraCost = extraWeight * pricePerTon;
    
    // Truck calculations (standard asphalt truck carries 20-25 tons)
    const trucksNeeded = Math.ceil(extraWeight / 20);
    
    result.innerHTML = `
      <div class="insight-card">
        <div class="result-section">
          <h4>📊 Основні розрахунки</h4>
          <div class="result-grid">
            <div class="result-item">
              <span class="label">Площа:</span>
              <span class="value">${area.toFixed(1)} м²</span>
            </div>
            <div class="result-item">
              <span class="label">Об'єм асфальту:</span>
              <span class="value">${volume.toFixed(2)} м³</span>
            </div>
            <div class="result-item">
              <span class="label">Вага асфальту:</span>
              <span class="value">${weight.toFixed(1)} тонн</span>
            </div>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section cost-section">
          <h4>💰 Вартість матеріалу</h4>
          <div class="cost-highlight">
            <p><strong>${totalCost.toLocaleString('uk-UA')} грн</strong></p>
            <p class="cost-per-m2">${pricePerM2.toFixed(0)} грн/м²</p>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section recommendations">
          <h4>📋 Рекомендації для замовлення</h4>
          <div class="recommendation-grid">
            <div class="rec-item">
              <span class="rec-label">🎯 Замовляти з запасом (5%):</span>
              <span class="rec-value">${extraWeight.toFixed(1)} тонн</span>
            </div>
            <div class="rec-item">
              <span class="rec-label">🚛 Кількість самоскидів:</span>
              <span class="rec-value">${trucksNeeded} шт. (по 20 т)</span>
            </div>
            <div class="rec-item">
              <span class="rec-label">💸 Вартість з запасом:</span>
              <span class="rec-value">${extraCost.toLocaleString('uk-UA')} грн</span>
            </div>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-tips">
          <h4>💡 Корисні поради</h4>
          <ul>
            <li><strong>Підготовка основи:</strong> Обов'язково зробіть щебеневу основу 15-20 см</li>
            <li><strong>Погодні умови:</strong> Укладайте при температурі +5...+30°C, без дощу</li>
            <li><strong>Ущільнення:</strong> Використовуйте каток 8-12 тонн для якісного ущільнення</li>
            <li><strong>Час застигання:</strong> Уникайте навантаження перші 24 години</li>
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
        .cost-per-m2 { font-size: 0.9em; opacity: 0.9; }
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