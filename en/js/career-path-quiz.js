document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    // Career Path Quiz data based on Holland's RIASEC model
    const careerQuestions = [
      {
        question: "💻 I enjoy working with technology and computers",
        type: "realistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🔬 I'm attracted to scientific research and data analysis",
        type: "investigative",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🎨 I love creative tasks and self-expression",
        type: "artistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "👥 I enjoy helping people and working in teams",
        type: "social",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🏆 I'm attracted to leadership and project management",
        type: "enterprising",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "📊 I prefer structured work with clear rules",
        type: "conventional",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🔧 I enjoy creating things with my hands",
        type: "realistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🧪 I'm interested in finding solutions to complex problems",
        type: "investigative",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🎭 I dream of working in arts or entertainment",
        type: "artistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🏥 I'm attracted to work in education or healthcare",
        type: "social",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "💼 I want to own my own business or manage a company",
        type: "enterprising",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "📋 I enjoy organizing information and keeping records",
        type: "conventional",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "⚙️ I'm interested in how mechanisms and systems work",
        type: "realistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "📚 I'm fascinated by learning new theories and concepts",
        type: "investigative",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🎵 Creativity and innovation are more important than stability",
        type: "artistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🤝 It's important for me to contribute to society",
        type: "social",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🎯 I love setting ambitious goals and achieving them",
        type: "enterprising",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "📊 I enjoy analyzing data and creating reports",
        type: "conventional",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🏗️ I'm attracted to construction and engineering",
        type: "realistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🔍 I love researching the causes of phenomena and processes",
        type: "investigative",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🖌️ I want to create beautiful and meaningful things",
        type: "artistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "👨‍🏫 I enjoy teaching and mentoring others",
        type: "social",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "💰 I'm motivated by the opportunity to earn big money",
        type: "enterprising",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "📁 I prefer stable schedules and predictable tasks",
        type: "conventional",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      },
      {
        question: "🌱 I'm attracted to working with nature or ecology",
        type: "realistic",
        answers: [
          { text: "Strongly agree", score: 3 },
          { text: "Somewhat agree", score: 2 },
          { text: "Neutral", score: 1 },
          { text: "Somewhat disagree", score: 0 }
        ]
      }
    ];

    const personalityTypes = {
      realistic: {
        name: "Realistic (R)",
        description: "Practical, action-oriented",
        emoji: "🔧"
      },
      investigative: {
        name: "Investigative (I)",
        description: "Analytical, scientifically minded",
        emoji: "🔬"
      },
      artistic: {
        name: "Artistic (A)",
        description: "Creative, expressive",
        emoji: "🎨"
      },
      social: {
        name: "Social (S)",
        description: "People-oriented, helpful",
        emoji: "🤝"
      },
      enterprising: {
        name: "Enterprising (E)",
        description: "Leadership-oriented, ambitious",
        emoji: "🏆"
      },
      conventional: {
        name: "Conventional (C)",
        description: "Organized, systematic",
        emoji: "📊"
      }
    };

    const careerRecommendations = {
      realistic: {
        title: "Technology and Engineering",
        match: "High Match",
        description: "You're suited for practical professions related to technology, construction, and working with material objects.",
        examples: "IT Specialist, Engineer, Architect, Technician, Programmer, Mechanic",
        skills: ["Technical Skills", "Logical Thinking", "Attention to Detail", "Problem Solving"]
      },
      investigative: {
        title: "Science and Research",
        match: "High Match",
        description: "Your strengths lie in analysis, research, and seeking new knowledge. Scientific and research professions suit you well.",
        examples: "Scientist, Data Analyst, Researcher, Doctor, Psychologist, University Professor",
        skills: ["Analytical Thinking", "Research Skills", "Critical Thinking", "Scientific Methods"]
      },
      artistic: {
        title: "Arts and Creative",
        match: "High Match", 
        description: "You have creative potential and ability for self-expression. Creative industries are ideal for you.",
        examples: "Designer, Artist, Musician, Writer, Director, Photographer",
        skills: ["Creative Thinking", "Artistic Skills", "Innovation", "Aesthetic Sense"]
      },
      social: {
        title: "Education and Social Services", 
        match: "High Match",
        description: "Your calling is working with people, teaching, and helping others. Social professions suit you well.",
        examples: "Teacher, Social Worker, Counselor, Psychotherapist, Nurse, HR Manager",
        skills: ["Communication Skills", "Empathy", "Teamwork", "Pedagogical Abilities"]
      },
      enterprising: {
        title: "Business and Management",
        match: "High Match",
        description: "You're a natural leader with entrepreneurial abilities. Management and business positions are excellent for you.",
        examples: "Manager, Entrepreneur, Director, Salesperson, Marketer, Business Consultant",
        skills: ["Leadership Qualities", "Negotiation", "Strategic Thinking", "Risk Management"]
      },
      conventional: {
        title: "Finance and Administration",
        match: "High Match",
        description: "You value order and structure. Organizational and administrative roles are ideal for you.",
        examples: "Accountant, Banker, Secretary, Economist, Auditor, Administrator",
        skills: ["Organizational Skills", "Attention to Detail", "Planning", "Financial Literacy"]
      }
    };

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let scores = {
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0
    };

    // DOM elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const detailedReport = document.getElementById('detailed-report');
    const startButton = document.getElementById('start-quiz');
    const questionContainer = document.getElementById('question-container');
    const progressFill = document.getElementById('progress-fill');
    const questionCounter = document.getElementById('question-counter');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const submitButton = document.getElementById('submit-quiz');
    const retakeButton = document.getElementById('retake-quiz');
    const detailedReportButton = document.getElementById('view-detailed-report');
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
    if (detailedReportButton) {
      detailedReportButton.addEventListener('click', showDetailedReport);
    }
    if (backToResultsButton) {
      backToResultsButton.addEventListener('click', showResults);
    }

    function startQuiz() {
      currentQuestionIndex = 0;
      userAnswers = new Array(careerQuestions.length).fill(null);
      scores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
      };
      
      quizIntro.style.display = 'none';
      quizQuestions.style.display = 'block';
      quizResults.style.display = 'none';
      detailedReport.style.display = 'none';
      
      displayQuestion();
      updateProgress();
      updateNavigation();
    }

    function displayQuestion() {
      const question = careerQuestions[currentQuestionIndex];
      
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
      const progress = (currentQuestionIndex + 1) / careerQuestions.length * 100;
      progressFill.style.width = `${progress}%`;
      questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${careerQuestions.length}`;
    }

    function updateNavigation() {
      prevButton.disabled = currentQuestionIndex === 0;
      
      const isLastQuestion = currentQuestionIndex === careerQuestions.length - 1;
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
      if (newIndex >= 0 && newIndex < careerQuestions.length) {
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
      // Reset scores
      scores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
      };

      // Calculate scores based on answers
      careerQuestions.forEach((question, index) => {
        const answerIndex = userAnswers[index];
        if (answerIndex !== null) {
          const answerScore = question.answers[answerIndex].score;
          scores[question.type] += answerScore;
        }
      });

      // Convert to percentages
      Object.keys(scores).forEach(type => {
        const typeMaxScore = careerQuestions.filter(q => q.type === type).length * 3;
        scores[type] = Math.round((scores[type] / typeMaxScore) * 100);
      });
    }

    function displayResults() {
      // Find top personality type
      const topTypes = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
      const primaryType = topTypes[0];
      const secondaryType = topTypes[1];
      const tertiaryType = topTypes[2];

      // Create personality code
      const personalityCode = topTypes.slice(0, 3).map(type => type.charAt(0).toUpperCase()).join('');
      document.getElementById('personality-type').textContent = personalityCode;
      
      const typeInfo = personalityTypes[primaryType];
      document.getElementById('type-description').textContent = 
        `${typeInfo.emoji} ${typeInfo.name} - ${typeInfo.description}`;

      // Display interests breakdown
      const interestsContainer = document.getElementById('interests-breakdown');
      interestsContainer.innerHTML = Object.keys(scores).map(type => {
        const typeInfo = personalityTypes[type];
        return `
          <div class="interest-bar">
            <div class="interest-label">${typeInfo.emoji} ${typeInfo.name.split(' ')[0]}</div>
            <div class="interest-score-bar">
              <div class="interest-fill ${type}" style="width: ${scores[type]}%"></div>
            </div>
            <div class="interest-percentage">${scores[type]}%</div>
          </div>
        `;
      }).join('');

      // Display career recommendations
      const careerContainer = document.getElementById('career-recommendations');
      const topThreeTypes = [primaryType, secondaryType, tertiaryType];
      
      careerContainer.innerHTML = topThreeTypes.map((type, index) => {
        const career = careerRecommendations[type];
        const matchLevel = index === 0 ? "Best Match" : 
                          index === 1 ? "Good Match" : "Fair Match";
        
        return `
          <div class="career-card">
            <div class="career-title">${personalityTypes[type].emoji} ${career.title}</div>
            <div class="career-match">${matchLevel} (${scores[type]}%)</div>
            <div class="career-description">${career.description}</div>
            <div class="career-examples">
              <strong>Example Professions:</strong> ${career.examples}
            </div>
          </div>
        `;
      }).join('');

      // Display skills development
      generateSkillsRecommendations(topThreeTypes);
    }

    function generateSkillsRecommendations(topTypes) {
      const skillsContainer = document.getElementById('skills-development');
      
      const recommendations = [
        {
          title: "🎯 Key Skills to Develop",
          content: topTypes.map(type => {
            const career = careerRecommendations[type];
            return `<div class="skill-item">
              <div class="skill-title">${personalityTypes[type].emoji} ${career.title}</div>
              <div class="skill-description">${career.skills.join(', ')}</div>
            </div>`;
          }).join('')
        },
        {
          title: "📚 Career Development Plan",
          content: `
            <div class="skill-item">
              <div class="skill-title">Short-term Goals (3-6 months)</div>
              <div class="skill-description">Take online courses in your field, create or update your resume, build professional network on LinkedIn</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Medium-term Goals (6-12 months)</div>
              <div class="skill-description">Gain practical experience through internships or projects, develop soft skills, find a mentor in your chosen field</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Long-term Goals (1-3 years)</div>
              <div class="skill-description">Get specialization or certification, build portfolio of achievements, consider career advancement opportunities</div>
            </div>
          `
        },
        {
          title: "🔗 Useful Resources",
          content: `
            <div class="skill-item">
              <div class="skill-title">Learning Platforms</div>
              <div class="skill-description">Coursera, edX, Udemy, LinkedIn Learning - for acquiring new skills and certifications</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Professional Networks</div>
              <div class="skill-description">LinkedIn, GitHub (for IT), Behance (for creative professions) - for networking and finding opportunities</div>
            </div>
            <div class="skill-item">
              <div class="skill-title">Job Sites</div>
              <div class="skill-description">Indeed, Glassdoor, AngelList (for startups), FlexJobs - for job searching and market analysis</div>
            </div>
          `
        }
      ];

      skillsContainer.innerHTML = recommendations.map(rec => `
        <div class="skills-section">
          <h6>${rec.title}</h6>
          ${rec.content}
        </div>
      `).join('');
    }

    function showResults() {
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'block';
      detailedReport.style.display = 'none';
    }

    function showDetailedReport() {
      const reportContainer = document.getElementById('report-container');
      
      // Generate detailed report
      const topTypes = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
      
      reportContainer.innerHTML = `
        <div class="skills-section">
          <h6>📊 Detailed Personality Analysis</h6>
          ${topTypes.map(type => `
            <div class="skill-item">
              <div class="skill-title">${personalityTypes[type].emoji} ${personalityTypes[type].name} - ${scores[type]}%</div>
              <div class="skill-description">${careerRecommendations[type].description}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="skills-section">
          <h6>💼 Recommended Career Fields</h6>
          ${topTypes.slice(0, 3).map(type => `
            <div class="skill-item">
              <div class="skill-title">${careerRecommendations[type].title}</div>
              <div class="skill-description">
                <strong>Professions:</strong> ${careerRecommendations[type].examples}<br>
                <strong>Required Skills:</strong> ${careerRecommendations[type].skills.join(', ')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="skills-section">
          <h6>🚀 Personal Recommendations</h6>
          <div class="skill-item">
            <div class="skill-title">Your Strengths</div>
            <div class="skill-description">
              Based on your responses, your main strengths lie in ${personalityTypes[topTypes[0]].name.toLowerCase()} and ${personalityTypes[topTypes[1]].name.toLowerCase()} areas.
              This means you'll be most successful in professions that combine these qualities.
            </div>
          </div>
          <div class="skill-item">
            <div class="skill-title">Areas for Development</div>
            <div class="skill-description">
              Consider developing skills in the ${personalityTypes[topTypes[2]].name.toLowerCase()} area, 
              this will expand your professional opportunities and make you a more versatile specialist.
            </div>
          </div>
        </div>
      `;

      quizResults.style.display = 'none';
      detailedReport.style.display = 'block';
    }

    function resetQuiz() {
      currentQuestionIndex = 0;
      userAnswers = [];
      scores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
      };
      
      quizIntro.style.display = 'block';
      quizQuestions.style.display = 'none';
      quizResults.style.display = 'none';
      detailedReport.style.display = 'none';
    }

  })();
});