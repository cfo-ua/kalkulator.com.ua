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
        result.innerHTML = '<div class="error">⚠️ Введіть коректну кількість гостей</div>';
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
      
      // Calculate costs (approximate)
      const tableRentCost = tableType === 'round' ? 300 : 250; // UAH per table
      const totalRentCost = tablesNeeded * tableRentCost;
      
      // Generate detailed results
      let tableTypeText = tableType === 'round' ? 'круглих' : 'прямокутних';
      let sizeText;
      switch (tableSize) {
        case 'small': sizeText = 'малих'; break;
        case 'medium': sizeText = 'середніх'; break;
        case 'large': sizeText = 'великих'; break;
      }
      
      let styleText;
      switch (seatingStyle) {
        case 'comfortable': styleText = 'комфортне розміщення'; break;
        case 'standard': styleText = 'стандартне розміщення'; break;
        case 'compact': styleText = 'компактне розміщення'; break;
      }
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🍽️ Кількість столів</h6>
            <div class="big-number">${tablesNeeded}</div>
            <p>${tableTypeText} ${sizeText} столів</p>
          </div>
          
          <div class="insight-card info">
            <h6>👥 Загальна місткість</h6>
            <div class="big-number">${totalCapacity}</div>
            <p>місць (${guestsCount} гостей + ${extraSeats} вільних)</p>
          </div>
          
          <div class="insight-card warning">
            <h6>💰 Орієнтовна вартість оренди</h6>
            <div class="big-number">${totalRentCost.toLocaleString()}</div>
            <p>грн за день</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
          <h4>📋 Деталі розрахунку:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            <li><strong>Тип столів:</strong> ${tableTypeText} ${sizeText}</li>
            <li><strong>Стиль розміщення:</strong> ${styleText}</li>
            <li><strong>Осіб за столом:</strong> ${effectiveCapacity} (базово ${baseCapacity})</li>
            <li><strong>Всього гостей:</strong> ${guestsCount}</li>
            <li><strong>Рекомендована кількість:</strong> ${tablesNeeded} столів</li>
          </ul>
          
          <h4>💡 Додаткові рекомендації:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${extraSeats > 3 ? '<li>🔄 Розгляньте можливість зменшення кількості столів або збільшення кількості осіб за столом</li>' : ''}
            <li>📏 Забезпечте мінімум 120 см між столами для проходу</li>
            <li>🪑 Замовте на 5-10% більше стільців на випадок несподіваних гостей</li>
            ${tableType === 'round' ? '<li>🔄 Круглі столи краще для спілкування, але займають більше місця</li>' : '<li>📐 Прямокутні столи економлять простір і зручні для презентацій</li>'}
          </ul>
        </div>
      `;
    });
  }
});