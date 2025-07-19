document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("clothing-size-form");
  const result = document.getElementById("clothing-size-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const bust = parseFloat(document.getElementById("bust").value);
    const waist = parseFloat(document.getElementById("waist").value);
    const hips = parseFloat(document.getElementById("hips").value);

    if ([bust, waist, hips].some(val => isNaN(val) || val <= 0)) {
      result.innerHTML = "<p>Please enter valid measurements for all fields.</p>";
      return;
    }

    // Enhanced size chart with more comprehensive data
    const sizeChart = [
      { int: "XS", eu: "32", us: "0", uk: "4", bust: 76, waist: 58, hips: 82 },
      { int: "XS", eu: "34", us: "2", uk: "6", bust: 80, waist: 62, hips: 86 },
      { int: "S",  eu: "36", us: "4", uk: "8", bust: 84, waist: 66, hips: 90 },
      { int: "S",  eu: "38", us: "6", uk: "10", bust: 88, waist: 70, hips: 94 },
      { int: "M",  eu: "40", us: "8", uk: "12", bust: 92, waist: 74, hips: 98 },
      { int: "M",  eu: "42", us: "10", uk: "14", bust: 96, waist: 78, hips: 102 },
      { int: "L",  eu: "44", us: "12", uk: "16", bust: 100, waist: 82, hips: 106 },
      { int: "L",  eu: "46", us: "14", uk: "18", bust: 104, waist: 86, hips: 110 },
      { int: "XL", eu: "48", us: "16", uk: "20", bust: 108, waist: 90, hips: 114 },
      { int: "XL", eu: "50", us: "18", uk: "22", bust: 112, waist: 94, hips: 118 },
      { int: "XXL", eu: "52", us: "20", uk: "24", bust: 116, waist: 98, hips: 122 },
      { int: "XXL", eu: "54", us: "22", uk: "26", bust: 120, waist: 102, hips: 126 }
    ];

    // Find the best fit based on measurements
    const tolerance = 4; // Allow some tolerance for fit
    let bestMatch = null;
    let bestScore = Infinity;

    for (const size of sizeChart) {
      // Calculate how well measurements fit this size
      const bustDiff = Math.abs(bust - size.bust);
      const waistDiff = Math.abs(waist - size.waist);
      const hipsDiff = Math.abs(hips - size.hips);
      
      // Check if measurements are within reasonable range
      if (bust <= size.bust + tolerance && 
          waist <= size.waist + tolerance && 
          hips <= size.hips + tolerance) {
        
        const score = bustDiff + waistDiff + hipsDiff;
        if (score < bestScore) {
          bestScore = score;
          bestMatch = size;
        }
      }
    }

    if (bestMatch) {
      result.innerHTML = `
        <h3>Your Recommended Clothing Size:</h3>
        <div class="size-results">
          <div class="size-item"><strong>International:</strong> <span class="size-value">${bestMatch.int}</span></div>
          <div class="size-item"><strong>European (EU):</strong> <span class="size-value">${bestMatch.eu}</span></div>
          <div class="size-item"><strong>US:</strong> <span class="size-value">${bestMatch.us}</span></div>
          <div class="size-item"><strong>UK:</strong> <span class="size-value">${bestMatch.uk}</span></div>
        </div>
        
        <div class="measurement-note">
          <h4>Your Measurements:</h4>
          <ul>
            <li>Bust/Chest: ${bust} cm</li>
            <li>Waist: ${waist} cm</li>
            <li>Hips: ${hips} cm</li>
          </ul>
        </div>
        
        <div class="size-advice">
          <h4>Shopping Tips:</h4>
          <ul>
            <li>Always check the specific brand's size chart when shopping online</li>
            <li>Consider the fit style (slim, regular, loose) when selecting your size</li>
            <li>For stretchy fabrics, you might prefer a size smaller for a more fitted look</li>
            <li>When in doubt between two sizes, consider your preferred fit and the garment type</li>
          </ul>
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="no-match">
          <h3>Custom Size Needed</h3>
          <p>Your measurements don't match standard sizing exactly. Here are your options:</p>
          <ul>
            <li>Look for brands that offer custom sizing or extended size ranges</li>
            <li>Consider professional tailoring for the best fit</li>
            <li>Check if the brand offers detailed size charts with exact measurements</li>
            <li>Contact customer service for size recommendations</li>
          </ul>
          
          <div class="measurement-summary">
            <h4>Your Measurements:</h4>
            <p>Bust/Chest: ${bust} cm | Waist: ${waist} cm | Hips: ${hips} cm</p>
          </div>
        </div>
      `;
    }
  });
});