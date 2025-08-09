document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('alcohol-dilution-form');
  const result = document.getElementById('alcohol-dilution-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const initialVolume = parseFloat(document.getElementById('initial-volume').value);
      const initialAlcohol = parseFloat(document.getElementById('initial-alcohol').value);
      const targetAlcohol = parseFloat(document.getElementById('target-alcohol').value);
      
      // Validation
      if (isNaN(initialVolume) || isNaN(initialAlcohol) || isNaN(targetAlcohol)) {
        result.innerHTML = '<div class="error">❌ Будь ласка, введіть всі числові значення коректно.</div>';
        return;
      }
      
      if (initialVolume <= 0) {
        result.innerHTML = '<div class="error">❌ Об\'єм алкоголю повинен бути більше нуля.</div>';
        return;
      }
      
      if (initialAlcohol <= 0 || initialAlcohol > 100) {
        result.innerHTML = '<div class="error">❌ Початковий градус повинен бути від 0 до 100%.</div>';
        return;
      }
      
      if (targetAlcohol < 0 || targetAlcohol > 100) {
        result.innerHTML = '<div class="error">❌ Бажаний градус повинен бути від 0 до 100%.</div>';
        return;
      }
      
      if (targetAlcohol >= initialAlcohol) {
        result.innerHTML = '<div class="error">❌ Бажаний градус повинен бути меншим за початковий. Неможливо підвищити градус додаванням води.</div>';
        return;
      }
      
      // Calculate water needed
      const waterNeeded = (initialVolume * initialAlcohol - initialVolume * targetAlcohol) / targetAlcohol;
      const finalVolume = initialVolume + waterNeeded;
      const alcoholAmount = initialVolume * initialAlcohol / 100;
      
      // Calculate concentration reduction
      const reductionRatio = initialAlcohol / targetAlcohol;
      const waterPercentage = (waterNeeded / finalVolume) * 100;
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>💧 Кількість води</h6>
            <div class="big-number">${waterNeeded.toFixed(1)} мл</div>
            <p>Додайте цю кількість води</p>
          </div>
          
          <div class="insight-card info">
            <h6>📏 Загальний об'єм</h6>
            <div class="big-number">${finalVolume.toFixed(1)} мл</div>
            <p>Об'єм після розведення</p>
          </div>
          
          <div class="insight-card warning">
            <h6>🍷 Чистий спирт</h6>
            <div class="big-number">${alcoholAmount.toFixed(1)} мл</div>
            <p>Абсолютний алкоголь в напої</p>
          </div>
        </div>
        
        <hr>
        
        <div class="calculation-details">
          <h4>📋 Детальна інформація:</h4>
          <div class="details-grid">
            <div><strong>🔄 Коефіцієнт розведення:</strong> 1:${(reductionRatio - 1).toFixed(2)} (алкоголь:вода)</div>
            <div><strong>💧 Частка води в кінцевому напої:</strong> ${waterPercentage.toFixed(1)}%</div>
            <div><strong>🍶 Частка алкоголю в кінцевому напої:</strong> ${((initialVolume / finalVolume) * 100).toFixed(1)}%</div>
            <div><strong>📉 Зниження градуса:</strong> ${(initialAlcohol - targetAlcohol).toFixed(1)}°</div>
          </div>
        </div>
        
        <div class="instructions">
          <h4>📝 Інструкція з розведення:</h4>
          <ol>
            <li>Підготуйте ${waterNeeded.toFixed(1)} мл чистої води (дистильованої або м'якої питної)</li>
            <li>Повільно додавайте воду до алкоголю, постійно перемішуючи</li>
            <li>Не додавайте алкоголь до води - це може призвести до втрати спирту</li>
            <li>Дайте суміші відстоятися 24 години для стабілізації</li>
            <li>Перевірте градус спиртоміром</li>
          </ol>
        </div>
        
        <div class="tips">
          <h4>💡 Корисні поради:</h4>
          <ul>
            <li><strong>Температура:</strong> Всі компоненти повинні мати однакову температуру (~20°C)</li>
            <li><strong>Якість води:</strong> Використовуйте воду з мінімальною жорсткістю</li>
            <li><strong>Процес:</strong> Розведення повинно бути поступовим</li>
            <li><strong>Зберігання:</strong> Після розведення дайте напою "відпочити" кілька днів</li>
          </ul>
        </div>
      `;
    });
  }
});