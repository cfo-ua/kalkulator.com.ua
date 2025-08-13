document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('carpet-form');
  const result = document.getElementById('carpet-result');
  const addRoomBtn = document.getElementById('add-room');
  const additionalRoomsDiv = document.getElementById('additional-rooms');
  
  let roomCount = 0;
  
  if (form) {
    // Set default values
    document.getElementById('carpet-length').value = 5;
    document.getElementById('carpet-width').value = 4;
    document.getElementById('carpet-price').value = 600;
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
        <h4>Кімната ${roomCount + 1}</h4>
        <label>
          Довжина (м):
          <input type="number" class="room-length" min="0" step="0.1" placeholder="3" value="3">
        </label>
        <label>
          Ширина (м):
          <input type="number" class="room-width" min="0" step="0.1" placeholder="3" value="3">
        </label>
        <button type="button" class="remove-room">❌ Видалити</button>
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
    const rollWidth = parseFloat(document.getElementById('carpet-roll-width').value) || 2.5;
    const pricePerM2 = parseFloat(document.getElementById('carpet-price').value) || 600;
    const wastePercent = parseFloat(document.getElementById('carpet-waste').value) || 10;
    
    if (mainLength <= 0 || mainWidth <= 0) {
      result.innerHTML = '<p class="error">⚠️ Введіть розміри основної кімнати.</p>';
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
      const roomName = index === 0 ? 'Основна кімната' : `Кімната ${index + 1}`;
      let rollLength = 0;
      let layout = '';
      
      if (room.width <= rollWidth) {
        // Roll can cover width, need length
        rollLength = room.length;
        layout = `${rollWidth}м × ${room.length}м`;
      } else {
        // Need to join rolls or cut differently
        const rollsAcrossWidth = Math.ceil(room.width / rollWidth);
        rollLength = room.length * rollsAcrossWidth;
        layout = `${rollsAcrossWidth} смуги по ${rollWidth}м × ${room.length}м`;
      }
      
      rollsBreakdown.push({
        room: roomName,
        dimensions: `${room.length}м × ${room.width}м`,
        area: room.area,
        rollLength: rollLength,
        layout: layout
      });
      
      totalRollLength += rollLength;
    });
    
    // Add waste to roll length
    totalRollLength *= wasteMultiplier;
    
    // Calculate cost
    const totalCost = areaWithWaste * pricePerM2;
    const costPerRoom = totalCost / rooms.length;
    
    // Calculate if standard roll sizes work better
    const rollSuggestions = [2, 2.5, 3, 3.5, 4, 5].map(width => {
      const efficiency = Math.min(1, totalArea / (totalRollLength * width));
      return {width, efficiency: (efficiency * 100).toFixed(1)};
    });
    
    result.innerHTML = `
      <div class="insight-card">
        <div class="result-section">
          <h4>📊 Загальна інформація</h4>
          <div class="result-grid">
            <div class="result-item">
              <span class="label">Кількість кімнат:</span>
              <span class="value">${rooms.length}</span>
            </div>
            <div class="result-item">
              <span class="label">Загальна площа:</span>
              <span class="value">${totalArea.toFixed(1)} м²</span>
            </div>
            <div class="result-item">
              <span class="label">З запасом (${wastePercent}%):</span>
              <span class="value">${areaWithWaste.toFixed(1)} м²</span>
            </div>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section cost-section">
          <h4>💰 Вартість ковроліну</h4>
          <div class="cost-highlight">
            <p><strong>${totalCost.toLocaleString('uk-UA')} грн</strong></p>
            <p class="cost-per-m2">${pricePerM2} грн/м²</p>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section">
          <h4>📏 Потрібна довжина рулону</h4>
          <div class="roll-info">
            <p><strong>Ширина рулону:</strong> ${rollWidth} м</p>
            <p><strong>Потрібна довжина:</strong> ${totalRollLength.toFixed(1)} м</p>
            <p><strong>Рулонів по 25м:</strong> ${Math.ceil(totalRollLength / 25)} шт.</p>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section">
          <h4>🏠 Розкладка по кімнатах</h4>
          <div class="rooms-breakdown">
            ${rollsBreakdown.map(room => `
              <div class="room-item">
                <h5>${room.room}</h5>
                <p><strong>Розміри:</strong> ${room.dimensions} (${room.area.toFixed(1)} м²)</p>
                <p><strong>Укладка:</strong> ${room.layout}</p>
                <p><strong>Довжина рулону:</strong> ${room.rollLength.toFixed(1)} м</p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-section">
          <h4>💡 Рекомендації по ширині рулону</h4>
          <div class="suggestions">
            ${rollSuggestions.map(sugg => `
              <div class="suggestion-item ${sugg.width == rollWidth ? 'selected' : ''}">
                <span>Ширина ${sugg.width}м:</span>
                <span>ефективність ${sugg.efficiency}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="result-tips">
          <h4>📋 Поради по укладанні</h4>
          <ul>
            <li><strong>Акліматизація:</strong> Залиште ковролін в кімнаті на 24 години</li>
            <li><strong>Інструменти:</strong> Гострий ніж, лінійка, молоток, кнопки/клей</li>
            <li><strong>Направлення ворсу:</strong> Укладайте всі шматки в одному напрямку</li>
            <li><strong>Стики:</strong> Мінімізуйте кількість швів, особливо в зонах руху</li>
            <li><strong>Підкладка:</strong> Використовуйте якісну підкладку для комфорту</li>
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
        .cost-per-m2 { font-size: 0.9em; opacity: 0.9; }
        .roll-info, .room-item { 
          background: #e3f2fd; 
          padding: 12px; 
          border-radius: 6px; 
          margin: 8px 0; 
        }
        .room-item h5 { margin: 0 0 8px 0; color: #1976d2; }
        .suggestions { display: flex; flex-wrap: wrap; gap: 10px; }
        .suggestion-item { 
          display: flex; 
          justify-content: space-between; 
          background: #f0f0f0; 
          padding: 8px 12px; 
          border-radius: 4px; 
          min-width: 150px; 
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