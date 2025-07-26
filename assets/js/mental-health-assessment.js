document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('mental-health-assessment-form');
  const result = document.getElementById('mental-health-assessment-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get wellness questions (1-10)
    let wellnessScore = 0;
    for (let i = 1; i <= 10; i++) {
      const value = +form[`wellness-q${i}`].value;
      wellnessScore += value;
    }
    
    // Get resilience questions (11-20) 
    let resilienceScore = 0;
    for (let i = 1; i <= 10; i++) {
      const value = +form[`resilience-q${i}`].value;
      resilienceScore += value;
    }

    // Validate all questions answered
    let allAnswered = true;
    for (let i = 1; i <= 10; i++) {
      if (!form[`wellness-q${i}`].value) allAnswered = false;
      if (!form[`resilience-q${i}`].value) allAnswered = false;
    }

    if (!allAnswered) {
      result.innerHTML = '<p style="color:red;">Будь ласка, дайте відповідь на всі питання для точної оцінки психічного здоров\'я.</p>';
      return;
    }

    // Calculate percentages
    // Wellness: Lower scores are better (0-30 total, invert to 0-100 scale)
    const wellnessPercentage = Math.max(0, Math.round(((30 - wellnessScore) / 30) * 100));
    
    // Resilience: Higher scores are better (0-40 total, convert to 0-100 scale)  
    const resiliencePercentage = Math.round((resilienceScore / 40) * 100);

    // Determine wellness level
    let wellnessLevel, wellnessColor, wellnessIcon;
    if (wellnessPercentage >= 85) {
      wellnessLevel = 'Відмінний';
      wellnessColor = '#4CAF50';
      wellnessIcon = '🟢';
    } else if (wellnessPercentage >= 70) {
      wellnessLevel = 'Добрий';
      wellnessColor = '#2196F3';
      wellnessIcon = '🔵';
    } else if (wellnessPercentage >= 55) {
      wellnessLevel = 'Помірний';
      wellnessColor = '#FF9800';
      wellnessIcon = '🟡';
    } else if (wellnessPercentage >= 40) {
      wellnessLevel = 'Турбує';
      wellnessColor = '#FF5722';
      wellnessIcon = '🟠';
    } else {
      wellnessLevel = 'Критичний';
      wellnessColor = '#F44336';
      wellnessIcon = '🔴';
    }

    // Determine resilience level
    let resilienceLevel, resilienceColor, resilienceIcon;
    if (resiliencePercentage >= 85) {
      resilienceLevel = 'Дуже стійкий';
      resilienceColor = '#4CAF50';
      resilienceIcon = '🟢';
    } else if (resiliencePercentage >= 70) {
      resilienceLevel = 'Стійкий';
      resilienceColor = '#2196F3';
      resilienceIcon = '🔵';
    } else if (resiliencePercentage >= 55) {
      resilienceLevel = 'Помірно стійкий';
      resilienceColor = '#FF9800';
      resilienceIcon = '🟡';
    } else if (resiliencePercentage >= 40) {
      resilienceLevel = 'Низька стійкість';
      resilienceColor = '#FF5722';
      resilienceIcon = '🟠';
    } else {
      resilienceLevel = 'Дуже низька стійкість';
      resilienceColor = '#F44336';
      resilienceIcon = '🔴';
    }

    // Generate recommendations
    let recommendations = [];
    let urgentWarning = '';

    // Critical warning for severe scores
    if (wellnessPercentage < 40 || wellnessScore >= 20) {
      urgentWarning = `
        <div class="insight-card warning" style="background: #ffebee; border: 2px solid #f44336; margin: 20px 0;">
          <h4 style="color: #d32f2f; margin: 0 0 10px 0;">🚨 Важливо: Зверніться за професійною допомогою</h4>
          <p style="margin: 0; color: #d32f2f;">Ваші відповіді вказують на серйозні проблеми з психічним здоров'ям. Будь ласка, розгляньте можливість звернення до фахівця з психічного здоров'я, вашого лікаря або гарячої лінії кризової допомоги.</p>
          <p style="margin: 10px 0 0 0; color: #d32f2f;"><strong>Кризові ресурси: Гаряча лінія: 7333 | Довіра для дітей: 116 111 | Екстрена допомога: 103</strong></p>
        </div>
      `;
    }

    // Wellness recommendations
    if (wellnessPercentage < 70) {
      recommendations.push('🧘 Практикуйте щоденну медитацію або усвідомленість (10-15 хвилин)');
      recommendations.push('🏃 Займайтеся регулярною фізичною активністю (30 хвилин, 5 разів на тиждень)');
      recommendations.push('😴 Приділіть увагу гігієні сну (7-9 годин, стабільний режим)');
      recommendations.push('👥 Підтримуйте зв\'язок з друзями та родиною');
    }
    
    if (wellnessPercentage < 55) {
      recommendations.push('⚕️ Розгляньте можливість консультації з фахівцем з психічного здоров\'я');
      recommendations.push('📝 Ведіть щоденник настрою для відстеження патернів і тригерів');
      recommendations.push('🚫 Обмежте алкоголь і уникайте наркотиків як способів справлятися зі стресом');
    }

    // Resilience recommendations  
    if (resiliencePercentage < 70) {
      recommendations.push('💪 Розвивайте навички розв\'язання проблем для щоденних викликів');
      recommendations.push('🧠 Працюйте над когнітивним переосмисленням (подолання негативних думок)');
      recommendations.push('🎯 Ставте малі, досяжні цілі для підвищення впевненості');
      recommendations.push('📚 Вивчайте нові навички або хобі для підвищення адаптивності');
    }

    if (resiliencePercentage < 55) {
      recommendations.push('🤝 Будуйте та зміцнюйте вашу мережу соціальної підтримки');
      recommendations.push('🙏 Розгляньте терапію, спрямовану на розвиток стресостійкості (КПТ, ДПТ)');
      recommendations.push('📖 Читайте про стресостійкість та стратегії подолання');
    }

    // Positive reinforcement for good scores
    let positiveMessage = '';
    if (wellnessPercentage >= 70 && resiliencePercentage >= 70) {
      positiveMessage = `
        <div class="insight-card success" style="background: #e8f5e8; border: 2px solid #4caf50; margin: 20px 0;">
          <h4 style="color: #2e7d32; margin: 0 0 10px 0;">🎉 Чудове психічне здоров'я!</h4>
          <p style="margin: 0; color: #2e7d32;">Ви демонструєте сильне психічне благополуччя та стресостійкість. Продовжуйте відмінні практики самодогляду!</p>
        </div>
      `;
    }

    // Display results
    result.innerHTML = `
      <div class="mental-health-results">
        ${urgentWarning}
        ${positiveMessage}
        
        <h3>🧠 Результати вашої оцінки психічного здоров'я</h3>
        
        <div class="insight-cards">
          <div class="insight-card ${wellnessPercentage >= 70 ? 'success' : wellnessPercentage >= 55 ? 'warning' : 'info'}">
            <h6>${wellnessIcon} Психічне благополуччя</h6>
            <div class="big-number" style="color: ${wellnessColor};">${wellnessPercentage}%</div>
            <p><strong>Рівень:</strong> ${wellnessLevel}</p>
          </div>
          
          <div class="insight-card ${resiliencePercentage >= 70 ? 'success' : resiliencePercentage >= 55 ? 'warning' : 'info'}">
            <h6>${resilienceIcon} Стресостійкість</h6>
            <div class="big-number" style="color: ${resilienceColor};">${resiliencePercentage}%</div>
            <p><strong>Рівень:</strong> ${resilienceLevel}</p>
          </div>
        </div>

        <div class="assessment-interpretation">
          <h4>📊 Інтерпретація результатів</h4>
          
          <div class="score-explanation">
            <h5>🧠 Психічне благополуччя (${wellnessPercentage}%)</h5>
            <p>${getWellnessDescription(wellnessPercentage)}</p>
          </div>
          
          <div class="score-explanation">
            <h5>💪 Стресостійкість (${resiliencePercentage}%)</h5>
            <p>${getResilienceDescription(resiliencePercentage)}</p>
          </div>
        </div>

        ${recommendations.length > 0 ? `
          <div class="recommendations">
            <h4>🌟 Персональні рекомендації</h4>
            <ul>
              ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="next-steps">
          <h4>📈 Наступні кроки</h4>
          <div class="insight-cards">
            <div class="insight-card info">
              <h6>📅 Регулярний моніторинг</h6>
              <p>Проходьте оцінку щомісяця для відстеження прогресу</p>
            </div>
            <div class="insight-card info">
              <h6>📝 Ведіть журнал</h6>
              <p>Записуйте настрій, тригери та позитивні моменти</p>
            </div>
            <div class="insight-card info">
              <h6>🎯 Ставте цілі</h6>
              <p>Працюйте над конкретними аспектами благополуччя</p>
            </div>
          </div>
        </div>

        <div class="wellness-tips">
          <h4>💡 Щоденні практики для психічного здоров'я</h4>
          <div class="tips-grid">
            <div class="tip-item">
              <span style="font-size: 1.5em;">🧘</span>
              <strong>Медитація</strong>
              <p>5-10 хвилин медитації зранку</p>
            </div>
            <div class="tip-item">
              <span style="font-size: 1.5em;">🚶</span>
              <strong>Прогулянки</strong>
              <p>Щоденні прогулянки на свіжому повітрі</p>
            </div>
            <div class="tip-item">
              <span style="font-size: 1.5em;">📱</span>
              <strong>Цифровий детокс</strong>
              <p>Перерви від соціальних мереж</p>
            </div>
            <div class="tip-item">
              <span style="font-size: 1.5em;">😴</span>
              <strong>Якісний сон</strong>
              <p>7-9 годин сну в одний час</p>
            </div>
            <div class="tip-item">
              <span style="font-size: 1.5em;">👥</span>
              <strong>Спілкування</strong>
              <p>Регулярний контакт з близькими</p>
            </div>
            <div class="tip-item">
              <span style="font-size: 1.5em;">🎨</span>
              <strong>Творчість</strong>
              <p>Заняття улюбленими хобі</p>
            </div>
          </div>
        </div>

        <div class="disclaimer">
          <p><strong>Важливе зауваження:</strong> Ця оцінка є освітнім інструментом і не замінює професійну медичну консультацію. Якщо ви відчуваете серйозні симптоми або думки про самопошкодження, негайно зверніться до фахівця з психічного здоров'я або служби екстреної допомоги.</p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Helper functions for descriptions
  function getWellnessDescription(percentage) {
    if (percentage >= 85) {
      return "Ваше психічне благополуччя перебуває на відмінному рівні. Ви демонструєте позитивний настрій, високу мотивацію та ефективне функціонування в повсякденному житті.";
    } else if (percentage >= 70) {
      return "Ваше психічне благополуччя в межах норми. Іноді можуть виникати незначні емоційні коливання, але загалом ви добре справляєтеся з життєвими викликами.";
    } else if (percentage >= 55) {
      return "Ваше психічне благополуччя на помірному рівні. Можливі періоди пригніченого настрою або тривожності, які варто відстежувати та вирішувати.";
    } else if (percentage >= 40) {
      return "Ваше психічне благополуччя потребує уваги. Симптоми можуть впливати на повсякденне функціонування. Рекомендується консультація з фахівцем.";
    } else {
      return "Результати вказують на серйозні проблеми з психічним благополуччям, які потребують негайної професійної допомоги та підтримки.";
    }
  }

  function getResilienceDescription(percentage) {
    if (percentage >= 85) {
      return "У вас відмінна здатність до адаптації та подолання стресу. Ви ефективно справляєтеся з викликами та швидко відновлюєтеся після труднощів.";
    } else if (percentage >= 70) {
      return "Ваша стресостійкість на хорошому рівні. Ви здатні адаптуватися до більшості життєвих змін та ефективно використовуєте копінг-стратегії.";
    } else if (percentage >= 55) {
      return "Ваша стресостійкість на помірному рівні. Іноді можуть виникати труднощі з адаптацією до стресових ситуацій, але ви маєте базові копінг-навички.";
    } else if (percentage >= 40) {
      return "Ваша стресостійкість потребує розвитку. Стресові ситуації можуть значно впливати на вас, і корисним буде вивчення нових стратегій подолання.";
    } else {
      return "Низький рівень стресостійкості може ускладнювати подолання життєвих викликів. Рекомендується робота з фахівцем для розвитку копінг-навичок.";
    }
  }
});