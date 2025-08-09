document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('retaining-wall-form');
  const result = document.getElementById('retaining-wall-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('wall-length').value);
      const height = parseFloat(document.getElementById('wall-height').value);
      const [blockType, blockSize, blockPrice] = document.getElementById('wall-block-type').value.split(',');
      const soilType = document.getElementById('wall-soil-type').value;
      const loadType = document.getElementById('wall-load').value;
      
      if (length <= 0 || height <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate wall area
      const wallArea = length * height;
      
      // Calculate blocks needed based on type
      let blocksNeeded, blockCost;
      if (blockType === 'stone') {
        // Natural stone calculated by area
        blockCost = wallArea * parseFloat(blockPrice);
        blocksNeeded = `${wallArea.toFixed(1)} м²`;
      } else {
        // Calculate blocks by dimensions
        const [blockLength, blockWidth, blockHeight] = blockSize.split('x').map(x => parseFloat(x) / 1000); // Convert mm to m
        const blocksPerSqM = 1 / (blockLength * blockHeight);
        const totalBlocks = Math.ceil(wallArea * blocksPerSqM);
        const blocksWithWaste = Math.ceil(totalBlocks * 1.05); // 5% waste
        blocksNeeded = `${blocksWithWaste} шт.`;
        blockCost = blocksWithWaste * parseFloat(blockPrice);
      }
      
      // Calculate foundation requirements
      const foundationWidth = Math.max(0.6, height * 0.5); // Foundation width = 1/2 height, min 60cm
      const foundationDepth = Math.max(0.3, height * 0.1 + 0.8); // Depth = 1/10 height + frost depth
      const foundationVolume = length * foundationWidth * foundationDepth;
      const foundationConcrete = foundationVolume * 0.8; // 80% concrete, 20% reinforcement space
      const foundationRebar = foundationVolume * 100; // 100 kg rebar per m³
      
      // Calculate base gravel
      const baseGravelDepth = getBaseDepth(soilType, loadType);
      const baseGravelVolume = length * foundationWidth * baseGravelDepth;
      
      // Calculate backfill materials
      const backfillWidth = Math.min(1.0, height * 0.6); // Backfill width, max 1m
      const drainageGravelVolume = length * backfillWidth * height;
      const topsoilVolume = length * 0.3 * 0.3; // 30cm wide, 30cm deep topsoil
      
      // Calculate geogrid requirements (for walls over 1m)
      const geogridNeeded = height > 1.0;
      const geogridLayers = geogridNeeded ? Math.floor(height / 0.4) : 0; // Every 40cm
      const geogridArea = geogridNeeded ? geogridLayers * length * height * 0.6 : 0;
      
      // Calculate drainage
      const drainagePipeLength = length + (length * 0.1); // 10% extra for connections
      const drainageOutlets = Math.ceil(length / 4); // One outlet every 4m
      
      // Material costs
      const foundationConcreteCost = foundationConcrete * 3500; // 3500 UAH per m³
      const foundationRebarCost = foundationRebar * 22; // 22 UAH per kg
      const baseGravelCost = baseGravelVolume * 1200; // 1200 UAH per m³
      const drainageGravelCost = drainageGravelVolume * 1400; // 1400 UAH per m³
      const topsoilCost = topsoilVolume * 800; // 800 UAH per m³
      const geogridCost = geogridArea * 150; // 150 UAH per m²
      const drainagePipeCost = drainagePipeLength * 65; // 65 UAH per m
      const geotextileCost = drainageGravelVolume * 45; // 45 UAH per m² (approx coverage)
      
      const totalMaterialCost = blockCost + foundationConcreteCost + foundationRebarCost + 
                               baseGravelCost + drainageGravelCost + topsoilCost + 
                               geogridCost + drainagePipeCost + geotextileCost;
      
      // Installation cost estimate
      const installationRate = getInstallationRate(height, blockType);
      const installationCost = wallArea * installationRate;
      
      const totalProjectCost = totalMaterialCost + installationCost;
      
      // Calculate weights for delivery
      const blockWeight = getBlockWeight(blockType, blockSize, blockCost, wallArea);
      const concreteWeight = foundationConcrete * 2400; // kg
      const gravelWeight = (baseGravelVolume + drainageGravelVolume) * 1600; // kg
      const totalWeight = blockWeight + concreteWeight + gravelWeight;
      
      // Installation time estimate
      const installationDays = Math.ceil(wallArea / getProductivityRate(height));
      
      // Engineering requirements
      const engineeringRequired = height > 1.0 || loadType === 'heavy';
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🏗️ Параметри підпірної стіни:</h4>
          <p><strong>Розміри:</strong> ${length} м × ${height} м</p>
          <p><strong>Площа стіни:</strong> ${wallArea.toFixed(1)} м²</p>
          <p><strong>Тип блоків:</strong> ${getBlockTypeName(blockType)}</p>
          <p><strong>Тип ґрунту:</strong> ${getSoilTypeName(soilType)}</p>
          <p><strong>Навантаження:</strong> ${getLoadTypeName(loadType)}</p>
        </div>
        
        <div class="insight-card">
          <h4>🧱 Блоки для стіни:</h4>
          <p><strong>Потрібно блоків:</strong> ${blocksNeeded}</p>
          <p><strong>Вартість блоків:</strong> ${blockCost.toFixed(0)} грн</p>
          ${blockType !== 'stone' ? '<p><strong>Запас на бій:</strong> 5% включено</p>' : ''}
        </div>
        
        <div class="insight-card">
          <h4>🏗️ Фундамент:</h4>
          <p><strong>Розміри фундаменту:</strong> ${foundationWidth.toFixed(1)}×${foundationDepth.toFixed(1)} м</p>
          <p><strong>Об'єм бетону:</strong> ${foundationConcrete.toFixed(2)} м³</p>
          <p><strong>Арматура:</strong> ${foundationRebar.toFixed(0)} кг</p>
          <p><strong>Вартість фундаменту:</strong> ${(foundationConcreteCost + foundationRebarCost).toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>🏗️ Основні матеріали:</h4>
          <p><strong>Щебінь під фундамент:</strong> ${baseGravelVolume.toFixed(2)} м³</p>
          <p><strong>Дренажний щебінь:</strong> ${drainageGravelVolume.toFixed(2)} м³</p>
          <p><strong>Родючий ґрунт:</strong> ${topsoilVolume.toFixed(2)} м³</p>
          <p><strong>Геотекстиль:</strong> ${drainageGravelVolume.toFixed(1)} м²</p>
        </div>
        
        ${geogridNeeded ? `
        <div class="insight-card">
          <h4>🔗 Армування (геосітка):</h4>
          <p><strong>Кількість шарів:</strong> ${geogridLayers}</p>
          <p><strong>Площа геосітки:</strong> ${geogridArea.toFixed(1)} м²</p>
          <p><strong>Вартість геосітки:</strong> ${geogridCost.toFixed(0)} грн</p>
          <p><strong>Примітка:</strong> Обов'язково для стін вище 1 м</p>
        </div>
        ` : ''}
        
        <div class="insight-card">
          <h4>💧 Дренажна система:</h4>
          <p><strong>Дренажні труби:</strong> ${drainagePipeLength.toFixed(1)} м</p>
          <p><strong>Дренажні виходи:</strong> ${drainageOutlets} шт.</p>
          <p><strong>Вартість дренажу:</strong> ${drainagePipeCost.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Кошторис проекту:</h4>
          <p><strong>Блоки/камінь:</strong> ${blockCost.toFixed(0)} грн</p>
          <p><strong>Фундамент:</strong> ${(foundationConcreteCost + foundationRebarCost).toFixed(0)} грн</p>
          <p><strong>Щебінь та ґрунт:</strong> ${(baseGravelCost + drainageGravelCost + topsoilCost).toFixed(0)} грн</p>
          ${geogridNeeded ? `<p><strong>Геосітка:</strong> ${geogridCost.toFixed(0)} грн</p>` : ''}
          <p><strong>Дренаж:</strong> ${(drainagePipeCost + geotextileCost).toFixed(0)} грн</p>
          <p><strong>💳 Матеріали разом: ${totalMaterialCost.toFixed(0)} грн</strong></p>
          <p><strong>Робота:</strong> ${installationCost.toFixed(0)} грн</p>
          <p><strong>🔥 Загальна вартість: ${totalProjectCost.toFixed(0)} грн</strong></p>
          <p><strong>Вартість за м²:</strong> ${(totalProjectCost / wallArea).toFixed(0)} грн</p>
        </div>
        
        ${engineeringRequired ? `
        <div class="insight-card" style="border-left: 4px solid #ff6b6b;">
          <h4>⚠️ Інженерні вимоги:</h4>
          <p>🏗️ Потрібен проект інженера-конструктора</p>
          <p>📋 Необхідні дозволи на будівництво</p>
          <p>🔍 Потрібно дослідження ґрунту</p>
          <p>💰 Додаткова вартість проектування: 5000-15000 грн</p>
        </div>
        ` : `
        <div class="insight-card" style="border-left: 4px solid #51cf66;">
          <h4>✅ Можна будувати самостійно:</h4>
          <p>✅ Не потребує спеціального проектування</p>
          <p>✅ Дозволи не обов'язкові</p>
          <p>✅ DIY-friendly конструкція</p>
        </div>
        `}
        
        <div class="insight-card">
          <h4>⏱️ Терміни виконання:</h4>
          <p><strong>Земляні роботи:</strong> 1-2 дні</p>
          <p><strong>Фундамент:</strong> 2-3 дні + 7 днів набору міцності</p>
          <p><strong>Укладання блоків:</strong> ${installationDays} днів</p>
          <p><strong>Дренаж та засипка:</strong> 1-2 дні</p>
          <p><strong>Загальний термін:</strong> ${installationDays + 12} днів</p>
        </div>
        
        <div class="insight-card">
          <h4>🚚 Доставка:</h4>
          <p><strong>Загальна вага:</strong> ${totalWeight.toFixed(0)} кг</p>
          <p><strong>Рекомендації:</strong> ${getDeliveryRecommendation(totalWeight)}</p>
          <p><strong>Габарити:</strong> блоки стандартних розмірів</p>
          <p><strong>Бетон:</strong> міксер або готова суміш</p>
        </div>
        
        <div class="insight-card">
          <h4>🔨 Етапи будівництва:</h4>
          <p>1️⃣ Розмітка та земляні роботи</p>
          <p>2️⃣ Підготовка щебеневої подушки</p>
          <p>3️⃣ Заливка фундаменту з арматурою</p>
          <p>4️⃣ Укладання перших рядів блоків</p>
          <p>5️⃣ Монтаж дренажної системи</p>
          <p>6️⃣ Укладання геосітки (при потребі)</p>
          <p>7️⃣ Завершення стіни та засипка</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Необхідне обладнання:</h4>
          <p>🚧 Міні-екскаватор або лопати</p>
          <p>🏗️ Вібраційна плита</p>
          <p>🏗️ Рівень та теодоліт</p>
          <p>🚛 Підйомний кран (для важких блоків)</p>
          <p>🔧 Інструменти для різання блоків</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Поради професіоналів:</h4>
          <p>📐 Дотримуйтесь нахилу стіни 1-2° назад</p>
          <p>💧 Ніколи не економте на дренажі</p>
          <p>🧱 Робіть перев'язку швів між рядами</p>
          <p>⚖️ Ущільнюйте кожен шар засипки</p>
          <p>🌡️ Не працюйте з бетоном при температурі нижче +5°C</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Обслуговування:</h4>
          <p><strong>Огляд:</strong> двічі на рік (весна/осінь)</p>
          <p><strong>Дренаж:</strong> очищення від листя та мулу</p>
          <p><strong>Рослинність:</strong> контроль росту коренів</p>
          <p><strong>Деформації:</strong> моніторинг нахилів та тріщин</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Альтернативи по бюджету:</h4>
          <p><strong>Економ (бетонні блоки):</strong> ${(wallArea * 800).toFixed(0)} грн/м²</p>
          <p><strong>Стандарт (декоративні):</strong> ${(wallArea * 1200).toFixed(0)} грн/м²</p>
          <p><strong>Преміум (природний камінь):</strong> ${(wallArea * 2000).toFixed(0)} грн/м²</p>
        </div>
      `;
      
      function getBlockTypeName(type) {
        const types = {
          'standard': 'Стандартні бетонні блоки',
          'large': 'Великі бетонні блоки',
          'decorative': 'Декоративні блоки',
          'stone': 'Природний камінь'
        };
        return types[type] || type;
      }
      
      function getSoilTypeName(type) {
        const types = {
          'stable': 'Стабільний',
          'medium': 'Середній',
          'unstable': 'Нестабільний'
        };
        return types[type] || type;
      }
      
      function getLoadTypeName(type) {
        const types = {
          'none': 'Немає навантаження',
          'light': 'Легке навантаження',
          'medium': 'Середнє навантаження',
          'heavy': 'Важке навантаження'
        };
        return types[type] || type;
      }
      
      function getBaseDepth(soilType, loadType) {
        let depth = 0.15; // Base 15cm
        if (soilType === 'unstable') depth += 0.15;
        if (loadType === 'heavy') depth += 0.10;
        return depth;
      }
      
      function getInstallationRate(height, blockType) {
        let rate = 800; // Base rate UAH per m²
        if (height > 1.5) rate += 200;
        if (blockType === 'stone') rate += 300;
        return rate;
      }
      
      function getBlockWeight(blockType, blockSize, blockCost, wallArea) {
        if (blockType === 'stone') {
          return wallArea * 150; // Approximate stone weight per m²
        } else {
          // Calculate approximate weight for concrete blocks
          const blockVolume = blockSize.split('x').reduce((a, b) => a * (parseFloat(b)/1000), 1);
          const blocksCount = blockCost / parseFloat(document.getElementById('wall-block-type').value.split(',')[2]);
          return blocksCount * blockVolume * 2400; // Concrete density
        }
      }
      
      function getProductivityRate(height) {
        // m² per day
        return height > 1.5 ? 8 : 12;
      }
      
      function getDeliveryRecommendation(weight) {
        if (weight < 3000) {
          return 'Можна доставити пікапом за кілька рейсів';
        } else if (weight < 8000) {
          return 'Потрібна вантажівка';
        } else {
          return 'Необхідна велика вантажівка або кран-маніпулятор';
        }
      }
    });
  }
});