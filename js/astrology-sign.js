document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("astrology-sign-form");
  const result = document.getElementById("astrology-sign-result");

  const signs = [
    { 
      name: "Козеріг", 
      start: "12-22", 
      end: "01-19", 
      traits: "Амбіційний, дисциплінований, практичний, цілеспрямований",
      element: "Земля",
      ruler: "Сатурн",
      description: "Козероги відомі своєю непохитною рішучістю та здатністю досягати довгострокових цілей."
    },
    { 
      name: "Водолій", 
      start: "01-20", 
      end: "02-18", 
      traits: "Незалежний, інноваційний, гуманітарний, інтелектуальний",
      element: "Повітря",
      ruler: "Уран",
      description: "Водолії - візіонери, які прагнуть покращити світ через інновації та прогресивне мислення."
    },
    { 
      name: "Риби", 
      start: "02-19", 
      end: "03-20", 
      traits: "Інтуїтивний, співчутливий, артистичний, емпатичний",
      element: "Вода",
      ruler: "Нептун",
      description: "Риби мають глибоку емоційну природу та сильну інтуїцію, часто творчі та духовно орієнтовані."
    },
    { 
      name: "Овен", 
      start: "03-21", 
      end: "04-19", 
      traits: "Енергійний, піонерський, впевнений, орієнтований на лідерство",
      element: "Вогонь",
      ruler: "Марс",
      description: "Овни - природні лідери з великою енергією та ентузіазмом до нових починань."
    },
    { 
      name: "Телець", 
      start: "04-20", 
      end: "05-20", 
      traits: "Практичний, надійний, любить насолоди, стабільний",
      element: "Земля",
      ruler: "Венера",
      description: "Тельці цінують стабільність, красу та матеріальний комфорт, відомі своєю надійністю."
    },
    { 
      name: "Близнюки", 
      start: "05-21", 
      end: "06-20", 
      traits: "Комунікативний, адаптивний, інтелектуально цікавий, універсальний",
      element: "Повітря",
      ruler: "Меркурій",
      description: "Близнюки швидко вчаться, люблять спілкування та мають багатогранні інтереси."
    },
    { 
      name: "Рак", 
      start: "06-21", 
      end: "07-22", 
      traits: "Турботливий, емоційний, орієнтований на сім'ю, інтуїтивний",
      element: "Вода",
      ruler: "Місяць",
      description: "Раки глибоко емоційні, дуже цінують сім'ю та дім, мають сильну інтуїцію."
    },
    { 
      name: "Лев", 
      start: "07-23", 
      end: "08-22", 
      traits: "Впевнений, творчий, щедрий, прагне уваги",
      element: "Вогонь",
      ruler: "Сонце",
      description: "Леви харизматичні та творчі, люблять бути в центрі уваги та надихати інших."
    },
    { 
      name: "Діва", 
      start: "08-23", 
      end: "09-22", 
      traits: "Аналітичний, перфекціоніст, орієнтований на служіння, практичний",
      element: "Земля",
      ruler: "Меркурій",
      description: "Діви уважні до деталей, прагнуть досконалості та завжди готові допомогти іншим."
    },
    { 
      name: "Терези", 
      start: "09-23", 
      end: "10-22", 
      traits: "Гармонійний, дипломатичний, любить красу, збалансований",
      element: "Повітря",
      ruler: "Венера",
      description: "Терези прагнуть гармонії та справедливості, мають врроджений естетичний смак."
    },
    { 
      name: "Скорпіон", 
      start: "10-23", 
      end: "11-21", 
      traits: "Інтенсивний, трансформуючий, таємничий, пристрасний",
      element: "Вода",
      ruler: "Плутон",
      description: "Скорпіони мають глибоку емоційну природу, сильну волю та здатність до трансформації."
    },
    { 
      name: "Стрілець", 
      start: "11-22", 
      end: "12-21", 
      traits: "Авантюрний, філософський, любить свободу, оптимістичний",
      element: "Вогонь",
      ruler: "Юпітер",
      description: "Стрільці люблять пригоди, мають філософський склад розуму та прагнуть до саморозвитку."
    },
  ];

  function getSign(date) {
    const monthDay = date.toISOString().slice(5, 10); // "MM-DD"

    for (const sign of signs) {
      if (sign.start > sign.end) {
        // sign spans across year boundary (Capricorn)
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

  function formatDateRange(start, end) {
    const monthNames = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];

    const formatDate = (monthDay) => {
      const [month, day] = monthDay.split('-');
      const monthIndex = parseInt(month) - 1;
      return `${parseInt(day)} ${monthNames[monthIndex]}`;
    };

    if (start > end) {
      // spans year boundary
      return `${formatDate(start)} - ${formatDate(end)}`;
    } else {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
  }

  function getElementEmoji(element) {
    const elementEmojis = {
      "Вогонь": "🔥",
      "Земля": "🌍", 
      "Повітря": "💨",
      "Вода": "🌊"
    };
    return elementEmojis[element] || "";
  }

  function getElementDescription(element) {
    const descriptions = {
      "Вогонь": "Енергійні, пристрасні, натхненні лідери",
      "Земля": "Практичні, стабільні, надійні та заземлені",
      "Повітря": "Інтелектуальні, комунікативні, соціально орієнтовані",
      "Вода": "Емоційні, інтуїтивні, глибоко чутливі"
    };
    return descriptions[element] || "";
  }

  if (form && result) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const birthDateInput = document.getElementById("birthdate")?.value;

      if (!birthDateInput) {
        result.innerHTML = '<div class="error">Будь ласка, введіть дату вашого народження.</div>';
        return;
      }

      const birthDate = new Date(birthDateInput);
      const today = new Date();
      
      if (isNaN(birthDate)) {
        result.innerHTML = '<div class="error">Неправильний формат дати.</div>';
        return;
      }

      if (birthDate > today) {
        result.innerHTML = '<div class="error">Дата народження не може бути в майбутньому.</div>';
        return;
      }

      const signData = getSign(birthDate);
      if (!signData) {
        result.innerHTML = '<div class="error">Не вдалося визначити знак зодіаку.</div>';
        return;
      }

      const dateRange = formatDateRange(signData.start, signData.end);
      const elementEmoji = getElementEmoji(signData.element);
      const elementDesc = getElementDescription(signData.element);
      
      result.innerHTML = `
        <div class="insight-card">
          <h3 style="text-align: center; margin-bottom: 1.5rem; color: #2c3e50;">
            ⭐ Ваш знак зодіаку
          </h3>
          
          <div style="text-align: center; margin: 2rem 0;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">
              ${elementEmoji}
            </div>
            <h2 style="margin: 0 0 0.5rem 0; color: #3498db; font-size: 2.5rem;">
              ${signData.name}
            </h2>
            <div style="color: #666; font-size: 1.1rem; margin-bottom: 1rem;">
              ${dateRange}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
              <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Елемент</div>
              <div style="font-size: 1.2rem; font-weight: bold; color: #495057;">
                ${signData.element}
              </div>
            </div>
            
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
              <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Правитель</div>
              <div style="font-size: 1.2rem; font-weight: bold; color: #495057;">
                ${signData.ruler}
              </div>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">✨ Ключові риси характеру</h4>
          <div style="background: #e8f4f8; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <p style="margin: 0; font-size: 1.1rem; line-height: 1.6; color: #2c3e50;">
              ${signData.traits}
            </p>
          </div>
          
          <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px;">
            <p style="margin: 0; line-height: 1.6; color: #1e40af;">
              ${signData.description}
            </p>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">
            ${elementEmoji} Елемент ${signData.element}
          </h4>
          <div style="background: #fef7ed; padding: 1rem; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; line-height: 1.6; color: #92400e;">
              <strong>Характеристики елемента:</strong> ${elementDesc}
            </p>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">🌟 Астрологічні інсайти</h4>
          
          <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
              <strong style="color: #15803d;">💫 Сонячний знак</strong><br>
              <small style="color: #22c55e;">
                Ваш сонячний знак відображає вашу основну сутність, його, що рухає вами та вашу життєву силу.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong style="color: #92400e;">🔄 Сезонна енергія</strong><br>
              <small style="color: #d97706;">
                Кожен знак несе енергію свого сезону та положення Сонця в році.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #ede9fe; border-radius: 8px; border-left: 4px solid #8b5cf6;">
              <strong style="color: #7c3aed;">✨ Планетарний вплив</strong><br>
              <small style="color: #8b5cf6;">
                ${signData.ruler} як ваша правлячи планета впливає на вашу особистість та життєвий шлях.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #ecfccb; border-radius: 8px; border-left: 4px solid #65a30d;">
              <strong style="color: #4d7c0f;">🎯 Життєвий напрямок</strong><br>
              <small style="color: #65a30d;">
                Використовуйте сильні сторони вашого знаку для особистісного зростання та досягнення цілей.
              </small>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">💡 Рекомендації для ${signData.name}</h4>
          
          <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: #dbeafe; border-radius: 8px;">
              <strong style="color: #1e40af;">🌱 Розвиток</strong><br>
              <small style="color: #3730a3;">
                Зосередьтеся на розвитку позитивних якостей вашого знаку та роботі над викликами.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #fce7f3; border-radius: 8px;">
              <strong style="color: #be185d;">❤️ Стосунки</strong><br>
              <small style="color: #9d174d;">
                Розуміння вашого знаку допоможе будувати гармонійні стосунки з іншими.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #dcfce7; border-radius: 8px;">
              <strong style="color: #16a34a;">🎨 Самовираження</strong><br>
              <small style="color: #15803d;">
                Знайдіть способи самовираження, що відповідають природі вашого знаку.
              </small>
            </div>
          </div>
        </div>

        <div class="insight-card" style="background: #f8f9fa; border-left: 4px solid #6c757d;">
          <p style="margin: 0; font-size: 0.9rem; color: #6c757d; font-style: italic;">
            <strong>Примітка:</strong> Астрологія призначена для розваг та самопізнання. Ваша дата народження визначає ваш сонячний знак у західній астрології. Пам'ятайте, що ви - більше, ніж просто ваш сонячний знак, і ваша повна астрологічна карта включає багато інших факторів.
          </p>
        </div>
      `;
    });
  }
});