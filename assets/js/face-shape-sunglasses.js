document.addEventListener("DOMContentLoaded", () => {
  const inputs = {
    foreheadWidth: document.getElementById("foreheadWidth"),
    cheekWidth: document.getElementById("cheekWidth"),
    jawWidth: document.getElementById("jawWidth"),
    faceLength: document.getElementById("faceLength")
  };
  
  const calculateBtn = document.getElementById("calculateBtn");
  const resultsSection = document.getElementById("results");
  
  // Face shape definitions with Ukrainian text
  const faceShapes = {
    oval: {
      name: "Овальне",
      emoji: "🥚",
      description: "Збалансовані пропорції з плавними лініями",
      characteristics: "Довжина в 1.5 рази більше ширини, найширша частина - скули",
      recommended: [
        { name: "Авіатори", emoji: "🕶️", description: "Класичний стиль" },
        { name: "Вайфарери", emoji: "⬛", description: "Універсальні" },
        { name: "Кішки", emoji: "🐱", description: "Жіночні" },
        { name: "Круглі", emoji: "⭕", description: "Ретро стиль" },
        { name: "Прямокутні", emoji: "⬜", description: "Сучасні" }
      ],
      avoid: [
        { name: "Занадто великі", emoji: "📐", description: "Порушують пропорції" }
      ],
      tips: [
        { icon: "✨", text: "Вам пощастило - підходить майже будь-який стиль окулярів!" },
        { icon: "👑", text: "Експериментуйте з різними розмірами та кольорами" },
        { icon: "💡", text: "Орієнтуйтеся на свій стиль та призначення окулярів" }
      ]
    },
    round: {
      name: "Кругле",
      emoji: "⭕",
      description: "Ширина та довжина майже рівні",
      characteristics: "М'які лінії, повні щоки, округлий підборіддя",
      recommended: [
        { name: "Прямокутні", emoji: "⬜", description: "Додають кутів" },
        { name: "Квадратні", emoji: "⬛", description: "Структурують обличчя" },
        { name: "Вайфарери", emoji: "🔺", description: "Кутасті форми" },
        { name: "Кішки", emoji: "🐱", description: "Витягують обличчя" }
      ],
      avoid: [
        { name: "Круглі", emoji: "⭕", description: "Підкреслюють округлість" },
        { name: "Дрібні", emoji: "🔍", description: "Занадто малі" }
      ],
      tips: [
        { icon: "📐", text: "Обирайте кутасті форми для додання структури" },
        { icon: "⬆️", text: "Високі оправи візуально витягують обличчя" },
        { icon: "🎯", text: "Уникайте дрібних або круглих окулярів" }
      ]
    },
    square: {
      name: "Квадратне",
      emoji: "⬛",
      description: "Широкий лоб та підборіддя",
      characteristics: "Кутасті риси, чітка лінія щелепи, широкий лоб",
      recommended: [
        { name: "Круглі", emoji: "⭕", description: "Пом'якшують кути" },
        { name: "Овальні", emoji: "🥚", description: "М'які лінії" },
        { name: "Авіатори", emoji: "🕶️", description: "Округлі форми" },
        { name: "Кішки", emoji: "🐱", description: "Піднімають лінії" }
      ],
      avoid: [
        { name: "Квадратні", emoji: "⬛", description: "Підкреслюють кутастість" },
        { name: "Прямокутні", emoji: "⬜", description: "Занадто геометричні" }
      ],
      tips: [
        { icon: "🌊", text: "Обирайте м'які, округлі форми" },
        { icon: "📏", text: "Ширина оправи не повинна перевищувати ширину скул" },
        { icon: "💫", text: "Уникайте кутастих та геометричних форм" }
      ]
    },
    heart: {
      name: "Серце-подібне",
      emoji: "💖",
      description: "Широкий лоб, вузьке підборіддя",
      characteristics: "Широкий лоб, високі скули, загострений підборіддя",
      recommended: [
        { name: "Авіатори", emoji: "🕶️", description: "Збалансовують верх" },
        { name: "Кішки", emoji: "🐱", description: "Ретро шарм" },
        { name: "Круглі", emoji: "⭕", description: "М'який вигляд" },
        { name: "Без оправи", emoji: "💎", description: "Легкі та витончені" }
      ],
      avoid: [
        { name: "Прямокутні", emoji: "⬜", description: "Підкреслюють ширину лоба" },
        { name: "Масивні", emoji: "📐", description: "Занадто важкі зверху" }
      ],
      tips: [
        { icon: "⚖️", text: "Обирайте легкі оправи, які не підкреслюють ширину лоба" },
        { icon: "👇", text: "Акцент на нижню частину оправи" },
        { icon: "✨", text: "Тонкі оправи або без оправи - ідеальний вибір" }
      ]
    },
    triangle: {
      name: "Трикутне",
      emoji: "🔺",
      description: "Вузький лоб, широке підборіддя",
      characteristics: "Вузький лоб, широка щелепа, масивне підборіддя",
      recommended: [
        { name: "Кішки", emoji: "🐱", description: "Акцент на верх" },
        { name: "Вайфарери", emoji: "⬛", description: "Ширші зверху" },
        { name: "Яскраві оправи", emoji: "🌈", description: "Привертають увагу вгору" },
        { name: "Декоративні", emoji: "💎", description: "З прикрасами вгорі" }
      ],
      avoid: [
        { name: "Вузькі", emoji: "🔍", description: "Підкреслюють дисбаланс" },
        { name: "Темні знизу", emoji: "⬛", description: "Важкий низ" }
      ],
      tips: [
        { icon: "⬆️", text: "Обирайте оправи ширші в верхній частині" },
        { icon: "🎨", text: "Яскраві кольори та декор зверху відволікають від масивного підборіддя" },
        { icon: "💡", text: "Уникайте темних або масивних нижніх частин оправи" }
      ]
    },
    diamond: {
      name: "Діамантове",
      emoji: "💎",
      description: "Вузький лоб і підборіддя, широкі скули",
      characteristics: "Високі та широкі скули, вузькі лоб і підборіддя",
      recommended: [
        { name: "Овальні", emoji: "🥚", description: "Повторюють природні лінії" },
        { name: "Кішки", emoji: "🐱", description: "Підкреслюють скули" },
        { name: "Авіатори", emoji: "🕶️", description: "Класичний вибір" },
        { name: "Без оправи", emoji: "💎", description: "Не перевантажують" }
      ],
      avoid: [
        { name: "Вузькі", emoji: "🔍", description: "Підкреслюють вузькість" },
        { name: "Геометричні", emoji: "📐", description: "Занадто кутасті" }
      ],
      tips: [
        { icon: "🌟", text: "Підкресліть свої красиві високі скули" },
        { icon: "⚖️", text: "Обирайте збалансовані форми середнього розміру" },
        { icon: "✨", text: "Уникайте занадто вузьких або широких оправ" }
      ]
    }
  };

  // Add input listeners for real-time updates
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', debounce(calculateFaceShape, 500));
  });

  calculateBtn.addEventListener('click', calculateFaceShape);

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

  function calculateFaceShape() {
    const measurements = {
      forehead: parseFloat(inputs.foreheadWidth.value) || 0,
      cheek: parseFloat(inputs.cheekWidth.value) || 0,
      jaw: parseFloat(inputs.jawWidth.value) || 0,
      length: parseFloat(inputs.faceLength.value) || 0
    };

    // Validate inputs
    if (Object.values(measurements).some(val => val <= 0 || val > 30)) {
      alert('Будь ласка, введіть коректні вимірювання (від 8 до 30 см)');
      return;
    }

    const faceShape = determineFaceShape(measurements);
    displayResults(faceShape, measurements);
  }

  function determineFaceShape(m) {
    const maxWidth = Math.max(m.forehead, m.cheek, m.jaw);
    const ratio = m.length / maxWidth;
    
    // Determine dominant characteristics
    const isWiderForehead = m.forehead > m.jaw + 1;
    const isWiderJaw = m.jaw > m.forehead + 1;
    const isCheeksDominant = m.cheek > m.forehead + 0.5 && m.cheek > m.jaw + 0.5;
    const isLong = ratio > 1.6;
    const isShort = ratio < 1.3;

    // Heart shaped: Wide forehead, narrow jaw
    if (isWiderForehead && m.jaw < maxWidth - 1.5) {
      return 'heart';
    }

    // Triangle: Narrow forehead, wide jaw
    if (isWiderJaw && m.forehead < maxWidth - 1.5) {
      return 'triangle';
    }

    // Diamond: Prominent cheeks, narrow forehead and jaw
    if (isCheeksDominant && m.forehead < m.cheek - 1 && m.jaw < m.cheek - 1) {
      return 'diamond';
    }

    // Square: Wide and angular, similar measurements
    if (!isLong && Math.abs(m.forehead - m.jaw) < 1 && Math.abs(m.forehead - m.cheek) < 1) {
      return 'square';
    }

    // Round: Short and wide with similar measurements
    if (isShort && Math.abs(maxWidth - Math.min(m.forehead, m.cheek, m.jaw)) < 2) {
      return 'round';
    }

    // Default to oval for balanced proportions
    return 'oval';
  }

  function displayResults(shapeType, measurements) {
    const shape = faceShapes[shapeType];
    const ratio = (measurements.length / Math.max(measurements.forehead, measurements.cheek, measurements.jaw)).toFixed(2);

    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Update face shape card
    document.getElementById('faceShapeType').textContent = `${shape.emoji} ${shape.name}`;
    document.getElementById('faceShapeDescription').textContent = shape.description;
    
    // Update proportion card
    document.getElementById('ratioValue').textContent = ratio;

    // Update recommended styles
    const recommendedContainer = document.getElementById('recommendedStyles');
    recommendedContainer.innerHTML = shape.recommended.map(style => `
      <div class="style-item recommended">
        <span class="emoji">${style.emoji}</span>
        <div class="name">${style.name}</div>
        <div class="description">${style.description}</div>
      </div>
    `).join('');

    // Update avoid styles
    const avoidContainer = document.getElementById('avoidStyles');
    avoidContainer.innerHTML = shape.avoid.map(style => `
      <div class="style-item avoid">
        <span class="emoji">${style.emoji}</span>
        <div class="name">${style.name}</div>
        <div class="description">${style.description}</div>
      </div>
    `).join('');

    // Update tips
    const tipsContainer = document.getElementById('personalTips');
    tipsContainer.innerHTML = shape.tips.map(tip => `
      <div class="tip-item">
        <span class="tip-icon">${tip.icon}</span>
        <span>${tip.text}</span>
      </div>
    `).join('');

    // Add characteristics info
    const characteristicsInfo = document.createElement('div');
    characteristicsInfo.className = 'characteristics-info';
    characteristicsInfo.innerHTML = `
      <h5>🔍 Характеристики вашого обличчя:</h5>
      <p>${shape.characteristics}</p>
      <div class="measurements-summary">
        <span>Лоб: ${measurements.forehead}см</span>
        <span>Скули: ${measurements.cheek}см</span>
        <span>Підборіддя: ${measurements.jaw}см</span>
        <span>Довжина: ${measurements.length}см</span>
      </div>
    `;
    
    // Insert after the insight cards
    const insightCards = document.querySelector('.insight-cards');
    if (!document.querySelector('.characteristics-info')) {
      insightCards.parentNode.insertBefore(characteristicsInfo, insightCards.nextSibling);
    } else {
      document.querySelector('.characteristics-info').replaceWith(characteristicsInfo);
    }

    // Add animation
    resultsSection.style.animation = 'none';
    setTimeout(() => {
      resultsSection.style.animation = 'fadeIn 0.5s ease';
    }, 10);
  }

  // Initialize with default calculation
  calculateFaceShape();
});

// Add additional styles
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .characteristics-info {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    border: 2px solid #dee2e6;
  }

  .characteristics-info h5 {
    margin: 0 0 1rem 0;
    color: var(--main-color);
    font-size: 1.1rem;
  }

  .characteristics-info p {
    margin: 0 0 1rem 0;
    color: #666;
    line-height: 1.6;
  }

  .measurements-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .measurements-summary span {
    background: white;
    padding: 0.5rem;
    border-radius: 6px;
    text-align: center;
    font-weight: 600;
    color: var(--accent);
  }

  @media (max-width: 768px) {
    .measurements-summary {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
document.head.appendChild(additionalStyles);