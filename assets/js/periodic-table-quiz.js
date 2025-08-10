document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    // Periodic Table Quiz data
    const periodicTableQuestions = [
      {
        question: "🧪 Який хімічний символ має елемент Водень?",
        options: ["H", "He", "W", "Hy"],
        correct: 0,
        category: "symbols",
        explanation: "Водень має символ H від латинської назви Hydrogenium"
      },
      {
        question: "⚛️ Скільки протонів має атом Карбону?",
        options: ["4", "6", "8", "12"],
        correct: 1,
        category: "atomic-numbers",
        explanation: "Карбон має атомний номер 6, тому в його ядрі 6 протонів"
      },
      {
        question: "💡 Який елемент має символ Au?",
        options: ["Алюміній", "Золото", "Срібло", "Аурум"],
        correct: 1,
        category: "symbols",
        explanation: "Au - це символ золота від латинської назви Aurum"
      },
      {
        question: "🔬 В якій групі знаходиться елемент Натрій?",
        options: ["1", "2", "7", "17"],
        correct: 0,
        category: "groups-periods",
        explanation: "Натрій знаходиться в 1-й групі періодичної таблиці (лужні метали)"
      },
      {
        question: "⚡ Який з цих елементів є благородним газом?",
        options: ["Азот", "Кисень", "Аргон", "Хлор"],
        correct: 2,
        category: "properties",
        explanation: "Аргон - це благородний газ з 18-ї групи періодичної таблиці"
      },
      {
        question: "🧬 Який елемент має найменший атомний номер?",
        options: ["Гелій", "Водень", "Літій", "Берилій"],
        correct: 1,
        category: "atomic-numbers",
        explanation: "Водень має атомний номер 1 - найменший з усіх елементів"
      },
      {
        question: "💎 Який символ має елемент Залізо?",
        options: ["Z", "Fe", "I", "Ir"],
        correct: 1,
        category: "symbols",
        explanation: "Залізо має символ Fe від латинської назви Ferrum"
      },
      {
        question: "🌟 Скільки електронів на зовнішньому рівні має атом Кисню?",
        options: ["2", "4", "6", "8"],
        correct: 2,
        category: "properties",
        explanation: "Кисень має 6 електронів на зовнішньому рівні (2s² 2p⁴)"
      },
      {
        question: "🔵 Який з цих елементів є металом?",
        options: ["Сірка", "Калій", "Хлор", "Фосфор"],
        correct: 1,
        category: "properties",
        explanation: "Калій - це лужний метал з 1-ї групи періодичної таблиці"
      },
      {
        question: "⭐ Який елемент має символ Ag?",
        options: ["Аргентум", "Золото", "Срібло", "Алюміній"],
        correct: 2,
        category: "symbols",
        explanation: "Ag - це символ срібла від латинської назви Argentum"
      },
      {
        question: "📏 В якому періоді знаходиться елемент Магній?",
        options: ["1", "2", "3", "4"],
        correct: 2,
        category: "groups-periods",
        explanation: "Магній знаходиться в 3-му періоді таблиці Менделєєва"
      },
      {
        question: "⚛️ Який з цих елементів має найбільшу атомну масу?",
        options: ["Літій", "Берилій", "Бор", "Карбон"],
        correct: 3,
        category: "atomic-numbers",
        explanation: "Карбон має атомну масу ~12, що найбільше серед перелічених"
      },
      {
        question: "🟢 Який елемент має символ Cl?",
        options: ["Кальцій", "Хлор", "Кобальт", "Вуглець"],
        correct: 1,
        category: "symbols",
        explanation: "Cl - це символ хлору від латинської назви Chlorum"
      },
      {
        question: "🔴 Скільки груп (стовпців) у періодичній таблиці?",
        options: ["16", "17", "18", "20"],
        correct: 2,
        category: "groups-periods",
        explanation: "Сучасна періодична таблиця має 18 груп (стовпців)"
      },
      {
        question: "💫 Який з цих елементів є неметалом?",
        options: ["Натрій", "Магній", "Азот", "Алюміній"],
        correct: 2,
        category: "properties",
        explanation: "Азот - це неметал, газ при нормальних умовах"
      },
      {
        question: "🌡️ Який елемент є рідким при кімнатній температурі?",
        options: ["Ртуть", "Галій", "Цезій", "Франций"],
        correct: 0,
        category: "properties",
        explanation: "Ртуть - єдиний метал, що є рідким при кімнатній температурі"
      },
      {
        question: "⚡ Який символ має елемент Калій?",
        options: ["Ka", "K", "P", "Kl"],
        correct: 1,
        category: "symbols",
        explanation: "Калій має символ K від латинської назви Kalium"
      },
      {
        question: "🔬 Який елемент найчастіше зустрічається у Всесвіті?",
        options: ["Гелій", "Водень", "Кисень", "Карбон"],
        correct: 1,
        category: "properties",
        explanation: "Водень - найпоширеніший елемент у Всесвіті (~75% маси)"
      },
      {
        question: "💎 В якій групі знаходяться галогени?",
        options: ["16", "17", "18", "1"],
        correct: 1,
        category: "groups-periods",
        explanation: "Галогени (F, Cl, Br, I, At) знаходяться в 17-й групі"
      },
      {
        question: "🟣 Який елемент має символ N?",
        options: ["Неон", "Ніобій", "Азот", "Натрій"],
        correct: 2,
        category: "symbols",
        explanation: "N - це символ азоту від латинської назви Nitrogenium"
      }
    ];

    // Knowledge areas for detailed analysis
    const knowledgeAreas = {
      "symbols": "Символи елементів",
      "atomic-numbers": "Атомні номери",
      "groups-periods": "Групи та періоди", 
      "properties": "Властивості елементів"
    };

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let quizStarted = false;

    // DOM elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const answerReview = document.getElementById('answer-review');
    const startButton = document.getElementById('start-quiz');
    const questionContainer = document.getElementById('question-container');
    const progressFill = document.getElementById('progress-fill');
    const questionCounter = document.getElementById('question-counter');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const submitButton = document.getElementById('submit-quiz');
    const retakeButton = document.getElementById('retake-quiz');
    const reviewButton = document.getElementById('review-answers');
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
    if (reviewButton) {
      reviewButton.addEventListener('click', showAnswerReview);
    }
    if (backToResultsButton) {
      backToResultsButton.addEventListener('click', showResults);
    }

    function startQuiz() {
      quizStarted = true;
      currentQuestionIndex = 0;
      userAnswers = new Array(periodicTableQuestions.length).fill(null);
      
      quizIntro.style.display = 'none';
      quizQuestions.style.display = 'block';
      quizResults.style.display = 'none';
      answerReview.style.display = 'none';
      
      displayQuestion();
      updateProgress();
      updateNavigation();
    }

    function displayQuestion() {
      const question = periodicTableQuestions[currentQuestionIndex];
      
      questionContainer.innerHTML = `
        <div class="question-title">${question.question}</div>
        <ul class="answer-options">
          ${question.options.map((option, index) => `
            <li class="answer-option">
              <label>
                <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                <span class="answer-text">${option}</span>
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
      const progress = (currentQuestionIndex + 1) / periodicTableQuestions.length * 100;
      progressFill.style.width = `${progress}%`;
      questionCounter.textContent = `Питання ${currentQuestionIndex + 1} з ${periodicTableQuestions.length}`;
    }

    function updateNavigation() {
      prevButton.disabled = currentQuestionIndex === 0;
      
      const isLastQuestion = currentQuestionIndex === periodicTableQuestions.length - 1;
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
      if (newIndex >= 0 && newIndex < periodicTableQuestions.length) {
        currentQuestionIndex = newIndex;
        displayQuestion();
        updateProgress();
        updateNavigation();
      }
    }

    function submitQuiz() {
      calculateResults();
      showResults();
    }

    function calculateResults() {
      // Calculate overall score
      const correctAnswers = userAnswers.filter((answer, index) => 
        answer === periodicTableQuestions[index].correct
      ).length;
      const totalQuestions = periodicTableQuestions.length;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);

      // Update score display
      document.getElementById('final-score').textContent = `${percentage}%`;
      document.getElementById('correct-count').textContent = correctAnswers;
      document.getElementById('total-questions').textContent = totalQuestions;
      document.getElementById('accuracy-percentage').textContent = `${percentage}%`;

      // Determine score level
      let scoreLevel, levelClass;
      if (percentage >= 90) {
        scoreLevel = "Відмінно! 🏆";
        levelClass = "excellent";
      } else if (percentage >= 80) {
        scoreLevel = "Добре! 👏";
        levelClass = "good";
      } else if (percentage >= 70) {
        scoreLevel = "Задовільно 👍";
        levelClass = "fair";
      } else if (percentage >= 60) {
        scoreLevel = "Базовий рівень 📚";
        levelClass = "poor";
      } else {
        scoreLevel = "Потребує поліпшення 📖";
        levelClass = "needs-improvement";
      }

      const scoreLevelElement = document.getElementById('score-level');
      scoreLevelElement.textContent = scoreLevel;
      scoreLevelElement.className = `score-level ${levelClass}`;

      // Calculate knowledge area breakdown
      const areaScores = {};
      Object.keys(knowledgeAreas).forEach(area => {
        areaScores[area] = { correct: 0, total: 0 };
      });

      periodicTableQuestions.forEach((question, index) => {
        const area = question.category;
        areaScores[area].total++;
        if (userAnswers[index] === question.correct) {
          areaScores[area].correct++;
        }
      });

      // Display knowledge areas
      const knowledgeAreasContainer = document.getElementById('knowledge-areas');
      knowledgeAreasContainer.innerHTML = Object.keys(areaScores).map(area => {
        const score = areaScores[area];
        const areaPercentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
        let areaClass;
        if (areaPercentage >= 80) areaClass = "excellent";
        else if (areaPercentage >= 60) areaClass = "good";
        else if (areaPercentage >= 40) areaClass = "fair";
        else if (areaPercentage >= 20) areaClass = "poor";
        else areaClass = "needs-improvement";

        return `
          <div class="insight-card">
            <h6>${knowledgeAreas[area]}</h6>
            <div class="knowledge-score">
              <span>${score.correct}/${score.total}</span>
              <div class="score-bar">
                <div class="score-fill ${areaClass}" style="width: ${areaPercentage}%"></div>
              </div>
              <span>${areaPercentage}%</span>
            </div>
          </div>
        `;
      }).join('');

      // Generate recommendations
      generateRecommendations(percentage, areaScores);
    }

    function generateRecommendations(percentage, areaScores) {
      const recommendationsContainer = document.getElementById('recommendations');
      let recommendations = [];

      // Overall performance recommendations
      if (percentage >= 90) {
        recommendations.push({
          title: "🏆 Чудовий результат!",
          content: "Ви демонструєте відмінне знання періодичної таблиці! Продовжуйте вивчати більш складні аспекти хімії, такі як хімічні зв'язки та реакції."
        });
      } else if (percentage >= 80) {
        recommendations.push({
          title: "👏 Хороші знання!",
          content: "У вас солідна база знань з періодичної таблиці. Рекомендуємо приділити більше уваги слабким місцям та поглибити розуміння властивостей елементів."
        });
      } else if (percentage >= 70) {
        recommendations.push({
          title: "📚 Потрібна додаткова робота",
          content: "Ваші базові знання в порядку, але варто більше часу приділити вивченню символів елементів та їх розташування в таблиці."
        });
      } else {
        recommendations.push({
          title: "📖 Рекомендуємо повторити матеріал",
          content: "Варто систематично вивчити основи періодичної таблиці: символи, групи, періоди та основні властивості елементів."
        });
      }

      // Specific area recommendations
      Object.keys(areaScores).forEach(area => {
        const score = areaScores[area];
        const areaPercentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
        
        if (areaPercentage < 60) {
          let areaAdvice = "";
          switch(area) {
            case "symbols":
              areaAdvice = "Створіть флеш-картки з символами елементів та тренуйтеся щодня по 10-15 хвилин.";
              break;
            case "atomic-numbers":
              areaAdvice = "Вивчіть атомні номери перших 20 елементів - це основа для розуміння структури атома.";
              break;
            case "groups-periods":
              areaAdvice = "Зосередьтеся на розумінні логіки розташування елементів у групах та періодах.";
              break;
            case "properties":
              areaAdvice = "Вивчіть основні властивості металів, неметалів та благородних газів.";
              break;
          }
          
          recommendations.push({
            title: `💡 ${knowledgeAreas[area]}`,
            content: areaAdvice
          });
        }
      });

      // Study tips
      recommendations.push({
        title: "🎯 Поради для вивчення",
        content: `
          • Використовуйте мнемонічні правила для запам'ятовування
          • Вивчайте елементи групами зі схожими властивостями
          • Практикуйтеся з періодичною таблицею щодня
          • Зв'яжіть символи з реальними прикладами використання елементів
        `
      });

      recommendationsContainer.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
          <h6>${rec.title}</h6>
          <p>${rec.content}</p>
        </div>
      `).join('');
    }

    function showResults() {
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'block';
      answerReview.style.display = 'none';
    }

    function showAnswerReview() {
      const reviewContainer = document.getElementById('review-container');
      
      reviewContainer.innerHTML = periodicTableQuestions.map((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        return `
          <div class="review-item">
            <div class="review-question">${question.question}</div>
            <div class="review-answer user-answer">
              <strong>Ваша відповідь:</strong> ${userAnswer !== null ? question.options[userAnswer] : 'Не відповіли'}
              ${isCorrect ? '<span class="correct">✅ Правильно</span>' : '<span class="incorrect">❌ Неправильно</span>'}
            </div>
            ${!isCorrect ? `
              <div class="review-answer correct">
                <strong>Правильна відповідь:</strong> ${question.options[question.correct]} ✅
              </div>
            ` : ''}
            <div class="review-explanation">
              <strong>Пояснення:</strong> ${question.explanation}
            </div>
          </div>
        `;
      }).join('');

      quizResults.style.display = 'none';
      answerReview.style.display = 'block';
    }

    function resetQuiz() {
      quizStarted = false;
      currentQuestionIndex = 0;
      userAnswers = [];
      
      quizIntro.style.display = 'block';
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'none';
      answerReview.style.display = 'none';
    }

  })();
});