document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('anxiety-plan-form');
  const result = document.getElementById('anxiety-plan-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const anxietyType = form['anxiety-type'].value;
    const anxietyFrequency = +form['anxiety-frequency'].value;
    const lifeInterference = +form['life-interference'].value;
    const timeAvailable = +form['time-available'].value;
    const livingSituation = form['living-situation'].value;
    const managementPreference = form['management-preference'].value;
    const sleepImpact = form['sleep-impact'].value;
    const currentTreatment = form['current-treatment'].value;
    const primaryGoal = form['primary-goal'].value;

    // Get selected symptoms
    const symptoms = Array.from(form.querySelectorAll('input[name="symptoms"]:checked')).map(input => input.value);
    const triggers = Array.from(form.querySelectorAll('input[name="triggers"]:checked')).map(input => input.value);
    const triedTechniques = Array.from(form.querySelectorAll('input[name="tried-techniques"]:checked')).map(input => input.value);
    const calmingActivities = Array.from(form.querySelectorAll('input[name="calming-activities"]:checked')).map(input => input.value);

    // Validation
    if (!age || !gender || !anxietyType || !anxietyFrequency || !lifeInterference || 
        !timeAvailable || !livingSituation || !managementPreference || !sleepImpact || 
        !currentTreatment || !primaryGoal) {
      result.innerHTML = '<p style="color:red;">Будь ласка, відповідайте на всі запитання, щоб створити ваш персоналізований план управління тривогою.</p>';
      return;
    }

    // Calculate anxiety severity score
    const anxietySeverity = anxietyFrequency + lifeInterference;
    let severityLevel, severityColor;
    
    if (anxietySeverity <= 4) {
      severityLevel = 'Легка';
      severityColor = '#28a745';
    } else if (anxietySeverity <= 6) {
      severityLevel = 'Помірна';
      severityColor = '#ffc107';
    } else if (anxietySeverity <= 8) {
      severityLevel = 'Висока';
      severityColor = '#fd7e14';
    } else {
      severityLevel = 'Важка';
      severityColor = '#dc3545';
    }

    // Generate personalized strategies based on anxiety type
    const typeSpecificStrategies = getTypeSpecificStrategies(anxietyType);
    
    // Generate trigger-specific strategies
    const triggerStrategies = getTriggerSpecificStrategies(triggers);
    
    // Generate immediate relief techniques based on symptoms
    const immediateReliefTechniques = getImmediateReliefTechniques(symptoms);
    
    // Generate daily management plan based on time available
    const dailyPlan = getDailyManagementPlan(timeAvailable, calmingActivities);
    
    // Generate emergency action plan
    const emergencyPlan = getEmergencyActionPlan(anxietyType, symptoms);
    
    // Generate lifestyle recommendations
    const lifestyleRecommendations = getLifestyleRecommendations(sleepImpact, age, currentTreatment);
    
    // Generate progress tracking plan
    const progressTracking = getProgressTrackingPlan(primaryGoal, anxietyFrequency);

    // Professional help recommendations
    let professionalHelp = [];
    if (severityLevel === 'Важка' || currentTreatment === 'none') {
      professionalHelp.push('Розгляньте консультацію з фахівцем з психічного здоров\'я для комплексного лікування тривоги');
    }
    if (anxietyType === 'panic' && !triedTechniques.includes('therapy')) {
      professionalHelp.push('Когнітивно-поведінкова терапія (КПТ) дуже ефективна при панічному розладі');
    }
    if (anxietyType === 'social' && lifeInterference >= 4) {
      professionalHelp.push('Терапія соціальної тривоги або групова терапія можуть надати цільову підтримку');
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваш персоналізований план управління тривогою</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div>
              <div style="background:${severityColor};color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${severityLevel} тривога
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Поточний рівень</p>
            </div>
            <div>
              <div style="background:#157aff;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${getAnxietyTypeUkrainian(anxietyType)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Основний фокус</p>
            </div>
            <div>
              <div style="background:#6f9f6f;color:white;padding:10px;border-radius:8px;font-weight:bold;">
                ${timeAvailable} хв/день
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Доступний час</p>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #ffc107;">
          <h4 style="margin-top:0;color:#856404;">🎯 Ваша основна мета: ${getGoalDescriptionUkrainian(primaryGoal)}</h4>
          <p style="color:#856404;margin:5px 0;">Цей план спеціально розроблений для того, щоб допомогти вам ${getGoalActionUkrainian(primaryGoal)}.</p>
        </div>

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">⚡ Техніки негайного полегшення (використовуйте при виникненні тривоги)</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${immediateReliefTechniques.map(technique => `
              <div>
                <strong>${technique.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#0c5460;">
                  ${technique.steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">📅 Ваша щоденна рутина управління тривогою</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${dailyPlan.map(period => `
              <div>
                <strong>${period.time}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#157aff;">
                  ${period.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🧠 Специфічні стратегії для ${getAnxietyTypeUkrainian(anxietyType)} тривоги</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${typeSpecificStrategies.map(strategy => `
              <div>
                <strong>${strategy.category}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                  ${strategy.techniques.map(technique => `<li>${technique}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        ${triggers.length > 0 ? `
        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">🎯 Стратегії управління конкретними тригерами</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            ${triggerStrategies.map(trigger => `
              <div>
                <strong>${trigger.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                  ${trigger.strategies.map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#721c24;">🆘 План дій на екстрений випадок при важкій тривозі/паніці</h4>
          <div style="color:#721c24;">
            <p><strong>Коли тривога стає нестерпною, виконуйте ці кроки:</strong></p>
            <ol style="margin:5px 0;">
              ${emergencyPlan.map(step => `<li>${step}</li>`).join('')}
            </ol>
            <p style="font-weight:bold;margin-top:10px;">
              Якщо симптоми тривають або погіршуються, зверніться до: Служби екстреної допомоги (103), 
              Кризової лінії (0800 500 335), або вашого лікаря негайно.
            </p>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">🌱 Оптимізація способу життя для управління тривогою</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            ${lifestyleRecommendations.map(category => `
              <div>
                <strong>${category.name}:</strong>
                <ul style="margin:5px 0;font-size:0.9em;color:#666;">
                  ${category.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">📊 План відстеження прогресу та коригування</h4>
          <div style="color:#856404;">
            <p><strong>Тиждень 1-2: Побудова основи</strong></p>
            <ul style="margin:5px 0;font-size:0.9em;">
              ${progressTracking.weeks1_2.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p><strong>Тиждень 3-4: Розвиток навичок</strong></p>
            <ul style="margin:5px 0;font-size:0.9em;">
              ${progressTracking.weeks3_4.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p><strong>Місяць 2+: Інтеграція та майстерність</strong></p>
            <ul style="margin:5px 0;font-size:0.9em;">
              ${progressTracking.month2_plus.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        ${professionalHelp.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">👨‍⚕️ Рекомендації щодо професійної підтримки</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${professionalHelp.map(help => `<li>${help}</li>`).join('')}
          </ul>
          <p style="color:#0c5460;font-size:0.9em;margin:10px 0;">
            <strong>Типи професійної допомоги:</strong> Когнітивно-поведінкова терапія (КПТ), 
            Експозиційна терапія з запобіганням реакцій (ЕЗР), Терапія прийняття та відданості (ТПВ), 
            Консультація щодо медикаментів з психіатром або лікарем первинної допомоги.
          </p>
        </div>
        ` : ''}

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">📱 Корисні інструменти та ресурси</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>📱 Рекомендовані додатки:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Headspace (медитація та усвідомленість)</li>
                <li>Calm (сонні історії та релаксація)</li>
                <li>Sanvello (управління тривогою)</li>
                <li>MindShift (інструменти на базі КПТ)</li>
              </ul>
            </div>
            <div>
              <strong>📚 Освітні ресурси:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Українська асоціація психічного здоров'я</li>
                <li>Центр психічного здоров'я</li>
                <li>Психологічні статті online</li>
                <li>Місцеві групи підтримки</li>
              </ul>
            </div>
            <div>
              <strong>🆘 Кризові ресурси в Україні:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Національна кризова лінія: 0800 500 335</li>
                <li>Лінія психологічної підтримки: 0800 100 102</li>
                <li>Екстрена служба: 103</li>
                <li>Психологічна служба МОЗ України</li>
              </ul>
            </div>
            <div>
              <strong>💊 Інформація про медикаменти:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Обговоріть варіанти з лікарем</li>
                <li>СІОЗС, СІОЗСН для довгострокового управління</li>
                <li>Бензодіазепіни для гострих ситуацій</li>
                <li>Природні добавки (з медичним схваленням)</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">✅ Щотижневі запитання для самоперевірки</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <p><strong>Оцініть себе щотижня (шкала 1-10):</strong></p>
            <ul style="margin:5px 0;">
              <li>Наскільки ефективно я використовував техніки управління тривогою?</li>
              <li>Наскільки тривога заважала моїм щоденним заняттям?</li>
              <li>Наскільки впевнено я почуваюся в управлінні тривогою?</li>
              <li>Яка техніка працювала найкраще для мене цього тижня?</li>
              <li>Яка ситуація кинула мені найбільший виклик, і як я з нею впорався?</li>
            </ul>
            <p><strong>Коригуйте свій план на основі того, що працює найкраще для вас.</strong></p>
          </div>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🎉 Пам'ятайте: відновлення - це подорож</h4>
          <div style="color:#155724;font-size:0.95em;">
            <ul style="margin:5px 0;">
              <li><strong>Прогрес не лінійний:</strong> очікуйте злети і падіння - це нормально</li>
              <li><strong>Маленькі кроки мають значення:</strong> кожна техніка, яку ви спробуєте, це прогрес</li>
              <li><strong>Будьте терплячими:</strong> навички управління тривогою потребують часу для розвитку</li>
              <li><strong>Святкуйте перемоги:</strong> визнавайте, коли вам вдається успішно керувати тривогою</li>
              <li><strong>Залишайтеся гнучкими:</strong> коригуйте техніки на основі того, що працює для вас</li>
              <li><strong>Шукайте підтримку:</strong> вам не потрібно робити це наодинці</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  function getAnxietyTypeUkrainian(anxietyType) {
    const types = {
      'generalized': 'Генералізована',
      'social': 'Соціальна',
      'panic': 'Панічна',
      'performance': 'Виконання',
      'health': 'Здоров\'я',
      'specific': 'Специфічна',
      'mixed': 'Змішана'
    };
    return types[anxietyType] || 'Загальна';
  }

  function getTypeSpecificStrategies(anxietyType) {
    const strategies = {
      generalized: [
        {
          category: 'Управління хвилюванням',
          techniques: [
            'Виділяйте 15 хвилин щодня для "часу хвилювань"',
            'Практикуйте вправу "найгірший сценарій"',
            'Використовуйте робочі аркуші оспорювання думок',
            'Створюйте плани дій для контрольованих хвилювань'
          ]
        },
        {
          category: 'Фокус на теперішньому моменті',
          techniques: [
            'Практикуйте медитацію усвідомленості щодня',
            'Використовуйте техніки заземлення при спіралях хвилювань',
            'Займайтеся поглинаючими заняттями',
            'Фокусуйтеся на тому, що ви можете контролювати сьогодні'
          ]
        }
      ],
      social: [
        {
          category: 'Поступова експозиція',
          techniques: [
            'Почніть з малоризикованих соціальних ситуацій',
            'Практикуйте самоспівчуття за соціальні помилки',
            'Готуйте теми для розмов заздалегідь',
            'Оспорюйте негативні думки про осуд'
          ]
        },
        {
          category: 'Побудова впевненості',
          techniques: [
            'Практикуйте навички асертивності',
            'Фокусуйтеся на зв\'язку, а не на виконанні',
            'Використовуйте позитивну внутрішню розмову перед соціальними подіями',
            'Святкуйте маленькі соціальні успіхи'
          ]
        }
      ],
      panic: [
        {
          category: 'Профілактика паніки',
          techniques: [
            'Відстежуйте ранні попереджувальні знаки',
            'Практикуйте контрольоване дихання регулярно',
            'Уникайте кофеїну та стимуляторів',
            'Підтримуйте регулярний розклад сну'
          ]
        },
        {
          category: 'Техніки в моменті',
          techniques: [
            'Використовуйте техніку СТОП',
            'Практикуйте коробкове дихання (4-4-4-4)',
            'Нагадуйте собі "Це пройде"',
            'Залишайтеся в поточному місці, якщо безпечно'
          ]
        }
      ],
      performance: [
        {
          category: 'Стратегії підготовки',
          techniques: [
            'Практикуйте релаксацію перед виступами',
            'Використовуйте візуалізацію успішних результатів',
            'Готуйтеся ретельно, але уникайте надмірної підготовки',
            'Фокусуйтеся на зусиллях, а не на ідеальних результатах'
          ]
        },
        {
          category: 'Зміни мислення',
          techniques: [
            'Переосмислюйте нерви як хвилювання',
            'Фокусуйтеся на вашому повідомленні, а не на аудиторії',
            'Приймайте, що деяка нервозність нормальна',
            'Вчіться з кожного досвіду виступу'
          ]
        }
      ]
    };

    return strategies[anxietyType] || strategies.generalized;
  }

  function getTriggerSpecificStrategies(triggers) {
    const triggerStrategies = {
      'work-school': {
        name: 'Стрес на роботі/навчанні',
        strategies: [
          'Розбивайте великі завдання на менші, керовані кроки',
          'Використовуйте техніки управління часом як метод Помодоро',
          'Практикуйте відмову від несуттєвих зобов\'язань',
          'Створюйте межі між роботою та особистим часом'
        ]
      },
      'social': {
        name: 'Соціальні ситуації',
        strategies: [
          'Практикуйте соціальні навички в ситуаціях низького тиску',
          'Готуйте теми для розмов заздалегідь',
          'Фокусуйтеся на тому, щоб бути зацікавленим, а не цікавим',
          'Пам\'ятайте, що більшість людей зосереджені на собі'
        ]
      },
      'health': {
        name: 'Занепокоєння про здоров\'я',
        strategies: [
          'Обмежте пошуки про здоров\'я в інтернеті',
          'Плануйте регулярні обстеження для розгляду занепокоєнь',
          'Практикуйте медитацію сканування тіла для зменшення тривоги про здоров\'я',
          'Оспорюйте катастрофічне мислення про симптоми'
        ]
      },
      'financial': {
        name: 'Фінансові хвилювання',
        strategies: [
          'Створіть реалістичний бюджет і дотримуйтеся його',
          'Фокусуйтеся на тому, що ви можете контролювати у ваших фінансах',
          'Шукайте фінансове консультування при потребі',
          'Практикуйте вдячність за те, що у вас є'
        ]
      },
      'uncertainty': {
        name: 'Невизначеність та зміни',
        strategies: [
          'Практикуйте прийняття невизначеності як частини життя',
          'Фокусуйтеся на ваших реакціях, а не на результатах',
          'Розвивайте гнучкість та навички адаптації',
          'Створюйте плани дій на всякий випадок, коли можливо'
        ]
      }
    };

    return triggers.map(trigger => triggerStrategies[trigger]).filter(Boolean);
  }

  function getImmediateReliefTechniques(symptoms) {
    const techniques = [
      {
        name: 'Дихання 4-7-8',
        steps: [
          'Вдихніть через ніс на 4 рахунки',
          'Затримайте дихання на 7 рахунків',
          'Видихніть через рот на 8 рахунків',
          'Повторіть 3-4 рази'
        ]
      },
      {
        name: 'Заземлення 5-4-3-2-1',
        steps: [
          'Назвіть 5 речей, які ви бачите',
          'Назвіть 4 речі, які ви можете торкнутися',
          'Назвіть 3 речі, які ви чуєте',
          'Назвіть 2 речі, які ви можете понюхати',
          'Назвіть 1 річ, яку ви можете покуштувати'
        ]
      }
    ];

    // Add symptom-specific techniques
    if (symptoms.includes('heart-racing') || symptoms.includes('shortness-breath')) {
      techniques.push({
        name: 'Полегшення тиску в грудях',
        steps: [
          'Покладіть одну руку на груди, одну на живіт',
          'Дихайте повільно в живіт',
          'Відчуйте, як нижня рука рухається більше ніж верхня',
          'Рахуйте вдихи: вдих на 4, видих на 6'
        ]
      });
    }

    if (symptoms.includes('muscle-tension') || symptoms.includes('trembling')) {
      techniques.push({
        name: 'Прогресивна м\'язова релаксація',
        steps: [
          'Напружте плечі на 5 секунд, потім розслабте',
          'Напружте руки та кисті, потім розслабте',
          'Напружте обличчя та щелепи, потім розслабте',
          'Помітьте різницю між напруженим та розслабленим станом'
        ]
      });
    }

    return techniques;
  }

  function getDailyManagementPlan(timeAvailable, calmingActivities) {
    const plans = {
      5: [
        {
          time: 'Ранок (2 хв)',
          activities: ['3 глибокі вдихи', 'Поставте один позитивний намір на день']
        },
        {
          time: 'Середина дня (2 хв)',
          activities: ['Короткий скан тіла', 'Перевірте ваші емоції']
        },
        {
          time: 'Вечір (1 хв)',
          activities: ['Практика вдячності', 'Швидка техніка релаксації']
        }
      ],
      15: [
        {
          time: 'Ранок (5 хв)',
          activities: ['Дихальна вправа', 'Усвідомлена ранкова рутина', 'Позитивні афірмації']
        },
        {
          time: 'Середина дня (5 хв)',
          activities: ['Перевірка стресу', 'Коротка прогулянка або розтяжка', 'Заспокійлива діяльність']
        },
        {
          time: 'Вечір (5 хв)',
          activities: ['Рефлективне ведення щоденника', 'Техніка релаксації', 'Підготовка до завтра']
        }
      ],
      30: [
        {
          time: 'Ранок (10 хв)',
          activities: ['Медитація або усвідомленість', 'Фізичні вправи або рух', 'Планування дня']
        },
        {
          time: 'Середина дня (10 хв)',
          activities: ['Перерва для управління стресом', 'Соціальний зв\'язок', 'Приємна діяльність']
        },
        {
          time: 'Вечір (10 хв)',
          activities: ['Детальне ведення щоденника', 'Прогресивна релаксація', 'Візуалізація завтра']
        }
      ],
      60: [
        {
          time: 'Ранок (20 хв)',
          activities: ['Розширена медитація', 'Фізичні вправи', 'Усвідомлений сніданок', 'Постановка цілей']
        },
        {
          time: 'Середина дня (20 хв)',
          activities: ['Діяльність для зняття стресу', 'Соціальна взаємодія', 'Творче заняття', 'Час на природі']
        },
        {
          time: 'Вечір (20 хв)',
          activities: ['Комплексне ведення щоденника', 'Повна рутина релаксації', 'Читання або навчання', 'Підготовка до сну']
        }
      ]
    };

    return plans[timeAvailable] || plans[15];
  }

  function getEmergencyActionPlan(anxietyType, symptoms) {
    const basePlan = [
      'Знайдіть безпечне, зручне місце, щоб сісти або лягти',
      'Фокусуйтеся на повільному, глибокому диханні - вдих на 4, видих на 6',
      'Використовуйте техніку заземлення: 5-4-3-2-1 або тримайте холодний предмет',
      'Нагадайте собі: "Це тривога, вона пройде, я в безпеці"',
      'Зателефонуйте комусь підтримуючому або використовуйте заспокійливий додаток при потребі'
    ];

    if (anxietyType === 'panic') {
      basePlan.splice(3, 0, 'Залишайтеся там, де ви є - уникайте покидання ситуації, якщо можливо');
      basePlan.push('Якщо симптоми тривають >20 хвилин, розгляньте медичну оцінку');
    }

    if (symptoms.includes('chest-pain') || symptoms.includes('heart-racing')) {
      basePlan.push('Якщо біль у грудях важкий або відрізняється від звичайної тривоги, шукайте медичну допомогу');
    }

    return basePlan;
  }

  function getLifestyleRecommendations(sleepImpact, age, currentTreatment) {
    const recommendations = [
      {
        name: 'Оптимізація сну',
        recommendations: sleepImpact !== 'none' ? [
          'Підтримуйте постійний час сну та пробудження',
          'Створіть безтривожне середовище спальні',
          'Уникайте екранів за 1 годину до сну',
          'Використовуйте техніки релаксації перед сном'
        ] : [
          'Продовжуйте добрі звички сну',
          'Використовуйте час сну для практики релаксації'
        ]
      },
      {
        name: 'Фізичне благополуччя',
        recommendations: [
          'Регулярні аеробні вправи (30 хв, 3-5 разів на тиждень)',
          'Обмежте кофеїн, особливо після 14:00',
          'Залишайтеся гідратованими протягом дня',
          'Розгляньте йогу або тай чі для зв\'язку розуму та тіла'
        ]
      },
      {
        name: 'Харчування для тривоги',
        recommendations: [
          'Їжте регулярні, збалансовані прийоми їжі для стабілізації цукру в крові',
          'Включайте їжу багату омега-3 (риба, волоські горіхи)',
          'Обмежте алкоголь, оскільки він може погіршити тривогу',
          'Розгляньте їжу багату магнієм (листяна зелень, горіхи)'
        ]
      }
    ];

    if (currentTreatment === 'none') {
      recommendations.push({
        name: 'Професійна підтримка',
        recommendations: [
          'Розгляньте терапію (КПТ дуже ефективна для тривоги)',
          'Обговоріть тривогу з вашим лікарем первинної допомоги',
          'Знайдіть місцеві групи підтримки',
          'Розгляньте варіанти онлайн-терапії, якщо доступ обмежений'
        ]
      });
    }

    return recommendations;
  }

  function getProgressTrackingPlan(primaryGoal, anxietyFrequency) {
    return {
      weeks1_2: [
        'Практикуйте обрані техніки щодня, навіть коли немає тривоги',
        'Відстежуйте епізоди тривоги та тригери в щоденнику',
        'Оцінюйте рівні тривоги щодня (шкала 1-10)',
        'Помічайте, які техніки працюють найкраще для вас'
      ],
      weeks3_4: [
        'Поступово піддавайте себе легким тригерам тривоги',
        'Комбінуйте кілька технік для сильнішого ефекту',
        'Відстежуйте покращення в конкретних ситуаціях тривоги',
        'Коригуйте план на основі того, що працює'
      ],
      month2_plus: [
        'Фокусуйтеся на підтриманні досягнень та запобіганні рецидивам',
        'Справляйтеся з більш складними ситуаціями, що викликають тривогу',
        'Допомагайте іншим з тривогою, використовуючи ваші вивчені навички',
        'Продовжуйте професійне лікування, якщо рекомендовано'
      ]
    };
  }

  function getGoalDescriptionUkrainian(goal) {
    const descriptions = {
      'reduce-frequency': 'Зменшити частоту виникнення тривоги',
      'manage-symptoms': 'Краще керувати фізичними симптомами тривоги',
      'function-better': 'Покращити функціонування в повсякденному житті',
      'face-fears': 'Зіткнутися з униканими ситуаціями з впевненістю',
      'prevent-panic': 'Запобігти та керувати панічними епізодами',
      'overall-wellness': 'Покращити загальне психічне благополуччя'
    };
    return descriptions[goal] || 'Покращити управління тривогою';
  }

  function getGoalActionUkrainian(goal) {
    const actions = {
      'reduce-frequency': 'відчувати менше епізодів тривоги через стратегії профілактики',
      'manage-symptoms': 'краще справлятися з фізичними симптомами тривоги, коли вони виникають',
      'function-better': 'підтримувати ваші щоденні заняття та обов\'язки незважаючи на тривогу',
      'face-fears': 'поступово підходити та оволодівати ситуаціями, яких ви уникали',
      'prevent-panic': 'розпізнавати ранні знаки та використовувати техніки для запобігання ескалації паніки',
      'overall-wellness': 'розвинути комплексне управління тривогою для довгострокового благополуччя'
    };
    return actions[goal] || 'ефективніше керувати вашою тривогою';
  }
});