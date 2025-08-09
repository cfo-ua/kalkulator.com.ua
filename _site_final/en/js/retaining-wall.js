document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('retaining-wall-form');
  const result = document.getElementById('retaining-wall-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('wall-length').value);
      const height = parseFloat(document.getElementById('wall-height').value);
      const [blockType, blockWidth, blockHeight, blocksPerSqFt, blockCost] = document.getElementById('wall-block-type').value.split(',');
      const config = document.getElementById('wall-config').value;
      const conditionsMultiplier = parseFloat(document.getElementById('wall-conditions').value);
      
      if (length <= 0 || height <= 0) {
        result.textContent = "Please enter valid dimensions.";
        return;
      }
      
      // Calculate wall face area
      let wallArea = length * height;
      
      // Adjust for configuration
      if (config === 'corner') {
        wallArea *= 1.1; // 10% more for corner blocks
      } else if (config === 'terraced') {
        wallArea *= 1.2; // 20% more for multiple levels
      }
      
      // Calculate blocks needed
      const totalBlocks = Math.ceil(wallArea * parseFloat(blocksPerSqFt) * conditionsMultiplier);
      
      // Calculate cap blocks (top course)
      const capBlocks = Math.ceil(length * conditionsMultiplier);
      
      // Calculate foundation requirements
      const excavationDepth = 0.5 + (height / 12); // 6" + 1" per foot of height
      const excavationWidth = 2 + (parseFloat(blockWidth) / 12); // Block width + 12" (6" each side)
      const excavationVolume = length * excavationWidth * excavationDepth;
      const excavationCubicYards = excavationVolume / 27;
      
      // Calculate base gravel
      const baseGravelDepth = 0.5; // 6 inches
      const baseGravelVolume = length * excavationWidth * baseGravelDepth;
      const baseGravelCubicYards = baseGravelVolume / 27;
      
      // Calculate backfill gravel (12" behind wall)
      const backfillWidth = 1; // 12 inches behind wall
      const backfillVolume = length * backfillWidth * height;
      const backfillCubicYards = backfillVolume / 27;
      
      // Calculate drainage pipe
      const drainagePipe = length; // Linear feet of 4" perforated pipe
      
      // Calculate landscape fabric
      const fabricArea = length * (backfillWidth + 2); // Behind wall plus overlap
      
      // Calculate costs
      const blockCosts = totalBlocks * parseFloat(blockCost);
      const capCosts = capBlocks * (parseFloat(blockCost) * 0.8); // Cap blocks 80% of regular cost
      const baseGravelCost = baseGravelCubicYards * 35; // $35 per cubic yard
      const backfillCost = backfillCubicYards * 40; // $40 per cubic yard (drainage gravel)
      const pipeCost = drainagePipe * 8; // $8 per linear foot
      const fabricCost = fabricArea * 1.5; // $1.50 per sq ft
      const excavationCost = excavationCubicYards * 25; // $25 per cubic yard for excavation
      
      const totalMaterialCost = blockCosts + capCosts + baseGravelCost + backfillCost + pipeCost + fabricCost;
      const totalProjectCost = totalMaterialCost + excavationCost;
      
      // Labor estimates
      const laborHours = wallArea * 0.5 * conditionsMultiplier; // 0.5 hours per sq ft
      const laborCost = laborHours * 75; // $75 per hour
      
      // Engineering requirements
      const needsEngineering = height > 3;
      const engineeringCost = needsEngineering ? 1500 : 0;
      
      // Calculate setback requirement
      const setback = height * 0.7; // 70% of height
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Retaining Wall Specifications:</h4>
          <p>Length: ${length} feet</p>
          <p>Height: ${height} feet</p>
          <p>Wall area: ${wallArea.toFixed(1)} sq ft</p>
          <p>Block type: ${blockType} (${blockWidth}"×${blockHeight}")</p>
          <p>Configuration: ${config.charAt(0).toUpperCase() + config.slice(1)}</p>
        </div>
        
        <div class="result-blocks">
          <h4>Block Requirements:</h4>
          <p><strong>${totalBlocks} wall blocks</strong></p>
          <p><strong>${capBlocks} cap blocks</strong></p>
          <p>Blocks per sq ft: ${blocksPerSqFt}</p>
          <p>Block cost: $${blockCosts.toFixed(0)}</p>
          <p>Cap block cost: $${capCosts.toFixed(0)}</p>
        </div>
        
        <div class="result-foundation">
          <h4>Foundation & Excavation:</h4>
          <p>Excavation depth: ${(excavationDepth * 12).toFixed(1)}"</p>
          <p>Excavation width: ${(excavationWidth * 12).toFixed(1)}"</p>
          <p>Excavation volume: ${excavationCubicYards.toFixed(2)} cubic yards</p>
          <p>Base gravel: ${baseGravelCubicYards.toFixed(2)} cubic yards</p>
          <p>Excavation cost: $${excavationCost.toFixed(0)}</p>
          <p>Base gravel cost: $${baseGravelCost.toFixed(0)}</p>
        </div>
        
        <div class="result-drainage">
          <h4>Drainage System:</h4>
          <p>Backfill gravel: ${backfillCubicYards.toFixed(2)} cubic yards</p>
          <p>Drainage pipe: ${drainagePipe} linear feet (4" perforated)</p>
          <p>Landscape fabric: ${fabricArea.toFixed(1)} sq ft</p>
          <p>Backfill cost: $${backfillCost.toFixed(0)}</p>
          <p>Pipe cost: $${pipeCost.toFixed(0)}</p>
          <p>Fabric cost: $${fabricCost.toFixed(0)}</p>
        </div>
        
        <div class="result-costs">
          <h4>Total Project Cost:</h4>
          <p>Materials: $${totalMaterialCost.toFixed(0)}</p>
          <p>Excavation: $${excavationCost.toFixed(0)}</p>
          ${needsEngineering ? `<p>Engineering: $${engineeringCost.toFixed(0)}</p>` : ''}
          <p>Professional labor: $${laborCost.toFixed(0)}</p>
          <p><strong>Total DIY cost: $${totalProjectCost.toFixed(0)}</strong></p>
          <p><strong>Total with labor: $${(totalProjectCost + laborCost + engineeringCost).toFixed(0)}</strong></p>
          <p>Cost per sq ft: $${((totalProjectCost + laborCost) / wallArea).toFixed(2)}</p>
        </div>
        
        <div class="result-requirements">
          <h4>Code & Engineering:</h4>
          ${needsEngineering ? 
            '<p>⚠️ Engineering required for walls over 3 feet</p>' : 
            '<p>✅ No engineering required (under 3 feet)</p>'}
          <p>Required setback: ${setback.toFixed(1)} feet from property line</p>
          <p>Permit required: ${height > 3 ? 'Yes' : 'Likely not required'}</p>
          <p>Footing below frost line: ${height > 4 ? 'Required' : 'Recommended'}</p>
        </div>
        
        <div class="result-timeline">
          <h4>Construction Timeline:</h4>
          <p><strong>Day 1:</strong> Excavation and base preparation</p>
          <p><strong>Day 2:</strong> Base gravel and compaction</p>
          <p><strong>Day 3-4:</strong> Block installation</p>
          <p><strong>Day 5:</strong> Drainage and backfill</p>
          <p><strong>Day 6:</strong> Cap blocks and finishing</p>
          <p>Total labor: ${laborHours.toFixed(1)} hours</p>
        </div>
        
        <div class="result-tools">
          <h4>Tools & Equipment Needed:</h4>
          <p>🚜 Mini excavator or hand digging</p>
          <p>🎢 Plate compactor (rent $75/day)</p>
          <p>📐 4-foot level and string line</p>
          <p>🔨 Dead blow hammer</p>
          <p>🪚 Masonry saw for cuts</p>
          <p>📏 Measuring tape and chalk line</p>
        </div>
        
        <div class="result-installation">
          <h4>Installation Steps:</h4>
          <p>1. Mark utilities and property lines</p>
          <p>2. Excavate to proper depth and width</p>
          <p>3. Install and compact base gravel</p>
          <p>4. Lay first course level and straight</p>
          <p>5. Install drainage pipe and fabric</p>
          <p>6. Build wall course by course</p>
          <p>7. Backfill with drainage gravel</p>
          <p>8. Install cap blocks and finish grade</p>
        </div>
        
        <div class="result-maintenance">
          <h4>Long-term Maintenance:</h4>
          <p>🔍 Annual inspection for settling or movement</p>
          <p>💧 Check drainage outlets for clogs</p>
          <p>🌱 Control vegetation on wall face</p>
          <p>❄️ Monitor for frost damage in cold climates</p>
          <p>🔧 Address any shifting blocks immediately</p>
        </div>
        
        <div class="result-tips">
          <h4>Professional Tips:</h4>
          <p>📞 Call 811 for utility marking before digging</p>
          <p>📋 Check local codes and permit requirements</p>
          <p>🏗️ Consider hiring professionals for walls over 3 feet</p>
          <p>💧 Ensure proper drainage behind wall</p>
          <p>📐 Use string lines for straight, level installation</p>
        </div>
      `;
    });
  }
});