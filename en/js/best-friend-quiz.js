document.addEventListener("DOMContentLoaded", function () {
  // Quiz questions for best friend compatibility
  const quizQuestions = [
    {
      question: "🎉 How do you usually spend free time together?",
      options: [
        "Active outdoor activities and sports",
        "Quiet conversations over coffee or tea",
        "Watching movies or series at home",
        "Shopping or visiting cafes in the city"
      ],
      weights: {
        adventurous: [3, 1, 0, 2],
        social: [2, 3, 1, 3],
        relaxed: [1, 3, 3, 2],
        creative: [2, 2, 2, 1]
      }
    },
    {
      question: "💬 How do you usually communicate with each other?",
      options: [
        "We text constantly throughout the day",
        "We call when there's important news",
        "We meet in person for deep conversations",
        "We communicate through social media and memes"
      ],
      weights: {
        communicative: [3, 2, 3, 1],
        supportive: [2, 3, 3, 1],
        social: [3, 1, 2, 3],
        modern: [3, 1, 0, 3]
      }
    },
    {
      question: "🤝 How do you support each other during difficult times?",
      options: [
        "I listen and give practical advice",
        "I just stay close and give hugs",
        "I try to cheer them up with jokes",
        "I help with concrete actions"
      ],
      weights: {
        supportive: [3, 3, 1, 3],
        empathetic: [3, 3, 2, 2],
        optimistic: [1, 1, 3, 1],
        practical: [3, 1, 0, 3]
      }
    },
    {
      question: "🎯 What interests do you share?",
      options: [
        "Music, art, and creativity",
        "Sports and active lifestyle",
        "Books, movies, and deep topics",
        "Fashion, beauty, and lifestyle"
      ],
      weights: {
        creative: [3, 1, 2, 2],
        adventurous: [1, 3, 1, 1],
        intellectual: [2, 1, 3, 1],
        social: [2, 2, 1, 3]
      }
    },
    {
      question: "😊 What do you value most in friendship?",
      options: [
        "Mutual trust and honesty",
        "Fun and laughter together",
        "Support in any moments",
        "Shared adventures and memories"
      ],
      weights: {
        loyal: [3, 1, 3, 2],
        fun: [1, 3, 1, 3],
        supportive: [3, 1, 3, 1],
        adventurous: [2, 2, 1, 3]
      }
    },
    {
      question: "🎭 What's your style of resolving conflicts?",
      options: [
        "We openly discuss the problem",
        "We give each other time to cool down",
        "We try to find a compromise",
        "We just forget and move on"
      ],
      weights: {
        communicative: [3, 1, 2, 0],
        patient: [2, 3, 2, 1],
        diplomatic: [2, 2, 3, 1],
        easygoing: [1, 2, 1, 3]
      }
    },
    {
      question: "🌟 How do you celebrate each other's successes?",
      options: [
        "We throw a big party with friends",
        "We do something special just the two of us",
        "We give meaningful gifts",
        "We just genuinely rejoice and congratulate"
      ],
      weights: {
        social: [3, 1, 1, 2],
        intimate: [1, 3, 2, 2],
        thoughtful: [2, 2, 3, 1],
        genuine: [2, 2, 2, 3]
      }
    },
    {
      question: "🏠 How well do you know each other's families?",
      options: [
        "Very close, like part of the family",
        "We know and communicate sometimes",
        "We know basic information",
        "We rarely interact with families"
      ],
      weights: {
        close: [3, 2, 1, 0],
        integrated: [3, 2, 1, 0],
        respectful: [2, 3, 2, 1],
        independent: [0, 1, 2, 3]
      }
    },
    {
      question: "⏰ How long have you been friends?",
      options: [
        "More than 5 years - we're true old friends",
        "2-5 years - strong and tested friendship",
        "1-2 years - friendship is actively developing",
        "Less than a year - new but promising friendship"
      ],
      weights: {
        established: [3, 2, 1, 0],
        stable: [3, 3, 2, 1],
        growing: [2, 2, 3, 2],
        fresh: [1, 1, 2, 3]
      }
    },
    {
      question: "🤔 What best describes your friendship?",
      options: [
        "We're like two parts of one whole",
        "We complement each other with our differences",
        "We're life adventure partners",
        "We're reliable support for each other"
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
      level = "Perfect Friendship";
      description = "You're true best friends with outstanding compatibility! Your personalities complement each other perfectly.";
      advice = "Continue to cherish and develop this special friendship. You have a rare bond that's worth treasuring.";
    } else if (score >= 80) {
      level = "Very Strong Friendship";
      description = "You have an excellent friendship with a solid foundation of mutual understanding and support.";
      advice = "Your friendship has all the chances to become lifelong. Continue investing time and energy in this relationship.";
    } else if (score >= 70) {
      level = "Good Friendship";
      description = "You have a stable friendship with good potential for further growth and deepening.";
      advice = "Work on shared interests and more open communication to strengthen your friendship.";
    } else if (score >= 60) {
      level = "Moderate Friendship";
      description = "Your friendship needs attention and mutual effort for development and strengthening.";
      advice = "Focus on better understanding each other's needs and finding common ground.";
    } else if (score >= 50) {
      level = "Challenging Friendship";
      description = "Your friendship has significant differences that require work and understanding.";
      advice = "Be patient and open. Work on communication and mutual respect.";
    } else {
      level = "Problematic Friendship";
      description = "Your friendship faces major compatibility challenges.";
      advice = "Consider having an honest conversation about your differences and ways to overcome them.";
    }

    // Determine strengths based on top traits
    const traitDescriptions = {
      adventurous: "adventure and activity",
      social: "sociability and communication", 
      relaxed: "calmness and relaxation",
      creative: "creativity and artistry",
      communicative: "open communication",
      supportive: "mutual support",
      empathetic: "empathy and understanding",
      loyal: "loyalty and trust",
      fun: "fun and humor",
      practical: "practicality and reliability"
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
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em;">👫 Friendship Quiz Results</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${results.score}%</div>
        <div style="font-size: 1.3em; opacity: 0.9;">${insights.level}</div>
      </div>

      <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💚 Your Friendship Assessment</h4>
        <p style="margin: 0 0 15px 0; line-height: 1.6; color: #495057;">${insights.description}</p>
        <p style="margin: 0; line-height: 1.6; color: #495057;"><strong>Your strengths:</strong> ${insights.strengths}</p>
      </div>

      <div style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">💡 Advice for Improving Friendship</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">🌟 Friendship Development</h4>
        <ul style="margin: 0; line-height: 1.6; color: #6c757d;">
          <li>Spend more quality time together</li>
          <li>Maintain open and honest communication</li>
          <li>Appreciate and celebrate each other's uniqueness</li>
          <li>Be patient with differences</li>
          <li>Create new shared memories and traditions</li>
        </ul>
      </div>

      <div style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>🤝 Remember: the best friendships are built on mutual respect, trust, and support. Every friendship is unique and develops over time through shared experiences and mutual understanding.</em>
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
    const shareText = `I took the best friend quiz and scored ${results.score}% compatibility! Test your friendship at kalkulator.com.ua`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Best Friend Quiz',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText + ' ' + window.location.href)
        .then(() => alert('Result copied to clipboard!'))
        .catch(() => alert('Failed to copy result'));
    }
  }

  // Initialize the quiz
  initQuiz();
});