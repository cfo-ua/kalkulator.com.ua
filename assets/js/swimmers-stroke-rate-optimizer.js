document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('swimmers-stroke-rate-optimizer-form');
  const result = document.getElementById('swimmers-stroke-rate-optimizer-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const stroke = form.stroke.value;
    const distance = form.distance.value;
    const timeMinutes = +(form['time-minutes'].value || 0);
    const timeSeconds = +form['time-seconds'].value;
    const poolLength = form['pool-length'].value;
    const strokeCount = +form['stroke-count'].value;
    const experience = form.experience.value;
    const ageCategory = form['age-category'].value;
    const trainingFreq = +form['training-frequency'].value;
    const goal = form.goal.value;
    const currentStrokeRate = form['current-stroke-rate'].value ? +form['current-stroke-rate'].value : null;
    const heightInput = +form.height.value;
    const heightUnit = form['height-unit'].value;
    const inches = +(form.inches?.value || 0);
    
    // Get focus areas
    const focusCheckboxes = form.querySelectorAll('input[name="focus-areas"]:checked');
    const focusAreas = Array.from(focusCheckboxes).map(cb => cb.value);

    // Validation
    if (!stroke || !distance || !timeSeconds || !poolLength || !strokeCount || 
        !experience || !ageCategory || !trainingFreq || !goal || !heightInput || 
        focusAreas.length === 0) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля та оберіть принаймні одну область фокусу.</p>';
      return;
    }

    // Convert units
    let heightCm;
    if (heightUnit === 'ft') {
      heightCm = (heightInput * 12 + inches) * 2.54;
    } else {
      heightCm = heightInput;
    }

    // Calculate total time in seconds
    const totalTimeSeconds = (timeMinutes * 60) + timeSeconds;
    
    // Calculate current swimming speed (m/s)
    let raceDistanceMeters;
    if (distance === 'open-water') {
      raceDistanceMeters = 5000; // Use 5k as reference
    } else if (distance === 'multiple') {
      raceDistanceMeters = 200; // Use 200m as default for analysis
    } else {
      raceDistanceMeters = +distance;
    }
    
    // Adjust for pool length effects on time
    let adjustedDistanceMeters = raceDistanceMeters;
    if (poolLength === '25' || poolLength === '25y') {
      // More turns in short course - typically ~2-5% faster times
      adjustedDistanceMeters = raceDistanceMeters * 1.03;
    }
    
    const currentSpeed = adjustedDistanceMeters / totalTimeSeconds; // m/s
    
    // Calculate Distance Per Stroke (DPS)
    let poolLengthMeters;
    if (poolLength === '25y') {
      poolLengthMeters = 22.86; // 25 yards in meters
    } else if (poolLength === '25') {
      poolLengthMeters = 25;
    } else if (poolLength === '50') {
      poolLengthMeters = 50;
    } else {
      poolLengthMeters = 50; // Open water reference
    }
    
    const dps = poolLengthMeters / strokeCount;
    
    // Calculate current stroke rate if not provided
    let estimatedCurrentSR;
    if (currentStrokeRate) {
      estimatedCurrentSR = currentStrokeRate;
    } else {
      // Calculate from speed and DPS: SR = (Speed / DPS) * 60
      estimatedCurrentSR = (currentSpeed / dps) * 60;
    }

    // Determine optimal stroke rate ranges based on stroke and distance
    const getOptimalSRRange = (stroke, distance, experience) => {
      const baseRanges = {
        'freestyle': {
          '50': [85, 100],
          '100': [80, 95],
          '200': [75, 88],
          '400': [72, 85],
          '800': [70, 82],
          '1500': [68, 80],
          'open-water': [72, 82]
        },
        'backstroke': {
          '50': [80, 95],
          '100': [75, 90],
          '200': [70, 85],
          '400': [68, 80],
          '800': [66, 78],
          '1500': [64, 76],
          'open-water': [68, 78]
        },
        'breaststroke': {
          '50': [55, 70],
          '100': [50, 65],
          '200': [45, 60],
          '400': [42, 58],
          '800': [40, 55],
          '1500': [38, 53],
          'open-water': [42, 55]
        },
        'butterfly': {
          '50': [60, 75],
          '100': [55, 70],
          '200': [50, 65],
          '400': [48, 62],
          '800': [45, 60],
          '1500': [42, 58],
          'open-water': [45, 58]
        },
        'individual-medley': {
          '200': [60, 80], // Varies by stroke
          '400': [58, 78],
          'multiple': [60, 80]
        }
      };
      
      let range = baseRanges[stroke][distance] || baseRanges[stroke]['200'] || [70, 85];
      
      // Adjust for experience level
      const experienceAdjustments = {
        'beginner': [-8, -5],
        'intermediate': [-5, -2],
        'advanced': [-2, 0],
        'competitive': [0, 2],
        'elite': [2, 5]
      };
      
      const adjustment = experienceAdjustments[experience] || [0, 0];
      return [range[0] + adjustment[0], range[1] + adjustment[1]];
    };

    const optimalRange = getOptimalSRRange(stroke, distance, experience);
    const targetSR = Math.round((optimalRange[0] + optimalRange[1]) / 2);

    // Calculate stroke efficiency metrics
    const strokeIndex = currentSpeed * dps;
    const strokesPerMeter = 1 / dps;
    
    // Determine focus recommendations
    let recommendations = [];
    let trainingRecommendations = [];
    
    // Analyze current stroke rate vs optimal
    if (estimatedCurrentSR < optimalRange[0] - 5) {
      recommendations.push('🔄 Збільшити частоту гребків: Ваша поточна частота значно нижче оптимального діапазону');
      trainingRecommendations.push('Практикуйте з темп-тренером з кроками +2-3 гребки на хвилину');
    } else if (estimatedCurrentSR > optimalRange[1] + 5) {
      recommendations.push('📏 Фокус на довжину гребка: Ваша частота висока, працюйте над дистанцією за гребок');
      trainingRecommendations.push('Рахуйте гребки та працюйте над зменшенням кількості гребків на довжину');
    } else {
      recommendations.push('⚖️ Тонке налаштування балансу: Ви в оптимальному діапазоні, фокусуйтеся на постійності');
    }
    
    // Height-based recommendations
    if (heightCm > 185) {
      recommendations.push('🏊 Перевага високого плавця: Ваш зріст підтримує довші гребки - фокусуйтеся на дистанції за гребок');
    } else if (heightCm < 165) {
      recommendations.push('⚡ Стратегія низького плавця: Вищі частоти гребків можуть бути ефективнішими для вас');
    }
    
    // Distance-specific recommendations
    if (distance === '50' || distance === '100') {
      recommendations.push('🏃 Фокус на спринт: Практикуйте утримання високих частот гребків з гарною технікою');
      trainingRecommendations.push('Спринтерські серії: 8×25 на 95% частоти гребків з повним відновленням');
    } else if (distance === '800' || distance === '1500' || distance === 'open-water') {
      recommendations.push('🎯 Ефективність дистанції: Надавайте пріоритет стійкій частоті гребків та ритму');
      trainingRecommendations.push('Серії стабільного стану: 10×100 на цільовій частоті гребків');
    }
    
    // Stroke-specific recommendations
    if (stroke === 'breaststroke') {
      recommendations.push('🐸 Тайминг брасу: Фокусуйтеся на фазі ковзання та таймингу ударів');
      trainingRecommendations.push('Вправа: 2 удари 1 гребок для акценту на тайминг гребка');
    } else if (stroke === 'butterfly') {
      recommendations.push('🦋 Ритм батерфляя: Підтримуйте 2 удари на цикл гребка');
      trainingRecommendations.push('Серії на наростання: 4×50 з наростанням частоти гребків кожні 50');
    }
    
    // Experience-based recommendations
    if (experience === 'beginner' || experience === 'intermediate') {
      recommendations.push('📚 Спочатку техніка: Опануйте механіку гребків перед фокусом на частоту гребків');
      trainingRecommendations.push('Технічні серії: 6×50 з ідеальною кількістю гребків');
    }
    
    // Goal-specific recommendations
    if (goal === 'competition') {
      recommendations.push('🏆 Підготовка до змагань: Практикуйте зміни частоти гребків під час симуляції заплавів');
      trainingRecommendations.push('Серії змагального темпу: 3×200 негативний спліт з прогресією частоти гребків');
    } else if (goal === 'efficiency') {
      recommendations.push('⚙️ Фокус на ефективність: Моніторьте як частоту гребків, так і кількість гребків однаково');
      trainingRecommendations.push('Гольф-серії: Плавайте на час + кількість гребків (менший загальний результат виграє)');
    }

    // Generate training zones
    const generateTrainingZones = (targetSR) => {
      return {
        recovery: Math.round(targetSR * 0.7),
        aerobic: Math.round(targetSR * 0.8),
        threshold: Math.round(targetSR * 0.9),
        vo2max: Math.round(targetSR * 0.95),
        neuromuscular: targetSR
      };
    };

    const trainingZones = generateTrainingZones(targetSR);

    // Calculate potential improvement
    const currentPace = totalTimeSeconds / raceDistanceMeters; // seconds per meter
    const improvedDPS = dps * 1.05; // 5% improvement in stroke length
    const improvedSR = targetSR / 60; // convert to strokes per second
    const improvedSpeed = improvedSR * improvedDPS;
    const improvedTime = raceDistanceMeters / improvedSpeed;
    const timeImprovement = totalTimeSeconds - improvedTime;

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = (seconds % 60).toFixed(2);
      return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}с`;
    };

    // Translate stroke names
    const strokeNames = {
      'freestyle': 'Вільний стиль',
      'backstroke': 'Плавання на спині',
      'breaststroke': 'Брас',
      'butterfly': 'Батерфляй',
      'individual-medley': 'Комплексне плавання'
    };

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Аналіз вашої частоти гребків у плаванні</h3>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Поточний профіль результативності</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div><strong>Стиль:</strong> ${strokeNames[stroke] || stroke}</div>
            <div><strong>Дистанція:</strong> ${distance === 'multiple' ? 'Кілька' : distance === 'open-water' ? 'Відкрита вода' : distance + 'м'}</div>
            <div><strong>Поточний час:</strong> ${formatTime(totalTimeSeconds)}</div>
            <div><strong>Поточна швидкість:</strong> ${currentSpeed.toFixed(2)} м/с</div>
            <div><strong>Кількість гребків:</strong> ${strokeCount} на ${poolLengthMeters}м</div>
            <div><strong>Дистанція за гребок:</strong> ${dps.toFixed(2)}м</div>
          </div>
        </div>

        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <h4 style="color:#28a745;margin-top:0;">Аналіз частоти гребків</h4>
          <div style="display:flex;justify-content:center;align-items:center;gap:30px;flex-wrap:wrap;margin:20px 0;">
            <div style="text-align:center;">
              <div style="color:#666;font-size:0.9em;">Поточна частота гребків</div>
              <div style="font-size:2em;font-weight:bold;color:#666;">${Math.round(estimatedCurrentSR)}</div>
              <div style="color:#666;font-size:0.8em;">гребків/хв</div>
            </div>
            <div style="font-size:2em;color:#ccc;">→</div>
            <div style="text-align:center;">
              <div style="color:#28a745;font-size:0.9em;">Цільова частота гребків</div>
              <div style="font-size:2em;font-weight:bold;color:#28a745;">${targetSR}</div>
              <div style="color:#28a745;font-size:0.8em;">гребків/хв</div>
            </div>
          </div>
          <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
            <strong>Оптимальний діапазон: ${optimalRange[0]}-${optimalRange[1]} гребків/хв</strong><br>
            <span style="color:#666;font-size:0.9em;">На основі вашого стилю, дистанції та рівня досвіду</span>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Метрики ефективності гребків</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#e3f2fd;border-radius:6px;">
              <div style="font-weight:bold;color:#1976d2;">Індекс гребка</div>
              <div style="font-size:1.2em;color:#1976d2;">${strokeIndex.toFixed(2)}</div>
              <div style="font-size:0.8em;color:#666;">Швидкість × Дистанція за гребок</div>
            </div>
            <div style="text-align:center;padding:15px;background:#e8f5e8;border-radius:6px;">
              <div style="font-weight:bold;color:#388e3c;">Дистанція за гребок</div>
              <div style="font-size:1.2em;color:#388e3c;">${dps.toFixed(2)}м</div>
              <div style="font-size:0.8em;color:#666;">Довжина басейну ÷ гребки</div>
            </div>
            <div style="text-align:center;padding:15px;background:#fff3e0;border-radius:6px;">
              <div style="font-weight:bold;color:#f57c00;">Гребків на метр</div>
              <div style="font-size:1.2em;color:#f57c00;">${strokesPerMeter.toFixed(1)}</div>
              <div style="font-size:0.8em;color:#666;">Ефективність гребків</div>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Частоти гребків тренувальних зон</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
            <div style="text-align:center;padding:10px;background:#e8f5e8;border-radius:4px;">
              <div style="font-weight:bold;color:#155724;">Відновлення</div>
              <div style="color:#155724;">${trainingZones.recovery} гр/хв</div>
              <div style="font-size:0.8em;color:#666;">Легке плавання</div>
            </div>
            <div style="text-align:center;padding:10px;background:#d1ecf1;border-radius:4px;">
              <div style="font-weight:bold;color:#0c5460;">Аеробна</div>
              <div style="color:#0c5460;">${trainingZones.aerobic} гр/хв</div>
              <div style="font-size:0.8em;color:#666;">Базове тренування</div>
            </div>
            <div style="text-align:center;padding:10px;background:#fff3cd;border-radius:4px;">
              <div style="font-weight:bold;color:#856404;">Порогова</div>
              <div style="color:#856404;">${trainingZones.threshold} гр/хв</div>
              <div style="font-size:0.8em;color:#666;">Змагальний темп</div>
            </div>
            <div style="text-align:center;padding:10px;background:#f8d7da;border-radius:4px;">
              <div style="font-weight:bold;color:#721c24;">VO2 Max</div>
              <div style="color:#721c24;">${trainingZones.vo2max} гр/хв</div>
              <div style="font-size:0.8em;color:#666;">Висока інтенсивність</div>
            </div>
            <div style="text-align:center;padding:10px;background:#e2e3e5;border-radius:4px;">
              <div style="font-weight:bold;color:#383d41;">Макс частота</div>
              <div style="color:#383d41;">${trainingZones.neuromuscular} гр/хв</div>
              <div style="font-size:0.8em;color:#666;">Спринтерська швидкість</div>
            </div>
          </div>
        </div>

        ${timeImprovement > 0 ? `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Потенціал покращення результативності</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <div style="text-align:center;">
              <div style="font-size:1.1em;color:#155724;">
                <strong>Потенційне покращення часу: ${formatTime(timeImprovement)}</strong>
              </div>
              <div style="color:#666;font-size:0.9em;margin-top:5px;">
                На основі оптимізації частоти гребків та 5% покращення довжини гребка
              </div>
              <div style="margin-top:10px;color:#155724;">
                Поточний: ${formatTime(totalTimeSeconds)} → Цільовий: ${formatTime(improvedTime)}
              </div>
            </div>
          </div>
        </div>
        ` : ''}

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Персоналізовані рекомендації</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🏊 Рекомендації тренувальних серій</h4>
          <div style="margin:10px 0;">
            ${trainingRecommendations.length > 0 ? 
              trainingRecommendations.map(rec => `<div style="margin:8px 0;color:#155724;">• ${rec}</div>`).join('') :
              `<div style="color:#155724;">• Технічний фокус: 8×50 на цільовій частоті гребків з темп-тренером</div>
               <div style="color:#155724;">• Серія на наростання: 6×100 з наростанням частоти гребків на 2 за кожні 100</div>
               <div style="color:#155724;">• Постійність: 5×200 підтримуючи ±2 гр/хв від цільової частоти</div>`
            }
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">План розвитку частоти гребків</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div>
              <strong>🎯 Тиждень 1-2: Оцінка</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Тестуйте поточну частоту гребків на різних швидкостях</li>
                <li>Встановіть базову кількість гребків на довжину</li>
                <li>Практикуйте з темп-тренером</li>
              </ul>
            </div>
            <div>
              <strong>📈 Тиждень 3-4: Розвиток</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Поступово регулюйте до цільової частоти гребків</li>
                <li>Фокусуйтеся на підтриманні довжини гребка</li>
                <li>Серії на наростання з прогресією частоти гребків</li>
              </ul>
            </div>
            <div>
              <strong>⚖️ Тиждень 5-6: Інтеграція</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Практикуйте цільову частоту гребків у тренувальних серіях</li>
                <li>Працюйте над постійністю частоти гребків</li>
                <li>Практика змагального темпу з цільовою частотою</li>
              </ul>
            </div>
            <div>
              <strong>🔧 Тиждень 7-8: Точне налаштування</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Регулюйте частоту гребків для різних тренувальних зон</li>
                <li>Практикуйте зміни частоти гребків у довших серіях</li>
                <li>Симуляція змагань</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">🛠️ Інструменти для тренування частоти гребків</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;color:#383d41;font-size:0.9em;">
            <div>
              <strong>Темп-тренери:</strong> Finis Tempo Trainer Pro, додаток Wetronome або метроном
            </div>
            <div>
              <strong>Підрахунок гребків:</strong> Таблиця відстеження кількості гребків на довжину
            </div>
            <div>
              <strong>Відстеження часу:</strong> Пейс-годинник або годинник для плавання
            </div>
            <div>
              <strong>Відео аналіз:</strong> Підводна камера для аналізу гребків
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Важливі нагадування</h4>
          <ul style="margin:5px 0;color:#856404;font-size:0.9em;">
            <li>Якість техніки важливіша за точне досягнення цифр частоти гребків</li>
            <li>Індивідуальні оптимальні частоти гребків варіюються залежно від типу тіла та здібностей плавання</li>
            <li>Практикуйте зміни частоти гребків поступово, щоб уникнути порушення техніки</li>
            <li>Використовуйте частоту гребків як інструмент, а не абсолютну ціль - відчуття та ефективність найважливіші</li>
            <li>Працюйте з кваліфікованим тренером з плавання для персонального розвитку техніки</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});