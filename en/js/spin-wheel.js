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
  spinBtn.addEventListener("click", spinWheel);
  addBtn.addEventListener("click", addOption);
  clearAllBtn.addEventListener("click", clearAllOptions);
  addSampleBtn.addEventListener("click", addSampleOptions);
  canvas.addEventListener("click", () => {
    if (!isSpinning && options.length > 0) {
      spinWheel();
    }
  });
  
  // Add option on Enter key
  optionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addOption();
    }
  });
  
  function addOption() {
    const text = optionInput.value.trim();
    if (text && !options.includes(text)) {
      options.push(text);
      optionInput.value = "";
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
    
    if (options.length === 0) {
      result.innerHTML = "<p>Add options and spin the wheel!</p>";
      result.classList.remove("winner");
    }
  }
  
  // Make removeOption globally accessible
  window.removeOption = removeOption;
  
  function clearAllOptions() {
    if (options.length > 0 && confirm("Remove all options?")) {
      options = [];
      updateOptionsDisplay();
      drawWheel();
      saveOptions();
      result.innerHTML = "<p>Add options and spin the wheel!</p>";
      result.classList.remove("winner");
    }
  }
  
  function addSampleOptions() {
    const samples = [
      "🍕 Pizza",
      "🍔 Burger", 
      "🍝 Pasta",
      "🥗 Salad",
      "🍜 Soup",
      "🌮 Tacos"
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
    if (options.length === 0) {
      optionsList.innerHTML = '<p class="empty-state">Start adding options for your wheel</p>';
      return;
    }
    
    optionsList.innerHTML = options.map((option, index) => `
      <div class="option-item" style="border-left-color: ${getColor(index)}">
        <span class="option-text">${option}</span>
        <button class="option-remove" onclick="removeOption(${index})">×</button>
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
      ctx.fillText("Add options", centerX, centerY);
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
    spinBtn.disabled = true;
    spinBtn.querySelector('.spin-text').textContent = "Spinning...";
    document.body.classList.add("wheel-spinning");
    
    // Random spin amount (multiple full rotations plus random angle)
    const spinAmount = Math.random() * 360 + 1440 + 720; // 4-6 full rotations
    const finalRotation = (rotation + spinAmount) % 360;
    
    // Determine winner
    const anglePerOption = 360 / options.length;
    
    // The pointer is at the top (0 degrees), so we need to find which sector 
    // is positioned under the pointer after rotation
    // Fix: Correct calculation for clockwise rotation
    const winnerIndex = Math.floor(finalRotation / anglePerOption) % options.length;
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
        if (eliminateOption.checked && options.length > 1) {
          setTimeout(() => {
            removeOption(winnerIndex);
          }, 1500);
        }
        
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.querySelector('.spin-text').textContent = "Spin";
        document.body.classList.remove("wheel-spinning");
      }
    };
    
    animate();
  }
  
  function showResult(winner, index) {
    result.innerHTML = `
      <p><strong>🎉 Winner: ${winner}</strong></p>
      <small>${eliminateOption.checked && options.length > 1 ? 
        'Option will be removed from wheel' : 
        'Click again to spin once more'}</small>
    `;
    result.classList.add("winner");
    
    // Add celebration effect
    setTimeout(() => {
      result.classList.remove("winner");
    }, 2000);
  }
  
  function saveOptions() {
    try {
      localStorage.setItem('spinWheelOptionsEN', JSON.stringify(options));
    } catch (error) {
      console.log('Failed to save options:', error);
    }
  }
  
  function loadOptions() {
    try {
      const saved = localStorage.getItem('spinWheelOptionsEN');
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
      console.log('Failed to load options:', error);
      updateOptionsDisplay();
      drawWheel();
    }
  }
  
  // Make removeOption available globally for onclick handlers
  window.removeOption = removeOption;
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isSpinning && options.length > 0) {
      e.preventDefault();
      spinWheel();
    }
  });
  
  // Initialize
  drawWheel();
});