---
layout: calculator
title: Periodic Table Quiz - Test Your Chemical Elements Knowledge
categories:
- school
faq:
- answer: The quiz contains 20 questions about chemical elements, their symbols, properties, and placement in the periodic table. Each question has 4 answer options.
  question: What does the periodic table quiz include?
- answer: Results are scored on a scale from 0 to 100%. 90-100% is excellent, 80-89% is good, 70-79% is satisfactory, below 70% needs improvement.
  question: How are quiz results evaluated?
- answer: Yes! You can take the quiz as many times as you want. This will help you better learn the periodic table and improve your chemistry knowledge.
  question: Can I retake the quiz?
- answer: The quiz typically takes 10-15 minutes. You can complete it at your own pace without rushing through the answers.
  question: How long does the quiz take?
- answer: The quiz is suitable for middle and high school students, college students, chemistry teachers, and anyone interested in science and chemistry.
  question: Who is this quiz suitable for?
- answer: The periodic table is a systematic organization of all known chemical elements by their properties, atomic number, and electronic configuration.
  question: What is Mendeleev's periodic table?
- answer: Yes, the quiz includes questions about element symbols, their names, atomic numbers, groups, periods, and basic properties.
  question: Does the quiz include information about element symbols?
- answer: Regular practice will help you better memorize elements, their properties, and placement in the table, which is useful for studying chemistry.
  question: How will this quiz help in studying chemistry?
- answer: Yes, our quiz is adapted for the English educational system and includes elements that are studied in English-speaking schools.
  question: Is the quiz adapted for English education?
- answer: After completion, you'll receive a detailed analysis of results with explanations of correct answers and recommendations for further learning.
  question: What will I get after completing the quiz?
scripts:
- /en/js/periodic-table-quiz.js
seo:
  content: "<h2>Periodic Table Quiz - Test Your Chemistry Knowledge</h2>\n
    <p>Take our comprehensive <strong>periodic table quiz</strong> and test your knowledge of chemical elements. Our interactive quiz will help you better learn chemistry and prepare for exams.</p>\n
    \n<h3>What is the Periodic Table?</h3>\n<ul>\n  <li><strong>Scientific Foundation:</strong> Systematic organization of chemical elements by properties</li>\n
    \  <li><strong>History:</strong> Created by Dmitri Mendeleev in 1869</li>\n  <li><strong>Structure:</strong> Organized by periods and groups</li>\n  <li><strong>Applications:</strong> Foundation for studying chemistry and physics</li>\n
    \  <li><strong>Elements:</strong> Contains 118 known chemical elements</li>\n  <li><strong>Properties:</strong> Shows patterns in element properties</li>\n</ul>\n\n<h3>Types of Questions in the Quiz:</h3>\n
    <ul>\n  <li><strong>Element Symbols:</strong> Recognition of chemical symbols</li>\n  <li><strong>Element Names:</strong> Knowledge of chemical element names</li>\n  <li><strong>Atomic Numbers:</strong> Memorization of atomic numbers</li>\n  <li><strong>Groups and Periods:</strong> Placement in the table</li>\n  <li><strong>Properties:</strong> Basic characteristics of elements</li>\n  <li><strong>Applications:</strong> Practical uses of elements</li>\n  <li><strong>Classification:</strong> Metals, non-metals, metalloids</li>\n  <li><strong>Electronic Structure:</strong> Basic knowledge about electrons</li>\n</ul>\n\n
    <h3>Perfect for:</h3>\n<ul>\n  <li><em>Grades 8-12 Students:</em> Preparation for chemistry classes</li>\n  <li><em>College Students:</em> Review of basic chemistry knowledge</li>\n  <li><em>Teachers:</em> Testing own knowledge and preparing materials</li>\n  <li><em>Test Takers:</em> Preparation for standardized tests</li>\n  <li><em>Parents:</em> Helping children with studies</li>\n  <li><em>Scientists:</em> Refreshing knowledge of chemistry basics</li>\n  <li><em>Anyone Curious:</em> Expanding knowledge and self-education</li>\n</ul>\n\n<h3>Knowledge Levels and Scoring:</h3>\n<ul>\n  <li><strong>90-100% correct answers:</strong> Excellent knowledge level</li>\n  <li><strong>80-89% correct answers:</strong> Good knowledge level</li>\n  <li><strong>70-79% correct answers:</strong> Satisfactory knowledge level</li>\n  <li><strong>60-69% correct answers:</strong> Basic knowledge level</li>\n  <li><strong>50-59% correct answers:</strong> Beginning knowledge level</li>\n  <li><strong>Below 50%:</strong> Need to study chemistry more</li>\n</ul>\n\n<h3>Our Quiz Advantages:</h3>\n<ul>\n  <li><strong>Educational Value:</strong> Based on official educational programs</li>\n  <li><strong>Interactive:</strong> Engaging and captivating format</li>\n  <li><strong>Free Access:</strong> Completely free quiz</li>\n  <li><strong>Accessibility:</strong> Works on all devices</li>\n  <li><strong>Instant Results:</strong> Get your score immediately after completion</li>\n  <li><strong>Detailed Analysis:</strong> Explanations for each answer</li>\n</ul>\n\n<h3>Tips for Successful Completion:</h3>\n<ul>\n  <li><em>Review basic elements before taking the quiz</em></li>\n  <li><em>Pay attention to the most common elements</em></li>\n  <li><em>Remember the logic of placement in the table</em></li>\n  <li><em>Don't rush with your answers</em></li>\n  <li><em>Use elimination method for difficult questions</em></li>\n  <li><em>Analyze mistakes after completion</em></li>\n</ul>\n\n<p>Mendeleev's periodic table is the fundamental basis of chemistry. Our quiz will help you better master this important educational material in an interesting and interactive format.</p>\n"
  description: Free periodic table quiz to test your knowledge of chemical elements. 20 questions about symbols, properties, and element placement. Perfect for students and chemistry enthusiasts!
  keywords:
  - periodic table quiz
  - chemical elements test
  - chemistry quiz online
  - element symbols quiz
  - mendeleev table test
  - atomic number quiz
  - chemistry knowledge test
  - science quiz
  - educational chemistry quiz
  - periodic system test
  - chemistry practice test
  - element properties quiz
  - chemistry study tool
  - interactive chemistry
  - chemistry exam prep
  - chemical symbols test
  - atom quiz
  - chemistry assessment
  - science education quiz
  - free chemistry test
  - online chemistry quiz
  - chemistry learning tool
  - element quiz
  - chemistry basics test
  title: Periodic Table Quiz - Test Your Chemical Elements Knowledge Online
---

<div class="quiz-container">
  <div id="quiz-intro" class="quiz-section">
    <div class="insight-card info">
      <h6>🧪 Periodic Table Quiz</h6>
      <p>Test your knowledge of the periodic table of chemical elements! The quiz includes questions about symbols, names, properties, and element placement.</p>
      <p><strong>📊 Format:</strong> 20 multiple choice questions<br>
      <strong>⏱️ Time:</strong> Approximately 10-15 minutes<br>
      <strong>🎯 Topics:</strong> Symbols, properties, groups and periods</p>
      <button id="start-quiz" class="start-button">🚀 Start Quiz</button>
    </div>
  </div>

  <div id="quiz-questions" class="quiz-section" style="display: none;">
    <div class="quiz-progress">
      <div class="progress-bar">
        <div id="progress-fill" class="progress-fill"></div>
      </div>
      <span id="question-counter">Question 1 of 20</span>
    </div>

    <div id="question-container" class="question-container">
      <!-- Questions will be dynamically inserted here -->
    </div>

    <div class="quiz-navigation">
      <button id="prev-question" class="nav-button" disabled>⬅️ Previous</button>
      <button id="next-question" class="nav-button">Next ➡️</button>
      <button id="submit-quiz" class="submit-button" style="display: none;">✅ Submit Quiz</button>
    </div>
  </div>

  <div id="quiz-results" class="quiz-section" style="display: none;">
    <div class="insight-cards">
      <div class="insight-card success">
        <h6>📈 Your Score</h6>
        <div class="big-number" id="final-score">85%</div>
        <div id="score-level" class="score-level"></div>
      </div>
      
      <div class="insight-card info">
        <h6>📊 Statistics</h6>
        <div id="score-breakdown">
          <div class="breakdown-item">
            <span>Correct Answers:</span>
            <span id="correct-count">17</span>
          </div>
          <div class="breakdown-item">
            <span>Total Questions:</span>
            <span id="total-questions">20</span>
          </div>
          <div class="breakdown-item">
            <span>Accuracy:</span>
            <span id="accuracy-percentage">85%</span>
          </div>
        </div>
      </div>
    </div>

    <div id="knowledge-areas" class="insight-cards">
      <!-- Knowledge area breakdown will be inserted here -->
    </div>

    <div id="recommendations" class="recommendations">
      <!-- Recommendations will be inserted here -->
    </div>

    <div class="quiz-actions">
      <button id="retake-quiz" class="action-button">🔄 Retake Quiz</button>
      <button id="review-answers" class="action-button">📝 Review Answers</button>
    </div>
  </div>

  <div id="answer-review" class="quiz-section" style="display: none;">
    <h6>📝 Answer Review</h6>
    <div id="review-container">
      <!-- Review content will be inserted here -->
    </div>
    <button id="back-to-results" class="action-button">⬅️ Back to Results</button>
  </div>
</div>

<style>
.quiz-container {
  max-width: 900px;
  margin: 0 auto;
}

.quiz-section {
  margin: 2rem 0;
}

.start-button, .action-button, .submit-button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  margin: 1rem auto;
  display: block;
}

.start-button:hover, .action-button:hover, .submit-button:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.quiz-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  min-width: 200px;
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
  width: 0%;
}

.question-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  margin-bottom: 2rem;
}

.question-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--main-color);
}

.answer-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.answer-option {
  margin-bottom: 1rem;
}

.answer-option label {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.answer-option label:hover {
  background: var(--card-bg);
  border-color: var(--accent);
}

.answer-option input[type="radio"] {
  margin-right: 1rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.answer-option input[type="radio"]:checked + .answer-text {
  color: var(--accent);
  font-weight: 600;
}

.quiz-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--accent);
  background: white;
  color: var(--accent);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-button:hover:not(:disabled) {
  background: var(--accent);
  color: white;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}

.score-level {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.score-level.excellent {
  color: #28a745;
}

.score-level.good {
  color: #17a2b8;
}

.score-level.fair {
  color: #ffc107;
}

.score-level.poor {
  color: #fd7e14;
}

.score-level.needs-improvement {
  color: #dc3545;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.breakdown-item:last-child {
  border-bottom: none;
}

.knowledge-area {
  margin-bottom: 1rem;
}

.knowledge-area-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--main-color);
}

.knowledge-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 1rem;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.score-fill.excellent {
  background: #28a745;
}

.score-fill.good {
  background: #17a2b8;
}

.score-fill.fair {
  background: #ffc107;
}

.score-fill.poor {
  background: #fd7e14;
}

.score-fill.needs-improvement {
  background: #dc3545;
}

.recommendations {
  margin: 2rem 0;
}

.recommendation-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  margin-bottom: 1rem;
}

.recommendation-card h6 {
  margin: 0 0 1rem 0;
  color: var(--main-color);
}

.review-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  margin-bottom: 1.5rem;
}

.review-question {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--main-color);
}

.review-answer {
  margin-bottom: 0.5rem;
}

.review-answer.correct {
  color: #28a745;
  font-weight: 600;
}

.review-answer.incorrect {
  color: #dc3545;
}

.review-answer.user-answer {
  background: var(--card-bg);
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.review-explanation {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .quiz-navigation {
    flex-direction: column;
  }
  
  .nav-button, .start-button, .action-button, .submit-button {
    width: 100%;
  }
  
  .quiz-progress {
    flex-direction: column;
    text-align: center;
  }
  
  .question-container {
    padding: 1rem;
  }
  
  .insight-cards {
    grid-template-columns: 1fr;
  }
}
</style>