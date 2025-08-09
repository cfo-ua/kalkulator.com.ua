document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('life-expectancy-form');
  const result = document.getElementById('life-expectancy-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const age = +form.age.value;
    const gender = form.gender.value;
    const country = form.country.value;
    const familyLongevity = form['family-longevity'].value;
    const familyDiseases = form['family-diseases'].value;
    const healthStatus = form['health-status'].value;
    const bmi = form.bmi.value;
    const smoking = form.smoking.value;
    const alcohol = form.alcohol.value;
    const exercise = form.exercise.value;
    const diet = form.diet.value;
    const processedFood = form['processed-food'].value;
    const stress = form.stress.value;
    const social = form.social.value;
    const sleep = form.sleep.value;
    const environment = form.environment.value;
    const occupationRisk = form['occupation-risk'].value;

    // Validation
    if (!age || !gender || !country || !familyLongevity || !familyDiseases || 
        !healthStatus || !bmi || !smoking || !alcohol || !exercise || !diet || 
        !processedFood || !stress || !social || !sleep || !environment || !occupationRisk) {
      result.innerHTML = '<p style="color:red;">Будь ласка, відповідайте на всі запитання, щоб отримати точний розрахунок тривалості життя.</p>';
      return;
    }

    // Base life expectancy by country and gender
    let baseLifeExpectancy = 0;
    const countryAdjustments = {
      'high': { male: 82, female: 87 },
      'medium-high': { male: 78, female: 83 },
      'medium': { male: 74, female: 79 },
      'low-medium': { male: 70, female: 75 },
      'low': { male: 65, female: 70 }
    };
    
    baseLifeExpectancy = countryAdjustments[country][gender];

    // Initialize adjustments
    let lifeExpectancyAdjustment = 0;
    let factorImpacts = {};

    // Family genetics impact (±8 years)
    let familyAdjustment = 0;
    switch (familyLongevity) {
      case 'excellent': familyAdjustment = +6; break;
      case 'good': familyAdjustment = +3; break;
      case 'average': familyAdjustment = 0; break;
      case 'poor': familyAdjustment = -4; break;
      case 'unknown': familyAdjustment = -1; break;
    }
    
    switch (familyDiseases) {
      case 'none': familyAdjustment += 2; break;
      case 'minimal': familyAdjustment += 1; break;
      case 'moderate': familyAdjustment -= 2; break;
      case 'significant': familyAdjustment -= 4; break;
    }
    
    factorImpacts.genetics = familyAdjustment;
    lifeExpectancyAdjustment += familyAdjustment;

    // Current health status impact (±6 years)
    let healthAdjustment = 0;
    switch (healthStatus) {
      case 'excellent': healthAdjustment = +4; break;
      case 'very-good': healthAdjustment = +2; break;
      case 'good': healthAdjustment = 0; break;
      case 'fair': healthAdjustment = -3; break;
      case 'poor': healthAdjustment = -6; break;
    }
    factorImpacts.currentHealth = healthAdjustment;
    lifeExpectancyAdjustment += healthAdjustment;

    // BMI impact (±4 years)
    let bmiAdjustment = 0;
    switch (bmi) {
      case 'underweight': bmiAdjustment = -2; break;
      case 'normal': bmiAdjustment = +2; break;
      case 'overweight': bmiAdjustment = -1; break;
      case 'obese': bmiAdjustment = -3; break;
      case 'severely-obese': bmiAdjustment = -4; break;
    }
    factorImpacts.bmi = bmiAdjustment;
    lifeExpectancyAdjustment += bmiAdjustment;

    // Smoking impact (±8 years)
    let smokingAdjustment = 0;
    switch (smoking) {
      case 'never': smokingAdjustment = +3; break;
      case 'former': smokingAdjustment = +1; break;
      case 'recent-former': smokingAdjustment = -1; break;
      case 'light': smokingAdjustment = -4; break;
      case 'moderate': smokingAdjustment = -6; break;
      case 'heavy': smokingAdjustment = -8; break;
    }
    factorImpacts.smoking = smokingAdjustment;
    lifeExpectancyAdjustment += smokingAdjustment;

    // Alcohol impact (±3 years)
    let alcoholAdjustment = 0;
    switch (alcohol) {
      case 'none': alcoholAdjustment = +1; break;
      case 'light': alcoholAdjustment = +2; break; // Moderate alcohol can be protective
      case 'moderate': alcoholAdjustment = 0; break;
      case 'heavy': alcoholAdjustment = -2; break;
      case 'binge': alcoholAdjustment = -3; break;
    }
    factorImpacts.alcohol = alcoholAdjustment;
    lifeExpectancyAdjustment += alcoholAdjustment;

    // Exercise impact (±6 years)
    let exerciseAdjustment = 0;
    switch (exercise) {
      case 'very-active': exerciseAdjustment = +5; break;
      case 'active': exerciseAdjustment = +4; break;
      case 'somewhat-active': exerciseAdjustment = +2; break;
      case 'lightly-active': exerciseAdjustment = 0; break;
      case 'sedentary': exerciseAdjustment = -3; break;
    }
    factorImpacts.exercise = exerciseAdjustment;
    lifeExpectancyAdjustment += exerciseAdjustment;

    // Diet impact (±4 years)
    let dietAdjustment = 0;
    switch (diet) {
      case 'excellent': dietAdjustment = +3; break;
      case 'very-good': dietAdjustment = +2; break;
      case 'good': dietAdjustment = +1; break;
      case 'fair': dietAdjustment = -1; break;
      case 'poor': dietAdjustment = -3; break;
    }
    
    switch (processedFood) {
      case 'minimal': dietAdjustment += 1; break;
      case 'low': dietAdjustment += 0; break;
      case 'moderate': dietAdjustment -= 1; break;
      case 'high': dietAdjustment -= 2; break;
      case 'very-high': dietAdjustment -= 3; break;
    }
    
    factorImpacts.diet = dietAdjustment;
    lifeExpectancyAdjustment += dietAdjustment;

    // Stress impact (±4 years)
    let stressAdjustment = 0;
    switch (stress) {
      case 'low': stressAdjustment = +3; break;
      case 'moderate': stressAdjustment = +1; break;
      case 'high': stressAdjustment = -2; break;
      case 'chronic': stressAdjustment = -4; break;
    }
    factorImpacts.stress = stressAdjustment;
    lifeExpectancyAdjustment += stressAdjustment;

    // Social connections impact (±4 years)
    let socialAdjustment = 0;
    switch (social) {
      case 'very-strong': socialAdjustment = +3; break;
      case 'strong': socialAdjustment = +2; break;
      case 'moderate': socialAdjustment = +1; break;
      case 'weak': socialAdjustment = -1; break;
      case 'isolated': socialAdjustment = -3; break;
    }
    factorImpacts.social = socialAdjustment;
    lifeExpectancyAdjustment += socialAdjustment;

    // Sleep impact (±3 years)
    let sleepAdjustment = 0;
    switch (sleep) {
      case 'excellent': sleepAdjustment = +2; break;
      case 'good': sleepAdjustment = +1; break;
      case 'fair': sleepAdjustment = 0; break;
      case 'poor': sleepAdjustment = -2; break;
      case 'very-poor': sleepAdjustment = -3; break;
    }
    factorImpacts.sleep = sleepAdjustment;
    lifeExpectancyAdjustment += sleepAdjustment;

    // Environment impact (±3 years)
    let environmentAdjustment = 0;
    switch (environment) {
      case 'very-safe': environmentAdjustment = +2; break;
      case 'safe': environmentAdjustment = +1; break;
      case 'moderate': environmentAdjustment = 0; break;
      case 'concerning': environmentAdjustment = -2; break;
      case 'hazardous': environmentAdjustment = -3; break;
    }
    factorImpacts.environment = environmentAdjustment;
    lifeExpectancyAdjustment += environmentAdjustment;

    // Occupation risk impact (±2 years)
    let occupationAdjustment = 0;
    switch (occupationRisk) {
      case 'low': occupationAdjustment = +1; break;
      case 'moderate': occupationAdjustment = 0; break;
      case 'high': occupationAdjustment = -1; break;
      case 'extreme': occupationAdjustment = -2; break;
    }
    factorImpacts.occupation = occupationAdjustment;
    lifeExpectancyAdjustment += occupationAdjustment;

    // Calculate final life expectancy
    const estimatedLifeExpectancy = Math.round(baseLifeExpectancy + lifeExpectancyAdjustment);
    const yearsRemaining = Math.max(0, estimatedLifeExpectancy - age);
    
    // Calculate healthy life expectancy (typically 85-90% of total)
    const healthyLifeExpectancy = Math.round(estimatedLifeExpectancy * 0.88);
    const healthyYearsRemaining = Math.max(0, healthyLifeExpectancy - age);

    // Determine risk categories
    let overallRisk, riskColor;
    const totalNegativeImpact = Object.values(factorImpacts).filter(val => val < 0).reduce((sum, val) => sum + Math.abs(val), 0);
    
    if (totalNegativeImpact <= 5) {
      overallRisk = 'Низький ризик';
      riskColor = '#28a745';
    } else if (totalNegativeImpact <= 15) {
      overallRisk = 'Помірний ризик';
      riskColor = '#ffc107';
    } else if (totalNegativeImpact <= 25) {
      overallRisk = 'Високий ризик';
      riskColor = '#fd7e14';
    } else {
      overallRisk = 'Дуже високий ризик';
      riskColor = '#dc3545';
    }

    // Generate recommendations
    let recommendations = [];
    
    if (factorImpacts.smoking < 0) {
      recommendations.push('🚭 Кидайте курити: це найвпливовіша зміна, яку ви можете зробити (+10 років потенціально)');
    }
    
    if (factorImpacts.exercise <= 2) {
      recommendations.push('🏃 Збільште фізичну активність: прагніть до 150+ хвилин помірних вправ щотижня (+4-6 років)');
    }
    
    if (factorImpacts.diet <= 1) {
      recommendations.push('🥗 Покращте якість дієти: дотримуйтеся середземноморського стилю харчування (+3-5 років)');
    }
    
    if (factorImpacts.bmi < 0) {
      recommendations.push('⚖️ Досягніть здорової ваги: цільтеся на ІМТ 18.5-24.9 для оптимального довголіття (+2-4 роки)');
    }
    
    if (factorImpacts.stress < 0) {
      recommendations.push('🧘 Керуйте стресом: практикуйте медитацію, йогу або інші техніки зниження стресу (+2-4 роки)');
    }
    
    if (factorImpacts.social <= 1) {
      recommendations.push('👥 Зміцніть відносини: будуйте та підтримуйте міцні соціальні зв\'язки (+2-4 роки)');
    }
    
    if (factorImpacts.sleep <= 0) {
      recommendations.push('😴 Оптимізуйте сон: підтримуйте 7-9 годин якісного сну щоночі (+2-3 роки)');
    }
    
    if (factorImpacts.alcohol < 0) {
      recommendations.push('🍷 Помірне вживання алкоголю: обмежте до легкого-помірного споживання або виключіть (+2-3 роки)');
    }

    // Top lifestyle changes for this person
    const sortedFactors = Object.entries(factorImpacts)
      .filter(([key, value]) => value < 1)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 3);

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Ваша оцінка тривалості життя</h3>
        
        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
            <div>
              <div style="display:inline-block;background:#157aff;color:white;padding:15px 25px;border-radius:50px;font-size:1.3em;font-weight:bold;margin-bottom:10px;">
                ${estimatedLifeExpectancy} років
              </div>
              <h4 style="color:#157aff;margin:5px 0;">Очікувана тривалість життя</h4>
              <p style="color:#666;margin:0;">${yearsRemaining} років залишилося</p>
            </div>
            <div>
              <div style="display:inline-block;background:#6f9f6f;color:white;padding:15px 25px;border-radius:50px;font-size:1.3em;font-weight:bold;margin-bottom:10px;">
                ${healthyLifeExpectancy} років
              </div>
              <h4 style="color:#6f9f6f;margin:5px 0;">Здорова тривалість життя</h4>
              <p style="color:#666;margin:0;">${healthyYearsRemaining} здорових років залишилося</p>
            </div>
          </div>
          <div style="background:${riskColor};color:white;padding:10px 20px;border-radius:25px;display:inline-block;">
            <strong>Загальний ризик: ${overallRisk}</strong>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Аналіз факторів довголіття</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            ${Object.entries(factorImpacts).map(([factor, impact]) => {
              const factorNames = {
                genetics: 'Генетика',
                currentHealth: 'Поточне здоров\'я',
                bmi: 'ІМТ',
                smoking: 'Куріння',
                alcohol: 'Алкоголь',
                exercise: 'Фізичні вправи',
                diet: 'Дієта',
                stress: 'Стрес',
                social: 'Соціальні зв\'язки',
                sleep: 'Сон',
                environment: 'Довкілля',
                occupation: 'Професійні ризики'
              };
              
              const impactColor = impact >= 2 ? '#28a745' : impact >= 0 ? '#6f9f6f' : impact >= -2 ? '#ffc107' : '#dc3545';
              const impactText = impact > 0 ? `+${impact} років` : impact < 0 ? `${impact} років` : 'нейтрально';
              
              return `
                <div style="display:flex;justify-content:space-between;padding:8px;background:#f8f9fa;border-radius:4px;">
                  <span>${factorNames[factor]}:</span>
                  <span style="font-weight:bold;color:${impactColor};">${impactText}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        ${sortedFactors.length > 0 ? `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Топ-${Math.min(3, sortedFactors.length)} факторів для покращення</h4>
          <ol style="margin:5px 0;color:#666;">
            ${sortedFactors.map(([factor, impact]) => {
              const factorNames = {
                genetics: 'Генетичні фактори (незмінні)',
                currentHealth: 'Поточний стан здоров\'я',
                bmi: 'Індекс маси тіла',
                smoking: 'Статус куріння',
                alcohol: 'Споживання алкоголю',
                exercise: 'Рівень фізичних вправ',
                diet: 'Якість дієти',
                stress: 'Управління стресом',
                social: 'Соціальні зв\'язки',
                sleep: 'Якість сну',
                environment: 'Екологічне середовище',
                occupation: 'Професійні ризики'
              };
              return `<li><strong>${factorNames[factor]}:</strong> потенціал покращення ${Math.abs(impact)} років</li>`;
            }).join('')}
          </ol>
        </div>
        ` : ''}

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">🎯 Персональні рекомендації для довголіття</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🌟 Стратегії для здорового довголіття</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:10px;">
            <div>
              <strong>🥗 Харчування:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Середземноморська дієта</li>
                <li>Багато овочів та фруктів</li>
                <li>Риба та горіхи</li>
                <li>Обмеження обробленої їжі</li>
              </ul>
            </div>
            <div>
              <strong>🏃 Фізична активність:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>150 хв помірних вправ/тиждень</li>
                <li>Силові тренування 2 рази/тиждень</li>
                <li>Щоденна ходьба</li>
                <li>Активне дозвілля</li>
              </ul>
            </div>
            <div>
              <strong>🧘 Психічне здоров'я:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Управління стресом</li>
                <li>Медитація та релаксація</li>
                <li>Позитивне мислення</li>
                <li>Цілі та сенс життя</li>
              </ul>
            </div>
            <div>
              <strong>👥 Соціальне життя:</strong>
              <ul style="margin:5px 0;font-size:0.9em;color:#155724;">
                <li>Міцні сімейні зв'язки</li>
                <li>Дружба та підтримка</li>
                <li>Участь у громаді</li>
                <li>Допомога іншим</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">📊 Розуміння результатів</h4>
          <div style="color:#856404;font-size:0.95em;">
            <ul style="margin:5px 0;">
              <li><strong>Базова тривалість:</strong> ${baseLifeExpectancy} років (середня для вашої країни та статі)</li>
              <li><strong>Коригування способу життя:</strong> ${lifeExpectancyAdjustment > 0 ? '+' : ''}${lifeExpectancyAdjustment} років</li>
              <li><strong>Здорові роки:</strong> період без серйозних захворювань або обмежень</li>
              <li><strong>Точність:</strong> ±5-10 років через індивідуальні фактори</li>
            </ul>
            <p style="margin-top:10px;"><strong>Пам'ятайте:</strong> це статистична оцінка. Індивідуальні результати можуть відрізнятися через генетику, медичні досягнення та непередбачені обставини.</p>
          </div>
        </div>

        <div style="background:#e8f4fd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#157aff;">🇺🇦 Особливості для України</h4>
          <div style="color:#157aff;font-size:0.95em;">
            <p><strong>Виклики:</strong> Стрес від війни, серцево-судинні захворювання, екологічні проблеми</p>
            <p><strong>Переваги:</strong> Традиційна дієта (борщ, квашена капуста), міцні сімейні зв'язки, доступ до природи</p>
            <p><strong>Рекомендації:</strong></p>
            <ul style="margin:5px 0;">
              <li>Шукайте психологічну підтримку для стресу</li>
              <li>Використовуйте традиційні українські здорові продукти</li>
              <li>Підтримуйте зв'язки з близькими</li>
              <li>Регулярні медичні обстеження</li>
              <li>Активний спосіб життя на природі</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});