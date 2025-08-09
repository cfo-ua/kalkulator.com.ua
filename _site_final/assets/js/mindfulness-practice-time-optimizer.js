document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('mindfulness-optimizer-form');
  const result = document.getElementById('mindfulness-optimizer-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const lifeStage = form['life-stage'].value;
    const experienceLevel = form['experience-level'].value;
    const dailyTimeCommitment = +form['daily-time-commitment'].value;
    const scheduleConsistency = form['schedule-consistency'].value;
    const guidancePreference = form['guidance-preference'].value;
    const stressLevel = form['stress-level'].value;
    const energyPattern = form['energy-pattern'].value;
    const physicalLimitations = form['physical-limitations'].value;
    const technologyComfort = form['technology-comfort'].value;
    const motivationType = form['motivation-type'].value;

    // Get selected checkboxes
    const goals = Array.from(form.querySelectorAll('input[name="goals"]:checked')).map(input => input.value);
    const practiceTypes = Array.from(form.querySelectorAll('input[name="practice-types"]:checked')).map(input => input.value);
    const preferredTimes = Array.from(form.querySelectorAll('input[name="preferred-times"]:checked')).map(input => input.value);
    const practiceLocations = Array.from(form.querySelectorAll('input[name="practice-locations"]:checked')).map(input => input.value);

    // Validation
    if (!age || !lifeStage || !experienceLevel || !dailyTimeCommitment || !scheduleConsistency || 
        !guidancePreference || !stressLevel || !energyPattern || !physicalLimitations || 
        !technologyComfort || !motivationType || goals.length === 0 || practiceTypes.length === 0 || 
        preferredTimes.length === 0 || practiceLocations.length === 0) {
      result.innerHTML = '<p style="color:red;">Будь ласка, відповідайте на всі запитання та оберіть принаймні одну опцію для кожної секції з прапорцями, щоб створити ваш персоналізований план практики усвідомленості.</p>';
      return;
    }

    // Calculate recommended session durations based on experience
    const sessionDurations = getSessionDurations(experienceLevel, dailyTimeCommitment, stressLevel);
    
    // Generate optimal practice schedule
    const practiceSchedule = generatePracticeSchedule(preferredTimes, dailyTimeCommitment, scheduleConsistency, energyPattern);
    
    // Create practice progression plan
    const progressionPlan = createProgressionPlan(experienceLevel, goals, dailyTimeCommitment);
    
    // Generate personalized practice recommendations
    const practiceRecommendations = generatePracticeRecommendations(practiceTypes, goals, physicalLimitations);
    
    // Create environment and setup suggestions
    const environmentSuggestions = getEnvironmentSuggestions(practiceLocations, physicalLimitations, technologyComfort);
    
    // Generate motivation and tracking suggestions
    const motivationSuggestions = getMotivationSuggestions(motivationType, experienceLevel, goals);

    // Calculate practice intensity based on stress level and goals
    const practiceIntensity = calculatePracticeIntensity(stressLevel, goals, experienceLevel);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваш персоналізований план практики усвідомленості</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;">
              <div style="background:#157aff;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${dailyTimeCommitment} хв
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Щоденна практика</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#28a745;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${getExperienceLevelText(experienceLevel)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Ваш рівень</p>
            </div>
            <div style="text-align:center;">
              <div style="background:#fd7e14;color:white;padding:15px;border-radius:8px;font-weight:bold;font-size:1.2em;">
                ${practiceIntensity}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Інтенсивність</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">🕒 Рекомендований розклад практики</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${practiceSchedule.map(session => `
              <div style="background:#e8f4fd;padding:15px;border-radius:6px;">
                <div style="font-weight:bold;color:#157aff;margin-bottom:5px;">${session.time}</div>
                <div style="font-size:0.9em;color:#0c5460;">
                  <strong>Тривалість:</strong> ${session.duration} хв<br>
                  <strong>Тип:</strong> ${session.type}<br>
                  <strong>Фокус:</strong> ${session.focus}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">🧘 Рекомендовані практики</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:15px;">
            ${practiceRecommendations.map(practice => `
              <div style="background:#d4edda;padding:15px;border-radius:6px;">
                <div style="font-weight:bold;color:#155724;margin-bottom:8px;">${practice.name}</div>
                <div style="font-size:0.9em;color:#155724;margin-bottom:8px;">${practice.description}</div>
                <div style="font-size:0.8em;color:#6c757d;">
                  <strong>Тривалість:</strong> ${practice.duration}<br>
                  <strong>Краще для:</strong> ${practice.benefits}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">📈 План прогресії (наступні 3 місяці)</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${progressionPlan.map((month, index) => `
              <div style="background:#fff3cd;padding:15px;border-radius:6px;">
                <div style="font-weight:bold;color:#856404;margin-bottom:8px;">Місяць ${index + 1}</div>
                <ul style="margin:5px 0;font-size:0.9em;color:#856404;padding-left:20px;">
                  ${month.goals.map(goal => `<li>${goal}</li>`).join('')}
                </ul>
                <div style="background:#856404;color:white;padding:5px;border-radius:3px;text-align:center;margin-top:8px;font-size:0.8em;">
                  Ціль: ${month.target}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">🏠 Налаштування середовища</h4>
          <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
            <ul style="margin:0;color:#666;list-style-type:none;padding:0;">
              ${environmentSuggestions.map(suggestion => `
                <li style="margin:8px 0;padding:8px;background:white;border-radius:4px;border-left:4px solid #6f42c1;">
                  ${suggestion}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#dc3545;">🎯 Поради для мотивації та прогресу</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${motivationSuggestions.map(suggestion => `
              <div style="background:#f8d7da;padding:15px;border-radius:6px;border-left:4px solid #dc3545;">
                <div style="font-weight:bold;color:#721c24;margin-bottom:5px;">${suggestion.title}</div>
                <div style="font-size:0.9em;color:#721c24;">${suggestion.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #17a2b8;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Швидкі поради для початку</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div style="color:#0c5460;">
              <strong>🌅 Початок дня:</strong> ${getStartingTip(experienceLevel, 'morning')}
            </div>
            <div style="color:#0c5460;">
              <strong>⏰ Послідовність:</strong> ${getStartingTip(experienceLevel, 'consistency')}
            </div>
            <div style="color:#0c5460;">
              <strong>🧠 Підхід:</strong> ${getStartingTip(experienceLevel, 'approach')}
            </div>
            <div style="color:#0c5460;">
              <strong>📱 Технології:</strong> ${getTechnologyTip(technologyComfort)}
            </div>
          </div>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">⚠️ Важливі нагадування</h4>
          <ul style="color:#383d41;margin:10px 0;">
            <li>Почніть з малого - навіть 5 хвилин щодня краще, ніж 30 хвилин раз на тиждень</li>
            <li>Будьте терплячими до себе - навички усвідомленості розвиваються поступово</li>
            <li>Коригуйте план за потребою - ваші потреби можуть змінюватися з часом</li>
            <li>Якщо пропустили день, просто поверніться до практики наступного дня</li>
            <li>Розглядайте можливість навчання з кваліфікованим інструктором</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function getExperienceLevelText(level) {
    const levels = {
      'complete-beginner': 'Новачок',
      'beginner': 'Початківець',
      'novice': 'Новачок',
      'intermediate': 'Середній',
      'advanced': 'Просунутий'
    };
    return levels[level] || 'Новачок';
  }

  function getSessionDurations(experienceLevel, dailyTime, stressLevel) {
    const baseDurations = {
      'complete-beginner': { min: 3, max: 8 },
      'beginner': { min: 5, max: 12 },
      'novice': { min: 8, max: 20 },
      'intermediate': { min: 15, max: 35 },
      'advanced': { min: 20, max: 60 }
    };

    const base = baseDurations[experienceLevel];
    
    // Adjust for stress level
    let multiplier = 1;
    if (stressLevel === 'high' || stressLevel === 'very-high') {
      multiplier = 1.2;
    }
    
    return {
      short: Math.min(Math.round(base.min * multiplier), dailyTime),
      long: Math.min(Math.round(base.max * multiplier), dailyTime)
    };
  }

  function generatePracticeSchedule(preferredTimes, dailyTime, consistency, energyPattern) {
    const schedule = [];
    
    // Prioritize morning practice for consistency
    if (preferredTimes.includes('early-morning') || preferredTimes.includes('morning')) {
      schedule.push({
        time: 'Ранкова практика (7:00-9:00)',
        duration: Math.round(dailyTime * 0.7),
        type: 'Основна сесія',
        focus: 'Встановлення тону дня, концентрація'
      });
      
      if (dailyTime >= 20) {
        schedule.push({
          time: 'Вечірня практика (19:00-21:00)',
          duration: Math.round(dailyTime * 0.3),
          type: 'Короткий огляд',
          focus: 'Розслаблення, рефлексія'
        });
      }
    } else if (preferredTimes.includes('evening') || preferredTimes.includes('bedtime')) {
      schedule.push({
        time: 'Вечірня практика (19:00-21:00)',
        duration: dailyTime,
        type: 'Основна сесія',
        focus: 'Розслаблення, заспокоєння розуму'
      });
    } else if (preferredTimes.includes('lunch')) {
      schedule.push({
        time: 'Обідня практика (12:00-13:00)',
        duration: dailyTime,
        type: 'Основна сесія',
        focus: 'Перезавантаження, зменшення стресу'
      });
    } else {
      // Default to best practice time based on energy pattern
      const timeMap = {
        'early-morning': 'Рано вранці (6:00-7:00)',
        'morning': 'Вранці (8:00-9:00)',
        'midday': 'Вдень (12:00-13:00)',
        'afternoon': 'Після обіду (15:00-16:00)',
        'evening': 'Ввечері (19:00-20:00)',
        'night': 'Перед сном (21:00-22:00)'
      };
      
      schedule.push({
        time: timeMap[energyPattern] || 'Вранці (8:00-9:00)',
        duration: dailyTime,
        type: 'Основна сесія',
        focus: 'Адаптовано до вашого енергетичного ритму'
      });
    }
    
    return schedule;
  }

  function createProgressionPlan(experienceLevel, goals, dailyTime) {
    const progressionPlans = {
      'complete-beginner': [
        {
          goals: ['Встановити щоденну звичку', 'Вивчити базове дихання', 'Розвинути терпіння'],
          target: '5-10 хвилин щодня'
        },
        {
          goals: ['Збільшити тривалість', 'Додати техніки сканування тіла', 'Покращити концентрацію'],
          target: '10-15 хвилин щодня'
        },
        {
          goals: ['Вивчити різні типи медитації', 'Інтегрувати усвідомленість в діяльність', 'Поглибити практику'],
          target: '15-20 хвилин щодня'
        }
      ],
      'beginner': [
        {
          goals: ['Стабілізувати практику', 'Покращити фокус', 'Розвинути усвідомленість емоцій'],
          target: '10-15 хвилин щодня'
        },
        {
          goals: ['Додати медитацію ходьби', 'Вивчити техніки для стресу', 'Покращити якість практики'],
          target: '15-20 хвилин щодня'
        },
        {
          goals: ['Практикувати без керівництва', 'Розвинути співчуття', 'Поглибити самоусвідомлення'],
          target: '20-25 хвилин щодня'
        }
      ],
      'intermediate': [
        {
          goals: ['Удосконалити техніки', 'Додати складніші практики', 'Розвинути стійкість концентрації'],
          target: '25-30 хвилин щодня'
        },
        {
          goals: ['Вивчити просунуті техніки', 'Поглибити духовний аспект', 'Інтегрувати в складні ситуації'],
          target: '30-40 хвилин щодня'
        },
        {
          goals: ['Розвинути власний стиль', 'Допомагати іншим', 'Досягти сталої практики'],
          target: '40+ хвилин щодня'
        }
      ]
    };

    return progressionPlans[experienceLevel] || progressionPlans['complete-beginner'];
  }

  function generatePracticeRecommendations(practiceTypes, goals, physicalLimitations) {
    const recommendations = [];
    
    if (practiceTypes.includes('breathing')) {
      recommendations.push({
        name: 'Медитація дихання',
        description: 'Фокусування на природному диханні для заспокоєння розуму',
        duration: '5-20 хвилин',
        benefits: 'Зменшення тривоги, покращення концентрації'
      });
    }
    
    if (practiceTypes.includes('body-scan')) {
      recommendations.push({
        name: 'Сканування тіла',
        description: 'Систематична увага до відчуттів у різних частинах тіла',
        duration: '10-30 хвилин',
        benefits: 'Розслаблення, усвідомлення тіла, зменшення напруження'
      });
    }
    
    if (practiceTypes.includes('walking') && physicalLimitations === 'none') {
      recommendations.push({
        name: 'Медитація ходьби',
        description: 'Усвідомлена ходьба з фокусом на рухах та відчуттях',
        duration: '10-20 хвилин',
        benefits: 'Інтеграція руху, заземлення, енергізація'
      });
    }
    
    if (practiceTypes.includes('loving-kindness')) {
      recommendations.push({
        name: 'Медитація любомудрості',
        description: 'Культивування доброти та співчуття до себе та інших',
        duration: '10-25 хвилин',
        benefits: 'Емоційне здоров\'я, покращення відносин, самоприйняття'
      });
    }
    
    if (goals.includes('reduce-stress')) {
      recommendations.push({
        name: 'Прогресивна релаксація',
        description: 'Систематичне напруження та розслаблення м\'язів',
        duration: '15-25 хвилин',
        benefits: 'Глибоке розслаблення, зменшення фізичного стресу'
      });
    }
    
    return recommendations.slice(0, 4); // Limit to 4 recommendations
  }

  function getEnvironmentSuggestions(locations, physicalLimitations, technologyComfort) {
    const suggestions = [];
    
    if (locations.includes('dedicated-space')) {
      suggestions.push('🏠 Створіть спеціальне місце для медитації з подушкою або килимком');
    }
    
    if (locations.includes('bedroom')) {
      suggestions.push('🛏️ Використовуйте кут спальні, уникаючи ліжка під час практики');
    }
    
    if (locations.includes('outdoors')) {
      suggestions.push('🌳 Знайдіть тихе місце в природі для поглиблення зв\'язку з навколишнім світом');
    }
    
    if (physicalLimitations !== 'none') {
      suggestions.push('♿ Використовуйте стілець з підтримкою спини для комфортної пози');
    }
    
    if (technologyComfort === 'very-comfortable' || technologyComfort === 'comfortable') {
      suggestions.push('📱 Розгляньте додатки для медитації з таймерами та керованими сесіями');
    } else {
      suggestions.push('🔕 Використовуйте простий таймер або годинник для відстеження часу');
    }
    
    suggestions.push('🕯️ Приглушене освітлення або свічки створюють заспокійливу атмосферу');
    suggestions.push('🔇 Мінімізуйте шум та відволікання, вимкніть сповіщення телефону');
    
    return suggestions;
  }

  function getMotivationSuggestions(motivationType, experienceLevel, goals) {
    const suggestions = [];
    
    if (motivationType === 'progress') {
      suggestions.push({
        title: 'Відстеження прогресу',
        description: 'Ведіть журнал практики, відзначаючи тривалість та якість кожної сесії'
      });
    }
    
    if (motivationType === 'community') {
      suggestions.push({
        title: 'Соціальна підтримка',
        description: 'Приєднайтесь до груп медитації або знайдіть партнера для практики'
      });
    }
    
    if (motivationType === 'routine') {
      suggestions.push({
        title: 'Стала рутина',
        description: 'Встановіть нагадування та практикуйте в один і той же час щодня'
      });
    }
    
    if (motivationType === 'health-benefits') {
      suggestions.push({
        title: 'Фокус на результатах',
        description: 'Відстежуйте зміни в рівні стресу, сні та загальному самопочутті'
      });
    }
    
    suggestions.push({
      title: 'Гнучкість',
      description: 'Коригуйте тривалість та тип практики залежно від вашого настрою та часу'
    });
    
    return suggestions.slice(0, 3);
  }

  function calculatePracticeIntensity(stressLevel, goals, experienceLevel) {
    let intensity = 'Помірна';
    
    if (stressLevel === 'very-high' && goals.includes('reduce-stress')) {
      intensity = 'Інтенсивна';
    } else if (stressLevel === 'low' && experienceLevel === 'advanced') {
      intensity = 'Поглиблена';
    } else if (experienceLevel === 'complete-beginner') {
      intensity = 'М\'яка';
    }
    
    return intensity;
  }

  function getStartingTip(experienceLevel, type) {
    const tips = {
      morning: {
        'complete-beginner': 'Почніть з 3-5 хвилин після пробудження',
        'beginner': 'Практикуйте 5-10 хвилин перед сніданком',
        'intermediate': '15-20 хвилин для встановлення сильного фундаменту дня'
      },
      consistency: {
        'complete-beginner': 'Краще щодня 5 хвилин, ніж 30 хвилин раз на тиждень',
        'beginner': 'Встановіть нагадування та не пропускайте більше 2 днів поспіль',
        'intermediate': 'Адаптуйте практику до різних умов та ситуацій'
      },
      approach: {
        'complete-beginner': 'Будьте терплячими, розум природно блукає',
        'beginner': 'Фокусуйтесь на якості, а не кількості',
        'intermediate': 'Експериментуйте з різними техніками'
      }
    };
    
    return tips[type][experienceLevel] || tips[type]['complete-beginner'];
  }

  function getTechnologyTip(comfort) {
    const tips = {
      'very-comfortable': 'Використовуйте додатки з прогресуванням та статистикою',
      'comfortable': 'Спробуйте прості додатки з таймерами та звуками',
      'somewhat': 'Використовуйте базовий таймер на телефоні',
      'prefer-minimal': 'Звичайний годинник або внутрішній таймер',
      'avoid': 'Покладайтесь на природні ритми без технологій'
    };
    
    return tips[comfort] || tips['comfortable'];
  }
});