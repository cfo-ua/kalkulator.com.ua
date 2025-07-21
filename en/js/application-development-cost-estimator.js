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
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Calculate base development effort (in person-weeks)
    const baseEffort = calculateBaseEffort(appType, complexity, screenCount, features, dataStorage);
    
    // Apply platform multiplier
    const platformMultiplier = calculatePlatformMultiplier(appType, platforms);
    const adjustedEffort = baseEffort * platformMultiplier;

    // Calculate design effort
    const designEffort = calculateDesignEffort(designComplexity, screenCount, features);

    // Calculate QA effort
    const qaEffort = calculateQAEffort(adjustedEffort, qaLevel, complexity);

    // Calculate project management effort
    const pmEffort = calculatePMEffort(adjustedEffort + designEffort + qaEffort, pmLevel);

    // Calculate total effort
    const totalEffort = adjustedEffort + designEffort + qaEffort + pmEffort;

    // Calculate team costs
    const teamCosts = calculateTeamCosts(totalEffort, teamLocation, teamSize);

    // Apply timeline adjustments
    const timelineAdjustment = getTimelineAdjustment(timeline);
    const adjustedCosts = teamCosts * timelineAdjustment.costMultiplier;

    // Calculate additional service costs
    const serviceCosts = calculateServiceCosts(adjustedCosts, additionalServices);

    // Calculate final cost with contingency
    const baseCost = adjustedCosts + serviceCosts;
    const finalCost = baseCost * (1 + contingency);

    // Calculate timeline
    const projectTimeline = calculateTimeline(totalEffort, teamSize, timelineAdjustment.timeMultiplier);

    // Display results
    displayResults({
      appType,
      complexity,
      platforms,
      baseEffort,
      totalEffort,
      teamCosts,
      adjustedCosts,
      serviceCosts,
      baseCost,
      finalCost,
      projectTimeline,
      teamLocation,
      teamSize,
      designComplexity,
      features,
      additionalServices,
      contingency,
      timelineAdjustment
    });
  }

  function getSelectedFeatures() {
    const featureElements = [
      'user-auth', 'user-profiles', 'payments', 'notifications', 'search', 
      'messaging', 'social', 'analytics', 'ai-ml', 'video-audio', 
      'geolocation', 'offline', 'api-integration', 'admin-panel'
    ];

    const coreFeatures = featureElements.slice(0, 8);
    const advancedFeatures = featureElements.slice(8);

    return {
      core: coreFeatures.filter(id => document.getElementById(id)?.checked).length,
      advanced: advancedFeatures.filter(id => document.getElementById(id)?.checked).length,
      total: featureElements.filter(id => document.getElementById(id)?.checked).length,
      list: featureElements.filter(id => document.getElementById(id)?.checked)
    };
  }

  function getAdditionalServices() {
    const services = ['deployment', 'maintenance', 'training', 'marketing'];
    const checkboxes = ['responsive-design', 'accessibility', 'animations', 'mvp-approach', 'security-compliance', 'performance-optimization'];
    
    return {
      services: services.filter(id => document.getElementById(id)?.checked),
      features: checkboxes.filter(id => document.getElementById(id)?.checked)
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
      'moderate': 1.2,
      'complex': 1.5,
      'enterprise': 2.0
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
      'template': 2,
      'custom-simple': 4,
      'custom-advanced': 8,
      'premium': 16,
      'brand': 24
    };

    let designEffort = designBaseEfforts[designComplexity] || 4;
    
    // Screen count impact on design
    const screenMultiplier = Math.max(0.5, screenCount / 15);
    designEffort *= screenMultiplier;

    // Complex features require more design work
    if (features.advanced > 2) {
      designEffort *= 1.3;
    }

    return Math.round(designEffort);
  }

  function calculateQAEffort(developmentEffort, qaLevel, complexity) {
    const qaPercentages = {
      'basic': 0.15,
      'standard': 0.25,
      'comprehensive': 0.35,
      'enterprise': 0.45
    };

    const complexityMultipliers = {
      'simple': 0.8,
      'moderate': 1.0,
      'complex': 1.3,
      'enterprise': 1.6
    };

    const qaPercentage = qaPercentages[qaLevel] || 0.25;
    const complexityMultiplier = complexityMultipliers[complexity] || 1.0;

    return Math.round(developmentEffort * qaPercentage * complexityMultiplier);
  }

  function calculatePMEffort(totalTechnicalEffort, pmLevel) {
    const pmPercentages = {
      'basic': 0.1,
      'standard': 0.15,
      'premium': 0.2,
      'enterprise': 0.25
    };

    const pmPercentage = pmPercentages[pmLevel] || 0.15;
    return Math.round(totalTechnicalEffort * pmPercentage);
  }

  function calculateTeamCosts(totalEffort, teamLocation, teamSize) {
    // Average hourly rates by location
    const hourlyRates = {
      'onshore': 120,
      'nearshore': 55,
      'offshore': 30,
      'mixed': 75 // Weighted average
    };

    // Team size multipliers (larger teams have coordination overhead)
    const teamMultipliers = {
      'small': 1.0,
      'medium': 1.1,
      'large': 1.25,
      'enterprise': 1.4
    };

    const hourlyRate = hourlyRates[teamLocation] || 75;
    const teamMultiplier = teamMultipliers[teamSize] || 1.0;
    
    // Convert person-weeks to cost (40 hours per week)
    const totalCost = totalEffort * 40 * hourlyRate * teamMultiplier;

    return Math.round(totalCost);
  }

  function getTimelineAdjustment(timeline) {
    const adjustments = {
      'rush': { costMultiplier: 2.0, timeMultiplier: 0.5 },
      'fast': { costMultiplier: 1.5, timeMultiplier: 0.75 },
      'standard': { costMultiplier: 1.0, timeMultiplier: 1.0 },
      'relaxed': { costMultiplier: 0.85, timeMultiplier: 1.25 }
    };

    return adjustments[timeline] || adjustments['standard'];
  }

  function calculateServiceCosts(baseDevelopmentCost, additionalServices) {
    let serviceCosts = 0;

    // Additional services as percentage of development cost
    const serviceCostPercentages = {
      'deployment': 0.05,     // 5%
      'maintenance': 0.20,    // 20% (1 year)
      'training': 0.03,       // 3%
      'marketing': 0.08       // 8%
    };

    // Additional features as percentage of development cost
    const featureCostPercentages = {
      'responsive-design': 0.08,
      'accessibility': 0.12,
      'animations': 0.06,
      'mvp-approach': -0.30,  // 30% reduction for MVP
      'security-compliance': 0.15,
      'performance-optimization': 0.10
    };

    // Calculate service costs
    additionalServices.services.forEach(service => {
      const percentage = serviceCostPercentages[service] || 0;
      serviceCosts += baseDevelopmentCost * percentage;
    });

    // Calculate feature costs
    additionalServices.features.forEach(feature => {
      const percentage = featureCostPercentages[feature] || 0;
      serviceCosts += baseDevelopmentCost * percentage;
    });

    return Math.round(serviceCosts);
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
    const { finalCost, projectTimeline, totalEffort } = data;

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>💰 Total Project Cost</h6>
          <div class="big-number">$${finalCost.toLocaleString()}</div>
          <p class="insight-detail">Including contingency</p>
        </div>
        <div class="insight-card success">
          <h6>📅 Timeline</h6>
          <div class="big-number">${projectTimeline.months}</div>
          <p class="insight-detail">months (${projectTimeline.weeks} weeks)</p>
        </div>
        <div class="insight-card warning">
          <h6>👥 Total Effort</h6>
          <div class="big-number">${totalEffort}</div>
          <p class="insight-detail">person-weeks</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Cost Breakdown</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>💻 Development Costs</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Base Development:</strong> $${data.teamCosts.toLocaleString()}</li>
                <li><strong>Timeline Adjustment:</strong> ${data.timelineAdjustment.costMultiplier}x</li>
                <li><strong>Adjusted Cost:</strong> $${data.adjustedCosts.toLocaleString()}</li>
                <li><strong>Team Location:</strong> ${getLocationName(data.teamLocation)}</li>
              </ul>
            </div>

            <div>
              <h4>⚙️ Additional Services</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Service Costs:</strong> $${data.serviceCosts.toLocaleString()}</li>
                <li><strong>Base + Services:</strong> $${data.baseCost.toLocaleString()}</li>
                <li><strong>Contingency:</strong> ${(data.contingency * 100).toFixed(0)}%</li>
                <li><strong>Final Cost:</strong> $${data.finalCost.toLocaleString()}</li>
              </ul>
            </div>

            <div>
              <h4>📈 Project Metrics</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>App Type:</strong> ${getAppTypeName(data.appType)}</li>
                <li><strong>Complexity:</strong> ${data.complexity}</li>
                <li><strong>Platforms:</strong> ${data.platforms}</li>
                <li><strong>Features:</strong> ${data.features.total} selected</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>👥 Team & Timeline Analysis</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">⏱️ Effort Distribution</h4>
            ${generateEffortBreakdown(data)}
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">💰 Cost Per Phase</h4>
            ${generateCostBreakdown(data)}
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">📊 Key Metrics</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Cost per Week:</strong> $${Math.round(data.finalCost / projectTimeline.weeks).toLocaleString()}</li>
              <li><strong>Team Size:</strong> ${getTeamSizeName(data.teamSize)}</li>
              <li><strong>Hourly Rate:</strong> $${Math.round(data.adjustedCosts / (data.totalEffort * 40))}/hour</li>
              <li><strong>Features/Week:</strong> ${(data.features.total / projectTimeline.weeks).toFixed(1)}</li>
            </ul>
          </div>
        </div>
      </div>

      ${generateFeatureAnalysis(data)}
      ${generateCostComparisonTable(data)}
      ${generateRecommendations(data)}

      <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>⚠️ Important:</strong> Software development costs are estimates based on typical industry patterns. 
        Actual costs may vary significantly based on specific requirements, team experience, technology choices, 
        and project complexity discovered during development. Always get detailed quotes from development teams 
        and consider building an MVP first to validate your concept.
      </div>
    `;

    result.innerHTML = html;
  }

  function generateEffortBreakdown(data) {
    const devEffort = data.baseEffort * (data.platforms > 1 ? (1 + (data.platforms - 1) * 0.6) : 1);
    const designEffort = Math.round(data.totalEffort * 0.2); // Approximate
    const qaEffort = Math.round(data.totalEffort * 0.25); // Approximate
    const pmEffort = Math.round(data.totalEffort * 0.15); // Approximate

    const efforts = [
      { label: 'Development', value: devEffort, color: '#28a745' },
      { label: 'Design', value: designEffort, color: '#17a2b8' },
      { label: 'QA & Testing', value: qaEffort, color: '#ffc107' },
      { label: 'Project Management', value: pmEffort, color: '#6c757d' }
    ];

    let html = '';
    efforts.forEach(effort => {
      const percentage = (effort.value / data.totalEffort * 100).toFixed(1);
      html += `
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${effort.label}</span>
            <span>${effort.value} weeks (${percentage}%)</span>
          </div>
          <div style="background: var(--card-bg); height: 6px; border-radius: 3px;">
            <div style="background: ${effort.color}; height: 100%; width: ${percentage}%; border-radius: 3px;"></div>
          </div>
        </div>
      `;
    });

    return html;
  }

  function generateCostBreakdown(data) {
    const totalCost = data.finalCost;
    const devCost = data.adjustedCosts * 0.6; // Approximate
    const designCost = data.adjustedCosts * 0.2;
    const qaCost = data.adjustedCosts * 0.15;
    const pmCost = data.adjustedCosts * 0.05;

    const costs = [
      { label: 'Development', value: devCost },
      { label: 'Design', value: designCost },
      { label: 'QA & Testing', value: qaCost },
      { label: 'Project Management', value: pmCost },
      { label: 'Services & Buffer', value: totalCost - data.adjustedCosts }
    ];

    let html = '<ul style="margin: 0.5rem 0;">';
    costs.forEach(cost => {
      html += `<li><strong>${cost.label}:</strong> $${Math.round(cost.value).toLocaleString()}</li>`;
    });
    html += '</ul>';

    return html;
  }

  function generateFeatureAnalysis(data) {
    if (data.features.total === 0) return '';

    return `
      <div style="margin-top: 2rem;">
        <h3>⚙️ Feature Impact Analysis</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <strong>Core Features:</strong> ${data.features.core}<br>
              <small>Standard app functionality</small>
            </div>
            <div>
              <strong>Advanced Features:</strong> ${data.features.advanced}<br>
              <small>Complex integrations & AI</small>
            </div>
            <div>
              <strong>Feature Complexity:</strong> ${data.features.total > 8 ? 'High' : data.features.total > 4 ? 'Medium' : 'Low'}<br>
              <small>Based on total feature count</small>
            </div>
            <div>
              <strong>Cost per Feature:</strong> $${Math.round(data.finalCost / Math.max(1, data.features.total)).toLocaleString()}<br>
              <small>Average cost allocation</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateCostComparisonTable(data) {
    const locations = [
      { name: 'Onshore', rate: 120, description: 'US/Western Europe' },
      { name: 'Nearshore', rate: 55, description: 'Eastern Europe' },
      { name: 'Offshore', rate: 30, description: 'Asia/Africa' },
      { name: 'Mixed Team', rate: 75, description: 'Hybrid approach' }
    ];

    let html = `
      <div style="margin-top: 2rem;">
        <h3>🌍 Cost by Development Location</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
    `;

    locations.forEach(location => {
      const locationCost = (data.totalEffort * 40 * location.rate) * data.timelineAdjustment.costMultiplier * (1 + data.contingency);
      const isSelected = location.name.toLowerCase().includes(data.teamLocation);

      html += `
        <div style="text-align: center; padding: 1.5rem; border-radius: 12px; ${isSelected ? 'background: var(--accent); color: white; border: 2px solid var(--accent);' : 'background: white; border: 2px solid var(--border);'}">
          <h4 style="margin-top: 0;">${location.name}</h4>
          <div style="font-size: 1.2rem; margin: 0.5rem 0;">$${locationCost.toLocaleString()}</div>
          <small>${location.description}</small><br>
          <small>~$${location.rate}/hour</small>
        </div>
      `;
    });

    html += '</div></div>';
    return html;
  }

  function generateRecommendations(data) {
    const recommendations = [];

    if (data.finalCost > 500000) {
      recommendations.push('💰 <strong>High Budget Project:</strong> Consider MVP approach to validate concept before full development');
    }

    if (data.features.advanced > 3) {
      recommendations.push('⚙️ <strong>Complex Features:</strong> Plan for additional discovery phase to refine requirements');
    }

    if (data.projectTimeline.months > 12) {
      recommendations.push('📅 <strong>Long Timeline:</strong> Break into smaller milestones and consider phased delivery');
    }

    if (data.platforms > 2) {
      recommendations.push('📱 <strong>Multiple Platforms:</strong> Start with one platform, then expand based on user feedback');
    }

    if (data.teamLocation === 'offshore' && data.complexity === 'complex') {
      recommendations.push('🌍 <strong>Offshore + Complex:</strong> Consider hybrid team with onshore lead for better communication');
    }

    recommendations.push('🚀 <strong>Risk Mitigation:</strong> Plan for 20-40% scope changes and budget accordingly');
    recommendations.push('📊 <strong>Success Metrics:</strong> Define clear KPIs and success criteria before development starts');

    return `
      <div style="margin-top: 2rem;">
        <h3>💡 Project Recommendations</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <ul style="margin: 0.5rem 0;">
            ${recommendations.map(rec => `<li style="margin: 0.5rem 0;">${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function getLocationName(location) {
    const names = {
      'onshore': 'Onshore (US/EU)',
      'nearshore': 'Nearshore (Eastern EU)',
      'offshore': 'Offshore (Asia)',
      'mixed': 'Mixed Team'
    };
    return names[location] || location;
  }

  function getAppTypeName(appType) {
    const names = {
      'mobile-native': 'Native Mobile App',
      'mobile-cross': 'Cross-platform Mobile',
      'web-app': 'Web Application',
      'desktop': 'Desktop Application',
      'enterprise': 'Enterprise Software',
      'saas': 'SaaS Platform',
      'ecommerce': 'E-commerce Platform',
      'cms': 'Content Management System'
    };
    return names[appType] || appType;
  }

  function getTeamSizeName(teamSize) {
    const names = {
      'small': 'Small (2-4 people)',
      'medium': 'Medium (5-8 people)',
      'large': 'Large (9-15 people)',
      'enterprise': 'Enterprise (15+ people)'
    };
    return names[teamSize] || teamSize;
  }
});