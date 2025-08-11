document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    // Entrepreneur Quiz data
    const entrepreneurQuestions = [
      {
        question: "🎯 Коли у мене є ідея, я швидко переходжу до дій",
        skill: "action",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "💪 Я готовий ризикувати заради досягнення мети",
        skill: "risk-taking",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🧠 Мені легко знаходити нестандартні рішення",
        skill: "innovation",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "👥 Люди часто звертаються до мене за порадою",
        skill: "leadership",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🎲 Я не боюся невизначеності та змін",
        skill: "risk-taking",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "💡 Я постійно шукаю нові можливості",
        skill: "innovation",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🔥 Я наполегливо працюю над досягненням цілей",
        skill: "persistence",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🎯 Мені подобається приймати важливі рішення",
        skill: "leadership",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "📈 Я розумію основи ведення бізнесу",
        skill: "business-sense",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🚀 Я швидко адаптуюся до нових ситуацій",
        skill: "action",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "💼 Мені цікаво як заробляють гроші різні компанії",
        skill: "business-sense",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "⚡ Невдачі мотивують мене ще більше",
        skill: "persistence",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🎨 Я часто придумую поліпшення для існуючих продуктів",
        skill: "innovation",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🎯 Мені легко мотивувати інших людей",
        skill: "leadership",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "💰 Я готовий інвестувати власні гроші в ідею",
        skill: "risk-taking",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "📊 Я регулярно аналізую фінансові показники",
        skill: "business-sense",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🔧 Я вмію швидко вирішувати проблеми",
        skill: "action",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🏆 Я наполегливо працюю навіть коли втомлений",
        skill: "persistence",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "🌟 Мені подобається бути першим в нових справах",
        skill: "innovation",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      },
      {
        question: "👑 Я природний лідер у групах",
        skill: "leadership",
        answers: [
          { text: "Завжди", score: 5 },
          { text: "Часто", score: 4 },
          { text: "Іноді", score: 3 },
          { text: "Рідко", score: 2 },
          { text: "Ніколи", score: 1 }
        ]
      }
    ];

    const skillNames = {
      "action": "Орієнтація на дію",
      "risk-taking": "Готовність до ризику",
      "innovation": "Інноваційність",
      "leadership": "Лідерство",
      "persistence": "Наполегливість", 
      "business-sense": "Бізнес-мислення"
    };

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let skillScores = {};

    // DOM elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const developmentPlan = document.getElementById('development-plan');
    const startButton = document.getElementById('start-quiz');
    const questionContainer = document.getElementById('question-container');
    const progressFill = document.getElementById('progress-fill');
    const questionCounter = document.getElementById('question-counter');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const submitButton = document.getElementById('submit-quiz');
    const retakeButton = document.getElementById('retake-quiz');
    const developmentPlanButton = document.getElementById('view-development-plan');
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
    if (developmentPlanButton) {
      developmentPlanButton.addEventListener('click', showDevelopmentPlan);
    }
    if (backToResultsButton) {
      backToResultsButton.addEventListener('click', showResults);
    }

    function startQuiz() {
      currentQuestionIndex = 0;
      userAnswers = new Array(entrepreneurQuestions.length).fill(null);
      skillScores = {};
      
      quizIntro.style.display = 'none';
      quizQuestions.style.display = 'block';
      quizResults.style.display = 'none';
      developmentPlan.style.display = 'none';
      
      displayQuestion();
      updateProgress();
      updateNavigation();
    }

    function displayQuestion() {
      const question = entrepreneurQuestions[currentQuestionIndex];
      
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
      const progress = (currentQuestionIndex + 1) / entrepreneurQuestions.length * 100;
      progressFill.style.width = `${progress}%`;
      questionCounter.textContent = `Питання ${currentQuestionIndex + 1} з ${entrepreneurQuestions.length}`;
    }

    function updateNavigation() {
      prevButton.disabled = currentQuestionIndex === 0;
      
      const isLastQuestion = currentQuestionIndex === entrepreneurQuestions.length - 1;
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
      if (newIndex >= 0 && newIndex < entrepreneurQuestions.length) {
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
      // Initialize skill scores
      skillScores = {};
      Object.keys(skillNames).forEach(skill => {
        skillScores[skill] = { total: 0, count: 0 };
      });

      // Calculate scores based on answers
      entrepreneurQuestions.forEach((question, index) => {
        const answerIndex = userAnswers[index];
        if (answerIndex !== null) {
          const answerScore = question.answers[answerIndex].score;
          skillScores[question.skill].total += answerScore;
          skillScores[question.skill].count += 1;
        }
      });

      // Convert to percentages
      Object.keys(skillScores).forEach(skill => {
        const maxScore = skillScores[skill].count * 5;
        skillScores[skill].percentage = Math.round((skillScores[skill].total / maxScore) * 100);
      });
    }

    function displayResults() {
      // Calculate overall entrepreneur score
      const overallScore = Math.round(
        Object.values(skillScores).reduce((sum, skill) => sum + skill.percentage, 0) / 
        Object.keys(skillScores).length
      );

      document.getElementById('entrepreneur-score').textContent = overallScore;

      // Determine entrepreneur level
      let level, levelClass;
      if (overallScore >= 80) {
        level = "Високий потенціал 🚀";
        levelClass = "excellent";
      } else if (overallScore >= 60) {
        level = "Хороший потенціал 👍";
        levelClass = "good";
      } else if (overallScore >= 40) {
        level = "Середній потенціал 📈";
        levelClass = "average";
      } else if (overallScore >= 20) {
        level = "Низький потенціал 📚";
        levelClass = "below-average";
      } else {
        level = "Потребує розвитку 🎯";
        levelClass = "poor";
      }

      document.getElementById('entrepreneur-level').textContent = level;
      document.getElementById('entrepreneur-level').className = `result-value ${levelClass}`;

      // Display skills breakdown
      const skillsContainer = document.getElementById('skills-breakdown');
      skillsContainer.innerHTML = Object.keys(skillScores).map(skill => {
        const score = skillScores[skill];
        let skillClass;
        if (score.percentage >= 80) skillClass = "excellent";
        else if (score.percentage >= 60) skillClass = "good";
        else if (score.percentage >= 40) skillClass = "average";
        else if (score.percentage >= 20) skillClass = "below-average";
        else skillClass = "poor";

        return `
          <div class="skill-bar">
            <div class="skill-label">${skillNames[skill]}</div>
            <div class="skill-score-bar">
              <div class="skill-fill ${skillClass}" style="width: ${score.percentage}%"></div>
            </div>
            <div class="skill-percentage">${score.percentage}%</div>
          </div>
        `;
      }).join('');

      // Display strengths and weaknesses
      displayStrengthsWeaknesses();

      // Display business recommendations
      displayBusinessRecommendations(overallScore);
    }

    function displayStrengthsWeaknesses() {
      const strengthsWeaknessesContainer = document.getElementById('strengths-weaknesses');
      
      // Find top 2 strengths and top 2 weaknesses
      const sortedSkills = Object.keys(skillScores).sort((a, b) => 
        skillScores[b].percentage - skillScores[a].percentage
      );
      
      const strengths = sortedSkills.slice(0, 2);
      const weaknesses = sortedSkills.slice(-2).reverse();

      strengthsWeaknessesContainer.innerHTML = `
        <div class="strength-weakness-card strength">
          <div class="card-title">💪 Ваші сильні сторони</div>
          <div class="card-content">
            ${strengths.map(skill => 
              `<strong>${skillNames[skill]}</strong> (${skillScores[skill].percentage}%) - Це ваша ключова перевага як підприємця.`
            ).join('<br><br>')}
          </div>
        </div>
        <div class="strength-weakness-card weakness">
          <div class="card-title">⚠️ Області для розвитку</div>
          <div class="card-content">
            ${weaknesses.map(skill => 
              `<strong>${skillNames[skill]}</strong> (${skillScores[skill].percentage}%) - Рекомендуємо приділити увагу розвитку цієї навички.`
            ).join('<br><br>')}
          </div>
        </div>
      `;
    }

    function displayBusinessRecommendations(score) {
      const recommendationsContainer = document.getElementById('business-recommendations');
      
      let recommendations = [];

      if (score >= 80) {
        recommendations.push({
          title: "🚀 Готовність до підприємництва",
          items: [
            "Ви готові до створення власного бізнесу",
            "Розгляньте інноваційні стартапи у сферах ваших інтересів",
            "Шукайте інвесторів та бізнес-партнерів",
            "Вивчайте успішні кейси у вашій галузі"
          ]
        });
      } else if (score >= 60) {
        recommendations.push({
          title: "📈 Підготовка до бізнесу",
          items: [
            "Отримайте більше досвіду у вашій сфері",
            "Пройдіть курси з підприємництва",
            "Почніть з малого бізнесу або франшизи",
            "Знайдіть ментора серед досвідчених підприємців"
          ]
        });
      } else {
        recommendations.push({
          title: "🎯 Розвиток навичок",
          items: [
            "Зосередьтеся на розвитку підприємницьких навичок",
            "Почніть з підробітку або фрілансу",
            "Вивчайте основи бізнесу та фінансів",
            "Розвивайте лідерські якості"
          ]
        });
      }

      recommendationsContainer.innerHTML = recommendations.map(rec => `
        <div class="recommendation-section">
          <h6>${rec.title}</h6>
          ${rec.items.map(item => `
            <div class="recommendation-item">
              <div class="recommendation-description">${item}</div>
            </div>
          `).join('')}
        </div>
      `).join('');
    }

    function showResults() {
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'block';
      developmentPlan.style.display = 'none';
    }

    function showDevelopmentPlan() {
      const planContainer = document.getElementById('plan-container');
      
      // Find weakest skills for development plan
      const weakestSkills = Object.keys(skillScores)
        .sort((a, b) => skillScores[a].percentage - skillScores[b].percentage)
        .slice(0, 3);

      planContainer.innerHTML = `
        <div class="recommendation-section">
          <h6>🎯 Пріоритетні навички для розвитку</h6>
          ${weakestSkills.map(skill => `
            <div class="recommendation-item">
              <div class="recommendation-title">${skillNames[skill]} (${skillScores[skill].percentage}%)</div>
              <div class="recommendation-description">
                ${getSkillDevelopmentTip(skill)}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="recommendation-section">
          <h6>📚 План дій на 3 місяці</h6>
          <div class="recommendation-item">
            <div class="recommendation-title">Тиждень 1-2: Оцінка та планування</div>
            <div class="recommendation-description">Проаналізуйте ваші результати, визначте конкретні цілі розвитку</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Тиждень 3-8: Навчання та практика</div>
            <div class="recommendation-description">Пройдіть онлайн-курси, читайте книги з підприємництва, практикуйте нові навички</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Тиждень 9-12: Застосування</div>
            <div class="recommendation-description">Застосуйте вивчене на практиці: запустіть міні-проект або підробіток</div>
          </div>
        </div>
        
        <div class="recommendation-section">
          <h6>🔗 Рекомендовані ресурси</h6>
          <div class="recommendation-item">
            <div class="recommendation-title">Книги</div>
            <div class="recommendation-description">"Lean Startup" Еріка Ріса, "Zero to One" Пітера Тіля</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Онлайн-курси</div>
            <div class="recommendation-description">Coursera Business courses, edX Entrepreneurship programs</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Спільноти</div>
            <div class="recommendation-description">Startup Weekend, бізнес-інкубатори, нетворкінг-події</div>
          </div>
        </div>
      `;

      quizResults.style.display = 'none';
      developmentPlan.style.display = 'block';
    }

    function getSkillDevelopmentTip(skill) {
      const tips = {
        "action": "Практикуйте швидке прийняття рішень. Ставте собі щоденні мікроцілі та виконуйте їх.",
        "risk-taking": "Почніть з малих ризиків. Аналізуйте успішні кейси підприємців у вашій сфері.",
        "innovation": "Тренуйте креативне мислення. Шукайте проблеми навколо себе та придумуйте рішення.",
        "leadership": "Беріть ініціативу у групових проектах. Розвивайте навички комунікації та мотивації.",
        "persistence": "Ставте довгострокові цілі та розбивайте їх на етапи. Відзначайте маленькі перемоги.",
        "business-sense": "Вивчайте основи фінансів та маркетингу. Аналізуйте бізнес-моделі успішних компаній."
      };
      return tips[skill] || "Зосередьтеся на постійному розвитку цієї навички.";
    }

    function resetQuiz() {
      currentQuestionIndex = 0;
      userAnswers = [];
      skillScores = {};
      
      quizIntro.style.display = 'block';
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'none';
      developmentPlan.style.display = 'none';
    }

  })();
});