document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fertilizer-form');
  const result = document.getElementById('fertilizer-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const area = parseFloat(document.getElementById('fertilizer-area').value);
      const plantType = parseFloat(document.getElementById('fertilizer-plant-type').value);
      const fertilizer = document.getElementById('fertilizer-npk').value;
      const applicationTimes = parseInt(document.getElementById('fertilizer-application').value);
      const fertilizerForm = document.getElementById('fertilizer-form-type').value;
      
      if (!area || !plantType || !fertilizer || !applicationTimes || !fertilizerForm) {
        result.textContent = "Будь ласка, заповніть всі поля.";
        return;
      }
      
      // Parse NPK and price data
      const [nitrogen, phosphorus, potassium, pricePerBag] = fertilizer.split(',').map(Number);
      
      // Calculate nitrogen needs (g/sq m)
      const nitrogenNeeded = plantType; // g N per sq m annually
      const totalNitrogenNeeded = (area * nitrogenNeeded) / 1000; // Convert to kg
      
      // Calculate fertilizer needed based on nitrogen content
      const fertilizerNeeded = (totalNitrogenNeeded / (nitrogen / 100)); // kg of fertilizer needed
      
      // Calculate per application amount
      const fertilizerPerApplication = fertilizerNeeded / applicationTimes;
      
      // Calculate number of bags needed (25 kg bags)
      const bagsNeeded = Math.ceil(fertilizerNeeded / 25);
      const bagCost = pricePerBag;
      const totalCost = bagsNeeded * bagCost;
      
      // Calculate application rate per sq m
      const applicationRatePerSqM = (fertilizerPerApplication * 1000) / area; // g per sq m
      
      // Calculate nutrient delivery
      const phosphorusDelivered = (fertilizerNeeded * phosphorus / 100);
      const potassiumDelivered = (fertilizerNeeded * potassium / 100);
      
      // Calculate spreader settings (approximation)
      const spreaderSetting = Math.round(applicationRatePerSqM / 5); // Rough estimate
      
      // Calculate seasonal schedule
      const seasonalSchedule = getSeasonalSchedule(applicationTimes, fertilizerForm);
      
      // Display results
      displayResults({
        area,
        plantType,
        nitrogen,
        phosphorus,
        potassium,
        applicationTimes,
        fertilizerForm,
        nitrogenNeeded,
        totalNitrogenNeeded,
        fertilizerNeeded,
        fertilizerPerApplication,
        bagsNeeded,
        totalCost,
        applicationRatePerSqM,
        phosphorusDelivered,
        potassiumDelivered,
        spreaderSetting,
        seasonalSchedule
      });
    });
  }

  function getSeasonalSchedule(applications, form) {
    const schedules = {
      1: ['Рання весна (березень-квітень): Повна річна норма'],
      2: [
        'Рання весна (березень): 60% річної норми', 
        'Осінь (вересень): 40% річної норми'
      ],
      3: [
        'Рання весна (березень): 40% річної норми',
        'Пізня весна (травень): 35% річної норми', 
        'Осінь (вересень): 25% річної норми'
      ],
      4: [
        'Рання весна (березень): 30% річної норми',
        'Пізня весна (травень): 25% річної норми',
        'Літо (липень): 20% річної норми',
        'Осінь (вересень): 25% річної норми'
      ]
    };
    return schedules[applications] || schedules[1];
  }

  function getPlantTypeName(plantType) {
    const names = {
      15: 'Встановлений газон',
      25: 'Новий газон', 
      30: 'Овочевий сад',
      20: 'Чагарники/кущі'
    };
    return names[plantType] || 'Невідомий тип рослин';
  }

  function getFertilizerName(n, p, k) {
    return `${n}-${p}-${k}`;
  }

  function getFormName(form) {
    const names = {
      'granular': 'Гранульовані',
      'liquid': 'Рідкі',
      'organic': 'Органічні'
    };
    return names[form] || form;
  }

  function displayResults(data) {
    result.innerHTML = `
      <div class="insight-card">
        <h4>🌱 Розрахунок добрив</h4>
        <p><strong>Площа:</strong> ${data.area} кв. м</p>
        <p><strong>Тип рослин:</strong> ${getPlantTypeName(data.plantType)}</p>
        <p><strong>Добрива:</strong> ${getFertilizerName(data.nitrogen, data.phosphorus, data.potassium)} (${getFormName(data.fertilizerForm)})</p>
        <p><strong>Кількість внесень:</strong> ${data.applicationTimes} разів на рік</p>
      </div>

      <div class="insight-card">
        <h4>📊 Потреби в поживних речовинах</h4>
        <p><strong>Азот (N) потрібно:</strong> ${data.totalNitrogenNeeded.toFixed(2)} кг/рік</p>
        <p><strong>Фосфор (P) отримається:</strong> ${data.phosphorusDelivered.toFixed(2)} кг/рік</p>
        <p><strong>Калій (K) отримається:</strong> ${data.potassiumDelivered.toFixed(2)} кг/рік</p>
        <p>Норма азоту: ${data.nitrogenNeeded} г/кв. м</p>
      </div>

      <div class="insight-card">
        <h4>📦 Кількість добрив</h4>
        <p><strong>Загальна потреба:</strong> ${data.fertilizerNeeded.toFixed(1)} кг/рік</p>
        <p><strong>На одне внесення:</strong> ${data.fertilizerPerApplication.toFixed(1)} кг</p>
        <p><strong>Кількість мішків (25 кг):</strong> ${data.bagsNeeded} мішків</p>
        <p><strong>Норма внесення:</strong> ${data.applicationRatePerSqM.toFixed(1)} г/кв. м</p>
      </div>

      <div class="insight-card">
        <h4>💰 Вартість</h4>
        <p><strong>Загальна вартість:</strong> ${data.totalCost.toFixed(0)} грн/рік</p>
        <p>Вартість за кв. м: ${(data.totalCost / data.area).toFixed(2)} грн</p>
        <p>Вартість за внесення: ${(data.totalCost / data.applicationTimes).toFixed(0)} грн</p>
      </div>

      <div class="insight-card">
        <h4>🔧 Налаштування розкидача</h4>
        <p><strong>Орієнтовне налаштування:</strong> ${data.spreaderSetting}</p>
        <p><small>🔍 Завжди калібруйте розкидач перед використанням!</small></p>
        <p><strong>Калібрування:</strong></p>
        <p>1. Наповніть розкидач добривами</p>
        <p>2. Пройдіть 30 м по під'їзді</p>
        <p>3. Зберіть та зважте добрива</p>
        <p>4. Регулюйте до ${data.applicationRatePerSqM.toFixed(1)} г/кв. м</p>
      </div>

      <div class="insight-card">
        <h4>📅 Сезонний графік внесення</h4>
        ${data.seasonalSchedule.map((schedule, index) => `<p><strong>${index + 1}.</strong> ${schedule}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>💡 Поради з внесення</h4>
        ${getApplicationTips(data.fertilizerForm, data.applicationTimes).map(tip => `<p>${tip}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>⚠️ Важливі поради безпеки</h4>
        <p>🧤 <strong>Захист:</strong> Використовуйте рукавички та захисний одяг</p>
        <p>💧 <strong>Полив:</strong> Злегка полийте після внесення гранульованих добрив</p>
        <p>🌧️ <strong>Погода:</strong> Не вносьте перед сильним дощем</p>
        <p>🚫 <strong>Передозування:</strong> Не перевищуйте рекомендовані норми</p>
        <p>🔒 <strong>Зберігання:</strong> Тримайте в сухому, недоступному для дітей місці</p>
      </div>

      <div class="insight-card">
        <h4>🌿 Ознаки правильного живлення</h4>
        <p>✅ <strong>Здоровий ріст:</strong> Рівномірний зелений колір листя</p>
        <p>✅ <strong>Сильна кореневоя система:</strong> Покращена стійкість до посухи</p>
        <p>✅ <strong>Стійкість до хвороб:</strong> Менше проблем з шкідниками</p>
        <p>⚠️ <strong>Надлишок азоту:</strong> Надмірно темно-зелене листя, м'який ріст</p>
        <p>⚠️ <strong>Дефіцит азоту:</strong> Жовтіння листя, повільний ріст</p>
      </div>

      <div class="insight-card">
        <h4>🌍 Екологічні міркування</h4>
        <p>🌊 <strong>Захист води:</strong> Не вносьте поблизу водойм</p>
        <p>♻️ <strong>Органічні варіанти:</strong> Розгляньте компост та органічні добрива</p>
        <p>📊 <strong>Ґрунтовий тест:</strong> Перевірте pH та поживні речовини ґрунту</p>
        <p>⏰ <strong>Правильний час:</strong> Вносьте згідно з потребами рослин</p>
        <p>🎯 <strong>Точність:</strong> Уникайте внесення на тротуари та доріжки</p>
      </div>
    `;
  }

  function getApplicationTips(form, times) {
    const tips = [];
    
    if (form === 'granular') {
      tips.push('🌧️ Вносьте гранульовані добрива перед легким дощем або полийте після внесення');
      tips.push('📏 Використовуйте розкидач для рівномірного розподілу');
      tips.push('🔄 Йдіть перпендикулярними смугами для кращого покриття');
    } else if (form === 'liquid') {
      tips.push('💧 Розчиняйте згідно з інструкціями виробника');
      tips.push('🌅 Вносьте рано вранці або ввечері, уникаючи спекотного сонця');
      tips.push('🎯 Рівномірно розподіляйте по всій площі');
    } else if (form === 'organic') {
      tips.push('🐛 Органічні добрива повільніше вивільняють поживні речовини');
      tips.push('🌱 Можуть покращити структуру та біологію ґрунту');
      tips.push('⏰ Вносьте раніше в сезоні, оскільки дія повільніша');
    }
    
    if (times >= 3) {
      tips.push('📅 Роздільне внесення знижує ризик опіків та втрат поживних речовин');
    }
    
    tips.push('📊 Ведіть записи внесень для відстеження ефективності');
    
    return tips;
  }
});