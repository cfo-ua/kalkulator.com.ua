document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('money-weight-form');
  const result = document.getElementById('money-weight-result');
  const currencySelect = document.getElementById('currency');
  const denominationSelect = document.getElementById('denomination');
  
  // Currency data with denominations and weights (in grams)
  const currencyData = {
    USD: {
      name: 'Долар США',
      symbol: '$',
      denominations: [1, 2, 5, 10, 20, 50, 100],
      weight: 1.0, // All USD bills weigh the same
      colors: ['#85bb65', '#85bb65', '#85bb65', '#85bb65', '#85bb65', '#85bb65', '#85bb65']
    },
    EUR: {
      name: 'Євро',
      symbol: '€',
      denominations: [5, 10, 20, 50, 100, 200, 500],
      weights: [0.63, 0.72, 0.81, 0.90, 0.99, 1.07, 1.02], // Different weights for each denomination
      colors: ['#808080', '#ff6b6b', '#4ecdc4', '#ffbe0b', '#95e1d3', '#f38ba8', '#c8a2c8']
    },
    UAH: {
      name: 'Українська гривня',
      symbol: '₴',
      denominations: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
      weights: [0.73, 0.75, 0.78, 0.82, 0.86, 0.90, 0.94, 0.98, 1.02, 1.05],
      colors: ['#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f1faee', '#e76f51', '#2a9d8f', '#264653', '#e9c46a', '#f4a261']
    },
    GBP: {
      name: 'Фунт стерлінгів',
      symbol: '£',
      denominations: [5, 10, 20, 50],
      weights: [0.73, 0.85, 0.91, 0.94],
      colors: ['#007acc', '#ff6600', '#800080', '#ff0000']
    },
    CAD: {
      name: 'Канадський долар',
      symbol: 'C$',
      denominations: [5, 10, 20, 50, 100],
      weight: 0.93,
      colors: ['#4169e1', '#8a2be2', '#dc143c', '#ff8c00', '#228b22']
    },
    AUD: {
      name: 'Австралійський долар',
      symbol: 'A$',
      denominations: [5, 10, 20, 50, 100],
      weight: 0.72,
      colors: ['#ff69b4', '#0000ff', '#ff0000', '#ffff00', '#008000']
    },
    CHF: {
      name: 'Швейцарський франк',
      symbol: 'CHF',
      denominations: [10, 20, 50, 100, 200, 1000],
      weights: [0.75, 0.80, 0.85, 0.90, 0.95, 1.10],
      colors: ['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#8b4513', '#800080']
    },
    JPY: {
      name: 'Японська єна',
      symbol: '¥',
      denominations: [1000, 2000, 5000, 10000],
      weight: 1.0,
      colors: ['#0066cc', '#00cc66', '#cc6600', '#cc0066']
    }
  };
  
  // Update denomination options when currency changes
  currencySelect.addEventListener('change', updateDenominations);
  
  function updateDenominations() {
    const currency = currencySelect.value;
    const data = currencyData[currency];
    
    denominationSelect.innerHTML = '<option value="auto">Оптимальний (найменше банкнот)</option>';
    
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
        result.innerHTML = '<div class="error">⚠️ Введіть коректну суму</div>';
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
                <span>${billCount} шт × ${billWeight}г = ${weight.toFixed(2)}г</span>
              </div>
            `;
          }
        });
        
        calculations.push({
          denomination: 'Оптимальний',
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
      const comparisons = [];
      
      if (weightKg < 0.1) {
        comparisons.push('🪶 Легше за пір\'я (5г)');
      } else if (weightKg < 0.5) {
        comparisons.push('📱 Як середній смартфон (200г)');
      } else if (weightKg < 1) {
        comparisons.push('🍎 Як середнє яблуко (150-200г)');
      } else if (weightKg < 5) {
        comparisons.push('📚 Як товста книга (1кг)');
      } else if (weightKg < 10) {
        comparisons.push('🐱 Як маленьке кошеня (2-3кг)');
      } else if (weightKg < 25) {
        comparisons.push('🎒 Як повний рюкзак (15кг)');
      } else if (weightKg < 50) {
        comparisons.push('🧳 Як валіза для відпустки (25кг)');
      } else {
        comparisons.push('🚗 Як невелика автівка');
      }
      
      // Can one person carry it?
      const maxCarryWeight = 20; // kg
      const canCarry = weightKg <= maxCarryWeight;
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>⚖️ Загальна вага</h6>
            <div class="big-number">${weightKg.toFixed(2)}</div>
            <p>кілограмів</p>
          </div>
          
          <div class="insight-card info">
            <h6>🧾 Кількість банкнот</h6>
            <div class="big-number">${calculations[0].billCount.toLocaleString()}</div>
            <p>банкнот</p>
          </div>
          
          <div class="insight-card ${canCarry ? 'success' : 'warning'}">
            <h6>🚶 Можливість перенести</h6>
            <div class="big-number">${canCarry ? '✅' : '❌'}</div>
            <p>${canCarry ? 'Можна перенести' : 'Занадто важко'}</p>
          </div>
        </div>
        
        ${calculations[0].breakdown ? `
          <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
            <h4>💰 Розподіл за номіналами:</h4>
            ${calculations[0].breakdown}
          </div>
        ` : ''}
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%); border-radius: 12px;">
          <h4>📊 Деталі розрахунку:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            <li><strong>Валюта:</strong> ${data.name}</li>
            <li><strong>Сума:</strong> ${data.symbol}${amount.toLocaleString()}</li>
            <li><strong>Номінал:</strong> ${calculations[0].denomination}</li>
            <li><strong>Стан банкнот:</strong> ${condition === 'new' ? 'Нові' : condition === 'good' ? 'Хороший' : condition === 'used' ? 'Зношені' : 'Дуже зношені'} (${(conditionMultiplier * 100)}%)</li>
            ${calculations[0].actualAmount ? `<li><strong>Фактична сума:</strong> ${data.symbol}${calculations[0].actualAmount.toLocaleString()} (+${data.symbol}${calculations[0].overAmount})</li>` : ''}
          </ul>
          
          <h4>🔍 Цікаві порівняння:</h4>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            <li>${comparisons[0]}</li>
            <li>📦 ${Math.ceil(weightKg / 25)} стандартних посилок (25кг кожна)</li>
            <li>💪 ${canCarry ? 'Одна людина може перенести' : `Потрібно ${Math.ceil(weightKg / maxCarryWeight)} людей для перенесення`}</li>
            <li>✈️ ${weightKg > 23 ? 'Перевищує ліміт ручної поклажі' : 'Поміститься в ручну поклажу'}</li>
          </ul>
        </div>
      `;
    });
  }
});