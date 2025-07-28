document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bad-habit-form');
  const result = document.getElementById('bad-habit-result');
  const frequencySelect = form.frequency;
  const customFrequencyDiv = document.getElementById('custom-frequency');

  // Show/hide custom frequency input
  frequencySelect.addEventListener('change', function() {
    if (this.value === 'custom') {
      customFrequencyDiv.style.display = 'block';
    } else {
      customFrequencyDiv.style.display = 'none';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const habitName = form['habit-name'].value.trim() || 'Ваша звичка';
    const cost = parseFloat(form.cost.value);
    const frequency = form.frequency.value;
    const customTimes = parseFloat(form['custom-times'].value) || 0;

    // Validation
    if (!cost || cost <= 0) {
      result.innerHTML = '<p style="color:red;">Будь ласка, введіть дійсну суму витрат.</p>';
      return;
    }

    if (!frequency) {
      result.innerHTML = '<p style="color:red;">Будь ласка, виберіть, як часто ви займаєтесь цією звичкою.</p>';
      return;
    }

    if (frequency === 'custom' && (!customTimes || customTimes <= 0)) {
      result.innerHTML = '<p style="color:red;">Будь ласка, введіть, скільки разів на тиждень для власної частоти.</p>';
      return;
    }

    // Calculate times per week based on frequency
    let timesPerWeek;
    switch (frequency) {
      case 'daily':
        timesPerWeek = 7;
        break;
      case 'weekdays':
        timesPerWeek = 5;
        break;
      case 'weekly':
        timesPerWeek = 1;
        break;
      case 'multiple-weekly':
        timesPerWeek = 3; // Default assumption
        break;
      case 'monthly':
        timesPerWeek = 1/4.33; // 1 month ≈ 4.33 weeks
        break;
      case 'custom':
        timesPerWeek = customTimes;
        break;
    }

    // Calculate costs for different periods
    const costPerWeek = cost * timesPerWeek;
    const costPerMonth = costPerWeek * 4.33; // Average weeks per month
    const costPerYear = costPerWeek * 52;
    const costPer10Years = costPerYear * 10;

    // Calculate investment potential (7% annual return)
    const monthlyInvestment = costPerMonth;
    const annualReturn = 0.07;
    const years = 10;
    
    // Future value of annuity formula: PMT * [((1 + r)^n - 1) / r]
    const monthlyReturn = annualReturn / 12;
    const totalMonths = years * 12;
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn));

    // Format currency for Ukrainian
    const formatCurrency = (amount) => amount.toLocaleString('uk-UA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' грн';

    const formatCurrencyDetailed = (amount) => amount.toLocaleString('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' грн';

    // Determine emoji based on cost level
    let emoji = '💸';
    if (costPerYear > 100000) emoji = '🚨';
    else if (costPerYear > 60000) emoji = '⚠️';
    else if (costPerYear > 20000) emoji = '💰';

    // Get frequency description
    let frequencyDesc = '';
    switch (frequency) {
      case 'daily': frequencyDesc = 'щодня'; break;
      case 'weekdays': frequencyDesc = 'в робочі дні'; break;
      case 'weekly': frequencyDesc = 'раз на тиждень'; break;
      case 'multiple-weekly': frequencyDesc = 'кілька разів на тиждень'; break;
      case 'monthly': frequencyDesc = 'раз на місяць'; break;
      case 'custom': frequencyDesc = `${customTimes} разів на тиждень`; break;
    }

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #ffa726;">
        <h3 style="color: #e65100; margin-top: 0; text-align: center;">${emoji} Аналіз вартості: ${habitName}</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;"><strong>Витрачаєте ${formatCurrencyDetailed(cost)} ${frequencyDesc}</strong></p>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📅 Тижнева вартість</h6>
            <div class="big-number">${formatCurrencyDetailed(costPerWeek)}</div>
            <p>${(timesPerWeek).toFixed(1)} разів на тиждень</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📆 Місячна вартість</h6>
            <div class="big-number">${formatCurrency(costPerMonth)}</div>
            <p>Приблизно ${(timesPerWeek * 4.33).toFixed(1)} разів на місяць</p>
          </div>
          
          <div class="insight-card" style="border-color: #ff5722; background: linear-gradient(135deg, #fff3e0 0%, #ffe0d1 100%);">
            <h6>📊 Річна вартість</h6>
            <div class="big-number" style="color: #ff5722;">${formatCurrency(costPerYear)}</div>
            <p>${(timesPerWeek * 52).toFixed(0)} разів на рік</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #9c27b0;">
          <h4 style="color: #6a1b9a; margin-top: 0; text-align: center;">💎 10-річний фінансовий вплив</h4>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #d32f2f; margin: 0 0 10px 0;">Всього витрачено</h6>
              <div style="font-size: 1.8rem; font-weight: bold; color: #d32f2f;">${formatCurrency(costPer10Years)}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">Гроші втрачені назавжди</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #388e3c; margin: 0 0 10px 0;">Якби інвестували</h6>
              <div style="font-size: 1.8rem; font-weight: bold; color: #388e3c;">${formatCurrency(futureValue)}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">При 7% річній прибутковості</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #6a1b9a;">
              💡 Потенційний прибуток від відмови від цієї звички: <span style="color: #388e3c;">${formatCurrency(futureValue - costPer10Years)}</span>
            </p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">🎯 Що ви могли б купити замість цього</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
            ${costPerYear > 60000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>🚗 Вживане авто</strong><br>Перший внесок</div>' : ''}
            ${costPerYear > 40000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>✈️ Відпустка</strong><br>Хороша поїздка за кордон</div>' : ''}
            ${costPerYear > 30000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>💻 Ноутбук</strong><br>Потужний комп\'ютер</div>' : ''}
            ${costPerYear > 20000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>📚 Освіта</strong><br>Онлайн курси</div>' : ''}
            ${costPerYear > 10000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>🏋️ Спортзал</strong><br>Річне членство</div>' : ''}
            <div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>💰 Резервний фонд</strong><br>Фінансова безпека</div>
          </div>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 10px; border: 2px solid #2196f3;">
          <h4 style="color: #1976d2; margin-top: 0; text-align: center;">📈 Аналіз окупності</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; text-align: center;">
            <div>
              <div style="font-weight: bold; color: #1976d2;">На день</div>
              <div style="font-size: 1.2rem; color: #333;">${formatCurrencyDetailed(costPerWeek / 7)}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #1976d2;">На годину</div>
              <div style="font-size: 1.2rem; color: #333;">${formatCurrencyDetailed(costPerWeek / 7 / 24)}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #1976d2;">Робочих годин</div>
              <div style="font-size: 1.2rem; color: #333;">${(costPerYear / (300 * 1760)).toFixed(1)}г</div>
              <div style="font-size: 0.8rem; color: #666;">при 300 грн/год</div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💪 <strong>Пам'ятайте:</strong> Невеликі зміни в щоденних звичках можуть призвести до масштабних фінансових покращень з часом!
          </p>
        </div>
      </div>
    `;
  });
});