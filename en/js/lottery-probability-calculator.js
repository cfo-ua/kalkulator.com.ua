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

    const lotteryName = form['lottery-name'].value.trim() || 'This Lottery';
    const mainPick = parseInt(form['main-pick'].value);
    const mainTotal = parseInt(form['main-total'].value);
    const hasBonus = form['has-bonus'].checked;
    const bonusPick = parseInt(form['bonus-pick'].value) || 1;
    const bonusTotal = parseInt(form['bonus-total'].value) || 1;
    const ticketCost = parseFloat(form['ticket-cost'].value) || 0;

    // Validation
    if (!mainPick || !mainTotal || mainPick > mainTotal) {
      result.innerHTML = '<p style="color:red;">Please enter valid main number values. Numbers to pick must be less than or equal to total numbers.</p>';
      return;
    }

    if (hasBonus && (bonusPick > bonusTotal)) {
      result.innerHTML = '<p style="color:red;">Bonus numbers to pick must be less than or equal to total bonus numbers.</p>';
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
      if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
      if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
      return (num / 1000000000).toFixed(1) + 'B';
    };

    const formatExact = (num) => num.toLocaleString('en-US');

    // Probability comparisons
    const getComparisons = (odds) => {
      const comparisons = [
        { event: 'Being struck by lightning in a lifetime', odds: 15300, emoji: '⚡' },
        { event: 'Dying in a car accident this year', odds: 8096, emoji: '🚗' },
        { event: 'Dying in a plane crash', odds: 11000000, emoji: '✈️' },
        { event: 'Becoming a professional athlete', odds: 22000, emoji: '🏆' },
        { event: 'Dating a millionaire', odds: 215, emoji: '💰' },
        { event: 'Finding a four-leaf clover', odds: 10000, emoji: '🍀' },
        { event: 'Getting a hole-in-one (amateur)', odds: 12500, emoji: '⛳' },
        { event: 'Being dealt a royal flush in poker', odds: 649740, emoji: '🃏' },
        { event: 'Getting struck by lightning this year', odds: 1000000, emoji: '⚡' },
        { event: 'Becoming a movie star', odds: 1500000, emoji: '🎬' }
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
        <div style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); padding: 15px; border-radius: 10px; margin: 15px 0; border: 2px solid #f44336;">
          <h4 style="color: #c62828; margin-top: 0;">💸 Expected Value Analysis</h4>
          <p><strong>Ticket Cost:</strong> $${ticketCost.toFixed(2)}</p>
          <p><strong>Expected Return:</strong> $${(expectedValue + ticketCost).toFixed(6)} per ticket</p>
          <p><strong>Expected Loss:</strong> $${(-expectedValue).toFixed(2)} per ticket (${(100 - returnPercentage).toFixed(1)}%)</p>
          <p style="font-style: italic; color: #666; margin: 10px 0 0 0;">
            Note: This assumes average jackpot sizes. Actual expected value varies with current jackpot.
          </p>
        </div>
      `;
    }

    const comparisons = getComparisons(totalCombinations);

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #2196f3;">
        <h3 style="color: #1565c0; margin-top: 0; text-align: center;">🎲 ${lotteryName} Probability Results</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;">
            <strong>Format:</strong> Pick ${mainPick} from ${mainTotal}${hasBonus ? ` + ${bonusPick} from ${bonusTotal}` : ''}
          </p>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>🎯 Your Odds</h6>
            <div class="big-number">1 in ${formatLargeNumber(totalCombinations)}</div>
            <p>Exactly: 1 in ${formatExact(totalCombinations)}</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📊 Probability</h6>
            <div class="big-number">${probability < 0.001 ? probability.toExponential(2) : probability.toFixed(6)}%</div>
            <p>Chance of winning on one ticket</p>
          </div>
          
          <div class="insight-card" style="border-color: #ff5722; background: linear-gradient(135deg, #fff3e0 0%, #ffe0d1 100%);">
            <h6>🔢 Total Combinations</h6>
            <div class="big-number" style="color: #ff5722;">${formatLargeNumber(totalCombinations)}</div>
            <p>Possible number combinations</p>
          </div>
        </div>

        ${expectedValueText}

        <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #9c27b0;">
          <h4 style="color: #6a1b9a; margin-top: 0; text-align: center;">⏰ Time Perspective</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #6a1b9a; margin: 0 0 10px 0;">Playing Weekly</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">
                ${formatLargeNumber(Math.round(totalCombinations / 52))} years
              </div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Expected wait time</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #6a1b9a; margin: 0 0 10px 0;">Playing Daily</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">
                ${formatLargeNumber(Math.round(totalCombinations / 365))} years
              </div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Expected wait time</p>
            </div>
          </div>
        </div>

        ${comparisons.length > 0 ? `
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">📈 You're More Likely To...</h4>
          <div style="display: grid; gap: 10px;">
            ${comparisons.map(comp => `
              <div style="background: white; padding: 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">${comp.emoji}</span>
                <div style="flex: 1;">
                  <strong>${comp.event}</strong><br>
                  <span style="color: #666; font-size: 0.9rem;">${comp.multiplier}× more likely (1 in ${formatExact(comp.odds)})</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffa726;">
          <h4 style="color: #e65100; margin-top: 0; text-align: center;">💡 Reality Check</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #e65100; margin-top: 0;">🎟️ If you bought 100 tickets:</h6>
              <p style="margin: 5px 0; font-size: 1.1rem;"><strong>Odds:</strong> 100 in ${formatExact(totalCombinations)}</p>
              <p style="margin: 5px 0; color: #666;">Still a ${probability < 0.1 ? (probability * 100).toExponential(2) : (probability * 100).toFixed(4)}% chance</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #e65100; margin-top: 0;">🔢 Mathematical Truth:</h6>
              <p style="margin: 5px 0;">Every combination has <strong>exactly the same odds</strong></p>
              <p style="margin: 5px 0; color: #666;">1-2-3-4-5 = random quick pick</p>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            🎲 <strong>Remember:</strong> The lottery is entertainment, not an investment. Play responsibly and never spend money you can't afford to lose!
          </p>
        </div>
      </div>
    `;
  });
});