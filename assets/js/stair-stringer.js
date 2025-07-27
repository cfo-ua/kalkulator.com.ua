document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('stair-stringer-form');
  const result = document.getElementById('stair-stringer-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const totalRise = parseFloat(document.getElementById('stringer-total-rise').value);
      const totalRun = parseFloat(document.getElementById('stringer-total-run').value);
      const stairWidth = parseFloat(document.getElementById('stringer-width').value);
      const [lumberSize, lumberDepth] = document.getElementById('stringer-lumber').value.split(',');
      const depth = parseFloat(lumberDepth);
      const stairType = document.getElementById('stringer-type').value;
      
      if (totalRise <= 0 || totalRun <= 0 || stairWidth <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate optimal number of risers
      const idealRiserHeight = 160; // mm - comfortable for Ukrainian standards
      const numberOfRisers = Math.round(totalRise / idealRiserHeight);
      const actualRiserHeight = totalRise / numberOfRisers;
      const numberOfTreads = numberOfRisers - 1;
      const treadDepth = totalRun / numberOfTreads;
      
      // Check building code compliance (Ukrainian standards)
      const riserCompliant = actualRiserHeight >= 120 && actualRiserHeight <= 190;
      const treadCompliant = treadDepth >= 250;
      const comfortFormula = (2 * actualRiserHeight + treadDepth);
      const comfortCompliant = comfortFormula >= 600 && comfortFormula <= 650;
      
      // Calculate number of stringers needed
      const stringerSpacing = 400; // mm on center
      const numberOfStringers = Math.floor(stairWidth / stringerSpacing) + 1;
      const actualSpacing = stairWidth / (numberOfStringers - 1);
      
      // Calculate stringer length
      const stringerLength = Math.sqrt(Math.pow(totalRise, 2) + Math.pow(totalRun, 2));
      const stringerLengthMeters = stringerLength / 1000;
      
      // Calculate angle
      const stringerAngle = Math.atan(totalRise / totalRun) * (180 / Math.PI);
      
      // Check if lumber is adequate
      const remainingDepth = depth - actualRiserHeight;
      const adequateDepth = remainingDepth >= 100; // Minimum 100mm remaining for structural integrity
      
      // Calculate materials and costs (Ukrainian prices)
      let stringerCost, treadCost, riserCost, hardwareCost;
      
      switch(lumberSize) {
        case '50x250':
          stringerCost = numberOfStringers * 800; // 800 UAH per 4m board
          break;
        case '50x300':
          stringerCost = numberOfStringers * 1000; // 1000 UAH per 4m board  
          break;
        case '50x350':
          stringerCost = numberOfStringers * 1200; // 1200 UAH per 4m board
          break;
        default:
          stringerCost = numberOfStringers * 1000;
      }
      
      // Tread and riser costs
      const treadArea = (numberOfTreads * treadDepth * stairWidth) / 1000000; // m²
      const riserArea = (numberOfRisers * actualRiserHeight * stairWidth) / 1000000; // m²
      
      treadCost = treadArea * 1200; // 1200 UAH per m² for 40mm boards
      riserCost = riserArea * 800; // 800 UAH per m² for 20mm boards
      hardwareCost = 500; // Misc hardware (screws, brackets, etc.)
      
      const totalCost = stringerCost + treadCost + riserCost + hardwareCost;
      
      // Calculate lumber requirements
      const stringerBoards = numberOfStringers;
      const treadBoards = Math.ceil(treadArea / 0.5); // Assuming 0.5 m² per board
      const riserBoards = Math.ceil(riserArea / 0.3); // Assuming 0.3 m² per board
      
      // Safety and comfort assessments
      let safetyWarnings = [];
      if (!riserCompliant) {
        safetyWarnings.push("⚠️ Висота підсходинки не відповідає нормам (120-190 мм)");
      }
      if (!treadCompliant) {
        safetyWarnings.push("⚠️ Глибина проступу занадто мала (мінімум 250 мм)");
      }
      if (!comfortCompliant) {
        safetyWarnings.push("⚠️ Формула комфорту не виконується (2h + b = 600-650 мм)");
      }
      if (stringerAngle > 40) {
        safetyWarnings.push("⚠️ Занадто крутий кут (рекомендовано до 35°)");
      }
      if (stringerAngle < 25) {
        safetyWarnings.push("⚠️ Занадто пологий кут (рекомендовано від 30°)");
      }
      if (!adequateDepth) {
        safetyWarnings.push("⚠️ Недостатня глибина тетиви після вирізів");
      }
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🏗️ Параметри сходів:</h4>
          <p><strong>Загальна висота:</strong> ${totalRise} мм</p>
          <p><strong>Загальна довжина:</strong> ${totalRun} мм</p>
          <p><strong>Ширина сходів:</strong> ${stairWidth} мм</p>
          <p><strong>Розмір тетиви:</strong> ${lumberSize} мм</p>
          <p><strong>Кут нахилу:</strong> ${stringerAngle.toFixed(1)}°</p>
        </div>
        
        <div class="insight-card">
          <h4>📐 Розрахунок сходинок:</h4>
          <p><strong>Кількість підсходинок:</strong> ${numberOfRisers} шт.</p>
          <p><strong>Висота підсходинки:</strong> ${actualRiserHeight.toFixed(1)} мм</p>
          <p><strong>Кількість проступей:</strong> ${numberOfTreads} шт.</p>
          <p><strong>Глибина проступу:</strong> ${treadDepth.toFixed(1)} мм</p>
          <p><strong>Формула комфорту:</strong> ${comfortFormula.toFixed(0)} мм ${comfortCompliant ? '✅' : '❌'}</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Конструкція тетив:</h4>
          <p><strong>Кількість тетив:</strong> ${numberOfStringers} шт.</p>
          <p><strong>Крок між тетивами:</strong> ${actualSpacing.toFixed(0)} мм</p>
          <p><strong>Довжина тетиви:</strong> ${stringerLengthMeters.toFixed(2)} м</p>
          <p><strong>Залишкова глибина:</strong> ${remainingDepth.toFixed(0)} мм ${adequateDepth ? '✅' : '❌'}</p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Потреба в матеріалах:</h4>
          <p><strong>Тетиви:</strong> ${stringerBoards} дошок ${lumberSize}×4000 мм</p>
          <p><strong>Проступи:</strong> ${treadArea.toFixed(2)} м² (товщина 40 мм)</p>
          <p><strong>Підсходинки:</strong> ${riserArea.toFixed(2)} м² (товщина 20 мм)</p>
          <p><strong>Дошок для проступей:</strong> ${treadBoards} шт.</p>
          <p><strong>Дошок для підсходинок:</strong> ${riserBoards} шт.</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Кошторис:</h4>
          <p><strong>Тетиви:</strong> ${stringerCost} грн</p>
          <p><strong>Проступи:</strong> ${treadCost.toFixed(0)} грн</p>
          <p><strong>Підсходинки:</strong> ${riserCost.toFixed(0)} грн</p>
          <p><strong>Кріплення:</strong> ${hardwareCost} грн</p>
          <p><strong>🔥 Загальна вартість: ${totalCost.toFixed(0)} грн</strong></p>
        </div>
        
        ${safetyWarnings.length > 0 ? `
        <div class="insight-card" style="border-left: 4px solid #ff6b6b;">
          <h4>⚠️ Попередження щодо безпеки:</h4>
          ${safetyWarnings.map(warning => `<p>${warning}</p>`).join('')}
        </div>
        ` : `
        <div class="insight-card" style="border-left: 4px solid #51cf66;">
          <h4>✅ Відповідність нормам:</h4>
          <p>✅ Висота підсходинки: в нормах</p>
          <p>✅ Глибина проступу: достатня</p>
          <p>✅ Формула комфорту: виконується</p>
          <p>✅ Кут нахилу: оптимальний</p>
        </div>
        `}
        
        <div class="insight-card">
          <h4>🔨 Етапи виготовлення:</h4>
          <p>1️⃣ Розмітьте першу тетиву як шаблон</p>
          <p>2️⃣ Вирізайте виступи для проступей і підсходинок</p>
          <p>3️⃣ Використайте першу тетиву як шаблон для інших</p>
          <p>4️⃣ Зашліфуйте всі поверхні</p>
          <p>5️⃣ Встановіть тетиви з правильним кроком</p>
          <p>6️⃣ Закріпіть проступи та підсходинки</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Необхідні інструменти:</h4>
          <p>📐 Кутник та рівень для розмітки</p>
          <p>🪚 Циркулярна пила або лобзик</p>
          <p>🔧 Дриль та шуруповерт</p>
          <p>📏 Рулетка довжиною мін. 5 м</p>
          <p>✏️ Олівець для розмітки</p>
          <p>🧲 Струбцини для фіксації</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Поради професіоналів:</h4>
          <p>📏 Завжди вимірюйте двічі, різайте один раз</p>
          <p>🎯 Використовуйте шаблон для всіх тетив</p>
          <p>⚖️ Перевірте рівень перед остаточним кріпленням</p>
          <p>🔗 Обов'язково закріпіть тетиви до основи</p>
          <p>🎨 Покрийте антисептиком перед збиранням</p>
        </div>
        
        <div class="insight-card">
          <h4>📋 Додаткові матеріали:</h4>
          <p><strong>Саморізи:</strong> 4,5×50 мм для кріплення проступей</p>
          <p><strong>Саморізи:</strong> 3,5×40 мм для підсходинок</p>
          <p><strong>Анкери:</strong> для кріплення до стіни/основи</p>
          <p><strong>Клей:</strong> столярний для додаткової міцності</p>
          <p><strong>Антисептик:</strong> захист від вологи та шкідників</p>
        </div>
        
        <div class="insight-card">
          <h4>🏡 Особливості для різних типів:</h4>
          ${stairType === 'interior' ? `
          <p>🏠 <strong>Внутрішні сходи:</strong></p>
          <p>• Використовуйте сухе дерево (вологість до 12%)</p>
          <p>• Можна використовувати м'які породи (сосна, ялина)</p>
          <p>• Обов'язкове фарбування або лакування</p>
          ` : stairType === 'exterior' ? `
          <p>🌳 <strong>Зовнішні сходи:</strong></p>
          <p>• Використовуйте стійкі породи (дуб, лиственниця)</p>
          <p>• Обробка антисептиком обов'язкова</p>
          <p>• Передбачте дренаж для відводу води</p>
          ` : `
          <p>🏠 <strong>Сходи в підвал:</strong></p>
          <p>• Посилена гідроізоляція</p>
          <p>• Додаткова вентиляція</p>
          <p>• Можуть бути більш круті (до 40°)</p>
          `}
        </div>
      `;
    });
  }
});