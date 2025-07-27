document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('visa-checklist-form');
  const result = document.getElementById('visa-checklist-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const destinationCountry = document.getElementById('destination-country').value;
      const studyLevel = document.getElementById('study-level').value;
      const programDuration = document.getElementById('program-duration').value;
      const startDate = document.getElementById('start-date').value;
      const educationStatus = document.getElementById('education-status').value;
      const englishTest = document.getElementById('english-test').value;
      const fundingSource = document.getElementById('funding-source').value;
      const studyCosts = document.getElementById('study-costs').value;
      const passportStatus = document.getElementById('passport-status').value;
      const visaHistory = document.getElementById('visa-history').value;
      const applicationUrgency = document.getElementById('application-urgency').value;
      const preparationStatus = document.getElementById('preparation-status').value;
      
      // Check additional factors
      const haveAcceptance = document.getElementById('have-acceptance').checked;
      const needTranscripts = document.getElementById('need-transcripts').checked;
      const needCredentialEvaluation = document.getElementById('need-credential-evaluation').checked;
      const haveBankStatements = document.getElementById('have-bank-statements').checked;
      const needSponsor = document.getElementById('need-sponsor').checked;
      const scholarshipPending = document.getElementById('scholarship-pending').checked;
      const healthConditions = document.getElementById('health-conditions').checked;
      const vaccinationsNeeded = document.getElementById('vaccinations-needed').checked;
      const criminalRecord = document.getElementById('criminal-record').checked;
      const tightDeadline = document.getElementById('tight-deadline').checked;
      const preferProfessionalHelp = document.getElementById('prefer-professional-help').checked;
      
      // Validation
      if (!destinationCountry || !studyLevel || !programDuration || !startDate || !educationStatus || !englishTest || !fundingSource || !studyCosts || !passportStatus || !visaHistory || !applicationUrgency || !preparationStatus) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть усі обов\'язкові поля.</p>';
        return;
      }
      
      // Generate country-specific checklist
      const countryInfo = getCountryInfo(destinationCountry);
      const checklist = generateChecklist(destinationCountry, studyLevel, educationStatus, englishTest, fundingSource, passportStatus, haveAcceptance, needTranscripts, haveBankStatements, needSponsor, healthConditions, vaccinationsNeeded, criminalRecord);
      const timeline = generateTimeline(destinationCountry, applicationUrgency, startDate, tightDeadline);
      const priorities = generatePriorities(checklist, applicationUrgency, preparationStatus);
      
      // Calculate readiness score
      let readinessScore = calculateReadinessScore(
        haveAcceptance, haveBankStatements, passportStatus, englishTest, 
        needTranscripts, preparationStatus, applicationUrgency
      );
      
      const readinessMessage = getReadinessMessage(readinessScore, preparationStatus);
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${getScoreClass(readinessScore)}">
            <h6>📊 Готовність до подачі</h6>
            <div class="big-number">${readinessScore}%</div>
            <p class="insight-detail">${getReadinessLevel(readinessScore)}</p>
          </div>
          
          <div class="insight-card info">
            <h6>📅 Час підготовки</h6>
            <div class="big-number">${timeline.totalWeeks}т</div>
            <p class="insight-detail">Тижнів підготовки</p>
          </div>
          
          <div class="insight-card info">
            <h6>${countryInfo.flag} Напрямок</h6>
            <div class="big-number">${countryInfo.shortName}</div>
            <p class="insight-detail">${studyLevel}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Оцінка готовності до подачі заявки</h4>
          <p><strong>${readinessMessage}</strong></p>
        </div>`;
      
      // Add country-specific information
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>${countryInfo.flag} ${countryInfo.name} - Інформація про студентську візу</h4>
          <div style="display: grid; gap: 1rem; margin-top: 1rem;">
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>📋 Тип візи</h6>
              <p><strong>${countryInfo.visaType}</strong></p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>⏱️ Час обробки</h6>
              <p><strong>${countryInfo.processingTime}</strong></p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>💰 Візовий збір</h6>
              <p><strong>${countryInfo.fee}</strong></p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>💵 Фінансова вимога</h6>
              <p><strong>${countryInfo.financialRequirement}</strong></p>
            </div>
          </div>
        </div>`;
      
      // Add priority tasks
      if (priorities.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🎯 Пріоритетні завдання (Зробіть це першим)</h4>
            <ol style="margin-left: 1.5rem;">`;
        priorities.forEach(priority => {
          resultHTML += `<li style="margin: 0.5rem 0;"><strong>${priority}</strong></li>`;
        });
        resultHTML += `</ol></div>`;
      }
      
      // Add complete checklist organized by category
      const categorizedChecklist = categorizeChecklist(checklist);
      
      Object.keys(categorizedChecklist).forEach(category => {
        if (categorizedChecklist[category].length > 0) {
          resultHTML += `
            <div style="margin-top: 1.5rem;">
              <h4>${getCategoryIcon(category)} ${category}</h4>
              <ul style="margin-left: 1rem;">`;
          
          categorizedChecklist[category].forEach(item => {
            resultHTML += `<li style="margin: 0.5rem 0;">${item}</li>`;
          });
          
          resultHTML += `</ul></div>`;
        }
      });
      
      // Add timeline breakdown
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📅 Рекомендований графік</h4>
          <div style="margin-top: 1rem;">`;
      
      timeline.phases.forEach((phase, index) => {
        resultHTML += `
          <div style="margin: 1rem 0; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
            <h6>${phase.period}</h6>
            <p><strong>Фокус:</strong> ${phase.focus}</p>
            <ul style="margin: 0.5rem 0;">`;
        phase.tasks.forEach(task => {
          resultHTML += `<li>${task}</li>`;
        });
        resultHTML += `</ul></div>`;
      });
      
      resultHTML += `</div></div>`;
      
      // Add tips and warnings
      const tips = generateTips(destinationCountry, visaHistory, applicationUrgency, preferProfessionalHelp);
      if (tips.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Важливі поради та нагадування</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add helpful resources
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🔗 Офіційні ресурси</h4>
          <ul>
            <li><a href="${countryInfo.officialSite}" target="_blank">${countryInfo.name} - Офіційний сайт імміграції</a></li>
            <li><a href="${countryInfo.studentSite}" target="_blank">Інформація для студентів</a></li>
            <li><a href="${countryInfo.embassySite}" target="_blank">Посольство ${countryInfo.name} в Україні</a></li>
          </ul>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getCountryInfo(country) {
    const countryData = {
      'usa': {
        name: 'Сполучені Штати',
        shortName: 'США',
        flag: '🇺🇸',
        visaType: 'F-1 (Академічне навчання), M-1 (Професійне навчання)',
        processingTime: '2-8 тижнів',
        fee: '$160 USD',
        financialRequirement: 'Повна вартість навчання + $15,000-25,000/рік',
        officialSite: 'https://travel.state.gov/content/travel/en/us-visas/study.html',
        studentSite: 'https://studyinthestates.dhs.gov/',
        embassySite: 'https://ua.usembassy.gov/'
      },
      'canada': {
        name: 'Канада',
        shortName: 'CA',
        flag: '🇨🇦',
        visaType: 'Дозвіл на навчання (Study Permit)',
        processingTime: '4-12 тижнів',
        fee: '$150 CAD',
        financialRequirement: 'Навчання + $10,000 CAD/рік + транспорт',
        officialSite: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
        studentSite: 'https://www.educanada.ca/',
        embassySite: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/contact-ircc/offices/international-visa-offices/kyiv.html'
      },
      'uk': {
        name: 'Великобританія',
        shortName: 'UK',
        flag: '🇬🇧',
        visaType: 'Студентська віза (Student visa)',
        processingTime: '3-8 тижнів',
        fee: '£348-490 GBP',
        financialRequirement: 'Навчання + £1,023-1,334/місяць',
        officialSite: 'https://www.gov.uk/student-visa',
        studentSite: 'https://study-uk.britishcouncil.org/',
        embassySite: 'https://www.gov.uk/world/organisations/british-embassy-kyiv'
      },
      'australia': {
        name: 'Австралія',
        shortName: 'AU',
        flag: '🇦🇺',
        visaType: 'Студентська віза підкласу 500',
        processingTime: '4-6 тижнів',
        fee: '$630 AUD',
        financialRequirement: 'Навчання + $21,041 AUD/рік + OSHC',
        officialSite: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
        studentSite: 'https://www.studyaustralia.gov.au/',
        embassySite: 'https://ukraine.embassy.gov.au/'
      },
      'germany': {
        name: 'Німеччина',
        shortName: 'DE',
        flag: '🇩🇪',
        visaType: 'Національна віза для навчання',
        processingTime: '4-12 тижнів',
        fee: '€75 EUR',
        financialRequirement: '€11,208/рік (блокований рахунок)',
        officialSite: 'https://www.germany.travel/en/ms/german-visa/study-visa.html',
        studentSite: 'https://www.study-in-germany.de/',
        embassySite: 'https://kiew.diplo.de/'
      },
      'france': {
        name: 'Франція',
        shortName: 'FR',
        flag: '🇫🇷',
        visaType: 'Довгострокова студентська віза VLS-TS',
        processingTime: '3-8 тижнів',
        fee: '€99 EUR',
        financialRequirement: '€615/місяць мінімум',
        officialSite: 'https://www.campusfrance.org/en/student-visa-for-france',
        studentSite: 'https://www.campusfrance.org/',
        embassySite: 'https://ua.ambafrance.org/'
      },
      'netherlands': {
        name: 'Нідерланди',
        shortName: 'NL',
        flag: '🇳🇱',
        visaType: 'MVV студентська віза',
        processingTime: '4-12 тижнів',
        fee: '€350 EUR',
        financialRequirement: '€13,500/рік',
        officialSite: 'https://www.government.nl/topics/immigration-to-the-netherlands/study-visa',
        studentSite: 'https://www.studyinnl.org/',
        embassySite: 'https://www.netherlandsandyou.nl/countries-and-regions/ukraine'
      },
      'newzealand': {
        name: 'Нова Зеландія',
        shortName: 'NZ',
        flag: '🇳🇿',
        visaType: 'Студентська віза Fee Paying',
        processingTime: '4-8 тижнів',
        fee: '$375 NZD',
        financialRequirement: '$15,000 NZD/рік + навчання',
        officialSite: 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/student-visa',
        studentSite: 'https://www.newzealandeducated.com/',
        embassySite: 'https://www.mfat.govt.nz/en/countries-and-regions/europe/ukraine/'
      }
    };
    
    return countryData[country] || countryData['usa'];
  }
  
  function calculateReadinessScore(haveAcceptance, haveBankStatements, passportStatus, englishTest, needTranscripts, preparationStatus, applicationUrgency) {
    let score = 0;
    
    // Acceptance letter (30 points)
    if (haveAcceptance) score += 30;
    
    // Financial documentation (25 points)
    if (haveBankStatements) score += 25;
    
    // Passport status (20 points)
    if (passportStatus === 'valid') score += 20;
    else if (passportStatus === 'expiring') score += 15;
    else if (passportStatus === 'applying') score += 5;
    
    // English test (15 points)
    if (englishTest === 'ielts' || englishTest === 'toefl' || englishTest === 'pte') score += 15;
    else if (englishTest === 'duolingo') score += 12;
    else if (englishTest === 'native' || englishTest === 'waived') score += 15;
    
    // Preparation status (10 points)
    if (preparationStatus === 'visa-ready') score += 10;
    else if (preparationStatus === 'admitted') score += 8;
    else if (preparationStatus === 'applying') score += 5;
    else if (preparationStatus === 'researching') score += 3;
    
    return Math.min(score, 100);
  }
  
  function getReadinessLevel(score) {
    if (score >= 80) return 'Готовий до подачі';
    if (score >= 60) return 'Майже готовий';
    if (score >= 40) return 'В процесі підготовки';
    return 'Початковий етап';
  }
  
  function getScoreClass(score) {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'warning';
  }
  
  function getReadinessMessage(score, preparationStatus) {
    if (score >= 80) {
      return 'Відмінно! Ви готові подавати візову заявку. Переконайтеся, що всі документи актуальні.';
    } else if (score >= 60) {
      return 'Хороший прогрес! Вам потрібно завершити кілька ключових кроків перед подачею заявки.';
    } else if (score >= 40) {
      return 'Ви на правильному шляху. Зосередьтеся на пріоритетних завданнях для покращення готовності.';
    } else {
      return 'Початковий етап. Рекомендуємо почати з найважливіших кроків і планувати заздалегідь.';
    }
  }
  
  function generateChecklist(country, studyLevel, educationStatus, englishTest, fundingSource, passportStatus, haveAcceptance, needTranscripts, haveBankStatements, needSponsor, healthConditions, vaccinationsNeeded, criminalRecord) {
    let checklist = [];
    
    // Basic documents for all countries
    checklist.push('Дійсний паспорт (мінімум 18 місяців до закінчення)');
    checklist.push('Заповнена візова анкета');
    checklist.push('Фотографії відповідно до вимог');
    
    if (!haveAcceptance) {
      checklist.push('Лист про зарахування від навчального закладу');
    }
    
    if (englishTest === 'none') {
      checklist.push('Складіть тест з англійської мови (IELTS/TOEFL/PTE)');
    }
    
    if (!haveBankStatements) {
      checklist.push('Банківські виписки за останні 6 місяців');
    }
    
    if (needTranscripts) {
      checklist.push('Офіційні академічні довідки/транскрипти');
    }
    
    if (needSponsor) {
      checklist.push('Документи від фінансового спонсора');
    }
    
    // Country-specific requirements
    switch (country) {
      case 'usa':
        checklist.push('Форма I-20 від університету');
        checklist.push('Сплата SEVIS збору ($350)');
        checklist.push('Запис на співбесіду в консульстві');
        break;
      case 'canada':
        checklist.push('Лист про прийняття від провінційного призначеного навчального закладу (DLI)');
        checklist.push('Québec Acceptance Certificate (CAQ) для Квебеку');
        checklist.push('Медичний огляд (за необхідності)');
        break;
      case 'uk':
        checklist.push('Confirmation of Acceptance for Studies (CAS)');
        checklist.push('Тест на туберкульоз (якщо потрібно)');
        break;
      case 'australia':
        checklist.push('Confirmation of Enrolment (CoE)');
        checklist.push('Overseas Student Health Cover (OSHC)');
        checklist.push('Genuine Temporary Entrant (GTE) заява');
        break;
      case 'germany':
        checklist.push('Документ про зарахування (Zulassungsbescheid)');
        checklist.push('Блокований рахунок (Sperrkonto) - €11,208');
        checklist.push('Медичне страхування');
        break;
    }
    
    if (healthConditions) {
      checklist.push('Медичні документи та довідки');
    }
    
    if (vaccinationsNeeded) {
      checklist.push('Сертифікат про обов\'язкові щеплення');
    }
    
    if (criminalRecord) {
      checklist.push('Довідка про несудимість');
    }
    
    return checklist;
  }
  
  function generateTimeline(country, urgency, startDate, tightDeadline) {
    let totalWeeks;
    
    switch (urgency) {
      case 'plenty-time': totalWeeks = 24; break;
      case 'moderate': totalWeeks = 16; break;
      case 'tight': totalWeeks = 8; break;
      case 'urgent': totalWeeks = 4; break;
      default: totalWeeks = 16;
    }
    
    const phases = [
      {
        period: `${totalWeeks - 4} - ${totalWeeks} тижнів до початку`,
        focus: 'Початкова підготовка',
        tasks: [
          'Дослідження університетів та програм',
          'Підготовка до мовних тестів',
          'Збір базових документів'
        ]
      },
      {
        period: `${Math.max(totalWeeks - 12, 4)} - ${totalWeeks - 4} тижнів до початку`,
        focus: 'Подача заявок та тести',
        tasks: [
          'Подача заявок до університетів',
          'Складання мовних тестів',
          'Підготовка фінансових документів'
        ]
      },
      {
        period: '4 - 8 тижнів до початку',
        focus: 'Візова заявка',
        tasks: [
          'Отримання документів від університету',
          'Подача візової заявки',
          'Підготовка до співбесіди'
        ]
      },
      {
        period: '1 - 4 тижні до початку',
        focus: 'Остаточна підготовка',
        tasks: [
          'Отримання візи',
          'Бронювання квитків',
          'Підготовка до поїздки'
        ]
      }
    ];
    
    return { totalWeeks, phases };
  }
  
  function generatePriorities(checklist, urgency, preparationStatus) {
    let priorities = [];
    
    if (preparationStatus === 'just-started') {
      priorities.push('Оберіть університети та програми навчання');
      priorities.push('Зареєструйтеся на мовний тест (IELTS/TOEFL)');
      priorities.push('Перевірте термін дії паспорта');
    } else if (preparationStatus === 'researching') {
      priorities.push('Подайте заявки до обраних університетів');
      priorities.push('Складіть мовний тест');
      priorities.push('Підготуйте фінансові документи');
    } else if (preparationStatus === 'applying') {
      priorities.push('Відстежуйте статус заявок до університетів');
      priorities.push('Підготуйте документи для візової заявки');
    } else if (preparationStatus === 'admitted') {
      priorities.push('Підтвердіть місце в університеті');
      priorities.push('Подайте візову заявку');
    }
    
    if (urgency === 'urgent' || urgency === 'tight') {
      priorities.unshift('⚠️ ТЕРМІНОВО: Подайте візову заявку якнайшвидше');
    }
    
    return priorities;
  }
  
  function categorizeChecklist(checklist) {
    return {
      'Основні документи': checklist.filter(item => 
        item.includes('паспорт') || item.includes('анкета') || item.includes('фотографії')
      ),
      'Академічні документи': checklist.filter(item => 
        item.includes('зарахування') || item.includes('довідки') || item.includes('тест') || item.includes('CoE') || item.includes('I-20')
      ),
      'Фінансові документи': checklist.filter(item => 
        item.includes('банківські') || item.includes('спонсор') || item.includes('рахунок') || item.includes('SEVIS')
      ),
      'Медичні вимоги': checklist.filter(item => 
        item.includes('медичн') || item.includes('щеплення') || item.includes('туберкульоз') || item.includes('страхування')
      ),
      'Інші документи': checklist.filter(item => 
        !item.includes('паспорт') && !item.includes('анкета') && !item.includes('фотографії') &&
        !item.includes('зарахування') && !item.includes('довідки') && !item.includes('тест') &&
        !item.includes('банківські') && !item.includes('спонсор') && !item.includes('рахунок') &&
        !item.includes('медичн') && !item.includes('щеплення') && !item.includes('туберкульоз') &&
        !item.includes('CoE') && !item.includes('I-20') && !item.includes('SEVIS') && !item.includes('страхування')
      )
    };
  }
  
  function getCategoryIcon(category) {
    const icons = {
      'Основні документи': '📋',
      'Академічні документи': '🎓',
      'Фінансові документи': '💰',
      'Медичні вимоги': '🏥',
      'Інші документи': '📄'
    };
    return icons[category] || '📝';
  }
  
  function generateTips(country, visaHistory, urgency, preferProfessionalHelp) {
    let tips = [
      'Завжди подавайте заявку з правдивою та точною інформацією',
      'Зберігайте копії всіх документів',
      'Перевіряйте офіційні сайти для актуальної інформації'
    ];
    
    if (visaHistory === 'rejected') {
      tips.push('При попередніх відмовах детально вивчіть причини та виправте їх');
    }
    
    if (urgency === 'urgent') {
      tips.push('⚠️ При терміновій подачі розгляньте експрес-обробку (якщо доступна)');
    }
    
    if (preferProfessionalHelp) {
      tips.push('Розгляньте консультацію з ліцензованим імміграційним консультантом');
    }
    
    return tips;
  }
});