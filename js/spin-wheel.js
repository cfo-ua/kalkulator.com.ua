document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const spinBtn = document.getElementById("spinBtn");
  const result = document.getElementById("result");
  const optionInput = document.getElementById("optionInput");
  const addBtn = document.getElementById("addBtn");
  const optionsList = document.getElementById("optionsList");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const addSampleBtn = document.getElementById("addSampleBtn");
  const eliminateOption = document.getElementById("eliminateOption");
  
  let options = [];
  let isSpinning = false;
  let rotation = 0;
  let currentSpinRotation = 0;
  
  // Load saved options
  loadOptions();
  
  // Event listeners
  if (spinBtn) spinBtn.addEventListener("click", spinWheel);
  if (addBtn) addBtn.addEventListener("click", addOption);
  if (clearAllBtn) clearAllBtn.addEventListener("click", clearAllOptions);
  if (addSampleBtn) addSampleBtn.addEventListener("click", addSampleOptions);
  if (canvas) {
    canvas.addEventListener("click", () => {
      if (!isSpinning && options.length > 0) {
        spinWheel();
      }
    });
  }
  
  // Add option on Enter key
  if (optionInput) {
    optionInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addOption();
      }
    });
  }
  
  function addOption() {
    const text = optionInput?.value.trim();
    if (text && !options.includes(text)) {
      options.push(text);
      if (optionInput) optionInput.value = "";
      updateOptionsDisplay();
      drawWheel();
      saveOptions();
    }
  }
  
  function removeOption(index) {
    options.splice(index, 1);
    updateOptionsDisplay();
    drawWheel();
    saveOptions();
    
    if (options.length === 0 && result) {
      result.innerHTML = "<p>Додайте варіанти та крутіть колесо!</p>";
      result.classList.remove("winner");
    }
  }
  
  // Make removeOption globally accessible
  window.removeOption = removeOption;
  
  function clearAllOptions() {
    if (options.length > 0 && confirm("Видалити всі варіанти?")) {
      options = [];
      updateOptionsDisplay();
      drawWheel();
      saveOptions();
      if (result) {
        result.innerHTML = "<p>Додайте варіанти та крутіть колесо!</p>";
        result.classList.remove("winner");
      }
    }
  }
  
  function addSampleOptions() {
    const samples = [
      "🍕 Піца",
      "🍔 Бургер", 
      "🍝 Паста",
      "🥗 Салат",
      "🍜 Суп",
      "🌮 Тако"
    ];
    
    const newSamples = samples.filter(sample => !options.includes(sample));
    if (newSamples.length > 0) {
      options.push(...newSamples);
      updateOptionsDisplay();
      drawWheel();
      saveOptions();
    }
  }
  
  function updateOptionsDisplay() {
    if (!optionsList) return;
    
    if (options.length === 0) {
      optionsList.innerHTML = '<p class="empty-state">Почніть додавати варіанти для вашого колеса</p>';
      return;
    }
    
    optionsList.innerHTML = options.map((option, index) => `
      <div class="option-item" style="border-left-color: ${getColor(index)}">
        <span class="option-text">${option}</span>
        <button class="option-remove" onclick="removeOption(${index})">✕</button>
      </div>
    `).join("");
  }
  
  function getColor(index) {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
      "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471", "#82E0AA",
      "#F1948A", "#85C1E9", "#F4D03F", "#A569BD", "#5DADE2", "#58D68D"
    ];
    return colors[index % colors.length];
  }
  
  function drawWheel() {
    if (!canvas || !ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (options.length === 0) {
      // Draw empty wheel
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f0f0f0";
      ctx.fill();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.fillStyle = "#999";
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Додайте варіанти", centerX, centerY);
      return;
    }
    
    const anglePerOption = (2 * Math.PI) / options.length;
    
    // Draw sectors
    options.forEach((option, index) => {
      const startAngle = (index * anglePerOption) + (rotation * Math.PI / 180);
      const endAngle = ((index + 1) * anglePerOption) + (rotation * Math.PI / 180);
      
      // Draw sector
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = getColor(index);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerOption / 2);
      ctx.fillStyle = "#333";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      
      // Truncate long text
      let displayText = option;
      if (displayText.length > 15) {
        displayText = displayText.substring(0, 12) + "...";
      }
      
      ctx.fillText(displayText, radius * 0.7, 5);
      ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  function spinWheel() {
    if (isSpinning || options.length === 0) return;
    
    isSpinning = true;
    if (spinBtn) {
      spinBtn.disabled = true;
      const spinText = spinBtn.querySelector('.spin-text');
      if (spinText) spinText.textContent = "Крутимо...";
    }
    document.body.classList.add("wheel-spinning");
    
    // Random spin amount (multiple full rotations plus random angle)
    const spinAmount = Math.random() * 360 + 1440 + 720; // 4-6 full rotations
    const finalRotation = (rotation + spinAmount) % 360;
    
    // Determine winner - Fixed to match the drawing coordinate system
    const anglePerOptionDegrees = 360 / options.length;
    
    // The pointer is at the top (12 o'clock = 270° in canvas coordinates)
    // Since we draw sectors starting from 0° (3 o'clock) going clockwise,
    // we need to account for the pointer position and the sector layout
    const pointerAngle = 270; // 12 o'clock position in degrees
    
    // Calculate which sector the pointer is pointing to after rotation
    // The wheel rotates clockwise, so we subtract the rotation from the pointer position
    let adjustedAngle = (pointerAngle - finalRotation + 360) % 360;
    
    // Since sectors are drawn starting from 0°, we need to find which sector contains this angle
    const winnerIndex = Math.floor(adjustedAngle / anglePerOptionDegrees) % options.length;
    const winner = options[winnerIndex];
    
    // Animate spin
    const startTime = Date.now();
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for more realistic spin
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentSpinRotation = rotation + (spinAmount * easeOut);
      
      // Update wheel display
      const tempRotation = rotation;
      rotation = currentSpinRotation % 360;
      drawWheel();
      rotation = tempRotation;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Spin complete
        rotation = finalRotation;
        drawWheel();
        showResult(winner, winnerIndex);
        
        // Handle elimination
        if (eliminateOption?.checked && options.length > 1) {
          setTimeout(() => {
            removeOption(winnerIndex);
          }, 1500);
        }
        
        isSpinning = false;
        if (spinBtn) {
          spinBtn.disabled = false;
          const spinText = spinBtn.querySelector('.spin-text');
          if (spinText) spinText.textContent = "Крутити";
        }
        document.body.classList.remove("wheel-spinning");
      }
    };
    
    animate();
  }
  
  function showResult(winner, index) {
    if (!result) return;
    
    result.innerHTML = `
      <p><strong>🎉 Переможець: ${winner}</strong></p>
      <small>${eliminateOption?.checked && options.length > 1 ? 
        'Варіант буде видалено з колеса' : 
        'Натисніть знову, щоб крутити ще раз'}</small>
    `;
    result.classList.add("winner");
    
    // Add celebration effect
    setTimeout(() => {
      result.classList.remove("winner");
    }, 2000);
  }
  
  function saveOptions() {
    try {
      localStorage.setItem('spinWheelOptionsUA', JSON.stringify(options));
    } catch (error) {
      console.log('Не вдалося зберегти варіанти:', error);
    }
  }
  
  function loadOptions() {
    try {
      const saved = localStorage.getItem('spinWheelOptionsUA');
      if (saved) {
        options = JSON.parse(saved);
        updateOptionsDisplay();
        drawWheel();
      } else {
        // Load with empty state
        updateOptionsDisplay();
        drawWheel();
      }
    } catch (error) {
      console.log('Не вдалося завантажити варіанти:', error);
      updateOptionsDisplay();
      drawWheel();
    }
  }
  
  // Keyboard controls
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isSpinning && options.length > 0) {
      event.preventDefault();
      spinWheel();
    }
  });
  
  // Initialize on load
  updateOptionsDisplay();
  drawWheel();
});