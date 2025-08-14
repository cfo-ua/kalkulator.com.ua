document.addEventListener("DOMContentLoaded", function () {
  // Get language for localized messages
  const isUkrainian = !window.location.pathname.includes('/en/');
  
  // UI Messages
  const messages = {
    uk: {
      discountResult: "Результат розрахунку знижки",
      multipleDiscountResult: "Результат кількох знижок",
      comparisonResult: "Порівняння пропозицій",
      originalPrice: "Початкова ціна",
      discountAmount: "Розмір знижки",
      discountPercent: "Відсоток знижки",
      finalPrice: "Фінальна ціна",
      priceAfterTax: "Ціна з ПДВ",
      youSave: "Ви економите",
      totalSavings: "Загальна економія",
      steps: "Кроки розрахунку",
      bestDeal: "Найкраща пропозиція",
      offer: "Пропозиція",
      cheaper: "дешевше на",
      moreExpensive: "дорожче на",
      samePrice: "Однакова ціна",
      currency: "грн",
      step: "Крок",
      after: "після",
      discount: "знижки",
      enterValidNumber: "Введіть коректне число",
      enterOriginalPrice: "Введіть початкову ціну",
      priceBreakdown: "Деталізація ціни"
    },
    en: {
      discountResult: "Discount Calculation Result",
      multipleDiscountResult: "Multiple Discounts Result",
      comparisonResult: "Offers Comparison",
      originalPrice: "Original Price",
      discountAmount: "Discount Amount",
      discountPercent: "Discount Percentage",
      finalPrice: "Final Price",
      priceAfterTax: "Price After Tax",
      youSave: "You Save",
      totalSavings: "Total Savings",
      steps: "Calculation Steps",
      bestDeal: "Best Deal",
      offer: "Offer",
      cheaper: "cheaper by",
      moreExpensive: "more expensive by",
      samePrice: "Same price",
      currency: "$",
      step: "Step",
      after: "after",
      discount: "discount",
      enterValidNumber: "Enter a valid number",
      enterOriginalPrice: "Enter original price",
      priceBreakdown: "Price Breakdown"
    }
  };
  
  const msg = messages[isUkrainian ? 'uk' : 'en'];
  let discountCounter = 3;

  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Remove active class from all tabs and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').classList.add('active');
      
      // Clear results when switching tabs
      document.getElementById('discount-result').innerHTML = '';
    });
  });

  // Basic discount calculator
  const basicForm = document.getElementById('basic-discount-form');
  const reverseBtn = document.getElementById('reverse-calc');
  const reverseInputs = document.querySelector('.reverse-calc-inputs');
  let isReverseMode = false;

  if (basicForm) {
    basicForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (isReverseMode) {
        calculateReverseDiscount();
      } else {
        calculateBasicDiscount();
      }
    });
  }

  if (reverseBtn) {
    reverseBtn.addEventListener('click', function() {
      isReverseMode = !isReverseMode;
      reverseInputs.style.display = isReverseMode ? 'block' : 'none';
      reverseBtn.textContent = isReverseMode ? 
        (isUkrainian ? 'Звичайний розрахунок' : 'Normal Calculation') :
        (isUkrainian ? 'Знайти % знижки' : 'Find Discount %');
    });
  }

  // Multiple discounts calculator
  const multipleForm = document.getElementById('multiple-discount-form');
  const addDiscountBtn = document.getElementById('add-discount');

  if (multipleForm) {
    multipleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateMultipleDiscounts();
    });
  }

  if (addDiscountBtn) {
    addDiscountBtn.addEventListener('click', function() {
      addDiscountInput();
    });
  }

  // Comparison calculator
  const compareForm = document.getElementById('compare-form');
  if (compareForm) {
    compareForm.addEventListener('submit', function(e) {
      e.preventDefault();
      compareOffers();
    });
  }

  // Basic discount calculation
  function calculateBasicDiscount() {
    const originalPrice = parseFloat(document.getElementById('original-price').value);
    const discountPercent = parseFloat(document.getElementById('discount-percent').value) || 0;
    const taxPercent = parseFloat(document.getElementById('tax-percent').value) || 0;

    if (!originalPrice || originalPrice <= 0) {
      showError(msg.enterOriginalPrice);
      return;
    }

    const discountAmount = originalPrice * (discountPercent / 100);
    const discountedPrice = originalPrice - discountAmount;
    const taxAmount = discountedPrice * (taxPercent / 100);
    const finalPrice = discountedPrice + taxAmount;

    const result = {
      type: 'basic',
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      discountedPrice: discountedPrice,
      taxPercent: taxPercent,
      taxAmount: taxAmount,
      finalPrice: finalPrice,
      totalSavings: originalPrice - finalPrice
    };

    displayBasicResult(result);
  }

  // Reverse discount calculation
  function calculateReverseDiscount() {
    const originalPrice = parseFloat(document.getElementById('original-price').value);
    const finalPrice = parseFloat(document.getElementById('final-price').value);

    if (!originalPrice || originalPrice <= 0 || !finalPrice || finalPrice < 0) {
      showError(msg.enterValidNumber);
      return;
    }

    const discountAmount = originalPrice - finalPrice;
    const discountPercent = (discountAmount / originalPrice) * 100;

    const result = {
      type: 'reverse',
      originalPrice: originalPrice,
      finalPrice: finalPrice,
      discountAmount: discountAmount,
      discountPercent: discountPercent
    };

    displayReverseResult(result);
  }

  // Multiple discounts calculation
  function calculateMultipleDiscounts() {
    const originalPrice = parseFloat(document.getElementById('multi-price').value);
    
    if (!originalPrice || originalPrice <= 0) {
      showError(msg.enterOriginalPrice);
      return;
    }

    const discountInputs = document.querySelectorAll('.discount-input');
    const discounts = Array.from(discountInputs)
      .map(input => parseFloat(input.value) || 0)
      .filter(discount => discount > 0);

    if (discounts.length === 0) {
      showError(isUkrainian ? 'Введіть хоча б одну знижку' : 'Enter at least one discount');
      return;
    }

    let currentPrice = originalPrice;
    const steps = [];

    discounts.forEach((discount, index) => {
      const discountAmount = currentPrice * (discount / 100);
      const newPrice = currentPrice - discountAmount;
      
      steps.push({
        step: index + 1,
        discount: discount,
        priceBefore: currentPrice,
        discountAmount: discountAmount,
        priceAfter: newPrice
      });
      
      currentPrice = newPrice;
    });

    const result = {
      type: 'multiple',
      originalPrice: originalPrice,
      finalPrice: currentPrice,
      totalSavings: originalPrice - currentPrice,
      totalDiscountPercent: ((originalPrice - currentPrice) / originalPrice) * 100,
      steps: steps
    };

    displayMultipleResult(result);
  }

  // Compare offers calculation
  function compareOffers() {
    const priceA = parseFloat(document.getElementById('price-a').value);
    const discountA = parseFloat(document.getElementById('discount-a').value) || 0;
    const priceB = parseFloat(document.getElementById('price-b').value);
    const discountB = parseFloat(document.getElementById('discount-b').value) || 0;

    if (!priceA || priceA <= 0 || !priceB || priceB <= 0) {
      showError(msg.enterValidNumber);
      return;
    }

    const finalA = priceA * (1 - discountA / 100);
    const finalB = priceB * (1 - discountB / 100);
    const savingsA = priceA - finalA;
    const savingsB = priceB - finalB;

    let comparison;
    if (finalA < finalB) {
      comparison = {
        winner: 'A',
        difference: finalB - finalA,
        message: `${msg.offer} A ${msg.cheaper} ${(finalB - finalA).toFixed(2)} ${msg.currency}`
      };
    } else if (finalB < finalA) {
      comparison = {
        winner: 'B', 
        difference: finalA - finalB,
        message: `${msg.offer} B ${msg.cheaper} ${(finalA - finalB).toFixed(2)} ${msg.currency}`
      };
    } else {
      comparison = {
        winner: 'tie',
        difference: 0,
        message: msg.samePrice
      };
    }

    const result = {
      type: 'comparison',
      offerA: {
        original: priceA,
        discount: discountA,
        final: finalA,
        savings: savingsA
      },
      offerB: {
        original: priceB,
        discount: discountB,
        final: finalB,
        savings: savingsB
      },
      comparison: comparison
    };

    displayComparisonResult(result);
  }

  // Add discount input
  function addDiscountInput() {
    if (discountCounter > 10) return; // Limit to 10 discounts

    const discountInputs = document.getElementById('discount-inputs');
    const newInput = document.createElement('div');
    newInput.className = 'input-group';
    newInput.innerHTML = `
      <label for="discount${discountCounter}">${isUkrainian ? '🏷️ Знижка' : '🏷️ Discount'} ${discountCounter} (%):</label>
      <input type="number" class="discount-input" id="discount${discountCounter}" step="0.01" min="0" max="100" placeholder="${isUkrainian ? 'Знижка' : 'Discount'} ${discountCounter}">
      <button type="button" class="remove-discount" onclick="this.parentElement.remove()">❌</button>
    `;
    
    discountInputs.appendChild(newInput);
    discountCounter++;
  }

  // Display basic result
  function displayBasicResult(result) {
    const html = `
      <div class="insight-card success">
        <h6>📊 ${msg.discountResult}</h6>
        
        <div class="price-breakdown">
          <div class="price-item">
            <span>${msg.originalPrice}:</span>
            <span class="price-value">${formatCurrency(result.originalPrice)}</span>
          </div>
          
          <div class="price-item discount">
            <span>${msg.discountAmount} (${result.discountPercent}%):</span>
            <span class="price-value">-${formatCurrency(result.discountAmount)}</span>
          </div>
          
          ${result.taxAmount > 0 ? `
          <div class="price-item">
            <span>${isUkrainian ? 'ПДВ' : 'Tax'} (${result.taxPercent}%):</span>
            <span class="price-value">+${formatCurrency(result.taxAmount)}</span>
          </div>
          ` : ''}
          
          <div class="price-item final">
            <span>${msg.finalPrice}:</span>
            <span class="big-number">${formatCurrency(result.finalPrice)}</span>
          </div>
          
          <div class="savings-highlight">
            <span>💰 ${msg.youSave}: ${formatCurrency(result.totalSavings)}</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById('discount-result').innerHTML = html;
    createDiscountChart(result);
  }

  // Display reverse result
  function displayReverseResult(result) {
    const html = `
      <div class="insight-card info">
        <h6>🔍 ${msg.discountResult}</h6>
        
        <div class="price-breakdown">
          <div class="price-item">
            <span>${msg.originalPrice}:</span>
            <span class="price-value">${formatCurrency(result.originalPrice)}</span>
          </div>
          
          <div class="price-item">
            <span>${msg.finalPrice}:</span>
            <span class="price-value">${formatCurrency(result.finalPrice)}</span>
          </div>
          
          <div class="price-item final">
            <span>${msg.discountPercent}:</span>
            <span class="big-number">${result.discountPercent.toFixed(2)}%</span>
          </div>
          
          <div class="savings-highlight">
            <span>💰 ${msg.discountAmount}: ${formatCurrency(result.discountAmount)}</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById('discount-result').innerHTML = html;
  }

  // Display multiple discounts result
  function displayMultipleResult(result) {
    let stepsHtml = '';
    result.steps.forEach(step => {
      stepsHtml += `
        <div class="step-item">
          <strong>${msg.step} ${step.step}:</strong> ${step.discount}% ${msg.discount}<br>
          <span class="step-detail">
            ${formatCurrency(step.priceBefore)} → ${formatCurrency(step.priceAfter)} 
            (${msg.youSave}: ${formatCurrency(step.discountAmount)})
          </span>
        </div>
      `;
    });

    const html = `
      <div class="insight-card success">
        <h6>📊 ${msg.multipleDiscountResult}</h6>
        
        <div class="price-breakdown">
          <div class="price-item">
            <span>${msg.originalPrice}:</span>
            <span class="price-value">${formatCurrency(result.originalPrice)}</span>
          </div>
          
          <div class="price-item final">
            <span>${msg.finalPrice}:</span>
            <span class="big-number">${formatCurrency(result.finalPrice)}</span>
          </div>
          
          <div class="savings-highlight">
            <span>💰 ${msg.totalSavings}: ${formatCurrency(result.totalSavings)} (${result.totalDiscountPercent.toFixed(2)}%)</span>
          </div>
        </div>
        
        <div class="steps-breakdown">
          <h6>📝 ${msg.steps}:</h6>
          ${stepsHtml}
        </div>
      </div>
    `;

    document.getElementById('discount-result').innerHTML = html;
  }

  // Display comparison result
  function displayComparisonResult(result) {
    const html = `
      <div class="insight-card ${result.comparison.winner === 'tie' ? 'info' : 'success'}">
        <h6>⚖️ ${msg.comparisonResult}</h6>
        
        <div class="comparison-grid">
          <div class="offer-card ${result.comparison.winner === 'A' ? 'winner' : ''}">
            <h6>🅰️ ${msg.offer} A</h6>
            <div class="offer-details">
              <div>${msg.originalPrice}: ${formatCurrency(result.offerA.original)}</div>
              <div>${msg.discountPercent}: ${result.offerA.discount}%</div>
              <div class="final-price">${msg.finalPrice}: ${formatCurrency(result.offerA.final)}</div>
              <div class="savings">${msg.youSave}: ${formatCurrency(result.offerA.savings)}</div>
            </div>
          </div>
          
          <div class="offer-card ${result.comparison.winner === 'B' ? 'winner' : ''}">
            <h6>🅱️ ${msg.offer} B</h6>
            <div class="offer-details">
              <div>${msg.originalPrice}: ${formatCurrency(result.offerB.original)}</div>
              <div>${msg.discountPercent}: ${result.offerB.discount}%</div>
              <div class="final-price">${msg.finalPrice}: ${formatCurrency(result.offerB.final)}</div>
              <div class="savings">${msg.youSave}: ${formatCurrency(result.offerB.savings)}</div>
            </div>
          </div>
        </div>
        
        <div class="comparison-result">
          <div class="big-number">
            ${result.comparison.winner === 'tie' ? '🤝' : result.comparison.winner === 'A' ? '🥇 A' : '🥇 B'}
          </div>
          <div class="comparison-message">${result.comparison.message}</div>
        </div>
      </div>
    `;

    document.getElementById('discount-result').innerHTML = html;
  }

  // Create discount chart
  function createDiscountChart(result) {
    // This would require Chart.js - simplified version for now
    const chartContainer = document.createElement('div');
    chartContainer.className = 'discount-chart';
    chartContainer.innerHTML = `
      <div class="chart-title">📊 ${msg.priceBreakdown}</div>
      <div class="visual-breakdown">
        <div class="bar-container">
          <div class="bar-segment original" style="width: 100%">
            ${msg.originalPrice}: ${formatCurrency(result.originalPrice)}
          </div>
          <div class="bar-segment discount" style="width: ${(result.discountAmount/result.originalPrice)*100}%">
            ${msg.discountAmount}: ${formatCurrency(result.discountAmount)}
          </div>
          <div class="bar-segment final" style="width: ${(result.finalPrice/result.originalPrice)*100}%">
            ${msg.finalPrice}: ${formatCurrency(result.finalPrice)}
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('discount-result').appendChild(chartContainer);
  }

  // Helper functions
  function formatCurrency(amount) {
    return `${amount.toFixed(2)} ${msg.currency}`;
  }

  function showError(message) {
    document.getElementById('discount-result').innerHTML = `
      <div class="insight-card warning">
        <h6>⚠️ ${message}</h6>
      </div>
    `;
  }

  // Initialize with default calculation
  if (basicForm) {
    setTimeout(() => basicForm.dispatchEvent(new Event('submit')), 100);
  }
});