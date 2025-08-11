document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    // Career Path Quiz data based on Holland's RIASEC model
    const careerQuestions = [
      {
        question: "💻 Мені подобається працювати з технологіями та комп'ютерами",
        type: "realistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🔬 Мене приваблюють наукові дослідження та аналіз даних",
        type: "investigative",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🎨 Я люблю творчі завдання та самовираження",
        type: "artistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "👥 Мені подобається допомагати людям та працювати в команді",
        type: "social",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🏆 Мене приваблює лідерство та управління проектами",
        type: "enterprising",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "📊 Я віддаю перевагу структурованій роботі з чіткими правилами",
        type: "conventional",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🔧 Мені подобається створювати щось своїми руками",
        type: "realistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🧪 Мене цікавить пошук рішень складних проблем",
        type: "investigative",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🎭 Я мрію працювати в сфері мистецтва або розваг",
        type: "artistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🏥 Мене приваблює робота в сфері освіти або охорони здоров'я",
        type: "social",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "💼 Я хочу мати власний бізнес або керувати компанією",
        type: "enterprising",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "📋 Мені подобається організовувати інформацію та вести документацію",
        type: "conventional",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "⚙️ Мене цікавить, як працюють механізми та системи",
        type: "realistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "📚 Я захоплююся вивченням нових теорій та концепцій",
        type: "investigative",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🎵 Творчість та інновації важливіші за стабільність",
        type: "artistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🤝 Мені важливо робити внесок у суспільство",
        type: "social",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🎯 Я люблю ставити амбітні цілі та досягати їх",
        type: "enterprising",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "📊 Мені подобається аналізувати дані та складати звіти",
        type: "conventional",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🏗️ Мене приваблює будівництво та інженерія",
        type: "realistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🔍 Я люблю досліджувати причини явищ та процесів",
        type: "investigative",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🖌️ Я хочу створювати красиві та значущі речі",
        type: "artistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "👨‍🏫 Мені подобається навчати та наставляти інших",
        type: "social",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "💰 Мене мотивує можливість заробляти великі гроші",
        type: "enterprising",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "📁 Я віддаю перевагу стабільному графіку та передбачуваним завданням",
        type: "conventional",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      },
      {
        question: "🌱 Мене приваблює робота з природою або екологією",
        type: "realistic",
        answers: [
          { text: "Повністю погоджуюся", score: 3 },
          { text: "Скоріше погоджуюся", score: 2 },
          { text: "Нейтрально", score: 1 },
          { text: "Скоріше не погоджуюся", score: 0 }
        ]
      }
    ];

    const personalityTypes = {
      realistic: {
        name: "Реалістичний (R)",
        description: "Практичний, орієнтований на дію",
        emoji: "🔧"
      },
      investigative: {
        name: "Дослідницький (I)",
        description: "Аналітичний, науково мислячий",
        emoji: "🔬"
      },
      artistic: {
        name: "Артистичний (A)",
        description: "Творчий, експресивний",
        emoji: "🎨"
      },
      social: {
        name: "Соціальний (S)",
        description: "Орієнтований на людей, допомагаючий",
        emoji: "🤝"
      },
      enterprising: {
        name: "Підприємницький (E)",
        description: "Лідерський, амбітний",
        emoji: "🏆"
      },
      conventional: {
        name: "Конвенціональний (C)",
        description: "Організований, системний",
        emoji: "📊"
      }
    };

    const careerRecommendations = {
      realistic: {
        title: "Технології та Інженерія",
        match: "Висока відповідність",
        description: "Ви підходите для практичних професій, пов'язаних з технологіями, будівництвом та роботою з матеріальними об'єктами.",
        examples: "IT-спеціаліст, Інженер, Архітектор, Технік, Програміст, Механік",
        skills: ["Технічні навички", "Логічне мислення", "Увага до деталей", "Розв'язання проблем"]
      },
      investigative: {
        title: "Наука та Дослідження",
        match: "Висока відповідність",
        description: "Ваші сильні сторони - аналіз, дослідження та пошук нових знань. Підходять наукові та дослідницькі професії.",
        examples: "Науковець, Аналітик даних, Дослідник, Лікар, Психолог, Викладач університету",
        skills: ["Аналітичне мислення", "Дослідницькі навички", "Критичне мислення", "Наукові методи"]
      },
      artistic: {
        title: "Мистецтво та Креатив",
        match: "Висока відповідність", 
        description: "Ви маєте творчий потенціал та здатність до самовираження. Ідеально підходять креативні індустрії.",
        examples: "Дизайнер, Художник, Музикант, Письменник, Режисер, Фотограф",
        skills: ["Творче мислення", "Художні навички", "Інновації", "Естетичне чуття"]
      },
      social: {
        title: "Освіта та Соціальна сфера", 
        match: "Висока відповідність",
        description: "Ваше покликання - робота з людьми, навчання та допомога іншим. Підходять соціальні професії.",
        examples: "Вчитель, Соціальний працівник, Консультант, Психотерапевт, Медсестра, HR-менеджер",
        skills: ["Комунікативні навички", "Емпатія", "Робота в команді", "Педагогічні здібності"]
      },
      enterprising: {
        title: "Бізнес та Управління",
        match: "Висока відповідність",
        description: "Ви природний лідер з підприємницькими здібностями. Відмінно підходять керівні та бізнес-позиції.",
        examples: "Менеджер, Підприємець, Директор, Продавець, Маркетолог, Консультант з бізнесу",
        skills: ["Лідерські якості", "Переговори", "Стратегічне мислення", "Управління ризиками"]
      },
      conventional: {
        title: "Фінанси та Адміністрування",
        match: "Висока відповідність",
        description: "Ви цінуєте порядок та структуру. Ідеально підходять організаційні та адміністративні ролі.",
        examples: "Бухгалтер, Банкір, Секретар, Економіст, Аудитор, Адміністратор",
        skills: ["Організаційні навички", "Увага до деталей", "Планування", "Фінансова грамотність"]
      }
    };

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let scores = {
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0
    };

    // DOM elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const detailedReport = document.getElementById('detailed-report');
    const startButton = document.getElementById('start-quiz');
    const questionContainer = document.getElementById('question-container');
    const progressFill = document.getElementById('progress-fill');
    const questionCounter = document.getElementById('question-counter');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const submitButton = document.getElementById('submit-quiz');
    const retakeButton = document.getElementById('retake-quiz');
    const detailedReportButton = document.getElementById('view-detailed-report');
    const backToResultsButton = document.getElementById('back-to-results');

    // Event listeners
    if (startButton) {
      startButton.addEventListener('click', startQuiz);
    }
    if (prevButton) {
      prevButton.addEventListener('click', () => navigateQuestion(-1));
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => navigateQuestion(1));
    }
    if (submitButton) {
      submitButton.addEventListener('click', submitQuiz);
    }
    if (retakeButton) {
      retakeButton.addEventListener('click', resetQuiz);
    }
    if (detailedReportButton) {
      detailedReportButton.addEventListener('click', showDetailedReport);
    }
    if (backToResultsButton) {
      backToResultsButton.addEventListener('click', showResults);
    }

    function startQuiz() {
      currentQuestionIndex = 0;
      userAnswers = new Array(careerQuestions.length).fill(null);
      scores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
      };
      
      quizIntro.style.display = 'none';
      quizQuestions.style.display = 'block';
      quizResults.style.display = 'none';
      detailedReport.style.display = 'none';
      
      displayQuestion();
      updateProgress();
      updateNavigation();
    }

    function displayQuestion() {
      const question = careerQuestions[currentQuestionIndex];
      
      questionContainer.innerHTML = `
        <div class="question-title">${question.question}</div>
        <ul class="answer-options">
          ${question.answers.map((answer, index) => `
            <li class="answer-option">
              <label>
                <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                <span class="answer-text">${answer.text}</span>
              </label>
            </li>
          `).join('')}
        </ul>
      `;

      // Add event listeners to radio buttons
      const radioButtons = questionContainer.querySelectorAll('input[type="radio"]');
      radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
          userAnswers[currentQuestionIndex] = parseInt(e.target.value);
          updateNavigation();
        });
      });
    }

    function updateProgress() {
      const progress = (currentQuestionIndex + 1) / careerQuestions.length * 100;
      progressFill.style.width = `${progress}%`;
      questionCounter.textContent = `Питання ${currentQuestionIndex + 1} з ${careerQuestions.length}`;
    }

    function updateNavigation() {
      prevButton.disabled = currentQuestionIndex === 0;
      
      const isLastQuestion = currentQuestionIndex === careerQuestions.length - 1;
      const hasAnswer = userAnswers[currentQuestionIndex] !== null;
      
      if (isLastQuestion) {
        nextButton.style.display = 'none';
        submitButton.style.display = hasAnswer ? 'block' : 'none';
      } else {
        nextButton.style.display = hasAnswer ? 'block' : 'none';
        submitButton.style.display = 'none';
      }
    }

    function navigateQuestion(direction) {
      const newIndex = currentQuestionIndex + direction;
      if (newIndex >= 0 && newIndex < careerQuestions.length) {
        currentQuestionIndex = newIndex;
        displayQuestion();
        updateProgress();
        updateNavigation();
      }
    }

    function submitQuiz() {
      calculateScores();
      displayResults();
      showResults();
    }

    function calculateScores() {
      // Reset scores
      scores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
      };

      // Calculate scores based on answers
      careerQuestions.forEach((question, index) => {
        const answerIndex = userAnswers[index];
        if (answerIndex !== null) {
          const answerScore = question.answers[answerIndex].score;
          scores[question.type] += answerScore;
        }
      });

      // Convert to percentages
      const maxScore = careerQuestions.filter(q => q.type === 'realistic').length * 3; // Max score per type
      Object.keys(scores).forEach(type => {
        const typeMaxScore = careerQuestions.filter(q => q.type === type).length * 3;
        scores[type] = Math.round((scores[type] / typeMaxScore) * 100);
      });
    }

    function displayResults() {
      // Find top personality type
      const topTypes = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
      const primaryType = topTypes[0];
      const secondaryType = topTypes[1];
      const tertiaryType = topTypes[2];

      // Create personality code
      const personalityCode = topTypes.slice(0, 3).map(type => type.charAt(0).toUpperCase()).join('');
      document.getElementById('personality-type').textContent = personalityCode;
      
      const typeInfo = personalityTypes[primaryType];
      document.getElementById('type-description').textContent = 
        `${typeInfo.emoji} ${typeInfo.name} - ${typeInfo.description}`;

      // Display interests breakdown
      const interestsContainer = document.getElementById('interests-breakdown');
      interestsContainer.innerHTML = Object.keys(scores).map(type => {
        const typeInfo = personalityTypes[type];
        return `
          <div class="interest-bar">
            <div class="interest-label">${typeInfo.emoji} ${typeInfo.name.split(' ')[0]}</div>
            <div class="interest-score-bar">
              <div class="interest-fill ${type}" style="width: ${scores[type]}%"></div>
            </div>
            <div class="interest-percentage">${scores[type]}%</div>
          </div>
        `;
      }).join('');

      // Display career recommendations
      const careerContainer = document.getElementById('career-recommendations');
      const topThreeTypes = [primaryType, secondaryType, tertiaryType];
      
      careerContainer.innerHTML = topThreeTypes.map((type, index) => {
        const career = careerRecommendations[type];
        const matchLevel = index === 0 ? "Найкраща відповідність" : 
                          index === 1 ? "Хороша відповідність" : "Добра відповідність";
        
        return `
          <div class="career-card">
            <div class="career-title">${personalityTypes[type].emoji} ${career.title}</div>
            <div class="career-match">${matchLevel} (${scores[type]}%)</div>
            <div class="career-description">${career.description}</div>
            <div class="career-examples">
              <strong>Приклади професій:</strong> ${career.examples}
            </div>
          </div>
        `;
      }).join('');

      // Display skills development
      generateSkillsRecommendations(topThreeTypes);
    }

    function generateSkillsRecommendations(topTypes) {
      const skillsContainer = document.getElementById('skills-development');
      
      const recommendations = [
        {
          title: "🎯 Ключові навички для розвитку",
          content: topTypes.map(type => {
            const career = careerRecommendations[type];
            return `<div class="skill-item">
              <div class="skill-title">${personalityTypes[type].emoji} ${career.title}</div>
              <div class="skill-description">${career.skills.join(', ')}</div>
            </div>`;
          }).join('')
        },
        {
          title: "📚 План розвитку кар'єри",
          content: `
            <div class="skill-item">
              <div class="skill-title">Короткострокові цілі (3-6 місяців)</div>
              <div class="skill-description">Пройдіть онлайн-курси за вашим напрямком, створіть або оновіть резюме, побудуйте професійну мережу в LinkedIn</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Середньострокові цілі (6-12 місяців)</div>
              <div class="skill-description">Отримайте практичний досвід через стажування або проекти, розвивайте soft skills, шукайте ментора в обраній сфері</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Довгострокові цілі (1-3 роки)</div>
              <div class="skill-description">Отримайте спеціалізацію або сертифікацію, побудуйте портфоліо досягнень, розгляньте можливості кар'єрного зросту</div>
            </div>
          `
        },
        {
          title: "🔗 Корисні ресурси",
          content: `
            <div class="skill-item">
              <div class="skill-title">Освітні платформи</div>
              <div class="skill-description">Coursera, edX, Udemy, LinkedIn Learning - для отримання нових навичок та сертифікатів</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Професійні мережі</div>
              <div class="skill-description">LinkedIn, GitHub (для IT), Behance (для креативних професій) - для нетворкінгу та пошуку можливостей</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Сайти вакансій</div>
              <div class="skill-description">Work.ua, Jobs.ua, DOU.ua (для IT), HeadHunter - для пошуку роботи та аналізу ринку</div>
            </div>
          `
        }
      ];

      skillsContainer.innerHTML = recommendations.map(rec => `
        <div class="skills-section">
          <h6>${rec.title}</h6>
          ${rec.content}
        </div>
      `).join('');
    }

    function showResults() {
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'block';
      detailedReport.style.display = 'none';
    }

    function showDetailedReport() {
      const reportContainer = document.getElementById('report-container');
      
      // Generate detailed report
      const topTypes = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
      
      reportContainer.innerHTML = `
        <div class="skills-section">
          <h6>📊 Детальний аналіз особистості</h6>
          ${topTypes.map(type => `
            <div class="skill-item">
              <div class="skill-title">${personalityTypes[type].emoji} ${personalityTypes[type].name} - ${scores[type]}%</div>
              <div class="skill-description">${careerRecommendations[type].description}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="skills-section">
          <h6>💼 Рекомендовані сфери діяльності</h6>
          ${topTypes.slice(0, 3).map(type => `
            <div class="skill-item">
              <div class="skill-title">${careerRecommendations[type].title}</div>
              <div class="skill-description">
                <strong>Професії:</strong> ${careerRecommendations[type].examples}<br>
                <strong>Необхідні навички:</strong> ${careerRecommendations[type].skills.join(', ')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="skills-section">
          <h6>🚀 Персональні рекомендації</h6>
          <div class="skill-item">
            <div class="skill-title">Ваші сильні сторони</div>
            <div class="skill-description">
              На основі ваших відповідей, ваші головні сильні сторони лежать в ${personalityTypes[topTypes[0]].name.toLowerCase()} та ${personalityTypes[topTypes[1]].name.toLowerCase()} сферах.
              Це означає, що ви будете найбільш успішними в професіях, які поєднують ці якості.
            </div>
          </div>
          <div class="skill-item">
            <div class="skill-title">Області для розвитку</div>
            <div class="skill-description">
              Розгляньте можливість розвитку навичок в ${personalityTypes[topTypes[2]].name.toLowerCase()} сфері, 
              це розширить ваші професійні можливості та зробить вас більш універсальним фахівцем.
            </div>
          </div>
        </div>
      `;

      quizResults.style.display = 'none';
      detailedReport.style.display = 'block';
    }

    function resetQuiz() {
      currentQuestionIndex = 0;
      userAnswers = [];
      scores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
      };
      
      quizIntro.style.display = 'block';
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'none';
      detailedReport.style.display = 'none';
    }

  })();
});