document.addEventListener("DOMContentLoaded", () => {
  const inputs = {
    height: document.getElementById("height"),
    neckSize: document.getElementById("neckSize"),
    torsoLength: document.getElementById("torsoLength"),
    knotStyle: document.getElementById("knotStyle"),
    waistHeight: document.getElementById("waistHeight"),
    occasion: document.getElementById("occasion")
  };
  
  const calculateBtn = document.getElementById("calculateBtn");
  const resultsSection = document.getElementById("results");
  
  // Tie data and calculations
  const knotFactors = {
    simple: { factor: 1.0, name: "Simple knot", complexity: "Easy" },
    "four-in-hand": { factor: 1.1, name: "Four-in-hand", complexity: "Medium" },
    "half-windsor": { factor: 1.2, name: "Half Windsor", complexity: "Medium" },
    windsor: { factor: 1.4, name: "Windsor", complexity: "Complex" },
    pratt: { factor: 1.3, name: "Pratt", complexity: "Complex" }
  };

  const torsoFactors = {
    short: { factor: 0.95, name: "Short torso", description: "Relatively long legs" },
    medium: { factor: 1.0, name: "Medium torso", description: "Balanced proportions" },
    long: { factor: 1.05, name: "Long torso", description: "Relatively short legs" }
  };

  const waistFactors = {
    low: { factor: 1.05, name: "Low waist", description: "Modern style" },
    medium: { factor: 1.0, name: "Classic waist", description: "Standard fit" },
    high: { factor: 0.95, name: "High waist", description: "Formal style" }
  };

  const occasionStyles = {
    business: {
      name: "Business",
      widthRange: [7, 9],
      colors: ["navy blue", "burgundy", "gray", "black"],
      patterns: ["solid colors", "small dots", "thin diagonal stripes"]
    },
    formal: {
      name: "Formal",
      widthRange: [8, 10],
      colors: ["black", "navy blue", "silver", "white"],
      patterns: ["solid colors", "classic stripes", "elegant patterns"]
    },
    casual: {
      name: "Casual",
      widthRange: [6, 8],
      colors: ["any color", "bright", "pastels"],
      patterns: ["geometric", "floral", "modern prints"]
    },
    wedding: {
      name: "Wedding",
      widthRange: [8, 9],
      colors: ["pastels", "light pink", "champagne", "silver"],
      patterns: ["solid colors", "jacquard", "subtle patterns"]
    }
  };

  // Add input listeners for real-time updates
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', debounce(calculateTieLength, 300));
    input.addEventListener('change', debounce(calculateTieLength, 300));
  });

  calculateBtn.addEventListener('click', calculateTieLength);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function calculateTieLength() {
    const measurements = {
      height: parseFloat(inputs.height.value) || 0,
      neckSize: parseFloat(inputs.neckSize.value) || 0,
      torsoLength: inputs.torsoLength.value,
      knotStyle: inputs.knotStyle.value,
      waistHeight: inputs.waistHeight.value,
      occasion: inputs.occasion.value
    };

    // Validate inputs
    if (measurements.height < 150 || measurements.height > 220) {
      alert('Please enter a valid height (150-220 cm)');
      return;
    }

    if (measurements.neckSize < 35 || measurements.neckSize > 50) {
      alert('Please enter a valid neck size (35-50 cm)');
      return;
    }

    const results = calculateRecommendations(measurements);
    displayResults(results, measurements);
  }

  function calculateRecommendations(m) {
    // Base length calculation (empirical formula based on height)
    let baseLength = 120 + (m.height - 165) * 0.8;
    
    // Apply modifiers
    const knotFactor = knotFactors[m.knotStyle].factor;
    const torsoFactor = torsoFactors[m.torsoLength].factor;
    const waistFactor = waistFactors[m.waistHeight].factor;
    const neckAdjustment = (m.neckSize - 39) * 1.5; // Adjustment for neck size
    
    // Calculate final length
    const idealLength = Math.round(baseLength * knotFactor * torsoFactor * waistFactor + neckAdjustment);
    
    // Determine size category
    let sizeCategory, sizeDescription;
    if (idealLength <= 145) {
      sizeCategory = "Short";
      sizeDescription = "For shorter men";
    } else if (idealLength <= 160) {
      sizeCategory = "Standard";
      sizeDescription = "Universal size";
    } else {
      sizeCategory = "Long";
      sizeDescription = "For tall men";
    }

    // Determine optimal width based on height and occasion
    const occasionData = occasionStyles[m.occasion];
    const heightFactor = m.height < 170 ? 0.9 : m.height > 185 ? 1.1 : 1.0;
    const baseWidth = (occasionData.widthRange[0] + occasionData.widthRange[1]) / 2;
    const idealWidth = Math.round(baseWidth * heightFactor * 10) / 10;

    return {
      length: idealLength,
      width: idealWidth,
      sizeCategory,
      sizeDescription,
      occasionData,
      knot: knotFactors[m.knotStyle],
      torso: torsoFactors[m.torsoLength],
      waist: waistFactors[m.waistHeight]
    };
  }

  function displayResults(results, measurements) {
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Update insight cards
    document.getElementById('tieLength').textContent = results.length;
    document.getElementById('tieWidth').textContent = results.width;
    document.getElementById('tieSize').textContent = results.sizeCategory;
    document.getElementById('sizeDescription').textContent = results.sizeDescription;

    // Create personal recommendations
    const recommendationsContainer = document.getElementById('personalRecommendations');
    const recommendations = [
      {
        emoji: "👔",
        title: "Your Knot Style",
        description: `${results.knot.name} - ${results.knot.complexity.toLowerCase()} to execute`,
        highlight: true
      },
      {
        emoji: "📏",
        title: "Body Type",
        description: `${results.torso.name} - ${results.torso.description.toLowerCase()}`,
        highlight: false
      },
      {
        emoji: "👖",
        title: "Waist Height",
        description: `${results.waist.name} - ${results.waist.description.toLowerCase()}`,
        highlight: false
      },
      {
        emoji: "🎯",
        title: "Occasion Type",
        description: `${results.occasionData.name} - appropriate colors and styles`,
        highlight: true
      }
    ];

    recommendationsContainer.innerHTML = recommendations.map(rec => `
      <div class="recommendation-item ${rec.highlight ? 'highlight' : ''}">
        <span class="emoji">${rec.emoji}</span>
        <div class="title">${rec.title}</div>
        <div class="description">${rec.description}</div>
      </div>
    `).join('');

    // Create styling tips
    const stylingContainer = document.getElementById('stylingTips');
    const tips = generateStylingTips(results, measurements);
    stylingContainer.innerHTML = tips.map(tip => `
      <div class="tip-item">
        <span class="tip-icon">${tip.icon}</span>
        <span>${tip.text}</span>
      </div>
    `).join('');

    // Create shopping guide
    const shoppingContainer = document.getElementById('shoppingGuide');
    const shoppingGuide = generateShoppingGuide(results, measurements);
    shoppingContainer.innerHTML = shoppingGuide.map(item => `
      <div class="shopping-item">
        <div class="feature">${item.feature}</div>
        <div class="details">${item.details}</div>
      </div>
    `).join('');

    // Add animation
    resultsSection.style.animation = 'none';
    setTimeout(() => {
      resultsSection.style.animation = 'fadeIn 0.5s ease';
    }, 10);
  }

  function generateStylingTips(results, measurements) {
    const tips = [
      {
        icon: "🎯",
        text: `The tie tip should touch your belt buckle - this is the classic etiquette rule`
      },
      {
        icon: "📐",
        text: `${results.width}cm width is perfect for your height and occasion type`
      }
    ];

    // Add specific tips based on measurements
    if (measurements.height > 185) {
      tips.push({
        icon: "📏",
        text: "As a tall man, avoid ties that are too short - they will disrupt your proportions"
      });
    } else if (measurements.height < 170) {
      tips.push({
        icon: "⚖️",
        text: "Shorter men should choose narrower ties for a more balanced appearance"
      });
    }

    if (results.knot.complexity === "Complex") {
      tips.push({
        icon: "🌀",
        text: "Complex knots look elegant but require more time and a longer tie"
      });
    }

    // Add occasion-specific tips
    const occasionTips = {
      business: "💼 For office wear, choose conservative colors - navy, burgundy, or gray",
      formal: "🎩 For formal events, classic solid colors or subtle patterns work best",
      casual: "😎 In casual settings, you can experiment with bright colors and modern prints",
      wedding: "💒 Wedding ties are best in pastel tones that harmonize with the overall color scheme"
    };

    tips.push({
      icon: occasionTips[measurements.occasion].split(' ')[0],
      text: occasionTips[measurements.occasion].substring(2)
    });

    return tips;
  }

  function generateShoppingGuide(results, measurements) {
    const guide = [
      {
        feature: "Tie Length",
        details: `Look for ties ${results.length}±3 cm long or ${results.sizeCategory.toLowerCase()} sizes`
      },
      {
        feature: "Tie Width",
        details: `Optimal width: ${results.width-0.5}-${results.width+0.5} cm for your body type`
      },
      {
        feature: "Material",
        details: "Silk is the best choice. Alternatives: quality polyester or silk blends"
      },
      {
        feature: "Colors",
        details: `For ${results.occasionData.name.toLowerCase()} occasions: ${results.occasionData.colors.join(', ')}`
      },
      {
        feature: "Patterns",
        details: `Suitable patterns: ${results.occasionData.patterns.join(', ')}`
      }
    ];

    // Add specific recommendations based on body type
    if (measurements.neckSize > 42) {
      guide.push({
        feature: "Tie Thickness",
        details: "Choose medium-thickness ties - they drape better on larger necks"
      });
    }

    return guide;
  }

  // Initialize with default calculation
  calculateTieLength();
});

// Add additional styles for English version
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .measurement-summary {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    border: 2px solid #dee2e6;
  }

  .measurement-summary h5 {
    margin: 0 0 1rem 0;
    color: var(--main-color);
    font-size: 1.1rem;
  }

  .measurement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .measurement-card {
    background: white;
    padding: 0.75rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #dee2e6;
  }

  .measurement-label {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  .measurement-value {
    font-weight: 600;
    color: var(--accent);
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .measurement-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
document.head.appendChild(additionalStyles);