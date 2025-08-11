document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    // Periodic Table Quiz data
    const periodicTableQuestions = [
      {
        question: "🧪 What is the chemical symbol for Hydrogen?",
        options: ["H", "He", "Hy", "Hg"],
        correct: 0,
        category: "symbols",
        explanation: "Hydrogen has the symbol H from its Latin name Hydrogenium"
      },
      {
        question: "⚛️ How many protons does a Carbon atom have?",
        options: ["4", "6", "8", "12"],
        correct: 1,
        category: "atomic-numbers",
        explanation: "Carbon has atomic number 6, so it has 6 protons in its nucleus"
      },
      {
        question: "💡 Which element has the symbol Au?",
        options: ["Aluminum", "Gold", "Silver", "Argon"],
        correct: 1,
        category: "symbols",
        explanation: "Au is the symbol for gold from its Latin name Aurum"
      },
      {
        question: "🔬 In which group is Sodium located?",
        options: ["1", "2", "7", "17"],
        correct: 0,
        category: "groups-periods",
        explanation: "Sodium is in group 1 of the periodic table (alkali metals)"
      },
      {
        question: "⚡ Which of these elements is a noble gas?",
        options: ["Nitrogen", "Oxygen", "Argon", "Chlorine"],
        correct: 2,
        category: "properties",
        explanation: "Argon is a noble gas from group 18 of the periodic table"
      },
      {
        question: "🧬 Which element has the smallest atomic number?",
        options: ["Helium", "Hydrogen", "Lithium", "Beryllium"],
        correct: 1,
        category: "atomic-numbers",
        explanation: "Hydrogen has atomic number 1 - the smallest of all elements"
      },
      {
        question: "💎 What symbol does Iron have?",
        options: ["I", "Fe", "Ir", "In"],
        correct: 1,
        category: "symbols",
        explanation: "Iron has the symbol Fe from its Latin name Ferrum"
      },
      {
        question: "🌟 How many electrons are in the outer shell of Oxygen?",
        options: ["2", "4", "6", "8"],
        correct: 2,
        category: "properties",
        explanation: "Oxygen has 6 electrons in its outer shell (2s² 2p⁴)"
      },
      {
        question: "🔵 Which of these elements is a metal?",
        options: ["Sulfur", "Potassium", "Chlorine", "Phosphorus"],
        correct: 1,
        category: "properties",
        explanation: "Potassium is an alkali metal from group 1 of the periodic table"
      },
      {
        question: "⭐ Which element has the symbol Ag?",
        options: ["Argon", "Gold", "Silver", "Aluminum"],
        correct: 2,
        category: "symbols",
        explanation: "Ag is the symbol for silver from its Latin name Argentum"
      },
      {
        question: "📏 In which period is Magnesium located?",
        options: ["1", "2", "3", "4"],
        correct: 2,
        category: "groups-periods",
        explanation: "Magnesium is located in period 3 of the periodic table"
      },
      {
        question: "⚛️ Which of these elements has the highest atomic mass?",
        options: ["Lithium", "Beryllium", "Boron", "Carbon"],
        correct: 3,
        category: "atomic-numbers",
        explanation: "Carbon has atomic mass ~12, which is the highest among those listed"
      },
      {
        question: "🟢 Which element has the symbol Cl?",
        options: ["Calcium", "Chlorine", "Cobalt", "Carbon"],
        correct: 1,
        category: "symbols",
        explanation: "Cl is the symbol for chlorine from its Latin name Chlorum"
      },
      {
        question: "🔴 How many groups (columns) are in the periodic table?",
        options: ["16", "17", "18", "20"],
        correct: 2,
        category: "groups-periods",
        explanation: "The modern periodic table has 18 groups (columns)"
      },
      {
        question: "💫 Which of these elements is a non-metal?",
        options: ["Sodium", "Magnesium", "Nitrogen", "Aluminum"],
        correct: 2,
        category: "properties",
        explanation: "Nitrogen is a non-metal, existing as a gas under normal conditions"
      },
      {
        question: "🌡️ Which element is liquid at room temperature?",
        options: ["Mercury", "Gallium", "Cesium", "Francium"],
        correct: 0,
        category: "properties",
        explanation: "Mercury is the only metal that is liquid at room temperature"
      },
      {
        question: "⚡ What symbol does Potassium have?",
        options: ["Po", "K", "P", "Pt"],
        correct: 1,
        category: "symbols",
        explanation: "Potassium has the symbol K from its Latin name Kalium"
      },
      {
        question: "🔬 Which element is most abundant in the Universe?",
        options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
        correct: 1,
        category: "properties",
        explanation: "Hydrogen is the most abundant element in the Universe (~75% by mass)"
      },
      {
        question: "💎 In which group are the halogens located?",
        options: ["16", "17", "18", "1"],
        correct: 1,
        category: "groups-periods",
        explanation: "Halogens (F, Cl, Br, I, At) are located in group 17"
      },
      {
        question: "🟣 Which element has the symbol N?",
        options: ["Neon", "Niobium", "Nitrogen", "Sodium"],
        correct: 2,
        category: "symbols",
        explanation: "N is the symbol for nitrogen from its Latin name Nitrogenium"
      }
    ];

    // Knowledge areas for detailed analysis
    const knowledgeAreas = {
      "symbols": "Element Symbols",
      "atomic-numbers": "Atomic Numbers",
      "groups-periods": "Groups and Periods", 
      "properties": "Element Properties"
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
      questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${periodicTableQuestions.length}`;
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
        scoreLevel = "Excellent! 🏆";
        levelClass = "excellent";
      } else if (percentage >= 80) {
        scoreLevel = "Good! 👏";
        levelClass = "good";
      } else if (percentage >= 70) {
        scoreLevel = "Fair 👍";
        levelClass = "fair";
      } else if (percentage >= 60) {
        scoreLevel = "Basic Level 📚";
        levelClass = "poor";
      } else {
        scoreLevel = "Needs Improvement 📖";
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
          title: "🏆 Excellent Result!",
          content: "You demonstrate excellent knowledge of the periodic table! Continue studying more complex aspects of chemistry, such as chemical bonds and reactions."
        });
      } else if (percentage >= 80) {
        recommendations.push({
          title: "👏 Good Knowledge!",
          content: "You have a solid foundation in the periodic table. We recommend focusing on weak areas and deepening your understanding of element properties."
        });
      } else if (percentage >= 70) {
        recommendations.push({
          title: "📚 Additional Work Needed",
          content: "Your basic knowledge is fine, but you should spend more time studying element symbols and their placement in the table."
        });
      } else {
        recommendations.push({
          title: "📖 Recommend Reviewing Material",
          content: "You should systematically study the basics of the periodic table: symbols, groups, periods, and basic element properties."
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
              areaAdvice = "Create flashcards with element symbols and practice daily for 10-15 minutes.";
              break;
            case "atomic-numbers":
              areaAdvice = "Learn the atomic numbers of the first 20 elements - this is fundamental for understanding atomic structure.";
              break;
            case "groups-periods":
              areaAdvice = "Focus on understanding the logic of element placement in groups and periods.";
              break;
            case "properties":
              areaAdvice = "Study the basic properties of metals, non-metals, and noble gases.";
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
        title: "🎯 Study Tips",
        content: `
          • Use mnemonic devices for memorization
          • Study elements in groups with similar properties
          • Practice with the periodic table daily
          • Connect symbols with real-world examples of element uses
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
              <strong>Your Answer:</strong> ${userAnswer !== null ? question.options[userAnswer] : 'No answer'}
              ${isCorrect ? '<span class="correct">✅ Correct</span>' : '<span class="incorrect">❌ Incorrect</span>'}
            </div>
            ${!isCorrect ? `
              <div class="review-answer correct">
                <strong>Correct Answer:</strong> ${question.options[question.correct]} ✅
              </div>
            ` : ''}
            <div class="review-explanation">
              <strong>Explanation:</strong> ${question.explanation}
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