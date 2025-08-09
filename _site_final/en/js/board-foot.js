document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('board-foot-form');
  const result = document.getElementById('board-foot-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const thickness = parseFloat(document.getElementById('lumber-thickness').value);
      const width = parseFloat(document.getElementById('lumber-width').value);
      const length = parseFloat(document.getElementById('lumber-length').value);
      const quantity = parseFloat(document.getElementById('lumber-quantity').value);
      const pricePerBoardFoot = parseFloat(document.getElementById('lumber-type').value);
      const wasteFactor = parseFloat(document.getElementById('lumber-waste').value);
      
      if (thickness <= 0 || width <= 0 || length <= 0 || quantity <= 0) {
        result.textContent = "Please enter valid measurements.";
        return;
      }
      
      // Calculate board feet per piece
      const boardFeetPerPiece = (thickness * width * length) / 12;
      
      // Calculate total board feet
      const totalBoardFeet = boardFeetPerPiece * quantity;
      
      // Add waste factor
      const boardFeetWithWaste = totalBoardFeet * (1 + wasteFactor);
      
      // Calculate costs
      const baseCost = totalBoardFeet * pricePerBoardFoot;
      const costWithWaste = boardFeetWithWaste * pricePerBoardFoot;
      const wasteCost = costWithWaste - baseCost;
      
      // Calculate volume and weight estimates
      const volumeCubicFeet = (thickness * width * length * quantity) / 144;
      const weightLbs = volumeCubicFeet * 35; // Average 35 lbs per cubic foot for lumber
      
      // Find equivalent common lumber sizes
      const commonSizes = [
        { name: "1×4×8", thickness: 0.75, width: 3.5, length: 8, bf: 2.33 },
        { name: "1×6×8", thickness: 0.75, width: 5.5, length: 8, bf: 3.67 },
        { name: "2×4×8", thickness: 1.5, width: 3.5, length: 8, bf: 4.67 },
        { name: "2×6×8", thickness: 1.5, width: 5.5, length: 8, bf: 7.33 },
        { name: "2×8×10", thickness: 1.5, width: 7.25, length: 10, bf: 9.58 },
        { name: "2×10×12", thickness: 1.5, width: 9.25, length: 12, bf: 15.42 }
      ];
      
      // Find closest match
      let closestMatch = commonSizes[0];
      let smallestDiff = Math.abs(boardFeetPerPiece - closestMatch.bf);
      
      commonSizes.forEach(size => {
        const diff = Math.abs(boardFeetPerPiece - size.bf);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestMatch = size;
        }
      });
      
      // Calculate linear feet (total length if pieces were laid end-to-end)
      const linearFeet = length * quantity;
      
      // Calculate surface area (one face)
      const surfaceArea = (width * length * quantity) / 144; // square feet
      
      // Determine lumber grade recommendations
      let gradeRecommendation = '';
      if (pricePerBoardFoot <= 6) {
        gradeRecommendation = 'Construction grade suitable for framing, general building';
      } else if (pricePerBoardFoot <= 15) {
        gradeRecommendation = 'Select grade hardwood suitable for furniture, cabinetry';
      } else {
        gradeRecommendation = 'Premium grade suitable for fine furniture, musical instruments';
      }
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Lumber Specifications:</h4>
          <p>Dimensions: ${thickness}" × ${width}" × ${length}'</p>
          <p>Quantity: ${quantity} pieces</p>
          <p>Waste factor: ${(wasteFactor * 100)}%</p>
        </div>
        
        <div class="result-board-feet">
          <h4>Board Foot Calculations:</h4>
          <p><strong>Per piece: ${boardFeetPerPiece.toFixed(2)} board feet</strong></p>
          <p><strong>Total: ${totalBoardFeet.toFixed(2)} board feet</strong></p>
          <p><strong>With waste: ${boardFeetWithWaste.toFixed(2)} board feet</strong></p>
          <p>Formula: (${thickness} × ${width} × ${length}) ÷ 12 × ${quantity}</p>
        </div>
        
        <div class="result-measurements">
          <h4>Alternative Measurements:</h4>
          <p>Linear feet: ${linearFeet} ft (end-to-end length)</p>
          <p>Surface area: ${surfaceArea.toFixed(2)} sq ft (one face)</p>
          <p>Volume: ${volumeCubicFeet.toFixed(2)} cubic feet</p>
          <p>Estimated weight: ${weightLbs.toFixed(0)} lbs</p>
        </div>
        
        <div class="result-costs">
          <h4>Cost Breakdown:</h4>
          <p>Base cost: $${baseCost.toFixed(2)} (${totalBoardFeet.toFixed(2)} bd ft @ $${pricePerBoardFoot})</p>
          <p>Waste allowance: $${wasteCost.toFixed(2)}</p>
          <p><strong>Total cost: $${costWithWaste.toFixed(2)}</strong></p>
          <p>Cost per piece: $${(costWithWaste / quantity).toFixed(2)}</p>
          <p>Cost per linear foot: $${(costWithWaste / linearFeet).toFixed(2)}</p>
        </div>
        
        <div class="result-comparison">
          <h4>Common Size Comparison:</h4>
          <p>Your lumber: ${boardFeetPerPiece.toFixed(2)} bd ft per piece</p>
          <p>Closest standard: ${closestMatch.name} (${closestMatch.bf.toFixed(2)} bd ft)</p>
          <p>Difference: ${Math.abs(boardFeetPerPiece - closestMatch.bf).toFixed(2)} bd ft</p>
        </div>
        
        <div class="result-grade">
          <h4>Grade Recommendation:</h4>
          <p>${gradeRecommendation}</p>
          ${pricePerBoardFoot <= 6 ? 
            '<p>💡 Consider kiln-dried lumber for indoor projects</p>' : 
            '<p>💡 Ensure proper moisture content for your application</p>'}
        </div>
        
        <div class="result-ordering">
          <h4>Ordering Information:</h4>
          <p>Order: ${Math.ceil(boardFeetWithWaste)} board feet</p>
          <p>Delivery: ${weightLbs > 500 ? 'Truck delivery recommended' : 'Can fit in pickup truck'}</p>
          <p>Storage: Store flat, supported every 2-3 feet</p>
          <p>Acclimation: 3-7 days in project environment</p>
        </div>
        
        <div class="result-project-tips">
          <h4>Project Planning:</h4>
          <p>🔨 Plan cuts to minimize waste</p>
          <p>📏 Measure twice, cut once</p>
          <p>🌡️ Allow lumber to acclimate</p>
          <p>📦 Buy from same lot for consistency</p>
          <p>🎯 Use best pieces for visible surfaces</p>
        </div>
        
        <div class="result-alternatives">
          <h4>Cost Alternatives:</h4>
          <p>Construction grade: $${(totalBoardFeet * 4).toFixed(0)} (vs $${baseCost.toFixed(0)})</p>
          <p>Premium hardwood: $${(totalBoardFeet * 25).toFixed(0)} (vs $${baseCost.toFixed(0)})</p>
          <p>💰 ${pricePerBoardFoot > 10 ? 'Consider' : 'More expensive than'} engineered alternatives</p>
        </div>
        
        <div class="result-tools">
          <h4>Tools for Processing:</h4>
          <p>📐 Measuring: tape measure, square, calipers</p>
          <p>🪚 Cutting: table saw, miter saw, circular saw</p>
          <p>✂️ Joining: router, biscuit joiner, pocket screws</p>
          <p>📝 Planning: cut list, lumber marking system</p>
        </div>
      `;
    });
  }
});