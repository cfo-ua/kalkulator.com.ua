document.addEventListener("DOMContentLoaded", function () {
  // Quiz data
  const quizQuestions = [
    {
      question: "🎣 Which of the following is the BEST way to identify a phishing email?",
      options: [
        "It comes from a company you recognize",
        "It has professional-looking graphics and logos",
        "It creates urgency and asks for personal information",
        "It's sent to your work email address"
      ],
      correct: 2,
      explanation: "Phishing emails often create false urgency and pressure you to provide personal information quickly. Legitimate companies rarely ask for sensitive information via email."
    },
    {
      question: "🔐 What makes a password strong and secure?",
      options: [
        "Using your birthday and name",
        "12+ characters with mixed letters, numbers, and symbols",
        "A common word with numbers at the end",
        "Using the same password for multiple accounts"
      ],
      correct: 1,
      explanation: "Strong passwords should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special symbols."
    },
    {
      question: "🦠 What is ransomware?",
      options: [
        "Software that improves computer performance",
        "A type of antivirus program",
        "Malware that encrypts files and demands payment",
        "A legitimate backup solution"
      ],
      correct: 2,
      explanation: "Ransomware is malicious software that encrypts your files and demands payment (usually in cryptocurrency) to decrypt them. It's one of the most dangerous cyber threats."
    },
    {
      question: "📱 When using public Wi-Fi, what should you avoid doing?",
      options: [
        "Checking the weather",
        "Reading news websites",
        "Online banking or shopping",
        "Using social media"
      ],
      correct: 2,
      explanation: "Public Wi-Fi networks are often unsecured and can be monitored by attackers. Avoid accessing sensitive accounts like banking or entering personal information."
    },
    {
      question: "🔗 How can you verify if a website is secure?",
      options: [
        "The website looks professional",
        "It has a lock icon and HTTPS in the URL",
        "It loads quickly",
        "It has many advertisements"
      ],
      correct: 1,
      explanation: "Look for HTTPS (not just HTTP) in the URL and a lock icon in the address bar. These indicate the connection is encrypted and more secure."
    },
    {
      question: "📧 What should you do if you receive a suspicious email from your 'bank'?",
      options: [
        "Click the links to verify your account",
        "Reply with your account information",
        "Contact your bank directly using official channels",
        "Forward it to all your contacts"
      ],
      correct: 2,
      explanation: "Never trust emails claiming to be from financial institutions. Instead, contact your bank directly using phone numbers or websites you know are legitimate."
    },
    {
      question: "🔄 How often should you update your software and operating system?",
      options: [
        "Once a year",
        "Only when it stops working",
        "As soon as updates are available",
        "Never, updates cause problems"
      ],
      correct: 2,
      explanation: "Software updates often include security patches that fix vulnerabilities. Install updates promptly to protect against newly discovered threats."
    },
    {
      question: "👥 What is social engineering in cybersecurity?",
      options: [
        "Building secure networks",
        "Manipulating people to reveal information",
        "Creating social media accounts",
        "Designing user interfaces"
      ],
      correct: 1,
      explanation: "Social engineering involves manipulating people psychologically to trick them into divulging confidential information or performing actions that compromise security."
    },
    {
      question: "💾 How often should you back up important data?",
      options: [
        "Never, cloud storage is enough",
        "Once every few years",
        "Regularly, following the 3-2-1 rule",
        "Only before major updates"
      ],
      correct: 2,
      explanation: "Follow the 3-2-1 backup rule: 3 copies of important data, on 2 different media types, with 1 copy stored offsite. Regular backups protect against ransomware and hardware failure."
    },
    {
      question: "🔐 What is two-factor authentication (2FA)?",
      options: [
        "Using two different passwords",
        "An extra security step beyond passwords",
        "A type of encryption",
        "A backup password system"
      ],
      correct: 1,
      explanation: "Two-factor authentication adds an extra layer of security by requiring a second form of verification (like a code sent to your phone) in addition to your password."
    },
    {
      question: "🌐 Which browser security practice is MOST important?",
      options: [
        "Using private/incognito mode for everything",
        "Keeping multiple tabs open",
        "Regularly clearing cookies and cache",
        "Disabling all browser extensions"
      ],
      correct: 2,
      explanation: "Regularly clearing cookies, cache, and browsing history helps remove tracking data and potential security risks. Private mode is good but not sufficient alone."
    },
    {
      question: "📲 What's the safest way to download mobile apps?",
      options: [
        "From official app stores only",
        "From any website that offers them",
        "Through email attachments",
        "From social media links"
      ],
      correct: 0,
      explanation: "Always download apps from official stores (App Store, Google Play) as they have security screening processes. Third-party sources may distribute malware."
    },
    {
      question: "🎯 What information should you NEVER share on social media?",
      options: [
        "Your favorite movies",
        "Photos of your lunch",
        "Your full birthdate and address",
        "Your opinion on current events"
      ],
      correct: 2,
      explanation: "Personal information like full birthdate, address, phone numbers, and location details can be used for identity theft and targeted attacks."
    },
    {
      question: "🔓 What should you do immediately if you suspect your account is compromised?",
      options: [
        "Wait to see what happens",
        "Change your password and enable 2FA",
        "Delete the account",
        "Post about it on social media"
      ],
      correct: 1,
      explanation: "Act quickly: change your password immediately, enable two-factor authentication, check for unauthorized activity, and notify the service provider."
    },
    {
      question: "💻 Which of these is a sign your computer might be infected with malware?",
      options: [
        "It starts up quickly",
        "Programs run smoothly",
        "Frequent crashes and slow performance",
        "Low battery usage"
      ],
      correct: 2,
      explanation: "Malware often causes computers to run slowly, crash frequently, display unexpected pop-ups, or behave erratically. These are warning signs to investigate."
    }
  ];

  // Elements
  const quizIntro = document.getElementById("quiz-intro");
  const quizQuestions = document.getElementById("quiz-questions");
  const quizResults = document.getElementById("quiz-results");
  const answerReview = document.getElementById("answer-review");
  const startQuizBtn = document.getElementById("start-quiz");
  const questionContainer = document.getElementById("question-container");
  const questionCounter = document.getElementById("question-counter");
  const progressFill = document.getElementById("progress-fill");
  const prevBtn = document.getElementById("prev-question");
  const nextBtn = document.getElementById("next-question");
  const submitBtn = document.getElementById("submit-quiz");
  const retakeBtn = document.getElementById("retake-quiz");
  const reviewAnswersBtn = document.getElementById("review-answers");
  const backToResultsBtn = document.getElementById("back-to-results");

  // Quiz state
  let currentQuestion = 0;
  let userAnswers = [];
  let quizData = [];

  // Initialize quiz
  function initQuiz() {
    // Shuffle questions for variety
    quizData = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 15);
    userAnswers = new Array(quizData.length).fill(-1);
    currentQuestion = 0;
    showSection(quizIntro);
  }

  // Show specific section
  function showSection(section) {
    [quizIntro, quizQuestions, quizResults, answerReview].forEach(s => {
      s.style.display = 'none';
    });
    section.style.display = 'block';
  }

  // Start quiz
  function startQuiz() {
    showSection(quizQuestions);
    displayQuestion();
  }

  // Display current question
  function displayQuestion() {
    const question = quizData[currentQuestion];
    const questionNumber = currentQuestion + 1;
    const totalQuestions = quizData.length;

    // Update progress
    questionCounter.textContent = `Question ${questionNumber} of ${totalQuestions}`;
    progressFill.style.width = `${(questionNumber / totalQuestions) * 100}%`;

    // Create question HTML
    questionContainer.innerHTML = `
      <div class="question-title">${question.question}</div>
      <ul class="answer-options">
        ${question.options.map((option, index) => `
          <li class="answer-option">
            <label>
              <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
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
        userAnswers[currentQuestion] = parseInt(this.value);
        updateNavigationButtons();
      });
    });

    updateNavigationButtons();
  }

  // Update navigation buttons
  function updateNavigationButtons() {
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === quizData.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
      submitBtn.disabled = userAnswers[currentQuestion] === -1;
    } else {
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
      nextBtn.disabled = userAnswers[currentQuestion] === -1;
    }
  }

  // Navigate to previous question
  function previousQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      displayQuestion();
    }
  }

  // Navigate to next question
  function nextQuestion() {
    if (currentQuestion < quizData.length - 1 && userAnswers[currentQuestion] !== -1) {
      currentQuestion++;
      displayQuestion();
    }
  }

  // Submit quiz and show results
  function submitQuiz() {
    if (userAnswers[currentQuestion] === -1) return;

    const score = calculateScore();
    displayResults(score);
    showSection(quizResults);
  }

  // Calculate score
  function calculateScore() {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quizData[index].correct) {
        correct++;
      }
    });
    return {
      correct: correct,
      total: quizData.length,
      percentage: Math.round((correct / quizData.length) * 100)
    };
  }

  // Display results
  function displayResults(score) {
    document.getElementById("final-score").textContent = `${score.percentage}%`;
    document.getElementById("correct-count").textContent = score.correct;
    document.getElementById("total-questions").textContent = score.total;

    // Determine skill level
    const scoreLevel = document.getElementById("score-level");
    let level, recommendations;

    if (score.percentage >= 80) {
      level = "🎉 Advanced";
      scoreLevel.className = "score-level advanced";
      recommendations = `
        <div class="recommendation-card">
          <h6>🌟 Excellent Cybersecurity Awareness!</h6>
          <p>You have strong knowledge of cybersecurity best practices. Consider:</p>
          <ul>
            <li>🎓 Sharing your knowledge with others</li>
            <li>📚 Staying updated on emerging threats</li>
            <li>🛡️ Helping others improve their security</li>
            <li>🏢 Leading security initiatives at work</li>
          </ul>
        </div>
      `;
    } else if (score.percentage >= 60) {
      level = "📈 Intermediate";
      scoreLevel.className = "score-level intermediate";
      recommendations = `
        <div class="recommendation-card">
          <h6>👍 Good Security Foundation!</h6>
          <p>You have decent cybersecurity knowledge but can improve. Focus on:</p>
          <ul>
            <li>🔐 Advanced password management</li>
            <li>🎣 Better phishing detection skills</li>
            <li>📱 Mobile device security</li>
            <li>💾 Regular backup strategies</li>
          </ul>
        </div>
      `;
    } else {
      level = "📚 Beginner";
      scoreLevel.className = "score-level beginner";
      recommendations = `
        <div class="recommendation-card">
          <h6>🚨 Security Awareness Needs Improvement!</h6>
          <p>Your cybersecurity knowledge needs development. Priority areas:</p>
          <ul>
            <li>🔒 Basic password security</li>
            <li>📧 Email safety and phishing awareness</li>
            <li>🦠 Understanding malware threats</li>
            <li>🌐 Safe browsing practices</li>
            <li>📚 Take a cybersecurity awareness course</li>
          </ul>
        </div>
      `;
    }

    scoreLevel.textContent = level;
    document.getElementById("recommendations").innerHTML = recommendations;
  }

  // Show answer review
  function showAnswerReview() {
    const reviewContainer = document.getElementById("review-container");
    
    const reviewHTML = quizData.map((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correct;
      const isCorrect = userAnswer === correctAnswer;

      return `
        <div class="review-item">
          <div class="review-question">${question.question}</div>
          
          <div class="review-answer user-answer">
            <strong>Your answer:</strong> ${question.options[userAnswer]} 
            ${isCorrect ? '✅' : '❌'}
          </div>
          
          ${!isCorrect ? `
            <div class="review-answer correct">
              <strong>Correct answer:</strong> ${question.options[correctAnswer]} ✅
            </div>
          ` : ''}
          
          <div class="review-explanation">
            <strong>💡 Explanation:</strong> ${question.explanation}
          </div>
        </div>
      `;
    }).join('');

    reviewContainer.innerHTML = reviewHTML;
    showSection(answerReview);
  }

  // Retake quiz
  function retakeQuiz() {
    initQuiz();
  }

  // Event listeners
  startQuizBtn.addEventListener("click", startQuiz);
  prevBtn.addEventListener("click", previousQuestion);
  nextBtn.addEventListener("click", nextQuestion);
  submitBtn.addEventListener("click", submitQuiz);
  retakeBtn.addEventListener("click", retakeQuiz);
  reviewAnswersBtn.addEventListener("click", showAnswerReview);
  backToResultsBtn.addEventListener("click", () => showSection(quizResults));

  // Initialize
  initQuiz();
});