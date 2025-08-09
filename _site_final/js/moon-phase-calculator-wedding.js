document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('moon-phase-form');
  const result = document.getElementById('moon-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Отримуємо значення форми
      const weddingDate = document.getElementById('wedding-date').value;
      const preferredSeason = document.getElementById('preferred-season').value;
      const specificMonth = document.getElementById('specific-month').value;
      const weddingYear = parseInt(document.getElementById('wedding-year').value);
      const preferredPhase = document.getElementById('preferred-phase').value;
      const ceremonyTiming = document.getElementById('ceremony-timing').value;
      const venueType = document.getElementById('venue-type').value;
      const location = document.getElementById('location').value;
      const weddingStyle = document.getElementById('wedding-style').value;
      const guestCount = document.getElementById('guest-count').value;
      const importanceLevel = document.getElementById('importance-level').value;
      
      // Перевіряємо додаткові фактори
      const photographyImportant = document.getElementById('photography-important').checked;
      const tidalConsiderations = document.getElementById('tidal-considerations').checked;
      const culturalTraditions = document.getElementById('cultural-traditions').checked;
      const astrologicalSignificance = document.getElementById('astrological-significance').checked;
      
      // Валідація
      if (!weddingYear || !preferredPhase || !ceremonyTiming || !venueType || !location || !weddingStyle || !guestCount || !importanceLevel) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть всі обов\'язкові поля.</p>';
        return;
      }
      
      // Генеруємо рекомендації фаз місяця
      let recommendations = [];
      let tips = [];
      let warnings = [];
      let score = 50;
      
      // Якщо надана конкретна дата, розраховуємо її фазу місяця
      if (weddingDate) {
        const datePhase = calculateMoonPhase(new Date(weddingDate));
        const phaseMatch = checkPhaseMatch(datePhase.phase, preferredPhase);
        
        recommendations.push({
          date: weddingDate,
          phase: datePhase.phase,
          phaseName: datePhase.name,
          emoji: datePhase.emoji,
          match: phaseMatch,
          description: datePhase.description,
          score: phaseMatch.score
        });
        
        score = phaseMatch.score;
      } else {
        // Генеруємо рекомендації на основі року та переваг
        const yearRecommendations = generateYearRecommendations(weddingYear, preferredPhase, preferredSeason, specificMonth);
        recommendations = yearRecommendations.slice(0, 8); // Показуємо топ-8 рекомендацій
        score = calculateOverallScore(preferredPhase, ceremonyTiming, venueType);
      }
      
      // Генеруємо поради на основі вибраних факторів
      tips = generateTips(preferredPhase, ceremonyTiming, venueType, photographyImportant, tidalConsiderations);
      warnings = generateWarnings(preferredPhase, venueType, tidalConsiderations);
      
      // Визначаємо загальний рівень відповідності
      let compatibilityLevel = '';
      let cardClass = '';
      let mainMessage = '';
      
      if (score >= 85) {
        compatibilityLevel = 'Ідеальна відповідність';
        cardClass = 'success';
        mainMessage = 'Ваші переваги ідеально узгоджуються з місячними циклами!';
      } else if (score >= 70) {
        compatibilityLevel = 'Дуже добра відповідність';
        cardClass = 'success';
        mainMessage = 'Відмінний вибір для вашого стилю весілля.';
      } else if (score >= 55) {
        compatibilityLevel = 'Хороша відповідність';
        cardClass = 'info';
        mainMessage = 'Добрий баланс між вашими потребами та місячними циклами.';
      } else if (score >= 40) {
        compatibilityLevel = 'Потребує планування';
        cardClass = 'warning';
        mainMessage = 'З правильним плануванням може бути дуже успішним.';
      } else {
        compatibilityLevel = 'Виклики';
        cardClass = 'warning';
        mainMessage = 'Розгляньте альтернативні дати або скоригуйте плани.';
      }
      
      // Створення HTML результату
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🌙 Місячна сумісність</h6>
            <div class="big-number">${score}</div>
            <p class="insight-detail">${compatibilityLevel}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>🔮 Аналіз вашого весільного планування</h4>
          <p><strong>${mainMessage}</strong></p>
        </div>`;
      
      // Додаємо рекомендації дат
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>📅 Рекомендовані дати</h4>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">`;
        
        recommendations.forEach(rec => {
          const formattedDate = new Date(rec.date).toLocaleDateString('uk-UA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          resultHTML += `
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid ${rec.match?.color || 'var(--accent)'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong>${formattedDate}</strong>
                <span style="font-size: 1.5rem;">${rec.emoji}</span>
              </div>
              <div style="font-weight: bold; color: var(--accent);">${rec.phaseName}</div>
              <div style="font-size: 0.9rem; margin-top: 0.5rem;">${rec.description}</div>
              ${rec.match ? `<div style="margin-top: 0.5rem; font-size: 0.9rem; font-style: italic;">${rec.match.reason}</div>` : ''}
            </div>`;
        });
        
        resultHTML += `</div></div>`;
      }
      
      // Додаємо поради
      if (tips.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Поради для планування</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Додаємо застереження
      if (warnings.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Важливі міркування</h4>
            <ul>`;
        warnings.forEach(warning => {
          resultHTML += `<li>${warning}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Додаємо загальні поради
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🌟 Загальні поради щодо місячного планування весілля</h4>
          <ul>
            <li><strong>Бронюйте заздалегідь:</strong> Популярні дати повного місяця швидко заповнюються</li>
            <li><strong>Розгляньте альтернативи:</strong> Інші фази можуть бути не менш красивими</li>
            <li><strong>Плануйте освітлення:</strong> Підготуйте додаткове освітлення для темніших фаз</li>
            <li><strong>Перевірте погоду:</strong> Місячні фази можуть впливати на погодні умови</li>
            <li><strong>Враховуйте гостей:</strong> Деякі гості можуть бути чутливими до місячних циклів</li>
          </ul>
        </div>`;
      
      // Додаємо відмову від відповідальності
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
          <h4>⚠️ Важлива примітка</h4>
          <p>Цей калькулятор надає загальні рекомендації на основі астрономічних розрахунків та традиційних вірувань. Точні фази місяця можуть варіюватися за часовими поясами та географічним положенням. Завжди перевіряйте місцеві астрономічні дані та консультуйтеся з вашим весільним планувальником для остаточного планування.</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  // Функція розрахунку фази місяця
  function calculateMoonPhase(date) {
    // Спрощений розрахунок фази місяця
    const knownNewMoon = new Date('2024-01-11'); // Відомий новий місяць
    const lunarCycle = 29.53058867; // Місячний цикл в днях
    
    const daysSinceKnownNewMoon = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
    const cyclePosition = ((daysSinceKnownNewMoon % lunarCycle) + lunarCycle) % lunarCycle;
    const phase = cyclePosition / lunarCycle;
    
    let phaseName, emoji, description;
    
    if (phase < 0.03 || phase > 0.97) {
      phaseName = 'Новий місяць';
      emoji = '🌑';
      description = 'Ідеальний час для нових початків та інтимних церемоній. Символізує свіжий старт та глибокі наміри.';
    } else if (phase < 0.22) {
      phaseName = 'Зростаючий серп';
      emoji = '🌒';
      description = 'Час зростання та будівництва енергії. Ідеальний для пар, які починають спільне життя.';
    } else if (phase < 0.28) {
      phaseName = 'Перша чверть';
      emoji = '🌓';
      description = 'Час прийняття рішень та активних дій. Добре для пар, які долають виклики разом.';
    } else if (phase < 0.47) {
      phaseName = 'Зростаючий місяць';
      emoji = '🌔';
      description = 'Час вдосконалення та очікування. Символізує зростаючу любов та спільні мрії.';
    } else if (phase < 0.53) {
      phaseName = 'Повний місяць';
      emoji = '🌕';
      description = 'Пік романтики та емоцій. Найпопулярніший вибір для весіль завдяки драматичному освітленню.';
    } else if (phase < 0.72) {
      phaseName = 'Спадаючий місяць';
      emoji = '🌖';
      description = 'Час вдячності та ділення мудрістю. Ідеальний для зрілих пар та других шлюбів.';
    } else if (phase < 0.78) {
      phaseName = 'Третя чверть';
      emoji = '🌗';
      description = 'Час звільнення та прощення. Символізує відпускання минулого та рух вперед.';
    } else {
      phaseName = 'Спадаючий серп';
      emoji = '🌘';
      description = 'Час роздумів та духовного зв\'язку. Ідеальний для тихих, медитативних церемоній.';
    }
    
    return {
      phase: phase,
      name: phaseName,
      emoji: emoji,
      description: description
    };
  }
  
  // Функція перевірки відповідності фази
  function checkPhaseMatch(actualPhase, preferredPhase) {
    let score = 50;
    let reason = '';
    let color = '#666';
    
    if (preferredPhase === 'any') {
      score = 75;
      reason = 'Підходить для будь-якої фази місяця';
      color = '#28a745';
    } else if (preferredPhase === 'full' && actualPhase >= 0.47 && actualPhase <= 0.53) {
      score = 95;
      reason = 'Ідеально підходить для романтичного повного місяця';
      color = '#28a745';
    } else if (preferredPhase === 'new' && (actualPhase < 0.03 || actualPhase > 0.97)) {
      score = 95;
      reason = 'Ідеально підходить для інтимного нового місяця';
      color = '#28a745';
    } else if (preferredPhase === 'waxing' && actualPhase > 0.03 && actualPhase < 0.47) {
      score = 90;
      reason = 'Чудово підходить для зростаючої фази';
      color = '#28a745';
    } else if (preferredPhase === 'waning' && actualPhase > 0.53 && actualPhase < 0.97) {
      score = 90;
      reason = 'Чудово підходить для спадаючої фази';
      color = '#28a745';
    } else {
      score = 35;
      reason = 'Не відповідає вашій бажаній фазі, але все ще може бути красивим';
      color = '#ffc107';
    }
    
    return { score, reason, color };
  }
  
  // Функція генерації рекомендацій на рік
  function generateYearRecommendations(year, preferredPhase, season, month) {
    const recommendations = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Генеруємо дати для кожного місяця
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      if (season && season !== 'specific') {
        const seasonMonths = {
          'spring': [2, 3, 4],
          'summer': [5, 6, 7],
          'fall': [8, 9, 10],
          'winter': [11, 0, 1]
        };
        if (!seasonMonths[season].includes(monthIndex)) continue;
      }
      
      if (month && parseInt(month) !== monthIndex + 1) continue;
      
      // Знаходимо цікаві дати в місяці
      for (let day = 1; day <= 28; day += 7) { // Перевіряємо кожен тиждень
        const testDate = new Date(year, monthIndex, day);
        const moonPhase = calculateMoonPhase(testDate);
        const match = checkPhaseMatch(moonPhase.phase, preferredPhase);
        
        if (match.score >= 75) {
          recommendations.push({
            date: testDate.toISOString().split('T')[0],
            phase: moonPhase.phase,
            phaseName: moonPhase.name,
            emoji: moonPhase.emoji,
            description: moonPhase.description,
            match: match
          });
        }
      }
    }
    
    // Сортуємо за балом
    return recommendations.sort((a, b) => b.match.score - a.match.score);
  }
  
  // Функція розрахунку загального балу
  function calculateOverallScore(preferredPhase, ceremonyTiming, venueType) {
    let score = 50;
    
    // Бонуси за типи фаз
    if (preferredPhase === 'full') score += 20;
    if (preferredPhase === 'new') score += 15;
    if (preferredPhase === 'any') score += 25;
    
    // Бонуси за час церемонії
    if (ceremonyTiming === 'evening' && preferredPhase === 'full') score += 15;
    if (ceremonyTiming === 'night' && preferredPhase === 'full') score += 20;
    if (ceremonyTiming === 'morning' && preferredPhase === 'new') score += 10;
    
    // Бонуси за тип venue
    if (venueType === 'outdoor' && preferredPhase === 'full') score += 15;
    if (venueType === 'beach' && preferredPhase === 'full') score += 20;
    if (venueType === 'indoor') score += 10; // Менше залежність від місяця
    
    return Math.min(Math.max(score, 20), 100);
  }
  
  // Функція генерації порад
  function generateTips(preferredPhase, ceremonyTiming, venueType, photography, tidal) {
    const tips = [];
    
    if (preferredPhase === 'full') {
      tips.push('🌕 Повний місяць забезпечує природне освітлення - ідеально для фотографії');
      tips.push('📅 Бронюйте venue заздалегідь - дати повного місяця дуже популярні');
    }
    
    if (preferredPhase === 'new') {
      tips.push('🌑 Новий місяць створює інтимну атмосферу - підготуйте додаткове освітлення');
      tips.push('🕯️ Розгляньте використання свічок для романтичної атмосфери');
    }
    
    if (ceremonyTiming === 'evening' || ceremonyTiming === 'night') {
      tips.push('🌅 Вечірні церемонії найкраще підходять для демонстрації місяця');
    }
    
    if (venueType === 'beach' || tidal) {
      tips.push('🌊 Перевірте розклад припливів - вони пов\'язані з фазами місяця');
      tips.push('📍 Висоті припливи відбуваються через 2-3 дні після повного/нового місяця');
    }
    
    if (photography) {
      tips.push('📸 Обговоріть з фотографом планування на основі фази місяця');
      tips.push('💡 Підготуйте резервне освітлення для темніших фаз');
    }
    
    return tips;
  }
  
  // Функція генерації застережень
  function generateWarnings(preferredPhase, venueType, tidal) {
    const warnings = [];
    
    if (preferredPhase === 'full' && (venueType === 'outdoor' || venueType === 'beach')) {
      warnings.push('⛅ Повний місяць може впливати на погодні умови - майте план Б');
    }
    
    if (tidal || venueType === 'beach') {
      warnings.push('🌊 Високі припливи можуть вплинути на пляжні церемонії - перевірте розклади');
    }
    
    if (preferredPhase === 'new') {
      warnings.push('🔦 Новий місяць буде майже не видимий - плануйте освітлення');
    }
    
    return warnings;
  }
});