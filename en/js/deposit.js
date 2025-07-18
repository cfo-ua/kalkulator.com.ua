document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("deposit-form");
  const rateInput = document.getElementById("deposit-rate");
  const monthsInput = document.getElementById("deposit-months");
  const amountInput = document.getElementById("deposit-amount");
  const replenishEnable = document.getElementById("deposit-replenish-enable");
  const replenishInput = document.getElementById("deposit-replenish");
  const resultDiv = document.getElementById("deposit-result");

  // Enable/disable monthly addition input
  replenishEnable.addEventListener("change", function () {
    replenishInput.disabled = !this.checked;
    if (!this.checked) {
      replenishInput.value = 0;
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateDeposit();
  });

  function calculateDeposit() {
    const annualRate = parseFloat(rateInput.value) || 0;
    const months = parseInt(monthsInput.value) || 0;
    const initialAmount = parseFloat(amountInput.value) || 0;
    const monthlyAddition = replenishEnable.checked ? (parseFloat(replenishInput.value) || 0) : 0;
    const payoutMethod = document.querySelector('input[name="deposit-payout"]:checked').value;

    if (annualRate <= 0 || months <= 0 || initialAmount <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid values for all required fields.</p>';
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    let balance = initialAmount;
    let totalInterest = 0;
    let totalContributions = initialAmount;

    if (payoutMethod === "capitalize") {
      // With capitalization - compound interest
      for (let month = 1; month <= months; month++) {
        // Add monthly contribution at the beginning of each month
        if (month > 1 && monthlyAddition > 0) {
          balance += monthlyAddition;
          totalContributions += monthlyAddition;
        }
        
        // Calculate and add interest
        const monthlyInterest = balance * monthlyRate;
        balance += monthlyInterest;
        totalInterest += monthlyInterest;
      }
    } else {
      // Without capitalization - simple interest on growing principal
      let principal = initialAmount;
      
      for (let month = 1; month <= months; month++) {
        // Add monthly contribution
        if (month > 1 && monthlyAddition > 0) {
          principal += monthlyAddition;
          totalContributions += monthlyAddition;
        }
        
        // Calculate interest on current principal (paid out, not added)
        const monthlyInterest = principal * monthlyRate;
        totalInterest += monthlyInterest;
      }
      
      balance = principal; // Final balance is just the principal
    }

    // Calculate tax (example: 25% tax on interest)
    const taxRate = 0.25; // This can be made configurable
    const taxes = totalInterest * taxRate;
    const netInterest = totalInterest - taxes;
    const finalAmount = balance + (payoutMethod === "monthly" ? 0 : 0); // Interest already calculated above

    displayResults({
      initialAmount,
      monthlyAddition,
      totalContributions,
      months,
      annualRate,
      totalInterest,
      taxes,
      netInterest,
      finalAmount: payoutMethod === "capitalize" ? balance : (balance + netInterest),
      payoutMethod
    });
  }

  function displayResults(data) {
    const {
      initialAmount,
      monthlyAddition,
      totalContributions,
      months,
      annualRate,
      totalInterest,
      taxes,
      netInterest,
      finalAmount,
      payoutMethod
    } = data;

    const effectiveRate = ((finalAmount / totalContributions - 1) * 12 / months * 100).toFixed(2);

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>Deposit Results</h3>
        <div class="result-grid">
          <div class="result-item">
            <span class="label">Initial Deposit:</span>
            <span class="value">$${initialAmount.toLocaleString()}</span>
          </div>
          ${monthlyAddition > 0 ? `
          <div class="result-item">
            <span class="label">Monthly Addition:</span>
            <span class="value">$${monthlyAddition.toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="label">Total Contributions:</span>
            <span class="value">$${totalContributions.toLocaleString()}</span>
          </div>
          ` : ''}
          <div class="result-item">
            <span class="label">Term:</span>
            <span class="value">${months} months</span>
          </div>
          <div class="result-item">
            <span class="label">Annual Interest Rate:</span>
            <span class="value">${annualRate}%</span>
          </div>
          <div class="result-item">
            <span class="label">Total Interest Earned:</span>
            <span class="value">$${totalInterest.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Estimated Taxes (25%):</span>
            <span class="value">$${taxes.toFixed(2)}</span>
          </div>
          <div class="result-item highlight">
            <span class="label">Net Interest (after tax):</span>
            <span class="value">$${netInterest.toFixed(2)}</span>
          </div>
          <div class="result-item highlight">
            <span class="label">Final Amount:</span>
            <span class="value">$${finalAmount.toFixed(2)}</span>
          </div>
          <div class="result-item">
            <span class="label">Effective Annual Return:</span>
            <span class="value">${effectiveRate}%</span>
          </div>
        </div>
        
        <div class="method-info">
          <p><strong>Interest Method:</strong> ${payoutMethod === 'capitalize' ? 'Capitalization (compound interest)' : 'Monthly payouts (simple interest)'}</p>
          ${payoutMethod === 'capitalize' ? 
            '<p><em>With capitalization, interest is added to your deposit each month, earning compound returns.</em></p>' :
            '<p><em>With monthly payouts, interest is paid separately each month, and only the principal earns interest.</em></p>'
          }
        </div>
      </div>
    `;
  }
});