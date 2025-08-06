document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('alcohol-dilution-form');
  const result = document.getElementById('alcohol-dilution-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const initialVolume = parseFloat(document.getElementById('initial-volume').value);
      const initialAlcohol = parseFloat(document.getElementById('initial-alcohol').value);
      const targetAlcohol = parseFloat(document.getElementById('target-alcohol').value);
      
      // Validation
      if (isNaN(initialVolume) || isNaN(initialAlcohol) || isNaN(targetAlcohol)) {
        result.innerHTML = '<div class="error">❌ Please enter all numerical values correctly.</div>';
        return;
      }
      
      if (initialVolume <= 0) {
        result.innerHTML = '<div class="error">❌ Alcohol volume must be greater than zero.</div>';
        return;
      }
      
      if (initialAlcohol <= 0 || initialAlcohol > 100) {
        result.innerHTML = '<div class="error">❌ Initial ABV must be between 0 and 100%.</div>';
        return;
      }
      
      if (targetAlcohol < 0 || targetAlcohol > 100) {
        result.innerHTML = '<div class="error">❌ Target ABV must be between 0 and 100%.</div>';
        return;
      }
      
      if (targetAlcohol >= initialAlcohol) {
        result.innerHTML = '<div class="error">❌ Target ABV must be lower than initial ABV. Cannot increase ABV by adding water.</div>';
        return;
      }
      
      // Calculate water needed
      const waterNeeded = (initialVolume * initialAlcohol - initialVolume * targetAlcohol) / targetAlcohol;
      const finalVolume = initialVolume + waterNeeded;
      const alcoholAmount = initialVolume * initialAlcohol / 100;
      
      // Calculate concentration reduction
      const reductionRatio = initialAlcohol / targetAlcohol;
      const waterPercentage = (waterNeeded / finalVolume) * 100;
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>💧 Water Amount</h6>
            <div class="big-number">${waterNeeded.toFixed(1)} ml</div>
            <p>Add this amount of water</p>
          </div>
          
          <div class="insight-card info">
            <h6>📏 Total Volume</h6>
            <div class="big-number">${finalVolume.toFixed(1)} ml</div>
            <p>Volume after dilution</p>
          </div>
          
          <div class="insight-card warning">
            <h6>🍷 Pure Alcohol</h6>
            <div class="big-number">${alcoholAmount.toFixed(1)} ml</div>
            <p>Absolute alcohol in beverage</p>
          </div>
        </div>
        
        <hr>
        
        <div class="calculation-details">
          <h4>📋 Detailed Information:</h4>
          <div class="details-grid">
            <div><strong>🔄 Dilution Ratio:</strong> 1:${(reductionRatio - 1).toFixed(2)} (alcohol:water)</div>
            <div><strong>💧 Water percentage in final beverage:</strong> ${waterPercentage.toFixed(1)}%</div>
            <div><strong>🍶 Alcohol percentage in final beverage:</strong> ${((initialVolume / finalVolume) * 100).toFixed(1)}%</div>
            <div><strong>📉 ABV Reduction:</strong> ${(initialAlcohol - targetAlcohol).toFixed(1)}°</div>
          </div>
        </div>
        
        <div class="instructions">
          <h4>📝 Dilution Instructions:</h4>
          <ol>
            <li>Prepare ${waterNeeded.toFixed(1)} ml of clean water (distilled or soft drinking water)</li>
            <li>Slowly add water to alcohol while constantly stirring</li>
            <li>Do not add alcohol to water - this may cause alcohol loss</li>
            <li>Let the mixture settle for 24 hours for stabilization</li>
            <li>Check ABV with an alcoholometer</li>
          </ol>
        </div>
        
        <div class="tips">
          <h4>💡 Useful Tips:</h4>
          <ul>
            <li><strong>Temperature:</strong> All components should have the same temperature (~20°C/68°F)</li>
            <li><strong>Water Quality:</strong> Use water with minimal hardness</li>
            <li><strong>Process:</strong> Dilution should be gradual</li>
            <li><strong>Storage:</strong> After dilution, let the beverage "rest" for several days</li>
          </ul>
        </div>
      `;
    });
  }
});