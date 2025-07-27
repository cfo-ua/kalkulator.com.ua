document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('raised-bed-form');
  const result = document.getElementById('raised-bed-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('bed-length').value);
      const width = parseFloat(document.getElementById('bed-width').value);
      const depth = parseFloat(document.getElementById('bed-depth').value);
      const bedCount = parseFloat(document.getElementById('bed-count').value);
      const [soilType, pricePerCubicMeter] = document.getElementById('soil-type').value.split(',');
      const cropType = document.getElementById('crop-type').value;
      
      if (length <= 0 || width <= 0 || depth <= 0 || bedCount <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate volumes
      const singleBedVolume = length * width * depth;
      const totalVolume = singleBedVolume * bedCount;
      const singleBedArea = length * width;
      const totalArea = singleBedArea * bedCount;
      
      // Check if depth is appropriate for crop type
      const recommendedDepth = getRecommendedDepth(cropType);
      const depthAppropriate = depth >= recommendedDepth;
      
      // Calculate drainage volume (10% of total)
      const drainageVolume = totalVolume * 0.1;
      const soilVolume = totalVolume - drainageVolume;
      
      // Calculate soil cost
      const soilCost = soilVolume * parseFloat(pricePerCubicMeter);
      
      // Calculate additional components if custom mixing
      let componentsCost = 0;
      let componentsBreakdown = '';
      
      if (soilType === 'custom') {
        const components = getCustomMixComponents(cropType, soilVolume);
        componentsCost = components.totalCost;
        componentsBreakdown = components.breakdown;
      }
      
      // Calculate drainage materials
      const drainageCost = drainageVolume * 800; // 800 UAH per m³ for gravel/ceramsite
      
      // Calculate additional amendments
      const amendments = getAmendments(cropType, totalArea);
      const amendmentsCost = amendments.cost;
      
      // Calculate delivery costs
      const bagSize = 0.05; // 50L bags
      const bagsNeeded = Math.ceil(soilVolume / bagSize);
      const bulkDelivery = soilVolume > 2;
      const deliveryCost = bulkDelivery ? 800 : (bagsNeeded > 20 ? 500 : 0);
      
      // Total cost
      const totalMaterialCost = soilCost + drainageCost + amendmentsCost + deliveryCost;
      const totalProjectCost = totalMaterialCost + (componentsCost || 0);
      
      // Calculate weights
      const soilWeight = soilVolume * 1200; // Average soil density kg/m³
      const drainageWeight = drainageVolume * 1500; // Gravel density
      const totalWeight = soilWeight + drainageWeight;
      
      // Calculate annual maintenance
      const annualTopUp = totalArea * 0.05; // 5cm top-up annually
      const annualCost = annualTopUp * parseFloat(pricePerCubicMeter);
      
      // Calculate productivity estimates
      const yieldEstimate = getYieldEstimate(cropType, totalArea);
      
      result.innerHTML = `
        <div class="insight-card">
          <h4>🌱 Параметри грядок:</h4>
          <p><strong>Розміри однієї грядки:</strong> ${length} × ${width} × ${depth} м</p>
          <p><strong>Площа однієї грядки:</strong> ${singleBedArea.toFixed(1)} м²</p>
          <p><strong>Кількість грядок:</strong> ${bedCount} шт.</p>
          <p><strong>Загальна площа:</strong> ${totalArea.toFixed(1)} м²</p>
          <p><strong>Тип ґрунту:</strong> ${getSoilTypeName(soilType)}</p>
          <p><strong>Культури:</strong> ${getCropTypeName(cropType)}</p>
        </div>
        
        <div class="insight-card">
          <h4>📊 Розрахунок об'ємів:</h4>
          <p><strong>Загальний об'єм:</strong> ${totalVolume.toFixed(2)} м³</p>
          <p><strong>Дренаж (10%):</strong> ${drainageVolume.toFixed(2)} м³</p>
          <p><strong>Ґрунтова суміш:</strong> ${soilVolume.toFixed(2)} м³</p>
          <p><strong>Загальна вага:</strong> ${totalWeight.toFixed(0)} кг</p>
        </div>
        
        ${!depthAppropriate ? `
        <div class="insight-card" style="border-left: 4px solid #ff6b6b;">
          <h4>⚠️ Рекомендації по глибині:</h4>
          <p>Для ${getCropTypeName(cropType)} рекомендована глибина мінімум ${recommendedDepth} м</p>
          <p>Поточна глибина ${depth} м може бути недостатньою для оптимального росту</p>
        </div>
        ` : `
        <div class="insight-card" style="border-left: 4px solid #51cf66;">
          <h4>✅ Глибина оптимальна:</h4>
          <p>Глибина ${depth} м підходить для ${getCropTypeName(cropType)}</p>
        </div>
        `}
        
        ${soilType === 'custom' ? `
        <div class="insight-card">
          <h4>🧪 Компоненти для змішування:</h4>
          ${componentsBreakdown}
          <p><strong>Загальна вартість компонентів:</strong> ${componentsCost.toFixed(0)} грн</p>
        </div>
        ` : ''}
        
        <div class="insight-card">
          <h4>🏗️ Дренажний шар:</h4>
          <p><strong>Об'єм дренажу:</strong> ${drainageVolume.toFixed(2)} м³</p>
          <p><strong>Матеріал:</strong> Керамзит або дрібний щебінь</p>
          <p><strong>Товщина шару:</strong> ${(depth * 0.1 * 100).toFixed(0)} см</p>
          <p><strong>Вартість дренажу:</strong> ${drainageCost.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>🌿 Додаткові добавки:</h4>
          <p>${amendments.description}</p>
          <p><strong>Вартість добавок:</strong> ${amendmentsCost.toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>💰 Кошторис проекту:</h4>
          <p><strong>Ґрунтова суміш:</strong> ${soilCost.toFixed(0)} грн</p>
          <p><strong>Дренажні матеріали:</strong> ${drainageCost.toFixed(0)} грн</p>
          <p><strong>Добавки та добрива:</strong> ${amendmentsCost.toFixed(0)} грн</p>
          <p><strong>Доставка:</strong> ${deliveryCost} грн</p>
          ${soilType === 'custom' ? `<p><strong>Компоненти:</strong> ${componentsCost.toFixed(0)} грн</p>` : ''}
          <p><strong>🔥 Загальна вартість: ${totalProjectCost.toFixed(0)} грн</strong></p>
          <p><strong>Вартість за м²:</strong> ${(totalProjectCost / totalArea).toFixed(0)} грн</p>
        </div>
        
        <div class="insight-card">
          <h4>📦 Доставка:</h4>
          ${bulkDelivery ? `
          <p><strong>Рекомендовано:</strong> Навантом (${soilVolume.toFixed(1)} м³)</p>
          <p><strong>Переваги:</strong> Економія до 30%, менше пакування</p>
          <p><strong>Потрібно:</strong> Доступ для вантажівки</p>
          ` : `
          <p><strong>В мішках:</strong> ${bagsNeeded} мішків по 50 літрів</p>
          <p><strong>Переваги:</strong> Зручне зберігання та дозування</p>
          `}
          <p><strong>Вага доставки:</strong> ${totalWeight.toFixed(0)} кг</p>
        </div>
        
        <div class="insight-card">
          <h4>📅 Річне обслуговування:</h4>
          <p><strong>Щорічне поповнення:</strong> ${annualTopUp.toFixed(2)} м³ (5 см)</p>
          <p><strong>Річна вартість:</strong> ${annualCost.toFixed(0)} грн</p>
          <p><strong>Рекомендації:</strong> Додавання компосту щовесни</p>
          <p><strong>Аналіз ґрунту:</strong> Раз на 2-3 роки</p>
        </div>
        
        <div class="insight-card">
          <h4>🍅 Очікувана продуктивність:</h4>
          <p>${yieldEstimate}</p>
        </div>
        
        <div class="insight-card">
          <h4>🔧 Етапи заповнення:</h4>
          <p>1️⃣ Встановлення дренажного шару</p>
          <p>2️⃣ Заповнення ґрунтовою сумішшю (80%)</p>
          <p>3️⃣ Додавання добавок та перемішування</p>
          <p>4️⃣ Доповнення до необхідного рівня</p>
          <p>5️⃣ Полив та осідання (7-10 днів)</p>
          <p>6️⃣ Фінальне доповнення перед посадкою</p>
        </div>
        
        <div class="insight-card">
          <h4>🧪 Контроль якості ґрунту:</h4>
          <p><strong>pH:</strong> Перевірте лакмусом (оптимум 6.0-7.0)</p>
          <p><strong>Вологість:</strong> Має злегка липнути, не розсипатись</p>
          <p><strong>Структура:</strong> Розсипчастий, без грудок</p>
          <p><strong>Запах:</strong> Приємний земляний, без різких запахів</p>
        </div>
        
        <div class="insight-card">
          <h4>💡 Поради по економії:</h4>
          <p><strong>Сезонні знижки:</strong> Купуйте восени (знижка до 20%)</p>
          <p><strong>Оптові закупівлі:</strong> Від 3 м³ - знижка 10-15%</p>
          <p><strong>Групові замовлення:</strong> Об'єднайтесь з сусідами</p>
          <p><strong>Власний компост:</strong> Заощадьте 30-40% вартості</p>
        </div>
        
        <div class="insight-card">
          <h4>🌱 Підготовка до посадки:</h4>
          <p><strong>Час осідання:</strong> 7-14 днів після заповнення</p>
          <p><strong>Початковий полив:</strong> До повного промочування</p>
          <p><strong>Температура:</strong> Дайте ґрунту прогрітись</p>
          <p><strong>Перший посів:</strong> Починайте з невибагливих культур</p>
        </div>
        
        <div class="insight-card">
          <h4>📈 Альтернативи по бюджету:</h4>
          <p><strong>Економ (власне змішування):</strong> ${(totalArea * 15).toFixed(0)} грн/м²</p>
          <p><strong>Стандарт (готова суміш):</strong> ${(totalArea * 25).toFixed(0)} грн/м²</p>
          <p><strong>Преміум (з біогумусом):</strong> ${(totalArea * 35).toFixed(0)} грн/м²</p>
          <p><strong>Поточний проект:</strong> ${(totalProjectCost / totalArea).toFixed(0)} грн/м²</p>
        </div>
      `;
      
      function getSoilTypeName(type) {
        const types = {
          'universal': 'Готова універсальна суміш',
          'vegetable': 'Спеціальна для овочів',
          'premium': 'Преміум з біогумусом',
          'custom': 'Власне змішування'
        };
        return types[type] || type;
      }
      
      function getCropTypeName(type) {
        const types = {
          'herbs': 'Зелень та трави',
          'vegetables': 'Овочеві культури',
          'root': 'Кореневі овочі',
          'leafy': 'Листові овочі',
          'flowers': 'Квіти та декоративні'
        };
        return types[type] || type;
      }
      
      function getRecommendedDepth(cropType) {
        const depths = {
          'herbs': 0.15,
          'vegetables': 0.40,
          'root': 0.35,
          'leafy': 0.25,
          'flowers': 0.30
        };
        return depths[cropType] || 0.30;
      }
      
      function getCustomMixComponents(cropType, volume) {
        // Example custom mix for vegetables: 40% compost, 30% peat, 30% garden soil
        const compostVol = volume * 0.4;
        const peatVol = volume * 0.3;
        const soilVol = volume * 0.3;
        
        const compostCost = compostVol * 1500;
        const peatCost = peatVol * 1800;
        const soilCost = soilVol * 1000;
        
        return {
          totalCost: compostCost + peatCost + soilCost,
          breakdown: `
            <p><strong>Компост:</strong> ${compostVol.toFixed(2)} м³ × 1500 грн = ${compostCost.toFixed(0)} грн</p>
            <p><strong>Торф:</strong> ${peatVol.toFixed(2)} м³ × 1800 грн = ${peatCost.toFixed(0)} грн</p>
            <p><strong>Садова земля:</strong> ${soilVol.toFixed(2)} м³ × 1000 грн = ${soilCost.toFixed(0)} грн</p>
          `
        };
      }
      
      function getAmendments(cropType, area) {
        const amendmentsList = {
          'herbs': { description: 'Деревна зола (2 кг), пісок річковий (5% об\'єму)', cost: area * 50 },
          'vegetables': { description: 'Комплексне добриво (3 кг), деревна зола (3 кг)', cost: area * 80 },
          'root': { description: 'Пісок (10% об\'єму), калійне добриво (2 кг)', cost: area * 60 },
          'leafy': { description: 'Азотне добриво (2 кг), компост додатковий', cost: area * 70 },
          'flowers': { description: 'Перліт (5% об\'єму), фосфорне добриво (2 кг)', cost: area * 90 }
        };
        return amendmentsList[cropType] || { description: 'Універсальне добриво', cost: area * 60 };
      }
      
      function getYieldEstimate(cropType, area) {
        const estimates = {
          'herbs': `З ${area.toFixed(1)} м² можна зібрати 15-25 кг свіжої зелені за сезон`,
          'vegetables': `З ${area.toFixed(1)} м² очікуваний урожай: 40-80 кг овочів за сезон`,
          'root': `З ${area.toFixed(1)} м² можна зібрати 30-60 кг коренеплодів`,
          'leafy': `З ${area.toFixed(1)} м² урожай листових овочів: 25-45 кг за сезон`,
          'flowers': `З ${area.toFixed(1)} м² можна висадити 20-40 кущів квітів`
        };
        return estimates[cropType] || `Площа ${area.toFixed(1)} м² для вирощування`;
      }
    });
  }
});