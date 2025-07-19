document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ac-power-form');
  const result = document.getElementById('ac-power-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('ac-area').value);
      const people = parseInt(document.getElementById('ac-people').value, 10) || 0;
      const windows = parseInt(document.getElementById('ac-windows').value, 10) || 0;
      const roomType = parseFloat(document.getElementById('ac-room-type').value) || 1;
      
      if (area <= 0) {
        result.textContent = "Please enter the room area.";
        return;
      }
      
      // Base calculation: 20 BTU per sq ft
      let btu = area * 20;
      
      // Add BTUs for people (600 BTU per person)
      btu += people * 600;
      
      // Add BTUs for windows (1000 BTU per window for heat gain)
      btu += windows * 1000;
      
      // Apply room type multiplier
      btu *= roomType;
      
      // Calculate tonnage (12,000 BTU = 1 ton)
      const tonnage = btu / 12000;
      
      // Suggest standard AC sizes
      const standardSizes = [
        { btu: 5000, ton: 0.4, type: "Small window unit" },
        { btu: 6000, ton: 0.5, type: "Medium window unit" },
        { btu: 8000, ton: 0.67, type: "Large window unit" },
        { btu: 10000, ton: 0.83, type: "Small portable/mini-split" },
        { btu: 12000, ton: 1.0, type: "1-ton mini-split" },
        { btu: 15000, ton: 1.25, type: "1.25-ton unit" },
        { btu: 18000, ton: 1.5, type: "1.5-ton unit" },
        { btu: 24000, ton: 2.0, type: "2-ton unit" },
        { btu: 30000, ton: 2.5, type: "2.5-ton unit" }
      ];
      
      const suggestion = standardSizes.find(s => btu <= s.btu) || standardSizes[standardSizes.length - 1];
      
      // Energy cost estimation
      const kwhPerYear = (btu / 1000) * 1000 / 10; // Rough estimate
      const annualCost = kwhPerYear * 0.12; // $0.12 per kWh average
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Recommended AC Capacity:</h4>
          <p><strong>${Math.round(btu).toLocaleString()} BTU/hour</strong></p>
          <p><strong>${tonnage.toFixed(2)} tons</strong></p>
        </div>
        <div class="result-recommendation">
          <h4>Suggested Unit:</h4>
          <p><strong>${suggestion.btu.toLocaleString()} BTU</strong> (${suggestion.ton} ton)</p>
          <p>Type: ${suggestion.type}</p>
        </div>
        <div class="result-breakdown">
          <h4>Calculation Breakdown:</h4>
          <p>Base load: ${area} sq ft × 20 BTU = ${(area * 20).toLocaleString()} BTU</p>
          ${people > 0 ? `<p>People: ${people} × 600 BTU = ${(people * 600).toLocaleString()} BTU</p>` : ''}
          ${windows > 0 ? `<p>Windows: ${windows} × 1,000 BTU = ${(windows * 1000).toLocaleString()} BTU</p>` : ''}
          ${roomType !== 1 ? `<p>Room type adjustment: ×${roomType}</p>` : ''}
        </div>
        <div class="result-tips">
          <p><em>❄️ Consider a unit with variable speed for better efficiency</em></p>
          <p><em>⚡ Estimated annual energy cost: ~$${annualCost.toFixed(0)}</em></p>
          <p><em>🏠 For whole-home cooling, consult an HVAC professional</em></p>
        </div>
      `;
    });
  }
});