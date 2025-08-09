document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('tables-form');
  const result = document.getElementById('tables-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const guestsCount = parseInt(document.getElementById('guests-count').value);
      const tableType = document.getElementById('table-type').value;
      const tableSize = document.getElementById('table-size').value;
      const seatingStyle = document.getElementById('seating-style').value;
      
      if (guestsCount <= 0) {
        result.innerHTML = '<div class="error">⚠️ Please enter a valid number of guests</div>';
        return;
      }
      
      // Define capacity based on table size and seating style
      let baseCapacity;
      switch (tableSize) {
        case 'small': baseCapacity = 6; break;
        case 'medium': baseCapacity = 8; break;
        case 'large': baseCapacity = 10; break;
        default: baseCapacity = 8;
      }
      
      // Adjust capacity based on seating style
      let capacityMultiplier;
      switch (seatingStyle) {
        case 'comfortable': capacityMultiplier = 0.8; break;
        case 'standard': capacityMultiplier = 1.0; break;
        case 'compact': capacityMultiplier = 1.2; break;
        default: capacityMultiplier = 1.0;
      }
      
      const effectiveCapacity = Math.floor(baseCapacity * capacityMultiplier);
      const tablesNeeded = Math.ceil(guestsCount / effectiveCapacity);
      const totalCapacity = tablesNeeded * effectiveCapacity;
      const extraSeats = totalCapacity - guestsCount;
      
      // Calculate costs (approximate in USD)
      const tableRentCost = tableType === 'round' ? 15 : 12; // USD per table
      const totalRentCost = tablesNeeded * tableRentCost;
      
      // Generate detailed results
      let tableTypeText = tableType === 'round' ? 'round' : 'rectangular';
      let sizeText;
      switch (tableSize) {
        case 'small': sizeText = 'small'; break;
        case 'medium': sizeText = 'medium'; break;
        case 'large': sizeText = 'large'; break;
      }
      
      let styleText;
      switch (seatingStyle) {
        case 'comfortable': styleText = 'comfortable seating'; break;
        case 'standard': styleText = 'standard seating'; break;
        case 'compact': styleText = 'compact seating'; break;
      }
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🍽️ Number of Tables</h6>
            <div class="big-number">${tablesNeeded}</div>
            <p>${sizeText} ${tableTypeText} tables</p>
          </div>
          
          <div class="insight-card info">
            <h6>👥 Total Capacity</h6>
            <div class="big-number">${totalCapacity}</div>
            <p>seats (${guestsCount} guests + ${extraSeats} extra)</p>
          </div>
          
          <div class="insight-card warning">
            <h6>💰 Estimated Rental Cost</h6>
            <div class="big-number">$${totalRentCost}</div>
            <p>per day</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
          <h4>📋 Calculation Details:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            <li><strong>Table type:</strong> ${sizeText} ${tableTypeText}</li>
            <li><strong>Seating style:</strong> ${styleText}</li>
            <li><strong>People per table:</strong> ${effectiveCapacity} (base ${baseCapacity})</li>
            <li><strong>Total guests:</strong> ${guestsCount}</li>
            <li><strong>Recommended quantity:</strong> ${tablesNeeded} tables</li>
          </ul>
          
          <h4>💡 Additional Recommendations:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${extraSeats > 3 ? '<li>🔄 Consider reducing the number of tables or increasing people per table</li>' : ''}
            <li>📏 Ensure at least 48 inches between tables for walkways</li>
            <li>🪑 Order 5-10% more chairs for unexpected guests</li>
            ${tableType === 'round' ? '<li>🔄 Round tables are better for conversation but take more space</li>' : '<li>📐 Rectangular tables save space and are convenient for presentations</li>'}
          </ul>
        </div>
      `;
    });
  }
});