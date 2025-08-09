document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('superstition-form');
  const result = document.getElementById('superstition-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Отримуємо значення форми
      const dayType = document.getElementById('day-type').value;
      const moonPhase = document.getElementById('moon-phase').value;
      const timeOfDay = document.getElementById('time-of-day').value;
      const luckyNumber = document.getElementById('lucky-number').value;
      const dateSum = document.getElementById('date-sum').value;
      const beliefLevel = document.getElementById('belief-level').value;
      const mood = document.getElementById('mood').value;
      const luckyCharms = document.getElementById('lucky-charms').value;
      
      // Перевіряємо різні фактори забобонів
      const repeatedNumbers = document.getElementById('repeated-numbers').checked;
      const blackCat = document.getElementById('black-cat').checked;
      const ladybug = document.getElementById('ladybug').checked;
      const butterfly = document.getElementById('butterfly').checked;
      const birdWindow = document.getElementById('bird-window').checked;
      const spiderMorning = document.getElementById('spider-morning').checked;
      const robin = document.getElementById('robin').checked;
      const rainbow = document.getElementById('rainbow').checked;
      const shootingStar = document.getElementById('shooting-star').checked;
      const fourLeafClover = document.getElementById('four-leaf-clover').checked;
      const pennyHeads = document.getElementById('penny-heads').checked;
      const brokenMirror = document.getElementById('broken-mirror').checked;
      const walkedUnderLadder = document.getElementById('walked-under-ladder').checked;
      const spilledSalt = document.getElementById('spilled-salt').checked;
      const umbrellaIndoors = document.getElementById('umbrella-indoors').checked;
      const shoesOnBed = document.getElementById('shoes-on-bed').checked;
      const hatOnBed = document.getElementById('hat-on-bed').checked;
      const wishedOnStar = document.getElementById('wished-on-star').checked;
      const knockedOnWood = document.getElementById('knocked-on-wood').checked;
      const crossedFingers = document.getElementById('crossed-fingers').checked;
      const threwSalt = document.getElementById('threw-salt').checked;
      const positiveThinking = document.getElementById('positive-thinking').checked;
      const gratefulMindset = document.getElementById('grateful-mindset').checked;
      const expectingGood = document.getElementById('expecting-good').checked;
      
      // Валідація
      if (!dayType || !timeOfDay || !beliefLevel || !mood || !luckyCharms) {
        result.innerHTML = '<p class="error">Будь ласка, заповніть всі обов\'язкові поля.</p>';
        return;
      }
      
      // Розрахунок базового балу удачі
      let luckScore = 50; // Починаємо з нейтрального
      let positiveFactors = [];
      let negativeFactors = [];
      let recommendations = [];
      let warnings = [];
      
      // Вплив типу дня
      const dayTypeScores = {
        'friday-13th': -25,
        'friday': -5,
        'monday': -10,
        'weekend': +10,
        'holiday': +15,
        'regular': 0,
        'birthday': +20
      };
      
      const dayScore = dayTypeScores[dayType] || 0;
      luckScore += dayScore;
      
      if (dayType === 'friday-13th') {
        negativeFactors.push('😱 П\'ятниця 13-го - традиційно нещасливий день');
        warnings.push('Будьте особливо обережні сьогодні - багато забобонів попереджають про п\'ятницю 13-го');
      } else if (dayType === 'birthday') {
        positiveFactors.push('🎂 Ваш особливий день - удача дня народження сильна!');
      }
      
      // Вплив фаз місяця
      const moonPhaseScores = {
        'new': +5,
        'waxing': +10,
        'full': +15,
        'waning': -5
      };
      
      if (moonPhase) {
        const moonScore = moonPhaseScores[moonPhase] || 0;
        luckScore += moonScore;
        
        if (moonPhase === 'full') {
          positiveFactors.push('🌕 Енергія повного місяця - підвищена інтуїція та сила');
        } else if (moonPhase === 'waxing') {
          positiveFactors.push('🌒 Зростаючий місяць - зростаюча енергія та втілення');
        }
      }
      
      // Вплив часу доби
      const timeScores = {
        'early-morning': +10,
        'morning': +5,
        'afternoon': 0,
        'evening': +5,
        'night': -5,
        'late-night': -10
      };
      
      luckScore += timeScores[timeOfDay] || 0;
      
      if (timeOfDay === 'early-morning') {
        positiveFactors.push('🌅 Ранковий час - енергія свіжого початку');
      }
      
      // Вплив чисел
      if (luckyNumber) {
        const number = parseInt(luckyNumber);
        if ([7, 8, 9, 11, 21].includes(number)) {
          luckScore += 15;
          positiveFactors.push(`🔢 Ваше щасливе число ${number} вважається універсально удачливим`);
        } else if ([13, 4, 666].includes(number)) {
          luckScore -= 10;
          negativeFactors.push(`🔢 Число ${number} вважається нещасливим в деяких культурах`);
        } else {
          luckScore += 5;
          positiveFactors.push(`🔢 Особисте щасливе число ${number} додає позитивної енергії`);
        }
      }
      
      // Вплив суми дати
      const dateSumScores = {
        '7': +20,
        '8': +15,
        '9': +15,
        '11': +18,
        '13': -15,
        '21': +12,
        'other-lucky': +10,
        'other': 0
      };
      
      if (dateSum) {
        const dateScore = dateSumScores[dateSum] || 0;
        luckScore += dateScore;
        
        if (dateSum === '7') {
          positiveFactors.push('🎰 Дата дає 7 - найщасливіше число!');
        } else if (dateSum === '13') {
          negativeFactors.push('1️⃣3️⃣ Дата дає 13 - нещасливе в західних забобонах');
        }
      }
      
      // Бонус за повторювані числа
      if (repeatedNumbers) {
        luckScore += 12;
        positiveFactors.push('🔢 Бачите повторювані числа - ангели/всесвіт надсилає повідомлення');
      }
      
      // Щасливі зустрічі з тваринами
      if (ladybug) {
        luckScore += 20;
        positiveFactors.push('🐞 Зустріч з сонечком - бажання збуваються!');
      }
      
      if (butterfly) {
        luckScore += 15;
        positiveFactors.push('🦋 Побачили метелика - трансформація та оновлення');
      }
      
      if (spiderMorning) {
        luckScore += 12;
        positiveFactors.push('🕷️ Ранковий павук - "павук вранці - удача вдачі" приносить удачу');
      }
      
      if (robin) {
        luckScore += 10;
        positiveFactors.push('🐦 Побачили малинівку - весняне оновлення та нові початки');
      }
      
      // Нещасливі зустрічі з тваринами
      if (blackCat) {
        luckScore -= 15;
        negativeFactors.push('🐈‍⬛ Чорний кіт перебіг дорогу - традиційна прикмета поганої удачі');
        recommendations.push('Протидійте удачі чорного кота, сказавши "привіт, котику" або йдучи назад');
      }
      
      if (birdWindow) {
        luckScore -= 12;
        negativeFactors.push('🐦 Птах вдарився у вікно - вважається попередженням або поганою прикметою');
      }
      
      // Щасливі природні явища
      if (rainbow) {
        luckScore += 25;
        positiveFactors.push('🌈 Побачили веселку - обіцянка удачі попереду!');
      }
      
      if (shootingStar) {
        luckScore += 30;
        positiveFactors.push('⭐ Зірка, що падає - надзвичайно удачливо, особливо якщо загадали бажання');
      }
      
      if (fourLeafClover) {
        luckScore += 35;
        positiveFactors.push('🍀 Чотирилисник - одна з найщасливіших знахідок!');
      }
      
      if (pennyHeads) {
        luckScore += 8;
        positiveFactors.push('🪙 Знайшли монету орлом вгору - "знайшов монету, підняв її, цілий день удача буде"');
      }
      
      // Нещасливі дії
      if (brokenMirror) {
        luckScore -= 30;
        negativeFactors.push('🪞 Розбите дзеркало - 7 років поганої удачі за забобонами');
        recommendations.push('Закопайте шматки дзеркала під місячним світлом, щоб зняти прокляття');
      }
      
      if (walkedUnderLadder) {
        luckScore -= 15;
        negativeFactors.push('🪜 Пройшли під драбиною - ламає захисний трикутник');
        recommendations.push('Пройдіть назад під драбиною, щоб скасувати погану удачу');
      }
      
      if (spilledSalt) {
        if (threwSalt) {
          luckScore += 5;
          positiveFactors.push('🧂 Просипали сіль, але кинули через плече - кризу відвернули!');
        } else {
          luckScore -= 12;
          negativeFactors.push('🧂 Просипали сіль, не кинувши через плече - запрошує погану удачу');
          recommendations.push('Киньте сіль через ліве плече, щоб відігнати злих духів');
        }
      }
      
      if (umbrellaIndoors) {
        luckScore -= 10;
        negativeFactors.push('☂️ Відкрили парасольку в приміщенні - приносить дощ та погану удачу');
      }
      
      if (shoesOnBed) {
        luckScore -= 8;
        negativeFactors.push('👠 Взуття на ліжку - запрошує смерть або нещастя');
      }
      
      if (hatOnBed) {
        luckScore -= 6;
        negativeFactors.push('👒 Капелюх на ліжку - ще один забобон поганої удачі, пов\'язаний з ліжком');
      }
      
      // Позитивні захисні дії
      if (wishedOnStar) {
        luckScore += 10;
        positiveFactors.push('⭐ Загадали бажання на зірку - зв\'язок з космічною удачею');
      }
      
      if (knockedOnWood) {
        luckScore += 8;
        positiveFactors.push('🪵 Постукали по дереву - древній захист від сглазу');
      }
      
      if (crossedFingers) {
        luckScore += 6;
        positiveFactors.push('🤞 Схрестили пальці - призивають християнський захисний символ');
      }
      
      // Множник рівня віри
      const beliefMultipliers = {
        'strong': 1.3,
        'moderate': 1.2,
        'casual': 1.0,
        'skeptical': 0.8,
        'none': 0.6
      };
      
      luckScore *= beliefMultipliers[beliefLevel] || 1.0;
      
      // Вплив настрою
      const moodScores = {
        'excellent': +20,
        'good': +10,
        'neutral': 0,
        'low': -10,
        'bad': -20
      };
      
      luckScore += moodScores[mood] || 0;
      
      if (mood === 'excellent' || mood === 'good') {
        positiveFactors.push('😊 Позитивний настрій приваблює позитивну енергію та можливості');
      } else if (mood === 'bad' || mood === 'low') {
        negativeFactors.push('😔 Негативний настрій може створити самовиконуване пророцтво');
        recommendations.push('Спробуйте підняти настрій - позитивне ставлення створює позитивну удачу');
      }
      
      // Вплив щасливих амулетів
      const charmScores = {
        'multiple': +15,
        'one-special': +10,
        'occasional': +5,
        'none': 0
      };
      
      luckScore += charmScores[luckyCharms] || 0;
      
      if (luckyCharms === 'multiple') {
        positiveFactors.push('🧿 Кілька щасливих амулетів - максимальний захист та позитивна енергія');
      }
      
      // Бонуси позитивного мислення
      if (positiveThinking) {
        luckScore += 15;
        positiveFactors.push('🧠 Позитивне мислення - створює щасливі можливості');
      }
      
      if (gratefulMindset) {
        luckScore += 12;
        positiveFactors.push('🙏 Вдячне ставлення - приваблює більше хороших речей');
      }
      
      if (expectingGood) {
        luckScore += 10;
        positiveFactors.push('✨ Очікування хорошого - оптимістичний погляд створює удачу');
      }
      
      // Обмежуємо бал удачі між 0 та 100
      luckScore = Math.max(0, Math.min(100, Math.round(luckScore)));
      
      // Визначаємо рівень удачі та рекомендації
      let luckLevel = '';
      let cardClass = '';
      let mainMessage = '';
      let luckyColor = '';
      let luckyAction = '';
      
      if (luckScore >= 85) {
        luckLevel = 'Надзвичайно щасливий';
        cardClass = 'success';
        mainMessage = 'Зірки вирівнялися! Це виняткового удачливий час для вас.';
        luckyColor = 'Золотий або яскраво-жовтий';
        luckyAction = 'Беріться за важливі виклики, приймайте великі рішення або починайте нові справи';
      } else if (luckScore >= 70) {
        luckLevel = 'Дуже щасливий';
        cardClass = 'success';
        mainMessage = 'У вас дуже удачливий період з сильною позитивною енергією.';
        luckyColor = 'Зелений або срібний';
        luckyAction = 'Ідеальний час для важливих зустрічей, співбесід або прохання про послуги';
      } else if (luckScore >= 55) {
        luckLevel = 'Помірно щасливий';
        cardClass = 'info';
        mainMessage = 'У вас збалансована удача з більшістю позитивних ознак.';
        luckyColor = 'Синій або фіолетовий';
        luckyAction = 'Хороший час для повсякденних справ та помірних ризиків';
      } else if (luckScore >= 40) {
        luckLevel = 'Нейтральний';
        cardClass = 'warning';
        mainMessage = 'Ваша удача змішана. Будьте обережні, але не занадто хвилюйтеся.';
        luckyColor = 'Білий або світло-сірий';
        luckyAction = 'Зосередьтеся на рутинних справах та уникайте великих ризиків';
      } else if (luckScore >= 25) {
        luckLevel = 'Складний період';
        cardClass = 'warning';
        mainMessage = 'Зараз не найкращий час для удачі. Будьте особливо обережні.';
        luckyColor = 'Помаранчевий або коричневий';
        luckyAction = 'Уникайте важливих рішень, зосередьтеся на захисті та обережності';
      } else {
        luckLevel = 'Потребує уваги';
        cardClass = 'danger';
        mainMessage = 'Багато факторів вказують на виклики. Час для захисних дій.';
        luckyColor = 'Червоний або чорний для захисту';
        luckyAction = 'Сьогодні уникайте ризиків, зосередьтеся на захисті та очищенні';
      }
      
      // Створення HTML результату
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🍀 Ваш бал удачі</h6>
            <div class="big-number">${luckScore}</div>
            <p class="insight-detail">${luckLevel}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>🔮 Аналіз вашої удачі</h4>
          <p><strong>${mainMessage}</strong></p>
        </div>`;
      
      // Додаємо позитивні фактори
      if (positiveFactors.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>✨ Позитивні фактори удачі</h4>
            <ul>`;
        positiveFactors.forEach(factor => {
          resultHTML += `<li>${factor}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Додаємо негативні фактори
      if (negativeFactors.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Виклики та застереження</h4>
            <ul>`;
        negativeFactors.forEach(factor => {
          resultHTML += `<li>${factor}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Додаємо рекомендації
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Рекомендації для покращення удачі</h4>
            <ul>`;
        recommendations.forEach(rec => {
          resultHTML += `<li>${rec}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Додаємо персональні поради
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🎯 Персональні поради на сьогодні</h4>
          <div style="display: grid; gap: 1rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>💎 Щасливий колір:</span>
              <span><strong>${luckyColor}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>🎭 Рекомендована дія:</span>
              <span><strong>${luckyAction}</strong></span>
            </div>
          </div>
        </div>`;
      
      // Додаємо загальні поради
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📚 Загальні поради щодо удачі</h4>
          <ul>
            <li><strong>Створюйте свою удачу:</strong> Позитивне ставлення та підготовка важливіші за забобони</li>
            <li><strong>Залишайтеся відкритими:</strong> Помічайте можливості та діючи на них</li>
            <li><strong>Практикуйте вдячність:</strong> Вдячне серце приваблює більше хорошого</li>
            <li><strong>Довіряйте інтуїції:</strong> Ваш внутрішній голос часто знає найкраще</li>
            <li><strong>Дійте з впевненістю:</strong> Впевненість створює удачливі результати</li>
          </ul>
        </div>`;
      
      // Додаємо відмову від відповідальності
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
          <h4>⚠️ Важлива примітка</h4>
          <p>Цей калькулятор призначений виключно для розваги та культурного дослідження! Забобони є цікавою частиною людської традиції, але ваша справжня "удача" створюється вашими діями, підготовкою, тяжкою працею та позитивним ставленням. Використовуйте цю інформацію для веселощів, але приймайте важливі рішення на основі логіки та фактів.</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
});