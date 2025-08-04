document.addEventListener("DOMContentLoaded", () => {
  const inputs = {
    archLength: document.getElementById("archLength"),
    archHeight: document.getElementById("archHeight"),
    archStyle: document.getElementById("archStyle"),
    density: document.getElementById("density"),
    primarySize: document.getElementById("primarySize"),
    mixedSizes: document.getElementById("mixedSizes"),
    colors: document.getElementById("colors"),
    occasion: document.getElementById("occasion")
  };
  
  const calculateBtn = document.getElementById("calculateBtn");
  const resultsSection = document.getElementById("results");
  
  // Balloon calculation data
  const balloonSizes = {
    5: { diameter: 12, name: "5\" (12 cm)", price: 0.10, coverage: 0.8 },
    9: { diameter: 23, name: "9\" (23 cm)", price: 0.15, coverage: 1.2 },
    11: { diameter: 28, name: "11\" (28 cm)", price: 0.20, coverage: 1.5 },
    12: { diameter: 30, name: "12\" (30 cm)", price: 0.25, coverage: 1.6 },
    16: { diameter: 40, name: "16\" (40 cm)", price: 0.40, coverage: 2.2 }
  };

  const densityFactors = {
    light: { factor: 0.7, name: "Light", description: "Airy look with gaps" },
    medium: { factor: 1.0, name: "Medium", description: "Balanced density" },
    dense: { factor: 1.4, name: "Dense", description: "Maximum coverage" },
    "extra-dense": { factor: 1.8, name: "Extra Dense", description: "Solid coverage" }
  };

  const archStyles = {
    classic: { multiplier: 1.0, name: "Classic", description: "Uniform balloons" },
    organic: { multiplier: 1.2, name: "Organic", description: "Natural appearance" },
    spiral: { multiplier: 1.1, name: "Spiral", description: "Color pattern" },
    gradient: { multiplier: 1.15, name: "Gradient", description: "Smooth transition" },
    asymmetric: { multiplier: 1.3, name: "Asymmetric", description: "Modern style" }
  };

  const occasionThemes = {
    birthday: {
      name: "Birthday Party",
      colors: ["bright pink", "blue", "yellow", "green"],
      mood: "fun and energetic"
    },
    wedding: {
      name: "Wedding",
      colors: ["white", "rose gold", "pastels", "cream"],
      mood: "elegant and romantic"
    },
    "baby-shower": {
      name: "Baby Shower",
      colors: ["soft pink", "baby blue", "mint", "lavender"],
      mood: "gentle and cozy"
    },
    graduation: {
      name: "Graduation",
      colors: ["gold", "navy", "black", "white"],
      mood: "celebratory and formal"
    },
    corporate: {
      name: "Corporate Event",
      colors: ["corporate colors", "neutrals", "metallic"],
      mood: "professional and stylish"
    },
    other: {
      name: "Other Event",
      colors: ["custom choice", "themed"],
      mood: "individual approach"
    }
  };

  // Add input listeners for real-time updates
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', debounce(calculateBalloons, 300));
    input.addEventListener('change', debounce(calculateBalloons, 300));
  });

  calculateBtn.addEventListener('click', calculateBalloons);

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

  function calculateBalloons() {
    const params = {
      length: parseFloat(inputs.archLength.value) || 0,
      height: parseFloat(inputs.archHeight.value) || 0,
      style: inputs.archStyle.value,
      density: inputs.density.value,
      primarySize: parseInt(inputs.primarySize.value),
      mixedSizes: inputs.mixedSizes.value === 'yes',
      colors: inputs.colors.value,
      occasion: inputs.occasion.value
    };

    // Validate inputs
    if (params.length < 0.5 || params.length > 20) {
      alert('Please enter a valid arch length (0.5-20 m)');
      return;
    }

    if (params.height < 0.5 || params.height > 5) {
      alert('Please enter a valid arch height (0.5-5 m)');
      return;
    }

    const results = calculateArchRequirements(params);
    displayResults(results, params);
  }

  function calculateArchRequirements(params) {
    // Calculate arch circumference (approximation for semi-circle)
    const archCircumference = params.length + (Math.PI * params.height / 2);
    
    // Base balloon count calculation
    const primaryBalloon = balloonSizes[params.primarySize];
    const baseBalloonsPerMeter = 100 / primaryBalloon.diameter; // Empirical formula
    
    // Apply modifiers
    const styleMultiplier = archStyles[params.style].multiplier;
    const densityFactor = densityFactors[params.density].factor;
    
    // Calculate primary balloon count
    let primaryCount = Math.round(archCircumference * baseBalloonsPerMeter * styleMultiplier * densityFactor);
    
    // Calculate mixed sizes if enabled
    let balloonBreakdown = {};
    let totalBalloons = primaryCount;
    
    if (params.mixedSizes) {
      // Distribution for mixed sizes
      balloonBreakdown[params.primarySize] = Math.round(primaryCount * 0.6);
      
      // Add smaller size if different from primary
      if (params.primarySize > 5) {
        const availableSizes = [5, 9, 11, 12, 16];
        const currentIndex = availableSizes.indexOf(params.primarySize);
        if (currentIndex > 0) {
          const smallerSize = availableSizes[currentIndex - 1];
          balloonBreakdown[smallerSize] = Math.round(primaryCount * 0.3);
        }
      }
      
      // Add larger size if different from primary
      if (params.primarySize < 16) {
        const availableSizes = [5, 9, 11, 12, 16];
        const currentIndex = availableSizes.indexOf(params.primarySize);
        if (currentIndex < availableSizes.length - 1) {
          const largerSize = availableSizes[currentIndex + 1];
          balloonBreakdown[largerSize] = Math.round(primaryCount * 0.1);
        }
      }
      
      totalBalloons = Object.values(balloonBreakdown).reduce((sum, count) => sum + count, 0);
    } else {
      balloonBreakdown[params.primarySize] = primaryCount;
    }

    // Add safety margin (10-15%)
    const safetyMargin = 1.12;
    totalBalloons = Math.round(totalBalloons * safetyMargin);
    
    // Update breakdown with safety margin
    Object.keys(balloonBreakdown).forEach(size => {
      balloonBreakdown[size] = Math.round(balloonBreakdown[size] * safetyMargin);
    });

    // Calculate estimated cost
    let totalCost = 0;
    Object.entries(balloonBreakdown).forEach(([size, count]) => {
      totalCost += count * balloonSizes[size].price;
    });
    
    // Add supplies cost (frame, accessories)
    const suppliesCost = Math.round(archCircumference * 2); // $2 per meter
    totalCost += suppliesCost;
    totalCost = Math.round(totalCost);

    // Calculate creation time
    const baseTimePerBalloon = 1.5; // minutes
    const setupTime = 60; // minutes
    const totalMinutes = (totalBalloons * baseTimePerBalloon) + setupTime;
    const creationTime = Math.round(totalMinutes / 60 * 10) / 10; // hours

    return {
      totalBalloons,
      balloonBreakdown,
      totalCost,
      creationTime,
      archCircumference: Math.round(archCircumference * 10) / 10,
      style: archStyles[params.style],
      density: densityFactors[params.density],
      occasion: occasionThemes[params.occasion]
    };
  }

  function displayResults(results, params) {
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Update insight cards
    document.getElementById('totalBalloons').textContent = results.totalBalloons;
    document.getElementById('estimatedCost').textContent = results.totalCost;
    document.getElementById('creationTime').textContent = results.creationTime;

    // Create balloon breakdown
    const breakdownContainer = document.getElementById('balloonBreakdown');
    const breakdown = Object.entries(results.balloonBreakdown).map(([size, count]) => {
      const balloonInfo = balloonSizes[size];
      return `
        <div class="breakdown-item ${size == params.primarySize ? 'primary' : ''}">
          <div class="size">${balloonInfo.name}</div>
          <div class="count">${count}</div>
          <div class="description">balloons of this size</div>
        </div>
      `;
    }).join('');
    breakdownContainer.innerHTML = breakdown;

    // Create color recommendations
    const colorContainer = document.getElementById('colorRecommendations');
    const colorRecommendations = generateColorRecommendations(params, results);
    colorContainer.innerHTML = colorRecommendations.map(color => `
      <div class="color-item">
        <div class="color-name">${color.name}</div>
        <div class="color-description">${color.description}</div>
      </div>
    `).join('');

    // Create supplies list
    const suppliesContainer = document.getElementById('suppliesList');
    const supplies = generateSuppliesList(results, params);
    suppliesContainer.innerHTML = supplies.map(item => `
      <div class="supply-item">
        <div class="item-name">${item.name}</div>
        <div class="item-details">${item.details}</div>
      </div>
    `).join('');

    // Create creation tips
    const tipsContainer = document.getElementById('creationTips');
    const tips = generateCreationTips(results, params);
    tipsContainer.innerHTML = tips.map(tip => `
      <div class="tip-item">
        <span class="tip-icon">${tip.icon}</span>
        <span>${tip.text}</span>
      </div>
    `).join('');

    // Add animation
    resultsSection.style.animation = 'none';
    setTimeout(() => {
      resultsSection.style.animation = 'fadeIn 0.5s ease';
    }, 10);
  }

  function generateColorRecommendations(params, results) {
    const theme = results.occasion;
    const recommendations = [];

    if (params.colors === '1') {
      recommendations.push({
        name: "Monochrome Scheme",
        description: `Use shades of one color for ${theme.mood} appearance`
      });
    } else if (params.colors === '2') {
      recommendations.push({
        name: "Dual Color Scheme",
        description: `Combine two colors: ${theme.colors.slice(0, 2).join(' + ')}`
      });
    } else if (params.colors === 'gradient') {
      recommendations.push({
        name: "Gradient Scheme",
        description: "Smooth transition from light to dark shades"
      });
    } else {
      recommendations.push({
        name: "Multi-Color Scheme",
        description: `Recommended colors: ${theme.colors.join(', ')}`
      });
    }

    recommendations.push({
      name: "Event Theme",
      description: `For ${theme.name.toLowerCase()} events, use ${theme.mood} approach`
    });

    return recommendations;
  }

  function generateSuppliesList(results, params) {
    const supplies = [
      {
        name: "Balloons",
        details: `${results.totalBalloons} pcs (includes 12% safety margin)`
      },
      {
        name: "Frame",
        details: `${results.archCircumference} m of wire or ${Math.ceil(results.archCircumference/3)} PVC pipes`
      },
      {
        name: "Balloon Pump",
        details: "Hand or electric balloon pump (essential!)"
      },
      {
        name: "Fasteners",
        details: `${Math.ceil(results.totalBalloons/10)} zip ties or roll of adhesive tape`
      }
    ];

    if (params.mixedSizes) {
      supplies.push({
        name: "Marking",
        details: "Marker to label balloon sizes during inflation"
      });
    }

    if (params.style === 'organic') {
      supplies.push({
        name: "Additional Decor",
        details: "Artificial greenery, ribbons, or other decorative elements"
      });
    }

    return supplies;
  }

  function generateCreationTips(results, params) {
    const tips = [
      {
        icon: "🎈",
        text: `Inflate balloons gradually - this will take approximately ${results.creationTime} hours`
      },
      {
        icon: "📏",
        text: "Use a sizing template for uniform balloon sizes"
      },
      {
        icon: "🔧",
        text: "Build the arch in sections, then connect them together"
      }
    ];

    if (params.style === 'organic') {
      tips.push({
        icon: "🌿",
        text: "For organic arches, mix sizes randomly without clear patterns"
      });
    }

    if (params.density === 'dense' || params.density === 'extra-dense') {
      tips.push({
        icon: "⏰",
        text: "Dense arches require more time - start a day earlier"
      });
    }

    if (params.occasion === 'wedding') {
      tips.push({
        icon: "💒",
        text: "For weddings, avoid bright colors and choose pastel tones"
      });
    }

    tips.push({
      icon: "💡",
      text: "Always test your color scheme on a small section first"
    });

    return tips;
  }

  // Initialize with default calculation
  calculateBalloons();
});

// Add additional styles
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .arch-summary {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    border: 2px solid #dee2e6;
  }

  .arch-summary h5 {
    margin: 0 0 1rem 0;
    color: var(--main-color);
    font-size: 1.1rem;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .summary-item {
    background: white;
    padding: 0.75rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #dee2e6;
  }

  .summary-label {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  .summary-value {
    font-weight: 600;
    color: var(--accent);
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .summary-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
document.head.appendChild(additionalStyles);