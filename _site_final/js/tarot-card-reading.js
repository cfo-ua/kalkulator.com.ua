document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tarot-form");
  const result = document.getElementById("tarot-result");
  const spreadType = document.getElementById("spreadType");
  const cardSelection = document.getElementById("card-selection");
  const calculateBtn = document.getElementById("calculate-btn");

  // Comprehensive tarot card database in Ukrainian
  const tarotCards = [
    // Major Arcana
    { name: "Дурень", type: "major", energy: 75, keywords: "нові починання, невинність, спонтанність", meaning: "Свіжий старт, стрибок віри, прийняття невідомого з оптимізмом." },
    { name: "Маг", type: "major", energy: 85, keywords: "маніфестація, сила волі, майстерність", meaning: "Наявність інструментів та здатності втілювати свої бажання, впевнена дія." },
    { name: "Верховна Жриця", type: "major", energy: 70, keywords: "інтуїція, таємниця, внутрішня мудрість", meaning: "Довіряйте своїй інтуїції, дивіться за поверхню, прийміть свою внутрішню мудрість." },
    { name: "Імператриця", type: "major", energy: 90, keywords: "родючість, творчість, достаток", meaning: "Творчість, енергія турботи, достаток та зростання у всіх сферах життя." },
    { name: "Імператор", type: "major", energy: 80, keywords: "влада, структура, лідерство", meaning: "Взяття контролю, встановлення порядку, лідерство та стабільність через дисципліну." },
    { name: "Ієрофант", type: "major", energy: 65, keywords: "традиція, конформізм, освіта", meaning: "Навчання від встановлених систем, слідування традиційній мудрості, духовне керівництво." },
    { name: "Закохані", type: "major", energy: 85, keywords: "кохання, гармонія, стосунки", meaning: "Глибокі зв'язки, важливі вибори в стосунках, узгодження цінностей." },
    { name: "Колісниця", type: "major", energy: 88, keywords: "перемога, рішучість, контроль", meaning: "Досягнення перемоги через силу волі, збереження контролю в складні часи." },
    { name: "Сила", type: "major", energy: 82, keywords: "мужність, внутрішня сила, терпіння", meaning: "Внутрішня сила долає перешкоди, м'який вплив потужніший за силу." },
    { name: "Відлюдник", type: "major", energy: 60, keywords: "самоаналіз, керівництво, мудрість", meaning: "Пошук душі, шукання внутрішнього керівництва, мудрість, здобута через самотність." },
    { name: "Колесо Фортуни", type: "major", energy: 75, keywords: "доля, цикли, поворотна точка", meaning: "Життєві цикли, доля в дії, удача та позитивні зміни попереду." },
    { name: "Справедливість", type: "major", energy: 78, keywords: "справедливість, правда, відповідальність", meaning: "Справедливі результати, розкрита правда, карма та відповідальність за минулі дії." },
    { name: "Повішений", type: "major", energy: 45, keywords: "призупинення, жертва, відпускання", meaning: "Тимчасове призупинення, погляд на речі з нової перспективи, необхідна жертва." },
    { name: "Смерть", type: "major", energy: 40, keywords: "трансформація, кінці, відродження", meaning: "Велика трансформація, завершення однієї фази для початку іншої, глибока зміна." },
    { name: "Поміркованість", type: "major", energy: 85, keywords: "баланс, помірність, зцілення", meaning: "Знаходження балансу, зцілення через помірність, гармонійне поєднання протилежних сил." },
    { name: "Диявол", type: "major", energy: 25, keywords: "рабство, спокуса, матеріалізм", meaning: "Звільнення від обмежуючих переконань, подолання спокуси та нездорових патернів." },
    { name: "Башта", type: "major", energy: 20, keywords: "раптова зміна, переворот, одкровення", meaning: "Раптовий переворот, руйнування старих структур, одкровення, що веде до свободи." },
    { name: "Зірка", type: "major", energy: 90, keywords: "надія, натхнення, керівництво", meaning: "Відновлена надія, духовне керівництво, натхнення та зцілення після важких часів." },
    { name: "Місяць", type: "major", energy: 50, keywords: "ілюзія, інтуїція, невизначеність", meaning: "Довіряйте своїй інтуїції, навігуйте через невизначеність, ілюзії можуть бути присутні." },
    { name: "Сонце", type: "major", energy: 95, keywords: "радість, успіх, життєвість", meaning: "Радість, успіх, життєвість та позитивна енергія випромінює у всіх сферах життя." },
    { name: "Суд", type: "major", energy: 80, keywords: "відродження, внутрішній заклик, прощення", meaning: "Духовне пробудження, відповідь на вищий заклик, прощення та спокута." },
    { name: "Світ", type: "major", energy: 95, keywords: "завершення, досягнення, виповнення", meaning: "Завершення подорожі, досягнення цілей, цілісність та виповнення." },
    
    // Minor Arcana - Кубки (Емоції, Стосунки)
    { name: "Туз Кубків", type: "minor", energy: 85, keywords: "нове кохання, емоційні починання", meaning: "Новий емоційний початок, кохання, співчуття та творче натхнення, що тече." },
    { name: "Двійка Кубків", type: "minor", energy: 88, keywords: "партнерство, єдність, взаємне притягнення", meaning: "Партнерство, взаємне притягнення, гармонійні стосунки та емоційний зв'язок." },
    { name: "Трійка Кубків", type: "minor", energy: 90, keywords: "святкування, дружба, спільнота", meaning: "Святкування з друзями, підтримка спільноти, радість, що ділиться з іншими." },
    { name: "Четвірка Кубків", type: "minor", energy: 40, keywords: "апатія, споглядання, втрачені можливості", meaning: "Апатія, втрачені можливості, потреба цінувати те, що маєте." },
    { name: "П'ятірка Кубків", type: "minor", energy: 30, keywords: "розчарування, горе, втрата", meaning: "Розчарування, горе, зосередженість на втраті, поки надія залишається." },
    { name: "Шістка Кубків", type: "minor", energy: 75, keywords: "ностальгія, дитинство, невинність", meaning: "Ностальгія, дитячі спогади, повернення до простіших часів." },
    { name: "Сімка Кубків", type: "minor", energy: 45, keywords: "ілюзія, вибори, мрійливе мислення", meaning: "Багато варіантів доступно, ілюзії, потреба в реалістичних виборах." },
    { name: "Вісімка Кубків", type: "minor", energy: 50, keywords: "покидання, відступ, пошук правди", meaning: "Відхід від незадовольняючих ситуацій, пошук глибшого сенсу." },
    { name: "Дев'ятка Кубків", type: "minor", energy: 85, keywords: "задоволення, емоційне виповнення", meaning: "Емоційне задоволення, виповнені бажання, вдоволення та вдячність." },
    { name: "Десятка Кубків", type: "minor", energy: 92, keywords: "щастя, сім'я, емоційне виповнення", meaning: "Найвище щастя, сімейна гармонія, досягнуте емоційне виповнення." },

    // Minor Arcana - Жезли (Пристрасть, Творчість, Кар'єра)
    { name: "Туз Жезлів", type: "minor", energy: 85, keywords: "натхнення, нові можливості", meaning: "Творче натхнення, нові можливості, пристрасні починання та зростання." },
    { name: "Двійка Жезлів", type: "minor", energy: 70, keywords: "планування, прийняття рішень", meaning: "Планування майбутнього, прийняття важливих рішень, особиста сила та вплив." },
    { name: "Трійка Жезлів", type: "minor", energy: 75, keywords: "розширення, передбачення, лідерство", meaning: "Розширення горизонтів, можливості лідерства, довгострокове бачення." },
    { name: "Четвірка Жезлів", type: "minor", energy: 88, keywords: "святкування, гармонія, повернення додому", meaning: "Святкування, гармонія, досягнення віх та підтримка спільноти." },
    { name: "П'ятірка Жезлів", type: "minor", energy: 45, keywords: "конфлікт, конкуренція, боротьба", meaning: "Конфлікт та конкуренція, боротьба за позицію, необхідність у співпраці." },
    { name: "Шістка Жезлів", type: "minor", energy: 80, keywords: "перемога, визнання, лідерство", meaning: "Перемога та визнання, успішне лідерство, подолання викликів." },
    { name: "Сімка Жезлів", type: "minor", energy: 60, keywords: "виклик, захист позиції, витривалість", meaning: "Захист своєї позиції, виклики конкурентів, витривалість у боротьбі." },
    { name: "Вісімка Жезлів", type: "minor", energy: 85, keywords: "швидкість, прогрес, рух", meaning: "Швидкий прогрес, рух до цілей, прискорення подій." },
    { name: "Дев'ятка Жезлів", type: "minor", energy: 65, keywords: "оборона, витривалість, майже фініш", meaning: "Останній опір, витривалість близько до цілі, захист досягнень." },
    { name: "Десятка Жезлів", type: "minor", energy: 35, keywords: "тягар, відповідальність, перенавантаження", meaning: "Занадто великий тягар, перенавантаження відповідальністю, потреба в делегуванні." },

    // Minor Arcana - Мечі (Розум, Комунікація, Конфлікт)
    { name: "Туз Мечів", type: "minor", energy: 80, keywords: "ясність, нові ідеї, прорив", meaning: "Ментальна ясність, нові ідеї, прорив у мисленні та комунікації." },
    { name: "Двійка Мечів", type: "minor", energy: 40, keywords: "важкий вибір, дилема, блокування", meaning: "Важке рішення, розумове блокування, потреба в ясності." },
    { name: "Трійка Мечів", type: "minor", energy: 25, keywords: "серцевий біль, печаль, емоційний біль", meaning: "Серцевий біль, печаль, емоційний біль та зцілення." },
    { name: "Четвірка Мечів", type: "minor", energy: 55, keywords: "відпочинок, медитація, відновлення", meaning: "Відпочинок та відновлення, медитація, пауза для розмірковувань." },
    { name: "П'ятірка Мечів", type: "minor", energy: 30, keywords: "поразка, втрата, самолюбство", meaning: "Поразка та втрата, гордість після конфлікту, уроки з невдач." },
    { name: "Шістка Мечів", type: "minor", energy: 60, keywords: "перехід, подорож, рухання вперед", meaning: "Перехід до кращого, подорож до нових можливостей." },
    { name: "Сімка Мечів", type: "minor", energy: 35, keywords: "обман, хитрість, стратегія", meaning: "Обман або хитрість, потреба в обережності, стратегічне мислення." },
    { name: "Вісімка Мечів", type: "minor", energy: 30, keywords: "обмеження, пастка, безпорадність", meaning: "Почуття обмеженості, ментальна пастка, потреба в новій перспективі." },
    { name: "Дев'ятка Мечів", type: "minor", energy: 20, keywords: "нічні кошмари, тривога, страх", meaning: "Тривога та страхи, нічні кошмари, потреба протистояти страхам." },
    { name: "Десятка Мечів", type: "minor", energy: 15, keywords: "зрада, кінець циклу, дно", meaning: "Болісний кінець, зрада, досягнення дна перед відновленням." },

    // Minor Arcana - Пентаклі (Матеріальні справи, Кар'єра, Земне)
    { name: "Туз Пентаклів", type: "minor", energy: 85, keywords: "нова можливість, матеріальний початок", meaning: "Нова матеріальна можливість, потенціал для процвітання, стабільна основа." },
    { name: "Двійка Пентаклів", type: "minor", energy: 55, keywords: "баланс, жонглювання, адаптивність", meaning: "Баланс пріоритетів, жонглювання обов'язками, адаптивність до змін." },
    { name: "Трійка Пентаклів", type: "minor", energy: 75, keywords: "співпраця, командна робота, майстерність", meaning: "Співпраця та командна робота, визнання майстерності, спільні зусилля." },
    { name: "Четвірка Пентаклів", type: "minor", energy: 40, keywords: "скупість, безпека, контроль", meaning: "Надмірний контроль ресурсів, страх втрати, потреба в генерозності." },
    { name: "П'ятірка Пентаклів", type: "minor", energy: 25, keywords: "фінансові труднощі, нужда, виключення", meaning: "Фінансові труднощі, почуття виключеності, потреба в підтримці." },
    { name: "Шістка Пентаклів", type: "minor", energy: 80, keywords: "генерозність, обмін, справедливість", meaning: "Генерозність та обмін, справедливе розподілення ресурсів." },
    { name: "Сімка Пентаклів", type: "minor", energy: 60, keywords: "терпіння, довгострокові інвестиції, оцінка", meaning: "Терпіння у довгострокових проектах, оцінка прогресу, інвестиції в майбутнє." },
    { name: "Вісімка Пентаклів", type: "minor", energy: 75, keywords: "майстерність, посвята, ремесло", meaning: "Посвята ремеслу, розвиток майстерності, кропітка робота." },
    { name: "Дев'ятка Пентаклів", type: "minor", energy: 85, keywords: "фінансова незалежність, розкіш, досягнення", meaning: "Фінансова незалежність, насолода досягненнями, матеріальний комфорт." },
    { name: "Десятка Пентаклів", type: "minor", energy: 90, keywords: "багатство, сімейне процвітання, спадщина", meaning: "Багатство та процвітання, сімейна безпека, створення спадщини." }
  ];

  // Spread type labels in Ukrainian
  const spreadLabels = {
    "past-present-future": ["Минуле", "Теперішнє", "Майбутнє"],
    "situation-action-outcome": ["Ситуація", "Дія", "Результат"],
    "mind-body-spirit": ["Розум", "Тіло", "Дух"]
  };

  function populateCardOptions() {
    const card1 = document.getElementById("card1");
    const card2 = document.getElementById("card2");
    const card3 = document.getElementById("card3");

    // Clear existing options
    [card1, card2, card3].forEach(select => {
      select.innerHTML = '<option value="">Оберіть карту...</option>';
      tarotCards.forEach((card, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = card.name;
        select.appendChild(option);
      });
    });
  }

  // Update position labels based on spread type
  function updatePositionLabels() {
    const spread = spreadType.value;
    if (spread && spreadLabels[spread]) {
      document.getElementById("position1-label").textContent = spreadLabels[spread][0] + ":";
      document.getElementById("position2-label").textContent = spreadLabels[spread][1] + ":";
      document.getElementById("position3-label").textContent = spreadLabels[spread][2] + ":";
      
      cardSelection.style.display = "block";
      calculateBtn.style.display = "block";
      populateCardOptions();
    } else {
      cardSelection.style.display = "none";
      calculateBtn.style.display = "none";
    }
  }

  function calculateInterpretationScore(cards) {
    let totalEnergy = 0;
    let harmonyBonus = 0;
    
    // Calculate base energy
    cards.forEach(card => {
      totalEnergy += card.energy;
    });
    
    // Check for harmony bonuses
    const majorCount = cards.filter(card => card.type === "major").length;
    const energyLevels = cards.map(card => card.energy);
    const averageEnergy = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;
    
    // Bonus for multiple major arcana
    if (majorCount >= 2) harmonyBonus += 10;
    if (majorCount === 3) harmonyBonus += 15;
    
    // Bonus for balanced energy levels
    const energyRange = Math.max(...energyLevels) - Math.min(...energyLevels);
    if (energyRange <= 20) harmonyBonus += 10;
    
    // Bonus for high overall energy
    if (averageEnergy >= 80) harmonyBonus += 15;
    
    const finalScore = Math.min(100, Math.round((totalEnergy / 3) + harmonyBonus));
    return finalScore;
  }

  function getScoreInterpretation(score) {
    if (score >= 90) return "Високо гармонійне читання з чітким позитивним керівництвом";
    if (score >= 70) return "Позитивна енергія з підтримуючими впливами";
    if (score >= 50) return "Збалансоване читання зі змішаними впливами для розгляду";
    if (score >= 30) return "Складний період, що вимагає уважного ставлення та терпіння";
    return "Значний період трансформації - прийміть зміни для зростання";
  }

  function getSpreadInterpretation(spreadType, cards) {
    const spread = spreadLabels[spreadType];
    let interpretation = "";
    
    switch(spreadType) {
      case "past-present-future":
        interpretation = `Ваша подорож показує ${cards[0].name}, що впливає на ваше минуле, ${cards[1].name} представляє ваш поточний стан, а ${cards[2].name} вказує на ваш майбутній напрямок. `;
        break;
      case "situation-action-outcome":
        interpretation = `Ваша поточна ситуація (${cards[0].name}) пропонує ${cards[1].name} як найкращу дію для вживання, що веде до ${cards[2].name} як ймовірного результату. `;
        break;
      case "mind-body-spirit":
        interpretation = `Ваш розум (${cards[0].name}), тіло (${cards[1].name}) та дух (${cards[2].name}) всі взаємопов'язані в цьому читанні. `;
        break;
    }
    
    return interpretation;
  }

  spreadType.addEventListener("change", updatePositionLabels);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const spread = spreadType.value;
    const cardIndices = [
      parseInt(document.getElementById("card1").value),
      parseInt(document.getElementById("card2").value),
      parseInt(document.getElementById("card3").value)
    ];

    if (!spread) {
      result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, оберіть тип розкладу.</p>';
      return;
    }

    if (cardIndices.some(index => isNaN(index))) {
      result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, оберіть всі три карти.</p>';
      return;
    }

    // Check for duplicate cards
    if (new Set(cardIndices).size !== cardIndices.length) {
      result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, оберіть три різні карти.</p>';
      return;
    }

    const selectedCards = cardIndices.map(index => tarotCards[index]);
    const score = calculateInterpretationScore(selectedCards);
    const scoreInterpretation = getScoreInterpretation(score);
    const spreadInterpretation = getSpreadInterpretation(spread, selectedCards);
    const labels = spreadLabels[spread];

    let cardDetails = "";
    selectedCards.forEach((card, index) => {
      cardDetails += `
        <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #3498db; border-radius: 5px;">
          <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${labels[index]}: ${card.name}</h4>
          <p style="margin: 5px 0;"><strong>Рівень енергії:</strong> ${card.energy}/100</p>
          <p style="margin: 5px 0;"><strong>Ключові слова:</strong> ${card.keywords}</p>
          <p style="margin: 5px 0 0 0;"><strong>Значення:</strong> ${card.meaning}</p>
        </div>
      `;
    });

    const getScoreColor = (score) => {
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#FF9800';
      if (score >= 40) return '#FF5722';
      return '#F44336';
    };

    result.innerHTML = `
      <div class="insight-card">
        <h3 style="margin: 0 0 15px 0; color: #2c3e50;">🔮 Результати вашого читання Таро</h3>
        <div style="text-align: center; margin: 1rem 0;">
          <div style="font-size: 3rem; font-weight: bold; color: ${getScoreColor(score)};">
            ${score}/100
          </div>
          <div style="font-size: 1.2rem; color: ${getScoreColor(score)}; margin-bottom: 1rem;">
            Бал інтерпретації
          </div>
          <p style="margin: 0; color: #666; font-size: 1.1rem;">${scoreInterpretation}</p>
        </div>
      </div>
      
      <div class="insight-card">
        <h4 style="margin: 0 0 15px 0; color: #2c3e50;">📖 Огляд читання</h4>
        <p style="margin: 0; line-height: 1.6; font-size: 1.1rem;">${spreadInterpretation}</p>
      </div>

      <div class="insight-card">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">🃏 Деталі карт:</h4>
        ${cardDetails}
      </div>

      <div class="insight-card">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">✨ Рекомендації для роздумів</h4>
        <div style="display: grid; gap: 1rem;">
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px;">
            <strong>🧘 Медитація:</strong> Знайдіть спокійний час для роздумів над значеннями карт та їх зв'язком з вашим життям.
          </div>
          <div style="padding: 1rem; background: #fff3e0; border-radius: 8px;">
            <strong>📔 Ведення щоденника:</strong> Запишіть свої думки та інсайти з цього читання для майбутньої референції.
          </div>
          <div style="padding: 1rem; background: #f3e5f5; border-radius: 8px;">
            <strong>🎯 Фокус на дії:</strong> Визначте конкретні кроки, які ви можете зробити на основі отриманого керівництва.
          </div>
          <div style="padding: 1rem; background: #e1f5fe; border-radius: 8px;">
            <strong>🔄 Регулярність:</strong> Використовуйте Таро регулярно як інструмент самоаналізу та особистісного зростання.
          </div>
        </div>
      </div>

      <div class="insight-card" style="background: #f8f9fa; border-left: 4px solid #3498db;">
        <p style="margin: 0; font-size: 0.9em; color: #7f8c8d; font-style: italic;">
          Це читання призначене для розваг, самоаналізу та особистого керівництва. Використовуйте ці інсайти як інструмент для самоспостереження та особистісного зростання. Довіряйте своїй інтуїції при інтерпретації повідомлень.
        </p>
      </div>
    `;
  });
});