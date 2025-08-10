document.addEventListener("DOMContentLoaded", function () {
  const formulaCollection = document.getElementById('formula-collection');
  const searchInput = document.getElementById('formula-search');
  const categoryFilter = document.getElementById('category-filter');
  const totalFormulasSpan = document.getElementById('total-formulas');
  const filteredFormulasSpan = document.getElementById('filtered-formulas');
  const copiedFormulasSpan = document.getElementById('copied-formulas');
  
  let copiedCount = 0;
  
  // Top 50 Excel/Google Sheets formulas data
  const formulaData = {
    math: {
      title: "🔢 Математичні функції",
      formulas: [
        {
          name: "SUM",
          syntax: "=SUM(число1; [число2]; ...)",
          description: "Додає всі числа в діапазоні комірок",
          example: "=SUM(A1:A10)",
          exampleResult: "Сума чисел з A1 до A10",
          usage: "Підрахунок загальної суми продажів, витрат, балів",
          tips: "Можна використовувати кілька діапазонів: =SUM(A1:A5;C1:C5)",
          keywords: ["сума", "додавання", "загальна сума", "підсумок"]
        },
        {
          name: "AVERAGE",
          syntax: "=AVERAGE(число1; [число2]; ...)",
          description: "Обчислює середнє арифметичне чисел",
          example: "=AVERAGE(B1:B20)",
          exampleResult: "Середнє значення з B1 до B20",
          usage: "Середня оцінка, середня зарплата, середня ціна",
          tips: "Ігнорує текстові значення та порожні комірки",
          keywords: ["середнє", "арифметичне", "середня оцінка", "середня ціна"]
        },
        {
          name: "COUNT",
          syntax: "=COUNT(значення1; [значення2]; ...)",
          description: "Підраховує кількість комірок з числами",
          example: "=COUNT(A1:A100)",
          exampleResult: "Кількість числових значень в діапазоні",
          usage: "Підрахунок кількості заповнених записів, оцінок",
          tips: "Для підрахунку всіх непорожніх комірок використовуйте COUNTA",
          keywords: ["підрахунок", "кількість", "числа", "записи"]
        },
        {
          name: "MAX",
          syntax: "=MAX(число1; [число2]; ...)",
          description: "Знаходить найбільше значення",
          example: "=MAX(C1:C50)",
          exampleResult: "Максимальне значення з діапазону",
          usage: "Найвищий бал, максимальна температура, найбільший прибуток",
          tips: "Ігнорує текст та логічні значення",
          keywords: ["максимум", "найбільше", "найвище", "max"]
        },
        {
          name: "MIN",
          syntax: "=MIN(число1; [число2]; ...)",
          description: "Знаходить найменше значення",
          example: "=MIN(D1:D30)",
          exampleResult: "Мінімальне значення з діапазону",
          usage: "Найнижчий бал, мінімальна температура, найменші витрати",
          tips: "Корисно для аналізу ризиків та контролю мінімумів",
          keywords: ["мінімум", "найменше", "найнижче", "min"]
        },
        {
          name: "ROUND",
          syntax: "=ROUND(число; кількість_розрядів)",
          description: "Округлює число до вказаної кількості розрядів",
          example: "=ROUND(3.14159; 2)",
          exampleResult: "3.14",
          usage: "Округлення цін, процентів, результатів розрахунків",
          tips: "Використовуйте ROUNDUP для округлення вгору, ROUNDDOWN - вниз",
          keywords: ["округлення", "точність", "розряди", "ціни"]
        }
      ]
    },
    lookup: {
      title: "🔍 Функції пошуку",
      formulas: [
        {
          name: "VLOOKUP",
          syntax: "=VLOOKUP(шукане_значення; таблиця; номер_стовпця; [точний_збіг])",
          description: "Шукає значення у першому стовпці та повертає значення з іншого стовпця",
          example: "=VLOOKUP(A2; $D$2:$F$100; 3; FALSE)",
          exampleResult: "Знаходить A2 в таблиці D2:F100 і повертає значення з 3-го стовпця",
          usage: "Пошук ціни товару, зарплати співробітника, коду клієнта",
          tips: "FALSE = точний збіг, TRUE = приблизний збіг. Таблиця має бути відсортована для TRUE",
          keywords: ["пошук", "таблиця", "співставлення", "база даних"]
        },
        {
          name: "HLOOKUP", 
          syntax: "=HLOOKUP(шукане_значення; таблиця; номер_рядка; [точний_збіг])",
          description: "Шукає значення у першому рядку та повертає значення з іншого рядка",
          example: "=HLOOKUP(B1; $A$5:$Z$10; 3; FALSE)",
          exampleResult: "Горизонтальний пошук по таблиці",
          usage: "Пошук даних у горизонтальних таблицях, календарях",
          tips: "Аналог VLOOKUP для горизонтально орієнтованих таблиць",
          keywords: ["горизонтальний пошук", "рядки", "календар"]
        },
        {
          name: "INDEX",
          syntax: "=INDEX(масив; номер_рядка; [номер_стовпця])",
          description: "Повертає значення з масиву за вказаними координатами",
          example: "=INDEX(A1:C10; 5; 2)",
          exampleResult: "Значення з 5-го рядка, 2-го стовпця діапазону A1:C10",
          usage: "Гнучкий пошук даних, комбінується з MATCH",
          tips: "Потужніший за VLOOKUP, може шукати ліворуч від пошукового стовпця",
          keywords: ["індекс", "координати", "гнучкий пошук"]
        },
        {
          name: "MATCH",
          syntax: "=MATCH(шукане_значення; пошуковий_масив; [тип_збігу])",
          description: "Знаходить позицію елемента в масиві",
          example: "=MATCH(\"Яблуко\"; A1:A20; 0)",
          exampleResult: "Номер позиції де знайдено \"Яблуко\"",
          usage: "Визначення позиції елемента, комбінується з INDEX",
          tips: "0 = точний збіг, 1 = найбільший ≤, -1 = найменший ≥",
          keywords: ["позиція", "номер", "знаходження", "збіг"]
        },
        {
          name: "XLOOKUP",
          syntax: "=XLOOKUP(шукане_значення; пошуковий_масив; масив_повернення; [якщо_не_знайдено])",
          description: "Сучасна альтернатива VLOOKUP з більшими можливостями",
          example: "=XLOOKUP(E2; A:A; B:B; \"Не знайдено\")",
          exampleResult: "Шукає E2 в стовпці A, повертає відповідне значення з B",
          usage: "Універсальний пошук у будь-якому напрямку",
          tips: "Доступна у новіших версіях Excel та Google Sheets",
          keywords: ["новий пошук", "універсальний", "сучасний"]
        }
      ]
    },
    logical: {
      title: "🧮 Логічні функції",
      formulas: [
        {
          name: "IF",
          syntax: "=IF(логічна_перевірка; значення_якщо_істина; значення_якщо_хибність)",
          description: "Перевіряє умову та повертає різні значення",
          example: "=IF(A1>100; \"Високий\"; \"Низький\")",
          exampleResult: "\"Високий\" якщо A1>100, інакше \"Низький\"",
          usage: "Категоризація даних, перевірка умов, розрахунок бонусів",
          tips: "Можна вкладати декілька IF для складних умов",
          keywords: ["умова", "якщо", "перевірка", "логіка"]
        },
        {
          name: "AND",
          syntax: "=AND(логічне1; [логічне2]; ...)",
          description: "Повертає TRUE, якщо всі умови виконуються",
          example: "=AND(A1>0; A1<100)",
          exampleResult: "TRUE якщо A1 між 0 і 100",
          usage: "Перевірка множинних умов одночасно",
          tips: "Часто використовується всередині функції IF",
          keywords: ["і", "всі умови", "множинна перевірка"]
        },
        {
          name: "OR",
          syntax: "=OR(логічне1; [логічне2]; ...)",
          description: "Повертає TRUE, якщо хоча б одна умова виконується",
          example: "=OR(A1=\"Так\"; A1=\"Yes\")",
          exampleResult: "TRUE якщо A1 дорівнює \"Так\" або \"Yes\"",
          usage: "Перевірка альтернативних умов",
          tips: "Корисно для перевірки декількох варіантів",
          keywords: ["або", "хоча б одна", "альтернатива"]
        },
        {
          name: "NOT",
          syntax: "=NOT(логічне)",
          description: "Змінює логічне значення на протилежне",
          example: "=NOT(A1=\"\")",
          exampleResult: "TRUE якщо A1 не порожня",
          usage: "Інверсія логічних значень",
          tips: "Часто використовується для перевірки \"не дорівнює\"",
          keywords: ["не", "протилежне", "інверсія"]
        },
        {
          name: "IFERROR",
          syntax: "=IFERROR(значення; значення_при_помилці)",
          description: "Перехоплює помилки та повертає альтернативне значення",
          example: "=IFERROR(A1/B1; 0)",
          exampleResult: "Результат ділення або 0 при помилці (ділення на нуль)",
          usage: "Обробка помилок у формулах, уникнення #DIV/0!",
          tips: "Робить таблицю більш професійною, приховуючи помилки",
          keywords: ["помилка", "обробка", "захист", "альтернатива"]
        },
        {
          name: "IFS",
          syntax: "=IFS(логічна_перевірка1; значення1; [логічна_перевірка2; значення2]; ...)",
          description: "Перевіряє множинні умови без вкладених IF",
          example: "=IFS(A1>=90; \"Відмінно\"; A1>=70; \"Добре\"; A1>=50; \"Задовільно\")",
          exampleResult: "Оцінка залежно від балу",
          usage: "Складна категоризація з множинними умовами",
          tips: "Альтернатива складним вкладеним IF",
          keywords: ["множинні умови", "категорії", "оцінки"]
        }
      ]
    },
    text: {
      title: "📝 Текстові функції",
      formulas: [
        {
          name: "CONCATENATE",
          syntax: "=CONCATENATE(текст1; [текст2]; ...)",
          description: "Об'єднує декілька текстових рядків",
          example: "=CONCATENATE(A1; \" \"; B1)",
          exampleResult: "Об'єднує ім'я та прізвище з пробілом",
          usage: "Створення повних імен, адрес, ідентифікаторів",
          tips: "У новіших версіях можна використовувати оператор &",
          keywords: ["об'єднання", "склеювання", "конкатенація", "текст"]
        },
        {
          name: "LEFT",
          syntax: "=LEFT(текст; [кількість_символів])",
          description: "Витягує символи з початку рядка",
          example: "=LEFT(A1; 3)",
          exampleResult: "Перші 3 символи з комірки A1",
          usage: "Витягування коду, префіксу, першої частини номера",
          tips: "За замовчуванням повертає 1 символ",
          keywords: ["початок", "ліві символи", "префікс", "код"]
        },
        {
          name: "RIGHT",
          syntax: "=RIGHT(текст; [кількість_символів])",
          description: "Витягує символи з кінця рядка",
          example: "=RIGHT(A1; 4)",
          exampleResult: "Останні 4 символи з комірки A1",
          usage: "Витягування розширення файлу, суфіксу, останньої частини",
          tips: "Корисно для роботи з файлами та номерами",
          keywords: ["кінець", "праві символи", "суфікс", "розширення"]
        },
        {
          name: "MID",
          syntax: "=MID(текст; початкова_позиція; кількість_символів)",
          description: "Витягує символи з середини рядка",
          example: "=MID(A1; 3; 5)",
          exampleResult: "5 символів починаючи з 3-ї позиції",
          usage: "Витягування середньої частини номера, коду",
          tips: "Позиція починається з 1, а не з 0",
          keywords: ["середина", "підрядок", "частина", "символи"]
        },
        {
          name: "LEN",
          syntax: "=LEN(текст)",
          description: "Повертає кількість символів у тексті",
          example: "=LEN(A1)",
          exampleResult: "Кількість символів в A1",
          usage: "Перевірка довжини пароля, тексту, валідація",
          tips: "Враховує пробіли та спеціальні символи",
          keywords: ["довжина", "кількість символів", "розмір"]
        },
        {
          name: "TRIM",
          syntax: "=TRIM(текст)",
          description: "Видаляє зайві пробіли з тексту",
          example: "=TRIM(A1)",
          exampleResult: "Текст без зайвих пробілів на початку та в кінці",
          usage: "Очищення даних, імпортованого тексту",
          tips: "Залишає лише один пробіл між словами",
          keywords: ["очищення", "пробіли", "форматування"]
        }
      ]
    },
    datetime: {
      title: "📅 Функції дати та часу",
      formulas: [
        {
          name: "TODAY",
          syntax: "=TODAY()",
          description: "Повертає поточну дату",
          example: "=TODAY()",
          exampleResult: "Поточна дата (оновлюється автоматично)",
          usage: "Розрахунок віку, термінів, звітності",
          tips: "Оновлюється автоматично при відкритті файлу",
          keywords: ["сьогодні", "поточна дата", "дата"]
        },
        {
          name: "NOW",
          syntax: "=NOW()",
          description: "Повертає поточну дату та час",
          example: "=NOW()",
          exampleResult: "Поточна дата та час",
          usage: "Мітки часу, логування, розрахунок тривалості",
          tips: "Оновлюється при пересчитуванні формул",
          keywords: ["зараз", "поточний час", "мітка часу"]
        },
        {
          name: "DATE",
          syntax: "=DATE(рік; місяць; день)",
          description: "Створює дату з окремих компонентів",
          example: "=DATE(2024; 12; 25)",
          exampleResult: "25.12.2024",
          usage: "Створення дат з окремих полів",
          tips: "Корисно при роботі з даними де дата розділена на частини",
          keywords: ["створення дати", "компоненти", "рік місяць день"]
        },
        {
          name: "YEAR",
          syntax: "=YEAR(дата)",
          description: "Витягує рік з дати",
          example: "=YEAR(A1)",
          exampleResult: "Рік з дати в комірці A1",
          usage: "Аналіз по роках, фільтрація за періодами",
          tips: "Корисно для групування даних за роками",
          keywords: ["рік", "витягування", "аналіз часу"]
        },
        {
          name: "MONTH",
          syntax: "=MONTH(дата)",
          description: "Витягує місяць з дати (1-12)",
          example: "=MONTH(A1)",
          exampleResult: "Номер місяця з дати в A1",
          usage: "Місячна звітність, сезонний аналіз",
          tips: "Повертає число від 1 до 12",
          keywords: ["місяць", "сезон", "періодичність"]
        },
        {
          name: "DAY",
          syntax: "=DAY(дата)",
          description: "Витягує день з дати (1-31)",
          example: "=DAY(A1)",
          exampleResult: "День місяця з дати в A1",
          usage: "Аналіз по днях місяця, календарні розрахунки",
          tips: "Корисно для визначення дня народження, платежів",
          keywords: ["день", "календар", "день місяця"]
        }
      ]
    },
    financial: {
      title: "💰 Фінансові функції",
      formulas: [
        {
          name: "PMT",
          syntax: "=PMT(відсоткова_ставка; кількість_періодів; поточна_вартість; [майбутня_вартість]; [тип])",
          description: "Розраховує регулярний платіж за кредитом",
          example: "=PMT(5%/12; 60; 100000)",
          exampleResult: "Місячний платіж за кредитом 100000 на 5 років під 5%",
          usage: "Розрахунок кредитних платежів, іпотеки",
          tips: "Ставку треба ділити на кількість періодів на рік",
          keywords: ["платіж", "кредит", "іпотека", "ануїтет"]
        },
        {
          name: "PV",
          syntax: "=PV(відсоткова_ставка; кількість_періодів; платіж; [майбутня_вартість]; [тип])",
          description: "Розраховує поточну вартість інвестиції",
          example: "=PV(10%/12; 60; 1000)",
          exampleResult: "Поточна вартість ануїтету",
          usage: "Оцінка інвестицій, дисконтування грошових потоків",
          tips: "Базова функція для фінансового аналізу",
          keywords: ["поточна вартість", "дисконтування", "інвестиції"]
        },
        {
          name: "FV",
          syntax: "=FV(відсоткова_ставка; кількість_періодів; платіж; [поточна_вартість]; [тип])",
          description: "Розраховує майбутню вартість інвестиції",
          example: "=FV(8%/12; 120; 500)",
          exampleResult: "Майбутня вартість щомісячних вкладень 500",
          usage: "Планування пенсії, накопичувальні програми",
          tips: "Показує скільки буде вартий ваш внесок у майбутньому",
          keywords: ["майбутня вартість", "накопичення", "пенсія"]
        },
        {
          name: "RATE",
          syntax: "=RATE(кількість_періодів; платіж; поточна_вартість; [майбутня_вартість]; [тип]; [припущення])",
          description: "Розраховує відсоткову ставку за період",
          example: "=RATE(60; -2000; 100000)",
          exampleResult: "Відсоткова ставка за кредитом",
          usage: "Аналіз прибутковості, порівняння кредитів",
          tips: "Платежі вказуються з мінусом",
          keywords: ["ставка", "прибутковість", "аналіз"]
        },
        {
          name: "NPV",
          syntax: "=NPV(відсоткова_ставка; значення1; [значення2]; ...)",
          description: "Розраховує чисту поточну вартість",
          example: "=NPV(10%; B1:B10)",
          exampleResult: "Чиста поточна вартість грошових потоків",
          usage: "Оцінка інвестиційних проектів, бізнес-планування",
          tips: "Позитивне NPV означає прибутковий проект",
          keywords: ["NPV", "інвестиційний проект", "прибутковість"]
        },
        {
          name: "IRR",
          syntax: "=IRR(значення; [припущення])",
          description: "Розраховує внутрішню норму прибутковості",
          example: "=IRR(A1:A10)",
          exampleResult: "Внутрішня норма прибутковості проекту",
          usage: "Аналіз ефективності інвестицій",
          tips: "Перший грошовий потік зазвичай негативний (інвестиція)",
          keywords: ["IRR", "норма прибутковості", "ефективність"]
        }
      ]
    },
    statistical: {
      title: "📊 Статистичні функції",
      formulas: [
        {
          name: "MEDIAN",
          syntax: "=MEDIAN(число1; [число2]; ...)",
          description: "Знаходить медіану (середнє значення) набору чисел",
          example: "=MEDIAN(A1:A100)",
          exampleResult: "Медіана значень в діапазоні",
          usage: "Аналіз зарплат, цін, оцінок без впливу викидів",
          tips: "Медіана менш чутлива до крайніх значень ніж середнє",
          keywords: ["медіана", "середнє значення", "статистика"]
        },
        {
          name: "MODE",
          syntax: "=MODE(число1; [число2]; ...)",
          description: "Знаходить найчастіше значення у наборі",
          example: "=MODE(B1:B50)",
          exampleResult: "Найпоширеніше значення",
          usage: "Аналіз найпопулярніших товарів, оцінок",
          tips: "У новіших версіях використовуйте MODE.SNGL",
          keywords: ["мода", "найчастіше", "популярне"]
        },
        {
          name: "STDEV",
          syntax: "=STDEV(число1; [число2]; ...)",
          description: "Розраховує стандартне відхилення вибірки",
          example: "=STDEV(C1:C200)",
          exampleResult: "Стандартне відхилення даних",
          usage: "Оцінка варіабельності, ризику, якості",
          tips: "Більше значення = більший розкид даних",
          keywords: ["стандартне відхилення", "варіабельність", "ризик"]
        },
        {
          name: "VAR",
          syntax: "=VAR(число1; [число2]; ...)",
          description: "Розраховує дисперсію вибірки",
          example: "=VAR(D1:D100)",
          exampleResult: "Дисперсія набору даних",
          usage: "Статистичний аналіз, оцінка ризику",
          tips: "Дисперсія = квадрат стандартного відхилення",
          keywords: ["дисперсія", "розкид", "варіація"]
        },
        {
          name: "PERCENTILE",
          syntax: "=PERCENTILE(масив; k)",
          description: "Повертає k-ий перцентиль значень",
          example: "=PERCENTILE(A1:A1000; 0.95)",
          exampleResult: "95-ий перцентиль значень",
          usage: "Аналіз продуктивності, встановлення порогів",
          tips: "k має бути між 0 та 1 (0.5 = медіана)",
          keywords: ["перцентиль", "ранжування", "поріг"]
        },
        {
          name: "CORREL",
          syntax: "=CORREL(масив1; масив2)",
          description: "Розраховує коефіцієнт кореляції між двома наборами",
          example: "=CORREL(A1:A50; B1:B50)",
          exampleResult: "Кореляція між двома змінними",
          usage: "Аналіз зв'язку між показниками",
          tips: "Значення від -1 до 1. Близьке до 0 = слабкий зв'язок",
          keywords: ["кореляція", "зв'язок", "залежність"]
        }
      ]
    },
    utility: {
      title: "🔧 Допоміжні функції",
      formulas: [
        {
          name: "UNIQUE",
          syntax: "=UNIQUE(масив; [за_стовпцями]; [лише_один_раз])",
          description: "Повертає унікальні значення з масиву",
          example: "=UNIQUE(A1:A100)",
          exampleResult: "Список унікальних значень без дублікатів",
          usage: "Створення списків без повторень, аналіз даних",
          tips: "Доступна у новіших версіях Excel та Google Sheets",
          keywords: ["унікальні", "дублікати", "список"]
        },
        {
          name: "FILTER",
          syntax: "=FILTER(масив; умова; [якщо_порожньо])",
          description: "Фільтрує масив за вказаною умовою",
          example: "=FILTER(A1:C100; B1:B100>50)",
          exampleResult: "Рядки де значення в стовпці B більше 50",
          usage: "Динамічна фільтрація даних, створення звітів",
          tips: "Результат автоматично оновлюється при зміні даних",
          keywords: ["фільтр", "умова", "динамічний"]
        },
        {
          name: "SORT",
          syntax: "=SORT(масив; [індекс_сортування]; [порядок]; [за_стовпцями])",
          description: "Сортує масив даних",
          example: "=SORT(A1:C50; 2; -1)",
          exampleResult: "Дані відсортовані по 2-му стовпцю за спаданням",
          usage: "Автоматичне сортування таблиць, рейтингів",
          tips: "1 = за зростанням, -1 = за спаданням",
          keywords: ["сортування", "впорядкування", "рейтинг"]
        },
        {
          name: "TRANSPOSE",
          syntax: "=TRANSPOSE(масив)",
          description: "Транспонує масив (рядки стають стовпцями)",
          example: "=TRANSPOSE(A1:E1)",
          exampleResult: "Горизонтальний рядок стає вертикальним стовпцем",
          usage: "Зміна орієнтації таблиць, аналіз даних",
          tips: "Корисно для зміни структури даних",
          keywords: ["транспозиція", "орієнтація", "поворот"]
        },
        {
          name: "RANDARRAY",
          syntax: "=RANDARRAY([рядки]; [стовпці]; [мін]; [макс]; [ціле_число])",
          description: "Генерує масив випадкових чисел",
          example: "=RANDARRAY(10; 3; 1; 100; TRUE)",
          exampleResult: "Масив 10x3 з випадковими цілими числами від 1 до 100",
          usage: "Тестові дані, моделювання, ігри",
          tips: "TRUE = цілі числа, FALSE = десяткові",
          keywords: ["випадкові числа", "генератор", "тестові дані"]
        },
        {
          name: "SEQUENCE",
          syntax: "=SEQUENCE(рядки; [стовпці]; [початок]; [крок])",
          description: "Генерує послідовність чисел",
          example: "=SEQUENCE(5; 1; 10; 2)",
          exampleResult: "Послідовність: 10, 12, 14, 16, 18",
          usage: "Створення номерації, календарів, шкал",
          tips: "Швидкий спосіб створити числову послідовність",
          keywords: ["послідовність", "номерація", "прогресія"]
        }
      ]
    }
  };
  
  // Calculate total formulas
  let totalFormulas = 0;
  Object.values(formulaData).forEach(category => {
    totalFormulas += category.formulas.length;
  });
  totalFormulasSpan.textContent = totalFormulas;
  
  // Copy function
  function copyFormula(formula) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(formula).then(() => {
        showCopySuccess();
      }).catch(() => {
        fallbackCopy(formula);
      });
    } else {
      fallbackCopy(formula);
    }
  }
  
  function fallbackCopy(formula) {
    const textArea = document.createElement('textarea');
    textArea.value = formula;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    
    document.body.removeChild(textArea);
  }
  
  function showCopySuccess() {
    copiedCount++;
    copiedFormulasSpan.textContent = copiedCount;
    
    // Show temporary success message
    const notification = document.createElement('div');
    notification.textContent = '✅ Формулу скопійовано!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Render formulas
  function renderFormulas(filterText = '', categoryFilter = '') {
    formulaCollection.innerHTML = '';
    let totalFiltered = 0;
    
    Object.entries(formulaData).forEach(([categoryKey, category]) => {
      if (categoryFilter && categoryFilter !== categoryKey) return;
      
      const filteredFormulas = category.formulas.filter(formula => {
        if (!filterText) return true;
        const searchTerm = filterText.toLowerCase();
        return (
          formula.name.toLowerCase().includes(searchTerm) ||
          formula.description.toLowerCase().includes(searchTerm) ||
          formula.usage.toLowerCase().includes(searchTerm) ||
          formula.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          formula.tips.toLowerCase().includes(searchTerm)
        );
      });
      
      if (filteredFormulas.length === 0) return;
      
      totalFiltered += filteredFormulas.length;
      
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'formula-category';
      categoryDiv.innerHTML = `
        <h3>${category.title}</h3>
        <div class="formula-grid">
          ${filteredFormulas.map(formula => `
            <div class="formula-card">
              <div class="formula-header">
                <h4 class="formula-name">${formula.name}</h4>
                <button class="copy-btn" onclick="copyFormula('${formula.syntax}')" title="Копіювати формулу">
                  📋 Копіювати
                </button>
              </div>
              <div class="formula-syntax">
                <code>${formula.syntax}</code>
              </div>
              <div class="formula-description">
                ${formula.description}
              </div>
              <div class="formula-example">
                <strong>Приклад:</strong> <code>${formula.example}</code>
                <div class="example-result">${formula.exampleResult}</div>
              </div>
              <div class="formula-usage">
                <strong>Використання:</strong> ${formula.usage}
              </div>
              <div class="formula-tips">
                💡 <strong>Порада:</strong> ${formula.tips}
              </div>
              <div class="formula-keywords">
                <strong>Ключові слова:</strong> ${formula.keywords.join(', ')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      formulaCollection.appendChild(categoryDiv);
    });
    
    filteredFormulasSpan.textContent = totalFiltered;
    
    if (formulaCollection.innerHTML === '') {
      formulaCollection.innerHTML = '<div class="no-results">😔 Не знайдено формул за вашим запитом. Спробуйте інші ключові слова.</div>';
      filteredFormulasSpan.textContent = 0;
    }
  }
  
  // Make copyFormula globally available
  window.copyFormula = copyFormula;
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    renderFormulas(e.target.value, categoryFilter.value);
  });
  
  categoryFilter.addEventListener('change', (e) => {
    renderFormulas(searchInput.value, e.target.value);
  });
  
  // Initial render
  renderFormulas();
  
  // Add CSS for styling
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .formula-search {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      margin-bottom: 2rem;
      border: 1px solid var(--border);
    }
    
    .search-controls {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
      align-items: end;
    }
    
    @media (max-width: 768px) {
      .search-controls {
        grid-template-columns: 1fr;
      }
    }
    
    .search-input-group input,
    .category-filter select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: 6px;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
    
    .search-input-group input:focus,
    .category-filter select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    .formula-category {
      margin-bottom: 3rem;
    }
    
    .formula-category h3 {
      color: var(--accent);
      margin-bottom: 1.5rem;
      border-bottom: 3px solid var(--accent);
      padding-bottom: 0.5rem;
      font-size: 1.4rem;
    }
    
    .formula-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    
    @media (max-width: 768px) {
      .formula-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .formula-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .formula-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      border-color: var(--accent);
    }
    
    .formula-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .formula-name {
      color: var(--accent);
      font-size: 1.3rem;
      font-weight: 700;
      margin: 0;
    }
    
    .copy-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .copy-btn:hover {
      background: var(--accent-hover, #1d4ed8);
      transform: scale(1.05);
    }
    
    .formula-syntax {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
      font-family: 'Courier New', monospace;
    }
    
    .formula-syntax code {
      color: #d63384;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .formula-description {
      color: var(--main-color);
      margin-bottom: 1rem;
      font-size: 1rem;
      line-height: 1.5;
    }
    
    .formula-example {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0 6px 6px 0;
    }
    
    .formula-example code {
      background: #bbdefb;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    
    .example-result {
      margin-top: 0.5rem;
      font-style: italic;
      color: #1976d2;
    }
    
    .formula-usage {
      background: #f3e5f5;
      border-left: 4px solid #9c27b0;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0 6px 6px 0;
    }
    
    .formula-tips {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0 6px 6px 0;
    }
    
    .formula-keywords {
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .formula-stats {
      margin-top: 3rem;
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 2rem;
      border: 1px solid var(--border);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      text-align: center;
    }
    
    .stat-card {
      padding: 1rem;
      background: linear-gradient(135deg, var(--accent), #3b82f6);
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .no-results {
      text-align: center;
      color: #666;
      font-size: 1.2rem;
      margin: 3rem 0;
      padding: 2rem;
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
  `;
  document.head.appendChild(style);
});