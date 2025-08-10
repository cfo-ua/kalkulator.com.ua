document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bac-form');
  const result = document.getElementById('bac-result');
  const drinkType = document.getElementById('drink-type');
  const customAlcoholGroup = document.getElementById('custom-alcohol-group');
  
  // Show/hide custom alcohol input
  drinkType.addEventListener('change', function() {
    if (this.value === 'custom') {
      customAlcoholGroup.style.display = 'block';
      document.getElementById('custom-alcohol').required = true;
    } else {
      customAlcoholGroup.style.display = 'none';
      document.getElementById('custom-alcohol').required = false;
    }
  });
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const weight = parseFloat(document.getElementById('weight').value);
      const gender = document.getElementById('gender').value;
      const drinkTypeValue = document.getElementById('drink-type').value;
      const customAlcohol = parseFloat(document.getElementById('custom-alcohol').value);
      const volume = parseFloat(document.getElementById('volume').value);
      const timePeriod = parseFloat(document.getElementById('time-period').value);
      const timeSince = parseFloat(document.getElementById('time-since').value);
      
      // Validation
      if (isNaN(weight) || isNaN(volume) || isNaN(timePeriod) || isNaN(timeSince)) {
        result.innerHTML = '<div class="error">❌ Please fill in all fields with valid numeric values.</div>';
        return;
      }
      
      if (weight < 30 || weight > 200) {
        result.innerHTML = '<div class="error">❌ Weight must be between 30 and 200 kg.</div>';
        return;
      }
      
      if (volume <= 0) {
        result.innerHTML = '<div class="error">❌ Volume consumed must be greater than zero.</div>';
        return;
      }
      
      // Get alcohol percentage
      let alcoholPercentage;
      switch (drinkTypeValue) {
        case 'beer': alcoholPercentage = 5; break;
        case 'wine': alcoholPercentage = 12; break;
        case 'vodka': alcoholPercentage = 40; break;
        case 'whiskey': alcoholPercentage = 43; break;
        case 'rum': alcoholPercentage = 40; break;
        case 'custom': 
          alcoholPercentage = customAlcohol;
          if (isNaN(alcoholPercentage) || alcoholPercentage < 0 || alcoholPercentage > 100) {
            result.innerHTML = '<div class="error">❌ Alcohol percentage must be between 0 and 100%.</div>';
            return;
          }
          break;
        default: alcoholPercentage = 40;
      }
      
      // Calculate using Widmark formula
      const gramsOfAlcohol = (volume * alcoholPercentage / 100) * 0.789; // density of ethanol
      const bodyWaterConstant = gender === 'male' ? 0.68 : 0.55; // r value
      const metabolismRate = 0.15; // grams per hour per kg
      
      // Peak BAC calculation
      const peakBAC = gramsOfAlcohol / (weight * bodyWaterConstant) * 1000; // in permille
      
      // Time to peak (assumption: during consumption + 30 minutes for absorption)
      const timeToPeak = timePeriod + 30;
      
      // Current BAC considering metabolism
      const totalTimeElapsed = timeSince + timeToPeak;
      const metabolizedAlcohol = (metabolismRate * weight * totalTimeElapsed) / 60; // convert to hours
      const currentGramsInSystem = Math.max(0, gramsOfAlcohol - metabolizedAlcohol);
      const currentBAC = Math.max(0, currentGramsInSystem / (weight * bodyWaterConstant) * 1000);
      
      // Convert permille to percentage for display
      const currentBACPercent = currentBAC / 10;
      
      // Time to reach common legal limits
      const legalLimit08 = 0.8; // 0.08% = 0.8‰
      const legalLimit05 = 0.5; // 0.05% = 0.5‰
      
      const timeTo08BAC = currentBAC > legalLimit08 ? 
        ((currentBAC - legalLimit08) * weight * bodyWaterConstant / 1000) / (metabolismRate * weight / 60) : 0;
        
      const timeTo05BAC = currentBAC > legalLimit05 ? 
        ((currentBAC - legalLimit05) * weight * bodyWaterConstant / 1000) / (metabolismRate * weight / 60) : 0;
      
      // Time to completely sober (0.0 BAC)
      const timeToZeroBAC = currentBAC > 0 ? 
        (currentBAC * weight * bodyWaterConstant / 1000) / (metabolismRate * weight / 60) : 0;
      
      // Impairment level assessment
      let impairmentLevel, impairmentDescription, impairmentColor;
      if (currentBACPercent < 0.02) {
        impairmentLevel = "Sober";
        impairmentDescription = "Legal to drive everywhere";
        impairmentColor = "success";
      } else if (currentBACPercent < 0.05) {
        impairmentLevel = "Slight relaxation";
        impairmentDescription = "May be legal to drive in some places";
        impairmentColor = "warning";
      } else if (currentBACPercent < 0.08) {
        impairmentLevel = "Noticeable impairment";
        impairmentDescription = "Illegal to drive in most countries";
        impairmentColor = "warning";
      } else if (currentBACPercent < 0.15) {
        impairmentLevel = "Strong intoxication";
        impairmentDescription = "Severely impaired coordination";
        impairmentColor = "error";
      } else if (currentBACPercent < 0.25) {
        impairmentLevel = "Severe poisoning";
        impairmentDescription = "Life-threatening condition";
        impairmentColor = "error";
      } else {
        impairmentLevel = "Critical condition";
        impairmentDescription = "Immediate medical attention required";
        impairmentColor = "error";
      }
      
      function formatTime(minutes) {
        if (minutes <= 0) return "0 min";
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hours > 0) {
          return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
        return `${mins}m`;
      }
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${impairmentColor}">
            <h6>🎯 Current BAC</h6>
            <div class="big-number">${currentBACPercent.toFixed(3)}%</div>
            <p>${currentBAC.toFixed(2)}‰ • ${impairmentLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🚗 To 0.05% BAC</h6>
            <div class="big-number">${formatTime(timeTo05BAC)}</div>
            <p>Legal limit in many countries</p>
          </div>
          
          <div class="insight-card success">
            <h6>✅ To complete sobriety</h6>
            <div class="big-number">${formatTime(timeToZeroBAC)}</div>
            <p>To 0.00% BAC</p>
          </div>
        </div>
        
        <hr>
        
        <div class="impairment-status ${impairmentColor}">
          <h4>📊 Impairment level: ${impairmentLevel}</h4>
          <p><strong>${impairmentDescription}</strong></p>
          
          <div class="effects-description">
            ${currentBACPercent < 0.02 ? 
              "<p>🟢 You are within legal limits for driving in most jurisdictions.</p>" :
              currentBACPercent < 0.05 ?
              "<p>🟡 Slight relaxation, minor attention reduction. Check local laws for driving.</p>" :
              currentBACPercent < 0.08 ?
              "<p>🟠 Noticeable impairment, reduced coordination and reaction time.</p>" :
              currentBACPercent < 0.15 ?
              "<p>🔴 Strong intoxication, significant impairment of motor functions and thinking.</p>" :
              currentBACPercent < 0.25 ?
              "<p>🔴 Severe alcohol poisoning, risk of unconsciousness.</p>" :
              "<p>🚨 CRITICAL CONDITION! Seek immediate medical attention!</p>"
            }
          </div>
        </div>
        
        <hr>
        
        <div class="legal-limits">
          <h4>⚖️ Legal driving limits by region:</h4>
          <div class="limits-grid">
            <div><strong>🇺🇸 USA:</strong> 0.08% BAC ${timeTo08BAC > 0 ? `(${formatTime(timeTo08BAC)} to reach)` : '✅'}</div>
            <div><strong>🇪🇺 EU/🇦🇺 Australia:</strong> 0.05% BAC ${timeTo05BAC > 0 ? `(${formatTime(timeTo05BAC)} to reach)` : '✅'}</div>
            <div><strong>🇸🇪 Sweden/🇵🇱 Poland:</strong> 0.02% BAC ${currentBACPercent > 0.02 ? `(${formatTime((currentBACPercent - 0.02) * 10 * weight * bodyWaterConstant / 1000 / (metabolismRate * weight / 60))} to reach)` : '✅'}</div>
          </div>
        </div>
        
        <hr>
        
        <div class="calculation-details">
          <h4>📋 Calculation details:</h4>
          <div class="details-grid">
            <div><strong>🍺 Drink type:</strong> ${drinkTypeValue === 'custom' ? `Custom (${alcoholPercentage}%)` : 
              drinkTypeValue === 'beer' ? 'Beer (5%)' :
              drinkTypeValue === 'wine' ? 'Wine (12%)' :
              drinkTypeValue === 'vodka' ? 'Vodka (40%)' :
              drinkTypeValue === 'whiskey' ? 'Whiskey (43%)' :
              'Rum (40%)'}</div>
            <div><strong>🥃 Volume:</strong> ${volume} ml</div>
            <div><strong>⚗️ Pure alcohol:</strong> ${gramsOfAlcohol.toFixed(1)} g</div>
            <div><strong>📈 Peak BAC:</strong> ${(peakBAC/10).toFixed(3)}% (${peakBAC.toFixed(2)}‰)</div>
            <div><strong>⏱️ Metabolism time:</strong> ${formatTime(totalTimeElapsed)}</div>
            <div><strong>🔬 Alcohol metabolized:</strong> ${metabolizedAlcohol.toFixed(1)} g</div>
          </div>
        </div>
        
        <div class="safety-warnings">
          <h4>⚠️ Important warnings:</h4>
          <ul>
            <li><strong>Individual differences:</strong> Actual BAC may vary significantly</li>
            <li><strong>Don't rely solely on the calculator</strong> for important decisions</li>
            <li><strong>Food and medications</strong> can affect alcohol absorption</li>
            <li><strong>When in doubt</strong> - always use a professional breathalyzer</li>
            <li><strong>Safety first:</strong> if you've been drinking - don't drive</li>
          </ul>
        </div>
        
        <div class="legal-notice">
          <p><strong>Legal disclaimer:</strong> This calculator provides estimates only and does not replace medical advice or official alcohol testing. Laws vary by jurisdiction - check local regulations.</p>
        </div>
      `;
    });
  }
});