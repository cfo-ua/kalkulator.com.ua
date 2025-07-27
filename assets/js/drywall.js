document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('drywall-form');
  const result = document.getElementById('drywall-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const wallArea = parseFloat(document.getElementById('drywall-walls').value);
      const ceilingArea = parseFloat(document.getElementById('drywall-ceiling').value);
      const doors = parseFloat(document.getElementById('drywall-doors').value);
      const windows = parseFloat(document.getElementById('drywall-windows').value);
      const [thickness, pricePerSheet] = document.getElementById('drywall-thickness').value.split(',').map(Number);
      const [sheetArea, sheetHeight] = document.getElementById('drywall-size').value.split(',').map(Number);
      const wasteFactor = parseFloat(document.getElementById('drywall-waste').value);
      
      if (wallArea <= 0 && ceilingArea <= 0) {
        result.textContent = "Будь ласка, введіть площу стін та/або стелі.";
        return;
      }
      
      // Calculate net area
      const doorArea = doors * 2; // Standard door = 2 sq m
      const windowArea = windows * 1.5; // Standard window = 1.5 sq m
      const netWallArea = Math.max(0, wallArea - doorArea - windowArea);
      const totalArea = netWallArea + ceilingArea;
      
      // Calculate sheets needed
      const baseSheets = totalArea / sheetArea;
      const sheetsWithWaste = baseSheets * (1 + wasteFactor);
      const totalSheets = Math.ceil(sheetsWithWaste);
      
      // Calculate joint compound (3 kg per 10 sq m)
      const compoundKg = (totalArea / 10) * 3;
      const compoundBags = Math.ceil(compoundKg / 25); // 25 kg bags
      
      // Calculate tape needed (linear meters of seams)
      // Estimate: 1.2 linear meters of seam per square meter of drywall
      const tapeLinearMeters = totalArea * 1.2;
      const tapeRolls = Math.ceil(tapeLinearMeters / 50); // 50 m rolls
      
      // Calculate screws needed
      const wallScrews = netWallArea * 5; // 50 screws per 10 sq m
      const ceilingScrews = ceilingArea * 7; // 70 screws per 10 sq m
      const totalScrews = Math.ceil((wallScrews + ceilingScrews) / 10) * 10; // round to nearest 10
      const screwBoxes = Math.ceil(totalScrews / 1000); // 1000 pcs boxes
      
      // Calculate corner bead (inside and outside corners)
      // Estimate based on room size
      const roomPerimeter = Math.sqrt(totalArea) * 4; // Rough estimate
      const cornerBeadMeters = roomPerimeter * 0.5; // 50% of perimeter
      const cornerBeadPieces = Math.ceil(cornerBeadMeters / 3); // 3 m pieces
      
      // Calculate costs
      const sheetCost = totalSheets * pricePerSheet;
      const compoundCost = compoundBags * 200; // 200 грн per 25kg bag
      const tapeCost = tapeRolls * 65; // 65 грн per roll
      const screwCost = screwBoxes * 80; // 80 грн per 1000 pcs box
      const cornerBeadCost = cornerBeadPieces * 45; // 45 грн per 3m piece
      const totalMaterialCost = sheetCost + compoundCost + tapeCost + screwCost + cornerBeadCost;
      
      // Labor estimates (Ukrainian rates)
      const hangingHours = totalArea / 8; // ~8 sq m per hour hanging
      const finishingHours = totalArea / 4; // ~4 sq m per hour finishing
      const totalLaborHours = hangingHours + finishingHours;
      const laborCost = totalLaborHours * 250; // 250 грн/hour average
      
      // Coverage rates for different sheet sizes
      const sheetsFor3m2 = Math.ceil(totalArea / 3.0);
      const sheetsFor3_6m2 = Math.ceil(totalArea / 3.6);
      const savings3_6vs3 = (sheetsFor3m2 - sheetsFor3_6m2) * pricePerSheet;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Розрахунки площі:</h4>
          <p>Площа стін: ${wallArea} м²</p>
          <p>Площа стелі: ${ceilingArea} м²</p>
          <p>Мінус двері: ${doorArea} м² (${doors} дверей)</p>
          <p>Мінус вікна: ${windowArea} м² (${windows} вікон)</p>
          <p><strong>Чиста площа для покриття: ${totalArea.toFixed(1)} м²</strong></p>
        </div>
        
        <div class="result-sheets">
          <h4>Листи гіпсокартону:</h4>
          <p><strong>${totalSheets} листів</strong> (${sheetArea} м² кожен)</p>
          <p>Базова потреба: ${baseSheets.toFixed(1)} листів</p>
          <p>Коефіцієнт відходів: ${(wasteFactor * 100)}% (${(sheetsWithWaste - baseSheets).toFixed(1)} додатково)</p>
          <p>Розмір листа: 1,2×${sheetHeight} м (${thickness} мм товщина)</p>
          <p>Покриття: ${(totalSheets * sheetArea).toFixed(1)} м² загалом</p>
        </div>
        
        <div class="result-compound">
          <h4>Шпаклівка та стрічка:</h4>
          <p><strong>${compoundBags} мішків</strong> шпаклівки (25 кг)</p>
          <p>Загальна шпаклівка: ${compoundKg.toFixed(1)} кг потрібно</p>
          <p><strong>${tapeRolls} рулонів</strong> стрічки для швів (50 м рулони)</p>
          <p>Погонні метри стрічки: ${tapeLinearMeters.toFixed(0)} м</p>
        </div>
        
        <div class="result-hardware">
          <h4>Кріплення та аксесуари:</h4>
          <p><strong>${screwBoxes} коробок</strong> саморізів (1000 шт в коробці)</p>
          <p>Довжина саморізів: ${thickness === 12.5 ? '25 мм' : thickness === 15 ? '35 мм' : '20 мм'}</p>
          <p><strong>${cornerBeadPieces} штук</strong> кутового профілю (3 м довжина)</p>
          <p>Кутовий профіль загалом: ${cornerBeadMeters.toFixed(0)} погонних метрів</p>
        </div>
        
        <div class="result-costs">
          <h4>Вартість матеріалів:</h4>
          <p>Листи гіпсокартону: ${sheetCost.toFixed(0)} грн (${totalSheets} × ${pricePerSheet} грн)</p>
          <p>Шпаклівка: ${compoundCost.toFixed(0)} грн (${compoundBags} мішків)</p>
          <p>Стрічка: ${tapeCost.toFixed(0)} грн (${tapeRolls} рулонів)</p>
          <p>Саморізи: ${screwCost.toFixed(0)} грн (${screwBoxes} коробок)</p>
          <p>Кутовий профіль: ${cornerBeadCost.toFixed(0)} грн (${cornerBeadPieces} штук)</p>
          <p><strong>Загальна вартість матеріалів: ${totalMaterialCost.toFixed(0)} грн</strong></p>
        </div>
        
        <div class="result-labor">
          <h4>Оцінка робочого часу:</h4>
          <p>Час на навішування: ${hangingHours.toFixed(1)} годин</p>
          <p>Час на оздоблення: ${finishingHours.toFixed(1)} годин</p>
          <p>Загальний час роботи: ${totalLaborHours.toFixed(1)} годин</p>
          <p>Професійна робота: ${laborCost.toFixed(0)} грн</p>
          <p><strong>Загальна вартість проекту: ${(totalMaterialCost + laborCost).toFixed(0)} грн</strong></p>
        </div>
        
        <div class="result-comparison">
          <h4>Порівняння розмірів листів:</h4>
          <p>Листи 1,2×2,5 м потрібно: ${sheetsFor3m2}</p>
          <p>Листи 1,2×3,0 м потрібно: ${sheetsFor3_6m2}</p>
          <p>Перевага 1,2×3,0 м: на ${sheetsFor3m2 - sheetsFor3_6m2} листів менше</p>
          ${savings3_6vs3 > 0 ? `<p>💰 Економія з 1,2×3,0 м: ${savings3_6vs3.toFixed(0)} грн</p>` : ''}
        </div>
        
        <div class="result-timeline">
          <h4>Графік монтажу:</h4>
          <p><strong>День 1:</strong> Навішування всіх листів гіпсокартону</p>
          <p><strong>День 2:</strong> Армування всіх швів (перший шар)</p>
          <p><strong>День 3:</strong> Другий шар шпаклівки</p>
          <p><strong>День 4:</strong> Фінішний шар та доопрацювання</p>
          <p><strong>День 5:</strong> Шліфування та грунтування</p>
          <p><em>Залишайте 24 години для висихання між шарами</em></p>
        </div>
        
        <div class="result-tools">
          <h4>Необхідні інструменти:</h4>
          <p>🔧 Шуруповерт або дриль</p>
          <p>📐 Кутник та будівельний ніж</p>
          <p>🪚 Пила для гіпсокартону або фрезер</p>
          <p>🔨 Молоток та монтувальна лопатка</p>
          <p>📏 Рулетка та олівець</p>
          <p>🎨 Ванночка для шпаклівки та шпателі (100, 200, 300 мм)</p>
        </div>
        
        <div class="result-tips">
          <h4>Поради для монтажу:</h4>
          <p>📋 Плануйте розкладку листів для мінімізації відходів</p>
          <p>🏠 Встановлюйте спочатку стелю, потім стіни</p>
          <p>🔧 Використовуйте правильну відстань та глибину саморізів</p>
          <p>💧 Накривайте шпаклівку між шарами</p>
          <p>🌡️ Підтримуйте температуру 13-21°C для правильного висихання</p>
        </div>
      `;
    });
  }
});