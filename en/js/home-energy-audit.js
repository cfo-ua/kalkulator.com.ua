document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("energy-audit-form");
  if (!form) return;

  // Energy efficiency factors and improvement opportunities
  const efficiencyFactors = {
    heating: {
      "gas-furnace": { efficiency: 0.85, cost: 1.0 },
      "electric-heat-pump": { efficiency: 2.5, cost: 0.9 },
      "electric-resistance": { efficiency: 1.0, cost: 1.5 },
      "oil-furnace": { efficiency: 0.82, cost: 1.2 },
      "boiler": { efficiency: 0.88, cost: 1.1 }
    },
    cooling: {
      "central-ac": { efficiency: 3.0, cost: 1.0 },
      "heat-pump": { efficiency: 3.2, cost: 0.9 },
      "window-units": { efficiency: 2.5, cost: 1.2 },
      "none": { efficiency: 0, cost: 0 }
    },
    insulation: {
      poor: { rValue: 10, heatLoss: 1.4 },
      fair: { rValue: 20, heatLoss: 1.2 },
      good: { rValue: 35, heatLoss: 1.0 },
      excellent: { rValue: 50, heatLoss: 0.8 }
    },
    windows: {
      single: { uValue: 1.1, cost: 1.3 },
      double: { uValue: 0.6, cost: 1.0 },
      triple: { uValue: 0.3, cost: 0.8 },
      storm: { uValue: 0.5, cost: 0.9 }
    },
    airLeakage: {
      high: { infiltration: 1.5 },
      moderate: { infiltration: 1.2 },
      low: { infiltration: 1.0 }
    }
  };

  // Improvement recommendations database
  const improvements = {
    airSealing: {
      name: "Air Sealing",
      cost: 800,
      savings: 0.15,
      payback: 2,
      description: "Seal air leaks around windows, doors, outlets, and other penetrations"
    },
    atticInsulation: {
      name: "Attic Insulation",
      cost: 1500,
      savings: 0.12,
      payback: 3,
      description: "Upgrade attic insulation to R-38 to R-50"
    },
    wallInsulation: {
      name: "Wall Insulation",
      cost: 3500,
      savings: 0.08,
      payback: 8,
      description: "Add insulation to exterior walls"
    },
    windowUpgrade: {
      name: "Window Upgrades",
      cost: 8000,
      savings: 0.10,
      payback: 15,
      description: "Replace with Energy Star certified windows"
    },
    hvacUpgrade: {
      name: "HVAC System Upgrade",
      cost: 6000,
      savings: 0.20,
      payback: 8,
      description: "Replace with high-efficiency heating/cooling system"
    },
    smartThermostat: {
      name: "Smart Thermostat",
      cost: 250,
      savings: 0.08,
      payback: 1.5,
      description: "Install programmable or smart thermostat"
    },
    waterHeaterUpgrade: {
      name: "Water Heater Upgrade",
      cost: 1200,
      savings: 0.06,
      payback: 8,
      description: "Replace with high-efficiency unit"
    },
    ledLighting: {
      name: "LED Lighting Conversion",
      cost: 300,
      savings: 0.04,
      payback: 1,
      description: "Replace all bulbs with LED lighting"
    },
    ductSealing: {
      name: "Duct Sealing",
      cost: 600,
      savings: 0.10,
      payback: 3,
      description: "Seal and insulate HVAC ductwork"
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const homeSize = parseFloat(document.getElementById("homeSize").value);
    const homeAge = parseInt(document.getElementById("homeAge").value);
    const homeType = document.getElementById("homeType").value;
    const stories = document.getElementById("stories").value;
    const monthlyElectric = parseFloat(document.getElementById("monthlyElectric").value);
    const monthlyGas = parseFloat(document.getElementById("monthlyGas").value);
    const electricRate = parseFloat(document.getElementById("electricRate").value);
    const gasRate = parseFloat(document.getElementById("gasRate").value);
    const heatingType = document.getElementById("heatingType").value;
    const heatingAge = parseInt(document.getElementById("heatingAge").value);
    const coolingType = document.getElementById("coolingType").value;
    const programmableThermostat = document.getElementById("programmableThermostat").value;
    const insulationLevel = document.getElementById("insulationLevel").value;
    const windowType = document.getElementById("windowType").value;
    const airLeakage = document.getElementById("airLeakage").value;
    const waterHeaterType = document.getElementById("waterHeaterType").value;
    const waterHeaterAge = parseInt(document.getElementById("waterHeaterAge").value);
    const waterHeaterInsulation = document.getElementById("waterHeaterInsulation").value;
    const lightingType = document.getElementById("lightingType").value;
    const applianceAge = document.getElementById("applianceAge").value;
    const energyStarAppliances = document.getElementById("energyStarAppliances").value;
    const climateZone = document.getElementById("climateZone").value;
    const heatingDegreeDays = parseInt(document.getElementById("heatingDegreeeDays").value);
    const coolingDegreeDays = parseInt(document.getElementById("coolingDegreeDays").value);

    // Calculate current energy usage breakdown
    const currentUsage = calculateCurrentUsage({
      homeSize, monthlyElectric, monthlyGas, electricRate, gasRate,
      heatingType, coolingType, heatingDegreeDays, coolingDegreeDays
    });

    // Calculate energy efficiency score
    const efficiencyScore = calculateEfficiencyScore({
      homeAge, heatingType, heatingAge, coolingType, insulationLevel,
      windowType, airLeakage, waterHeaterType, waterHeaterAge,
      lightingType, applianceAge, programmableThermostat
    });

    // Generate improvement recommendations
    const recommendations = generateRecommendations({
      homeSize, homeAge, currentUsage, efficiencyScore,
      heatingType, heatingAge, coolingType, insulationLevel,
      windowType, airLeakage, programmableThermostat, lightingType,
      waterHeaterType, waterHeaterAge
    });

    // Calculate potential savings
    const savingsAnalysis = calculateSavingsAnalysis(currentUsage, recommendations);

    // Generate priority improvement plan
    const improvementPlan = generateImprovementPlan(recommendations, currentUsage.total);

    // Display results
    displayResults({
      currentUsage,
      efficiencyScore,
      recommendations,
      savingsAnalysis,
      improvementPlan,
      homeSize,
      homeAge,
      climateZone
    });

    // Show energy breakdown chart
    showEnergyChart(currentUsage, savingsAnalysis);
  });

  function calculateCurrentUsage(data) {
    const electricUsage = data.monthlyElectric / data.electricRate; // kWh
    const gasUsage = data.monthlyGas / data.gasRate; // therms
    
    // Estimate breakdown based on typical home patterns
    const heatingPercent = Math.min(0.6, data.heatingDegreeDays / 8000);
    const coolingPercent = Math.min(0.3, data.coolingDegreeDays / 3000);
    const basePercent = 1 - heatingPercent - coolingPercent;

    const breakdown = {
      heating: data.monthlyGas * heatingPercent + data.monthlyElectric * 0.1,
      cooling: data.monthlyElectric * coolingPercent,
      waterHeating: data.monthlyGas * 0.3 + data.monthlyElectric * 0.15,
      lighting: data.monthlyElectric * 0.12,
      appliances: data.monthlyElectric * 0.35,
      other: data.monthlyElectric * basePercent + data.monthlyGas * 0.1
    };

    breakdown.total = data.monthlyElectric + data.monthlyGas;
    breakdown.annual = breakdown.total * 12;
    breakdown.perSqFt = breakdown.total / data.homeSize;

    return breakdown;
  }

  function calculateEfficiencyScore(data) {
    let score = 50; // Base score

    // Heating system efficiency
    const heatingFactor = efficiencyFactors.heating[data.heatingType];
    if (heatingFactor) {
      score += (heatingFactor.efficiency - 1) * 10;
      score -= Math.max(0, (data.heatingAge - 10) * 2); // Age penalty
    }

    // Insulation quality
    const insulationFactor = efficiencyFactors.insulation[data.insulationLevel];
    if (insulationFactor) {
      score += (insulationFactor.rValue - 20) / 2;
    }

    // Window efficiency
    const windowFactor = efficiencyFactors.windows[data.windowType];
    if (windowFactor) {
      score += (0.6 - windowFactor.uValue) * 20;
    }

    // Air sealing
    const airFactor = efficiencyFactors.airLeakage[data.airLeakage];
    if (airFactor) {
      score += (1.5 - airFactor.infiltration) * 15;
    }

    // Thermostat control
    if (data.programmableThermostat === "smart") score += 8;
    else if (data.programmableThermostat === "basic") score += 4;

    // Lighting efficiency
    if (data.lightingType === "led") score += 8;
    else if (data.lightingType === "cfl") score += 4;
    else if (data.lightingType === "incandescent") score -= 5;

    // Water heater age
    score -= Math.max(0, (data.waterHeaterAge - 8) * 1.5);

    // Home age factor
    score -= Math.max(0, (data.homeAge - 20) * 0.5);

    return {
      score: Math.max(0, Math.min(100, score)),
      rating: getEfficiencyRating(score)
    };
  }

  function getEfficiencyRating(score) {
    if (score >= 85) return { level: "Excellent", class: "success", description: "Highly efficient home" };
    if (score >= 70) return { level: "Good", class: "success", description: "Above average efficiency" };
    if (score >= 55) return { level: "Fair", class: "warning", description: "Average efficiency" };
    if (score >= 40) return { level: "Poor", class: "warning", description: "Below average efficiency" };
    return { level: "Very Poor", class: "error", description: "Significant improvements needed" };
  }

  function generateRecommendations(data) {
    const recs = [];

    // Air sealing (almost always recommended)
    if (data.airLeakage !== "low") {
      recs.push({
        ...improvements.airSealing,
        priority: 1,
        applicable: true
      });
    }

    // Insulation upgrades
    if (data.insulationLevel === "poor" || data.insulationLevel === "fair") {
      recs.push({
        ...improvements.atticInsulation,
        priority: data.insulationLevel === "poor" ? 1 : 2,
        applicable: true
      });

      if (data.insulationLevel === "poor") {
        recs.push({
          ...improvements.wallInsulation,
          priority: 3,
          applicable: true
        });
      }
    }

    // HVAC system upgrade
    if (data.heatingAge > 15 || data.heatingType === "electric-resistance") {
      recs.push({
        ...improvements.hvacUpgrade,
        priority: data.heatingAge > 20 ? 2 : 3,
        applicable: true
      });
    }

    // Smart thermostat
    if (data.programmableThermostat === "no") {
      recs.push({
        ...improvements.smartThermostat,
        priority: 1,
        applicable: true
      });
    }

    // Window upgrades
    if (data.windowType === "single") {
      recs.push({
        ...improvements.windowUpgrade,
        priority: 4,
        applicable: true
      });
    }

    // Water heater upgrade
    if (data.waterHeaterAge > 12 || data.waterHeaterType === "electric-tank") {
      recs.push({
        ...improvements.waterHeaterUpgrade,
        priority: 3,
        applicable: true
      });
    }

    // LED lighting
    if (data.lightingType !== "led") {
      recs.push({
        ...improvements.ledLighting,
        priority: 1,
        applicable: true
      });
    }

    // Duct sealing (for older homes with central systems)
    if (data.homeAge > 10 && data.heatingType.includes("furnace")) {
      recs.push({
        ...improvements.ductSealing,
        priority: 2,
        applicable: true
      });
    }

    // Sort by priority and payback period
    return recs.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.payback - b.payback;
    });
  }

  function calculateSavingsAnalysis(currentUsage, recommendations) {
    let totalInvestment = 0;
    let totalAnnualSavings = 0;
    let cumulativeSavings = 0;

    const implementedSavings = recommendations.map(rec => {
      if (rec.applicable) {
        const annualSaving = currentUsage.annual * rec.savings;
        totalInvestment += rec.cost;
        totalAnnualSavings += annualSaving;
        cumulativeSavings += annualSaving;

        return {
          ...rec,
          annualSaving: annualSaving,
          lifetimeSaving: annualSaving * 15, // 15-year analysis
          actualPayback: rec.cost / annualSaving
        };
      }
      return rec;
    });

    return {
      totalInvestment,
      totalAnnualSavings,
      totalLifetimeSavings: totalAnnualSavings * 15,
      averagePayback: totalInvestment / totalAnnualSavings,
      roi: (totalAnnualSavings * 15 - totalInvestment) / totalInvestment * 100,
      recommendations: implementedSavings
    };
  }

  function generateImprovementPlan(recommendations, currentAnnualCost) {
    const phases = [
      {
        phase: "Phase 1: Quick Wins (Year 1)",
        budget: 2000,
        items: [],
        totalCost: 0,
        totalSavings: 0
      },
      {
        phase: "Phase 2: Major Improvements (Years 2-3)", 
        budget: 8000,
        items: [],
        totalCost: 0,
        totalSavings: 0
      },
      {
        phase: "Phase 3: System Upgrades (Years 4-5)",
        budget: 15000,
        items: [],
        totalCost: 0,
        totalSavings: 0
      }
    ];

    let remainingRecs = [...recommendations];

    // Phase 1: Low-cost, high-impact improvements
    phases[0].items = remainingRecs.filter(rec => 
      rec.applicable && rec.cost <= 1000 && rec.payback <= 3
    );

    // Phase 2: Medium-cost improvements
    const phase1Items = phases[0].items.map(item => item.name);
    remainingRecs = remainingRecs.filter(rec => !phase1Items.includes(rec.name));
    
    phases[1].items = remainingRecs.filter(rec =>
      rec.applicable && rec.cost <= 5000
    );

    // Phase 3: Major system upgrades
    const phase2Items = phases[1].items.map(item => item.name);
    remainingRecs = remainingRecs.filter(rec => !phase2Items.includes(rec.name));
    
    phases[2].items = remainingRecs.filter(rec => rec.applicable);

    // Calculate phase totals
    phases.forEach(phase => {
      phase.totalCost = phase.items.reduce((sum, item) => sum + item.cost, 0);
      phase.totalSavings = phase.items.reduce((sum, item) => 
        sum + (currentAnnualCost * item.savings), 0
      );
      phase.payback = phase.totalCost / (phase.totalSavings || 1);
    });

    return phases;
  }

  function displayResults(data) {
    const resultBlock = document.getElementById("energy-audit-result");
    
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${data.efficiencyScore.rating.class}">
          <h6>⭐ Efficiency Score</h6>
          <div class="big-number">${data.efficiencyScore.score}</div>
          <p class="insight-detail">${data.efficiencyScore.rating.level}</p>
        </div>
        <div class="insight-card warning">
          <h6>💰 Annual Energy Cost</h6>
          <div class="big-number">$${data.currentUsage.annual.toLocaleString()}</div>
          <p class="insight-detail">current spending</p>
        </div>
        <div class="insight-card success">
          <h6>📉 Potential Savings</h6>
          <div class="big-number">$${data.savingsAnalysis.totalAnnualSavings.toFixed(0)}</div>
          <p class="insight-detail">annual with improvements</p>
        </div>
        <div class="insight-card info">
          <h6>⏱️ Payback Period</h6>
          <div class="big-number">${data.savingsAnalysis.averagePayback.toFixed(1)}</div>
          <p class="insight-detail">years average</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">🏠 Home Energy Performance Analysis</h4>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: ${data.efficiencyScore.rating.class === 'success' ? '#e8f8e8' : data.efficiencyScore.rating.class === 'warning' ? '#fff8e1' : '#ffe8e8'}; 
                    border-radius: 8px; border: 2px solid ${data.efficiencyScore.rating.class === 'success' ? '#28a745' : data.efficiencyScore.rating.class === 'warning' ? '#ffc107' : '#dc3545'};">
          <p style="margin: 0;"><strong>📊 Overall Assessment:</strong> Your home scores ${data.efficiencyScore.score}/100 (${data.efficiencyScore.rating.description})</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <h5>🏠 Home Profile</h5>
            <p><strong>Size:</strong> ${data.homeSize} sq ft</p>
            <p><strong>Age:</strong> ${data.homeAge} years</p>
            <p><strong>Climate Zone:</strong> ${data.climateZone}</p>
            <p><strong>Energy Cost per Sq Ft:</strong> $${data.currentUsage.perSqFt.toFixed(2)}/month</p>
          </div>
          
          <div>
            <h5>💡 Current Energy Usage</h5>
            <p><strong>Monthly Total:</strong> $${data.currentUsage.total.toFixed(0)}</p>
            <p><strong>Annual Total:</strong> $${data.currentUsage.annual.toLocaleString()}</p>
            <p><strong>Heating:</strong> $${data.currentUsage.heating.toFixed(0)}</p>
            <p><strong>Cooling:</strong> $${data.currentUsage.cooling.toFixed(0)}</p>
            <p><strong>Water Heating:</strong> $${data.currentUsage.waterHeating.toFixed(0)}</p>
          </div>
          
          <div>
            <h5>📈 Improvement Potential</h5>
            <p><strong>Total Investment:</strong> $${data.savingsAnalysis.totalInvestment.toLocaleString()}</p>
            <p><strong>Annual Savings:</strong> $${data.savingsAnalysis.totalAnnualSavings.toFixed(0)}</p>
            <p><strong>15-Year Savings:</strong> $${data.savingsAnalysis.totalLifetimeSavings.toLocaleString()}</p>
            <p><strong>ROI:</strong> ${data.savingsAnalysis.roi.toFixed(0)}%</p>
          </div>
        </div>

        <h5>🎯 Prioritized Improvement Recommendations</h5>
        <div style="margin-bottom: 2rem;">
          ${data.recommendations.filter(rec => rec.applicable).map((rec, index) => `
            <div style="display: grid; grid-template-columns: auto 1fr auto auto auto; gap: 1rem; align-items: center; 
                        padding: 1rem; margin-bottom: 0.5rem; background: white; border-radius: 8px; 
                        border-left: 4px solid ${rec.priority === 1 ? '#f44336' : rec.priority === 2 ? '#ff9800' : '#4caf50'};">
              <span style="font-weight: 600; color: ${rec.priority === 1 ? '#f44336' : rec.priority === 2 ? '#ff9800' : '#4caf50'};">
                #${index + 1}
              </span>
              <div>
                <p style="margin: 0; font-weight: 600;">${rec.name}</p>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: #666;">${rec.description}</p>
              </div>
              <span style="font-weight: 600;">$${rec.cost.toLocaleString()}</span>
              <span style="color: #28a745;">$${(data.currentUsage.annual * rec.savings).toFixed(0)}/yr</span>
              <span style="color: #1976d2;">${rec.payback.toFixed(1)} yrs</span>
            </div>
          `).join('')}
        </div>

        <h5>📅 Phased Implementation Plan</h5>
        <div style="display: grid; gap: 1.5rem; margin-bottom: 2rem;">
          ${data.improvementPlan.map(phase => `
            <div style="padding: 1rem; background: white; border-radius: 8px; border: 2px solid #e0e0e0;">
              <h6 style="margin-top: 0; color: var(--accent);">${phase.phase}</h6>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <p><strong>Total Cost:</strong> $${phase.totalCost.toLocaleString()}</p>
                <p><strong>Annual Savings:</strong> $${phase.totalSavings.toFixed(0)}</p>
                <p><strong>Payback:</strong> ${phase.payback.toFixed(1)} years</p>
                <p><strong>Items:</strong> ${phase.items.length}</p>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem;">
                ${phase.items.map(item => `
                  <div style="padding: 0.5rem; background: #f8f9fa; border-radius: 4px; font-size: 0.9rem;">
                    ✓ ${item.name} ($${item.cost.toLocaleString()})
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <h6 style="margin-top: 0; color: #1976d2;">💡 Energy Saving Tips</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Set thermostat to 68°F in winter, 78°F in summer</li>
              <li>Use ceiling fans to improve comfort</li>
              <li>Unplug electronics when not in use</li>
              <li>Run dishwasher and washing machine with full loads</li>
            </ul>
          </div>
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border: 2px solid #28a745;">
            <h6 style="margin-top: 0; color: #28a745;">🎯 Next Steps</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Start with Phase 1 quick wins</li>
              <li>Get professional energy audit for detailed analysis</li>
              <li>Research utility rebates and tax incentives</li>
              <li>Consider financing options for major improvements</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function showEnergyChart(currentUsage, savingsAnalysis) {
    const chartBlock = document.getElementById("energy-audit-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("energy-audit-chart").getContext("2d");
      if (window.energyAuditChart) window.energyAuditChart.destroy();

      const labels = ['Heating', 'Cooling', 'Water Heating', 'Lighting', 'Appliances', 'Other'];
      const currentData = [
        currentUsage.heating,
        currentUsage.cooling,
        currentUsage.waterHeating,
        currentUsage.lighting,
        currentUsage.appliances,
        currentUsage.other
      ];

      const improvedData = currentData.map(value => 
        value * (1 - savingsAnalysis.totalAnnualSavings / currentUsage.annual)
      );

      window.energyAuditChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Current Monthly Cost",
            data: currentData,
            backgroundColor: '#ff9800',
            borderWidth: 2,
            borderColor: '#fff'
          }, {
            label: "After Improvements",
            data: improvedData,
            backgroundColor: '#4caf50',
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Energy Cost Breakdown: Current vs. Improved'
            },
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Monthly Cost ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toFixed(0);
                }
              }
            }
          }
        }
      });
    });
  }
});

// Ensure Chart.js is loaded
function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}