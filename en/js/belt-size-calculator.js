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
      result.innerHTML = '<div class="insight-card warning">⚠️ <strong>Error:</strong> Please enter a valid waist measurement (minimum 60 cm).</div>';
      return;
    }
    
    // Calculate adjustments based on wearing style and clothing
    let styleAdjustment = 0;
    let clothingAdjustment = 0;
    let styleText = "";
    
    switch(wearingStyle) {
      case "waist":
        styleAdjustment = 5;
        styleText = "At waist (classic)";
        break;
      case "hips":
        styleAdjustment = 8;
        styleText = "On hips (casual)";
        break;
      case "high":
        styleAdjustment = 3;
        styleText = "High waist";
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
      universalText = "Extra Small";
    } else if (recommendedSize <= 85) {
      universalSize = "S";
      universalText = "Small";
    } else if (recommendedSize <= 95) {
      universalSize = "M";
      universalText = "Medium";
    } else if (recommendedSize <= 105) {
      universalSize = "L";
      universalText = "Large";
    } else if (recommendedSize <= 115) {
      universalSize = "XL";
      universalText = "Extra Large";
    } else if (recommendedSize <= 125) {
      universalSize = "XXL";
      universalText = "Double Extra Large";
    } else {
      universalSize = "XXXL";
      universalText = "Triple Extra Large";
    }
    
    let resultHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🎯 Recommended Size</h6>
          <div class="big-number">${europeanSize}</div>
          <p>cm (European)</p>
        </div>
        
        <div class="insight-card info">
          <h6>🇺🇸 American Size</h6>
          <div class="big-number">${americanSize}"</div>
          <p>inches</p>
        </div>
        
        <div class="insight-card info">
          <h6>📏 Universal</h6>
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
          <h6>📐 Size Range</h6>
          <div class="big-number">${minSize}-${maxSize}</div>
          <p>cm (with adjustment)</p>
        </div>
        
        <div class="insight-card warning">
          <h6>👔 Wearing Style</h6>
          <div style="font-size: 1.2rem; margin: 0.5rem 0;">👔</div>
          <p>${styleText}</p>
        </div>
      </div>
    `;
    
    // Detailed breakdown
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
        <h4 style="margin-top: 0; color: #495057;">📋 Size Calculation</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Waist Measurement:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${waistMeasurement} cm</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Style Adjustment:</td>
            <td style="padding: 0.75rem 0; text-align: right;">+${styleAdjustment} cm</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Clothing Adjustment:</td>
            <td style="padding: 0.75rem 0; text-align: right;">+${clothingAdjustment} cm</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Total Length:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: #28a745; font-weight: 600;">${recommendedSize} cm</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem 0; font-weight: 600;">Standard Size:</td>
            <td style="padding: 0.75rem 0; text-align: right; font-size: 1.2rem; font-weight: bold; color: var(--accent);">${europeanSize} cm</td>
          </tr>
        </table>
      </div>
    `;
    
    // Size conversion table
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%); padding: 1.5rem; border-radius: 8px; border: 2px solid var(--accent);">
        <h4 style="margin-top: 0; color: #495057;">🌍 Size Conversion Chart</h4>
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <tr style="background: rgba(0,123,255,0.1); font-weight: 600;">
            <td style="padding: 0.75rem; border: 1px solid #dee2e6;">European (cm)</td>
            <td style="padding: 0.75rem; border: 1px solid #dee2e6;">American (")</td>
            <td style="padding: 0.75rem; border: 1px solid #dee2e6;">Universal</td>
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
          <strong>💡 Tip:</strong> Highlighted row is your recommended size
        </p>
      </div>
    `;
    
    result.innerHTML = resultHTML;
  }
});