document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("smart-home-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const homeSize = parseFloat(document.getElementById("homeSize").value);
    const monthlyUtility = parseFloat(document.getElementById("monthlyUtility").value);
    const energyRate = parseFloat(document.getElementById("energyRate").value);
    const thermostatCost = parseFloat(document.getElementById("thermostatCost").value) || 0;
    const lightingCost = parseFloat(document.getElementById("lightingCost").value) || 0;
    const securityCost = parseFloat(document.getElementById("securityCost").value) || 0;
    const plugsCost = parseFloat(document.getElementById("plugsCost").value) || 0;
    const waterCost = parseFloat(document.getElementById("waterCost").value) || 0;
    const energySavingsPercent = parseFloat(document.getElementById("energySavingsPercent").value) / 100;
    const insuranceDiscount = parseFloat(document.getElementById("insuranceDiscount").value) / 100;
    const annualInsurance = parseFloat(document.getElementById("annualInsurance").value);

    // Calculate totals
    const totalDeviceCost = thermostatCost + lightingCost + securityCost + plugsCost + waterCost;
    const annualUtilityCost = monthlyUtility * 12;
    
    // Calculate annual savings
    const annualEnergySavings = annualUtilityCost * energySavingsPercent;
    const annualInsuranceSavings = annualInsurance * insuranceDiscount;
    
    // Estimate additional benefits
    const estimatedMaintenanceSavings = homeSize * 0.15; // $0.15 per sq ft annually
    const propertyValueIncrease = totalDeviceCost * 0.8; // 80% of device cost added to home value
    
    // Total annual savings
    const totalAnnualSavings = annualEnergySavings + annualInsuranceSavings + estimatedMaintenanceSavings;
    
    // Calculate payback period
    const paybackYears = totalDeviceCost / totalAnnualSavings;
    
    // Calculate 10-year projections
    const tenYearSavings = totalAnnualSavings * 10;
    const netBenefit = tenYearSavings - totalDeviceCost + propertyValueIncrease;
    const roi = ((netBenefit - totalDeviceCost) / totalDeviceCost) * 100;

    // Individual device analysis
    const deviceAnalysis = [];
    
    if (thermostatCost > 0) {
      const thermostatSavings = annualUtilityCost * 0.15; // 15% typical savings
      deviceAnalysis.push({
        name: "Smart Thermostat",
        cost: thermostatCost,
        annualSavings: thermostatSavings,
        payback: thermostatCost / thermostatSavings
      });
    }
    
    if (lightingCost > 0) {
      const lightingSavings = annualUtilityCost * 0.08; // 8% typical savings
      deviceAnalysis.push({
        name: "Smart Lighting",
        cost: lightingCost,
        annualSavings: lightingSavings,
        payback: lightingCost / lightingSavings
      });
    }
    
    if (securityCost > 0) {
      const securitySavings = annualInsuranceSavings + estimatedMaintenanceSavings * 0.3;
      deviceAnalysis.push({
        name: "Security System",
        cost: securityCost,
        annualSavings: securitySavings,
        payback: securityCost / securitySavings
      });
    }

    // Sort devices by payback period
    deviceAnalysis.sort((a, b) => a.payback - b.payback);

    // Display results
    const resultBlock = document.getElementById("smart-home-result");
    resultBlock.innerHTML = `
      <h3>🏠 Smart Home Investment Analysis</h3>
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>💰 Total Investment</h6>
          <div class="big-number">$${totalDeviceCost.toLocaleString()}</div>
          <p>Upfront device costs<br>
          Property value: +$${propertyValueIncrease.toLocaleString()}<br>
          ${Math.round(paybackYears * 10) / 10} year payback</p>
        </div>
        
        <div class="insight-card success">
          <h6>💡 Annual Savings</h6>
          <div class="big-number">$${Math.round(totalAnnualSavings).toLocaleString()}</div>
          <p>Energy: $${Math.round(annualEnergySavings).toLocaleString()}<br>
          Insurance: $${Math.round(annualInsuranceSavings).toLocaleString()}<br>
          Maintenance: $${Math.round(estimatedMaintenanceSavings).toLocaleString()}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📈 10-Year ROI</h6>
          <div class="big-number">${Math.round(roi)}%</div>
          <p>Net benefit: $${Math.round(netBenefit).toLocaleString()}<br>
          Total savings: $${Math.round(tenYearSavings).toLocaleString()}<br>
          ${roi > 100 ? 'Excellent' : roi > 50 ? 'Good' : roi > 0 ? 'Positive' : 'Poor'} investment</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📊 Device Priority Analysis</h4>
        
        ${deviceAnalysis.length > 0 ? `
        <div style="display: grid; gap: 1rem; margin-top: 1rem;">
          ${deviceAnalysis.map((device, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid ${index === 0 ? '#28a745' : index === 1 ? '#17a2b8' : '#ffc107'};">
              <div>
                <strong>${index + 1}. ${device.name}</strong><br>
                <small>Cost: $${device.cost.toLocaleString()} | Annual savings: $${Math.round(device.annualSavings).toLocaleString()}</small>
              </div>
              <div style="text-align: right;">
                <strong>${Math.round(device.payback * 10) / 10} years</strong><br>
                <small>Payback period</small>
              </div>
            </div>
          `).join('')}
        </div>
        ` : '<p>No devices selected for analysis.</p>'}
        
        <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px;">
            <strong>💚 Energy Benefits:</strong><br>
            • ${energySavingsPercent * 100}% reduction in utility costs<br>
            • $${Math.round(annualEnergySavings / 12).toLocaleString()} monthly savings<br>
            • ${Math.round(annualEnergySavings / energyRate).toLocaleString()} kWh saved annually<br>
            • Reduced carbon footprint
          </div>
          
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px;">
            <strong>🛡️ Additional Benefits:</strong><br>
            • Enhanced home security & monitoring<br>
            • Improved comfort & convenience<br>
            • Remote control & automation<br>
            • Potential insurance discounts
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${paybackYears <= 3 ? '#d4edda' : paybackYears <= 7 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${paybackYears <= 3 ? '#28a745' : paybackYears <= 7 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Investment Recommendation:</strong><br>
          ${paybackYears <= 3 ? 
            '🎯 Excellent investment! These devices will pay for themselves quickly and provide long-term value.' :
            paybackYears <= 7 ?
            '✅ Good investment with reasonable payback period. Consider starting with highest-priority devices.' :
            '⚠️ Longer payback period. Focus on devices with best ROI or consider reducing costs.'
          }
        </div>
      </div>
    `;
  });
});