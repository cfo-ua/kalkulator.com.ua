document.addEventListener("DOMContentLoaded", function () {
  // Quiz questions for best friend compatibility
  const quizQuestions = [
    {
      question: "🎉 Як ви зазвичай проводите вільний час разом?",
      options: [
        "Активні розваги та спорт на свіжому повітрі",
        "Спокійні розмови за чашкою кави або чаю",
        "Перегляд фільмів або серіалів удома",
        "Походи по магазинах або кафе в місті"
      ],
      weights: {
        adventurous: [3, 1, 0, 2],
        social: [2, 3, 1, 3],
        relaxed: [1, 3, 3, 2],
        creative: [2, 2, 2, 1]
      }
    },
    {
      question: "💬 Як ви зазвичай спілкуєтеся один з одним?",
      options: [
        "Постійно листуємося протягом дня",
        "Телефонуємо, коли є важливі новини",
        "Зустрічаємося особисто для глибоких розмов",
        "Спілкуємося через соціальні мережі та меми"
      ],
      weights: {
        communicative: [3, 2, 3, 1],
        supportive: [2, 3, 3, 1],
        social: [3, 1, 2, 3],
        modern: [3, 1, 0, 3]
      }
    },
    {
      question: "🤝 Як ви підтримуєте один одного в складні моменти?",
      options: [
        "Слухаю та даю практичні поради",
        "Просто буваю поруч та обіймаю",
        "Намагаюся розвеселити жартами",
        "Допомагаю конкретними діями"
      ],
      weights: {
        supportive: [3, 3, 1, 3],
        empathetic: [3, 3, 2, 2],
        optimistic: [1, 1, 3, 1],
        practical: [3, 1, 0, 3]
      }
    },
    {
      question: "🎯 Які у вас спільні інтереси?",
      options: [
        "Музика, мистецтво та творчість",
        "Спорт та активний спосіб життя",
        "Книги, фільми та глибокі теми",
        "Мода, краса та стиль життя"
      ],
      weights: {
        creative: [3, 1, 2, 2],
        adventurous: [1, 3, 1, 1],
        intellectual: [2, 1, 3, 1],
        social: [2, 2, 1, 3]
      }
    },
    {
      question: "😊 Що найбільше цінуєте у дружбі?",
      options: [
        "Взаємну довіру та чесність",
        "Веселощі та сміх разом",
        "Підтримку в будь-які моменти",
        "Спільні пригоди та спогади"
      ],
      weights: {
        loyal: [3, 1, 3, 2],
        fun: [1, 3, 1, 3],
        supportive: [3, 1, 3, 1],
        adventurous: [2, 2, 1, 3]
      }
    },
    {
      question: "🎭 Який ваш стиль вирішення конфліктів?",
      options: [
        "Відкрито обговорюємо проблему",
        "Даємо час один одному заспокоїтися",
        "Намагаємося знайти компроміс",
        "Просто забуваємо та йдемо далі"
      ],
      weights: {
        communicative: [3, 1, 2, 0],
        patient: [2, 3, 2, 1],
        diplomatic: [2, 2, 3, 1],
        easygoing: [1, 2, 1, 3]
      }
    },
    {
      question: "🌟 Як ви святкуєте успіхи один одного?",
      options: [
        "Влаштовуємо велику вечірку з друзями",
        "Робимо щось особливе лише вдвох",
        "Даримо значущі подарунки",
        "Просто щиро радіємо та вітаємо"
      ],
      weights: {
        social: [3, 1, 1, 2],
        intimate: [1, 3, 2, 2],
        thoughtful: [2, 2, 3, 1],
        genuine: [2, 2, 2, 3]
      }
    },
    {
      question: "🏠 Наскільки добре ви знаєте сім'ї один одного?",
      options: [
        "Дуже близько, як частина родини",
        "Знаємося та спілкуємося іноді",
        "Знаємо основну інформацію",
        "Рідко перетинаємося з родинами"
      ],
      weights: {
        close: [3, 2, 1, 0],
        integrated: [3, 2, 1, 0],
        respectful: [2, 3, 2, 1],
        independent: [0, 1, 2, 3]
      }
    },
    {
      question: "⏰ Як довго ви дружите?",
      options: [
        "Більше 5 років - ми справжні старі друзі",
        "2-5 років - міцна та перевірена дружба",
        "1-2 роки - дружба активно розвивається",
        "Менше року - нова, але перспективна дружба"
      ],
      weights: {
        established: [3, 2, 1, 0],
        stable: [3, 3, 2, 1],
        growing: [2, 2, 3, 2],
        fresh: [1, 1, 2, 3]
      }
    },
    {
      question: "🤔 Що найкраще описує вашу дружбу?",
      options: [
        "Ми як дві частини одного цілого",
        "Ми доповнюємо один одного відмінностями",
        "Ми партнери по пригодах життя",
        "Ми надійна підтримка один для одного"
      ],
      weights: {
        soulmates: [3, 1, 2, 2],
        complementary: [1, 3, 2, 2],
        adventurous: [2, 2, 3, 1],
        supportive: [2, 2, 1, 3]
      }
    }
  ];

  // Quiz state
  let currentQuestion = 0;
  let answers = [];
  let quizStarted = false;

  // DOM elements
  const startBtn = document.getElementById("start-quiz");
  const introSection = document.getElementById("quiz-intro");
  const questionsSection = document.getElementById("quiz-questions");
  const resultsSection = document.getElementById("quiz-results");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const currentQuestionSpan = document.getElementById("current-question");
  const totalQuestionsSpan = document.getElementById("total-questions");
  const progressBar = document.getElementById("progress-bar");
  const prevBtn = document.getElementById("prev-question");
  const nextBtn = document.getElementById("next-question");
  const submitBtn = document.getElementById("submit-quiz");
  const retakeBtn = document.getElementById("retake-quiz");
  const shareBtn = document.getElementById("share-results");
  const resultsContainer = document.getElementById("results-container");

  // Initialize quiz
  function initQuiz() {
    totalQuestionsSpan.textContent = quizQuestions.length;
    
    startBtn.addEventListener("click", startQuiz);
    prevBtn.addEventListener("click", previousQuestion);
    nextBtn.addEventListener("click", nextQuestion);
    submitBtn.addEventListener("click", submitQuiz);
    retakeBtn.addEventListener("click", restartQuiz);
    shareBtn.addEventListener("click", shareResults);
  }

  function startQuiz() {
    quizStarted = true;
    introSection.style.display = "none";
    questionsSection.style.display = "block";
    showQuestion(0);
  }

  function showQuestion(index) {
    const question = quizQuestions[index];
    currentQuestion = index;
    
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = index + 1;
    
    // Update progress bar
    const progress = ((index + 1) / quizQuestions.length) * 100;
    progressBar.style.width = progress + "%";
    
    // Clear options
    optionsContainer.innerHTML = "";
    
    // Create option buttons
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.style.cssText = `
        background: ${answers[index] === optionIndex ? '#667eea' : '#f8f9fa'};
        color: ${answers[index] === optionIndex ? 'white' : '#333'};
        border: 2px solid ${answers[index] === optionIndex ? '#667eea' : '#e9ecef'};
        padding: 12px 15px;
        border-radius: 8px;
        cursor: pointer;
        text-align: left;
        transition: all 0.3s ease;
        font-size: 0.95em;
        line-height: 1.4;
      `;
      
      button.addEventListener("click", () => selectOption(optionIndex));
      button.addEventListener("mouseover", () => {
        if (answers[index] !== optionIndex) {
          button.style.background = '#e3f2fd';
          button.style.borderColor = '#667eea';
        }
      });
      button.addEventListener("mouseout", () => {
        if (answers[index] !== optionIndex) {
          button.style.background = '#f8f9fa';
          button.style.borderColor = '#e9ecef';
        }
      });
      
      optionsContainer.appendChild(button);
    });
    
    // Update navigation buttons
    prevBtn.style.display = index > 0 ? "inline-block" : "none";
    nextBtn.style.display = (index < quizQuestions.length - 1 && answers[index] !== undefined) ? "inline-block" : "none";
    submitBtn.style.display = (index === quizQuestions.length - 1 && answers[index] !== undefined) ? "inline-block" : "none";
  }

  function selectOption(optionIndex) {
    answers[currentQuestion] = optionIndex;
    showQuestion(currentQuestion);
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      showQuestion(currentQuestion - 1);
    }
  }

  function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
      showQuestion(currentQuestion + 1);
    }
  }

  function calculateResults() {
    const weights = {
      adventurous: 0, social: 0, relaxed: 0, creative: 0,
      communicative: 0, supportive: 0, modern: 0, empathetic: 0,
      optimistic: 0, practical: 0, intellectual: 0, loyal: 0,
      fun: 0, patient: 0, diplomatic: 0, easygoing: 0,
      intimate: 0, thoughtful: 0, genuine: 0, close: 0,
      integrated: 0, respectful: 0, independent: 0, established: 0,
      stable: 0, growing: 0, fresh: 0, soulmates: 0,
      complementary: 0
    };

    // Calculate weighted scores
    answers.forEach((answer, questionIndex) => {
      const question = quizQuestions[questionIndex];
      Object.keys(question.weights).forEach(trait => {
        weights[trait] += question.weights[trait][answer] || 0;
      });
    });

    // Calculate total score
    const maxPossibleScore = Object.keys(weights).length * 3;
    const actualScore = Object.values(weights).reduce((sum, score) => sum + score, 0);
    const compatibilityScore = Math.round((actualScore / maxPossibleScore) * 100);

    // Determine friendship type and insights
    const topTraits = Object.entries(weights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait);

    return {
      score: compatibilityScore,
      topTraits: topTraits,
      weights: weights
    };
  }

  function getCompatibilityInsights(results) {
    const { score, topTraits } = results;
    
    let level, description, advice, strengths, challenges;

    if (score >= 90) {
      level = "Ідеальна дружба";
      description = "Ви справжні найкращі друзі з видатною сумісністю! Ваші особистості ідеально доповнюють одна одну.";
      advice = "Продовжуйте цінувати та розвивати цю особливу дружбу. Ви маєте рідкісний зв'язок, який варто берегти.";
    } else if (score >= 80) {
      level = "Дуже міцна дружба";
      description = "У вас чудова дружба з міцною основою взаємодрозуміння та підтримки.";
      advice = "Ваша дружба має всі шанси стати довічною. Продовжуйте інвестувати час та енергію у ці стосунки.";
    } else if (score >= 70) {
      level = "Хороша дружба";
      description = "У вас стабільна дружба з хорошим потенціалом для подальшого зростання та поглиблення.";
      advice = "Працюйте над спільними інтересами та більш відкритим спілкуванням для зміцнення дружби.";
    } else if (score >= 60) {
      level = "Помірна дружба";
      description = "Ваша дружба потребує уваги та спільних зусиль для розвитку та зміцнення.";
      advice = "Зосередьтеся на кращому розумінні потреб один одного та знаходженні спільних точок дотику.";
    } else if (score >= 50) {
      level = "Складна дружба";
      description = "У вашій дружбі є значні відмінності, які потребують роботи та розуміння.";
      advice = "Будьте терплячими та відкритими. Працюйте над спілкуванням та взаємною повагою.";
    } else {
      level = "Проблемна дружба";
      description = "Ваша дружба стикається з основними викликами сумісності.";
      advice = "Розгляньте можливість відвертої розмови про ваші відмінності та способи їх подолання.";
    }

    // Determine strengths based on top traits
    const traitDescriptions = {
      adventurous: "пригодництво та активність",
      social: "соціальність та комунікабельність", 
      relaxed: "спокій та розслабленість",
      creative: "творчість та артистизм",
      communicative: "відкритість у спілкуванні",
      supportive: "взаємну підтримку",
      empathetic: "емпатію та розуміння",
      loyal: "вірність та довіру",
      fun: "веселощі та гумор",
      practical: "практичність та надійність"
    };

    strengths = topTraits.map(trait => traitDescriptions[trait]).filter(Boolean).join(", ");
    
    return { level, description, advice, strengths, challenges: "" };
  }

  function getScoreColor(score) {
    if (score >= 80) return "#28a745";
    if (score >= 60) return "#ffc107";
    return "#dc3545";
  }

  function submitQuiz() {
    const results = calculateResults();
    const insights = getCompatibilityInsights(results);
    const scoreColor = getScoreColor(results.score);

    questionsSection.style.display = "none";
    resultsSection.style.display = "block";

    resultsContainer.innerHTML = `
      <div class="insight-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em;">👫 Результати тесту на дружбу</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${results.score}%</div>
        <div style="font-size: 1.3em; opacity: 0.9;">${insights.level}</div>
      </div>

      <div class="insight-card" style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💚 Оцінка вашої дружби</h4>
        <p style="margin: 0 0 15px 0; line-height: 1.6; color: #495057;">${insights.description}</p>
        <p style="margin: 0; line-height: 1.6; color: #495057;"><strong>Ваші сильні сторони:</strong> ${insights.strengths}</p>
      </div>

      <div class="insight-card" style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">💡 Поради для покращення дружби</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div class="insight-card" style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">🌟 Розвиток дружби</h4>
        <ul style="margin: 0; line-height: 1.6; color: #6c757d;">
          <li>Проводьте більше якісного часу разом</li>
          <li>Підтримуйте відкрите та чесне спілкування</li>
          <li>Цініть та святкуйте унікальність один одного</li>
          <li>Будьте терплячими до відмінностей</li>
          <li>Створюйте нові спільні спогади та традиції</li>
        </ul>
      </div>

      <div class="insight-card" style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>🤝 Пам'ятайте: найкращі дружби будуються на взаємній повазі, довірі та підтримці. Кожна дружба унікальна та розвивається з часом через спільні переживання та взаєморозуміння.</em>
        </p>
      </div>
    `;
  }

  function restartQuiz() {
    currentQuestion = 0;
    answers = [];
    quizStarted = false;
    
    resultsSection.style.display = "none";
    introSection.style.display = "block";
    progressBar.style.width = "0%";
  }

  function shareResults() {
    const results = calculateResults();
    const shareText = `Я пройшов тест на найкращого друга і отримав ${results.score}% сумісності! Перевір свою дружбу на kalkulator.com.ua`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Тест на найкращого друга',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText + ' ' + window.location.href)
        .then(() => alert('Результат скопійовано в буфер обміну!'))
        .catch(() => alert('Не вдалося скопіювати результат'));
    }
  }

  // Initialize the quiz
  initQuiz();
});