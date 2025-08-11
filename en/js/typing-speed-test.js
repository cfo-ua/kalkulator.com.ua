document.addEventListener("DOMContentLoaded", function () {
  // Wrap everything in a namespace to avoid conflicts
  (function() {
    
    // English text samples for typing test
    const englishTexts = [
      "Technology continues to evolve rapidly and reshape our daily lives. Computers, smartphones, and the internet have become essential parts of modern existence. Learning to use these tools effectively and safely is crucial for personal and professional success.",
      
      "Education plays a fundamental role in personal development and societal progress. Lifelong learning helps individuals adapt to changes in the world. Knowledge, skills, and competencies form the foundation of successful careers and personal growth.",
      
      "The natural world offers incredible diversity and beauty. Mountains, forests, oceans, and plains create unique landscapes that inspire and sustain us. Environmental conservation and ecological awareness are vital responsibilities for future generations.",
      
      "Art and literature enrich human experience and develop emotional intelligence. Reading books, visiting museums, and attending cultural events broaden our perspectives. Creative expression helps people communicate their thoughts and feelings effectively.",
      
      "A healthy lifestyle includes proper nutrition, regular exercise, and adequate rest. Prevention is better than treatment when it comes to health. Taking care of our physical and mental well-being is an investment in our future quality of life.",
      
      "Communication skills are essential in both personal relationships and professional environments. Clear writing, active listening, and thoughtful speaking help build strong connections with others. Digital literacy has become increasingly important in our connected world."
    ];

    // Test state variables
    let testState = {
      isActive: false,
      startTime: null,
      endTime: null,
      duration: 180, // default 3 minutes
      currentText: '',
      typedText: '',
      correctChars: 0,
      incorrectChars: 0,
      wpmHistory: [],
      timer: null
    };

    // DOM elements
    const elements = {
      intro: document.getElementById('test-intro'),
      testSection: document.getElementById('typing-test'),
      results: document.getElementById('test-results'),
      startBtn: document.getElementById('start-test'),
      durationSelect: document.getElementById('test-duration'),
      textDisplay: document.getElementById('text-display'),
      typingInput: document.getElementById('typing-input'),
      timeRemaining: document.getElementById('time-remaining'),
      currentWpm: document.getElementById('current-wpm'),
      currentAccuracy: document.getElementById('current-accuracy'),
      restartBtn: document.getElementById('restart-test'),
      stopBtn: document.getElementById('stop-test'),
      retakeBtn: document.getElementById('retake-test'),
      finalWpm: document.getElementById('final-wpm'),
      finalAccuracy: document.getElementById('final-accuracy'),
      accuracyLevel: document.getElementById('accuracy-level'),
      correctChars: document.getElementById('correct-chars'),
      incorrectChars: document.getElementById('incorrect-chars'),
      totalChars: document.getElementById('total-chars'),
      recommendations: document.getElementById('recommendations')
    };

    // Event listeners
    elements.startBtn.addEventListener('click', startTest);
    elements.restartBtn.addEventListener('click', restartTest);
    elements.stopBtn.addEventListener('click', stopTest);
    elements.retakeBtn.addEventListener('click', retakeTest);
    elements.typingInput.addEventListener('input', handleTyping);
    elements.typingInput.addEventListener('paste', handlePaste);

    function startTest() {
      // Get selected duration
      testState.duration = parseInt(elements.durationSelect.value);
      
      // Initialize test
      testState.currentText = getRandomText();
      testState.typedText = '';
      testState.correctChars = 0;
      testState.incorrectChars = 0;
      testState.wpmHistory = [];
      testState.isActive = true;
      testState.startTime = Date.now();
      
      // Show test section
      elements.intro.style.display = 'none';
      elements.testSection.style.display = 'block';
      elements.results.style.display = 'none';
      
      // Display text and focus input
      displayText();
      elements.typingInput.value = '';
      elements.typingInput.focus();
      
      // Start timer
      startTimer();
    }

    function getRandomText() {
      const randomIndex = Math.floor(Math.random() * englishTexts.length);
      let text = englishTexts[randomIndex];
      
      // If duration is longer, concatenate more texts
      if (testState.duration > 180) {
        text += ' ' + englishTexts[(randomIndex + 1) % englishTexts.length];
      }
      
      return text;
    }

    function displayText() {
      elements.textDisplay.innerHTML = '';
      
      for (let i = 0; i < testState.currentText.length; i++) {
        const span = document.createElement('span');
        span.textContent = testState.currentText[i];
        span.className = 'char-pending';
        elements.textDisplay.appendChild(span);
      }
    }

    function startTimer() {
      updateTimer();
      testState.timer = setInterval(() => {
        updateTimer();
        updateStats();
        
        const elapsed = (Date.now() - testState.startTime) / 1000;
        if (elapsed >= testState.duration) {
          finishTest();
        }
      }, 1000);
    }

    function updateTimer() {
      const elapsed = (Date.now() - testState.startTime) / 1000;
      const remaining = Math.max(0, testState.duration - elapsed);
      
      const minutes = Math.floor(remaining / 60);
      const seconds = Math.floor(remaining % 60);
      
      elements.timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function handleTyping(event) {
      if (!testState.isActive) return;
      
      testState.typedText = event.target.value;
      updateTextDisplay();
      updateStats();
    }

    function handlePaste(event) {
      event.preventDefault();
    }

    function updateTextDisplay() {
      const chars = elements.textDisplay.children;
      
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        
        if (i < testState.typedText.length) {
          if (testState.typedText[i] === testState.currentText[i]) {
            char.className = 'char-correct';
          } else {
            char.className = 'char-incorrect';
          }
        } else if (i === testState.typedText.length) {
          char.className = 'char-current';
        } else {
          char.className = 'char-pending';
        }
      }
    }

    function updateStats() {
      if (!testState.isActive) return;
      
      // Calculate correct and incorrect characters
      testState.correctChars = 0;
      testState.incorrectChars = 0;
      
      for (let i = 0; i < testState.typedText.length; i++) {
        if (i < testState.currentText.length) {
          if (testState.typedText[i] === testState.currentText[i]) {
            testState.correctChars++;
          } else {
            testState.incorrectChars++;
          }
        }
      }
      
      // Calculate WPM (words per minute)
      const elapsedMinutes = (Date.now() - testState.startTime) / 60000;
      const wordsTyped = testState.correctChars / 5; // Standard: 5 characters = 1 word
      const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
      
      // Calculate accuracy
      const totalTyped = testState.typedText.length;
      const accuracy = totalTyped > 0 ? Math.round((testState.correctChars / totalTyped) * 100) : 100;
      
      // Update display
      elements.currentWpm.textContent = wpm;
      elements.currentAccuracy.textContent = `${accuracy}%`;
      
      // Store WPM for chart
      testState.wpmHistory.push({ time: elapsedMinutes, wpm: wpm });
    }

    function restartTest() {
      stopTest();
      startTest();
    }

    function stopTest() {
      testState.isActive = false;
      if (testState.timer) {
        clearInterval(testState.timer);
        testState.timer = null;
      }
      finishTest();
    }

    function finishTest() {
      testState.isActive = false;
      testState.endTime = Date.now();
      
      if (testState.timer) {
        clearInterval(testState.timer);
        testState.timer = null;
      }
      
      // Calculate final stats
      const elapsedMinutes = (testState.endTime - testState.startTime) / 60000;
      const wordsTyped = testState.correctChars / 5;
      const finalWpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
      
      const totalTyped = testState.typedText.length;
      const finalAccuracy = totalTyped > 0 ? Math.round((testState.correctChars / totalTyped) * 100) : 100;
      
      // Show results
      showResults(finalWpm, finalAccuracy);
    }

    function showResults(wpm, accuracy) {
      // Hide test section, show results
      elements.testSection.style.display = 'none';
      elements.results.style.display = 'block';
      
      // Display final stats
      elements.finalWpm.textContent = wpm;
      elements.finalAccuracy.textContent = `${accuracy}%`;
      elements.correctChars.textContent = testState.correctChars;
      elements.incorrectChars.textContent = testState.incorrectChars;
      elements.totalChars.textContent = testState.typedText.length;
      
      // Set accuracy level
      setAccuracyLevel(accuracy);
      
      // Generate recommendations
      generateRecommendations(wpm, accuracy);
      
      // Draw performance chart
      drawPerformanceChart();
    }

    function setAccuracyLevel(accuracy) {
      let level = '';
      let className = '';
      
      if (accuracy >= 98) {
        level = 'Perfect accuracy!';
        className = 'text-success';
      } else if (accuracy >= 95) {
        level = 'Excellent accuracy';
        className = 'text-success';
      } else if (accuracy >= 90) {
        level = 'Good accuracy';
        className = 'text-info';
      } else if (accuracy >= 80) {
        level = 'Fair accuracy';
        className = 'text-warning';
      } else {
        level = 'Needs improvement';
        className = 'text-danger';
      }
      
      elements.accuracyLevel.textContent = level;
      elements.accuracyLevel.className = className;
    }

    function generateRecommendations(wpm, accuracy) {
      let recommendations = [];
      
      // WPM recommendations
      if (wpm < 25) {
        recommendations.push({
          title: '🐌 Speed Improvement',
          text: 'Your speed is below average. We recommend practicing touch typing daily for 15-20 minutes. Focus on proper finger placement and keyboard positioning.'
        });
      } else if (wpm < 40) {
        recommendations.push({
          title: '📈 Skill Development',
          text: 'Good progress! To improve further, practice with more complex texts and use all 10 fingers. Try not to look at the keyboard while typing.'
        });
      } else if (wpm < 60) {
        recommendations.push({
          title: '✅ Good Level',
          text: 'Your speed is above average! To reach professional level, work on typing rhythm and reducing pauses between words.'
        });
      } else {
        recommendations.push({
          title: '🏆 Excellent Result',
          text: 'Congratulations! Your speed is at professional level. Continue maintaining your skills with regular practice.'
        });
      }
      
      // Accuracy recommendations
      if (accuracy < 90) {
        recommendations.push({
          title: '🎯 Accuracy Focus',
          text: 'Focus on accuracy rather than speed. Its better to type slower with fewer errors. Check your finger positions on the keyboard.'
        });
      } else if (accuracy < 95) {
        recommendations.push({
          title: '⚡ Speed-Accuracy Balance',
          text: 'Good accuracy! Try to maintain this level while increasing speed. Practice complex words and punctuation marks.'
        });
      }
      
      // General recommendations
      recommendations.push({
        title: '💡 General Tips',
        text: 'Maintain proper posture, take breaks every 30 minutes, use an ergonomic keyboard, and practice regularly for best results.'
      });
      
      // Display recommendations
      elements.recommendations.innerHTML = '';
      recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recommendation-item';
        div.innerHTML = `<h6>${rec.title}</h6><p>${rec.text}</p>`;
        elements.recommendations.appendChild(div);
      });
    }

    function drawPerformanceChart() {
      const canvas = document.getElementById('wpm-chart');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      if (testState.wpmHistory.length < 2) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Insufficient data for chart', width / 2, height / 2);
        return;
      }
      
      // Draw chart
      const maxWpm = Math.max(...testState.wpmHistory.map(h => h.wpm), 50);
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      
      // Draw axes
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
      
      // Draw line
      ctx.strokeStyle = '#157aff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      testState.wpmHistory.forEach((point, index) => {
        const x = padding + (index / (testState.wpmHistory.length - 1)) * chartWidth;
        const y = height - padding - (point.wpm / maxWpm) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw points
      ctx.fillStyle = '#157aff';
      testState.wpmHistory.forEach((point, index) => {
        const x = padding + (index / (testState.wpmHistory.length - 1)) * chartWidth;
        const y = height - padding - (point.wpm / maxWpm) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
      
      // Labels
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('WPM Progress During Test', width / 2, height - 10);
    }

    function retakeTest() {
      elements.results.style.display = 'none';
      elements.intro.style.display = 'block';
    }
    
  })();
});