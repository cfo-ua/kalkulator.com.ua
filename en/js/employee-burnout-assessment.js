document.addEventListener("DOMContentLoaded", function () {
  // Assessment dimensions with questions
  const assessmentDimensions = [
    {
      id: "workload",
      name: "🏢 Workload & Demands",
      description: "Job pressure, deadlines, and work volume management",
      questions: [
        {
          question: "How often do you feel overwhelmed by your workload?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How frequently do you work beyond your scheduled hours?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often do you feel you have unrealistic deadlines?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How manageable is your current workload?",
          options: ["Very manageable", "Manageable", "Neutral", "Difficult", "Unmanageable"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often do you feel pressured to complete tasks quickly?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Constantly"],
          weights: [0, 1, 2, 3, 4]
        }
      ]
    },
    {
      id: "balance",
      name: "⚖️ Work-Life Balance",
      description: "Time management and personal life boundaries",
      questions: [
        {
          question: "How well do you maintain boundaries between work and personal life?",
          options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often does work interfere with your personal relationships?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How much time do you have for hobbies and personal interests?",
          options: ["Plenty", "Adequate", "Some", "Very little", "None"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often do you think about work during your personal time?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Constantly"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How satisfied are you with your work-life balance?",
          options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
          weights: [0, 1, 2, 3, 4]
        }
      ]
    },
    {
      id: "control",
      name: "💪 Control & Autonomy",
      description: "Decision-making power and job flexibility",
      questions: [
        {
          question: "How much control do you have over your work tasks and priorities?",
          options: ["Complete control", "Good control", "Some control", "Little control", "No control"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How flexible is your work schedule?",
          options: ["Very flexible", "Flexible", "Somewhat flexible", "Rigid", "Very rigid"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often can you influence decisions that affect your work?",
          options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How much input do you have in setting your work goals?",
          options: ["Complete input", "Good input", "Some input", "Little input", "No input"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How empowered do you feel to make work-related decisions?",
          options: ["Very empowered", "Empowered", "Neutral", "Disempowered", "Very disempowered"],
          weights: [0, 1, 2, 3, 4]
        }
      ]
    },
    {
      id: "support",
      name: "🤝 Social Support",
      description: "Relationships with colleagues and management",
      questions: [
        {
          question: "How supportive is your immediate supervisor/manager?",
          options: ["Very supportive", "Supportive", "Neutral", "Unsupportive", "Very unsupportive"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How would you rate your relationships with coworkers?",
          options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often do you receive recognition for your work?",
          options: ["Regularly", "Often", "Sometimes", "Rarely", "Never"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How comfortable do you feel asking for help when needed?",
          options: ["Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How connected do you feel to your team or colleagues?",
          options: ["Very connected", "Connected", "Somewhat connected", "Disconnected", "Very disconnected"],
          weights: [0, 1, 2, 3, 4]
        }
      ]
    },
    {
      id: "satisfaction",
      name: "🎯 Job Satisfaction",
      description: "Meaning, purpose, and career fulfillment",
      questions: [
        {
          question: "How meaningful does your work feel to you?",
          options: ["Very meaningful", "Meaningful", "Somewhat meaningful", "Not meaningful", "Meaningless"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How satisfied are you with your current job overall?",
          options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How aligned is your current role with your career goals?",
          options: ["Perfectly aligned", "Well aligned", "Somewhat aligned", "Poorly aligned", "Not aligned"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often do you feel excited about going to work?",
          options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How likely are you to recommend your workplace to others?",
          options: ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"],
          weights: [0, 1, 2, 3, 4]
        }
      ]
    },
    {
      id: "physical",
      name: "😴 Physical Symptoms",
      description: "Sleep, energy levels, and health indicators",
      questions: [
        {
          question: "How often do you experience work-related physical symptoms (headaches, fatigue, etc.)?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How would you rate your sleep quality?",
          options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often do you feel energized and refreshed in the morning?",
          options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often does work stress affect your eating habits?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
          weights: [0, 1, 2, 3, 4]
        },
        {
          question: "How often do you feel physically exhausted after work?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
          weights: [0, 1, 2, 3, 4]
        }
      ]
    }
  ];

  // Elements
  const assessmentIntro = document.getElementById("assessment-intro");
  const assessmentQuestions = document.getElementById("assessment-questions");
  const assessmentResults = document.getElementById("assessment-results");
  const startAssessmentBtn = document.getElementById("start-assessment");
  const questionContainer = document.getElementById("question-container");
  const questionCounter = document.getElementById("question-counter");
  const progressFill = document.getElementById("progress-fill");
  const prevBtn = document.getElementById("prev-question");
  const nextBtn = document.getElementById("next-question");
  const submitBtn = document.getElementById("submit-assessment");
  const retakeBtn = document.getElementById("retake-assessment");
  const shareBtn = document.getElementById("share-results");

  // Assessment state
  let currentQuestion = 0;
  let userAnswers = [];
  let totalQuestions = 0;

  // Initialize assessment
  function initAssessment() {
    totalQuestions = assessmentDimensions.reduce((sum, dimension) => sum + dimension.questions.length, 0);
    userAnswers = new Array(totalQuestions).fill(-1);
    currentQuestion = 0;
    showSection(assessmentIntro);
  }

  // Show specific section
  function showSection(section) {
    [assessmentIntro, assessmentQuestions, assessmentResults].forEach(s => {
      s.style.display = 'none';
    });
    section.style.display = 'block';
  }

  // Start assessment
  function startAssessment() {
    showSection(assessmentQuestions);
    displayQuestion();
  }

  // Get current dimension and question info
  function getCurrentQuestionInfo() {
    let questionIndex = 0;
    
    for (let dimensionIndex = 0; dimensionIndex < assessmentDimensions.length; dimensionIndex++) {
      const dimension = assessmentDimensions[dimensionIndex];
      const dimensionEndIndex = questionIndex + dimension.questions.length;
      
      if (currentQuestion < dimensionEndIndex) {
        const questionInDimension = currentQuestion - questionIndex;
        return {
          dimension: dimension,
          dimensionIndex: dimensionIndex,
          questionInDimension: questionInDimension,
          question: dimension.questions[questionInDimension]
        };
      }
      
      questionIndex = dimensionEndIndex;
    }
    
    return null;
  }

  // Display current question
  function displayQuestion() {
    const questionInfo = getCurrentQuestionInfo();
    if (!questionInfo) return;

    const questionNumber = currentQuestion + 1;

    // Update progress
    questionCounter.textContent = `Question ${questionNumber} of ${totalQuestions}`;
    progressFill.style.width = `${(questionNumber / totalQuestions) * 100}%`;

    // Create question HTML
    const isFirstInDimension = questionInfo.questionInDimension === 0;
    const dimensionHeader = isFirstInDimension ? `
      <div class="dimension-header">
        <div class="dimension-title">${questionInfo.dimension.name}</div>
        <div class="dimension-description">${questionInfo.dimension.description}</div>
      </div>
    ` : '';

    questionContainer.innerHTML = `
      ${dimensionHeader}
      <div class="question-title">${questionInfo.question.question}</div>
      <div class="answer-options">
        ${questionInfo.question.options.map((option, index) => `
          <div class="answer-option">
            <label>
              <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
              <span class="answer-text">${option}</span>
            </label>
          </div>
        `).join('')}
      </div>
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
    
    if (currentQuestion === totalQuestions - 1) {
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
    if (currentQuestion < totalQuestions - 1 && userAnswers[currentQuestion] !== -1) {
      currentQuestion++;
      displayQuestion();
    }
  }

  // Submit assessment and show results
  function submitAssessment() {
    if (userAnswers[currentQuestion] === -1) return;

    const results = calculateResults();
    displayResults(results);
    showSection(assessmentResults);
  }

  // Calculate results by dimension
  function calculateResults() {
    const dimensionResults = [];
    let questionIndex = 0;
    
    assessmentDimensions.forEach(dimension => {
      let dimensionScore = 0;
      let maxPossibleScore = 0;
      
      for (let i = 0; i < dimension.questions.length; i++) {
        const answerIndex = userAnswers[questionIndex + i];
        const question = dimension.questions[i];
        
        dimensionScore += question.weights[answerIndex];
        maxPossibleScore += Math.max(...question.weights);
      }
      
      const percentage = Math.round((dimensionScore / maxPossibleScore) * 100);
      
      let status;
      if (percentage <= 25) status = "excellent";
      else if (percentage <= 50) status = "good";
      else if (percentage <= 75) status = "concerning";
      else status = "problematic";
      
      dimensionResults.push({
        dimension: dimension,
        score: dimensionScore,
        maxScore: maxPossibleScore,
        percentage: percentage,
        status: status
      });
      
      questionIndex += dimension.questions.length;
    });
    
    // Calculate overall risk
    const totalScore = dimensionResults.reduce((sum, d) => sum + d.score, 0);
    const maxTotalScore = dimensionResults.reduce((sum, d) => sum + d.maxScore, 0);
    const overallPercentage = Math.round((totalScore / maxTotalScore) * 100);
    
    let riskLevel;
    if (overallPercentage <= 25) riskLevel = "low";
    else if (overallPercentage <= 50) riskLevel = "moderate";
    else if (overallPercentage <= 75) riskLevel = "high";
    else riskLevel = "severe";
    
    return {
      overall: {
        score: totalScore,
        maxScore: maxTotalScore,
        percentage: overallPercentage,
        riskLevel: riskLevel
      },
      dimensions: dimensionResults
    };
  }

  // Display results
  function displayResults(results) {
    // Overall risk
    document.getElementById("risk-percentage").textContent = `${results.overall.percentage}%`;
    document.getElementById("completed-questions").textContent = totalQuestions;
    
    // Risk level
    const riskLevelElement = document.getElementById("risk-level");
    const riskLevelCard = document.getElementById("risk-level-card");
    const riskLabels = {
      low: "🟢 Low Risk - Excellent Wellbeing",
      moderate: "🟡 Moderate Risk - Some Concerns",
      high: "🟠 High Risk - Action Needed",
      severe: "🔴 Severe Risk - Immediate Attention Required"
    };
    
    riskLevelElement.textContent = riskLabels[results.overall.riskLevel];
    riskLevelElement.className = `risk-level ${results.overall.riskLevel}`;
    riskLevelCard.className = `insight-card ${results.overall.riskLevel}`;
    
    // Risk factors count
    const problemAreas = results.dimensions.filter(d => d.status === "concerning" || d.status === "problematic").length;
    document.getElementById("risk-factors").textContent = problemAreas;
    
    // Dimension scores
    const dimensionScoresContainer = document.getElementById("dimension-scores");
    dimensionScoresContainer.innerHTML = results.dimensions.map(dimension => {
      const statusLabels = {
        excellent: "🟢 Excellent",
        good: "🔵 Good",
        concerning: "🟡 Concerning",
        problematic: "🔴 Problematic"
      };
      
      return `
        <div class="dimension-score-card">
          <div class="dimension-score-header">
            <span class="dimension-name">${dimension.dimension.name}</span>
            <span class="dimension-score">${dimension.percentage}%</span>
          </div>
          <div class="dimension-bar">
            <div class="dimension-bar-fill" style="width: ${dimension.percentage}%"></div>
          </div>
          <div class="dimension-status ${dimension.status}">${statusLabels[dimension.status]}</div>
        </div>
      `;
    }).join('');
    
    // Recommendations
    generateRecommendations(results);
  }

  // Generate recommendations based on results
  function generateRecommendations(results) {
    const recommendationsContainer = document.getElementById("recommendations");
    
    // Find problem areas
    const problematicDimensions = results.dimensions.filter(d => d.status === "problematic");
    const concerningDimensions = results.dimensions.filter(d => d.status === "concerning");
    
    let recommendationsHTML = '';
    
    if (problematicDimensions.length > 0) {
      recommendationsHTML += `
        <div class="recommendation-section">
          <h6>🚨 Immediate Action Required</h6>
          ${problematicDimensions.map(dimension => {
            const recommendations = getDimensionRecommendations(dimension.dimension.id, 'immediate');
            return recommendations.map(rec => `
              <div class="recommendation-item immediate">
                <strong>${dimension.dimension.name}:</strong> ${rec}
              </div>
            `).join('');
          }).join('')}
        </div>
      `;
    }
    
    if (concerningDimensions.length > 0) {
      recommendationsHTML += `
        <div class="recommendation-section">
          <h6>⚠️ Important Improvements</h6>
          ${concerningDimensions.map(dimension => {
            const recommendations = getDimensionRecommendations(dimension.dimension.id, 'important');
            return recommendations.map(rec => `
              <div class="recommendation-item important">
                <strong>${dimension.dimension.name}:</strong> ${rec}
              </div>
            `).join('');
          }).join('')}
        </div>
      `;
    }
    
    // General recommendations based on risk level
    let generalRecommendations = '';
    switch (results.overall.riskLevel) {
      case 'severe':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>🆘 Critical Burnout Prevention</h6>
            <div class="recommendation-item immediate">Consider taking time off if possible</div>
            <div class="recommendation-item immediate">Speak with a mental health professional</div>
            <div class="recommendation-item immediate">Discuss workload concerns with your manager immediately</div>
            <div class="recommendation-item immediate">Implement stress reduction techniques daily</div>
          </div>
        `;
        break;
      case 'high':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>⚡ Proactive Burnout Prevention</h6>
            <div class="recommendation-item important">Review and adjust your work-life boundaries</div>
            <div class="recommendation-item important">Seek support from colleagues, friends, or family</div>
            <div class="recommendation-item important">Consider stress management training or counseling</div>
            <div class="recommendation-item important">Evaluate your career goals and current role alignment</div>
          </div>
        `;
        break;
      case 'moderate':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>🎯 Wellness Optimization</h6>
            <div class="recommendation-item beneficial">Continue monitoring your stress levels regularly</div>
            <div class="recommendation-item beneficial">Maintain healthy work-life balance practices</div>
            <div class="recommendation-item beneficial">Build stronger support networks at work</div>
            <div class="recommendation-item beneficial">Focus on physical health and sleep quality</div>
          </div>
        `;
        break;
      case 'low':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>🌟 Maintain Your Excellent Wellbeing</h6>
            <div class="recommendation-item beneficial">Continue your current wellness practices</div>
            <div class="recommendation-item beneficial">Share your strategies with colleagues who might benefit</div>
            <div class="recommendation-item beneficial">Stay aware of changes that might impact your wellbeing</div>
            <div class="recommendation-item beneficial">Consider becoming a workplace wellness advocate</div>
          </div>
        `;
        break;
    }
    
    recommendationsHTML += generalRecommendations;
    recommendationsContainer.innerHTML = recommendationsHTML;
  }

  // Get specific recommendations for each dimension
  function getDimensionRecommendations(dimensionId, priority) {
    const recommendations = {
      workload: {
        immediate: ["Discuss workload reduction with your manager", "Learn to say no to non-essential tasks", "Delegate responsibilities where possible"],
        important: ["Improve time management skills", "Set realistic deadlines", "Break large projects into smaller tasks"]
      },
      balance: {
        immediate: ["Set strict work hour boundaries", "Turn off work notifications after hours", "Schedule dedicated personal time"],
        important: ["Create transition rituals between work and personal time", "Pursue hobbies and interests outside work", "Limit work-related thoughts during personal time"]
      },
      control: {
        immediate: ["Discuss role autonomy with your supervisor", "Identify areas where you can take more initiative", "Advocate for flexible work arrangements"],
        important: ["Develop decision-making skills", "Seek opportunities for professional growth", "Communicate your needs and preferences clearly"]
      },
      support: {
        immediate: ["Reach out to colleagues or mentors for support", "Schedule regular check-ins with your manager", "Join professional networks or support groups"],
        important: ["Build stronger workplace relationships", "Seek feedback and recognition actively", "Contribute to team building activities"]
      },
      satisfaction: {
        immediate: ["Reflect on your career goals and values", "Identify meaningful aspects of your current role", "Consider career counseling or coaching"],
        important: ["Seek new challenges or learning opportunities", "Discuss career development with your manager", "Explore ways to add meaning to your current work"]
      },
      physical: {
        immediate: ["Prioritize getting 7-9 hours of sleep nightly", "Take regular breaks during work", "Consider consulting a healthcare provider"],
        important: ["Establish a regular exercise routine", "Practice stress reduction techniques", "Maintain healthy eating habits"]
      }
    };
    
    return recommendations[dimensionId]?.[priority] || [];
  }

  // Save results to local storage
  function saveResults() {
    const results = {
      timestamp: new Date().toLocaleString(),
      risk: document.getElementById("risk-percentage").textContent,
      level: document.getElementById("risk-level").textContent
    };
    
    localStorage.setItem("burnout-assessment-results", JSON.stringify(results));
    alert("Results saved to your browser's local storage!");
  }

  // Retake assessment
  function retakeAssessment() {
    initAssessment();
  }

  // Event listeners
  startAssessmentBtn.addEventListener("click", startAssessment);
  prevBtn.addEventListener("click", previousQuestion);
  nextBtn.addEventListener("click", nextQuestion);
  submitBtn.addEventListener("click", submitAssessment);
  retakeBtn.addEventListener("click", retakeAssessment);
  shareBtn.addEventListener("click", saveResults);

  // Initialize
  initAssessment();
});