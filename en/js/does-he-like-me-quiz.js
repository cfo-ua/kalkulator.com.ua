document.addEventListener("DOMContentLoaded", function () {
  // Quiz questions for "Does he like me?"
  const quizQuestions = [
    {
      question: "👀 How often does he look at you during conversations?",
      options: [
        "Constantly maintains eye contact and smiles",
        "Often looks at me but sometimes looks away",
        "Looks occasionally, more at his phone or around",
        "Rarely makes eye contact, seems distant"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💬 Who usually initiates your communication?",
      options: [
        "He often texts first and looks for reasons to talk",
        "We both initiate communication about equally",
        "I text first more often, he responds",
        "I almost always initiate conversations"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📱 How quickly does he respond to your messages?",
      options: [
        "Usually responds within a few minutes",
        "Responds within an hour, even when busy",
        "Responds after several hours or the next day",
        "Often leaves messages unanswered"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🤗 How does he act when you're around other people?",
      options: [
        "Tries to get my attention and talks to me more",
        "Includes me in conversations and pays attention to me",
        "Acts normal but friendly",
        "Seems less attentive or focuses more on others"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💭 Does he remember details from your conversations?",
      options: [
        "Remembers even small details of what I told him",
        "Recalls important things and asks about my affairs",
        "Remembers the basics but might forget details",
        "Often forgets what we talked about"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🎯 Does he try to impress you?",
      options: [
        "Obviously tries to look better and talks about achievements",
        "Sometimes shows off or tells interesting stories",
        "Acts naturally but positively",
        "I don't notice special attempts to impress"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📅 How does he respond to making plans together?",
      options: [
        "Suggests meetings and activities himself",
        "Eagerly agrees to my suggestions",
        "Sometimes agrees if it's convenient for him",
        "Rarely available or often cancels plans"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "😊 How does he react to your jokes or comments?",
      options: [
        "Always laughs and responds positively to my humor",
        "Often laughs and keeps the conversation going",
        "Smiles politely but doesn't always actively respond",
        "Rarely laughs or seems not to get my humor"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🔍 Is he interested in your personal life?",
      options: [
        "Often asks about my plans, feelings, and relationships",
        "Sometimes shows interest in my life and well-being",
        "Listens when I share but rarely asks himself",
        "Seems indifferent to my personal information"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🤲 Does he offer you help?",
      options: [
        "Often offers help and shows concern for me",
        "Ready to help when I ask",
        "Sometimes helps if it's not difficult",
        "Rarely offers help or seems uninterested"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💫 How does he act when you mention other guys?",
      options: [
        "Noticeably tenses up or tries to change the subject",
        "Asks additional questions or seems interested",
        "Listens neutrally without special reactions",
        "Seems indifferent or even encouraging"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🌟 What's your overall impression of his attitude toward you?",
      options: [
        "He clearly treats me differently compared to others",
        "I feel like he likes me more as a friend",
        "He's friendly but hard to tell if it's special",
        "He's polite but distant"
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
      level = "Strong Romantic Feelings";
      emoji = "💕";
      description = "All signs point to him really liking you! His behavior clearly shows romantic interest and desire to deepen the relationship with you.";
      advice = "This is great news! You can be more confident in showing mutual interest. Consider having an honest conversation about your feelings or creating a more romantic atmosphere.";
    } else if (score >= 80) {
      level = "Clear Attraction";
      emoji = "😍";
      description = "There are very good signs that he likes you! His behavior shows significant interest and attention to you, indicating romantic feelings.";
      advice = "Keep developing the relationship! Try to spend more time together, create opportunities for private communication, and don't be afraid to show mutual interest.";
    } else if (score >= 70) {
      level = "Noticeable Interest";
      emoji = "😊";
      description = "There are good signs of attraction! He shows more interest in you than in regular acquaintances, which could mean developing romantic feelings.";
      advice = "These are positive signals! Try to deepen communication, find common interests, and create more opportunities for personal contact.";
    } else if (score >= 60) {
      level = "Moderate Attraction";
      emoji = "🤔";
      description = "There are some signs of interest, but they're not very pronounced. Maybe he's not sure about his feelings yet or is afraid to show them.";
      advice = "More time and observation needed. Try being more open, showing interest, and creating a comfortable atmosphere for communication.";
    } else if (score >= 50) {
      level = "Uncertainty";
      emoji = "😐";
      description = "The signals are mixed and it's hard to understand his true feelings. Maybe he sees you more as a friend or hasn't decided yet.";
      advice = "Don't worry! Romantic feelings develop differently. Focus on building a strong friendship and trust, which can become the foundation for deeper relationships.";
    } else {
      level = "Minimal Romantic Interest";
      emoji = "😔";
      description = "Currently, signs of romantic interest are minimal. He likely sees you as a good friend or just an acquaintance.";
      advice = "This doesn't mean it's over! People change, and feelings can develop over time. Focus on personal growth and find someone who will appreciate you as you deserve.";
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
      <div style="background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em;">${insights.emoji} Analysis Results</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${results.score}%</div>
        <div style="font-size: 1.3em; opacity: 0.9;">${insights.level}</div>
      </div>

      <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💖 Analysis of His Feelings</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.description}</p>
      </div>

      <div style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">💡 Advice for Relationship Development</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">🌟 General Tips</h4>
        <ul style="margin: 0; line-height: 1.6; color: #6c757d;">
          <li>Be yourself - authenticity is more attractive than masks</li>
          <li>Show interest in his life and hobbies</li>
          <li>Create opportunities for spending time together</li>
          <li>Don't be afraid to take initiative in communication</li>
          <li>Trust your intuition and observations</li>
        </ul>
      </div>

      <div style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>💝 Remember: every person is unique and expresses feelings in their own way. The best way to know about true feelings is through open and honest communication. Trust yourself and be open to new possibilities!</em>
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
    const shareText = `I took the "Does he like me?" quiz and scored ${results.score}%! Check your romantic chances at kalkulator.com.ua`;
    
    if (navigator.share) {
      navigator.share({
        title: '"Does He Like Me?" Quiz',
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