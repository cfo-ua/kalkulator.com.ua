document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('stair-stringer-form');
  const result = document.getElementById('stair-stringer-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const totalRise = parseFloat(document.getElementById('stringer-total-rise').value);
      const totalRun = parseFloat(document.getElementById('stringer-total-run').value);
      const stairWidth = parseFloat(document.getElementById('stringer-width').value);
      const [lumberSize, lumberDepth] = document.getElementById('stringer-lumber').value.split(',');
      const depth = parseFloat(lumberDepth);
      
      if (totalRise <= 0 || totalRun <= 0 || stairWidth <= 0) {
        result.textContent = "Please enter valid measurements.";
        return;
      }
      
      // Calculate optimal number of risers
      const idealRiserHeight = 7.5; // inches
      const numberOfRisers = Math.round(totalRise / idealRiserHeight);
      const actualRiserHeight = totalRise / numberOfRisers;
      const numberOfTreads = numberOfRisers - 1;
      const treadDepth = totalRun / numberOfTreads;
      
      // Check building code compliance
      const riserCompliant = actualRiserHeight >= 4 && actualRiserHeight <= 7.75;
      const treadCompliant = treadDepth >= 10;
      
      // Calculate number of stringers needed
      const stringerSpacing = 16; // inches on center
      const numberOfStringers = Math.floor(stairWidth / stringerSpacing) + 1;
      const actualSpacing = stairWidth / (numberOfStringers - 1);
      
      // Calculate stringer length
      const stringerLength = Math.sqrt(Math.pow(totalRise, 2) + Math.pow(totalRun, 2));
      const stringerLengthFeet = stringerLength / 12;
      
      // Check if lumber is adequate
      const remainingDepth = depth - actualRiserHeight;
      const adequateDepth = remainingDepth >= 5; // Minimum 5" remaining
      
      // Calculate materials
      const lumberCost = numberOfStringers * 25; // $25 per 2×12×16
      const treadCost = numberOfTreads * (stairWidth / 12) * 4; // $4 per board foot for treads
      const riserCost = numberOfRisers * (stairWidth / 12) * 3; // $3 per board foot for risers
      const hardwareCost = 50; // Misc hardware
      const totalCost = lumberCost + treadCost + riserCost + hardwareCost;
      
      // Calculate angles
      const stringerAngle = Math.atan(totalRise / totalRun) * (180 / Math.PI);
      const plumbCutAngle = 90 - stringerAngle;
      const levelCutAngle = stringerAngle;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Stair Calculations:</h4>
          <p><strong>${numberOfRisers} risers</strong> @ ${actualRiserHeight.toFixed(3)}" each</p>
          <p><strong>${numberOfTreads} treads</strong> @ ${treadDepth.toFixed(2)}" each</p>
          <p>Total rise: ${totalRise}"</p>
          <p>Total run: ${totalRun}"</p>
          <p>Stair angle: ${stringerAngle.toFixed(1)}°</p>
        </div>
        
        <div class="result-stringers">
          <h4>Stringer Requirements:</h4>
          <p><strong>${numberOfStringers} stringers needed</strong></p>
          <p>Stringer spacing: ${actualSpacing.toFixed(1)}" on center</p>
          <p>Lumber: ${numberOfStringers} pieces of ${lumberSize}×16'</p>
          <p>Stringer length: ${stringerLengthFeet.toFixed(1)} feet</p>
          <p>Material depth: ${depth}" (${lumberSize})</p>
        </div>
        
        <div class="result-compliance">
          <h4>Code Compliance:</h4>
          <p>Riser height: ${riserCompliant ? '✅ Compliant' : '❌ Non-compliant'} (${actualRiserHeight.toFixed(2)}")</p>
          <p>Tread depth: ${treadCompliant ? '✅ Compliant' : '❌ Non-compliant'} (${treadDepth.toFixed(2)}")</p>
          <p>Remaining lumber: ${adequateDepth ? '✅ Adequate' : '❌ Insufficient'} (${remainingDepth.toFixed(1)}")</p>
          <p>Uniformity: ✅ All steps identical</p>
        </div>
        
        <div class="result-cutting">
          <h4>Cutting Information:</h4>
          <p><strong>Plumb cut angle: ${plumbCutAngle.toFixed(1)}°</strong></p>
          <p><strong>Level cut angle: ${levelCutAngle.toFixed(1)}°</strong></p>
          <p>Tread cut depth: ${treadDepth.toFixed(2)}"</p>
          <p>Riser cut depth: ${actualRiserHeight.toFixed(2)}"</p>
          <p>Bottom cut: Level cut for landing</p>
          <p>Top cut: Plumb cut for attachment</p>
        </div>
        
        <div class="result-layout">
          <h4>Layout Instructions:</h4>
          <p>1. Mark first riser at top of board</p>
          <p>2. Use framing square with ${treadDepth.toFixed(1)}" and ${actualRiserHeight.toFixed(1)}" settings</p>
          <p>3. Mark all treads and risers consistently</p>
          <p>4. Mark plumb and level cuts at ends</p>
          <p>5. Cut first stringer and test fit</p>
          <p>6. Use as template for remaining stringers</p>
        </div>
        
        <div class="result-materials">
          <h4>Material Costs:</h4>
          <p>Stringers: $${lumberCost} (${numberOfStringers} @ $25 each)</p>
          <p>Treads: $${treadCost.toFixed(0)} (${numberOfTreads} @ ${(stairWidth/12).toFixed(1)} bd ft each)</p>
          <p>Risers: $${riserCost.toFixed(0)} (${numberOfRisers} @ ${(stairWidth/12).toFixed(1)} bd ft each)</p>
          <p>Hardware: $${hardwareCost}</p>
          <p><strong>Total: $${totalCost.toFixed(0)}</strong></p>
        </div>
        
        <div class="result-tools">
          <h4>Tools Required:</h4>
          <p>📐 Framing square (for layout)</p>
          <p>🪚 Circular saw (main cuts)</p>
          <p>🔧 Jigsaw (plunge cuts)</p>
          <p>📏 Measuring tape</p>
          <p>✏️ Pencil for marking</p>
          <p>📊 Level (checking fit)</p>
        </div>
        
        <div class="result-installation">
          <h4>Installation Tips:</h4>
          <p>🔗 Attach top with joist hangers or ledger</p>
          <p>⚓ Secure bottom to concrete pad or footing</p>
          <p>📏 Check for level and plumb</p>
          <p>🔧 Install treads with 2.5" deck screws</p>
          <p>🛡️ Apply weather protection for outdoor stairs</p>
        </div>
        
        ${!riserCompliant || !treadCompliant || !adequateDepth ? `
        <div class="result-warnings">
          <h4>⚠️ Issues Detected:</h4>
          ${!riserCompliant ? `<p>Riser height ${actualRiserHeight.toFixed(2)}" outside 4"-7.75" code range</p>` : ''}
          ${!treadCompliant ? `<p>Tread depth ${treadDepth.toFixed(2)}" below 10" minimum</p>` : ''}
          ${!adequateDepth ? `<p>Only ${remainingDepth.toFixed(1)}" lumber remaining (need 5" minimum)</p>` : ''}
          <p>Consider adjusting total rise/run or using larger lumber</p>
        </div>
        ` : ''}
        
        <div class="result-tips">
          <h4>Professional Tips:</h4>
          <p>🎯 Cut one stringer first and test-fit before cutting others</p>
          <p>📝 Always round measurements to nearest 1/16"</p>
          <p>🔍 Double-check calculations before cutting expensive lumber</p>
          <p>🏗️ Consider hiring professionals for complex or structural stairs</p>
        </div>
      `;
    });
  }
});