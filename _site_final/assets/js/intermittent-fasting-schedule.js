document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('intermittent-fasting-schedule-form');
  const result = document.getElementById('intermittent-fasting-schedule-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const goal = form.goal.value;
    const experience = form.experience.value;
    const workSchedule = form['work-schedule'].value;
    const wakeTime = form['wake-time'].value;
    const sleepTime = form['sleep-time'].value;
    const workoutTime = form['workout-time'].value;
    const socialMeals = form['social-meals'].value;
    const skipMeal = form['skip-meal'].value;
    const hungerTolerance = form['hunger-tolerance'].value;
    const weekendPreference = form['weekend-preference'].value;
    const energyLevels = form['energy-levels'].value;
    
    // Get health considerations
    const healthCheckboxes = form.querySelectorAll('input[name="health-considerations"]:checked');
    const healthConsiderations = Array.from(healthCheckboxes).map(cb => cb.value);

    // Validation
    if (!goal || !experience || !workSchedule || !wakeTime || !sleepTime || 
        !workoutTime || !socialMeals || !skipMeal || !hungerTolerance || 
        !weekendPreference || !energyLevels || healthConsiderations.length === 0) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі поля та оберіть принаймні одну опцію міркувань щодо здоров\'я.</p>';
      return;
    }

    // Parse times
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    
    // Calculate wake time in minutes from midnight
    const wakeMinutes = wakeHour * 60 + wakeMin;
    const sleepMinutes = sleepHour * 60 + sleepMin;

    // Recommend IF method based on inputs
    let recommendedMethod = '';
    let fastingHours = 16;
    let eatingHours = 8;
    let methodDescription = '';
    let difficulty = '';

    // Check for health concerns that might affect recommendations
    const hasHealthConcerns = healthConsiderations.some(h => h !== 'none');
    const hasEatingHistory = healthConsiderations.includes('eating-history');
    const hasMedicationRequirements = healthConsiderations.includes('medications');
    
    if (hasEatingHistory) {
      result.innerHTML = `
        <div style="background:#f8d7da;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#721c24;margin-top:0;">⚠️ Важливе повідомлення</h3>
          <p style="color:#721c24;">
            Зважаючи на вашу історію розладів харчування, інтервальне голодування може бути неприйнятним. 
            Будь ласка, проконсультуйтеся з медичним працівником або зареєстрованим дієтологом перед початком 
            будь-якого протоколу голодування. Ваше здоров'я та благополуччя є найвищим пріоритетом.
          </p>
        </div>
      `;
      return;
    }

    // Determine method based on experience and other factors
    if (experience === 'beginner') {
      if (hungerTolerance === 'low') {
        recommendedMethod = '14:10';
        fastingHours = 14;
        eatingHours = 10;
        difficulty = 'Легко';
        methodDescription = 'М\'яке введення в ІГ з 14-годинним голодуванням та 10-годинним вікном прийому їжі.';
      } else {
        recommendedMethod = '16:8';
        fastingHours = 16;
        eatingHours = 8;
        difficulty = 'Помірно';
        methodDescription = 'Найпопулярніший ІГ метод з 16-годинним голодуванням та 8-годинним вікном прийому їжі.';
      }
    } else if (experience === 'some-experience') {
      recommendedMethod = '16:8';
      fastingHours = 16;
      eatingHours = 8;
      difficulty = 'Помірно';
      methodDescription = 'Класичний метод 16:8 - доведений ефективний та стійкий для більшості людей.';
    } else if (experience === 'experienced') {
      if (goal === 'weight-loss' && hungerTolerance === 'high') {
        recommendedMethod = '18:6';
        fastingHours = 18;
        eatingHours = 6;
        difficulty = 'Складно';
        methodDescription = 'Подовжене голодування для посиленого схуднення та метаболічних переваг.';
      } else {
        recommendedMethod = '16:8';
        fastingHours = 16;
        eatingHours = 8;
        difficulty = 'Помірно';
        methodDescription = 'Підтримуйте доведений метод 16:8 для послідовності та стійкості.';
      }
    } else { // advanced
      if (goal === 'weight-loss' && hungerTolerance === 'very-high') {
        recommendedMethod = 'ОМАД (23:1)';
        fastingHours = 23;
        eatingHours = 1;
        difficulty = 'Дуже складно';
        methodDescription = 'Одна їжа в день - максимальні переваги аутофагії та схуднення.';
      } else if (hungerTolerance === 'high') {
        recommendedMethod = '20:4';
        fastingHours = 20;
        eatingHours = 4;
        difficulty = 'Складно';
        methodDescription = 'Подовжене голодування з 4-годинним вікном прийому їжі для досвідчених практиків.';
      } else {
        recommendedMethod = '18:6';
        fastingHours = 18;
        eatingHours = 6;
        difficulty = 'Складно';
        methodDescription = 'Подовжене 18-годинне голодування з 6-годинним вікном прийому їжі.';
      }
    }

    // Adjust for health considerations
    if (healthConsiderations.includes('diabetes')) {
      if (fastingHours > 16) {
        recommendedMethod = '16:8';
        fastingHours = 16;
        eatingHours = 8;
        methodDescription += ' (Модифіковано для управління цукром в крові)';
      }
    }

    // Calculate optimal eating window based on preferences and schedule
    let startTime, endTime;
    
    if (skipMeal === 'breakfast' || skipMeal === 'flexible') {
      // Skip breakfast - most common approach
      if (socialMeals === 'regular' || socialMeals === 'frequent') {
        // Accommodate family dinners
        endTime = 20; // 8 PM
        startTime = endTime - eatingHours;
      } else if (workSchedule === 'regular-9-5') {
        // Standard lunch and dinner
        startTime = 12; // 12 PM
        endTime = startTime + eatingHours;
      } else {
        // Optimize based on wake time
        startTime = Math.max(10, wakeHour + 4); // At least 4 hours after waking
        endTime = startTime + eatingHours;
      }
    } else if (skipMeal === 'lunch') {
      // Early dinner approach
      startTime = Math.max(7, wakeHour + 1); // 1 hour after waking
      endTime = startTime + eatingHours;
    } else if (skipMeal === 'dinner') {
      // Late breakfast/lunch approach
      startTime = Math.max(8, wakeHour + 2); // 2 hours after waking
      endTime = Math.min(16, startTime + eatingHours); // End by 4 PM
    }

    // Ensure times are within reasonable bounds
    startTime = Math.max(6, Math.min(16, startTime));
    endTime = Math.max(12, Math.min(22, endTime));
    
    // Adjust if window is too small due to bounds
    if (endTime - startTime < eatingHours) {
      if (startTime <= 12) {
        endTime = startTime + eatingHours;
      } else {
        startTime = endTime - eatingHours;
      }
    }

    // Format times
    const formatTime = (hour) => {
      return `${hour}:00`;
    };

    const fastStart = endTime;
    const fastEnd = startTime + 24; // Next day

    // Generate weekly schedule
    const weeklySchedule = [
      'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'
    ].map(day => {
      let dayStartTime = startTime;
      let dayEndTime = endTime;
      
      // Adjust weekend schedule if needed
      if ((day === 'Субота' || day === 'Неділя') && weekendPreference !== 'same') {
        if (weekendPreference === 'flexible' || weekendPreference === 'social') {
          // Add 1-2 hours flexibility
          dayStartTime = Math.max(8, startTime - 1);
          dayEndTime = Math.min(22, endTime + 2);
          return {
            day,
            eating: `${formatTime(dayStartTime)} - ${formatTime(dayEndTime)}`,
            note: 'Гнучкий час для соціальних активностей'
          };
        } else if (weekendPreference === 'relaxed') {
          return {
            day,
            eating: 'Інтуїтивне харчування',
            note: 'Слухайте своє тіло'
          };
        }
      }
      
      return {
        day,
        eating: `${formatTime(dayStartTime)} - ${formatTime(dayEndTime)}`,
        note: ''
      };
    });

    // Generate personalized tips
    let tips = [];
    
    if (experience === 'beginner') {
      tips.push('🌟 Починайте поступово: Спробуйте 12:12 перший тиждень, потім подовжуйте до вашого цільового розкладу');
      tips.push('💧 Залишайтеся гідратованими: П\'ємо багато води, трав\'яного чаю та чорної кави під час голодування');
    }
    
    if (workoutTime !== 'none') {
      if (workoutTime === 'morning' && startTime > 12) {
        tips.push('🏋️ Паливо перед тренуванням: Розгляньте невеликий перекус, якщо тренування натще здається складним');
      } else {
        tips.push('🏋️ Харчування після тренування: Плануйте першу їжу протягом 2 годин після інтенсивних тренувань');
      }
    }
    
    if (socialMeals === 'frequent') {
      tips.push('👥 Соціальна гнучкість: Нормально корегувати ваше вікно для важливих соціальних подій');
    }
    
    if (energyLevels === 'low') {
      tips.push('⚡ Управління енергією: Моніторьте ваші рівні енергії та корегуйте довжину голодування за потреби');
    }
    
    if (hasMedicationRequirements) {
      tips.push('💊 Час прийому ліків: Координуйте з вашим лікарем щодо прийому ліків під час періодів голодування');
    }

    // Warnings
    let warnings = [];
    
    if (healthConsiderations.includes('diabetes')) {
      warnings.push('⚠️ Моніторинг цукру в крові: Регулярно перевіряйте рівні глюкози та корегуйте за потреби');
    }
    
    if (healthConsiderations.includes('high-stress')) {
      warnings.push('⚠️ Управління стресом: Високий стрес може ускладнити голодування - надавайте пріоритет сну та розслабленню');
    }
    
    if (fastingHours > 18) {
      warnings.push('⚠️ Подовжене голодування: Це просунутий протокол - переконайтеся, що ви отримуєте адекватне харчування');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваш персоналізований розклад інтервального голодування</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <h4 style="color:#157aff;margin-top:0;">Рекомендований метод: ${recommendedMethod}</h4>
          <div style="display:flex;justify-content:center;align-items:center;gap:20px;flex-wrap:wrap;margin:20px 0;">
            <div style="text-align:center;">
              <div style="background:#dc3545;color:white;padding:15px;border-radius:8px;margin-bottom:8px;">
                <div style="font-size:1.5em;font-weight:bold;">${fastingHours} годин</div>
                <div style="font-size:0.9em;">Період голодування</div>
              </div>
            </div>
            <div style="font-size:1.5em;color:#ccc;">+</div>
            <div style="text-align:center;">
              <div style="background:#28a745;color:white;padding:15px;border-radius:8px;margin-bottom:8px;">
                <div style="font-size:1.5em;font-weight:bold;">${eatingHours} годин</div>
                <div style="font-size:0.9em;">Вікно прийому їжі</div>
              </div>
            </div>
          </div>
          <p style="color:#666;margin:10px 0;"><strong>Складність:</strong> ${difficulty}</p>
          <p style="color:#666;margin:0;">${methodDescription}</p>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Ваш щоденний розклад</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="background:#d4edda;padding:15px;border-radius:6px;">
              <h5 style="color:#155724;margin-top:0;">🍽️ Вікно прийому їжі</h5>
              <div style="font-size:1.2em;font-weight:bold;color:#155724;">${formatTime(startTime)} - ${formatTime(endTime)}</div>
              <div style="color:#155724;font-size:0.9em;margin-top:5px;">Час для всіх страв та перекусів</div>
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;">
              <h5 style="color:#721c24;margin-top:0;">⏰ Період голодування</h5>
              <div style="font-size:1.2em;font-weight:bold;color:#721c24;">${formatTime(endTime)} - ${formatTime(startTime)} (наступний день)</div>
              <div style="color:#721c24;font-size:0.9em;margin-top:5px;">Тільки вода, чай, чорна кава</div>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Тижневий розклад</h4>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">День</th>
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Вікно прийому їжі</th>
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Примітки</th>
                </tr>
              </thead>
              <tbody>
                ${weeklySchedule.map(schedule => `
                  <tr>
                    <td style="padding:10px;border-bottom:1px solid #dee2e6;font-weight:bold;">${schedule.day}</td>
                    <td style="padding:10px;border-bottom:1px solid #dee2e6;">${schedule.eating}</td>
                    <td style="padding:10px;border-bottom:1px solid #dee2e6;color:#666;font-size:0.9em;">${schedule.note}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Приклад часу прийому їжі</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            ${eatingHours >= 8 ? `
              <div style="text-align:center;padding:10px;background:#fff3cd;border-radius:4px;">
                <div style="font-weight:bold;color:#856404;">Перша їжа</div>
                <div style="color:#856404;">${formatTime(startTime)}</div>
                <div style="font-size:0.8em;color:#856404;">Перерва голодування</div>
              </div>
              <div style="text-align:center;padding:10px;background:#d1ecf1;border-radius:4px;">
                <div style="font-weight:bold;color:#0c5460;">Обід/Перекус</div>
                <div style="color:#0c5460;">${formatTime(Math.round((startTime + endTime) / 2))}</div>
                <div style="font-size:0.8em;color:#0c5460;">Середина вікна</div>
              </div>
              <div style="text-align:center;padding:10px;background:#d4edda;border-radius:4px;">
                <div style="font-weight:bold;color:#155724;">Остання їжа</div>
                <div style="color:#155724;">${formatTime(endTime - 1)}</div>
                <div style="font-size:0.8em;color:#155724;">Закінчення вікна прийому їжі</div>
              </div>
            ` : eatingHours >= 6 ? `
              <div style="text-align:center;padding:10px;background:#fff3cd;border-radius:4px;">
                <div style="font-weight:bold;color:#856404;">Перша їжа</div>
                <div style="color:#856404;">${formatTime(startTime)}</div>
                <div style="font-size:0.8em;color:#856404;">Велика страва для перерви голодування</div>
              </div>
              <div style="text-align:center;padding:10px;background:#d4edda;border-radius:4px;">
                <div style="font-weight:bold;color:#155724;">Друга їжа</div>
                <div style="color:#155724;">${formatTime(endTime - 1)}</div>
                <div style="font-size:0.8em;color:#155724;">Повне харчування</div>
              </div>
            ` : `
              <div style="text-align:center;padding:15px;background:#fff3cd;border-radius:4px;">
                <div style="font-weight:bold;color:#856404;">Одна велика страва</div>
                <div style="color:#856404;">${formatTime(startTime)}</div>
                <div style="font-size:0.8em;color:#856404;">Все щоденне харчування в одній стравіr</div>
              </div>
            `}
          </div>
        </div>

        ${tips.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Персоналізовані поради для успіху</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Важливі міркування</h4>
          <ul style="margin:5px 0;color:#856404;">
            ${warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🎯 План дій для початку</h4>
          <ol style="margin:5px 0;color:#155724;">
            <li><strong>Тиждень 1:</strong> ${experience === 'beginner' ? 'Почніть з 12:12 для поступової адаптації' : 'Розпочніть ваш рекомендований розклад'}</li>
            <li><strong>Тиждень 2-3:</strong> ${experience === 'beginner' ? 'Перейдіть до вашого цільового розкладу' : 'Точно налаштуйте час на основі енергії та голоду'}</li>
            <li><strong>Тиждень 4+:</strong> Підтримуйте послідовність та моніторьте самопочуття</li>
            <li><strong>Поточно:</strong> Корегуйте час вікна для соціальних подій за потреби</li>
            <li><strong>Щомісяця:</strong> Переоцініть та змініть, якщо обставини життя змінюються</li>
          </ol>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">🍽️ Що їсти під час вашого вікна</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;color:#383d41;font-size:0.9em;">
            <div>
              <strong>Білки:</strong> Нежирне м'ясо, риба, яйця, бобові, грецький йогурт
            </div>
            <div>
              <strong>Здорові жири:</strong> Авокадо, горіхи, оливкова олія, насіння
            </div>
            <div>
              <strong>Складні вуглеводи:</strong> Овочі, фрукти, цільні зерна, солодка картопля
            </div>
            <div>
              <strong>Гідратація:</strong> Вода, трав'яні чаї, електроліти за потреби
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});