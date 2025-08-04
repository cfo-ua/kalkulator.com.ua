document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('belt-size-form');
  const result = document.getElementById('belt-size-result');
  
  if (form) {
    // Auto-calculate on input change
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', calculateBeltSize);
    });
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateBeltSize();
    });
    
    // Initial calculation with default values
    calculateBeltSize();
  }
  
  function calculateBeltSize() {
    const waistMeasurement = parseInt(document.getElementById('waist-measurement').value) || 0;
    const wearingStyle = document.getElementById('wearing-style').value;
    const clothingType = document.getElementById('clothing-type').value;
    
    if (waistMeasurement < 60) {
      result.innerHTML = '<div class="insight-card warning">⚠️ <strong>Помилка:</strong> Будь ласка, введіть правильний обхват талії (мінімум 60 см).</div>';
      return;
    }
    
    // Calculate adjustments based on wearing style and clothing
    let styleAdjustment = 0;
    let clothingAdjustment = 0;
    let styleText = "";
    
    switch(wearingStyle) {
      case "waist":
        styleAdjustment = 5;
        styleText = "На талії (класичний)";
        break;
      case "hips":
        styleAdjustment = 8;
        styleText = "На стегнах (casual)";
        break;
      case "high":
        styleAdjustment = 3;
        styleText = "Високо на талії";
        break;
    }
    
    switch(clothingType) {
      case "thin":
        clothingAdjustment = 0;
        break;
      case "medium":
        clothingAdjustment = 2;
        break;
      case "thick":
        clothingAdjustment = 5;
        break;
    }
    
    // Calculate recommended belt size
    const recommendedSize = waistMeasurement + styleAdjustment + clothingAdjustment;
    
    // European sizes (5cm increments)
    const europeanSize = Math.ceil(recommendedSize / 5) * 5;
    
    // American sizes (inch equivalents)
    const americanSize = Math.round(recommendedSize / 2.54);
    
    // Universal sizes
    let universalSize, universalText;
    if (recommendedSize <= 75) {
      universalSize = "XS";
      universalText = "Дуже малий";
    } else if (recommendedSize <= 85) {
      universalSize = "S";
      universalText = "Малий";
    } else if (recommendedSize <= 95) {
      universalSize = "M";
      universalText = "Середній";
    } else if (recommendedSize <= 105) {
      universalSize = "L";
      universalText = "Великий";
    } else if (recommendedSize <= 115) {
      universalSize = "XL";
      universalText = "Дуже великий";
    } else if (recommendedSize <= 125) {
      universalSize = "XXL";
      universalText = "Дуже-дуже великий";
    } else {
      universalSize = "XXXL";
      universalText = "Максимальний";
    }
    
    let resultHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🎯 Рекомендований розмір</h6>
          <div class="big-number">${europeanSize}</div>
          <p>см (європейський)</p>
        </div>
        
        <div class="insight-card info">
          <h6>🇺🇸 Американський розмір</h6>
          <div class="big-number">${americanSize}"</div>
          <p>дюймів</p>
        </div>
        
        <div class="insight-card info">
          <h6>📏 Універсальний</h6>
          <div class="big-number">${universalSize}</div>
          <p>${universalText}</p>
        </div>
      </div>
    `;
    
    // Size range
    const minSize = europeanSize - 5;
    const maxSize = europeanSize + 5;
    
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>📐 Діапазон розмірів</h6>
          <div class="big-number">${minSize}-${maxSize}</div>
          <p>см (з урахуванням регулювання)</p>
        </div>
        
        <div class="insight-card warning">
          <h6>👔 Стиль носіння</h6>
          <div style="font-size: 1.2rem; margin: 0.5rem 0;">👔</div>
          <p>${styleText}</p>
        </div>
      </div>
    `;
    
    // Detailed breakdown
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
        <h4 style="margin-top: 0; color: #495057;">📋 Розрахунок розміру</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Обхват талії:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${waistMeasurement} см</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Поправка на стиль:</td>
            <td style="padding: 0.75rem 0; text-align: right;">+${styleAdjustment} см</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Поправка на одяг:</td>
            <td style="padding: 0.75rem 0; text-align: right;">+${clothingAdjustment} см</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Загальна довжина:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: #28a745; font-weight: 600;">${recommendedSize} см</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem 0; font-weight: 600;">Стандартний розмір:</td>
            <td style="padding: 0.75rem 0; text-align: right; font-size: 1.2rem; font-weight: bold; color: var(--accent);">${europeanSize} см</td>
          </tr>
        </table>
      </div>
    `;
    
    // Size conversion table
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%); padding: 1.5rem; border-radius: 8px; border: 2px solid var(--accent);">
        <h4 style="margin-top: 0; color: #495057;">🌍 Таблиця конвертації розмірів</h4>
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <tr style="background: rgba(0,123,255,0.1); font-weight: 600;">
            <td style="padding: 0.75rem; border: 1px solid #dee2e6;">Європейський (см)</td>
            <td style="padding: 0.75rem; border: 1px solid #dee2e6;">Американський (")</td>
            <td style="padding: 0.75rem; border: 1px solid #dee2e6;">Універсальний</td>
          </tr>
    `;
    
    // Generate size table around recommended size
    for (let eu = europeanSize - 10; eu <= europeanSize + 10; eu += 5) {
      if (eu < 70) continue;
      const us = Math.round(eu / 2.54);
      let uni;
      if (eu <= 75) uni = "XS";
      else if (eu <= 85) uni = "S";
      else if (eu <= 95) uni = "M";
      else if (eu <= 105) uni = "L";
      else if (eu <= 115) uni = "XL";
      else if (eu <= 125) uni = "XXL";
      else uni = "XXXL";
      
      const highlight = eu === europeanSize ? 'style="background: rgba(40,167,69,0.2); font-weight: 600;"' : '';
      
      resultHTML += `
        <tr ${highlight}>
          <td style="padding: 0.5rem; border: 1px solid #dee2e6;">${eu}</td>
          <td style="padding: 0.5rem; border: 1px solid #dee2e6;">${us}</td>
          <td style="padding: 0.5rem; border: 1px solid #dee2e6;">${uni}</td>
        </tr>
      `;
    }
    
    resultHTML += `
        </table>
        <p style="margin-top: 1rem; margin-bottom: 0; font-size: 0.9rem; color: #6c757d;">
          <strong>💡 Порада:</strong> Виділений рядок - ваш рекомендований розмір
        </p>
      </div>
    `;
    
    result.innerHTML = resultHTML;
  }
});