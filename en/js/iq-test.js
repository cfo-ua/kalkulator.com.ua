document.addEventListener("DOMContentLoaded", function () {
  // IQ Test data
  const iqTestQuestions = [
    {
      question: "🔢 Continue the number sequence: 2, 6, 18, 54, ?",
      options: [
        "108",
        "162", 
        "144",
        "216"
      ],
      correct: 1,
      explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
    },
    {
      question: "🔄 What number has the same relationship to 8 as 3 has to 12?",
      options: [
        "2",
        "4",
        "6", 
        "1"
      ],
      correct: 0,
      explanation: "3:12 = 1:4, so x:8 = 1:4, therefore x = 2"
    },
    {
      question: "🎯 If all bloops are krangs, and some krangs are flups, then:",
      options: [
        "All flups are bloops",
        "Some bloops might be flups",
        "No flups are bloops",
        "All krangs are flups"
      ],
      correct: 1,
      explanation: "From the conditions, some bloops (through krangs) might be flups, but not necessarily all"
    },
    {
      question: "🧩 Choose the figure that logically continues the series: ○, △, □, ○, △, ?",
      options: [
        "○",
        "△", 
        "□",
        "◇"
      ],
      correct: 2,
      explanation: "The sequence repeats: circle, triangle, square, circle, triangle, square"
    },
    {
      question: "📐 How many small cubes are needed to build a 4×4×4 cube?",
      options: [
        "48",
        "64",
        "56", 
        "72"
      ],
      correct: 1,
      explanation: "A 4×4×4 cube consists of 4³ = 64 small cubes"
    },
    {
      question: "🔤 'TEAM' relates to 'MEAT' as 'STAR' relates to:",
      options: [
        "RATS",
        "TARS", 
        "ARTS",
        "RAST"
      ],
      correct: 0,
      explanation: "Letters are rearranged in reverse order: TEAM → MEAT, STAR → RATS"
    },
    {
      question: "⏰ What are the next two letters in the sequence: A, C, E, G, I, ?",
      options: [
        "K, M",
        "J, K",
        "K, L", 
        "L, N"
      ],
      correct: 0,
      explanation: "The sequence skips one letter each time: A(+2)C(+2)E(+2)G(+2)I(+2)K(+2)M"
    },
    {
      question: "🎲 If the code for 'BIRD' is 2948, then the code for 'FISH' is:",
      options: [
        "6973",
        "6974", 
        "5873",
        "6875"
      ],
      correct: 0,
      explanation: "B=2, I=9, R=4, D=8 → F=6, I=9, S=7, H=3 → 6973"
    },
    {
      question: "🔺 Which figure is the odd one out: square, triangle, circle, rectangle?",
      options: [
        "Square",
        "Triangle",
        "Circle", 
        "Rectangle"
      ],
      correct: 2,
      explanation: "Circle is the only figure without corners, others have angles"
    },
    {
      question: "🧮 If 2 + 3 = 10, 6 + 5 = 66, then 4 + 7 = ?",
      options: [
        "44",
        "28",
        "77", 
        "84"
      ],
      correct: 0,
      explanation: "Formula: (a + b) × a = result. 2+3=5, 5×2=10; 6+5=11, 11×6=66; 4+7=11, 11×4=44"
    },
    {
      question: "📏 A tree's shadow is 15m long, and a 1.5m stick's shadow is 3m. How tall is the tree?",
      options: [
        "7.5 m",
        "10 m",
        "30 m",
        "22.5 m"
      ],
      correct: 0,
      explanation: "Proportion: 1.5:3 = x:15, so x = (1.5 × 15) ÷ 3 = 7.5 m"
    },
    {
      question: "🎨 If red + blue = purple, yellow + blue = green, then red + yellow = ?",
      options: [
        "Orange",
        "Pink", 
        "Brown",
        "Purple"
      ],
      correct: 0,
      explanation: "Mixing primary colors: red + yellow = orange"
    },
    {
      question: "⚖️ On a scale: 3 apples = 6 pears, 2 pears = 4 plums. How many plums equal 1 apple?",
      options: [
        "2",
        "3",
        "4", 
        "6"
      ],
      correct: 2,
      explanation: "1 apple = 2 pears, 1 pear = 2 plums, therefore 1 apple = 4 plums"
    },
    {
      question: "🔍 Find the pattern: 1, 4, 9, 16, 25, ?",
      options: [
        "30",
        "35",
        "36", 
        "49"
      ],
      correct: 2,
      explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36"
    },
    {
      question: "🏠 A building has 4 floors. 2 families live on the 1st floor, each next floor has twice as many. How many families on the 4th floor?",
      options: [
        "8",
        "12",
        "16", 
        "24"
      ],
      correct: 2,
      explanation: "1st: 2, 2nd: 4, 3rd: 8, 4th: 16 families"
    },
    {
      question: "🔄 What number is missing: 100, 95, 85, 70, 50, ?",
      options: [
        "25",
        "30",
        "35",
        "20"
      ],
      correct: 0,
      explanation: "Subtracting: -5, -10, -15, -20, -25. Next number: 50-25=25"
    },
    {
      question: "🧩 Logic puzzle: If A > B, B > C, and C = D, then:",
      options: [
        "A = D",
        "A > D", 
        "A < D",
        "Cannot determine"
      ],
      correct: 1,
      explanation: "A > B > C = D, therefore A > D"
    },
    {
      question: "🎯 Continue the series: Z, Y, X, W, V, ?",
      options: [
        "T",
        "S",
        "U", 
        "R"
      ],
      correct: 2,
      explanation: "Alphabet in reverse order: Z, Y, X, W, V, U"
    },
    {
      question: "⭐ A box has 60 balls: 20 red, 15 blue, the rest yellow. What's the probability of drawing a yellow ball?",
      options: [
        "25%",
        "41.7%", 
        "50%",
        "33.3%"
      ],
      correct: 1,
      explanation: "Yellow balls: 60-20-15=25. Probability: 25/60 = 0.417 = 41.7%"
    },
    {
      question: "🧠 Final challenge: If all rules have exceptions, then this rule:",
      options: [
        "Has an exception",
        "Has no exception", 
        "Contradicts itself",
        "Is undefined"
      ],
      correct: 2,
      explanation: "This is a classic paradox: if the rule 'all rules have exceptions' has an exception, then it contradicts itself"
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
  const iqTestQuestions = document.getElementById("quiz-questions");
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
    iqTestQuestions.style.display = "block";
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
    questionCounter.textContent = `Question ${iqCurrentQuestion + 1} of ${iqQuizData.questions.length}`;
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
    if (iq >= 130) return { text: "Genius Level", class: "genius" };
    if (iq >= 120) return { text: "Superior", class: "superior" };
    if (iq >= 110) return { text: "Above Average", class: "above-average" };
    if (iq >= 90) return { text: "Average", class: "average" };
    if (iq >= 80) return { text: "Below Average", class: "below-average" };
    return { text: "Low Level", class: "low" };
  }

  function generateRecommendations(results) {
    const recommendations = [];
    
    if (results.iq >= 130) {
      recommendations.push({
        title: "🎓 Talent Development",
        content: "Your exceptional intellectual level allows you to achieve outstanding results. Consider studying at prestigious institutions or participating in scientific research."
      });
    } else if (results.iq >= 120) {
      recommendations.push({
        title: "📚 Academic Excellence",
        content: "Your high intelligence level opens wide opportunities for learning and career. Consider challenging academic programs or leadership positions."
      });
    } else if (results.iq >= 110) {
      recommendations.push({
        title: "💼 Professional Development",
        content: "Your above-average intelligence level is excellent. Focus on developing specialized skills in your field and leadership qualities."
      });
    } else if (results.iq >= 90) {
      recommendations.push({
        title: "🌱 Continuous Learning",
        content: "Your average intelligence level is a good foundation for development. Focus on continuous learning and practical application of knowledge."
      });
    } else {
      recommendations.push({
        title: "🎯 Skill Development",
        content: "Consider additional training and cognitive skill exercises. Reading, puzzles, and logic games can help improve your results."
      });
    }

    // Add general recommendations based on performance in different areas
    if (results.percentage < 60) {
      recommendations.push({
        title: "🧩 Logical Thinking",
        content: "Practice solving logic puzzles, sudoku, and other tasks to develop analytical thinking skills."
      });
    }

    recommendations.push({
      title: "📖 General Tips",
      content: "Regular reading, learning new languages, musical instruments, and physical exercise all contribute to intelligence and cognitive function development."
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
    iqTestQuestions.style.display = "none";
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
            <strong>Your answer:</strong> ${userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
            ${isCorrect ? '<span style="color: #28a745;">✓ Correct</span>' : '<span style="color: #dc3545;">✗ Incorrect</span>'}
          </div>
          ${!isCorrect ? `<div class="review-answer correct">
            <strong>Correct answer:</strong> ${question.options[question.correct]}
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
});