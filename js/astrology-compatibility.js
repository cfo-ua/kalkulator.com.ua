document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById("calculate-compatibility");
  const result = document.getElementById("compatibility-result");

  // Zodiac sign data with detailed compatibility information
  const zodiacSigns = [
    { name: "Козеріг", element: "земля", modality: "кардинальний", ruler: "Сатурн", dates: "22 грудня - 19 січня" },
    { name: "Водолій", element: "повітря", modality: "фіксований", ruler: "Уран", dates: "20 січня - 18 лютого" },
    { name: "Риби", element: "вода", modality: "мінливий", ruler: "Нептун", dates: "19 лютого - 20 березня" },
    { name: "Овен", element: "вогонь", modality: "кардинальний", ruler: "Марс", dates: "21 березня - 19 квітня" },
    { name: "Телець", element: "земля", modality: "фіксований", ruler: "Венера", dates: "20 квітня - 20 травня" },
    { name: "Близнюки", element: "повітря", modality: "мінливий", ruler: "Меркурій", dates: "21 травня - 20 червня" },
    { name: "Рак", element: "вода", modality: "кардинальний", ruler: "Місяць", dates: "21 червня - 22 липня" },
    { name: "Лев", element: "вогонь", modality: "фіксований", ruler: "Сонце", dates: "23 липня - 22 серпня" },
    { name: "Діва", element: "земля", modality: "мінливий", ruler: "Меркурій", dates: "23 серпня - 22 вересня" },
    { name: "Терези", element: "повітря", modality: "кардинальний", ruler: "Венера", dates: "23 вересня - 22 жовтня" },
    { name: "Скорпіон", element: "вода", modality: "фіксований", ruler: "Плутон", dates: "23 жовтня - 21 листопада" },
    { name: "Стрілець", element: "вогонь", modality: "мінливий", ruler: "Юпітер", dates: "22 листопада - 21 грудня" }
  ];

  // Compatibility matrix based on traditional astrology
  const compatibilityMatrix = {
    "Овен": { "Овен": 75, "Телець": 45, "Близнюки": 85, "Рак": 50, "Лев": 95, "Діва": 40, "Терези": 80, "Скорпіон": 60, "Стрілець": 90, "Козеріг": 35, "Водолій": 85, "Риби": 55 },
    "Телець": { "Овен": 45, "Телець": 70, "Близнюки": 40, "Рак": 85, "Лев": 60, "Діва": 90, "Терези": 75, "Скорпіон": 80, "Стрілець": 35, "Козеріг": 95, "Водолій": 30, "Риби": 85 },
    "Близнюки": { "Овен": 85, "Телець": 40, "Близнюки": 65, "Рак": 45, "Лев": 80, "Діва": 55, "Терези": 95, "Скорпіон": 50, "Стрілець": 85, "Козеріг": 40, "Водолій": 90, "Риби": 50 },
    "Рак": { "Овен": 50, "Телець": 85, "Близнюки": 45, "Рак": 75, "Лев": 70, "Діва": 80, "Терези": 60, "Скорпіон": 95, "Стрілець": 40, "Козеріг": 85, "Водолій": 35, "Риби": 90 },
    "Лев": { "Овен": 95, "Телець": 60, "Близнюки": 80, "Рак": 70, "Лев": 80, "Діва": 50, "Терези": 85, "Скорпіон": 65, "Стрілець": 95, "Козеріг": 45, "Водолій": 80, "Риби": 60 },
    "Діва": { "Овен": 40, "Телець": 90, "Близнюки": 55, "Рак": 80, "Лев": 50, "Діва": 70, "Терези": 65, "Скорпіон": 85, "Стрілець": 45, "Козеріг": 90, "Водолій": 40, "Риби": 75 },
    "Терези": { "Овен": 80, "Телець": 75, "Близнюки": 95, "Рак": 60, "Лев": 85, "Діва": 65, "Терези": 75, "Скорпіон": 70, "Стрілець": 80, "Козеріг": 55, "Водолій": 85, "Риби": 70 },
    "Скорпіон": { "Овен": 60, "Телець": 80, "Близнюки": 50, "Рак": 95, "Лев": 65, "Діва": 85, "Терези": 70, "Скорпіон": 85, "Стрілець": 55, "Козеріг": 80, "Водолій": 50, "Риби": 95 },
    "Стрілець": { "Овен": 90, "Телець": 35, "Близнюки": 85, "Рак": 40, "Лев": 95, "Діва": 45, "Терези": 80, "Скорпіон": 55, "Стрілець": 75, "Козеріг": 50, "Водолій": 90, "Риби": 60 },
    "Козеріг": { "Овен": 35, "Телець": 95, "Близнюки": 40, "Рак": 85, "Лев": 45, "Діва": 90, "Терези": 55, "Скорпіон": 80, "Стрілець": 50, "Козеріг": 80, "Водолій": 45, "Риби": 75 },
    "Водолій": { "Овен": 85, "Телець": 30, "Близнюки": 90, "Рак": 35, "Лев": 80, "Діва": 40, "Терези": 85, "Скорпіон": 50, "Стрілець": 90, "Козеріг": 45, "Водолій": 70, "Риби": 55 },
    "Риби": { "Овен": 55, "Телець": 85, "Близнюки": 50, "Рак": 90, "Лев": 60, "Діва": 75, "Терези": 70, "Скорпіон": 95, "Стрілець": 60, "Козеріг": 75, "Водолій": 55, "Риби": 80 }
  };

  // Detailed sign descriptions for compatibility analysis
  const signDescriptions = {
    "Овен": { traits: "Динамічний, незалежний, піонерський, впевнений", approach: "Пряма дія та лідерство", communication: "Відверта та ентузіастична", love: "Пристрасна та авантюрна" },
    "Телець": { traits: "Стабільний, практичний, чуттєвий, вірний", approach: "Стійка та методична", communication: "Спокійна та надійна", love: "Відданий та ніжний" },
    "Близнюки": { traits: "Цікавий, адаптивний, комунікативний, дотепний", approach: "Інтелектуальна та універсальна", communication: "Захоплююча та красномовна", love: "Грайлива та розумово стимулююча" },
    "Рак": { traits: "Турботливий, емоційний, захисний, інтуїтивний", approach: "Турботлива та підтримуюча", communication: "Емпатична та щира", love: "Глибоко та емоційно пов'язана" },
    "Лев": { traits: "Впевнений, щедрий, творчий, драматичний", approach: "Сміливий та виразний", communication: "Тепла та надихаюча", love: "Романтична та велика жестикуляція" },
    "Діва": { traits: "Аналітична, корисна, перфекціоністська, практична", approach: "Детальна та організована", communication: "Вдумлива та точна", love: "Турбота через вчинки служіння" },
    "Терези": { traits: "Гармонійна, дипломатична, артистична, соціальна", approach: "Збалансована та справедлива", communication: "Чарівна та переконлива", love: "Романтична та орієнтована на партнерство" },
    "Скорпіон": { traits: "Інтенсивний, пристрасний, таємничий, трансформуючий", approach: "Глибока та дослідницька", communication: "Глибока та чесна", love: "Інтенсивна та всепоглинаюча" },
    "Стрілець": { traits: "Авантюрний, оптимістичний, філософський, вільний", approach: "Дослідницька та експансивна", communication: "Чесна та ентузіастична", love: "Весела та свободолюбна" },
    "Козеріг": { traits: "Амбіційний, дисциплінований, відповідальний, традиційний", approach: "Цілеспрямований та структурований", communication: "Серйозна та надійна", love: "Відданий та орієнтований на довгострокові відносини" },
    "Водолій": { traits: "Незалежний, інноваційний, гуманітарний, унікальний", approach: "Нетрадиційний та прогресивний", communication: "Інтелектуальна та відсторонена", love: "Заснована на дружбі та вільнодухова" },
    "Риби": { traits: "Співчутливий, артистичний, інтуїтивний, мрійливий", approach: "Інтуїтивна та плинна", communication: "Емоційна та емпатична", love: "Романтична та духовно пов'язана" }
  };

  function calculateCompatibility(date1, date2, time1, time2) {
    const sign1 = getZodiacSign(date1);
    const sign2 = getZodiacSign(date2);
    
    if (!sign1 || !sign2) return 0;

    let baseScore = compatibilityMatrix[sign1.name][sign2.name];
    let bonuses = 0;

    // Element compatibility bonuses
    if (sign1.element === sign2.element) {
      bonuses += 10; // Same element understanding
    } else if (
      (sign1.element === "вогонь" && sign2.element === "повітря") ||
      (sign1.element === "повітря" && sign2.element === "вогонь") ||
      (sign1.element === "земля" && sign2.element === "вода") ||
      (sign1.element === "вода" && sign2.element === "земля")
    ) {
      bonuses += 8; // Complementary elements
    }

    // Modality harmony
    if (sign1.modality === sign2.modality) {
      bonuses += 5;
    }

    // Venus/Mars ruler bonus (love compatibility)
    if ((sign1.ruler === "Венера" || sign2.ruler === "Венера") && 
        (sign1.ruler === "Марс" || sign2.ruler === "Марс")) {
      bonuses += 12;
    }

    // Time-based adjustments (if provided)
    if (time1 && time2) {
      if (time1 === time2) bonuses += 5; // Similar energy cycles
    }

    return Math.min(100, baseScore + bonuses);
  }

  function getZodiacSign(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Determine zodiac sign based on month and day
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[0]; // Козеріг
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[1]; // Водолій
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns[2]; // Риби
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[3]; // Овен
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[4]; // Телець
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[5]; // Близнюки
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[6]; // Рак
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[7]; // Лев
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[8]; // Діва
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[9]; // Терези
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[10]; // Скорпіон
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[11]; // Стрілець

    return null;
  }

  function getCompatibilityInsights(sign1, sign2, score) {
    const desc1 = signDescriptions[sign1.name];
    const desc2 = signDescriptions[sign2.name];
    
    let strengths = "";
    let challenges = "";
    let advice = "";

    // Generate insights based on elements and scores
    if (score >= 80) {
      strengths = `Ваші енергії ${sign1.element} та ${sign2.element} створюють природну гармонію. Ви обидва цінуєте ${desc1.approach.toLowerCase()} ${sign1.name} та ${desc2.approach.toLowerCase()} ${sign2.name}.`;
      challenges = "Ваш основний виклик - підтримувати індивідуальне зростання, підтримуючи цілі один одного.";
      advice = "Святкуйте ваш природний зв'язок і продовжуйте будувати на міцному фундаменті взаємного розуміння.";
    } else if (score >= 60) {
      strengths = `${desc1.traits.split(',')[0]} природа ${sign1.name} доповнює ${desc2.traits.split(',')[0].toLowerCase()} підхід ${sign2.name} до життя.`;
      challenges = "Вам може знадобитися попрацювати над розумінням різних стилів спілкування та життєвих підходів один одного.";
      advice = "Зосередьтеся на тому, щоб цінувати ваші відмінності як можливості для зростання та навчання один від одного.";
    } else {
      strengths = `Незважаючи на відмінності, ${sign1.name} та ${sign2.name} можуть запропонувати один одному унікальні перспективи та можливості зростання.`;
      challenges = "Значні відмінності в цінностях, стилях спілкування та життєвих підходах можуть вимагати терпіння та компромісу.";
      advice = "Успіх вимагає відкритої комунікації, взаємної поваги та готовності адаптуватися до потреб один одного.";
    }

    return { strengths, challenges, advice };
  }

  function getScoreColor(score) {
    if (score >= 80) return "#4CAF50";
    if (score >= 60) return "#FF9800";
    return "#F44336";
  }

  function getScoreDescription(score) {
    if (score >= 90) return "Виняткова космічна гармонія";
    if (score >= 80) return "Дуже сумісні";
    if (score >= 70) return "Хороша сумісність";
    if (score >= 60) return "Помірна сумісність";
    if (score >= 50) return "Складно, але можливо";
    return "Великі відмінності для навігації";
  }

  if (calculateBtn && result) {
    calculateBtn.addEventListener("click", function () {
      const person1Name = document.getElementById("person1Name").value || "Перша особа";
      const person1Date = document.getElementById("person1Date").value;
      const person1Time = document.getElementById("person1Time").value;
      const person2Name = document.getElementById("person2Name").value || "Друга особа";
      const person2Date = document.getElementById("person2Date").value;
      const person2Time = document.getElementById("person2Time").value;

      if (!person1Date || !person2Date) {
        result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, введіть дати народження для обох людей.</p>';
        return;
      }

      const sign1 = getZodiacSign(person1Date);
      const sign2 = getZodiacSign(person2Date);

      if (!sign1 || !sign2) {
        result.innerHTML = '<p style="color: #e74c3c;">Неможливо визначити знаки зодіаку. Перевірте дати.</p>';
        return;
      }

      const compatibilityScore = calculateCompatibility(person1Date, person2Date, person1Time, person2Time);
      const insights = getCompatibilityInsights(sign1, sign2, compatibilityScore);
      const description = getScoreDescription(compatibilityScore);
      const color = getScoreColor(compatibilityScore);

      const elementEmojis = {
        "вогонь": "🔥",
        "земля": "🌍",
        "повітря": "💨",
        "вода": "🌊"
      };

      result.innerHTML = `
        <div class="insight-card">
          <h3 style="text-align: center; margin-bottom: 1.5rem; color: #2c3e50;">
            💫 Астрологічна сумісність
          </h3>
          
          <div style="text-align: center; margin: 1rem 0;">
            <div style="font-size: 3rem; font-weight: bold; color: ${color};">
              ${compatibilityScore}/100
            </div>
            <div style="font-size: 1.2rem; color: ${color}; margin-bottom: 1rem;">
              ${description}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; margin: 2rem 0;">
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
              <h4 style="margin: 0 0 0.5rem 0; color: #495057;">${person1Name}</h4>
              <div style="font-size: 1.5rem; margin: 0.5rem 0;">${elementEmojis[sign1.element]} ${sign1.name}</div>
              <small style="color: #6c757d;">${sign1.dates}</small>
              <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #6c757d;">
                <strong>Елемент:</strong> ${sign1.element}<br>
                <strong>Правитель:</strong> ${sign1.ruler}
              </div>
            </div>
            
            <div style="text-align: center; font-size: 2rem;">
              💕
            </div>
            
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
              <h4 style="margin: 0 0 0.5rem 0; color: #495057;">${person2Name}</h4>
              <div style="font-size: 1.5rem; margin: 0.5rem 0;">${elementEmojis[sign2.element]} ${sign2.name}</div>
              <small style="color: #6c757d;">${sign2.dates}</small>
              <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #6c757d;">
                <strong>Елемент:</strong> ${sign2.element}<br>
                <strong>Правитель:</strong> ${sign2.ruler}
              </div>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="color: #28a745; margin-bottom: 1rem;">✨ Сильні сторони стосунків</h4>
          <p style="line-height: 1.6; margin-bottom: 1rem;">${insights.strengths}</p>
          
          <h4 style="color: #ffc107; margin-bottom: 1rem;">⚡ Виклики для роботи</h4>
          <p style="line-height: 1.6; margin-bottom: 1rem;">${insights.challenges}</p>
          
          <h4 style="color: #17a2b8; margin-bottom: 1rem;">💡 Поради для гармонії</h4>
          <p style="line-height: 1.6;">${insights.advice}</p>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem;">🌟 Детальна характеристика</h4>
          
          <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px;">
              <strong>${sign1.name}:</strong> ${signDescriptions[sign1.name].traits}. 
              Підхід до кохання: ${signDescriptions[sign1.name].love}.
            </div>
            
            <div style="padding: 1rem; background: #fff3e0; border-radius: 8px;">
              <strong>${sign2.name}:</strong> ${signDescriptions[sign2.name].traits}. 
              Підхід до кохання: ${signDescriptions[sign2.name].love}.
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem;">🔮 Рекомендації для стосунків</h4>
          
          <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
              <strong>💬 Комунікація:</strong> Розвивайте відкрите та чесне спілкування, поважаючи різні стилі вираження.
            </div>
            
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
              <strong>🤝 Взаємоповага:</strong> Цініть унікальні якості та сильні сторони один одного.
            </div>
            
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #ffc107;">
              <strong>⚖️ Баланс:</strong> Знаходьте здоровий баланс між разом проведеним часом та особистим простором.
            </div>
            
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #dc3545;">
              <strong>📈 Зростання:</strong> Використовуйте виклики як можливості для взаємного зростання та розвитку.
            </div>
          </div>
        </div>

        <div class="insight-card" style="background: #f8f9fa; border-left: 4px solid #6c757d;">
          <p style="margin: 0; font-size: 0.9rem; color: #6c757d; font-style: italic;">
            <strong>Примітка:</strong> Астрологічна сумісність надає інсайти про природну динаміку між двома людьми. 
            Хоча це цінний інструмент для розуміння патернів стосунків, успішні стосунки залежать від багатьох факторів, 
            включаючи комунікацію, відданість та спільні цінності. Використовуйте цю інформацію як керівництво, 
            а не як остаточний вердикт про ваші стосунки.
          </p>
        </div>
      `;
    });
  }
});