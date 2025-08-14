document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("astrology-sign-form");
  const result = document.getElementById("astrology-sign-result");

  const signs = [
    { 
      name: "Козеріг", 
      start: "12-22", 
      end: "01-19",
      element: "Земля",
      ruler: "Сатурн",
      symbol: "♑",
      traits: "Амбітний, дисциплінований, практичний, відповідальний",
      description: "Козеріги відомі своєю працелюбністю та цілеспрямованістю. Вони прагнуть до успіху та готові докладати зусиль для досягнення своїх цілей.",
      compatibility: ["Телець", "Діва", "Скорпіон", "Риби"],
      lucky: { numbers: [8, 10, 26], colors: ["коричневий", "сірий", "темно-зелений"] }
    },
    { 
      name: "Водолій", 
      start: "01-20", 
      end: "02-18",
      element: "Повітря",
      ruler: "Уран",
      symbol: "♒",
      traits: "Незалежний, оригінальний, гуманний, прогресивний",
      description: "Водолії - це новатори та мрійники. Вони люблять свободу та прагнуть зробити світ кращим місцем для всіх.",
      compatibility: ["Близнюки", "Терези", "Стрілець", "Овен"],
      lucky: { numbers: [4, 7, 11], colors: ["синій", "срібний", "фіолетовий"] }
    },
    { 
      name: "Риби", 
      start: "02-19", 
      end: "03-20",
      element: "Вода",
      ruler: "Нептун",
      symbol: "♓",
      traits: "Чуттєвий, інтуїтивний, творчий, співчутливий",
      description: "Риби мають розвинену інтуїцію та глибоке розуміння емоцій. Вони часто є творчими та духовними людьми.",
      compatibility: ["Рак", "Скорпіон", "Телець", "Козеріг"],
      lucky: { numbers: [3, 9, 12], colors: ["морський", "фіолетовий", "зелений"] }
    },
    { 
      name: "Овен", 
      start: "03-21", 
      end: "04-19",
      element: "Вогонь",
      ruler: "Марс",
      symbol: "♈",
      traits: "Енергійний, сміливий, лідерський, імпульсивний",
      description: "Овни - це природжені лідери, повні енергії та ентузіазму. Вони люблять виклики та не бояться ризикувати.",
      compatibility: ["Лев", "Стрілець", "Близнюки", "Водолій"],
      lucky: { numbers: [1, 8, 17], colors: ["червоний", "білий", "жовтий"] }
    },
    { 
      name: "Телець", 
      start: "04-20", 
      end: "05-20",
      element: "Земля",
      ruler: "Венера",
      symbol: "♉",
      traits: "Стабільний, практичний, витривалий, чуттєвий",
      description: "Тельці цінують стабільність та комфорт. Вони наполегливі у досягненні цілей та мають прекрасний смак.",
      compatibility: ["Діва", "Козеріг", "Рак", "Риби"],
      lucky: { numbers: [2, 6, 9], colors: ["зелений", "рожевий", "блакитний"] }
    },
    { 
      name: "Близнюки", 
      start: "05-21", 
      end: "06-20",
      element: "Повітря",
      ruler: "Меркурій",
      symbol: "♊",
      traits: "Комунікабельний, розумний, допитливий, гнучкий",
      description: "Близнюки - це майстри спілкування. Вони допитливі, швидко вчаться та легко адаптуються до нових ситуацій.",
      compatibility: ["Терези", "Водолій", "Овен", "Лев"],
      lucky: { numbers: [5, 7, 14], colors: ["жовтий", "срібний", "світло-зелений"] }
    },
    { 
      name: "Рак", 
      start: "06-21", 
      end: "07-22",
      element: "Вода",
      ruler: "Місяць",
      symbol: "♋",
      traits: "Турботливий, емоційний, інтуїтивний, сімейний",
      description: "Раки мають сильну інтуїцію та глибокі емоції. Вони цінують сім'ю та дім понад усе.",
      compatibility: ["Скорпіон", "Риби", "Телець", "Діва"],
      lucky: { numbers: [2, 7, 11], colors: ["білий", "срібний", "морський"] }
    },
    { 
      name: "Лев", 
      start: "07-23", 
      end: "08-22",
      element: "Вогонь",
      ruler: "Сонце",
      symbol: "♌",
      traits: "Щедрий, творчий, драматичний, впевнений",
      description: "Леви люблять бути в центрі уваги. Вони щедрі, творчі та мають природний магнетизм.",
      compatibility: ["Овен", "Стрілець", "Близнюки", "Терези"],
      lucky: { numbers: [1, 3, 10], colors: ["золотий", "помаранчевий", "червоний"] }
    },
    { 
      name: "Діва", 
      start: "08-23", 
      end: "09-22",
      element: "Земля",
      ruler: "Меркурій",
      symbol: "♍",
      traits: "Аналітичний, перфекціоніст, практичний, корисний",
      description: "Діви уважні до деталей та прагнуть до досконалості. Вони практичні та завжди готові допомогти.",
      compatibility: ["Телець", "Козеріг", "Рак", "Скорпіон"],
      lucky: { numbers: [3, 27], colors: ["темно-синій", "сірий", "коричневий"] }
    },
    { 
      name: "Терези", 
      start: "09-23", 
      end: "10-22",
      element: "Повітря",
      ruler: "Венера",
      symbol: "♎",
      traits: "Дипломатичний, чарівний, справедливий, соціальний",
      description: "Терези прагнуть до гармонії та справедливості. Вони дипломатичні та мають прекрасне почуття стилю.",
      compatibility: ["Близнюки", "Водолій", "Лев", "Стрілець"],
      lucky: { numbers: [4, 6, 13], colors: ["рожевий", "блакитний", "зелений"] }
    },
    { 
      name: "Скорпіон", 
      start: "10-23", 
      end: "11-21",
      element: "Вода",
      ruler: "Плутон",
      symbol: "♏",
      traits: "Пристрасний, таємничий, цілеспрямований, інтенсивний",
      description: "Скорпіони мають сильну волю та глибокі емоції. Вони пристрасні та можуть бути дуже лояльними.",
      compatibility: ["Рак", "Риби", "Діва", "Козеріг"],
      lucky: { numbers: [8, 11, 18], colors: ["темно-червоний", "чорний", "бордовий"] }
    },
    { 
      name: "Стрілець", 
      start: "11-22", 
      end: "12-21",
      element: "Вогонь",
      ruler: "Юпітер",
      symbol: "♐",
      traits: "Пригодницький, оптимістичний, філософський, вільний",
      description: "Стрільці люблять пригоди та нові досвіди. Вони оптимістичні та прагнуть до знань і свободи.",
      compatibility: ["Овен", "Лев", "Терези", "Водолій"],
      lucky: { numbers: [3, 9, 22], colors: ["фіолетовий", "бірюзовий", "червоний"] }
    }
  ];

  function getSign(date) {
    const monthDay = date.toISOString().slice(5, 10); // "MM-DD"

    for (const sign of signs) {
      if (sign.start > sign.end) {
        // знак перетинає рік (Козеріг)
        if (monthDay >= sign.start || monthDay <= sign.end) {
          return sign;
        }
      } else {
        if (monthDay >= sign.start && monthDay <= sign.end) {
          return sign;
        }
      }
    }
    return null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthDateInput = document.getElementById("birthdate").value;

    if (!birthDateInput) {
      result.innerHTML = `
        <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
          <strong>Помилка:</strong> Будь ласка, введіть дату народження.
        </div>
      `;
      return;
    }

    const birthDate = new Date(birthDateInput);
    if (isNaN(birthDate)) {
      result.innerHTML = `
        <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
          <strong>Помилка:</strong> Неправильний формат дати.
        </div>
      `;
      return;
    }

    const signData = getSign(birthDate);
    if (!signData) {
      result.innerHTML = `
        <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
          <strong>Помилка:</strong> Не вдалося визначити знак зодіаку.
        </div>
      `;
      return;
    }

    result.innerHTML = `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #28a745; margin-top: 0;">Ваш знак зодіаку</h3>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #28a745; margin: 15px 0; text-align: center;">
          <div style="font-size: 3em; margin-bottom: 10px;">${signData.symbol}</div>
          <div style="font-size: 2.5em; font-weight: bold; color: #28a745; margin-bottom: 10px;">
            ${signData.name}
          </div>
          <div style="color: #666; font-size: 1em;">
            ${signData.start.replace('-', '.')} - ${signData.end.replace('-', '.')}
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
          <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 1.3em; font-weight: bold; color: #1976d2;">${signData.element}</div>
            <div style="color: #1976d2; font-weight: bold;">Стихія</div>
          </div>
          <div style="background: #fff3e0; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 1.3em; font-weight: bold; color: #f57c00;">${signData.ruler}</div>
            <div style="color: #f57c00; font-weight: bold;">Планета-покровитель</div>
          </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #6f42c1; margin: 15px 0;">
          <h4 style="margin-top: 0; color: #6f42c1;">🌟 Характеристика</h4>
          <p style="margin: 10px 0; color: #495057; line-height: 1.6;">${signData.description}</p>
          <p style="margin: 10px 0; color: #495057;"><strong>Основні риси:</strong> ${signData.traits}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #e91e63; margin: 15px 0;">
          <h4 style="margin-top: 0; color: #e91e63;">💕 Сумісність</h4>
          <p style="margin: 10px 0; color: #495057;">
            <strong>Найкраща сумісність:</strong> ${signData.compatibility.join(', ')}
          </p>
          <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
            Ці знаки найкраще доповнюють ваш характер і можуть створити гармонійні стосунки.
          </p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #ff9800; margin: 15px 0;">
          <h4 style="margin-top: 0; color: #ff9800;">🍀 Щасливі символи</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <strong style="color: #ff9800;">Щасливі числа:</strong><br>
              ${signData.lucky.numbers.join(', ')}
            </div>
            <div>
              <strong style="color: #ff9800;">Щасливі кольори:</strong><br>
              ${signData.lucky.colors.join(', ')}
            </div>
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin-top: 15px;">
          <h4 style="margin-top: 0; color: #2e7d32;">🔮 Поради для ${signData.name}</h4>
          <ul style="margin: 5px 0; color: #2e7d32; font-size: 0.9em;">
            ${getAdviceForSign(signData.name)}
          </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 15px;">
          <p style="margin: 0; font-size: 0.9em; color: #856404;">
            <em>Астрологія - це інструмент для самопізнання та розуміння власних схильностей. Пам'ятайте, що ваша особистість формується не тільки зірками, але й вашими рішеннями та досвідом.</em>
          </p>
        </div>
      </div>
    `;
  });

  function getAdviceForSign(signName) {
    const advice = {
      "Козеріг": `
        <li>Дозвольте собі більше відпочивати - ви заслуговуєте на це</li>
        <li>Не бійтеся показувати свої емоції близьким людям</li>
        <li>Ставте реалістичні цілі та святкуйте маленькі перемоги</li>
      `,
      "Водолій": `
        <li>Прислухайтесь до думок інших, навіть якщо вони відрізняються від ваших</li>
        <li>Працюйте над стабільністю у стосунках</li>
        <li>Використовуйте свою креативність для вирішення проблем</li>
      `,
      "Риби": `
        <li>Встановлюйте чіткі межі у стосунках</li>
        <li>Довіряйте своїй інтуїції, але перевіряйте факти</li>
        <li>Знайдіть творчий вихід для своїх емоцій</li>
      `,
      "Овен": `
        <li>Навчіться терпінню та обдумуйте рішення перед дією</li>
        <li>Слухайте поради інших перед прийняттям важливих рішень</li>
        <li>Направляйте свою енергію на конструктивні цілі</li>
      `,
      "Телець": `
        <li>Відкрийтеся новим можливостям та змінам</li>
        <li>Не бійтеся ризикувати заради росту</li>
        <li>Практикуйте щедрість та ділитесь з іншими</li>
      `,
      "Близнюки": `
        <li>Завершуйте розпочаті проекти до кінця</li>
        <li>Приділяйте більше часу глибоким розмовам</li>
        <li>Розвивайте концентрацію та фокусування</li>
      `,
      "Рак": `
        <li>Виходьте зі своєї зони комфорту частіше</li>
        <li>Навчіться прощати та відпускати образи</li>
        <li>Балансуйте турботу про інших з турботою про себе</li>
      `,
      "Лев": `
        <li>Практикуйте скромність та визнавайте заслуги інших</li>
        <li>Слухайте критику як можливість для зростання</li>
        <li>Використовуйте свою харизму для допомоги іншим</li>
      `,
      "Діва": `
        <li>Дозвольте собі бути недосконалим іноді</li>
        <li>Цінуйте прогрес більше за досконалість</li>
        <li>Не забувайте про відпочинок та розваги</li>
      `,
      "Терези": `
        <li>Навчіться приймати рішення швидше</li>
        <li>Відстоюйте свою точку зору, коли це важливо</li>
        <li>Знайдіть баланс між потребами своїми та інших</li>
      `,
      "Скорпіон": `
        <li>Практикуйте довіру та відкритість у стосунках</li>
        <li>Навчіться прощати та відпускати минуле</li>
        <li>Використовуйте свою інтенсивність для позитивних змін</li>
      `,
      "Стрілець": `
        <li>Працюйте над терпінням та увагою до деталей</li>
        <li>Завершуйте розпочаті справи перед новими пригодами</li>
        <li>Цінуйте стабільні стосунки поруч з пригодами</li>
      `
    };
    return advice[signName] || '<li>Слідуйте своєму серцю та довіряйте інтуїції</li>';
  }
});
