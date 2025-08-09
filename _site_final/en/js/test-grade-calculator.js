document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('test-grade-form');
  const result = document.getElementById('test-grade-result');
  
  if (form) {
    // Auto-calculate on input change
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', calculateGrade);
    });
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateGrade();
    });
    
    // Initial calculation with default values
    calculateGrade();
  }
  
  function calculateGrade() {
    const correctAnswers = parseInt(document.getElementById('correct-answers').value) || 0;
    const totalQuestions = parseInt(document.getElementById('total-questions').value) || 1;
    const targetGrade = document.getElementById('target-grade').value;
    
    if (correctAnswers < 0 || totalQuestions < 1 || correctAnswers > totalQuestions) {
      result.innerHTML = '<div class="insight-card warning">⚠️ <strong>Error:</strong> Please check your input. The number of correct answers cannot exceed the total number of questions.</div>';
      return;
    }
    
    // Calculate percentage
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // Determine grade
    let grade, gradeText, gradeColor;
    if (percentage >= 90) {
      grade = "A";
      gradeText = "Excellent";
      gradeColor = "success";
    } else if (percentage >= 75) {
      grade = "B";
      gradeText = "Good";
      gradeColor = "info";
    } else if (percentage >= 60) {
      grade = "C";
      gradeText = "Satisfactory";
      gradeColor = "warning";
    } else {
      grade = "F";
      gradeText = "Unsatisfactory";
      gradeColor = "warning";
    }
    
    const incorrectAnswers = totalQuestions - correctAnswers;
    
    let resultHTML = `
      <div class="insight-cards">
        <div class="insight-card ${gradeColor}">
          <h6>📊 Your Score</h6>
          <div class="big-number">${percentage.toFixed(1)}%</div>
          <p>${correctAnswers} out of ${totalQuestions} correct</p>
        </div>
        
        <div class="insight-card ${gradeColor}">
          <h6>🎓 Grade</h6>
          <div class="big-number">${grade}</div>
          <p>${gradeText}</p>
        </div>
        
        <div class="insight-card info">
          <h6>❌ Mistakes</h6>
          <div class="big-number">${incorrectAnswers}</div>
          <p>incorrect answers</p>
        </div>
      </div>
    `;
    
    // Target grade calculation
    if (targetGrade) {
      let requiredPercentage;
      
      switch(targetGrade) {
        case "A":
          requiredPercentage = 90;
          break;
        case "B":
          requiredPercentage = 75;
          break;
        case "C":
          requiredPercentage = 60;
          break;
      }
      
      const requiredCorrect = Math.ceil((requiredPercentage / 100) * totalQuestions);
      const needMore = Math.max(0, requiredCorrect - correctAnswers);
      
      let targetHTML;
      if ((targetGrade === "A" && grade === "A") || 
          (targetGrade === "B" && (grade === "A" || grade === "B")) || 
          (targetGrade === "C" && (grade === "A" || grade === "B" || grade === "C"))) {
        targetHTML = `
          <div class="insight-card success">
            <h6>🎯 Target Grade ${targetGrade}</h6>
            <div class="big-number">✅</div>
            <p>You've achieved this grade!</p>
          </div>
        `;
      } else {
        targetHTML = `
          <div class="insight-card warning">
            <h6>🎯 For Grade ${targetGrade}</h6>
            <div class="big-number">${requiredCorrect}</div>
            <p>correct answers needed<br>
            <small>${needMore} more ${needMore === 1 ? 'answer' : 'answers'} required</small></p>
          </div>
        `;
      }
      
      resultHTML += `
        <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
        <div class="insight-cards">
          ${targetHTML}
        </div>
      `;
    }
    
    // Add detailed breakdown
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
        <h4 style="margin-top: 0; color: #495057;">📋 Detailed Breakdown</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Correct Answers:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${correctAnswers} out of ${totalQuestions}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Percentage Correct:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: #28a745; font-weight: 600;">${percentage.toFixed(1)}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Incorrect Answers:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: #dc3545;">${incorrectAnswers}</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem 0; font-weight: 600;">Final Grade:</td>
            <td style="padding: 0.75rem 0; text-align: right; font-size: 1.2rem; font-weight: bold; color: var(--accent);">${grade} (${gradeText})</td>
          </tr>
        </table>
      </div>
    `;
    
    result.innerHTML = resultHTML;
  }
});