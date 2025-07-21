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

    const habitName = form['habit-name'].value.trim() || 'Your habit';
    const cost = parseFloat(form.cost.value);
    const frequency = form.frequency.value;
    const customTimes = parseFloat(form['custom-times'].value) || 0;

    // Validation
    if (!cost || cost <= 0) {
      result.innerHTML = '<p style="color:red;">Please enter a valid cost amount.</p>';
      return;
    }

    if (!frequency) {
      result.innerHTML = '<p style="color:red;">Please select how often you engage in this habit.</p>';
      return;
    }

    if (frequency === 'custom' && (!customTimes || customTimes <= 0)) {
      result.innerHTML = '<p style="color:red;">Please enter how many times per week for custom frequency.</p>';
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

    // Format currency
    const formatCurrency = (amount) => '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    const formatCurrencyDetailed = (amount) => '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Determine emoji based on cost level
    let emoji = '💸';
    if (costPerYear > 5000) emoji = '🚨';
    else if (costPerYear > 3000) emoji = '⚠️';
    else if (costPerYear > 1000) emoji = '💰';

    // Get frequency description
    let frequencyDesc = '';
    switch (frequency) {
      case 'daily': frequencyDesc = 'every day'; break;
      case 'weekdays': frequencyDesc = 'on weekdays'; break;
      case 'weekly': frequencyDesc = 'once per week'; break;
      case 'multiple-weekly': frequencyDesc = 'multiple times per week'; break;
      case 'monthly': frequencyDesc = 'once per month'; break;
      case 'custom': frequencyDesc = `${customTimes} times per week`; break;
    }

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #ffa726;">
        <h3 style="color: #e65100; margin-top: 0; text-align: center;">${emoji} ${habitName} Cost Analysis</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;"><strong>Spending ${formatCurrencyDetailed(cost)} ${frequencyDesc}</strong></p>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📅 Weekly Cost</h6>
            <div class="big-number">${formatCurrencyDetailed(costPerWeek)}</div>
            <p>${(timesPerWeek).toFixed(1)} times per week</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📆 Monthly Cost</h6>
            <div class="big-number">${formatCurrency(costPerMonth)}</div>
            <p>About ${(timesPerWeek * 4.33).toFixed(1)} times per month</p>
          </div>
          
          <div class="insight-card" style="border-color: #ff5722; background: linear-gradient(135deg, #fff3e0 0%, #ffe0d1 100%);">
            <h6>📊 Yearly Cost</h6>
            <div class="big-number" style="color: #ff5722;">${formatCurrency(costPerYear)}</div>
            <p>${(timesPerWeek * 52).toFixed(0)} times per year</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #9c27b0;">
          <h4 style="color: #6a1b9a; margin-top: 0; text-align: center;">💎 10-Year Financial Impact</h4>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #d32f2f; margin: 0 0 10px 0;">Total Spent</h6>
              <div style="font-size: 1.8rem; font-weight: bold; color: #d32f2f;">${formatCurrency(costPer10Years)}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">Money gone forever</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #388e3c; margin: 0 0 10px 0;">If Invested Instead</h6>
              <div style="font-size: 1.8rem; font-weight: bold; color: #388e3c;">${formatCurrency(futureValue)}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">At 7% annual return</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #6a1b9a;">
              💡 Potential gain from breaking this habit: <span style="color: #388e3c;">${formatCurrency(futureValue - costPer10Years)}</span>
            </p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">🎯 What You Could Buy Instead</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
            ${costPerYear > 3000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>🚗 Used Car</strong><br>Down payment</div>' : ''}
            ${costPerYear > 2000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>✈️ Vacation</strong><br>Nice trip abroad</div>' : ''}
            ${costPerYear > 1500 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>💻 Laptop</strong><br>High-end computer</div>' : ''}
            ${costPerYear > 1000 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>📚 Education</strong><br>Online courses</div>' : ''}
            ${costPerYear > 500 ? '<div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>🏋️ Gym</strong><br>Annual membership</div>' : ''}
            <div style="background: white; padding: 10px; border-radius: 6px; text-align: center;"><strong>💰 Emergency Fund</strong><br>Financial security</div>
          </div>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 10px; border: 2px solid #2196f3;">
          <h4 style="color: #1976d2; margin-top: 0; text-align: center;">📈 Break-Even Analysis</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; text-align: center;">
            <div>
              <div style="font-weight: bold; color: #1976d2;">Per Day</div>
              <div style="font-size: 1.2rem; color: #333;">${formatCurrencyDetailed(costPerWeek / 7)}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #1976d2;">Per Hour</div>
              <div style="font-size: 1.2rem; color: #333;">${formatCurrencyDetailed(costPerWeek / 7 / 24)}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #1976d2;">Work Hours</div>
              <div style="font-size: 1.2rem; color: #333;">${(costPerYear / (15 * 2000)).toFixed(1)}h</div>
              <div style="font-size: 0.8rem; color: #666;">@$15/hour</div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💪 <strong>Remember:</strong> Small changes in daily habits can lead to massive financial improvements over time!
          </p>
        </div>
      </div>
    `;
  });
});