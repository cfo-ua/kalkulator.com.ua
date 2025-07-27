document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("numerology-form");
  const result = document.getElementById("numerology-result");
  const monthSelect = document.getElementById("birthMonth");
  const daySelect = document.getElementById("birthDay");
  const yearInput = document.getElementById("birthYear");

  // Populate day dropdown
  function populateDays() {
    if (!daySelect) return;
    daySelect.innerHTML = '<option value="">День</option>';
    for (let i = 1; i <= 31; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }
  }

  // Update days based on selected month
  function updateDays() {
    if (!monthSelect || !daySelect) return;
    
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput?.value) || new Date().getFullYear();
    
    if (month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      daySelect.innerHTML = '<option value="">День</option>';
      
      for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
      }
    } else {
      populateDays();
    }
  }

  // Add event listeners
  if (monthSelect) monthSelect.addEventListener("change", updateDays);
  if (yearInput) yearInput.addEventListener("input", updateDays);

  // Initialize days
  populateDays();

  // Life path number data in Ukrainian
  const lifePathData = {
    1: {
      title: "Лідер",
      traits: "Незалежний, піонерський, амбіційний, оригінальний, впевнений",
      strengths: "Природні лідерські здібності, інноваційність, рішучість, самостійність, відвага брати ініціативу",
      challenges: "Може бути надто агресивним, нетерплячим, егоцентричним або домінуючим. Може мати труднощі з командною роботою",
      lifeTheme: "Розвивати незалежність та лідерство, навчаючись працювати з іншими",
      careers: "Підприємець, керівник, винахідник, політик, художник, архітектор, військовий лідер",
      relationships: "Приваблює людей, які цінують силу та незалежність. Найкраще з партнерами, які можуть справитися з сильною особистістю",
      spiritualPath: "Навчитися балансувати особисті досягнення зі служінням іншим, розвивати смиренність, зберігаючи впевненість",
      compatibility: "Добре працює з 2, 8 та 9. Виклики з 1 та 8 (боротьба за владу)"
    },
    2: {
      title: "Дипломат",
      traits: "Співробітливий, чутливий, дипломатичний, терплячий, підтримуючий",
      strengths: "Відмінний посередник, командний гравець, інтуїтивний, м'який, миротворець, уважний до деталей",
      challenges: "Може бути надчутливим, нерішучим, залежним від інших або надмірно емоційним. Може бракувати впевненості",
      lifeTheme: "Розвивати співпрацю та гармонію, зберігаючи особисту ідентичність",
      careers: "Консультант, дипломат, учитель, музикант, художник, бухгалтер, медсестра, соціальний працівник",
      relationships: "Процвітає в партнерстві, глибоко вірний, прагне гармонії. Найкраще з розуміючими та підтримуючими партнерами",
      spiritualPath: "Навчитися служити іншим, поважаючи власні потреби, розвивати внутрішню силу через ніжність",
      compatibility: "Природна гармонія з 1, 6 та 8. Виклики з 5 та 7 (різні темпи життя)"
    },
    3: {
      title: "Творець",
      traits: "Артистичний, виразний, оптимістичний, надихаючий, розважальний",
      strengths: "Творчий геній, відмінний комунікатор, піднесений, уявний, харизматичний, універсальний",
      challenges: "Може бути розсіяним, поверхневим, мінливим у настрої або надмірно критичним. Може мати труднощі з фокусом та дисципліною",
      lifeTheme: "Виражати творчість та надихати інших, розвиваючи емоційну глибину",
      careers: "Художник, письменник, виконавець, учитель, дизайнер, фотограф, комік, продавець",
      relationships: "Приносить радість та творчість у стосунки, потребує визнання своєї унікальності",
      spiritualPath: "Використання творчих дарів для піднесення людства, навчання виражати справжні емоції поза поверхневим щастям",
      compatibility: "Гармонійно з 1, 5 та 6. Виклики з 4 та 8 (різні підходи до життя)"
    },
    4: {
      title: "Будівельник",
      traits: "Практичний, стабільний, працьовитий, надійний, методичний",
      strengths: "Відмінний організатор, надійний, наполегливий, систематичний, чесний, вірний",
      challenges: "Може бути жорстким, упертим, надто серйозним або вузькоглядним. Може опиратися змінам",
      lifeTheme: "Будувати міцні основи, залишаючись відкритим до зростання та змін",
      careers: "Інженер, архітектор, бухгалтер, менеджер, фермер, банкір, науковець, підрядник",
      relationships: "Забезпечує стабільність та безпеку, вірний партнер, цінує довгострокові зобов'язання",
      spiritualPath: "Навчитися, що справжня безпека приходить зсередини, будувати мости між матеріальним та духовним світами",
      compatibility: "Сильно з 2, 6 та 8. Виклики з 3 та 5 (різні життєві підходи)"
    },
    5: {
      title: "Шукач свободи",
      traits: "Авантюрний, цікавий, універсальний, прогресивний, любить свободу",
      strengths: "Швидкодумний, адаптивний, магнетична особистість, інноваційний, любить подорожі, універсальний",
      challenges: "Може бути неспокійним, безвідповідальним, розсіяним або схильним до залежностей. Може мати труднощі з зобов'язаннями",
      lifeTheme: "Переживати свободу та різноманітність, навчаючись відповідальності та фокусу",
      careers: "Гід-мандрівник, журналіст, пілот, маркетинг, продажі, детектив, артист, підприємець",
      relationships: "Потребує свободи та різноманітності, захоплюючий партнер, може мати труднощі з рутиною або володінням",
      spiritualPath: "Знаходити свободу через дисципліну, використовувати досвід для здобуття мудрості та допомоги іншим у зростанні",
      compatibility: "Захоплююче з 1, 3 та 7. Виклики з 2 та 4 (різні потреби в стабільності)"
    },
    6: {
      title: "Турботливий",
      traits: "Турботливий, відповідальний, орієнтований на сім'ю, цілющий, захисний",
      strengths: "Природний цілитель, співчутливий, відповідальний, артистичний, домашній, громадський",
      challenges: "Може бути надзахисним, мученицьким, втручальним або надмірно відповідальним за інших",
      lifeTheme: "Служити та піклуватися про інших, навчаючись встановлювати здорові межі",
      careers: "Вчитель, медсестра, лікар, консультант, художник, шеф-кухар, соціальний працівник, дизайнер інтер'єру",
      relationships: "Глибоко піклується про партнерів, створює теплий дім, може бути надзахисним",
      spiritualPath: "Навчитися любити без контролю, знаходити баланс між служінням іншим та самоглядом",
      compatibility: "Природна гармонія з 2, 3 та 9. Виклики з 1 та 5 (різні потреби в незалежності)"
    },
    7: {
      title: "Мислитель",
      traits: "Аналітичний, духовний, інтроспективний, мудрий, містичний",
      strengths: "Глибокий мислитель, дослідник істини, інтуїтивний, філософський, незалежний, проникливий",
      challenges: "Може бути відчуженим, надмірно критичним, песимістичним або нетовариським. Може уникати емоційного зв'язку",
      lifeTheme: "Шукати істину та мудрість, навчаючись ділитися знаннями з іншими",
      careers: "Дослідник, науковець, філософ, письменник, психолог, духовний учитель, аналітик, археолог",
      relationships: "Потребує глибокого розуміння, може здаватися відстороненим, цінує інтелектуальний зв'язок",
      spiritualPath: "Поєднання інтелектуального пошуку з духовною мудрістю, навчання довіри та відкритості",
      compatibility: "Глибокий зв'язок з 4, 5 та 9. Виклики з 2 та 6 (різні емоційні потреби)"
    },
    8: {
      title: "Досягальник",
      traits: "Амбіційний, матеріально успішний, організований, владний, цілеспрямований",
      strengths: "Природний організатор, фінансово обдарований, ефективний, авторитетний, справедливий, сильний",
      challenges: "Може бути матеріалістичним, контролюючим, нетерплячим або надмірно агресивним. Може нехтувати духовними потребами",
      lifeTheme: "Досягати матеріального успіху, навчаючись використовувати владу мудро та справедливо",
      careers: "Керівник, фінансист, банкір, юрист, суддя, хірург, політик, великий бізнесмен",
      relationships: "Приваблює успішних партнерів, може бути домінуючим, потребує поваги та адміралтейства",
      spiritualPath: "Навчитися, що справжня влада приходить від служіння вищому добру, балансувати матеріальні та духовні цілі",
      compatibility: "Потужне партнерство з 1, 2 та 4. Виклики з 3 та 7 (різні життєві пріоритети)"
    },
    9: {
      title: "Гуманітарій",
      traits: "Співчутливий, всесвітньо свідомий, щедрий, артистичний, ідеалістичний",
      strengths: "Природний учитель, універсально любляче серце, мудрий, творчий, надихаючий, толерантний",
      challenges: "Може бути надто ідеалістичним, мартирським, нетерплячим або розчарованим в людях. Може мати труднощі з практичними справами",
      lifeTheme: "Служити людству та сприяти універсальній любові, навчаючись відпускати та прощати",
      careers: "Вчитель, художник, цілитель, соціальний працівник, філософ, письменник, духовний лідер, благодійник",
      relationships: "Любить глибоко та безумовно, може притягувати людей, які потребують допомоги, потребує духовного зв'язку",
      spiritualPath: "Втілення безумовної любові, навчання відпускати очікування та знаходити мир у служінні",
      compatibility: "Універсальна любов з усіма числами, особливо з 1, 6 та 7. Може мати труднощі з 4 та 8 (різні підходи до служіння)"
    },
    11: {
      title: "Духовний посланник",
      traits: "Інтуїтивний, надихаючий, ідеалістичний, духовно орієнтований, чутливий",
      strengths: "Потужна інтуїція, природний цілитель, надихаючий учитель, візіонерський, психічно обдарований",
      challenges: "Може бути надчутливим, нервозним, непрактичним або надмірно ідеалістичним. Схильний до перепадів настрою",
      lifeTheme: "Служити як духовний маяк та надихати інших до вищого розуміння",
      careers: "Духовний учитель, цілитель, психолог, художник, письменник, винахідник, реформатор",
      relationships: "Потребує глибокого духовного зв'язку, може бути інтенсивним, прагне зрозуміння",
      spiritualPath: "Бути мостом між духовним та матеріальним світами, навчитися заземлюватися, служачи вищому",
      compatibility: "Духовний зв'язок з 2, 6 та 9. Потребує розуміння від усіх партнерів"
    },
    22: {
      title: "Майстер-будівельник",
      traits: "Візіонерський, практичний, потужний, організований, амбіційний",
      strengths: "Здатність втілювати великі мрії в реальність, природний лідер, практичний ідеаліст, організаторські таланти",
      challenges: "Може відчувати величезний тиск, схильний до стресу, може бути надмірно критичним до себе та інших",
      lifeTheme: "Будувати щось значуще та довговічне, що принесе користь людству",
      careers: "Архітектор, інженер, політичний лідер, великий підприємець, соціальний реформатор, будівельник інституцій",
      relationships: "Потребує партнера, який розуміє їхні великі амбіції, може бути поглинутим роботою",
      spiritualPath: "Використання практичних навичок для створення духовного прогресу в світі, баланс між амбіціями та служінням",
      compatibility: "Могутнє партнерство з 4, 6 та 8. Потребує підтримки від усіх партнерів"
    }
  };

  function calculateLifePath(month, day, year) {
    // Simple digit sum reduction
    function reduceToSingleDigit(num) {
      while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        let sum = 0;
        while (num > 0) {
          sum += num % 10;
          num = Math.floor(num / 10);
        }
        num = sum;
      }
      return num;
    }

    const monthSum = reduceToSingleDigit(month);
    const daySum = reduceToSingleDigit(day);
    const yearSum = reduceToSingleDigit(year);
    
    const total = monthSum + daySum + yearSum;
    return reduceToSingleDigit(total);
  }

  function formatCompatibility(compatibility) {
    if (!compatibility) return '';
    
    return compatibility.replace(/\d+/g, (match) => {
      const num = parseInt(match);
      if (lifePathData[num]) {
        return `<span style="font-weight: bold; color: #007bff;" title="${lifePathData[num].title}">${num}</span>`;
      }
      return match;
    });
  }

  if (form && result) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.fullName?.value.trim() || "Ви";
      const month = parseInt(form.birthMonth?.value);
      const day = parseInt(form.birthDay?.value);
      const year = parseInt(form.birthYear?.value);

      if (!month || !day || !year) {
        result.innerHTML = '<div class="error">Будь ласка, введіть повну дату народження.</div>';
        return;
      }

      if (year < 1900 || year > new Date().getFullYear()) {
        result.innerHTML = '<div class="error">Будь ласка, введіть правильний рік народження.</div>';
        return;
      }

      const lifePathNumber = calculateLifePath(month, day, year);
      const data = lifePathData[lifePathNumber];

      if (!data) {
        result.innerHTML = '<div class="error">Не вдалося розрахувати число життєвого шляху.</div>';
        return;
      }

      const birthDate = new Date(year, month - 1, day);
      const monthNames = [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
      ];

      result.innerHTML = `
        <div class="insight-card">
          <h3 style="text-align: center; margin-bottom: 1.5rem; color: #2c3e50;">
            🔢 Ваш нумерологічний профіль
          </h3>
          
          <div style="text-align: center; margin: 1rem 0;">
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
              ${name} • ${day} ${monthNames[month - 1]} ${year}
            </div>
            
            <div style="display: inline-block; padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 50%; margin: 1rem 0;">
              <div style="font-size: 3rem; font-weight: bold; line-height: 1;">
                ${lifePathNumber}
              </div>
            </div>
            
            <h4 style="margin: 1rem 0 0.5rem 0; color: #495057; font-size: 1.5rem;">
              ${data.title}
            </h4>
            <div style="color: #6c757d; font-style: italic;">
              Число життєвого шляху
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">✨ Основні риси характеру</h4>
          <p style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 0; line-height: 1.6;">
            ${data.traits}
          </p>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #28a745;">💪 Сильні сторони</h4>
          <p style="background: #d4edda; padding: 1rem; border-radius: 8px; margin: 0; line-height: 1.6; color: #155724;">
            ${data.strengths}
          </p>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #ffc107;">⚡ Виклики для розвитку</h4>
          <p style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin: 0; line-height: 1.6; color: #856404;">
            ${data.challenges}
          </p>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #17a2b8;">🎯 Життєва тема</h4>
          <p style="background: #d1ecf1; padding: 1rem; border-radius: 8px; margin: 0; line-height: 1.6; color: #0c5460;">
            ${data.lifeTheme}
          </p>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">💼 Підходящі професії</h4>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; line-height: 1.6;">
            ${data.careers}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">❤️ Стосунки та любов</h4>
          <div style="background: #fdf2f8; padding: 1rem; border-radius: 8px; line-height: 1.6; color: #831843;">
            ${data.relationships}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">🙏 Духовний шлях</h4>
          <div style="background: #f3e8ff; padding: 1rem; border-radius: 8px; line-height: 1.6; color: #581c87;">
            ${data.spiritualPath}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">🤝 Сумісність з іншими числами</h4>
          <div style="background: #ecfdf5; padding: 1rem; border-radius: 8px; line-height: 1.6; color: #047857;">
            ${formatCompatibility(data.compatibility)}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">💡 Поради для особистісного зростання</h4>
          
          <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: #e0f2fe; border-radius: 8px; border-left: 4px solid #0277bd;">
              <strong style="color: #01579b;">🧘 Медитація та саморефлексія</strong><br>
              <small style="color: #0277bd;">
                Регулярно приділяйте час для внутрішнього аналізу та розуміння своїх справжніх потреб.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #f3e5f5; border-radius: 8px; border-left: 4px solid #7b1fa2;">
              <strong style="color: #4a148c;">📚 Безперервне навчання</strong><br>
              <small style="color: #7b1fa2;">
                Розвивайте свої природні таланти через навчання та практику нових навичок.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #fff3e0; border-radius: 8px; border-left: 4px solid #f57c00;">
              <strong style="color: #e65100;">⚖️ Баланс</strong><br>
              <small style="color: #f57c00;">
                Знаходьте рівновагу між своїми сильними сторонами та областями для розвитку.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #388e3c;">
              <strong style="color: #1b5e20;">🤝 Стосунки</strong><br>
              <small style="color: #388e3c;">
                Розвивайте здорові стосунки, розуміючи свої потреби та потреби інших.
              </small>
            </div>
          </div>
        </div>

        <div class="insight-card" style="background: #f8f9fa; border-left: 4px solid #6c757d;">
          <p style="margin: 0; font-size: 0.9rem; color: #6c757d; font-style: italic;">
            <strong>Примітка:</strong> Нумерологія є древньою практикою самопізнання. Використовуйте ці інсайти як керівництво для особистісного зростання та саморозуміння. Пам'ятайте, що ви маєте силу формувати свою долю через свідомі вибори та дії.
          </p>
        </div>
      `;
    });
  }
});