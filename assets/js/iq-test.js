document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    // IQ Test data
    const iqTestQuestions = [
    {
      question: "🔢 Продовжте числову послідовність: 2, 6, 18, 54, ?",
      options: [
        "108",
        "162", 
        "144",
        "216"
      ],
      correct: 1,
      explanation: "Кожне число множиться на 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
    },
    {
      question: "🔄 Яке число має таке ж відношення до 8, як 3 до 12?",
      options: [
        "2",
        "4",
        "6", 
        "1"
      ],
      correct: 0,
      explanation: "3:12 = 1:4, тому x:8 = 1:4, звідки x = 2"
    },
    {
      question: "🎯 Якщо всі блумпи - це кранги, а деякі кранги - це флупи, то:",
      options: [
        "Всі флупи - це блумпи",
        "Деякі блумпи можуть бути флупами",
        "Жодні флупи не є блумпами",
        "Всі кранги - це флупи"
      ],
      correct: 1,
      explanation: "З умови випливає, що деякі блумпи (через кранги) можуть бути флупами, але не обов'язково всі"
    },
    {
      question: "🧩 Оберіть фігуру, яка логічно продовжує ряд: ○, △, □, ○, △, ?",
      options: [
        "○",
        "△", 
        "□",
        "◇"
      ],
      correct: 2,
      explanation: "Послідовність повторюється: коло, трикутник, квадрат, коло, трикутник, квадрат"
    },
    {
      question: "📐 Скільки кубиків потрібно, щоб побудувати куб 4×4×4?",
      options: [
        "48",
        "64",
        "56", 
        "72"
      ],
      correct: 1,
      explanation: "Куб 4×4×4 складається з 4³ = 64 маленьких кубиків"
    },
    {
      question: "🔤 'КІША' відноситься до 'ШИКА', як 'МОРЕ' відноситься до:",
      options: [
        "ЕРОМ",
        "РЕМ", 
        "РОМЄ",
        "ЕРОМ"
      ],
      correct: 0,
      explanation: "Літери переставляються у зворотному порядку: КІША → ШИКА, МОРЕ → ЕРОМ"
    },
    {
      question: "⏰ Які дві наступні літери у послідовності: А, Г, Є, З, К, ?",
      options: [
        "М, О",
        "Л, Н",
        "М, П", 
        "Н, Р"
      ],
      correct: 2,
      explanation: "Послідовність йде через одну літеру алфавіту: А(+2)Г(+2)Є(+2)З(+2)К(+2)М(+2)П"
    },
    {
      question: "🎲 Якщо код слова 'НЕБО' дорівнює 14515, то код слова 'ПОЛЕ' дорівнює:",
      options: [
        "16125",
        "17135", 
        "18145",
        "15235"
      ],
      correct: 0,
      explanation: "Н=14, Е=5, Б=2, О=15 → П=16, О=15, Л=12, Е=5 → 16125"
    },
    {
      question: "🔺 Яка фігура зайва в групі: квадрат, трикутник, коло, прямокутник?",
      options: [
        "Квадрат",
        "Трикутник",
        "Коло", 
        "Прямокутник"
      ],
      correct: 2,
      explanation: "Коло - єдина фігура без кутів, інші мають кути"
    },
    {
      question: "🧮 Якщо 2 + 3 = 10, 6 + 5 = 66, то 4 + 7 = ?",
      options: [
        "44",
        "28",
        "77", 
        "84"
      ],
      correct: 0,
      explanation: "Формула: (a + b) × a = результат. 2+3=5, 5×2=10; 6+5=11, 11×6=66; 4+7=11, 11×4=44"
    },
    {
      question: "📏 Довжина тіні дерева 15 м, а довжина тіні палки 1.5 м дорівнює 3 м. Яка висота дерева?",
      options: [
        "7.5 м",
        "10 м",
        "30 м",
        "22.5 м"
      ],
      correct: 0,
      explanation: "Пропорція: 1.5:3 = x:15, звідки x = (1.5 × 15) ÷ 3 = 7.5 м"
    },
    {
      question: "🎨 Якщо червоний + синій = фіолетовий, жовтий + синій = зелений, то червоний + жовтий = ?",
      options: [
        "Помаранчевий",
        "Рожевий", 
        "Коричневий",
        "Фіолетовий"
      ],
      correct: 0,
      explanation: "Змішування основних кольорів: червоний + жовтий = помаранчевий"
    },
    {
      question: "⚖️ На терезах: 3 яблука = 6 груш, 2 груші = 4 сливи. Скільки слив дорівнює 1 яблуку?",
      options: [
        "2",
        "3",
        "4", 
        "6"
      ],
      correct: 2,
      explanation: "1 яблуко = 2 груші, 1 груша = 2 сливи, отже 1 яблуко = 4 сливи"
    },
    {
      question: "🔍 Знайдіть закономірність: 1, 4, 9, 16, 25, ?",
      options: [
        "30",
        "35",
        "36", 
        "49"
      ],
      correct: 2,
      explanation: "Це квадрати чисел: 1², 2², 3², 4², 5², 6² = 36"
    },
    {
      question: "🏠 У будинку 4 поверхи. На першому живе 2 сім'ї, на кожному наступному - в 2 рази більше. Скільки сімей на 4-му поверсі?",
      options: [
        "8",
        "12",
        "16", 
        "24"
      ],
      correct: 2,
      explanation: "1-й: 2, 2-й: 4, 3-й: 8, 4-й: 16 сімей"
    },
    {
      question: "🔄 Яке число пропущено: 100, 95, 85, 70, 50, ?",
      options: [
        "25",
        "30",
        "35",
        "20"
      ],
      correct: 0,
      explanation: "Віднімаємо: -5, -10, -15, -20, -25. Наступне число: 50-25=25"
    },
    {
      question: "🧩 Логічна задача: Якщо А більше Б, Б більше В, а В дорівнює Г, то:",
      options: [
        "А = Г",
        "А > Г", 
        "А < Г",
        "Неможливо визначити"
      ],
      correct: 1,
      explanation: "А > Б > В = Г, отже А > Г"
    },
    {
      question: "🎯 Продовжте ряд: Z, Y, X, W, V, ?",
      options: [
        "T",
        "S",
        "U", 
        "R"
      ],
      correct: 2,
      explanation: "Алфавіт у зворотному порядку: Z, Y, X, W, V, U"
    },
    {
      question: "⭐ У коробці 60 кульок: 20 червоних, 15 синіх, решта жовті. Яка ймовірність витягнути жовту кульку?",
      options: [
        "25%",
        "41.7%", 
        "50%",
        "33.3%"
      ],
      correct: 1,
      explanation: "Жовтих кульок: 60-20-15=25. Ймовірність: 25/60 = 0.417 = 41.7%"
    },
    {
      question: "🧠 Останнє завдання: Якщо всі правила мають винятки, то це правило:",
      options: [
        "Має виняток",
        "Не має винятку", 
        "Суперечить собі",
        "Невизначене"
      ],
      correct: 2,
      explanation: "Це класичний парадокс: якщо правило 'всі правила мають винятки' має виняток, то воно суперечить собі"
    }
  ];

  let iqCurrentQuestion = 0;
  let iqUserAnswers = [];
  let iqQuizData = {
    questions: iqTestQuestions,
    iqUserAnswers: [],
    score: 0,
    startTime: null,
    endTime: null
  };

  // DOM elements
  const startButton = document.getElementById("start-quiz");
  const quizIntro = document.getElementById("quiz-intro");
  const quizQuestions = document.getElementById("quiz-questions");
  const quizResults = document.getElementById("quiz-results");
  const answerReview = document.getElementById("answer-review");
  const questionContainer = document.getElementById("question-container");
  const questionCounter = document.getElementById("question-counter");
  const progressFill = document.getElementById("progress-fill");
  const prevButton = document.getElementById("prev-question");
  const nextButton = document.getElementById("next-question");
  const submitButton = document.getElementById("submit-quiz");
  const finalScore = document.getElementById("final-score");
  const scoreLevel = document.getElementById("score-level");
  const correctCount = document.getElementById("correct-count");
  const totalQuestions = document.getElementById("total-questions");
  const accuracyPercentage = document.getElementById("accuracy-percentage");
  const recommendations = document.getElementById("recommendations");
  const retakeButton = document.getElementById("retake-quiz");
  const reviewButton = document.getElementById("review-answers");
  const reviewContainer = document.getElementById("review-container");
  const backToResults = document.getElementById("back-to-results");

  // Initialize quiz
  function initQuiz() {
    iqCurrentQuestion = 0;
    iqUserAnswers = [];
    iqQuizData.iqUserAnswers = [];
    iqQuizData.score = 0;
    iqQuizData.startTime = new Date();
    
    // Show first question
    showQuestion();
    updateProgress();
    updateNavigation();
    
    // Show quiz questions section
    quizIntro.style.display = "none";
    quizQuestions.style.display = "block";
    quizResults.style.display = "none";
    answerReview.style.display = "none";
  }

  function showQuestion() {
    const question = iqQuizData.questions[iqCurrentQuestion];
    
    questionContainer.innerHTML = `
      <div class="question-title">${question.question}</div>
      <ul class="answer-options">
        ${question.options.map((option, index) => `
          <li class="answer-option">
            <label>
              <input type="radio" name="answer" value="${index}" ${iqUserAnswers[iqCurrentQuestion] === index ? 'checked' : ''}>
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
        iqUserAnswers[iqCurrentQuestion] = parseInt(this.value);
        updateNavigation();
      });
    });
  }

  function updateProgress() {
    const progress = ((iqCurrentQuestion + 1) / iqQuizData.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    questionCounter.textContent = `Завдання ${iqCurrentQuestion + 1} з ${iqQuizData.questions.length}`;
  }

  function updateNavigation() {
    prevButton.disabled = iqCurrentQuestion === 0;
    
    const isLastQuestion = iqCurrentQuestion === iqQuizData.questions.length - 1;
    const hasAnswer = iqUserAnswers[iqCurrentQuestion] !== undefined;
    
    if (isLastQuestion) {
      nextButton.style.display = "none";
      submitButton.style.display = hasAnswer ? "block" : "none";
    } else {
      nextButton.style.display = "block";
      nextButton.disabled = !hasAnswer;
      submitButton.style.display = "none";
    }
  }

  function calculateIQ() {
    let correctAnswers = 0;
    
    iqQuizData.questions.forEach((question, index) => {
      if (iqUserAnswers[index] === question.correct) {
        correctAnswers++;
      }
    });

    // IQ calculation based on percentage correct
    // Standard IQ scale: average = 100, standard deviation = 15
    const percentage = correctAnswers / iqQuizData.questions.length;
    let iq;
    
    if (percentage >= 0.95) iq = 140;      // Genius level
    else if (percentage >= 0.90) iq = 130; // Very superior
    else if (percentage >= 0.80) iq = 120; // Superior
    else if (percentage >= 0.70) iq = 110; // Above average
    else if (percentage >= 0.40) iq = 100; // Average
    else if (percentage >= 0.30) iq = 90;  // Below average
    else if (percentage >= 0.20) iq = 80;  // Low average
    else iq = 70;                          // Below normal

    iqQuizData.score = iq;
    iqQuizData.iqUserAnswers = [...iqUserAnswers];
    iqQuizData.endTime = new Date();
    
    return {
      iq: iq,
      correctAnswers: correctAnswers,
      totalQuestions: iqQuizData.questions.length,
      percentage: Math.round(percentage * 100)
    };
  }

  function getIQLevel(iq) {
    if (iq >= 130) return { text: "Геніальний рівень", class: "genius" };
    if (iq >= 120) return { text: "Вищий за норму", class: "superior" };
    if (iq >= 110) return { text: "Вище середнього", class: "above-average" };
    if (iq >= 90) return { text: "Середній рівень", class: "average" };
    if (iq >= 80) return { text: "Нижче середнього", class: "below-average" };
    return { text: "Низький рівень", class: "low" };
  }

  function generateRecommendations(results) {
    const recommendations = [];
    
    if (results.iq >= 130) {
      recommendations.push({
        title: "🎓 Розвиток талантів",
        content: "Ваш виняткове інтелектуальний рівень дозволяє досягати видатних результатів. Розгляньте можливість навчання у престижних закладах або участь у наукових дослідженнях."
      });
    } else if (results.iq >= 120) {
      recommendations.push({
        title: "📚 Академічні досягнення",
        content: "Ваш високий рівень інтелекту відкриває широкі можливості для навчання та кар'єри. Розгляньте складні академічні програми або керівні позиції."
      });
    } else if (results.iq >= 110) {
      recommendations.push({
        title: "💼 Професійний розвиток",
        content: "Ваш рівень інтелекту вище середнього. Зосередьтеся на розвитку спеціалізованих навичок у вашій галузі та лідерських якостей."
      });
    } else if (results.iq >= 90) {
      recommendations.push({
        title: "🌱 Постійне навчання",
        content: "Ваш середній рівень інтелекту є хорошою основою для розвитку. Зосередьтеся на постійному навчанні та практичному застосуванні знань."
      });
    } else {
      recommendations.push({
        title: "🎯 Розвиток навичок",
        content: "Розгляньте можливість додаткового навчання та тренування когнітивних навичок. Читання, головоломки та логічні ігри можуть допомогти покращити результати."
      });
    }

    // Add general recommendations based on performance in different areas
    if (results.percentage < 60) {
      recommendations.push({
        title: "🧩 Логічне мислення",
        content: "Практикуйтеся у розв'язанні логічних головоломок, судоку та інших завдань на розвиток аналітичного мислення."
      });
    }

    recommendations.push({
      title: "📖 Загальні поради",
      content: "Регулярне читання, вивчення нових мов, музичні інструменти та фізичні вправи сприяють розвитку інтелекту та когнітивних функцій."
    });

    return recommendations;
  }

  function showResults() {
    const results = calculateIQ();
    const level = getIQLevel(results.iq);
    
    // Update score display
    finalScore.textContent = results.iq;
    scoreLevel.textContent = level.text;
    scoreLevel.className = `score-level ${level.class}`;
    
    // Update breakdown
    correctCount.textContent = results.correctAnswers;
    totalQuestions.textContent = results.totalQuestions;
    accuracyPercentage.textContent = `${results.percentage}%`;
    
    // Generate and show recommendations
    const recs = generateRecommendations(results);
    recommendations.innerHTML = recs.map(rec => `
      <div class="recommendation-card">
        <h6>${rec.title}</h6>
        <p>${rec.content}</p>
      </div>
    `).join('');
    
    // Show results section
    quizQuestions.style.display = "none";
    quizResults.style.display = "block";
  }

  function showReview() {
    reviewContainer.innerHTML = iqQuizData.questions.map((question, index) => {
      const userAnswer = iqQuizData.iqUserAnswers[index];
      const isCorrect = userAnswer === question.correct;
      
      return `
        <div class="review-item">
          <div class="review-question">${question.question}</div>
          <div class="review-answer user-answer">
            <strong>Ваша відповідь:</strong> ${userAnswer !== undefined ? question.options[userAnswer] : 'Не відповіли'}
            ${isCorrect ? '<span style="color: #28a745;">✓ Правильно</span>' : '<span style="color: #dc3545;">✗ Неправильно</span>'}
          </div>
          ${!isCorrect ? `<div class="review-answer correct">
            <strong>Правильна відповідь:</strong> ${question.options[question.correct]}
          </div>` : ''}
          <div class="review-explanation">${question.explanation}</div>
        </div>
      `;
    }).join('');
    
    quizResults.style.display = "none";
    answerReview.style.display = "block";
  }

  function resetQuiz() {
    iqCurrentQuestion = 0;
    iqUserAnswers = [];
    iqQuizData.iqUserAnswers = [];
    iqQuizData.score = 0;
    
    quizResults.style.display = "none";
    answerReview.style.display = "none";
    quizIntro.style.display = "block";
  }

  // Event listeners
  startButton.addEventListener("click", initQuiz);
  
  prevButton.addEventListener("click", function() {
    if (iqCurrentQuestion > 0) {
      iqCurrentQuestion--;
      showQuestion();
      updateProgress();
      updateNavigation();
    }
  });
  
  nextButton.addEventListener("click", function() {
    if (iqCurrentQuestion < iqQuizData.questions.length - 1 && iqUserAnswers[iqCurrentQuestion] !== undefined) {
      iqCurrentQuestion++;
      showQuestion();
      updateProgress();
      updateNavigation();
    }
  });
  
  submitButton.addEventListener("click", function() {
    showResults();
  });
  
  retakeButton.addEventListener("click", resetQuiz);
  reviewButton.addEventListener("click", showReview);
  backToResults.addEventListener("click", function() {
    answerReview.style.display = "none";
    quizResults.style.display = "block";
  });
  })(); // End namespace wrapper
});