document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('board-foot-form');
  const result = document.getElementById('board-foot-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const thickness = parseFloat(document.getElementById('lumber-thickness').value) / 1000; // Convert mm to meters
      const width = parseFloat(document.getElementById('lumber-width').value) / 1000; // Convert mm to meters
      const length = parseFloat(document.getElementById('lumber-length').value);
      const quantity = parseFloat(document.getElementById('lumber-quantity').value);
      const pricePerCubicMeter = parseFloat(document.getElementById('lumber-type').value);
      const wasteFactor = parseFloat(document.getElementById('lumber-waste').value);
      
      if (thickness <= 0 || width <= 0 || length <= 0 || quantity <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate volume per piece in cubic meters
      const volumePerPiece = thickness * width * length;
      
      // Calculate total volume
      const totalVolume = volumePerPiece * quantity;
      
      // Add waste factor
      const volumeWithWaste = totalVolume * (1 + wasteFactor);
      
      // Calculate costs
      const baseCost = totalVolume * pricePerCubicMeter;
      const costWithWaste = volumeWithWaste * pricePerCubicMeter;
      const wasteCost = costWithWaste - baseCost;
      
      // Calculate weight estimates (average 500 kg per cubic meter for lumber)
      const weightKg = volumeWithWaste * 500;
      
      // Calculate surface area (one face)
      const surfaceArea = (width * length * quantity); // square meters
      
      // Calculate linear meters (total length if pieces were laid end-to-end)
      const linearMeters = length * quantity;
      
      // Find equivalent common lumber sizes
      const commonSizes = [
        { name: "25×100×3000", thickness: 0.025, width: 0.1, length: 3, volume: 0.0075 },
        { name: "40×150×4000", thickness: 0.04, width: 0.15, length: 4, volume: 0.024 },
        { name: "50×150×4000", thickness: 0.05, width: 0.15, length: 4, volume: 0.03 },
        { name: "50×200×6000", thickness: 0.05, width: 0.2, length: 6, volume: 0.06 },
        { name: "100×100×3000", thickness: 0.1, width: 0.1, length: 3, volume: 0.03 },
        { name: "150×150×6000", thickness: 0.15, width: 0.15, length: 6, volume: 0.135 }
      ];
      
      // Find closest match
      let closestMatch = commonSizes[0];
      let smallestDiff = Math.abs(volumePerPiece - closestMatch.volume);
      
      commonSizes.forEach(size => {
        const diff = Math.abs(volumePerPiece - size.volume);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestMatch = size;
        }
      });
      
      // Determine wood grade recommendations
      let gradeRecommendation = '';
      if (pricePerCubicMeter <= 12000) {
        gradeRecommendation = 'Технічний сорт, підходить для каркасів і невидимих конструкцій';
      } else if (pricePerCubicMeter <= 20000) {
        gradeRecommendation = 'Сорт В-А, підходить для меблів та видимих поверхонь';
      } else {
        gradeRecommendation = 'Преміум сорт, підходить для елітних меблів та оздоблення';
      }
      
      // Calculate pieces per cubic meter
      const piecesPerCubicMeter = Math.floor(1 / volumePerPiece);
      
      // Calculate delivery recommendations
      const deliveryWeight = weightKg;
      let deliveryType = '';
      if (deliveryWeight < 200) {
        deliveryType = 'Можна перевезти легковим автомобілем';
      } else if (deliveryWeight < 500) {
        deliveryType = 'Підходить пікап або мала вантажівка';
      } else {
        deliveryType = 'Потрібна вантажівка';
      }
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🏗️ Специфікація пиломатеріалу:</h4>
          <p><strong>Розміри:</strong> ${thickness*1000}×${width*1000}×${length*1000} мм</p>
          <p><strong>Кількість:</strong> ${quantity} штук</p>
          <p><strong>Коефіцієнт відходів:</strong> ${(wasteFactor * 100)}%</p>
          <p><strong>Порода:</strong> ${getWoodTypeName(pricePerCubicMeter)}</p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Розрахунок об'єму:</h4>
          <p><strong>Об'єм за штуку:</strong> ${volumePerPiece.toFixed(4)} м³</p>
          <p><strong>Загальний об'єм:</strong> ${totalVolume.toFixed(3)} м³</p>
          <p><strong>З відходами:</strong> ${volumeWithWaste.toFixed(3)} м³</p>
          <p><strong>Формула:</strong> ${thickness} × ${width} × ${length} × ${quantity}</p>
        </div>
        
        <div class="insight-card">
          <h4>📏 Альтернативні вимірювання:</h4>
          <p><strong>Погонні метри:</strong> ${linearMeters} м (довжина встик)</p>
          <p><strong>Площа поверхні:</strong> ${surfaceArea.toFixed(2)} м² (одна сторона)</p>
          <p><strong>Приблизна вага:</strong> ${weightKg.toFixed(0)} кг</p>
          <p><strong>Штук в 1 м³:</strong> ${piecesPerCubicMeter} шт</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Розрахунок вартості:</h4>
          <p><strong>Базова вартість:</strong> ${baseCost.toFixed(0)} грн (${totalVolume.toFixed(3)} м³ × ${pricePerCubicMeter} грн)</p>
          <p><strong>Запас на відходи:</strong> ${wasteCost.toFixed(0)} грн</p>
          <p><strong>🔥 Загальна вартість: ${costWithWaste.toFixed(0)} грн</strong></p>
          <p><strong>Вартість за штуку:</strong> ${(costWithWaste / quantity).toFixed(0)} грн</p>
          <p><strong>Вартість за погонний метр:</strong> ${(costWithWaste / linearMeters).toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>🔍 Порівняння зі стандартними розмірами:</h4>
          <p><strong>Ваш пиломатеріал:</strong> ${volumePerPiece.toFixed(4)} м³ за штуку</p>
          <p><strong>Найближчий стандарт:</strong> ${closestMatch.name} (${closestMatch.volume.toFixed(4)} м³)</p>
          <p><strong>Різниця:</strong> ${Math.abs(volumePerPiece - closestMatch.volume).toFixed(4)} м³</p>
        </div>
        
        <div class="insight-card">
          <h4>🎯 Рекомендації по сорту:</h4>
          <p>${gradeRecommendation}</p>
          ${pricePerCubicMeter <= 12000 ? 
            '<p>💡 Розгляньте камерне сушіння для внутрішніх робіт</p>' : 
            '<p>💡 Переконайтеся у правильній вологості для вашого застосування</p>'}
        </div>
        
        <div class="insight-card">
          <h4>📦 Інформація для замовлення:</h4>
          <p><strong>Замовити:</strong> ${Math.ceil(volumeWithWaste * 1000) / 1000} м³</p>
          <p><strong>Доставка:</strong> ${deliveryType}</p>
          <p><strong>Вага доставки:</strong> ${weightKg.toFixed(0)} кг</p>
          <p><strong>Зберігання:</strong> зберігати горизонтально, з підтримкою кожні 60 см</p>
          <p><strong>Акліматизація:</strong> 3-7 днів у середовищі проекту</p>
        </div>
        
        <div class="insight-card">
          <h4>🔨 Планування проекту:</h4>
          <p>📐 Плануйте розкрої для мінімізації відходів</p>
          <p>📏 Вимірюйте двічі, різайте один раз</p>
          <p>🌡️ Дайте деревині акліматизуватись</p>
          <p>📦 Купуйте з однієї партії для однорідності</p>
          <p>🎯 Використовуйте найкращі шматки для видимих поверхонь</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Альтернативи по вартості:</h4>
          <p><strong>Сосна замість дуба:</strong> ${(volumeWithWaste * 10000).toFixed(0)} грн (економія ${(costWithWaste - volumeWithWaste * 10000).toFixed(0)} грн)</p>
          <p><strong>Преміум деревина:</strong> ${(volumeWithWaste * 40000).toFixed(0)} грн (додатково ${(volumeWithWaste * 40000 - costWithWaste).toFixed(0)} грн)</p>
          <p>${pricePerCubicMeter > 20000 ? '💰 Розгляньте' : 'Дорожче за'} альтернативні матеріали</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Інструменти для обробки:</h4>
          <p>📐 Вимірювання: рулетка, кутник, штангенциркуль</p>
          <p>🪚 Розрізання: циркулярна пила, торцова пила</p>
          <p>✂️ З'єднання: фрезер, ламельний фрезер, саморізи</p>
          <p>📝 Планування: список розрізів, система маркування</p>
        </div>
        
        <div class="insight-card">
          <h4>🌡️ Рекомендації по вологості:</h4>
          <p><strong>Для внутрішніх робіт:</strong> 8-12% вологості</p>
          <p><strong>Для зовнішніх робіт:</strong> 15-18% допустимо</p>
          <p><strong>Природна вологість:</strong> потребує сушіння</p>
          <p><strong>Перевірка:</strong> використовуйте вологомір</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Обробка та захист:</h4>
          <p><strong>Для хвойних порід:</strong> антисептик + фарба/лак</p>
          <p><strong>Для твердолистяних:</strong> морилка + лак/воск</p>
          <p><strong>Зовнішнє використання:</strong> просочення + захисне покриття</p>
          <p><strong>Внутрішнє використання:</strong> шліфування + декоративне покриття</p>
        </div>
      `;
      
      function getWoodTypeName(price) {
        if (price <= 12000) return 'Хвойні породи (сосна/ялина)';
        if (price <= 18000) return 'М\'які листяні (вільха/береза)';
        if (price <= 25000) return 'Середні твердолистяні (бук/ясен)';
        return 'Преміум твердолистяні (дуб та екзотичні)';
      }
    });
  }
});