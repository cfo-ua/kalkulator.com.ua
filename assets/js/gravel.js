document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gravel-form');
  const result = document.getElementById('gravel-result');
  
  // Global function for preset buttons  
  window.setPreset = function(length, width, depth) {
    document.getElementById('gravel-length').value = length;
    document.getElementById('gravel-width').value = width;
    document.getElementById('gravel-depth').value = depth;
    
    // Trigger calculation automatically
    form.dispatchEvent(new Event('submit'));
  };
  
  // Add quick conversion calculator
  function addQuickConverter() {
    const converterHTML = `
      <div class="quick-converter" style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <h4>🔄 Швидкий калькулятор перерахунку щебню</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
          <div>
            <label>Кубометри: <input type="number" id="cubic-input" step="0.1" placeholder="Введіть кубометри"></label>
          </div>
          <div>
            <label>Тип щебню: 
              <select id="conversion-type">
                <option value="1.5">Дроблений камінь (1,5 т/м³)</option>
                <option value="1.3">Дрібний гравій (1,3 т/м³)</option>
                <option value="1.2">Річковий камінь (1,2 т/м³)</option>
                <option value="1.6">Відсів (1,6 т/м³)</option>
                <option value="1.4">Гранітний відсів (1,4 т/м³)</option>
              </select>
            </label>
          </div>
        </div>
        <div id="conversion-result" style="margin-top: 10px; font-weight: bold; color: #2c5530;"></div>
      </div>
    `;
    
    const formElement = document.getElementById('gravel-form');
    if (formElement) {
      formElement.insertAdjacentHTML('beforebegin', converterHTML);
      
      // Add conversion functionality
      const cubicInput = document.getElementById('cubic-input');
      const conversionType = document.getElementById('conversion-type');
      const conversionResult = document.getElementById('conversion-result');
      
      function updateConversion() {
        const cubic = parseFloat(cubicInput.value);
        const factor = parseFloat(conversionType.value);
        
        if (cubic > 0) {
          const tons = cubic * factor;
          const coverage8cm = tons * (8 / factor * 1.1); // Approximate coverage at 8cm
          conversionResult.innerHTML = `
            ${cubic} м³ = <strong>${tons.toFixed(1)} тонн</strong><br>
            Покриття: ~${coverage8cm.toFixed(0)} м² на глибині 8 см
          `;
        } else {
          conversionResult.innerHTML = '';
        }
      }
      
      cubicInput.addEventListener('input', updateConversion);
      conversionType.addEventListener('change', updateConversion);
    }
  }
  
  // Initialize quick converter
  addQuickConverter();
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('gravel-length').value);
      const width = parseFloat(document.getElementById('gravel-width').value);
      const depth = parseFloat(document.getElementById('gravel-depth').value);
      const [tonsPerCubicMeter, pricePerTon] = document.getElementById('gravel-type').value.split(',').map(Number);
      const compactionFactor = parseFloat(document.getElementById('gravel-project').value);
      const deliveryFee = parseFloat(document.getElementById('gravel-delivery').value);
      
      if (length <= 0 || width <= 0 || depth <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate area and volume
      const area = length * width;
      const depthInMeters = depth / 100; // Convert cm to meters
      const volumeCubicMeters = area * depthInMeters;
      
      // Apply compaction factor
      const adjustedVolume = volumeCubicMeters * compactionFactor;
      
      // Convert to tons
      const totalTons = adjustedVolume * tonsPerCubicMeter;
      
      // Round up to nearest half-ton for ordering
      const orderTons = Math.ceil(totalTons * 2) / 2;
      const orderCubicMeters = Math.ceil(adjustedVolume * 2) / 2;
      
      // Calculate costs
      const materialCost = orderTons * pricePerTon;
      const totalCost = materialCost + deliveryFee;
      
      // Calculate coverage information
      const weightPerSqM = totalTons * 1000 / area; // Weight in kg per sq m
      
      // Calculate truck loads (typical gravel truck carries 10-12 tons in Ukraine)
      const truckLoads = Math.ceil(orderTons / 10);
      
      // Annual maintenance estimate
      const annualTopUp = area * 0.015; // 1.5 cm annually
      const annualCost = annualTopUp * tonsPerCubicMeter * pricePerTon;
      
      // Calculate alternative depths for comparison
      const at5cm = (area * 0.05) * compactionFactor;
      const at15cm = (area * 0.15) * compactionFactor;
      
      // Gravel type names in Ukrainian
      const gravelTypeNames = {
        1.5: 'Дроблений камінь 10-20 мм',
        1.3: 'Дрібний гравій 5-10 мм',
        1.6: 'Відсів 0-5 мм',
        1.2: 'Річковий камінь',
        1.4: 'Гранітний відсів',
        1.7: 'Вапнякове сито'
      };
      
      const currentGravelType = gravelTypeNames[tonsPerCubicMeter] || 'Вибраний тип щебню';
      
      result.innerHTML = `
        <div class="result-header" style="background: #2c5530; color: white; padding: 15px; border-radius: 8px 8px 0 0; margin-top: 20px;">
          <h3 style="margin: 0; color: white;">📊 Результати калькулятора щебню</h3>
        </div>
        
        <div class="result-content" style="border: 2px solid #2c5530; border-radius: 0 0 8px 8px; padding: 20px;">
          <div class="result-section">
            <h4>🏗️ Специфікації проекту:</h4>
            <p><strong>Площа:</strong> ${length} м × ${width} м = ${area} м²</p>
            <p><strong>Глибина:</strong> ${depth} см (${depthInMeters.toFixed(2)} м)</p>
            <p><strong>Базовий об'єм:</strong> ${volumeCubicMeters.toFixed(2)} м³</p>
            <p><strong>З коефіцієнтом ущільнення:</strong> ${adjustedVolume.toFixed(2)} м³</p>
          </div>
          
          <div class="result-materials" style="background: #f0f8f0; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h4>📦 Потреби в матеріалах (ЗАМОВЛЯЙТЕ ЦІ КІЛЬКОСТІ):</h4>
            <p><strong>🎯 Замовити: ${orderCubicMeters} м³</strong></p>
            <p><strong>⚖️ Замовити: ${orderTons} тонн</strong></p>
            <p><strong>Вага:</strong> ${(orderTons * 1000).toLocaleString()} кг</p>
            <p><strong>Тип:</strong> ${currentGravelType}</p>
            <p><strong>Щільність:</strong> ${tonsPerCubicMeter} т/м³</p>
            <p><strong>Вага на м²:</strong> ${weightPerSqM.toFixed(1)} кг</p>
          </div>
          
          <div class="result-conversions" style="background: #fff8e1; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h4>🔄 Перерахунок кубометрів в тонни:</h4>
            <p><strong>Ваш проект:</strong> ${volumeCubicMeters.toFixed(1)} м³ = ${totalTons.toFixed(1)} тонн</p>
            <p><strong>Коефіцієнт перерахунку:</strong> 1 м³ = ${tonsPerCubicMeter} тонн (${currentGravelType})</p>
            <p><strong>Норма покриття:</strong> 1 тонна покриває ~${(1 / tonsPerCubicMeter * 100 / depth * 10).toFixed(0)} м² на глибині ${depth} см</p>
          </div>
          
          <div class="result-delivery">
            <h4>🚚 Інформація про доставку та вартість:</h4>
            <p><strong>Потрібно вантажівок:</strong> ${truckLoads} (по 10 тонн)</p>
            <p><strong>Вартість матеріалів:</strong> ${materialCost.toFixed(0)} грн</p>
            ${deliveryFee > 0 ? `<p><strong>Вартість доставки:</strong> ${deliveryFee} грн</p>` : '<p><strong>Самовивіз:</strong> без доставки</p>'}
            <p style="font-size: 1.2em; font-weight: bold; color: #2c5530;"><strong>💰 Загальна вартість: ${totalCost.toFixed(0)} грн</strong></p>
            <p><strong>Вартість за м²:</strong> ${(totalCost / area).toFixed(2)} грн</p>
          </div>
          
          <div class="result-installation">
            <h4>🔧 Керівництво з монтажу:</h4>
            <p><strong>1.</strong> Викопайте на глибину ${(depth + 5).toFixed(0)} см (включаючи основу)</p>
            <p><strong>2.</strong> Встановіть геотекстиль</p>
            <p><strong>3.</strong> Додавайте та ущільнюйте щебінь шарами по 5-8 см</p>
            <p><strong>4.</strong> Фінальне вирівнювання з ухилом 2% для дренажу</p>
            <p><strong>5.</strong> Встановіть крайові обмежувачі для утримання щебню</p>
          </div>
          
          <div class="result-coverage">
            <h4>📐 Порівняння покриття:</h4>
            <p><strong>На ${depth} см:</strong> покриває ${area} м² (ваш проект)</p>
            <p><strong>На 5 см:</strong> покрило б ${(adjustedVolume * area / volumeCubicMeters * 2).toFixed(0)} м²</p>
            <p><strong>На 15 см:</strong> покрило б ${(adjustedVolume * area / volumeCubicMeters * 0.67).toFixed(0)} м²</p>
          </div>
          
          <div class="result-maintenance">
            <h4>🔄 Щорічне обслуговування:</h4>
            <p><strong>Потрібно підсипання:</strong> ${annualTopUp.toFixed(2)} м³</p>
            <p><strong>Вага підсипання:</strong> ${(annualTopUp * tonsPerCubicMeter).toFixed(1)} тонн</p>
            <p><strong>Щорічна вартість:</strong> ${annualCost.toFixed(0)} грн</p>
            <p><strong>Частота:</strong> ${depth >= 15 ? 'Кожні 2-3 роки' : 'Щорічно'}</p>
          </div>
          
          <div class="result-tools">
            <h4>🛠️ Необхідні інструменти та обладнання:</h4>
            <p>🚜 Екскаватор або лопата (для викопування)</p>
            <p>🎢 Віброплита (оренда 400-600 грн/день)</p>
            <p>📐 Рівень та шнур</p>
            <p>🔧 Граблі та ручний інструмент</p>
            <p>🧤 Захисне обладнання (рукавички, окуляри)</p>
          </div>
          
          <div class="result-tips">
            <h4>💡 Професійні поради:</h4>
            <p>📏 Перевірте доступ для вантажівки (ширина 3+ м)</p>
            <p>⏰ Плануйте доставку після завершення екскавації</p>
            <p>🌦️ Уникайте доставки в дощову погоду</p>
            <p>📋 Перевірте місцеві дозволи на роботи з під'їздом</p>
            <p>💡 Розгляньте найм підрядника для великих проектів (${area > 50 ? 'РЕКОМЕНДОВАНО для вашого розміру проекту' : 'опціонально для вашого розміру проекту'})</p>
          </div>
          
          <div class="result-costs-breakdown">
            <h4>💰 Вартість за кубометр:</h4>
            <p><strong>Матеріал:</strong> ${(pricePerTon * tonsPerCubicMeter).toFixed(0)} грн/м³</p>
            <p><strong>З доставкою:</strong> ${((materialCost + deliveryFee) / orderCubicMeters).toFixed(0)} грн/м³</p>
            <p><strong>Окупність доставки:</strong> ${(deliveryFee / (pricePerTon * tonsPerCubicMeter) * 100).toFixed(0)}% надбавка</p>
          </div>
        </div>
      `;
    });
  }
});