document.addEventListener("DOMContentLoaded", function () {
  // Assessment questions organized by category
  const assessmentQuestions = {
    "data-management": {
      name: "Управління даними",
      questions: [
        {
          question: "Чи має ваша організація формальну політику класифікації даних?",
          options: ["Так, повністю задокументована та впроваджена", "Так, але частково впроваджена", "В розробці", "Ні, відсутня"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи шифруються конфіденційні дані в спокої (на серверах/базах даних)?",
          options: ["Так, всі конфіденційні дані", "Так, більшість даних", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи шифруються дані при передачі?",
          options: ["Так, завжди (TLS/SSL)", "Переважно так", "Іноді", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є у вас процедури безпечного видалення даних?",
          options: ["Так, документовані та дотримуються", "Так, але неформальні", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи проводиться регулярне резервне копіювання критичних даних?",
          options: ["Так, автоматично та перевіряється", "Так, автоматично", "Періодично", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи ведеться облік того, хто має доступ до яких даних?",
          options: ["Так, повний автоматизований облік", "Так, переважно", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    },
    "access-control": {
      name: "Контроль доступу",
      questions: [
        {
          question: "Чи впроваджена багатофакторна автентифікація (MFA/2FA)?",
          options: ["Так, для всіх систем", "Так, для критичних систем", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи існує політика паролів та її дотримання?",
          options: ["Так, суворо дотримується", "Так, переважно", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи проводиться регулярний перегляд прав доступу користувачів?",
          options: ["Так, щомісячно", "Так, щоквартально", "Рідко", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є процедура видалення доступу при звільненні співробітників?",
          options: ["Так, негайно при звільненні", "Так, протягом дня", "Протягом тижня", "Неформально"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи впроваджений принцип мінімальних привілеїв?",
          options: ["Так, строго дотримується", "Переважно так", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи ведеться журнал доступу до критичних систем?",
          options: ["Так, повний моніторинг", "Так, базовий", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    },
    "network-security": {
      name: "Безпека мережі", 
      questions: [
        {
          question: "Чи налаштовані та обслуговуються брандмауери?",
          options: ["Так, професійно керовані", "Так, базове налаштування", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи сегментована мережа (розділення на підмережі)?",
          options: ["Так, повна сегментація", "Частково сегментована", "Базова сегментація", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи моніториться мережевий трафік на предмет аномалій?",
          options: ["Так, 24/7 моніторинг", "Періодично", "Базовий моніторинг", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є політики безпечного використання WiFi?",
          options: ["Так, WPA3 та гостьова мережа", "Так, WPA2", "Базова безпека", "Відкритий WiFi"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи блокується доступ до шкідливих веб-сайтів?",
          options: ["Так, розширене фільтрування", "Так, базове", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи використовуються VPN для віддаленого доступу?",
          options: ["Так, обов'язково", "Переважно так", "Іноді", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    },
    "incident-management": {
      name: "Управління інцидентами",
      questions: [
        {
          question: "Чи є план реагування на інциденти безпеки?",
          options: ["Так, детальний та протестований", "Так, документований", "Базовий план", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи призначена команда реагування на інциденти?",
          options: ["Так, спеціалізована команда", "Так, частково", "Неформально", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи проводяться регулярні резервні копії та тестування відновлення?",
          options: ["Так, регулярно тестується", "Так, але рідко тестується", "Тільки резервні копії", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи ведеться журнал інцидентів безпеки?",
          options: ["Так, детальний", "Так, базовий", "Інколи", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є контакти для звітування про інциденти?",
          options: ["Так, 24/7 гаряча лінія", "Так, в робочий час", "Неформально", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи аналізуються інциденти для покращення безпеки?",
          options: ["Так, детальний аналіз", "Так, базовий", "Іноді", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    },
    "employee-training": {
      name: "Навчання співробітників",
      questions: [
        {
          question: "Чи проводиться регулярне навчання з кібербезпеки?",
          options: ["Так, щоквартально", "Так, щорічно", "Нерегулярно", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи навчають співробітників розпізнавати фішинг?",
          options: ["Так, з тестуванням", "Так, базове", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є політики використання особистих пристроїв (BYOD)?",
          options: ["Так, суворі політики", "Так, базові", "Неформальні", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи інформують співробітників про нові загрози?",
          options: ["Так, регулярно", "Періодично", "Рідко", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є наслідки за порушення політик безпеки?",
          options: ["Так, чіткі та дотримуються", "Так, але м'які", "Неформальні", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи тестується обізнаність співробітників (симуляція атак)?",
          options: ["Так, регулярно", "Іноді", "Планується", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    },
    "physical-security": {
      name: "Фізична безпека",
      questions: [
        {
          question: "Чи контролюється фізичний доступ до серверів/обладнання?",
          options: ["Так, картки доступу", "Так, ключі", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи встановлені камери безпеки в критичних зонах?",
          options: ["Так, повне покриття", "Частково", "Базове", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи блокуються екрани при відходженні від робочого місця?",
          options: ["Так, автоматично", "Переважно так", "Іноді", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є політика чистого столу (clean desk)?",
          options: ["Так, строго дотримується", "Так, переважно", "Неформально", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи захищені від крадіжки ноутбуки та мобільні пристрої?",
          options: ["Так, повне шифрування", "Частково", "Базовий захист", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи контролюється утилізація конфіденційних документів?",
          options: ["Так, професійна утилізація", "Так, подрібнення", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    },
    "vendor-management": {
      name: "Управління постачальниками",
      questions: [
        {
          question: "Чи оцінюється кібербезпека постачальників?",
          options: ["Так, детальна оцінка", "Базова оцінка", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи включені вимоги безпеки в контракти з постачальниками?",
          options: ["Так, детальні вимоги", "Базові вимоги", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи обмежений доступ постачальників до ваших систем?",
          options: ["Так, строго контрольований", "Переважно так", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи моніториться активність постачальників у ваших системах?",
          options: ["Так, повний моніторинг", "Базовий моніторинг", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи має план дій при порушенні безпеки у постачальника?",
          options: ["Так, детальний план", "Базовий план", "Неформально", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи регулярно переглядаються угоди з постачальниками?",
          options: ["Так, щорічно", "Періодично", "Рідко", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    },
    "compliance-governance": {
      name: "Відповідність та управління",
      questions: [
        {
          question: "Чи призначений відповідальний за кібербезпеку (CISO/DPO)?",
          options: ["Так, спеціалізована роль", "Так, частково", "Неформально", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи проводяться регулярні аудити безпеки?",
          options: ["Так, зовнішні та внутрішні", "Тільки внутрішні", "Рідко", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи документовані всі політики та процедури безпеки?",
          options: ["Так, повністю", "Переважно", "Частково", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи звітується керівництву про стан кібербезпеки?",
          options: ["Так, регулярно", "Періодично", "При інцидентах", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи дотримуються галузеві стандарти (ISO 27001, NIST)?",
          options: ["Так, сертифіковані", "Частково дотримуються", "Планується", "Ні"],
          weights: [4, 3, 2, 1]
        },
        {
          question: "Чи є бюджет на кібербезпеку?",
          options: ["Так, достатній", "Так, але обмежений", "Мінімальний", "Ні"],
          weights: [4, 3, 2, 1]
        }
      ]
    }
  };

  // State variables
  let currentQuestion = 0;
  let currentCategory = 0;
  let userAnswers = [];
  let allQuestions = [];
  let categoryNames = [];

  // Flatten questions and prepare arrays
  function initializeAssessment() {
    allQuestions = [];
    categoryNames = [];
    
    Object.keys(assessmentQuestions).forEach(categoryKey => {
      const category = assessmentQuestions[categoryKey];
      category.questions.forEach((question, index) => {
        allQuestions.push({
          ...question,
          categoryKey: categoryKey,
          categoryName: category.name,
          questionIndex: index
        });
        categoryNames.push(category.name);
      });
    });
    
    userAnswers = new Array(allQuestions.length).fill(-1);
  }

  // DOM elements
  const assessmentIntro = document.getElementById("assessment-intro");
  const assessmentQuestionsElement = document.getElementById("assessment-questions");
  const assessmentResults = document.getElementById("assessment-results");
  
  const startButton = document.getElementById("start-assessment");
  const questionContainer = document.getElementById("question-container");
  const questionCounter = document.getElementById("question-counter");
  const categoryName = document.getElementById("category-name");
  const progressFill = document.getElementById("progress-fill");
  
  const prevButton = document.getElementById("prev-question");
  const nextButton = document.getElementById("next-question");
  const submitButton = document.getElementById("submit-assessment");
  
  const overallScoreCard = document.getElementById("overall-score-card");
  const overallScore = document.getElementById("overall-score");
  const maturityLevel = document.getElementById("maturity-level");
  const priorityAreas = document.getElementById("priority-areas");
  const strengths = document.getElementById("strengths");
  const categoryScores = document.getElementById("category-scores");
  const recommendationList = document.getElementById("recommendation-list");
  const actionItems = document.getElementById("action-items");
  
  const retakeButton = document.getElementById("retake-assessment");
  const printButton = document.getElementById("print-results");

  // Event listeners
  startButton.addEventListener("click", startAssessment);
  prevButton.addEventListener("click", previousQuestion);
  nextButton.addEventListener("click", nextQuestion);
  submitButton.addEventListener("click", submitAssessment);
  retakeButton.addEventListener("click", retakeAssessment);
  printButton.addEventListener("click", printResults);

  function startAssessment() {
    assessmentIntro.style.display = "none";
    assessmentQuestionsElement.style.display = "block";
    displayQuestion();
  }

  function displayQuestion() {
    const question = allQuestions[currentQuestion];
    const questionNumber = currentQuestion + 1;
    const totalQuestions = allQuestions.length;

    // Update progress
    questionCounter.textContent = `Питання ${questionNumber} з ${totalQuestions}`;
    categoryName.textContent = question.categoryName;
    progressFill.style.width = `${(questionNumber / totalQuestions) * 100}%`;

    // Create question HTML
    questionContainer.innerHTML = `
      <div class="question-title">
        ${questionNumber}. ${question.question}
      </div>
      <div class="answer-options">
        ${question.options.map((option, index) => `
          <label class="answer-option ${userAnswers[currentQuestion] === index ? 'selected' : ''}">
            <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
            ${option}
          </label>
        `).join('')}
      </div>
    `;

    // Add event listeners to radio buttons
    const radioButtons = questionContainer.querySelectorAll('input[type="radio"]');
    const labels = questionContainer.querySelectorAll('.answer-option');
    
    radioButtons.forEach((radio, index) => {
      radio.addEventListener('change', function() {
        userAnswers[currentQuestion] = parseInt(this.value);
        updateAnswerSelection();
        updateNavigationButtons();
      });
    });

    labels.forEach((label, index) => {
      label.addEventListener('click', function() {
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
        userAnswers[currentQuestion] = parseInt(radio.value);
        updateAnswerSelection();
        updateNavigationButtons();
      });
    });

    updateNavigationButtons();
  }

  function updateAnswerSelection() {
    const labels = questionContainer.querySelectorAll('.answer-option');
    labels.forEach((label, index) => {
      label.classList.toggle('selected', userAnswers[currentQuestion] === index);
    });
  }

  function updateNavigationButtons() {
    prevButton.disabled = currentQuestion === 0;
    
    if (currentQuestion === allQuestions.length - 1) {
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
      submitButton.disabled = userAnswers[currentQuestion] === -1;
    } else {
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
      nextButton.disabled = userAnswers[currentQuestion] === -1;
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      displayQuestion();
    }
  }

  function nextQuestion() {
    if (currentQuestion < allQuestions.length - 1 && userAnswers[currentQuestion] !== -1) {
      currentQuestion++;
      displayQuestion();
    }
  }

  function submitAssessment() {
    if (userAnswers[currentQuestion] === -1) return;

    const results = calculateResults();
    displayResults(results);
    
    assessmentQuestionsElement.style.display = "none";
    assessmentResults.style.display = "block";
  }

  function calculateResults() {
    const categoryResults = {};
    let totalScore = 0;
    let totalMaxScore = 0;

    // Initialize category results
    Object.keys(assessmentQuestions).forEach(key => {
      categoryResults[key] = {
        name: assessmentQuestions[key].name,
        score: 0,
        maxScore: 0,
        percentage: 0
      };
    });

    // Calculate scores
    allQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const score = question.weights[userAnswer];
      const maxScore = Math.max(...question.weights);
      
      categoryResults[question.categoryKey].score += score;
      categoryResults[question.categoryKey].maxScore += maxScore;
      totalScore += score;
      totalMaxScore += maxScore;
    });

    // Calculate percentages
    Object.keys(categoryResults).forEach(key => {
      const category = categoryResults[key];
      category.percentage = Math.round((category.score / category.maxScore) * 100);
    });

    const overallPercentage = Math.round((totalScore / totalMaxScore) * 100);

    return {
      overallPercentage,
      categoryResults,
      totalScore,
      totalMaxScore
    };
  }

  function displayResults(results) {
    // Overall score
    overallScore.textContent = results.overallPercentage + "%";
    
    let maturityClass, maturityText;
    if (results.overallPercentage >= 80) {
      maturityClass = "optimized";
      maturityText = "Оптимізований рівень";
      overallScoreCard.className = "insight-card success";
    } else if (results.overallPercentage >= 60) {
      maturityClass = "defined";
      maturityText = "Визначений рівень";
      overallScoreCard.className = "insight-card info";
    } else if (results.overallPercentage >= 40) {
      maturityClass = "managed";
      maturityText = "Керований рівень";
      overallScoreCard.className = "insight-card warning";
    } else {
      maturityClass = "initial";
      maturityText = "Початковий рівень";
      overallScoreCard.className = "insight-card warning";
    }
    
    maturityLevel.textContent = maturityText;
    maturityLevel.className = `maturity-level ${maturityClass}`;

    // Category breakdown
    const categoryScoresHTML = Object.keys(results.categoryResults).map(key => {
      const category = results.categoryResults[key];
      return `
        <div class="category-score-item">
          <h6>${category.name}</h6>
          <div class="category-score">${category.percentage}%</div>
          <div style="font-size: 0.9em; color: #666;">
            ${category.score}/${category.maxScore} балів
          </div>
        </div>
      `;
    }).join('');
    categoryScores.innerHTML = categoryScoresHTML;

    // Priority areas (lowest scoring categories)
    const sortedCategories = Object.keys(results.categoryResults)
      .sort((a, b) => results.categoryResults[a].percentage - results.categoryResults[b].percentage);
    
    const priorityAreasHTML = sortedCategories.slice(0, 3).map(key => {
      const category = results.categoryResults[key];
      return `<div>• ${category.name}: ${category.percentage}%</div>`;
    }).join('');
    priorityAreas.innerHTML = priorityAreasHTML;

    // Strengths (highest scoring categories)
    const strengthsHTML = sortedCategories.slice(-3).reverse().map(key => {
      const category = results.categoryResults[key];
      return `<div>• ${category.name}: ${category.percentage}%</div>`;
    }).join('');
    strengths.innerHTML = strengthsHTML;

    // Generate recommendations
    generateRecommendations(results);
    generateActionPlan(results);
  }

  function generateRecommendations(results) {
    const recommendations = [];
    
    Object.keys(results.categoryResults).forEach(key => {
      const category = results.categoryResults[key];
      if (category.percentage < 50) {
        recommendations.push({
          priority: "high",
          category: category.name,
          text: getRecommendationText(key, "high")
        });
      } else if (category.percentage < 70) {
        recommendations.push({
          priority: "medium",
          category: category.name,
          text: getRecommendationText(key, "medium")
        });
      }
    });

    if (results.overallPercentage >= 80) {
      recommendations.push({
        priority: "low",
        category: "Загальне",
        text: "Відмінна робота! Продовжуйте підтримувати високі стандарти безпеки та регулярно переглядайте політики."
      });
    }

    const recommendationsHTML = recommendations.map(rec => `
      <div class="recommendation-item ${rec.priority}-priority">
        <strong>${rec.category}:</strong> ${rec.text}
      </div>
    `).join('');
    
    recommendationList.innerHTML = recommendationsHTML;
  }

  function getRecommendationText(categoryKey, priority) {
    const recommendations = {
      "data-management": {
        high: "Терміново впровадьте шифрування даних, політику класифікації та регулярне резервне копіювання.",
        medium: "Покращте процедури управління даними та посильте контроль доступу до конфіденційної інформації."
      },
      "access-control": {
        high: "Негайно впровадьте MFA, перегляньте права доступу користувачів та посильте політику паролів.",
        medium: "Покращте процедури управління доступом та впровадьте регулярний аудит користувачів."
      },
      "network-security": {
        high: "Терміново налаштуйте брандмауери, впровадьте мережеву сегментацію та моніторинг трафіку.",
        medium: "Покращте мережеву безпеку шляхом впровадження додаткових засобів захисту."
      },
      "incident-management": {
        high: "Розробіть план реагування на інциденти, створіть команду відповіді та налаштуйте резервне копіювання.",
        medium: "Покращте процедури управління інцидентами та протестуйте план відновлення."
      },
      "employee-training": {
        high: "Терміново організуйте навчання з кібербезпеки для всіх співробітників.",
        medium: "Покращте програму навчання безпеки та впровадьте регулярне тестування."
      },
      "physical-security": {
        high: "Впровадьте контроль фізичного доступу та захист критичного обладнання.",
        medium: "Посильте фізичну безпеку та впровадьте додаткові заходи захисту."
      },
      "vendor-management": {
        high: "Впровадьте оцінку безпеки постачальників та включіть вимоги безпеки в контракти.",
        medium: "Покращте процедури управління постачальниками та посильте контроль доступу."
      },
      "compliance-governance": {
        high: "Призначте відповідального за безпеку, документуйте політики та впровадьте регулярні аудити.",
        medium: "Покращте управління безпекою та посильте звітність керівництву."
      }
    };
    
    return recommendations[categoryKey]?.[priority] || "Покращте процедури в цій області відповідно до найкращих практик.";
  }

  function generateActionPlan(results) {
    const actions = [];
    
    // High priority actions for categories < 50%
    Object.keys(results.categoryResults).forEach(key => {
      const category = results.categoryResults[key];
      if (category.percentage < 50) {
        actions.push({
          priority: "high",
          text: `Розробити план покращення для області "${category.name}" (поточний рівень: ${category.percentage}%)`
        });
      }
    });

    // Medium priority actions for categories 50-70%
    Object.keys(results.categoryResults).forEach(key => {
      const category = results.categoryResults[key];
      if (category.percentage >= 50 && category.percentage < 70) {
        actions.push({
          priority: "medium",
          text: `Оптимізувати процеси в області "${category.name}" (поточний рівень: ${category.percentage}%)`
        });
      }
    });

    // General actions
    if (results.overallPercentage < 60) {
      actions.push({
        priority: "high",
        text: "Призначити відповідального за кібербезпеку та розробити комплексний план безпеки"
      });
    }

    actions.push({
      priority: "low",
      text: "Заплануйти наступну оцінку через 3-6 місяців для відстеження прогресу"
    });

    const actionsHTML = actions.map(action => `
      <div class="action-item">
        <div class="action-priority ${action.priority}">${
          action.priority === 'high' ? 'Висока' : 
          action.priority === 'medium' ? 'Середня' : 'Низька'
        }</div>
        <div>${action.text}</div>
      </div>
    `).join('');
    
    actionItems.innerHTML = actionsHTML;
  }

  function retakeAssessment() {
    currentQuestion = 0;
    userAnswers = new Array(allQuestions.length).fill(-1);
    
    assessmentResults.style.display = "none";
    assessmentIntro.style.display = "block";
  }

  function printResults() {
    window.print();
  }

  // Initialize
  initializeAssessment();
});