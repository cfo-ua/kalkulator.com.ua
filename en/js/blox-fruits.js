document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bloxfruits-form");
  const result = document.getElementById("bloxfruits-result");

  // Experience table for Blox Fruits levels (simplified calculation)
  function getRequiredExp(level) {
    if (level <= 1) return 0;
    // Exponential growth formula similar to Blox Fruits
    return Math.floor(100 * Math.pow(level, 2.2));
  }

  function getTotalExpForLevel(level) {
    let total = 0;
    for (let i = 1; i <= level; i++) {
      total += getRequiredExp(i);
    }
    return total;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentLevel = parseInt(document.getElementById("current-level").value);
    const targetLevel = parseInt(document.getElementById("target-level").value);
    const currentExp = parseInt(document.getElementById("current-exp").value);
    const buildType = document.getElementById("build-type").value;

    // Get current stat points
    const meleePoints = parseInt(document.getElementById("melee-points").value);
    const defensePoints = parseInt(document.getElementById("defense-points").value);
    const swordPoints = parseInt(document.getElementById("sword-points").value);
    const gunPoints = parseInt(document.getElementById("gun-points").value);
    const fruitPoints = parseInt(document.getElementById("fruit-points").value);

    if (currentLevel < 1 || targetLevel < 1 || currentLevel > 2550 || targetLevel > 2550) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Error</h6>
        <p>Level must be between 1 and 2550.</p>
      </div>`;
      return;
    }

    if (targetLevel <= currentLevel) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Error</h6>
        <p>Target level must be higher than current level.</p>
      </div>`;
      return;
    }

    // Calculate stats
    const currentAvailablePoints = (currentLevel - 1) * 3;
    const usedPoints = meleePoints + defensePoints + swordPoints + gunPoints + fruitPoints;
    const unusedPoints = Math.max(0, currentAvailablePoints - usedPoints);
    
    const targetAvailablePoints = (targetLevel - 1) * 3;
    const newPointsToDistribute = targetAvailablePoints - currentAvailablePoints;

    // Calculate experience needed
    const currentLevelTotalExp = getTotalExpForLevel(currentLevel);
    const targetLevelTotalExp = getTotalExpForLevel(targetLevel);
    const expInCurrentLevel = currentExp;
    const totalCurrentExp = currentLevelTotalExp + expInCurrentLevel;
    const expNeeded = targetLevelTotalExp - totalCurrentExp;

    // Generate build recommendations
    const buildRecommendation = generateBuildRecommendation(buildType, targetLevel, newPointsToDistribute);

    // Calculate farming time estimates
    const farmingEstimates = calculateFarmingTime(expNeeded);

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>📈 Level Progress</h6>
          <div class="big-number">${currentLevel} → ${targetLevel}</div>
          <p>+${targetLevel - currentLevel} levels</p>
        </div>
        
        <div class="insight-card info">
          <h6>✨ New Stat Points</h6>
          <div class="big-number">${newPointsToDistribute}</div>
          <p>+3 points per level</p>
        </div>
        
        <div class="insight-card ${expNeeded > 10000000 ? 'warning' : 'success'}">
          <h6>📊 Experience Needed</h6>
          <div class="big-number">${formatNumber(expNeeded)}</div>
          <p>to level ${targetLevel}</p>
        </div>
      </div>

      <div class="insight-card">
        <h6>📋 Current Stats</h6>
        <div style="text-align: left;">
          <div class="stat-bar">
            <span>🗡️ Melee: <strong>${meleePoints}</strong></span>
            <div class="progress-bar">
              <div class="progress" style="width: ${(meleePoints / Math.max(1, Math.max(meleePoints, defensePoints, swordPoints, gunPoints, fruitPoints))) * 100}%"></div>
            </div>
          </div>
          <div class="stat-bar">
            <span>🛡️ Defense: <strong>${defensePoints}</strong></span>
            <div class="progress-bar">
              <div class="progress" style="width: ${(defensePoints / Math.max(1, Math.max(meleePoints, defensePoints, swordPoints, gunPoints, fruitPoints))) * 100}%"></div>
            </div>
          </div>
          <div class="stat-bar">
            <span>⚔️ Sword: <strong>${swordPoints}</strong></span>
            <div class="progress-bar">
              <div class="progress" style="width: ${(swordPoints / Math.max(1, Math.max(meleePoints, defensePoints, swordPoints, gunPoints, fruitPoints))) * 100}%"></div>
            </div>
          </div>
          <div class="stat-bar">
            <span>🔫 Gun: <strong>${gunPoints}</strong></span>
            <div class="progress-bar">
              <div class="progress" style="width: ${(gunPoints / Math.max(1, Math.max(meleePoints, defensePoints, swordPoints, gunPoints, fruitPoints))) * 100}%"></div>
            </div>
          </div>
          <div class="stat-bar">
            <span>✨ Blox Fruit: <strong>${fruitPoints}</strong></span>
            <div class="progress-bar">
              <div class="progress" style="width: ${(fruitPoints / Math.max(1, Math.max(meleePoints, defensePoints, swordPoints, gunPoints, fruitPoints))) * 100}%"></div>
            </div>
          </div>
          <p style="margin-top: 1rem;"><strong>Points Used:</strong> ${usedPoints}/${currentAvailablePoints} 
          ${unusedPoints > 0 ? `<br><span style="color: orange;">⚠️ Unused Points: ${unusedPoints}</span>` : ''}</p>
        </div>
      </div>

      ${buildRecommendation}

      <div class="insight-card">
        <h6>⏱️ Farming Time Estimates</h6>
        ${farmingEstimates}
      </div>

      <div class="insight-card info">
        <h6>💡 Leveling Tips</h6>
        <ul style="text-align: left; margin: 1rem 0;">
          <li>🎯 Focus on 1-2 main stats for efficiency</li>
          <li>🛡️ Always invest in Defense for survivability</li>
          <li>👥 Farm with friends or crew for faster progress</li>
          <li>🏆 Complete NPC quests for bonus experience</li>
          <li>🔥 Fight bosses and participate in raids</li>
          <li>💎 Use 2x EXP codes and gamepasses when available</li>
        </ul>
      </div>
    `;

    // Add CSS for progress bars if not already added
    if (!document.getElementById('blox-fruits-styles')) {
      const style = document.createElement('style');
      style.id = 'blox-fruits-styles';
      style.textContent = `
        .stat-bar {
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .stat-bar span {
          min-width: 150px;
        }
        .progress-bar {
          flex: 1;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background: linear-gradient(90deg, var(--accent) 0%, #28a745 100%);
          border-radius: 10px;
          transition: width 0.3s ease;
        }
      `;
      document.head.appendChild(style);
    }
  });

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  }

  function generateBuildRecommendation(buildType, targetLevel, newPoints) {
    if (!buildType) {
      return `<div class="insight-card warning">
        <h6>⚠️ Choose Build Type</h6>
        <p>Select a recommended build type to get stat point allocation advice.</p>
      </div>`;
    }

    const builds = {
      'fruit-main': {
        name: 'Fruit Main',
        icon: '✨',
        primary: 'Blox Fruit',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Perfect for magical attacks and Devil Fruit abilities'
      },
      'sword-main': {
        name: 'Sword Main',
        icon: '⚔️',
        primary: 'Sword',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Excellent choice for close combat with swords'
      },
      'gun-main': {
        name: 'Gun Main',
        icon: '🔫',
        primary: 'Gun',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Effective for ranged attacks and sniping'
      },
      'melee-main': {
        name: 'Melee Main',
        icon: '🗡️',
        primary: 'Melee',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Powerful hand-to-hand combat and fighting styles'
      },
      'hybrid-fruit-sword': {
        name: 'Hybrid (Fruit + Sword)',
        icon: '🔮⚔️',
        primary: 'Blox Fruit',
        secondary: 'Sword',
        ratio: '50/30/20',
        description: 'Versatile build for different situations'
      },
      'hybrid-fruit-gun': {
        name: 'Hybrid (Fruit + Gun)',
        icon: '✨🔫',
        primary: 'Blox Fruit',
        secondary: 'Gun',
        ratio: '50/30/20',
        description: 'Combination of magic and firearms'
      },
      'balanced': {
        name: 'Balanced',
        icon: '⚖️',
        primary: 'All Stats',
        secondary: 'Evenly',
        ratio: '20/20/20/20/20',
        description: 'Universal character for all playstyles'
      }
    };

    const build = builds[buildType];
    const primaryPoints = Math.floor(newPoints * 0.7);
    const secondaryPoints = Math.floor(newPoints * 0.3);

    return `
      <div class="insight-card success">
        <h6>${build.icon} Recommendations for "${build.name}" Build</h6>
        <div style="text-align: left;">
          <p><strong>Description:</strong> ${build.description}</p>
          <p><strong>Distribution of new ${newPoints} points:</strong></p>
          <ul>
            <li><strong>Primary stat (${build.primary}):</strong> ${primaryPoints} points</li>
            <li><strong>Secondary stat (${build.secondary}):</strong> ${secondaryPoints} points</li>
            ${newPoints - primaryPoints - secondaryPoints > 0 ? `<li><strong>Remaining:</strong> ${newPoints - primaryPoints - secondaryPoints} points (distribute as needed)</li>` : ''}
          </ul>
          <p><em>💡 Remember: Defense is always important for survival!</em></p>
        </div>
      </div>
    `;
  }

  function calculateFarmingTime(expNeeded) {
    const farmingMethods = [
      { name: 'Quests (Beginner)', expPerHour: 50000, icon: '📝' },
      { name: 'Mob Farming (Medium)', expPerHour: 150000, icon: '⚔️' },
      { name: 'Bosses + Quests', expPerHour: 300000, icon: '🏆' },
      { name: 'Raids + 2x EXP', expPerHour: 500000, icon: '🔥' },
      { name: 'Optimal Farming', expPerHour: 750000, icon: '💎' }
    ];

    let estimates = "<div style='text-align: left;'>";
    
    farmingMethods.forEach(method => {
      const hours = Math.ceil(expNeeded / method.expPerHour);
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      
      let timeText;
      if (days > 0) {
        timeText = `${days}d ${remainingHours}h`;
      } else {
        timeText = `${hours}h`;
      }
      
      estimates += `<div style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 8px;">`;
      estimates += `<strong>${method.icon} ${method.name}:</strong> ~${timeText}`;
      estimates += `<br><small style="color: #666;">${formatNumber(method.expPerHour)} exp/hour</small>`;
      estimates += `</div>`;
    });
    
    estimates += "</div>";
    return estimates;
  }
});