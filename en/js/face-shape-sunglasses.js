document.addEventListener("DOMContentLoaded", () => {
  const inputs = {
    foreheadWidth: document.getElementById("foreheadWidth"),
    cheekWidth: document.getElementById("cheekWidth"),
    jawWidth: document.getElementById("jawWidth"),
    faceLength: document.getElementById("faceLength")
  };
  
  const calculateBtn = document.getElementById("calculateBtn");
  const resultsSection = document.getElementById("results");
  
  // Face shape definitions with English text
  const faceShapes = {
    oval: {
      name: "Oval",
      emoji: "🥚",
      description: "Balanced proportions with soft curves",
      characteristics: "Length 1.5x width, widest at cheekbones, gentle curves",
      recommended: [
        { name: "Aviators", emoji: "🕶️", description: "Classic timeless style" },
        { name: "Wayfarers", emoji: "⬛", description: "Universal appeal" },
        { name: "Cat-eye", emoji: "🐱", description: "Feminine elegance" },
        { name: "Round frames", emoji: "⭕", description: "Retro charm" },
        { name: "Rectangular", emoji: "⬜", description: "Modern edge" }
      ],
      avoid: [
        { name: "Oversized", emoji: "📐", description: "Overwhelm proportions" }
      ],
      tips: [
        { icon: "✨", text: "You're lucky - almost any sunglasses style will suit you!" },
        { icon: "👑", text: "Experiment with different sizes and colors" },
        { icon: "💡", text: "Focus on your personal style and intended use" }
      ]
    },
    round: {
      name: "Round",
      emoji: "⭕",
      description: "Width and length nearly equal",
      characteristics: "Soft curves, full cheeks, rounded chin, minimal angles",
      recommended: [
        { name: "Rectangular", emoji: "⬜", description: "Add angular definition" },
        { name: "Square frames", emoji: "⬛", description: "Structure the face" },
        { name: "Wayfarers", emoji: "🔺", description: "Angular shapes" },
        { name: "Cat-eye", emoji: "🐱", description: "Elongate appearance" }
      ],
      avoid: [
        { name: "Round frames", emoji: "⭕", description: "Emphasize roundness" },
        { name: "Small frames", emoji: "🔍", description: "Too petite" }
      ],
      tips: [
        { icon: "📐", text: "Choose angular shapes to add structure" },
        { icon: "⬆️", text: "Taller frames visually elongate your face" },
        { icon: "🎯", text: "Avoid small or circular frames" }
      ]
    },
    square: {
      name: "Square",
      emoji: "⬛",
      description: "Wide forehead and strong jawline",
      characteristics: "Angular features, defined jaw, broad forehead, strong lines",
      recommended: [
        { name: "Round frames", emoji: "⭕", description: "Soften harsh angles" },
        { name: "Oval shapes", emoji: "🥚", description: "Gentle curves" },
        { name: "Aviators", emoji: "🕶️", description: "Curved bottom edge" },
        { name: "Cat-eye", emoji: "🐱", description: "Upswept lines" }
      ],
      avoid: [
        { name: "Square frames", emoji: "⬛", description: "Emphasize angularity" },
        { name: "Rectangular", emoji: "⬜", description: "Too geometric" }
      ],
      tips: [
        { icon: "🌊", text: "Choose soft, curved shapes" },
        { icon: "📏", text: "Frame width shouldn't exceed cheek width" },
        { icon: "💫", text: "Avoid angular and geometric styles" }
      ]
    },
    heart: {
      name: "Heart",
      emoji: "💖",
      description: "Wide forehead, narrow chin",
      characteristics: "Broad forehead, high cheekbones, pointed chin, top-heavy",
      recommended: [
        { name: "Aviators", emoji: "🕶️", description: "Balance the top" },
        { name: "Cat-eye", emoji: "🐱", description: "Retro charm" },
        { name: "Round frames", emoji: "⭕", description: "Soft appearance" },
        { name: "Rimless", emoji: "💎", description: "Light and delicate" }
      ],
      avoid: [
        { name: "Rectangular", emoji: "⬜", description: "Emphasize forehead width" },
        { name: "Heavy frames", emoji: "📐", description: "Too top-heavy" }
      ],
      tips: [
        { icon: "⚖️", text: "Choose lighter frames that don't emphasize forehead width" },
        { icon: "👇", text: "Focus attention on lower frame area" },
        { icon: "✨", text: "Thin or rimless frames are ideal" }
      ]
    },
    triangle: {
      name: "Triangle",
      emoji: "🔺",
      description: "Narrow forehead, wide jawline",
      characteristics: "Narrow forehead, broad jaw, substantial chin, bottom-heavy",
      recommended: [
        { name: "Cat-eye", emoji: "🐱", description: "Emphasize the top" },
        { name: "Wayfarers", emoji: "⬛", description: "Wider at top" },
        { name: "Bold colors", emoji: "🌈", description: "Draw attention up" },
        { name: "Decorative tops", emoji: "💎", description: "Embellished upper area" }
      ],
      avoid: [
        { name: "Narrow frames", emoji: "🔍", description: "Emphasize imbalance" },
        { name: "Dark bottoms", emoji: "⬛", description: "Heavy lower area" }
      ],
      tips: [
        { icon: "⬆️", text: "Choose frames wider at the top" },
        { icon: "🎨", text: "Bright colors and decorative elements on top draw attention upward" },
        { icon: "💡", text: "Avoid dark or heavy bottom frame elements" }
      ]
    },
    diamond: {
      name: "Diamond",
      emoji: "💎",
      description: "Narrow forehead and chin, wide cheeks",
      characteristics: "High wide cheekbones, narrow forehead and chin, angular",
      recommended: [
        { name: "Oval frames", emoji: "🥚", description: "Follow natural lines" },
        { name: "Cat-eye", emoji: "🐱", description: "Highlight cheekbones" },
        { name: "Aviators", emoji: "🕶️", description: "Classic choice" },
        { name: "Rimless", emoji: "💎", description: "Don't overwhelm" }
      ],
      avoid: [
        { name: "Narrow frames", emoji: "🔍", description: "Emphasize narrowness" },
        { name: "Geometric", emoji: "📐", description: "Too angular" }
      ],
      tips: [
        { icon: "🌟", text: "Highlight your beautiful high cheekbones" },
        { icon: "⚖️", text: "Choose balanced medium-width frames" },
        { icon: "✨", text: "Avoid frames that are too narrow or wide" }
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
      alert('Please enter valid measurements (8-30 cm)');
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
      <h5>🔍 Your Face Characteristics:</h5>
      <p>${shape.characteristics}</p>
      <div class="measurements-summary">
        <span>Forehead: ${measurements.forehead}cm</span>
        <span>Cheeks: ${measurements.cheek}cm</span>
        <span>Jaw: ${measurements.jaw}cm</span>
        <span>Length: ${measurements.length}cm</span>
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