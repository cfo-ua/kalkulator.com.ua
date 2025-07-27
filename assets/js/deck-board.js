document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('deck-board-form');
  const result = document.getElementById('deck-board-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('deck-length').value);
      const width = parseFloat(document.getElementById('deck-width').value);
      const [boardType, boardWidth] = document.getElementById('deck-board-type').value.split(',');
      const joistSpacing = parseFloat(document.getElementById('deck-joist-spacing').value) / 1000; // Convert to meters
      const materialPrice = parseFloat(document.getElementById('deck-material').value);
      const deckHeight = parseFloat(document.getElementById('deck-height').value) / 100; // Convert to meters
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate deck area
      const deckArea = length * width;
      
      // Calculate deck boards needed
      const boardWidthMeters = parseFloat(boardWidth) / 1000; // Convert mm to meters
      const boardsNeeded = Math.ceil(width / boardWidthMeters);
      const totalBoardLength = boardsNeeded * length;
      
      // Add 10% waste for cuts and defects
      const totalBoardLengthWithWaste = totalBoardLength * 1.1;
      
      // Calculate number of standard 6m boards needed
      const standardBoardLength = 6; // meters
      const standardBoardsNeeded = Math.ceil(totalBoardLengthWithWaste / standardBoardLength);
      
      // Calculate joists needed
      const joistsNeeded = Math.floor(length / joistSpacing) + 1;
      const joistLength = width + 0.1; // Add 10cm overhang
      const totalJoistLength = joistsNeeded * joistLength;
      
      // Calculate rim joists (perimeter)
      const rimJoistLength = 2 * (length + width);
      
      // Calculate posts and beams (simplified calculation)
      const postSpacing = 2.0; // meters
      const postsPerBeam = Math.floor(width / postSpacing) + 1;
      const beamRows = Math.floor(length / 3) + 1; // Beam every 3 meters
      const totalPosts = postsPerBeam * beamRows;
      const totalBeamLength = beamRows * width;
      
      // Calculate hardware costs
      const screwsNeeded = Math.ceil(boardsNeeded * length / 0.3); // One screw every 30cm
      const lagScrewsNeeded = joistsNeeded * 2; // Two lag screws per joist
      const postAnchors = totalPosts;
      
      // Material costs calculation
      const deckBoardCost = deckArea * materialPrice;
      const joistCost = (totalJoistLength + rimJoistLength) * 50; // 50 UAH per linear meter for 50x150 lumber
      const beamCost = totalBeamLength * 80; // 80 UAH per linear meter for 100x200 lumber
      const postCost = totalPosts * 150; // 150 UAH per post (100x100x2500)
      const hardwareCost = (screwsNeeded * 2) + (lagScrewsNeeded * 15) + (postAnchors * 50);
      
      const totalMaterialCost = deckBoardCost + joistCost + beamCost + postCost + hardwareCost;
      
      // Calculate foundation requirements
      const foundationHoles = totalPosts;
      const concretePerHole = 0.05; // 50 liters per hole
      const totalConcrete = foundationHoles * concretePerHole;
      const foundationCost = totalConcrete * 150; // 150 UAH per 50L bag
      
      // Total project cost
      const totalProjectCost = totalMaterialCost + foundationCost;
      
      // Calculate weights for delivery
      const deckBoardWeight = totalBoardLengthWithWaste * getBoardWeight(boardType);
      const frameWeight = (totalJoistLength + rimJoistLength + totalBeamLength) * 10; // ~10 kg per linear meter
      const totalWeight = deckBoardWeight + frameWeight;
      
      // Installation time estimate
      const installationDays = Math.ceil(deckArea / 15); // 15 m² per day estimate
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🏗️ Параметри терас:</h4>
          <p><strong>Розміри:</strong> ${length} м × ${width} м</p>
          <p><strong>Площа:</strong> ${deckArea.toFixed(1)} м²</p>
          <p><strong>Тип дошок:</strong> ${getBoardTypeName(boardType)}</p>
          <p><strong>Крок лаг:</strong> ${joistSpacing * 1000} мм</p>
          <p><strong>Висота:</strong> ${deckHeight * 100} см</p>
        </div>
        
        <div class="insight-card">
          <h4>📏 Терасні дошки:</h4>
          <p><strong>Кількість дощок:</strong> ${boardsNeeded} шт.</p>
          <p><strong>Загальна довжина:</strong> ${totalBoardLength.toFixed(1)} м</p>
          <p><strong>З запасом (10%):</strong> ${totalBoardLengthWithWaste.toFixed(1)} м</p>
          <p><strong>Стандартних дощок 6м:</strong> ${standardBoardsNeeded} шт.</p>
          <p><strong>Вага дощок:</strong> ${deckBoardWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Каркас терас:</h4>
          <p><strong>Лаги (50×150):</strong> ${joistsNeeded} шт. × ${joistLength.toFixed(1)} м</p>
          <p><strong>Обвідні дошки:</strong> ${rimJoistLength.toFixed(1)} м</p>
          <p><strong>Балки (100×200):</strong> ${totalBeamLength.toFixed(1)} м</p>
          <p><strong>Стовпи (100×100):</strong> ${totalPosts} шт.</p>
          <p><strong>Вага каркасу:</strong> ${frameWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>🔩 Кріплення та фурнітура:</h4>
          <p><strong>Саморізи терасні:</strong> ${screwsNeeded} шт.</p>
          <p><strong>Лагові гвинти:</strong> ${lagScrewsNeeded} шт.</p>
          <p><strong>Анкери для стовпів:</strong> ${postAnchors} шт.</p>
          <p><strong>Вартість кріплень:</strong> ${hardwareCost.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>🏗️ Фундамент:</h4>
          <p><strong>Ямки під стовпи:</strong> ${foundationHoles} шт.</p>
          <p><strong>Розмір ямок:</strong> 40×40×60 см</p>
          <p><strong>Бетон потрібно:</strong> ${totalConcrete.toFixed(1)} мішків (50л)</p>
          <p><strong>Вартість фундаменту:</strong> ${foundationCost.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Кошторис проекту:</h4>
          <p><strong>Терасні дошки:</strong> ${deckBoardCost.toFixed(0)} грн</p>
          <p><strong>Лаги та обвідні:</strong> ${joistCost.toFixed(0)} грн</p>
          <p><strong>Балки:</strong> ${beamCost.toFixed(0)} грн</p>
          <p><strong>Стовпи:</strong> ${postCost.toFixed(0)} грн</p>
          <p><strong>Кріплення:</strong> ${hardwareCost.toFixed(0)} грн</p>
          <p><strong>Фундамент:</strong> ${foundationCost.toFixed(0)} грн</p>
          <p><strong>🔥 Загальна вартість: ${totalProjectCost.toFixed(0)} грн</strong></p>
          <p><strong>Вартість за м²:</strong> ${(totalProjectCost / deckArea).toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>⏱️ Час виконання:</h4>
          <p><strong>Підготовка фундаменту:</strong> 1-2 дні</p>
          <p><strong>Монтаж каркасу:</strong> 1-2 дні</p>
          <p><strong>Настил дощок:</strong> ${installationDays} днів</p>
          <p><strong>Загальний час:</strong> ${installationDays + 3} робочих днів</p>
        </div>
        
        <div class="insight-card">
          <h4>🚚 Доставка:</h4>
          <p><strong>Загальна вага:</strong> ${totalWeight.toFixed(0)} кг</p>
          <p><strong>Рекомендації:</strong> ${totalWeight > 1000 ? 'Потрібна вантажівка' : 'Можна доставити пікапом'}</p>
          <p><strong>Габарити:</strong> дошки до 6 м довжиною</p>
          <p><strong>Розвантаження:</strong> краще близько до місця будівництва</p>
        </div>
        
        <div class="insight-card">
          <h4>🔨 Етапи будівництва:</h4>
          <p>1️⃣ Розмітка та підготовка місця</p>
          <p>2️⃣ Викопування ямок під стовпи</p>
          <p>3️⃣ Встановлення стовпів з бетонуванням</p>
          <p>4️⃣ Монтаж балок та лаг</p>
          <p>5️⃣ Настил терасних дощок</p>
          <p>6️⃣ Фінішна обробка та захист</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Необхідні інструменти:</h4>
          <p>🪚 Циркулярна пила або торцьовка</p>
          <p>🔧 Шуруповерт з бітами для терасних саморізів</p>
          <p>📏 Рулетка довжиною мін. 8 м</p>
          <p>📐 Кутник будівельний</p>
          <p>⚒️ Молоток</p>
          <p>🔍 Рівень будівельний</p>
          <p>⛏️ Лопата для ямок</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Поради по будівництву:</h4>
          <p>📐 Залиште зазор 5-8 мм між дошками для дренажу</p>
          <p>🌡️ Будуйте при температурі +5°C і вище</p>
          <p>💧 Передбачте нахил 1-2° для стоку води</p>
          <p>🎯 Використовуйте спеціальні терасні саморізи</p>
          <p>🛡️ Обробіть деревину антисептиком до монтажу</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Обслуговування терас:</h4>
          ${getMaterialMaintenance(materialPrice)}
        </div>
        
        <div class="insight-card">
          <h4>💰 Альтернативи по бюджету:</h4>
          <p><strong>Економ варіант:</strong> ${(deckArea * 800).toFixed(0)} грн (імпрегнована сосна)</p>
          <p><strong>Преміум варіант:</strong> ${(deckArea * 3500).toFixed(0)} грн (композит преміум)</p>
          <p><strong>Різниця з поточним:</strong> ${materialPrice > 1500 ? 
            `економія ${(deckBoardCost - deckArea * 800).toFixed(0)} грн при виборі сосни` : 
            `додатково ${(deckArea * 3500 - deckBoardCost).toFixed(0)} грн за преміум композит`}</p>
        </div>
      `;
      
      function getBoardTypeName(type) {
        const types = {
          '32x140': 'Дерев\'яні 32×140 мм',
          '40x140': 'Дерев\'яні 40×140 мм',
          'composite': 'Композитні 25×140 мм'
        };
        return types[type] || type;
      }
      
      function getBoardWeight(type) {
        // Weight per linear meter in kg
        const weights = {
          '32x140': 2.2,  // Wood density ~500 kg/m³
          '40x140': 2.8,
          'composite': 3.5 // Composite is heavier
        };
        return weights[type] || 2.5;
      }
      
      function getMaterialMaintenance(price) {
        if (price <= 1200) {
          return `
            <p><strong>Імпрегнована деревина:</strong></p>
            <p>🎨 Покриття маслом/лаком кожні 2-3 роки</p>
            <p>🧹 Регулярне прибирання та миття</p>
            <p>🔍 Перевірка кріплень щорічно</p>
          `;
        } else if (price <= 2000) {
          return `
            <p><strong>Лиственниця/кедр:</strong></p>
            <p>🎨 Покриття маслом кожні 3-5 років</p>
            <p>🧹 Прибирання зі спеціальними засобами</p>
            <p>🛡️ Природна стійкість до вологи</p>
          `;
        } else {
          return `
            <p><strong>Композитний настил:</strong></p>
            <p>🧹 Тільки регулярне миття водою</p>
            <p>❌ Не потребує фарбування чи обробки</p>
            <p>⚡ Мінімальне обслуговування</p>
          `;
        }
      }
    });
  }
});