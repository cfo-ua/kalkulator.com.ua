document.addEventListener("DOMContentLoaded", function () {
  // Get language for localized messages
  const isUkrainian = !window.location.pathname.includes('/en/');
  
  // Golf rounds storage
  let golfRounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  
  // UI Messages
  const messages = {
    uk: {
      handicapResult: "Результат розрахунку гандикапу",
      handicapIndex: "Індекс гандикапу",
      differentials: "Диференціали",
      roundsUsed: "Раундів використано",
      bestDifferentials: "Найкращі диференціали",
      averageDifferential: "Середній диференціал",
      roundAdded: "Раунд додано",
      roundsCleared: "Раунди очищено",
      notEnoughRounds: "Недостатньо раундів",
      minRoundsRequired: "Потрібно мінімум 5 раундів для розрахунку гандикапу",
      differential: "Диференціал",
      excellentPlayer: "Відмінний гравець",
      veryGoodPlayer: "Дуже хороший гравець", 
      goodPlayer: "Хороший гравець",
      averagePlayer: "Середній гравець",
      beginnerPlayer: "Початківець",
      improvingPlayer: "Гравець покращується",
      stablePlayer: "Стабільний гравець",
      strugglingPlayer: "Гравець має труднощі",
      analysis: "Аналіз",
      progress: "Прогрес",
      recommendations: "Рекомендації",
      averageScore: "Середній результат",
      bestScore: "Найкращий результат",
      worstScore: "Найгірший результат",
      totalRounds: "Загалом раундів",
      recentTrend: "Останні тенденції",
      focusOnShortGame: "Зосередьтеся на короткій грі",
      workOnConsistency: "Працюйте над постійністю",
      keepUpGoodWork: "Продовжуйте в тому ж дусі",
      practiceMore: "Більше практикуйтеся"
    },
    en: {
      handicapResult: "Handicap Calculation Result",
      handicapIndex: "Handicap Index",
      differentials: "Differentials",
      roundsUsed: "Rounds Used",
      bestDifferentials: "Best Differentials",
      averageDifferential: "Average Differential",
      roundAdded: "Round Added",
      roundsCleared: "Rounds Cleared",
      notEnoughRounds: "Not Enough Rounds",
      minRoundsRequired: "Minimum 5 rounds required for handicap calculation",
      differential: "Differential",
      excellentPlayer: "Excellent Player",
      veryGoodPlayer: "Very Good Player",
      goodPlayer: "Good Player", 
      averagePlayer: "Average Player",
      beginnerPlayer: "Beginner",
      improvingPlayer: "Improving Player",
      stablePlayer: "Stable Player",
      strugglingPlayer: "Struggling Player",
      analysis: "Analysis",
      progress: "Progress",
      recommendations: "Recommendations",
      averageScore: "Average Score",
      bestScore: "Best Score",
      worstScore: "Worst Score",
      totalRounds: "Total Rounds",
      recentTrend: "Recent Trend",
      focusOnShortGame: "Focus on short game",
      workOnConsistency: "Work on consistency",
      keepUpGoodWork: "Keep up the good work",
      practiceMore: "Practice more"
    }
  };
  
  const msg = messages[isUkrainian ? 'uk' : 'en'];

  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Remove active class from all tabs and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').classList.add('active');
      
      // Update content based on tab
      if (targetTab === 'calculation') {
        calculateHandicap();
      } else if (targetTab === 'analysis') {
        showAnalysis();
      } else if (targetTab === 'progress') {
        showProgress();
      }
    });
  });

  // Round form handler
  const roundForm = document.getElementById('round-form');
  if (roundForm) {
    // Set today's date as default
    document.getElementById('round-date').valueAsDate = new Date();
    
    roundForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addRound();
    });
  }

  // Quick calculation form handler
  const quickCalcForm = document.getElementById('quick-calc-form');
  if (quickCalcForm) {
    quickCalcForm.addEventListener('submit', function(e) {
      e.preventDefault();
      quickCalculation();
    });
  }

  // Clear rounds button
  const clearRoundsBtn = document.getElementById('clear-rounds');
  if (clearRoundsBtn) {
    clearRoundsBtn.addEventListener('click', function() {
      if (confirm(isUkrainian ? 'Видалити всі раунди?' : 'Delete all rounds?')) {
        clearAllRounds();
      }
    });
  }

  // Add round function
  function addRound() {
    const score = parseInt(document.getElementById('round-score').value);
    const courseRating = parseFloat(document.getElementById('course-rating').value);
    const slopeRating = parseInt(document.getElementById('slope-rating').value);
    const date = document.getElementById('round-date').value;
    const courseName = document.getElementById('course-name').value || 'Unknown Course';

    if (!score || !courseRating || !slopeRating || !date) {
      alert(isUkrainian ? 'Заповніть всі обов\'язкові поля' : 'Fill in all required fields');
      return;
    }

    const differential = calculateDifferential(score, courseRating, slopeRating);
    
    const round = {
      id: Date.now(),
      score: score,
      courseRating: courseRating,
      slopeRating: slopeRating,
      date: date,
      courseName: courseName,
      differential: differential
    };

    golfRounds.unshift(round); // Add to beginning of array
    
    // Keep only last 20 rounds
    if (golfRounds.length > 20) {
      golfRounds = golfRounds.slice(0, 20);
    }

    saveRounds();
    displayRounds();
    showMessage(msg.roundAdded);
    
    // Reset form
    document.getElementById('round-score').value = '';
    document.getElementById('course-name').value = '';
  }

  // Calculate differential
  function calculateDifferential(score, courseRating, slopeRating) {
    return (score - courseRating) * 113 / slopeRating;
  }

  // Quick calculation
  function quickCalculation() {
    const score = parseInt(document.getElementById('quick-score').value);
    const courseRating = parseFloat(document.getElementById('quick-course-rating').value);
    const slopeRating = parseInt(document.getElementById('quick-slope-rating').value);

    const differential = calculateDifferential(score, courseRating, slopeRating);

    const html = `
      <div class="insight-card success">
        <h6>📊 ${msg.differential}</h6>
        <div class="big-number">${differential.toFixed(1)}</div>
        <p><strong>Розрахунок:</strong> (${score} - ${courseRating}) × 113 / ${slopeRating} = ${differential.toFixed(1)}</p>
      </div>
    `;

    document.getElementById('quick-calc-result').innerHTML = html;
  }

  // Calculate handicap
  function calculateHandicap() {
    if (golfRounds.length < 5) {
      const html = `
        <div class="insight-card warning">
          <h6>⚠️ ${msg.notEnoughRounds}</h6>
          <p>${msg.minRoundsRequired}</p>
          <p>${isUkrainian ? 'Поточна кількість раундів' : 'Current rounds'}: ${golfRounds.length}/5</p>
        </div>
      `;
      document.getElementById('handicap-calculation-result').innerHTML = html;
      return;
    }

    // Sort differentials and take best 8 from up to 20 rounds
    const differentials = golfRounds.map(round => round.differential).sort((a, b) => a - b);
    
    let usedDifferentials;
    if (golfRounds.length >= 20) {
      usedDifferentials = differentials.slice(0, 8);
    } else if (golfRounds.length >= 6) {
      usedDifferentials = differentials.slice(0, Math.min(8, Math.floor(golfRounds.length * 0.4)));
    } else {
      usedDifferentials = [differentials[0]]; // Best differential for 5 rounds
    }

    const averageDifferential = usedDifferentials.reduce((sum, diff) => sum + diff, 0) / usedDifferentials.length;
    const handicapIndex = averageDifferential * 0.96;

    const level = getHandicapLevel(handicapIndex);
    
    const html = `
      <div class="insight-card success">
        <h6>🏆 ${msg.handicapResult}</h6>
        <div class="handicap-summary">
          <div class="handicap-main">
            <div class="big-number">${handicapIndex.toFixed(1)}</div>
            <div class="handicap-level">${level}</div>
          </div>
          
          <div class="handicap-details">
            <div class="detail-item">
              <span>${msg.roundsUsed}:</span>
              <span>${golfRounds.length}</span>
            </div>
            <div class="detail-item">
              <span>${msg.bestDifferentials}:</span>
              <span>${usedDifferentials.length}</span>
            </div>
            <div class="detail-item">
              <span>${msg.averageDifferential}:</span>
              <span>${averageDifferential.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div class="differentials-breakdown">
          <h6>📈 ${msg.bestDifferentials}:</h6>
          <div class="differentials-list">
            ${usedDifferentials.map((diff, index) => 
              `<span class="differential-item">${index + 1}. ${diff.toFixed(1)}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('handicap-calculation-result').innerHTML = html;
  }

  // Get handicap level description
  function getHandicapLevel(handicap) {
    if (handicap <= 0) return msg.excellentPlayer;
    if (handicap <= 9) return msg.veryGoodPlayer;
    if (handicap <= 18) return msg.goodPlayer;
    if (handicap <= 27) return msg.averagePlayer;
    return msg.beginnerPlayer;
  }

  // Show analysis
  function showAnalysis() {
    if (golfRounds.length === 0) {
      document.getElementById('analysis-result').innerHTML = `
        <div class="insight-card info">
          <h6>ℹ️ ${msg.analysis}</h6>
          <p>${isUkrainian ? 'Додайте раунди для аналізу' : 'Add rounds for analysis'}</p>
        </div>
      `;
      return;
    }

    const scores = golfRounds.map(round => round.score);
    const differentials = golfRounds.map(round => round.differential);
    
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.min(...scores);
    const worstScore = Math.max(...scores);
    const avgDifferential = differentials.reduce((sum, diff) => sum + diff, 0) / differentials.length;

    // Calculate trend (last 5 vs previous 5)
    let trend = '';
    if (golfRounds.length >= 10) {
      const recentAvg = golfRounds.slice(0, 5).reduce((sum, round) => sum + round.differential, 0) / 5;
      const previousAvg = golfRounds.slice(5, 10).reduce((sum, round) => sum + round.differential, 0) / 5;
      
      if (recentAvg < previousAvg - 1) {
        trend = msg.improvingPlayer;
      } else if (recentAvg > previousAvg + 1) {
        trend = msg.strugglingPlayer;
      } else {
        trend = msg.stablePlayer;
      }
    }

    const html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>📊 ${msg.analysis}</h6>
          <div class="stats-grid">
            <div class="stat-item">
              <span>${msg.totalRounds}:</span>
              <span class="stat-value">${golfRounds.length}</span>
            </div>
            <div class="stat-item">
              <span>${msg.averageScore}:</span>
              <span class="stat-value">${avgScore.toFixed(1)}</span>
            </div>
            <div class="stat-item">
              <span>${msg.bestScore}:</span>
              <span class="stat-value">${bestScore}</span>
            </div>
            <div class="stat-item">
              <span>${msg.worstScore}:</span>
              <span class="stat-value">${worstScore}</span>
            </div>
            <div class="stat-item">
              <span>${msg.averageDifferential}:</span>
              <span class="stat-value">${avgDifferential.toFixed(1)}</span>
            </div>
            ${trend ? `
            <div class="stat-item">
              <span>${msg.recentTrend}:</span>
              <span class="stat-value">${trend}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    document.getElementById('analysis-result').innerHTML = html;
  }

  // Show progress
  function showProgress() {
    if (golfRounds.length === 0) {
      document.getElementById('progress-result').innerHTML = `
        <div class="insight-card info">
          <h6>ℹ️ ${msg.progress}</h6>
          <p>${isUkrainian ? 'Додайте раунди для відстеження прогресу' : 'Add rounds to track progress'}</p>
        </div>
      `;
      return;
    }

    const currentHandicap = golfRounds.length >= 5 ? calculateCurrentHandicap() : null;
    const recommendations = getRecommendations();

    const html = `
      <div class="insight-cards">
        ${currentHandicap !== null ? `
        <div class="insight-card success">
          <h6>🎯 ${isUkrainian ? 'Поточний стан' : 'Current Status'}</h6>
          <div class="progress-summary">
            <div class="current-handicap">
              <span>${msg.handicapIndex}:</span>
              <span class="big-number">${currentHandicap.toFixed(1)}</span>
            </div>
            <div class="level">${getHandicapLevel(currentHandicap)}</div>
          </div>
        </div>
        ` : ''}
        
        <div class="insight-card info">
          <h6>💡 ${msg.recommendations}</h6>
          <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    document.getElementById('progress-result').innerHTML = html;
  }

  // Calculate current handicap
  function calculateCurrentHandicap() {
    const differentials = golfRounds.map(round => round.differential).sort((a, b) => a - b);
    let usedDifferentials;
    
    if (golfRounds.length >= 20) {
      usedDifferentials = differentials.slice(0, 8);
    } else if (golfRounds.length >= 6) {
      usedDifferentials = differentials.slice(0, Math.floor(golfRounds.length * 0.4));
    } else {
      usedDifferentials = [differentials[0]];
    }

    const averageDifferential = usedDifferentials.reduce((sum, diff) => sum + diff, 0) / usedDifferentials.length;
    return averageDifferential * 0.96;
  }

  // Get recommendations
  function getRecommendations() {
    const recommendations = [];
    
    if (golfRounds.length < 20) {
      recommendations.push(isUkrainian ? 
        'Зіграйте більше раундів для точнішого розрахунку гандикапу' :
        'Play more rounds for more accurate handicap calculation');
    }

    if (golfRounds.length >= 5) {
      const handicap = calculateCurrentHandicap();
      
      if (handicap > 20) {
        recommendations.push(msg.focusOnShortGame);
        recommendations.push(msg.practiceMore);
      } else if (handicap > 10) {
        recommendations.push(msg.workOnConsistency);
      } else {
        recommendations.push(msg.keepUpGoodWork);
      }
    }

    // Analyze score consistency
    if (golfRounds.length >= 5) {
      const scores = golfRounds.slice(0, 5).map(round => round.score);
      const maxDiff = Math.max(...scores) - Math.min(...scores);
      
      if (maxDiff > 15) {
        recommendations.push(isUkrainian ? 
          'Працюйте над стабільністю гри - великий розкид результатів' :
          'Work on game consistency - large score variation');
      }
    }

    return recommendations;
  }

  // Display rounds
  function displayRounds() {
    const container = document.getElementById('rounds-container');
    
    if (golfRounds.length === 0) {
      container.innerHTML = `<p class="no-rounds">${isUkrainian ? 'Додайте раунди для розрахунку гандикапу' : 'Add rounds to calculate handicap'}</p>`;
      return;
    }

    const html = golfRounds.map(round => `
      <div class="round-item">
        <div class="round-header">
          <span class="round-course">${round.courseName}</span>
          <span class="round-date">${new Date(round.date).toLocaleDateString()}</span>
          <button class="remove-round" onclick="removeRound(${round.id})">❌</button>
        </div>
        <div class="round-details">
          <span>${isUkrainian ? 'Результат' : 'Score'}: ${round.score}</span>
          <span>CR: ${round.courseRating}</span>
          <span>SR: ${round.slopeRating}</span>
          <span class="differential">${msg.differential}: ${round.differential.toFixed(1)}</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  // Remove round (global function)
  window.removeRound = function(id) {
    golfRounds = golfRounds.filter(round => round.id !== id);
    saveRounds();
    displayRounds();
  };

  // Clear all rounds
  function clearAllRounds() {
    golfRounds = [];
    saveRounds();
    displayRounds();
    showMessage(msg.roundsCleared);
    
    // Clear results
    document.getElementById('handicap-calculation-result').innerHTML = '';
    document.getElementById('analysis-result').innerHTML = '';
    document.getElementById('progress-result').innerHTML = '';
  }

  // Save rounds to localStorage
  function saveRounds() {
    localStorage.setItem('golfRounds', JSON.stringify(golfRounds));
  }

  // Show message
  function showMessage(message) {
    // Create temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'temp-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 1000;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  // Initialize
  displayRounds();
});