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
    simple: { factor: 1.0, name: "Простий вузол", complexity: "Легкий" },
    "four-in-hand": { factor: 1.1, name: "Four-in-hand", complexity: "Середній" },
    "half-windsor": { factor: 1.2, name: "Піввіндзор", complexity: "Середній" },
    windsor: { factor: 1.4, name: "Віндзор", complexity: "Складний" },
    pratt: { factor: 1.3, name: "Пратт", complexity: "Складний" }
  };

  const torsoFactors = {
    short: { factor: 0.95, name: "Короткий торс", description: "Відносно довгі ноги" },
    medium: { factor: 1.0, name: "Середній торс", description: "Збалансовані пропорції" },
    long: { factor: 1.05, name: "Довгий торс", description: "Відносно короткі ноги" }
  };

  const waistFactors = {
    low: { factor: 1.05, name: "Низький пояс", description: "Модерний стиль" },
    medium: { factor: 1.0, name: "Класичний пояс", description: "Стандартна посадка" },
    high: { factor: 0.95, name: "Високий пояс", description: "Формальний стиль" }
  };

  const occasionStyles = {
    business: {
      name: "Діловий",
      widthRange: [7, 9],
      colors: ["темно-синій", "бордовий", "сірий", "чорний"],
      patterns: ["однотонні", "дрібний горошок", "тонкі діагональні смуги"]
    },
    formal: {
      name: "Формальний",
      widthRange: [8, 10],
      colors: ["чорний", "темно-синій", "срібний", "білий"],
      patterns: ["однотонні", "класичні смуги", "елегантні візерунки"]
    },
    casual: {
      name: "Повсякденний",
      widthRange: [6, 8],
      colors: ["будь-які", "яскраві", "пастельні"],
      patterns: ["геометричні", "квіткові", "сучасні принти"]
    },
    wedding: {
      name: "Весільний",
      widthRange: [8, 9],
      colors: ["пастельні", "світло-рожевий", "шампань", "срібний"],
      patterns: ["однотонні", "жаккардові", "субтельні візерунки"]
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
      alert('Будь ласка, введіть коректний зріст (150-220 см)');
      return;
    }

    if (measurements.neckSize < 35 || measurements.neckSize > 50) {
      alert('Будь ласка, введіть коректний розмір шиї (35-50 см)');
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
      sizeCategory = "Коротка";
      sizeDescription = "Для невисоких чоловіків";
    } else if (idealLength <= 160) {
      sizeCategory = "Стандартна";
      sizeDescription = "Універсальний розмір";
    } else {
      sizeCategory = "Довга";
      sizeDescription = "Для високих чоловіків";
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
        title: "Ваш стиль вузла",
        description: `${results.knot.name} - ${results.knot.complexity.toLowerCase()} у виконанні`,
        highlight: true
      },
      {
        emoji: "📏",
        title: "Тип фігури",
        description: `${results.torso.name} - ${results.torso.description.toLowerCase()}`,
        highlight: false
      },
      {
        emoji: "👖",
        title: "Висота поясу",
        description: `${results.waist.name} - ${results.waist.description.toLowerCase()}`,
        highlight: false
      },
      {
        emoji: "🎯",
        title: "Тип заходу",
        description: `${results.occasionData.name} - підходящі кольори та стилі`,
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
        text: `Кінчик краватки повинен торкатися пряжки ременя - це класичне правило етикету`
      },
      {
        icon: "📐",
        text: `Ширина ${results.width}см ідеально підходить для вашого зросту та типу заходу`
      }
    ];

    // Add specific tips based on measurements
    if (measurements.height > 185) {
      tips.push({
        icon: "📏",
        text: "Як високому чоловікові, уникайте занадто коротких крават - вони порушать пропорції"
      });
    } else if (measurements.height < 170) {
      tips.push({
        icon: "⚖️",
        text: "Невисоким чоловікам краще обирати вужчі краватки для збалансованого вигляду"
      });
    }

    if (results.knot.complexity === "Складний") {
      tips.push({
        icon: "🌀",
        text: "Складні вузли виглядають елегантно, але потребують більше часу та довшої краватки"
      });
    }

    // Add occasion-specific tips
    const occasionTips = {
      business: "💼 Для офісу обирайте стримані кольори - темно-синій, бордовий або сірий",
      formal: "🎩 На формальні заходи підходять класичні однотонні краватки або з субтельними візерунками",
      casual: "😎 У неформальній обстановці можете експериментувати з яскравими кольорами та сучасними принтами",
      wedding: "💒 Весільні краватки краще обирати в пастельних тонах, що гармоніюють з загальною кольоровою гамою"
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
        feature: "Довжина краватки",
        details: `Шукайте краватки довжиною ${results.length}±3 см або ${results.sizeCategory.toLowerCase()}і розміри`
      },
      {
        feature: "Ширина краватки",
        details: `Оптимальна ширина: ${results.width-0.5}-${results.width+0.5} см для вашого типу фігури`
      },
      {
        feature: "Матеріал",
        details: "Шовк - найкращий вибір. Альтернативи: якісний поліестер або шовкові суміші"
      },
      {
        feature: "Кольори",
        details: `Для ${results.occasionData.name.toLowerCase()}их заходів: ${results.occasionData.colors.join(', ')}`
      },
      {
        feature: "Візерунки",
        details: `Підходящі візерунки: ${results.occasionData.patterns.join(', ')}`
      }
    ];

    // Add specific recommendations based on body type
    if (measurements.neckSize > 42) {
      guide.push({
        feature: "Товщина краватки",
        details: "Обирайте краватки середньої товщини - вони краще лягають на великій шиї"
      });
    }

    return guide;
  }

  // Initialize with default calculation
  calculateTieLength();
});

// Add additional styles for Ukrainian version
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