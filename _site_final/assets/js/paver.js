document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('paver-form');
  const result = document.getElementById('paver-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('paver-length').value);
      const width = parseFloat(document.getElementById('paver-width').value);
      const [paverSize, paversPerSqM] = document.getElementById('paver-type').value.split(',');
      const paverThickness = parseFloat(document.getElementById('paver-thickness').value);
      const materialPrice = parseFloat(document.getElementById('paver-material').value);
      const loadType = document.getElementById('paver-load').value;
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate area
      const area = length * width;
      const perimeter = 2 * (length + width);
      
      // Calculate pavers needed
      const paversNeeded = Math.ceil(area * parseFloat(paversPerSqM));
      const paversWithWaste = Math.ceil(paversNeeded * 1.08); // 8% waste
      const wasteQuantity = paversWithWaste - paversNeeded;
      
      // Calculate base material depths based on load type
      let gravelDepth, sandDepth;
      switch(loadType) {
        case 'pedestrian':
          gravelDepth = 0.10; // 100mm
          sandDepth = 0.03;   // 30mm
          break;
        case 'light':
          gravelDepth = 0.15; // 150mm
          sandDepth = 0.04;   // 40mm
          break;
        case 'heavy':
          gravelDepth = 0.20; // 200mm
          sandDepth = 0.05;   // 50mm
          break;
        default:
          gravelDepth = 0.15;
          sandDepth = 0.04;
      }
      
      // Calculate material volumes
      const gravelVolume = area * gravelDepth;
      const sandVolume = area * sandDepth;
      const geoTextileArea = area * 1.1; // 10% overlap
      
      // Calculate border requirements
      const borderLength = perimeter + (perimeter * 0.05); // 5% extra for cuts
      const borderPieces = Math.ceil(borderLength / 1.0); // 1m per piece
      
      // Material costs
      const paverCost = area * materialPrice;
      const gravelCost = gravelVolume * 1200; // 1200 UAH per m³
      const sandCost = sandVolume * 1000; // 1000 UAH per m³
      const geoTextileCost = geoTextileArea * 45; // 45 UAH per m²
      const borderCost = borderPieces * 85; // 85 UAH per piece
      
      // Installation materials
      const cementForJoints = area * 0.5; // 0.5 kg per m²
      const cementCost = cementForJoints * 8; // 8 UAH per kg
      
      const totalMaterialCost = paverCost + gravelCost + sandCost + geoTextileCost + borderCost + cementCost;
      
      // Installation cost estimate
      const installationRate = getInstallationRate(paverSize, loadType);
      const installationCost = area * installationRate;
      
      const totalProjectCost = totalMaterialCost + installationCost;
      
      // Calculate weights for delivery
      const paverWeight = paversWithWaste * getPaverWeight(paverSize, paverThickness);
      const gravelWeight = gravelVolume * 1600; // kg (gravel density)
      const sandWeight = sandVolume * 1500; // kg (sand density)
      const totalWeight = paverWeight + gravelWeight + sandWeight;
      
      // Installation time estimate
      const installationDays = Math.ceil(area / getInstallationRate(paverSize, 'area_per_day'));
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🏗️ Параметри проекту:</h4>
          <p><strong>Площа мощення:</strong> ${area.toFixed(1)} м²</p>
          <p><strong>Периметр:</strong> ${perimeter.toFixed(1)} м</p>
          <p><strong>Тип плитки:</strong> ${getPaverTypeName(paverSize)}</p>
          <p><strong>Товщина:</strong> ${paverThickness} мм</p>
          <p><strong>Навантаження:</strong> ${getLoadTypeName(loadType)}</p>
        </div>
        
        <div class="insight-card">
          <h4>🧱 Тротуарна плитка:</h4>
          <p><strong>Потрібно плитки:</strong> ${paversNeeded} шт.</p>
          <p><strong>З запасом (8%):</strong> ${paversWithWaste} шт.</p>
          <p><strong>Запас на бій:</strong> ${wasteQuantity} шт.</p>
          <p><strong>Щільність укладання:</strong> ${paversPerSqM} шт/м²</p>
          <p><strong>Вага плитки:</strong> ${paverWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>🏗️ Основні матеріали:</h4>
          <p><strong>Щебінь (фр. 5-20):</strong> ${gravelVolume.toFixed(2)} м³ (товщина ${gravelDepth * 1000} мм)</p>
          <p><strong>Пісок для укладання:</strong> ${sandVolume.toFixed(2)} м³ (товщина ${sandDepth * 1000} мм)</p>
          <p><strong>Геотекстиль:</strong> ${geoTextileArea.toFixed(1)} м²</p>
          <p><strong>Бордюрний камінь:</strong> ${borderPieces} шт. (${borderLength.toFixed(1)} м)</p>
          <p><strong>Цемент для швів:</strong> ${cementForJoints.toFixed(1)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Кошторис матеріалів:</h4>
          <p><strong>Тротуарна плитка:</strong> ${paverCost.toFixed(0)} грн</p>
          <p><strong>Щебінь:</strong> ${gravelCost.toFixed(0)} грн</p>
          <p><strong>Пісок:</strong> ${sandCost.toFixed(0)} грн</p>
          <p><strong>Геотекстиль:</strong> ${geoTextileCost.toFixed(0)} грн</p>
          <p><strong>Бордюри:</strong> ${borderCost.toFixed(0)} грн</p>
          <p><strong>Цемент:</strong> ${cementCost.toFixed(0)} грн</p>
          <p><strong>💳 Матеріали разом: ${totalMaterialCost.toFixed(0)} грн</strong></p>
        </div>
        
        <div class="insight-card">
          <h4>🔨 Вартість робіт:</h4>
          <p><strong>Ставка за укладання:</strong> ${installationRate} грн/м²</p>
          <p><strong>Вартість робіт:</strong> ${installationCost.toFixed(0)} грн</p>
          <p><strong>🔥 Загальна вартість проекту: ${totalProjectCost.toFixed(0)} грн</strong></p>
          <p><strong>Вартість за м²:</strong> ${(totalProjectCost / area).toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>⏱️ Терміни виконання:</h4>
          <p><strong>Підготовка основи:</strong> 2-3 дні</p>
          <p><strong>Укладання плитки:</strong> ${installationDays} днів</p>
          <p><strong>Загальний термін:</strong> ${installationDays + 3} робочих днів</p>
          <p><strong>Оптимальний сезон:</strong> травень-вересень</p>
        </div>
        
        <div class="insight-card">
          <h4>🚚 Доставка матеріалів:</h4>
          <p><strong>Загальна вага:</strong> ${totalWeight.toFixed(0)} кг</p>
          <p><strong>Рекомендації:</strong> ${getDeliveryRecommendation(totalWeight)}</p>
          <p><strong>Кількість рейсів:</strong> ${Math.ceil(totalWeight / 5000)} (при навантаженні 5 тонн)</p>
          <p><strong>Розвантаження:</strong> краще безпосередньо на ділянці</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Етапи укладання:</h4>
          <p>1️⃣ Розмітка території та виїмка ґрунту</p>
          <p>2️⃣ Укладання геотекстилю</p>
          <p>3️⃣ Насипання та ущільнення щебеню</p>
          <p>4️⃣ Встановлення бордюрів</p>
          <p>5️⃣ Насипання піщаної подушки</p>
          <p>6️⃣ Укладання тротуарної плитки</p>
          <p>7️⃣ Заповнення швів та вібрування</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Необхідне обладнання:</h4>
          <p>🚧 Вібраційна плита (100-200 кг)</p>
          <p>🪚 Болгарка з диском по каменю</p>
          <p>📏 Рівень та рулетка</p>
          <p>🧹 Щітка для заповнення швів</p>
          <p>🪣 Лопати та відра</p>
          <p>🎯 Шнур та кілки для розмітки</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Поради професіоналів:</h4>
          <p>📐 Почніть укладання від прямого кута</p>
          <p>🌡️ Не працюйте при температурі нижче +5°C</p>
          <p>💧 Передбачте ухил 1-2% для дренажу</p>
          <p>🎯 Використовуйте хрестики для рівних швів</p>
          <p>🔨 Вібруйте плитку після укладання</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Догляд за покриттям:</h4>
          <p><strong>Очищення:</strong> регулярне підмітання та миття</p>
          <p><strong>Заміна плитки:</strong> окремі елементи легко замінити</p>
          <p><strong>Зимовий догляд:</strong> посипання піском замість солі</p>
          <p><strong>Боротьба з бур'янами:</strong> обробка швів гербіцидами</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Альтернативи по бюджету:</h4>
          <p><strong>Економ варіант:</strong> ${(area * 250).toFixed(0)} грн (проста бетонна плитка)</p>
          <p><strong>Преміум варіант:</strong> ${(area * 2000).toFixed(0)} грн (гранітна бруківка)</p>
          <p><strong>Поточний проект:</strong> ${(totalProjectCost / area).toFixed(0)} грн/м²</p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Економія коштів:</h4>
          <p><strong>Самостійне укладання:</strong> економія ${installationCost.toFixed(0)} грн</p>
          <p><strong>Оптова закупівля:</strong> можлива знижка 10-15%</p>
          <p><strong>Сезонні знижки:</strong> найкращі ціни у квітні-травні</p>
        </div>
      `;
      
      function getPaverTypeName(size) {
        const types = {
          '100x200': 'Цеглинка 100×200 мм',
          '200x200': 'Квадрат 200×200 мм',
          '300x300': 'Великий квадрат 300×300 мм',
          '400x400': 'Плита 400×400 мм',
          'wave': 'Фігурна "Хвиля"'
        };
        return types[size] || size;
      }
      
      function getLoadTypeName(type) {
        const types = {
          'pedestrian': 'Пішохідне',
          'light': 'Легке автомобільне',
          'heavy': 'Важке комерційне'
        };
        return types[type] || type;
      }
      
      function getPaverWeight(size, thickness) {
        // Weight per piece in kg (concrete density ~2300 kg/m³)
        const weights = {
          '100x200': thickness * 0.046, // 0.1 * 0.2 * thickness/1000 * 2300
          '200x200': thickness * 0.092, // 0.2 * 0.2 * thickness/1000 * 2300
          '300x300': thickness * 0.207, // 0.3 * 0.3 * thickness/1000 * 2300
          '400x400': thickness * 0.368, // 0.4 * 0.4 * thickness/1000 * 2300
          'wave': thickness * 0.055 // Approximate for wave pattern
        };
        return weights[size] || thickness * 0.092;
      }
      
      function getInstallationRate(size, loadType) {
        // Base rates in UAH per m²
        let baseRate = 200;
        
        // Adjust for complexity
        if (size === 'wave' || size === '100x200') {
          baseRate += 50; // More complex patterns
        }
        
        if (loadType === 'heavy') {
          baseRate += 30; // More careful installation
        }
        
        return baseRate;
      }
      
      function getDeliveryRecommendation(weight) {
        if (weight < 2000) {
          return 'Можна доставити пікапом';
        } else if (weight < 5000) {
          return 'Потрібна мала вантажівка';
        } else {
          return 'Необхідна велика вантажівка або кілька рейсів';
        }
      }
    });
  }
});