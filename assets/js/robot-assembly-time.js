document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("robot-assembly-form");
  if (!form) return;

  // Base time constants (in hours)
  const BASE_TIMES = {
    mobile: 8,
    manipulator: 12,
    humanoid: 20,
    industrial: 16,
    drone: 6,
    educational: 4
  };

  // Complexity multipliers
  const COMPLEXITY_MULTIPLIERS = {
    basic: 1.0,
    intermediate: 1.5,
    advanced: 2.2,
    expert: 3.5
  };

  // Experience multipliers (higher = more time needed)
  const EXPERIENCE_MULTIPLIERS = {
    beginner: 2.5,
    intermediate: 1.5,
    advanced: 1.0,
    expert: 0.8
  };

  // Programming time additions (hours)
  const PROGRAMMING_TIME = {
    none: 0,
    basic: 4,
    intermediate: 12,
    advanced: 24
  };

  // Testing time multipliers
  const TESTING_MULTIPLIERS = {
    minimal: 0.1,
    standard: 0.3,
    extensive: 0.6
  };

  function calculateAssemblyTime() {
    const robotType = document.getElementById("robot-type").value;
    const complexity = document.getElementById("complexity").value;
    const components = parseInt(document.getElementById("components").value);
    const experience = document.getElementById("experience").value;
    const teamSize = parseInt(document.getElementById("team-size").value);
    const programming = document.getElementById("programming").value;
    const testing = document.getElementById("testing").value;
    
    // Additional options
    const includeDocumentation = document.getElementById("documentation").checked;
    const customParts = document.getElementById("custom-parts").checked;
    const integration = document.getElementById("integration").checked;

    // Base calculation
    let baseTime = BASE_TIMES[robotType];
    
    // Apply complexity
    baseTime *= COMPLEXITY_MULTIPLIERS[complexity];
    
    // Component scaling (logarithmic scale to prevent unrealistic times)
    const componentFactor = 1 + (Math.log(components / 10) * 0.3);
    baseTime *= componentFactor;
    
    // Apply experience factor
    baseTime *= EXPERIENCE_MULTIPLIERS[experience];
    
    // Add programming time
    baseTime += PROGRAMMING_TIME[programming];
    
    // Add testing time
    const testingTime = baseTime * TESTING_MULTIPLIERS[testing];
    baseTime += testingTime;
    
    // Additional time factors
    if (includeDocumentation) {
      baseTime += baseTime * 0.15; // 15% extra for documentation
    }
    
    if (customParts) {
      baseTime += baseTime * 0.25; // 25% extra for custom parts
    }
    
    if (integration) {
      baseTime += baseTime * 0.20; // 20% extra for integration
    }
    
    // Team size optimization (diminishing returns)
    const teamEfficiency = teamSize > 1 ? (1 + (teamSize - 1) * 0.6) : 1;
    const totalTime = baseTime / teamEfficiency;
    
    // Add buffer time based on complexity and experience (5-25%)
    let bufferMultiplier = 0.05;
    if (complexity === 'advanced') bufferMultiplier = 0.15;
    if (complexity === 'expert') bufferMultiplier = 0.25;
    if (experience === 'beginner') bufferMultiplier += 0.10;
    
    const bufferTime = totalTime * bufferMultiplier;
    const finalTime = totalTime + bufferTime;
    
    return {
      baseTime: totalTime,
      bufferTime: bufferTime,
      totalTime: finalTime,
      programmingTime: PROGRAMMING_TIME[programming],
      testingTime: testingTime,
      teamEfficiency: teamEfficiency
    };
  }

  function formatTime(hours) {
    const days = Math.floor(hours / 8);
    const remainingHours = Math.round(hours % 8);
    
    if (days > 0) {
      return `${days} ${days === 1 ? 'день' : 'днів'}${remainingHours > 0 ? ` ${remainingHours} год` : ''}`;
    } else {
      return `${Math.round(hours)} год`;
    }
  }

  function formatTimeEN(hours) {
    const days = Math.floor(hours / 8);
    const remainingHours = Math.round(hours % 8);
    
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`;
    } else {
      return `${Math.round(hours)}h`;
    }
  }

  function getComplexityEmoji(complexity) {
    const emojis = {
      basic: '🟢',
      intermediate: '🟡', 
      advanced: '🟠',
      expert: '🔴'
    };
    return emojis[complexity] || '⚪';
  }

  function displayResults(results) {
    const isEnglish = window.location.pathname.includes('/en/');
    const formatTimeFunc = isEnglish ? formatTimeEN : formatTime;
    
    const complexity = document.getElementById("complexity").value;
    const robotType = document.getElementById("robot-type").value;
    const teamSize = parseInt(document.getElementById("team-size").value);
    
    const robotTypeLabels = isEnglish ? {
      mobile: 'Mobile Robot',
      manipulator: 'Robot Manipulator', 
      humanoid: 'Humanoid Robot',
      industrial: 'Industrial Robot',
      drone: 'Drone/UAV',
      educational: 'Educational Kit'
    } : {
      mobile: 'Мобільний робот',
      manipulator: 'Робот-маніпулятор',
      humanoid: 'Гуманоїдний робот', 
      industrial: 'Промисловий робот',
      drone: 'Дрон/БПЛА',
      educational: 'Навчальний набір'
    };

    const complexityLabels = isEnglish ? {
      basic: 'Basic',
      intermediate: 'Intermediate',
      advanced: 'Advanced', 
      expert: 'Expert'
    } : {
      basic: 'Базовий',
      intermediate: 'Середній',
      advanced: 'Складний',
      expert: 'Експертний'
    };

    const resultHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>⏱️ ${isEnglish ? 'Total Assembly Time' : 'Загальний час збирання'}</h6>
          <div class="big-number">${formatTimeFunc(results.totalTime)}</div>
          <p>${isEnglish ? 'Including buffer time' : 'Включаючи буферний час'}</p>
        </div>
        
        <div class="insight-card success">
          <h6>👥 ${isEnglish ? 'Time per Team Member' : 'Час на одного учасника'}</h6>
          <div class="big-number">${formatTimeFunc(results.totalTime / teamSize)}</div>
          <p>${isEnglish ? `For ${teamSize} team member${teamSize > 1 ? 's' : ''}` : `Для команди з ${teamSize} осіб`}</p>
        </div>
        
        <div class="insight-card warning">
          <h6>${getComplexityEmoji(complexity)} ${isEnglish ? 'Project Complexity' : 'Складність проекту'}</h6>
          <div class="big-number">${complexityLabels[complexity]}</div>
          <p>${robotTypeLabels[robotType]}</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 ${isEnglish ? 'Time Breakdown' : 'Розподіл часу'}</h4>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius); margin: 1rem 0;">
          <div style="display: grid; gap: 0.8rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
              <span><strong>🔧 ${isEnglish ? 'Core Assembly' : 'Основне збирання'}</strong></span>
              <span><strong>${formatTimeFunc(results.baseTime)}</strong></span>
            </div>
            ${results.programmingTime > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>💻 ${isEnglish ? 'Programming' : 'Програмування'}</span>
              <span>${formatTimeFunc(results.programmingTime)}</span>
            </div>
            ` : ''}
            ${results.testingTime > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>🧪 ${isEnglish ? 'Testing' : 'Тестування'}</span>
              <span>${formatTimeFunc(results.testingTime)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>⏰ ${isEnglish ? 'Buffer Time' : 'Буферний час'}</span>
              <span>${formatTimeFunc(results.bufferTime)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 2px solid var(--accent); font-weight: bold; color: var(--accent);">
              <span>${isEnglish ? 'Total Estimated Time' : 'Загальний розрахунковий час'}</span>
              <span>${formatTimeFunc(results.totalTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%); border-radius: var(--radius); border: 1px solid var(--accent);">
        <h5>💡 ${isEnglish ? 'Planning Tips' : 'Поради для планування'}</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
          ${teamSize > 3 ? `<li>⚠️ ${isEnglish ? 'Large teams may need coordination overhead' : 'Великі команди можуть потребувати додатковий час на координацію'}</li>` : ''}
          ${complexity === 'expert' ? `<li>🎯 ${isEnglish ? 'Consider prototype testing before full assembly' : 'Розгляньте можливість тестування прототипу перед повним збиранням'}</li>` : ''}
          ${results.totalTime > 80 ? `<li>📅 ${isEnglish ? 'Consider breaking into smaller milestones' : 'Розгляньте можливість розбиття на менші етапи'}</li>` : ''}
          <li>🔄 ${isEnglish ? 'Add 10-20% extra time for first-time builds' : 'Додайте 10-20% часу для першої збірки'}</li>
        </ul>
      </div>
    `;

    document.getElementById("assembly-result").innerHTML = resultHTML;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const results = calculateAssemblyTime();
    displayResults(results);
    
    // Scroll to results
    document.getElementById("assembly-result").scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  });
});