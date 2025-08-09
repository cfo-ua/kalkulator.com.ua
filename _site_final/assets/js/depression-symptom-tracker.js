document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('depression-tracker-form');
  const result = document.getElementById('depression-tracker-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const timePeriod = form['time-period'].value;
    
    // Get symptom scores
    const depressedMood = +form['depressed-mood'].value;
    const anhedonia = +form.anhedonia.value;
    const selfWorth = +form['self-worth'].value;
    const guilt = +form.guilt.value;
    const fatigue = +form.fatigue.value;
    const sleepProblems = +form['sleep-problems'].value;
    const appetiteChanges = +form['appetite-changes'].value;
    const concentration = +form.concentration.value;
    const decisionMaking = +form['decision-making'].value;
    const negativeThoughts = +form['negative-thoughts'].value;
    const socialWithdrawal = +form['social-withdrawal'].value;
    const psychomotorChanges = +form['psychomotor-changes'].value;
    const suicidalThoughts = +form['suicidal-thoughts'].value;
    const functionalImpairment = +form['functional-impairment'].value;
    
    // Get additional context
    const stressors = Array.from(form.querySelectorAll('input[name="stressors"]:checked')).map(cb => cb.value);
    const currentTreatment = form['current-treatment'].value;
    const symptomDuration = form['symptom-duration'].value;

    // Validation
    if (!age || !gender || !timePeriod || !currentTreatment || !symptomDuration) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    // Calculate total depression score (PHQ-9 style scoring)
    const totalScore = depressedMood + anhedonia + selfWorth + guilt + fatigue + 
                      sleepProblems + appetiteChanges + concentration + decisionMaking + 
                      negativeThoughts + socialWithdrawal + psychomotorChanges + suicidalThoughts;

    // Determine severity level
    let severityLevel = '';
    let severityDescription = '';
    let severityColor = '';
    let recommendations = [];
    let warnings = [];

    if (totalScore <= 9) {
      severityLevel = 'Мінімальна';
      severityDescription = 'Мало або відсутні симптоми депресії';
      severityColor = '#28a745';
      recommendations.push('🌟 Продовжуйте підтримувати гарне ментальне здоров\'я');
      recommendations.push('💪 Підтримуйте здоровий спосіб життя та режим сну');
      recommendations.push('🤝 Зберігайте соціальні зв\'язки та підтримку');
    } else if (totalScore <= 16) {
      severityLevel = 'Легка';
      severityDescription = 'Деякі симптоми депресії з мінімальним впливом';
      severityColor = '#ffc107';
      recommendations.push('👀 Моніторьте свій настрій та симптоми');
      recommendations.push('🏃 Збільшіть фізичну активність та час на свіжому повітрі');
      recommendations.push('😴 Покращіть гігієну сну та режим');
      recommendations.push('🧘 Розгляньте техніки релаксації та майндфулнес');
    } else if (totalScore <= 23) {
      severityLevel = 'Помірна';
      severityDescription = 'Помітні симптоми депресії, що впливають на щоденне життя';
      severityColor = '#fd7e14';
      recommendations.push('🩺 Розгляньте консультацію з лікарем або психологом');
      recommendations.push('📚 Дізнайтеся про когнітивно-поведінкову терапію');
      recommendations.push('👥 Зверніться до груп підтримки');
      recommendations.push('📝 Ведіть щоденник настрою для відстеження патернів');
      warnings.push('⚠️ Симптоми помірної депресії потребують професійної оцінки');
    } else if (totalScore <= 30) {
      severityLevel = 'Помірно тяжка';
      severityDescription = 'Значна депресія, що потребує уваги';
      severityColor = '#dc3545';
      recommendations.push('🚨 Настійно рекомендується професійна допомога');
      recommendations.push('👨‍⚕️ Зверніться до психіатра або психолога');
      recommendations.push('💊 Обговоріть можливості лікування (терапія/медикаменти)');
      recommendations.push('🏥 Розгляньте стаціонарні програми лікування');
      warnings.push('⚠️ Помірно тяжка депресія потребує професійного лікування');
      warnings.push('⚠️ Не ігноруйте ці симптоми - зверніться за допомогою сьогодні');
    } else {
      severityLevel = 'Тяжка';
      severityDescription = 'Тяжка депресія, що потребує негайної професійної допомоги';
      severityColor = '#dc3545';
      recommendations.push('🆘 НЕГАЙНО зверніться за професійною допомогою');
      recommendations.push('🏥 Розгляньте звернення до відділення невідкладної допомоги');
      recommendations.push('📞 Зателефонуйте на лінію кризової підтримки');
      recommendations.push('👨‍👩‍👧‍👦 Зверніться до надійних друзів або родини за підтримкою');
      warnings.push('🚨 КРИТИЧНИЙ РІВЕНЬ: Потребує негайної професійної допомоги');
      warnings.push('🚨 НЕ залишайтеся наодинці з цими почуттями');
    }

    // Special handling for suicidal thoughts
    if (suicidalThoughts > 0) {
      warnings.unshift('🆘 УВАГА: Виявлені суїцидальні думки - негайно зверніться за допомогою');
      recommendations.unshift('📞 Негайно зателефонуйте: Лінія довіри "Ла Страда" 116 123 або 7333');
    }

    // Additional recommendations based on context
    if (stressors.length > 0 && !stressors.includes('none')) {
      recommendations.push('🎯 Робота зі стресовими факторами може покращити симптоми');
    }
    
    if (currentTreatment === 'none' && totalScore > 10) {
      recommendations.push('💡 Професійна допомога може значно покращити ваш стан');
    }

    if (symptomDuration === 'years' || symptomDuration === '6-months') {
      recommendations.push('⏰ Тривалі симптоми потребують комплексного лікування');
    }

    const timePeriodNames = {
      'past-week': 'Минулий тиждень',
      'past-two-weeks': 'Минулі два тижні', 
      'past-month': 'Минулий місяць'
    };

    const treatmentNames = {
      'none': 'Без лікування',
      'therapy': 'Тільки терапія',
      'medication': 'Тільки медикаменти',
      'both': 'Терапія та медикаменти',
      'other': 'Інше лікування'
    };

    const durationNames = {
      'weeks': 'Кілька тижнів',
      'months': 'Кілька місяців',
      '6-months': '6 місяців - 1 рік',
      'years': 'Більше року',
      'episodic': 'Епізодично'
    };

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Результати оцінки симптомів депресії</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <h4 style="color:${severityColor};margin-top:0;">Рівень тяжкості: ${severityLevel}</h4>
          <div style="font-size:3em;font-weight:bold;color:${severityColor};margin:20px 0;">${totalScore}</div>
          <div style="background:#f8f9fa;padding:15px;border-radius:6px;margin:15px 0;">
            <p style="margin:0;color:#666;"><strong>Загальний бал:</strong> ${totalScore} з 39 можливих</p>
            <p style="margin:5px 0 0 0;color:${severityColor};"><strong>${severityDescription}</strong></p>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Деталі оцінки</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div><strong>Період оцінки:</strong> ${timePeriodNames[timePeriod]}</div>
            <div><strong>Поточне лікування:</strong> ${treatmentNames[currentTreatment]}</div>
            <div><strong>Тривалість симптомів:</strong> ${durationNames[symptomDuration]}</div>
            <div><strong>Функціональне порушення:</strong> ${functionalImpairment}/3</div>
          </div>
        </div>

        ${warnings.length > 0 ? `
        <div style="background:#f8d7da;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#721c24;">🚨 Важливі попередження</h4>
          <ul style="margin:5px 0;color:#721c24;">
            ${warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Персоналізовані рекомендації</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🎯 Стратегії самодопомоги</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>📅 Щоденна рутина:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Встановіть регулярний режим сну</li>
                <li>Плануйте щоденні активності</li>
                <li>Встановлюйте досяжні цілі</li>
              </ul>
            </div>
            <div>
              <strong>🏃 Фізична активність:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>30 хвилин ходьби щодня</li>
                <li>Час на свіжому повітрі</li>
                <li>Регулярні фізичні вправи</li>
              </ul>
            </div>
            <div>
              <strong>👥 Соціальна підтримка:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Підтримуйте зв'язок з близькими</li>
                <li>Приєднайтеся до груп підтримки</li>
                <li>Не ізолюйтеся від інших</li>
              </ul>
            </div>
            <div>
              <strong>🧘 Ментальне здоров'я:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Практикуйте майндфулнес</li>
                <li>Ведіть щоденник вдячності</li>
                <li>Уникайте алкоголю та наркотиків</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">📞 Ресурси кризової допомоги</h4>
          <div style="color:#856404;">
            <p><strong>Національна лінія запобігання самогубствам:</strong> 7333 (безкоштовно)</p>
            <p><strong>Лінія довіри "Ла Страда":</strong> 116 123</p>
            <p><strong>Служба невідкладної психологічної допомоги:</strong> 103</p>
            <p><strong>У критичній ситуації:</strong> Негайно зверніться до лікарні або викличте швидку 103</p>
          </div>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">⚠️ Важливе застереження</h4>
          <p style="margin:0;color:#383d41;font-size:0.9em;">
            Цей інструмент призначений для самооцінки та освітніх цілей. Він НЕ замінює професійну діагностику або лікування. 
            Якщо ви відчуваєте симптоми депресії, особливо думки про самозаподіяння шкоди, негайно зверніться до кваліфікованого 
            фахівця з ментального здоров'я або медичного працівника.
          </p>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});