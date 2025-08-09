document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('dream-form');
  const result = document.getElementById('dream-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Отримуємо значення форми
      const dreamType = document.getElementById('dream-type').value;
      const dreamFrequency = document.getElementById('dream-frequency').value;
      const dreamTiming = document.getElementById('dream-timing').value;
      const dreamEmotion = document.getElementById('dream-emotion').value;
      const emotionalIntensity = parseInt(document.getElementById('emotional-intensity').value);
      const dreamVividness = document.getElementById('dream-vividness').value;
      const stressLevel = document.getElementById('stress-level').value;
      const lifeEvents = document.getElementById('life-events').value;
      const lifeRelevance = document.getElementById('life-relevance').value;
      
      // Перевіряємо характеристики сну
      const isLucidDream = document.getElementById('lucid-dream').checked;
      const wokeUpSuddenly = document.getElementById('woke-up-suddenly').checked;
      const rememberedImmediately = document.getElementById('remembered-immediately').checked;
      
      // Перевіряємо людей у сні
      const familyMembers = document.getElementById('family-members').checked;
      const strangers = document.getElementById('strangers').checked;
      const deceasedPeople = document.getElementById('deceased-people').checked;
      const children = document.getElementById('children').checked;
      const celebrities = document.getElementById('celebrities').checked;
      const exPartners = document.getElementById('ex-partners').checked;
      
      // Перевіряємо оточення
      const darkEnvironment = document.getElementById('dark-environment').checked;
      const brightEnvironment = document.getElementById('bright-environment').checked;
      const indoorSetting = document.getElementById('indoor-setting').checked;
      const outdoorSetting = document.getElementById('outdoor-setting').checked;
      const familiarPlaces = document.getElementById('familiar-places').checked;
      const unknownPlaces = document.getElementById('unknown-places').checked;
      
      // Перевіряємо активності
      const violenceConflict = document.getElementById('violence-conflict').checked;
      const romanceIntimacy = document.getElementById('romance-intimacy').checked;
      const communication = document.getElementById('communication').checked;
      const physicalActivity = document.getElementById('physical-activity').checked;
      const transformation = document.getElementById('transformation').checked;
      const lossSearching = document.getElementById('loss-searching').checked;
      
      // Перевіряємо життєвий контекст
      const processingTrauma = document.getElementById('processing-trauma').checked;
      const majorDecision = document.getElementById('major-decision').checked;
      const personalGrowth = document.getElementById('personal-growth').checked;
      
      // Валідація
      if (!dreamType || !dreamFrequency || !dreamTiming || !dreamEmotion || !emotionalIntensity || !dreamVividness || !stressLevel || !lifeEvents || !lifeRelevance) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть всі обов\'язкові поля.</p>';
        return;
      }
      
      // Розрахунок балів
      let psychologicalSignificance = 0;
      let symbolicRichness = 0;
      let emotionalIntensityScore = 0;
      let lifeRelevanceScore = 0;
      let urgencyLevel = 0;
      
      // Розрахунок психологічної значущості (0-100)
      const dreamTypeScores = {
        'house': 85, 'water': 80, 'flying': 75, 'chase': 90, 'falling': 85,
        'people': 70, 'animals': 75, 'death': 95, 'test': 70, 'vehicle': 65,
        'work': 60, 'nature': 55, 'nightmare': 90, 'romantic': 70, 'other': 60
      };
      psychologicalSignificance += dreamTypeScores[dreamType] || 60;
      
      // Бонус/штраф за частоту
      const frequencyMultipliers = {
        'first-time': 1.0,
        'occasional': 0.9,
        'regular': 1.1,
        'frequent': 1.2,
        'recurring': 1.4
      };
      psychologicalSignificance *= frequencyMultipliers[dreamFrequency] || 1.0;
      
      // Корекція для усвідомленого сну
      if (isLucidDream) {
        psychologicalSignificance *= 1.2;
      }
      
      // Обмеження до 100
      psychologicalSignificance = Math.min(psychologicalSignificance, 100);
      
      // Розрахунок символічного багатства (0-100)
      let symbolCount = 0;
      
      // Символи людей
      if (familyMembers) symbolCount += 15;
      if (strangers) symbolCount += 10;
      if (deceasedPeople) symbolCount += 25;
      if (children) symbolCount += 20;
      if (celebrities) symbolCount += 15;
      if (exPartners) symbolCount += 20;
      
      // Символи оточення
      if (darkEnvironment) symbolCount += 15;
      if (brightEnvironment) symbolCount += 10;
      if (unknownPlaces) symbolCount += 15;
      if (familiarPlaces) symbolCount += 10;
      
      // Символи активності
      if (violenceConflict) symbolCount += 20;
      if (romanceIntimacy) symbolCount += 15;
      if (transformation) symbolCount += 25;
      if (lossSearching) symbolCount += 20;
      if (communication) symbolCount += 10;
      if (physicalActivity) symbolCount += 10;
      
      symbolicRichness = Math.min(symbolCount, 100);
      
      // Бонус за яскравість
      const vividnessMultipliers = {
        'vague': 0.7,
        'moderate': 1.0,
        'vivid': 1.2,
        'extremely-vivid': 1.4
      };
      symbolicRichness *= vividnessMultipliers[dreamVividness] || 1.0;
      symbolicRichness = Math.min(symbolicRichness, 100);
      
      // Розрахунок балу емоційної інтенсивності (0-100)
      emotionalIntensityScore = emotionalIntensity * 10;
      
      // Множники типу емоцій
      const emotionMultipliers = {
        'positive': 0.8,
        'neutral': 0.6,
        'anxious': 1.1,
        'fearful': 1.3,
        'sad': 1.2,
        'angry': 1.2,
        'confused': 1.1,
        'mixed': 1.3
      };
      emotionalIntensityScore *= emotionMultipliers[dreamEmotion] || 1.0;
      
      if (wokeUpSuddenly) {
        emotionalIntensityScore *= 1.2;
      }
      
      emotionalIntensityScore = Math.min(emotionalIntensityScore, 100);
      
      // Розрахунок балу життєвої релевантності (0-100)
      const relevanceScores = {
        'very-relevant': 100,
        'somewhat-relevant': 70,
        'unclear': 40,
        'not-relevant': 20
      };
      lifeRelevanceScore = relevanceScores[lifeRelevance] || 50;
      
      // Вплив рівня стресу
      const stressMultipliers = {
        'low': 0.8,
        'moderate': 1.0,
        'high': 1.2,
        'extreme': 1.4
      };
      lifeRelevanceScore *= stressMultipliers[stressLevel] || 1.0;
      
      // Вплив життєвих подій
      const eventMultipliers = {
        'none': 0.9,
        'relationship': 1.2,
        'work': 1.1,
        'family': 1.3,
        'health': 1.3,
        'financial': 1.2,
        'moving': 1.1,
        'education': 1.1,
        'multiple': 1.4
      };
      lifeRelevanceScore *= eventMultipliers[lifeEvents] || 1.0;
      
      lifeRelevanceScore = Math.min(lifeRelevanceScore, 100);
      
      // Розрахунок рівня терміновості (0-100)
      urgencyLevel = (psychologicalSignificance + emotionalIntensityScore + lifeRelevanceScore) / 3;
      
      // Особливі фактори терміновості
      if (dreamFrequency === 'recurring') urgencyLevel *= 1.3;
      if (deceasedPeople) urgencyLevel *= 1.2;
      if (violenceConflict && emotionalIntensity >= 7) urgencyLevel *= 1.2;
      if (processingTrauma) urgencyLevel *= 1.3;
      if (majorDecision) urgencyLevel *= 1.2;
      
      urgencyLevel = Math.min(urgencyLevel, 100);
      
      // Округлення всіх балів
      psychologicalSignificance = Math.round(psychologicalSignificance);
      symbolicRichness = Math.round(symbolicRichness);
      emotionalIntensityScore = Math.round(emotionalIntensityScore);
      lifeRelevanceScore = Math.round(lifeRelevanceScore);
      urgencyLevel = Math.round(urgencyLevel);
      
      // Розрахунок загального балу
      const overallScore = Math.round(
        (psychologicalSignificance * 0.25) +
        (symbolicRichness * 0.2) +
        (emotionalIntensityScore * 0.2) +
        (lifeRelevanceScore * 0.25) +
        (urgencyLevel * 0.1)
      );
      
      // Генерація тлумачень
      const dreamTypeInfo = getDreamTypeInterpretation(dreamType);
      const emotionAnalysis = getEmotionAnalysis(dreamEmotion, emotionalIntensity);
      const symbolAnalysis = getSymbolAnalysis(familyMembers, strangers, deceasedPeople, children, celebrities, exPartners, transformation, lossSearching, violenceConflict);
      const recommendations = getRecommendations(overallScore, dreamFrequency, stressLevel, processingTrauma, majorDecision);
      
      // Визначення загального рівня тлумачення
      let interpretationLevel = '';
      let cardClass = '';
      let mainMessage = '';
      
      if (overallScore >= 80) {
        interpretationLevel = 'Високо значущий';
        cardClass = 'warning';
        mainMessage = 'Цей сон має важливе психологічне значення і заслуговує уважного аналізу.';
      } else if (overallScore >= 65) {
        interpretationLevel = 'Помірно значущий';
        cardClass = 'info';
        mainMessage = 'Цей сон містить змістовні елементи, які можуть дати інсайти у ваш поточний стан.';
      } else if (overallScore >= 45) {
        interpretationLevel = 'Певна значущість';
        cardClass = 'info';
        mainMessage = 'Цей сон має деякі помітні елементи, але може бути більш рутинною обробкою.';
      } else {
        interpretationLevel = 'Низька значущість';
        cardClass = 'success';
        mainMessage = 'Це здається рутинним сном, можливо, просто підтримкою мозку під час сну.';
      }
      
      // Створення HTML результату
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🔮 Загальний бал</h6>
            <div class="big-number">${overallScore}</div>
            <p class="insight-detail">${interpretationLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🧠 Психологічна</h6>
            <div class="big-number">${psychologicalSignificance}</div>
            <p class="insight-detail">значущість</p>
          </div>
          
          <div class="insight-card info">
            <h6>🔮 Символічне</h6>
            <div class="big-number">${symbolicRichness}</div>
            <p class="insight-detail">багатство</p>
          </div>
          
          <div class="insight-card info">
            <h6>💭 Емоційна</h6>
            <div class="big-number">${emotionalIntensityScore}</div>
            <p class="insight-detail">інтенсивність</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>🔍 Резюме аналізу сну</h4>
          <p><strong>${mainMessage}</strong></p>
        </div>`;
      
      // Додаємо тлумачення типу сну
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>${dreamTypeInfo.emoji} Тлумачення "${dreamTypeInfo.name}"</h4>
          <p><strong>Загальне значення:</strong> ${dreamTypeInfo.generalMeaning}</p>
          <p><strong>Психологічна значущість:</strong> ${dreamTypeInfo.psychologicalMeaning}</p>
          <p><strong>Можливі повідомлення:</strong> ${dreamTypeInfo.possibleMessages}</p>
        </div>`;
      
      // Додаємо емоційний аналіз
      if (emotionAnalysis) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💭 Емоційний аналіз</h4>
            <p><strong>Основна емоція:</strong> ${emotionAnalysis.description}</p>
            <p><strong>Рівень інтенсивності:</strong> ${emotionAnalysis.intensityDescription}</p>
            <p><strong>Можливе значення:</strong> ${emotionAnalysis.meaning}</p>
          </div>`;
      }
      
      // Додаємо аналіз символів
      if (symbolAnalysis.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🔮 Виявлені ключові символи</h4>
            <ul>`;
        symbolAnalysis.forEach(symbol => {
          resultHTML += `<li><strong>${symbol.symbol}:</strong> ${symbol.meaning}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Додаємо детальну розбивку балів
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📊 Детальна розбивка балів</h4>
          <div style="display: grid; gap: 1rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>🎯 Життєва релевантність</span>
              <span><strong>${lifeRelevanceScore}/100</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>⚡ Рівень терміновості</span>
              <span><strong>${urgencyLevel}/100</strong></span>
            </div>
          </div>
        </div>`;
      
      // Додаємо рекомендації
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Рекомендації та наступні кроки</h4>
            <ul>`;
        recommendations.forEach(rec => {
          resultHTML += `<li>${rec}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Додаємо загальні поради щодо аналізу снів
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📝 Загальні поради щодо аналізу снів</h4>
          <ul>
            <li><strong>Ведіть щоденник снів:</strong> Записуйте сни одразу після пробудження</li>
            <li><strong>Шукайте закономірності:</strong> Помічайте повторювані теми, людей або емоції</li>
            <li><strong>Враховуйте життєвий контекст:</strong> Як поточні події можуть впливати на ваші сни?</li>
            <li><strong>Довіряйте інстинктам:</strong> Ваші особисті асоціації найважливіші</li>
            <li><strong>Не переаналізовуйте:</strong> Іноді сни - це просто випадкова активність мозку</li>
          </ul>
        </div>`;
      
      // Додаємо відмову від відповідальності
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
          <h4>⚠️ Важлива примітка</h4>
          <p>Тлумачення снів є дуже суб'єктивним та особистим. Цей аналіз базується на поширених психологічних теоріях та значеннях символів, але ваші власні асоціації та життєвий контекст є найважливішими. Якщо сни викликають значний дистрес або впливають на ваше повсякденне життя, розгляньте можливість звернення до фахівця з психічного здоров'я.</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getDreamTypeInterpretation(dreamType) {
    const interpretations = {
      'house': {
        name: 'Сни про дім/житло',
        emoji: '🏠',
        generalMeaning: 'Будинки часто представляють власне я, вашу психіку або поточну життєву ситуацію.',
        psychologicalMeaning: 'Різні кімнати можуть представляти різні аспекти вашої особистості або сфери життя.',
        possibleMessages: 'Зміни, потрібні у вашому житті, самодослідження, сімейна динаміка або особисті кордони.'
      },
      'water': {
        name: 'Сни про воду',
        emoji: '🌊',
        generalMeaning: 'Вода зазвичай символізує емоції, несвідоме та духовне очищення.',
        psychologicalMeaning: 'Стан води (спокійна, бурхлива, глибока) відображає ваш емоційний стан.',
        possibleMessages: 'Емоційна обробка, потреба в очищенні, духовне зростання або дослідження підсвідомого.'
      },
      'flying': {
        name: 'Сни про політ',
        emoji: '✈️',
        generalMeaning: 'Політ представляє свободу, трансцендентність та звільнення від обмежень.',
        psychologicalMeaning: 'Часто вказує на бажання незалежності або втечі від поточних обмежень.',
        possibleMessages: 'Потреба у більшій свободі, духовне зростання, подолання перешкод або піднесення над проблемами.'
      },
      'chase': {
        name: 'Сни про переслідування',
        emoji: '🏃',
        generalMeaning: 'Переслідування зазвичай представляє уникнення чогось у вашому житті наяву.',
        psychologicalMeaning: 'Переслідувач часто представляє аспекти вас самих або ситуації, яких ви уникаєте.',
        possibleMessages: 'Зіткнутися з уникнутими проблемами, протистояти страхам або вирішити невирішені конфлікти.'
      },
      'falling': {
        name: 'Сни про падіння',
        emoji: '😱',
        generalMeaning: 'Падіння представляє втрату контролю, невпевненість або страх невдачі.',
        psychologicalMeaning: 'Часто виникає в періоди стресу або великих життєвих переходів.',
        possibleMessages: 'Потреба у більшій стабільності, подолання невпевненості або прийняття відсутності контролю.'
      },
      'people': {
        name: 'Сни про людей',
        emoji: '👤',
        generalMeaning: 'Люди у снах можуть представляти різні аспекти вашої особистості або стосунків.',
        psychologicalMeaning: 'Знайомі та незнайомці можуть символізувати різні частини вашого я.',
        possibleMessages: 'Соціальні зв\'язки, потреба у спілкуванні або внутрішні конфлікти стосунків.'
      },
      'animals': {
        name: 'Сни про тварин',
        emoji: '🐾',
        generalMeaning: 'Тварини символізують інстинкти, первісні бажання та природну поведінку.',
        psychologicalMeaning: 'Можуть представляти придушені інстинкти або природні якості.',
        possibleMessages: 'Зв\'язок з природою, прийняття інстинктів або потреба у більшій спонтанності.'
      },
      'death': {
        name: 'Сни про смерть',
        emoji: '💀',
        generalMeaning: 'Смерть рідко представляє буквальну смерть; зазвичай символізує трансформацію або завершення.',
        psychologicalMeaning: 'Вказує на великі життєві переходи, відпускання старих патернів або особисту трансформацію.',
        possibleMessages: 'Прийняти зміни, відпустити минуле або підготуватися до нових життєвих фаз.'
      },
      'test': {
        name: 'Сни про іспити/тести',
        emoji: '🎓',
        generalMeaning: 'Іспити часто представляють тривогу за результат, самооцінку або страх судження.',
        psychologicalMeaning: 'Можуть відображати відчуття неготовності або страх не відповідати очікуванням.',
        possibleMessages: 'Потреба у кращій підготовці, подолання страхів оцінювання або підвищення впевненості.'
      },
      'vehicle': {
        name: 'Сни про транспорт',
        emoji: '🚗',
        generalMeaning: 'Транспортні засоби представляють життєвий напрямок, контроль та особисту подорож.',
        psychologicalMeaning: 'Стан транспорту та ваша роль (водій/пасажир) показують рівень контролю над життям.',
        possibleMessages: 'Переоцінка життєвого напрямку, потреба у більшому контролі або зміна курсу.'
      },
      'work': {
        name: 'Сни про роботу/кар\'єру',
        emoji: '💼',
        generalMeaning: 'Робочі сни можуть відображати професійні турботи, амбіції або стрес.',
        psychologicalMeaning: 'Часто пов\'язані з самооцінкою, досягненнями та професійною ідентичністю.',
        possibleMessages: 'Кар\'єрні роздуми, баланс роботи та життя або професійні зміни.'
      },
      'nature': {
        name: 'Сни про природу',
        emoji: '🌳',
        generalMeaning: 'Природа символізує зростання, оновлення та зв\'язок з основами життя.',
        psychologicalMeaning: 'Може вказувати на потребу у відновленні або зв\'язку з природними ритмами.',
        possibleMessages: 'Відпочинок, відновлення енергії або повернення до основ життя.'
      },
      'nightmare': {
        name: 'Кошмари',
        emoji: '😨',
        generalMeaning: 'Кошмари обробляють страхи, травми або високий рівень стресу.',
        psychologicalMeaning: 'Допомагають зіткнутися та обробити важкі емоції або досвіди.',
        possibleMessages: 'Подолання основних страхів, пошук підтримки при травмах або управління рівнем стресу.'
      },
      'romantic': {
        name: 'Романтичні сни',
        emoji: '💕',
        generalMeaning: 'Романтичні сни можуть відображати бажання близькості, кохання або емоційного зв\'язку.',
        psychologicalMeaning: 'Можуть вказувати на потреби у стосунках або обробку романтичних переживань.',
        possibleMessages: 'Бажання інтимності, аналіз поточних стосунків або пошук партнера.'
      }
    };
    
    return interpretations[dreamType] || {
      name: 'Змішані сни',
      emoji: '🔮',
      generalMeaning: 'Складні сни з кількома темами часто відображають складні життєві ситуації.',
      psychologicalMeaning: 'Можуть вказувати на одночасну обробку кількох проблем.',
      possibleMessages: 'Приділіть час аналізу різних елементів сну окремо.'
    };
  }
  
  function getEmotionAnalysis(emotion, intensity) {
    const emotions = {
      'positive': {
        description: 'Позитивні емоції (радість, мир, захоплення)',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Сильні позитивні почуття' : 'Слабкі до помірних позитивних почуттів'}`,
        meaning: 'Може відображати задоволення життям, успішну обробку досвідів або оптимістичний погляд.'
      },
      'neutral': {
        description: 'Нейтральні емоції (спокій, байдужість)',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Сильна нейтральність' : 'Помірна нейтральність'}`,
        meaning: 'Може вказувати на стабільний емоційний стан або обробку повсякденних подій без сильних емоцій.'
      },
      'anxious': {
        description: 'Тривожність та хвилювання',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Високий рівень тривожності' : 'Керована тривожність'}`,
        meaning: 'Ймовірно відображає поточні життєві стреси, турботи про майбутнє або невирішені хвилювання.'
      },
      'fearful': {
        description: 'Страх та жах',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Інтенсивна реакція страху' : 'Помірні рівні страху'}`,
        meaning: 'Може вказувати на глибокі страхи, обробку травм або відчуття загрози в якійсь сфері життя.'
      },
      'sad': {
        description: 'Сум та меланхолія',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Глибокий сум' : 'Слабкий до помірного суму'}`,
        meaning: 'Може відображати горе, втрату, розчарування або депресію, що потребує уваги.'
      },
      'angry': {
        description: 'Гнів та фрустрація',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Інтенсивний гнів' : 'Керована фрустрація'}`,
        meaning: 'Може представляти придушений гнів, відчуття несправедливості або фрустрацію поточними обставинами.'
      },
      'confused': {
        description: 'Розгубленість та дезорієнтація',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Високий рівень плутанини' : 'Деяка невпевненість'}`,
        meaning: 'Відображає невпевненість у житті, труднощі в прийнятті рішень або відчуття загубленості в поточних ситуаціях.'
      },
      'mixed': {
        description: 'Змішані емоції',
        intensityDescription: `Інтенсивність ${intensity}/10 - ${intensity >= 7 ? 'Інтенсивні змішані почуття' : 'Помірні змішані емоції'}`,
        meaning: 'Вказує на складну обробку кількох емоційних тем одночасно, можливо, під час життєвих переходів.'
      }
    };
    
    return emotions[emotion];
  }
  
  function getSymbolAnalysis(familyMembers, strangers, deceasedPeople, children, celebrities, exPartners, transformation, lossSearching, violenceConflict) {
    const symbols = [];
    
    if (familyMembers) {
      symbols.push({
        symbol: '👨‍👩‍👧‍👦 Члени сім\'ї',
        meaning: 'Представляють сімейну динаміку, ваше коріння, системи підтримки або невирішені сімейні проблеми'
      });
    }
    
    if (strangers) {
      symbols.push({
        symbol: '👤 Незнайомі люди',
        meaning: 'Часто представляють невідомі аспекти вас самих або нові можливості, що входять у ваше життя'
      });
    }
    
    if (deceasedPeople) {
      symbols.push({
        symbol: '👻 Померлі люди',
        meaning: 'Можуть представляти обробку горя, повідомлення від підсвідомого або якості, які вони втілювали'
      });
    }
    
    if (children) {
      symbols.push({
        symbol: '👶 Діти/Немовлята',
        meaning: 'Символізують нові початки, невинність, творчість або вашу внутрішню дитину, що потребує уваги'
      });
    }
    
    if (celebrities) {
      symbols.push({
        symbol: '⭐ Знаменитості',
        meaning: 'Представляють якості, які ви захоплюєтеся, бажання визнання або аспекти слави/успіху'
      });
    }
    
    if (exPartners) {
      symbols.push({
        symbol: '💔 Колишні партнери',
        meaning: 'Можуть вказувати на невирішені почуття, патерни стосунків або аспекти минулих стосунків, що впливають на теперішнє'
      });
    }
    
    if (transformation) {
      symbols.push({
        symbol: '🦋 Трансформація',
        meaning: 'Потужний символ особистого зростання, великих життєвих змін або духовної еволюції'
      });
    }
    
    if (lossSearching) {
      symbols.push({
        symbol: '🔍 Втрата/Пошук',
        meaning: 'Представляє відчуття загубленості в житті, пошук мети або відсутність чогось важливого'
      });
    }
    
    if (violenceConflict) {
      symbols.push({
        symbol: '⚔️ Насильство/Конфлікт',
        meaning: 'Може представляти внутрішній конфлікт, придушену агресію або зовнішні конфлікти, що потребують вирішення'
      });
    }
    
    return symbols;
  }
  
  function getRecommendations(overallScore, dreamFrequency, stressLevel, processingTrauma, majorDecision) {
    const recommendations = [];
    
    if (overallScore >= 80) {
      recommendations.push('📝 Цей сон заслуговує детального запису в щоденнику та роздумів');
      recommendations.push('🤔 Подумайте, які важливі сфери життя може відображати цей сон');
      recommendations.push('💬 Обговоріть цей сон з довіреною особою або консультантом');
    }
    
    if (dreamFrequency === 'recurring') {
      recommendations.push('🔄 Зверніть особливу увагу на повторювані сни - вони часто вказують на невирішені проблеми');
      recommendations.push('📊 Відстежуйте закономірності у ваших повторюваних снах для глибших інсайтів');
    }
    
    if (stressLevel === 'high' || stressLevel === 'extreme') {
      recommendations.push('😰 Ваш високий рівень стресу може впливати на ваші сни');
      recommendations.push('🧘 Розгляньте техніки управління стресом, такі як медитація або фізичні вправи');
    }
    
    if (processingTrauma) {
      recommendations.push('🏥 Розгляньте професійну підтримку для обробки травми');
      recommendations.push('🛡️ Практикуйте самодбайливість та емоційну безпеку під час обробки важких снів');
    }
    
    if (majorDecision) {
      recommendations.push('⚖️ Ваші сни можуть допомагати опрацьовувати ваше важливе рішення');
      recommendations.push('💭 Зверніть увагу на емоції та наслідки в снах для інсайтів щодо рішення');
    }
    
    // Загальні рекомендації на основі балу
    if (overallScore < 45) {
      recommendations.push('😴 Це здається рутинною обробкою снів - невідкладних дій не потрібно');
    }
    
    recommendations.push('📚 Продовжуйте вивчати тлумачення снів для поглиблення розуміння');
    
    return recommendations;
  }
});