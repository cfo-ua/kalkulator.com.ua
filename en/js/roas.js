document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("roas-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const adSpend = parseFloat(document.getElementById("adSpend").value);
    const revenue = parseFloat(document.getElementById("revenue").value);

    if (adSpend === 0) {
      document.getElementById("roas-result").innerHTML = "<p style='color:red;'>Advertising spend cannot be zero.</p>";
      return;
    }

    const roas = revenue / adSpend;
    const roasPercentage = (roas * 100).toFixed(0);

    // Format currency
    const formatCurrency = (num) => {
      return num.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    };

    // Determine performance level and recommendations
    let performance = "";
    let recommendation = "";
    let color = "";

    if (roas >= 5) {
      performance = "Excellent";
      recommendation = "Scale this campaign! Increase budget allocation.";
      color = "#28a745"; // Green
    } else if (roas >= 4) {
      performance = "Very Good";
      recommendation = "Strong performance. Consider scaling with monitoring.";
      color = "#20c997"; // Teal
    } else if (roas >= 3) {
      performance = "Good";
      recommendation = "Solid performance. Optimize targeting and creative.";
      color = "#ffc107"; // Yellow
    } else if (roas >= 2) {
      performance = "Fair";
      recommendation = "Needs improvement. Review strategy and optimize.";
      color = "#fd7e14"; // Orange
    } else if (roas >= 1) {
      performance = "Poor";
      recommendation = "Campaign is barely profitable. Major optimization needed.";
      color = "#dc3545"; // Red
    } else {
      performance = "Losing Money";
      recommendation = "Campaign is unprofitable. Pause and restructure immediately.";
      color = "#dc3545"; // Red
    }

    document.getElementById("roas-result").innerHTML = `
      <h3>ROAS Analysis Results:</h3>
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid ${color};">
        <div style="margin-bottom: 1rem;">
          <p style="font-size: 1.2em; margin: 0;"><strong>ROAS: ${roas.toFixed(2)}:1</strong> (${roasPercentage}% return)</p>
          <p style="color: ${color}; font-weight: bold; margin: 0.5rem 0;"><strong>Performance: ${performance}</strong></p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
          <div>
            <p style="margin: 0; font-size: 0.9em; color: #666;">Ad Spend</p>
            <p style="margin: 0; font-weight: bold;">${formatCurrency(adSpend)}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 0.9em; color: #666;">Revenue Generated</p>
            <p style="margin: 0; font-weight: bold;">${formatCurrency(revenue)}</p>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; font-style: italic;"><strong>Recommendation:</strong> ${recommendation}</p>
        </div>
      </div>
    `;
  });
});