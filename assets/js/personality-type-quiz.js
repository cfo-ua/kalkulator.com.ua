document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    
    // Quiz questions with scoring dimensions
    const questions = [
      {
        text: "На вечірці ви зазвичай:",
        options: [
          { text: "Спілкуєтеся з багатьма людьми", scores: { E: 2, O: 1 } },
          { text: "Розмовляєте з кількома близькими друзями", scores: { I: 2, A: 1 } },
          { text: "Намагаєтеся познайомитися з новими людьми", scores: { E: 2, O: 2 } },
          { text: "Знаходите тихий куточок для спокійної розмови", scores: { I: 2, C: 1 } }
        ]
      },
      {
        text: "При прийнятті важливих рішень ви покладаєтеся на:",
        options: [
          { text: "Логіку та факти", scores: { T: 2, C: 1 } },
          { text: "Інтуїцію та передчуття", scores: { F: 1, N: 2 } },
          { text: "Досвід та перевірені методи", scores: { S: 2, C: 1 } },
          { text: "Емоції та цінності", scores: { F: 2, A: 1 } }
        ]
      },
      {
        text: "Ваш ідеальний вихідний:",
        options: [
          { text: "Активний день з друзями", scores: { E: 2, O: 1 } },
          { text: "Спокійний день вдома з книгою", scores: { I: 2, O: -1 } },
          { text: "Пригода в новому місці", scores: { E: 1, O: 2 } },
          { text: "Організований план з близькими", scores: { C: 2, A: 1 } }
        ]
      },
      {
        text: "Коли ви працюєте в команді:",
        options: [
          { text: "Беруте на себе лідерство", scores: { E: 2, C: 1 } },
          { text: "Підтримуєте гармонію в групі", scores: { A: 2, F: 1 } },
          { text: "Генеруєте креативні ідеї", scores: { O: 2, N: 1 } },
          { text: "Зосереджуєтеся на деталях", scores: { C: 2, S: 1 } }
        ]
      },
      {
        text: "Ваше ставлення до змін:",
        options: [
          { text: "Приймаю їх з ентузіазмом", scores: { O: 2, P: 1 } },
          { text: "Потребую часу для адаптації", scores: { C: 1, J: 1, N: -1 } },
          { text: "Аналізую всі можливі наслідки", scores: { T: 2, C: 1 } },
          { text: "Довіряю своїм інстинктам", scores: { F: 1, P: 2 } }
        ]
      },
      {
        text: "У стресовій ситуації ви:",
        options: [
          { text: "Зберігаєте спокій і думаєте логічно", scores: { T: 2, C: 1, N: -2 } },
          { text: "Шукаєте підтримку у друзів", scores: { E: 1, A: 2 } },
          { text: "Аналізуєте проблему самостійно", scores: { I: 2, T: 1 } },
          { text: "Відчуваєте сильні емоції", scores: { F: 1, N: 2 } }
        ]
      },
      {
        text: "Ваш стиль спілкування:",
        options: [
          { text: "Прямий і відвертий", scores: { E: 1, T: 2 } },
          { text: "Дипломатичний і тактовний", scores: { A: 2, F: 1 } },
          { text: "Енергійний і експресивний", scores: { E: 2, O: 1 } },
          { text: "Спокійний і розважливий", scores: { I: 2, C: 1 } }
        ]
      },
      {
        text: "При плануванні подорожі ви:",
        options: [
          { text: "Складаєте детальний маршрут", scores: { J: 2, C: 2 } },
          { text: "Маєте загальну ідею, але залишаєте місце для спонтанності", scores: { P: 1, O: 1 } },
          { text: "Повністю покладаєтеся на інтуїцію", scores: { P: 2, N: 1 } },
          { text: "Досліджуєте всі можливості заздалегідь", scores: { J: 1, C: 1, O: 1 } }
        ]
      },
      {
        text: "Ваше ставлення до критики:",
        options: [
          { text: "Сприймаю як можливість для покращення", scores: { O: 2, C: 1 } },
          { text: "Болісно переживаю", scores: { F: 1, N: 2 } },
          { text: "Аналізую об'єктивно", scores: { T: 2, C: 1 } },
          { text: "Захищаю свою точку зору", scores: { A: -1, E: 1 } }
        ]
      },
      {
        text: "Ваш підхід до вирішення проблем:",
        options: [
          { text: "Покрокове дослідження всіх деталей", scores: { S: 2, C: 2 } },
          { text: "Пошук інноваційних рішень", scores: { N: 2, O: 2 } },
          { text: "Консультації з експертами", scores: { A: 1, C: 1 } },
          { text: "Довіра до досвіду", scores: { S: 1, T: 1 } }
        ]
      },
      {
        text: "У конфліктних ситуаціях ви:",
        options: [
          { text: "Намагаєтеся знайти компроміс", scores: { A: 2, F: 1 } },
          { text: "Відстоюєте свою позицію", scores: { E: 1, T: 1, A: -1 } },
          { text: "Уникаєте конфронтації", scores: { I: 1, A: 1, N: 1 } },
          { text: "Шукаєте логічне рішення", scores: { T: 2, C: 1 } }
        ]
      },
      {
        text: "Ваше робоче середовище:",
        options: [
          { text: "Організоване та структуроване", scores: { J: 2, C: 2 } },
          { text: "Гнучке та динамічне", scores: { P: 2, O: 1 } },
          { text: "Творче та натхненне", scores: { O: 2, N: 1 } },
          { text: "Спокійне та зосереджене", scores: { I: 1, C: 1 } }
        ]
      },
      {
        text: "При навчанні новому ви:",
        options: [
          { text: "Читаєте теорію, потім практикуєте", scores: { S: 1, C: 2 } },
          { text: "Одразу пробуєте на практиці", scores: { P: 2, E: 1 } },
          { text: "Експериментуєте і досліджуєте", scores: { O: 2, N: 1 } },
          { text: "Шукаєте зв'язки з вже відомим", scores: { N: 1, C: 1 } }
        ]
      },
      {
        text: "Ваше ставлення до дедлайнів:",
        options: [
          { text: "Завжди здаю роботу заздалегідь", scores: { J: 2, C: 2 } },
          { text: "Працюю краще під тиском", scores: { P: 2, N: 1 } },
          { text: "Дотримуюся графіку", scores: { J: 1, C: 1 } },
          { text: "Іноді забуваю про них", scores: { P: 1, C: -2 } }
        ]
      },
      {
        text: "У відносинах ви цінуєте:",
        options: [
          { text: "Емоційну близькість", scores: { F: 2, A: 1 } },
          { text: "Інтелектуальну сумісність", scores: { T: 2, O: 1 } },
          { text: "Спільні інтереси", scores: { A: 1, O: 1 } },
          { text: "Взаємну незалежність", scores: { I: 1, A: -1 } }
        ]
      },
      {
        text: "Ваш стиль лідерства:",
        options: [
          { text: "Демократичний і колегіальний", scores: { A: 2, F: 1 } },
          { text: "Рішучий і директивний", scores: { E: 2, T: 1 } },
          { text: "Натхненний і візіонерський", scores: { O: 2, N: 2 } },
          { text: "Організований і методичний", scores: { J: 2, C: 2 } }
        ]
      },
      {
        text: "При виборі кар'єри важливо:",
        options: [
          { text: "Стабільність і безпека", scores: { C: 2, J: 1, N: -1 } },
          { text: "Можливості для творчості", scores: { O: 2, N: 1 } },
          { text: "Соціальний вплив і допомога іншим", scores: { F: 2, A: 2 } },
          { text: "Професійне зростання", scores: { C: 1, E: 1 } }
        ]
      },
      {
        text: "Ваш підхід до ризику:",
        options: [
          { text: "Ретельно зважую всі 'за' і 'проти'", scores: { C: 2, T: 1 } },
          { text: "Довіряю інтуїції", scores: { N: 2, P: 1 } },
          { text: "Уникаю невиправданих ризиків", scores: { C: 1, J: 1, N: -1 } },
          { text: "Сприймаю як пригоду", scores: { O: 2, E: 1 } }
        ]
      },
      {
        text: "У групових проектах ви:",
        options: [
          { text: "Координуєте роботу команди", scores: { E: 2, J: 1 } },
          { text: "Генеруєте ідеї", scores: { N: 2, O: 2 } },
          { text: "Виконуєте конкретні завдання", scores: { S: 2, C: 1 } },
          { text: "Підтримуєте командний дух", scores: { A: 2, F: 1 } }
        ]
      },
      {
        text: "Ваше ставлення до традицій:",
        options: [
          { text: "Поважаю і дотримуюся", scores: { S: 2, C: 1, O: -1 } },
          { text: "Вважаю за потрібне переосмислювати", scores: { O: 2, N: 1 } },
          { text: "Цінню корисні, відкидаю застарілі", scores: { T: 2, C: 1 } },
          { text: "Створюю власні традиції", scores: { O: 1, N: 2 } }
        ]
      }
    ];

    // MBTI type descriptions
    const mbtiTypes = {
      'INTJ': {
        title: 'Архітектор',
        description: 'Стратегічні мислителі з планом для всього. INTJ поєднують креативність з раціональністю, щоб втілювати свої ідеї в життя.',
        strengths: ['Стратегічне мислення', 'Незалежність', 'Рішучість', 'Оригінальність', 'Самовпевненість'],
        development: ['Нетерпимість до неефективності', 'Надмірна критичність', 'Уникання емоцій', 'Перфекціонізм'],
        careers: ['Науковець', 'Інженер', 'Архітектор', 'Аналітик', 'Стратег', 'Програміст']
      },
      'INTP': {
        title: 'Мислитель',
        description: 'Інноваційні винахідники з невгамовною спрагою до знань. INTP прагнуть зрозуміти принципи, що керують всесвітом.',
        strengths: ['Аналітичне мислення', 'Креативність', 'Об\'єктивність', 'Інтелектуальна чесність', 'Відкритість до ідей'],
        development: ['Прокрастинація', 'Нечутливість', 'Розсіяність', 'Нетерплячість до рутини'],
        careers: ['Дослідник', 'Філософ', 'Математик', 'Програміст', 'Аналітик', 'Винахідник']
      },
      'ENTJ': {
        title: 'Командир',
        description: 'Сміливі, уявні та вольові лідери, які завжди знаходять або створюють шлях. ENTJ природжені лідери.',
        strengths: ['Природне лідерство', 'Впевненість у собі', 'Стратегічне мислення', 'Ефективність', 'Енергійність'],
        development: ['Нетерпимість', 'Нечутливість', 'Нетерплячість', 'Аргогантність'],
        careers: ['CEO', 'Підприємець', 'Менеджер', 'Консультант', 'Юрист', 'Політик']
      },
      'ENTP': {
        title: 'Полеміст',
        description: 'Розумні та допитливі мислителі, які не можуть опиратися інтелектуальному виклику. ENTP люблять дебати та нові ідеї.',
        strengths: ['Швидке мислення', 'Харизма', 'Енергійність', 'Креативність', 'Комунікабельність'],
        development: ['Нетерплячість', 'Нетолерантність до рутини', 'Труднощі з фокусуванням', 'Нечутливість'],
        careers: ['Винахідник', 'Журналіст', 'Маркетолог', 'Консультант', 'Адвокат', 'Письменник']
      },
      'INFJ': {
        title: 'Адвокат',
        description: 'Тихі та містичні, але дуже надихаючі та невтомні ідеалісти. INFJ прагнуть допомагати іншим та змінювати світ.',
        strengths: ['Емпатія', 'Інтуїція', 'Принциповість', 'Альтруїзм', 'Креативність'],
        development: ['Перфекціонізм', 'Чутливість до критики', 'Надмірне самопожертвування', 'Вигорання'],
        careers: ['Психолог', 'Вчитель', 'Письменник', 'Художник', 'Консультант', 'Соціальний працівник']
      },
      'INFP': {
        title: 'Медіатор',
        description: 'Поетичні, добрі та альтруїстичні люди, завжди готові допомогти в доброй справі. INFP керуються своїми цінностями.',
        strengths: ['Ідеалізм', 'Емпатія', 'Креативність', 'Пристрасність', 'Альтруїзм'],
        development: ['Неприйняття критики', 'Непрактичність', 'Емоційність', 'Труднощі з деталями'],
        careers: ['Письменник', 'Художник', 'Психолог', 'Музикант', 'Актор', 'Благодійник']
      },
      'ENFJ': {
        title: 'Протагоніст',
        description: 'Харизматичні та надихаючі лідери, здатні зачарувати своїх слухачів. ENFJ допомагають іншим розкрити свій потенціал.',
        strengths: ['Харизма', 'Емпатія', 'Лідерство', 'Комунікативність', 'Альтруїзм'],
        development: ['Надмірна ідеалізація', 'Надмірне самопожертвування', 'Нетерпимість до конфліктів', 'Маніпулятивність'],
        careers: ['Вчитель', 'Тренер', 'HR-менеджер', 'Консультант', 'Політик', 'Журналіст']
      },
      'ENFP': {
        title: 'Активіст',
        description: 'Ентузіасти, творчі та товариські вільнодумці, які завжди можуть знайти привід для посмішки. ENFP натхненні та надихають інших.',
        strengths: ['Ентузіазм', 'Креативність', 'Товариськість', 'Енергійність', 'Емпатія'],
        development: ['Нетерплячість', 'Труднощі з фокусуванням', 'Надмірний оптимізм', 'Незалежність'],
        careers: ['Художник', 'Актор', 'Маркетолог', 'Журналіст', 'Психолог', 'Підприємець']
      },
      'ISTJ': {
        title: 'Логіст',
        description: 'Практичні та фактологічні люди, на надійність яких можна покластися. ISTJ цінують традиції та порядок.',
        strengths: ['Надійність', 'Практичність', 'Працьовитість', 'Організованість', 'Відповідальність'],
        development: ['Упертість', 'Нечутливість', 'Осуд', 'Опір змінам'],
        careers: ['Бухгалтер', 'Аудитор', 'Юрист', 'Лікар', 'Менеджер', 'Адміністратор']
      },
      'ISFJ': {
        title: 'Захисник',
        description: 'Дуже віддані та теплі захисники, завжди готові захистити близьких. ISFJ турботливі та уважні до потреб інших.',
        strengths: ['Надійність', 'Турботливість', 'Практичність', 'Ентузіазм', 'Лояльність'],
        development: ['Надмірна скромність', 'Перевантаження собе', 'Нерішучість', 'Неприйняття змін'],
        careers: ['Медсестра', 'Вчитель', 'Соціальний працівник', 'Консультант', 'Адміністратор', 'Терапевт']
      },
      'ESTJ': {
        title: 'Виконавець',
        description: 'Чудові адміністратори, неперевершені в управлінні речами або людьми. ESTJ організовані та результативні.',
        strengths: ['Лідерство', 'Ефективність', 'Надійність', 'Енергійність', 'Сильна воля'],
        development: ['Нетерплячість', 'Складність вираження емоцій', 'Упертість', 'Осуд'],
        careers: ['Менеджер', 'Адміністратор', 'Юрист', 'Фінансист', 'Політик', 'Військовий']
      },
      'ESFJ': {
        title: 'Консул',
        description: 'Надзвичайно турботливі, товариські та популярні люди, завжди готові допомогти. ESFJ цінують гармонію та співпрацю.',
        strengths: ['Практичні навички', 'Лояльність', 'Чутливість', 'Сильне почуття обов\'язку', 'Теплота'],
        development: ['Потреба в схваленні', 'Чутливість до критики', 'Негнучкість', 'Неприйняття змін'],
        careers: ['Вчитель', 'Медсестра', 'HR-менеджер', 'Консультант', 'Соціальний працівник', 'Івент-менеджер']
      },
      'ISTP': {
        title: 'Віртуоз',
        description: 'Сміливі та практичні експериментатори, майстри всіх інструментів. ISTP люблять експерименти та практичні завдання.',
        strengths: ['Практичність', 'Креативність', 'Спонтанність', 'Раціональність', 'Кризове управління'],
        development: ['Упертість', 'Нечутливість', 'Приватність', 'Нетерплячість'],
        careers: ['Інженер', 'Механік', 'Пілот', 'Програміст', 'Детектив', 'Спортсмен']
      },
      'ISFP': {
        title: 'Пригодник',
        description: 'Гнучкі та чарівні художники, завжди готові досліджувати нові можливості. ISFP керуються своїми цінностями.',
        strengths: ['Чарівність', 'Чутливість до інших', 'Уяява', 'Пристрасність', 'Допитливість'],
        development: ['Фіксація на даному моменті', 'Конкурентність', 'Незалежність', 'Непередбачуваність'],
        careers: ['Художник', 'Музикант', 'Фотограф', 'Дизайнер', 'Психолог', 'Ветеринар']
      },
      'ESTP': {
        title: 'Підприємець',
        description: 'Розумні, енергійні та дуже сприйнятливі люди, які справді насолоджуються життям. ESTP спонтанні та практичні.',
        strengths: ['Товариськість', 'Практичність', 'Ресурсність', 'Спонтанність', 'Енергійність'],
        development: ['Нетерплячість', 'Неприйняття ризику', 'Дефіцит довгострокового фокусу', 'Нечутливість'],
        careers: ['Продавець', 'Підприємець', 'Спортсмен', 'Актор', 'Парамедик', 'Менеджер проектів']
      },
      'ESFP': {
        title: 'Артист',
        description: 'Спонтанні, енергійні та ентузіастичні люди - життя ніколи не буває нудним поруч з ними. ESFP люблять бути в центрі уваги.',
        strengths: ['Товариськість', 'Ентузіазм', 'Практичність', 'Спонтанність', 'Відкритість'],
        development: ['Чутливість', 'Уникнення конфліктів', 'Незалежність', 'Легко нудьгують'],
        careers: ['Актор', 'Музикант', 'Фотограф', 'Івент-менеджер', 'Соціальний працівник', 'Тренер']
      }
    };

    // Quiz state
    let quizState = {
      currentQuestion: 0,
      answers: [],
      scores: {
        E: 0, I: 0,  // Extraversion/Introversion
        S: 0, N: 0,  // Sensing/Intuition
        T: 0, F: 0,  // Thinking/Feeling
        J: 0, P: 0,  // Judging/Perceiving
        O: 0,        // Openness
        C: 0,        // Conscientiousness
        A: 0         // Agreeableness
        // N: 0      // Neuroticism (using different key to avoid conflict)
      }
    };

    // DOM elements
    const elements = {
      intro: document.getElementById('quiz-intro'),
      quiz: document.getElementById('personality-quiz'),
      results: document.getElementById('quiz-results'),
      startBtn: document.getElementById('start-quiz'),
      progressFill: document.getElementById('progress-fill'),
      questionCounter: document.getElementById('question-counter'),
      questionText: document.getElementById('question-text'),
      answerOptions: document.getElementById('answer-options'),
      prevBtn: document.getElementById('prev-question'),
      nextBtn: document.getElementById('next-question'),
      submitBtn: document.getElementById('submit-quiz'),
      retakeBtn: document.getElementById('retake-quiz'),
      shareBtn: document.getElementById('share-results'),
      saveBtn: document.getElementById('save-results'),
      mbtiType: document.getElementById('mbti-type'),
      mbtiTitle: document.getElementById('mbti-title'),
      bigFiveChart: document.getElementById('big-five-chart'),
      personalityDescription: document.getElementById('personality-description'),
      strengthsWeaknesses: document.getElementById('strengths-weaknesses'),
      careerRecommendations: document.getElementById('career-recommendations')
    };

    // Event listeners
    elements.startBtn.addEventListener('click', startQuiz);
    elements.prevBtn.addEventListener('click', previousQuestion);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.submitBtn.addEventListener('click', submitQuiz);
    elements.retakeBtn.addEventListener('click', retakeQuiz);
    elements.shareBtn.addEventListener('click', shareResults);
    elements.saveBtn.addEventListener('click', saveResults);

    function startQuiz() {
      quizState.currentQuestion = 0;
      quizState.answers = [];
      quizState.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, O: 0, C: 0, A: 0 };
      
      elements.intro.style.display = 'none';
      elements.quiz.style.display = 'block';
      elements.results.style.display = 'none';
      
      showQuestion(0);
    }

    function showQuestion(index) {
      const question = questions[index];
      
      // Update progress
      const progress = ((index + 1) / questions.length) * 100;
      elements.progressFill.style.width = `${progress}%`;
      elements.questionCounter.textContent = `Питання ${index + 1} з ${questions.length}`;
      
      // Display question
      elements.questionText.textContent = question.text;
      
      // Display options
      elements.answerOptions.innerHTML = '';
      question.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.textContent = option.text;
        button.dataset.optionIndex = optionIndex;
        
        // Check if this option was previously selected
        if (quizState.answers[index] === optionIndex) {
          button.classList.add('selected');
        }
        
        button.addEventListener('click', () => selectAnswer(index, optionIndex));
        elements.answerOptions.appendChild(button);
      });
      
      // Update navigation buttons
      elements.prevBtn.disabled = index === 0;
      elements.nextBtn.style.display = index === questions.length - 1 ? 'none' : 'block';
      elements.submitBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
      
      // Update next button state
      updateNextButton();
    }

    function selectAnswer(questionIndex, optionIndex) {
      quizState.answers[questionIndex] = optionIndex;
      
      // Update visual selection
      const options = elements.answerOptions.querySelectorAll('.answer-option');
      options.forEach((option, index) => {
        option.classList.toggle('selected', index === optionIndex);
      });
      
      updateNextButton();
    }

    function updateNextButton() {
      const hasAnswer = quizState.answers[quizState.currentQuestion] !== undefined;
      elements.nextBtn.disabled = !hasAnswer;
      elements.submitBtn.disabled = !hasAnswer;
    }

    function previousQuestion() {
      if (quizState.currentQuestion > 0) {
        quizState.currentQuestion--;
        showQuestion(quizState.currentQuestion);
      }
    }

    function nextQuestion() {
      if (quizState.currentQuestion < questions.length - 1) {
        quizState.currentQuestion++;
        showQuestion(quizState.currentQuestion);
      }
    }

    function submitQuiz() {
      calculateScores();
      showResults();
    }

    function calculateScores() {
      // Reset scores
      quizState.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, O: 0, C: 0, A: 0 };
      
      // Calculate scores based on answers
      quizState.answers.forEach((answerIndex, questionIndex) => {
        const question = questions[questionIndex];
        const selectedOption = question.options[answerIndex];
        
        // Add scores from selected option
        Object.entries(selectedOption.scores).forEach(([dimension, score]) => {
          if (quizState.scores.hasOwnProperty(dimension)) {
            quizState.scores[dimension] += score;
          }
        });
      });
    }

    function determineMBTIType() {
      let type = '';
      
      // Determine each dimension
      type += quizState.scores.E > quizState.scores.I ? 'E' : 'I';
      type += quizState.scores.S > quizState.scores.N ? 'S' : 'N';
      type += quizState.scores.T > quizState.scores.F ? 'T' : 'F';
      type += quizState.scores.J > quizState.scores.P ? 'J' : 'P';
      
      return type;
    }

    function showResults() {
      elements.quiz.style.display = 'none';
      elements.results.style.display = 'block';
      
      const mbtiType = determineMBTIType();
      const typeInfo = mbtiTypes[mbtiType];
      
      // Display MBTI type
      elements.mbtiType.textContent = mbtiType;
      elements.mbtiTitle.textContent = typeInfo.title;
      
      // Create Big Five chart
      createBigFiveChart();
      
      // Display personality description
      displayPersonalityDescription(typeInfo);
      
      // Display strengths and development areas
      displayStrengthsWeaknesses(typeInfo);
      
      // Display career recommendations
      displayCareerRecommendations(typeInfo);
      
      // Scroll to results
      elements.results.scrollIntoView({ behavior: 'smooth' });
    }

    function createBigFiveChart() {
      // Normalize Big Five scores to 0-100 scale
      const maxScore = 20; // Approximate maximum possible score per trait
      const bigFiveTraits = [
        { label: 'Відкритість', score: Math.max(0, Math.min(100, (quizState.scores.O / maxScore) * 100)) },
        { label: 'Сумлінність', score: Math.max(0, Math.min(100, (quizState.scores.C / maxScore) * 100)) },
        { label: 'Екстраверсія', score: Math.max(0, Math.min(100, (quizState.scores.E / maxScore) * 100)) },
        { label: 'Прихильність', score: Math.max(0, Math.min(100, (quizState.scores.A / maxScore) * 100)) },
        { label: 'Емоц. стабільність', score: Math.max(0, Math.min(100, 100 - (quizState.scores.N / maxScore) * 100)) }
      ];
      
      elements.bigFiveChart.innerHTML = '';
      
      bigFiveTraits.forEach(trait => {
        const traitDiv = document.createElement('div');
        traitDiv.className = 'trait-bar';
        
        traitDiv.innerHTML = `
          <div class="trait-label">${trait.label}</div>
          <div class="trait-progress">
            <div class="trait-fill" style="width: ${trait.score}%"></div>
          </div>
          <div class="trait-score">${Math.round(trait.score)}</div>
        `;
        
        elements.bigFiveChart.appendChild(traitDiv);
      });
    }

    function displayPersonalityDescription(typeInfo) {
      elements.personalityDescription.innerHTML = `
        <h6>📝 Опис вашого типу особистості</h6>
        <p>${typeInfo.description}</p>
        <p>Ваш тип особистості відображає унікальну комбінацію психологічних переваг, які впливають на те, як ви сприймаєте світ, приймаєте рішення та взаємодієте з іншими людьми.</p>
      `;
    }

    function displayStrengthsWeaknesses(typeInfo) {
      elements.strengthsWeaknesses.innerHTML = `
        <div class="strength-card">
          <h6>💪 Ваші сильні сторони</h6>
          <ul class="strength-list">
            ${typeInfo.strengths.map(strength => `<li>✅ ${strength}</li>`).join('')}
          </ul>
        </div>
        <div class="development-card">
          <h6>🎯 Області для розвитку</h6>
          <ul class="development-list">
            ${typeInfo.development.map(area => `<li>⚠️ ${area}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    function displayCareerRecommendations(typeInfo) {
      elements.careerRecommendations.innerHTML = `
        <div class="career-section">
          <h6>💼 Рекомендовані професії</h6>
          <div class="career-list">
            ${typeInfo.careers.map(career => `<span class="career-item">${career}</span>`).join('')}
          </div>
        </div>
        <div class="career-section">
          <h6>🤝 Поради для стосунків</h6>
          <p>Розуміння свого типу особистості допомагає будувати кращі відносини з іншими. Пам'ятайте, що різні типи мають різні потреби та стилі спілкування.</p>
        </div>
        <div class="career-section">
          <h6>📈 Особистий розвиток</h6>
          <p>Працюйте над розвитком своїх слабших сторін, але не забувайте використовувати та розвивати свої природні сильні сторони.</p>
        </div>
      `;
    }

    function retakeQuiz() {
      elements.results.style.display = 'none';
      elements.intro.style.display = 'block';
    }

    function shareResults() {
      const mbtiType = determineMBTIType();
      const typeInfo = mbtiTypes[mbtiType];
      const shareText = `Я пройшов тест особистості і виявився ${mbtiType} - ${typeInfo.title}! 🧠✨`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Мій тип особистості',
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + '\n' + window.location.href);
        showNotification('Результат скопійовано для поширення!');
      }
    }

    function saveResults() {
      const mbtiType = determineMBTIType();
      const typeInfo = mbtiTypes[mbtiType];
      
      const results = {
        mbtiType,
        typeInfo,
        scores: quizState.scores,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('personalityTestResults', JSON.stringify(results));
      showNotification('Результати збережено!');
    }

    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = message;
      notification.style.backgroundColor = '#28a745';
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 2000);
    }
    
  })();
});