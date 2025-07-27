document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('roof-pitch-form');
  const result = document.getElementById('roof-pitch-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const rise = parseFloat(document.getElementById('roof-rise').value);
      const run = parseFloat(document.getElementById('roof-run').value);
      const length = parseFloat(document.getElementById('roof-length').value);
      const [materialType, costPerSqM] = document.getElementById('roof-material').value.split(',');
      
      if (rise < 0 || run <= 0 || length <= 0) {
        result.textContent = "Будь ласка, введіть правильні виміри.";
        return;
      }
      
      // Calculate pitch percentage
      const pitchPercent = (rise / run) * 100;
      
      // Calculate angle in degrees
      const angleRadians = Math.atan(rise / run);
      const angleDegrees = angleRadians * (180 / Math.PI);
      
      // Calculate roof factor (multiplier for true roof area)
      const roofFactor = Math.sqrt(1 + Math.pow(rise / run, 2));
      
      // Calculate rafter length
      const rafterLength = Math.sqrt(Math.pow(rise, 2) + Math.pow(run, 2));
      
      // Calculate floor area (assuming simple rectangular house)
      const floorArea = length * run * 2; // Both sides of roof
      
      // Calculate roof area
      const roofArea = floorArea * roofFactor;
      
      // Calculate material costs
      const materialCost = roofArea * parseFloat(costPerSqM);
      
      // Calculate additional materials needed
      const underlaymentArea = roofArea * 1.1; // 10% extra for overlap
      const ridgeLength = length;
      const gutterLength = (length * 2) + (run * 4); // Perimeter
      
      // Estimate costs for additional materials
      const underlaymentCost = underlaymentArea * 50; // 50 UAH per sq m
      const ridgeCost = ridgeLength * 200; // 200 UAH per linear meter
      const gutterCost = gutterLength * 150; // 150 UAH per linear meter
      const flashingCost = length * 100; // 100 UAH per linear meter
      
      const totalMaterialCost = materialCost + underlaymentCost + ridgeCost + gutterCost + flashingCost;
      
      // Labor estimate
      const laborHours = roofArea * 0.8; // 0.8 hours per sq m
      const laborCost = laborHours * 300; // 300 UAH per hour
      
      const totalProjectCost = totalMaterialCost + laborCost;
      
      // Determine pitch classification
      let pitchClass = '';
      let recommendations = [];
      let warnings = [];
      
      if (pitchPercent < 5) {
        pitchClass = 'Плоский дах';
        warnings.push('⚠️ Потребує спеціальної гідроізоляції');
        recommendations.push('🏗️ Розгляньте мембранні покрівлі');
      } else if (pitchPercent < 20) {
        pitchClass = 'Пологий схил';
        recommendations.push('💧 Забезпечте якісний водовідвід');
      } else if (pitchPercent < 50) {
        pitchClass = 'Помірний схил';
        recommendations.push('✅ Оптимально для більшості матеріалів');
      } else if (pitchPercent < 100) {
        pitchClass = 'Крутий схил';
        recommendations.push('🏔️ Відмінне сходження снігу');
        warnings.push('⚠️ Потребує додаткових заходів безпеки');
      } else {
        pitchClass = 'Дуже крутий';
        warnings.push('⚠️ Складний монтаж, високі витрати');
        recommendations.push('🎿 Розгляньте зменшення нахилу');
      }
      
      // Check material compatibility
      const materialCompatibility = checkMaterialCompatibility(materialType, pitchPercent);
      
      // Snow load considerations for Ukraine
      const snowLoadFactor = calculateSnowLoadFactor(angleDegrees);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Параметри нахилу:</h4>
          <p><strong>Нахил: ${pitchPercent.toFixed(1)}%</strong></p>
          <p><strong>Кут: ${angleDegrees.toFixed(1)}°</strong></p>
          <p><strong>Класифікація: ${pitchClass}</strong></p>
          <p>Коефіцієнт нахилу: ${roofFactor.toFixed(3)}</p>
        </div>
        
        <div class="result-measurements">
          <h4>Розміри та площі:</h4>
          <p>Довжина стропил: ${rafterLength.toFixed(2)} м</p>
          <p>Площа покрівлі: ${roofArea.toFixed(1)} м²</p>
          <p>Площа підлоги: ${floorArea.toFixed(1)} м²</p>
          <p>Збільшення площі: ${((roofFactor - 1) * 100).toFixed(1)}%</p>
        </div>
        
        <div class="result-materials">
          <h4>Матеріали та вартість:</h4>
          <p><strong>Покрівельне покриття:</strong> ${roofArea.toFixed(1)} м² × ${costPerSqM} грн = ${materialCost.toFixed(0)} грн</p>
          <p><strong>Підкладний матеріал:</strong> ${underlaymentArea.toFixed(1)} м² = ${underlaymentCost.toFixed(0)} грн</p>
          <p><strong>Конькові елементи:</strong> ${ridgeLength} м = ${ridgeCost.toFixed(0)} грн</p>
          <p><strong>Водостоки:</strong> ${gutterLength.toFixed(1)} м = ${gutterCost.toFixed(0)} грн</p>
          <p><strong>Планки примикання:</strong> ${flashingCost.toFixed(0)} грн</p>
          <p><strong>Загальна вартість матеріалів: ${totalMaterialCost.toFixed(0)} грн</strong></p>
        </div>
        
        <div class="result-labor">
          <h4>Робота та загальна вартість:</h4>
          <p>Розрахунковий час: ${laborHours.toFixed(1)} годин</p>
          <p>Вартість роботи: ${laborCost.toFixed(0)} грн</p>
          <p><strong>Загальна вартість проекту: ${totalProjectCost.toFixed(0)} грн</strong></p>
          <p>Вартість за м²: ${(totalProjectCost / roofArea).toFixed(0)} грн/м²</p>
        </div>
        
        <div class="result-compatibility">
          <h4>Сумісність матеріалу:</h4>
          ${materialCompatibility}
        </div>
        
        <div class="result-snow-load">
          <h4>Снігове навантаження:</h4>
          <p>Коефіцієнт снігового навантаження: ${snowLoadFactor.toFixed(2)}</p>
          <p>${getSnowLoadRecommendation(snowLoadFactor)}</p>
        </div>
        
        ${recommendations.length > 0 ? `
        <div class="result-recommendations">
          <h4>Рекомендації:</h4>
          ${recommendations.map(r => `<p>${r}</p>`).join('')}
        </div>
        ` : ''}
        
        ${warnings.length > 0 ? `
        <div class="result-warnings">
          <h4>Попередження:</h4>
          ${warnings.map(w => `<p>${w}</p>`).join('')}
        </div>
        ` : ''}
        
        <div class="result-advantages">
          <h4>Переваги даного нахилу:</h4>
          ${getPitchAdvantages(pitchPercent)}
        </div>
        
        <div class="result-construction">
          <h4>Особливості конструкції:</h4>
          <p>📐 Крок стропил: ${angleDegrees > 30 ? '60' : '80'} см (рекомендовано)</p>
          <p>🏗️ Тип стропильної системи: ${angleDegrees > 25 ? 'наслонні' : 'висячі'} стропила</p>
          <p>❄️ Снігозатримувачі: ${angleDegrees < 30 ? 'обов\'язкові' : 'рекомендовані'}</p>
          <p>🌬️ Вітрове навантаження: ${angleDegrees > 35 ? 'підвищене' : 'стандартне'}</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Обслуговування:</h4>
          <p>🧹 Очищення від снігу: ${angleDegrees < 25 ? 'необхідне' : 'природне сходження'}</p>
          <p>🔧 Доступність для ремонту: ${angleDegrees < 35 ? 'легка' : 'складна'}</p>
          <p>🍂 Очищення водостоків: ${pitchPercent > 20 ? 'мінімальне' : 'регулярне'}</p>
        </div>
        
        <div class="result-climate">
          <h4>Кліматичні фактори для України:</h4>
          <p>🌨️ Снігове навантаження: 150-250 кг/м² (залежно від регіону)</p>
          <p>🌧️ Опади: до 800 мм/рік, потребує схил >15%</p>
          <p>💨 Вітрове навантаження: 0,5-0,8 кПа</p>
          <p>🌡️ Температурні коливання: -30°C до +40°C</p>
        </div>
      `;
    });
  }
  
  function checkMaterialCompatibility(material, pitch) {
    const compatibility = {
      'metal-tile': { min: 12, ideal: 15 },
      'ceramic-tile': { min: 20, ideal: 25 },
      'bitumen-shingle': { min: 15, ideal: 20 },
      'profsheet': { min: 8, ideal: 12 },
      'seam-roof': { min: 5, ideal: 10 },
      'slate': { min: 20, ideal: 25 }
    };
    
    const materialNames = {
      'metal-tile': 'металочерепиця',
      'ceramic-tile': 'керамічна черепиця',
      'bitumen-shingle': 'бітумна черепиця',
      'profsheet': 'профнастил',
      'seam-roof': 'фальцева покрівля',
      'slate': 'шифер'
    };
    
    const req = compatibility[material];
    const name = materialNames[material];
    
    if (pitch < req.min) {
      return `❌ ${name} не підходить (мінімум ${req.min}%, ідеально ${req.ideal}%+)`;
    } else if (pitch < req.ideal) {
      return `⚠️ ${name} підходить з обмеженнями (краще ${req.ideal}%+)`;
    } else {
      return `✅ ${name} ідеально підходить`;
    }
  }
  
  function calculateSnowLoadFactor(angle) {
    // Snow load factor decreases with steeper angles
    if (angle < 30) return 1.0;
    if (angle < 45) return 0.7;
    if (angle < 60) return 0.4;
    return 0.0;
  }
  
  function getSnowLoadRecommendation(factor) {
    if (factor > 0.8) return '❄️ Високе снігове навантаження - посилена конструкція';
    if (factor > 0.5) return '🌨️ Помірне снігове навантаження - стандартна конструкція';
    if (factor > 0.2) return '☁️ Низьке снігове навантаження - полегшена конструкція';
    return '🏔️ Мінімальне снігове навантаження - сніг сходить самостійно';
  }
  
  function getPitchAdvantages(pitch) {
    if (pitch < 10) {
      return `
        <p>🏢 Сучасний мінімалістичний вигляд</p>
        <p>💰 Економія матеріалів та простору</p>
        <p>🔧 Легкий доступ для обслуговування</p>
        <p>🏠 Можливість експлуатованої покрівлі</p>
      `;
    } else if (pitch < 30) {
      return `
        <p>⚖️ Збалансоване рішення вартість/функціональність</p>
        <p>🌧️ Достатній водовідвід</p>
        <p>🔨 Відносно легкий монтаж</p>
        <p>🏠 Універсальність архітектурних рішень</p>
      `;
    } else {
      return `
        <p>🏔️ Відмінний стік води та сходження снігу</p>
        <p>🏠 Можливість мансардного поверху</p>
        <p>🎨 Класичний естетичний вигляд</p>
        <p>💨 Хороша вентиляція підпокрівельного простору</p>
      `;
    }
  }
});