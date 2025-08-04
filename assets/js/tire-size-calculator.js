document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('tire-size-form');
  const result = document.getElementById('tire-size-result');
  
  if (form) {
    // Auto-calculate on input change
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', calculateTireSize);
    });
    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateTireSize();
    });
    
    // Initial calculation with default values
    calculateTireSize();
  }
  
  function calculateTireSize() {
    const width = parseInt(document.getElementById('tire-width').value) || 0;
    const aspectRatio = parseInt(document.getElementById('aspect-ratio').value) || 0;
    const rimDiameter = parseInt(document.getElementById('rim-diameter').value) || 0;
    
    if (width < 100 || aspectRatio < 25 || rimDiameter < 13) {
      result.innerHTML = '<div class="insight-card warning">⚠️ <strong>Помилка:</strong> Будь ласка, заповніть всі поля коректними значеннями.</div>';
      return;
    }
    
    // Calculations
    const sidewallHeight = (width * aspectRatio) / 100; // mm
    const rimDiameterMm = rimDiameter * 25.4; // convert inches to mm
    const totalDiameter = rimDiameterMm + (2 * sidewallHeight); // mm
    const totalDiameterInches = totalDiameter / 25.4; // inches
    const circumference = Math.PI * totalDiameter; // mm
    const circumferenceM = circumference / 1000; // meters
    const revolutionsPerKm = 1000 / circumferenceM;
    
    // Generate tire designation
    const tireDesignation = `${width}/${aspectRatio} R${rimDiameter}`;
    
    let resultHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🏷️ Маркування шини</h6>
          <div class="big-number">${tireDesignation}</div>
          <p>Стандартне позначення</p>
        </div>
        
        <div class="insight-card info">
          <h6>⭕ Повний діаметр</h6>
          <div class="big-number">${Math.round(totalDiameter)}</div>
          <p>мм (${totalDiameterInches.toFixed(1)}")</p>
        </div>
        
        <div class="insight-card info">
          <h6>📏 Висота профілю</h6>
          <div class="big-number">${Math.round(sidewallHeight)}</div>
          <p>мм</p>
        </div>
      </div>
      
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>🔄 Довжина кола</h6>
          <div class="big-number">${Math.round(circumference)}</div>
          <p>мм (${circumferenceM.toFixed(2)} м)</p>
        </div>
        
        <div class="insight-card warning">
          <h6>⚡ Обертів на км</h6>
          <div class="big-number">${Math.round(revolutionsPerKm)}</div>
          <p>обертів</p>
        </div>
      </div>
    `;
    
    // Detailed specifications
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
        <h4 style="margin-top: 0; color: #495057;">📋 Детальні характеристики</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Ширина протектора:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${width} мм</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Висота профілю:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${aspectRatio}% (${Math.round(sidewallHeight)} мм)</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Діаметр диска:</td>
            <td style="padding: 0.75rem 0; text-align: right;">R${rimDiameter} (${rimDiameter} дюймів)</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Зовнішній діаметр:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${Math.round(totalDiameter)} мм (${totalDiameterInches.toFixed(1)}")</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Довжина кола:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${circumferenceM.toFixed(3)} м</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem 0; font-weight: 600;">Обертів на кілометр:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: var(--accent); font-weight: 600;">${Math.round(revolutionsPerKm)}</td>
          </tr>
        </table>
      </div>
    `;
    
    // Size recommendations
    const profileCategory = aspectRatio >= 70 ? "високий" : aspectRatio >= 55 ? "середній" : "низький";
    const profileAdvice = aspectRatio >= 70 ? 
      "М'яка їзда, краща амортизація, підходить для міських доріг" :
      aspectRatio >= 55 ?
      "Баланс між комфортом та керованістю" :
      "Спортивна керованість, краща стабільність на високих швидкостях";
    
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(135deg, #fff8e1 0%, #f5f5dc 100%); padding: 1.5rem; border-radius: 8px; border: 2px solid #ffc107;">
        <h4 style="margin-top: 0; color: #495057;">💡 Рекомендації</h4>
        <p><strong>Профіль шини:</strong> ${profileCategory} (${aspectRatio}%)</p>
        <p><strong>Характеристики:</strong> ${profileAdvice}</p>
        ${aspectRatio < 50 ? '<p><strong>⚠️ Увага:</strong> Низький профіль вимагає обережної їзди на поганих дорогах.</p>' : ''}
        ${width > 250 ? '<p><strong>🏁 Спорт:</strong> Широкі шини покращують зчеплення, але збільшують споживання палива.</p>' : ''}
      </div>
    `;
    
    result.innerHTML = resultHTML;
  }
});