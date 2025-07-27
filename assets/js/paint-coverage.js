document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('paint-form');
  const result = document.getElementById('paint-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const wallArea = parseFloat(document.getElementById('paint-wall-area').value);
      const doors = parseFloat(document.getElementById('paint-doors').value);
      const windows = parseFloat(document.getElementById('paint-windows').value);
      const additionalArea = parseFloat(document.getElementById('paint-additional').value);
      const surfaceMultiplier = parseFloat(document.getElementById('paint-surface-type').value);
      const coveragePerLiter = parseFloat(document.getElementById('paint-quality').value);
      const coats = parseFloat(document.getElementById('paint-coats').value);
      const needsPrimer = document.getElementById('paint-primer').value === 'true';
      
      if (wallArea <= 0) {
        result.textContent = "Будь ласка, введіть правильну площу стін.";
        return;
      }
      
      // Calculate net area to paint
      const doorArea = doors * 2; // Standard door = 2 sq m
      const windowArea = windows * 1.5; // Standard window = 1.5 sq m
      const netWallArea = wallArea - doorArea - windowArea;
      const totalArea = netWallArea + additionalArea;
      
      if (totalArea <= 0) {
        result.textContent = "Загальна площа для фарбування повинна бути позитивною. Перевірте ваші виміри.";
        return;
      }
      
      // Adjust for surface type
      const adjustedCoverage = coveragePerLiter * surfaceMultiplier;
      
      // Calculate paint needed
      const paintAreaNeeded = totalArea * coats;
      const paintLiters = paintAreaNeeded / adjustedCoverage;
      const paintLitersRounded = Math.ceil(paintLiters * 2) / 2; // Round to nearest 0.5L
      
      // Calculate primer if needed
      let primerLiters = 0;
      let primerLitersRounded = 0;
      if (needsPrimer) {
        const primerCoverage = 6 * surfaceMultiplier; // Primer covers less (6 sq m per liter)
        primerLiters = totalArea / primerCoverage;
        primerLitersRounded = Math.ceil(primerLiters * 2) / 2;
      }
      
      // Add 10% extra for touch-ups
      const extraPaint = paintLitersRounded * 0.1;
      const totalPaintRecommended = paintLitersRounded + extraPaint;
      const totalPaintRounded = Math.ceil(totalPaintRecommended * 2) / 2;
      
      // Cost estimates (Ukrainian prices)
      const paintCostLow = paintLitersRounded * 150;
      const paintCostHigh = paintLitersRounded * 500;
      const primerCostLow = primerLitersRounded * 100;
      const primerCostHigh = primerLitersRounded * 300;
      
      // Calculate coverage efficiency
      const coverageEfficiency = (adjustedCoverage / coveragePerLiter * 100).toFixed(0);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Розрахунки площі:</h4>
          <p>Загальна площа стін: ${wallArea} м²</p>
          <p>Мінус двері: ${doorArea} м² (${doors} дверей)</p>
          <p>Мінус вікна: ${windowArea} м² (${windows} вікон)</p>
          <p>Чиста площа для фарбування: ${netWallArea} м²</p>
          ${additionalArea > 0 ? `<p>Додаткова площа: ${additionalArea} м²</p>` : ''}
          <p><strong>Загальна площа для фарбування: ${totalArea} м²</strong></p>
          <p><strong>Потрібно фарби для ${coats} шар${coats > 1 ? 'ів' : 'у'}: ${paintAreaNeeded} м² покриття</strong></p>
        </div>
        
        <div class="result-paint">
          <h4>Потреби у фарбі:</h4>
          <p><strong>${paintLitersRounded} літрів фарби</strong></p>
          <p>Ефективне покриття: ${adjustedCoverage.toFixed(1)} м²/літр</p>
          <p>Ефективність покриття: ${coverageEfficiency}% від стандарту</p>
          ${needsPrimer ? `
          <p><strong>${primerLitersRounded} літрів грунтовки</strong></p>
          <p>Покриття грунтовки: ${(6 * surfaceMultiplier).toFixed(1)} м²/літр</p>
          ` : ''}
        </div>
        
        <div class="result-recommendations">
          <h4>Рекомендації для покупки:</h4>
          <p><strong>Купіть: ${totalPaintRounded} літрів фарби</strong> <em>(включає 10% запас)</em></p>
          ${needsPrimer ? `<p><strong>Купіть: ${primerLitersRounded} літрів грунтовки</strong></p>` : ''}
          <p>💡 Завжди купуйте додатково для підфарбовки та відповідності кольору</p>
          <p>🎨 Купуйте всю фарбу з однієї партії для консистентності кольору</p>
        </div>
        
        <div class="result-costs">
          <h4>Орієнтовні витрати:</h4>
          <p>Фарба: ${paintCostLow}-${paintCostHigh} грн (${paintLitersRounded} літрів)</p>
          ${needsPrimer ? `<p>Грунтовка: ${primerCostLow}-${primerCostHigh} грн (${primerLitersRounded} літрів)</p>` : ''}
          <p><em>Ціни варіюються за брендом, якістю та роздрібним торговцем</em></p>
        </div>
        
        <div class="result-supplies">
          <h4>Додаткові необхідні постачання:</h4>
          <p>🖌️ Пензлі (2-3 різних розмірів)</p>
          <p>🎢 Валики та насадки для валиків</p>
          <p>📋 Ванночки для фарби та вкладиші</p>
          <p>🛡️ Захисна плівка та пластикові покриття</p>
          <p>📏 Малярна стрічка</p>
          <p>🧽 Засоби для очищення</p>
        </div>
        
        <div class="result-coverage-tips">
          <h4>Поради щодо покриття:</h4>
          <p>📐 Точно виміряйте всі поверхні перед покупкою</p>
          <p>🎨 Тестуйте фарбу на невеликій ділянці спочатку</p>
          <p>🌡️ Врахуйте пористість та текстуру поверхні</p>
          <p>⚡ Якісна фарба часто покриває краще за один шар</p>
        </div>
        
        <div class="result-application-tips">
          <h4>Поради щодо нанесення:</h4>
          <p>🏠 Розгляньте найм професіоналів для високих стель або складних проектів</p>
          <p>🌡️ Фарбуйте при температурі між 10-30°C для найкращих результатів</p>
          <p>⏰ Дозволяйте належний час висихання між шарами (2-4 години типово)</p>
          <p>💨 Забезпечте належну вентиляцію під час фарбування</p>
        </div>
        
        <div class="result-surface-info">
          <h4>Інформація про поверхню:</h4>
          <p>Тип поверхні: ${
            surfaceMultiplier === 1.0 ? 'Гладкий гіпсокартон' :
            surfaceMultiplier === 0.8 ? 'Текстуровані стіни' :
            surfaceMultiplier === 0.75 ? 'Шорстка/пориста поверхня' :
            'Дуже шорстка поверхня'
          }</p>
          <p>Корекція покриття: ${((1 - surfaceMultiplier) * 100).toFixed(0)}% додаткової фарби потрібно</p>
          <p>💡 Текстуровані поверхні поглинають більше фарби</p>
        </div>
      `;
    });
  }
});