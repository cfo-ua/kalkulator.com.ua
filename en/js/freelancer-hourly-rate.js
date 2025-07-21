document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("freelancer-rate-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const annualLivingExpenses = parseFloat(document.getElementById("annualLivingExpenses").value);
    const businessExpenses = parseFloat(document.getElementById("businessExpenses").value);
    const desiredProfit = parseFloat(document.getElementById("desiredProfit").value) / 100;
    const billableHours = parseFloat(document.getElementById("billableHours").value);
    const vacationWeeks = parseFloat(document.getElementById("vacationWeeks").value);
    const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;

    // Calculate working weeks and total billable hours
    const workingWeeks = 52 - vacationWeeks;
    const totalBillableHours = billableHours * workingWeeks;

    // Calculate total annual needs
    const totalExpenses = annualLivingExpenses + businessExpenses;
    const grossIncomeNeeded = totalExpenses / (1 - taxRate);
    const grossWithProfit = grossIncomeNeeded * (1 + desiredProfit);

    // Calculate rates
    const minimumRate = Math.ceil(grossIncomeNeeded / totalBillableHours);
    const sustainableRate = Math.ceil(grossWithProfit / totalBillableHours);
    const premiumRate = Math.ceil(sustainableRate * 1.5);

    // Calculate annual projections
    const minAnnualIncome = minimumRate * totalBillableHours;
    const sustainableAnnualIncome = sustainableRate * totalBillableHours;
    const premiumAnnualIncome = premiumRate * totalBillableHours;

    // Calculate take-home after taxes
    const minTakeHome = minAnnualIncome * (1 - taxRate);
    const sustainableTakeHome = sustainableAnnualIncome * (1 - taxRate);
    const premiumTakeHome = premiumAnnualIncome * (1 - taxRate);

    // Display results using insight-card design
    const resultBlock = document.getElementById("freelancer-rate-result");
    resultBlock.innerHTML = `
      <h3>💰 Your Freelancer Hourly Rate Analysis</h3>
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>⚠️ Minimum Viable Rate</h6>
          <div class="big-number">$${minimumRate}</div>
          <p>Covers basic expenses only<br>
          Annual: $${minAnnualIncome.toLocaleString()}<br>
          Take-home: $${minTakeHome.toLocaleString()}</p>
        </div>
        
        <div class="insight-card success">
          <h6>✅ Sustainable Rate (Recommended)</h6>
          <div class="big-number">$${sustainableRate}</div>
          <p>Includes ${(desiredProfit * 100)}% profit margin<br>
          Annual: $${sustainableAnnualIncome.toLocaleString()}<br>
          Take-home: $${sustainableTakeHome.toLocaleString()}</p>
        </div>
        
        <div class="insight-card info">
          <h6>🚀 Premium Rate</h6>
          <div class="big-number">$${premiumRate}</div>
          <p>High-value positioning<br>
          Annual: $${premiumAnnualIncome.toLocaleString()}<br>
          Take-home: $${premiumTakeHome.toLocaleString()}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📊 Rate Breakdown Analysis</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
          <div>
            <strong>💼 Work Schedule:</strong><br>
            ${billableHours} hours/week × ${workingWeeks} weeks<br>
            = ${totalBillableHours} billable hours/year
          </div>
          <div>
            <strong>💸 Annual Expenses:</strong><br>
            Living: $${annualLivingExpenses.toLocaleString()}<br>
            Business: $${businessExpenses.toLocaleString()}<br>
            Total: $${totalExpenses.toLocaleString()}
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <strong>🎯 Rate Strategy Recommendations:</strong><br>
          • Start with <strong>$${sustainableRate}/hour</strong> for most clients<br>
          • Use $${minimumRate}/hour as your absolute minimum<br>
          • Charge $${premiumRate}/hour for premium clients or rush jobs<br>
          • Review and adjust rates every 6-12 months
        </div>
      </div>
    `;
  });
});