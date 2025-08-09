document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fengshui-form');
  const result = document.getElementById('fengshui-result');

  // Setup range sliders
  setupClutterSlider();
  setupPlantSlider();

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      analyzeFengShui();
    });
  }

  function setupClutterSlider() {
    const slider = document.getElementById('clutter-level');
    const display = document.getElementById('clutter-display');
    if (slider && display) {
      const labels = ['Very Clean', 'Clean', 'Moderate', 'Cluttered', 'Very Cluttered'];
      slider.addEventListener('input', function() {
        display.textContent = labels[this.value - 1];
      });
    }
  }

  function setupPlantSlider() {
    const slider = document.getElementById('plant-count');
    const display = document.getElementById('plant-display');
    if (slider && display) {
      slider.addEventListener('input', function() {
        display.textContent = this.value + ' plants';
      });
    }
  }

  function analyzeFengShui() {
    // Get form values
    const homeType = document.getElementById('home-type').value;
    const entranceDirection = document.getElementById('entrance-direction').value;
    const homeShape = document.getElementById('home-shape').value;
    const bedroomCount = parseInt(document.getElementById('bedroom-count').value);
    const squareFootage = parseInt(document.getElementById('square-footage').value) || 1200;
    const birthYear = parseInt(document.getElementById('birth-year').value);
    const gender = document.getElementById('gender').value;
    const lifeFocus = document.getElementById('life-focus').value;
    const bedroomSetup = document.getElementById('bedroom-setup').value;
    const stovePosition = document.getElementById('stove-position').value;
    const livingRoomSeating = document.getElementById('living-room-seating').value;
    const clutterLevel = parseInt(document.getElementById('clutter-level').value);
    const naturalLight = document.getElementById('natural-light').value;
    const plantCount = parseInt(document.getElementById('plant-count').value);
    const waterFeatures = document.getElementById('water-features').value;
    const enhancementBudget = document.getElementById('enhancement-budget').value;
    const openToChanges = document.getElementById('open-to-changes').checked;

    // Get selected challenges and issues
    const challenges = getChallenges();
    const structuralIssues = getStructuralIssues();
    const dominantColors = getDominantColors();

    // Validate required fields
    if (!homeType || !entranceDirection || !homeShape || !lifeFocus) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Calculate Kua number if birth year and gender provided
    const kuaNumber = calculateKuaNumber(birthYear, gender);

    // Analyze current space
    const spaceAnalysis = analyzeCurrentSpace(
      homeShape, entranceDirection, bedroomSetup, stovePosition, 
      livingRoomSeating, clutterLevel, structuralIssues
    );

    // Analyze elements and colors
    const elementAnalysis = analyzeElements(dominantColors, plantCount, waterFeatures, naturalLight);

    // Generate recommendations based on life focus and challenges
    const recommendations = generateRecommendations(
      lifeFocus, challenges, spaceAnalysis, elementAnalysis, 
      enhancementBudget, openToChanges, kuaNumber
    );

    // Calculate feng shui score
    const fengShuiScore = calculateFengShuiScore(
      spaceAnalysis, elementAnalysis, clutterLevel, naturalLight, plantCount
    );

    // Display results
    displayResults({
      homeType,
      entranceDirection,
      homeShape,
      lifeFocus,
      kuaNumber,
      spaceAnalysis,
      elementAnalysis,
      recommendations,
      fengShuiScore,
      challenges,
      enhancementBudget,
      squareFootage
    });
  }

  function getChallenges() {
    const challengeIds = [
      'challenge-career', 'challenge-money', 'challenge-health', 
      'challenge-relationships', 'challenge-stress', 'challenge-sleep', 'challenge-energy'
    ];
    return challengeIds.filter(id => document.getElementById(id)?.checked);
  }

  function getStructuralIssues() {
    const issueIds = [
      'issue-beams', 'issue-corners', 'issue-stairs', 'issue-bathroom', 
      'issue-kitchen', 'issue-mirrors', 'issue-electronics'
    ];
    return issueIds.filter(id => document.getElementById(id)?.checked);
  }

  function getDominantColors() {
    const colorIds = [
      'color-red', 'color-orange', 'color-yellow', 'color-green', 
      'color-blue', 'color-purple', 'color-white', 'color-black', 'color-brown'
    ];
    return colorIds.filter(id => document.getElementById(id)?.checked);
  }

  function calculateKuaNumber(birthYear, gender) {
    if (!birthYear || !gender) return null;

    const lastTwoDigits = birthYear % 100;
    let kuaNumber;

    if (birthYear < 2000) {
      if (gender === 'male') {
        kuaNumber = 100 - lastTwoDigits;
      } else {
        kuaNumber = lastTwoDigits + 5;
      }
    } else {
      if (gender === 'male') {
        kuaNumber = 100 - lastTwoDigits;
      } else {
        kuaNumber = lastTwoDigits + 6;
      }
    }

    // Reduce to single digit
    while (kuaNumber >= 10) {
      kuaNumber = Math.floor(kuaNumber / 10) + (kuaNumber % 10);
    }

    // Handle special case where result is 5
    if (kuaNumber === 5) {
      kuaNumber = gender === 'male' ? 2 : 8;
    }

    return kuaNumber;
  }

  function analyzeCurrentSpace(homeShape, entranceDirection, bedroomSetup, stovePosition, livingRoomSeating, clutterLevel, structuralIssues) {
    let positiveAspects = [];
    let challenges = [];
    let score = 50; // Base score

    // Home shape analysis
    if (homeShape === 'square') {
      positiveAspects.push('Square/rectangular shape provides stable energy foundation');
      score += 15;
    } else if (['l-shape', 'u-shape'].includes(homeShape)) {
      challenges.push('Irregular shape creates missing Bagua areas, affecting life balance');
      score -= 10;
    } else if (homeShape === 'triangle') {
      challenges.push('Triangular shape creates unstable fire energy');
      score -= 15;
    }

    // Entrance direction
    const entranceQualities = {
      'north': 'Career and life path energy',
      'northeast': 'Knowledge and wisdom energy',
      'east': 'Family and health energy',
      'southeast': 'Wealth and abundance energy',
      'south': 'Fame and recognition energy',
      'southwest': 'Love and relationship energy',
      'west': 'Children and creativity energy',
      'northwest': 'Helpful people and travel energy'
    };
    positiveAspects.push(`${entranceDirection.charAt(0).toUpperCase() + entranceDirection.slice(1)} entrance brings ${entranceQualities[entranceDirection]}`);

    // Bedroom setup analysis
    if (bedroomSetup === 'ideal') {
      positiveAspects.push('Bedroom has excellent feng shui positioning');
      score += 10;
    } else if (bedroomSetup === 'facing-door') {
      challenges.push('Bed facing door creates restless energy and poor sleep');
      score -= 10;
    } else if (bedroomSetup === 'under-beam') {
      challenges.push('Bed under beam creates oppressive energy affecting health');
      score -= 15;
    }

    // Kitchen/stove analysis
    if (stovePosition === 'command') {
      positiveAspects.push('Stove in command position enhances nourishment energy');
      score += 8;
    } else if (stovePosition === 'back-to-door') {
      challenges.push('Stove position with back to door creates vulnerability energy');
      score -= 8;
    } else if (stovePosition === 'facing-sink') {
      challenges.push('Stove facing sink creates fire-water conflict');
      score -= 10;
    }

    // Living room seating
    if (livingRoomSeating === 'command') {
      positiveAspects.push('Living room seating promotes security and social harmony');
      score += 8;
    } else if (livingRoomSeating === 'back-to-door') {
      challenges.push('Seating with backs to entrance creates insecurity');
      score -= 8;
    }

    // Clutter impact
    if (clutterLevel <= 2) {
      positiveAspects.push('Clean, organized space allows positive energy flow');
      score += 10;
    } else if (clutterLevel >= 4) {
      challenges.push('Clutter blocks energy flow and creates stagnation');
      score -= 15;
    }

    // Structural issues
    structuralIssues.forEach(issue => {
      switch (issue) {
        case 'issue-beams':
          challenges.push('Exposed beams create oppressive downward energy');
          score -= 8;
          break;
        case 'issue-stairs':
          challenges.push('Stairs facing entrance causes energy to rush out');
          score -= 10;
          break;
        case 'issue-bathroom':
          challenges.push('Central bathroom drains the heart energy of home');
          score -= 12;
          break;
        case 'issue-mirrors':
          challenges.push('Mirrors reflecting beds or doors disrupt energy flow');
          score -= 6;
          break;
        case 'issue-electronics':
          challenges.push('Electronics in bedroom disturb rest and relationship energy');
          score -= 8;
          break;
      }
    });

    return {
      score: Math.max(0, Math.min(100, score)),
      positiveAspects,
      challenges,
      recommendations: []
    };
  }

  function analyzeElements(dominantColors, plantCount, waterFeatures, naturalLight) {
    const elementCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    let score = 50;

    // Color element mapping
    const colorElements = {
      'color-green': 'wood',
      'color-brown': 'wood',
      'color-red': 'fire',
      'color-orange': 'fire',
      'color-purple': 'fire',
      'color-yellow': 'earth',
      'color-white': 'metal',
      'color-black': 'water',
      'color-blue': 'water'
    };

    // Count elements from colors
    dominantColors.forEach(color => {
      const element = colorElements[color];
      if (element) elementCounts[element]++;
    });

    // Add plants (wood element)
    if (plantCount > 0) {
      elementCounts.wood += Math.min(3, Math.floor(plantCount / 2));
    }

    // Add water features
    if (waterFeatures !== 'none') {
      elementCounts.water += waterFeatures === 'multiple' ? 3 : 1;
    }

    // Natural light (fire element)
    if (naturalLight === 'excellent') {
      elementCounts.fire += 2;
      score += 10;
    } else if (naturalLight === 'poor') {
      score -= 10;
    }

    // Calculate balance score
    const totalElements = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
    if (totalElements > 0) {
      const variance = Object.values(elementCounts).reduce((sum, count) => {
        const avg = totalElements / 5;
        return sum + Math.pow(count - avg, 2);
      }, 0) / 5;
      
      // Lower variance = better balance
      score += Math.max(0, 20 - variance * 2);
    }

    return {
      elementCounts,
      score: Math.max(0, Math.min(100, score)),
      totalElements,
      balance: totalElements > 0 ? 'balanced' : 'needs-elements',
      recommendations: generateElementRecommendations(elementCounts)
    };
  }

  function generateElementRecommendations(elementCounts) {
    const recommendations = [];
    const elements = Object.entries(elementCounts);
    
    // Find deficient elements
    const maxCount = Math.max(...Object.values(elementCounts));
    const minCount = Math.min(...Object.values(elementCounts));
    
    if (maxCount - minCount > 2) {
      elements.forEach(([element, count]) => {
        if (count === minCount) {
          recommendations.push(getElementEnhancement(element));
        }
      });
    }

    return recommendations;
  }

  function getElementEnhancement(element) {
    const enhancements = {
      wood: 'Add plants, wood furniture, or green colors to enhance growth energy',
      fire: 'Include red accents, candles, or good lighting to boost passion and energy',
      earth: 'Add earth tones, crystals, or ceramic items for stability and grounding',
      metal: 'Include white/gray colors, metal objects, or round shapes for clarity and focus',
      water: 'Add blue colors, mirrors, or a small fountain for flow and wisdom'
    };
    return enhancements[element];
  }

  function generateRecommendations(lifeFocus, challenges, spaceAnalysis, elementAnalysis, budget, openToChanges, kuaNumber) {
    let recommendations = [];

    // Life focus recommendations
    const focusRecommendations = {
      career: {
        area: 'North (Career)',
        enhancements: ['Add water element (blue/black colors, fountain)', 'Keep this area clutter-free', 'Add metal objects for support'],
        priority: 'high'
      },
      relationships: {
        area: 'Southwest (Love & Marriage)',
        enhancements: ['Add pairs of objects', 'Use earth tones and pink colors', 'Remove single-person imagery'],
        priority: 'high'
      },
      wealth: {
        area: 'Southeast (Wealth)',
        enhancements: ['Add purple or gold accents', 'Include healthy plants', 'Keep area well-lit and organized'],
        priority: 'high'
      },
      health: {
        area: 'Center (Health) and East (Family)',
        enhancements: ['Add yellow/earth colors in center', 'Place healthy plants in east', 'Ensure good air circulation'],
        priority: 'high'
      }
    };

    const focusRec = focusRecommendations[lifeFocus];
    if (focusRec) {
      recommendations.push({
        category: 'Life Focus Enhancement',
        priority: 'high',
        title: `Enhance ${focusRec.area} for ${lifeFocus}`,
        description: focusRec.enhancements.join('. '),
        cost: 'Low-Medium',
        impact: 'High'
      });
    }

    // Challenge-specific recommendations
    challenges.forEach(challenge => {
      const challengeRecs = getChallengeRecommendations(challenge);
      if (challengeRecs) {
        recommendations.push(challengeRecs);
      }
    });

    // Space improvement recommendations
    spaceAnalysis.challenges.forEach(challenge => {
      recommendations.push({
        category: 'Space Optimization',
        priority: 'medium',
        title: 'Address Current Space Challenge',
        description: challenge + '. Consider repositioning furniture or adding feng shui cures.',
        cost: 'Low-Medium',
        impact: 'Medium-High'
      });
    });

    // Element balance recommendations
    elementAnalysis.recommendations.forEach(rec => {
      recommendations.push({
        category: 'Element Balance',
        priority: 'medium',
        title: 'Enhance Element Balance',
        description: rec,
        cost: 'Low',
        impact: 'Medium'
      });
    });

    // Kua number recommendations
    if (kuaNumber) {
      const kuaRec = getKuaRecommendations(kuaNumber);
      recommendations.push({
        category: 'Personal Directions',
        priority: 'medium',
        title: `Kua ${kuaNumber} Personal Directions`,
        description: kuaRec,
        cost: 'Free',
        impact: 'Medium'
      });
    }

    // Budget-appropriate recommendations
    recommendations = filterByBudget(recommendations, budget);

    return recommendations.slice(0, 8); // Limit to 8 top recommendations
  }

  function getChallengeRecommendations(challenge) {
    const challengeMap = {
      'challenge-career': {
        category: 'Career Enhancement',
        priority: 'high',
        title: 'Boost Career Energy',
        description: 'Focus on North area: add water elements, dark blue/black colors, keep area clutter-free, add a small fountain or mirror.',
        cost: 'Low-Medium',
        impact: 'High'
      },
      'challenge-money': {
        category: 'Wealth Enhancement',
        priority: 'high',
        title: 'Attract Prosperity',
        description: 'Enhance Southeast corner: add purple accents, healthy plants, good lighting, remove clutter, consider a small fountain.',
        cost: 'Low-Medium',
        impact: 'High'
      },
      'challenge-health': {
        category: 'Health Improvement',
        priority: 'high',
        title: 'Improve Health Energy',
        description: 'Focus on center of home: add yellow/earth colors, ensure good air circulation, remove clutter, add healthy plants.',
        cost: 'Low',
        impact: 'High'
      },
      'challenge-relationships': {
        category: 'Relationship Harmony',
        priority: 'high',
        title: 'Enhance Love Energy',
        description: 'Strengthen Southwest area: add pairs of objects, pink/red colors, remove single-person imagery, add rose quartz crystals.',
        cost: 'Low',
        impact: 'High'
      }
    };

    return challengeMap[challenge];
  }

  function getKuaRecommendations(kuaNumber) {
    const kuaDirections = {
      1: 'Face North, South, East, or Southeast when sleeping, working, and eating for best energy',
      2: 'Face Southwest, Northwest, West, or Northeast when sleeping, working, and eating for best energy',
      3: 'Face East, North, South, or Southeast when sleeping, working, and eating for best energy',
      4: 'Face Southeast, East, South, or North when sleeping, working, and eating for best energy',
      6: 'Face West, Northeast, Southwest, or Northwest when sleeping, working, and eating for best energy',
      7: 'Face Northwest, West, Southwest, or Northeast when sleeping, working, and eating for best energy',
      8: 'Face Northeast, Southwest, Northwest, or West when sleeping, working, and eating for best energy',
      9: 'Face South, Southeast, East, or North when sleeping, working, and eating for best energy'
    };

    return kuaDirections[kuaNumber] || 'Calculate your personal directions based on your birth year and gender for optimal energy alignment';
  }

  function filterByBudget(recommendations, budget) {
    const budgetFilters = {
      minimal: ['Free', 'Low'],
      low: ['Free', 'Low'],
      moderate: ['Free', 'Low', 'Low-Medium'],
      high: ['Free', 'Low', 'Low-Medium', 'Medium', 'Medium-High'],
      unlimited: ['Free', 'Low', 'Low-Medium', 'Medium', 'Medium-High', 'High']
    };

    const allowedCosts = budgetFilters[budget] || budgetFilters.moderate;
    return recommendations.filter(rec => allowedCosts.includes(rec.cost));
  }

  function calculateFengShuiScore(spaceAnalysis, elementAnalysis, clutterLevel, naturalLight, plantCount) {
    let totalScore = 0;
    let maxScore = 0;

    // Space analysis (40% weight)
    totalScore += spaceAnalysis.score * 0.4;
    maxScore += 100 * 0.4;

    // Element balance (30% weight)
    totalScore += elementAnalysis.score * 0.3;
    maxScore += 100 * 0.3;

    // Clutter level (15% weight)
    const clutterScore = Math.max(0, 100 - (clutterLevel - 1) * 25);
    totalScore += clutterScore * 0.15;
    maxScore += 100 * 0.15;

    // Natural light (10% weight)
    const lightScores = { excellent: 100, good: 75, limited: 50, poor: 25 };
    totalScore += (lightScores[naturalLight] || 50) * 0.1;
    maxScore += 100 * 0.1;

    // Plant presence (5% weight)
    const plantScore = Math.min(100, plantCount * 20);
    totalScore += plantScore * 0.05;
    maxScore += 100 * 0.05;

    return Math.round((totalScore / maxScore) * 100);
  }

  function displayResults(data) {
    const { fengShuiScore, spaceAnalysis, elementAnalysis, recommendations } = data;

    let html = `
      <div class="insight-cards">
        <div class="insight-card ${fengShuiScore >= 75 ? 'success' : fengShuiScore >= 50 ? 'warning' : 'info'}">
          <h6>🏠 Feng Shui Score</h6>
          <div class="big-number">${fengShuiScore}</div>
          <p class="insight-detail">${getScoreDescription(fengShuiScore)}</p>
        </div>
        <div class="insight-card info">
          <h6>🎯 Life Focus</h6>
          <div class="big-number" style="font-size: 1.2rem;">${getLifeFocusName(data.lifeFocus)}</div>
          <p class="insight-detail">Primary enhancement area</p>
        </div>
        <div class="insight-card success">
          <h6>💡 Recommendations</h6>
          <div class="big-number">${recommendations.length}</div>
          <p class="insight-detail">Personalized suggestions</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Current Space Analysis</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          
          ${spaceAnalysis.positiveAspects.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
              <h4 style="color: #28a745;">✅ Positive Aspects</h4>
              <ul style="margin: 0.5rem 0;">
                ${spaceAnalysis.positiveAspects.map(aspect => `<li>${aspect}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${spaceAnalysis.challenges.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
              <h4 style="color: #dc3545;">⚠️ Areas for Improvement</h4>
              <ul style="margin: 0.5rem 0;">
                ${spaceAnalysis.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div>
            <h4>🌟 Element Balance</h4>
            ${generateElementChart(elementAnalysis)}
          </div>
        </div>
      </div>

      ${data.kuaNumber ? `
        <div style="margin-top: 2rem;">
          <h3>🧭 Your Personal Feng Shui Profile</h3>
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Kua Number:</strong> ${data.kuaNumber}<br>
                <small>Based on your birth year and gender</small>
              </div>
              <div>
                <strong>Element Group:</strong> ${data.kuaNumber <= 4 || data.kuaNumber === 9 ? 'East Group' : 'West Group'}<br>
                <small>Determines your best directions</small>
              </div>
              <div>
                <strong>Home Size:</strong> ${data.squareFootage.toLocaleString()} sq ft<br>
                <small>Affects energy circulation</small>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 2rem;">
        <h3>💡 Personalized Recommendations</h3>
        <div style="display: grid; gap: 1rem;">
          ${recommendations.map((rec, index) => `
            <div style="background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid ${rec.priority === 'high' ? '#28a745' : '#17a2b8'};">
              <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: var(--accent);">${index + 1}. ${rec.title}</h4>
                <span style="background: ${rec.priority === 'high' ? '#28a745' : '#17a2b8'}; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-left: 1rem;">
                  ${rec.priority.toUpperCase()}
                </span>
              </div>
              <p style="margin: 0.5rem 0; color: #666;">${rec.description}</p>
              <div style="display: flex; gap: 1rem; font-size: 0.9rem; color: #888;">
                <span><strong>Cost:</strong> ${rec.cost}</span>
                <span><strong>Impact:</strong> ${rec.impact}</span>
                <span><strong>Category:</strong> ${rec.category}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${generateBaguaGuide(data.entranceDirection)}
      ${generateQuickStartGuide(data.enhancementBudget)}

      <div style="margin-top: 1.5rem; padding: 1rem; background: #e7f3ff; border-radius: 8px; border-left: 4px solid #17a2b8;">
        <strong>🌟 Remember:</strong> Feng Shui is about creating harmony and balance in your living space. 
        Start with small changes and observe how they make you feel. Trust your intuition and make adjustments 
        that resonate with you personally. The most important aspect is that your space feels good to you and 
        supports your well-being and goals.
      </div>
    `;

    result.innerHTML = html;
  }

  function getScoreDescription(score) {
    if (score >= 85) return 'Excellent feng shui';
    if (score >= 70) return 'Good energy flow';
    if (score >= 55) return 'Moderate harmony';
    if (score >= 40) return 'Needs improvement';
    return 'Significant challenges';
  }

  function getLifeFocusName(focus) {
    const names = {
      career: 'Career Growth',
      relationships: 'Love & Relationships',
      health: 'Health & Wellness',
      wealth: 'Wealth & Prosperity',
      family: 'Family Harmony',
      creativity: 'Creativity',
      knowledge: 'Knowledge',
      spirituality: 'Spirituality'
    };
    return names[focus] || focus;
  }

  function generateElementChart(elementAnalysis) {
    const { elementCounts } = elementAnalysis;
    const elements = [
      { name: 'Wood', count: elementCounts.wood, color: '#28a745', symbol: '🌳' },
      { name: 'Fire', count: elementCounts.fire, color: '#dc3545', symbol: '🔥' },
      { name: 'Earth', count: elementCounts.earth, color: '#ffc107', symbol: '🌍' },
      { name: 'Metal', count: elementCounts.metal, color: '#6c757d', symbol: '⚪' },
      { name: 'Water', count: elementCounts.water, color: '#17a2b8', symbol: '💧' }
    ];

    const maxCount = Math.max(...elements.map(e => e.count), 1);

    let html = '<div style="display: grid; gap: 0.5rem;">';
    
    elements.forEach(element => {
      const percentage = (element.count / maxCount) * 100;
      html += `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span style="min-width: 60px;">${element.symbol} ${element.name}</span>
          <div style="flex: 1; background: var(--card-bg); height: 20px; border-radius: 10px; overflow: hidden;">
            <div style="background: ${element.color}; height: 100%; width: ${percentage}%; border-radius: 10px;"></div>
          </div>
          <span style="min-width: 30px; text-align: right;">${element.count}</span>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  function generateBaguaGuide(entranceDirection) {
    return `
      <div style="margin-top: 2rem;">
        <h3>🧭 Bagua Map for Your Home</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <p style="margin-bottom: 1rem;">Based on your ${entranceDirection} entrance, here's how the Bagua areas align in your home:</p>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; max-width: 400px; margin: 0 auto;">
            ${generateBaguaGrid(entranceDirection)}
          </div>
          
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
            Use this map to locate the different life areas in your home. Focus enhancements on areas related to your current goals and challenges.
          </p>
        </div>
      </div>
    `;
  }

  function generateBaguaGrid(entranceDirection) {
    // Simplified Bagua grid based on entrance direction
    const baguaAreas = [
      'Wealth 💰', 'Fame 🌟', 'Relationships 💑',
      'Family 🌱', 'Health 🏠', 'Children 👨‍👩‍👧‍👦',
      'Knowledge 📚', 'Career 🎯', 'Helpful People 🙏'
    ];

    return baguaAreas.map((area, index) => {
      const isEntrance = index === 7; // Career area typically at entrance
      return `
        <div style="background: ${isEntrance ? 'var(--accent)' : 'white'}; color: ${isEntrance ? 'white' : 'black'}; padding: 0.8rem; text-align: center; border-radius: 6px; font-size: 0.8rem; border: 2px solid ${isEntrance ? 'var(--accent)' : 'var(--border)'};">
          ${area}
        </div>
      `;
    }).join('');
  }

  function generateQuickStartGuide(budget) {
    const budgetGuides = {
      minimal: [
        'Declutter all spaces, especially entrances',
        'Rearrange furniture for better traffic flow',
        'Open windows for fresh air and light',
        'Clean mirrors and windows'
      ],
      low: [
        'Add 2-3 healthy plants in living areas',
        'Introduce missing element colors with small decor',
        'Place pairs of objects in relationship area',
        'Light candles in dark corners'
      ],
      moderate: [
        'Invest in good lighting for dark areas',
        'Add a small water feature or fountain',
        'Purchase crystals for energy enhancement',
        'Buy new bedding in harmonious colors'
      ],
      high: [
        'Repaint rooms in feng shui colors',
        'Rearrange or buy new furniture',
        'Install better lighting throughout',
        'Add major water or plant features'
      ]
    };

    const guides = budgetGuides[budget] || budgetGuides.moderate;

    return `
      <div style="margin-top: 2rem;">
        <h3>🚀 Quick Start Guide (${budget.charAt(0).toUpperCase() + budget.slice(1)} Budget)</h3>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          <p style="margin-bottom: 1rem;">Start with these simple changes to immediately improve your space's feng shui:</p>
          <ol style="margin: 0;">
            ${guides.map(guide => `<li style="margin: 0.5rem 0;">${guide}</li>`).join('')}
          </ol>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
            Implement one change at a time and observe how it affects the energy in your space before moving to the next.
          </p>
        </div>
      </div>
    `;
  }
});