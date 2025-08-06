document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById("calculate-compatibility");
  const result = document.getElementById("compatibility-result");

  // Zodiac sign data with Ukrainian names and detailed compatibility information
  const zodiacSigns = [
    { name: "Козеріг", englishName: "Capricorn", element: "земля", modality: "кардинальний", ruler: "Сатурн", dates: "22 груд - 19 січ" },
    { name: "Водолій", englishName: "Aquarius", element: "повітря", modality: "фіксований", ruler: "Уран", dates: "20 січ - 18 лют" },
    { name: "Риби", englishName: "Pisces", element: "вода", modality: "мутабельний", ruler: "Нептун", dates: "19 лют - 20 бер" },
    { name: "Овен", englishName: "Aries", element: "вогонь", modality: "кардинальний", ruler: "Марс", dates: "21 бер - 19 квіт" },
    { name: "Телець", englishName: "Taurus", element: "земля", modality: "фіксований", ruler: "Венера", dates: "20 квіт - 20 трав" },
    { name: "Близнюки", englishName: "Gemini", element: "повітря", modality: "мутабельний", ruler: "Меркурій", dates: "21 трав - 20 черв" },
    { name: "Рак", englishName: "Cancer", element: "вода", modality: "кардинальний", ruler: "Місяць", dates: "21 черв - 22 лип" },
    { name: "Лев", englishName: "Leo", element: "вогонь", modality: "фіксований", ruler: "Сонце", dates: "23 лип - 22 серп" },
    { name: "Діва", englishName: "Virgo", element: "земля", modality: "мутабельний", ruler: "Меркурій", dates: "23 серп - 22 вер" },
    { name: "Терези", englishName: "Libra", element: "повітря", modality: "кардинальний", ruler: "Венера", dates: "23 вер - 22 жовт" },
    { name: "Скорпіон", englishName: "Scorpio", element: "вода", modality: "фіксований", ruler: "Плутон", dates: "23 жовт - 21 лист" },
    { name: "Стрілець", englishName: "Sagittarius", element: "вогонь", modality: "мутабельний", ruler: "Юпітер", dates: "22 лист - 21 груд" }
  ];

  // Compatibility matrix based on traditional astrology (using English names for calculation)
  const compatibilityMatrix = {
    "Aries": { "Aries": 75, "Taurus": 45, "Gemini": 85, "Cancer": 50, "Leo": 95, "Virgo": 40, "Libra": 80, "Scorpio": 60, "Sagittarius": 90, "Capricorn": 35, "Aquarius": 85, "Pisces": 55 },
    "Taurus": { "Aries": 45, "Taurus": 70, "Gemini": 40, "Cancer": 85, "Leo": 60, "Virgo": 90, "Libra": 75, "Scorpio": 80, "Sagittarius": 35, "Capricorn": 95, "Aquarius": 30, "Pisces": 85 },
    "Gemini": { "Aries": 85, "Taurus": 40, "Gemini": 65, "Cancer": 45, "Leo": 80, "Virgo": 55, "Libra": 95, "Scorpio": 50, "Sagittarius": 85, "Capricorn": 40, "Aquarius": 90, "Pisces": 50 },
    "Cancer": { "Aries": 50, "Taurus": 85, "Gemini": 45, "Cancer": 75, "Leo": 70, "Virgo": 80, "Libra": 60, "Scorpio": 95, "Sagittarius": 40, "Capricorn": 85, "Aquarius": 35, "Pisces": 90 },
    "Leo": { "Aries": 95, "Taurus": 60, "Gemini": 80, "Cancer": 70, "Leo": 80, "Virgo": 50, "Libra": 85, "Scorpio": 65, "Sagittarius": 95, "Capricorn": 45, "Aquarius": 80, "Pisces": 60 },
    "Virgo": { "Aries": 40, "Taurus": 90, "Gemini": 55, "Cancer": 80, "Leo": 50, "Virgo": 70, "Libra": 65, "Scorpio": 85, "Sagittarius": 45, "Capricorn": 90, "Aquarius": 40, "Pisces": 75 },
    "Libra": { "Aries": 80, "Taurus": 75, "Gemini": 95, "Cancer": 60, "Leo": 85, "Virgo": 65, "Libra": 75, "Scorpio": 70, "Sagittarius": 80, "Capricorn": 55, "Aquarius": 85, "Pisces": 70 },
    "Scorpio": { "Aries": 60, "Taurus": 80, "Gemini": 50, "Cancer": 95, "Leo": 65, "Virgo": 85, "Libra": 70, "Scorpio": 85, "Sagittarius": 55, "Capricorn": 80, "Aquarius": 50, "Pisces": 95 },
    "Sagittarius": { "Aries": 90, "Taurus": 35, "Gemini": 85, "Cancer": 40, "Leo": 95, "Virgo": 45, "Libra": 80, "Scorpio": 55, "Sagittarius": 75, "Capricorn": 50, "Aquarius": 90, "Pisces": 60 },
    "Capricorn": { "Aries": 35, "Taurus": 95, "Gemini": 40, "Cancer": 85, "Leo": 45, "Virgo": 90, "Libra": 55, "Scorpio": 80, "Sagittarius": 50, "Capricorn": 80, "Aquarius": 45, "Pisces": 75 },
    "Aquarius": { "Aries": 85, "Taurus": 30, "Gemini": 90, "Cancer": 35, "Leo": 80, "Virgo": 40, "Libra": 85, "Scorpio": 50, "Sagittarius": 90, "Capricorn": 45, "Aquarius": 70, "Pisces": 55 },
    "Pisces": { "Aries": 55, "Taurus": 85, "Gemini": 50, "Cancer": 90, "Leo": 60, "Virgo": 75, "Libra": 70, "Scorpio": 95, "Sagittarius": 60, "Capricorn": 75, "Aquarius": 55, "Pisces": 80 }
  };

  // Detailed sign descriptions for compatibility analysis in Ukrainian
  const signDescriptions = {
    "Овен": { traits: "Динамічний, незалежний, новаторський, впевнений", approach: "Пряма дія та лідерство", communication: "Відвертий та ентузіастичний", love: "Пристрасний та пригодницький" },
    "Телець": { traits: "Стабільний, практичний, чуттєвий, вірний", approach: "Стійкий та методичний", communication: "Спокійний та надійний", love: "Відданий та ніжний" },
    "Близнюки": { traits: "Цікавий, адаптивний, комунікабельний, дотепний", approach: "Інтелектуальний та універсальний", communication: "Захоплюючий та артикульований", love: "Ігривий та ментально стимулюючий" },
    "Рак": { traits: "Піклувальний, емоційний, захисний, інтуїтивний", approach: "Турботливий та підтримуючий", communication: "Емпатичний та щирий", love: "Глибокий та емоційно пов'язаний" },
    "Лев": { traits: "Впевнений, щедрий, творчий, драматичний", approach: "Сміливий та виразний", communication: "Теплий та надихаючий", love: "Романтичний та великі жести" },
    "Діва": { traits: "Аналітичний, корисний, перфекціоніст, практичний", approach: "Детальний та організований", communication: "Вдумливий та точний", love: "Турботливий через дії служіння" },
    "Терези": { traits: "Гармонійний, дипломатичний, артистичний, соціальний", approach: "Збалансований та справедливий", communication: "Чарівний та переконливий", love: "Романтичний та орієнтований на партнерство" },
    "Скорпіон": { traits: "Інтенсивний, пристрасний, таємничий, трансформуючий", approach: "Глибокий та дослідницький", communication: "Глибокий та чесний", love: "Інтенсивний та всепоглинаючий" },
    "Стрілець": { traits: "Пригодницький, оптимістичний, філософський, вільний", approach: "Дослідницький та експансивний", communication: "Чесний та ентузіастичний", love: "Веселий та свободолюбний" },
    "Козеріг": { traits: "Амбітний, дисциплінований, відповідальний, традиційний", approach: "Цілеспрямований та структурований", communication: "Серйозний та надійний", love: "Відданий та орієнтований на довготривалі стосунки" },
    "Водолій": { traits: "Незалежний, інноваційний, гуманітарний, унікальний", approach: "Нетрадиційний та прогресивний", communication: "Інтелектуальний та відсторонений", love: "Базований на дружбі та вільнодухий" },
    "Риби": { traits: "Співчутливий, артистичний, інтуїтивний, мрійливий", approach: "Інтуїтивний та плинний", communication: "Емоційний та емпатичний", love: "Романтичний та духовно пов'язаний" }
  };

  function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

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
  }

  function calculateCompatibility(sign1, sign2, time1, time2) {
    let baseScore = compatibilityMatrix[sign1.englishName][sign2.englishName];
    let bonuses = 0;

    // Element compatibility bonus
    if (sign1.element === sign2.element) {
      bonuses += 10; // Same element
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
      advice = "Святкуйте ваш природний зв'язок і продовжуйте будувати на міцному фундаменті взаєморозуміння.";
    } else if (score >= 60) {
      strengths = `${desc1.traits.split(',')[0]} природа ${sign1.name} доповнює ${desc2.traits.split(',')[0].toLowerCase()} підхід ${sign2.name} до життя.`;
      challenges = "Вам може знадобитися працювати над розумінням різних стилів спілкування та життєвих підходів один одного.";
      advice = "Зосередьтеся на оцінці ваших відмінностей як можливостей для зростання та навчання один у одного.";
    } else {
      strengths = `Незважаючи на відмінності, ${sign1.name} та ${sign2.name} можуть запропонувати один одному унікальні перспективи та можливості зростання.`;
      challenges = "Значні відмінності в цінностях, стилях спілкування та життєвих підходах можуть потребувати терпіння та компромісів.";
      advice = "Успіх потребує відкритого спілкування, взаємної поваги та готовності адаптуватися до потреб один одного.";
    }

    return { strengths, challenges, advice };
  }

  function getScoreColor(score) {
    if (score >= 80) return "#28a745";
    if (score >= 60) return "#ffc107";
    return "#dc3545";
  }

  function getScoreDescription(score) {
    if (score >= 90) return "Виняткова космічна гармонія";
    if (score >= 80) return "Дуже сумісні";
    if (score >= 70) return "Хороша сумісність";
    if (score >= 60) return "Помірна сумісність";
    if (score >= 50) return "Складно, але можливо";
    return "Основні відмінності для подолання";
  }

  function getElementName(element) {
    const elementNames = {
      "вогонь": "Вогонь",
      "земля": "Земля", 
      "повітря": "Повітря",
      "вода": "Вода"
    };
    return elementNames[element] || element;
  }

  function getModalityName(modality) {
    const modalityNames = {
      "кардинальний": "Кардинальний",
      "фіксований": "Фіксований",
      "мутабельний": "Мутабельний"
    };
    return modalityNames[modality] || modality;
  }

  calculateBtn.addEventListener("click", function () {
    const person1Name = document.getElementById("person1Name").value || "Особа 1";
    const person1Date = document.getElementById("person1Date").value;
    const person1Time = document.getElementById("person1Time").value;
    
    const person2Name = document.getElementById("person2Name").value || "Особа 2";
    const person2Date = document.getElementById("person2Date").value;
    const person2Time = document.getElementById("person2Time").value;

    if (!person1Date || !person2Date) {
      result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, введіть обидві дати народження.</p>';
      return;
    }

    const date1 = new Date(person1Date);
    const date2 = new Date(person2Date);
    const today = new Date();

    if (date1 > today || date2 > today) {
      result.innerHTML = '<p style="color: #e74c3c;">Дати народження не можуть бути в майбутньому.</p>';
      return;
    }

    const sign1 = getZodiacSign(date1);
    const sign2 = getZodiacSign(date2);
    const compatibilityScore = calculateCompatibility(sign1, sign2, person1Time, person2Time);
    const insights = getCompatibilityInsights(sign1, sign2, compatibilityScore);
    const scoreColor = getScoreColor(compatibilityScore);
    const scoreDescription = getScoreDescription(compatibilityScore);

    result.innerHTML = `
      <div class="insight-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em;">Аналіз сумісності</h3>
        <div style="font-size: 1.2em; margin-bottom: 15px;">${person1Name} і ${person2Name}</div>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${compatibilityScore}%</div>
        <div style="font-size: 1.3em; opacity: 0.9;">${scoreDescription}</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div class="insight-card" style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; text-align: center;">
          <h4 style="margin: 0 0 15px 0; color: #007bff;">${person1Name}</h4>
          <div style="font-size: 1.4em; font-weight: bold; margin-bottom: 10px;">${sign1.name}</div>
          <p style="margin: 5px 0; color: #6c757d;">${sign1.dates}</p>
          <p style="margin: 5px 0;"><strong>Елемент:</strong> ${getElementName(sign1.element)}</p>
          <p style="margin: 5px 0;"><strong>Модальність:</strong> ${getModalityName(sign1.modality)}</p>
          <p style="margin: 10px 0 0 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign1.name].traits}</p>
        </div>

        <div class="insight-card" style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #e91e63; text-align: center;">
          <h4 style="margin: 0 0 15px 0; color: #e91e63;">${person2Name}</h4>
          <div style="font-size: 1.4em; font-weight: bold; margin-bottom: 10px;">${sign2.name}</div>
          <p style="margin: 5px 0; color: #6c757d;">${sign2.dates}</p>
          <p style="margin: 5px 0;"><strong>Елемент:</strong> ${getElementName(sign2.element)}</p>
          <p style="margin: 5px 0;"><strong>Модальність:</strong> ${getModalityName(sign2.modality)}</p>
          <p style="margin: 10px 0 0 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign2.name].traits}</p>
        </div>
      </div>

      <div class="insight-card" style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💚 Сильні сторони стосунків</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.strengths}</p>
      </div>

      <div class="insight-card" style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">⚠️ Потенційні виклики</h4>
        <p style="margin: 0; line-height: 1.6; color: #6c757d;">${insights.challenges}</p>
      </div>

      <div class="insight-card" style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">💡 Поради щодо сумісності</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div class="insight-card" style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6f42c1;">
          <h5 style="margin: 0 0 10px 0; color: #6f42c1;">Спілкування ${person1Name}</h5>
          <p style="margin: 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign1.name].communication}</p>
        </div>
        
        <div class="insight-card" style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6f42c1;">
          <h5 style="margin: 0 0 10px 0; color: #6f42c1;">Спілкування ${person2Name}</h5>
          <p style="margin: 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign2.name].communication}</p>
        </div>
      </div>

      <div class="insight-card" style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>💫 Сумісність - це лише один аспект стосунків. Любов, спілкування, взаємна повага та спільні цінності однаково важливі для успіху стосунків. Використовуйте ці інсайти для кращого розуміння та оцінки унікальних якостей один одного.</em>
        </p>
      </div>
    `;
  });
});