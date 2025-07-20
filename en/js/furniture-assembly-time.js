document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('assembly-time-form');
  const result = document.getElementById('assembly-time-result');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const furnitureType = document.getElementById('furniture-type').value;
      const experienceLevel = document.getElementById('experience-level').value;
      const availableTools = document.getElementById('available-tools').value;
      const workspace = document.getElementById('workspace').value;
      const instructionQuality = document.getElementById('instruction-quality').value;
      const helperAvailable = document.getElementById('helper-available').value;
      const professionalCost = parseFloat(document.getElementById('professional-cost').value) || 0;
      const hourlyValue = parseFloat(document.getElementById('hourly-value').value);
      
      if (!furnitureType || !experienceLevel || !availableTools || !workspace || !instructionQuality || !helperAvailable || hourlyValue <= 0) {
        result.textContent = "Please fill in all required fields.";
        return;
      }
      
      // Parse input data
      const [furnitureName, baseTime, complexity] = furnitureType.split(',');
      const [expLevel, expMultiplier] = experienceLevel.split(',');
      const [toolLevel, toolMultiplier] = availableTools.split(',');
      const [workspaceLevel, workspaceMultiplier] = workspace.split(',');
      const [instrLevel, instrMultiplier] = instructionQuality.split(',');
      const [helperLevel, helperMultiplier] = helperAvailable.split(',');
      
      const baseHours = parseFloat(baseTime);
      const expFactor = parseFloat(expMultiplier);
      const toolFactor = parseFloat(toolMultiplier);
      const workspaceFactor = parseFloat(workspaceMultiplier);
      const instrFactor = parseFloat(instrMultiplier);
      const helperFactor = parseFloat(helperMultiplier);
      
      // Calculate total assembly time
      const totalTimeHours = baseHours * expFactor * toolFactor * workspaceFactor * instrFactor * helperFactor;
      const totalTimeMinutes = totalTimeHours * 60;
      
      // Calculate time ranges (±25%)
      const minTime = totalTimeHours * 0.75;
      const maxTime = totalTimeHours * 1.25;
      
      // Calculate costs
      const diyTimeCost = totalTimeHours * hourlyValue;
      const totalDiyCost = diyTimeCost; // Just time cost for now
      
      // Break down time by phases
      const prepTime = totalTimeHours * 0.15; // 15% for preparation
      const assemblyTime = totalTimeHours * 0.70; // 70% for actual assembly
      const finishingTime = totalTimeHours * 0.15; // 15% for finishing touches
      
      // Calculate break recommendations
      const recommendedBreaks = Math.ceil(totalTimeHours / 2); // Break every 2 hours
      const totalProjectTime = totalTimeHours + (recommendedBreaks * 0.25); // Add break time
      
      // Generate difficulty assessment
      const difficultyScore = getDifficultyScore(complexity, expLevel, instrLevel);
      const difficultyRating = getDifficultyRating(difficultyScore);
      
      // Generate recommendations
      const recommendations = getRecommendations(complexity, expLevel, totalTimeHours);
      
      // Tool requirements
      const requiredTools = getRequiredTools(complexity);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Assembly Time Estimate:</h4>
          <p>Furniture: ${getFurnitureName(furnitureName)}</p>
          <p>Complexity: ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}</p>
          <p>Your experience: ${expLevel}</p>
          <p><strong>Estimated time: ${formatTime(totalTimeHours)}</strong></p>
          <p>Time range: ${formatTime(minTime)} - ${formatTime(maxTime)}</p>
        </div>
        
        <div class="result-breakdown">
          <h4>Time Breakdown:</h4>
          <p>🔧 Preparation: ${formatTime(prepTime)}</p>
          <p>⚒️ Assembly: ${formatTime(assemblyTime)}</p>
          <p>✨ Finishing: ${formatTime(finishingTime)}</p>
          <p>☕ Recommended breaks: ${recommendedBreaks} breaks (15 min each)</p>
          <p><strong>Total project time: ${formatTime(totalProjectTime)}</strong></p>
        </div>
        
        <div class="result-difficulty">
          <h4>Difficulty Assessment:</h4>
          <p><strong>Difficulty rating: ${difficultyRating}</strong></p>
          <p>Key factors affecting time:</p>
          <ul>
            <li>Experience level: ${getImpactDescription(expFactor)}</li>
            <li>Tool availability: ${getImpactDescription(toolFactor)}</li>
            <li>Workspace: ${getImpactDescription(workspaceFactor)}</li>
            <li>Instructions: ${getImpactDescription(instrFactor)}</li>
            <li>Helper availability: ${getImpactDescription(helperFactor)}</li>
          </ul>
        </div>
        
        <div class="result-cost">
          <h4>Cost Analysis:</h4>
          <p><strong>DIY time value: $${diyTimeCost.toFixed(2)}</strong></p>
          <p>Your time investment: ${formatTime(totalTimeHours)} @ $${hourlyValue}/hour</p>
          ${professionalCost > 0 ? `
            <p><strong>Professional assembly: $${professionalCost.toFixed(2)}</strong></p>
            <p><strong>Savings by DIY: $${(professionalCost - totalDiyCost).toFixed(2)}</strong></p>
            <p>Value per hour saved: $${((professionalCost - totalDiyCost) / totalTimeHours).toFixed(2)}</p>
            <p>Recommendation: ${professionalCost < diyTimeCost ? '💰 Professional assembly is cost-effective' : '🔨 DIY saves money'}</p>
          ` : ''}
        </div>
        
        <div class="result-schedule">
          <h4>Scheduling Recommendations:</h4>
          <p>📅 <strong>Best time to start:</strong> ${getBestStartTime(totalTimeHours)}</p>
          <p>🗓️ <strong>Project duration:</strong> ${getProjectDuration(totalProjectTime)}</p>
          <p>⏰ <strong>Break schedule:</strong> ${getBreakSchedule(totalTimeHours)}</p>
          <p>👥 <strong>Helper needed:</strong> ${getHelperNeeds(complexity, totalTimeHours)}</p>
        </div>
        
        <div class="result-tools">
          <h4>Required Tools:</h4>
          ${requiredTools.map(tool => `<p>🔧 ${tool}</p>`).join('')}
          <p>💡 <strong>Tool tip:</strong> ${getToolTip(toolLevel)}</p>
        </div>
        
        <div class="result-preparation">
          <h4>Preparation Checklist:</h4>
          <p>📦 Unbox and inventory all parts (check against parts list)</p>
          <p>📋 Read instructions completely before starting</p>
          <p>🧹 Clear adequate workspace (${getWorkspaceSize(complexity)})</p>
          <p>🔧 Gather all necessary tools and have them within reach</p>
          <p>📱 Have good lighting and consider phone flashlight for tight spaces</p>
          <p>🥤 Prepare water and snacks for longer assembly sessions</p>
        </div>
        
        <div class="result-tips">
          <h4>Assembly Tips:</h4>
          ${recommendations.map(tip => `<p>${tip}</p>`).join('')}
        </div>
        
        <div class="result-troubleshooting">
          <h4>Common Issues & Solutions:</h4>
          <p>🔩 <strong>Stripped screws:</strong> ${getScrewTips()}</p>
          <p>📐 <strong>Parts don't align:</strong> ${getAlignmentTips()}</p>
          <p>📋 <strong>Confusing instructions:</strong> ${getInstructionTips()}</p>
          <p>💪 <strong>Heavy lifting:</strong> ${getLiftingTips()}</p>
          <p>⏰ <strong>Taking too long:</strong> ${getTimeTips()}</p>
        </div>
        
        <div class="result-safety">
          <h4>Safety Considerations:</h4>
          <p>🥽 Wear safety glasses when drilling or hammering</p>
          <p>👥 Get help with heavy pieces - don't risk injury</p>
          <p>🚶 Take breaks to avoid fatigue and mistakes</p>
          <p>🔌 Ensure power tools are in good condition</p>
          <p>📍 Keep small parts away from children and pets</p>
          <p>🏠 Protect floors with cardboard or moving blankets</p>
        </div>
        
        <div class="result-finishing">
          <h4>Finishing Steps:</h4>
          <p>🧽 Clean the furniture thoroughly</p>
          <p>🔧 Double-check all connections and tighten as needed</p>
          <p>📏 Verify the piece is level and stable</p>
          <p>📋 Keep assembly instructions for future reference</p>
          <p>🗑️ Properly dispose of packaging materials</p>
          <p>📸 Take a photo of your completed project!</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Post-Assembly Maintenance:</h4>
          <p>🔄 Re-tighten hardware after 30 days of use</p>
          <p>🧼 Follow manufacturer's cleaning recommendations</p>
          <p>📅 Schedule periodic inspections for wear</p>
          <p>🔧 Keep spare hardware in a labeled bag</p>
          <p>📖 Register product for warranty if applicable</p>
        </div>
      `;
    });
  }

  function getFurnitureName(code) {
    const names = {
      'bookshelf-small': 'Small Bookshelf',
      'chair-basic': 'Basic Chair',
      'side-table': 'Side Table/Nightstand',
      'stool': 'Bar Stool/Simple Stool',
      'dresser-small': 'Small Dresser',
      'desk-basic': 'Basic Desk',
      'bed-frame': 'Bed Frame',
      'bookshelf-large': 'Large Bookshelf',
      'dining-table': 'Dining Table',
      'dresser-large': 'Large Dresser',
      'wardrobe-small': 'Small Wardrobe',
      'entertainment-center': 'Entertainment Center',
      'kitchen-cabinet': 'Kitchen Cabinet Set',
      'office-desk-complex': 'Complex Office Desk',
      'wardrobe-large': 'Large Wardrobe System',
      'modular-storage': 'Modular Storage System',
      'murphy-bed': 'Murphy Bed',
      'custom-closet': 'Custom Closet System'
    };
    return names[code] || code;
  }

  function formatTime(hours) {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours < 2) {
      const minutes = Math.round((hours % 1) * 60);
      return `1 hour ${minutes > 0 ? minutes + ' minutes' : ''}`.trim();
    } else {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours % 1) * 60);
      return `${wholeHours} hours ${minutes > 0 ? minutes + ' minutes' : ''}`.trim();
    }
  }

  function getDifficultyScore(complexity, experience, instructions) {
    const complexityScores = { 'simple': 1, 'moderate': 2, 'complex': 3, 'advanced': 4 };
    const experienceScores = { 'beginner': 4, 'novice': 3, 'intermediate': 2, 'experienced': 1 };
    const instructionScores = { 'poor': 4, 'average': 3, 'good': 2, 'excellent': 1 };
    
    return complexityScores[complexity] + experienceScores[experience] + instructionScores[instructions];
  }

  function getDifficultyRating(score) {
    if (score <= 4) return '🟢 Easy';
    if (score <= 7) return '🟡 Moderate';
    if (score <= 10) return '🟠 Challenging';
    return '🔴 Very Difficult';
  }

  function getImpactDescription(factor) {
    if (factor <= 0.7) return '⚡ Significantly speeds up assembly';
    if (factor <= 0.9) return '✅ Helps with assembly time';
    if (factor <= 1.1) return '➖ Neutral impact';
    if (factor <= 1.3) return '⚠️ Slows down assembly';
    return '🐌 Significantly increases time';
  }

  function getBestStartTime(hours) {
    if (hours <= 2) return 'Any time with good lighting';
    if (hours <= 4) return 'Morning start recommended';
    if (hours <= 8) return 'Early morning start essential';
    return 'Plan for multi-day project';
  }

  function getProjectDuration(totalHours) {
    if (totalHours <= 4) return 'Single session';
    if (totalHours <= 8) return 'Full day project';
    return 'Multi-day project recommended';
  }

  function getBreakSchedule(hours) {
    if (hours <= 2) return 'One break halfway through';
    if (hours <= 4) return 'Breaks every 2 hours';
    return 'Breaks every 1.5-2 hours';
  }

  function getHelperNeeds(complexity, hours) {
    if (complexity === 'simple') return 'Helper not required but can be helpful';
    if (complexity === 'moderate') return 'Helper recommended for lifting and alignment';
    if (complexity === 'complex') return 'Helper strongly recommended';
    return 'Helper essential for safety and efficiency';
  }

  function getRequiredTools(complexity) {
    const basicTools = ['Phillips head screwdriver', 'Flathead screwdriver', 'Hammer'];
    const moderateTools = [...basicTools, 'Allen key set', 'Level', 'Measuring tape'];
    const complexTools = [...moderateTools, 'Power drill', 'Socket wrench set'];
    const advancedTools = [...complexTools, 'Impact driver', 'Stud finder', 'Circular saw (possibly)'];
    
    const toolSets = {
      'simple': basicTools,
      'moderate': moderateTools,
      'complex': complexTools,
      'advanced': advancedTools
    };
    
    return toolSets[complexity] || basicTools;
  }

  function getToolTip(toolLevel) {
    const tips = {
      'basic': 'Consider borrowing or buying a power drill to save significant time',
      'standard': 'Your tool set should handle this project well',
      'power': 'Excellent tool selection will make assembly much faster',
      'professional': 'Your professional tools will make this assembly very efficient'
    };
    return tips[toolLevel] || '';
  }

  function getWorkspaceSize(complexity) {
    const sizes = {
      'simple': 'at least 6x6 feet',
      'moderate': 'at least 8x8 feet', 
      'complex': 'at least 10x10 feet',
      'advanced': 'at least 12x12 feet or garage space'
    };
    return sizes[complexity] || 'adequate space';
  }

  function getRecommendations(complexity, experience, hours) {
    const recommendations = [];
    
    if (experience === 'beginner') {
      recommendations.push('🎥 Watch online assembly videos for your specific furniture model');
      recommendations.push('📞 Don\'t hesitate to call customer service if you\'re stuck');
    }
    
    if (hours > 4) {
      recommendations.push('📅 Consider breaking the project into multiple sessions');
      recommendations.push('🍕 Plan meals/snacks to maintain energy levels');
    }
    
    if (complexity === 'complex' || complexity === 'advanced') {
      recommendations.push('👥 Strongly consider getting an experienced helper');
      recommendations.push('📱 Take photos before disassembling if you need to move pieces');
    }
    
    recommendations.push('🔄 Loosely assemble first, then tighten all connections');
    recommendations.push('📏 Double-check measurements and alignment before final tightening');
    
    return recommendations;
  }

  function getScrewTips() {
    return 'Use proper bit size, don\'t over-tighten, back out and retry if resistance increases';
  }

  function getAlignmentTips() {
    return 'Check all parts are correct orientation, loosely assemble first, verify with instructions';
  }

  function getInstructionTips() {
    return 'Look for online videos, check manufacturer website, contact customer service';
  }

  function getLiftingTips() {
    return 'Get help for pieces over 40 lbs, lift with legs not back, use furniture sliders';
  }

  function getTimeTips() {
    return 'Take breaks to avoid frustration, double-check you\'re following steps correctly, consider professional help';
  }
});