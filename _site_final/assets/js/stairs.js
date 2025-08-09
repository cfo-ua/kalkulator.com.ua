document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('stairs-form');
  const result = document.getElementById('stairs-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const totalRise = parseFloat(document.getElementById('stairs-total-rise').value);
      const totalRun = parseFloat(document.getElementById('stairs-total-run').value);
      const desiredRiser = parseFloat(document.getElementById('stairs-riser').value);
      const desiredTread = parseFloat(document.getElementById('stairs-tread').value);
      
      if (totalRise <= 0 || desiredRiser <= 0 || desiredTread <= 0) {
        result.textContent = "Будь ласка, введіть всі розміри з позитивними значеннями.";
        return;
      }
      
      // Calculate optimal number of steps
      const numberOfSteps = Math.round(totalRise / desiredRiser);
      const actualRiser = totalRise / numberOfSteps;
      const actualTotalRun = (numberOfSteps - 1) * desiredTread;
      
      // Check building code compliance (Ukrainian standards)
      const riserCompliant = actualRiser >= 14 && actualRiser <= 19;
      const treadCompliant = desiredTread >= 25;
      const proportionFormula1 = actualRiser + desiredTread; // Should be 43-46
      const proportionFormula2 = (2 * actualRiser) + desiredTread; // Should be 60-64
      
      // Check if stairs fit in available space
      const fitsInSpace = totalRun ? actualTotalRun <= totalRun : true;
      const spaceExcess = totalRun ? totalRun - actualTotalRun : 0;
      
      // Generate warnings/recommendations
      let warnings = [];
      let recommendations = [];
      
      if (!riserCompliant) {
        warnings.push(`⚠️ Висота підйому ${actualRiser.toFixed(1)} см поза межами норм (14-19 см)`);
      }
      if (!treadCompliant) {
        warnings.push(`⚠️ Глибина проступу ${desiredTread} см нижче мінімуму (25 см)`);
      }
      if (proportionFormula1 < 43 || proportionFormula1 > 46) {
        recommendations.push(`📐 Підйом + Хід = ${proportionFormula1.toFixed(1)} см (ідеально: 43-46 см)`);
      }
      if (proportionFormula2 < 60 || proportionFormula2 > 64) {
        recommendations.push(`📐 2×Підйом + Хід = ${proportionFormula2.toFixed(1)} см (ідеально: 60-64 см)`);
      }
      if (!fitsInSpace) {
        warnings.push(`🚧 Сходам потрібно ${actualTotalRun.toFixed(1)} см, але доступно лише ${totalRun} см`);
      }
      
      // Calculate angles
      const stairAngle = Math.atan(actualRiser / desiredTread) * (180 / Math.PI);
      
      // Calculate materials needed
      const stringerLength = Math.sqrt(Math.pow(actualTotalRun, 2) + Math.pow(totalRise, 2));
      const treadBoardFeet = (numberOfSteps - 1) * (desiredTread / 100) * 0.3 * 0.05; // Approximate board feet
      const riserBoardFeet = numberOfSteps * (actualRiser / 100) * 0.3 * 0.018; // 18mm plywood
      
      // Cost estimates (Ukrainian prices)
      const stringerCost = 2 * 800; // 2 stringers @ 800 UAH each
      const treadCost = (numberOfSteps - 1) * 150; // Oak treads @ 150 UAH each
      const riserCost = numberOfSteps * 80; // Plywood risers @ 80 UAH each
      const hardwareCost = 500; // Screws, glue, etc.
      const totalMaterialCost = stringerCost + treadCost + riserCost + hardwareCost;
      
      // Labor estimate
      const laborHours = 6 + (numberOfSteps * 0.5); // Base 6 hours + 30 min per step
      const laborCost = laborHours * 350; // 350 UAH per hour
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Розрахунки сходів:</h4>
          <p><strong>${numberOfSteps} сходинок</strong> (підйомів)</p>
          <p><strong>Висота підйому: ${actualRiser.toFixed(2)} см</strong> кожна</p>
          <p><strong>Глибина проступу: ${desiredTread} см</strong> кожна</p>
          <p><strong>Необхідний загальний хід: ${actualTotalRun.toFixed(1)} см</strong></p>
          ${totalRun ? `<p>Доступний простір: ${totalRun} см (${spaceExcess >= 0 ? 'підходить!' : 'надто тісно!'})</p>` : ''}
        </div>
        
        <div class="result-proportions">
          <h4>Пропорції дизайну:</h4>
          <p>Підйом + Хід: ${proportionFormula1.toFixed(1)} см ${proportionFormula1 >= 43 && proportionFormula1 <= 46 ? '✅' : '⚠️'}</p>
          <p>2×Підйом + Хід: ${proportionFormula2.toFixed(1)} см ${proportionFormula2 >= 60 && proportionFormula2 <= 64 ? '✅' : '⚠️'}</p>
          <p>Кут сходів: ${stairAngle.toFixed(1)}° ${stairAngle >= 30 && stairAngle <= 40 ? '✅' : '⚠️'}</p>
          <p>Довжина косоура: ${(stringerLength / 100).toFixed(2)} м</p>
        </div>
        
        <div class="result-compliance">
          <h4>Відповідність будівельним нормам:</h4>
          <p>Висота підйому: ${riserCompliant ? '✅ Відповідає' : '❌ Не відповідає'}</p>
          <p>Глибина проступу: ${treadCompliant ? '✅ Відповідає' : '❌ Не відповідає'}</p>
          <p>Однаковість: ✅ Всі сходинки ідентичні</p>
          <p>Кут нахилу: ${stairAngle >= 25 && stairAngle <= 45 ? '✅ Комфортний' : '⚠️ Потребує уваги'}</p>
        </div>
        
        ${warnings.length > 0 ? `
        <div class="result-warnings">
          <h4>Попередження:</h4>
          ${warnings.map(w => `<p>${w}</p>`).join('')}
        </div>
        ` : ''}
        
        ${recommendations.length > 0 ? `
        <div class="result-recommendations">
          <h4>Рекомендації з оптимізації:</h4>
          ${recommendations.map(r => `<p>${r}</p>`).join('')}
        </div>
        ` : ''}
        
        <div class="result-materials">
          <h4>Оцінка матеріалів:</h4>
          <p><strong>Косоури:</strong> дошка ${numberOfSteps <= 16 ? '50×300' : '50×350'} мм × 2-3 штуки</p>
          <p><strong>Проступи:</strong> ${numberOfSteps - 1} штук дубова дошка 32 мм</p>
          <p><strong>Підйоми:</strong> ${numberOfSteps} штук фанера 18 мм</p>
          <p><strong>Довжина косоура:</strong> ${(stringerLength / 100).toFixed(2)} м</p>
          <p><strong>Площа проступів:</strong> ${((numberOfSteps - 1) * desiredTread * 30 / 10000).toFixed(2)} м²</p>
        </div>
        
        <div class="result-costs">
          <h4>Вартість матеріалів:</h4>
          <p>Косоури: ${stringerCost} грн (2 штуки)</p>
          <p>Проступи: ${treadCost} грн (${numberOfSteps - 1} штук)</p>
          <p>Підйоми: ${riserCost} грн (${numberOfSteps} штук)</p>
          <p>Кріплення: ${hardwareCost} грн</p>
          <p><strong>Загальна вартість матеріалів: ${totalMaterialCost} грн</strong></p>
        </div>
        
        <div class="result-labor">
          <h4>Робочий час та вартість:</h4>
          <p>Розрахунковий час: ${laborHours.toFixed(1)} годин</p>
          <p>Вартість роботи: ${laborCost} грн</p>
          <p><strong>Загальна вартість проекту: ${(totalMaterialCost + laborCost).toLocaleString()} грн</strong></p>
        </div>
        
        <div class="result-safety">
          <h4>Вимоги безпеки:</h4>
          <p>🛡️ Поручні: висота 85-95 см</p>
          <p>📐 Ширина сходів: мінімум 90 см</p>
          <p>🏠 Висота проходу: мінімум 200 см</p>
          <p>🚪 Майданчики: 90 см глибини зверху та знизу</p>
        </div>
        
        <div class="result-installation">
          <h4>Етапи монтажу:</h4>
          <p>1. Підготовка та розмітка косоурів</p>
          <p>2. Вирізання пазів для сходинок</p>
          <p>3. Встановлення косоурів</p>
          <p>4. Монтаж підйомів</p>
          <p>5. Встановлення проступів</p>
          <p>6. Монтаж поручнів та балясин</p>
        </div>
        
        <div class="result-tips">
          <h4>Професійні поради:</h4>
          <p>💡 Завжди перевіряйте місцеві будівельні норми перед будівництвом</p>
          <p>📏 Двічі перевіряйте виміри та використовуйте професіонала для складних сходів</p>
          <p>🔨 Розгляньте найм підрядника для несучих сходів</p>
          <p>🌡️ Враховуйте розширення/стиснення матеріалів</p>
          <p>🎨 Плануйте оздоблення на етапі проектування</p>
        </div>
      `;
    });
  }
});