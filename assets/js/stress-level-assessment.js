document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('stress-assessment-form');
  const result = document.getElementById('stress-assessment-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const workOverwhelm = +form['work-overwhelm'].value;
    const workLifeBalance = +form['work-life-balance'].value;
    const workWorry = +form['work-worry'].value;
    const financialWorry = +form['financial-worry'].value;
    const financialSleep = +form['financial-sleep'].value;
    const relationshipStress = +form['relationship-stress'].value;
    const socialIsolation = +form['social-isolation'].value;
    const physicalSymptoms = +form['physical-symptoms'].value;
    const healthWorry = +form['health-worry'].value;
    const lifeChanges = +form['life-changes'].value;
    const uncertaintyHandling = +form['uncertainty-handling'].value;
    const sleepInterference = +form['sleep-interference'].value;
    const mentalExhaustion = +form['mental-exhaustion'].value;
    const copingEffectiveness = +form['coping-effectiveness'].value;
    const unhealthyCoping = +form['unhealthy-coping'].value;
    const socialSupport = +form['social-support'].value;

    // Validation
    if (!age || !gender || workOverwhelm === '' || workLifeBalance === '' || workWorry === '' || 
        financialWorry === '' || financialSleep === '' || relationshipStress === '' || 
        socialIsolation === '' || physicalSymptoms === '' || healthWorry === '' || 
        lifeChanges === '' || uncertaintyHandling === '' || sleepInterference === '' || 
        mentalExhaustion === '' || copingEffectiveness === '' || unhealthyCoping === '' || 
        socialSupport === '') {
      result.innerHTML = '<p style="color:red;">Будь ласка, відповідайте на всі запитання, щоб отримати точну оцінку стресу.</p>';
      return;
    }

    // Calculate stress domain scores
    let stressDomains = {};
    let totalStressScore = 0;

    // Work/Academic Stress (0-30)
    const workStress = workOverwhelm + workLifeBalance + workWorry;
    stressDomains.work = Math.round((workStress / 12) * 100);
    totalStressScore += workStress;

    // Financial Stress (0-20)
    const financialStress = financialWorry + financialSleep;
    stressDomains.financial = Math.round((financialStress / 8) * 100);
    totalStressScore += financialStress;

    // Relationship/Social Stress (0-20)
    const socialStress = relationshipStress + socialIsolation;
    stressDomains.social = Math.round((socialStress / 8) * 100);
    totalStressScore += socialStress;

    // Health Stress (0-20)
    const healthStress = physicalSymptoms + healthWorry;
    stressDomains.health = Math.round((healthStress / 8) * 100);
    totalStressScore += healthStress;

    // Life Changes/Uncertainty Stress (0-20)
    const changeStress = lifeChanges + uncertaintyHandling;
    stressDomains.changes = Math.round((changeStress / 8) * 100);
    totalStressScore += changeStress;

    // Sleep/Energy Stress (0-20)
    const sleepStress = sleepInterference + mentalExhaustion;
    stressDomains.sleep = Math.round((sleepStress / 8) * 100);
    totalStressScore += sleepStress;

    // Coping Resources (0-30) - Lower scores are better (inverted for display)
    const copingStress = copingEffectiveness + unhealthyCoping + socialSupport;
    stressDomains.coping = Math.round((copingStress / 12) * 100);
    totalStressScore += copingStress;

    // Calculate overall stress percentage (0-100)
    const maxPossibleScore = 150; // Sum of all maximum scores
    const stressPercentage = Math.round((totalStressScore / maxPossibleScore) * 100);

    // Determine stress level category
    let stressCategory, stressColor, stressDescription, urgencyLevel;
    
    if (stressPercentage <= 30) {
      stressCategory = 'Низький стрес';
      stressColor = '#28a745';
      stressDescription = 'Ваш рівень стресу керований і знаходиться в здорових межах.';
      urgencyLevel = 'Підтримання';
    } else if (stressPercentage <= 50) {
      stressCategory = 'Помірний стрес';
      stressColor = '#6f9f6f';
      stressDescription = 'У вас помірний стрес, який може потребувати уваги та управління.';
      urgencyLevel = 'Профілактичні дії';
    } else if (stressPercentage <= 70) {
      stressCategory = 'Високий стрес';
      stressColor = '#ffc107';
      stressDescription = 'Ви відчуваєте значний стрес, який потребує активного управління.';
      urgencyLevel = 'Потрібне активне управління';
    } else if (stressPercentage <= 85) {
      stressCategory = 'Дуже високий стрес';
      stressColor = '#fd7e14';
      stressDescription = 'У вас дуже високий рівень стресу, який ймовірно впливає на ваше щоденне життя та здоров\'я.';
      urgencyLevel = 'Потрібна негайна увага';
    } else {
      stressCategory = 'Екстремальний стрес';
      stressColor = '#dc3545';
      stressDescription = 'Ви відчуваєте екстремальний рівень стресу, який потребує негайної професійної підтримки.';
      urgencyLevel = 'Критичний рівень - шукайте допомогу';
    }

    // Generate personalized recommendations
    let recommendations = [];
    let warningFlags = [];

    // Check for concerning patterns
    if (physicalSymptoms >= 3) {
      warningFlags.push('Виявлено часті фізичні симптоми стресу');
      recommendations.push('🏥 Розгляньте медичну оцінку фізичних симптомів, пов\'язаних зі стресом');
    }
    
    if (sleepInterference >= 3) {
      warningFlags.push('Важке порушення сну від стресу');
      recommendations.push('😴 Приділіть увагу гігієні сну та розгляньте консультацію з медицини сну');
    }
    
    if (mentalExhaustion >= 3) {
      warningFlags.push('Ознаки вигорання або хронічного виснаження');
      recommendations.push('🧘 Терміново зменшіть зобов\'язання та збільшіть самодогляд');
    }
    
    if (unhealthyCoping >= 3) {
      warningFlags.push('Залежність від нездорових механізмів подолання');
      recommendations.push('🆘 Зверніться за професійною допомогою для розвитку здоровіших стратегій подолання');
    }

    // Domain-specific recommendations
    if (stressDomains.work > 60) {
      recommendations.push('💼 Вирішуйте робочий стрес через краще управління часом, межі, або консультування з кар\'єри');
    }
    
    if (stressDomains.financial > 60) {
      recommendations.push('💰 Розгляньте фінансове планування, допомогу з бюджетом або консультування з боргів');
    }
    
    if (stressDomains.social > 60) {
      recommendations.push('👥 Працюйте над навичками відносин, спілкуванням або розгляньте сімейне/парне консультування');
    }
    
    if (stressDomains.health > 60) {
      recommendations.push('🏥 Вирішуйте проблеми зі здоров\'ям з медичними фахівцями та практикуйте техніки зниження стресу');
    }
    
    if (stressDomains.changes > 60) {
      recommendations.push('🔄 Розвивайте навички адаптивності та шукайте підтримку під час життєвих переходів');
    }
    
    if (stressDomains.coping > 60) {
      recommendations.push('🛠️ Вивчайте нові техніки управління стресом та будуйте сильніші мережі підтримки');
    }

    // General stress management recommendations
    if (stressPercentage > 50) {
      recommendations.push('🧘 Практикуйте щоденне зниження стресу: медитацію, глибоке дихання або прогресивну м\'язову релаксацію');
      recommendations.push('🏃 Займайтеся регулярними фізичними вправами для зниження гормонів стресу');
      recommendations.push('📱 Обмежте споживання новин та соціальних мереж, якщо вони збільшують стрес');
    }

    if (stressPercentage > 70) {
      recommendations.push('👨‍⚕️ Розгляньте професійне консультування або терапію для управління стресом');
      recommendations.push('📞 Зверніться до надійних друзів, сім\'ї або груп підтримки');
    }

    // Identify top stress domains
    const sortedDomains = Object.entries(stressDomains)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Результати вашої оцінки рівня стресу</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:inline-block;background:${stressColor};color:white;padding:15px 30px;border-radius:50px;font-size:1.5em;font-weight:bold;margin-bottom:15px;">
            ${stressPercentage}/100
          </div>
          <h4 style="color:${stressColor};margin:10px 0;">${stressCategory}</h4>
          <p style="color:#666;margin:0;">${stressDescription}</p>
          <p style="color:#666;margin:10px 0;"><strong>Рівень дії:</strong> ${urgencyLevel}</p>
        </div>

        ${warningFlags.length > 0 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #dc3545;">
          <h4 style="margin-top:0;color:#721c24;">⚠️ Виявлено термінові занепокоєння</h4>
          <ul style="margin:5px 0;color:#721c24;">
            ${warningFlags.map(flag => `<li>${flag}</li>`).join('')}
          </ul>
          <p style="color:#721c24;font-weight:bold;margin:10px 0;">Ці патерни свідчать, що ви можете потребувати негайної професійної підтримки.</p>
        </div>
        ` : ''}

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Аналіз сфер стресу</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            ${Object.entries(stressDomains).map(([domain, score]) => {
              const displayNames = {
                work: 'Робота/Навчання',
                financial: 'Фінансова',
                social: 'Соціальна/Відносини',
                health: 'Здоров\'я та фізична',
                changes: 'Життєві зміни',
                sleep: 'Сон та енергія',
                coping: 'Ресурси подолання'
              };
              
              const domainColor = score >= 70 ? '#dc3545' : score >= 50 ? '#ffc107' : score >= 30 ? '#6f9f6f' : '#28a745';
              
              return `
                <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
                  <span>${displayNames[domain]}:</span>
                  <span style="font-weight:bold;color:${domainColor};">${score}%</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Топ 3 сфери стресу, що потребують уваги</h4>
          <ol style="margin:5px 0;color:#666;">
            ${sortedDomains.map(([domain, score], index) => {
              const displayNames = {
                work: 'Робочий/Академічний стрес',
                financial: 'Фінансовий стрес',
                social: 'Соціальний/Стрес у відносинах',
                health: 'Стрес здоров\'я та фізичний',
                changes: 'Життєві зміни та невизначеність',
                sleep: 'Проблеми зі сном та енергією',
                coping: 'Ресурси подолання та підтримки'
              };
              return `<li><strong>${displayNames[domain]}:</strong> ${score}% рівень стресу</li>`;
            }).join('')}
          </ol>
        </div>

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">🎯 Персоналізовані рекомендації з управління стресом</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#e9ecef;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#495057;">📱 Техніки швидкого зняття стресу</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🫁 Дихальні техніки:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>4-7-8 дихання: вдих 4, затримка 7, видих 8</li>
                <li>Коробкове дихання: 4-4-4-4</li>
                <li>Діафрагмальне дихання в живіт</li>
              </ul>
            </div>
            <div>
              <strong>🧘 М'язова релаксація:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>Напружіть і розслабте всі групи м'язів</li>
                <li>Почніть з ніг, закінчіть головою</li>
                <li>Затримуйте напругу на 5 секунд</li>
              </ul>
            </div>
            <div>
              <strong>🔢 Техніка заземлення 5-4-3-2-1:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>5 речей, які ви бачите</li>
                <li>4 речі, які ви чуєте</li>
                <li>3 речі, які ви можете торкнутися</li>
                <li>2 речі, які ви можете понюхати</li>
                <li>1 річ, яку ви можете покуштувати</li>
              </ul>
            </div>
            <div>
              <strong>🚶 Фізичні техніки:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#495057;">
                <li>10-хвилинна швидка прогулянка</li>
                <li>Розтяжка шиї та плечей</li>
                <li>Холодна вода на зап'ястки</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🌱 Довгострокові стратегії управління стресом</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>📅 Щоденні практики:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>10 хвилин медитації щоранку</li>
                <li>Ведення щоденника вдячності</li>
                <li>Регулярний розклад сну</li>
                <li>Обмеження кофеїну після 14:00</li>
              </ul>
            </div>
            <div>
              <strong>💪 Фізичне здоров'я:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>30 хвилин вправ 5 разів на тиждень</li>
                <li>Збалансоване харчування</li>
                <li>Достатнє споживання води</li>
                <li>Обмеження алкоголю</li>
              </ul>
            </div>
            <div>
              <strong>👥 Соціальна підтримка:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Регулярний зв'язок з близькими</li>
                <li>Участь у групах або хоббі</li>
                <li>Професійна терапія при потребі</li>
                <li>Межі в токсичних відносинах</li>
              </ul>
            </div>
            <div>
              <strong>⏰ Управління часом:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Пріоритизація завдань</li>
                <li>Делегування обов'язків</li>
                <li>Плановані перерви</li>
                <li>Реалістичні очікування</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">🚨 Коли звертатися за професійною допомогою</h4>
          <div style="color:#856404;font-size:0.95em;">
            <ul style="margin:5px 0;">
              <li><strong>Негайно:</strong> Думки про самокалічення, панічні атаки, зловживання речовинами</li>
              <li><strong>Найближчим часом:</strong> Стрес заважає роботі/навчанню більше 2 тижнів</li>
              <li><strong>Розгляньте:</strong> Фізичні симптоми без медичної причини, безсоння, хронічна втома</li>
              <li><strong>Корисно:</strong> Навчання нових технік подолання, профілактика вигорання</li>
            </ul>
            
            <h5 style="margin-top:15px;margin-bottom:5px;">Ресурси в Україні:</h5>
            <ul style="margin:5px 0;">
              <li><strong>Кризова лінія:</strong> 0800 500 335 (безкоштовно)</li>
              <li><strong>Психологічна підтримка:</strong> 0800 100 102</li>
              <li><strong>Екстрені служби:</strong> 103</li>
              <li><strong>Онлайн терапія:</strong> BetterHelp, Talkspace (українські психологи)</li>
            </ul>
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">📊 Моніторинг прогресу</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <p><strong>Рекомендується повторювати оцінку кожні 2-4 тижні для відстеження прогресу.</strong></p>
            <p><strong>Щотижневі запитання для самоперевірки:</strong></p>
            <ul style="margin:5px 0;">
              <li>Чи покращилася моя здатність справлятися зі стресом?</li>
              <li>Чи зменшилися фізичні симптоми стресу?</li>
              <li>Чи сплю я краще?</li>
              <li>Чи відчуваю я більшу підтримку від оточуючих?</li>
              <li>Які техніки працюють найкраще для мене?</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});