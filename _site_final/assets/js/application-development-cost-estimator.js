document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('development-cost-form');
  const result = document.getElementById('development-cost-result');

  // Setup range slider
  setupRangeSlider('contingency', 'contingency-display', '%');

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateDevelopmentCost();
    });
  }

  function setupRangeSlider(sliderId, displayId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      slider.addEventListener('input', function() {
        display.textContent = this.value + suffix;
      });
    }
  }

  function calculateDevelopmentCost() {
    // Get form values
    const appType = document.getElementById('app-type').value;
    const complexity = document.getElementById('complexity').value;
    const platforms = parseInt(document.getElementById('platforms').value);
    const userBase = document.getElementById('user-base').value;
    const designComplexity = document.getElementById('design-complexity').value;
    const screenCount = parseInt(document.getElementById('screen-count').value);
    const teamLocation = document.getElementById('team-location').value;
    const teamSize = document.getElementById('team-size').value;
    const devApproach = document.getElementById('dev-approach').value;
    const pmLevel = document.getElementById('pm-level').value;
    const timeline = document.getElementById('timeline').value;
    const qaLevel = document.getElementById('qa-level').value;
    const dataStorage = document.getElementById('data-storage').value;
    const contingency = parseFloat(document.getElementById('contingency').value) / 100;

    // Get feature selections
    const features = getSelectedFeatures();
    const additionalServices = getAdditionalServices();

    // Validate required fields
    if (!appType || !complexity || !platforms || !designComplexity || !teamLocation || !timeline) {
      result.innerHTML = '<div class="error">Будь ласка, заповніть всі обов\'язкові поля.</div>';
      return;
    }

    // Calculate base effort in person-weeks
    const baseEffort = calculateBaseEffort(appType, complexity, screenCount, features, dataStorage);
    
    // Apply platform multiplier
    const platformMultiplier = calculatePlatformMultiplier(appType, platforms);
    const totalEffort = Math.round(baseEffort * platformMultiplier);

    // Calculate design effort
    const designEffort = calculateDesignEffort(designComplexity, screenCount, features);

    // Calculate total development effort
    const totalDevelopmentEffort = totalEffort + designEffort;

    // Calculate team costs based on location
    const teamCosts = calculateTeamCosts(totalDevelopmentEffort, teamLocation, teamSize);

    // Apply timeline adjustments
    const timelineAdjustment = getTimelineAdjustment(timeline);
    const adjustedCosts = Math.round(teamCosts * timelineAdjustment.costMultiplier);

    // Calculate additional service costs
    const serviceCosts = calculateAdditionalServiceCosts(adjustedCosts, additionalServices);

    // Calculate base cost
    const baseCost = adjustedCosts + serviceCosts;

    // Apply contingency
    const finalCost = Math.round(baseCost * (1 + contingency));

    // Calculate timeline
    const projectTimeline = calculateTimeline(totalDevelopmentEffort, teamSize, timelineAdjustment.timeMultiplier);

    // Display results
    displayResults({
      appType,
      complexity,
      platforms,
      designComplexity,
      features,
      additionalServices,
      baseEffort,
      totalEffort,
      designEffort,
      totalDevelopmentEffort,
      teamCosts,
      adjustedCosts,
      serviceCosts,
      baseCost,
      finalCost,
      contingency,
      projectTimeline,
      teamLocation,
      teamSize,
      timelineAdjustment
    });
  }

  function getSelectedFeatures() {
    const coreFeatures = [
      'user-auth', 'user-profiles', 'notifications', 'search', 
      'payments', 'analytics', 'api-integration', 'file-upload'
    ];
    
    const advancedFeatures = [
      'ai-ml', 'video-processing', 'geolocation', 'social-login',
      'multi-language', 'admin-panel', 'reporting', 'chat', 'realtime', 'offline'
    ];

    const coreSelected = coreFeatures.filter(id => {
      const el = document.querySelector(`input[value="${id}"]`);
      return el && el.checked;
    });

    const advancedSelected = advancedFeatures.filter(id => {
      const el = document.querySelector(`input[value="${id}"]`);
      return el && el.checked;
    });

    return {
      core: coreSelected.length,
      advanced: advancedSelected.length,
      total: coreSelected.length + advancedSelected.length,
      list: [...coreSelected, ...advancedSelected]
    };
  }

  function getAdditionalServices() {
    const serviceElements = [
      'brand-design', 'marketing-site', 'app-store', 
      'documentation', 'training', 'maintenance'
    ];

    const selected = serviceElements.filter(id => {
      const el = document.querySelector(`input[value="${id}"]`);
      return el && el.checked;
    });

    return {
      services: selected,
      count: selected.length
    };
  }

  function calculateBaseEffort(appType, complexity, screenCount, features, dataStorage) {
    // Base effort in person-weeks
    const baseEfforts = {
      'mobile-native': { simple: 12, moderate: 24, complex: 48, enterprise: 96 },
      'mobile-cross': { simple: 10, moderate: 20, complex: 40, enterprise: 80 },
      'web-app': { simple: 8, moderate: 16, complex: 32, enterprise: 64 },
      'desktop': { simple: 10, moderate: 20, complex: 40, enterprise: 80 },
      'enterprise': { simple: 20, moderate: 40, complex: 80, enterprise: 160 },
      'saas': { simple: 16, moderate: 32, complex: 64, enterprise: 128 },
      'ecommerce': { simple: 14, moderate: 28, complex: 56, enterprise: 112 },
      'cms': { simple: 12, moderate: 24, complex: 48, enterprise: 96 }
    };

    let baseEffort = baseEfforts[appType][complexity];

    // Screen count adjustment (baseline: 15 screens)
    const screenMultiplier = Math.max(0.5, screenCount / 15);
    baseEffort *= screenMultiplier;

    // Feature complexity adjustment
    const featureMultiplier = 1 + (features.core * 0.1) + (features.advanced * 0.25);
    baseEffort *= featureMultiplier;

    // Data storage complexity
    const storageMultipliers = {
      'simple': 1.0,
      'cloud': 1.2,
      'enterprise': 1.5,
      'distributed': 2.0
    };
    baseEffort *= storageMultipliers[dataStorage] || 1.0;

    return Math.round(baseEffort);
  }

  function calculatePlatformMultiplier(appType, platforms) {
    if (appType.includes('mobile') && platforms > 1) {
      // Mobile apps: additional platforms cost less than full development
      return 1 + (platforms - 1) * 0.6; // 60% cost for each additional platform
    } else if (appType === 'web-app' && platforms > 1) {
      // Web apps: responsive design covers multiple screen sizes
      return 1 + (platforms - 1) * 0.3; // 30% cost for each additional platform
    }
    return 1.0;
  }

  function calculateDesignEffort(designComplexity, screenCount, features) {
    const designBaseEfforts = {
      'basic': 2,
      'custom': 8,
      'advanced': 16,
      'premium': 24
    };

    let designEffort = designBaseEfforts[designComplexity] || 4;
    
    // Screen count impact on design
    const screenMultiplier = Math.max(0.5, screenCount / 15);
    designEffort *= screenMultiplier;

    // Complex features require more design work
    if (features.advanced > 3) {
      designEffort *= 1.3;
    }

    return Math.round(designEffort);
  }

  function calculateTeamCosts(totalEffort, teamLocation, teamSize) {
    // Hourly rates by location (weighted average for mixed team)
    const hourlyRates = {
      'onshore': 120,    // US/Western Europe
      'nearshore': 55,   // Eastern Europe
      'offshore': 30,    // Asia/India
      'hybrid': 75       // Mixed team
    };

    const rate = hourlyRates[teamLocation] || 55;
    
    // 40 hours per week standard
    const totalHours = totalEffort * 40;
    
    // Team size affects efficiency and coordination overhead
    const teamSizeMultipliers = {
      'small': 1.0,      // 2-4 developers, minimal overhead
      'medium': 1.1,     // 5-8 developers, some coordination overhead
      'large': 1.25,     // 9-15 developers, significant coordination
      'enterprise': 1.4  // 15+ developers, high coordination overhead
    };

    const multiplier = teamSizeMultipliers[teamSize] || 1.1;
    
    return Math.round(totalHours * rate * multiplier);
  }

  function getTimelineAdjustment(timeline) {
    const adjustments = {
      'standard': { costMultiplier: 1.0, timeMultiplier: 1.0 },
      'accelerated': { costMultiplier: 1.25, timeMultiplier: 0.75 },
      'rush': { costMultiplier: 1.6, timeMultiplier: 0.5 },
      'extended': { costMultiplier: 0.9, timeMultiplier: 1.3 }
    };
    
    return adjustments[timeline] || adjustments.standard;
  }

  function calculateAdditionalServiceCosts(baseCost, additionalServices) {
    // Fixed costs for additional services
    const serviceCosts = {
      'brand-design': 15000,
      'marketing-site': 8000,
      'app-store': 3000,
      'documentation': 5000,
      'training': 7000,
      'maintenance': 12000
    };

    let totalServiceCost = 0;
    
    additionalServices.services.forEach(service => {
      totalServiceCost += serviceCosts[service] || 0;
    });

    return totalServiceCost;
  }

  function calculateTimeline(totalEffort, teamSize, timeMultiplier) {
    // Convert team size to number
    const teamSizes = {
      'small': 3,
      'medium': 6,
      'large': 12,
      'enterprise': 20
    };

    const teamNumber = teamSizes[teamSize] || 6;
    
    // Calculate timeline in weeks (with some parallelization efficiency loss)
    const efficiencyFactor = Math.min(1.0, teamNumber / 8); // Efficiency decreases with larger teams
    const timelineWeeks = (totalEffort / teamNumber / efficiencyFactor) * timeMultiplier;
    
    return {
      weeks: Math.round(timelineWeeks),
      months: Math.round(timelineWeeks / 4.33 * 10) / 10 // More precise months calculation
    };
  }

  function displayResults(data) {
    const html = `
      <div class="result-section">
        <h3>💻 Розрахунок вартості розробки додатку</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💰 Загальна вартість проекту</h6>
            <div class="big-number">$${data.finalCost.toLocaleString()}</div>
            <div>Включаючи резерв</div>
          </div>
          <div class="insight-card success">
            <h6>📅 Терміни</h6>
            <div class="big-number">${data.projectTimeline.months}</div>
            <div>місяців (${data.projectTimeline.weeks} тижнів)</div>
          </div>
          <div class="insight-card warning">
            <h6>👥 Загальні зусилля</h6>
            <div class="big-number">${data.totalDevelopmentEffort}</div>
            <div>людино-тижнів</div>
          </div>
          <div class="insight-card">
            <h6>🔧 Функції</h6>
            <div class="big-number">${data.features.total}</div>
            <div>обрано функцій</div>
          </div>
        </div>

        <h4>📊 Деталізація витрат</h4>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Базова розробка (${data.totalEffort} людино-тижнів):</span>
            <strong>$${data.teamCosts.toLocaleString()}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Дизайн (${data.designEffort} людино-тижнів):</span>
            <strong>включено</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Коригування термінів (${data.timelineAdjustment.costMultiplier}x):</span>
            <strong>$${data.adjustedCosts.toLocaleString()}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Додаткові послуги:</span>
            <strong>$${data.serviceCosts.toLocaleString()}</strong>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 2px solid var(--border);">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span><strong>Базова вартість:</strong></span>
            <strong>$${data.baseCost.toLocaleString()}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Резерв (+${(data.contingency * 100).toFixed(0)}%):</span>
            <strong>$${(data.finalCost - data.baseCost).toLocaleString()}</strong>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 3px solid var(--accent);">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-size: 1.2rem;">
            <span><strong>Кінцева вартість:</strong></span>
            <strong style="color: var(--accent);">$${data.finalCost.toLocaleString()}</strong>
          </div>
        </div>

        <h4>📈 Деталі проекту</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
          
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
            <h4 style="margin-top: 0;">💻 Розробка</h4>
            <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
              <li><strong>Тип:</strong> ${getAppTypeName(data.appType)}</li>
              <li><strong>Складність:</strong> ${getComplexityName(data.complexity)}</li>
              <li><strong>Платформи:</strong> ${data.platforms}</li>
              <li><strong>Екрани:</strong> ~${document.getElementById('screen-count').value}</li>
            </ul>
          </div>

          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
            <h4 style="margin-top: 0;">👥 Команда</h4>
            <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
              <li><strong>Розташування:</strong> ${getLocationName(data.teamLocation)}</li>
              <li><strong>Розмір:</strong> ${getTeamSizeName(data.teamSize)}</li>
              <li><strong>Терміни:</strong> ${getTimelineName(document.getElementById('timeline').value)}</li>
              <li><strong>Дизайн:</strong> ${getDesignName(data.designComplexity)}</li>
            </ul>
          </div>

          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
            <h4 style="margin-top: 0;">🔧 Функції</h4>
            <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
              <li><strong>Основні:</strong> ${data.features.core}</li>
              <li><strong>Розширені:</strong> ${data.features.advanced}</li>
              <li><strong>Додаткові послуги:</strong> ${data.additionalServices.count}</li>
              <li><strong>Сховище даних:</strong> ${getStorageName(document.getElementById('data-storage').value)}</li>
            </ul>
          </div>
        </div>

        ${getCostOptimizationTips(data)}
      </div>
    `;

    result.innerHTML = html;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getAppTypeName(appType) {
    const names = {
      'mobile-native': 'Нативний мобільний',
      'mobile-cross': 'Кросплатформенний',
      'web-app': 'Веб-додаток',
      'desktop': 'Настільний',
      'enterprise': 'Корпоративне ПЗ',
      'saas': 'SaaS платформа',
      'ecommerce': 'Електронна комерція',
      'cms': 'CMS система'
    };
    return names[appType] || appType;
  }

  function getComplexityName(complexity) {
    const names = {
      'simple': 'Простий',
      'moderate': 'Середній',
      'complex': 'Складний',
      'enterprise': 'Корпоративний'
    };
    return names[complexity] || complexity;
  }

  function getLocationName(location) {
    const names = {
      'onshore': 'Оншор (США/ЗЄ)',
      'nearshore': 'Ніршор (СЄ)',
      'offshore': 'Офшор (Азія)',
      'hybrid': 'Гібридна'
    };
    return names[location] || location;
  }

  function getTeamSizeName(size) {
    const names = {
      'small': 'Мала (2-4)',
      'medium': 'Середня (5-8)',
      'large': 'Велика (9-15)',
      'enterprise': 'Корпоративна (15+)'
    };
    return names[size] || size;
  }

  function getTimelineName(timeline) {
    const names = {
      'standard': 'Стандартні',
      'accelerated': 'Прискорені',
      'rush': 'Терміновий',
      'extended': 'Подовжені'
    };
    return names[timeline] || timeline;
  }

  function getDesignName(design) {
    const names = {
      'basic': 'Базовий',
      'custom': 'Індивідуальний',
      'advanced': 'Розширений',
      'premium': 'Преміум'
    };
    return names[design] || design;
  }

  function getStorageName(storage) {
    const names = {
      'simple': 'Прості файли',
      'cloud': 'Хмарна БД',
      'enterprise': 'Корпоративна БД',
      'distributed': 'Розподілені системи'
    };
    return names[storage] || storage;
  }

  function getCostOptimizationTips(data) {
    const tips = [];
    
    if (data.finalCost > 100000) {
      tips.push('💰 <strong>Високі витрати:</strong> Розгляньте можливість створення MVP спочатку для зменшення початкових витрат');
    }
    
    if (data.features.total > 8) {
      tips.push('🔧 <strong>Багато функцій:</strong> Пріоритизуйте основні функції для першого релізу');
    }
    
    if (data.projectTimeline.months > 12) {
      tips.push('⏱️ <strong>Тривалий проект:</strong> Розділіть на етапи для швидшого виходу на ринок');
    }
    
    if (data.platforms > 2) {
      tips.push('📱 <strong>Кілька платформ:</strong> Почніть з однієї платформи та розширюйтесь поступово');
    }

    tips.push('🚀 <strong>MVP підхід:</strong> Створення мінімально життєздатного продукту може заощадити 40-60% початкових витрат');
    tips.push('📊 <strong>Дослідження ринку:</strong> Порівняйте котирування від кількох команд розробки');

    return `
      <div style="margin-top: 2rem;">
        <h3>💡 Поради щодо оптимізації витрат</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <ul style="margin: 0.5rem 0;">
            ${tips.map(tip => `<li style="margin: 0.5rem 0;">${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
});