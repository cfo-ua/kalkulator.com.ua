document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('visa-form');
  const result = document.getElementById('visa-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const destination = document.getElementById('destination').value;
      const purpose = document.getElementById('purpose').value;
      const duration = parseInt(document.getElementById('duration').value);
      const income = document.getElementById('income').value;
      const funds = document.getElementById('funds').value;
      const employment = document.getElementById('employment').value;
      const education = document.getElementById('education').value;
      const travelHistory = document.getElementById('travel-history').value;
      const visaHistory = document.getElementById('visa-history').value;
      
      // Check home country ties
      const hasProperty = document.getElementById('property').checked;
      const hasFamily = document.getElementById('family').checked;
      const hasJob = document.getElementById('job').checked;
      const hasBusiness = document.getElementById('business').checked;
      
      // Validation
      if (!destination || !purpose || !income || !funds || !employment || !education || !travelHistory || !visaHistory) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть усі обов\'язкові поля.</p>';
        return;
      }
      
      // Calculate eligibility score
      let score = 0;
      let maxScore = 100;
      let feedback = [];
      let tips = [];
      let warnings = [];
      
      // Income scoring (25 points)
      const incomeScores = {
        'under1000': 5,
        '1000-2500': 10,
        '2500-5000': 15,
        '5000-10000': 20,
        'over10000': 25
      };
      score += incomeScores[income] || 0;
      if (incomeScores[income] < 15) {
        warnings.push("💰 Низький дохід може вплинути на шанси схвалення візи");
        tips.push("Розгляньте можливість показу додаткової фінансової підтримки або заощаджень");
      }
      
      // Funds scoring (20 points)
      const fundsScores = {
        'under1000': 5,
        '1000-5000': 10,
        '5000-15000': 15,
        '15000-50000': 18,
        'over50000': 20
      };
      score += fundsScores[funds] || 0;
      if (fundsScores[funds] < 10) {
        warnings.push("💸 Недостатні кошти для поїздки");
        tips.push("Накопичуйте більше коштів або покажіть спонсорську підтримку");
      }
      
      // Employment scoring (15 points)
      const employmentScores = {
        'employed': 15,
        'self-employed': 12,
        'student': 8,
        'retired': 10,
        'unemployed': 2
      };
      score += employmentScores[employment] || 0;
      if (employment === 'unemployed') {
        warnings.push("🏢 Безробіття значно знижує шанси на візу");
        tips.push("Знайдіть роботу або покажіть інші джерела доходу перед подачею заявки");
      }
      
      // Duration penalty for long stays
      if (duration > 90) {
        score -= 5;
        warnings.push("📅 Довгострокове перебування може вимагати спеціальних віз");
      } else if (duration > 30) {
        score -= 2;
      }
      
      // Purpose multipliers
      const purposeMultipliers = {
        'tourism': 1.0,
        'business': 1.05,
        'work': 0.9,
        'study': 0.95,
        'family': 1.02,
        'medical': 0.9
      };
      
      // Education scoring (5 points)
      const educationScores = {
        'high-school': 2,
        'diploma': 3,
        'bachelors': 4,
        'masters': 5,
        'phd': 5
      };
      score += educationScores[education] || 0;
      
      // Travel history scoring (15 points)
      const travelScores = {
        'none': 2,
        'limited': 8,
        'moderate': 12,
        'extensive': 15
      };
      score += travelScores[travelHistory] || 0;
      if (travelHistory === 'none') {
        warnings.push("✈️ Відсутність історії подорожей може розглядатися як високий ризик");
        tips.push("Розгляньте можливість подорожей до безвізових країн для створення історії подорожей");
      }
      
      // Visa history scoring (10 points)
      const visaScores = {
        'none': 5,
        'approved': 10,
        'mixed': 6,
        'rejected': 1
      };
      score += visaScores[visaHistory] || 0;
      if (visaHistory === 'rejected') {
        warnings.push("❌ Попередні відмови у візах значно впливають на нові заявки");
        tips.push("Вирішіть причини попередніх відмов перед повторною подачею");
      }
      
      // Home country ties bonus (up to 8 points)
      let tiesCount = 0;
      if (hasProperty) tiesCount++;
      if (hasFamily) tiesCount++;
      if (hasJob) tiesCount++;
      if (hasBusiness) tiesCount++;
      
      score += tiesCount * 2;
      if (tiesCount < 2) {
        warnings.push("🏠 Слабкі зв'язки з рідною країною можуть вказувати на ризик перебування");
        tips.push("Документуйте вагомі причини для повернення додому (робота, сім'я, нерухомість)");
      }
      
      // Country difficulty multipliers
      const countryMultipliers = {
        'us': 0.9,
        'uk': 0.95,
        'canada': 1.0,
        'australia': 1.0,
        'schengen': 1.05
      };
      
      score = Math.round(score * (countryMultipliers[destination] || 1.0) * (purposeMultipliers[purpose] || 1.0));
      score = Math.min(score, 100); // Cap at 100
      
      // Generate country-specific requirements
      const countryInfo = getCountryInfo(destination, purpose);
      
      // Generate result
      let eligibilityLevel = '';
      let cardClass = '';
      let recommendation = '';
      
      if (score >= 80) {
        eligibilityLevel = 'Відмінний';
        cardClass = 'success';
        recommendation = 'Ваш профіль виглядає сильним! Підготуйте документацію ретельно та подавайте заявку з упевненістю.';
      } else if (score >= 65) {
        eligibilityLevel = 'Хороший';
        cardClass = 'info';
        recommendation = 'У вас хороші шанси на схвалення. Вирішіть будь-які слабкі місця для зміцнення заявки.';
      } else if (score >= 50) {
        eligibilityLevel = 'Справедливий';
        cardClass = 'warning';
        recommendation = 'Ваша заявка може потребувати покращень. Зосередьтеся на зміцненні слабких місць перед подачею.';
      } else {
        eligibilityLevel = 'Низький';
        cardClass = 'warning';
        recommendation = 'Розгляньте можливість значного покращення вашого профілю перед подачею для збільшення шансів на успіх.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🎯 Бал права на візу</h6>
            <div class="big-number">${score}%</div>
            <p class="insight-detail">${eligibilityLevel} право на візу</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌍 Напрямок</h6>
            <div class="big-number">${countryInfo.flag}</div>
            <p class="insight-detail">${countryInfo.name}</p>
          </div>
          
          <div class="insight-card info">
            <h6>📋 Тип візи</h6>
            <div class="big-number">${getPurposeEmoji(purpose)}</div>
            <p class="insight-detail">${getPurposeText(purpose)}</p>
          </div>
        </div>

        <div class="insight-card">
          <h6>💡 Рекомендація</h6>
          <p>${recommendation}</p>
        </div>
      `;
      
      // Add warnings if any
      if (warnings.length > 0) {
        resultHTML += `
          <div class="insight-card warning">
            <h6>⚠️ Потенційні проблеми</h6>
            <ul>
              ${warnings.map(warning => `<li>${warning}</li>`).join('')}
            </ul>
          </div>
        `;
      }
      
      // Add tips if any
      if (tips.length > 0) {
        resultHTML += `
          <div class="insight-card info">
            <h6>💡 Поради для покращення</h6>
            <ul>
              ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
        `;
      }
      
      // Add country requirements
      resultHTML += `
        <div class="insight-card">
          <h6>📋 Вимоги для ${countryInfo.name}</h6>
          <div class="country-details">
            <p><strong>⏱️ Час обробки:</strong> ${countryInfo.processingTime}</p>
            <p><strong>💰 Консульський збір:</strong> ${countryInfo.fee}</p>
            <p><strong>📅 Коли подавати:</strong> ${countryInfo.timing}</p>
            <div>
              <strong>📄 Необхідні документи:</strong>
              <ul>
                ${countryInfo.requirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getCountryInfo(destination, purpose) {
    const countryData = {
      'us': {
        name: 'Сполучені Штати',
        flag: '🇺🇸',
        processingTime: '2 тижні - 6 місяців',
        fee: '$160-$190 USD',
        timing: '2-6 місяців до подорожі',
        requirements: [
          'Дійсний паспорт',
          'Заповнена анкета DS-160',
          'Фотографія (5x5 см)',
          'Довідка з банку (3-6 місяців)',
          'Довідка з роботи',
          'Бронювання готелю',
          'Авіаквитки',
          'Медична страховка'
        ]
      },
      'canada': {
        name: 'Канада',
        flag: '🇨🇦',
        processingTime: '2-12 тижнів',
        fee: '$100-$230 CAD',
        timing: '1-4 місяці до подорожі',
        requirements: [
          'Дійсний паспорт',
          'Онлайн заявка',
          'Біометричні дані',
          'Банківські виписки',
          'Довідка з роботи',
          'Медичне обстеження (при необхідності)',
          'Мовний сертифікат (для роботи/навчання)',
          'Освітні документи'
        ]
      },
      'uk': {
        name: 'Великобританія',
        flag: '🇬🇧',
        processingTime: '3-6 тижнів',
        fee: '£95-£822 GBP',
        timing: '1-3 місяці до подорожі',
        requirements: [
          'Дійсний паспорт',
          'Онлайн заявка',
          'Біометричний прийом',
          'Банківські виписки (6 місяців)',
          'Довідки з роботи або зарплатні відомості',
          'Маршрут подорожі',
          'Деталі проживання',
          'Тест на туберкульоз (деякі країни)'
        ]
      },
      'australia': {
        name: 'Австралія',
        flag: '🇦🇺',
        processingTime: '2-4 тижні',
        fee: '$145-$365 AUD',
        timing: '1-3 місяці до подорожі',
        requirements: [
          'Дійсний паспорт',
          'Онлайн заявка (ImmiAccount)',
          'Фотографія на паспорт',
          'Банківські виписки',
          'Медична страховка',
          'Документи про характер (при необхідності)',
          'Підтвердження знання англійської (деякі візи)',
          'Оцінка навичок (робочі візи)'
        ]
      },
      'schengen': {
        name: 'Зона Шенгену',
        flag: '🇪🇺',
        processingTime: '2-3 тижні',
        fee: '€80 EUR',
        timing: '1-3 місяці до подорожі',
        requirements: [
          'Дійсний паспорт (3 місяці дійсності)',
          'Візова анкета',
          'Фотографії на паспорт',
          'Туристична страховка (€30,000 покриття)',
          'Бронювання авіаквитків',
          'Бронювання готелю',
          'Банківські виписки (3 місяці)',
          'Довідка з роботи'
        ]
      }
    };
    
    return countryData[destination] || countryData['us'];
  }
  
  function getPurposeEmoji(purpose) {
    const emojis = {
      'tourism': '🏖️',
      'business': '💼',
      'work': '🏢',
      'study': '📚',
      'family': '👨‍👩‍👧‍👦',
      'medical': '🏥'
    };
    return emojis[purpose] || '📋';
  }
  
  function getPurposeText(purpose) {
    const texts = {
      'tourism': 'Туризм/Відпочинок',
      'business': 'Бізнес',
      'work': 'Робота',
      'study': 'Навчання',
      'family': 'Сімейне відвідування',
      'medical': 'Медичне лікування'
    };
    return texts[purpose] || 'Не вказано';
  }
});