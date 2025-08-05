document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('money-weight-form');
  const result = document.getElementById('money-weight-result');
  const currencySelect = document.getElementById('currency');
  const denominationSelect = document.getElementById('denomination');
  
  // Currency data with denominations and weights (in grams)
  const currencyData = {
    USD: {
      name: 'US Dollar',
      symbol: '$',
      denominations: [1, 2, 5, 10, 20, 50, 100],
      weight: 1.0, // All USD bills weigh the same
      colors: ['#85bb65', '#85bb65', '#85bb65', '#85bb65', '#85bb65', '#85bb65', '#85bb65']
    },
    EUR: {
      name: 'Euro',
      symbol: '€',
      denominations: [5, 10, 20, 50, 100, 200, 500],
      weights: [0.63, 0.72, 0.81, 0.90, 0.99, 1.07, 1.02], // Different weights for each denomination
      colors: ['#808080', '#ff6b6b', '#4ecdc4', '#ffbe0b', '#95e1d3', '#f38ba8', '#c8a2c8']
    },
    GBP: {
      name: 'British Pound',
      symbol: '£',
      denominations: [5, 10, 20, 50],
      weights: [0.73, 0.85, 0.91, 0.94],
      colors: ['#007acc', '#ff6600', '#800080', '#ff0000']
    },
    CAD: {
      name: 'Canadian Dollar',
      symbol: 'C$',
      denominations: [5, 10, 20, 50, 100],
      weight: 0.93,
      colors: ['#4169e1', '#8a2be2', '#dc143c', '#ff8c00', '#228b22']
    },
    AUD: {
      name: 'Australian Dollar',
      symbol: 'A$',
      denominations: [5, 10, 20, 50, 100],
      weight: 0.72,
      colors: ['#ff69b4', '#0000ff', '#ff0000', '#ffff00', '#008000']
    },
    CHF: {
      name: 'Swiss Franc',
      symbol: 'CHF',
      denominations: [10, 20, 50, 100, 200, 1000],
      weights: [0.75, 0.80, 0.85, 0.90, 0.95, 1.10],
      colors: ['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#8b4513', '#800080']
    },
    JPY: {
      name: 'Japanese Yen',
      symbol: '¥',
      denominations: [1000, 2000, 5000, 10000],
      weight: 1.0,
      colors: ['#0066cc', '#00cc66', '#cc6600', '#cc0066']
    },
    UAH: {
      name: 'Ukrainian Hryvnia',
      symbol: '₴',
      denominations: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
      weights: [0.73, 0.75, 0.78, 0.82, 0.86, 0.90, 0.94, 0.98, 1.02, 1.05],
      colors: ['#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f1faee', '#e76f51', '#2a9d8f', '#264653', '#e9c46a', '#f4a261']
    }
  };
  
  // Update denomination options when currency changes
  currencySelect.addEventListener('change', updateDenominations);
  
  function updateDenominations() {
    const currency = currencySelect.value;
    const data = currencyData[currency];
    
    denominationSelect.innerHTML = '<option value="auto">Optimal (fewest banknotes)</option>';
    
    data.denominations.forEach(denom => {
      const option = document.createElement('option');
      option.value = denom;
      option.textContent = `${data.symbol}${denom}`;
      denominationSelect.appendChild(option);
    });
  }
  
  // Initialize denominations
  updateDenominations();
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const amount = parseFloat(document.getElementById('amount').value);
      const currency = currencySelect.value;
      const denominationValue = document.getElementById('denomination').value;
      const condition = document.getElementById('condition').value;
      
      if (amount <= 0) {
        result.innerHTML = '<div class="error">⚠️ Please enter a valid amount</div>';
        return;
      }
      
      const data = currencyData[currency];
      let calculations = [];
      
      // Condition multiplier
      const conditionMultipliers = {
        new: 1.0,
        good: 0.9,
        used: 0.8,
        poor: 0.7
      };
      const conditionMultiplier = conditionMultipliers[condition];
      
      if (denominationValue === 'auto') {
        // Calculate for optimal denomination mix (fewest bills)
        let remainingAmount = amount;
        let totalWeight = 0;
        let totalBills = 0;
        let breakdownHtml = '';
        
        // Start from highest denomination
        const sortedDenoms = [...data.denominations].sort((a, b) => b - a);
        
        sortedDenoms.forEach((denom, index) => {
          if (remainingAmount >= denom) {
            const billCount = Math.floor(remainingAmount / denom);
            const billWeight = data.weights ? data.weights[data.denominations.indexOf(denom)] : data.weight;
            const weight = billCount * billWeight * conditionMultiplier;
            
            totalWeight += weight;
            totalBills += billCount;
            remainingAmount -= billCount * denom;
            
            const color = data.colors ? data.colors[data.denominations.indexOf(denom)] : '#85bb65';
            breakdownHtml += `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin: 4px 0; background: ${color}20; border-left: 4px solid ${color}; border-radius: 4px;">
                <span><strong>${data.symbol}${denom}</strong></span>
                <span>${billCount} pcs × ${billWeight}g = ${weight.toFixed(2)}g</span>
              </div>
            `;
          }
        });
        
        calculations.push({
          denomination: 'Optimal',
          billCount: totalBills,
          totalWeight: totalWeight,
          breakdown: breakdownHtml
        });
      } else {
        // Calculate for specific denomination
        const denom = parseFloat(denominationValue);
        const billCount = Math.ceil(amount / denom);
        const actualAmount = billCount * denom;
        const overAmount = actualAmount - amount;
        
        const denomIndex = data.denominations.indexOf(denom);
        const billWeight = data.weights ? data.weights[denomIndex] : data.weight;
        const totalWeight = billCount * billWeight * conditionMultiplier;
        
        calculations.push({
          denomination: `${data.symbol}${denom}`,
          billCount: billCount,
          totalWeight: totalWeight,
          actualAmount: actualAmount,
          overAmount: overAmount
        });
      }
      
      // Generate interesting comparisons
      const weightKg = calculations[0].totalWeight / 1000;
      const weightLbs = weightKg * 2.20462;
      const comparisons = [];
      
      if (weightKg < 0.1) {
        comparisons.push('🪶 Lighter than a feather (5g)');
      } else if (weightKg < 0.5) {
        comparisons.push('📱 Like an average smartphone (7oz)');
      } else if (weightKg < 1) {
        comparisons.push('🍎 Like an average apple (5-7oz)');
      } else if (weightKg < 5) {
        comparisons.push('📚 Like a thick book (2lbs)');
      } else if (weightKg < 10) {
        comparisons.push('🐱 Like a small kitten (5-7lbs)');
      } else if (weightKg < 25) {
        comparisons.push('🎒 Like a full backpack (33lbs)');
      } else if (weightKg < 50) {
        comparisons.push('🧳 Like a vacation suitcase (55lbs)');
      } else {
        comparisons.push('🚗 Like a small car');
      }
      
      // Can one person carry it?
      const maxCarryWeight = 20; // kg (44 lbs)
      const canCarry = weightKg <= maxCarryWeight;
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>⚖️ Total Weight</h6>
            <div class="big-number">${weightLbs.toFixed(1)}</div>
            <p>lbs (${weightKg.toFixed(2)} kg)</p>
          </div>
          
          <div class="insight-card info">
            <h6>🧾 Number of Banknotes</h6>
            <div class="big-number">${calculations[0].billCount.toLocaleString()}</div>
            <p>banknotes</p>
          </div>
          
          <div class="insight-card ${canCarry ? 'success' : 'warning'}">
            <h6>🚶 Portability</h6>
            <div class="big-number">${canCarry ? '✅' : '❌'}</div>
            <p>${canCarry ? 'Can carry' : 'Too heavy'}</p>
          </div>
        </div>
        
        ${calculations[0].breakdown ? `
          <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
            <h4>💰 Breakdown by Denomination:</h4>
            ${calculations[0].breakdown}
          </div>
        ` : ''}
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%); border-radius: 12px;">
          <h4>📊 Calculation Details:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            <li><strong>Currency:</strong> ${data.name}</li>
            <li><strong>Amount:</strong> ${data.symbol}${amount.toLocaleString()}</li>
            <li><strong>Denomination:</strong> ${calculations[0].denomination}</li>
            <li><strong>Banknote condition:</strong> ${condition === 'new' ? 'New' : condition === 'good' ? 'Good' : condition === 'used' ? 'Used' : 'Very worn'} (${(conditionMultiplier * 100)}%)</li>
            ${calculations[0].actualAmount ? `<li><strong>Actual amount:</strong> ${data.symbol}${calculations[0].actualAmount.toLocaleString()} (+${data.symbol}${calculations[0].overAmount})</li>` : ''}
          </ul>
          
          <h4>🔍 Interesting Comparisons:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            <li>${comparisons[0]}</li>
            <li>📦 ${Math.ceil(weightKg / 25)} standard packages (55lbs each)</li>
            <li>💪 ${canCarry ? 'One person can carry it' : `Requires ${Math.ceil(weightKg / maxCarryWeight)} people to carry`}</li>
            <li>✈️ ${weightLbs > 50 ? 'Exceeds carry-on luggage limit' : 'Fits in carry-on luggage'}</li>
          </ul>
        </div>
      `;
    });
  }
});