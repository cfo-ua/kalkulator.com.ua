document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('drywall-form');
  const result = document.getElementById('drywall-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const wallArea = parseFloat(document.getElementById('drywall-walls').value);
      const ceilingArea = parseFloat(document.getElementById('drywall-ceiling').value);
      const doors = parseFloat(document.getElementById('drywall-doors').value);
      const windows = parseFloat(document.getElementById('drywall-windows').value);
      const [thickness, pricePerSheet] = document.getElementById('drywall-thickness').value.split(',').map(Number);
      const [sheetArea, sheetHeight] = document.getElementById('drywall-size').value.split(',').map(Number);
      const wasteFactor = parseFloat(document.getElementById('drywall-waste').value);
      
      if (wallArea <= 0 && ceilingArea <= 0) {
        result.textContent = "Please enter wall area and/or ceiling area.";
        return;
      }
      
      // Calculate net area
      const doorArea = doors * 21; // Standard door = 21 sq ft
      const windowArea = windows * 15; // Standard window = 15 sq ft
      const netWallArea = Math.max(0, wallArea - doorArea - windowArea);
      const totalArea = netWallArea + ceilingArea;
      
      // Calculate sheets needed
      const baseSheets = totalArea / sheetArea;
      const sheetsWithWaste = baseSheets * (1 + wasteFactor);
      const totalSheets = Math.ceil(sheetsWithWaste);
      
      // Calculate joint compound (3 gallons per 1000 sq ft)
      const compoundGallons = (totalArea / 1000) * 3;
      const compoundBuckets = Math.ceil(compoundGallons / 5); // 5-gallon buckets
      
      // Calculate tape needed (linear feet of seams)
      // Estimate: 1.2 linear feet of seam per square foot of drywall
      const tapeLinearFeet = totalArea * 1.2;
      const tapeRolls = Math.ceil(tapeLinearFeet / 500); // 500 ft rolls
      
      // Calculate screws needed
      const wallScrews = netWallArea * 0.005; // 5 lbs per 1000 sq ft
      const ceilingScrews = ceilingArea * 0.007; // 7 lbs per 1000 sq ft
      const totalScrews = wallScrews + ceilingScrews;
      const screwBoxes = Math.ceil(totalScrews); // 1 lb boxes
      
      // Calculate corner bead (inside and outside corners)
      // Estimate based on room size
      const roomPerimeter = Math.sqrt(totalArea) * 4; // Rough estimate
      const cornerBeadFeet = roomPerimeter * 0.5; // 50% of perimeter
      const cornerBeadPieces = Math.ceil(cornerBeadFeet / 8); // 8 ft pieces
      
      // Calculate costs
      const sheetCost = totalSheets * pricePerSheet;
      const compoundCost = compoundBuckets * 20; // $20 per 5-gallon bucket
      const tapeCost = tapeRolls * 10; // $10 per roll
      const screwCost = screwBoxes * 8; // $8 per lb box
      const cornerBeadCost = cornerBeadPieces * 3; // $3 per 8ft piece
      const totalMaterialCost = sheetCost + compoundCost + tapeCost + screwCost + cornerBeadCost;
      
      // Labor estimates
      const hangingHours = totalArea / 100; // ~100 sq ft per hour hanging
      const finishingHours = totalArea / 50; // ~50 sq ft per hour finishing
      const totalLaborHours = hangingHours + finishingHours;
      const laborCost = totalLaborHours * 65; // $65/hour average
      
      // Coverage rates for different sheet sizes
      const sheetsFor4x8 = Math.ceil(totalArea / 32);
      const sheetsFor4x12 = Math.ceil(totalArea / 48);
      const savings4x12vs4x8 = (sheetsFor4x8 - sheetsFor4x12) * pricePerSheet;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Area Calculations:</h4>
          <p>Wall area: ${wallArea} sq ft</p>
          <p>Ceiling area: ${ceilingArea} sq ft</p>
          <p>Less doors: ${doorArea} sq ft (${doors} doors)</p>
          <p>Less windows: ${windowArea} sq ft (${windows} windows)</p>
          <p><strong>Net area to cover: ${totalArea} sq ft</strong></p>
        </div>
        
        <div class="result-sheets">
          <h4>Drywall Sheets:</h4>
          <p><strong>${totalSheets} sheets</strong> (${sheetArea} sq ft each)</p>
          <p>Base requirement: ${baseSheets.toFixed(1)} sheets</p>
          <p>Waste factor: ${(wasteFactor * 100)}% (${(sheetsWithWaste - baseSheets).toFixed(1)} extra)</p>
          <p>Sheet size: 4×${sheetHeight} (${thickness}\" thick)</p>
          <p>Coverage: ${(totalSheets * sheetArea).toFixed(0)} sq ft total</p>
        </div>
        
        <div class="result-compound">
          <h4>Joint Compound & Tape:</h4>
          <p><strong>${compoundBuckets} buckets</strong> joint compound (5-gallon)</p>
          <p>Total compound: ${compoundGallons.toFixed(1)} gallons needed</p>
          <p><strong>${tapeRolls} rolls</strong> drywall tape (500 ft rolls)</p>
          <p>Linear feet of tape: ${tapeLinearFeet.toFixed(0)} ft</p>
        </div>
        
        <div class="result-hardware">
          <h4>Fasteners & Accessories:</h4>
          <p><strong>${screwBoxes} boxes</strong> drywall screws (1 lb boxes)</p>
          <p>Screw length: ${thickness === 0.5 ? '1-1/4"' : thickness === 0.625 ? '1-5/8"' : '1-1/8"'}</p>
          <p><strong>${cornerBeadPieces} pieces</strong> corner bead (8 ft lengths)</p>
          <p>Corner bead total: ${cornerBeadFeet.toFixed(0)} linear feet</p>
        </div>
        
        <div class="result-costs">
          <h4>Material Costs:</h4>
          <p>Drywall sheets: $${sheetCost.toFixed(0)} (${totalSheets} @ $${pricePerSheet})</p>
          <p>Joint compound: $${compoundCost.toFixed(0)} (${compoundBuckets} buckets)</p>
          <p>Tape: $${tapeCost.toFixed(0)} (${tapeRolls} rolls)</p>
          <p>Screws: $${screwCost.toFixed(0)} (${screwBoxes} boxes)</p>
          <p>Corner bead: $${cornerBeadCost.toFixed(0)} (${cornerBeadPieces} pieces)</p>
          <p><strong>Total materials: $${totalMaterialCost.toFixed(0)}</strong></p>
        </div>
        
        <div class="result-labor">
          <h4>Labor Estimates:</h4>
          <p>Hanging time: ${hangingHours.toFixed(1)} hours</p>
          <p>Finishing time: ${finishingHours.toFixed(1)} hours</p>
          <p>Total labor: ${totalLaborHours.toFixed(1)} hours</p>
          <p>Professional labor: $${laborCost.toFixed(0)}</p>
          <p><strong>Total project: $${(totalMaterialCost + laborCost).toFixed(0)}</strong></p>
        </div>
        
        <div class="result-comparison">
          <h4>Sheet Size Comparison:</h4>
          <p>4×8 sheets needed: ${sheetsFor4x8}</p>
          <p>4×12 sheets needed: ${sheetsFor4x12}</p>
          <p>4×12 advantage: ${sheetsFor4x8 - sheetsFor4x12} fewer sheets</p>
          ${savings4x12vs4x8 > 0 ? `<p>💰 Savings with 4×12: $${savings4x12vs4x8.toFixed(0)}</p>` : ''}
        </div>
        
        <div class="result-timeline">
          <h4>Installation Timeline:</h4>
          <p><strong>Day 1:</strong> Hang all drywall sheets</p>
          <p><strong>Day 2:</strong> Tape all seams (first coat)</p>
          <p><strong>Day 3:</strong> Second coat of compound</p>
          <p><strong>Day 4:</strong> Final coat and touch-ups</p>
          <p><strong>Day 5:</strong> Sand smooth and prime</p>
          <p><em>Allow 24 hours drying between coats</em></p>
        </div>
        
        <div class="result-tools">
          <h4>Tools Needed:</h4>
          <p>🔧 Drywall screw gun or drill</p>
          <p>📐 T-square and utility knife</p>
          <p>🪚 Drywall saw or router</p>
          <p>🔨 Hammer and pry bar</p>
          <p>📏 Measuring tape and pencil</p>
          <p>🎨 Mud pan and knives (6\", 10\", 12\")</p>
        </div>
        
        <div class="result-tips">
          <h4>Installation Tips:</h4>
          <p>📋 Plan sheet layout to minimize waste</p>
          <p>🏠 Install ceilings first, then walls</p>
          <p>🔧 Use proper screw spacing and depth</p>
          <p>💧 Keep compound covered between coats</p>
          <p>🌡️ Maintain 55-70°F for proper drying</p>
        </div>
      `;
    });
  }
});