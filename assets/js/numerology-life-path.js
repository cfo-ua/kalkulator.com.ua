document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("numerology-form");
  const result = document.getElementById("numerology-result");
  const monthSelect = document.getElementById("birthMonth");
  const daySelect = document.getElementById("birthDay");
  const yearInput = document.getElementById("birthYear");

  // Populate day dropdown
  function populateDays() {
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
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value) || new Date().getFullYear();
    
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

  // Life path number data in Ukrainian
  const lifePathData = {
    1: {
      title: "Лідер",
      traits: "Незалежний, новаторський, амбітний, оригінальний, впевнений",
      strengths: "Природні лідерські здібності, інноваційність, рішучість, самостійність, сміливість брати ініціативу",
      challenges: "Може бути занадто агресивним, нетерплячим, егоцентричним або владним. Може мати труднощі з командною роботою",
      lifeTheme: "Розвивати незалежність та лідерство, навчаючись працювати з іншими",
      careers: "Підприємець, керівник, винахідник, політик, художник, архітектор, військовий лідер",
      relationships: "Приваблює людей, які цінують силу та незалежність. Найкраще з партнерами, які можуть витримати сильну особистість",
      spiritualPath: "Навчання балансувати особисті досягнення зі служінням іншим, розвиваючи смиренність при збереженні впевненості",
      compatibility: "Добре працює з 2, 8 та 9. Виклики з 1 та 8 (боротьба за владу)"
    },
    2: {
      title: "Дипломат",
      traits: "Кооперативний, чутливий, дипломатичний, терплячий, підтримуючий",
      strengths: "Відмінний посередник, командний гравець, інтуїтивний, ніжний, миротворець, уважний до деталей",
      challenges: "Може бути надчутливим, нерішучим, залежним від інших або занадто емоційним. Може бракувати впевненості",
      lifeTheme: "Розвивати співпрацю та гармонію, зберігаючи особистість",
      careers: "Консультант, дипломат, вчитель, музикант, художник, бухгалтер, медсестра, соціальний працівник",
      relationships: "Процвітає в партнерствах, глибоко лояльний, шукає гармонії. Найкраще з розуміючими та підтримуючими партнерами",
      spiritualPath: "Навчання служити іншим, поважаючи власні потреби, розвиваючи внутрішню силу через ніжність",
      compatibility: "Природна гармонія з 1, 6 та 8. Виклики з 5 та 7 (різні темпи)"
    },
    3: {
      title: "Творець",
      traits: "Артистичний, експресивний, оптимістичний, надихаючий, розважальний",
      strengths: "Творчий геній, відмінний комунікатор, піднесений, творчий, харизматичний, універсальний",
      challenges: "Може бути розсіяним, поверхневим, мінливим або занадто критичним. Може мати труднощі з фокусом та дисципліною",
      lifeTheme: "Виражати творчість та надихати інших, розвиваючи емоційну глибину",
      careers: "Художник, письменник, виконавець, вчитель, дизайнер, фотограф, комік, продавець",
      relationships: "Приносить радість та творчість у стосунки, потребує оцінки своєї унікальності",
      spiritualPath: "Використання творчих дарів для піднесення людства, навчання виражати справжні емоції за межами поверхневого щастя",
      compatibility: "Гармонійно з 1, 5 та 6. Виклики з 4 та 8 (різні підходи до життя)"
    },
    4: {
      title: "Будівничий",
      traits: "Практичний, стабільний, працьовитий, надійний, методичний",
      strengths: "Відмінний організатор, надійний, наполегливий, систематичний, чесний, лояльний",
      challenges: "Може бути ригідним, упертим, занадто серйозним або вузькоглядним. Може опиратися змінам",
      lifeTheme: "Будувати міцні основи, залишаючись відкритим до зростання та змін",
      careers: "Інженер, архітектор, бухгалтер, менеджер, фермер, банкір, науковець, підрядник",
      relationships: "Забезпечує стабільність та безпеку, лояльний партнер, цінує довготривалі зобов'язання",
      spiritualPath: "Навчання того, що справжня безпека походить зсередини, будуючи мости між матеріальним та духовним світами",
      compatibility: "Сильний з 2, 6 та 8. Виклики з 3 та 5 (різні життєві підходи)"
    },
    5: {
      title: "Шукач свободи",
      traits: "Пригодницький, цікавий, універсальний, прогресивний, свободолюбний",
      strengths: "Швидкодумний, адаптивний, магнетична особистість, інноваційний, любить подорожі, універсальний",
      challenges: "Може бути неспокійним, безвідповідальним, розсіяним або схильним до залежностей. Може мати труднощі з зобов'язаннями",
      lifeTheme: "Відчувати свободу та різноманітність, навчаючись відповідальності та фокусу",
      careers: "Туристичний гід, журналіст, пілот, маркетинг, продажі, детектив, артист, підприємець",
      relationships: "Потребує свободи та різноманітності, захоплюючий партнер, може мати труднощі з рутиною або ревнощами",
      spiritualPath: "Знаходження свободи через дисципліну, використання досвіду для здобуття мудрості та допомоги іншим рости",
      compatibility: "Захоплююче з 1, 3 та 7. Виклики з 2 та 4 (різні потреби в стабільності)"
    },
    6: {
      title: "Піклувальник",
      traits: "Турботливий, відповідальний, сімейний, цілющий, захисний",
      strengths: "Природний цілитель, співчутливий, відповідальний, артистичний, домашній, громадсько-орієнтований",
      challenges: "Може бути надзахисним, жертовним, втручальним або занадто відповідальним за інших",
      lifeTheme: "Піклуватися та зцілювати, зберігаючи здорові межі",
      careers: "Лікар, медсестра, вчитель, консультант, ветеринар, кухар, дизайнер інтер'єрів, соціальний працівник",
      relationships: "Відданий сімейна людина, піклувальний партнер, створює тепле та любляче домашнє середовище",
      spiritualPath: "Навчання безумовної любові, уникаючи співзалежності, зцілюючи інших через власну цілісність",
      compatibility: "Природна відповідність з 2, 3 та 9. Виклики з 1 та 5 (різні пріоритети)"
    },
    7: {
      title: "Шукач",
      traits: "Духовний, аналітичний, самоаналізуючий, таємничий, мудрий",
      strengths: "Глибокий мислитель, інтуїтивний, духовний, дослідник, перфекціоніст, незалежний",
      challenges: "Може бути відчуженим, занадто критичним, песимістичним або ізольованим. Може мати труднощі з емоціями",
      lifeTheme: "Шукати істину та мудрість, залишаючись пов'язаним зі світом",
      careers: "Дослідник, науковець, філософ, вчитель, аналітик, слідчий, письменник, містик",
      relationships: "Потребує розуміючого партнера, цінує ментальний зв'язок, потребує особистого часу",
      spiritualPath: "Сполучення духовного та матеріального світів, поділ мудрості, здобутої через внутрішнє дослідження",
      compatibility: "Глибокий зв'язок з 5 та 9. Виклики з 2 та 6 (різні емоційні потреби)"
    },
    8: {
      title: "Досягальник",
      traits: "Амбітний, матеріальний успіх, авторитетний, ефективний, могутній",
      strengths: "Природний керівник, цілеспрямований, відмінний судія характеру, наполегливий, практичний",
      challenges: "Може бути матеріалістичним, трудоголіком, владним або нетерплячим. Може нехтувати стосунками",
      lifeTheme: "Досягати матеріального успіху, зберігаючи духовні цінності та стосунки",
      careers: "Бізнес-керівник, банкір, нерухомість, юрист, суддя, хірург, підрядник, політик",
      relationships: "Забезпечує безпеку та статус, потребує поваги, може віддавати пріоритет кар'єрі над стосунками",
      spiritualPath: "Навчання того, що справжня сила походить від служіння, використання матеріального успіху на благо людства",
      compatibility: "Потужна комбінація з 2, 4 та 6. Виклики з 1 та 8 (конфлікти влади)"
    },
    9: {
      title: "Гуманітарій",
      traits: "Співчутливий, щедрий, мудрий, артистичний, універсальна любов",
      strengths: "Гуманітарій, щедрий, артистичний, мудрий, толерантний, широка перспектива",
      challenges: "Може бути емоційно відстороненим, непрактичним, мінливим або занадто ідеалістичним",
      lifeTheme: "Служити людству та ділитися мудрістю, піклуючись про особисті потреби",
      careers: "Вчитель, цілитель, художник, філантроп, консультант, гуманітарний працівник, духовний лідер",
      relationships: "Люблячий та щедрий, може ставити людство перед особистими стосунками",
      spiritualPath: "Втілення безумовної любові, завершення циклу людського досвіду та мудрості",
      compatibility: "Універсальна любов з 6 та 7. Виклики з 1 та 5 (різні фокуси)"
    },
    11: {
      title: "Майстер інтуїції",
      traits: "Духовне прозріння, натхнення, психічні здібності, висока чутливість",
      strengths: "Інтуїтивний, надихаючий, духовний вчитель, візіонер, психічні здібності, високо творчий",
      challenges: "Надчутливий, нервовий, непрактичний або розсіяний. Може мати труднощі з заземленням енергії",
      lifeTheme: "Надихати та просвічувати інших, навчаючись заземлювати духовні прозріння",
      careers: "Духовний вчитель, художник, консультант, цілитель, винахідник, музикант, письменник, екстрасенс",
      relationships: "Потребує розуміючого партнера, який підтримує їх духовний шлях, високо романтичний",
      spiritualPath: "Каналування божественного натхнення для допомоги людству еволюціонувати, сполучення неба та землі",
      compatibility: "Духовний зв'язок з 2, 6 та іншими майстер числами. Потребує терплячих, заземлюючих партнерів"
    },
    22: {
      title: "Майстер будівничий",
      traits: "Практичний візіонер, великомасштабний вплив, матеріальне майстерність з духовною метою",
      strengths: "Будує мрії в реальність, практичний візіонер, природний лідер, систематичний, високі досягнення",
      challenges: "Величезний тиск, може стати перевантаженим, схильність до трудоголізму, високі очікування",
      lifeTheme: "Будувати щось цінне, що служить людству",
      careers: "Архітектор, міський планувальник, міжнародний бізнес, політик, лідер великої організації, винахідник",
      relationships: "Потребує підтримуючого партнера, який розуміє їх місію, може віддавати пріоритет роботі",
      spiritualPath: "Втілення духовних візій у матеріальному світі, залишення тривалої позитивної спадщини",
      compatibility: "Потужний з 4, 8 та іншими майстер числами. Потребує заземлюючих та розуміючих партнерів"
    },
    33: {
      title: "Майстер вчитель",
      traits: "Духовне керівництво, зцілення, навчання, співчутливе служіння",
      strengths: "Майстер вчитель, цілитель, співчутливий лідер, духовне керівництво, безумовна любов",
      challenges: "Крайня чутливість, може жертвувати занадто багато, переважуюча відповідальність за інших",
      lifeTheme: "Навчати та зцілювати через приклад безумовної любові",
      careers: "Духовний вчитель, цілитель, консультант, гуманітарний лідер, художник, гід, терапевт",
      relationships: "Любить безумовно, може приваблювати людей, які потребують зцілення, потребує розуміючого партнера",
      spiritualPath: "Втілення Христоподібної свідомості, навчання через любов та приклад",
      compatibility: "Гармонійний з 6, 9 та іншими майстер числами. Потребує емоційно зрілих партнерів"
    }
  };

  // Calculate life path number
  function calculateLifePath(month, day, year) {
    // Add all digits
    let sum = 0;
    
    // Add month digits
    while (month > 0) {
      sum += month % 10;
      month = Math.floor(month / 10);
    }
    
    // Add day digits
    while (day > 0) {
      sum += day % 10;
      day = Math.floor(day / 10);
    }
    
    // Add year digits
    while (year > 0) {
      sum += year % 10;
      year = Math.floor(year / 10);
    }
    
    // Reduce to single digit or master number
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      let newSum = 0;
      while (sum > 0) {
        newSum += sum % 10;
        sum = Math.floor(sum / 10);
      }
      sum = newSum;
    }
    
    return sum;
  }

  monthSelect.addEventListener("change", updateDays);
  yearInput.addEventListener("input", updateDays);

  // Initialize days
  populateDays();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const month = parseInt(monthSelect.value);
    const day = parseInt(daySelect.value);
    const year = parseInt(yearInput.value);

    if (!month || !day || !year) {
      result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, введіть повну дату народження.</p>';
      return;
    }

    if (year < 1900 || year > 2030) {
      result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, введіть дійсний рік народження.</p>';
      return;
    }

    // Validate date
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
      result.innerHTML = '<p style="color: #e74c3c;">Будь ласка, введіть дійсну дату.</p>';
      return;
    }

    const lifePathNumber = calculateLifePath(month, day, year);
    const data = lifePathData[lifePathNumber];

    const monthNames = [
      "січня", "лютого", "березня", "квітня", "травня", "червня",
      "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];

    const birthDateString = `${day} ${monthNames[month - 1]} ${year} року`;

    result.innerHTML = `
      <div class="insight-card" style="background: linear-gradient(135deg, #8B5FBF 0%, #6A4C93 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; font-size: 1.8em;">Ваше число життєвого шляху</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px;">${lifePathNumber}</div>
        <div style="font-size: 1.4em; margin-bottom: 10px;">${data.title}</div>
        <p style="margin: 0; opacity: 0.9;">Дата народження: ${birthDateString}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div class="insight-card" style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
          <h4 style="margin: 0 0 10px 0; color: #28a745;">Основні риси</h4>
          <p style="margin: 0; line-height: 1.6;">${data.traits}</p>
        </div>
        
        <div class="insight-card" style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff;">
          <h4 style="margin: 0 0 10px 0; color: #007bff;">Життєва тема</h4>
          <p style="margin: 0; line-height: 1.6;">${data.lifeTheme}</p>
        </div>
      </div>

      <div class="insight-card" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #2c3e50;">🌟 Сильні сторони</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${data.strengths}</p>
      </div>

      <div class="insight-card" style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">⚠️ Життєві виклики</h4>
        <p style="margin: 0; line-height: 1.6; color: #6c757d;">${data.challenges}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div class="insight-card" style="background: #e7f3ff; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff;">
          <h4 style="margin: 0 0 10px 0; color: #007bff;">💼 Кар'єрні шляхи</h4>
          <p style="margin: 0; line-height: 1.6; font-size: 0.95em;">${data.careers}</p>
        </div>
        
        <div class="insight-card" style="background: #f0f8ff; padding: 20px; border-radius: 10px; border-left: 4px solid #6f42c1;">
          <h4 style="margin: 0 0 10px 0; color: #6f42c1;">💝 Сумісність</h4>
          <p style="margin: 0; line-height: 1.6; font-size: 0.95em;">${data.compatibility}</p>
        </div>
      </div>

      <div class="insight-card" style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💕 Стосунки</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${data.relationships}</p>
      </div>

      <div class="insight-card" style="background: #f8f0ff; padding: 20px; border-radius: 10px; border-left: 4px solid #8B5FBF; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #6A4C93;">🔮 Духовний шлях</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${data.spiritualPath}</p>
      </div>

      <div class="insight-card" style="background: #e1ecf4; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>💡 Ваше число життєвого шляху надає інсайти про ваші природні схильності та життєву мету. Пам'ятайте, що у вас є свобода волі рости за межі будь-яких обмежень та виражати найвищі якості вашого числа. Використовуйте це керівництво для самопізнання та особистісного розвитку.</em>
        </p>
      </div>
    `;
  });
});