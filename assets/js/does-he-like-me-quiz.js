document.addEventListener("DOMContentLoaded", function () {
  // Quiz questions for "Does he like me?"
  const quizQuestions = [
    {
      question: "👀 Як часто він дивиться на вас під час розмови?",
      options: [
        "Постійно підтримує зоровий контакт та усміхається",
        "Часто дивиться, але іноді відводить погляд",
        "Дивиться час від часу, більше на телефон або навколо",
        "Рідко дивиться в очі, здається відстороненим"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💬 Хто зазвичай ініціює ваше спілкування?",
      options: [
        "Він часто пише першим і шукає причини для розмови",
        "Ми обидва ініціюємо спілкування приблизно порівну",
        "Я частіше пишу першою, він відповідає",
        "Я майже завжди ініціюю розмови"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📱 Як швидко він відповідає на ваші повідомлення?",
      options: [
        "Зазвичай відповідає протягом кількох хвилин",
        "Відповідає протягом години, навіть якщо зайнятий",
        "Відповідає через кілька годин або наступного дня",
        "Часто залишає повідомлення без відповіді"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🤗 Як він поводиться, коли ви поряд з іншими людьми?",
      options: [
        "Намагається привернути мою увагу та більше спілкується зі мною",
        "Включає мене в розмови та звертає на мене увагу",
        "Поводиться як зазвичай, але дружелюбно",
        "Здається менш уважним або більше зосереджується на інших"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💭 Чи пам'ятає він деталі ваших розмов?",
      options: [
        "Пам'ятає навіть дрібні деталі того, що я розповідала",
        "Згадує важливі речі та цікавиться моїми справами",
        "Пам'ятає основне, але може забувати деталі",
        "Часто забуває те, про що ми говорили"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🎯 Чи намагається він справити на вас враження?",
      options: [
        "Очевидно намагається виглядати краще та розповідає про досягнення",
        "Іноді хвалиться або розказує цікаві історії",
        "Поводиться природно, але позитивно",
        "Не помічаю особливих намагань справити враження"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📅 Як він ставиться до спільних планів?",
      options: [
        "Сам пропонує зустрічі та активності разом",
        "Охоче погоджується на мої пропозиції",
        "Іноді погоджується, якщо йому зручно",
        "Рідко доступний або часто скасовує плани"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "😊 Як він реагує на ваші жарти або коментарі?",
      options: [
        "Завжди сміється та позитивно реагує на мій гумор",
        "Часто сміється та підтримує розмову",
        "Усміхається ввічливо, але не завжди активно реагує",
        "Рідко сміється або здається не зрозумілим мій гумор"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🔍 Чи цікавиться він вашим особистим життям?",
      options: [
        "Часто запитує про мої плани, почуття та стосунки",
        "Іноді цікавиться моїм життям та самопочуттям",
        "Слухає, коли я розповідаю, але сам рідко запитує",
        "Здається байдужим до моєї особистої інформації"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🤲 Чи пропонує він вам допомогу?",
      options: [
        "Часто пропонує допомогу та турбується про мене",
        "Готовий допомогти, коли я прошу",
        "Іноді допомагає, якщо це не складно",
        "Рідко пропонує допомогу або здається незацікавленим"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💫 Як він поводиться, коли ви згадуєте інших хлопців?",
      options: [
        "Помітно напружується або намагається змінити тему",
        "Ставить додаткові запитання або здається зацікавленим",
        "Слухає нейтрально, без особливих реакцій",
        "Здається байдужим або навіть заохочує"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🌟 Яке загальне враження від його ставлення до вас?",
      options: [
        "Він явно особливо ставиться до мене порівняно з іншими",
        "Відчуваю, що я йому подобаюся більше як друг",
        "Ставиться дружелюбно, але важко сказати чи особливо",
        "Ставиться ввічливо, але дистанційно"
      ],
      scores: [4, 3, 2, 1]
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
        background: ${answers[index] === optionIndex ? '#ff6b9d' : '#f8f9fa'};
        color: ${answers[index] === optionIndex ? 'white' : '#333'};
        border: 2px solid ${answers[index] === optionIndex ? '#ff6b9d' : '#e9ecef'};
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
          button.style.background = '#fce4ec';
          button.style.borderColor = '#ff6b9d';
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
    let totalScore = 0;
    const maxScore = quizQuestions.length * 4;

    answers.forEach((answer, questionIndex) => {
      const question = quizQuestions[questionIndex];
      totalScore += question.scores[answer];
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    return { score: percentage, totalScore, maxScore };
  }

  function getCompatibilityInsights(score) {
    let level, description, advice, emoji;

    if (score >= 90) {
      level = "Сильні романтичні почуття";
      emoji = "💕";
      description = "Усі ознаки вказують на те, що ви йому дуже подобаєтеся! Його поведінка явно демонструє романтичний інтерес та бажання поглибити стосунки з вами.";
      advice = "Це чудові новини! Ви можете бути більш впевненими у виявленні взаємного інтересу. Розгляньте можливість відвертої розмови про ваші почуття або створення більш романтичної атмосфери.";
    } else if (score >= 80) {
      level = "Виразна симпатія";
      emoji = "😍";
      description = "Є дуже хороші ознаки того, що ви йому подобаєтеся! Його поведінка показує значний інтерес та увагу до вас, що вказує на романтичні почуття.";
      advice = "Продовжуйте розвивати стосунки! Намагайтеся проводити більше часу разом, створюйте можливості для приватного спілкування та не бійтеся показувати взаємний інтерес.";
    } else if (score >= 70) {
      level = "Помітна зацікавленість";
      emoji = "😊";
      description = "Є хороші ознаки симпатії! Він проявляє до вас більший інтерес, ніж до звичайних знайомих, що може означати початок романтичних почуттів.";
      advice = "Це позитивні сигнали! Спробуйте поглибити спілкування, знайдіть спільні інтереси та створіть більше можливостей для особистого контакту.";
    } else if (score >= 60) {
      level = "Помірна симпатія";
      emoji = "🤔";
      description = "Є деякі ознаки зацікавленості, але вони не дуже виразні. Можливо, він ще не впевнений у своїх почуттях або боїться показати їх.";
      advice = "Потрібно більше часу та спостереження. Спробуйте бути більш відкритою, показувати зацікавленість та створювати комфортну атмосферу для спілкування.";
    } else if (score >= 50) {
      level = "Невизначеність";
      emoji = "😐";
      description = "Сигнали змішані і важко зрозуміти його справжні почуття. Можливо, він розглядає вас більше як подругу або ще не визначився.";
      advice = "Не переживайте! Романтичні почуття розвиваються по-різному. Зосередьтеся на побудові міцної дружби та довіри, що може стати основою для глибших стосунків.";
    } else {
      level = "Мінімальний романтичний інтерес";
      emoji = "😔";
      description = "На даний момент ознаки романтичного інтересу мінімальні. Імовірно, він сприймає вас як хорошу подругу або просто знайому.";
      advice = "Це не означає кінець! Люди змінюються, а почуття можуть розвинутися з часом. Зосередьтеся на особистому зростанні та знайдіть когось, хто оцінить вас за заслугами.";
    }

    return { level, description, advice, emoji };
  }

  function getScoreColor(score) {
    if (score >= 80) return "#28a745";
    if (score >= 60) return "#ffc107";
    if (score >= 40) return "#fd7e14";
    return "#dc3545";
  }

  function submitQuiz() {
    const results = calculateResults();
    const insights = getCompatibilityInsights(results.score);
    const scoreColor = getScoreColor(results.score);

    questionsSection.style.display = "none";
    resultsSection.style.display = "block";

    resultsContainer.innerHTML = `
      <div class="insight-card" style="background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em;">${insights.emoji} Результат аналізу</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${results.score}%</div>
        <div style="font-size: 1.3em; opacity: 0.9;">${insights.level}</div>
      </div>

      <div class="insight-card" style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💖 Аналіз його почуттів</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.description}</p>
      </div>

      <div class="insight-card" style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">💡 Поради для розвитку стосунків</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div class="insight-card" style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">🌟 Загальні поради</h4>
        <ul style="margin: 0; line-height: 1.6; color: #6c757d;">
          <li>Будьте собою - автентичність привабливіша за маски</li>
          <li>Показуйте зацікавленість його життям та інтересами</li>
          <li>Створюйте можливості для спільного проведення часу</li>
          <li>Не бійтеся взяти ініціативу у спілкуванні</li>
          <li>Довіряйте своїй інтуїції та спостереженням</li>
        </ul>
      </div>

      <div class="insight-card" style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>💝 Пам'ятайте: кожна людина унікальна і виражає почуття по-своєму. Найкращий спосіб дізнатися про справжні почуття - це відвертe та чесне спілкування. Довіряйте собі і будьте відкритими до нових можливостей!</em>
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
    const shareText = `Я пройшла тест "Чи подобаюся я йому?" і отримала ${results.score}%! Перевір свої романтичні шанси на kalkulator.com.ua`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Тест "Чи подобаюся я йому?"',
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