document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("startup-cost-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get one-time setup costs
    const legalCosts = parseFloat(document.getElementById("legalCosts").value) || 0;
    const techInfrastructure = parseFloat(document.getElementById("techInfrastructure").value) || 0;
    const officeSetup = parseFloat(document.getElementById("officeSetup").value) || 0;
    const initialMarketing = parseFloat(document.getElementById("initialMarketing").value) || 0;
    const professionalServices = parseFloat(document.getElementById("professionalServices").value) || 0;

    // Get monthly operating expenses
    const monthlyPersonnel = parseFloat(document.getElementById("monthlyPersonnel").value) || 0;
    const monthlyTechnology = parseFloat(document.getElementById("monthlyTechnology").value) || 0;
    const monthlyOffice = parseFloat(document.getElementById("monthlyOffice").value) || 0;
    const monthlyMarketing = parseFloat(document.getElementById("monthlyMarketing").value) || 0;
    const monthlyAdmin = parseFloat(document.getElementById("monthlyAdmin").value) || 0;

    // Get planning parameters
    const runwayMonths = parseInt(document.getElementById("runwayMonths").value) || 18;
    const contingencyPercent = parseFloat(document.getElementById("contingencyPercent").value) || 15;

    // Calculate totals
    const totalOneTimeCosts = legalCosts + techInfrastructure + officeSetup + initialMarketing + professionalServices;
    const monthlyOperatingCosts = monthlyPersonnel + monthlyTechnology + monthlyOffice + monthlyMarketing + monthlyAdmin;
    const totalOperatingCosts = monthlyOperatingCosts * runwayMonths;
    const subtotal = totalOneTimeCosts + totalOperatingCosts;
    const contingencyAmount = subtotal * (contingencyPercent / 100);
    const totalFundingNeeded = subtotal + contingencyAmount;

    // Generate monthly cash flow data
    const monthlyData = [];
    const labels = [];
    let cumulativeCashFlow = totalFundingNeeded;
    
    for (let i = 1; i <= runwayMonths; i++) {
      cumulativeCashFlow -= monthlyOperatingCosts;
      monthlyData.push(cumulativeCashFlow);
      labels.push(`Month ${i}`);
    }

    // Format currency function
    const formatCurrency = (num) => {
      return num.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    };

    // Calculate runway with current funding
    const monthsOfRunway = totalFundingNeeded > 0 ? totalFundingNeeded / monthlyOperatingCosts : 0;

    // Generate results
    const resultHTML = `
      <h3>Startup Cost Analysis Results:</h3>
      
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
        <h4 style="color: #2c3e50; margin-bottom: 1rem;">💰 Total Funding Required: ${formatCurrency(totalFundingNeeded)}</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <h5 style="margin-bottom: 0.5rem;">One-Time Setup Costs:</h5>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li>Legal & Compliance: ${formatCurrency(legalCosts)}</li>
              <li>Technology Infrastructure: ${formatCurrency(techInfrastructure)}</li>
              <li>Office Setup: ${formatCurrency(officeSetup)}</li>
              <li>Initial Marketing: ${formatCurrency(initialMarketing)}</li>
              <li>Professional Services: ${formatCurrency(professionalServices)}</li>
            </ul>
            <p style="margin: 0.5rem 0; font-weight: bold;">Subtotal: ${formatCurrency(totalOneTimeCosts)}</p>
          </div>
          
          <div>
            <h5 style="margin-bottom: 0.5rem;">Monthly Operating Costs:</h5>
            <ul style="margin: 0; padding-left: 1.2rem;">
              <li>Personnel: ${formatCurrency(monthlyPersonnel)}</li>
              <li>Technology: ${formatCurrency(monthlyTechnology)}</li>
              <li>Office Expenses: ${formatCurrency(monthlyOffice)}</li>
              <li>Marketing & Sales: ${formatCurrency(monthlyMarketing)}</li>
              <li>Administrative: ${formatCurrency(monthlyAdmin)}</li>
            </ul>
            <p style="margin: 0.5rem 0; font-weight: bold;">Monthly Total: ${formatCurrency(monthlyOperatingCosts)}</p>
          </div>
        </div>
        
        <div style="border-top: 1px solid #dee2e6; padding-top: 1rem;">
          <p><strong>Operating Costs (${runwayMonths} months):</strong> ${formatCurrency(totalOperatingCosts)}</p>
          <p><strong>Contingency Buffer (${contingencyPercent}%):</strong> ${formatCurrency(contingencyAmount)}</p>
          <p style="font-size: 1.1rem; color: #e74c3c;"><strong>Runway Duration:</strong> ${monthsOfRunway.toFixed(1)} months</p>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
        <h5 style="color: #27ae60; margin-bottom: 0.5rem;">💡 Key Insights:</h5>
        <ul style="margin: 0; color: #2c3e50;">
          <li><strong>Monthly Burn Rate:</strong> ${formatCurrency(monthlyOperatingCosts)} per month</li>
          <li><strong>Largest Expense Category:</strong> ${getMaxExpenseCategory(monthlyPersonnel, monthlyTechnology, monthlyOffice, monthlyMarketing, monthlyAdmin)}</li>
          <li><strong>Setup vs Operating Ratio:</strong> ${((totalOneTimeCosts / totalOperatingCosts) * 100).toFixed(1)}% setup, ${((totalOperatingCosts / (totalOneTimeCosts + totalOperatingCosts)) * 100).toFixed(1)}% operating</li>
          <li><strong>Recommendation:</strong> ${getRecommendation(monthsOfRunway, totalFundingNeeded)}</li>
        </ul>
      </div>
    `;

    document.getElementById("startup-cost-result").innerHTML = resultHTML;

    // Show and update chart
    const chartBlock = document.getElementById("startup-cost-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("startup-cost-chart").getContext("2d");
      if (window.startupCostChart) window.startupCostChart.destroy();

      window.startupCostChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Remaining Cash",
            data: monthlyData,
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            fill: true,
            tension: 0.1,
            pointBackgroundColor: "#3498db",
            pointBorderColor: "#2980b9",
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return "Remaining: " + formatCurrency(context.parsed.y);
                }
              }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Remaining Cash ($)" },
              ticks: {
                callback: function (value) {
                  return formatCurrency(value);
                }
              }
            },
            x: {
              title: { display: true, text: "Months" }
            }
          }
        }
      });
    });
  });

  // Helper function to determine the largest expense category
  function getMaxExpenseCategory(personnel, tech, office, marketing, admin) {
    const categories = [
      { name: "Personnel", amount: personnel },
      { name: "Technology", amount: tech },
      { name: "Office", amount: office },
      { name: "Marketing", amount: marketing },
      { name: "Administrative", amount: admin }
    ];
    
    const max = categories.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
    return `${max.name} (${((max.amount / (personnel + tech + office + marketing + admin)) * 100).toFixed(0)}% of monthly costs)`;
  }

  // Helper function to provide recommendations
  function getRecommendation(runway, totalFunding) {
    if (runway < 12) {
      return "⚠️ Consider extending runway to 12+ months for safer fundraising timeline";
    } else if (runway > 24) {
      return "✅ Strong runway length, provides good flexibility for growth and fundraising";
    } else if (totalFunding > 1000000) {
      return "💼 Substantial funding requirement - ensure strong business case for investors";
    } else {
      return "✅ Well-balanced funding plan with appropriate runway length";
    }
  }
});

// Dynamic loader for Chart.js
function ensureChartJs(callback) {
  if (window.Chart) return callback();
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.body.appendChild(script);
}