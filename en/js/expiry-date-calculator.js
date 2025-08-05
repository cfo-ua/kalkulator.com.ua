document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("expiry-form");
  const result = document.getElementById("expiry-result");
  
  // Set default production date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("production-date").value = today;

  // Storage tips for different product types
  const storageTips = {
    dairy: "🥛 Keep refrigerated at 35-40°F (2-4°C). Don't leave at room temperature for more than 2 hours.",
    meat: "🥩 Store in the coldest part of the refrigerator at 32-40°F (0-4°C). Use or freeze as soon as possible.",
    vegetables: "🥕 Most vegetables should be refrigerated, while fruits can ripen at room temperature before refrigerating.",
    bakery: "🍞 Store in a cool, dry place at room temperature. Bread can be frozen for extended storage.",
    canned: "🥫 Store in a cool, dry place away from direct sunlight and extreme temperatures.",
    frozen: "❄️ Keep in freezer at 0°F (-18°C) or below. Avoid repeated thawing and refreezing."
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const productionDate = new Date(document.getElementById("production-date").value);
    const shelfLifeDays = parseInt(document.getElementById("shelf-life").value);
    const productType = document.getElementById("product-type").value;

    if (isNaN(productionDate) || isNaN(shelfLifeDays) || shelfLifeDays < 1) {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>❌ Error</h6>
          <p>Please enter valid dates and shelf life duration.</p>
        </div>
      `;
      return;
    }

    // Calculate expiry date
    const expiryDate = new Date(productionDate);
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);
    
    // Calculate days remaining
    const today = new Date();
    const timeDiff = expiryDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Determine status and color
    let status, statusClass, statusIcon, statusText;
    if (daysRemaining > 3) {
      status = "fresh";
      statusClass = "success";
      statusIcon = "✅";
      statusText = "Product is Fresh";
    } else if (daysRemaining > 0) {
      status = "warning";
      statusClass = "warning";
      statusIcon = "⚠️";
      statusText = "Attention! Expiring Soon";
    } else {
      status = "expired";
      statusClass = "warning";
      statusIcon = "❌";
      statusText = "Product Has Expired";
    }

    // Format dates for display
    const productionDateStr = productionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const expiryDateStr = expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get storage tip if product type is selected
    const storageTip = productType ? storageTips[productType] : "";

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${statusClass}">
          <h6>${statusIcon} Freshness Status</h6>
          <div class="big-number">${Math.abs(daysRemaining)}</div>
          <p>${daysRemaining >= 0 ? 'days remaining' : 'days expired'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Expiry Date</h6>
          <div class="big-number">${expiryDate.getDate()}</div>
          <p>${expiryDateStr}</p>
        </div>
        
        <div class="insight-card">
          <h6>⏱️ Shelf Life</h6>
          <div class="big-number">${shelfLifeDays}</div>
          <p>${shelfLifeDays === 1 ? 'day' : 'days'}</p>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <div class="insight-card ${statusClass}">
          <h6>${statusIcon} ${statusText}</h6>
          <div style="margin-top: 1rem;">
            <p><strong>📅 Production Date:</strong> ${productionDateStr}</p>
            <p><strong>⏰ Expires On:</strong> ${expiryDateStr}</p>
            ${daysRemaining >= 0 
              ? `<p><strong>⏳ Time Remaining:</strong> ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}</p>`
              : `<p><strong>⚠️ Expired:</strong> ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'day' : 'days'} ago</p>`
            }
          </div>
        </div>
      </div>

      ${storageTip ? `
        <div style="margin-top: 1rem;">
          <div class="insight-card info">
            <h6>💡 Storage Recommendations</h6>
            <p>${storageTip}</p>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 1rem;">
        <div class="insight-card">
          <h6>🔔 Recommendations</h6>
          <ul style="margin: 0.5rem 0; padding-left: 1rem;">
            ${daysRemaining > 0 
              ? `<li>Plan to use this product within ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}</li>`
              : '<li style="color: #dc3545;">Do not consume expired product without careful inspection</li>'
            }
            <li>Always check appearance, smell, and texture before consumption</li>
            <li>Follow storage conditions specified on the packaging</li>
            ${daysRemaining <= 3 && daysRemaining > 0 
              ? '<li>Consider freezing if the product is suitable for freezing</li>'
              : ''
            }
          </ul>
        </div>
      </div>
    `;
  });

  // Calculate on page load with default values
  if (document.getElementById("production-date").value && document.getElementById("shelf-life").value) {
    form.dispatchEvent(new Event('submit'));
  }
});