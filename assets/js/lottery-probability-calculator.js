document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('lottery-form');
  const result = document.getElementById('lottery-result');
  const hasBonusCheckbox = form['has-bonus'];
  const bonusSection = document.getElementById('bonus-section');
  const bonusTotalSection = document.getElementById('bonus-total-section');

  // Show/hide bonus sections
  hasBonusCheckbox.addEventListener('change', function() {
    if (this.checked) {
      bonusSection.style.display = 'block';
      bonusTotalSection.style.display = 'block';
    } else {
      bonusSection.style.display = 'none';
      bonusTotalSection.style.display = 'none';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const lotteryName = form['lottery-name'].value.trim() || 'Ця лотерея';
    const mainPick = parseInt(form['main-pick'].value);
    const mainTotal = parseInt(form['main-total'].value);
    const hasBonus = form['has-bonus'].checked;
    const bonusPick = parseInt(form['bonus-pick'].value) || 1;
    const bonusTotal = parseInt(form['bonus-total'].value) || 1;
    const ticketCost = parseFloat(form['ticket-cost'].value) || 0;

    // Validation
    if (!mainPick || !mainTotal || mainPick > mainTotal) {
      result.innerHTML = '<p style="color:red;">Будь ласка, введіть правильні значення основних номерів. Номерів для вибору має бути менше або дорівнювати загальній кількості номерів.</p>';
      return;
    }

    if (hasBonus && (bonusPick > bonusTotal)) {
      result.innerHTML = '<p style="color:red;">Бонусних номерів для вибору має бути менше або дорівнювати загальній кількості бонусних номерів.</p>';
      return;
    }

    // Calculate combinations using the combination formula: C(n,r) = n! / (r! * (n-r)!)
    function factorial(n) {
      if (n <= 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }

    function combination(n, r) {
      if (r > n) return 0;
      if (r === 0 || r === n) return 1;
      
      // Optimize for large numbers by using the smaller value
      r = Math.min(r, n - r);
      
      let result = 1;
      for (let i = 0; i < r; i++) {
        result = result * (n - i) / (i + 1);
      }
      return Math.round(result);
    }

    // Calculate main number combinations
    const mainCombinations = combination(mainTotal, mainPick);
    
    // Calculate total combinations (including bonus if applicable)
    const totalCombinations = hasBonus ? mainCombinations * bonusTotal : mainCombinations;
    
    // Calculate probability as percentage
    const probability = (1 / totalCombinations) * 100;
    
    // Format large numbers
    const formatLargeNumber = (num) => {
      if (num < 1000) return num.toString();
      if (num < 1000000) return (num / 1000).toFixed(1) + 'тис';
      if (num < 1000000000) return (num / 1000000).toFixed(1) + 'млн';
      return (num / 1000000000).toFixed(1) + 'млрд';
    };

    const formatExact = (num) => num.toLocaleString('uk-UA');

    // Probability comparisons (adapted for Ukrainian context)
    const getComparisons = (odds) => {
      const comparisons = [
        { event: 'Бути вдареним блискавкою протягом життя', odds: 15300, emoji: '⚡' },
        { event: 'Загинути в автокатастрофі цього року', odds: 8096, emoji: '🚗' },
        { event: 'Загинути в авіакатастрофі', odds: 11000000, emoji: '✈️' },
        { event: 'Стати професійним спортсменом', odds: 22000, emoji: '🏆' },
        { event: 'Зустріти мільйонера', odds: 215, emoji: '💰' },
        { event: 'Знайти чотирилисник', odds: 10000, emoji: '🍀' },
        { event: 'Зробити лунку в одну (аматор)', odds: 12500, emoji: '⛳' },
        { event: 'Отримати роял-флеш у покері', odds: 649740, emoji: '🃏' },
        { event: 'Бути вдареним блискавкою цього року', odds: 1000000, emoji: '⚡' },
        { event: 'Стати кіностаром', odds: 1500000, emoji: '🎬' }
      ];

      return comparisons
        .filter(comp => comp.odds < odds)
        .sort((a, b) => b.odds - a.odds)
        .slice(0, 5)
        .map(comp => ({
          ...comp,
          multiplier: (odds / comp.odds).toFixed(0)
        }));
    };

    // Calculate expected value if ticket cost is provided
    let expectedValueText = '';
    if (ticketCost > 0) {
      // Assuming average jackpot is about 50x ticket cost for major lotteries
      const estimatedJackpot = ticketCost * 50 * 1000000; // Very rough estimate
      const expectedValue = (estimatedJackpot / totalCombinations) - ticketCost;
      const returnPercentage = ((expectedValue + ticketCost) / ticketCost) * 100;
      
      expectedValueText = `
        <div class="insight-card" style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); padding: 15px; border-radius: 10px; margin: 15px 0; border: 2px solid #f44336;">
          <h4 style="color: #c62828; margin-top: 0;">💸 Аналіз очікуваної вартості</h4>
          <p><strong>Вартість квитка:</strong> ₴${ticketCost.toFixed(0)}</p>
          <p><strong>Очікувана прибутковість:</strong> ₴${(expectedValue + ticketCost).toFixed(6)} за квиток</p>
          <p><strong>Очікувані втрати:</strong> ₴${(-expectedValue).toFixed(0)} за квиток (${(100 - returnPercentage).toFixed(1)}%)</p>
          <p style="font-style: italic; color: #666; margin: 10px 0 0 0;">
            Примітка: Це припускає середні розміри джекпотів. Фактична очікувана вартість варіюється залежно від поточного джекпоту.
          </p>
        </div>
      `;
    }

    const comparisons = getComparisons(totalCombinations);

    result.innerHTML = `
      <div class="insight-card" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #2196f3;">
        <h3 style="color: #1565c0; margin-top: 0; text-align: center;">🎲 Результати ймовірності ${lotteryName}</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;">
            <strong>Формат:</strong> Вибрати ${mainPick} з ${mainTotal}${hasBonus ? ` + ${bonusPick} з ${bonusTotal}` : ''}
          </p>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>🎯 Ваші шанси</h6>
            <div class="big-number">1 на ${formatLargeNumber(totalCombinations)}</div>
            <p>Точно: 1 на ${formatExact(totalCombinations)}</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📊 Ймовірність</h6>
            <div class="big-number">${probability < 0.001 ? probability.toExponential(2) : probability.toFixed(6)}%</div>
            <p>Шанс виграти на одному квитку</p>
          </div>
          
          <div class="insight-card" style="border-color: #ff5722; background: linear-gradient(135deg, #fff3e0 0%, #ffe0d1 100%);">
            <h6>🔢 Загальні комбінації</h6>
            <div class="big-number" style="color: #ff5722;">${formatLargeNumber(totalCombinations)}</div>
            <p>Можливі комбінації номерів</p>
          </div>
        </div>

        ${expectedValueText}

        <div class="insight-card" style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #9c27b0;">
          <h4 style="color: #6a1b9a; margin-top: 0; text-align: center;">⏰ Часова перспектива</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #6a1b9a; margin: 0 0 10px 0;">Гра щотижня</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">
                ${formatLargeNumber(Math.round(totalCombinations / 52))} років
              </div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Очікуваний час очікування</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #6a1b9a; margin: 0 0 10px 0;">Гра щодня</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">
                ${formatLargeNumber(Math.round(totalCombinations / 365))} років
              </div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Очікуваний час очікування</p>
            </div>
          </div>
        </div>

        ${comparisons.length > 0 ? `
        <div class="insight-card" style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">📈 Більш імовірно, що ви...</h4>
          <div style="display: grid; gap: 10px;">
            ${comparisons.map(comp => `
              <div style="background: white; padding: 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">${comp.emoji}</span>
                <div style="flex: 1;">
                  <strong>${comp.event}</strong><br>
                  <span style="color: #666; font-size: 0.9rem;">${comp.multiplier}× більш імовірно (1 на ${formatExact(comp.odds)})</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="insight-card" style="background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffa726;">
          <h4 style="color: #e65100; margin-top: 0; text-align: center;">💡 Перевірка реальності</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #e65100; margin-top: 0;">🎟️ Якщо ви купили 100 квитків:</h6>
              <p style="margin: 5px 0; font-size: 1.1rem;"><strong>Шанси:</strong> 100 на ${formatExact(totalCombinations)}</p>
              <p style="margin: 5px 0; color: #666;">Все ще ${probability < 0.1 ? (probability * 100).toExponential(2) : (probability * 100).toFixed(4)}% шанс</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #e65100; margin-top: 0;">🔢 Математична істина:</h6>
              <p style="margin: 5px 0;">Кожна комбінація має <strong>абсолютно однакові шанси</strong></p>
              <p style="margin: 5px 0; color: #666;">1-2-3-4-5 = випадковий швидкий вибір</p>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            🎲 <strong>Пам'ятайте:</strong> Лотерея — це розвага, а не інвестиція. Грайте відповідально та ніколи не витрачайте гроші, які не можете дозволити собі втратити!
          </p>
        </div>
      </div>
    `;
  });
});