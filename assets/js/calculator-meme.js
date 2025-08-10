document.addEventListener("DOMContentLoaded", function () {
  const templateGallery = document.getElementById('template-gallery');
  const memeEditor = document.getElementById('meme-editor');
  const canvas = document.getElementById('meme-canvas');
  const ctx = canvas.getContext('2d');
  
  let selectedTemplate = null;
  let templateImage = new Image();
  
  // Meme templates with placeholder images (using text-based placeholders for now)
  const memeTemplates = [
    {
      id: 1,
      name: "Дистракт дівчина",
      description: "Коли бачиш новий калькулятор",
      placeholder: "👩‍💻📱",
      text: "DISTRACTED\nGIRLFRIEND"
    },
    {
      id: 2,
      name: "Дрейк вказує",
      description: "Ручні розрахунки vs калькулятор",
      placeholder: "🤚🫵",
      text: "DRAKE\nPOINTING"
    },
    {
      id: 3,
      name: "Цей штука в добре",
      description: "Калькулятор працює правильно",
      placeholder: "👨‍🍳💋",
      text: "CHEF'S\nKISS"
    },
    {
      id: 4,
      name: "Розжарений мозок",
      description: "Складні математичні обчислення",
      placeholder: "🧠🔥",
      text: "EXPANDING\nBRAIN"
    },
    {
      id: 5,
      name: "Жінка кричить на кота",
      description: "Я vs мій калькулятор",
      placeholder: "😾👩‍💼",
      text: "WOMAN\nYELLING"
    },
    {
      id: 6,
      name: "Два кнопки",
      description: "Використати калькулятор чи розрахувати вручну",
      placeholder: "😰🔴🔵",
      text: "TWO\nBUTTONS"
    },
    {
      id: 7,
      name: "Це добре",
      description: "Коли відповідь правильна",
      placeholder: "🐕🔥",
      text: "THIS IS\nFINE"
    },
    {
      id: 8,
      name: "Галактичний мозок",
      description: "Рівні розуміння математики",
      placeholder: "🌌🧠",
      text: "GALAXY\nBRAIN"
    },
    {
      id: 9,
      name: "Спідермен вказує",
      description: "Калькулятори вказують один на одного",
      placeholder: "🕷️👈👈",
      text: "SPIDER-MAN\nPOINTING"
    },
    {
      id: 10,
      name: "Ізменений том",
      description: "Коли калькулятор дає неправильну відповідь",
      placeholder: "😱🐱",
      text: "SURPRISED\nPIKACHU"
    },
    {
      id: 11,
      name: "Першокласний шеф",
      description: "Ідеальний розрахунок",
      placeholder: "👨‍🍳✨",
      text: "GORDON\nRAMSAY"
    },
    {
      id: 12,
      name: "Тупе обличчя",
      description: "Коли не розумієш математику",
      placeholder: "🤨❓",
      text: "CONFUSED\nMATH"
    },
    {
      id: 13,
      name: "Ізи",
      description: "Коли розрахунок виявився простим",
      placeholder: "😎💯",
      text: "ALWAYS HAS\nBEEN"
    },
    {
      id: 14,
      name: "Mocking SpongeBob",
      description: "Математика легка",
      placeholder: "🧽🐔",
      text: "MOCKING\nSPONGEBOB"
    },
    {
      id: 15,
      name: "Стоніз",
      description: "Калькулятори не можуть розрахувати",
      placeholder: "📈📊",
      text: "STONKS\nNOT STONKS"
    },
    {
      id: 16,
      name: "Панікуючий том",
      description: "Коли калькулятор зламався",
      placeholder: "😰📱",
      text: "PANIK\nKALM"
    },
    {
      id: 17,
      name: "Батьківський контакт",
      description: "Батьки допомагають з математикою",
      placeholder: "👨‍👦➗",
      text: "DAD\nMATH"
    },
    {
      id: 18,
      name: "У нас в домі математики",
      description: "Коли всі математики",
      placeholder: "🏠🧮",
      text: "WE HAVE\nAT HOME"
    },
    {
      id: 19,
      name: "Величезний мозок",
      description: "Математичний геній",
      placeholder: "🧠⚡",
      text: "BIG BRAIN\nTIME"
    },
    {
      id: 20,
      name: "Не мучся",
      description: "Коли математика надто складна",
      placeholder: "🤷‍♂️💭",
      text: "GUESS I'LL\nDIE"
    }
  ];
  
  // Initialize
  renderTemplateGallery();
  
  function renderTemplateGallery() {
    templateGallery.innerHTML = memeTemplates.map(template => `
      <div class="template-card" data-template-id="${template.id}">
        <div class="template-placeholder">
          <div class="placeholder-emoji">${template.placeholder}</div>
          <div class="placeholder-text">${template.text}</div>
        </div>
        <div class="template-info">
          <h4>${template.name}</h4>
          <p>${template.description}</p>
          <button class="select-btn" onclick="selectTemplate(${template.id})">
            ✨ Обрати шаблон
          </button>
        </div>
      </div>
    `).join('');
  }
  
  window.selectTemplate = function(templateId) {
    selectedTemplate = memeTemplates.find(t => t.id === templateId);
    if (selectedTemplate) {
      document.querySelector('.template-selection').style.display = 'none';
      memeEditor.style.display = 'block';
      
      // Create template image
      createTemplateImage();
      updatePreview();
    }
  };
  
  function createTemplateImage() {
    // Create a canvas for the template
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 500;
    tempCanvas.height = 500;
    
    // Create a gradient background
    const gradient = tempCtx.createLinearGradient(0, 0, 500, 500);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#d0d0d0');
    tempCtx.fillStyle = gradient;
    tempCtx.fillRect(0, 0, 500, 500);
    
    // Add template placeholder
    tempCtx.font = '60px Arial';
    tempCtx.textAlign = 'center';
    tempCtx.fillStyle = '#666';
    
    // Draw emoji
    tempCtx.font = '80px Arial';
    tempCtx.fillText(selectedTemplate.placeholder, 250, 200);
    
    // Draw template text
    tempCtx.font = 'bold 24px Arial';
    tempCtx.fillStyle = '#333';
    const lines = selectedTemplate.text.split('\n');
    lines.forEach((line, index) => {
      tempCtx.fillText(line, 250, 350 + (index * 30));
    });
    
    // Convert to image
    templateImage.src = tempCanvas.toDataURL();
  }
  
  function updatePreview() {
    if (!selectedTemplate) return;
    
    const topText = document.getElementById('top-text').value.toUpperCase();
    const bottomText = document.getElementById('bottom-text').value.toUpperCase();
    const fontSize = parseInt(document.getElementById('font-size').value);
    const textColor = document.getElementById('text-color').value;
    const hasStroke = document.getElementById('text-stroke').checked;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw template image
    if (templateImage.complete) {
      ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
    }
    
    // Setup text style
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    
    if (hasStroke) {
      ctx.strokeStyle = textColor === 'white' ? 'black' : 'white';
      ctx.lineWidth = 3;
    }
    
    // Draw top text
    if (topText) {
      const topY = 60;
      drawMultilineText(ctx, topText, canvas.width / 2, topY, canvas.width - 40, fontSize);
    }
    
    // Draw bottom text
    if (bottomText) {
      const bottomY = canvas.height - 60;
      drawMultilineText(ctx, bottomText, canvas.width / 2, bottomY, canvas.width - 40, fontSize);
    }
  }
  
  function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];
    
    // Break text into lines
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    // Draw lines
    const totalHeight = lines.length * lineHeight;
    const startY = y - (totalHeight / 2) + (lineHeight / 2);
    
    lines.forEach((line, index) => {
      const lineY = startY + (index * lineHeight);
      
      if (document.getElementById('text-stroke').checked) {
        ctx.strokeText(line, x, lineY);
      }
      ctx.fillText(line, x, lineY);
    });
  }
  
  // Event listeners
  document.getElementById('top-text').addEventListener('input', updatePreview);
  document.getElementById('bottom-text').addEventListener('input', updatePreview);
  document.getElementById('font-size').addEventListener('input', function() {
    document.getElementById('font-size-display').textContent = this.value + 'px';
    updatePreview();
  });
  document.getElementById('text-color').addEventListener('change', updatePreview);
  document.getElementById('text-stroke').addEventListener('change', updatePreview);
  
  document.getElementById('preview-btn').addEventListener('click', updatePreview);
  
  document.getElementById('download-btn').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = `мем-калькулятор-${selectedTemplate.id}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
  
  document.getElementById('back-btn').addEventListener('click', function() {
    document.querySelector('.template-selection').style.display = 'block';
    memeEditor.style.display = 'none';
    selectedTemplate = null;
  });
  
  // Add CSS
  const style = document.createElement('style');
  style.textContent = `
    .meme-generator {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    
    .template-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 1rem;
      border: 2px solid var(--border);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .template-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
      border-color: var(--accent);
    }
    
    .template-placeholder {
      height: 200px;
      background: linear-gradient(135deg, #f0f0f0, #d0d0d0);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      position: relative;
    }
    
    .placeholder-emoji {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    
    .placeholder-text {
      font-size: 0.8rem;
      color: #666;
      text-align: center;
      font-weight: bold;
    }
    
    .template-info h4 {
      margin: 0 0 0.5rem 0;
      color: var(--main-color);
    }
    
    .template-info p {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .select-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      width: 100%;
      transition: background 0.3s ease;
    }
    
    .select-btn:hover {
      background: var(--accent-hover);
    }
    
    .meme-editor {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .editor-controls {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
    
    .editor-controls h3 {
      margin-top: 0;
      color: var(--accent);
    }
    
    .text-inputs, .style-controls {
      margin-bottom: 1.5rem;
    }
    
    .input-group {
      margin-bottom: 1rem;
    }
    
    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--main-color);
    }
    
    .input-group input[type="text"] {
      width: 100%;
      padding: 0.7rem;
      border: 2px solid var(--border);
      border-radius: 5px;
      font-size: 1rem;
    }
    
    .input-group input[type="range"] {
      width: 70%;
      margin-right: 0.5rem;
    }
    
    .input-group select {
      width: 100%;
      padding: 0.7rem;
      border: 2px solid var(--border);
      border-radius: 5px;
      font-size: 1rem;
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .primary-btn, .success-btn, .secondary-btn {
      padding: 0.8rem 1rem;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .primary-btn {
      background: var(--accent);
      color: white;
    }
    
    .primary-btn:hover {
      background: var(--accent-hover);
    }
    
    .success-btn {
      background: #28a745;
      color: white;
    }
    
    .success-btn:hover {
      background: #218838;
    }
    
    .secondary-btn {
      background: #6c757d;
      color: white;
    }
    
    .secondary-btn:hover {
      background: #5a6268;
    }
    
    .meme-preview {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      text-align: center;
    }
    
    .meme-preview h3 {
      margin-top: 0;
      color: var(--accent);
    }
    
    #meme-canvas {
      max-width: 100%;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: white;
    }
    
    @media (max-width: 768px) {
      .template-grid {
        grid-template-columns: 1fr;
      }
      
      .meme-editor {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
});