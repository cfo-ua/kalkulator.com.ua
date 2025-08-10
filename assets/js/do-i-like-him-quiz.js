document.addEventListener("DOMContentLoaded", function () {
  // Quiz questions for "Do I like him?"
  const quizQuestions = [
    {
      question: "💭 Як часто ви думаєте про нього протягом дня?",
      options: [
        "Постійно, він у моїх думках майже весь час",
        "Кілька разів на день, особливо коли нічого не роблю",
        "Іноді згадую, коли щось нагадує про нього",
        "Рідко думаю про нього, тільки коли бачу"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "😊 Як ви почуваєтеся, коли бачите його?",
      options: [
        "Відчуваю хвилювання та 'метеликів' у животі",
        "Радію та усміхаюся, настрій піднімається",
        "Відчуваю себе комфортно та щасливо",
        "Почуваюся нормально, як з будь-яким другом"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "👗 Як ви готуєтеся, знаючи що побачите його?",
      options: [
        "Ретельно вибираю одяг та приділяю особливу увагу зовнішності",
        "Намагаюся виглядати трохи краще, ніж зазвичай",
        "Одягаюся як завжди, але слідкую за охайністю",
        "Не змінюю звичної підготовки"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📱 Як ви реагуєте на його повідомлення?",
      options: [
        "Одразу читаю та швидко відповідаю з хвилюванням",
        "Радію повідомленню та відповідаю з ентузіазмом",
        "Відповідаю дружелюбно протягом розумного часу",
        "Відповідаю коли зручно, без особливих емоцій"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🌙 Чи мрієте ви про нього або уявляєте романтичні сценарії?",
      options: [
        "Так, часто фантазую про романтичні моменти з ним",
        "Іноді уявляю, як ми могли б бути разом",
        "Рідко, але траплялися такі думки",
        "Ніколи не думала про нього в романтичному ключі"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "😤 Як ви реагуєте, коли він спілкується з іншими дівчатами?",
      options: [
        "Відчуваю ревнощі та дискомфорт",
        "Трохи засмучуюся або хвилююся",
        "Помічаю, але особливо не переживаю",
        "Мене це зовсім не турбує"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🎯 Як важливо для вас його думка про вас?",
      options: [
        "Дуже важливо, хочу справити на нього хороше враження",
        "Досить важливо, намагаюся бути на висоті",
        "Помірно важливо, як і думка інших друзів",
        "Не більш важливо за думку будь-кого іншого"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📅 Як ви ставитеся до можливості провести з ним час?",
      options: [
        "Завжди радію можливості бути з ним наодинці",
        "Подобається проводити з ним час разом",
        "Приємно спілкуватися в компанії друзів",
        "Ставлюся нейтрально, як до спілкування з другом"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💫 Чи готові ви змінювати свої плани заради нього?",
      options: [
        "Так, часто переношу інші справи, щоб побути з ним",
        "Іноді можу змінити плани, якщо це важливо",
        "Рідко, тільки якщо нічого важливого не заплановано",
        "Ніколи не змінюю плани заради нього"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🔮 Як ви уявляєте майбутнє з ним?",
      options: [
        "Часто думаю про серйозні стосунки та спільне майбутнє",
        "Іноді уявляю, як ми могли б бути парою",
        "Думаю про нього як про потенційного партнера",
        "Бачу його тільки як друга, не більше"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "❤️ Що найкраще описує ваші почуття до нього?",
      options: [
        "Відчуваю глибокий емоційний зв'язок та пристрасть",
        "Сильна симпатія з романтичними нотками",
        "Приязнь з легкими романтичними почуттями",
        "Дружні почуття без романтичного підтексту"
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
        background: ${answers[index] === optionIndex ? '#88d8a3' : '#f8f9fa'};
        color: ${answers[index] === optionIndex ? 'white' : '#333'};
        border: 2px solid ${answers[index] === optionIndex ? '#88d8a3' : '#e9ecef'};
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
          button.style.background = '#e8f5e8';
          button.style.borderColor = '#88d8a3';
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

  function getEmotionalInsights(score) {
    let level, description, advice, emoji;

    if (score >= 90) {
      level = "Сильне кохання";
      emoji = "💕";
      description = "Ви точно закохані! Ваші емоції, думки та поведінка ясно вказують на глибокі романтичні почуття. Він не просто подобається вам - ви його кохаєте.";
      advice = "Ваші почуття справжні та глибокі. Розгляньте можливість відвертої розмови з ним про ваші емоції. Не бійтеся показувати свої почуття та бути вразливою.";
    } else if (score >= 80) {
      level = "Виразна романтична прихильність";
      emoji = "😍";
      description = "Ви маєте серйозні романтичні почуття до нього! Це більше за просту симпатію - ваші емоції мають глибину та інтенсивність справжньої прихильності.";
      advice = "Ваші почуття розвиваються у напрямку кохання. Дайте собі час краще пізнати його та розвивайте емоційний зв'язок. Розгляньте можливість наближення до нього.";
    } else if (score >= 70) {
      level = "Помітна романтична симпатія";
      emoji = "😊";
      description = "Він вам визначено подобається в романтичному плані! Ваші почуття виходять за межі дружби та мають романтичний характер.";
      advice = "Ваша симпатія має потенціал розвинутися в щось більше. Проводьте більше часу разом, пізнавайте один одного глибше та дивіться, як розвиваються ваші емоції.";
    } else if (score >= 60) {
      level = "Помірна зацікавленість";
      emoji = "🤔";
      description = "Ви відчуваєте до нього більше за дружні почуття, але ваші романтичні емоції ще не повністю сформовані або ви їх не повністю усвідомлюєте.";
      advice = "Дайте собі час зрозуміти свої почуття. Спостерігайте за своїми емоціями, проводьте час разом та дозвольте почуттям розвинутися природно.";
    } else if (score >= 50) {
      level = "Дружня симпатія";
      emoji = "😐";
      description = "Ваші почуття до нього більше схожі на міцну дружбу. Можливо, ви цінуєте його як друга, але романтичні емоції поки що мінімальні.";
      advice = "Це нормально! Не всі стосунки мають бути романтичними. Цініть дружбу з ним, і якщо почуття зміняться - це теж буде природно.";
    } else {
      level = "Мінімальний романтичний інтерес";
      emoji = "😌";
      description = "Ваші почуття до нього переважно платонічні. Ви, імовірно, бачите в ньому хорошого друга або знайомого, але без романтичного підтексту.";
      advice = "Дружба - це прекрасно! Не відчувайте тиску створювати романтичні почуття там, де їх немає. Цініть те, що маєте, та будьте відкритими до справжнього кохання з кимось іншим.";
    }

    return { level, description, advice, emoji };
  }

  function getScoreColor(score) {
    if (score >= 80) return "#28a745";
    if (score >= 60) return "#ffc107";
    if (score >= 40) return "#fd7e14";
    return "#6c757d";
  }

  function submitQuiz() {
    const results = calculateResults();
    const insights = getEmotionalInsights(results.score);
    const scoreColor = getScoreColor(results.score);

    questionsSection.style.display = "none";
    resultsSection.style.display = "block";

    resultsContainer.innerHTML = `
      <div class="insight-card" style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%); color: #333; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em; color: #2d5a47;">${insights.emoji} Аналіз ваших почуттів</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${results.score}%</div>
        <div style="font-size: 1.3em; opacity: 0.8; color: #2d5a47;">${insights.level}</div>
      </div>

      <div class="insight-card" style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💚 Розуміння ваших емоцій</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.description}</p>
      </div>

      <div class="insight-card" style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">💡 Поради щодо ваших почуттів</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div class="insight-card" style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">🌟 Загальні поради про почуття</h4>
        <ul style="margin: 0; line-height: 1.6; color: #6c757d;">
          <li>Будьте чесними з собою щодо ваших емоцій</li>
          <li>Не бійтеся почуттів - вони природна частина життя</li>
          <li>Дайте собі час зрозуміти глибину емоцій</li>
          <li>Довіряйте своїй інтуїції та серцю</li>
          <li>Пам'ятайте: кожна емоція має свою цінність</li>
        </ul>
      </div>

      <div class="insight-card" style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>💝 Пам'ятайте: розуміння власних почуттів - це важливий крок у особистому зростанні. Незалежно від результату, ваші емоції важливі та заслуговують на повагу. Будьте терплячими до себе та відкритими до нових можливостей!</em>
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
    const shareText = `Я пройшла тест "Чи подобається мені він?" і дізналася більше про свої почуття! Проведи самоаналіз на kalkulator.com.ua`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Тест "Чи подобається мені він?"',
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