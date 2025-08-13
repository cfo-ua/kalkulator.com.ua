document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('carpet-form');
  const result = document.getElementById('carpet-result');
  const addRoomBtn = document.getElementById('add-room');
  const additionalRoomsDiv = document.getElementById('additional-rooms');
  
  let roomCount = 0;
  
  if (form) {
    // Set default values
    document.getElementById('carpet-length').value = 16;
    document.getElementById('carpet-width').value = 12;
    document.getElementById('carpet-price').value = 4.5;
    document.getElementById('carpet-waste').value = 10;
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateCarpet();
    });
    
    // Auto-calculate on input change
    form.addEventListener('input', function() {
      if (form.checkValidity()) {
        calculateCarpet();
      }
    });
    
    // Add room functionality
    addRoomBtn.addEventListener('click', function() {
      roomCount++;
      const roomDiv = document.createElement('div');
      roomDiv.className = 'additional-room';
      roomDiv.innerHTML = `
        <h4>Room ${roomCount + 1}</h4>
        <label>
          Length (ft):
          <input type="number" class="room-length" min="0" step="0.1" placeholder="10" value="10">
        </label>
        <label>
          Width (ft):
          <input type="number" class="room-width" min="0" step="0.1" placeholder="10" value="10">
        </label>
        <button type="button" class="remove-room">❌ Remove</button>
      `;
      additionalRoomsDiv.appendChild(roomDiv);
      
      // Add event listeners for new room
      roomDiv.querySelector('.remove-room').addEventListener('click', function() {
        roomDiv.remove();
        calculateCarpet();
      });
      
      roomDiv.addEventListener('input', function() {
        calculateCarpet();
      });
      
      calculateCarpet();
    });
    
    // Initial calculation
    calculateCarpet();
  }
  
  function calculateCarpet() {
    const mainLength = parseFloat(document.getElementById('carpet-length').value) || 0;
    const mainWidth = parseFloat(document.getElementById('carpet-width').value) || 0;
    const rollWidth = parseFloat(document.getElementById('carpet-roll-width').value) || 12;
    const pricePerSqFt = parseFloat(document.getElementById('carpet-price').value) || 4.5;
    const wastePercent = parseFloat(document.getElementById('carpet-waste').value) || 10;
    
    if (mainLength <= 0 || mainWidth <= 0) {
      result.innerHTML = '<p class="error">⚠️ Please enter dimensions for the main room.</p>';
      return;
    }
    
    // Calculate total area
    let totalArea = mainLength * mainWidth;
    let rooms = [{length: mainLength, width: mainWidth, area: totalArea}];
    
    // Add additional rooms
    const additionalRooms = document.querySelectorAll('.additional-room');
    additionalRooms.forEach((roomDiv, index) => {
      const length = parseFloat(roomDiv.querySelector('.room-length').value) || 0;
      const width = parseFloat(roomDiv.querySelector('.room-width').value) || 0;
      if (length > 0 && width > 0) {
        const area = length * width;
        totalArea += area;
        rooms.push({length, width, area});
      }
    });
    
    // Calculate carpet needed
    const wasteMultiplier = 1 + (wastePercent / 100);
    const areaWithWaste = totalArea * wasteMultiplier;
    
    // Calculate rolls needed (considering roll width)
    let totalRollLength = 0;
    let rollsBreakdown = [];
    
    rooms.forEach((room, index) => {
      const roomName = index === 0 ? 'Main Room' : `Room ${index + 1}`;
      let rollLength = 0;
      let layout = '';
      
      if (room.width <= rollWidth) {
        // Roll can cover width, need length
        rollLength = room.length;
        layout = `${rollWidth}ft wide × ${room.length}ft long`;
      } else {
        // Need to join rolls or cut differently
        const rollsAcrossWidth = Math.ceil(room.width / rollWidth);
        rollLength = room.length * rollsAcrossWidth;
        layout = `${rollsAcrossWidth} strips of ${rollWidth}ft × ${room.length}ft`;
      }
      
      rollsBreakdown.push({
        room: roomName,
        dimensions: `${room.length}ft × ${room.width}ft`,
        area: room.area,
        rollLength: rollLength,
        layout: layout
      });
      
      totalRollLength += rollLength;
    });
    
    // Add waste to roll length
    totalRollLength *= wasteMultiplier;
    
    // Convert to yards (carpet often sold by yard)
    const totalYardage = totalRollLength / 3;
    const areaInYards = areaWithWaste / 9; // sq ft to sq yards
    
    // Calculate cost
    const totalCost = areaWithWaste * pricePerSqFt;
    
    // Calculate if different roll widths work better
    const rollSuggestions = [6, 9, 12, 13.2, 15].map(width => {
      let efficiency = 0;
      let tempTotalLength = 0;
      
      rooms.forEach(room => {
        if (room.width <= width) {
          tempTotalLength += room.length;
        } else {
          const strips = Math.ceil(room.width / width);
          tempTotalLength += room.length * strips;
        }
      });
      
      efficiency = Math.min(1, totalArea / (tempTotalLength * width));
      return {width, efficiency: (efficiency * 100).toFixed(1), waste: ((1 - efficiency) * 100).toFixed(1)};
    });
    
    result.innerHTML = `
      <div class="insight-card">
        <div class="result-section">
          <h4>📊 Project Summary</h4>
          <div class="result-grid">
            <div class="result-item">
              <span class="label">Number of rooms:</span>
              <span class="value">${rooms.length}</span>
            </div>
            <div class="result-item">
              <span class="label">Total area:</span>
              <span class="value">${totalArea.toFixed(0)} sq ft</span>
            </div>
            <div class="result-item">
              <span class="label">With ${wastePercent}% waste:</span>
              <span class="value">${areaWithWaste.toFixed(0)} sq ft</span>
            </div>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section cost-section">
          <h4>💰 Carpet Cost</h4>
          <div class="cost-highlight">
            <p><strong>$${totalCost.toFixed(0)}</strong></p>
            <p class="cost-per-sqft">$${pricePerSqFt}/sq ft</p>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section">
          <h4>📏 Roll Requirements</h4>
          <div class="roll-info">
            <p><strong>Roll width:</strong> ${rollWidth} feet</p>
            <p><strong>Total length needed:</strong> ${totalRollLength.toFixed(1)} feet (${totalYardage.toFixed(1)} yards)</p>
            <p><strong>Area in sq yards:</strong> ${areaInYards.toFixed(1)} sq yd</p>
            <p><strong>Standard 30ft rolls:</strong> ${Math.ceil(totalRollLength / 30)} rolls</p>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section">
          <h4>🏠 Room Layout</h4>
          <div class="rooms-breakdown">
            ${rollsBreakdown.map(room => `
              <div class="room-item">
                <h5>${room.room}</h5>
                <p><strong>Dimensions:</strong> ${room.dimensions} (${room.area.toFixed(0)} sq ft)</p>
                <p><strong>Layout:</strong> ${room.layout}</p>
                <p><strong>Roll length:</strong> ${room.rollLength.toFixed(1)} feet</p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section">
          <h4>💡 Roll Width Efficiency</h4>
          <div class="suggestions">
            ${rollSuggestions.map(sugg => `
              <div class="suggestion-item ${sugg.width == rollWidth ? 'selected' : ''}">
                <span>${sugg.width}ft wide:</span>
                <span>${sugg.efficiency}% efficient (${sugg.waste}% waste)</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-tips">
          <h4>📋 Installation Tips</h4>
          <ul>
            <li><strong>Acclimation:</strong> Let carpet adjust to room temperature for 24 hours</li>
            <li><strong>Tools needed:</strong> Sharp utility knife, seaming tape, tucker, knee kicker</li>
            <li><strong>Pile direction:</strong> Install all pieces running the same direction</li>
            <li><strong>Seam placement:</strong> Avoid seams in high-traffic walkways</li>
            <li><strong>Padding:</strong> Quality padding extends carpet life significantly</li>
            <li><strong>Professional tip:</strong> Use power stretcher for wrinkle-free installation</li>
          </ul>
        </div>
      </div>
      
      <style>
        .insight-card { 
          background: #f8f9fa; 
          border: 1px solid #e9ecef; 
          border-radius: 8px; 
          padding: 20px; 
          margin: 20px 0; 
        }
        .result-section { margin-bottom: 15px; }
        .result-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 15px; 
          margin-top: 10px; 
        }
        .result-item { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px; 
          background: white; 
          border-radius: 5px; 
          border-left: 4px solid #007bff; 
        }
        .label { font-weight: 500; color: #495057; }
        .value { font-weight: bold; color: #007bff; }
        .cost-section { text-align: center; }
        .cost-highlight { 
          background: linear-gradient(135deg, #28a745, #20c997); 
          color: white; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 10px 0; 
        }
        .cost-highlight p { margin: 5px 0; }
        .cost-per-sqft { font-size: 0.9em; opacity: 0.9; }
        .roll-info, .room-item { 
          background: #e3f2fd; 
          padding: 12px; 
          border-radius: 6px; 
          margin: 8px 0; 
        }
        .room-item h5 { margin: 0 0 8px 0; color: #1976d2; }
        .suggestions { display: flex; flex-direction: column; gap: 8px; }
        .suggestion-item { 
          display: flex; 
          justify-content: space-between; 
          background: #f0f0f0; 
          padding: 8px 12px; 
          border-radius: 4px; 
        }
        .suggestion-item.selected { 
          background: #28a745; 
          color: white; 
        }
        .divider { 
          border: none; 
          height: 2px; 
          background: linear-gradient(to right, transparent, #007bff, transparent); 
          margin: 20px 0; 
        }
        .additional-room { 
          background: #f8f9fa; 
          padding: 15px; 
          border-radius: 6px; 
          margin: 10px 0; 
          border-left: 4px solid #6c757d; 
        }
        .additional-room h4 { margin: 0 0 10px 0; }
        .remove-room { 
          background: #dc3545; 
          color: white; 
          border: none; 
          padding: 5px 10px; 
          border-radius: 4px; 
          cursor: pointer; 
        }
        .error { color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 5px; }
      </style>
    `;
  }
});