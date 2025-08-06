document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("savings-goal-form");
  const goalInput = document.getElementById("goal");
  const initialInput = document.getElementById("initial");
  const monthsInput = document.getElementById("months");
  const resultDiv = document.getElementById("savings-goal-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateSavingsGoal();
  });

  // Auto-calculate when inputs change for better UX
  [goalInput, initialInput, monthsInput].forEach(input => {
    input.addEventListener("input", function () {
      if (goalInput.value && monthsInput.value) {
        calculateSavingsGoal();
      }
    });
  });

  function calculateSavingsGoal() {
    const targetAmount = parseFloat(goalInput.value) || 0;
    const currentSavings = parseFloat(initialInput.value) || 0;
    const timeMonths = parseInt(monthsInput.value) || 0;

    if (targetAmount <= 0 || timeMonths <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid values for target amount and time period.</p>';
      return;
    }

    if (currentSavings >= targetAmount) {
      resultDiv.innerHTML = `
        <div class="result-section success">
          <h3>🎉 Goal Already Achieved!</h3>
          <p>You already have <strong>$${currentSavings.toLocaleString()}</strong>, which meets or exceeds your target of <strong>$${targetAmount.toLocaleString()}</strong>.</p>
          <p>Consider setting a higher goal or using these funds for your planned purpose!</p>
        </div>
      `;
      return;
    }

    const remainingAmount = targetAmount - currentSavings;
    const monthlyRequired = remainingAmount / timeMonths;
    const weeklyRequired = monthlyRequired / 4.33; // Average weeks per month
    const dailyRequired = monthlyRequired / 30; // Average days per month

    // Calculate some helpful scenarios
    const shorterTimeMonths = Math.max(1, Math.floor(timeMonths * 0.75));
    const longerTimeMonths = Math.ceil(timeMonths * 1.5);
    const shorterMonthlyRequired = remainingAmount / shorterTimeMonths;
    const longerMonthlyRequired = remainingAmount / longerTimeMonths;

    // Progress calculation
    const progressPercentage = ((currentSavings / targetAmount) * 100).toFixed(1);

    displayResults({
      targetAmount,
      currentSavings,
      remainingAmount,
      timeMonths,
      monthlyRequired,
      weeklyRequired,
      dailyRequired,
      progressPercentage,
      shorterTimeMonths,
      longerTimeMonths,
      shorterMonthlyRequired,
      longerMonthlyRequired
    });
  }

  function displayResults(data) {
    const {
      targetAmount,
      currentSavings,
      remainingAmount,
      timeMonths,
      monthlyRequired,
      weeklyRequired,
      dailyRequired,
      progressPercentage,
      shorterTimeMonths,
      longerTimeMonths,
      shorterMonthlyRequired,
      longerMonthlyRequired
    } = data;

    const years = Math.floor(timeMonths / 12);
    const remainingMonths = timeMonths % 12;
    const timeDescription = years > 0 ? 
      `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}` :
      `${timeMonths} month${timeMonths > 1 ? 's' : ''}`;

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>💰 Your Savings Plan</h3>
        
        <div class="goal-summary">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            <span class="progress-text">${progressPercentage}% Complete</span>
          </div>
          <p><strong>Goal:</strong> $${targetAmount.toLocaleString()} in ${timeDescription}</p>
        </div>

        <div class="result-grid">
          <div class="result-item highlight">
            <span class="label">Monthly Savings Required:</span>
            <span class="value">$${monthlyRequired.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Weekly Savings:</span>
            <span class="value">$${weeklyRequired.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Daily Savings:</span>
            <span class="value">$${dailyRequired.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Current Savings:</span>
            <span class="value">$${currentSavings.toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="label">Still Need to Save:</span>
            <span class="value">$${remainingAmount.toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="label">Target Date:</span>
            <span class="value">${getTargetDate(timeMonths)}</span>
          </div>
        </div>

        <div class="scenarios">
          <h4>Alternative Timeframes</h4>
          <div class="scenario-grid">
            <div class="scenario">
              <strong>Faster Goal (${shorterTimeMonths} months):</strong>
              <span>$${shorterMonthlyRequired.toFixed(2)}/month</span>
            </div>
            <div class="scenario">
              <strong>Relaxed Goal (${longerTimeMonths} months):</strong>
              <span>$${longerMonthlyRequired.toFixed(2)}/month</span>
            </div>
          </div>
        </div>

        <div class="savings-tips">
          <h4>💡 Savings Tips</h4>
          <ul>
            <li><strong>Automate:</strong> Set up automatic transfers to your savings account</li>
            <li><strong>Track Progress:</strong> Review your savings monthly to stay motivated</li>
            <li><strong>Find Extra Income:</strong> Look for side hustles or sell unused items</li>
            <li><strong>Cut Expenses:</strong> Identify areas where you can reduce spending</li>
            <li><strong>Round Up:</strong> Save spare change by rounding up purchases</li>
          </ul>
        </div>

        <div class="milestone-tracker">
          <h4>📊 Milestone Tracker</h4>
          <div class="milestones">
            <div class="milestone ${progressPercentage >= 25 ? 'achieved' : ''}">
              <span class="percentage">25%</span>
              <span class="amount">$${(targetAmount * 0.25).toLocaleString()}</span>
            </div>
            <div class="milestone ${progressPercentage >= 50 ? 'achieved' : ''}">
              <span class="percentage">50%</span>
              <span class="amount">$${(targetAmount * 0.50).toLocaleString()}</span>
            </div>
            <div class="milestone ${progressPercentage >= 75 ? 'achieved' : ''}">
              <span class="percentage">75%</span>
              <span class="amount">$${(targetAmount * 0.75).toLocaleString()}</span>
            </div>
            <div class="milestone ${progressPercentage >= 100 ? 'achieved' : ''}">
              <span class="percentage">100%</span>
              <span class="amount">$${targetAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getTargetDate(months) {
    const currentDate = new Date();
    const targetDate = new Date(currentDate);
    targetDate.setMonth(targetDate.getMonth() + months);
    
    return targetDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Auto-calculate with default values on page load
  setTimeout(() => {
    if (goalInput.value && monthsInput.value) {
      calculateSavingsGoal();
    }
  }, 100);
});