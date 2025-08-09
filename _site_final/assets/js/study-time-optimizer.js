document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('study-optimizer-form');
  const result = document.getElementById('study-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const examType = document.getElementById('exam-type').value;
      const timeline = document.getElementById('timeline').value;
      const scoreGoal = document.getElementById('score-goal').value;
      const background = document.getElementById('background').value;
      const baselineTest = document.getElementById('baseline-test').value;
      const prepExperience = document.getElementById('prep-experience').value;
      const commitments = document.getElementById('commitments').value;
      const weekdayHours = parseInt(document.getElementById('weekday-hours').value);
      const weekendHours = parseInt(document.getElementById('weekend-hours').value);
      const studyMethod = document.getElementById('study-method').value;
      const learningStyle = document.getElementById('learning-style').value;
      const motivation = document.getElementById('motivation').value;
      const consistency = document.getElementById('consistency').value;
      
      // Check additional factors
      const emphasizePracticeTests = document.getElementById('practice-tests').checked;
      const needContentReview = document.getElementById('content-review').checked;
      const hasTestAnxiety = document.getElementById('test-anxiety').checked;
      const hasStudyPartner = document.getElementById('study-partner').checked;
      const needsAccountability = document.getElementById('external-accountability').checked;
      
      // Validation
      if (!examType || !timeline || !scoreGoal || !background || !baselineTest || !prepExperience || !commitments || !weekdayHours || !weekendHours || !studyMethod || !learningStyle || !motivation || !consistency) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть всі обов\'язкові поля.</p>';
        return;
      }
      
      // Base study hour requirements by exam
      const examHours = {
        'zno': 400,
        'sat': 150,
        'ielts': 200,
        'toefl': 200,
        'gre': 150,
        'gmat': 175,
        'a-levels': 200,
        'german-exams': 300,
        'university': 100
      };
      
      // Timeline to weeks conversion
      const timelineWeeks = {
        '2-months': 8,
        '3-months': 12,
        '4-months': 16,
        '5-months': 20,
        '6-months': 24,
        'flexible': 32
      };
      
      // Calculate base hours needed
      let baseHours = examHours[examType] || 150;
      let weeks = timelineWeeks[timeline] || 16;
      
      // Adjust based on score goal
      const scoreMultipliers = {
        'minimum': 0.8,
        'average': 1.0,
        'competitive': 1.3,
        'top-tier': 1.6
      };
      baseHours *= scoreMultipliers[scoreGoal] || 1.0;
      
      // Adjust based on background
      const backgroundMultipliers = {
        'strong': 0.8,
        'moderate': 1.0,
        'weak': 1.3,
        'career-change': 1.5
      };
      baseHours *= backgroundMultipliers[background] || 1.0;
      
      // Adjust based on baseline test
      const baselineMultipliers = {
        'no': 1.2,
        'below-average': 1.1,
        'average': 1.0,
        'above-average': 0.9
      };
      baseHours *= baselineMultipliers[baselineTest] || 1.0;
      
      // Adjust based on prep experience
      const prepMultipliers = {
        'none': 1.2,
        'some': 1.0,
        'experienced': 0.9,
        'retaker': 0.8
      };
      baseHours *= prepMultipliers[prepExperience] || 1.0;
      
      // Calculate weekly hours available
      const weeklyHours = (weekdayHours * 5) + (weekendHours * 2);
      
      // Adjust timeline if needed
      const hoursPerWeek = Math.min(weeklyHours, baseHours / weeks * 1.5); // Cap at 150% of target
      const adjustedWeeks = Math.ceil(baseHours / hoursPerWeek);
      const finalWeeks = Math.max(weeks, adjustedWeeks);
      
      // Calculate daily breakdown
      const totalWeeklyTarget = baseHours / finalWeeks;
      const adjustedWeekdayHours = Math.min(weekdayHours, totalWeeklyTarget / 7 * 5);
      const adjustedWeekendHours = Math.min(weekendHours, (totalWeeklyTarget - (adjustedWeekdayHours * 5)) / 2);
      
      // Generate study phases
      const phases = generateStudyPhases(examType, finalWeeks, baseHours);
      
      // Generate recommendations
      const recommendations = generateRecommendations(examType, studyMethod, learningStyle, motivation, emphasizePracticeTests, needContentReview, hasTestAnxiety);
      
      // Generate schedule
      const schedule = generateWeeklySchedule(adjustedWeekdayHours, adjustedWeekendHours, consistency);
      
      // Generate warnings if needed
      const warnings = generateWarnings(weeklyHours, totalWeeklyTarget, timeline, commitments);
      
      // Display results
      displayResults(examType, baseHours, finalWeeks, totalWeeklyTarget, adjustedWeekdayHours, adjustedWeekendHours, phases, recommendations, schedule, warnings);
    });
  }
  
  function generateStudyPhases(examType, weeks, totalHours) {
    const phases = [];
    
    if (examType === 'zno') {
      phases.push({
        name: 'Фаза 1: Базова підготовка',
        duration: Math.ceil(weeks * 0.3),
        focus: 'Огляд шкільної програми, виявлення прогалин',
        activities: ['Базові тести з кожного предмету', 'Повторення основних тем', 'Створення плану навчання']
      });
      phases.push({
        name: 'Фаза 2: Поглиблене вивчення',
        duration: Math.ceil(weeks * 0.4),
        focus: 'Детальне вивчення складних тем',
        activities: ['Розв\'язання типових завдань', 'Вивчення формул і правил', 'Тематичні тести']
      });
      phases.push({
        name: 'Фаза 3: Практика та тренування',
        duration: Math.ceil(weeks * 0.2),
        focus: 'Інтенсивна практика та пробні тести',
        activities: ['Повні пробні тести ЗНО', 'Робота над швидкістю', 'Аналіз помилок']
      });
      phases.push({
        name: 'Фаза 4: Фінальна підготовка',
        duration: Math.ceil(weeks * 0.1),
        focus: 'Повторення та психологічна підготовка',
        activities: ['Легке повторення', 'Релаксація', 'Режим дня перед іспитом']
      });
    } else {
      // Generic phases for international exams
      phases.push({
        name: 'Фаза 1: Ознайомлення',
        duration: Math.ceil(weeks * 0.25),
        focus: 'Вивчення формату іспиту',
        activities: ['Ознайомлення з форматом', 'Базовий тест', 'Планування']
      });
      phases.push({
        name: 'Фаза 2: Навчання',
        duration: Math.ceil(weeks * 0.45),
        focus: 'Систематичне вивчення матеріалу',
        activities: ['Вивчення за розділами', 'Практичні завдання', 'Щотижневі тести']
      });
      phases.push({
        name: 'Фаза 3: Практика',
        duration: Math.ceil(weeks * 0.2),
        focus: 'Інтенсивна практика',
        activities: ['Повні пробні тести', 'Хронометраж', 'Стратегії іспиту']
      });
      phases.push({
        name: 'Фаза 4: Завершення',
        duration: Math.ceil(weeks * 0.1),
        focus: 'Фінальна підготовка',
        activities: ['Легке повторення', 'Психологічна підготовка']
      });
    }
    
    return phases;
  }
  
  function generateRecommendations(examType, studyMethod, learningStyle, motivation, practiceTests, contentReview, testAnxiety) {
    const recommendations = [];
    
    // Study method recommendations
    if (studyMethod === 'self-study') {
      recommendations.push('📚 Створіть структурований план самонавчання з чіткими цілями');
      recommendations.push('⏰ Встановіть регулярні проміжні терміни для самоперевірки');
    } else if (studyMethod === 'tutoring') {
      recommendations.push('👨‍🏫 Знайдіть репетитора з досвідом підготовки до вашого типу іспиту');
      recommendations.push('📝 Готуйте питання до кожного заняття');
    }
    
    // Learning style recommendations
    if (learningStyle === 'visual') {
      recommendations.push('📊 Використовуйте схеми, діаграми та ментальні карти');
      recommendations.push('🎨 Виділяйте ключову інформацію кольорами');
    } else if (learningStyle === 'auditory') {
      recommendations.push('🎧 Слухайте лекції та подкасти по темах');
      recommendations.push('🗣️ Пояснюйте матеріал вголос або іншим людям');
    } else if (learningStyle === 'kinesthetic') {
      recommendations.push('✍️ Робіть багато нотаток від руки');
      recommendations.push('🏃‍♂️ Робіть перерви для фізичної активності');
    }
    
    // Motivation-based recommendations
    if (motivation === 'low') {
      recommendations.push('🎯 Ставте маленькі досяжні цілі щодня');
      recommendations.push('🏆 Винагороджуйте себе за досягнення проміжних цілей');
    } else if (motivation === 'extremely-high') {
      recommendations.push('⚡ Уникайте вигорання - робіть регулярні перерви');
      recommendations.push('🧘‍♀️ Практикуйте техніки релаксації');
    }
    
    // Special considerations
    if (practiceTests) {
      recommendations.push('📋 Плануйте пробний тест кожні 2 тижні');
      recommendations.push('📊 Ведіть детальну аналітику результатів');
    }
    
    if (contentReview) {
      recommendations.push('📖 Почніть з систематичного огляду основ');
      recommendations.push('📚 Використовуйте якісні підручники і довідники');
    }
    
    if (testAnxiety) {
      recommendations.push('🧘‍♀️ Практикуйте дихальні техніки та медитацію');
      recommendations.push('⏱️ Тренуйтеся працювати з обмеженням часу');
      recommendations.push('💪 Розробіть стратегії управління стресом');
    }
    
    return recommendations;
  }
  
  function generateWeeklySchedule(weekdayHours, weekendHours, consistency) {
    const schedule = [];
    
    if (consistency === 'daily') {
      schedule.push('📅 Понеділок-П\'ятниця: ' + weekdayHours + ' год/день');
      schedule.push('📅 Субота-Неділя: ' + weekendHours + ' год/день');
    } else if (consistency === 'weekdays') {
      schedule.push('📅 Понеділок-П\'ятниця: ' + weekdayHours + ' год/день');
      schedule.push('📅 Вихідні: відпочинок або легке повторення');
    } else if (consistency === 'intensive') {
      schedule.push('📅 Понеділок-П\'ятниця: ' + Math.max(1, weekdayHours - 1) + ' год/день');
      schedule.push('📅 Субота-Неділя: ' + Math.min(10, weekendHours + 2) + ' год/день (інтенсивно)');
    } else {
      schedule.push('📅 Гнучкий розклад: розподіліть ' + (weekdayHours * 5 + weekendHours * 2) + ' год/тиждень');
      schedule.push('📅 Мінімум: ' + Math.max(1, weekdayHours - 1) + ' год у будні, ' + weekendHours + ' год у вихідні');
    }
    
    return schedule;
  }
  
  function generateWarnings(availableHours, neededHours, timeline, commitments) {
    const warnings = [];
    
    if (availableHours < neededHours * 0.8) {
      warnings.push('⚠️ Увага: Доступного часу може бути недостатньо для ваших цілей');
      warnings.push('💡 Розгляньте збільшення терміну підготовки або зниження цільового балу');
    }
    
    if (timeline === '2-months' && neededHours > 15) {
      warnings.push('⚠️ Дуже напружений графік! Це може призвести до вигорання');
      warnings.push('💡 Рекомендуємо продовжити термін підготовки якщо можливо');
    }
    
    if (commitments === 'working-full' && neededHours > 12) {
      warnings.push('⚠️ Складно поєднувати повну зайнятість з інтенсивною підготовкою');
      warnings.push('💡 Використовуйте ранкові години або обідні перерви для навчання');
    }
    
    return warnings;
  }
  
  function displayResults(examType, totalHours, weeks, weeklyHours, weekdayHours, weekendHours, phases, recommendations, schedule, warnings) {
    const examNames = {
      'zno': 'ЗНО',
      'sat': 'SAT',
      'ielts': 'IELTS',
      'toefl': 'TOEFL',
      'gre': 'GRE',
      'gmat': 'GMAT',
      'a-levels': 'A-levels',
      'german-exams': 'DSH/TestDaF',
      'university': 'Університетські екзамени'
    };
    
    let html = `
      <div class="study-plan">
        <h3>📊 Ваш персональний план підготовки до ${examNames[examType]}</h3>
        
        <div class="plan-summary">
          <div class="summary-item">
            <strong>Загальний час:</strong> ${Math.round(totalHours)} годин
          </div>
          <div class="summary-item">
            <strong>Тривалість:</strong> ${weeks} тижнів
          </div>
          <div class="summary-item">
            <strong>Щотижнево:</strong> ${Math.round(weeklyHours)} годин
          </div>
          <div class="summary-item">
            <strong>Будні дні:</strong> ${weekdayHours} год/день
          </div>
          <div class="summary-item">
            <strong>Вихідні:</strong> ${weekendHours} год/день
          </div>
        </div>
    `;
    
    // Add warnings if any
    if (warnings.length > 0) {
      html += '<div class="warnings"><h4>Важливі зауваження:</h4><ul>';
      warnings.forEach(warning => {
        html += `<li>${warning}</li>`;
      });
      html += '</ul></div>';
    }
    
    // Add phases
    html += '<div class="study-phases"><h4>Фази підготовки:</h4>';
    phases.forEach((phase, index) => {
      html += `
        <div class="phase">
          <h5>${phase.name} (${phase.duration} тижнів)</h5>
          <p><strong>Фокус:</strong> ${phase.focus}</p>
          <p><strong>Активності:</strong> ${phase.activities.join(', ')}</p>
        </div>
      `;
    });
    html += '</div>';
    
    // Add schedule
    html += '<div class="weekly-schedule"><h4>Тижневий розклад:</h4><ul>';
    schedule.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += '</ul></div>';
    
    // Add recommendations
    html += '<div class="recommendations"><h4>Рекомендації для ефективного навчання:</h4><ul>';
    recommendations.forEach(rec => {
      html += `<li>${rec}</li>`;
    });
    html += '</ul></div>';
    
    // Add general tips
    html += `
      <div class="general-tips">
        <h4>Загальні поради:</h4>
        <ul>
          <li>🎯 Дотримуйтесь розкладу, але будьте гнучкими при необхідності</li>
          <li>📊 Відстежуйте свій прогрес щотижня</li>
          <li>💪 Робіть перерви кожні 45-60 хвилин</li>
          <li>😴 Забезпечуйте достатній сон (7-8 годин)</li>
          <li>🥗 Підтримуйте здорове харчування</li>
          <li>🏃‍♂️ Включайте фізичну активність у свій режим</li>
          <li>📱 Мінімізуйте відволікання під час навчання</li>
        </ul>
      </div>
    </div>
    `;
    
    result.innerHTML = html;
  }
});