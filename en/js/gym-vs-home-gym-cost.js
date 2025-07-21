document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("gym-cost-form");
  if (!form) return;

  // Equipment cost database
  const equipmentCosts = {
    basic: {
      cost: 1000,
      equipment: [
        "Adjustable dumbbells (20-50 lbs)",
        "Resistance bands set",
        "Exercise mat",
        "Stability ball",
        "Jump rope"
      ]
    },
    intermediate: {
      cost: 2750,
      equipment: [
        "Adjustable dumbbells (5-75 lbs)",
        "Adjustable bench",
        "Resistance bands + suspension trainer",
        "Kettlebell set (15-35 lbs)",
        "Exercise mat + foam roller",
        "Pull-up bar"
      ]
    },
    advanced: {
      cost: 6000,
      equipment: [
        "Power rack with pull-up bar",
        "Olympic barbell + weight plates (300 lbs)",
        "Adjustable bench",
        "Adjustable dumbbells (5-90 lbs)",
        "Cardio machine (treadmill or elliptical)",
        "Complete cable system"
      ]
    },
    professional: {
      cost: 12000,
      equipment: [
        "Commercial power rack system",
        "Full Olympic weight set (500+ lbs)",
        "Premium cardio machines (2-3)",
        "Functional trainer cable system",
        "Complete dumbbell set",
        "Specialty equipment (rowing, etc.)"
      ]
    }
  };

  // Equipment category costs for custom setup
  const categoryEquipment = {
    cardioEquipment: {
      cost: 1500,
      items: ["Treadmill or elliptical", "Rowing machine", "Exercise bike"]
    },
    strengthEquipment: {
      cost: 2000,
      items: ["Power rack", "Barbell + plates", "Adjustable bench", "Dumbbells"]
    },
    functionalEquipment: {
      cost: 800,
      items: ["Kettlebells", "Medicine balls", "Suspension trainer", "Resistance bands"]
    },
    accessoryEquipment: {
      cost: 500,
      items: ["Exercise mats", "Foam rollers", "Heart rate monitor", "Sound system"]
    }
  };

  // Show/hide custom cost input based on selection
  document.getElementById("homeGymLevel").addEventListener("change", function() {
    const customInput = document.getElementById("customEquipmentCost");
    if (this.value === "custom") {
      customInput.style.display = "block";
      customInput.required = true;
    } else {
      customInput.style.display = "none";
      customInput.required = false;
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const gymMembership = parseFloat(document.getElementById("gymMembership").value);
    const initiationFee = parseFloat(document.getElementById("initiationFee").value);
    const annualFee = parseFloat(document.getElementById("annualFee").value);
    const personalTraining = parseFloat(document.getElementById("personalTraining").value);
    const transportation = parseFloat(document.getElementById("transportation").value);
    const parking = parseFloat(document.getElementById("parking").value);
    const gymExtras = parseFloat(document.getElementById("gymExtras").value);
    const timeValue = parseFloat(document.getElementById("timeValue").value);
    const homeGymLevel = document.getElementById("homeGymLevel").value;
    const customEquipmentCost = parseFloat(document.getElementById("customEquipmentCost").value) || 0;
    const homeSetupCost = parseFloat(document.getElementById("homeSetupCost").value);
    const maintenanceCost = parseFloat(document.getElementById("maintenanceCost").value) / 100;
    const workoutFrequency = parseInt(document.getElementById("workoutFrequency").value);
    const commutTime = parseFloat(document.getElementById("commutTime").value);
    const analysisYears = parseInt(document.getElementById("analysisYears").value);
    const householdMembers = parseInt(document.getElementById("householdMembers").value);

    // Calculate home gym equipment cost
    let equipmentCost;
    if (homeGymLevel === "custom") {
      equipmentCost = customEquipmentCost;
      
      // Add category costs if selected
      const categories = ['cardioEquipment', 'strengthEquipment', 'functionalEquipment', 'accessoryEquipment'];
      categories.forEach(category => {
        if (document.getElementById(category).checked) {
          equipmentCost += categoryEquipment[category].cost;
        }
      });
    } else {
      equipmentCost = equipmentCosts[homeGymLevel].cost;
    }

    // Calculate gym costs over time
    const gymCosts = calculateGymCosts(
      gymMembership, initiationFee, annualFee, personalTraining,
      transportation, parking, gymExtras, analysisYears, householdMembers
    );

    // Calculate home gym costs over time
    const homeGymCosts = calculateHomeGymCosts(
      equipmentCost, homeSetupCost, maintenanceCost, analysisYears
    );

    // Calculate time value
    const timeValueCalculation = calculateTimeValue(
      workoutFrequency, commutTime, timeValue, analysisYears
    );

    // Generate cost comparison timeline
    const timeline = generateCostTimeline(gymCosts, homeGymCosts, analysisYears);
    
    // Calculate break-even point
    const breakEvenPoint = calculateBreakEven(timeline);

    // Calculate savings metrics
    const savingsAnalysis = calculateSavingsAnalysis(gymCosts, homeGymCosts, timeValueCalculation);

    // Display results
    displayResults({
      gymCosts,
      homeGymCosts,
      timeValueCalculation,
      timeline,
      breakEvenPoint,
      savingsAnalysis,
      equipmentCost,
      homeGymLevel,
      analysisYears,
      householdMembers,
      workoutFrequency
    });

    // Show cost comparison chart
    showCostChart(timeline);
  });

  function calculateGymCosts(membership, initiation, annual, training, transport, parking, extras, years, members) {
    const monthlyCosts = (membership + training + transport + parking + extras) * members;
    const totalCosts = [];
    let cumulativeCost = initiation * members; // One-time initiation fee

    for (let year = 1; year <= years; year++) {
      const yearCost = (monthlyCosts * 12) + (annual * members);
      cumulativeCost += yearCost;
      totalCosts.push({
        year: year,
        annualCost: yearCost,
        cumulativeCost: cumulativeCost
      });
    }

    return {
      monthlyTotal: monthlyCosts,
      yearlyTotal: (monthlyCosts * 12) + (annual * members),
      timeline: totalCosts,
      breakdown: {
        membership: membership * members,
        training: training * members,
        transport: transport * members,
        parking: parking * members,
        extras: extras * members
      }
    };
  }

  function calculateHomeGymCosts(equipment, setup, maintenance, years) {
    const initialCost = equipment + setup;
    const totalCosts = [];
    let cumulativeCost = initialCost;

    for (let year = 1; year <= years; year++) {
      const maintenanceCost = equipment * maintenance; // Annual maintenance
      cumulativeCost += maintenanceCost;
      totalCosts.push({
        year: year,
        annualCost: year === 1 ? initialCost + maintenanceCost : maintenanceCost,
        cumulativeCost: cumulativeCost
      });
    }

    return {
      initialCost: initialCost,
      annualMaintenance: equipment * maintenance,
      timeline: totalCosts,
      breakdown: {
        equipment: equipment,
        setup: setup,
        maintenance: equipment * maintenance
      }
    };
  }

  function calculateTimeValue(frequency, commutTime, hourlyValue, years) {
    const weeklyTimeHours = (frequency * commutTime) / 60; // Convert minutes to hours
    const annualTimeHours = weeklyTimeHours * 52;
    const annualTimeValue = annualTimeHours * hourlyValue;
    const totalTimeValue = annualTimeValue * years;

    return {
      weeklyHours: weeklyTimeHours,
      annualHours: annualTimeHours,
      annualValue: annualTimeValue,
      totalValue: totalTimeValue
    };
  }

  function generateCostTimeline(gymCosts, homeGymCosts, years) {
    const timeline = [];
    
    for (let year = 1; year <= years; year++) {
      const gymTotal = gymCosts.timeline[year - 1].cumulativeCost;
      const homeGymTotal = homeGymCosts.timeline[year - 1].cumulativeCost;
      
      timeline.push({
        year: year,
        gymCost: gymTotal,
        homeGymCost: homeGymTotal,
        savings: gymTotal - homeGymTotal
      });
    }
    
    return timeline;
  }

  function calculateBreakEven(timeline) {
    for (let i = 0; i < timeline.length; i++) {
      if (timeline[i].savings >= 0) {
        if (i === 0) {
          return { year: 1, months: 0 };
        }
        
        // Interpolate to find month within the year
        const prevSavings = timeline[i - 1].savings;
        const currentSavings = timeline[i].savings;
        const monthlyChange = (currentSavings - prevSavings) / 12;
        const monthsToBreakEven = Math.round(-prevSavings / monthlyChange);
        
        return { 
          year: i, 
          months: monthsToBreakEven,
          description: `${i} years, ${monthsToBreakEven} months`
        };
      }
    }
    
    return { 
      year: timeline.length + 1, 
      months: 0,
      description: `Beyond ${timeline.length} years`
    };
  }

  function calculateSavingsAnalysis(gymCosts, homeGymCosts, timeValue) {
    const totalGymCost = gymCosts.timeline[gymCosts.timeline.length - 1].cumulativeCost;
    const totalHomeGymCost = homeGymCosts.timeline[homeGymCosts.timeline.length - 1].cumulativeCost;
    const totalSavings = totalGymCost - totalHomeGymCost;
    const totalWithTimeValue = totalSavings + timeValue.totalValue;
    
    return {
      totalSavings: totalSavings,
      savingsWithTime: totalWithTimeValue,
      percentSaved: (totalSavings / totalGymCost) * 100,
      recommendation: getRecommendation(totalSavings, totalWithTimeValue)
    };
  }

  function getRecommendation(savings, savingsWithTime) {
    if (savingsWithTime > 2000) {
      return {
        choice: "Home Gym",
        class: "success",
        reason: "Significant cost savings and time value make home gym the clear winner"
      };
    } else if (savingsWithTime > 500) {
      return {
        choice: "Home Gym", 
        class: "success",
        reason: "Moderate savings favor home gym, especially considering convenience"
      };
    } else if (savingsWithTime > -500) {
      return {
        choice: "Either Option",
        class: "warning", 
        reason: "Costs are similar - choose based on personal preferences and lifestyle"
      };
    } else {
      return {
        choice: "Gym Membership",
        class: "warning",
        reason: "Gym membership may be more cost-effective for your usage pattern"
      };
    }
  }

  function displayResults(data) {
    const resultBlock = document.getElementById("gym-cost-result");
    const equipment = equipmentCosts[data.homeGymLevel] || { equipment: ["Custom equipment selection"] };
    
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${data.savingsAnalysis.recommendation.class}">
          <h6>🏆 Recommendation</h6>
          <div class="big-number">${data.savingsAnalysis.recommendation.choice}</div>
          <p class="insight-detail">Best overall value</p>
        </div>
        <div class="insight-card ${data.savingsAnalysis.totalSavings > 0 ? 'success' : 'warning'}">
          <h6>💰 Total Savings</h6>
          <div class="big-number">$${Math.abs(data.savingsAnalysis.totalSavings).toLocaleString()}</div>
          <p class="insight-detail">${data.savingsAnalysis.totalSavings > 0 ? 'Home gym saves' : 'Gym membership saves'}</p>
        </div>
        <div class="insight-card info">
          <h6>⏱️ Break-even Point</h6>
          <div class="big-number">${data.breakEvenPoint.year}.${data.breakEvenPoint.months}</div>
          <p class="insight-detail">years for home gym</p>
        </div>
        <div class="insight-card success">
          <h6>⚡ Time Value</h6>
          <div class="big-number">$${data.timeValueCalculation.totalValue.toLocaleString()}</div>
          <p class="insight-detail">${data.analysisYears}-year time savings</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">💡 Cost Comparison Analysis</h4>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: ${data.savingsAnalysis.recommendation.class === 'success' ? '#e8f8e8' : '#fff8e1'}; border-radius: 8px; border: 2px solid ${data.savingsAnalysis.recommendation.class === 'success' ? '#28a745' : '#ffc107'};">
          <p style="margin: 0;"><strong>💭 ${data.savingsAnalysis.recommendation.choice}:</strong> ${data.savingsAnalysis.recommendation.reason}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <h5>🏋️ Gym Membership Costs (${data.analysisYears} years)</h5>
            <p><strong>Monthly Total:</strong> $${data.gymCosts.monthlyTotal.toFixed(2)}</p>
            <p><strong>Annual Total:</strong> $${data.gymCosts.yearlyTotal.toLocaleString()}</p>
            <p><strong>${data.analysisYears}-Year Total:</strong> $${data.gymCosts.timeline[data.analysisYears - 1].cumulativeCost.toLocaleString()}</p>
            <div style="margin-top: 1rem;">
              <h6>Monthly Breakdown:</h6>
              <p>Membership: $${data.gymCosts.breakdown.membership.toFixed(2)}</p>
              <p>Training: $${data.gymCosts.breakdown.training.toFixed(2)}</p>
              <p>Transport: $${data.gymCosts.breakdown.transport.toFixed(2)}</p>
              <p>Extras: $${data.gymCosts.breakdown.extras.toFixed(2)}</p>
            </div>
          </div>
          
          <div>
            <h5>🏠 Home Gym Costs (${data.analysisYears} years)</h5>
            <p><strong>Initial Investment:</strong> $${data.homeGymCosts.initialCost.toLocaleString()}</p>
            <p><strong>Annual Maintenance:</strong> $${data.homeGymCosts.annualMaintenance.toFixed(0)}</p>
            <p><strong>${data.analysisYears}-Year Total:</strong> $${data.homeGymCosts.timeline[data.analysisYears - 1].cumulativeCost.toLocaleString()}</p>
            <div style="margin-top: 1rem;">
              <h6>Cost Breakdown:</h6>
              <p>Equipment: $${data.homeGymCosts.breakdown.equipment.toLocaleString()}</p>
              <p>Setup: $${data.homeGymCosts.breakdown.setup.toLocaleString()}</p>
              <p>Maintenance (annual): $${data.homeGymCosts.breakdown.maintenance.toFixed(0)}</p>
            </div>
          </div>
          
          <div>
            <h5>⏰ Time Value Analysis</h5>
            <p><strong>Weekly Time Saved:</strong> ${data.timeValueCalculation.weeklyHours.toFixed(1)} hours</p>
            <p><strong>Annual Time Saved:</strong> ${data.timeValueCalculation.annualHours.toFixed(0)} hours</p>
            <p><strong>Annual Value:</strong> $${data.timeValueCalculation.annualValue.toLocaleString()}</p>
            <p><strong>${data.analysisYears}-Year Value:</strong> $${data.timeValueCalculation.totalValue.toLocaleString()}</p>
          </div>
        </div>

        ${data.homeGymLevel !== "custom" ? `
          <h5>🛠️ ${data.homeGymLevel.charAt(0).toUpperCase() + data.homeGymLevel.slice(1)} Home Gym Equipment</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${equipment.equipment.map(item => `
              <div style="padding: 0.75rem; background: white; border-radius: 8px; border-left: 4px solid #4caf50;">
                <p style="margin: 0; font-weight: 500;">✓ ${item}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <h5>📊 Year-by-Year Comparison</h5>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
            <thead>
              <tr style="background: var(--accent); color: white;">
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Year</th>
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Gym Total</th>
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Home Gym Total</th>
                <th style="padding: 0.75rem; border: 1px solid #ddd;">Savings</th>
              </tr>
            </thead>
            <tbody>
              ${data.timeline.map(year => `
                <tr style="background: ${year.year % 2 === 0 ? '#f8f9fa' : 'white'};">
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;">${year.year}</td>
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: right;">$${year.gymCost.toLocaleString()}</td>
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: right;">$${year.homeGymCost.toLocaleString()}</td>
                  <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: right; color: ${year.savings >= 0 ? '#28a745' : '#dc3545'};">
                    ${year.savings >= 0 ? '+' : ''}$${year.savings.toLocaleString()}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 2rem;">
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <h6 style="margin-top: 0; color: #1976d2;">🏋️ Gym Benefits</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Wide variety of equipment</li>
              <li>Professional maintenance</li>
              <li>Social environment</li>
              <li>Classes and programs</li>
              <li>No space requirements</li>
            </ul>
          </div>
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border: 2px solid #28a745;">
            <h6 style="margin-top: 0; color: #28a745;">🏠 Home Gym Benefits</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>24/7 availability</li>
              <li>No commute time</li>
              <li>Privacy and comfort</li>
              <li>Family accessibility</li>
              <li>Long-term cost savings</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function showCostChart(timeline) {
    const chartBlock = document.getElementById("gym-cost-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("gym-cost-chart").getContext("2d");
      if (window.gymCostChart) window.gymCostChart.destroy();

      const years = timeline.map(t => `Year ${t.year}`);
      const gymCosts = timeline.map(t => t.gymCost);
      const homeGymCosts = timeline.map(t => t.homeGymCost);

      window.gymCostChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [{
            label: "Gym Membership Total Cost",
            data: gymCosts,
            borderColor: "#f44336",
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            fill: false,
            tension: 0.1
          }, {
            label: "Home Gym Total Cost", 
            data: homeGymCosts,
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            fill: false,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Cumulative Cost Comparison Over Time'
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
                text: 'Total Cost ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Years'
              }
            }
          },
          elements: {
            point: {
              radius: 4,
              hoverRadius: 8
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