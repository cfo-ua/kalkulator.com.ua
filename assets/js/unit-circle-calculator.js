document.addEventListener("DOMContentLoaded", function () {
  const modeButtons = document.querySelectorAll('.mode-btn');
  const modeSections = document.querySelectorAll('.mode-section');
  const canvas = document.getElementById('unit-circle-main');
  const ctx = canvas.getContext('2d');
  
  // Quiz variables
  let currentQuiz = null;
  let quizTimer = null;
  let animationId = null;
  
  // Standard angles and their exact values
  const standardAngles = {
    0: { sin: 0, cos: 1, x: 1, y: 0 },
    30: { sin: 0.5, cos: Math.sqrt(3)/2, x: Math.sqrt(3)/2, y: 0.5 },
    45: { sin: Math.sqrt(2)/2, cos: Math.sqrt(2)/2, x: Math.sqrt(2)/2, y: Math.sqrt(2)/2 },
    60: { sin: Math.sqrt(3)/2, cos: 0.5, x: 0.5, y: Math.sqrt(3)/2 },
    90: { sin: 1, cos: 0, x: 0, y: 1 },
    120: { sin: Math.sqrt(3)/2, cos: -0.5, x: -0.5, y: Math.sqrt(3)/2 },
    135: { sin: Math.sqrt(2)/2, cos: -Math.sqrt(2)/2, x: -Math.sqrt(2)/2, y: Math.sqrt(2)/2 },
    150: { sin: 0.5, cos: -Math.sqrt(3)/2, x: -Math.sqrt(3)/2, y: 0.5 },
    180: { sin: 0, cos: -1, x: -1, y: 0 },
    210: { sin: -0.5, cos: -Math.sqrt(3)/2, x: -Math.sqrt(3)/2, y: -0.5 },
    225: { sin: -Math.sqrt(2)/2, cos: -Math.sqrt(2)/2, x: -Math.sqrt(2)/2, y: -Math.sqrt(2)/2 },
    240: { sin: -Math.sqrt(3)/2, cos: -0.5, x: -0.5, y: -Math.sqrt(3)/2 },
    270: { sin: -1, cos: 0, x: 0, y: -1 },
    300: { sin: -Math.sqrt(3)/2, cos: 0.5, x: 0.5, y: -Math.sqrt(3)/2 },
    315: { sin: -Math.sqrt(2)/2, cos: Math.sqrt(2)/2, x: Math.sqrt(2)/2, y: -Math.sqrt(2)/2 },
    330: { sin: -0.5, cos: Math.sqrt(3)/2, x: Math.sqrt(3)/2, y: -0.5 },
    360: { sin: 0, cos: 1, x: 1, y: 0 }
  };
  
  // Mode switching
  modeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const mode = this.dataset.mode;
      
      modeButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      modeSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${mode}-mode`) {
          section.classList.add('active');
        }
      });
      
      if (mode === 'calculator') {
        initCalculatorMode();
      } else if (mode === 'quiz') {
        initQuizMode();
      } else if (mode === 'practice') {
        initPracticeMode();
      }
    });
  });
  
  // Calculator mode initialization
  function initCalculatorMode() {
    const degreesInput = document.getElementById('calc-degrees');
    const radiansInput = document.getElementById('calc-radians');
    const xInput = document.getElementById('calc-x');
    const yInput = document.getElementById('calc-y');
    const findAngleBtn = document.getElementById('find-angle-btn');
    const result = document.getElementById('calculator-result');
    
    function updateFromDegrees() {
      const degrees = parseFloat(degreesInput.value);
      if (!isNaN(degrees)) {
        const radians = degrees * Math.PI / 180;
        const x = Math.cos(radians);
        const y = Math.sin(radians);
        
        radiansInput.value = radians.toFixed(4);
        xInput.value = x.toFixed(4);
        yInput.value = y.toFixed(4);
        
        displayCalculatorResult(degrees, radians, x, y);
        drawUnitCircle(degrees);
      }
    }
    
    function updateFromRadians() {
      const radians = parseFloat(radiansInput.value);
      if (!isNaN(radians)) {
        const degrees = radians * 180 / Math.PI;
        const x = Math.cos(radians);
        const y = Math.sin(radians);
        
        degreesInput.value = degrees.toFixed(2);
        xInput.value = x.toFixed(4);
        yInput.value = y.toFixed(4);
        
        displayCalculatorResult(degrees, radians, x, y);
        drawUnitCircle(degrees);
      }
    }
    
    function findAngleFromCoordinates() {
      const x = parseFloat(xInput.value);
      const y = parseFloat(yInput.value);
      
      if (!isNaN(x) && !isNaN(y)) {
        // Check if point is on unit circle
        const distance = Math.sqrt(x*x + y*y);
        if (Math.abs(distance - 1) > 0.01) {
          result.innerHTML = '<div class="error">⚠️ Точка не лежить на одиничному колі (відстань від центру повинна дорівнювати 1)</div>';
          return;
        }
        
        let radians = Math.atan2(y, x);
        if (radians < 0) radians += 2 * Math.PI;
        let degrees = radians * 180 / Math.PI;
        
        degreesInput.value = degrees.toFixed(2);
        radiansInput.value = radians.toFixed(4);
        
        displayCalculatorResult(degrees, radians, x, y);
        drawUnitCircle(degrees);
      }
    }
    
    degreesInput.addEventListener('input', updateFromDegrees);
    radiansInput.addEventListener('input', updateFromRadians);
    findAngleBtn.addEventListener('click', findAngleFromCoordinates);
    
    // Initial calculation
    updateFromDegrees();
  }
  
  function displayCalculatorResult(degrees, radians, x, y) {
    const result = document.getElementById('calculator-result');
    const normalizedDeg = ((degrees % 360) + 360) % 360;
    
    // Check for exact values
    let exactInfo = '';
    const closestStandard = Object.keys(standardAngles).find(angle => 
      Math.abs(parseFloat(angle) - normalizedDeg) < 0.1
    );
    
    if (closestStandard) {
      exactInfo = `<div class="exact-values">
        ✨ <strong>Точні значення:</strong>
        <span>sin(${closestStandard}°) = ${getExactValue(standardAngles[closestStandard].sin)}</span>
        <span>cos(${closestStandard}°) = ${getExactValue(standardAngles[closestStandard].cos)}</span>
      </div>`;
    }
    
    result.innerHTML = `
      <div class="unit-circle-result">
        <h4>⭕ Результати для кута ${degrees.toFixed(2)}°</h4>
        <div class="result-grid">
          <div class="angle-info">
            <h5>📐 Кут:</h5>
            <span>Градуси: <strong>${degrees.toFixed(2)}°</strong></span>
            <span>Радіани: <strong>${radians.toFixed(4)}</strong></span>
            <span>Квадрант: <strong>${getQuadrant(normalizedDeg)}</strong></span>
          </div>
          
          <div class="coordinates-info">
            <h5>📍 Координати:</h5>
            <span>x = cos(θ) = <strong>${x.toFixed(4)}</strong></span>
            <span>y = sin(θ) = <strong>${y.toFixed(4)}</strong></span>
            <span>Точка: <strong>(${x.toFixed(4)}, ${y.toFixed(4)})</strong></span>
          </div>
          
          <div class="trig-info">
            <h5>📊 Тригонометричні функції:</h5>
            <span>sin(θ) = <strong>${y.toFixed(4)}</strong></span>
            <span>cos(θ) = <strong>${x.toFixed(4)}</strong></span>
            <span>tan(θ) = <strong>${Math.abs(x) < 1e-10 ? '∞' : (y/x).toFixed(4)}</strong></span>
          </div>
        </div>
        ${exactInfo}
      </div>
    `;
  }
  
  function getExactValue(decimal) {
    if (Math.abs(decimal) < 1e-10) return '0';
    if (Math.abs(decimal - 1) < 1e-10) return '1';
    if (Math.abs(decimal + 1) < 1e-10) return '-1';
    if (Math.abs(decimal - 0.5) < 1e-10) return '1/2';
    if (Math.abs(decimal + 0.5) < 1e-10) return '-1/2';
    if (Math.abs(decimal - Math.sqrt(2)/2) < 1e-10) return '√2/2';
    if (Math.abs(decimal + Math.sqrt(2)/2) < 1e-10) return '-√2/2';
    if (Math.abs(decimal - Math.sqrt(3)/2) < 1e-10) return '√3/2';
    if (Math.abs(decimal + Math.sqrt(3)/2) < 1e-10) return '-√3/2';
    return decimal.toFixed(4);
  }
  
  function getQuadrant(degrees) {
    const normalized = ((degrees % 360) + 360) % 360;
    if (normalized >= 0 && normalized < 90) return 'I';
    if (normalized >= 90 && normalized < 180) return 'II';
    if (normalized >= 180 && normalized < 270) return 'III';
    return 'IV';
  }
  
  // Quiz mode initialization
  function initQuizMode() {
    const startBtn = document.getElementById('start-quiz-btn');
    const nextBtn = document.getElementById('next-question-btn');
    const finishBtn = document.getElementById('finish-quiz-btn');
    
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    finishBtn.addEventListener('click', finishQuiz);
  }
  
  function startQuiz() {
    const type = document.getElementById('quiz-type').value;
    const difficulty = document.getElementById('quiz-difficulty').value;
    
    currentQuiz = {
      type: type,
      difficulty: difficulty,
      questions: generateQuizQuestions(type, difficulty),
      currentQuestion: 0,
      correctAnswers: 0,
      startTime: Date.now()
    };
    
    document.querySelector('.quiz-settings').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    
    showQuestion();
    startQuizTimer();
  }
  
  function generateQuizQuestions(type, difficulty) {
    const questions = [];
    const numQuestions = 10;
    
    let angles = [];
    if (difficulty === 'easy') {
      angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360];
    } else if (difficulty === 'medium') {
      angles = Object.keys(standardAngles).map(Number);
    } else {
      // Hard: random angles
      for (let i = 0; i < numQuestions; i++) {
        angles.push(Math.floor(Math.random() * 360));
      }
    }
    
    for (let i = 0; i < numQuestions; i++) {
      const angle = angles[i % angles.length];
      questions.push(generateQuestion(type, angle));
    }
    
    return questions;
  }
  
  function generateQuestion(type, angle) {
    const rad = angle * Math.PI / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);
    
    if (type === 'coordinates' || (type === 'mixed' && Math.random() < 0.33)) {
      return {
        type: 'coordinates',
        question: `Які координати точки на одиничному колі для кута ${angle}°?`,
        angle: angle,
        correct: `(${x.toFixed(2)}, ${y.toFixed(2)})`,
        options: generateCoordinateOptions(x, y)
      };
    } else if (type === 'angle' || (type === 'mixed' && Math.random() < 0.5)) {
      return {
        type: 'angle',
        question: `Який кут відповідає координатам (${x.toFixed(2)}, ${y.toFixed(2)})?`,
        coordinates: [x, y],
        correct: `${angle}°`,
        options: generateAngleOptions(angle)
      };
    } else {
      const func = ['sin', 'cos'][Math.floor(Math.random() * 2)];
      const value = func === 'sin' ? y : x;
      return {
        type: 'trig',
        question: `Чому дорівнює ${func}(${angle}°)?`,
        angle: angle,
        func: func,
        correct: value.toFixed(2),
        options: generateTrigOptions(value)
      };
    }
  }
  
  function generateCoordinateOptions(correctX, correctY) {
    const options = [`(${correctX.toFixed(2)}, ${correctY.toFixed(2)})`];
    
    while (options.length < 4) {
      const x = (Math.random() * 2 - 1).toFixed(2);
      const y = (Math.random() * 2 - 1).toFixed(2);
      const option = `(${x}, ${y})`;
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    return shuffleArray(options);
  }
  
  function generateAngleOptions(correctAngle) {
    const options = [`${correctAngle}°`];
    
    while (options.length < 4) {
      const angle = Math.floor(Math.random() * 360);
      const option = `${angle}°`;
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    return shuffleArray(options);
  }
  
  function generateTrigOptions(correctValue) {
    const options = [correctValue.toFixed(2)];
    
    while (options.length < 4) {
      const value = (Math.random() * 2 - 1).toFixed(2);
      if (!options.includes(value)) {
        options.push(value);
      }
    }
    
    return shuffleArray(options);
  }
  
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  function showQuestion() {
    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    
    questionEl.innerHTML = `
      <h5>Питання ${currentQuiz.currentQuestion + 1}/${currentQuiz.questions.length}</h5>
      <p>${question.question}</p>
    `;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'quiz-option';
      button.textContent = option;
      button.addEventListener('click', () => selectAnswer(option));
      optionsEl.appendChild(button);
    });
    
    updateQuizScore();
  }
  
  function selectAnswer(selectedAnswer) {
    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(option => {
      option.disabled = true;
      if (option.textContent === question.correct) {
        option.classList.add('correct');
      } else if (option.textContent === selectedAnswer) {
        option.classList.add('incorrect');
      }
    });
    
    if (selectedAnswer === question.correct) {
      currentQuiz.correctAnswers++;
    }
    
    setTimeout(() => {
      currentQuiz.currentQuestion++;
      if (currentQuiz.currentQuestion < currentQuiz.questions.length) {
        document.getElementById('next-question-btn').style.display = 'block';
      } else {
        document.getElementById('finish-quiz-btn').style.display = 'block';
      }
    }, 1500);
  }
  
  function nextQuestion() {
    document.getElementById('next-question-btn').style.display = 'none';
    showQuestion();
  }
  
  function finishQuiz() {
    clearInterval(quizTimer);
    const elapsed = Math.floor((Date.now() - currentQuiz.startTime) / 1000);
    const percentage = Math.round((currentQuiz.correctAnswers / currentQuiz.questions.length) * 100);
    
    document.getElementById('quiz-content').style.display = 'none';
    const resultsEl = document.getElementById('quiz-results');
    resultsEl.style.display = 'block';
    
    resultsEl.innerHTML = `
      <div class="quiz-final-results">
        <h4>🏁 Результати квізу</h4>
        <div class="results-summary">
          <div class="score-display">
            <span class="score">${currentQuiz.correctAnswers}/${currentQuiz.questions.length}</span>
            <span class="percentage">${percentage}%</span>
          </div>
          <div class="time-display">Час: ${elapsed}с</div>
          <div class="performance">${getPerformanceMessage(percentage)}</div>
        </div>
        <button onclick="location.reload()">🔄 Спробувати ще раз</button>
      </div>
    `;
  }
  
  function getPerformanceMessage(percentage) {
    if (percentage >= 90) return '🏆 Відмінно! Ви добре знаєте одиничне коло!';
    if (percentage >= 70) return '👍 Добре! Ще трохи практики і буде ідеально!';
    if (percentage >= 50) return '📚 Непогано, але варто повторити матеріал';
    return '💪 Потрібно більше практики. Не здавайтесь!';
  }
  
  function updateQuizScore() {
    document.getElementById('quiz-score').textContent = 
      `Рахунок: ${currentQuiz.correctAnswers}/${currentQuiz.currentQuestion}`;
  }
  
  function startQuizTimer() {
    let seconds = 0;
    quizTimer = setInterval(() => {
      seconds++;
      document.getElementById('quiz-timer').textContent = `Час: ${seconds}с`;
    }, 1000);
  }
  
  // Practice mode initialization
  function initPracticeMode() {
    const topicButtons = document.querySelectorAll('.topic-btn');
    const contentEl = document.getElementById('practice-content');
    
    topicButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const topic = this.dataset.topic;
        showPracticeTopic(topic, contentEl);
      });
    });
  }
  
  function showPracticeTopic(topic, contentEl) {
    const topics = {
      quadrants: {
        title: '🏠 Квадранти одиничного кола',
        content: `
          <div class="practice-topic">
            <p>Одиничне коло поділяється на чотири квадранти:</p>
            <ul>
              <li><strong>I квадрант (0° - 90°):</strong> sin > 0, cos > 0</li>
              <li><strong>II квадрант (90° - 180°):</strong> sin > 0, cos < 0</li>
              <li><strong>III квадрант (180° - 270°):</strong> sin < 0, cos < 0</li>
              <li><strong>IV квадрант (270° - 360°):</strong> sin < 0, cos > 0</li>
            </ul>
            <p>Запам'ятайте: <em>"All Students Take Calculus"</em> (всі функції додатні, sin, tan, cos)</p>
          </div>
        `
      },
      'special-angles': {
        title: '⭐ Особливі кути',
        content: `
          <div class="practice-topic">
            <p>Основні кути, які потрібно знати напам'ять:</p>
            <table>
              <tr><th>Кут</th><th>sin</th><th>cos</th><th>tan</th></tr>
              <tr><td>0°</td><td>0</td><td>1</td><td>0</td></tr>
              <tr><td>30°</td><td>1/2</td><td>√3/2</td><td>√3/3</td></tr>
              <tr><td>45°</td><td>√2/2</td><td>√2/2</td><td>1</td></tr>
              <tr><td>60°</td><td>√3/2</td><td>1/2</td><td>√3</td></tr>
              <tr><td>90°</td><td>1</td><td>0</td><td>∞</td></tr>
            </table>
          </div>
        `
      },
      signs: {
        title: '➕➖ Знаки функцій',
        content: `
          <div class="practice-topic">
            <p>Знаки тригонометричних функцій у квадрантах:</p>
            <div class="signs-grid">
              <div class="quadrant">
                <h5>II квадрант</h5>
                <p>sin: +<br>cos: -<br>tan: -</p>
              </div>
              <div class="quadrant">
                <h5>I квадрант</h5>
                <p>sin: +<br>cos: +<br>tan: +</p>
              </div>
              <div class="quadrant">
                <h5>III квадрант</h5>
                <p>sin: -<br>cos: -<br>tan: +</p>
              </div>
              <div class="quadrant">
                <h5>IV квадрант</h5>
                <p>sin: -<br>cos: +<br>tan: -</p>
              </div>
            </div>
          </div>
        `
      },
      symmetry: {
        title: '🔄 Симетрія на одиничному колі',
        content: `
          <div class="practice-topic">
            <p>Корисні співвідношення симетрії:</p>
            <ul>
              <li><strong>sin(-θ) = -sin(θ)</strong> (непарна функція)</li>
              <li><strong>cos(-θ) = cos(θ)</strong> (парна функція)</li>
              <li><strong>sin(180° - θ) = sin(θ)</strong></li>
              <li><strong>cos(180° - θ) = -cos(θ)</strong></li>
              <li><strong>sin(180° + θ) = -sin(θ)</strong></li>
              <li><strong>cos(180° + θ) = -cos(θ)</strong></li>
            </ul>
          </div>
        `
      }
    };
    
    const topic = topics[topic] || topics.quadrants;
    contentEl.innerHTML = `
      <h4>${topic.title}</h4>
      ${topic.content}
    `;
  }
  
  // Unit circle drawing
  function drawUnitCircle(highlightAngle = null) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = -200; i <= 200; i += 25) {
      ctx.beginPath();
      ctx.moveTo(centerX + i, 0);
      ctx.lineTo(centerX + i, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, centerY + i);
      ctx.lineTo(canvas.width, centerY + i);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Draw unit circle
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw angle marks
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    Object.keys(standardAngles).forEach(angle => {
      const rad = parseFloat(angle) * Math.PI / 180;
      const x = Math.cos(rad) * radius;
      const y = -Math.sin(rad) * radius;
      
      ctx.beginPath();
      ctx.arc(centerX + x, centerY + y, 3, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Label important angles
      if ([0, 30, 45, 60, 90, 120, 135, 150, 180, 270].includes(parseFloat(angle))) {
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(`${angle}°`, centerX + x + 10, centerY + y - 10);
      }
    });
    
    // Highlight specific angle if provided
    if (highlightAngle !== null) {
      const rad = highlightAngle * Math.PI / 180;
      const x = Math.cos(rad) * radius;
      const y = -Math.sin(rad) * radius;
      
      // Draw radius line
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + x, centerY + y);
      ctx.stroke();
      
      // Draw point
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(centerX + x, centerY + y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw projections
      ctx.strokeStyle = '#2ed573';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + x, centerY + y);
      ctx.lineTo(centerX + x, centerY);
      ctx.moveTo(centerX + x, centerY + y);
      ctx.lineTo(centerX, centerY + y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  // Canvas controls
  document.getElementById('show-angles-btn').addEventListener('click', () => {
    drawUnitCircle();
  });
  
  document.getElementById('show-coordinates-btn').addEventListener('click', () => {
    drawUnitCircle();
  });
  
  document.getElementById('animate-btn').addEventListener('click', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
      document.getElementById('animate-btn').textContent = '▶️ Анімація';
    } else {
      startAnimation();
      document.getElementById('animate-btn').textContent = '⏸️ Зупинити';
    }
  });
  
  function startAnimation() {
    let angle = 0;
    function animate() {
      drawUnitCircle(angle);
      angle = (angle + 2) % 360;
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }
  
  // Initialize
  initCalculatorMode();
  drawUnitCircle(45);
});