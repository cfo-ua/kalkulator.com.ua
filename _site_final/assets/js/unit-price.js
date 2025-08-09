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
          <h4>Товар ${productCount} 
            <button type="button" class="remove-product" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 2px 8px; margin-left: 10px; cursor: pointer;">✕</button>
          </h4>
          <div class="input-row">
            <label>
              Назва товару:
              <input type="text" class="product-name" placeholder="Наприклад: Гречка" value="Товар ${productCount}">
            </label>
          </div>
          <div class="input-row">
            <label>
              Ціна:
              <input type="number" class="product-price" step="0.01" min="0" placeholder="100">
              <span class="currency">грн</span>
            </label>
            <label>
              Кількість:
              <input type="number" class="product-quantity" step="0.001" min="0" placeholder="1">
            </label>
            <label>
              Одиниця:
              <select class="product-unit">
                <option value="кг">кг</option>
                <option value="г">г</option>
                <option value="л">л</option>
                <option value="мл">мл</option>
                <option value="шт">шт</option>
                <option value="м">м</option>
                <option value="см">см</option>
                <option value="м²">м²</option>
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
        const name = row.querySelector('.product-name').value || `Товар ${index + 1}`;
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
        result.innerHTML = '<div class="error">⚠️ Введіть хоча б один товар з коректними даними</div>';
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
          badge = '<div style="background: #28a745; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-bottom: 8px;">🏆 НАЙВИГІДНІШЕ</div>';
        } else if (isWorst) {
          cardClass = 'warning';
          badge = '<div style="background: #ffc107; color: #333; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-bottom: 8px;">💸 НАЙДОРОЖЧЕ</div>';
        }
        
        comparisonCards += `
          <div class="insight-card ${cardClass}">
            ${badge}
            <h6>${product.name}</h6>
            <div class="big-number">${product.unitPrice.toFixed(2)}</div>
            <p>грн за ${product.unit}</p>
            <div style="margin-top: 8px; font-size: 0.9rem; color: #666;">
              ${product.price.toFixed(2)} грн за ${product.quantity} ${product.unit}
            </div>
          </div>
        `;
      });
      
      // Generate savings analysis
      let savingsAnalysis = '';
      if (products.length > 1) {
        savingsAnalysis = `
          <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e8f8e8 0%, #f0fff0 100%); border-radius: 12px; border: 2px solid #28a745;">
            <h4>💡 Аналіз економії:</h4>
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
              <li><strong>Найвигідніший варіант:</strong> ${bestDeal.name} (${bestDeal.unitPrice.toFixed(2)} грн/${bestDeal.unit})</li>
              <li><strong>Найдорожчий варіант:</strong> ${worstDeal.name} (${worstDeal.unitPrice.toFixed(2)} грн/${worstDeal.unit})</li>
              <li><strong>Економія:</strong> ${savings.toFixed(1)}% при виборі найвигіднішого варіанту</li>
              <li><strong>Різниця в ціні:</strong> ${(worstDeal.unitPrice - bestDeal.unitPrice).toFixed(2)} грн за ${bestDeal.unit}</li>
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
          <h4>📊 Детальна таблиця порівняння:</h4>
          <div style="overflow-x: auto; margin-top: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <thead>
                <tr style="background: #e9ecef;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Товар</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Загальна ціна</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Кількість</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Ціна за одиницю</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Рейтинг</th>
                </tr>
              </thead>
              <tbody>
                ${products.map((product, index) => `
                  <tr style="background: ${index === 0 ? '#e8f8e8' : index === products.length - 1 && products.length > 1 ? '#fff3cd' : 'white'};">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${product.name}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${product.price.toFixed(2)} грн</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${product.quantity} ${product.unit}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${product.unitPrice.toFixed(2)} грн/${product.unit}</td>
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