document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('roof-pitch-form');
  const result = document.getElementById('roof-pitch-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const rise = parseFloat(document.getElementById('roof-rise').value);
      const run = parseFloat(document.getElementById('roof-run').value);
      const length = parseFloat(document.getElementById('roof-length').value);
      const width = parseFloat(document.getElementById('roof-width').value);
      const roofStyle = document.getElementById('roof-style').value;
      const [materialType, costPerSquare] = document.getElementById('roof-material').value.split(',');
      
      if (rise < 0 || run <= 0 || length <= 0 || width <= 0) {
        result.textContent = "Please enter valid measurements.";
        return;
      }
      
      // Calculate pitch ratio (always express per 12 inches)
      const pitchRatio = (rise / run) * 12;
      const pitchExpression = `${pitchRatio.toFixed(1)}/12`;
      
      // Calculate angle in degrees
      const angleRadians = Math.atan(rise / run);
      const angleDegrees = angleRadians * (180 / Math.PI);
      
      // Calculate roof factor (multiplier for true roof area)
      const roofFactor = Math.sqrt(1 + Math.pow(rise / run, 2));
      
      // Calculate floor area
      const floorArea = length * width;
      
      // Calculate roof area based on style
      let roofArea;
      switch(roofStyle) {
        case 'gable':
          roofArea = floorArea * roofFactor;
          break;
        case 'hip':
          roofArea = floorArea * roofFactor * 1.1; // 10% more for hip
          break;
        case 'shed':
          roofArea = floorArea * roofFactor;
          break;
        case 'gambrel':
          roofArea = floorArea * roofFactor * 1.15; // 15% more for gambrel
          break;
        default:
          roofArea = floorArea * roofFactor;
      }
      
      // Calculate roofing squares (100 sq ft = 1 square)
      const roofingSquares = roofArea / 100;
      
      // Determine slope classification
      let slopeClass, suitability;
      if (pitchRatio < 2) {
        slopeClass = "Flat roof";
        suitability = "Membrane or metal only";
      } else if (pitchRatio < 4) {
        slopeClass = "Low slope";
        suitability = "Metal roofing or special shingle installation";
      } else if (pitchRatio < 9) {
        slopeClass = "Conventional slope";
        suitability = "All roofing materials suitable";
      } else if (pitchRatio < 21) {
        slopeClass = "Steep slope";
        suitability = "All materials, may need snow guards";
      } else {
        slopeClass = "Very steep";
        suitability = "Specialized installation required";
      }
      
      // Safety assessment
      let safetyLevel;
      if (pitchRatio <= 6) {
        safetyLevel = "Walkable with proper footwear";
      } else if (pitchRatio <= 9) {
        safetyLevel = "Requires safety equipment";
      } else {
        safetyLevel = "Professional installation recommended";
      }
      
      // Calculate rafter length (for gable roof)
      const rafterLength = Math.sqrt(Math.pow(width / 2, 2) + Math.pow((width / 2) * (rise / run), 2));
      
      // Calculate materials
      const materialCost = roofingSquares * parseFloat(costPerSquare);
      const underlaymentCost = roofingSquares * 50; // $50 per square
      const flashingCost = (length + width) * 2 * 8; // $8 per linear foot
      const ventsCost = Math.ceil(roofArea / 300) * 150; // Ridge vent every 300 sq ft
      const totalMaterialCost = materialCost + underlaymentCost + flashingCost + ventsCost;
      
      // Labor estimate
      const laborHours = roofingSquares * 8 * (pitchRatio > 8 ? 1.5 : 1.0); // 8 hours per square, +50% for steep
      const laborCost = laborHours * 75; // $75/hour
      
      // Waste factor based on roof complexity
      let wasteFactor;
      switch(roofStyle) {
        case 'gable':
          wasteFactor = 0.10;
          break;
        case 'hip':
          wasteFactor = 0.15;
          break;
        case 'shed':
          wasteFactor = 0.05;
          break;
        case 'gambrel':
          wasteFactor = 0.20;
          break;
        default:
          wasteFactor = 0.10;
      }
      
      const materialsWithWaste = roofingSquares * (1 + wasteFactor);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Roof Pitch Calculations:</h4>
          <p><strong>Pitch ratio: ${pitchExpression}</strong></p>
          <p><strong>Angle: ${angleDegrees.toFixed(1)}°</strong></p>
          <p>Slope classification: ${slopeClass}</p>
          <p>Roof factor: ${roofFactor.toFixed(3)}</p>
        </div>
        
        <div class="result-measurements">
          <h4>Roof Measurements:</h4>
          <p>Building: ${length}' × ${width}' (${floorArea} sq ft floor)</p>
          <p>Roof style: ${roofStyle.charAt(0).toUpperCase() + roofStyle.slice(1)}</p>
          <p><strong>Roof area: ${roofArea.toFixed(0)} sq ft</strong></p>
          <p><strong>Roofing squares: ${roofingSquares.toFixed(1)}</strong></p>
          <p>Rafter length: ${rafterLength.toFixed(1)}' (gable roof)</p>
        </div>
        
        <div class="result-suitability">
          <h4>Material Suitability:</h4>
          <p><strong>${suitability}</strong></p>
          <p>Safety level: ${safetyLevel}</p>
          ${pitchRatio < 4 && materialType === 'asphalt' ? 
            '<p>⚠️ Special installation techniques required for asphalt shingles</p>' : ''}
          ${pitchRatio > 9 ? 
            '<p>💡 Consider snow guards in snow-prone areas</p>' : ''}
        </div>
        
        <div class="result-materials">
          <h4>Material Estimates:</h4>
          <p>Base requirement: ${roofingSquares.toFixed(1)} squares</p>
          <p>With ${(wasteFactor * 100)}% waste: ${materialsWithWaste.toFixed(1)} squares</p>
          <p>${materialType.charAt(0).toUpperCase() + materialType.slice(1)}: $${materialCost.toFixed(0)}</p>
          <p>Underlayment: $${underlaymentCost.toFixed(0)}</p>
          <p>Flashing: $${flashingCost.toFixed(0)}</p>
          <p>Ventilation: $${ventsCost.toFixed(0)}</p>
          <p><strong>Total materials: $${totalMaterialCost.toFixed(0)}</strong></p>
        </div>
        
        <div class="result-installation">
          <h4>Installation Details:</h4>
          <p>Labor hours: ${laborHours.toFixed(1)} hours</p>
          <p>Professional labor: $${laborCost.toFixed(0)}</p>
          <p><strong>Total project: $${(totalMaterialCost + laborCost).toFixed(0)}</strong></p>
          <p>Installation time: ${Math.ceil(laborHours / 16)} days (2-person crew)</p>
        </div>
        
        <div class="result-drainage">
          <h4>Drainage Performance:</h4>
          ${pitchRatio >= 4 ? 
            '<p>✅ Excellent water shedding</p>' : 
            '<p>⚠️ May require additional drainage considerations</p>'}
          ${pitchRatio >= 6 ? 
            '<p>✅ Good snow shedding capability</p>' : 
            '<p>💡 Snow retention may be an issue</p>'}
          <p>Gutters recommended: ${pitchRatio >= 3 ? 'Yes' : 'Essential'}</p>
        </div>
        
        <div class="result-comparison">
          <h4>Common Pitch Comparisons:</h4>
          <p>4/12 (18.5°): Standard minimum for shingles</p>
          <p>6/12 (26.5°): Most common residential pitch</p>
          <p>8/12 (33.7°): Traditional steep residential</p>
          <p>12/12 (45°): Very steep, A-frame style</p>
          <p><strong>Your pitch: ${pitchExpression} (${angleDegrees.toFixed(1)}°)</strong></p>
        </div>
        
        <div class="result-climate">
          <h4>Climate Recommendations:</h4>
          ${pitchRatio >= 6 ? 
            '<p>✅ Suitable for heavy snow areas</p>' : 
            '<p>⚠️ Consider steeper pitch for heavy snow</p>'}
          ${pitchRatio >= 4 && pitchRatio <= 8 ? 
            '<p>✅ Good for high wind areas</p>' : 
            '<p>💡 Moderate pitches perform best in high winds</p>'}
          ${pitchRatio >= 4 ? 
            '<p>✅ Adequate for heavy rain areas</p>' : 
            '<p>⚠️ May need special waterproofing</p>'}
        </div>
        
        <div class="result-tips">
          <h4>Professional Recommendations:</h4>
          <p>🏠 Consider attic space vs. pitch trade-offs</p>
          <p>💰 Steeper roofs cost more but may last longer</p>
          <p>🌡️ Account for local climate in pitch selection</p>
          <p>📋 Check local building codes for minimum requirements</p>
          <p>🔧 Professional installation recommended for slopes over 9/12</p>
        </div>
      `;
    });
  }
});