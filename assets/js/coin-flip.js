document.addEventListener("DOMContentLoaded", () => {
  const coin = document.getElementById("coin");
  const flipBtn = document.getElementById("flipBtn");
  const result = document.getElementById("result");
  const headsCount = document.getElementById("headsCount");
  const tailsCount = document.getElementById("tailsCount");
  const totalCount = document.getElementById("totalCount");
  
  let stats = {
    heads: 0,
    tails: 0,
    total: 0
  };
  
  // Load stats from localStorage
  loadStats();
  
  // Flip button event listener
  flipBtn.addEventListener("click", flipCoin);
  
  // Coin click event listener for additional interactivity
  coin.addEventListener("click", () => {
    if (!flipBtn.disabled) {
      flipCoin();
    }
  });
  
  function flipCoin() {
    // Disable button during animation
    flipBtn.disabled = true;
    flipBtn.querySelector('.button-text').textContent = "Підкидаємо...";
    
    // Reset previous classes
    coin.classList.remove("heads-result", "tails-result", "flipping");
    result.classList.remove("heads", "tails");
    
    // Generate random result (true = heads, false = tails)
    const isHeads = Math.random() < 0.5;
    
    // Add flipping animation
    coin.classList.add("flipping");
    
    // Show intermediate result
    result.innerHTML = `
      <p style="color: var(--accent); font-weight: bold;">
        🪙 Монета в повітрі...
      </p>
    `;
    
    // After animation completes
    setTimeout(() => {
      // Remove flipping class and add result class
      coin.classList.remove("flipping");
      coin.classList.add(isHeads ? "heads-result" : "tails-result");
      
      // Update result display
      const resultText = isHeads ? "ОРЕЛ" : "РЕШКА";
      const resultEmoji = isHeads ? "🦅" : "🛡️";
      const resultClass = isHeads ? "heads" : "tails";
      
      result.classList.add(resultClass);
      result.innerHTML = `
        <p>
          ${resultEmoji} <strong>${resultText}</strong> ${resultEmoji}
        </p>
        <small>Натисніть знову, щоб підкинути ще раз</small>
      `;
      
      // Update statistics
      updateStats(isHeads);
      
      // Add celebration effect for interesting streaks
      if (isStreakMoment()) {
        addCelebrationEffect();
      }
      
      // Re-enable button
      flipBtn.disabled = false;
      flipBtn.querySelector('.button-text').textContent = "Підкинути знову";
      
    }, 2000); // Match animation duration
  }
  
  function updateStats(isHeads) {
    if (isHeads) {
      stats.heads++;
    } else {
      stats.tails++;
    }
    stats.total++;
    
    // Update display
    headsCount.textContent = stats.heads;
    tailsCount.textContent = stats.tails;
    totalCount.textContent = stats.total;
    
    // Save to localStorage
    saveStats();
    
    // Update percentages if total > 0
    if (stats.total > 0) {
      const headsPercent = ((stats.heads / stats.total) * 100).toFixed(1);
      const tailsPercent = ((stats.tails / stats.total) * 100).toFixed(1);
      
      headsCount.title = `${headsPercent}%`;
      tailsCount.title = `${tailsPercent}%`;
    }
  }
  
  function loadStats() {
    try {
      const savedStats = localStorage.getItem('coinFlipStats');
      if (savedStats) {
        stats = JSON.parse(savedStats);
        headsCount.textContent = stats.heads;
        tailsCount.textContent = stats.tails;
        totalCount.textContent = stats.total;
      }
    } catch (error) {
      console.log('Failed to load stats:', error);
    }
  }
  
  function saveStats() {
    try {
      localStorage.setItem('coinFlipStats', JSON.stringify(stats));
    } catch (error) {
      console.log('Failed to save stats:', error);
    }
  }
  
  function isStreakMoment() {
    // Check for interesting moments (every 10th flip, equal counts, etc.)
    return stats.total % 10 === 0 || stats.heads === stats.tails;
  }
  
  function addCelebrationEffect() {
    // Add a subtle celebration effect
    const container = document.querySelector('.coin-flip-container');
    container.style.animation = 'celebrate 0.6s ease-in-out';
    
    setTimeout(() => {
      container.style.animation = '';
    }, 600);
  }
  
  // Add reset stats functionality (hidden feature - double click on total)
  totalCount.addEventListener('dblclick', () => {
    resetStats();
  });
  
  // Add reset button functionality (new visible button)
  const resetStatsBtn = document.getElementById('resetStatsBtn');
  if (resetStatsBtn) {
    resetStatsBtn.addEventListener('click', resetStats);
  }
  
  function resetStats() {
    if (confirm('Скинути всю статистику підкидань?')) {
      stats = { heads: 0, tails: 0, total: 0 };
      headsCount.textContent = '0';
      tailsCount.textContent = '0';
      totalCount.textContent = '0';
      saveStats();
      
      // Show confirmation
      result.innerHTML = `
        <p style="color: var(--accent);">
          📊 Статистика скинута
        </p>
      `;
      result.classList.remove("heads", "tails");
    }
  }
  
  // Add keyboard support
  document.addEventListener('keydown', (event) => {
    // Space or Enter to flip
    if ((event.code === 'Space' || event.code === 'Enter') && !flipBtn.disabled) {
      event.preventDefault();
      flipCoin();
    }
  });
  
  // Add some interactive hover effects
  coin.addEventListener('mouseenter', () => {
    if (!coin.classList.contains('flipping')) {
      coin.style.transform += ' scale(1.05)';
    }
  });
  
  coin.addEventListener('mouseleave', () => {
    if (!coin.classList.contains('flipping')) {
      coin.style.transform = coin.style.transform.replace(' scale(1.05)', '');
    }
  });
});

// Add celebration animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes celebrate {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  .coin-flip-container {
    position: relative;
  }
  
  /* Add subtle glow effect for better visual feedback */
  .coin:hover {
    filter: drop-shadow(0 0 10px rgba(21, 122, 255, 0.3));
    transition: filter 0.3s ease;
  }
  
  /* Improve accessibility */
  .flip-button:focus {
    outline: 3px solid rgba(21, 122, 255, 0.4);
    outline-offset: 2px;
  }
  
  /* Loading state for better UX */
  .flip-button:disabled .button-icon {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);