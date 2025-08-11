document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('robotics-maintenance-form');
  const result = document.getElementById('maintenance-result');

  // Maintenance cost factors by robot type (% of robot cost annually)
  const robotTypeFactors = {
    articulated: { base: 0.08, complexity: 1.2 },    // 8% base, higher complexity
    delta: { base: 0.06, complexity: 0.9 },          // 6% base, simpler design
    scara: { base: 0.07, complexity: 1.0 },          // 7% base, moderate complexity
    collaborative: { base: 0.05, complexity: 0.8 },  // 5% base, newer design
    mobile: { base: 0.10, complexity: 1.4 },         // 10% base, moving parts
    welding: { base: 0.12, complexity: 1.5 }         // 12% base, harsh environment
  };

  // Environment impact multipliers
  const environmentFactors = {
    normal: 1.0,
    dusty: 1.3,
    humid: 1.2,
    extreme: 1.6
  };

  // Workload impact multipliers
  const workloadFactors = {
    light: 0.8,
    moderate: 1.0,
    heavy: 1.4
  };

  // Age-based multipliers (maintenance costs increase with age)
  function getAgeFactor(age) {
    if (age <= 2) return 0.7;
    if (age <= 5) return 1.0;
    if (age <= 8) return 1.3;
    if (age <= 12) return 1.7;
    return 2.2; // Very old robots
  }

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPercent(percent) {
    return percent.toFixed(1) + '%';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const robotCost = parseFloat(document.getElementById('robot-cost').value);
    const robotCount = parseInt(document.getElementById('robot-count').value);
    const robotType = document.querySelector('input[name="robot-type"]:checked').value;
    const dailyHours = parseInt(document.getElementById('daily-hours').value);
    const workingDays = parseInt(document.getElementById('working-days').value);
    const environment = document.querySelector('input[name="environment"]:checked').value;
    const workload = document.querySelector('input[name="workload"]:checked').value;
    const downtimeCost = parseFloat(document.getElementById('downtime-cost').value);
    const robotAge = parseInt(document.getElementById('robot-age').value);
    const calculationYears = parseInt(document.getElementById('calculation-years').value);

    // Additional factors
    const serviceContract = document.getElementById('service-contract').checked;
    const sparePartsStock = document.getElementById('spare-parts-stock').checked;
    const staffTraining = document.getElementById('staff-training').checked;
    const preventivePlus = document.getElementById('preventive-plus').checked;

    // Calculate basic metrics
    const totalRobotValue = robotCost * robotCount;
    const annualHours = dailyHours * workingDays;
    const utilizationRate = annualHours / (24 * 365); // Utilization as fraction of year

    // Get factors
    const typeData = robotTypeFactors[robotType];
    const envFactor = environmentFactors[environment];
    const workloadFactor = workloadFactors[workload];
    const ageFactor = getAgeFactor(robotAge);
    const utilizationFactor = 0.5 + (utilizationRate * 0.8); // Base 50% + utilization impact

    // Calculate annual maintenance costs
    const baseMaintenancePct = typeData.base * envFactor * workloadFactor * ageFactor * utilizationFactor;
    const plannedMaintenance = totalRobotValue * baseMaintenancePct;
    
    // Unplanned maintenance (typically 40-60% of planned)
    const unplannedMaintenance = plannedMaintenance * 0.5 * typeData.complexity;
    
    // Software and licensing (2-3% annually)
    const softwareCosts = totalRobotValue * 0.025;

    // Training costs (one-time if selected)
    const trainingCosts = staffTraining ? (robotCount * 2000) : 0;

    // Spare parts stock (one-time if selected)
    const sparePartsCosts = sparePartsStock ? (totalRobotValue * 0.02) : 0;

    // Service contract (annual if selected)
    const serviceContractCosts = serviceContract ? (totalRobotValue * 0.03) : 0;

    // Enhanced preventive maintenance
    const preventiveEnhancement = preventivePlus ? (plannedMaintenance * 0.5) : 0;

    // Downtime calculations
    // Estimate downtime hours per year based on robot type and conditions
    let estimatedDowntimeHours = typeData.base * 40; // Base hours per year
    estimatedDowntimeHours *= envFactor * workloadFactor * ageFactor;
    estimatedDowntimeHours *= robotCount;
    
    const downtimeCosts = estimatedDowntimeHours * downtimeCost;

    // Calculate totals
    const annualPlannedCosts = plannedMaintenance + preventiveEnhancement;
    const annualUnplannedCosts = unplannedMaintenance + downtimeCosts;
    const annualRecurringCosts = annualPlannedCosts + annualUnplannedCosts + softwareCosts + serviceContractCosts;
    const oneTimeCosts = trainingCosts + sparePartsCosts;

    const totalAnnualCosts = annualRecurringCosts;
    const totalPeriodCosts = (totalAnnualCosts * calculationYears) + oneTimeCosts;

    // Calculate percentages
    const maintenancePctOfValue = (totalAnnualCosts / totalRobotValue) * 100;

    // Robot type names for display
    const robotTypeNames = {
      articulated: 'Articulated Robot',
      delta: 'Delta Robot',
      scara: 'SCARA Robot',
      collaborative: 'Collaborative Robot',
      mobile: 'Mobile Robot (AGV)',
      welding: 'Welding Robot'
    };

    const environmentNames = {
      normal: 'Normal conditions',
      dusty: 'Dusty environment',
      humid: 'High humidity',
      extreme: 'Extreme conditions'
    };

    const workloadNames = {
      light: 'Light workload',
      moderate: 'Moderate workload',
      heavy: 'Heavy workload'
    };

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>💰 Annual Costs</h6>
          <div style="font-size: 2em; font-weight: bold; color: #f39c12;">
            ${formatCurrency(totalAnnualCosts)}
          </div>
          <small>${formatPercent(maintenancePctOfValue)} of robot value</small>
        </div>
        
        <div class="insight-card info">
          <h6>⏰ Downtime</h6>
          <div style="font-size: 1.8em; font-weight: bold; color: var(--accent);">
            ${estimatedDowntimeHours.toFixed(0)} hours
          </div>
          <small>per year for all robots</small>
        </div>
        
        <div class="insight-card">
          <h6>🔧 Planned Maintenance</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${formatCurrency(annualPlannedCosts)}
          </div>
          <small>annually</small>
        </div>
        
        <div class="insight-card success">
          <h6>📊 Total Cost</h6>
          <div style="font-size: 1.5em; font-weight: bold; color: #28a745;">
            ${formatCurrency(totalPeriodCosts)}
          </div>
          <small>over ${calculationYears} years</small>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Detailed Analysis</h3>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>🤖 Equipment Parameters</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Robot type:</strong> ${robotTypeNames[robotType]}</li>
            <li><strong>Quantity:</strong> ${robotCount} units</li>
            <li><strong>Total value:</strong> ${formatCurrency(totalRobotValue)}</li>
            <li><strong>Equipment age:</strong> ${robotAge} years</li>
            <li><strong>Annual operation:</strong> ${annualHours.toLocaleString()} hours (${formatPercent(utilizationRate * 100)} utilization)</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>🏭 Operating Conditions</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Environment:</strong> ${environmentNames[environment]} (factor ${envFactor})</li>
            <li><strong>Workload:</strong> ${workloadNames[workload]} (factor ${workloadFactor})</li>
            <li><strong>Age impact:</strong> factor ${ageFactor}</li>
            <li><strong>Downtime cost:</strong> ${formatCurrency(downtimeCost)}/hour</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💰 Annual Cost Breakdown</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Planned maintenance</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(plannedMaintenance)}</td>
            </tr>
            ${preventivePlus ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Enhanced preventive maintenance</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(preventiveEnhancement)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Unplanned repairs</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(unplannedMaintenance)}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Downtime losses</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(downtimeCosts)}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Software & licensing</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(softwareCosts)}</td>
            </tr>
            ${serviceContract ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Service contract</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(serviceContractCosts)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Total annual costs</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalAnnualCosts)}</td>
            </tr>
          </table>
        </div>

        ${oneTimeCosts > 0 ? `
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💵 One-time Costs</h4>
          <table style="width: 100%; border-collapse: collapse;">
            ${staffTraining ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Staff training</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(trainingCosts)}</td>
            </tr>` : ''}
            ${sparePartsStock ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Spare parts inventory</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(sparePartsCosts)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Total one-time costs</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(oneTimeCosts)}</td>
            </tr>
          </table>
        </div>` : ''}

        <div style="background: ${maintenancePctOfValue <= 10 ? '#f8fff9' : maintenancePctOfValue <= 15 ? '#fff8e1' : '#fff8f8'}; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 2px solid ${maintenancePctOfValue <= 10 ? '#28a745' : maintenancePctOfValue <= 15 ? '#ffc107' : '#dc3545'};">
          <h4 style="color: ${maintenancePctOfValue <= 10 ? '#28a745' : maintenancePctOfValue <= 15 ? '#f39c12' : '#dc3545'};">
            ${maintenancePctOfValue <= 10 ? '✅' : maintenancePctOfValue <= 15 ? '⚠️' : '🚨'} Cost Analysis for ${calculationYears} years
          </h4>
          <p style="font-size: 1.2em; margin: 0.5rem 0;">
            <strong>Total costs: ${formatCurrency(totalPeriodCosts)}</strong>
          </p>
          <p style="margin: 0.5rem 0;">
            Annual maintenance costs: <strong>${formatPercent(maintenancePctOfValue)}</strong> of equipment value
          </p>
          <p style="margin: 0.5rem 0;">
            Average monthly costs: <strong>${formatCurrency(totalAnnualCosts / 12)}</strong>
          </p>
          ${maintenancePctOfValue <= 10 ? 
            `<p style="margin: 0.5rem 0; color: #28a745;">💡 Excellent cost level! Equipment is efficiently operated.</p>` :
            maintenancePctOfValue <= 15 ?
            `<p style="margin: 0.5rem 0; color: #f39c12;">⚠️ Moderate costs. Consider optimization opportunities.</p>` :
            `<p style="margin: 0.5rem 0; color: #dc3545;">🚨 High costs! Root cause analysis and optimization plan needed.</p>`
          }
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📈 Annual Projection</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Year</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Annual Costs</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Cumulative Costs</strong></td>
            </tr>
            ${Array.from({length: calculationYears}, (_, i) => {
              const year = i + 1;
              const yearlyMultiplier = 1 + (i * 0.03); // 3% annual increase
              const yearlyCost = totalAnnualCosts * yearlyMultiplier;
              const cumulativeCost = oneTimeCosts + (totalAnnualCosts * year * (1 + (i * 0.015)));
              return `
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.5rem;">Year ${year}</td>
                <td style="padding: 0.5rem; text-align: right;">${formatCurrency(yearlyCost)}</td>
                <td style="padding: 0.5rem; text-align: right;">${formatCurrency(cumulativeCost)}</td>
              </tr>`;
            }).join('')}
          </table>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💡 Recommendations</h4>
          <ul style="margin: 0.5rem 0;">
            ${estimatedDowntimeHours > 50 ? 
              '<li style="color: #dc3545;">🚨 High downtime levels. Consider improving planned maintenance.</li>' : 
              '<li style="color: #28a745;">✅ Acceptable downtime levels.</li>'
            }
            ${maintenancePctOfValue > 15 ? 
              '<li style="color: #f39c12;">⚠️ Consider upgrading or replacing aging equipment.</li>' : 
              '<li style="color: #28a745;">✅ Cost-effective maintenance.</li>'
            }
            ${!serviceContract && totalRobotValue > 100000 ? 
              '<li style="color: #007bff;">💡 For expensive equipment, consider service contracts.</li>' : ''
            }
            ${!preventivePlus && maintenancePctOfValue > 12 ? 
              '<li style="color: #007bff;">💡 Enhanced preventive maintenance may reduce total costs.</li>' : ''
            }
            <li>📊 Maintain detailed failure statistics to optimize maintenance schedules.</li>
            <li>🎓 Regularly train staff for early problem detection.</li>
            <li>🔍 Implement condition monitoring for predictive maintenance.</li>
            <li>📋 Establish supplier relationships for critical spare parts.</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📊 Industry Benchmarks</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Your maintenance rate</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatPercent(maintenancePctOfValue)}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Industry average</td>
              <td style="padding: 0.5rem; text-align: right;">8-12%</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Best practice</td>
              <td style="padding: 0.5rem; text-align: right;">5-8%</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Replacement threshold</td>
              <td style="padding: 0.5rem; text-align: right;">>25%</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  });
});