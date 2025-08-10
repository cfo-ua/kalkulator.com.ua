document.addEventListener("DOMContentLoaded", function () {
  // Quiz questions for "Do I like him?"
  const quizQuestions = [
    {
      question: "💭 How often do you think about him throughout the day?",
      options: [
        "Constantly, he's in my thoughts almost all the time",
        "Several times a day, especially when I'm not busy",
        "Sometimes I remember him when something reminds me",
        "Rarely think about him, only when I see him"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "😊 How do you feel when you see him?",
      options: [
        "I feel excited and get 'butterflies' in my stomach",
        "I feel happy and smile, my mood lifts",
        "I feel comfortable and happy",
        "I feel normal, like with any friend"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "👗 How do you prepare when you know you'll see him?",
      options: [
        "I carefully choose my outfit and pay special attention to appearance",
        "I try to look a bit better than usual",
        "I dress as always but make sure I look neat",
        "I don't change my usual preparation"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📱 How do you react to his messages?",
      options: [
        "I read immediately and respond quickly with excitement",
        "I'm happy about the message and respond enthusiastically",
        "I respond friendly within reasonable time",
        "I respond when convenient, without special emotions"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🌙 Do you dream about him or imagine romantic scenarios?",
      options: [
        "Yes, I often fantasize about romantic moments with him",
        "Sometimes I imagine how we could be together",
        "Rarely, but such thoughts have occurred",
        "I've never thought about him romantically"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "😤 How do you react when he talks to other girls?",
      options: [
        "I feel jealous and uncomfortable",
        "I get a bit sad or worried",
        "I notice but don't particularly worry",
        "It doesn't bother me at all"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🎯 How important is his opinion of you?",
      options: [
        "Very important, I want to make a good impression on him",
        "Quite important, I try to be at my best",
        "Moderately important, like other friends' opinions",
        "No more important than anyone else's opinion"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "📅 How do you feel about spending time with him?",
      options: [
        "I always enjoy the opportunity to be alone with him",
        "I like spending time together",
        "It's nice to communicate in a group of friends",
        "I feel neutral, like talking to a friend"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "💫 Are you willing to change your plans for him?",
      options: [
        "Yes, I often postpone other things to be with him",
        "Sometimes I can change plans if it's important",
        "Rarely, only if nothing important is planned",
        "I never change plans for him"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "🔮 How do you imagine the future with him?",
      options: [
        "I often think about serious relationships and shared future",
        "Sometimes I imagine how we could be a couple",
        "I think of him as a potential partner",
        "I see him only as a friend, nothing more"
      ],
      scores: [4, 3, 2, 1]
    },
    {
      question: "❤️ What best describes your feelings toward him?",
      options: [
        "I feel a deep emotional connection and passion",
        "Strong attraction with romantic notes",
        "Affection with light romantic feelings",
        "Friendly feelings without romantic undertones"
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
      level = "Strong Love";
      emoji = "💕";
      description = "You're definitely in love! Your emotions, thoughts, and behavior clearly indicate deep romantic feelings. He's not just someone you like - you love him.";
      advice = "Your feelings are genuine and deep. Consider having an honest conversation with him about your emotions. Don't be afraid to show your feelings and be vulnerable.";
    } else if (score >= 80) {
      level = "Clear Romantic Attachment";
      emoji = "😍";
      description = "You have serious romantic feelings for him! This is more than just simple attraction - your emotions have the depth and intensity of true attachment.";
      advice = "Your feelings are developing toward love. Give yourself time to get to know him better and develop an emotional connection. Consider getting closer to him.";
    } else if (score >= 70) {
      level = "Noticeable Romantic Attraction";
      emoji = "😊";
      description = "You definitely like him romantically! Your feelings go beyond friendship and have a romantic character.";
      advice = "Your attraction has potential to develop into something more. Spend more time together, get to know each other deeper, and see how your emotions develop.";
    } else if (score >= 60) {
      level = "Moderate Interest";
      emoji = "🤔";
      description = "You feel more than friendly feelings toward him, but your romantic emotions aren't fully formed yet or you haven't fully recognized them.";
      advice = "Give yourself time to understand your feelings. Observe your emotions, spend time together, and allow feelings to develop naturally.";
    } else if (score >= 50) {
      level = "Friendly Attraction";
      emoji = "😐";
      description = "Your feelings toward him are more like strong friendship. Maybe you value him as a friend, but romantic emotions are minimal for now.";
      advice = "This is normal! Not all relationships need to be romantic. Cherish the friendship with him, and if feelings change - that will be natural too.";
    } else {
      level = "Minimal Romantic Interest";
      emoji = "😌";
      description = "Your feelings toward him are predominantly platonic. You likely see him as a good friend or acquaintance, but without romantic undertones.";
      advice = "Friendship is wonderful! Don't feel pressure to create romantic feelings where they don't exist. Cherish what you have and be open to true love with someone else.";
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
      <div style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%); color: #333; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em; color: #2d5a47;">${insights.emoji} Analysis of Your Feelings</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${results.score}%</div>
        <div style="font-size: 1.3em; opacity: 0.8; color: #2d5a47;">${insights.level}</div>
      </div>

      <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">💚 Understanding Your Emotions</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.description}</p>
      </div>

      <div style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">💡 Advice About Your Feelings</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">🌟 General Tips About Feelings</h4>
        <ul style="margin: 0; line-height: 1.6; color: #6c757d;">
          <li>Be honest with yourself about your emotions</li>
          <li>Don't be afraid of feelings - they're a natural part of life</li>
          <li>Give yourself time to understand the depth of emotions</li>
          <li>Trust your intuition and heart</li>
          <li>Remember: every emotion has its value</li>
        </ul>
      </div>

      <div style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>💝 Remember: understanding your own feelings is an important step in personal growth. Regardless of the result, your emotions are important and deserve respect. Be patient with yourself and open to new possibilities!</em>
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
    const shareText = `I took the "Do I like him?" quiz and learned more about my feelings! Take the self-analysis quiz at kalkulator.com.ua`;
    
    if (navigator.share) {
      navigator.share({
        title: '"Do I Like Him?" Quiz',
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