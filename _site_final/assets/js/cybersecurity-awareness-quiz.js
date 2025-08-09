document.addEventListener("DOMContentLoaded", function () {
  // Quiz data
  const quizQuestions = [
    {
      question: "🎣 Який з наступних способів є НАЙКРАЩИМ для виявлення фішингового електронного листа?",
      options: [
        "Він надходить від компанії, яку ви впізнаєте",
        "У ньому є професійно виглядаюча графіка та логотипи",
        "Він створює невідкладність і запитує особисту інформацію",
        "Він надіслано на вашу робочу електронну пошту"
      ],
      correct: 2,
      explanation: "Фішингові листи часто створюють хибну невідкладність і тиснуть на вас, щоб швидко надати особисту інформацію. Законні компанії рідко запитують конфіденційну інформацію через електронну пошту."
    },
    {
      question: "🔐 Що робить пароль надійним і безпечним?",
      options: [
        "Використання вашого дня народження та імені",
        "12+ символів із змішаними літерами, цифрами та символами",
        "Звичайне слово з цифрами в кінці",
        "Використання одного і того ж паролю для кількох облікових записів"
      ],
      correct: 1,
      explanation: "Надійні паролі повинні містити принаймні 12 символів і включати комбінацію великих літер, малих літер, цифр та спеціальних символів."
    },
    {
      question: "🦠 Що таке програма-вимагач (ransomware)?",
      options: [
        "Програмне забезпечення, яке покращує продуктивність комп'ютера",
        "Тип антивірусної програми",
        "Зловмисне ПЗ, яке шифрує файли та вимагає оплату",
        "Легітимне рішення для резервного копіювання"
      ],
      correct: 2,
      explanation: "Програма-вимагач - це зловмисне програмне забезпечення, яке шифрує ваші файли та вимагає оплату (зазвичай у криптовалюті) для їх розшифрування. Це одна з найнебезпечніших кіберзагроз."
    },
    {
      question: "📱 При використанні публічного Wi-Fi, чого слід уникати?",
      options: [
        "Перевірки погоди",
        "Читання новинних веб-сайтів",
        "Онлайн-банкінгу або покупок",
        "Використання соціальних мереж"
      ],
      correct: 2,
      explanation: "Публічні мережі Wi-Fi часто незахищені та можуть відстежуватися зловмисниками. Уникайте доступу до конфіденційних облікових записів, таких як банківські, або введення особистої інформації."
    },
    {
      question: "🔗 Як можна перевірити, чи є веб-сайт безпечним?",
      options: [
        "Веб-сайт виглядає професійно",
        "У ньому є значок замка та HTTPS в URL",
        "Він швидко завантажується",
        "У ньому багато реклами"
      ],
      correct: 1,
      explanation: "Шукайте HTTPS (не просто HTTP) в URL та значок замка в адресному рядку. Це вказує на те, що з'єднання зашифроване та більш безпечне."
    },
    {
      question: "📧 Що слід робити, якщо ви отримуєте підозрілий електронний лист від вашого 'банку'?",
      options: [
        "Клікнути на посилання для підтвердження облікового запису",
        "Відповісти з інформацією про ваш обліковий запис",
        "Зв'язатися з банком безпосередньо через офіційні канали",
        "Переслати його всім вашим контактам"
      ],
      correct: 2,
      explanation: "Ніколи не довіряйте електронним листам, які стверджують, що вони від фінансових установ. Натомість зв'яжіться з банком безпосередньо, використовуючи номери телефонів або веб-сайти, які ви знаєте як легітимні."
    },
    {
      question: "🔄 Як часто слід оновлювати програмне забезпечення та операційну систему?",
      options: [
        "Раз на рік",
        "Тільки коли вони перестають працювати",
        "Як тільки стають доступні оновлення",
        "Ніколи, оновлення викликають проблеми"
      ],
      correct: 2,
      explanation: "Оновлення програмного забезпечення часто включають патчі безпеки, які виправляють вразливості. Встановлюйте оновлення швидко, щоб захиститися від нововиявлених загроз."
    },
    {
      question: "👥 Що таке соціальна інженерія в кібербезпеці?",
      options: [
        "Створення безпечних мереж",
        "Маніпулювання людьми для розкриття інформації",
        "Створення облікових записів у соціальних мережах",
        "Проектування інтерфейсів користувача"
      ],
      correct: 1,
      explanation: "Соціальна інженерія включає психологічне маніпулювання людьми, щоб обманути їх і змусити розголосити конфіденційну інформацію або виконати дії, які компрометують безпеку."
    },
    {
      question: "💾 Як часто слід створювати резервні копії важливих даних?",
      options: [
        "Ніколи, хмарного сховища достатньо",
        "Раз на кілька років",
        "Регулярно, дотримуючись правила 3-2-1",
        "Тільки перед великими оновленнями"
      ],
      correct: 2,
      explanation: "Правило 3-2-1 рекомендує мати 3 копії даних, 2 на різних носіях і 1 поза площадкою. Регулярне резервне копіювання захищає від втрати даних через хакерські атаки, збої обладнання або стихійні лиха."
    },
    {
      question: "🔓 Що таке двофакторна аутентифікація (2FA)?",
      options: [
        "Використання двох різних паролів",
        "Додатковий рівень безпеки з другим фактором верифікації",
        "Вхід до двох облікових записів одночасно",
        "Тип шифрування файлів"
      ],
      correct: 1,
      explanation: "2FA додає додатковий рівень безпеки, вимагаючи другий фактор (наприклад, код з телефону або відбиток пальця) на додаток до вашого паролю."
    },
    {
      question: "🌐 Що вказує на те, що веб-сайт може бути шахрайським?",
      options: [
        "Він використовує сучасний дизайн",
        "Орфографічні помилки та погані граматичні конструкції",
        "Він має контактну інформацію",
        "Він завантажується швидко"
      ],
      correct: 1,
      explanation: "Шахрайські веб-сайти часто містять орфографічні помилки, граматичні помилки та виглядають непрофесійно. Легітимні компанії зазвичай інвестують у якісний контент."
    },
    {
      question: "📲 Яка з наступних практик є НАЙБІЛЬШ небезпечною для мобільної безпеки?",
      options: [
        "Завантаження додатків з офіційних магазинів",
        "Встановлення додатків з невідомих джерел",
        "Використання блокування екрану",
        "Регулярне оновлення операційної системи"
      ],
      correct: 1,
      explanation: "Встановлення додатків з невідомих джерел поза офіційними магазинами додатків може призвести до встановлення зловмисного ПЗ на ваш пристрій."
    },
    {
      question: "🏠 Що слід робити для захисту домашньої мережі Wi-Fi?",
      options: [
        "Використовувати пароль за замовчуванням від роутера",
        "Встановити WPA3 шифрування та змінити пароль за замовчуванням",
        "Зробити мережу відкритою для зручності",
        "Ніколи не оновлювати прошивку роутера"
      ],
      correct: 1,
      explanation: "Захистіть домашню мережу Wi-Fi, використовуючи найсильніше доступне шифрування (WPA3), змінивши паролі за замовчуванням та регулярно оновлюючи прошивку роутера."
    },
    {
      question: "💳 Яка найбезпечніша практика для онлайн-покупок?",
      options: [
        "Зберігання інформації про кредитну картку в браузері",
        "Використання дебетових карток для всіх покупок",
        "Використання безпечних методів оплати та перевірених веб-сайтів",
        "Надання більше інформації, ніж потрібно"
      ],
      correct: 2,
      explanation: "Для онлайн-покупок використовуйте безпечні методи оплати (наприклад, кредитні картки або PayPal), купуйте тільки на перевірених веб-сайтах та уникайте зберігання фінансової інформації в браузерах."
    },
    {
      question: "🔍 Що найважливіше робити перед завантаженням додатку чи програми?",
      options: [
        "Перевіряти лише розмір файлу",
        "Читати відгуки, перевіряти розробника та дозволи",
        "Завантажувати найпершу знайдену версію",
        "Ігнорувати попередження безпеки"
      ],
      correct: 1,
      explanation: "Перед завантаженням читайте відгуки користувачів, перевіряйте репутацію розробника, переглядайте запитувані дозволи та завантажуйте тільки з офіційних джерел."
    }
  ];

  // Quiz state
  let currentQuestion = 0;
  let userAnswers = new Array(quizQuestions.length).fill(-1);
  let quizData = quizQuestions;

  // DOM elements
  const quizIntro = document.getElementById("quiz-intro");
  const quizQuestionsSection = document.getElementById("quiz-questions");
  const quizResults = document.getElementById("quiz-results");
  const answerReview = document.getElementById("answer-review");
  
  const startQuizBtn = document.getElementById("start-quiz");
  const questionContainer = document.getElementById("question-container");
  const questionCounter = document.getElementById("question-counter");
  const progressFill = document.getElementById("progress-fill");
  
  const prevBtn = document.getElementById("prev-question");
  const nextBtn = document.getElementById("next-question");
  const submitBtn = document.getElementById("submit-quiz");
  
  const finalScore = document.getElementById("final-score");
  const scoreLevel = document.getElementById("score-level");
  const correctCount = document.getElementById("correct-count");
  const totalQuestions = document.getElementById("total-questions");
  const recommendations = document.getElementById("recommendations");
  
  const retakeBtn = document.getElementById("retake-quiz");
  const reviewAnswersBtn = document.getElementById("review-answers");
  const backToResultsBtn = document.getElementById("back-to-results");
  const reviewContainer = document.getElementById("review-container");

  // Initialize quiz
  function initQuiz() {
    currentQuestion = 0;
    userAnswers = new Array(quizData.length).fill(-1);
    showSection(quizIntro);
  }

  // Show specific section
  function showSection(section) {
    [quizIntro, quizQuestionsSection, quizResults, answerReview].forEach(s => {
      s.style.display = 'none';
    });
    section.style.display = 'block';
  }

  // Start quiz
  function startQuiz() {
    showSection(quizQuestionsSection);
    displayQuestion();
  }

  // Display current question
  function displayQuestion() {
    const question = quizData[currentQuestion];
    const questionNumber = currentQuestion + 1;
    const totalQuestionsCount = quizData.length;

    // Update progress
    questionCounter.textContent = `Питання ${questionNumber} з ${totalQuestionsCount}`;
    progressFill.style.width = `${(questionNumber / totalQuestionsCount) * 100}%`;

    // Create question HTML
    questionContainer.innerHTML = `
      <div class="question-title">${question.question}</div>
      <ul class="answer-options">
        ${question.options.map((option, index) => `
          <li class="answer-option">
            <label>
              <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
              <span class="answer-text">${option}</span>
            </label>
          </li>
        `).join('')}
      </ul>
    `;

    // Add event listeners to radio buttons
    const radioButtons = questionContainer.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        userAnswers[currentQuestion] = parseInt(this.value);
        updateNavigationButtons();
      });
    });

    updateNavigationButtons();
  }

  // Update navigation buttons
  function updateNavigationButtons() {
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === quizData.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
      submitBtn.disabled = userAnswers[currentQuestion] === -1;
    } else {
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
      nextBtn.disabled = userAnswers[currentQuestion] === -1;
    }
  }

  // Navigate to previous question
  function previousQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      displayQuestion();
    }
  }

  // Navigate to next question
  function nextQuestion() {
    if (currentQuestion < quizData.length - 1 && userAnswers[currentQuestion] !== -1) {
      currentQuestion++;
      displayQuestion();
    }
  }

  // Submit quiz and show results
  function submitQuiz() {
    if (userAnswers[currentQuestion] === -1) return;

    const score = calculateScore();
    displayResults(score);
    showSection(quizResults);
  }

  // Calculate score
  function calculateScore() {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quizData[index].correct) {
        correct++;
      }
    });
    return {
      correct: correct,
      total: quizData.length,
      percentage: Math.round((correct / quizData.length) * 100)
    };
  }

  // Display results
  function displayResults(score) {
    finalScore.textContent = `${score.percentage}%`;
    correctCount.textContent = score.correct;
    totalQuestions.textContent = score.total;

    // Determine level and show appropriate styling
    let level, levelClass, levelText;
    if (score.percentage >= 80) {
      level = "Просунутий";
      levelClass = "advanced";
      levelText = "🎓 Відмінно! Ви маєте солідні знання з кібербезпеки.";
    } else if (score.percentage >= 60) {
      level = "Середній";
      levelClass = "intermediate";
      levelText = "📚 Добре! У вас є базові знання, але є місце для покращення.";
    } else {
      level = "Початківець";
      levelClass = "beginner";
      levelText = "📖 Потрібно більше навчання. Розгляньте додаткові ресурси з кібербезпеки.";
    }

    scoreLevel.textContent = level;
    scoreLevel.className = `score-level ${levelClass}`;

    // Generate recommendations
    const recommendationsHTML = generateRecommendations(score);
    recommendations.innerHTML = recommendationsHTML;
  }

  // Generate recommendations based on score
  function generateRecommendations(score) {
    let recommendationsHTML = `
      <div class="recommendation-card">
        <h6>🎯 Ваш рівень кібербезпеки: ${scoreLevel.textContent}</h6>
        <p>${scoreLevel.textContent === "Просунутий" ? 
          "🎓 Відмінно! Ви маєте солідні знання з кібербезпеки." :
          scoreLevel.textContent === "Середній" ?
          "📚 Добре! У вас є базові знання, але є місце для покращення." :
          "📖 Потрібно більше навчання. Розгляньте додаткові ресурси з кібербезпеки."
        }</p>
      </div>
    `;

    if (score.percentage < 100) {
      recommendationsHTML += `
        <div class="recommendation-card">
          <h6>💡 Рекомендації для покращення:</h6>
          <ul>
            <li>🔐 <strong>Паролі:</strong> Використовуйте менеджер паролів і унікальні надійні паролі</li>
            <li>🔄 <strong>Оновлення:</strong> Регулярно оновлюйте всі пристрої та програми</li>
            <li>🎣 <strong>Фішинг:</strong> Навчіться розпізнавати підозрілі електронні листи</li>
            <li>🔒 <strong>2FA:</strong> Увімкніть двофакторну аутентифікацію скрізь, де можливо</li>
            <li>💾 <strong>Резервні копії:</strong> Регулярно створюйте резервні копії важливих даних</li>
            <li>📚 <strong>Освіта:</strong> Продовжуйте вивчати найновіші загрози та захист</li>
          </ul>
        </div>
      `;
    }

    if (score.percentage >= 80) {
      recommendationsHTML += `
        <div class="recommendation-card">
          <h6>🌟 Продовжуйте в тому ж дусі!</h6>
          <p>Ваші знання з кібербезпеки на високому рівні. Продовжуйте слідкувати за новими загрозами та ділитеся знаннями з іншими!</p>
        </div>
      `;
    }

    return recommendationsHTML;
  }

  // Show answer review
  function showAnswerReview() {
    let reviewHTML = '';
    
    quizData.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correct;
      const isCorrect = userAnswer === correctAnswer;

      reviewHTML += `
        <div class="review-item">
          <div class="review-question">${index + 1}. ${question.question}</div>
          <div class="review-answer user-answer">
            <strong>Ваша відповідь:</strong> ${question.options[userAnswer]} ${isCorrect ? '✅' : '❌'}
          </div>
          ${!isCorrect ? `
            <div class="review-answer correct">
              <strong>Правильна відповідь:</strong> ${question.options[correctAnswer]} ✅
            </div>
          ` : ''}
          <div class="review-explanation">
            <strong>Пояснення:</strong> ${question.explanation}
          </div>
        </div>
      `;
    });

    reviewContainer.innerHTML = reviewHTML;
    showSection(answerReview);
  }

  // Retake quiz
  function retakeQuiz() {
    initQuiz();
  }

  // Event listeners
  startQuizBtn.addEventListener("click", startQuiz);
  prevBtn.addEventListener("click", previousQuestion);
  nextBtn.addEventListener("click", nextQuestion);
  submitBtn.addEventListener("click", submitQuiz);
  retakeBtn.addEventListener("click", retakeQuiz);
  reviewAnswersBtn.addEventListener("click", showAnswerReview);
  backToResultsBtn.addEventListener("click", () => showSection(quizResults));

  // Initialize
  initQuiz();
});