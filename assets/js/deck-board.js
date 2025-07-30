document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('deck-board-form');
  const result = document.getElementById('deck-board-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('deck-length').value);
      const width = parseFloat(document.getElementById('deck-width').value);
      const [boardType, boardWidth] = document.getElementById('deck-board-type').value.split(',');
      const boardLength = parseFloat(document.getElementById('deck-board-length')?.value || 4);
      const joistSpacing = parseFloat(document.getElementById('deck-joist-spacing').value) / 1000; // Convert to meters
      const materialPrice = parseFloat(document.getElementById('deck-material').value);
      const deckHeight = parseFloat(document.getElementById('deck-height').value) / 100; // Convert to meters
      const includeRailings = document.getElementById('include-railings')?.checked || false;
      
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
      
      // Calculate number of standard boards needed
      const standardBoardsNeeded = Math.ceil(totalBoardLengthWithWaste / boardLength);
      
      // Calculate joists needed
      const joistsNeeded = Math.floor(length / joistSpacing) + 1;
      const joistLength = width + 0.2; // Add 20cm overhang
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
      
      // Enhanced cost calculations
      const deckBoardCost = deckArea * materialPrice;
      const joistCost = (totalJoistLength + rimJoistLength) * 60; // Updated pricing
      const beamCost = totalBeamLength * 90; // Updated pricing
      const postCost = totalPosts * 180; // Updated pricing
      const hardwareCost = (screwsNeeded * 2.5) + (lagScrewsNeeded * 18) + (postAnchors * 60);
      const foundationCost = totalPosts * 250; // Enhanced foundation cost
      
      // Railing cost calculation (Ukrainian pricing)
      const railingPerimeter = includeRailings ? (2 * (length + width)) - 2 : 0; // Assume 2m opening
      const railingCost = railingPerimeter * 650; // 650 UAH per linear meter
      
      const totalMaterialCost = deckBoardCost + joistCost + beamCost + postCost + hardwareCost + foundationCost + railingCost;
      
      // Calculate weights for delivery
      const deckBoardWeight = totalBoardLengthWithWaste * getBoardWeight(boardType);
      const frameWeight = (totalJoistLength + rimJoistLength + totalBeamLength) * 12; // ~12 kg per linear meter
      const totalWeight = deckBoardWeight + frameWeight;
      
      // Installation time estimate
      const installationDays = Math.ceil(deckArea / 12); // 12 m² per day estimate for Ukraine
      
      // Cost per square meter
      const costPerSqMeter = totalMaterialCost / deckArea;
      
      // Labor cost estimate
      const laborCost = deckArea * 500; // 500 UAH per sq meter average
      const totalProjectCost = totalMaterialCost + laborCost;
      
      // Get material type name
      const materialTypes = {
        1000: "Імпрегнована сосна",
        1800: "Лиственниця",
        2500: "Кедр",
        3000: "Дуб",
        2200: "Композит ДПК",
        3500: "Композит преміум"
      };
      const materialTypeName = materialTypes[materialPrice];

      result.innerHTML = `
        <div class="cost-summary">
          <h3>💰 Калькулятор вартості терас - Результати</h3>
          <div class="cost-highlight">
            <h4>Тераса ${length} м × ${width} м (${deckArea.toFixed(1)} м²)</h4>
            <p><strong>Вартість матеріалів: ${totalMaterialCost.toFixed(0)} грн</strong> (${materialTypeName})</p>
            <p><strong>Вартість за м²: ${costPerSqMeter.toFixed(0)} грн</strong></p>
            <p>Орієнтовна робота: ${laborCost.toFixed(0)} грн | <strong>Загальний проект: ${totalProjectCost.toFixed(0)} грн</strong></p>
          </div>
        </div>
        
        <div class="insight-card">
          <h4>📏 Скільки терасних дощок потрібно:</h4>
          <p><strong>Кількість дощок: ${boardsNeeded} шт.</strong> (${boardLength} м довжиною)</p>
          <p>Базова потреба: ${Math.ceil(totalBoardLength / boardLength)} дощок</p>
          <p>З урахуванням запасу: ${standardBoardsNeeded} дощок (10% запас)</p>
          <p>Загальна довжина: ${totalBoardLengthWithWaste.toFixed(1)} пог.м</p>
          <p>Вага дощок: ${deckBoardWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Каркас терас:</h4>
          <p><strong>Лаги (50×150):</strong> ${joistsNeeded} шт. × ${joistLength.toFixed(1)} м</p>
          <p>Крок лаг: ${(joistSpacing * 1000).toFixed(0)} мм</p>
          <p><strong>Обвідні дошки:</strong> ${rimJoistLength.toFixed(1)} пог.м</p>
          <p><strong>Балки (100×200):</strong> ${totalBeamLength.toFixed(1)} пог.м</p>
          <p><strong>Стовпи (100×100):</strong> ${totalPosts} шт.</p>
          <p><strong>Вага каркасу:</strong> ${frameWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>🔩 Кріплення та фурнітура:</h4>
          <p><strong>Саморізи терасні:</strong> ${screwsNeeded} шт.</p>
          <p><strong>Лагові гвинти:</strong> ${lagScrewsNeeded} шт.</p>
          <p><strong>Анкери для стовпів:</strong> ${postAnchors} шт.</p>
          <p><strong>Вартість кріплень:</strong> ${hardwareCost.toFixed(0)} грн</p>
          ${includeRailings ? `<p><strong>Перила:</strong> ${railingPerimeter} пог.м</p>` : ''}
        </div>
        
        <div class="insight-card">
          <h4>💵 Детальний кошторис:</h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td>Терасні дошки (${materialTypeName})</td><td style="text-align:right"><strong>${deckBoardCost.toFixed(0)} грн</strong></td></tr>
            <tr><td>Лаги та обвідні</td><td style="text-align:right">${joistCost.toFixed(0)} грн</td></tr>
            <tr><td>Балки та стовпи</td><td style="text-align:right">${(beamCost + postCost).toFixed(0)} грн</td></tr>
            <tr><td>Кріплення</td><td style="text-align:right">${hardwareCost.toFixed(0)} грн</td></tr>
            <tr><td>Фундамент (бетон)</td><td style="text-align:right">${foundationCost.toFixed(0)} грн</td></tr>
            ${includeRailings ? `<tr><td>Перила</td><td style="text-align:right">${railingCost.toFixed(0)} грн</td></tr>` : ''}
            <tr style="border-top: 2px solid #333; font-weight: bold;"><td>Всього матеріалів</td><td style="text-align:right">${totalMaterialCost.toFixed(0)} грн</td></tr>
          </table>
          <p><em>Ціни можуть відрізнятися залежно від регіону та постачальника.</em></p>
        </div>
        
        <div class="insight-card">
          <h4>🔄 Порівняння матеріалів для терас ${deckArea.toFixed(1)} м²:</h4>
          <p>Імпрегнована сосна: ${(deckArea * 1000 + joistCost + beamCost + postCost + hardwareCost + foundationCost).toFixed(0)} грн (найдешевше)</p>
          <p>Лиственниця: ${(deckArea * 1800 + joistCost + beamCost + postCost + hardwareCost + foundationCost).toFixed(0)} грн (природна краса)</p>
          <p>Композит ДПК: ${(deckArea * 2200 + joistCost + beamCost + postCost + hardwareCost + foundationCost).toFixed(0)} грн (мало обслуговування)</p>
          <p>Композит преміум: ${(deckArea * 3500 + joistCost + beamCost + postCost + hardwareCost + foundationCost).toFixed(0)} грн (найкраща якість)</p>
        </div>
        
        <div class="insight-card">
          <h4>⏱️ Час виконання робіт:</h4>
          <p><strong>Підготовка фундаменту:</strong> 1-2 дні</p>
          <p><strong>Монтаж каркасу:</strong> 1-2 дні</p>
          <p><strong>Настил дощок:</strong> ${installationDays} днів</p>
          <p><strong>Загальний час:</strong> ${installationDays + 3} робочих днів</p>
          <p><strong>Професійна бригада:</strong> 2-4 дні для всього проекту</p>
        </div>
        
        <div class="insight-card">
          <h4>🚚 Доставка та логістика:</h4>
          <p><strong>Загальна вага:</strong> ${totalWeight.toFixed(0)} кг</p>
          <p><strong>Рекомендації:</strong> ${totalWeight > 1500 ? 'Потрібна вантажівка або кілька поїздок' : 'Можна доставити пікапом'}</p>
          <p><strong>Габарити:</strong> дошки до ${boardLength} м довжиною</p>
          <p><strong>Вартість доставки:</strong> 500-2000 грн залежно від відстані</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Поради по будівництву:</h4>
          <p>📐 <strong>Композитний настил:</strong> Потребує максимум 400 мм крок лаг</p>
          <p>🏠 <strong>Дозволи:</strong> Терасам вище 30 см можуть знадобитися дозволи</p>
          <p>📦 <strong>Замовлення:</strong> Замовляйте всі дошки з однієї партії для однакового кольору</p>
          <p>⏰ <strong>Сезон:</strong> Найкраще будувати з квітня по жовтень</p>
          <p>🔧 <strong>Інструменти:</strong> Циркулярка, шуруповерт, рівень, рулетка</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Обслуговування терас:</h4>
          ${getMaterialMaintenance(materialPrice)}
        </div>
        
        <div class="insight-card">
          <h4>🎯 Наступні кроки для проекту:</h4>
          <ol>
            <li>Перевірте місцеві будівельні норми та отримайте дозволи</li>
            <li>Отримайте кошториси від місцевих постачальників пиломатеріалів</li>
            <li>Розгляньте найняття професіоналів для фундаментних робіт</li>
            <li>Сплануйте комунікації (електрика, сантехніка) до початку будівництва</li>
            <li>Запланируйте доставку за 2-3 дні до початку будівництва</li>
          </ol>
        </div>
      `;
      
      function getBoardTypeName(type) {
        const types = {
          '32x140': 'Дерев\'яні 32×140 мм',
          '40x140': 'Дерев\'яні 40×140 мм',
          'composite': 'Композитні 25×140 мм',
          'composite-premium': 'Композит преміум 32×140 мм'
        };
        return types[type] || type;
      }
      
      function getBoardWeight(type) {
        // Weight per linear meter in kg
        const weights = {
          '32x140': 2.2,  // Wood density ~500 kg/m³
          '40x140': 2.8,
          'composite': 3.5, // Composite is heavier
          'composite-premium': 3.8
        };
        return weights[type] || 2.5;
      }
      
      function getMaterialMaintenance(price) {
        if (price <= 1800) {
          return `
            <p><strong>Дерев'яні терасні дошки:</strong></p>
            <p>🎨 Покриття маслом/лаком кожні 2-3 роки</p>
            <p>🧹 Регулярне прибирання та миття</p>
            <p>🔍 Перевірка кріплень щорічно</p>
            <p>💰 Витрати на обслуговування: 200-500 грн/рік</p>
          `;
        } else {
          return `
            <p><strong>Композитний настил:</strong></p>
            <p>🧹 Тільки регулярне миття водою з милом</p>
            <p>❌ Не потребує фарбування чи обробки маслом</p>
            <p>⚡ Мінімальне обслуговування</p>
            <p>💰 Витрати на обслуговування: 50-100 грн/рік</p>
          `;
        }
      }
    });
  }
});