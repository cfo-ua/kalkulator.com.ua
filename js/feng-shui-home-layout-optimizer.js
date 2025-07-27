document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fengshui-form');
  const result = document.getElementById('fengshui-result');

  // Setup range sliders
  setupClutterSlider();
  setupPlantSlider();

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      analyzeFengShui();
    });
  }

  function setupClutterSlider() {
    const slider = document.getElementById('clutter-level');
    const display = document.getElementById('clutter-display');
    if (slider && display) {
      const labels = ['Дуже чисто', 'Чисто', 'Помірно', 'Захаращено', 'Дуже захаращено'];
      slider.addEventListener('input', function() {
        display.textContent = labels[this.value - 1];
      });
    }
  }

  function setupPlantSlider() {
    const slider = document.getElementById('plant-count');
    const display = document.getElementById('plant-display');
    if (slider && display) {
      slider.addEventListener('input', function() {
        const count = this.value;
        const word = count == 1 ? 'рослина' : (count < 5 ? 'рослини' : 'рослин');
        display.textContent = count + ' ' + word;
      });
    }
  }

  function analyzeFengShui() {
    // Get form values
    const homeType = document.getElementById('home-type').value;
    const entranceDirection = document.getElementById('entrance-direction').value;
    const homeShape = document.getElementById('home-shape').value;
    const bedroomCount = parseInt(document.getElementById('bedroom-count').value);
    const squareFootage = parseInt(document.getElementById('square-footage').value) || 80;
    const birthYear = parseInt(document.getElementById('birth-year').value);
    const gender = document.getElementById('gender').value;
    const lifeFocus = document.getElementById('life-focus').value;
    const bedroomSetup = document.getElementById('bedroom-setup').value;
    const stovePosition = document.getElementById('stove-position').value;
    const livingRoomSeating = document.getElementById('living-room-seating').value;
    const clutterLevel = parseInt(document.getElementById('clutter-level').value);
    const naturalLight = document.getElementById('natural-light').value;
    const plantCount = parseInt(document.getElementById('plant-count').value);
    const waterFeatures = document.getElementById('water-features').value;
    const enhancementBudget = document.getElementById('enhancement-budget').value;
    const openToChanges = document.getElementById('open-to-changes').checked;

    // Get selected challenges and issues
    const challenges = getChallenges();
    const structuralIssues = getStructuralIssues();
    const dominantColors = getDominantColors();

    // Validate required fields
    if (!homeType || !entranceDirection || !homeShape || !lifeFocus) {
      result.innerHTML = '<div class="error">Будь ласка, заповніть всі обов\'язкові поля.</div>';
      return;
    }

    // Calculate Kua number if birth year and gender provided
    const kuaNumber = calculateKuaNumber(birthYear, gender);

    // Analyze current space
    const spaceAnalysis = analyzeCurrentSpace(
      homeShape, entranceDirection, bedroomSetup, stovePosition, 
      livingRoomSeating, clutterLevel, structuralIssues
    );

    // Analyze elements and colors
    const elementAnalysis = analyzeElements(dominantColors, plantCount, waterFeatures, naturalLight);

    // Generate recommendations based on life focus and challenges
    const recommendations = generateRecommendations(
      lifeFocus, challenges, spaceAnalysis, elementAnalysis, 
      enhancementBudget, openToChanges, kuaNumber
    );

    // Calculate feng shui score
    const fengShuiScore = calculateFengShuiScore(
      spaceAnalysis, elementAnalysis, clutterLevel, naturalLight, plantCount
    );

    // Display results
    displayResults({
      homeType,
      entranceDirection,
      homeShape,
      lifeFocus,
      kuaNumber,
      spaceAnalysis,
      elementAnalysis,
      recommendations,
      fengShuiScore,
      challenges,
      enhancementBudget,
      squareFootage
    });
  }

  function getChallenges() {
    const challengeIds = [
      'challenge-career', 'challenge-money', 'challenge-health', 
      'challenge-relationships', 'challenge-stress', 'challenge-sleep', 'challenge-energy'
    ];
    return challengeIds.filter(id => document.getElementById(id)?.checked);
  }

  function getStructuralIssues() {
    const issueIds = [
      'issue-beams', 'issue-corners', 'issue-stairs', 'issue-bathroom', 
      'issue-kitchen', 'issue-mirrors', 'issue-electronics'
    ];
    return issueIds.filter(id => document.getElementById(id)?.checked);
  }

  function getDominantColors() {
    const colorIds = [
      'color-red', 'color-orange', 'color-yellow', 'color-green', 
      'color-blue', 'color-purple', 'color-white', 'color-black', 'color-brown'
    ];
    return colorIds.filter(id => document.getElementById(id)?.checked);
  }

  function calculateKuaNumber(birthYear, gender) {
    if (!birthYear || !gender) return null;

    const lastTwoDigits = birthYear % 100;
    let kuaNumber;

    if (birthYear < 2000) {
      if (gender === 'male') {
        kuaNumber = 100 - lastTwoDigits;
      } else {
        kuaNumber = lastTwoDigits + 5;
      }
    } else {
      if (gender === 'male') {
        kuaNumber = 100 - lastTwoDigits;
      } else {
        kuaNumber = lastTwoDigits + 6;
      }
    }

    // Reduce to single digit
    while (kuaNumber >= 10) {
      kuaNumber = Math.floor(kuaNumber / 10) + (kuaNumber % 10);
    }

    // Handle special case where result is 5
    if (kuaNumber === 5) {
      kuaNumber = gender === 'male' ? 2 : 8;
    }

    return kuaNumber;
  }

  function analyzeCurrentSpace(homeShape, entranceDirection, bedroomSetup, stovePosition, livingRoomSeating, clutterLevel, structuralIssues) {
    let positiveAspects = [];
    let challenges = [];
    let score = 50; // Base score

    // Home shape analysis
    if (homeShape === 'square') {
      positiveAspects.push('Квадратна/прямокутна форма забезпечує стабільну енергетичну основу');
      score += 15;
    } else if (['l-shape', 'u-shape'].includes(homeShape)) {
      challenges.push('Неправильна форма створює відсутні зони Багуа, впливаючи на життєвий баланс');
      score -= 10;
    } else if (homeShape === 'triangle') {
      challenges.push('Трикутна форма створює нестабільну енергію вогню');
      score -= 15;
    }

    // Entrance direction
    const entranceQualities = {
      'north': 'енергія кар\'єри та життєвого шляху',
      'northeast': 'енергія знань та мудрості',
      'east': 'енергія сім\'ї та здоров\'я',
      'southeast': 'енергія багатства та достатку',
      'south': 'енергія слави та визнання',
      'southwest': 'енергія кохання та стосунків',
      'west': 'енергія дітей та творчості',
      'northwest': 'енергія помічників та подорожей'
    };
    const directionName = {
      'north': 'Північний',
      'northeast': 'Північно-східний',
      'east': 'Східний',
      'southeast': 'Південно-східний',
      'south': 'Південний',
      'southwest': 'Південно-західний',
      'west': 'Західний',
      'northwest': 'Північно-західний'
    };
    positiveAspects.push(`${directionName[entranceDirection]} вхід приносить ${entranceQualities[entranceDirection]}`);

    // Bedroom setup analysis
    if (bedroomSetup === 'ideal') {
      positiveAspects.push('Спальня має відмінне розташування за фен-шуй');
      score += 10;
    } else if (bedroomSetup === 'facing-door') {
      challenges.push('Ліжко навпроти дверей створює неспокійну енергію та поганий сон');
      score -= 10;
    } else if (bedroomSetup === 'under-beam') {
      challenges.push('Ліжко під балкою створює пригнічуючу енергію, що впливає на здоров\'я');
      score -= 15;
    }

    // Kitchen/stove analysis
    if (stovePosition === 'command') {
      positiveAspects.push('Плита в командній позиції покращує енергію живлення');
      score += 8;
    } else if (stovePosition === 'back-to-door') {
      challenges.push('Позиція плити спиною до дверей створює енергію вразливості');
      score -= 8;
    } else if (stovePosition === 'facing-sink') {
      challenges.push('Плита навпроти раковини створює конфлікт вогню та води');
      score -= 10;
    }

    // Living room seating
    if (livingRoomSeating === 'command') {
      positiveAspects.push('Розташування меблів у вітальні сприяє безпеці та соціальній гармонії');
      score += 8;
    } else if (livingRoomSeating === 'back-to-door') {
      challenges.push('Сидіння спиною до входу створює відчуття небезпеки');
      score -= 8;
    }

    // Clutter impact
    if (clutterLevel <= 2) {
      positiveAspects.push('Чистий, організований простір дозволяє позитивний потік енергії');
      score += 10;
    } else if (clutterLevel >= 4) {
      challenges.push('Безлад блокує потік енергії та створює застій');
      score -= 15;
    }

    // Structural issues
    structuralIssues.forEach(issue => {
      switch (issue) {
        case 'issue-beams':
          challenges.push('Відкриті балки створюють пригнічуючу енергію вниз');
          score -= 8;
          break;
        case 'issue-stairs':
          challenges.push('Сходи навпроти входу змушують енергію вилітати назовні');
          score -= 10;
          break;
        case 'issue-bathroom':
          challenges.push('Центральна ванна кімната висушує серцеву енергію дому');
          score -= 12;
          break;
        case 'issue-mirrors':
          challenges.push('Дзеркала, що відображають ліжка або двері, порушують потік енергії');
          score -= 6;
          break;
        case 'issue-electronics':
          challenges.push('Електроніка у спальні порушує енергію відпочинку та стосунків');
          score -= 8;
          break;
      }
    });

    return {
      score: Math.max(0, Math.min(100, score)),
      positiveAspects,
      challenges,
      recommendations: []
    };
  }

  function analyzeElements(dominantColors, plantCount, waterFeatures, naturalLight) {
    const elementCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    let score = 50;

    // Color element mapping
    const colorElements = {
      'color-green': 'wood',
      'color-brown': 'wood',
      'color-red': 'fire',
      'color-orange': 'fire',
      'color-purple': 'fire',
      'color-yellow': 'earth',
      'color-white': 'metal',
      'color-black': 'water',
      'color-blue': 'water'
    };

    // Count elements from colors
    dominantColors.forEach(color => {
      const element = colorElements[color];
      if (element) elementCounts[element]++;
    });

    // Add plants (wood element)
    if (plantCount > 0) {
      elementCounts.wood += Math.min(3, Math.floor(plantCount / 2));
    }

    // Add water features
    if (waterFeatures !== 'none') {
      elementCounts.water += waterFeatures === 'multiple' ? 3 : 1;
    }

    // Natural light (fire element)
    if (naturalLight === 'excellent') {
      elementCounts.fire += 2;
      score += 10;
    } else if (naturalLight === 'poor') {
      score -= 10;
    }

    // Calculate balance score
    const totalElements = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
    if (totalElements > 0) {
      const variance = Object.values(elementCounts).reduce((sum, count) => {
        const avg = totalElements / 5;
        return sum + Math.pow(count - avg, 2);
      }, 0) / 5;
      
      // Lower variance = better balance
      score += Math.max(0, 20 - variance * 2);
    }

    return {
      elementCounts,
      score: Math.max(0, Math.min(100, score)),
      totalElements,
      balance: totalElements > 0 ? 'balanced' : 'needs-elements',
      recommendations: generateElementRecommendations(elementCounts)
    };
  }

  function generateElementRecommendations(elementCounts) {
    const recommendations = [];
    const elements = Object.entries(elementCounts);
    
    // Find deficient elements
    const maxCount = Math.max(...Object.values(elementCounts));
    const minCount = Math.min(...Object.values(elementCounts));
    
    if (maxCount - minCount > 2) {
      elements.forEach(([element, count]) => {
        if (count === minCount) {
          recommendations.push(getElementEnhancement(element));
        }
      });
    }

    return recommendations;
  }

  function getElementEnhancement(element) {
    const enhancements = {
      wood: 'Додайте рослини, дерев\'яні меблі або зелені кольори для посилення енергії зростання',
      fire: 'Включіть червоні акценти, свічки або гарне освітлення для підвищення пристрасті та енергії',
      earth: 'Додайте земляні тони, кристали або керамічні предмети для стабільності та заземлення',
      metal: 'Включіть білі/сірі кольори, металеві об\'єкти або круглі форми для ясності та зосередженості',
      water: 'Додайте сині кольори, дзеркала або невеликий фонтан для потоку та мудрості'
    };
    return enhancements[element];
  }

  function generateRecommendations(lifeFocus, challenges, spaceAnalysis, elementAnalysis, budget, openToChanges, kuaNumber) {
    let recommendations = [];

    // Life focus recommendations
    const focusRecommendations = {
      career: {
        area: 'Північ (Кар\'єра)',
        enhancements: ['Додайте елемент води (сині/чорні кольори, фонтан)', 'Тримайте цю зону без безладу', 'Додайте металеві об\'єкти для підтримки'],
        priority: 'high'
      },
      relationships: {
        area: 'Південний Захід (Кохання та Шлюб)',
        enhancements: ['Додайте парні об\'єкти', 'Використовуйте земляні тони та рожеві кольори', 'Приберіть зображення самотніх людей'],
        priority: 'high'
      },
      wealth: {
        area: 'Південний Схід (Багатство)',
        enhancements: ['Додайте фіолетові або золоті акценти', 'Включіть здорові рослини', 'Тримайте зону добре освітленою та організованою'],
        priority: 'high'
      },
      health: {
        area: 'Центр (Здоров\'я) та Схід (Сім\'я)',
        enhancements: ['Додайте жовті/земляні кольори в центрі', 'Розмістіть здорові рослини на сході', 'Забезпечте хорошу циркуляцію повітря'],
        priority: 'high'
      },
      family: {
        area: 'Схід (Сім\'я)',
        enhancements: ['Додайте зелені кольори та рослини', 'Розмістіть сімейні фото', 'Використовуйте дерев\'яні елементи'],
        priority: 'high'
      },
      creativity: {
        area: 'Захід (Діти та Творчість)',
        enhancements: ['Додайте білі та металеві акценти', 'Включіть творчі роботи', 'Використовуйте круглі форми'],
        priority: 'high'
      },
      knowledge: {
        area: 'Північний Схід (Знання)',
        enhancements: ['Створіть зону для навчання', 'Додайте земляні тони', 'Включіть книги та освітні матеріали'],
        priority: 'high'
      },
      spirituality: {
        area: 'Центр (Здоров\'я) та загальна гармонія',
        enhancements: ['Створіть медитативний простір', 'Додайте кристали та свічки', 'Забезпечте спокійну атмосферу'],
        priority: 'high'
      }
    };

    const focusRec = focusRecommendations[lifeFocus];
    if (focusRec) {
      recommendations.push({
        category: 'Покращення життєвого фокусу',
        priority: 'high',
        title: `Покращіть ${focusRec.area}`,
        description: focusRec.enhancements.join('. '),
        cost: 'Низько-Середньо',
        impact: 'Високий'
      });
    }

    // Challenge-specific recommendations
    const challengeRecommendations = {
      'challenge-career': {
        title: 'Покращення кар\'єри',
        description: 'Зосередьтеся на північній зоні вашого дому. Додайте водні елементи та тримайте зону чистою.',
        cost: 'Низько',
        impact: 'Середній'
      },
      'challenge-money': {
        title: 'Покращення фінансів',
        description: 'Активізуйте південно-східну зону багатства рослинами та фіолетовими акцентами.',
        cost: 'Низько',
        impact: 'Середній'
      },
      'challenge-health': {
        title: 'Покращення здоров\'я',
        description: 'Очистіть центральну зону дому та додайте жовті кольори для стабільності.',
        cost: 'Низько',
        impact: 'Високий'
      },
      'challenge-relationships': {
        title: 'Покращення стосунків',
        description: 'Зосередьтеся на південно-західній зоні з парними об\'єктами та рожевими тонами.',
        cost: 'Низько',
        impact: 'Високий'
      },
      'challenge-stress': {
        title: 'Зменшення стресу',
        description: 'Прибрати безлад, додати рослини та створити спокійні зони для релаксації.',
        cost: 'Низько',
        impact: 'Високий'
      },
      'challenge-sleep': {
        title: 'Покращення сну',
        description: 'Оптимізувати спальню: прибрати електроніку, використовувати заспокійливі кольори.',
        cost: 'Низько',
        impact: 'Високий'
      },
      'challenge-energy': {
        title: 'Підвищення енергії',
        description: 'Покращити освітлення, додати рослини та активізувати вогняні елементи.',
        cost: 'Низько-Середньо',
        impact: 'Середній'
      }
    };

    challenges.forEach(challenge => {
      const rec = challengeRecommendations[challenge];
      if (rec) {
        recommendations.push({
          category: 'Вирішення викликів',
          priority: 'medium',
          ...rec
        });
      }
    });

    // Space-specific recommendations
    spaceAnalysis.challenges.forEach(challenge => {
      if (challenge.includes('безлад')) {
        recommendations.push({
          category: 'Організація простору',
          priority: 'high',
          title: 'Прибирання безладу',
          description: 'Систематично організуйте кожну кімнату, прибираючи непотрібні речі.',
          cost: 'Безкоштовно',
          impact: 'Високий'
        });
      }
    });

    // Element balance recommendations
    if (elementAnalysis.recommendations.length > 0) {
      elementAnalysis.recommendations.forEach(rec => {
        recommendations.push({
          category: 'Баланс елементів',
          priority: 'medium',
          title: 'Елементне покращення',
          description: rec,
          cost: 'Низько',
          impact: 'Середній'
        });
      });
    }

    // Budget-specific filtering
    if (budget === 'minimal') {
      recommendations = recommendations.filter(rec => rec.cost === 'Безкоштовно' || rec.cost === 'Низько');
    } else if (budget === 'low') {
      recommendations = recommendations.filter(rec => !rec.cost.includes('Високий'));
    }

    return recommendations.slice(0, 8); // Limit to top 8 recommendations
  }

  function calculateFengShuiScore(spaceAnalysis, elementAnalysis, clutterLevel, naturalLight, plantCount) {
    let score = 0;
    
    // Weight different factors
    score += spaceAnalysis.score * 0.4; // 40% for space layout
    score += elementAnalysis.score * 0.3; // 30% for element balance
    
    // Additional factors
    score += (5 - clutterLevel) * 4; // 20 points max for cleanliness
    
    if (naturalLight === 'excellent') score += 5;
    if (plantCount >= 3) score += 5;
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  function displayResults(data) {
    const getScoreColor = (score) => {
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#FF9800';
      if (score >= 40) return '#FF5722';
      return '#F44336';
    };

    const getScoreText = (score) => {
      if (score >= 80) return 'Відмінно';
      if (score >= 60) return 'Добре';
      if (score >= 40) return 'Задовільно';
      return 'Потребує покращення';
    };

    const getBudgetText = (budget) => {
      const budgetTexts = {
        'minimal': 'Мінімальний (0-1500 грн)',
        'low': 'Низький (1500-6000 грн)',
        'moderate': 'Помірний (6000-15000 грн)',
        'high': 'Високий (15000-45000 грн)',
        'unlimited': 'Без обмежень'
      };
      return budgetTexts[budget] || budget;
    };

    const homeTypeText = {
      'apartment': 'Квартира',
      'house': 'Приватний будинок',
      'townhouse': 'Таунхаус',
      'studio': 'Студія/Лофт',
      'mobile': 'Мобільний будинок'
    };

    const directionText = {
      'north': 'Північ',
      'northeast': 'Північний Схід',
      'east': 'Схід',
      'southeast': 'Południний Схід',
      'south': 'Південь',
      'southwest': 'Південний Захід',
      'west': 'Захід',
      'northwest': 'Північний Захід'
    };

    const lifeFocusText = {
      'career': 'Кар\'єра та професійне зростання',
      'relationships': 'Кохання та стосунки',
      'health': 'Здоров\'я та благополуччя',
      'wealth': 'Багатство та процвітання',
      'family': 'Сім\'я та домашня гармонія',
      'creativity': 'Творчість та самовираження',
      'knowledge': 'Навчання та особистісне зростання',
      'spirituality': 'Духовність та внутрішній спокій'
    };

    let html = `
      <div class="insight-card">
        <h2>🏠 Аналіз фен-шуй вашого дому</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
          <div><strong>Тип житла:</strong> ${homeTypeText[data.homeType]}</div>
          <div><strong>Напрямок входу:</strong> ${directionText[data.entranceDirection]}</div>
          <div><strong>Площа:</strong> ${data.squareFootage} кв.м</div>
          <div><strong>Життєвий фокус:</strong> ${lifeFocusText[data.lifeFocus]}</div>
        </div>

        ${data.kuaNumber ? `<div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <strong>🧭 Ваше число Куа: ${data.kuaNumber}</strong><br>
          <small>Це число визначає ваші найкращі особисті напрямки для сну, роботи та відпочинку.</small>
        </div>` : ''}
      </div>

      <div class="insight-card">
        <h3>📊 Загальний бал фен-шуй</h3>
        <div style="text-align: center; margin: 1rem 0;">
          <div style="font-size: 3rem; font-weight: bold; color: ${getScoreColor(data.fengShuiScore)};">
            ${data.fengShuiScore}/100
          </div>
          <div style="font-size: 1.2rem; color: ${getScoreColor(data.fengShuiScore)};">
            ${getScoreText(data.fengShuiScore)}
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px;">
          <strong>Компоненти балу:</strong><br>
          🏠 Планування простору: ${data.spaceAnalysis.score}/100<br>
          🌟 Баланс елементів: ${data.elementAnalysis.score}/100<br>
          🧹 Чистота та організація: ${(5-document.getElementById('clutter-level').value+1)*20}/100
        </div>
      </div>`;

    // Positive aspects
    if (data.spaceAnalysis.positiveAspects.length > 0) {
      html += `
        <div class="insight-card">
          <h3>✅ Сильні сторони вашого простору</h3>
          <ul>
            ${data.spaceAnalysis.positiveAspects.map(aspect => `<li>${aspect}</li>`).join('')}
          </ul>
        </div>`;
    }

    // Challenges
    if (data.spaceAnalysis.challenges.length > 0) {
      html += `
        <div class="insight-card">
          <h3>⚠️ Виклики для покращення</h3>
          <ul style="color: #d32f2f;">
            ${data.spaceAnalysis.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
          </ul>
        </div>`;
    }

    // Element analysis
    const elementNames = {
      wood: 'Дерево 🌳',
      fire: 'Вогонь 🔥', 
      earth: 'Земля 🌍',
      metal: 'Метал ⚪',
      water: 'Вода 💧'
    };

    html += `
      <div class="insight-card">
        <h3>🌟 Аналіз п'яти елементів</h3>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin: 1rem 0;">
          ${Object.entries(data.elementAnalysis.elementCounts).map(([element, count]) => `
            <div style="text-align: center; padding: 0.5rem; background: #f0f0f0; border-radius: 8px;">
              <div style="font-weight: bold;">${elementNames[element]}</div>
              <div style="font-size: 1.5rem; color: #2196F3;">${count}</div>
            </div>
          `).join('')}
        </div>
        
        ${data.elementAnalysis.recommendations.length > 0 ? `
          <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <strong>💡 Рекомендації для балансу елементів:</strong>
            <ul>
              ${data.elementAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>`;

    // Recommendations
    if (data.recommendations.length > 0) {
      html += `
        <div class="insight-card">
          <h3>🎯 Персональні рекомендації</h3>
          <div style="margin-bottom: 1rem;">
            <strong>Ваш бюджет:</strong> ${getBudgetText(data.enhancementBudget)}
          </div>
          
          ${data.recommendations.map((rec, index) => `
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin: 0.5rem 0; background: ${rec.priority === 'high' ? '#e8f5e8' : '#f9f9f9'};">
              <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #1976D2;">${rec.title}</h4>
                ${rec.priority === 'high' ? '<span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">Пріоритет</span>' : ''}
              </div>
              <p style="margin: 0.5rem 0;">${rec.description}</p>
              <div style="display: flex; gap: 1rem; font-size: 0.9rem; color: #666;">
                <span><strong>Категорія:</strong> ${rec.category}</span>
                <span><strong>Вартість:</strong> ${rec.cost}</span>
                <span><strong>Вплив:</strong> ${rec.impact}</span>
              </div>
            </div>
          `).join('')}
        </div>`;
    }

    // Final tips
    html += `
      <div class="insight-card">
        <h3>🌟 Загальні поради фен-шуй</h3>
        <div style="display: grid; gap: 1rem;">
          <div style="padding: 1rem; background: #e1f5fe; border-radius: 8px;">
            <strong>🧹 Перший крок:</strong> Починайте з прибирання безладу - це найважливіший і безкоштовний спосіб покращити енергію.
          </div>
          <div style="padding: 1rem; background: #f3e5f5; border-radius: 8px;">
            <strong>🌱 Додайте життя:</strong> Рослини приносять живу енергію та покращують якість повітря.
          </div>
          <div style="padding: 1rem; background: #fff8e1; border-radius: 8px;">
            <strong>💡 Світло важливе:</strong> Хороше освітлення активізує позитивну енергію в усіх зонах.
          </div>
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px;">
            <strong>⏰ Терпіння:</strong> Зміни в фен-шуй можуть проявитися через 3-6 місяців регулярної практики.
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h3>📚 Додаткова інформація</h3>
        <p><strong>Зверніть увагу:</strong> Фен-шуй - це традиційна практика з культурним та духовним значенням. Використовуйте ці рекомендації як керівництво для створення більш гармонійного простору, але також довіряйте своїй інтуїції та особистим потребам.</p>
        <p>Для кращих результатів поєднуйте принципи фен-шуй з практичними аспектами дизайну інтер'єру та власними естетичними уподобаннями.</p>
      </div>`;

    result.innerHTML = html;
  }
});