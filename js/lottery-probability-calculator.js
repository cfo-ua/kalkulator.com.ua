document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('lottery-form');
  const result = document.getElementById('lottery-result');
  const hasBonusCheckbox = form?.['has-bonus'];
  const bonusSection = document.getElementById('bonus-section');
  const bonusTotalSection = document.getElementById('bonus-total-section');

  // Show/hide bonus sections
  if (hasBonusCheckbox) {
    hasBonusCheckbox.addEventListener('change', function() {
      if (this.checked) {
        if (bonusSection) bonusSection.style.display = 'block';
        if (bonusTotalSection) bonusTotalSection.style.display = 'block';
      } else {
        if (bonusSection) bonusSection.style.display = 'none';
        if (bonusTotalSection) bonusTotalSection.style.display = 'none';
      }
    });
  }

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const lotteryName = form['lottery-name'].value.trim() || 'Ця лотерея';
      const mainPick = parseInt(form['main-pick'].value);
      const mainTotal = parseInt(form['main-total'].value);
      const hasBonus = form['has-bonus']?.checked || false;
      const bonusPick = parseInt(form['bonus-pick']?.value) || 1;
      const bonusTotal = parseInt(form['bonus-total']?.value) || 1;
      const ticketCost = parseFloat(form['ticket-cost']?.value) || 0;

      // Validation
      if (!mainPick || !mainTotal || mainPick > mainTotal) {
        result.innerHTML = '<div class="error">Будь ласка, введіть правильні значення основних чисел. Кількість чисел для вибору повинна бути менше або дорівнювати загальній кількості чисел.</div>';
        return;
      }

      if (hasBonus && (bonusPick > bonusTotal)) {
        result.innerHTML = '<div class="error">Кількість бонусних чисел для вибору повинна бути менше або дорівнювати загальній кількості бонусних чисел.</div>';
        return;
      }

      // Calculate combinations using the combination formula: C(n,r) = n! / (r! * (n-r)!)
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
        if (num < 1000000) return (num / 1000).toFixed(1) + 'тис.';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'млн';
        return (num / 1000000000).toFixed(1) + 'млрд';
      };

      const formatExact = (num) => num.toLocaleString('uk-UA');

      // Probability comparisons
      const getComparisons = (odds) => {
        const comparisons = [
          { event: 'Бути вдареним блискавкою протягом життя', odds: 15300, emoji: '⚡' },
          { event: 'Загинути в автокатастрофі цього року', odds: 8096, emoji: '🚗' },
          { event: 'Загинути в авіакатастрофі', odds: 11000000, emoji: '✈️' },
          { event: 'Стати професійним спортсменом', odds: 22000, emoji: '🏆' },
          { event: 'Зустрічатися з мільйонером', odds: 215, emoji: '💰' },
          { event: 'Знайти чотирилисник', odds: 10000, emoji: '🍀' },
          { event: 'Зробити hole-in-one (аматор)', odds: 12500, emoji: '⛳' },
          { event: 'Отримати роял-флеш у покері', odds: 649740, emoji: '🃏' },
          { event: 'Бути вдареним блискавкою цього року', odds: 1000000, emoji: '⚡' },
          { event: 'Стати кінозіркою', odds: 1500000, emoji: '🎬' }
        ];

        return comparisons
          .filter(comp => comp.odds < odds)
          .sort((a, b) => Math.abs(a.odds - odds) - Math.abs(b.odds - odds))
          .slice(0, 3);
      };

      const comparisons = getComparisons(totalCombinations);

      // Time calculations
      const getTimeToWin = (combinations) => {
        const oncePerWeek = combinations / 52;
        const oncePerDay = combinations / 365;
        
        if (oncePerWeek < 1) return "менше року (раз на тиждень)";
        if (oncePerWeek < 1000) return `${Math.round(oncePerWeek)} років (раз на тиждень)`;
        if (oncePerWeek < 1000000) return `${(oncePerWeek / 1000).toFixed(1)} тис. років (раз на тиждень)`;
        return `${(oncePerWeek / 1000000).toFixed(1)} млн років (раз на тиждень)`;
      };

      // Cost analysis
      const getCostAnalysis = (cost, combinations) => {
        if (cost <= 0) return null;
        
        const totalCost = cost * combinations;
        const formattedCost = totalCost.toLocaleString('uk-UA', {
          style: 'currency',
          currency: 'UAH'
        });
        
        return {
          totalCost: formattedCost,
          perYear: (cost * 52).toLocaleString('uk-UA', {
            style: 'currency',
            currency: 'UAH'
          })
        };
      };

      const costAnalysis = getCostAnalysis(ticketCost, totalCombinations);

      // Generate visual representation
      const getVisualRepresentation = (prob) => {
        if (prob >= 1) return "█".repeat(10); // 100%
        if (prob >= 0.1) return "█".repeat(Math.round(prob * 10));
        if (prob >= 0.01) return "▓";
        if (prob >= 0.001) return "▒";
        return "░";
      };

      const visual = getVisualRepresentation(probability);

      result.innerHTML = `
        <div class="insight-card">
          <h3 style="text-align: center; margin-bottom: 1.5rem; color: #2c3e50;">
            🎲 Аналіз ймовірності лотереї
          </h3>
          
          <div style="text-align: center; margin: 1rem 0;">
            <h4 style="color: #666; margin-bottom: 0.5rem;">${lotteryName}</h4>
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
              ${mainPick} з ${mainTotal}${hasBonus ? ` + ${bonusPick} бонусне число з ${bonusTotal}` : ''}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
              <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Шанси на виграш</div>
              <div style="font-size: 1.5rem; font-weight: bold; color: #dc3545;">
                1 до ${formatLargeNumber(totalCombinations)}
              </div>
              <div style="font-size: 0.8rem; color: #666;">
                (${formatExact(totalCombinations)})
              </div>
            </div>
            
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 12px;">
              <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Ймовірність</div>
              <div style="font-size: 1.5rem; font-weight: bold; color: #dc3545;">
                ${probability.toExponential(2)}%
              </div>
              <div style="font-size: 0.8rem; color: #666;">
                ${probability < 0.000001 ? 'Менше 0.000001%' : probability.toFixed(6) + '%'}
              </div>
            </div>
          </div>

          <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #856404;">📊 Візуальне представлення ймовірності</h4>
            <div style="font-family: monospace; font-size: 1.2rem; background: #fff; padding: 0.5rem; border-radius: 4px;">
              ${visual}
            </div>
            <small style="color: #856404;">
              Кожен квадрат представляє 10% ймовірності. ${probability < 0.1 ? 'Ваша ймовірність настільки мала, що майже не видна.' : ''}
            </small>
          </div>
        </div>

        ${comparisons.length > 0 ? `
          <div class="insight-card">
            <h4 style="margin-bottom: 1rem; color: #495057;">🔍 Порівняння ймовірності</h4>
            <p style="margin-bottom: 1rem; color: #666;">
              Ваші шанси виграти в цю лотерею приблизно такі ж, як:
            </p>
            <div style="display: grid; gap: 0.8rem;">
              ${comparisons.map(comp => `
                <div style="display: flex; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 8px;">
                  <span style="font-size: 1.5rem; margin-right: 0.8rem;">${comp.emoji}</span>
                  <div style="flex: 1;">
                    <div style="font-weight: 500; color: #495057;">${comp.event}</div>
                    <small style="color: #6c757d;">1 до ${formatLargeNumber(comp.odds)}</small>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">⏰ Часові рамки</h4>
          <div style="background: #e9ecef; padding: 1rem; border-radius: 8px;">
            <p style="margin: 0; color: #495057;">
              <strong>Очікуваний час до виграшу:</strong> ${getTimeToWin(totalCombinations)}
            </p>
            <small style="color: #6c757d;">
              Це статистичне очікування, фактичний час може сильно відрізнятися.
            </small>
          </div>
        </div>

        ${costAnalysis ? `
          <div class="insight-card">
            <h4 style="margin-bottom: 1rem; color: #495057;">💰 Аналіз витрат</h4>
            <div style="display: grid; gap: 1rem;">
              <div style="background: #fff3cd; padding: 1rem; border-radius: 8px;">
                <strong style="color: #856404;">Теоретичні витрати для гарантованого виграшу:</strong><br>
                <span style="font-size: 1.2rem; color: #dc3545;">${costAnalysis.totalCost}</span><br>
                <small style="color: #856404;">
                  (якщо купувати всі можливі комбінації)
                </small>
              </div>
              <div style="background: #d1ecf1; padding: 1rem; border-radius: 8px;">
                <strong style="color: #0c5460;">Витрати на рік (1 квиток на тиждень):</strong><br>
                <span style="color: #0c5460;">${costAnalysis.perYear}</span>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="insight-card">
          <h4 style="margin-bottom: 1rem; color: #495057;">💡 Поради та рекомендації</h4>
          <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
              <strong style="color: #155724;">✓ Пам'ятайте про розваги</strong><br>
              <small style="color: #155724;">
                Лотереї краще сприймати як розваги, а не як інвестиційну стратегію.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <strong style="color: #856404;">⚠️ Грайте відповідально</strong><br>
              <small style="color: #856404;">
                Витрачайте лише ті гроші, які можете дозволити собі втратити.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #d1ecf1; border-radius: 8px; border-left: 4px solid #17a2b8;">
              <strong style="color: #0c5460;">📊 Математична реальність</strong><br>
              <small style="color: #0c5460;">
                Кожен розіграш є незалежним, попередні результати не впливають на майбутні.
              </small>
            </div>
            
            <div style="padding: 1rem; background: #f8d7da; border-radius: 8px; border-left: 4px solid #dc3545;">
              <strong style="color: #721c24;">⛔ Не розраховуйте на виграш</strong><br>
              <small style="color: #721c24;">
                Ніколи не покладайтеся на лотерею як на джерело доходу або вирішення фінансових проблем.
              </small>
            </div>
          </div>
        </div>

        <div class="insight-card" style="background: #f8f9fa; border-left: 4px solid #6c757d;">
          <p style="margin: 0; font-size: 0.9rem; color: #6c757d; font-style: italic;">
            <strong>Примітка:</strong> Ці розрахунки базуються на математичній ймовірності і призначені лише для інформаційних цілей. 
            Фактичні результати лотереї є повністю випадковими. Завжди грайте відповідально та в межах своїх можливостей.
          </p>
        </div>
      `;
    });
  }
});