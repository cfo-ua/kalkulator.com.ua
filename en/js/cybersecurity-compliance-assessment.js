document.addEventListener("DOMContentLoaded", function () {
  // Assessment data organized by domains
  const assessmentDomains = [
    {
      id: "governance",
      name: "📋 Governance & Policies",
      description: "Security governance, policies, and organizational oversight",
      questions: [
        "Does your organization have a written cybersecurity policy?",
        "Is there a designated person or team responsible for cybersecurity?",
        "Are security policies reviewed and updated annually?",
        "Do you have documented procedures for security incidents?",
        "Is cybersecurity included in your business continuity planning?"
      ]
    },
    {
      id: "access",
      name: "🏢 Access Management",
      description: "User access controls, authentication, and identity management",
      questions: [
        "Do you use multi-factor authentication for administrative accounts?",
        "Are user access permissions reviewed regularly?",
        "Do you have a process for promptly removing access for departing employees?",
        "Are shared accounts avoided or properly managed?",
        "Do you enforce strong password requirements?"
      ]
    },
    {
      id: "network",
      name: "🛡️ Network Security",
      description: "Network protection, monitoring, and segmentation",
      questions: [
        "Is your network protected by a properly configured firewall?",
        "Do you monitor network traffic for suspicious activity?",
        "Are wireless networks secured with WPA3 or equivalent encryption?",
        "Is network segmentation used to limit access to sensitive systems?",
        "Are software and security patches applied promptly?"
      ]
    },
    {
      id: "data",
      name: "💾 Data Protection",
      description: "Data encryption, backup, and classification practices",
      questions: [
        "Is sensitive data encrypted both at rest and in transit?",
        "Do you have a regular, tested backup and recovery process?",
        "Is data classified based on sensitivity levels?",
        "Are there controls for data sharing and transfer?",
        "Do you have data retention and disposal policies?"
      ]
    },
    {
      id: "training",
      name: "👥 Employee Training",
      description: "Security awareness and training programs",
      questions: [
        "Do employees receive regular cybersecurity awareness training?",
        "Are employees trained to recognize phishing attempts?",
        "Is security training provided to new employees during onboarding?",
        "Do you conduct simulated phishing exercises?",
        "Are security responsibilities clearly defined in job descriptions?"
      ]
    },
    {
      id: "incident",
      name: "🚨 Incident Response",
      description: "Incident detection, response, and recovery capabilities",
      questions: [
        "Do you have a documented incident response plan?",
        "Is there a process for reporting and escalating security incidents?",
        "Are incident response procedures tested regularly?",
        "Do you have relationships with external incident response resources?",
        "Are lessons learned from incidents documented and implemented?"
      ]
    },
    {
      id: "endpoint",
      name: "📱 Endpoint Security",
      description: "Device management and endpoint protection",
      questions: [
        "Are all endpoints protected with up-to-date antivirus/anti-malware?",
        "Do you have mobile device management (MDM) for company devices?",
        "Are personal devices accessing company data properly secured?",
        "Is automatic screen locking enabled on all devices?",
        "Are USB ports and removable media access controlled?"
      ]
    },
    {
      id: "monitoring",
      name: "🔍 Monitoring & Compliance",
      description: "Security monitoring, logging, and compliance tracking",
      questions: [
        "Do you maintain security logs and monitor them regularly?",
        "Are security controls audited periodically?",
        "Do you track compliance with relevant regulations?",
        "Is there a process for vulnerability scanning and management?",
        "Are security metrics reported to management regularly?"
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
  const printBtn = document.getElementById("print-results");

  // Assessment state
  let currentQuestion = 0;
  let userAnswers = [];
  let totalQuestions = 0;

  // Initialize assessment
  function initAssessment() {
    // Calculate total questions
    totalQuestions = assessmentDomains.reduce((sum, domain) => sum + domain.questions.length, 0);
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

  // Get current domain and question info
  function getCurrentQuestionInfo() {
    let questionIndex = 0;
    
    for (let domainIndex = 0; domainIndex < assessmentDomains.length; domainIndex++) {
      const domain = assessmentDomains[domainIndex];
      const domainEndIndex = questionIndex + domain.questions.length;
      
      if (currentQuestion < domainEndIndex) {
        const questionInDomain = currentQuestion - questionIndex;
        return {
          domain: domain,
          domainIndex: domainIndex,
          questionInDomain: questionInDomain,
          questionText: domain.questions[questionInDomain]
        };
      }
      
      questionIndex = domainEndIndex;
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
    const isFirstInDomain = questionInfo.questionInDomain === 0;
    const domainHeader = isFirstInDomain ? `
      <div class="domain-header">
        <div class="domain-title">${questionInfo.domain.name}</div>
        <div class="domain-description">${questionInfo.domain.description}</div>
      </div>
    ` : '';

    questionContainer.innerHTML = `
      ${domainHeader}
      <div class="question-title">${questionInfo.questionText}</div>
      <div class="answer-options">
        <div class="answer-option yes">
          <label>
            <input type="radio" name="answer" value="1" ${userAnswers[currentQuestion] === 1 ? 'checked' : ''}>
            <span class="answer-text">✅ Yes</span>
          </label>
        </div>
        <div class="answer-option no">
          <label>
            <input type="radio" name="answer" value="0" ${userAnswers[currentQuestion] === 0 ? 'checked' : ''}>
            <span class="answer-text">❌ No</span>
          </label>
        </div>
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

  // Calculate results by domain
  function calculateResults() {
    const domainResults = [];
    let questionIndex = 0;
    
    assessmentDomains.forEach(domain => {
      const domainAnswers = userAnswers.slice(questionIndex, questionIndex + domain.questions.length);
      const score = domainAnswers.reduce((sum, answer) => sum + (answer === 1 ? 1 : 0), 0);
      const percentage = Math.round((score / domain.questions.length) * 100);
      
      let status;
      if (percentage >= 90) status = "excellent";
      else if (percentage >= 70) status = "good";
      else if (percentage >= 50) status = "needs-improvement";
      else status = "critical";
      
      domainResults.push({
        domain: domain,
        score: score,
        total: domain.questions.length,
        percentage: percentage,
        status: status
      });
      
      questionIndex += domain.questions.length;
    });
    
    // Calculate overall score
    const totalScore = userAnswers.reduce((sum, answer) => sum + (answer === 1 ? 1 : 0), 0);
    const overallPercentage = Math.round((totalScore / totalQuestions) * 100);
    
    let maturityLevel;
    if (overallPercentage >= 85) maturityLevel = "optimized";
    else if (overallPercentage >= 70) maturityLevel = "managed";
    else if (overallPercentage >= 50) maturityLevel = "developing";
    else maturityLevel = "basic";
    
    return {
      overall: {
        score: totalScore,
        total: totalQuestions,
        percentage: overallPercentage,
        maturityLevel: maturityLevel
      },
      domains: domainResults
    };
  }

  // Display results
  function displayResults(results) {
    // Overall score
    document.getElementById("overall-score").textContent = `${results.overall.percentage}%`;
    document.getElementById("completed-questions").textContent = results.overall.total;
    
    // Maturity level
    const maturityElement = document.getElementById("maturity-level");
    const maturityLabels = {
      basic: "🔴 Basic - Needs Immediate Attention",
      developing: "🟡 Developing - Building Foundation",
      managed: "🔵 Managed - Good Progress",
      optimized: "🟢 Optimized - Excellent Posture"
    };
    
    maturityElement.textContent = maturityLabels[results.overall.maturityLevel];
    maturityElement.className = `maturity-level ${results.overall.maturityLevel}`;
    
    // Priority count
    const criticalDomains = results.domains.filter(d => d.status === "critical" || d.status === "needs-improvement").length;
    document.getElementById("priority-count").textContent = criticalDomains;
    
    // Domain scores
    const domainScoresContainer = document.getElementById("domain-scores");
    domainScoresContainer.innerHTML = results.domains.map(domain => {
      const statusLabels = {
        excellent: "🟢 Excellent",
        good: "🔵 Good",
        "needs-improvement": "🟡 Needs Improvement",
        critical: "🔴 Critical"
      };
      
      return `
        <div class="domain-score-card">
          <div class="domain-score-header">
            <span class="domain-name">${domain.domain.name}</span>
            <span class="domain-percentage">${domain.percentage}%</span>
          </div>
          <div class="domain-bar">
            <div class="domain-bar-fill" style="width: ${domain.percentage}%"></div>
          </div>
          <div class="domain-status ${domain.status}">${statusLabels[domain.status]}</div>
        </div>
      `;
    }).join('');
    
    // Recommendations
    generateRecommendations(results);
  }

  // Generate recommendations based on results
  function generateRecommendations(results) {
    const recommendationsContainer = document.getElementById("recommendations");
    
    // Find priority areas
    const criticalDomains = results.domains.filter(d => d.status === "critical");
    const improvementDomains = results.domains.filter(d => d.status === "needs-improvement");
    
    let recommendationsHTML = '';
    
    if (criticalDomains.length > 0) {
      recommendationsHTML += `
        <div class="recommendation-section">
          <h6>🚨 Critical Priority - Immediate Action Required</h6>
          ${criticalDomains.map(domain => `
            <div class="priority-item high">
              <strong>${domain.domain.name}:</strong> 
              Score: ${domain.percentage}% - Focus on implementing basic ${domain.domain.description.toLowerCase()} controls immediately.
            </div>
          `).join('')}
        </div>
      `;
    }
    
    if (improvementDomains.length > 0) {
      recommendationsHTML += `
        <div class="recommendation-section">
          <h6>⚠️ Medium Priority - Plan for Improvement</h6>
          ${improvementDomains.map(domain => `
            <div class="priority-item medium">
              <strong>${domain.domain.name}:</strong> 
              Score: ${domain.percentage}% - Enhance existing ${domain.domain.description.toLowerCase()} practices.
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // General recommendations based on maturity level
    let generalRecommendations = '';
    switch (results.overall.maturityLevel) {
      case 'basic':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>📚 Foundation Building Recommendations</h6>
            <div class="priority-item high">Start with basic security policies and employee training</div>
            <div class="priority-item high">Implement multi-factor authentication for all admin accounts</div>
            <div class="priority-item high">Establish regular backup and recovery procedures</div>
            <div class="priority-item medium">Consider engaging a cybersecurity consultant</div>
          </div>
        `;
        break;
      case 'developing':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>🏗️ Security Program Development</h6>
            <div class="priority-item medium">Formalize security policies and procedures</div>
            <div class="priority-item medium">Implement security monitoring and logging</div>
            <div class="priority-item medium">Conduct regular security awareness training</div>
            <div class="priority-item low">Consider security framework adoption (NIST, ISO 27001)</div>
          </div>
        `;
        break;
      case 'managed':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>🎯 Security Program Optimization</h6>
            <div class="priority-item low">Regular security assessments and penetration testing</div>
            <div class="priority-item low">Advanced threat detection and response capabilities</div>
            <div class="priority-item low">Security awareness maturity programs</div>
            <div class="priority-item low">Consider security certifications and compliance frameworks</div>
          </div>
        `;
        break;
      case 'optimized':
        generalRecommendations = `
          <div class="recommendation-section">
            <h6>🌟 Maintain Excellence</h6>
            <div class="priority-item low">Continuous improvement and threat landscape monitoring</div>
            <div class="priority-item low">Share best practices with industry peers</div>
            <div class="priority-item low">Stay ahead of emerging threats and technologies</div>
            <div class="priority-item low">Consider advanced security research and innovation</div>
          </div>
        `;
        break;
    }
    
    recommendationsHTML += generalRecommendations;
    recommendationsContainer.innerHTML = recommendationsHTML;
  }

  // Print results
  function printResults() {
    window.print();
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
  printBtn.addEventListener("click", printResults);

  // Initialize
  initAssessment();
});