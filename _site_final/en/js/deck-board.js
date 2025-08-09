document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('deck-form');
  const result = document.getElementById('deck-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('deck-length').value);
      const width = parseFloat(document.getElementById('deck-width').value);
      const boardWidth = parseFloat(document.getElementById('deck-board-size').value);
      const boardLength = parseFloat(document.getElementById('deck-board-length').value);
      const joistSpacing = parseFloat(document.getElementById('deck-joist-spacing').value);
      const joistSize = parseFloat(document.getElementById('deck-joist-size').value);
      const materialCost = parseFloat(document.getElementById('deck-material-type').value);
      const includeRailings = document.getElementById('include-railings').checked;
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Please enter valid deck dimensions.";
        return;
      }
      
      // Calculate deck area
      const deckArea = length * width;
      
      // Calculate deck boards needed
      const boardsAcrossWidth = Math.ceil((width * 12) / boardWidth); // Convert to inches
      const boardsAlongLength = Math.ceil(length / boardLength);
      let totalBoards = boardsAcrossWidth * boardsAlongLength;
      
      // Add 10% waste factor
      const wasteBoards = Math.ceil(totalBoards * 0.1);
      const totalBoardsWithWaste = totalBoards + wasteBoards;
      
      // Calculate joists needed
      const joistCount = Math.floor((length * 12) / joistSpacing) + 1; // Convert length to inches
      const rimJoists = 2; // Two rim joists (front and back)
      const totalJoists = joistCount + rimJoists;
      
      // Calculate joist length needed (typically deck width + overhang)
      const joistLength = width + 2; // Add 2 feet for overhang/support
      
      // Calculate beams needed (assume one beam under middle)
      const beamLength = length;
      const beamPieces = Math.ceil(beamLength / 12); // 12-foot beam pieces
      
      // Calculate posts (assume every 8 feet)
      const postsNeeded = Math.ceil(length / 8) + 1;
      
      // Calculate hardware
      const joistHangers = joistCount * 2; // Both ends of each joist
      const deckScrews = Math.ceil(totalBoardsWithWaste * 32); // ~32 screws per board
      const lagBolts = postsNeeded * 2; // 2 bolts per post
      
      // Calculate costs
      const deckingCost = deckArea * materialCost;
      const joistsLumberCost = totalJoists * (joistLength * 2.5); // Updated lumber pricing
      const beamCost = beamPieces * 45; // Beam materials
      const postCost = postsNeeded * 35; // Post materials
      const hardwareCost = (joistHangers * 2.5) + (deckScrews * 0.12) + (lagBolts * 6);
      const footingCost = postsNeeded * 25; // Concrete footings
      
      // Railing cost calculation
      const railingPerimeter = (2 * (length + width)) - 8; // Assume 8ft opening for stairs
      const railingCost = includeRailings ? railingPerimeter * 20 : 0; // $20/linear foot
      
      const totalMaterialCost = deckingCost + joistsLumberCost + beamCost + postCost + hardwareCost + footingCost + railingCost;
      
      // Calculate board feet
      const deckingBoardFeet = (totalBoardsWithWaste * boardLength * boardWidth * 1.25) / 12;
      const joistBoardFeet = (totalJoists * joistLength * joistSize * 2) / 12;
      
      // Get material type name
      const materialTypes = {
        3: "Pressure-Treated Lumber",
        6: "Cedar Lumber", 
        10: "Composite Decking",
        12: "Premium Composite",
        15: "Capped Composite",
        18: "PVC Decking"
      };
      const materialTypeName = materialTypes[materialCost];
      
      // Calculate cost per square foot
      const costPerSqFt = totalMaterialCost / deckArea;
      
      // Labor estimate
      const laborCost = deckArea * 8; // $8/sq ft average labor
      const totalProjectCost = totalMaterialCost + laborCost;

      result.innerHTML = `
        <div class="cost-summary">
          <h3>💰 Deck Cost Calculator Results</h3>
          <div class="cost-highlight">
            <h4>${length}' × ${width}' Deck (${deckArea} sq ft)</h4>
            <p><strong>Material Cost: $${totalMaterialCost.toFixed(0)}</strong> (${materialTypeName})</p>
            <p><strong>Cost per sq ft: $${costPerSqFt.toFixed(2)}</strong></p>
            <p>Estimated labor: $${laborCost.toFixed(0)} | <strong>Total project: $${totalProjectCost.toFixed(0)}</strong></p>
          </div>
        </div>
        
        <div class="result-section">
          <h4>📏 How Many Decking Boards You Need:</h4>
          <div class="board-calculation">
            <p><strong>${totalBoardsWithWaste} deck boards</strong> (${boardLength}' long × ${boardWidth}\" wide)</p>
            <p>Base requirement: ${totalBoards} boards</p>
            <p>Waste allowance: ${wasteBoards} extra boards (10%)</p>
            <p>Total board feet: ${deckingBoardFeet.toFixed(0)} bd ft</p>
          </div>
        </div>
        
        <div class="result-framing">
          <h4>🔨 Deck Framing Materials:</h4>
          <p><strong>${totalJoists} joists</strong> (2×${joistSize} × ${joistLength.toFixed(1)}')</p>
          <p>- ${joistCount} field joists at ${joistSpacing}" spacing</p>
          <p>- ${rimJoists} rim joists (perimeter)</p>
          <p><strong>${beamPieces} beam sections</strong> (double 2×${joistSize})</p>
          <p><strong>${postsNeeded} posts</strong> (4×4 pressure-treated)</p>
          <p><strong>${postsNeeded} concrete footings</strong> (below frost line)</p>
          <p>Framing lumber: ${joistBoardFeet.toFixed(0)} bd ft</p>
        </div>
        
        <div class="result-hardware">
          <h4>🔩 Hardware & Fasteners Needed:</h4>
          <p><strong>${deckScrews} deck screws</strong> (2.5" stainless steel or coated)</p>
          <p><strong>${joistHangers} joist hangers</strong> (galvanized steel)</p>
          <p><strong>${lagBolts} lag bolts</strong> (1/2" × 6" galvanized)</p>
          <p>Joist hanger nails: 5 lbs</p>
          <p>Construction adhesive: 4-6 tubes</p>
          ${includeRailings ? `<p><strong>Railing materials:</strong> ${railingPerimeter} linear feet</p>` : ''}
        </div>
        
        <div class="result-costs">
          <h4>💵 Detailed Cost Breakdown:</h4>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td>Decking materials (${materialTypeName})</td><td style="text-align:right"><strong>$${deckingCost.toFixed(0)}</strong></td></tr>
            <tr><td>Framing lumber (joists)</td><td style="text-align:right">$${joistsLumberCost.toFixed(0)}</td></tr>
            <tr><td>Beams and posts</td><td style="text-align:right">$${(beamCost + postCost).toFixed(0)}</td></tr>
            <tr><td>Hardware & fasteners</td><td style="text-align:right">$${hardwareCost.toFixed(0)}</td></tr>
            <tr><td>Concrete footings</td><td style="text-align:right">$${footingCost.toFixed(0)}</td></tr>
            ${includeRailings ? `<tr><td>Railing materials</td><td style="text-align:right">$${railingCost.toFixed(0)}</td></tr>` : ''}
            <tr style="border-top: 2px solid #333; font-weight: bold;"><td>Total Materials</td><td style="text-align:right">$${totalMaterialCost.toFixed(0)}</td></tr>
          </table>
          <p><em>Prices vary by location and supplier. Add permits ($100-500) and tools if needed.</em></p>
        </div>
        
        <div class="material-comparison">
          <h4>🔄 Material Cost Comparison (${deckArea} sq ft deck):</h4>
          <p>Pressure-treated: $${(deckArea * 3 + joistsLumberCost + beamCost + postCost + hardwareCost + footingCost).toFixed(0)} (lowest cost)</p>
          <p>Cedar: $${(deckArea * 6 + joistsLumberCost + beamCost + postCost + hardwareCost + footingCost).toFixed(0)} (natural beauty)</p>
          <p>Composite: $${(deckArea * 12 + joistsLumberCost + beamCost + postCost + hardwareCost + footingCost).toFixed(0)} (low maintenance)</p>
          <p>Premium composite: $${(deckArea * 15 + joistsLumberCost + beamCost + postCost + hardwareCost + footingCost).toFixed(0)} (best quality)</p>
        </div>
        
        <div class="result-tips">
          <h4>💡 Professional Tips:</h4>
          <p>📐 <strong>Composite decking:</strong> Requires 16" max joist spacing (12" preferred)</p>
          <p>🏠 <strong>Permit required:</strong> Most areas require permits for decks over 30" high</p>
          <p>📦 <strong>Delivery:</strong> Order all decking from same production lot for color consistency</p>
          <p>⏰ <strong>Installation time:</strong> ${Math.ceil(deckArea / 100)} week(s) for DIY, 2-3 days for professionals</p>
          <p>🔧 <strong>Tools needed:</strong> Circular saw, drill, level, chalk line, measuring tape</p>
          <p>🛡️ <strong>Maintenance:</strong> ${getMaintenance(materialCost)}</p>
        </div>
        
        <div class="next-steps">
          <h4>🎯 Next Steps for Your Deck Project:</h4>
          <ol>
            <li>Check local building codes and obtain permits</li>
            <li>Get quotes from local lumber yards and suppliers</li>
            <li>Consider hiring professionals for foundation work</li>
            <li>Plan for utilities (electrical, plumbing) before building</li>
            <li>Schedule delivery 2-3 days before starting construction</li>
          </ol>
        </div>
      `;
      
      function getMaintenance(cost) {
        if (cost <= 6) return "Annual staining/sealing required";
        return "Minimal maintenance - just cleaning";
      }
    });
  }
});