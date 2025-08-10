document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    // Entrepreneur Quiz data
    const entrepreneurQuestions = [
      {
        question: "🎯 When I have an idea, I quickly move to action",
        skill: "action",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "💪 I'm willing to take risks to achieve my goals",
        skill: "risk-taking",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🧠 I easily find non-standard solutions",
        skill: "innovation",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "👥 People often come to me for advice",
        skill: "leadership",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🎲 I'm not afraid of uncertainty and change",
        skill: "risk-taking",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "💡 I constantly look for new opportunities",
        skill: "innovation",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🔥 I work persistently towards achieving goals",
        skill: "persistence",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🎯 I enjoy making important decisions",
        skill: "leadership",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "📈 I understand the basics of running a business",
        skill: "business-sense",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🚀 I quickly adapt to new situations",
        skill: "action",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "💼 I'm interested in how different companies make money",
        skill: "business-sense",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "⚡ Failures motivate me even more",
        skill: "persistence",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🎨 I often think of improvements for existing products",
        skill: "innovation",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🎯 I can easily motivate other people",
        skill: "leadership",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "💰 I'm ready to invest my own money in an idea",
        skill: "risk-taking",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "📊 I regularly analyze financial indicators",
        skill: "business-sense",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🔧 I can quickly solve problems",
        skill: "action",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🏆 I work persistently even when tired",
        skill: "persistence",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "🌟 I enjoy being first in new endeavors",
        skill: "innovation",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      },
      {
        question: "👑 I'm a natural leader in groups",
        skill: "leadership",
        answers: [
          { text: "Always", score: 5 },
          { text: "Often", score: 4 },
          { text: "Sometimes", score: 3 },
          { text: "Rarely", score: 2 },
          { text: "Never", score: 1 }
        ]
      }
    ];

    const skillNames = {
      "action": "Action Orientation",
      "risk-taking": "Risk Readiness",
      "innovation": "Innovation",
      "leadership": "Leadership",
      "persistence": "Persistence", 
      "business-sense": "Business Thinking"
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
      questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${entrepreneurQuestions.length}`;
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
        level = "High Potential 🚀";
        levelClass = "excellent";
      } else if (overallScore >= 60) {
        level = "Good Potential 👍";
        levelClass = "good";
      } else if (overallScore >= 40) {
        level = "Average Potential 📈";
        levelClass = "average";
      } else if (overallScore >= 20) {
        level = "Low Potential 📚";
        levelClass = "below-average";
      } else {
        level = "Needs Development 🎯";
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
          <div class="card-title">💪 Your Strengths</div>
          <div class="card-content">
            ${strengths.map(skill => 
              `<strong>${skillNames[skill]}</strong> (${skillScores[skill].percentage}%) - This is your key advantage as an entrepreneur.`
            ).join('<br><br>')}
          </div>
        </div>
        <div class="strength-weakness-card weakness">
          <div class="card-title">⚠️ Areas for Development</div>
          <div class="card-content">
            ${weaknesses.map(skill => 
              `<strong>${skillNames[skill]}</strong> (${skillScores[skill].percentage}%) - We recommend focusing on developing this skill.`
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
          title: "🚀 Ready for Entrepreneurship",
          items: [
            "You're ready to start your own business",
            "Consider innovative startups in your areas of interest",
            "Look for investors and business partners",
            "Study successful cases in your industry"
          ]
        });
      } else if (score >= 60) {
        recommendations.push({
          title: "📈 Business Preparation",
          items: [
            "Gain more experience in your field",
            "Take entrepreneurship courses",
            "Start with a small business or franchise",
            "Find a mentor among experienced entrepreneurs"
          ]
        });
      } else {
        recommendations.push({
          title: "🎯 Skills Development",
          items: [
            "Focus on developing entrepreneurial skills",
            "Start with side projects or freelancing",
            "Study business and finance basics",
            "Develop leadership qualities"
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
          <h6>🎯 Priority Skills for Development</h6>
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
          <h6>📚 3-Month Action Plan</h6>
          <div class="recommendation-item">
            <div class="recommendation-title">Week 1-2: Assessment and Planning</div>
            <div class="recommendation-description">Analyze your results, set specific development goals</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Week 3-8: Learning and Practice</div>
            <div class="recommendation-description">Take online courses, read entrepreneurship books, practice new skills</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Week 9-12: Application</div>
            <div class="recommendation-description">Apply what you've learned: launch a mini-project or side business</div>
          </div>
        </div>
        
        <div class="recommendation-section">
          <h6>🔗 Recommended Resources</h6>
          <div class="recommendation-item">
            <div class="recommendation-title">Books</div>
            <div class="recommendation-description">"Lean Startup" by Eric Ries, "Zero to One" by Peter Thiel</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Online Courses</div>
            <div class="recommendation-description">Coursera Business courses, edX Entrepreneurship programs</div>
          </div>
          <div class="recommendation-item">
            <div class="recommendation-title">Communities</div>
            <div class="recommendation-description">Startup Weekend, business incubators, networking events</div>
          </div>
        </div>
      `;

      quizResults.style.display = 'none';
      developmentPlan.style.display = 'block';
    }

    function getSkillDevelopmentTip(skill) {
      const tips = {
        "action": "Practice quick decision-making. Set daily micro-goals and execute them.",
        "risk-taking": "Start with small risks. Analyze successful entrepreneur cases in your field.",
        "innovation": "Train creative thinking. Look for problems around you and invent solutions.",
        "leadership": "Take initiative in group projects. Develop communication and motivation skills.",
        "persistence": "Set long-term goals and break them into stages. Celebrate small wins.",
        "business-sense": "Study finance and marketing basics. Analyze business models of successful companies."
      };
      return tips[skill] || "Focus on continuous development of this skill.";
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