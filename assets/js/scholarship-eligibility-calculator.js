document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('scholarship-form');
  const result = document.getElementById('scholarship-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const educationLevel = document.getElementById('education-level').value;
      const gpa = document.getElementById('gpa').value;
      const field = document.getElementById('field').value;
      const satScore = document.getElementById('sat-score').value;
      const greScore = document.getElementById('gre-score').value;
      const englishScore = document.getElementById('english-score').value;
      const familyIncome = document.getElementById('family-income').value;
      const financialNeed = document.getElementById('financial-need').value;
      const origin = document.getElementById('origin').value;
      const gender = document.getElementById('gender').value;
      const leadership = document.getElementById('leadership').value;
      const volunteering = document.getElementById('volunteering').value;
      const experience = document.getElementById('experience').value;
      
      // Check additional factors
      const isFirstGeneration = document.getElementById('first-generation').checked;
      const hasRefugeeStatus = document.getElementById('refugee-status').checked;
      const isMilitaryFamily = document.getElementById('military-family').checked;
      const hasAwards = document.getElementById('awards').checked;
      const hasCompetitions = document.getElementById('competitions').checked;
      const hasSports = document.getElementById('sports').checked;
      const hasLanguages = document.getElementById('languages').checked;
      
      // Validation
      if (!educationLevel || !gpa || !field || !englishScore || !familyIncome || !financialNeed || !origin || !gender || !leadership || !volunteering || !experience) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть всі обов\'язкові поля.</p>';
        return;
      }
      
      // Calculate scholarship eligibility scores
      let meritScore = 0;
      let needScore = 0;
      let diversityScore = 0;
      let leadershipScore = 0;
      let ukrainianSpecificScore = 0;
      
      let tips = [];
      let warnings = [];
      let recommendations = [];
      
      // Academic Performance (Merit) - 40% weight
      const gpaScores = {
        'below3': 15,
        '3.0-3.3': 35,
        '3.3-3.6': 60,
        '3.6-3.8': 80,
        'above3.8': 95
      };
      meritScore += gpaScores[gpa] || 50;
      
      // Test scores bonus
      if (satScore) {
        const satScores = {
          'below1200': 5,
          '1200-1350': 15,
          '1350-1450': 25,
          '1450-1550': 35,
          'above1550': 45
        };
        meritScore += satScores[satScore] || 0;
      }
      
      if (greScore) {
        const greScores = {
          'below310': 5,
          '310-320': 15,
          '320-330': 25,
          'above330': 35
        };
        meritScore += greScores[greScore] || 0;
      }
      
      // English proficiency is crucial for international students
      const englishScores = {
        'low': 10,
        'good': 30,
        'high': 50,
        'excellent': 70
      };
      meritScore += englishScores[englishScore] || 0;
      
      // Field of study (STEM often has more funding)
      const fieldScores = {
        'stem': 20,
        'business': 15,
        'medicine': 18,
        'law': 12,
        'education': 10,
        'humanities': 8,
        'social-sciences': 10,
        'arts': 8
      };
      meritScore += fieldScores[field] || 10;
      
      // Financial Need Score - 30% weight
      const incomeScores = {
        'under10k': 40,
        '10k-25k': 35,
        '25k-50k': 25,
        '50k-100k': 15,
        'over100k': 5
      };
      needScore += incomeScores[familyIncome] || 20;
      
      const needScores = {
        'high': 30,
        'moderate': 20,
        'low': 10,
        'none': 0
      };
      needScore += needScores[financialNeed] || 10;
      
      // Ukrainian-specific advantages
      ukrainianSpecificScore = 25; // Base score for being Ukrainian
      
      if (hasRefugeeStatus) {
        ukrainianSpecificScore += 30;
        tips.push('🎯 Як особа з статусом біженця, ви маєте доступ до спеціальних програм підтримки');
      }
      
      if (origin === 'displaced' || origin === 'affected-regions') {
        ukrainianSpecificScore += 25;
        tips.push('🏠 Як ВПО або особа з постраждалих регіонів, ви маєте пріоритет у багатьох програмах');
      }
      
      if (isMilitaryFamily) {
        ukrainianSpecificScore += 20;
        tips.push('🪖 Родини військовослужбовців мають спеціальні стипендійні можливості');
      }
      
      // Leadership and Activities - 20% weight
      const leadershipScores = {
        'none': 0,
        'some': 15,
        'significant': 30,
        'exceptional': 45
      };
      leadershipScore += leadershipScores[leadership] || 0;
      
      const volunteeringScores = {
        'none': 0,
        'occasional': 10,
        'regular': 20,
        'extensive': 35
      };
      leadershipScore += volunteeringScores[volunteering] || 0;
      
      const experienceScores = {
        'none': 0,
        'internships': 15,
        'research': 25,
        'publications': 40
      };
      leadershipScore += experienceScores[experience] || 0;
      
      // Diversity factors - 10% weight
      if (gender === 'female' && (field === 'stem' || field === 'business')) {
        diversityScore += 20;
        tips.push('👩‍🔬 Жінки в STEM та бізнесі мають додаткові стипендійні можливості');
      }
      
      if (isFirstGeneration) {
        diversityScore += 15;
        tips.push('🎓 Першість у здобутті вищої освіти є перевагою в багатьох програмах');
      }
      
      // Additional achievements
      if (hasAwards) {
        meritScore += 10;
      }
      
      if (hasCompetitions) {
        meritScore += 15;
        tips.push('🏆 Переможці олімпіад високо цінуються міжнародними університетами');
      }
      
      if (hasSports) {
        leadershipScore += 10;
      }
      
      if (hasLanguages) {
        diversityScore += 10;
        tips.push('🌍 Багатомовність є великою перевагою для міжнародних програм');
      }
      
      // Normalize scores to 0-100 scale
      meritScore = Math.min(100, meritScore);
      needScore = Math.min(100, needScore);
      leadershipScore = Math.min(100, leadershipScore);
      diversityScore = Math.min(100, diversityScore);
      ukrainianSpecificScore = Math.min(100, ukrainianSpecificScore);
      
      // Calculate overall score
      const overallScore = (meritScore * 0.4) + (needScore * 0.3) + (leadershipScore * 0.2) + (diversityScore * 0.1);
      
      // Generate recommendations
      generateRecommendations(overallScore, meritScore, needScore, ukrainianSpecificScore, recommendations, warnings, educationLevel, field, englishScore);
      
      // Display results
      displayResults(overallScore, meritScore, needScore, leadershipScore, diversityScore, ukrainianSpecificScore, recommendations, warnings, tips);
    });
  }
  
  function generateRecommendations(overallScore, meritScore, needScore, ukrainianScore, recommendations, warnings, educationLevel, field, englishScore) {
    // Overall recommendations based on score
    if (overallScore >= 80) {
      recommendations.push('🌟 Відмінні шанси! Подавайтеся на престижні стипендії');
      recommendations.push('🎯 Розгляньте Fulbright, Chevening, DAAD та топ-університети');
    } else if (overallScore >= 60) {
      recommendations.push('👍 Хороші шанси на багато стипендій');
      recommendations.push('📚 Зосередьтеся на середньому рівні університетів та спеціальних програмах для українців');
    } else if (overallScore >= 40) {
      recommendations.push('💪 Помірні шанси, потрібне покращення профілю');
      recommendations.push('📈 Працюйте над академічними досягненнями та позакласною діяльністю');
    } else {
      recommendations.push('⚠️ Низькі шанси, необхідна серйозна підготовка');
      recommendations.push('🔧 Значно покращіть академічний профіль перед подачею');
    }
    
    // Merit-specific recommendations
    if (meritScore < 50) {
      warnings.push('📚 Низькі академічні показники можуть обмежити можливості');
      recommendations.push('📖 Зосередьтеся на покращенні середнього балу та результатів тестів');
    }
    
    // English proficiency recommendations
    if (englishScore === 'low') {
      warnings.push('🗣️ Низький рівень англійської обмежує можливості');
      recommendations.push('💬 Інвестуйте в покращення англійської мови (IELTS/TOEFL)');
    }
    
    // Field-specific recommendations
    if (field === 'stem') {
      recommendations.push('🔬 STEM галузі мають багато фінансування - підкресліть технічні навички');
    } else if (field === 'arts' || field === 'humanities') {
      recommendations.push('🎨 Для творчих галузей важливе портфоліо та унікальний досвід');
    }
    
    // Education level recommendations
    if (educationLevel === 'high-school') {
      recommendations.push('🎓 Як випускник школи, зосередьтеся на SAT/ACT та волонтерстві');
    } else if (educationLevel === 'graduate') {
      recommendations.push('🔬 Для магістратури важливий дослідницький досвід та рекомендації');
    }
    
    // Ukrainian-specific recommendations
    recommendations.push('🇺🇦 Як український студент, ви маєте доступ до спеціальних програм підтримки');
    recommendations.push('📅 Почніть підготовку заявок за 12-18 місяців до навчання');
    recommendations.push('📝 Підготуйте переконливе особисте есе про ваші цілі та мотивацію');
  }
  
  function displayResults(overallScore, meritScore, needScore, leadershipScore, diversityScore, ukrainianScore, recommendations, warnings, tips) {
    let eligibilityLevel = '';
    let eligibilityColor = '';
    
    if (overallScore >= 80) {
      eligibilityLevel = 'Відмінна';
      eligibilityColor = '#4CAF50';
    } else if (overallScore >= 60) {
      eligibilityLevel = 'Хороша';
      eligibilityColor = '#2196F3';
    } else if (overallScore >= 40) {
      eligibilityLevel = 'Помірна';
      eligibilityColor = '#FF9800';
    } else {
      eligibilityLevel = 'Низька';
      eligibilityColor = '#F44336';
    }
    
    let html = `
      <div class="scholarship-results">
        <h3>📊 Ваша оцінка права на стипендії</h3>
        
        <div class="overall-score" style="border-left: 4px solid ${eligibilityColor};">
          <h4>Загальна оцінка: ${Math.round(overallScore)}% - ${eligibilityLevel} придатність</h4>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${overallScore}%; background-color: ${eligibilityColor};"></div>
          </div>
        </div>
        
        <div class="score-breakdown">
          <h4>Детальна оцінка за категоріями:</h4>
          <div class="score-category">
            <span>🎓 Академічні досягнення:</span>
            <span>${Math.round(meritScore)}%</span>
          </div>
          <div class="score-category">
            <span>💰 Фінансові потреби:</span>
            <span>${Math.round(needScore)}%</span>
          </div>
          <div class="score-category">
            <span>🏆 Лідерство та діяльність:</span>
            <span>${Math.round(leadershipScore)}%</span>
          </div>
          <div class="score-category">
            <span>🌟 Різноманітність:</span>
            <span>${Math.round(diversityScore)}%</span>
          </div>
          <div class="score-category">
            <span>🇺🇦 Переваги для українців:</span>
            <span>${Math.round(ukrainianScore)}%</span>
          </div>
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
      html += '<div class="tips"><h4>💡 Ваші переваги:</h4><ul>';
      tips.forEach(tip => {
        html += `<li>${tip}</li>`;
      });
      html += '</ul></div>';
    }
    
    // Add recommendations
    html += '<div class="recommendations"><h4>🎯 Рекомендації для покращення шансів:</h4><ul>';
    recommendations.forEach(rec => {
      html += `<li>${rec}</li>`;
    });
    html += '</ul></div>';
    
    // Add suggested scholarship types
    html += generateScholarshipSuggestions(overallScore, meritScore, needScore, ukrainianScore);
    
    // Add resources
    html += `
      <div class="resources">
        <h4>🔗 Корисні ресурси для українських студентів:</h4>
        <ul>
          <li>📚 <strong>EducationUSA Ukraine</strong> - інформація про навчання в США</li>
          <li>🇬🇧 <strong>British Council Ukraine</strong> - стипендії для навчання у Великобританії</li>
          <li>🇩🇪 <strong>DAAD Ukraine</strong> - німецькі стипендії</li>
          <li>🇪🇺 <strong>Erasmus+ Programme</strong> - європейські програми обміну</li>
          <li>🇺🇦 <strong>Ukrainian Global Scholars</strong> - спільнота українських студентів за кордоном</li>
          <li>💼 <strong>Scholarship Portal</strong> - пошук міжнародних стипендій</li>
        </ul>
        
        <h4>⏰ Типові дедлайни подачі заявок:</h4>
        <ul>
          <li>🇺🇸 <strong>США (осінь):</strong> Грудень - Лютий попереднього року</li>
          <li>🇬🇧 <strong>Великобританія:</strong> Жовтень - Січень</li>
          <li>🇩🇪 <strong>Німеччина:</strong> Лютий - Квітень (зимовий семестр)</li>
          <li>🇪🇺 <strong>Erasmus+:</strong> Лютий - Квітень</li>
          <li>🇨🇦 <strong>Канада:</strong> Грудень - Березень</li>
        </ul>
      </div>
    </div>
    `;
    
    result.innerHTML = html;
  }
  
  function generateScholarshipSuggestions(overallScore, meritScore, needScore, ukrainianScore) {
    let html = '<div class="scholarship-suggestions"><h4>🎓 Рекомендовані типи стипендій:</h4><ul>';
    
    if (ukrainianScore >= 60) {
      html += '<li>🇺🇦 <strong>Спеціальні програми для українців:</strong> Програми підтримки українських студентів та біженців</li>';
    }
    
    if (meritScore >= 70) {
      html += '<li>🏆 <strong>Меритократичні стипендії:</strong> Стипендії за академічні досягнення</li>';
      html += '<li>🎯 <strong>Університетські стипендії:</strong> Стипендії від конкретних університетів</li>';
    }
    
    if (needScore >= 60) {
      html += '<li>💰 <strong>Стипендії за потребою:</strong> Фінансова допомога для студентів з обмеженими ресурсами</li>';
    }
    
    if (overallScore >= 60) {
      html += '<li>🌍 <strong>Урядові програми:</strong> Fulbright, Chevening, DAAD та інші державні стипендії</li>';
    }
    
    if (overallScore >= 40) {
      html += '<li>🏫 <strong>Регіональні програми:</strong> Стипендії від регіональних організацій та фондів</li>';
      html += '<li>📚 <strong>Предметні стипендії:</strong> Стипендії для конкретних галузей навчання</li>';
    }
    
    html += '</ul></div>';
    return html;
  }
});