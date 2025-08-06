document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById('calculateBtn');
  const loanAmount = document.getElementById('loanAmount');
  const interestRate = document.getElementById('interestRate');
  const loanTerm = document.getElementById('loanTerm');
  const result = document.getElementById('loanResult');
  const paymentBreakdown = document.getElementById('paymentBreakdown');
  
  function calculateLoan() {
    const principal = parseFloat(loanAmount.value);
    const annualRate = parseFloat(interestRate.value);
    const years = parseFloat(loanTerm.value);
    
    if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate < 0 || years <= 0) {
      result.textContent = "Please enter valid loan details.";
      paymentBreakdown.innerHTML = "";
      return;
    }
    
    // Convert annual rate to monthly rate
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
      // Handle 0% interest rate
      monthlyPayment = principal / totalMonths;
    } else {
      // Standard loan payment formula
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    
    const totalAmount = monthlyPayment * totalMonths;
    const totalInterest = totalAmount - principal;
    
    // Display results
    result.innerHTML = `
      <div class="result-item">
        <strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}
      </div>
      <div class="result-item">
        <strong>Total Amount:</strong> $${totalAmount.toFixed(2)}
      </div>
      <div class="result-item">
        <strong>Total Interest:</strong> $${totalInterest.toFixed(2)}
      </div>
    `;
    
    // Create payment breakdown table
    let breakdownHTML = `
      <table class="payment-table">
        <thead>
          <tr>
            <th>Payment #</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    let balance = principal;
    for (let i = 1; i <= Math.min(12, totalMonths); i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      breakdownHTML += `
        <tr>
          <td>${i}</td>
          <td>$${principalPayment.toFixed(2)}</td>
          <td>$${interestPayment.toFixed(2)}</td>
          <td>$${balance.toFixed(2)}</td>
        </tr>
      `;
    }
    
    breakdownHTML += '</tbody></table>';
    
    if (totalMonths > 12) {
      breakdownHTML += '<p><em>Showing first 12 payments only</em></p>';
    }
    
    paymentBreakdown.innerHTML = breakdownHTML;
  }
  
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateLoan);
  }
  
  // Also calculate on input change for better UX
  [loanAmount, interestRate, loanTerm].forEach(input => {
    if (input) {
      input.addEventListener('input', function() {
        if (loanAmount.value && interestRate.value && loanTerm.value) {
          calculateLoan();
        }
      });
    }
  });
  
  // Auto-calculate with default values on page load
  setTimeout(() => {
    if (loanAmount.value && interestRate.value && loanTerm.value) {
      calculateLoan();
    }
  }, 100);
});