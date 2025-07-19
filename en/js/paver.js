document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('paver-form');
  const result = document.getElementById('paver-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('paver-length').value);
      const width = parseFloat(document.getElementById('paver-width').value);
      const [paversPerSqFt, paverSize] = document.getElementById('paver-size').value.split(',');
      const wasteFactor = parseFloat(document.getElementById('paver-pattern').value);
      const costPerSqFt = parseFloat(document.getElementById('paver-type').value);
      const projectType = document.getElementById('paver-project').value;
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Please enter valid dimensions.";
        return;
      }
      
      // Calculate area
      const area = length * width;
      
      // Calculate pavers needed
      const basePavers = area * parseFloat(paversPerSqFt);
      const paversWithWaste = basePavers * (1 + wasteFactor);
      const totalPavers = Math.ceil(paversWithWaste);
      
      // Calculate excavation depth based on project type
      const excavationDepth = projectType === 'driveway' ? 12 : 8; // inches
      const baseDepth = projectType === 'driveway' ? 6 : 4; // inches
      const sandDepth = 1; // inch
      
      // Calculate base materials
      const excavationVolume = (area * excavationDepth) / 12 / 27; // cubic yards
      const baseGravel = (area * baseDepth) / 12 / 27; // cubic yards
      const beddingSand = (area * sandDepth) / 12 / 27; // cubic yards
      const jointSand = Math.ceil(area / 100) * 15; // 15 lbs per 100 sq ft
      
      // Calculate edge restraints (perimeter)
      const perimeter = (length + width) * 2;
      const edgeRestraints = Math.ceil(perimeter / 8); // 8 ft pieces
      
      // Calculate costs
      const paverCost = area * costPerSqFt;
      const gravelCost = baseGravel * 35; // $35 per cubic yard
      const sandCost = beddingSand * 45; // $45 per cubic yard
      const jointSandCost = jointSand * 0.5; // $0.50 per lb
      const edgeCost = edgeRestraints * 25; // $25 per 8ft piece
      const totalMaterialCost = paverCost + gravelCost + sandCost + jointSandCost + edgeCost;
      
      // Labor estimates
      const excavationHours = area * 0.1; // 0.1 hour per sq ft
      const installationHours = area * 0.15; // 0.15 hour per sq ft
      const totalLaborHours = excavationHours + installationHours;
      const laborCost = totalLaborHours * 65; // $65/hour
      
      // Calculate truck loads for delivery
      const gravelTrucks = Math.ceil(baseGravel / 10); // 10 yard trucks
      const sandTrucks = Math.ceil(beddingSand / 10);
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Project Specifications:</h4>
          <p>Area: ${length}' × ${width}' = ${area} sq ft</p>
          <p>Paver size: ${paverSize.replace('x', '\" × ')}"</p>
          <p>Pattern waste: ${(wasteFactor * 100)}%</p>
          <p>Project type: ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}</p>
        </div>
        
        <div class="result-pavers">
          <h4>Paver Requirements:</h4>
          <p><strong>${totalPavers} pavers needed</strong></p>
          <p>Base calculation: ${basePavers.toFixed(0)} pavers</p>
          <p>With waste factor: ${paversWithWaste.toFixed(0)} pavers</p>
          <p>Pavers per sq ft: ${paversPerSqFt}</p>
          <p>Paver cost: $${paverCost.toFixed(0)}</p>
        </div>
        
        <div class="result-excavation">
          <h4>Excavation Requirements:</h4>
          <p><strong>Excavate ${excavationDepth}" deep</strong></p>
          <p>Excavation volume: ${excavationVolume.toFixed(2)} cubic yards</p>
          <p>Disposal volume: ${excavationVolume.toFixed(2)} cubic yards</p>
          <p>Excavation time: ${excavationHours.toFixed(1)} hours</p>
        </div>
        
        <div class="result-base">
          <h4>Base Materials:</h4>
          <p><strong>${baseGravel.toFixed(2)} cubic yards</strong> crushed stone (3/4")</p>
          <p><strong>${beddingSand.toFixed(2)} cubic yards</strong> bedding sand</p>
          <p><strong>${jointSand} lbs</strong> joint sand (polymeric)</p>
          <p>Gravel cost: $${gravelCost.toFixed(0)}</p>
          <p>Sand cost: $${sandCost.toFixed(0)}</p>
          <p>Joint sand cost: $${jointSandCost.toFixed(0)}</p>
        </div>
        
        <div class="result-accessories">
          <h4>Installation Accessories:</h4>
          <p><strong>${edgeRestraints} pieces</strong> edge restraint (8 ft each)</p>
          <p>Total perimeter: ${perimeter} linear feet</p>
          <p>Edge restraint cost: $${edgeCost.toFixed(0)}</p>
          <p>Landscape fabric: ${area} sq ft recommended</p>
        </div>
        
        <div class="result-delivery">
          <h4>Delivery Requirements:</h4>
          <p>Gravel delivery: ${gravelTrucks} truck loads</p>
          <p>Sand delivery: ${sandTrucks} truck loads</p>
          <p>Paver delivery: Special arrangements for ${totalPavers} pavers</p>
          <p>Delivery timing: Base materials first, pavers last</p>
        </div>
        
        <div class="result-costs">
          <h4>Total Project Cost:</h4>
          <p>Pavers: $${paverCost.toFixed(0)}</p>
          <p>Base materials: $${(gravelCost + sandCost + jointSandCost).toFixed(0)}</p>
          <p>Edge restraints: $${edgeCost.toFixed(0)}</p>
          <p><strong>Total materials: $${totalMaterialCost.toFixed(0)}</strong></p>
          <p>Professional labor: $${laborCost.toFixed(0)}</p>
          <p><strong>Total project: $${(totalMaterialCost + laborCost).toFixed(0)}</strong></p>
          <p>Cost per sq ft: $${((totalMaterialCost + laborCost) / area).toFixed(2)}</p>
        </div>
        
        <div class="result-timeline">
          <h4>Installation Timeline:</h4>
          <p><strong>Day 1:</strong> Excavation and disposal</p>
          <p><strong>Day 2:</strong> Base gravel installation and compaction</p>
          <p><strong>Day 3:</strong> Sand leveling and edge restraints</p>
          <p><strong>Day 4-5:</strong> Paver installation</p>
          <p><strong>Day 6:</strong> Joint sand and final compaction</p>
          <p>Total labor: ${totalLaborHours.toFixed(1)} hours</p>
        </div>
        
        <div class="result-tools">
          <h4>Tools & Equipment Needed:</h4>
          <p>🚜 Mini excavator or shovels</p>
          <p>🎢 Plate compactor (rent $75/day)</p>
          <p>📐 String lines and levels</p>
          <p>🪚 Wet saw for cutting pavers</p>
          <p>🧤 Knee pads and work gloves</p>
          <p>📏 Measuring tape and chalk line</p>
        </div>
        
        <div class="result-tips">
          <h4>Installation Tips:</h4>
          <p>📞 Call 811 for utility marking</p>
          <p>🌦️ Avoid installation in wet weather</p>
          <p>📦 Order 5% extra pavers for future repairs</p>
          <p>🎯 Start installation from a straight edge</p>
          <p>💧 Proper drainage is essential</p>
          <p>⏰ Allow base to settle 24 hours</p>
        </div>
      `;
    });
  }
});