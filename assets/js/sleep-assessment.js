document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('sleep-assessment-form');
  const result = document.getElementById('sleep-assessment-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const sleepHours = +form['sleep-hours'].value;
    const fallAsleep = form['fall-asleep'].value;
    const nightAwakenings = form['night-awakenings'].value;
    const morningFeeling = form['morning-feeling'].value;
    const sleepConsistency = form['sleep-consistency'].value;
    const napping = form.napping.value;
    const caffeine = form.caffeine.value;
    const alcohol = form.alcohol.value;
    const exercise = form.exercise.value;
    const screenTime = form['screen-time'].value;
    const stress = form.stress.value;

    // Validation
    if (!age || !gender || !sleepHours || !fallAsleep || !nightAwakenings || 
        !morningFeeling || !sleepConsistency || !napping || !caffeine || !alcohol || 
        !exercise || !screenTime || !stress) {
      result.innerHTML = '<p style="color:red;">Будь ласка, дайте відповідь на всі питання для точної оцінки.</p>';
      return;
    }

    // Age-based sleep recommendations
    let optimalSleepMin, optimalSleepMax;
    if (age >= 18 && age <= 25) {
      optimalSleepMin = 7; optimalSleepMax = 9;
    } else if (age >= 26 && age <= 64) {
      optimalSleepMin = 7; optimalSleepMax = 9;
    } else { // 65+
      optimalSleepMin = 7; optimalSleepMax = 8;
    }

    // Calculate sleep score components (0-100 scale)
    let sleepScore = 0;
    let scoreBreakdown = {};

    // 1. Sleep Duration Score (25 points)
    let durationScore = 0;
    if (sleepHours >= optimalSleepMin && sleepHours <= optimalSleepMax) {
      durationScore = 25;
    } else if (sleepHours >= optimalSleepMin - 0.5 && sleepHours <= optimalSleepMax + 0.5) {
      durationScore = 20;
    } else if (sleepHours >= optimalSleepMin - 1 && sleepHours <= optimalSleepMax + 1) {
      durationScore = 15;
    } else if (sleepHours >= 5 && sleepHours <= 11) {
      durationScore = 10;
    } else {
      durationScore = 5;
    }
    scoreBreakdown.duration = durationScore;

    // 2. Sleep Onset Score (15 points)
    let onsetScore = 0;
    if (fallAsleep === 'immediate') onsetScore = 15;
    else if (fallAsleep === 'quick') onsetScore = 12;
    else if (fallAsleep === 'normal') onsetScore = 10;
    else if (fallAsleep === 'slow') onsetScore = 6;
    else onsetScore = 2;
    scoreBreakdown.onset = onsetScore;

    // 3. Night Awakenings Score (15 points)
    let awakeningsScore = 0;
    if (nightAwakenings === 'never') awakeningsScore = 15;
    else if (nightAwakenings === 'once') awakeningsScore = 12;
    else if (nightAwakenings === 'twice') awakeningsScore = 8;
    else awakeningsScore = 4;
    scoreBreakdown.awakenings = awakeningsScore;

    // 4. Wake Feeling Score (15 points)
    let wakeFeelingScore = 0;
    if (morningFeeling === 'refreshed') wakeFeelingScore = 15;
    else if (morningFeeling === 'good') wakeFeelingScore = 12;
    else if (morningFeeling === 'okay') wakeFeelingScore = 8;
    else if (morningFeeling === 'tired') wakeFeelingScore = 5;
    else wakeFeelingScore = 2;
    scoreBreakdown.wakeFeeling = wakeFeelingScore;

    // 5. Sleep Consistency Score (10 points)
    let consistencyScore = 0;
    if (sleepConsistency === 'very-consistent') consistencyScore = 10;
    else if (sleepConsistency === 'mostly-consistent') consistencyScore = 8;
    else if (sleepConsistency === 'somewhat-variable') consistencyScore = 5;
    else consistencyScore = 2;
    scoreBreakdown.consistency = consistencyScore;

    // 6. Lifestyle Factors Score (20 points total)
    let lifestyleScore = 0;

    // Napping (3 points)
    if (napping === 'never') lifestyleScore += 3;
    else if (napping === 'occasional') lifestyleScore += 2;
    else if (napping === 'regular') lifestyleScore += 1;

    // Caffeine (4 points)
    if (caffeine === 'none' || caffeine === 'morning') lifestyleScore += 4;
    else if (caffeine === 'afternoon') lifestyleScore += 2;
    else lifestyleScore += 1;

    // Alcohol (3 points)
    if (alcohol === 'never') lifestyleScore += 3;
    else if (alcohol === 'rarely') lifestyleScore += 2;
    else if (alcohol === 'weekly') lifestyleScore += 1;

    // Exercise (4 points)
    if (exercise === 'moderate') lifestyleScore += 4;
    else if (exercise === 'light' || exercise === 'intense') lifestyleScore += 3;
    else lifestyleScore += 1;

    // Screen time (3 points)
    if (screenTime === 'none') lifestyleScore += 3;
    else if (screenTime === 'minimal') lifestyleScore += 2;
    else if (screenTime === 'moderate') lifestyleScore += 1;

    // Stress (3 points)
    if (stress === 'low') lifestyleScore += 3;
    else if (stress === 'moderate') lifestyleScore += 2;
    else if (stress === 'high') lifestyleScore += 1;

    scoreBreakdown.lifestyle = lifestyleScore;

    // Calculate total score
    sleepScore = durationScore + onsetScore + awakeningsScore + wakeFeelingScore + consistencyScore + lifestyleScore;

    // Determine sleep quality category
    let qualityCategory, qualityColor, qualityDescription;
    if (sleepScore >= 90) {
      qualityCategory = 'Відмінна';
      qualityColor = '#28a745';
      qualityDescription = 'Якість вашого сну відмінна! У вас оптимальні звички сну та тривалість.';
    } else if (sleepScore >= 75) {
      qualityCategory = 'Добра';
      qualityColor = '#6f9f6f';
      qualityDescription = 'У вас добра якість сну з незначними областями для покращення.';
    } else if (sleepScore >= 60) {
      qualityCategory = 'Задовільна';
      qualityColor = '#ffc107';
      qualityDescription = 'Якість вашого сну задовільна. Кілька покращень можуть підвищити ваш відпочинок.';
    } else if (sleepScore >= 40) {
      qualityCategory = 'Погана';
      qualityColor = '#fd7e14';
      qualityDescription = 'Якість вашого сну погана. Необхідні значні зміни для кращого здоров\'я.';
    } else {
      qualityCategory = 'Дуже погана';
      qualityColor = '#dc3545';
      qualityDescription = 'Якість вашого сну дуже погана. Розгляньте консультацію з лікарем.';
    }

    // Generate personalized recommendations
    let recommendations = [];
    
    if (durationScore < 20) {
      if (sleepHours < optimalSleepMin) {
        recommendations.push('⏰ Збільшіть тривалість сну: Прагніть до ' + optimalSleepMin + '-' + optimalSleepMax + ' годин на ніч');
      } else {
        recommendations.push('⏰ Зменшіть тривалість сну: Занадто багато сну може бути контрпродуктивним');
      }
    }
    
    if (onsetScore < 12) {
      recommendations.push('😴 Покращіть засинання: Спробуйте техніки релаксації, обмежте час біля екранів, тримайте спальню прохолодною');
    }
    
    if (awakeningsScore < 12) {
      recommendations.push('🌙 Зменшіть нічні пробудження: Уникайте великих прийомів їжі/напоїв перед сном, оптимізуйте середовище спальні');
    }
    
    if (wakeFeelingScore < 12) {
      recommendations.push('☀️ Покращіть ранкову пильність: Забезпечте постійний час пробудження, отримуйте ранкове сонячне світло');
    }
    
    if (consistencyScore < 8) {
      recommendations.push('📅 Підтримуйте постійний розклад: Лягайте спати та прокидайтеся в один час щодня, навіть у вихідні');
    }
    
    if (caffeine === 'evening') {
      recommendations.push('☕ Обмежте вечірній кофеїн: Уникайте кофеїну за 6+ годин до сну');
    }
    
    if (alcohol === 'weekly' || alcohol === 'daily') {
      recommendations.push('🍷 Зменшіть вечірній алкоголь: Алкоголь порушує якість сну та REM-фазу');
    }
    
    if (screenTime === 'moderate' || screenTime === 'heavy') {
      recommendations.push('📱 Зменшіть час біля екранів перед сном: Блакитне світло порушує циркадний ритм');
    }
    
    if (exercise === 'none') {
      recommendations.push('🏃 Додайте регулярні фізичні вправи: Фізична активність покращує якість сну (але не близько до сну)');
    }
    
    if (stress === 'high' || stress === 'very-high') {
      recommendations.push('🧘 Керуйте стресом: Медитація, дихальні вправи, йога можуть покращити сон');
    }

    // Specific recommendations based on problems
    if (napping === 'daily' || napping === 'regular') {
      recommendations.push('💤 Обмежте денний сон: Тривалі або пізні дрімоти можуть заважати нічному сну');
    }

    // Age-specific recommendations
    if (age >= 65 && sleepHours > 8.5) {
      recommendations.push('👴 Віковий фактор: Старшим людям зазвичай потрібно менше сну, але вищої якості');
    }

    // Sleep duration categories
    let durationCategory = '';
    if (sleepHours < 6) {
      durationCategory = 'Недостатній сон';
    } else if (sleepHours >= 6 && sleepHours < 7) {
      durationCategory = 'Коротший сон';
    } else if (sleepHours >= 7 && sleepHours <= 9) {
      durationCategory = 'Рекомендована тривалість';
    } else {
      durationCategory = 'Тривалий сон';
    }

    // Component score meanings
    const componentMeanings = {
      duration: 'Тривалість сну',
      onset: 'Швидкість засинання',
      awakenings: 'Нічні пробудження',
      wakeFeeling: 'Ранкове самопочуття',
      consistency: 'Постійність режиму',
      lifestyle: 'Фактори способу життя'
    };

    result.innerHTML = `
      <div class="mental-health-results">
        <h3 style="color:#157aff;margin-top:0;text-align:center;">😴 Оцінка якості вашого сну</h3>
        
        <div class="insight-cards">
          <div class="insight-card ${sleepScore >= 75 ? 'success' : sleepScore >= 60 ? 'warning' : 'info'}" style="border-color: ${qualityColor};">
            <h6>🌙 Загальна оцінка сну</h6>
            <div class="big-number" style="color: ${qualityColor};">${sleepScore}</div>
            <p>із 100 балів</p>
          </div>
          
          <div class="insight-card ${sleepHours >= optimalSleepMin && sleepHours <= optimalSleepMax ? 'success' : 'warning'}">
            <h6>⏰ Тривалість сну</h6>
            <div class="big-number">${sleepHours}</div>
            <p>годин на ніч</p>
          </div>
          
          <div class="insight-card info">
            <h6>📊 Категорія якості</h6>
            <div class="big-number" style="color: ${qualityColor}; font-size: 1.2em;">${qualityCategory}</div>
            <p>${durationCategory}</p>
          </div>
        </div>

        <div class="insight-card ${sleepScore >= 75 ? 'success' : sleepScore >= 60 ? 'warning' : 'info'}" style="margin: 20px 0; border-color: ${qualityColor};">
          <h4 style="color: ${qualityColor}; margin: 5px 0; text-align: center;">${qualityCategory} якість сну</h4>
          <p style="margin: 10px 0; text-align: center;">${qualityDescription}</p>
          
          ${sleepScore >= 90 ? `
          <div style="text-align: center; padding: 15px; background: rgba(40, 167, 69, 0.1); border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0; color: #28a745;"><strong>🎉 Вітаємо!</strong> Ваші звички сну є зразковими. Продовжуйте підтримувати цей відмінний режим!</p>
          </div>
          ` : sleepScore < 40 ? `
          <div style="text-align: center; padding: 15px; background: rgba(220, 53, 69, 0.1); border-color: #dc3545; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0; color: #dc3545;"><strong>⚠️ Увага!</strong> Серйозні проблеми зі сном можуть впливати на здоров'я. Розгляньте консультацію з лікарем або спеціалістом зі сну.</p>
          </div>
          ` : ''}
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📋 Детальний аналіз компонентів</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            ${Object.entries(scoreBreakdown).map(([key, score]) => {
              const maxScores = {duration: 25, onset: 15, awakenings: 15, wakeFeeling: 15, consistency: 10, lifestyle: 20};
              const percentage = Math.round((score / maxScores[key]) * 100);
              const color = percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#fd7e14';
              return `
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <h6 style="margin: 0 0 10px 0; color: #333;">${componentMeanings[key]}</h6>
                  <div style="font-size: 1.5em; font-weight: bold; color: ${color};">${score}/${maxScores[key]}</div>
                  <div style="font-size: 0.9em; color: #666;">${percentage}%</div>
                  <div style="width: 100%; background: #e9ecef; border-radius: 10px; height: 8px; margin: 10px 0;">
                    <div style="width: ${percentage}%; background: ${color}; height: 100%; border-radius: 10px; transition: width 0.3s ease;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📊 Рекомендації для вашого віку</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #157aff; margin-top: 0;">⏰ Оптимальна тривалість</h6>
              <p style="margin: 5px 0;"><strong>${optimalSleepMin}-${optimalSleepMax} годин</strong> для вашого віку (${age} років)</p>
              <p style="font-size: 0.9em; color: #666;">Ваш поточний сон: ${sleepHours} годин</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #157aff; margin-top: 0;">🎯 Ідеальний режим</h6>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9em;">
                <li>Постійний час сну та пробудження</li>
                <li>Засинання за 15-30 хвилин</li>
                <li>Мінімум нічних пробуджень</li>
                <li>Енергійне пробудження</li>
              </ul>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card warning" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #e65100;">💡 Персональні рекомендації для покращення</h4>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">🌙 План покращення гігієни сну</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🛏️ Середовище для сну:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Прохолодна кімната (15-19°C)</li>
                <li>Повна темрява або маска для сну</li>
                <li>Тихе середовище або беруші</li>
                <li>Зручний матрас та подушки</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">📅 Режим та звички:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Постійний час сну (навіть у вихідні)</li>
                <li>Релаксуючий ритуал перед сном</li>
                <li>Уникайте денного сну після 15:00</li>
                <li>Обмежте кофеїн після 14:00</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🧘 Техніки релаксації:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Глибоке дихання або медитація</li>
                <li>Прогресивна м'язова релаксація</li>
                <li>Читання або легка музика</li>
                <li>Теплий душ або ванна</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🏃 Денна активність:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Регулярні фізичні вправи</li>
                <li>Сонячне світло вранці</li>
                <li>Обмеження екранів перед сном</li>
                <li>Управління стресом</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #0056b3;">📈 Відстеження прогресу</h4>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <p style="margin: 0 0 10px 0;"><strong>Рекомендації для моніторингу:</strong></p>
            <ul style="margin: 0; font-size: 0.9em;">
              <li>📝 Ведіть щоденник сну протягом 2 тижнів</li>
              <li>⏰ Записуйте час засинання та пробудження</li>
              <li>💭 Оцінюйте якість сну від 1 до 10 щоранку</li>
              <li>📊 Повторіть цю оцінку через місяць</li>
              <li>🏥 Зверніться до лікаря, якщо проблеми зберігаються</li>
            </ul>
          </div>
        </div>

        <div class="disclaimer" style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            😴 <strong>Пам'ятайте:</strong> Ця оцінка надає загальні рекомендації на основі дослідження сну. Якщо у вас постійні проблеми зі сном або підозра на розлад сну, проконсультуйтеся з лікарем або спеціалістом зі сну.
          </p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});