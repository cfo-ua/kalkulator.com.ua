document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('transportation-form');
  const result = document.getElementById('transportation-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const distance = parseFloat(document.getElementById('trip-distance').value);
      const tripsPerWeek = parseFloat(document.getElementById('trips-per-week').value);
      const transportMode = document.getElementById('transport-mode').value;
      const alternativeMode = document.getElementById('alternative-mode').value;
      const fuelPrice = parseFloat(document.getElementById('fuel-price').value);
      const electricityRate = parseFloat(document.getElementById('electricity-rate').value);
      const timePeriod = document.getElementById('time-period').value;
      
      if (distance <= 0 || tripsPerWeek <= 0 || !transportMode) {
        result.textContent = "Будь ласка, заповніть всі обов'язкові поля дійсними значеннями.";
        return;
      }
      
      // Parse transportation mode data
      const [modeName, co2PerKm, costPerKm, avgSpeedKph] = transportMode.split(',');
      const co2Grams = parseFloat(co2PerKm);
      const costBase = parseFloat(costPerKm);
      const avgSpeed = parseFloat(avgSpeedKph);
      
      // Calculate time multipliers
      const timeMultiplier = {
        'week': 1,
        'month': 4.33,
        'year': 52
      };
      
      const multiplier = timeMultiplier[timePeriod];
      const totalDistance = distance * tripsPerWeek * multiplier;
      
      // Calculate emissions
      const totalCO2Grams = totalDistance * co2Grams;
      const totalCO2Kg = totalCO2Grams / 1000;
      const totalCO2Tons = totalCO2Kg / 1000;
      
      // Calculate costs
      let totalCost = 0;
      if (modeName === 'gasoline' || modeName === 'diesel' || modeName === 'hybrid') {
        const fuelEfficiency = modeName === 'hybrid' ? 4.7 : modeName === 'diesel' ? 6.7 : 9.5; // L/100km
        const fuelUsed = (totalDistance / 100) * fuelEfficiency;
        totalCost = fuelUsed * fuelPrice;
      } else if (modeName === 'electric' || modeName === 'ebike') {
        const kwhPer100Km = modeName === 'electric' ? 18 : 0.9;
        const kwhUsed = (totalDistance / 100) * kwhPer100Km;
        totalCost = kwhUsed * electricityRate;
      } else if (modeName === 'bus' || modeName === 'train') {
        totalCost = totalDistance * costBase;
      }
      
      // Calculate time
      const totalTimeHours = avgSpeed > 0 ? totalDistance / avgSpeed : 0;
      const travelTimePerTrip = avgSpeed > 0 ? (distance / avgSpeed) * 60 : 0; // minutes
      
      // Calculate health benefits (calories burned for active transportation)
      let caloriesBurned = 0;
      if (modeName === 'walk') {
        caloriesBurned = totalDistance * 37; // ~37 calories per km walking
      } else if (modeName === 'bicycle') {
        caloriesBurned = totalDistance * 25; // ~25 calories per km cycling
      }
      
      // Calculate alternative mode if selected
      let alternativeData = null;
      if (alternativeMode) {
        const [altName, altCO2, altCost, altSpeed] = alternativeMode.split(',');
        const altCO2Total = totalDistance * parseFloat(altCO2);
        const altCO2Kg = altCO2Total / 1000;
        
        let altTotalCost = 0;
        if (altName === 'gasoline' || altName === 'diesel' || altName === 'hybrid') {
          const fuelEff = altName === 'hybrid' ? 4.7 : altName === 'diesel' ? 6.7 : 9.5;
          const fuel = (totalDistance / 100) * fuelEff;
          altTotalCost = fuel * fuelPrice;
        } else if (altName === 'electric' || altName === 'ebike') {
          const kwhPer100 = altName === 'electric' ? 18 : 0.9;
          const kwh = (totalDistance / 100) * kwhPer100;
          altTotalCost = kwh * electricityRate;
        } else if (altName === 'bus' || altName === 'train') {
          altTotalCost = totalDistance * parseFloat(altCost);
        }
        
        alternativeData = {
          name: altName,
          co2Kg: altCO2Kg,
          cost: altTotalCost,
          co2Savings: altCO2Kg - totalCO2Kg,
          costSavings: altTotalCost - totalCost
        };
      }
      
      // Environmental equivalents
      const treesNeeded = totalCO2Kg / 22; // Average tree absorbs ~22kg CO2/year
      const coalEquivalent = totalCO2Kg / 2.3; // ~2.3kg CO2 per kg coal
      const gasEquivalent = totalCO2Kg / 2.3; // ~2.3kg CO2 per liter gasoline
      
      const periods = {
        'week': 'тижневий',
        'month': 'місячний', 
        'year': 'річний'
      };
      
      const modeNames = {
        'walk': 'Ходьба',
        'bicycle': 'Велосипед',
        'ebike': 'Електровелосипед',
        'bus': 'Автобус',
        'train': 'Поїзд',
        'carpool': 'Спільна поїздка',
        'hybrid': 'Гібридний автомобіль',
        'gasoline': 'Бензиновий автомобіль',
        'diesel': 'Дизельний автомобіль',
        'electric': 'Електромобіль',
        'motorcycle': 'Мотоцикл'
      };

      result.innerHTML = `
        <div class="result-section">
          <h4>Аналіз транспорту (${periods[timePeriod]}):</h4>
          <p>Вид транспорту: ${modeNames[modeName]}</p>
          <p>Відстань за поїздку: ${distance} км</p>
          <p>Поїздок на тиждень: ${tripsPerWeek}</p>
          <p>Загальна відстань: ${totalDistance.toFixed(1)} км</p>
          ${avgSpeed > 0 ? `<p>Час в дорозі за поїздку: ${travelTimePerTrip.toFixed(1)} хвилин</p>` : ''}
        </div>
        
        <div class="result-emissions">
          <h4>Викиди вуглецю:</h4>
          <p><strong>${totalCO2Kg.toFixed(2)} кг CO₂</strong> (${totalCO2Tons.toFixed(3)} тонн)</p>
          <p>На кілометр: ${co2Grams.toFixed(0)} грам CO₂</p>
          <p>За поїздку: ${(distance * co2Grams / 1000).toFixed(2)} кг CO₂</p>
          ${totalCO2Kg > 0 ? `<p>Еквівалент спалювання ${coalEquivalent.toFixed(1)} кг вугілля</p>` : '<p>🌱 Нульові прямі викиди - чудовий вибір!</p>'}
        </div>
        
        <div class="result-cost">
          <h4>Аналіз витрат:</h4>
          <p><strong>Загальна вартість: ${totalCost.toFixed(2)} грн</strong></p>
          <p>Вартість на кілометр: ${(totalCost / totalDistance).toFixed(2)} грн</p>
          <p>Вартість за поїздку: ${(totalCost / (tripsPerWeek * multiplier)).toFixed(2)} грн</p>
          ${totalCost === 0 ? '<p>💰 Безкоштовний транспорт - економить гроші!</p>' : ''}
        </div>
        
        ${alternativeData ? `
        <div class="result-comparison">
          <h4>Порівняння з ${modeNames[alternativeData.name]}:</h4>
          <p><strong>Різниця CO₂:</strong> ${alternativeData.co2Savings > 0 ? 
            `${alternativeData.co2Savings.toFixed(2)} кг БІЛЬШЕ викидів` : 
            `${Math.abs(alternativeData.co2Savings).toFixed(2)} кг МЕНШЕ викидів`}</p>
          <p><strong>Різниця у вартості:</strong> ${alternativeData.costSavings > 0 ? 
            `${alternativeData.costSavings.toFixed(2)} грн ДОРОЖЧЕ` : 
            `${Math.abs(alternativeData.costSavings).toFixed(2)} грн ДЕШЕВШЕ`}</p>
          <p>Екологічний вплив: ${alternativeData.co2Savings > 0 ? '🌱 Поточний вибір кращий' : '⚠️ Альтернатива більш екологічна'}</p>
        </div>
        ` : ''}
        
        <div class="result-environmental">
          <h4>Екологічний контекст:</h4>
          ${totalCO2Kg > 0 ? `
            <p>🌳 Дерев для компенсації: ${treesNeeded.toFixed(1)} дерев на один рік</p>
            <p>🏭 Еквівалент: ${gasEquivalent.toFixed(1)} літрів бензину</p>
            <p>🌍 Глобальний вплив: Транспорт становить 14% глобальних викидів</p>
          ` : `
            <p>🌱 Нульові викиди - ви допомагаєте боротися зі зміною клімату!</p>
            <p>🌍 Кожен кілометр без викидів має значення для сталого розвитку</p>
          `}
          <p>🏙️ Місцева якість повітря: ${getAirQualityImpact(modeName)}</p>
        </div>
        
        ${caloriesBurned > 0 ? `
        <div class="result-health">
          <h4>Переваги для здоров'я:</h4>
          <p><strong>Спалені калорії: ${caloriesBurned.toFixed(0)} калорій</strong></p>
          <p>Еквівалент фізичних вправ: ${(caloriesBurned / 100).toFixed(1)} годин помірної активності</p>
          <p>Цінність для здоров'я: ~${(caloriesBurned * 0.20).toFixed(2)} грн економії на охороні здоров'я</p>
          <p>💪 Активний транспорт покращує серцево-судинне здоров'я</p>
          <p>🧠 Регулярні фізичні вправи покращують психічний стан</p>
        </div>
        ` : ''}
        
        <div class="result-recommendations">
          <h4>Рекомендації:</h4>
          ${getRecommendations(modeName, distance, totalCO2Kg).map(rec => `<p>${rec}</p>`).join('')}
        </div>
        
        <div class="result-tips">
          <h4>Поради для покращення:</h4>
          ${getImprovementTips(modeName, distance).map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-seasonal">
          <h4>Сезонні міркування:</h4>
          <p>☀️ Літо: Врахуйте спеку, вплив кондиціонера на ефективність</p>
          <p>❄️ Зима: Холодна погода знижує ефективність транспорту, одягайтеся тепло для активного транспорту</p>
          <p>🌧️ Дощ: Майте запасні плани, водонепроникне спорядження для велосипеда/ходьби</p>
          <p>🍂 Осінь/Весна: Ідеальна погода для активного транспорту</p>
        </div>
        
        <div class="result-offset">
          <h4>Варіанти компенсації вуглецю:</h4>
          ${totalCO2Kg > 0 ? `
            <p>💰 Вартість компенсації: ~${(totalCO2Kg * 0.88).toFixed(2)} грн (за 22 дол/тонна CO₂)</p>
            <p>🌳 Посадка дерев: Посадіть ${Math.ceil(treesNeeded)} дерев</p>
            <p>⚡ Відновлювана енергія: Підтримуйте проекти чистої енергії</p>
            <p>🏠 Ефективність дому: Покращіть утеплення, LED освітлення</p>
          ` : `
            <p>🌱 Компенсація не потрібна - ви вже вуглецево нейтральні для транспорту!</p>
            <p>🌟 Розгляньте підтримку інших у переході на чистий транспорт</p>
          `}
        </div>
        
        <div class="result-longterm">
          <h4>Довгостроковий вплив:</h4>
          <p>📊 Річний CO₂: ${(totalCO2Kg * (52 / multiplier)).toFixed(1)} кг на рік</p>
          <p>💵 Річна вартість: ${(totalCost * (52 / multiplier)).toFixed(0)} грн на рік</p>
          <p>🌍 Вплив за життя: Розгляньте загальний екологічний слід</p>
          <p>📈 Тенденція: Викиди транспорту змінюються з технологіями</p>
          <p>🎯 Мета: Прагніть до постійного покращення сталого розвитку</p>
        </div>
      `;
    });
  }

  function getAirQualityImpact(mode) {
    const impacts = {
      'walk': 'Немає місцевих забруднювачів - покращує якість повітря',
      'bicycle': 'Немає місцевих забруднювачів - покращує якість повітря', 
      'ebike': 'Мінімальний місцевий вплив - дуже чистий',
      'electric': 'Немає місцевих забруднювачів - чистіше міське повітря',
      'bus': 'Спільні викиди - краще за індивідуальні автомобілі',
      'train': 'Дуже низький вплив на особу місцево',
      'hybrid': 'Знижені місцеві забруднювачі проти звичайних автомобілів',
      'gasoline': 'Виробляє NOx, CO, частинки, що впливають на місцеве повітря',
      'diesel': 'Вищі NOx та частинки ніж бензин',
      'motorcycle': 'Менші загальні викиди, але менш ефективний на пасажира'
    };
    return impacts[mode] || 'Варіюється залежно від конкретного транспорту та умов';
  }

  function getRecommendations(mode, distance, co2Kg) {
    const recommendations = [];
    
    if (distance <= 1.6 && mode !== 'walk') {
      recommendations.push('🚶 Розгляньте ходьбу для поїздок менше 1,6 км');
    }
    
    if (distance <= 5 && mode !== 'bicycle' && mode !== 'walk') {
      recommendations.push('🚴 Велосипед може бути швидшим та чистішим для цієї відстані');
    }
    
    if (mode === 'gasoline' || mode === 'diesel') {
      recommendations.push('⚡ Розгляньте електромобіль або гібрид для регулярних поїздок');
      recommendations.push('🚌 Перевірте, чи доступний громадський транспорт на цьому маршруті');
    }
    
    if (co2Kg > 100) {
      recommendations.push('🌱 Високі викиди - розгляньте поєднання поїздок або альтернативні види транспорту');
    }
    
    recommendations.push('📱 Використовуйте додатки для пошуку найефективніших маршрутів та видів транспорту');
    
    return recommendations;
  }

  function getImprovementTips(mode, distance) {
    const tips = [];
    
    if (mode === 'gasoline' || mode === 'diesel') {
      tips.push('⛽ Обслуговуйте ваш транспорт: правильний тиск у шинах, регулярне технічне обслуговування');
      tips.push('🚗 Поєднуйте справи в одну поїздку, коли можливо');
      tips.push('🏃 Використовуйте еко-водіння: плавне прискорення, підтримання постійної швидкості');
    }
    
    if (mode === 'electric') {
      tips.push('☀️ Заряджайте від відновлюваної енергії, якщо доступно');
      tips.push('🔋 Попередньо кондиціонуйте батарею в екстремальну погоду');
    }
    
    tips.push('📅 Плануйте поїздки, щоб уникати пікового трафіку та зменшити холостий хід');
    tips.push('👥 Розгляньте спільні поїздки для поділу викидів з іншими');
    tips.push('🏠 Обирайте житло ближче до роботи та зручностей, коли можливо');
    
    return tips;
  }
});