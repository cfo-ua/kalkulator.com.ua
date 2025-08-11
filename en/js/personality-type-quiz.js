document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    
    // Quiz questions with scoring dimensions (English version)
    const questions = [
      {
        text: "At a party you usually:",
        options: [
          { text: "Talk to many people", scores: { E: 2, O: 1 } },
          { text: "Chat with a few close friends", scores: { I: 2, A: 1 } },
          { text: "Try to meet new people", scores: { E: 2, O: 2 } },
          { text: "Find a quiet corner for peaceful conversation", scores: { I: 2, C: 1 } }
        ]
      },
      {
        text: "When making important decisions you rely on:",
        options: [
          { text: "Logic and facts", scores: { T: 2, C: 1 } },
          { text: "Intuition and gut feeling", scores: { F: 1, N: 2 } },
          { text: "Experience and proven methods", scores: { S: 2, C: 1 } },
          { text: "Emotions and values", scores: { F: 2, A: 1 } }
        ]
      },
      {
        text: "Your ideal weekend:",
        options: [
          { text: "Active day with friends", scores: { E: 2, O: 1 } },
          { text: "Quiet day at home with a book", scores: { I: 2, O: -1 } },
          { text: "Adventure in a new place", scores: { E: 1, O: 2 } },
          { text: "Organized plan with close ones", scores: { C: 2, A: 1 } }
        ]
      },
      {
        text: "When working in a team:",
        options: [
          { text: "Take on leadership", scores: { E: 2, C: 1 } },
          { text: "Support group harmony", scores: { A: 2, F: 1 } },
          { text: "Generate creative ideas", scores: { O: 2, N: 1 } },
          { text: "Focus on details", scores: { C: 2, S: 1 } }
        ]
      },
      {
        text: "Your attitude toward change:",
        options: [
          { text: "Embrace it with enthusiasm", scores: { O: 2, P: 1 } },
          { text: "Need time to adapt", scores: { C: 1, J: 1, N: -1 } },
          { text: "Analyze all possible consequences", scores: { T: 2, C: 1 } },
          { text: "Trust my instincts", scores: { F: 1, P: 2 } }
        ]
      },
      {
        text: "In a stressful situation you:",
        options: [
          { text: "Stay calm and think logically", scores: { T: 2, C: 1, N: -2 } },
          { text: "Seek support from friends", scores: { E: 1, A: 2 } },
          { text: "Analyze the problem independently", scores: { I: 2, T: 1 } },
          { text: "Feel strong emotions", scores: { F: 1, N: 2 } }
        ]
      },
      {
        text: "Your communication style:",
        options: [
          { text: "Direct and straightforward", scores: { E: 1, T: 2 } },
          { text: "Diplomatic and tactful", scores: { A: 2, F: 1 } },
          { text: "Energetic and expressive", scores: { E: 2, O: 1 } },
          { text: "Calm and thoughtful", scores: { I: 2, C: 1 } }
        ]
      },
      {
        text: "When planning a trip you:",
        options: [
          { text: "Create a detailed itinerary", scores: { J: 2, C: 2 } },
          { text: "Have a general idea but leave room for spontaneity", scores: { P: 1, O: 1 } },
          { text: "Completely rely on intuition", scores: { P: 2, N: 1 } },
          { text: "Research all possibilities in advance", scores: { J: 1, C: 1, O: 1 } }
        ]
      },
      {
        text: "Your attitude toward criticism:",
        options: [
          { text: "See it as an opportunity for improvement", scores: { O: 2, C: 1 } },
          { text: "Take it personally", scores: { F: 1, N: 2 } },
          { text: "Analyze it objectively", scores: { T: 2, C: 1 } },
          { text: "Defend your point of view", scores: { A: -1, E: 1 } }
        ]
      },
      {
        text: "Your approach to problem-solving:",
        options: [
          { text: "Step-by-step exploration of all details", scores: { S: 2, C: 2 } },
          { text: "Search for innovative solutions", scores: { N: 2, O: 2 } },
          { text: "Consult with experts", scores: { A: 1, C: 1 } },
          { text: "Trust experience", scores: { S: 1, T: 1 } }
        ]
      },
      {
        text: "In conflict situations you:",
        options: [
          { text: "Try to find a compromise", scores: { A: 2, F: 1 } },
          { text: "Stand your ground", scores: { E: 1, T: 1, A: -1 } },
          { text: "Avoid confrontation", scores: { I: 1, A: 1, N: 1 } },
          { text: "Look for logical solutions", scores: { T: 2, C: 1 } }
        ]
      },
      {
        text: "Your work environment:",
        options: [
          { text: "Organized and structured", scores: { J: 2, C: 2 } },
          { text: "Flexible and dynamic", scores: { P: 2, O: 1 } },
          { text: "Creative and inspiring", scores: { O: 2, N: 1 } },
          { text: "Quiet and focused", scores: { I: 1, C: 1 } }
        ]
      },
      {
        text: "When learning something new you:",
        options: [
          { text: "Read theory first, then practice", scores: { S: 1, C: 2 } },
          { text: "Jump right into practice", scores: { P: 2, E: 1 } },
          { text: "Experiment and explore", scores: { O: 2, N: 1 } },
          { text: "Look for connections to what you already know", scores: { N: 1, C: 1 } }
        ]
      },
      {
        text: "Your attitude toward deadlines:",
        options: [
          { text: "Always submit work early", scores: { J: 2, C: 2 } },
          { text: "Work better under pressure", scores: { P: 2, N: 1 } },
          { text: "Stick to the schedule", scores: { J: 1, C: 1 } },
          { text: "Sometimes forget about them", scores: { P: 1, C: -2 } }
        ]
      },
      {
        text: "In relationships you value:",
        options: [
          { text: "Emotional closeness", scores: { F: 2, A: 1 } },
          { text: "Intellectual compatibility", scores: { T: 2, O: 1 } },
          { text: "Shared interests", scores: { A: 1, O: 1 } },
          { text: "Mutual independence", scores: { I: 1, A: -1 } }
        ]
      },
      {
        text: "Your leadership style:",
        options: [
          { text: "Democratic and collaborative", scores: { A: 2, F: 1 } },
          { text: "Decisive and directive", scores: { E: 2, T: 1 } },
          { text: "Inspiring and visionary", scores: { O: 2, N: 2 } },
          { text: "Organized and methodical", scores: { J: 2, C: 2 } }
        ]
      },
      {
        text: "When choosing a career, it's important:",
        options: [
          { text: "Stability and security", scores: { C: 2, J: 1, N: -1 } },
          { text: "Opportunities for creativity", scores: { O: 2, N: 1 } },
          { text: "Social impact and helping others", scores: { F: 2, A: 2 } },
          { text: "Professional growth", scores: { C: 1, E: 1 } }
        ]
      },
      {
        text: "Your approach to risk:",
        options: [
          { text: "Carefully weigh all pros and cons", scores: { C: 2, T: 1 } },
          { text: "Trust intuition", scores: { N: 2, P: 1 } },
          { text: "Avoid unjustified risks", scores: { C: 1, J: 1, N: -1 } },
          { text: "See it as an adventure", scores: { O: 2, E: 1 } }
        ]
      },
      {
        text: "In group projects you:",
        options: [
          { text: "Coordinate team work", scores: { E: 2, J: 1 } },
          { text: "Generate ideas", scores: { N: 2, O: 2 } },
          { text: "Execute specific tasks", scores: { S: 2, C: 1 } },
          { text: "Support team spirit", scores: { A: 2, F: 1 } }
        ]
      },
      {
        text: "Your attitude toward traditions:",
        options: [
          { text: "Respect and follow them", scores: { S: 2, C: 1, O: -1 } },
          { text: "Think they need rethinking", scores: { O: 2, N: 1 } },
          { text: "Value useful ones, discard outdated", scores: { T: 2, C: 1 } },
          { text: "Create your own traditions", scores: { O: 1, N: 2 } }
        ]
      }
    ];

    // MBTI type descriptions (English version)
    const mbtiTypes = {
      'INTJ': {
        title: 'Architect',
        description: 'Strategic thinkers with a plan for everything. INTJs combine creativity with rationality to bring their ideas to life.',
        strengths: ['Strategic thinking', 'Independence', 'Determination', 'Originality', 'Self-confidence'],
        development: ['Intolerance to inefficiency', 'Excessive criticism', 'Avoiding emotions', 'Perfectionism'],
        careers: ['Scientist', 'Engineer', 'Architect', 'Analyst', 'Strategist', 'Programmer']
      },
      'INTP': {
        title: 'Thinker',
        description: 'Innovative inventors with an unquenchable thirst for knowledge. INTPs seek to understand the principles governing the universe.',
        strengths: ['Analytical thinking', 'Creativity', 'Objectivity', 'Intellectual honesty', 'Openness to ideas'],
        development: ['Procrastination', 'Insensitivity', 'Absent-mindedness', 'Impatience with routine'],
        careers: ['Researcher', 'Philosopher', 'Mathematician', 'Programmer', 'Analyst', 'Inventor']
      },
      'ENTJ': {
        title: 'Commander',
        description: 'Bold, imaginative and strong-willed leaders, always finding or making a way. ENTJs are natural leaders.',
        strengths: ['Natural leadership', 'Self-confidence', 'Strategic thinking', 'Efficiency', 'Energy'],
        development: ['Intolerance', 'Insensitivity', 'Impatience', 'Arrogance'],
        careers: ['CEO', 'Entrepreneur', 'Manager', 'Consultant', 'Lawyer', 'Politician']
      },
      'ENTP': {
        title: 'Debater',
        description: 'Smart and curious thinkers who cannot resist an intellectual challenge. ENTPs love debates and new ideas.',
        strengths: ['Quick thinking', 'Charisma', 'Energy', 'Creativity', 'Communication skills'],
        development: ['Impatience', 'Intolerance to routine', 'Difficulty focusing', 'Insensitivity'],
        careers: ['Inventor', 'Journalist', 'Marketer', 'Consultant', 'Lawyer', 'Writer']
      },
      'INFJ': {
        title: 'Advocate',
        description: 'Quiet and mystical, yet very inspiring and tireless idealists. INFJs strive to help others and change the world.',
        strengths: ['Empathy', 'Intuition', 'Principles', 'Altruism', 'Creativity'],
        development: ['Perfectionism', 'Sensitivity to criticism', 'Excessive self-sacrifice', 'Burnout'],
        careers: ['Psychologist', 'Teacher', 'Writer', 'Artist', 'Counselor', 'Social Worker']
      },
      'INFP': {
        title: 'Mediator',
        description: 'Poetic, kind and altruistic people, always eager to help a good cause. INFPs are guided by their values.',
        strengths: ['Idealism', 'Empathy', 'Creativity', 'Passion', 'Altruism'],
        development: ['Rejection of criticism', 'Impracticality', 'Emotionality', 'Difficulty with details'],
        careers: ['Writer', 'Artist', 'Psychologist', 'Musician', 'Actor', 'Philanthropist']
      },
      'ENFJ': {
        title: 'Protagonist',
        description: 'Charismatic and inspiring leaders, able to mesmerize their listeners. ENFJs help others reach their potential.',
        strengths: ['Charisma', 'Empathy', 'Leadership', 'Communication', 'Altruism'],
        development: ['Excessive idealization', 'Excessive self-sacrifice', 'Intolerance to conflict', 'Manipulativeness'],
        careers: ['Teacher', 'Coach', 'HR Manager', 'Counselor', 'Politician', 'Journalist']
      },
      'ENFP': {
        title: 'Campaigner',
        description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile. ENFPs inspire and are inspired.',
        strengths: ['Enthusiasm', 'Creativity', 'Sociability', 'Energy', 'Empathy'],
        development: ['Impatience', 'Difficulty focusing', 'Excessive optimism', 'Independence'],
        careers: ['Artist', 'Actor', 'Marketer', 'Journalist', 'Psychologist', 'Entrepreneur']
      },
      'ISTJ': {
        title: 'Logistician',
        description: 'Practical and fact-minded, reliable people whose reliability can be depended upon. ISTJs value traditions and order.',
        strengths: ['Reliability', 'Practicality', 'Hard work', 'Organization', 'Responsibility'],
        development: ['Stubbornness', 'Insensitivity', 'Judgment', 'Resistance to change'],
        careers: ['Accountant', 'Auditor', 'Lawyer', 'Doctor', 'Manager', 'Administrator']
      },
      'ISFJ': {
        title: 'Defender',
        description: 'Very dedicated and warm protectors, always ready to defend their loved ones. ISFJs are caring and attentive to others\' needs.',
        strengths: ['Reliability', 'Care', 'Practicality', 'Enthusiasm', 'Loyalty'],
        development: ['Excessive modesty', 'Overloading themselves', 'Indecisiveness', 'Rejection of change'],
        careers: ['Nurse', 'Teacher', 'Social Worker', 'Counselor', 'Administrator', 'Therapist']
      },
      'ESTJ': {
        title: 'Executive',
        description: 'Excellent administrators, unsurpassed at managing things or people. ESTJs are organized and results-oriented.',
        strengths: ['Leadership', 'Efficiency', 'Reliability', 'Energy', 'Strong will'],
        development: ['Impatience', 'Difficulty expressing emotions', 'Stubbornness', 'Judgment'],
        careers: ['Manager', 'Administrator', 'Lawyer', 'Financier', 'Politician', 'Military']
      },
      'ESFJ': {
        title: 'Consul',
        description: 'Extraordinarily caring, social and popular people, always eager to help. ESFJs value harmony and cooperation.',
        strengths: ['Practical skills', 'Loyalty', 'Sensitivity', 'Strong sense of duty', 'Warmth'],
        development: ['Need for approval', 'Sensitivity to criticism', 'Inflexibility', 'Rejection of change'],
        careers: ['Teacher', 'Nurse', 'HR Manager', 'Counselor', 'Social Worker', 'Event Manager']
      },
      'ISTP': {
        title: 'Virtuoso',
        description: 'Bold and practical experimenters, masters of all kinds of tools. ISTPs love experiments and practical tasks.',
        strengths: ['Practicality', 'Creativity', 'Spontaneity', 'Rationality', 'Crisis management'],
        development: ['Stubbornness', 'Insensitivity', 'Privacy', 'Impatience'],
        careers: ['Engineer', 'Mechanic', 'Pilot', 'Programmer', 'Detective', 'Athlete']
      },
      'ISFP': {
        title: 'Adventurer',
        description: 'Flexible and charming artists, always ready to explore new possibilities. ISFPs are guided by their values.',
        strengths: ['Charm', 'Sensitivity to others', 'Imagination', 'Passion', 'Curiosity'],
        development: ['Focus on the present moment', 'Competitiveness', 'Independence', 'Unpredictability'],
        careers: ['Artist', 'Musician', 'Photographer', 'Designer', 'Psychologist', 'Veterinarian']
      },
      'ESTP': {
        title: 'Entrepreneur',
        description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge. ESTPs are spontaneous and practical.',
        strengths: ['Sociability', 'Practicality', 'Resourcefulness', 'Spontaneity', 'Energy'],
        development: ['Impatience', 'Risk aversion', 'Lack of long-term focus', 'Insensitivity'],
        careers: ['Salesperson', 'Entrepreneur', 'Athlete', 'Actor', 'Paramedic', 'Project Manager']
      },
      'ESFP': {
        title: 'Entertainer',
        description: 'Spontaneous, energetic and enthusiastic people - life is never boring around them. ESFPs love being the center of attention.',
        strengths: ['Sociability', 'Enthusiasm', 'Practicality', 'Spontaneity', 'Openness'],
        development: ['Sensitivity', 'Conflict avoidance', 'Independence', 'Easily bored'],
        careers: ['Actor', 'Musician', 'Photographer', 'Event Manager', 'Social Worker', 'Trainer']
      }
    };

    // Quiz state
    let quizState = {
      currentQuestion: 0,
      answers: [],
      scores: {
        E: 0, I: 0,  // Extraversion/Introversion
        S: 0, N: 0,  // Sensing/Intuition
        T: 0, F: 0,  // Thinking/Feeling
        J: 0, P: 0,  // Judging/Perceiving
        O: 0,        // Openness
        C: 0,        // Conscientiousness
        A: 0         // Agreeableness
        // N: 0      // Neuroticism (using different key to avoid conflict)
      }
    };

    // DOM elements
    const elements = {
      intro: document.getElementById('quiz-intro'),
      quiz: document.getElementById('personality-quiz'),
      results: document.getElementById('quiz-results'),
      startBtn: document.getElementById('start-quiz'),
      progressFill: document.getElementById('progress-fill'),
      questionCounter: document.getElementById('question-counter'),
      questionText: document.getElementById('question-text'),
      answerOptions: document.getElementById('answer-options'),
      prevBtn: document.getElementById('prev-question'),
      nextBtn: document.getElementById('next-question'),
      submitBtn: document.getElementById('submit-quiz'),
      retakeBtn: document.getElementById('retake-quiz'),
      shareBtn: document.getElementById('share-results'),
      saveBtn: document.getElementById('save-results'),
      mbtiType: document.getElementById('mbti-type'),
      mbtiTitle: document.getElementById('mbti-title'),
      bigFiveChart: document.getElementById('big-five-chart'),
      personalityDescription: document.getElementById('personality-description'),
      strengthsWeaknesses: document.getElementById('strengths-weaknesses'),
      careerRecommendations: document.getElementById('career-recommendations')
    };

    // Event listeners
    elements.startBtn.addEventListener('click', startQuiz);
    elements.prevBtn.addEventListener('click', previousQuestion);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.submitBtn.addEventListener('click', submitQuiz);
    elements.retakeBtn.addEventListener('click', retakeQuiz);
    elements.shareBtn.addEventListener('click', shareResults);
    elements.saveBtn.addEventListener('click', saveResults);

    function startQuiz() {
      quizState.currentQuestion = 0;
      quizState.answers = [];
      quizState.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, O: 0, C: 0, A: 0 };
      
      elements.intro.style.display = 'none';
      elements.quiz.style.display = 'block';
      elements.results.style.display = 'none';
      
      showQuestion(0);
    }

    function showQuestion(index) {
      const question = questions[index];
      
      // Update progress
      const progress = ((index + 1) / questions.length) * 100;
      elements.progressFill.style.width = `${progress}%`;
      elements.questionCounter.textContent = `Question ${index + 1} of ${questions.length}`;
      
      // Display question
      elements.questionText.textContent = question.text;
      
      // Display options
      elements.answerOptions.innerHTML = '';
      question.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.dataset.optionIndex = optionIndex;
        
        // Apply inline styling similar to reference quizzes
        button.style.cssText = `
          background: ${quizState.answers[index] === optionIndex ? '#88d8a3' : '#f8f9fa'};
          color: ${quizState.answers[index] === optionIndex ? 'white' : '#333'};
          border: 2px solid ${quizState.answers[index] === optionIndex ? '#88d8a3' : '#e9ecef'};
          padding: 12px 15px;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          font-size: 0.95em;
          line-height: 1.4;
          margin-bottom: 1rem;
          width: 100%;
          font-weight: ${quizState.answers[index] === optionIndex ? '600' : '400'};
        `;
        
        // Add hover effects
        button.addEventListener('mouseover', () => {
          if (quizState.answers[index] !== optionIndex) {
            button.style.background = '#e8f5e8';
            button.style.borderColor = '#88d8a3';
          }
        });
        
        button.addEventListener('mouseout', () => {
          if (quizState.answers[index] !== optionIndex) {
            button.style.background = '#f8f9fa';
            button.style.borderColor = '#e9ecef';
          }
        });
        
        button.addEventListener('click', () => selectAnswer(index, optionIndex));
        elements.answerOptions.appendChild(button);
      });
      
      // Update navigation buttons
      elements.prevBtn.disabled = index === 0;
      elements.nextBtn.style.display = index === questions.length - 1 ? 'none' : 'block';
      elements.submitBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
      
      // Update next button state
      updateNextButton();
    }

    function selectAnswer(questionIndex, optionIndex) {
      quizState.answers[questionIndex] = optionIndex;
      
      // Update visual selection for all options
      const options = elements.answerOptions.querySelectorAll('button');
      options.forEach((option, index) => {
        if (index === optionIndex) {
          // Selected option
          option.style.background = '#88d8a3';
          option.style.color = 'white';
          option.style.borderColor = '#88d8a3';
          option.style.fontWeight = '600';
        } else {
          // Unselected options
          option.style.background = '#f8f9fa';
          option.style.color = '#333';
          option.style.borderColor = '#e9ecef';
          option.style.fontWeight = '400';
        }
      });
      
      updateNextButton();
    }

    function updateNextButton() {
      const hasAnswer = quizState.answers[quizState.currentQuestion] !== undefined;
      elements.nextBtn.disabled = !hasAnswer;
      elements.submitBtn.disabled = !hasAnswer;
    }

    function previousQuestion() {
      if (quizState.currentQuestion > 0) {
        quizState.currentQuestion--;
        showQuestion(quizState.currentQuestion);
      }
    }

    function nextQuestion() {
      if (quizState.currentQuestion < questions.length - 1) {
        quizState.currentQuestion++;
        showQuestion(quizState.currentQuestion);
      }
    }

    function submitQuiz() {
      calculateScores();
      showResults();
    }

    function calculateScores() {
      // Reset scores
      quizState.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, O: 0, C: 0, A: 0 };
      
      // Calculate scores based on answers
      quizState.answers.forEach((answerIndex, questionIndex) => {
        const question = questions[questionIndex];
        const selectedOption = question.options[answerIndex];
        
        // Add scores from selected option
        Object.entries(selectedOption.scores).forEach(([dimension, score]) => {
          if (quizState.scores.hasOwnProperty(dimension)) {
            quizState.scores[dimension] += score;
          }
        });
      });
    }

    function determineMBTIType() {
      let type = '';
      
      // Determine each dimension
      type += quizState.scores.E > quizState.scores.I ? 'E' : 'I';
      type += quizState.scores.S > quizState.scores.N ? 'S' : 'N';
      type += quizState.scores.T > quizState.scores.F ? 'T' : 'F';
      type += quizState.scores.J > quizState.scores.P ? 'J' : 'P';
      
      return type;
    }

    function showResults() {
      elements.quiz.style.display = 'none';
      elements.results.style.display = 'block';
      
      const mbtiType = determineMBTIType();
      const typeInfo = mbtiTypes[mbtiType];
      
      // Display MBTI type
      elements.mbtiType.textContent = mbtiType;
      elements.mbtiTitle.textContent = typeInfo.title;
      
      // Create Big Five chart
      createBigFiveChart();
      
      // Display personality description
      displayPersonalityDescription(typeInfo);
      
      // Display strengths and development areas
      displayStrengthsWeaknesses(typeInfo);
      
      // Display career recommendations
      displayCareerRecommendations(typeInfo);
      
      // Scroll to results
      elements.results.scrollIntoView({ behavior: 'smooth' });
    }

    function createBigFiveChart() {
      // Normalize Big Five scores to 0-100 scale
      const maxScore = 20; // Approximate maximum possible score per trait
      const bigFiveTraits = [
        { label: 'Openness', score: Math.max(0, Math.min(100, (quizState.scores.O / maxScore) * 100)) },
        { label: 'Conscientiousness', score: Math.max(0, Math.min(100, (quizState.scores.C / maxScore) * 100)) },
        { label: 'Extraversion', score: Math.max(0, Math.min(100, (quizState.scores.E / maxScore) * 100)) },
        { label: 'Agreeableness', score: Math.max(0, Math.min(100, (quizState.scores.A / maxScore) * 100)) },
        { label: 'Emotional Stability', score: Math.max(0, Math.min(100, 100 - (quizState.scores.N / maxScore) * 100)) }
      ];
      
      elements.bigFiveChart.innerHTML = '';
      
      bigFiveTraits.forEach(trait => {
        const traitDiv = document.createElement('div');
        traitDiv.className = 'trait-bar';
        
        traitDiv.innerHTML = `
          <div class="trait-label">${trait.label}</div>
          <div class="trait-progress">
            <div class="trait-fill" style="width: ${trait.score}%"></div>
          </div>
          <div class="trait-score">${Math.round(trait.score)}</div>
        `;
        
        elements.bigFiveChart.appendChild(traitDiv);
      });
    }

    function displayPersonalityDescription(typeInfo) {
      elements.personalityDescription.innerHTML = `
        <h6>📝 Your Personality Type Description</h6>
        <p>${typeInfo.description}</p>
        <p>Your personality type reflects a unique combination of psychological preferences that influence how you perceive the world, make decisions, and interact with others.</p>
      `;
    }

    function displayStrengthsWeaknesses(typeInfo) {
      elements.strengthsWeaknesses.innerHTML = `
        <div class="strength-card">
          <h6>💪 Your Strengths</h6>
          <ul class="strength-list">
            ${typeInfo.strengths.map(strength => `<li>✅ ${strength}</li>`).join('')}
          </ul>
        </div>
        <div class="development-card">
          <h6>🎯 Areas for Development</h6>
          <ul class="development-list">
            ${typeInfo.development.map(area => `<li>⚠️ ${area}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    function displayCareerRecommendations(typeInfo) {
      elements.careerRecommendations.innerHTML = `
        <div class="career-section">
          <h6>💼 Recommended Careers</h6>
          <div class="career-list">
            ${typeInfo.careers.map(career => `<span class="career-item">${career}</span>`).join('')}
          </div>
        </div>
        <div class="career-section">
          <h6>🤝 Relationship Advice</h6>
          <p>Understanding your personality type helps build better relationships with others. Remember that different types have different needs and communication styles.</p>
        </div>
        <div class="career-section">
          <h6>📈 Personal Development</h6>
          <p>Work on developing your weaker areas, but don't forget to use and enhance your natural strengths.</p>
        </div>
      `;
    }

    function retakeQuiz() {
      elements.results.style.display = 'none';
      elements.intro.style.display = 'block';
    }

    function shareResults() {
      const mbtiType = determineMBTIType();
      const typeInfo = mbtiTypes[mbtiType];
      const shareText = `I took a personality test and I'm ${mbtiType} - ${typeInfo.title}! 🧠✨`;
      
      if (navigator.share) {
        navigator.share({
          title: 'My Personality Type',
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + '\n' + window.location.href);
        showNotification('Results copied for sharing!');
      }
    }

    function saveResults() {
      const mbtiType = determineMBTIType();
      const typeInfo = mbtiTypes[mbtiType];
      
      const results = {
        mbtiType,
        typeInfo,
        scores: quizState.scores,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('personalityTestResultsEn', JSON.stringify(results));
      
      // Show enhanced notification with more feedback
      showNotification('✅ Results successfully saved! You can find them in your browser.');
      
      // Also create a downloadable backup
      const resultsText = `
Personality Type Test - Results
Date: ${new Date().toLocaleDateString('en-US')}

Your Personality Type: ${mbtiType} - ${typeInfo.title}

Description: ${typeInfo.description}

Strengths:
${typeInfo.strengths.map(s => `• ${s}`).join('\n')}

Areas for Development:
${typeInfo.development.map(d => `• ${d}`).join('\n')}

Recommended Careers:
${typeInfo.careers.map(c => `• ${c}`).join('\n')}

Scores by Main Dimensions:
• Extraversion: ${quizState.scores.E}
• Introversion: ${quizState.scores.I}
• Sensing: ${quizState.scores.S}
• Intuition: ${quizState.scores.N}
• Thinking: ${quizState.scores.T}
• Feeling: ${quizState.scores.F}
• Judging: ${quizState.scores.J}
• Perceiving: ${quizState.scores.P}
• Openness: ${quizState.scores.O}
• Conscientiousness: ${quizState.scores.C}
• Agreeableness: ${quizState.scores.A}

Saved from kalkulator.com.ua
      `.trim();
      
      // Store detailed results for potential download
      localStorage.setItem('personalityTestResultsTextEn', resultsText);
    }

    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease;
      `;
      
      // Add keyframe animation
      if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
    
  })();
});