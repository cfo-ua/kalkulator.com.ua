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
    5: { diameter: 12, name: "5\" (12 см)", price: 2, coverage: 0.8 },
    9: { diameter: 23, name: "9\" (23 см)", price: 3, coverage: 1.2 },
    11: { diameter: 28, name: "11\" (28 см)", price: 4, coverage: 1.5 },
    12: { diameter: 30, name: "12\" (30 см)", price: 5, coverage: 1.6 },
    16: { diameter: 40, name: "16\" (40 см)", price: 8, coverage: 2.2 }
  };

  const densityFactors = {
    light: { factor: 0.7, name: "Ажурна", description: "Повітряний вигляд з проміжками" },
    medium: { factor: 1.0, name: "Середня", description: "Збалансована щільність" },
    dense: { factor: 1.4, name: "Щільна", description: "Максимальне заповнення" },
    "extra-dense": { factor: 1.8, name: "Дуже щільна", description: "Суцільне покриття" }
  };

  const archStyles = {
    classic: { multiplier: 1.0, name: "Класична", description: "Рівномірні кульки" },
    organic: { multiplier: 1.2, name: "Органічна", description: "Природний вигляд" },
    spiral: { multiplier: 1.1, name: "Спіральна", description: "Кольоровий візерунок" },
    gradient: { multiplier: 1.15, name: "Градієнтна", description: "Плавний перехід" },
    asymmetric: { multiplier: 1.3, name: "Асиметрична", description: "Сучасний стиль" }
  };

  const occasionThemes = {
    birthday: {
      name: "День народження",
      colors: ["яскраво-рожевий", "синій", "жовтий", "зелений"],
      mood: "веселий та енергійний"
    },
    wedding: {
      name: "Весілля",
      colors: ["білий", "рожево-золотий", "пастельні", "кремовий"],
      mood: "елегантний та романтичний"
    },
    "baby-shower": {
      name: "Baby shower",
      colors: ["ніжно-рожевий", "блакитний", "м'ятний", "лавандовий"],
      mood: "ніжний та затишний"
    },
    graduation: {
      name: "Випускний",
      colors: ["золотий", "синій", "чорний", "білий"],
      mood: "урочистий та святковий"
    },
    corporate: {
      name: "Корпоратив",
      colors: ["корпоративні", "нейтральні", "металік"],
      mood: "професійний та стильний"
    },
    other: {
      name: "Інший",
      colors: ["за вибором", "тематичні"],
      mood: "індивідуальний підхід"
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
      alert('Будь ласка, введіть коректну довжину арки (0.5-20 м)');
      return;
    }

    if (params.height < 0.5 || params.height > 5) {
      alert('Будь ласка, введіть коректну висоту арки (0.5-5 м)');
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
    const suppliesCost = Math.round(archCircumference * 50); // 50 UAH per meter
    totalCost += suppliesCost;

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
          <div class="description">кульок цього розміру</div>
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
        name: "Монохромна схема",
        description: `Використовуйте відтінки одного кольору для ${theme.mood} вигляду`
      });
    } else if (params.colors === '2') {
      recommendations.push({
        name: "Дуальна схема",
        description: `Поєднання двох кольорів: ${theme.colors.slice(0, 2).join(' + ')}`
      });
    } else if (params.colors === 'gradient') {
      recommendations.push({
        name: "Градієнтна схема",
        description: "Плавний перехід від світлого до темного відтінку"
      });
    } else {
      recommendations.push({
        name: "Багатокольорова схема",
        description: `Рекомендовані кольори: ${theme.colors.join(', ')}`
      });
    }

    recommendations.push({
      name: "Тематичність",
      description: `Для ${theme.name.toLowerCase()}а краще ${theme.mood} підхід`
    });

    return recommendations;
  }

  function generateSuppliesList(results, params) {
    const supplies = [
      {
        name: "Кульки",
        details: `${results.totalBalloons} шт. (включає запас 12%)`
      },
      {
        name: "Каркас",
        details: `${results.archCircumference} м дроту або ${Math.ceil(results.archCircumference/3)} труб ПВХ`
      },
      {
        name: "Насос",
        details: "Ручний або електричний насос для кульок (обов'язково!)"
      },
      {
        name: "Кріплення",
        details: `${Math.ceil(results.totalBalloons/10)} хомутів або рулон клейової стрічки`
      }
    ];

    if (params.mixedSizes) {
      supplies.push({
        name: "Маркування",
        details: "Маркер для позначення розмірів кульок при надуванні"
      });
    }

    if (params.style === 'organic') {
      supplies.push({
        name: "Додатковий декор",
        details: "Штучна зелень, стрічки або інші декоративні елементи"
      });
    }

    return supplies;
  }

  function generateCreationTips(results, params) {
    const tips = [
      {
        icon: "🎈",
        text: `Надувайте кульки поступово - це займе приблизно ${results.creationTime} годин`
      },
      {
        icon: "📏",
        text: "Використовуйте шаблон для рівномірного розміру кульок"
      },
      {
        icon: "🔧",
        text: "Збирайте арку секціями, потім з'єднуйте їх разом"
      }
    ];

    if (params.style === 'organic') {
      tips.push({
        icon: "🌿",
        text: "Для органічної арки змішуйте розміри хаотично, без чіткого візерунка"
      });
    }

    if (params.density === 'dense' || params.density === 'extra-dense') {
      tips.push({
        icon: "⏰",
        text: "Щільні арки потребують більше часу - почніть на день раніше"
      });
    }

    if (params.occasion === 'wedding') {
      tips.push({
        icon: "💒",
        text: "Для весілля уникайте яскравих кольорів, обирайте пастельні тони"
      });
    }

    tips.push({
      icon: "💡",
      text: "Завжди тестуйте кольорову схему на невеликій секції спочатку"
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