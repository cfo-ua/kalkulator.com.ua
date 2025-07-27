document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gravel-form');
  const result = document.getElementById('gravel-result');
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
        <div class="result-section">
          <h4>Специфікації проекту:</h4>
          <p>Площа: ${length} м × ${width} м = ${area} м²</p>
          <p>Глибина: ${depth} см (${depthInMeters.toFixed(2)} м)</p>
          <p>Базовий об'єм: ${volumeCubicMeters.toFixed(2)} м³</p>
          <p>З коефіцієнтом ущільнення: ${adjustedVolume.toFixed(2)} м³</p>
        </div>
        
        <div class="result-materials">
          <h4>Потреби в матеріалах:</h4>
          <p><strong>Замовити: ${orderCubicMeters} м³</strong></p>
          <p><strong>Замовити: ${orderTons} тонн</strong></p>
          <p>Вага: ${(orderTons * 1000).toLocaleString()} кг</p>
          <p>Тип: ${currentGravelType}</p>
          <p>Щільність: ${tonsPerCubicMeter} т/м³</p>
          <p>Вага на м²: ${weightPerSqM.toFixed(1)} кг</p>
        </div>
        
        <div class="result-delivery">
          <h4>Інформація про доставку:</h4>
          <p>Потрібно вантажівок: ${truckLoads} (по 10 тонн)</p>
          <p>Вартість матеріалів: ${materialCost.toFixed(0)} грн</p>
          ${deliveryFee > 0 ? `<p>Вартість доставки: ${deliveryFee} грн</p>` : '<p>Самовивіз (без доставки)</p>'}
          <p><strong>Загальна вартість: ${totalCost.toFixed(0)} грн</strong></p>
        </div>
        
        <div class="result-installation">
          <h4>Керівництво з монтажу:</h4>
          <p>1. Викопайте на глибину ${(depth + 5).toFixed(0)} см (включаючи основу)</p>
          <p>2. Встановіть геотекстиль</p>
          <p>3. Додавайте та ущільнюйте щебінь шарами по 5-8 см</p>
          <p>4. Фінальне вирівнювання з ухилом 2% для дренажу</p>
          <p>5. Встановіть крайові обмежувачі для утримання щебню</p>
        </div>
        
        <div class="result-coverage">
          <h4>Порівняння покриття:</h4>
          <p>На ${depth} см: покриває ${area} м²</p>
          <p>На 5 см: покрило б ${(at5cm * area / volumeCubicMeters * compactionFactor).toFixed(0)} м²</p>
          <p>На 15 см: покрило б ${(at15cm * area / (area * 0.15) / compactionFactor).toFixed(0)} м²</p>
          <p>Вартість за м²: ${(totalCost / area).toFixed(2)} грн</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Щорічне обслуговування:</h4>
          <p>Потрібно підсипання: ${annualTopUp.toFixed(2)} м³</p>
          <p>Вага підсипання: ${(annualTopUp * tonsPerCubicMeter).toFixed(1)} тонн</p>
          <p>Щорічна вартість: ${annualCost.toFixed(0)} грн</p>
          <p>Частота: ${depth >= 15 ? 'Кожні 2-3 роки' : 'Щорічно'}</p>
        </div>
        
        <div class="result-tools">
          <h4>Необхідні інструменти та обладнання:</h4>
          <p>🚜 Екскаватор або лопата (для викопування)</p>
          <p>🎢 Віброплита (оренда 400-600 грн/день)</p>
          <p>📐 Рівень та шнур</p>
          <p>🔧 Граблі та ручний інструмент</p>
          <p>🧤 Захисне обладнання (рукавички, окуляри)</p>
        </div>
        
        <div class="result-tips">
          <h4>Професійні поради:</h4>
          <p>📏 Перевірте доступ для вантажівки (ширина 3+ м)</p>
          <p>⏰ Плануйте доставку після завершення екскавації</p>
          <p>🌦️ Уникайте доставки в дощову погоду</p>
          <p>📋 Перевірте місцеві дозволи на роботи з під'їздом</p>
          <p>💡 Розгляньте найм підрядника для великих проектів</p>
        </div>
        
        <div class="result-costs-breakdown">
          <h4>Вартість за кубометр:</h4>
          <p>Матеріал: ${(pricePerTon * tonsPerCubicMeter).toFixed(0)} грн/м³</p>
          <p>З доставкою: ${((materialCost + deliveryFee) / orderCubicMeters).toFixed(0)} грн/м³</p>
          <p>💰 Окупність доставки: ${(deliveryFee / (pricePerTon * tonsPerCubicMeter) * 100).toFixed(0)}% надбавка</p>
        </div>
        
        <div class="result-environmental">
          <h4>Екологічні переваги:</h4>
          <p>💧 Проникна поверхня зменшує стік</p>
          <p>🌱 Природний дренаж покращує якість води</p>
          <p>♻️ Перероблюваний матеріал (може бути повторно використаний)</p>
          <p>🏞️ Менший екологічний вплив ніж бетон</p>
        </div>
        
        <div class="result-project-tips">
          <h4>Поради для проекту:</h4>
          <p>🌡️ Найкращий час: весна або осінь</p>
          <p>📐 Перевірте рівень та ухили</p>
          <p>🚰 Врахуйте дренажні системи</p>
          <p>🏡 Координуйте з сусідами</p>
          <p>📞 Зателефонуйте для позначення комунікацій</p>
        </div>
      `;
    });
  }
});