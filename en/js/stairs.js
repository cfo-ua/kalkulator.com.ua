document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('stairs-form');
  const result = document.getElementById('stairs-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const totalRise = parseFloat(document.getElementById('stairs-total-rise').value);
      const totalRun = parseFloat(document.getElementById('stairs-total-run').value);
      const desiredRiser = parseFloat(document.getElementById('stairs-riser').value);
      const desiredTread = parseFloat(document.getElementById('stairs-tread').value);
      
      if (totalRise <= 0 || desiredRiser <= 0 || desiredTread <= 0) {
        result.textContent = "Please enter all dimensions with positive values.";
        return;
      }
      
      // Calculate optimal number of steps
      const numberOfSteps = Math.round(totalRise / desiredRiser);
      const actualRiser = totalRise / numberOfSteps;
      const actualTotalRun = (numberOfSteps - 1) * desiredTread;
      
      // Check building code compliance
      const riserCompliant = actualRiser >= 4 && actualRiser <= 7.75;
      const treadCompliant = desiredTread >= 10;
      const proportionFormula1 = actualRiser + desiredTread; // Should be 17-18
      const proportionFormula2 = (2 * actualRiser) + desiredTread; // Should be 24-25
      
      // Check if stairs fit in available space
      const fitsInSpace = totalRun ? actualTotalRun <= totalRun : true;
      const spaceExcess = totalRun ? totalRun - actualTotalRun : 0;
      
      // Generate warnings/recommendations
      let warnings = [];
      let recommendations = [];
      
      if (!riserCompliant) {
        warnings.push(`⚠️ Riser height ${actualRiser.toFixed(2)}" is outside code range (4-7.75")`);
      }
      if (!treadCompliant) {
        warnings.push(`⚠️ Tread depth ${desiredTread}" is below minimum (10")`);
      }
      if (proportionFormula1 < 17 || proportionFormula1 > 18) {
        recommendations.push(`📐 Rise + Run = ${proportionFormula1.toFixed(1)}" (ideal: 17-18")`);
      }
      if (proportionFormula2 < 24 || proportionFormula2 > 25) {
        recommendations.push(`📐 2×Rise + Run = ${proportionFormula2.toFixed(1)}" (ideal: 24-25")`);
      }
      if (!fitsInSpace) {
        warnings.push(`🚧 Stairs need ${actualTotalRun.toFixed(1)}" but only ${totalRun}" available`);
      }
      
      // Calculate angles
      const stairAngle = Math.atan(actualRiser / desiredTread) * (180 / Math.PI);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Stair Calculations:</h4>
          <p><strong>${numberOfSteps} steps</strong> (risers)</p>
          <p><strong>Riser height: ${actualRiser.toFixed(3)}"</strong> each</p>
          <p><strong>Tread depth: ${desiredTread}"</strong> each</p>
          <p><strong>Total run needed: ${actualTotalRun.toFixed(1)}"</strong></p>
          ${totalRun ? `<p>Available space: ${totalRun}" (${spaceExcess >= 0 ? 'fits!' : 'too tight!'})</p>` : ''}
        </div>
        
        <div class="result-proportions">
          <h4>Design Proportions:</h4>
          <p>Rise + Run: ${proportionFormula1.toFixed(1)}" ${proportionFormula1 >= 17 && proportionFormula1 <= 18 ? '✅' : '⚠️'}</p>
          <p>2×Rise + Run: ${proportionFormula2.toFixed(1)}" ${proportionFormula2 >= 24 && proportionFormula2 <= 25 ? '✅' : '⚠️'}</p>
          <p>Stair angle: ${stairAngle.toFixed(1)}° ${stairAngle >= 30 && stairAngle <= 40 ? '✅' : '⚠️'}</p>
        </div>
        
        <div class="result-compliance">
          <h4>Building Code Compliance:</h4>
          <p>Riser height: ${riserCompliant ? '✅ Compliant' : '❌ Non-compliant'}</p>
          <p>Tread depth: ${treadCompliant ? '✅ Compliant' : '❌ Non-compliant'}</p>
          <p>Uniformity: ✅ All steps identical</p>
        </div>
        
        ${warnings.length > 0 ? `
        <div class="result-warnings">
          <h4>Warnings:</h4>
          ${warnings.map(w => `<p>${w}</p>`).join('')}
        </div>
        ` : ''}
        
        ${recommendations.length > 0 ? `
        <div class="result-recommendations">
          <h4>Optimization Suggestions:</h4>
          ${recommendations.map(r => `<p>${r}</p>`).join('')}
        </div>
        ` : ''}
        
        <div class="result-materials">
          <h4>Material Estimates:</h4>
          <p>Stringers: ${numberOfSteps <= 14 ? '2×12' : '2×14'} lumber × 2-3 pieces</p>
          <p>Treads: ${numberOfSteps - 1} pieces @ ${desiredTread}" deep</p>
          <p>Risers: ${numberOfSteps} pieces @ ${actualRiser.toFixed(2)}" high</p>
        </div>
        
        <div class="result-tips">
          <p><em>💡 Always verify local building codes before construction</em></p>
          <p><em>📏 Double-check measurements and use a professional for complex stairs</em></p>
          <p><em>🔨 Consider hiring a contractor for structural stairs</em></p>
        </div>
      `;
    });
  }
});