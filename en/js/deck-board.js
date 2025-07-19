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
      const joistsLumberCost = totalJoists * (joistLength * 2); // Rough estimate $2/linear ft
      const hardwareCost = (joistHangers * 2) + (deckScrews * 0.1) + (lagBolts * 5);
      const totalMaterialCost = deckingCost + joistsLumberCost + hardwareCost;
      
      // Calculate board feet
      const deckingBoardFeet = (totalBoardsWithWaste * boardLength * boardWidth * 1.25) / 12;
      const joistBoardFeet = (totalJoists * joistLength * joistSize * 2) / 12;
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Deck Specifications:</h4>
          <p><strong>Deck size: ${length}' × ${width}' (${deckArea} sq ft)</strong></p>
          <p>Board size: ${boardWidth}\" wide × ${boardLength}' long</p>
          <p>Joist spacing: ${joistSpacing}\" on center</p>
          <p>Joist size: 2×${joistSize}</p>
        </div>
        
        <div class="result-decking">
          <h4>Decking Materials:</h4>
          <p><strong>${totalBoardsWithWaste} deck boards</strong> (${boardLength}' long)</p>
          <p>Base requirement: ${totalBoards} boards</p>
          <p>Waste factor: ${wasteBoards} extra boards (10%)</p>
          <p>Board feet: ${deckingBoardFeet.toFixed(0)} bd ft</p>
        </div>
        
        <div class="result-framing">
          <h4>Framing Materials:</h4>
          <p><strong>${totalJoists} joists</strong> (2×${joistSize} × ${joistLength}')</p>
          <p>- ${joistCount} field joists</p>
          <p>- ${rimJoists} rim joists</p>
          <p><strong>${beamPieces} beam sections</strong> (double 2×${joistSize})</p>
          <p><strong>${postsNeeded} posts</strong> (4×4 or 6×6)</p>
          <p>Framing lumber: ${joistBoardFeet.toFixed(0)} bd ft</p>
        </div>
        
        <div class="result-hardware">
          <h4>Hardware & Fasteners:</h4>
          <p><strong>${deckScrews} deck screws</strong> (2.5\" stainless steel)</p>
          <p><strong>${joistHangers} joist hangers</strong> (galvanized)</p>
          <p><strong>${lagBolts} lag bolts</strong> (1/2\" × 6\")</p>
          <p>Joist hanger nails: 5 lbs</p>
          <p>Construction adhesive: 4-6 tubes</p>
        </div>
        
        <div class="result-costs">
          <h4>Estimated Costs:</h4>
          <p>Decking materials: $${deckingCost.toFixed(0)}</p>
          <p>Framing lumber: $${joistsLumberCost.toFixed(0)}</p>
          <p>Hardware & fasteners: $${hardwareCost.toFixed(0)}</p>
          <p><strong>Total materials: $${totalMaterialCost.toFixed(0)}</strong></p>
          <p><em>Prices vary by location and supplier</em></p>
        </div>
        
        <div class="result-additional">
          <h4>Additional Items Needed:</h4>
          <p>🏗️ Concrete footings (${postsNeeded} @ 60-80 lbs each)</p>
          <p>🛡️ Post anchors and brackets</p>
          <p>🪚 Tools: saw, drill, level, measuring tape</p>
          <p>📋 Building permit (check local requirements)</p>
          <p>🧤 Safety equipment: glasses, gloves</p>
        </div>
        
        <div class="result-tips">
          <p><em>📐 Double-check all measurements before ordering</em></p>
          <p><em>🏠 Consider hiring professionals for permits and inspections</em></p>
          <p><em>📦 Order all lumber from same lot for color consistency</em></p>
          <p><em>⏰ Allow 2-3 days for delivery of materials</em></p>
        </div>
      `;
    });
  }
});