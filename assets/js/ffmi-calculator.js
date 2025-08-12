document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('ffmi-form');
  const result = document.getElementById('ffmi-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const gender = form.gender.value;
    const height = +form.height.value;
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const bodyFatPercent = +form['body-fat'].value;
    const measurementMethod = form['measurement-method'].value;
    const trainingLevel = form['training-level'].value;
    const trainingFrequency = +form['training-frequency'].value;

    // Validation
    if (!gender || !height || !weightInput || !bodyFatPercent || !trainingLevel || trainingFrequency === '') {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    // Convert weight to kg
    const weightKg = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Calculate fat mass and lean body mass
    const fatMass = (bodyFatPercent / 100) * weightKg;
    const leanBodyMass = weightKg - fatMass;

    // Calculate FFMI
    const heightM = height / 100;
    const ffmi = leanBodyMass / (heightM * heightM);

    // Calculate normalized FFMI (adjusted for height)
    const normalizedFFMI = ffmi + (6.1 * (1.8 - heightM));

    // Calculate BMI for comparison
    const bmi = weightKg / (heightM * heightM);

    // Determine FFMI category based on gender
    let category, categoryColor, categoryDescription, naturalLimit;
    
    if (gender === 'male') {
      naturalLimit = 25;
      if (ffmi < 16) {
        category = 'Низький';
        categoryColor = '#dc3545';
        categoryDescription = 'Недостатня м\'язова маса. Рекомендуються силові тренування та збільшення споживання протеїну.';
      } else if (ffmi < 18) {
        category = 'Нормальний';
        categoryColor = '#ffc107';
        categoryDescription = 'Середній рівень м\'язової маси для нетренованої людини. Є потенціал для значного покращення.';
      } else if (ffmi < 20) {
        category = 'Добрий';
        categoryColor = '#17a2b8';
        categoryDescription = 'Хороша м\'язова маса. Результат регулярних тренувань та правильного харчування.';
      } else if (ffmi < 22) {
        category = 'Відмінний';
        categoryColor = '#28a745';
        categoryDescription = 'Відмінна м\'язова маса. Рівень досвідченого атлета або бодібілдера.';
      } else if (ffmi < 25) {
        category = 'Елітний';
        categoryColor = '#6f42c1';
        categoryDescription = 'Елітний рівень м\'язової маси. Результат багаторічних інтенсивних тренувань.';
      } else {
        category = 'Екстремальний';
        categoryColor = '#e83e8c';
        categoryDescription = 'Екстремальний рівень м\'язової маси, що часто перевищує природні генетичні межі.';
      }
    } else {
      naturalLimit = 20;
      if (ffmi < 14) {
        category = 'Низький';
        categoryColor = '#dc3545';
        categoryDescription = 'Недостатня м\'язова маса. Рекомендуються силові тренування та збільшення споживання протеїну.';
      } else if (ffmi < 16) {
        category = 'Нормальний';
        categoryColor = '#ffc107';
        categoryDescription = 'Середній рівень м\'язової маси для нетренованої людини. Є потенціал для значного покращення.';
      } else if (ffmi < 17) {
        category = 'Добрий';
        categoryColor = '#17a2b8';
        categoryDescription = 'Хороша м\'язова маса. Результат регулярних тренувань та правильного харчування.';
      } else if (ffmi < 18) {
        category = 'Відмінний';
        categoryColor = '#28a745';
        categoryDescription = 'Відмінна м\'язова маса. Рівень досвідченої спортсменки або фітнес-моделі.';
      } else if (ffmi < 20) {
        category = 'Елітний';
        categoryColor = '#6f42c1';
        categoryDescription = 'Елітний рівень м\'язової маси. Результат багаторічних інтенсивних тренувань.';
      } else {
        category = 'Екстремальний';
        categoryColor = '#e83e8c';
        categoryDescription = 'Екстремальний рівень м\'язової маси, що часто перевищує природні генетичні межі.';
      }
    }

    // Generate recommendations based on current level and training
    let recommendations = [];
    
    if (ffmi < (gender === 'male' ? 18 : 16)) {
      recommendations.push('🏋️ Розпочніть регулярні силові тренування 3-4 рази на тиждень');
      recommendations.push('🥩 Збільшіть споживання протеїну до 1.6-2.2 г на кг маси тіла');
      recommendations.push('📈 Створіть калорійний профіцит 200-500 калорій для росту м\'язів');
    }
    
    if (trainingFrequency < 3) {
      recommendations.push('📅 Збільшіть частоту силових тренувань до 3-5 разів на тиждень');
    }
    
    if (bodyFatPercent > (gender === 'male' ? 20 : 25)) {
      recommendations.push('🔥 Розгляньте можливість зниження відсотка жиру для кращого визначення м\'язів');
    }
    
    if (bodyFatPercent < (gender === 'male' ? 8 : 16)) {
      recommendations.push('⚠️ Відсоток жиру дуже низький - може погіршити здоров\'я та гормональний баланс');
    }

    // Age-based recommendations
    recommendations.push('😴 Забезпечте 7-9 годин якісного сну для відновлення м\'язів');
    recommendations.push('💧 Пийте 2.5-3.5 літри води щодня для оптимального функціонування м\'язів');
    
    if (ffmi >= (gender === 'male' ? 22 : 18)) {
      recommendations.push('🎯 Ви досягли високого рівня - зосередьтеся на підтриманні та дрібних покращеннях');
    }

    // Training level names
    const trainingLevelNames = {
      'beginner': 'Початківець',
      'novice': 'Новачок', 
      'intermediate': 'Середній',
      'advanced': 'Досвідчений',
      'expert': 'Експерт'
    };

    const methodNames = {
      'bioimpedance': 'Біоімпеданс',
      'calipers': 'Калібри',
      'dexa': 'DEXA сканування',
      'visual': 'Візуальна оцінка',
      'photo': 'Порівняння з фото',
      'underwater': 'Подводне зважування',
      'bodpod': 'BOD POD',
      'other': 'Інший метод'
    };

    // Calculate potential improvements
    const potentialFFMI = gender === 'male' ? 
      Math.min(ffmi + (4 - Math.max(0, trainingLevel === 'expert' ? 4 : trainingLevel === 'advanced' ? 3 : trainingLevel === 'intermediate' ? 2 : trainingLevel === 'novice' ? 1 : 0)), 25) :
      Math.min(ffmi + (3 - Math.max(0, trainingLevel === 'expert' ? 3 : trainingLevel === 'advanced' ? 2.5 : trainingLevel === 'intermediate' ? 1.5 : trainingLevel === 'novice' ? 1 : 0)), 20);

    result.innerHTML = `
      <div class="mental-health-results">
        <h3 style="color:#157aff;margin-top:0;text-align:center;">💪 Аналіз вашого FFMI</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📊 Ваш FFMI</h6>
            <div class="big-number" style="color: ${categoryColor};">${ffmi.toFixed(1)}</div>
            <p>кг/м²</p>
          </div>
          
          <div class="insight-card info">
            <h6>📏 Нормалізований FFMI</h6>
            <div class="big-number">${normalizedFFMI.toFixed(1)}</div>
            <p>кг/м² (з поправкою на зріст)</p>
          </div>
          
          <div class="insight-card ${ffmi >= (gender === 'male' ? 20 : 17) ? 'success' : ffmi >= (gender === 'male' ? 16 : 14) ? 'warning' : 'info'}" style="border-color: ${categoryColor};">
            <h6>🏆 Категорія</h6>
            <div class="result-value" style="color: ${categoryColor};">${category}</div>
            <p>рівень м'язової маси</p>
          </div>
        </div>

        <div class="insight-card ${ffmi >= (gender === 'male' ? 20 : 17) ? 'success' : ffmi >= (gender === 'male' ? 16 : 14) ? 'warning' : 'info'}" style="margin: 20px 0; border-color: ${categoryColor};">
          <h4 style="color: ${categoryColor}; margin: 5px 0; text-align: center;">${category} рівень м'язової маси</h4>
          <p style="margin: 10px 0; text-align: center;">${categoryDescription}</p>
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📋 Детальний аналіз композиції тіла</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Загальна вага:</strong> ${weightKg.toFixed(1)} кг
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Безжирова маса:</strong> ${leanBodyMass.toFixed(1)} кг
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Жирова маса:</strong> ${fatMass.toFixed(1)} кг
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Відсоток жиру:</strong> ${bodyFatPercent.toFixed(1)}%
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>ІМТ:</strong> ${bmi.toFixed(1)} кг/м²
            </div>
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong>Рівень тренованості:</strong> ${trainingLevelNames[trainingLevel]}
            </div>
          </div>
          ${measurementMethod ? `
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 15px; text-align: center;">
            <strong>Метод вимірювання жиру:</strong> ${methodNames[measurementMethod] || measurementMethod}
          </div>
          ` : ''}
        </div>

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="margin-top: 0;">📊 Норми FFMI за статтю</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; font-size: 0.9em;">
            ${gender === 'male' ? `
            <div style="text-align: center; padding: 12px; background: ${ffmi < 16 ? '#ffebee' : '#f8f9fa'}; border-radius: 6px; ${ffmi < 16 ? 'border: 2px solid #f44336;' : ''}">
              <div style="font-weight: bold; color: #dc3545;">Низький</div>
              <div>< 16</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 16 && ffmi < 18 ? '#fff8e1' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 16 && ffmi < 18 ? 'border: 2px solid #ffc107;' : ''}">
              <div style="font-weight: bold; color: #ffc107;">Нормальний</div>
              <div>16-18</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 18 && ffmi < 20 ? '#e1f5fe' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 18 && ffmi < 20 ? 'border: 2px solid #17a2b8;' : ''}">
              <div style="font-weight: bold; color: #17a2b8;">Добрий</div>
              <div>18-20</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 20 && ffmi < 22 ? '#e8f5e8' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 20 && ffmi < 22 ? 'border: 2px solid #28a745;' : ''}">
              <div style="font-weight: bold; color: #28a745;">Відмінний</div>
              <div>20-22</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 22 && ffmi < 25 ? '#f3e5f5' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 22 && ffmi < 25 ? 'border: 2px solid #6f42c1;' : ''}">
              <div style="font-weight: bold; color: #6f42c1;">Елітний</div>
              <div>22-25</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 25 ? '#fce4ec' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 25 ? 'border: 2px solid #e83e8c;' : ''}">
              <div style="font-weight: bold; color: #e83e8c;">Екстремальний</div>
              <div>> 25</div>
            </div>
            ` : `
            <div style="text-align: center; padding: 12px; background: ${ffmi < 14 ? '#ffebee' : '#f8f9fa'}; border-radius: 6px; ${ffmi < 14 ? 'border: 2px solid #f44336;' : ''}">
              <div style="font-weight: bold; color: #dc3545;">Низький</div>
              <div>< 14</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 14 && ffmi < 16 ? '#fff8e1' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 14 && ffmi < 16 ? 'border: 2px solid #ffc107;' : ''}">
              <div style="font-weight: bold; color: #ffc107;">Нормальний</div>
              <div>14-16</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 16 && ffmi < 17 ? '#e1f5fe' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 16 && ffmi < 17 ? 'border: 2px solid #17a2b8;' : ''}">
              <div style="font-weight: bold; color: #17a2b8;">Добрий</div>
              <div>16-17</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 17 && ffmi < 18 ? '#e8f5e8' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 17 && ffmi < 18 ? 'border: 2px solid #28a745;' : ''}">
              <div style="font-weight: bold; color: #28a745;">Відмінний</div>
              <div>17-18</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 18 && ffmi < 20 ? '#f3e5f5' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 18 && ffmi < 20 ? 'border: 2px solid #6f42c1;' : ''}">
              <div style="font-weight: bold; color: #6f42c1;">Елітний</div>
              <div>18-20</div>
            </div>
            <div style="text-align: center; padding: 12px; background: ${ffmi >= 20 ? '#fce4ec' : '#f8f9fa'}; border-radius: 6px; ${ffmi >= 20 ? 'border: 2px solid #e83e8c;' : ''}">
              <div style="font-weight: bold; color: #e83e8c;">Екстремальний</div>
              <div>> 20</div>
            </div>
            `}
          </div>
        </div>

        ${potentialFFMI > ffmi + 0.5 ? `
        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">🎯 Потенціал для покращення</h4>
          <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center;">
              <div>
                <div style="font-size: 1.2em; font-weight: bold;">Поточний FFMI</div>
                <div style="font-size: 1.5em; color: ${categoryColor};">${ffmi.toFixed(1)}</div>
              </div>
              <div style="font-size: 2em;">→</div>
              <div>
                <div style="font-size: 1.2em; font-weight: bold;">Потенційний FFMI</div>
                <div style="font-size: 1.5em; color: #28a745;">${potentialFFMI.toFixed(1)}</div>
              </div>
            </div>
            <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
              Можливий приріст: <strong>+${(potentialFFMI - ffmi).toFixed(1)} пунктів</strong> при оптимальних тренуваннях та харчуванні
            </div>
          </div>
        </div>
        ` : ''}

        ${recommendations.length > 0 ? `
        <div class="insight-card warning" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #e65100;">🎯 Персональні рекомендації</h4>
          <ul style="margin: 0; padding-left: 20px;">
            ${recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="insight-card success" style="margin: 20px 0;">
          <h4 style="margin-top: 0; color: #155724;">🏆 План підвищення FFMI</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">💪 Силові тренування:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>3-5 тренувань на тиждень</li>
                <li>Основні вправи: присідання, жим, тяга</li>
                <li>6-12 повторень для гіпертрофії</li>
                <li>Прогресивне навантаження</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">🥗 Харчування:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>1.6-2.2 г протеїну на кг ваги</li>
                <li>Калорійний профіцит 200-500 ккал</li>
                <li>Складні вуглеводи та здорові жири</li>
                <li>4-6 прийомів їжі на день</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">😴 Відновлення:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>7-9 годин сну щоночі</li>
                <li>48-72 години відпочинку між тренуваннями</li>
                <li>Управління стресом</li>
                <li>Достатня гідратація</li>
              </ul>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <strong style="color: #155724;">⏱️ Реалістичні терміни:</strong>
              <ul style="margin: 5px 0; font-size: 0.9em;">
                <li>Перший рік: +2-4 пункти FFMI</li>
                <li>Другий рік: +1-2 пункти</li>
                <li>Далі: +0.5-1 пункт на рік</li>
                <li>Генетична межа: 3-5 років</li>
              </ul>
            </div>
          </div>
        </div>

        ${ffmi >= naturalLimit ? `
        <div class="insight-card" style="background: #fff3cd; border-color: #ffc107; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #856404;">⚠️ Високий рівень FFMI</h4>
          <p style="margin: 0; color: #856404;">
            Ваш FFMI досягає або перевищує природні генетичні межі (${naturalLimit} для ${gender === 'male' ? 'чоловіків' : 'жінок'}). 
            Такий рівень досягається дуже рідко при натуральному тренуванні. Якщо ви досягли цього природним шляхом — це винятковий результат!
          </p>
        </div>
        ` : ''}

        <div class="disclaimer" style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💪 <strong>Пам'ятайте:</strong> FFMI — це інструмент оцінки, а не абсолютний показник успіху. Точність залежить від правильності вимірювання відсотка жиру. 
            Зосереджуйтеся на здоров'ї, прогресі та задоволенні від тренувань, а не лише на цифрах.
          </p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});