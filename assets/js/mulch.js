document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('mulch-form');
  const result = document.getElementById('mulch-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('mulch-length').value);
      const width = parseFloat(document.getElementById('mulch-width').value);
      const [mulchType, pricePerCubicMeter] = document.getElementById('mulch-type').value.split(',');
      const [purpose, thickness] = document.getElementById('mulch-purpose').value.split(',');
      const areas = parseFloat(document.getElementById('mulch-areas').value);
      
      if (length <= 0 || width <= 0 || areas <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate area and volume
      const singleArea = length * width;
      const totalArea = singleArea * areas;
      const mulchDepth = parseFloat(thickness);
      const totalVolume = totalArea * mulchDepth;
      
      // Add 10% extra for settling and waste
      const volumeWithWaste = totalVolume * 1.1;
      
      // Calculate costs
      const mulchCost = volumeWithWaste * parseFloat(pricePerCubicMeter);
      
      // Calculate delivery (bags vs bulk)
      const bagSize = 0.05; // 50 liters = 0.05 m³
      const bagsNeeded = Math.ceil(volumeWithWaste / bagSize);
      const bulkDelivery = volumeWithWaste > 2; // Bulk delivery for >2 m³
      
      // Calculate application area coverage rates
      const coveragePerCubicMeter = 1 / mulchDepth; // m² per m³
      
      // Calculate weight (approximate)
      const densities = {
        'sawdust': 300,     // kg/m³
        'bark': 400,        // kg/m³  
        'straw': 200,       // kg/m³
        'peat': 600,        // kg/m³
        'coconut': 150,     // kg/m³
        'decorative': 450   // kg/m³
      };
      const totalWeight = volumeWithWaste * (densities[mulchType] || 400);
      
      // Calculate annual replacement needs
      const replacementRates = {
        'sawdust': 1.0,     // Replace annually
        'bark': 0.5,        // Replace every 2 years
        'straw': 1.5,       // Replace 1.5 times per year
        'peat': 0.8,        // Replace every 1.25 years
        'coconut': 0.3,     // Replace every 3+ years
        'decorative': 0.4   // Replace every 2.5 years
      };
      const annualReplacement = totalVolume * (replacementRates[mulchType] || 1.0);
      const annualCost = annualReplacement * parseFloat(pricePerCubicMeter);
      
      // Calculate environmental benefits
      const waterSavings = totalArea * 200; // 200L per m² per season
      const weedReduction = totalArea * 0.85; // 85% weed reduction
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🌱 Параметри мульчування:</h4>
          <p><strong>Площа ділянки:</strong> ${length} × ${width} м (${singleArea.toFixed(1)} м²)</p>
          <p><strong>Кількість ділянок:</strong> ${areas} шт.</p>
          <p><strong>Загальна площа:</strong> ${totalArea.toFixed(1)} м²</p>
          <p><strong>Товщина мульчі:</strong> ${(mulchDepth * 100).toFixed(0)} см</p>
          <p><strong>Тип мульчі:</strong> ${getMulchTypeName(mulchType)}</p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Розрахунок об'єму:</h4>
          <p><strong>Базовий об'єм:</strong> ${totalVolume.toFixed(3)} м³</p>
          <p><strong>З запасом (10%):</strong> ${volumeWithWaste.toFixed(3)} м³</p>
          <p><strong>Покриття:</strong> ${coveragePerCubicMeter.toFixed(1)} м² на 1 м³</p>
          <p><strong>Загальна вага:</strong> ${totalWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Вартість матеріалів:</h4>
          <p><strong>Вартість мульчі:</strong> ${mulchCost.toFixed(0)} грн</p>
          <p><strong>Вартість за м²:</strong> ${(mulchCost / totalArea).toFixed(0)} грн</p>
          <p><strong>Річна вартість обслуговування:</strong> ${annualCost.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>📦 Варіанти доставки:</h4>
          ${bulkDelivery ? `
          <p><strong>Рекомендовано:</strong> Навантом (${volumeWithWaste.toFixed(1)} м³)</p>
          <p><strong>Переваги:</strong> Дешевше, менше упаковки</p>
          <p><strong>Потрібно:</strong> Місце для розвантаження</p>
          ` : `
          <p><strong>В мішках:</strong> ${bagsNeeded} мішків по 50 літрів</p>
          <p><strong>Переваги:</strong> Зручно зберігати і транспортувати</p>
          <p><strong>Недоліки:</strong> Дорожче за навалом</p>
          `}
          <p><strong>Вага доставки:</strong> ${totalWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>🌿 Екологічні переваги:</h4>
          <p><strong>Економія води:</strong> ~${waterSavings.toFixed(0)} літрів за сезон</p>
          <p><strong>Скорочення бур'янів:</strong> на ${(weedReduction).toFixed(1)} м²</p>
          <p><strong>Покращення ґрунту:</strong> ${getMulchBenefits(mulchType)}</p>
          <p><strong>Захист рослин:</strong> ізоляція коренів взимку</p>
        </div>
        
        <div class="insight-card">
          <h4>📅 График оновлення:</h4>
          <p><strong>Перше внесення:</strong> ${volumeWithWaste.toFixed(2)} м³</p>
          <p><strong>Щорічне поповнення:</strong> ${annualReplacement.toFixed(2)} м³</p>
          <p><strong>Термін служби:</strong> ${getServiceLife(mulchType)}</p>
          <p><strong>Сезон внесення:</strong> ${getBestSeason(purpose)}</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Правила застосування:</h4>
          <p>📏 Відстань від стовбурів: 10-15 см</p>
          <p>📐 Рівномірний розподіл по площі</p>
          <p>💧 Полив ґрунту перед мульчуванням</p>
          <p>🌡️ Внесення після прогрівання ґрунту</p>
          <p>🧹 Видалення бур'янів перед мульчуванням</p>
        </div>
        
        <div class="insight-card">
          <h4>⚠️ Важливі поради:</h4>
          <p>${getMulchTips(mulchType)}</p>
        </div>
        
        <div class="insight-card">
          <h4>🛠️ Інструменти для роботи:</h4>
          <p>🧹 Граблі для розподілу</p>
          <p>🪣 Відра або тачка для транспортування</p>
          <p>📏 Рулетка для вимірювання товщини</p>
          <p>🧤 Робочі рукавички</p>
          <p>✂️ Секатор для підготовки рослин</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Поради по економії:</h4>
          <p><strong>Сезонні знижки:</strong> Найкращі ціни восени</p>
          <p><strong>Оптові закупівлі:</strong> Знижка від 2 м³</p>
          <p><strong>Групові замовлення:</strong> Розділіть доставку з сусідами</p>
          <p><strong>Власна заготівля:</strong> Збір опалого листя</p>
        </div>
        
        <div class="insight-card">
          <h4>📈 Альтернативи по бюджету:</h4>
          <p><strong>Економ (солома):</strong> ${(totalArea * 0.4 * mulchDepth).toFixed(0)} грн</p>
          <p><strong>Стандарт (тирса):</strong> ${(totalArea * 1.0 * mulchDepth).toFixed(0)} грн</p>
          <p><strong>Преміум (декор. кора):</strong> ${(totalArea * 3.0 * mulchDepth).toFixed(0)} грн</p>
          <p><strong>Поточний вибір:</strong> ${(mulchCost / totalArea).toFixed(0)} грн/м²</p>
        </div>
        
        <div class="insight-card">
          <h4>🌱 Догляд за мульчею:</h4>
          <p><strong>Весна:</strong> Розпушити, додати свіжий шар</p>
          <p><strong>Літо:</strong> Моніторинг товщини після дощів</p>
          <p><strong>Осінь:</strong> Підготовка до зими, оновлення</p>
          <p><strong>Зима:</strong> Перевірка після снігу</p>
        </div>
      `;
      
      function getMulchTypeName(type) {
        const types = {
          'sawdust': 'Деревна тирса',
          'bark': 'Кора сосни подрібнена',
          'straw': 'Солома',
          'peat': 'Торф\'яна крихта',
          'coconut': 'Кокосове волокно',
          'decorative': 'Декоративна кора'
        };
        return types[type] || type;
      }
      
      function getMulchBenefits(type) {
        const benefits = {
          'sawdust': 'Поступове живлення азотом',
          'bark': 'Підкислення ґрунту, довговічність',
          'straw': 'Швидке розкладання, багато калію',
          'peat': 'Підкислення, утримання вологи',
          'coconut': 'Відмінний дренаж, довговічність',
          'decorative': 'Естетичність, стійкість до вивітрювання'
        };
        return benefits[type] || 'Загальні переваги мульчування';
      }
      
      function getServiceLife(type) {
        const lifespans = {
          'sawdust': '1 рік',
          'bark': '2-3 роки',
          'straw': '6-8 місяців',
          'peat': '1-1.5 роки',
          'coconut': '3-4 роки',
          'decorative': '2-3 роки'
        };
        return lifespans[type] || '1-2 роки';
      }
      
      function getBestSeason(purpose) {
        if (purpose === 'vegetables') return 'Пізня весна (травень)';
        if (purpose === 'trees') return 'Рання весна або осінь';
        if (purpose === 'flowers') return 'Весна після останніх заморозків';
        return 'Весна-літо';
      }
      
      function getMulchTips(type) {
        const tips = {
          'sawdust': '⚠️ Не використовуйте свіжу тирсу - додайте азотні добрива',
          'bark': '✅ Ідеально для кислолюбних рослин (азалії, хвойні)',
          'straw': '⚠️ Переконайтеся, що солома без насіння бур\'янів',
          'peat': '⚠️ Може пересихати і стати водовідштовхуючим',
          'coconut': '✅ Екологічно чистий, не містить патогенів',
          'decorative': '💡 Ідеально для парадних зон саду'
        };
        return tips[type] || 'Дотримуйтесь рекомендованої товщини шару';
      }
    });
  }
});