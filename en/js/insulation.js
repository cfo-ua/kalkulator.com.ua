document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('insulation-form');
  const result = document.getElementById('insulation-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('insulation-length').value);
      const width = parseFloat(document.getElementById('insulation-width').value);
      const application = document.getElementById('insulation-application').value;
      const [atticR, wallR, floorR] = document.getElementById('insulation-climate').value.split(',');
      const existingR = parseFloat(document.getElementById('insulation-existing').value);
      const [rPerInch, costPerSqFt] = document.getElementById('insulation-type').value.split(',').map(Number);
      const cavityDepth = parseFloat(document.getElementById('insulation-depth').value);
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Please enter valid dimensions.";
        return;
      }
      
      // Calculate area
      const area = length * width;
      
      // Determine target R-value based on application
      let targetR;
      switch(application) {
        case 'attic':
          targetR = parseInt(atticR.substring(1));
          break;
        case 'wall':
          targetR = parseInt(wallR.substring(1));
          break;
        case 'floor':
        case 'ceiling':
        case 'basement':
          targetR = parseInt(floorR.substring(1));
          break;
        default:
          targetR = parseInt(wallR.substring(1));
      }
      
      // Calculate needed R-value
      const neededR = Math.max(0, targetR - existingR);
      
      // Calculate thickness needed
      const thicknessNeeded = neededR / rPerInch;
      
      // Check if it fits in cavity
      const fitsInCavity = thicknessNeeded <= cavityDepth;
      const maxRInCavity = cavityDepth * rPerInch;
      
      // Calculate materials
      let materialCost = area * costPerSqFt;
      let installationArea = area;
      
      // Adjust for stud/joist spacing (typically 16" OC = ~7% area loss)
      if (application === 'wall' || application === 'ceiling') {
        installationArea = area * 0.93; // Account for framing
      }
      
      // Calculate energy savings (rough estimates)
      const currentPerformance = existingR / targetR;
      const newPerformance = (existingR + neededR) / targetR;
      const improvementFactor = (newPerformance - currentPerformance) / (1 - currentPerformance);
      
      // Estimate annual savings based on application
      let baseAnnualSavings;
      switch(application) {
        case 'attic':
          baseAnnualSavings = 500; // Attic has highest impact
          break;
        case 'wall':
          baseAnnualSavings = 300;
          break;
        case 'floor':
        case 'basement':
          baseAnnualSavings = 200;
          break;
        case 'ceiling':
          baseAnnualSavings = 250;
          break;
        default:
          baseAnnualSavings = 300;
      }
      
      const estimatedAnnualSavings = baseAnnualSavings * improvementFactor * (area / 1000);
      const paybackYears = materialCost / Math.max(estimatedAnnualSavings, 1);
      
      // Calculate bags/packages needed for blown-in
      let packagingInfo = '';
      if (rPerInch <= 3.6) { // Blown-in types
        const bagsNeeded = Math.ceil(area * thicknessNeeded / 30); // ~30 sq ft per bag at 1"
        packagingInfo = `<p>Bags needed: ${bagsNeeded} (blown-in coverage)</p>`;
      } else { // Batt or foam types
        const battsNeeded = Math.ceil(installationArea / 40); // ~40 sq ft per batt package
        packagingInfo = `<p>Packages needed: ${battsNeeded} (batt/board packages)</p>`;
      }
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Project Specifications:</h4>
          <p>Area: ${length}' × ${width}' = ${area} sq ft</p>
          <p>Application: ${application.charAt(0).toUpperCase() + application.slice(1)}</p>
          <p>Target R-value: R-${targetR}</p>
          <p>Existing R-value: R-${existingR}</p>
          <p><strong>Additional R-value needed: R-${neededR}</strong></p>
        </div>
        
        <div class="result-thickness">
          <h4>Insulation Thickness:</h4>
          <p><strong>Thickness needed: ${thicknessNeeded.toFixed(1)}"</strong></p>
          <p>Available cavity depth: ${cavityDepth}"</p>
          <p>Cavity utilization: ${fitsInCavity ? '✅ Fits perfectly' : '⚠️ Exceeds cavity depth'}</p>
          ${!fitsInCavity ? `
          <p><strong>Maximum R-value in cavity: R-${maxRInCavity.toFixed(0)}</strong></p>
          <p><em>Consider continuous insulation or thicker framing</em></p>
          ` : ''}
        </div>
        
        <div class="result-materials">
          <h4>Material Requirements:</h4>
          <p>Coverage area: ${installationArea.toFixed(0)} sq ft</p>
          ${packagingInfo}
          <p><strong>Material cost: $${materialCost.toFixed(0)}</strong></p>
          <p>Cost per sq ft: $${costPerSqFt.toFixed(2)}</p>
        </div>
        
        <div class="result-performance">
          <h4>Energy Performance:</h4>
          <p>Current insulation level: ${(currentPerformance * 100).toFixed(0)}% of target</p>
          <p>After upgrade: ${(newPerformance * 100).toFixed(0)}% of target</p>
          <p>Performance improvement: ${(improvementFactor * 100).toFixed(0)}%</p>
          <p>R-value per inch: R-${rPerInch}</p>
        </div>
        
        <div class="result-savings">
          <h4>Estimated Energy Savings:</h4>
          <p><strong>Annual savings: $${estimatedAnnualSavings.toFixed(0)}</strong></p>
          <p>Payback period: ${paybackYears.toFixed(1)} years</p>
          <p>10-year savings: $${(estimatedAnnualSavings * 10).toFixed(0)}</p>
          <p><em>Savings vary by energy costs and usage patterns</em></p>
        </div>
        
        <div class="result-installation">
          <h4>Installation Considerations:</h4>
          ${application === 'wall' ? `
          <p>🔧 Retrofit: blown-in through small holes</p>
          <p>🏗️ New construction: batts between studs</p>
          ` : ''}
          ${application === 'attic' ? `
          <p>🏠 Access: through attic hatch or eave vents</p>
          <p>🌡️ Air sealing: seal gaps before insulating</p>
          ` : ''}
          <p>🧤 Safety: wear protective equipment</p>
          <p>📏 Measure twice: verify cavity dimensions</p>
          <p>💨 Ventilation: maintain proper airflow</p>
        </div>
        
        <div class="result-alternatives">
          <h4>Alternative Solutions:</h4>
          ${!fitsInCavity ? `
          <p>🔧 Continuous insulation over sheathing</p>
          <p>🏗️ Furring strips for additional depth</p>
          <p>🌡️ Higher R-value per inch materials</p>
          ` : ''}
          <p>💰 Rebates: check utility rebate programs</p>
          <p>📋 Tax credits: federal/state incentives available</p>
        </div>
        
        <div class="result-tips">
          <h4>Professional Recommendations:</h4>
          <p>🔍 Energy audit before major upgrades</p>
          <p>💨 Air seal before adding insulation</p>
          <p>🌡️ Maintain proper vapor barriers</p>
          <p>📞 Consider professional installation for spray foam</p>
          <p>📋 Check building code requirements</p>
        </div>
        
        <div class="result-comfort">
          <h4>Additional Benefits:</h4>
          <p>🌡️ Improved temperature control</p>
          <p>🔇 Reduced noise transmission</p>
          <p>💧 Better moisture control</p>
          <p>🏠 Increased home value</p>
          <p>🌱 Reduced carbon footprint</p>
        </div>
      `;
    });
  }
});