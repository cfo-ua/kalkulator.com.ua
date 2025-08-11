document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-savings-form');
  const result = document.getElementById('savings-result');

  // Tool pricing data (USD per month per developer)
  const toolPricing = {
    copilot: 10,
    tabnine: 12,
    codewhisperer: 19,
    custom: 0
  };

  // Productivity boost ranges
  const productivityRanges = {
    conservative: { min: 20, max: 25 },
    moderate: { min: 30, max: 40 },
    optimistic: { min: 45, max: 55 },
    custom: { min: 0, max: 100 }
  };

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPercent(percent) {
    return percent.toFixed(1) + '%';
  }

  // Show/hide custom fields based on selection
  document.querySelectorAll('input[name="ai-tool"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const customPrice = document.getElementById('custom-price');
      customPrice.style.display = this.value === 'custom' ? 'block' : 'none';
    });
  });

  document.querySelectorAll('input[name="productivity-boost"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const customProductivity = document.getElementById('custom-productivity');
      customProductivity.style.display = this.value === 'custom' ? 'block' : 'none';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const developersCount = parseInt(document.getElementById('developers-count').value);
    const developerSalary = parseFloat(document.getElementById('developer-salary').value);
    const workHours = parseInt(document.getElementById('work-hours').value);
    const codingPercentage = parseInt(document.getElementById('coding-percentage').value);
    const selectedTool = document.querySelector('input[name="ai-tool"]:checked').value;
    const productivityBoost = document.querySelector('input[name="productivity-boost"]:checked').value;
    const calculationPeriod = parseInt(document.getElementById('calculation-period').value);

    // Additional factors
    const includeTraining = document.getElementById('include-training').checked;
    const includeSetup = document.getElementById('include-setup').checked;
    const reducedBugs = document.getElementById('reduced-bugs').checked;

    // Calculate base metrics
    const hoursPerMonth = (workHours * 52) / 12; // Average hours per month
    const codingHoursPerMonth = hoursPerMonth * (codingPercentage / 100);
    const hourlyRate = developerSalary / hoursPerMonth;

    // Get tool cost
    let toolCostPerDeveloper = toolPricing[selectedTool];
    if (selectedTool === 'custom') {
      toolCostPerDeveloper = parseFloat(document.getElementById('custom-tool-price').value) || 0;
    }

    // Get productivity improvement
    let productivityIncrease;
    if (productivityBoost === 'custom') {
      productivityIncrease = parseFloat(document.getElementById('custom-productivity-value').value) || 0;
    } else {
      const range = productivityRanges[productivityBoost];
      productivityIncrease = (range.min + range.max) / 2; // Use average of range
    }

    // Calculate savings
    const totalToolCost = toolCostPerDeveloper * developersCount * calculationPeriod;
    const savedHoursPerDeveloperPerMonth = codingHoursPerMonth * (productivityIncrease / 100);
    const totalSavedHours = savedHoursPerDeveloperPerMonth * developersCount * calculationPeriod;
    const savedAmount = totalSavedHours * hourlyRate;

    // Additional costs
    let additionalCosts = 0;
    if (includeTraining) {
      additionalCosts += 500 * developersCount;
    }
    if (includeSetup) {
      additionalCosts += 200;
    }

    // Bug reduction savings (estimate 2 hours per bug, 1 bug per developer per month)
    let bugSavings = 0;
    if (reducedBugs) {
      const bugsPerMonth = developersCount * 1;
      const bugFixTime = 2; // hours
      const savedBugHours = bugsPerMonth * bugFixTime * 0.15 * calculationPeriod; // 15% reduction
      bugSavings = savedBugHours * hourlyRate;
    }

    const totalCosts = totalToolCost + additionalCosts;
    const totalSavings = savedAmount + bugSavings;
    const netSavings = totalSavings - totalCosts;
    const roi = totalCosts > 0 ? ((totalSavings - totalCosts) / totalCosts) * 100 : 0;

    // Generate detailed breakdown
    const toolNames = {
      copilot: 'GitHub Copilot',
      tabnine: 'TabNine Pro',
      codewhisperer: 'Amazon CodeWhisperer',
      custom: 'Custom Tool'
    };

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>💰 Net Savings</h6>
          <div style="font-size: 2em; font-weight: bold; color: #28a745;">
            ${formatCurrency(netSavings)}
          </div>
          <small>over ${calculationPeriod} months</small>
        </div>
        
        <div class="insight-card info">
          <h6>📈 ROI</h6>
          <div style="font-size: 2em; font-weight: bold; color: var(--accent);">
            ${formatPercent(roi)}
          </div>
          <small>return on investment</small>
        </div>
        
        <div class="insight-card">
          <h6>⏱️ Time Saved</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${totalSavedHours.toLocaleString()} hours
          </div>
          <small>${(totalSavedHours / developersCount / calculationPeriod).toFixed(1)} hrs/dev/month</small>
        </div>
        
        <div class="insight-card warning">
          <h6>💸 Total Investment</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${formatCurrency(totalCosts)}
          </div>
          <small>tools + implementation</small>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Detailed Calculation</h3>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💡 Calculation Parameters</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Tool:</strong> ${toolNames[selectedTool]} (${formatCurrency(toolCostPerDeveloper)}/month per developer)</li>
            <li><strong>Team:</strong> ${developersCount} developers</li>
            <li><strong>Productivity boost:</strong> ${formatPercent(productivityIncrease)}</li>
            <li><strong>Coding time:</strong> ${codingHoursPerMonth.toFixed(1)} hours/month per developer</li>
            <li><strong>Hourly rate:</strong> ${formatCurrency(hourlyRate)}/hour</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💰 Cost Breakdown</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Tool costs</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalToolCost)}</td>
            </tr>
            ${includeTraining ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Team training</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(500 * developersCount)}</td>
            </tr>` : ''}
            ${includeSetup ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Setup & configuration</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(200)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Total investment</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalCosts)}</td>
            </tr>
          </table>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💚 Savings Breakdown</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Productivity savings</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(savedAmount)}</td>
            </tr>
            ${reducedBugs ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Bug reduction savings</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(bugSavings)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Total savings</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalSavings)}</td>
            </tr>
          </table>
        </div>

        <div style="background: ${netSavings > 0 ? '#f8fff9' : '#fff8f8'}; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 2px solid ${netSavings > 0 ? '#28a745' : '#dc3545'};">
          <h4 style="color: ${netSavings > 0 ? '#28a745' : '#dc3545'};">
            ${netSavings > 0 ? '✅' : '❌'} Summary for ${calculationPeriod} months
          </h4>
          <p style="font-size: 1.2em; margin: 0.5rem 0;">
            <strong>Net savings: ${formatCurrency(netSavings)}</strong>
          </p>
          <p style="margin: 0.5rem 0;">
            Return on investment: <strong>${formatPercent(roi)}</strong>
          </p>
          ${netSavings > 0 ? 
            `<p style="margin: 0.5rem 0; color: #28a745;">💡 Investment will pay back in ${(totalCosts / (totalSavings / calculationPeriod)).toFixed(1)} months</p>` :
            `<p style="margin: 0.5rem 0; color: #dc3545;">⚠️ Investment doesn't pay back with current parameters</p>`
          }
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📈 Monthly Metrics</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Monthly savings:</strong> ${formatCurrency(totalSavings / calculationPeriod)}</li>
            <li><strong>Monthly costs:</strong> ${formatCurrency(totalToolCost / calculationPeriod)}</li>
            <li><strong>Monthly net benefit:</strong> ${formatCurrency((totalSavings - totalToolCost) / calculationPeriod)}</li>
            <li><strong>Hours saved per month:</strong> ${(totalSavedHours / calculationPeriod).toFixed(0)} hours</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>🎯 Recommendations</h4>
          ${netSavings > 0 ? `
            <div style="color: #28a745;">
              ✅ <strong>Recommended:</strong> The investment shows positive ROI. Consider implementing gradually and measuring actual results.
            </div>
            <ul style="margin: 0.5rem 0;">
              <li>Start with a pilot team to validate assumptions</li>
              <li>Establish measurement baseline before rollout</li>
              <li>Plan team training and change management</li>
              <li>Set up code review processes for AI-generated code</li>
            </ul>
          ` : `
            <div style="color: #dc3545;">
              ⚠️ <strong>Consider adjusting:</strong> Current parameters don't show positive ROI. Consider:
            </div>
            <ul style="margin: 0.5rem 0;">
              <li>Starting with a smaller team or cheaper tool</li>
              <li>Focusing on specific use cases with higher productivity gains</li>
              <li>Reassessing team coding time and salary costs</li>
              <li>Evaluating longer payback periods</li>
            </ul>
          `}
        </div>
      </div>
    `;
  });
});