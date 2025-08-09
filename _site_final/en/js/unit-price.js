document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('unit-price-form');
  const result = document.getElementById('unit-price-result');
  const addProductBtn = document.getElementById('add-product');
  const container = document.getElementById('products-container');
  
  let productCount = 2;
  
  // Add product functionality
  if (addProductBtn) {
    addProductBtn.addEventListener('click', function() {
      if (productCount < 4) {
        productCount++;
        const newProduct = document.createElement('div');
        newProduct.className = 'product-row';
        newProduct.setAttribute('data-product', productCount);
        newProduct.innerHTML = `
          <h4>Product ${productCount} 
            <button type="button" class="remove-product" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 2px 8px; margin-left: 10px; cursor: pointer;">✕</button>
          </h4>
          <div class="input-row">
            <label>
              Product name:
              <input type="text" class="product-name" placeholder="e.g. Buckwheat" value="Product ${productCount}">
            </label>
          </div>
          <div class="input-row">
            <label>
              Price:
              <input type="number" class="product-price" step="0.01" min="0" placeholder="5.00">
              <span class="currency">$</span>
            </label>
            <label>
              Quantity:
              <input type="number" class="product-quantity" step="0.001" min="0" placeholder="1">
            </label>
            <label>
              Unit:
              <select class="product-unit">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="m²">m²</option>
              </select>
            </label>
          </div>
        `;
        container.appendChild(newProduct);
        
        // Add remove functionality
        const removeBtn = newProduct.querySelector('.remove-product');
        removeBtn.addEventListener('click', function() {
          newProduct.remove();
          productCount--;
          updateAddButtonState();
        });
        
        updateAddButtonState();
      }
    });
  }
  
  function updateAddButtonState() {
    if (addProductBtn) {
      addProductBtn.style.display = productCount >= 4 ? 'none' : 'inline-block';
    }
  }
  
  // Form submission
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const products = [];
      const productRows = container.querySelectorAll('.product-row');
      
      productRows.forEach((row, index) => {
        const name = row.querySelector('.product-name').value || `Product ${index + 1}`;
        const price = parseFloat(row.querySelector('.product-price').value);
        const quantity = parseFloat(row.querySelector('.product-quantity').value);
        const unit = row.querySelector('.product-unit').value;
        
        if (price > 0 && quantity > 0) {
          const unitPrice = price / quantity;
          products.push({
            name,
            price,
            quantity,
            unit,
            unitPrice
          });
        }
      });
      
      if (products.length === 0) {
        result.innerHTML = '<div class="error">⚠️ Please enter at least one product with valid data</div>';
        return;
      }
      
      // Sort by unit price (ascending)
      products.sort((a, b) => a.unitPrice - b.unitPrice);
      
      // Find best deal
      const bestDeal = products[0];
      const worstDeal = products[products.length - 1];
      const savings = ((worstDeal.unitPrice - bestDeal.unitPrice) / worstDeal.unitPrice * 100);
      
      // Generate comparison cards
      let comparisonCards = '';
      products.forEach((product, index) => {
        const isBest = index === 0;
        const isWorst = index === products.length - 1 && products.length > 1;
        let cardClass = 'info';
        let badge = '';
        
        if (isBest) {
          cardClass = 'success';
          badge = '<div style="background: #28a745; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-bottom: 8px;">🏆 BEST DEAL</div>';
        } else if (isWorst) {
          cardClass = 'warning';
          badge = '<div style="background: #ffc107; color: #333; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-bottom: 8px;">💸 MOST EXPENSIVE</div>';
        }
        
        comparisonCards += `
          <div class="insight-card ${cardClass}">
            ${badge}
            <h6>${product.name}</h6>
            <div class="big-number">$${product.unitPrice.toFixed(2)}</div>
            <p>per ${product.unit}</p>
            <div style="margin-top: 8px; font-size: 0.9rem; color: #666;">
              $${product.price.toFixed(2)} for ${product.quantity} ${product.unit}
            </div>
          </div>
        `;
      });
      
      // Generate savings analysis
      let savingsAnalysis = '';
      if (products.length > 1) {
        savingsAnalysis = `
          <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e8f8e8 0%, #f0fff0 100%); border-radius: 12px; border: 2px solid #28a745;">
            <h4>💡 Savings Analysis:</h4>
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
              <li><strong>Best deal:</strong> ${bestDeal.name} ($${bestDeal.unitPrice.toFixed(2)}/${bestDeal.unit})</li>
              <li><strong>Most expensive:</strong> ${worstDeal.name} ($${worstDeal.unitPrice.toFixed(2)}/${worstDeal.unit})</li>
              <li><strong>Savings:</strong> ${savings.toFixed(1)}% by choosing the best deal</li>
              <li><strong>Price difference:</strong> $${(worstDeal.unitPrice - bestDeal.unitPrice).toFixed(2)} per ${bestDeal.unit}</li>
            </ul>
          </div>
        `;
      }
      
      result.innerHTML = `
        <div class="insight-cards">
          ${comparisonCards}
        </div>
        
        ${savingsAnalysis}
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
          <h4>📊 Detailed Comparison Table:</h4>
          <div style="overflow-x: auto; margin-top: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <thead>
                <tr style="background: #e9ecef;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Price</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Quantity</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Rank</th>
                </tr>
              </thead>
              <tbody>
                ${products.map((product, index) => `
                  <tr style="background: ${index === 0 ? '#e8f8e8' : index === products.length - 1 && products.length > 1 ? '#fff3cd' : 'white'};">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${product.name}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${product.price.toFixed(2)}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${product.quantity} ${product.unit}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${product.unitPrice.toFixed(2)}/${product.unit}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index === 0 ? '🏆' : index + 1}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });
  }
});