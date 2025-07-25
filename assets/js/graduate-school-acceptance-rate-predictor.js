document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('grad-school-form');
  const result = document.getElementById('grad-school-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const programType = document.getElementById('program-type').value;
      const universityTier = document.getElementById('university-tier').value;
      const field = document.getElementById('field').value;
      const gpa = document.getElementById('gpa').value;
      const undergradSchool = document.getElementById('undergrad-school').value;
      const academicTrend = document.getElementById('academic-trend').value;
      const greQuant = document.getElementById('gre-quant').value;
      const greVerbal = document.getElementById('gre-verbal').value;
      const gmatScore = document.getElementById('gmat-score').value;
      const englishScore = document.getElementById('english-score').value;
      const researchExperience = document.getElementById('research-experience').value;
      const publications = document.getElementById('publications').value;
      const teachingExperience = document.getElementById('teaching-experience').value;
      const workExperience = document.getElementById('work-experience').value;
      const leadership = document.getElementById('leadership').value;
      const extracurriculars = document.getElementById('extracurriculars').value;
      const sopQuality = document.getElementById('sop-quality').value;
      const recommendations = document.getElementById('recommendations').value;
      const programFit = document.getElementById('program-fit').value;
      
      // Check additional factors
      const honorsProgram = document.getElementById('honors-program').checked;
      const relevantCoursework = document.getElementById('relevant-coursework').checked;
      const additionalDegree = document.getElementById('additional-degree').checked;
      const academicAwards = document.getElementById('academic-awards').checked;
      const conferenceAttendance = document.getElementById('conference-attendance').checked;
      const researchFunding = document.getElementById('research-funding').checked;
      const volunteerWork = document.getElementById('volunteer-work').checked;
      const uniqueBackground = document.getElementById('unique-background').checked;
      const entrepreneurship = document.getElementById('entrepreneurship').checked;
      const facultyContact = document.getElementById('faculty-contact').checked;
      const applicationHelp = document.getElementById('application-help').checked;
      
      // Validation
      if (!programType || !universityTier || !field || !gpa || !undergradSchool || !academicTrend || !englishScore || !researchExperience || !publications || !teachingExperience || !workExperience || !leadership || !extracurriculars || !sopQuality || !recommendations || !programFit) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть всі обов\'язкові поля.</p>';
        return;
      }
      
      // Calculate acceptance probability
      let acceptanceScore = 50; // Base 50%
      let tips = [];
      let warnings = [];
      let recommendations = [];
      
      // Program type base acceptance rates
      const baseProgramRates = {
        'phd-stem': 15,
        'phd-humanities': 8,
        'masters-stem': 35,
        'masters-humanities': 25,
        'mba': 20,
        'uk-masters': 45,
        'eu-masters': 40,
        'professional': 30
      };
      
      acceptanceScore = baseProgramRates[programType] || 30;
      
      // University tier adjustments
      const tierMultipliers = {
        'top': 0.4,
        'high': 0.7,
        'mid': 1.2,
        'safety': 1.8,
        'mixed': 1.0
      };
      acceptanceScore *= tierMultipliers[universityTier] || 1.0;
      
      // GPA impact
      const gpaScores = {
        'below-3.0': -25,
        '3.0-3.2': -15,
        '3.2-3.4': -5,
        '3.4-3.6': 5,
        '3.6-3.8': 15,
        '3.8-4.0': 25
      };
      acceptanceScore += gpaScores[gpa] || 0;
      
      // Undergraduate school prestige
      const schoolScores = {
        'top-tier': 10,
        'r1-research': 5,
        'good-state': 0,
        'regional': -5,
        'private': 2,
        'international': -3
      };
      acceptanceScore += schoolScores[undergradSchool] || 0;
      
      // Academic trend
      const trendScores = {
        'improving': 8,
        'stable-high': 5,
        'stable-average': 0,
        'declining': -10,
        'mixed': -2
      };
      acceptanceScore += trendScores[academicTrend] || 0;
      
      // Test scores (GRE/GMAT)
      if (greQuant) {
        const quantScores = {
          'below-150': -15,
          '150-155': -8,
          '155-160': 0,
          '160-165': 8,
          '165-170': 15
        };
        acceptanceScore += quantScores[greQuant] || 0;
      }
      
      if (greVerbal) {
        const verbalScores = {
          'below-150': -10,
          '150-155': -5,
          '155-160': 0,
          '160-165': 5,
          '165-170': 10
        };
        acceptanceScore += verbalScores[greVerbal] || 0;
      }
      
      if (gmatScore) {
        const gmatScores = {
          'below-600': -20,
          '600-650': -10,
          '650-700': 0,
          '700-750': 15,
          'above-750': 25
        };
        acceptanceScore += gmatScores[gmatScore] || 0;
      }
      
      // English proficiency (crucial for international students)
      const englishScores = {
        'low': -15,
        'good': 0,
        'high': 5,
        'excellent': 10
      };
      acceptanceScore += englishScores[englishScore] || 0;
      
      // Research experience (especially important for PhD)
      const researchScores = {
        'extensive': 20,
        'significant': 12,
        'some': 5,
        'minimal': -5,
        'none': -15
      };
      let researchBonus = researchScores[researchExperience] || 0;
      
      // PhD programs weight research heavily
      if (programType.includes('phd')) {
        researchBonus *= 1.5;
      }
      acceptanceScore += researchBonus;
      
      // Publications (very important for PhD, helpful for masters)
      const publicationScores = {
        'first-author': 25,
        'co-author': 15,
        'conference': 8,
        'submitted': 5,
        'none': 0
      };
      let pubBonus = publicationScores[publications] || 0;
      if (programType.includes('phd')) {
        pubBonus *= 1.3;
      }
      acceptanceScore += pubBonus;
      
      // Teaching experience
      const teachingScores = {
        'ta': 8,
        'tutor': 5,
        'informal': 3,
        'none': 0
      };
      acceptanceScore += teachingScores[teachingExperience] || 0;
      
      // Work experience (especially important for MBA)
      const workScores = {
        'highly-relevant': 15,
        'somewhat-relevant': 8,
        'general': 3,
        'internships': 2,
        'minimal': 0
      };
      let workBonus = workScores[workExperience] || 0;
      if (programType === 'mba') {
        workBonus *= 2;
      }
      acceptanceScore += workBonus;
      
      // Leadership and extracurriculars
      const leadershipScores = {
        'significant': 10,
        'moderate': 6,
        'minimal': 2,
        'none': 0
      };
      acceptanceScore += leadershipScores[leadership] || 0;
      
      const extracurricularScores = {
        'extensive': 8,
        'moderate': 5,
        'some': 3,
        'minimal': 0
      };
      acceptanceScore += extracurricularScores[extracurriculars] || 0;
      
      // Application materials quality
      const sopScores = {
        'excellent': 15,
        'good': 8,
        'average': 0,
        'weak': -10,
        'not-written': -5
      };
      acceptanceScore += sopScores[sopQuality] || 0;
      
      const recScores = {
        'outstanding': 15,
        'strong': 10,
        'good': 5,
        'average': 0,
        'weak': -8
      };
      acceptanceScore += recScores[recommendations] || 0;
      
      // Program fit (crucial for PhD)
      const fitScores = {
        'excellent': 20,
        'good': 10,
        'decent': 0,
        'poor': -15,
        'unsure': -5
      };
      let fitBonus = fitScores[programFit] || 0;
      if (programType.includes('phd')) {
        fitBonus *= 1.5;
      }
      acceptanceScore += fitBonus;
      
      // Additional factors
      if (honorsProgram) {
        acceptanceScore += 5;
        tips.push('🏆 Диплом з відзнакою підвищує ваші шанси');
      }
      
      if (relevantCoursework) {
        acceptanceScore += 3;
      }
      
      if (additionalDegree) {
        acceptanceScore += 5;
        tips.push('🎓 Додатковий диплом демонструє широту знань');
      }
      
      if (academicAwards) {
        acceptanceScore += 5;
        tips.push('🏅 Академічні нагороди підсилюють ваш профіль');
      }
      
      if (conferenceAttendance) {
        acceptanceScore += 3;
      }
      
      if (researchFunding) {
        acceptanceScore += 8;
        tips.push('💰 Досвід отримання грантів дуже цінується');
      }
      
      if (volunteerWork) {
        acceptanceScore += 3;
      }
      
      if (uniqueBackground) {
        acceptanceScore += 8;
        tips.push('✨ Унікальний досвід може вас виділити серед інших кандидатів');
      }
      
      if (entrepreneurship) {
        acceptanceScore += 6;
        tips.push('🚀 Підприємницький досвід показує ініціативність');
      }
      
      if (facultyContact) {
        acceptanceScore += 10;
        tips.push('🤝 Контакт з викладачами значно покращує шанси, особливо для PhD');
      }
      
      if (applicationHelp) {
        acceptanceScore += 5;
        tips.push('📝 Професійна допомога з заявкою може покращити її якість');
      }
      
      // Ukrainian student advantages
      acceptanceScore += 5;
      tips.push('🇺🇦 Як український студент, ви можете мати доступ до спеціальних програм підтримки');
      
      // Cap the score between 1% and 95%
      acceptanceScore = Math.max(1, Math.min(95, acceptanceScore));
      
      // Generate specific recommendations
      generateSpecificRecommendations(acceptanceScore, programType, universityTier, gpa, researchExperience, sopQuality, recommendations, warnings);
      
      // Display results
      displayGradSchoolResults(acceptanceScore, programType, universityTier, field, recommendations, warnings, tips);
    });
  }
  
  function generateSpecificRecommendations(score, programType, tier, gpa, research, sop, recs, warnings) {
    if (score < 30) {
      warnings.push('⚠️ Низькі шанси на прийняття з поточним профілем');
      warnings.push('💡 Розгляньте відкладення вступу для покращення профілю');
    }
    
    if (tier === 'top' && score < 60) {
      warnings.push('🎯 Топ-університети дуже конкурентні з вашим поточним профілем');
      warnings.push('📊 Додайте університети середнього та запасного рівня');
    }
    
    if (programType.includes('phd') && research === 'minimal') {
      warnings.push('🔬 PhD програми вимагають значного дослідницького досвіду');
      warnings.push('📚 Отримайте більше дослідницького досвіду перед подачею');
    }
    
    if (sop === 'weak' || sop === 'not-written') {
      warnings.push('📝 Мотиваційний лист критично важливий - інвестуйте час у його написання');
    }
    
    if (recs === 'weak' || recs === 'average') {
      warnings.push('📋 Слабкі рекомендації можуть зашкодити сильному профілю');
      warnings.push('🤝 Поліпшуйте стосунки з викладачами для кращих рекомендацій');
    }
  }
  
  function displayGradSchoolResults(score, programType, tier, field, recommendations, warnings, tips) {
    const programNames = {
      'phd-stem': 'PhD - STEM',
      'phd-humanities': 'PhD - Гуманітарні науки',
      'masters-stem': 'Магістратура - STEM',
      'masters-humanities': 'Магістратура - Гуманітарні',
      'mba': 'MBA',
      'uk-masters': 'Магістратура у Великобританії',
      'eu-masters': 'Магістратура в Європі',
      'professional': 'Професійна програма'
    };
    
    const tierNames = {
      'top': 'Топ рівень',
      'high': 'Високий рівень',
      'mid': 'Середній рівень',
      'safety': 'Запасні школи',
      'mixed': 'Змішані рівні'
    };
    
    let chanceLevel = '';
    let chanceColor = '';
    let advice = '';
    
    if (score >= 70) {
      chanceLevel = 'Високі шанси';
      chanceColor = '#4CAF50';
      advice = 'Відмінний профіль! Подавайтеся впевнено, але не забувайте про запасні варіанти.';
    } else if (score >= 50) {
      chanceLevel = 'Помірні шанси';
      chanceColor = '#2196F3';
      advice = 'Солідний профіль з хорошими перспективами. Подавайтеся до широкого діапазону програм.';
    } else if (score >= 30) {
      chanceLevel = 'Нижче середнього';
      chanceColor = '#FF9800';
      advice = 'Потрібне покращення профілю. Зосередьтеся на менш конкурентних програмах або покращіть заявку.';
    } else {
      chanceLevel = 'Низькі шанси';
      chanceColor = '#F44336';
      advice = 'Значне покращення профілю необхідне. Розгляньте відкладення для отримання більшого досвіду.';
    }
    
    let html = `
      <div class="grad-school-results">
        <h3>🎯 Прогноз шансів на прийняття до аспірантури</h3>
        
        <div class="prediction-summary" style="border-left: 4px solid ${chanceColor};">
          <h4>Програма: ${programNames[programType]} (${tierNames[tier]})</h4>
          <div class="acceptance-rate">
            <span class="rate-number" style="color: ${chanceColor};">${Math.round(score)}%</span>
            <span class="rate-level">${chanceLevel}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score}%; background-color: ${chanceColor};"></div>
          </div>
          <p class="advice">${advice}</p>
        </div>
    `;
    
    // Add warnings if any
    if (warnings.length > 0) {
      html += '<div class="warnings"><h4>⚠️ Важливі зауваження:</h4><ul>';
      warnings.forEach(warning => {
        html += `<li>${warning}</li>`;
      });
      html += '</ul></div>';
    }
    
    // Add tips
    if (tips.length > 0) {
      html += '<div class="tips"><h4>💡 Ваші сильні сторони:</h4><ul>';
      tips.forEach(tip => {
        html += `<li>${tip}</li>`;
      });
      html += '</ul></div>';
    }
    
    // Add improvement suggestions
    html += generateImprovementSuggestions(score, programType);
    
    // Add application timeline
    html += generateApplicationTimeline(programType);
    
    // Add program-specific advice
    html += generateProgramAdvice(programType, score);
    
    html += '</div>';
    
    result.innerHTML = html;
  }
  
  function generateImprovementSuggestions(score, programType) {
    let html = '<div class="improvement-suggestions"><h4>📈 Поради для покращення шансів:</h4><ul>';
    
    if (score < 70) {
      html += '<li>📚 Покращіть академічні показники через додаткові курси або сертифікації</li>';
      html += '<li>📊 Перескладіть стандартизовані тести для вищих балів</li>';
    }
    
    if (programType.includes('phd')) {
      html += '<li>🔬 Отримайте більше дослідницького досвіду та публікацій</li>';
      html += '<li>🤝 Встановіть контакт з потенційними науковими керівниками</li>';
      html += '<li>📄 Розробіть чіткий дослідницький план</li>';
    } else if (programType === 'mba') {
      html += '<li>💼 Отримайте більше релевантного досвіду роботи</li>';
      html += '<li>🏆 Покращіть лідерські досягнення</li>';
      html += '<li>🌐 Розширте міжнародний досвід</li>';
    } else {
      html += '<li>💼 Отримайте релевантний досвід роботи або стажування</li>';
      html += '<li>📋 Покращіть позакласну діяльність та волонтерство</li>';
    }
    
    html += '<li>📝 Інвестуйте у написання сильного мотиваційного листа</li>';
    html += '<li>🤝 Побудуйте міцні стосунки з викладачами для рекомендацій</li>';
    html += '<li>🎯 Ретельно дослідіть програми для демонстрації відповідності</li>';
    html += '</ul></div>';
    
    return html;
  }
  
  function generateApplicationTimeline(programType) {
    let html = '<div class="application-timeline"><h4>📅 Рекомендований графік подачі заявок:</h4>';
    
    if (programType.includes('phd')) {
      html += `
        <ul>
          <li><strong>18-12 місяців до:</strong> Дослідження програм, встановлення контактів з викладачами</li>
          <li><strong>12-8 місяців до:</strong> Підготовка до тестів, збір документів</li>
          <li><strong>8-6 місяців до:</strong> Написання мотиваційного листа, запит рекомендацій</li>
          <li><strong>6-3 місяці до:</strong> Подача заявок (дедлайни: грудень-лютий)</li>
          <li><strong>3-0 місяців до:</strong> Інтерв'ю, фінальні рішення (березень-квітень)</li>
        </ul>
      `;
    } else {
      html += `
        <ul>
          <li><strong>12-9 місяців до:</strong> Дослідження програм, підготовка до тестів</li>
          <li><strong>9-6 місяців до:</strong> Складання тестів, збір документів</li>
          <li><strong>6-3 місяці до:</strong> Написання есе, запит рекомендацій</li>
          <li><strong>3-1 місяць до:</strong> Подача заявок</li>
          <li><strong>1-0 місяців до:</strong> Очікування рішень</li>
        </ul>
      `;
    }
    
    html += '</div>';
    return html;
  }
  
  function generateProgramAdvice(programType, score) {
    let html = '<div class="program-advice"><h4>🎓 Специфічні поради для вашого типу програми:</h4>';
    
    if (programType.includes('phd')) {
      html += `
        <ul>
          <li>🔬 <strong>Дослідницька відповідність критично важлива</strong> - ваші інтереси повинні збігатися з викладачами</li>
          <li>📧 Зв'яжіться з потенційними керівниками до подачі заявки</li>
          <li>📚 Публікації та презентації на конференціях значно підвищують шанси</li>
          <li>💰 Більшість PhD програм надають фінансування - не платіть за PhD</li>
        </ul>
      `;
    } else if (programType === 'mba') {
      html += `
        <ul>
          <li>💼 <strong>Досвід роботи важливіший за академічні показники</strong> - 3-5 років ідеально</li>
          <li>🏆 Демонструйте лідерський потенціал та вплив</li>
          <li>📊 GMAT/GRE результати критично важливі для топ програм</li>
          <li>🌐 Міжнародний досвід та різноманітність цінуються</li>
        </ul>
      `;
    } else if (programType.includes('uk-masters') || programType.includes('eu-masters')) {
      html += `
        <ul>
          <li>🇬🇧🇪🇺 <strong>Менш конкурентно ніж США</strong> - фокус на академічних досягненнях</li>
          <li>📝 Мотиваційний лист особливо важливий</li>
          <li>⏰ Коротші програми (1 рік) - продемонструйте готовність</li>
          <li>💰 Досліджуйте стипендії для українських студентів</li>
        </ul>
      `;
    } else {
      html += `
        <ul>
          <li>📚 <strong>Академічні досягнення найважливіші</strong> для магістерських програм</li>
          <li>💼 Релевантний досвід роботи/стажування допоможе</li>
          <li>📋 Чіткі кар'єрні цілі в мотиваційному листі</li>
          <li>🎯 Розгляньте спеціалізовані програми у вашій галузі</li>
        </ul>
      `;
    }
    
    html += '</div>';
    return html;
  }
});