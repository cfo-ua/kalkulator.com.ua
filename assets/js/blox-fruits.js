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
        <h6>⚠️ Помилка</h6>
        <p>Рівень має бути від 1 до 2550.</p>
      </div>`;
      return;
    }

    if (targetLevel <= currentLevel) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Помилка</h6>
        <p>Цільовий рівень має бути вищим за поточний.</p>
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
          <h6>📈 Прогрес рівня</h6>
          <div class="big-number">${currentLevel} → ${targetLevel}</div>
          <p>+${targetLevel - currentLevel} рівнів</p>
        </div>
        
        <div class="insight-card info">
          <h6>✨ Нові очки статистик</h6>
          <div class="big-number">${newPointsToDistribute}</div>
          <p>+3 очки за рівень</p>
        </div>
        
        <div class="insight-card ${expNeeded > 10000000 ? 'warning' : 'success'}">
          <h6>📊 Потрібний досвід</h6>
          <div class="big-number">${formatNumber(expNeeded)}</div>
          <p>до рівня ${targetLevel}</p>
        </div>
      </div>

      <div class="insight-card">
        <h6>📋 Поточні статистики</h6>
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
          <p style="margin-top: 1rem;"><strong>Використано очок:</strong> ${usedPoints}/${currentAvailablePoints} 
          ${unusedPoints > 0 ? `<br><span style="color: orange;">⚠️ Невикористані очки: ${unusedPoints}</span>` : ''}</p>
        </div>
      </div>

      ${buildRecommendation}

      <div class="insight-card">
        <h6>⏱️ Оцінка часу фармінгу</h6>
        ${farmingEstimates}
      </div>

      <div class="insight-card info">
        <h6>💡 Поради для прокачки</h6>
        <ul style="text-align: left; margin: 1rem 0;">
          <li>🎯 Фокусуйтеся на 1-2 головних статистиках</li>
          <li>🛡️ Завжди вкладайте очки в Defense для виживання</li>
          <li>👥 Фармте з друзями або командою для швидшого прогресу</li>
          <li>🏆 Виконуйте квести NPC для бонусного досвіду</li>
          <li>🔥 Бійтеся з боссами та беріть участь у рейдах</li>
          <li>💎 Використовуйте 2x EXP коди та геймпаси</li>
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
        <h6>⚠️ Оберіть тип білду</h6>
        <p>Виберіть рекомендований тип білду для отримання порад по розподілу очок.</p>
      </div>`;
    }

    const builds = {
      'fruit-main': {
        name: 'Fruit Main',
        icon: '✨',
        primary: 'Blox Fruit',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Ідеально для магічних атак та здібностей фруктів'
      },
      'sword-main': {
        name: 'Sword Main',
        icon: '⚔️',
        primary: 'Sword',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Чудовий вибір для ближнього бою з мечами'
      },
      'gun-main': {
        name: 'Gun Main',
        icon: '🔫',
        primary: 'Gun',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Ефективний для дальніх атак та снайпінгу'
      },
      'melee-main': {
        name: 'Melee Main',
        icon: '🗡️',
        primary: 'Melee',
        secondary: 'Defense',
        ratio: '70/30',
        description: 'Потужний рукопашний бій та боєві мистецтва'
      },
      'hybrid-fruit-sword': {
        name: 'Hybrid (Фрукт + Мечі)',
        icon: '🔮⚔️',
        primary: 'Blox Fruit',
        secondary: 'Sword',
        ratio: '50/30/20',
        description: 'Універсальний білд для різних ситуацій'
      },
      'hybrid-fruit-gun': {
        name: 'Hybrid (Фрукт + Стрільба)',
        icon: '✨🔫',
        primary: 'Blox Fruit',
        secondary: 'Gun',
        ratio: '50/30/20',
        description: 'Комбінація магії та вогнепальної зброї'
      },
      'balanced': {
        name: 'Збалансований',
        icon: '⚖️',
        primary: 'Всі статистики',
        secondary: 'Рівномірно',
        ratio: '20/20/20/20/20',
        description: 'Універсальний персонаж для всіх стилів гри'
      }
    };

    const build = builds[buildType];
    const primaryPoints = Math.floor(newPoints * 0.7);
    const secondaryPoints = Math.floor(newPoints * 0.3);

    return `
      <div class="insight-card success">
        <h6>${build.icon} Рекомендації для білду "${build.name}"</h6>
        <div style="text-align: left;">
          <p><strong>Опис:</strong> ${build.description}</p>
          <p><strong>Розподіл нових ${newPoints} очок:</strong></p>
          <ul>
            <li><strong>Головна статистика (${build.primary}):</strong> ${primaryPoints} очок</li>
            <li><strong>Другорядна статистика (${build.secondary}):</strong> ${secondaryPoints} очок</li>
            ${newPoints - primaryPoints - secondaryPoints > 0 ? `<li><strong>Залишок:</strong> ${newPoints - primaryPoints - secondaryPoints} очок (розподіліть на розсуд)</li>` : ''}
          </ul>
          <p><em>💡 Пам'ятайте: Defense завжди важливий для виживання!</em></p>
        </div>
      </div>
    `;
  }

  function calculateFarmingTime(expNeeded) {
    const farmingMethods = [
      { name: 'Квести (новачок)', expPerHour: 50000, icon: '📝' },
      { name: 'Фарм мобів (середній)', expPerHour: 150000, icon: '⚔️' },
      { name: 'Боси + квести', expPerHour: 300000, icon: '🏆' },
      { name: 'Рейди + 2x EXP', expPerHour: 500000, icon: '🔥' },
      { name: 'Оптимальний фарм', expPerHour: 750000, icon: '💎' }
    ];

    let estimates = "<div style='text-align: left;'>";
    
    farmingMethods.forEach(method => {
      const hours = Math.ceil(expNeeded / method.expPerHour);
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      
      let timeText;
      if (days > 0) {
        timeText = `${days} д. ${remainingHours} год.`;
      } else {
        timeText = `${hours} год.`;
      }
      
      estimates += `<div style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 8px;">`;
      estimates += `<strong>${method.icon} ${method.name}:</strong> ~${timeText}`;
      estimates += `<br><small style="color: #666;">${formatNumber(method.expPerHour)} досвіду/год</small>`;
      estimates += `</div>`;
    });
    
    estimates += "</div>";
    return estimates;
  }
});