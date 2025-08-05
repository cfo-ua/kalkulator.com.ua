document.getElementById("commission-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const commissionType = document.getElementById("commission-type").value;
  const salesAmount = parseFloat(document.getElementById("sales-amount").value) || 0;
  const bonus = parseFloat(document.getElementById("bonus").value) || 0;

  let commission = 0;
  let baseSalary = 0;
  let details = [];

  switch (commissionType) {
    case 'fixed':
      const fixedRate = parseFloat(document.getElementById("commission-rate").value) || 0;
      commission = salesAmount * (fixedRate / 100);
      details.push(`Commission: $${salesAmount.toLocaleString()} × ${fixedRate}% = $${commission.toLocaleString()}`);
      break;

    case 'combined':
      baseSalary = parseFloat(document.getElementById("base-salary").value) || 0;
      const combinedRate = parseFloat(document.getElementById("commission-rate-combined").value) || 0;
      commission = salesAmount * (combinedRate / 100);
      details.push(`Base salary: $${baseSalary.toLocaleString()}`);
      details.push(`Commission: $${salesAmount.toLocaleString()} × ${combinedRate}% = $${commission.toLocaleString()}`);
      break;

    case 'progressive':
      const salesTarget = parseFloat(document.getElementById("sales-target").value) || 0;
      const rateBelowTarget = parseFloat(document.getElementById("rate-below-target").value) || 0;
      const rateAboveTarget = parseFloat(document.getElementById("rate-above-target").value) || 0;
      
      if (salesAmount <= salesTarget) {
        commission = salesAmount * (rateBelowTarget / 100);
        details.push(`Sales below target: $${salesAmount.toLocaleString()} × ${rateBelowTarget}% = $${commission.toLocaleString()}`);
      } else {
        const belowTarget = salesTarget * (rateBelowTarget / 100);
        const aboveTarget = (salesAmount - salesTarget) * (rateAboveTarget / 100);
        commission = belowTarget + aboveTarget;
        details.push(`Commission to target: $${salesTarget.toLocaleString()} × ${rateBelowTarget}% = $${belowTarget.toLocaleString()}`);
        details.push(`Commission above target: $${(salesAmount - salesTarget).toLocaleString()} × ${rateAboveTarget}% = $${aboveTarget.toLocaleString()}`);
      }
      break;

    case 'tiered':
      const tier1Limit = parseFloat(document.getElementById("tier1-limit").value) || 0;
      const tier1Rate = parseFloat(document.getElementById("tier1-rate").value) || 0;
      const tier2Limit = parseFloat(document.getElementById("tier2-limit").value) || 0;
      const tier2Rate = parseFloat(document.getElementById("tier2-rate").value) || 0;
      const tier3Rate = parseFloat(document.getElementById("tier3-rate").value) || 0;

      let remaining = salesAmount;
      
      // Tier 1
      if (remaining > 0) {
        const tier1Amount = Math.min(remaining, tier1Limit);
        const tier1Commission = tier1Amount * (tier1Rate / 100);
        commission += tier1Commission;
        details.push(`Tier 1: $${tier1Amount.toLocaleString()} × ${tier1Rate}% = $${tier1Commission.toLocaleString()}`);
        remaining -= tier1Amount;
      }
      
      // Tier 2
      if (remaining > 0) {
        const tier2Amount = Math.min(remaining, tier2Limit - tier1Limit);
        const tier2Commission = tier2Amount * (tier2Rate / 100);
        commission += tier2Commission;
        details.push(`Tier 2: $${tier2Amount.toLocaleString()} × ${tier2Rate}% = $${tier2Commission.toLocaleString()}`);
        remaining -= tier2Amount;
      }
      
      // Tier 3
      if (remaining > 0) {
        const tier3Commission = remaining * (tier3Rate / 100);
        commission += tier3Commission;
        details.push(`Tier 3: $${remaining.toLocaleString()} × ${tier3Rate}% = $${tier3Commission.toLocaleString()}`);
      }
      break;
  }

  const totalEarnings = baseSalary + commission + bonus;
  const commissionRate = salesAmount > 0 ? ((commission / salesAmount) * 100).toFixed(2) : 0;

  document.getElementById("commission-result").innerHTML = `
    <div class="insight-card success">
      <h6>💰 Total Compensation</h6>
      <div style="font-size: 2.2em; font-weight: bold; color: #28a745; margin: 0.5em 0;">
        $${totalEarnings.toLocaleString()}
      </div>
      <p style="margin: 0; color: #666;">
        Effective commission rate: ${commissionRate}%
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
      ${baseSalary > 0 ? `
      <div class="insight-card">
        <h6>🏢 Base Salary</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #007bff;">
          $${baseSalary.toLocaleString()}
        </div>
        <small>Fixed portion</small>
      </div>` : ''}
      
      <div class="insight-card warning">
        <h6>📈 Commission</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #856404;">
          $${commission.toLocaleString()}
        </div>
        <small>From sales</small>
      </div>
      
      ${bonus > 0 ? `
      <div class="insight-card">
        <h6>🎁 Bonuses</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #6c757d;">
          $${bonus.toLocaleString()}
        </div>
        <small>Additional payments</small>
      </div>` : ''}
    </div>

    <div class="insight-card info">
      <h6>📋 Calculation Details</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="margin-bottom: 1rem;">
          <strong>Sales Volume:</strong> $${salesAmount.toLocaleString()}<br>
          <strong>Commission Scheme:</strong> ${getCommissionTypeName(commissionType)}
        </div>
        ${details.map(detail => `<div style="margin-bottom: 0.5rem;">• ${detail}</div>`).join('')}
        ${bonus > 0 ? `<div style="margin-top: 1rem;"><strong>Bonuses:</strong> $${bonus.toLocaleString()}</div>` : ''}
      </div>
    </div>

    <div class="insight-card">
      <h6>📊 Analytics</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9em;">
          <div><strong>Commission income:</strong></div>
          <div>${((commission / totalEarnings) * 100).toFixed(1)}% of total income</div>
          
          <div><strong>Income per $1000 sales:</strong></div>
          <div>$${salesAmount > 0 ? ((totalEarnings / salesAmount) * 1000).toFixed(0) : 0}</div>
          
          <div><strong>Company profitability:</strong></div>
          <div>${salesAmount > 0 ? (((salesAmount - totalEarnings) / salesAmount) * 100).toFixed(1) : 0}%</div>
        </div>
      </div>
    </div>

    ${generateMotivationTips(commissionType, salesAmount, commission, totalEarnings)}
  `;
});

function getCommissionTypeName(type) {
  const names = {
    'fixed': 'Fixed Commission',
    'combined': 'Salary + Commission',
    'progressive': 'Progressive Commission',
    'tiered': 'Tiered Commission'
  };
  return names[type] || type;
}

function generateMotivationTips(type, sales, commission, total) {
  let tips = [];

  if (type === 'progressive') {
    tips.push("Progressive schemes motivate exceeding targets");
    tips.push("Consider additional bonuses for achieving key performance indicators");
  }

  if (commission < total * 0.3) {
    tips.push("Low commission share may reduce sales motivation");
  }

  if (sales > 200000) {
    tips.push("For large volumes, consider separate bonuses for key accounts");
  }

  tips.push("Regularly review commission schemes according to market conditions");
  tips.push("Consider business seasonality when setting targets");

  return `
    <div class="insight-card">
      <h6>💡 Motivation Tips</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <ul style="margin: 0; padding-left: 1.5rem;">
          ${tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}