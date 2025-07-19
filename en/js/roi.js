document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("roi-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const investment = parseFloat(document.getElementById("investment").value);
    const profit = parseFloat(document.getElementById("profit").value);

    if (investment === 0) {
      document.getElementById("roi-result").innerHTML = "<p style='color:red;'>Investment amount cannot be zero.</p>";
      return;
    }

    const roi = ((profit - investment) / investment) * 100;
    const netProfit = profit - investment;

    // Format numbers for display
    const formatCurrency = (num) => {
      return num.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    };

    // Determine ROI interpretation
    let interpretation = "";
    if (roi > 25) {
      interpretation = "Excellent return! This is an outstanding investment performance.";
    } else if (roi > 15) {
      interpretation = "Very good return. This investment performed well.";
    } else if (roi > 5) {
      interpretation = "Decent return. This investment was moderately successful.";
    } else if (roi > 0) {
      interpretation = "Positive return, but relatively low performance.";
    } else if (roi === 0) {
      interpretation = "Break-even. No profit or loss on this investment.";
    } else {
      interpretation = "Negative return. This investment resulted in a loss.";
    }

    document.getElementById("roi-result").innerHTML = `
      <h3>ROI Analysis Results:</h3>
      <div style="background: #f5f5f5; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <p><strong>Return on Investment (ROI): ${roi.toFixed(2)}%</strong></p>
        <p><strong>Net Profit/Loss: ${formatCurrency(netProfit)}</strong></p>
        <p><strong>Total Return: ${formatCurrency(profit)}</strong></p>
        <p><strong>Original Investment: ${formatCurrency(investment)}</strong></p>
      </div>
      <p><em>${interpretation}</em></p>
    `;
  });
});