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
      result.innerHTML = '<div class="insight-card warning">⚠️ <strong>Error:</strong> Please fill all fields with valid values.</div>';
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
          <h6>🏷️ Tire Designation</h6>
          <div class="big-number">${tireDesignation}</div>
          <p>Standard marking</p>
        </div>
        
        <div class="insight-card info">
          <h6>⭕ Overall Diameter</h6>
          <div class="big-number">${Math.round(totalDiameter)}</div>
          <p>mm (${totalDiameterInches.toFixed(1)}")</p>
        </div>
        
        <div class="insight-card info">
          <h6>📏 Sidewall Height</h6>
          <div class="big-number">${Math.round(sidewallHeight)}</div>
          <p>mm</p>
        </div>
      </div>
      
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>🔄 Circumference</h6>
          <div class="big-number">${Math.round(circumference)}</div>
          <p>mm (${circumferenceM.toFixed(2)} m)</p>
        </div>
        
        <div class="insight-card warning">
          <h6>⚡ Revolutions per km</h6>
          <div class="big-number">${Math.round(revolutionsPerKm)}</div>
          <p>revolutions</p>
        </div>
      </div>
    `;
    
    // Detailed specifications
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
        <h4 style="margin-top: 0; color: #495057;">📋 Detailed Specifications</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Tread Width:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${width} mm</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Sidewall Height:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${aspectRatio}% (${Math.round(sidewallHeight)} mm)</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Rim Diameter:</td>
            <td style="padding: 0.75rem 0; text-align: right;">R${rimDiameter} (${rimDiameter} inches)</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Overall Diameter:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${Math.round(totalDiameter)} mm (${totalDiameterInches.toFixed(1)}")</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 0.75rem 0; font-weight: 600;">Circumference:</td>
            <td style="padding: 0.75rem 0; text-align: right;">${circumferenceM.toFixed(3)} m</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem 0; font-weight: 600;">Revolutions per kilometer:</td>
            <td style="padding: 0.75rem 0; text-align: right; color: var(--accent); font-weight: 600;">${Math.round(revolutionsPerKm)}</td>
          </tr>
        </table>
      </div>
    `;
    
    // Size recommendations
    const profileCategory = aspectRatio >= 70 ? "high" : aspectRatio >= 55 ? "medium" : "low";
    const profileAdvice = aspectRatio >= 70 ? 
      "Comfortable ride, better shock absorption, suitable for city roads" :
      aspectRatio >= 55 ?
      "Balance between comfort and handling" :
      "Sport handling, better stability at high speeds";
    
    resultHTML += `
      <hr style="margin: 2rem 0; border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(135deg, #fff8e1 0%, #f5f5dc 100%); padding: 1.5rem; border-radius: 8px; border: 2px solid #ffc107;">
        <h4 style="margin-top: 0; color: #495057;">💡 Recommendations</h4>
        <p><strong>Tire Profile:</strong> ${profileCategory} (${aspectRatio}%)</p>
        <p><strong>Characteristics:</strong> ${profileAdvice}</p>
        ${aspectRatio < 50 ? '<p><strong>⚠️ Warning:</strong> Low profile requires careful driving on rough roads.</p>' : ''}
        ${width > 250 ? '<p><strong>🏁 Sport:</strong> Wide tires improve grip but increase fuel consumption.</p>' : ''}
      </div>
    `;
    
    result.innerHTML = resultHTML;
  }
});