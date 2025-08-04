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
      result.innerHTML = '<div class="insight-card warning">⚠️ <strong>Помилка:</strong> Перевірте введені дані. Кількість правильних відповідей не може перевищувати загальну кількість питань.</div>';
      return;
    }
    
    // Calculate percentage
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // Determine grade
    let grade, gradeText, gradeColor;
    if (percentage >= 90) {
      grade = 5;
      gradeText = "Відмінно";
      gradeColor = "success";
    } else if (percentage >= 75) {
      grade = 4;
      gradeText = "Добре";
      gradeColor = "info";
    } else if (percentage >= 60) {
      grade = 3;
      gradeText = "Задовільно";
      gradeColor = "warning";
    } else {
      grade = 2;
      gradeText = "Незадовільно";
      gradeColor = "warning";
    }
    
    const incorrectAnswers = totalQuestions - correctAnswers;
    
    let resultHTML = `
      <div class="insight-cards">
        <div class="insight-card ${gradeColor}">
          <h6>📊 Ваш результат</h6>
          <div class="big-number">${percentage.toFixed(1)}%</div>
          <p>${correctAnswers} з ${totalQuestions} правильних</p>
        </div>
        
        <div class="insight-card ${gradeColor}">
          <h6>🎓 Оцінка</h6>
          <div class="big-number">${grade}</div>
          <p>${gradeText}</p>
        </div>
        
        <div class="insight-card info">
          <h6>❌ Помилки</h6>
          <div class="big-number">${incorrectAnswers}</div>
          <p>неправильних відповідей</p>
        </div>
      </div>
    `;
    
    // Target grade calculation
    if (targetGrade) {
      const targetGradeNum = parseInt(targetGrade);
      let requiredPercentage;
      
      switch(targetGradeNum) {
        case 5:
          requiredPercentage = 90;
          break;
        case 4:
          requiredPercentage = 75;
          break;
        case 3:
          requiredPercentage = 60;
          break;
      }
      
      const requiredCorrect = Math.ceil((requiredPercentage / 100) * totalQuestions);
      const needMore = Math.max(0, requiredCorrect - correctAnswers);
      
      let targetHTML;
      if (grade >= targetGradeNum) {
        targetHTML = `
          <div class="insight-card success">
            <h6>🎯 Цільова оцінка ${targetGradeNum}</h6>
            <div class="big-number">✅</div>
            <p>Ви вже досягли цієї оцінки!</p>
          </div>
        `;
      } else {
        targetHTML = `
          <div class="insight-card warning">
            <h6>🎯 Для оцінки ${targetGradeNum}</h6>
            <div class="big-number">${requiredCorrect}</div>
            <p>потрібно правильних відповідей<br>
            <small>Ще ${needMore} ${needMore === 1 ? 'відповідь' : needMore < 5 ? 'відповіді' : 'відповідей'}</small></p>
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
        <h4 style="margin-top: 0; color: #495057;">📋 Детальний розбір</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Правильних відповідей:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${correctAnswers} з ${totalQuestions}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Відсоток правильних:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: #28a745; font-weight: 600;">${percentage.toFixed(1)}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Неправильних відповідей:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: #dc3545;">${incorrectAnswers}</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem 0; font-weight: 600;">Підсумкова оцінка:</td>
            <td style="padding: 0.75rem 0; text-align: right; font-size: 1.2rem; font-weight: bold; color: var(--accent);">${grade} (${gradeText})</td>
          </tr>
        </table>
      </div>
    `;
    
    result.innerHTML = resultHTML;
  }
});