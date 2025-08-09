document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('rebar-form');
  const result = document.getElementById('rebar-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('rebar-length').value);
      const width = parseFloat(document.getElementById('rebar-width').value);
      const [rebarDiameter, costPerMeter] = document.getElementById('rebar-size').value.split(',').map(Number);
      const spacing = parseFloat(document.getElementById('rebar-spacing').value) / 1000; // Convert mm to meters
      const projectType = document.getElementById('rebar-project').value;
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      let lengthwiseBars, widthwiseBars, totalBars;
      
      switch(projectType) {
        case 'slab':
        case 'driveway':
          // Grid pattern - bars in both directions
          lengthwiseBars = Math.floor(width / spacing) + 1;
          widthwiseBars = Math.floor(length / spacing) + 1;
          totalBars = lengthwiseBars + widthwiseBars;
          break;
        case 'footing':
          // Parallel bars along length
          lengthwiseBars = Math.floor(width / spacing) + 1;
          widthwiseBars = 0;
          totalBars = lengthwiseBars;
          break;
        case 'wall':
          // Vertical and horizontal reinforcement
          const wallHeight = 2.5; // Assume 2.5 m wall height
          lengthwiseBars = Math.floor(length / spacing) + 1; // Horizontal
          widthwiseBars = Math.floor(wallHeight / spacing) + 1; // Vertical
          totalBars = lengthwiseBars + widthwiseBars;
          break;
        default:
          lengthwiseBars = widthwiseBars = totalBars = 0;
      }
      
      // Calculate linear meters of rebar needed
      const lengthwiseLinearMeters = lengthwiseBars * length;
      const widthwiseLinearMeters = widthwiseBars * width;
      const totalLinearMeters = lengthwiseLinearMeters + widthwiseLinearMeters;
      
      // Add 10% for overlaps, bends, and waste
      const linearMetersWithWaste = totalLinearMeters * 1.1;
      
      // Calculate number of 6-meter sticks needed
      const sticksNeeded = Math.ceil(linearMetersWithWaste / 6);
      
      // Calculate costs
      const rebarCost = linearMetersWithWaste * costPerMeter;
      
      // Calculate accessories
      const intersections = lengthwiseBars * widthwiseBars;
      const tieWires = Math.ceil(intersections * 1.1); // 10% extra for ties
      const chairs = Math.ceil(totalLinearMeters / 2); // Support every 2 meters
      
      const accessoryCost = (tieWires * 0.5) + (chairs * 5); // 0.5 грн per tie, 5 грн per chair
      const totalCost = rebarCost + accessoryCost;
      
      // Calculate weight (approximate) - using kg/m for different diameters
      const weightPerMeter = {
        8: 0.395,   // Ø8 kg per meter
        10: 0.617,  // Ø10 kg per meter
        12: 0.888,  // Ø12 kg per meter
        14: 1.208,  // Ø14 kg per meter
        16: 1.578   // Ø16 kg per meter
      };
      
      const totalWeight = linearMetersWithWaste * weightPerMeter[rebarDiameter];
      
      // Calculate concrete cover requirements
      let coverRequirement = '';
      switch(projectType) {
        case 'slab':
        case 'driveway':
          coverRequirement = '30-40 мм знизу, 20 мм зверху';
          break;
        case 'footing':
          coverRequirement = '40 мм з усіх сторін';
          break;
        case 'wall':
          coverRequirement = '25 мм зовні, 15-20 мм всередині';
          break;
      }
      
      // Calculate overlap length (40 diameters for standard splice)
      const overlapLength = (rebarDiameter * 40) / 1000; // Convert to meters
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🏗️ Специфікації проекту:</h4>
          <p><strong>Розміри:</strong> ${length} м × ${width} м</p>
          <p><strong>Діаметр арматури:</strong> Ø${rebarDiameter} мм</p>
          <p><strong>Крок армування:</strong> ${spacing * 1000} мм</p>
          <p><strong>Тип конструкції:</strong> ${getProjectTypeName(projectType)}</p>
        </div>
        
        <div class="insight-card">
          <h4>📐 Схема армування:</h4>
          ${projectType === 'slab' || projectType === 'driveway' ? `
          <p><strong>Поздовжні прутки:</strong> ${lengthwiseBars} шт. × ${length} м</p>
          <p><strong>Поперечні прутки:</strong> ${widthwiseBars} шт. × ${width} м</p>
          <p><strong>Перетини решітки:</strong> ${intersections} шт.</p>
          ` : projectType === 'footing' ? `
          <p><strong>Паралельні прутки:</strong> ${lengthwiseBars} шт. × ${length} м</p>
          ` : `
          <p><strong>Горизонтальні прутки:</strong> ${lengthwiseBars} шт. × ${length} м</p>
          <p><strong>Вертикальні прутки:</strong> ${widthwiseBars} шт. × 2,5 м</p>
          `}
          <p><strong>🔧 Загальна кількість прутків: ${totalBars} шт.</strong></p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Потреба в матеріалах:</h4>
          <p><strong>Погонні метри:</strong> ${totalLinearMeters.toFixed(1)} м</p>
          <p><strong>З запасом (10%):</strong> ${linearMetersWithWaste.toFixed(1)} м</p>
          <p><strong>📏 Прутків 6м:</strong> ${sticksNeeded} шт.</p>
          <p><strong>⚖️ Загальна вага:</strong> ${totalWeight.toFixed(0)} кг</p>
          <p><strong>💰 Вартість арматури:</strong> ${rebarCost.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>🔗 Матеріали для монтажу:</h4>
          <p><strong>В'язальний дріт:</strong> ${tieWires} шт.</p>
          <p><strong>Підставки/фіксатори:</strong> ${chairs} шт.</p>
          <p><strong>Вартість аксесуарів:</strong> ${accessoryCost.toFixed(0)} грн</p>
          <p><strong>💳 Загальна вартість проекту: ${totalCost.toFixed(0)} грн</strong></p>
        </div>
        
        <div class="insight-card">
          <h4>📏 Вимоги до монтажу:</h4>
          <p><strong>Захисний шар:</strong> ${coverRequirement}</p>
          <p><strong>Довжина нахлесту:</strong> ${overlapLength.toFixed(2)} м (40d)</p>
          <p><strong>Радіус згину:</strong> ${(rebarDiameter * 5)} мм мінімум</p>
          <p><strong>Підтримка:</strong> Кожні 2 метри</p>
        </div>
        
        <div class="insight-card">
          <h4>🔨 Етапи монтажу:</h4>
          <p>1️⃣ Встановіть підставки з правильним кроком</p>
          <p>2️⃣ Покладіть поздовжні прутки першими</p>
          <p>3️⃣ Розмістіть поперечні прутки зверху</p>
          <p>4️⃣ Зв'яжіть перетини в'язальним дротом</p>
          <p>5️⃣ Перевірте відстані захисного шару</p>
          <p>6️⃣ Залийте бетон протягом 24 годин</p>
        </div>
        
        <div class="insight-card">
          <h4>✅ Переваги армування:</h4>
          <p>🛡️ Запобігає тріщинам від температурних змін</p>
          <p>💪 Збільшує несучу здатність конструкції</p>
          <p>⏰ Покращує довговічність і термін служби</p>
          <p>🏗️ Обов'язково для комерційних застосувань</p>
          <p>🔧 Забезпечує структурну цілісність</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Необхідні інструменти:</h4>
          <p>✂️ Болгарка або ножиці для арматури</p>
          <p>🔧 Гнучка для арматури (для менших діаметрів)</p>
          <p>🪝 Кручки для в'язального дроту</p>
          <p>📏 Рулетка</p>
          <p>🧤 Робочі рукавички (захист від порізів)</p>
          <p>👓 Захисні окуляри</p>
        </div>
        
        <div class="insight-card">
          <h4>🚛 Доставка та обробка:</h4>
          <p><strong>Вага для доставки:</strong> ${totalWeight.toFixed(0)} кг</p>
          <p><strong>Транспорт:</strong> ${totalWeight > 500 ? 'Рекомендується доставка вантажівкою' : 'Поміститься в пікап'}</p>
          <p><strong>Зберігання:</strong> Тримати сухим, не на землі</p>
          <p><strong>Переміщення:</strong> Використовуйте правильну техніку підняття</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Професійні поради:</h4>
          <p>📐 Плануйте розкрій, щоб мінімізувати відходи</p>
          <p>🔗 Зміщуйте нахлести для міцності</p>
          <p>📏 Двічі перевірте крок перед заливкою бетону</p>
          <p>⏰ Завершіть заливку протягом 24 годин після монтажу</p>
          <p>🌦️ Захищайте від погоди під час монтажу</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Альтернативи по вартості:</h4>
          <p><strong>Ø10 замість Ø12:</strong> ${(linearMetersWithWaste * 18).toFixed(0)} грн (економія ${(rebarCost - linearMetersWithWaste * 18).toFixed(0)} грн)</p>
          <p><strong>Ø14 замість Ø12:</strong> ${(linearMetersWithWaste * 28).toFixed(0)} грн (додатково ${(linearMetersWithWaste * 28 - rebarCost).toFixed(0)} грн)</p>
          <p>${rebarDiameter > 12 ? '💡 Розгляньте менший діаметр для економії' : '💡 Більший діаметр для важчих навантажень'}</p>
        </div>
      `;
      
      function getProjectTypeName(type) {
        const names = {
          'slab': 'Бетонна плита',
          'footing': 'Стрічковий фундамент',
          'wall': 'Стіна',
          'driveway': 'Під\'їзна доріжка'
        };
        return names[type] || type;
      }
    });
  }
});