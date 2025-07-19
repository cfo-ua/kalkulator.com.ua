document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('renovation-cost-form');
  const result = document.getElementById('renovation-cost-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('renovation-area').value);
      const renovationType = document.getElementById('renovation-type').value;
      
      if (area <= 0) {
        result.textContent = "Please enter a positive area value.";
        return;
      }

      if (!renovationType) {
        result.textContent = "Please select a renovation type.";
        return;
      }

      let priceMin, priceMax, typeName;
      
      if (renovationType === 'custom') {
        const customPrice = parseFloat(document.getElementById('renovation-price').value);
        if (customPrice <= 0) {
          result.textContent = "Please enter a cost per square foot.";
          return;
        }
        priceMin = priceMax = customPrice;
        typeName = "Custom renovation";
      } else {
        // Set price ranges based on renovation type
        switch(renovationType) {
          case 'basic':
            priceMin = 15; priceMax = 30; typeName = "Basic/Cosmetic renovation";
            break;
          case 'mid':
            priceMin = 30; priceMax = 60; typeName = "Mid-range renovation";
            break;
          case 'high':
            priceMin = 60; priceMax = 120; typeName = "High-end renovation";
            break;
          case 'luxury':
            priceMin = 120; priceMax = 200; typeName = "Luxury renovation";
            break;
          case 'kitchen':
            priceMin = 75; priceMax = 200; typeName = "Kitchen renovation";
            break;
          case 'bathroom':
            priceMin = 100; priceMax = 250; typeName = "Bathroom renovation";
            break;
        }
      }
      
      const costMin = area * priceMin;
      const costMax = area * priceMax;
      const costAverage = (costMin + costMax) / 2;
      const contingency = costAverage * 0.2; // 20% contingency
      const totalWithContingency = costAverage + contingency;
      
      if (priceMin === priceMax) {
        // Custom price
        result.innerHTML = `
          <div class="result-section">
            <h4>Renovation Cost Estimate:</h4>
            <p><strong>$${costMin.toLocaleString()}</strong></p>
            <p>${area} sq ft × $${priceMin}/sq ft</p>
          </div>
          <div class="result-breakdown">
            <h4>Budget Planning:</h4>
            <p>Base cost: $${costMin.toLocaleString()}</p>
            <p>20% contingency: $${contingency.toLocaleString()}</p>
            <p><strong>Total budget needed: $${totalWithContingency.toLocaleString()}</strong></p>
          </div>
          <div class="result-tips">
            <p><em>💡 Always add 20% contingency for unexpected costs</em></p>
            <p><em>📋 Get detailed quotes from multiple contractors</em></p>
          </div>
        `;
      } else {
        // Range pricing
        result.innerHTML = `
          <div class="result-section">
            <h4>${typeName} Cost Estimate:</h4>
            <p><strong>$${costMin.toLocaleString()} - $${costMax.toLocaleString()}</strong></p>
            <p>${area} sq ft × $${priceMin}-${priceMax}/sq ft</p>
            <p>Average estimate: $${costAverage.toLocaleString()}</p>
          </div>
          <div class="result-breakdown">
            <h4>Budget Planning (Average):</h4>
            <p>Base cost: $${costAverage.toLocaleString()}</p>
            <p>20% contingency: $${contingency.toLocaleString()}</p>
            <p><strong>Total budget needed: $${totalWithContingency.toLocaleString()}</strong></p>
          </div>
          <div class="result-tips">
            <p><em>💰 Costs vary significantly by location and material choices</em></p>
            <p><em>🔍 Get detailed contractor quotes for accurate pricing</em></p>
            <p><em>📅 Consider seasonal pricing and contractor availability</em></p>
          </div>
        `;
      }
    });
  }
});